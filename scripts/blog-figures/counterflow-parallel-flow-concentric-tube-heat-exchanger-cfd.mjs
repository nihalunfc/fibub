// Figures for src/blog/discoveries/counterflow-parallel-flow-concentric-tube-heat-exchanger-cfd.md, made with the
// maths of the Heat exchanger sizing tool (src/lib/sci/eng-hx.ts).
// Run: node scripts/blog-figures/counterflow-parallel-flow-concentric-tube-heat-exchanger-cfd.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { effectiveness, lmtd, ends, ntuFor, rate } from '../../src/lib/sci/eng-hx.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/counterflow-parallel-flow-concentric-tube-heat-exchanger-cfd.md', import.meta.url);

// Inputs. "Paper": Dogan (2026), Processes 14, 1641, doi:10.3390/pr14101641 (CC BY), Table 2 and the text.
const THI = 350, TCI = 300;                 // K, paper (inlet temperatures, both arrangements)
const MC = 0.042;                           // kg/s, paper (annulus, cold stream)
const RE = [1000, 1200, 1500, 1800, 2000];  // paper (inner-tube Reynolds numbers)
// Outlet temperatures (K), paper, Table 2: [hot out, cold out]
const CF = [[340.26, 302.87], [341.46, 303.02], [342.77, 303.20], [343.73, 303.33], [344.23, 303.40]];
const PF = [[340.66, 302.75], [341.79, 302.91], [343.03, 303.08], [343.93, 303.22], [344.41, 303.30]];
const Q_CF = [504.69, null, null, null, 598.01], Q_PF = [483.91, null, null, null, 579.66]; // W, paper (end points only)
const AREA = Math.PI * 0.020 * 1.0;         // m², our assumption: outer surface of the 20 mm inner tube, 1 m long (paper's sizes)

// From temperatures alone: the cold stream's capacity rate is fixed by its flow, Cc = Q / ΔTc; the hot stream's
// capacity rate follows from the same Q and its own temperature drop (energy balance).
function analyse([tho, tco], parallel) {
  const dTh = THI - tho, dTc = tco - TCI, ratio = dTc / dTh;      // Ch / Cc = ΔTc / ΔTh
  const Cc = MC * 4180;                                           // W/K, our assumption: water cp 4180 J/kg·K
  const Ch = Cc * ratio, Q = Ch * dTh;
  const Cmin = Math.min(Ch, Cc), Cr = Cmin / Math.max(Ch, Cc);
  const eps = Q / (Cmin * (THI - TCI));
  const [d1, d2] = ends(THI, tho, TCI, tco, parallel);
  const L = lmtd(d1, d2), UA = Q / L, NTU = UA / Cmin;
  return { Ch, Cc, Q, Cr, eps, L, UA, NTU, U: UA / AREA, ntuCheck: ntuFor(parallel ? 'parallel' : 'counter', eps, Cr) };
}
const cf = CF.map((r) => analyse(r, false)), pf = PF.map((r) => analyse(r, true));

// Prediction: give a parallel-flow exchanger the same UA and streams as the counterflow one, and ask the tool's
// rating maths for its duty. The paper's CFD did this by simulation; we do it with one line of ε-NTU.
const pred = cf.map((c) => rate('parallel', c.UA, { Thi: THI, Tci: TCI, Ch: c.Ch, Cc: c.Cc }));
const gainPaper = cf.map((c, i) => (c.Q / pf[i].Q - 1) * 100);
const gainTool = cf.map((c, i) => (c.Q / pred[i].Q - 1) * 100);

// Figure 1: effectiveness against NTU for the two arrangements at the paper's capacity ratio, with the ten CFD points.
const Cr0 = cf[0].Cr;
const nx = Array.from({ length: 61 }, (_, i) => +(i * 0.01).toFixed(3));
const fig1 = chart({
  title: 'Effectiveness against NTU at the paper\'s capacity ratio', xLabel: 'NTU (U A / Cmin)', yLabel: 'Effectiveness ε',
  series: [
    { name: 'Counterflow (tool)', kind: 'line', x: nx, y: nx.map((n) => +effectiveness('counter', n, Cr0).toFixed(4)) },
    { name: 'Parallel flow (tool)', kind: 'line', x: nx, y: nx.map((n) => +effectiveness('parallel', n, Cr0).toFixed(4)), dash: true },
    { name: 'CFD runs (paper)', kind: 'dots', x: [...cf, ...pf].map((r) => +r.NTU.toFixed(4)), y: [...cf, ...pf].map((r) => +r.eps.toFixed(4)), colour: 'var(--ink)' },
  ],
  yDomain: [0, 0.45],
  desc: `Effectiveness rises with NTU; at the paper's small NTU values (0.10 to 0.22) the counterflow and parallel-flow curves almost touch, and the ten CFD runs sit on them.`, height: 300,
});

// Figure 2: counterflow advantage in heat duty, paper's CFD against the tool's ε-NTU prediction at equal UA.
const fig2 = chart({
  title: 'How much more heat counterflow moves', xLabel: 'Reynolds number in the inner tube', yLabel: 'Counterflow gain over parallel (%)',
  series: [
    { name: 'Paper (CFD, from its outlet temperatures)', kind: 'dots', x: RE, y: gainPaper.map((g) => +g.toFixed(2)), colour: 'var(--ink)' },
    { name: 'Tool (ε-NTU at the same UA)', kind: 'line', x: RE, y: gainTool.map((g) => +g.toFixed(2)) },
  ],
  yDomain: [0, 6],
  desc: 'The CFD gives counterflow 3 to 4.4 percent more heat, while the effectiveness-NTU prediction at equal UA gives only 0.3 to 0.4 percent.', height: 280,
});

const r2 = (x) => +x.toFixed(2), r3 = (x) => +x.toFixed(3), r4 = (x) => +x.toFixed(4);
console.log(JSON.stringify({
  cf: cf.map((c) => ({ Q: r2(c.Q), Ch: r2(c.Ch), Cr: r3(c.Cr), eps: r4(c.eps), L: r2(c.L), UA: r2(c.UA), U: r2(c.U), NTU: r4(c.NTU), ntuCheck: r4(c.ntuCheck) })),
  pf: pf.map((c) => ({ Q: r2(c.Q), Ch: r2(c.Ch), eps: r4(c.eps), L: r2(c.L), UA: r2(c.UA), NTU: r4(c.NTU) })),
  pred: pred.map((p) => ({ Q: r2(p.Q), Tho: r2(p.Tho), Tco: r2(p.Tco) })),
  gainPaper: gainPaper.map(r2), gainTool: gainTool.map(r2), paperQ: { Q_CF, Q_PF }, area: r4(AREA),
}, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'eps', figure(fig1, 'Figure 1. Effectiveness against NTU from the Heat exchanger sizing tool\'s maths at Cr = ' + Cr0.toFixed(2) + ', with the ten CFD runs placed from the paper\'s outlet temperatures.'));
  md = inject(md, 'gain', figure(fig2, 'Figure 2. Extra heat moved by counterflow over parallel flow: the paper\'s CFD (dots, worked out from its published outlet temperatures) and the tool\'s ε-NTU prediction for the same UA and streams (line).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
