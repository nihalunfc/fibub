// #T904 Axle weights
export const path = '/money/axle-weights/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/axle-weights/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.ax .ax-out'), big = () => page.textContent('.ax .ax-big');
  // Bridge formula: 5 axles over 51 ft = 500 (51*5/4 + 60 + 36) = 79,875 -> 80,000
  check((await page.textContent('.ax .ax-bres')).includes('80,000 lb'), 'axle-weights: bridge formula 5 axles over 51 ft = 80,000');
  // 40,000 lb load 20 ft behind the kingpin on a 40 ft span: 20,000 to the trailer, 20,000 kingpin -> 19,000 drive, 1,000 steer
  const o = await out();
  check(o.includes('11,500 / 20,000') && o.includes('31,500 / 34,000') && o.includes('27,000 / 34,000') && o.includes('70,000 / 80,000'), `axle-weights: lever rule split (${o.slice(0, 160)})`);
  check((await big()).startsWith('Within'), 'axle-weights: within limits');
  await page.fill('.ax [data-k="at"]', '30'); await page.waitForTimeout(100);
  check((await out()).includes('37,000 / 34,000') && (await big()).startsWith('Over'), `axle-weights: moving the load back overloads the trailer tandem (${await big()})`);
  await page.selectOption('.ax [data-k="reg"]', 'ca'); await page.waitForTimeout(100);
  check((await out()).includes('kg') && (await page.textContent('.ax .ax-src')).includes('Estimate'), 'axle-weights: Canada switches to kg and says estimate');
};
