// #1787 Social Security age
import { fraMonths, factor, benefit, breakEven } from '../../src/lib/money/social-security-age.ts';
export const path = '/money/social-security-age/';
export default async ({ page, check, BASE }) => {
  // SSA's table (ssa.gov/oact/ProgData/ar_drc.html): 1955 -> 74 1/6% at 62, 98 8/9% at 66, 130 2/3% at 70; 1960+ -> 70%, 86 2/3% at 65, 124% at 70.
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const f55 = fraMonths(1955), f60 = fraMonths(1964);
  check(f55 === 794 && f60 === 804 && fraMonths(1960, true) === 802 && fraMonths(1950) === 792, 'social-security-age: full retirement ages (1955: 66 and 2 months; Jan 1 1960 uses 1959)');
  check(near(factor(744, f55), 0.74 + 1 / 600) && near(factor(792, f55), 0.98 + 8 / 900) && near(factor(840, f55), 1.30 + 2 / 300), 'social-security-age: 1955 row matches SSA table');
  check(near(factor(744, f60), 0.70) && near(factor(780, f60), 0.86 + 2 / 300) && near(factor(840, f60), 1.24), 'social-security-age: 1960+ row matches SSA table');
  check(benefit(2000, 744, f60) === 1400 && benefit(2000, 840, f60) === 2480 && Math.abs(breakEven(2000, 744, 840, f60) - 80.370) < 0.001 && Math.abs(breakEven(2000, 744, 804, f60) - 78.667) < 0.001, 'social-security-age: worked example 1,400 / 2,480, break-even 80.4 and 78.7');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.ssa-fra')).trim() === '67' && (await page.textContent('.ssa-body')).includes('1,400'), 'social-security-age: page shows FRA 67 and $1,400 at 62');
  await page.selectOption('.ssa-start', '840'); await page.waitForTimeout(100);
  check((await page.textContent('.ssa-m')).includes('2,480') && (await page.textContent('.ssa-line')).includes('82.5'), 'social-security-age: start at 70 gives $2,480 and break-even 82.5 with 67');
  await page.fill('.ssa-yr', '1957'); await page.waitForTimeout(100);
  check((await page.textContent('.ssa-fra')).includes('66 and 6 months'), 'social-security-age: 1957 gives 66 and 6 months');
  await page.fill('.ssa-pia', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.ssa-err'), 'social-security-age: missing PIA shows a message');
};
