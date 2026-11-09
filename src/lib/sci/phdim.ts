// Dimensional analysis: reads units such as "kg m/s^2" or "J/(mol K)" into SI base dimensions, and checks that an
// equation typed as a formula balances (both sides, every added term, and the arguments of exp, sin, ln...).
// Plain TypeScript, no DOM.
import { parse, type Node } from './expr.ts';

export const BASE = ['kg', 'm', 's', 'A', 'K', 'mol', 'cd'] as const; // display order, as in kg m s⁻²
export const DIM_NAMES = ['mass', 'length', 'time', 'electric current', 'temperature', 'amount of substance', 'luminous intensity'];
export type Dim = number[]; // exponents of kg, m, s, A, K, mol, cd

const D = (kg = 0, m = 0, s = 0, A = 0, K = 0, mol = 0, cd = 0): Dim => [kg, m, s, A, K, mol, cd];
export const NONE = D();
/** Units known by name (the dimension only; prefixes and scale factors do not change it). */
export const UNITS: Record<string, { dim: Dim; name: string }> = {
  m: { dim: D(0, 1), name: 'metre' }, g: { dim: D(1), name: 'gram' }, kg: { dim: D(1), name: 'kilogram' }, s: { dim: D(0, 0, 1), name: 'second' },
  A: { dim: D(0, 0, 0, 1), name: 'ampere' }, K: { dim: D(0, 0, 0, 0, 1), name: 'kelvin' }, mol: { dim: D(0, 0, 0, 0, 0, 1), name: 'mole' }, cd: { dim: D(0, 0, 0, 0, 0, 0, 1), name: 'candela' },
  N: { dim: D(1, 1, -2), name: 'newton' }, J: { dim: D(1, 2, -2), name: 'joule' }, W: { dim: D(1, 2, -3), name: 'watt' }, Pa: { dim: D(1, -1, -2), name: 'pascal' },
  Hz: { dim: D(0, 0, -1), name: 'hertz' }, C: { dim: D(0, 0, 1, 1), name: 'coulomb' }, V: { dim: D(1, 2, -3, -1), name: 'volt' }, Ω: { dim: D(1, 2, -3, -2), name: 'ohm' },
  ohm: { dim: D(1, 2, -3, -2), name: 'ohm' }, S: { dim: D(-1, -2, 3, 2), name: 'siemens' }, F: { dim: D(-1, -2, 4, 2), name: 'farad' }, H: { dim: D(1, 2, -2, -2), name: 'henry' },
  T: { dim: D(1, 0, -2, -1), name: 'tesla' }, Wb: { dim: D(1, 2, -2, -1), name: 'weber' }, lm: { dim: D(0, 0, 0, 0, 0, 0, 1), name: 'lumen (cd sr)' }, lx: { dim: D(0, -2, 0, 0, 0, 0, 1), name: 'lux' },
  Bq: { dim: D(0, 0, -1), name: 'becquerel' }, Gy: { dim: D(0, 2, -2), name: 'gray' }, Sv: { dim: D(0, 2, -2), name: 'sievert' }, kat: { dim: D(0, 0, -1, 0, 0, 1), name: 'katal' },
  rad: { dim: NONE, name: 'radian' }, sr: { dim: NONE, name: 'steradian' }, '°': { dim: NONE, name: 'degree (angle)' }, deg: { dim: NONE, name: 'degree (angle)' },
  '°C': { dim: D(0, 0, 0, 0, 1), name: 'degree Celsius (as a difference)' }, degC: { dim: D(0, 0, 0, 0, 1), name: 'degree Celsius (as a difference)' },
  L: { dim: D(0, 3), name: 'litre' }, l: { dim: D(0, 3), name: 'litre' }, min: { dim: D(0, 0, 1), name: 'minute' }, h: { dim: D(0, 0, 1), name: 'hour' }, d: { dim: D(0, 0, 1), name: 'day' },
  eV: { dim: D(1, 2, -2), name: 'electronvolt' }, cal: { dim: D(1, 2, -2), name: 'calorie' }, Wh: { dim: D(1, 2, -2), name: 'watt hour' }, bar: { dim: D(1, -1, -2), name: 'bar' },
  atm: { dim: D(1, -1, -2), name: 'atmosphere' }, mmHg: { dim: D(1, -1, -2), name: 'millimetre of mercury' }, Da: { dim: D(1), name: 'dalton' }, u: { dim: D(1), name: 'atomic mass unit' },
  t: { dim: D(1), name: 'tonne' }, M: { dim: D(0, -3, 0, 0, 0, 1), name: 'molar (mol/L)' }, '%': { dim: NONE, name: 'percent' }, ppm: { dim: NONE, name: 'parts per million' },
};
const PREFIX: Record<string, number> = { Y: 24, Z: 21, E: 18, P: 15, T: 12, G: 9, M: 6, k: 3, h: 2, da: 1, d: -1, c: -2, m: -3, µ: -6, μ: -6, u: -6, n: -9, p: -12, f: -15, a: -18, z: -21, y: -24 };

/** One unit symbol, with an optional SI prefix (km, µs, MPa); the whole symbol is tried first, so "min" is minutes. */
export function unitDim(sym: string): Dim | null {
  if (UNITS[sym]) return UNITS[sym].dim;
  for (const p of ['da', ...Object.keys(PREFIX)]) if (sym.startsWith(p) && sym.length > p.length) { const rest = sym.slice(p.length); if (UNITS[rest] && rest !== 'kg') return UNITS[rest].dim; }
  return null;
}
const SUPR: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '·': ' ', '∙': ' ', '⋅': ' ', '×': ' ' };
export class DimError extends Error {}
export const add = (a: Dim, b: Dim, k = 1): Dim => a.map((v, i) => v + k * b[i]);
export const scale = (a: Dim, k: number): Dim => a.map((v) => v * k);
export const same = (a: Dim, b: Dim) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
export const isNone = (a: Dim) => same(a, NONE);

/** Read a unit expression: "kg m s^-2", "m/s²", "J/(mol K)", "N·m", "1" (dimensionless). */
export function parseUnit(src: string): Dim {
  let t = src.trim().replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUPR[c]).join('')).replace(/[·∙⋅×*]/g, ' ').replace(/−/g, '-');
  if (!t || /^(1|-|none|dimensionless|unitless)$/i.test(t)) return NONE;
  let i = 0;
  const peek = () => t[i], ws = () => { while (t[i] === ' ') i++; };
  const exponent = (): number => {
    ws(); if (peek() !== '^') return 1; i++; ws();
    if (peek() === '(') { const j = t.indexOf(')', i); const r = t.slice(i + 1, j); i = j + 1; const [a, b] = r.split('/').map(Number); const v = b ? a / b : a; if (!Number.isFinite(v)) throw new DimError(`"${r}" is not a power`); return v; }
    const m = /^[-+]?\d+(\.\d+)?(\/\d+)?/.exec(t.slice(i)); if (!m) throw new DimError('A power is missing after ^'); i += m[0].length;
    const [a, b] = m[0].split('/').map(Number); return b ? a / b : a;
  };
  const factor = (): Dim => {
    ws();
    if (peek() === '(') { i++; const d = product(); ws(); if (peek() !== ')') throw new DimError('A bracket is not closed'); i++; return scale(d, exponent()); }
    const m = /^(°C|°|%|[A-Za-zµμΩ]+)/.exec(t.slice(i)) ?? /^1(?![\d.])/.exec(t.slice(i));
    if (!m) throw new DimError(`"${t.slice(i, i + 6)}" is not a unit`);
    i += m[0].length;
    const d = m[0] === '1' ? NONE : unitDim(m[0]);
    if (!d) throw new DimError(`"${m[0]}" is not a unit this page knows`);
    return scale(d, exponent());
  };
  const product = (): Dim => {
    let d = factor();
    for (;;) {
      ws();
      if (i >= t.length || peek() === ')') return d;
      if (peek() === '/') { i++; d = add(d, factor(), -1); continue; }
      d = add(d, factor());
    }
  };
  const d = product();
  if (i < t.length) throw new DimError(`Unexpected "${t.slice(i)}"`);
  return d;
}

/** Dimensions in base units: "kg m s⁻²" (fractions shown as ½, or decimals). */
export function format(d: Dim): string {
  const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '.': '·', '/': 'ᐟ' };
  const pw = (v: number) => { if (Math.abs(v - 1) < 1e-9) return ''; const r = Math.round(v * 2) / 2, s = Math.abs(v - r) < 1e-9 && r % 1 ? `${r < 0 ? '-' : ''}${Math.abs(r * 2)}/2` : String(+v.toFixed(4)); return [...s].map((c) => SUP[c] ?? c).join(''); };
  const parts = d.map((v, k) => (Math.abs(v) < 1e-9 ? '' : `${BASE[k]}${pw(v)}`)).filter(Boolean);
  return parts.length ? parts.join(' ') : 'dimensionless';
}
/** A named SI unit with these dimensions, if there is a common one (N, J, W, Pa...). */
export function named(d: Dim): string {
  for (const s of ['N', 'J', 'W', 'Pa', 'Hz', 'C', 'V', 'Ω', 'F', 'T', 'Wb', 'H', 'S', 'm', 'kg', 's', 'A', 'K', 'mol']) if (same(UNITS[s].dim, d)) return s;
  if (isNone(d)) return 'dimensionless';
  return '';
}

/** Common constants a formula may use without declaring them (a declared name wins). */
export const CONSTS: Record<string, { unit: string; name: string }> = {
  c: { unit: 'm/s', name: 'speed of light' }, g: { unit: 'm/s^2', name: 'gravitational acceleration' }, G: { unit: 'm^3 kg^-1 s^-2', name: 'gravitational constant' },
  h: { unit: 'J s', name: 'Planck constant' }, hbar: { unit: 'J s', name: 'reduced Planck constant' }, ħ: { unit: 'J s', name: 'reduced Planck constant' }, k_B: { unit: 'J/K', name: 'Boltzmann constant' },
  e: { unit: 'C', name: 'elementary charge' }, epsilon_0: { unit: 'F/m', name: 'vacuum permittivity' }, ε_0: { unit: 'F/m', name: 'vacuum permittivity' }, ε0: { unit: 'F/m', name: 'vacuum permittivity' },
  mu_0: { unit: 'N/A^2', name: 'vacuum permeability' }, μ_0: { unit: 'N/A^2', name: 'vacuum permeability' }, μ0: { unit: 'N/A^2', name: 'vacuum permeability' }, N_A: { unit: 'mol^-1', name: 'Avogadro constant' },
  R: { unit: 'J/(mol K)', name: 'molar gas constant' }, sigma: { unit: 'W m^-2 K^-4', name: 'Stefan-Boltzmann constant' }, σ: { unit: 'W m^-2 K^-4', name: 'Stefan-Boltzmann constant' },
};

export type Term = { text: string; dim: Dim };
export type Problem = { where: string; msg: string };
/** Read "name = unit" or "name: unit" lines into dimensions. */
export function declarations(text: string): { dims: Record<string, Dim>; problems: Problem[] } {
  const dims: Record<string, Dim> = {}, problems: Problem[] = [];
  text.split(/\n|;/).forEach((line, k) => {
    const l = line.replace(/#.*/, '').trim(); if (!l) return;
    const m = /^([A-Za-z_Ͱ-Ͽ][\wͰ-Ͽ]*)\s*[:=]\s*(.*?)(?:\s*\[.*\])?$/.exec(l);
    if (!m) { problems.push({ where: `line ${k + 1}`, msg: `write it as name = unit ("${l}")` }); return; }
    try { dims[m[1]] = parseUnit(m[2]); } catch (e) { problems.push({ where: m[1], msg: (e as Error).message }); }
  });
  return { dims, problems };
}

const SAME_ARGS = new Set(['min', 'max', 'hypot']), DIMLESS_FN = new Set(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'exp', 'ln', 'log', 'log10', 'log2']);
/** Numeric value of a node made only of numbers and pi (for powers), else NaN. */
function constValue(n: Node): number {
  if (n.t === 'num') return n.v;
  if (n.t === 'neg') return -constValue(n.a);
  if (n.t === 'bin') { const a = constValue(n.a), b = constValue(n.b); return { '+': a + b, '-': a - b, '*': a * b, '/': a / b, '^': a ** b }[n.op]; }
  return NaN;
}
const text = (n: Node): string => {
  if (n.t === 'num') return String(n.v);
  if (n.t === 'var') return n.name;
  if (n.t === 'neg') return `−${text(n.a)}`;
  if (n.t === 'fn') return `${n.name}(${n.args.map(text).join(', ')})`;
  const wrap = (c: Node) => (c.t === 'bin' && (c.op === '+' || c.op === '-') ? `(${text(c)})` : text(c));
  return n.op === '+' || n.op === '-' ? `${text(n.a)} ${n.op === '-' ? '−' : '+'} ${text(n.b)}` : `${wrap(n.a)}${n.op === '*' ? '·' : n.op}${wrap(n.b)}`;
};

/** Dimensions of a parsed formula, collecting every problem (unknown names, mixed sums, dimensioned arguments). */
export function dimOf(n: Node, dims: Record<string, Dim>, problems: Problem[], undeclared: Set<string>): Dim {
  switch (n.t) {
    case 'num': return NONE;
    case 'var': {
      if (n.name === 'pi' || n.name === 'π') return NONE;
      if (dims[n.name]) return dims[n.name];
      undeclared.add(n.name); return NONE;
    }
    case 'neg': return dimOf(n.a, dims, problems, undeclared);
    case 'bin': {
      const a = dimOf(n.a, dims, problems, undeclared), b = dimOf(n.b, dims, problems, undeclared);
      if (n.op === '+' || n.op === '-') { if (!same(a, b)) problems.push({ where: text(n), msg: `cannot ${n.op === '+' ? 'add' : 'subtract'} ${format(b)} ${n.op === '+' ? 'to' : 'from'} ${format(a)}` }); return a; }
      if (n.op === '*') return add(a, b);
      if (n.op === '/') return add(a, b, -1);
      // power
      if (!isNone(b)) problems.push({ where: text(n), msg: `a power must be dimensionless, not ${format(b)}` });
      const p = constValue(n.b);
      if (Number.isNaN(p)) { if (!isNone(a)) problems.push({ where: text(n), msg: `${format(a)} raised to a power that is not a fixed number has no definite unit` }); return isNone(a) ? NONE : a; }
      return scale(a, p);
    }
    case 'fn': {
      const args = n.args.map((x) => dimOf(x, dims, problems, undeclared));
      if (DIMLESS_FN.has(n.name)) { if (!isNone(args[0])) problems.push({ where: text(n), msg: `the argument of ${n.name} must be dimensionless, not ${format(args[0])}` }); return NONE; }
      if (n.name === 'sqrt') return scale(args[0], 0.5);
      if (n.name === 'cbrt') return scale(args[0], 1 / 3);
      if (n.name === 'abs') return args[0];
      if (n.name === 'atan2') { if (!same(args[0], args[1])) problems.push({ where: text(n), msg: `both arguments of atan2 need the same dimensions` }); return NONE; }
      if (SAME_ARGS.has(n.name)) { if (!same(args[0], args[1])) problems.push({ where: text(n), msg: `both arguments of ${n.name} need the same dimensions` }); return args[0]; }
      if (n.name === 'pow') { const p = constValue(n.args[1]); if (!isNone(args[1])) problems.push({ where: text(n), msg: 'a power must be dimensionless' }); return Number.isNaN(p) ? args[0] : scale(args[0], p); }
      return NONE;
    }
  }
}
/** The terms added at the top of a side, for showing each one's dimensions. */
export function terms(n: Node, out: Node[] = []): Node[] {
  if (n.t === 'bin' && (n.op === '+' || n.op === '-')) { terms(n.a, out); terms(n.b, out); } else out.push(n);
  return out;
}

export type Check = {
  sides: { text: string; dim: Dim; terms: Term[] }[]; balanced: boolean | null; problems: Problem[]; undeclared: string[]; usedConstants: string[];
};
/** Check an equation (left = right, or a chain a = b = c) or a single expression. */
export function check(equation: string, declared: Record<string, Dim>, useConstants = true): Check {
  const src = equation.replace(/==/g, '=');
  const sides = src.split('=');
  if (sides.some((s) => !s.trim())) throw new DimError('Each side of = needs a formula');
  const dims: Record<string, Dim> = {}, usedConstants: string[] = [];
  const problems: Problem[] = [], undeclared = new Set<string>();
  const nodes = sides.map((s) => parse(s));
  const allVars = new Set<string>();
  const walk = (n: Node) => { if (n.t === 'var') allVars.add(n.name); else if (n.t === 'neg') walk(n.a); else if (n.t === 'bin') { walk(n.a); walk(n.b); } else if (n.t === 'fn') n.args.forEach(walk); };
  nodes.forEach(walk);
  for (const v of allVars) {
    if (declared[v]) dims[v] = declared[v];
    else if (useConstants && CONSTS[v]) { dims[v] = parseUnit(CONSTS[v].unit); usedConstants.push(v); }
  }
  const out = nodes.map((n, k) => ({ text: sides[k].trim(), dim: dimOf(n, dims, problems, undeclared), terms: terms(n).map((t) => ({ text: text(t), dim: dimOf(t, dims, [], new Set()) })) }));
  const und = [...undeclared];
  const balanced = und.length ? null : out.length < 2 ? null : out.every((s) => same(s.dim, out[0].dim)) && !problems.length;
  return { sides: out, balanced, problems, undeclared: und, usedConstants };
}
