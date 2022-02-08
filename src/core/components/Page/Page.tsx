/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type { TLAssets, TLPage, TLPageState, TLShape } from '../../types'
import { useSelection, useShapeTree, useTLContext } from '../../hooks'
import Bounds from '../Bounds'
import BoundsBg from '../Bounds/BoundsBg'
import Handles from '../Handles'
import ShapeNode from '../Shape'
import ShapeIndicator from '../ShapeIndicator'

interface PageProps<T extends TLShape> {
  page: TLPage<T>
  pageState: TLPageState
  assets: TLAssets
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
  assets,
  hideBounds,
  hideHandles,
  hideIndicators,
  hideRotateHandle,
  hideResizeHandles,
  meta,
}: PageProps<T>) => {
  const { bounds: rendererBounds, shapeUtils } = useTLContext()

  const shapeTree = useShapeTree(page, pageState, assets, meta)

  const { bounds, isLocked, rotation } = useSelection(page, pageState, shapeUtils)

  const {
    camera: { zoom },
    editingId,
    hoveredId,
    selectedIds,
  } = pageState

  let _hideIndicators = hideIndicators
  let _isEditing = false

  // Does the selected shape have handles?
  let shapeWithHandles: TLShape | undefined
  const selectedShapes = selectedIds.map(id => page.shapes[id])

  // TODO: we probably will always have only one shape selected;
  // this can be simplified
  if (selectedShapes.length === 1) {
    const shape = selectedShapes[0]
    _isEditing = editingId === shape.id
    if (_isEditing) _hideIndicators = true
    if (shape.handles !== undefined && !_isEditing) {
      shapeWithHandles = shape
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
        <ShapeNode
          key={node.shape.id}
          utils={shapeUtils}
          {...node}
        />
      ))}
      {!_hideIndicators
      && selectedShapes.map(shape => (
        <ShapeIndicator
          isEditing={_isEditing}
          isSelected
          key={`selected_${ shape.id}`}
          meta={meta as any}
          shape={shape}
        />
      ))}
      {!_hideIndicators && hoveredId && hoveredId !== editingId && (
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
