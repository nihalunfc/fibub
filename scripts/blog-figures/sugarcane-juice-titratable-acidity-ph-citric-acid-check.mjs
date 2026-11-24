// Figures for src/blog/discoveries/sugarcane-juice-titratable-acidity-ph-citric-acid-check.md, made with the maths
// of the Titration curve simulator (src/lib/sci/titration.ts: alphas, pHAt, curve, equivalenceVolumes,
// indicatorsFor, endpoints).
// Run: node scripts/blog-figures/sugarcane-juice-titratable-acidity-ph-citric-acid-check.mjs
import fs from 'node:fs';
import { alphas, pHAt, curve, equivalenceVolumes, indicatorsFor, endpoints, PRESETS } from '../../src/lib/sci/titration.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sugarcane-juice-titratable-acidity-ph-citric-acid-check.md', import.meta.url);

// Inputs from the paper: Ed-Dra et al. (2025), Front. Sustain. Food Syst. 9: 1628211 (CC BY 4.0).
// 100 street-vendor sugarcane juices, Beni Mellal, Morocco: pH 5.23 +- 0.09, titratable acidity 0.16 +- 0.02 %
// as citric acid equivalents (AOAC 942.15, 0.1 M NaOH, factor 0.070), total soluble solids 18.48 +- 0.69 Brix.
const PH = 5.23, TA_PCT = 0.16, FACTOR = 0.070, CNaOH = 0.1, VS = 10;   // 10 mL sample: OUR choice
const pKa = PRESETS.find((p) => p.id === 'citric').pKa;                 // 3.13, 4.76, 6.40
const M_CITRIC_H2O = 210.14;                                            // citric acid monohydrate, the basis of the 0.070 factor

// Protons still bound per citrate at a given pH (0 to 3), from the tool's species fractions.
const bound = (pH) => { const a = alphas(10 ** -pH, pKa); return 3 - a.reduce((s, x, i) => s + i * x, 0); };
const lost = (pH) => 3 - bound(pH);

const meqPerL = (TA_PCT / FACTOR) * 10;                 // 22.857 meq of NaOH per litre of juice
const END = 8.1;                                        // the AOAC end point
const CTOT = meqPerL / 1000 / (lost(END) - lost(PH));   // total citrate the pH and the acidity imply together
const C = 0.0194;                                       // rounded for the worked example
const NA = C * lost(PH);                                // the sodium (and potassium) already neutralising it

// What the reported acidity would mean if the juice held that much FREE citric acid.
const free = { kind: 'acid', pKa, conc: meqPerL / 3 / 1000, volume: VS };
const model = { kind: 'acid', pKa, conc: C, volume: VS };
const t = { conc: CNaOH };
const volAt = (a, ph) => { let lo = 0, hi = 20; for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; pHAt(a, t, m) < ph ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const vJuice = volAt(model, PH), vEnd = volAt(model, END);
const taBack = ((vEnd - vJuice) * CNaOH * 1000) / VS;   // meq/L recovered from the model
const veq = equivalenceVolumes(model, t);

// Figure 1: the citric-acid curve, with the juice's own place on it and the AOAC end point.
const cv = curve(model, t, veq[2] * 1.5, 500);
const fig1 = chart({
  title: 'Where a sugarcane juice sits on a citric acid curve', xLabel: 'Volume of 0.1 M NaOH added to 10 mL (mL)', yLabel: 'pH',
  series: [{ name: '', noLegend: true, kind: 'line', x: cv.v, y: cv.pH.map((p) => +p.toFixed(3)), colour: 'var(--c-blog)' }],
  xDomain: [0, veq[2] * 1.5], yDomain: [2, 12],
  bands: [{ x0: +vJuice.toFixed(3), x1: +vEnd.toFixed(3), text: 'what the acidity test measures' }],
  hlines: [{ y: PH, text: `juice pH ${PH}` }, { y: END, text: `end point pH ${END}` }],
  vlines: [{ x: +veq[2].toFixed(3), text: `3rd equivalence ${veq[2].toFixed(2)} mL`, left: true }],
  desc: 'The calculated titration curve of 10 mL of 19.4 mM citric acid with 0.1 M sodium hydroxide. The juice\'s own pH of 5.23 sits part way along it, and the shaded strip is the stretch the titratable-acidity test measures.',
  height: 290,
});

// Figure 2: how much extra citric acid would acidify the juice, holding the neutralising cations fixed.
const phs = Array.from({ length: 106 }, (_, i) => 5.3 - i * 0.02);
const added = phs.map((p) => { const H = 10 ** -p, OH = 1e-14 / H; return ((NA + H - OH) / lost(p) - C) * M_CITRIC_H2O; });
const addAt = (target) => { const H = 10 ** -target, OH = 1e-14 / H; return ((NA + H - OH) / lost(target) - C) * M_CITRIC_H2O; };
const fig2 = chart({
  title: 'Citric acid needed to acidify the juice', xLabel: 'Citric acid monohydrate added (g per litre)', yLabel: 'pH',
  series: [{ name: '', noLegend: true, kind: 'line', x: added.map((x) => +x.toFixed(4)), y: phs.map((p) => +p.toFixed(3)), colour: 'var(--c-blog)' }],
  xDomain: [0, 6], yDomain: [3.2, 5.4],
  hlines: [{ y: 4.5, text: 'pH 4.5' }, { y: 4.0, text: 'pH 4.0' }],
  vlines: [{ x: +addAt(4.5).toFixed(2), text: `${addAt(4.5).toFixed(2)} g/L` }, { x: +addAt(4).toFixed(2), text: `${addAt(4).toFixed(2)} g/L` }],
  desc: 'Calculated pH of the juice model against the amount of citric acid monohydrate added, holding the neutralising cations fixed. Reaching pH 4.0 takes about 3.1 g per litre.',
  height: 285,
});

console.log(JSON.stringify({
  meqPerL: +meqPerL.toFixed(3), lostAtJuice: +lost(PH).toFixed(4), lostAtEnd: +lost(END).toFixed(4),
  fractionNeutralised: +((lost(PH) / 3) * 100).toFixed(1),
  impliedTotalCitrate_mM: +(CTOT * 1000).toFixed(2), rounded_mM: C * 1000, sodium_mM: +(NA * 1000).toFixed(2),
  freeAcidModel: { conc_mM: +(free.conc * 1000).toFixed(2), pH: +pHAt(free, t, 0).toFixed(2) },
  model: { startPH: +pHAt(model, t, 0).toFixed(2), eq: veq.map((v) => +v.toFixed(2)), eqPH: veq.map((v) => +pHAt(model, t, v).toFixed(2)) },
  vJuice: +vJuice.toFixed(3), vEnd: +vEnd.toFixed(3), taRecovered_meqPerL: +taBack.toFixed(2), taRecovered_pct: +((taBack / 10) * FACTOR).toFixed(4),
  endPointBias_pct: +(((vEnd - veq[2]) / veq[2]) * 100).toFixed(2),
  indicators: indicatorsFor(model, t, veq[2]).map((i) => `${i.name} ${i.error.toFixed(2)} %`),
  derivativeEndpoint: endpoints(cv.v, cv.pH, 1).map((e) => ({ v: +e.volume.toFixed(3), pH: +e.pH.toFixed(2) })),
  acidToAdd: [4.5, 4.0, 3.5].map((p) => ({ pH: p, gPerL: +addAt(p).toFixed(2) })),
  halfway: [0.5, 1.5, 2.5].map((k) => ({ v: +((k * C * VS) / CNaOH).toFixed(2), pH: +pHAt(model, t, (k * C * VS) / CNaOH).toFixed(2) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, 'Figure 1. The calculated titration curve of 10 mL of 19.4 mM citric acid with 0.1 M sodium hydroxide, the juice model built from the paper\'s pH and acidity. The juice itself sits at 3.50 mL on this curve, where the pH is 5.23; the titratable-acidity test measures the shaded stretch from there to pH 8.1. Calculated at 25 °C without activity corrections.'));
  md = inject(md, 'acidify', figure(fig2, 'Figure 2. How much citric acid monohydrate the same juice model needs to reach a given pH, with its neutralising cations held fixed. About 1.5 g per litre reaches pH 4.5 and 3.1 g per litre reaches pH 4.0. Our model, not a measurement.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
