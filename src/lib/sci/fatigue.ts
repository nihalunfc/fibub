// Stress-life (S-N) fatigue: Basquin fit on log-log axes, endurance estimates, mean-stress corrections (Goodman,
// Gerber, Soderberg, Morrow) with the load-line safety factor, and Palmgren-Miner damage for a load spectrum.
// Formulas follow the usual textbook forms (Shigley's Mechanical Engineering Design, ch. 6; Dowling, Mechanical
// Behavior of Materials, ch. 9 and 10; Stephens et al., Metal Fatigue in Engineering, ch. 4), written by fibub.
import { fitLine } from './fit.ts';

export type Basquin = {
  /** σa = A·N^b (N in cycles). */
  A: number; b: number;
  /** σa = σf'·(2N)^b (2N in reversals). */
  sf: number;
  r2: number; n: number; runouts: number;
  /** Standard deviation of log10 N about the line (when log N is the response) or of log10 S. */
  sLog: number; mode: 'logN' | 'logS';
};

/**
 * Fit Basquin's law to stress amplitudes S and lives N. mode 'logN' regresses log N on log S (stress is the
 * controlled variable, as ASTM E739 recommends); 'logS' regresses log S on log N. Points flagged as run-outs are
 * left out of the fit.
 */
export function fitBasquin(S: number[], N: number[], runout: boolean[] = [], mode: 'logN' | 'logS' = 'logN'): Basquin {
  const idx = S.map((_, i) => i).filter((i) => !runout[i]);
  if (idx.length < 3) throw new Error('Need at least three failed specimens (not run-outs) to fit a line.');
  if (idx.some((i) => !(S[i] > 0 && N[i] > 0))) throw new Error('Stresses and lives must all be above zero.');
  const ls = idx.map((i) => Math.log10(S[i])), ln = idx.map((i) => Math.log10(N[i]));
  let A: number, b: number, r2: number, sLog: number;
  if (mode === 'logN') {
    const L = fitLine(ls, ln); // log N = c + d log S
    if (!(L.slope < 0)) throw new Error('Life does not fall as stress rises: check the columns.');
    b = 1 / L.slope; A = 10 ** (-L.intercept / L.slope); r2 = L.r2; sLog = L.syx;
  } else {
    const L = fitLine(ln, ls); // log S = log A + b log N
    if (!(L.slope < 0)) throw new Error('Stress does not fall as life rises: check the columns.');
    b = L.slope; A = 10 ** L.intercept; r2 = L.r2; sLog = L.syx;
  }
  return { A, b, sf: A * 2 ** -b, r2, n: idx.length, runouts: S.length - idx.length, sLog, mode };
}

/** Stress amplitude at life N from the fit, and the life at a stress amplitude. */
export const stressAt = (f: Pick<Basquin, 'A' | 'b'>, N: number) => f.A * N ** f.b;
export const lifeAt = (f: Pick<Basquin, 'A' | 'b'>, S: number) => (S / f.A) ** (1 / f.b);

/** Rule-of-thumb endurance limit of a polished steel test bar (Shigley eq. 6-8): 0.5 Su up to 1400 MPa, then 700 MPa. */
export const steelEndurance = (Su: number) => (Su <= 1400 ? 0.5 * Su : 700);

export type Method = 'goodman' | 'gerber' | 'soderberg' | 'morrow';
export const METHODS: Method[] = ['goodman', 'gerber', 'soderberg', 'morrow'];
export const METHOD_NAME: Record<Method, string> = { goodman: 'Goodman', gerber: 'Gerber', soderberg: 'Soderberg', morrow: 'Morrow' };

/** The strength that ends each line on the mean-stress axis. */
const limit = (m: Method, p: { Su: number; Sy: number; sf: number }) => (m === 'soderberg' ? p.Sy : m === 'morrow' ? p.sf : p.Su);

/**
 * Equivalent fully reversed stress amplitude σar (the amplitude at zero mean stress that does the same damage).
 * Goodman σa/(1 − σm/Su), Gerber σa/(1 − (σm/Su)²), Soderberg σa/(1 − σm/Sy), Morrow σa/(1 − σm/σf').
 * Infinity when the mean stress reaches the limit. Compressive mean stress: Gerber is symmetric and so gives no
 * benefit; the others give a lower σar (many designers then take σar = σa to be safe).
 */
export function equivalent(m: Method, sa: number, sm: number, p: { Su: number; Sy: number; sf: number }): number {
  const L = limit(m, p);
  const d = m === 'gerber' ? 1 - (sm / L) ** 2 : 1 - sm / L;
  return d > 0 ? sa / d : Infinity;
}

/**
 * Safety factor along a load line through the origin (σa and σm grow in proportion), against fatigue strength Se:
 * Goodman 1/n = σa/Se + σm/Su (Soderberg with Sy, Morrow with σf'); Gerber n = ½ (Su/σm)² (σa/Se)
 * [−1 + √(1 + (2 σm Se / (Su σa))²)] (Shigley table 6-7). With σm ≤ 0, n = Se/σa.
 */
export function safety(m: Method, sa: number, sm: number, Se: number, p: { Su: number; Sy: number; sf: number }): number {
  if (sm <= 0) return Se / sa;
  const L = limit(m, p);
  if (m === 'gerber') return 0.5 * (L / sm) ** 2 * (sa / Se) * (-1 + Math.sqrt(1 + ((2 * sm * Se) / (L * sa)) ** 2));
  return 1 / (sa / Se + sm / L);
}

/** First-cycle yield check (Langer line): n = Sy / (σa + |σm|). */
export const yieldSafety = (sa: number, sm: number, Sy: number) => Sy / (sa + Math.abs(sm));

/** Points of each line on the Haigh diagram (σm on x, σa on y), from σm = 0 to the line's limit. */
export function haighLine(m: Method, Se: number, p: { Su: number; Sy: number; sf: number }, steps = 60): { x: number[]; y: number[] } {
  const L = limit(m, p), x: number[] = [], y: number[] = [];
  for (let k = 0; k <= steps; k++) { const sm = (L * k) / steps; x.push(sm); y.push(m === 'gerber' ? Se * (1 - (sm / L) ** 2) : Se * (1 - sm / L)); }
  return { x, y };
}

export type Block = { sa: number; sm: number; n: number };
export type MinerRow = Block & { sar: number; N: number; d: number };

/**
 * Palmgren-Miner damage D = Σ nᵢ/Nᵢ. Each block's amplitude is first turned into an equivalent fully reversed
 * amplitude (method, or none), then Nᵢ comes from the Basquin fit. With an endurance limit Se, blocks whose
 * equivalent amplitude is below Se do no damage (Nᵢ = ∞); without one the line is extended.
 */
export function miner(blocks: Block[], f: Pick<Basquin, 'A' | 'b'>, o: { method: Method | 'none'; Su: number; Sy: number; sf: number; Se?: number }) {
  const rows: MinerRow[] = blocks.map((bk) => {
    const sar = o.method === 'none' ? bk.sa : equivalent(o.method, bk.sa, bk.sm, o);
    const N = !Number.isFinite(sar) ? 0 : o.Se !== undefined && sar < o.Se ? Infinity : lifeAt(f, sar);
    return { ...bk, sar, N, d: N === 0 ? Infinity : bk.n / N };
  });
  const D = rows.reduce((s, r) => s + r.d, 0);
  return { rows, D, repeats: D > 0 ? 1 / D : Infinity };
}

/** A made-up S-N data set (not any real material): σa = 900 N^−0.09 MPa with scatter in life, plus two run-outs. */
export function exampleSN(): { S: number[]; N: number[]; runout: boolean[] } {
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const gauss = () => { const u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const S = [480, 480, 420, 420, 380, 380, 340, 340, 300, 300, 270, 270, 240, 240];
  const N = S.map((s) => Math.round((s / 900) ** (1 / -0.09) * 10 ** (0.15 * gauss())));
  return { S: [...S, 215, 215], N: [...N, 1e7, 1e7], runout: [...S.map(() => false), true, true] };
}
