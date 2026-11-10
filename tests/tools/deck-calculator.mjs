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
};
