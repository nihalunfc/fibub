// #1783 Driver earnings
export const path = '/money/rideshare-earnings/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rideshare-earnings/`); await page.waitForTimeout(400);
  const R = '.re ', big = () => page.textContent(R + '.re-big'), rows = () => page.textContent(R + '.re-rows');
  check((await big()) === '14.65 an hour after costs', `driver: default net per hour (${await big()})`);
  check((await rows()).includes('512.80'), 'driver: net 980 - 467.20 = 512.80');
  check((await rows()).includes('0.570'), 'driver: net per km 0.570');
  await page.fill(R + '[data-k="tax"]', '30'); await page.waitForTimeout(100);
  check((await rows()).includes('153.84'), 'driver: 30% set-aside of 512.80');
  await page.fill(R + '[data-k="hours"]', '0'); await page.waitForTimeout(100);
  check(!(await big()).includes('NaN') && !(await big()).includes('Infinity'), 'driver: zero hours is safe');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '[data-k="tax"]', '20'); await page.fill(R + '[data-k="hours"]', '35');
  // EV: 900 km x 18/100 x 0.15 = 24.30 instead of fuel 115.20 -> net 512.80 + 90.90 = 603.70
  await page.selectOption(R + '[data-k="power"]', 'ev'); await page.waitForTimeout(100);
  check((await rows()).includes('603.70'), `driver: EV net 603.70 (${await rows()})`);
  // goal 20/h: 700 net needed; costs other than fee = 24.30+72+45+10 = 151.30; fares = (700+151.30-80)/0.75 = 1028.40
  await page.fill(R + '[data-k="goal"]', '20'); await page.waitForTimeout(100);
  check((await page.textContent(R + '[data-k="goaltext"]')).includes('1,028.40'), `driver: fares for goal (${await page.textContent(R + '[data-k="goaltext"]')})`);
};
