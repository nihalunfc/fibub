// #915 2D electrostatics solver: SOR solution checked against a direct sparse solve of the same grid
// (SciPy spsolve), the charge against the same discrete Gauss sum, and the coax capacitance against 2πε0/ln(b/a).
import * as P from '../../src/lib/sci/ph-laplace.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
  const coax = [{ kind: 'circle', x: 0, y: 0, r: 0.01, v: 100 }, { kind: 'ring', x: 0, y: 0, r: 0.04, v: 0 }];
  const g = P.rasterize(coax, 101, 0.1), s = P.solve(g, 'ground', 1e-12);
  check(`laplace: SOR converges (${s.iters} sweeps)`, s.iters < 5000 && s.change < 1e-9);
  check('laplace: coax potential matches SciPy spsolve on the same grid', Math.abs(s.V[70 * 101 + 50] - 48.611838604762745) < 1e-6);
  const q = P.charges(s.V, g, 'ground');
  check('laplace: coax capacitance per metre matches the SciPy discrete Gauss sum', rel(q.byVolt.get(100) / 100, 3.9573084708453585e-11, 1e-6));
  check('laplace: coax capacitance within 3 % of 2πε0/ln(b/a) on a 101 grid', rel(q.byVolt.get(100) / 100, (2 * Math.PI * 8.8541878188e-12) / Math.log(4), 0.03));
  check('laplace: charges add up to zero inside a grounded box', Math.abs([...q.byVolt.values()].reduce((a, b) => a + b, 0) + q.box) < 1e-6 * q.byVolt.get(100));
  check('laplace: energy agrees with the charge, W = ½ C V²', rel(P.energy(s.V, g), 0.5 * q.byVolt.get(100) * 100, 0.01));
  { const g2 = P.rasterize(coax, 201, 0.1), s2 = P.solve(g2, 'ground', 1e-11), c2 = P.charges(s2.V, g2, 'ground').byVolt.get(100) / 100, exact = (2 * Math.PI * 8.8541878188e-12) / Math.log(4);
    check('laplace: a finer grid gets closer to the exact coax value', Math.abs(c2 - exact) < Math.abs(q.byVolt.get(100) / 100 - exact)); }
  // Open boundary, two wires at ±50 V.
  const tw = [{ kind: 'circle', x: -0.02, y: 0, r: 0.005, v: 50 }, { kind: 'circle', x: 0.02, y: 0, r: 0.005, v: -50 }];
  const gt = P.rasterize(tw, 101, 0.1), st = P.solve(gt, 'open', 1e-12);
  check('laplace: open-boundary twin wires match SciPy spsolve', Math.abs(st.V[50 * 101 + 60] + 27.25576786088124) < 1e-5 && Math.abs(st.V[80 * 101 + 50]) < 1e-5);
  check('laplace: open-boundary charge matches SciPy and is balanced', rel(P.charges(st.V, gt, 'open').byVolt.get(50), 1.178273511214248e-09, 1e-5) && rel(-P.charges(st.V, gt, 'open').byVolt.get(-50), 1.178273511214248e-09, 1e-5));
  // Parallel plates far from the edges: uniform field V/d between them.
  { const pl = [{ kind: 'line', x1: -0.04, y1: 0.005, x2: 0.04, y2: 0.005, v: 50 }, { kind: 'line', x1: -0.04, y1: -0.005, x2: 0.04, y2: -0.005, v: -50 }];
    const gp = P.rasterize(pl, 201, 0.1), sp = P.solve(gp, 'ground', 1e-11), p = P.probe(sp.V, gp, 0, 0);
    check(`laplace: field between wide plates is V/d (${p.ey.toFixed(0)} V/m)`, Math.abs(p.v) < 1e-6 && rel(-p.ey, 100 / 0.01, 0.12)); }
  // Symmetry and probe interpolation.
  check('laplace: probe at a node returns the node value', Math.abs(P.probe(s.V, g, 0, 0.02).v - s.V[70 * 101 + 50]) < 1e-9);
  check('laplace: coax field points outward from the + conductor', P.probe(s.V, g, 0.025, 0).ex > 0 && Math.abs(P.probe(s.V, g, 0.025, 0).ey) < 1e-6 * P.probe(s.V, g, 0.025, 0).ex);
  check('laplace: shapes close on the grid', (() => { const gg = P.rasterize([{ kind: 'ring', x: 0, y: 0, r: 0.033, v: 1 }], 61, 0.1); let leak = false; const n = 61;
    // flood fill from the centre must not reach the edge
    const seen = new Uint8Array(n * n), st2 = [30 * n + 30]; while (st2.length) { const k = st2.pop(); if (seen[k] || gg.fixed[k]) continue; seen[k] = 1; const i = k % n, j = (k / n) | 0; if (i === 0 || j === 0 || i === n - 1 || j === n - 1) { leak = true; break; } st2.push(k + 1, k - 1, k + n, k - n); } return !leak; })());
};
