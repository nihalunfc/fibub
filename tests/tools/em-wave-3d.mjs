// #1418 Electromagnetic wave in 3D
export const path = '/learn/em-wave-3d/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/em-wave-3d/`); await page.waitForTimeout(700);
  const R = '.emw ', txt = (s) => page.textContent(R + s);
  const set = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.emw-big')) === 'Radio waves: f = c/λ = 99.3 MHz' && (await txt('.emw-lv')) === '3.02 m', `emwave: example (${await txt('.emw-big')})`);
  check((await txt('.emw-text')).includes('c = 1/√(µ₀ε₀) = 3 × 10⁸ m/s') && (await txt('.emw-text')).includes('B₀ = E₀/c = 3.34 × 10⁻⁸ T') && (await txt('.emw-text')).includes('0.133 W/m²'), `emwave: text (${await txt('.emw-text')})`);
  check((await txt('.emw-facts')).includes('Period T10.1 ns') && (await txt('.emw-facts')).includes('4.43 × 10⁻¹⁰ J/m³'), 'emwave: facts');
  const snap = () => page.$eval(R + '.emw-fig', (c) => c.toDataURL());
  const a = await snap(); await page.waitForTimeout(300); const b = await snap();
  check(a !== b, 'emwave: the wave moves');
  await page.click(R + '.emw-play'); await page.waitForTimeout(100); const c1 = await snap(); await page.waitForTimeout(250);
  check(c1 === (await snap()) && (await txt('.emw-play')) === 'Play', 'emwave: pause');
  await set('.emw-e', 100); await page.waitForTimeout(60);
  check((await txt('.emw-facts')).includes('Intensity13.3 W/m²') && (await txt('.emw-text')).includes('3.34 × 10⁻⁷ T'), 'emwave: ten times E0, a hundred times I');
  await set('.emw-l', 0); await page.waitForTimeout(60);
  check((await txt('.emw-big')).startsWith('Ultraviolet: f = c/λ = 300 PHz'), `emwave: 1 nm (${await txt('.emw-big')})`);
  await set('.emw-l', 274); await page.waitForTimeout(60);
  check((await txt('.emw-big')).startsWith('Visible light'), `emwave: visible (${await txt('.emw-big')})`);
  await set('.emw-a', -45); await page.waitForTimeout(60);
  check((await txt('.emw-av')) === '-45°', 'emwave: turn the view');
  check((await page.$$(R + '.eq-q')).length === 4, 'emwave: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), E0 = Number(q1.match(/field of (\d+) V\/m/)[1]);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', `${(E0 / 3).toFixed(4)} × 10^-8`); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'emwave: right answer accepted');
};
