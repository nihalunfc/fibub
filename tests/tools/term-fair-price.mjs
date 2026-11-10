// #T861 Fair price of a term life quote
export const path = '/money/term-fair-price/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/term-fair-price/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.tf [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.tf ${c}`);
  await page.selectOption('.tf [data-k="cur"]', 'USD');
  await page.selectOption('.tf [data-k="mode"]', 'col');
  await set('col', '0.1, 0.1'); await set('sa', '1000'); await set('rate', '0'); await set('quote', '150'); await page.waitForTimeout(100);
  check((await txt('.tf-s-fair')).includes('100.00'), 'term-fair-price: q 0.1, 0.1 on 1000 at 0% = fair 100.00 (' + (await txt('.tf-s-fair')) + ')');
  check((await txt('.tf-s-claim')).includes('19'), 'term-fair-price: chance of a claim 19%');
  check((await txt('.tf-s-none')).includes('81'), 'term-fair-price: chance of no claim 81%');
  check((await txt('.tf-s-load')).includes('1.50'), 'term-fair-price: quote 150 is 1.50 times fair');
  await page.selectOption('.tf [data-k="mode"]', 'one'); await page.waitForTimeout(100);
  check(await page.isVisible('.tf .tf-one'), 'term-fair-price: single-number mode shows the age fields');
  await set('q0', '0.01'); await set('growth', '0'); await set('term', '10'); await set('rate', '0'); await page.waitForTimeout(100);
  check((await txt('.tf-s-fair')).includes('10.') || (await txt('.tf-s-fair')).includes('9.'), 'term-fair-price: flat q 1% on 1000 gives about 10 a year (' + (await txt('.tf-s-fair')) + ')');
  await set('q0', '5'); await page.waitForTimeout(100);
  check(await page.isVisible('.tf .tf-err'), 'term-fair-price: a death chance above 1 shows a message');
};
