// #662 pump and system curve. Reference values from an independent Python check written for these tests:
// numpy.polyfit for the head, efficiency and NPSHr fits, scipy.optimize.brentq for the operating points (single,
// parallel, series, changed speed), a SciPy Colebrook pipe system curve, and NPSH available with water density
// and vapour pressure from the Python iapws package.
import * as P from '../../src/lib/sci/pumpsys.ts';
import { pipeFlow } from '../../src/lib/sci/pipenet.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-300);
  const Q = [0, 10, 20, 30, 40, 50].map((x) => x / 1000), H = [42, 41, 38.5, 34, 27.5, 19], E = [0, 45, 66, 75, 72, 60], N = [undefined, 1.5, 2, 2.8, 4, 5.5];
  const fit = P.fitPump(Q, H, E, N);
  check('pump: head quadratic matches numpy.polyfit', [41.910714285714285, 20.53571428571335, -9553.571428571408].every((c, i) => near(fit.head[i], c, 1e-9)));
  check('pump: efficiency cubic matches numpy.polyfit', [0.3809523809524299, 5467.460317460325, -120119.047619048, 694444.4444444482].every((c, i) => near(fit.eff[i], c, 1e-8)));
  check('pump: NPSHr quadratic matches numpy.polyfit (skipping the blank point)', [1.36, -2.8571428571432094, 1714.28571428572].every((c, i) => near(fit.npsh[i], c, 1e-8)));
  check('pump: polyfit recovers an exact cubic', (() => { const x = [0, 1, 2, 3, 4], c = P.polyfit(x, x.map((t) => 2 - t + 0.5 * t * t - 0.1 * t ** 3), 3); return [2, -1, 0.5, -0.1].every((v, i) => Math.abs(c[i] - v) < 1e-10); })());
  const sys = P.quadSystem(15, 12, 0.04);
  const ref = { single: [0.04033083684212119, 27.1993230028935, 0.7106177444070315, 4.033185723969598], par2: [0.052689238640981094, 35.82116901424692, 0.7374916917226061, 2.4745107456127093], ser2: [0.05163607138995493, 34.997129014413915, 0.58036272583975, 5.783240713609027], speed09: [0.03387897680123652, 23.60838801824042, 0.7302586412592871, 2.9821141781089175], par3_08: [0.037482079267686805, 25.536796996718678, 0.5911657657476466, 1.1094434188873181] };
  for (const [k, n, mode, r] of [['single', 1, 'single', 1], ['par2', 2, 'parallel', 1], ['ser2', 2, 'series', 1], ['speed09', 1, 'single', 0.9], ['par3_08', 3, 'parallel', 0.8]]) {
    const m = { fit, r, arr: { n, mode } }, o = P.operatingPoint(m, sys), [q, h, e, ns] = ref[k];
    check(`pump: operating point ${k} matches brentq (${(q * 1000).toFixed(2)} L/s, ${h.toFixed(2)} m)`, near(o.Q, q, 1e-9) && near(o.H, h, 1e-9) && near(P.setEff(m, o.Q), e, 1e-9) && near(P.setNpshr(m, o.Q), ns, 1e-9));
  }
  { const m = { fit, r: 1, arr: { n: 1, mode: 'single' } }, fl = { rho: 998.2336361398824, mu: 0.0010017487594089526 }, p = { L: 300, D: 0.15, eps: 5e-5, K: 5 };
    const o = P.operatingPoint(m, (q) => 15 + pipeFlow(p, q, fl).h);
    check('pump: operating point on a Colebrook pipe system matches SciPy (41.78 L/s, 26.09 m)', near(o.Q, 0.04178164079914522, 1e-8) && near(o.H, 26.091007860878765, 1e-8)); }
  check('pump: NPSH available matches the iapws-based value (6.612 m)', near(P.npsha(101325, 2339.214766776897, 998.2060924679477, -3, 0.5), 6.611880784769895, 1e-12));
  { const m = { fit, r: 0.9, arr: { n: 1, mode: 'single' } };
    check('pump: affinity laws scale shut-off head by r² and run-out flow by r', near(P.setHead(m, 0), 0.81 * fit.head[0], 1e-12) && near(P.maxFlow(m), 0.9 * P.maxFlow({ fit, r: 1, arr: m.arr }), 1e-12)); }
  check('pump: no operating point when static head exceeds shut-off head', P.operatingPoint({ fit, r: 1, arr: { n: 1, mode: 'single' } }, P.quadSystem(50, 5, 0.04)) === null);
  check('pump: series pumps double the shut-off head, parallel pumps double the run-out flow', near(P.setHead({ fit, r: 1, arr: { n: 2, mode: 'series' } }, 0), 2 * fit.head[0], 1e-12) && near(P.maxFlow({ fit, r: 1, arr: { n: 2, mode: 'parallel' } }), 2 * P.maxFlow({ fit, r: 1, arr: { n: 1, mode: 'single' } }), 1e-12));
};
