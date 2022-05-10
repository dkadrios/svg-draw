import type React from 'react'
import { vec } from './vec'

// TODO: move intersect code here

const TAU = Math.PI * 2

/* -------------------------------------------------- */
/*                    Math & Geometry                 */
/* -------------------------------------------------- */

/* Clamp a value into a range */
export const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(n, max))

/* Linear interpolation between two numbers */
export const lerp = (y1: number, y2: number, mu: number) => {
  const m = clamp(mu, 0, 1)
  return y1 * (1 - m) + y2 * m
}

/* Modulate a value between two ranges */
export const modulate = (value: number, rangeA: number[], rangeB: number[], needClamp = false): number => {
  const [fromLow, fromHigh] = rangeA
  const [v0, v1] = rangeB
  const result = v0 + ((value - fromLow) / (fromHigh - fromLow)) * (v1 - v0)

  return needClamp
    ? v0 < v1
      ? Math.max(Math.min(result, v1), v0)
      : Math.max(Math.min(result, v0), v1)
    : result
}

/* ---------------------- Boxes --------------------- */
export const pointsToLineSegments = (points: number[][], closed = false) => {
  const segments = []
  for (let i = 1; i < points.length; i += 1) segments.push([points[i - 1], points[i]])
  if (closed) segments.push([points[points.length - 1], points[0]])
  return segments
}

export const getRectangleSides = (point: number[], size: number[], rotation = 0): [string, number[][]][] => {
  const center = [point[0] + size[0] / 2, point[1] + size[1] / 2]
  const tl = vec.rotWith(point, center, rotation)
  const tr = vec.rotWith(vec.add(point, [size[0], 0]), center, rotation)
  const br = vec.rotWith(vec.add(point, size), center, rotation)
  const bl = vec.rotWith(vec.add(point, [0, size[1]]), center, rotation)

  return [
    ['top', [tl, tr]],
    ['right', [tr, br]],
    ['bottom', [br, bl]],
    ['left', [bl, tl]],
  ]
}

/* --------------- Angles --------------- */
/* Get angle between positive y axis and vector composed from given points */
export const normalizedAngle = (A: number[], B: number[]) => (Math.PI / 2) + Math.atan2(B[1] - A[1], B[0] - A[0])

/* Find the approximate perimeter of an ellipse */
export const perimeterOfEllipse = (rx: number, ry: number): number => {
  const h = (rx - ry) ** 2 / (rx + ry) ** 2
  return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
}

/* Get the short angle distance between two angles */
export const shortAngleDist = (a0: number, a1: number): number => {
  const max = Math.PI * 2
  const da = (a1 - a0) % max
  return ((2 * da) % max) - da
}

/* Get the long angle distance between two angles */
export const longAngleDist = (a0: number, a1: number): number => Math.PI * 2 - shortAngleDist(a0, a1)

/* Interpolate an angle between two angles */
export const lerpAngles = (a0: number, a1: number, t: number): number => (a0 + shortAngleDist(a0, a1) * t)

/**
   * Get the short distance between two angles.
   * @param a0
   * @param a1
   */
export const angleDelta = (a0: number, a1: number): number => shortAngleDist(a0, a1)

/**
 * Get the "sweep" or short distance between two points on a circle's perimeter.
 * @param C
 * @param A
 * @param B
 */
export const getSweep = (C: number[], A: number[], B: number[]): number => angleDelta(vec.angle(C, A), vec.angle(C, B))

/**
 * Clamp radians within 0 and 2PI
 * @param r
 */
export const clampRadians = (r: number): number => (Math.PI * 2 + r) % (Math.PI * 2)

/**
 * Clamp rotation to even segments.
 * @param r
 * @param segments
 */
export const snapAngleToSegments = (r: number, segments: number): number => {
  const seg = (Math.PI * 2) / segments
  return Math.floor((clampRadians(r) + seg / 2) / seg) * seg
}

/**
 * Is angle c between angles a and b?
 * @param a
 * @param b
 * @param c
 */
export const isAngleBetween = (a: number, b: number, c: number): boolean => {
  if (c === a || c === b) return true

  const AB = (b - a + TAU) % TAU
  const AC = (c - a + TAU) % TAU
  return (AB <= Math.PI) !== (AC > AB)
}

/**
 * Convert degrees to radians.
 * @param d
 */
export const degreesToRadians = (d: number): number => (d * Math.PI) / 180

/**
 * Convert radians to degrees.
 * @param r
 */
export const radiansToDegrees = (r: number): number => (r * 180) / Math.PI

/**
 * Get the length of an arc between two points on a circle's perimeter.
 * @param C
 * @param r
 * @param A
 * @param B
 */
export const getArcLength = (C: number[], r: number, A: number[], B: number[]): number => {
  const sweep = getSweep(C, A, B)
  return r * (2 * Math.PI) * (sweep / (2 * Math.PI))
}

export const getSweepFlag = (A: number[], B: number[], C: number[]) => {
  const angleAC = vec.angle(A, C)
  const angleAB = vec.angle(A, B)
  const angleCAB = ((angleAB - angleAC + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
  return angleCAB > 0 ? 0 : 1
}

export const getLargeArcFlag = (A: number[], C: number[], P: number[]) => {
  const anglePA = vec.angle(P, A)
  const anglePC = vec.angle(P, C)
  const angleAPC = ((anglePC - anglePA + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
  return Math.abs(angleAPC) > Math.PI / 2 ? 0 : 1
}

/**
 * Get a dash offset for an arc, based on its length.
 */
export const getArcDashOffset = (C: number[], r: number, A: number[], B: number[], step: number): number => {
  const del0 = getSweepFlag(C, A, B)
  const len0 = getArcLength(C, r, A, B)
  const off0 = del0 < 0 ? len0 : 2 * Math.PI * C[2] - len0
  return -off0 / 2 + step
}

/**
 * Get a dash offset for an ellipse, based on its length.
 */
export const getEllipseDashOffset = (A: number[], step: number): number => {
  const c = 2 * Math.PI * A[2]
  return -c / 2 + -step
}

/* -------------------- Hit Tests ------------------- */
export const pointInCircle = (A: number[], C: number[], r: number): boolean => vec.dist(A, C) <= r

export const pointInEllipse = (A: number[], C: number[], rx: number, ry: number, rotation = 0): boolean => {
  const cos = Math.cos(rotation || 0)
  const sin = Math.sin(rotation || 0)
  const delta = vec.sub(A, C)
  const tdx = cos * delta[0] + sin * delta[1]
  const tdy = sin * delta[0] - cos * delta[1]

  return (tdx * tdx) / (rx * rx) + (tdy * tdy) / (ry * ry) <= 1
}

export const pointInPolygon = (p: number[], points: number[][]): boolean => {
  let wn = 0 // winding number

  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length]
    if (a[1] <= p[1]) {
      if (b[1] > p[1] && vec.cross(a, b, p) > 0) {
        wn += 1
      }
    } else if (b[1] <= p[1] && vec.cross(a, b, p) < 0) {
      wn -= 1
    }
  })

  return wn !== 0
}

/**
 * Hit test a point and a polyline using a minimum distance.
 * @param A The point to check.
 * @param points The points that make up the polyline.
 * @param distance (optional) The mininum distance that qualifies a hit.
 */
export const pointInPolyline = (A: number[], points: number[][], distance = 3): boolean => {
  for (let i = 1; i < points.length; i += 1) {
    if (vec.distanceToLineSegment(points[i - 1], points[i], A) < distance) {
      return true
    }
  }
  return false
}

export const translatePoints = (points: number[][], delta: number[]) => (
  points.map(point => ([point[0] + delta[0], point[1] + delta[1]]))
)

/* -------------------------------------------------- */
/*                Lists and Collections               */
/* -------------------------------------------------- */

/**
 * Get a value from a cache (a WeakMap), filling the value if it is not present.
 *
 * ### Example
 *
 *```ts
 * getFromCache(boundsCache, shape, (cache) => cache.set(shape, "value"))
 *```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const getFromCache = <V, I extends object>(cache: WeakMap<I, V>, key: I, getNext: () => V): V => {
  let value = cache.get(key)

  if (value === undefined) {
    cache.set(key, getNext())
    value = cache.get(key)

    if (value === undefined) {
      throw Error('Cache did not include item!')
    }
  }

  return value
}

/**
 * Get a unique string id.
 */
export const uniqueId = (a = ''): string => {
  // eslint-disable-next-line no-bitwise
  if (a) return ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, uniqueId)
}

/**
 * Debounce a function.
 */
export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms = 0) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeoutId: number | any
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(args), ms)
  }
}

/* -------------------------------------------------- */
/*                   Browser and DOM                  */
/* -------------------------------------------------- */

/**
 * Get balanced dash-strokearray and dash-strokeoffset properties for a path of a given length.
 * @param length The length of the path.
 * @param strokeWidth The shape's stroke-width property.
 * @param style The stroke's style: "dashed" or "dotted" (default "dashed").
 * @param snap An interval for dashes (e.g. 4 will produce arrays with 4, 8, 16, etc dashes).
 * @param outset
 */
export const getPerfectDashProps = (
  length: number,
  strokeWidth: number,
  style: 'dashed' | 'dotted' | string,
  snap = 1,
  outset = true,
): {
  strokeDasharray: string
  strokeDashoffset: string
} => {
  let dashLength: number
  let strokeDashoffset: string
  let ratio: number

  if (style.toLowerCase() === 'dashed') {
    dashLength = strokeWidth * 2
    ratio = 1
    strokeDashoffset = outset ? (dashLength / 2).toString() : '0'
  } else if (style.toLowerCase() === 'dotted') {
    dashLength = strokeWidth / 100
    ratio = 100
    strokeDashoffset = '0'
  } else {
    return {
      strokeDasharray: 'none',
      strokeDashoffset: 'none',
    }
  }

  let dashes = Math.floor(length / dashLength / (2 * ratio))

  dashes -= dashes % snap

  dashes = Math.max(dashes, 4)

  const gapLength = Math.max(
    dashLength,
    (length - dashes * dashLength) / (outset ? dashes : dashes - 1),
  )

  return {
    strokeDasharray: [dashLength, gapLength].join(' '),
    strokeDashoffset,
  }
}

export const getSvgLineProps = (start: number[], end: number[]) => ({
  x1: start[0],
  x2: end[0],
  y1: start[1],
  y2: end[1],
})

/* Find whether the current device is a Mac / iOS / iPadOS. */
export const isDarwin = (): boolean => /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

/* Get whether an event is command (mac) or control (pc) */
export const metaKey = (e: KeyboardEvent | React.KeyboardEvent): boolean => isDarwin() ? e.metaKey : e.ctrlKey
