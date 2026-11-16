// Prompt pruner
export const path = '/documents/prompt-pruner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const para = (i) => `Paragraph ${i} ` + 'word '.repeat(60);
  const text = Array.from({ length: 60 }, (_, i) => para(i)).join('\n\n');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.pp-paste', text);
  await page.click('.pp-paste-go');
  await page.waitForSelector('.pp-result:not([hidden])', { timeout: 15000 });
  await page.selectOption('.pp-size', '3000');
  const btns = await page.$$eval('.pp-parts button', (b) => b.map((x) => x.textContent));
  check(btns.length >= 2 && btns[0].startsWith('Copy part 1 of'), `prompt-pruner: long text splits into parts (${btns.length})`);
  await page.selectOption('.pp-size', '60000');
  check((await page.textContent('.pp-parts')).includes('already fits'), 'prompt-pruner: short enough text stays one part');
};
