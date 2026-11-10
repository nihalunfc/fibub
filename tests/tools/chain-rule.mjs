// #1466 chain rule gears (maths checked against sympy in tests/sci-tools/chain-rule.mjs)
export const path = '/learn/chain-rule/';
export default async ({ page, check, BASE }) => {
  const R = '.crl ';
  const t = (s) => page.textContent(R + s);
  const setX = (v) => page.$eval(R + '.cr-x', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/chain-rule/`); await page.waitForTimeout(500);
  check((await t('.cr-fx')) === 'y = sin(3x)', `chain: default function (${await t('.cr-fx')})`);
  { const f = await t('.cr-formula'); check(f.includes('dy/dx = dy/du × du/dx = cos(3x) × 3') && f.endsWith('0.0707 × 3 = 0.2122'), `chain: formula with numbers (${f})`); }
  { const f = await t('.cr-facts'); check(f.includes('Rate du/dx3') && f.includes('dy/dx (product)0.2122'), `chain: facts (${f})`); }
  { const tb = await t('.cr-tab tbody'); check(tb.includes('0.2077') && tb.includes('0.2118'), `chain: nudge table (${tb})`); }
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.cr-gears'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] > 150 && g[i + 1] > 70 && g[i + 1] < 140 && g[i + 2] < 60) n++; return n; });
  check(px > 50, `chain: x gear drawn in orange (${px} px)`);
  await setX(1);
  check((await t('.cr-formula')).endsWith('(−0.99) × 3 = −2.97'), `chain: x = 1 (${await t('.cr-formula')})`);
  // Inner link x², outer sin.
  await page.selectOption(R + '.cr-l0 .cr-fn', 'sq'); await page.waitForTimeout(50);
  check((await t('.cr-fx')) === 'y = sin(x²)' && await page.isHidden(R + '.cr-l0 .cr-kl'), 'chain: inner x², k hidden');
  check((await t('.cr-formula')).includes('= cos(x²) × 2x'), `chain: sin(x²) formula (${await t('.cr-formula')})`);
  // Three links.
  await page.click(R + '.cr-lv button[data-lv="3"]'); await page.waitForTimeout(50);
  check(await page.isVisible(R + '.cr-l1'), 'chain: middle link shown');
  await page.selectOption(R + '.cr-l0 .cr-fn', 'k'); await page.selectOption(R + '.cr-l0 .cr-k', '2');
  await page.selectOption(R + '.cr-l1 .cr-fn', 'sin'); await page.selectOption(R + '.cr-l2 .cr-fn', 'sq');
  await setX(0.3);
  check((await t('.cr-fx')) === 'y = (sin(2x))²', `chain: three-link function (${await t('.cr-fx')})`);
  { const f = await t('.cr-formula'); check(f.includes('dy/dv × dv/du × du/dx') && f.endsWith('= 1.8641'), `chain: three-link slope matches sympy 1.86408 (${f})`); }
  // Not defined.
  await page.click(R + '.cr-lv button[data-lv="2"]');
  await page.selectOption(R + '.cr-l0 .cr-fn', 'k'); await page.selectOption(R + '.cr-l0 .cr-k', '-1'); await page.selectOption(R + '.cr-l2 .cr-fn', 'ln');
  await setX(1);
  check((await t('.cr-formula')).includes('is not defined'), `chain: ln of a negative (${await t('.cr-formula')})`);
  await page.selectOption(R + '.cr-l0 .cr-k', '3'); await page.selectOption(R + '.cr-l2 .cr-fn', 'sin');
  // Turn button and drag.
  await setX(0);
  await page.click(R + '.cr-go'); await page.waitForTimeout(2200);
  check((await page.inputValue(R + '.cr-x')) === '1', `chain: Turn the x gear sweeps x by 1 (${await page.inputValue(R + '.cr-x')})`);
  await page.$eval(R + '.cr-gears', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.cr-gears')).boundingBox();
  const s = b.width / 380, cx = b.x + (380 / 6) * s, cy = b.y + 96 * s, r = 25 * s;
  await page.mouse.move(cx + r, cy); await page.mouse.down(); await page.mouse.move(cx, cy + r, { steps: 4 }); await page.mouse.up();
  const xv = +(await page.inputValue(R + '.cr-x'));
  check(Math.abs(xv - 2) < 0.1, `chain: dragging the x gear a quarter turn adds 1 (${xv})`);
  // Check yourself.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'chain: five quiz questions');
  const ans = await page.$eval(R + '.smq-q:nth-child(1) .smq-work p', (e) => e.textContent.match(/= (−?\d+)\.$/)[1].replace('−', '-'));
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', ans); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `chain: quiz answer accepted (${ans})`);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(+ans + 1)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')).startsWith('Not quite'), 'chain: wrong answer caught');
};
