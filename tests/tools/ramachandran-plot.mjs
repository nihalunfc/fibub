// #186 Ramachandran plot
export const path = '/science/ramachandran-plot/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/ramachandran-plot/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.rama .ra-big');
  check((await big()) === '29 residues plotted: 44.8 % α, 44.8 % β, 3.4 % αL, 6.9 % outside the guides', 'ramachandran: example summary');
  { const f = await page.textContent('.rama .ra-facts'); check(f.includes('XMPL') && f.includes('A, B') && f.includes('3329 with both φ and ψ') && f.includes('3, 2') && f.includes('cis peptides1'), `ramachandran: example facts (${f})`); }
  { const o = await page.textContent('.rama .ra-outl'); check(o.includes('A ASP 23: φ 62.5°, ψ -118.4°') && o.includes('B GLY 4 (Gly): φ 101.7°, ψ -168.4°') && o.includes('A THR 15: cis peptide to the next residue (ω -4.5°)'), 'ramachandran: residues outside the guides and the cis peptide'); }
  { const t = await page.textContent('.rama .ra-tab'); check(t.includes('A LEU 6-66.8-41.3') && t.includes('A GLY 14 (Gly)78.421.7') && t.includes('78.421.7-180.0αL') && t.includes('chain start') && (await page.$$('.rama .ra-tab tr')).length === 34 && (await page.$$('.rama .ra-tab tr.out')).length === 2, 'ramachandran: residue table'); }
  check(await page.isVisible('.rama .ra-fig') && (await page.getAttribute('.rama .ra-fig', 'aria-label')).includes('29 residues'), 'ramachandran: plot drawn');
  // Tap a point: A ASP 23 at phi 62.5, psi -118.4.
  { await page.locator('.rama .ra-fig').scrollIntoViewIfNeeded(); const bb = await page.locator('.rama .ra-fig').boundingBox(); const s = bb.width / 480, P = 480 - 66;
    await page.mouse.click(bb.x + (52 + ((62.5 + 180) / 360) * P) * s, bb.y + (14 + ((180 + 118.4) / 360) * P) * s);
    check((await page.textContent('.rama .ra-pick')).startsWith('A ASP 23: φ 62.5°, ψ -118.4°, outside the guides'), 'ramachandran: tap a point to name it');
    await page.mouse.click(bb.x + (52 + P * 0.9) * s, bb.y + (14 + P * 0.9) * s);
    check((await page.textContent('.rama .ra-pick')).startsWith('No residue there'), 'ramachandran: tap an empty spot'); }
  // Chains.
  await page.selectOption('.rama .ra-chain', 'B'); await page.waitForTimeout(100);
  check((await big()) === '6 residues plotted: 16.7 % α, 66.7 % β, 0.0 % αL, 16.7 % outside the guides' && (await page.$$('.rama .ra-tab tr')).length === 9, 'ramachandran: chain B only');
  await page.selectOption('.rama .ra-chain', '*'); await page.waitForTimeout(100);
  // Options.
  await page.uncheck('.rama .ra-guides'); await page.uncheck('.rama .ra-labels'); await page.waitForTimeout(100);
  check(await page.isVisible('.rama .ra-fig') && (await big()).startsWith('29 residues'), 'ramachandran: guides and labels off');
  await page.check('.rama .ra-guides'); await page.check('.rama .ra-labels');
  await page.fill('.rama .ra-bond', '1.2'); await page.waitForTimeout(500);
  check((await big()).startsWith('0 residues plotted') && (await page.textContent('.rama .ra-tab')).includes('no neighbours'), 'ramachandran: a peptide bond limit below 1.33 Å breaks every link');
  await page.fill('.rama .ra-bond', '2'); await page.waitForTimeout(500);
  // Guide regions.
  await page.click('.rama .ra-reg > summary');
  await page.fill('.rama .ra-regs', 'Everything, all, 0, 0, 180, 180'); await page.waitForTimeout(500);
  check(/^29 residues plotted: [\d.]+ % all, [\d.]+ % outside the guides$/.test(await big()) && (await page.textContent('.rama .ra-tab')).includes('-38.2180.0all'), 'ramachandran: edited guide region');
  await page.fill('.rama .ra-regs', 'Everything, all, 0, 0, 180, 180\nCorners, c, 180, 180, 180, 180'); await page.waitForTimeout(500);
  check((await big()) === '29 residues plotted: 48.3 % all, 51.7 % c, 0.0 % outside the guides' && (await page.textContent('.rama .ra-outl')).includes('None: every plotted residue'), 'ramachandran: two regions that cover the whole plot');
  await page.fill('.rama .ra-regs', 'Helix, a, -60, -45\nOK, b, -120, 130, 60, 60'); await page.waitForTimeout(500);
  check((await page.textContent('.rama .ra-rerr')).includes('Line 1') && (await big()).includes('% b,'), 'ramachandran: bad region line message');
  await page.click('.rama .ra-reset'); await page.waitForTimeout(100);
  check((await big()).includes('44.8 % α') && await page.isHidden('.rama .ra-rerr'), 'ramachandran: guides put back');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rama .ra-csv')]); const f = OUT + 'rama.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 34 && rows[0].startsWith('chain,residue_number') && rows.includes('A,23,,ASP,D,62.5,-118.4,-180.0,other,outside the guides,outside the guides') && d.suggestedFilename() === 'example-phi-psi.csv', 'ramachandran: angles CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rama .dl button[data-f=png]')]); check(d.suggestedFilename() === 'example-ramachandran.png', 'ramachandran: image report'); }
  // An mmCIF file with one chain (a short helix written by the test).
  { const cif = ['data_TEST', 'loop_', '_atom_site.group_PDB', '_atom_site.label_atom_id', '_atom_site.label_comp_id', '_atom_site.auth_asym_id', '_atom_site.auth_seq_id', '_atom_site.Cartn_x', '_atom_site.Cartn_y', '_atom_site.Cartn_z'];
    const pdb = await page.evaluate(() => document.querySelector('.rama .ra-in').value);
    for (const l of pdb.split('\n').filter((l) => l.startsWith('ATOM') && l[21] === 'A' && Number(l.slice(22, 26)) <= 6)) cif.push(['ATOM', l.slice(12, 16).trim(), l.slice(17, 20), 'H', l.slice(22, 26).trim(), l.slice(30, 38).trim(), l.slice(38, 46).trim(), l.slice(46, 54).trim()].join(' '));
    writeFileSync(OUT + 'helix.cif', cif.join('\n') + '\n#\n');
    await page.setInputFiles('.rama .ra-file', OUT + 'helix.cif'); await page.waitForTimeout(400);
    check((await big()) === '4 residues plotted: 100.0 % α, 0.0 % β, 0.0 % αL, 0.0 % outside the guides' && (await page.textContent('.rama .ra-facts')).includes('mmCIF') && await page.isDisabled('.rama .ra-chain'), 'ramachandran: mmCIF file'); }
  // Bad input.
  await page.fill('.rama .ra-in', 'hello, this is not a structure'); await page.waitForTimeout(600);
  check((await page.textContent('.rama .ra-err')).includes('No atoms found') && await page.isHidden('.rama .ra-out'), 'ramachandran: not a structure');
  await page.fill('.rama .ra-in', 'HETATM    1  C1  LIG X   1       1.000   2.000   3.000  1.00 20.00           C'); await page.waitForTimeout(600);
  check((await page.textContent('.rama .ra-err')).includes('no residues with backbone'), 'ramachandran: no backbone atoms');
  await page.click('.rama .ra-ex'); await page.waitForTimeout(200);
  check((await big()).startsWith('29 residues') && await page.isHidden('.rama .ra-err'), 'ramachandran: back to the example');
};
