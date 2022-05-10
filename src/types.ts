import type { TLCallbacks, TLPage, TLPageState, TransformedBounds } from 'core'
import type { LineEntity, LineShape } from 'state/shapes/Line'
import type { RectEntity, RectShape } from 'state/shapes/Rect'
import type { FreeDrawEntity, FreeDrawShape } from 'state/shapes/FreeDraw'
import type { TextEntity, TextShape } from './state/shapes/Text'
import type { ImageEntity, ImageShape } from './state/shapes/Image'
import type { MeasureLineEntity, MeasureLineShape } from './state/shapes/Measure'
// Re-export core types
export * from './core/types'

export type TDSettings = {
  hideGrid: boolean
  grid: number
}

export type TDPageState = TLPageState & { settings: TDSettings }

export type TDPage = TLPage<TDShape>
export type TDSerializedPage = TLPage<TDEntity>

export type TDShapeStyle = {
  color?: string
  fill?: string,
  size?: 'S' | 'M' | 'L'
  scale?: number
}

export const strokeWidths: Record<'S' | 'M' | 'L', number> = {
  S: 2,
  M: 3.5,
  L: 5,
}

export type TDShapeStyleKey = keyof TDShapeStyle
export type TDShapeStyleKeys = TDShapeStyleKey[]

export enum TDShapeType {
  Rectangle = 'rectangle',
  Line = 'line',
  FreeDraw = 'freedraw',
  Text = 'text',
  Image = 'image',
  MeasureLine = 'measure_line'
}

export enum TDToolType {
  Select = 'select',
  Rectangle = 'rectangle',
  Line = 'line',
  FreeDraw = 'freedraw',
  Text = 'text'
}

export type TDShape = LineShape | RectShape | FreeDrawShape | TextShape | ImageShape | MeasureLineShape

export type TDShapesList = Record<string, TDShape>

export type TDEntity = LineEntity | RectEntity | FreeDrawEntity | TextEntity | ImageEntity | MeasureLineEntity

export type TDEntitiesList = Record<string, TDEntity>

export interface Moveable {
  translate(point: number[], grid?: number): this
  rotate(point: number[], snapToAngle?: boolean): this
}

export interface Transformable {
  isAspectRatioLocked?: boolean
  transform(bounds: TransformedBounds): this
}

export interface HandlesMoveable {
  moveHandle(handleKey: string, delta: number[], snapToAngle?: boolean, grid?: number): this
}

export type TDCallbacks = Partial<TLCallbacks>

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Class<T> = new (...args: any[]) => T;
