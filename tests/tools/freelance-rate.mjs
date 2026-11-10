// #1757 Freelance rate
export const path = '/money/freelance-rate/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/freelance-rate/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.fr [data-k="${k}"]`, v); };
  const txt = async (c) => (await page.textContent(`.fr ${c}`)).trim();
  await page.selectOption('.fr [data-k="cur"]', 'USD');
  await set('take', '60000'); await set('exp', '6000'); await set('tax', '20'); await set('off', '4'); await set('hrs', '30'); await set('days', '5'); await page.waitForTimeout(100);
  check((await txt('.fr-s-hour')).includes('56.25'), '60,000 take-home, 6,000 costs, 20% tax, 48 weeks x 30 h = 56.25/h (' + (await txt('.fr-s-hour')) + ')');
  check((await txt('.fr-s-day')).includes('337.50'), 'day rate 337.50 (' + (await txt('.fr-s-day')) + ')');
  check((await txt('.fr-s-gross')).includes('81,000'), 'billing needed 81,000');
  await set('hrs', '15'); await page.waitForTimeout(100);
  check((await txt('.fr-s-hour')).includes('112.50'), 'half the hours doubles the rate');
  await set('off', '60'); await page.waitForTimeout(100);
  check(await page.isVisible('.fr .fr-err'), 'too many weeks off shows a message');
};
