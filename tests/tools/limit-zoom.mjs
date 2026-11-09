// #1185 limit zoom (maths checked against sympy in tests/sci-tools/limit-zoom.mjs)
export const path = '/learn/limit-zoom/';
export default async ({ page, check, BASE }) => {
  const R = '.lzm ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/limit-zoom/`); await page.waitForTimeout(500);
  check((await t('.lz-title')) === 'sin x / x near x = 0', `limits: first example (${await t('.lz-title')})`);
  { const f = await t('.lz-facts'); check(f.includes('Left-hand limit (x → 0⁻)1') && f.includes('Right-hand limit (x → 0⁺)1') && f.includes('not defined'), `limits: sin x / x (${f})`); }
  { const tb = await t('.lz-tr tbody'); check(tb.includes('0.998334') && tb.includes('0.999983'), `limits: right table (${tb})`); }
  check(await page.isVisible(R + '.lz-sector') && (await t('.lz-snote')).includes('cos x < sin x / x < 1'), 'limits: sector picture');
  await slide('.lz-x', 0.5);
  check((await t('.lz-snote')).includes('0.8776 < 0.9589 < 1'), `limits: sector numbers (${await t('.lz-snote')})`);
  await page.click(R + '.lz-go'); await page.waitForTimeout(2400);
  check((await page.inputValue(R + '.lz-z')) === '1000' && (await t('.lz-wv')) === '0.0004', `limits: zoom in (${await t('.lz-wv')})`);
  await page.click(R + '.lz-reset');
  check((await t('.lz-wv')) === '4', 'limits: zoom out');
  const px = await page.evaluate(() => { const c = document.querySelector('.lz-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 300, `limits: curve drawn (${px} px)`);
  await page.click(R + '.lz-lv button[data-lv="12"]');
  check((await t('.lz-facts')).includes('Removable break (a hole)'), 'limits: Class 12 kind');
  await page.selectOption(R + '.lz-ex', 'sign');
  { const f = await t('.lz-facts'); check(f.includes('−1') && f.includes('Limitdoes not exist') && f.includes('Jump'), `limits: |x|/x jump (${f})`); }
  check(await page.isHidden(R + '.lz-sector'), 'limits: sector only for sin x / x');
  await page.selectOption(R + '.lz-ex', 'patch');
  { const f = await t('.lz-facts'); check(f.includes('Value f(1)3') && f.includes('Continuous at x = 1?No') && f.includes('Removable'), `limits: patched x² (${f})`); }
  await page.selectOption(R + '.lz-ex', 'abs');
  check((await t('.lz-facts')).includes('Continuous at x = 0?Yes'), 'limits: |x| continuous');
  await page.selectOption(R + '.lz-ex', 'inv');
  { const f = await t('.lz-facts'); check(f.includes('−∞') && f.includes('Infinite break'), `limits: 1/x (${f})`); }
  await page.selectOption(R + '.lz-ex', 'wobble');
  check((await t('.lz-facts')).includes('No limit (wobbles)'), 'limits: sin(1/x)');
  await page.selectOption(R + '.lz-ex', 'own'); await page.waitForTimeout(50);
  { const f = await t('.lz-facts'); check(f.includes('Limit3') && (await t('.lz-title')).includes('near x = 1'), `limits: own (x³ − 1)/(x − 1) (${f})`); }
  await page.fill(R + '.lz-a', 'q'); await page.waitForTimeout(50);
  check((await t('.lz-err')).includes('point a') && await page.isHidden(R + '.lz-out'), 'limits: bad point message');
  await page.fill(R + '.lz-a', '1'); await page.fill(R + '.lz-f', 'x*z'); await page.waitForTimeout(50);
  check((await t('.lz-err')).includes('Use only x'), 'limits: bad function message');
  await page.fill(R + '.lz-f', 'x^2'); await page.waitForTimeout(50);
  check(await page.isHidden(R + '.lz-err') && (await t('.lz-facts')).includes('Continuous at x = 1?Yes'), 'limits: message clears');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'limits: five quiz questions');
  const q2 = await t('.smq-q:nth-child(2) .smq-text'); const m = q2.match(/sin\((\d)x\)/)[1];
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', m); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'limits: quiz answer');
};
