// #410 Dendrochronology cross-dating helper
export const path = '/science/dendro-crossdating/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  const P = '.dcr ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await page.textContent(P + '.dc-big')) === 'Best match: last ring in 1770 (1691 to 1770), t (Baillie-Pilcher) 9.06, t (Hollstein) 7.89, GLK 69.6 % ***', 'dendro: example best match');
  check((await page.textContent(P + '.dc-minfo')).startsWith('Read as Tucson: 4 series, 1601 to 1800 (200 years)') && (await page.textContent(P + '.dc-sinfo')).startsWith('Sample: 80 rings.'), 'dendro: master and sample read');
  { const n = await page.textContent(P + '.dc-note'); check(n.includes('221 positions') && n.includes('next best t-value is 3.08 (last ring 1687)'), 'dendro: positions and next best'); }
  check((await page.$$(P + '.dc-tab tr')).length === 11 && (await page.textContent(P + '.dc-tab tr:nth-child(2)')).includes('17701691809.067.8969.6***0.725'), 'dendro: best matches table');
  check(await page.isVisible(P + '.dc-tfig') && await page.isVisible(P + '.dc-ofig'), 'dendro: both figures');
  await page.locator(P + '.dc-tab tr:nth-child(3)').scrollIntoViewIfNeeded(); await page.click(P + '.dc-tab tr:nth-child(3)'); await page.waitForTimeout(150);
  check((await page.locator(P + '.dc-ofig').getAttribute('aria-label')).includes('last ring in 1687'), 'dendro: tap a row to see that position');
  for (const v of ['ho', 'raw']) { await page.selectOption(P + '.dc-plot', v); await page.waitForTimeout(100); }
  check((await page.locator(P + '.dc-ofig').getAttribute('aria-label')).includes('Master and sample'), 'dendro: plot options');
  await page.selectOption(P + '.dc-rank', 'tH'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.dc-note')).includes('next best t-value is 3.63 (last ring 1662)'), 'dendro: rank by Hollstein');
  await page.selectOption(P + '.dc-rank', 'glk'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.dc-big')).includes('1770') && (await page.textContent(P + '.dc-note')).includes('next best GLK'), 'dendro: rank by GLK');
  await page.selectOption(P + '.dc-rank', 'tBP');
  await page.fill(P + '.dc-min', '60'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.dc-note')).includes('at least 60 rings'), 'dendro: shortest overlap');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dc-csv')]); const f = OUT + 'dc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'last_ring,first_ring,overlap,r_bp,t_bp,n_bp,r_hollstein,t_hollstein,n_hollstein,glk,glk_n,glk_z,glk_p' && r.some((l) => l.startsWith('1770,1691,80,0.72536597,9.0647377,76,')), 'dendro: positions CSV'); }
  await page.fill(P + '.dc-min', '30');
  // A dated sample in a year table: present dating is reported.
  const lines = (await page.inputValue(P + '.dc-s')).trim().split('\n');
  await page.fill(P + '.dc-s', 'year,X1,X2\n' + lines.map((w, i) => `${1700 + i},${w},${(+w * 1.1).toFixed(2)}`).join('\n')); await page.waitForTimeout(600);
  check(await page.isVisible(P + '.dc-pick') && (await page.textContent(P + '.dc-sinfo')).includes('now dated 1700 to 1779') && (await page.textContent(P + '.dc-note')).includes("present dating (last ring 1779)"), 'dendro: dated sample table with two series');
  await page.selectOption(P + '.dc-pick', '1'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.dc-sinfo')).startsWith('X2') && (await page.textContent(P + '.dc-big')).includes('1770'), 'dendro: choose the series to date');
  // Bad input.
  await page.fill(P + '.dc-s', '1.2\n0.8\nabc\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.dc-err')).includes('is not a ring width') && await page.isHidden(P + '.dc-out'), 'dendro: bad width message');
  await page.fill(P + '.dc-s', '1.2\n0.8\n1.1\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.dc-err')).includes('fewer than the shortest overlap'), 'dendro: too short message');
  await page.fill(P + '.dc-m', '1.2\n0.8\n1.1\n'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.dc-err')).includes('A master needs dates'), 'dendro: undated master message');
  // Open files.
  writeFileSync(OUT + 'm.rwl', (await page.evaluate(() => 0), readFileSync(new URL('../../src/lib/sci/dendro.ts', import.meta.url), 'utf8').split('EXAMPLE_MASTER = `')[1].split('`')[0]));
  writeFileSync(OUT + 's.txt', lines.join('\n'));
  await page.setInputFiles(P + '.dc-mfile', OUT + 'm.rwl'); await page.waitForTimeout(300);
  await page.setInputFiles(P + '.dc-sfile', OUT + 's.txt'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.dc-big')).includes('last ring in 1770'), 'dendro: open master and sample files');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=docx]')]); const f = OUT + 'dc.docx'; await d.saveAs(f); check(readFileSync(f).slice(0, 2).toString() === 'PK', 'dendro: Word report'); }
};
