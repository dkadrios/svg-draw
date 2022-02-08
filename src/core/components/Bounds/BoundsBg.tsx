/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import type { TLBounds } from '../../types'
import { useBoundsEvents } from '../../hooks'
import Container from '../Container'
import SVGContainer from '../SVGContainer'

interface BoundsBgProps {
  bounds: TLBounds
  rotation: number
  isHidden: boolean
}

/**
 * Background of bounds rect when user selects a shape
 */
const BoundsBg = ({ bounds, rotation, isHidden }: BoundsBgProps) => {
  const events = useBoundsEvents()

  return (
    <Container
      bounds={bounds}
      rotation={rotation}
    >
      <SVGContainer>
        <rect
          aria-label="bounds bg"
          className="tl-bounds-bg"
          height={bounds.height}
          opacity={isHidden ? 0 : 1}
          width={bounds.width}
          {...events}
        />
      </SVGContainer>
    </Container>
  )
}
export default BoundsBg
