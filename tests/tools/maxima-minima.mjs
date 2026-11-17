// #1184 maxima and minima (maths checked against sympy in tests/sci-tools/maxima-minima.mjs)
export const path = '/learn/maxima-minima/';
export default async ({ page, check, BASE }) => {
  const R = '.mmx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/maxima-minima/`); await page.waitForTimeout(500);
  { const tb = await t('.mm-tab tbody'); check(tb.includes('−12+ → −−6local maximumlocal maximum') && tb.includes('1−2− → +6local minimumlocal minimum'), `extrema: x³ − 3x table (${tb})`); }
  { const f = await t('.mm-abs'); check(f.includes('8.125') && f.includes('at x = 2.5 (an end') && f.includes('−8.125'), `extrema: absolute values (${f})`); }
  const px = await page.evaluate(() => { const c = document.querySelector('.mm-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] > g[i + 2] + 60) n++; return n; });
  check(px > 300, `extrema: f′ drawn in orange (${px} px)`);
  await slide('.mm-x', 100);
  check((await t('.mm-now')).includes('f is rising') && (await t('.mm-now')).includes('concave down'), `extrema: cursor on the left (${await t('.mm-now')})`);
  await slide('.mm-x', 500);
  check((await t('.mm-now')).includes('falling'), 'extrema: cursor in the middle');
  await page.selectOption(R + '.mm-fn', 'flat');
  check((await t('.mm-tab tbody')).includes('neither (no turn)') && (await t('.mm-tab tbody')).includes('test fails'), 'extrema: x³ neither');
  await page.selectOption(R + '.mm-fn', 'quart4');
  check((await t('.mm-tab tbody')).includes('local minimumtest fails'), 'extrema: x⁴ second test fails');
  await page.selectOption(R + '.mm-fn', 'own'); await page.waitForTimeout(50);
  { const tb = await t('.mm-tab tbody'); check(tb.includes('15') && tb.includes('31') && (await t('.mm-abs')).includes('21'), `extrema: own cubic (${tb})`); }
  await page.fill(R + '.mm-own', 'exp(x)'); await page.waitForTimeout(50);
  check(await page.isVisible(R + '.mm-none'), 'extrema: no critical points message');
  await page.fill(R + '.mm-own', 'x + y'); await page.waitForTimeout(50);
  check((await t('.mm-err')).includes('Use only x'), 'extrema: bad function message');
  await page.fill(R + '.mm-own', 'x^2'); await page.fill(R + '.mm-b', '-5'); await page.waitForTimeout(50);
  check((await t('.mm-err')).includes('bigger than the start'), 'extrema: b < a message');
  // Stories.
  await page.click(R + '.mm-mode button[data-m="story"]');
  await slide('.mm-sx', Math.round(1000 / 3));
  { const f = await t('.mm-sfacts'); check(f.includes('2000 cm³') && f.includes('at 5 cm'), `extrema: open box best (${f})`); }
  check((await t('.mm-steps')).includes('(30 − 2x)(30 − 6x)'), 'extrema: box working');
  await page.selectOption(R + '.mm-st', 'fence');
  { const f = await t('.mm-sfacts'); check(f.includes('1250 m²') && f.includes('at 25 m'), `extrema: fence (${f})`); }
  await page.selectOption(R + '.mm-st', 'can');
  { const f = await t('.mm-sfacts'); check(f.includes('348.73') && f.includes('4.3013'), `extrema: can (${f})`); }
  check((await t('.mm-steps')).includes('= 2r'), 'extrema: can working');
  await page.fill(R + '.mm-p', '-3'); await page.waitForTimeout(50);
  check((await t('.mm-serr')).includes('positive') && await page.isHidden(R + '.mm-sout'), 'extrema: bad size message');
  await page.fill(R + '.mm-p', '500');
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'extrema: five quiz questions');
  const qt = await t('.smq-q:nth-child(4) .smq-text'); const s = +qt.match(/a (\d+) cm/)[1];
  await page.fill(R + '.smq-q:nth-child(4) .smq-in', String(s / 6)); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', 'extrema: box answer');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'extrema: choice answer');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/maxima-minima/`); await page.waitForTimeout(600);
  {
  const S = '.mm-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'f has a local maximum of 2 at x = −1 and a local minimum of −2 at x = 1.' && (await work()).includes('f′(x) = 3x² − 3'), `extrema solve: x³ − 3x (${await ans()})`);
  await fill('co', '1 0 0 0 0'); check((await ans()) === 'f has a local minimum of 0 at x = 0.' && (await work()).includes('second derivative test fails'), `extrema solve: x⁴ (${await ans()})`);
  await fill('co', '1 0 0 0'); check((await ans()) === 'f has no maximum or minimum: it flattens at that point but keeps going the same way.', `extrema solve: x³ (${await ans()})`);
  await fill('co', '3 2'); check((await ans()) === 'A straight line has no turning points.', `extrema solve: line (${await ans()})`);
  await fill('co', '1 0 3'); check((await ans()) === 'f has a local minimum of 3 at x = 0.', `extrema solve: x² + 3 (${await ans()})`);
  await pre(1); check((await ans()) === 'f has a local maximum of 10 at x = 1 and a local minimum of 9 at x = 2. On [0, 3]: absolute maximum 14 at x = 3, absolute minimum 5 at x = 0.', `extrema solve: cubic on [0, 3] (${await ans()})`);
  await fill('a', '3'); await fill('b', '0'); check((await ans()).includes('must be smaller'), `extrema solve: bad interval (${await ans()})`);
  await fill('b', ''); check((await ans()).includes('both a and b'), `extrema solve: one limit (${await ans()})`);
  await pre(2); check((await ans()) === 'Cut 5 cm squares from each corner: the biggest box holds 2000 cm³.', `extrema solve: box (${await ans()})`);
  await pick('s-unit', 'm'); await fill('s', '1.2'); check((await ans()) === 'Cut 0.2 m squares from each corner: the biggest box holds 0.128 m³.', `extrema solve: box in m (${await ans()})`);
  await fill('s', '-5'); check((await ans()).includes('more than 0'), `extrema solve: negative side (${await ans()})`);
  await pre(3); check((await ans()) === 'Make the two sides 25 m and the side along the river 50 m: the biggest area is 1250 m².', `extrema solve: fence (${await ans()})`);
  await pre(4); check((await ans()) === 'Radius 5.419 cm and height 10.84 cm (h = 2r) use the least metal: 553.6 cm².', `extrema solve: can (${await ans()})`);
  await pick('V-unit', 'cm³'); await fill('V', '1000'); check((await ans()) === 'Radius 5.419 cm and height 10.84 cm (h = 2r) use the least metal: 553.6 cm².', `extrema solve: can in cm³ (${await ans()})`);
  }
};
