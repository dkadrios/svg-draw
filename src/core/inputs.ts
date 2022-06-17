import type React from 'react'
import { isDarwin } from 'utils'
import { dist, sub } from 'utils/vec'
import type { TLBounds, TLKeyboardInfo, TLPointerInfo, WebKitGestureEvent } from './types'

const DOUBLE_CLICK_DURATION = 250

export class Inputs {
  pointer?: TLPointerInfo

  keyboard?: TLKeyboardInfo

  keys: Record<string, boolean> = {}

  rContainer: HTMLDivElement | null = null

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

    const point = this.getPoint(e)

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

    const point = this.getPoint(e)

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

    const point = this.getPoint(e)

    const delta = prev?.point ? sub(point, prev.point) : [0, 0]

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

    const point = this.getPoint(e)

    const delta = prev?.point ? sub(point, prev.point) : [0, 0]

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

  panzoom = (delta: number[], e: WheelEvent | TouchEvent | WebKitGestureEvent): TLPointerInfo<'panzoom'> => {
    const { altKey, ctrlKey, metaKey, shiftKey } = this.keys

    const info: TLPointerInfo<'panzoom'> = {
      target: 'panzoom',
      pointerId: this.pointer?.pointerId || 0,
      origin: this.pointer?.origin || [0, 0],
      pressure: 0.5,
      delta,
      point: this.getPoint(('touches' in e) ? e.touches[0] : e),
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

    const isDoubleClick = performance.now() - this.pointerUpTime < DOUBLE_CLICK_DURATION && dist(origin, point) < 4

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

  reset() {
    this.pointerUpTime = 0
    this.pointer = undefined
    this.keyboard = undefined
    this.activePointer = undefined
    this.keys = {}
  }

  getPoint(e: PointerEvent | React.PointerEvent | Touch | React.Touch | WheelEvent): number[] {
    const rect = this.rContainer?.getBoundingClientRect()
    if (!rect) return [0, 0]
    return [+e.clientX.toFixed(2) - rect.left, +e.clientY.toFixed(2) - rect.top]
  }

  static getPressure(e: PointerEvent | React.PointerEvent | Touch | React.Touch | WheelEvent) {
    return 'pressure' in e ? +e.pressure.toFixed(2) || 0.5 : 0.5
  }
}

export default Inputs
