// #178 protein calculator: pH slider and amount converter (the main checks are in tests/run.mjs)
export const path = '/science/protein-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.ppc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  await page.click(R + '.pp-ex'); await page.waitForTimeout(400);
  check((await t('.pp-big')) === '14.14 kDa, pI 7.38', 'protein: example');
  await page.evaluate(() => { const r = document.querySelector('.ppc .pp-phs'); r.value = '2'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.pp-ph')) === '2' && (await t('.pp-facts')).includes('Net charge at pH 2'), 'protein: pH slider');
  await page.fill(R + '.pp-ph', '9.5'); await page.waitForTimeout(150);
  check(Math.abs(Number(await page.inputValue(R + '.pp-phs')) - 9.5) < 0.01, 'protein: typed pH moves the slider');
  await page.fill(R + '.pp-am', '1'); await page.waitForTimeout(100);
  check((await t('.pp-conv')).includes('1.000 µg = 70.7'), 'protein: 1 ug is about 70.7 pmol');
  await page.selectOption(R + '.pp-amu', 'pmol'); await page.fill(R + '.pp-am', '100'); await page.waitForTimeout(100);
  check((await t('.pp-conv')).includes('1.41'), 'protein: 100 pmol is about 1.41 ug');
  await page.selectOption(R + '.pp-cnu', 'uM'); await page.fill(R + '.pp-cn', '100'); await page.waitForTimeout(100);
  check((await t('.pp-conv')).includes('= 100.000 µM'), 'protein: uM to mg/mL');
  await page.fill(R + '.pp-am', '-2'); await page.waitForTimeout(100);
  check((await t('.pp-conv')).includes('above zero') && !(await t('.pp-conv')).includes('NaN'), 'protein: negative amount message');
};
