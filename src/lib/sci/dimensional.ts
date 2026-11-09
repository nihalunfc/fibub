// Dimensional analysis (Buckingham Π theorem): dimensions typed as text, the dimension matrix, its rank, an
// integer null-space basis, and the Π groups formed with chosen repeating variables. Exact rational arithmetic.
// Plain TypeScript, no DOM.

export const BASE = ['M', 'L', 'T', 'Θ', 'I', 'N', 'J'] as const;
export const BASE_NAMES = ['mass', 'length', 'time', 'temperature', 'electric current', 'amount of substance', 'luminous intensity'];
export const SI = ['kg', 'm', 's', 'K', 'A', 'mol', 'cd'];

// ---------- Rationals ----------
export type Q = [number, number]; // numerator, denominator > 0
const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const qq = (n: number, d = 1): Q => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const qadd = (a: Q, b: Q) => qq(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const qsub = (a: Q, b: Q) => qq(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const qmul = (a: Q, b: Q) => qq(a[0] * b[0], a[1] * b[1]);
const qdiv = (a: Q, b: Q) => qq(a[0] * b[1], a[1] * b[0]);
const isZero = (a: Q) => a[0] === 0;
export const qstr = (a: Q) => (a[1] === 1 ? String(a[0]) : `${a[0]}/${a[1]}`).replace('-', '−');

/** Read a dimension such as "M L^-1 T^-2", "L/T^2", "M·L²·T⁻²", "Θ" (or K), or "1" for none. Exponents may be fractions. */
export function parseDim(src: string): Q[] {
  const out: Q[] = BASE.map(() => qq(0));
  const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁄': '/' };
  let s = src.trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁄]+/g, (m) => '^' + [...m].map((c) => SUP[c]).join('')).replace(/[−–]/g, '-').replace(/[·*×.]/g, ' ');
  if (!s || /^(1|-|none|dimensionless)$/i.test(s)) return out;
  // Split on "/" (not inside an exponent): everything after it is divided.
  const parts: string[] = []; let depth = 0, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') depth++; if (c === ')') depth--;
    if (c === '/' && depth === 0 && !(/\^\s*[-+]?\d+\s*$/.test(cur) && /^\s*\d/.test(s.slice(i + 1)))) { parts.push(cur); cur = ''; continue; }
    cur += c;
  }
  parts.push(cur);
  parts.forEach((p, k) => {
    const sign = k === 0 ? 1 : -1;
    const re = /(Θ|θ|Th|K|M|L|T|I|N|J)\s*(?:\^\s*\(?\s*([-+]?\d+(?:\s*\/\s*\d+)?)\s*\)?|([-+]?\d+(?:\/\d+)?))?/gy;
    let rest = p.trim();
    while (rest.length) {
      rest = rest.replace(/^\s+/, ''); if (!rest) break;
      if (rest === '1') break;
      re.lastIndex = 0;
      const m = re.exec(rest);
      if (!m) throw new Error(`"${rest.split(/\s/)[0]}" is not a base dimension. Use M (mass), L (length), T (time), Θ or K (temperature), I (current), N (amount) and J (luminous intensity), like M L^-1 T^-2.`);
      const sym = m[1] === 'θ' || m[1] === 'Th' || m[1] === 'K' ? 'Θ' : m[1];
      const ex = (m[2] ?? m[3] ?? '1').replace(/\s/g, '');
      const [a, b] = ex.split('/');
      if (b !== undefined && Number(b) === 0) throw new Error('An exponent divides by zero.');
      const e = qq(sign * Number(a), b !== undefined ? Number(b) : 1);
      const i = BASE.indexOf(sym as (typeof BASE)[number]);
      out[i] = qadd(out[i], e);
      rest = rest.slice(m[0].length);
    }
  });
  return out;
}

export function dimString(d: Q[], si = false): string {
  const parts = d.map((e, i) => (isZero(e) ? '' : `${si ? SI[i] : BASE[i]}${e[0] === 1 && e[1] === 1 ? '' : '^' + (e[1] === 1 ? String(e[0]) : `(${e[0]}/${e[1]})`)}`)).filter(Boolean);
  return parts.length ? parts.join(' ').replace(/-/g, '−') : '1 (dimensionless)';
}

export type Variable = { name: string; dim: Q[]; note: string };
/** Lines "name, dimensions, note" (the note is optional). */
export function parseVariables(text: string): Variable[] {
  const out: Variable[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim(); if (!line) return;
    const [name, dim, ...note] = line.split(/\s*[,;\t]\s*/);
    if (!name || dim === undefined) throw new Error(`Line ${i + 1}: write the name, a comma, then the dimensions, like "V, L T^-1".`);
    if (out.some((v) => v.name === name)) throw new Error(`Line ${i + 1}: ${name} is given twice.`);
    let d; try { d = parseDim(dim); } catch (e) { throw new Error(`Line ${i + 1} (${name}): ${(e as Error).message}`); }
    out.push({ name, dim: d, note: note.join(', ') });
  });
  if (out.length < 2) throw new Error('Give at least two variables.');
  if (out.length > 20) throw new Error('This tool takes up to 20 variables.');
  return out;
}

/** Reduced row echelon form of a rational matrix (rows × cols). Returns the matrix and its pivot columns. */
export function rref(A: Q[][]): { R: Q[][]; pivots: number[] } {
  const R = A.map((r) => r.slice()), rows = R.length, cols = rows ? R[0].length : 0, pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r; while (p < rows && isZero(R[p][c])) p++;
    if (p === rows) continue;
    [R[r], R[p]] = [R[p], R[r]];
    const piv = R[r][c]; R[r] = R[r].map((v) => qdiv(v, piv));
    for (let i = 0; i < rows; i++) if (i !== r && !isZero(R[i][c])) { const f = R[i][c]; R[i] = R[i].map((v, j) => qsub(v, qmul(f, R[r][j]))); }
    pivots.push(c); r++;
  }
  return { R, pivots };
}

/** Dimension matrix: one row per base dimension that appears, one column per variable. */
export function dimMatrix(vars: Variable[]): { rows: number[]; D: Q[][] } {
  const rows = BASE.map((_, i) => i).filter((i) => vars.some((v) => !isZero(v.dim[i])));
  return { rows, D: rows.map((i) => vars.map((v) => v.dim[i])) };
}

const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
/** Scale a rational vector to the smallest whole numbers, with the first non-zero entry positive (or as given). */
export function toIntegers(v: Q[], firstPositive = true): number[] {
  const L = v.reduce((m, x) => lcm(m, x[1]), 1);
  let w = v.map((x) => (x[0] * L) / x[1]);
  const g = w.reduce((m, x) => gcd(m, x), 0) || 1;
  w = w.map((x) => x / g);
  const f = w.find((x) => x !== 0);
  if (firstPositive && f !== undefined && f < 0) w = w.map((x) => -x);
  return w.map((x) => x + 0);
}

/** Integer basis of the null space of D (exponent vectors of all independent dimensionless products). */
export function nullSpace(D: Q[][], n: number): number[][] {
  if (!D.length) return Array.from({ length: n }, (_, j) => Array.from({ length: n }, (_, k) => (k === j ? 1 : 0)));
  const { R, pivots } = rref(D), free = Array.from({ length: n }, (_, j) => j).filter((j) => !pivots.includes(j));
  return free.map((f) => {
    const v: Q[] = Array.from({ length: n }, () => qq(0));
    v[f] = qq(1);
    pivots.forEach((p, r) => { v[p] = qq(-R[r][f][0], R[r][f][1]); });
    return toIntegers(v);
  });
}

export type PiGroup = { exps: number[]; main: number; text: string };
/**
 * Π groups with the chosen repeating variables: each other variable q forms Π = q^k · Π(repeating^a), with whole
 * exponents and k > 0. The repeating variables must be independent and as many as the rank.
 */
export function piGroups(vars: Variable[], repeating: number[]): { rank: number; groups: PiGroup[] } {
  const { D } = dimMatrix(vars), n = vars.length;
  const rank = D.length ? rref(D).pivots.length : 0;
  if (repeating.length !== rank) throw new Error(`Choose ${rank} repeating variable${rank === 1 ? '' : 's'} (the rank of the dimension matrix); ${repeating.length} ${repeating.length === 1 ? 'is' : 'are'} chosen.`);
  if (rank && rref(D.map((r) => repeating.map((j) => r[j]))).pivots.length < rank) throw new Error(`The repeating variables ${repeating.map((j) => vars[j].name).join(', ')} are not independent: one of them can be made from the others. Choose another set.`);
  const groups: PiGroup[] = [];
  for (let j = 0; j < n; j++) {
    if (repeating.includes(j)) continue;
    // Solve D_R a = −d_j for the repeating exponents a.
    let a: Q[] = [];
    if (rank) {
      const aug = D.map((r) => [...repeating.map((k) => r[k]), qq(-r[j][0], r[j][1])]);
      const { R, pivots } = rref(aug);
      a = repeating.map(() => qq(0));
      pivots.forEach((p, r) => { if (p < rank) a[p] = R[r][rank]; });
    }
    const v: Q[] = Array.from({ length: n }, () => qq(0));
    v[j] = qq(1); repeating.forEach((k, i) => { v[k] = a[i]; });
    // Whole numbers, keeping the main variable's power positive.
    const ints = toIntegers(v, false), s = ints[j] < 0 ? -1 : 1;
    const exps = ints.map((x) => s * x + 0);
    groups.push({ exps, main: j, text: groupText(vars.map((x) => x.name), exps) });
  }
  return { rank, groups };
}

/** "ΔP D / (ρ V^2)" from names and exponents. */
export function groupText(names: string[], exps: number[]): string {
  const term = (i: number, e: number) => (e === 1 ? names[i] : `${names[i]}^${e}`);
  const up = exps.map((e, i) => (e > 0 ? term(i, e) : '')).filter(Boolean), down = exps.map((e, i) => (e < 0 ? term(i, -e) : '')).filter(Boolean);
  const top = up.length ? up.join(' ') : '1';
  if (!down.length) return top;
  return `${top} / ${down.length > 1 ? `(${down.join(' ')})` : down[0]}`;
}

/** Dimensions of a product with these exponents (should be all zero for a Π group). */
export function productDim(vars: Variable[], exps: number[]): Q[] {
  return BASE.map((_, i) => vars.reduce((s, v, j) => qadd(s, qmul(v.dim[i], qq(exps[j]))), qq(0)));
}

/** Default repeating variables: skip the first (the quantity of interest), then take each variable that adds rank. */
export function autoRepeating(vars: Variable[]): number[] {
  const { D } = dimMatrix(vars); if (!D.length) return [];
  const rank = rref(D).pivots.length, chosen: number[] = [];
  const order = [...vars.keys()].slice(1).concat(0);
  for (const j of order) {
    if (chosen.length === rank) break;
    if (vars[j].dim.every(isZero)) continue;
    const trial = [...chosen, j];
    if (rref(D.map((r) => trial.map((k) => r[k]))).pivots.length === trial.length) chosen.push(j);
  }
  return chosen.sort((a, b) => a - b);
}

export const QUANTITIES: [string, string][] = [
  ['Length, diameter, height', 'L'], ['Area', 'L^2'], ['Volume', 'L^3'], ['Time', 'T'], ['Mass', 'M'],
  ['Velocity', 'L T^-1'], ['Acceleration, gravity g', 'L T^-2'], ['Frequency, angular speed', 'T^-1'], ['Angle, strain, ratio', '1'],
  ['Force', 'M L T^-2'], ['Pressure, stress', 'M L^-1 T^-2'], ['Energy, work, heat', 'M L^2 T^-2'], ['Power', 'M L^2 T^-3'], ['Torque', 'M L^2 T^-2'],
  ['Density', 'M L^-3'], ['Dynamic viscosity', 'M L^-1 T^-1'], ['Kinematic viscosity, diffusivity', 'L^2 T^-1'], ['Surface tension', 'M T^-2'],
  ['Volume flow rate', 'L^3 T^-1'], ['Mass flow rate', 'M T^-1'], ['Momentum', 'M L T^-1'], ['Elastic modulus', 'M L^-1 T^-2'],
  ['Temperature', 'Θ'], ['Thermal conductivity', 'M L T^-3 Θ^-1'], ['Specific heat capacity', 'L^2 T^-2 Θ^-1'], ['Heat transfer coefficient', 'M T^-3 Θ^-1'], ['Heat flux', 'M T^-3'],
  ['Electric current', 'I'], ['Electric charge', 'I T'], ['Voltage', 'M L^2 T^-3 I^-1'], ['Resistance', 'M L^2 T^-3 I^-2'], ['Capacitance', 'M^-1 L^-2 T^4 I^2'], ['Inductance', 'M L^2 T^-2 I^-2'], ['Magnetic flux density', 'M T^-2 I^-1'],
  ['Amount of substance', 'N'], ['Concentration (molar)', 'N L^-3'], ['Luminous intensity', 'J'],
];

export const PRESETS: { name: string; vars: string; out: string }[] = [
  { name: 'Pressure drop in a pipe', out: 'ΔP', vars: 'ΔP, M L^-1 T^-2, pressure drop\nD, L, pipe diameter\nl, L, pipe length\nV, L T^-1, mean velocity\nρ, M L^-3, fluid density\nμ, M L^-1 T^-1, dynamic viscosity\nε, L, wall roughness' },
  { name: 'Drag on a sphere', out: 'F', vars: 'F, M L T^-2, drag force\nρ, M L^-3, fluid density\nV, L T^-1, speed\nD, L, diameter\nμ, M L^-1 T^-1, dynamic viscosity' },
  { name: 'Simple pendulum', out: 'P', vars: 'P, T, period\nl, L, length\nm, M, mass of the bob\ng, L T^-2, gravity\nθ0, 1, starting angle' },
  { name: 'Heat transfer from a pipe (convection)', out: 'h', vars: 'h, M T^-3 Θ^-1, heat transfer coefficient\nk, M L T^-3 Θ^-1, fluid thermal conductivity\nD, L, diameter\nV, L T^-1, velocity\nρ, M L^-3, density\nμ, M L^-1 T^-1, viscosity\ncp, L^2 T^-2 Θ^-1, specific heat' },
  { name: 'Ship or open-channel wave drag', out: 'F', vars: 'F, M L T^-2, resistance\nρ, M L^-3, density\nV, L T^-1, speed\nL, L, length\ng, L T^-2, gravity\nμ, M L^-1 T^-1, viscosity' },
  { name: 'Blast wave radius (Taylor)', out: 'R', vars: 'R, L, radius of the fireball\nt, T, time\nE, M L^2 T^-2, energy released\nρ, M L^-3, air density' },
  { name: 'Pump power', out: 'P', vars: 'P, M L^2 T^-3, power\nρ, M L^-3, density\nn, T^-1, rotation speed\nD, L, impeller diameter\nQ, L^3 T^-1, flow rate' },
];
