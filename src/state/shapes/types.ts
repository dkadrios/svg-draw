import { LineEntity, LineShape } from './Line'
import { RectEntity, RectShape } from './Rect'
import { TextEntity, TextShape } from './Text'
import { ImageEntity, ImageShape } from './Image'
import { FreeDrawEntity, FreeDrawShape } from './FreeDraw'
import { MeasureLineEntity, MeasureLineShape } from './Measure'

export type TDShapeConstructor =
  typeof LineShape |
  typeof RectShape |
  typeof TextShape |
  typeof ImageShape |
  typeof FreeDrawShape |
  typeof MeasureLineShape

export type TDEntity =
  LineEntity |
  RectEntity |
  FreeDrawEntity |
  TextEntity |
  ImageEntity |
  MeasureLineEntity

export type TDShape = InstanceType<TDShapeConstructor>
