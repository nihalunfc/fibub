// Figures for src/blog/discoveries/cacao-hptlc-catechin-egcg-rf-separation.md, made with the maths of the
// TLC Rf calculator (src/lib/sci/tlc.ts: rf, columnVolumes, separation, rfAdvice).
// Run: node scripts/blog-figures/cacao-hptlc-catechin-egcg-rf-separation.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { rf, columnVolumes, separation, rfAdvice } from '../../src/lib/sci/tlc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cacao-hptlc-catechin-egcg-rf-separation.md', import.meta.url);

// Inputs from the paper: Muppayyanamath et al. (2025), Front. Nutr. 12: 1537963 (CC BY 4.0).
// Development distance 70 mm; the abstract gives Rf 0.49 (catechin) and 0.23 (EGCG), the body 0.45 and 0.29.
const FRONT = 70;
const READINGS = [
  { id: 'abstract', ctn: 0.49, egcg: 0.23 },
  { id: 'body text', ctn: 0.45, egcg: 0.29 },
];
const rows = READINGS.map((r) => ({
  ...r,
  dCtn: +(r.ctn * FRONT).toFixed(1),
  dEgcg: +(r.egcg * FRONT).toFixed(1),
  cvCtn: +columnVolumes(r.ctn).toFixed(2),
  cvEgcg: +columnVolumes(r.egcg).toFixed(2),
  sep: separation(r.ctn, r.egcg),
  advice: [rfAdvice(r.ctn).text, rfAdvice(r.egcg).text],
}));

// Figure 1: the column volumes each Rf costs on a flash column with the same eluent.
const rfs = Array.from({ length: 91 }, (_, i) => 0.05 + i * 0.01);
const fig1 = chart({
  title: 'What an Rf costs on a flash column', xLabel: 'Rf', yLabel: 'Column volumes to elute (1/Rf)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: rfs, y: rfs.map((r) => +columnVolumes(r).toFixed(3)), colour: 'var(--ink)' },
    { name: 'Abstract reading', kind: 'dots', x: [rows[0].ctn, rows[0].egcg], y: [rows[0].cvCtn, rows[0].cvEgcg], size: 5 },
    { name: 'Body-text reading', kind: 'dots', x: [rows[1].ctn, rows[1].egcg], y: [rows[1].cvCtn, rows[1].cvEgcg], size: 5 },
  ],
  xDomain: [0.05, 0.95], yDomain: [0, 12], bands: [{ x0: 0.15, x1: 0.4, text: 'best for a column' }],
  desc: 'Column volumes against Rf. The four reported Rf values for catechin and EGCG need between 2.0 and 4.4 column volumes.',
  height: 270,
});

// Figure 2: Rf is a ratio, so it moves with the solvent-front reading. Fixed migration distances from the body text.
const fronts = Array.from({ length: 61 }, (_, i) => 60 + i * 0.5);
const fig2 = chart({
  title: 'Rf against the solvent-front reading', xLabel: 'Distance baseline to solvent front (mm)', yLabel: 'Rf',
  series: [
    { name: 'Catechin, 31.5 mm', kind: 'line', x: fronts, y: fronts.map((f) => +rf(31.5, 0, f).toFixed(4)) },
    { name: 'EGCG, 20.3 mm', kind: 'line', x: fronts, y: fronts.map((f) => +rf(20.3, 0, f).toFixed(4)) },
  ],
  xDomain: [60, 90], yDomain: [0.15, 0.55],
  hlines: [{ y: 0.49, text: 'abstract: catechin 0.49' }, { y: 0.23, text: 'abstract: EGCG 0.23' }],
  vlines: [{ x: 70, text: 'paper: 70 mm' }, { x: 64.3, text: '64.3', left: true, dy: 28 }, { x: 88.3, text: '88.3', left: true, dy: 42 }],
  desc: 'Rf against the assumed solvent-front distance for migration distances of 31.5 and 20.3 mm. The abstract values would need fronts of 64.3 mm and 88.3 mm.',
  height: 280,
});

console.log(JSON.stringify(rows.map((r) => ({ ...r, sep: { dRf: +r.sep.dRf.toFixed(3), dCV: +r.sep.dCV.toFixed(2) }, gapMm: +((r.ctn - r.egcg) * FRONT).toFixed(1) })), null, 1));
console.log('front for catechin 0.49 from 31.5 mm:', (31.5 / 0.49).toFixed(1), 'mm; for EGCG 0.23 from 20.3 mm:', (20.3 / 0.23).toFixed(1), 'mm');

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cv', figure(fig1, 'Figure 1. Column volumes needed to elute a compound on a flash column packed with the same silica and eluent, 1/Rf, against Rf. The dots are the paper\'s two readings for catechin (higher Rf) and EGCG. The shaded strip is the 0.15 to 0.40 window the tool calls best for a column.'));
  md = inject(md, 'front', figure(fig2, 'Figure 2. Rf is a ratio, so it moves with the solvent-front reading. Holding the migration distances from the body text (31.5 mm and 20.3 mm) fixed, the abstract\'s Rf values would need solvent fronts of 64.3 mm and 88.3 mm: the two disagreements pull in opposite directions, so one misread front cannot explain them.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
