// #T864 Ingredient swaps
export const path = '/everyday/ingredient-swaps/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/ingredient-swaps/`); await page.waitForTimeout(300);
  const R = '.is ';
  const cards = () => page.$$(R + '.is-card');
  const swaps = () => page.$$eval(R + '.is-swap', (els) => els.map((e) => e.textContent));
  check((await cards()).length === 40 && (await swaps()).length === 54, 'ingredient-swaps: full list of 40 ingredients, 54 swaps on load');
  await page.fill(R + '.is-q', 'buttermilk'); await page.waitForTimeout(100);
  check((await cards()).length === 1, 'ingredient-swaps: search "buttermilk" shows 1 result');
  await page.fill(R + '.is-amt', '2'); await page.waitForTimeout(100);
  check((await swaps())[0] === '= 2 cups milk + 2 tbsp lemon juice or white vinegar', `ingredient-swaps: 2 cups doubles the swap (${(await swaps())[0]})`);
  await page.check(R + '.is-filters input[value="v"]'); await page.waitForTimeout(100);
  check((await swaps()).join('|') === '= 2 cups unsweetened soy milk + 2 tbsp lemon juice', `ingredient-swaps: vegan buttermilk (${(await swaps()).join('|')})`);
  await page.fill(R + '.is-q', 'white sugar'); await page.fill(R + '.is-amt', '1'); await page.waitForTimeout(100);
  const s = await swaps();
  check(s.length === 1 && !s[0].includes('honey'), `ingredient-swaps: vegan filter hides the honey swap (${s.join('|')})`);
};
