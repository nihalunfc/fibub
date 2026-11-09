// Atterberg limits (liquid limit from the Casagrande flow curve or the one-point method, plastic limit, indices)
// and the Proctor compaction curve (dry density, polynomial fit, maximum dry density and optimum water content,
// zero-air-voids and air-voids lines). Plain maths, no DOM. Water contents in %, densities in Mg/m³.

/** Least-squares polynomial y = Σ c[k] x^k (normal equations, solved with partial pivoting on centred x). */
export function polyfit(x: number[], y: number[], deg: number): { c: number[]; r2: number } {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n;
  const A: number[][] = Array.from({ length: deg + 1 }, () => new Array(deg + 2).fill(0));
  for (let i = 0; i < n; i++) {
    const t = x[i] - mx, p: number[] = [1];
    for (let k = 1; k <= 2 * deg; k++) p.push(p[k - 1] * t);
    for (let r = 0; r <= deg; r++) { for (let c = 0; c <= deg; c++) A[r][c] += p[r + c]; A[r][deg + 1] += p[r] * y[i]; }
  }
  for (let col = 0; col <= deg; col++) {
    let piv = col;
    for (let r = col + 1; r <= deg; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    if (Math.abs(A[col][col]) < 1e-300) throw new Error('The points do not spread enough to fit this curve.');
    for (let r = 0; r <= deg; r++) if (r !== col) { const f = A[r][col] / A[col][col]; for (let c = col; c <= deg + 1; c++) A[r][c] -= f * A[col][c]; }
  }
  const ct = A.map((row, i) => row[deg + 1] / row[i]); // coefficients in (x − mx)
  // Expand to powers of x.
  const c = new Array(deg + 1).fill(0);
  const binom = (a: number, b: number) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return r; };
  for (let k = 0; k <= deg; k++) for (let j = 0; j <= k; j++) c[j] += ct[k] * binom(k, j) * (-mx) ** (k - j);
  const ym = y.reduce((a, b) => a + b, 0) / n;
  let ss = 0, st = 0;
  for (let i = 0; i < n; i++) { const f = ev(c, x[i]); ss += (y[i] - f) ** 2; st += (y[i] - ym) ** 2; }
  return { c, r2: st > 0 ? 1 - ss / st : 1 };
}
export const ev = (c: number[], x: number) => c.reduceRight((a, k) => a * x + k, 0);

/** Multipoint liquid limit: straight line of w against log10(N); LL is w at 25 blows; flow index If is the drop in w per tenfold rise in N. */
export function llFlow(N: number[], w: number[]): { LL: number; If: number; c: number[]; r2: number } {
  if (N.length < 2) throw new Error('Give at least two trials (three or more is better).');
  if (N.some((b) => !(b > 0)) || w.some((v) => !(v > 0))) throw new Error('Blow counts and water contents must be above zero.');
  if (new Set(N).size < 2) throw new Error('The trials need different blow counts.');
  const { c, r2 } = polyfit(N.map(Math.log10), w, 1);
  return { LL: c[0] + c[1] * Math.log10(25), If: -c[1], c, r2 };
}
/** One-point liquid limit: LL = wN (N/25)^k, with k = 0.121 as commonly used for 20 to 30 blows. */
export const llOnePoint = (N: number, w: number, k = 0.121) => w * (N / 25) ** k;

export function indices(LL: number, PL: number, w?: number, clay?: number, If?: number) {
  const PI = LL - PL;
  return { PI, LI: w != null && PI > 0 ? (w - PL) / PI : NaN, CI: w != null && PI > 0 ? (LL - w) / PI : NaN, A: clay != null && clay > 0 ? PI / clay : NaN, It: If != null && If > 0 ? PI / If : NaN };
}

/** Dry density from bulk density and water content (%): ρd = ρ / (1 + w). */
export const dryDensity = (rho: number, w: number) => rho / (1 + w / 100);
/** Dry density at a given air content: ρd = Gs ρw (1 − Av) / (1 + w Gs); Av = 0 is the zero-air-voids line. */
export const airVoids = (w: number, Gs: number, Av = 0, rhoW = 1) => (Gs * rhoW * (1 - Av)) / (1 + (w / 100) * Gs);
/** Degree of saturation (0 to 1) at water content w (%) and dry density ρd. */
export const saturation = (w: number, rhoD: number, Gs: number, rhoW = 1) => ((w / 100) * Gs) / ((Gs * rhoW) / rhoD - 1);

/** Fit the compaction curve and find the peak: maximum dry density and optimum water content. */
export function compaction(w: number[], rhoD: number[], deg = 2) {
  if (w.length < deg + 1) throw new Error(`A degree-${deg} curve needs at least ${deg + 1} points.`);
  const { c, r2 } = polyfit(w, rhoD, deg);
  const lo = Math.min(...w), hi = Math.max(...w);
  // Peak: the highest of the stationary points inside the data range and the two ends.
  const cands = [lo, hi];
  if (deg === 2) { if (c[2] < 0) cands.push(-c[1] / (2 * c[2])); }
  else {
    // Derivative roots by a fine scan and bisection.
    const d = (x: number) => c.slice(1).reduce((a, k, i) => a + (i + 1) * k * x ** i, 0);
    const N = 2000;
    for (let i = 0; i < N; i++) {
      let a = lo + ((hi - lo) * i) / N, b = lo + ((hi - lo) * (i + 1)) / N;
      if (d(a) > 0 && d(b) <= 0) { for (let k = 0; k < 100; k++) { const m = (a + b) / 2; if (d(m) > 0) a = m; else b = m; } cands.push((a + b) / 2); }
    }
  }
  let wOpt = NaN, best = -Infinity;
  for (const x of cands) if (x >= lo - 1e-12 && x <= hi + 1e-12) { const v = ev(c, x); if (v > best) { best = v; wOpt = x; } }
  const interior = wOpt > lo + 1e-9 && wOpt < hi - 1e-9;
  return { c, r2, wOpt, rhoMax: best, interior };
}
