import { HandlesMoveable, TDShapeStyle, TDShapeStyleKeys, TDShapeType } from 'types'
import { BaseEntity } from '../BaseShape'
import BaseLineShape, { BaseLineShapeCreateProps, LineShapeHandles } from '../BaseLineShape'

type LineShapeStyles = Pick<TDShapeStyle, 'color' | 'size'>

export interface LineEntity extends BaseEntity {
  type: TDShapeType.Line,
  handles: LineShapeHandles,
  styles: LineShapeStyles
}

class LineShape extends BaseLineShape implements LineEntity, HandlesMoveable {
  type = TDShapeType.Line as const

  handles!: LineShapeHandles

  styleProps: TDShapeStyleKeys = ['color', 'size']

  styles!: LineShapeStyles

  constructor(shape: BaseLineShapeCreateProps) {
    super(shape)

    this.initStyles(shape.styles)
  }

  getEntity() {
    return { ...super.getEntity(), handles: this.handles } as LineEntity
  }
}

export default LineShape
