// #1740 PPF calculator
import { ppf, ppfReal, ppfAtRates, maturityFy, fyLabel } from '../../src/lib/money/ppf-calculator.ts';
export const path = '/money/ppf-calculator/';
export default async ({ page, check, BASE }) => {
  const base = { deposit: 150000, rate: 7.1, timing: 'start', extensions: 0, extendDeposits: true };
  const fv = ppf(base).at(-1).balance;
  check(Math.abs(fv - 4068209) < 2, `ppf-calculator: 1.5 lakh/yr at 7.1% for 15 yr = 40.68 lakh (got ${fv})`);
  const mon = ppf({ ...base, timing: 'monthly' }).at(-1).balance;
  check(ppf({ ...base, timing: 'end' }).at(-1).balance < mon && mon < fv, 'ppf-calculator: paying earlier earns more');
  const ext = ppf({ ...base, extensions: 1, extendDeposits: false });
  check(ext.length === 21 && Math.abs(ext.at(-1).balance - fv * Math.pow(1.071, 5)) < 2, 'ppf-calculator: a 5-year extension without deposits grows at the rate only');

  await page.goto(`${BASE}${path}`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ await page.waitForTimeout(300);
  const txt = (c) => page.textContent(`.pc ${c}`);
  check((await txt('.pc-s-fv')).includes('40,68,209'), 'ppf-calculator: page shows 40,68,209 (' + (await txt('.pc-s-fv')) + ')');
  check((await page.$$('.pc .pc-body tr')).length === 15, 'ppf-calculator: fifteen rows in the year table');
  await page.selectOption('.pc [data-k="ext"]', '1'); await page.waitForTimeout(100);
  check((await page.$$('.pc .pc-body tr')).length === 20 && (await txt('.pc-s-yrs')).includes('20'), 'ppf-calculator: extension adds 5 rows');
  await page.fill('.pc [data-k="dep"]', '200000'); await page.waitForTimeout(100);
  check(await page.isVisible('.pc .pc-err'), 'ppf-calculator: more than 1.5 lakh shows a message');
  check(maturityFy(2026, 15) === '2041-42' && fyLabel(2099) === '2099-00', 'ppf-calculator: maturity financial year');
  check(Math.abs(ppfReal(106000, 6, 1) - 100000) < 1e-6, 'ppf-calculator: real value');
  const sc = ppfAtRates(base, [6, 7.1, 8]);
  check(sc[1].balance === fv && sc[0].balance < fv && sc[2].balance > fv, 'ppf-calculator: higher rate gives more');
  await page.fill('.pc [data-k="dep"]', '150000'); await page.selectOption('.pc [data-k="ext"]', '0');
  await page.click('.pc [data-dep="60000"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.pc [data-k="dep"]')) === '60000', 'ppf-calculator: quick amount fills the deposit');
  await page.fill('.pc [data-k="dep"]', '150000'); await page.fill('.pc [data-k="infl"]', '6'); await page.fill('.pc [data-k="fy"]', '2026'); await page.waitForTimeout(100);
  check((await txt('.pc-real')).includes('today'), 'ppf-calculator: inflation line shown');
  check((await txt('.pc-mat')).includes('2041-42') && (await txt('.pc-mat')).includes('31 March 2042'), 'ppf-calculator: maturity year shown (' + (await txt('.pc-mat')) + ')');
  check((await page.$$('.pc .pc-sc-body tr')).length >= 6, 'ppf-calculator: rate scenarios table');
};
