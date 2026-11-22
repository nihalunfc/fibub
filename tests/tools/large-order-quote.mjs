// #T1065 Group and large-order quote
import { quote } from '../../src/lib/biz/quote.ts';
export const path = '/money/large-order-quote/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 100 supplied a day, one day with regular demand 100 at 150, group of 30 at 120, cost 20, selling cost 10%.
  // Group uses 30, so 30 regular sales are pushed out; each regular sale earns 150 x 0.9 - 20 = 115 (3,450 lost).
  // Group profit 30 x (120 - 20) = 3,000, net -450. Break-even (3,450 + 30 x 20) / 30 = 135; with 10% margin 148.5; counter 150; 120 < 121.5 so Decline.
  const q = quote({ capacity: 100, varCost: 20, channel: 10, nights: [{ date: '', demand: 100, price: 150, group: 30 }], offer: { rate: 120, pickup: 100, resale: 0, commission: 0, hurdle: 10 }, extras: { a: 0, b: 0, c: 0, margin: 0 } });
  check(q.T.displaced === 30 && q.T.net === -450 && q.beRate === 135 && Math.abs(q.target - 148.5) < 1e-9 && q.counter === 150 && q.verdict === 'Decline', 'quote maths: hand-worked displacement example');

  await page.goto(`${BASE}/money/large-order-quote/`); await page.waitForTimeout(400);
  await page.selectOption('.loq .loq-cur', 'USD');
  const kp = async () => (await page.textContent('.loq .loq-kpis')).replace(/\s+/g, ' ');
  let k = await kp();
  check(k.includes('Negotiate') && k.includes('$347') && k.includes('$105') && k.includes('$120'), 'quote: hotel example is Negotiate, net $347, break-even $105, counter $120 (' + k + ')');
  await page.fill('.loq [data-k="rate"]', '130'); await page.waitForTimeout(100);
  check((await kp()).includes('Accept'), 'quote: a high price is Accepted');
  await page.fill('.loq [data-k="rate"]', '60'); await page.waitForTimeout(100);
  check((await kp()).includes('Decline') && (await page.textContent('.loq .loq-take')).includes('Decline at this price'), 'quote: a low price is Declined');
  await page.selectOption('.loq .loq-preset', 'bulk'); await page.waitForTimeout(100);
  check((await kp()).includes('Negotiate') && (await page.textContent('.loq .loq-quote')).includes('Break-even price'), 'quote: bulk order example and the quote review');
  await page.fill('.loq [data-k="pickup"]', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.loq .loq-warn')).includes('take-up'), 'quote: zero take-up is flagged');
  await page.click('.loq .loq-reset'); await page.click('.loq .loq-add'); await page.waitForTimeout(100);
  check((await page.locator('.loq .loq-nights tbody tr').count()) === 5, 'quote: a day can be added');
};
