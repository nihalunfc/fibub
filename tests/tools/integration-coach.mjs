// #1471 integration technique coach (maths checked against sympy in tests/sci-tools/integration-coach.mjs)
export const path = '/learn/integration-coach/';
export default async ({ page, check, BASE }) => {
  const R = '.icc ';
  const t = (s) => page.textContent(R + s);
  const chip = (s) => page.click(`${R}.ic-chip[data-src="${s}"]`);
  await page.goto(`${BASE}/learn/integration-coach/`); await page.waitForTimeout(500);
  check((await t('.ic-method')) === 'Method: Integration by parts', `coach: x eˣ by parts (${await t('.ic-method')})`);
  { const s = await t('.ic-steps'); check(s.includes('u = x, dv = e^x dx') && s.includes('ILATE') === false, `coach: parts steps (${s})`); }
  check((await t('.ic-why')).includes('ILATE'), 'coach: ILATE reason');
  check((await t('.ic-ans')) === '∫ x·e^x dx = x·e^x − e^x + C' && (await t('.ic-check')).startsWith('Checked'), `coach: answer and check (${await t('.ic-ans')})`);
  { const f = await t('.ic-facts'); check(f.includes('F(x) + C2.2408') && f.includes('Slope of F at x6.7225') && f.includes('f(x)6.7225'), `coach: graph facts (${f})`); }
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.ic-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] < 100 && g[i + 1] < 140 && g[i + 2] > 140) n++; return n; });
  check(px > 100, `coach: F drawn in blue (${px} px)`);
  await page.$eval(R + '.ic-c', (e) => { e.value = '2'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.ic-facts')).includes('F(x) + C4.2408'), 'coach: C shifts F');
  // Substitution.
  await chip('2x cos(x^2)');
  check((await t('.ic-method')) === 'Method: Substitution' && (await t('.ic-steps')).includes('Let u = x². Then du = 2x dx.'), `coach: substitution (${await t('.ic-steps')})`);
  // Partial fractions.
  await chip('(3x + 5)/(x^2 + 3x + 2)');
  { const s = await t('.ic-steps'); check(s.includes('(x + 1)(x + 2)') && s.includes('2/(x + 1) + 1/(x + 2)'), `coach: partial fractions (${s})`); }
  check((await t('.ic-ans')).includes('2ln|x + 1| + ln|x + 2| + C'), `coach: pf answer (${await t('.ic-ans')})`);
  await chip('(x^2 + 1)/(x^2 - 1)');
  check((await t('.ic-steps')).includes('divide first'), 'coach: divide first');
  // Loop and standard.
  await chip('e^x sin(x)');
  check((await t('.ic-method')) === 'Method: Parts twice, then solve', 'coach: eˣ sin x loop');
  await chip('sin(3x + 1)');
  check((await t('.ic-why')).includes('divide by 3'), 'coach: linear inside');
  // Sum with folding parts.
  await chip('3x^2 - 4x + 1/x');
  check((await t('.ic-method')) === 'Method: Split into terms' && (await t('.ic-ans')).includes('x³ − 2x² + ln|x|'), `coach: sum (${await t('.ic-ans')})`);
  // Typed, none and bad.
  await page.fill(R + '.ic-in', 'e^(x^2)');
  check((await t('.ic-method')) === 'Method: No school method found' && await page.isHidden(R + '.ic-pic'), 'coach: no school method');
  await page.fill(R + '.ic-in', 'x ln(y)');
  check(await page.isVisible(R + '.ic-err') && (await t('.ic-err')).includes('Use only x'), 'coach: bad letter message');
  await page.fill(R + '.ic-in', 'x^2 ln(x)');
  check(await page.isHidden(R + '.ic-err') && (await t('.ic-steps')).includes('u = ln(x), dv = x² dx'), 'coach: typed x² ln x picks u = ln x');
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'coach: five quiz questions');
  await page.click(R + '.smq-q:nth-child(2) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'coach: parts question');
  await page.fill(R + '.smq-q:nth-child(4) .smq-in', '1'); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', 'coach: ∫ x eˣ from 0 to 1 = 1');
  await page.fill(R + '.smq-q:nth-child(5) .smq-in', '2'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')).startsWith('Not quite'), 'coach: wrong answer caught');
};
