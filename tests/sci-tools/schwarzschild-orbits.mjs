// #968 Schwarzschild orbits. References: SciPy solve_ivp (orbit equation integrated to the next apsis, rtol 1e-12)
// and quad/brentq for light deflection, plus the closed-form circular-orbit results.
import * as G from '../../src/lib/sci/phgr.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const ref = [[10, 30, 0.9763152612561693, 4.375949744936836, 1.8472766561751701], [8, 12, 0.9563650695950074, 3.7481702853265455, 4.001125986247146], [100, 300, 0.9975096759744697, 12.38232515119494, 0.12962183080816914], [6.5, 7, 0.9441482903286932, 3.4858481317118173, 12.706535509496351]];
  check('gr: bound orbit E, L and periapsis advance match SciPy solve_ivp', ref.every(([rp, ra, E, L, d]) => { const o = G.bound(rp, ra); return near(o.E, E, 1e-12) && near(o.L, L, 1e-12) && near(o.precession, d, 1e-9); }));
  check('gr: weak-field limit 6πM/(a(1 − e²)) for a wide orbit', (() => { const o = G.bound(2000, 3000); return near(o.precession, o.weak, 0.01); })());
  check('gr: circular orbit at 10M (E = 0.95618, L = 3.7796)', near(G.circular(10).E, 0.9561828874675149, 1e-13) && near(G.circular(10).L, 3.7796447300922726, 1e-13));
  check('gr: ISCO at 6M: E = √(8/9), L = √12, efficiency 5.72 %', near(G.circular(6).E, Math.sqrt(8 / 9), 1e-14) && near(G.circular(6).L, Math.sqrt(12), 1e-14) && G.circular(6).stable && !G.circular(5.9).stable);
  check('gr: marginally bound circular orbit at 4M has E = 1', near(G.circular(4).E, 1, 1e-14) && G.circular(3) === null);
  check('gr: circular orbit as the limit rp = ra', (() => { const o = G.bound(10, 10 + 1e-9); return near(o.L, G.circular(10).L, 1e-7) && near(o.E, G.circular(10).E, 1e-9); })());
  check('gr: no bound orbit when the third root lies inside (rp 4.5, ra 10), but rp 5 with ra 20 is allowed', G.bound(4.5, 10) === null && G.bound(1.5, 30) === null && G.bound(5, 20) !== null);
  check('gr: effective potential peaks equal circular E²', near(G.veff2(10, G.circular(10).L), G.circular(10).E ** 2, 1e-13));
  const lr = [[6, 4.453363193811355, 1.7193883102320378], [10, 8.78885066253791, 0.5903957873920054], [100, 98.9845863754294, 0.041222539744071085]];
  check('gr: light closest approach and deflection match SciPy quad', lr.every(([b, r, d]) => { const x = G.lightRay(b); return near(x.rmin, r, 1e-9) && near(x.deflection, d, 1e-8); }));
  check('gr: photons with b < 3√3 M are captured', G.lightRay(5).captured && !G.lightRay(5.3).captured);
  check('gr: weak-field light bending 4M/b', near(G.lightRay(1e4).deflection, 4e-4, 0.002));
  check('gr: RK4 trace returns to periapsis after Δφ', (() => { const o = G.bound(10, 30), pts = G.trace(o.u2, 0, 1 / (o.L * o.L), o.dphi, 0.001); return Math.abs(pts[pts.length - 1][1] - o.u2) < 1e-6; })());
  check('gr: solar mass length and time scales', near(G.M_SUN_M, 1476.625, 1e-6) && near(G.M_SUN_S * 299792458, G.M_SUN_M, 1e-5));
};
