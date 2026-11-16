// #1726 India tax
import { indiaTax, breakEven, yearly, nextExtra } from '../../src/lib/money/india-income-tax.ts';
export const path = '/money/india-income-tax/';
export default async ({ page, check, BASE }) => {
  // Hand-worked cases, FY 2026-27 slabs (Income Tax Department tax rates; PIB Budget 2025 and 2026 releases).
  const b = { age: 'under60', other: 0, hra: 0, c80: 0, d80: 0, d80parents: 0, parentsSenior: false, home: 0, nps: 0 };
  const a = indiaTax({ ...b, salary: 1500000, c80: 150000, d80: 25000 });
  check(a.new.taxable === 1425000 && a.new.total === 97500 && a.old.taxable === 1275000 && a.old.total === 202800 && a.better === 'new', `india-income-tax: 15 lakh -> new 97,500, old 2,02,800 (got ${a.new.total}, ${a.old.total})`);
  const z = indiaTax({ ...b, salary: 1275000 });
  check(z.new.taxable === 1200000 && z.new.rebate === 60000 && z.new.total === 0, `india-income-tax: 12.75 lakh salary pays no tax in the new regime (got ${z.new.total})`);
  const m = indiaTax({ ...b, salary: 1285000 });
  check(m.new.total === 10400, `india-income-tax: marginal relief at 12.85 lakh -> 10,400 (got ${m.new.total})`);
  const s = indiaTax({ ...b, salary: 5500000 });
  check(s.new.surcharge === 120750 && s.new.total === 1381380, `india-income-tax: 55 lakh -> surcharge 1,20,750, total 13,81,380 (got ${s.new.total})`);

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.iit-col[data-reg=new] .iit-tot')).includes('97,500'), 'india-income-tax: page shows the worked example (new regime 97,500)');
  check((await page.textContent('.iit-col[data-reg=old] .iit-tot')).includes('2,02,800'), 'india-income-tax: page shows old regime 2,02,800');
  await page.fill('.iit-sal', '1275000'); await page.waitForTimeout(100);
  check((await page.textContent('.iit-col[data-reg=new] .iit-tot')).trim() === '₹0', 'india-income-tax: typing 12,75,000 gives zero new-regime tax');

  // More options.
  const en = indiaTax({ ...b, salary: 1500000, employerNps: 100000, basic: 600000 });
  check(en.new.taxable === 1341000 && en.old.taxable === 1390000, `india-income-tax: employer NPS capped at 14% (new) and 10% (old) of basic (got ${en.new.taxable}, ${en.old.taxable})`);
  check(breakEven({ ...b, salary: 1500000, c80: 150000, d80: 25000 }) === 369000 && breakEven({ ...b, salary: 0 }) === 0, 'india-income-tax: break-even deductions for the 15 lakh example is 3,69,000');
  const tta = indiaTax({ ...b, salary: 1000000, other: 30000, savingsInterest: 30000 });
  const e80 = indiaTax({ ...b, salary: 1000000, eduLoan: 100000 });
  check(tta.old.deductions.some((d) => d.label.includes('80TTA') && d.amount === 10000) && e80.old.deductions.some((d) => d.label.includes('80E') && d.amount === 100000), 'india-income-tax: 80TTA capped at 10,000, 80E uncapped');
  check(yearly(125000) === 1500000 && yearly(NaN) === 0 && nextExtra({ ...b, salary: 1500000 }, 100000).new === 15600, 'india-income-tax: monthly to yearly and next 1,00,000');
  check(!Number.isNaN(indiaTax({ ...b, salary: NaN, other: -4 }).new.total), 'india-income-tax: blank salary never gives NaN');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
  await page.fill('.iit-sal', '1500000'); await page.fill('.iit-80c', '150000'); await page.fill('.iit-80d', '25000'); await page.waitForTimeout(100);
  check((await page.textContent('.iit-be')).includes('3,69,000'), 'india-income-tax: page shows the break-even deductions');
  await page.selectOption('.iit-unit', 'month'); await page.fill('.iit-sal', '125000'); await page.waitForTimeout(100);
  check((await page.textContent('.iit-col[data-reg=new] .iit-tot')).includes('97,500'), 'india-income-tax: monthly 1,25,000 equals yearly 15 lakh');
  await page.selectOption('.iit-unit', 'year'); await page.fill('.iit-sal', ''); await page.waitForTimeout(100);
  check((await page.textContent('.iit-verdict')).includes('Type your salary') && !(await page.textContent('.iit-res')).includes('NaN'), 'india-income-tax: blank salary gives a friendly message, no NaN');
};
