// #1181 derivative as a slope (maths checked against sympy in tests/sci-tools/derivative-slope.mjs)
export const path = '/learn/derivative-slope/';
export default async ({ page, check, BASE }) => {
  const R = '.dsl ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/derivative-slope/`); await page.waitForTimeout(500);
  check((await t('.ds-formula')).includes('= (4 − 1) / 1 = 3'), `derivative: x² example secant (${await t('.ds-formula')})`);
  { const f = await t('.ds-facts'); check(f.includes('Tangent slope f′(a)2') && f.includes('y = 2x − 1'), `derivative: tangent facts (${f})`); }
  { const tb = await t('.ds-tab tbody'); check(tb.includes('2.1') && tb.includes('2.01') && tb.includes('1.99') && tb.includes('1.999'), `derivative: table both sides (${tb})`); }
  const px = await page.evaluate(() => { const c = document.querySelector('.ds-main'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] < 100 && g[i + 1] < 140 && g[i + 2] > 140) n++; return n; });
  check(px > 200, `derivative: secant drawn in blue (${px} px)`);
  await page.$eval(R + '.ds-h', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.ds-formula')).endsWith('= 2.001'), `derivative: h = 0.001 gives 2.001 (${await t('.ds-formula')})`);
  await page.check(R + '.ds-left'); await page.waitForTimeout(50);
  check((await t('.ds-formula')).endsWith('= 1.999'), 'derivative: Q on the left');
  await page.uncheck(R + '.ds-left');
  await page.click(R + '.ds-go'); await page.waitForTimeout(2600);
  check((await page.inputValue(R + '.ds-h')) === '0', 'derivative: Slide Q to P runs h down');
  // Drag P on the canvas.
  const box = await (await page.$(R + '.ds-main')).boundingBox();
  await page.$eval(R + '.ds-main', (e) => e.scrollIntoView({ block: 'center' }));
  const b2 = await (await page.$(R + '.ds-main')).boundingBox();
  await page.mouse.move(b2.x + b2.width * 0.75, b2.y + b2.height * 0.6); await page.mouse.down(); await page.mouse.move(b2.x + b2.width * 0.8, b2.y + b2.height * 0.6); await page.mouse.up();
  check(Math.abs(+(await page.inputValue(R + '.ds-a')) - 1) > 0.3 && box.width > 0, `derivative: drag moves P (a = ${await page.inputValue(R + '.ds-a')})`);
  // Corner.
  await page.selectOption(R + '.ds-fn', 'abs');
  await page.$eval(R + '.ds-a', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click(R + '.ds-lv button[data-lv="12"]'); await page.waitForTimeout(50);
  { const f = await t('.ds-facts'); check(f.includes('No: a corner') && f.includes('Left-hand slope (h → 0⁻)−1') && f.includes('Right-hand slope (h → 0⁺)1'), `derivative: |x| corner at 0 (${f})`); }
  check((await t('.ds-tnote')).includes('no derivative'), 'derivative: table note for a corner');
  await page.selectOption(R + '.ds-fn', 'sin');
  await page.$eval(R + '.ds-a', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  { const f = await t('.ds-facts'); check(f.includes('f′(x) = cos x') && f.includes('Tangent slope f′(a)1') && f.includes('Yes'), `derivative: sin at 0 (${f})`); }
  // Own function and a bad one.
  await page.selectOption(R + '.ds-fn', 'own');
  await page.fill(R + '.ds-own', 'x^3/3 - x'); await page.$eval(R + '.ds-a', (e) => { e.value = '2'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.ds-facts')).includes('Tangent slope f′(a)3'), `derivative: own function f′(2) = 3 (${await t('.ds-facts')})`);
  await page.fill(R + '.ds-own', 'x + t'); await page.waitForTimeout(50);
  check((await t('.ds-err')).includes('Use only x') && await page.isVisible(R + '.ds-err'), 'derivative: bad function message');
  await page.fill(R + '.ds-own', 'x^2'); await page.waitForTimeout(50);
  check(await page.isHidden(R + '.ds-err'), 'derivative: message clears');
  // First principles.
  await page.selectOption(R + '.ds-n', '3');
  check((await t('.ds-steps')).includes('x³ + 3x²h + 3xh² + h³'), 'derivative: first principles x³');
  await page.click(R + '.ds-fpk button[data-k="sin"]');
  check((await t('.ds-steps')).includes('sin θ / θ → 1') && await page.isHidden(R + '.ds-nl'), 'derivative: first principles sin x');
  // Check yourself.
  const n = await page.$$eval(R + '.smq-q', (e) => e.length);
  check(n === 5, `derivative: five quiz questions (${n})`);
  await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')).includes('Type a number'), 'derivative: empty answer message');
  const ans = await page.$eval(R + '.smq-q:nth-child(1) .smq-work p', (e) => e.textContent.match(/= ([−-]?\d+)\.$/)[1].replace('−', '-'));
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', ans); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `derivative: right answer accepted (${ans})`);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(+ans + 1)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')).startsWith('Not quite'), 'derivative: wrong answer caught');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(3)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'derivative: choice question');
  const before = await t('.smq-list'); await page.click(R + '.smq-new');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5 && (await t('.smq-q:nth-child(5) .smq-out')) === '', `derivative: new questions ${before.length > 0}`);
};
