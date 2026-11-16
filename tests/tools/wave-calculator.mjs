// #139 wave calculator: wavelength, frequency and speed of any wave, plus the water-wave checks
export const path = '/science/wave-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.wvc ';
  await page.goto(`${BASE}/science/wave-calculator/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c);
  // Light at 100 MHz (FM radio): 299,792,458 / 1e8 = 2.998 m.
  check((await t('.wf-big')) === 'Wavelength 2.998 m at 100 MHz' && (await page.getAttribute(R + '.wf-big', 'aria-live')) === 'polite', `wave: FM radio (${await t('.wf-big')})`);
  { const f = await t('.wf-facts'); check(f.includes('radio waves') && f.includes('413.6 neV') && f.includes('10 ns'), `wave: radio band, photon energy and period (${f.slice(0, 120)})`); }
  check((await t('.wf-work')).includes('λ = v ÷ f = 299,792,458 m/s ÷ 100 MHz = 2.998 m'), `wave: working line (${await t('.wf-work')})`);
  check(await page.isVisible(R + '.wf-fig'), 'wave: wavelength chart');
  // Material: light in glass-like n = 1.5.
  await page.fill(R + '.wf-n', '1.5'); await page.waitForTimeout(100);
  check((await t('.wf-big')) === 'Wavelength 1.999 m at 100 MHz' && (await t('.wf-facts')).includes('divided by n = 1.5'), `wave: refractive index (${await t('.wf-big')})`);
  await page.fill(R + '.wf-n', '0.5'); await page.waitForTimeout(100);
  check((await t('.wf-err')).includes('refractive index') && await page.isHidden(R + '.wf-out'), 'wave: bad refractive index');
  await page.fill(R + '.wf-n', '1');
  // Green light: frequency from wavelength.
  await page.selectOption(R + '.wf-find', 'f'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.wf-lb') && await page.isHidden(R + '.wf-fb') && (await t('.wf-big')) === 'Frequency 545.1 THz at a wavelength of 550 nm', `wave: frequency from wavelength (${await t('.wf-big')})`);
  { const f = await t('.wf-facts'); check(f.includes('visible light, green') && f.includes('2.254 eV') && f.includes('18182 cm⁻¹'), `wave: green photon (${f})`); }
  // Sound at 20 °C: 440 Hz.
  await page.selectOption(R + '.wf-m', 'sound'); await page.selectOption(R + '.wf-find', 'lam'); await page.selectOption(R + '.wf-fu', '1'); await page.fill(R + '.wf-f', '440'); await page.waitForTimeout(100);
  check((await t('.wf-big')) === 'Wavelength 780 mm at 440 Hz' && (await t('.wf-facts')).includes('343.2 m/s') && (await t('.wf-facts')).includes('audible'), `wave: sound at 440 Hz (${await t('.wf-big')})`);
  await page.fill(R + '.wf-t', '-500'); await page.waitForTimeout(100);
  check((await t('.wf-err')).includes('air temperature'), 'wave: bad air temperature');
  await page.fill(R + '.wf-t', '0'); await page.waitForTimeout(100);
  check((await t('.wf-facts')).includes('331.3 m/s'), 'wave: sound at 0 °C');
  // Speed from frequency and wavelength.
  await page.selectOption(R + '.wf-find', 'v'); await page.fill(R + '.wf-f', '686'); await page.selectOption(R + '.wf-lu', '1'); await page.fill(R + '.wf-l', '0.5'); await page.waitForTimeout(100);
  check((await t('.wf-big')).startsWith('Speed 343 m/s') && (await t('.wf-work')).includes('v = f × λ'), `wave: speed from f and λ (${await t('.wf-big')})`);
  await page.fill(R + '.wf-l', '0'); await page.waitForTimeout(100);
  check((await t('.wf-err')).includes('wavelength'), 'wave: zero wavelength message');
  await page.fill(R + '.wf-l', '0.5');
  // Another wave with its own speed: a 1500 m/s wave at 3 kHz is 0.5 m.
  await page.selectOption(R + '.wf-find', 'lam'); await page.selectOption(R + '.wf-m', 'custom'); await page.fill(R + '.wf-v', '1500'); await page.selectOption(R + '.wf-fu', '1e3'); await page.fill(R + '.wf-f', '3'); await page.waitForTimeout(100);
  check((await t('.wf-big')) === 'Wavelength 500 mm at 3 kHz', `wave: own speed (${await t('.wf-big')})`);
  await page.fill(R + '.wf-f', '-3'); await page.waitForTimeout(100);
  check((await t('.wf-err')).includes('frequency'), 'wave: negative frequency message');
  // The water-wave part still works.
  check((await t('.wv-big')) === 'Wavelength 151.3 m, speed 15.1 m/s in 50 m of water (intermediate water)', `wave: water example (${await t('.wv-big')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'wave: PDF report'); }
};
