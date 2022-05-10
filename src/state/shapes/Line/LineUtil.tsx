import * as React from 'react'
import { TDShapeType, strokeWidths } from 'types'
import { SVGContainer, TLShapeUtil } from 'core'
import type LineShape from './LineShape'

type T = LineShape
type E = SVGSVGElement

class LineUtil extends TLShapeUtil<T, E> {
  hideBounds = true

  Component = TLShapeUtil.Component<T, E>(({ shape, events }, ref) => {
    const { handles: { start, end } } = shape

    return (
      <SVGContainer
        ref={ref}
        {...events}
      >
        <line
          className="tl-stroke-hitarea"
          x1={start.point[0]}
          x2={end.point[0]}
          y1={start.point[1]}
          y2={end.point[1]}
        />
        <line
          pointerEvents="stroke"
          stroke={shape.styles.color}
          strokeWidth={strokeWidths[shape.styles.size || 'M']}
          x1={start.point[0]}
          x2={end.point[0]}
          y1={start.point[1]}
          y2={end.point[1]}
        />
      </SVGContainer>
    )
  })

  Indicator = TLShapeUtil.Indicator<LineShape>(() => null)
}
export default LineUtil
