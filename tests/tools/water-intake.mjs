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
  // more options: body weight rule, glass presets, drinking times
  await page.goto(`${BASE}/everyday/water-intake/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator(R + '.wi-times li').count()) === 8 && (await page.textContent(R + '.wi-times li')) === '07:00', 'water: man 2.0 L of drinks = 8 glasses from 07:00');
  await page.fill(R + '.wi-wt', '70'); await page.waitForTimeout(100);
  { const w = await row('weight'); check(w.includes('2.1 L') && w.includes('1.7 L'), `water: 70 kg x 30 mL = 2.1 L total, 1.7 L from drinks (${w})`); }
  await page.click(R + '.wi-presets [data-g="500"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.wi-glass')) === '500' && (await page.locator(R + '.wi-times li').count()) === 4, 'water: 500 mL bottle -> 4 times');
  await page.fill(R + '.wi-wt', ''); await page.waitForTimeout(100);
  check((await page.locator(R + 'tr[data-src="weight"]').count()) === 0, 'water: no weight, no extra row');
};
