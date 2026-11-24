// Figures for src/blog/discoveries/saturation-flow-effective-width-webster-cycle-delay.md, made with the maths of
// the Signal timing tool (src/lib/sci/eng-webster.ts: Webster's flow ratios, optimum cycle and delay formula).
// Run: node scripts/blog-figures/saturation-flow-effective-width-webster-cycle-delay.mjs
import fs from 'node:fs';
import { webster, delayCurve } from '../../src/lib/sci/eng-webster.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/saturation-flow-effective-width-webster-cycle-delay.md', import.meta.url);

// The paper's published base-saturation-flow models, S0 in PCU per hour of green per approach, We the effective
// approach width in metres. Sugiarto et al. (2024), PLOS ONE 19(7): e0306112, doi:10.1371/journal.pone.0306112 (CC BY 4.0).
const MODELS = [
  { id: 'ihcm', name: 'IHCM 1997: 600·We', f: (w) => 600 * w, rmse: 257, rmspe: 21 },
  { id: 'm1', name: 'Paper, one term: 493·We', f: (w) => 493 * w, rmse: 77, rmspe: 8 },
  { id: 'm2', name: 'Paper, two terms: 783 + 368·We', f: (w) => 783 + 368 * w, rmse: 42, rmspe: 4 },
  { id: 'mun', name: 'Munawar: 500·We^0.95', f: (w) => 500 * w ** 0.95, rmse: null, rmspe: null },
];
// The same three fitted on the paper's own new passenger-car-equivalent set (for the text, not the chart).
const NEWPCE = { ihcm: { rmse: 127, rmspe: 12 }, m1: { f: (w) => 622 * w, rmse: 117, rmspe: 10 }, m2: { f: (w) => 1020 + 459 * w, rmse: 64, rmspe: 4 } };

// OUR ASSUMPTION: a two-phase, four-approach fixed-time signal. The effective widths sit inside the paper's
// observed range (2.8 to 8 m) and the flows are made up; the paper publishes no per-approach flows.
const APPS = [
  { name: 'North', phase: 1, we: 7.0, q: 1500 },
  { name: 'South', phase: 1, we: 6.0, q: 1100 },
  { name: 'East', phase: 2, we: 4.0, q: 700 },
  { name: 'West', phase: 2, we: 3.5, q: 550 },
];
// Lost time from the paper's measured lags: start-lag 4.5 s (midpoint of 4 to 5 s) plus the unused 1 s at the end
// of a 4 s intergreen (end-lag about 3 s) = 5.5 s per phase.
const LOST = { 1: 5.5, 2: 5.5 }, INTER = { 1: 4, 2: 4 };
const build = (m) => APPS.map((a) => ({ name: a.name, phase: a.phase, q: a.q, s: Math.round(m.f(a.we)) }));

const runs = MODELS.filter((m) => m.id !== 'mun').map((m) => {
  const apps = build(m), r = webster(apps, LOST, INTER, { round: 5 });
  return { m, apps, r, exact: webster(apps, LOST, INTER, {}) };
});

// Figure 1: the published models across the paper's width range.
const WS = Array.from({ length: 53 }, (_, i) => 2.8 + i * 0.1);
const fig1 = chart({
  title: 'Base saturation flow against effective width', xLabel: 'Effective approach width We (m)', yLabel: 'Base saturation flow S₀ (PCU/h)',
  series: MODELS.map((m) => ({ name: m.name.replace(/^.*?: /, (s) => s).slice(0, 30), kind: 'line', x: WS, y: WS.map((w) => +m.f(w).toFixed(0)), dash: m.id === 'mun' ? '5 4' : undefined })),
  xDomain: [2.8, 8], yDomain: [1200, 5000], height: 290,
  desc: 'The four published base saturation flow models from 2.8 to 8 m of effective approach width. The straight IHCM line rises fastest and crosses the paper two-term model near 3.4 m.',
});

// Figure 2: average delay against cycle length under each saturation flow model.
const CS = Array.from({ length: 171 }, (_, i) => 30 + i);
const curves = runs.map((x) => ({ id: x.m.id, name: x.m.name.split(':')[0], d: delayCurve(x.apps, LOST, INTER, CS) }));
const fig2 = chart({
  title: 'Average delay against cycle length', xLabel: 'Cycle length C (s)', yLabel: 'Average delay (s per vehicle)',
  series: curves.map((c) => ({ name: c.name, kind: 'line', x: CS, y: c.d.map((v) => (Number.isFinite(v) ? +v.toFixed(2) : NaN)) })),
  xDomain: [30, 200], yDomain: [15, 90], height: 290,
  vlines: runs.map((x, i) => ({ x: Math.round(x.exact.C0), text: `C₀ ${Math.round(x.exact.C0)} s`, left: i === 0, dy: i * 14 })),
  desc: 'Webster average delay against cycle length for the same four approaches, with saturation flows from the IHCM formula and from the paper two fitted models. The IHCM line sits lowest and its optimum cycle is the shortest.',
});

const out = runs.map((x) => ({
  model: x.m.name, s: x.apps.map((a) => a.s), y: x.r.P.map((p) => +p.y.toFixed(4)), Y: +x.r.Y.toFixed(4),
  C0: +x.exact.C0.toFixed(1), C: x.r.C, g: x.r.P.map((p) => +p.g.toFixed(1)), G: x.r.P.map((p) => +p.G.toFixed(1)),
  X: +x.r.X.toFixed(3), x: x.r.A.map((a) => +a.x.toFixed(3)), d: x.r.A.map((a) => +a.d.toFixed(2)), dAvg: +x.r.dAvg.toFixed(2),
  cap: x.r.A.map((a) => Math.round(a.cap)), qMax: x.r.A.map((a) => +a.qMax.toFixed(1)),
}));
console.log(JSON.stringify(out, null, 1));
console.log('S0 at We = 8 m:', MODELS.map((m) => `${m.id} ${Math.round(m.f(8))}`).join(', '));
console.log('S0 at We = 3 m:', MODELS.map((m) => `${m.id} ${Math.round(m.f(3))}`).join(', '));
console.log('cross IHCM vs two-term:', (783 / (600 - 368)).toFixed(2), 'm; new-PCE cross:', (1020 / (600 - 459)).toFixed(2), 'm');
console.log('IHCM over two-term at 8 m:', ((600 * 8) / (783 + 368 * 8) - 1) * 100);
console.log('new PCE S0 at We 7:', NEWPCE.m2.f(7), 'one term', NEWPCE.m1.f(7));
// What happens if the signal is timed on the IHCM formula but the street really discharges at the paper's rate:
// keep the 65 s cycle and the green split it gave, and re-evaluate with the measured saturation flows.
{
  const trueApps = build(MODELS[2]);
  const wrong = webster(trueApps, LOST, INTER, { cycle: 65 });
  const right = webster(trueApps, LOST, INTER, { round: 5 });
  console.log('timed on IHCM (C = 65 s) but true S0:', { dAvg: +wrong.dAvg.toFixed(2), X: +wrong.X.toFixed(3), x: wrong.A.map((a) => +a.x.toFixed(3)), d: wrong.A.map((a) => +a.d.toFixed(2)), qMax: wrong.A.map((a) => +a.qMax.toFixed(1)), cap: wrong.A.map((a) => Math.round(a.cap)) });
  console.log('timed on the paper model (C = 90 s):', { dAvg: +right.dAvg.toFixed(2), X: +right.X.toFixed(3) });
  console.log('delay penalty, s/veh and %:', +(wrong.dAvg - right.dAvg).toFixed(2), +((wrong.dAvg / right.dAvg - 1) * 100).toFixed(1));
}

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'models', figure(fig1, 'Figure 1. The four published base saturation flow models, recomputed across the effective widths the paper observed (2.8 to 8 m). The dashed line is the older Munawar power law. Nothing is fitted here: these are the paper\'s own equations drawn out.'));
  md = inject(md, 'delay', figure(fig2, 'Figure 2. Webster average delay against cycle length for the same made-up four-approach signal, with saturation flows taken from each model. Dashed lines mark each case\'s optimum cycle. The flows are our assumption; the saturation flows come from the paper.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
