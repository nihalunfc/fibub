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
  await set('age', '0'); await set('per', '2500'); await page.selectOption('.re [data-k="band"]', 'high'); await page.waitForTimeout(80);
  check((await t('.re-full')).includes('enough to collect the most grant'), 'resp: 2,500 a year is enough for the full grant from birth');
  await set('per', '1000');
  check((await t('.re-full')).includes('about $2,000 a year') && (await t('.re-full')).includes('$167 a month'), `resp: 1,000 a year is short, full grant needs about 2,000 (${await t('.re-full')})`);
  check((await page.$$('.re .re-svg rect')).length === 54, 'resp: stacked bars, 3 per year for 18 years');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); await page.waitForTimeout(80);
  await set('infl', '2'); await set('per', '2500');
  check((await t('.re-real')).includes("today's dollars") && (await page.isVisible('.re .re-real')), 'resp: today\'s dollars line shows');
};
