// Figures for src/blog/discoveries/m33-muse-mosaic-pointings-field-of-view-coverage.md, made with the maths of the
// Mosaic planner (src/lib/sci/mosaic.ts: fovArcmin, framesAlong, mosaic).
// Run: node scripts/blog-figures/m33-muse-mosaic-pointings-field-of-view-coverage.mjs
import fs from 'node:fs';
import { fovArcmin, framesAlong, mosaic } from '../../src/lib/sci/mosaic.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/m33-muse-mosaic-pointings-field-of-view-coverage.md', import.meta.url);

// From the paper: Feltre et al. (2026), A&A 706: A367, doi:10.1051/0004-6361/202557122 (CC BY 4.0).
// VLT/MUSE wide-field mode, 1 x 1 arcmin per pointing, 0.2" spaxels, 24 pointings in strips of 3 at a position
// angle 22 degrees east of north, 2" overlap between contiguous pointings, "3 x 8 arcmin^2" of M33,
// 2 x 340 s per pointing plus a 120 s sky exposure per 3-pointing block, M33 at 840 kpc (4.0 pc per arcsec).
const P = { fov: 1, overlapArcsec: 2, nPanels: 24, strips: 8, perStrip: 3, nominal: [3, 8], pa: 22, expS: 2 * 340, skyS: 120, dist: 840, scale: 4.0 };
const ov = P.overlapArcsec / 60 / P.fov; // overlap as a fraction of the field of view
// M33's centre and size from the tool's own OpenNGC entry (CC BY-SA 4.0): "M33 / NGC 598", 23.46204 deg, +30.66022 deg, 62.09'.
const M33 = { ra: 23.46204, dec: 30.66022, size: 62.09 };

// What 3 and 8 panels of 1 arcmin with a 2" overlap actually cover: n*f - (n-1)*f*o.
const covers = (n) => n * P.fov - (n - 1) * P.fov * ov;
const real = [covers(P.perStrip), covers(P.strips)];
const fit = [framesAlong(real[0], P.fov, ov), framesAlong(real[1], P.fov, ov)];          // must be 3 and 8
const nominalFit = [framesAlong(P.nominal[0], P.fov, ov), framesAlong(P.nominal[1], P.fov, ov)]; // to cover a full 3 x 8

// The layout the tool draws for the paper's mosaic.
const lay = mosaic({ ra: M33.ra, dec: M33.dec, tw: real[1], th: real[0], fw: P.fov, fh: P.fov, overlap: ov, pa: P.pa });

// A full map of M33 at the same depth.
const wholeSide = framesAlong(M33.size, P.fov, ov);
const wholeDisc = Math.round((Math.PI / 4) * wholeSide * wholeSide);
const hoursPerPanel = (P.expS + P.skyS / P.perStrip) / 3600;

// Figure 1: panels needed against the overlap, for the paper's nominal box and for what 24 panels really cover.
const OVS = Array.from({ length: 61 }, (_, i) => i * 0.5); // 0 to 30 per cent
const panelsFor = (tw, th) => OVS.map((pc) => framesAlong(tw, P.fov, pc / 100) * framesAlong(th, P.fov, pc / 100));
const fig1 = chart({
  title: 'Panels needed, against the overlap you choose', xLabel: 'Overlap between panels (%)', yLabel: 'Panels of 1′ × 1′',
  series: [
    { name: 'to cover a full 3′ × 8′', kind: 'line', x: OVS, y: panelsFor(P.nominal[0], P.nominal[1]) },
    { name: 'to cover 2.93′ × 7.77′ (what 24 panels give)', kind: 'line', x: OVS, y: panelsFor(real[0], real[1]) },
  ],
  xDomain: [0, 30], yDomain: [20, 80], hlines: [{ y: 24, text: 'the paper’s 24 pointings' }],
  vlines: [{ x: (ov * 100), text: '2″ = 3.3 %' }, { x: 15, text: 'tool default 15 %', dy: 14 }],
  desc: 'Two rising step curves. At the paper’s 3.3 per cent overlap, 24 panels cover 2.93 by 7.77 arcminutes, while covering a full 3 by 8 arcminutes takes 36.',
  height: 290,
});

// Figure 2: the 24 panel centres the tool places, in arcminute offsets east and north of the mosaic centre.
const fig2 = chart({
  title: 'The 24 panel centres, tilted 22° east of north', xLabel: 'Offset east, ξ (arcmin)', yLabel: 'Offset north, η (arcmin)',
  series: [
    { name: '', noLegend: true, kind: 'dots', x: lay.panels.map((p) => p.xi), y: lay.panels.map((p) => p.eta), size: 4 },
  ],
  xDomain: [-4.5, 4.5], yDomain: [-4.5, 4.5],
  desc: 'Twenty-four dots in a three-by-eight grid tilted 22 degrees east of north, the panel centres the Mosaic planner places for the paper’s mosaic.',
  height: 300,
});

console.log(JSON.stringify({
  fovCheck: { oneMmAt3438: +fovArcmin(1, 3438).toFixed(5), paperFov: P.fov },
  overlapFraction: +(ov * 100).toFixed(4),
  realCover: real.map((v) => +v.toFixed(4)), fit, panelsFit: fit[0] * fit[1],
  nominalFit, panelsNominal: nominalFit[0] * nominalFit[1],
  coveredArcmin2: +(real[0] * real[1]).toFixed(3), nominalArcmin2: P.nominal[0] * P.nominal[1],
  lostPercent: +(100 * (1 - (real[0] * real[1]) / (P.nominal[0] * P.nominal[1]))).toFixed(1),
  mosaicCover: [+lay.coverW.toFixed(4), +lay.coverH.toFixed(4)], cols: lay.cols, rows: lay.rows,
  pcSide: real.map((v) => Math.round(v * 60 * P.scale)), pcArea: +(real[0] * 60 * P.scale * real[1] * 60 * P.scale / 1e6).toFixed(3),
  firstPanels: lay.panels.slice(0, 3).map((p) => ({ row: p.row, col: p.col, ra: +p.ra.toFixed(5), dec: +p.dec.toFixed(5) })),
  raSpanArcmin: +((Math.max(...lay.panels.map((p) => p.ra)) - Math.min(...lay.panels.map((p) => p.ra))) * 60 * Math.cos((M33.dec * Math.PI) / 180)).toFixed(3),
  wholeSide, wholeDisc, hoursPerPanel: +hoursPerPanel.toFixed(3), hours24: +(24 * hoursPerPanel).toFixed(2), hoursWhole: Math.round(wholeDisc * hoursPerPanel),
  fractionOfM33: +(100 * (real[0] * real[1]) / ((Math.PI / 4) * M33.size ** 2)).toFixed(2),
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'panels', figure(fig1, 'Figure 1. How many 1′ × 1′ panels the Mosaic planner asks for, against the overlap. The paper’s 2″ overlap is 3.3 % of the field; 24 panels at that overlap cover 2.93′ × 7.77′, while a full 3′ × 8′ would take 36.'));
  md = inject(md, 'layout', figure(fig2, 'Figure 2. The panel centres the Mosaic planner places for a 3 × 8 mosaic of 1′ fields at a position angle of 22° east of north, as arcminute offsets from the mosaic centre. The tool also gives each one’s RA and Dec.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
