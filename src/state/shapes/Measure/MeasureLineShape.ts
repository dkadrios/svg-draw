import { HandlesMoveable, TDShapeType } from 'types'
import { vec } from 'utils'
import { BaseEntity } from '../BaseShape'
import BaseLineShape, { LineShapeHandles } from '../BaseLineShape'

const TIP_LENGTH = 16

export interface MeasureLineEntity extends BaseEntity {
  type: TDShapeType.MeasureLine,
  handles: LineShapeHandles,
}

class MeasureLineShape extends BaseLineShape implements HandlesMoveable {
  type = TDShapeType.MeasureLine as const

  handles!: LineShapeHandles

  getDistance() {
    const { handles: { start, end } } = this
    return Math.round(vec.dist(start.point, end.point))
  }

  getDistanceLabel() {
    const scale = this.getStateManager().getScale()
    const distance = (this.getDistance() * scale.ratio).toFixed(2)
    return `${distance} ${scale.unit}`
  }

  // TODO: use <marker> syntax for these?
  getTips(tipLength = TIP_LENGTH) {
    const { handles: { start: { point: start }, end: { point: end } } } = this
    const halfTip = tipLength / 2
    const slope = vec.perpSlope(end, start)
    const { dx, dy } = vec.diffForSlope(slope)

    return {
      startTip: {
        start: [start[0] - halfTip * dx, start[1] - halfTip * dy],
        end: [start[0] + halfTip * dx, start[1] + halfTip * dy],
      },
      endTip: {
        start: [end[0] - halfTip * dx, end[1] - halfTip * dy],
        end: [end[0] + halfTip * dx, end[1] + halfTip * dy],
      },
    }
  }
}
export default MeasureLineShape
