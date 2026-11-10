// Square roots by construction for school (Learn): the spiral of Theodorus (right triangles with legs √k and 1,
// hypotenuse √(k + 1)) and the semicircle construction of √x on the number line. No DOM.

export type P = [number, number];

/** Vertices of the spiral after n triangles: the centre O, then points at distance √1, √2, ..., √(n + 1). */
export function spiral(n: number): { O: P; pts: P[]; angles: number[] } {
  const pts: P[] = [[1, 0]], angles = [0];
  let th = 0;
  for (let k = 1; k <= n; k++) {
    th += Math.atan(1 / Math.sqrt(k));
    const r = Math.sqrt(k + 1);
    pts.push([r * Math.cos(th), r * Math.sin(th)]); angles.push(th);
  }
  return { O: [0, 0], pts, angles };
}

/** Angle at the centre of triangle k (degrees): tan = 1/√k. */
export const centreAngle = (k: number) => (Math.atan(1 / Math.sqrt(k)) * 180) / Math.PI;

/** Total turn after n triangles, in degrees. */
export function totalTurn(n: number) {
  let s = 0;
  for (let k = 1; k <= n; k++) s += centreAngle(k);
  return s;
}

/**
 * The semicircle construction: mark AB = x and BC = 1 on a line, draw the semicircle on AC, and raise a
 * perpendicular at B to meet it at D. Then BD = √x. Returns the centre, radius and BD (from the geometry).
 */
export function semicircle(x: number) {
  const r = (x + 1) / 2, centre = r, b = x;         // A at 0, B at x, C at x + 1
  const bd = Math.sqrt(Math.max(0, r * r - (b - centre) * (b - centre)));
  return { A: 0, B: b, C: x + 1, centre, r, bd };
}

/** √n in simplest form: 12 → "2√3", 16 → "4", 7 → "√7". */
export function surd(n: number): string {
  let out = 1, rest = n;
  for (let k = 2; k * k <= rest; k++) while (rest % (k * k) === 0) { out *= k; rest /= k * k; }
  return rest === 1 ? String(out) : (out === 1 ? '' : String(out)) + '√' + rest;
}
