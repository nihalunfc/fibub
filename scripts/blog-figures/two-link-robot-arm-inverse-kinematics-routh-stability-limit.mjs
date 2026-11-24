// Figures for src/blog/discoveries/two-link-robot-arm-inverse-kinematics-routh-stability-limit.md, made with the maths of the
// Inverse kinematics tool (src/lib/sci/ik.ts: ik2, fk, reach2) and the PID tuning simulator (src/lib/sci/ctl-pid.ts:
// ultimate, closedLoopPoles, simulate, stepInfo, margins).
// Run: node scripts/blog-figures/two-link-robot-arm-inverse-kinematics-routh-stability-limit.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { ik2, fk, reach2 } from '../../src/lib/sci/ik.ts';
import { ultimate, closedLoopPoles, simulate, stepInfo, margins } from '../../src/lib/sci/ctl-pid.ts';
import { sig } from '../../src/lib/sci/num.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/two-link-robot-arm-inverse-kinematics-routh-stability-limit.md', import.meta.url);

// Inputs from the paper: Kirkopoulos, Gkanatsios and Fragulis (2026), Eng. Proc. 143: 59, doi:10.3390/engproc2026143059 (CC BY).
// L1 = 2 m, L2 = 1 m; worked example θ1 = 45°, θ2 = 30° -> px = 1.67, py = 2.38; r = 2.9; cos θ2 = 0.8633.
// Joint model Gp(s) = 0.4 / (0.035 s³ + 0.34 s² + 0.84 s); specs Ts <= 5 s, overshoot < 25 %, zero steady-state error.
const L1 = 2, L2 = 1, D = 180 / Math.PI, R = Math.PI / 180;
const tipExact = fk([L1, L2], [45 * R, 30 * R]).pts[2];
const solsR = ik2(L1, L2, 1.67, 2.38), solsE = ik2(L1, L2, tipExact[0], tipExact[1]);
const c2 = (1.67 ** 2 + 2.38 ** 2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
const plant = { tf: { num: [0.4], den: [0.035, 0.34, 0.84, 0] }, delay: 0 };
const ult = ultimate(plant);
const P = (kp) => ({ kp, ki: 0, kd: 0, tf: 0 });
// As the tool does: automatic run length 8 / slowest pole (2 figures), 2000 steps.
const resp = (kp) => {
  const cl = closedLoopPoles(plant, P(kp)); if (!cl.stable) return { kp, stable: false };
  const slow = Math.min(...cl.poles.map((p) => -p.re).filter((x) => x > 0)), tEnd = +sig(8 / slow, 2);
  const s = simulate(plant, P(kp), tEnd, { steps: 2000 }), i = stepInfo(s.t, s.y, 1);
  return { kp, stable: true, tEnd, s, rise: i.rise, settle: i.settle, os: i.overshoot, poles: cl.poles };
};
// The band of P gains that meets the paper's specs (2 % settling within 5 s and overshoot below 25 %).
const meets = (kp) => { const r = resp(kp); return r.stable && r.settle <= 5 && r.os < 25; };
const scan = []; for (let k = 0.05; k <= 20.4; k += 0.01) scan.push(+k.toFixed(2));
const ok = scan.filter(meets);
const m1 = margins(plant.tf, 0), m3 = (() => { const t = { num: [0.4 * 3], den: plant.tf.den }; return margins(t, 0); })();
const out = {
  tipExact: tipExact.map((v) => +v.toFixed(4)), r: +Math.hypot(1.67, 2.38).toFixed(4), reach: reach2(L1, L2), c2: +c2.toFixed(4),
  rounded: solsR.map((s) => ({ elbow: s.elbow, q: s.q.map((v) => +(v * D).toFixed(3)), c1: +Math.cos(s.q[0]).toFixed(4), s1: +Math.sin(s.q[0]).toFixed(4) })),
  exact: solsE.map((s) => ({ elbow: s.elbow, q: s.q.map((v) => +(v * D).toFixed(3)) })),
  ult: { ku: +ult.ku.toFixed(4), wu: +ult.wu.toFixed(4), pu: +ult.pu.toFixed(4) },
  routh: +(0.2856 / 0.014).toFixed(3),
  band: [ok[0], ok[ok.length - 1], ok.length === Math.round((ok[ok.length - 1] - ok[0]) / 0.01) + 1],
  table: [1, 1.5, 3, 5, 8, 15].map((k) => { const r = resp(k); return { kp: k, tEnd: r.tEnd, rise: +r.rise.toFixed(3), settle: +r.settle.toFixed(3), os: +r.os.toFixed(2) }; }),
  gm1: { gm: +m1.gm.toFixed(3), db: +m1.gmDb.toFixed(2), wpc: +m1.wpc.toFixed(3), pm: +m1.pm.toFixed(2) },
  gm3: { gm: +m3.gm.toFixed(3), db: +m3.gmDb.toFixed(2), pm: +m3.pm.toFixed(2), wgc: +m3.wgc.toFixed(3) },
};
console.log(JSON.stringify(out));

// Figure 1: the arm in both poses that reach the paper's point, with the workspace edges.
const circ = (rad, a0, a1) => { const n = 60, xs = [], ys = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; xs.push(+(rad * Math.cos(a)).toFixed(3)); ys.push(+(rad * Math.sin(a)).toFixed(3)); } return { x: xs, y: ys }; };
const arm = (s) => { const p = fk([L1, L2], s.q).pts; return { x: p.map((v) => +v[0].toFixed(3)), y: p.map((v) => +v[1].toFixed(3)) }; };
const down = solsR.find((s) => s.elbow === 'down'), up = solsR.find((s) => s.elbow === 'up');
const o3 = circ(3, -0.2, Math.PI * 0.75), o1 = circ(1, -0.2, Math.PI * 0.75);
const fig1 = chart({
  title: 'Two ways to reach (1.67, 2.38) with L1 = 2, L2 = 1', xLabel: 'x (m)', yLabel: 'y (m)',
  series: [
    { name: `paper: θ1 ${(down.q[0] * D).toFixed(1)}°, θ2 ${(down.q[1] * D).toFixed(1)}°`, kind: 'line', ...arm(down) },
    { name: `other: θ1 ${(up.q[0] * D).toFixed(1)}°, θ2 ${(up.q[1] * D).toFixed(1)}°`, kind: 'line', dash: '6 4', ...arm(up) },
    { name: '', noLegend: true, kind: 'line', colour: 'var(--muted)', dash: '2 3', ...o3 },
    { name: '', noLegend: true, kind: 'line', colour: 'var(--muted)', dash: '2 3', ...o1 },
    { name: '', noLegend: true, kind: 'dots', colour: 'var(--ink)', x: [1.67], y: [2.38], size: 4 },
  ],
  xDomain: [-1.6, 3.4], yDomain: [-0.3, 3.2], height: 420,
  desc: `The two-link arm with link lengths 2 m and 1 m in the two poses that put its tip on the paper's point. The dotted arcs are the edges of the workspace at 1 m and 3 m from the base.`,
});
// Figure 2: closed-loop step responses for a few proportional gains.
const fig2 = chart({
  title: 'One joint under proportional control', xLabel: 'Time (s)', yLabel: 'Joint angle (share of the step)',
  series: [1.5, 3, 5, 15].map((k, i) => { const r = resp(k), s = simulate(plant, P(k), 8, { steps: 2000 }); return { name: `Kp = ${k}`, kind: 'line', dash: ['', '', '5 4', '2 3'][i] || undefined, x: s.t.filter((_, j) => j % 16 === 0).map((t) => +t.toFixed(3)), y: s.y.filter((_, j) => j % 16 === 0).map((v) => +v.toFixed(4)) }; }),
  xDomain: [0, 8], yDomain: [0, 1.8], hlines: [{ y: 1.25, text: '25 % overshoot' }, { y: 1, text: '' }], vlines: [{ x: 5, text: 'Ts = 5 s' }],
  desc: `Step responses of the paper's joint model with proportional gains 1.5, 3, 5 and 15. Gains from ${out.band[0]} to ${out.band[1]} meet both the 5 s settling and the 25 % overshoot targets; the loop goes unstable at ${out.ult.ku.toFixed(1)}.`, height: 280,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'arm', figure(fig1, 'Figure 1. The paper\'s arm (link lengths 2 m and 1 m) in the two poses the Inverse kinematics tool finds for the point (1.67, 2.38): the paper\'s solution (solid) and the mirror-image elbow (dashed). Dotted arcs: the workspace runs from 1 m to 3 m from the base.'));
  md = inject(md, 'step', figure(fig2, 'Figure 2. Step responses of the paper\'s joint model, 0.4 / (0.035 s³ + 0.34 s² + 0.84 s), under proportional control, worked out with the PID tuning simulator\'s maths. The dashed horizontal line is the paper\'s 25 % overshoot limit, the vertical one its 5 s settling limit.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
