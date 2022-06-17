import React from 'react'
import type { IShapeTreeNode, TLMeta, TLPage, TLPageState, TLShape } from 'core/types'
import { useSelection, useTLContext } from 'core/hooks'
import Bounds from '../Bounds'
import BoundsBg from '../Bounds/BoundsBg'
import Handles from '../Handles'
import ShapeIndicator from '../ShapeIndicator'
import Shape from '../Shape'

const getShapeTree = <T extends TLShape, M extends TLMeta>(
  page: TLPage<T>,
  pageState: TLPageState,
  meta?: M,
): IShapeTreeNode<T, M>[] =>
    Object
      .values(page.shapes)
      .map(shape => ({
        shape,
        meta,
        isGhost: !!shape.isGhost,
        isEditing: pageState.editingId === shape.id,
        isSelected: pageState.selectedId === shape.id,
        isHovered: pageState.hoveredId === shape.id,
      }))
      .sort((a, b) => a.shape.childIndex - b.shape.childIndex)

interface PageProps<T extends TLShape, M extends TLMeta> {
  page: TLPage<T>
  pageState: TLPageState
  hideBounds: boolean
  hideHandles: boolean
  hideIndicators: boolean
  hideRotateHandle: boolean
  hideResizeHandles: boolean
  meta?: M
}

/**
 * The Page component renders the current page.
 */
const Page = <T extends TLShape, M extends TLMeta>({
  page,
  pageState,
  hideBounds,
  hideHandles,
  hideIndicators,
  hideRotateHandle,
  hideResizeHandles,
  meta,
}: PageProps<T, M>) => {
  const { shapeUtils } = useTLContext()

  const shapeTree = getShapeTree(page, pageState, meta)

  const { bounds, isLocked, rotation } = useSelection(page, pageState, shapeUtils)

  const {
    camera: { zoom },
    editingId,
    hoveredId,
    selectedId,
  } = pageState

  let shouldHideIndicators = hideIndicators
  let isEditing = false

  // Does the selected shape have handles?
  let shapeWithHandles: TLShape | undefined
  const selectedShape = selectedId && page.shapes[selectedId]

  if (selectedShape) {
    isEditing = editingId === selectedId
    if (isEditing) shouldHideIndicators = true
    if (selectedShape.handles !== undefined && !isEditing) {
      shapeWithHandles = selectedShape
    }
  }

  return (
    <>
      {bounds && (
        <BoundsBg
          bounds={bounds}
          isHidden={hideBounds}
          rotation={rotation}
        />
      )}
      {shapeTree.map(node => (
        <Shape key={node.shape.id} {...node} utils={shapeUtils[node.shape.type as T['type']]} />
      ))}
      {!shouldHideIndicators && selectedShape && (
        <ShapeIndicator
          isEditing={isEditing}
          isSelected
          key={`selected_${ selectedId}`}
          meta={meta}
          shape={selectedShape}
        />
      )}
      {!shouldHideIndicators && hoveredId && hoveredId !== editingId && (
        <ShapeIndicator
          isHovered
          key={`hovered_${ hoveredId}`}
          meta={meta}
          shape={page.shapes[hoveredId]}
        />
      )}
      {bounds && (
        <Bounds
          bounds={bounds}
          hideResizeHandles={hideResizeHandles}
          hideRotateHandle={hideRotateHandle}
          isHidden={hideBounds}
          isLocked={isLocked}
          rotation={rotation}
          zoom={zoom}
        />
      )}
      {!hideHandles && shapeWithHandles && (
        <Handles
          shape={shapeWithHandles}
          zoom={zoom}
        />
      )}
    </>
  )
}

export default Page
