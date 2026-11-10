// #1403 Capacitor network reducer
export const path = '/learn/capacitor-network/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/capacitor-network/`); await page.waitForTimeout(700);
  const R = '.cnw ', txt = (s) => page.textContent(R + s);
  check((await txt('.cnw-big')) === 'Equivalent capacitance 2.67 µF', `capnet: example (${await txt('.cnw-big')})`);
  check((await txt('.cnw-qtext')).includes('Q = C V = 2.67 × 12 = 32 µC') && (await txt('.cnw-qtext')).includes('U = ½ C V² = 192 µJ'), `capnet: battery (${await txt('.cnw-qtext')})`);
  const rows = await page.$$eval(R + '.cnw-table tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.join('|') === 'C₁4328128|C₂28416|C₃624448', `capnet: table (${rows.join('|')})`);
  const inked = () => page.$eval(R + '.cnw-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 800, 'capnet: diagram drawn');
  await page.click(R + '.cnw-prev'); await page.click(R + '.cnw-prev'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Step 0 of 2' && await page.$eval(R + '.cnw-table', (t) => t.hidden), 'capnet: back to the start');
  await page.click(R + '.cnw-next'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Step 1 of 2' && (await page.textContent(R + '.cnw-steps li.cnw-now')).startsWith('C₂ and C₃ are in parallel'), 'capnet: first step');
  await page.click(R + '.cnw-next'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Equivalent capacitance 2.67 µF' && await page.$eval(R + '.cnw-next', (b) => b.disabled), 'capnet: last step');
  await page.selectOption(R + '.cnw-c3', '2'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Equivalent capacitance 2 µF', `capnet: change a capacitor (${await txt('.cnw-big')})`);
  await page.selectOption(R + '.cnw-preset', 'lad'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Step 0 of 3' && (await page.$$(R + '.cnw-caps select')).length === 4, 'capnet: ladder opens at step 0');
  await page.click(R + '.cnw-allb'); await page.waitForTimeout(80);
  check((await txt('.cnw-big')) === 'Equivalent capacitance 2 µF' && (await page.$$eval(R + '.cnw-steps li', (l) => l.length)) === 3, `capnet: ladder solved (${await txt('.cnw-big')})`);
  await page.$eval(R + '.cnw-v', (e) => { e.value = '6'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(80);
  check((await txt('.cnw-qtext')).includes('2 × 6 = 12 µC'), `capnet: battery slider (${await txt('.cnw-qtext')})`);
  for (const [v, want] of [['s2', '1.2'], ['p2', '5'], ['s3', '1'], ['pp', '2']]) { await page.selectOption(R + '.cnw-preset', v); await page.click(R + '.cnw-allb'); check((await txt('.cnw-big')) === `Equivalent capacitance ${want} µF`, `capnet: ${v} (${await txt('.cnw-big')})`); }
  check((await page.$$(R + '.eq-q')).length === 4, 'capnet: four practice questions');
  const q2 = await page.textContent(R + '.eq-q:nth-child(2) p'), n = q2.match(/(\d+) µF, (\d+) µF and (\d+) µF/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', String(n[0] + n[1] + n[2])); await page.click(R + '.eq-q:nth-child(2) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Right'), 'capnet: right answer accepted');
};
