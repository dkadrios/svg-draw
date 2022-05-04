import { TDShape } from '../types'
import type StateManager from './StateManager'

class BaseSession {
  shapeId?: string

  shape?: TDShape

  sm: StateManager

  constructor(stateManager: StateManager) {
    this.sm = stateManager
  }

  captureShape(id?: string) {
    const shape = id ? this.sm.getShape(id) : this.sm.getSelectedShape()
    if (!shape) {
      this.throwFromSession(`No selected/active shape (id: ${id})`)
    }
    this.shapeId = shape.id
    this.shape = shape
    return shape
  }

  // Get initial version of shape, as it was at session start
  getCapturedShape() {
    if (!this.shape) {
      this.throwFromSession('No captured shape found; need to call captureShape() before')
    }
    return this.shape
  }

  // Get current version of captured shape, as it is now in stateManager shapes tree
  getActiveShape() {
    if (!this.shapeId) {
      this.throwFromSession('No active shapeId found; need to call captureShape() before')
    }
    return this.sm.getShape(this.shapeId)
  }

  throwFromSession(message: string):never {
    this.complete()
    throw new Error(message)
  }

  complete() {
    this.sm.completeSession()
  }
}
export default BaseSession
