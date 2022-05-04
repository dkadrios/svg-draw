import { TDShapeStyle, TDShapeStyleKeys, TDShapeType, TransformedBounds } from 'types'
import { translateBounds, vec } from 'utils'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'
import measurementHelper from './MeasurementHelper'

const fontSize = 28
const fontFace = '"Source Sans Pro", sans-serif'

type TextShapeStyles = Pick<TDShapeStyle, 'color' | 'scale'>

export interface TextEntity extends BaseEntity {
  type: TDShapeType.Text,
  text: string,
  styles: TextShapeStyles
}

interface TextShapeCreateProps extends BaseShapeCreateProps {
  text?: string,
}

class TextShape extends BaseShape implements TextEntity {
  type = TDShapeType.Text as const

  text: string

  styleProps: TDShapeStyleKeys = ['color', 'scale']

  styles!: TextShapeStyles

  constructor(shape: TextShapeCreateProps) {
    super(shape)
    this.text = shape.text || ''
    this.initStyles(shape.styles)
  }

  getBounds() {
    const { height, width } = measurementHelper.getSize(this.text, this.getFontStyle())

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
    const { styles: { scale = 1 } } = this
    const bounds = this.getBounds()

    return this.produce({
      point: vec.toFixed([bounds.minX, bounds.minY]),
      styles: {
        ...this.styles,
        scale: scale * Math.max(Math.abs(newBounds.scaleY), Math.abs(newBounds.scaleX)),
      },
    })
  }

  setText(text: string) {
    return this.produce({ text })
  }

  getFontStyle() {
    const { scale = 1 } = this.styles
    return `${fontSize * scale}px/1 ${fontFace}`
  }
}

export default TextShape
