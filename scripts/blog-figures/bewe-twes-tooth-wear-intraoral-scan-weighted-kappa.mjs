// Figures for src/blog/discoveries/bewe-twes-tooth-wear-intraoral-scan-weighted-kappa.md, made with the maths of the
// Reliability analysis tool (src/lib/sci/reliability.ts: Cohen's kappa, unweighted, linear and quadratic weights).
// Run: node scripts/blog-figures/bewe-twes-tooth-wear-intraoral-scan-weighted-kappa.mjs  (rewrites the charts)
import fs from 'node:fs';
import { cohen } from '../../src/lib/sci/reliability.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/bewe-twes-tooth-wear-intraoral-scan-weighted-kappa.md', import.meta.url);

// Inputs. "Paper": Lorens and Tomaszewska (2026), PLOS ONE 21(6): e0351330 (CC BY 4.0): 246 scans, two examiners,
// BEWE scores 0-3 per sextant, weighted kappa 0.760 to 0.851 across sextants (scheme not stated), rater 1 tends higher,
// sample size planned for kappa0 = 0.40 with required N = 49 to 75.
const PAPER_LO = 0.760, PAPER_HI = 0.851, K0 = 0.40;

// 1. A SIMULATED agreement table for one sextant: 246 paired BEWE scores (our numbers, not the paper's tables).
// Our assumptions: most sextants score 0 or 1, few score 3, rater 1 (rows) scores higher a little more often.
const T = [[70, 8, 1, 0], [14, 80, 6, 0], [1, 10, 40, 2], [0, 0, 4, 10]];
const k = { none: cohen(T, 'none'), linear: cohen(T, 'linear'), quadratic: cohen(T, 'quadratic') };
const up = T.reduce((s, r, i) => s + r.reduce((a, v, j) => a + (i > j ? v : 0), 0), 0), down = T.reduce((s, r, i) => s + r.reduce((a, v, j) => a + (i < j ? v : 0), 0), 0);

// Figure 1: how each kappa falls as rater 1 drifts upwards. We move a share s of rater 2's agreed scores in
// categories 0-2 one step up for rater 1 (our assumption: a systematic bias, as in the paper's Wilcoxon results).
const shift = (s) => { const M = T.map((r) => r.slice()); for (let c = 0; c < 3; c++) { const m = Math.round(M[c][c] * s); M[c][c] -= m; M[c + 1][c] += m; } return M; };
const ss = Array.from({ length: 21 }, (_, i) => +(i * 0.02).toFixed(2));
const curve = (w) => ss.map((s) => +cohen(shift(s), w).kappa.toFixed(4));
const fig1 = chart({
  title: 'Three kappas for the same simulated sextant', xLabel: 'Share of agreed scores rater 1 marks one grade higher', yLabel: 'Kappa',
  series: [
    { name: 'Quadratic weights', kind: 'line', x: ss, y: curve('quadratic') },
    { name: 'Linear weights', kind: 'line', x: ss, y: curve('linear') },
    { name: 'Unweighted', kind: 'line', x: ss, y: curve('none') },
  ],
  yDomain: [0.3, 0.9], xFmt: (t) => `${Math.round(t * 100)}%`, bands: [], hlines: [{ y: PAPER_HI, text: 'paper range 0.760 to 0.851' }, { y: PAPER_LO, text: '' }],
  desc: `On one simulated table, unweighted kappa is ${k.none.kappa.toFixed(3)}, linear ${k.linear.kappa.toFixed(3)} and quadratic ${k.quadratic.kappa.toFixed(3)}; all three fall as one rater drifts upwards.`, height: 300,
});

// Figure 2: SIMULATED sampling spread of unweighted kappa for 60 and 246 sextants drawn from the table's cell
// shares; 2000 samples each. Also the share whose 95% interval stays above kappa0 = 0.40.
let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const cells = T.flat(), tot = cells.reduce((a, b) => a + b, 0), cum = []; cells.reduce((a, v, i) => (cum[i] = a + v / tot), 0);
const draw = (n) => { const c = new Array(16).fill(0); for (let i = 0; i < n; i++) { const u = rnd(); c[cum.findIndex((x) => u <= x)]++; } return [0, 1, 2, 3].map((r) => c.slice(r * 4, r * 4 + 4)); };
const sim = (n) => { const ks = [], above = []; for (let i = 0; i < 2000; i++) { try { const r = cohen(draw(n), 'none'); ks.push(r.kappa); above.push(r.ci[0] > K0); } catch { /* empty draws are skipped */ } } return { ks, share: above.filter(Boolean).length / above.length }; };
const s60 = sim(60), s246 = sim(246);
const hist = (v) => { const b = Array.from({ length: 31 }, (_, i) => 0.45 + i * 0.015), h = b.map(() => 0); for (const x of v) { const i = Math.floor((x - 0.45) / 0.015); if (i >= 0 && i < h.length) h[i]++; } return { x: b.map((x) => +(x + 0.0075).toFixed(4)), y: h.map((c) => +(c / v.length / 0.015).toFixed(2)) }; };
const h60 = hist(s60.ks), h246 = hist(s246.ks);
const sd = (v) => { const m = v.reduce((a, b) => a + b, 0) / v.length; return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
const fig2 = chart({
  title: 'Spread of unweighted kappa in repeated studies (simulated)', xLabel: 'Kappa', yLabel: 'Density',
  series: [{ name: '246 sextants', kind: 'line', x: h246.x, y: h246.y }, { name: '60 sextants', kind: 'line', x: h60.x, y: h60.y }],
  xDomain: [0.45, 0.92], vlines: [{ x: k.none.kappa, text: `true ${k.none.kappa.toFixed(3)}`, left: true }],
  desc: `In 2000 simulated studies, unweighted kappa has a standard deviation of ${sd(s60.ks).toFixed(3)} with 60 sextants and ${sd(s246.ks).toFixed(3)} with 246.`, height: 300,
});

const facts = { kNone: k.none.kappa.toFixed(3), kNoneCI: k.none.ci.map((v) => v.toFixed(3)), po: k.none.po.toFixed(3), pe: k.none.pe.toFixed(3), kLin: k.linear.kappa.toFixed(3), poLin: k.linear.po.toFixed(3), kQuad: k.quadratic.kappa.toFixed(3), up, down,
  at10: { none: cohen(shift(0.1), 'none').kappa.toFixed(3), linear: cohen(shift(0.1), 'linear').kappa.toFixed(3), quadratic: cohen(shift(0.1), 'quadratic').kappa.toFixed(3) },
  sd60: sd(s60.ks).toFixed(3), sd246: sd(s246.ks).toFixed(3), share60: s60.share, share246: s246.share };
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'weights', figure(fig1, 'Figure 1. Unweighted, linear and quadratic kappa from the Reliability analysis tool\'s maths for one simulated 246-sextant BEWE table, as one rater increasingly scores one grade higher. Simulated, not the paper\'s tables.'));
  md = inject(md, 'spread', figure(fig2, 'Figure 2. Unweighted kappa in 2000 simulated studies of 60 and of 246 sextants drawn from the same simulated table, worked out with the Reliability analysis tool\'s maths. Simulated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
