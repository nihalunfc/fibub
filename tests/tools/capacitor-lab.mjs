// #1047 Parallel-plate capacitor lab
export const path = '/learn/capacitor-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/capacitor-lab/`); await page.waitForTimeout(600);
  const R = '.cpl ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.cpl-big')) === 'C = 44.3 pF, Q = 266 pC, V = 6 V', `cap: example (${await txt('.cpl-big')})`);
  check((await txt('.cpl-formula')) === 'C = ε₀ A / d = 8.85 × 10⁻¹² × 0.01 m² / 0.002 m = 44.3 pF' && (await txt('.cpl-facts')).includes('797 pJ') && (await txt('.cpl-facts')).includes('3 kV/m'), `cap: formula and facts (${await txt('.cpl-formula')})`);
  const inked = () => page.$eval(R + '.cpl-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 500, 'cap: picture drawn');
  await setR('.cpl-a', 200); check((await txt('.cpl-big')).startsWith('C = 88.5 pF') && (await txt('.cpl-av')) === '200 cm²', 'cap: double area doubles C');
  await setR('.cpl-a', 100); await setR('.cpl-d', 4); check((await txt('.cpl-big')).startsWith('C = 22.1 pF') && (await txt('.cpl-dv')) === '4.0 mm', 'cap: double gap halves C');
  await setR('.cpl-d', 2);
  // Disconnect, slab in.
  await page.click(R + '.cpl-bat');
  check((await txt('.cpl-bat')) === 'Connect the battery' && await page.isDisabled(R + '.cpl-v') && (await txt('.cpl-note')).includes('266 pC'), 'cap: battery disconnected');
  await setR('.cpl-x', 100); await page.waitForTimeout(100);
  check((await txt('.cpl-big')) === 'C = 177 pF, Q = 266 pC, V = 1.50 V' && (await txt('.cpl-facts')).includes('199 pJ') && (await txt('.cpl-xv')) === '100%', `cap: slab in with the battery off (${await txt('.cpl-big')})`);
  check((await txt('.cpl-formula')).includes('(0 + 4 × 1)'), `cap: slab formula (${await txt('.cpl-formula')})`);
  await page.click(R + '.cpl-bat');
  check((await txt('.cpl-big')) === 'C = 177 pF, Q = 1.06 nC, V = 6 V' && (await txt('.cpl-facts')).includes('3.19 nJ'), `cap: reconnected (${await txt('.cpl-big')})`);
  await setR('.cpl-x', 50); await setR('.cpl-k', 3);
  check((await txt('.cpl-big')).startsWith('C = 88.5 pF') && (await txt('.cpl-kv')) === '3.0', 'cap: half a K = 3 slab doubles C');
  await setR('.cpl-v', 12); check((await txt('.cpl-big')).endsWith('V = 12 V') && (await txt('.cpl-vv')) === '12.0 V', 'cap: battery slider');
  await page.click(R + '.cpl-reset'); check((await txt('.cpl-big')) === 'C = 44.3 pF, Q = 266 pC, V = 6 V', 'cap: start again');
  // Combination.
  const tab = await txt('.cpl-tab');
  check(tab.includes('Series3 µF36 µC each9 V + 3 V216 µJ') && tab.includes('Parallel16 µF48 + 144 µC12 V each1152 µJ'), `cap: series and parallel (${tab})`);
  await page.fill(R + '.cpl-c2', '0'); await page.waitForTimeout(100);
  check((await txt('.cpl-err')).includes('both capacitances') && await page.isHidden(R + '.cpl-tab'), 'cap: bad capacitance message');
  await page.fill(R + '.cpl-c2', '12'); await page.fill(R + '.cpl-cv', 'x'); await page.waitForTimeout(100);
  check((await txt('.cpl-err')).includes('battery voltage'), 'cap: bad voltage message');
  await page.fill(R + '.cpl-cv', '12');
  check((await page.$$(R + '.eq-q')).length === 4, 'cap: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [A, d] = q1.match(/area ([\d.]+) cm² are ([\d.]+) mm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((8.854e-12 * A * 1e-4) / (d * 1e-3) * 1e12)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'cap: right answer accepted');
};
