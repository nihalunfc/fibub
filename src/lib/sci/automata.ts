// Finite automata from regular expressions: a parser for a regex subset (literals, ., [classes], \d \w \s,
// | * + ? {m,n}, brackets), Thompson's construction (regex → NFA with ε-moves), the subset construction
// (NFA → DFA), Moore's partition refinement (DFA → minimal DFA), simulation, a text format for typing a DFA,
// and facts about the language (empty, finite, words of each length, shortest words). Plain TypeScript, no DOM.
// Checked against JavaScript's own RegExp by brute force in tests/sci-tools/regex-fsm-visualiser.mjs.

export type Node =
  | { t: 'eps' } | { t: 'sym'; set: string[] | 'any'; neg?: boolean } // 'any' is . (every symbol but a line break)
  | { t: 'cat'; a: Node; b: Node } | { t: 'alt'; a: Node; b: Node }
  | { t: 'star'; a: Node } | { t: 'plus'; a: Node } | { t: 'opt'; a: Node };

export const LIMITS = { nfa: 600, dfa: 400, alphabet: 64, repeat: 50 };
const range = (a: string, b: string) => { const out: string[] = []; for (let c = a.codePointAt(0)!; c <= b.codePointAt(0)!; c++) out.push(String.fromCodePoint(c)); return out; };
const CLASS: Record<string, string[]> = { d: range('0', '9'), w: [...range('A', 'Z'), ...range('a', 'z'), ...range('0', '9'), '_'], s: [' ', '\t'] };

/** Parse a regex in the supported subset. It always matches the whole string (as if wrapped in ^(?: … )$). */
export function parseRegex(src: string): Node {
  let i = 0;
  const s = [...src];
  const fail = (m: string): never => { throw new Error(`${m} (at position ${i + 1})`); };
  const peek = () => s[i];
  const escape = (c: string): { set: string[]; neg?: boolean } => {
    if (c === undefined) fail('A backslash at the end has nothing to escape');
    if (c in CLASS) return { set: CLASS[c] };
    if (c.toLowerCase() in CLASS && c !== c.toLowerCase()) return { set: CLASS[c.toLowerCase()], neg: true };
    if (c === 'n') return { set: ['\n'] }; if (c === 't') return { set: ['\t'] };
    if (/[a-zA-Z0-9]/.test(c)) fail(`\\${c} is not supported; use \\d, \\w, \\s or escape a symbol such as \\.`);
    return { set: [c] };
  };
  const alt = (): Node => { let a = cat(); while (peek() === '|') { i++; a = { t: 'alt', a, b: cat() }; } return a; };
  const cat = (): Node => {
    let a: Node | null = null;
    while (i < s.length && peek() !== '|' && peek() !== ')') { const b = rep(); a = a ? { t: 'cat', a, b } : b; }
    return a ?? { t: 'eps' };
  };
  const rep = (): Node => {
    let a = atom(), quantified = false;
    for (;;) {
      const c = peek();
      if (c === '*' || c === '+' || c === '?') {
        if (quantified) { if (c === '?') { i++; continue; } fail('Nothing to repeat: two repeat marks in a row'); }
        i++; a = c === '*' ? { t: 'star', a } : c === '+' ? { t: 'plus', a } : { t: 'opt', a }; quantified = true;
      } else if (c === '{') {
        const m = /^\{(\d+)(,(\d*))?\}/.exec(s.slice(i).join(''));
        if (!m) fail('A { must be a repeat such as {2}, {2,} or {2,4}; write \\{ for the symbol');
        if (quantified) fail('Nothing to repeat: two repeat marks in a row');
        i += m![0].length;
        const lo = Number(m![1]), hi = m![2] === undefined ? lo : m![3] === '' ? Infinity : Number(m![3]);
        if (hi < lo) fail(`In {${lo},${m![3]}} the second number is smaller`);
        if (lo > LIMITS.repeat || (hi !== Infinity && hi > LIMITS.repeat)) fail(`Repeats up to {${LIMITS.repeat}} only`);
        let r: Node | null = null;
        for (let k = 0; k < lo; k++) r = r ? { t: 'cat', a: r, b: a } : a;
        if (hi === Infinity) r = r ? { t: 'cat', a: r, b: { t: 'star', a } } : { t: 'star', a };
        else for (let k = lo; k < hi; k++) r = r ? { t: 'cat', a: r, b: { t: 'opt', a } } : { t: 'opt', a };
        a = r ?? { t: 'eps' }; quantified = true;
      } else return a;
    }
  };
  const atom = (): Node => {
    const c = peek();
    if (c === '(') {
      i++;
      if (s[i] === '?' && s[i + 1] === ':') i += 2;
      else if (s[i] === '?') fail('Only plain groups ( ) and (?: ) are supported');
      const a = alt(); if (peek() !== ')') fail('A bracket ( is not closed'); i++; return a;
    }
    if (c === ')') fail('A closing bracket ) has no opening one');
    if (c === '*' || c === '+' || c === '?') fail('Nothing to repeat before ' + c);
    if (c === '{' || c === '}') fail('Write \\{ or \\} for a brace symbol');
    if (c === '^' || c === '$') fail('^ and $ are not needed: the whole string is always matched');
    if (c === '.') { i++; return { t: 'sym', set: 'any' }; }
    if (c === '\\') { i++; const e = escape(s[i++]); return { t: 'sym', set: e.set, neg: e.neg }; }
    if (c === '[') {
      i++; let neg = false; const set: string[] = [];
      if (peek() === '^') { neg = true; i++; }
      let first = true;
      while (i < s.length && (peek() !== ']' || first)) {
        first = false;
        let a = s[i++];
        if (a === '\\') { const e = escape(s[i++]); if (e.neg) fail('\\D, \\W and \\S cannot go inside [ ]'); if (e.set.length > 1) { set.push(...e.set); continue; } a = e.set[0]; }
        if (peek() === '-' && s[i + 1] !== undefined && s[i + 1] !== ']') {
          i++; let b = s[i++];
          if (b === '\\') { const e = escape(s[i++]); if (e.set.length > 1) fail('A range cannot end in a class'); b = e.set[0]; }
          if (b.codePointAt(0)! < a.codePointAt(0)!) fail(`The range ${a}-${b} is backwards`);
          if (b.codePointAt(0)! - a.codePointAt(0)! > 200) fail('That range is too big');
          set.push(...range(a, b));
        } else set.push(a);
      }
      if (peek() !== ']') fail('A [ is not closed');
      i++;
      return { t: 'sym', set: [...new Set(set)], neg };
    }
    i++;
    return { t: 'sym', set: [c] };
  };
  const tree = alt();
  if (i < s.length) fail('A closing bracket ) has no opening one');
  return tree;
}
/** Symbols named in the regex (the alphabet unless more are added). */
export function symbolsOf(n: Node, out = new Set<string>()): Set<string> {
  if (n.t === 'sym') { if (n.set !== 'any') n.set.forEach((c) => out.add(c)); }
  else if (n.t === 'cat' || n.t === 'alt') { symbolsOf(n.a, out); symbolsOf(n.b, out); }
  else if (n.t !== 'eps') symbolsOf(n.a, out);
  return out;
}
export const needsAlphabet = (n: Node): boolean => n.t === 'sym' ? n.set === 'any' || !!n.neg : n.t === 'eps' ? false : n.t === 'cat' || n.t === 'alt' ? needsAlphabet(n.a) || needsAlphabet(n.b) : needsAlphabet(n.a);

// ---------- NFA ----------
export type NFA = { n: number; start: number; accept: boolean[]; eps: number[][]; moves: [number, number][][]; alphabet: string[] };
/** Thompson's construction: one start state, one accepting state, ε-moves. Symbols are indices into `alphabet`. */
export function thompson(tree: Node, alphabet: string[]): NFA {
  const eps: number[][] = [], moves: [number, number][][] = [];
  const idx = new Map(alphabet.map((c, k) => [c, k]));
  const st = () => { if (eps.length >= LIMITS.nfa) throw new Error(`The NFA would need more than ${LIMITS.nfa} states; try a shorter regex.`); eps.push([]); moves.push([]); return eps.length - 1; };
  const build = (n: Node): [number, number] => {
    switch (n.t) {
      case 'eps': { const a = st(), b = st(); eps[a].push(b); return [a, b]; }
      case 'sym': {
        const a = st(), b = st();
        const set = n.set === 'any' ? alphabet.filter((c) => c !== '\n' && c !== '\r') : n.neg ? alphabet.filter((c) => !(n.set as string[]).includes(c)) : n.set;
        for (const c of set) moves[a].push([idx.get(c)!, b]);
        return [a, b];
      }
      case 'cat': { const [a1, b1] = build(n.a), [a2, b2] = build(n.b); eps[b1].push(a2); return [a1, b2]; }
      case 'alt': { const s0 = st(), [a1, b1] = build(n.a), [a2, b2] = build(n.b), f = st(); eps[s0].push(a1, a2); eps[b1].push(f); eps[b2].push(f); return [s0, f]; }
      case 'star': { const s0 = st(), [a, b] = build(n.a), f = st(); eps[s0].push(a, f); eps[b].push(a, f); return [s0, f]; }
      case 'plus': { const s0 = st(), [a, b] = build(n.a), f = st(); eps[s0].push(a); eps[b].push(a, f); return [s0, f]; }
      case 'opt': { const s0 = st(), [a, b] = build(n.a), f = st(); eps[s0].push(a, f); eps[b].push(f); return [s0, f]; }
    }
  };
  const [s0, f] = build(tree);
  // Renumber so states go 0, 1, 2 … in the order a walk from the start meets them (reads better in diagrams).
  const order: number[] = [], seen = new Array(eps.length).fill(false), queue = [s0]; seen[s0] = true;
  while (queue.length) { const x = queue.shift()!; order.push(x); for (const y of [...eps[x], ...moves[x].map((m) => m[1])]) if (!seen[y]) { seen[y] = true; queue.push(y); } }
  for (let x = 0; x < eps.length; x++) if (!seen[x]) order.push(x);
  const re = new Array(eps.length); order.forEach((x, k) => (re[x] = k));
  const accept = new Array(eps.length).fill(false); accept[re[f]] = true;
  return { n: eps.length, start: re[s0], accept, eps: order.map((x) => eps[x].map((y) => re[y])), moves: order.map((x) => moves[x].map(([c, y]) => [c, re[y]] as [number, number])), alphabet };
}
export function closure(nfa: NFA, states: Iterable<number>): number[] {
  const seen = new Set(states), stack = [...seen];
  while (stack.length) { const x = stack.pop()!; for (const y of nfa.eps[x]) if (!seen.has(y)) { seen.add(y); stack.push(y); } }
  return [...seen].sort((a, b) => a - b);
}
export function nfaStep(nfa: NFA, cur: number[], c: number): number[] {
  const next = new Set<number>(); for (const x of cur) for (const [cc, y] of nfa.moves[x]) if (cc === c) next.add(y);
  return closure(nfa, next);
}

// ---------- DFA ----------
/** delta[state][symbol] = next state, or −1 for "no move" (an implicit dead state). */
export type DFA = { n: number; start: number; accept: boolean[]; delta: number[][]; alphabet: string[]; names: string[]; sets?: number[][] };
/** Subset construction; the empty set becomes −1 (no move). */
export function subset(nfa: NFA): DFA {
  const key = (s: number[]) => s.join(',');
  const s0 = closure(nfa, [nfa.start]), sets = [s0], index = new Map([[key(s0), 0]]), delta: number[][] = [];
  for (let k = 0; k < sets.length; k++) {
    const row: number[] = [];
    for (let c = 0; c < nfa.alphabet.length; c++) {
      const t = nfaStep(nfa, sets[k], c);
      if (!t.length) { row.push(-1); continue; }
      let j = index.get(key(t));
      if (j === undefined) { if (sets.length >= LIMITS.dfa) throw new Error(`The DFA would need more than ${LIMITS.dfa} states.`); j = sets.length; sets.push(t); index.set(key(t), j); }
      row.push(j);
    }
    delta.push(row);
  }
  return { n: sets.length, start: 0, accept: sets.map((s) => s.some((x) => nfa.accept[x])), delta, alphabet: nfa.alphabet, names: sets.map((_, k) => String.fromCharCode(65 + (k % 26)) + (k >= 26 ? Math.floor(k / 26) : '')), sets };
}
/** Moore's algorithm: merge states that no string can tell apart. Unreachable states are dropped, then states are numbered in the order a breadth-first walk meets them. Missing moves stay missing (dead state left implicit). */
export function minimise(d: DFA): DFA {
  const m = d.alphabet.length, N = d.n + 1, DEAD = d.n; // add an explicit dead state
  const delta = d.delta.map((r) => r.map((x) => (x < 0 ? DEAD : x))); delta.push(new Array(m).fill(DEAD));
  const acc = [...d.accept, false];
  // Reachable from the start.
  const reach = new Array(N).fill(false), q = [d.start]; reach[d.start] = true;
  while (q.length) { const x = q.shift()!; for (const y of delta[x]) if (!reach[y]) { reach[y] = true; q.push(y); } }
  let cls = acc.map((a) => (a ? 1 : 0)), count = 0;
  for (;;) {
    const sig = new Map<string, number>(), next = new Array(N);
    for (let x = 0; x < N; x++) { if (!reach[x] && x !== DEAD) continue; const k = cls[x] + '|' + delta[x].map((y) => cls[y]).join(','); if (!sig.has(k)) sig.set(k, sig.size); next[x] = sig.get(k); }
    const c = sig.size; cls = next;
    if (c === count) break; count = c;
  }
  const deadCls = cls[DEAD];
  // Number classes in breadth-first order from the start, skipping the dead class.
  const num = new Map<number, number>(), reps: number[] = [], bq = [d.start];
  if (cls[d.start] !== deadCls) { num.set(cls[d.start], 0); reps.push(d.start); }
  const seenCls = new Set([cls[d.start]]);
  while (bq.length) { const x = bq.shift()!; for (const y of delta[x]) { const cy = cls[y]; if (!seenCls.has(cy)) { seenCls.add(cy); bq.push(y); if (cy !== deadCls) { num.set(cy, reps.length); reps.push(y); } } } }
  if (!reps.length) return { n: 1, start: 0, accept: [false], delta: [new Array(m).fill(-1)], alphabet: d.alphabet, names: ['0'] };
  return { n: reps.length, start: 0, accept: reps.map((x) => acc[x]), delta: reps.map((x) => delta[x].map((y) => (cls[y] === deadCls ? -1 : num.get(cls[y])!))), alphabet: d.alphabet, names: reps.map((_, k) => String(k)) };
}
export function dfaAccepts(d: DFA, w: string): boolean {
  let x = d.start;
  for (const ch of w) { const c = d.alphabet.indexOf(ch); if (c < 0) return false; x = d.delta[x][c]; if (x < 0) return false; }
  return d.accept[x];
}
export function nfaAccepts(nfa: NFA, w: string): boolean {
  let cur = closure(nfa, [nfa.start]);
  for (const ch of w) { const c = nfa.alphabet.indexOf(ch); if (c < 0) return false; cur = nfaStep(nfa, cur, c); if (!cur.length) return false; }
  return cur.some((x) => nfa.accept[x]);
}

/** Everything from a regex: tree, alphabet, NFA, DFA and minimal DFA. `extra` adds symbols to the alphabet. */
export function fromRegex(src: string, extra = ''): { tree: Node; alphabet: string[]; nfa: NFA; dfa: DFA; min: DFA } {
  const tree = parseRegex(src);
  const syms = symbolsOf(tree); for (const c of extra.replace(/[\s,]/g, '')) syms.add(c);
  const alphabet = [...syms].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!);
  if (!alphabet.length && needsAlphabet(tree)) throw new Error('The regex uses . or [^ ] but names no symbols: type the alphabet in the box below it.');
  if (alphabet.length > LIMITS.alphabet) throw new Error(`Up to ${LIMITS.alphabet} different symbols.`);
  const nfa = thompson(tree, alphabet), dfa = subset(nfa), min = minimise(dfa);
  return { tree, alphabet, nfa, dfa, min };
}

// ---------- Typed DFA ----------
/**
 * Read a DFA typed as lines: "start q0", "accept q2 q3", and moves "q0 a q1" (also "q0, a, q1", "q0 -a-> q1",
 * "q0 a,b q1" for several symbols). Missing moves go to an implicit dead state.
 */
export function parseDFA(text: string): DFA {
  const names: string[] = [], id = (s: string) => { let k = names.indexOf(s); if (k < 0) { k = names.length; names.push(s); } return k; };
  let start: number | null = null; const acc = new Set<number>(), moves: [number, string, number][] = [];
  text.replace(/\r/g, '').split('\n').forEach((raw, ln) => {
    const line = raw.replace(/#.*/, '').trim(); if (!line) return;
    const m1 = /^start\s*[:=]?\s*(\S+)$/i.exec(line);
    if (m1) { if (start !== null) throw new Error(`Line ${ln + 1}: only one start state.`); start = id(m1[1]); return; }
    const m2 = /^accept(?:ing)?\s*[:=]?\s*(.*)$/i.exec(line);
    if (m2) { m2[1].split(/[\s,]+/).filter(Boolean).forEach((s) => acc.add(id(s))); return; }
    const l = line.replace(/-([^\s-]+)->/g, ' $1 ').replace(/-+>/g, ' ').trim();
    let parts = l.split(/\s+/).map((p) => p.replace(/,$/, ''));
    if (parts.length !== 3) parts = l.split(',').map((p) => p.trim());
    if (parts.length !== 3 || parts.some((p) => !p)) throw new Error(`Line ${ln + 1}: "${line}" is not "state symbol next".`);
    const from = id(parts[0]), to = id(parts[2]);
    for (const sym of parts[1].split(',').filter((x) => x !== '')) {
      if ([...sym].length !== 1) throw new Error(`Line ${ln + 1}: symbols are single characters ("${sym}").`);
      moves.push([from, sym, to]);
    }
  });
  if (!moves.length) throw new Error('Type at least one move, such as q0 a q1.');
  if (start === null) start = moves.length ? moves[0][0] : 0;
  const alphabet = [...new Set(moves.map((m) => m[1]))].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!);
  if (alphabet.length > LIMITS.alphabet) throw new Error(`Up to ${LIMITS.alphabet} different symbols.`);
  if (names.length > LIMITS.dfa) throw new Error(`Up to ${LIMITS.dfa} states.`);
  const delta = names.map(() => new Array(alphabet.length).fill(-1));
  for (const [f, c, t] of moves) {
    const k = alphabet.indexOf(c);
    if (delta[f][k] >= 0 && delta[f][k] !== t) throw new Error(`State ${names[f]} has two moves on ${c}; a DFA has at most one.`);
    delta[f][k] = t;
  }
  return { n: names.length, start, accept: names.map((_, k) => acc.has(k)), delta, alphabet, names };
}
export function dfaText(d: DFA): string {
  const lines = [`start ${d.names[d.start]}`, `accept ${d.names.filter((_, k) => d.accept[k]).join(' ')}`];
  d.delta.forEach((r, x) => {
    const by = new Map<number, string[]>(); r.forEach((y, c) => { if (y >= 0) by.set(y, [...(by.get(y) ?? []), d.alphabet[c]]); });
    by.forEach((cs, y) => lines.push(`${d.names[x]} ${cs.join(',')} ${d.names[y]}`));
  });
  return lines.join('\n');
}

// ---------- The language ----------
/** Number of accepted strings of each length 0..L (exact, BigInt). */
export function countByLength(d: DFA, L: number): bigint[] {
  let v = new Array<bigint>(d.n).fill(0n); v[d.start] = 1n; const out: bigint[] = [];
  for (let l = 0; l <= L; l++) {
    out.push(v.reduce((s, x, k) => (d.accept[k] ? s + x : s), 0n));
    const nv = new Array<bigint>(d.n).fill(0n); v.forEach((x, k) => { if (x) for (const y of d.delta[k]) if (y >= 0) nv[y] += x; }); v = nv;
  }
  return out;
}
/** The first `max` accepted strings in length-then-alphabetical order. */
export function shortest(d: DFA, max = 10, maxLen = 30): string[] {
  const out: string[] = [];
  // States from which an accepting state can be reached ("live").
  const live = new Array(d.n).fill(false); d.accept.forEach((a, k) => (live[k] = a));
  for (let changed = true; changed;) { changed = false; for (let k = 0; k < d.n; k++) if (!live[k] && d.delta[k].some((y) => y >= 0 && live[y])) { live[k] = changed = true; } }
  if (!live[d.start]) return out;
  let layer: [number, string][] = [[d.start, '']];
  for (let l = 0; l <= maxLen && out.length < max; l++) {
    for (const [x, w] of layer) if (d.accept[x]) { out.push(w); if (out.length >= max) break; }
    const next: [number, string][] = [];
    for (const [x, w] of layer) d.delta[x].forEach((y, c) => { if (y >= 0 && live[y] && next.length < 5000) next.push([y, w + d.alphabet[c]]); });
    layer = next;
  }
  return out;
}
/** Is the language finite? (No cycle through states that are reachable and can still reach acceptance.) */
export function isFinite(d: DFA): boolean {
  const live = new Array(d.n).fill(false); d.accept.forEach((a, k) => (live[k] = a));
  for (let changed = true; changed;) { changed = false; for (let k = 0; k < d.n; k++) if (!live[k] && d.delta[k].some((y) => y >= 0 && live[y])) { live[k] = changed = true; } }
  const reach = new Array(d.n).fill(false), q = [d.start]; reach[d.start] = true;
  while (q.length) { const x = q.shift()!; for (const y of d.delta[x]) if (y >= 0 && !reach[y]) { reach[y] = true; q.push(y); } }
  const ok = (k: number) => live[k] && reach[k], colour = new Array(d.n).fill(0);
  const dfs = (x: number): boolean => { colour[x] = 1; for (const y of d.delta[x]) { if (y < 0 || !ok(y)) continue; if (colour[y] === 1) return true; if (colour[y] === 0 && dfs(y)) return true; } colour[x] = 2; return false; };
  return !(ok(d.start) && dfs(d.start));
}
/** Can every pair of states be told apart by some string? (Used to check minimality.) */
export function allDistinguishable(d: DFA): boolean {
  const DEAD = d.n, step = (x: number, c: number) => (x === DEAD ? DEAD : d.delta[x][c] < 0 ? DEAD : d.delta[x][c]);
  const acc = (x: number) => x !== DEAD && d.accept[x];
  for (let a = 0; a < d.n; a++) for (let b = a + 1; b < d.n; b++) {
    const seen = new Set([`${a},${b}`]), q: [number, number][] = [[a, b]]; let diff = false;
    while (q.length && !diff) { const [x, y] = q.shift()!; if (acc(x) !== acc(y)) { diff = true; break; } for (let c = 0; c < d.alphabet.length; c++) { const nx = step(x, c), ny = step(y, c), k = `${nx},${ny}`; if (!seen.has(k)) { seen.add(k); q.push([nx, ny]); } } }
    if (!diff) return false;
  }
  return true;
}
/** Short label for a set of symbols: "a-e, x". */
export function symLabel(syms: string[]): string {
  const cs = [...syms].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!), out: string[] = [];
  const show = (c: string) => (c === ' ' ? '␣' : c === '\t' ? '\\t' : c === '\n' ? '\\n' : c);
  for (let i = 0; i < cs.length;) {
    let j = i; while (j + 1 < cs.length && cs[j + 1].codePointAt(0)! === cs[j].codePointAt(0)! + 1) j++;
    out.push(j - i >= 2 ? `${show(cs[i])}-${show(cs[j])}` : cs.slice(i, j + 1).map(show).join(','));
    i = j + 1;
  }
  return out.join(',');
}
