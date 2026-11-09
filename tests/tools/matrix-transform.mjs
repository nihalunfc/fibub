// #1189 matrix as a transformation (maths checked against sympy in tests/sci-tools/matrix-transform.mjs)
export const path = '/learn/matrix-transform/';
export default async ({ page, check, BASE }) => {
  const R = '.mtx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/matrix-transform/`); await page.waitForTimeout(500);
  { const f = await t('.mt-facts'); check(f.includes('det A = ad − bc2') && f.includes('× 2') && f.includes('Kept') && f.includes('(2, 0)') && f.includes('[0.5 −0.5; 0 1]'), `matrix: shear example (${f})`); }
  const px = await page.evaluate(() => { const c = document.querySelector('.mt-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 2] > d[i] + 40) n++; return n; });
  check(px > 1000, `matrix: grid drawn (${px} px)`);
  await page.selectOption(R + '.mt-pre', 'refx'); check((await t('.mt-facts')).includes('Flipped') && (await t('.mt-facts')).includes('ad − bc−1'), 'matrix: reflection flips');
  await page.selectOption(R + '.mt-pre', 'proj'); check((await t('.mt-facts')).includes('Squashed flat') && (await t('.mt-facts')).includes('Inverse A⁻¹none'), 'matrix: squash has no inverse');
  await page.selectOption(R + '.mt-pre', 'rot'); await slide('.mt-th', 90);
  check((await page.inputValue(R + '.mt-b')) === '-1' && (await t('.mt-facts')).includes('ad − bc1'), 'matrix: rotation 90°');
  await slide('.mt-k', 50); check((await t('.mt-kv')) === '50 %', 'matrix: morph slider');
  await page.fill(R + '.mt-a', '3'); await page.waitForTimeout(50);
  check((await page.inputValue(R + '.mt-pre')) === '' && (await t('.mt-facts')).includes('ad − bc1'), 'matrix: typing switches to own numbers');
  await page.fill(R + '.mt-a', 'x'); await page.waitForTimeout(50); check((await t('.mt-err')).includes('Type a number'), 'matrix: bad number');
  await page.fill(R + '.mt-a', '30'); await page.waitForTimeout(50); check((await t('.mt-err')).includes('between −10 and 10'), 'matrix: too big');
  await page.fill(R + '.mt-a', '1');
  await page.click(R + '.mt-mode button[data-m="two"]');
  { const f = await t('.mt-facts2'); check(f.includes('BA (A first)[0 −1; 1 1]') && f.includes('AB (B first)[1 −1; 1 0]') && (await t('.mt-two-note')).includes('AB ≠ BA'), `matrix: shear then rotate (${f})`); }
  await page.selectOption(R + '.mt-B', 'id'); check((await t('.mt-two-note')).includes('AB = BA'), 'matrix: identity commutes');
  await page.click(R + '.mt-mode button[data-m="solve"]');
  { const s = await t('.mt-steps'); check(s.includes('= −21') && s.includes('x = 5, y = 3, z = −2') && s.includes('9/7'), `matrix: 3 × 3 solve (${s.slice(0, 200)})`); }
  await page.click(R + '.mt-ex2'); check((await t('.mt-steps')).includes('no solution'), 'matrix: inconsistent system');
  await page.click(R + '.mt-ex3'); check((await t('.mt-steps')).includes('infinitely many'), 'matrix: many solutions');
  await page.fill(R + '.mt-s00', '1.5'); await page.waitForTimeout(50); check((await t('.mt-serr')).includes('whole numbers'), 'matrix: whole numbers only');
  await page.click(R + '.mt-ex1');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'matrix: five quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const [a, b, c, d] = q1.replace(/−/g, '-').match(/-?\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(a * d - b * c)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'matrix: quiz answer');
};
