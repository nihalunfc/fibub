// #1780 EV vs petrol
export const path = '/money/ev-vs-petrol/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/ev-vs-petrol/`); await page.waitForTimeout(400);
  const R = '.ev ', big = () => page.textContent(R + '.ev-big');
  check((await big()) === 'Electric costs least: 46,778 over 8 years', `ev: default totals (${await big()})`);
  check((await page.textContent(R + '.ev-say')).includes('about 4.9 years'), 'ev: break-even about 4.9 years');
  check((await page.textContent(R + '.ev-out')).includes('51,000'), 'ev: hybrid total 51,000');
  await page.uncheck(R + '[data-k="hyOn"]'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.ev-out')).includes('Hybrid'), 'ev: hybrid column can be switched off');
  await page.fill(R + '[data-k="fuel"]', '0.10'); await page.waitForTimeout(100);
  check((await big()).startsWith('Petrol costs least'), `ev: cheap petrol flips the winner (${await big()})`);
  check((await page.textContent(R + '.ev-say')).includes('never earns back'), 'ev: never breaks even when petrol is cheaper to run');
};
