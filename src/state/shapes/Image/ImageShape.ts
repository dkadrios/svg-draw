import {
  BASE_SCALE,
  BgImageRatioScale,
  TDShapeType,
  Transformable,
  TransformedBounds,
  Unit,
} from 'types'
import { toFixed } from 'utils/vec'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'
import { fileToBase64, getImagePropsAtPoint, getImageSizeFromSrc } from './utils'

export type BgImageScale = {
  direction: 'horizontal' | 'vertical'
  distance: number,
  unit: Unit
}

export interface ImageEntity extends BaseEntity {
  type: TDShapeType.Image
  size: number[]
  src: string,
  isBackground: boolean,
  scale?: BgImageScale
}

export interface ImageShapeCreateProps extends BaseShapeCreateProps {
  size: number[],
  src: string,
  isBackground?: boolean,
  scale?: BgImageScale
}

class ImageShape extends BaseShape implements ImageEntity, Transformable {
  type = TDShapeType.Image as const

  isAspectRatioLocked = true

  size: number[]

  src: string

  isBackground: boolean

  scale?: BgImageScale

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
    this.src = shape.src
    this.isBackground = !!shape.isBackground
    this.scale = shape.scale || undefined
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

  getScale(): BgImageRatioScale {
    if (!this.isBackground || !this.scale) return BASE_SCALE
    const distPx = this.scale.direction === 'horizontal' ? this.size[0] : this.size[1]
    return {
      ratio: this.scale.distance / distPx,
      unit: this.scale.unit,
    }
  }

  getEntity() {
    return {
      ...super.getEntity(),
      size: this.size,
      src: this.src,
      isBackground: this.isBackground,
      scale: this.scale,
    } as ImageEntity
  }
}
export default ImageShape
