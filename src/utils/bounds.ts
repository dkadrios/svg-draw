import type { TLBounds, TLBoundsWithCenter, TransformedBounds } from 'core/types'
import { TLBoundsCorner, TLBoundsEdge } from 'core/types'
import { vec } from './vec'
import { getRectangleSides } from './misc'

/* --------------------- Bounds --------------------- */

export const getBoundsSides = (bounds: TLBounds): [string, number[][]][] => (
  getRectangleSides([bounds.minX, bounds.minY], [bounds.width, bounds.height])
)

/* Expand a bounding box by a delta. */
export const expandBounds = (bounds: TLBounds, delta: number): TLBounds => ({
  minX: bounds.minX - delta,
  minY: bounds.minY - delta,
  maxX: bounds.maxX + delta,
  maxY: bounds.maxY + delta,
  width: bounds.width + delta * 2,
  height: bounds.height + delta * 2,
})

/* Get a bounding box that includes two bounding boxes */
export const getExpandedBounds = (a: TLBounds, b: TLBounds): TLBounds => {
  const minX = Math.min(a.minX, b.minX)
  const minY = Math.min(a.minY, b.minY)
  const maxX = Math.max(a.maxX, b.maxX)
  const maxY = Math.max(a.maxY, b.maxY)
  const width = Math.abs(maxX - minX)
  const height = Math.abs(maxY - minY)

  return { minX, minY, maxX, maxY, width, height }
}

/* Get the common bounds of a group of bounds. */
export const getCommonBounds = (bounds: TLBounds[]): TLBounds => {
  if (bounds.length < 2) return bounds[0]
  return bounds.reduce(getExpandedBounds)
}

/* Get the center of a bounding box. */
export const getBoundsCenter = (bounds: TLBounds): number[] => (
  [bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2])

/**
 * Get a bounding box with a midX and midY.
 * @param bounds
 */
export const getBoundsWithCenter = (bounds: TLBounds): TLBoundsWithCenter => {
  const center = getBoundsCenter(bounds)
  return {
    ...bounds,
    midX: center[0],
    midY: center[1],
  }
}

/* Get whether two bounds collide. */
export const boundsCollide = (a: TLBounds, b: TLBounds): boolean => (
  a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY)

/* Get whether the bounds of A contain the bounds of B. A perfect match will return true. */
export const boundsContain = (a: TLBounds, b: TLBounds): boolean => (
  a.minX < b.minX && a.minY < b.minY && a.maxY > b.maxY && a.maxX > b.maxX)

/* Get whether the bounds of A are contained by the bounds of B. */
export const boundsContained = (a: TLBounds, b: TLBounds): boolean => boundsContain(b, a)

/* Get whether two bounds are identical. */
export const boundsAreEqual = (a: TLBounds, b: TLBounds): boolean => (
  b.maxX === a.maxX && b.minX === a.minX && b.maxY === a.maxY && b.minY === a.minY)

/* Get whether a point is inside of a bounds */
export const pointInBounds = (A: number[], b: TLBounds): boolean => (
  A[0] > b.minX && A[0] < b.maxX && A[1] > b.minY && A[1] < b.maxY)

/* Find a bounding box from an array of points */
export const getBoundsFromPoints = (points: number[][], rotation = 0): TLBounds => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  if (points.length < 2) {
    minX = 0
    minY = 0
    maxX = 1
    maxY = 1
  } else {
    points.forEach(([x, y]) => {
      minX = Math.min(x, minX)
      minY = Math.min(y, minY)
      maxX = Math.max(x, maxX)
      maxY = Math.max(y, maxY)
    })
  }

  if (rotation !== 0) {
    return getBoundsFromPoints(points.map(pt => vec.rotWith(pt, [(minX + maxX) / 2, (minY + maxY) / 2], rotation)))
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  }
}

/* Move a bounding box without recalculating it */
export const translateBounds = (bounds: TLBounds, delta: number[]): TLBounds => ({
  minX: bounds.minX + delta[0],
  minY: bounds.minY + delta[1],
  maxX: bounds.maxX + delta[0],
  maxY: bounds.maxY + delta[1],
  width: bounds.width,
  height: bounds.height,
})

/* Rotate a bounding box */
export const rotateBounds = (bounds: TLBounds, center: number[], rotation: number): TLBounds => {
  const [minX, minY] = vec.rotWith([bounds.minX, bounds.minY], center, rotation)
  const [maxX, maxY] = vec.rotWith([bounds.maxX, bounds.maxY], center, rotation)

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: bounds.width,
    height: bounds.height,
  }
}

/* Center a bounding box around a given point */
export const centerBounds = (bounds: TLBounds, point: number[]): TLBounds => {
  const boundsCenter = getBoundsCenter(bounds)
  const dx = point[0] - boundsCenter[0]
  const dy = point[1] - boundsCenter[1]
  return translateBounds(bounds, [dx, dy])
}

/* Snap a bounding box to a grid size. */
export const snapBoundsToGrid = <T extends TLBounds>(bounds: T, gridSize: number): T => {
  const minX = Math.round(bounds.minX / gridSize) * gridSize
  const minY = Math.round(bounds.minY / gridSize) * gridSize
  const maxX = Math.round(bounds.maxX / gridSize) * gridSize
  const maxY = Math.round(bounds.maxY / gridSize) * gridSize
  return {
    ...bounds,
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  }
}

/* Get the rotated bounds of an ellipse */
export const getRotatedEllipseBounds = (x: number, y: number, rx: number, ry: number, rotation = 0): TLBounds => {
  const c = Math.cos(rotation)
  const s = Math.sin(rotation)
  const w = Math.hypot(rx * c, ry * s)
  const h = Math.hypot(rx * s, ry * c)

  return {
    minX: x + rx - w,
    minY: y + ry - h,
    maxX: x + rx + w,
    maxY: y + ry + h,
    width: w * 2,
    height: h * 2,
  }
}

export const getRotatedCorners = (b: TLBounds, rotation = 0): number[][] => {
  const center = [b.minX + b.width / 2, b.minY + b.height / 2]

  return [
    [b.minX, b.minY],
    [b.maxX, b.minY],
    [b.maxX, b.maxY],
    [b.minX, b.maxY],
  ].map(point => vec.rotWith(point, center, rotation))
}

/* Get the size of a rotated box */
export const getRotatedSize = (size: number[], rotation: number): number[] => {
  const center = vec.div(size, 2)

  const points = [[0, 0], [size[0], 0], size, [0, size[1]]].map(point => vec.rotWith(point, center, rotation))

  const bounds = getBoundsFromPoints(points)

  return [bounds.width, bounds.height]
}

/**
 * Given a set of points, get their common [minX, minY].
 */
export const getCommonTopLeft = (points: number[][]) => {
  const min = [Infinity, Infinity]

  points.forEach((point) => {
    min[0] = Math.min(min[0], point[0])
    min[1] = Math.min(min[1], point[1])
  })

  return min
}

export const getTransformedBoundingBox = (
  bounds: TLBounds,
  handle: TLBoundsCorner | TLBoundsEdge,
  delta: number[],
  rotation = 0,
  isAspectRatioLocked = false,
): TransformedBounds => {
  // Create top left and bottom right corners.
  const [ax0, ay0] = [bounds.minX, bounds.minY]
  const [ax1, ay1] = [bounds.maxX, bounds.maxY]

  // Create a second set of corners for the new box.
  let [bx0, by0] = [bounds.minX, bounds.minY]
  let [bx1, by1] = [bounds.maxX, bounds.maxY]

  // Counter rotate the delta. This lets us make changes as if
  // the (possibly rotated) boxes were axis aligned.
  const [dx, dy] = vec.rot(delta, -rotation)

  /*
    1. Delta
    Use the delta to adjust the new box by changing its corners.
    The dragging handle (corner or edge) will determine which
    corners should change.
  */
  switch (handle) {
    case TLBoundsEdge.Top:
    case TLBoundsCorner.TopLeft:
    case TLBoundsCorner.TopRight: {
      by0 += dy
      break
    }
    case TLBoundsEdge.Bottom:
    case TLBoundsCorner.BottomLeft:
    case TLBoundsCorner.BottomRight: {
      by1 += dy
      break
    }
    default:
  }

  switch (handle) {
    case TLBoundsEdge.Left:
    case TLBoundsCorner.TopLeft:
    case TLBoundsCorner.BottomLeft: {
      bx0 += dx
      break
    }
    case TLBoundsEdge.Right:
    case TLBoundsCorner.TopRight:
    case TLBoundsCorner.BottomRight: {
      bx1 += dx
      break
    }
    default:
  }

  const aw = ax1 - ax0
  const ah = ay1 - ay0

  const scaleX = (bx1 - bx0) / aw
  const scaleY = (by1 - by0) / ah

  const flipX = scaleX < 0
  const flipY = scaleY < 0

  const bw = Math.abs(bx1 - bx0)
  const bh = Math.abs(by1 - by0)

  /*
    2. Aspect ratio
    If the aspect ratio is locked, adjust the corners so that the
    new box's aspect ratio matches the original aspect ratio.
  */

  if (isAspectRatioLocked) {
    const ar = aw / ah
    const isTall = ar < bw / bh
    const tw = bw * (scaleY < 0 ? 1 : -1) * (1 / ar)
    const th = bh * (scaleX < 0 ? 1 : -1) * ar

    switch (handle) {
      case TLBoundsCorner.TopLeft: {
        if (isTall) by0 = by1 + tw
        else bx0 = bx1 + th
        break
      }
      case TLBoundsCorner.TopRight: {
        if (isTall) by0 = by1 + tw
        else bx1 = bx0 - th
        break
      }
      case TLBoundsCorner.BottomRight: {
        if (isTall) by1 = by0 - tw
        else bx1 = bx0 - th
        break
      }
      case TLBoundsCorner.BottomLeft: {
        if (isTall) by1 = by0 - tw
        else bx0 = bx1 + th
        break
      }
      case TLBoundsEdge.Bottom:
      case TLBoundsEdge.Top: {
        const m = (bx0 + bx1) / 2
        const w = bh * ar
        bx0 = m - w / 2
        bx1 = m + w / 2
        break
      }
      case TLBoundsEdge.Left:
      case TLBoundsEdge.Right: {
        const m = (by0 + by1) / 2
        const h = bw / ar
        by0 = m - h / 2
        by1 = m + h / 2
        break
      }
      default:
    }
  }

  /*
    3. Rotation
    If the bounds are rotated, get a Vector from the rotated anchor
    corner in the inital bounds to the rotated anchor corner in the
    result's bounds. Subtract this Vector from the result's corners,
    so that the two anchor points (initial and result) will be equal.
  */

  if (rotation % (Math.PI * 2) !== 0) {
    let cv = [0, 0]

    const c0 = vec.med([ax0, ay0], [ax1, ay1])
    const c1 = vec.med([bx0, by0], [bx1, by1])

    switch (handle) {
      case TLBoundsCorner.TopLeft: {
        cv = vec.sub(vec.rotWith([bx1, by1], c1, rotation), vec.rotWith([ax1, ay1], c0, rotation))
        break
      }
      case TLBoundsCorner.TopRight: {
        cv = vec.sub(vec.rotWith([bx0, by1], c1, rotation), vec.rotWith([ax0, ay1], c0, rotation))
        break
      }
      case TLBoundsCorner.BottomRight: {
        cv = vec.sub(vec.rotWith([bx0, by0], c1, rotation), vec.rotWith([ax0, ay0], c0, rotation))
        break
      }
      case TLBoundsCorner.BottomLeft: {
        cv = vec.sub(vec.rotWith([bx1, by0], c1, rotation), vec.rotWith([ax1, ay0], c0, rotation))
        break
      }
      case TLBoundsEdge.Top: {
        cv = vec.sub(
          vec.rotWith(vec.med([bx0, by1], [bx1, by1]), c1, rotation),
          vec.rotWith(vec.med([ax0, ay1], [ax1, ay1]), c0, rotation),
        )
        break
      }
      case TLBoundsEdge.Left: {
        cv = vec.sub(
          vec.rotWith(vec.med([bx1, by0], [bx1, by1]), c1, rotation),
          vec.rotWith(vec.med([ax1, ay0], [ax1, ay1]), c0, rotation),
        )
        break
      }
      case TLBoundsEdge.Bottom: {
        cv = vec.sub(
          vec.rotWith(vec.med([bx0, by0], [bx1, by0]), c1, rotation),
          vec.rotWith(vec.med([ax0, ay0], [ax1, ay0]), c0, rotation),
        )
        break
      }
      case TLBoundsEdge.Right: {
        cv = vec.sub(
          vec.rotWith(vec.med([bx0, by0], [bx0, by1]), c1, rotation),
          vec.rotWith(vec.med([ax0, ay0], [ax0, ay1]), c0, rotation),
        )
        break
      }
      default:
    }

    [bx0, by0] = vec.sub([bx0, by0], cv);
    [bx1, by1] = vec.sub([bx1, by1], cv)
  }

  /*
    4. Flips

    If the axes are flipped (e.g. if the right edge has been dragged
    left past the initial left edge) then swap points on that axis.
  */

  if (bx1 < bx0) {
    [bx1, bx0] = [bx0, bx1]
  }

  if (by1 < by0) {
    [by1, by0] = [by0, by1]
  }

  return {
    minX: bx0,
    minY: by0,
    maxX: bx1,
    maxY: by1,
    width: bx1 - bx0,
    height: by1 - by0,
    scaleX: ((bx1 - bx0) / (ax1 - ax0 || 1)) * (flipX ? -1 : 1),
    scaleY: ((by1 - by0) / (ay1 - ay0 || 1)) * (flipY ? -1 : 1),
  }
}
