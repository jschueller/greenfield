import Output from '../Output'
import Pointer from '../Pointer'
import Session from '../Session'
import Surface from '../Surface'

export default class XWaylandShellSurface {
  static create(session: Session, surface: Surface) {
    return new XWaylandShellSurface(session, surface)
  }

  private readonly session: Session
  private readonly surface: Surface

  sendConfigure?: (surface: Surface, width: number, height: number) => void

  constructor(session: Session, surface: Surface) {
    this.session = session
    this.surface = surface
  }

  setToplevel(): void {

  }

  setToplevelWithPosition(x: number, y: number): void {

  }

  setParent(parent: Surface): void {

  }

  setTransient(parent: Surface, x: number, y: number): void {

  }

  setFullscreen(output: Output): void {

  }

  setXwayland(x: number, y: number): void {

  }

  move(pointer: Pointer): void {

  }

  resize(pointer: Pointer, edges: number): void {

  }

  setTitle(title: string): void {
  }


  setWindowGeometry(x: number, y: number, width: number, height: number): void {
  }


  setMaximized(): void {
  }


  setPid(pid: number): void {
  }
}
