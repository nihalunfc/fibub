// #1190 3D vector lab (maths checked against NumPy and SciPy in tests/sci-tools/vector-lab-3d.mjs)
export const path = '/learn/vector-lab-3d/';
export default async ({ page, check, BASE }) => {
  const R = '.v3l ';
  const t = (s) => page.textContent(R + s);
  const op = (o) => page.click(R + `.v3-op button[data-o="${o}"]`);
  await page.goto(`${BASE}/learn/vector-lab-3d/`); await page.waitForTimeout(500);
  check((await t('.v3-formula')).endsWith('= (3, 4, −1)') && (await t('.v3-facts')).includes('|a|3'), `vectors: a + b (${await t('.v3-formula')})`);
  const shot = () => page.evaluate(() => document.querySelector('.v3-fig').toDataURL());
  const before = await shot();
  await page.$eval(R + '.v3-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.v3-fig')).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + 60, b.y + b.height / 2 + 20, { steps: 4 }); await page.mouse.up();
  check((await shot()) !== before, 'vectors: dragging turns the picture');
  await page.click(R + '.v3-view[data-v="top"]'); check((await shot()) !== before, 'vectors: view buttons');
  await op('dot'); { const f = await t('.v3-facts'); check((await t('.v3-formula')).includes('= 3 = |a||b| cos θ') && f.includes('72.45°') && f.includes('Projection of b on a1'), `vectors: dot (${f})`); }
  await page.fill(R + '.v3-b0', '1'); await page.fill(R + '.v3-b1', '0'); await page.fill(R + '.v3-b2', '1'); await page.waitForTimeout(50);
  check((await t('.v3-facts')).includes('perpendicular'), 'vectors: perpendicular dot');
  await page.fill(R + '.v3-b0', '1'); await page.fill(R + '.v3-b1', '3'); await page.fill(R + '.v3-b2', '1');
  await op('cross'); { const f = await t('.v3-facts'); check((await t('.v3-formula')).endsWith('= (7, −4, 5)') && f.includes('9.4868') && f.includes('4.7434') && f.includes('(a × b) · a0'), `vectors: cross (${f})`); }
  await op('lines'); { const f = await t('.v3-facts'); check((await t('.v3-title')).startsWith('Skew') && f.includes('Shortest distance0.6882') && (await page.isVisible(R + '.v3-p0')), `vectors: skew lines (${f})`); }
  await page.fill(R + '.v3-b0', '2'); await page.fill(R + '.v3-b1', '-6'); await page.fill(R + '.v3-b2', '4'); await page.waitForTimeout(50);
  check((await t('.v3-title')) === 'Parallel lines' && (await t('.v3-formula')).startsWith('Parallel'), 'vectors: parallel lines');
  await page.fill(R + '.v3-b0', '0'); await page.fill(R + '.v3-b1', '0'); await page.fill(R + '.v3-b2', '0'); await page.waitForTimeout(50);
  check((await t('.v3-err')).includes('cannot be (0, 0, 0)'), 'vectors: zero direction message');
  await page.fill(R + '.v3-b0', 'q'); await page.waitForTimeout(50);
  check((await t('.v3-err')).includes('Type a number'), 'vectors: bad number message');
  await op('sum'); check((await page.inputValue(R + '.v3-a0')) === '2' && await page.isHidden(R + '.v3-p0'), 'vectors: back to a + b resets the example');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'vectors: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'vectors: quiz answer');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/vector-lab-3d/`); await page.waitForTimeout(600);
  {
  const S = '.v3-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'a + b = (3, 4, −1), with size 5.099.', `vectors solve: sum (${await ans()})`);
  await pre(1); check((await ans()) === 'a · b = 3 and the angle between them is 72.452°.' && (await work()).includes('Scalar projection of a on b = a · b / |b| = 0.90453'), `vectors solve: dot (${await ans()})`);
  await fill('a', '1, 0, 0'); await fill('b', '0, 2, 5'); check((await ans()) === 'a · b = 0, so a and b are perpendicular (θ = 90°).', `vectors solve: perpendicular (${await ans()})`);
  await fill('a', '2, 1'); check((await ans()).includes('exactly three numbers'), `vectors solve: two numbers only (${await ans()})`);
  await pre(2); check((await ans()) === 'a × b = (7, −4, 5), with size 9.487 (the parallelogram\'s area).' && (await work()).includes('= (1×1 − (−2)×3, (−2)×1 − 2×1, 2×3 − 1×1)'), `vectors solve: cross (${await ans()})`);
  await fill('a', '1, 2, 3'); await fill('b', '2, 4, 6'); check((await ans()).includes('a and b are parallel'), `vectors solve: parallel (${await ans()})`);
  await pre(3); check((await ans()) === '|a| = 13 and the unit vector is (0.2308, −0.3077, 0.9231).', `vectors solve: unit vector (${await ans()})`);
  await fill('a', '0, 0, 0'); check((await ans()).includes('zero vector'), `vectors solve: zero vector (${await ans()})`);
  await pre(4); check((await ans()) === 'The shortest distance between the lines is 0.4082 units.', `vectors solve: skew lines (${await ans()})`);
  await fill('q', '1, 2, 3'); check((await ans()) === 'The lines meet (intersect): the shortest distance is 0.', `vectors solve: lines meet (${await ans()})`);
  await pre(4); await fill('db', '4, 6, 8'); await fill('q', '3, 5, 7'); check((await ans()).startsWith('The lines are parallel'), `vectors solve: parallel lines (${await ans()})`);
  }
};
