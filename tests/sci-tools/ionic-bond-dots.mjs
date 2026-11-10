// #1294 Ionic bond builder. Checked against the school shell rule (2, 8, 8, 2) and known formulas: NaCl, MgO,
// MgCl₂, Na₂O, CaF₂, Al₂O₃, AlN, Li₃N, K₂S; Na⁺ has shells 2, 8 and Cl⁻ has 2, 8, 8.
import { METALS, NONMETALS, shells, charge, ionShells, ratio, formula, transfers, ionText } from '../../src/lib/sci/ionic-school.ts';
export default async (check) => {
  const M = Object.fromEntries(METALS.map((e) => [e.sym, e])), X = Object.fromEntries(NONMETALS.map((e) => [e.sym, e]));
  check('ionic: shells Na 2,8,1; Cl 2,8,7; Ca 2,8,8,2; O 2,6', shells(11).join() === '2,8,1' && shells(17).join() === '2,8,7' && shells(20).join() === '2,8,8,2' && shells(8).join() === '2,6');
  check('ionic: charges Na +1, Mg +2, Al +3, O −2, N −3', charge(11, true) === 1 && charge(12, true) === 2 && charge(13, true) === 3 && charge(8, false) === -2 && charge(7, false) === -3);
  check('ionic: Na⁺ is 2,8; Cl⁻ is 2,8,8; O²⁻ is 2,8', ionShells(11, true).join() === '2,8' && ionShells(17, false).join() === '2,8,8' && ionShells(8, false).join() === '2,8');
  const f = (m, x) => formula(M[m], X[x]);
  check('ionic: NaCl, MgO, MgCl₂, Na₂O, CaF₂, Al₂O₃, AlN, Li₃N, K₂S', [f('Na', 'Cl'), f('Mg', 'O'), f('Mg', 'Cl'), f('Na', 'O'), f('Ca', 'F'), f('Al', 'O'), f('Al', 'N'), f('Li', 'N'), f('K', 'S')].join() === 'NaCl,MgO,MgCl₂,Na₂O,CaF₂,Al₂O₃,AlN,Li₃N,K₂S');
  check('ionic: Al₂O₃ moves 6 electrons; Mg → 2 Cl moves 2', ratio(M.Al, X.O).electrons === 6 && ratio(M.Mg, X.Cl).electrons === 2);
  let ok = true;
  for (const m of METALS) for (const x of NONMETALS) {
    const r = ratio(m, x), t = transfers(m, x), lose = charge(m.z, true), gain = -charge(x.z, false);
    if (r.nm * lose !== r.nx * gain || t.length !== r.electrons) ok = false;
    for (let i = 0; i < r.nm; i++) if (t.filter((e) => e.from === i).length !== lose) ok = false;
    for (let j = 0; j < r.nx; j++) if (t.filter((e) => e.to === j).length !== gain) ok = false;
  }
  check('ionic: all 30 pairs: charges balance and every atom gives or takes exactly its electrons', ok);
  check('ionic: ion labels Mg²⁺, Cl⁻, N³⁻', ionText('Mg', 2) === 'Mg²⁺' && ionText('Cl', -1) === 'Cl⁻' && ionText('N', -3) === 'N³⁻');
};
