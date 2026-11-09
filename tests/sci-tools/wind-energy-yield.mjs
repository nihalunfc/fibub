// #673 wind energy yield. Checked against SciPy: scipy.stats.weibull_min.fit(floc=0), an exact maximum-likelihood
// solve with brentq (which the tool matches to 1e-12; scipy's optimiser stops about 1e-5 short, at a slightly lower
// likelihood), and scipy.integrate.quad over the interpolated power curve for the annual energy.
import { fitWeibull, shear, genericCurve, powerAt, aep, aepFromData, powerDensity, gamma, lnGamma, weibullMean, cFromMean, weibullCdf, readPowerCurve, exampleSpeeds } from '../../src/lib/sci/eng-wind.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) < t;
  const d = exampleSpeeds();
  const f = fitWeibull(d);
  check('wind: MLE fit of the example year = brentq exact (k 2.10163426, c 7.17261611)', rel(f.k, 2.1016342617050006, 1e-11) && rel(f.c, 7.172616105760995, 1e-11));
  check('wind: fit within 1e-5 of scipy.stats.weibull_min.fit (k 2.101649, c 7.172574)', rel(f.k, 2.101648694960021, 1e-5) && rel(f.c, 7.172574055577666, 1e-5));
  const hub = d.map((v) => shear(v, 10, 100, 'power', 0.143)), fh = fitWeibull(hub);
  check('wind: power-law shear scales c and keeps k', rel(fh.k, f.k, 1e-10) && rel(fh.c, f.c * 10 ** 0.143, 1e-10) && rel(fh.c, 9.96959662888577, 1e-11));
  check('wind: log law ln(100/0.03)/ln(10/0.03)', rel(shear(6, 10, 100, 'log', 0.03), 6 * Math.log(100 / 0.03) / Math.log(10 / 0.03), 1e-14));
  const cur = genericCurve(2000, 100, 0.45, 3, 25);
  check('wind: generic curve capped at rated, zero below cut-in and above cut-out', powerAt(cur, 2.4) === 0 && powerAt(cur, 15) === 2000 && powerAt(cur, 25.1) === 0 && rel(powerAt(cur, 6), 0.5 * 1.225 * Math.PI * 2500 * 216 * 0.45 / 1000, 1e-12));
  const a1 = aep(cur, fh.k, fh.c), a2 = aep(cur, fh.k, fh.c, 1.1);
  check('wind: AEP at 1.225 kg/m³ = 10,308,664 kWh (SciPy quad)', rel(a1.kWh, 10308664.378504004, 1e-5));
  check('wind: AEP at 1.1 kg/m³ = 9,925,074 kWh (SciPy quad)', rel(a2.kWh, 9925074.269809972, 1e-5));
  check('wind: energy straight from the readings 10,347,219 kWh (NumPy)', rel(aepFromData(cur, hub).kWh, 10347219.33934861, 1e-10));
  check('wind: power density ½ρc³Γ(1+3/k) = 767.694 W/m² (SciPy gamma)', rel(powerDensity(fh.k, fh.c), 767.6939077481653, 1e-5));
  check('wind: gamma function', rel(gamma(5), 24, 1e-12) && rel(gamma(0.5) ** 2, Math.PI, 1e-12) && rel(Math.exp(lnGamma(10.5)), 1133278.3889487855, 1e-10));
  check('wind: mean and c round trip, Rayleigh mean', rel(weibullMean(2, cFromMean(6.2, 2)), 6.2, 1e-12) && rel(weibullMean(2, 7), 7 * Math.sqrt(Math.PI) / 2, 1e-12) && rel(weibullCdf(7, 2, 7), 1 - Math.exp(-1), 1e-12));
  { const z = fitWeibull([0, 0, ...d.slice(0, 98)]); check('wind: calms counted, not fitted', z.calm === 2 && z.n === 98); }
  check('wind: AEP with a calm share scales down', rel(aep(cur, 2, 8, 1.225, 1.225, 0.1).kWh, aep(cur, 2, 8).kWh * 0.9, 1e-12));
  check('wind: power curve reader', readPowerCurve('speed,kW\n3,0\n4,50\n5,120').curve.v.length === 3 && !!readPowerCurve('3,0\n5,2\n4,1').error);
};
