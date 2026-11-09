// #216 degree days (heating, cooling, growing)
export const path = '/science/degree-days/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/degree-days/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.dgd .dgd-big');
  const wait = () => page.waitForTimeout(450);
  check((await big()) === 'Heating 3180.9, cooling 415.5, growing 1518.4 degree days (°C) from 1 Jan 2025 to 31 Dec 2025', 'degree days: example year, single sine');
  { const f = await page.textContent('.dgd .dgd-facts'); check(f.includes('Days counted365') && f.includes('1 missing day filled') && f.includes('Aug 2025 (348.5 growing)') && f.includes('Jan 2025 (602.4)'), 'degree days: facts (missing day filled, peak months)'); }
  { const t = await page.textContent('.dgd .dgd-mtab'); check(t.includes('Mar 2025') && t.includes('31 (1 filled)') && t.includes('343.9') && t.includes('Total'), 'degree days: monthly table'); }
  check(await page.locator('.dgd .dgd-tab tr.filled').count() === 1 && (await page.textContent('.dgd .dgd-tab tr.filled')).includes('2025-03-14 (filled)'), 'degree days: the filled day is marked in the daily table');
  check(await page.isVisible('.dgd .dgd-cfig') && await page.isVisible('.dgd .dgd-mfig') && await page.isVisible('.dgd .dgd-tfig'), 'degree days: three charts');
  const methods = [['mean', '3065.9, cooling 300.4, growing 1464.3'], ['triangle', '3142.0, cooling 376.6, growing 1501.0'], ['modified', '3065.9, cooling 300.4, growing 1569.3']];
  for (const [m, want] of methods) { await page.selectOption('.dgd .dgd-method', m); await wait(); check((await big()).includes(want), `degree days: ${m} method`); }
  check((await page.textContent('.dgd .dgd-facts')).includes('heating and cooling use the plain mean'), 'degree days: modified average note');
  await page.selectOption('.dgd .dgd-method', 'sine');
  await page.selectOption('.dgd .dgd-gap', 'skip'); await wait();
  check((await big()).startsWith('Heating 3164.4') && (await page.textContent('.dgd .dgd-facts')).includes('left out') && await page.locator('.dgd .dgd-tab tbody tr').count() === 364, 'degree days: missing day left out');
  await page.selectOption('.dgd .dgd-gap', 'interp');
  await page.fill('.dgd .dgd-start', '2025-04-15'); await wait();
  check((await big()).includes('growing 1514.9') && (await big()).includes('from 15 Apr 2025'), 'degree days: start date');
  await page.fill('.dgd .dgd-start', '');
  await page.fill('.dgd .dgd-hb', '15.5'); await page.fill('.dgd .dgd-cb', '22'); await wait();
  check((await big()).startsWith('Heating 2526.0, cooling 143.8'), 'degree days: separate heating and cooling bases');
  await page.fill('.dgd .dgd-hb', '18'); await page.fill('.dgd .dgd-cb', '18');
  await page.fill('.dgd .dgd-gu', ''); await wait();
  check((await page.textContent('.dgd .dgd-facts')).includes('no upper cutoff'), 'degree days: no upper cutoff');
  await page.fill('.dgd .dgd-gu', '30');
  await page.selectOption('.dgd .dgd-unit', 'F'); await wait();
  check(await page.inputValue('.dgd .dgd-hb') === '64.4' && await page.inputValue('.dgd .dgd-gb') === '50' && await page.inputValue('.dgd .dgd-gu') === '86', 'degree days: switching to °F converts the bases');
  // The example in °F (converted), as numpy gives: 5725.67, 747.86, 2733.04.
  await page.evaluate(() => { const t = document.querySelector('.dgd .dgd-data'); t.value = t.value.split('\n').map((l, i) => i ? l.split('\t').map((c, j) => j ? String(+(+c * 1.8 + 32).toFixed(2)) : c).join('\t') : l).join('\n'); t.dispatchEvent(new Event('input', { bubbles: true })); });
  await wait();
  check((await big()) === 'Heating 5725.7, cooling 747.9, growing 2733.0 degree days (°F) from 1 Jan 2025 to 31 Dec 2025', 'degree days: same year in °F is 1.8 times larger');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dgd .dgd-csv')]); const f = OUT + 'dgd-days.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 366 && rows[0].startsWith('date,min_F,max_F,mean_F,filled,heating_dd') && rows[73].includes(',yes,'), 'degree days: daily CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dgd .dgd-mcsv')]); const f = OUT + 'dgd-months.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[1].startsWith('2025-01,31,0,') && rows[3].startsWith('2025-03,31,1,'), 'degree days: monthly CSV'); }
  await page.click('.dgd .dgd-ex'); await wait();
  check(await page.inputValue('.dgd .dgd-unit') === 'C' && await page.inputValue('.dgd .dgd-hb') === '18' && (await big()).startsWith('Heating 3180.9'), 'degree days: load the example resets to °C');
  // Mean-only data with a blank day and a US date order.
  await page.selectOption('.dgd .dgd-dmy', 'mdy');
  await page.fill('.dgd .dgd-data', 'date,mean\n01/30/2026,10\n01/31/2026,\n02/01/2026,14'); await wait();
  check((await big()).startsWith('Heating 18.0, cooling 0.0, growing 6.0') && (await page.textContent('.dgd .dgd-facts')).includes('only daily means'), 'degree days: mean-only data with a gap filled');
  await page.fill('.dgd .dgd-data', 'nothing here'); await wait();
  check((await page.textContent('.dgd .dgd-err')).includes('No rows with a date') && await page.isHidden('.dgd .dgd-out'), 'degree days: no data message');
  await page.fill('.dgd .dgd-data', '2026-01-01,1,5\n2026-01-01,2,6'); await wait();
  check((await page.textContent('.dgd .dgd-err')).includes('appears twice'), 'degree days: duplicate date message');
  await page.fill('.dgd .dgd-data', '2026-01-01,1,5'); await page.fill('.dgd .dgd-gu', '5'); await wait();
  check((await page.textContent('.dgd .dgd-err')).includes('upper cutoff must be'), 'degree days: bad cutoff message');
  await page.fill('.dgd .dgd-gu', '30'); await page.fill('.dgd .dgd-hb', 'x'); await wait();
  check((await page.textContent('.dgd .dgd-err')).includes('Type a number for each base'), 'degree days: bad base message');
  await page.fill('.dgd .dgd-hb', '18'); await page.selectOption('.dgd .dgd-dmy', 'dmy'); await page.click('.dgd .dgd-ex'); await wait();
};
