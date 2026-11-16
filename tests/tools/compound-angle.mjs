// #1370 compound angle proof (maths checked in tests/sci-tools/compound-angle.mjs)
export const path = '/learn/compound-angle/';
export default async ({ page, check, BASE }) => {
  const R = '.cpa ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/compound-angle/`); await page.waitForTimeout(400);
  check((await t('.cp-title')) === 'sin(30° + 45°) = sin 75° = 0.9659', `compound: title (${await t('.cp-title')})`);
  check((await t('.cp-sum')).includes('0.3536 + 0.6124 = 0.9659'), `compound: sine sum (${await t('.cp-sum')})`);
  await page.click(R + '.cp-show button[data-s="cos"]');
  check((await t('.cp-sum')).includes('0.6124 − 0.3536 = 0.2588'), `compound: cosine (${await t('.cp-sum')})`);
  await slide('.cp-a', 60); await slide('.cp-b', 50);
  check((await t('.cp-title')).includes('cos 110° = −0.342'), `compound: past 90° (${await t('.cp-title')})`);
  const rows = await page.$$eval(R + '.cp-tab tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
  check(rows.length === 9 && rows.every((r) => r[1] === r[2]), `compound: table agrees (${rows.length} rows)`);
  await slide('.cp-a', 45); await page.click(R + '.cp-dbl');
  check((await page.inputValue(R + '.cp-b')) === '45' && (await t('.cp-tab')).includes('undefined'), 'compound: B = A, tan 90° undefined');
  const px = await page.evaluate(() => { const c = document.querySelector('.cp-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 100, `compound: picture drawn (${px} px)`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'compound: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'compound: quiz answer');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/compound-angle/`); await page.waitForTimeout(600);
  {
  const S = '.cp-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'sin(45° + 30°) = sin 75° = (√2 + √6)/4 ≈ 0.9659.' && (await work()).includes('= (√2/2)(√3/2) + (√2/2)(1/2)'), `compound solve: sin 75 (${await ans()})`);
  await pick('A-unit', 'radians'); await pick('B-unit', 'radians'); await fill('A', '0.7853981634'); await fill('B', '0.5235987756'); check((await ans()) === 'sin(45° + 30°) = sin 75° = (√2 + √6)/4 ≈ 0.9659.', `compound solve: radians (${await ans()})`);
  await pre(0); await fill('A', '50'); await fill('B', '20'); check((await ans()) === 'sin(50° + 20°) = sin 70° = 0.9397.', `compound solve: other angles (${await ans()})`);
  await pre(1); check((await ans()) === 'cos(45° − 30°) = cos 15° = (√2 + √6)/4 ≈ 0.9659.', `compound solve: cos 15 (${await ans()})`);
  await fill('A', '60'); await fill('B', '30'); check((await ans()) === 'cos(60° − 30°) = cos 30° = √3/2 ≈ 0.866.', `compound solve: cos 30 (${await ans()})`);
  await pre(2); check((await ans()) === 'tan(60° + 45°) = tan 105° = −2 − √3 ≈ −3.732.', `compound solve: tan 105 (${await ans()})`);
  await fill('A', '90'); check((await ans()).includes('tan 90° is not defined'), `compound solve: tan 90 (${await ans()})`);
  await pre(3); check((await ans()) === 'sin(A + B) = 56/65 (≈ 0.8615), cos(A + B) = 33/65 (≈ 0.5077), tan(A + B) = 56/33 (≈ 1.697).' && (await work()).includes('cos A = +√(1 − sin²A) = +√(1 − 9/25) = 4/5'), `compound solve: from ratios (${await ans()})`);
  await pick('qa', '2'); check((await ans()) === 'sin(A + B) = 16/65 (≈ 0.2462), cos(A + B) = −63/65 (≈ −0.9692), tan(A + B) = −16/63 (≈ −0.254).', `compound solve: A in quadrant II (${await ans()})`);
  await pick('qa', '1'); await pick('op', 'minus'); check((await ans()) === 'sin(A − B) = 16/65 (≈ 0.2462), cos(A − B) = 63/65 (≈ 0.9692), tan(A − B) = 16/63 (≈ 0.254).', `compound solve: A − B (${await ans()})`);
  await fill('va', '1.5'); check((await ans()).includes('between −1 and 1'), `compound solve: sin above 1 (${await ans()})`);
  await fill('va', '-3/5'); check((await ans()).includes('is negative, but sine is positive in quadrant I'), `compound solve: wrong quadrant (${await ans()})`);
  await pre(4); check((await ans()) === 'sin 2A = 24/25 (≈ 0.96), cos 2A = 7/25 (≈ 0.28), tan 2A = 24/7 (≈ 3.429).', `compound solve: double angle (${await ans()})`);
  }
};
