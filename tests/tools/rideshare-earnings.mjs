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
};
