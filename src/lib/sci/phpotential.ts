// 2D potential flow from elementary solutions, through the complex potential W(z) = φ + iψ.
// Uniform flow U e^{−iα} z, source (Q/2π) ln(z − z0), vortex −(iΓ/2π) ln(z − z0) (Γ > 0 anticlockwise),
// doublet κ e^{iβ} / (2π (z − z0)). See Anderson, Fundamentals of Aerodynamics, ch. 3; Milne-Thomson.

export type C = [number, number];
const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cexp = (t: number): C => [Math.cos(t), Math.sin(t)];

export type Kind = 'source' | 'vortex' | 'doublet';
export type Element = { kind: Kind; s: number; x: number; y: number; angle?: number }; // s: Q (m²/s), Γ (m²/s) or κ (m³/s); angle in degrees for a doublet
export type Flow = { U: number; alpha: number; els: Element[] }; // alpha in degrees

/** Complex potential W = φ + iψ at (x, y). ψ of a source jumps by Q across the branch cut behind it (θ = ±π). */
export function potential(f: Flow, x: number, y: number): C {
  const a = (f.alpha * Math.PI) / 180;
  let ph = f.U * (x * Math.cos(a) + y * Math.sin(a)), ps = f.U * (y * Math.cos(a) - x * Math.sin(a));
  for (const e of f.els) {
    const dx = x - e.x, dy = y - e.y, r2 = dx * dx + dy * dy, th = Math.atan2(dy, dx), lr = 0.5 * Math.log(r2);
    if (e.kind === 'source') { ph += (e.s / (2 * Math.PI)) * lr; ps += (e.s / (2 * Math.PI)) * th; }
    else if (e.kind === 'vortex') { ph += (e.s / (2 * Math.PI)) * th; ps -= (e.s / (2 * Math.PI)) * lr; }
    else { const w = div(cexp(((e.angle ?? 0) * Math.PI) / 180), [dx, dy]); ph += (e.s / (2 * Math.PI)) * w[0]; ps += (e.s / (2 * Math.PI)) * w[1]; }
  }
  return [ph, ps];
}
/** dW/dz = u − i v. */
export function dW(f: Flow, x: number, y: number): C {
  const a = (f.alpha * Math.PI) / 180;
  let r: C = [f.U * Math.cos(a), -f.U * Math.sin(a)];
  for (const e of f.els) {
    const z: C = [x - e.x, y - e.y];
    if (e.kind === 'source') { const t = div([e.s / (2 * Math.PI), 0], z); r = [r[0] + t[0], r[1] + t[1]]; }
    else if (e.kind === 'vortex') { const t = div([0, -e.s / (2 * Math.PI)], z); r = [r[0] + t[0], r[1] + t[1]]; }
    else { const t = div(mul([-e.s / (2 * Math.PI), 0], cexp(((e.angle ?? 0) * Math.PI) / 180)), mul(z, z)); r = [r[0] + t[0], r[1] + t[1]]; }
  }
  return r;
}
/** d²W/dz², for Newton's method on stagnation points. */
function d2W(f: Flow, x: number, y: number): C {
  let r: C = [0, 0];
  for (const e of f.els) {
    const z: C = [x - e.x, y - e.y], z2 = mul(z, z);
    if (e.kind === 'source') { const t = div([-e.s / (2 * Math.PI), 0], z2); r = [r[0] + t[0], r[1] + t[1]]; }
    else if (e.kind === 'vortex') { const t = div([0, e.s / (2 * Math.PI)], z2); r = [r[0] + t[0], r[1] + t[1]]; }
    else { const t = div(mul([e.s / Math.PI, 0], cexp(((e.angle ?? 0) * Math.PI) / 180)), mul(z2, z)); r = [r[0] + t[0], r[1] + t[1]]; }
  }
  return r;
}
export const velocity = (f: Flow, x: number, y: number): [number, number] => { const w = dW(f, x, y); return [w[0], -w[1]]; };

/** Stagnation points inside the box, found by Newton's method from a grid of starting points. */
export function stagnation(f: Flow, x0: number, x1: number, y0: number, y1: number, n = 24): [number, number][] {
  const out: [number, number][] = [], tol = 1e-9 * Math.max(x1 - x0, y1 - y0);
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    let x = x0 + ((x1 - x0) * (i + 0.5)) / (n + 1), y = y0 + ((y1 - y0) * (j + 0.5)) / (n + 1), ok = false;
    for (let k = 0; k < 60; k++) {
      const F = dW(f, x, y), D = d2W(f, x, y);
      if (!(D[0] || D[1])) break;
      const s = div(F, D); x -= s[0]; y -= s[1];
      if (!Number.isFinite(x) || Math.abs(x) > 1e6) break;
      if (Math.hypot(s[0], s[1]) < tol) { ok = true; break; }
    }
    if (!ok || x < x0 || x > x1 || y < y0 || y > y1) continue;
    const w = dW(f, x, y); if (Math.hypot(w[0], w[1]) > 1e-7 * (Math.abs(f.U) + 1)) continue;
    if (f.els.some((e) => Math.hypot(x - e.x, y - e.y) < 1e-6)) continue;
    if (!out.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-5 * (x1 - x0))) out.push([x, y]);
  }
  return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

/** Force per unit depth on whatever lies inside a circle (Blasius): X − iY = (iρ/2) ∮ (dW/dz)² dz. */
export function blasius(f: Flow, cx: number, cy: number, R: number, rho = 1, n = 2048): { Fx: number; Fy: number } {
  let s: C = [0, 0];
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * (k + 0.5)) / n, z: C = [cx + R * Math.cos(t), cy + R * Math.sin(t)], dz: C = [(-R * Math.sin(t) * 2 * Math.PI) / n, (R * Math.cos(t) * 2 * Math.PI) / n];
    const w = dW(f, z[0], z[1]), w2 = mul(w, w), p = mul(w2, dz); s = [s[0] + p[0], s[1] + p[1]];
  }
  const XmiY = mul([0, rho / 2], s);
  return { Fx: XmiY[0], Fy: -XmiY[1] };
}

/** Line segments of the contours of a grid field (marching squares). Cells where the field jumps by more than `jump` are skipped (branch cuts). */
export function contours(g: Float64Array, nx: number, ny: number, levels: number[], jump: number): { lv: number; seg: [number, number, number, number] }[] {
  const out: { lv: number; seg: [number, number, number, number] }[] = [];
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = g[j * nx + i], b = g[j * nx + i + 1], c = g[(j + 1) * nx + i + 1], d = g[(j + 1) * nx + i];
    if (![a, b, c, d].every(Number.isFinite)) continue;
    const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
    if (hi - lo > jump) continue;
    for (const lv of levels) {
      if (lv < lo || lv > hi) continue;
      const pts: [number, number][] = [];
      const edge = (v1: number, v2: number, x1: number, y1: number, x2: number, y2: number) => { if ((v1 < lv) !== (v2 < lv)) { const t = (lv - v1) / (v2 - v1); pts.push([x1 + t * (x2 - x1), y1 + t * (y2 - y1)]); } };
      edge(a, b, i, j, i + 1, j); edge(b, c, i + 1, j, i + 1, j + 1); edge(c, d, i + 1, j + 1, i, j + 1); edge(d, a, i, j + 1, i, j);
      if (pts.length === 2) out.push({ lv, seg: [pts[0][0], pts[0][1], pts[1][0], pts[1][1]] });
      else if (pts.length === 4) { out.push({ lv, seg: [pts[0][0], pts[0][1], pts[1][0], pts[1][1]] }); out.push({ lv, seg: [pts[2][0], pts[2][1], pts[3][0], pts[3][1]] }); }
    }
  }
  return out;
}

export type Preset = { id: string; name: string; flow: Flow };
/** Classic textbook combinations, in made-up round numbers. */
export const PRESETS: Preset[] = [
  { id: 'cyl', name: 'Flow past a cylinder (uniform + doublet)', flow: { U: 1, alpha: 0, els: [{ kind: 'doublet', s: 2 * Math.PI, x: 0, y: 0, angle: 0 }] } },
  { id: 'lift', name: 'Spinning cylinder with lift (+ vortex)', flow: { U: 1, alpha: 0, els: [{ kind: 'doublet', s: 2 * Math.PI, x: 0, y: 0, angle: 0 }, { kind: 'vortex', s: -2 * Math.PI, x: 0, y: 0 }] } },
  { id: 'half', name: 'Rankine half-body (uniform + source)', flow: { U: 1, alpha: 0, els: [{ kind: 'source', s: 2 * Math.PI, x: 0, y: 0 }] } },
  { id: 'oval', name: 'Rankine oval (uniform + source + sink)', flow: { U: 1, alpha: 0, els: [{ kind: 'source', s: 2 * Math.PI, x: -1, y: 0 }, { kind: 'source', s: -2 * Math.PI, x: 1, y: 0 }] } },
  { id: 'pair', name: 'Source and sink, no stream', flow: { U: 0, alpha: 0, els: [{ kind: 'source', s: 4, x: -1, y: 0 }, { kind: 'source', s: -4, x: 1, y: 0 }] } },
  { id: 'vpair', name: 'Vortex pair', flow: { U: 0, alpha: 0, els: [{ kind: 'vortex', s: 4, x: 0, y: 0.6 }, { kind: 'vortex', s: -4, x: 0, y: -0.6 }] } },
];
