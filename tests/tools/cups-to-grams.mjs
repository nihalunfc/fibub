// #T860 Cups to grams
export const path = '/everyday/cups-to-grams/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/cups-to-grams/`); await page.waitForTimeout(300);
  const R = '.ctg ';
  const big = () => page.textContent(R + '.ctg-big');
  const sel = async (s, v) => { await page.selectOption(R + s, v); await page.waitForTimeout(100); };
  check((await big()) === '125 g', `cups-to-grams: 1 US cup flour = 125 g (${await big()})`);
  await sel('.ctg-ing', 'sugar'); check((await big()) === '200 g', `cups-to-grams: 1 cup sugar = 200 g (${await big()})`);
  await sel('.ctg-ing', 'water'); check((await big()) === '237 g', `cups-to-grams: 1 cup water = 237 g (${await big()})`);
  await sel('.ctg-ing', 'butter'); await page.click(R + '.ctg-swap'); await page.fill(R + '.ctg-amt', '100'); await page.waitForTimeout(100);
  check((await big()) === '0.44 US cup', `cups-to-grams: 100 g butter = 0.44 cup (${await big()})`);
  check((await page.textContent(R + '.ctg-all [data-u="tbsp"]')) === '7.05 tbsp', 'cups-to-grams: list shows 7.05 tbsp');
  await page.click(R + '.ctg-reset'); await page.waitForTimeout(100); check((await big()) === '125 g', 'cups-to-grams: reset');
  // new options: fractions, slider, find box, messages, common measures
  await page.fill(R + '.ctg-amt', '3/4'); await page.waitForTimeout(100);
  check((await big()) === '94 g', `cups-to-grams: 3/4 cup flour = 94 g (${await big()})`);
  await page.fill(R + '.ctg-amt', '1 1/2'); await page.waitForTimeout(100);
  check(/^18[78] g$/.test(await big()), `cups-to-grams: "1 1/2" reads as 1.5 (${await big()})`);
  await page.evaluate(() => { const r = document.querySelector('.ctg .ctg-range'); r.value = '2'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await big()) === '250 g' && (await page.inputValue(R + '.ctg-amt')) === '2', `cups-to-grams: slider 2 cups = 250 g (${await big()})`);
  await page.fill(R + '.ctg-amt', '-1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ctg-say')).includes('below zero') && !(await page.textContent(R + '.ctg-say')).includes('NaN'), 'cups-to-grams: negative gives a friendly message');
  await page.fill(R + '.ctg-amt', 'abc'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ctg-say')).includes('could not read'), 'cups-to-grams: text gives a friendly message');
  await page.fill(R + '.ctg-amt', '1'); await page.fill(R + '.ctg-find', 'honey'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ctg-ing')) === 'honey' && (await big()) === '339 g', `cups-to-grams: find "honey" picks honey (${await big()})`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.click(R + '.ctg-reset'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ctg-tab tbody tr')).length === 8 && (await page.textContent(R + '.ctg-tab tbody tr')).includes('31 g'), 'cups-to-grams: common measures table, 1/4 cup flour = 31 g');
  await page.selectOption(R + '.ctg-cup', 'metcup'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ctg-tab tbody tr')).includes('33 g'), 'cups-to-grams: 1/4 metric cup flour = 33 g');
};
