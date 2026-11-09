// #654 road gradient and curve helper. Checked against an independent Python calculation written for these tests:
// curve elements by trigonometry, setting-out from the coordinates of points on the arc, and the crest and sag
// formulas by a numerical sight-line search (NumPy, scipy brentq) that finds the sight distance a curve of the
// computed length really gives. The example road is made up.
import * as RD from '../../src/lib/sci/eng-road.ts';
const rel = (a, b, t) => Number.isFinite(a) && Math.abs(a / b - 1) <= t;
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
export default async (check) => {
  check('road: minimum radius 80 km/h, e 0.06, f 0.14 (Python 251.696 m)', rel(RD.minRadius(80, 0.06, 0.14), 251.69580045556935, 1e-12));
  check('road: friction needed is the inverse', near(RD.frictionNeeded(80, RD.minRadius(80, 0.06, 0.14), 0.06), 0.14, 1e-12));
  const c = RD.circularCurve(300, 40, 1250);
  check('road: T, L, E, M, C for R 300, Δ 40° (Python)', rel(c.T, 109.1910702798607, 1e-12) && rel(c.L, 209.43951023931953, 1e-12) && rel(c.E, 19.253331742773618, 1e-12) && rel(c.M, 18.092213764227473, 1e-12) && rel(c.C, 205.21208599540122, 1e-12));
  check('road: PC 1140.809 and PT 1350.248 (Python)', near(c.pc, 1140.8089297201393, 1e-9) && near(c.pt, 1350.248439959459, 1e-9));
  check('road: degree of curve on a 20 m arc', near(c.Dc, (20 / 300) * 180 / Math.PI, 1e-12));
  const so = RD.settingOut(300, c, 20);
  check('road: 12 stakes from PC to PT', so.length === 12 && so[1].ch === 1160 && so[11].ch === c.pt);
  check('road: deflection and chord at 1160 and 1340 from coordinates (Python)', near(so[1].defl, 1.832612218958331, 1e-9) && near(so[1].chord, 19.18779821712964, 1e-9) && near(so[10].defl, 19.02134607288297, 1e-9) && near(so[10].chord, 195.55223612991026, 1e-9));
  check('road: last deflection is Δ/2 and chord the long chord', near(so[11].defl, 20, 1e-9) && near(so[11].chord, c.C, 1e-9));
  check('road: sub-chords add to just under the arc', so.slice(1).reduce((s, x) => s + x.sub, 0) < c.L && so.slice(1).reduce((s, x) => s + x.sub, 0) > c.L - 0.05);
  check('road: sight offset R(1 − cos(S/2R))', near(RD.sightOffset(300, 130), 300 * (1 - Math.cos(130 / 600)), 1e-12));
  const s = RD.stoppingDistance(80, 2.5, 0.35, -0.03);
  check('road: stopping distance 80 km/h, 2.5 s, f 0.35, 3 % down (Python 134.210 m)', rel(s.total, 134.21049319792098, 1e-12) && rel(s.react, 80 / 3.6 * 2.5, 1e-12));
  check('road: crest S > L branch, A 5, S 130, h 1.1/0.6 (numerical sight line gives 130.00)', rel(RD.crestLength(5, 130, 1.1, 0.6), 127.00769276291231, 1e-12));
  check('road: crest S < L, S 300 (numerical 300.00)', rel(RD.crestLength(5, 300, 1.1, 0.6), 676.7308716552712, 1e-12));
  check('road: sag headlight S < L, A 6, S 100, h 0.6, 1° (numerical 100.00)', rel(RD.sagLength(6, 100, 0.6, 1), 127.90414391012212, 1e-12));
  check('road: sag headlight S > L, A 3, S 150 (numerical 150.00)', rel(RD.sagLength(3, 150, 0.6, 1), 85.44935071782413, 1e-12));
  check('road: tiny change of grade needs no curve', RD.crestLength(0.2, 100, 1.1, 0.6) === 0);
  const v = RD.verticalCurve(3, -2, 200, 1500, 100);
  check('road: crest curve BVC 1400 at 97, EVC 1600 at 98, K 40', near(v.bvc, 1400, 1e-12) && near(v.zb, 97, 1e-12) && near(v.ze, 98, 1e-12) && near(v.K, 40, 1e-12) && v.crest);
  check('road: high point 120 m from BVC at 98.8', v.turn && near(v.turn.ch, 1520, 1e-9) && near(v.turn.z, 98.8, 1e-9));
  check('road: middle of the curve is A L / 800 below the VPI', near(v.at(1500), 100 - 5 * 200 / 800, 1e-12));
  check('road: same-sign grades have no turning point', RD.verticalCurve(2, 5, 100, 0, 0).turn === null && !RD.verticalCurve(2, 5, 100, 0, 0).crest);
  const gr = RD.gradient(0, 10, 250, 15);
  check('road: gradient 2 %, 1 in 50, 1.1458°', near(gr.percent, 2, 1e-12) && near(gr.oneIn, 50, 1e-9) && near(gr.angle, Math.atan(0.02) * 180 / Math.PI, 1e-12));
};
