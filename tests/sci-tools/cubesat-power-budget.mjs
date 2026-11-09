// #510 CubeSat power budget. Eclipse fractions (48 altitude and beta pairs) matched a brute-force numpy
// cylindrical-shadow test at 2 million points around the orbit (to 5e-7); nadir, sun-pointing and tumbling array
// power matched numpy with explicit position, velocity and body-axis vectors (1e-14 W); one-orbit energies matched
// a 400,001-point trapezoid integral to 0.03 %; the battery simulation matched a separate numpy implementation.
import { period, betaStar, eclipseFraction, inShadow, sunNadir, derate, panelPeak, arrayPower, parseLoads, loadAverage, simulate, EXAMPLE_PANELS, EXAMPLE_LOADS } from '../../src/lib/sci/cubesatpower.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('cubesat: ISS-like 400 km period about 92.6 min', near(period(400) / 60, 92.56, 1e-3));
  check('cubesat: geostationary period is one sidereal day', near(period(35786) / 86164.1, 1, 2e-4));
  check('cubesat: beta* at 400 km is 70.2°', near(betaStar(400), 70.2, 2e-3));
  check('cubesat: eclipse fractions (numpy shadow)', near(eclipseFraction(400, 0), 0.3900996182292888) && near(eclipseFraction(400, 45), 0.3411330617874696) && near(eclipseFraction(400, 70), 0.046074390077369166) && eclipseFraction(400, 75) === 0 && near(eclipseFraction(400, -40), 0.3543377639762772));
  check('cubesat: 400 km at beta 0 is about 36 min of shadow', near(eclipseFraction(400, 0) * period(400) / 60, 36.11, 1e-3));
  check('cubesat: shadow is centred on orbit midnight', inShadow(400, 0, 180) && !inShadow(400, 0, 0) && !inShadow(400, 0, 105) && inShadow(400, 0, 140) && !inShadow(400, 80, 180));
  { const s = sunNadir(0, 0), s2 = sunNadir(0, 90), s3 = sunNadir(90, 33); check('cubesat: Sun in the nadir frame (zenith at noon, behind after, orbit normal at beta 90)', near(s[2], -1) && near(s2[0], -1) && near(Math.abs(s3[1]), 1)); }
  const arr = { panels: [{ name: 'a', face: '+X', areaCm2: 340 }, { name: 'b', face: '-X', areaCm2: 340 }, { name: 'c', face: '+Y', areaCm2: 340 }, { name: 'd', face: '-Y', areaCm2: 340 }, { name: 'e', face: '-Z', areaCm2: 1360 }, { name: 'f', face: '+Z', areaCm2: 100 }], eff: 0.28, packing: 0.85, tempCoef: -0.25, tempC: 50, refC: 28, degPerYear: 2.5, years: 2, other: 0.9 };
  check('cubesat: derating = temperature × age × other', near(derate(arr), 0.945 * 0.975 * 0.975 * 0.9));
  check('cubesat: peak panel power by hand', near(panelPeak(arr, arr.panels[0]), 1361 * 0.034 * 0.85 * 0.28 * derate(arr)) && near(panelPeak(arr, arr.panels[0]), 8.90425417620375));
  check('cubesat: sun-pointing face only', near(arrayPower(arr, { mode: 'sun', sunFace: '-Z' }, 0, 0), 35.617016704815));
  check('cubesat: tumbling quarter of all panels', near(arrayPower(arr, { mode: 'tumble', sunFace: '-Z' }, 0, 0), 0.25 * (4 * 8.90425417620375 + 35.617016704815 + 2.61889828711875)));
  check('cubesat: nadir at noon, beta 0: zenith face (-Z) full on', near(arrayPower(arr, { mode: 'nadir', sunFace: '-Z' }, 0, 0), 35.617016704815));
  check('cubesat: nadir at u = 90°: the -X (trailing) face', near(arrayPower(arr, { mode: 'nadir', sunFace: '-Z' }, 0, 90), 8.90425417620375));
  const L = parseLoads(parseTable(EXAMPLE_LOADS), num);
  check('cubesat: example load table, three modes', L.modes.join() === 'Nominal,Payload,Safe' && L.loads.length === 7);
  check('cubesat: orbit-average loads', near(loadAverage(L.loads, 0), 0.4 + 1.5 + 0.2 + 0.2 + 0.4) && near(loadAverage(L.loads, 1), 0.4 + 1.5 + 0.2 + 0.2 + 2.5 + 3 + 0.4) && near(loadAverage(L.loads, 2), 0.4 + 0.3 + 0.2 + 0.08 + 0.6));
  check('cubesat: bad duty cycle refused', /must be 0 to 100/.test(parseLoads([['a', 'W', 'M'], ['x', '1', '120']], num)));
  check('cubesat: example panels parse', parseTable(EXAMPLE_PANELS).length === 7);
  const bat = { capacityWh: 40, chargeEff: 0.95, dischargeEff: 0.95, startSoc: 100 };
  const sun = simulate(400, 0, arr, { mode: 'sun', sunFace: '-Z' }, 6.5, bat);
  check('cubesat: sun-pointing DoD = load × eclipse / discharge efficiency', near(sun.maxDod, 100 * 6.5 * eclipseFraction(400, 0) * period(400) / 3600 / 0.95 / 40, 2e-3) && near(sun.maxDod, 10.29858545671253));
  const nad = simulate(500, 20, arr, { mode: 'nadir', sunFace: '-Z' }, 6.5, bat);
  check('cubesat: nadir simulation (numpy)', near(nad.eGen, 25.805379172975137) && near(nad.maxDod, 9.965374239886415) && nad.endSoc === 100 && nad.soc.length === 3 * 1440 + 1);
  const tum = simulate(700, 35, arr, { mode: 'tumble', sunFace: '-Z' }, 6.5, bat);
  check('cubesat: tumbling simulation (numpy)', near(tum.eGen, 20.600701075402153) && near(tum.maxDod, 9.073444240647177));
  const hungry = simulate(500, 20, arr, { mode: 'nadir', sunFace: '-Z' }, 40, bat, 3);
  check('cubesat: too much load empties the battery', hungry.empty && hungry.endSoc === 0);
  const idle = simulate(500, 80, arr, { mode: 'sun', sunFace: '-Z' }, 1, bat, 2);
  check('cubesat: no eclipse, small load: battery stays full, surplus shunted', idle.ecl === 0 && idle.maxDod === 0 && idle.shunted > 0);
};
