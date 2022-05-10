import * as React from 'react'
import styled from '@emotion/styled'
import { getTextSize } from './textUtils'

const TextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;
`

const InnerWrapper = styled.div`
  position: absolute;
  padding: 4px;
  z-index: 1;
  min-height: 1px;
  min-width: 1px;
  line-height: 1;
  letter-spacing: -0.03em;
  outline: 0;
  font-weight: 500;
  text-align: center;
  backface-visibility: hidden;
  user-select: none;
  webkit-user-select: none;
  webkit-touch-callout: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`

export interface TextLabelProps {
  font: string
  text: string
  color: string
  offsetY?: number
  offsetX?: number
  scale?: number
}

export const TextLabel = ({
  font,
  text,
  color,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
}: TextLabelProps) => {
  const { height, width } = getTextSize(text, font)

  const rInnerWrapper = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const elm = rInnerWrapper.current
    if (!elm) return
    elm.style.transform = `scale(${scale}, ${scale}) translate(${offsetX}px, ${offsetY}px)`
    elm.style.width = `${width }px`
    elm.style.height = `${height }px`
  }, [width, height, offsetY, offsetX, scale])

  return (
    <TextWrapper>
      <InnerWrapper
        ref={rInnerWrapper}
        style={{
          font,
          color,
        }}
      >
        {text}
        &#8203;
      </InnerWrapper>
    </TextWrapper>
  )
}
