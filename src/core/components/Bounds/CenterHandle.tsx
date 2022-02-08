import * as React from 'react'
import type { TLBounds } from '../../types'

export interface CenterHandleProps {
  bounds: TLBounds
  isLocked: boolean
  isHidden: boolean
}

const CenterHandle = ({ bounds, isLocked, isHidden }: CenterHandleProps) => (
  <rect
    aria-label="center handle"
    className={['tl-bounds-center', isLocked ? 'tl-dashed' : ''].join(' ')}
    height={bounds.height + 2}
    opacity={isHidden ? 0 : 1}
    pointerEvents="none"
    width={bounds.width + 2}
    x={-1}
    y={-1}
  />
)
export default CenterHandle
