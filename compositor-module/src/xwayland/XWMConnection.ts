import { connect, XConnection, webConnectionSetup } from 'xtsb'
import RemoteSocket from '../RemoteSocket'

const xwmConnections: { [key: string]: XWMConnection } = {}

export async function ensureXWMConnection(appEndpointURL: URL, remoteSocket: RemoteSocket, compositorSessionId: string) {
  const xwmEndpointURL = new URL(appEndpointURL.origin)
  xwmEndpointURL.searchParams.append('compositorSessionId', compositorSessionId)
  xwmEndpointURL.searchParams.append('xwayland', 'connection')

  const xwmEndpointUrlHref = xwmEndpointURL.href
  if (xwmConnections[xwmEndpointUrlHref] === undefined) {
    const webSocket = new WebSocket(xwmEndpointUrlHref)

    const xServerWaylandConnectionRequest = new Promise<void>(resolve => {
      webSocket.onmessage = ev => {
        // TODO validate data
        const { args: { clientId } } = JSON.parse(ev.data)
        const webSocketURL = new URL(webSocket.url)
        webSocketURL.searchParams.delete('xwayland')
        webSocketURL.searchParams.append('clientId', `${clientId}`)

        const newWebSocket = new WebSocket(webSocketURL.href)
        remoteSocket.onWebSocket(newWebSocket)
        resolve()
      }
    })
    const xwmConnection = await XWMConnection.create(webSocket)
    // only resolves once the first X client connects, so we won't await setup() here.
    await xServerWaylandConnectionRequest
    xwmConnection.onDestroy().then(() => delete xwmConnections[xwmEndpointUrlHref])
    await xwmConnection.setup()
    xwmConnections[xwmEndpointUrlHref] = xwmConnection
  }
}

export class XWMConnection {
  static create(webSocket: WebSocket): Promise<XWMConnection> {
    return new Promise<XWMConnection>((resolve, reject) => {
      webSocket.onopen = async _ => {
        webSocket.onerror = ev => console.log(`XWM connection ${webSocket.url} error: ${ev}`)
        const xwm = new XWMConnection(webSocket)
        webSocket.onclose = _ => xwm.destroy()
        resolve(xwm)
      }
      webSocket.onerror = ev => {
        if (webSocket.readyState === WebSocket.CONNECTING) {
          reject(new Error(`XWM connection ${webSocket.url} failed: ${ev}`))
        }
      }
    })
  }

  // @ts-ignore assigned in constructor in promise cb
  private destroyResolve: (value?: (PromiseLike<void> | void)) => void
  private readonly destroyPromise: Promise<void>

  // @ts-ignore assigned in constructor in promise cb
  private setupResolve: (value?: (PromiseLike<void> | void)) => void
  private readonly setupPromise: Promise<void>

  xConnection?: XConnection
  readonly webSocket: WebSocket

  constructor(webSocket: WebSocket) {
    this.webSocket = webSocket
    this.destroyPromise = new Promise<void>(resolve => this.destroyResolve = resolve)
    this.setupPromise = new Promise<void>(resolve => this.setupResolve = resolve)
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }

  setup(): Promise<void> {
    connect(webConnectionSetup(this.webSocket))
      .then(xConnection => this.xConnection = xConnection)
      .then(() => this.setupResolve())
    return this.setupPromise
  }
}
