import type React from 'react'
import { isDarwin, vec } from '../utils'
import type { TLBounds, TLKeyboardInfo, TLPointerInfo } from './types'

const DOUBLE_CLICK_DURATION = 250

export class Inputs {
  pointer?: TLPointerInfo

  keyboard?: TLKeyboardInfo

  keys: Record<string, boolean> = {}

  isPinching = false

  bounds: TLBounds = {
    minX: 0,
    maxX: 640,
    minY: 0,
    maxY: 480,
    width: 640,
    height: 480,
  }

  zoom = 1

  pointerUpTime = 0

  activePointer?: number

  pointerIsValid(e: TouchEvent | React.TouchEvent | PointerEvent | React.PointerEvent) {
    if ('pointerId' in e) {
      if (this.activePointer && this.activePointer !== e.pointerId) {
        return false
      }
    }

    if ('touches' in e) {
      const touch = e.changedTouches[0]
      if (this.activePointer && this.activePointer !== touch.identifier) {
        return false
      }
    }

    return true
  }

  pointerDown<T extends string>(e: PointerEvent | React.PointerEvent, target: T): TLPointerInfo<T> {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const point = Inputs.getPoint(e, this.bounds)

    this.activePointer = e.pointerId

    const info: TLPointerInfo<T> = {
      target,
      pointerId: e.pointerId,
      origin: point,
      point,
      delta: [0, 0],
      pressure: Inputs.getPressure(e),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  pointerEnter<T extends string>(
    e: PointerEvent | React.PointerEvent,
    target: T,
  ): TLPointerInfo<T> {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const point = Inputs.getPoint(e, this.bounds)

    const info: TLPointerInfo<T> = {
      target,
      pointerId: e.pointerId,
      origin: point,
      delta: [0, 0],
      point,
      pressure: Inputs.getPressure(e),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  pointerMove<T extends string>(e: PointerEvent | React.PointerEvent, target: T): TLPointerInfo<T> {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const prev = this.pointer

    const point = Inputs.getPoint(e, this.bounds)

    const delta = prev?.point ? vec.sub(point, prev.point) : [0, 0]

    const info: TLPointerInfo<T> = {
      origin: point,
      ...prev,
      target,
      pointerId: e.pointerId,
      point,
      delta,
      pressure: Inputs.getPressure(e),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  pointerUp<T extends string>(e: PointerEvent | React.PointerEvent, target: T): TLPointerInfo<T> {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const prev = this.pointer

    const point = Inputs.getPoint(e, this.bounds)

    const delta = prev?.point ? vec.sub(point, prev.point) : [0, 0]

    this.activePointer = undefined

    const info: TLPointerInfo<T> = {
      origin: point,
      ...prev,
      target,
      pointerId: e.pointerId,
      point,
      delta,
      pressure: Inputs.getPressure(e),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    this.pointerUpTime = performance.now()

    return info
  }

  panStart = (e: WheelEvent): TLPointerInfo<'wheel'> => {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const info: TLPointerInfo<'wheel'> = {
      target: 'wheel',
      pointerId: this.pointer?.pointerId || 0,
      origin: this.pointer?.origin || [0, 0],
      delta: [0, 0],
      pressure: 0.5,
      point: Inputs.getPoint(e, this.bounds),
      shiftKey,
      ctrlKey,
      metaKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  pan = (delta: number[], e: WheelEvent): TLPointerInfo<'wheel'> => {
    if (!this.pointer || this.pointer.target !== 'wheel') {
      return this.panStart(e)
    }

    const { altKey, ctrlKey, metaKey, shiftKey } = e

    const prev = this.pointer

    const point = Inputs.getPoint(e, this.bounds)

    const info: TLPointerInfo<'wheel'> = {
      ...prev,
      target: 'wheel',
      delta,
      point,
      shiftKey,
      ctrlKey,
      metaKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  isDoubleClick() {
    if (!this.pointer) return false

    const { origin, point } = this.pointer

    const isDoubleClick = performance.now() - this.pointerUpTime < DOUBLE_CLICK_DURATION && vec.dist(origin, point) < 4

    // Reset the active pointer, in case it got stuck
    if (isDoubleClick) this.activePointer = undefined

    return isDoubleClick
  }

  clear() {
    this.pointer = undefined
  }

  keydown = (e: KeyboardEvent | React.KeyboardEvent): TLKeyboardInfo => {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    this.keys[e.key] = true

    return {
      point: this.pointer?.point || [0, 0],
      origin: this.pointer?.origin || [0, 0],
      key: e.key,
      keys: Object.keys(this.keys),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
    }
  }

  keyup = (e: KeyboardEvent | React.KeyboardEvent): TLKeyboardInfo => {
    const { altKey, ctrlKey, metaKey, shiftKey } = e

    delete this.keys[e.key]

    return {
      point: this.pointer?.point || [0, 0],
      origin: this.pointer?.origin || [0, 0],
      key: e.key,
      keys: Object.keys(this.keys),
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
    }
  }

  pinch(point: number[], origin: number[]) {
    const { altKey, ctrlKey, metaKey, shiftKey } = this.keys

    const delta = vec.sub(origin, point)

    const info: TLPointerInfo<'pinch'> = {
      pointerId: 0,
      target: 'pinch',
      origin,
      delta,
      point: vec.sub(vec.toFixed(point), [this.bounds.minX, this.bounds.minY]),
      pressure: 0.5,
      shiftKey,
      ctrlKey,
      metaKey: isDarwin() ? metaKey : ctrlKey,
      altKey,
      spaceKey: this.keys[' '],
    }

    this.pointer = info

    return info
  }

  reset() {
    this.pointerUpTime = 0
    this.pointer = undefined
    this.keyboard = undefined
    this.activePointer = undefined
    this.keys = {}
  }

  static getPoint(
    e: PointerEvent | React.PointerEvent | Touch | React.Touch | WheelEvent,
    bounds: TLBounds,
  ): number[] {
    return [+e.clientX.toFixed(2) - bounds.minX, +e.clientY.toFixed(2) - bounds.minY]
  }

  static getPressure(e: PointerEvent | React.PointerEvent | Touch | React.Touch | WheelEvent) {
    return 'pressure' in e ? +e.pressure.toFixed(2) || 0.5 : 0.5
  }
}

export const inputs = new Inputs()
export default Inputs
