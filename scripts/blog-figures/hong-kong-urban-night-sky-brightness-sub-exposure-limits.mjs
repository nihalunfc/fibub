// Figures for src/blog/discoveries/hong-kong-urban-night-sky-brightness-sub-exposure-limits.md, made with the
// maths of the Sub-exposure calculator (src/lib/sci/subexp.ts: skyFromSqm, subLength, efficiency).
// Run: node scripts/blog-figures/hong-kong-urban-night-sky-brightness-sub-exposure-limits.mjs
import fs from 'node:fs';
import { skyFromSqm, subLength, efficiency } from '../../src/lib/sci/subexp.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hong-kong-urban-night-sky-brightness-sub-exposure-limits.md', import.meta.url);

// From the paper: So, Pun and Liu (2026), Remote Sensing 18(11): 1691, doi:10.3390/rs18111691 (CC BY).
// It reports how many times brighter than the IAU dark-sky standard (21.6 mag/arcsec²) each group of stations is.
const IAU = 21.6;
const magOf = (ratio) => IAU - 2.5 * Math.log10(ratio);
const SITES = [
  { id: 'KP (densest urban)', ratio: 250 },
  { id: 'Urban average', ratio: 119 },
  { id: 'All stations', ratio: 43 },
  { id: 'Suburban average', ratio: 9 },
  { id: 'AP (darkest station)', ratio: 6 },
  { id: 'IAU dark-sky standard', ratio: 1 },
].map((s) => ({ ...s, sqm: +magOf(s.ratio).toFixed(2) })); // rounded to 0.01 mag, the figure a reader would type

// OUR assumed rig: the tool's own defaults, a common small refractor and a modern cooled CMOS camera.
const RIG = { apertureMm: 80, obstructionPct: 0, focalMm: 480, pixelUm: 3.76, qe: 0.8, throughput: 0.8 };
const RN = 1.5, DARK = 0, PEN = 0.05;
const BANDS = [{ nm: 100, label: 'Red, green or blue (100 nm)' }, { nm: 7, label: 'Narrowband 7 nm' }];
const sky = (sqm, nm) => skyFromSqm({ ...RIG, sqm, bandwidthNm: nm });
const sub = (sqm, nm) => subLength(RN, sky(sqm, nm), DARK, PEN);

const rows = SITES.map((s) => ({
  ...s,
  skyRGB: +sky(s.sqm, 100).toPrecision(4), subRGB: sub(s.sqm, 100),
  skyNB: +sky(s.sqm, 7).toPrecision(4), subNB: sub(s.sqm, 7),
}));

// The late-minus-early step the paper measures at its two brightest urban stations (magnitudes).
const STEPS = [{ id: 'TST, 2010-2013', step: 1.71 }, { id: 'TST, 2019-2023', step: 1.38 }, { id: 'KP, 2010-2013', step: 1.00 }, { id: 'KP, 2019-2023', step: 0.75 }]
  .map((s) => ({ ...s, factor: +(10 ** (0.4 * s.step)).toFixed(2) }));

// Figure 1: shortest useful sub against sky brightness, for broadband and narrowband.
const mags = Array.from({ length: 141 }, (_, i) => 15 + i * 0.05);
const fig1 = chart({
  title: 'Shortest useful sub against sky brightness', xLabel: 'Sky brightness (mag/arcsec²)', yLabel: 'Shortest sub (s), log scale',
  series: BANDS.map((b) => ({ name: b.label, kind: 'line', x: mags, y: mags.map((m) => Math.log10(sub(m, b.nm))) })),
  yFmt: (v) => (10 ** v >= 1 ? String(+(10 ** v).toPrecision(2)) : (10 ** v).toPrecision(2)),
  yDomain: [Math.log10(0.2), Math.log10(3000)], yTicks: [-0.699, 0, 1, 2, 3],
  xDomain: [15, 22],
  vlines: [
    { x: rows[0].sqm, text: 'KP', dy: 0 },
    { x: rows[1].sqm, text: 'urban', dy: 14 },
    { x: rows[3].sqm, text: 'suburban', dy: 0 },
    { x: IAU, text: 'IAU', left: true, dy: 14 },
  ],
  desc: `Shortest sub that keeps read noise within 5 per cent, against sky brightness, for an 80 mm f/6 refractor and a 1.5 electron read noise camera. In Hong Kong's densest urban sky it is under a second in colour, and about ${Math.round(rows[0].subNB)} seconds in 7 nanometre narrowband.`,
  height: 290,
});

// Figure 2: what each sub length is worth in a fixed total time, at the paper's urban and suburban sky levels.
const ts = Array.from({ length: 121 }, (_, i) => 10 ** (-1 + (i * 4) / 120));
const pick = [rows[1], rows[3], rows[5]];
const fig2 = chart({
  title: 'What each sub length is worth (7 nm narrowband)', xLabel: 'Sub length (s), log scale', yLabel: 'Signal-to-noise reached (%)',
  series: pick.map((s) => ({ name: `${s.id.replace(' average', '')} ${s.sqm.toFixed(1)}`, kind: 'line', x: ts.map((t) => Math.log10(t)), y: ts.map((t) => +(efficiency(t, RN, sky(s.sqm, 7), DARK) * 100).toFixed(2)) })),
  xFmt: (v) => (10 ** v >= 1 ? String(+(10 ** v).toPrecision(2)) : (10 ** v).toPrecision(1)),
  xDomain: [-1, 3], xTicks: [-1, 0, 1, 2, 3], yDomain: [0, 100],
  hlines: [{ y: 100 / 1.05, text: '95 %: the 5 % rule' }],
  vlines: pick.map((s, k) => ({ x: +Math.log10(sub(s.sqm, 7)).toFixed(3), text: `${Math.ceil(sub(s.sqm, 7))} s`, dy: k * 14, left: k === 2 })),
  desc: 'Share of the ideal signal-to-noise reached in a fixed total time, against sub length, for three sky levels in 7 nanometre narrowband. The dashed lines mark where read noise costs 5 per cent.',
  height: 290,
});

console.log(JSON.stringify({
  rows: rows.map((r) => ({ ...r, subRGB: +r.subRGB.toPrecision(4), subNB: +r.subNB.toPrecision(4) })),
  steps: STEPS,
  checks: {
    skyKP100: +sky(rows[0].sqm, 100).toPrecision(6),
    subKP100: +sub(rows[0].sqm, 100).toPrecision(6),
    subUrban7: +sub(rows[1].sqm, 7).toPrecision(6),
    subSub7: +sub(rows[3].sqm, 7).toPrecision(6),
    subIAU7: +sub(IAU, 7).toPrecision(6),
    effAt300urban7: +(efficiency(300, RN, sky(rows[1].sqm, 7), DARK) * 100).toFixed(2),
    eff60KP100: +(efficiency(60, RN, sky(rows[0].sqm, 100), DARK) * 100).toFixed(3),
  },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'subs', figure(fig1, 'Figure 1. The shortest sub that keeps the camera\'s read noise to a 5 per cent cost, worked out with the Sub-exposure calculator\'s maths for an 80 mm f/6 refractor, 3.76 µm pixels and 1.5 e⁻ read noise (our assumed rig). The dashed lines are the sky brightnesses behind the paper\'s brightness ratios.'));
  md = inject(md, 'eff', figure(fig2, 'Figure 2. In a fixed total night, the share of the ideal signal-to-noise each sub length reaches, in 7 nm narrowband, for the paper\'s urban and suburban sky levels and for the IAU dark-sky standard.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
