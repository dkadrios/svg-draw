import * as React from 'react'
import type { LineShape, ShapeStyleKeys } from 'types'
import { TDShapeType, strokeWidths } from 'types'
import { getBoundsFromPoints, translateBounds } from 'utils'
import { SVGContainer } from 'core'
import ShapeUtil from './ShapeUtil'

type T = LineShape
type E = SVGSVGElement

class LineUtil extends ShapeUtil<T, E> {
  type = TDShapeType.Line as const

  shapeStyleKeys: ShapeStyleKeys = ['color', 'size']

  hideBounds = true

  Component = ShapeUtil.Component<T, E>(({ shape, events, meta }, ref) => {
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

  Indicator = ShapeUtil.Indicator<LineShape>(() => null)

  getBounds(shape: LineShape) {
    const { handles: { start, end }, point } = shape
    const bounds = getBoundsFromPoints([start.point, end.point])
    return translateBounds(bounds, point)
  }
}
export default LineUtil
