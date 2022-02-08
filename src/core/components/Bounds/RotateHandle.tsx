import * as React from 'react'
import { useBoundsHandleEvents } from '../../hooks'
import type { TLBounds } from '../../types'

interface RotateHandleProps {
  bounds: TLBounds
  size: number
  targetSize: number
  isHidden: boolean
}

const RotateHandle = ({ bounds, targetSize, size, isHidden }: RotateHandleProps) => {
  const events = useBoundsHandleEvents('rotate')

  return (
    <g
      cursor="grab"
      opacity={isHidden ? 0 : 1}
    >
      <circle
        aria-label="rotate handle transparent"
        className="tl-transparent"
        cx={bounds.width / 2}
        cy={size * -2}
        pointerEvents={isHidden ? 'none' : 'all'}
        r={targetSize}
        {...events}
      />
      <circle
        aria-label="rotate handle"
        className="tl-rotate-handle"
        cx={bounds.width / 2}
        cy={size * -2}
        pointerEvents="none"
        r={size / 2}
      />
    </g>
  )
}
export default RotateHandle
