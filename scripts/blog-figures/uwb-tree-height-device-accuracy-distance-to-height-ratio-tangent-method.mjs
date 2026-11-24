// Figures for src/blog/discoveries/uwb-tree-height-device-accuracy-distance-to-height-ratio-tangent-method.md, made with
// the maths of the Tree basal area tool's height card (src/lib/sci/treeheight.ts: tangentHeight with a slope distance).
// Run: node scripts/blog-figures/uwb-tree-height-device-accuracy-distance-to-height-ratio-tangent-method.mjs
import fs from 'node:fs';
import { tangentHeight } from '../../src/lib/sci/treeheight.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/uwb-tree-height-device-accuracy-distance-to-height-ratio-tangent-method.md', import.meta.url);

// Inputs from the paper: Li et al. (2025), Forests 16(9): 1464, doi:10.3390/f16091464 (CC BY).
// The device measures the slant distance AB to an anchor at the tree base, the angle α down to the base and the angle β
// up to the top, and works out H = AB sin α + AB cos α tan β. In the tool this is the tangent method with the distance
// taken "along the slope" at the base angle. Overall RMSE 4.25 % of height; error lowest at D/H about 0.9 to 1.2;
// test distances 5, 10, 15 and 20 m; trees 4.8 to 26.56 m.
// OUR assumptions: device held 1.5 m above the tree base; the same random angle error on both readings; 0.1 m ranging error.
const deg = (v) => ({ value: v, unit: 'deg' }), R2D = 180 / Math.PI, EYE = 1.5, SD = 0.1;
const geom = (H, D) => ({ AB: Math.hypot(D, EYE), a: Math.atan(EYE / D) * R2D, b: Math.atan((H - EYE) / D) * R2D });
const Hof = (AB, a, b) => tangentHeight({ dist: AB, slope: deg(-a), top: deg(b), base: deg(-a) }).H;
const h = 1e-4;
const parts = (H, D) => { const g = geom(H, D);
  return { g, dB: (Hof(g.AB, g.a, g.b + h) - Hof(g.AB, g.a, g.b - h)) / (2 * h), dA: (Hof(g.AB, g.a + h, g.b) - Hof(g.AB, g.a - h, g.b)) / (2 * h), dL: (Hof(g.AB + h, g.a, g.b) - Hof(g.AB - h, g.a, g.b)) / (2 * h),
    d2B: (Hof(g.AB, g.a, g.b + 0.01) - 2 * Hof(g.AB, g.a, g.b) + Hof(g.AB, g.a, g.b - 0.01)) / 1e-4 }; };
const relAll = (H, D, s) => { const p = parts(H, D); return Math.sqrt((p.dB * s) ** 2 + (p.dA * s) ** 2 + (p.dL * SD) ** 2) / H; };
const relTop = (H, D, s) => Math.abs(parts(H, D).dB * s) / H;
// Bias from the curvature of tan β: about ½ H''(β) σ² (σ in degrees, derivative per degree²).
const biasPct = (H, D, s) => (0.5 * parts(H, D).d2B * s * s / H) * 100;

// The angle error (per reading) that gives the paper's 4.25 % at D/H = 1 for a 15 m tree.
let lo = 0, hi = 5; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; relAll(15, 15, m) < 0.0425 ? (lo = m) : (hi = m); }
const SIG = +lo.toFixed(2);
const sweep = (f) => { let best = [Infinity, 0]; const pts = []; for (let k = 20; k <= 300; k++) { const r = k / 100, v = f(r); pts.push([r, v]); if (v < best[0]) best = [v, r]; } const ok = pts.filter(([, v]) => v <= 1.1 * best[0]); return { pts, best: best[1], min: best[0], band: [ok[0][0], ok.at(-1)[0]] }; };
const all15 = sweep((r) => relAll(15, r * 15, SIG)), top15 = sweep((r) => relTop(15, r * 15, SIG));
const opt = [10, 15, 20, 25].map((H) => ({ H, all: sweep((r) => relAll(H, r * H, SIG)).best, top: sweep((r) => relTop(H, r * H, SIG)).best }));
const dist = [5, 10, 15, 20].map((D) => ({ D, H10: { dh: +(D / 10).toFixed(2), rel: +(relAll(10, D, SIG) * 100).toFixed(2), bias: +biasPct(10, D, SIG).toFixed(2) }, H20: { dh: +(D / 20).toFixed(2), rel: +(relAll(20, D, SIG) * 100).toFixed(2), bias: +biasPct(20, D, SIG).toFixed(2) } }));
// A worked reading: a 15 m tree from 15 m.
const g = geom(15, 15);
console.log(JSON.stringify({ SIG, all15: { best: all15.best, min: +(all15.min * 100).toFixed(2), band: all15.band }, top15: { best: top15.best, min: +(top15.min * 100).toFixed(2), band: top15.band }, opt, dist,
  worked: { AB: +g.AB.toFixed(2), a: +g.a.toFixed(2), b: +g.b.toFixed(2), H: +Hof(+g.AB.toFixed(2), +g.a.toFixed(2), +g.b.toFixed(2)).toFixed(3), Hplus: +Hof(+g.AB.toFixed(2), +g.a.toFixed(2), +(g.b + 1).toFixed(2)).toFixed(2) },
  at: [0.3, 0.5, 1, 2, 3].map((r) => [r, +(relAll(15, r * 15, SIG) * 100).toFixed(2)]) }, null, 1));

const fig1 = chart({
  title: 'Height error against distance-to-height ratio', xLabel: 'Distance ÷ tree height (D/H)', yLabel: 'Relative error (%)',
  series: [
    { name: 'Both angles + range', kind: 'line', x: all15.pts.map((p) => p[0]), y: all15.pts.map((p) => +(p[1] * 100).toFixed(3)) },
    { name: 'Top angle only', kind: 'line', x: top15.pts.map((p) => p[0]), y: top15.pts.map((p) => +(p[1] * 100).toFixed(3)), dash: '5 4' },
  ],
  xDomain: [0.2, 3], yDomain: [0, 12], bands: [{ x0: 0.9, x1: 1.2, text: 'paper' }], hlines: [{ y: 4.25, text: '4.25 %' }],
  desc: `Expected relative error of a 15 m tree's height for an angle error of ${SIG} degrees per reading. With both angles and a 0.1 m ranging error the lowest error is at D/H ${all15.best}; with the top angle alone at ${top15.best}. The paper's best range, 0.9 to 1.2, is shaded.`, height: 270,
});
const DD = Array.from({ length: 76 }, (_, i) => 3 + i * 0.25);
const fig2 = chart({
  title: 'Close up, a random angle error turns into overestimation', xLabel: 'Horizontal distance to the tree (m)', yLabel: 'Bias (% of height)',
  series: [
    { name: '10 m tree', kind: 'line', x: DD, y: DD.map((D) => +biasPct(10, D, SIG).toFixed(3)) },
    { name: '20 m tree', kind: 'line', x: DD, y: DD.map((D) => +biasPct(20, D, SIG).toFixed(3)) },
  ],
  xDomain: [3, 22], xTicks: [5, 10, 15, 20],
  desc: `Average overestimate caused by a random ${SIG} degree error in the top reading. It is largest at 5 m (${dist[0].H10.bias} % for a 10 m tree, ${dist[0].H20.bias} % for a 20 m tree) and small from 10 m on.`, height: 260,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratio', figure(fig1, `Figure 1. Expected relative error of a 15 m tree's height against the distance-to-height ratio, from the tool's tangent-method maths with an angle error of ${SIG}° per reading and a 0.1 m ranging error (our assumptions). The paper's best range is shaded. A model of the error, not the paper's data.`));
  md = inject(md, 'bias', figure(fig2, `Figure 2. The average overestimate a random ${SIG}° error in the top reading causes, from the curvature of the tangent. The paper's test distances are 5, 10, 15 and 20 m.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
