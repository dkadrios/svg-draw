/* --------------------- Primary -------------------- */

import type React from 'react'

export interface TLPage<T extends TLShape | TLEntity = TLShape> {
  id: string
  name?: string
  canvas: {
    size: number[]
    src?: string
  }
  shapes: Record<string, T>
}

export interface TLPageState {
  camera: {
    point: number[]
    zoom: number
  }
  selectedId: string | null
  hoveredId: string | null
  editingId: string | null
}

export type TLMeta = Record<string, unknown>

export interface TLHandle {
  id: string
  index: number
  point: number[]
}

export interface TLEntity {
  id: string
  type: string
  childIndex: number
  point: number[]
  rotation: number
  handles?: Record<string, TLHandle>
}

export interface TLShape extends TLEntity {
  isGhost?: boolean
  isLocked?: boolean
  getBounds: () => TLBounds
}

export interface TLComponentProps<T extends TLShape, M = any> {
  shape: T
  isEditing: boolean
  isHovered: boolean
  isSelected: boolean
  isGhost?: boolean
  bounds: TLBounds
  meta: M
  onShapeChange?: TLShapeChangeHandler
  onShapeBlur?: TLShapeBlurHandler
  events: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerEnter: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerLeave: (e: React.PointerEvent) => void
  }
}

export interface TLIndicatorProps<T extends TLShape, M = any> {
  shape: T
  meta: M
  bounds: TLBounds
  isHovered: boolean
  isSelected: boolean
}

export interface TLTheme {
  accent?: string
  brushFill?: string
  brushStroke?: string
  selectFill?: string
  selectStroke?: string
  containerBackground?: string
  background?: string
  foreground?: string
  grid?: string
}

export type WebKitGestureEvent = PointerEvent & { scale: number; rotation: number }

export type TLWheelEventHandler = (
  info: TLPointerInfo,
  e: React.WheelEvent | WheelEvent | TouchEvent | WebKitGestureEvent
) => void

export type TLDropEventHandler = (e: React.DragEvent) => void

export type TLShapeChangeHandler = (
  shape: any,
  info?: any,
) => void

export interface TLPointerEvent extends React.PointerEvent {
  dead?: boolean
}

export type TLShapeBlurHandler = (info?: any) => void

export type TLKeyboardEventHandler = (key: string, info: TLKeyboardInfo, e: KeyboardEvent) => void

export type TLPointerEventHandler = (info: TLPointerInfo, e: React.PointerEvent) => void

export type TLCanvasEventHandler = (info: TLPointerInfo<'canvas'>, e: React.PointerEvent) => void

export type TLBoundsEventHandler = (info: TLPointerInfo<'bounds'>, e: React.PointerEvent) => void

export type TLBoundsHandleEventHandler = (
  info: TLPointerInfo<TLBoundsHandle>,
  e: React.PointerEvent
) => void

export interface TLCallbacks {
  // Camera events
  onPan: TLWheelEventHandler
  onZoom: TLWheelEventHandler

  // Pointer Events
  onPointerMove: TLPointerEventHandler
  onPointerUp: TLPointerEventHandler
  onPointerDown: TLPointerEventHandler

  // Canvas (background)
  onPointCanvas: TLCanvasEventHandler
  onDoubleClickCanvas: TLCanvasEventHandler
  onRightPointCanvas: TLCanvasEventHandler
  onDragCanvas: TLCanvasEventHandler
  onReleaseCanvas: TLCanvasEventHandler
  onDragOver: TLDropEventHandler
  onDrop: TLDropEventHandler

  // Shape
  onPointShape: TLPointerEventHandler
  onDoubleClickShape: TLPointerEventHandler
  onRightPointShape: TLPointerEventHandler
  onDragShape: TLPointerEventHandler
  onHoverShape: TLPointerEventHandler
  onUnhoverShape: TLPointerEventHandler
  onReleaseShape: TLPointerEventHandler

  // Bounds (bounding box background)
  onPointBounds: TLBoundsEventHandler
  onDoubleClickBounds: TLBoundsEventHandler
  onRightPointBounds: TLBoundsEventHandler
  onDragBounds: TLBoundsEventHandler
  onHoverBounds: TLBoundsEventHandler
  onUnhoverBounds: TLBoundsEventHandler
  onReleaseBounds: TLBoundsEventHandler

  // Bounds handles (corners, edges)
  onPointBoundsHandle: TLBoundsHandleEventHandler
  onDoubleClickBoundsHandle: TLBoundsHandleEventHandler
  onRightPointBoundsHandle: TLBoundsHandleEventHandler
  onDragBoundsHandle: TLBoundsHandleEventHandler
  onHoverBoundsHandle: TLBoundsHandleEventHandler
  onUnhoverBoundsHandle: TLBoundsHandleEventHandler
  onReleaseBoundsHandle: TLBoundsHandleEventHandler

  // Handles (ie the handles of a selected arrow)
  onPointHandle: TLPointerEventHandler
  onDoubleClickHandle: TLPointerEventHandler
  onRightPointHandle: TLPointerEventHandler
  onDragHandle: TLPointerEventHandler
  onHoverHandle: TLPointerEventHandler
  onUnhoverHandle: TLPointerEventHandler
  onReleaseHandle: TLPointerEventHandler

  // Misc
  onShapeChange: TLShapeChangeHandler
  onShapeBlur: TLShapeBlurHandler
  onError: (error: Error) => void
  onBoundsChange: (bounds: TLBounds) => void

  // Keyboard event handlers
  onKeyDown: TLKeyboardEventHandler
  onKeyUp: TLKeyboardEventHandler
}

export type TLCallbackNames = keyof TLCallbacks

export interface TLBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
  rotation?: number
}

export interface TLBoundsWithCenter extends TLBounds {
  midX: number
  midY: number
}

export enum TLBoundsEdge {
  Top = 'top_edge',
  Right = 'right_edge',
  Bottom = 'bottom_edge',
  Left = 'left_edge',
}

export const isTLBoundsEdge = (target: string): target is TLBoundsEdge => (
  Object.values(TLBoundsEdge).includes(target as TLBoundsEdge))

export enum TLBoundsCorner {
  TopLeft = 'top_left_corner',
  TopRight = 'top_right_corner',
  BottomRight = 'bottom_right_corner',
  BottomLeft = 'bottom_left_corner',
}

export const isTLBoundsCorner = (target: string): target is TLBoundsCorner => (
  Object.values(TLBoundsCorner).includes(target as TLBoundsCorner))

export type TLBoundsHandle = TLBoundsCorner | TLBoundsEdge | 'rotate'

export type TransformedBounds = TLBounds & { scaleX: number; scaleY: number }

export interface TLPointerInfo<T extends string = string> {
  target: T
  pointerId: number
  origin: number[]
  point: number[]
  delta: number[]
  pressure: number
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  spaceKey: boolean
}

export interface TLKeyboardInfo {
  origin: number[]
  point: number[]
  key: string
  keys: string[]
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
}

/* -------------------- Internal -------------------- */
export interface IShapeTreeNode<T extends TLShape, M extends Record<string, unknown>> {
  shape: T
  isGhost: boolean
  isEditing: boolean
  isHovered: boolean
  isSelected: boolean
  meta?: M
}
