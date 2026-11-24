// Figures for src/blog/discoveries/asymmetric-matching-pennies-experiment-china-mixed-nash-equilibrium-own-payoff-effect.md,
// made with the maths of the Nash equilibrium solver (src/lib/sci/nash.ts: supportEnumeration, payoffs, bestResponses).
// Run: node scripts/blog-figures/asymmetric-matching-pennies-experiment-china-mixed-nash-equilibrium-own-payoff-effect.mjs
import fs from 'node:fs';
import { supportEnumeration, payoffs, bestResponses } from '../../src/lib/sci/nash.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/asymmetric-matching-pennies-experiment-china-mixed-nash-equilibrium-own-payoff-effect.md', import.meta.url);

// Leng, Lian, Lien and Zheng (2023), Behav. Sci. 13(9): 757 (CC BY), Appendix A payoffs in yuan. Rows T, B; columns L, R.
// Only the row player's payoff for (T, L) differs between the games: 3.20 (higher type) or 0.44 (lower type).
const game = (a) => ({ A: [[a, 0.4], [0.4, 0.8]], B: [[0.4, 0.8], [0.8, 0.4]] });
const G1 = game(3.2), G2 = game(0.44), G0 = game(0.8); // G0: the symmetric baseline with 0.80 (our addition)
const eq = (g) => supportEnumeration(g.A, g.B);
const e1 = eq(G1), e2 = eq(G2), e0 = eq(G0);
// Observed column play quoted in the text (approximate): higher type about 66 to 71 % R; lower type about 3 × 9 % R.
const rowGain = (g, yR) => { const y = [1 - yR, yR]; const t = payoffs(g.A, g.B, [1, 0], y).u, b = payoffs(g.A, g.B, [0, 1], y).u; return { t, b, d: t - b }; };
const checks = { g1: [0.66, 0.71].map((y) => ({ y, ...rowGain(G1, y) })), g2: [0.27].map((y) => ({ y, ...rowGain(G2, y) })) };
const br = (g, yR) => { const y = [1 - yR, yR]; const uT = payoffs(g.A, g.B, [1, 0], y).u, uB = payoffs(g.A, g.B, [0, 1], y).u; return uT > uB ? 'T' : 'B'; };

// Figure 1: the column player's equilibrium chance of R as the row player's (T, L) payoff a changes; the row player's own mix stays 50 %.
const AS = Array.from({ length: 121 }, (_, i) => 0.41 + i * 0.03);
const sweep = AS.map((a) => { const e = eq(game(a)).find((q) => !q.pure); return { a, yR: e.y[1], xT: e.x[0] }; });
const fig1 = chart({
  title: 'What equilibrium predicts as the row player\'s top payoff grows', xLabel: 'Row player\'s payoff for (T, L), yuan', yLabel: 'Probability',
  series: [
    { name: 'Column plays R', kind: 'line', x: sweep.map((s) => +s.a.toFixed(2)), y: sweep.map((s) => +s.yR.toFixed(4)) },
    { name: 'Row plays T', kind: 'line', x: sweep.map((s) => +s.a.toFixed(2)), y: sweep.map((s) => +s.xT.toFixed(4)), dash: '5 4' },
  ],
  xDomain: [0.4, 4], yDomain: [0, 1], vlines: [{ x: 0.44, text: 'lower 0.44' }, { x: 3.2, text: 'higher 3.20', left: true }],
  desc: `Mixed Nash equilibrium of the asymmetric matching pennies game as the row player's (T, L) payoff goes from 0.41 to 4 yuan. The row player's chance of T stays at 0.5; the column player's chance of R rises from ${sweep[0].yR.toFixed(2)} to ${sweep.at(-1).yR.toFixed(2)}.`, height: 270,
});
// Figure 2: the row player's expected payoff from T and from B against the column's chance of R, higher-type game.
const Y = Array.from({ length: 101 }, (_, i) => i / 100);
const fig2 = chart({
  title: 'Higher-type game: the row player\'s payoff from T and from B', xLabel: 'Column player\'s chance of R', yLabel: 'Row player\'s expected payoff (yuan)',
  series: [
    { name: 'Row plays T', kind: 'line', x: Y, y: Y.map((y) => +rowGain(G1, y).t.toFixed(4)) },
    { name: 'Row plays B', kind: 'line', x: Y, y: Y.map((y) => +rowGain(G1, y).b.toFixed(4)) },
  ],
  xDomain: [0, 1], yDomain: [0, 3.3], bands: [{ x0: 0.66, x1: 0.71, text: 'observed' }], vlines: [{ x: 0.875, text: 'Nash 0.875' }],
  desc: 'In the higher-type game, T pays the row player more than B whenever the column player plays R less than 87.5 % of the time. Column players chose R about 66 to 71 % of the time, so T was the better reply.', height: 270,
});

const r4 = (v) => +v.toFixed(4);
const show = (es) => es.map((q) => ({ x: q.x.map(r4), y: q.y.map(r4), u: r4(q.u), v: r4(q.v), pure: q.pure }));
console.log(JSON.stringify({ g1: show(e1), g2: show(e2), g0: show(e0), checks: { g1: checks.g1.map((c) => ({ y: c.y, t: r4(c.t), b: r4(c.b), d: r4(c.d), br: br(G1, c.y) })), g2: checks.g2.map((c) => ({ y: c.y, t: r4(c.t), b: r4(c.b), d: r4(c.d), br: br(G2, c.y) })) }, brs1: bestResponses(G1.A, G1.B), ends: [sweep[0], sweep.at(-1)].map((s) => [r4(s.a), r4(s.yR)]) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sweep', figure(fig1, 'Figure 1. The mixed Nash equilibrium worked out by the Nash equilibrium solver\'s maths for 121 versions of the game, changing only the row player\'s payoff for (T, L). The row player\'s own mix never moves; only the column player\'s does.'));
  md = inject(md, 'reply', figure(fig2, 'Figure 2. The row player\'s expected payoff from each move in the higher-type game, against the column player\'s chance of R. The shaded band is the column play the paper reports (about 66 to 71 % R); the dashed line is the Nash mix.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
