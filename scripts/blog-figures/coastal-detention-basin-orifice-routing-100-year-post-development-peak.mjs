// Figures for src/blog/discoveries/coastal-detention-basin-orifice-routing-100-year-post-development-peak.md, made with the maths of the
// Detention pond router (src/lib/sci/pond.ts: level-pool routing, orifice and weir, orifice sizing).
// Run: node scripts/blog-figures/coastal-detention-basin-orifice-routing-100-year-post-development-peak.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { storageAt, tableHydro, route, sizeOrifice, outflow } from '../../src/lib/sci/pond.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/coastal-detention-basin-orifice-routing-100-year-post-development-peak.md', import.meta.url);

// Inputs from the paper: Chathuranika et al. (2026), Front. Built Environ. 12, doi:10.3389/fbuil.2026.1731955 (CC BY 4.0).
// Catchment 0.06 km2 (6 ha); 2-h design storms; Table 4 runoff depths (mm) and peaks (m3/s) pre/post development;
// pond outline 158.03 x 81.84 m, maximum depth 1.40 m, stated maximum storage ~17,200 m3; modified storage 44,400 and 55,800 m3
// (outlines 200.57 x 98.18 and 201.23 x 99.21 m); pre-development 10-year peak 1.44 m3/s used as the target.
const AREA = 6e4; // m2
const STORMS = [
  { id: '10-year', rain: 162.31, preD: 98.30, postD: 138.94, postQ: 3.16 },
  { id: '50-year', rain: 226.31, preD: 160.53, postD: 204.82, postQ: 4.49 },
  { id: '100-year', rain: 259.08, preD: 192.89, postD: 236.98, postQ: 5.04 },
];
const TARGET = 1.44, TPEAK = 3600; // TPEAK = our assumption: peak one hour into the storm; triangular hydrograph
const dims = (z, h) => ({ L: 158.03 - 2 * z * h, W: 81.84 - 2 * z * h });
// Side slope (our assumption: the outline is the top of the water at 1.40 m) that gives the paper's ~17,200 m3.
let lo = 0, hi = 6; for (let i = 0; i < 60; i++) { const z = (lo + hi) / 2; const d = dims(z, 1.4); (storageAt({ L: d.L, W: d.W, z, depth: 1.4 }, 1.4) > 17200 ? (lo = z) : (hi = z)); }
const Z = (lo + hi) / 2, dm = dims(Z, 1.4), G = { L: dm.L, W: dm.W, z: Z, depth: 1.4 };
const O = { d: 1, cd: 0.6, invert: 0, crest: 1.4, weirL: 3.81, cw: 1.7 }; // orifice: our assumption (round, Cd 0.6, at the bottom, as in the tool)

const res = STORMS.map((s) => {
  const vol = (s.postD / 1000) * AREA, tb = (2 * vol) / s.postQ;
  const end = Math.round(tb / 60 * 100) / 100 * 60; // end of the storm to 0.01 minute, as typed into the tool
  const H = tableHydro([0, TPEAK, end], [0, s.postQ, 0]);
  const d = sizeOrifice(H.Q, G, O, 8 * 3600, TARGET);
  const r = route(H.Q, G, { ...O, d }, 8 * 3600, 10);
  const open = route(H.Q, G, { ...O, d: 3 }, 8 * 3600, 10);
  return { ...s, vol, tb, H, d, r, open, cPre: s.preD / s.rain, cPost: s.postD / s.rain };
});
const f = (n, k = 2) => +n.toFixed(k);
console.log(JSON.stringify({ Z: f(Z, 3), top: [158.03, 81.84], bottom: [f(G.L, 1), f(G.W, 1)], S14: f(storageAt(G, 1.4), 0), mod50depth: f(44400 / (200.57 * 98.18), 2), mod100depth: f(55800 / (201.23 * 99.21), 2),
  rows: res.map((x) => ({ id: x.id, cPreRain162: f(x.preD / x.rain * 100, 1), cPostRain162: f(x.postD / x.rain * 100, 1), cPre: f(x.cPre * 100, 1), volPre: Math.round(x.preD / 1000 * AREA), volPost: Math.round(x.vol), tb: Math.round(x.tb), endMin: f(x.H.end/60,2), volTab: Math.round(x.H.volume), d: f(x.d, 3), peakO: f(x.r.peakO, 3), hMax: f(x.r.hMax, 2), S: Math.round(x.r.sMax), spill: x.r.spill, tPO: f(x.r.tPeakO / 60, 0), drainH: f(x.r.drain / 3600, 1), openPeak: f(x.open.peakO, 2), openH: f(x.open.hMax, 2) })) }));

const R100 = res[2];
const T = R100.r.t.map((t) => t / 60), keep = T.map((t, i) => i % 6 === 0 && t <= 240);
const fig1 = chart({
  title: '100-year storm through the existing pond', xLabel: 'Minutes from the start of the storm', yLabel: 'Flow (m³/s)',
  series: [
    { name: 'Inflow (assumed shape)', kind: 'line', x: T.filter((_, i) => keep[i]), y: R100.r.I.filter((_, i) => keep[i]).map((v) => f(v, 3)) },
    { name: 'Outflow, orifice sized for 1.44', kind: 'line', x: T.filter((_, i) => keep[i]), y: R100.r.O.filter((_, i) => keep[i]).map((v) => f(v, 3)) },
  ],
  xDomain: [0, 240], yDomain: [0, 6], hlines: [{ y: 1.44, text: 'pre-development 1.44' }],
  desc: `Triangular inflow with a peak of 5.04 m3/s and a ${(R100.vol).toFixed(0)} m3 volume, and the outflow of an existing-size pond with a ${R100.d.toFixed(2)} m round orifice: peak ${R100.r.peakO.toFixed(2)} m3/s, highest water ${R100.r.hMax.toFixed(2)} m.`, height: 300,
});
const dd = Array.from({ length: 40 }, (_, i) => 0.3 + i * 0.05);
const fig2 = chart({
  title: 'Peak outflow against orifice size, 100-year storm', xLabel: 'Round orifice diameter (m)', yLabel: 'Peak outflow (m³/s)',
  series: [{ name: 'Existing-size pond', kind: 'line', x: dd, y: dd.map((d) => f(route(R100.H.Q, G, { ...O, d }, 8 * 3600, 20).peakO, 3)) }],
  xDomain: [0.3, 2.25], yDomain: [0, 5], hlines: [{ y: 1.44, text: 'target 1.44' }, { y: 3.51, text: 'paper: 3.51' }],
  desc: 'Routed peak outflow of the 100-year post-development storm for round orifices from 0.3 to 2.25 m. The curve crosses 1.44 m3/s near 1.05 m and never reaches the paper\'s 3.51.', height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'route', figure(fig1, 'Figure 1. The 100-year post-development storm, routed through a pond of the paper\'s outline (our assumptions: triangular inflow peaking at 60 minutes, side slope chosen to hold 17,200 m³, a round orifice with coefficient 0.6 at the pond bottom). Not the paper\'s own model.'));
  md = inject(md, 'orifice', figure(fig2, 'Figure 2. How the routed peak falls as the orifice grows, for the same storm and pond.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
