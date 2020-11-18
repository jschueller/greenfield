import { WlPointerButtonState } from 'westfield-runtime-server'
import { SCREEN, WINDOW, XConnection } from 'xtsb'
import { PICTFORMINFO } from 'xtsb/dist/types/xcbRender'
import Pointer from '../Pointer'

// TODO what to with these implementations?

export enum FrameStatus {
  FRAME_STATUS_NONE = 0,
  FRAME_STATUS_REPAINT = 0x1,
  FRAME_STATUS_MINIMIZE = 0x2,
  FRAME_STATUS_MAXIMIZE = 0x4,
  FRAME_STATUS_CLOSE = 0x8,
  FRAME_STATUS_MENU = 0x10,
  FRAME_STATUS_RESIZE = 0x20,
  FRAME_STATUS_MOVE = 0x40,
  FRAME_STATUS_ALL = 0x7f
}

export enum ThemeLocation {
  THEME_LOCATION_INTERIOR = 0,
  THEME_LOCATION_RESIZING_TOP = 1,
  THEME_LOCATION_RESIZING_BOTTOM = 2,
  THEME_LOCATION_RESIZING_LEFT = 4,
  THEME_LOCATION_RESIZING_TOP_LEFT = 5,
  THEME_LOCATION_RESIZING_BOTTOM_LEFT = 6,
  THEME_LOCATION_RESIZING_RIGHT = 8,
  THEME_LOCATION_RESIZING_TOP_RIGHT = 9,
  THEME_LOCATION_RESIZING_BOTTOM_RIGHT = 10,
  THEME_LOCATION_RESIZING_MASK = 15,
  THEME_LOCATION_EXTERIOR = 16,
  THEME_LOCATION_TITLEBAR = 17,
  THEME_LOCATION_CLIENT_AREA = 18,
}

export enum FrameButton {
  FRAME_BUTTON_NONE = 0,
  FRAME_BUTTON_CLOSE = 0x1,
  FRAME_BUTTON_MAXIMIZE = 0x2,
  FRAME_BUTTON_MINIMIZE = 0x4,
  FRAME_BUTTON_ALL = 0x7
}

enum FrameButtonFlags {
  FRAME_BUTTON_ALIGN_RIGHT = 0x1,
  FRAME_BUTTON_DECORATED = 0x2,
  FRAME_BUTTON_CLICK_DOWN = 0x4,
}

enum FrameFlag {
  FRAME_FLAG_ACTIVE = 0x1,
  FRAME_FLAG_MAXIMIZED = 0x2
}

// from input-event-codes.h
const BTN_LEFT = 0x110
const BTN_RIGHT = 0x111

class XWindowFramePointer {
  // @ts-ignore
  private destroyResolve: (value?: void | PromiseLike<void>) => void
  private destroyPromise = new Promise(resolve => this.destroyResolve = resolve)

  constructor(public data: any, private x: number = 0, private y: number = 0, public hoverButton?: XWindowFrameButton, private downButtons: XWindowFramePointerButton[] = []) {
  }

  enter(frame: XWindowFrame, data: any, x: number, y: number) {
    this.motion(frame, data, x, y)
  }

  motion(frame: XWindowFrame, data: any, x: number, y: number) {
    const pointer = frame.getPointer(data)
    const button = frame.findButton(x, y)
    // TODO
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }
}

class XWindowFramePointerButton {
  constructor(private button: number, private pressLocation: ThemeLocation, private frameButton?: XWindowFrameButton) {
  }

  press(frame: XWindowFrame, pointer: XWindowFramePointer) {
    if (this.button === BTN_RIGHT) {
      if (this.pressLocation === ThemeLocation.THEME_LOCATION_TITLEBAR) {
        frame.status |= FrameStatus.FRAME_STATUS_MENU
      }

      this.destroy()
    } else if (this.button === BTN_LEFT) {
      if (pointer.hoverButton) {
        pointer.hoverButton.press()
      } else {
        switch (this.pressLocation) {
          case ThemeLocation.THEME_LOCATION_TITLEBAR:
            frame.status |= FrameStatus.FRAME_STATUS_MOVE
            this.destroy()
            break
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM:
          case ThemeLocation.THEME_LOCATION_RESIZING_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_RIGHT:
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP_RIGHT:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
            frame.status |= FrameStatus.FRAME_STATUS_RESIZE
            this.destroy()
            break
          default:
            break

        }
      }
    }
  }

  release(pointer: XWindowFramePointer) {
    if (this.button === BTN_LEFT && this.frameButton) {
      if (this.frameButton === pointer.hoverButton) {
        this.frameButton.release()
      } else {
        this.frameButton.cancel()
      }
    }
  }

  cancel() {
    this.frameButton?.cancel()
  }

  destroy() {
  }
}

class XWindowFrameButton {
  allocation: {
    x: number, y: number
    width: number, height: number
  } = {
    x: 0, y: 0,
    width: 0, height: 0
  }

  private hoverCount: number = 0
  private pressCount: number = 0

  constructor(private frame: XWindowFrame, private icon: HTMLCanvasElement, private statusEffect: FrameStatus, private flags: FrameButtonFlags) {
  }

  enter() {
    if (!this.hoverCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
    this.hoverCount++
  }

  leave() {
    this.hoverCount--
    if (!this.hoverCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
  }

  press() {
    if (!this.pressCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
    this.pressCount++

    if (this.flags & FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN) {
      this.frame.status |= this.statusEffect
    }
  }

  release() {
    this.pressCount--
    if (this.pressCount) {
      return
    }

    this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT

    if (!(this.flags & FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)) {
      this.frame.status |= this.statusEffect
    }
  }

  cancel() {
    this.pressCount--
    if (!this.pressCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
  }

  repaint() {
    if (!this.allocation.width) {
      return
    }
    if (!this.allocation.height) {
      return
    }

    const x = this.allocation.x
    const y = this.allocation.y

    // TODO do paint in canvas?
  }
}

export class XWindowFrame {
  status: FrameStatus = FrameStatus.FRAME_STATUS_REPAINT
  pointers: XWindowFramePointer[] = []
  buttons: XWindowFrameButton[] = []

  private geometryDirty: boolean = true
  private flags = 0

  constructor(
    private theme: XWindowTheme,
    public width: number,
    public height: number,
    buttons: number,
    private title: string,
    private icon?: HTMLCanvasElement
  ) {
    if (title) {
      if (icon) {
        const xWindowFrameButton = new XWindowFrameButton(this, icon, FrameStatus.FRAME_STATUS_MENU, , FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
        this.buttons = [...this.buttons, xWindowFrameButton]
      } else {
        // TODO load a png and use it as a default icon?
      }
    }

    if (buttons & FrameButton.FRAME_BUTTON_CLOSE) {
      // TODO load close button png icon

      const xWindowFrameButton = new XWindowFrameButton(this, icon, FrameStatus.FRAME_STATUS_MENU, , FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      this.buttons = [...this.buttons, xWindowFrameButton]
    }

    if (buttons & FrameButton.FRAME_BUTTON_MAXIMIZE) {
      // TODO load maximize button png icon

      const xWindowFrameButton = new XWindowFrameButton(this, icon, FrameStatus.FRAME_STATUS_MENU, , FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      this.buttons = [...this.buttons, xWindowFrameButton]
    }

    if (buttons & FrameButton.FRAME_BUTTON_MINIMIZE) {
      // TODO load minimize button png icon

      const xWindowFrameButton = new XWindowFrameButton(this, icon, FrameStatus.FRAME_STATUS_MENU, , FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      this.buttons = [...this.buttons, xWindowFrameButton]
    }
  }

  pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
// TODO
  }

  doubleClick(undefined: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation {
// TODO
  }

  pointerButton(pointer: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation {
// TODO
  }

  statusClear(frameStatus: FrameStatus): void {
    // TODO

  }

  resizeInside(width: number, height: number): void {
    let decorationWidth = 0
    let decorationHeight = 0
    let titlebarHeight = 0
    if (this.title || this.buttons.length !== 0) {
      titlebarHeight = this.theme.titlebarHeight
    } else {
      titlebarHeight = this.theme.width
    }

    if (this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      decorationWidth = this.theme.width * 2
      decorationHeight = this.theme.width + titlebarHeight
    } else {
      decorationWidth = (this.theme.width + this.theme.margin) * 2
      decorationHeight = this.theme.width + titlebarHeight + this.theme.margin * 2
    }

    this.resize(width + decorationHeight, height + decorationHeight)
  }

  destroy(): void {
    this.buttons.forEach(value => value.destroy())
    this.pointers.forEach(value => value.destroy())
  }

  private refreshGeometry() {
// TODO
  }

  interior(width?: number, height?: number): { x: number; y: number } {
// TODO
  }

  setTitle(title: string): void {
    this.title = title
    this.geometryDirty = true
    this.status = FrameStatus.FRAME_STATUS_REPAINT
  }

  repaint(): void {
    // TODO

  }

  renderShadow(x: number, y: number, width: number, height: number, margin: number, topMargin: number): void {
    // TODO

  }

  inputRect(): { x: number, y: number, width: number, height: number } {
    // TODO

  }

  pointerEnter(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
    // TODO

  }

  pointerLeave(pointer: Pointer | undefined): void {
    // TODO

  }

  setFlag(flag: FrameFlag) {
    if (flag & FrameFlag.FRAME_FLAG_MAXIMIZED && !(this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED)) {
      this.geometryDirty = true
    }

    this.flags |= flag
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  unsetFlag(flag: FrameFlag) {
    if (flag & FrameFlag.FRAME_FLAG_MAXIMIZED && this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      this.geometryDirty = true
    }

    this.flags &= ~flag
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.geometryDirty = true
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  getPointer(data: any): XWindowFramePointer {
    const pointer = this.pointers.find(value => value.data === data)
    if (pointer) {
      return pointer
    }

    const xWindowFramePointer = new XWindowFramePointer(data)
    xWindowFramePointer.onDestroy().then(value => {
      this.pointers = this.pointers.filter(value => value !== xWindowFramePointer)
    })
    this.pointers = [...this.pointers, xWindowFramePointer]
    return xWindowFramePointer
  }

  findButton(x: number, y: number): XWindowFrameButton {
// TODO
  }
}

export interface XWindowTheme {
  activeFrame?: HTMLCanvasElement,
  inactiveFrame?: HTMLCanvasElement,
  shadow?: HTMLCanvasElement,
  frameRadius: number,
  margin: number,
  width: number,
  titlebarHeight: number
}

export function themeCreate(): XWindowTheme {
  // TODO
  return {
    activeFrame: undefined,
    frameRadius: 0,
    inactiveFrame: undefined,
    margin: 0,
    shadow: undefined,
    titlebarHeight: 0,
    width: 0
  }
}

export function themeDestroy(theme: XWindowTheme) {
}

export function frameCreate(theme: XWindowTheme, width: number, height: number, buttons: number, title: string, icon?: HTMLCanvasElement): XWindowFrame {
  // TODO make frame a class
  // return new XWindowFrame(theme, width, height, buttons, title, icon)
}

export function canvasXtsbSurfaceCreateWithXRenderFormat(connetion: XConnection, screen: SCREEN, frameId: WINDOW, formatRgba: PICTFORMINFO, width: number, height: number): HTMLCanvasElement {
  // TODO
  return document.createElement('canvas')
}

export function canvasXtsbSurfaceSetSize(canvas: HTMLCanvasElement | undefined, width: number, height: number): void {
  // TODO
}
