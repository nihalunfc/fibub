// #1467 derivative calculator with steps (maths checked against sympy in tests/sci-tools/derivative-steps.mjs)
export const path = '/learn/derivative-steps/';
export default async ({ page, check, BASE }) => {
  const R = '.dst ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/derivative-steps/`); await page.waitForTimeout(500);
  check((await t('.dt-d')) === 'f′(x) = x²·cos(x) + 2x·sin(x)', `steps: default answer (${await t('.dt-d')})`);
  { const s = await t('.dt-steps'); check(s.includes('Power rule') && s.includes('Product rule') && s.includes('u = x², v = sin(x)'), `steps: product rule steps (${s})`); }
  { const f = await t('.dt-facts'); check(f.includes('f′(a), the slope2.2232') && f.includes('y = 2.223x − 1.382'), `steps: worked example facts (${f})`); }
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.dt-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] > 150 && g[i + 1] > 70 && g[i + 1] < 140 && g[i + 2] < 60) n++; return n; });
  check(px > 100, `steps: f′ drawn in orange (${px} px)`);
  // Level hides Class 12 examples.
  await page.click(R + '.dt-lv button[data-lv="11"]');
  check(await page.isHidden(R + '.dt-chip[data-src="x^x"]') && await page.isVisible(R + '.dt-chip[data-src="sin(x)/x"]'), 'steps: Class 11 hides Class 12 examples');
  await page.click(R + '.dt-chip[data-src="(x + 1)/(x - 1)"]');
  check((await t('.dt-d')) === 'f′(x) = −2/(x − 1)²' && (await t('.dt-steps')).includes('Quotient rule'), `steps: quotient example (${await t('.dt-d')})`);
  await page.click(R + '.dt-lv button[data-lv="12"]');
  await page.click(R + '.dt-chip[data-src="x^x"]');
  check((await t('.dt-steps')).includes('Logarithmic differentiation') && (await t('.dt-d')).includes('ln(x) + 1'), 'steps: xˣ by logarithmic differentiation');
  await page.click(R + '.dt-chip[data-src="sin(x^2)"]');
  check((await t('.dt-steps')).includes('chain rule') && (await t('.dt-d')) === 'f′(x) = 2x·cos(x²)', 'steps: chain example');
  await page.$eval(R + '.dt-a', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.dt-facts')).includes('a flat tangent'), `steps: flat tangent at 0 (${await t('.dt-facts')})`);
  // Typed and bad input.
  await page.fill(R + '.dt-in', '3x^4 - 5x^2 + 7');
  check((await t('.dt-d')) === 'f′(x) = 12x³ − 10x' && (await t('.dt-steps')).includes('Sum rule'), 'steps: typed polynomial');
  await page.fill(R + '.dt-in', 'x + t');
  check(await page.isVisible(R + '.dt-err') && (await t('.dt-err')).includes('Use only x') && await page.isHidden(R + '.dt-out'), 'steps: bad letter message');
  await page.fill(R + '.dt-in', 'sin x');
  check((await t('.dt-err')).includes('brackets'), `steps: missing brackets message (${await t('.dt-err')})`);
  await page.fill(R + '.dt-in', '');
  check((await t('.dt-err')).includes('Type a function'), 'steps: empty message');
  await page.fill(R + '.dt-in', 'e^(sin(x))');
  check(await page.isHidden(R + '.dt-err') && (await t('.dt-d')) === 'f′(x) = e^sin(x)·cos(x)' || (await t('.dt-d')).includes('cos(x)'), `steps: e^(sin x) (${await t('.dt-d')})`);
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'steps: five quiz questions');
  const ans = await page.$eval(R + '.smq-q:nth-child(1) .smq-work p', (e) => e.textContent.match(/= (−?\d+)\.$/)[1].replace('−', '-'));
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', ans); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `steps: quiz answer accepted (${ans})`);
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', '1'); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')).startsWith('Not quite'), 'steps: wrong answer caught');
};
