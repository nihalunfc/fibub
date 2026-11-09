// #838 molecule viewer
export const path = '/science/molecule-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.molv';
  await page.goto(`${BASE}/science/molecule-viewer/`);
  await page.waitForFunction(() => (document.querySelector('.molv .mv-cv')?.dataset.atoms ?? '').split(';').length === 24, null, { timeout: 10000 });
  const facts = () => page.textContent(`${R} .mv-facts`), meas = () => page.textContent(`${R} .mv-meas`), picks = () => page.textContent(`${R} .mv-picks`);
  { const f = await facts(); check(f.includes('C8H10N4O2') && f.includes('Atoms24') && f.includes('25 (from the file)') && f.includes('194.194 g/mol') && f.includes('-0.0941, 0.0076, -0.0023') && f.includes('MOL, title "caffeine"'), `mv: caffeine facts (${f})`); }
  check((await page.locator(`${R} .mv-bonds tbody tr`).count()) === 25 && (await page.textContent(`${R} .mv-bonds tbody tr:first-child`)) === 'C1–N2single1.4409', 'mv: bond table');
  const ink = () => page.$eval(`${R} .mv-cv`, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 2]) > 40 || d[i] < 200) n++; return n; });
  const n0 = await ink();
  check(n0 > 3000, `mv: drawn (${n0})`);
  // Typed measurement
  await page.fill(`${R} .mv-typed`, '1 2'); await page.waitForTimeout(60);
  check((await meas()) === 'C1–N2 1.4409 Å' && (await picks()) === 'Picked: C1 – N2', 'mv: distance');
  await page.fill(`${R} .mv-typed`, '1 2 3'); await page.waitForTimeout(60);
  check((await meas()) === 'C1–N2 1.4409 Å, angle 126.20°', 'mv: angle');
  await page.fill(`${R} .mv-typed`, '1 2 3 4'); await page.waitForTimeout(60);
  check((await meas()).endsWith('dihedral 180.00°') || (await meas()).endsWith('dihedral -180.00°'), `mv: dihedral (${await meas()})`);
  await page.fill(`${R} .mv-typed`, '1 99'); await page.waitForTimeout(60);
  check((await page.textContent(`${R} .mv-terr`)) === 'Atom numbers run from 1 to 24.', 'mv: bad atom number');
  await page.click(`${R} .mv-clear`); await page.waitForTimeout(60);
  check((await meas()) === '' && (await picks()).startsWith('Tap two atoms'), 'mv: clear');
  // Tap atoms on the canvas: choose two well-separated atoms in the drawing.
  await page.locator(`${R} .mv-cv`).scrollIntoViewIfNeeded();
  const pos = (await page.getAttribute(`${R} .mv-cv`, 'data-atoms')).split(';').map((s) => s.split(',').map(Number));
  const lone = pos.map((p, i) => ({ i, d: Math.min(...pos.filter((_, j) => j !== i).map((q) => Math.hypot(q[0] - p[0], q[1] - p[1]))) })).sort((a, b) => b.d - a.d).slice(0, 2).map((x) => x.i);
  const box = await page.locator(`${R} .mv-cv`).boundingBox();
  for (const i of lone) { await page.mouse.click(box.x + pos[i][0], box.y + pos[i][1]); await page.waitForTimeout(80); }
  { const A = lone.map((i) => i + 1); const t = await picks(); check(t.includes(`${A[0]}`) && t.includes(`${A[1]}`) && /Å$/.test(await meas()), `mv: tap two atoms (${t}; ${await meas()})`); }
  await page.mouse.click(box.x + pos[lone[1]][0], box.y + pos[lone[1]][1]); await page.waitForTimeout(80);
  check(!(await picks()).includes('–') && (await meas()) === '', 'mv: tap again un-picks');
  await page.click(`${R} .mv-clear`);
  // Drag rotates; wheel zooms
  await page.locator(`${R} .mv-cv`).scrollIntoViewIfNeeded();
  const before = await page.getAttribute(`${R} .mv-cv`, 'data-atoms');
  Object.assign(box, await page.locator(`${R} .mv-cv`).boundingBox());
  await page.mouse.move(box.x + 20, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + 120, box.y + box.height / 2 + 30, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(80);
  const afterDrag = await page.getAttribute(`${R} .mv-cv`, 'data-atoms');
  check(afterDrag !== before && (await picks()).startsWith('Tap two atoms'), 'mv: drag turns without picking');
  const spread = (s) => { const p = s.split(';').map((t) => t.split(',').map(Number)); return Math.max(...p.map((a) => a[0])) - Math.min(...p.map((a) => a[0])); };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.wheel(0, -400); await page.waitForTimeout(80);
  check(spread(await page.getAttribute(`${R} .mv-cv`, 'data-atoms')) > spread(afterDrag) * 1.2, 'mv: wheel zooms in');
  await page.click(`${R} .mv-reset`); await page.waitForTimeout(60);
  check((await page.getAttribute(`${R} .mv-cv`, 'data-atoms')) === before, 'mv: reset view');
  // Styles, hydrogens, labels
  for (const s of ['stick', 'space', 'ball']) { await page.click(`${R} .mv-style [data-s="${s}"]`); await page.waitForTimeout(60); check((await ink()) > 2000, `mv: style ${s}`); }
  await page.uncheck(`${R} .mv-h`); await page.selectOption(`${R} .mv-lab`, 'num'); await page.waitForTimeout(60);
  check((await ink()) > 2000, 'mv: no hydrogens, number labels');
  await page.check(`${R} .mv-h`); await page.selectOption(`${R} .mv-lab`, 'none');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .mv-png`)]); const f = OUT + 'mv.png'; await d.saveAs(f); const b = readFileSync(f); check(d.suggestedFilename() === 'caffeine.png' && b.subarray(1, 4).toString() === 'PNG' && b.length > 20000, 'mv: PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .mv-xyz`)]); const f = OUT + 'mv.xyz'; await d.saveAs(f); const t = readFileSync(f, 'utf8').split('\n'); check(t[0] === '24' && t[1] === 'caffeine' && t[2].startsWith('C ') && t.length === 27, 'mv: XYZ'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .mv-bcsv`)]); const f = OUT + 'mvb.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('atom_1,atom_2,element_1,element_2,order,length_A\n1,2,C,N,1,1.44089\n') && t.trim().split('\n').length === 26, 'mv: bonds CSV'); }
  // XYZ example: guessed bonds
  await page.click(`${R} .mv-ex[data-ex="eth"]`); await page.waitForTimeout(150);
  check((await facts()).includes('8 (guessed from distances, tolerance 0.45 Å)') && (await facts()).includes('C2H6O'), 'mv: XYZ guessed bonds');
  // SDF with three records
  await page.click(`${R} .mv-ex[data-ex="sdf"]`); await page.waitForTimeout(150);
  check(!(await page.isHidden(`${R} .mv-reclab`)) && (await page.locator(`${R} .mv-rec option`).count()) === 3 && (await facts()).includes('C9H8O4') && (await page.textContent(`${R} .mv-props`)).includes('CC(=O)Oc1ccccc1C(=O)O'), 'mv: SDF first record');
  await page.selectOption(`${R} .mv-rec`, '1'); await page.waitForTimeout(100);
  check((await facts()).includes('C6H12') && (await facts()).includes('title "cyclohexane"'), 'mv: SDF second record');
  // Files and errors
  await page.setInputFiles(`${R} .mv-file`, { name: 'w.xyz', mimeType: 'text/plain', buffer: Buffer.from('3\nwater\nO 0 0 0.12\nH 0 0.76 -0.48\nH 0 -0.76 -0.48\n') }); await page.waitForTimeout(150);
  check((await facts()).includes('H2O') && (await facts()).includes('2 (guessed'), 'mv: open an XYZ file');
  await page.setInputFiles(`${R} .mv-file`, { name: 'bad.xyz', mimeType: 'text/plain', buffer: Buffer.from('3\nwater\nO 0 0 0.12\nH 0 0.76\n') }); await page.waitForTimeout(150);
  check((await page.textContent(`${R} .mv-err`)).startsWith('Line 4: expected atom 2 of 3') && (await page.isHidden(`${R} .mv-out`)), 'mv: broken XYZ message');
  await page.fill(`${R} .mv-in`, 'ATOM      1  N   ALA A   1      11.104  6.134  -6.504  1.00  0.00           N\n'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .mv-err`)).includes('PDB structure viewer'), 'mv: PDB points to the PDB viewer');
};
