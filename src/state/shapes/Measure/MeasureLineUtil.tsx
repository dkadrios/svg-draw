import React from 'react'
import { SVGContainer, TLComponentProps, TLShapeUtil } from 'core'
import { getSvgLineProps } from 'utils'
import { TextLabel } from '../shared/TextLabel'
import { getFontStyle, getTextSize } from '../shared/textUtils'
import type MeasureLineShape from './MeasureLineShape'

type T = MeasureLineShape

class MeasureLineUtil extends TLShapeUtil<T> {
  static labels = new WeakMap<T, string>([])

  hideBounds = true

  Component({ shape, events }: TLComponentProps<T>) {
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
                height={bounds.height + 200}
                width={bounds.width + 200}
                x={-100}
                y={-100}
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
          <g
            mask={`url(#${shape.id}_clip)`}
            pointerEvents="none"
          >
            <line
              className="tl-stroke-hitarea"
              {...getSvgLineProps(start.point, end.point)}
            />
            <line
              stroke="black"
              strokeWidth="1"
              {...getSvgLineProps(start.point, end.point)}
            />
            {/* Draw measure line tips */}
            <line
              stroke="black"
              strokeWidth="1"
              {...getSvgLineProps(startTip.start, startTip.end)}
            />
            <line
              stroke="black"
              strokeWidth="1"
              {...getSvgLineProps(endTip.start, endTip.end)}
            />
          </g>
        </SVGContainer>
      </>
    )
  }
}
export default new MeasureLineUtil()
