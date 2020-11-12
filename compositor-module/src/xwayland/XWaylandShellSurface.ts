import { CompositorSurface, CompositorSurfaceState } from '../index'
import Point from '../math/Point'
import Output from '../Output'
import Pointer from '../Pointer'
import Session from '../Session'
import Surface from '../Surface'
import { SurfaceState } from '../SurfaceState'
import { UserShellSurfaceRole } from '../UserShellSurfaceRole'

const SurfaceStates = {
  MAXIMIZED: 'maximized',
  FULLSCREEN: 'fullscreen',
  TRANSIENT: 'transient',
  TOP_LEVEL: 'top_level'
}

export default class XWaylandShellSurface implements UserShellSurfaceRole<void> {
  static create(session: Session, surface: Surface) {
    const { client, id } = surface.resource
    const userSurface: CompositorSurface = { id: `${id}`, clientId: client.id }
    const userSurfaceState: CompositorSurfaceState = {
      appId: '',
      active: false,
      mapped: false,
      minimized: false,
      title: '',
      unresponsive: false
    }

    const xWaylandShellSurface = new XWaylandShellSurface(session, surface, userSurface, userSurfaceState)
    surface.role = xWaylandShellSurface
    return xWaylandShellSurface
  }

  private readonly session: Session
  private readonly surface: Surface
  private _userSurfaceState: CompositorSurfaceState
  private _mapped: boolean = false
  private _managed: boolean = false

  readonly userSurface: CompositorSurface
  state?: string
  sendConfigure?: (width: number, height: number) => void

  constructor(session: Session, surface: Surface, userSurface: CompositorSurface, userSurfaceState: CompositorSurfaceState) {
    this.session = session
    this.surface = surface
    this.userSurface = userSurface
    this._userSurfaceState = userSurfaceState
  }

  private _ensureUserShellSurface() {
    if (!this._managed) {
      this._managed = true
      this.surface.resource.onDestroy().then(() => this.session.userShell.events.destroyUserSurface?.(this.userSurface))
      this.session.userShell.events.createUserSurface?.(this.userSurface, this._userSurfaceState)
    }
  }

  onCommit(surface: Surface, newState: SurfaceState): void {
    const oldPosition = surface.surfaceChildSelf.position
    surface.surfaceChildSelf.position = Point.create(oldPosition.x + newState.dx, oldPosition.y + newState.dy)

    if (newState.bufferContents) {
      if (!this._mapped) {
        this._map()
      }
    } else {
      if (this._mapped) {
        this._unmap()
      }
    }

    surface.updateState(newState)
  }

  private _map() {
    this._mapped = true
    this._userSurfaceState = { ...this._userSurfaceState, mapped: this._mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this._userSurfaceState)
  }

  private _unmap() {
    this._mapped = false
    this._userSurfaceState = { ...this._userSurfaceState, mapped: this._mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this._userSurfaceState)
  }

  captureRoleState() { /* NO-OP */
  }

  setRoleState(roleState: void) { /* NO-OP */
  }

  setToplevel(): void {
    if (this.state === SurfaceStates.TRANSIENT) {
      return
    }

    this._ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL
  }

  setToplevelWithPosition(x: number, y: number): void {

  }

  setParent(parent: Surface): void {

  }

  setTransient(parent: Surface, x: number, y: number): void {
    if (this.state === SurfaceStates.TOP_LEVEL) {
      return
    }

    const parentPosition = parent.surfaceChildSelf.position

    const surfaceChild = this.surface.surfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    surfaceChild.position = Point.create(parentPosition.x + x, parentPosition.y + y)

    this._ensureUserShellSurface()
    this.state = SurfaceStates.TRANSIENT
  }

  setFullscreen(output?: Output): void {
    this.state = SurfaceStates.FULLSCREEN
    // TODO get proper size in surface coordinates instead of assume surface space === global space
    this.surface.surfaceChildSelf.position = Point.create(0, 0)
    this.sendConfigure?.(window.innerWidth, window.innerHeight)
  }

  setXwayland(x: number, y: number): void {

  }

  move(pointer: Pointer): void {
    // if (!seat.isValidInputSerial(serial)) {
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Move serial mismatch. Ignoring.')
    //   return
    // }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const scene = pointer.scene
    if (scene) {
      // FIXME Only move that view that was last interacted with instead of finding the first one that matches.
      const topLevelView = scene.topLevelViews.find(topLevelView => topLevelView.surface === this.surface)
      if (topLevelView) {
        const origPosition = topLevelView.positionOffset

        const moveListener = () => {
          const deltaX = pointer.x - pointerX
          const deltaY = pointer.y - pointerY

          topLevelView.positionOffset = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)
          this.surface.scheduleRender()
        }

        pointer.onButtonRelease().then(() => pointer.removeMouseMoveListener(moveListener))
        pointer.addMouseMoveListener(moveListener)
      }
    }
  }

  resize(pointer: Pointer, edges: number): void {

  }

  setTitle(title: string): void {
    this._userSurfaceState = { ...this._userSurfaceState, title }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this._userSurfaceState)
  }


  setWindowGeometry(x: number, y: number, width: number, height: number): void {
  }


  setMaximized(): void {
    this.state = SurfaceStates.MAXIMIZED

    // FIXME get proper size in surface coordinates instead of assume surface space === global space
    const scene = this.session.globals.seat.pointer.scene

    if(scene){
      const width = scene.canvas.width
      const height = scene.canvas.height

      this.surface.views.forEach(view => view.positionOffset = Point.create(0, 0))
      this.sendConfigure?.(width, height)
    }
  }


  setPid(pid: number): void {
  }

  requestActive() {
    if (this._userSurfaceState.active) {
      return
    }
    this._userSurfaceState = { ...this._userSurfaceState, active: true }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this._userSurfaceState)
  }

  notifyInactive() {
    if (!this._userSurfaceState.active) {
      return
    }
    this._userSurfaceState = { ...this._userSurfaceState, active: false }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this._userSurfaceState)
  }
}
