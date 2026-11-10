// #T912 Slug maker
export const path = '/everyday/slug-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/slug-maker/`); await page.waitForTimeout(300);
  const out = () => page.inputValue('.sm .sm-out');
  check((await out()) === 'hello-world-10-tips-tricks', `slug: example (${await out()})`);
  await page.selectOption('.sm [data-k="sep"]', '_'); await page.waitForTimeout(100);
  check((await out()) === 'hello_world_10_tips_tricks', `slug: underscore (${await out()})`);
  await page.selectOption('.sm [data-k="sep"]', '-');
  await page.fill('.sm [data-k="max"]', '20'); await page.waitForTimeout(100);
  check((await out()) === 'hello-world-10-tips', `slug: max 20 cuts at a word (${await out()})`);
  await page.fill('.sm [data-k="max"]', '0');
  await page.selectOption('.sm [data-k="kind"]', 'file');
  await page.fill('.sm .sm-in', 'Report Q3 Final.PDF\nThe Art of War'); await page.waitForTimeout(100);
  check((await out()) === 'report-q3-final.pdf\nthe-art-of-war', `slug: file names, many lines (${await out()})`);
  await page.check('.sm [data-k="stop"]'); await page.waitForTimeout(100);
  check((await out()).split('\n')[1] === 'art-war', 'slug: drop little words');
};
