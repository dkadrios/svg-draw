import * as React from 'react'
import type { FreeDrawShape, ShapeStyleKeys, TLBounds, TransformedBounds } from 'types'
import { TDShapeType, strokeWidths } from 'types'
import { getBoundsFromPoints, translateBounds, vec } from 'utils'
import { SVGContainer } from 'core'
import ShapeUtil from './ShapeUtil'

type T = FreeDrawShape
type E = SVGSVGElement

// Regex to trim numbers to 2 decimal places
export const TRIM_NUMBERS = /(\s?[A-Z]?,?-?[0-9]*\.[0-9]{0,2})(([0-9]|e|-)*)/g

class FreeDrawUtil extends ShapeUtil<T, E> {
  type = TDShapeType.FreeDraw as const

  shapeStyleKeys: ShapeStyleKeys = ['color', 'size']

  pointsBoundsCache = new WeakMap<T['points'], TLBounds>([])

  Component = ShapeUtil.Component<T, E>(({ shape, isSelected, isGhost, events }, ref) => {
    const { points, styles: { color, size } } = shape

    const pathTDSnapshot = React.useMemo(() => this.getSVGPathFromPoints(points), [points])

    // No stroke styles for now
    const strokeDasharray = 'none'
    const strokeDashoffset = 'none'
    const strokeWidth = strokeWidths[size || 'M']

    return (
      <SVGContainer
        id={`${shape.id }_svg`}
        ref={ref}
        {...events}
      >
        <g opacity={isGhost ? 0.5 : 1}>
          <path
            className={isSelected ? 'tl-fill-hitarea' : 'tl-stroke-hitarea'}
            d={pathTDSnapshot}
          />
          <path
            d={pathTDSnapshot}
            fill="none"
            pointerEvents="none"
            stroke="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={Math.min(4, strokeWidth * 2)}
          />
          <path
            d={pathTDSnapshot}
            fill="none"
            pointerEvents="none"
            stroke={color}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
          />
        </g>
      </SVGContainer>
    )
  })

  Indicator = ShapeUtil.Indicator<FreeDrawShape>(() => null)

  getBounds(shape: FreeDrawShape) {
    // The goal here is to avoid recalculating the bounds from the
    // points array, which is expensive. However, we still need a
    // new bounds if the point has changed, but we will reuse the
    // previous bounds-from-points result if we can.
    let bounds = this.pointsBoundsCache.get(shape.points)
    if (!bounds) {
      bounds = getBoundsFromPoints(shape.points)
      this.pointsBoundsCache.set(shape.points, bounds)
    }
    return translateBounds(bounds, shape.point)
  }

  getSVGPathFromPoints(points: number[][]) {
    if (!points.length) return ''
    if (points.length < 2) return 'M 0 0 L 0 0'

    const max = points.length - 1
    return points.reduce(
      (acc, point, i, arr) => {
        if (i !== max) acc.push(point, vec.med(point, arr[i + 1]))
        return acc
      },
      ['M', points[0], 'Q'],
    ).join(' ').replaceAll(TRIM_NUMBERS, '$1')
  }

  transform(shape: T, bounds: TransformedBounds): Partial<T> {
    const initialShapeBounds = this.getBounds(shape)

    const points = shape.points.map(([x, y]) => [
      bounds.width
        * (bounds.scaleX < 0 // * sin?
          ? 1 - x / initialShapeBounds.width
          : x / initialShapeBounds.width),
      bounds.height
        * (bounds.scaleY < 0 // * cos?
          ? 1 - y / initialShapeBounds.height
          : y / initialShapeBounds.height),
    ])

    const newBounds = getBoundsFromPoints(points)
    const point = vec.sub([bounds.minX, bounds.minY], [newBounds.minX, newBounds.minY])

    return { points, point }
  }
}
export default FreeDrawUtil
