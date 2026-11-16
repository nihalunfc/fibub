// Figures for src/blog/discoveries/orc-plate-heat-exchanger-r245fa-heat-transfer-coefficients.md, made with the maths of the
// Heat exchanger sizing tool (src/lib/sci/eng-hx.ts: effectiveness, rate, lmtd).
// Run: node scripts/blog-figures/orc-plate-heat-exchanger-r245fa-heat-transfer-coefficients.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { effectiveness, rate, lmtd } from '../../src/lib/sci/eng-hx.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/orc-plate-heat-exchanger-r245fa-heat-transfer-coefficients.md', import.meta.url);

// Our own illustrative (simulated) ORC evaporator, boiling section only: silicone oil at 120 °C (inside the paper's 100-130 °C
// heat-source range), 0.5 kg/s, cp 1.6 kJ/kg·K; R245fa boiling at 75 °C (inside the paper's 62.8-86.2 °C), modelled as a very
// large cold flow so Cr is about 0. Area 2 m². Not the paper's data.
const Thi = 120, Tsat = 75, Ch = 0.5 * 1600, A = 2;
const Cc = 1000 * 4180; // stands in for a boiling stream (Cr ≈ 0)

const ntu = Array.from({ length: 41 }, (_, i) => i * 0.1);
const fig1 = chart({
  title: 'Effectiveness against NTU, counterflow', xLabel: 'NTU = UA / Cmin', yLabel: 'Effectiveness ε',
  series: [
    { name: 'Boiling zone (Cr = 0)', kind: 'line', x: ntu, y: ntu.map((n) => +effectiveness('counter', n, 0).toFixed(4)) },
    { name: 'Liquid preheat (Cr = 0.5)', kind: 'line', x: ntu, y: ntu.map((n) => +effectiveness('counter', n, 0.5).toFixed(4)) },
    { name: 'Parallel, Cr = 0.5', kind: 'line', x: ntu, y: ntu.map((n) => +effectiveness('parallel', n, 0.5).toFixed(4)) },
  ],
  xDomain: [0, 4], yDomain: [0, 1], desc: 'Effectiveness rises with NTU and levels off; a boiling stream (Cr = 0) gives the highest effectiveness for the same NTU.', height: 300,
});

const Us = [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500];
const rows = Us.map((U) => { const r = rate('counter', U * A, { Thi, Tci: Tsat, Ch, Cc }); return { U, Q: r.Q / 1000, Tho: r.Tho, eps: r.eps, L: lmtd(Thi - r.Tco, r.Tho - Tsat) }; });
const fig2 = chart({
  title: 'Simulated ORC evaporator: heat taken from the oil', xLabel: 'Overall U (W/m²·K)', yLabel: 'Duty (kW)',
  series: [{ name: 'Duty', kind: 'line', x: Us, y: rows.map((r) => +r.Q.toFixed(2)) }],
  xDomain: [0, 1500], yDomain: [0, 36], desc: 'With 2 m² of plate, duty rises from about 8 kW at U = 100 to about 35 kW at U = 1500, flattening as the oil outlet nears the boiling temperature.', height: 280,
});
console.log(JSON.stringify(rows.map((r) => ({ U: r.U, Q: +r.Q.toFixed(2), Tho: +r.Tho.toFixed(2), eps: +r.eps.toFixed(3), L: +r.L.toFixed(2) }))));
console.log('eps counter NTU1 Cr0', effectiveness('counter', 1, 0).toFixed(3), 'Cr0.5', effectiveness('counter', 1, 0.5).toFixed(3), 'par', effectiveness('parallel', 1, 0.5).toFixed(3));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'entu', figure(fig1, 'Figure 1. Counterflow effectiveness against NTU from the tool\'s maths, for a boiling stream (Cr = 0) and a liquid preheat (Cr = 0.5), with parallel flow for comparison. Textbook relations; no paper data.'));
  md = inject(md, 'duty', figure(fig2, 'Figure 2. Simulated: silicone oil at 120 °C, 0.5 kg/s, heating R245fa boiling at 75 °C across 2 m² of plate, for a range of overall U. Our illustration, not the study\'s measurements.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written');
}
