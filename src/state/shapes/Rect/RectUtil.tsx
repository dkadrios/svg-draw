import * as React from 'react'
import { TLComponentProps, TLIndicatorProps, strokeWidths } from 'types'
import { SVGContainer, TLShapeUtil } from 'core'
import type RectShape from './RectShape'

type T = RectShape

class RectUtil extends TLShapeUtil<RectShape> {
  Component = ({ shape, events }: TLComponentProps<T>) => (
    <SVGContainer {...events}>
      <rect
        fill={shape.styles.fill}
        height={shape.size[1]}
        pointerEvents="all"
        stroke={shape.styles.color}
        strokeLinejoin="round"
        strokeWidth={strokeWidths[shape.styles.size || 'M']}
        width={shape.size[0]}
      />
    </SVGContainer>
  )

  Indicator = (data: TLIndicatorProps<T>) => (
    <rect
      fill="none"
      height={data.shape.size[1]}
      pointerEvents="none"
      stroke="#0000dd"
      strokeWidth={1}
      width={data.shape.size[0]}
    />
  )
}
export default new RectUtil()
