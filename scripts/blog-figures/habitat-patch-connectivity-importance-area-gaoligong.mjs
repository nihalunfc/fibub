// Figures for src/blog/discoveries/habitat-patch-connectivity-importance-area-gaoligong.md, made with the maths of
// the Habitat connectivity analyser (src/lib/sci/connectivity.ts: findPatches, patchDistances, indices, importance).
// Run: node scripts/blog-figures/habitat-patch-connectivity-importance-area-gaoligong.mjs
import fs from 'node:fs';
import { findPatches, patchDistances, indices, importance, exampleLandscape } from '../../src/lib/sci/connectivity.ts';
import { pearson } from '../../src/lib/sci/csvprofile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/habitat-patch-connectivity-importance-area-gaoligong.md', import.meta.url);

// From the paper (Zhou and Huang 2026, Front. Environ. Sci. 14, doi:10.3389/fenvs.2026.1764386, CC BY 4.0), only
// its summary numbers: 23 primary core sources, 4,343.47 km2 in all, largest 323.43 km2, smallest 33.72 km2,
// northern sources averaging 186.2 km2 and southern 107.8 km2; PC = 0.68, overall IIC = 0.138; patch area explains
// R2 = 0.657 of the dIIC spread and R2 = 0.497 of the dPC spread. No patch coordinates are published.
const PAPER = { n: 23, total: 4343.47, max: 323.43, min: 33.72, north: 186.2, south: 107.8, pc: 0.68, iic: 0.138, r2iic: 0.657, r2pc: 0.497 };

// ---------------------------------------------------------------------------
// A stand-in landscape: OUR ASSUMPTION. A 80 km x 600 km strip (the Gaoligong range runs roughly north-south),
// 2 km cells, with 23 round patches whose areas match the paper's count, total, largest, smallest and the
// north-south split. Nothing about the positions comes from the paper.
const CELL = 1000, W = 80, H = 600; // 1 km cells, an 80 km by 600 km strip
let seed = 1764386;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

/** Patch areas matching the paper's count, smallest, largest and total: a power curve between the smallest and
 * the largest, with the exponent solved so the 23 areas add to 4,343.47 km2. */
function areas() {
  const f = (g) => Array.from({ length: PAPER.n }, (_, i) => PAPER.min + (PAPER.max - PAPER.min) * (i / (PAPER.n - 1)) ** g);
  let lo = 0.2, hi = 20;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; (f(m).reduce((s, v) => s + v, 0) > PAPER.total ? lo = m : hi = m); }
  return f((lo + hi) / 2);
}
const A = areas();

/** 23 round patches strung along the strip, biggest ones in the northern half, never touching. */
function landscape() {
  const cls = new Int32Array(W * H).fill(0); // 0 = matrix, 1 = habitat
  // North half gets the larger patches (so the two halves' mean areas land near the paper's 186.2 and 107.8).
  const order = [...A].sort(() => rnd() - 0.5);
  const radii = order.map((area) => Math.sqrt(area / Math.PI)); // km = cells
  const gap = (H - 20 - 2 * radii.reduce((s, r) => s + r, 0)) / (order.length - 1);
  let y = 10 + radii[0];
  const centres = [];
  order.forEach((area, i) => {
    if (i) y += radii[i - 1] + gap + radii[i];
    const r = radii[i], cx = W / 2 + (rnd() - 0.5) * 2 * Math.max(0, W / 2 - r - 2);
    for (let yy = Math.floor(y - r - 1); yy <= y + r + 1; yy++) for (let xx = Math.floor(cx - r - 1); xx <= cx + r + 1; xx++) {
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      if ((xx + 0.5 - cx) ** 2 + (yy + 0.5 - y) ** 2 <= r * r) cls[yy * W + xx] = 1;
    }
    centres.push({ cx, cy: y, area });
  });
  return { w: W, h: H, cls, cell: CELL, classes: [{ code: 0, name: 'Matrix', habitat: false, resistance: 1, colour: '#eeeeee' }, { code: 1, name: 'Forest', habitat: true, resistance: 1, colour: '#2f7d32' }], centres };
}

const L = landscape();
const { patches } = findPatches(L, 1);
const D = patchDistances(L, patches); // least-cost distances in metres (resistance 1 everywhere, so straight-line)
const areaKm2 = patches.map((p) => p.area / 100); // findPatches gives hectares; 100 ha = 1 km2
const AL = areaKm2.reduce((s, v) => s + v, 0);
const half = patches.map((p) => (p.cy < H / 2 ? 'N' : 'S'));
console.log(`patches ${patches.length}; total ${AL.toFixed(1)} km2 (paper ${PAPER.total}); largest ${Math.max(...areaKm2).toFixed(1)} (paper ${PAPER.max}); smallest ${Math.min(...areaKm2).toFixed(1)} (paper ${PAPER.min})`);
console.log(`mean patch area ${(AL / patches.length).toFixed(1)} km2 (paper ${(PAPER.total / PAPER.n).toFixed(1)})`);

// What dispersal distance does PC = 0.68 imply? Solve for the threshold distance at which p = 0.5.
const pcAt = (dKm) => indices(areaKm2, D, dKm * 1000, 0.5, AL).pc;
const iicAt = (dKm) => indices(areaKm2, D, dKm * 1000, 0.5, AL).iic;
function solve(target, f, lo = 0.5, hi = 4000) {
  for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); (f(m) < target ? lo = m : hi = m); }
  return Math.sqrt(lo * hi);
}
const dPC = solve(PAPER.pc, pcAt), dIIC = solve(PAPER.iic, iicAt);
console.log(`PC = ${PAPER.pc} needs a median dispersal distance of ${dPC.toFixed(1)} km in this geometry (PC there = ${pcAt(dPC).toFixed(4)})`);
console.log(`IIC = ${PAPER.iic} needs a link threshold of ${dIIC.toFixed(1)} km (IIC there = ${iicAt(dIIC).toFixed(4)}); at ${dPC.toFixed(0)} km IIC would be ${iicAt(dPC).toFixed(3)}`);
console.log(`at the IIC-implied threshold of ${dIIC.toFixed(1)} km, PC would be ${pcAt(dIIC).toFixed(3)} (paper ${PAPER.pc})`);
console.log(`self-contribution floor of PC (every patch isolated): ${(areaKm2.reduce((s, a) => s + a * a, 0) / AL ** 2).toFixed(4)}`);

// Does the implied distance depend on how the patches are laid out? Same 23 areas in a compact 220 x 220 km block.
function compact() {
  const w = 220, h = 220, cls = new Int32Array(w * h).fill(0);
  const order = [...A].sort(() => rnd() - 0.5), cols = 5;
  order.forEach((area, i) => {
    const r = Math.sqrt(area / Math.PI), cx = 25 + (i % cols) * 42 + (rnd() - 0.5) * 6, cy = 25 + Math.floor(i / cols) * 42 + (rnd() - 0.5) * 6;
    for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++) for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) cls[y * w + x] = 1;
    }
  });
  return { w, h, cls, cell: CELL, classes: L.classes };
}
{
  const C = compact(), pc = findPatches(C, 1).patches, Dc = patchDistances(C, pc), ac = pc.map((p) => p.area / 100), al = ac.reduce((s, v) => s + v, 0);
  const f = (d) => indices(ac, Dc, d * 1000, 0.5, al).pc, g = (d) => indices(ac, Dc, d * 1000, 0.5, al).iic;
  const dc = solve(PAPER.pc, f), dci = solve(PAPER.iic, g);
  console.log(`compact block: ${pc.length} patches, ${al.toFixed(0)} km2; PC = 0.68 at ${dc.toFixed(1)} km; IIC = 0.138 at ${dci.toFixed(1)} km; PC at that IIC threshold ${f(dci).toFixed(3)}`);
}

// Importance of each patch at the implied distance, and how much of it is just area.
const DS = [10, 25, 50, dPC, 200, 400];
const rows = DS.map((d) => {
  const imp = importance(areaKm2, D, d * 1000, 0.5, AL);
  const r2 = (v) => pearson(areaKm2, v) ** 2;
  return { d, pc: imp.all.pc, iic: imp.all.iic, r2pc: r2(imp.dPC), r2iic: r2(imp.dIIC), dPCv: imp.dPC, dIICv: imp.dIIC, imp };
});
console.log('\n  d (km)      PC      IIC   R2(area, dPC)  R2(area, dIIC)');
for (const r of rows) console.log(`${r.d.toFixed(1).padStart(8)} ${r.pc.toFixed(4)} ${r.iic.toFixed(4)} ${r.r2pc.toFixed(3).padStart(13)} ${r.r2iic.toFixed(3).padStart(15)}`);

const main = rows.find((r) => r.d === dPC);
const rank = areaKm2.map((a, i) => ({ i, a, dPC: main.dPCv[i], dIIC: main.dIICv[i], side: half[i] })).sort((x, y) => y.dPC - x.dPC);
console.log('\nmost important patches at the implied distance (dPC %, area km2):');
for (const r of rank.slice(0, 6)) console.log(`  patch ${r.i + 1}: dPC ${r.dPC.toFixed(2)} %, dIIC ${r.dIIC.toFixed(2)} %, area ${r.a.toFixed(1)} km2 (${r.side})`);
const byArea = [...areaKm2].map((a, i) => ({ a, i })).sort((x, y) => y.a - x.a);
console.log('largest patch is number', byArea[0].i + 1, 'with dPC', main.dPCv[byArea[0].i].toFixed(2), '%');
// Who punches above their area: ratio of dPC share to area share.
const over = areaKm2.map((a, i) => ({ i, a, k: main.dPCv[i] / ((100 * a) / AL) })).sort((x, y) => y.k - x.k);
console.log('dPC per unit of area share, best and worst:', over.slice(0, 3).map((o) => `#${o.i + 1} ${o.k.toFixed(2)}`).join(', '), '|', over.slice(-3).map((o) => `#${o.i + 1} ${o.k.toFixed(2)}`).join(', '));

// The tool page's own example map, for "Check it yourself".
{
  const E = exampleLandscape(), ep = findPatches(E, 1).patches, ED = patchDistances(E, ep);
  const ea = ep.map((p) => p.area), eAL = (E.w * E.h * E.cell * E.cell) / 1e4;
  for (const d of [1500, 5000]) {
    const imp = importance(ea, ED, d, 0.5, eAL);
    const order = ea.map((a, i) => ({ i: i + 1, a, dPC: imp.dPC[i] })).sort((x, y) => y.dPC - x.dPC);
    console.log(`\nexample map at ${d} m: PC ${imp.all.pc.toFixed(6)}, IIC ${imp.all.iic.toFixed(6)}; areas (ha) ${ea.join(', ')}`);
    console.log('  by dPC:', order.map((o) => `#${o.i} ${o.dPC.toFixed(1)} %`).join(', '));
  }
}

// --------------------------------------------------------------------------- charts
const dGrid = Array.from({ length: 61 }, (_, i) => 2 * 1.1 ** i).filter((d) => d <= 2000);
const fig1 = chart({
  title: 'What a published PC value says about dispersal', xLabel: 'Median dispersal distance (km)', yLabel: 'Index value',
  series: [
    { name: 'PC', kind: 'line', x: dGrid, y: dGrid.map((d) => +pcAt(d).toFixed(4)) },
    { name: 'IIC', kind: 'line', x: dGrid, y: dGrid.map((d) => +iicAt(d).toFixed(4)) },
  ],
  xDomain: [0, 600], yDomain: [0, 1],
  hlines: [{ y: PAPER.pc, text: 'paper PC 0.68' }, { y: PAPER.iic, text: 'paper IIC 0.138' }],
  vlines: [{ x: +dPC.toFixed(0), text: `${dPC.toFixed(0)} km` }],
  desc: 'PC and IIC of our stand-in landscape against the dispersal distance assumed. The paper value PC = 0.68 is reached at about 130 km, where IIC is far above the paper value.',
  height: 290,
});
const fig2 = chart({
  title: 'Patch importance is mostly, but not only, area', xLabel: 'Patch area (km²)', yLabel: 'dPC (%)',
  series: [
    { name: `25 km (R² ${rows[1].r2pc.toFixed(2)})`, kind: 'dots', x: areaKm2.map((a) => +a.toFixed(1)), y: rows[1].dPCv.map((v) => +v.toFixed(2)), size: 3 },
    { name: `${dPC.toFixed(0)} km (R² ${main.r2pc.toFixed(2)})`, kind: 'dots', x: areaKm2.map((a) => +a.toFixed(1)), y: main.dPCv.map((v) => +v.toFixed(2)), size: 3 },
  ],
  xDomain: [0, 340], yDomain: [0, 30],
  desc: 'Each of the 23 patches: its dPC importance against its area, at two dispersal distances. At the short distance area explains most of the spread; at the long one the middle of the range matters more.',
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pc', figure(fig1, `Figure 1. PC and IIC of our stand-in landscape (23 patches with the paper's areas, placed along an 80 × 600 km strip: our assumption) as the assumed dispersal distance changes, worked out with the Habitat connectivity analyser's own index code. The paper's PC = 0.68 needs about ${dPC.toFixed(0)} km; its IIC = 0.138 needs a much shorter link threshold, so the two published indices do not come from the same distance.`));
  md = inject(md, 'imp', figure(fig2, 'Figure 2. The importance (dPC) of each patch against its area, at a short and a long dispersal distance. Area sets the trend, but patches in the middle of the chain sit above it, and end patches below.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
