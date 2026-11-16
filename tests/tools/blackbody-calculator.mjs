// #T blackbody calculator: new options (slider, radiance at a wavelength, band power, working).
export const path = '/science/blackbody-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.bb ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.bb-big')) === 'Peak at 502 nm; it looks white with a hint of yellow', 'blackbody: Sun still works');
  await page.fill(R + '.bb-lam', '550'); await page.waitForTimeout(300);
  check((await txt('.bb-facts')).includes('Spectral radiance at 550 nm2.573 × 10^13 W m⁻² sr⁻¹ m⁻¹'), 'blackbody: Planck radiance of the Sun at 550 nm (2.573e13)');
  await page.fill(R + '.bb-b1', '400'); await page.fill(R + '.bb-b2', '700'); await page.waitForTimeout(300);
  check((await txt('.bb-facts')).includes('36.64 % of the total') && (await txt('.bb-facts')).includes('2.306 × 10^7 W/m²'), 'blackbody: visible band is 36.64 % of the Sun power');
  await page.fill(R + '.bb-b2', '300'); await page.waitForTimeout(300);
  check((await txt('.bb-err')).includes('shorter to a longer'), 'blackbody: reversed band message');
  await page.fill(R + '.bb-b2', '700'); await page.fill(R + '.bb-lam', '-5'); await page.waitForTimeout(300);
  check((await txt('.bb-err')).includes('above zero'), 'blackbody: negative wavelength message');
  await page.fill(R + '.bb-lam', '');
  check((await txt('.bb-wk')).includes('Wien: λpeak') && (await txt('.bb-wk')).includes('Stefan-Boltzmann'), 'blackbody: working');
  await page.evaluate(() => { const r = document.querySelector('.bb-slider'); r.value = '500'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(300);
  check((await txt('.bb-title')) === 'A black body at 387 K' && (await txt('.bb-big')).startsWith('Peak at 7.488 µm'), 'blackbody: slider mid-point is 3 x (50000/3)^0.5 = 387 K');
};
