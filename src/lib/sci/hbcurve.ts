// Oxygen-haemoglobin dissociation curve and lung volumes (school biology). Plain maths, no DOM.
// Standard curve: Severinghaus (1979) equation; shifts with pH, temperature and CO2 by his "virtual PO2"
// correction. Teaching model: real blood differs from person to person.

/** Saturation (0 to 1) of haemoglobin at a PO2 in mmHg, standard conditions (pH 7.40, 37 °C, PCO2 40 mmHg). */
export function satStandard(po2: number): number {
  if (po2 <= 0) return 0;
  return 1 / (23400 / (po2 ** 3 + 150 * po2) + 1);
}
export type Conditions = { pH: number; tempC: number; pco2: number; fetal?: boolean };
export const NORMAL: Conditions = { pH: 7.4, tempC: 37, pco2: 40 };
/** Factor that turns a real PO2 into the PO2 the standard curve would need (Severinghaus 1979). */
export function shiftFactor(c: Conditions): number {
  // Fetal haemoglobin binds more tightly: P50 about 19 instead of 26.8 mmHg (approximate teaching value).
  return 10 ** (0.024 * (37 - c.tempC) + 0.4 * (c.pH - 7.4) + 0.06 * Math.log10(40 / c.pco2)) * (c.fetal ? 26.8 / 19 : 1);
}
export const saturation = (po2: number, c: Conditions = NORMAL) => satStandard(po2 * shiftFactor(c));

/** PO2 (mmHg) at which the curve is half saturated, by bisection. */
export function p50(c: Conditions = NORMAL): number {
  let lo = 1, hi = 150;
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (saturation(mid, c) < 0.5) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
/** Oxygen content of blood (mL O2 per 100 mL): 1.34 × Hb (g/dL) × saturation + 0.003 × PO2. */
export const content = (po2: number, hb: number, c: Conditions = NORMAL) => 1.34 * hb * saturation(po2, c) + 0.003 * po2;

// ---------- lung volumes ----------
export type Lungs = { tv: number; irv: number; erv: number; rv: number; rate: number };
/** Typical round adult values (mL; breaths per minute), as quoted in school books. */
export const TYPICAL: Lungs = { tv: 500, irv: 2750, erv: 1050, rv: 1150, rate: 12 };
export function capacities(l: Lungs) {
  return { vc: l.erv + l.tv + l.irv, tlc: l.erv + l.tv + l.irv + l.rv, frc: l.erv + l.rv, ic: l.tv + l.irv, eic: l.tv + l.erv, minute: l.tv * l.rate };
}
/** Spirogram trace: volume in the lungs (mL) at time t (s): quiet breaths, one deepest breath in and out, quiet again. */
export function spiro(l: Lungs, t: number): number {
  const frc = l.erv + l.rv, period = 60 / l.rate, base = frc + l.tv / 2;
  const quiet = (tt: number) => base - (l.tv / 2) * Math.cos((2 * Math.PI * tt) / period);
  const t1 = 2 * period; // after two quiet breaths: deepest breath in, then out
  if (t < t1) return quiet(t);
  const d = 6; // seconds for the big manoeuvre
  if (t < t1 + d) {
    const u = (t - t1) / d, top = frc + l.tv + l.irv, bottom = l.rv;
    if (u < 0.35) return frc + (top - frc) * Math.sin((Math.PI / 2) * (u / 0.35)) ** 2;
    if (u < 0.8) return top - (top - bottom) * Math.sin((Math.PI / 2) * ((u - 0.35) / 0.45)) ** 2;
    return bottom + (frc - bottom) * Math.sin((Math.PI / 2) * ((u - 0.8) / 0.2)) ** 2;
  }
  return quiet(t - t1 - d);
}
