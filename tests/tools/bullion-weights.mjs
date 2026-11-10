// #1608 Bullion weights
export const path = '/collecting/bullion-weights/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/bullion-weights/`); await page.waitForTimeout(300);
  await page.selectOption('.bw .bw-unit', 'tola'); await page.fill('.bw .bw-in', '1'); await page.waitForTimeout(50);
  const cell = async (u) => await page.textContent(`.bw tr[data-u="${u}"] .bw-v`);
  check((await cell('g')).startsWith('11.6638'), `bullion-weights: 1 tola = 11.6638 g (${await cell('g')})`);
  check((await cell('ozt')).startsWith('0.375'), `bullion-weights: 1 tola = 0.375 troy oz (${await cell('ozt')})`);
  check((await cell('gr')).startsWith('180'), `bullion-weights: 1 tola = 180 grains (${await cell('gr')})`);
  await page.selectOption('.bw .bw-unit', 'g'); await page.fill('.bw .bw-in', '10'); await page.waitForTimeout(50);
  check((await cell('ozt')).includes('0.3215'), `bullion-weights: 10 g = 0.3215 troy oz (${await cell('ozt')})`);
  check((await page.textContent('.bw .bw-out')).includes('troy oz'), 'bullion-weights: headline shows grams and troy oz');
  await page.fill('.bw .bw-in', '0'); await page.waitForTimeout(50);
  check((await cell('ozt')) === '0', `bullion-weights: zero stays zero (${await cell('ozt')})`);
};
