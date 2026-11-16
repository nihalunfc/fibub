// School sets (Class 11 maths): read set expressions such as (A ∪ B)′ ∩ C, work out which regions of a
// 2- or 3-set Venn diagram they cover, apply them to real lists of elements, and count with
// n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Plain TypeScript, no DOM.
//
// Regions are numbered by a bit mask: bit 0 = in A, bit 1 = in B, bit 2 = in C. Region 0 is outside them all.

export type SetNode = { t: 'set'; i: number } | { t: 'U' } | { t: 'empty' } | { t: 'not'; a: SetNode } | { t: 'op'; op: 'or' | 'and' | 'minus' | 'xor'; a: SetNode; b: SetNode };

type Tok = { k: 'set' | 'U' | 'empty' | 'or' | 'and' | 'minus' | 'xor' | 'not' | '(' | ')'; i?: number; at: number };
function lex(src: string, n: number): Tok[] {
  const out: Tok[] = [];
  const s = src.replace(/\s+/g, ' ');
  let i = 0;
  while (i < s.length) {
    const ch = s[i], rest = s.slice(i);
    if (ch === ' ') { i++; continue; }
    const word = /^(or|and|union|intersect|not)\b/i.exec(rest);
    if (word) { const w = word[1].toLowerCase(); out.push({ k: w === 'or' || w === 'union' ? 'or' : w === 'not' ? 'not' : 'and', at: i }); i += w.length; continue; }
    if (/[ABCabc]/.test(ch)) {
      const idx = 'abc'.indexOf(ch.toLowerCase());
      if (idx >= n) throw new Error(`There is no set ${ch.toUpperCase()} with ${n} sets. Switch to 3 sets to use C.`);
      out.push({ k: 'set', i: idx, at: i }); i++; continue;
    }
    if (ch === 'U' || ch === 'ξ' || ch === 'Ω') { out.push({ k: 'U', at: i }); i++; continue; }
    if (ch === '∅' || ch === 'φ' || ch === 'ϕ' || ch === 'Ø' || ch === 'ø') { out.push({ k: 'empty', at: i }); i++; continue; }
    if (rest.startsWith('{}')) { out.push({ k: 'empty', at: i }); i += 2; continue; }
    if ('∪u|+'.includes(ch)) { out.push({ k: 'or', at: i }); i++; continue; }
    if ('∩n&^.'.includes(ch)) { out.push({ k: 'and', at: i }); i++; continue; }
    if ('-−–\\'.includes(ch)) { out.push({ k: 'minus', at: i }); i++; continue; }
    if ('Δ∆△'.includes(ch)) { out.push({ k: 'xor', at: i }); i++; continue; }
    if ("'′’ᶜ".includes(ch)) { out.push({ k: 'not', at: i }); i++; continue; }
    if ('([{'.includes(ch)) { out.push({ k: '(', at: i }); i++; continue; }
    if (')]}'.includes(ch)) { out.push({ k: ')', at: i }); i++; continue; }
    throw new Error(`"${ch}" is not a set or a set sign. Use A, B, C, U, ∪, ∩, ′ (or '), − and brackets.`);
  }
  return out;
}

/** Read a set expression. ′ (complement) binds tightest, then ∩, then ∪, − and Δ from left to right. */
export function parseSet(src: string, n: 2 | 3): SetNode {
  const toks = lex(src, n);
  if (!toks.length) throw new Error('Type a set expression, such as (A ∪ B)′ ∩ C.');
  let p = 0;
  const peek = () => toks[p];
  const atom = (): SetNode => {
    const t = toks[p];
    if (!t) throw new Error('The expression stops too soon: something is missing at the end.');
    if (t.k === 'not') { p++; return { t: 'not', a: atom() }; } // "not A" written in front
    let node: SetNode;
    if (t.k === 'set') { p++; node = { t: 'set', i: t.i! }; }
    else if (t.k === 'U') { p++; node = { t: 'U' }; }
    else if (t.k === 'empty') { p++; node = { t: 'empty' }; }
    else if (t.k === '(') {
      p++; node = union();
      if (peek()?.k !== ')') throw new Error('A bracket is opened but never closed.');
      p++;
    } else throw new Error(`Expected a set (A, B${n === 3 ? ', C' : ''} or U) but found a sign.`);
    while (peek()?.k === 'not') { p++; node = { t: 'not', a: node }; }
    return node;
  };
  const inter = (): SetNode => { let a = atom(); while (peek()?.k === 'and') { p++; a = { t: 'op', op: 'and', a, b: atom() }; } return a; };
  const union = (): SetNode => {
    let a = inter();
    while (peek() && (peek().k === 'or' || peek().k === 'minus' || peek().k === 'xor')) { const op = peek().k as 'or' | 'minus' | 'xor'; p++; a = { t: 'op', op, a, b: inter() }; }
    return a;
  };
  const tree = union();
  if (p < toks.length) throw new Error(toks[p].k === ')' ? 'There is a closing bracket with no opening one.' : 'Two sets are next to each other: put ∪, ∩ or − between them.');
  return tree;
}

/** Is region r (bit mask) inside the set the expression describes? */
export function inRegion(node: SetNode, r: number): boolean {
  switch (node.t) {
    case 'set': return ((r >> node.i) & 1) === 1;
    case 'U': return true;
    case 'empty': return false;
    case 'not': return !inRegion(node.a, r);
    case 'op': { const a = inRegion(node.a, r), b = inRegion(node.b, r); return node.op === 'or' ? a || b : node.op === 'and' ? a && b : node.op === 'minus' ? a && !b : a !== b; }
  }
}
/** The regions (0 … 2ⁿ − 1) an expression covers. */
export const regions = (node: SetNode, n: 2 | 3) => Array.from({ length: 1 << n }, (_, r) => r).filter((r) => inRegion(node, r));
export const sameRegions = (a: SetNode, b: SetNode, n: 2 | 3) => Array.from({ length: 1 << n }, (_, r) => inRegion(a, r) === inRegion(b, r)).every(Boolean);

/** Name of a region, such as "A ∩ B′ ∩ C" or "outside all". */
export function regionName(r: number, n: 2 | 3): string {
  if (r === 0) return n === 2 ? 'outside A and B' : 'outside A, B and C';
  return Array.from({ length: n }, (_, i) => 'ABC'[i] + ((r >> i) & 1 ? '' : '′')).join(' ∩ ');
}

/** Read a list of elements: "1, 2, 5-9, red". Ranges of whole numbers are expanded (up to 500 items). */
export function parseList(src: string): string[] {
  const out: string[] = [];
  for (const raw of src.replace(/[{}]/g, '').split(/[,;\s]+/)) {
    const s = raw.trim();
    if (!s) continue;
    const m = /^(-?\d+)\s*(?:-|–|\.\.)\s*(-?\d+)$/.exec(s);
    if (m) { const a = +m[1], b = +m[2]; if (b < a || b - a > 500) throw new Error(`The range ${s} is too long or backwards.`); for (let k = a; k <= b; k++) out.push(String(k)); }
    else out.push(s);
  }
  const seen = new Set<string>();
  return out.filter((x) => (seen.has(x) ? false : (seen.add(x), true)));
}

/** Apply an expression to real lists. Elements of A, B, C must be in U; missing ones are reported. */
export function applySets(node: SetNode, U: string[], sets: string[][]) {
  const all = new Set(U);
  const notInU = [...new Set(sets.flat())].filter((x) => !all.has(x));
  const region = (x: string) => sets.reduce((m, s, i) => m | (s.includes(x) ? 1 << i : 0), 0);
  const byRegion: string[][] = Array.from({ length: 1 << sets.length }, () => []);
  for (const x of U) byRegion[region(x)].push(x);
  const result = U.filter((x) => inRegion(node, region(x)));
  return { result, byRegion, notInU };
}

/** n(A ∪ B) and n(A ∪ B ∪ C) by inclusion and exclusion. */
export const union2 = (a: number, b: number, ab: number) => a + b - ab;
export const union3 = (a: number, b: number, c: number, ab: number, bc: number, ac: number, abc: number) => a + b + c - ab - bc - ac + abc;

/** Write an expression back out with proper signs. */
export function show(node: SetNode, top = true): string {
  switch (node.t) {
    case 'set': return 'ABC'[node.i];
    case 'U': return 'U';
    case 'empty': return '∅';
    case 'not': return node.a.t === 'op' ? `(${show(node.a, true)})′` : `${show(node.a, false)}′`;
    case 'op': { const s = `${show(node.a, false)} ${{ or: '∪', and: '∩', minus: '−', xor: 'Δ' }[node.op]} ${show(node.b, false)}`; return top ? s : `(${s})`; }
  }
}

/** Counting problem: numbers typed for n(A), n(B), ... (NaN or undefined when left blank). */
export type CountInput = { U?: number; A?: number; B?: number; C?: number; AB?: number; BC?: number; AC?: number; ABC?: number; union?: number; allIn?: boolean };
export type CountResult = { regions?: number[]; sentence: string; steps: string[]; error?: string };

const has = (x: number | undefined): x is number => x !== undefined && Number.isFinite(x);
const whole = (x: number) => Number.isInteger(x) && x >= 0;
const fixed = (x: number) => String(x);

/** Solve a school counting problem with 2 or 3 sets by inclusion-exclusion, filling in the one missing number. */
export function countProblem(n: 2 | 3, v: CountInput): CountResult {
  const bad = (error: string): CountResult => ({ sentence: error, steps: [], error });
  const nums = [v.U, v.A, v.B, v.C, v.AB, v.BC, v.AC, v.ABC, v.union].filter(has);
  if (nums.some((x) => !whole(x))) return bad('Counts must be whole numbers, 0 or more.');
  let union = has(v.union) ? v.union : undefined;
  if (v.allIn) { if (!has(v.U)) return bad('To say everyone is in at least one set, fill in n(U) as well.'); union = v.U; }
  const steps: string[] = [];
  if (n === 2) {
    let { A, B, AB } = v;
    const miss = [['n(A)', A], ['n(B)', B], ['n(A ∩ B)', AB], ['n(A ∪ B)', union]].filter(([, x]) => !has(x as number | undefined)).map(([k]) => k as string);
    if (miss.length > 1) return bad(`Fill in three of n(A), n(B), n(A ∩ B) and n(A ∪ B). Still empty: ${miss.join(', ')}.`);
    if (miss.length === 1) {
      if (!has(union)) { union = A! + B! - AB!; steps.push(`n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${A} + ${B} − ${AB} = ${union}.`); }
      else if (!has(AB)) { AB = A! + B! - union; steps.push(`n(A ∩ B) = n(A) + n(B) − n(A ∪ B) = ${A} + ${B} − ${union} = ${AB}.`); }
      else if (!has(A)) { A = union - B! + AB; steps.push(`n(A) = n(A ∪ B) − n(B) + n(A ∩ B) = ${union} − ${B} + ${AB} = ${A}.`); }
      else { B = union - A + AB; steps.push(`n(B) = n(A ∪ B) − n(A) + n(A ∩ B) = ${union} − ${A} + ${AB} = ${B}.`); }
    } else if (A! + B! - AB! !== union) return bad(`These do not fit: n(A) + n(B) − n(A ∩ B) = ${A! + B! - AB!}, not ${union}.`);
    const a = A!, b = B!, ab = AB!, u = union!;
    if (ab > a || ab > b) return bad('n(A ∩ B) cannot be bigger than n(A) or n(B).');
    if (u < 0 || a < 0 || b < 0 || ab < 0) return bad('A count came out negative, so these numbers cannot all be true.');
    if (has(v.U) && u > v.U) return bad(`n(A ∪ B) = ${u} is bigger than n(U) = ${v.U}, so the numbers cannot all be true.`);
    const regions = [has(v.U) ? v.U - u : 0, a - ab, b - ab, ab];
    steps.push(`Only A = n(A) − n(A ∩ B) = ${a} − ${ab} = ${a - ab}. Only B = ${b} − ${ab} = ${b - ab}. Both = ${ab}.`);
    if (has(v.U)) steps.push(`Neither = n(U) − n(A ∪ B) = ${v.U} − ${u} = ${v.U - u}.`);
    const sentence = `n(A ∪ B) = ${u}${has(v.U) ? `, and ${v.U - u} are in neither set` : ''}. n(A ∩ B) = ${ab}, only A = ${a - ab}, only B = ${b - ab}.`;
    return { regions, sentence, steps };
  }
  const { A, B, C, AB, BC, AC } = v; let ABC = v.ABC;
  const miss = [['n(A)', A], ['n(B)', B], ['n(C)', C], ['n(A ∩ B)', AB], ['n(B ∩ C)', BC], ['n(A ∩ C)', AC]].filter(([, x]) => !has(x as number | undefined)).map(([k]) => k as string);
  if (miss.length) return bad(`Fill in ${miss.join(', ')}. Only n(A ∩ B ∩ C) may be left empty, and then n(A ∪ B ∪ C) or "everyone is in at least one" is needed.`);
  const base = A! + B! + C! - AB! - BC! - AC!;
  if (!has(ABC)) {
    if (!has(union)) return bad('Fill in n(A ∩ B ∩ C), or give n(A ∪ B ∪ C) so it can be found.');
    ABC = union - base; steps.push(`n(A ∩ B ∩ C) = n(A ∪ B ∪ C) − [n(A) + n(B) + n(C) − n(A ∩ B) − n(B ∩ C) − n(A ∩ C)] = ${union} − ${base} = ${ABC}.`);
  } else {
    const u2 = base + ABC;
    if (has(union) && union !== u2) return bad(`These do not fit: the formula gives n(A ∪ B ∪ C) = ${u2}, not ${union}.`);
    union = u2; steps.push(`n(A ∪ B ∪ C) = ${A} + ${B} + ${C} − ${AB} − ${BC} − ${AC} + ${ABC} = ${u2}.`);
  }
  const t = ABC!, ab = AB! - t, bc = BC! - t, ac = AC! - t, a = A! - ab - ac - t, b = B! - ab - bc - t, c = C! - ac - bc - t;
  const regions = [has(v.U) ? v.U - union! : 0, a, b, ab, c, ac, bc, t];
  if (t < 0 || regions.slice(1).some((x) => x < 0)) return bad('One region came out negative, so these numbers cannot all be true. Check the pair counts against the single counts.');
  if (has(v.U) && union! > v.U) return bad(`n(A ∪ B ∪ C) = ${union} is bigger than n(U) = ${v.U}, so the numbers cannot all be true.`);
  steps.push(`Pairs only (outside the middle): A∩B only = ${AB} − ${t} = ${ab}, B∩C only = ${bc}, A∩C only = ${ac}.`);
  steps.push(`Singles only: A only = ${A} − ${ab} − ${ac} − ${t} = ${a}, B only = ${b}, C only = ${c}.`);
  if (has(v.U)) steps.push(`Neither = n(U) − n(A ∪ B ∪ C) = ${v.U} − ${union} = ${v.U - union!}.`);
  return { regions, sentence: `n(A ∪ B ∪ C) = ${fixed(union!)}${has(v.U) ? `, and ${v.U - union!} are in none of the sets` : ''}. n(A ∩ B ∩ C) = ${t}.`, steps };
}
