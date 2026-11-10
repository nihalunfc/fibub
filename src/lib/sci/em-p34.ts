// Constants for the Class 12 electricity, magnetism and EM-wave Learn tools (batch p34). No DOM.
import { fmtExp } from './num.ts';
// ε₀ and µ₀ are the CODATA 2022 recommended values; c, h and e are exact in the SI.
export const EPS0 = 8.8541878188e-12; // F/m
export const MU0 = 1.25663706127e-6; // N/A²
export const K = 1 / (4 * Math.PI * EPS0); // 8.98755…×10⁹ N m²/C²
export const C_LIGHT = 299792458; // m/s
export const H_PLANCK = 6.62607015e-34; // J s
export const E_CHARGE = 1.602176634e-19; // C

/** Three significant figures as text, written "a × 10ⁿ" when very big or very small (quiz workings). */
export const n3 = (x: number) => (x !== 0 && (Math.abs(x) >= 1e4 || Math.abs(x) < 1e-3) ? fmtExp(x, 3) : String(Number(x.toPrecision(3))));
