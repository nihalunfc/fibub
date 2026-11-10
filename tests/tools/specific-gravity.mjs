// #1604 Specific gravity
export const path = '/collecting/specific-gravity/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/specific-gravity/`); await page.waitForTimeout(300);
  check((await page.textContent('.sg .sg-sg')).includes('19.32'), `specific-gravity: 31.10 g / 29.49 g gives SG 19.32 (${await page.textContent('.sg .sg-sg')})`);
  check((await page.textContent('.sg .sg-out')).includes('Fine gold'), 'specific-gravity: closest is fine gold');
  check(/9[89]\.\d% gold/.test(await page.textContent('.sg .sg-gold-copper')), 'specific-gravity: gold share about 99 to 100%');
  await page.fill('.sg .sg-wat', '28.18'); await page.waitForTimeout(100);
  check((await page.textContent('.sg .sg-sg')).includes('10.65'), `specific-gravity: other weighing changes the SG (${await page.textContent('.sg .sg-sg')})`);
  await page.selectOption('.sg .sg-alloy', 'silver-999'); await page.waitForTimeout(100);
  check((await page.textContent('.sg .sg-vs')).includes('Close'), 'specific-gravity: stated silver is close');
  await page.fill('.sg .sg-wat', '40'); await page.waitForTimeout(100);
  check(/Type a weight/.test(await page.textContent('.sg .sg-out')), 'specific-gravity: water weight above air weight asks for a fix');
};
