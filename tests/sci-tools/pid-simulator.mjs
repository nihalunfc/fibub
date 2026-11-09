// #636 PID tuning simulator. Checked against python-control 0.10.2: step_response of feedback(C·G) and of the
// controller output (largest difference 1e-13 without dead time), step_info (rise, settling, overshoot), margin
// (gain and phase margins) and poles, on 8 loops. Loops with dead time were checked against an independent numpy
// RK4 simulation with a 0.25-0.5 ms step (largest difference 4e-5) and against Padé approximations; the
// ultimate gain of 2e^(-s)/(5s+1) against scipy brentq, and the reaction curve against the analytic tangent.
import * as P from '../../src/lib/sci/ctl-pid.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const at = (sim, t) => { const i = sim.t.findIndex((x) => x >= t - 1e-12); if (Math.abs(sim.t[i] - t) < 1e-12) return sim.y[i]; const f = (t - sim.t[i - 1]) / (sim.t[i] - sim.t[i - 1]); return sim.y[i - 1] + f * (sim.y[i] - sim.y[i - 1]); };
  const fo = P.firstOrder(2, 5), so = P.secondOrder(1, 2, 0.3), third = { num: [1], den: [1, 3, 3, 1] };
  const c0 = { kp: 1.2, ki: 0.3, kd: 0.5, tf: 0.05 };
  // No dead time: exact discretisation against python-control step_response.
  { const s = P.simulate({ tf: fo, delay: 0 }, c0, 30, { steps: 3000 });
    check('pid: FOPDT loop without delay matches python-control', [[2, 0.62514037], [4, 0.85771539], [6, 0.96572399]].every(([t, y]) => near(at(s, t), y, 1e-7)));
    const i = P.stepInfo(s.t, s.y, P.dcGains(fo, c0).r);
    check('pid: step info matches python-control step_info (rise 4.5708, settle 11.7325, overshoot 2.0951 %)', near(i.rise, 4.5708, 5e-4) && near(i.settle, 11.7325, 5e-4) && near(i.overshoot, 2.0951, 1e-3));
    const m = P.margins(P.openLoopTf(fo, c0), 0); check('pid: margins (GM ∞, PM 94.477°)', m.gm === Infinity && near(m.pm, 94.47703, 1e-4)); }
  { const c = { kp: 2, ki: 1, kd: 0.2, tf: 0.02, dOnMeasurement: true }, s = P.simulate({ tf: so, delay: 0 }, c, 30, { steps: 3000 });
    check('pid: derivative on measurement, 2nd-order plant, matches python-control', [[2, 0.71111269], [4, 0.89964433], [6, 0.95819953]].every(([t, y]) => near(at(s, t), y, 1e-7)));
    const p = P.closedLoopPoles({ tf: so, delay: 0 }, c).poles; check('pid: closed-loop poles match python-control', near(p[0].re, -49.17034375, 1e-6) && near(p[3].re, -0.35025689, 1e-7) && near(Math.abs(p[1].im), 3.30269403, 1e-7)); }
  { const c = { kp: 0.4, ki: 0.3, kd: 0.1, tf: 0.1 }, tf = { num: [-1, 1], den: [1, 3, 2] }, s = P.simulate({ tf, delay: 0 }, c, 30, { steps: 3000 });
    check('pid: right-half-plane zero plant matches python-control', [[2, 0.15012155], [4, 0.40725881], [6, 0.58881681]].every(([t, y]) => near(at(s, t), y, 1e-7)));
    const m = P.margins(P.openLoopTf(tf, c), 0); check('pid: margins with a finite gain margin (GM 7.0451, PM 79.952°)', near(m.gm, 7.045101, 1e-5) && near(m.pm, 79.952386, 1e-4) && near(m.wpc, 3.04885, 1e-4)); }
  { const s = P.simulate({ tf: { num: [1, 2], den: [1, 1] }, delay: 0 }, { kp: 0.5, ki: 1, kd: 0, tf: 0 }, 10); check('pid: biproper plant (direct feedthrough): jumps to 1/3 at once, settles to 1', near(s.y[s.y.length - 1], 1, 1e-4) && near(s.y[0], 1 / 3, 1e-12)); }
  { const s = P.simulate({ tf: third, delay: 0 }, { kp: 3, ki: 0, kd: 0, tf: 0 }, 30); const d = P.dcGains(third, { kp: 3, ki: 0, kd: 0, tf: 0 });
    check('pid: P-only control leaves a steady-state error (final 0.75)', near(d.r, 0.75, 1e-12) && near(s.y[s.y.length - 1], 0.75, 1e-3)); }
  // Dead time: RK4 with interpolated delayed controller output, against an independent numpy simulation.
  { const s = P.simulate({ tf: fo, delay: 1 }, c0, 30); check('pid: FOPDT loop with 1 s dead time matches numpy', [[2, 0.656639], [4, 0.938524], [6, 1.034964]].every(([t, y]) => near(at(s, t), y, 1e-4))); }
  { const s = P.simulate({ tf: so, delay: 0.2 }, { kp: 1, ki: 0.8, kd: 0, tf: 0 }, 30); check('pid: nearly unstable delayed loop matches numpy', [[2, 0.867995], [4, 1.406734], [6, 1.370547]].every(([t, y]) => near(at(s, t), y, 1e-5)));
    const m = P.margins(P.openLoopTf(so, { kp: 1, ki: 0.8, kd: 0, tf: 0 }), 0.2); check('pid: margins with dead time (GM 1.03263, PM 1.3997°, from a python-control FRD)', near(m.gm, 1.03263, 1e-5) && near(m.pm, 1.39967, 1e-4)); }
  { const s = P.simulate({ tf: third, delay: 0.5 }, { kp: 1, ki: 0.4, kd: 0.6, tf: 0.06 }, 30); check('pid: third-order plant with dead time matches numpy', [[2, 0.367291], [4, 0.89822], [6, 1.011446]].every(([t, y]) => near(at(s, t), y, 1e-5))); }
  { const a = P.simulate({ tf: fo, delay: 1 }, c0, 30, { dist: 0.5, dAt: 15 }), b = P.simulate({ tf: fo, delay: 1 }, c0, 30);
    check('pid: load disturbance changes nothing before it arrives and is rejected by integral action', a.y.slice(0, 1000).every((v, i) => v === b.y[i]) && near(a.y[a.y.length - 1], 1, 2e-2) && Math.max(...a.y.slice(-1500)) > 1.05); }
  // Frequency response
  { const f = P.freqResp(fo, 1, [0.5]); const g = { re: 2, im: 0 }, den = Math.hypot(1, 2.5); check('pid: plant frequency response |G| and phase at 0.5 rad/s', near(f.mag[0], 2 / den, 1e-12) && near(f.phase[0], (-Math.atan(2.5) - 0.5) * 180 / Math.PI, 1e-9)); void g; }
  // Ziegler-Nichols
  { const u = P.ultimate({ tf: fo, delay: 1 }); check('pid: ultimate gain Ku 4.2512 and period Pu 3.7208 s (scipy brentq)', near(u.ku, 4.251212494, 1e-8) && near(u.pu, 3.720761363, 1e-8));
    const z = P.znUltimate(u.ku, u.pu)[2]; check('pid: Z-N ultimate PID: Kp 0.6 Ku, Ti Pu/2, Td Pu/8', near(z.kp, 0.6 * u.ku, 1e-12) && near(z.ki, z.kp / (u.pu / 2), 1e-12) && near(z.kd, z.kp * u.pu / 8, 1e-12)); }
  { const r = P.reactionCurve({ tf: fo, delay: 1 }); check('pid: reaction curve of a first-order plant recovers K 2, T 5, L 1', near(r.K, 2, 1e-12) && near(r.T, 5, 1e-9) && near(r.L, 1, 1e-9));
    const r3 = P.reactionCurve({ tf: third, delay: 0.5 }), sl = 2 * Math.exp(-2), y2 = 1 - Math.exp(-2) * 5;
    check('pid: reaction curve of 1/(s+1)³ with 0.5 s dead time matches the analytic tangent at t = 2', near(r3.T, 1 / sl, 1e-4) && near(r3.L, 0.5 + 2 - y2 / sl, 1e-4));
    const z = P.znReaction(2, 5, 1)[2]; check('pid: Z-N reaction-curve PID: Kp 1.2T/(KL) = 3, Ti 2L, Td 0.5L', near(z.kp, 3, 1e-12) && near(z.ki, 1.5, 1e-12) && near(z.kd, 1.5, 1e-12)); }
  { const t = P.pidTf({ kp: 1, ki: 2, kd: 3, tf: 0.1 }); check('pid: controller transfer function (3.1s² + 1.2s + 2)/(0.1s² + s)', t.num.map((x) => +x.toFixed(10)).join() === '3.1,1.2,2' && t.den.join() === '0.1,1,0'); }
  { const p = P.pade(1, 1); check('pid: first-order Padé (1 − s/2)/(1 + s/2)', p.num.join() === '-0.5,1' && p.den.join() === '0.5,1'); }
  { let threw = false; try { P.tfToSs({ num: [1, 0, 0], den: [1, 1] }); } catch { threw = true; } check('pid: improper plant is refused', threw); }
};
