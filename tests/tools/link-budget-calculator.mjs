// #59 Link budget calculator (the first checks also live in tests/run.mjs)
export const path = '/science/link-budget-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.lb ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.lb-big'), facts = () => page.textContent(R + '.lb-facts');
  check((await big()) === 'Margin +1.60 dB: only just, with little to spare', `link budget: example margin (${await big()})`);
  // What it would take for the wanted margin (default 3 dB).
  { const f = await facts(); check(f.includes('Farthest distance at a 3 dB margin1,442 km') && f.includes('Transmit power for a 3 dB margin1.38 W') && f.includes('Fastest rate at a 3 dB margin6.95 kbit/s'), `link budget: what it would take (${f})`); }
  await page.evaluate(() => document.querySelectorAll('.lb details').forEach((d) => { d.open = true; }));
  await page.fill(R + '.lb-tm', '0'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('Farthest distance at a 0 dB margin2,036 km'), `link budget: zero target margin (${f})`); }
  await page.fill(R + '.lb-tm', '3');
  // Pass table: elevations 5 to 90 degrees.
  { const t = await page.textContent(R + '.lb-st'); check((await page.$$(R + '.lb-st tr')).length === 8 && t.includes('2,077') && t.includes('−0.17') && t.includes('+12.20') && (await page.textContent(R + '.lb-sth')) === 'Margin through a pass', `link budget: pass table (${t})`); }
  // Fixed link: distance multiples.
  await page.selectOption(R + '.lb-dm', 'km'); await page.fill(R + '.lb-km', '100'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.lb-st'); check((await page.$$(R + '.lb-st tr')).length === 7 && (await page.textContent(R + '.lb-sth')) === 'Margin at other distances' && t.includes('25') && t.includes('1,000'), `link budget: distance table (${t})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lb-csv')]); check(d.suggestedFilename() === 'link-budget.csv', 'link budget: CSV'); }
  // The S-band preset uses a dish, so the dish size for the wanted margin appears.
  await page.selectOption(R + '.lb-pre', 'sband'); await page.waitForTimeout(150);
  check((await facts()).includes('Dish for a 3 dB margin1.45 m') && (await big()).startsWith('Margin +9.33 dB'), `link budget: dish size for the wanted margin (${await facts()})`);
  await page.fill(R + '.lb-tm', 'x'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.lb-err')).includes('margin you want'), 'link budget: bad target margin message');
  await page.fill(R + '.lb-tm', '3'); await page.fill(R + '.lb-r', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.lb-err')).includes('data rate'), 'link budget: missing data rate explained');
};
