// #339 CPUE trend
export const path = '/science/cpue-trend/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cpu ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await t('.cp-big')) === 'Standardised CPUE fell 5.4 % a year, 2015 to 2024', 'CPUE: example trend');
  { const f = await t('.cp-facts'); check(f.includes('−8.0 % to −2.8 %') && f.includes('−40.9 % standardised, −37.3 % nominal') && f.includes('115 records, 13 terms') && f.includes('0.338') && f.includes('5 left out') && f.includes('vessel = Alpha, area = South'), 'CPUE: example facts'); }
  { const tb = await t('.cp-tab'); check(tb.includes('2.229') && tb.includes('2.962') && tb.includes('2.356') && tb.includes('3.724'), 'CPUE: year table (nominal, index, interval)'); }
  { const e = await t('.cp-eff'); check(e.includes('Bravo') && e.includes('1.43') && e.includes('0.732') && e.includes('0.724') && e.includes('1 (reference)'), 'CPUE: factor effects'); }
  check(await page.isVisible(R + '.cp-fig'), 'CPUE: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cp-csv')]); const f = OUT + 'cpue.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const r1 = rows[1].split(','); check(rows.length === 11 && rows[0].startsWith('year,records,positive_records') && r1[0] === '2015' && Math.abs(+r1[5] - 2.22886) < 1e-4 && Math.abs(+r1[6] - 2.9618) < 1e-4, 'CPUE: index CSV'); }
  await page.selectOption(R + '.cp-z', 'add'); await page.waitForTimeout(400);
  check((await t('.cp-big')) === 'Standardised CPUE fell 4.1 % a year, 2015 to 2024' && (await t('.cp-facts')).includes('120 records'), 'CPUE: zeros kept with a constant');
  await page.selectOption(R + '.cp-z', 'drop');
  await page.locator(R + '.cp-ck input[data-j="1"]').scrollIntoViewIfNeeded(); await page.click(R + '.cp-ck input[data-j="1"]'); await page.waitForTimeout(400);
  check((await t('.cp-facts')).includes('ln(CPUE) = year + vessel') && !(await t('.cp-facts')).includes('+ area') && (await t('.cp-facts')).includes('12 terms'), 'CPUE: untick a factor');
  await fill('.cp-data', 'year,catch,effort\n2020,10,2\n2020,12,2\n2021,8,2\n2021,9,2\n2022,6,2\n2022,7,2');
  check(await page.isHidden(R + '.cp-fs') && (await t('.cp-big')).startsWith('Standardised CPUE fell') && (await t('.cp-facts')).includes('ln(CPUE) = year'), 'CPUE: no factors');
  await fill('.cp-data', 'year,catch,effort,vessel\n2020,10,2,A\n2020,12,2,A\n2021,8,2,B\n2021,9,2,B');
  check((await t('.cp-err')).includes('confounded') && await page.isHidden(R + '.cp-out'), 'CPUE: confounded factor message');
  await fill('.cp-data', 'year,catch,effort\n2020,10,0'); check((await t('.cp-err')).includes('effort (above 0)'), 'CPUE: bad effort message');
  await fill('.cp-data', 'year,catch,effort\n2020,10,2\n2020,0,2\n2021,0,2'); check((await t('.cp-err')).includes('2021 has no records'), 'CPUE: year with only zero catches');
  await fill('.cp-data', 'year,catch,effort\n2020,10,2\n2020,12,2\n2021,8,2\n2021,9,3\n2022,6,2\n2022,7,2');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `cpue-index.${f}`, `CPUE: ${f} download`); }
};
