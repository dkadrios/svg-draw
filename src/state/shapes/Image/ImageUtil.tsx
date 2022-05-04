import * as React from 'react'
import styled from '@emotion/styled'
import { HTMLContainer, TLShapeUtil } from 'core'
import ImageShape from './ImageShape'

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

class ImageUtil extends TLShapeUtil<T, E> {
  Component = TLShapeUtil.Component<T, E>(({ shape, events }, ref) => {
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

  Indicator = TLShapeUtil.Indicator<T>(data => (
    <rect
      fill="none"
      height={data.shape.size[1]}
      pointerEvents="none"
      stroke="#0000dd"
      strokeWidth={1}
      width={data.shape.size[0]}
    />
  ))
}

export default ImageUtil
