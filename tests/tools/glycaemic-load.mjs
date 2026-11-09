// #486 glycaemic load
export const path = '/science/glycaemic-load/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/glycaemic-load/`); await page.waitForTimeout(500);
  const R = '.gld ', txt = (c) => page.textContent(R + c);
  check((await txt('.gld-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'GL: medical note shown');
  check((await txt('.gld-big')) === 'Meal GL 32 · GI 50 · 64 g carbohydrate', `GL: example meal (${await txt('.gld-big')})`);
  check((await txt('.gld-pills')).includes('GL high') && (await txt('.gld-pills')).includes('GI low'), 'GL: bands');
  { const lines = await page.$$eval(R + '.gld-line', (e) => e.map((x) => x.textContent)); check(lines[0] === 'Available carbohydrate 30 g · GL 16.5 (medium)' && lines[1].includes('GL 12 (medium)') && lines[2].includes('GL 3.5 (low)'), 'GL: each food'); }
  check((await txt('.gld-tab')).includes('52 %') && (await txt('.gld-tab')).includes('100 %'), 'GL: share of GL');
  await page.check(R + '.gld-sub'); await page.waitForTimeout(100);
  check((await txt('.gld-big')) === 'Meal GL 28.4 · GI 49.7 · 57.3 g carbohydrate', 'GL: subtract fibre');
  await page.uncheck(R + '.gld-sub');
  await page.locator(R + '.gld-add').scrollIntoViewIfNeeded(); await page.click(R + '.gld-add'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gld-err') && (await txt('.gld-err')).includes('1 food is left out') && (await txt('.gld-big')).startsWith('Meal GL 32 '), 'GL: empty new food left out');
  const last = R + '.gld-food:last-child ';
  await page.fill(last + '.gld-name', 'Toast'); await page.fill(last + '.gld-gi', '70'); await page.fill(last + '.gld-c', '45'); await page.fill(last + '.gld-p', '40'); await page.waitForTimeout(100);
  check((await txt('.gld-big')) === 'Meal GL 44.6 · GI 54.4 · 82 g carbohydrate' && await page.isHidden(R + '.gld-err'), `GL: added food (${await txt('.gld-big')})`);
  await page.fill(last + '.gld-gi', '150'); await page.waitForTimeout(100);
  check((await page.textContent(last + '.gld-line')).includes('GI should be between'), 'GL: bad GI message');
  await page.locator(last + '.gld-del').scrollIntoViewIfNeeded(); await page.click(last + '.gld-del'); await page.waitForTimeout(100);
  check((await txt('.gld-big')).startsWith('Meal GL 32 ') && (await page.$$(R + '.gld-food')).length === 3, 'GL: remove a food');
  await page.locator(R + '.gld-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gld-csv')]); const f = OUT + 'gl.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 5 && t[0].startsWith('food,GI') && t[1] === 'Porridge, cooked,55,12,1.5,250,30,16.5'.replace('Porridge, cooked', '"Porridge, cooked"') && t[4] === 'Meal,50,,,,64,32', `GL: CSV (${t[1]} | ${t[4]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="png"]')]); const f = OUT + 'gl.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'GL: PNG report'); }
  await page.locator(R + '.gld-clear').scrollIntoViewIfNeeded(); await page.click(R + '.gld-clear'); await page.waitForTimeout(100);
  check((await txt('.gld-big')) === 'Add a food to begin.', 'GL: start empty');
  await page.click(R + '.gld-reset'); await page.waitForTimeout(100);
  check((await txt('.gld-big')).startsWith('Meal GL 32 '), 'GL: back to the example');
};
