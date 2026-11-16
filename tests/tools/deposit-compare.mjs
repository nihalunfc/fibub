// #T999 Deposit compare
import { compareDeposits, yearFactor } from '../../src/lib/money/deposit-compare.ts';
export const path = '/money/deposit-compare/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/deposit-compare/`); await page.waitForTimeout(300);
  await page.selectOption('.dc [data-k="cur"]', 'USD'); await page.waitForTimeout(100);
  const txt = async (c) => (await page.textContent(`.dc ${c}`)).replace(/\s+/g, ' ');
  // Worked example: US$10,000 at 88, 3 years quarterly, rupee -2%/yr; NRE 6.5% -> 10,67,799 (US$11,434); NRO 6.5% taxed 31.2% -> 10,06,598; FCNR 4% -> US$11,268.
  const body = await txt('.dc-body');
  check(body.includes('10,67,799') && body.includes('11,434') && body.includes('4.57%'), 'deposit-compare: NRE row matches the worked example (' + body.slice(0, 90) + ')');
  check(body.includes('10,06,598') && body.includes('2.53%') && body.includes('11,268') && body.includes('4.06%'), 'deposit-compare: NRO and FCNR(B) rows match');
  check((await txt('.dc-lead')).includes('NRE fixed deposit'), 'deposit-compare: NRE leaves the most at a 2% rupee fall');
  await page.fill('.dc [data-k="drift"]', '3'); await page.waitForTimeout(100);
  check((await txt('.dc-lead')).includes('FCNR(B)'), 'deposit-compare: at a 3% rupee fall FCNR(B) comes out ahead');
  await page.click('.dc [data-t="10"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.dc [data-k="tax"]')) === '10', 'deposit-compare: treaty preset sets NRO tax');
  await page.fill('.dc [data-k="fx"]', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.dc .dc-err'), 'deposit-compare: zero rate shows a message');
  const r = compareDeposits({ amount: 1000, fx: 80, years: 1, perYear: 1, drift: 0, nre: 5, nro: 5, fcnr: 5, nroTax: 0 });
  check(Math.abs(r.rows[0].fx - 1050) < 1e-9 && Math.abs(r.rows[1].fx - 1050) < 1e-9 && Math.abs(r.rows[2].inr - 84000) < 1e-6 && Math.abs(yearFactor(4, 4) - 1.01 ** 4) < 1e-12, 'deposit-compare: lib with no tax and no drift gives equal results');
};
