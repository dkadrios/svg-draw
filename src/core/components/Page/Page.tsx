/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type { TLPage, TLPageState, TLShape } from 'core/types'
import { useSelection, useShapeTree, useTLContext } from 'core/hooks'
import Bounds from '../Bounds'
import BoundsBg from '../Bounds/BoundsBg'
import Handles from '../Handles'
import ShapeIndicator from '../ShapeIndicator'
import Shape from '../Shape'

interface PageProps<T extends TLShape> {
  page: TLPage<T>
  pageState: TLPageState
  hideBounds: boolean
  hideHandles: boolean
  hideIndicators: boolean
  hideRotateHandle: boolean
  hideResizeHandles: boolean
  meta?: Record<string, unknown>
}

/**
 * The Page component renders the current page.
 */
const Page = <T extends TLShape, M extends Record<string, unknown>>({
  page,
  pageState,
  hideBounds,
  hideHandles,
  hideIndicators,
  hideRotateHandle,
  hideResizeHandles,
  meta,
}: PageProps<T>) => {
  const { bounds: rendererBounds, shapeUtils } = useTLContext()

  const shapeTree = useShapeTree(page, pageState, meta)

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
          meta={meta as any}
          shape={selectedShape}
        />
      )}
      {!shouldHideIndicators && hoveredId && hoveredId !== editingId && (
        <ShapeIndicator
          isHovered
          key={`hovered_${ hoveredId}`}
          meta={meta as any}
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
          viewportWidth={rendererBounds.width}
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
