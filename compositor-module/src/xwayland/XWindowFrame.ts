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

export interface XWindowFrame {
  pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation

  doubleClick(undefined: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  pointerButton(pointer: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  status(): number

  statusClear(frameStatus: FrameStatus): void

  resizeInside(width: number, height: number): void

  destroy(): void

  resizeInside(width: number, height: number): void

  width(): number,

  height(): number

  interior(width?: number, height?: number): { x: number; y: number }

  setTitle(title: string): void

  repaint(): void

  renderShadow(x: number, y: number, width: number, height: number, margin: number, topMargin: number): void

  inputRect(): { x: number, y: number, width: number, height: number }

  pointerEnter(pointer: Pointer | undefined, x: number, y: number): ThemeLocation

  pointerLeave(pointer: Pointer | undefined): void
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
  return {
    destroy(): void {
    },
    doubleClick(undefined: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation {
      return ThemeLocation.THEME_LOCATION_CLIENT_AREA
    },
    height(): number {
      return 0
    },
    inputRect(): { x: number; y: number; width: number; height: number } {
      return { height: 0, width: 0, x: 0, y: 0 }
    },
    interior(width?: number, height?: number): { x: number; y: number } {
      return { x: 0, y: 0 }
    },
    pointerButton(pointer: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation {
      return ThemeLocation.THEME_LOCATION_CLIENT_AREA
    },
    pointerEnter(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
      return ThemeLocation.THEME_LOCATION_CLIENT_AREA
    },
    pointerLeave(pointer: Pointer | undefined): void {
    },
    pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
      return ThemeLocation.THEME_LOCATION_CLIENT_AREA
    },
    repaint(): void {
    },
    resizeInside(width: number, height: number): void {
    },
    setTitle(title: string): void {
    },
    status(): number {
      return 0
    },
    statusClear(frameStatus: FrameStatus): void {
    },
    width(): number {
      return 0
    },
    renderShadow(x: number, y: number, width: number, height: number, margin: number, topMargin: number): void {
    }
  }
}

export function canvasXtsbSurfaceCreateWithXRenderFormat(connetion: XConnection, screen: SCREEN, frameId: WINDOW, formatRgba: PICTFORMINFO, width: number, height: number): HTMLCanvasElement {
  // TODO
  return document.createElement('canvas')
}

export function canvasXtsbSurfaceSetSize(canvas: HTMLCanvasElement | undefined, width: number, height: number): void {
  // TODO
}
