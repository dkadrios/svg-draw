import React from 'react'
import { SVGContainer, TLShapeUtil } from 'core'
import { TextLabel } from '../shared/TextLabel'
import { getFontStyle, getTextSize } from '../shared/textUtils'
import { getSvgLineProps } from '../../../utils'
import type MeasureLineShape from './MeasureLineShape'

type T = MeasureLineShape
type E = SVGSVGElement

class MeasureLineUtil extends TLShapeUtil<T, E> {
  hideBounds = true

  Component = TLShapeUtil.Component<T, E>(({ shape, events }, ref) => {
    const { handles: { start, end } } = shape
    const { endTip, startTip } = shape.getTips()
    const font = getFontStyle()
    const dist = shape.getDistance()
    const label = shape.getDistanceLabel()
    const { height, width } = getTextSize(label, font)
    const bounds = shape.getBounds()
    const scale = Math.max(
      0.5,
      Math.min(1, Math.max(dist / (height + 128), dist / (width + 128))),
    )

    return (
      <>
        <TextLabel
          color="black"
          font={font}
          offsetX={0}
          offsetY={0}
          scale={scale}
          text={label}
        />
        <SVGContainer
          ref={ref}
          {...events}
        >
          <defs>
            <mask id={`${shape.id}_clip`}>
              <rect
                fill="white"
                height={bounds.height}
                width={bounds.width}
                x={0}
                y={0}
              />
              <rect
                fill="black"
                height={height * scale}
                rx={4 * scale}
                ry={4 * scale}
                width={width * scale}
                x={bounds.width / 2 - (width / 2) * scale}
                y={bounds.height / 2 - (height / 2) * scale}
              />
            </mask>
          </defs>
          <line
            className="tl-stroke-hitarea"
            {...getSvgLineProps(start.point, end.point)}
          />
          <line
            mask={`url(#${shape.id}_clip)`}
            pointerEvents="stroke"
            stroke="black"
            strokeWidth="1"
            {...getSvgLineProps(start.point, end.point)}
          />
          {/* Draw measure line tips */}
          <line
            pointerEvents="stroke"
            stroke="black"
            strokeWidth="1"
            {...getSvgLineProps(startTip.start, startTip.end)}
          />
          <line
            pointerEvents="stroke"
            stroke="black"
            strokeWidth="1"
            {...getSvgLineProps(endTip.start, endTip.end)}
          />
        </SVGContainer>
      </>
    )
  })

  Indicator = TLShapeUtil.Indicator<MeasureLineShape>(() => null)
}
export default MeasureLineUtil
