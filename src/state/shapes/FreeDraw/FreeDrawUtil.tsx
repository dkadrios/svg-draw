import React, { useMemo } from 'react'
import { TLComponentProps, strokeWidths } from 'types'
import { med } from 'utils/vec'
import { SVGContainer, TLShapeUtil } from 'core'
import type FreeDrawShape from './FreeDrawShape'

type T = FreeDrawShape

// Regex to trim numbers to 2 decimal places
export const TRIM_NUMBERS = /(\s?[A-Z]?,?-?[0-9]*\.[0-9]{0,2})(([0-9]|e|-)*)/g

class FreeDrawUtil extends TLShapeUtil<T> {
  Component = ({ shape, isSelected, isGhost, events }: TLComponentProps<T>) => {
    const { points, styles: { color, size } } = shape

    const pathTDSnapshot = useMemo(() => this.getSVGPathFromPoints(points), [points])

    // No stroke styles for now
    const strokeDasharray = 'none'
    const strokeDashoffset = 'none'
    const strokeWidth = strokeWidths[size || 'M']

    return (
      <SVGContainer
        id={`${shape.id }_svg`}
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
  }

  getSVGPathFromPoints(points: number[][]) {
    if (!points.length) return ''
    if (points.length < 2) return 'M 0 0 L 0 0'

    const max = points.length - 1
    return points.reduce(
      (acc, point, i, arr) => {
        if (i !== max) acc.push(point, med(point, arr[i + 1]))
        return acc
      },
      ['M', points[0], 'Q'],
    ).join(' ').replaceAll(TRIM_NUMBERS, '$1')
  }
}
export default new FreeDrawUtil()
