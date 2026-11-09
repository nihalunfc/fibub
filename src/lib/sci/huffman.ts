// Huffman coding and arithmetic coding for #579 huffman-coding. Plain TypeScript, no DOM.
// Huffman: the two lightest nodes are merged first; ties go to the node made earliest (symbols in the order given,
// then merged nodes in the order made). The first node taken gets bit 0. Arithmetic coding is exact: every
// interval end is an integer over T^k (T = total of the integer counts), with BigInt, so nothing is rounded.
// Checked against a Python reference (heapq Huffman with the same tie rule, fractions.Fraction arithmetic coder)
// in tests/sci-tools/huffman-coding.mjs.

export type HNode = { id: number; w: number; sym?: string; left?: HNode; right?: HNode; depth?: number };
export type Code = { sym: string; w: number; p: number; code: string };
export type HuffResult = { root: HNode; codes: Code[]; avg: number; H: number; kraft: number; fixed: number; maxLen: number };

/** Huffman code for symbols with weights (counts or probabilities), in the order given. Zero weights are dropped. */
export function huffman(syms: string[], weights: number[], canonical = false): HuffResult {
  if (syms.length !== weights.length) throw new Error('Each symbol needs one weight.');
  if (new Set(syms).size !== syms.length) throw new Error('Each symbol may appear only once.');
  if (weights.some((w) => !(w >= 0) || !Number.isFinite(w))) throw new Error('Weights must be numbers at or above zero.');
  const items = syms.map((s, i) => ({ s, w: weights[i] })).filter((x) => x.w > 0);
  if (!items.length) throw new Error('Give at least one symbol with a weight above zero.');
  const total = items.reduce((a, b) => a + b.w, 0);
  let id = 0;
  const heap: HNode[] = items.map((x) => ({ id: id++, w: x.w, sym: x.s }));
  const less = (a: HNode, b: HNode) => a.w < b.w || (a.w === b.w && a.id < b.id);
  const take = () => { let k = 0; for (let i = 1; i < heap.length; i++) if (less(heap[i], heap[k])) k = i; return heap.splice(k, 1)[0]; };
  let root: HNode;
  if (heap.length === 1) root = { id: id++, w: heap[0].w, left: heap[0] };
  else {
    while (heap.length > 1) { const a = take(), b = take(); heap.push({ id: id++, w: a.w + b.w, left: a, right: b }); }
    root = heap[0];
  }
  const codeOf = new Map<string, string>();
  const walk = (n: HNode, c: string, d: number) => { n.depth = d; if (n.sym != null) { codeOf.set(n.sym, c || '0'); return; } if (n.left) walk(n.left, c + '0', d + 1); if (n.right) walk(n.right, c + '1', d + 1); };
  walk(root, '', 0);
  let codes: Code[] = items.map((x) => ({ sym: x.s, w: x.w, p: x.w / total, code: codeOf.get(x.s)! }));
  if (canonical) codes = canonicalCodes(codes);
  const avg = codes.reduce((a, c) => a + c.p * c.code.length, 0);
  const H = codes.reduce((a, c) => a - c.p * Math.log2(c.p), 0);
  return { root, codes, avg, H: Math.max(0, H), kraft: codes.reduce((a, c) => a + 2 ** -c.code.length, 0), fixed: items.length > 1 ? Math.ceil(Math.log2(items.length)) : 1, maxLen: Math.max(...codes.map((c) => c.code.length)) };
}

/** Canonical Huffman: the same lengths, codes given out in order of (length, symbol order). */
export function canonicalCodes(codes: Code[]): Code[] {
  const order = codes.map((c, i) => ({ c, i })).sort((a, b) => a.c.code.length - b.c.code.length || a.i - b.i);
  let v = 0n, len = order[0].c.code.length;
  const out = codes.slice();
  order.forEach(({ c, i }, k) => {
    if (k) { v += 1n; v <<= BigInt(c.code.length - len); len = c.code.length; }
    out[i] = { ...c, code: v.toString(2).padStart(len, '0') };
  });
  return out;
}

/** Split a message into symbols: characters, or space-separated words when any symbol is longer than one character. */
export function tokens(message: string, syms?: string[]): string[] {
  if (syms && syms.some((s) => [...s].length !== 1)) return message.split(/\s+/).filter(Boolean);
  return [...message];
}

/** Symbols of a message with their counts, in order of first appearance. */
export function countMessage(toks: string[]): { syms: string[]; counts: number[] } {
  const m = new Map<string, number>();
  for (const t of toks) m.set(t, (m.get(t) ?? 0) + 1);
  return { syms: [...m.keys()], counts: [...m.values()] };
}

export function encode(toks: string[], codes: Code[]): string {
  const m = new Map(codes.map((c) => [c.sym, c.code]));
  return toks.map((t) => { const c = m.get(t); if (c == null) throw new Error(`"${t}" has no code.`); return c; }).join('');
}

/** Decode a string of 0s and 1s (other characters ignored) with a prefix code. */
export function decode(bits: string, codes: Code[]): { toks: string[]; leftover: string } {
  const b = bits.replace(/[^01]/g, '');
  const m = new Map(codes.map((c) => [c.code, c.sym]));
  const maxLen = Math.max(...codes.map((c) => c.code.length));
  const toks: string[] = [];
  let cur = '';
  for (const ch of b) {
    cur += ch;
    const s = m.get(cur);
    if (s != null) { toks.push(s); cur = ''; }
    else if (cur.length >= maxLen) throw new Error(`The bits ${cur} after symbol ${toks.length} are not a code word.`);
  }
  return { toks, leftover: cur };
}

// ---------- Arithmetic coding, exact ----------
const gcd = (a: bigint, b: bigint): bigint => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };

/** Weights typed as decimals or fractions turned into whole-number counts with a common scale. */
export function toIntegerCounts(weights: string[]): bigint[] {
  const fr = weights.map((w) => {
    const t = w.trim();
    let m = /^(\d+)\/(\d+)$/.exec(t);
    if (m) { if (BigInt(m[2]) === 0n) throw new Error(`${t}: cannot divide by zero.`); return [BigInt(m[1]), BigInt(m[2])]; }
    m = /^(\d*)(?:\.(\d+))?$/.exec(t);
    if (!m || (!m[1] && !m[2])) throw new Error(`"${t}" is not a weight. Use numbers like 0.25, 3 or 1/3.`);
    const dec = m[2] ?? '';
    return [BigInt((m[1] || '0') + dec), 10n ** BigInt(dec.length)];
  });
  let L = 1n;
  for (const [, d] of fr) L = (L / gcd(L, d)) * d;
  const c = fr.map(([n, d]) => (n * L) / d);
  let g = 0n; for (const x of c) g = gcd(g, x);
  return g > 0n ? c.map((x) => x / g) : c;
}

export type ArithStep = { sym: string; lowN: bigint; highN: bigint; den: bigint };
export type ArithResult = {
  steps: ArithStep[]; lowN: bigint; highN: bigint; den: bigint; bits: string; tagN: bigint; info: number; bound: number;
};

/**
 * Arithmetic-code a message with a fixed model (symbols and integer counts). After step k the interval is
 * [lowN, highN) / T^k. The code is the shortest bit string b whose whole dyadic interval [0.b, 0.b + 2^-len)
 * lies inside the final interval, so it needs at most ⌈log₂(1/P)⌉ + 1 bits, P the message's probability.
 */
export function arithEncode(toks: string[], syms: string[], counts: bigint[]): ArithResult {
  const T = counts.reduce((a, b) => a + b, 0n);
  if (T <= 0n) throw new Error('The model needs at least one count above zero.');
  const idx = new Map(syms.map((s, i) => [s, i]));
  const cum: bigint[] = [0n]; for (const c of counts) cum.push(cum[cum.length - 1] + c);
  let low = 0n, high = 1n, den = 1n;
  const steps: ArithStep[] = [];
  for (const t of toks) {
    const i = idx.get(t);
    if (i == null) throw new Error(`"${t}" is not in the model.`);
    if (counts[i] === 0n) throw new Error(`"${t}" has probability zero, so it cannot be coded.`);
    const r = high - low;
    [low, high] = [low * T + r * cum[i], low * T + r * cum[i + 1]];
    den *= T;
    steps.push({ sym: t, lowN: low, highN: high, den });
  }
  // Shortest dyadic interval inside [low, high) / den.
  let b = 0, m = 0n;
  for (;; b++) {
    const p = 1n << BigInt(b);
    m = (low * p + den - 1n) / den; // ceil
    if ((m + 1n) * den <= high * p) break;
  }
  const bits = b ? m.toString(2).padStart(b, '0') : '';
  const info = -log2ratio(high - low, den);
  return { steps, lowN: low, highN: high, den, bits, tagN: m, info, bound: Math.ceil(info - 1e-12) + 1 };
}

/** Decode n symbols from arithmetic-code bits with the same model. */
export function arithDecode(bits: string, n: number, syms: string[], counts: bigint[]): string[] {
  const b = bits.replace(/[^01]/g, '');
  const T = counts.reduce((a, c) => a + c, 0n);
  const cum: bigint[] = [0n]; for (const c of counts) cum.push(cum[cum.length - 1] + c);
  // Tag v = vN / 2^len; interval [low, high) / den. Symbol i fits when low + r cum[i]/T <= v < low + r cum[i+1]/T.
  const vN = b ? BigInt('0b' + b) : 0n, P = 1n << BigInt(b.length);
  let low = 0n, high = 1n, den = 1n;
  const out: string[] = [];
  for (let k = 0; k < n; k++) {
    const r = high - low;
    let found = -1;
    for (let i = 0; i < syms.length; i++) {
      if (counts[i] === 0n) continue;
      const lo = low * T + r * cum[i], hi = low * T + r * cum[i + 1], d = den * T;
      if (lo * P <= vN * d && vN * d < hi * P) { found = i; [low, high, den] = [lo, hi, d]; break; }
    }
    if (found < 0) throw new Error('These bits do not fall inside any symbol\'s interval.');
    out.push(syms[found]);
  }
  return out;
}

/** log₂(a / b) for positive BigInts of any size. */
export function log2ratio(a: bigint, b: bigint): number {
  const ea = Math.max(0, a.toString(2).length - 60), eb = Math.max(0, b.toString(2).length - 60);
  return Math.log2(Number(a >> BigInt(ea))) - Math.log2(Number(b >> BigInt(eb))) + ea - eb;
}

/** n / d as a decimal string with `digits` digits after the point (truncated), for 0 ≤ n/d ≤ 1. */
export function decimal(n: bigint, d: bigint, digits = 12): string {
  const ip = n / d; let r = n % d, s = ip.toString() + '.';
  for (let i = 0; i < digits; i++) { r *= 10n; s += (r / d).toString(); r %= d; }
  return s;
}
/** n / d reduced, as text. */
export function fraction(n: bigint, d: bigint): string {
  const g = gcd(n, d) || 1n;
  return `${n / g}/${d / g}`;
}

export const EXAMPLE_MESSAGE = 'abracadabra';
export const EXAMPLE_LONG = 'she sells sea shells by the sea shore';
