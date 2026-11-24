// Figures for src/blog/discoveries/fold-hinge-two-limbs-interlimb-angle-yidun-outcrop.md, made with the maths of the
// Fold axis tool (src/lib/sci/foldaxis.ts: poles, eigenvectors, limbs, interlimb angle, axial plane) and the stereonet
// geometry it shares (src/lib/sci/stereonet.ts).
// Run: node scripts/blog-figures/fold-hinge-two-limbs-interlimb-angle-yidun-outcrop.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as F from '../../src/lib/sci/foldaxis.ts';
import { vec, line, pole, project, greatCircle } from '../../src/lib/sci/stereonet.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fold-hinge-two-limbs-interlimb-angle-yidun-outcrop.md', import.meta.url);

// Inputs from the paper: Tao, Li and Dong (2026), Frontiers in Earth Science 14: 1777200, doi:10.3389/feart.2026.1777200 (CC BY 4.0).
// Bedding as dip direction / dip: 230/56, 225/51 (south-west limb) and 050/47 (north-east limb); hinge 3 deg towards 320;
// interlimb angle about 77-80 deg; axial plane 230/86; joints J1 235/70 and J2 035/75 with bedding intersections
// 16 deg towards 331 and 15 deg towards 129.
const R = (x, n = 1) => +x.toFixed(n), RAD = Math.PI / 180;
const parse = (t) => F.parsePlanes(t, true).data;
const limbsOf = (txt) => { const d = parse(txt), f = F.fit(d.map((x) => x.v)); return { f, L: F.limbs(d.filter((x) => x.label === 'A').map((x) => x.v), d.filter((x) => x.label === 'B').map((x) => x.v), f.b, false) }; };
const two = limbsOf('230 56 A\n50 47 B'), three = limbsOf('230 56 A\n225 51 A\n50 47 B');
const planeDD = (dd, d) => ({ strike: (dd - 90 + 360) % 360, dip: d });
const angle = (a, b) => F.axialAngle(a, b);
const hingePaper = vec({ trend: 320, plunge: 3 });
const hingeTwo = vec(line(two.f.b)), hingeThree = vec(line(three.f.b));
const axialPaper = planeDD(230, 86), axialOurs = two.L.axial;
const axialGap = angle(vec({ trend: axialPaper.strike + 90, plunge: axialPaper.dip }), vec({ trend: axialOurs.strike + 90, plunge: axialOurs.dip }));
// Joint planes cutting bedding: line of intersection = cross product of the two poles (a line has two ends; report both).
const P = (p) => vec(pole(p)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const inter = (a, b) => { const l = line(cross(P(a), P(b))); const o = { trend: (l.trend + 180) % 360, plunge: -l.plunge }; return { down: [R(l.trend), R(l.plunge)], up: o }; };
const J1 = inter(planeDD(235, 70), planeDD(230, 56)), J2 = inter(planeDD(35, 75), planeDD(230, 56));
const J1b = inter(planeDD(235, 70), planeDD(50, 47)), J2b = inter(planeDD(35, 75), planeDD(50, 47));

// Chart 1: equal-area net.
const circle = Array.from({ length: 91 }, (_, i) => [Math.sin((i * 4 * Math.PI) / 180), Math.cos((i * 4 * Math.PI) / 180)]);
const gc = (p) => greatCircle(p, 'equal-area', 90).map(([x, y]) => [R(x, 3), R(y, 3)]);
const sw = planeDD(230, 56), ne = planeDD(50, 47), ax = axialOurs;
const dots = (lines) => lines.map((l) => project(l, 'equal-area'));
const poleSW = line(vec(pole(sw))), poleNE = line(vec(pole(ne)));
const fig1 = chart({
  title: 'Lower-hemisphere equal-area net', xLabel: 'East to the right, north up', yLabel: ' ',
  series: [
    { name: '', noLegend: true, kind: 'line', x: circle.map((p) => R(p[0], 3)), y: circle.map((p) => R(p[1], 3)), colour: 'var(--muted)' },
    { name: 'South-west limb 230/56', kind: 'line', x: gc(sw).map((p) => p[0]), y: gc(sw).map((p) => p[1]), colour: 'var(--c-blog)' },
    { name: 'North-east limb 050/47', kind: 'line', x: gc(ne).map((p) => p[0]), y: gc(ne).map((p) => p[1]), colour: 'var(--c-tools)' },
    { name: 'Axial plane (tool)', kind: 'line', x: gc(ax).map((p) => p[0]), y: gc(ax).map((p) => p[1]), colour: 'var(--ink)', dash: '5 3' },
    { name: 'Poles and hinge', kind: 'dots', size: 4, x: dots([poleSW, poleNE, line(two.f.b)]).map((p) => R(p[0], 3)), y: dots([poleSW, poleNE, line(two.f.b)]).map((p) => R(p[1], 3)), colour: 'var(--ink)' },
  ],
  xDomain: [-1.05, 1.05], yDomain: [-1.05, 1.05], xTicks: [], yTicks: [], width: 460, height: 440,
  desc: 'Equal-area net with the great circles of the two limbs, the near-vertical axial plane, the two bedding poles and the fold axis, which lies almost on the primitive circle because the hinge is nearly horizontal.',
});
// Chart 2: interlimb angle against the dip of the second limb.
const dd = Array.from({ length: 41 }, (_, i) => 30 + i);
const il = dd.map((d) => { const x = limbsOf(`230 56 A\n50 ${d} B`); return R(x.L.interlimb, 2); });
const fig2 = chart({
  title: 'Interlimb angle against the dip of the north-east limb', xLabel: 'Dip of the north-east limb (°)', yLabel: 'Interlimb angle (°)',
  series: [
    { name: 'South-west limb fixed at 56°', kind: 'line', x: dd, y: il, colour: 'var(--c-blog)' },
    { name: 'Paper: 47°', kind: 'dots', size: 5, x: [47], y: [R(limbsOf('230 56 A\n50 47 B').L.interlimb, 2)], colour: 'var(--c-tools)' },
  ],
  xDomain: [30, 70], yDomain: [50, 100], hlines: [{ y: 80, text: '' }, { y: 77, text: '' }],
  desc: 'Interlimb angle of a horizontal-axis fold whose south-west limb dips 56 degrees and whose north-east limb dips between 30 and 70 degrees. The paper\'s 47 degrees gives 77 degrees; the dashed lines mark the paper\'s stated range of 77 to 80.', height: 280,
});

const res = {
  two: { axis: [R(line(two.f.b).trend), R(line(two.f.b).plunge)], interlimb: R(two.L.interlimb, 2), tight: two.L.tightness, axial: [R(axialOurs.strike), R(axialOurs.dip)], limbs: two.L.plane.map((q) => [R(q.strike), R(q.dip)]) },
  three: { axis: three.f.axes.map((l) => [R(l.trend), R(l.plunge)]), val: three.f.val.map((v) => R(v, 3)), K: R(three.f.K, 2), C: R(three.f.C, 2), interlimb: R(three.L.interlimb, 2), axial: [R(three.L.axial.strike), R(three.L.axial.dip)], rms: R(three.f.rms, 1) },
  hingeGapTwo: R(angle(hingePaper, hingeTwo), 1), hingeGapThree: R(angle(hingePaper, hingeThree), 1),
  axialPaper, axialGap: R(axialGap, 1), axialDirDiff: R(Math.abs(axialOurs.strike + 90 - (axialPaper.strike + 90)), 1),
  J1, J2, J1b, J2b,
  dipFor77to80: dd.filter((d, i) => il[i] >= 77 && il[i] <= 80),
};
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'net', figure(fig1, 'Figure 1. The paper\'s two limb attitudes (south-west limb dipping 56° towards 230, north-east limb dipping 47° towards 050) on a lower-hemisphere equal-area net, with the axial plane and fold axis that the Fold axis tool finds. Plotted from the attitudes in the paper\'s text, not copied from its stereonet.'));
  md = inject(md, 'interlimb', figure(fig2, 'Figure 2. How the interlimb angle changes with the dip of the second limb when the first is fixed at 56°. The point is the paper\'s 47°; the two dashed lines mark its quoted range of 77° to 80°.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
