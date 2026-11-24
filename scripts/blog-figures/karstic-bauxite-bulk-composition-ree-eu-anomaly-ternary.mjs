// Figures for src/blog/discoveries/karstic-bauxite-bulk-composition-ree-eu-anomaly-ternary.md, made with the maths of
// the Ternary plot tool (src/lib/sci/ternary.ts: closure, triangle coordinates, compositional centres, normalise, Eu anomaly).
// Run: node scripts/blog-figures/karstic-bauxite-bulk-composition-ree-eu-anomaly-ternary.mjs
import fs from 'node:fs';
import { closure, toXY, centres, normalise, anomaly } from '../../src/lib/sci/ternary.ts';
import { chart, figure, inject, watermark, COLOURS } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/karstic-bauxite-bulk-composition-ree-eu-anomaly-ternary.md', import.meta.url);

// Values as printed in the running text of Sofis, N., Ntouros, E. P. and Kalaitzidis, S. (2025), Minerals 15(8): 804,
// doi:10.3390/min15080804 (CC BY 4.0): b1 karstic bauxite, Parnassos-Ghiona, Greece.
const GROUPS = [
  { name: 'Bauxite (mean of 66)', Al: 42.80, Si: 7.43, Fe: 17.33 },
  { name: 'Transitional PR1-2', Al: 27.39, Si: 23.97, Fe: 11.13 },
  { name: 'Clay-rich PR1-11', Al: 57.98, Si: 4.75, Fe: 2.06 },
];
const TIO2 = 2.67; // mean TiO2 of the bauxites; the paper reports a mean TiO2/Al2O3 of 0.06
const REE = { sum: 647, lree: 496, hree: 151, sumOther: 527, min: 182, max: 2781 }; // mg/kg
const EU = { lo: 0.56, hi: 0.69, mean: 0.62 }; // Eu/Eu*
// Bauxite means and the continental-crust averages the paper quotes (Mason and Moore), both in mg/kg.
const TRACE = [
  ['Sc', 45, 22], ['V', 324, 135], ['Cr', 355, 100], ['Ni', 217, 75], ['Zr', 468, 165], ['La', 131, 30], ['Ce', 230, 60],
];

const r = (v, n = 2) => +v.toFixed(n);
const rows = GROUPS.map((g) => {
  const c = closure(g.Al, g.Si, g.Fe);
  return { name: g.name, sum: r(g.Al + g.Si + g.Fe), pct: c.map((v) => r(v * 100, 1)), xy: toXY(...c).map((v) => r(v, 4)) };
});
// The tool closes each row first, then takes the centres, so we do the same.
const ctr = centres(GROUPS.map((g) => closure(g.Al, g.Si, g.Fe)));
const centreRows = { arithmetic: ctr.arithmetic.map((v) => r(v * 100, 1)), geometric: ctr.geometric.map((v) => r(v * 100, 1)) };

// Trace elements against continental crust, with the tool's normalise().
const enrich = normalise(TRACE.map((t) => t[1]), TRACE.map((t) => t[2])).map((v) => r(v, 2));
// The paper's own consistency checks.
const checks = {
  tiAl: r(TIO2 / GROUPS[0].Al, 4),
  lreePlusHree: REE.lree + REE.hree,
  lreeShare: r((REE.lree / (REE.lree + REE.hree)) * 100, 1),
  euShortfall: [EU.hi, EU.mean, EU.lo].map((e) => r((1 - e) * 100, 1)),
};
// How the Eu anomaly works: it is a ratio of raw concentrations times one constant from the reference set.
// Reference values here are MADE UP for illustration (fibub bundles no chondrite table; users supply their own).
const DEMO_REF = { Sm: 0.25, Eu: 0.09, Gd: 0.33 };
const demoRaw = { Sm: 40, Eu: 8.2, Gd: 36 };
const nrm = normalise([demoRaw.Sm, demoRaw.Eu, demoRaw.Gd], [DEMO_REF.Sm, DEMO_REF.Eu, DEMO_REF.Gd]);
const demoEu = r(anomaly(nrm[1], nrm[0], nrm[2]), 4);
const demoK = r(Math.sqrt(DEMO_REF.Sm * DEMO_REF.Gd) / DEMO_REF.Eu, 4);
const demoDirect = r((demoRaw.Eu / Math.sqrt(demoRaw.Sm * demoRaw.Gd)) * demoK, 4);
const n3 = normalise([demoRaw.Sm * 3, demoRaw.Eu * 3, demoRaw.Gd * 3], [DEMO_REF.Sm, DEMO_REF.Eu, DEMO_REF.Gd]);
const demoScaled = r(anomaly(n3[1], n3[0], n3[2]), 4);
// What Eu/Eu* = 0.62 pins in the raw data: Eu / sqrt(Sm x Gd) = 0.62 / k.
const rawRatio = [EU.lo, EU.mean, EU.hi].map((e) => r(e / demoK, 4));

// Figure 1: the Al2O3-SiO2-Fe2O3 triangle, drawn by hand with the tool's toXY().
function ternaryFig() {
  const W = 560, H = 360, S = 300, ox = 140, oy = 318; // triangle side S, bottom-left corner at (ox, oy)
  const P = (a, b, c) => { const [x, y] = toXY(a, b, c); return [ox + x * S, oy - y * S]; };
  const out = [`<svg class="blog-fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ternary diagram of alumina, silica and iron oxide. The mean b1 bauxite plots at 63 per cent alumina, 11 per cent silica and 26 per cent iron oxide; the transitional sample is richer in silica and the clay-rich sample richer in alumina." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif">`,
    `<title>Bauxite bulk chemistry on the Al₂O₃–SiO₂–Fe₂O₃ triangle</title>`,
    `<text x="14" y="20" style="fill:var(--ink);font-weight:600;font-size:14px">Bauxite bulk chemistry: Al₂O₃–SiO₂–Fe₂O₃</text>`];
  for (let g = 20; g < 100; g += 20) { // grid lines parallel to each side
    const f = g / 100;
    const sets = [[P(f, 1 - f, 0), P(f, 0, 1 - f)], [P(1 - f, f, 0), P(0, f, 1 - f)], [P(1 - f, 0, f), P(0, 1 - f, f)]];
    for (const [[x1, y1], [x2, y2]] of sets) out.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:var(--line)"/>`);
  }
  const corners = [P(1, 0, 0), P(0, 1, 0), P(0, 0, 1)];
  out.push(`<path d="M${corners.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>`);
  out.push(`<text x="${corners[0][0]}" y="${corners[0][1] - 10}" text-anchor="middle" style="fill:var(--ink)">Al₂O₃</text>`);
  out.push(`<text x="${corners[1][0] - 6}" y="${corners[1][1] + 18}" text-anchor="middle" style="fill:var(--ink)">SiO₂</text>`);
  out.push(`<text x="${corners[2][0] + 6}" y="${corners[2][1] + 18}" text-anchor="middle" style="fill:var(--ink)">Fe₂O₃</text>`);
  rows.forEach((g, i) => {
    const [x, y] = P(GROUPS[i].Al, GROUPS[i].Si, GROUPS[i].Fe);
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" style="fill:${COLOURS[i % 3]}"/>`);
    out.push(`<text x="14" y="${44 + i * 18}" style="fill:${COLOURS[i % 3]}">■</text><text x="30" y="${44 + i * 18}" style="fill:var(--muted)">${g.name}: ${g.pct[0]} / ${g.pct[1]} / ${g.pct[2]} %</text>`);
  });
  const [gx, gy] = P(...ctr.geometric);
  out.push(`<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="4" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>`);
  out.push(`<text x="${(gx + 8).toFixed(1)}" y="${(gy + 4).toFixed(1)}" style="fill:var(--muted)">geometric centre</text>`);
  out.push(watermark(W, H), '</svg>');
  return out.join('');
}

// Figure 2: the bauxite means against the continental-crust averages the paper quotes.
const idx = TRACE.map((_, i) => i);
const fig2 = chart({
  title: 'Bauxite trace elements against average continental crust', xLabel: 'Element', yLabel: 'Bauxite ÷ crustal average',
  series: [{ name: 'Enrichment', kind: 'dots', x: idx, y: enrich, size: 5 }],
  xDomain: [-0.5, TRACE.length - 0.5], yDomain: [0, 5],
  xTicks: idx, xFmt: (t) => TRACE[t] ? TRACE[t][0] : '',
  hlines: [{ y: 1, text: 'crustal average' }],
  desc: `Each element's mean in the b1 bauxites divided by the continental-crust average the paper quotes. Lanthanum is enriched ${enrich[5]} times and cerium ${enrich[6]} times; chromium ${enrich[2]} times.`, height: 290,
});

console.log(JSON.stringify({ rows, centreRows, enrich: Object.fromEntries(TRACE.map((t, i) => [t[0], enrich[i]])), checks,
  demo: { nrm: nrm.map((v) => r(v, 3)), demoEu, demoK, demoDirect, demoScaled, rawRatio } }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ternary', figure(ternaryFig(), 'Figure 1. The paper\'s mean bauxite and its two other lithologies on the Al₂O₃–SiO₂–Fe₂O₃ triangle, placed with the Ternary plot tool\'s own closure and triangle coordinates. The open circle is the geometric (compositional) centre of the three.'));
  md = inject(md, 'enrich', figure(fig2, 'Figure 2. The bauxite means divided by the continental-crust averages the paper quotes, worked out with the tool\'s normalise function. Values above the dashed line are enrichments.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [ternaryFig(), fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
