import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import ImageShape from './ImageShape'
import ImageUtil from './ImageUtil'

const imageRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.Image, ImageShape, ImageUtil)
}

export { ImageShape, ImageUtil, imageRegister }
export type { ImageEntity } from './ImageShape'
