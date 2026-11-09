// #649 concrete mix calculator. Checked against an independent SciPy calculation (brentq on the absolute-volume
// sum, scipy.stats.norm for the share below f'c), written for these tests. The example mix is made up.
import * as CM from '../../src/lib/sci/eng-concrete.ts';
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
export default async (check) => {
  const ex = { wc: 0.45, water: 180, air: 2, caFrac: 0.6, caRodded: 1600, sgC: 3.15, sgCA: 2.68, sgFA: 2.62, caM: 1, caA: 0.5, faM: 4, faA: 1 };
  const m = CM.mixDesign(ex);
  check('concrete: cement = water / (w/c) = 400', near(m.cement, 400, 1e-9));
  check('concrete: coarse = 0.6 × 1600 = 960', near(m.ca, 960, 1e-9));
  check('concrete: fine aggregate fills the rest (SciPy 824.7941)', near(m.fa, 824.7941246150202, 1e-6));
  check('concrete: volumes add to 1 m³', near(m.vol.water + m.vol.cement + m.vol.air + m.vol.ca + m.vol.fa, 1, 1e-12));
  check('concrete: fresh density (SciPy 2364.794)', near(m.density, 2364.7941246150203, 1e-6));
  check('concrete: field water (SciPy 150.4562)', near(m.field.water, 150.4561762615494, 1e-6));
  check('concrete: wet coarse 969.6 and fine (SciPy 857.7859)', near(m.field.ca, 969.6, 1e-9) && near(m.field.fa, 857.7858895996211, 1e-6));
  check('concrete: mass ratio 1 : 2.06 : 2.4', near(m.ratio[1], 824.7941246150202 / 400, 1e-9) && near(m.ratio[2], 2.4, 1e-12));
  const m2 = CM.mixDesign({ wc: 0.5, water: 160, air: 5, caFrac: 0.65, caRodded: 1550, sgC: 3.1, sgCA: 2.7, sgFA: 2.6, caM: 0.2, caA: 0.8, faM: 6, faA: 1.5 });
  check('concrete: second mix, dry coarse absorbs water (SciPy FA 815.4277, water 129.3508)', near(m2.fa, 815.4277180406211, 1e-6) && near(m2.field.water, 129.35075268817204, 1e-6) && m2.caFree < 0);
  const t = CM.targetStrength(30, 1.65, 4);
  check("concrete: f'cr = 30 + 1.65 × 4 = 36.6", near(t.fcr, 36.6, 1e-12));
  check('concrete: share below f\'c for k 1.65 (SciPy 0.0494715)', near(t.below, 0.0494714680336481, 2e-7));
  check('concrete: normal cdf at −2.33 and −1.34 (SciPy)', near(CM.normCdf(-2.33), 0.009903075559164245, 2e-7) && near(CM.normCdf(-1.34), 0.09012267246445244, 2e-7) && near(CM.normCdf(0), 0.5, 1e-9));
  check('concrete: too much stone leaves no room for sand', CM.mixDesign({ ...ex, caFrac: 1.2 }).vol.fa < 0);
};
