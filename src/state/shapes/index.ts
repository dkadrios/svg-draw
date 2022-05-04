import type StateManager from '../StateManager'
import { freeDrawRegister } from './FreeDraw'
import { imageRegister } from './Image'
import { lineRegister } from './Line'
import { rectRegister } from './Rect'
import { textRegister } from './Text'

const registerShapes = (sm: StateManager) => {
  lineRegister(sm)
  rectRegister(sm)
  imageRegister(sm)
  freeDrawRegister(sm)
  textRegister(sm)
}

export default registerShapes
