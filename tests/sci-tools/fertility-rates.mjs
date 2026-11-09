// #757 Fertility rates: the tool's made-up example matched to an independent numpy calculation (scratch
// fert_ref.py) for ASFR, TFR, GRR (from the sex ratio and from female births), NRR (from nLx and from survival
// to the mean age at childbearing), mean age at childbearing, GFR and CBR.
import * as F from '../../src/lib/sci/fertility.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const labels = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];
  const g = F.groupsOf(labels);
  check('fertility: groups', g.ages.join() === '15,20,25,30,35,40,45' && g.widths.every((w) => w === 5) && F.groupsOf(['15', '20', '25+']).widths.join() === '5,5,5');
  const d = { labels, ...g, births: [26, 126, 275, 303, 173, 45, 6], women: [2620, 2810, 3050, 3190, 3150, 3000, 2900], L: [496954, 495904, 494683, 493195, 491289, 488730, 485158] };
  const r = F.fertility(d, { srb: 1.05, radix: 1e5, totalPop: 86310 });
  check('fertility: ASFR = numpy', near(r.asfr[0], 0.009923664122137405) && near(r.asfr[3], 0.09498432601880878) && near(r.asfr[6], 0.0020689655172413794));
  check('fertility: TFR, GRR, NRR = numpy', near(r.tfr, 1.5595069132814878) && near(r.grr, 0.7607350796495064) && near(r.nrr, 0.750891993050685));
  check('fertility: mean age, GFR, CBR = numpy', near(r.mac, 30.600567724104287) && near(r.gfr, 46.04247104247104) && near(r.cbr, 11.05318039624609));
  const r2 = F.fertility({ ...d, femaleBirths: [12, 62, 134, 148, 85, 22, 3] }, { srb: 1.05, radix: 1e5 });
  check('fertility: GRR and NRR from female births = numpy', near(r2.grr, 0.7616278162143276) && near(r2.nrr, 0.7517607969664071) && Number.isNaN(r2.cbr));
  check('fertility: NRR from survival to mean age = numpy', near(F.fertility({ ...d, L: undefined }, { srb: 1.05, radix: 1e5, pAM: 0.99 }).nrr, 0.7531277288530113));
  check('fertility: births over 2 years halve the rates', near(F.fertility(d, { srb: 1.05, radix: 1e5, years: 2 }).tfr, r.tfr / 2));
  check('fertility: shares add to 1', near(r.share.reduce((a, b) => a + b, 0), 1));
  // Constant ASFR 0.1 over 15-49 in 5-year groups: TFR 3.5, mean age 32.5.
  const c = F.fertility({ labels, ...g, births: g.ages.map(() => 100), women: g.ages.map(() => 1000) }, { srb: 1, radix: 1, pAM: 1 });
  check('fertility: flat schedule by hand', near(c.tfr, 3.5) && near(c.mac, 32.5) && near(c.grr, 1.75) && near(c.nrr, 1.75));
  let bad = 0;
  for (const f of [() => F.groupsOf(['15-19', '25-29']), () => F.fertility({ ...d, women: d.women.map(() => 0) }, { srb: 1.05, radix: 1e5 }), () => F.fertility({ ...d, L: undefined }, { srb: 1.05, radix: 1e5, pAM: 2 }), () => F.fertility({ ...d, femaleBirths: d.births.map((b) => b + 1) }, { srb: 1.05, radix: 1e5 })]) { try { f(); } catch { bad++; } }
  check('fertility: bad input refused', bad === 4);
};
