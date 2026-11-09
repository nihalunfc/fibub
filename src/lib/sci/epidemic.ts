// Compartmental epidemic models (SIR, SEIR, SEIRS) for teaching, integrated with fixed-step RK4.
// Kermack and McKendrick (1927), Proc. R. Soc. A 115: 700-721; SEIR and SEIRS as in Anderson and May (1991),
// "Infectious Diseases of Humans", and Keeling and Rohani (2008), "Modeling Infectious Diseases".
// β(t) = R0 / D × (1 − cut(t)), σ = 1 / latent period, γ = 1 / infectious period, ω = 1 / immunity duration.

export type Model = 'SIR' | 'SEIR' | 'SEIRS';
export type Intervention = { from: number; to: number; cut: number };
export type EpiInput = {
  model: Model; N: number; R0: number;
  latent: number; infectious: number; immunity?: number;
  I0: number; vacc: number; days: number;
  interventions?: Intervention[]; dt?: number;
};
export type EpiResult = {
  t: number[]; S: number[]; E: number[]; I: number[]; R: number[];
  /** Cumulative new infections since day 0 (not counting the initial cases). */
  C: number[];
  /** New infections on each day (C[d] − C[d−1]; 0 for day 0). */
  daily: number[];
  peakDay: number; peakI: number; peakE: number;
  /** New infections over the whole run. */
  infected: number;
  /** Share of the population infected during the run, counting the initial cases. */
  attack: number;
  S0: number; Re0: number; hit: number;
};

/** Contact reduction (0..1) in force at time t: interventions apply on from ≤ t < to; overlapping ones multiply. */
export function cutAt(t: number, list: Intervention[] = []): number {
  let keep = 1;
  for (const v of list) if (t >= v.from && t < v.to) keep *= 1 - v.cut;
  return 1 - keep;
}

export function validate(p: EpiInput): string | null {
  if (!(p.N >= 1) || !Number.isFinite(p.N)) return 'Population must be at least 1.';
  if (p.N > 1e10) return 'Population is too large (up to 10 billion).';
  if (!(p.R0 > 0) || p.R0 > 100) return 'R0 must be above 0 and at most 100.';
  if (!(p.infectious > 0) || p.infectious > 3650) return 'The infectious period must be above 0 days.';
  if (p.model !== 'SIR' && (!(p.latent > 0) || p.latent > 3650)) return 'The latent period must be above 0 days.';
  if (p.model === 'SEIRS' && (!(p.immunity! > 0) || p.immunity! > 1e5)) return 'Immunity must last more than 0 days.';
  if (!(p.I0 > 0)) return 'Start with at least some infectious people (initial cases above 0).';
  if (!(p.vacc >= 0 && p.vacc < 1)) return 'The vaccinated share must be from 0 to below 100 %.';
  if (p.I0 > p.N * (1 - p.vacc)) return 'Initial cases are more than the unvaccinated population.';
  if (!(p.days >= 1 && p.days <= 3650) || !Number.isInteger(p.days)) return 'Days to run must be a whole number from 1 to 3650.';
  for (const v of p.interventions ?? []) {
    if (!(v.to > v.from) || v.from < 0) return 'Each intervention needs a start day and a later end day.';
    if (!(v.cut >= 0 && v.cut <= 1)) return 'Contact reduction must be from 0 to 100 %.';
  }
  return null;
}

/** Run the model. Vaccinated people start in R (fully protected); initial cases start infectious. */
export function simulate(p: EpiInput): EpiResult {
  const bad = validate(p); if (bad) throw new Error(bad);
  const { N, model } = p;
  const gamma = 1 / p.infectious, sigma = model === 'SIR' ? 0 : 1 / p.latent;
  const omega = model === 'SEIRS' ? 1 / p.immunity! : 0;
  const beta0 = p.R0 * gamma, ivs = p.interventions ?? [];
  // Steps per day: fine enough for RK4 to be accurate to many digits for periods of a day or more.
  const minPeriod = Math.min(p.infectious, model === 'SIR' ? Infinity : p.latent, model === 'SEIRS' ? p.immunity! : Infinity);
  const per = Math.max(10, Math.ceil(1 / (p.dt ?? Math.min(0.1, minPeriod / 20))));
  const h = 1 / per;
  const V = N * p.vacc, S0 = N - V - p.I0;
  // State: S, E, I, R, C (cumulative new infections).
  const f = (y: number[], beta: number): number[] => {
    const [S, E, I, R] = y, inf = beta * S * I / N;
    return model === 'SIR'
      ? [-inf + omega * R, 0, inf - gamma * I, gamma * I - omega * R, inf]
      : [-inf + omega * R, inf - sigma * E, sigma * E - gamma * I, gamma * I - omega * R, inf];
  };
  let y = [S0, 0, p.I0, V, 0];
  const out: EpiResult = { t: [0], S: [y[0]], E: [0], I: [y[2]], R: [y[3]], C: [0], daily: [0], peakDay: 0, peakI: y[2], peakE: 0, infected: 0, attack: 0, S0, Re0: p.R0 * S0 / N, hit: Math.max(0, 1 - 1 / p.R0) };
  const Is: number[] = [y[2]];
  for (let d = 0; d < p.days; d++) {
    for (let k = 0; k < per; k++) {
      const t = d + k * h;
      // β is held constant within a step; interventions start and end on whole days, which are step edges.
      const beta = beta0 * (1 - cutAt(t + h / 2, ivs));
      const k1 = f(y, beta);
      const k2 = f(y.map((v, i) => v + h / 2 * k1[i]), beta);
      const k3 = f(y.map((v, i) => v + h / 2 * k2[i]), beta);
      const k4 = f(y.map((v, i) => v + h * k3[i]), beta);
      y = y.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      Is.push(y[2]);
    }
    out.t.push(d + 1); out.S.push(y[0]); out.E.push(y[1]); out.I.push(y[2]); out.R.push(y[3]); out.C.push(y[4]);
    out.daily.push(y[4] - out.C[d]);
    out.peakE = Math.max(out.peakE, y[1]);
  }
  // Peak: the largest step value, refined with a parabola through it and its two neighbours.
  let j = 0; for (let i = 1; i < Is.length; i++) if (Is[i] > Is[j]) j = i;
  out.peakDay = j * h; out.peakI = Is[j];
  if (j > 0 && j < Is.length - 1) {
    const a = Is[j - 1], b = Is[j], c = Is[j + 1], den = a - 2 * b + c;
    if (den < 0) { const off = 0.5 * (a - c) / den; out.peakDay = (j + off) * h; out.peakI = b - 0.25 * (a - c) * off; }
  }
  out.infected = y[4];
  out.attack = (y[4] + p.I0) / N;
  return out;
}

/**
 * The SIR (and SEIR) final size without interventions or waning immunity: the share s∞ of the population
 * still susceptible at the end solves s∞ = s0 · exp(−R0 · (1 − v − s∞)), where s0 is the susceptible share
 * at the start and v the vaccinated share (Kermack and McKendrick 1927). Returns the share ever infected,
 * counting the initial cases: 1 − v − s∞.
 */
export function finalSize(R0: number, s0: number, vacc = 0): { sInf: number; attack: number } {
  const g = (s: number) => s - s0 * Math.exp(-R0 * (1 - vacc - s));
  // g(0) < 0 and g(s0) ≥ 0: bisection then Newton polish.
  let lo = 0, hi = s0;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; if (hi - lo < 1e-15) break; }
  let s = (lo + hi) / 2;
  for (let i = 0; i < 5; i++) { const d = 1 - R0 * s0 * Math.exp(-R0 * (1 - vacc - s)); if (d !== 0) s -= g(s) / d; }
  return { sInf: s, attack: 1 - vacc - s };
}

/** Parse interventions from lines like "30, 60, 40" (from day, to day, % contact cut). */
export function parseInterventions(text: string): { list: Intervention[]; error: string | null } {
  const list: Intervention[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const l of lines) {
    const parts = l.split(/[\s,;\t]+/).filter(Boolean).map((s) => Number(s.replace('%', '')));
    if (parts.length !== 3 || parts.some((v) => !Number.isFinite(v))) return { list, error: `Could not read "${l}". Write: from day, to day, % contact cut.` };
    const [from, to, cut] = parts;
    if (!(to > from) || from < 0) return { list, error: `"${l}": the end day must be after the start day.` };
    if (!(cut >= 0 && cut <= 100)) return { list, error: `"${l}": the contact cut must be from 0 to 100 %.` };
    if (!Number.isInteger(from) || !Number.isInteger(to)) return { list, error: `"${l}": use whole days.` };
    list.push({ from, to, cut: cut / 100 });
  }
  if (list.length > 10) return { list, error: 'Up to 10 interventions.' };
  return { list, error: null };
}
