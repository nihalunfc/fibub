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

  // "Solve my numbers" card helpers
  const sv = (ns, root = '') => ({
    ans: () => page.textContent(`${root}[data-k="${ns}-answer"]`),
    work: () => page.textContent(`${root}[data-k="${ns}-working"]`),
    find: (v) => page.selectOption(`${root}[data-k="${ns}-find"]`, v),
    ex: (i) => page.selectOption(`${root}[data-k="${ns}-example"]`, String(i)),
    ch: (k, v) => page.selectOption(`${root}[data-k="${ns}-${k}"]`, v),
    set: async (k, v, u) => { await page.fill(`${root}[data-k="${ns}-${k}"]`, v); if (u) await page.selectOption(`${root}[data-k="${ns}-${k}-unit"]`, u); },
    clear: () => page.click(`${root}.sv-clear`),
  });
  {
    const s = sv('cp');
    await page.locator('[data-k="cp-answer"]').scrollIntoViewIfNeeded();
    check((await s.ans()) === 'The equivalent capacitance is 2 µF.', `cap solve: series (${await s.ans()})`);
    check((await s.work()).includes('1/C = 1/6 + 1/3 = 0.5 per µF') && (await s.work()).includes('C₁ = 6 µF: Q = 24 µC, V = 4 V, U = 48 µJ'), `cap solve: working with battery (${await s.work()})`);
    await s.ex(1); check((await s.ans()) === 'The equivalent capacitance is 5 µF.', `cap solve: parallel (${await s.ans()})`);
    await s.ex(2); check((await s.ans()) === 'The equivalent capacitance is 2.67 µF.' && (await s.work()).includes('C₁ = 4 µF: Q = 32 µC, V = 8 V, U = 128 µJ') && (await s.work()).includes('Q = C V = 32 µC, energy U = ½ C V² = 192 µJ'), `cap solve: series with a parallel pair (${await s.ans()})`);
    await s.ex(3); check((await s.ans()) === 'The equivalent capacitance is 4 µF.', `cap solve: parallel with a series pair (${await s.ans()})`);
    await s.ex(4); check((await s.ans()) === 'The unknown capacitor is C₁ = 6 µF.', `cap solve: unknown C1 (${await s.ans()})`);
    // Units: two 100 nF in series = 50 nF
    await s.find('ceq'); await s.ch('how', 'series'); await s.clear(); await s.set('C1', '100', 'nF'); await s.set('C2', '100', 'nF');
    check((await s.ans()) === 'The equivalent capacitance is 50 nF.', `cap solve: nF (${await s.ans()})`);
    // Three in series, 2 + 3 + 6 uF -> 1 uF
    await s.set('C1', '2', 'µF'); await s.set('C2', '3', 'µF'); await s.set('C3', '6', 'µF');
    check((await s.ans()) === 'The equivalent capacitance is 1 µF.', `cap solve: three in series (${await s.ans()})`);
    // Mixed units: 1 uF and 500 nF in parallel = 1.5 uF
    await s.ch('how', 'parallel'); await s.set('C3', ''); await s.set('C1', '1', 'µF'); await s.set('C2', '500', 'nF');
    check((await s.ans()) === 'The equivalent capacitance is 1.5 µF.' && (await s.work()).includes('Work in µF'), `cap solve: mixed units (${await s.ans()})`);
    await s.ch('how', 'sp'); check((await s.ans()).includes('needs C₃'), `cap solve: mixed group needs C3 (${await s.ans()})`);
    await s.find('C1'); await s.ch('how', 'parallel'); await s.clear(); await s.set('C2', '5', 'µF'); await s.set('Ct', '3', 'µF');
    check((await s.ans()).includes('smaller than the other capacitors'), `cap solve: impossible total (${await s.ans()})`);
    await s.set('C2', '0', 'µF'); check((await s.ans()).includes('must be above zero'), 'cap solve: zero capacitor');
    await s.clear(); check((await s.ans()).startsWith('Fill in'), 'cap solve: blank asks for numbers');
    check(!/NaN|Infinity/.test(await page.textContent('.cnw-solve')), 'cap solve: never NaN or Infinity');
  }
};
