// #840 Insolation calculator. References: (1) an independent numpy/scipy code that finds the Sun's longitude by
// integrating Kepler's second law from the equinox (solve_ivp) and the daily mean by integrating cos z over the hour
// angle (quad); (2) climlab 0.9 daily_insolation (Berger 1978 formulas) given the same longitude. Wider checks (scratch
// scripts, 5 orbits incl. e = 0 and e = 0.07, 13 latitudes, 10 days): longitude < 2e-10°, daily mean < 2e-9 W/m²,
// instantaneous < 1e-10 W/m² vs numpy; climlab with λ given < 3e-13 W/m², by calendar day < 0.03 W/m² at e = 0.07 (the
// e³ series climlab uses for λ; we solve Kepler's equation exactly). Annual mean, caloric half-years and summer energy
// agreed with an independent 1/8-day series to < 1e-3 W/m².
import * as I from '../../src/lib/sci/insolation.ts';
const REF = [[{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 65, 172, 89.276590292, 477.942756, 477.942756], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 65, 355, 268.728017009, 3.075967, 3.075967], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, -65, 172, 89.276590292, 2.871362, 2.871362], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 0, 80, 0.0, 436.71059, 436.71059], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 45, 30.5, 310.217630743, 165.566063, 165.566063], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, -30, 266, 179.60142422, 371.565398, 371.565398], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 80, 200, 115.979578406, 464.053616, 464.053616], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 90, 172, 89.276590292, 524.183286, 524.183286], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, -90, 355, 268.728017009, 559.22173, 559.22173], [{"e": 0.016708, "obl": 23.439, "peri": 102.937, "S0": 1361}, 66.5, 100, 19.756050365, 262.590806, 262.590806], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 65, 172, 87.233411072, 442.452386, 442.452386], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 65, 355, 265.444212006, 6.77498, 6.77498], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, -65, 172, 87.233411072, 5.640369, 5.640369], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 0, 80, 0.0, 440.667891, 440.667891], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 45, 30.5, 308.877669574, 175.641039, 175.641039], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, -30, 266, 174.391527136, 355.660234, 355.660234], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 80, 200, 112.746513792, 438.238642, 438.238642], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 90, 172, 87.233411072, 481.968734, 481.968734], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, -90, 355, 265.444212006, 561.963433, 561.963433], [{"e": 0.04, "obl": 22.5, "peri": 100, "S0": 1361}, 66.5, 100, 19.762675614, 257.126777, 257.126777], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 65, 172, 96.565445908, 567.610743, 567.610743], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 65, 355, 277.579092114, 1.219596, 1.219596], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, -65, 172, 96.565445908, 1.383348, 1.383348], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 0, 80, 0.0, 428.823705, 428.823705], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 45, 30.5, 313.826920722, 150.632906, 150.632906], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, -30, 266, 195.871741441, 410.943232, 410.943232], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 80, 200, 127.315315076, 486.943784, 486.943784], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 90, 172, 96.565445908, 624.762805, 624.762805], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, -90, 355, 277.579092114, 500.319076, 500.319076], [{"e": 0.055, "obl": 24.3, "peri": 280, "S0": 1365}, 66.5, 100, 19.797119011, 274.5626, 274.5626]];
const near = (a, b, t) => Math.abs(a - b) <= t;

export default async (check) => {
  for (const [o, lat, d, lam, q, qc] of REF) {
    const L = I.lambdaOfDay(o, d), Q = I.dailyMean(o, lat, L);
    check(`insolation: e=${o.e} lat ${lat} day ${d}: λ and daily mean as numpy (${q.toFixed(3)} W/m²) and climlab`, Math.min(Math.abs(L - lam), 360 - Math.abs(L - lam)) < 1e-7 && near(Q, q, 1e-5) && near(I.dailyMean(o, lat, lam), qc, 1e-5));
  }
  const P = I.PRESENT, e0 = { e: 0, obl: 23.44, peri: 0, S0: 1361 };
  check('insolation: equinox day 80 is λ = 0 for any orbit', [P, e0, { e: 0.06, obl: 22, peri: 250, S0: 1361 }].every((o) => near(I.lambdaOfDay(o, 80), 0, 1e-9) || near(I.lambdaOfDay(o, 80), 360, 1e-9)));
  check('insolation: circular orbit: longitude grows uniformly (day 80 + Y/4 is λ = 90)', near(I.lambdaOfDay(e0, 80 + I.YEAR / 4), 90, 1e-9));
  check('insolation: day of λ inverts λ of day', [0.5, 50, 172, 250, 364.9].every((d) => near(I.dayOfLambda(P, I.lambdaOfDay(P, d)), d, 1e-8)));
  // Equator at an equinox: S0/π/r²; pole at June solstice: S0 sin ε / r²
  { const r = I.distance(P, 0); check('insolation: equator at the equinox = S0/(π r²)', near(I.dailyMean(P, 0, 0), 1361 / Math.PI / r / r, 1e-9)); }
  { const r = I.distance(P, 90); check('insolation: North Pole at the June solstice = S0 sin ε / r²', near(I.dailyMean(P, 90, 90), 1361 * Math.sin(23.439 * Math.PI / 180) / r / r, 1e-9) && I.dailyMean(P, -90, 90) === 0); }
  check('insolation: Earth-Sun distance is 1 − e at perihelion (λ = ϖ + 180°)', near(I.distance(P, P.peri + 180), 1 - P.e, 1e-12) && near(I.distance(P, P.peri), 1 + P.e, 1e-12));
  // Global annual mean S0 / (4 √(1 − e²)), area-weighted over latitude
  for (const o of [P, { e: 0.05, obl: 22.1, peri: 40, S0: 1361 }]) {
    let s = 0, w = 0; for (let la = -89.5; la < 90; la += 1) { const c = Math.cos(la * Math.PI / 180); s += c * I.halfYears(o, la, 275, 730).annualMean; w += c; }
    check(`insolation: area-weighted annual mean = S0/(4√(1−e²)) (e = ${o.e})`, near(s / w, I.globalMean(o), 0.02));
  }
  const h65 = I.halfYears(P, 65), hs65 = I.halfYears(P, -65);
  check('insolation: annual mean is the same in both hemispheres', near(h65.annualMean, hs65.annualMean, 1e-3));
  check('insolation: caloric summer + winter = the year', near(h65.summerGJ + h65.winterGJ, h65.annualGJ, 1e-9) && near((h65.summerMean + h65.winterMean) / 2, h65.annualMean, 1e-9));
  check('insolation: caloric summer starts near the March equinox at 65° N', h65.summerStart > 60 && h65.summerStart < 100);
  check('insolation: annual mean does not depend on ϖ', near(I.halfYears({ ...P, peri: 10 }, 40).annualMean, I.halfYears({ ...P, peri: 200 }, 40).annualMean, 1e-3));
  // Kepler: perihelion in January makes the northern summer half (λ 0 to 180) longer than the winter half
  { const d = I.dayOfLambda(P, 180) - 80; check('insolation: northern spring + summer last about 186.4 days today', d > 186 && d < 186.8); }
  check('insolation: instantaneous at noon on the equator at equinox = S0/r²; zero at night', near(I.instant(P, 0, 0, 12), 1361 / I.distance(P, 0) ** 2, 1e-9) && I.instant(P, 0, 0, 0) === 0);
  check('insolation: day length 12 h at the equinox, 24 h above the Arctic Circle at the solstice', near(I.dayLength(P, 45, 0), 12, 1e-9) && near(I.dayLength(P, 70, 90), 24, 1e-9) && near(I.dayLength(P, 70, 270), 0, 1e-9));
  check('insolation: dates', I.dateOf(172) === '21 Jun' && I.dateOf(80) === '21 Mar' && I.dateOf(1) === '1 Jan' && I.dateOf(365.2) === '31 Dec');
  check('insolation: bad orbits are refused', I.checkOrbit({ ...P, e: 0.5 }) && I.checkOrbit({ ...P, obl: -1 }) && I.checkOrbit({ ...P, S0: 0 }) && I.checkOrbit(P) === null);
};
