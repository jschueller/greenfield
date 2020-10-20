import Session from '../Session'
import Surface from '../Surface'
import XWaylandShellSurface from './XWaylandShellSurface'

class XWaylandShell {
  static create(session: Session) {
    return new XWaylandShell(session)
  }

  private readonly session: Session

  constructor(session: Session) {
    this.session = session
  }

  createSurface(surface: Surface): XWaylandShellSurface {
    return XWaylandShellSurface.create(this.session, surface)
  }
}

export default XWaylandShell
