import * as React from 'react'
import { useShapeEvents, useTLContext } from '../../hooks'
import type { IShapeTreeNode, TLShape } from '../../types'
import Container from '../Container'
import type { TLShapeUtil } from '../../TLShapeUtil'
import RenderedShape from './RenderedShape'

interface ShapeProps<T extends TLShape, M> extends IShapeTreeNode<T, M> {
  utils: TLShapeUtil<T>
}

const Shape = <T extends TLShape, M>({ shape, utils, meta, ...rest }: ShapeProps<T, M>) => {
  const { callbacks } = useTLContext()
  const bounds = shape.getBounds()
  const events = useShapeEvents(shape.id)

  return (
    <Container
      bounds={bounds}
      data-shape={shape.type}
      id={shape.id}
      isGhost={rest.isGhost}
      isSelected={rest.isSelected}
      rotation={shape.rotation}
    >
      <RenderedShape
        bounds={bounds}
        events={events}
        meta={meta}
        onShapeBlur={callbacks.onShapeBlur}
        onShapeChange={callbacks.onShapeChange}
        shape={shape}
        utils={utils}
        {...rest}
      />
    </Container>
  )
}
export default Shape
