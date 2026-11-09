// #185 PDB structure viewer
import { gzipSync } from 'node:zlib';
export const path = '/science/pdb-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/pdb-viewer/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(`.pvdb ${c}`);
  const wait = (ms = 450) => page.waitForTimeout(ms);
  const shot = () => page.evaluate(() => document.querySelector('.pvdb .pv-view').toDataURL());
  // Pixels that are not the background, and the first one near the middle row band.
  const inked = () => page.evaluate(() => {
    const c = document.querySelector('.pvdb .pv-view'), x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data, bg = [d[0], d[1], d[2]];
    let n = 0; for (let i = 0; i < d.length; i += 16) if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 60) n++;
    return n;
  });
  check((await t('.pv-big')) === '2 chains, 46 residues, 1 ligand', 'pdb viewer: example summary');
  { const f = await t('.pv-facts'); check(f.includes('240') && f.includes('57 % helix, 26 % strand') && f.includes("from the file's HELIX and SHEET records") && f.includes('A, B'), `pdb viewer: facts (${f.slice(0, 80)})`); }
  check((await t('.pv-chains')).includes('1 to 34') && (await t('.pv-seqs')).includes('Chain B') && (await page.$$('.pvdb .pv-seq button')).length === 46 && (await page.$$('.pvdb .pv-seq button.pv-h')).length === 26, 'pdb viewer: chain table and sequences coloured by secondary structure');
  check((await t('.pv-ligs')).includes('LIG') && (await t('.pv-ligs')).includes('A TYR 29'), 'pdb viewer: ligand table with nearby residues');
  check((await t('.pv-mout')) === 'Closest atoms: A GLU 4 O to B ALA 10 CB, 3.316 Å. CA to CA: 4.468 Å.' && (await t('.pv-pick')).endsWith('3.316 Å'), 'pdb viewer: residue distance (as Biopython) and the pick line');
  check((await t('.pv-cbig')) === '64 residue pairs within 4 Å' && (await page.$$('.pvdb .pv-ctab tbody tr')).length === 64, 'pdb viewer: contacts at 4 Å match Biopython (64)');
  check((await inked()) > 300, 'pdb viewer: the 3D view is drawn');

  // Contact settings (Biopython: 69 at 4.5 Å; 65 at 6 Å skipping 5).
  await page.fill('.pvdb .pv-cut', '4.5'); await wait();
  check((await t('.pv-cbig')) === '69 residue pairs within 4.5 Å', 'pdb viewer: 4.5 Å cutoff');
  await page.fill('.pvdb .pv-cut', '6'); await page.fill('.pvdb .pv-sep', '5'); await wait();
  check((await t('.pv-cbig')) === '65 residue pairs within 6 Å', 'pdb viewer: 6 Å, skip 5');
  await page.fill('.pvdb .pv-cut', '4'); await page.fill('.pvdb .pv-sep', '3'); await wait();
  await page.selectOption('.pvdb .pv-scope', 'chains'); await wait(100);
  check((await t('.pv-cbig')) === '7 residue pairs between chains within 4 Å' && (await t('.pv-ctab')).includes('between chains'), 'pdb viewer: between chains only');
  await page.selectOption('.pvdb .pv-scope', 'ligands'); await page.check('.pvdb .pv-cwat'); await wait(100);
  { const b = await t('.pv-cbig'), tab = await t('.pv-ctab'); check(b === '4 residue pairs with ligands or water within 4 Å' && tab.includes('A HOH 201') && tab.includes('A LIG 101'), `pdb viewer: ligand and water contacts (${b})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pvdb .pv-csv')]); const f = OUT + 'pdb-contacts.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'example-contacts.csv' && rows.length === 5 && rows[0].startsWith('chain_1,residue_1,number_1') && rows.includes('A,TYR,29,A,LIG,101,3.356,CB,C5,2,ligand'), 'pdb viewer: contacts CSV'); }
  await page.uncheck('.pvdb .pv-cwat'); await page.selectOption('.pvdb .pv-scope', 'all'); await wait(100);
  await page.fill('.pvdb .pv-cut', '20'); await wait();
  check((await t('.pv-cerr')).includes('between 1 and 12'), 'pdb viewer: bad cutoff message');
  await page.fill('.pvdb .pv-sep', '0'); await page.fill('.pvdb .pv-cut', '4'); await wait();
  check((await t('.pv-cerr')).includes('whole number'), 'pdb viewer: bad skip message');
  await page.fill('.pvdb .pv-sep', '3'); await wait();
  check(await page.isHidden('.pvdb .pv-cerr') && (await t('.pv-cbig')).startsWith('64 '), 'pdb viewer: back to 64');

  // Secondary structure guess.
  await page.selectOption('.pvdb .pv-ss', 'guess'); await wait(150);
  { const f = await t('.pv-facts'); check(f.includes('63 % helix, 17 % strand') && f.includes('rough guess'), `pdb viewer: C-alpha guess (${f.slice(-80)})`); }
  await page.selectOption('.pvdb .pv-ss', 'auto'); await wait(150);
  check((await t('.pv-facts')).includes('57 % helix'), 'pdb viewer: back to the records');

  // Turning, zooming, reset.
  const a0 = await shot();
  const box = await page.locator('.pvdb .pv-view').boundingBox();
  await page.locator('.pvdb .pv-view').scrollIntoViewIfNeeded();
  { const bb = await page.locator('.pvdb .pv-view').boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 2 + 80, bb.y + bb.height / 2 + 30, { steps: 6 }); await page.mouse.up(); }
  await wait(150);
  const a1 = await shot();
  check(a1 !== a0 && box.width > 0, 'pdb viewer: dragging turns the view');
  await page.click('.pvdb .pv-zin'); await wait(150);
  check((await shot()) !== a1, 'pdb viewer: zoom in');
  await page.click('.pvdb .pv-reset'); await wait(150);
  check((await shot()) === a0, 'pdb viewer: reset view');
  await page.focus('.pvdb .pv-view'); await page.keyboard.press('ArrowLeft'); await wait(150);
  check((await shot()) !== a0, 'pdb viewer: arrow keys turn it');
  await page.click('.pvdb .pv-reset'); await wait(100);

  // Tap two atoms: find drawn pixels and tap on them.
  await page.click('.pvdb .pv-clear'); await wait(100);
  check((await t('.pv-pick')).startsWith('Tap an atom') && (await t('.pv-mout')) === '', 'pdb viewer: clear picks');
  // The drawn pixels are read back from the canvas, so wait until it has finished drawing (on a
  // busy machine the first read can come back empty, which would make the taps miss).
  const findSpots = () => page.evaluate(() => {
    const c = document.querySelector('.pvdb .pv-view'), r = c.getBoundingClientRect(), x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data, bg = [d[0], d[1], d[2]], s = c.width / r.width, out = [];
    for (let px = 4; px < c.width; px += 6) for (let py = 4; py < c.height; py += 6) { const i = (py * c.width + px) * 4; if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 150) out.push([px / s, py / s]); }
    return out;
  });
  let drawn = await findSpots();
  for (let i = 0; i < 20 && drawn.length < 2; i++) { await wait(100); drawn = await findSpots(); }
  check(drawn.length >= 2, `pdb viewer: atoms are drawn on the canvas (${drawn.length} spots)`);
  await page.locator('.pvdb .pv-view').scrollIntoViewIfNeeded();
  { const bb = await page.locator('.pvdb .pv-view').boundingBox();
    // Tap the first spot that lands on an atom: a stray pixel of a bond would pick nothing.
    let picked = '';
    for (const [sx, sy] of drawn.slice(0, 12)) { await page.mouse.click(bb.x + sx, bb.y + sy); await wait(100); picked = await t('.pv-pick'); if (picked.includes('picked')) break; }
    check(picked.includes('picked'), `pdb viewer: tap picks an atom (${picked})`);
    for (const [sx, sy] of drawn.slice().reverse().slice(0, 12)) { await page.mouse.click(bb.x + sx, bb.y + sy); await wait(100); if (/: \d+\.\d{3} Å$/.test(await t('.pv-pick'))) break; } }
  check(/: \d+\.\d{3} Å$/.test(await t('.pv-pick')), `pdb viewer: second tap gives a distance (${await t('.pv-pick')})`);

  // Sequence letters fill the residue boxes.
  await page.locator('.pvdb .pv-seq button[title="A TYR 29"]').scrollIntoViewIfNeeded();
  await page.click('.pvdb .pv-seq button[title="A TYR 29"]'); await wait(100);
  await page.click('.pvdb .pv-seq button[title="A VAL 22"]'); await wait(100);
  check((await t('.pv-mout')).startsWith('Closest atoms: A TYR 29') && (await t('.pv-mout')).includes('A VAL 22') && (await page.$$('.pvdb .pv-seq button.pv-sel')).length === 2, `pdb viewer: tapping sequence letters measures (${await t('.pv-mout')})`);
  await page.locator('.pvdb .pv-ctab tbody tr').first().click(); await wait(100);
  check((await t('.pv-pick')).startsWith('A SER 1 '), 'pdb viewer: tapping a contact row marks it');

  // Styles and colours.
  for (const [st, col, leg] of [['trace', 'chain', 'Chain B'], ['trace', 'b', 'B '], ['cartoon', 'rainbow', 'N end'], ['atoms', 'element', 'O']]) {
    await page.selectOption('.pvdb .pv-style', st); await page.selectOption('.pvdb .pv-color', col); await wait(150);
    check((await t('.pv-legend')).includes(leg) && (await inked()) > 200, `pdb viewer: ${st} coloured by ${col}`);
  }
  await page.selectOption('.pvdb .pv-style', 'cartoon'); await wait(100);
  check((await page.inputValue('.pvdb .pv-color')) === 'chain', 'pdb viewer: leaving all atoms drops element colours');
  await page.selectOption('.pvdb .pv-color', 'element'); await wait(100);
  check((await page.inputValue('.pvdb .pv-style')) === 'atoms', 'pdb viewer: element colours switch to all atoms');
  await page.selectOption('.pvdb .pv-style', 'cartoon'); await page.selectOption('.pvdb .pv-color', 'ss');
  await page.check('.pvdb .pv-wat'); await page.uncheck('.pvdb .pv-lig'); await wait(150);
  check(!(await t('.pv-legend')).includes('ligand'), 'pdb viewer: ligands hidden, water shown');
  await page.check('.pvdb .pv-lig'); await page.uncheck('.pvdb .pv-wat');

  // Downloads.
  { await page.locator('.pvdb .pv-png').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pvdb .pv-png')]); const f = OUT + 'pdb-view.png'; await d.saveAs(f); const b = readFileSync(f); check(d.suggestedFilename() === 'example-view.png' && b.readUInt32BE(16) === 1600 && b.readUInt32BE(20) === 1200, 'pdb viewer: view PNG 1600 × 1200'); }
  { await page.locator('.pvdb .dl [data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pvdb .dl [data-f=png]')]); check(d.suggestedFilename() === 'example-structure.png', 'pdb viewer: PNG report'); }

  // Other files: mmCIF, gzipped PDB, bad text.
  const cif = ['data_T', "_struct.title 'Two residues'", 'loop_', '_atom_site.group_PDB', '_atom_site.id', '_atom_site.type_symbol', '_atom_site.label_atom_id', '_atom_site.label_comp_id', '_atom_site.auth_asym_id', '_atom_site.auth_seq_id', '_atom_site.Cartn_x', '_atom_site.Cartn_y', '_atom_site.Cartn_z', '_atom_site.B_iso_or_equiv',
    'ATOM 1 N N GLY A 1 0.000 0.000 0.000 10', 'ATOM 2 C CA GLY A 1 1.458 0.000 0.000 10', 'ATOM 3 C C GLY A 1 2.009 1.422 0.000 10', 'ATOM 4 N N ALA A 2 3.300 1.600 0.000 12', 'ATOM 5 C CA ALA A 2 3.950 2.900 0.000 12', 'ATOM 6 C C ALA A 2 5.450 2.700 0.000 12', 'HETATM 7 ZN ZN ZN A 101 0.000 5.000 5.000 30'].join('\n') + '\n';
  writeFileSync(OUT + 'two.cif', cif);
  await page.setInputFiles('.pvdb .pv-file', OUT + 'two.cif'); await wait(500);
  check((await t('.pv-big')) === '1 chain, 2 residues, 1 ligand' && (await t('.pv-title')) === 'Two residues (two)' && (await t('.pv-facts')).includes('mmCIF'), `pdb viewer: opens an mmCIF file (${await t('.pv-big')})`);
  check((await t('.pv-mout')).startsWith('Closest atoms: A GLY 1') && (await inked()) > 20, 'pdb viewer: mmCIF residues measured and drawn');
  const pdb = readFileSync(new URL('../../src/lib/sci/pdb-example.ts', import.meta.url), 'utf8').split('`')[1].split('\n').filter((l) => !l.includes(' B ') && !l.startsWith('HELIX    2')).join('\n');
  writeFileSync(OUT + 'one.pdb.gz', gzipSync(pdb));
  await page.setInputFiles('.pvdb .pv-file', OUT + 'one.pdb.gz'); await wait(600);
  check((await t('.pv-big')) === '1 chain, 34 residues, 1 ligand' && (await t('.pv-title')).endsWith('(one)'), `pdb viewer: opens a gzipped PDB (${await t('.pv-big')})`);
  await page.click('.pvdb .pv-paste-d summary'); await page.fill('.pvdb .pv-paste', 'hello world'); await page.click('.pvdb .pv-show'); await wait(200);
  check((await t('.pv-err')).startsWith('No ATOM or HETATM'), 'pdb viewer: bad pasted text message');
  await page.fill('.pvdb .pv-paste', ''); await page.click('.pvdb .pv-show'); await wait(100);
  check((await t('.pv-err')).startsWith('Paste the text'), 'pdb viewer: empty paste message');
  await page.click('.pvdb .pv-ex'); await wait(300);
  check(await page.isHidden('.pvdb .pv-err') && (await t('.pv-big')) === '2 chains, 46 residues, 1 ligand' && (await t('.pv-cbig')).startsWith('64 '), 'pdb viewer: example button restores it');
};
