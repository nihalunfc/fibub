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
};
