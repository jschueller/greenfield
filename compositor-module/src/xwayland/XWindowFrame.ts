import { WlPointerButtonState } from 'westfield-runtime-server'
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

export interface XWindowFrame {
  pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation

  doubleClick(undefined: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  pointerButton(pointer: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  status(): number

  statusClear(frameStatus: FrameStatus): void

  resizeInside(width: number, height: number): void
}

