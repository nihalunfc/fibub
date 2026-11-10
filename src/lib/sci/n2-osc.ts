// School oscillation maths for the Learn tools pendulum-lab, spring-mass and forced-oscillations. Plain maths, no DOM.

/** Small-swing period of a simple pendulum, T₀ = 2π √(L/g). */
export const smallPeriod = (L: number, g: number) => 2 * Math.PI * Math.sqrt(L / g);
/** Arithmetic–geometric mean. */
export function agm(a: number, b: number) {
  for (let i = 0; i < 60 && Math.abs(a - b) > 1e-15 * a; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return (a + b) / 2;
}
/** Exact period for amplitude θ₀ (radians): T = T₀ / AGM(1, cos(θ₀/2)) (the complete elliptic integral form). */
export const exactPeriod = (L: number, g: number, th0: number) => smallPeriod(L, g) / agm(1, Math.cos(th0 / 2));
/** How much longer the real period is than the small-swing formula, as a fraction (T − T₀)/T₀. */
export const largeAngleExcess = (th0: number) => 1 / agm(1, Math.cos(th0 / 2)) - 1;
/** One RK4 step of θ'' = −(g/L) sin θ (and an optional damping term −b θ'). */
export function pendulumStep(th: number, w: number, dt: number, g: number, L: number, b = 0) {
  const f = (t: number, v: number) => -(g / L) * Math.sin(t) - b * v;
  const k1t = w, k1w = f(th, w);
  const k2t = w + (dt / 2) * k1w, k2w = f(th + (dt / 2) * k1t, w + (dt / 2) * k1w);
  const k3t = w + (dt / 2) * k2w, k3w = f(th + (dt / 2) * k2t, w + (dt / 2) * k2w);
  const k4t = w + dt * k3w, k4w = f(th + dt * k3t, w + dt * k3w);
  return { th: th + (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t), w: w + (dt / 6) * (k1w + 2 * k2w + 2 * k3w + k4w) };
}
/** Length that gives period T: L = g T² / 4π². */
export const lengthFor = (T: number, g: number) => (g * T * T) / (4 * Math.PI * Math.PI);
/** g from one length and period: g = 4π² L / T². */
export const gFrom = (L: number, T: number) => (4 * Math.PI * Math.PI * L) / (T * T);

/** Least-squares straight line y = a + b x, with standard errors and r². */
export function fitLine(xs: number[], ys: number[]) {
  const n = xs.length, mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); syy += (ys[i] - my) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  const sse = Math.max(0, syy - b * sxy), s2 = n > 2 ? sse / (n - 2) : NaN;
  return { a, b, se_b: Math.sqrt(s2 / sxx), se_a: Math.sqrt(s2 * (1 / n + (mx * mx) / sxx)), r2: syy > 0 ? (b * sxy) / syy : 1, n };
}
/** Fit T² = (4π²/g) L + c to (L, T) readings: g and its standard error, and the intercept c. */
export function fitG(Ls: number[], Ts: number[]) {
  const f = fitLine(Ls, Ts.map((T) => T * T)), k = 4 * Math.PI * Math.PI;
  return { ...f, g: k / f.b, se_g: (k / (f.b * f.b)) * f.se_b };
}

// ---- Springs ----
/** Springs in series: 1/k = Σ 1/kᵢ. In parallel: k = Σ kᵢ. */
export const kSeries = (ks: number[]) => 1 / ks.reduce((s, k) => s + 1 / k, 0);
export const kParallel = (ks: number[]) => ks.reduce((s, k) => s + k, 0);
/** Period of a mass on a spring, T = 2π √(m/k). */
export const springT = (m: number, k: number) => 2 * Math.PI * Math.sqrt(m / k);
/** Static stretch of a hanging mass: x = m g / k. */
export const staticStretch = (m: number, k: number, g = 9.8) => (m * g) / k;

// ---- Damped and driven oscillator: m x'' + b x' + k x = F₀ cos(ω t) ----
/** Natural angular frequency ω₀ = √(k/m), damping ratio ζ = b / (2√(km)), damped ω_d = ω₀ √(1 − ζ²). */
export function oscParams(m: number, k: number, b: number) {
  const w0 = Math.sqrt(k / m), zeta = b / (2 * Math.sqrt(k * m));
  return { w0, zeta, wd: zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0, Q: zeta > 0 ? 1 / (2 * zeta) : Infinity, tau: b > 0 ? (2 * m) / b : Infinity };
}
/** Steady-state amplitude and phase lag of the driven oscillator. */
export function drivenResponse(m: number, k: number, b: number, F0: number, w: number) {
  const re = k - m * w * w, im = b * w, A = F0 / Math.hypot(re, im);
  return { A, phase: Math.atan2(im, re) };   // lag 0 … π
}
/** Driving frequency of the largest amplitude: ω_r = ω₀ √(1 − 2ζ²) (none if ζ ≥ 1/√2). */
export function resonanceW(m: number, k: number, b: number) {
  const { w0, zeta } = oscParams(m, k, b);
  return 2 * zeta * zeta < 1 ? w0 * Math.sqrt(1 - 2 * zeta * zeta) : 0;
}
/** One RK4 step of m x'' + b x' + k x = F₀ cos(ω t). */
export function drivenStep(x: number, v: number, t: number, dt: number, m: number, k: number, b: number, F0: number, w: number) {
  const a = (tt: number, xx: number, vv: number) => (F0 * Math.cos(w * tt) - b * vv - k * xx) / m;
  const k1x = v, k1v = a(t, x, v);
  const k2x = v + (dt / 2) * k1v, k2v = a(t + dt / 2, x + (dt / 2) * k1x, v + (dt / 2) * k1v);
  const k3x = v + (dt / 2) * k2v, k3v = a(t + dt / 2, x + (dt / 2) * k2x, v + (dt / 2) * k2v);
  const k4x = v + dt * k3v, k4v = a(t + dt, x + dt * k3x, v + dt * k3v);
  return { x: x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x), v: v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v) };
}
