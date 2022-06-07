import React from 'react'
import { translateBounds } from 'utils'
import { useHandleEvents } from 'core/hooks'
import Container from '../Container'
import SVGContainer from '../SVGContainer'

interface HandleProps {
  id: string
  point: number[]
}

const Handle = ({ id, point }: HandleProps) => {
  const events = useHandleEvents(id)

  return (
    <Container
      bounds={translateBounds(
        { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
        point,
      )}
    >
      <SVGContainer>
        <g
          aria-label="handle"
          className="tl-handle"
          {...events}
        >
          <circle
            className="tl-handle-bg"
            pointerEvents="all"
          />
          <circle
            className="tl-counter-scaled tl-handle"
            pointerEvents="none"
            r={4}
          />
        </g>
      </SVGContainer>
    </Container>
  )
}
export default Handle
