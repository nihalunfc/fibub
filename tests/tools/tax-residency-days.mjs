// #1778 Residency days
import { indianResidence } from '../../src/lib/money/india-residence.ts';
export const path = '/money/tax-residency-days/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/tax-residency-days/`); await page.waitForTimeout(300);
  const add = async (c, a, b) => { await page.fill('.rd [data-k="country"]', c); await page.fill('.rd [data-k="from"]', a); await page.fill('.rd [data-k="to"]', b); await page.click('.rd .rd-addbtn'); };
  const txt = async (c) => page.textContent(`.rd ${c}`);
  await page.fill('.rd [data-k="year"]', '2025');
  await add('Canada', '2025-01-01', '2025-03-31'); await page.waitForTimeout(100);
  check((await txt('.rd-body')).replace(/\s+/g, ' ').includes('Canada90'), 'Jan 1 to Mar 31 is 90 days both ends counted (' + (await txt('.rd-body')).slice(0, 60) + ')');
  await add('USA', '2025-04-01', '2025-07-09'); await add('United States', '2024-01-01', '2024-06-29'); await add('United States', '2023-01-01', '2023-12-31');
  await page.waitForTimeout(100);
  // 2025: Apr 1 - Jul 9 = 30+31+30+9 = 100 days; 2024: Jan 1 - Jun 29 = 31+29+31+30+31+29 = 181; 2023: 365 -> 100 + 60.33 + 60.83 = 221.17
  check((await txt('.rd-spt-out')).includes('meet the substantial presence test') && (await txt('.rd-spt-body')).includes('221.17'), 'US 100 + 181/3 + 365/6 = 221.17 meets the test (' + (await txt('.rd-spt-body')).replace(/\s+/g, ' ') + ')');
  await page.selectOption('.rd [data-k="region"]', 'uk'); await add('UK', '2025-04-06', '2025-04-10'); await page.waitForTimeout(100);
  check((await page.inputValue('.rd [data-k="counting"]')) === 'midnight', 'UK year switches to midnight counting');
  check((await txt('.rd-body')).replace(/\s+/g, ' ').includes('UK4'), 'UK 6-10 April by midnights = 4 days');
  await page.click('.rd .rd-clear'); await page.waitForTimeout(100);
  check(await page.isVisible('.rd .rd-empty'), 'clear removes all trips');
  await add('', '2025-01-01', '2025-01-02');
  check(await page.isVisible('.rd .rd-err'), 'missing country shows a message');
  // paste: 2025-01-01..2025-01-31 = 31 days, 2025-02-01 = 1 day; the year has 365 days
  await page.selectOption('.rd [data-k="region"]', 'calendar'); await page.fill('.rd [data-k="year"]', '2025');
  await page.evaluate(() => document.querySelectorAll('.rd details').forEach((d) => (d.open = true)));
  await page.fill('.rd .rd-ta', 'Spain, 2025-01-01, 2025-01-31\nSpain; 01/02/2025\nnonsense'); await page.click('.rd .rd-pastebtn'); await page.waitForTimeout(100);
  check((await txt('.rd-body')).replace(/\s+/g, ' ').includes('Spain32'), 'residency: pasted trips give Spain 32 days (' + (await txt('.rd-body')).slice(0, 60) + ')');
  check((await txt('.rd-gap')).includes('333 of 365'), 'residency: 333 uncovered days (' + (await txt('.rd-gap')) + ')');
  check((await txt('.rd-top')).includes('Spain: 32 of 365'), 'residency: most days line');
  // Indian residency status: 130 days in FY 2026-27 (1 Apr to 8 Aug 2026), 365 + 35 = 400 days in the 4 earlier years.
  await page.click('.rd .rd-clear');
  await page.selectOption('.rd [data-k="region"]', 'india'); await page.fill('.rd [data-k="year"]', '2026');
  await add('India', '2026-04-01', '2026-08-08'); await add('India', '2024-04-01', '2025-05-05'); await page.waitForTimeout(100);
  await page.check('.rd [data-k="in-15"]'); await page.waitForTimeout(100);
  const inOut = async () => (await txt('.rd-in-out')).replace(/\s+/g, ' ');
  check((await inOut()).includes('not ordinarily resident') && (await inOut()).includes('130 days') && (await inOut()).includes('400 in the 4'), 'India: visiting citizen, 130 days, 400 earlier, income over 15 lakh is RNOR (' + (await inOut()) + ')');
  await page.uncheck('.rd [data-k="in-15"]'); await page.waitForTimeout(100);
  check((await inOut()).startsWith('Non-resident'), 'India: same visitor with income under 15 lakh is non-resident (60 becomes 182)');
  await page.selectOption('.rd [data-k="in-sit"]', 'none'); await page.waitForTimeout(100);
  check((await inOut()).startsWith('Resident (ordinarily'), 'India: not a visitor, 60 + 365 days makes you resident');
  const B = { days: 10, prior4: 0, citizen: true, pio: false, visiting: false, leftForJob: false, income15: true, taxedElsewhere: false, nr9of10: false, le729: false };
  check(indianResidence(B).status === 'rnor' && indianResidence({ ...B, taxedElsewhere: true }).status === 'nonresident' && indianResidence({ ...B, days: 182 }).status === 'resident' && indianResidence({ ...B, days: 200, nr9of10: true }).status === 'rnor', 'India lib: deemed resident, 182 days, and 9 of 10 years');
};
