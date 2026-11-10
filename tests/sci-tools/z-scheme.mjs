// #1393 Z-scheme stepper. Checked against hand counts: 12 electrons non-cyclic → 24 photons, 6 H₂O, 3 O₂, 6 NADPH,
// 36 H⁺, 36 × 3/14 = 7.714 ATP; cyclic → 12 photons, 24 H⁺, 5.143 ATP; photon at 680 nm = 1.823 eV (1239.84/680).
import * as Z from '../../src/lib/sci/z-scheme.ts';
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
export default async (check) => {
  const L = Z.ledger(12);
  check('z-scheme: 12 electrons non-cyclic', L.photons === 24 && L.water === 6 && L.o2 === 3 && L.nadph === 6 && L.hLumen === 36 && near(L.atp, 36 * 3 / 14));
  const C = Z.ledger(12, true);
  check('z-scheme: 12 electrons cyclic', C.photons === 12 && C.water === 0 && C.o2 === 0 && C.nadph === 0 && C.hLumen === 24 && near(C.atp, 72 / 14));
  check('z-scheme: 4 e⁻ per O₂, 2 per NADPH for any n', [4, 8, 20, 48].every((n) => Z.ledger(n).o2 * 4 === n && Z.ledger(n).nadph * 2 === n));
  check('z-scheme: excited states are higher energy (more negative E) than ground states', Z.carrier('p680x').E < Z.carrier('p680').E && Z.carrier('p700x').E < Z.carrier('p700').E);
  const path = ['p680x', 'pheo', 'pq', 'b6f', 'pc', 'p700'];
  check('z-scheme: downhill from P680* to P700 (E rises at each step)', path.every((id, i) => i === 0 || Z.carrier(id).E > Z.carrier(path[i - 1]).E));
  check('z-scheme: P680 can take electrons from water (E above +0.82 V)', Z.carrier('p680').E > Z.carrier('h2o').E);
  check('z-scheme: P700* to NADP⁺ is downhill', Z.carrier('p700x').E < Z.carrier('fd').E && Z.carrier('fd').E < Z.carrier('nadp').E);
  check('z-scheme: steps name real carriers; cyclic ends where it began', [...Z.NONCYCLIC, ...Z.CYCLIC].every((s) => Z.carrier(s.at)) && Z.CYCLIC[0].at === Z.CYCLIC.at(-1).at);
  check('z-scheme: photon at 680 nm = 1.823 eV', near(Z.photonEV(680), 1239.8419843 / 680, 1e-8));
};
