import { TLCallbackNames, TLCallbacks, TLHandle, TLPage, TLPageState, TLShape } from 'core'
import type { FreeDrawSession, LineSession, RotateSession, TextEditSession, TransformSession, TranslateSession } from 'state/sessions'
import type StateManager from 'state'

// Re-export core types
export * from './core/types'

export type TDSettings = {
  hideGrid: boolean
  grid: number
}

export type TDPageState = TLPageState & { settings: TDSettings }

export type ShapeStyle = {
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

export type ShapeStyleKey = keyof ShapeStyle
export type ShapeStyleKeys = ShapeStyleKey[]

export enum TDShapeType {
  Rectangle = 'rectangle',
  Line = 'line',
  FreeDraw = 'freedraw',
  Text = 'text',
  Image = 'image'
}

export enum TDToolType {
  Select = 'select',
  Rectangle = 'rectangle',
  Line = 'line',
  FreeDraw = 'freedraw',
  Text = 'text'
}

export interface TDBaseShape extends TLShape {
  styles?: Partial<ShapeStyle>
  type: TDShapeType
}

export interface RectShape extends TDBaseShape {
  type: TDShapeType.Rectangle
  size: number[]
  styles: Pick<ShapeStyle, 'color' | 'fill' | 'size'>;
}

export interface LineShape extends TDBaseShape {
  type: TDShapeType.Line
  handles: {
    start: TLHandle
    end: TLHandle
  }
  styles: Pick<ShapeStyle, 'color' | 'size'>;
}

export interface FreeDrawShape extends TDBaseShape {
  type: TDShapeType.FreeDraw
  points: number[][]
  styles: Pick<ShapeStyle, 'color' | 'size'>;
}

export interface TextShape extends TDBaseShape {
  type: TDShapeType.Text
  text: string
  styles: Pick<ShapeStyle, 'color' | 'scale'>;
}

export interface ImageShape extends TDBaseShape {
  type: TDShapeType.Image
  size: number[]
  src: string,
}

// A union of all shapes
export type TDShape = RectShape | LineShape | FreeDrawShape | TextShape | ImageShape

export type TDSession =
  TranslateSession |
  RotateSession |
  TransformSession |
  LineSession |
  FreeDrawSession |
  TextEditSession

export type CallbacksList = {
  [index in TLCallbackNames]?: (
    stateManager: StateManager,
    a: Parameters<TLCallbacks[index]>[0],
    b: Parameters<TLCallbacks[index]>[1],
    c: Parameters<TLCallbacks[index]>[2],
    ) => void
};

export type TDCallbacks = Partial<TLCallbacks>
