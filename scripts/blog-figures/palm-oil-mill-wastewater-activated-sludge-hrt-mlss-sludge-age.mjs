// Figures for src/blog/discoveries/palm-oil-mill-wastewater-activated-sludge-hrt-mlss-sludge-age.md, made with the
// maths of the Activated sludge sizer (src/lib/sci/asludge.ts: size, effluentS, minSrt).
// Run: node scripts/blog-figures/palm-oil-mill-wastewater-activated-sludge-hrt-mlss-sludge-age.mjs
import fs from 'node:fs';
import { size, effluentS, minSrt } from '../../src/lib/sci/asludge.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/palm-oil-mill-wastewater-activated-sludge-hrt-mlss-sludge-age.md', import.meta.url);

// From Jagaba et al. (2023), Agriculture 13(8): 1531, doi:10.3390/agriculture13081531 (CC BY 4.0): a 10 L reactor
// with 7.5 L of working volume fed continuously; hydraulic retention time 1 to 3 days, best 2; MLSS 4,000 to 6,000
// mg/L, best 5,000; influent BOD5 4,486 mg/L and COD 6,649 mg/L; removal 84.66 % of BOD5 and 72.07 % of COD.
const P = { volume: 0.0075, hrtBest: 2, hrtRange: [1, 3], mlssBest: 5000, mlssRange: [4000, 6000], bod: 4486, cod: 6649, bodRemoval: 84.66, codRemoval: 72.07 };
// Kinetic coefficients: the tool's own defaults for municipal wastewater (OUR assumption; the paper reports none).
const KIN = { Y: 0.6, kd: 0.1, fd: 0.15, mumax: 5, Ks: 40, vssRatio: 0.85, bcodRatio: 1.6, ote: 0.1, Xr: 8000, nbVSS: 0, iTSS: 0 };
const flowFor = (hrt) => P.volume / hrt; // m3/d from the reactor volume and the retention time
const run = (hrt, srt, mlss) => size({ ...KIN, Q: flowFor(hrt), S0: P.bod, srt, mlss });
// The sludge age that holds a given MLSS in this reactor at a given retention time.
function srtFor(hrt, mlss) {
  let lo = 0.25, hi = 400;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; run(hrt, m, mlss).V < P.volume ? (lo = m) : (hi = m); }
  return (lo + hi) / 2;
}
const srtBest = srtFor(P.hrtBest, P.mlssBest);
const r = run(P.hrtBest, srtBest, P.mlssBest);
const window = { low: srtFor(P.hrtBest, P.mlssRange[0]), high: srtFor(P.hrtBest, P.mlssRange[1]) };

const best = {
  flowLitres: +(flowFor(P.hrtBest) * 1000).toFixed(2), srt: +srtBest.toFixed(2), hrtHours: +r.hrt.toFixed(1),
  solubleBod: +r.S.toFixed(2), solubleRemoval: +(100 * (1 - r.S / P.bod)).toFixed(2),
  fm: +r.fm.toFixed(3), olr: +r.olr.toFixed(2), mlvss: Math.round(r.mlvss),
  bodRemovedGrams: +(r.removed * 1000).toFixed(2), sludgeGrams: +(r.pxTSS * 1000).toFixed(2), yobs: +r.yobs.toFixed(3),
  oxygenGrams: +(r.o2 * 1000).toFixed(2), airLitresMin: +(r.airM3min * 1000).toFixed(3),
  recyclePct: +(100 * r.R).toFixed(0), wasteLitres: +(r.Qw * 1000).toFixed(2), washoutSrt: +minSrt({ ...KIN, S0: P.bod }).toFixed(3),
};
const measured = { bod: +(P.bod * (1 - P.bodRemoval / 100)).toFixed(0), cod: +(P.cod * (1 - P.codRemoval / 100)).toFixed(0) };
measured.bodCodIn = +(P.bod / P.cod).toFixed(3);
measured.bodCodOut = +(measured.bod / measured.cod).toFixed(3);
measured.nonBiodegradableShare = +(100 - P.bodRemoval).toFixed(2);

// Figure 1: the MLSS each sludge age holds in this 7.5 L reactor, for the paper's three retention times.
const SRT = Array.from({ length: 60 }, (_, i) => 1 + i * 0.5);
const mlssHeld = (hrt) => SRT.map((s) => { const x = size({ ...KIN, Q: flowFor(hrt), S0: P.bod, srt: s, mlss: 5000 }); return +((x.pxTSS * s * 1000) / P.volume).toFixed(0); });
const fig1 = chart({
  title: 'What sludge age holds 5,000 mg/L in a 7.5 L reactor', xLabel: 'Sludge age, SRT (days)', yLabel: 'MLSS held in the reactor (mg/L)',
  series: [
    { name: 'HRT 1 day', kind: 'line', x: SRT, y: mlssHeld(1), colour: 'var(--ink)', dash: '5 4' },
    { name: 'HRT 2 days (the paper’s best)', kind: 'line', x: SRT, y: mlssHeld(2) },
    { name: 'HRT 3 days', kind: 'line', x: SRT, y: mlssHeld(3), colour: 'var(--c-tools)' },
  ],
  xDomain: [1, 20], yDomain: [0, 20000], yFmt: (v) => (v / 1000).toFixed(0) + 'k',
  hlines: [{ y: P.mlssBest, text: 'paper: 5,000 mg/L' }],
  vlines: [{ x: +srtBest.toFixed(2), text: `${srtBest.toFixed(1)} d`, dy: 16 }],
  desc: `The solids a 7.5 litre reactor holds against sludge age for retention times of one, two and three days. At the paper's two-day retention time, 5,000 mg/L needs a sludge age of about ${srtBest.toFixed(1)} days.`,
  height: 300,
});

// Figure 2: soluble BOD removal from Monod against sludge age, with the paper's measured removal.
const removal = SRT.map((s) => +(100 * (1 - Math.min(P.bod, effluentS({ srt: s, mumax: KIN.mumax, kd: KIN.kd, Ks: KIN.Ks })) / P.bod)).toFixed(3));
const fig2 = chart({
  title: 'Soluble BOD removal: the model against the measurement', xLabel: 'Sludge age, SRT (days)', yLabel: 'BOD removed (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: SRT, y: removal }],
  xDomain: [1, 20], yDomain: [80, 101], yFmt: (v) => v.toFixed(0),
  hlines: [{ y: P.bodRemoval, text: 'paper: 84.66 % measured' }, { y: 99.9, text: '' }],
  vlines: [{ x: +srtBest.toFixed(2), text: `${srtBest.toFixed(1)} d`, dy: 30 }],
  desc: `Monod kinetics with municipal coefficients predict more than 99.9 per cent removal of the soluble BOD at any sludge age above one day, far above the paper's measured 84.66 per cent, so the residue is not soluble biodegradable BOD.`,
  height: 290,
});

console.log(JSON.stringify({ best, window: { low: +window.low.toFixed(2), high: +window.high.toFixed(2) }, measured, removalAt: { 2: removal[2], 10: removal[18] } }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mlss', figure(fig1, 'Figure 1. Mixed liquor solids held in the paper’s 7.5 litre reactor against sludge age, worked out with the Activated sludge sizer’s own mass balance for its three retention times. The paper’s chosen 5,000 mg/L at a two-day retention time implies a sludge age of about four days.'));
  md = inject(md, 'removal', figure(fig2, 'Figure 2. Soluble BOD removal predicted by the tool’s Monod kinetics against sludge age, with the paper’s measured 84.66 % for comparison. The gap is the part of the load the biology cannot reach.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
