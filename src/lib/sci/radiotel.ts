// Radio telescope sensitivity: beam, effective area, gain in K/Jy, SEFD and the radiometer equation.

export const KB = 1.380649e-23, C = 2.99792458e8, JY = 1e-26;

export type Scope = { D: number; eta: number; tsys: number; f: number; n: number; npol: 1 | 2; bw: number };

export function scope(s: Scope) {
  if (!(s.D > 0 && s.eta > 0 && s.eta <= 1 && s.tsys > 0 && s.f > 0 && s.bw > 0 && s.n >= 1)) throw new Error('Dish size, efficiency, system temperature, frequency and bandwidth must be above zero; efficiency at most 1');
  const lam = C / s.f, ae = s.eta * Math.PI * (s.D / 2) ** 2;
  // Half-power beamwidth of a typical tapered dish, about 1.2 λ/D (uniform illumination gives 1.02 λ/D).
  const hpbw = (1.2 * lam) / s.D;
  const gain = (ae * JY) / (2 * KB); // K per Jy, one dish
  const sefd = s.tsys / gain; // Jy
  // N dishes: a single dish sums nothing; an interferometer correlates N(N−1)/2 baselines.
  const pairs = s.n > 1 ? s.n * (s.n - 1) : 1;
  const sigma1s = sefd / Math.sqrt(s.npol * pairs * s.bw); // Jy after one second
  return { lam, ae, hpbw, beamSr: 1.133 * hpbw * hpbw, gain, sefd, sigma1s,
    sigma: (t: number) => sigma1s / Math.sqrt(t),
    timeFor: (S: number, snr: number) => ((snr * sigma1s) / S) ** 2,
    antennaTemp: (S: number) => gain * S };
}
/** Rayleigh-Jeans brightness temperature (K) of a source of flux S (Jy) filling solid angle Ω (sr) at frequency f. */
export const brightnessT = (S: number, omega: number, f: number) => (S * JY * C * C) / (2 * KB * f * f * omega);
