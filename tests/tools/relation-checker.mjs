// #1193 relation checker (maths checked against a Python brute force in tests/sci-tools/relation-checker.mjs)
export const path = '/learn/relation-checker/';
export default async ({ page, check, BASE }) => {
  const R = '.rlc ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/relation-checker/`); await page.waitForTimeout(500);
  { const f = await t('.rl-facts'); check(f.includes('Equivalence relationYesclasses: {1, 3} {2, 4}') && f.includes('AntisymmetricNoboth (1, 3) and (3, 1)'), `relation: a − b even (${f})`); }
  check((await page.$$eval(R + '.rl-c', (e) => e.length)) === 16 && (await page.$$eval(R + '.rl-c[aria-pressed="true"]', (e) => e.length)) === 8, 'relation: table 4 × 4 with 8 pairs');
  const px = await page.evaluate(() => { const c = document.querySelector('.rl-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 250 || d[i + 2] < 250) n++; return n; });
  check(px > 1500, `relation: arrows drawn (${px} px)`);
  await page.selectOption(R + '.rl-pre', 'next');
  { const f = await t('.rl-facts'); check(f.includes('TransitiveNo(1, 2) and (2, 3) are in R but (1, 3) is not') && f.includes('ReflexiveNo(1, 1) is missing') && f.includes('4 has no partner'), `relation: b = a + 1 (${f})`); }
  await page.click(R + '.rl-ct');
  check((await page.inputValue(R + '.rl-pairs')) === '(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)' && (await page.$$eval(R + '.rl-new', (e) => e.length)) === 3, `relation: transitive closure (${await page.inputValue(R + '.rl-pairs')})`);
  await page.selectOption(R + '.rl-pre', 'le');
  check((await t('.rl-facts')).includes('Partial orderYes'), 'relation: ≤ is a partial order');
  await page.selectOption(R + '.rl-pre', 'none');
  for (const [a, b] of [[1, 2], [2, 3], [3, 1], [4, 4]]) await page.click(`${R}.rl-c[data-a="${a}"][data-b="${b}"]`);
  check((await t('.rl-facts')).includes('Function A → AYesone-one and onto (a bijection): 1→2, 2→3, 3→1, 4→4'), `relation: tapped bijection (${await t('.rl-facts')})`);
  await page.fill(R + '.rl-pairs', '(1,2), (3'); await page.press(R + '.rl-pairs', 'Enter');
  check(!(await page.$eval(R + '.rl-err', (e) => e.hidden)) && (await t('.rl-err')).includes('left over'), 'relation: bad pairs message');
  await page.fill(R + '.rl-pairs', '(1,2), (2,1)'); await page.press(R + '.rl-pairs', 'Enter');
  await page.click(R + '.rl-ce');
  check((await t('.rl-facts')).includes('classes: {1, 2} {3} {4}'), `relation: equivalence closure (${await t('.rl-facts')})`);
  await page.$eval(R + '.rl-n', (e) => { e.value = '6'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.rl-count')).includes('2³⁶') && (await t('.rl-count')).includes('203 equivalence'), 'relation: counts for n = 6');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'relation: five quiz questions');
  const q4 = (await t('.smq-q:nth-child(4) .smq-text')).match(/(\d+) elements/)[1];
  await page.fill(R + '.smq-q:nth-child(4) .smq-in', String(2 ** (q4 * q4))); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', 'relation: quiz answer');
};
