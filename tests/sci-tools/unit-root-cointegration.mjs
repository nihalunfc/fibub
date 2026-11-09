// #746 Unit root and cointegration: ADF (AIC, BIC, fixed lags; none/constant/trend), KPSS (auto, legacy, fixed
// lags; level/trend) and Engle-Granger statistics checked against statsmodels 0.15 adfuller, kpss and coint on
// the made-up series in src/tools/unit-root-cointegration/example.csv (53 cases: statistic, lag and rows used).
// The simulated critical values are compared with statsmodels' MacKinnon (2010) values within simulation error
// (this comparison lives only here, in the test; the tool itself never uses those tables).
import { readFileSync } from 'node:fs';
import { adf, kpss, engleGranger, simulateNull, normalRng, criticalValues, simPValue, schwert } from '../../src/lib/sci/unitroot.ts';

// [statistic, lags, rows] from statsmodels
const R = {"adf_price_a_n_AIC":[1.3176687851624753,0,119],"adf_price_a_n_BIC":[1.3176687851624753,0,119],"adf_price_a_n_None":[1.4253293460638194,3,116],"adf_price_a_c_AIC":[-1.7024100581964339,0,119],"adf_price_a_c_BIC":[-1.7024100581964339,0,119],"adf_price_a_c_None":[-1.6266664716024892,3,116],"adf_price_a_ct_AIC":[-2.8062977795964166,0,119],"adf_price_a_ct_BIC":[-2.8062977795964166,0,119],"adf_price_a_ct_None":[-2.744565875761334,3,116],"kpss_price_a_c_auto":[1.7076912430843447,6,null],"kpss_price_a_c_legacy":[0.921246365973099,13,null],"kpss_price_a_c_4":[2.340761426527541,4,null],"kpss_price_a_ct_auto":[0.07000114780234468,5,null],"kpss_price_a_ct_legacy":[0.05606461687661396,13,null],"kpss_price_a_ct_4":[0.0768105368756132,4,null],"adf_price_b_n_AIC":[1.3937319742149397,2,117],"adf_price_b_n_BIC":[1.0233710829929177,0,119],"adf_price_b_n_None":[1.416690127032825,3,116],"adf_price_b_c_AIC":[-1.821455576079038,2,117],"adf_price_b_c_BIC":[-1.7485763905241183,0,119],"adf_price_b_c_None":[-1.6766821197548918,3,116],"adf_price_b_ct_AIC":[-3.7007363946911336,0,119],"adf_price_b_ct_BIC":[-3.7007363946911336,0,119],"adf_price_b_ct_None":[-2.8779763741653737,3,116],"kpss_price_b_c_auto":[1.6730936576048732,6,null],"kpss_price_b_c_legacy":[0.9142022871534806,13,null],"kpss_price_b_c_4":[2.284382378613176,4,null],"kpss_price_b_ct_auto":[0.08004646071956475,5,null],"kpss_price_b_ct_legacy":[0.06346725939768685,13,null],"kpss_price_b_ct_4":[0.08904185840244852,4,null],"adf_index_c_n_AIC":[1.8839760279739575,0,119],"adf_index_c_n_BIC":[1.8839760279739575,0,119],"adf_index_c_n_None":[1.5209569089265182,3,116],"adf_index_c_c_AIC":[0.17958631358976448,0,119],"adf_index_c_c_BIC":[0.17958631358976448,0,119],"adf_index_c_c_None":[0.21519001244135583,3,116],"adf_index_c_ct_AIC":[-1.7494688580671434,0,119],"adf_index_c_ct_BIC":[-1.7494688580671434,0,119],"adf_index_c_ct_None":[-2.1281410685656765,3,116],"kpss_index_c_c_auto":[1.5592059001287204,6,null],"kpss_index_c_c_legacy":[0.85519925528423,13,null],"kpss_index_c_c_4":[2.1269355411638613,4,null],"kpss_index_c_ct_auto":[0.17230993104752212,6,null],"kpss_index_c_ct_legacy":[0.10943127365471296,13,null],"kpss_index_c_ct_4":[0.2276697898126471,4,null],"eg_ba_c_aic":[-3.8076350002576715,null,null],"eg_ba_c_bic":[-6.629448724962056,null,null],"eg_bac_c":[-3.7612646862854286,null,null],"eg_ca_c":[-1.3651024830878469,null,null],"eg_ba_ct_aic":[-3.855796236924884,null,null],"eg_ba_ct_bic":[-6.732007515957186,null,null],"eg_bac_ct":[-3.9141782406079475,null,null],"eg_ca_ct":[-2.331157284523032,null,null]};

export default async (check) => {
  const L = readFileSync(new URL('../../src/tools/unit-root-cointegration/example.csv', import.meta.url), 'utf8').trim().split('\n');
  const H = L[0].split(','), col = (c) => L.slice(1).map((l) => +l.split(',')[H.indexOf(c)]);
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  let adfOk = 0, adfN = 0, kOk = 0, kN = 0, eOk = 0, eN = 0;
  for (const [k, [stat, lag, nobs]] of Object.entries(R)) {
    const p = k.split('_');
    if (p[0] === 'adf') {
      const al = p[4] === 'None' ? null : p[4].toLowerCase();
      const r = adf(col(p[1] + '_' + p[2]), { regression: p[3], autolag: al, ...(al ? {} : { maxlag: 3 }) });
      adfN++; if (rel(r.stat, stat) < 1e-9 && r.usedLag === lag && r.nobs === nobs) adfOk++;
    } else if (p[0] === 'kpss') {
      const r = kpss(col(p[1] + '_' + p[2]), { regression: p[3], nlags: /\d/.test(p[4]) ? +p[4] : p[4] });
      kN++; if (rel(r.stat, stat) < 1e-9 && r.lags === lag) kOk++;
    } else {
      const ys = { ba: ['price_b', ['price_a']], bac: ['price_b', ['price_a', 'index_c']], ca: ['index_c', ['price_a']] }[p[1]];
      const X = col(ys[0]).map((_, i) => ys[1].map((c) => col(c)[i]));
      const r = engleGranger(col(ys[0]), X, { trend: p[2], autolag: p[3] || 'aic' });
      eN++; if (rel(r.stat, stat) < 1e-9) eOk++;
    }
  }
  check(`unitroot: ADF statistic, chosen lag and rows match statsmodels in ${adfOk}/${adfN} cases`, adfOk === adfN && adfN === 27);
  check(`unitroot: KPSS statistic and lags match statsmodels in ${kOk}/${kN} cases`, kOk === kN && kN === 18);
  check(`unitroot: Engle-Granger statistic matches statsmodels coint in ${eOk}/${eN} cases`, eOk === eN && eN === 8);
  check('unitroot: Schwert maximum lag for n = 120 is 13', schwert(120) === 13 && adf(col('price_a')).maxlag === 13);
  // Simulation: seeded and repeatable.
  const a = simulateNull({ test: 'adf', regression: 'c', T: 117 }, 200, normalRng(7)), b = simulateNull({ test: 'adf', regression: 'c', T: 117 }, 200, normalRng(7));
  check('unitroot: same seed, same draws', a.every((x, i) => x === b[i]) && simulateNull({ test: 'adf', regression: 'c', T: 117 }, 200, normalRng(8))[0] !== a[0]);
  const rnd = normalRng(1), xs = Array.from({ length: 20000 }, rnd), m = xs.reduce((s, x) => s + x, 0) / xs.length, v = xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length;
  check(`unitroot: normal generator mean ${m.toFixed(3)}, variance ${v.toFixed(3)}`, Math.abs(m) < 0.03 && Math.abs(v - 1) < 0.03);
  // Simulated critical values against statsmodels' MacKinnon (2010) values (1 %, 5 %, 10 %), 6000 draws.
  const near = (spec, lower, want, tol) => { const d = simulateNull(spec, 6000, normalRng(1)).sort((x, y) => x - y), cv = criticalValues(d, lower, [0.01, 0.05, 0.1]).map((c) => c.value); return { ok: cv.every((c, i) => Math.abs(c - want[i]) < tol[i]), cv }; };
  for (const [name, spec, want] of [
    ['ADF constant, T = 117', { test: 'adf', regression: 'c', T: 117 }, [-3.4875, -2.8866, -2.5801]],
    ['ADF constant + trend, T = 117', { test: 'adf', regression: 'ct', T: 117 }, [-4.0383, -3.4487, -3.1494]],
    ['ADF no constant, T = 117', { test: 'adf', regression: 'n', T: 117 }, [-2.5851, -1.9435, -1.6147]],
    ['Engle-Granger 2 series, n = 120', { test: 'eg', trend: 'c', n: 120, k: 2 }, [-3.9908, -3.3880, -3.0803]],
  ]) { const r = near(spec, true, want, [0.12, 0.06, 0.05]); check(`unitroot: simulated ${name} critical values ${r.cv.map((c) => c.toFixed(3)).join(', ')} close to statsmodels`, r.ok); }
  // KPSS: with no lags and a long series the simulation approaches the asymptotic values (10 %, 5 %, 1 %).
  const kd = simulateNull({ test: 'kpss', regression: 'c', n: 1000, lags: 0 }, 10000, normalRng(1)).sort((x, y) => x - y);
  const kc = criticalValues(kd, false, [0.1, 0.05, 0.01]).map((c) => c.value);
  check(`unitroot: simulated KPSS level critical values ${kc.map((c) => c.toFixed(3)).join(', ')} close to the asymptotic ones`, Math.abs(kc[0] - 0.347) < 0.02 && Math.abs(kc[1] - 0.463) < 0.03 && Math.abs(kc[2] - 0.739) < 0.09);
  // p-values: the example cointegrates, price_a has a unit root.
  const eg = engleGranger(col('price_b'), col('price_a').map((x) => [x]));
  const pe = simPValue(simulateNull({ test: 'eg', trend: 'c', n: 120, k: 2 }, 4000, normalRng(1)), eg.stat, true);
  check(`unitroot: Engle-Granger p ${pe.p.toFixed(3)} below 0.05 (statsmodels' MacKinnon p is about 0.013)`, pe.p < 0.05 && pe.p > 0.003);
  const ra = adf(col('price_a'));
  const pa = simPValue(simulateNull({ test: 'adf', regression: 'c', T: ra.nobs }, 4000, normalRng(1)), ra.stat, true);
  check(`unitroot: ADF p for the random walk ${pa.p.toFixed(3)} well above 0.1`, pa.p > 0.3 && pa.p < 0.6);
  check('unitroot: p-value uses (1 + hits)/(1 + R)', simPValue([1, 2, 3], 0, true).p === 0.25 && simPValue([1, 2, 3], 2.5, false).p === 0.5);
  const t = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('unitroot: too-large lag explained', /at most 58/.test(t(() => adf(col('price_a'), { maxlag: 80, autolag: null }))));
  check('unitroot: blanks explained', /blanks or text/.test(t(() => kpss([1, 2, NaN, 4, 5]))));
  check('unitroot: collinear series explained', /collinear/.test(t(() => engleGranger(col('price_a').map((x) => 2 * x + 1), col('price_a').map((x) => [x])))));
};
