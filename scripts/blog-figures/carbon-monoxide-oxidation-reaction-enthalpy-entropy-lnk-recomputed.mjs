// Figures for src/blog/discoveries/carbon-monoxide-oxidation-reaction-enthalpy-entropy-lnk-recomputed.md, made with
// the maths of the Thermochemistry calculator (src/lib/sci/thermo.ts: reaction values from standard formation data,
// dG at any temperature, ln K and the sign-change temperature).
// Run: node scripts/blog-figures/carbon-monoxide-oxidation-reaction-enthalpy-entropy-lnk-recomputed.mjs
import fs from 'node:fs';
import { lookup, reaction, dGat, lnK, crossover } from '../../src/lib/sci/thermo.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/carbon-monoxide-oxidation-reaction-enthalpy-entropy-lnk-recomputed.md', import.meta.url);

// The reaction the paper analyses: 2CO(g) + O2(g) -> 2CO2(g). Formation values come from the tool's own built-in
// table (CRC Handbook / NIST at 298.15 K), not from the paper.
const put = (nu, f, phase) => { const t = lookup(f, phase); return { nu, H: t.H, S: t.S, G: t.G }; };
const rxn = reaction([put(-2, 'CO', 'g'), put(-1, 'O2', 'g'), put(2, 'CO2', 'g')]);
const Tx = crossover(rxn.dH, rxn.dS);

// The paper's own values, for comparison (Wang et al. 2026, Molecules 31(10): 1729).
const PAPER = { dH: -565.968, dS: -173.006, dG: -514.38, lnK298: 207.6, lnK338: 180.48, dCp: -13.42 };

// Kirchhoff correction with the paper's heat-capacity difference: how much the constant-dH, constant-dS
// simplification costs over the 15 to 65 degrees C window.
const kirch = (T) => {
  const dH = rxn.dH + (PAPER.dCp * (T - 298.15)) / 1000;
  const dS = rxn.dS + PAPER.dCp * Math.log(T / 298.15);
  return { dH, dS, dG: dH - (T * dS) / 1000 };
};

const Trange = Array.from({ length: 51 }, (_, i) => 288.15 + i);
const fig1 = chart({
  title: 'CO oxidation: ln K across the paper\'s 15 to 65 °C window', xLabel: 'Temperature (°C)', yLabel: 'ln K',
  series: [
    { name: 'Tool: ΔH and ΔS held constant', kind: 'line', x: Trange.map((T) => +(T - 273.15).toFixed(2)), y: Trange.map((T) => +lnK(dGat(rxn.dH, rxn.dS, T), T).toFixed(3)) },
    { name: 'With the paper\'s ΔCp correction', kind: 'line', x: Trange.map((T) => +(T - 273.15).toFixed(2)), y: Trange.map((T) => +lnK(kirch(T).dG, T).toFixed(3)), colour: 'var(--c-tools)', dash: '5 4' },
    { name: 'Paper\'s two stated values', kind: 'dots', x: [25, 65], y: [PAPER.lnK298, PAPER.lnK338], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [15, 65], yDomain: [178, 218],
  desc: `ln K for 2CO + O2 to 2CO2 falls almost straight from about 215 at 15 degrees C to about 180 at 65 degrees C; the paper's two stated values sit on the line, and the heat-capacity correction is too small to see.`,
  height: 290,
});

const Tbig = Array.from({ length: 120 }, (_, i) => 300 + i * 32);
const fig2 = chart({
  title: 'The same reaction turns around at 3,274 K', xLabel: 'Temperature (K)', yLabel: 'ΔG (kJ/mol)',
  series: [{ name: '', noLegend: true, kind: 'line', x: Tbig, y: Tbig.map((T) => +dGat(rxn.dH, rxn.dS, T).toFixed(2)) }],
  xDomain: [300, 4100], yDomain: [-540, 160],
  hlines: [{ y: 0, text: 'ΔG = 0' }],
  vlines: [{ x: Math.round(Tx), text: `${Math.round(Tx)} K` }],
  desc: `Gibbs energy for CO oxidation rises from about -514 kJ per mole at room temperature and crosses zero near 3274 kelvin, above which carbon dioxide starts to come apart again.`,
  height: 270,
});

const out = {
  tool: { dH: +rxn.dH.toFixed(3), dS: +rxn.dS.toFixed(3), dG: +rxn.dG.toFixed(3), lnK298: +lnK(rxn.dG, 298.15).toFixed(3), K298: rxn.K.toExponential(4) },
  paper: PAPER,
  gaps: { dH: +(rxn.dH - PAPER.dH).toFixed(3), dS: +(rxn.dS - PAPER.dS).toFixed(3), dG: +(rxn.dG - PAPER.dG).toFixed(3), lnK298: +(lnK(rxn.dG, 298.15) - PAPER.lnK298).toFixed(2) },
  at338: { dG: +dGat(rxn.dH, rxn.dS, 338.15).toFixed(3), lnK: +lnK(dGat(rxn.dH, rxn.dS, 338.15), 338.15).toFixed(3), K: Math.exp(lnK(dGat(rxn.dH, rxn.dS, 338.15), 338.15)).toExponential(3) },
  at288: { lnK: +lnK(dGat(rxn.dH, rxn.dS, 288.15), 288.15).toFixed(3) },
  kirchhoff338: { dH: +kirch(338.15).dH.toFixed(3), dS: +kirch(338.15).dS.toFixed(3), dG: +kirch(338.15).dG.toFixed(3), lnK: +lnK(kirch(338.15).dG, 338.15).toFixed(3) },
  crossoverK: +Tx.toFixed(1), crossoverC: +(Tx - 273.15).toFixed(0),
  perMolCO: { dH: +(rxn.dH / 2).toFixed(2) },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lnk', figure(fig1, 'Figure 1. ln K for 2CO + O₂ → 2CO₂ over the paper\'s working range, from the tool\'s built-in formation values, with and without a heat-capacity correction. The two dots are the values the paper states.'));
  md = inject(md, 'crossover', figure(fig2, 'Figure 2. The same reaction taken far beyond the paper\'s range. ΔG crosses zero at about 3,274 K, which is where carbon dioxide begins to dissociate.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
