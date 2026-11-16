// #T861 Oven temperature
export const path = '/everyday/oven-temperature/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/oven-temperature/`); await page.waitForTimeout(300);
  const R = '.ov ';
  const openAll = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const conv = () => page.textContent(R + '.ov-conv'), fan = () => page.textContent(R + '.ov-fan');
  check((await conv()) === '180 °C · 356 °F · gas 4', `oven: 180 C = 356 F, gas 4 (${await conv()})`);
  check((await fan()).startsWith('160 °C'), `oven: 180 C conventional = 160 C fan (${await fan()})`);
  await page.selectOption(R + '.ov-unit', 'F'); await page.fill(R + '.ov-val', '425'); await page.waitForTimeout(100);
  check((await conv()) === '218 °C · 425 °F · gas 7', `oven: 425 F = 218 C, gas 7 (${await conv()})`);
  await page.selectOption(R + '.ov-unit', 'gas'); await page.fill(R + '.ov-val', '1/2'); await page.waitForTimeout(100);
  check((await conv()).startsWith('120 °C'), `oven: gas 1/2 = 120 C (${await conv()})`);
  await page.click(R + '.ov-reset'); await openAll(); await page.selectOption(R + '.ov-kind', 'fan'); await page.fill(R + '.ov-dc', '15'); await page.waitForTimeout(100);
  check((await conv()).startsWith('195 °C') && (await fan()).startsWith('180 °C'), `oven: fan recipe 180 with 15 drop -> 195 conventional (${await conv()})`);
  // new options: dial, air fryer, presets, slider, messages
  await page.click(R + '.ov-reset'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ov-dial')) === 'Conventional 180 °C / 350 °F; fan 160 °C / 325 °F', `oven: dial setting (${await page.textContent(R + '.ov-dial')})`);
  check((await page.textContent(R + '.ov-af')).includes('160 °C / 331 °F') && (await page.textContent(R + '.ov-af')).includes('20%'), `oven: air fryer line (${await page.textContent(R + '.ov-af')})`);
  await page.click(R + '.ov-presets [data-c="220"]'); await page.waitForTimeout(100);
  check((await conv()) === '220 °C · 428 °F · gas 7', `oven: Bread preset 220 C (${await conv()})`);
  await page.evaluate(() => { const r = document.querySelector('.ov .ov-range'); r.value = '200'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ov-val')) === '200' && (await conv()) === '200 °C · 392 °F · gas 6', `oven: slider 200 C (${await conv()})`);
  await page.fill(R + '.ov-val', '-5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ov-say')).includes('below zero') && (await conv()) === '', 'oven: negative gives a message');
  await page.fill(R + '.ov-val', '5000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ov-say')).includes('Home ovens run') && !(await page.textContent(R + '.ov-say')).includes('NaN'), 'oven: huge value gives a message');
  await page.selectOption(R + '.ov-unit', 'F'); await page.click(R + '.ov-presets [data-c="240"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ov-val')) === '475', `oven: Pizza preset in F = 475 (${await page.inputValue(R + '.ov-val')})`);
};
