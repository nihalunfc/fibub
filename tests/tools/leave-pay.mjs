// #T997 Leave pay
import { leavePay } from '../../src/lib/money/leave-pay.ts';
export const path = '/money/leave-pay/';
export default async ({ page, check, BASE }) => {
  const near = (a, b) => Math.abs(a - b) < 0.01;
  const u = leavePay({ country: 'ae', years: 3, months: 8, basic: 6000, allowances: 3000, taken: 5, carried: 4, priceDays: 10 });
  check(u.earned === 20 && u.left === 19 && near(u.leaveSalary, 3000) && near(u.inLieu, 3800), `leave-pay: UAE worked example 20 earned, 19 left, AED 3,000 and 3,800 (got ${u.earned}, ${u.left}, ${u.leaveSalary}, ${u.inLieu})`);
  check(leavePay({ country: 'ae', years: 0, months: 5, basic: 6000, allowances: 0, taken: 0, carried: 0, priceDays: 0 }).earned === 0 && leavePay({ country: 'ae', years: 0, months: 9, basic: 6000, allowances: 0, taken: 0, carried: 0, priceDays: 0 }).earned === 18, 'leave-pay: UAE first year, none under 6 months, then 2 days a month');
  const qa = leavePay({ country: 'qa', years: 6, months: 6, basic: 10000, allowances: 4000, taken: 0, carried: 0, priceDays: 0 });
  check(qa.yearDays === 28 && qa.earned === 14 && near(qa.inLieu, 14 * 10000 / 30), `leave-pay: Qatar 4 weeks after 5 years, on basic only (got ${qa.yearDays}, ${qa.inLieu})`);
  const sa = leavePay({ country: 'sa', years: 2, months: 6, basic: 8000, allowances: 2000, taken: 0, carried: 0, priceDays: 0 });
  check(sa.yearDays === 21 && sa.earned === 10.5 && near(sa.inLieu, 10.5 * 10000 / 30) && leavePay({ country: 'sa', years: 5, months: 0, basic: 1, allowances: 0, taken: 0, carried: 0, priceDays: 0 }).yearDays === 30, 'leave-pay: Saudi 21 days on the wage, 30 from 5 years');
  check(leavePay({ country: 'om', years: 1, months: 0, basic: 500, allowances: 0, taken: 3, carried: 2, priceDays: 0 }).left === 0 && leavePay({ country: 'om', years: 1, months: 0, basic: 500, allowances: 0, taken: 3, carried: 2, priceDays: 0 }).overdrawn, 'leave-pay: more days taken than earned gives 0 left and a flag');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const lieu = await page.textContent('.lp-lieu');
  check(lieu.includes('AED 3,800') && (await page.textContent('.lp-sal')).includes('AED 3,000') && (await page.textContent('.lp-left')).includes('19'), `leave-pay: page shows the UAE worked example (got ${lieu})`);
  await page.click('.lp-tabs [data-c=qa]'); await page.waitForTimeout(100);
  check(!(await page.isChecked('.lp-inc')) && (await page.textContent('.lp-fine')).includes('79') && (await page.textContent('.lp-sal')).includes('QAR 2,000'), 'leave-pay: Qatar tab uses basic only and cites the article');
  await page.fill('.lp-b', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.lp-answer')).includes('Type your monthly basic') && !(await page.textContent('.lp')).includes('NaN'), 'leave-pay: zero basic shows a message, no NaN');
};
