import type React from 'react'
import { vec } from './vec'

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

/* Get the short distance between two angles */
export const angleDelta = (a0: number, a1: number): number => shortAngleDist(a0, a1)

/* Get the "sweep" or short distance between two points on a circle's perimeter */
export const getSweep = (C: number[], A: number[], B: number[]): number => angleDelta(vec.angle(C, A), vec.angle(C, B))

/* Clamp radians within 0 and 2PI */
export const clampRadians = (r: number): number => (Math.PI * 2 + r) % (Math.PI * 2)

/* Clamp rotation to even segments. */
export const snapAngleToSegments = (r: number, segments: number): number => {
  const seg = (Math.PI * 2) / segments
  return Math.floor((clampRadians(r) + seg / 2) / seg) * seg
}

/* Is angle c between angles a and b? */
export const isAngleBetween = (a: number, b: number, c: number): boolean => {
  if (c === a || c === b) return true

  const AB = (b - a + TAU) % TAU
  const AC = (c - a + TAU) % TAU
  return (AB <= Math.PI) !== (AC > AB)
}

export const degreesToRadians = (d: number): number => (d * Math.PI) / 180

export const radiansToDegrees = (r: number): number => (r * 180) / Math.PI

/* Get the length of an arc between two points on a circle's perimeter. */
export const getArcLength = (C: number[], r: number, A: number[], B: number[]): number => {
  const sweep = getSweep(C, A, B)
  return r * (2 * Math.PI) * (sweep / (2 * Math.PI))
}

export const translatePoints = (points: number[][], delta: number[]) =>
  points.map(point => ([point[0] + delta[0], point[1] + delta[1]]))

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

/* Get a unique string id */
export const uniqueId = (a = ''): string => {
  // eslint-disable-next-line no-bitwise
  if (a) return ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, uniqueId)
}

/* Debounce a function. */
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

export const getSvgLineProps = (start: number[], end: number[]) => ({
  x1: start[0], x2: end[0], y1: start[1], y2: end[1],
})

/* Find whether the current device is a Mac / iOS / iPadOS. */
export const isDarwin = (): boolean => /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

/* Get whether an event is command (mac) or control (pc) */
export const metaKey = (e: KeyboardEvent | React.KeyboardEvent): boolean => isDarwin() ? e.metaKey : e.ctrlKey

// Check for empty JS object
export const isEmpty = (obj: unknown) => obj && Object.keys(obj as object).length === 0

// Check if first obj is a subset of second
export const isContained = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) =>
  Object.keys(obj1).every(k => obj1[k] === obj2[k])
