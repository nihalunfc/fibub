// #651 load combination helper (maths checked against NumPy in tests/sci-tools/load-combination-helper.mjs)
export const path = '/science/load-combination-helper/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.lch ';
  await page.goto(`${BASE}/science/load-combination-helper/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.lc-big')) === '11 cases from 7 combinations, 3 effects', `loadcomb: example (${await page.textContent(R + '.lc-big')})`);
  { const f = await page.textContent(R + '.lc-facts'); check(f.includes('N (kN)+860 / +304') && f.includes('M (kN·m)+190.8 / −101.5') && f.includes('largest from 1.25D + 1.4W + 0.5L (W+)') && f.includes('smallest from 0.9D + 1.4W (W−)') && f.includes('−42.6largest'), `loadcomb: governing facts (${f})`); }
  check((await page.$$(R + '.lc-tab tbody tr')).length === 11 && (await page.$$(R + '.lc-tab td.lc-gov')).length >= 4, 'loadcomb: table with governing cells');
  check(await page.isVisible(R + '.lc-fig') && (await page.inputValue(R + '.lc-eff')) === 'M (kN·m)', 'loadcomb: chart of the moment');
  await page.selectOption(R + '.lc-eff', 'V (kN)'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.lc-fig', 'aria-label')).startsWith('V (kN) for each combination, largest 87.3'), 'loadcomb: chart another effect');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lc-csv')]); const f = OUT + 'lc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 12 && rows[0] === 'combination,signs,N (kN),M (kN·m),V (kN)' && rows[4] === '1.25D + 1.4W + 0.5L,W+,666,190.75,87.3', `loadcomb: CSV (${rows[4]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'load-combinations.pdf', 'loadcomb: PDF report'); }
  await page.selectOption(R + '.lc-preset', 'service'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.lc-big')).startsWith('8 cases from 5 combinations') && (await page.inputValue(R + '.lc-preset')) === '', 'loadcomb: unfactored example set');
  await page.fill(R + '.lc-combos', 'A: 1.5D + 1.5L\nB: D + W + E'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lc-big')) === '5 cases from 2 combinations, 3 effects' && (await page.textContent(R + '.lc-facts')).includes('largest from A'), 'loadcomb: own named combinations, two reversible loads');
  await page.fill(R + '.lc-combos', '1.2D + 1.6Q'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lc-err')).includes('"Q"') && await page.isHidden(R + '.lc-out'), 'loadcomb: unknown load message');
  await page.fill(R + '.lc-combos', '1.2D + 1.6L'); await page.fill(R + '.lc-loads', 'Load, M\nD, 10\nL, x'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lc-err')).includes('not a number'), 'loadcomb: bad load value message');
  writeFileSync(OUT + 'loads.csv', 'Load,Reaction (kN)\nD,100\nL,50\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'loads.csv'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.lc-facts')).includes('Reaction (kN)+200 / +200'), `loadcomb: loads from a file (${await page.textContent(R + '.lc-facts')})`);
};
