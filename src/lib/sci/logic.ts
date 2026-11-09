// Boolean logic: parse an expression, truth tables, minimal sum of products and product of sums by Quine-McCluskey
// with an exact minimum cover (up to 6 variables), Karnaugh map layout and the cubes of each group.
// Plain TypeScript, no DOM. Checked against sympy.logic (SOPform, POSform) in tests/sci-tools/logic-simplifier.mjs.

export type BNode =
  | { k: 'const'; v: boolean }
  | { k: 'var'; name: string }
  | { k: 'not'; a: BNode }
  | { k: 'and' | 'or' | 'xor' | 'imp' | 'iff' | 'nand' | 'nor'; a: BNode; b: BNode };

export const MAX_VARS = 6;

type Tok = { t: 'var' | 'const' | 'op' | '(' | ')' | "'"; v: string };
const WORDS: Record<string, string> = { and: '&', or: '|', not: '!', xor: '^', nand: 'nand', nor: 'nor', true: '1', false: '0' };
function lex(src: string): Tok[] {
  const s = src.replace(/[∧·⋅×*]/g, '&').replace(/[∨+]/g, '|').replace(/[¬~]/g, '!').replace(/[⊕]/g, '^').replace(/[’′`]/g, "'")
    .replace(/<->|<=>|↔|⇔|==/g, '≡').replace(/->|=>|→|⇒/g, '→').replace(/&&/g, '&').replace(/\|\|/g, '|');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '0' || c === '1') { out.push({ t: 'const', v: c }); i++; continue; }
    const w = /^[A-Za-z][A-Za-z0-9_]*/.exec(s.slice(i));
    if (w) {
      const lw = w[0].toLowerCase();
      if (WORDS[lw] && w[0].length > 1) {
        const v = WORDS[lw];
        out.push(v === '1' || v === '0' ? { t: 'const', v } : { t: 'op', v });
      } else {
        // Letters written together are ANDed (AB = A·B); a letter may carry digits (A1, x2).
        for (const m of w[0].matchAll(/[A-Za-z][0-9_]*/g)) out.push({ t: 'var', v: m[0] });
      }
      i += w[0].length; continue;
    }
    if ('&|!^→≡'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    if (c === '(' || c === '[') { out.push({ t: '(', v: '(' }); i++; continue; }
    if (c === ')' || c === ']') { out.push({ t: ')', v: ')' }); i++; continue; }
    if (c === "'") { out.push({ t: "'", v: "'" }); i++; continue; }
    throw new Error(`"${c}" can't be used here. Use letters for variables, ' or ! for NOT, & or juxtaposition for AND, + or | for OR, ^ for XOR.`);
  }
  return out;
}

/** Parse a Boolean expression. Precedence: NOT, AND, XOR, OR, → (implies), ↔ (equivalent). */
export function parseLogic(src: string): BNode {
  const toks = lex(src);
  if (!toks.length) throw new Error('Type an expression, such as A\'B + AC.');
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === 'op' && peek().v === v;
  const startsAtom = () => { const t = peek(); return !!t && (t.t === 'var' || t.t === 'const' || t.t === '(' || (t.t === 'op' && t.v === '!')); };
  function iff(): BNode { let a = imp(); while (isOp('≡')) { p++; a = { k: 'iff', a, b: imp() }; } return a; }
  function imp(): BNode { const a = or(); if (isOp('→')) { p++; return { k: 'imp', a, b: imp() }; } return a; }
  function or(): BNode { let a = xor(); for (;;) { if (isOp('|')) { p++; a = { k: 'or', a, b: xor() }; } else if (isOp('nor')) { p++; a = { k: 'nor', a, b: xor() }; } else return a; } }
  function xor(): BNode { let a = and(); while (isOp('^')) { p++; a = { k: 'xor', a, b: and() }; } return a; }
  function and(): BNode {
    let a = not();
    for (;;) {
      if (isOp('&')) { p++; a = { k: 'and', a, b: not() }; }
      else if (isOp('nand')) { p++; a = { k: 'nand', a, b: not() }; }
      else if (startsAtom()) a = { k: 'and', a, b: not() };
      else return a;
    }
  }
  function not(): BNode { if (isOp('!')) { p++; return { k: 'not', a: not() }; } return post(); }
  function post(): BNode { let a = atom(); while (peek()?.t === "'") { p++; a = { k: 'not', a }; } return a; }
  function atom(): BNode {
    const t = toks[p++];
    if (!t) throw new Error('The expression ends too soon.');
    if (t.t === 'var') return { k: 'var', name: t.v };
    if (t.t === 'const') return { k: 'const', v: t.v === '1' };
    if (t.t === '(') { const e = iff(); if (toks[p++]?.t !== ')') throw new Error('A bracket is not closed.'); return e; }
    throw new Error(t.t === ')' ? 'There is a ")" without a matching "(".' : `"${t.v}" needs something before or after it.`);
  }
  const e = iff();
  if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}".`);
  return e;
}

export function varsOf(n: BNode, out = new Set<string>()): string[] {
  if (n.k === 'var') out.add(n.name);
  else if (n.k === 'not') varsOf(n.a, out);
  else if (n.k !== 'const') { varsOf(n.a, out); varsOf(n.b, out); }
  return [...out].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}
export function evalLogic(n: BNode, env: Record<string, boolean>): boolean {
  switch (n.k) {
    case 'const': return n.v;
    case 'var': return env[n.name];
    case 'not': return !evalLogic(n.a, env);
    case 'and': return evalLogic(n.a, env) && evalLogic(n.b, env);
    case 'or': return evalLogic(n.a, env) || evalLogic(n.b, env);
    case 'xor': return evalLogic(n.a, env) !== evalLogic(n.b, env);
    case 'imp': return !evalLogic(n.a, env) || evalLogic(n.b, env);
    case 'iff': return evalLogic(n.a, env) === evalLogic(n.b, env);
    case 'nand': return !(evalLogic(n.a, env) && evalLogic(n.b, env));
    case 'nor': return !(evalLogic(n.a, env) || evalLogic(n.b, env));
  }
}
/** Minterms (row numbers where the expression is 1), the first variable being the most significant bit. */
export function minterms(n: BNode, vars: string[]): number[] {
  const out: number[] = [], k = vars.length;
  for (let m = 0; m < 1 << k; m++) {
    const env: Record<string, boolean> = {};
    vars.forEach((v, i) => { env[v] = !!((m >> (k - 1 - i)) & 1); });
    if (evalLogic(n, env)) out.push(m);
  }
  return out;
}

/** Read a list like "0, 2, 5-7" (ranges allowed). */
export function parseList(s: string, k: number, label: string): number[] {
  const out = new Set<number>();
  const t = s.replace(/^[^0-9]*\(|\)\s*$/g, '').trim();
  if (!t) return [];
  for (const part of t.split(/[\s,;]+/).filter(Boolean)) {
    const r = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!r) throw new Error(`${label}: "${part}" is not a row number.`);
    const a = Number(r[1]), b = r[2] ? Number(r[2]) : a;
    if (b < a) throw new Error(`${label}: the range ${part} runs backwards.`);
    for (let m = a; m <= b; m++) { if (m >= 1 << k) throw new Error(`${label}: ${m} is too big for ${k} variables (the rows go from 0 to ${(1 << k) - 1}).`); out.add(m); }
  }
  return [...out].sort((x, y) => x - y);
}

// ---------- Quine-McCluskey ----------
/** A cube: bits where mask is 0 are fixed to the value's bits; mask bits are "don't matter" (a dash). */
export type Cube = { value: number; mask: number };
export const cubeKey = (c: Cube) => `${c.value}/${c.mask}`;
export const covers = (c: Cube, m: number) => (m & ~c.mask) === c.value;
const popcount = (x: number) => { let n = 0; while (x) { n += x & 1; x >>>= 1; } return n; };
export const literals = (c: Cube, k: number) => k - popcount(c.mask);
/** "10-1" style pattern, first variable first. */
export const pattern = (c: Cube, k: number) => Array.from({ length: k }, (_, i) => { const bit = 1 << (k - 1 - i); return c.mask & bit ? '-' : c.value & bit ? '1' : '0'; }).join('');

export type QMStep = { size: number; groups: { ones: number; cubes: { cube: Cube; terms: number[]; used: boolean }[] }[] };
/** All prime implicants of the function with these minterms and don't-cares, plus the combining steps. */
export function primeImplicants(on: number[], dc: number[], k: number): { primes: Cube[]; steps: QMStep[] } {
  let level = new Map<string, { cube: Cube; terms: number[] }>();
  for (const m of [...on, ...dc]) level.set(cubeKey({ value: m, mask: 0 }), { cube: { value: m, mask: 0 }, terms: [m] });
  const primes: Cube[] = [], steps: QMStep[] = [];
  let size = 1;
  while (level.size) {
    const items = [...level.values()];
    const used = new Set<string>(), next = new Map<string, { cube: Cube; terms: number[] }>();
    // Combine cubes with the same dashes whose values differ in exactly one bit.
    const byMask = new Map<number, typeof items>();
    for (const it of items) { const l = byMask.get(it.cube.mask) ?? []; l.push(it); byMask.set(it.cube.mask, l); }
    for (const list of byMask.values()) {
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const d = list[i].cube.value ^ list[j].cube.value;
        if (d && (d & (d - 1)) === 0) {
          const c = { value: list[i].cube.value & ~d, mask: list[i].cube.mask | d };
          used.add(cubeKey(list[i].cube)); used.add(cubeKey(list[j].cube));
          const key = cubeKey(c);
          if (!next.has(key)) next.set(key, { cube: c, terms: [...list[i].terms, ...list[j].terms].sort((a, b) => a - b) });
        }
      }
    }
    const groups = new Map<number, { cube: Cube; terms: number[]; used: boolean }[]>();
    for (const it of items) {
      const ones = popcount(it.cube.value);
      const g = groups.get(ones) ?? []; g.push({ ...it, used: used.has(cubeKey(it.cube)) }); groups.set(ones, g);
      if (!used.has(cubeKey(it.cube))) primes.push(it.cube);
    }
    steps.push({ size, groups: [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([ones, cubes]) => ({ ones, cubes: cubes.sort((a, b) => a.cube.value - b.cube.value) })) });
    level = next; size *= 2;
  }
  return { primes: primes.sort((a, b) => b.mask - a.mask || a.value - b.value), steps };
}

/** A minimum cover of the minterms by primes: fewest terms, then fewest literals (exact branch and bound). */
export function minimumCover(on: number[], primes: Cube[], k: number): { cover: Cube[]; essential: Cube[]; exact: boolean } {
  if (!on.length) return { cover: [], essential: [], exact: true };
  const coverOf = primes.map((p) => on.filter((m) => covers(p, m)));
  const essential: Cube[] = [];
  for (const m of on) {
    const who = primes.filter((p) => covers(p, m));
    if (who.length === 1 && !essential.includes(who[0])) essential.push(who[0]);
  }
  const lits = primes.map((p) => literals(p, k));
  // Minterms as bits in two 32-bit halves (up to 64 rows).
  const bitsOf = (ms: number[]) => { let lo = 0, hi = 0; for (const m of ms) { if (m < 32) lo |= 1 << m; else hi |= 1 << (m - 32); } return [lo >>> 0, hi >>> 0] as [number, number]; };
  const pc = (x: number) => { x = x - ((x >>> 1) & 0x55555555); x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; };
  const pmask = coverOf.map(bitsOf);
  const optsOf = new Map<number, number[]>(on.map((m) => [m, primes.map((_, i) => i).filter((i) => covers(primes[i], m))]));
  const maxCover = Math.max(1, ...pmask.map(([lo, hi]) => pc(lo) + pc(hi)));
  let best: number[] | null = null, bestT = Infinity, bestL = Infinity, nodes = 0;
  const chosen: number[] = [];
  const search = (lo: number, hi: number, nLits: number) => {
    if (++nodes > 3_000_000) return;
    const n = pc(lo) + pc(hi);
    if (!n) { if (chosen.length < bestT || (chosen.length === bestT && nLits < bestL)) { best = chosen.slice(); bestT = chosen.length; bestL = nLits; } return; }
    const need = Math.ceil(n / maxCover);
    if (chosen.length + need > bestT) return;
    // Some prime must cover the uncovered minterm with the fewest options: branch on those.
    let opts: number[] = [];
    for (const m of on) {
      if (!(m < 32 ? (lo >>> m) & 1 : (hi >>> (m - 32)) & 1)) continue;
      const o = optsOf.get(m)!;
      if (!opts.length || o.length < opts.length) { opts = o; if (o.length === 1) break; }
    }
    if (chosen.length + need === bestT && nLits + Math.min(...opts.map((i) => lits[i])) >= bestL) return;
    const gain = (i: number) => pc(pmask[i][0] & lo) + pc(pmask[i][1] & hi);
    const order = opts.slice().sort((x, y) => gain(y) - gain(x) || lits[x] - lits[y]);
    for (const i of order) {
      chosen.push(i); search((lo & ~pmask[i][0]) >>> 0, (hi & ~pmask[i][1]) >>> 0, nLits + lits[i]); chosen.pop();
    }
  };
  const [l0, h0] = bitsOf(on);
  search(l0, h0, 0);
  if (!best) throw new Error('The search for a minimum cover took too long.');
  const cover = (best as number[]).map((i) => primes[i]);
  // Reading order: fewer literals first, then by the first variable used (plain before complemented).
  const rank = (c: Cube) => pattern(c, k).replace(/1/g, 'a').replace(/0/g, 'b').replace(/-/g, 'c');
  return { cover: cover.sort((a, b) => literals(a, k) - literals(b, k) || (rank(a) < rank(b) ? -1 : rank(a) > rank(b) ? 1 : 0)), essential, exact: nodes <= 3_000_000 };
}

export type Notation = 'prime' | 'math' | 'code' | 'python';
const NOT: Record<Notation, (v: string) => string> = { prime: (v) => `${v}′`, math: (v) => `¬${v}`, code: (v) => `!${v}`, python: (v) => `~${v}` };
const AND: Record<Notation, string> = { prime: '', math: '∧', code: ' & ', python: ' & ' };
const OR: Record<Notation, string> = { prime: ' + ', math: ' ∨ ', code: ' | ', python: ' | ' };

/** One product term (SOP) or sum term (POS). */
export function termText(c: Cube, vars: string[], sum: boolean, nt: Notation): string {
  const k = vars.length, parts: string[] = [];
  vars.forEach((v, i) => {
    const bit = 1 << (k - 1 - i);
    if (c.mask & bit) return;
    const one = !!(c.value & bit);
    // In a POS term from the complement's cube, a 1 bit gives the complemented literal.
    const positive = sum ? !one : one;
    parts.push(positive ? v : NOT[nt](v));
  });
  if (!parts.length) return sum ? '0' : '1';
  if (sum) return parts.length > 1 ? `(${parts.join(OR[nt])})` : parts[0];
  const andSep = nt === 'prime' && vars.some((v) => v.length > 1) ? '·' : AND[nt];
  return parts.length > 1 && (nt === 'code' || nt === 'python') ? `(${parts.join(andSep)})` : parts.join(andSep);
}
export function sopText(cover: Cube[], vars: string[], nt: Notation): string {
  if (!cover.length) return '0';
  if (cover.length === 1 && cover[0].mask === (1 << vars.length) - 1) return '1';
  return cover.map((c) => termText(c, vars, false, nt)).join(OR[nt]).replace(/^\((.*)\)$/, cover.length === 1 ? '$1' : '($1)');
}
export function posText(cover: Cube[], vars: string[], nt: Notation): string {
  if (!cover.length) return '1';
  if (cover.length === 1 && cover[0].mask === (1 << vars.length) - 1) return '0';
  const sep = nt === 'prime' ? '' : nt === 'math' ? ' ∧ ' : ' & ';
  const terms = cover.map((c) => termText(c, vars, true, nt));
  if (terms.length === 1) return terms[0].replace(/^\((.*)\)$/, '$1');
  return terms.join(sep);
}

export type Minimal = { vars: string[]; on: number[]; dc: number[]; off: number[]; primes: Cube[]; steps: QMStep[]; sop: Cube[]; essential: Cube[]; posPrimes: Cube[]; pos: Cube[]; exact: boolean };
/** Minimal SOP and POS (POS from the minimal SOP of the complement, by De Morgan). */
export function minimise(vars: string[], on: number[], dc: number[] = []): Minimal {
  const k = vars.length;
  if (k > MAX_VARS) throw new Error(`Up to ${MAX_VARS} variables, please (this has ${k}: ${vars.join(', ')}).`);
  const dcs = dc.filter((m) => !on.includes(m));
  const off = Array.from({ length: 1 << k }, (_, m) => m).filter((m) => !on.includes(m) && !dcs.includes(m));
  const { primes, steps } = primeImplicants(on, dcs, k);
  const { cover: sop, essential, exact: e1 } = minimumCover(on, primes, k);
  const { primes: posPrimes } = primeImplicants(off, dcs, k);
  const { cover: pos, exact: e2 } = minimumCover(off, posPrimes, k);
  return { vars, on, dc: dcs, off, primes, steps, sop, essential, posPrimes, pos, exact: e1 && e2 };
}

// ---------- Karnaugh map layout (2 to 4 variables) ----------
export const GRAY = (bits: number) => (bits === 0 ? [0] : bits === 1 ? [0, 1] : [0, 1, 3, 2]);
/** Rows use the first ⌊k/2⌋ variables, columns the rest, both in Gray code order. Cell (r, c) holds minterm m. */
export function kmapLayout(k: number): { rowBits: number; colBits: number; rows: number[]; cols: number[]; cell: (r: number, c: number) => number } {
  if (k < 2 || k > 4) throw new Error('Karnaugh maps are drawn for 2 to 4 variables.');
  const rowBits = Math.floor(k / 2), colBits = k - rowBits, rows = GRAY(rowBits), cols = GRAY(colBits);
  return { rowBits, colBits, rows, cols, cell: (r, c) => (rows[r] << colBits) | cols[c] };
}
/** The rectangles (in row/column index space, possibly wrapping) a cube occupies on the map. */
export function kmapRects(c: Cube, k: number): { r0: number; r1: number; c0: number; c1: number }[] {
  const L = kmapLayout(k);
  const rowsIn = L.rows.map((rv, i) => i).filter((i) => L.cols.some((_, j) => covers(c, L.cell(i, j))));
  const colsIn = L.cols.map((cv, j) => j).filter((j) => L.rows.some((_, i) => covers(c, L.cell(i, j))));
  // A cube's rows (and columns) are one run on the Gray-code ring, which may wrap round the edge.
  const runs = (idx: number[], n: number): [number, number][] => {
    if (idx.length === n) return [[0, n - 1]];
    const set = new Set(idx), st = idx.find((i) => !set.has((i - 1 + n) % n))!, end = st + idx.length - 1;
    return end < n ? [[st, end]] : [[st, n - 1], [0, end - n]];
  };
  const out: { r0: number; r1: number; c0: number; c1: number }[] = [];
  for (const [r0, r1] of runs(rowsIn, L.rows.length)) for (const [c0, c1] of runs(colsIn, L.cols.length)) out.push({ r0, r1, c0, c1 });
  return out;
}
