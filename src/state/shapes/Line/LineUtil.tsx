import * as React from 'react'
import { TLComponentProps, strokeWidths } from 'types'
import { SVGContainer, TLShapeUtil } from 'core'
import type LineShape from './LineShape'

type T = LineShape

class LineUtil extends TLShapeUtil<T> {
  hideBounds = true

  Component = ({ shape, events }: TLComponentProps<T>) => {
    const { handles: { start, end } } = shape

    return (
      <SVGContainer {...events}>
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
  }
}
export default new LineUtil()
