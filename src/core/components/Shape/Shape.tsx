import React from 'react'
import { useShapeEvents, useTLContext } from 'core/hooks'
import type { IShapeTreeNode, TLMeta, TLShape } from 'core/types'
import type { TLShapeUtil } from 'core/TLShapeUtil'
import Container from '../Container'

interface ShapeProps<T extends TLShape, M extends TLMeta> extends IShapeTreeNode<T, M> {
  utils: TLShapeUtil<T>
}

const Shape = React.memo(<T extends TLShape, M extends TLMeta>({ shape, utils, meta, ...rest }: ShapeProps<T, M>) => {
  const { callbacks } = useTLContext()
  const bounds = shape.getBounds()
  const events = useShapeEvents(shape.id)

  return (
    <Container
      bounds={bounds}
      id={shape.id}
      isGhost={rest.isGhost}
      isSelected={rest.isSelected}
      rotation={shape.rotation}
    >
      <utils.Component
        bounds={bounds}
        events={events}
        isEditing={rest.isEditing}
        isGhost={rest.isGhost}
        isHovered={rest.isHovered}
        isSelected={rest.isSelected}
        meta={meta}
        onShapeBlur={callbacks.onShapeBlur}
        onShapeChange={callbacks.onShapeChange}
        shape={shape}
      />
    </Container>
  )
}, (prev, next) => {
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
export default Shape
