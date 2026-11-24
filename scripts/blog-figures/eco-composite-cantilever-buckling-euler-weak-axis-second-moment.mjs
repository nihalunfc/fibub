// Figures for src/blog/discoveries/eco-composite-cantilever-buckling-euler-weak-axis-second-moment.md,
// made with the maths of the Column buckling calculator (src/lib/sci/eng-buckling.ts).
// Run: node scripts/blog-figures/eco-composite-cantilever-buckling-euler-weak-axis-second-moment.mjs
import fs from 'node:fs';
import { sectionProps, eulerLoad, column, transition, criticalStress } from '../../src/lib/sci/eng-buckling.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/eco-composite-cantilever-buckling-euler-weak-axis-second-moment.md', import.meta.url);

// Paper (Gawryluk, Glogowska and Bartnicki 2025, Applied Computer Science 21(2): 28-36, doi:10.35784/acs_7308,
// CC BY 4.0): eco-composite from 100 % recycled polymer, measured E = 493 MPa, tensile strength 13.5 MPa,
// Poisson's ratio 0.32, density 969 kg/m3. Cantilever (one end clamped, one free, mu = K = 2), shell model in
// Abaqus. Cross-sections 40x20, 40x40 and 40x60 mm at lengths 150, 300 and 450 mm; the paper's own Euler values
// and its FEM first-mode critical forces are the two columns below.
const E = 493, FY = 13.5, K = 2;
const SECS = [{ b: 40, h: 20 }, { b: 40, h: 40 }, { b: 40, h: 60 }];
const LS = [150, 300, 450];
// Paper's table: FEM and its own Euler value, in newtons, keyed as "bxh@L".
const PAPER = {
  '40x20@150': [1423.6, 1440.23], '40x40@150': [11087.0, 11521.86], '40x60@150': [16781.0, 17282.78],
  '40x20@300': [359.55, 360.06], '40x40@300': [2825.2, 2880.46], '40x60@300': [4307.2, 4320.7],
  '40x20@450': [160.06, 160.03], '40x40@450': [1259.9, 1280.21], '40x60@450': [1921.7, 1920.31],
};

const rows = [];
for (const s of SECS) for (const L of LS) {
  const key = `${s.b}x${s.h}@${L}`;
  const p = sectionProps({ kind: 'rect', ...s });
  const r = column({ kind: 'rect', ...s }, L, K, E, FY);
  const [fem, pEuler] = PAPER[key];
  rows.push({
    key, b: s.b, h: s.h, L, A: p.A, Imin: Math.round(p.Imin), weak: p.axis, lambda: +r.lambda.toFixed(1), mode: r.mode,
    tool: +r.PE.toFixed(2), paperEuler: pEuler, fem, dPaper: +((r.PE / pEuler - 1) * 100).toFixed(2), dFem: +((r.PE / fem - 1) * 100).toFixed(2),
    sigma: +(r.PE / p.A).toFixed(3),
  });
}
const Cc = +transition(E, FY).toFixed(2);

// Scaling claims. Doubling the area of the 40x20 section can be done three ways.
const pcr = (b, h, L) => eulerLoad(E, sectionProps({ kind: 'rect', b, h }).Imin, K, L);
const base = pcr(40, 20, 150);
const ways = [
  { name: 'double the depth h (40 × 40)', b: 40, h: 40, f: pcr(40, 40, 150) / base },
  { name: 'double the width b (80 × 20)', b: 80, h: 20, f: pcr(80, 20, 150) / base },
  { name: 'scale both by √2 (56.6 × 28.3)', b: 40 * Math.SQRT2, h: 20 * Math.SQRT2, f: pcr(40 * Math.SQRT2, 20 * Math.SQRT2, 150) / base },
].map((w) => ({ ...w, f: +w.f.toFixed(3), pct: +((w.f - 1) * 100).toFixed(0), A: Math.round(sectionProps({ kind: 'rect', b: w.b, h: w.h }).A) }));
const lenScale = { x2: +(pcr(40, 20, 300) / pcr(40, 20, 150)).toFixed(4), x15: +(pcr(40, 20, 450) / pcr(40, 20, 300)).toFixed(4) };
const femScale = { area2: +(PAPER['40x40@150'][0] / PAPER['40x20@150'][0]).toFixed(3), area15: +(PAPER['40x60@150'][0] / PAPER['40x40@150'][0]).toFixed(3), len2: +(PAPER['40x20@300'][0] / PAPER['40x20@150'][0]).toFixed(4) };

// Figure 1: the Euler curve against length for the three sections, with the paper's nine FEM points.
const xs = Array.from({ length: 121 }, (_, i) => 120 + i * 3);
const fig1 = chart({
  title: 'Cantilever buckling load against length', xLabel: 'Free length L (mm)', yLabel: 'Critical load (N)',
  series: [
    ...SECS.map((s) => ({ name: `${s.b} × ${s.h} mm`, kind: 'line', x: xs, y: xs.map((L) => pcr(s.b, s.h, L)) })),
    { name: 'paper, FEM', kind: 'dots', x: rows.map((r) => r.L), y: rows.map((r) => r.fem), colour: 'var(--ink)', size: 3 },
  ],
  xDomain: [120, 480], yDomain: [0, 18000], yTicks: [0, 4000, 8000, 12000, 16000], yFmt: (v) => String(v),
  desc: `Euler loads for a fixed-free column of each cross-section, with the paper's nine finite-element critical forces as dots. The largest gap between the two is ${Math.max(...rows.map((r) => Math.abs(r.dFem))).toFixed(1)} per cent.`,
  height: 272,
});

// Figure 2: the column curve, with the nine cases placed on it.
const lam = Array.from({ length: 141 }, (_, i) => 5 + i);
const fig2 = chart({
  title: 'Column curve for the recycled composite (E = 493 MPa)', xLabel: 'Slenderness λ = KL / r', yLabel: 'Critical stress (MPa)',
  series: [
    { name: 'Johnson then Euler', kind: 'line', x: lam, y: lam.map((l) => criticalStress(l, E, FY).sigma) },
    { name: 'Euler alone', kind: 'line', x: lam, y: lam.map((l) => (Math.PI ** 2 * E) / l ** 2), dash: '5 4' },
    { name: 'the paper’s nine columns', kind: 'dots', x: rows.map((r) => r.lambda), y: rows.map((r) => r.sigma), colour: 'var(--ink)', size: 3 },
  ],
  xDomain: [5, 145], yDomain: [0, 15], vlines: [{ x: Cc, text: `λ = ${Cc}`, dy: 14 }], hlines: [{ y: FY, text: 'tensile strength 13.5 MPa' }],
  desc: `All nine columns in the paper sit at slenderness ${Math.min(...rows.map((r) => r.lambda))} to ${Math.max(...rows.map((r) => r.lambda))}, well above the transition at ${Cc}, so Euler's formula applies and the critical stress stays under ${Math.max(...rows.map((r) => r.sigma)).toFixed(1)} MPa.`,
  height: 272,
});

console.log(JSON.stringify({ Cc, rows, ways, lenScale, femScale }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'loads', figure(fig1, 'Figure 1. Euler buckling loads for a fixed-free column of each of the paper\'s three cross-sections, worked out with the Column buckling calculator\'s maths from the measured modulus of 493 MPa, with the paper\'s nine finite-element critical forces shown as dots.'));
  md = inject(md, 'curve', figure(fig2, 'Figure 2. The column curve for this material: the Johnson parabola below the transition slenderness and Euler above it. The paper\'s nine columns all sit far to the right, in the Euler region, which is why its finite-element loads match the formula so closely.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
