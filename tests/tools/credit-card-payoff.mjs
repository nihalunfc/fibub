// #1746 Card payoff
export const path = '/money/credit-card-payoff/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/credit-card-payoff/`); await page.waitForTimeout(400);
  const cells = () => page.$$eval('.cp .cp-tab tbody tr:first-child td', (t) => t.map((x) => x.textContent));
  const set = async (k, v) => { await page.fill(`.cp [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  let c = await cells();
  check(c[1].includes('yr') && parseInt(c[1]) >= 25, `card payoff: minimum-only takes decades (${c[1]})`);
  check(c[2] === '2 yr 1 mo', `card payoff: 3,000 at 20% with 150 a month = 25 months (${c[2]})`);
  await set('fixed', '40');
  check((await page.textContent('.cp .cp-warn')).includes('never goes down'), 'card payoff: payment below interest warns');
  await set('fixed', '300'); await set('apr', '0'); await set('floor', '0');
  c = await cells();
  check(c[2] === '10 mo', `card payoff: 0% APR 3,000 at 300 = 10 months (${c[2]})`);
  await set('apr', '20'); await set('fixed', '250');
  const fixedInterest = async () => parseFloat((await page.$$eval('.cp .cp-tab tbody tr:nth-child(2) td', (t) => t[2].textContent)).replace(/,/g, ''));
  const before = await fixedInterest();
  await page.check('.cp [data-k="promo"]'); await page.waitForTimeout(100);
  const after = await fixedInterest();
  check(after < before && (await page.textContent('.cp .cp-tab')).includes('Transfer fee'), `card payoff: balance transfer cuts interest (${before} -> ${after})`);
};
