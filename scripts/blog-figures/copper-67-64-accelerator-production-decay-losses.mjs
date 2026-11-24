// Figures for src/blog/discoveries/copper-67-64-accelerator-production-decay-losses.md, made with the maths of the
// Decay calculator (src/lib/sci/decay.ts: decay correction, time-to-activity, specific and molar activity).
// Run: node scripts/blog-figures/copper-67-64-accelerator-production-decay-losses.mjs  (rewrites the charts inside the article)
import fs from 'node:fs';
import { decay, timeTo, specific, halfLifeS } from '../../src/lib/sci/decay.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/copper-67-64-accelerator-production-decay-losses.md', import.meta.url);

// Half-lives: NNDC/DDEP recommended values, as used throughout fibub's Decay calculator.
const HL = { 'Cu-67': halfLifeS(61.83, 'h'), 'Cu-64': halfLifeS(12.701, 'h'), 'Zn-65': halfLifeS(243.93, 'd'), 'Zn-69m': halfLifeS(13.76, 'h'), 'Ni-65': halfLifeS(2.5175, 'h') };
// What the paper rounds them to, in days (Nagai et al. 2025, Front. Nucl. Med. 5: 1657125, CC BY 4.0, Tables 1 and 2).
const PAPER_DAYS = { 'Cu-67': 2.58, 'Cu-64': 0.53, 'Zn-65': 244, 'Zn-69m': 0.57, 'Ni-65': 0.11 };
// End-of-irradiation activities measured by the paper (Bq): 52 MeV deuterons on enriched 68ZnO, and 41 MeV on 64ZnO.
const EOI = { 'Cu-67': 1230, 'Zn-65': 2.9, 'Cu-64': 6610 };
const SEP_H = 8; // the paper's separation time: about 4 h of sublimation plus 4 h of column chemistry
const CHEM = 0.94; // its chemical recovery for the enriched 68Zn run (99 % sublimation x 95 % column)

const roundingTable = Object.entries(PAPER_DAYS).map(([id, d]) => ({
  id, refH: +(HL[id] / 3600).toFixed(3), paperH: +(d * 24).toFixed(2), offPct: +(100 * ((d * 86400) / HL[id] - 1)).toFixed(1),
  // What the rounding does to a decay correction over one day.
  oneDayRef: +decay(1, 86400, HL[id]).toFixed(5), oneDayPaper: +decay(1, 86400, d * 86400).toFixed(5),
}));

const hours = [1, 2, 4, 8, 12, 24, 48, 72, 168];
const survival = hours.map((h) => ({ h, cu67: +(100 * decay(1, h * 3600, HL['Cu-67'])).toFixed(1), cu64: +(100 * decay(1, h * 3600, HL['Cu-64'])).toFixed(1) }));

const out = {
  roundingTable, survival,
  afterSeparation: {
    cu67: +decay(EOI['Cu-67'], SEP_H * 3600, HL['Cu-67']).toFixed(1),
    cu67WithChemistry: +(CHEM * decay(EOI['Cu-67'], SEP_H * 3600, HL['Cu-67'])).toFixed(1),
    cu64: +decay(EOI['Cu-64'], SEP_H * 3600, HL['Cu-64']).toFixed(0),
    cu67Left: +(100 * decay(1, SEP_H * 3600, HL['Cu-67'])).toFixed(1),
    cu64Left: +(100 * decay(1, SEP_H * 3600, HL['Cu-64'])).toFixed(1),
  },
  impurity: {
    atEoiPct: +((EOI['Zn-65'] / EOI['Cu-67']) * 100).toFixed(3),
    after7dPct: +(((EOI['Zn-65'] * decay(1, 7 * 86400, HL['Zn-65'])) / (EOI['Cu-67'] * decay(1, 7 * 86400, HL['Cu-67']))) * 100).toFixed(2),
    doubling: +(HL['Cu-67'] / 3600).toFixed(2),
    // 64Cu product: a 0.01 % 65Zn impurity grows to 1 % in this many hours (100-fold, 65Zn barely decaying).
    cu64HundredFold: +(timeTo(1, 0.01, HL['Cu-64']) / 3600).toFixed(1),
    cu67HundredFold: +(timeTo(1, 0.01, HL['Cu-67']) / 3600).toFixed(1),
  },
  carrierFree: {
    cu67TBqPerG: +(specific(HL['Cu-67'], 67).perGram / 1e12).toFixed(0),
    cu67EBqPerMol: +(specific(HL['Cu-67'], 67).perMol / 1e18).toFixed(3),
    cu67MeanLifeH: +(specific(HL['Cu-67'], 67).meanLife / 3600).toFixed(2),
    cu64TBqPerG: +(specific(HL['Cu-64'], 64).perGram / 1e12).toFixed(0),
    // The paper's calculated stable-copper companions at 52 MeV (65Cu/67Cu 0.13, 63Cu/67Cu 0.004) and at 40 MeV (0.05, 0.005).
    molar52: +(specific(HL['Cu-67'], 67).perMol / 1.134 / 1e18).toFixed(3),
    pct52: +(100 / 1.134).toFixed(1),
    pct40: +(100 / 1.055).toFixed(1),
  },
};

// Figure 1: what is left of each product during and after the separation.
const tHrs = Array.from({ length: 73 }, (_, i) => i);
const fig1 = chart({
  title: 'What survives the separation', xLabel: 'Hours after the end of irradiation', yLabel: 'Activity left (%)',
  series: [
    { name: 'Cu-67 (61.83 h)', kind: 'line', x: tHrs, y: tHrs.map((h) => +(100 * decay(1, h * 3600, HL['Cu-67'])).toFixed(2)) },
    { name: 'Cu-64 (12.70 h)', kind: 'line', x: tHrs, y: tHrs.map((h) => +(100 * decay(1, h * 3600, HL['Cu-64'])).toFixed(2)) },
    { name: 'Zn-65 (243.9 d)', kind: 'line', x: tHrs, y: tHrs.map((h) => +(100 * decay(1, h * 3600, HL['Zn-65'])).toFixed(2)), colour: 'var(--muted)', dash: '5 4' },
  ],
  xDomain: [0, 72], yDomain: [0, 101], vlines: [{ x: 8, text: '8 h separation' }],
  desc: 'The share of activity left against time for copper-67, copper-64 and zinc-65. At the eight-hour mark, where the paper finishes its chemistry, copper-67 is at 91.4 % and copper-64 at 64.6 %.', height: 290,
});

// Figure 2: the long-lived zinc-65 impurity measured against the shrinking product.
const days = Array.from({ length: 57 }, (_, i) => i * 0.25);
const ratio = (d, product) => (EOI['Zn-65'] * decay(1, d * 86400, HL['Zn-65'])) / (EOI[product] * decay(1, d * 86400, HL[product]));
const fig2 = chart({
  title: 'A long-lived impurity grows on its own', xLabel: 'Days after the end of irradiation', yLabel: 'Zn-65 as % of the product',
  series: [
    { name: 'In the Cu-67 product', kind: 'line', x: days, y: days.map((d) => +Math.log10(100 * ratio(d, 'Cu-67')).toFixed(4)) },
    { name: 'If the same Zn-65 sat with Cu-64', kind: 'line', x: days, y: days.map((d) => +Math.log10(100 * ratio(d, 'Cu-64')).toFixed(4)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 14], yDomain: [-0.8, 2.2],
  yTicks: [Math.log10(0.2), Math.log10(0.5), 0, 1, 2], yFmt: (v) => String(+Math.pow(10, v).toPrecision(2)),
  hlines: [{ y: 0, text: '1 %' }],
  desc: 'The zinc-65 impurity as a percentage of the product, against time. Zinc-65 hardly decays in two weeks, so the ratio climbs as the copper decays away.', height: 300,
});

console.log(JSON.stringify(out, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'survive', figure(fig1, 'Figure 1. Decay curves from the Decay calculator’s own maths, with the recommended half-lives. The dashed line marks the end of the paper’s eight-hour separation: copper-64 has already lost a third of its activity, copper-67 less than a tenth.'));
  md = inject(md, 'impurity', figure(fig2, 'Figure 2. The same amount of zinc-65 measured against each copper product, starting from the paper’s 52 MeV end-of-irradiation activities. Logarithmic scale.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
