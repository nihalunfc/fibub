// #924 wave packet: transfer-matrix transmission against the closed-form barrier formula and an independent
// SciPy solve_ivp integration; the split-step simulation against the packet-averaged transmission and a NumPy
// split-step written for the tests.
import * as P from '../../src/lib/sci/phpacket.ts';

export default async (check) => {
  const c = 0.5, near = (a, b, t) => Math.abs(a - b) <= t;
  check('packet: transfer matrix equals the rectangular-barrier formula (below, at and above V0)', [0.3, 1, 1.25, 2, 5].every((E) => near(P.transmission(E, [{ x0: -0.75, x1: 0.75, V: 1.25 }], c), P.rectT(E, 1.25, 1.5, c), 1e-9)));
  check('packet: rectangular T(1) = 0.2837503', near(P.rectT(1, 1.25, 1.5, c), 0.28375026623564, 1e-12));
  check('packet: double barrier T(E) matches SciPy solve_ivp', [[0.5, 0.0020174147657741], [1, 0.0016634444035459], [1.5, 0.0043462695758183], [2, 0.0674267030222918]].every(([E, t]) => near(P.transmission(E, [{ x0: -2, x1: -1, V: 3 }, { x0: 1, x1: 2, V: 3 }], c), t, 1e-9)));
  check('packet: Gaussian barrier by thin steps matches SciPy solve_ivp (0.2365217)', near(P.transmission(1, P.staircase((x) => 1.25 * Math.exp(-x * x / 2), -5, 5, 2000), c), 0.23652167201, 2e-6));
  check('packet: step T = 4k₁k₂/(k₁+k₂)²', near(P.transmission(2, [{ x0: 0, x1: Infinity, V: 1 }], c), (4 * Math.SQRT2) / (Math.SQRT2 + 1) ** 2, 1e-12) && P.transmission(0.5, [{ x0: 0, x1: Infinity, V: 1 }], c) === 0);
  const b = P.barrierV({ id: 'rect', V0: 1.25, a: 1.5, d: 0 });
  const pt = P.packetT(b.segs, c, 1.5, 4);
  check('packet: packet-averaged T = 0.356046 (SciPy quad)', near(pt, 0.35604598437, 2e-6));
  const r = P.simulate({ x0: -100, x1: 100, N: 2048, c, hbar: 1, V: b.V, xc: -20, sigma: 4, k0: 1.5, tEnd: 55, dt: 0.02, frames: 10, split: 0 });
  check('packet: split-step T matches the NumPy split-step (0.356133)', near(r.T, 0.35613276282, 2e-6));
  check('packet: split-step T within 0.001 of the packet-averaged transmission', near(r.T, pt, 1e-3));
  check('packet: probability is conserved (R + T = 1)', near(r.R + r.T, 1, 1e-9));
  check('packet: frames recorded', r.frames.length === 11 && r.frames[0].t === 0);
  { const bd = P.barrierV({ id: 'double', V0: 3, a: 1, d: 2 }); const s = P.simulate({ x0: -100, x1: 100, N: 2048, c, hbar: 1, V: bd.V, xc: -25, sigma: 6, k0: 2, tEnd: 80, dt: 0.01, frames: 4, split: 0 });
    check(`packet: double barrier simulation agrees with its packet average (${s.T.toFixed(4)} vs ${P.packetT(bd.segs, c, 2, 6).toFixed(4)})`, near(s.T, P.packetT(bd.segs, c, 2, 6), 2e-3) && near(s.R + s.T, 1, 1e-9)); }
  { const bs = P.barrierV({ id: 'step', V0: 1, a: 0, d: 0 }); const s = P.simulate({ x0: -100, x1: 100, N: 2048, c, hbar: 1, V: bs.V, xc: -25, sigma: 6, k0: 2, tEnd: 45, dt: 0.01, frames: 4, split: 0 });
    check(`packet: step simulation agrees with its packet average (${s.T.toFixed(4)})`, near(s.T, P.packetT(bs.segs, c, 2, 6), 2e-3)); }
};
