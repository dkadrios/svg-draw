import * as React from 'react'
import type { TLShape } from '../../types'
import { usePosition, useTLContext } from '../../hooks'

interface IndicatorProps {
  shape: TLShape
  meta: Record<string, unknown>
  isSelected?: boolean
  isHovered?: boolean
  isEditing?: boolean
}

/*
 * Indicator for shape states: selected, hovered, editing
 * Most often is just a thin outline
 */
const ShapeIndicator = ({
  isHovered = false,
  isSelected = false,
  isEditing = false,
  shape,
  meta,
}: IndicatorProps) => {
  const { shapeUtils } = useTLContext()
  const utils = shapeUtils[shape.type]
  const bounds = shape.getBounds()
  const rPositioned = usePosition(bounds, shape.rotation)

  return (
    <div
      className={[
        'tl-indicator',
        'tl-absolute',
        isSelected ? 'tl-selected' : 'tl-hovered',
        isEditing ? 'tl-editing' : '',
      ].join(' ')}
      draggable={false}
      ref={rPositioned}
    >
      <svg
        height="100%"
        width="100%"
      >
        <g className="tl-centered-g">
          <utils.Indicator
            bounds={bounds}
            isHovered={isHovered}
            isSelected={isSelected}
            meta={meta}
            shape={shape}
          />
        </g>
      </svg>
    </div>
  )
}
export default ShapeIndicator
