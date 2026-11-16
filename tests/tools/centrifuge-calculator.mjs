// #T115 centrifuge calculator: new options (working, chart, tables, diameter).
export const path = '/science/centrifuge-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.cen ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.cen-big')) === '13,000 rpm = 17,953 × g at 9.5 cm', 'centrifuge: example still 17,953 × g');
  check(await page.isVisible(R + '.cen-sfig'), 'centrifuge: force against speed chart');
  check((await txt('.cen-wk')).includes('= 17,953 × g'), 'centrifuge: working shows the numbers');
  { const t = await txt('.cen-t1tab'); check(t.includes('106') && t.includes('2,656'), 'centrifuge: rpm table (1000 rpm = 106 g, 5000 rpm = 2,656 g at 9.5 cm)'); }
  { const t = await txt('.cen-t2tab'); check(t.includes('3,068'), 'centrifuge: g table (1000 g = 3,068 rpm at 9.5 cm)'); }
  await page.selectOption(R + '.cen-rk', 'd'); await page.fill(R + '.cen-r', '19'); await page.fill(R + '.cen-rpm', '13000'); await page.waitForTimeout(300);
  check((await txt('.cen-big')) === '13,000 rpm = 17,953 × g at 9.5 cm' && (await txt('.cen-rl')) === 'Diameter', 'centrifuge: diameter 19 cm is a radius of 9.5 cm');
  await page.fill(R + '.cen-r', '0'); await page.waitForTimeout(300);
  check((await txt('.cen-err')).includes('Enter the rotor radius') && await page.isHidden(R + '.cen-sfig'), 'centrifuge: zero radius message hides the chart');
};
