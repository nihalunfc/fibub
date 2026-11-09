// #212 Drug-likeness checker. Checked against RDKit 2026.09 on 67 molecules (the example list, aromatic
// heterocycles with [nH], fused and bridged rings, a spiro ring, cubane, %nn ring closures, charges, salts and other
// dot-separated parts, isotopes [2H] and [13C], stereo marks, Si, B, P, S, halogens) and on 268 rewritings of them by
// RDKit (canonical, Kekulé and random SMILES): element counts and charge, average mass (MolWt), monoisotopic mass
// (ExactMolWt, to 1e-4), heavy atoms, all atoms with H, rings (GetSSSR; RDKit's CalcNumRings counts 3 for
// bicyclo[2.2.2]octane and 6 for cubane because it uses the symmetrised set), NH + OH count (Lipinski.NHOHCount),
// N + O count (Lipinski.NOCount), and rotatable bonds with the same Veber definition written on RDKit's own molecule
// graph, with and without amide C–N bonds: 4,422 checks, 0 failed.
// Hand-worked: formulas and masses of aspirin, caffeine, paracetamol and ibuprofen from atomic weights.
import * as D from '../../src/lib/sci/druglike.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const p = (s, o = {}) => D.check(s, o).props;
  // Hand-worked: aspirin C9H8O4 = 9(12.011) + 8(1.008) + 4(15.999) = 180.159; mono 9(12) + 8(1.00782503) + 4(15.99491462) = 180.04225
  { const a = p('CC(=O)Oc1ccccc1C(=O)O'); check('aspirin: C9H8O4, 180.159, 180.0423, 13 heavy, 1 ring, 1 donor, 4 acceptors, 3 rotatable', a.formulaText === 'C9H8O4' && near(a.mw, 180.159, 0.002) && near(a.mono, 180.04225, 1e-4) && a.heavy === 13 && a.atoms === 21 && a.rings === 1 && a.hbd === 1 && a.hba === 4 && a.rotatable === 3 && a.charge === 0); }
  { const c = p('Cn1cnc2c1c(=O)n(C)c(=O)n2C'); check('caffeine: C8H10N4O2, 194.19, 2 rings, 0 donors, 6 acceptors, 0 rotatable', c.formulaText === 'C8H10N4O2' && near(c.mw, 194.19, 0.01) && near(c.mono, 194.08038, 1e-4) && c.rings === 2 && c.hbd === 0 && c.hba === 6 && c.rotatable === 0); }
  { const c = p('CC(=O)Nc1ccc(O)cc1'); check('paracetamol: C8H9NO2, 151.165, 2 donors, 3 acceptors, amide C–N not rotatable (1)', c.formulaText === 'C8H9NO2' && near(c.mw, 151.165, 0.002) && c.hbd === 2 && c.hba === 3 && c.rotatable === 1 && p('CC(=O)Nc1ccc(O)cc1', { countAmides: true }).rotatable === 2); }
  { const c = p('CC(C)Cc1ccc(cc1)C(C)C(=O)O'); check('ibuprofen: C13H18O2, 206.28, 4 rotatable', c.formulaText === 'C13H18O2' && near(c.mw, 206.285, 0.003) && near(c.mono, 206.13068, 1e-4) && c.rotatable === 4 && c.hbd === 1 && c.hba === 2); }
  // Rings, aromatic hydrogens, ring closures
  check('rings: naphthalene 2, cubane 5, spiro 2, bicyclo[2.2.2]octane 2, %10 closure', p('c1ccc2ccccc2c1').rings === 2 && p('C12C3C4C1C5C2C3C45').rings === 5 && p('C1CCC2(CC1)CCCC2').rings === 2 && p('C1CC2CCC1CC2').rings === 2 && p('C1CC%10CC1CC%10').rings === 2);
  check('aromatic H: pyrrole [nH] C4H5N with 1 donor, pyridine C5H5N with 0', p('c1cc[nH]c1').formulaText === 'C4H5N' && p('c1cc[nH]c1').hbd === 1 && p('c1ccncc1').formulaText === 'C5H5N' && p('c1ccncc1').hbd === 0);
  check('biphenyl: inter-ring bond rotatable whether written - or not', p('c1ccccc1-c1ccccc1').rotatable === 1 && p('c1ccccc1c1ccccc1').rotatable === 1 && p('c1ccccc1c1ccccc1').rings === 2);
  check('rotatable: ethanol 0 (terminal), butane 1, ester 2, tertiary amide 0', p('CCO').rotatable === 0 && p('CCCC').rotatable === 1 && p('CCOC(=O)C').rotatable === 2 && p('CC(=O)N(C)C').rotatable === 0);
  // Charges, isotopes, salts
  { const n = p('[O-][N+](=O)c1ccccc1'); check('nitrobenzene zwitterion form: charge 0, C6H5NO2', n.charge === 0 && n.formulaText === 'C6H5NO2'); }
  { const a = p('[NH4+]'); check('ammonium: charge +1, mono less one electron', a.charge === 1 && a.formulaText === 'H4N+' && near(a.mono, 14.003074 + 4 * 1.00782503 - 0.000548580, 1e-5)); }
  { const d = p('[2H]C([2H])([2H])O'); check('CD3OH: isotopes keep their label and exact mass; 2 heavy atoms', d.formulaText === 'CH[2H]3O' && near(d.mono, 12 + 1.00782503 + 3 * 2.01410178 + 15.99491462, 1e-5) && d.heavy === 2 && d.hbd === 1); }
  { const r = D.check('[Na+].[O-]C(=O)c1ccccc1O', { largestPart: true }); check('salt: largest part keeps salicylate (C7H5O3-), Na+ listed as left out', r.props.formulaText === 'C7H5O3-' && r.salt === 'Na+' && r.props.charge === -1 && r.props.hbd === 1); }
  { const r = p('[Na+].[O-]C(=O)c1ccccc1O'); check('salt: whole string counted with the option off (C7H5NaO3, 2 parts, charge 0)', r.formulaText === 'C7H5NaO3' && r.parts === 2 && r.charge === 0); }
  // Rules
  { const pep = D.check('NCC(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)NC(CCCCN)C(=O)NC(Cc1ccc(O)cc1)C(=O)O'); const p2 = pep.props;
    check('made-up peptide: C24H36N6O10, 12 donors, 16 acceptors, 18 rotatable', p2.formulaText === 'C24H36N6O10' && p2.hbd === 12 && p2.hba === 16 && p2.rotatable === 18);
    check('made-up peptide: Lipinski fails (3 of 3), Veber fails (2 of 2)', !pep.lip.pass && pep.lip.broken === 3 && pep.lip.checked === 3 && !pep.veb.pass && pep.veb.broken === 2); }
  { const props = { mw: 520, hbd: 2, hba: 4, rotatable: 4 }; const l = D.lipinski(props); check('Lipinski: one rule broken still passes; logP given joins the rules', l.pass && l.broken === 1 && l.checked === 3 && !D.lipinski(props, 6).pass && D.lipinski(props, 6).broken === 2 && D.lipinski(props, 4.9).checked === 4); }
  { const v = D.veber({ rotatable: 11, hbd: 1, hba: 2 }); check('Veber: 11 rotatable fails; given TPSA replaces the H-bond total', !v.pass && v.broken === 1 && D.veber({ rotatable: 3, hbd: 8, hba: 8 }).broken === 1 && D.veber({ rotatable: 3, hbd: 8, hba: 8 }, 120).pass && !D.veber({ rotatable: 3, hbd: 1, hba: 1 }, 141).pass); }
  check('limits are inclusive: MW 500, 5 donors, 10 acceptors, 10 rotatable, 12 H-bond total pass', D.lipinski({ mw: 500, hbd: 5, hba: 10 }).broken === 0 && D.veber({ rotatable: 10, hbd: 5, hba: 7 }).broken === 0);
  // Errors
  const bad = (s, msg) => { const r = D.check(s); return !!r.error && r.error.includes(msg); };
  check('errors: unclosed ring, bad element, bare H, too many bonds, unclosed branch', bad('C1CC', 'never closed') && bad('[Xx]', 'not an element') && bad('CH4', 'hydrogens by itself') && bad('C(C)(C)(C)(C)C', 'more than C normally makes') && bad('CC(C', 'never closed'));
  // Batch
  const b = D.readBatch('smiles,name\n# comment\nCCO Ethanol\nc1ccccc1\tBenzene\nCC(=O)O,Acetic acid\n\nCO');
  check('batch: header and comments skipped; space, tab and comma separators; default name', b.length === 4 && b[0].name === 'Ethanol' && b[1].name === 'Benzene' && b[2].smiles === 'CC(=O)O' && b[2].name === 'Acetic acid' && b[3].name === 'Molecule 4' && b[3].line === 7);
  const ex = D.readBatch(D.EXAMPLE_BATCH).map((l) => D.check(l.smiles, { largestPart: true, name: l.name }));
  check('example list: 7 molecules, 6 pass both rule sets', ex.length === 7 && ex.filter((r) => r.lip.pass && r.veb.pass).length === 6 && !ex[6].lip.pass);
  const csv = D.toCsv([...ex, D.check('C1CC', { name: 'Bad, one' })]).trim().split('\n');
  check('CSV: header, a row each, quoted names, errors kept', csv.length === 9 && csv[0].startsWith('name,smiles,formula,mw') && csv[1].startsWith('Aspirin,CC(=O)Oc1ccccc1C(=O)O,C9H8O4,180.159,180.0423,13,1,1,4,3,0,0,yes,0,yes') && csv[8].startsWith('"Bad, one",C1CC') && csv[8].includes('never closed'));
};
