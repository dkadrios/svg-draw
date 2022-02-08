import * as React from 'react'
import { useBoundsHandleEvents } from '../../hooks'
import { TLBounds, TLBoundsCorner } from '../../types'

const cornerBgClassnames = {
  [TLBoundsCorner.TopLeft]: 'tl-cursor-nwse',
  [TLBoundsCorner.TopRight]: 'tl-cursor-nesw',
  [TLBoundsCorner.BottomRight]: 'tl-cursor-nwse',
  [TLBoundsCorner.BottomLeft]: 'tl-cursor-nesw',
}

interface CornerHandleProps {
  size: number
  targetSize: number
  bounds: TLBounds
  corner: TLBoundsCorner
  isHidden?: boolean
}

const CornerHandle = ({ size, targetSize, isHidden, corner, bounds }: CornerHandleProps) => {
  const events = useBoundsHandleEvents(corner)

  const isTop = corner === TLBoundsCorner.TopLeft || corner === TLBoundsCorner.TopRight
  const isLeft = corner === TLBoundsCorner.TopLeft || corner === TLBoundsCorner.BottomLeft

  return (
    <g opacity={isHidden ? 0 : 1}>
      <rect
        aria-label="corner transparent"
        className={`tl-transparent ${ isHidden ? '' : cornerBgClassnames[corner]}`}
        height={targetSize * 2}
        pointerEvents={isHidden ? 'none' : 'all'}
        width={targetSize * 2}
        x={(isLeft ? -1 : bounds.width + 1) - targetSize}
        y={(isTop ? -1 : bounds.height + 1) - targetSize}
        {...events}
      />
      <rect
        aria-label="corner handle"
        className="tl-corner-handle"
        height={size}
        pointerEvents="none"
        width={size}
        x={(isLeft ? -1 : bounds.width + 1) - size / 2}
        y={(isTop ? -1 : bounds.height + 1) - size / 2}
      />
    </g>
  )
}
export default CornerHandle
