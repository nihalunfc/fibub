// Chemical formulas: parsing (groups, hydrates, isotope labels, charges), molar and exact masses, composition,
// Hill order, degree of unsaturation, equation balancing and isotope patterns. Pure functions, no DOM.
import { ELEMENT_ROWS } from './elements.ts';

export type Element = { z: number; symbol: string; name: string; weight: number; radioactive: boolean; isotopes: { a: number; mass: number; abundance: number }[] };
export const ELEMENTS: Element[] = ELEMENT_ROWS.map(([symbol, name, weight, radioactive, iso], i) => ({ z: i + 1, symbol, name, weight, radioactive, isotopes: iso.map(([a, mass, abundance]) => ({ a, mass, abundance })) }));
export const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));
export const ELECTRON = 5.48579909065e-4; // u, CODATA 2018
export const PROTON = 1.007276466621; // u
export const AVOGADRO = 6.02214076e23;

/** A parsed formula: counts by key, where a key is an element symbol ("C") or an isotope label ("13C"). */
export type Formula = { counts: Map<string, number>; charge: number };

const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁺': '^+', '⁻': '^-' };

export class FormulaError extends Error {}

/** Element (or isotope) a key stands for, and the isotope's mass number if labelled. */
export function keyInfo(key: string): { el: Element; a?: number } {
  const m = /^(\d+)?([A-Z][a-z]?)$/.exec(key)!;
  return { el: BY_SYMBOL.get(m[2])!, a: m[1] ? Number(m[1]) : undefined };
}

/** Parse a formula such as "CuSO4·5H2O", "Ca3(PO4)2", "[13C]6H12O6", "C2D6O", "NH4+", "SO4^2-" or "[Fe(CN)6]^4-". */
export function parseFormula(input: string): Formula {
  let s = input.trim().replace(/[₀-₉⁰-⁹⁺⁻]/g, (c) => SUB[c]).replace(/\^\^/g, '^').replace(/[−–]/g, '-');
  if (!s) throw new FormulaError('Type a formula, such as H2O or CuSO4·5H2O.');
  // Charge at the end: "^2-", " 2-", "^+", "+", "-", "+2", "-3". A bare "4-" after a symbol or bracket would be ambiguous, so it needs ^ or a space.
  let charge = 0;
  const cm = /(?:\^|\s)(\d*)\s*([+-])$/.exec(s) || /([+-])(\d+)$/.exec(s) || /([+-]+)$/.exec(s);
  if (cm) {
    if (cm[0].startsWith('^') || /^\s/.test(cm[0])) charge = (cm[2] === '-' ? -1 : 1) * (cm[1] ? Number(cm[1]) : 1);
    else if (/^[+-]\d+$/.test(cm[0])) charge = (cm[1] === '-' ? -1 : 1) * Number(cm[2]);
    else charge = (cm[1][0] === '-' ? -1 : 1) * cm[1].length;
    s = s.slice(0, cm.index).trim();
  }
  s = s.replace(/\s+/g, '');
  const counts = new Map<string, number>();
  // A dot joins parts (CuSO4.5H2O), except inside a decimal count that starts with 0 (Fe0.95O).
  const parts = s.split(/(?:[·•∙*]|(?<!(?:^|\D)0)\.)(?=\d*\.?\d*[A-Z([{])/);
  for (const part of parts) {
    const pm = /^(\d+(?:\.\d+)?)?(.*)$/.exec(part)!;
    const mult = pm[1] ? Number(pm[1]) : 1;
    if (!pm[2]) throw new FormulaError(`Nothing after the number ${pm[1]}.`);
    const c = parseGroup(pm[2]);
    for (const [k, v] of c) counts.set(k, (counts.get(k) ?? 0) + v * mult);
  }
  return { counts, charge };
}

function parseGroup(s: string): Map<string, number> {
  let i = 0;
  const num = () => { const m = /^\d+(?:\.\d+)?/.exec(s.slice(i)); if (!m) return 1; i += m[0].length; return Number(m[0]); };
  const add = (into: Map<string, number>, k: string, v: number) => into.set(k, (into.get(k) ?? 0) + v);
  const close: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const stack: { map: Map<string, number>; close: string }[] = [{ map: new Map(), close: '' }];
  while (i < s.length) {
    const ch = s[i];
    // Isotope label: [13C], ^13C, or 13C right after a bracket isn't allowed (ambiguous), so use [13C] or ^13C.
    const iso = /^\[(\d+)([A-Z][a-z]?)\]/.exec(s.slice(i)) || /^\^(\d+)([A-Z][a-z]?)/.exec(s.slice(i));
    if (iso) {
      const el = BY_SYMBOL.get(iso[2]);
      if (!el) throw new FormulaError(`"${iso[2]}" is not an element.`);
      const a = Number(iso[1]);
      if (!el.isotopes.some((x) => x.a === a) && !ISO_EXTRA[`${a}${iso[2]}`]) throw new FormulaError(`${a}${iso[2]} is not an isotope in the table. Natural isotopes of ${el.name}: ${el.isotopes.map((x) => x.a).join(', ')}.`);
      i += iso[0].length; add(stack[stack.length - 1].map, `${a}${iso[2]}`, num()); continue;
    }
    if (close[ch]) { stack.push({ map: new Map(), close: close[ch] }); i++; continue; }
    if (ch === ')' || ch === ']' || ch === '}') {
      const top = stack.pop();
      if (!top || top.close !== ch || !stack.length) throw new FormulaError(`The bracket "${ch}" has no matching opening bracket.`);
      i++; const n = num();
      for (const [k, v] of top.map) add(stack[stack.length - 1].map, k, v * n);
      continue;
    }
    const em = /^[A-Z][a-z]?/.exec(s.slice(i));
    if (em) {
      const sym = em[0];
      // Prefer a two-letter symbol only if it exists ("Co" cobalt; "CO" is carbon + oxygen).
      if (sym.length === 2 && !BY_SYMBOL.has(sym)) throw new FormulaError(`"${sym}" is not an element symbol. Write groups out in full: Ph is C6H5, Me is CH3, Et is C2H5.`);
      i += sym.length;
      const n = num();
      if (sym === 'D') { add(stack[stack.length - 1].map, '2H', n); continue; }
      if (sym === 'T') { add(stack[stack.length - 1].map, '3H', n); continue; }
      if (!BY_SYMBOL.has(sym)) throw new FormulaError(`"${sym}" is not an element symbol. Symbols start with a capital letter: Co is cobalt, CO is carbon and oxygen.`);
      add(stack[stack.length - 1].map, sym, n); continue;
    }
    if (/[a-z]/.test(ch)) throw new FormulaError(`"${ch}" at position ${i + 1}: element symbols start with a capital letter.`);
    if (/\d/.test(ch)) throw new FormulaError(`A number at position ${i + 1} has nothing before it to count.`);
    throw new FormulaError(`"${ch}" at position ${i + 1} is not allowed in a formula.`);
  }
  if (stack.length !== 1) throw new FormulaError(`A "${({ ')': '(', ']': '[', '}': '{' } as Record<string, string>)[stack[stack.length - 1].close]}" bracket is never closed.`);
  return stack[0].map;
}

/** Radioactive labels people use that have no natural abundance (mass from the usual tables). */
const ISO_EXTRA: Record<string, number> = { '3H': 3.01604928132, '14C': 14.0032419884, '18F': 18.0009380, '32P': 31.97390764, '35S': 34.96903231, '125I': 124.9046306, '131I': 130.9061263, '99Tc': 98.9062508 };

/** Exact mass of one atom with a given key, and the standard atomic weight used for molar mass. */
export function atomMass(key: string): { exact: number; weight: number } {
  const { el, a } = keyInfo(key);
  if (a !== undefined) { const iso = el.isotopes.find((x) => x.a === a); const m = iso?.mass ?? ISO_EXTRA[key] ?? a; return { exact: m, weight: m }; }
  const mono = el.isotopes.reduce((b, x) => (x.abundance > b.abundance ? x : b), el.isotopes[0]);
  return { exact: mono.mass, weight: el.weight };
}

/** Molar mass in g/mol from standard atomic weights (labelled isotopes use their exact mass). */
export const molarMass = (f: Formula) => [...f.counts].reduce((s, [k, n]) => s + atomMass(k).weight * n, 0);
/** Monoisotopic mass: the most abundant isotope of each element (labelled ones as given), less the electrons of the charge. */
export const monoMass = (f: Formula) => [...f.counts].reduce((s, [k, n]) => s + atomMass(k).exact * n, 0) - f.charge * ELECTRON;
export const nominalMass = (f: Formula) => [...f.counts].reduce((s, [k, n]) => { const { el, a } = keyInfo(k); const m = a ?? el.isotopes.reduce((b, x) => (x.abundance > b.abundance ? x : b), el.isotopes[0]).a; return s + m * n; }, 0);

/** Counts merged by element. */
export function byElement(f: Formula): Map<string, number> {
  const out = new Map<string, number>();
  for (const [k, n] of f.counts) { const s = keyInfo(k).el.symbol; out.set(s, (out.get(s) ?? 0) + n); }
  return out;
}

/** Mass percentage of each element. */
export function composition(f: Formula): { symbol: string; name: string; count: number; mass: number; percent: number }[] {
  const total = molarMass(f), out = new Map<string, { symbol: string; name: string; count: number; mass: number }>();
  for (const [k, n] of f.counts) { const { el } = keyInfo(k), m = atomMass(k).weight * n; const o = out.get(el.symbol) ?? { symbol: el.symbol, name: el.name, count: 0, mass: 0 }; o.count += n; o.mass += m; out.set(el.symbol, o); }
  return hillSort([...out.values()], (x) => x.symbol, f).map((o) => ({ ...o, percent: (100 * o.mass) / total }));
}

function hillSort<T>(xs: T[], sym: (x: T) => string, f: Formula): T[] {
  const hasC = byElement(f).has('C');
  const rank = (k: string) => { const s = k.split('~')[0]; return hasC ? (s === 'C' ? 0 : s === 'H' ? 1 : 2) : 2; };
  return xs.sort((a, b) => rank(sym(a)) - rank(sym(b)) || (sym(a) < sym(b) ? -1 : sym(a) > sym(b) ? 1 : 0));
}

const fmtN = (n: number) => (n === 1 ? '' : Number.isInteger(n) ? String(n) : String(+n.toFixed(4)));
/** Hill-order formula: C, then H, then the rest alphabetically (all alphabetical without carbon). Isotope labels kept as [13C]. */
export function hill(f: Formula, sub = false): string {
  const keys = hillSort([...f.counts.keys()], (k) => keyInfo(k).el.symbol + (keyInfo(k).a ? `~${String(keyInfo(k).a).padStart(3, '0')}` : ''), f);
  const s = (n: string) => (sub ? n.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]) : n);
  const body = keys.map((k) => { const { el, a } = keyInfo(k); return (a ? `[${a}${el.symbol}]` : el.symbol) + s(fmtN(f.counts.get(k)!)); }).join('');
  return body + chargeText(f.charge, sub);
}
/** Charge as superscript (³⁺) or as plain text that parseFormula reads back (^3+, or + and - for one). */
export const chargeText = (z: number, sup = true) => {
  if (!z) return '';
  const n = Math.abs(z) === 1 ? '' : String(Math.abs(z)), sg = z > 0 ? '+' : '-';
  return sup ? n.replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]) + (z > 0 ? '⁺' : '⁻') : (n ? `^${n}${sg}` : sg);
};

/** Degree of unsaturation (rings plus double bonds) for C, H, N, O, halogens, Si, P, S, B: C + Si − (H + X)/2 + (N + P)/2 + 1. */
export function unsaturation(f: Formula): number | null {
  const e = byElement(f);
  const ok = new Set(['C', 'H', 'N', 'O', 'S', 'F', 'Cl', 'Br', 'I', 'Si', 'P', 'B', 'Se']);
  if (![...e.keys()].every((k) => ok.has(k)) || !e.has('C')) return null;
  const g = (k: string) => e.get(k) ?? 0;
  return g('C') + g('Si') - (g('H') + g('F') + g('Cl') + g('Br') + g('I') + f.charge) / 2 + (g('N') + g('P') + g('B')) / 2 + 1;
}

// ---------------- Equation balancing ----------------

type Q = { n: bigint; d: bigint };
const gcd = (a: bigint, b: bigint): bigint => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const q = (n: bigint, d = 1n): Q => { if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const qsub = (a: Q, b: Q) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const qmul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
const qdiv = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);

/** Turn a decimal count into a fraction (counts like 0.5 or 2.25 are allowed). */
const toQ = (x: number): Q => { let d = 1n, v = x; for (let k = 0; k < 6 && Math.abs(v - Math.round(v)) > 1e-9; k++) { v *= 10; d *= 10n; } return q(BigInt(Math.round(v)), d); };

/** Null space of an integer matrix (rows × cols), as integer basis vectors. */
export function nullSpace(m: number[][]): bigint[][] {
  const rows = m.length, cols = m[0]?.length ?? 0;
  const a: Q[][] = m.map((r) => r.map(toQ));
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = -1; for (let i = r; i < rows; i++) if (a[i][c].n !== 0n) { p = i; break; }
    if (p < 0) continue;
    [a[r], a[p]] = [a[p], a[r]];
    const pv = a[r][c]; a[r] = a[r].map((x) => qdiv(x, pv));
    for (let i = 0; i < rows; i++) if (i !== r && a[i][c].n !== 0n) { const f = a[i][c]; a[i] = a[i].map((x, j) => qsub(x, qmul(f, a[r][j]))); }
    pivots.push(c); r++;
  }
  const free = [...Array(cols).keys()].filter((c) => !pivots.includes(c));
  return free.map((fc) => {
    const v: Q[] = Array.from({ length: cols }, () => q(0n));
    v[fc] = q(1n);
    pivots.forEach((pc, i) => { v[pc] = q(-a[i][fc].n, a[i][fc].d); });
    const L = v.reduce((l, x) => (l * x.d) / gcd(l, x.d), 1n);
    let ints = v.map((x) => (x.n * L) / x.d);
    const g = ints.reduce((g2, x) => gcd(g2, x), 0n) || 1n;
    ints = ints.map((x) => x / g);
    return ints;
  });
}

export type Species = { text: string; formula: Formula; side: 'reactant' | 'product' };
export type Balanced = { species: Species[]; coefficients: number[]; unique: boolean; elements: string[]; equation: string };

/** Split "Fe + O2 -> Fe2O3" (also =, →, ⟶, <=>, ⇌) into species. Existing coefficients are ignored. */
export function parseEquation(text: string): Species[] {
  const sides = text.split(/\s*(?:<=>|<->|⇌|⇄|->|-->|→|⟶|=>|=)\s*/);
  if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) throw new FormulaError('Write the reaction with an arrow or equals sign between the two sides, such as Fe + O2 -> Fe2O3.');
  const out: Species[] = [];
  sides.forEach((side, si) => {
    // Split on " + " (spaces), or "+" that is followed by a capital/bracket/digit and preceded by a letter, digit or bracket (not a charge).
    for (let t of side.split(/\s+\+\s+|(?<=[A-Za-z0-9)\]}])\+(?=[A-Z([{])/)) {
      t = t.trim(); if (!t) continue;
      t = t.replace(/^\d+(?:\.\d+)?\s*(?=[A-Z([{])/, ''); // drop a coefficient the user typed
      t = t.replace(/\s*\((?:s|l|g|aq)\)$/i, ''); // drop state symbols
      out.push({ text: t, formula: parseFormula(t), side: si ? 'product' : 'reactant' });
    }
  });
  return out;
}

/** Balance a reaction: smallest whole-number coefficients that conserve every element and the charge. */
export function balance(species: Species[]): Balanced {
  const els = [...new Set(species.flatMap((s) => [...byElement(s.formula).keys()]))];
  const iso = [...new Set(species.flatMap((s) => [...s.formula.counts.keys()].filter((k) => /^\d/.test(k))))];
  const rowsKeys = [...els.map((e) => ({ e })), ...iso.map((k) => ({ k }))];
  const m = rowsKeys.map((rk) => species.map((s) => {
    const c = 'e' in rk ? byElement(s.formula).get(rk.e) ?? 0 : s.formula.counts.get(rk.k) ?? 0;
    return s.side === 'reactant' ? c : -c;
  }));
  if (species.some((s) => s.formula.charge)) m.push(species.map((s) => (s.side === 'reactant' ? s.formula.charge : -s.formula.charge)));
  for (const e of els) {
    const onR = species.some((s) => s.side === 'reactant' && byElement(s.formula).has(e)), onP = species.some((s) => s.side === 'product' && byElement(s.formula).has(e));
    if (onR !== onP) throw new FormulaError(`${BY_SYMBOL.get(e)!.name} (${e}) appears on only one side, so the reaction cannot be balanced. Check the formulas.`);
  }
  const ns = nullSpace(m);
  if (!ns.length) throw new FormulaError('These formulas cannot be balanced: no set of amounts conserves every element. Check each formula, or a missing product such as H2O.');
  let v = ns[0];
  if (ns.length > 1) {
    // Several independent reactions mixed together: take the smallest all-positive combination we can find.
    let best: bigint[] | null = null;
    const R = 6, combos = (k: number): number[][] => (k === 0 ? [[]] : combos(k - 1).flatMap((c) => Array.from({ length: R }, (_, i) => [...c, i])));
    for (const w of combos(ns.length)) {
      if (w.every((x) => x === 0)) continue;
      const cand = ns[0].map((_, j) => ns.reduce((s, b, i) => s + BigInt(w[i]) * b[j], 0n));
      const pos = cand.every((x) => x > 0n), neg = cand.every((x) => x < 0n);
      if (!pos && !neg) continue;
      const c = cand.map((x) => (x < 0n ? -x : x)), g = c.reduce((a, b) => gcd(a, b), 0n), cc = c.map((x) => x / g);
      if (!best || cc.reduce((a, b) => a + b, 0n) < best.reduce((a, b) => a + b, 0n)) best = cc;
    }
    if (!best) throw new FormulaError('This reaction can be balanced in more than one way, and none of them keeps every amount positive. Check the formulas.');
    v = best;
  }
  if (v.every((x) => x <= 0n)) v = v.map((x) => -x);
  if (v.some((x) => x <= 0n)) throw new FormulaError('The only balance needs a substance on the other side (a zero or negative amount). Check that each substance is on the right side of the arrow.');
  const coefficients = v.map(Number);
  const side = (sd: 'reactant' | 'product') => species.map((s, i) => [s, coefficients[i]] as const).filter(([s]) => s.side === sd).map(([s, c]) => `${c === 1 ? '' : c}${s.text}`).join(' + ');
  return { species, coefficients, unique: ns.length === 1, elements: els, equation: `${side('reactant')} → ${side('product')}` };
}

/** Limiting reagent and theoretical yields from moles of each reactant given (undefined = in excess). */
export function stoichiometry(b: Balanced, molesGiven: (number | undefined)[]) {
  const ext = b.species.map((s, i) => (s.side === 'reactant' && molesGiven[i] !== undefined && molesGiven[i]! >= 0 ? molesGiven[i]! / b.coefficients[i] : Infinity));
  const xi = Math.min(...ext), limiting = Number.isFinite(xi) ? ext.indexOf(xi) : -1;
  return {
    extent: xi, limiting,
    rows: b.species.map((s, i) => {
      const mm = molarMass(s.formula), used = Number.isFinite(xi) ? xi * b.coefficients[i] : NaN;
      return s.side === 'reactant'
        ? { moles: used, grams: used * mm, left: molesGiven[i] !== undefined ? molesGiven[i]! - used : NaN, leftGrams: molesGiven[i] !== undefined ? (molesGiven[i]! - used) * mm : NaN, molarMass: mm }
        : { moles: used, grams: used * mm, left: NaN, leftGrams: NaN, molarMass: mm };
    }),
  };
}

// ---------------- Isotope patterns ----------------

export type Peak = { mz: number; mass: number; abundance: number };

/** Fine isotope pattern by repeated convolution, merging peaks closer than `merge` u and pruning below `prune` of the top. */
export function isotopePattern(f: Formula, opts: { prune?: number; merge?: number } = {}): Peak[] {
  const prune = opts.prune ?? 1e-6, merge = opts.merge ?? 1e-4;
  let dist: [number, number][] = [[0, 1]];
  const conv = (a: [number, number][], b: [number, number][]) => {
    const out: [number, number][] = [];
    for (const [ma, pa] of a) for (const [mb, pb] of b) out.push([ma + mb, pa * pb]);
    out.sort((x, y) => x[0] - y[0]);
    const merged: [number, number][] = [];
    for (const [m, p] of out) { const last = merged[merged.length - 1]; if (last && m - last[0] < merge) { const t = last[1] + p; last[0] = (last[0] * last[1] + m * p) / t; last[1] = t; } else merged.push([m, p]); }
    const top = Math.max(...merged.map((x) => x[1]));
    return merged.filter((x) => x[1] >= top * prune);
  };
  for (const [k, n] of f.counts) {
    const { el, a } = keyInfo(k);
    if (!Number.isInteger(n) || n < 0) throw new FormulaError('Isotope patterns need whole-number atom counts.');
    const one: [number, number][] = a !== undefined ? [[atomMass(k).exact, 1]] : el.isotopes.map((x) => [x.mass, x.abundance]);
    // Raise to the power n by squaring.
    let base = one, e = n, acc: [number, number][] = [[0, 1]];
    while (e > 0) { if (e & 1) acc = conv(acc, base); e >>= 1; if (e) base = conv(base, base); }
    dist = conv(dist, acc);
  }
  const z = f.charge, top = Math.max(...dist.map((x) => x[1]));
  return dist.map(([m, p]) => { const mass = m - z * ELECTRON; return { mass, mz: z ? mass / Math.abs(z) : mass, abundance: (100 * p) / top }; });
}

/** Group a fine pattern into unit-mass clusters (M, M+1, M+2, ...), each at its abundance-weighted mass. */
export function clusterPattern(peaks: Peak[], z = 1): Peak[] {
  if (!peaks.length) return [];
  const step = 1.00235 / Math.max(1, Math.abs(z)), m0 = peaks.reduce((b, p) => (p.mass < b.mass ? p : b)).mz;
  const groups = new Map<number, { w: number; a: number; m: number }>();
  for (const p of peaks) { const k = Math.round((p.mz - m0) / step); const g = groups.get(k) ?? { w: 0, a: 0, m: 0 }; g.a += p.abundance; g.w += p.abundance * p.mz; g.m += p.abundance * p.mass; groups.set(k, g); }
  const top = Math.max(...[...groups.values()].map((g) => g.a));
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => ({ mz: g.w / g.a, mass: g.m / g.a, abundance: (100 * g.a) / top }));
}

/** A profile spectrum: each peak as a Gaussian of FWHM m/R. */
export function profile(peaks: Peak[], resolution: number, points = 1600): { x: number[]; y: number[] } {
  if (!peaks.length) return { x: [], y: [] };
  const lo = Math.min(...peaks.map((p) => p.mz)), hi = Math.max(...peaks.map((p) => p.mz)), w = (hi + lo) / 2 / resolution;
  const a = lo - 4 * w - 0.3, b = hi + 4 * w + 0.3, x: number[] = [], y: number[] = [];
  for (let i = 0; i <= points; i++) {
    const m = a + ((b - a) * i) / points; let s = 0;
    for (const p of peaks) { const sig = p.mz / resolution / 2.3548; const d = (m - p.mz) / sig; if (Math.abs(d) < 8) s += p.abundance * Math.exp(-0.5 * d * d); }
    x.push(m); y.push(s);
  }
  const top = Math.max(...y) || 1;
  return { x, y: y.map((v) => (100 * v) / top) };
}

/** Common ESI and EI adducts: what to add to M (a formula change) and the charge. */
export type Adduct = { id: string; label: string; add: string; remove: string; mult: number; charge: number };
export const ADDUCTS: Adduct[] = [
  { id: 'M', label: 'M (neutral)', add: '', remove: '', mult: 1, charge: 0 },
  { id: 'M+H', label: '[M+H]⁺', add: 'H', remove: '', mult: 1, charge: 1 },
  { id: 'M+Na', label: '[M+Na]⁺', add: 'Na', remove: '', mult: 1, charge: 1 },
  { id: 'M+K', label: '[M+K]⁺', add: 'K', remove: '', mult: 1, charge: 1 },
  { id: 'M+NH4', label: '[M+NH₄]⁺', add: 'NH4', remove: '', mult: 1, charge: 1 },
  { id: 'M+', label: 'M⁺· (EI, radical cation)', add: '', remove: '', mult: 1, charge: 1 },
  { id: 'M+H-H2O', label: '[M+H−H₂O]⁺', add: 'H', remove: 'H2O', mult: 1, charge: 1 },
  { id: 'M+2H', label: '[M+2H]²⁺', add: 'H2', remove: '', mult: 1, charge: 2 },
  { id: '2M+H', label: '[2M+H]⁺', add: 'H', remove: '', mult: 2, charge: 1 },
  { id: '2M+Na', label: '[2M+Na]⁺', add: 'Na', remove: '', mult: 2, charge: 1 },
  { id: 'M-H', label: '[M−H]⁻', add: '', remove: 'H', mult: 1, charge: -1 },
  { id: 'M+Cl', label: '[M+Cl]⁻', add: 'Cl', remove: '', mult: 1, charge: -1 },
  { id: 'M+HCOO', label: '[M+HCOO]⁻ (formate)', add: 'HCOO', remove: '', mult: 1, charge: -1 },
  { id: 'M+CH3COO', label: '[M+CH₃COO]⁻ (acetate)', add: 'CH3COO', remove: '', mult: 1, charge: -1 },
  { id: 'M-2H', label: '[M−2H]²⁻', add: '', remove: 'H2', mult: 1, charge: -2 },
];

/** The ion formula for an adduct of a neutral molecule. */
export function adductFormula(m: Formula, ad: Adduct): Formula {
  const counts = new Map<string, number>();
  for (const [k, v] of m.counts) counts.set(k, v * ad.mult);
  for (const [k, v] of ad.add ? parseFormula(ad.add).counts : []) counts.set(k, (counts.get(k) ?? 0) + v);
  for (const [k, v] of ad.remove ? parseFormula(ad.remove).counts : []) {
    const have = counts.get(k) ?? 0;
    if (have < v) throw new FormulaError(`The molecule has too few ${k} atoms for ${ad.label}.`);
    if (have === v) counts.delete(k); else counts.set(k, have - v);
  }
  return { counts, charge: m.charge * ad.mult + ad.charge };
}

/** Parts-per-million difference between a measured and a calculated m/z. */
export const ppm = (measured: number, calc: number) => ((measured - calc) / calc) * 1e6;

/** Typeset a formula as people write it: counts as subscripts, charges as superscripts ("Fe^3+" → Fe³⁺, "SO4^2-" → SO₄²⁻). */
export function pretty(s: string): string {
  const sup = (n: string, sg: string) => n.replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]) + (sg === '+' ? '⁺' : '⁻');
  return s.trim()
    .replace(/(?:\*|(?<!(?:^|\D)0)\.)(?=\d*\.?\d*[A-Z([{])/g, '·')
    .replace(/\^(\d*)([+-])/g, (_, n, sg) => sup(n, sg))
    .replace(/\s(\d*)([+-])$/, (_, n, sg) => sup(n, sg))
    .replace(/([A-Za-z)\]}])(\d+(?:\.\d+)?)/g, (_, a, n) => a + n.replace(/\d/g, (d: string) => '₀₁₂₃₄₅₆₇₈₉'[+d]))
    .replace(/\[(\d+)([A-Z][a-z]?)\]/g, (_, n, el) => n.replace(/\d/g, (d: string) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]) + el)
    .replace(/(?<=[A-Za-z₀-₉)\]}])([+-]+)$/, (m) => m.replace(/\+/g, '⁺').replace(/-/g, '⁻'));
}
