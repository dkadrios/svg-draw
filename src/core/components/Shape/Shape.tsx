import * as React from 'react'
import { useShapeEvents, useTLContext } from '../../hooks'
import type { IShapeTreeNode, TLShape } from '../../types'
import Container from '../Container'
import type { TLShapeUtil } from '../../TLShapeUtil'
import RenderedShape from './RenderedShape'

interface ShapeProps<T extends TLShape, E extends Element, M> extends IShapeTreeNode<T, M> {
  utils: TLShapeUtil<T, E, M>
}

const Shape = <T extends TLShape, E extends Element, M>({ shape, utils, meta, ...rest }: ShapeProps<T, E, M>) => {
  const { callbacks } = useTLContext()
  const bounds = utils.getBounds(shape)
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
        utils={utils as any}
        {...rest}
      />
    </Container>
  )
}
export default Shape
