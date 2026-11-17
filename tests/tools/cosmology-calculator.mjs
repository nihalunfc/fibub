// T41 cosmology calculator (usefulness upgrade)
export const path = '/science/cosmology-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/cosmology-calculator/`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.cz details').forEach((d) => (d.open = true)));
  const big = () => page.textContent('.cz .cz-big'), facts = () => page.textContent('.cz .cz-facts');
  check((await big()) === 'Light left 11.643 billion years ago', 'cosmology: z = 3 Planck lookback');
  check((await facts()).includes('6,504 Mpc (21.21 billion light years)'), 'cosmology: comoving distance in Mpc');
  // units
  await page.selectOption('.cz .cz-unit', 'gly'); await page.waitForTimeout(150);
  check((await facts()).includes('21.212 billion light years') && !(await facts()).includes('Mpc ('), 'cosmology: billion light years unit');
  await page.selectOption('.cz .cz-unit', 'gpc'); await page.waitForTimeout(150);
  check((await facts()).includes('6.5036 Gpc'), 'cosmology: Gpc unit');
  await page.selectOption('.cz .cz-unit', 'mpc');
  // table
  const tab = await page.textContent('.cz .cz-tab');
  check(tab.includes('7.935') && tab.includes('8.231') && tab.includes('1100'), 'cosmology: common redshift table z = 1 row');
  // solve from lookback time
  await page.selectOption('.cz .cz-from', 'lookback'); await page.fill('.cz .cz-z', '11.6426'); await page.waitForTimeout(200);
  check((await big()).startsWith('Redshift z = 2.9999') || (await big()).startsWith('Redshift z = 3'), 'cosmology: redshift from lookback time');
  // from age then: 3 Gyr -> z = 2.186
  await page.selectOption('.cz .cz-from', 'age'); await page.fill('.cz .cz-z', '3'); await page.waitForTimeout(200);
  check((await big()).startsWith('Redshift z = 2.1858'), 'cosmology: redshift from age');
  await page.fill('.cz .cz-z', '20'); await page.waitForTimeout(200);
  check((await page.textContent('.cz .cz-err')).includes('only 13.786 billion years old') && await page.isHidden('.cz .cz-out'), 'cosmology: age older than the universe');
  // from comoving distance 6504 Mpc -> z = 3.0004
  await page.selectOption('.cz .cz-from', 'dc'); await page.fill('.cz .cz-z', '6504'); await page.waitForTimeout(200);
  check((await big()).startsWith('Redshift z = 3.0003'), 'cosmology: redshift from comoving distance');
  await page.selectOption('.cz .cz-from', 'z'); await page.fill('.cz .cz-z', '3'); await page.waitForTimeout(200);
  // angular size: 10 kpc at z=3 -> 1.269 arcsec; 2 arcsec -> 15.77 kpc
  await page.fill('.cz .cz-kpc', '10'); await page.waitForTimeout(150);
  check((await page.textContent('.cz .cz-ang')).includes('1.269 arcseconds'), 'cosmology: angular size from kpc');
  await page.fill('.cz .cz-arc', '2'); await page.waitForTimeout(150);
  check((await page.textContent('.cz .cz-ang')).includes('15.77 kpc') && (await page.inputValue('.cz .cz-kpc')) === '', 'cosmology: size from arcseconds');
  check((await page.textContent('.cz .cz-work')).includes('Hubble distance c/H0 = 4430.9 Mpc'), 'cosmology: working shows Hubble distance');
  // blank / negative input
  await page.fill('.cz .cz-z', '-1'); await page.waitForTimeout(150);
  check((await page.textContent('.cz .cz-err')).includes('0 or more') && await page.isHidden('.cz .cz-out'), 'cosmology: negative redshift message');
  await page.fill('.cz .cz-z', ''); await page.waitForTimeout(150);
  check(await page.isHidden('.cz .cz-out') && !(await page.textContent('.cz .cz-err')).includes('NaN'), 'cosmology: blank gives a message');
};
