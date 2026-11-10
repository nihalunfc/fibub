// Area of a circle by slicing: n equal sectors, laid alternately up and down in a row, make a shape close to a
// parallelogram of width πr and height r. With straight chords for the arcs, its area is the inscribed n-gon's,
// (n/2)·r²·sin(2π/n), which tends to πr². Plain TypeScript, no DOM.

/** Chord of one slice (the straight edge across its arc). */
export const chord = (n: number, r: number) => 2 * r * Math.sin(Math.PI / n);
/** Width of the row of n slices (half of them point up): (n/2) chords. */
export const rowWidth = (n: number, r: number) => (n / 2) * chord(n, r);
/** Height of the row: the slice's height from tip to chord. */
export const rowHeight = (n: number, r: number) => r * Math.cos(Math.PI / n);
/** Area of the near-parallelogram (straight chords) = area of the regular n-gon inside the circle. */
export const rowArea = (n: number, r: number) => rowWidth(n, r) * rowHeight(n, r);
export const circleArea = (r: number) => Math.PI * r * r;
/** The arc length along the top of the row: half the circumference, πr, whatever n. */
export const halfCirc = (r: number) => Math.PI * r;

export type Pose = { x: number; y: number; dir: number };
/**
 * Where slice i sits (tip position and the direction its middle points, radians) in the circle (t = 0) and in the
 * row (t = 1), with the circle centred at (cx, cy) and the row starting at (rx, ry) (y grows downwards, like SVG).
 * Slices 0 … n/2 − 1 are the top half of the circle and point up in the row; the rest point down between them.
 */
export function pose(i: number, n: number, r: number, t: number, cx: number, cy: number, rx: number, ry: number): Pose {
  const a = (2 * Math.PI) / n, half = n / 2, c = chord(n, r), h = rowHeight(n, r);
  // In the circle (SVG y down): slice i points at angle −(i + ½)a (top half first).
  const d0 = -(i + 0.5) * a;
  // Up slices: tip on the bottom line at (j + ½)·c, arc above. Down slices: tip on the top line at (m + 1)·c, arc
  // below; their chord ends meet the up slices' tips, so the row closes up with no gaps (for straight chords).
  const up = i < half;
  const x1 = up ? rx + (i + 0.5) * c : rx + (i - half + 1) * c, y1 = up ? ry : ry - h, d1 = up ? -Math.PI / 2 : Math.PI / 2;
  let dd = d1 - d0; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
  return { x: cx + (x1 - cx) * t, y: cy + (y1 - cy) * t, dir: d0 + dd * t };
}
