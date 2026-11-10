// #T863 Recipe scaler
export const path = '/everyday/recipe-scaler/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/recipe-scaler/`); await page.waitForTimeout(300);
  const R = '.rs ';
  const lines = () => page.$$eval(R + '.rs-out .rs-line', (els) => els.map((e) => e.textContent));
  check((await page.textContent(R + '.rs-big')) === 'Scaled × 1.5' && (await lines()).length === 9, 'recipe-scaler: example scaled 4 -> 6');
  await page.fill(R + '.rs-in', '2 1/2 cups flour\n3 eggs\n200 g sugar'); await page.waitForTimeout(100);
  check((await lines())[2] === '300 g sugar', `recipe-scaler: 200 g sugar 4->6 = 300 g (${(await lines())[2]})`);
  await page.check(R + '[name="rs-m"][value="fac"]'); await page.fill(R + '.rs-fac', '2'); await page.waitForTimeout(100);
  check((await lines())[0] === '5 cups flour', `recipe-scaler: 2 1/2 cups x2 = 5 cups (${(await lines())[0]})`);
  await page.fill(R + '.rs-fac', '0.5'); await page.waitForTimeout(100);
  check((await lines())[1] === '1½ eggs (beat 2 and use about 75 g; a large egg is about 50 g)', `recipe-scaler: 3 eggs x0.5 (${(await lines())[1]})`);
  await page.fill(R + '.rs-fac', '2'); await page.check(R + '.rs-metric'); await page.waitForTimeout(100);
  check((await lines())[0] === '625 g flour', `recipe-scaler: metric 5 cups flour = 625 g (${(await lines())[0]})`);
};
