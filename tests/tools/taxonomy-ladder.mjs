// #1389 taxonomy ladder (classifications checked in tests/sci-tools/taxonomy-ladder.mjs)
export const path = '/learn/taxonomy-ladder/';
export default async ({ page, check, BASE }) => {
  const R = '.txl ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/taxonomy-ladder/`); await page.waitForTimeout(400);
  check((await t('.tx-title')) === 'Tiger and House cat share down to the family: Felidae', `taxonomy: tiger and cat (${await t('.tx-title')})`);
  check((await page.$$eval(R + '.tx-ns', (e) => e.length)) === 5 && (await t('.tx-lad')).includes('Panthera tigris') && (await t('.tx-lad')).includes('Felis catus'), 'taxonomy: 5 shared rungs, then split');
  await page.selectOption(R + '.tx-b', 'lion');
  check((await t('.tx-title')).includes('genus: Panthera') && (await t('.tx-note')).startsWith('Same genus'), 'taxonomy: tiger and lion');
  await page.selectOption(R + '.tx-a', 'human'); await page.selectOption(R + '.tx-b', 'mango');
  check((await t('.tx-title')) === 'Human and Mango share no rank' && (await page.$$eval(R + '.tx-shared', (e) => e.length)) === 0, 'taxonomy: human and mango');
  // rank game: one wrong tap, then all seven in order
  const order = ['Kingdom', 'Phylum / Division', 'Class', 'Order', 'Family', 'Genus', 'Species'];
  await page.click(R + `.tx-chips button[data-r="Species"]`);
  check((await t('.tx-gres')).startsWith('Not yet'), 'taxonomy: wrong rank message');
  for (const r of order) await page.click(R + `.tx-chips button[data-r="${r}"]`);
  check((await t('.tx-gres')).startsWith('All seven in order') && (await page.$$eval(R + '.tx-got li', (e) => e.length)) === 7, 'taxonomy: rank game done');
  await page.click(R + '.tx-shuffle');
  check((await page.$$eval(R + '.tx-got li', (e) => e.length)) === 0, 'taxonomy: shuffle resets');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'taxonomy: five quiz questions');
  await page.click(R + '.smq-q:nth-child(2) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'taxonomy: quiz answer');
};
