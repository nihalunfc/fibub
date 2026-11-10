// #1372 power set builder (maths checked in tests/sci-tools/power-set.mjs)
export const path = '/learn/power-set/';
export default async ({ page, check, BASE }) => {
  const R = '.pws ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/power-set/`); await page.waitForTimeout(400);
  check((await t('.pw-title')) === '{a, b, c} has 3 elements, so 2³ = 8 subsets', `powerset: title (${await t('.pw-title')})`);
  check((await page.$$eval(R + '.pw-s', (e) => e.map((x) => x.textContent).join(' '))) === '∅ {a} {b} {c} {a, b} {a, c} {b, c} {a, b, c}', 'powerset: all 8 subsets in order');
  check((await t('.pw-facts')).includes('1 + 3 + 3 + 1 = 8'), 'powerset: counts by size');
  await page.click(R + '.pw-chip[data-i="0"]'); await page.click(R + '.pw-chip[data-i="2"]');
  check((await t('.pw-pick')).includes('{a, c}') && (await t('.pw-pick')).includes('101') && (await t('.pw-cur')) === '{a, c}', 'powerset: switches build {a, c}');
  check((await page.$$eval(R + '.pw-tree line.pw-on', (e) => e.length)) === 3, 'powerset: path drawn in the tree');
  await page.click(R + '.pw-ex button[data-v="1, 2, 3, 4"]');
  check((await t('.pw-title')).includes('16 subsets') && (await t('.pw-facts')).includes('1 + 4 + 6 + 4 + 1'), 'powerset: 4 elements');
  await page.fill(R + '.pw-in', 'a, b, a');
  check((await t('.pw-drop')).includes('a') && await page.isVisible(R + '.pw-drop') && (await t('.pw-title')).includes('4 subsets'), 'powerset: repeat dropped');
  await page.fill(R + '.pw-in', '1,2,3,4,5,6,7');
  check(await page.isVisible(R + '.pw-err') && await page.isHidden(R + '.pw-out'), 'powerset: too many elements message');
  await page.fill(R + '.pw-in', '1,2,3,4,5');
  check((await t('.pw-title')).includes('32 subsets') && (await t('.pw-tnote')).includes('up to 4'), 'powerset: 5 elements, no tree');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'powerset: five quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const n = Number(q1.match(/has (\d) elements/)[1]);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(2 ** n)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'powerset: quiz answer');
};
