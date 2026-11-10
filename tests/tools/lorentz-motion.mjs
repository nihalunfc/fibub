// #1408 Charged particle in electric and magnetic fields
export const path = '/learn/lorentz-motion/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/lorentz-motion/`); await page.waitForTimeout(800);
  const R = '.lzm ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.lzm-big')) === 'Radius r = 10.4 cm, one turn in 656 ns', `lorentz: example (${await txt('.lzm-big')})`);
  check((await txt('.lzm-formula')).endsWith('= 10.4 cm') && (await txt('.lzm-facts')).includes('1.52 MHz') && (await txt('.lzm-facts')).includes('5.22 keV'), `lorentz: formula and facts (${await txt('.lzm-facts')})`);
  await page.click(R + '.lzm-play'); // pause
  const inked = () => page.$eval(R + '.lzm-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 400, 'lorentz: picture drawn');
  check((await txt('.lzm-play')) === 'Play', 'lorentz: pause');
  await setR('.lzm-v', 2); check((await txt('.lzm-big')) === 'Radius r = 20.9 cm, one turn in 656 ns' && (await txt('.lzm-vv')) === '2.0 × 10⁶ m/s', 'lorentz: double speed doubles radius, same period');
  await setR('.lzm-v', 1); await setR('.lzm-a', 60);
  check((await txt('.lzm-facts')).includes('32.8 cm') && (await txt('.lzm-av')) === '60°', `lorentz: pitch at 60° (${await txt('.lzm-facts')})`);
  await setR('.lzm-a', 0); check((await txt('.lzm-big')).startsWith('No magnetic force'), 'lorentz: along the field');
  await setR('.lzm-a', 90);
  await page.selectOption(R + '.lzm-p', 'electron'); await page.waitForTimeout(100);
  check((await txt('.lzm-big')).startsWith('Radius r = 56.9 µm'), `lorentz: electron (${await txt('.lzm-big')})`);
  await page.selectOption(R + '.lzm-p', 'proton');
  // Velocity selector.
  await page.click(R + '.lzm-mode button[data-v=eb]'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.lzm-erow') && await page.isHidden(R + '.lzm-arow'), 'lorentz: selector controls');
  check((await txt('.lzm-big')) === 'Straight through: v = E / B = 1 × 10⁶ m/s', `lorentz: selector passes (${await txt('.lzm-big')})`);
  await setR('.lzm-v', 2); check((await txt('.lzm-big')).startsWith('Bent up') && (await txt('.lzm-facts')).includes('20.9 cm'), `lorentz: too fast bends (${await txt('.lzm-big')} ${await txt('.lzm-facts')})`);
  await setR('.lzm-e', 200); check((await txt('.lzm-big')).startsWith('Straight through: v = E / B = 2 × 10⁶'), 'lorentz: E = 200 kV/m passes 2 × 10⁶');
  await page.selectOption(R + '.lzm-p', 'electron'); check((await txt('.lzm-big')).startsWith('Straight through'), 'lorentz: selector works for electrons too');
  await page.selectOption(R + '.lzm-p', 'proton');
  // Cyclotron.
  await page.click(R + '.lzm-mode button[data-v=cy]'); await page.waitForTimeout(300);
  check((await txt('.lzm-big')) === 'Leaves with 12 MeV after about 120 turns' && (await txt('.lzm-facts')).includes('15.2 MHz') && (await txt('.lzm-facts')).includes('240'), `lorentz: cyclotron (${await txt('.lzm-big')})`);
  check(await page.isHidden(R + '.lzm-vrow'), 'lorentz: no speed slider in the cyclotron');
  await setR('.lzm-r', 1); check((await txt('.lzm-big')).startsWith('Leaves with 47.9 MeV'), `lorentz: bigger dees (${await txt('.lzm-big')})`);
  await page.selectOption(R + '.lzm-p', 'electron'); check((await txt('.lzm-big')).startsWith('Impossible'), 'lorentz: electron cyclotron warning');
  await page.click(R + '.lzm-again'); await page.waitForTimeout(200);
  check((await inked()) > 200, 'lorentz: start again draws');
  check((await page.$$(R + '.eq-q')).length === 4, 'lorentz: four practice questions');
  const q3 = await page.textContent(R + '.eq-q:nth-child(3) p'), E = Number(q3.match(/field of ([\d.]+) kV\/m/)[1]), B = Number(q3.match(/magnetic field of ([\d.]+) T/)[1]);
  await page.fill(R + '.eq-q:nth-child(3) .eq-in', String(E / B)); await page.click(R + '.eq-q:nth-child(3) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(3) .eq-res')).startsWith('Right'), 'lorentz: right answer accepted');
};
