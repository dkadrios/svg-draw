import { TDShapeStyle, TDShapeStyleKeys, TDShapeType, TransformedBounds } from 'types'
import { vec } from 'utils'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'

type RectShapeStyles = Pick<TDShapeStyle, 'color' | 'fill' | 'size'>

export interface RectEntity extends BaseEntity {
  type: TDShapeType.Rectangle,
  size: number[],
  styles: RectShapeStyles
}

interface RectShapeCreateProps extends BaseShapeCreateProps {
  size?: number[]
}

class RectShape extends BaseShape implements RectEntity {
  type = TDShapeType.Rectangle as const

  size: number[]

  styleProps: TDShapeStyleKeys = ['color', 'fill', 'size']

  styles!: RectShapeStyles

  constructor(shape: RectShapeCreateProps) {
    super(shape)
    this.size = shape.size || [1, 1]
    this.initStyles(shape.styles)
  }

  getBounds() {
    const { point: [x, y], size: [width, height] } = this
    return {
      minX: x,
      maxX: x + width,
      minY: y,
      maxY: y + height,
      width,
      height,
    }
  }

  transform(newBounds: TransformedBounds) {
    return this.produce({
      size: vec.toFixed([newBounds.width, newBounds.height]),
      point: vec.toFixed([newBounds.minX, newBounds.minY]),
    })
  }

  getEntity() {
    return { ...super.getEntity(), size: this.size } as RectShape
  }
}

export default RectShape
