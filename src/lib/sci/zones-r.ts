// Antibiotic zones of inhibition, a teaching model of the disc diffusion test. An antibiotic disc holding
// M µg spreads into agar of depth h mm. By the critical time Tc (when the bacterial lawn becomes too thick
// to stop), the concentration at distance x mm from the disc is about
//   c(x) = M / (4π D Tc h) · exp(−x² / (4 D Tc))     (µg/mm³; × 1000 for µg/mL)
// and bacteria grow only where c < MIC. So the zone edge is at x² = 4 D Tc ln(M / (4π D Tc h MIC)),
// the classic Cooper relation. All numbers used with it on fibub are round, made-up teaching values.

export const DISC_MM = 6; // paper disc diameter

/** Concentration (µg/mL) at x mm from the disc centre. D in mm²/h, Tc in h, h in mm, M in µg. */
export function conc(x: number, M: number, D: number, Tc: number, h: number): number {
  return (1000 * M) / (4 * Math.PI * D * Tc * h) * Math.exp((-x * x) / (4 * D * Tc));
}

/** Zone diameter (mm) where the concentration falls to the MIC (µg/mL); the disc itself (6 mm) if no zone. */
export function zoneDiameter(M: number, D: number, Tc: number, h: number, mic: number): number {
  const c0 = conc(0, M, D, Tc, h);
  if (!(mic > 0) || c0 <= mic) return DISC_MM;
  const x = Math.sqrt(4 * D * Tc * Math.log(c0 / mic));
  return Math.max(DISC_MM, 2 * x);
}

/** Made-up teaching cut-offs: ≥ 18 mm sensitive, 14-17 intermediate, below 14 resistant. */
export const verdict = (d: number): 'sensitive' | 'intermediate' | 'resistant' => (d >= 18 ? 'sensitive' : d >= 14 ? 'intermediate' : 'resistant');
