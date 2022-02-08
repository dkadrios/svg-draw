import * as React from 'react'
import { vec } from '../../../utils'
import type { TLHandle, TLShape } from '../../types'
import Handle from './Handle'

interface HandlesProps {
  shape: TLShape
  zoom: number
}

const Handles = ({ shape, zoom }: HandlesProps) => {
  if (shape.handles === undefined) {
    return null
  }

  let prev: number[] | null = null

  const handlesToShow = Object.values(shape.handles).reduce((acc, cur) => {
    const point = vec.add(cur.point, shape.point)

    if (!prev || vec.dist(point, prev) * zoom >= 32) {
      acc.push(cur)
      prev = point
    }

    return acc
  }, [] as TLHandle[])

  if (handlesToShow.length === 1) return null

  return (
    <>
      {handlesToShow.map(handle => (
        <Handle
          id={handle.id}
          key={`${shape.id }_${ handle.id}`}
          point={vec.add(handle.point, shape.point)}
        />
      ))}
    </>
  )
}
export default Handles
