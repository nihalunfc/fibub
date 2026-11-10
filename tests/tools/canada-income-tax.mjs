// #1725 Canada tax
import { canadaTax } from '../../src/lib/money/canada-income-tax.ts';
export const path = '/money/canada-income-tax/';
export default async ({ page, check, BASE }) => {
  // Hand-worked cases (2026 figures from CRA T4127 and canada.ca, worked out by hand in the builder's notes).
  const near = (a, b) => Math.abs(a - b) < 0.02;
  const on = canadaTax({ prov: 'ON', employment: 60000, other: 0, rrsp: 0 });
  check(near(on.cpp, 3361.75) && near(on.ei, 978) && near(on.federal, 5338.30) && near(on.provincial, 2382.20) && near(on.healthPremium, 600) && near(on.takeHome, 47339.75), `canada-income-tax: Ontario 60k take-home 47,339.75 (got ${on.takeHome})`);
  const ab = canadaTax({ prov: 'AB', employment: 100000, other: 0, rrsp: 0 });
  check(near(ab.cpp, 4230.45) && near(ab.cpp2, 416) && near(ab.ei, 1123.07) && near(ab.federal, 13301.60) && near(ab.provincial, 6470.38), `canada-income-tax: Alberta 100k federal 13,301.60 + AB 6,470.38 (got ${ab.federal} + ${ab.provincial})`);
  const qc = canadaTax({ prov: 'QC', employment: 60000, other: 0, rrsp: 0 });
  check(near(qc.federal, 4427.35) && near(qc.provincial, 5646.62) && near(qc.cpp, 3559.50) && near(qc.qpip, 258), `canada-income-tax: Quebec 60k federal after abatement 4,427.35, QC 5,646.62 (got ${qc.federal}, ${qc.provincial})`);
  const rr = canadaTax({ prov: 'ON', employment: 60000, other: 0, rrsp: 5000 });
  check(rr.incomeTax < on.incomeTax && near(on.marginal, 0.2965), 'canada-income-tax: RRSP lowers tax; Ontario 60k marginal 29.65%');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.cit-year')).includes('47,339.75'), 'canada-income-tax: page shows the worked example take-home');
  await page.selectOption('.cit-prov', 'AB');
  await page.fill('.cit-emp', '100000');
  await page.waitForTimeout(100);
  check((await page.textContent('.cit-body')).includes('6,470.38'), 'canada-income-tax: switching to Alberta 100k updates the table');
};
