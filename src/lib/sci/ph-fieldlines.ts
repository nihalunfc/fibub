// Electric field, potential, field lines and equipotentials for point charges, infinite line charges
// (perpendicular to the drawing plane) and point dipoles, all lying in one plane. SI units throughout:
// metres, coulombs (point), coulombs per metre (line), coulomb metres (dipole). No DOM.

/** Coulomb constant 1/(4πε₀) in N m²/C² (CODATA 2022, ε₀ = 8.8541878188e-12 F/m). */
export const EPS0 = 8.8541878188e-12;
export const KE = 1 / (4 * Math.PI * EPS0);

export type SrcKind = 'point' | 'line' | 'dipole';
/** One source. `q` is the charge (C), line charge density (C/m) or dipole moment (C m); `ang` is the dipole's direction in degrees from +x. */
export type Src = { kind: SrcKind; x: number; y: number; q: number; ang?: number };
export type FieldAt = { ex: number; ey: number; v: number };

/**
 * Field and potential of one source at (x, y). The potential is zero far away for point charges and
 * dipoles; an infinite line charge has no such zero, so its potential is taken as zero 1 m from the line.
 */
export function fieldOf(s: Src, x: number, y: number): FieldAt {
  const dx = x - s.x, dy = y - s.y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
  if (r2 === 0) return { ex: NaN, ey: NaN, v: NaN };
  if (s.kind === 'point') {
    const k = (KE * s.q) / (r2 * r);
    return { ex: k * dx, ey: k * dy, v: (KE * s.q) / r };
  }
  if (s.kind === 'line') {
    const k = (2 * KE * s.q) / r2;
    return { ex: k * dx, ey: k * dy, v: -2 * KE * s.q * Math.log(r) };
  }
  const a = ((s.ang ?? 0) * Math.PI) / 180, px = s.q * Math.cos(a), py = s.q * Math.sin(a);
  const pr = (px * dx + py * dy) / r; // p · r̂
  const k = KE / (r2 * r);
  return { ex: k * ((3 * pr * dx) / r - px), ey: k * ((3 * pr * dy) / r - py), v: (KE * pr) / r2 };
}

/** Total field and potential at (x, y) by superposition. Skip source `skip` (to get the field acting on it). */
export function field(srcs: Src[], x: number, y: number, skip = -1): FieldAt {
  let ex = 0, ey = 0, v = 0;
  srcs.forEach((s, i) => { if (i === skip) return; const f = fieldOf(s, x, y); ex += f.ex; ey += f.ey; v += f.v; });
  return { ex, ey, v };
}

/** Force on point charge i from all the other sources (N), or on line charge i per metre from the other line charges (N/m). */
export function forceOn(srcs: Src[], i: number): { fx: number; fy: number; perMetre: boolean } | null {
  const s = srcs[i];
  if (s.kind === 'dipole') return null;
  const others = s.kind === 'line' ? srcs.map((o, j) => (o.kind === 'line' || j === i ? o : { ...o, q: 0 })) : srcs;
  const f = field(others, s.x, s.y, i);
  return { fx: s.q * f.ex, fy: s.q * f.ey, perMetre: s.kind === 'line' };
}

export type Box = { x0: number; x1: number; y0: number; y1: number };
export type FieldLine = { pts: [number, number][]; start: number; end: number | null };

/** The source (index) within distance d of (x, y), or -1. */
function near(srcs: Src[], x: number, y: number, d: number, skip = -1): number {
  for (let i = 0; i < srcs.length; i++) { if (i === skip || srcs[i].q === 0) continue; if (Math.hypot(x - srcs[i].x, y - srcs[i].y) < d) return i; }
  return -1;
}

function dir(srcs: Src[], x: number, y: number, sgn: number): [number, number] | null {
  const f = field(srcs, x, y), m = Math.hypot(f.ex, f.ey);
  if (!(m > 0) || !Number.isFinite(m)) return null;
  return [(sgn * f.ex) / m, (sgn * f.ey) / m];
}

/** Follow a field line from (x, y), along E (sgn = 1) or against it (sgn = −1), with RK4 steps of arc length. */
export function trace(srcs: Src[], x: number, y: number, sgn: number, box: Box, start: number, r0: number, maxSteps = 4000): FieldLine {
  const size = Math.max(box.x1 - box.x0, box.y1 - box.y0);
  const out: Box = { x0: box.x0 - 3 * size, x1: box.x1 + 3 * size, y0: box.y0 - 3 * size, y1: box.y1 + 3 * size };
  const pts: [number, number][] = [[x, y]];
  let travelled = 0, end: number | null = null;
  for (let n = 0; n < maxSteps; n++) {
    let dmin = Infinity;
    for (const s of srcs) if (s.q !== 0) dmin = Math.min(dmin, Math.hypot(x - s.x, y - s.y));
    const h = Math.min(size / 150, Math.max(size / 4000, dmin * 0.08));
    const k1 = dir(srcs, x, y, sgn); if (!k1) break;
    const k2 = dir(srcs, x + (h / 2) * k1[0], y + (h / 2) * k1[1], sgn); if (!k2) break;
    const k3 = dir(srcs, x + (h / 2) * k2[0], y + (h / 2) * k2[1], sgn); if (!k3) break;
    const k4 = dir(srcs, x + h * k3[0], y + h * k3[1], sgn); if (!k4) break;
    x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    travelled += h; pts.push([x, y]);
    const hit = near(srcs, x, y, r0 * 0.6, travelled < r0 * 2 ? start : -1);
    if (hit >= 0) { pts.push([srcs[hit].x, srcs[hit].y]); end = hit; break; }
    if (x < out.x0 || x > out.x1 || y < out.y0 || y > out.y1) break;
  }
  return { pts, start, end };
}

/**
 * Field lines for the whole arrangement. Lines leave positive charges (count in proportion to the
 * charge, `perMax` for the largest of each kind) and are traced backwards from negative charges, keeping
 * only the backward lines that do not end on a positive charge (those are already drawn). Dipoles get
 * lines from a small circle around them where the field points outwards.
 */
export function fieldLines(srcs: Src[], box: Box, perMax = 16): FieldLine[] {
  const size = Math.max(box.x1 - box.x0, box.y1 - box.y0), r0 = size * 0.018;
  const maxQ = (k: SrcKind) => Math.max(0, ...srcs.filter((s) => s.kind === k).map((s) => Math.abs(s.q)));
  const qmax = { point: maxQ('point'), line: maxQ('line'), dipole: maxQ('dipole') };
  const lines: FieldLine[] = [];
  srcs.forEach((s, i) => {
    if (!s.q) return;
    if (s.kind === 'dipole') {
      const n = 2 * perMax;
      for (let j = 0; j < n; j++) {
        const a = ((j + 0.5) * 2 * Math.PI) / n, x = s.x + r0 * Math.cos(a), y = s.y + r0 * Math.sin(a);
        const f = fieldOf(s, x, y);
        if (f.ex * Math.cos(a) + f.ey * Math.sin(a) > 0) lines.push(trace(srcs, x, y, 1, box, i, r0));
      }
      return;
    }
    const n = Math.max(1, Math.round((perMax * Math.abs(s.q)) / qmax[s.kind]));
    const sgn = s.q > 0 ? 1 : -1;
    for (let j = 0; j < n; j++) {
      const a = ((j + (sgn > 0 ? 0 : 0.5)) * 2 * Math.PI) / n, x = s.x + r0 * Math.cos(a), y = s.y + r0 * Math.sin(a);
      const L = trace(srcs, x, y, sgn, box, i, r0);
      L.pts.unshift([s.x, s.y]);
      if (sgn < 0) {
        if (L.end != null && srcs[L.end].q > 0 && srcs[L.end].kind !== 'dipole') continue;
        L.pts.reverse();
      }
      lines.push(L);
    }
  });
  return lines;
}

/** Potential on an nx × ny grid over the box (row-major, y increasing with row). */
export function potentialGrid(srcs: Src[], box: Box, nx: number, ny: number): Float64Array {
  const g = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = box.x0 + ((box.x1 - box.x0) * i) / (nx - 1), y = box.y0 + ((box.y1 - box.y0) * j) / (ny - 1);
    g[j * nx + i] = field(srcs, x, y).v;
  }
  return g;
}

/**
 * Equipotential levels: zero (when the potential changes sign) and 1, 2, 5 steps either side, from a
 * typical size of the potential (the median of |V| on the grid) up to 20 times it.
 */
export function niceLevels(g: Float64Array): number[] {
  const a = Array.from(g).filter(Number.isFinite).map(Math.abs).sort((p, q) => p - q);
  if (!a.length) return [];
  const med = a[Math.floor(a.length / 2)];
  if (!(med > 0)) return [];
  const lo = Math.min(...Array.from(g).filter(Number.isFinite)), hi = Math.max(...Array.from(g).filter(Number.isFinite));
  const base = Math.pow(10, Math.floor(Math.log10(med / 4)));
  const steps: number[] = [];
  for (let e = base; e <= med * 20; e *= 10) for (const m of [1, 2, 5]) if (e * m >= med / 4 && e * m <= med * 20) steps.push(e * m);
  const out: number[] = [];
  if (lo < 0 && hi > 0) out.push(0);
  for (const s of steps) { if (s < hi) out.push(s); if (-s > lo) out.push(-s); }
  return out.sort((p, q) => p - q);
}

/** Marching squares: line segments where the grid crosses `level` (grid as from potentialGrid). */
export function contour(g: Float64Array, nx: number, ny: number, box: Box, level: number): [number, number, number, number][] {
  const segs: [number, number, number, number][] = [];
  const X = (i: number) => box.x0 + ((box.x1 - box.x0) * i) / (nx - 1), Y = (j: number) => box.y0 + ((box.y1 - box.y0) * j) / (ny - 1);
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const v = [g[j * nx + i], g[j * nx + i + 1], g[(j + 1) * nx + i + 1], g[(j + 1) * nx + i]];
    if (!v.every(Number.isFinite)) continue;
    const c = (v[0] > level ? 1 : 0) | (v[1] > level ? 2 : 0) | (v[2] > level ? 4 : 0) | (v[3] > level ? 8 : 0);
    if (c === 0 || c === 15) continue;
    const t = (a: number, b: number) => (level - a) / (b - a);
    const e = [
      (): [number, number] => [X(i + t(v[0], v[1])), Y(j)],
      (): [number, number] => [X(i + 1), Y(j + t(v[1], v[2]))],
      (): [number, number] => [X(i + 1 - t(v[2], v[3])), Y(j + 1)],
      (): [number, number] => [X(i), Y(j + 1 - t(v[3], v[0]))],
    ];
    const add = (a: number, b: number) => { const p = e[a](), q = e[b](); segs.push([p[0], p[1], q[0], q[1]]); };
    const mid = (v[0] + v[1] + v[2] + v[3]) / 4 > level;
    switch (c) {
      case 1: case 14: add(3, 0); break;
      case 2: case 13: add(0, 1); break;
      case 3: case 12: add(3, 1); break;
      case 4: case 11: add(1, 2); break;
      case 6: case 9: add(0, 2); break;
      case 7: case 8: add(2, 3); break;
      case 5: if (mid) { add(3, 2); add(0, 1); } else { add(3, 0); add(1, 2); } break;
      case 10: if (mid) { add(3, 0); add(1, 2); } else { add(0, 1); add(2, 3); } break;
    }
  }
  return segs;
}

/** Electric flux through a circle of radius r around (cx, cy), per metre of depth (2D Gauss's law: equals λ_enclosed / ε₀ for line charges). */
export function flux2D(srcs: Src[], cx: number, cy: number, r: number, n = 2000): number {
  let s = 0;
  for (let k = 0; k < n; k++) {
    const a = ((k + 0.5) * 2 * Math.PI) / n, f = field(srcs, cx + r * Math.cos(a), cy + r * Math.sin(a));
    s += (f.ex * Math.cos(a) + f.ey * Math.sin(a)) * r * ((2 * Math.PI) / n);
  }
  return s;
}
