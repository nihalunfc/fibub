// #1362 Bond enthalpy estimator (maths in tests/sci-tools/bond-enthalpy.mjs)
export const path = '/learn/bond-enthalpy/';
export default async ({ page, check, BASE }) => {
  const R = '.bex ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/bond-enthalpy/`); await page.waitForTimeout(500);
  check((await t('.be-big')) === 'ΔH ≈ −802 kJ/mol: exothermic (gives out heat)', `bond: methane (${await t('.be-big')})`);
  check((await t('.be-eq')).includes('(4 × 413 + 2 × 498) − (2 × 799 + 4 × 463) = 2648 − 3450 = −802'), `bond: working (${await t('.be-eq')})`);
  check((await page.$$eval(R + '.be-tab tbody tr:not([hidden])', (e) => e.length)) === 4, 'bond: only bonds in use listed');
  const px = await page.evaluate(() => { const c = document.querySelector('.be-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 140 && d[i + 1] < 80 && d[i + 2] < 80) n++; return n; });
  check(px > 30, `bond: red bonds-broken arrow drawn (${px} px)`);
  await page.selectOption(R + '.be-rx', 'hbr'); check((await t('.be-big')).startsWith('ΔH ≈ 103 kJ/mol: endothermic'), `bond: HBr endothermic (${await t('.be-big')})`);
  await page.selectOption(R + '.be-rx', 'hcl'); check((await t('.be-big')).startsWith('ΔH ≈ −183'), 'bond: HCl');
  await page.fill(R + 'tr[data-b=HCl] .be-kj', '432'); check((await t('.be-big')).startsWith('ΔH ≈ −185') && (await page.$eval(R + '.be-rx', (e) => e.value)) === 'hcl', 'bond: edited value keeps reaction');
  await page.click(R + '.be-reset'); check((await t('.be-big')).startsWith('ΔH ≈ −183'), 'bond: reset values');
  await page.check(R + '.be-all'); check((await page.$$eval(R + '.be-tab tbody tr:not([hidden])', (e) => e.length)) === 17, 'bond: show every bond');
  await page.fill(R + 'tr[data-b=CH] .be-br', '2'); check((await page.$eval(R + '.be-rx', (e) => e.value)) === 'own' && (await t('.be-big')).startsWith('ΔH ≈ 643'), `bond: own counts (${await t('.be-big')})`);
  await page.fill(R + 'tr[data-b=CH] .be-br', '1.5'); check(await page.isVisible(R + '.be-err'), 'bond: bad count message');
  await page.fill(R + 'tr[data-b=CH] .be-br', '0'); check(await page.isHidden(R + '.be-err'), 'bond: message clears');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'bond: three quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const m = q1.match(/H–H = (\d+), X–X = (\d+) and H–X = (\d+)/);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(+m[1] + +m[2] - 2 * +m[3])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'bond: quiz answer');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/bond-enthalpy/`); await page.waitForTimeout(600);
  {
  const S = '.bex-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  await pre(0);
  check((await ans()) === 'ΔH ≈ −802 kJ/mol: exothermic (gives out heat).' && (await work()).includes('4 × 413 + 2 × 498 = 2648 kJ') && (await work()).includes('2 × 799 + 4 × 463 = 3450 kJ') && (await work()).includes('ΔH ≈ 2648 − 3450 = −802'), `bond solve: methane (${await ans()})`);
  await pre(1); check((await ans()).startsWith('ΔH ≈ −183 kJ/mol'), `bond solve: H2 + Cl2 (${await ans()})`);
  await pre(2); check((await ans()).startsWith('ΔH ≈ −182.8 kJ/mol') && (await work()).includes('× 4.184'), `bond solve: kcal energies (${await ans()})`);
  await pre(3); check((await ans()) === 'The average bond enthalpy is about 390.8 kJ/mol.' && (await work()).includes('2345 ÷ 6'), `bond solve: unknown N-H (${await ans()})`);
  await page.fill(S + '[data-k="sv-dH"]', '3000'); check((await ans()).includes('not possible'), `bond solve: negative bond energy refused (${await ans()})`);
  await pre(0); await page.fill(S + '[data-k="sv-nb"]', '4'); check((await ans()).includes('one count for each'), `bond solve: count mismatch (${await ans()})`);
  await pre(0); check((await ans()).startsWith('ΔH ≈ −802'), 'bond solve: preset again after an error');
  await page.click(S + '.sv-clear'); check((await ans()).startsWith('Fill in the bonds broken'), `bond solve: blank form is friendly (${await ans()})`);
  }
};
