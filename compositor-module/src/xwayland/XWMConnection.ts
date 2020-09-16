import { connect, XConnection, webConnectionSetup } from 'xtsb'

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
