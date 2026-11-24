// Figures for src/blog/discoveries/lime-wheat-husk-ash-clay-subgrade-compaction-checks.md, made with the maths of the
// Atterberg limits tool (src/lib/sci/atterberg.ts) and the soil classification tool (src/lib/sci/soilclass.ts).
// Run: node scripts/blog-figures/lime-wheat-husk-ash-clay-subgrade-compaction-checks.mjs
import fs from 'node:fs';
import { indices, dryDensity, airVoids, saturation, compaction } from '../../src/lib/sci/atterberg.ts';
import { aLine, uLine, finesGroup, groupIndex } from '../../src/lib/sci/soilclass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lime-wheat-husk-ash-clay-subgrade-compaction-checks.md', import.meta.url);

// Inputs from the paper: Adekanle et al. (2026), Frontiers in Built Environment 12: 1768387,
// doi:10.3389/fbuil.2026.1768387 (CC BY 4.0). Index properties of the natural lateritic clay subgrade and the
// compaction results; densities in Mg/m3 here (the paper gives kg/m3).
const LL = 50.1, PL = 24.76, PI_PAPER = 25.34, CLAY = 25.52, FINES = 57.86, GS_PAPER = 2.12;
const MDD = 1.739, OMC = 17.8, MDD_BEST = 1.798, PI_BEST = 10.83, GI_PAPER = 156;

const ix = indices(LL, PL, undefined, CLAY);
const fg = finesGroup(LL, ix.PI, false);
const gi = groupIndex(FINES, LL, ix.PI, 'A-7-6');
// Specific gravity that the compaction result demands: dry density cannot pass the zero-air-voids line.
const gsNeeded = MDD / (1 - (OMC / 100) * MDD);
const satAt = (Gs) => saturation(OMC, MDD, Gs);
const airAt = (Gs) => 1 - MDD / airVoids(OMC, Gs);

// OUR OWN three-point compaction curve, built to peak exactly at the paper's reported maximum (a parabola losing
// 10 kg/m3 per (percent water)^2), so the tool's peak finder and its zero-air-voids check have something to chew on.
const WS = [15.8, 17.8, 19.8], RD = WS.map((w) => +(MDD - 0.010 * (w - OMC) ** 2).toFixed(4));
const BULK = WS.map((w, i) => +(RD[i] * (1 + w / 100)).toFixed(4));
const fit = compaction(WS, BULK.map((b, i) => dryDensity(b, WS[i])), 2);

const ww = Array.from({ length: 61 }, (_, i) => 10 + i * 0.25);
const fig1 = chart({
  title: 'The clay subgrade on the compaction plane', xLabel: 'Water content w (%)', yLabel: 'Dry density (Mg/m³)',
  series: [
    { name: 'Zero air voids, Gs 2.12', kind: 'line', x: ww, y: ww.map((w) => +airVoids(w, GS_PAPER).toFixed(4)), dash: '5 4' },
    { name: 'Gs 2.52', kind: 'line', x: ww, y: ww.map((w) => +airVoids(w, +gsNeeded.toFixed(3)).toFixed(4)), dash: '2 3', colour: 'var(--muted)' },
    { name: 'Gs 2.65', kind: 'line', x: ww, y: ww.map((w) => +airVoids(w, 2.65).toFixed(4)), dash: '5 4', colour: 'var(--c-tools)' },
    { name: 'Reported peak', kind: 'dots', x: [OMC, OMC], y: [MDD, MDD_BEST], size: 5, colour: 'var(--ink)' },
    { name: '', noLegend: true, kind: 'line', x: ww.filter((w) => w >= 13 && w <= 22.6), y: ww.filter((w) => w >= 13 && w <= 22.6).map((w) => +(MDD - 0.010 * (w - OMC) ** 2).toFixed(4)), colour: 'var(--ink)' },
  ],
  xDomain: [10, 25], yDomain: [1.3, 2.1],
  desc: 'Zero-air-voids lines for three specific gravities against water content, with the paper’s reported maximum dry densities. The reported peak lies above the line for the specific gravity the paper reports, which is impossible.', height: 265,
});

const gss = Array.from({ length: 81 }, (_, i) => 2.0 + i * 0.01);
const fig2 = chart({
  title: 'Degree of saturation at the optimum, against specific gravity', xLabel: 'Specific gravity of solids Gs', yLabel: 'Saturation at the optimum (%)',
  series: [{ name: 'S at w = 17.8 %, ρd = 1.739 Mg/m³', kind: 'line', x: gss, y: gss.map((g) => +(satAt(g) * 100).toFixed(2)) }],
  xDomain: [2.0, 2.8], yDomain: [60, 220],
  hlines: [{ y: 100, text: 'full saturation' }, { y: 90, text: 'typical Proctor optimum, 80 to 90 %' }],
  vlines: [{ x: GS_PAPER, text: 'paper, 2.12' }, { x: +gsNeeded.toFixed(3), text: gsNeeded.toFixed(2) + ' minimum', dy: 16 }],
  desc: 'Degree of saturation worked out from the paper’s maximum dry density and optimum water content, as a function of the assumed specific gravity of the solids. It passes 100 per cent below 2.52.', height: 260,
});

console.log(JSON.stringify({
  PI: +ix.PI.toFixed(2), paperPI: PI_PAPER, activity: +ix.A.toFixed(3), aLine: +aLine(LL).toFixed(2), uLine: +uLine(LL).toFixed(2),
  uscs: fg.g, why: fg.why, GI: gi.GI, giRaw: +gi.raw.toFixed(2), paperGI: GI_PAPER,
  gsNeeded: +gsNeeded.toFixed(3), satPaperGs: +(satAt(GS_PAPER) * 100).toFixed(1), airPaperGs: +(airAt(GS_PAPER) * 100).toFixed(1),
  sat265: +(satAt(2.65) * 100).toFixed(1), sat270: +(satAt(2.7) * 100).toFixed(1), zav212: +airVoids(OMC, GS_PAPER).toFixed(4),
  piDrop: +((100 * (PI_PAPER - PI_BEST)) / PI_PAPER).toFixed(1), mddGain: +((100 * (MDD_BEST - MDD)) / MDD).toFixed(1),
  curve: { WS, RD, BULK, wOpt: +fit.wOpt.toFixed(2), rhoMax: +fit.rhoMax.toFixed(4), r2: +fit.r2.toFixed(4) },
}, null, 0));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'zav', figure(fig1, 'Figure 1. Zero-air-voids lines for three specific gravities, drawn with the Atterberg limits tool’s own phase relations, and the paper’s two reported maximum dry densities (black dots, with our parabola through the natural-soil peak). Both dots sit above the line for the specific gravity of 2.12 the paper reports, which no real soil can do.'));
  md = inject(md, 'sat', figure(fig2, 'Figure 2. The degree of saturation implied by the reported peak (17.8 % water, 1.739 Mg/m³) for each assumed specific gravity. Below Gs = 2.52 the saturation passes 100 %, which is impossible; a lateritic clay at Gs = 2.65 sits at 90 %, exactly where a Proctor optimum belongs.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
