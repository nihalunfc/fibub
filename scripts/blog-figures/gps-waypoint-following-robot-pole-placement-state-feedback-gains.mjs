// Figures for src/blog/discoveries/gps-waypoint-following-robot-pole-placement-state-feedback-gains.md, made with the maths of the
// Pole placement tool (src/lib/sci/eng-statespace.ts: acker, eig, ctrb, rank, dcGain, step, stepInfo).
// Run: node scripts/blog-figures/gps-waypoint-following-robot-pole-placement-state-feedback-gains.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as S from '../../src/lib/sci/eng-statespace.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gps-waypoint-following-robot-pole-placement-state-feedback-gains.md', import.meta.url);

// Inputs from the paper: Yoo and Chung (2026), Sensors 26(1): 255, doi:10.3390/s26010255 (CC BY).
// A = [-0.0010 0; 1 0], B = [1; 0], placed poles -0.7505 ± 0.9679j, gain K = [1.5 1.5]; 100 Hz control, 0.2 m/s, 6 m waypoint spacing.
// C = [0 1] (the second state as the output) is OUR assumption: the paper does not print C.
const A = [[-0.001, 0], [1, 0]], B = [[1], [0]], C = [[0, 1]], D = [[0]];
const POLES = '-0.7505+0.9679j, -0.7505-0.9679j';
const open = S.eig(A), rc = S.rank(S.ctrb(A, B));
const Kt = S.acker(A, B, S.parsePoles(POLES));                 // what the tool gives for the paper's poles
const Kp = [[1.5, 1.5]];                                         // the paper's gain
const close = (K) => S.add(A, S.mul(B, K), -1);
const eP = S.eig(close(Kp)), eT = S.eig(close(Kt));
const cp = S.charPoly(close(Kp));
const wn = Math.sqrt(cp[2]), zeta = cp[1] / (2 * wn);
const run = (K, tEnd = 11) => { const Acl = close(K), N = 1 / S.dcGain(Acl, B, C, D)[0][0], st = S.step(Acl, S.scale(B, N), C, D, tEnd, 400); return { N, st, info: S.stepInfo(st.t, st.y.map((r) => r[0]), 1) }; };
const rp = run(Kp), rt = run(Kt);
const theoryOS = 100 * Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta));
// The same gain on both states, k from 0.1 to 4: where the closed-loop poles go.
const ks = Array.from({ length: 40 }, (_, i) => +(0.1 + i * 0.1).toFixed(1));
const locus = ks.map((k) => ({ k, e: S.eig(close([[k, k]])) }));
const at = (k) => { const r = run([[k, k]], 30); return { k, os: +r.info.overshoot.toFixed(1), ts: +r.info.settling.toFixed(2), rise: +r.info.rise.toFixed(2) }; };
const fam = [0.5, 1, 1.5, 2, 3].map(at);
const out = {
  open: open.map((z) => [+z.re.toFixed(4), +z.im.toFixed(4)]), rc,
  Ktool: Kt[0].map((v) => +v.toFixed(5)),
  polesFromPaperK: eP.map((z) => [+z.re.toFixed(5), +z.im.toFixed(5)]),
  charPoly: cp.map((v) => +v.toFixed(4)), wn: +wn.toFixed(4), zeta: +zeta.toFixed(4), theoryOS: +theoryOS.toFixed(2),
  paperK: { N: +rp.N.toFixed(4), rise: +rp.info.rise.toFixed(3), os: +rp.info.overshoot.toFixed(3), ts: +rp.info.settling.toFixed(3), peak: +rp.info.peak.toFixed(4) },
  toolK: { N: +rt.N.toFixed(5), rise: +rt.info.rise.toFixed(3), os: +rt.info.overshoot.toFixed(3), ts: +rt.info.settling.toFixed(3) },
  settleDistance_m: +(0.2 * rp.info.settling).toFixed(2), legTime_s: 6 / 0.2,
  fam, sampleRatio: +((2 * Math.PI * 100) / Math.hypot(-0.7505, 0.9679)).toFixed(0),
  realAxisK: locus.filter((r) => Math.abs(r.e[0].im) < 1e-9).map((r) => r.k),
};
const K6 = S.acker(A, B, S.parsePoles('-1.5±0.9679j')), r6 = run(K6, Math.round(8 / 1.5));
out.step6 = { K: K6[0].map((v) => +v.toPrecision(5)), os: +r6.info.overshoot.toFixed(3), ts: +r6.info.settling.toFixed(3) };
console.log(JSON.stringify(out));

const fig1 = chart({
  title: 'Step response of the heading loop', xLabel: 'Time (s)', yLabel: 'Output (share of the step)',
  series: [
    { name: 'K = [1.5, 1.5] (paper)', kind: 'line', x: rp.st.t.filter((_, i) => i % 2 === 0).map((t) => +t.toFixed(3)), y: rp.st.y.filter((_, i) => i % 2 === 0).map((r) => +r[0].toFixed(4)) },
    ...[0.5, 3].map((k) => { const r = run([[k, k]], 11); return { name: `K = [${k}, ${k}]`, kind: 'line', dash: k < 1 ? '6 4' : '2 3', x: r.st.t.filter((_, i) => i % 2 === 0).map((t) => +t.toFixed(3)), y: r.st.y.filter((_, i) => i % 2 === 0).map((r) => +r[0].toFixed(4)) }; }),
  ],
  xDomain: [0, 11], yDomain: [0, 1.2], hlines: [{ y: 1, text: '' }],
  desc: `Closed-loop step responses. With the paper's gain the output overshoots by ${out.paperK.os.toFixed(1)} % and settles within 2 % after ${out.paperK.ts.toFixed(1)} s.`, height: 270,
});
const fig2 = chart({
  title: 'Where the poles go as the gain k changes', xLabel: 'Real part (1/s)', yLabel: 'Imaginary part (rad/s)',
  series: [
    { name: 'K = [k, k], k = 0.1 to 4', kind: 'dots', x: locus.flatMap((r) => r.e.map((z) => +z.re.toFixed(4))), y: locus.flatMap((r) => r.e.map((z) => +z.im.toFixed(4))), size: 2.4 },
    { name: 'paper: k = 1.5', kind: 'dots', x: eP.map((z) => +z.re.toFixed(4)), y: eP.map((z) => +z.im.toFixed(4)), size: 5 },
  ],
  xDomain: [-4, 0.2], yDomain: [-2, 2], hlines: [{ y: 0, text: '' }],
  desc: `Closed-loop poles of the model for equal gains k on both states. The paper's k = 1.5 puts them at ${out.polesFromPaperK[0][0]} ± ${Math.abs(out.polesFromPaperK[0][1])}j.`, height: 270,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'step', figure(fig1, 'Figure 1. Step responses of the paper\'s model with the paper\'s gain K = [1.5, 1.5] and with a lower and a higher equal gain, worked out with the Pole placement tool\'s maths (reference scaled so the output settles at 1; the output state is our assumption).'));
  md = inject(md, 'locus', figure(fig2, 'Figure 2. Closed-loop poles of the same model as the equal gain k on both states rises from 0.1 to 4. As k rises the complex pair moves left and becomes better damped, until the poles meet on the real axis near k = 4. The large dots are the paper\'s gain.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
