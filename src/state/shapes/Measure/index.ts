import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import MeasureLineShape from './MeasureLineShape'
import MeasureLineUtil from './MeasureLineUtil'

const measureLineRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.MeasureLine, MeasureLineShape, new MeasureLineUtil())
}

export { MeasureLineShape, MeasureLineUtil, measureLineRegister }
export type { MeasureLineEntity } from './MeasureLineShape'
