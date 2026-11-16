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
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const ft = async (c) => (await page.textContent(`.fr ${c}`)).trim();
  await page.fill('.fr [data-k="take"]', '60000'); await page.fill('.fr [data-k="exp"]', '6000'); await page.fill('.fr [data-k="tax"]', '20'); await page.fill('.fr [data-k="off"]', '4'); await page.fill('.fr [data-k="hrs"]', '30');
  await page.fill('.fr [data-k="proj"]', '40'); await page.fill('.fr [data-k="buf"]', '0'); await page.fill('.fr [data-k="sal"]', '52000'); await page.waitForTimeout(100);
  check((await ft('.fr-month')).includes('6,750'), 'freelance-rate: 81,000 a year is 6,750 a month to invoice');
  check((await ft('.fr-quote')).includes('2,250'), 'freelance-rate: 40 hours at 56.25 = 2,250');
  check((await ft('.fr-emp')).includes('25.00'), 'freelance-rate: 52,000 as employee = 25.00 an hour');
};
