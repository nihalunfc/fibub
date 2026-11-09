// A single spin-½ (qubit) on the Bloch sphere: states, gates as rotations, and Rabi oscillations from the
// Bloch equations with optional T1 and T2 relaxation (rotating frame, ħ = 1, |0⟩ at the north pole).
import { type C, cmul, cadd, cconj, cabs } from './phq.ts';
import { parse, compile, variables } from './expr.ts';

export type Spinor = [C, C];
export type Vec = [number, number, number];

export const blochOf = (s: Spinor): Vec => {
  const ab = cmul(cconj(s[0]), s[1]);
  return [2 * ab[0], 2 * ab[1], cabs(s[0]) ** 2 - cabs(s[1]) ** 2];
};
/** The state with Bloch angles θ (from +z) and φ (from +x), in radians: cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩. */
export const fromAngles = (th: number, ph: number): Spinor => [[Math.cos(th / 2), 0], [Math.sin(th / 2) * Math.cos(ph), Math.sin(th / 2) * Math.sin(ph)]];
export const anglesOf = (v: Vec) => ({ th: Math.acos(Math.max(-1, Math.min(1, v[2] / (Math.hypot(...v) || 1)))), ph: Math.atan2(v[1], v[0]) });

export const STARTS: Record<string, [number, number, string]> = {
  '0': [0, 0, '|0⟩'], '1': [Math.PI, 0, '|1⟩'], '+': [Math.PI / 2, 0, '|+⟩'], '-': [Math.PI / 2, Math.PI, '|−⟩'], '+i': [Math.PI / 2, Math.PI / 2, '|+i⟩'], '-i': [Math.PI / 2, -Math.PI / 2, '|−i⟩'],
};

/** Rotation by angle about unit axis n: U = cos(θ/2) I − i sin(θ/2) n·σ. */
export function rotation(n: Vec, th: number): [C, C][] {
  const c = Math.cos(th / 2), s = Math.sin(th / 2), [x, y, z] = n;
  return [[[c, -s * z], [-s * y, -s * x]], [[s * y, -s * x], [c, s * z]]];
}
export const apply = (U: [C, C][], s: Spinor): Spinor => [cadd(cmul(U[0][0], s[0]), cmul(U[0][1], s[1])), cadd(cmul(U[1][0], s[0]), cmul(U[1][1], s[1]))];

export type Gate = { label: string; axis: Vec; angle: number };
const R2 = Math.SQRT1_2;
/** Gates as rotations (equal to the usual matrices up to a global phase, which the Bloch sphere cannot show). */
export const NAMED: Record<string, Gate> = {
  H: { label: 'H', axis: [R2, 0, R2], angle: Math.PI },
  X: { label: 'X', axis: [1, 0, 0], angle: Math.PI },
  Y: { label: 'Y', axis: [0, 1, 0], angle: Math.PI },
  Z: { label: 'Z', axis: [0, 0, 1], angle: Math.PI },
  S: { label: 'S', axis: [0, 0, 1], angle: Math.PI / 2 },
  SDG: { label: 'S†', axis: [0, 0, 1], angle: -Math.PI / 2 },
  T: { label: 'T', axis: [0, 0, 1], angle: Math.PI / 4 },
  TDG: { label: 'T†', axis: [0, 0, 1], angle: -Math.PI / 4 },
  SX: { label: '√X', axis: [1, 0, 0], angle: Math.PI / 2 },
};

/** Read an angle: degrees, or radians when it uses pi (e.g. "pi/2"). */
function angle(src: string): number {
  const tree = parse(src), vars = variables(tree);
  const bad = vars.filter((v) => v !== 'pi' && v !== 'π');
  if (bad.length) throw new Error(`"${src}" is not an angle`);
  const v = compile(tree, [])([]);
  if (!Number.isFinite(v)) throw new Error(`"${src}" is not an angle`);
  return /pi|π/.test(src) ? v : (v * Math.PI) / 180;
}

/** Parse a gate list such as "H; Rx(90); T; Ry(pi/4); R(60, 1, 1, 0)". */
export function parseGates(text: string): Gate[] {
  const out: Gate[] = [];
  const toks = text.replace(/†/g, 'dg').match(/[A-Za-z√]+\s*(\([^)]*\))?/g) ?? [];
  const rest = text.replace(/†/g, 'dg').replace(/[A-Za-z√]+\s*(\([^)]*\))?/g, '').replace(/[\s;,]+/g, '');
  if (rest) throw new Error(`Could not read "${rest.slice(0, 12)}". Separate gates with ; or new lines.`);
  for (const t of toks) {
    const m = /^([A-Za-z√]+)\s*(?:\((.*)\))?$/.exec(t.trim())!;
    const name = m[1].toUpperCase().replace('√X', 'SX'), args = m[2] !== undefined ? m[2].split(',').map((a) => a.trim()) : [];
    if (NAMED[name] && !args.length) { out.push(NAMED[name]); continue; }
    if (['RX', 'RY', 'RZ'].includes(name) && args.length === 1) {
      const a = angle(args[0]), axis: Vec = name === 'RX' ? [1, 0, 0] : name === 'RY' ? [0, 1, 0] : [0, 0, 1];
      out.push({ label: `${name[0]}${name[1].toLowerCase()}(${args[0]})`, axis, angle: a }); continue;
    }
    if (name === 'R' && args.length === 4) {
      const v = args.slice(1).map(Number), L = Math.hypot(...v);
      if (!(L > 0)) throw new Error('R(angle, x, y, z) needs an axis that is not zero.');
      out.push({ label: `R(${args.join(', ')})`, axis: v.map((x) => x / L) as Vec, angle: angle(args[0]) }); continue;
    }
    throw new Error(`"${t.trim()}" is not a gate this tool knows (H, X, Y, Z, S, S†, T, T†, √X, Rx(θ), Ry(θ), Rz(θ), R(θ, x, y, z)).`);
  }
  return out;
}

/** Run gates from a start state: each step's state and the path of the Bloch vector (pts per gate). */
export function runGates(start: Spinor, gates: Gate[], pts = 30): { states: Spinor[]; path: Vec[][] } {
  const states: Spinor[] = [start], path: Vec[][] = [];
  let s = start;
  for (const g of gates) {
    const seg: Vec[] = [];
    for (let k = 0; k <= pts; k++) seg.push(blochOf(apply(rotation(g.axis, (g.angle * k) / pts), s)));
    s = apply(rotation(g.axis, g.angle), s); states.push(s); path.push(seg);
  }
  return { states, path };
}

/** Rotate a Bloch vector directly (Rodrigues), for checking. */
export function rotateVec(v: Vec, n: Vec, th: number): Vec {
  const c = Math.cos(th), s = Math.sin(th), d = n[0] * v[0] + n[1] * v[1] + n[2] * v[2];
  const cr: Vec = [n[1] * v[2] - n[2] * v[1], n[2] * v[0] - n[0] * v[2], n[0] * v[1] - n[1] * v[0]];
  return [0, 1, 2].map((i) => v[i] * c + cr[i] * s + n[i] * d * (1 - c)) as Vec;
}

// ---------- Rabi oscillations ----------

/** Excited-state (|1⟩) probability with no relaxation, starting in |0⟩: (Ω²/Ω_R²) sin²(Ω_R t/2). Ω, Δ angular. */
export const rabiP1 = (W: number, D: number, t: number) => { const WR = Math.hypot(W, D); return WR ? ((W * W) / (WR * WR)) * Math.sin((WR * t) / 2) ** 2 : 0; };

/**
 * Bloch equations in the rotating frame for H = (Δ/2)σz + (Ω/2)σx: dr/dt = (Ω, 0, Δ) × r, plus relaxation of z
 * towards +1 (|0⟩) with T1 and of x, y towards 0 with T2. RK4 with `steps` steps. T1, T2 = Infinity for none.
 */
export function blochRun(W: number, D: number, tEnd: number, T1: number, T2: number, r0: Vec = [0, 0, 1], steps = 4000): { t: number[]; r: Vec[] } {
  const g1 = Number.isFinite(T1) ? 1 / T1 : 0, g2 = Number.isFinite(T2) ? 1 / T2 : 0;
  const f = (r: Vec): Vec => [-D * r[1] - g2 * r[0], D * r[0] - W * r[2] - g2 * r[1], W * r[1] + g1 * (1 - r[2])];
  const h = tEnd / steps, ts = [0], rs: Vec[] = [r0];
  let r = r0;
  for (let i = 1; i <= steps; i++) {
    const k1 = f(r), k2 = f(r.map((x, j) => x + (h / 2) * k1[j]) as Vec), k3 = f(r.map((x, j) => x + (h / 2) * k2[j]) as Vec), k4 = f(r.map((x, j) => x + h * k3[j]) as Vec);
    r = r.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) as Vec;
    ts.push(i * h); rs.push(r);
  }
  return { t: ts, r: rs };
}

/** Steady state of the driven, damped Bloch equations (Torrey): the |1⟩ population. */
export function steadyP1(W: number, D: number, T1: number, T2: number): number {
  const z = (1 + D * D * T2 * T2) / (1 + D * D * T2 * T2 + W * W * T1 * T2);
  return (1 - z) / 2;
}
