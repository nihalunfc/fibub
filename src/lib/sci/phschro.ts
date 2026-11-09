// One-dimensional time-independent Schrödinger equation, -c ψ'' + V(x) ψ = E ψ with c = ħ²/2m, solved on a grid
// between two hard walls by the finite-difference (three-point) matrix method. The k lowest levels come from
// bisection on the tridiagonal matrix, wavefunctions from inverse iteration. Analytic levels for the textbook
// potentials are given alongside for comparison.
import { tridiagLowest } from './phq.ts';
import { parse, compile, variables } from './expr.ts';

/** ħc in eV nm and mₑc² in eV (CODATA 2018, rounded to 10 figures). */
export const HBARC_EV_NM = 197.3269804, MEC2_EV = 510998.95;
/** ħ²/2mₑ in eV nm² (about 0.0381). */
export const C_ELECTRON = (HBARC_EV_NM * HBARC_EV_NM) / (2 * MEC2_EV);
/** c = ħ²/2m for the unit system: natural (ħ = m = 1) or electron (nm, eV, mass in electron masses). */
export const cOf = (units: 'natural' | 'electron', mass = 1) => (units === 'natural' ? 0.5 / mass : C_ELECTRON / mass);

export type State = { E: number; psi: Float64Array; mean: number; spread: number; nodes: number };
export type Solution = { x: Float64Array; V: Float64Array; h: number; states: State[] };

/** Solve on N interior points between hard walls at x0 and x1 (ψ = 0 there). V is a function of x. */
export function solve(V: (x: number) => number, x0: number, x1: number, N: number, k: number, c: number): Solution {
  const h = (x1 - x0) / (N + 1), x = new Float64Array(N), Vx = new Float64Array(N);
  for (let i = 0; i < N; i++) { x[i] = x0 + (i + 1) * h; Vx[i] = V(x[i]); }
  if (!Vx.every(Number.isFinite)) throw new Error('The potential is not a finite number everywhere in the window.');
  const d = Float64Array.from(Vx, (v) => v + (2 * c) / (h * h)), e = new Float64Array(N - 1).fill(-c / (h * h));
  const { values, vectors } = tridiagLowest(d, e, k);
  const states = values.map((E, j) => {
    const v = vectors[j], psi = new Float64Array(N);
    let s = 0; for (let i = 0; i < N; i++) s += v[i] * v[i];
    const nrm = 1 / Math.sqrt(s * h);
    let m = 0, m2 = 0, nodes = 0, mx = 0;
    for (let i = 0; i < N; i++) { psi[i] = v[i] * nrm; mx = Math.max(mx, Math.abs(psi[i])); }
    for (let i = 0; i < N; i++) { const p = psi[i] * psi[i] * h; m += p * x[i]; m2 += p * x[i] * x[i]; }
    // Count sign changes, ignoring the tiny tails where round-off flips signs.
    let last = 0;
    for (let i = 0; i < N; i++) { if (Math.abs(psi[i]) < 1e-6 * mx) continue; const sg = Math.sign(psi[i]); if (last && sg !== last) nodes++; last = sg; }
    return { E, psi, mean: m, spread: Math.sqrt(Math.max(0, m2 - m * m)), nodes };
  });
  return { x, V: Vx, h, states };
}

/** Energies only (for the grid-error estimate). */
export function energies(V: (x: number) => number, x0: number, x1: number, N: number, k: number, c: number): number[] {
  const h = (x1 - x0) / (N + 1), d = new Float64Array(N);
  for (let i = 0; i < N; i++) d[i] = V(x0 + (i + 1) * h) + (2 * c) / (h * h);
  return tridiagLowest(d, new Float64Array(N - 1).fill(-c / (h * h)), k).values;
}

// ---------- Analytic levels ----------

/** Infinite square well of width L: E_n = c π² n² / L², n = 1, 2, ... */
export const boxLevels = (L: number, c: number, k: number) => Array.from({ length: k }, (_, i) => (c * Math.PI * Math.PI * (i + 1) ** 2) / (L * L));
/** Harmonic oscillator: E_n = ħω (n + ½). */
export const harmonicLevels = (hw: number, k: number) => Array.from({ length: k }, (_, i) => hw * (i + 0.5));
/** Harmonic potential with level spacing ħω: V = (ħω)² x² / (4c). */
export const harmonicV = (hw: number, c: number) => (x: number) => ((hw * hw) / (4 * c)) * x * x;

/** Bound levels of a finite square well (depth V0, width w, V = −V0 inside |x − x_c| < w/2, 0 outside), ascending. */
export function finiteWellLevels(V0: number, w: number, c: number): number[] {
  const a = w / 2, z0 = a * Math.sqrt(V0 / c), out: number[] = [];
  const root = (f: (z: number) => number, lo: number, hi: number) => {
    let flo = f(lo);
    for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi), fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; }
    return 0.5 * (lo + hi);
  };
  const ev = (z: number) => z * Math.tan(z) - Math.sqrt(Math.max(0, z0 * z0 - z * z));
  const od = (z: number) => -z / Math.tan(z) - Math.sqrt(Math.max(0, z0 * z0 - z * z));
  for (let m = 0; ; m++) {
    // even: z in (mπ, mπ + π/2); odd: z in (mπ + π/2, (m+1)π)
    const lo = m * Math.PI, mid = lo + Math.PI / 2;
    if (lo >= z0) break;
    out.push(root(ev, lo + 1e-12, Math.min(mid - 1e-12, z0)));
    if (mid >= z0) break;
    out.push(root(od, mid + 1e-12, Math.min(lo + Math.PI - 1e-12, z0)));
  }
  return out.map((z) => -V0 + (c * z * z) / (a * a));
}

/** Morse potential D (1 − e^{−a(x−x0)})²: E_n = ħω₀(n+½) − (ħω₀(n+½))²/4D with ħω₀ = 2a√(cD), for n below the dissociation limit. */
export function morseLevels(D: number, a: number, c: number): number[] {
  const hw = 2 * a * Math.sqrt(c * D), out: number[] = [];
  for (let n = 0; ; n++) { const t = hw * (n + 0.5); if (t > 2 * D) break; const E = t - (t * t) / (4 * D); if (out.length && E <= out[out.length - 1]) break; out.push(E); }
  return out;
}

/** Pöschl–Teller well −V0 / cosh²(x/a): E_n = −(c/a²)(λ − 1 − n)², λ(λ − 1) = V0 a²/c, for n < λ − 1. */
export function poschlTellerLevels(V0: number, a: number, c: number): number[] {
  const lam = 0.5 + Math.sqrt(0.25 + (V0 * a * a) / c), out: number[] = [];
  for (let n = 0; n < lam - 1; n++) out.push(-(c / (a * a)) * (lam - 1 - n) ** 2);
  return out;
}

/** Magnitudes of the zeros of the Airy function Ai, by Newton's method on a power series / asymptotic Ai. */
export function airyZeros(k: number): number[] {
  const out: number[] = [];
  for (let n = 1; n <= k; n++) {
    const t = (3 * Math.PI / 8) * (4 * n - 1);
    // Asymptotic start (Abramowitz and Stegun 10.4.105), then Newton on Ai computed by series/integration.
    let z = Math.pow(t, 2 / 3) * (1 + (5 / 48) * t ** -2 - (5 / 36) * t ** -4 + (77125 / 82944) * t ** -6);
    for (let it = 0; it < 30; it++) { const [ai, aip] = airyAi(-z); const dz = ai / -aip; z -= dz; if (Math.abs(dz) < 1e-14 * z) break; }
    out.push(z);
  }
  return out;
}
/** Ai(x) and Ai'(x) for −30 < x ≤ 0 from the Maclaurin series (converges everywhere; fine at this range in double precision with care). */
export function airyAi(x: number): [number, number] {
  // Ai(x) = c1 f(x) − c2 g(x), f = Σ 3^k (1/3)_k x^{3k}/(3k)!, g = Σ 3^k (2/3)_k x^{3k+1}/(3k+1)!
  const c1 = 0.355028053887817239, c2 = 0.258819403792806798;
  // Integrate y'' = x y with RK4 from 0 (known initial values) for accuracy at large |x|.
  let y = c1, yp = -c2, s = 0;
  const steps = Math.max(200, Math.ceil(Math.abs(x) * 400)), h = x / steps;
  const f = (t: number, a: number, b: number): [number, number] => [b, t * a];
  for (let i = 0; i < steps; i++) {
    const k1 = f(s, y, yp), k2 = f(s + h / 2, y + (h / 2) * k1[0], yp + (h / 2) * k1[1]), k3 = f(s + h / 2, y + (h / 2) * k2[0], yp + (h / 2) * k2[1]), k4 = f(s + h, y + h * k3[0], yp + h * k3[1]);
    y += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); yp += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); s += h;
  }
  return [y, yp];
}
/** Linear (triangular) well V = F x for x > 0 with a wall at 0: E_n = (c F²)^{1/3} |a_n|. */
export const linearLevels = (F: number, c: number, k: number) => airyZeros(k).map((z) => Math.cbrt(c * F * F) * z);

// ---------- Potentials ----------

export type PresetId = 'harmonic' | 'box' | 'finite' | 'double' | 'morse' | 'linear' | 'poschl' | 'formula' | 'draw';
export type Params = { p1: number; p2: number; p3: number };
export type Preset = { id: PresetId; name: string; p: [string, string, string]; def: { natural: [number, number, number, number, number]; electron: [number, number, number, number, number] }; help: string };
/** def: p1, p2, p3, x0, x1. */
export const PRESETS: Preset[] = [
  { id: 'harmonic', name: 'Harmonic oscillator', p: ['ħω (level spacing)', 'Centre x₀', ''], def: { natural: [1, 0, 0, -8, 8], electron: [0.1, 0, 0, -6, 6] }, help: 'V = ½mω²(x − x₀)². Exact levels ħω(n + ½).' },
  { id: 'box', name: 'Infinite square well (box)', p: ['', '', ''], def: { natural: [0, 0, 0, 0, 1], electron: [0, 0, 0, 0, 1] }, help: 'V = 0 between the walls at the window edges. Exact levels n²π²ħ²/2mL².' },
  { id: 'finite', name: 'Finite square well', p: ['Depth V₀', 'Width w', 'Centre'], def: { natural: [10, 2, 0, -6, 6], electron: [0.5, 1, 0, -4, 4] }, help: 'V = −V₀ inside the well, 0 outside. Exact levels from the even and odd matching conditions.' },
  { id: 'double', name: 'Double well', p: ['Barrier height V₀', 'Half-separation a', ''], def: { natural: [5, 1.5, 0, -5, 5], electron: [0.3, 0.5, 0, -2, 2] }, help: 'V = V₀ (x²/a² − 1)²: two minima at ±a. Low levels come in close pairs (tunnelling splitting).' },
  { id: 'morse', name: 'Morse (molecule bond)', p: ['Well depth D', 'Range a', 'Minimum x₀'], def: { natural: [10, 0.5, 0, -4, 20], electron: [1, 10, 0.2, 0.05, 1.5] }, help: 'V = D(1 − e^{−a(x−x₀)})². Exact levels ħω₀(n + ½) − [ħω₀(n + ½)]²/4D.' },
  { id: 'linear', name: 'Linear (bouncing ball)', p: ['Slope F (force)', '', ''], def: { natural: [1, 0, 0, 0, 15], electron: [1, 0, 0, 0, 8] }, help: 'V = F x for x > 0 with a wall at 0. Exact levels (ħ²F²/2m)^⅓ |aₙ| from the zeros of the Airy function.' },
  { id: 'poschl', name: 'Pöschl–Teller well', p: ['Depth V₀', 'Width a', ''], def: { natural: [10, 1, 0, -10, 10], electron: [1, 0.5, 0, -5, 5] }, help: 'V = −V₀ / cosh²(x/a). Exact levels −(ħ²/2ma²)(λ − 1 − n)².' },
  { id: 'formula', name: 'Your formula V(x)', p: ['', '', ''], def: { natural: [0, 0, 0, -6, 6], electron: [0, 0, 0, -3, 3] }, help: 'Type V as a formula of x, for example 0.5*x^2 + 0.1*x^4 or -5*exp(-x^2).' },
  { id: 'draw', name: 'Draw it', p: ['Top of the drawing (energy)', '', ''], def: { natural: [20, 0, 0, -5, 5], electron: [1, 0, 0, -2, 2] }, help: 'Drag on the picture to draw V(x). The drawing is joined by straight lines.' },
];

/** The potential function and its analytic levels (when known) for a preset. */
export function potential(id: PresetId, P: Params, c: number, x0: number, x1: number, formula = '', drawn: number[] = [], k = 40): { V: (x: number) => number; exact: number[] | null; exactNote: string } {
  const { p1, p2, p3 } = P;
  switch (id) {
    case 'harmonic': { const f = harmonicV(p1, c); return { V: (x) => f(x - p2), exact: harmonicLevels(p1, 60), exactNote: 'ħω(n + ½)' }; }
    case 'box': return { V: () => 0, exact: boxLevels(x1 - x0, c, 60), exactNote: 'n²π²ħ²/2mL²' };
    case 'finite': return { V: (x) => (Math.abs(x - p3) < p2 / 2 ? -p1 : 0), exact: finiteWellLevels(p1, p2, c), exactNote: 'bound levels of the finite well' };
    case 'double': return { V: (x) => p1 * (x * x / (p2 * p2) - 1) ** 2, exact: null, exactNote: '' };
    case 'morse': return { V: (x) => p1 * (1 - Math.exp(-p2 * (x - p3))) ** 2, exact: morseLevels(p1, p2, c), exactNote: 'Morse formula' };
    case 'linear': return { V: (x) => p1 * (x - x0), exact: linearLevels(p1, c, k), exactNote: 'Airy zeros' };
    case 'poschl': return { V: (x) => -p1 / Math.cosh(x / p2) ** 2, exact: poschlTellerLevels(p1, p2, c), exactNote: 'Pöschl–Teller formula' };
    case 'formula': {
      const tree = parse(formula), vars = variables(tree).filter((v) => v !== 'x' && v !== 'pi' && v !== 'π');
      if (vars.length) throw new Error(`The formula may only use x (found ${vars.join(', ')}).`);
      const f = compile(tree, ['x']), a = [0];
      return { V: (x) => { a[0] = x; return f(a); }, exact: null, exactNote: '' };
    }
    case 'draw': return { V: drawnV(drawn, x0, x1), exact: null, exactNote: '' };
  }
}

/** Piecewise-linear potential through equally spaced values from x0 to x1. */
export function drawnV(v: number[], x0: number, x1: number) {
  const n = v.length - 1;
  return (x: number) => { const t = Math.min(n, Math.max(0, ((x - x0) / (x1 - x0)) * n)), i = Math.min(n - 1, Math.floor(t)); return v[i] + (v[i + 1] - v[i]) * (t - i); };
}

/** Probability of finding the particle where E < V (classically forbidden). */
export function forbidden(sol: Solution, j: number): number {
  const s = sol.states[j]; let p = 0;
  for (let i = 0; i < sol.x.length; i++) if (sol.V[i] > s.E) p += s.psi[i] * s.psi[i] * sol.h;
  return p;
}
