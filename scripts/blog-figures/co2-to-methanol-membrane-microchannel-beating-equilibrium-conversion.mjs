// Figures for src/blog/discoveries/co2-to-methanol-membrane-microchannel-beating-equilibrium-conversion.md,
// made with the maths of the Equilibrium solver (src/lib/sci/equilibrium.ts).
// Run: node scripts/blog-figures/co2-to-methanol-membrane-microchannel-beating-equilibrium-conversion.mjs
import fs from 'node:fs';
import { parseReaction, solveIce, quotient, kAtT } from '../../src/lib/sci/equilibrium.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/co2-to-methanol-membrane-microchannel-beating-equilibrium-conversion.md', import.meta.url);

// From the paper: Ullah A, Hashim NA, Rabuni MF, Junaidi MUM, Ahmed A, Mohammed MG, Siddique MS (2026),
// Membranes 16(1): 45, doi:10.3390/membranes16010045 (CC BY 4.0). Cu-ZnO-Al2O3 on an LTA zeolite membrane in a
// microchannel reactor: 220 C, 3.0 MPa, H2:CO2 = 3:1, WHSV 18,000 h-1, CO2 conversion about 82 %, methanol
// selectivity 51.6 %, methanol yield 42.3 %; the authors quote an equilibrium conversion of 27 % at 250 C and 5.0 MPa
// from another paper.
const P = 30, T_C = 220, T_K = T_C + 273.15, RATIO = 3;
const X_MEAS = 0.82, SEL = 0.516, YIELD = 0.423;
const CITED = { x: 0.27, T_C: 250, P: 50 };

// Standard formation data at 298.15 K (CRC Handbook, gas phase): CO2 -393.51 / -394.36, CH3OH -201.0 / -162.3,
// H2O -241.83 / -228.57 kJ/mol (enthalpy / Gibbs energy).
const dH = (-201.0 - 241.83 + 393.51) * 1000; // J/mol
const dG = (-162.3 - 228.57 + 394.36) * 1000;
const K298 = Math.exp(-dG / (8.314462618 * 298.15)); // bar^-2
const Kp = (T) => kAtT(K298, 298.15, T, dH);

const MeOH = parseReaction('CO2(g) + 3H2(g) ⇌ CH3OH(g) + H2O(g)');
const RWGS = parseReaction('CO2(g) + H2(g) ⇌ CO(g) + H2O(g)');
// RWGS from the same tables: CO -110.53 / -137.17 kJ/mol.
const dHr = (-110.53 - 241.83 + 393.51) * 1000, dGr = (-137.17 - 228.57 + 394.36) * 1000;
const Kr298 = Math.exp(-dGr / (8.314462618 * 298.15)), Kr = (T) => kAtT(Kr298, 298.15, T, dHr);

/** Equilibrium in a closed vessel: partial pressures in bar, the ICE table the tool solves. */
const fixedVolume = (K) => { const p0 = [P / (1 + RATIO), (P * RATIO) / (1 + RATIO), 0, 0]; const r = solveIce(MeOH, p0, K); return { x: r.conversion / 100, eq: r.eq, total: r.eq.reduce((a, b) => a + b, 0) }; };
/** The same, then squeezed back to the working pressure, which is what the tool's volume control does. */
function squeezed(K, p = P, n = 40) {
  let scale = 1, last;
  for (let i = 0; i < n; i++) {
    const p0 = [(p / (1 + RATIO)) * scale, ((p * RATIO) / (1 + RATIO)) * scale, 0, 0];
    const r = solveIce(MeOH, p0, K), total = r.eq.reduce((a, b) => a + b, 0);
    last = { x: r.conversion / 100, total, scale, ratio: 1 / scale };
    if (Math.abs(total - p) < 1e-12) break;
    scale *= p / total;
  }
  return last;
}
/** Conversion at constant total pressure when a share f of the water made is pulled out through the membrane. */
function withRemoval(K, f, p = P) {
  const q = (x) => {
    const n = [1 - x, RATIO - 3 * x, x, (1 - f) * x], tot = n.reduce((a, b) => a + b, 0);
    return quotient(MeOH, n.map((v) => (p * v) / tot)) - K;
  };
  let lo = 1e-12, hi = Math.min(1, RATIO / 3) - 1e-12;
  if (q(hi) < 0) return hi;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (q(m) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Water partial pressure that lets a given conversion sit at equilibrium. */
function waterFor(K, x, p = P) {
  let lo = 1e-12, hi = 20;
  const g = (w) => { const n = [1 - x, RATIO - 3 * x, x, w], tot = n.reduce((a, b) => a + b, 0); return quotient(MeOH, n.map((v) => (p * v) / tot)) - K; };
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; }
  const w = (lo + hi) / 2, n = [1 - x, RATIO - 3 * x, x, w], tot = n.reduce((a, b) => a + b, 0);
  return { w, pH2O: (P * w) / tot, share: w / x };
}
/** RWGS: no change in the number of gas molecules, so pressure does not matter. */
const rwgs = (T) => { const r = solveIce(RWGS, [1, RATIO, 0, 0], Kr(T)); return r.conversion / 100; };

const here = squeezed(Kp(T_K)), cited = squeezed(Kp(CITED.T_C + 273.15), CITED.P), closed = fixedVolume(Kp(T_K));
const need423 = waterFor(Kp(T_K), YIELD), need82 = waterFor(Kp(T_K), X_MEAS);
const out = {
  dH_kJ: dH / 1000, dG_kJ: dG / 1000, K298: +K298.toPrecision(5), Kp220: +Kp(T_K).toPrecision(5), Kp250: +Kp(523.15).toPrecision(5),
  closedVessel: { x: +(100 * closed.x).toFixed(2), total: +closed.total.toFixed(3) },
  constantPressure220: { x: +(100 * here.x).toFixed(2), volumeRatio: +here.ratio.toFixed(4) },
  citedConditions: { x: +(100 * cited.x).toFixed(2), paper: 100 * CITED.x },
  rwgs220: +(100 * rwgs(T_K)).toFixed(2), Kr220: +Kr(T_K).toPrecision(4),
  measured: { conversion: 100 * X_MEAS, selectivity: 100 * SEL, yield: 100 * YIELD, overEquilibrium: +(YIELD / here.x).toFixed(2) },
  waterNeeded: { for42: { pH2O: +need423.pH2O.toFixed(4), removed: +(100 * (1 - need423.share)).toFixed(2) }, for82: { pH2O: +need82.pH2O.toFixed(4), removed: +(100 * (1 - need82.share)).toFixed(3) } },
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: equilibrium conversion against temperature at both pressures, with what the reactor did.
const Ts = Array.from({ length: 101 }, (_, i) => 150 + i * 1.5);
const fig1 = chart({
  title: 'Equilibrium CO₂ conversion to methanol, 3:1 H₂:CO₂', xLabel: 'Temperature (°C)', yLabel: 'CO₂ converted at equilibrium (%)',
  series: [
    { name: '30 bar (the paper\'s reactor)', kind: 'line', x: Ts, y: Ts.map((t) => 100 * squeezed(Kp(t + 273.15)).x) },
    { name: '50 bar (the conditions it quotes)', kind: 'line', x: Ts, y: Ts.map((t) => 100 * squeezed(Kp(t + 273.15), 50).x) },
  ],
  xDomain: [150, 300], yDomain: [0, 70],
  hlines: [{ y: 100 * YIELD, text: 'methanol yield measured: 42.3 %' }],
  vlines: [{ x: T_C, text: '220 °C', dy: 14 }, { x: CITED.T_C, text: '250 °C', dy: 34 }],
  desc: 'Equilibrium CO2 conversion to methanol against temperature at 30 and 50 bar for a 3:1 hydrogen to carbon dioxide feed. At 220 C and 30 bar it is 24 %, below the 42.3 % methanol yield the reactor achieved.',
  height: 300,
});

// Figure 2: how far water must be removed for a given conversion.
const fs2 = Array.from({ length: 121 }, (_, i) => i / 120);
const fig2 = chart({
  title: 'Take the water out and the ceiling rises', xLabel: 'Share of the water made that leaves through the membrane (%)', yLabel: 'Equilibrium CO₂ conversion (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: fs2.map((f) => 100 * f), y: fs2.map((f) => 100 * withRemoval(Kp(T_K), f)) }],
  xDomain: [0, 100], yDomain: [0, 100],
  hlines: [{ y: 100 * YIELD, text: 'methanol yield 42.3 %' }, { y: 100 * X_MEAS, text: 'CO₂ conversion 82 %' }],
  desc: 'Equilibrium conversion at 220 C and 30 bar against the share of product water removed. Removing 80 % of the water lifts the ceiling past the measured methanol yield; reaching 82 % conversion by this route alone would need almost all of it gone.',
  height: 300,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'teq', figure(fig1, 'Figure 1. The equilibrium limit for carbon dioxide hydrogenation to methanol, solved with the Equilibrium solver\'s ICE table at constant total pressure, from standard formation data and the van \'t Hoff equation. The reactor\'s own conditions are 220 °C and 30 bar; the 27 % the paper quotes belongs to 250 °C and 50 bar.'));
  md = inject(md, 'water', figure(fig2, 'Figure 2. What removing the product water buys, at 220 °C and 30 bar with a 3:1 feed. The curve is the same equilibrium condition with the water held down to a share of what the reaction makes.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
