// #920 heat conduction: checked against independent SciPy/mpmath work: wall resistances by hand, fins by solve_bvp,
// the transient slab by a fine method-of-lines BDF solution and the plane-wall series, the 2D plate against a
// mpmath Fourier series and a fine sparse finite-difference solve, the pipe by hand and brentq.
import * as HC from '../../src/lib/sci/phconduct.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  { const w = HC.wall([{ name: 'a', L: 0.0125, k: 0.25 }, { name: 'b', L: 0.1, k: 0.04 }, { name: 'c', L: 0.1, k: 0.7 }], 20, -5, 7.7, 25);
    check('conduction: wall R, U, flux and interface temperatures', near(w.Rtot, 2.862727272727273, 1e-12) && near(w.U, 0.3493172435693871, 1e-12) && near(w.q, 8.732931089234677, 1e-12) && [18.86585311, 18.42920655, -3.40312117, -4.65068276, -5].every((t, i) => Math.abs(w.temps[i + 1] - t) < 1e-7)); }
  { const f = HC.fin({ shape: 'pin', k: 205, h: 25, L: 0.05, D: 0.005, Tb: 100, Tinf: 20, tip: 'conv' }); check('conduction: pin fin, convective tip, heat and tip temperature match solve_bvp', near(f.q, 1.485313220350726, 1e-7) && Math.abs(f.Ttip - 90.74646105810382) < 1e-6); }
  { const f = HC.fin({ shape: 'pin', k: 205, h: 25, L: 0.05, D: 0.005, Tb: 100, Tinf: 20, tip: 'adiabatic' }); check('conduction: pin fin, adiabatic tip matches solve_bvp and M tanh mL', near(f.q, 1.454429158404632, 1e-7)); }
  { const f = HC.fin({ shape: 'rect', k: 50, h: 40, L: 0.03, t: 0.002, w: 0.1, Tb: 100, Tinf: 20, tip: 'conv' }); check('conduction: rectangular fin matches solve_bvp', near(f.q, 16.200360127930036, 1e-7) && f.eta > 0 && f.eta < 1); }
  { const f = HC.fin({ shape: 'pin', k: 1e9, h: 25, L: 0.05, D: 0.005, Tb: 100, Tinf: 20, tip: 'conv' }); check('conduction: a near-perfect conductor fin has efficiency 1', near(f.eta, 1, 1e-6)); }
  // Concrete slab 0.2 m thick, 80 °C, both faces to 20 °C air with h = 10, after 2 hours.
  const alpha = 1.4 / (2300 * 880);
  { const r = HC.slab1D({ L: 0.2, k: 1.4, alpha, T0: 80, left: { type: 'conv', h: 10, Tinf: 20 }, right: { type: 'conv', h: 10, Tinf: 20 }, tEnd: 7200, n: 201, steps: 2000, times: [7200] });
    const T = r.profiles[0].T; check(`conduction: transient slab, Crank-Nicolson centre ${T[100].toFixed(5)} and face ${T[0].toFixed(5)} match SciPy BDF`, Math.abs(T[100] - 69.29838256) < 2e-3 && Math.abs(T[0] - 55.89234236) < 2e-3); }
  check('conduction: plane wall series matches SciPy series', Math.abs(HC.wallSeries(0.1, 1.4, alpha, 10, 80, 20, 7200, 0) - 69.29838075158005) < 1e-8 && Math.abs(HC.wallSeries(0.1, 1.4, alpha, 10, 80, 20, 7200, 0.1) - 55.892342182154145) < 1e-8);
  { const r = HC.slab1D({ L: 0.1, k: 1.4, alpha, T0: 80, left: { type: 'insulated' }, right: { type: 'conv', h: 10, Tinf: 20 }, tEnd: 7200, n: 101, steps: 1000, times: [7200] });
    check('conduction: half slab with an insulated centre gives the same answer', Math.abs(r.final[0] - 69.29838) < 3e-3 && Math.abs(r.final[100] - 55.89234) < 3e-3); }
  { const r = HC.slab1D({ L: 0.1, k: 50, alpha: 1.3e-5, T0: 20, left: { type: 'fixed', T: 100 }, right: { type: 'insulated' }, tEnd: 300, n: 201, steps: 3000, times: [300] }), ex = HC.wallSeries(0.1, 50, 1.3e-5, Infinity, 20, 100, 300, 0);
    check('conduction: suddenly fixed face (infinite Biot) against the series', Math.abs(r.final[200] - ex) < 0.02 && r.final[0] === 100); }
  { const r = HC.slab1D({ L: 1, k: 1, alpha: 1, T0: 0, left: { type: 'fixed', T: 10 }, right: { type: 'fixed', T: 30 }, tEnd: 20, n: 51, steps: 200, times: [20] }); check('conduction: long time gives the straight steady profile', r.final.every((t, i) => Math.abs(t - (10 + 20 * i / 50)) < 1e-4)); }
  { const p = HC.plate2D({ W: 1, H: 1, alpha: 1, T0: 0, edges: [100, 0, 0, 0], t: Infinity, nx: 81, ny: 81 }), at = (x, y) => p.F[Math.round(y * 80) * 81 + Math.round(x * 80)];
    check(`conduction: 2D steady state against the Fourier series (centre ${at(0.5, 0.5).toFixed(3)}, (0.25, 0.75) ${at(0.25, 0.75).toFixed(3)})`, Math.abs(at(0.5, 0.5) - 25) < 0.05 && Math.abs(at(0.25, 0.75) - 43.2028332) < 0.1); }
  check('conduction: Fourier series code matches mpmath', Math.abs(HC.plateSteadyExact(1, 1, 100, 0, 0.25, 0.75) - 43.202833188693835) < 1e-6 && Math.abs(HC.plateSteadyExact(1, 1, 100, 0, 0.5, 0.9) - 80.16894653419546) < 1e-6);
  { const p = HC.plate2D({ W: 1, H: 1, alpha: 1, T0: 0, edges: [100, 0, 0, 0], t: 5, nx: 41, ny: 41, steps: 200 }); check('conduction: transient 2D plate settles to the steady state', Math.abs(p.F[20 * 41 + 20] - 25) < 0.3); }
  { const p = HC.plate2D({ W: 1, H: 1, alpha: 1, T0: 0, edges: [100, 0, 0, 0], t: 0.001, nx: 41, ny: 41, steps: 20 }); check('conduction: early on the middle of the plate is still cold', Math.abs(p.F[20 * 41 + 20]) < 1e-3); }
  { const o = { ri: 0.025, ro: 0.03, kp: 50, s: 0.04, kins: 0.04, hi: 500, ho: 10, Tin: 150, Tinf: 20 }, p = HC.pipe(o);
    check('conduction: insulated pipe heat loss and surface temperature', near(p.Q, 35.9914593420971, 1e-12) && near(p.Tsurf, 28.183169519122472, 1e-12) && near(p.rcrit, 0.004, 1e-12));
    check('conduction: insulation thickness for a 40 °C surface matches brentq', Math.abs(HC.thicknessFor(o, 40) - 0.017509081595023394) < 1e-9); }
  check('conduction: zetas for Bi = 1', Math.abs(HC.zetas(1, 1)[0] - 0.8603335890193797) < 1e-10);
};
