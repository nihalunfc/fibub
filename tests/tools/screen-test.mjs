// #T1057 Screen Test.
export const path = '/everyday/screen-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/screen-test/`); await page.waitForTimeout(300);
  const R = '.st ', t = (s) => page.textContent(R + s);
  const px = await page.evaluate(() => `${Math.round(screen.width * devicePixelRatio)} × ${Math.round(screen.height * devicePixelRatio)}`);
  check((await t('.st-facts')).includes(px), `screen-test: facts list the physical pixels (${px})`);
  await page.fill(R + '.st-in', '15.6');
  const want = await page.evaluate(() => Math.round(Math.hypot(Math.round(screen.width * devicePixelRatio), Math.round(screen.height * devicePixelRatio)) / 15.6));
  check((await t('.st-ppi')).startsWith(`${want} pixels per inch`), `screen-test: PPI from a typed diagonal (${await t('.st-ppi')})`);
  await page.fill(R + '.st-in', '');
  check((await t('.st-ppi')) === '', 'screen-test: an empty diagonal shows no PPI');
  await page.click(R + '.st-go');
  const bg = () => page.evaluate(() => getComputedStyle(document.querySelector('.st .st-over')).backgroundColor);
  check((await bg()) === 'rgb(0, 0, 0)', 'screen-test: the colour test starts on black');
  await page.keyboard.press('ArrowRight');
  check((await bg()) === 'rgb(255, 255, 255)', 'screen-test: arrow key steps to white');
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  check(!(await page.isVisible(R + '.st-over')), 'screen-test: Esc leaves the colour test');
  await page.click(R + '.st-hz');
  await page.waitForFunction(() => /Hz/.test(document.querySelector('.st .st-hzout').textContent) || /Not enough/.test(document.querySelector('.st .st-hzout').textContent), null, { timeout: 6000 });
  const hz = parseInt((await t('.st-hzout')).replace('About ', ''));
  check(hz >= 20 && hz <= 500, `screen-test: refresh rate measured (${await t('.st-hzout')})`);
};
