// #1385 event algebra (maths checked in tests/sci-tools/event-algebra.mjs)
export const path = '/learn/event-algebra/';
export default async ({ page, check, BASE }) => {
  const R = '.eva ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/event-algebra/`); await page.waitForTimeout(400);
  check((await t('.ev-title')) === 'A: the sum is 9 or more. B: at least one die shows 6.', `events: opening events (${await t('.ev-title')})`);
  { const f = await t('.ev-facts'); check(f.includes('10/36 = 5/18') && f.includes('11/36 = 11/36') && f.includes('7/36 = 7/36') && f.includes('14/36 = 7/18'), `events: counts (${f})`); }
  check((await page.$$eval(R + '.ev-c', (e) => e.length)) === 36 && (await page.$$eval(R + '.ev-on', (e) => e.length)) === 14, 'events: 36 cells, 14 outlined');
  check((await t('.ev-flags')).includes('not mutually exclusive'), 'events: not exclusive');
  await page.click(R + '.ev-op button[data-op="inter"]');
  check((await page.$$eval(R + '.ev-on', (e) => e.length)) === 7, 'events: A ∩ B outlines 7');
  await page.click(R + '.ev-op button[data-op="notA"]');
  check((await page.$$eval(R + '.ev-on', (e) => e.length)) === 26, 'events: A′ outlines 26');
  await page.selectOption(R + '.ev-a', 'sum-eq'); await page.selectOption(R + '.ev-b', 'double');
  check((await t('.ev-flags')).includes('are mutually exclusive') && (await t('.ev-rule')).includes('= 12/36 = 1/3'), `events: sum 7 and double (${await t('.ev-rule')})`);
  await page.fill(R + '.ev-ak', '4');
  check((await t('.ev-title')).includes('the sum is 4') && (await t('.ev-facts')).includes('3/36 = 1/12'), 'events: k changes the event');
  await page.click(R + '[data-n="1000"]');
  check(/1,000 rolls: A ∪ B happened [\d,]+ times/.test(await t('.ev-sim')), `events: simulation (${await t('.ev-sim')})`);
  await page.click(R + '.ev-sp button[data-s="coin-die"]');
  check((await page.$$eval(R + '.ev-c', (e) => e.length)) === 12 && (await t('.ev-sim')) === 'Nothing rolled yet.', 'events: coin and die');
  await page.selectOption(R + '.ev-b', 'tail');
  check((await t('.ev-flags')).includes('exhaustive'), `events: heads and tails exhaustive (${await t('.ev-flags')})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'events: five quiz questions');
  await page.click(R + '.smq-q:nth-child(4) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', 'events: quiz answer');
};
