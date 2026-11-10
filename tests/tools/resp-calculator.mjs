// #1738 RESP and CESG
export const path = '/money/resp-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/resp-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.re [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.re ${c}`)).trim();
  await set('age', '0'); await set('per', '2500'); await set('rate', '5');
  check((await t('.re-s-grant')).includes('7,200'), 'resp: 2,500/yr from birth earns 7,200 CESG');
  check((await t('.re-line')).includes('turns 14'), 'resp: limit reached in the 15th year (14.4 years of grants)');
  check((await t('.re-s-bal')).includes('86,597'), 'resp: balance at 18 = 86,597');
  await set('age', '5'); await set('per', '5000');
  const first = await page.$$eval('.re .re-body tr', (rs) => rs[0].children[2].textContent);
  check(first.includes('1,000'), 'resp: catch-up pays 1,000 a year');
  await set('age', '0'); await set('per', '2500');
  await page.selectOption('.re [data-k="band"]', 'low'); await page.check('.re [data-k="clb"]'); await page.waitForTimeout(80);
  check((await t('.re-s-clb')).includes('2,000'), 'resp: Learning Bond up to 2,000');
  await set('age', '20');
  check(await page.isVisible('.re .re-err'), 'resp: age above 18 shows a message');
};
