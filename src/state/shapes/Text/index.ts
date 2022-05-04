import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import TextShape from './TextShape'
import TextUtil from './TextUtil'
import TextTool from './TextTool'

const textRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.Text, TextShape, new TextUtil())
  sm.registerTool(TDShapeType.Text, new TextTool(sm))
}

export { TextShape, TextUtil, TextTool, textRegister }
export type { TextEntity } from './TextShape'
