// #T96 Nernst calculator: new options (working, ion potential, potential to Q).
export const path = '/science/nernst-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.nst ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.nst-wk')).includes('E°cell = E°cathode − E°anode = +0.3419 V − (−0.7618 V) = +1.1037 V') && (await txt('.nst-wk')).includes('= +1.0445 V'), 'nernst: working for the Daniell cell');
  await page.click(R + '.nst-mode button[data-m=one]'); await page.waitForTimeout(300);
  check((await txt('.nst-wk')).includes('E = E° − (RT / nF) ln Q') && (await txt('.nst-wk')).includes('0.025693'), 'nernst: working for one electrode');
  check((await txt('.nst-ibig')) === 'E = −89.1 mV (inside relative to outside)', 'nernst: potassium 5 mM out, 140 mM in at 37 C (RT/F = 26.726 mV, ln(5/140) = −3.332)');
  await page.selectOption(R + '.nst-ionx', 'Na'); await page.waitForTimeout(200);
  check((await txt('.nst-ibig')).startsWith('E = +66.6 mV'), 'nernst: sodium example');
  await page.selectOption(R + '.nst-ionx', 'Cl'); await page.waitForTimeout(200);
  check((await txt('.nst-ibig')).startsWith('E = −64.1 mV') && (await page.inputValue(R + '.nst-z')) === '-1', 'nernst: chloride has charge −1');
  await page.selectOption(R + '.nst-ionx', 'Ca'); await page.waitForTimeout(200);
  check((await txt('.nst-ibig')).startsWith('E = +132.3 mV'), 'nernst: calcium example');
  await page.fill(R + '.nst-co', '0'); await page.waitForTimeout(200);
  check((await txt('.nst-ierr')).includes('above zero'), 'nernst: zero concentration message');
  check((await txt('.nst-bbig')).startsWith('Q = 123.8') && (await txt('.nst-bbig')).includes('1/Q = 0.008079'), 'nernst: Q from a measured 0.28 V (ln Q = 4.8185)');
  await page.fill(R + '.nst-bn', '2.5'); await page.waitForTimeout(200);
  check((await txt('.nst-berr')).includes('whole number'), 'nernst: bad electrons message');
  await page.fill(R + '.nst-bn', '2'); await page.fill(R + '.nst-bE', '0.3419'); await page.waitForTimeout(200);
  check((await txt('.nst-bbig')).startsWith('Q = 1 '), 'nernst: E equal to E° gives Q = 1');
};
