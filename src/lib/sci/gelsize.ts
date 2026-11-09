// Gel band sizes from a ladder: fit log10(size) against migration distance (straight line, cubic, or point-to-point),
// then read unknown bands off the fit with a residual-based spread. No DOM.

export type Method = 'linear' | 'cubic' | 'interp';
export type Model = { method: Method; coef: number[]; s: number; r2: number; n: number; dMin: number; dMax: number; sizeMin: number; sizeMax: number; pts: { d: number; size: number }[] };

/** Least-squares polynomial (coefficients highest power first, like numpy.polyfit), solved on centred and scaled x. */
export function polyfit(x: number[], y: number[], deg: number) {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, sx = Math.max(...x.map((v) => Math.abs(v - mx))) || 1;
  const u = x.map((v) => (v - mx) / sx), m = deg + 1;
  const A = Array.from({ length: m }, () => new Array(m + 1).fill(0));
  for (let i = 0; i < n; i++) { const p = Array.from({ length: m }, (_, k) => u[i] ** k); for (let r = 0; r < m; r++) { for (let c = 0; c < m; c++) A[r][c] += p[r] * p[c]; A[r][m] += p[r] * y[i]; } }
  for (let c = 0; c < m; c++) {
    let piv = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < m; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= m; k++) A[r][k] -= f * A[c][k]; }
  }
  const b = A.map((row, i) => row[m] / row[i]); // in u: y = Σ b_k u^k
  // expand back to x: u = (x − mx)/sx
  const out = new Array(m).fill(0); // ascending powers of x
  const binom = (a: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (a - i + 1)) / i; return r; };
  for (let k = 0; k < m; k++) for (let j = 0; j <= k; j++) out[j] += (b[k] / sx ** k) * binom(k, j) * (-mx) ** (k - j);
  return out.reverse();
}
export const polyval = (c: number[], x: number) => c.reduce((a, k) => a * x + k, 0);

export function fit(dist: number[], size: number[], method: Method): Model {
  const pts = dist.map((d, i) => ({ d, size: size[i] })).sort((a, b) => a.d - b.d);
  const x = pts.map((p) => p.d), y = pts.map((p) => Math.log10(p.size)), n = x.length;
  const my = y.reduce((a, b) => a + b, 0) / n, sst = y.reduce((a, v) => a + (v - my) ** 2, 0);
  let coef: number[] = [], s = 0, r2 = 1;
  if (method !== 'interp') {
    const deg = method === 'linear' ? 1 : 3;
    coef = polyfit(x, y, deg);
    const sse = x.reduce((a, v, i) => a + (y[i] - polyval(coef, v)) ** 2, 0);
    s = n > deg + 1 ? Math.sqrt(sse / (n - deg - 1)) : NaN; r2 = sst > 0 ? 1 - sse / sst : 1;
  }
  return { method, coef, s, r2, n, dMin: x[0], dMax: x[n - 1], sizeMin: Math.min(...size), sizeMax: Math.max(...size), pts };
}

/** Size at a distance, with the ×/÷ spread from the fit's residual SD (none for point-to-point). */
export function sizeAt(m: Model, d: number) {
  let ly: number;
  if (m.method === 'interp') {
    const p = m.pts; let i = 0;
    if (d <= p[0].d) i = 0; else if (d >= p[p.length - 1].d) i = p.length - 2; else while (p[i + 1].d < d) i++;
    const a = p[i], b = p[i + 1], t = (d - a.d) / (b.d - a.d);
    ly = Math.log10(a.size) + t * (Math.log10(b.size) - Math.log10(a.size));
  } else ly = polyval(m.coef, d);
  const size = 10 ** ly, f = Number.isFinite(m.s) && m.s > 0 ? 10 ** m.s : NaN;
  return { size, lo: size / f, hi: size * f, inside: d >= m.dMin && d <= m.dMax };
}
