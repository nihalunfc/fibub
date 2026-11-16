// #L340 I-V characteristics
export const path = '/learn/iv-characteristics/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/iv-characteristics/`); await page.waitForTimeout(300);
  const o = page.locator('.ic .ic-out');
  const setV = async (v) => { await page.fill('.ic .ic-v', String(v)); await page.dispatchEvent('.ic .ic-v', 'input'); };
  await setV(3);
  check(Math.abs(+(await o.getAttribute('data-i')) - 0.03) < 1e-6 && Math.abs(+(await o.getAttribute('data-r')) - 100) < 0.01, 'iv-characteristics: resistor at 3 V gives 30 mA and 100 ohm');
  await page.click('.ic .ic-rec');
  check((await o.getAttribute('data-n')) === '1', 'iv-characteristics: Record reading adds a point');
  await page.click('.ic .ic-sweep');
  check(+(await o.getAttribute('data-n')) >= 13, 'iv-characteristics: Record every volt adds the sweep');
  await page.selectOption('.ic .ic-comp', 'lamp'); await setV(6);
  check(Math.abs(+(await o.getAttribute('data-i')) - 0.2) < 1e-6 && Math.abs(+(await o.getAttribute('data-r')) - 30) < 0.01 && (await o.getAttribute('data-n')) === '0', 'iv-characteristics: lamp at 6 V is 0.2 A, 30 ohm, points cleared');
  await page.selectOption('.ic .ic-comp', 'diode'); await setV(-6);
  check(Math.abs(+(await o.getAttribute('data-i'))) < 1e-8, 'iv-characteristics: diode reverse current is tiny');
  await setV(0.7);
  check(+(await o.getAttribute('data-i')) > 1e-3, 'iv-characteristics: diode conducts at 0.7 V');
  { const a = await page.getAttribute('.ic .lq-item', 'data-ans'); await page.fill('.ic .lq-in', a); await page.click('.ic .lq-check');
    check((await page.textContent('.ic .lq-fb')) === 'Right.', 'iv-characteristics: quiz accepts the right answer'); }
};
