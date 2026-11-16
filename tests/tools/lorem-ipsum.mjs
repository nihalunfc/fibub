// #1772 Lorem ipsum
export const path = '/documents/lorem-ipsum/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/lorem-ipsum/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.lrm .lrm-out');
  await page.selectOption('.lrm .lrm-unit', 'words'); await page.fill('.lrm .lrm-n', '5'); await page.waitForTimeout(100);
  check((await out()) === 'Lorem ipsum dolor sit amet', `lrm: classic start (${await out()})`);
  await page.fill('.lrm .lrm-n', '40'); await page.waitForTimeout(100);
  check((await out()).trim().split(/\s+/).length === 40, 'lrm: 40 words');
  await page.selectOption('.lrm .lrm-unit', 'paragraphs'); await page.fill('.lrm .lrm-n', '3'); await page.check('.lrm .lrm-html'); await page.waitForTimeout(100);
  check(((await out()).match(/<p>/g) || []).length === 3, 'lrm: three html paragraphs');
  await page.uncheck('.lrm .lrm-html'); await page.selectOption('.lrm .lrm-style', 'plain'); await page.waitForTimeout(100);
  check((await out()).split('\n\n').length === 3 && !/lorem/i.test(await out()), 'lrm: plain english paragraphs');
  await page.selectOption('.lrm .lrm-style', 'classic'); await page.click('.lrm .lrm-q[data-u=characters][data-n="60"]'); await page.waitForTimeout(100);
  const o1 = (await out()).length;
  check(o1 <= 60 && o1 >= 40, `lrm: characters preset at most 60 (${o1})`);
  await page.click('.lrm .lrm-q[data-u=bullets]'); await page.waitForTimeout(100);
  check((await out()).split('\n').length === 5 && (await out()).split('\n').every((l) => l.startsWith('- ')), 'lrm: five list items');
  await page.check('.lrm .lrm-html'); await page.waitForTimeout(100);
  check(((await out()).match(/<li>/g) || []).length === 5 && (await out()).startsWith('<ul>'), 'lrm: html list');
  check(await page.isVisible('.kit-bar'), 'lrm: copy link bar present');
};
