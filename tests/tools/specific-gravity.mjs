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
  await page.fill('.sg .sg-wat', '29.49'); await page.selectOption('.sg .sg-alloy', 'gold-999'); await page.waitForTimeout(100);
  check(/should read 29\.4\d g in water/.test(await page.textContent('.sg .sg-vs')), `specific-gravity: expected water weight for fine gold about 29.49 g (${await page.textContent('.sg .sg-vs')})`);
  await page.evaluate(() => document.querySelectorAll('.sg details').forEach((d) => (d.open = true)));
  await page.fill('.sg .sg-dia', '40'); await page.fill('.sg .sg-thk', '3'); await page.waitForTimeout(100);
  // volume = pi*20^2*3/1000 = 3.770 cm3; 31.10 / 3.770 = 8.25 g/cm3
  check((await page.textContent('.sg .sg-disc')).includes('8.25'), `specific-gravity: 31.10 g in a 40 x 3 mm disc = 8.25 g/cm3 (${await page.textContent('.sg .sg-disc')})`);
  await page.fill('.sg .sg-tol', '0.0001'); await page.waitForTimeout(100);
  check((await page.textContent('.sg .sg-vs')).includes('Not close'), 'specific-gravity: a tight allowed difference flips to Not close');
};
