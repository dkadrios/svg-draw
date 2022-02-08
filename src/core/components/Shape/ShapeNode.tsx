import * as React from 'react'
import type { IShapeTreeNode, TLShape } from '../../types'
import type { TLShapeUtilsMap } from '../../TLShapeUtil'
import Shape from './Shape'

interface ShapeNodeProps<T extends TLShape> extends IShapeTreeNode<T> {
  utils: TLShapeUtilsMap<TLShape>
}

/**
 * Shape tree node, drawing a node and its children
 * TODO: might not need it if we don't have groups and children
 */
const ShapeNode = <T extends TLShape>({ shape, utils, meta, children, ...rest }: ShapeNodeProps<T>) => (
  <>
    <Shape
      meta={meta} shape={shape} utils={utils[shape.type as T['type']]} {...rest}
    />
    {children
      && children.map(childNode => (
        <ShapeNode
          key={childNode.shape.id}
          utils={utils}
          {...childNode}
        />
      ))}
  </>
)
export default ShapeNode
