// Figures for src/blog/discoveries/valencia-flash-flood-2024-peak-discharge-manning-equation.md, made with the maths of
// the Manning weir calculator (src/lib/sci/openchannel.ts: section, manningQ, flowAt, broadWeir, rectWeir).
// Run: node scripts/blog-figures/valencia-flash-flood-2024-peak-discharge-manning-equation.mjs   (rewrites the charts)
import fs from 'node:fs';
import { section, manningQ, flowAt, broadWeir, rectWeir } from '../../src/lib/sci/openchannel.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/valencia-flash-flood-2024-peak-discharge-manning-equation.md', import.meta.url);
const r = (v, d = 2) => +v.toFixed(d);

// From the paper (Muñoz et al. 2025, Water 17: 3177, doi:10.3390/w17213177, CC BY 3.0). Huerto Mulet (site 14, Júcar):
// wetted area 603 m², hydraulic radius 7.83 m, slope 1.2 m/km, water level 11.81 m, Manning velocity 2.40 m/s and
// discharge 1448 m³/s, gauge peak 1500 m³/s, gauge velocity 2.5 m/s. Other sites: area × velocity.
const A = 603, R = 7.83, S = 0.0012;
// A rectangle with the same area and hydraulic radius (OUR stand-in for the real cross-section): b y = A, b + 2y = A/R.
const P = A / R, y = (P - Math.sqrt(P * P - 8 * A)) / 4, b = P - 2 * y;
const rect = { kind: 'rect', b };
const sec = section(rect, y);
// n that makes Manning give the paper's 1448 m³/s (bisection on the tool's manningQ).
let lo = 0.005, hi = 0.5; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; manningQ(rect, y, m, S) > 1448 ? (lo = m) : (hi = m); }
const nFit = (lo + hi) / 2;
const at = (n) => manningQ(rect, y, n, S);
const fl = flowAt(rect, y, at(nFit), S);
const table = [0.018, 0.035, 0.045, nFit, 0.07, 0.1].map((n) => ({ n: r(n, 4), Q: Math.round(at(n)), V: r(at(n) / A, 2) }));
// Same n, but the area-and-velocity check: 603 × 2.5 (gauge velocity).
const areaVel = { huerto: Math.round(603 * 2.5), torrent: Math.round(2271 * 2.5), carlet: Math.round(1679 * 2.5), algemesi: Math.round(243 * 2.5), torrentPm20: [Math.round(2271 * 2.0), Math.round(2271 * 3.0)] };

// Poyo weir (site 18): 3225 m³/s at 5.5 m head. Crest length that a broad-crested (Cd 0.95) or sharp-crested (Cd 0.62)
// weir would need, then that weir's flow at 4.5 m, where the gauge failed (it had logged 2280 m³/s).
const Lb = 3225 / broadWeir(1, 5.5), Ls = 3225 / rectWeir(1, 5.5);
const weir = { Lbroad: r(Lb, 1), Lsharp: r(Ls, 1), Qbroad45: Math.round(broadWeir(Lb, 4.5)), Qsharp45: Math.round(rectWeir(Ls, 4.5)) };

// Figure 1: discharge against Manning's n for the Huerto Mulet section.
const NS = Array.from({ length: 96 }, (_, i) => 0.015 + i * 0.001);
const fig1 = chart({
  title: 'Huerto Mulet peak: discharge depends on Manning\'s n', xLabel: 'Manning\'s n', yLabel: 'Discharge (m³/s)',
  series: [{ name: 'Manning, A 603 m², R 7.83 m, S 0.0012', kind: 'line', x: NS.map((n) => r(n, 3)), y: NS.map((n) => Math.round(at(n))) }],
  hlines: [{ y: 1500, text: 'gauge peak 1500' }], vlines: [{ x: r(nFit, 3), text: `n = ${nFit.toFixed(3)}` }], xDomain: [0.015, 0.11], yDomain: [0, 6000], height: 270,
  desc: `Manning discharge through a section with the paper's area, hydraulic radius and slope, for roughness n from 0.015 to 0.11. The paper's 1448 m3/s needs n = ${nFit.toFixed(3)}; n = 0.018 would give ${Math.round(at(0.018))} m3/s.`,
});
// Figure 2: weir rating curve for the implied broad-crested weir.
const HS = Array.from({ length: 61 }, (_, i) => i * 0.1);
const fig2 = chart({
  title: 'Poyo weir: a rating curve through 3225 m³/s at 5.5 m', xLabel: 'Head above the crest (m)', yLabel: 'Discharge (m³/s)',
  series: [
    { name: `Broad-crested, L ${weir.Lbroad} m`, kind: 'line', x: HS.map((h) => r(h, 1)), y: HS.map((h) => Math.round(broadWeir(Lb, h))) },
    { name: 'Gauge log and weir estimate', kind: 'dots', x: [4.5, 5.5], y: [2280, 3225], size: 4, colour: 'var(--ink)' },
  ],
  vlines: [{ x: 4.5, text: 'gauge failed', left: true }], xDomain: [0, 6], yDomain: [0, 3800], height: 270,
  desc: `Discharge over a broad-crested weir ${weir.Lbroad} m long (discharge coefficient 0.95), scaled to pass 3225 m3/s at 5.5 m. At 4.5 m it gives ${weir.Qbroad45} m3/s, near the 2280 m3/s the gauge logged before it failed.`,
});

console.log(JSON.stringify({ equivRect: { b: r(b, 2), y: r(y, 2), A: r(sec.A, 1), R: r(sec.A / sec.P, 3) }, nFit: r(nFit, 4), V: r(fl.V, 3), Fr: r(fl.Fr, 3), tau: r(fl.tau, 1), E: r(fl.E, 2), table, areaVel, weir }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'manning', figure(fig1, 'Figure 1. Manning discharge for a rectangle with the paper\'s wetted area (603 m²), hydraulic radius (7.83 m) and slope (1.2 m per km) at Huerto Mulet on the Júcar, as the roughness n changes. A recomputation from values in the paper\'s text; the rectangle is our stand-in for the real section.'));
  md = inject(md, 'weir', figure(fig2, 'Figure 2. A broad-crested weir rating curve made to pass the paper\'s 3225 m³/s at a 5.5 m head on the Poyo (our assumption about the weir type), with the flow the gauge had logged when it failed at about 4.5 m.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
