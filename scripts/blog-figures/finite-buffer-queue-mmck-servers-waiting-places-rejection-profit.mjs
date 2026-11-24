// Figures for src/blog/discoveries/finite-buffer-queue-mmck-servers-waiting-places-rejection-profit.md, made with the
// maths of the Queueing calculator (src/lib/sci/queue.ts: solveQueue with kind 'mmck', the M/M/c/K queue).
// Run: node scripts/blog-figures/finite-buffer-queue-mmck-servers-waiting-places-rejection-profit.mjs
import fs from 'node:fs';
import { solveQueue } from '../../src/lib/sci/queue.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/finite-buffer-queue-mmck-servers-waiting-places-rejection-profit.md', import.meta.url);

// Inputs from the paper: Raicu, Costescu and Popa (2025), AppliedMath 5(1): 17, doi:10.3390/appliedmath5010017 (CC BY).
// Fuel station: 320 vehicles a day arrive, one pump serves 160 a day, 6 waiting places, a pump costs 600 money units
// a day, each fuelled vehicle earns v = 10, 20 or 30. Discussion: one server, 2 or 5 waiting places, load 0.5 or 0.9.
const LAM = 320, MU = 160, M = 6, COST = 600;
const st = (n, m = M) => solveQueue({ kind: 'mmck', lambda: LAM, mu: MU, c: n, K: n + m });
const profit = (n, v) => v * st(n).lambdaEff - COST * n;
const NS = [1, 2, 3, 4, 5];
const table = NS.map((n) => { const r = st(n); return { n, lost: +(r.pBlock * 100).toFixed(2), served: +r.lambdaEff.toFixed(1), util: +(r.rho * 100).toFixed(1), Lq: +r.Lq.toFixed(2), WqMin: +(r.Wq * 1440).toFixed(1), WMin: +(r.W * 1440).toFixed(1), pWait: +(r.pWait * 100).toFixed(1), p10: Math.round(profit(n, 10)), p20: Math.round(profit(n, 20)), p30: Math.round(profit(n, 30)) }; });
const best = (v) => NS.reduce((b, n) => (profit(n, v) > profit(b, v) ? n : b), 1);
// Profit per vehicle at which adding a pump just pays: 600 / extra vehicles served.
const breakEven = [1, 2, 3].map((n) => +(COST / (st(n + 1).lambdaEff - st(n).lambdaEff)).toFixed(2));

// Discussion example: one server, waiting places m, load rho (rates per unit time, mu = 1).
const one = (rho, m) => solveQueue({ kind: 'mmck', lambda: rho, mu: 1, c: 1, K: 1 + m });
const disc = [[0.5, 2], [0.9, 2], [0.9, 5], [0.9, 6]].map(([rho, m]) => { const r = one(rho, m); return { rho, m, lost: +(r.pBlock * 100).toFixed(2), rhoE: +(rho * (1 - r.pBlock)).toFixed(3), WqOverS: +r.Wq.toFixed(2) }; });
const smallestM = (rho, target) => { for (let m = 0; m < 200; m++) if (one(rho, m).pBlock <= target) return m; };

const VS = Array.from({ length: 31 }, (_, i) => 5 + i * 0.5);
const fig1 = chart({
  title: 'Fuel station: daily profit against pumps', xLabel: 'Profit per vehicle v (money units)', yLabel: 'Profit per day (money units)',
  series: [1, 2, 3, 4].map((n) => ({ name: `${n} pump${n > 1 ? 's' : ''}`, kind: 'line', x: VS, y: VS.map((v) => Math.round(profit(n, v))), dash: n === 4 ? '5 4' : undefined })),
  xDomain: [5, 20], vlines: [{ x: breakEven[1], text: `${breakEven[1].toFixed(1)}: 3 pumps start to pay`, left: true }],
  desc: `Daily profit for 1 to 4 pumps with 6 waiting places, 320 arrivals and 160 services per pump per day. Two pumps are best from v = ${breakEven[0].toFixed(1)} to ${breakEven[1].toFixed(1)}, three above that.`, height: 280,
});
const RH = Array.from({ length: 61 }, (_, i) => +(0.1 + i * 0.015).toFixed(3));
const fig2 = chart({
  title: 'One server: share turned away against load', xLabel: 'Load ρ = λ/μ', yLabel: 'Turned away (%)',
  series: [2, 5].map((m) => ({ name: `${m} waiting places`, kind: 'line', x: RH, y: RH.map((rho) => +(one(rho, m).pBlock * 100).toFixed(2)) })),
  xDomain: [0.1, 1], yDomain: [0, 30], hlines: [{ y: 10, text: '10 % target' }], vlines: [{ x: 0.5, text: '' }, { x: 0.9, text: '' }],
  desc: `Share of arrivals turned away by one server with 2 or 5 waiting places. At load 0.5 two places lose ${disc[0].lost} %; at load 0.9 they lose ${disc[1].lost} %, and five places bring it back to ${disc[2].lost} %.`, height: 260,
});

console.log(JSON.stringify({ table, best: { 10: best(10), 20: best(20), 30: best(30) }, breakEven, disc, mAt05: smallestM(0.5, 0.1), mAt09: smallestM(0.9, 0.1), serviceMin: 1440 / MU }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'profit', figure(fig1, 'Figure 1. Daily profit of the fuel station against the profit per vehicle, for 1 to 4 pumps with 6 waiting places, worked out with the Queueing calculator\'s M/M/c/K maths from the paper\'s rates and pump cost. Recomputed, not the paper\'s own figure.'));
  md = inject(md, 'loss', figure(fig2, 'Figure 2. One server with 2 or 5 waiting places: the share of arrivals turned away as the load rises. The dashed lines mark the paper\'s loads of 0.5 and 0.9.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
