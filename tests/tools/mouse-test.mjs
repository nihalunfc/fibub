// #T1055 Mouse Test. Buttons and wheel come from page.mouse; back/forward buttons and chatter from synthetic pointer events.
export const path = '/everyday/mouse-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/mouse-test/`); await page.waitForTimeout(300);
  const R = '.ms ', t = (s) => page.textContent(R + s), chip = (b) => page.getAttribute(`${R}.ms-b[data-b="${b}"]`, 'class');
  await page.locator(R + '.ms-pad').scrollIntoViewIfNeeded();
  const box = await (await page.$(R + '.ms-pad')).boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.click(cx, cy); await page.waitForTimeout(200);
  await page.mouse.click(cx, cy, { button: 'right' }); await page.waitForTimeout(200);
  await page.mouse.click(cx, cy, { button: 'middle' }); await page.waitForTimeout(200);
  check((await chip(0)).includes('done') && (await chip(1)).includes('done') && (await chip(2)).includes('done') && (await t('.ms-clicks')) === '3', 'mouse-test: left, middle and right buttons light up and count');
  check(await page.isHidden(R + '.ms-chatter'), 'mouse-test: slow clicks raise no chatter warning');
  await page.evaluate(() => {
    const pad = document.querySelector('.ms .ms-pad');
    for (let i = 0; i < 2; i++) pad.dispatchEvent(new PointerEvent('pointerdown', { button: 3, buttons: 8, pointerType: 'mouse', bubbles: true }));
  });
  check((await chip(3)).includes('done') && (await t('.ms-chat')) === '1' && await page.isVisible(R + '.ms-chatter'), 'mouse-test: two back-button presses under 80 ms flag chatter');
  await page.mouse.dblclick(cx, cy);
  check(+(await t('.ms-dbl')) >= 1, 'mouse-test: double-click counted');
  await page.mouse.wheel(0, 100); await page.mouse.wheel(0, -100); await page.mouse.wheel(60, 0); await page.waitForTimeout(100);
  check((await t('.ms-up')) === '1' && (await t('.ms-down')) === '1' && (await t('.ms-right')) === '1' && (await t('.ms-mode')) === 'pixels', 'mouse-test: wheel up, down and sideways counted with the unit');
  for (let i = 0; i < 40; i++) { await page.mouse.move(cx + i * 3, cy + (i % 5) * 4); await page.waitForTimeout(6); }
  check((await t('.ms-poll')) !== '–' && /Hz/.test(await t('.ms-poll')), `mouse-test: report rate shown after fast movement (${await t('.ms-poll')})`);
  await page.click(R + '.ms-clear');
  check((await t('.ms-clicks')) === '0' && await page.isHidden(R + '.ms-chatter'), 'mouse-test: reset clears the counters');
};
