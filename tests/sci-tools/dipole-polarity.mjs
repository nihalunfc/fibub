// #1109 Dipole moment and polarity. Polar/non-polar verdicts checked against the textbook outcomes for 19 molecules
// (measured dipole moment zero or not, standard data-book values); ΔEN from the Pauling values; the NH₃/NF₃ lone pair rule.
import { polarity, PRESETS, MEASURED, nameOf } from '../../src/lib/sci/dipole.ts';

export default async (check) => {
  let ok = 0;
  for (const p of PRESETS) { const r = polarity(p.central, p.outer); if (typeof r !== 'string' && r.polar === MEASURED[p.id] > 0) ok++; else console.log('  dipole mismatch', p.id, r); }
  check(`dipole: all ${PRESETS.length} molecules match the measured polar/non-polar`, ok === PRESETS.length && PRESETS.length === 19);
  const w = polarity('O', ['H', 'H']), c = polarity('C', ['O', 'O']);
  check('dipole: H2O O–H ΔEN 1.24 towards O, net 2·1.24·cos(54.75°)', w.bonds[0].dEN === -1.24 && Math.abs(w.size - 2 * 1.24 * Math.sqrt(1 / 3)) < 0.01 && w.shape === 'bent (V-shaped)');
  check('dipole: CO2 polar bonds (0.89) but zero net', c.bonds[0].dEN === 0.89 && c.size === 0 && !c.polar && c.why.includes('symmetric'));
  const nh3 = polarity('N', ['H', 'H', 'H']), nf3 = polarity('N', ['F', 'F', 'F']);
  check('dipole: NH3 lone pair adds, NF3 lone pair opposes', nh3.lp === 'adds' && nf3.lp === 'opposes' && nh3.bonds[0].dEN === -0.84 && nf3.bonds[0].dEN === 0.94);
  check('dipole: H2O lone pairs add', w.lp === 'adds');
  const series = [['H', 'H', 'H', 'H'], ['Cl', 'H', 'H', 'H'], ['Cl', 'Cl', 'H', 'H'], ['Cl', 'Cl', 'Cl', 'H'], ['Cl', 'Cl', 'Cl', 'Cl']].map((o) => polarity('C', o).polar);
  check('dipole: CH4 → CCl4 series non-polar, polar ×3, non-polar', series.join() === 'false,true,true,true,false');
  check('dipole: CH3Cl and CHCl3 have the same model size (mirror cases)', polarity('C', ['Cl', 'H', 'H', 'H']).size === polarity('C', ['Cl', 'Cl', 'Cl', 'H']).size);
  check('dipole: XeF4 and SF6 cancel, SF4 and ClF3 do not', !polarity('Xe', ['F', 'F', 'F', 'F']).polar && !polarity('S', Array(6).fill('F')).polar && polarity('S', ['F', 'F', 'F', 'F']).polar && polarity('Cl', ['F', 'F', 'F']).polar);
  check('dipole: SF5Cl polar', polarity('S', ['Cl', 'F', 'F', 'F', 'F', 'F']).polar);
  check('dipole: HCl single bond reason', polarity('Cl', ['H']).why.startsWith('Only one bond'));
  check('dipole: names', ['CH₃Cl', 'CH₂Cl₂', 'CHCl₃', 'HCl', 'H₂O', 'NF₃', 'XeF₄'].join() === [nameOf('C', ['Cl', 'H', 'H', 'H']), nameOf('C', ['Cl', 'Cl', 'H', 'H']), nameOf('C', ['Cl', 'Cl', 'Cl', 'H']), nameOf('Cl', ['H']), nameOf('O', ['H', 'H']), nameOf('N', ['F', 'F', 'F']), nameOf('Xe', ['F', 'F', 'F', 'F'])].join());
  check('dipole: error for impossible bonds', typeof polarity('C', ['O', 'O', 'O']) === 'string');
};
