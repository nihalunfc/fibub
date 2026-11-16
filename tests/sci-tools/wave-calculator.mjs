// #T139 wave calculator: wave power of a sea state. A sea of significant height Hs carries the energy of a regular wave of
// height Hs/√2 (Hrms), so in deep water the tool's energy × group speed must equal the standard sea-state formula
// P = ρ g² Hs² Te / (64 π), as used by Pérez-Molina and Carta (2025, J. Mar. Sci. Eng. 13, 1194). More wave checks are in tests/sci.mjs.
import { wave, transform, G } from '../../src/lib/sci/waves.ts';

export default async (check) => {
  const near = (name, a, b, tol) => check(`waves: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  const sea = (Hs, Te, rho = 1025) => (rho * G * G * Hs * Hs * Te) / (64 * Math.PI);
  near('sea state 1.67 m, 5.49 s in 780 m = 7.507 kW/m', wave(5.49, 780, 1.67 / Math.SQRT2).P / 1000, 7.507, 5e-4);
  near('same by the 64π formula', sea(1.67, 5.49) / 1000, 7.507, 5e-4);
  near('sea state 1.64 m, 8.33 s in 780 m = 10.98 kW/m', wave(8.33, 780, 1.64 / Math.SQRT2).P / 1000, sea(1.64, 8.33) / 1000, 1e-6);
  near('regular wave of height Hs carries twice the sea-state power', wave(5.49, 780, 1.67).P / sea(1.67, 5.49), 2, 1e-9);
  near('1 m, 1 s deep-water rule of thumb ≈ 0.49 kW/m (g = 9.80665)', sea(1, 1) / 1000, 0.4903, 1e-4);
  // Without losses, energy flux is the same at every depth (shoaling keeps E × Cg fixed).
  { const t = transform(8.33, 1.16, 780, 20); near('power kept after shoaling to 20 m', wave(8.33, 20, t.H2).P, wave(8.33, 780, 1.16).P, 1e-6); }
};
