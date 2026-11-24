// Figures for src/blog/discoveries/random-forest-uscs-soil-classification-seven-index-inputs.md, made with the
// maths of the Soil classification tool (src/lib/sci/soilclass.ts: the USCS decision chart and the AASHTO groups).
// Run: node scripts/blog-figures/random-forest-uscs-soil-classification-seven-index-inputs.mjs
import fs from 'node:fs';
import { uscs, aashto, aLine, uLine } from '../../src/lib/sci/soilclass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/random-forest-uscs-soil-classification-seven-index-inputs.md', import.meta.url);

// The paper: Liu, C.-Y., Ku, C.-Y., Wu, T.-Y. and Ku, Y.-C. (2024), Applied Sciences 14(16): 7202,
// doi:10.3390/app14167202 (CC BY 4.0). Its random forest takes seven inputs (Cc, Cu, PI, organic flag, LL,
// percent passing the No. 4 and the No. 200 sieve) and predicts one of 25 USCS soil types, learned from
// 521,316 synthetic records. The grid below is OURS, not the paper's data: the paper publishes no input ranges.
const P4 = [40, 60, 75, 90, 100];            // % passing 4.75 mm
const P200 = [2, 8, 20, 40, 60, 80, 95];     // % passing 0.075 mm
const LLS = [20, 30, 40, 55, 70];
const PIS = [2, 6, 12, 25, 40];
const CUS = [2, 4, 6, 10, 20];
const CCS = [0.5, 1.5, 2.5, 4, 8];
const ORG = [0, 1];
const RANGES = [P4, P200, LLS, PIS, CUS, CCS, ORG];
const NAMES = ['% < 4.75 mm', '% < 0.075 mm', 'LL', 'PI', 'Cu', 'Cc', 'organic'];

/** One grid point as the tool's input: Cu and Cc become D10, D30 and D60; the organic flag becomes an oven-dry LL. */
const asInput = ([p4, p200, LL, PI, Cu, Cc, org]) => {
  const d60 = 1, d10 = d60 / Cu, d30 = Math.sqrt(Cc * d10 * d60);
  return { gravel: 100 - p4, sand: p4 - p200, fines: p200, d10, d30, d60, LL, PL: LL - PI, LLdry: org ? 0.6 * LL : 0.95 * LL };
};
const symbolOf = (a) => { try { return uscs(asInput(a)).symbol; } catch { return null; } };
const valid = (a) => a[1] <= a[0] && a[3] <= uLine(a[2]) && a[3] <= a[2];

const soils = [];
for (const p4 of P4) for (const p200 of P200) for (const LL of LLS) for (const PI of PIS) for (const Cu of CUS) for (const Cc of CCS) for (const org of ORG) {
  const a = [p4, p200, LL, PI, Cu, Cc, org];
  if (!valid(a)) continue;
  const s = symbolOf(a);
  if (s) soils.push([a, s]);
}
const counts = {};
for (const [, s] of soils) counts[s] = (counts[s] ?? 0) + 1;
const symbols = Object.keys(counts).sort();

// How often each input decides the answer: the share of soils whose symbol changes when that one input is moved.
const decides = RANGES.map((range, j) => {
  let matters = 0;
  for (const [a, s] of soils) {
    for (const v of range) {
      if (v === a[j]) continue;
      const b = a.slice(); b[j] = v;
      if (!valid(b)) continue;
      const t = symbolOf(b);
      if (t && t !== s) { matters++; break; }
    }
  }
  return +((100 * matters) / soils.length).toFixed(1);
});

// Figure 1: the plasticity chart the fines decision runs on, with our grid's LL and PI points.
const lls = Array.from({ length: 81 }, (_, i) => 10 + i);
const pts = [];
for (const LL of LLS) for (const PI of PIS) if (PI <= uLine(LL) && PI <= LL) pts.push([LL, PI]);
const fig1 = chart({
  title: 'The plasticity chart behind every CL, ML, CH and MH', xLabel: 'Liquid limit LL (%)', yLabel: 'Plasticity index PI (%)',
  series: [
    { name: 'A-line, PI = 0.73 (LL − 20)', kind: 'line', x: lls, y: lls.map((L) => +aLine(L).toFixed(2)) },
    { name: 'U-line, PI = 0.9 (LL − 8)', kind: 'line', x: lls, y: lls.map((L) => +uLine(L).toFixed(2)), colour: 'var(--c-tools)', dash: '5 4' },
    { name: 'Our grid of soils', kind: 'dots', x: pts.map((p) => p[0]), y: pts.map((p) => p[1]), size: 3.4, colour: 'var(--ink)' },
  ],
  xDomain: [10, 90], yDomain: [0, 60], hlines: [{ y: 7, text: 'PI 7' }, { y: 4, text: 'PI 4' }], vlines: [{ x: 50, text: 'LL 50' }],
  desc: 'The Casagrande plasticity chart as the tool draws it: the A-line, the U-line, the PI 4 and PI 7 lines and the LL 50 line, with the liquid limit and plasticity index of our grid of soils marked.',
  height: 300,
});

// Figure 2: which of the seven inputs actually decides the group symbol.
const order = decides.map((v, i) => [v, NAMES[i]]).sort((a, b) => a[0] - b[0]);
const fig2 = chart({
  title: 'Which of the seven inputs decides the USCS symbol', xLabel: 'Input', yLabel: 'Soils whose symbol it changes (%)',
  series: [
    { name: '', noLegend: true, kind: 'dots', x: order.map((_, i) => i + 1), y: order.map((o) => o[0]), size: 5 },
    ...order.map((o, i) => ({ name: '', noLegend: true, kind: 'line', x: [i + 1, i + 1], y: [0, o[0]], colour: 'var(--c-blog)' })),
  ],
  xDomain: [0.4, 7.6], yDomain: [0, 105], xTicks: order.map((_, i) => i + 1), xFmt: (t) => order[t - 1][1],
  desc: 'The share of soils in our grid whose USCS group symbol changes when one input is moved over its range, for each of the paper\'s seven inputs. The percentage passing the 0.075 millimetre sieve decides every soil; the curvature coefficient decides the fewest.',
  height: 300,
});

// A worked soil and a borderline one, for "Check it yourself".
const worked = uscs({ gravel: 8, sand: 64, fines: 28, LL: 38, PL: 20 });
const workedA = aashto({ p10: 85, p40: 60, p200: 28, LL: 38, PI: 18 });
const dual = uscs({ gravel: 5, sand: 87, fines: 8, d10: 0.09, d30: 0.3, d60: 0.8, LL: 26, PL: 20 });

const out = {
  soils: soils.length, distinct: symbols.length, symbols,
  top: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6),
  decides: NAMES.map((n, i) => [n, decides[i]]),
  worked: { symbol: worked.symbol, name: worked.name, PI: worked.PI, steps: worked.steps, aashto: workedA.group, GI: workedA.GI, giText: workedA.giText },
  dual: { symbol: dual.symbol, name: dual.name, Cu: +dual.Cu.toFixed(3), Cc: +dual.Cc.toFixed(3), PI: dual.PI },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'plasticity', figure(fig1, 'Figure 1. The plasticity chart as the Soil classification tool draws it. Fine-grained soils left of LL 50 and above the A-line are CL, below it ML; right of LL 50 they are CH and MH. Between PI 4 and 7 above the A-line sits the dual CL-ML. The U-line is the practical upper limit for natural soils, which is why our grid stays below it.'));
  md = inject(md, 'inputs', figure(fig2, 'Figure 2. How often each of the paper\'s seven inputs changes the answer, over our own grid of 25,650 soils classified with the tool. Not the paper\'s sensitivity analysis: our measure of the same question.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
