// #688 pressure buildup analyser: the line-source example, Horner and MDH analyses and the Bourdet derivative,
// each checked against an independent NumPy/SciPy script (scipy.special.exp1 for Ei, numpy.polyfit for the lines).
import * as W from '../../src/lib/sci/eng-welltest.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const sp = [6.331539364136149, 0.5597735947761608, 0.2193839343955205, 0.048900510708061125, 4.156968929685325e-06, 3.783264029550459e-24];
  check('welltest: E1(x) matches scipy.special.exp1 at 0.001, 0.5, 1, 2, 10, 50', [0.001, 0.5, 1, 2, 10, 50].every((x, i) => Math.abs(W.e1(x) / sp[i] - 1) < 1e-12));
  const e = W.EXAMPLE;
  check('welltest: line-source pressures with skin and a fault image well match SciPy (pwf, 1 h, 100 h)', near(W.buildupPressure(e.r, e.k, e.s, e.pi, e.tp, 0, e.L), 3846.7134741667837, 1e-12) && near(W.buildupPressure(e.r, e.k, e.s, e.pi, e.tp, 1, e.L), 4083.21887310793, 1e-12) && near(W.buildupPressure(e.r, e.k, e.s, e.pi, e.tp, 100, e.L), 4154.831024257388, 1e-12));
  const ex = W.exampleBuildup(), d = ex.slice(1), dt = d.map((r) => r.dt), p = d.map((r) => r.p), pwf = ex[0].p;
  check('welltest: example has a Δt = 0 row and 41 shut-in points from 0.01 to 100 h', ex[0].dt === 0 && pwf === 3846.71 && dt.length === 41 && dt[0] === 0.01 && dt[40] === 100);
  const py = { 'horner,1,30': [31.320491579780388, 35.04255344154773, 3.005618109854466, 4167.213789589867, 4083.2076873095507], 'mdh,1,30': [31.255622969684712, 35.11528153076743, 3.0209110969064983], 'horner,5,20': [31.332498301889594, 35.029125013430836, 3.00301367810391, 4167.260560071134, 4083.2222540202292], 'mdh,5,20': [31.3165078809908, 35.04701112176736, 3.007487546381138] };
  for (const [key, v] of Object.entries(py)) {
    const [m, i0, i1] = key.split(','), a = W.analyse(dt, p, pwf, e.tp, e.r, +i0, +i1, m);
    check(`welltest: ${m} slope, k and skin on points ${i0}-${i1} match NumPy`, near(a.m, v[0], 1e-10) && near(a.k, v[1], 1e-10) && near(a.s, v[2], 1e-9) && (m === 'mdh' || (near(a.pStar, v[3], 1e-12) && near(a.p1hr, v[4], 1e-12))));
  }
  const a = W.analyse(dt, p, pwf, e.tp, e.r, 1, 30, 'horner');
  check('welltest: recovers the true k = 35 md and s = 3 within 0.2 %', Math.abs(a.k / 35 - 1) < 0.002 && Math.abs(a.s - 3) < 0.01);
  check('welltest: radius of investigation 0.029√(kΔt/φµct) = 1231.25 ft', near(a.ri, 1231.254242004375, 1e-12));
  check('welltest: Δp skin = 0.869 m s and flow efficiency', near(a.dpSkin, 0.869 * a.m * a.s, 1e-15) && near(a.flowEff, (a.pStar - pwf - a.dpSkin) / (a.pStar - pwf), 1e-15));
  const pyD = [null, 13.728747, 13.555144, 13.574586, 13.708291, 13.623593, 13.540856, 13.606397, 13.574168, 13.597115, 13.602569, 13.559801, 13.640576, 13.706292, 13.693818, 13.609913, 13.572705, 13.532608, 13.547405, 13.61789, 13.67145, 13.543581, 13.524851, 13.647167, 13.604567, 13.472898, 13.544204, 13.616892, 13.643375, 13.888554, 14.416954, 15.22498, 15.979813, 16.955134, 18.042998, 19.113849, 20.325716, 21.326027, 22.144058, null, null];
  const der = W.bourdet(dt, p.map((x) => x - pwf), e.tp, 0.2);
  check('welltest: Bourdet derivative (L = 0.2) matches an independent Python version at all 41 points', der.every((v, i) => (pyD[i] === null ? Number.isNaN(v) : Math.abs(v - pyD[i]) < 5e-7)));
  check('welltest: radial-flow derivative level ≈ m/ln 10 = 70.6 qBµ/kh = 13.60 psi', Math.abs(der[15] / (70.6 * 250 * 1.2 * 0.9 / (35 * 40)) - 1) < 0.01);
  check('welltest: the fault doubles the late derivative (towards 27.2 psi)', der[38] > 22 && der[38] < 27.3);
  const ar = W.autoRange(dt, der);
  check('welltest: automatic line picks 0.0126 to 10 h, before the fault', ar && dt[ar.i0] === 0.0126 && dt[ar.i1] === 10);
  check('welltest: drawdown derivative of a pure semi-log line is its slope / ln 10', (() => { const t = [1, 2, 4, 8, 16, 32], dd = W.bourdet(t, t.map((x) => 50 * Math.log10(x)), Infinity, 0); return Math.abs(dd[2] - 50 / Math.LN10) < 1e-9; })());
  check('welltest: autoRange returns null for a steadily rising derivative', W.autoRange([1, 2, 4, 8, 16, 32], [1, 2, 4, 8, 16, 32]) === null);
};
