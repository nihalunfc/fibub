// #966 superconductor calculator. References: SciPy brentq + quad on the full BCS gap equation with a Debye cutoff
// (an independent form of the weak-coupling gap equation), scipy.constants, and closed forms.
import * as S from '../../src/lib/sci/phsc.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  check('sc: weak-coupling ratio Δ₀/kTc = 1.7639 (cutoff gap equation 1.763877)', near(S.BCS_RATIO, 1.7638770025817663, 1e-7));
  const ref = [[0.3, 0.9971237703446778], [0.5, 0.956884724045792], [0.7, 0.8287709784441725], [0.9, 0.5263419403392715], [0.99, 0.17295385609545633]];
  check('sc: Δ(T)/Δ₀ matches the full BCS gap equation (SciPy)', ref.every(([t, v]) => near(S.gapRatio(t), v, 2e-8)));
  check('sc: gap closes like 3.06 kTc √(1 − t) near Tc', near(S.gapRatio(0.999) * S.BCS_RATIO, 3.0633 * Math.sqrt(0.001), 2e-3));
  check('sc: gap is full at low T and zero above Tc', S.gapRatio(0.05) > 0.999999 && S.gapRatio(1) === 0 && S.gapRatio(1.2) === 0 && S.gapRatio(0) === 1);
  check('sc: flux quantum h/2e', near(S.PHI0, 2.067833848e-15, 1e-9));
  check('sc: London depth for n = 10²⁸ m⁻³ (scipy.constants)', near(S.londonDepth(1e28), 5.314093266996261e-8, 1e-8));
  const gap = S.BCS_RATIO * S.KB * 9.2;
  check('sc: BCS gap for Tc 9.2 K = 1.398 meV', near(gap / S.QE * 1e3, 1.3983922578737116, 1e-8));
  check('sc: BCS coherence length ħv_F/(πΔ₀)', near(S.bcsCoherence(1e6, gap), 1.4982589607613124e-7, 1e-8));
  check('sc: Pippard dirty limit', near(S.pippard(100e-9, 100e-9), 50e-9, 1e-12) && S.pippard(100e-9, Infinity) === 100e-9);
  const g = S.glFields(40e-9, 35e-9, gap);
  check('sc: κ and type II', near(g.kappa, 40 / 35, 1e-12) && g.type === 'II');
  check('sc: GL critical fields', near(g.Bc, 0.16622362079216213, 1e-9) && near(g.Bc1, 0.013733118633401072, 1e-9) && near(g.Bc2, 0.2686579416126149, 1e-9));
  check('sc: Bc² = Bc1 Bc2 / ln κ consistency (GL identity Bc1 Bc2 = Bc² ln κ)', near(g.Bc1 * g.Bc2, g.Bc * g.Bc * Math.log(g.kappa), 1e-12));
  check('sc: depairing current and Pauli limit', near(g.Jd, 1800055908864.4492, 1e-8) && near(g.Bp, 17.082712971935656, 1e-8) && near(g.Bp / 9.2, 1.857, 1e-3));
  check('sc: type I below κ = 1/√2', S.glFields(20e-9, 100e-9, gap).type === 'I' && Number.isNaN(S.glFields(20e-9, 100e-9, gap).Bc1));
  check('sc: two-fluid λ(T) and parabolic fields', near(S.lambdaT(40, 0.5), 40 / Math.sqrt(1 - 0.0625), 1e-12) && S.parabolic(2, 0.5) === 1.5 && S.parabolic(2, 1.1) === 0);
};
