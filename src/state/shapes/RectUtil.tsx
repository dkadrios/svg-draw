import * as React from 'react'
import type { ImageShape, RectShape, ShapeStyleKeys, TLBounds } from 'types'
import { TDShapeType, strokeWidths } from 'types'
import { vec } from 'utils/vec'
import { SVGContainer } from 'core'
import ShapeUtil from './ShapeUtil'

class RectUtil extends ShapeUtil<RectShape, SVGSVGElement> {
  type = TDShapeType.Rectangle as const

  shapeStyleKeys: ShapeStyleKeys = ['color', 'fill', 'size']

  Component = ShapeUtil.Component<RectShape, SVGSVGElement>(({ shape, events, meta }, ref) => (
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

  Indicator = ShapeUtil.Indicator<RectShape>(data => (
    <rect
      fill="none"
      height={data.shape.size[1]}
      pointerEvents="none"
      stroke="#0000dd"
      strokeWidth={1}
      width={data.shape.size[0]}
    />
  ))

  getBounds(shape: RectShape | ImageShape) {
    const [x, y] = shape.point
    const [width, height] = shape.size

    return {
      minX: x,
      maxX: x + width,
      minY: y,
      maxY: y + height,
      width,
      height,
    }
  }

  transform(shape: RectShape | ImageShape, newBounds: TLBounds) {
    return {
      size: vec.toFixed([newBounds.width, newBounds.height]),
      point: vec.toFixed([newBounds.minX, newBounds.minY]),
    }
  }
}
export default RectUtil
