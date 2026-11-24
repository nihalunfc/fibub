// Figures for src/blog/discoveries/malicious-opponent-generalised-maximin-linear-programming-bimatrix-game.md, made
// with the maths of the LP solver (src/lib/sci/lp.ts: parseModel, solve) and the Nash equilibrium solver
// (src/lib/sci/nash.ts: supportEnumeration).
// Run: node scripts/blog-figures/malicious-opponent-generalised-maximin-linear-programming-bimatrix-game.mjs
import fs from 'node:fs';
import { parseModel, solve } from '../../src/lib/sci/lp.ts';
import { supportEnumeration } from '../../src/lib/sci/nash.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/malicious-opponent-generalised-maximin-linear-programming-bimatrix-game.md', import.meta.url);

// The 4 x 3 bimatrix game of Zhang and Morsky (2025), Games 16(6): 59, Section 2.1 (CC BY): A = row payoffs, B = column payoffs.
const A = [[-62, 44, 62], [-42, 4, 62], [24, -77, -68], [28, 80, 53]];
const B = [[13, -33, -63], [-76, -90, 34], [-30, -63, -39], [85, -33, -24]];
const t = (c) => (c < 0 ? `- ${-c}` : `+ ${c}`);

// Model texts, exactly as a reader would type them into the LP solver.
export const colMaximin = 'maximize v: v\nsubject to\n' + B.map((r, i) => `  row${i + 1}: ${r.map((b, j) => `${t(b)} q${j + 1}`).join(' ')} - v >= 0`).join('\n') + '\n  sum: q1 + q2 + q3 = 1\nfree v\n';
export const rowMaximin = 'maximize v: v\nsubject to\n' + [0, 1, 2].map((j) => `  col${j + 1}: ${A.map((r, i) => `${t(r[j])} p${i + 1}`).join(' ')} - v >= 0`).join('\n') + '\n  sum: p1 + p2 + p3 + p4 = 1\nfree v\n';
export const generalised = (phi) => 'minimize w: w\nsubject to\n'
  + [0, 1, 2].map((j) => `  colpay${j + 1}: ${B.map((x, i) => `${t(x[j])} p${i + 1}`).join(' ')} - w <= 0`).join('\n') + '\n'
  + [0, 1, 2].map((j) => `  rowmin${j + 1}: ${A.map((x, i) => `${t(x[j])} p${i + 1}`).join(' ')} >= ${+phi.toFixed(4)}`).join('\n')
  + '\n  sum: p1 + p2 + p3 + p4 = 1\nfree w\n';

const cm = solve(parseModel(colMaximin)), rm = solve(parseModel(rowMaximin));
const minA = Math.min(...A.flat()), vRow = rm.obj;
const phiOf = (th) => minA + th * (vRow - minA); // our reading: threshold θ between the worst payoff and the maximin value
const run = (phi) => { const m = parseModel(generalised(phi)), r = solve(m); const ix = (n) => m.vars.indexOf(n); return { r, w: r.obj, p: [1, 2, 3, 4].map((k) => r.x[ix('p' + k)]), q: [0, 1, 2].map((j) => -r.shadow[j]) }; };
const g22 = run(phiOf(0.22)), g5389 = run(-53.89);
const eqs = supportEnumeration(A, B);

const TH = Array.from({ length: 101 }, (_, i) => i / 100);
const sweep = TH.map((th) => run(phiOf(th)));
const fig1 = chart({
  title: 'Column player: guaranteed payoff against the threshold', xLabel: 'Row player\'s risk threshold θ', yLabel: 'Guaranteed column payoff',
  series: [{ name: 'Generalised maximin (LP)', kind: 'line', x: TH, y: sweep.map((s) => +s.w.toFixed(3)) }],
  xDomain: [0, 1], yDomain: [-40, 90], hlines: [{ y: +cm.obj.toFixed(2), text: `classical maximin ${cm.obj.toFixed(2)}` }],
  vlines: [{ x: 0.22, text: `θ = 0.22: ${g22.w.toFixed(2)}` }],
  desc: `The column player's guaranteed payoff from the generalised maximin linear program, as the row player's threshold rises from 0 to 1. It equals the classical maximin ${cm.obj.toFixed(2)} at 0, is ${g22.w.toFixed(2)} at 0.22 and reaches ${sweep[100].w.toFixed(0)} at 1.`, height: 280,
});
const fig2 = chart({
  title: 'Row player\'s most harmful safe mix', xLabel: 'Row player\'s risk threshold θ', yLabel: 'Probability',
  series: [1, 2, 3, 4].map((k) => ({ name: `Row ${k}`, kind: 'line', x: TH, y: sweep.map((s) => +s.p[k - 1].toFixed(4)), dash: k === 4 ? '5 4' : undefined })),
  xDomain: [0, 1], yDomain: [0, 1], vlines: [{ x: 0.22, text: '0.22' }],
  desc: 'The row player\'s strategy that hurts the column player most while still keeping the row player\'s own minimum payoff, for thresholds from 0 to 1, as found by the LP solver.', height: 260,
});

const r2 = (v) => +v.toFixed(4);
console.log(JSON.stringify({
  colMaximin: { v: r2(cm.obj), x: cm.x.map(r2), pivots: cm.pivots }, rowMaximin: { v: r2(vRow), x: rm.x.map(r2) }, minA,
  phi022: r2(phiOf(0.22)), g22: { w: r2(g22.w), p: g22.p.map(r2), q: g22.q.map(r2) }, g5389: { w: r2(g5389.w), p: g5389.p.map(r2), q: g5389.q.map(r2) },
  at: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1].map((th) => [th, r2(sweep[Math.round(th * 100)].w), sweep[Math.round(th * 100)].p.map(r2)]),
  firstChange: TH.find((th, i) => sweep[i].w > cm.obj + 1e-6),
  nash: eqs.map((e) => ({ x: e.x.map(r2), y: e.y.map(r2), u: r2(e.u), v: r2(e.v) })),
}));
console.log(generalised(-53.89));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'payoff', figure(fig1, 'Figure 1. The column player\'s guaranteed payoff from the generalised maximin linear program, solved with the LP solver\'s maths at 101 thresholds. The dashed line is the classical maximin, which assumes a fully malicious opponent. The threshold-to-requirement rule is our reading of the paper.'));
  md = inject(md, 'mix', figure(fig2, 'Figure 2. The row player\'s mix that does the column player the most harm while keeping the row player\'s own minimum payoff, at each threshold. Row 4 (dashed) is the row player\'s own safest strategy; it takes over as the threshold nears 1.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
