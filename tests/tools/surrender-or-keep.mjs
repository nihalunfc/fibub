// #T887 Surrender a life insurance policy or keep it?
export const path = '/money/surrender-or-keep/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/surrender-or-keep/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.sk [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.sk ${c}`);
  await set('sv', '1000'); await set('prem', '0'); await set('left', '0'); await set('rate', '10');
  await page.fill('.sk .sk-by', '1'); await page.fill('.sk .sk-ba', '1100'); await page.waitForTimeout(100);
  check((await txt('.sk-s-irr')).includes('10.00%'), 'surrender-or-keep: keeping returns 10.00% (' + (await txt('.sk-s-irr')) + ')');
  check((await txt('.sk-s-sur')).replace(/[^\d]/g, '').endsWith('1100'), 'surrender-or-keep: surrender invested at 10% gives 1,100 (' + (await txt('.sk-s-sur')) + ')');
  check((await page.$$('.sk .sk-body tr')).length === 2, 'surrender-or-keep: years 0 and 1 rows');
  await set('pu', '1050'); await set('puy', '1'); await page.waitForTimeout(100);
  check((await txt('.sk-s-pu')).includes('5.00%'), 'surrender-or-keep: paid-up 1,050 in a year returns 5.00% (' + (await txt('.sk-s-pu')) + ')');
  await set('rate', '3'); await page.waitForTimeout(100);
  check((await txt('.sk-words')).includes('keeping the policy ends higher'), 'surrender-or-keep: low rate favours keeping');
  await set('sv', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.sk .sk-err'), 'surrender-or-keep: no surrender value shows a message');
};
