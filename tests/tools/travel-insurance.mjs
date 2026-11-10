// #T889 Do I need travel insurance?
export const path = '/money/travel-insurance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/travel-insurance/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ti [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.ti ${c}`);
  await page.selectOption('.ti [data-k="cur"]', 'USD');
  check((await page.$$('.ti .ti-row')).length === 3, 'travel-insurance: three starter risks');
  await page.click('.ti .ti-row:nth-child(3) .ti-rm'); await page.click('.ti .ti-row:nth-child(2) .ti-rm');
  await page.fill('.ti .ti-row .ti-p', '1'); await page.fill('.ti .ti-row .ti-loss', '50000');
  await set('wealth', '100000'); await set('price', '600'); await set('ded', '0'); await set('gamma', '1');
  await page.waitForTimeout(150);
  check((await txt('.ti-s-max')).includes('690.8') || (await txt('.ti-s-max')).includes('691'), 'travel-insurance: most worth paying about 690.8 (' + (await txt('.ti-s-max')) + ')');
  check((await txt('.ti-s-fair')).includes('500'), 'travel-insurance: fair price 500');
  check((await txt('.ti-s-no')).includes('500'), 'travel-insurance: expected loss 500');
  check((await txt('.ti-verdict')).includes('at or below the most'), 'travel-insurance: 600 is worth paying');
  await page.fill('.ti .ti-row .ti-card', '50000'); await page.waitForTimeout(100);
  check((await txt('.ti-s-fair')).includes('0'), 'travel-insurance: full existing cover leaves nothing to insure');
  await page.fill('.ti .ti-row .ti-card', '0'); await set('ded', '10000'); await page.waitForTimeout(100);
  check((await txt('.ti-s-fair')).includes('400'), 'travel-insurance: deductible 10,000 gives fair price 400');
  await page.click('.ti .ti-add'); await page.waitForTimeout(100);
  check(await page.isVisible('.ti .ti-err'), 'travel-insurance: a blank new risk shows a message');
};
