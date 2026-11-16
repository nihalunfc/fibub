// #L354 Bearings
export const path = '/learn/bearings/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/bearings/`); await page.waitForTimeout(1000);
  const o = page.locator('.bear .bear-out');
  await page.fill('.bear .bear-b', '45'); await page.dispatchEvent('.bear .bear-b', 'input');
  check(Math.abs(+(await o.getAttribute('data-bearing')) - 45) < 0.6 && Math.abs(+(await o.getAttribute('data-back')) - 225) < 0.6, 'bearings: slider 045 gives back bearing 225');
  check((await o.textContent()).includes('045°'), 'bearings: shows the three-figure bearing 045°');
  await page.fill('.bear .bear-b', '270'); await page.dispatchEvent('.bear .bear-b', 'input');
  check(Math.abs(+(await o.getAttribute('data-back')) - 90) < 0.6, 'bearings: back bearing of 270 is 090');
  { await page.locator('.bear .bear-cv').scrollIntoViewIfNeeded(); const bx = await page.locator('.bear .bear-cv').boundingBox(); const before = await o.getAttribute('data-bearing');
    await page.mouse.move(bx.x + 10 + 3 * ((bx.width - 20) / 10), bx.y + bx.height - 10 - 3 * ((bx.width - 20) / 10));
    await page.mouse.down(); await page.mouse.move(bx.x + bx.width * 0.7, bx.y + 40, { steps: 5 }); await page.mouse.up();
    check((await o.getAttribute('data-bearing')) !== before, 'bearings: dragging A changes the bearing'); }
  await page.click('.bear [data-mode=journey]');
  const j = page.locator('.bear .bear-jout');
  check(Math.abs(+(await j.getAttribute('data-jdist')) - 5) < 0.01 && Math.abs(+(await j.getAttribute('data-jbearing')) - 306.87) < 0.05, 'bearings: journey 4 km east then 3 km south is 5 km back on 307');
  await page.click('.bear .bear-add');
  check((await j.getAttribute('data-jlegs')) === '3', 'bearings: add a leg');
  await page.click('.bear [data-mode=points]');
  { const a = await page.getAttribute('.bear .lq-item', 'data-ans'); await page.fill('.bear .lq-in', a); await page.click('.bear .lq-check');
    check((await page.textContent('.bear .lq-fb')) === 'Right.', 'bearings: quiz accepts the right answer'); }
};
