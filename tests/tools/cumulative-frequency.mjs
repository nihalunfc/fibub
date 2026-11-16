// #L355 Cumulative frequency
export const path = '/learn/cumulative-frequency/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/cumulative-frequency/`); await page.waitForTimeout(300);
  const o = page.locator('.cf .cf-out');
  await page.click('.cf [data-style=line]');
  check((await o.getAttribute('data-n')) === '40' && Math.abs(+(await o.getAttribute('data-median')) - 165) < 0.01, 'cumulative-frequency: heights data, n = 40, straight-line median 165');
  check(Math.abs(+(await o.getAttribute('data-q1')) - 156.667) < 0.01 && Math.abs(+(await o.getAttribute('data-iqr')) - 16.667) < 0.01, 'cumulative-frequency: Q1 156.7 and IQR 16.7');
  check((await page.locator('.cf .cf-cum').allTextContents()).join(',') === '4,13,27,36,40', 'cumulative-frequency: cumulative column 4,13,27,36,40');
  await page.click('.cf [data-level="11"]');
  await page.fill('.cf .cf-x', '170'); await page.dispatchEvent('.cf .cf-x', 'input');
  check(Math.abs(+(await o.getAttribute('data-above')) - 13) < 0.01, 'cumulative-frequency: 13 are above 170');
  await page.fill('.cf .cf-p', '50'); await page.dispatchEvent('.cf .cf-p', 'input');
  check(Math.abs(+(await o.getAttribute('data-pct')) - 165) < 0.01, 'cumulative-frequency: 50th percentile is the median');
  await page.click('.cf [data-style=smooth]');
  const m = +(await o.getAttribute('data-median')); check(m > 160 && m < 170, 'cumulative-frequency: smooth median is in the median class');
  await page.fill('.cf .cf-f >> nth=2', '30'); await page.dispatchEvent('.cf .cf-f >> nth=2', 'input');
  check((await o.getAttribute('data-n')) === '56', 'cumulative-frequency: editing a frequency updates n');
  { const a = await page.getAttribute('.cf .lq-item', 'data-ans'); await page.fill('.cf .lq-in', a); await page.click('.cf .lq-check');
    check((await page.textContent('.cf .lq-fb')) === 'Right.', 'cumulative-frequency: quiz accepts the right answer'); }
};
