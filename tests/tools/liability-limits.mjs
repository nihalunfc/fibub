// #T885 Car liability limits explained (25/50/25)
export const path = '/money/liability-limits/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/liability-limits/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ll [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.ll ${c}`);
  await page.selectOption('.ll [data-k="cur"]', 'USD');
  await set('pp', '25000'); await set('pa', '50000'); await set('prop', '25000'); await set('pd', '10000');
  await page.fill('.ll .ll-person:nth-child(1) .ll-cost', '30000'); await page.fill('.ll .ll-person:nth-child(2) .ll-cost', '15000');
  await page.waitForTimeout(150);
  check((await txt('.ll-s-inj')).includes('40,000'), 'liability-limits: injuries paid 40,000 (' + (await txt('.ll-s-inj')) + ')');
  check((await txt('.ll-s-prop')).includes('10,000'), 'liability-limits: property paid 10,000');
  check((await txt('.ll-s-you')).includes('5,000'), 'liability-limits: you owe 5,000 (' + (await txt('.ll-s-you')) + ')');
  await set('pa', '30000'); await page.waitForTimeout(100);
  check((await txt('.ll-s-inj')).includes('30,000'), 'liability-limits: per-accident cap holds injuries to 30,000');
  await page.selectOption('.ll [data-k="mode"]', 'single'); await set('csl', '30000'); await page.waitForTimeout(100);
  check((await txt('.ll-s-tot')).includes('30,000') && (await txt('.ll-s-you')).includes('25,000'), 'liability-limits: single limit 30,000 leaves 25,000');
  await page.click('.ll .ll-add'); await page.waitForTimeout(100);
  check((await page.$$('.ll .ll-person')).length === 3, 'liability-limits: add a person');
  await page.click('.ll .ll-person:nth-child(3) .ll-rm'); await page.waitForTimeout(100);
  check((await page.$$('.ll .ll-person')).length === 2, 'liability-limits: remove a person');
  await set('nw', '200000'); await page.waitForTimeout(100);
  check(await page.isVisible('.ll .ll-nw'), 'liability-limits: net worth line shows');
};
