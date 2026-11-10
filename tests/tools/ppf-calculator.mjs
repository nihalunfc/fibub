// #1740 PPF calculator
import { ppf } from '../../src/lib/money/ppf-calculator.ts';
export const path = '/money/ppf-calculator/';
export default async ({ page, check, BASE }) => {
  const base = { deposit: 150000, rate: 7.1, timing: 'start', extensions: 0, extendDeposits: true };
  const fv = ppf(base).at(-1).balance;
  check(Math.abs(fv - 4068209) < 2, `ppf-calculator: 1.5 lakh/yr at 7.1% for 15 yr = 40.68 lakh (got ${fv})`);
  const mon = ppf({ ...base, timing: 'monthly' }).at(-1).balance;
  check(ppf({ ...base, timing: 'end' }).at(-1).balance < mon && mon < fv, 'ppf-calculator: paying earlier earns more');
  const ext = ppf({ ...base, extensions: 1, extendDeposits: false });
  check(ext.length === 21 && Math.abs(ext.at(-1).balance - fv * Math.pow(1.071, 5)) < 2, 'ppf-calculator: a 5-year extension without deposits grows at the rate only');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const txt = (c) => page.textContent(`.pc ${c}`);
  check((await txt('.pc-s-fv')).includes('40,68,209'), 'ppf-calculator: page shows 40,68,209 (' + (await txt('.pc-s-fv')) + ')');
  check((await page.$$('.pc .pc-body tr')).length === 15, 'ppf-calculator: fifteen rows in the year table');
  await page.selectOption('.pc [data-k="ext"]', '1'); await page.waitForTimeout(100);
  check((await page.$$('.pc .pc-body tr')).length === 20 && (await txt('.pc-s-yrs')).includes('20'), 'ppf-calculator: extension adds 5 rows');
  await page.fill('.pc [data-k="dep"]', '200000'); await page.waitForTimeout(100);
  check(await page.isVisible('.pc .pc-err'), 'ppf-calculator: more than 1.5 lakh shows a message');
};
