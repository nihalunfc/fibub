// #T996 Heat stress: the ISO 7243 WBGT weightings, the Australian Bureau of Meteorology estimate from air
// temperature and humidity, Stull (2011) wet bulb, and the US Army TB MED 507 heat flags. Reference values are the
// worked examples in src/tools/heat-stress/guide.md, Stull (2011) and the flag thresholds in TB MED 507; the sample
// day is from Farnham et al. (2025), Clean Technologies 7(1): 9 (CC BY), used in
// src/blog/discoveries/misting-fan-wbgt-allowance-ppe-outdoor-workers.md.
import { wbgtOutdoor, wbgtIndoor, wbgtEstimate, vapourPressure, stullWetBulb, flagFor, FLAGS, cToF, fToC } from '../../src/lib/sci/wbgt.ts';

const near = (a, b, tol) => Math.abs(a - b) <= tol;

export default async (check) => {
  // ISO 7243 / NIOSH weightings, hand-worked.
  check('heat-stress: outdoor WBGT 0.7x25 + 0.2x40 + 0.1x32 = 28.7 °C', near(wbgtOutdoor(25, 40, 32), 28.7, 1e-12));
  check('heat-stress: shade WBGT 0.7x25 + 0.3x40 = 29.5 °C', near(wbgtIndoor(25, 40), 29.5, 1e-12));
  check('heat-stress: the weights add to one', near(0.7 + 0.2 + 0.1, 1, 1e-15) && near(wbgtOutdoor(30, 30, 30), 30, 1e-12) && near(wbgtIndoor(30, 30), 30, 1e-12));

  // Bureau of Meteorology estimate: the worked example in the tool's guide (30 °C, 50 % -> e = 21.14 hPa, WBGT 29.26).
  check(`heat-stress: vapour pressure at 30 °C and 50 % is 21.14 hPa (${vapourPressure(30, 50).toFixed(2)})`, near(vapourPressure(30, 50), 21.14, 0.005));
  check(`heat-stress: estimate at 30 °C and 50 % is 29.26 °C (${wbgtEstimate(30, 50).toFixed(2)})`, near(wbgtEstimate(30, 50), 29.26, 0.005));
  check('heat-stress: vapour pressure is linear in humidity and zero at 0 %', near(vapourPressure(30, 0), 0, 1e-15) && near(vapourPressure(30, 100), 2 * vapourPressure(30, 50), 1e-12));

  // Stull (2011) wet bulb: the value in the tool's guide, and the standard check that it never exceeds air temperature.
  check(`heat-stress: Stull wet bulb at 20 °C and 50 % is 13.7 °C (${stullWetBulb(20, 50).toFixed(2)})`, near(stullWetBulb(20, 50), 13.7, 0.05));
  check('heat-stress: Stull wet bulb equals air temperature at 100 % and is below it otherwise', near(stullWetBulb(25, 100), 25, 0.3) && [10, 20, 30, 40].every((t) => [10, 30, 60, 90].every((rh) => stullWetBulb(t, rh) < t + 1e-9)));

  // Heat flags (TB MED 507): the thresholds, and that a tenth below each one still gives the lower flag.
  check('heat-stress: flag thresholds are 27.8, 29.4, 31.1 and 32.2 °C', FLAGS.map((f) => f.min).slice(1).every((v, i) => near(v, [27.8, 29.4, 31.1, 32.2][i], 1e-12)));
  check('heat-stress: flags switch exactly at their thresholds', ['White', 'Green', 'Yellow', 'Red', 'Black'].every((name, i) => {
    const m = FLAGS[i].min;
    return flagFor(Number.isFinite(m) ? m : 20).name === name && (i === 0 || flagFor(m - 0.1).name === FLAGS[i - 1].name);
  }));
  check('heat-stress: °C and °F round-trip and 82 °F is the green threshold', near(fToC(cToF(31.1)), 31.1, 1e-12) && near(cToF(27.8), 82.04, 0.01));

  // New with the misting-fan article: Farnham et al. (2025) sample day, 13 Sept 2022, 4 m from the fan.
  // Air 32.4 °C, relative humidity 48 %, natural wet bulb 24.3 °C, globe 0.3 °C below air (the paper's mean offset).
  const ta = 32.4, rh = 48, tnw = 24.3, tg = ta - 0.3;
  const meas = wbgtOutdoor(tnw, tg, ta), est = wbgtEstimate(ta, rh);
  check(`heat-stress: the paper's sample day measures WBGT 26.67 °C, white flag (${meas.toFixed(2)}, ${flagFor(meas).name})`, near(meas, 26.67, 0.005) && flagFor(meas).id === 'white');
  check(`heat-stress: the same day estimated from 32.4 °C and 48 % gives 31.45 °C, red flag (${est.toFixed(2)}, ${flagFor(est).name})`, near(est, 31.45, 0.005) && flagFor(est).id === 'red');
  check(`heat-stress: the estimate over-reads that shaded, fan-blown day by 4.78 °C (${(est - meas).toFixed(2)})`, near(est - meas, 4.78, 0.005));
  check(`heat-stress: Stull wet bulb for that day is 23.98 °C, near the measured natural wet bulb of 24.3 (${stullWetBulb(ta, rh).toFixed(2)})`, near(stullWetBulb(ta, rh), 23.98, 0.005));
  check('heat-stress: the paper\'s 18.3 and 20.3 W/m2 of extra cooling are 0.61 and 0.68 °C of WBGT at 30 W/m2 per °C', near(18.3 / 30, 0.61, 0.005) && near(20.3 / 30, 0.677, 0.005));
  check('heat-stress: 0.31 and 0.35 met are 18.0 and 20.4 W/m2 at 58.15 W/m2 per met', near(0.31 * 58.15, 18.0, 0.05) && near(0.35 * 58.15, 20.4, 0.05));
  // The hypothetical Osaka day in the same paper: 35 °C, 45 %, natural wet bulb about 25 °C.
  const m2 = wbgtOutdoor(25, 34.7, 35), e2 = wbgtEstimate(35, 45);
  check(`heat-stress: the paper's hypothetical day measures 27.94 °C (green) but estimates 33.69 °C (black)`, near(m2, 27.94, 0.005) && flagFor(m2).id === 'green' && near(e2, 33.69, 0.005) && flagFor(e2).id === 'black');
};
