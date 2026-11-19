// #T1054 Keyboard Test. Keys come from page.keyboard; the page counts only keys that reach the focused test box.
export const path = '/everyday/keyboard-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/keyboard-test/`); await page.waitForTimeout(300);
  const R = '.kb ', t = (s) => page.textContent(R + s);
  check((await t('.kb-count')).startsWith('0 of ') && (await page.isVisible(R + '.kb-start')), 'keyboard-test: starts at 0 keys with a "Click here to start" box');
  await page.click(R + '.kb-box'); await page.waitForTimeout(100);
  const y0 = await page.evaluate(() => scrollY);
  await page.keyboard.press('KeyA'); await page.keyboard.press('Space'); await page.keyboard.press('Tab');
  check((await t('.kb-count')).startsWith('3 of '), `keyboard-test: three keys tested (${await t('.kb-count')})`);
  check((await page.evaluate(() => scrollY)) === y0 && (await t('.kb-code')) === 'Tab', 'keyboard-test: Tab and Space do not move the page; last code shown');
  await page.keyboard.down('KeyQ'); await page.keyboard.down('KeyW'); await page.keyboard.down('KeyE');
  check((await t('.kb-held')) === '3' && (await t('.kb-max')) === '3' && (await page.$$(R + '.kb-k.down')).length === 3, 'keyboard-test: held keys light up and rollover is 3');
  await page.keyboard.up('KeyQ'); await page.keyboard.up('KeyW'); await page.keyboard.up('KeyE');
  check((await t('.kb-held')) === '0' && (await t('.kb-max')) === '3', 'keyboard-test: releasing keeps the maximum');
  await page.click(R + '.kb-lay[data-lay="laptop"]');
  const nLap = +(await t('.kb-count')).split(' of ')[1];
  await page.click(R + '.kb-lay[data-lay="full"]');
  const nFull = +(await t('.kb-count')).split(' of ')[1];
  check(nLap < nFull && nFull >= 100, `keyboard-test: laptop shows fewer keys than full (${nLap}, ${nFull})`);
  await page.click(R + '.kb-reset');
  check((await t('.kb-count')).startsWith('0 of ') && (await t('.kb-max')) === '0', 'keyboard-test: Reset clears everything');
};
