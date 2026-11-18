// #T1033 Delay calculator
export const path = '/everyday/delay-reverb-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/delay-reverb-calculator/`); await page.waitForTimeout(300);
  const cell = (row, col) => page.textContent(`.dl .dl-body tr:nth-child(${row}) td:nth-child(${col + 1})`);
  check((await cell(3, 1)) === '500 ms' && (await cell(4, 2)) === '375 ms' && (await cell(4, 3)) === '166.67 ms', 'delay: 120 BPM quarter 500, dotted eighth 375, eighth triplet 166.67');
  check((await page.textContent('.dl .dl-sug')).includes('31.25 ms') && (await page.textContent('.dl .dl-sug')).includes('2,000 ms'), 'delay: 1/64 pre-delay 31.25 ms and bar decay 2,000 ms');
  await page.fill('.dl .dl-bpm', '90'); await page.waitForTimeout(100);
  check((await cell(3, 1)) === '666.67 ms' && (await cell(1, 1)) === '2,666.67 ms', `delay: 90 BPM quarter 666.67 (${await cell(3, 1)})`);
  await page.fill('.dl .dl-bpm', '120');
  await page.evaluate(() => document.querySelector('.dl details').open = true);
  check((await page.textContent('.dl .dl-samples tr:nth-child(7)')).includes('22,050'), 'delay: 500 ms is 22,050 samples at 44.1 kHz');
  await page.fill('.dl .dl-bpm', '5'); await page.waitForTimeout(100);
  check((await page.textContent('.dl .dl-q')).includes('20 to 400'), 'delay: out of range message');
};
