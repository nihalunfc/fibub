// Membrane potential: Nernst equilibrium potentials, the Goldman-Hodgkin-Katz (GHK) voltage equation and GHK
// current-voltage curves. Concentrations in mmol/L (= mol/m³), voltages in mV, permeabilities in cm/s.

export const F = 96485.33212, R = 8.314462618; // C/mol, J/(mol·K) (CODATA)

export type Ion = { name: string; z: number; out: number; in: number; p: number };

/** RT/F in mV at a temperature in °C. */
export const rtf = (tC: number) => ((R * (tC + 273.15)) / F) * 1000;

/** Nernst equilibrium potential in mV: E = (RT/zF) ln(out/in). */
export const nernst = (z: number, out: number, inn: number, tC: number) => (rtf(tC) / z) * Math.log(out / inn);

/**
 * GHK voltage equation for monovalent ions: Vm = (RT/F) ln[(Σ P cation_out + Σ P anion_in) / (Σ P cation_in + Σ P anion_out)].
 * Ions with |z| ≠ 1 are ignored here (see zeroCurrent for those).
 */
export function ghkVoltage(ions: Ion[], tC: number): number {
  let num = 0, den = 0;
  for (const i of ions) {
    if (i.z === 1) { num += i.p * i.out; den += i.p * i.in; }
    else if (i.z === -1) { num += i.p * i.in; den += i.p * i.out; }
  }
  return rtf(tC) * Math.log(num / den);
}

/**
 * GHK current density in µA/cm² (outward positive) for one ion at V mV:
 * I = P z² (V F²/RT) (c_in − c_out e^(−zVF/RT)) / (1 − e^(−zVF/RT)). P in cm/s.
 */
export function ghkCurrent(ion: Ion, V: number, tC: number, pAbs = 1): number {
  const P = (pAbs * ion.p) / 100; // m/s
  const u = (ion.z * V) / rtf(tC); // zVF/RT, dimensionless
  const zF = ion.z * F;
  // A/m², then ×100 to µA/cm² (1 A/m² = 100 µA/cm²).
  const I = Math.abs(u) < 1e-9 ? P * zF * (ion.in - ion.out) : P * zF * u * (ion.in - ion.out * Math.exp(-u)) / (1 - Math.exp(-u));
  return I * 100;
}

export const totalCurrent = (ions: Ion[], V: number, tC: number, pAbs = 1) => ions.reduce((s, i) => s + (i.p > 0 ? ghkCurrent(i, V, tC, pAbs) : 0), 0);

/** Potential (mV) where the summed GHK currents of all permeant ions are zero, by bisection; NaN if none in ±400 mV. */
export function zeroCurrent(ions: Ion[], tC: number): number {
  let lo = -400, hi = 400, flo = totalCurrent(ions, lo, tC);
  if (flo * totalCurrent(ions, hi, tC) > 0) return NaN;
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2, fm = totalCurrent(ions, mid, tC);
    if ((fm < 0) === (flo < 0)) { lo = mid; flo = fm; } else hi = mid;
  }
  return (lo + hi) / 2;
}
