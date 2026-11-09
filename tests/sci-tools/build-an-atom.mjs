// #1081 Build an atom. Checked against the standard school table of shell distributions and valencies for
// Z = 1 to 20 (written out by hand from the Bohr–Bury rules, independent of the code) and isotope facts.
import * as A from '../../src/lib/sci/atom.ts';

const TABLE = [ // Z, shells, valency
  [1, '1', 1], [2, '2', 0], [3, '2,1', 1], [4, '2,2', 2], [5, '2,3', 3], [6, '2,4', 4], [7, '2,5', 3], [8, '2,6', 2], [9, '2,7', 1], [10, '2,8', 0],
  [11, '2,8,1', 1], [12, '2,8,2', 2], [13, '2,8,3', 3], [14, '2,8,4', 4], [15, '2,8,5', 3], [16, '2,8,6', 2], [17, '2,8,7', 1], [18, '2,8,8', 0], [19, '2,8,8,1', 1], [20, '2,8,8,2', 2],
];
export default async (check) => {
  check('atom: shells and valency for Z 1 to 20 match the school table', TABLE.every(([z, s, v]) => A.shells(z).join(',') === s && A.valency(z) === v));
  check('atom: no electrons, no shells', A.shells(0).length === 0 && A.valenceElectrons(0) === 0);
  { const a = A.build(11, 12, 10); check('atom: Na+ (11 p, 12 n, 10 e) is sodium-23, charge +1, shells 2,8, symbol ²³Na⁺', a.el.symbol === 'Na' && a.A === 23 && a.charge === 1 && a.kind === 'cation' && a.shells.join() === '2,8' && a.symbolText === '²³Na⁺' && a.iso.natural && Math.abs(a.iso.abundance - 1) < 1e-9); }
  { const a = A.build(17, 18, 18); check('atom: Cl− (17, 18, 18) is chloride: charge −1, shells 2,8,8, ³⁵Cl⁻', a.charge === -1 && a.kind === 'anion' && a.shells.join() === '2,8,8' && a.symbolText === '³⁵Cl⁻' && A.describe(a) === 'chlorine-35 ion with charge −1'); }
  { const a = A.build(8, 8, 10); check('atom: O2− symbol ¹⁶O²⁻', a.symbolText === '¹⁶O²⁻' && a.charge === -2); }
  { const a = A.build(6, 8, 6); check('atom: carbon-14 is radioactive, not a stable natural isotope', !a.iso.natural && a.iso.note.includes('carbon dating') && A.describe(a) === 'carbon-14 atom'); }
  { const a = A.build(6, 6, 6); check('atom: carbon-12 is 98.9 % of natural carbon', a.iso.natural && a.iso.note.includes('98.9 %')); }
  { const a = A.build(1, 2, 1); check('atom: tritium noted; deuterium natural', !a.iso.natural && a.iso.note.includes('tritium') && A.build(1, 1, 1).iso.natural); }
  check('atom: isobars argon-40 and calcium-40 share A = 40', A.build(18, 22, 18).A === 40 && A.build(20, 20, 20).A === 40 && A.build(18, 22, 18).iso.natural && A.build(20, 20, 20).iso.natural);
  check('atom: 3 protons with 20 neutrons is not natural', !A.build(3, 20, 3).iso.natural);
  check('atom: empty and lone neutron', A.build(0, 0, 0).kind === 'nothing' && A.describe(A.build(0, 1, 0)).includes('lone neutron'));
  let bad = 0; for (const [p, n, e] of [[21, 0, 0], [0, 31, 0], [0, 0, 21], [-1, 0, 0], [1.5, 0, 0]]) { try { A.build(p, n, e); } catch { bad++; } }
  check('atom: out-of-range counts are refused', bad === 5);
  check('atom: chargeLabel', A.chargeLabel(1) === '+' && A.chargeLabel(-3) === '3-' && A.chargeLabel(0) === '');
};
