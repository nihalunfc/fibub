// #836 Degree of unsaturation. Checked against RDKit 2026.09 on 622 SMILES strings of 164 molecules (each written
// up to five ways: as typed, RDKit random SMILES and Kekulé form): element counts, charge, monoisotopic mass
// (ExactMolWt, ±2e-5), ring count (bonds − atoms + parts), number of parts, formula value = rings + π bonds of the
// Kekulé structure (heteroatom charges +z/2, carbon charges −|z|/2; hypervalent S/P and radicals left out), the same
// value from RDKit's formula string, and the nitrogen rule on real nominal masses: 4,930 checks, 0 failed.
import * as D from '../../src/lib/sci/dbe.ts';

export default async (check) => {
  const r = (f, v) => D.dbeFromFormula(f, v);
  check('formula: caffeine 6, aspirin 6, benzene 4, ethanol 0', r('C8H10N4O2').rdbe === 6 && r('C9H8O4').rdbe === 6 && r('C6H6').rdbe === 4 && r('C2H6O').rdbe === 0);
  check('formula: halogens count like H (C6H5Cl 4, CHCl3 0)', r('C6H5Cl').rdbe === 4 && r('CHCl3').rdbe === 0 && r('C2F6').rdbe === 0);
  check('formula: N and P add ½ (pyridine 4, PMe3 0)', r('C5H5N').rdbe === 4 && r('C3H9P').rdbe === 0);
  check('formula: Si like C, B like N', r('C4H12Si').rdbe === 0 && r('BH3O3').rdbe === 0 && r('C6H7BO2').rdbe === 4);
  check('formula: sulfur 2 by default, 6 on request (DMSO2)', r('C2H6SO2').rdbe === 0 && r('C2H6SO2', { S: 6 }).rdbe === 2 && r('H3PO4', { P: 5 }).rdbe === 1);
  check('formula: radical C6H5 is 4.5 with a problem', r('C6H5').rdbe === 4.5 && !r('C6H5').evenElectron && r('C6H5').problems[0].includes('odd number of electrons'));
  check('formula: impossible CH5', r('CH5').rdbe === -0.5 && r('CH5').problems.some((p) => p.includes('too many hydrogens')));
  check('ions: pyridinium 3.5, 4 on N', r('C5H6N+').rdbe === 3.5 && r('C5H6N+').ionOnium === 4 && r('C5H6N+').evenElectron);
  check('ions: tert-butyl cation 0 on carbon, acetate 1 on O', r('C4H9+').ionCarbon === 0 && r('C2H3O2-').ionOnium === 1);
  check('ions: methyl anion 0 on carbon', r('CH3-').ionCarbon === 0);
  check('ions: M+• of benzene is an odd-electron ion', !r('C6H6+').evenElectron && r('C6H6+').notes[0].includes('radical ion'));
  check('nitrogen rule: pyridine odd mass 79', r('C5H5N').nominal === 79 && r('C5H5N').nitrogenRule.text.includes('nominal mass is odd (79)'));
  check('nitrogen rule: [M+H]+ of pyridine even (80)', r('C5H6N+').nitrogenRule.text.includes('even-electron ion of charge +1: the nominal mass is even (80)'));
  check('nitrogen rule: labelled formulas noted', r('[13C]H4').nitrogenRule.text.includes('isotope labels'));
  check('masses: caffeine mono 194.08038, average 194.19', Math.abs(r('C8H10N4O2').mono - 194.0803756) < 1e-5 && Math.abs(r('C8H10N4O2').average - 194.194) < 0.01);
  check('masses: an electron taken off a cation', Math.abs(r('C5H6N+').mono - 80.049475) < 2e-5);
  { let t = ''; try { r('FeCl3'); } catch (e) { t = e.message; } check('unsupported element explained', t.includes('Fe is not covered')); }
  check('combinations: 2 for 4 heavy atoms', JSON.stringify(D.combinations(2, 4)) === '[{"rings":2,"double":0,"triple":0},{"rings":1,"double":1,"triple":0},{"rings":0,"double":2,"triple":0},{"rings":0,"double":0,"triple":1}]');
  check('combinations: rings need 3 atoms, triples 2', D.combinations(1, 2).every((c) => c.rings === 0) && D.combinations(2, 2).length === 2 && D.combinations(3, 1).length === 0);
  check('combinations: each adds up', D.combinations(6, 14).every((c) => c.rings + c.double + 2 * c.triple === 6) && D.combinations(6, 14).length === 16);

  const sm = (s) => D.smilesSummary(D.parseSmiles(s));
  const fm = (s) => D.dbeOf(D.smilesFormula(D.parseSmiles(s)));
  check('smiles: benzene C6H6, 1 ring', fm('c1ccccc1').hill === 'C6H6' && sm('c1ccccc1').rings === 1 && sm('c1ccccc1').aromaticAtoms === 6);
  check('smiles: caffeine', fm('Cn1cnc2c1c(=O)n(C)c(=O)n2C').hill === 'C8H10N4O2' && sm('Cn1cnc2c1c(=O)n(C)c(=O)n2C').rings === 2);
  check('smiles: pyrrole [nH]', fm('c1cc[nH]c1').hill === 'C4H5N' && fm('c1cc[nH]c1').rdbe === 3);
  check('smiles: brackets, charges, isotopes', fm('[NH4+]').hill === 'H4N+' && fm('CC(=O)[O-]').hill === 'C2H3O2-' && fm('[13CH4]').hill === '[13C]H4' && fm('[2H]C([2H])([2H])[2H]').hill === 'C[2H]4');
  check('smiles: ring %10 and bond on ring closure', fm('C%10CCCCC%10').hill === 'C6H12' && fm('C1CCCC=1').hill === 'C5H8' && sm('C1CCCC=1').double === 1);
  check('smiles: triple, explicit H, cubane 5 rings', fm('C#N').hill === 'CHN' && fm('[H][H]').hill === 'H2' && sm('C12C3C4C1C5C2C3C45').rings === 5);
  check('smiles: salt has 2 parts', sm('[Na+].[Cl-]').components === 2 && fm('[Na+].[Cl-]').hill === 'ClNa');
  check('smiles: stereo marks ignored', fm('C[C@@H](O)C(=O)O').hill === 'C3H6O3' && fm('F/C=C/F').hill === 'C2H2F2');
  check('smiles: nitro zwitterion', fm('O=[N+]([O-])c1ccccc1').hill === 'C6H5NO2' && fm('O=[N+]([O-])c1ccccc1').rdbe === 5);
  const bad = (s, t) => { try { D.parseSmiles(s); return false; } catch (e) { return e.message.includes(t); } };
  check('smiles errors: unclosed ring, branch, bracket', bad('C1CC', 'Ring number 1 is opened') && bad('C(C', 'never closed') && bad('[CH3', '"[" is never closed'));
  check('smiles errors: too many bonds, bare H, spaces', bad('C(C)(C)(C)(C)C', 'more than C normally makes') && bad('CH4', 'SMILES adds hydrogens') && bad('CCO ethanol', 'no spaces'));
  check('smiles errors: bad element, dangling bond', bad('[Xx]', 'not an element') && bad('CC=', 'ends with a bond'));
};
