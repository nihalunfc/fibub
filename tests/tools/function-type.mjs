// #1459 one-one and onto tester (maths checked against sympy in tests/sci-tools/function-type.mjs)
export const path = '/learn/function-type/';
export default async ({ page, check, BASE }) => {
  const R = '.fty ';
  const t = (s) => page.textContent(R + s);
  const sel = async (s, v) => { await page.selectOption(R + s, v); await page.waitForTimeout(60); };
  await page.goto(`${BASE}/learn/function-type/`); await page.waitForTimeout(500);
  check((await t('.ft-hit')).includes('2 times (x = −1.4142, 1.4142)'), `function type: x² meets y = 2 twice (${await t('.ft-hit')})`);
  { const f = await t('.ft-facts'); check(f.includes('Range[0, ∞)') && f.includes('One-one?Nof(−1) = f(1) = 1') && f.includes('Onto?Nonothing maps to −1') && f.includes('Bijective?No'), `function type: x² on ℝ verdict (${f})`); }
  const px = await page.evaluate(() => { const c = document.querySelector('.ft-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || d[i + 2] < 200) n++; return n; });
  check(px > 3000, `function type: graph drawn (${px} px)`);
  await sel('.ft-dom', 'p0'); await sel('.ft-cod', 'p0');
  { const f = await t('.ft-facts'); check(f.includes('One-one?Yes') && f.includes('Onto?Yes') && f.includes('Bijective?Yes'), `function type: x² on [0, ∞) is a bijection (${f})`); }
  check((await t('.ft-invnote')).includes('√x'), `function type: inverse is √x (${await t('.ft-invnote')})`);
  check((await t('.ft-hit')).includes('once'), 'function type: line meets once');
  await sel('.ft-fn', 'cubic'); await sel('.ft-dom', 'R'); await sel('.ft-cod', 'R');
  { const f = await t('.ft-facts'); check(f.includes('One-one?No') && f.includes('Onto?Yes'), `function type: x³ − 3x onto but not one-one (${f})`); }
  await page.$eval(R + '.ft-k', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.ft-hit')).includes('3 times (x = −1.7321, 0, 1.7321)'), `function type: y = 0 meets x³ − 3x three times (${await t('.ft-hit')})`);
  await page.click(R + '.ft-fix1'); await page.waitForTimeout(80);
  check((await t('.ft-facts')).includes('One-one?Yes'), `function type: Make it one-one works (${await t('.ft-facts')})`);
  await sel('.ft-fn', 'exp'); await sel('.ft-dom', 'R'); await sel('.ft-cod', 'p0');
  { const f = await t('.ft-facts'); check(f.includes('Range(0, ∞)') && f.includes('nothing maps to 0'), `function type: eˣ misses 0 (${f})`); }
  await page.click(R + '.ft-fix2'); await page.waitForTimeout(80);
  check((await t('.ft-facts')).includes('Bijective?Yes') && (await t('.ft-invnote')).includes('ln x'), 'function type: Make it onto gives ln x');
  await sel('.ft-fn', 'recip'); await sel('.ft-cod', 'R');
  { const f = await t('.ft-facts'); check(f.includes('One-one?Yes') && f.includes('Onto?No') && f.includes('(−∞, 0) ∪ (0, ∞)'), `function type: 1/x (${f})`); }
  await sel('.ft-fn', 'sin'); await sel('.ft-dom', 'hp'); await sel('.ft-cod', 'm1');
  check((await t('.ft-facts')).includes('Bijective?Yes') && (await t('.ft-facts')).includes('[−π/2, π/2]'), `function type: sin on [−π/2, π/2] (${await t('.ft-facts')})`);
  // drag the line on the picture
  await page.$eval(R + '.ft-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const box = await page.$eval(R + '.ft-fig', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const k0 = await page.$eval(R + '.ft-k', (e) => e.value);
  await page.mouse.move(box.x + box.w / 2, box.y + box.h * 0.2); await page.mouse.down(); await page.mouse.move(box.x + box.w / 2, box.y + box.h * 0.3, { steps: 3 }); await page.mouse.up();
  check((await page.$eval(R + '.ft-k', (e) => e.value)) !== k0, 'function type: dragging moves the line');
  await sel('.ft-fn', 'own'); await sel('.ft-dom', 'R');
  await page.fill(R + '.ft-own', 'x^2 - 2x'); await page.fill(R + '.ft-a', '-3'); await page.fill(R + '.ft-b', '3'); await page.waitForTimeout(80);
  check((await t('.ft-facts')).includes('Range[−1, 15]') && (await t('.ft-note')).includes('sampling'), `function type: own formula (${await t('.ft-facts')})`);
  await page.fill(R + '.ft-own', 'x^2 + y'); await page.waitForTimeout(50);
  check((await t('.ft-err')).includes('only x'), 'function type: other letters rejected');
  await page.fill(R + '.ft-own', 'x^'); await page.waitForTimeout(50);
  check((await t('.ft-err')).includes("Can't read"), 'function type: bad formula message');
  await page.fill(R + '.ft-b', '-5'); await page.waitForTimeout(50);
  check((await t('.ft-err')).includes('smaller'), 'function type: a < b message');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'function type: five quiz questions');
  const q3 = (await t('.smq-q:nth-child(3) .smq-text')).match(/y = (\d+)/);
  await page.fill(R + '.smq-q:nth-child(3) .smq-in', '2'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check(q3 && (await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'function type: quiz answer');
};
