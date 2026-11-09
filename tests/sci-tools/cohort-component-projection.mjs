// #756 Cohort-component projection: the tool's made-up example matched to an independent numpy Leslie-matrix
// projection (scratch cc_ref.py) for 20 steps with and without migration (worst relative difference 6e-16),
// and the growth rate without migration converging to the Leslie matrix's dominant eigenvalue.
import * as C from '../../src/lib/sci/ccproj.ts';

const ages = Array.from({ length: 18 }, (_, i) => 5 * i);
const female = [2290, 2440, 2570, 2620, 2810, 3050, 3190, 3150, 3000, 2900, 2840, 2730, 2520, 2250, 1900, 1460, 1030, 840];
const male = [2410, 2560, 2690, 2750, 2900, 3120, 3260, 3180, 3010, 2890, 2800, 2640, 2380, 2050, 1660, 1190, 760, 470];
const sf = [0.99834, 0.99825, 0.99811, 0.99789, 0.99754, 0.99699, 0.99613, 0.99479, 0.99269, 0.98941, 0.98428, 0.97629, 0.9639, 0.94482, 0.9157, 0.87196, 0.65993, 0.65993];
const sm = [0.99733, 0.99724, 0.99709, 0.99685, 0.99648, 0.9959, 0.995, 0.99358, 0.99135, 0.98787, 0.98245, 0.974, 0.96091, 0.94076, 0.91007, 0.86408, 0.65063, 0.65063];
const asfr = [0, 0, 0, 0.01, 0.045, 0.09, 0.095, 0.055, 0.015, 0.002, 0, 0, 0, 0, 0, 0, 0, 0];
const migF = [40, 30, 20, 60, 150, 200, 120, 60, 30, 10, 0, 0, -10, -20, -10, 0, 0, 0];
const migM = [40, 30, 20, 70, 170, 210, 130, 60, 30, 10, 0, 0, -10, -20, -10, 0, 0, 0];
const base = { ages, female, male, sf, sm, sbf: 0.99919, sbm: 0.99869, asfr, srb: 1.05, migF, migM };

export default async (check) => {
  const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.abs(b);
  const r = C.project(base, 20, 2025);
  const s1 = r.steps[1];
  check('ccproj: step 1 = numpy Leslie', rel(s1.births, 4767.39838125) && rel(s1.female[0], 2363.6764822249697) && rel(s1.male[0], 2478.6393872385806) && rel(s1.female[17], 1234.0691) && rel(s1.total, 89835.02026946354) && s1.year === 2030);
  check('ccproj: step 20 = numpy Leslie', rel(r.steps[20].total, 90759.05150064903) && r.steps[20].year === 2125);
  check('ccproj: TFR', Math.abs(r.tfr - 1.56) < 1e-12);
  // By hand: the open group is (80-84 × S80) + (85+ × S85).
  check('ccproj: open group by hand', rel(s1.female[17], 1030 * 0.65993 + 840 * 0.65993 + 0));
  check('ccproj: births split by sex ratio', rel(s1.birthsM / s1.birthsF, 1.05));
  const nm = C.project({ ...base, migF: migF.map(() => 0), migM: migM.map(() => 0) }, 40);
  check('ccproj: no migration converges to Leslie r = −0.00930', Math.abs(nm.steps[40].growth - -0.009301974924568267) < 2e-5);
  // nLx route: constant hazard gives every ratio exp(−5m).
  const m = 0.01, L = ages.map((a, i) => (i < 17 ? (1e5 * Math.exp(-m * a) * (1 - Math.exp(-5 * m))) / m : (1e5 * Math.exp(-m * a)) / m));
  const q = C.ratiosFromL(L, 1e5);
  check('ccproj: ratios from nLx', q.S.every((s) => rel(s, Math.exp(-5 * m), 1e-12)) && rel(q.sb, (1 - Math.exp(-5 * m)) / (5 * m)));
  const em = C.project({ ...base, migF: migF.map((x, i) => (i === 17 ? -5000 : x)) }, 1);
  check('ccproj: emigration below zero is clipped and reported', em.steps[1].female[17] === 0 && em.clipped > 0);
  let bad = 0;
  for (const p of [{ ...base, ages: ages.map((a) => a + 1) }, { ...base, sf: sf.map(() => 1.2) }, { ...base, asfr: asfr.slice(1) }, { ...base, srb: 0 }]) { try { C.project(p, 3); } catch { bad++; } }
  check('ccproj: bad input refused', bad === 4);
};
