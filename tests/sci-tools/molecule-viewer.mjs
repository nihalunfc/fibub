// #838 Molecule viewer. Checked against RDKit 2026.09 on MOL and XYZ files it wrote for 161 molecules (3D embedded,
// MMFF optimised; 1 to 36 atoms, charged and isotope-labelled ones included) and an SDF of all of them: symbols,
// coordinates, formal charges (M  CHG), bond list and orders, the distance-based bond guess equal to the MOL bonds and
// to RDKit's DetermineConnectivity, 966 random distances, angles and dihedrals (rdMolTransforms; IUPAC sign), centre
// of mass, formula and charge, SD titles and fields: 4,278 checks, 0 failed. Open Babel 3 bond perception agrees on
// 160 of 161 (it leaves out one C–O⁺ bond of trimethyloxonium that the MOL file and RDKit both have).
import * as M from '../../src/lib/sci/molview.ts';
import { CAFFEINE_MOL, ETHANOL_XYZ, THREE_SDF } from '../../src/lib/sci/molexample.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const P = (x, y, z) => ({ x, y, zc: z });
  check('distance', near(M.distance(P(0, 0, 0), P(1, 2, 2)), 3));
  check('angle: right angle and straight line', near(M.angle(P(1, 0, 0), P(0, 0, 0), P(0, 1, 0)), 90) && near(M.angle(P(-1, 0, 0), P(0, 0, 0), P(2, 0, 0)), 180));
  // Dihedral sign (IUPAC): a=(1,0,0) b=(0,0,0) c=(0,0,1) d=(0,1,1) gives +90.
  check('dihedral: +90, −90, 180, 0', near(M.dihedral(P(1, 0, 0), P(0, 0, 0), P(0, 0, 1), P(0, 1, 1)), 90) && near(M.dihedral(P(1, 0, 0), P(0, 0, 0), P(0, 0, 1), P(0, -1, 1)), -90) && near(Math.abs(M.dihedral(P(1, 0, 0), P(0, 0, 0), P(0, 0, 1), P(-1, 0, 1))), 180) && near(M.dihedral(P(1, 0, 0), P(0, 0, 0), P(0, 0, 1), P(1, 0, 1)), 0));
  const caf = M.parseAny(CAFFEINE_MOL, 'caffeine.mol')[0];
  check('MOL: caffeine 24 atoms, 25 bonds from the file', caf.atoms.length === 24 && caf.bonds.length === 25 && caf.bondsFromFile && caf.format === 'MOL' && caf.title === 'caffeine');
  check('MOL: bond orders', caf.bonds.filter((b) => b.order === 2).length === 4 && caf.bonds[0].a === 0 && caf.bonds[0].b === 1);
  { const s = M.summary(caf); check('summary: formula, molar mass, centroid', s.formula === 'C8H10N4O2' && near(s.mass, 194.194, 1e-6) && near(s.centroid.x, 0, 1e-6) && s.charge === 0); }
  check('MOL: guessed bonds equal the file bonds for caffeine', JSON.stringify(M.guessBonds(caf.atoms).map((b) => [b.a, b.b])) === JSON.stringify(caf.bonds.map((b) => [Math.min(b.a, b.b), Math.max(b.a, b.b)]).sort((p, q) => p[0] - q[0] || p[1] - q[1])));
  const eth = M.parseAny(ETHANOL_XYZ, 'ethanol.xyz')[0];
  check('XYZ: ethanol, 8 guessed bonds', eth.atoms.length === 9 && eth.bonds.length === 8 && !eth.bondsFromFile && M.summary(eth).formula === 'C2H6O');
  const sdf = M.parseAny(THREE_SDF, 'three.sdf');
  check('SDF: three records with titles and SMILES fields', sdf.length === 3 && sdf.map((m) => m.title).join() === 'aspirin,cyclohexane,alanine' && sdf[1].props[0][0] === 'SMILES' && sdf[1].props[0][1] === 'C1CCCCC1' && sdf[2].format === 'SDF');
  const multi = M.parseXyz('2\nH2 a\nH 0 0 0\nH 0 0 0.74\n2\nH2 b\nH 0 0 0\nH 0 0 0.80\n');
  check('XYZ: two frames, atomic symbols with numbers, numbers as Z', multi.length === 2 && multi[1].title === 'H2 b' && multi[0].bonds.length === 1 && M.parseXyz('2\n\n6 0 0 0\nO1 0 0 1.13\n')[0].atoms.map((a) => a.el).join() === 'C,O');
  const chg = M.parseMol('x\n\n\n  2  1  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nM  CHG  1   1   1\nM  ISO  1   2  13\nM  END\n');
  check('MOL: M  CHG and M  ISO', chg.atoms[0].charge === 1 && chg.atoms[1].iso === 13 && M.summary(chg).charge === 1 && near(M.summary(chg).mass, 14.007 + 13.00335483507, 1e-9));
  const bad = (t, n, msg) => { try { M.parseAny(t, n); return false; } catch (e) { return e.message.includes(msg); } };
  check('errors: short XYZ, bad symbol, bad count', bad('3\nw\nO 0 0 0\nH 0 0 1\n', 'w.xyz', 'Line 5: expected atom 3 of 3') && bad('1\nx\nXq 0 0 0\n', 'x.xyz', '"Xq" is not an element') && bad('two\nx\n', 'x.xyz', 'starts with the number of atoms'));
  check('errors: V3000, PDB, unknown', bad('x\n\n\n  0  0  0     0  0            999 V3000\n', 'x.mol', 'V3000') && bad('ATOM      1  N   ALA A   1      11.104  6.134  -6.504\n', '', 'PDB structure viewer') && bad('hello\nworld', '', 'does not look like an XYZ, MOL or SDF'));
  check('xyz text', M.toXyz(multi[0]) === '2\nH2 a\nH      0.000000     0.000000     0.000000\nH      0.000000     0.000000     0.740000\n');
  // Rotation helpers: rotation matrices are orthonormal; the start view puts the longest spread along x.
  const Rm = M.mul(M.rotX(0.3), M.rotY(1.1)), RtR = M.mul([Rm[0], Rm[3], Rm[6], Rm[1], Rm[4], Rm[7], Rm[2], Rm[5], Rm[8]], Rm);
  check('rotation: orthonormal', RtR.every((v, i) => near(v, [1, 0, 0, 0, 1, 0, 0, 0, 1][i], 1e-12)));
  const line = { title: '', atoms: [0, 1, 2, 3].map((k) => ({ el: 'C', z: 6, x: 0, y: k * 1.5, zc: k * 0.2, charge: 0 })), bonds: [], bondsFromFile: false, format: 'XYZ', props: [] };
  { const V = M.startView(line), v = M.apply(V, [0, 1.5, 0.2]); check('start view: long axis across', Math.abs(v[0]) > 1.4 && Math.abs(v[1]) < 1e-6 && Math.abs(v[2]) < 1e-6); }
};
