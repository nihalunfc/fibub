// #185 PDB viewer. Reference values from Biopython 1.88 (PDBParser, NeighborSearch for residue contacts,
// MMCIF2Dict for the CIF tokens) on the made-up example; the C-alpha secondary-structure guess against a separate
// NumPy version of the same rule and an ideal helix (radius 2.3 Å, rise 1.5 Å, 100° per residue) worked by hand.
import { parseStructure, parseCifTables, elementOf, contacts, contactRows, bonds, dist, closest, resLabel, atomLabel, assignSS, ssShare, guessSS, segments, extent, principalAxes } from '../../src/lib/sci/pdb.ts';
import { EXAMPLE_PDB } from '../../src/lib/sci/pdb-example.ts';

const CIF = `data_TEST
_struct.entry_id TEST
_struct.title
;A made-up test file,
over two lines
;
_struct_keywords.text 'MADE UP, TEST'
loop_
_struct_conf.conf_type_id
_struct_conf.id
_struct_conf.beg_auth_asym_id
_struct_conf.beg_auth_seq_id
_struct_conf.end_auth_asym_id
_struct_conf.end_auth_seq_id
HELX_P HELX_P1 A 1 A 3
TURN_P TURN_P1 A 4 A 4
#
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_alt_id
_atom_site.label_comp_id
_atom_site.auth_asym_id
_atom_site.auth_seq_id
_atom_site.pdbx_PDB_ins_code
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.occupancy
_atom_site.B_iso_or_equiv
_atom_site.pdbx_PDB_model_num
ATOM 1 N N . GLY A 1 ? 0.000 0.000 0.000 1.00 10.0 1
ATOM 2 C CA . GLY A 1 ? 1.458 0.000 0.000 1.00 10.0 1
ATOM 3 C C . GLY A 1 ? 2.009 1.422 0.000 1.00 10.0 1
ATOM 4 N N A ALA A 2 ? 3.300 1.600 0.000 0.60 12.0 1
ATOM 5 N N B ALA A 2 ? 3.350 1.650 0.050 0.40 12.0 1
ATOM 6 C CA . ALA A 2 ? 3.950 2.900 0.000 1.00 12.0 1
ATOM 7 C C . ALA A 2 ? 5.450 2.700 0.000 1.00 12.0 1
ATOM 8 P P . DA B 1 ? 10.000 0.000 0.000 1.00 20.0 1
ATOM 9 O "O5'" . DA B 1 ? 11.000 1.000 0.000 1.00 20.0 1
ATOM 10 C "C4'" . DA B 1 ? 12.000 1.500 0.500 1.00 20.0 1
HETATM 11 ZN ZN . ZN A 101 ? 0.000 5.000 5.000 1.00 30.0 1
HETATM 12 O O . HOH A 201 ? 2.000 6.000 1.000 1.00 35.0 1
ATOM 13 N N . GLY A 1 ? 9.000 9.000 9.000 1.00 10.0 2
`;

const PDB2 = [
  'MODEL        1',
  'ATOM      1  N   GLY A   1       0.000   0.000   0.000  1.00 10.00           N',
  'ATOM      2  CA AGLY A   1       1.458   0.000   0.000  0.50 10.00           C',
  'ATOM      3  CA BGLY A   1       1.500   0.100   0.000  0.50 10.00           C',
  'ATOM      4  C   GLY A   1       2.009   1.422   0.000  1.00 10.00           C',
  'HETATM    5  N   MSE A   2       3.300   1.600   0.000  1.00 12.00           N',
  'HETATM    6  CA  MSE A   2       3.950   2.900   0.000  1.00 12.00           C',
  'HETATM    7  C   MSE A   2       5.450   2.700   0.000  1.00 12.00           C',
  'HETATM    8 SE   MSE A   2       3.000   4.500   1.000  1.00 12.00          SE',
  'HETATM    9 CA    CA A 301       9.000   0.000   0.000  1.00 20.00          CA',
  'HETATM   10  O   HOH A 401       2.000   6.000   1.000  1.00 30.00',
  'ENDMDL',
  'MODEL        2',
  'ATOM     11  N   GLY A   1       5.000   5.000   5.000  1.00 10.00           N',
  'ENDMDL',
].join('\n');

export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const s = parseStructure(EXAMPLE_PDB);
  const [A, B] = s.chains;
  check('pdb: example reads like Biopython (240 atoms, 50 residues, chain A 34 and B 12 amino acids)', s.format === 'pdb' && s.atoms.length === 240 && s.residues.length === 50 && A.id === 'A' && A.polymer.length === 34 && B.polymer.length === 12);
  check('pdb: sequences, one ligand, three waters', A.seq === 'SPEELLKKALELAKKNPGKVTVEVNGKIYVRWSE' && B.seq === 'ALEELLRKAAEL' && A.ligands.length === 1 && s.residues[A.ligands[0]].resName === 'LIG' && A.waters.length === 3 && !B.ligands.length);
  check('pdb: title, B-factor total 5965.42 and centre match Biopython', s.title.startsWith('A MADE-UP TWO-CHAIN') && near(s.atoms.reduce((t, a) => t + a.b, 0), 5965.42, 1e-9) && extent(s, s.atoms.map((_, i) => i)).c.every((v, k) => near(v, [-0.1133042424917221, 0.06566222012042999, -0.4956675171852112][k], 1e-6)));
  const at = (ch, seq, name) => s.atoms.findIndex((a) => a.chain === ch && a.resSeq === seq && a.name === name);
  check('pdb: distances match Biopython (A5 CA to B10 CA 4.9188, A19 CA to A32 CA 5.0373, A1 N to LIG O7 39.7980 Å)',
    near(dist(s.atoms[at('A', 5, 'CA')], s.atoms[at('B', 10, 'CA')]), 4.918807506561279, 1e-6) && near(dist(s.atoms[at('A', 19, 'CA')], s.atoms[at('A', 32, 'CA')]), 5.037282943725586, 1e-6) && near(dist(s.atoms[at('A', 1, 'N')], s.atoms[at('A', 101, 'O7')]), 39.797977447509766, 1e-6));
  check('pdb: labels', atomLabel(s, at('A', 29, 'CB')) === 'A TYR 29 CB' && resLabel(s.residues[A.ligands[0]]) === 'A LIG 101');

  const pa = principalAxes(s.atoms.map((a) => [a.x, a.y, a.z]));
  const npAx = [[-0.27403601346455764, 0.6852847389669726, -0.674751131798548], [0.7329917189098717, 0.6030340115479307, 0.3147588297823618]];
  check('pdb: principal axes and spreads match numpy.linalg.eigh (177.225, 28.348, 6.267 Å²), right-handed',
    pa.variances.every((v, k) => near(v, [177.2252371823892, 28.34780244727081, 6.267288367229533][k], 1e-6)) && npAx.every((w, k) => Math.abs(Math.abs(w.reduce((t, x, j) => t + x * pa.axes[k][j], 0)) - 1) < 1e-7));

  // Secondary structure.
  const ssStr = () => s.residues.filter((r) => r.kind === 'polymer').map((r) => r.ss).join('');
  check('pdb: HELIX and SHEET records read (A 2-15 and B 1-12 helix; A 19-24 and 27-32 strands)', s.ssSource === 'records' && s.ranges.length === 4 && ssStr() === 'CHHHHHHHHHHHHHHCCCEEEEEECCEEEEEECC' + 'HHHHHHHHHHHH');
  const sh = ssShare(s);
  check('pdb: secondary structure share (26 helix, 12 strand, 8 other of 46)', sh.n === 46 && sh.h === 26 && sh.e === 12 && sh.c === 8);
  assignSS(s, 'guess');
  check('pdb: C-alpha guess matches the NumPy version of the same rule', s.ssSource === 'guess' && ssStr() === 'HHHHHHHHHHHHHHHHHEEEECCCCCCCEEEECC' + 'HHHHHHHHHHHH');
  assignSS(s, 'auto');
  check('pdb: back to the records', s.ssSource === 'records' && ssStr().startsWith('CHHH'));
  const ih = Array.from({ length: 10 }, (_, i) => [2.3 * Math.cos((100 * i * Math.PI) / 180), 2.3 * Math.sin((100 * i * Math.PI) / 180), 1.5 * i]);
  const hd = [2, 3, 4].map((k) => Math.hypot(ih[0][0] - ih[k][0], ih[0][1] - ih[k][1], ih[0][2] - ih[k][2]));
  check('pdb: ideal helix distances by hand (5.4334, 5.0537, 6.2028 Å) and all guessed helix', near(hd[0], 5.433410340468949, 1e-9) && near(hd[1], 5.053711507397311, 1e-9) && near(hd[2], 6.202842073743391, 1e-9) && guessSS([ih])[0].join('') === 'HHHHHHHHHH');
  const line = Array.from({ length: 8 }, (_, i) => [3.8 * i, 0, 0]);
  check('pdb: a lone straight chain is not called a strand (no partner)', guessSS([line])[0].every((x) => x === 'C'));
  check('pdb: trace pieces (one per chain, no gaps)', segments(s, A).length === 1 && segments(s, A)[0].length === 34 && segments(s, B).length === 1);

  // Contacts against Biopython NeighborSearch.
  const base = { scope: 'all', water: false, hydrogens: false };
  const sum = (c) => [c.length, Number(c.reduce((t, x) => t + x.d, 0).toFixed(3)), c.reduce((t, x) => t + x.n, 0)];
  const want = [[{ cutoff: 4, minSep: 3 }, [64, 209.996, 210]], [{ cutoff: 4.5, minSep: 3 }, [69, 231.267, 328]], [{ cutoff: 6, minSep: 5 }, [65, 310.4, 395]], [{ cutoff: 3.5, minSep: 3, water: true }, [56, 176.049, 85]]];
  for (const [o, w] of want) {
    const got = sum(contacts(s, { ...base, ...o }));
    check(`pdb: contacts within ${o.cutoff} Å, ${o.minSep} apart${o.water ? ', with water' : ''}: ${w.join(', ')} (pairs, sum of closest distances, atom pairs) as Biopython`, got[0] === w[0] && Math.abs(got[1] - w[1]) < 2e-3 && got[2] === w[2]);
  }
  const lig = contacts(s, { ...base, cutoff: 3.5, minSep: 3, scope: 'ligands', water: true });
  check('pdb: ligand and water contacts (TYR 29 to LIG 3.3559 Å; three waters at 2.80 Å)', lig.length === 4 && lig.some((c) => resLabel(s.residues[c.r1]) === 'A TYR 29' && resLabel(s.residues[c.r2]) === 'A LIG 101' && near(c.d, 3.3559367656707764, 1e-6) && c.n === 1 && c.kind === 'ligand') && lig.filter((c) => c.kind === 'water').every((c) => Math.abs(c.d - 2.8) < 0.001));
  const between = contacts(s, { ...base, cutoff: 4, minSep: 3, scope: 'chains' });
  check('pdb: between-chain contacts only (7, closest A GLU 4 to B ALA 10 at 3.3161 Å)', between.length === 7 && between.every((c) => c.kind === 'between chains') && Math.min(...between.map((c) => c.d)).toFixed(4) === '3.3161');
  const cl = closest(s, A.polymer[3], B.polymer[9]);
  check('pdb: closest atoms of two residues', cl.d.toFixed(4) === '3.3161' && s.atoms[cl.a].resSeq === 4);
  const rows = contactRows(s, lig);
  check('pdb: contacts CSV rows', rows.length === 5 && rows[0][6] === 'closest_distance_A' && rows.some((r) => r.join(',') === 'A,TYR,29,A,LIG,101,3.356,CB,C5,1,ligand'));
  check('pdb: bonds by distance (236, as a brute-force Python count with the same radii)', bonds(s, s.atoms.map((_, i) => i)).length === 236);

  // mmCIF.
  const T = parseCifTables(CIF);
  check('cif: tokens as Biopython MMCIF2Dict (text block, quoted values with a comma and a prime)', T.get('_struct').rows[0][1] === 'A made-up test file,\nover two lines' && T.get('_struct_keywords').rows[0][0] === 'MADE UP, TEST' && T.get('_atom_site').rows.map((r) => r[3]).join(' ') === "N CA C N N CA C P O5' C4' ZN O N");
  const c = parseStructure(CIF);
  check('cif: first model only, first alternate kept, title joined', c.format === 'cif' && c.atoms.length === 11 && c.models === 2 && c.skippedAlt === 1 && c.atoms[3].x === 3.3 && c.title === 'A made-up test file, over two lines' && c.notes.length === 2);
  check('cif: kinds (amino acids, DNA traced through P, zinc ligand, water) and helix from struct_conf', c.residues.map((r) => r.kind[0]).join('') === 'ppplw' && c.residues[2].rep >= 0 && c.atoms[c.residues[2].rep].name === 'P' && c.residues[3].resName === 'ZN' && c.atoms[c.residues[3].atoms[0]].el === 'ZN' && c.ssSource === 'records' && c.residues[0].ss === 'H' && c.residues[1].ss === 'H' && c.chains[1].seq === 'A');

  // PDB details.
  const p = parseStructure(PDB2);
  check('pdb: MODEL 1 only, alternate CA B left out, MSE counted as an amino acid, calcium ion a ligand', p.atoms.length === 9 && p.models === 2 && p.skippedAlt === 1 && p.chains[0].seq === 'GM' && p.residues[2].kind === 'ligand' && p.atoms[p.residues[2].atoms[0]].el === 'CA' && p.residues[3].kind === 'water' && p.atoms[8].el === 'O' && p.ssSource === 'guess');
  check('pdb: element from the atom name when the column is empty', elementOf('', ' CA ') === 'C' && elementOf('', 'CA  ') === 'CA' && elementOf('', 'FE1 ') === 'FE' && elementOf('', '1HB ') === 'H' && elementOf(' N', ' N  ') === 'N' && elementOf('', 'HG21') === 'H' && elementOf('', 'HG  ') === 'HG');
  let err = '';
  try { parseStructure('hello\nworld'); } catch (e) { err = e.message; }
  check('pdb: a file with no atoms says so', err.startsWith('No ATOM or HETATM'));
};
