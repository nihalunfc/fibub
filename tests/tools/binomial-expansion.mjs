// #1192 binomial expansion (maths checked against sympy in tests/sci-tools/binomial-expansion.mjs)
export const path = '/learn/binomial-expansion/';
export default async ({ page, check, BASE }) => {
  const R = '.bnx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/binomial-expansion/`); await page.waitForTimeout(500);
  check((await t('.bn-exp')) === '32x⁵ − 240x⁴ + 720x³ − 1080x² + 810x − 243', `binomial: (2x − 3)⁵ (${await t('.bn-exp')})`);
  check((await t('.bn-gen')).includes('= 720x³'), `binomial: general term r = 2 (${await t('.bn-gen')})`);
  { const f = await t('.bn-facts'); check(f.includes('T₃ = 720x³ and T₄ = −1080x²') && f.includes('Sum of the coefficients−1') && f.includes('Number of terms6'), `binomial: facts n odd (${f})`); }
  await slide('.bn-r', 5); check((await t('.bn-gen')).endsWith('= −243'), `binomial: last term (${await t('.bn-gen')})`);
  await page.fill(R + '.bn-a', '1'); await page.fill(R + '.bn-b', '1'); await slide('.bn-n', 6);
  check((await t('.bn-exp')) === 'x⁶ + 6x⁵ + 15x⁴ + 20x³ + 15x² + 6x + 1', `binomial: (x + 1)⁶ (${await t('.bn-exp')})`);
  { const f = await t('.bn-facts'); check(f.includes('Middle termT₄ = 20x³') && f.includes('Sum of the coefficients64'), `binomial: facts n even (${f})`); }
  const px = await page.evaluate(() => { const c = document.querySelector('.bn-tri'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 250 || d[i + 2] < 250) n++; return n; });
  check(px > 600, `binomial: triangle drawn (${px} px)`);
  await page.click(R + '.bn-d100'); await page.waitForTimeout(1500);
  check((await t('.bn-gnote')).startsWith('100 balls.'), `binomial: 100 balls dropped (${await t('.bn-gnote')})`);
  await page.click(R + '.bn-clear'); await page.waitForTimeout(100);
  check((await t('.bn-gnote')).includes('Drop some balls'), 'binomial: Empty');
  await page.fill(R + '.bn-b', '25');
  check(!(await page.$eval(R + '.bn-err', (e) => e.hidden)) && (await t('.bn-err')).includes('−20 to 20'), 'binomial: bad b shows error');
  await page.fill(R + '.bn-b', '-1'); check(await page.$eval(R + '.bn-err', (e) => e.hidden), 'binomial: error clears');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'binomial: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+/g).map(Number);
  let c = 1; for (let i = 1; i <= q1[1]; i++) c = (c * (q1[0] - q1[1] + i)) / i;
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(c)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'binomial: quiz answer');
};
