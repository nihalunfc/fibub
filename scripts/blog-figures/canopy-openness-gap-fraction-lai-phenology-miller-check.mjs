// Figures and numbers for src/blog/discoveries/canopy-openness-gap-fraction-lai-phenology-miller-check.md, made
// with the maths of the Canopy gaps tool (src/lib/sci/plantimg.ts: hemi(), gap fraction by zenith ring, canopy
// openness and effective LAI by Miller's formula).
// Run: node scripts/blog-figures/canopy-openness-gap-fraction-lai-phenology-miller-check.mjs
import fs from 'node:fs';
import { hemi, exampleFisheye, channel, histogram, otsu, threshold } from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/canopy-openness-gap-fraction-lai-phenology-miller-check.md', import.meta.url);

// Values from the abstract of Öztürk, Biricik and Ağlarcı (2025), Diversity 17(5): 331 (CC BY 4.0), for the five
// phenological stages, in order: leafless, budburst, climax leaf period, senescence, next leafless.
const STAGES = [
  { name: 'Leafless', lai: 0.51, co: 65, lt: 64, gf: 18 },
  { name: 'Budburst', lai: 0.89, co: 62, lt: 61, gf: 14 },
  { name: 'Climax leaf', lai: 3.60, co: 9, lt: 9, gf: 1 },
  { name: 'Senescence', lai: 1.38, co: 37, lt: 36, gf: 8 },
  { name: 'Leafless again', lai: 0.50, co: 75, lt: 74, gf: 14 },
];

const W = 601, C = 300.5, R = 300;
/** A fisheye sky mask whose gaps are spread evenly: every pixel inside the circle is sky with probability p,
 * laid down by a stable dither so the run is reproducible. */
function evenMask(p) {
  const m = new Uint8Array(W * W);
  let acc = 0;
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (Math.hypot(x + 0.5 - C, y + 0.5 - C) > R) continue;
    acc += p; if (acc >= 1) { m[y * W + x] = 1; acc -= 1; }
  }
  return m;
}
/** A mask whose sky is all in one band of zenith angle: the inner disc (`where` = 'zenith') or the outer ring. */
function bandMask(f, where) {
  const m = new Uint8Array(W * W), lim = Math.sqrt(where === 'zenith' ? f : 1 - f);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    const u = Math.hypot(x + 0.5 - C, y + 0.5 - C) / R;
    if (u > 1) continue;
    if (where === 'zenith' ? u <= lim : u >= lim) m[y * W + x] = 1;
  }
  return m;
}
const run = (mask, zen, rings = 9) => hemi(mask, W, W, C, C, R, rings, zen);

// 1. With gaps spread evenly, openness equals gap fraction and LAI is a fixed multiple of -ln(openness).
console.log('Evenly spread gaps: what the tool returns (9 rings)');
console.log('   openness   gap fraction   LAI to 60°   LAI to 75°   LAI to 90°   -ln(openness)');
const EVEN = [0.9, 0.75, 0.65, 0.62, 0.5, 0.37, 0.25, 0.18, 0.12, 0.09, 0.05, 0.02];
const even = EVEN.map((p) => {
  const m = evenMask(p), a = run(m, 60), b = run(m, 75), c = run(m, 90);
  console.log(`   ${(100 * c.openness).toFixed(2).padStart(6)} %   ${(100 * c.gapFraction).toFixed(2).padStart(8)} %   ${a.lai.toFixed(3).padStart(8)}   ${b.lai.toFixed(3).padStart(9)}   ${c.lai.toFixed(3).padStart(9)}   ${(-Math.log(c.openness)).toFixed(3).padStart(10)}`);
  return { p, openness: c.openness, gap: c.gapFraction, l60: a.lai, l75: b.lai, l90: c.lai };
});
const ratio = (sel) => even.map((e) => sel(e) / -Math.log(e.openness));
console.log(`   LAI to 60° ÷ −ln(openness): ${Math.min(...ratio((e) => e.l60)).toFixed(3)} to ${Math.max(...ratio((e) => e.l60)).toFixed(3)} (the integral says 1.5)`);
console.log(`   LAI to 75° ÷ −ln(openness): ${Math.min(...ratio((e) => e.l75)).toFixed(3)} to ${Math.max(...ratio((e) => e.l75)).toFixed(3)} (the integral says 1.2588)`);
console.log(`   LAI to 90° ÷ −ln(openness): ${Math.min(...ratio((e) => e.l90)).toFixed(3)} to ${Math.max(...ratio((e) => e.l90)).toFixed(3)} (the integral says 1)`);

// 2. The paper's five stages: the LAI an evenly gapped canopy of that openness would give.
console.log('\nThe paper\'s stages against evenly spread gaps of the same openness');
const at = STAGES.map((s) => {
  const m = evenMask(s.co / 100), a = run(m, 60), b = run(m, 75), c = run(m, 90);
  const row = { ...s, l60: a.lai, l75: b.lai, l90: c.lai, open: c.openness };
  console.log(`   ${s.name.padEnd(15)} openness ${s.co} %, paper LAI ${s.lai.toFixed(2)}: tool gives ${a.lai.toFixed(2)} to 60°, ${b.lai.toFixed(2)} to 75°, ${c.lai.toFixed(2)} to 90° (paper ÷ 75° = ${(s.lai / b.lai).toFixed(2)})`);
  return row;
});

// 3. Can an 18 % gap fraction sit with 65 % openness? The extremes of gap placement.
console.log('\nHow far openness can drift from gap fraction, when all the sky is in one zenith band');
const bands = [0.01, 0.08, 0.14, 0.18, 0.37, 0.65, 0.75].map((f) => {
  const z = run(bandMask(f, 'zenith'), 90), hz = run(bandMask(f, 'horizon'), 90);
  console.log(`   gap fraction ${(100 * z.gapFraction).toFixed(1)} %: openness ${(100 * hz.openness).toFixed(1)} % (sky at the horizon) to ${(100 * z.openness).toFixed(1)} % (sky at the zenith)`);
  return { f, gap: z.gapFraction, lo: hz.openness, hi: z.openness };
});
for (const s of STAGES) console.log(`   ${s.name.padEnd(15)} the paper pairs a gap fraction of ${s.gf} % with an openness of ${s.co} %; the largest openness ${s.gf} % of sky can give is about ${(100 * (bands.find((b) => Math.abs(100 * b.gap - s.gf) < 1)?.hi ?? NaN)).toFixed(1)} %`);
console.log(`   light transmission minus openness, per stage: ${STAGES.map((s) => (s.lt - s.co).toFixed(0)).join(', ')} points`);

// 4. A realistic canopy: the tool's own example, drawn with spherical leaves at LAI 2.5.
{
  const e = exampleFisheye(2.5, 600), ch = channel(e.px, 600 * 600, 2), th = otsu(histogram(ch)), sky = threshold(ch, th);
  const r = (n, z) => hemi(sky, 600, 600, e.cx, e.cy, e.R, n, z);
  const a = r(5, 60), b = r(5, 75), c = r(5, 90);
  console.log('\nThe tool\'s example photo, drawn as a real canopy with spherical leaves at LAI 2.5');
  console.log(`   gap fraction ${(100 * b.gapFraction).toFixed(2)} %, openness ${(100 * b.openness).toFixed(2)} %`);
  console.log(`   LAI recovered: ${a.lai.toFixed(3)} to 60°, ${b.lai.toFixed(3)} to 75°, ${c.lai.toFixed(3)} to 90° (drawn at 2.5)`);
  console.log(`   ring gap fractions (5 rings to 75°): ${b.rings.map((x) => (100 * x.gap).toFixed(1) + ' %').join(', ')}`);
  console.log(`   LAI ÷ −ln(openness) for this real canopy: ${(b.lai / -Math.log(b.openness)).toFixed(2)}`);
  console.log(`   the same ratio for the paper's five stages: ${STAGES.map((s2, i) => (s2.lai / -Math.log(s2.co / 100)).toFixed(2)).join(', ')}`);
}

// ---- Figure 1: LAI against openness, three ring reaches, with the paper's five stages.
const fig1 = chart({
  title: 'Effective LAI against canopy openness', xLabel: 'Canopy openness (%)', yLabel: 'Effective LAI',
  series: [
    { name: 'Rings to 60°', kind: 'line', x: even.map((e) => +(100 * e.openness).toFixed(2)), y: even.map((e) => +e.l60.toFixed(3)) },
    { name: 'Rings to 75°', kind: 'line', x: even.map((e) => +(100 * e.openness).toFixed(2)), y: even.map((e) => +e.l75.toFixed(3)) },
    { name: 'Rings to 90°', kind: 'line', x: even.map((e) => +(100 * e.openness).toFixed(2)), y: even.map((e) => +e.l90.toFixed(3)) },
    { name: 'The paper', kind: 'dots', size: 4, colour: 'var(--ink)', x: STAGES.map((s) => s.co), y: STAGES.map((s) => s.lai) },
  ],
  xDomain: [0, 92], yDomain: [0, 6], height: 300,
  desc: 'Effective leaf area index that the canopy tool returns for an evenly gapped fisheye photo, against its canopy openness, for rings reaching 60, 75 and 90 degrees of zenith angle. The five values the paper reports fall between the 75 and 60 degree curves.',
});

// ---- Figure 2: openness against gap fraction, with the band of what is possible.
const fig2 = chart({
  title: 'Openness and gap fraction cannot differ much', xLabel: 'Gap fraction (%)', yLabel: 'Canopy openness (%)',
  series: [
    { name: 'All sky at the zenith', kind: 'line', x: bands.map((b) => +(100 * b.gap).toFixed(1)), y: bands.map((b) => +(100 * b.hi).toFixed(1)) },
    { name: 'All sky at the horizon', kind: 'line', x: bands.map((b) => +(100 * b.gap).toFixed(1)), y: bands.map((b) => +(100 * b.lo).toFixed(1)) },
    { name: 'The paper', kind: 'dots', size: 4, colour: 'var(--ink)', x: STAGES.map((s) => s.gf), y: STAGES.map((s) => s.co) },
  ],
  xDomain: [0, 80], yDomain: [0, 80], height: 300,
  desc: 'Canopy openness against gap fraction. The two curves are the extreme cases, all the sky packed around the zenith or all of it around the horizon; every real photograph lies between them. The paper five pairs lie far above both.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'lai', figure(fig1, 'Figure 1. Effective LAI the Canopy gaps tool returns for a fisheye mask whose gaps are spread evenly over the sky, against that mask\'s canopy openness, for the three ring reaches the tool offers. The black dots are the five stages the paper reports: all five sit above the whole-hemisphere curve, which is what gaps concentrated overhead look like.'));
md = inject(md, 'gap', figure(fig2, 'Figure 2. Canopy openness against gap fraction for masks in which all the sky is packed at the zenith (upper curve) or at the horizon (lower curve). Every real photograph lies between them, and the paper\'s five pairs lie far above both.'));
fs.writeFileSync(ART, md);
console.log(`\nFigure 1 ${fig1.length} bytes; Figure 2 ${fig2.length} bytes`);
