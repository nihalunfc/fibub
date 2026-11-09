// #183 stock solution and media recipe scaler
export const path = '/science/media-recipe-scaler/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.mrs ';
  const txt = (s) => page.textContent(R + s);
  const row = (i, c) => `${R}.mr-row:nth-child(${i}) ${c}`;
  await page.goto(`${BASE}/science/media-recipe-scaler/`); await page.waitForTimeout(400);
  check((await txt('.mr-big')) === '500 mL of Example wash buffer', 'recipe: example buffer title');
  { const s = await txt('.mr-steps'); check(s.includes('Weigh 1.211 g of Tris base (10 mmol).') && s.includes('Weigh 203.3 mg of Magnesium chloride hexahydrate (1 mmol).') && s.includes('Dissolve them in about 345.2 mL of water.') && s.includes('Add 15 mL of Sodium chloride stock (5 M).') && s.includes('Add 50 mL of Glycerol (neat liquid).') && s.includes('Make up to 500 mL with water and mix.'), 'recipe: example buffer steps'); }
  { const t = await txt('.mr-tab'); check(t.includes('from 5 M stock, 1 in 33.33') && t.includes('2.5 mL') && t.includes('weigh (121.1 g/mol)') && t.includes('from 0.5 M stock, 1 in 500'), 'recipe: example buffer table'); }
  { const f = await txt('.mr-facts'); check(f.includes('Solids to weigh1.415 g') && f.includes('Liquids to add68.5 mL') && f.includes('Water, about431.5 mL'), 'recipe: totals'); }
  check((await page.textContent(row(1, '.mr-msg'))).includes('121.1 g/mol from the formula') && await page.isHidden(row(1, '.mr-stl')) && await page.isVisible(row(2, '.mr-stl')), 'recipe: formula molar mass hint, stock fields only for stocks');
  // 5× stock.
  await page.fill(R + '.mr-n', '5'); await page.waitForTimeout(100);
  { const s = await txt('.mr-steps'); check((await txt('.mr-big')) === '500 mL of 5× Example wash buffer' && s.includes('Weigh 6.057 g of Tris base') && s.includes('Add 75 mL of Sodium chloride') && s.includes('Add 250 mL of Glycerol') && s.includes('mix 1 part of this 5× stock with 4 parts water (for example 100 mL + 400 mL)') && (await txt('.mr-facts')).includes('342.5 mL') && (await txt('.mr-tab')).includes('Final at 5×'), 'recipe: 5× stock'); }
  await page.fill(R + '.mr-n', '20'); await page.waitForTimeout(100);
  check((await txt('.mr-warn')).includes('Glycerol: At 20× this is 200 % v/v') && (await page.textContent(row(5, '.mr-msg'))).includes('200 % v/v') && (await page.$$(R + '.mr-badrow')).length === 1, 'recipe: 20× glycerol over 100 % flagged');
  await page.fill(R + '.mr-n', '1');
  // Stock too dilute: salt stock 0.1 M.
  await page.fill(row(2, '.mr-c-st'), '0.1'); await page.waitForTimeout(100);
  check((await txt('.mr-warn')).includes('too dilute to reach 150 mM') && (await txt('.mr-warn')).includes('750 mL'), 'recipe: stock too dilute');
  // Stock in g/L for a mM target, through the formula NaCl.
  await page.fill(row(2, '.mr-c-st'), '292.2'); await page.selectOption(row(2, '.mr-c-su'), 'g/L'); await page.waitForTimeout(100);
  check((await txt('.mr-steps')).includes('Add 15 mL of Sodium chloride stock (292.2 g/L).'), 'recipe: g/L stock for a mM target via molar mass');
  await page.fill(row(2, '.mr-c-mw'), ''); await page.waitForTimeout(100);
  check((await page.textContent(row(2, '.mr-msg'))).includes('type the molar mass'), 'recipe: missing molar mass message');
  await page.fill(row(2, '.mr-c-mw'), 'Nq'); await page.waitForTimeout(100);
  check((await page.textContent(row(2, '.mr-msg'))).startsWith('Molar mass:'), 'recipe: bad formula message');
  // Volume units, empty volume, bad strength.
  await page.selectOption(R + '.mr-vu', 'µL'); await page.fill(R + '.mr-v', '100'); await page.waitForTimeout(100);
  check((await txt('.mr-big')).startsWith('100 µL of') && (await txt('.mr-steps')).includes('Weigh 242.3 µg of Tris base'), 'recipe: 100 µL volume');
  await page.fill(R + '.mr-v', ''); await page.waitForTimeout(100);
  check((await txt('.mr-err')).includes('final volume') && await page.isHidden(R + '.mr-out'), 'recipe: empty volume message');
  await page.fill(R + '.mr-v', '1'); await page.selectOption(R + '.mr-vu', 'L'); await page.fill(R + '.mr-n', '0'); await page.waitForTimeout(100);
  check((await txt('.mr-err')).includes('strength above 0'), 'recipe: bad strength message');
  // Broth example and the CSV.
  await page.click(R + '.mr-ex[data-ex=broth]'); await page.waitForTimeout(100);
  { const s = await txt('.mr-steps'); check((await txt('.mr-big')) === '1 L of Simple bacterial broth' && s.includes('Weigh 10 g of Tryptone.') && s.includes('Weigh 10 g of Sodium chloride (171.1 mmol).') && s.includes('Add 10 mL of Glucose stock (20 % w/v).') && s.includes('Add 1 mL of Ampicillin (after cooling) stock (100 mg/mL).') && (await txt('.mr-tab')).includes('1 in 1000'), 'recipe: broth example'); }
  let csvFile;
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mr-csv')]); csvFile = OUT + 'recipe.csv'; await d.saveAs(csvFile); const rows = readFileSync(csvFile, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('component,amount,unit,source,stock,stock_unit,molar_mass') && rows[5].startsWith('Ampicillin (after cooling),100,µg/mL,stock,100,mg/mL,,100,µg/mL,,1,') && d.suggestedFilename() === '1-L-of-Simple-bacterial-broth.csv', 'recipe: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename().endsWith('.pdf'), 'recipe: recipe card PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check(d.suggestedFilename().endsWith('.png'), 'recipe: recipe card image'); }
  // Edit rows: remove, add, neat liquid with a molar unit, X strength.
  await page.locator(row(5, '.mr-del')).scrollIntoViewIfNeeded(); await page.click(row(5, '.mr-del')); await page.waitForTimeout(100);
  check((await page.$$(R + '.mr-row')).length === 4 && !(await txt('.mr-steps')).includes('Ampicillin'), 'recipe: remove a row');
  await page.click(R + '.mr-add'); const n = 5;
  await page.fill(row(n, '.mr-c-name'), '10X buffer'); await page.fill(row(n, '.mr-c-amt'), '1'); await page.selectOption(row(n, '.mr-c-unit'), 'X'); await page.waitForTimeout(100);
  check((await page.textContent(row(n, '.mr-msg'))).includes('only works with a stock'), 'recipe: X needs a stock');
  await page.selectOption(row(n, '.mr-c-src'), 'neat'); await page.waitForTimeout(100);
  check((await page.textContent(row(n, '.mr-msg'))).includes('measured by volume'), 'recipe: neat liquid needs v/v');
  await page.selectOption(row(n, '.mr-c-src'), 'stock'); await page.fill(row(n, '.mr-c-st'), '10'); await page.waitForTimeout(100);
  check((await page.inputValue(row(n, '.mr-c-su'))) === 'X' && (await txt('.mr-steps')).includes('Add 100 mL of 10X buffer stock (10 X).'), 'recipe: 1X from 10X stock');
  // Liquids over the final volume.
  await page.fill(row(n, '.mr-c-st'), '1'); await page.waitForTimeout(100);
  { const w = await txt('.mr-warn'); check(w.includes('add up to 1.01 L, more than the 1 L you are making') && w.includes('exactly the strength you want'), 'recipe: liquids over the volume'); }
  // Open the CSV again.
  await page.setInputFiles(R + '.mr-file', csvFile); await page.waitForTimeout(200);
  check((await page.$$(R + '.mr-row')).length === 5 && (await page.inputValue(R + '.mr-name')) === 'recipe' && (await txt('.mr-steps')).includes('Add 1 mL of Ampicillin'), 'recipe: open a recipe CSV');
  writeFileSync(OUT + 'bad-recipe.csv', 'component,amount,unit\nSalt,5,furlongs\n');
  await page.setInputFiles(R + '.mr-file', OUT + 'bad-recipe.csv'); await page.waitForTimeout(200);
  check((await txt('.mr-ferr')).includes('unknown unit "furlongs"') && (await page.$$(R + '.mr-row')).length === 5, 'recipe: bad CSV message');
  await page.locator(R + '.mr-clear').scrollIntoViewIfNeeded(); await page.click(R + '.mr-clear'); await page.waitForTimeout(100);
  check((await page.$$(R + '.mr-row')).length === 1 && (await page.textContent(row(1, '.mr-msg'))).includes('amount above 0') && await page.isHidden(R + '.mr-ferr'), 'recipe: start empty');
  await page.click(R + '.mr-ex[data-ex=buffer]'); await page.waitForTimeout(100);
  check((await txt('.mr-big')) === '500 mL of Example wash buffer', 'recipe: back to the example');
};
