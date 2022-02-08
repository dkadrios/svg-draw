/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import type { TLBounds, TLComponentProps, TLForwardedRef, TLShape } from '../types'

export abstract class TLShapeUtil<T extends TLShape, E extends Element = any, M = any> {
  refMap = new Map<string, React.RefObject<E>>()

  boundsCache = new WeakMap<TLShape, TLBounds>()

  hideBounds = false

  isStateful = false

  abstract Component: React.ForwardRefExoticComponent<TLComponentProps<T, E, M>>

  abstract Indicator: (props: {
    shape: T
    meta: M
    bounds: TLBounds
    isHovered: boolean
    isSelected: boolean
  }) => React.ReactElement | null

  abstract getBounds(shape: T): TLBounds

  // eslint-disable-next-line class-methods-use-this
  shouldRender(prev: T, next: T): boolean { return true }

  getRef = (shape: T): React.RefObject<E> => {
    if (!this.refMap.has(shape.id)) {
      this.refMap.set(shape.id, React.createRef<E>())
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.refMap.get(shape.id)!
  }

  /* --------------------- Static --------------------- */

  static Component = <T extends TLShape, E extends Element = any, M = any>(
    component: (props: TLComponentProps<T, E, M>, ref: TLForwardedRef<E>) => JSX.Element,
  ) => React.forwardRef(component)

  static Indicator = <T extends TLShape, M = any>(
    component: (props: {
      shape: T
      meta: M
      isHovered: boolean
      isSelected: boolean
      bounds: TLBounds
    }) => JSX.Element | null,
  ) => component
}

export default TLShapeUtil
