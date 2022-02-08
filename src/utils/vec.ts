export const vec = {
  /* Add vectors */
  add(A: number[], B: number[]): number[] {
    return [A[0] + B[0], A[1] + B[1]]
  },

  /* Add scalar to vector */
  addScalar(A: number[], n: number): number[] {
    return [A[0] + n, A[1] + n]
  },

  /* Subtract vectors */
  sub(A: number[], B: number[]): number[] {
    return [A[0] - B[0], A[1] - B[1]]
  },

  /* Get the vector from vectors A to B */
  vec(A: number[], B: number[]): number[] {
    return [B[0] - A[0], B[1] - A[1]]
  },

  /* Vector multiplication by scalal */
  mul(A: number[], n: number): number[] {
    return [A[0] * n, A[1] * n]
  },

  /* Multiply two vectors */
  mulV(A: number[], B: number[]): number[] {
    return [A[0] * B[0], A[1] * B[1]]
  },

  /* Vector division by scalar */
  div(A: number[], n: number): number[] {
    return [A[0] / n, A[1] / n]
  },

  /* Vector division by vector */
  divV(A: number[], B: number[]): number[] {
    return [A[0] / B[0], A[1] / B[1]]
  },

  /* Perpendicular rotation of a vector A */
  per(A: number[]): number[] {
    return [A[1], -A[0]]
  },

  /* Dot product */
  dpr(A: number[], B: number[]): number {
    return A[0] * B[0] + A[1] * B[1]
  },

  /* Cross product (outer product) | A X B | */
  cpr(A: number[], B: number[]): number {
    return A[0] * B[1] - B[0] * A[1]
  },

  /* Cross (for point in polygon) */
  cross(x: number[], y: number[], z: number[]): number {
    return (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1])
  },

  /* Length of the vector squared */
  len2(A: number[]): number {
    return A[0] * A[0] + A[1] * A[1]
  },

  /* Length of the vector */
  len(A: number[]): number {
    return Math.hypot(A[0], A[1])
  },

  /* Project A over B */
  pry(A: number[], B: number[]): number {
    return vec.dpr(A, B) / vec.len(B)
  },

  /* Get normalized / unit vector */
  uni(A: number[]): number[] {
    return vec.div(A, vec.len(A))
  },

  /* Get normalized / unit vector */
  normalize(A: number[]): number[] {
    return vec.uni(A)
  },

  /* Get the tangent between two vectors. */
  tangent(A: number[], B: number[]): number[] {
    return vec.uni(vec.sub(A, B))
  },

  /* Dist length from A to B squared. */
  dist2(A: number[], B: number[]): number {
    return vec.len2(vec.sub(A, B))
  },

  /* Dist length from A to B */
  dist(A: number[], B: number[]): number {
    return Math.hypot(A[1] - B[1], A[0] - B[0])
  },

  /* A faster, though less accurate method for testing distances. Maybe faster? */
  fastDist(A: number[], B: number[]): number[] {
    const V = [B[0] - A[0], B[1] - A[1]]
    const aV = [Math.abs(V[0]), Math.abs(V[1])]
    let r = 1 / Math.max(aV[0], aV[1])
    r *= (1.29289 - (aV[0] + aV[1]) * r * 0.29289)
    return [V[0] * r, V[1] * r]
  },

  /* Angle between vector A and vector B in radians */
  ang(A: number[], B: number[]): number {
    return Math.atan2(vec.cpr(A, B), vec.dpr(A, B))
  },

  /* Angle between vector A and vector B in radians */
  angle(A: number[], B: number[]): number {
    return Math.atan2(B[1] - A[1], B[0] - A[0])
  },

  /* Mean between two vectors or mid vector between two vectors */
  med(A: number[], B: number[]): number[] {
    return vec.mul(vec.add(A, B), 0.5)
  },

  /* vector rotation by r (radians) */
  rot(A: number[], r = 0): number[] {
    return [A[0] * Math.cos(r) - A[1] * Math.sin(r), A[0] * Math.sin(r) + A[1] * Math.cos(r)]
  },

  /* Rotate a vector around another vector by r (radians) */
  rotWith(A: number[], C: number[], r = 0): number[] {
    if (r === 0) return A

    const s = Math.sin(r)
    const c = Math.cos(r)

    const px = A[0] - C[0]
    const py = A[1] - C[1]

    const nx = px * c - py * s
    const ny = px * s + py * c

    return [nx + C[0], ny + C[1]]
  },

  /**
   * Get the nearest point on a line segment between A and B
   * @param A The start of the line segment
   * @param B The end of the line segment
   * @param P The off-line point
   * @param clamp Whether to clamp the point between A and B.
   * @returns
   */
  nearestPointOnLineSegment(
    A: number[],
    B: number[],
    P: number[],
    clamp = true,
  ): number[] {
    const u = this.uni(this.sub(B, A))
    const C = this.add(A, this.mul(u, this.pry(this.sub(P, A), u)))

    if (clamp) {
      if (C[0] < Math.min(A[0], B[0])) return A[0] < B[0] ? A : B
      if (C[0] > Math.max(A[0], B[0])) return A[0] > B[0] ? A : B
      if (C[1] < Math.min(A[1], B[1])) return A[1] < B[1] ? A : B
      if (C[1] > Math.max(A[1], B[1])) return A[1] > B[1] ? A : B
    }

    return C
  },

  /**
   * Distance between a point and the nearest point on a line segment between A and B
   * @param A The start of the line segment
   * @param B The end of the line segment
   * @param P The off-line point
   * @param clamp Whether to clamp the point between A and B.
   * @returns
   */
  distanceToLineSegment(A: number[], B: number[], P: number[], clamp = true): number {
    return this.dist(P, this.nearestPointOnLineSegment(A, B, P, clamp))
  },

  /* Check of two vectors are identical */
  isEqual(A: number[], B: number[]): boolean {
    return A[0] === B[0] && A[1] === B[1]
  },

  /* Interpolate vector A to B with a scalar t */
  lrp(A: number[], B: number[], t: number): number[] {
    return vec.add(A, vec.mul(vec.sub(B, A), t))
  },

  /* Absolute value of a vector */
  abs(A: number[]): number[] {
    return [Math.abs(A[0]), Math.abs(A[1])]
  },

  rescale(a: number[], n: number): number[] {
    const l = vec.len(a)
    return [(n * a[0]) / l, (n * a[1]) / l]
  },

  /* Round a vector to the a given precision */
  toFixed(a: number[], d = 2): number[] {
    return a.map(v => +v.toFixed(d))
  },

  /* Snap vector to nearest step */
  snap(a: number[], step = 1) {
    return [Math.round(a[0] / step) * step, Math.round(a[1] / step) * step]
  },

  /* Round a vector to a precision length */
  toPrecision(a: number[], n = 4): number[] {
    return [+a[0].toPrecision(n), +a[1].toPrecision(n)]
  },

  /* Get an array of points (with simulated pressure) between two points */
  pointsBetween(A: number[], B: number[], steps = 6): number[][] {
    return Array.from(Array(steps)).map((_, i) => {
      const t = i / (steps - 1)
      const k = Math.min(1, 0.5 + Math.abs(0.5 - t))
      return [...vec.lrp(A, B, t), k]
    })
  },

  /* Get the slope between two points */
  slope(A: number[], B: number[]) {
    if (A[0] === B[0]) return NaN
    return (A[1] - B[1]) / (A[0] - B[0])
  },
}

export default vec
