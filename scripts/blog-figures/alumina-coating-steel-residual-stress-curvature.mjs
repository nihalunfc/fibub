// Figures for src/blog/discoveries/alumina-coating-steel-residual-stress-curvature.md, made with the maths of the
// Thermal mismatch stress tool (src/lib/sci/thermalstress.ts).
// Run: node scripts/blog-figures/alumina-coating-steel-residual-stress-curvature.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { filmStress, stoneyCurvature, multilayer, curvatureToBow } from '../../src/lib/sci/thermalstress.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/alumina-coating-steel-residual-stress-curvature.md', import.meta.url);

// Paper (Li et al. 2025, Coatings 15, 913, doi:10.3390/coatings15080913, CC BY 4.0): 304 steel bar 70 x 5 x 1 mm,
// Es = 200 GPa, nu_s = 0.29; Al2O3 coatings 0.2 mm (S1) and 0.7 mm (S2); stress-free temperatures 280 and 540 C;
// largest residual stress after the second cooling 803.3 MPa (S1) and 780.3 MPa (S2), compressive in the coating.
const ES = 200000, NUS = 0.29, HS = 1.0, LEN = 70;
const S = [{ id: 'S1', hf: 0.2, sigma: 803.3, T0: 280 }, { id: 'S2', hf: 0.7, sigma: 780.3, T0: 540 }];
// Our assumptions (typical handbook values, not from the paper): sprayed alumina E = 80 GPa, nu = 0.2,
// CTE 8.1 ppm/K; 304 steel CTE 17.3 ppm/K.
const EF = 80000, NUF = 0.2, AF = 8.1e-6, AS = 17.3e-6;

// Beam (plate) solution of a two-layer stack with a film misfit strain e, film on top.
const stack = (hf, e) => multilayer([{ E: ES / (1 - NUS), t: HS, eps: 0 }, { E: EF / (1 - NUF), t: hf, eps: e }]);
// Misfit that gives curvature k (bisection; curvature rises with e).
function misfitFor(hf, k) { let lo = -0.1, hi = 0.1; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (stack(hf, m).k > k) hi = m; else lo = m; } return (lo + hi) / 2; }

const rows = S.map((s) => {
  const k = stoneyCurvature(ES, NUS, HS, s.hf, s.sigma); // 1/mm (sign: the film side bulges for compression)
  const ml = stack(s.hf, misfitFor(s.hf, k)), mean = (ml.stress[1].bottom + ml.stress[1].top) / 2;
  const mis = filmStress(EF, NUF, { a0: AF }, { a0: AS }, s.T0, 20).sigma;
  return { id: s.id, hf: s.hf, k: +k.toFixed(6), R_mm: +(1 / k).toFixed(1), bow70_mm: +curvatureToBow(k, LEN).toFixed(3), beamMean: +mean.toFixed(0), beamRange: [Math.round(ml.stress[1].bottom), Math.round(ml.stress[1].top)], steelTop: Math.round(ml.stress[0].top), ratio: +(s.sigma / -mean).toFixed(3), mismatch20: +mis.toFixed(0) };
});

// Figure 1: how far Stoney overestimates the coating stress as the coating thickens (same curvature both ways).
const hr = Array.from({ length: 41 }, (_, i) => 10 ** (-3 + i * 0.075)); // hf/hs from 0.001 to 1
const ratio = hr.map((h) => { const k = stoneyCurvature(ES, NUS, HS, h, 100); const ml = stack(h, misfitFor(h, k)); return +(100 / -((ml.stress[1].bottom + ml.stress[1].top) / 2)).toFixed(4); });
const fig1 = chart({
  title: 'Stoney\'s answer over the full beam answer', xLabel: 'Coating thickness / steel thickness (log scale)', yLabel: 'Stoney ÷ beam stress',
  series: [
    { name: 'Ratio', kind: 'line', x: hr.map((h) => Math.log10(h)), y: ratio },
    ...rows.map((r) => ({ name: '', kind: 'dots', x: [Math.log10(r.hf)], y: [r.ratio], size: 4.5, noLegend: true, colour: 'var(--c-tools)', label: { text: r.id, dx: -8, dy: -8, anchor: 'end' } })),
  ],
  xDomain: [-3, 0], yDomain: [0.8, 2.6], xTicks: [-3, -2, -1, 0], xFmt: (t) => String(10 ** t), hlines: [{ y: 1, text: 'thin-film limit' }],
  desc: `Stoney's formula agrees with a full two-layer beam solution for thin coatings but overestimates the coating stress as the coating thickens: by ${((rows[0].ratio - 1) * 100).toFixed(0)}% for S1 and ${((rows[1].ratio - 1) * 100).toFixed(0)}% for S2.`, height: 270,
});

// Figure 2: the stress a pure CTE mismatch would leave in the coating, from each stress-free temperature (simulated).
const TT = Array.from({ length: 61 }, (_, i) => 20 + i * 10);
const fig2 = chart({
  title: 'Coating stress from the expansion mismatch alone (simulated)', xLabel: 'Temperature (°C)', yLabel: 'Coating stress (MPa)',
  series: S.map((s) => ({ name: `${s.id}: stress-free at ${s.T0} °C`, kind: 'line', x: TT, y: TT.map((T) => +filmStress(EF, NUF, { a0: AF }, { a0: AS }, s.T0, T).sigma.toFixed(1)) })),
  xDomain: [20, 620], yDomain: [-500, 100], hlines: [{ y: 0, text: '' }],
  desc: `With handbook expansion coefficients, cooling from the stress-free temperature to 20 °C leaves ${rows[0].mismatch20} MPa (S1) and ${rows[1].mismatch20} MPa (S2) in the coating; negative is compression.`, height: 270,
});

console.log(JSON.stringify({ rows }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratio', figure(fig1, 'Figure 1. For the same measured bend, how much larger Stoney\'s coating stress is than the average coating stress from a full two-layer beam solution, for a 1 mm steel bar and an assumed 80 GPa coating. The paper\'s two coatings are marked.'));
  md = inject(md, 'mismatch', figure(fig2, 'Figure 2. The coating stress that the difference in thermal expansion alone would cause, starting stress-free at each sample\'s flat temperature from the paper. Handbook expansion values and an assumed coating stiffness: a simulation, not the measured stresses.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
