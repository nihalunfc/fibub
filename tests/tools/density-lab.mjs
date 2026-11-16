// #L342 Density lab
export const path = '/learn/density-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/density-lab/`); await page.waitForTimeout(1000);
  const o = page.locator('.dl .dl-out');
  await page.selectOption('.dl .dl-obj', 'aluminium');
  check(Math.abs(+(await o.getAttribute('data-rho')) - 2.7) < 0.01 && Math.abs(+(await o.getAttribute('data-rhosi')) - 2700) < 15, 'density-lab: aluminium block measures 2.7 g/cm3 = 2700 kg/m3');
  check((await o.getAttribute('data-floats')) === 'false', 'density-lab: aluminium sinks in water');
  await page.selectOption('.dl .dl-obj', 'pine');
  check((await o.getAttribute('data-floats')) === 'true', 'density-lab: pine floats in water');
  await page.click('.dl [data-m=stone]');
  check((await o.getAttribute('data-rho')) === '', 'density-lab: stone shows no density until fully lowered');
  await page.fill('.dl .dl-low', '100'); await page.dispatchEvent('.dl .dl-low', 'input');
  check(Math.abs(+(await o.getAttribute('data-rho')) - +(await o.getAttribute('data-true'))) < 0.1, 'density-lab: displacement gives about the true density');
  await page.click('.dl [data-m=liquid]');
  await page.selectOption('.dl .dl-liq', 'syrup');
  check(Math.abs(+(await o.getAttribute('data-rho')) - 1.38) < 0.01, 'density-lab: syrup measures 1.38 g/cm3');
  { const a = await page.getAttribute('.dl .lq-item', 'data-ans'); await page.fill('.dl .lq-in', a); await page.click('.dl .lq-check');
    check((await page.textContent('.dl .lq-fb')) === 'Right.', 'density-lab: quiz accepts the right answer'); }
};
