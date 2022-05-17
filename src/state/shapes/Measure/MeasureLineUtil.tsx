import React from 'react'
import { SVGContainer, TLComponentProps, TLShapeUtil } from 'core'
import { getSvgLineProps } from 'utils'
import { TextLabel } from '../shared/TextLabel'
import { getFontStyle, getTextSize } from '../shared/textUtils'
import type MeasureLineShape from './MeasureLineShape'

class MeasureLineUtil extends TLShapeUtil<MeasureLineShape> {
  hideBounds = true

  Component({ shape, events }: TLComponentProps<MeasureLineShape>) {
    const { handles: { start, end } } = shape
    const { endTip, startTip } = shape.getTips()
    const font = getFontStyle()
    const dist = shape.getDistance()
    const label = shape.getDistanceLabel()
    const { height, width } = getTextSize(label, font)
    const bounds = shape.getBounds()
    const labelScale = Math.max(
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
          scale={labelScale}
          text={label}
        />
        <SVGContainer {...events}>
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
                height={height * labelScale}
                rx={4 * labelScale}
                ry={4 * labelScale}
                width={width * labelScale}
                x={bounds.width / 2 - (width / 2) * labelScale}
                y={bounds.height / 2 - (height / 2) * labelScale}
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
  }
}
export default new MeasureLineUtil()
