// Figures for src/blog/discoveries/sunspot-grouping-hmi-automatic-relative-sunspot-number.md, made with the maths of
// the Sunspot counter (src/lib/sci/sunspots.ts: findDisc, findSpots, groupSpots, wolfNumber).
// Run: node scripts/blog-figures/sunspot-grouping-hmi-automatic-relative-sunspot-number.mjs
import fs from 'node:fs';
import { findDisc, findSpots, groupSpots, wolfNumber, spotCount } from '../../src/lib/sci/sunspots.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sunspot-grouping-hmi-automatic-relative-sunspot-number.md', import.meta.url);

// From the paper: Zhao et al. (2024), AJ 167: 51, doi:10.3847/1538-3881/ad11e2 (CC BY 4.0).
// Its worked example, the HMI continuum image of 14 January 2022, has 15 spots in 9 groups, so R = 10 g + s = 105;
// for HMI continuum images the authors derive a scaling factor K = 1.03.
const PAPER = { g: 9, s: 15, R: 105, K: 1.03 };

// OUR synthetic white-light Sun with exactly that make-up: 9 groups holding 15 umbrae, drawn the same way as the
// tool's own demo image (limb darkening u = 0.6, penumbra 0.75 x the local disc, umbra 0.3 x). Positions are OUR
// choice; the paper publishes no spot positions.
const GROUPS = [
  [[-0.55, 0.30], [-0.45, 0.32], [-0.65, 0.33]], // a sprawling group: 0.10 R between neighbours
  [[-0.18, 0.47], [-0.14, 0.46]],
  [[0.17, 0.56], [0.21, 0.55]],
  [[0.50, 0.33], [0.545, 0.345]],
  [[-0.62, -0.26], [-0.575, -0.25]],
  [[-0.18, -0.17]],
  [[0.26, -0.52]],
  [[0.62, -0.14]],
  [[0.05, 0.05]],
];
function syntheticSun(w = 700, h = 700, seed = 14) {
  let st = seed; const rnd = () => { st = (st * 16807) % 2147483647; return st / 2147483647; };
  const cx = w / 2, cy = h / 2, R = 0.45 * Math.min(w, h), d = new Float32Array(w * h);
  const spots = GROUPS.flat().map(([x, y]) => [x, y, 0.013, 0.030]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const rx = (x - cx) / R, ry = (y - cy) / R, rr = Math.hypot(rx, ry);
    let v = 8;
    if (rr < 1) {
      const mu = Math.sqrt(1 - rr * rr); v = 200 * (1 - 0.6 * (1 - mu));
      let f = 1;
      for (const [sx, sy, u, p] of spots) { const dd = Math.hypot(rx - sx, ry - sy); if (dd < p) f = Math.min(f, dd < u ? 0.3 : 0.75); }
      v *= f;
      if (rr > 1 - 1 / R) v *= (1 - rr) * R;
    }
    d[y * w + x] = Math.max(0, v + 3 * (rnd() - 0.5));
  }
  return { d, w, h };
}

// The tool's own pipeline, exactly as the Sunspot counter page runs it.
const img = syntheticSun();
const disc = findDisc(img.d, img.w, img.h);
const found = findSpots(img.d, img.w, img.h, disc, { pen: 0.86 });
const spotTotal = found.reduce((t, s) => t + spotCount(s), 0);
const link = (deg) => 2 * Math.sin((deg * Math.PI) / 360); // the page's degrees-on-the-Sun to chord, in disc radii
const at = (deg, k = 1) => wolfNumber(groupSpots(found, disc, link(deg)), k);

const DEG = Array.from({ length: 57 }, (_, i) => 2 + i * 0.5); // 2 to 30 degrees
const curve = DEG.map((deg) => at(deg).R);
const curveK = DEG.map((deg) => +(at(deg, PAPER.K).R).toFixed(2));
const table = [4, 6, 10, 15, 20, 25].map((deg) => ({ deg, ...at(deg), RK: +(at(deg, PAPER.K).R).toFixed(1) }));

const fig1 = chart({
  title: 'One image, one grouping rule: the sunspot number moves', xLabel: 'Grouping distance (degrees on the Sun)', yLabel: 'Relative sunspot number R',
  series: [
    { name: 'k = 1 (Zurich)', kind: 'line', x: DEG, y: curve },
    { name: 'K = 1.03 (the paper’s HMI factor)', kind: 'line', x: DEG, y: curveK, dash: '5 4' },
  ],
  xDomain: [2, 30], yDomain: [60, 135], hlines: [{ y: PAPER.R, text: 'the paper’s R = 105' }],
  vlines: [{ x: 10, text: '10° default' }],
  desc: `Relative sunspot number from the tool's own pipeline on our synthetic Sun, against the grouping distance from 2 to 30 degrees. It is ${at(4).R} at 4 degrees, settles on ${PAPER.R} from about 6 to 17 degrees, and falls to ${at(25).R} at 25 degrees.`,
  height: 280,
});

// How much one grouping mistake costs. The paper reports 85.3 % accuracy; a group split or merged moves R by 10 k.
// A fake group holding `n` single-umbra spots, so wolfNumber itself does the arithmetic.
const fakeGroups = (g, s) => Array.from({ length: g }, (_, i) => ({ id: i + 1, x: 0, y: 0, area: 1, spots: Array.from({ length: i === 0 ? s - (g - 1) : 1 }, () => ({ id: 0, x: 0, y: 0, area: 1, umbrae: 1, depth: 0.5, mu: 1 })) }));
const MIS = [-3, -2, -1, 0, 1, 2, 3];
const fig2 = chart({
  title: 'Why grouping, not spot finding, sets the error', xLabel: 'Miscount (groups or spots) away from the truth', yLabel: 'Relative sunspot number R',
  series: [
    { name: 'wrong by n groups', kind: 'line', x: MIS, y: MIS.map((n) => wolfNumber(fakeGroups(PAPER.g + n, PAPER.s), 1).R) },
    { name: 'wrong by n spots', kind: 'line', x: MIS, y: MIS.map((n) => wolfNumber(fakeGroups(PAPER.g, PAPER.s + n), 1).R) },
  ],
  xDomain: [-3, 3], yDomain: [70, 140], hlines: [{ y: PAPER.R, text: 'R = 105' }],
  desc: 'Two straight lines showing that miscounting one group changes the relative sunspot number by 10, while miscounting one spot changes it by 1.',
  height: 260,
});

const out = {
  disc: { cx: +disc.cx.toFixed(1), cy: +disc.cy.toFixed(1), r: +disc.r.toFixed(1) },
  regions: found.length, spotTotal, at10: at(10), at10K: +at(10, PAPER.K).R.toFixed(2), table,
  plateau: [DEG.filter((d, i) => curve[i] === PAPER.R)[0], DEG.filter((d, i) => curve[i] === PAPER.R).at(-1)],
  areasMSH: found.map((s) => +(1e6 * s.area / (2 * Math.PI * disc.r * disc.r) / s.mu).toFixed(0)).sort((a, b) => b - a),
};
console.log(JSON.stringify(out, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'grouping', figure(fig1, 'Figure 1. The relative sunspot number the Sunspot counter gets from one synthetic white-light image that holds 15 spots in 9 groups, as the grouping distance is changed. The plateau is the paper’s R = 105. Our image, not the paper’s.'));
  md = inject(md, 'errors', figure(fig2, 'Figure 2. In R = k (10 g + s), one group counted wrongly moves R by 10, one spot by 1. This is why an automatic method is judged on its grouping.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
