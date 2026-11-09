// #643 gear train and belt drive: trains by hand, planetary speeds against a NumPy solve of the rolling
// constraints at the sun-planet and planet-ring contacts, belt length against NumPy tangent-line geometry.
import * as G from '../../src/lib/sci/eng-gear.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  let t = G.train([{ driver: 20, driven: 60, kind: 'external', eff: 1 }], 1500, 10);
  check('gear: one mesh 3:1, speed ÷3, torque ×3, reversed', t.ratio === 3 && t.shafts[1].speed === 500 && t.shafts[1].torque === 30 && t.shafts[1].dir === -1);
  t = G.train([{ driver: 20, driven: 35, kind: 'external', eff: 1 }, { driver: 35, driven: 40, kind: 'external', eff: 1 }], 1000, 1);
  check('gear: idler leaves the ratio, restores direction', near(t.ratio, 2) && t.shafts[2].dir === 1 && near(t.shafts[2].speed, 500));
  t = G.train([{ driver: 15, driven: 45, kind: 'external', eff: 0.98 }, { driver: 18, driven: 54, kind: 'external', eff: 0.98 }, { driver: 20, driven: 80, kind: 'internal', eff: 0.97 }], 1440, 5);
  check('gear: compound train ratio 3×3×4 = 36, efficiency multiplies', near(t.ratio, 36) && near(t.shafts[3].speed, 40) && near(t.eff, 0.98 * 0.98 * 0.97) && near(t.shafts[3].torque, 5 * 36 * 0.98 * 0.98 * 0.97) && t.shafts[3].dir === 1);
  check('gear: chain keeps direction', G.train([{ driver: 17, driven: 34, kind: 'chain', eff: 1 }], 100, 1).shafts[1].dir === 1);
  check('gear: centre distance m(N1+N2)/2 and internal m(N2−N1)/2', G.centreDistance(2, { driver: 20, driven: 40, kind: 'external', eff: 1 }) === 60 && G.centreDistance(2, { driver: 20, driven: 80, kind: 'internal', eff: 1 }) === 60);
  // NumPy rolling-contact solve: [ws, wr, wc, wp].
  let p = G.planetary(24, 72, 1500, 0, NaN);
  check('gear: planetary ring fixed, sun in (NumPy: carrier 375, planet −750)', near(p.wc, 375) && near(p.wp, -750));
  p = G.planetary(24, 72, 1000, NaN, 0);
  check('gear: planetary carrier fixed (NumPy: ring −333.33, planet −1000)', near(p.wr, -1000 / 3) && near(p.wp, -1000));
  p = G.planetary(30, 90, 1200, -300, NaN);
  check('gear: planetary two speeds in (NumPy: carrier 75, planet −1050)', near(p.wc, 75) && near(p.wp, -1050));
  p = G.planetary(30, 90, NaN, -300, 75);
  check('gear: planetary solves the sun', near(p.ws, 1200));
  const tq = G.planetaryTorques(24, 72, 10);
  check('gear: planetary torques balance and match power', near(tq.Ts + tq.Tr + tq.Tc, 0) && near(tq.Tr, 30) && near(tq.Tc, -40));
  { const c = G.planetaryChecks(24, 72, 3); check('gear: planetary assembly checks', c.Np === 24 && c.wholePlanet && c.assembles && c.fits && !G.planetaryChecks(24, 72, 5).assembles && !G.planetaryChecks(20, 100, 6).fits); }
  // Belt: NumPy explicit tangent geometry.
  let b = G.belt(300, 100, 500, false);
  check('gear: open belt length and wraps (NumPy 1648.386, 2.73888, 3.54431 rad)', near(b.L, 1648.386011989296, 1e-12) && near(b.wrapSmall, 2.738876812009132, 1e-12) && near(b.wrapLarge, 3.5443084951704544, 1e-12));
  b = G.belt(300, 100, 500, true);
  check('gear: crossed belt (NumPy 1709.440, 3.96463 rad)', near(b.L, 1709.4404081361217, 1e-12) && near(b.wrapSmall, 3.964626345724769, 1e-12));
  check('gear: equal pulleys L = 2C + πD', near(G.belt(250, 250, 600, false).L, 1200 + Math.PI * 250, 1e-12));
  check('gear: approximation close to exact', Math.abs(G.beltApprox(300, 100, 500, false) / G.belt(300, 100, 500, false).L - 1) < 1e-4);
  check('gear: centre distance from belt length', near(G.beltCentre(300, 100, 1648.386011989296, false), 500, 1e-9) && near(G.beltCentre(300, 100, 1709.4404081361217, true), 500, 1e-9));
  let threw = 0; try { G.belt(300, 100, 90, false); } catch { threw++; } try { G.planetary(24, 72, 1, NaN, NaN); } catch { threw++; } try { G.beltCentre(300, 100, 500, false); } catch { threw++; }
  check('gear: bad geometry rejected', threw === 3);
};
