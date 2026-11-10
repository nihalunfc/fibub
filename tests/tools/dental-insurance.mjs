// #T883 Is dental insurance worth it?
export const path = '/money/dental-insurance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/dental-insurance/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.dnt [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.dnt ${c}`);
  await page.selectOption('.dnt .dnt-cur', 'USD');
  await set('prem', '400'); await set('ded', '50'); await set('max', '1500'); await set('off', '20'); await page.waitForTimeout(100);
  check((await txt('.dnt-s-plan')).includes('400') && !(await txt('.dnt-s-plan')).includes('1,'), 'dental-insurance: plan pays 400 (' + (await txt('.dnt-s-plan')) + ')');
  check((await txt('.dnt-s-you')).includes('2,600'), 'dental-insurance: you pay 2,600 (' + (await txt('.dnt-s-you')) + ')');
  check((await txt('.dnt-s-tot')).includes('3,000') && (await txt('.dnt-s-cash')).includes('3,000'), 'dental-insurance: 3,000 with premium vs 3,000 cash');
  check((await txt('.dnt-body')).includes('waiting period'), 'dental-insurance: waiting period shown');
  await set('fee', '100'); await page.waitForTimeout(100);
  check(await page.isVisible('.dnt .dnt-disc') && (await txt('.dnt-s-disc')).includes('2,500'), 'dental-insurance: discount plan 100 + 80% of 3,000 = 2,500 (' + (await txt('.dnt-s-disc')) + ')');
  await page.selectOption('.dnt [data-k="per"]', 'm'); await page.waitForTimeout(100);
  check((await txt('.dnt-s-tot')).includes('7,400'), 'dental-insurance: monthly premium is multiplied by 12');
  await set('wb', '0'); await set('wm', '0'); await set('max', '300'); await page.waitForTimeout(100);
  check((await txt('.dnt-body')).includes('annual maximum'), 'dental-insurance: annual maximum reached is shown');
};
