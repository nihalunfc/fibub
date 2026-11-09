// Linear Kalman filter for one measured quantity: a constant (random-walk) model or a constant-velocity model,
// with a seeded simulator for noisy measurements. Plain maths, no DOM.

export type Model = 'constant' | 'cv';
export type KStep = { t: number; z: number; x: number; v: number; P: number; Pv: number; nu: number; S: number; K: number; Kv: number; xPrior: number; PPrior: number };

/** Small seeded generator (mulberry32) with Box–Muller normal draws. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let spare: number | null = null;
  const n = () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    let p = 0, q = 0;
    while (p === 0) p = u();
    q = u();
    const r = Math.sqrt(-2 * Math.log(p)), th = 2 * Math.PI * q;
    spare = r * Math.sin(th);
    return r * Math.cos(th);
  };
  return { u, n };
}

/** Simulated truth and measurements. Constant model: the true value takes random steps of variance q·dt. Constant velocity: white acceleration of spectral density q (velocity steps of variance q·dt). */
export function simulate(model: Model, N: number, dt: number, q: number, sigma: number, x0: number, v0: number, seed: number) {
  const g = rng(seed), t: number[] = [], truth: number[] = [], z: number[] = [];
  let x = x0, v = v0;
  for (let k = 0; k < N; k++) {
    if (k > 0) {
      if (model === 'constant') x += Math.sqrt(q * dt) * g.n();
      else { const a = Math.sqrt(q / dt) * g.n(); x += v * dt + 0.5 * a * dt * dt; v += a * dt; }
    }
    t.push(k * dt); truth.push(x); z.push(x + sigma * g.n());
  }
  return { t, truth, z };
}

/** Run the filter. q: process noise (variance per unit time for the constant model; acceleration spectral density for constant velocity). R: measurement variance. Starts at the first measurement with variance R and velocity 0 with variance V0. */
export function kalman(model: Model, t: number[], z: number[], q: number, R: number, V0 = 1): KStep[] {
  if (t.length !== z.length || t.length < 2) throw new Error('Need at least two measurements.');
  if (!(q >= 0 && R > 0)) throw new Error('Q must be 0 or more and R above zero.');
  const out: KStep[] = [];
  // State and covariance [[a, b], [b, d]].
  let x = z[0], v = 0, a = R, b = 0, d = model === 'cv' ? V0 : 0;
  out.push({ t: t[0], z: z[0], x, v, P: a, Pv: d, nu: 0, S: NaN, K: 1, Kv: 0, xPrior: NaN, PPrior: NaN });
  for (let k = 1; k < z.length; k++) {
    const dt = t[k] - t[k - 1];
    if (!(dt > 0)) throw new Error('Times must increase.');
    // Predict.
    if (model === 'constant') { a += q * dt; }
    else {
      x += v * dt;
      const a1 = a + 2 * dt * b + dt * dt * d + (q * dt ** 3) / 3, b1 = b + dt * d + (q * dt * dt) / 2, d1 = d + q * dt;
      a = a1; b = b1; d = d1;
    }
    const xPrior = x, PPrior = a;
    // Update.
    const nu = z[k] - x, S = a + R, K = a / S, Kv = b / S;
    x += K * nu; v += Kv * nu;
    const a2 = (1 - K) * a, b2 = (1 - K) * b, d2 = d - Kv * b;
    a = a2; b = b2; d = d2;
    out.push({ t: t[k], z: z[k], x, v, P: a, Pv: d, nu, S, K, Kv, xPrior, PPrior });
  }
  return out;
}

/** Summary: RMS errors against the truth (if given) and the mean normalised innovation squared (about 1 when Q and R suit the data). */
export function summary(steps: KStep[], truth?: number[]) {
  const s = steps.slice(1), n = s.length;
  const nis = s.reduce((acc, k) => acc + (k.nu * k.nu) / k.S, 0) / n;
  const out = { nis, rmsEst: NaN, rmsMeas: NaN, inside2: NaN };
  if (truth) {
    out.rmsEst = Math.sqrt(steps.reduce((acc, k, i) => acc + (k.x - truth[i]) ** 2, 0) / steps.length);
    out.rmsMeas = Math.sqrt(steps.reduce((acc, k, i) => acc + (k.z - truth[i]) ** 2, 0) / steps.length);
    out.inside2 = steps.filter((k, i) => Math.abs(k.x - truth[i]) <= 2 * Math.sqrt(k.P)).length / steps.length;
  }
  return out;
}

/** Steady-state gain of the constant model for step dt: solves P = (P + qdt) − (P + qdt)²/(P + qdt + R). */
export function steadyGainConstant(q: number, R: number, dt: number) {
  const Qd = q * dt; // prior Pp satisfies Pp² − Qd·Pp − Qd·R = 0
  const Pp = (Qd + Math.sqrt(Qd * Qd + 4 * Qd * R)) / 2;
  return Pp / (Pp + R);
}
