// #935 Sellmeier fitter: fits checked against SciPy least_squares (Sellmeier) and NumPy lstsq (Cauchy) on the same
// made-up data; derivatives against SymPy; group index, GVD and D from those derivatives.
import { fit, nOf, derivs, abbe, dispersion, readData, LINES } from '../../src/lib/sci/phsell.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const data = [[380, 1.55306], [420, 1.54541], [460, 1.53994], [500, 1.53584], [550, 1.53194], [600, 1.52903], [650, 1.52671], [700, 1.52483], [800, 1.52198], [900, 1.51979], [1000, 1.518], [1200, 1.51505], [1400, 1.51235], [1600, 1.50972]];
  const rd = readData([data.map((r) => r[0]), data.map((r) => r[1])], 'auto');
  check('sell: nm detected and converted to µm', rd.unit === 'nm' && rd.ls[0] === 0.38 && rd.dropped === 0);
  check('sell: µm kept, bad rows dropped', (() => { const r = readData([[0.5, 0.6, NaN], [1.5, 0.2, 1.4]], 'auto'); return r.unit === 'um' && r.ls.length === 1 && r.dropped === 2; })());
  const sse = (f) => f.res.reduce((s, r) => s + r * r, 0);
  const s3 = fit({ kind: 'sellmeier', terms: 3 }, rd.ls, rd.ns);
  check('sell: 3-term SSE at least as good as SciPy (1.5876e-9)', sse(s3) <= 1.5876028522351366e-9 * (1 + 1e-6));
  check('sell: 3-term predictions vs SciPy at 550 and 1550 nm', near(nOf(s3.model, s3.p, 0.55), 1.5319544907145914, 2e-6) && near(nOf(s3.model, s3.p, 1.55), 1.510384877002097, 2e-6));
  const s2 = fit({ kind: 'sellmeier', terms: 2 }, rd.ls, rd.ns);
  check('sell: 2-term vs SciPy (SSE, B1, C1, C2)', near(sse(s2), 1.3388109638528343e-7, 1e-13) && near(s2.p[0], 1.2963777206869052, 1e-6) && near(s2.p[1], 0.011861717368059015, 1e-7) && near(s2.p[3], 11.271372122673782, 1e-3));
  const s1 = fit({ kind: 'sellmeier', terms: 1 }, rd.ls, rd.ns);
  check('sell: 1-term vs SciPy', near(s1.p[0], 1.2845016779797245, 1e-8) && near(s1.p[1], 0.013444256023258081, 1e-9));
  const c3 = fit({ kind: 'cauchy', terms: 3 }, rd.ls, rd.ns), c2 = fit({ kind: 'cauchy', terms: 2 }, rd.ls, rd.ns);
  check('sell: Cauchy 3-term vs NumPy lstsq', near(c3.p[0], 1.5092501300888739, 1e-12) && near(c3.p[1], 0.0077699812226529, 1e-12) && near(c3.p[2], -0.00022870313386189184, 1e-12));
  check('sell: Cauchy 2-term vs NumPy lstsq', near(c2.p[0], 1.5108716318600164, 1e-12) && near(c2.p[1], 0.0062210915524087305, 1e-12) && near(sse(c2), 2.531059455417276e-5, 1e-15));
  check('sell: more Sellmeier terms fit better', sse(s3) < sse(s2) && sse(s2) < sse(s1));
  check('sell: residuals and RMS consistent', near(s2.rms, Math.sqrt(sse(s2) / 14), 1e-15) && s2.dof === 10 && s3.converged);
  const m = { kind: 'sellmeier', terms: 3 }, p = [1.2, 0.0085, 0.1, 0.04, 0.9, 90];
  { const d = derivs(m, p, 0.8); check('sell: n, dn/dλ, d²n/dλ² at 0.8 µm vs SymPy', near(d.n, 1.5219634846491812, 1e-14) && near(d.d1, -0.02461667055534063, 1e-13) && near(d.d2, 0.06791537669914947, 1e-12)); }
  { const d = derivs(m, p, 1.55); check('sell: derivatives at 1.55 µm vs SymPy (sign change of GVD)', near(d.d1, -0.013394764106663737, 1e-13) && near(d.d2, -0.0028671911855037415, 1e-12)); }
  { const d = dispersion(m, p, 0.8); check('sell: group index, β2, D at 0.8 µm', near(d.ng, 1.5416568210934536, 1e-12) && near(d.beta2, 61.5767553022678, 1e-8) && near(d.D, -181.23304942954763, 1e-7)); }
  { const cm = { kind: 'cauchy', terms: 3 }, cp = [1.5, 0.004, 0.0001], l = 0.7, h = 1e-4; const d = derivs(cm, cp, l); check('sell: Cauchy derivatives vs finite differences', near(d.d1, (nOf(cm, cp, l + h) - nOf(cm, cp, l - h)) / (2 * h), 1e-7) && near(d.d2, (nOf(cm, cp, l + h) - 2 * nOf(cm, cp, l) + nOf(cm, cp, l - h)) / (h * h), 1e-5)); }
  check('sell: Abbe number of the made-up glass 49.6', near(abbe(m, p), 49.61568550529097, 1e-9) && LINES.d === 0.5875618);
  let msg = ''; try { fit({ kind: 'sellmeier', terms: 3 }, rd.ls.slice(0, 5), rd.ns.slice(0, 5)); } catch (e) { msg = e.message; }
  check('sell: too few points message', msg.includes('at least 7 data points'));
};
