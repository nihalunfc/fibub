// #957 lattice Boltzmann: Poiseuille flow against the exact parabola, forces against an independent NumPy D2Q9 code.
import { Lbm, drawShape, tauFor, strouhal } from '../../src/lib/sci/phlbm.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  { const ny = 34, s = new Lbm(4, ny, 0.8, 0, 'channel', 1e-6); for (let i = 0; i < 20000; i++) s.step();
    let err = 0; for (let y = 1; y < ny - 1; y++) { const a = (1e-6 / (2 * 0.1)) * (y - 0.5) * (ny - 1.5 - y); err = Math.max(err, Math.abs(s.ux[y * 4 + 1] - a) / 1.28e-3); }
    check(`lbm: Poiseuille channel matches g y(H−y)/2ν within 1 % of the peak (${(100 * err).toFixed(2)} %)`, err < 0.01); }
  { const s = new Lbm(120, 48, tauFor(60, 0.1, 10), 0.1); drawShape(s, 'cylinder', 30, 24.5, 10);
    const got = {}; for (let i = 0; i < 400; i++) { s.step(); if (i === 0 || i === 99 || i === 399) got[i] = [s.fx, s.fy]; }
    check('lbm: cylinder force at step 1 equals NumPy (2.26667)', near(got[0][0], 2.2666667, 1e-6) && got[0][1] === 0);
    check('lbm: drag and lift at step 100 equal NumPy (0.0586571, −0.00298617)', near(got[99][0], 0.0586570798, 1e-5) && near(got[99][1], -0.0029861746, 1e-4));
    check('lbm: drag and lift at step 400 equal NumPy (0.1050141, −0.00131776)', near(got[399][0], 0.1050141247, 1e-5) && near(got[399][1], -0.0013177592, 1e-4));
    check('lbm: frontal height of a 10-cell cylinder', s.frontalHeight() === 10);
    let m = 0; for (let n = 0; n < s.N; n++) if (!s.solid[n]) m += s.rho[n]; check('lbm: density stays near 1', Math.abs(m / (s.N - 79) - 1) < 0.02); }
  check('lbm: τ = 3UL/Re + ½', Math.abs(tauFor(100, 0.1, 16) - 0.548) < 1e-12);
  { const lift = Array.from({ length: 4000 }, (_, i) => Math.sin((2 * Math.PI * i) / 800) + 0.3); check('lbm: Strouhal from zero crossings of a sine with period 800', near(strouhal(lift, 16, 0.1), 16 / (800 * 0.1), 1e-6)); }
  { const s = new Lbm(60, 40, 0.6, 0.1); drawShape(s, 'airfoil', 30, 20, 30, 0); let n = 0; for (const v of s.solid) n += v; check('lbm: NACA 0012 of chord 30 covers about 0.082 c² cells', n > 50 && n < 95); }
};
