// #1742 NPS calculator
import { nps } from '../../src/lib/money/nps-calculator.ts';
export const path = '/money/nps-calculator/';
export default async ({ page, check, BASE }) => {
  const near = (a, b, d = 1) => Math.abs(a - b) < d;
  const o = nps({ monthly: 5000, stepUp: 0, rate: 10, ageNow: 59, exitAge: 60, opening: 0, annuityShare: 20, annuityRate: 6 });
  check(near(o.corpus, 63351.41) && near(o.annuity, 12670.28) && near(o.lump, 50681.12) && near(o.pension, 63.35, 0.01), `nps-calculator: hand case 5,000 x 12 at 10% = 63,351; 20% annuity at 6% = 63/month (got ${o.corpus}, ${o.pension})`);
  check(near(nps({ monthly: 0, stepUp: 0, rate: 0, ageNow: 50, exitAge: 60, opening: 100000, annuityShare: 40, annuityRate: 6 }).pension, 200), 'nps-calculator: 1 lakh, 40% annuity at 6% = 200 a month');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const set = (k, v) => page.fill(`.nc [data-k="${k}"]`, v);
  await set('age', '59'); await page.waitForTimeout(100);
  check((await page.textContent('.nc .nc-s-fv')).includes('63,351') && (await page.textContent('.nc .nc-s-pen')).includes('63'), 'nps-calculator: page shows the hand case (' + (await page.textContent('.nc .nc-s-fv')) + ')');
  check((await page.textContent('.nc .nc-rule')).includes('8 lakh'), 'nps-calculator: small corpus note shows');
  await page.selectOption('.nc [data-k="sector"]', 'government'); await page.waitForTimeout(100);
  check((await page.inputValue('.nc [data-k="ann"]')) === '40', 'nps-calculator: government sector sets the annuity share to 40%');
  await set('ann', '30'); await page.waitForTimeout(100);
  check(await page.isVisible('.nc .nc-err'), 'nps-calculator: annuity below the minimum shows a message');
};
