// #1731 Sales tax
import { split, CANADA, indiaParts } from '../../src/lib/money/sales-tax-calculator.ts';
export const path = '/money/sales-tax-calculator/';
export default async ({ page, check, BASE }) => {
  const near = (a, b) => Math.abs(a - b) < 0.005;
  check(near(split(100, CANADA.ON.parts, 'add').gross, 113), 'sales-tax-calculator: 100 + 13% HST = 113');
  check(near(split(113, CANADA.ON.parts, 'remove').net, 100), 'sales-tax-calculator: 113 including HST -> 100');
  const qc = split(100, CANADA.QC.parts, 'add');
  check(near(qc.gross, 114.975) && near(qc.lines[1].tax, 9.975), 'sales-tax-calculator: Quebec GST + QST on 100 = 114.975');
  const ind = split(1000, indiaParts(18, false), 'add');
  check(near(ind.lines[0].tax, 90) && near(ind.lines[1].tax, 90) && near(ind.gross, 1180), 'sales-tax-calculator: India 18% within a state -> CGST 90 + SGST 90');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.stc-gross')).includes('113.00'), 'sales-tax-calculator: page shows 113.00 for Ontario');
  await page.check('input[name=stc-mode][value=remove]'); await page.fill('.stc-amt', '113'); await page.waitForTimeout(100);
  check((await page.textContent('.stc-net')).includes('100.00'), 'sales-tax-calculator: removing HST from 113 shows 100.00');
  await page.click('.stc-tabs [data-r=uk]'); await page.waitForTimeout(100);
  check((await page.textContent('.stc-taxl')).includes('20%'), 'sales-tax-calculator: UK tab uses 20% VAT');
};
