// #843 CIF viewer
export const path = '/science/cif-viewer/';
// A made-up monoclinic test structure written by fibub (not a real compound); reference values from gemmi.
const MONO = `# A made-up monoclinic test structure written by fibub (not a real compound).
data_madeup_mono
_chemical_name_common 'made-up test, not a real compound'
_chemical_formula_sum 'Ca O2'
_cell_length_a   5.2140(3)
_cell_length_b   6.7300(4)
_cell_length_c   7.1100(5)
_cell_angle_alpha 90
_cell_angle_beta  104.25(2)
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'P 1 21/c 1'
_publ_section_comment
;
A text field that a reader must skip,
with data_ and loop_ words inside it.
;
loop_
_symmetry_equiv_pos_site_id
_symmetry_equiv_pos_as_xyz
1 x,y,z
2 '-x, 1/2+y, 1/2-z'
3 -x,-y,-z
4 "x, -y+1/2, z+1/2"
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
_atom_site_U_iso_or_equiv
Ca1 Ca2+ 0.1123(2) 0.2051(2) 0.3172(3) 1 0.010
O1  O2-  0.4010(5) 0.1032(4) 0.2120(5) 1 0.012
O2  O2-  0.2500(6) 0.7480(5) 0.0410(5) 1.0 0.015
`;
const P1 = 'data_x\n_cell_length_a 4\n_cell_length_b 4\n_cell_length_c 4\nloop_\n_atom_site_label\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\nFe1 0 0 0\nFe2 0.5 0.5 0.5\n';
const BADOP = 'data_x\n_cell_length_a 4\n_cell_length_b 4\n_cell_length_c 4\nloop_\n_symmetry_equiv_pos_as_xyz\n"x,y"\nloop_\n_atom_site_label\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\nFe1 0 0 0\n';

export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cvw ';
  const txt = (s) => page.textContent(R + s);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await txt('.cv-big')) === 'ClNa, Z = 4; 2.164 g/cm³', 'cif: NaCl example headline');
  { const f = await txt('.cv-facts'); check(f.includes('5.64, 5.64, 5.64 Å') && f.includes('179.406 Å³') && f.includes('Cl 4, Na 4 from 2 sites and 192 symmetry operations') && f.includes('F m -3 m (No. 225)') && f.includes('2.820 Å'), 'cif: NaCl facts'); }
  { const t = await txt('.cv-btab'); check(t.includes('Na1Cl12.82006') && (await txt('.cv-cn')).includes('within 3.25 Å') && (await txt('.cv-cn')).includes('Na1 6'), 'cif: NaCl bonds and coordination'); }
  check((await page.$$(R + '.cv-atab tbody tr')).length === 8 && await page.isVisible(R + '.cv-fig') && (await txt('.cv-leg')) === 'ClNa', 'cif: atom table, picture and legend');
  // Other examples.
  await page.selectOption(R + '.cv-ex', 'tio2'); await page.waitForTimeout(300);
  check((await txt('.cv-big')) === 'O2Ti, Z = 2; 4.253 g/cm³' && (await txt('.cv-btab')).includes('Ti1O11.94754') && (await txt('.cv-btab')).includes('1.97982'), `cif: rutile example (${await txt('.cv-btab')})`);
  await page.selectOption(R + '.cv-ex', 'zno'); await page.waitForTimeout(300);
  check((await txt('.cv-big')) === 'OZn, Z = 2; 5.671 g/cm³' && (await txt('.cv-facts')).includes('γ 120°') && (await txt('.cv-cn')).includes('Zn1 4'), 'cif: wurtzite example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cv-cif')]); const f = OUT + 'zno.cif'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('_space_group_symop_operation_xyz') && s.includes('Written by fibub'), 'cif: example CIF download'); }
  // Open a file: the made-up monoclinic test.
  writeFileSync(OUT + 'mono.cif', MONO);
  await page.setInputFiles(R + '.cv-file', OUT + 'mono.cif'); await page.waitForTimeout(500);
  { const f = await txt('.cv-facts'); check((await txt('.cv-big')) === 'CaO2, Z = 4; 1.980 g/cm³' && f.includes('5.214(±0.0003)') && f.includes('β 104.25°') && f.includes('P 1 21/c 1') && await page.isHidden(R + '.cv-cif'), 'cif: monoclinic file opened (gemmi: 1.9798 g/cm³)'); }
  check((await page.$$(R + '.cv-atab tbody tr')).length === 12 && (await txt('.cv-btab')).includes('Ca1O11.9621'), 'cif: monoclinic 12 atoms and shortest bond (gemmi)');
  // Cut-off, bonds, labels, size and turning redraw.
  await page.fill(R + '.cv-cut', '2.5'); await page.waitForTimeout(400);
  check((await txt('.cv-cn')).includes('within 2.5 Å') && (await txt('.cv-btab')).includes('2.3677') && !(await txt('.cv-btab')).includes('2.7903'), 'cif: cut-off changes the bond table');
  const pic = () => page.$eval(R + '.cv-fig', (c) => c.toDataURL());
  let p0 = await pic();
  await page.uncheck(R + '.cv-bonds'); await page.waitForTimeout(100); let p1 = await pic(); check(p0 !== p1, 'cif: bonds switch redraws');
  await page.check(R + '.cv-labels'); await page.waitForTimeout(100); p0 = await pic(); check(p0 !== p1, 'cif: labels switch redraws');
  await page.fill(R + '.cv-size', '1'); await page.dispatchEvent(R + '.cv-size', 'input'); await page.waitForTimeout(100); p1 = await pic(); check(p0 !== p1, 'cif: atom size redraws');
  await page.$eval(R + '.cv-fig', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  { const bb = await page.locator(R + '.cv-fig').boundingBox(); const cy = bb.y + bb.height / 2; await page.mouse.move(bb.x + 100, cy); await page.mouse.down(); await page.mouse.move(bb.x + 150, cy, { steps: 4 }); await page.mouse.up(); }
  check((await page.inputValue(R + '.cv-yaw')) === '-140', `cif: dragging turns the cell (${await page.inputValue(R + '.cv-yaw')})`);
  await page.click(R + '.cv-reset'); check((await page.inputValue(R + '.cv-yaw')) === '-110', 'cif: reset view');
  // CSVs.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cv-csv')]); const f = OUT + 'atoms.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[0].startsWith('label,element,fract_x') && rows[1].startsWith('Ca1,Ca,0.1123'), 'cif: atoms CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cv-bcsv')]); const f = OUT + 'bonds.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'atom,neighbour,distance_angstrom,number' && rows[1].startsWith('Ca1,O1,1.96212'), 'cif: bonds CSV'); }
  // Bad input.
  await page.fill(R + '.cv-cut', '9'); await page.waitForTimeout(400);
  check((await txt('.cv-err')).includes('cut-off is between'), 'cif: bad cut-off');
  await page.fill(R + '.cv-in', 'hello world'); await page.waitForTimeout(700);
  check((await txt('.cv-err')).includes('does not look like a CIF') && await page.isHidden(R + '.cv-out'), 'cif: not a CIF');
  await page.fill(R + '.cv-in', P1); await page.waitForTimeout(700);
  check((await txt('.cv-big')) === 'Fe, Z = 2; 2.898 g/cm³' && (await txt('.cv-warn')).includes('P1'), `cif: pasted CIF without symmetry warns and shows P1 (${await txt('.cv-big')})`);
  await page.fill(R + '.cv-in', BADOP); await page.waitForTimeout(700);
  check((await txt('.cv-err')).includes('three parts'), 'cif: bad symmetry operation message');
  writeFileSync(OUT + 'bin.cif', Buffer.from([0, 1, 2, 3, 0, 0]));
  await page.setInputFiles(R + '.cv-file', OUT + 'bin.cif'); await page.waitForTimeout(300);
  check((await txt('.cv-err')).includes('not a text file'), 'cif: binary file refused');
};
