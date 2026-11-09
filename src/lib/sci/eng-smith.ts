// Smith chart maths: reflection coefficient, VSWR and return loss, lossless line transformation, L-network matching
// (both topologies, all solutions) and single shunt-stub matching (open or short), following the standard formulas
// (Pozar, Microwave Engineering, chapters 2 and 5). Plain TypeScript, no DOM; checked in tests/sci-tools/smith-chart.mjs.

export type Cx = [number, number];
export const add = (a: Cx, b: Cx): Cx => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: Cx, b: Cx): Cx => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const div = (a: Cx, b: Cx): Cx => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
export const abs = (a: Cx) => Math.hypot(a[0], a[1]);
export const inv = (a: Cx) => div([1, 0], a);
const par = (a: Cx, b: Cx) => div(mul(a, b), add(a, b));

/** Reflection coefficient Γ = (Z − Z0)/(Z + Z0) for a real Z0. */
export const gamma = (z: Cx, z0: number): Cx => div(sub(z, [z0, 0]), add(z, [z0, 0]));
/** Impedance from Γ: Z = Z0 (1 + Γ)/(1 − Γ). */
export const zFromGamma = (g: Cx, z0: number): Cx => mul([z0, 0], div(add([1, 0], g), sub([1, 0], g)));

export function mismatch(z: Cx, z0: number) {
  const g = gamma(z, z0), m = abs(g);
  return {
    gamma: g, mag: m, angleDeg: (Math.atan2(g[1], g[0]) * 180) / Math.PI,
    vswr: m >= 1 ? Infinity : (1 + m) / (1 - m),
    returnLoss: m === 0 ? Infinity : -20 * Math.log10(m),
    mismatchLoss: m >= 1 ? Infinity : -10 * Math.log10(1 - m * m),
    powerReflected: m * m,
  };
}

/** Input impedance of a lossless line of characteristic impedance z0, length ℓ in wavelengths, ending in zl. */
export function lineZin(zl: Cx, z0: number, lenWl: number): Cx {
  const t = Math.tan(2 * Math.PI * lenWl);
  if (!Number.isFinite(t) || Math.abs(t) > 1e15) return div([z0 * z0, 0], zl); // quarter-wave: Z0²/ZL
  return mul([z0, 0], div(add(zl, [0, z0 * t]), add([z0, 0], mul([0, t], zl))));
}

export type LSolution = {
  /** 'shunt-first': shunt element across the load, then a series element towards the source. 'series-first': the reverse. */
  topology: 'shunt-first' | 'series-first';
  X: number; B: number; zin: Cx;
};
/**
 * L-network matching a load zl = R + jX to a real source z0 (Pozar 5.1). Shunt-first works when the load's admittance
 * has G ≤ 1/z0 (always when R > z0); series-first works when R < z0. Each gives two solutions.
 */
export function lMatch(zl: Cx, z0: number): LSolution[] {
  const [R, X] = zl, out: LSolution[] = [];
  const rad = R * R + X * X - z0 * R;
  if (R > 0 && rad >= -1e-12) {
    for (const s of rad > 1e-12 ? [1, -1] : [1]) {
      const B = (X + s * Math.sqrt(R / z0) * Math.sqrt(Math.max(0, rad))) / (R * R + X * X);
      if (Math.abs(B) < 1e-15) continue;
      const Xs = 1 / B + (X * z0) / R - z0 / (B * R);
      const zin = add([0, Xs], par([0, -1 / B], zl));
      out.push({ topology: 'shunt-first', X: Xs, B, zin });
    }
  }
  if (R > 0 && R < z0) {
    for (const s of [1, -1]) {
      const B = (s * Math.sqrt((z0 - R) / R)) / z0, Xs = s * Math.sqrt(R * (z0 - R)) - X;
      const zin = par([0, -1 / B], add(zl, [0, Xs]));
      out.push({ topology: 'series-first', X: Xs, B, zin });
    }
  }
  return out;
}

/** A reactance X or susceptance B at frequency f as a component. */
export function component(kind: 'X' | 'B', v: number, f: number): { type: 'L' | 'C'; value: number } {
  const w = 2 * Math.PI * f;
  if (kind === 'X') return v >= 0 ? { type: 'L', value: v / w } : { type: 'C', value: -1 / (w * v) };
  return v >= 0 ? { type: 'C', value: v / w } : { type: 'L', value: -1 / (w * v) };
}

export type StubSolution = { d: number; B: number; open: number; short: number; zAtStub: Cx };
/** Single shunt stub (Pozar 5.2): distance d from the load and the open- or short-circuited stub length, all in wavelengths. */
export function stubMatch(zl: Cx, z0: number): StubSolution[] {
  const [R, X] = zl, Y0 = 1 / z0, ts: number[] = [];
  if (Math.abs(R - z0) < 1e-12 * z0) ts.push(-X / (2 * z0));
  else { const r = Math.sqrt((R * ((z0 - R) ** 2 + X * X)) / z0); ts.push((X + r) / (R - z0), (X - r) / (R - z0)); }
  return ts.map((t) => {
    const d = t >= 0 ? Math.atan(t) / (2 * Math.PI) : (Math.PI + Math.atan(t)) / (2 * Math.PI);
    const B = (R * R * t - (z0 - X * t) * (X + z0 * t)) / (z0 * (R * R + (X + z0 * t) ** 2));
    // The stub must add −jB: an open stub gives jY0·tan(βℓ), a shorted one −jY0·cot(βℓ).
    let open = -Math.atan(B / Y0) / (2 * Math.PI); if (open < 0) open += 0.5;
    let short = Math.atan(Y0 / B) / (2 * Math.PI); if (short < 0) short += 0.5;
    return { d, B, open, short, zAtStub: lineZin(zl, z0, d) };
  });
}

/** Points of a constant-resistance circle on the Smith chart (Γ plane): centre r/(1+r), radius 1/(1+r). */
export function rCircle(r: number, n = 180): Cx[] {
  const c = r / (1 + r), rad = 1 / (1 + r), pts: Cx[] = [];
  for (let i = 0; i <= n; i++) { const a = (2 * Math.PI * i) / n; pts.push([c + rad * Math.cos(a), rad * Math.sin(a)]); }
  return pts;
}
/** Points of a constant-reactance arc inside the chart, from r = 0 to r = ∞ (Γ = 1). */
export function xArc(x: number, n = 120): Cx[] {
  const pts: Cx[] = [];
  for (let i = 0; i < n; i++) pts.push(gamma([Math.tan((Math.PI / 2) * (i / n)), x], 1));
  pts.push([1, 0]);
  return pts;
}
/** Γ along a lossless line from the load towards the generator: Γ(ℓ) = ΓL e^(−j4πℓ/λ). */
export function lineArc(gl: Cx, lenWl: number, n = 120): Cx[] {
  const pts: Cx[] = [];
  for (let i = 0; i <= n; i++) { const a = (-4 * Math.PI * lenWl * i) / n; pts.push(mul(gl, [Math.cos(a), Math.sin(a)])); }
  return pts;
}
