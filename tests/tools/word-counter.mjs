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
  await page.fill('.wdc .wdc-in', 'Hello world. This is a test!'); await page.selectOption('.wdc .wdc-preset', 'yt-title'); await page.waitForTimeout(100);
  check(/72 left/.test(await t('.wdc-lim')), `wdc: YouTube title preset (${await t('.wdc-lim')})`);
  check(await page.isVisible('.wdc .wdc-bar') && (await page.getAttribute('.wdc .wdc-bar', 'aria-valuenow')) === '28', 'wdc: progress bar shows 28%');
  await page.selectOption('.wdc .wdc-preset', 'ig-caption'); await page.waitForTimeout(50);
  check(/2,172 left/.test(await t('.wdc-lim')), 'wdc: Instagram preset');
  await page.selectOption('.wdc .wdc-preset', 'li-post'); await page.waitForTimeout(50);
  check(/2,972 left/.test(await t('.wdc-lim')), 'wdc: LinkedIn preset');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await t('.wdc-uniq')) === '6' && (await t('.wdc-lines')) === '1' && (await t('.wdc-long')) === 'hello', 'wdc: more numbers');
  check((await t('.wdc-sum')).startsWith('6 words, 28 characters (23 without spaces), 2 sentences'), `wdc: one-line summary (${await t('.wdc-sum')})`);
  check(await page.isVisible('.kit-bar'), 'wdc: copy link bar present');
};
