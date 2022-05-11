import * as React from 'react'
import type { TLComponentProps, TLIndicatorProps, TLShape } from '../types'

export abstract class TLShapeUtil<T extends TLShape, M = any> {
  // Always render, never hide from canvas
  // (for shapes in need of complex initialization, e.g. video)
  isStateful = false

  // Whether to show resizing bounds
  hideBounds = false

  // Rendered React shape view
  abstract Component(props: TLComponentProps<T, M>): JSX.Element

  // onHover indicator on top of rendered shape
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Indicator(props: TLIndicatorProps<T, M>): React.ReactElement | null { return null }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldRender(prev: T, next: T) { return true }
}

export default TLShapeUtil
