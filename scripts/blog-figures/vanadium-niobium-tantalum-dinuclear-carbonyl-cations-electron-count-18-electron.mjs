// Figures and numbers for src/blog/discoveries/vanadium-niobium-tantalum-dinuclear-carbonyl-cations-electron-count-18-electron.md,
// made with the maths of the 18-electron rule tool (src/lib/sci/ecount.ts: count, METALS).
// Run: node scripts/blog-figures/vanadium-niobium-tantalum-dinuclear-carbonyl-cations-electron-count-18-electron.mjs
import fs from 'node:fs';
import { count, METALS } from '../../src/lib/sci/ecount.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/vanadium-niobium-tantalum-dinuclear-carbonyl-cations-electron-count-18-electron.md', import.meta.url);
const grp = (m) => METALS.find((x) => x[0] === m)[1];
const CO = (n) => [{ id: 'CO', n }];

// Species named in the paper's text: V(CO)6+ (16 electrons, saturated), V(CO)3+, and the VM(CO)9+ cations (M = Nb, Ta)
// described as an (OC)6M fragment bonded to a V(CO)3+ fragment. The fragment split is the paper's own description.
const n = [3, 4, 5, 6, 7, 8];
const vn = n.map((k) => count(grp('V'), +1, CO(k)).ve);
const fig1 = chart({
  title: 'Valence electrons in V(CO)n⁺',
  xLabel: 'Number of CO ligands n', yLabel: 'Valence electron count at V',
  desc: 'Covalent-method valence electron count of the vanadium carbonyl cation as the number of CO ligands grows from 3 to 8. It crosses 16 at six CO and 18 at seven.',
  series: [{ name: 'V(CO)n⁺', x: n, y: vn, kind: 'line' }, { name: 'V(CO)n⁺ points', x: n, y: vn, kind: 'dots', size: 4, noLegend: true }],
  hlines: [{ y: 18, text: '18-electron shell' }, { y: 16, text: '16' }],
  vlines: [{ x: 6, text: 'V(CO)6⁺ seen', left: true }],
  xDomain: [2.5, 8.5], yDomain: [8, 22], xTicks: n, yTicks: [10, 12, 14, 16, 18, 20], xFmt: (v) => String(v), yFmt: (v) => String(v),
});

const mm = Array.from({ length: 9 }, (_, i) => i);
const nbLine = mm.map((b) => count(grp('Nb'), 0, CO(6), b).ve);
const vLine = mm.map((b) => count(grp('V'), +1, CO(3), b).ve);
const fig2 = chart({
  title: 'Electron count against metal–metal bonds',
  xLabel: 'Metal–metal bonds counted at the metal', yLabel: 'Valence electron count',
  desc: 'Electron count of niobium in (OC)6Nb and vanadium in V(CO)3 plus, as the number of metal-metal bonds counted at each grows. Niobium reaches 18 with one bond; vanadium would need eight.',
  series: [
    { name: 'Nb in (OC)6Nb–', x: mm, y: nbLine, kind: 'line', colour: 'var(--c-blog)' },
    { name: 'V in –V(CO)3⁺', x: mm, y: vLine, kind: 'line', colour: 'var(--c-tools)' },
  ],
  hlines: [{ y: 18, text: '18' }], xDomain: [0, 8], yDomain: [8, 26], xTicks: mm, yTicks: [10, 14, 18, 22, 26], xFmt: (v) => String(v), yFmt: (v) => String(v),
});

const nb1 = count(grp('Nb'), 0, CO(6), 1), v1 = count(grp('V'), +1, CO(3), 1), ta1 = count(grp('Ta'), 0, CO(6), 1);
const total = 5 + 5 + 2 * 9 - 1;
console.log(JSON.stringify({
  V_CO_n_plus: Object.fromEntries(n.map((k, i) => [k, vn[i]])),
  V_CO6_plus: count(5, 1, CO(6)), V_CO7_plus: count(5, 1, CO(7)), V_CO3_plus: count(5, 1, CO(3)),
  Nb_CO6: count(5, 0, CO(6)), Nb_CO6_mm1: nb1.ve, Ta_CO6_mm1: ta1.ve, V_CO3_plus_mm1: v1.ve,
  sumPerMetal: nb1.ve + v1.ve, totalElectrons: total, sharedBondAdds: nb1.ve + v1.ve - total,
  vNeeded: 18 - count(5, 1, CO(3)).ve, vMmNeeded: vLine.findIndex((v) => v >= 18),
  nbMmNeeded: nbLine.findIndex((v) => v >= 18),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'vco', figure(fig1, 'Figure 1. Covalent-method valence electron count at vanadium in V(CO)n⁺, from the 18-electron rule tool\'s maths. Six CO give 16 electrons (the saturated cation the paper describes); a seventh would give 18.'));
  md = inject(md, 'mm', figure(fig2, 'Figure 2. How the count at each metal of a VM(CO)9⁺ cation changes with the number of metal–metal bonds credited to it, for the (OC)6M + V(CO)3⁺ fragments the paper describes (M = Nb shown; Ta counts the same). Niobium reaches 18 with one bond; vanadium stays far short.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
