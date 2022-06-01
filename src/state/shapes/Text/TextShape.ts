import { TDShapeStyle, TDShapeStyleKeys, TDShapeType, TransformedBounds } from 'types'
import { translateBounds } from 'utils'
import { toFixed } from 'utils/vec'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'
import { getFontStyle, getTextSize } from '../shared/textUtils'

type TextShapeStyles = Pick<TDShapeStyle, 'color'>

export interface TextEntity extends BaseEntity {
  type: TDShapeType.Text,
  text: string,
  scale: number,
  styles: TextShapeStyles
}

interface TextShapeCreateProps extends BaseShapeCreateProps {
  text?: string,
}

class TextShape extends BaseShape implements TextEntity {
  type = TDShapeType.Text as const

  text: string

  scale = 1

  styleProps: TDShapeStyleKeys = ['color']

  styles!: TextShapeStyles

  constructor(shape: TextShapeCreateProps) {
    super(shape)
    this.text = shape.text || ''
    this.initStyles(shape.styles)
  }

  getBounds() {
    const { height, width } = getTextSize(this.text, this.getFontStyle())

    return translateBounds({
      minX: 0,
      maxX: width,
      minY: 0,
      maxY: height,
      width,
      height,
    }, this.point)
  }

  transform(newBounds: TransformedBounds) {
    const { scale = 1 } = this
    const bounds = this.getBounds()

    return this.produce({
      point: toFixed([bounds.minX, bounds.minY]),
      scale: scale * Math.max(Math.abs(newBounds.scaleY), Math.abs(newBounds.scaleX)),
    })
  }

  setText(text: string) {
    return this.produce({ text })
  }

  getFontStyle() {
    return getFontStyle(this.scale)
  }

  getEntity() {
    return { ...super.getEntity(), text: this.text, scale: this.scale } as TextEntity
  }
}

export default TextShape
