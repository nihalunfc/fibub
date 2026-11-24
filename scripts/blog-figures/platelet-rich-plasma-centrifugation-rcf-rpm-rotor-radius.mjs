// Figures for src/blog/discoveries/platelet-rich-plasma-centrifugation-rcf-rpm-rotor-radius.md, made with the maths of
// the Centrifuge calculator (src/lib/sci/centrifuge.ts: rcf, rpmFor, RCF_CONST, kFactor, convertTime).
// Run: node scripts/blog-figures/platelet-rich-plasma-centrifugation-rcf-rpm-rotor-radius.mjs
import fs from 'node:fs';
import * as C from '../../src/lib/sci/centrifuge.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/platelet-rich-plasma-centrifugation-rcf-rpm-rotor-radius.md', import.meta.url);

// Paper: Berdini et al. (2026), LabMed 3(1): 8 (CC BY 4.0). Proposed protocol: soft spin 1200 x g for 10 min, hard spin
// 1900 x g for 10 min, no rotor radius or rpm. Included studies quoted: 1889 x g 4 min and 2009 x g 3 min; 100 x g 15 min and 1600 x g 20 min.
const PAPER_G = [1200, 1900];
const radii = [6, 8, 9.5, 11, 13, 15];
const rows = radii.map((r) => ({ r, soft: C.rpmFor(1200, r), hard: C.rpmFor(1900, r), at3000: C.rcf(3000, r) }));
const xs = Array.from({ length: 41 }, (_, i) => 5 + i * 0.25); // 5 to 15 cm

const fig1 = chart({
  title: 'Same force, different speed', xLabel: 'Rotor radius (cm)', yLabel: 'Speed needed (rpm)',
  series: [
    { name: '1900 x g', kind: 'line', x: xs, y: xs.map((r) => Math.round(C.rpmFor(1900, r))), label: { text: '1900 x g', dy: -8, anchor: 'end', dx: -4 } },
    { name: '1200 x g', kind: 'line', x: xs, y: xs.map((r) => Math.round(C.rpmFor(1200, r))), label: { text: '1200 x g', dy: -8, anchor: 'end', dx: -4 } },
  ],
  xDomain: [5, 15], yDomain: [2000, 6000], xTicks: [5, 7.5, 10, 12.5, 15],
  desc: 'Speed in rpm needed to reach 1200 x g and 1900 x g, the two spins of the proposed platelet-rich plasma protocol, for rotor radii from 5 to 15 cm. A small rotor needs about 1.6 times the speed of a large one.',
  height: 265,
});

const rr = Array.from({ length: 41 }, (_, i) => 5 + i * 0.25);
const fig2 = chart({
  title: 'One dial setting, three different forces', xLabel: 'Speed (rpm)', yLabel: 'Force (x g)',
  series: [6, 9.5, 15].map((r, i) => ({ name: `${r} cm`, kind: 'line', x: Array.from({ length: 41 }, (_, k) => 1500 + k * 75), y: Array.from({ length: 41 }, (_, k) => Math.round(C.rcf(1500 + k * 75, r))) })),
  xDomain: [1500, 4500], yDomain: [0, 3500], xTicks: [1500, 2250, 3000, 3750, 4500],
  hlines: PAPER_G.map((g) => ({ y: g, text: `${g} x g` })),
  desc: 'Relative centrifugal force against speed for rotor radii of 6, 9.5 and 15 cm. At 3000 rpm the three rotors give about 600, 960 and 1510 times gravity.',
  height: 265,
});

// Moving the hard spin between two assumed rotors with the k-factor (our assumption: rotor A 4-9 cm, rotor B 5-12 cm).
const kA = C.kFactor(C.rpmFor(1900, 9), 4, 9), kB = C.kFactor(C.rpmFor(1900, 12), 5, 12);
const tB = C.convertTime(10, kA, kB);
const gmin = [[1889, 4], [2009, 3], [100, 15], [1600, 20], [1200, 10], [1900, 10]].map(([g, t]) => ({ g, t, gt: g * t }));

console.log(JSON.stringify({
  constant: +C.RCF_CONST.toPrecision(5),
  rows: rows.map((o) => ({ r: o.r, soft: Math.round(o.soft), hard: Math.round(o.hard), at3000: Math.round(o.at3000) })),
  ratioSmallLarge: +(C.rpmFor(1900, 6) / C.rpmFor(1900, 15)).toFixed(3),
  rotorA: { rpm: Math.round(C.rpmFor(1900, 9)), k: +kA.toFixed(1) }, rotorB: { rpm: Math.round(C.rpmFor(1900, 12)), k: +kB.toFixed(1) }, tB: +tB.toFixed(1),
  gmin,
  rpmFor1900at9: C.rpmFor(1900, 9), back: C.rcf(C.rpmFor(1900, 9), 9),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rpm', figure(fig1, 'Figure 1. The speed needed for each of the two spins of the proposed protocol, by rotor radius. Because force grows with radius, a protocol written only in x g needs a different dial setting in every rotor.'));
  md = inject(md, 'force', figure(fig2, 'Figure 2. Force against speed for three rotor radii. A protocol written only in rpm gives forces that differ by a factor of 2.5 between a small and a large rotor.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
