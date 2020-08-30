import { connect, webConnectionSetup, XConnection } from 'xtsb'

class XWM {
  static create(webSocket: WebSocket): Promise<XWM> {
    return new Promise<XWM>((resolve, reject) => {
      webSocket.onopen = async ev => {
        webSocket.onerror = ev => console.log(`XWM connection ${webSocket.url} error: ${ev}`)

        const xwm = await XWM.setupXWM(webSocket)
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

  static setupXWM(webSocket: WebSocket): Promise<XWM> {
    return new Promise<XWM>(async resolve => {
      const xConnection = await connect(webConnectionSetup(webSocket))
      resolve(new XWM(xConnection))
    })
  }

  // @ts-ignore assigned in constructor in promise cb
  private destroyResolve: (value?: (PromiseLike<void> | void)) => void
  private readonly destroyPromise: Promise<void>
  private readonly xConnection: XConnection

  constructor(xConnection: XConnection) {
    this.xConnection = xConnection
    this.destroyPromise = new Promise<void>(resolve => this.destroyResolve = resolve)
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }
}
