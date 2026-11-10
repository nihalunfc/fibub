// #1737 FHSA
export const path = '/money/fhsa-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/fhsa-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.fh [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.fh ${c}`)).trim();
  await set('per', '8000'); await set('years', '5'); await set('rate', '5'); await set('tax', '30');
  check((await t('.fh-s-bal')).includes('46,415'), 'fhsa: 8,000/yr 5 yr at 5% = 46,415');
  check((await t('.fh-s-ref')).includes('12,000'), 'fhsa: 30% refund on 40,000 = 12,000');
  check((await t('.fh-hbp')).includes('3,094'), 'fhsa: HBP repays 3,094 a year');
  await set('per', '10000'); await set('years', '6');
  check((await t('.fh-s-put')).includes('40,000') && await page.isVisible('.fh .fh-cap'), 'fhsa: 10,000/yr held to 8,000 and 40,000 lifetime');
  await set('carry', '8000'); await set('per', '16000'); await set('years', '1');
  check((await t('.fh-s-put')).includes('16,000'), 'fhsa: carry-forward allows 16,000 in one year');
  await set('per', '20000');
  check((await t('.fh-s-put')).includes('16,000'), 'fhsa: no more than 8,000 plus 8,000 carried');
  await set('years', '16');
  check(await page.isVisible('.fh .fh-err'), 'fhsa: more than 15 years shows a message');
};
