// #T998 Gold allowance
import { goldDuty, allowanceGrams } from '../../src/lib/money/gold-allowance.ts';
export const path = '/money/gold-allowance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/gold-allowance/`); await page.waitForTimeout(300);
  const txt = async (c) => (await page.textContent(`.ga ${c}`)).replace(/\s+/g, ' ');
  // Worked example: 50 g of 22K, 24K at 12,000/g, female, 18 months abroad: 40 g free, 10 g x 11,000 = 1,10,000; 15% = 16,500 + 3% IGST of 1,26,500 = 3,795.
  check((await txt('.ga-s-free')).includes('40 g') && (await txt('.ga-s-dut')).includes('1,10,000'), 'gold-allowance: 40 g free, 1,10,000 dutiable (' + (await txt('.ga-s-dut')) + ')');
  check((await txt('.ga-s-duty')).includes('20,295') && (await txt('.ga-s-pg')).includes('11,405.90'), 'gold-allowance: duty 20,295 and 11,405.90 a gram (' + (await txt('.ga-s-duty')) + ')');
  check((await txt('.ga-gap')).includes('48,455'), 'gold-allowance: saves 48,455 against the India price (' + (await txt('.ga-gap')) + ')');
  await page.selectOption('.ga [data-k="sex"]', 'm'); await page.waitForTimeout(100);
  check((await txt('.ga-s-free')).includes('20 g'), 'gold-allowance: 20 g for any other passenger');
  await page.selectOption('.ga [data-k="sex"]', 'f'); await page.fill('.ga [data-k="months"]', '3'); await page.waitForTimeout(100);
  check((await txt('.ga-s-duty')).includes('2,11,750') && (await txt('.ga-gap')).includes('more'), 'gold-allowance: 3 months abroad pays 38.5% baggage rate on all 50 g (' + (await txt('.ga-s-duty')) + ')');
  await page.fill('.ga [data-k="grams"]', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.ga .ga-err'), 'gold-allowance: zero weight shows a message');
  check(allowanceGrams(true, 13, true) === 40 && allowanceGrams(true, 12, true) === 0 && allowanceGrams(false, 24, false) === 0, 'gold-allowance: lib allowance needs more than 12 months and Indian origin');
  const b = goldDuty({ grams: 30, karat: 24, price24: 10000, female: false, monthsAbroad: 8, indianOrigin: true, eligibleRate: 15, igst: 3, baggageRate: 38.5, india24: 0 });
  check(b.freeGrams === 0 && b.eligible && Math.abs(b.total - (45000 + 0.03 * 345000)) < 1e-6, 'gold-allowance: lib 8 months abroad, eligible rate on all');
};
