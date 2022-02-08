import * as React from 'react'
import styled from '@emotion/styled'
import type { ImageShape, ShapeStyleKeys } from 'types'
import { TDShapeType } from 'types'
import { vec } from 'utils'
import { HTMLContainer } from 'core'
import ShapeUtil from './ShapeUtil'
import RectUtil from './RectUtil'

const IMAGE_EXTENSIONS = ['.png', '.svg', '.jpg', '.jpeg', '.gif']

const Wrapper = styled.div({
  pointerEvents: 'all',
  position: 'relative',
  fontFamily: 'sans-serif',
  fontSize: '2em',
  height: '100%',
  width: '100%',
  borderRadius: '3px',
  perspective: '800px',
  overflow: 'hidden',
  p: {
    userSelect: 'none',
  },
  img: {
    userSelect: 'none',
  },
})

const ImageElement = styled.img({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  minWidth: '100%',
  pointerEvents: 'none',
  objectFit: 'cover',
  userSelect: 'none',
  borderRadius: 2,
})

type T = ImageShape
type E = HTMLDivElement

class ImageUtil extends ShapeUtil<T, E> {
  type = TDShapeType.Rectangle as const

  isAspectRatioLocked = true

  shapeStyleKeys: ShapeStyleKeys = ['color', 'fill']

  Component = ShapeUtil.Component<T, E>(({ shape, events }, ref) => {
    const { size: [width, height] } = shape

    return (
      <HTMLContainer ref={ref} {...events}>
        <Wrapper
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <ImageElement
            alt="tl_image_asset"
            draggable={false}
            id={`${shape.id }_image`}
            src={shape.src}
          />
        </Wrapper>
      </HTMLContainer>
    )
  })

  Indicator = ShapeUtil.Indicator<T>(data => (
    <rect
      fill="none"
      height={data.shape.size[1]}
      pointerEvents="none"
      stroke="#0000dd"
      strokeWidth={1}
      width={data.shape.size[0]}
    />
  ))

  getBounds = RectUtil.prototype.getBounds

  transform = RectUtil.prototype.transform

  static getImageSizeFromSrc(src: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve([img.width, img.height])
      img.onerror = () => reject(new Error('Could not get image size'))
      img.src = src
    })
  }

  static getImageShapeAtPoint(point: number[], size: number[], src: string): Partial<ImageShape> {
    const [width, height] = size

    return {
      type: TDShapeType.Image,
      point: vec.toFixed([point[0] - width / 2, point[1] - height / 2]),
      size,
      src,
    }
  }

  static fileToBase64(file: Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
      reader.onabort = error => reject(error)
    })
  }

  static getImageShapeFromFile = async (file: File, point: number[]) => {
    const extension = file.name.match(/\.[0-9a-z]+$/i)
    if (!extension) throw TypeError('No extension')
    const isImage = IMAGE_EXTENSIONS.includes(extension[0].toLowerCase())
    if (!isImage) throw new TypeError('Wrong extension')

    const src = await ImageUtil.fileToBase64(file)
    if (!src) throw new Error('Failed to create src')
    const size = await ImageUtil.getImageSizeFromSrc(src)

    return ImageUtil.getImageShapeAtPoint(point, size, src)
  }

  static getImageShapeFromUrl = async (url: string, point: number[]) => {
    if (!url) throw Error('no url')
    const size = await ImageUtil.getImageSizeFromSrc(url)

    return ImageUtil.getImageShapeAtPoint(point, size, url)
  }
}

export default ImageUtil
