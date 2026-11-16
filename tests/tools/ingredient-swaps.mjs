// #T864 Ingredient swaps
export const path = '/everyday/ingredient-swaps/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/ingredient-swaps/`); await page.waitForTimeout(300);
  const R = '.is ';
  const cards = () => page.$$(R + '.is-card');
  const swaps = () => page.$$eval(R + '.is-swap', (els) => els.map((e) => e.textContent));
  check((await cards()).length === 44 && (await swaps()).length === 58, 'ingredient-swaps: full list of 44 ingredients, 58 swaps on load');
  await page.fill(R + '.is-q', 'buttermilk'); await page.waitForTimeout(100);
  check((await cards()).length === 1, 'ingredient-swaps: search "buttermilk" shows 1 result');
  await page.fill(R + '.is-amt', '2'); await page.waitForTimeout(100);
  check((await swaps())[0] === '= 2 cups milk + 2 tbsp lemon juice or white vinegar', `ingredient-swaps: 2 cups doubles the swap (${(await swaps())[0]})`);
  await page.check(R + '.is-filters input[value="v"]'); await page.waitForTimeout(100);
  check((await swaps()).join('|') === '= 2 cups unsweetened soy milk + 2 tbsp lemon juice', `ingredient-swaps: vegan buttermilk (${(await swaps()).join('|')})`);
  await page.fill(R + '.is-q', 'white sugar'); await page.fill(R + '.is-amt', '1'); await page.waitForTimeout(100);
  const s = await swaps();
  check(s.length === 1 && !s[0].includes('honey'), `ingredient-swaps: vegan filter hides the honey swap (${s.join('|')})`);
  // new options: chips, nut-free and soy-free, metric amounts, ml beside units, new items
  await page.click(R + '.is-clear'); await page.click(R + '.is-chips [data-q="Brown sugar"]'); await page.waitForTimeout(100);
  check((await cards()).length === 1 && (await swaps())[0] === '= 1 cup white sugar + 1 tbsp molasses', `ingredient-swaps: chip Brown sugar (${(await swaps())[0]})`);
  await page.fill(R + '.is-q', 'egg white'); await page.waitForTimeout(100);
  check((await swaps()).join('|') === '= 2 tbsp aquafaba (liquid from a can of chickpeas)', `ingredient-swaps: egg white swap (${(await swaps()).join('|')})`);
  await page.fill(R + '.is-q', 'active dry'); await page.fill(R + '.is-amt', '2'); await page.waitForTimeout(100);
  check((await swaps())[0] === '= 1½ tsp instant (fast-action) yeast', `ingredient-swaps: 2 tsp active dry yeast (${(await swaps())[0]})`);
  await page.fill(R + '.is-q', 'milk'); await page.fill(R + '.is-amt', '1'); await page.check(R + '.is-filters input[value="s"]'); await page.waitForTimeout(100);
  check((await swaps()).every((x) => !x.includes('soy')) && (await swaps()).length >= 1, `ingredient-swaps: soy-free hides soy milk swaps (${(await swaps()).join('|')})`);
  await page.uncheck(R + '.is-filters input[value="s"]');
  await page.fill(R + '.is-q', 'allspice'); await page.check(R + '.is-filters input[value="n"]'); await page.waitForTimeout(100);
  check((await cards()).length === 1, 'ingredient-swaps: nutmeg is not counted as a nut');
  await page.fill(R + '.is-q', 'breadcrumbs'); await page.waitForTimeout(100);
  check((await swaps()).length === 1 && (await swaps())[0].includes('rolled oats'), `ingredient-swaps: nut-free breadcrumbs hides almonds (${(await swaps()).join('|')})`);
  await page.uncheck(R + '.is-filters input[value="n"]');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.is-q', 'buttermilk'); await page.selectOption(R + '.is-mode', 'metric'); await page.fill(R + '.is-amt', '480'); await page.check(R + '.is-ml'); await page.waitForTimeout(100);
  check((await swaps())[0] === '= 2 cups milk (480 ml) + 2 tbsp lemon juice or white vinegar (30 ml)', `ingredient-swaps: 480 ml buttermilk with ml beside (${(await swaps())[0]})`);
  await page.fill(R + '.is-amt', '-3'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.is-list')).includes('NaN'), 'ingredient-swaps: negative amount never shows NaN');
};
