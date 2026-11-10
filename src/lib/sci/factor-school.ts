// #1285 Factorise with identities: read a polynomial in x with whole-number coefficients (degree up to 4), take out
// the common factor, then use the school identities (a² − b², (a ± b)², a³ ± b³, (a + b)³), the middle-term
// split and the factor theorem, writing each step. The answer is checked by multiplying back. Pure maths, no DOM.

export type Poly = number[];   // coefficients, constant first: [c0, c1, c2, ...]

const trim = (p: Poly): Poly => { const q = [...p]; while (q.length > 1 && q[q.length - 1] === 0) q.pop(); return q; };
export const degree = (p: Poly) => trim(p).length - 1;
export function mul(a: Poly, b: Poly): Poly { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return trim(r); }
export const same = (a: Poly, b: Poly) => { const x = trim(a), y = trim(b); return x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) < 1e-9); };
export const evalAt = (p: Poly, x: number) => p.reduce((s, c, i) => s + c * x ** i, 0);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Read "4x^2 - 9", "x² + 5x + 6", "8x³ − 27", "2x^2-18". Null when it cannot be read (or is not whole numbers, or degree > 4). */
export function parse(s: string): Poly | null {
  const t = s.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/\*\*/g, '^').replace(/X/g, 'x');
  if (!t || !/^[-+0-9x^]+$/.test(t)) return null;
  const terms = t.match(/[+-]?[^+-]+/g);
  if (!terms || terms.join('') !== t) return null;
  const p: Poly = [0, 0, 0, 0, 0];
  for (const term of terms) {
    const m = /^([+-]?)(\d*)(x(?:\^(\d+))?)?$/.exec(term);
    if (!m || (m[2] === '' && !m[3])) return null;
    const c = (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : Number(m[2])), e = m[3] ? (m[4] ? Number(m[4]) : 1) : 0;
    if (e > 4) return null;
    p[e] += c;
  }
  const q = trim(p);
  return q.length === 1 && q[0] === 0 ? null : q;
}

const SUP = ['', '', '²', '³', '⁴'];
/** Polynomial as text: "4x² − 9". */
export function show(p: Poly): string {
  const q = trim(p), parts: string[] = [];
  for (let e = q.length - 1; e >= 0; e--) {
    const c = q[e]; if (c === 0) continue;
    const m = Math.abs(c), body = e === 0 ? String(m) : `${m === 1 ? '' : m}x${SUP[e]}`;
    parts.push(parts.length ? `${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`);
  }
  return parts.length ? parts.join(' ') : '0';
}

/** A whole number with a real minus sign, in brackets when asked (for "6 × (−6)"). */
const n = (x: number, br = false) => (x < 0 ? (br ? `(−${-x})` : `−${-x}`) : String(x));
const isqrt = (n: number) => { if (n < 0) return NaN; const r = Math.round(Math.sqrt(n)); return r * r === n ? r : NaN; };
const icbrt = (n: number) => { const r = Math.round(Math.cbrt(n)); return r * r * r === n ? r : NaN; };
/** "(αx ± β)" style text for a linear factor [β, α]. */
const lin = (p: Poly) => show(p);

export type Result = { k: number; xPow: number; factors: Poly[]; steps: string[]; complete: boolean };

/** Whole factorisation with steps. */
export function factorise(input: Poly): Result {
  let p = trim(input);
  const steps: string[] = [];
  // 1. Common factor (whole number and power of x); make the leading coefficient positive.
  let xPow = 0; while (p.length > 1 && p[0] === 0) { p = p.slice(1); xPow++; }
  let k = p.reduce((g, c) => gcd(g, c), 0) || 1;
  if (p[p.length - 1] < 0) k = -k;
  p = p.map((c) => c / k);
  const cf = `${k === 1 ? '' : k === -1 ? '−' : k}${xPow ? `x${SUP[xPow] ?? `^${xPow}`}` : ''}`;
  if (cf) steps.push(`Common factor first: ${show(trim(input))} = ${cf}(${show(p)}).`);
  else steps.push(`No common factor to take out.`);
  const done: Poly[] = [];
  let complete = true;
  const work = (q: Poly) => {
    const d = degree(q);
    if (d <= 1) { if (d === 1) done.push(q); return; }
    const [c0, c1, c2, c3, c4] = [q[0], q[1] ?? 0, q[2] ?? 0, q[3] ?? 0, q[4] ?? 0];
    if (d === 2) {
      const a = c2, b = c1, c = c0, ra = isqrt(a), rc = isqrt(Math.abs(c));
      if (b === 0 && c < 0 && ra && rc) {
        steps.push(`${show(q)} = (${ra === 1 ? '' : ra}x)² − ${rc}²: use a² − b² = (a + b)(a − b) with a = ${ra === 1 ? '' : ra}x, b = ${rc}.`);
        done.push([rc, ra], [-rc, ra]); return;
      }
      if (c > 0 && ra && rc && Math.abs(b) === 2 * ra * rc) {
        const sgn = b > 0 ? '+' : '−';
        steps.push(`${show(q)} = (${ra === 1 ? '' : ra}x)² ${sgn} 2 × ${ra === 1 ? '' : ra}x × ${rc} + ${rc}²: use (a ${sgn} b)² = a² ${sgn} 2ab + b².`);
        const f: Poly = [b > 0 ? rc : -rc, ra]; done.push(f, f); return;
      }
      // Split the middle term: two numbers with product ac and sum b.
      const ac = a * c;
      for (let m = 0; m <= Math.abs(ac); m++) {
        for (const u of m === 0 ? [0] : [m, -m]) {
          if (u === 0 ? ac !== 0 : ac % u !== 0) continue;
          const v = u === 0 ? b : ac / u;
          if (u + v !== b || u * v !== ac) continue;
          const g1 = gcd(a, u) || 1, g2 = gcd(v, c) || 1;
          const s1 = (v < 0 || (v === 0 && c < 0)) ? -g2 : g2;
          const f1: Poly = [u / g1, a / g1], f2: Poly = [c / s1, v / s1];
          if (!same(f1, f2)) continue;
          steps.push(`Split the middle term: find two numbers that multiply to a × c = ${n(a)} × ${n(c, true)} = ${n(ac)} and add to b = ${n(b)}: ${n(u)} and ${n(v)}.`);
          steps.push(`${show(q)} = ${show([0, 0, a])} ${u < 0 ? '−' : '+'} ${Math.abs(u)}x ${v < 0 ? '−' : '+'} ${Math.abs(v)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${g1 === 1 ? '' : g1}x(${lin(f1)}) ${s1 < 0 ? '−' : '+'} ${Math.abs(s1) === 1 ? '' : Math.abs(s1)}(${lin(f2)}) = (${lin([s1, g1])})(${lin(f1)}).`);
          done.push([s1, g1], f1); return;
        }
      }
      steps.push(`${show(q)} has no two whole numbers that multiply to ${n(ac)} and add to ${n(b)} (b² − 4ac = ${n(b * b - 4 * ac)} is not a square number), so it does not factorise with whole numbers.`);
      complete = c2 !== 0 && b * b - 4 * ac < 0 ? true : false;
      done.push(q); return;
    }
    if (d === 3 && c1 === 0 && c2 === 0) {
      const ra = icbrt(c3), rd = icbrt(Math.abs(c0));
      if (ra && rd) {
        const plus = c0 > 0;
        steps.push(`${show(q)} = (${ra === 1 ? '' : ra}x)³ ${plus ? '+' : '−'} ${rd}³: use a³ ${plus ? '+' : '−'} b³ = (a ${plus ? '+' : '−'} b)(a² ${plus ? '−' : '+'} ab + b²) with a = ${ra === 1 ? '' : ra}x, b = ${rd}.`);
        done.push([plus ? rd : -rd, ra]);
        const quad: Poly = [rd * rd, plus ? -ra * rd : ra * rd, ra * ra];
        steps.push(`The second bracket ${show(quad)} has b² − 4ac = ${n(quad[1] ** 2 - 4 * quad[0] * quad[2])} < 0, so it does not factorise any further.`);
        done.push(quad); return;
      }
    }
    if (d === 3) {
      const ra = icbrt(c3), rd = icbrt(c0);
      if (ra && rd && c2 === 3 * ra * ra * rd && c1 === 3 * ra * rd * rd) {
        steps.push(`${show(q)} = (${ra === 1 ? '' : ra}x)³ ${rd < 0 ? '−' : '+'} 3(${ra === 1 ? '' : ra}x)²(${Math.abs(rd)}) + 3(${ra === 1 ? '' : ra}x)(${Math.abs(rd)})² ${rd < 0 ? '−' : '+'} ${Math.abs(rd)}³: use (a ${rd < 0 ? '−' : '+'} b)³.`);
        const f: Poly = [rd, ra]; done.push(f, f, f); return;
      }
    }
    if (d === 4 && c1 === 0 && c3 === 0 && c2 === 0) {
      const ra = isqrt(c4), rc = isqrt(-c0);
      if (c0 < 0 && ra && rc) {
        steps.push(`${show(q)} = (${ra === 1 ? '' : ra}x²)² − ${rc}²: use a² − b² = (a + b)(a − b).`);
        done.push([rc, 0, ra]); work([-rc, 0, ra]); return;
      }
    }
    // Factor theorem: try x = r/s with r dividing the constant and s dividing the leading coefficient.
    const lead = q[d], cons = q[0];
    if (cons === 0) { done.push([0, 1]); work(q.slice(1)); return; }
    const divs = (n: number) => { const out: number[] = []; for (let i = 1; i <= Math.abs(n); i++) if (n % i === 0) out.push(i); return out; };
    for (const s of divs(lead)) for (const r of divs(cons)) for (const sg of [1, -1]) {
      const x = (sg * r) / s;
      if (Math.abs(evalAt(q, x)) > 1e-9 || gcd(r, s) !== 1) continue;
      // Divide by (s x − sg r).
      const f: Poly = [-sg * r, s], quo: number[] = new Array(d).fill(0); let rem = [...q];
      for (let e = d; e >= 1; e--) { const c = rem[e] / s; quo[e - 1] = c; rem[e] -= c * s; rem[e - 1] += c * sg * r; }
      steps.push(`Factor theorem: p(${s === 1 ? n(sg * r) : `${n(sg * r)}/${s}`}) = 0, so (${lin(f)}) is a factor. Dividing gives ${show(quo)}.`);
      done.push(f); work(quo); return;
    }
    steps.push(`${show(q)} has no factor (ax + b) with whole numbers, so it stays as it is.`);
    complete = false; done.push(q);
  };
  work(p);
  return { k, xPow, factors: done, steps, complete };
}

/** The factorised form as text, e.g. "2(x + 3)(x − 3)", "(2x + 3)²". */
export function resultText(r: Result): string {
  const groups: { f: Poly; n: number }[] = [];
  for (const f of r.factors) { const g = groups.find((x) => same(x.f, f)); if (g) g.n++; else groups.push({ f, n: 1 }); }
  groups.sort((a, b) => degree(a.f) - degree(b.f) || (a.f[0] < b.f[0] ? 1 : -1));
  const lone = r.factors.length === 1 && !r.xPow && Math.abs(r.k) === 1;
  const body = groups.map(({ f, n }) => (lone ? show(f) : `(${show(f)})`) + (n > 1 ? SUP[n] ?? `^${n}` : '')).join('');
  const kx = `${r.k === 1 ? '' : r.k === -1 ? '−' : r.k}${r.xPow ? `x${SUP[r.xPow] ?? `^${r.xPow}`}` : ''}`;
  return `${kx}${body}` || String(r.k);
}
/** Multiply the factors back out. */
export function expand(r: Result): Poly {
  let p: Poly = [r.k];
  for (let i = 0; i < r.xPow; i++) p = mul(p, [0, 1]);
  for (const f of r.factors) p = mul(p, f);
  return p;
}
