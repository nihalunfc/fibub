// #1413 Galvanometer to ammeter and voltmeter
export const path = '/learn/galvanometer-conversion/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/galvanometer-conversion/`); await page.waitForTimeout(600);
  const R = '.gvm ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.gvm-big')) === 'Shunt S = 25 mΩ in parallel', `galv: ammeter example (${await txt('.gvm-big')})`);
  const f = await txt('.gvm-facts');
  check(f.includes('500 µA') && f.includes('50% of full scale') && f.includes('Reading1 A'), `galv: ammeter facts (${f})`);
  check((await txt('.gvm-formula')) === 'S = Ig G / (I₀ − Ig) = 0.00100 × 50 / (2 − 0.00100) = 25 mΩ', `galv: formula (${await txt('.gvm-formula')})`);
  const inked = () => page.$eval(R + '.gvm-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 600, 'galv: meter drawn');
  await page.selectOption(R + '.gvm-ra', '10'); check((await txt('.gvm-big')) === 'Shunt S = 5 mΩ in parallel', `galv: 10 A range (${await txt('.gvm-big')})`);
  await page.selectOption(R + '.gvm-ra', '0.01'); check((await txt('.gvm-big')) === 'Shunt S = 5.56 Ω in parallel', `galv: 10 mA range (${await txt('.gvm-big')})`);
  await setR('.gvm-i', 10); check(!(await page.isHidden(R + '.gvm-err')) && (await txt('.gvm-err')).includes('bigger range'), 'galv: range below Ig refused');
  await setR('.gvm-i', 1); await page.selectOption(R + '.gvm-ra', '2');
  await setR('.gvm-t', 110); check((await txt('.gvm-facts')).includes('off the scale!'), 'galv: over range');
  await setR('.gvm-t', 50);
  await page.click(R + '.gvm-mode button[data-v=V]'); await page.waitForTimeout(100);
  check((await txt('.gvm-big')) === 'Series resistance R = 9.95 kΩ' && (await txt('.gvm-facts')).includes('10 kΩ') && (await txt('.gvm-facts')).includes('1 kΩ'), `galv: voltmeter (${await txt('.gvm-big')} ${await txt('.gvm-facts')})`);
  check(await page.isHidden(R + '.gvm-ra') && (await txt('.gvm-tv')).startsWith('5 V'), 'galv: voltmeter controls');
  await page.selectOption(R + '.gvm-rv', '300'); check((await txt('.gvm-big')) === 'Series resistance R = 300 kΩ', `galv: 300 V (${await txt('.gvm-big')})`);
  await setR('.gvm-g', 200); await setR('.gvm-i', 10); await page.selectOption(R + '.gvm-rv', '1');
  check((await txt('.gvm-err')).includes('Ig × G = 2 V'), `galv: voltmeter range too small (${await txt('.gvm-err')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'galv: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [G, Ig, I0] = q1.match(/coil of (\d+) Ω .*? at (\d+) mA.*?up to (\d+) A/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((Ig / 1000 * G) / (I0 - Ig / 1000))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'galv: right answer accepted');
};
