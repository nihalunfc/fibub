// #1726 India tax
import { indiaTax } from '../../src/lib/money/india-income-tax.ts';
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
};
