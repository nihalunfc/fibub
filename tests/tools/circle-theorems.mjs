// #L352 Circle theorems
export const path = '/learn/circle-theorems/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/circle-theorems/`); await page.waitForTimeout(300);
  const o = page.locator('.ct .ct-out');
  const near = async (a, b) => Math.abs(+(await o.getAttribute(a)) - b) < 0.05;
  await page.evaluate(() => document.querySelector('.ct .ct-cv').setPoint('P', 80));
  check((await o.getAttribute('data-thm')) === 'centre' && (await near('data-v1', 140)) && (await near('data-v2', 70)), 'circle-theorems: centre angle 140 is twice 70');
  await page.evaluate(() => document.querySelector('.ct .ct-cv').setPoint('P', 250));
  check((await near('data-v1', 2 * +(await o.getAttribute('data-v2')))), 'circle-theorems: still double after dragging P to the other arc');
  await page.selectOption('.ct .ct-thm', 'semi');
  await page.evaluate(() => document.querySelector('.ct .ct-cv').setPoint('P', 123));
  check(await near('data-v1', 90), 'circle-theorems: angle in a semicircle is 90');
  await page.selectOption('.ct .ct-thm', 'quad');
  check((await o.getAttribute('data-equal')) === 'true', 'circle-theorems: cyclic quadrilateral opposite angles add to 180');
  await page.selectOption('.ct .ct-thm', 'alt');
  check((await o.getAttribute('data-equal')) === 'true', 'circle-theorems: alternate segment angles are equal');
  await page.selectOption('.ct .ct-thm', 'twotan');
  check((await o.getAttribute('data-equal')) === 'true', 'circle-theorems: two tangents are equal');
  { const a = await page.getAttribute('.ct .lq-item', 'data-ans'); await page.fill('.ct .lq-in', a); await page.click('.ct .lq-check');
    check((await page.textContent('.ct .lq-fb')) === 'Right.', 'circle-theorems: quiz accepts the right answer'); }
};
