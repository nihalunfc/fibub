// #L335 Earth's seasons
export const path = '/learn/earth-seasons/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/earth-seasons/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.es .es-out', 'data-' + k).then(Number);
  await page.fill('.es .es-lat', '43'); await page.dispatchEvent('.es .es-lat', 'input');
  check(Math.abs((await at('h')) - 15.2) < 0.2 && Math.abs((await at('el')) - 70.4) < 0.3, 'earth-seasons: 43 N on the June solstice is about 15.2 h and 70.4 degrees');
  await page.fill('.es .es-tilt', '0'); await page.dispatchEvent('.es .es-tilt', 'input');
  check(Math.abs((await at('h')) - 12) < 0.01, 'earth-seasons: no tilt gives 12 h of daylight');
  { const a = await page.getAttribute('.es .lq-item', 'data-ans'); await page.fill('.es .lq-in', a); await page.click('.es .lq-check');
    check((await page.textContent('.es .lq-fb')) === 'Right.', 'earth-seasons: quiz accepts the right answer'); }
};
