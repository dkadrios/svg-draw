import * as React from 'react'
import { strokeWidths } from 'types'
import { SVGContainer, TLShapeUtil } from 'core'
import type RectShape from './RectShape'

class RectUtil extends TLShapeUtil<RectShape, SVGSVGElement> {
  Component = TLShapeUtil.Component<RectShape, SVGSVGElement>(({ shape, events }, ref) => (
    <SVGContainer
      ref={ref}
      {...events}
    >
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
  ))

  Indicator = TLShapeUtil.Indicator<RectShape>(data => (
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
export default RectUtil
