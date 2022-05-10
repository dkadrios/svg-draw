import type StateManager from '../StateManager'
import { freeDrawRegister } from './FreeDraw'
import { imageRegister } from './Image'
import { lineRegister } from './Line'
import { rectRegister } from './Rect'
import { textRegister } from './Text'
import { measureLineRegister } from './Measure'

const registerShapes = (sm: StateManager) => {
  lineRegister(sm)
  rectRegister(sm)
  imageRegister(sm)
  freeDrawRegister(sm)
  textRegister(sm)
  measureLineRegister(sm)
}

export default registerShapes
