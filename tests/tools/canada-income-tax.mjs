// #1725 Canada tax
import { canadaTax, nextExtra, compareIncome, rrspSaving, hourlyToYear } from '../../src/lib/money/canada-income-tax.ts';
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

  // More options: next $1,000, comparison, RRSP saving, hourly pay, pay periods, slider, blank input.
  const nx = nextExtra({ prov: 'ON', employment: 60000, other: 0, rrsp: 0 }, 1000);
  check(near(nx.keep + nx.taken, 1000) && nx.keep > 600 && nx.keep < 700, `canada-income-tax: next $1,000 keeps about 64% in Ontario at 60k (got ${nx.keep})`);
  const cm = compareIncome({ prov: 'ON', employment: 60000, other: 0, rrsp: 0 }, 70000);
  check(cm.takeHomeDiff > 0 && cm.takeHomeDiff < 10000 && near(cm.grossDiff, 10000), 'canada-income-tax: comparing 70k with 60k keeps less than the 10k raise');
  check(rrspSaving({ prov: 'ON', employment: 60000, other: 0, rrsp: 5000 }) > 1000 && hourlyToYear(30, 40) === 62400 && hourlyToYear(-5, 40) === 0, 'canada-income-tax: RRSP saving, hourly to year, negative hourly gives 0');
  check(!Number.isNaN(canadaTax({ prov: 'ON', employment: NaN, other: -5, rrsp: 0 }).takeHome), 'canada-income-tax: blank or negative input never gives NaN');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
  await page.selectOption('.cit-prov', 'ON');
  await page.fill('.cit-emp', '60000'); await page.waitForTimeout(100);
  check((await page.textContent('.cit-line')).includes('47,339.75') && (await page.textContent('.cit-next')).includes('next $1,000'), 'canada-income-tax: plain sentence and next $1,000 line show');
  await page.selectOption('.cit-per', 'monthly'); await page.waitForTimeout(100);
  check((await page.textContent('.cit-per-t')).includes('month') && (await page.textContent('.cit-bi')).includes('3,944.98'), 'canada-income-tax: pay period switch shows the monthly amount');
  await page.fill('.cit-cmp', '70000'); await page.waitForTimeout(100);
  check(await page.isVisible('.cit-cmpout'), 'canada-income-tax: compare box shows a sentence');
  await page.selectOption('.cit-unit', 'hour'); await page.fill('.cit-hrate', '30'); await page.waitForTimeout(100);
  check((await page.textContent('.cit-line')).includes('62,400'), 'canada-income-tax: hourly wage 30 x 40 hours = 62,400 a year');
  await page.selectOption('.cit-unit', 'year'); await page.fill('.cit-emp', ''); await page.waitForTimeout(100);
  check((await page.textContent('.cit-line')).includes('Type your pay') && !(await page.textContent('.cit-res')).includes('NaN'), 'canada-income-tax: blank pay gives a friendly message, no NaN');
};
