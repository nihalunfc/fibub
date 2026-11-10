// #1281 Statement and converse checker
export const path = '/learn/converse-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/converse-checker/`); await page.waitForSelector('.cv .cv-shape');
  const R = '.cv ', txt = (s) => page.textContent(R + s);
  check((await txt('.cv-if')) === 'If a quadrilateral is a square,' && (await txt('.cv-then')) === 'then its diagonals are equal.', 'converse: first statement split into if and then');
  check((await txt('.cv-meas')).includes('Diagonals: AC =') && (await txt('.cv-one')).includes('"If" part true?'), 'converse: figure measured');
  await page.click(R + '.cv-hunt[data-n="1000"]'); await page.waitForTimeout(150);
  check((await txt('.cv-res')).includes('No counterexample') && await page.isHidden(R + '.cv-show'), 'converse: square → equal diagonals holds');
  await page.click(R + '.cv-dir button[data-c="1"]'); await page.waitForTimeout(100);
  check((await txt('.cv-if')).includes('equal diagonals'), 'converse: swapped');
  await page.click(R + '.cv-hunt[data-n="1000"]'); await page.waitForTimeout(150);
  check((await txt('.cv-res')).includes('Counterexample found') && await page.isVisible(R + '.cv-show'), 'converse: counterexample to equal diagonals → square');
  await page.click(R + '.cv-show'); await page.waitForTimeout(100);
  check((await page.$$(R + '.cv-shape.bad')).length === 1 && (await txt('.cv-one')).includes('A counterexample'), 'converse: counterexample drawn');
  await page.click(R + '.cv-ans summary');
  check((await txt('.cv-why')).includes('The converse is false') && (await txt('.cv-why')).includes('rectangle'), 'converse: answer and reason');
  await page.selectOption(R + '.cv-st', 'pgram-bisect'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.cv-show') && (await txt('.cv-res')) === '', 'converse: changing statement clears the hunt');
  await page.click(R + '.cv-hunt[data-n="1000"]'); await page.waitForTimeout(150);
  check((await txt('.cv-res')).includes('No counterexample'), 'converse: parallelogram converse holds');
  await page.selectOption(R + '.cv-st', 'div6'); await page.click(R + '.cv-hunt[data-n="100"]'); await page.waitForTimeout(150);
  check(/Counterexample found: n = \d+/.test(await txt('.cv-res')), 'converse: number counterexample');
  await page.click(R + '.cv-show'); await page.waitForTimeout(100);
  check((await txt('.cv-fig')).startsWith('n = '), 'converse: number shown');
  await page.selectOption(R + '.cv-st', 'vert-opp'); await page.click(R + '.cv-hunt[data-n="100"]'); await page.waitForTimeout(150);
  check((await txt('.cv-res')).includes('two separate'), 'converse: angles counterexample');
  await page.click(R + '.cv-dir button[data-c="0"]'); await page.selectOption(R + '.cv-st', 'pythag'); await page.click(R + '.cv-hunt[data-n="1000"]'); await page.waitForTimeout(150);
  check((await txt('.cv-res')).includes('No counterexample'), 'converse: Pythagoras holds');
  for (let i = 0; i < 5; i++) await page.click(R + '.cv-new');
  check((await page.$$(R + '.cv-v')).length === 3, 'converse: triangle has three labels');
  const items = page.locator('.cv .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `converse: every worked answer accepted (${right}/${n})`);
  await items.nth(0).locator('.cq-in').fill('maybe'); await items.nth(0).locator('.cq-check').click();
  check((await items.nth(0).locator('.cq-res').textContent()).startsWith('Not quite'), 'converse: wrong answer marked');
};
