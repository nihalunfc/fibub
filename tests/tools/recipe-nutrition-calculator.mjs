// #391 recipe nutrition calculator
export const path = '/science/recipe-nutrition-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.rnut ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check(await page.isHidden(R + '.rn-out'), 'nutrition: nothing shown before input');
  await page.click(R + '.rn-ex'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.rn-big')) === '251 kcal per serving (323 g)', 'nutrition: example per serving');
  { const t = await page.textContent(R + '.rn-label'); check(t.includes('325 kJ / 78 kcal') && t.includes('1,049 kJ / 251 kcal') && t.includes('6.4 g') && t.includes('31.9 g') && t.includes('13.1 g') && t.includes('2.07 g'), 'nutrition: label table values'); }
  check((await page.textContent(R + '.rn-facts')).includes('1520 g') && (await page.textContent(R + '.rn-facts')).includes('1292 g'), 'nutrition: raw and cooked weight');
  check((await page.textContent(R + '.rn-ing')).includes('65.8 %') && await page.isVisible(R + '.rn-fig'), 'nutrition: energy shares and figure');
  await page.selectOption(R + '.rn-en', 'macros'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rn-big')).startsWith('252 kcal') && (await page.textContent(R + '.rn-note')).includes('4/9/4/2'), 'nutrition: energy from Atwater factors');
  await page.check(R + '.rn-cf'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rn-big')).startsWith('224 kcal') && (await page.textContent(R + '.rn-label')).includes('24.9 g'), 'nutrition: carbohydrate includes fibre');
  await page.uncheck(R + '.rn-cf'); await page.selectOption(R + '.rn-en', 'label');
  await page.fill(R + '.rn-cooked', '1000'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-big')) === '251 kcal per serving (250 g)' && (await page.textContent(R + '.rn-label')).includes('100 kcal'), 'nutrition: weighed cooked weight wins');
  await page.fill(R + '.rn-cooked', ''); await page.fill(R + '.rn-serv', '2'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-big')) === '501 kcal per serving (646 g)', 'nutrition: two servings');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rn-csv')]); const f = OUT + 'nut.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('nutrient,unit,per_100g') && t.includes('Energy,kcal,78,501,1003') && t.includes('Red lentils (dry),200,660.000') && t.includes('cooked_weight_g,1292.0'), 'nutrition: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'recipe-nutrition.pdf', 'nutrition: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()) === 'recipe-nutrition.png', 'nutrition: PNG download'); }
  await page.fill(R + '.rn-in', 'Food, Amount (g), Energy (kJ), Sodium, Protein\nCheese, 50, 1600, 0.6, 25\nBread, 100, 1000, 0.4, 9'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-label')).includes('1.37 g') && (await page.textContent(R + '.rn-label')).includes('0.88 g') && (await page.textContent(R + '.rn-note')).includes('No value given (counted as 0): Fat: Cheese, Bread; saturates'), 'nutrition: kJ and sodium columns, missing values listed');
  await page.fill(R + '.rn-in', 'Ingredient, Amount (g), Fat, Saturates\nX, 10, 5, 6'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-err')).includes('saturates (6) are more than fat'), 'nutrition: saturates above fat flagged');
  await page.fill(R + '.rn-in', 'Ingredient, Amount (g), Fat\nX, , 5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-err')).includes('give the amount in grams') && await page.isHidden(R + '.rn-out'), 'nutrition: missing amount message');
  await page.fill(R + '.rn-in', 'A, 100, 50'); await page.fill(R + '.rn-loss', '100'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-err')).includes('0 to 99'), 'nutrition: loss of 100 % refused');
  await page.fill(R + '.rn-loss', '0');
  writeFileSync(OUT + 'nut-in.csv', 'Ingredient,Amount (g),Energy (kcal),Protein\nRice,100,350,7\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'nut-in.csv'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.rn-big')).startsWith('175 kcal per serving (50 g)'), 'nutrition: open a CSV file');
  await page.click(R + '.rn-ex'); const vp0 = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.screenshot({ path: OUT + 'nutrition-375.png', fullPage: true }); await page.setViewportSize(vp0);
};
