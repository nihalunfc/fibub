// #T1069 Demand forecaster
import { easter, quantile, ma7, holt, fitForecast, specials, analyse, importHistory } from '../../src/lib/biz/forecast.ts';
export const path = '/money/demand-forecaster/';
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export default async ({ page, check, BASE }) => {
  check(easter(2026) === '2026-04-05' && easter(2027) === '2027-03-28', 'forecast maths: Easter Sunday 2026 and 2027');
  check(quantile([1, 2, 3, 4, 5], 0.5) === 3 && Math.abs(quantile([1, 2, 3, 4, 5], 0.1) - 1.4) < 1e-12 && ma7([1, 2, 3, 4, 5, 6, 7])[3] === 4, 'forecast maths: quantile and the 7-day average');
  check(holt([1, 5, 9], 1, 0, 1).at(3) === 9 && Math.abs(holt([10, 10, 10, 10], 0.2, 0.05, 0.98).at(5) - 10) < 1e-12, 'forecast maths: damped trend of a flat series is flat');
  const sp = specials('ca', ['2026-07-10']);
  check(sp('2026-12-31') && sp('2026-07-10') && sp('2026-09-06') && !sp('2026-09-07'), 'forecast maths: special days (New Year\'s Eve, your own date, Sunday before Labour Day)');
  // A flat history of 50 a day forecasts 50 a day, with a zero-width miss.
  const rows = []; let d = new Date(2026, 0, 1, 12);
  for (let i = 0; i < 120; i++) { rows.push([iso(d), 50, 100, null]); d.setDate(d.getDate() + 1); }
  const a = analyse({ rows, capacity: 100, horizon: 30, s30: 45, isSpecial: specials('none'), otb: {} });
  check(a.fc.length === 30 && a.fc.every((p) => Math.abs(p.fin - 50) < 1e-9) && a.bt && a.bt.mape < 1e-9, 'forecast maths: flat history gives a flat forecast and a perfect back-test');
  const b = analyse({ rows, capacity: 100, horizon: 30, s30: 45, isSpecial: specials('none'), otb: { [a.fc[0].date]: 20 } });
  check(b.fc[0].fin >= 20 && b.fc[0].fin <= 50 && b.fc[0].otb === 20, 'forecast maths: bookings on hand are blended in');
  check(importHistory('date,sold\n2026-01-01,5', 100).error.includes('60 days'), 'forecast maths: too little history is refused');

  await page.goto(`${BASE}/money/demand-forecaster/`); await page.waitForTimeout(600);
  await page.selectOption('.df .df-cur', 'USD');
  check((await page.locator('.df .df-daily tbody tr').count()) === 60 && (await page.textContent('.df .df-kpis')).includes('Forecast use of capacity'), 'forecaster: the example forecasts 60 days');
  check((await page.textContent('.df .df-acc')).includes('Typical miss') && (await page.locator('.df .df-month tbody tr').count()) >= 3, 'forecaster: accuracy and month table');
  await page.click('.df .df-horizon [data-h="30"]'); await page.waitForTimeout(150);
  check((await page.locator('.df .df-daily tbody tr').count()) === 30, 'forecaster: 30 days ahead');
  // Your own history: flat 50 a day for 120 days ending yesterday.
  const end = new Date(); end.setDate(end.getDate() - 1);
  const lines = ['date\tsold\tcapacity']; for (let i = 119; i >= 0; i--) { const x = new Date(end); x.setDate(x.getDate() - i); lines.push(`${iso(x)}\t50\t100`); }
  await page.fill('.df .df-paste', lines.join('\n')); await page.click('.df .df-use'); await page.waitForTimeout(300);
  const k = (await page.textContent('.df .df-kpis')).replace(/\s+/g, ' ');
  check((await page.textContent('.df .df-src')).includes('your') && k.includes('1,500') && k.includes('50%'), 'forecaster: your own flat history gives 1,500 over 30 days at 50% (' + k + ')');
  const first = page.locator('.df .df-daily input[data-d]').first(); await first.fill('30'); await first.press('Tab'); await page.waitForTimeout(250);
  check((await page.textContent('.df .df-take')).includes('Bookings on hand are blended in for 1 day'), 'forecaster: typing bookings blends them in');
  await page.fill('.df .df-paste', 'date,sold\n2026-01-01,5'); await page.click('.df .df-use'); await page.waitForTimeout(100);
  check((await page.textContent('.df .df-imp')).includes('60 days'), 'forecaster: too little history shows a message');
};
