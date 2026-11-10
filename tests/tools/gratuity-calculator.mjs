// #1729 Gratuity
import { indiaGratuity, uaeGratuity, saudiGratuity } from '../../src/lib/money/gratuity-calculator.ts';
export const path = '/money/gratuity-calculator/';
export default async ({ page, check, BASE }) => {
  const near = (a, b) => Math.abs(a - b) < 0.5;
  const i = indiaGratuity({ salary: 50000, years: 10, months: 0, covered: true, fixedTerm: false });
  check(i.payable === 288462 && i.exempt === 288462 && i.taxable === 0, `gratuity-calculator: India 50,000 x 10 yr -> 2,88,462 (got ${i.payable})`);
  const r = indiaGratuity({ salary: 50000, years: 9, months: 7, covered: true, fixedTerm: false });
  check(r.countYears === 10 && indiaGratuity({ salary: 50000, years: 9, months: 6, covered: true, fixedTerm: false }).countYears === 9, 'gratuity-calculator: India over 6 months rounds up, 6 months does not');
  const big = indiaGratuity({ salary: 500000, years: 20, months: 0, covered: true, fixedTerm: false, received: 3000000 });
  check(big.exempt === 2000000 && big.taxable === 1000000, `gratuity-calculator: India tax-free capped at 20 lakh (got ${big.exempt}, ${big.taxable})`);
  const u = uaeGratuity({ basic: 10000, years: 7, months: 0 });
  check(near(u.amount, 55000) && near(uaeGratuity({ basic: 10000, years: 0, months: 11 }).amount, 0) && near(uaeGratuity({ basic: 10000, years: 30, months: 0 }).amount, 240000), `gratuity-calculator: UAE 10,000 x 7 yr -> 55,000; under 1 yr 0; cap 2 years (got ${u.amount})`);
  const s = saudiGratuity({ wage: 8000, years: 7, months: 0, resigned: true });
  check(near(s.full, 36000) && near(s.amount, 24000), `gratuity-calculator: Saudi 8,000 x 7 yr -> 36,000, 24,000 on resignation (got ${s.amount})`);

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.gc-out')).includes('2,88,462'), 'gratuity-calculator: page shows the India worked example');
  await page.click('.gc-tabs [data-c=ae]'); await page.waitForTimeout(100);
  check((await page.textContent('.gc-out')).includes('55,000'), 'gratuity-calculator: UAE tab shows AED 55,000');
  await page.click('.gc-tabs [data-c=sa]'); await page.check('.gc-sa-r'); await page.waitForTimeout(100);
  check((await page.textContent('.gc-out')).includes('24,000'), 'gratuity-calculator: Saudi resignation shows SAR 24,000');
};
