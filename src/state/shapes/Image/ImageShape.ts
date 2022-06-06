import {
  TDShapeType,
  Transformable,
  TransformedBounds,
} from 'types'
import { toFixed } from 'utils/vec'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'
import { fileToBase64, getImagePropsAtPoint, getImageSizeFromSrc } from './utils'

export interface ImageEntity extends BaseEntity {
  type: TDShapeType.Image
  size: number[]
  src: string,
}

export interface ImageShapeCreateProps extends BaseShapeCreateProps {
  size: number[],
  src: string,
}

class ImageShape extends BaseShape implements ImageEntity, Transformable {
  type = TDShapeType.Image as const

  isAspectRatioLocked = true

  originalSize: number[]

  size: number[]

  src: string

  static async createImageShapeFromFile(file: File, point: number[], props: Partial<ImageEntity> = {}) {
    const src = await fileToBase64(file)
    if (!src) throw new Error('Failed to create src')
    const size = await getImageSizeFromSrc(src)

    return new ImageShape({ ...getImagePropsAtPoint(point, size, src), ...props })
  }

  static async createImageShapeFromUrl(url: string, point: number[], props: Partial<ImageEntity> = {}) {
    if (!url) throw Error('no url')
    const size = await getImageSizeFromSrc(url)

    return new ImageShape({ ...getImagePropsAtPoint(point, size, url), ...props })
  }

  constructor(shape: ImageShapeCreateProps) {
    super(shape)
    this.size = shape.size || [1, 1]
    this.originalSize = this.size
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
      size: toFixed([newBounds.width, newBounds.height]),
      point: toFixed([newBounds.minX, newBounds.minY]),
    })
  }

  /* Set one of dimensions, keeping aspect ratio */
  setDimension(dim: { width: number } | { height: number }) {
    const os = this.originalSize
    if ('width' in dim) {
      return this.produce({ size: [dim.width, Math.round(os[1] * (dim.width / os[0]))] })
    }
    if ('height' in dim) {
      return this.produce({ size: [Math.round(os[0] * (dim.height / os[1])), dim.height] })
    }
    return this
  }

  getEntity() {
    return {
      ...super.getEntity(),
      size: this.size,
      src: this.src,
    } as ImageEntity
  }
}
export default ImageShape
