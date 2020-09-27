import { chars, ColormapAlloc, getComposite, getRender, getXFixes, XConnection } from 'xtsb'
import { Composite } from 'xtsb/dist/types/xcbComposite'
import { PICTFORMINFO, PictType, Render } from 'xtsb/dist/types/xcbRender'
import { XFixes } from 'xtsb/dist/types/xcbXFixes'
import { XWaylandConnection } from './XWaylandConnection'

interface Atom {
  name: string,
  value: number
}

interface XWindowManagerResources {
  xFixes: XFixes,
  composite: Composite,
  render: Render,
  atoms: Atom[],
  formatRgb: PICTFORMINFO,
  formatRgba: PICTFORMINFO
}

interface VisualAndColormap {
  visualId: number,
  colormap: number
}

async function setupResources(xConnection: XConnection): Promise<XWindowManagerResources> {
  const xFixesPromise = getXFixes(xConnection)
  const compositePromise = getComposite(xConnection)
  const renderPromise = getRender(xConnection)

  const atoms: Atom[] = [
    { name: 'WM_PROTOCOLS', value: 0 },
    { name: 'WM_NORMAL_HINTS', value: 0 },
    { name: 'WM_TAKE_FOCUS', value: 0 },
    { name: 'WM_DELETE_WINDOW', value: 0 },
    { name: 'WM_STATE', value: 0 },
    { name: 'WM_S0', value: 0 },
    { name: 'WM_CLIENT_MACHINE', value: 0 },
    { name: '_NET_WM_CM_S0', value: 0 },
    { name: '_NET_WM_NAME', value: 0 },
    { name: '_NET_WM_PID', value: 0 },
    { name: '_NET_WM_ICON', value: 0 },
    { name: '_NET_WM_STATE', value: 0 },
    { name: '_NET_WM_STATE_MAXIMIZED_VERT', value: 0 },
    { name: '_NET_WM_STATE_MAXIMIZED_HORZ', value: 0 },
    { name: '_NET_WM_STATE_FULLSCREEN', value: 0 },
    { name: '_NET_WM_USER_TIME', value: 0 },
    { name: '_NET_WM_ICON_NAME', value: 0 },
    { name: '_NET_WM_DESKTOP', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE', value: 0 },

    { name: '_NET_WM_WINDOW_TYPE_DESKTOP', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_DOCK', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_TOOLBAR', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_MENU', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_UTILITY', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_SPLASH', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_DIALOG', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_DROPDOWN_MENU', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_POPUP_MENU', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_TOOLTIP', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_NOTIFICATION', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_COMBO', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_DND', value: 0 },
    { name: '_NET_WM_WINDOW_TYPE_NORMAL', value: 0 },

    { name: '_NET_WM_MOVERESIZE', value: 0 },
    { name: '_NET_SUPPORTING_WM_CHECK', value: 0 },
    { name: '_NET_SUPPORTED', value: 0 },
    { name: '_NET_ACTIVE_WINDOW', value: 0 },
    { name: '_MOTIF_WM_HINTS', value: 0 },
    { name: 'CLIPBOARD', value: 0 },
    { name: 'CLIPBOARD_MANAGER', value: 0 },
    { name: 'TARGETS', value: 0 },
    { name: 'UTF8_STRING', value: 0 },
    { name: '_WL_SELECTION', value: 0 },
    { name: 'INCR', value: 0 },
    { name: 'TIMESTAMP', value: 0 },
    { name: 'MULTIPLE', value: 0 },
    { name: 'COMPOUND_TEXT', value: 0 },
    { name: 'TEXT', value: 0 },
    { name: 'STRING', value: 0 },
    { name: 'WINDOW', value: 0 },
    { name: 'text/plain;charset=utf-8', value: 0 },
    { name: 'text/plain', value: 0 },
    { name: 'XdndSelection', value: 0 },
    { name: 'XdndAware', value: 0 },
    { name: 'XdndEnter', value: 0 },
    { name: 'XdndLeave', value: 0 },
    { name: 'XdndDrop', value: 0 },
    { name: 'XdndStatus', value: 0 },
    { name: 'XdndFinished', value: 0 },
    { name: 'XdndTypeList', value: 0 },
    { name: 'XdndActionCopy', value: 0 },
    { name: '_XWAYLAND_ALLOW_COMMITS', value: 0 },
    { name: 'WL_SURFACE_ID', value: 0 }
  ]

  const [xFixes, composite, render] = await Promise.all([xFixesPromise, compositePromise, renderPromise])
  const formatsReply = render.queryPictFormats()
  const interAtomCookies = atoms.map(atom => xConnection.internAtom(0, chars(atom.name)))

  const atomReplies = await Promise.all(interAtomCookies)
  atomReplies.forEach(({ atom }, index) => atoms[index].value = atom)

  const { formats } = await formatsReply
  let formatRgb: PICTFORMINFO | undefined = undefined
  let formatRgba: PICTFORMINFO | undefined = undefined
  formats.forEach(format => {
    if (format.direct.redMask != 0xff &&
      format.direct.redShift != 16) {
      return
    }
    if (format._type == PictType.Direct &&
      format.depth == 24) {
      formatRgb = format
    }
    if (format._type == PictType.Direct &&
      format.depth == 32 &&
      format.direct.alphaMask == 0xff &&
      format.direct.alphaShift == 24) {
      formatRgba = format
    }
  })

  if (formatRgb === undefined) {
    throw new Error('no direct RGB picture format found.')
  }
  if (formatRgba === undefined) {
    throw new Error('no direct RGBA picture format found.')
  }

  return {
    xFixes,
    composite,
    render,
    atoms,
    formatRgb,
    formatRgba
  }
}

function setupVisualAndColormap(xConnection: XConnection): VisualAndColormap {
  const visuals = xConnection.setup.roots.map(screen => {
    const depth = screen.allowedDepths.find(depth => depth.depth === 32)
    return depth?.visuals
  })?.[0]

  if (visuals === undefined) {
    throw new Error('no 32 bit visualtype\n')
  }
  const visualId = visuals[0].visualId

  const colormap = xConnection.allocateID()
  xConnection.createColormap(ColormapAlloc.None, colormap, xConnection.setup.roots[0].root, visualId)

  return {
    visualId,
    colormap
  }
}

export class XWindowManager {
  static async create(xWaylandConnetion: XWaylandConnection) {
    const xConnection = await xWaylandConnetion.setup()
    const xWmResources = await setupResources(xConnection)
    const visualAndColormap = setupVisualAndColormap(xConnection)

    // TODO more setup

    return new XWindowManager(xConnection, xWmResources, visualAndColormap)
  }

  private readonly xConnection: XConnection
  private readonly atoms: Atom[]
  private readonly composite: Composite
  private readonly render: Render
  private readonly xFixes: XFixes
  private readonly formatRgb: PICTFORMINFO
  private readonly formatRgba: PICTFORMINFO
  private readonly visualId: number
  private readonly colormap: number

  constructor(
    xConnection: XConnection,
    { atoms, composite, render, xFixes, formatRgb, formatRgba }: XWindowManagerResources,
    { visualId, colormap }: VisualAndColormap
  ) {
    this.xConnection = xConnection
    this.atoms = atoms
    this.composite = composite
    this.render = render
    this.xFixes = xFixes
    this.formatRgb = formatRgb
    this.formatRgba = formatRgba
    this.visualId = visualId
    this.colormap = colormap
  }
}
