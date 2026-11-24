// Diatomic spectroscopy calculator (src/lib/sci/diatomic.ts): bond length from Be and the band-origin fit, pinned to
// the CdBr laser-cooling article (Int. J. Mol. Sci. 27: 184, 2026). The core checks (HCl, CO, I2) live in tests/sci.mjs.
import { bondLength, reducedMass, fitAnharmonic } from '../../src/lib/sci/diatomic.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Be = 0.05928 cm-1: 2.4675 Å with standard atomic weights (Cd 112.414, Br 79.904), 2.4698 Å for 114Cd79Br.
  check('diatomic: CdBr Be 0.05928 cm⁻¹ gives 2.4675 Å (atomic weights) and 2.4698 Å (114Cd79Br)', near(bondLength(0.05928, reducedMass(112.414, 79.904)), 2.4675, 1e-4) && near(bondLength(0.05928, reducedMass(113.9033651, 78.9183376)), 2.4698, 1e-4));
  const f = fitAnharmonic([1, 2, 3], [235.3, 466.8, 694.5]);
  check('diatomic: band origins 235.3, 466.8, 694.5 cm⁻¹ fit ωe 239.1 and ωexe 1.90', near(f.we, 239.10, 0.01) && near(f.wexe, 1.90, 0.01));
};
