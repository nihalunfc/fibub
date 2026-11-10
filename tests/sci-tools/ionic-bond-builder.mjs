// #1295 Ionic bond builder. Shells checked against the school table for Z = 1 to 20, formulas for all 30
// metal–non-metal pairs checked to be neutral (sum of charges 0) and in lowest terms, and the well-known ones by
// name (NaCl, MgCl₂, MgO, Al₂O₃, CaF₂, K₂S, Li₃N, Ca₃N₂, AlN).
import { shells, valence, METALS, NONMETALS, counts, formula, plainFormula, cation, anion, ionShells, moves, gives, takes, compoundName } from '../../src/lib/sci/ionic-school.ts';

export default async (check) => {
  const S = (Z) => shells(Z).join(',');
  check('shells', S(3) === '2,1' && S(8) === '2,6' && S(11) === '2,8,1' && S(13) === '2,8,3' && S(17) === '2,8,7' && S(18) === '2,8,8' && S(19) === '2,8,8,1' && S(20) === '2,8,8,2');
  check('valence', valence(12) === 2 && valence(7) === 5);
  const by = (a, s) => a.find((x) => x.sym === s);
  const F = (m, n) => formula(by(METALS, m), by(NONMETALS, n));
  check('known formulas', F('Na', 'Cl') === 'NaCl' && F('Mg', 'Cl') === 'MgCl₂' && F('Mg', 'O') === 'MgO' && F('Al', 'O') === 'Al₂O₃' && F('Ca', 'F') === 'CaF₂' && F('K', 'S') === 'K₂S' && F('Li', 'N') === 'Li₃N' && F('Ca', 'N') === 'Ca₃N₂' && F('Al', 'N') === 'AlN');
  let ok = true;
  const g = (a, b) => (b ? g(b, a % b) : a);
  for (const m of METALS) for (const n of NONMETALS) { const c = counts(m, n); if (c.metal * gives(m) !== c.non * takes(n) || g(c.metal, c.non) !== 1 || moves(m, n).length !== c.electrons) ok = false; }
  check('all 30 pairs neutral, lowest terms, one move per electron', ok);
  check('ions', cation(by(METALS, 'Na')) === 'Na⁺' && cation(by(METALS, 'Al')) === 'Al³⁺' && anion(by(NONMETALS, 'O')) === 'O²⁻' && anion(by(NONMETALS, 'N')) === 'N³⁻' && anion(by(NONMETALS, 'Cl')) === 'Cl⁻');
  check('ion shells are noble-gas shells', ionShells(by(METALS, 'Mg'), true).join() === '2,8' && ionShells(by(NONMETALS, 'Cl'), false).join() === '2,8,8' && ionShells(by(NONMETALS, 'O'), false).join() === '2,8' && ionShells(by(METALS, 'Li'), true).join() === '2');
  const mv = moves(by(METALS, 'Al'), by(NONMETALS, 'O'));
  const need = [0, 0, 0]; mv.forEach(([, j]) => need[j]++);
  check('Al₂O₃: 6 electrons, each O gets 2', mv.length === 6 && need.every((x) => x === 2));
  check('names and plain formula', compoundName(by(METALS, 'Al'), by(NONMETALS, 'O')) === 'aluminium oxide' && plainFormula(by(METALS, 'Mg'), by(NONMETALS, 'Cl')) === 'MgCl2');
};
