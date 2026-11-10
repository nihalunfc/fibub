// #1717 Tip calculator
export const path = '/money/tip-calculator/';
export default async ({ page, check, BASE }) => {
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
};
