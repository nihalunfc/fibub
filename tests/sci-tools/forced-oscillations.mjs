// #1353 forced-oscillations: checked against Python (closed-form response, and a separate RK4 run to steady state:
// m 1 kg, k 40 N/m, b 0.5 kg/s, F₀ 1 N at 0.8 ω₀ gave 6.8397 cm).
import { oscParams, drivenResponse, resonanceW, drivenStep } from '../../src/lib/sci/n2-osc.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const p = oscParams(1, 40, 0.5);
  check('forced: ω₀ = 6.32456 rad/s, ζ = 0.039528, Q = 12.649', near(p.w0, 6.324555320336759) && near(p.zeta, 0.03952847075210474) && near(p.Q, 12.649110640673516));
  check('forced: τ = 2m/b = 4 s, ω′ = 6.31961 rad/s', near(p.tau, 4) && near(p.wd, 6.319612329882269));
  check('forced: resonance at 6.31467 rad/s', near(resonanceW(1, 40, 0.5), 6.314665470157545));
  check('forced: no peak when ζ ≥ 1/√2', resonanceW(1, 10, 5) === 0);
  const r1 = drivenResponse(1, 40, 0.5, 1, p.w0);
  check('forced: at ω₀ A = F₀/(bω₀) = 31.623 cm, lag 90°', near(r1.A * 100, 31.622776601683793) && near((r1.phase * 180) / Math.PI, 90));
  check('forced: at 0.5 ω₀ A = 3.3287 cm, lag 3.02°; at 2 ω₀ 0.83218 cm, lag 176.98°', near(drivenResponse(1, 40, 0.5, 1, 0.5 * p.w0).A * 100, 3.328713326493031) && near(drivenResponse(1, 40, 0.5, 1, 2 * p.w0).A * 100, 0.8321783316232576) && near((drivenResponse(1, 40, 0.5, 1, 2 * p.w0).phase * 180) / Math.PI, 176.983038690184));
  // Our RK4 step reaches the closed-form steady amplitude.
  { const w = 0.8 * p.w0; let x = 0, v = 0, t = 0, mx = 0; const dt = 1e-3;
    while (t < 60) { const o = drivenStep(x, v, t, dt, 1, 40, 0.5, 1, w); x = o.x; v = o.v; t += dt; if (t > 50) mx = Math.max(mx, Math.abs(x)); }
    check('forced: RK4 steady amplitude at 0.8 ω₀ = 6.8397 cm (Python RK4 6.83971)', Math.abs(mx / drivenResponse(1, 40, 0.5, 1, w).A - 1) < 1e-4); }
  // Free decay halves in 2m ln2 / b
  { let x = 0.1, v = 0, t = 0; const dt = 1e-4, peaks = []; let pv = 0;
    while (t < 12) { const o = drivenStep(x, v, t, dt, 1, 40, 0.5, 0, 0); if (pv > 0 && o.v <= 0) peaks.push([t, o.x]); pv = o.v; x = o.x; v = o.v; t += dt; }
    const [t1, a1] = peaks[0], [t2, a2] = peaks[peaks.length - 1];
    check('forced: free swings decay as e^(−bt/2m)', Math.abs(Math.log(a1 / a2) / (t2 - t1) - 0.25) < 1e-3); }
};
