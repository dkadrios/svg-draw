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
  const { bounds, shapeUtils } = useTLContext()
  const { camera, selectedId } = pageState

  const isStateful = (shape: T) => {
    const util = shapeUtils[shape.type]
    return util && util.isStateful
  }

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

  // Always render shapes that are flagged as stateful,
  // selected (this preserves certain drag interactions)
  // or just in view
  const shapes = Object.values(page.shapes)
    .filter(shape => (
      isStateful(shape)
      || selectedId === shape.id
      || shapeIsInViewport(shape.getBounds(), viewport)))

  // Populate the shape tree
  const tree: IShapeTreeNode<T, M>[] = shapes.map(shape => ({
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
