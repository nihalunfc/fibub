// #1474 slope field (maths checked against scipy in tests/sci-tools/slope-field.mjs)
export const path = '/learn/slope-field/';
export default async ({ page, check, BASE }) => {
  const R = '.slf ';
  const t = (s) => page.textContent(R + s);
  const sel = async (s, v) => { await page.selectOption(R + s, v); await page.waitForTimeout(80); };
  await page.goto(`${BASE}/learn/slope-field/`); await page.waitForTimeout(500);
  { const f = await t('.sf-facts'); check(f.includes('Start point(0, 2)') && f.includes('y at t = 3') && f.includes('4.9192') && f.includes('Formula gives4.9192'), `slope field: growth facts (${f})`); }
  check((await t('.sf-ans')) === 'y = 2 e^(0.3 t)' && (await t('.sf-kind')).includes('separable'), `slope field: growth answer (${await t('.sf-ans')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.sf-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || d[i + 2] < 200) n++; return n; });
  check(px > 3000, `slope field: field drawn (${px} px)`);
  await page.$eval(R + '.sf-params input', (e) => { e.value = '-0.5'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.sf-ans')) === 'y = 2 e^(−0.5 t)', `slope field: decay (${await t('.sf-ans')})`);
  await sel('.sf-eq', 'cooling');
  check((await t('.sf-ans')) === 'T = 25 + 65 e^(−0.08 t)', `slope field: cooling (${await t('.sf-ans')})`);
  check((await t('.sf-facts')).includes('38.1233'), `slope field: tea after 20 min (${await t('.sf-facts')})`);
  await sel('.sf-eq', 'tank');
  check((await t('.sf-ans')) === 'y = 100 − 100 e^(−0.02 t)' && (await t('.sf-steps')).includes('Integrating factor'), `slope field: tank (${await t('.sf-ans')})`);
  await sel('.sf-eq', 'lin1');
  check((await t('.sf-ans')) === 'y = −x − 1 + 1 eˣ', `slope field: linear (${await t('.sf-ans')})`);
  // tap a point
  await page.$eval(R + '.sf-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const box = await page.$eval(R + '.sf-fig', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await page.mouse.click(box.x + box.w * 0.3, box.y + box.h * 0.4); await page.waitForTimeout(80);
  const f2 = await t('.sf-facts');
  check(!f2.includes('Start point(0, 0)') && /difference under 0\.0001/.test(f2), `slope field: tapped point, RK4 agrees with formula (${f2})`);
  await page.click(R + '.sf-clear'); await page.waitForTimeout(50);
  check(await page.$eval(R + '.sf-workc', (e) => e.hidden), 'slope field: clear curves');
  await sel('.sf-eq', 'circ');
  check((await t('.sf-ans')) === 'x² + y² = 4', `slope field: circles (${await t('.sf-ans')})`);
  await sel('.sf-eq', 'lin2');
  check((await t('.sf-ans')) === 'y = x³/4 + 0.75/x', `slope field: linear with IF x (${await t('.sf-ans')})`);
  await sel('.sf-eq', 'own');
  check((await t('.sf-facts')).includes('Start point(0, 0)') && (await page.$eval(R + '.sf-workc', (e) => e.hidden)), 'slope field: own equation solves numerically');
  await page.fill(R + '.sf-own', 'x + z'); await page.waitForTimeout(60);
  check((await t('.sf-err')).includes('only x and y'), 'slope field: unknown letter message');
  await page.fill(R + '.sf-own', 'x - y'); await page.fill(R + '.sf-x1', '-5'); await page.waitForTimeout(60);
  check((await t('.sf-err')).includes('smaller'), 'slope field: window message');
  await page.fill(R + '.sf-x1', '3'); await page.waitForTimeout(60);
  check(await page.$eval(R + '.sf-err', (e) => e.hidden), 'slope field: window fixed');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'slope field: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'slope field: quiz answer');
};
