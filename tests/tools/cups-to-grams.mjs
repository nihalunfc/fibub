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
};
