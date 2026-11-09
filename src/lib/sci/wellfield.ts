// Several pumping wells: Theis drawdown added up (superposition), a straight boundary by an image well, contour lines
// for a drawdown map, and the capture zone of one well in uniform regional flow. Any consistent units. No DOM.

import { theis } from './pumptest.ts';

export type Well = { name: string; x: number; y: number; Q: number; t0: number };
/** Straight boundary: a north-south line at x = at, or an east-west line at y = at. */
export type Boundary = { kind: 'none' | 'noflow' | 'head'; axis: 'x' | 'y'; at: number };

/** Mirror image wells for a straight boundary: same sign for no-flow, opposite sign for constant head. */
export function withImages(wells: Well[], b?: Boundary): Well[] {
  if (!b || b.kind === 'none') return wells;
  const s = b.kind === 'noflow' ? 1 : -1;
  return [...wells, ...wells.map((w) => ({ ...w, name: `${w.name} (image)`, x: b.axis === 'x' ? 2 * b.at - w.x : w.x, y: b.axis === 'y' ? 2 * b.at - w.y : w.y, Q: s * w.Q }))];
}

/** Total drawdown at (x, y) and time t. Distances below rw are treated as rw (the well's own radius). */
export function drawdown(x: number, y: number, t: number, wells: Well[], T: number, S: number, rw = 0.1) {
  let s = 0;
  for (const w of wells) { const dt = t - w.t0; if (!(dt > 0) || w.Q === 0) continue; const r = Math.max(rw, Math.hypot(x - w.x, y - w.y)); s += theis(dt, r, w.Q, T, S); }
  return s;
}

/** Marching squares: line segments where the gridded field z[j][i] (rows j along y) crosses level v. */
export function contour(z: number[][], xs: number[], ys: number[], v: number): [number, number, number, number][] {
  const seg: [number, number, number, number][] = [];
  const lerp = (a: number, b: number, za: number, zb: number) => a + ((v - za) / (zb - za)) * (b - a);
  for (let j = 0; j + 1 < ys.length; j++) for (let i = 0; i + 1 < xs.length; i++) {
    const z00 = z[j][i], z10 = z[j][i + 1], z01 = z[j + 1][i], z11 = z[j + 1][i + 1];
    const p: [number, number][] = [];
    if ((z00 < v) !== (z10 < v)) p.push([lerp(xs[i], xs[i + 1], z00, z10), ys[j]]);
    if ((z10 < v) !== (z11 < v)) p.push([xs[i + 1], lerp(ys[j], ys[j + 1], z10, z11)]);
    if ((z01 < v) !== (z11 < v)) p.push([lerp(xs[i], xs[i + 1], z01, z11), ys[j + 1]]);
    if ((z00 < v) !== (z01 < v)) p.push([xs[i], lerp(ys[j], ys[j + 1], z00, z01)]);
    if (p.length === 2) seg.push([p[0][0], p[0][1], p[1][0], p[1][1]]);
    else if (p.length === 4) { seg.push([p[0][0], p[0][1], p[1][0], p[1][1]]); seg.push([p[2][0], p[2][1], p[3][0], p[3][1]]); }
  }
  return seg;
}

/**
 * Capture zone of one well pumping Q from an aquifer of thickness B in uniform regional flow with Darcy flux q
 * (flowing towards +x in the returned frame, the well at the origin). Stagnation point x0 = Q/(2πBq) downstream,
 * half-width at the well Q/(4Bq), far upstream Q/(2Bq). The divide is x = y / tan(2πBqy/Q).
 */
export function captureZone(Q: number, B: number, q: number, n = 120) {
  const ymax = Q / (2 * B * q), x0 = Q / (2 * Math.PI * B * q);
  const pts: [number, number][] = [];
  for (let k = n; k >= -n; k--) {
    const y = (k / (n + 1)) * ymax;
    const x = Math.abs(y) < 1e-12 * ymax ? x0 : y / Math.tan((2 * Math.PI * B * q * y) / Q);
    pts.push([x, y]);
  }
  return { stagnation: x0, halfWidthAtWell: Q / (4 * B * q), halfWidthFar: ymax, pts };
}
