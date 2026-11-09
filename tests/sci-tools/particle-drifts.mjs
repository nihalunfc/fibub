// #953 particle drifts: Boris pusher against guiding-centre theory and an independent SciPy DOP853 integration.
import { simulate, borisStep } from '../../src/lib/sci/phdrift.ts';
export default async (check) => {
  const e = 1.602176634e-19, mp = 1.67262192369e-27, base = { q: e, m: mp, B0: 1e-3, Wperp: 100, Wpar: 100, periods: 20, steps: 128 };
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  { const r = simulate({ ...base, scenario: 'exb', E: 0 }); const xs = r.pts.map((p) => p[0]);
    check('drifts: gyroradius m v/(qB) = 1.4450 m for a 100 eV proton in 1 mT', near(r.rL, 1.444970, 1e-5) && near(Math.max(...xs) - Math.min(...xs), 2 * r.rL, 2e-3));
    check('drifts: no field, no drift', Math.hypot(...r.measured) < 1e-6 * r.vperp);
    check('drifts: gyro-period 2πm/(qB) = 65.6 µs', near(r.Tc, 6.5594e-5, 1e-4)); }
  { const r = simulate({ ...base, scenario: 'exb', E: 100 }); check('drifts: E×B speed E/B = 1e5 m/s, along −y', near(r.measured[1], -1e5, 1e-6) && Math.abs(r.measured[0]) < 1); }
  { const a = simulate({ ...base, scenario: 'exb', E: 100, q: -e, m: 9.1093837015e-31, Wperp: 1, Wpar: 0 }); check('drifts: E×B is the same for an electron', near(a.measured[1], -1e5, 1e-5)); }
  for (const s of [1, -1]) { const r = simulate({ ...base, q: s * e, scenario: 'gradb', L: 20 });
    check(`drifts: grad-B, charge ${s}: SciPy 5003.26 m/s, theory 5000`, near(r.measured[1], s * 5003.26, 2e-4) && near(r.theory[1], s * 5000, 1e-9)); }
  { const r = simulate({ ...base, scenario: 'curv', R0: 20 }); check('drifts: toroidal field curvature + grad-B, theory 15000 m/s, SciPy 14919, Boris within 0.5 %', near(r.theory[1], 15000, 1e-9) && near(r.measured[1], 14919, 5e-3) && Math.abs(r.ke1 / r.ke0 - 1) < 1e-12); }
  { const r = simulate({ ...base, scenario: 'grav', g: 1e9 }); check('drifts: gravity drift m g/(qB) = 10439.68 m/s (SciPy constants)', near(r.measured[1], -10439.68, 1e-4) && near(r.theory[1], -10439.685, 1e-6)); }
  { // Boris rotation conserves speed exactly in a pure magnetic field.
    let x = [0, 0, 0], v = [3, 4, 0]; for (let i = 0; i < 1000; i++) ({ x, v } = borisStep(x, v, 1, 1, 0.3, () => ({ E: [0, 0, 0], B: [0, 0, 2] })));
    check('drifts: Boris keeps |v| exactly in a magnetic field', Math.abs(Math.hypot(...v) - 5) < 1e-12); }
};
