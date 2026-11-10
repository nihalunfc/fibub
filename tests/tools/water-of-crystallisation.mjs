// #1294 Water of crystallisation
export const path = '/learn/water-of-crystallisation/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/water-of-crystallisation/`); await page.waitForSelector('.wc .wc-fig text');
  const R = '.wc ', txt = (s) => page.textContent(R + s);
  check((await txt('.wc-big')).startsWith('Empty crucible:') && await page.isDisabled(R + '.wc-heat') && (await txt('.wc-note')).includes('Blue crystals turn white'), 'hydrate: starts with an empty crucible');
  await page.click(R + '.wc-add');
  check((await txt('.wc-big')) === 'Ready to heat.' && (await page.locator(R + '.wc-tab tbody tr').count()) === 2 && (await page.locator(R + '.wc-fig .wc-xtal').count()) > 5, 'hydrate: crystals weighed');
  const c0 = Number(await page.inputValue(R + '.wc-c0')), c1 = Number(await page.inputValue(R + '.wc-c1'));
  check(Math.abs(c1 - c0 - 2.5) < 1e-9, 'hydrate: 2.50 g added');
  let n = 0;
  while (!(await txt('.wc-big')).startsWith('Constant mass') && n < 12) { await page.click(R + '.wc-heat'); await page.waitForTimeout(450); n++; }
  check((await txt('.wc-big')).startsWith('Constant mass') && n >= 3 && n <= 8, `hydrate: constant mass after ${n} heatings`);
  const x = Number(/x ≈ ([\d.]+)/.exec(await txt('.wc-x'))[1]);
  check(Math.abs(x - 5) < 0.06 && (await txt('.wc-x')).includes('CuSO₄·5H₂O'), `hydrate: x ≈ 5 (${x})`);
  check((await txt('.wc-steps')).includes('Mass of water driven off = ') && (await txt('.wc-steps')).includes('÷ 159.60'), 'hydrate: steps');
  // Own results: 25.00, 27.50, 26.60 → x = 4.98.
  await page.fill(R + '.wc-c0', '25.00'); await page.fill(R + '.wc-c1', '27.50'); await page.fill(R + '.wc-c2', '26.60');
  check((await txt('.wc-x')) === 'x ≈ 4.98, so the formula is about CuSO₄·5H₂O' && (await txt('.wc-steps')).includes('0.0500 mol'), 'hydrate: worked example 4.98');
  await page.fill(R + '.wc-c2', '28.00'); check(await page.isVisible(R + '.wc-err') && (await txt('.wc-x')) === '', 'hydrate: bad weighings message');
  await page.selectOption(R + '.wc-salt', 'cocl2');
  check((await txt('.wc-note')).includes('Pink crystals turn blue') && await page.isDisabled(R + '.wc-heat') && (await txt('.wc-steps')) === '', 'hydrate: cobalt chloride resets');
  await page.fill(R + '.wc-m', '5'); await page.click(R + '.wc-add');
  for (let i = 0; i < 8; i++) { if ((await txt('.wc-big')).startsWith('Constant')) break; await page.click(R + '.wc-heat'); await page.waitForTimeout(450); }
  check(/CoCl₂·6H₂O$/.test(await txt('.wc-x')), `hydrate: cobalt chloride x = 6 (${await txt('.wc-x')})`);
  await page.fill(R + '.wc-m', '20'); await page.click(R + '.wc-reset'); await page.click(R + '.wc-add');
  check((await txt('.wc-big')) === 'Use between 0.5 g and 10 g of crystals.', 'hydrate: sample size limits');
  check((await page.textContent('.wc table:not(.wc-tab)')).includes('249.68') && (await page.textContent('.wc table:not(.wc-tab)')).includes('36.1%'), 'hydrate: water table');
  const items = page.locator('.wc .cq-item');
  check((await items.count()) === 3, 'hydrate: three questions');
  for (let i = 0; i < 3; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `hydrate: quiz ${i + 1} (${ans})`);
  }
};
