import {
  ATOM,
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
  GetPropertyReply,
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
import Rect from '../math/Rect'
import Region from '../Region'
import Surface from '../Surface'
import { XWaylandConnection } from './XWaylandConnection'

type ConfigureValueList = Parameters<XConnection['configureWindow']>
type MwmDecor = number

const topBarHeight = 25

const MWM_DECOR_ALL: 1 = 1
const MWM_DECOR_BORDER: 2 = 2
const MWM_DECOR_RESIZEH: 4 = 4
const MWM_DECOR_TITLE: 8 = 8
const MWM_DECOR_MENU: 16 = 16
const MWM_DECOR_MINIMIZE: 32 = 32
const MWM_DECOR_MAXIMIZE: 64 = 64

const MWM_DECOR_EVERYTHING: 126 = 126

const MWM_HINTS_FUNCTIONS: 1 = 1
const MWM_HINTS_DECORATIONS: 2 = 2
const MWM_HINTS_INPUT_MODE: 4 = 4
const MWM_HINTS_STATUS: 8 = 8

const MWM_FUNC_ALL: 1 = 1
const MWM_FUNC_RESIZE: 2 = 2
const MWM_FUNC_MOVE: 4 = 4
const MWM_FUNC_MINIMIZE: 8 = 8
const MWM_FUNC_MAXIMIZE: 16 = 16
const MWM_FUNC_CLOSE: 32 = 32

const MWM_INPUT_MODELESS: 0 = 0
const MWM_INPUT_PRIMARY_APPLICATION_MODAL: 1 = 1
const MWM_INPUT_SYSTEM_MODAL: 2 = 2
const MWM_INPUT_FULL_APPLICATION_MODAL: 3 = 3
const MWM_INPUT_APPLICATION_MODAL = MWM_INPUT_PRIMARY_APPLICATION_MODAL

const MWM_TEAROFF_WINDOW: 1 = 1

const _NET_WM_MOVERESIZE_SIZE_TOPLEFT: 0 = 0
const _NET_WM_MOVERESIZE_SIZE_TOP: 1 = 1
const _NET_WM_MOVERESIZE_SIZE_TOPRIGHT: 2 = 2
const _NET_WM_MOVERESIZE_SIZE_RIGHT: 3 = 3
const _NET_WM_MOVERESIZE_SIZE_BOTTOMRIGHT: 4 = 4
const _NET_WM_MOVERESIZE_SIZE_BOTTOM: 5 = 5
const _NET_WM_MOVERESIZE_SIZE_BOTTOMLEFT: 6 = 6
const _NET_WM_MOVERESIZE_SIZE_LEFT: 7 = 7
const _NET_WM_MOVERESIZE_MOVE: 8 = 8   /* movement only */
const _NET_WM_MOVERESIZE_SIZE_KEYBOARD: 9 = 9   /* size via keyboard */
const _NET_WM_MOVERESIZE_MOVE_KEYBOARD: 10 = 10   /* move via keyboard */
const _NET_WM_MOVERESIZE_CANCEL: 11 = 11   /* cancel operation */

const ICCCM_WITHDRAWN_STATE: 0 = 0
const ICCCM_NORMAL_STATE: 1 = 1
const ICCCM_ICONIC_STATE: 3 = 3

type NamedAtom = [
  name: string,
  value: number
]

/* We reuse some predefined, but otherwise useles atoms
 * as local type placeholders that never touch the X11 server,
 * to make weston_wm_window_read_properties() less exceptional.
 */
const TYPE_WM_PROTOCOLS = Atom.cutBuffer0
const TYPE_MOTIF_WM_HINTS = Atom.cutBuffer1
const TYPE_NET_WM_STATE = Atom.cutBuffer2
const TYPE_WM_NORMAL_HINTS = Atom.cutBuffer3

type Prop = [atom: ATOM, type: ATOM, propUpdater: (prop: GetPropertyReply) => void]

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

interface SizeHints {
  flags: number,
  x: number
  y: number
  width: number,
  height: number
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
  widthInc: number
  heightInc: number
  minAspect: { x: number, y: number }
  maxAspect: { x: number, y: number }
  baseWidth: number,
  baseHeight: number,
  winGravity: number
}

interface MotifWmHints {
  flags: number,
  functions: number,
  decorations: number,
  inputMode: number,
  status: number
}

class DesktopXwaylandSurface {
  // TODO handles
}

interface WmWindow {
  repaintScheduled: boolean
  hasAlpha: boolean
  surface: Surface
  width: number
  height: number
  frameId: WINDOW
  x: number
  y: number
  mapRequestX: number
  mapRequestY: number
  maximizedHorizontal: boolean
  maximizedVertical: boolean
  fullscreen: boolean
  id: WINDOW
  class: string
  name: string
  transientFor: WmWindow
  type: ATOM
  pid: number
  machine: string
  propertiesDirty: boolean
  overrideRedirect: boolean
  decorate: MwmDecor
  sizeHints: SizeHints
  motifHints: MotifWmHints
  deleteWindow: boolean
  shsurf: DesktopXwaylandSurface
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

    const wmWindow = createWMWindow(xConnection, xConnection.setup.roots[0], xwmAtoms)


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
  private readonly atoms: XWMAtoms
  private readonly composite: Composite.Composite
  private readonly render: Render.Render
  private readonly xFixes: XFixes.XFixes
  private readonly formatRgb: Render.PICTFORMINFO
  private readonly formatRgba: Render.PICTFORMINFO
  private readonly visualId: number
  private readonly colormap: number
  private readonly screen: SCREEN
  private readonly wmWindow: WINDOW
  private readonly windowHash: { [key: number]: WmWindow } = {}

  constructor(
    xConnection: XConnection,
    screen: SCREEN,
    { xwmAtoms, composite, render, xFixes, formatRgb, formatRgba }: XWindowManagerResources,
    { visualId, colormap }: VisualAndColormap,
    wmWindow: WINDOW
  ) {
    this.xConnection = xConnection
    this.atoms = xwmAtoms
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

  private async handleMapRequest(event: MapRequestEvent) {
    if (this.isOurResource(event.window)) {
      return
    }

    const window = this.lookupWindow(event.window)
    if (window === undefined) {
      return
    }

    await this.wmWindowReadProperties(window)

    /* For a new Window, MapRequest happens before the Window is realized
     * in Xwayland. We do the real xcb_map_window() here as a response to
     * MapRequest. The Window will get realized (wl_surface created in
     * Wayland and WL_SURFACE_ID sent in X11) when it has been mapped for
     * real.
     *
     * MapRequest only happens for (X11) unmapped Windows. On UnmapNotify,
     * we reset shsurf to NULL, so even if X11 connection races far ahead
     * of the Wayland connection and the X11 client is repeatedly mapping
     * and unmapping, we will never have shsurf set on MapRequest.
     */
    if (window.shsurf !== undefined) {
      throw new Error('Assertion failed. X window should not have a shell surface on map request.')
    }

    window.mapRequestX = window.x
    window.mapRequestY = window.y

    if (window.frameId === Window.None) {
      this.createFrame(window) /* sets frame_id */
    }
    if (window.frameId === Window.None) {
      throw new Error('Assertion failed. X window should have a parent window.')
    }

    this.wmWindowSetAllowCommits(window, false)
    this.setWmState(window, ICCCM_NORMAL_STATE)
    this.setNetWmState(window)
    this.setVirtualDesktop(window, 0)
    // TODO legacy_fullscreen see weston window-manager.c

    this.xConnection.mapWindow(event.window)
    this.xConnection.mapWindow(window.frameId)

    /* Mapped in the X server, we can draw immediately.
     * Cannot set pending state though, no weston_surface until
     * xserver_map_shell_surface() time. */
    this.wmWindowScheduleRepaint(window)
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

  private isOurResource(id: number) {
    const { resourceIdMask, resourceIdBase } = this.xConnection.setup
    return (id & ~resourceIdMask) === resourceIdBase
  }

  private lookupWindow(window: WINDOW) {
    return this.windowHash[window]
  }

  private async wmWindowReadProperties(window: WmWindow) {
    if (!window.propertiesDirty) {
      return
    }
    window.propertiesDirty = false

    const props: Prop[] = [
      [Atom.wmClass, Atom.STRING, ({ value }) => window.class = value.chars()],
      [Atom.wmName, Atom.STRING, ({ value }) => window.name = value.chars()],
      [Atom.wmTransientFor, Atom.WINDOW, ({ value }) => {
        const lookupWindow = this.lookupWindow(new Uint32Array(value.buffer)[0])
        if (lookupWindow === undefined) {
          console.log('XCB_ATOM_WINDOW contains window id not found in hash table.')
        } else {
          window.transientFor = lookupWindow
        }
      }],
      [this.atoms.WM_PROTOCOLS, TYPE_WM_PROTOCOLS, ({ value, valueLen }) => {
        const atoms = new Uint32Array(value.buffer)
        for (let i = 0; i < valueLen; i++) {
          if (atoms[i] === this.atoms.WM_DELETE_WINDOW) {
            window.deleteWindow = true
            break
          }
        }
      }],
      [this.atoms.WM_NORMAL_HINTS, TYPE_WM_NORMAL_HINTS, ({ value }) => {
        const [flags, x, y, width, height, minWidth, minHeight, maxWidth, maxHeight, widthInc, heightInc, minAspectX, minAspectY, maxAspectX, maxAspectY, baseWidth, baseHeight, winGravity] = new Uint32Array(value.buffer)
        window.sizeHints = {
          flags,
          x,
          y,
          width,
          height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          widthInc,
          heightInc,
          minAspect: { x: minAspectX, y: minAspectY },
          maxAspect: { x: maxAspectX, y: maxAspectY },
          baseWidth,
          baseHeight,
          winGravity
        }
      }],
      [this.atoms._NET_WM_STATE, TYPE_NET_WM_STATE, ({ value, valueLen }) => {
        window.fullscreen = false
        const atoms = new Uint32Array(value.buffer)
        for (let i = 0; i < valueLen; i++) {
          if (atoms[i] === this.atoms._NET_WM_STATE_FULLSCREEN) {
            window.fullscreen = true
          }
          if (atoms[i] === this.atoms._NET_WM_STATE_MAXIMIZED_VERT) {
            window.maximizedVertical = true
          }
          if (atoms[i] === this.atoms._NET_WM_STATE_MAXIMIZED_HORZ) {
            window.maximizedHorizontal = true
          }
        }
      }],
      [this.atoms._NET_WM_WINDOW_TYPE, Atom.ATOM, ({ value }) => window.type = new Uint32Array(value.buffer)[0]],
      [this.atoms._NET_WM_NAME, Atom.STRING, ({ value }) => window.name = value.chars()],
      [this.atoms._NET_WM_PID, Atom.CARDINAL, ({ value }) => window.pid = new Uint32Array(value.buffer)[0]],
      [this.atoms._MOTIF_WM_HINTS, TYPE_MOTIF_WM_HINTS, ({ value }) => {
        const [flags, functions, decorations, inputMode, status] = new Uint32Array(value.buffer)
        window.motifHints = {
          flags,
          functions,
          decorations,
          inputMode,
          status
        }
        if (window.motifHints.flags & MWM_HINTS_DECORATIONS) {
          if (window.motifHints.decorations & MWM_DECOR_ALL) {
            /* MWM_DECOR_ALL means all except the other values listed. */
            window.decorate = MWM_DECOR_EVERYTHING & (~window.motifHints.decorations)
          } else {
            window.decorate = window.motifHints.decorations
          }
        }
      }],
      [this.atoms.WM_CLIENT_MACHINE, Atom.wmClientMachine, ({ value }) => window.machine = value.chars()]
    ]

    props.forEach(([atom, type, propUpdater]: Prop) =>
      this.xConnection.getProperty(0, window.id, atom, Atom.Any, 0, 2048)
        .then(property => {
          if (property._type === Atom.None) {
            /* No such property */
            return
          }
          propUpdater(property)
        })
        .catch(() => {
          /* Bad window, typically */
        }))
  }

  private createFrame(window: WmWindow) {
    // TODO paint a nice window bar using canvas2d
    // TODO see weston window-manager.c weston_wm_window_create_frame for more implementation details

    const { width, height } = this.wmWindowGetFrameSize(window)
    const { x, y } = this.wmWindowGetChildPosition(window)

    window.frameId = this.xConnection.allocateID()
    this.xConnection.createWindow(
      32,
      window.frameId,
      this.screen.root,
      0,
      0,
      width,
      height,
      0,
      WindowClass.InputOutput,
      this.visualId,
      {
        borderPixel: this.screen.blackPixel,
        eventMask: EventMask.KeyPress |
          EventMask.KeyRelease |
          EventMask.ButtonPress |
          EventMask.ButtonRelease |
          EventMask.PointerMotion |
          EventMask.EnterWindow |
          EventMask.LeaveWindow |
          EventMask.SubstructureNotify |
          EventMask.SubstructureRedirect,
        colormap: this.colormap
      })

    this.xConnection.reparentWindow(window.id, window.frameId, x, y)

    this.configureWindow(window.id, { borderWidth: 0 })

    this.windowHash[window.frameId] = window
  }

  private configureWindow(id: WINDOW, valueList: ConfigureValueList[1]) {
    this.xConnection.configureWindow(id, valueList)
  }

  /** Control Xwayland wl_surface.commit behaviour
   *
   * This function sets the "_XWAYLAND_ALLOW_COMMITS" property of the frame window
   * (not the content window!) to allow.
   *
   * If the property is set to true, Xwayland will commit whenever it likes.
   * If the property is set to false, Xwayland will not commit.
   * If the property is not set at all, Xwayland assumes it is true.
   *
   * @param window The XWM window to control.
   * @param allow Whether Xwayland is allowed to wl_surface.commit for the window.
   */
  private wmWindowSetAllowCommits(window: WmWindow, allow: boolean) {
    if (window.frameId === undefined) {
      throw new Error('Window does not have a parent.')
    }

    this.xConnection.changeProperty(PropMode.Replace, window.frameId, this.atoms._XWAYLAND_ALLOW_COMMITS, Atom.CARDINAL, 32, new Uint32Array([allow ? 1 : 0]))
  }

  private setWmState(window: WmWindow, state: number) {
    this.xConnection.changeProperty(PropMode.Replace, window.id, this.atoms.WM_STATE, this.atoms.WM_STATE, 32, new Uint32Array([
      state,
      Window.None
    ]))
  }

  private setNetWmState(window: WmWindow) {
    const property: number[] = []
    if (window.fullscreen) {
      property.push(this.atoms._NET_WM_STATE_FULLSCREEN)
    }
    if (window.maximizedVertical) {
      property.push(this.atoms._NET_WM_STATE_MAXIMIZED_VERT)
    }
    if (window.maximizedVertical) {
      property.push(this.atoms._NET_WM_STATE_MAXIMIZED_HORZ)
    }

    this.xConnection.changeProperty(PropMode.Replace, window.id, this.atoms._NET_WM_STATE, Atom.ATOM, 32, new Uint32Array(property))
  }

  private setVirtualDesktop(window: WmWindow, desktop: number) {
    if (desktop >= 0) {
      this.xConnection.changeProperty(PropMode.Replace, window.id, this.atoms._NET_WM_DESKTOP, Atom.CARDINAL, 32, new Uint32Array([desktop]))
    } else {
      this.xConnection.deleteProperty(window.id, this.atoms._NET_WM_DESKTOP)
    }
  }

  private wmWindowScheduleRepaint(window: WmWindow) {
    if (window.frameId === Window.None) {
      /* Override-redirect windows go through here, but we
       * cannot assert(window->override_redirect); because
       * we do not deal with changing OR flag yet.
       * XXX: handle OR flag changes in message handlers
       */
      this.wmWindowSetPendingStateOR(window)
      return
    }

    if (window.repaintScheduled) {
      return
    }


    // TODO weston uses an idle event here, check if this might cause problems in our implementation
    this.wmWindowDoRepaint(window)
  }

  private wmWindowSetPendingStateOR(window: WmWindow) {
    /* for override-redirect windows */
    if (window.frameId !== Window.None) {
      throw new Error('Can only set pending state for windows without a parent.')
    }

    if (window.surface === undefined) {
      return
    }

    const { width, height } = this.wmWindowGetFrameSize(window)
    Region.fini(window.surface.pendingOpaqueRegion)
    if (window.hasAlpha) {
      Region.init(window.surface.pendingOpaqueRegion)
    } else {
      Region.initRect(window.surface.pendingOpaqueRegion, Rect.create(0, 0, width, height))
    }
  }

  private wmWindowGetChildPosition(window: WmWindow) {
    if (window.fullscreen) {
      return { x: 0, y: 0 }
    } else {
      return { x: 0, y: topBarHeight }
    }
  }


  private wmWindowGetFrameSize(window: WmWindow) {
    const width = window.width
    const height = window.height + topBarHeight

    return { width, height }
  }

  private async wmWindowDoRepaint(window: WmWindow) {
    window.repaintScheduled = false
    this.wmWindowSetAllowCommits(window, false)
    await this.wmWindowReadProperties(window)
    this.wmWindowDrawDecorations(window)
    this.wmWindowSetPendingState(window)
    this.wmWindowSetAllowCommits(window, true)
  }

  private wmWindowDrawDecorations(window: WmWindow) {
    // TODO
    if (window.fullscreen) {
      /* nothing */
    } else if (window.decorate) {
      // TODO paint title in top bar
    } else {
      // TODO render shadow
    }
  }

  private wmWindowSetPendingState(window: WmWindow) {
    if (window.surface === undefined) {
      return
    }

    const { width, height } = this.wmWindowGetFrameSize(window)
    const { x, y } = this.wmWindowGetChildPosition(window)

    Region.fini(window.surface.pendingOpaqueRegion)
    if (window.hasAlpha) {
      Region.init(window.surface.pendingOpaqueRegion)
    } else {
      /* We leave an extra pixel around the X window area to
       * make sure we don't sample from the undefined alpha
       * channel when filtering. */
      Region.initRect(window.surface.pendingOpaqueRegion, Rect.create(x - 1, y - 1, window.width + 2, window.height + 2))
    }

    let inputX = 0
    let inputY = 0
    let inputW = 0
    let inputH = 0
    if (window.decorate && !window.fullscreen) {
      // TODO grt frame_input_rect, see weston window-manager.c
      inputX = x
      inputY = y
      inputW = width
      inputH = topBarHeight
    } else {
      inputX = x
      inputY = y
      inputW = width
      inputH = height
    }

    Region.fini(window.surface.pendingInputRegion)
    Region.initRect(window.surface.pendingInputRegion, Rect.create(inputX, inputY, inputW, inputH))

    // TODO xwayland_interface->set_window_geometry(window->shsurf,
    //                                             input_x, input_y,
    //                                             input_w, input_h);

    if(window.name){
      // TODO xwayland_interface->set_title(window->shsurf, window->name);
    }
  }
}
