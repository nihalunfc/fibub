// #843 CIF viewer: CIF reading, symmetry expansion, bond lengths, Z and density. Reference numbers from gemmi 0.7.5
// (read_small_structure, get_all_unit_cell_sites) with NumPy distances, on fibub's own example CIFs and a made-up
// monoclinic test CIF written here (not a real compound; no database CIF is used).
import * as C from '../../src/lib/sci/cif.ts';

const MONO = "# A made-up monoclinic test structure written by fibub (not a real compound).\ndata_madeup_mono\n_chemical_name_common 'made-up test, not a real compound'\n_chemical_formula_sum 'Ca O2'\n_cell_length_a   5.2140(3)\n_cell_length_b   6.7300(4)\n_cell_length_c   7.1100(5)\n_cell_angle_alpha 90\n_cell_angle_beta  104.25(2)\n_cell_angle_gamma 90\n_symmetry_space_group_name_H-M 'P 1 21/c 1'\n_publ_section_comment\n;\nA text field that a reader must skip,\nwith data_ and loop_ words inside it.\n;\nloop_\n_symmetry_equiv_pos_site_id\n_symmetry_equiv_pos_as_xyz\n1 x,y,z\n2 '-x, 1/2+y, 1/2-z'\n3 -x,-y,-z\n4 \"x, -y+1/2, z+1/2\"\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n_atom_site_occupancy\n_atom_site_U_iso_or_equiv\nCa1 Ca2+ 0.1123(2) 0.2051(2) 0.3172(3) 1 0.010\nO1  O2-  0.4010(5) 0.1032(4) 0.2120(5) 1 0.012\nO2  O2-  0.2500(6) 0.7480(5) 0.0410(5) 1.0 0.015\n";

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const run = (txt, cut) => { const s = C.readStructure(txt), at = C.expand(s), sm = C.summary(s, at); return { s, at, sm, nb: (i) => C.neighbours(s.cell, at, [i], cut).map((n) => n.d) }; };
  const ex = Object.fromEntries(C.EXAMPLES.map((e) => [e.id, run(e.cif, 3.2)]));
  check('cif: NaCl expands to 8 atoms (4 Na, 4 Cl), V = 179.406 Å³, Z = 4 (gemmi)', ex.nacl.at.length === 8 && rel(ex.nacl.sm.volume, 179.40614399999995, 1e-12) && ex.nacl.sm.Z === 4 && ex.nacl.sm.counts.get('Na') === 4);
  check('cif: NaCl density 2.1636 g/cm³ (gemmi masses: 2.16373; within 0.01 %)', rel(ex.nacl.sm.density, 2.163727520476795, 1e-4) && ex.nacl.sm.density.toFixed(3) === '2.164');
  check('cif: NaCl Na has 6 Cl at 2.82 Å, next neighbours beyond 3.2 Å (gemmi)', ex.nacl.nb(0).length === 6 && ex.nacl.nb(0).every((d) => Math.abs(d - 2.82) < 1e-9));
  check('cif: rutile expands to 6 atoms, V = 62.3616 Å³, TiO2 with Z = 2 (gemmi)', ex.tio2.at.length === 6 && rel(ex.tio2.sm.volume, 62.36157599999999, 1e-12) && ex.tio2.sm.formula === 'O2Ti' && ex.tio2.sm.Z === 2);
  check('cif: rutile Ti has 4 O at 1.94747 and 2 at 1.97983 Å, then Ti at 2.96 (gemmi)', ex.tio2.nb(0).map((d) => d.toFixed(5)).join() === '1.94747,1.94747,1.94747,1.94747,1.97983,1.97983,2.96000,2.96000');
  check('cif: rutile density 4.2532 g/cm³ (gemmi masses: 4.25327)', rel(ex.tio2.sm.density, 4.253269065268428, 1e-4));
  check('cif: wurtzite ZnO expands to 4 atoms, V = 47.6579 Å³, Zn tetrahedral 3 × 1.9745 + 1 × 1.9902 Å (gemmi)', ex.zno.at.length === 4 && rel(ex.zno.sm.volume, 47.65791923613504, 1e-12) && ex.zno.nb(0).map((d) => d.toFixed(4)).join() === '1.9745,1.9745,1.9745,1.9902');
  const mono = run(MONO, 3.2);
  check('cif: made-up monoclinic P2₁/c: 12 atoms, V = 241.815 Å³, CaO2 with Z = 4 (gemmi)', mono.at.length === 12 && rel(mono.sm.volume, 241.81483881063616, 1e-12) && mono.sm.formula === 'CaO2' && mono.sm.Z === 4);
  check('cif: monoclinic neighbour distances match gemmi + NumPy to 1e-5 Å', [[0, '1.96212,2.36767,2.79030,3.11923'], [4, '1.96212,2.40246,2.70948,3.02677,3.11923'], [8, '2.36767,2.40246,2.70948,2.79030,3.02677']].every(([i, s]) => mono.nb(i).map((d) => d.toFixed(5)).join() === s));
  check('cif: monoclinic density 1.9798 g/cm³ (gemmi 1.97980)', rel(mono.sm.density, 1.9798014518141567, 1e-4));
  check('cif: uncertainties in brackets: 5.2140(3) → 5.214 ± 0.0003; 104.25(2) read as 104.25', mono.s.cell.a === 5.214 && Math.abs(mono.s.su.a - 0.0003) < 1e-12 && mono.s.cell.beta === 104.25 && C.cifSu('1.23e2(4)') === 400 * 1e-2 * 1);
  check('cif: text fields, quoted ops and old symmetry tags are read; space group and name kept', mono.s.ops.length === 4 && mono.s.sg === 'P 1 21/c 1' && mono.s.name === 'made-up test, not a real compound' && !mono.s.warnings.length);
  check('cif: element from type symbol or label (Ca2+ → Ca, CL2 → Cl, O1 → O, Xx → none)', C.elementOf('Ca2+') === 'Ca' && C.elementOf('CL2') === 'Cl' && C.elementOf('O1') === 'O' && C.elementOf('Xx1') === '' && C.elementOf('Co') === 'Co');
  { const o = C.parseOp('x-y+1/2, -y, 1/2+z'); check('cif: symmetry operation "x-y+1/2, -y, 1/2+z"', o.R[0].join() === '1,-1,0' && o.R[1].join() === '0,-1,0' && o.R[2].join() === '0,0,1' && o.t.join() === '0.5,0,0.5'); }
  { const o = C.parseOp('-X,Y+0.5,-Z+0.25'); check('cif: upper case and decimal translations', o.R[0][0] === -1 && o.t.join() === '0,0.5,0.25'); }
  { let e1 = '', e2 = ''; try { C.parseOp('x,y'); } catch (e) { e1 = e.message; } try { C.parseOp('x,y,q'); } catch (e) { e2 = e.message; } check('cif: bad operations are refused with a message', e1.includes('three parts') && e2.includes('not a symmetry operation')); }
  { const t = C.tokens(`_a 'it''s fine' # comment
_b "x y"
;
line 1
line 2
;`); check('cif: tokens: quotes inside words, comments, text fields', t.map((x) => x.v).join('|') === `_a|it''s fine|_b|x y|line 1
line 2`); }
  { const s = C.readStructure(`data_x
_cell_length_a 4
_cell_length_b 4
_cell_length_c 4
loop_
_atom_site_label
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Fe1 0 0 0
Fe2 0.5 0.5 0.5
`);
    const sm = C.summary(s, C.expand(s)); check('cif: no ops or angles: P1 and 90° assumed with warnings; Fe2 per cell, Z = 2', s.warnings.length === 4 && sm.formula === 'Fe' && sm.Z === 2 && rel(sm.density, 2 * 55.845 / (6.02214076e23 * 64e-24), 1e-4)); }
  { let e = ''; try { C.readStructure(`data_x
_cell_length_a 4
`); } catch (x) { e = x.message; } check('cif: a file without atom sites is refused', e.includes('No data block')); }
  { const s = C.readStructure(C.EXAMPLES[0].cif.replace('Cl1 Cl 0.5 0.5 0.5 1', `Cl1 Cl 0.5 0.5 0.5 1
Br1 Br 0.5 0.5 0.5 0.5`).replace('Cl1 Cl 0.5 0.5 0.5 1', 'Cl1 Cl 0.5 0.5 0.5 0.5'));
    const sm = C.summary(s, C.expand(s)); check('cif: partial occupancy: Na4 Cl2 Br2 per cell counted by occupancy; Z = 4 with _chemical_formula_sum, else the smallest whole formula', sm.counts.get('Cl') === 2 && sm.counts.get('Br') === 2 && sm.formula === 'BrClNa2' && sm.Z === 2 && (() => { const s2 = C.readStructure(C.EXAMPLES[0].cif.replace("'Cl Na'", "'Br0.5 Cl0.5 Na'").replace('Cl1 Cl 0.5 0.5 0.5 1', `Cl1 Cl 0.5 0.5 0.5 0.5\nBr1 Br 0.5 0.5 0.5 0.5`)); const m = C.summary(s2, C.expand(s2)); return m.Z === 4 && m.formula === 'Br0.5Cl0.5Na'; })()); }
  check('cif: shortest distance and display atoms (NaCl draws 27 atoms: corners, faces, edges and centre)', Math.abs(C.shortest(ex.nacl.s.cell, ex.nacl.at) - 2.82) < 1e-9 && C.displayAtoms(ex.nacl.at).length === 27);
  { const b = C.bondTable(ex.tio2.s, ex.tio2.at, 2.0); check('cif: rutile bond table: Ti–O 4 × 1.947 and 2 × 1.980 Å, coordination Ti 6, O 3', b.cn.get('Ti1') === 6 && b.cn.get('O1') === 3 && b.rows.some((r) => r.a === 'Ti1' && r.n === 4 && r.d.toFixed(3) === '1.947')); }
};
