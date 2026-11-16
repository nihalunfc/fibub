// #1741 EPF calculator
import { epf, epfMonth, epfReal, epsPension } from '../../src/lib/money/epf-calculator.ts';
export const path = '/money/epf-calculator/';
export default async ({ page, check, BASE }) => {
  const rules = { employee: 12, employer: 12, ceiling: 25000, inEps: true, capWages: false };
  const m = epfMonth(20000, rules);
  check(m.you === 2400 && m.eps === 1666 && m.boss === 734, `epf-calculator: 20,000 -> 2,400 / EPS 1,666 / EPF 734 (got ${JSON.stringify(m)})`);
  check(epfMonth(15000, { ...rules, ceiling: 15000 }).eps === 1250 && epfMonth(60000, rules).eps === 2083, 'epf-calculator: EPS capped at 8.33% of the ceiling (1,250 at 15,000; 2,083 at 25,000)');
  check(epfMonth(20000, { ...rules, inEps: false }).boss === 2400, 'epf-calculator: not in EPS sends all 12% to EPF');
  const one = epf({ basic: 20000, ...rules, raise: 0, rate: 8.25, ageNow: 57, retireAge: 58, opening: 0 }).at(-1);
  check(Math.abs(one.balance - 39288.61) < 0.01, `epf-calculator: hand case one year = 39,288.61 (got ${one.balance})`);

  await page.goto(`${BASE}${path}`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ await page.waitForTimeout(300);
  const set = (k, v) => page.fill(`.ec [data-k="${k}"]`, v);
  const txt = (c) => page.textContent(`.ec ${c}`);
  await set('basic', '20000'); await set('raise', '0'); await set('age', '57'); await set('retire', '58'); await page.waitForTimeout(100);
  check((await page.textContent('.ec .ec-s-fv')).includes('39,289'), 'epf-calculator: page shows 39,289 (' + (await page.textContent('.ec .ec-s-fv')) + ')');
  check((await page.textContent('.ec .ec-s-eps')).includes('19,992'), 'epf-calculator: EPS total for the year 19,992');
  await set('retire', '50'); await page.waitForTimeout(100);
  check(await page.isVisible('.ec .ec-err'), 'epf-calculator: retirement before today shows a message');
  check(epfMonth(20000, { ...rules, vpf: 3 }).you === 3000, 'epf-calculator: VPF of 3% adds to your share (15% of 20,000 = 3,000)');
  const withV = epf({ basic: 20000, ...rules, vpf: 3, raise: 0, rate: 8.25, ageNow: 57, retireAge: 58, opening: 0 }).at(-1).balance;
  check(withV > 39288.61, 'epf-calculator: VPF raises the balance');
  check(epsPension(60000, 25000, 20).monthly === 7143 && !epsPension(60000, 25000, 9).eligible && Math.abs(epfReal(106000, 6, 1) - 100000) < 1e-6, 'epf-calculator: pension 25,000 x 20 / 70 = 7,143, needs 10 years');
  await set('retire', '58'); await set('vpf', '3'); await page.waitForTimeout(100);
  check(!(await txt('.ec-s-fv')).includes('39,289'), 'epf-calculator: page balance changes with VPF');
  await set('vpf', '0'); await set('infl', '6'); await set('served', '10'); await page.waitForTimeout(100);
  check((await txt('.ec-real')).includes('today') && (await txt('.ec-pen')).includes('3,143'), 'epf-calculator: inflation and pension lines (' + (await txt('.ec-pen')) + ')');
};
