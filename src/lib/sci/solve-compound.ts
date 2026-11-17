// "Solve my numbers" for compound angles (Class 11): sin, cos or tan of a sum or difference of angles, with exact
// surd answers for 0°, 30°, 45°, 60° and 90°; sin, cos and tan of A ± B from known ratios of A and B; and the
// double angle formulae from one known ratio. Exact surds live in the field Q(√2, √3). No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { rat, gcd } from './smath.ts';

const D = 180 / Math.PI;
type Q4 = [number, number, number, number]; // coefficients of 1, √2, √3, √6
const BASE: [string, number][] = [['', 1], ['√2', 2], ['√3', 3], ['√6', 6]];
/** sin and cos of the standard angles as numerators over 2. */
const SC: Record<number, { s: Q4; c: Q4 }> = {
  0: { s: [0, 0, 0, 0], c: [2, 0, 0, 0] }, 30: { s: [1, 0, 0, 0], c: [0, 0, 1, 0] }, 45: { s: [0, 1, 0, 0], c: [0, 1, 0, 0] },
  60: { s: [0, 0, 1, 0], c: [1, 0, 0, 0] }, 90: { s: [2, 0, 0, 0], c: [0, 0, 0, 0] },
};
const mulQ = (a: Q4, b: Q4): Q4 => [a[0] * b[0] + 2 * a[1] * b[1] + 3 * a[2] * b[2] + 6 * a[3] * b[3], a[0] * b[1] + a[1] * b[0] + 3 * (a[2] * b[3] + a[3] * b[2]), a[0] * b[2] + a[2] * b[0] + 2 * (a[1] * b[3] + a[3] * b[1]), a[0] * b[3] + a[3] * b[0] + a[1] * b[2] + a[2] * b[1]];
const addQ = (a: Q4, b: Q4, s = 1): Q4 => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2], a[3] + s * b[3]];
const valQ = (a: Q4, den: number) => (a[0] + a[1] * Math.SQRT2 + a[2] * Math.sqrt(3) + a[3] * Math.sqrt(6)) / den;
/** Q4 over a denominator as text: (√2 + √6)/4, √3/2, 1/2, −(√6 + √2)/4 style. */
export function surdText(a: Q4, den: number): string {
  let g = den; for (const x of a) g = gcd(g, Math.abs(x)); g = g || 1;
  const c = a.map((x) => x / g) as Q4, d = den / g;
  const terms = c.map((x, k) => ({ x, k })).filter((t) => t.x !== 0);
  if (!terms.length) return '0';
  const allNeg = terms.every((t) => t.x < 0), sgn = allNeg ? -1 : 1;
  terms.sort((p, q) => (Math.sign(q.x * sgn) - Math.sign(p.x * sgn)) || p.k - q.k);
  const body = terms.map((t, j) => { const m = Math.abs(t.x), sym = BASE[t.k][0]; const s = `${m === 1 && sym ? '' : m}${sym}`; return j === 0 ? s : `${t.x * sgn < 0 ? '− ' : '+ '}${s}`; }).join(' ');
  const wrap = terms.length > 1 && d > 1 ? `(${body})` : terms.length > 1 && allNeg ? `(${body})` : body;
  return `${allNeg ? '−' : ''}${wrap}${d > 1 ? `/${d}` : ''}`;
}
const single = (q: Q4) => surdText(q, 2);

const dg = (x: number) => `${sf(x, 6)}°`;
/** A fraction when a number is one, with its decimal. */
const fr = (x: number) => { const r = rat(x, 1000); const d = sf(x, 4); return r && r[1] > 1 ? `${String(r[0]).replace('-', '−')}/${r[1]} (≈ ${d})` : d; };
const frShort = (x: number) => { const r = rat(x, 1000); return r && r[1] > 1 ? `${String(r[0]).replace('-', '−')}/${r[1]}` : sf(x, 4); };

export function exact(fn: string, minus: boolean, Adeg: number, Bdeg: number, shownA: string, shownB: string): SOut {
  const sg = minus ? '−' : '+', Ad = Math.round(Adeg * 1e9) / 1e9, Bd = Math.round(Bdeg * 1e9) / 1e9;
  const T = (Ad + (minus ? -Bd : Bd)), tn = T < 0 ? `−${dg(-T)}` : dg(T);
  const hdr = `${fn}(A ${sg} B) with A = ${shownA} and B = ${shownB}`;
  const std = SC[Ad] && SC[Bd];
  const dir = (f: string, x: number) => (f === 'sin' ? Math.sin(x / D) : f === 'cos' ? Math.cos(x / D) : Math.tan(x / D));
  const direct = dir(fn, T);
  if (fn === 'tan') {
    const cosz = (x: number) => Math.abs(Math.cos(x / D)) < 1e-12;
    if (cosz(Ad) || cosz(Bd)) return { error: 'tan 90° is not defined, so the tan formula cannot be used with 90°. Use sin and cos instead.' };
    const ta = Math.tan(Ad / D), tb = Math.tan(Bd / D), top = minus ? ta - tb : ta + tb, bot = 1 + (minus ? 1 : -1) * ta * tb;
    const lines = [`tan(A ${sg} B) = (tan A ${sg} tan B) / (1 ${minus ? '+' : '−'} tan A tan B)`, `tan ${dg(Ad)} = ${sf(ta, 5)} and tan ${dg(Bd)} = ${sf(tb, 5)}`, `= (${sf(ta, 5)} ${sg} ${sf(tb, 5)}) / (1 ${minus ? '+' : '−'} ${sf(ta, 5)} × ${sf(tb, 5)}) = ${sf(top, 5)} / ${sf(bot, 5)}`];
    if (Math.abs(bot) < 1e-9) return { answer: `tan(A ${sg} B) is not defined: the angle is ${tn}.`, lines: [...lines, `The bottom is 0, which happens when A ${sg} B = 90°.`], tip: 'tan 90° does not exist, so a zero bottom in the formula means the angle is 90° (or 270°).' };
    lines.push(`= ${sf(top / bot, 5)}`);
    let exactTan = '';
    if (std) {
      // tan of 0, 30, 45, 60 is p + q√3: 0, √3/3, 1, √3. Rationalise (p + q√3)/(r + s√3).
      const T3: Record<number, [number, number]> = { 0: [0, 0], 30: [0, 1 / 3], 45: [1, 0], 60: [0, 1] };
      const [a1, a2] = T3[Ad], [b1, b2] = T3[Bd], k2 = minus ? -1 : 1;
      const np = a1 + k2 * b1, nq = a2 + k2 * b2;                       // top: tan A ± tan B
      const dp = 1 - k2 * (a1 * b1 + 3 * a2 * b2), dq = -k2 * (a1 * b2 + a2 * b1); // bottom: 1 ∓ tan A tan B
      const den = dp * dp - 3 * dq * dq, rp = (np * dp - 3 * nq * dq) / den, rq = (nq * dp - np * dq) / den;
      const fq = (x: number) => { const r = rat(Math.abs(x), 100); return r ? r : null; };
      const parts: string[] = [];
      if (Math.abs(rp) > 1e-9) { const r = rat(rp, 100); parts.push(r ? `${r[0] < 0 ? '−' : ''}${Math.abs(r[0])}${r[1] > 1 ? `/${r[1]}` : ''}` : sf(rp, 4)); }
      if (Math.abs(rq) > 1e-9) { const r = fq(rq); const sgn = rq < 0 ? '−' : ''; const body = r ? `${r[0] === 1 ? '' : r[0]}√3${r[1] > 1 ? `/${r[1]}` : ''}` : `${sf(Math.abs(rq), 4)}√3`; parts.push(parts.length ? `${rq < 0 ? '− ' : '+ '}${body}` : `${sgn}${body}`); }
      exactTan = parts.length ? parts.join(' ') : '0';
      lines.push(`Exact: rationalise the bottom to get tan ${tn} = ${exactTan}`);
    }
    lines.push(`Check: tan ${tn} = ${sf(direct, 5)}`);
    return { answer: `tan(${dg(Ad)} ${sg} ${dg(Bd)}) = tan ${tn} = ${exactTan ? `${exactTan} ≈ ` : ''}${sf(top / bot, 4)}.`, lines, tip: 'Common mistake: the sign in the bottom is opposite to the sign on top: 1 − tan A tan B for a sum, 1 + tan A tan B for a difference.' };
  }
  const formula = fn === 'sin' ? `sin(A ${sg} B) = sin A cos B ${sg} cos A sin B` : `cos(A ${sg} B) = cos A cos B ${minus ? '+' : '−'} sin A sin B`;
  const subst = fn === 'sin' ? `sin ${dg(Ad)} cos ${dg(Bd)} ${sg} cos ${dg(Ad)} sin ${dg(Bd)}` : `cos ${dg(Ad)} cos ${dg(Bd)} ${minus ? '+' : '−'} sin ${dg(Ad)} sin ${dg(Bd)}`;
  const lines = [formula, `= ${subst}`];
  let ans: string;
  if (std) {
    const a = SC[Ad], b = SC[Bd];
    const p1 = fn === 'sin' ? mulQ(a.s, b.c) : mulQ(a.c, b.c), p2 = fn === 'sin' ? mulQ(a.c, b.s) : mulQ(a.s, b.s);
    const plus = fn === 'sin' ? !minus : minus, res = addQ(p1, p2, plus ? 1 : -1);
    const w = (q: Q4) => (q.every((x) => x === 0) ? '0' : `(${single(q)})`);
    const sa = fn === 'sin' ? [a.s, b.c, a.c, b.s] : [a.c, b.c, a.s, b.s];
    lines.push(`= ${w(sa[0])}${w(sa[1])} ${plus ? '+' : '−'} ${w(sa[2])}${w(sa[3])}`.replace(/\(([^()]*)\)\(/g, '($1)('), `= ${surdText(p1, 4)} ${plus ? '+' : '−'} ${surdText(p2, 4)}`, `= ${surdText(res, 4)}`);
    const ex = surdText(res, 4), dec = valQ(res, 4);
    lines.push(`≈ ${sf(dec, 5)}; check: ${fn} ${tn} = ${sf(direct, 5)}`);
    ans = `${fn}(${dg(Ad)} ${sg} ${dg(Bd)}) = ${fn} ${tn} = ${ex} ≈ ${sf(dec, 4)}.`;
  } else {
    const sa = Math.sin(Ad / D), ca = Math.cos(Ad / D), sb = Math.sin(Bd / D), cb = Math.cos(Bd / D);
    const val = fn === 'sin' ? sa * cb + (minus ? -1 : 1) * ca * sb : ca * cb + (minus ? 1 : -1) * sa * sb;
    lines.push(`With sin ${dg(Ad)} = ${sf(sa, 5)}, cos ${dg(Ad)} = ${sf(ca, 5)}, sin ${dg(Bd)} = ${sf(sb, 5)}, cos ${dg(Bd)} = ${sf(cb, 5)}`, `= ${sf(val, 5)}`, `Check: ${fn} ${tn} = ${sf(direct, 5)}`);
    ans = `${fn}(${dg(Ad)} ${sg} ${dg(Bd)}) = ${fn} ${tn} = ${sf(val, 4)}.`;
  }
  void hdr;
  return { answer: ans, lines, tip: fn === 'sin' ? 'Common mistake: sin(A + B) is not sin A + sin B. For example sin 90° = 1 but sin 45° + sin 45° = 1.414. Use sin A cos B + cos A sin B.' : 'Common mistake: cos(A + B) is not cos A + cos B, and the middle sign is the opposite of the sign inside the bracket: cos(A + B) = cos A cos B − sin A sin B.' };
}

type Tr = { s: number; c: number; t: number; why: string };
/** sin, cos and tan of an angle from one known ratio and its quadrant (1 to 4). */
export function fromRatio(kind: string, v: number, quad: number, name: string): Tr | string {
  const sPos = quad === 1 || quad === 2, cPos = quad === 1 || quad === 4, tPos = quad === 1 || quad === 3, qn = ['I', 'II', 'III', 'IV'][quad - 1];
  const bad = (m: string) => `${m} Pick the quadrant that fits.`;
  if (kind === 'sin' || kind === 'cos') {
    if (Math.abs(v) > 1) return `${kind} ${name} must be between −1 and 1, but you typed ${sf(v, 4)}.`;
    const r = Math.sqrt(Math.max(0, 1 - v * v));
    if (kind === 'sin') {
      if (v > 0 && !sPos) return bad(`sin ${name} = ${frShort(v)} is positive, but sine is negative in quadrant ${qn}.`);
      if (v < 0 && sPos) return bad(`sin ${name} = ${frShort(v)} is negative, but sine is positive in quadrant ${qn}.`);
      const c = cPos ? r : -r;
      return { s: v, c, t: Math.abs(c) < 1e-12 ? NaN : v / c, why: `sin ${name} = ${frShort(v)}, so cos ${name} = ${cPos ? '+' : '−'}√(1 − sin²${name}) = ${cPos ? '+' : '−'}√(1 − ${frShort(v * v)}) = ${frShort(c)} (cosine is ${cPos ? 'positive' : 'negative'} in quadrant ${qn})` };
    }
    if (v > 0 && !cPos) return bad(`cos ${name} = ${frShort(v)} is positive, but cosine is negative in quadrant ${qn}.`);
    if (v < 0 && cPos) return bad(`cos ${name} = ${frShort(v)} is negative, but cosine is positive in quadrant ${qn}.`);
    const s = sPos ? r : -r;
    return { s, c: v, t: Math.abs(v) < 1e-12 ? NaN : s / v, why: `cos ${name} = ${frShort(v)}, so sin ${name} = ${sPos ? '+' : '−'}√(1 − cos²${name}) = ${sPos ? '+' : '−'}√(1 − ${frShort(v * v)}) = ${frShort(s)} (sine is ${sPos ? 'positive' : 'negative'} in quadrant ${qn})` };
  }
  if (v > 0 && !tPos) return bad(`tan ${name} = ${frShort(v)} is positive, but tangent is negative in quadrant ${qn}.`);
  if (v < 0 && tPos) return bad(`tan ${name} = ${frShort(v)} is negative, but tangent is positive in quadrant ${qn}.`);
  const h = 1 / Math.sqrt(1 + v * v), c = cPos ? h : -h, s = sPos ? Math.abs(v) * h : -Math.abs(v) * h;
  return { s, c, t: v, why: `tan ${name} = ${frShort(v)}, so the hypotenuse is √(1 + tan²${name}) = √(1 + ${frShort(v * v)}); sin ${name} = ${frShort(s)} and cos ${name} = ${frShort(c)} (quadrant ${qn} signs)` };
}

export function given(ka: string, va: number, qa: number, kb: string, vb: number, qb: number, minus: boolean): SOut {
  const A = fromRatio(ka, va, qa, 'A'), B = fromRatio(kb, vb, qb, 'B');
  if (typeof A === 'string') return { error: A };
  if (typeof B === 'string') return { error: B };
  const sg = minus ? '−' : '+', k = minus ? -1 : 1;
  const s = A.s * B.c + k * A.c * B.s, c = A.c * B.c - k * A.s * B.s, t = Math.abs(c) < 1e-9 ? NaN : s / c;
  const tt = Number.isFinite(t) ? fr(t) : 'not defined (cos is 0)';
  return { answer: `sin(A ${sg} B) = ${fr(s)}, cos(A ${sg} B) = ${fr(c)}, tan(A ${sg} B) = ${tt}.`, lines: [A.why, B.why, `sin(A ${sg} B) = sin A cos B ${sg} cos A sin B = (${frShort(A.s)})(${frShort(B.c)}) ${sg} (${frShort(A.c)})(${frShort(B.s)}) = ${fr(s)}`, `cos(A ${sg} B) = cos A cos B ${minus ? '+' : '−'} sin A sin B = (${frShort(A.c)})(${frShort(B.c)}) ${minus ? '+' : '−'} (${frShort(A.s)})(${frShort(B.s)}) = ${fr(c)}`, `tan(A ${sg} B) = sin(A ${sg} B) / cos(A ${sg} B) = ${tt}`], tip: 'Common mistake: taking the wrong sign for the missing ratio. Use the quadrant: sin is positive in I and II, cos in I and IV, tan in I and III.' };
}

export function double(ka: string, va: number, qa: number): SOut {
  const A = fromRatio(ka, va, qa, 'A');
  if (typeof A === 'string') return { error: A };
  const s2 = 2 * A.s * A.c, c2 = A.c * A.c - A.s * A.s, t2 = Math.abs(c2) < 1e-9 ? NaN : s2 / c2;
  const tt = Number.isFinite(t2) ? fr(t2) : 'not defined (cos 2A is 0)';
  return { answer: `sin 2A = ${fr(s2)}, cos 2A = ${fr(c2)}, tan 2A = ${tt}.`, lines: [A.why, `sin 2A = 2 sin A cos A = 2(${frShort(A.s)})(${frShort(A.c)}) = ${fr(s2)}`, `cos 2A = cos²A − sin²A = (${frShort(A.c)})² − (${frShort(A.s)})² = ${fr(c2)}`, `Same result from 1 − 2 sin²A = ${fr(1 - 2 * A.s * A.s)} and 2 cos²A − 1 = ${fr(2 * A.c * A.c - 1)}`, `tan 2A = sin 2A / cos 2A = ${tt}`], tip: 'Common mistake: sin 2A is not 2 sin A. Use 2 sin A cos A. For cos 2A choose the version that suits what you know.' };
}

const RAD: [string, number][] = [['degrees', 1], ['radians', D]];
const QUADS: [string, string][] = [['1', 'I (0° to 90°)'], ['2', 'II (90° to 180°)'], ['3', 'III (180° to 270°)'], ['4', 'IV (270° to 360°)']];
const KIND: [string, string][] = [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']];
export const COMPOUND_SPEC: SSpec = {
  id: 'compound',
  finds: [['exact', 'sin, cos or tan of A + B or A − B (angles given)'], ['given', 'sin, cos, tan of A ± B from known ratios'], ['double', 'Double angle from one known ratio']],
  fields: [
    { k: 'fn', label: 'Function', kind: 'choice', options: KIND, def: 'sin', show: (c) => c.find === 'exact' },
    { k: 'op', label: 'Sum or difference', kind: 'choice', options: [['plus', 'A + B'], ['minus', 'A − B']], def: 'plus', show: (c) => c.find !== 'double' },
    { k: 'A', label: 'Angle A', neg: true, units: RAD, ph: 'e.g. 45', show: (c) => c.find === 'exact' },
    { k: 'B', label: 'Angle B', neg: true, units: RAD, ph: 'e.g. 30', show: (c) => c.find === 'exact' },
    { k: 'ka', label: 'Known ratio of A', kind: 'choice', options: KIND, def: 'sin', show: (c) => c.find !== 'exact' },
    { k: 'va', label: 'Its value (a fraction such as 3/5 is fine)', neg: true, ph: 'e.g. 3/5', show: (c) => c.find !== 'exact' },
    { k: 'qa', label: 'A lies in quadrant', kind: 'choice', options: QUADS, def: '1', show: (c) => c.find !== 'exact' },
    { k: 'kb', label: 'Known ratio of B', kind: 'choice', options: KIND, def: 'cos', show: (c) => c.find === 'given' },
    { k: 'vb', label: 'Its value', neg: true, ph: 'e.g. 12/13', show: (c) => c.find === 'given' },
    { k: 'qb', label: 'B lies in quadrant', kind: 'choice', options: QUADS, def: '1', show: (c) => c.find === 'given' },
  ],
  presets: [
    { name: 'sin 75° as sin(45° + 30°)', find: 'exact', ch: { fn: 'sin', op: 'plus' }, vals: { A: ['45', 'degrees'], B: ['30', 'degrees'] } },
    { name: 'cos 15° as cos(45° − 30°)', find: 'exact', ch: { fn: 'cos', op: 'minus' }, vals: { A: ['45', 'degrees'], B: ['30', 'degrees'] } },
    { name: 'tan 105° as tan(60° + 45°)', find: 'exact', ch: { fn: 'tan', op: 'plus' }, vals: { A: ['60', 'degrees'], B: ['45', 'degrees'] } },
    { name: 'sin A = 3/5 and cos B = 12/13 (both acute): A + B', find: 'given', ch: { op: 'plus', ka: 'sin', qa: '1', kb: 'cos', qb: '1' }, vals: { va: '3/5', vb: '12/13' } },
    { name: 'sin A = 3/5 (acute): double angle', find: 'double', ch: { ka: 'sin', qa: '1' }, vals: { va: '3/5' } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    if (c.find === 'exact') {
      const a = i.A, b = i.B, show = (x: SIn) => `${sf(x.typed, 6)}${x.u === 'degrees' ? '°' : ' rad'}`;
      return exact(c.ch.fn ?? 'sin', c.ch.op === 'minus', a.v, b.v, show(a), show(b));
    }
    if (c.find === 'given') return given(c.ch.ka ?? 'sin', i.va.v, +(c.ch.qa ?? 1), c.ch.kb ?? 'cos', i.vb.v, +(c.ch.qb ?? 1), c.ch.op === 'minus');
    return double(c.ch.ka ?? 'sin', i.va.v, +(c.ch.qa ?? 1));
  },
};
