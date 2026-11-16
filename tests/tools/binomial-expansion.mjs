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
  // Solve-my-numbers additions (2026-11-16).
  await page.evaluate(() => document.querySelectorAll('.bnx details').forEach((d) => { d.open = true; }));
  await page.fill(R + '.bn-a', '2'); await page.fill(R + '.bn-b', '-3'); await page.fill(R + '.bn-nt', '5'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('In (2x − 3)⁵, the coefficient of x² is −1080.') && (await t('.bn-fans')).includes('r = 3'), `binomial: coefficient of x² (${await t('.bn-fans')})`);
  await page.fill(R + '.bn-nt', '8'); await page.waitForTimeout(50);
  check((await page.inputValue(R + '.bn-n')) === '8' && (await t('.bn-exp')).startsWith('256x⁸'), `binomial: typed n = 8 (${await t('.bn-exp')})`);
  await page.fill(R + '.bn-nt', '25');
  check((await t('.bn-err')).includes('0 to 20') && !(await page.$eval(R + '.bn-err', (e) => e.hidden)), 'binomial: n above 20 is explained');
  await page.click(R + '.bn-pre button[data-p="1,1,6,1,-1,0"]'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('In (x + x⁻¹)⁶, the term without x is 20.'), `binomial: constant term of (x + 1/x)⁶ (${await t('.bn-fans')})`);
  await page.click(R + '.bn-pre button[data-p="1,-1,6,2,-1,0"]'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('In (x² − x⁻¹)⁶, the term without x is 15.'), `binomial: constant term of (x² − 1/x)⁶ (${await t('.bn-fans')})`);
  await page.fill(R + '.bn-k', '3'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('coefficient of x³ is −20.'), `binomial: x³ in (x² − 1/x)⁶ (${await t('.bn-fans')})`);
  await page.fill(R + '.bn-k', '1'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('is 0.') && (await t('.bn-fans')).includes('no term'), `binomial: absent power gives 0 (${await t('.bn-fans')})`);
  await page.fill(R + '.bn-k', 'x'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('whole numbers'), 'binomial: bad k message');
  await page.click(R + '.bn-pre button[data-p="1,1,10,1,0,3"]'); await page.waitForTimeout(50);
  check((await t('.bn-fans')).includes('coefficient of x³ is 120.'), `binomial: x³ in (x + 1)¹⁰ (${await t('.bn-fans')})`);
};
