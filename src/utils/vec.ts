
/* Add vectors */
export const add = (A: number[], B: number[]) => [A[0] + B[0], A[1] + B[1]]

/* Add scalar to vector */
export const addScalar = (A: number[], n: number) => [A[0] + n, A[1] + n]

/* Subtract vectors */
export const sub = (A: number[], B: number[]) => [A[0] - B[0], A[1] - B[1]]

/* Get the vector from vectors A to B */
export const vec = (A: number[], B: number[]): number[] => [B[0] - A[0], B[1] - A[1]]

/* Vector multiplication by scalar */
export const mul = (A: number[], n: number): number[] => [A[0] * n, A[1] * n]

/* Multiply two vectors */
export const mulV = (A: number[], B: number[]): number[] => [A[0] * B[0], A[1] * B[1]]

/* Vector division by scalar */
export const div = (A: number[], n: number): number[] => [A[0] / n, A[1] / n]

/* Vector division by vector */
export const divV = (A: number[], B: number[]): number[] => [A[0] / B[0], A[1] / B[1]]

/* Perpendicular rotation of a vector A */
export const per = (A: number[]): number[] => [A[1], -A[0]]

/* Dot product */
export const dpr = (A: number[], B: number[]): number => A[0] * B[0] + A[1] * B[1]

/* Cross product (outer product) | A X B | */
export const cpr = (A: number[], B: number[]): number => A[0] * B[1] - B[0] * A[1]

/* Cross (for point in polygon) */
export const cross = (x: number[], y: number[], z: number[]): number =>
  (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1])

/* Length of the vector squared */
export const len2 = (A: number[]): number => A[0] * A[0] + A[1] * A[1]

/* Length of the vector */
export const len = (A: number[]): number => Math.hypot(A[0], A[1])

/* Project A over B */
export const pry = (A: number[], B: number[]): number => dpr(A, B) / len(B)

/* Get normalized / unit vector */
export const uni = (A: number[]): number[] => div(A, len(A))

/* Get normalized / unit vector */
export const normalize = (A: number[]): number[] => uni(A)

/* Get the tangent between two vectors. */
export const tangent = (A: number[], B: number[]): number[] => uni(sub(A, B))

/* Dist length from A to B squared. */
export const dist2 = (A: number[], B: number[]): number => len2(sub(A, B))

/* Dist length from A to B */
export const dist = (A: number[], B: number[]): number => Math.hypot(A[1] - B[1], A[0] - B[0])

/* A faster, though less accurate method for testing distances. Maybe faster? */
export const fastDist = (A: number[], B: number[]): number[] => {
  const V = [B[0] - A[0], B[1] - A[1]]
  const aV = [Math.abs(V[0]), Math.abs(V[1])]
  let r = 1 / Math.max(aV[0], aV[1])
  r *= (1.29289 - (aV[0] + aV[1]) * r * 0.29289)
  return [V[0] * r, V[1] * r]
}

/* Angle between vector A and vector B in radians */
export const ang = (A: number[], B: number[]): number =>
  Math.atan2(cpr(A, B), dpr(A, B))

/* Angle between positive x-axis and vector A -> B in radians */
export const angle = (A: number[], B: number[]): number => Math.atan2(B[1] - A[1], B[0] - A[0])

/* Mean between two vectors or mid vector between two vectors */
export const med = (A: number[], B: number[]): number[] => mul(add(A, B), 0.5)

/* vector rotation by r (radians) */
export const rot = (A: number[], r = 0): number[] =>
  [A[0] * Math.cos(r) - A[1] * Math.sin(r), A[0] * Math.sin(r) + A[1] * Math.cos(r)]

/* Rotate a vector around another vector by r (radians) */
export const rotWith = (A: number[], C: number[], r = 0): number[] => {
  if (r === 0) return A

  const s = Math.sin(r)
  const c = Math.cos(r)

  const px = A[0] - C[0]
  const py = A[1] - C[1]

  const nx = px * c - py * s
  const ny = px * s + py * c

  return [nx + C[0], ny + C[1]]
}

/**
 * Get the nearest point on a line segment between A and B
 * @param A The start of the line segment
 * @param B The end of the line segment
 * @param P The off-line point
 * @param clamp Whether to clamp the point between A and B.
 * @returns
 */
export const nearestPointOnLineSegment = (
  A: number[],
  B: number[],
  P: number[],
  clamp = true,
): number[] => {
  const u = uni(sub(B, A))
  const C = add(A, mul(u, pry(sub(P, A), u)))

  if (clamp) {
    if (C[0] < Math.min(A[0], B[0])) return A[0] < B[0] ? A : B
    if (C[0] > Math.max(A[0], B[0])) return A[0] > B[0] ? A : B
    if (C[1] < Math.min(A[1], B[1])) return A[1] < B[1] ? A : B
    if (C[1] > Math.max(A[1], B[1])) return A[1] > B[1] ? A : B
  }

  return C
}

/**
 * Distance between a point and the nearest point on a line segment between A and B
 * @param A The start of the line segment
 * @param B The end of the line segment
 * @param P The off-line point
 * @param clamp Whether to clamp the point between A and B.
 * @returns
 */
export const distanceToLineSegment = (A: number[], B: number[], P: number[], clamp = true): number =>
  dist(P, nearestPointOnLineSegment(A, B, P, clamp))

/* Check of two vectors are identical */
export const isEqual = (A: number[], B: number[]): boolean => A[0] === B[0] && A[1] === B[1]

/* Interpolate vector A to B with a scalar t */
export const lrp = (A: number[], B: number[], t: number): number[] => add(A, mul(sub(B, A), t))

/* Absolute value of a vector */
export const abs = (A: number[]): number[] =>
  [Math.abs(A[0]), Math.abs(A[1])]

export const rescale = (a: number[], n: number): number[] => {
  const l = len(a)
  return [(n * a[0]) / l, (n * a[1]) / l]
}

/* Round a vector to the a given precision */
export const toFixed = (a: number[], d = 2): number[] => a.map(v => +v.toFixed(d))

/* Snap vector to nearest step */
export const snap = (a: number[], step = 1) =>
  (step === 1) ? a
    : [Math.round(a[0] / step) * step, Math.round(a[1] / step) * step]

/* Round a vector to a precision length */
export const toPrecision = (a: number[], n = 4): number[] =>
  [+a[0].toPrecision(n), +a[1].toPrecision(n)]

/* Get an array of points (with simulated pressure) between two points */
export const pointsBetween = (A: number[], B: number[], steps = 6): number[][] =>
  Array.from(Array(steps)).map((_, i) => {
    const t = i / (steps - 1)
    const k = Math.min(1, 0.5 + Math.abs(0.5 - t))
    return [...lrp(A, B, t), k]
  })

/* Get the slope between two points */
export const slope = (A: number[], B: number[]) =>
  (A[1] - B[1]) / (A[0] - B[0])

// Perpendicular slope
export const perpSlope = (A: number[], B: number[]) => {
  const origSlope = slope(A, B)
  return Number.isFinite(origSlope) ? -1 / origSlope : 0
}

export const diffForSlope = (sl: number) => {
  if (!Number.isFinite(sl)) return { dx: 0, dy: 1 }
  return {
    dx: 1 / Math.sqrt(sl * sl + 1),
    dy: sl / Math.sqrt(sl * sl + 1),
  }
}
