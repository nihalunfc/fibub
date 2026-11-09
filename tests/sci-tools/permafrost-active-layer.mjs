// #209 Permafrost active layer (Stefan). Checked 2026-11-09 by hand (one soil: L = 1400 × 0.30 × 334 000 =
// 1.4028e8 J/m³, Iₛ = 0.8 × 887.9 °C·d → Z = √(2 × 1.2 × 710.32 × 86 400 / 1.4028e8) = 1.0247 m; two soils:
// 169.13 °C·d to thaw the top 0.5 m, then 541.19 °C·d left → 1.0213 m more, 1.5213 m) and against NumPy:
// the thaw/freeze index of the example year (np.clip sums), the layered depth by integrating I(z) = ∫ L(s) R(s) ds
// with the midpoint rule on 400 000 cells and inverting with np.interp (200 random 1–3 layer soils, worst relative
// difference 3.4e-12), and a fourth-order Runge–Kutta march of dz/dI = 1 / (L R) (agrees to 6e-5, its own step error).
import { layered, stefan, indexFor, latent, dailyIndex, parseTemps, exampleTemps, sensitivity, layerProblem, LF } from '../../src/lib/sci/permafrost.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('permafrost: latent heat L = ρd w Lf (1400 kg/m³, 30 %: 140.28 MJ/m³)', near(latent(1400, 0.3), 1.4028e8) && LF === 334000);
  check('permafrost: one soil by hand (1.2 W/m/K, 710.32 °C·d → 1.0247 m)', near(stefan(1.2, 710.32, 1.4028e8), 1.0246879639377229, 1e-12));
  check('permafrost: Stefan turned round gives the index back', near(indexFor(1.2, stefan(1.2, 500, 1e8), 1e8), 500, 1e-12));
  check('permafrost: one-layer solver is the plain Stefan equation', [1, 50, 300, 2500].every((I) => near(layered([{ h: 0, k: 1.7, w: 0.22, rhoD: 1550 }], I).depth, stefan(1.7, I, latent(1550, 0.22)), 1e-12)));
  check('permafrost: depth grows as √I (4× the index, 2× the depth)', near(stefan(1, 400, 1e8), 2 * stefan(1, 100, 1e8), 1e-12));
  const t = exampleTemps(), th = dailyIndex(t, 'thaw'), fr = dailyIndex(t, 'freeze');
  check('permafrost: example year (numpy: thawing 887.9, freezing 3440.1 °C·d, 136 days above 0)', t.length === 365 && near(th.I, 887.9, 1e-9) && near(fr.I, 3440.1, 1e-9) && th.days === 136 && fr.days === 228);
  check('permafrost: running index ends at the total and never falls', near(th.cum[364], th.I) && th.cum.every((c, i) => !i || c >= th.cum[i - 1]));
  const S = [{ h: 0.5, k: 1.2, w: 0.3, rhoD: 1400 }, { h: 1, k: 2, w: 0.12, rhoD: 1700 }, { h: 0, k: 2.5, w: 0.08, rhoD: 1900 }];
  const r2 = layered(S.slice(0, 2), 710.32);
  check('permafrost: two soils by hand (169.13 °C·d for the top 0.5 m, front at 1.5213 m in layer 2)', near(r2.layers[0].need, 169.12615740740742, 1e-12) && near(r2.depth, 1.5212535387350243, 1e-12) && r2.layer === 1 && r2.layers[0].reached === 'all');
  const r3 = layered(S, 710.32);
  check('permafrost: three soils (cumulative 694.87 °C·d to 1.5 m, front 1.5285 m in layer 3)', near(r3.layers[1].cum, 694.8668981481483, 1e-12) && near(r3.depth, 1.5285124530037115, 1e-12) && r3.layer === 2);
  // NumPy midpoint-quadrature values for a 0.3 m organic mat over 0.6 m silt over gravel.
  const A = [{ h: 0.3, k: 0.4, w: 0.8, rhoD: 300 }, { h: 0.6, k: 1.2, w: 0.3, rhoD: 1400 }, { h: 0, k: 1.8, w: 0.15, rhoD: 1700 }];
  const np = [[50, 0.207638562049461, 0.207638562049461], [300, 0.4484131966770, 0.4484131966770], [1234.5, 0.97497158718, 1.02319579790], [2500, 1.48594834455, 1.85213238546], [6000, 2.48623284778, 3.44954344650]];
  check('permafrost: layered depths match numpy quadrature (5 indices, 2 and 3 layers)', np.every(([I, d2, d3]) => near(layered([A[0], { ...A[1], h: 0 }], I).depth, d2, 1e-9) && near(layered(A, I).depth, d3, 1e-9)));
  check('permafrost: front exactly at a boundary when the index equals the need', near(layered(S, r3.layers[0].cum).depth, 0.5, 1e-12));
  check('permafrost: no index, no thaw', layered(S, 0).depth === 0 && stefan(1, 0, 1e8) === 0);
  check('permafrost: an insulating top layer makes the front shallower', layered([{ h: 0.3, k: 0.3, w: 0.3, rhoD: 1400 }, S[0]], 700).depth < layered([S[0]], 700).depth);
  const sv = sensitivity(S.slice(0, 1), 710.32, [0.8, 0.9, 1, 1.1, 1.2]);
  check('permafrost: sensitivity, one soil (index and k ×1.2 → ×√1.2; w and ρd ×1.2 → ÷√1.2)', sv.length === 4 && near(sv[0].depths[4], 1.0246879639377229 * Math.sqrt(1.2), 1e-12) && near(sv[1].depths[0], 1.0246879639377229 * Math.sqrt(0.8), 1e-12) && near(sv[2].depths[4], 1.0246879639377229 / Math.sqrt(1.2), 1e-12) && near(sv[3].depths[2], 1.0246879639377229, 1e-12));
  check('permafrost: sensitivity adds the top-layer thickness for layered soil', sensitivity(S, 710.32, [1]).length === 5);
  const p = parseTemps('date, temp\n2026-06-01, 3.5\n2026-06-02,−1.5\n2026-06-03,4\n2026-06-04, x\n');
  const p2 = parseTemps('Tag;Temperatur\n1;3,5\n2;−1,5\n'), p3 = parseTemps('2.5\n-3\n0');
  check('permafrost: pasted temperatures (header skipped, dates, CSV, semicolons with comma decimals, minus sign, one column)', typeof p !== 'string' && p.temps.join('|') === '3.5|-1.5|4' && p.skipped === 2 && typeof p2 !== 'string' && p2.temps.join('|') === '3.5|-1.5' && typeof p3 !== 'string' && p3.temps.join('|') === '2.5|-3|0');
  check('permafrost: too few temperatures refused', typeof parseTemps('5') === 'string');
  check('permafrost: bad soil refused (no water, no conductivity, no thickness)', layerProblem({ h: 1, k: 1, w: 0, rhoD: 1400 }, 0, false).includes('Dry soil') && layerProblem({ h: 1, k: 0, w: 0.2, rhoD: 1400 }, 0, false) !== '' && layerProblem({ h: 0, k: 1, w: 0.2, rhoD: 1400 }, 0, false) !== '' && layerProblem({ h: 0, k: 1, w: 0.2, rhoD: 1400 }, 2, true) === '');
};
