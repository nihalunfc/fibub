// #918 Ising model: exact enumeration and Onsager's results checked against an independent NumPy/SciPy script
// (enumeration of every state; energy from Onsager's free-energy double integral); Monte Carlo against exact values.
import * as IS from '../../src/lib/sci/phising.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  { const x = IS.exactSmall(3, 2.5); check('ising: exact 3x3 at T 2.5 matches NumPy', near(x.e, -1.462122418092342, 1e-12) && near(x.m, 0.8168608191224309, 1e-12) && near(x.c, 0.6530320263295375, 1e-10)); }
  { const x = IS.exactSmall(4, 2.5); check('ising: exact 4x4 at T 2.5 matches NumPy', near(x.e, -1.3791164822593487, 1e-12) && near(x.m, 0.7647123932216829, 1e-12) && near(x.c, 0.8125152294404586, 1e-10)); }
  { const x = IS.exactSmall(4, 2.0, 0.1); check('ising: exact 4x4 in a field h 0.1 matches NumPy', near(x.e, -1.8372376701475932, 1e-12) && near(x.m, 0.9279582802816633, 1e-12) && near(x.c, 0.6060416019801593, 1e-10)); }
  check('ising: Tc = 2/ln(1+√2)', near(IS.TC, 2.269185314213022, 1e-14));
  const uRef = { 1.5: -1.9511174298, 2: -1.7455649348, 2.5: -1.1060799334, 3: -0.8173098488 };
  check('ising: Onsager energy matches the free-energy integral (SciPy)', Object.entries(uRef).every(([T, u]) => near(IS.onsager.u(+T), u, 2e-6)));
  check('ising: Onsager magnetisation', near(IS.onsager.m(1.5), 0.9864996026214945, 1e-12) && near(IS.onsager.m(2), 0.911319377877496, 1e-12) && IS.onsager.m(2.5) === 0);
  check('ising: Onsager heat capacity', near(IS.onsager.c(2), 0.7248714953, 1e-6) && near(IS.onsager.c(2.5), 0.8616984552, 1e-6) && near(IS.onsager.c(3), 0.4013795893, 1e-6));
  check('ising: elliptic K(0) = π/2 and K(0.5)', near(IS.ellipK(0), Math.PI / 2, 1e-15) && near(IS.ellipK(0.5), 1.685750354812596, 1e-13));
  { const r = IS.rng(7), lat = new IS.Lattice(4, 'random', r); lat.sweep(2.5, 0, r, 2000); const s = IS.measure(lat, 2.5, 0, 60000, r);
    check(`ising: Monte Carlo 4x4 at T 2.5 agrees with exact (e ${s.e.toFixed(4)}, |m| ${s.m.toFixed(4)}, C ${s.c.toFixed(3)})`, Math.abs(s.e + 1.37912) < 4 * s.mErr + 0.01 && Math.abs(s.m - 0.76471) < 4 * s.mErr + 0.005 && Math.abs(s.c - 0.81252) < 0.05); }
  { const r = IS.rng(3), lat = new IS.Lattice(4, 'up', r); lat.recount(0.1); lat.sweep(2, 0.1, r, 2000); const s = IS.measure(lat, 2, 0.1, 200000, r);
    check(`ising: Monte Carlo 4x4 in a field h 0.1 agrees with exact (e ${s.e.toFixed(4)}, |m| ${s.m.toFixed(4)})`, Math.abs(s.e + 1.83724) < 0.015 && Math.abs(s.m - 0.92796) < 0.006); }
  { const r = IS.rng(5), lat = new IS.Lattice(8, 'random', r); lat.recount(0.3); lat.sweep(2.2, 0.3, r, 50); const E = lat.E, M = lat.M; lat.recount(0.3); check('ising: running energy and magnetisation stay equal to a recount', Math.abs(lat.E - E) < 1e-9 && lat.M === M); }
  { const r = IS.rng(9), lat = new IS.Lattice(32, 'up', r); lat.sweep(1.5, 0, r, 300); const s = IS.measure(lat, 1.5, 0, 1000, r); check('ising: 32x32 at T 1.5 near Onsager magnetisation', Math.abs(s.m - 0.9865) < 0.005); }
  { const r = IS.rng(9), lat = new IS.Lattice(32, 'up', r); lat.sweep(4, 0, r, 300); const s = IS.measure(lat, 4, 0, 1000, r); check('ising: 32x32 at T 4 is disordered', s.m < 0.1); }
};
