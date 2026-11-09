// Vertical electrical sounding (VES): apparent resistivity from Schlumberger and Wenner readings, the layered-earth
// forward model by linear filters, and damped least-squares (Marquardt-Levenberg) inversion for n layers.
// Plain maths; no DOM. Resistivity in ohm·m, distances in m.
//
// Forward model. With the layered-earth kernel T(λ) (Pekeris recurrence) the potential at distance r from a point
// current source at the surface is (I/2π) F(r), F(r) = ∫ T(λ) J0(λr) dλ, and the ideal (MN → 0) Schlumberger
// apparent resistivity is S(s) = s² ∫ T(λ) J1(λs) λ dλ. Both are evaluated as sums over samples of T at
// λ_k = e^(a + kΔ)/r (10 samples per decade):  r·F(r) ≈ Σ c_k T(λ_k),  S(s) ≈ Σ d_k T(λ_k).
// The filter weights below were computed by fibub (not taken from any publication) by least squares, so that the
// sums reproduce the exact transforms of T = e^(−bλ) (r/√(b² + r²) and s³/(b² + s²)^(3/2)) for r/b from 10⁻⁴ to
// 10⁴, and T = 1 exactly (numpy.linalg.lstsq, 800 ratios, 100 weights). They are checked in the tests against the
// exact image series for two layers and against direct numerical integration with Bessel J0 and J1 (SciPy).

const J0F = { a: -9.0, d: Math.LN10 / 10, c: [8.296408398055e-2, -4.785694269700e-1, 1.299891107691, -2.221902414447, 2.707744931725, -2.533790361901, 1.921748454538, -1.234436801765, 6.995722007545e-1, -3.627264385059e-1, 1.793543258199e-1, -8.668844912075e-2, 4.353509085155e-2, -2.176561375570e-2, 1.309589026226e-2, -6.540608729197e-3, 5.997891576245e-3, -2.035618909089e-3, 4.448257382807e-3, 7.688114508297e-5, 4.737931488509e-3, 1.846114672182e-3, 6.147360775630e-3, 4.055906118198e-3, 8.760659264110e-3, 7.311320425721e-3, 1.305470399166e-2, 1.237279927395e-2, 1.989257458368e-2, 2.036322975615e-2, 3.065689910538e-2, 3.298209005452e-2, 4.744638525772e-2, 5.269870559142e-2, 7.316474162486e-2, 8.258034787329e-2, 1.107510521626e-1, 1.242445074326e-1, 1.586110164841e-1, 1.684792030262e-1, 1.928413722338e-1, 1.643682702719e-1, 1.213964128158e-1, -2.715075822106e-2, -1.964308917663e-1, -3.749037551424e-1, -2.166843812774e-1, 2.647868585369e-1, 4.072452203324e-1, -5.259872134585e-1, 2.657455049940e-1, -7.483134592592e-2, 3.614431895550e-3, 1.446193009031e-2, -1.683985955277e-2, 1.551009680917e-2, -1.358154869686e-2, 1.177631979683e-2, -1.022408996519e-2, 8.914036225184e-3, -7.808171552642e-3, 6.869255352136e-3, -6.066525835933e-3, 5.375743142894e-3, -4.778002830080e-3, 4.258509166193e-3, -3.805577796315e-3, 3.409883445334e-3, -3.063908527708e-3, 2.761544295127e-3, -2.497805435838e-3, 2.268629807999e-3, -2.070744548576e-3, 1.901587916136e-3, -1.759284024579e-3, 1.642676364198e-3, -1.551437863922e-3, 1.486294580960e-3, -1.449434739946e-3, 1.445241927940e-3, -1.481628797708e-3, 1.572544884295e-3, -1.742912282761e-3, 2.038896971491e-3, -2.550729177151e-3, 3.467366490696e-3, -5.219052211759e-3, 8.885427735333e-3, -1.747979188264e-2, 4.029062003180e-2, -1.067913054999e-1, 2.762376674232e-1, 1.800770018106e-2, -3.054066271717e-2, -3.110909300154e-2, -3.085014980343e-2, -3.085014980343e-2, -3.197518534877e-2, -3.106049999582e-2, -2.957507661993e-2] };
const J1F = { a: -8.0, d: Math.LN10 / 10, c: [5.851403820345e-5, -4.314373529044e-4, 1.552216633397e-3, -3.688099872214e-3, 6.622061249714e-3, -9.760328683448e-3, 1.252798020420e-2, -1.464847895482e-2, 1.615128208738e-2, -1.723003903797e-2, 1.810704927008e-2, -1.896383870427e-2, 1.992645095203e-2, -2.107601101389e-2, 2.246557197085e-2, -2.413217563356e-2, 2.610741359667e-2, -2.841856703043e-2, 3.110047219673e-2, -3.418111913511e-2, 3.771592216893e-2, -4.172243586949e-2, 4.631344280763e-2, -5.143534623648e-2, 5.739456483250e-2, -6.381208714722e-2, 7.171419196019e-2, -7.937210573080e-2, 9.060560152967e-2, -9.825792282200e-2, 1.170984706830e-1, -1.184809427395e-1, 1.598770477214e-1, -1.292454014096e-1, 2.465197122221e-1, -8.999532270808e-2, 4.565723707646e-1, 1.000136989825e-1, 9.039801093847e-1, 3.643610956030e-1, 9.597922285381e-1, -1.143730716768, -1.578347950908, -1.869541067975, 5.581646629178, -4.107966278707, 1.262951796604, 2.277881851138e-1, -6.324307658916e-1, 6.390542037523e-1, -5.565780084861e-1, 4.712833586396e-1, -3.996115698937e-1, 3.416014493515e-1, -2.945497495040e-1, 2.559233788888e-1, -2.237852868156e-1, 1.967180285936e-1, -1.736867495178e-1, 1.539270007407e-1, -1.368645205139e-1, 1.220601112312e-1, -1.091722151085e-1, 9.793127142154e-2, -8.812181171221e-2, 7.957002001922e-2, -7.213532769067e-2, 6.570475518476e-2, -6.018916861218e-2, 5.552139716288e-2, -5.165642998630e-2, 4.857380965664e-2, -4.628287312487e-2, 4.483282020383e-2, -4.433122537778e-2, 4.497747195078e-2, -4.712465369603e-2, 5.139984876401e-2, -5.895076481820e-2, 7.198403887399e-2, -9.503151279791e-2, 1.382012541577e-1, -2.264044876789e-1, 4.286942079195e-1, -9.638318333307e-1, 2.627576881710, -8.601971771632, 2.905902735640e1, 1.268137317286, -2.097722108627, -2.157819070788, -2.157733385854, -2.157733385854, -2.157733385854, -2.157733385854, -2.157733385854, -2.157733385854, -2.157976240337, -2.157363701531, -2.157234225163] };

export type Model = { rho: number[]; h: number[] };

/** Layered-earth resistivity kernel T(λ) by the Pekeris recurrence, from the bottom half-space up. */
export function kernel(lam: number, m: Model): number {
  let t = m.rho[m.rho.length - 1];
  for (let i = m.h.length - 1; i >= 0; i--) { const th = Math.tanh(lam * m.h[i]); t = (t + m.rho[i] * th) / (1 + (t * th) / m.rho[i]); }
  return t;
}
const filt = (f: { a: number; d: number; c: number[] }, r: number, m: Model) => {
  let s = 0; for (let k = 0; k < f.c.length; k++) s += f.c[k] * kernel(Math.exp(f.a + k * f.d) / r, m);
  return s;
};
/** r·F(r): the pole-pole apparent resistivity at spacing r. */
export const polePole = (r: number, m: Model) => filt(J0F, r, m);
/** Ideal Schlumberger apparent resistivity (MN → 0) at AB/2 = s. */
export const schlumbergerIdeal = (s: number, m: Model) => filt(J1F, s, m);
/** Schlumberger apparent resistivity with AB/2 = L and MN/2 = l (exact for a finite MN). */
export function schlumberger(L: number, l: number, m: Model): number {
  if (!(l > 0)) return schlumbergerIdeal(L, m);
  return ((L * L - l * l) / (2 * l)) * (polePole(L - l, m) / (L - l) - polePole(L + l, m) / (L + l));
}
/** Wenner apparent resistivity at electrode spacing a: 2·P(a) − P(2a). */
export const wenner = (a: number, m: Model) => 2 * polePole(a, m) - polePole(2 * a, m);

/** Geometric factors: Schlumberger K = π(L² − l²)/(2l); Wenner K = 2πa. */
export const kSchlumberger = (L: number, l: number) => (Math.PI * (L * L - l * l)) / (2 * l);
export const kWenner = (a: number) => 2 * Math.PI * a;

export type Reading = { s: number; l?: number; rhoa: number };
export type Array_ = 'schlumberger' | 'wenner';
export const forward = (arr: Array_, d: { s: number; l?: number }, m: Model) => (arr === 'wenner' ? wenner(d.s, m) : schlumberger(d.s, d.l ?? 0, m));

/** A starting model with n layers from the curve: interfaces log-spaced between the shortest and longest spacings. */
export function startModel(data: Reading[], n: number): Model {
  const s = data.map((d) => d.s), lo = Math.min(...s), hi = Math.max(...s);
  const at = (x: number) => { // apparent resistivity interpolated in log-log at spacing x
    const ds = data.slice().sort((p, q) => p.s - q.s);
    if (x <= ds[0].s) return ds[0].rhoa; if (x >= ds[ds.length - 1].s) return ds[ds.length - 1].rhoa;
    for (let i = 1; i < ds.length; i++) if (x <= ds[i].s) { const f = Math.log(x / ds[i - 1].s) / Math.log(ds[i].s / ds[i - 1].s); return Math.exp(Math.log(ds[i - 1].rhoa) + f * Math.log(ds[i].rhoa / ds[i - 1].rhoa)); }
    return ds[ds.length - 1].rhoa;
  };
  const z = Array.from({ length: n - 1 }, (_, i) => lo * 1.5 * (hi / 3 / (lo * 1.5)) ** (n > 2 ? i / (n - 2) : 0));
  const h = z.map((v, i) => v - (i ? z[i - 1] : 0));
  const mid = [0, ...z, hi * 2].slice(0, n).map((v, i) => (i === 0 ? lo : Math.sqrt(Math.max(v, lo) * (i < n - 1 ? z[i] : hi))));
  return { rho: mid.map(at), h: h.map((v) => Math.max(v, lo * 0.2)) };
}

/**
 * Damped least-squares inversion (Marquardt-Levenberg) of log apparent resistivity for the log resistivities and
 * log thicknesses of n layers, from a starting model. Returns the model, the RMS misfit in log units (×100 ≈ %),
 * the fitted curve and each parameter's standard error as a factor (×/÷).
 */
export function invert(arr: Array_, data: Reading[], m0: Model, opts: { maxIter?: number } = {}) {
  const n = m0.rho.length, np = 2 * n - 1;
  if (data.length < np + 1) throw new Error(`Need at least ${np + 1} readings to fit ${n} layers`);
  const toM = (p: number[]): Model => ({ rho: p.slice(0, n).map(Math.exp), h: p.slice(n).map(Math.exp) });
  const y = data.map((d) => Math.log(d.rhoa));
  const fwd = (p: number[]) => { const m = toM(p); return data.map((d) => Math.log(forward(arr, d, m))); };
  let p = [...m0.rho.map(Math.log), ...m0.h.map(Math.log)];
  let r = fwd(p).map((v, i) => y[i] - v), c = r.reduce((s, v) => s + v * v, 0), lambda = 0.01, it = 0;
  const jac = (q: number[]) => {
    const J = data.map(() => new Array(np).fill(0));
    for (let j = 0; j < np; j++) { const qp = q.slice(), qm = q.slice(); qp[j] += 1e-5; qm[j] -= 1e-5; const a = fwd(qp), b = fwd(qm); data.forEach((_, i) => { J[i][j] = (a[i] - b[i]) / 2e-5; }); }
    return J;
  };
  const solve = (A: number[][], g: number[]) => { // Gaussian elimination with partial pivoting
    const M = A.map((row, i) => [...row, g[i]]), k = g.length;
    for (let i = 0; i < k; i++) { let pv = i; for (let j = i + 1; j < k; j++) if (Math.abs(M[j][i]) > Math.abs(M[pv][i])) pv = j; [M[i], M[pv]] = [M[pv], M[i]]; if (Math.abs(M[i][i]) < 1e-300) return null; for (let j = i + 1; j < k; j++) { const f = M[j][i] / M[i][i]; for (let l = i; l <= k; l++) M[j][l] -= f * M[i][l]; } }
    const x = new Array(k).fill(0); for (let i = k - 1; i >= 0; i--) { let s = M[i][k]; for (let j = i + 1; j < k; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; } return x;
  };
  for (; it < (opts.maxIter ?? 200); it++) {
    const J = jac(p);
    const A = Array.from({ length: np }, (_, a) => Array.from({ length: np }, (_, b) => J.reduce((s, row) => s + row[a] * row[b], 0)));
    const g = Array.from({ length: np }, (_, a) => J.reduce((s, row, i) => s + row[a] * r[i], 0));
    let improved = false, small = false;
    for (let tries = 0; tries < 30; tries++) {
      const d = solve(A.map((row, i) => row.map((v, j) => (i === j ? v * (1 + lambda) + lambda * 1e-6 : v))), g);
      if (d) {
        const step = Math.max(...d.map(Math.abs)), sc = step > 1.5 ? 1.5 / step : 1; // at most a factor e^1.5 per step
        const q = p.map((v, i) => v + d[i] * sc), rq = fwd(q).map((v, i) => y[i] - v), cq = rq.reduce((s, v) => s + v * v, 0);
        if (Number.isFinite(cq) && cq <= c) { small = (c - cq) <= 1e-12 * Math.max(c, 1e-30) || step * sc < 1e-9; p = q; r = rq; c = cq; lambda = Math.max(lambda / 5, 1e-10); improved = true; break; }
      }
      lambda *= 5;
    }
    if (!improved || small) break;
  }
  const J = jac(p), df = data.length - np;
  const A = Array.from({ length: np }, (_, a) => Array.from({ length: np }, (_, b) => J.reduce((s, row) => s + row[a] * row[b], 0)));
  const s2 = df > 0 ? c / df : NaN;
  const se = Array.from({ length: np }, (_, j) => { const e = new Array(np).fill(0); e[j] = 1; const col = solve(A, e); return col && df > 0 ? Math.exp(Math.sqrt(Math.max(0, col[j] * s2))) : NaN; });
  const model = toM(p);
  return { model, rms: Math.sqrt(c / data.length), iterations: it, fitted: data.map((d) => forward(arr, d, model)), seRho: se.slice(0, n), seH: se.slice(n) };
}
