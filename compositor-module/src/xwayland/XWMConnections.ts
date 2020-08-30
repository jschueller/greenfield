const xwmConnections: { [key: string]: XWM } = {}

async function ensureXWMConnection(appEndpointURL: URL) {
  const xwmEndpointURL = new URL(appEndpointURL.origin)
  xwmEndpointURL.searchParams.append('xwayland', 'connect')

  const xwmEndpointUrlHref = xwmEndpointURL.href
  if (xwmConnections[xwmEndpointUrlHref] === undefined) {
    const webSocket = new WebSocket(xwmEndpointUrlHref)

    const xwm = await XWM.create(webSocket)
    xwm.onDestroy().then(() => delete xwmConnections[xwmEndpointUrlHref])
    xwmConnections[xwmEndpointUrlHref] = xwm
  }
}
