// #485 nutrient planner
export const path = '/science/nutrient-planner/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/nutrient-planner/`); await page.waitForTimeout(500);
  const R = '.np ', txt = (c) => page.textContent(R + c);
  const row = async (k) => (await page.textContent(`${R}.np-tab tr[data-k="${k}"] .np-t`)).trim();
  const pct = async (k) => (await page.textContent(`${R}.np-tab tr[data-k="${k}"] .np-p`)).trim();
  const click = async (c) => { await page.locator(R + c).scrollIntoViewIfNeeded(); await page.click(R + c); await page.waitForTimeout(100); };
  check((await txt('.np-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'nutrients: medical note shown');
  check(await page.evaluate(() => { try { return localStorage.getItem('fibub-nutrient-planner-v1'); } catch { return 'x'; } }) === null && !(await page.isChecked(R + '.np-remember')), 'nutrients: nothing stored by default');
  check((await txt('.np-big')) === '1,340 kcal from 6 foods', `nutrients: example day (${await txt('.np-big')})`);
  check((await row('protein')) === '48.5' && (await row('fat')) === '39' && (await row('carbs')) === '190' && (await row('fibre')) === '22.3' && (await row('sugars')) === '39.5' && (await row('sodium')) === '1,795' && (await txt('.np-salt')).trim() === '4.5', 'nutrients: day totals');
  check((await txt('.np-split')) === 'Protein 15 % · Fat 27 % · Carbohydrate 58 %' && (await txt('.np-check')).includes('1,305 kcal') && (await txt('.np-check')).includes('2.6 % more'), `nutrients: energy split (${await txt('.np-check')})`);
  { const t = await txt('.np-meals'); check(t.includes('Breakfast285') && t.includes('Dinner560') && t.includes('Snacks75'), 'nutrients: by meal'); }
  await page.fill(R + '.np-target[data-k="energy"]', '2000'); await page.fill(R + '.np-target[data-k="sodium"]', '1500'); await page.waitForTimeout(100);
  check((await pct('energy')) === '67 %' && (await pct('sodium')) === '120 %' && (await pct('fat')) === '–', 'nutrients: percent of my targets');
  await page.check(R + '.np-fib'); await page.waitForTimeout(100);
  check((await txt('.np-split')).endsWith('Fibre 3 %') && (await txt('.np-check')).includes('1,349 kcal'), 'nutrients: fibre at 2 kcal/g');
  await page.uncheck(R + '.np-fib');
  // A food: per serving, then a bad value.
  const first = R + '.np-food:first-child ';
  await page.selectOption(first + '.np-basis', 'serving'); await page.fill(first + '.np-amt', '2'); await page.waitForTimeout(100);
  check((await page.textContent(first + '.np-amt-l')) === 'Servings eaten' && (await page.textContent(first + '.np-line')).startsWith('Eaten: 740 kcal') && (await txt('.np-big')) === '1,895 kcal from 6 foods', 'nutrients: per serving');
  await page.selectOption(first + '.np-basis', '100g'); await page.fill(first + '.np-amt', '50');
  await page.fill(first + '.np-n[data-k="fat"]', 'lots'); await page.waitForTimeout(100);
  check((await page.textContent(first + '.np-line')) === 'A value is not a number.' && (await txt('.np-err')).includes('1 food is left out') && (await txt('.np-big')) === '1,155 kcal from 5 foods', 'nutrients: bad value left out');
  await page.fill(first + '.np-n[data-k="fat"]', '7'); await page.fill(first + '.np-amt', ''); await page.waitForTimeout(100);
  check((await page.textContent(first + '.np-line')) === 'Type the grams eaten.', 'nutrients: missing amount message');
  await page.fill(first + '.np-amt', '50'); await page.waitForTimeout(100);
  // kJ labels.
  await page.selectOption(R + '.np-unit', 'kJ'); await page.waitForTimeout(100);
  check((await txt('.np-big')) === '1,340 kJ (320 kcal) from 6 foods' && (await page.textContent(`${R}.np-tab tr[data-k="energy"] .np-u`)) === 'kJ', 'nutrients: kJ labels');
  await page.selectOption(R + '.np-unit', 'kcal'); await page.waitForTimeout(100);
  // Foods CSV out and back in.
  let csvPath = OUT + 'foods.csv';
  { const [d] = await Promise.all([page.waitForEvent('download'), click('.np-fcsv')]); await d.saveAs(csvPath); const t = readFileSync(csvPath, 'utf8').trim().split('\n'); check(t.length === 7 && t[0].startsWith('meal,food,basis,amount,energy_kcal') && t[4].startsWith('Dinner,"Rice, cooked",per 100 g,200,130'), 'nutrients: foods CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), click('.np-tcsv')]); const f = OUT + 'tot.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('Energy,kcal,1340,2000,67') && t.includes('Salt equivalent,g,4.49'), 'nutrients: totals CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), click('.dl button[data-f="pdf"]')]); const f = OUT + 'np.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'nutrients: PDF report'); }
  await click('.np-empty');
  check((await txt('.np-big')) === 'Add a food to begin.', 'nutrients: start empty');
  await page.setInputFiles(R + '.np-file', csvPath); await page.waitForTimeout(400);
  check((await txt('.np-big')) === '1,340 kcal from 6 foods' && (await txt('.np-opened')).includes('6 foods'), 'nutrients: open the CSV again');
  writeFileSync(OUT + 'other.csv', 'Food,Grams,kJ,Protein,Fat,Carbs\nToast,40,1100,9,3,48\n');
  await page.setInputFiles(R + '.np-file', OUT + 'other.csv'); await page.waitForTimeout(400);
  check((await txt('.np-big')) === '440 kJ (105 kcal) from 1 food' && (await page.inputValue(R + '.np-unit')) === 'kJ', 'nutrients: open another CSV layout');
  writeFileSync(OUT + 'bad.csv', 'x,y\n1,2\n');
  await page.setInputFiles(R + '.np-file', OUT + 'bad.csv'); await page.waitForTimeout(400);
  check(await page.isVisible(R + '.np-ferr') && (await txt('.np-ferr')).includes('"food" and an "amount"'), 'nutrients: bad CSV message');
  // Remember, reload, clear.
  await click('.np-reset'); await page.selectOption(R + '.np-unit', 'kcal');
  await click('.np-add'); await page.fill(R + '.np-food:last-child .np-name', 'Yoghurt'); await page.fill(R + '.np-food:last-child .np-amt', '100'); await page.fill(R + '.np-food:last-child .np-n[data-k="energy"]', '60'); await page.waitForTimeout(100);
  await page.locator(R + '.np-remember').scrollIntoViewIfNeeded(); await page.check(R + '.np-remember'); await page.waitForTimeout(100);
  await page.reload(); await page.waitForTimeout(600);
  check(await page.isChecked(R + '.np-remember') && (await txt('.np-big')) === '1,400 kcal from 7 foods' && (await page.inputValue(R + '.np-target[data-k="energy"]')) === '2000', 'nutrients: remembered after reload');
  await click('.np-forget');
  check(!(await page.isChecked(R + '.np-remember')) && (await txt('.np-memo')).includes('Cleared') && await page.evaluate(() => localStorage.getItem('fibub-nutrient-planner-v1')) === null, 'nutrients: clear');
  await page.reload(); await page.waitForTimeout(600);
  check((await txt('.np-big')) === '1,340 kcal from 6 foods', 'nutrients: example again after clear');
};
