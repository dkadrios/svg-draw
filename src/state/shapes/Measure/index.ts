import { TDShapeType, TDToolType } from 'types'
import type StateManager from '../../StateManager'
import MeasureLineShape from './MeasureLineShape'
import MeasureLineUtil from './MeasureLineUtil'
import MeasureLineTool from './MeasureLineTool'

const measureLineRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.MeasureLine, MeasureLineShape, MeasureLineUtil)
  sm.registerTool(TDToolType.MeasureLine, new MeasureLineTool(sm))
}

export { MeasureLineShape, MeasureLineUtil, measureLineRegister }
export type { MeasureLineEntity } from './MeasureLineShape'
