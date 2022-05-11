/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import type { TLComponentProps, TLShape } from '../../types'
import type { TLShapeUtil } from '../../TLShapeUtil'

interface RenderedShapeProps<T extends TLShape, M>
  extends TLComponentProps<T, M> {
  shape: T
  utils: TLShapeUtil<T, M>
}

const memoShape = <T extends TLShape, M>(props: RenderedShapeProps<T, M>) => (
  <props.utils.Component {...props} />
)

const RenderedShape = React.memo(memoShape, (prev, next) => {
  // If these have changed, then definitely render
  if (
    prev.isHovered !== next.isHovered
    || prev.isSelected !== next.isSelected
    || prev.isEditing !== next.isEditing
    || prev.isGhost !== next.isGhost
    || prev.meta !== next.meta
  ) {
    return false
  }

  // If not, and if the shape has changed, ask the shape's class
  // whether it should render
  if (next.shape !== prev.shape) {
    return !next.utils.shouldRender(next.shape, prev.shape)
  }

  return true
})
export default RenderedShape
