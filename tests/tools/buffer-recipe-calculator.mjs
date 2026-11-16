// #T113 buffer recipe calculator
export const path = '/science/buffer-recipe-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.buf ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/buffer-recipe-calculator/`); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await t('.buf-big')).includes('6.057 g Tris base') && (await t('.buf-big')).includes('28.4 mL'), 'buffer: example headline');
  check((await t('.buf-rt')).includes('6.057 g') && (await t('.buf-rt')).includes('28.4 mL') && (await t('.buf-rt')).includes('to 1000 mL'), 'buffer: ingredient table');
  check((await t('.buf-facts')).includes('0.760 : 1 (43.2 % base)'), 'buffer: base to acid ratio');
  await page.fill(R + '.buf-n', '10'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.buf-stock'), 'buffer: stock table shows');
  check((await t('.buf-stock-h')) === '10× stock (500 mM) in 1000 mL' && (await t('.buf-st')).includes('60.57 g') && (await t('.buf-st')).includes('284 mL'), 'buffer: 10x stock amounts');
  check((await t('.buf-stock-n')).includes('9 parts water to get 50 mM'), 'buffer: stock dilution line');
  await page.fill(R + '.buf-n', '1'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.buf-stock'), 'buffer: stock hidden at 1x');
  await page.click(R + '.buf-pre button:nth-child(4)'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.buf-b')) === 'hepes' && (await page.inputValue(R + '.buf-c')) === '20' && (await t('.buf-rt')).includes('4.766 g') && (await t('.buf-rt')).includes('9.35 mL'), 'buffer: HEPES preset');
  await page.click(R + '.buf-pre button:nth-child(3)'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.buf-mode')) === 'two' && !(await t('.buf-rt')).includes('NaN'), 'buffer: phosphate preset mixes two forms');
  await page.fill(R + '.buf-ph', '-3'); await page.waitForTimeout(150);
  check((await t('.buf-err')).includes('pH between 0 and 14'), 'buffer: bad pH message');
};
