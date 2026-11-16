// #1191 probability tree (maths checked against exact fractions in tests/sci-tools/probability-tree.mjs)
export const path = '/learn/probability-tree/';
export default async ({ page, check, BASE }) => {
  const R = '.ptr ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/probability-tree/`); await page.waitForTimeout(500);
  { const f = await t('.pt-facts'); check(f.includes('P(A ∩ B)0.009') && f.includes('P(B)0.0585') && f.includes('P(A | B)0.1538') && f.includes('Independent?No'), `tree: screening example (${f})`); }
  check((await t('.pt-leg')).includes('A and B: 9') && (await t('.pt-leg')).includes('B, not A: 50') && (await t('.pt-dnote')).includes('9 ÷ 59'), `tree: dots (${await t('.pt-leg')})`);
  check((await t('.pt-story')).includes('not medical advice'), 'tree: teaching-model note');
  const px = await page.evaluate(() => { const c = document.querySelector('.pt-dots'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 250 || d[i + 2] < 250) n++; return n; });
  check(px > 5000, `tree: dots drawn (${px} px)`);
  await slide('.pt-a', 0.2); check((await t('.pt-facts')).includes('P(A | B)0.8182'), `tree: base rate 20 % (${await t('.pt-facts')})`);
  await page.selectOption(R + '.pt-st', 'coin');
  { const f = await t('.pt-facts'); check(f.includes('Independent?Yes') && f.includes('P(A | B)0.5'), `tree: coins independent (${f})`); }
  await page.selectOption(R + '.pt-st', 'rain');
  check((await t('.pt-facts')).includes('P(B)0.415') && (await t('.pt-facts')).includes('0.5783'), 'tree: rain story');
  await page.selectOption(R + '.pt-st', 'own'); await page.fill(R + '.pt-na', 'it snows'); await page.fill(R + '.pt-nb', 'school closes'); await page.waitForTimeout(50);
  check((await t('.pt-bayes')).includes('"school closes" happened') && (await t('.pt-bayes')).includes('"it snows"'), 'tree: own names');
  await slide('.pt-ba', 0); await slide('.pt-bn', 0);
  check((await t('.pt-facts')).includes('P(A | B)undefined') && (await t('.pt-bayes')).includes('never happens'), 'tree: P(B) = 0');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'tree: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+(?:\.\d+)?/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(q1[0] * q1[1])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'tree: quiz answer');
  // Solve-my-numbers additions (2026-11-16).
  await page.goto(`${BASE}/learn/probability-tree/`); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelectorAll('.ptr details').forEach((d) => { d.open = true; }));
  check((await t('.pt-ans')) === 'P(A ∩ B) = 0.009,  P(B) = 0.0585,  P(A | B) = 0.1538 (15.38 %).', `tree: one-line answer (${await t('.pt-ans')})`);
  check((await t('.pt-wl')).includes('P(A | B) = P(A ∩ B) / P(B) = 0.009 / 0.0585 = 0.1538') && (await t('.pt-wl')).includes('0.99 × 0.05 = 0.0495'), `tree: working (${await t('.pt-wl')})`);
  await page.fill(R + '.pt-at', '20%'); await page.waitForTimeout(50);
  check((await t('.pt-facts')).includes('P(A | B)0.8182') && (await page.inputValue(R + '.pt-a')) === '0.2', `tree: typed 20 % (${await t('.pt-facts')})`);
  await page.fill(R + '.pt-bnt', '1/20'); await page.waitForTimeout(50);
  check((await t('.pt-facts')).includes('P(A | B)0.8182'), 'tree: fraction 1/20 equals 0.05');
  await page.fill(R + '.pt-bat', '2'); await page.waitForTimeout(50);
  check(await page.isVisible(R + '.pt-err') && (await t('.pt-err')).includes('0 to 1') && !(await t('.pt-facts')).includes('NaN'), 'tree: chance above 1 is explained');
  await page.fill(R + '.pt-bat', ''); await page.waitForTimeout(50);
  check((await t('.pt-err')).includes('Type a chance'), 'tree: blank chance message');
  await page.fill(R + '.pt-bat', '0.9'); await page.waitForTimeout(50);
  check(await page.isHidden(R + '.pt-err'), 'tree: message clears');
  // Marbles from a bag.
  await page.fill(R + '.pt-red', '3'); await page.fill(R + '.pt-blue', '2'); await page.click(R + '.pt-usebag'); await page.waitForTimeout(50);
  { const f = await t('.pt-facts'); check(f.includes('P(A ∩ B)0.3') && f.includes('P(B)0.6') && f.includes('P(A | B)0.5') && f.includes('Independent?No'), `tree: 3 red 2 blue without putting back (${f})`); }
  check((await t('.pt-bagtxt')).includes('P(red second | red first) = 2/4') && (await t('.pt-bayes')).includes('"second marble is red"'), `tree: bag text (${await t('.pt-bagtxt')})`);
  await page.check(R + '.pt-rep'); await page.click(R + '.pt-usebag'); await page.waitForTimeout(50);
  check((await t('.pt-facts')).includes('Independent?Yes') && (await t('.pt-facts')).includes('P(A | B)0.6'), 'tree: with putting back the draws are independent');
  await page.fill(R + '.pt-red', '0'); await page.fill(R + '.pt-blue', '0'); await page.click(R + '.pt-usebag');
  check((await t('.pt-bagtxt')).includes('empty'), 'tree: empty bag message');
  await page.fill(R + '.pt-red', 'x'); await page.click(R + '.pt-usebag');
  check((await t('.pt-bagtxt')).includes('whole numbers'), 'tree: bad marbles message');
  // New story.
  await page.selectOption(R + '.pt-st', 'factory'); await page.waitForTimeout(50);
  check((await t('.pt-facts')).includes('P(B)0.024') && (await t('.pt-facts')).includes('P(A | B)0.5'), `tree: factory story (${await t('.pt-facts')})`);
};
