// Figures and numbers for src/blog/discoveries/plumbogottlobite-calculated-density-site-occupancy-cif.md, made with
// the maths of the CIF viewer (src/lib/sci/cif.ts: readStructure, expand, summary).
// Run: node scripts/blog-figures/plumbogottlobite-calculated-density-site-occupancy-cif.mjs
import fs from 'node:fs';
import { readStructure, expand, summary } from '../../src/lib/sci/cif.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/plumbogottlobite-calculated-density-site-occupancy-cif.md', import.meta.url);

// Inputs from the paper: Kampf et al. (2026), Eur. J. Mineral. 38, 209-216, doi:10.5194/ejm-38-209-2026 (CC BY 4.0).
// Single-crystal cell a 7.6104(7), b 6.1091(6), c 9.3968(8) A, V 436.88(7) A^3, Z = 4, space group Pnma;
// published calculated density 5.359 g/cm3; empirical formula (Pb0.89[]0.11)(Mg0.77Cu0.19Mn0.09)(VO4)(OH) + 0.12 H.
const CELL = { a: 7.6104, b: 6.1091, c: 9.3968 };
const POWDER = { a: 7.599, b: 6.118, c: 9.394 };
const DCALC = 5.359;
// The eight general-position operations of Pnma (space group 62), as any CIF for this mineral would list them.
const OPS = ['x,y,z', '-x+1/2,-y,z+1/2', '-x,y+1/2,-z', 'x+1/2,-y+1/2,-z+1/2', '-x,-y,-z', 'x+1/2,y,-z+1/2', 'x,-y+1/2,z', '-x+1/2,y+1/2,z+1/2'];

/**
 * A CIF for the mineral. The cell, the space group and the site occupancies are the paper's; the fractional
 * coordinates are OUR placeholders on Wyckoff positions of the right multiplicity (4c = x, 1/4, z and 4a = 0, 0, 0),
 * because the paper's coordinate table is published as an image. Density needs only the cell volume and the cell
 * contents, so the placeholders do not touch it; bond lengths from this file would be meaningless.
 */
function makeCif({ pb = 0.89, m = [['Mg', 0.77], ['Cu', 0.19], ['Mn', 0.09]], h = 1.12, cell = CELL } = {}) {
  const sites = [['Pb1', 'Pb', 0.1, 0.25, 0.4, pb]];
  m.forEach(([el, occ], i) => sites.push([`M${i + 1}`, el, 0, 0, 0, occ]));
  sites.push(['V1', 'V', 0.42, 0.25, 0.12, 1]);
  [[0.3, 0.25], [0.55, 0.25], [0.35, 0.05], [0.15, 0.75], [0.65, 0.65]].forEach(([x, z], i) => sites.push([`O${i + 1}`, 'O', x, 0.25, z, 1]));
  sites.push(['H1', 'H', 0.2, 0.25, 0.8, h]);
  const sum = [`Pb${pb}`, ...m.map(([el, occ]) => `${el}${occ}`), 'V1', 'O5', `H${h}`].join(' ');
  return `data_plumbogottlobite
_chemical_name_mineral 'plumbogottlobite'
_cell_length_a ${cell.a}
_cell_length_b ${cell.b}
_cell_length_c ${cell.c}
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'P n m a'
_symmetry_Int_Tables_number 62
_chemical_formula_sum '${sum}'
loop_
_symmetry_equiv_pos_as_xyz
${OPS.map((o) => `'${o}'`).join('\n')}
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
${sites.map((s) => s.join(' ')).join('\n')}
`;
}

/** Read a CIF through the tool's own chain and report what its Structure card shows. */
function run(opts) {
  const s = readStructure(makeCif(opts)), at = expand(s), sm = summary(s, at);
  return { atoms: at.length, V: sm.volume, Z: sm.Z, zSource: sm.zSource, mass: sm.mass, formula: sm.formula, rho: sm.density, warnings: s.warnings };
}

const IDEAL = { pb: 1, m: [['Mg', 1]], h: 1 };
const REFINED = { pb: 0.941, m: [['Mg', 0.7], ['Cu', 0.3]], h: 1 };
const cases = {
  empirical: run({}),
  ideal: run(IDEAL),
  refined: run(REFINED),
  powderCell: run({ cell: POWDER }),
  idealPowder: run({ ...IDEAL, cell: POWDER }),
};

// How the density moves with the Pb-site occupancy, for three M-site fillings.
const pbs = Array.from({ length: 41 }, (_, i) => 0.8 + i * 0.005);
const mSets = [
  { name: 'M = Mg0.77Cu0.19Mn0.09 (paper)', m: [['Mg', 0.77], ['Cu', 0.19], ['Mn', 0.09]] },
  { name: 'M = Mg (ideal)', m: [['Mg', 1]] },
  { name: 'M = Mg0.70Cu0.30 (refined)', m: [['Mg', 0.7], ['Cu', 0.3]] },
];
const pbCurves = mSets.map((set) => ({ ...set, y: pbs.map((pb) => +run({ pb, m: set.m, h: 1.12 }).rho.toFixed(4)) }));
// The Pb occupancy that reproduces the published density exactly, for the paper's M site (bisection).
const pbForDcalc = (() => {
  let lo = 0.7, hi = 1.1;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; run({ pb: mid }).rho < DCALC ? (lo = mid) : (hi = mid); }
  return (lo + hi) / 2;
})();

// How the density moves with substitution on the M site only (Pb fixed at 0.89).
const xs = Array.from({ length: 51 }, (_, i) => i * 0.01);
const mCurves = [
  { name: 'Mg replaced by Cu', el: 'Cu' },
  { name: 'Mg replaced by Mn', el: 'Mn' },
].map((c) => ({ ...c, y: xs.map((x) => +run({ pb: 0.89, m: [['Mg', 1 - x], [c.el, x]], h: 1.12 }).rho.toFixed(4)) }));

const fig1 = chart({
  title: 'Calculated density against Pb-site occupancy', xLabel: 'Occupancy of the Pb site (atoms per site)', yLabel: 'Density (g cm⁻³)',
  series: pbCurves.map((c) => ({ name: c.name, kind: 'line', x: pbs, y: c.y })),
  xDomain: [0.8, 1.0], yDomain: [5.1, 5.8],
  hlines: [{ y: DCALC, text: `paper: ${DCALC} g cm⁻³` }], vlines: [{ x: 0.89, text: '0.89' }],
  desc: `Density worked out by the CIF viewer for the published cell as the Pb-site occupancy changes from 0.80 to 1.00, for three fillings of the M site. The published value of ${DCALC} g per cubic centimetre is met at a Pb occupancy of about ${pbForDcalc.toFixed(3)}.`,
  height: 290,
});
const fig2 = chart({
  title: 'The M site hardly moves the density', xLabel: 'Fraction of the M site taken by the heavier metal', yLabel: 'Density (g cm⁻³)',
  series: mCurves.map((c) => ({ name: c.name, kind: 'line', x: xs, y: c.y })),
  xDomain: [0, 0.5], yDomain: [5.28, 5.48],
  hlines: [{ y: DCALC, text: `paper: ${DCALC}` }], vlines: [{ x: 0.19, text: 'paper: Cu 0.19' }],
  desc: 'Density for the same cell with the Pb site held at 0.89, as magnesium on the M site is replaced by copper or by manganese. Half the site swapped changes the density by less than 3 per cent.',
  height: 280,
});

const out = {
  cases: Object.fromEntries(Object.entries(cases).map(([k, v]) => [k, { atoms: v.atoms, V: +v.V.toFixed(3), Z: v.Z, mass: +v.mass.toFixed(3), formula: v.formula, rho: +v.rho.toFixed(4), zSource: v.zSource, warnings: v.warnings.length }])),
  pbForDcalc: +pbForDcalc.toFixed(4),
  dRho_dPb: +((run({ pb: 0.9 }).rho - run({ pb: 0.88 }).rho) / 0.02).toFixed(3),
  cuSwing: +(mCurves[0].y[50] - mCurves[0].y[0]).toFixed(4),
  emp_vs_paper_pct: +((cases.empirical.rho / DCALC - 1) * 100).toFixed(3),
  ideal_vs_paper_pct: +((cases.ideal.rho / DCALC - 1) * 100).toFixed(2),
  powder_vs_single_pct: +((cases.powderCell.rho / cases.empirical.rho - 1) * 100).toFixed(3),
};
console.log(JSON.stringify(out, null, 1));
console.log('--- the CIF we feed the tool (empirical formula) ---\n' + makeCif());

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'density', figure(fig1, `Figure 1. Density worked out by the CIF viewer's maths from the published cell (436.88 Å³, Z = 4) as the lead-site occupancy changes, for three fillings of the magnesium site. The dashed line is the paper's calculated density of ${DCALC} g cm⁻³; the paper's own occupancy of 0.89 is marked.`));
  md = inject(md, 'msite', figure(fig2, 'Figure 2. The same calculation with the lead site fixed at 0.89, swapping magnesium for copper or manganese on the M site. The M site is a much weaker lever on the density than the lead vacancies.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
