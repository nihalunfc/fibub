// #T917 Water intake
export const path = '/everyday/water-intake/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/water-intake/`); await page.waitForTimeout(300);
  const R = '.wi ';
  const row = (s) => page.textContent(R + `tr[data-src="${s}"]`);
  { const e = await row('efsa'), n = await row('nasem');
    check(e.includes('2.5 L') && e.includes('2.0 L'), `water: man EFSA 2.5 L total, 2.0 L drinks (${e})`);
    check(n.includes('3.7 L') && n.includes('3.0 L'), `water: man NASEM 3.7 L total, ~3.0 L drinks (${n})`); }
  await page.fill(R + '.wi-ex', '60'); await page.waitForTimeout(100);
  { const e = await row('efsa'); check(e.includes('+1.0 L') && e.includes('3.0 L'), `water: 60 min exercise adds 1.0 L (${e})`); }
  await page.selectOption(R + '.wi-who', 'w'); await page.fill(R + '.wi-ex', '0'); await page.waitForTimeout(100);
  check((await row('efsa')).includes('2.0 L'), 'water: woman EFSA 2.0 L');
  await page.click(R + '.wi-plus'); await page.click(R + '.wi-plus');
  check((await page.textContent(R + '.wi-count')) === '2', 'water: glasses counter');
  check((await page.evaluate(() => localStorage.getItem('fibub-water-v1'))) === null, 'water: nothing stored by default');
};
