// One-one and onto (Class 12 maths, relations and functions): a function's graph on a chosen domain, its range,
// the horizontal line test, and whether it is one-one, onto a chosen codomain, and so has an inverse.
// The graph is cut into pieces on which the function only rises or only falls (at turning points and at gaps in
// the domain); the range is the union of the pieces' value intervals, worked out from end values and limits.
// Plain TypeScript, no DOM.

export type Interval = { lo: number; hi: number; loC: boolean; hiC: boolean };
export type Seg = Interval & { vlo: number; vhi: number };
export type Preset = {
  id: string; label: string; f: (x: number) => number;
  natural: Interval;                 // where the formula makes sense
  breaks: number[];                  // points left out of the natural domain inside it (1/x at 0)
  turning: (lo: number, hi: number) => number[]; // turning points strictly inside (lo, hi)
  lim: (a: number, side: -1 | 1) => number;      // limit as x → a from the left (−1) or right (+1); NaN if none
  period?: number;
};

const R: Interval = { lo: -Infinity, hi: Infinity, loC: false, hiC: false };
const inside = (xs: number[], lo: number, hi: number) => xs.filter((x) => x > lo && x < hi);
const atInf = (minus: number, plus: number) => (a: number, f: (x: number) => number) => (a === -Infinity ? minus : a === Infinity ? plus : f(a));

function mk(id: string, label: string, f: (x: number) => number, turn: number[], inf: [number, number], extra: Partial<Preset> = {}): Preset {
  const li = atInf(inf[0], inf[1]);
  return { id, label, f, natural: R, breaks: [], turning: (lo, hi) => inside(turn, lo, hi), lim: (a) => li(a, f), ...extra };
}

export const PRESETS: Preset[] = [
  mk('lin', '2x + 1', (x) => 2 * x + 1, [], [-Infinity, Infinity]),
  mk('sq', 'x²', (x) => x * x, [0], [Infinity, Infinity]),
  mk('cube', 'x³', (x) => x ** 3, [], [-Infinity, Infinity]),
  mk('cubic', 'x³ − 3x', (x) => x ** 3 - 3 * x, [-1, 1], [-Infinity, Infinity]),
  mk('abs', '|x|', Math.abs, [0], [Infinity, Infinity]),
  mk('exp', 'eˣ', Math.exp, [], [0, Infinity]),
  mk('ln', 'ln x', Math.log, [], [NaN, Infinity], {
    natural: { lo: 0, hi: Infinity, loC: false, hiC: false },
    lim: (a) => (a === 0 ? -Infinity : a === Infinity ? Infinity : Math.log(a)),
  }),
  mk('sin', 'sin x', Math.sin, [], [NaN, NaN], {
    turning: (lo, hi) => { const out: number[] = []; for (let k = Math.ceil((lo - Math.PI / 2) / Math.PI); Math.PI / 2 + k * Math.PI < hi; k++) { const x = Math.PI / 2 + k * Math.PI; if (x > lo) out.push(x); } return out; },
    lim: (a) => (Number.isFinite(a) ? Math.sin(a) : NaN), period: 2 * Math.PI,
  }),
  mk('recip', '1/x', (x) => 1 / x, [], [0, 0], {
    breaks: [0],
    lim: (a, side) => (a === 0 ? (side < 0 ? -Infinity : Infinity) : Number.isFinite(a) ? 1 / a : 0),
  }),
];

/** Intersect two intervals; null when empty. */
export function intersect(a: Interval, b: Interval): Interval | null {
  let lo = a.lo, loC = a.loC, hi = a.hi, hiC = a.hiC;
  if (b.lo > lo || (b.lo === lo && !b.loC)) { lo = b.lo; loC = b.loC && (b.lo !== a.lo || a.loC); }
  if (b.hi < hi || (b.hi === hi && !b.hiC)) { hi = b.hi; hiC = b.hiC && (b.hi !== a.hi || a.hiC); }
  if (!Number.isFinite(lo)) loC = false; if (!Number.isFinite(hi)) hiC = false;
  if (lo > hi || (lo === hi && !(loC && hiC))) return null;
  return { lo, hi, loC, hiC };
}

/** Cut the domain into pieces on which f only rises or only falls, with each end's value or limit. */
export function segments(p: Preset, dom: Interval): Seg[] {
  let d = intersect(dom, p.natural);
  if (!d) return [];
  if (p.period) { // a periodic function repeats, so a long stretch shows every value: cap infinite ends
    const cap = 20 * p.period;
    d = { lo: Number.isFinite(d.lo) ? d.lo : -cap, hi: Number.isFinite(d.hi) ? d.hi : cap, loC: Number.isFinite(d.lo) ? d.loC : true, hiC: Number.isFinite(d.hi) ? d.hiC : true };
  }
  const cuts: { x: number; kind: 'break' | 'turn' }[] = [
    ...inside(p.breaks, d.lo, d.hi).map((x) => ({ x, kind: 'break' as const })),
    ...p.turning(d.lo, d.hi).map((x) => ({ x, kind: 'turn' as const })),
  ].sort((a, b) => a.x - b.x);
  const out: Seg[] = [];
  let lo = d.lo, loC = d.loC;
  const val = (x: number, closed: boolean, side: -1 | 1) => (closed ? p.f(x) : p.lim(x, side));
  for (const c of [...cuts, { x: d.hi, kind: 'end' as const }]) {
    const hi = c.x, hiC = c.kind === 'turn' ? true : c.kind === 'break' ? false : d.hiC;
    if (hi > lo || (hi === lo && loC && hiC)) out.push({ lo, hi, loC, hiC, vlo: val(lo, loC, 1), vhi: val(hi, hiC, -1) });
    lo = hi; loC = c.kind === 'turn';
  }
  return out;
}

/** The value interval a monotone piece covers. Ends that are only approached (limits, open ends) are open. */
export function segRange(s: Seg): Interval {
  const aC = s.loC && Number.isFinite(s.vlo), bC = s.hiC && Number.isFinite(s.vhi);
  return s.vlo <= s.vhi ? { lo: s.vlo, hi: s.vhi, loC: aC, hiC: bC } : { lo: s.vhi, hi: s.vlo, loC: bC, hiC: aC };
}

/** Join overlapping or touching intervals (touching only if one of them holds the shared point). */
export function merge(list: Interval[]): Interval[] {
  const a = list.filter((i) => i.lo < i.hi || (i.lo === i.hi && i.loC && i.hiC)).map((i) => ({ ...i })).sort((p, q) => p.lo - q.lo || Number(q.loC) - Number(p.loC));
  const out: Interval[] = [];
  for (const i of a) {
    const last = out[out.length - 1];
    if (last && (i.lo < last.hi || (i.lo === last.hi && (i.loC || last.hiC)))) {
      if (i.hi > last.hi) { last.hi = i.hi; last.hiC = i.hiC; } else if (i.hi === last.hi && i.hiC) last.hiC = true;
      if (i.lo === last.lo && i.loC) last.loC = true;
    } else out.push(i);
  }
  return out;
}

export const covers = (big: Interval, small: Interval) =>
  (big.lo < small.lo || (big.lo === small.lo && (big.loC || !small.loC))) && (big.hi > small.hi || (big.hi === small.hi && (big.hiC || !small.hiC)));

/** Solve f(x) = y on one monotone piece (y must lie in its range). */
export function solveIn(p: Preset, s: Seg, y: number): number {
  const g = (x: number) => p.f(x) - y;
  const nudge = (x: number, dir: number) => x + dir * 1e-12 * Math.max(1, Math.abs(x));
  let a = Number.isFinite(s.lo) ? (s.loC ? s.lo : nudge(s.lo, 1)) : NaN, b = Number.isFinite(s.hi) ? (s.hiC ? s.hi : nudge(s.hi, -1)) : NaN;
  const up = s.vhi > s.vlo;
  const want = (x: number, end: 'lo' | 'hi') => { const v = g(x); return end === 'hi' ? (up ? v >= 0 : v <= 0) : (up ? v <= 0 : v >= 0); };
  if (Number.isNaN(a)) { const base = Number.isFinite(b) ? b : 0; let d = 1; a = base - d; while (!want(a, 'lo') && d < 1e15) { d *= 2; a = base - d; } }
  if (Number.isNaN(b)) { const base = Number.isFinite(a) ? a : 0; let d = 1; b = base + d; while (!want(b, 'hi') && d < 1e15) { d *= 2; b = base + d; } }
  if (Math.abs(g(a)) === 0) return a; if (Math.abs(g(b)) === 0) return b;
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (m === a || m === b) break;
    const v = g(m);
    if (!Number.isFinite(v)) { a = m; continue; }
    if ((v < 0) === up) a = m; else b = m;
  }
  const r = (a + b) / 2;
  return Math.abs(r) < 1e-12 ? 0 : r;
}

const inRange = (r: Interval, y: number) => (y > r.lo || (y === r.lo && r.loC)) && (y < r.hi || (y === r.hi && r.hiC));

/** Where the horizontal line y = k meets the graph (sorted, no repeats). */
export function crossings(p: Preset, segs: Seg[], k: number): number[] {
  const xs: number[] = [];
  for (const s of segs) {
    const r = segRange(s);
    if (r.lo === r.hi) { if (r.lo === k) xs.push(s.lo); continue; }
    if (inRange(r, k)) { const x = solveIn(p, s, k); if (!xs.some((z) => Math.abs(z - x) < 1e-7 * Math.max(1, Math.abs(x)))) xs.push(x); }
  }
  return xs.sort((a, b) => a - b);
}

export type Verdict = { range: Interval[]; oneOne: boolean; pair: [number, number] | null; onto: boolean; missed: number | null; empty: boolean };

/** One-one (with two x that share a y if not), range, and onto the codomain (with a missed y if not). */
export function analyse(p: Preset, dom: Interval, codomain: Interval | 'range'): Verdict {
  const segs = segments(p, dom);
  if (!segs.length) return { range: [], oneOne: true, pair: null, onto: codomain === 'range', missed: null, empty: true };
  const ranges = segs.map(segRange);
  const range = merge(ranges);
  let pair: [number, number] | null = null;
  // Look for a repeated value near x = 0 first, so the example is easy to read.
  const mid = (s: Seg) => Math.abs(Number.isFinite(s.lo) && Number.isFinite(s.hi) ? (s.lo + s.hi) / 2 : Number.isFinite(s.lo) ? s.lo : Number.isFinite(s.hi) ? s.hi : 0);
  const pairs: [number, number][] = [];
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) pairs.push([i, j]);
  pairs.sort((u, v) => mid(segs[u[0]]) + mid(segs[u[1]]) - mid(segs[v[0]]) - mid(segs[v[1]]));
  for (const [i, j] of pairs) {
    if (pair) break;
    const a = ranges[i], b = ranges[j], lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
    let y = NaN;
    if (lo < hi) y = Number.isFinite(lo) && Number.isFinite(hi) ? (lo + hi) / 2 : Number.isFinite(lo) ? lo + 1 : Number.isFinite(hi) ? hi - 1 : 0;
    else if (lo === hi && inRange(a, lo) && inRange(b, lo)) y = lo;
    if (Number.isNaN(y)) continue;
    const x1 = solveIn(p, segs[i], y), x2 = solveIn(p, segs[j], y);
    if (Math.abs(x1 - x2) > 1e-7 * Math.max(1, Math.abs(x1))) pair = [x1, x2];
  }
  let onto = true, missed: number | null = null;
  if (codomain !== 'range') {
    onto = range.some((r) => covers(r, codomain));
    if (!onto) missed = missedValue(range, codomain);
  }
  return { range, oneOne: !pair, pair, onto, missed, empty: false };
}

/** A y in the codomain that the range misses. */
export function missedValue(range: Interval[], c: Interval): number | null {
  const cands: number[] = [];
  if (Number.isFinite(c.lo)) cands.push(c.lo); if (Number.isFinite(c.hi)) cands.push(c.hi);
  for (const r of range) { if (Number.isFinite(r.lo)) cands.push(r.lo, r.lo - 1, r.lo - 0.5); if (Number.isFinite(r.hi)) cands.push(r.hi, r.hi + 1, r.hi + 0.5); }
  cands.push(0, -1, 1);
  for (const y of cands) if (inRange(c, y) && !range.some((r) => inRange(r, y))) return y;
  return null;
}

/** Interval as text, e.g. [0, ∞) or (−∞, 0) ∪ (0, ∞). */
export function show(i: Interval, num: (x: number) => string = (x) => niceNum(x)): string {
  const n = (x: number) => (x === Infinity ? '∞' : x === -Infinity ? '−∞' : num(x));
  if (i.lo === i.hi) return `{${n(i.lo)}}`;
  if (i.lo === -Infinity && i.hi === Infinity) return 'ℝ';
  return `${i.loC ? '[' : '('}${n(i.lo)}, ${n(i.hi)}${i.hiC ? ']' : ')'}`;
}
/** Numbers as people write them: multiples of π/12 as π fractions, others to 4 decimals. */
export function niceNum(x: number): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞';
  const k = (x / Math.PI) * 12, r = Math.round(k);
  if (r !== 0 && Math.abs(k - r) < 1e-9) {
    const g = (a: number, b: number): number => (b ? g(b, a % b) : a), d = g(Math.abs(r), 12), p = r / d, q = 12 / d;
    const top = `${p < 0 ? '−' : ''}${Math.abs(p) === 1 ? '' : Math.abs(p)}π`;
    return q === 1 ? top : `${top}/${q}`;
  }
  return String(+x.toFixed(4)).replace('-', '−');
}
export const showSet = (list: Interval[], num?: (x: number) => string) => (list.length ? list.map((i) => show(i, num)).join(' ∪ ') : '∅');

/** A typed function on a closed interval [a, b], with turning points and gaps found by sampling. */
export function numericPreset(f: (x: number) => number, a: number, b: number, label = 'f(x)', n = 4000): Preset {
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; xs.push(x); ys.push(f(x)); }
  const finite = ys.filter(Number.isFinite).map(Math.abs).sort((p, q) => p - q);
  const med = finite.length ? finite[Math.floor(finite.length / 2)] : 1;
  const breaks: number[] = [], turn: number[] = [];
  let lastDir = 0;
  for (let i = 1; i <= n; i++) {
    const y0 = ys[i - 1], y1 = ys[i];
    if (!Number.isFinite(y0) || !Number.isFinite(y1) || (Math.sign(y0) !== Math.sign(y1) && Math.min(Math.abs(y0), Math.abs(y1)) > 100 * Math.max(1, med))) {
      if (!breaks.length || breaks[breaks.length - 1] !== xs[i]) breaks.push(xs[i]); lastDir = 0; continue;
    }
    const dir = Math.sign(y1 - y0);
    if (dir && lastDir && dir !== lastDir) {
      // refine the turning point between xs[i-2] and xs[i] by golden-section search
      let lo = xs[Math.max(0, i - 2)], hi = xs[i];
      const better = (u: number, v: number) => (lastDir > 0 ? f(u) > f(v) : f(u) < f(v));
      for (let k = 0; k < 80; k++) { const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618; if (better(m1, m2)) hi = m2; else lo = m1; }
      turn.push((lo + hi) / 2);
    }
    if (dir) lastDir = dir;
  }
  const isBreak = (x: number) => breaks.some((z) => Math.abs(z - x) < ((b - a) / n) * 1.01);
  return {
    id: 'own', label, f: (x) => (isBreak(x) ? NaN : f(x)),
    natural: { lo: a, hi: b, loC: true, hiC: true }, breaks: breaks.filter((x) => x > a && x < b),
    turning: (lo, hi) => inside(turn, lo, hi),
    lim: (x, side) => { const h = ((b - a) / n) * 2; const v = f(x + side * h); return Number.isFinite(v) ? (isBreak(x) && Math.abs(v) > 100 * Math.max(1, med) ? Math.sign(v) * Infinity : f(x)) : NaN; },
  };
}
