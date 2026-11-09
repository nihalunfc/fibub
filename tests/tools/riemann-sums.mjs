// #1182 Riemann sums to integral (maths checked against NumPy and SciPy in tests/sci-tools/riemann-sums.mjs)
export const path = '/learn/riemann-sums/';
export default async ({ page, check, BASE }) => {
  const R = '.rms ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/riemann-sums/`); await page.waitForTimeout(500);
  { const f = await t('.rs-facts'); check(f.includes('Left sum1.75') && f.includes('2.66667') && f.includes('[x³/3]'), `riemann: example left sum (${f})`); }
  check((await t('.rs-formula')).includes('Δx = (b − a)/n = (2 − 0)/4 = 0.5'), 'riemann: Δx formula');
  const px = await page.evaluate(() => { const c = document.querySelector('.rs-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 40) n++; return n; });
  check(px > 800, `riemann: strips shaded (${px} px)`);
  for (const [k, v] of [['right', '3.75'], ['mid', '2.625'], ['trap', '2.75']]) { await page.click(R + `.rs-meth button[data-k="${k}"]`); check((await t('.rs-facts')).includes('sum' + v), `riemann: ${k} sum ${v}`); }
  await page.click(R + '.rs-meth button[data-k="left"]'); await slide('.rs-n', 100);
  check((await t('.rs-facts')).includes('Left sum2.6268') && (await t('.rs-nv')) === '100', 'riemann: n = 100');
  { const tb = await t('.rs-tab tbody'); check(tb.includes('2.625') && tb.includes('3.75') && tb.includes('2.75'), `riemann: table (${tb.slice(0, 80)})`); }
  await page.selectOption(R + '.rs-fn', 'sin');
  check((await page.inputValue(R + '.rs-a')) === '0' && (await t('.rs-facts')).includes('−cos x'), 'riemann: sin preset sets the interval');
  await page.fill(R + '.rs-b', '-1'); await page.waitForTimeout(50);
  check((await t('.rs-err')).includes('bigger than the start'), 'riemann: b < a message');
  await page.fill(R + '.rs-b', 'x'); await page.waitForTimeout(50);
  check((await t('.rs-err')).includes('as numbers'), 'riemann: not a number message');
  await page.selectOption(R + '.rs-fn', 'own'); await page.fill(R + '.rs-own', 'sin(x)/x'); await page.fill(R + '.rs-a', '0.5'); await page.fill(R + '.rs-b', '3'); await page.waitForTimeout(50);
  check((await t('.rs-facts')).includes('1.35555') && (await t('.rs-facts')).includes('Simpson'), `riemann: own function by Simpson (${await t('.rs-facts')})`);
  // Antiderivative family.
  await page.click(R + '.rs-mode button[data-m="anti"]'); await page.selectOption(R + '.rs-fn', 'x2');
  await page.click(R + '.rs-mode button[data-m="anti"]');
  await slide('.rs-x', 1.5); await slide('.rs-c', 2);
  { const f = await t('.rs-facts'); check(f.includes('Slope of every curve at x = 1.52.25') && f.includes('slope of F + C2.25') && f.includes('3.125'), `riemann: antiderivative family (${f})`); }
  check((await t('.rs-formula')).includes('x³/3 + C. Here C = 2'), 'riemann: + C formula');
  check(await page.isHidden(R + '.rs-tabc') && await page.isHidden(R + '.rs-a'), 'riemann: family view hides the sum parts');
  // Area between curves.
  await page.click(R + '.rs-mode button[data-m="area"]'); await page.waitForTimeout(50);
  { const f = await t('.rs-facts'); check(f.includes('Area between the curves11.68213') && (await page.inputValue(R + '.rs-a')) === '-2.5616', `riemann: area between 4 − x² and x (${f})`); }
  await page.fill(R + '.rs-g', '2'); await page.fill(R + '.rs-own', 'x^2'); await page.waitForTimeout(50);
  await page.check(R + '.rs-cross'); await page.waitForTimeout(50);
  check((await t('.rs-facts')).includes('3.77124'), `riemann: x² and 2 (8√2/3) (${await t('.rs-facts')})`);
  await page.fill(R + '.rs-g', 'x^2 + 5'); await page.check(R + '.rs-cross'); await page.waitForTimeout(50);
  check((await t('.rs-err')).includes('fewer than twice'), 'riemann: curves that never cross');
  await page.fill(R + '.rs-g', 'x^2 + 5 + q'); await page.waitForTimeout(50);
  check((await t('.rs-err')).includes('Second curve'), 'riemann: bad second curve');
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'riemann: five quiz questions');
  const qtext = await t('.smq-q:nth-child(3) .smq-text'); const K = +qtext.match(/0 to (\d)/)[1];
  await page.fill(R + '.smq-q:nth-child(3) .smq-in', `${K ** 3}/3`); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'riemann: fraction answer accepted');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')).startsWith('Not quite'), 'riemann: wrong choice caught');
};
