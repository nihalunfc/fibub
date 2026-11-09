// #647 heat exchanger sizing: every effectiveness relation against SciPy numerical integration of the stream
// energy balances (solve_bvp for counterflow and the 1-2 shell-and-tube with three streams, solve_ivp for parallel
// and the mixed crossflow cases, and a 400 × 400 cell grid with Richardson extrapolation for crossflow with both
// fluids unmixed); F against the 1-2 shell ODE result (F = (Q/UA)/LMTD).
import * as H from '../../src/lib/sci/eng-hx.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ref = {
    '2,0.5': { counter: 0.7746003264394209, parallel: 0.633475287754667, shell: 0.6930921317145609, 'cross-unmixed': 0.7324108240640954, 'cross-cmax-mixed': 0.7020127152802246, 'cross-cmin-mixed': 0.7175464361493851 },
    '1.5,1': { counter: 0.6, parallel: 0.4751064658159776, shell: 0.5263926297430781, 'cross-unmixed': 0.5601743791227104, 'cross-cmax-mixed': 0.5401568564126589, 'cross-cmin-mixed': 0.5401568564126222 },
    '3,0.25': { counter: 0.9188112743981868, parallel: 0.781185803315123, shell: 0.8407553304175074, 'cross-unmixed': 0.8884589662119531, 'cross-cmax-mixed': 0.8457803488294852, 'cross-cmin-mixed': 0.8788267317946471 },
  };
  for (const [key, r] of Object.entries(ref)) {
    const [n, c] = key.split(',').map(Number);
    for (const [cfg, v] of Object.entries(r)) check(`hx: ε ${cfg} NTU ${n} Cr ${c} vs SciPy integration`, near(H.effectiveness(cfg, n, c), v, cfg === 'cross-unmixed' ? 3e-6 : 1e-9));
  }
  check('hx: Cr = 0 (boiling or condensing) gives 1 − e^−NTU for every type', ['counter', 'parallel', 'shell', 'cross-unmixed'].every((k) => near(H.effectiveness(k, 2, 0), 1 - Math.exp(-2), 1e-12)));
  check('hx: crossflow approximation within 1 % of the exact series', Math.abs(H.crossApprox(2, 0.5) / H.effectiveness('cross-unmixed', 2, 0.5) - 1) < 0.01);
  check('hx: two shell passes beat one, below counterflow', H.effectiveness('shell', 3, 0.5, 2) > H.effectiveness('shell', 3, 0.5, 1) && H.effectiveness('shell', 3, 0.5, 2) < H.effectiveness('counter', 3, 0.5));
  check('hx: n shells at Cr = 1', near(H.effectiveness('shell', 2, 1, 2), (2 * H.effectiveness('shell', 1, 1)) / (1 + H.effectiveness('shell', 1, 1)), 1e-12));
  check('hx: F for 1-2 shell matches the ODE (0.7557244)', near(H.F12(0.3465460658572804, 2), 0.7557244403544086, 1e-10));
  { const F = H.F12(0.5, 1), n = H.ntuFor('shell', 0.5, 1); check('hx: F at R = 1 consistent with ε-NTU (UA from F·LMTD equals NTU)', near((0.5 / (F * H.lmtd(0.5, 0.5))), n, 1e-8)); }
  check('hx: F impossible duty gives NaN', Number.isNaN(H.F12(0.6, 2)));
  check('hx: LMTD and equal ends', near(H.lmtd(60, 20), 40 / Math.log(3), 1e-12) && H.lmtd(30, 30) === 30 && Number.isNaN(H.lmtd(-1, 5)));
  check('hx: NTU from ε inverts, NaN out of reach', near(H.ntuFor('counter', 0.9, 1), 9, 1e-9) && Number.isNaN(H.ntuFor('parallel', 0.7, 1)));
  const r = H.rate('counter', 4000, { Thi: 90, Tci: 20, Ch: 2000, Cc: 4000 });
  check('hx: rating energy balance', near(r.Q, 2000 * (90 - r.Tho), 1e-9) && near(r.Q, 4000 * (r.Tco - 20), 1e-9) && near(r.eps, H.effectiveness('counter', 2, 0.5), 1e-12));
};
