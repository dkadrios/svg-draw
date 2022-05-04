import { produce } from 'immer'
import type { TLHandle } from 'core'
import { HandlesMoveable, TDShapeStyle, TDShapeStyleKeys, TDShapeType } from 'types'
import { getBoundsFromPoints, snapAngleToSegments, translateBounds, vec } from 'utils'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from '../BaseShape'

type LineShapeHandles = {
  start: TLHandle,
  end: TLHandle
}

type LineShapeHandleKeys = 'start' | 'end'

type LineShapeStyles = Pick<TDShapeStyle, 'color' | 'size'>

export interface LineEntity extends BaseEntity {
  type: TDShapeType.Line,
  handles: LineShapeHandles,
  styles: LineShapeStyles
}

interface LineShapeCreateProps extends BaseShapeCreateProps {
  handles?: LineShapeHandles,
}

class LineShape extends BaseShape implements LineEntity, HandlesMoveable {
  type = TDShapeType.Line as const

  handles: LineShapeHandles

  styleProps: TDShapeStyleKeys = ['color', 'size']

  styles!: LineShapeStyles

  constructor(shape: LineShapeCreateProps) {
    super(shape)

    this.handles = shape.handles || {
      start: { id: 'start', index: 0, point: [0, 0] },
      end: { id: 'end', index: 1, point: [1, 1] },
    }
    this.initStyles(shape.styles)
  }

  getBounds() {
    const { handles: { start, end }, point } = this
    const bounds = getBoundsFromPoints([start.point, end.point])
    return translateBounds(bounds, point)
  }

  moveHandle(handleKey: LineShapeHandleKeys, rawDelta: number[], snapToAngle = false, grid = 1) {
    return produce(this, (draft: LineShape) => {
      // Handle being dragged
      const handle = draft.handles[handleKey]

      const delta = snapToAngle
        ? this.getHandleSnappedToAngle(handle, rawDelta)
        : rawDelta
      handle.point = vec.snap(vec.add(handle.point, delta), grid)

      const topLeft = draft.point
      const nextBounds = draft.getBounds()
      const offset = vec.sub([nextBounds.minX, nextBounds.minY], topLeft)

      // Move shape point to exclude situation with negative handle coords
      if (!vec.isEqual(offset, [0, 0])) {
        draft.handles.start.point = vec.toFixed(vec.sub(draft.handles.start.point, offset))
        draft.handles.end.point = vec.toFixed(vec.sub(draft.handles.end.point, offset))
        draft.point = vec.toFixed(vec.add(draft.point, offset))
      }
    })
  }

  // Move handle by delta and snap it to 15 degree angles
  private getHandleSnappedToAngle(handle: TLHandle, delta: number[]) {
    const { handles: { start, end } } = this
    const A = (start === handle ? end : start).point
    const B = handle.point
    const C = vec.toFixed(vec.add(B, delta))
    const angle = vec.angle(A, C)
    const adjusted = vec.rotWith(C, A, snapAngleToSegments(angle, 24) - angle)
    return vec.add(delta, vec.sub(adjusted, C))
  }
}

export default LineShape
