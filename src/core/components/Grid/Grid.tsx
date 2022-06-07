import React from 'react'
import type { TLPageState } from 'core/types'
import { modulate } from 'utils'

const STEPS = [
  [-1, 0.15, 64],
  [0.05, 0.375, 16],
  [0.15, 1, 4],
  [0.7, 2.5, 1],
]

const Grid = ({ grid, camera }: { camera: TLPageState['camera']; grid: number }) => (
  <svg
    className="tl-grid"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {STEPS.map(([min, mid, size], i) => {
        const s = size * grid * camera.zoom
        const xo = camera.point[0] * camera.zoom
        const yo = camera.point[1] * camera.zoom
        const gxo = xo > 0 ? xo % s : s + (xo % s)
        const gyo = yo > 0 ? yo % s : s + (yo % s)
        const opacity = camera.zoom < mid ? modulate(camera.zoom, [min, mid], [0, 1]) : 1

        return (
          <pattern
            height={s}
            id={`grid-${i}`}
            key={`grid-pattern-${i}`}
            patternUnits="userSpaceOnUse"
            width={s}
          >
            <circle
              className="tl-grid-dot"
              cx={gxo}
              cy={gyo}
              opacity={opacity}
              r={1}
            />
          </pattern>
        )
      })}
    </defs>
    {STEPS.map((_, i) => (
      <rect
        fill={`url(#grid-${i})`}
        height="100%"
        key={`grid-rect-${i}`}
        width="100%"
      />
    ))}
  </svg>
)
export default Grid
