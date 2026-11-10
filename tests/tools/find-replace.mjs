// #1771 Find and replace
export const path = '/documents/find-replace/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/find-replace/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.fnr .fnr-out');
  await page.fill('.fnr .fnr-in', 'Cat cat concat');
  await page.fill('.fnr .fnr-f', 'cat'); await page.fill('.fnr .fnr-r', 'dog'); await page.waitForTimeout(100);
  check((await out()) === 'Dog dog condog'.replace('Dog', 'dog'), `fnr: plain ignoring case (${await out()})`);
  await page.check('.fnr .fnr-word'); await page.waitForTimeout(100);
  check((await out()) === 'dog dog concat' && /2 matches/.test(await page.textContent('.fnr .fnr-count')), `fnr: whole word (${await out()})`);
  await page.check('.fnr .fnr-case'); await page.waitForTimeout(100);
  check((await out()) === 'Cat dog concat', `fnr: match case (${await out()})`);
  await page.uncheck('.fnr .fnr-word'); await page.uncheck('.fnr .fnr-case'); await page.check('.fnr .fnr-re');
  await page.fill('.fnr .fnr-in', '2026-11-10'); await page.fill('.fnr .fnr-f', '(\\d+)-(\\d+)-(\\d+)'); await page.fill('.fnr .fnr-r', '$3/$2/$1'); await page.waitForTimeout(100);
  check((await out()) === '10/11/2026', `fnr: regex groups (${await out()})`);
  await page.fill('.fnr .fnr-f', '(oops'); await page.waitForTimeout(100);
  check(await page.isVisible('.fnr .fnr-err'), 'fnr: bad pattern message');
  await page.uncheck('.fnr .fnr-re'); await page.fill('.fnr .fnr-in', 'a b'); await page.click('.fnr .fnr-add'); await page.waitForTimeout(100);
  check((await page.locator('.fnr .fnr-pair').count()) === 2, 'fnr: add pair');
};
