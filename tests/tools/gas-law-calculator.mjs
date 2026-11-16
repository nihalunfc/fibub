// #T83 gas law calculator
export const path = '/science/gas-law-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.gas ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/gas-law-calculator/`); await page.waitForTimeout(500);
  check((await t('.gas-big')) === 'Volume: 22.414 L', 'gas: example result');
  check((await t('.gas-work')) === 'V = nRT / P = 1 × 8.3145 × 273.15 / 101325 = 0.022414 m³', `gas: working line (${await t('.gas-work')})`);
  await page.click(R + '.gas-find button[data-f="P"]'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.gas-V')) === '22.41397' && (await page.inputValue(R + '.gas-P')) === '', 'gas: Find pressure moves the empty box');
  check(/^Pressure: 101\.3[23] kPa$/.test(await t('.gas-big')) && (await t('.gas-work')).startsWith('P = nRT / V = 1 × 8.3145 × 273.15 / 0.022414 = 1013'), `gas: pressure back from the volume (${await t('.gas-big')}, ${await t('.gas-work')})`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.click(R + '.gas-cond button[data-c="satp"]'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.gas-P')) === '100' && (await page.inputValue(R + '.gas-T')) === '25' && /^Volume: 24\.79\d* L$/.test(await t('.gas-big')), `gas: SATP chip (${await t('.gas-big')})`);
  await page.selectOption(R + '.gas-Pu', 'atm'); await page.click(R + '.gas-cond button[data-c="stp-atm"]'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.gas-P')) === '1' && (await t('.gas-big')) === 'Volume: 22.414 L', 'gas: STP chip in atm');
  await page.fill(R + '.gas-n', '0'); await page.waitForTimeout(150);
  check((await t('.gas-err')).includes('above zero') && !(await page.textContent('main')).includes('NaN'), 'gas: zero amount message');
};
