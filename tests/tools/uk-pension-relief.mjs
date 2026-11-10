// #1788 Pension tax relief
import { relief, allowanceFor, statePensionAge } from '../../src/lib/money/uk-pension-relief.ts';
export const path = '/money/uk-pension-relief/';
export default async ({ page, check, BASE }) => {
  // Hand-worked with 2026/27 bands: £60,000 in England puts the top £9,730 at 40%, so £5,000 gross gets 40% relief.
  const near = (a, b) => Math.abs(a - b) < 0.02;
  const b = { region: 'ruk', salary: 60000, other: 0, gross: 5000, employer: 0, unused: [0, 0, 0], flexi: false };
  const r = relief(b);
  check(near(r.ras.cost, 3000) && near(r.ras.claim, 1000) && near(r.ras.providerAdds, 1000) && near(r.netpay.cost, 3000) && near(r.sacrifice.cost, 2900), 'uk-pension-relief: £60k England, £5k gross: cost £3,000, claim £1,000, sacrifice £2,900');
  const s = relief({ ...b, region: 'scot', salary: 50000, gross: 4000 });
  check(near(s.ras.claim, 880) && near(s.ras.relief, 1680), 'uk-pension-relief: Scotland 42% band: claim 22% = £880 (GOV.UK rule)');
  const low = relief({ ...b, salary: 10000, gross: 2000 });
  check(near(low.ras.relief, 400) && near(low.netpay.relief, 0), 'uk-pension-relief: under the personal allowance, relief at source still gives 20%, net pay none');
  check(allowanceFor(300000, 320000) === 30000 && allowanceFor(150000, 400000) === 60000 && allowanceFor(400000, 500000) === 10000, 'uk-pension-relief: taper (£1 per £2 over £260,000, floor £10,000, only over £200,000 threshold income)');
  const c = relief({ ...b, salary: 300000, gross: 0, employer: 50000, unused: [5000, 5000, 5000] });
  check(c.allowance === 15000 && c.carryUsed === 15000 && c.excess === 20000 && near(c.charge, 9000), 'uk-pension-relief: £35k over, £15k carried forward, £20k charged at 45%');
  const a = statePensionAge(1960, 9, 20), z = statePensionAge(1961, 3, 6);
  check(a.years === 66 && a.months === 6 && z.years === 67 && z.months === 0, 'uk-pension-relief: State Pension age 66 and 6 months (Sep 1960), 67 (Mar 1961)');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.upr-cost')).includes('3,000') && (await page.textContent('.upr-claim')).includes('1,000'), 'uk-pension-relief: page shows the worked example');
  await page.fill('.upr-sal', '300000'); await page.fill('.upr-e', '60000'); await page.waitForTimeout(100);
  check((await page.textContent('.upr-aa')).includes('tapered') && await page.isVisible('.upr-aa .bad'), 'uk-pension-relief: high earner sees the taper and a charge');
  await page.fill('.upr-dob', '1960-09-20'); await page.waitForTimeout(100);
  check((await page.textContent('.upr-spa')).includes('66 and 6 months'), 'uk-pension-relief: date of birth gives the State Pension age');
};
