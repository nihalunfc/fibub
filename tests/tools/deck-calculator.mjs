// #T872 Deck calculator
export const path = '/everyday/deck-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/deck-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.dk ${s}`)).trim();
  check((await t('.dk-rows')).startsWith('21 '), 'deck-calculator: 3 m across 140 + 5 mm boards is 21 rows');
  check((await t('.dk-boards')) === '21 boards of 4.8 m', 'deck-calculator: 4 m run from 3.6 and 4.8 m uses 21 boards of 4.8 m');
  check((await t('.dk-joists')).startsWith('11 joists'), 'deck-calculator: joists at 400 mm across 4 m is 11');
  check((await t('.dk-fix')).startsWith('462 screws'), 'deck-calculator: 21 x 11 x 2 = 462 screws');
  await page.selectOption('.dk [data-k="fix"]', 'clip');
  await page.fill('.dk [data-k="lens"]', '2.4');
  check((await t('.dk-fix')).startsWith('231 hidden clips') && (await t('.dk-boards')) === '42 boards of 2.4 m', 'deck-calculator: clips and joined rows');
  // More options: prices and sketch.
  await page.goto(`${BASE}/everyday/deck-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator('.dk .dk-sk svg').count()) === 1, 'deck-calculator: plan sketch shown');
  await page.fill('.dk [data-k="pb"]', '2'); await page.fill('.dk [data-k="pj"]', '3'); await page.fill('.dk [data-k="pf"]', '10');
  check((await t('.dk-cost')).startsWith('346.80 (boards 201.60, joists 99.00, fixings 46.20)'), `deck-calculator: 100.8 m x 2 + 33 m x 3 + 4.62 x 10 = 346.80 (${await t('.dk-cost')})`);
  await page.fill('.dk [data-k="pj"]', ''); await page.fill('.dk [data-k="pf"]', '');
  check((await t('.dk-cost')).startsWith('201.60 (boards 201.60)'), 'deck-calculator: boards only');
  await page.click('.dk-units [data-u="i"]'); await page.waitForTimeout(100);
  await page.fill('.dk [data-k="pb"]', '1'); await page.waitForTimeout(100);
  check((await t('.dk-cost')).startsWith('416.00 (boards 416.00)'), `deck-calculator: imperial 26 rows x 16 ft = 416 ft (${await t('.dk-cost')})`);
  await page.fill('.dk [data-k="run"]', ''); await page.waitForTimeout(100);
  check((await t('.dk-cost')) === '–' && (await page.locator('.dk .dk-sk svg').count()) === 0, 'deck-calculator: blank size clears cost and sketch');
};
