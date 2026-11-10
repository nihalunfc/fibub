// #1727 UK tax
import { ukTax } from '../../src/lib/money/uk-income-tax.ts';
export const path = '/money/uk-income-tax/';
export default async ({ page, check, BASE }) => {
  // Hand-worked cases with GOV.UK 2026/27 figures (personal allowance 12,570; bands; NI 8%/2%; Plan 2 from 29,385).
  const near = (a, b) => Math.abs(a - b) < 0.02;
  const b = { region: 'ruk', salary: 50000, other: 0, pension: 0, pensionType: 'none', loans: [] };
  const e = ukTax(b);
  check(near(e.tax, 7486) && near(e.ni, 2994.40) && near(e.takeHome, 39519.60), `uk-income-tax: England 50k take-home 39,519.60 (got ${e.takeHome})`);
  check(near(ukTax({ ...b, region: 'scot' }).tax, 8982.05), 'uk-income-tax: Scotland 50k tax 8,982.05');
  const t = ukTax({ ...b, salary: 110000, loans: ['plan2'] });
  check(t.allowance === 7570 && near(t.tax, 33432) && near(t.ni, 4210.60) && near(t.loans, 7255.35), 'uk-income-tax: 110k taper to 7,570, tax 33,432, NI 4,210.60, Plan 2 7,255.35');
  const s = ukTax({ ...b, salary: 110000, pension: 10000, pensionType: 'sacrifice' });
  const r = ukTax({ ...b, salary: 110000, pension: 10000, pensionType: 'ras' });
  check(near(s.takeHome, 68557.40) && near(r.tax, 29432) && near(r.takeHome, 68357.40), 'uk-income-tax: 10k pension, sacrifice 68,557.40 and relief at source tax 29,432');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.uit-year')).includes('39,519.60'), 'uk-income-tax: page shows the worked example');
  await page.fill('.uit-sal', '110000');
  await page.check('.uit-loans input[value=plan2]');
  await page.waitForTimeout(100);
  check((await page.textContent('.uit-body')).includes('7,255.35'), 'uk-income-tax: ticking Plan 2 adds the repayment');
};
