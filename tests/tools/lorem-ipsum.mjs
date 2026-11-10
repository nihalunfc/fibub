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
};
