import { CanvasRatioScale, HandlesMoveable, TDShapeType, scaleUnits } from 'types'
import { diffForSlope, dist, perpSlope } from 'utils/vec'
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
    return Math.round(dist(start.point, end.point))
  }

  getDistanceLabel(scale: CanvasRatioScale) {
    const distance = (this.getDistance() * scale.ratio).toFixed(2)
    return `${distance} ${scaleUnits[scale.unit].short}`
  }

  // TODO: use <marker> syntax for these?
  getTips(tipLength = TIP_LENGTH) {
    const { handles: { start: { point: start }, end: { point: end } } } = this
    const halfTip = tipLength / 2
    const slope = perpSlope(end, start)
    const { dx, dy } = diffForSlope(slope)

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

  getEntity() {
    return { ...super.getEntity(), handles: this.handles } as MeasureLineEntity
  }
}
export default MeasureLineShape
