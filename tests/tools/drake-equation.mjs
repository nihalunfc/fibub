// #353 Drake equation
export const path = '/science/drake-equation/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dke ';
  await page.goto(`${BASE}/science/drake-equation/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.dk-big'), facts = () => page.textContent(R + '.dk-facts');
  check((await big()) === 'Median N = 0.0044; 79.9 % chance of fewer than 1', `drake: example result (${await big()})`);
  { const f = await facts(); check(f.includes('1.6 × 10⁻⁷ to 130') && f.includes('exact: 80 %') && f.includes('2.11 %') && f.includes('exact: −2.349'), 'drake: example facts'); }
  { const t = await page.textContent(R + '.dk-tab'); check(t.includes('fl1 × 10⁻⁶1') && t.includes('42 %') && t.includes('29 %'), 'drake: factor table and share of spread'); }
  check(await page.isVisible(R + '.dk-fig'), 'drake: histogram');
  await page.selectOption(R + '.dk-preset', 'hopeful'); await page.waitForTimeout(500);
  check((await big()).startsWith('Median N = 1,000;') && (await facts()).includes('Middle estimate1,000'), `drake: hopeful preset (${await big()})`);
  await page.selectOption(R + '.dk-preset', 'cautious'); await page.waitForTimeout(500);
  check((await big()).endsWith('over 99.9 % chance of fewer than 1') || (await big()).endsWith('100 % chance of fewer than 1'), `drake: cautious preset (${await big()})`);
  // Fix every factor: N becomes a single number.
  const rows = await page.$$(R + '.dk-row');
  const fixed = [10, 0.5, 2, 0.1, 0.01, 0.1, 10000];
  for (const [i, r] of rows.entries()) { await (await r.$('.dk-lo')).fill(String(fixed[i])); await (await r.$('.dk-hi')).fill(String(fixed[i])); }
  await page.waitForTimeout(500);
  check((await big()) === 'Median N = 10; 0 % chance of fewer than 1' && (await page.inputValue(R + '.dk-preset')) === 'custom', `drake: fixed factors and custom preset (${await big()})`);
  await page.fill(R + '.dk-seed', '5'); await page.fill(R + '.dk-n', '2000'); await page.waitForTimeout(500);
  check((await facts()).includes('10 to 10'), 'drake: draws and seed');
  await page.selectOption(R + '.dk-preset', 'wide'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dk-csv')]); const f = OUT + 'drake.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t[0] === 'factor,low,high,middle,share of spread' && t[1].startsWith('R,1,10,3.16228,') && t.some((r) => r.startsWith('draws,2000')) && t.some((r) => r.startsWith('log10 N from')), 'drake: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); const f = OUT + 'drake.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'drake: Word report'); }
  // Bad input
  const r0 = rows[1];
  await (await r0.$('.dk-hi')).fill('2'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.dk-err')).includes('fp is a fraction') && await page.isHidden(R + '.dk-out'), 'drake: fraction above 1 message');
  await (await r0.$('.dk-hi')).fill('0.1'); await (await r0.$('.dk-lo')).fill('0.5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.dk-err')).includes('high value is below'), 'drake: high below low message');
  await (await r0.$('.dk-lo')).fill('0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.dk-err')).includes('above zero'), 'drake: zero message');
  await (await r0.$('.dk-lo')).fill('0.05'); await page.fill(R + '.dk-n', '10'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.dk-err')).includes('1,000 to 1,000,000'), 'drake: draws message');
  await page.fill(R + '.dk-n', '1000'); await page.waitForTimeout(400);
  check(await page.isHidden(R + '.dk-err') && await page.isVisible(R + '.dk-out'), 'drake: recovers');
};
