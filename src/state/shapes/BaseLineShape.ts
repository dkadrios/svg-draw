import { produce } from 'immer'
import type { TLHandle } from 'core'
import { HandlesMoveable } from 'types'
import { getBoundsFromPoints, snapAngleToSegments, translateBounds } from 'utils'
import { add, angle, isEqual, rotWith, snap, sub, toFixed } from 'utils/vec'
import BaseShape, { BaseShapeCreateProps } from './BaseShape'

export type LineShapeHandles = {
  start: TLHandle,
  end: TLHandle
}

export type LineShapeHandleKeys = 'start' | 'end'

export interface BaseLineShapeCreateProps extends BaseShapeCreateProps {
  handles?: LineShapeHandles
}

// Base class for line-based shapes, namely Line and MeasureLine
abstract class BaseLineShape extends BaseShape implements HandlesMoveable {
  handles: LineShapeHandles

  constructor(shape: BaseLineShapeCreateProps) {
    super(shape)

    this.handles = shape.handles || {
      start: { id: 'start', index: 0, point: [0, 0] },
      end: { id: 'end', index: 1, point: [1, 1] },
    }
  }

  getBounds() {
    const { handles: { start, end }, point } = this
    const bounds = getBoundsFromPoints([start.point, end.point])
    return translateBounds(bounds, point)
  }

  moveHandle(handleKey: LineShapeHandleKeys, rawDelta: number[], snapToAngle = false, grid = 1): this {
    return produce(this, (draft: this) => {
      // Handle being dragged
      const handle = draft.handles[handleKey]

      const delta = snapToAngle
        ? draft.getHandleSnappedToAngle(handle, rawDelta)
        : rawDelta

      handle.point = toFixed(snap(add(handle.point, delta), grid))

      const topLeft = draft.point
      const nextBounds = draft.getBounds()
      const offset = sub([nextBounds.minX, nextBounds.minY], topLeft)

      // Move shape point to exclude situation with negative handle coords
      if (!isEqual(offset, [0, 0])) {
        draft.handles.start.point = toFixed(sub(draft.handles.start.point, offset))
        draft.handles.end.point = toFixed(sub(draft.handles.end.point, offset))
        draft.point = toFixed(add(draft.point, offset))
      }
    })
  }

  // Move handle by delta and snap it to 15 degree angles
  private getHandleSnappedToAngle(handle: TLHandle, delta: number[]) {
    const { handles: { start, end } } = this
    const A = (handle === start ? end : start).point
    const B = handle.point
    const C = toFixed(add(B, delta))
    const an = angle(A, C)
    const adjusted = rotWith(C, A, snapAngleToSegments(an, 24) - an)
    return add(delta, sub(adjusted, C))
  }
}

export default BaseLineShape
