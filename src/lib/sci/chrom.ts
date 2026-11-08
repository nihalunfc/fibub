// Chromatography: retention factor, selectivity, resolution and plate count (USP and Ph. Eur. formulas), the
// Purnell equation, and geometric method transfer between column sizes (USP <621>).

export type WidthKind = 'base' | 'half';
export const retentionFactor = (tR: number, t0: number) => (tR - t0) / t0;
/** Plate number: tangent baseline width N = 16(tR/W)², or half-height width N = 5.54(tR/W½)². */
export const plates = (tR: number, w: number, kind: WidthKind) => (kind === 'base' ? 16 : 5.545) * (tR / w) ** 2;
/** Resolution: USP 2(t2 − t1)/(W1 + W2) from baseline widths; Ph. Eur. 1.18(t2 − t1)/(W½1 + W½2) from half-height widths. */
export const resolution = (t1: number, t2: number, w1: number, w2: number, kind: WidthKind) => (kind === 'base' ? 2 : 1.177) * (t2 - t1) / (w1 + w2);
/** USP tailing factor T = W0.05 / 2f (width at 5 % height over twice the front half-width). */
export const tailing = (w005: number, f: number) => w005 / (2 * f);
/** Purnell: Rs = (√N / 4) · (α − 1)/α · k2/(1 + k2). */
export const purnell = (N: number, alpha: number, k2: number) => (Math.sqrt(N) / 4) * ((alpha - 1) / alpha) * (k2 / (1 + k2));
/** Plates needed for a target resolution. */
export const platesFor = (rs: number, alpha: number, k2: number) => (4 * rs * (alpha / (alpha - 1)) * ((1 + k2) / k2)) ** 2;

export type Column = { L: number; d: number; dp: number }; // length mm, inner diameter mm, particle size µm
export type Transfer = { flow: number; injection: number; timeScale: number; lOverDp1: number; lOverDp2: number; lOverDpChange: number; uspOk: boolean; solventRatio: number };

/**
 * Geometric transfer from column 1 to column 2 (USP <621>): flow scaled by d² and (for constant reduced velocity)
 * by dp1/dp2; injection by column volume; gradient times by (column volume ratio) × (flow ratio)⁻¹.
 */
export function transfer(c1: Column, c2: Column, flow1: number, inj1: number, scaleForParticles = true): Transfer {
  const flow = flow1 * (c2.d / c1.d) ** 2 * (scaleForParticles ? c1.dp / c2.dp : 1);
  const vol = ((c2.d / c1.d) ** 2 * c2.L) / c1.L;
  const injection = inj1 * vol;
  const timeScale = vol * (flow1 / flow);
  const lOverDp1 = (c1.L * 1000) / c1.dp, lOverDp2 = (c2.L * 1000) / c2.dp, lOverDpChange = (100 * (lOverDp2 - lOverDp1)) / lOverDp1;
  return { flow, injection, timeScale, lOverDp1, lOverDp2, lOverDpChange, uspOk: lOverDpChange >= -25 && lOverDpChange <= 50, solventRatio: (flow * timeScale) / flow1 };
}
