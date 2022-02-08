import type { ShapeStyle, ShapeStyleKey, ShapeStyleKeys, TDShape, TLBounds } from 'types'
import { TDShapeType } from 'types'
import { TLShapeUtil } from '../../core'

abstract class ShapeUtil<T extends TDShape, E extends Element = any, M = any>
  extends TLShapeUtil<T, E, M> {
  // ShapeStyle field names actually used by a shape
  abstract shapeStyleKeys: ShapeStyleKeys

  isAspectRatioLocked = false

  type: TDShapeType | null = null

  canEdit = false

  transform(shape: TDShape, newBounds: TLBounds) {
    return {} as Partial<TDShape>
  }

  filterStyles(styles: ShapeStyle) {
    return Object.keys(styles).reduce((obj, key) => this.shapeStyleKeys.includes(key as ShapeStyleKey)
      ? { ...obj, [key]: styles[key as ShapeStyleKey] }
      : obj, {} as Partial<ShapeStyle>)
  }
}
export default ShapeUtil
