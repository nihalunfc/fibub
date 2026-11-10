// #1768 Word counter
export const path = '/documents/word-counter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/word-counter/`); await page.waitForTimeout(400);
  const t = (s) => page.textContent(`.wdc ${s}`);
  await page.fill('.wdc .wdc-in', 'Hello world. This is a test!'); await page.waitForTimeout(100);
  check((await t('.wdc-words')) === '6' && (await t('.wdc-chars')) === '28' && (await t('.wdc-nosp')) === '23', 'wdc: words and characters');
  check((await t('.wdc-sent')) === '2' && (await t('.wdc-para')) === '1', 'wdc: sentences and paragraphs');
  check((await t('.wdc-read')) === '2 sec', `wdc: reading time (${await t('.wdc-read')})`);
  await page.selectOption('.wdc .wdc-preset', 'custom'); await page.fill('.wdc .wdc-n', '5'); await page.waitForTimeout(100);
  check(/1 over/.test(await t('.wdc-lim')) && (await t('.wdc-over mark')) === 'test!', `wdc: over limit marked (${await t('.wdc-lim')})`);
  await page.selectOption('.wdc .wdc-preset', 'tweet'); await page.waitForTimeout(100);
  check(/252 left/.test(await t('.wdc-lim')), 'wdc: tweet preset');
  await page.fill('.wdc .wdc-in', 'apple apple pie the pie apple'); await page.waitForTimeout(100);
  check((await t('.wdc-kw tbody tr:first-child')).startsWith('apple3'), 'wdc: keyword density');
};
