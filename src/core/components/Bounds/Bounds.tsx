import React from 'react'
import { TLBounds, TLBoundsCorner, TLBoundsEdge } from 'core/types'
import Container from '../Container'
import SVGContainer from '../SVGContainer'
import CenterHandle from './CenterHandle'
import RotateHandle from './RotateHandle'
import CornerHandle from './CornerHandle'
import EdgeHandle from './EdgeHandle'

/**
 * Bounding box with resize and rotate handlers
 */
interface BoundsProps {
  zoom: number
  bounds: TLBounds
  rotation: number
  isLocked: boolean
  isHidden: boolean
  hideRotateHandle: boolean
  hideResizeHandles: boolean
}

const Bounds = ({
  zoom,
  bounds,
  rotation,
  isHidden,
  isLocked,
  hideResizeHandles,
  hideRotateHandle,
}: BoundsProps) => {
  // Touch target size
  const targetSize = 16 / zoom
  // Handle size
  const size = 8 / zoom

  const smallDimension = Math.min(bounds.width, bounds.height) * zoom
  // If the bounds are small, don't show the rotate handle
  const showRotateHandle = !hideRotateHandle && !isHidden && !isLocked && smallDimension > 32
  // If the bounds are very small, don't show the edge handles
  const showEdgeHandles = !isHidden && !isLocked && smallDimension > 24
  // If the bounds are very very small, don't show the corner handles
  const showCornerHandles = !isHidden && !isLocked && smallDimension > 20
  // Unless we're hiding the resize handles, show them
  const showResizeHandles = !hideResizeHandles && !isLocked

  return (
    <Container
      bounds={bounds}
      rotation={rotation}
    >
      <SVGContainer>
        <CenterHandle
          bounds={bounds}
          isHidden={isHidden}
          isLocked={isLocked}
        />
        {showResizeHandles && (
          <>
            <EdgeHandle
              bounds={bounds}
              edge={TLBoundsEdge.Top}
              isHidden={!showEdgeHandles}
              size={size}
            />
            <EdgeHandle
              bounds={bounds}
              edge={TLBoundsEdge.Right}
              isHidden={!showEdgeHandles}
              size={size}
            />
            <EdgeHandle
              bounds={bounds}
              edge={TLBoundsEdge.Bottom}
              isHidden={!showEdgeHandles}
              size={size}
            />
            <EdgeHandle
              bounds={bounds}
              edge={TLBoundsEdge.Left}
              isHidden={!showEdgeHandles}
              size={size}
            />
            <CornerHandle
              bounds={bounds}
              corner={TLBoundsCorner.TopLeft}
              isHidden={isHidden || !showCornerHandles}
              size={size}
              targetSize={targetSize}
            />
            <CornerHandle
              bounds={bounds}
              corner={TLBoundsCorner.TopRight}
              isHidden={isHidden || !showCornerHandles}
              size={size}
              targetSize={targetSize}
            />
            <CornerHandle
              bounds={bounds}
              corner={TLBoundsCorner.BottomRight}
              isHidden={isHidden || !showCornerHandles}
              size={size}
              targetSize={targetSize}
            />
            <CornerHandle
              bounds={bounds}
              corner={TLBoundsCorner.BottomLeft}
              isHidden={isHidden || !showCornerHandles}
              size={size}
              targetSize={targetSize}
            />
          </>
        )}
        {showRotateHandle && (
          <RotateHandle
            bounds={bounds}
            isHidden={!showEdgeHandles}
            size={size}
            targetSize={targetSize}
          />
        )}
      </SVGContainer>
    </Container>
  )
}
export default Bounds
