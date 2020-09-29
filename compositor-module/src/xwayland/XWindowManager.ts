import {
  Atom,
  chars,
  ColormapAlloc,
  EventMask,
  getComposite,
  getRender,
  getXFixes,
  PropMode,
  SCREEN,
  Time,
  Window,
  WINDOW,
  WindowClass,
  XConnection
} from 'xtsb'
import { Composite, Redirect } from 'xtsb/dist/types/xcbComposite'
import { PICTFORMINFO, PictType, Render } from 'xtsb/dist/types/xcbRender'
import { XFixes } from 'xtsb/dist/types/xcbXFixes'
import { XWaylandConnection } from './XWaylandConnection'

type NamedAtom = [
  name: string,
  value: number
]

type XWMAtoms = {
  WM_PROTOCOLS: number
  WM_NORMAL_HINTS: number
  WM_TAKE_FOCUS: number
  WM_DELETE_WINDOW: number
  WM_STATE: number
  WM_S0: number
  WM_CLIENT_MACHINE: number
  _NET_WM_CM_S0: number
  _NET_WM_NAME: number
  _NET_WM_PID: number
  _NET_WM_ICON: number
  _NET_WM_STATE: number
  _NET_WM_STATE_MAXIMIZED_VERT: number
  _NET_WM_STATE_MAXIMIZED_HORZ: number
  _NET_WM_STATE_FULLSCREEN: number
  _NET_WM_USER_TIME: number
  _NET_WM_ICON_NAME: number
  _NET_WM_DESKTOP: number
  _NET_WM_WINDOW_TYPE: number

  _NET_WM_WINDOW_TYPE_DESKTOP: number
  _NET_WM_WINDOW_TYPE_DOCK: number
  _NET_WM_WINDOW_TYPE_TOOLBAR: number
  _NET_WM_WINDOW_TYPE_MENU: number
  _NET_WM_WINDOW_TYPE_UTILITY: number
  _NET_WM_WINDOW_TYPE_SPLASH: number
  _NET_WM_WINDOW_TYPE_DIALOG: number
  _NET_WM_WINDOW_TYPE_DROPDOWN_MENU: number
  _NET_WM_WINDOW_TYPE_POPUP_MENU: number
  _NET_WM_WINDOW_TYPE_TOOLTIP: number
  _NET_WM_WINDOW_TYPE_NOTIFICATION: number
  _NET_WM_WINDOW_TYPE_COMBO: number
  _NET_WM_WINDOW_TYPE_DND: number
  _NET_WM_WINDOW_TYPE_NORMAL: number

  _NET_WM_MOVERESIZE: number
  _NET_SUPPORTING_WM_CHECK: number
  _NET_SUPPORTED: number
  _NET_ACTIVE_WINDOW: number
  _MOTIF_WM_HINTS: number
  CLIPBOARD: number
  CLIPBOARD_MANAGER: number
  TARGETS: number
  UTF8_STRING: number
  _WL_SELECTION: number
  INCR: number
  TIMESTAMP: number
  MULTIPLE: number
  COMPOUND_TEXT: number
  TEXT: number
  STRING: number
  WINDOW: number
  'text/plain;charset=utf-8': number
  'text/plain': number
  XdndSelection: number
  XdndAware: number
  XdndEnter: number
  XdndLeave: number
  XdndDrop: number
  XdndStatus: number
  XdndFinished: number
  XdndTypeList: number
  XdndActionCopy: number
  _XWAYLAND_ALLOW_COMMITS: number
  WL_SURFACE_ID: number
}

interface XWindowManagerResources {
  xFixes: XFixes,
  composite: Composite,
  render: Render,
  xwmAtoms: XWMAtoms,
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

  const atoms: NamedAtom[] = [
    ['WM_PROTOCOLS', 0],
    ['WM_NORMAL_HINTS', 0],
    ['WM_TAKE_FOCUS', 0],
    ['WM_DELETE_WINDOW', 0],
    ['WM_STATE', 0],
    ['WM_S0', 0],
    ['WM_CLIENT_MACHINE', 0],
    ['_NET_WM_CM_S0', 0],
    ['_NET_WM_NAME', 0],
    ['_NET_WM_PID', 0],
    ['_NET_WM_ICON', 0],
    ['_NET_WM_STATE', 0],
    ['_NET_WM_STATE_MAXIMIZED_VERT', 0],
    ['_NET_WM_STATE_MAXIMIZED_HORZ', 0],
    ['_NET_WM_STATE_FULLSCREEN', 0],
    ['_NET_WM_USER_TIME', 0],
    ['_NET_WM_ICON_NAME', 0],
    ['_NET_WM_DESKTOP', 0],
    ['_NET_WM_WINDOW_TYPE', 0],

    ['_NET_WM_WINDOW_TYPE_DESKTOP', 0],
    ['_NET_WM_WINDOW_TYPE_DOCK', 0],
    ['_NET_WM_WINDOW_TYPE_TOOLBAR', 0],
    ['_NET_WM_WINDOW_TYPE_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_UTILITY', 0],
    ['_NET_WM_WINDOW_TYPE_SPLASH', 0],
    ['_NET_WM_WINDOW_TYPE_DIALOG', 0],
    ['_NET_WM_WINDOW_TYPE_DROPDOWN_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_POPUP_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_TOOLTIP', 0],
    ['_NET_WM_WINDOW_TYPE_NOTIFICATION', 0],
    ['_NET_WM_WINDOW_TYPE_COMBO', 0],
    ['_NET_WM_WINDOW_TYPE_DND', 0],
    ['_NET_WM_WINDOW_TYPE_NORMAL', 0],

    ['_NET_WM_MOVERESIZE', 0],
    ['_NET_SUPPORTING_WM_CHECK', 0],
    ['_NET_SUPPORTED', 0],
    ['_NET_ACTIVE_WINDOW', 0],
    ['_MOTIF_WM_HINTS', 0],
    ['CLIPBOARD', 0],
    ['CLIPBOARD_MANAGER', 0],
    ['TARGETS', 0],
    ['UTF8_STRING', 0],
    ['_WL_SELECTION', 0],
    ['INCR', 0],
    ['TIMESTAMP', 0],
    ['MULTIPLE', 0],
    ['COMPOUND_TEXT', 0],
    ['TEXT', 0],
    ['STRING', 0],
    ['WINDOW', 0],
    ['text/plain;charset=utf-8', 0],
    ['text/plain', 0],
    ['XdndSelection', 0],
    ['XdndAware', 0],
    ['XdndEnter', 0],
    ['XdndLeave', 0],
    ['XdndDrop', 0],
    ['XdndStatus', 0],
    ['XdndFinished', 0],
    ['XdndTypeList', 0],
    ['XdndActionCopy', 0],
    ['_XWAYLAND_ALLOW_COMMITS', 0],
    ['WL_SURFACE_ID', 0]
  ]

  const [xFixes, composite, render] = await Promise.all([xFixesPromise, compositePromise, renderPromise])
  const formatsReply = render.queryPictFormats()
  const interAtomCookies = atoms.map(([name]) => xConnection.internAtom(0, chars(name)))

  const atomReplies = await Promise.all(interAtomCookies)
  atomReplies.forEach(({ atom }, index) => atoms[index][1] = atom)

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

  const xwmAtoms: XWMAtoms = Object.fromEntries(atoms) as XWMAtoms

  return {
    xFixes,
    composite,
    render,
    xwmAtoms,
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

function selectionInit() {
  //TODO see weston's selection.c file
}

function dndInit() {
  // TODO see weston's dnd.c
}

function createCursor() {
  // TODO see weston's window-manager.c
}

function setNetActiveWindow(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms, window: WINDOW) {
  xConnection.changeProperty(PropMode.Replace, screen.root, xwmAtoms._NET_ACTIVE_WINDOW, xwmAtoms.WINDOW, 32, new Uint32Array([window]))
}

function createWMWindow(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  const wmWindow = xConnection.allocateID()
  xConnection.createWindow(
    WindowClass.CopyFromParent,
    wmWindow,
    screen.root,
    0,
    0,
    10,
    10,
    0,
    WindowClass.InputOutput,
    screen.rootVisual,
    {}
  )

  xConnection.changeProperty(
    PropMode.Replace,
    wmWindow,
    xwmAtoms._NET_SUPPORTING_WM_CHECK,
    Atom.WINDOW,
    32,
    new Uint32Array([wmWindow])
  )

  xConnection.changeProperty(
    PropMode.Replace,
    wmWindow,
    xwmAtoms._NET_WM_NAME,
    xwmAtoms.UTF8_STRING,
    8,
    chars('Greenfield WM')
  )

  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_SUPPORTING_WM_CHECK,
    Atom.WINDOW,
    32,
    new Uint32Array([wmWindow])
  )

  xConnection.setSelectionOwner(wmWindow, xwmAtoms.WM_S0, Time.CurrentTime)
  xConnection.setSelectionOwner(wmWindow, xwmAtoms._NET_WM_CM_S0, Time.CurrentTime)

  return wmWindow
}

export class XWindowManager {
  static async create(xWaylandConnetion: XWaylandConnection) {
    const xConnection = await xWaylandConnetion.setup()
    const xWmResources = await setupResources(xConnection)
    const visualAndColormap = setupVisualAndColormap(xConnection)

    xConnection.changeWindowAttributes(xConnection.setup.roots[0].root, { eventMask: EventMask.SubstructureNotify | EventMask.SubstructureRedirect | EventMask.PropertyChange })
    const { composite, xwmAtoms } = xWmResources
    composite.redirectSubwindows(xConnection.setup.roots[0].root, Redirect.Manual)

    //An immediately invoked lambda that uses function argument destructuring to filter out elements and return them as an array.
    const supported = (({
                          _NET_WM_MOVERESIZE,
                          _NET_WM_STATE,
                          _NET_WM_STATE_FULLSCREEN,
                          _NET_WM_STATE_MAXIMIZED_VERT,
                          _NET_WM_STATE_MAXIMIZED_HORZ,
                          _NET_ACTIVE_WINDOW
                        }: XWMAtoms) =>
      ([
        _NET_WM_MOVERESIZE,
        _NET_WM_STATE,
        _NET_WM_STATE_FULLSCREEN,
        _NET_WM_STATE_MAXIMIZED_VERT,
        _NET_WM_STATE_MAXIMIZED_HORZ,
        _NET_ACTIVE_WINDOW
      ]))(xwmAtoms)

    xConnection.changeProperty(PropMode.Replace, xConnection.setup.roots[0].root, xwmAtoms._NET_SUPPORTED, Atom.ATOM, 32, new Uint32Array(supported))

    setNetActiveWindow(xConnection, xConnection.setup.roots[0], xwmAtoms, Window.None)

    // TODO
    selectionInit()
    // TODO
    dndInit()
    // TODO
    createCursor()

    const wmWindow = createWMWindow(xConnection, xConnection.setup.roots[0], xwmAtoms)

    return new XWindowManager(xConnection, xConnection.setup.roots[0], xWmResources, visualAndColormap, wmWindow)
  }

  private readonly xConnection: XConnection
  private readonly xwmAtoms: XWMAtoms
  private readonly composite: Composite
  private readonly render: Render
  private readonly xFixes: XFixes
  private readonly formatRgb: PICTFORMINFO
  private readonly formatRgba: PICTFORMINFO
  private readonly visualId: number
  private readonly colormap: number
  private readonly screen: SCREEN
  private readonly wmWindow: WINDOW

  constructor(
    xConnection: XConnection,
    screen: SCREEN,
    { xwmAtoms, composite, render, xFixes, formatRgb, formatRgba }: XWindowManagerResources,
    { visualId, colormap }: VisualAndColormap,
    wmWindow: WINDOW
  ) {
    this.xConnection = xConnection
    this.xwmAtoms = xwmAtoms
    this.composite = composite
    this.render = render
    this.xFixes = xFixes
    this.formatRgb = formatRgb
    this.formatRgba = formatRgba
    this.visualId = visualId
    this.colormap = colormap

    this.screen = screen
    this.wmWindow = wmWindow
  }
}
