// #T redshift calculator: new options (slider, cosmology choice, more distances, wavelength converter, plain sentence).
export const path = '/science/redshift-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.rz ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.rz-big')) === 'z = 0.05', 'redshift: example z = 0.05');
  { const f = await txt('.rz-facts'); check(f.includes('Luminosity distance230 Mpc') && f.includes('1 arcsecond across is 1.01 kpc') && f.includes('13.095 billion years'), 'redshift: luminosity distance, scale and age at z = 0.05 (Planck 2018)'); }
  check((await txt('.rz-plain')).includes('219 Mpc away today') && (await txt('.rz-plain')).includes('697 million years ago'), 'redshift: plain sentence');
  await page.selectOption(R + '.rz-cos', 'round'); await page.waitForTimeout(300);
  { const f = await txt('.rz-facts'); check(f.includes('Luminosity distance222 Mpc') && f.includes('12.793 billion years'), 'redshift: round-number cosmology (H0 70, Om 0.3)'); }
  await page.selectOption(R + '.rz-cos', 'planck18');
  await page.fill(R + '.rz-w', '500'); await page.waitForTimeout(300);
  check((await txt('.rz-wout')) === 'A line at 500 nm at the source arrives at 525 nm.', 'redshift: rest to observed (500 x 1.05)');
  await page.selectOption(R + '.rz-wk', 'obs'); await page.waitForTimeout(300);
  check((await txt('.rz-wout')) === 'A line seen at 500 nm left the source at 476.19 nm.', 'redshift: observed to rest (500 / 1.05 = 476.19)');
  await page.fill(R + '.rz-w', '-3'); await page.waitForTimeout(300);
  check((await txt('.rz-wout')).includes('above zero'), 'redshift: bad wavelength message');
  await page.evaluate(() => { const r = document.querySelector('.rz-slider'); r.value = '500'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(300);
  check((await txt('.rz-big')) === 'z = 2.5' && (await page.inputValue(R + '.rz-v')) === '2.5', 'redshift: slider at the middle gives z = 10 x 0.5^2 = 2.5');
  await page.fill(R + '.rz-v', '-0.01'); await page.waitForTimeout(300);
  check((await txt('.rz-plain')).includes('blueshift'), 'redshift: blueshift sentence');
};
