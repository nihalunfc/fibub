// #T861 Oven temperature
export const path = '/everyday/oven-temperature/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/oven-temperature/`); await page.waitForTimeout(300);
  const R = '.ov ';
  const conv = () => page.textContent(R + '.ov-conv'), fan = () => page.textContent(R + '.ov-fan');
  check((await conv()) === '180 °C · 356 °F · gas 4', `oven: 180 C = 356 F, gas 4 (${await conv()})`);
  check((await fan()).startsWith('160 °C'), `oven: 180 C conventional = 160 C fan (${await fan()})`);
  await page.selectOption(R + '.ov-unit', 'F'); await page.fill(R + '.ov-val', '425'); await page.waitForTimeout(100);
  check((await conv()) === '218 °C · 425 °F · gas 7', `oven: 425 F = 218 C, gas 7 (${await conv()})`);
  await page.selectOption(R + '.ov-unit', 'gas'); await page.fill(R + '.ov-val', '1/2'); await page.waitForTimeout(100);
  check((await conv()).startsWith('120 °C'), `oven: gas 1/2 = 120 C (${await conv()})`);
  await page.click(R + '.ov-reset'); await page.selectOption(R + '.ov-kind', 'fan'); await page.fill(R + '.ov-dc', '15'); await page.waitForTimeout(100);
  check((await conv()).startsWith('195 °C') && (await fan()).startsWith('180 °C'), `oven: fan recipe 180 with 15 drop -> 195 conventional (${await conv()})`);
};
