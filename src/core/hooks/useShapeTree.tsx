/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import type {
  IShapeTreeNode,
  TLBounds,
  TLPage,
  TLPageState,
  TLShape,
} from '../types'
import { boundsCollide, boundsContain, vec } from '../../utils'
import { useTLContext } from './useTLContext'

function shapeIsInViewport(bounds: TLBounds, viewport: TLBounds) {
  return boundsContain(viewport, bounds) || boundsCollide(viewport, bounds)
}

const useShapeTree = <T extends TLShape, M extends Record<string, unknown>>(
  page: TLPage<T>,
  pageState: TLPageState,
  meta?: M,
) => {
  const { bounds, callbacks, shapeUtils } = useTLContext()

  const rTimeout = React.useRef<unknown>()
  const rPreviousCount = React.useRef(0)
  const rShapesIdsToRender = React.useRef(new Set<string>())
  const rShapesToRender = React.useRef(new Set<T>())

  const { camera, selectedId } = pageState

  // Filter the page's shapes down to only those that:
  // - are the direct child of the page
  // - collide with or are contained by the viewport
  // - OR are selected

  const [minX, minY] = vec.sub(vec.div([0, 0], camera.zoom), camera.point)
  const [maxX, maxY] = vec.sub(vec.div([bounds.width, bounds.height], camera.zoom), camera.point)
  const viewport = {
    minX,
    minY,
    maxX,
    maxY,
    height: maxX - minX,
    width: maxY - minY,
  }

  const shapesToRender = rShapesToRender.current
  const shapesIdsToRender = rShapesIdsToRender.current

  shapesToRender.clear()
  shapesIdsToRender.clear()

  Object.values(page.shapes)
    .filter(shape =>
      // Always render shapes that are flagged as stateful
      shapeUtils[shape.type as T['type']].isStateful
        // Always render selected shapes (this preserves certain drag interactions)
        || selectedId === shape.id
        // Otherwise, only render shapes that are in view
        || shapeIsInViewport(shape.getBounds(), viewport))
    .forEach((shape) => {
      shapesIdsToRender.add(shape.id)
      shapesToRender.add(shape)
    })

  // Call onChange callback when number of rendering shapes changes
  if (shapesToRender.size !== rPreviousCount.current) {
    // Use a timeout to clear call stack, in case the onChange handler
    // produces a new state change, which could cause nested state
    // changes, which is bad in React.
    if (rTimeout.current) {
      clearTimeout(rTimeout.current as number)
    }
    rTimeout.current = requestAnimationFrame(() => {
      callbacks.onRenderCountChange?.(Array.from(shapesIdsToRender.values()))
    })
    rPreviousCount.current = shapesToRender.size
  }

  // Populate the shape tree
  const tree: IShapeTreeNode<T, M>[] = Array.from(shapesToRender).map(shape => ({
    shape,
    meta: meta as any,
    isGhost: !!shape.isGhost,
    isEditing: pageState.editingId === shape.id,
    isSelected: pageState.selectedId === shape.id,
    isHovered: pageState.hoveredId === shape.id,
  }))

  tree.sort((a, b) => a.shape.childIndex - b.shape.childIndex)

  return tree
}
export default useShapeTree
