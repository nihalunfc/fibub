// #319 insect degree-days
export const path = '/science/insect-degree-days/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.idd ';
  const big = () => page.textContent(R + '.idd-big'), when = () => page.textContent(R + '.idd-when');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await big()) === '533.6 degree-days (°C) from 1 Apr 2026 to 14 Jun 2026', `degree-days: example total (${await big()})`);
  check((await when()).includes('reached on 21 May 2026'), 'degree-days: example target date');
  check((await page.textContent(R + '.idd-facts')).includes('no missing days') && await page.isVisible(R + '.idd-fig') && await page.isVisible(R + '.idd-tfig'), 'degree-days: facts and both charts');
  check((await page.$$(R + '.idd-tab tbody tr')).length === 75 && (await page.textContent(R + '.idd-tab tr.hit')).startsWith('2026-05-21'), 'degree-days: table of 75 days, target day marked');
  await page.selectOption(R + '.idd-cut', 'vertical'); await page.waitForTimeout(350);
  check((await big()).startsWith('523.1 '), 'degree-days: vertical cutoff');
  await page.selectOption(R + '.idd-method', 'average'); await page.selectOption(R + '.idd-cut', 'horizontal'); await page.waitForTimeout(350);
  check((await big()).startsWith('503.0 ') && (await when()).includes('24 May 2026'), 'degree-days: simple average');
  await page.fill(R + '.idd-hi', ''); await page.waitForTimeout(350);
  check((await big()).startsWith('504.9 ') && await page.isHidden(R + '.idd-cutw'), 'degree-days: no upper threshold hides the cutoff');
  await page.selectOption(R + '.idd-method', 'sine'); await page.fill(R + '.idd-hi', '30'); await page.fill(R + '.idd-start', '2026-04-15'); await page.waitForTimeout(350);
  check((await big()).startsWith('502.5 degree-days (°C) from 15 Apr 2026') && (await when()).includes('24 May 2026'), 'degree-days: biofix');
  await page.fill(R + '.idd-start', ''); await page.fill(R + '.idd-target', '700'); await page.waitForTimeout(350);
  check((await when()).includes('13.0 DD a day') && (await when()).includes('27 Jun 2026'), `degree-days: projected date (${await when()})`);
  await page.selectOption(R + '.idd-unit', 'F'); await page.waitForTimeout(350);
  check((await page.inputValue(R + '.idd-lo')) === '50' && (await page.inputValue(R + '.idd-hi')) === '86', 'degree-days: unit switch converts thresholds');
  await page.selectOption(R + '.idd-unit', 'C'); await page.fill(R + '.idd-target', '250'); await page.waitForTimeout(350);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.idd-csv')]); const f = OUT + 'dd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 76 && rows[0] === 'date,min_C,max_C,degree_days,cumulative_degree_days' && Math.abs(+rows[75].split(',')[4] - 533.5748) < 0.001, 'degree-days: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'degree-days: PDF report'); }
  await page.fill(R + '.idd-data', 'date,min,max\n03/04/2026,5,25\n04/04/2026,8,22'); await page.waitForTimeout(350);
  check((await big()).includes('from 3 Apr 2026 to 4 Apr 2026'), 'degree-days: day-first dates');
  await page.selectOption(R + '.idd-dmy', 'mdy'); await page.waitForTimeout(350);
  check((await big()).includes('from 4 Mar 2026 to 4 Apr 2026') && (await page.textContent(R + '.idd-facts')).includes('30 missing days'), 'degree-days: month-first dates and the gap warning');
  await page.fill(R + '.idd-hi', '5'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.idd-err')).includes('upper threshold must be') && await page.isHidden(R + '.idd-out'), 'degree-days: bad upper threshold message');
  await page.fill(R + '.idd-hi', '30'); await page.fill(R + '.idd-data', 'hello'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.idd-err')).includes('date, min, max'), 'degree-days: unreadable data message');
};
