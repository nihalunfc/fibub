// Figures for src/blog/discoveries/probiotic-lactobacilli-eggshell-membrane-gompertz-growth-rate.md, made with the maths of the
// OD600 growth curve tool (src/lib/sci/growthcurve.ts: Zwietering's Gompertz model, the tangent method and the model fit).
// Run: node scripts/blog-figures/probiotic-lactobacilli-eggshell-membrane-gompertz-growth-rate.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { analyse, zwietering, LN2 } from '../../src/lib/sci/growthcurve.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/probiotic-lactobacilli-eggshell-membrane-gompertz-growth-rate.md', import.meta.url);

// Inputs from Ozcan et al. (2026), Fermentation 12(11): 534, doi:10.3390/fermentation12110534 (CC BY), modified Gompertz for
// L. acidophilus LA-5 in the eggshell-membrane medium (ELA): A = 2.43 log10 CFU/mL, plateau 8.06 log10 CFU/mL, µmax 0.47 per h,
// lag 7.61 h, doubling time 1.46 h; sampling every 3 h from 0 to 24 h. Control (CLA): µmax 0.94 per h, doubling time 0.74 h.
const A10 = 2.43, TOP = 8.06, MU = 0.47, LAG = 7.61, Y0 = TOP - A10;
const LN10 = Math.LN10;
// Reading 1: µ is the slope on the log10 CFU scale (the scale A and the plateau are given on).
// Reading 2: µ is the slope on the natural-log scale. Both keep A and the lag.
const readings = [
  { key: 'log10', name: 'µ = 0.47 log10 units per h', mu10: MU },
  { key: 'ln', name: 'µ = 0.47 ln units per h', mu10: MU / LN10 },
];
const log10cfu = (r, t) => Y0 + zwietering('gompertz', t, A10, r.mu10, LAG);
const tS = Array.from({ length: 9 }, (_, i) => i * 3); // the paper's sampling times
const SCALE = 1e9; // CFU/mL typed as an "OD" by dividing by the tool's default factor of 1e9 cells/mL for OD 1
const out = readings.map((r) => {
  const od = tS.map((t) => 10 ** log10cfu(r, t) / SCALE);
  const res = analyse(r.name, tS, od, 0, { window: 3, minOd: 1e-4, model: 'gompertz' });
  return { ...r, od, res };
});

// Figure 1: the two readings of the same parameters, as smooth curves with the 3-hourly samples.
const tt = Array.from({ length: 97 }, (_, i) => i * 0.25);
const fig1 = chart({
  title: 'Same Gompertz parameters, two meanings of µ', xLabel: 'Hours', yLabel: 'log10 CFU/mL',
  series: [
    ...readings.map((r) => ({ name: r.name, kind: 'line', x: tt, y: tt.map((t) => +log10cfu(r, t).toFixed(3)) })),
    ...out.map((o, i) => ({ name: '', kind: 'dots', x: tS, y: o.od.map((v) => +Math.log10(v * SCALE).toFixed(3)), size: 3.5, noLegend: true, colour: i ? 'var(--c-tools)' : 'var(--c-blog)' })),
  ],
  xDomain: [0, 24], yDomain: [5.4, 8.3], xTicks: [0, 3, 6, 9, 12, 15, 18, 21, 24], vlines: [{ x: LAG, text: 'lag 7.61 h' }],
  desc: `Read as log10 units, the culture rises 2.43 logs in about ${(A10 / MU).toFixed(1)} h after the lag; read as ln units, it takes about ${(A10 / (MU / LN10)).toFixed(1)} h.`, height: 280,
});

const facts = out.map((o) => ({ key: o.key, tangentMu: o.res.mu.toFixed(4), tangentTd: o.res.td.toFixed(3), lag: o.res.lag.toFixed(2), gMu: o.res.model?.mu.toFixed(4), gTd: o.res.model?.td.toFixed(3), gLag: o.res.model?.lag.toFixed(3), gA: o.res.model?.A.toFixed(4), win: o.res.win.map((i) => tS[i]), warn: o.res.warn }));
console.log(JSON.stringify({ facts, td10: (Math.log10(2) / MU).toFixed(3), tdln: (LN2 / MU).toFixed(3), tdCLA10: (Math.log10(2) / 0.94).toFixed(3), tdCLAln: (LN2 / 0.94).toFixed(3), muLnIf10: (MU * LN10).toFixed(4), od: out.map((o) => o.od.map((v) => +v.toPrecision(3))) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. Simulated from the paper\'s Gompertz parameters for L. acidophilus in the eggshell-membrane medium, read two ways. Dots: the paper\'s 3-hourly sampling times. Not the measured plate counts.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
