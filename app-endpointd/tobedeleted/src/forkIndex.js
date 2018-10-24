#!/usr/bin/env node

'use strict'

const ShimCompositorSession = require('./ShimCompositorSession')
const DesktopShellAppsController = require('./DesktopShellAppsController')

const controllers = {
  'apps': DesktopShellAppsController
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error, error.stack)
  })

  // TODO we probably want to differentiate actions based on the path elements, including setting up a new session.
  // FIXME define path for creating a new session instead of using an empty path
  process.once('message', async (request, socket) => {
    const shimSessionPromise = ShimCompositorSession.create(request[0], socket, request[1])

    process.on('message', async (request, socket) => {
      const pathElements = request[0].pathElements
      const shimSession = await shimSessionPromise
      // handle other non-session websocket connections
      const controllerId = pathElements.shift()
      if (controllerId) {
        const controller = controllers[controllerId]
        if (controller) {
          controller.create(request[0], socket, pathElements, shimSession)
        }
      }
    })

    const shimSession = await shimSessionPromise

    const cleanUp = () => {
      shimSession.end('shim-compositor closed.')
      process.exit(0)
    }

    process.on('SIGINT', cleanUp)
    process.on('SIGTERM', cleanUp)
    process.on('SIGBREAK', cleanUp)
    process.on('SIGHUP', cleanUp)

    shimSession.localCompositorSession.onTerminate = () => {
      console.log(`Child ${process.pid} will exit.`)
      process.exit(0)
    }

    shimSession.start()
  })
}

main()