// #L344 Ripple tank
export const path = '/learn/ripple-tank/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ripple-tank/`); await page.waitForTimeout(1000);
  const o = page.locator('.rt .rt-out');
  const set = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'input'); };
  await set('.rt .rt-f', 8); await set('.rt .rt-d', 6);
  check(Math.abs(+(await o.getAttribute('data-v')) - Math.sqrt(9.81 * 0.006)) < 1e-3 && Math.abs(+(await o.getAttribute('data-lambda')) - 100 * Math.sqrt(9.81 * 0.006) / 8) < 0.01, 'ripple-tank: 8 Hz at 6 mm gives v = 0.243 m/s and 3.03 cm');
  await page.click('.rt .rt-strobe');
  check((await o.getAttribute('data-frozen')) === 'true', 'ripple-tank: strobe freezes the waves');
  // measure over 3 wavefronts: drag the true distance and check v = f lambda
  await page.locator('.rt .rt-cv').scrollIntoViewIfNeeded(); await set('.rt .rt-n', 3); const box = await page.locator('.rt .rt-cv').boundingBox(); const ppc = box.width / 24, len = 3 * 100 * Math.sqrt(9.81 * 0.006) / 8 * ppc;
  await page.mouse.move(box.x + 20, box.y + 60); await page.mouse.down(); await page.mouse.move(box.x + 20 + len, box.y + 60, { steps: 5 }); await page.mouse.up();
  check(Math.abs(+(await o.getAttribute('data-vmeas')) - Math.sqrt(9.81 * 0.006)) < 0.01, 'ripple-tank: the dragged ruler gives v = f lambda close to the true speed');
  await set('.rt .rt-f', 12);
  check(+(await o.getAttribute('data-lambda')) < 2.1, 'ripple-tank: higher frequency, shorter wavelength');
  await page.click('.rt [data-s=shallow]');
  check((await o.getAttribute('data-setup')) === 'shallow' && +(await o.getAttribute('data-lambda2')) < +(await o.getAttribute('data-lambda')) && +(await o.getAttribute('data-theta2')) < 30, 'ripple-tank: shallow region shortens the wavelength and bends the waves');
  await page.click('.rt [data-s=gap]'); await set('.rt .rt-g', 1.5);
  check((await o.getAttribute('data-spread')) === '90.00' || +(await o.getAttribute('data-spread')) > 40, 'ripple-tank: a narrow gap spreads the waves widely');
  { const a = await page.getAttribute('.rt .lq-item', 'data-ans'); await page.fill('.rt .lq-in', a); await page.click('.rt .lq-check');
    check((await page.textContent('.rt .lq-fb')) === 'Right.', 'ripple-tank: quiz accepts the right answer'); }
};
