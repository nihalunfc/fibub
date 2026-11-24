// Figures for src/blog/discoveries/medaka-sperm-activation-solutions-osmolarity-recomputed.md, made with the maths
// of the Osmolarity calculator (src/lib/sci/osmolar.ts: osmolarity, osmoticKPa, formulaMass).
// Run: node scripts/blog-figures/medaka-sperm-activation-solutions-osmolarity-recomputed.mjs
import fs from 'node:fs';
import { osmolarity, osmoticKPa, solute, formulaMass } from '../../src/lib/sci/osmolar.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/medaka-sperm-activation-solutions-osmolarity-recomputed.md', import.meta.url);

// Compositions from the paper's text: Sayyari A, Krogenæs AK, Mayer I, Labbé C (2024), Scientific Reports 14: 14736,
// doi:10.1038/s41598-024-65376-8 (CC BY 4.0). HBSS is labelled 300 mOsm/kg, the Kurokura solution "K 300", and the
// freezing mixture is 16 % (vol) methanol with 126 mM sucrose at 600 mOsm/kg.
const HBSS = [['NaCl', 137], ['KCl', 5.4], ['CaCl2', 1.3], ['MgSO4', 1.0], ['Na2HPO4', 0.25], ['KH2PO4', 0.44], ['NaHCO3', 4.2], ['glucose', 5.55]];
const KUROKURA = [['NaCl', 180], ['KCl', 2.68], ['CaCl2', 1.36], ['NaHCO3', 2.38]];
const METHANOL_DENSITY = 0.7918; // g/mL at 20 °C (standard value)
const METHANOL_M = formulaMass('CH4O');
const PHI_REAL = 0.93; // our assumption for the salts at these concentrations; glucose and sucrose stay at 1

const rows = (comp, phiOf, scale = 1) => comp.map(([id, mM]) => ({ name: id, mmolL: mM * scale, i: solute(id).i, phi: phiOf(id), penetrating: !!solute(id).penetrating }));
const ideal = () => 1, real = (id) => (id === 'glucose' || id === 'sucrose' ? 1 : PHI_REAL);
const totals = (comp) => ({ ideal: osmolarity(rows(comp, ideal)).total, real: osmolarity(rows(comp, real)).total, parts: osmolarity(rows(comp, ideal)).parts });

const hbss = totals(HBSS), kur = totals(KUROKURA);

// Figure 1: computed osmolarity against the osmotic coefficient used.
const phis = Array.from({ length: 41 }, (_, i) => 0.8 + i * 0.005);
const curve = (comp) => phis.map((p) => +osmolarity(rows(comp, (id) => (id === 'glucose' ? 1 : p))).total.toFixed(2));
const fig1 = chart({
  title: 'Two solutions both labelled 300 mOsm', xLabel: 'Osmotic coefficient φ used for the salts', yLabel: 'Osmolarity (mOsm/L)',
  series: [
    { name: 'Kurokura (K 300)', kind: 'line', x: phis, y: curve(KUROKURA) },
    { name: 'HBSS 300', kind: 'line', x: phis, y: curve(HBSS) },
  ],
  xDomain: [0.8, 1], yDomain: [240, 390],
  hlines: [{ y: 300, text: 'label: 300' }],
  vlines: [{ x: PHI_REAL, text: 'φ 0.93', left: true }],
  desc: `Osmolarity worked out from each recipe, against the osmotic coefficient assumed for the salts. The HBSS recipe lands near 300 mOsm per litre, while the Kurokura recipe would need a coefficient near 0.80 to reach 300.`,
  height: 280,
});

// Figure 2: adding methanol to a freezing mixture: total osmolarity against tonicity (effective osmolarity).
const pcts = Array.from({ length: 41 }, (_, i) => i * 0.5); // 0 to 20 % methanol by volume
const mix = (pct) => {
  const dil = 1 - pct / 100; // the extender and sucrose are diluted by the methanol added
  const r = [...rows(HBSS, real, dil), { name: 'Sucrose', mmolL: 126 * dil, i: 1, phi: 1, penetrating: false },
    { name: 'Methanol', mmolL: (pct * 10 * METHANOL_DENSITY * 1000) / METHANOL_M, i: 1, phi: 1, penetrating: true }];
  return osmolarity(r);
};
const fig2 = chart({
  title: 'Methanol: total osmolarity and tonicity part ways', xLabel: 'Methanol added (% by volume)', yLabel: 'mOsm/L',
  series: [
    { name: 'Total osmolarity', kind: 'line', x: pcts, y: pcts.map((p) => +mix(p).total.toFixed(1)) },
    { name: 'Effective (tonicity)', kind: 'line', x: pcts, y: pcts.map((p) => +mix(p).effective.toFixed(1)) },
  ],
  xDomain: [0, 20], yDomain: [0, 5200],
  vlines: [{ x: 16, text: '16 %', left: true }],
  desc: `Adding methanol to a sucrose and salt extender lifts the total osmolarity to nearly five thousand milliosmoles per litre at sixteen per cent by volume, while the effective osmolarity, which is what a cell finally sees, stays near four hundred.`,
  height: 280,
});

const m16 = mix(16);
console.log(JSON.stringify({
  hbss: { ideal: +hbss.ideal.toFixed(1), real: +hbss.real.toFixed(1), kPa25: +osmoticKPa(hbss.ideal, 25).toFixed(0), parts: hbss.parts.map((p) => `${p.name} ${p.mOsm.toFixed(2)}`) },
  kurokura: { ideal: +kur.ideal.toFixed(1), real: +kur.real.toFixed(1), kPa25: +osmoticKPa(kur.ideal, 25).toFixed(0) },
  ratio: +(kur.ideal / hbss.ideal).toFixed(3), phiForKurokura300: +(300 / kur.ideal).toFixed(3),
  methanol: { molarMass: METHANOL_M, mM16: +((16 * 10 * METHANOL_DENSITY * 1000) / METHANOL_M).toFixed(0), gPer100mL: +(16 * METHANOL_DENSITY).toFixed(2) },
  mix16: { total: +m16.total.toFixed(0), effective: +m16.effective.toFixed(0) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'solutions', figure(fig1, `Figure 1. Osmolarity worked out from each published recipe with the Osmolarity calculator's maths, against the osmotic coefficient assumed for the salts. HBSS sits near its 300 mOsm label; the Kurokura recipe comes out about ${Math.round((kur.ideal / hbss.ideal - 1) * 100)} % higher.`));
  md = inject(md, 'methanol', figure(fig2, 'Figure 2. Total osmolarity and effective osmolarity (tonicity) of a freezing mixture as methanol is added, with the salts and sucrose diluted by the methanol. Methanol crosses membranes, so it adds thousands of mOsm to the total and almost nothing to the tonicity once it has equilibrated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
