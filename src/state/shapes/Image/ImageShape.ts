import { TDShapeType, Transformable, TransformedBounds } from 'types'
import { vec } from 'utils'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'
import { fileToBase64, getImagePropsAtPoint, getImageSizeFromSrc } from './utils'

export interface ImageEntity extends BaseEntity {
  type: TDShapeType.Image
  size: number[]
  src: string
}

interface ImageShapeCreateProps extends BaseShapeCreateProps {
  size: number[],
  src: string
}

class ImageShape extends BaseShape implements ImageEntity, Transformable {
  type = TDShapeType.Image as const

  isAspectRatioLocked = true

  size: number[]

  src: string

  static async createImageShapeFromFile(file: File, point: number[]) {
    const src = await fileToBase64(file)
    if (!src) throw new Error('Failed to create src')
    const size = await getImageSizeFromSrc(src)

    return new ImageShape(getImagePropsAtPoint(point, size, src))
  }

  static async createImageShapeFromUrl(url: string, point: number[]) {
    if (!url) throw Error('no url')
    const size = await getImageSizeFromSrc(url)

    return new ImageShape(getImagePropsAtPoint(point, size, url))
  }

  constructor(shape: ImageShapeCreateProps) {
    super(shape)
    this.size = shape.size || [1, 1]
    this.src = shape.src
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
}
export default ImageShape
