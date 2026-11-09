// #650 rebar quantity and weight (maths checked against Python in tests/sci-tools/rebar-calculator.mjs)
export const path = '/science/rebar-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rbc ';
  await page.goto(`${BASE}/science/rebar-calculator/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.rb-big')) === '494.8 kg of steel, 641.1 m of bar', `rebar: example total (${await page.textContent(R + '.rb-big')})`);
  { const f = await page.textContent(R + '.rb-facts'); check(f.includes('62 bars, 325.9 kg') && f.includes('62 bars, 169 kg') && f.includes('Stock bars to order62') && f.includes('offcuts 102.9 m') && f.includes('18.3 kg/m²') && f.includes('754 / 392.7 mm²/m'), `rebar: facts (${f})`); }
  { const t = await page.textContent(R + '.rb-tab'); check(t.includes('5920') && t.includes('4420') && t.includes('367'), `rebar: cut list (${t})`); }
  check((await page.textContent(R + '.rb-mtab')).includes('0.888') && (await page.textContent(R + '.rb-mtab')).includes('6.313'), 'rebar: mass per metre table');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rb-csv')]); const f = OUT + 'rebar.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[1] === '1,12,Along length,5920,62,367.04,325.863', `rebar: CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'rebar-quantities.png', 'rebar: image report'); }
  // A long wall with laps.
  await page.selectOption(R + '.rb-type', 'wall'); await page.fill(R + '.rb-L', '30'); await page.fill(R + '.rb-W', '3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rb-wl')) === 'Height (m)' && (await page.textContent(R + '.rb-facts')).includes('with 2 laps'), 'rebar: wall with laps');
  { const t = await page.textContent(R + '.rb-tab'); check(t.includes('1a') && t.includes('12000') && t.includes('1b') && t.includes('7120'), `rebar: lapped pieces in the cut list (${t})`); }
  await page.selectOption(R + '.rb-type', 'footing'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.rb-lay')) === '1', 'rebar: footing starts with one mat');
  await page.fill(R + '.rb-waste', '5'); await page.fill(R + '.rb-n', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rb-facts')).includes('Waste allowance5 %'), 'rebar: waste and copies');
  await page.fill(R + '.rb-lap', '12000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rb-err')).includes('lap is as long as the stock bar'), 'rebar: impossible lap explained');
  await page.fill(R + '.rb-lap', '600'); await page.fill(R + '.rb-sa', '5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rb-err')).includes('smaller than the bar'), 'rebar: spacing below bar size');
  await page.fill(R + '.rb-sa', '150'); await page.fill(R + '.rb-c', '2000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rb-err')).includes('cover'), 'rebar: cover too big');
  await page.fill(R + '.rb-c', '40'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.rb-out') && await page.isVisible(R + '.rb-fig'), 'rebar: recovers with plan drawing');
};
