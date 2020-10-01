import {
  Atom,
  ButtonPressEvent,
  ButtonReleaseEvent,
  chars,
  ClientMessageEvent,
  ColormapAlloc,
  Composite,
  ConfigureNotifyEvent,
  ConfigureRequestEvent,
  CreateNotifyEvent,
  DestroyNotifyEvent,
  EnterNotifyEvent,
  EventMask,
  FocusInEvent,
  getComposite,
  getRender,
  getXFixes,
  LeaveNotifyEvent,
  MapNotifyEvent,
  MapRequestEvent,
  MotionNotifyEvent,
  PropertyNotifyEvent,
  PropMode,
  Render,
  ReparentNotifyEvent,
  SCREEN,
  Time,
  UnmapNotifyEvent,
  Window,
  WINDOW,
  WindowClass,
  XConnection,
  XFixes
} from 'xtsb'
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
  xFixes: XFixes.XFixes,
  composite: Composite.Composite,
  render: Render.Render,
  xwmAtoms: XWMAtoms,
  formatRgb: Render.PICTFORMINFO,
  formatRgba: Render.PICTFORMINFO
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
  let formatRgb: Render.PICTFORMINFO | undefined = undefined
  let formatRgba: Render.PICTFORMINFO | undefined = undefined
  formats.forEach(format => {
    if (format.direct.redMask != 0xff &&
      format.direct.redShift != 16) {
      return
    }
    if (format._type == Render.PictType.Direct &&
      format.depth == 24) {
      formatRgb = format
    }
    if (format._type == Render.PictType.Direct &&
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

async function createWMWindow(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  const wmWindow = xConnection.allocateID()
  await Promise.all([
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
    ).check(),

    xConnection.changeProperty(
      PropMode.Replace,
      wmWindow,
      xwmAtoms._NET_SUPPORTING_WM_CHECK,
      Atom.WINDOW,
      32,
      new Uint32Array([wmWindow])
    ).check(),

    xConnection.changeProperty(
      PropMode.Replace,
      wmWindow,
      xwmAtoms._NET_WM_NAME,
      xwmAtoms.UTF8_STRING,
      8,
      chars('Greenfield WM')
    ).check(),

    xConnection.changeProperty(
      PropMode.Replace,
      screen.root,
      xwmAtoms._NET_SUPPORTING_WM_CHECK,
      Atom.WINDOW,
      32,
      new Uint32Array([wmWindow])
    ).check(),

    xConnection.setSelectionOwner(wmWindow, xwmAtoms.WM_S0, Time.CurrentTime).check(),
    xConnection.setSelectionOwner(wmWindow, xwmAtoms._NET_WM_CM_S0, Time.CurrentTime).check()
  ])

  return wmWindow
}

export class XWindowManager {
  static async create(xWaylandConnetion: XWaylandConnection) {
    const xConnection = await xWaylandConnetion.setup()
    const xWmResources = await setupResources(xConnection)
    const visualAndColormap = setupVisualAndColormap(xConnection)

    xConnection.changeWindowAttributes(xConnection.setup.roots[0].root, { eventMask: EventMask.SubstructureNotify | EventMask.SubstructureRedirect | EventMask.PropertyChange })
    const { composite, xwmAtoms } = xWmResources
    composite.redirectSubwindows(xConnection.setup.roots[0].root, Composite.Redirect.Manual)

    //An immediately invoked lambda that uses function argument destructuring to filter out elements and return them as an array.
    const supported = (({
                          _NET_WM_MOVERESIZE,
                          _NET_WM_STATE,
                          _NET_WM_STATE_FULLSCREEN,
                          _NET_WM_STATE_MAXIMIZED_VERT,
                          _NET_WM_STATE_MAXIMIZED_HORZ,
                          _NET_ACTIVE_WINDOW
                        }: XWMAtoms) => [
      _NET_WM_MOVERESIZE,
      _NET_WM_STATE,
      _NET_WM_STATE_FULLSCREEN,
      _NET_WM_STATE_MAXIMIZED_VERT,
      _NET_WM_STATE_MAXIMIZED_HORZ,
      _NET_ACTIVE_WINDOW
    ])(xwmAtoms)

    xConnection.changeProperty(PropMode.Replace, xConnection.setup.roots[0].root, xwmAtoms._NET_SUPPORTED, Atom.ATOM, 32, new Uint32Array(supported))

    setNetActiveWindow(xConnection, xConnection.setup.roots[0], xwmAtoms, Window.None)

    // TODO
    selectionInit()
    // TODO
    dndInit()
    // TODO
    createCursor()

    const wmWindow = await createWMWindow(xConnection, xConnection.setup.roots[0], xwmAtoms)


    const xWindowManager = new XWindowManager(xConnection, xConnection.setup.roots[0], xWmResources, visualAndColormap, wmWindow)

    // TODO listen for any event here
    // TODO see weston weston_wm_handle_selection_event
    // xConnection.onEvent = xWindowManager.handleSelectionEvent(event)
    // TODO see weston weston_wm_handle_dnd_event
    // xConnection.onEvent = xWindowManager.handleDndEvent(event)


    xConnection.onButtonPressEvent = event => xWindowManager.handleButton(event)
    xConnection.onButtonReleaseEvent = event => xWindowManager.handleButton(event)
    xConnection.onEnterNotifyEvent = event => xWindowManager.handleEnter(event)
    xConnection.onLeaveNotifyEvent = event => xWindowManager.handleLeave(event)
    xConnection.onMotionNotifyEvent = event => xWindowManager.handleMotion(event)
    xConnection.onCreateNotifyEvent = event => xWindowManager.handleCreateNotify(event)
    xConnection.onMapRequestEvent = event => xWindowManager.handleMapRequest(event)
    xConnection.onMapNotifyEvent = event => xWindowManager.handleMapNotify(event)
    xConnection.onUnmapNotifyEvent = event => xWindowManager.handleUnmapNotify(event)
    xConnection.onReparentNotifyEvent = event => xWindowManager.handleReparentNotify(event)
    xConnection.onConfigureRequestEvent = event => xWindowManager.handleConfigureRequest(event)
    xConnection.onConfigureNotifyEvent = event => xWindowManager.handleConfigureNotify(event)
    xConnection.onDestroyNotifyEvent = event => xWindowManager.handleDestroyNotify(event)
    // xConnection.onMappingNotifyEvent = event => console.log(JSON.stringify(event))
    xConnection.onPropertyNotifyEvent = event => xWindowManager.handlePropertyNotify(event)
    xConnection.onClientMessageEvent = event => xWindowManager.handleClientMessage(event)
    xConnection.onFocusInEvent = event => xWindowManager.handleFocusIn(event)

    return xWindowManager
  }

  private readonly xConnection: XConnection
  private readonly xwmAtoms: XWMAtoms
  private readonly composite: Composite.Composite
  private readonly render: Render.Render
  private readonly xFixes: XFixes.XFixes
  private readonly formatRgb: Render.PICTFORMINFO
  private readonly formatRgba: Render.PICTFORMINFO
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

  private handleButton(event: ButtonPressEvent | ButtonReleaseEvent) {
    // TODO
  }

  private handleEnter(event: EnterNotifyEvent) {
// TODO
  }

  private handleLeave(event: LeaveNotifyEvent) {
// TODO
  }

  private handleMotion(event: MotionNotifyEvent) {
// TODO
  }

  private handleCreateNotify(event: CreateNotifyEvent) {
// TODO
  }

  private handleMapRequest(event: MapRequestEvent) {
// TODO
  }

  private handleMapNotify(event: MapNotifyEvent) {
// TODO
  }

  private handleUnmapNotify(event: UnmapNotifyEvent) {
// TODO
  }

  private handleReparentNotify(event: ReparentNotifyEvent) {
// TODO
  }

  private handleConfigureRequest(event: ConfigureRequestEvent) {
// TODO
  }

  private handleConfigureNotify(event: ConfigureNotifyEvent) {
// TODO
  }

  private handleDestroyNotify(event: DestroyNotifyEvent) {
// TODO
  }

  private handlePropertyNotify(event: PropertyNotifyEvent) {
// TODO
  }

  private handleClientMessage(event: ClientMessageEvent) {
// TODO
  }

  private handleFocusIn(event: FocusInEvent) {
// TODO
  }
}
