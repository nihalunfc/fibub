// #1717 Tip calculator
export const path = '/money/tip-calculator/';
export default async (ctx) => { await main(ctx); await kit(ctx); };
const main = async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/tip-calculator/`); await page.waitForTimeout(400);
  const R = '.tc ';
  const each = () => page.textContent(R + '.tc-each');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await each()) === '28.75 each', `tip: 100 at 15% split 4 -> 28.75 each (${await each()})`);
  await page.click(R + '.tc-tips [data-t="20"]'); await page.waitForTimeout(100);
  check((await each()) === '30.00 each', 'tip: 20% button -> 30.00 each');
  await set('tax', '10'); await page.check(R + 'input[value="post"]'); await page.waitForTimeout(100);
  check((await each()) === '33.00 each', `tip: tip on bill with tax (${await each()})`);
  await page.check(R + '[data-k="inc"]'); await page.waitForTimeout(100);
  check((await each()) === '27.50 each', 'tip: service charge included -> no tip');
  await page.uncheck(R + '[data-k="inc"]'); await set('tip', '15'); await set('tax', '0'); await set('bill', '83'); await set('n', '3'); await page.check(R + '[data-k="up"]'); await page.waitForTimeout(100);
  check((await each()) === '32.00 each', `tip: round up per person (${await each()})`);
  // new options
  await page.uncheck(R + '[data-k="up"]'); await set('bill', '100'); await set('n', '4');
  await page.click(R + '[data-step="1"]'); await page.waitForTimeout(100);
  check((await each()) === '23.00 each', `tip: plus button adds a person (${await each()})`);
  await page.click(R + '[data-step="-1"]'); await page.click(R + '.tc-tips [data-t="25"]'); await page.waitForTimeout(100);
  check((await each()) === '31.25 each', 'tip: 25% button');
  await page.evaluate(() => (document.querySelector('.tc-cmp').open = true));
  check((await page.locator(R + '.tc-tab tbody tr').count()) === 7 && (await page.textContent(R + '.tc-tab tr.on')).includes('31.25'), 'tip: comparison table highlights chosen tip');
  await set('bill', '1,000'); check((await each()) === '312.50 each', 'tip: commas in the bill');
  await set('bill', '-5');
  check(!(await page.textContent(R)).includes('NaN') && (await page.textContent(R + '.tc-note')).includes('Type'), 'tip: negative bill gives a friendly message');
};
// Shared kit (src/scripts/toolkit.ts): a link carries the numbers and fills them in again.
export const kit = async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/tip-calculator/`); await page.waitForTimeout(400);
  check(await page.isVisible('.kit-bar .kit-link'), 'toolkit: Copy link and Copy result bar shows');
  await page.fill('.tc [data-k="bill"]', '250'); await page.click('.kit-link'); await page.waitForTimeout(200);
  check(page.url().includes('bill=250'), 'toolkit: the link holds the typed number (' + page.url() + ')');
  await page.goto(`${BASE}/money/tip-calculator/#bill=420`); await page.waitForTimeout(500);
  check((await page.inputValue('.tc [data-k="bill"]')) === '420', 'toolkit: opening a link fills the number in');
};
