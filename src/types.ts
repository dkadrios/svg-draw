import type { TLCallbacks, TLPage, TLPageState, TransformedBounds } from 'core'
import type { TDEntity, TDShape } from './state/shapes/types'

// Re-export core types
export * from './core/types'
// Re-export shape types
export { TDEntity, TDShape }

/* Scale for measure tool */
export type Unit = 'px' | 'mi' | 'ft' | 'km' | 'm'

/* Labels and short labels for measure tool units */
export const scaleUnits: Record<Unit, { label: string, short: string }> = {
  px: { label: 'Pixels', short: 'px' },
  mi: { label: 'Miles', short: 'mi' },
  ft: { label: 'Feet', short: 'ft' },
  km: { label: 'Kilometers', short: 'km' },
  m: { label: 'Meters', short: 'm' },
}

export interface CanvasRatioScale {
  ratio: number,
  unit: Unit
}

export const BASE_SCALE: CanvasRatioScale = {
  ratio: 1,
  unit: 'px',
}

/* Page State */
export type TDSettings = {
  hideGrid: boolean
  grid: number
}

export type TDPageState = TLPageState & { settings: TDSettings }

export type TDPage = TLPage<TDShape> & {
  canvas: {
    scale?: CanvasRatioScale
  }
}

export type TDShapeStyle = {
  color: string
  fill: string,
  size: 'S' | 'M' | 'L'
}

export const DEFAULT_STYLES: TDShapeStyle = {
  color: '#000000',
  fill: 'transparent',
  size: 'M',
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
  Text = 'text',
  MeasureLine = 'measure_line',
}

export type TDShapesList = Record<string, TDShape>
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

export interface TDDocumentViewSettings {
  modifyLocked: boolean
  styles: boolean,
  grid: boolean,
  tools: { [key in TDToolType]: boolean }
}

export interface TDDocument {
  page: TLPage<TDEntity>,
  pageState?: TDPageState
  settings?: TDDocumentViewSettings
}

export type TDToolsSettings = TDDocumentViewSettings['tools']

export const DEFAULT_VIEW_SETTINGS: TDDocumentViewSettings = {
  modifyLocked: false,
  styles: true,
  grid: true,
  tools: Object.values(TDToolType).reduce((acc, t) => (
    { ...acc, [t]: true }), {} as TDToolsSettings),
}
