// #166 ligation calculator: vector unit and one-ratio picker
export const path = '/science/ligation-calculator/';
export default async ({ page, check, BASE }) => {
  const S = '.lgc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await page.textContent(S + '.lg-big')) === '3.61 µL DNA + 13.4 µL water in 20 µL', 'lig: example');
  check((await page.textContent(S + '.lg-work')).startsWith('Working:'), 'lig: working line');
  await page.selectOption(S + '.lg-vu', 'fmol'); await page.fill(S + '.lg-vng', '30'); await page.waitForTimeout(700);
  check((await page.textContent(S + '.lg-facts')).includes('30 fmol') || (await page.textContent(S + '.lg-facts')).includes('30.0 fmol'), 'lig: vector in fmol');
  const ng = parseFloat((await page.textContent(S + '.lg-facts')).match(/Vector([\d.]+) ng/)?.[1] ?? '0');
  check(ng > 99 && ng < 101.5, `lig: 30 fmol of 5400 bp is about 100 ng (${ng})`);
  await page.selectOption(S + '.lg-vu', 'ng'); await page.fill(S + '.lg-vng', '50');
  await page.selectOption(S + '.lg-allr', '5'); await page.waitForTimeout(700);
  check((await page.inputValue(S + '.lg-data')).split('\n').slice(1).every((l) => l.split(',')[3] === '5'), 'lig: all ratios set to 5');
  check((await page.textContent(S + '.lg-tab')).includes('5:1'), 'lig: table shows 5:1');
  await page.fill(S + '.lg-vng', '0'); await page.waitForTimeout(700);
  check((await page.textContent(S + '.lg-err')).includes('vector amount'), 'lig: zero vector message');
};
