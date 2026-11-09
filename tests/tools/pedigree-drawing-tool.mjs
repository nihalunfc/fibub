// #205 pedigree drawing tool
export const path = '/science/pedigree-drawing-tool/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.ped ';
  const issues = () => page.textContent(R + '.pd-issues'), table = () => page.inputValue(R + '.pd-data');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await issues()) === 'No problems found: 15 people in 4 generations.' && await page.isVisible(R + '.pd-fig'), 'pedigree: example drawn with no problems');
  check((await page.inputValue(R + '.pd-sel')) === 'Max' && (await page.textContent(R + '.pd-sel option:checked')) === 'IV-1 Max' && await page.isChecked(R + '.pd-f[data-f=proband]'), 'pedigree: proband selected first, with its number');
  // Tap a symbol to select it (Iris, III-2).
  { await page.locator(R + '.pd-fig').scrollIntoViewIfNeeded();
    const b2 = await page.locator(R + '.pd-fig').boundingBox(), k = b2.width / (await page.evaluate(() => { const c = document.querySelector('.ped .pd-fig'); return c.width / Math.min(3, devicePixelRatio || 1); }));
    // Iris sits at layout x = 1 in row III: centre (46 + 30 + 16 + 72, 30 + 16 + 2 × 130) in drawing pixels.
    await page.mouse.click(b2.x + (46 + 30 + 16 + 72) * k, b2.y + (30 + 16 + 260) * k); }
  check((await page.inputValue(R + '.pd-sel')) === 'Iris' && await page.isChecked(R + '.pd-f[data-f=carrier]'), 'pedigree: tapping a symbol selects that person');
  // Edit flags and sex through the controls.
  await page.check(R + '.pd-f[data-f=deceased]'); await page.waitForTimeout(100);
  check((await table()).split('\n').find((l) => l.startsWith('Iris\t')).split('\t')[6] === 'yes', 'pedigree: deceased box writes to the table');
  await page.uncheck(R + '.pd-f[data-f=deceased]');
  // Add relatives.
  await page.selectOption(R + '.pd-sel', 'Edith'); await page.click(R + '.pd-add[data-add=son]'); await page.waitForTimeout(100);
  check((await table()).includes('Son1\tPartner1\tEdith\tM') && (await page.inputValue(R + '.pd-sel')) === 'Son1' && (await issues()).includes('17 people in 4 generations'), 'pedigree: add son (with a new partner)');
  await page.click(R + '.pd-add[data-add=sister]'); await page.waitForTimeout(100);
  check((await table()).includes('Sister1\tPartner1\tEdith\tF'), 'pedigree: add sister');
  await page.selectOption(R + '.pd-sel', 'George'); await page.click(R + '.pd-add[data-add=parents]'); await page.waitForTimeout(100);
  check((await table()).includes('George\tFather1\tMother1\tM') && (await issues()).includes('in 4 generations'), 'pedigree: add parents');
  await page.selectOption(R + '.pd-sel', 'Colin'); await page.click(R + '.pd-add[data-add=daughter]'); await page.waitForTimeout(100);
  check((await table()).includes('Daughter1\tColin\tFiona\tF'), 'pedigree: add daughter to an existing couple');
  await page.selectOption(R + '.pd-sel', 'Colin'); await page.click(R + '.pd-add[data-add=remove]');
  check((await page.textContent(R + '.pd-aerr')).includes('has children'), 'pedigree: remove refuses a parent');
  await page.selectOption(R + '.pd-sel', 'Daughter1'); await page.click(R + '.pd-add[data-add=remove]'); await page.waitForTimeout(100);
  check(!(await table()).includes('Daughter1'), 'pedigree: remove');
  await page.selectOption(R + '.pd-sel', 'Child'); await page.click(R + '.pd-add[data-add=brother]'); await page.waitForTimeout(100);
  check((await table()).includes('Brother1\tKevin\tIris\tM'), 'pedigree: add brother');
  await page.selectOption(R + '.pd-sel', 'Brother1'); await page.selectOption(R + '.pd-sex', 'F'); await page.waitForTimeout(100);
  check((await table()).includes('Brother1\tKevin\tIris\tF'), 'pedigree: change sex');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pd-svg')]); const f = OUT + 'ped.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(s.startsWith('<?xml') && s.includes('<svg') && s.includes('>IV</text>') && !s.includes('stroke-dasharray="4 3"'), 'pedigree: SVG download, without the selection box'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pd-png')]); const f = OUT + 'ped.png'; await d.saveAs(f); const b = readFileSync(f);
    check(b.subarray(1, 4).toString() === 'PNG' && b.readUInt32BE(16) > 1000, 'pedigree: PNG download at 3× size'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pd-csv')]); const f = OUT + 'ped.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'id,father,mother,sex,affected,carrier,deceased,proband,twin,adopted,note' && rows.length === 22, 'pedigree: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'pedigree.pdf', 'pedigree: PDF report'); }
  // Remember, reload, clear.
  check((await page.evaluate(() => localStorage.getItem('fibub-pedigree-v1'))) === null, 'pedigree: nothing stored without the box');
  await page.check(R + '.pd-remember');
  check((await page.evaluate(() => localStorage.getItem('fibub-pedigree-v1'))).includes('Brother1'), 'pedigree: stored when ticked');
  await page.reload(); await page.waitForTimeout(400);
  check((await table()).includes('Brother1') && await page.isChecked(R + '.pd-remember'), 'pedigree: kept after reload');
  await page.click(R + '.pd-clear');
  check((await page.evaluate(() => localStorage.getItem('fibub-pedigree-v1'))) === null && !(await page.isChecked(R + '.pd-remember')), 'pedigree: clear removes it');
  await page.click(R + '.pd-reset'); await page.waitForTimeout(100);
  check((await issues()).includes('15 people'), 'pedigree: load the example');
  // Errors.
  const ex = await table();
  await page.fill(R + '.pd-data', ex.replace('Arthur\t\t\tM', 'Arthur\tMax\tNora\tM')); await page.waitForTimeout(500);
  check((await issues()).includes('Loop: ') && await page.isHidden(R + '.pd-wrap'), 'pedigree: loop stops the drawing');
  await page.fill(R + '.pd-data', ex.replace('Fiona\t\t\tF', 'Fiona\t\t\tM')); await page.waitForTimeout(500);
  check((await issues()).includes('Sex conflict: Fiona is a mother but is marked male') && await page.isVisible(R + '.pd-wrap'), 'pedigree: sex conflict listed, still drawn');
  await page.fill(R + '.pd-data', ex.replace('Harry\tColin\tFiona', 'Harry\tColin\tZoe')); await page.waitForTimeout(500);
  check((await issues()).includes('Missing parent: Harry\'s mother "Zoe"'), 'pedigree: missing parent');
  // A file opened through the file box (CSV).
  writeFileSync(OUT + 'fam.csv', 'id,father,mother,sex,affected\nDad,,,M,\nMum,,,F,\nAmy,Dad,Mum,F,yes\nBen,Dad,Mum,M,\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'fam.csv'); await page.waitForTimeout(500);
  check((await issues()) === 'No problems found: 4 people in 2 generations.', 'pedigree: CSV file opened');
};
