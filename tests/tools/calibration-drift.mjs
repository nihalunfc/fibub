// #691 calibration interval and drift tracker
export const path = '/science/calibration-drift/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/calibration-drift/`); await page.waitForTimeout(600);
  // Other tools tested earlier in the same browser may have stored their own keys; this tool must add none.
  const keys = () => page.evaluate(() => { try { return Object.keys(localStorage).sort().join('|'); } catch { return ''; } });
  const keys0 = await keys();
  const big = () => page.textContent('.cdr .cd-big'), facts = () => page.textContent('.cdr .cd-facts');
  const set = async (s, v) => { await page.fill(`.cdr ${s}`, v); await page.waitForTimeout(150); };
  check((await big()) === 'Next calibration by 2025-02-18: 11.9 months after the last, for 95 % reliability', 'drift: example headline');
  { const f = await facts(); check(f.includes('+0.0361 kPa per year') && f.includes('+0.0308 to +0.0413') && f.includes('p < 0.001') && f.includes('2025-11-08') && f.includes('2024-12-20') && f.includes('94.9 % chance') && f.includes('−0.25 to 0.25 kPa'), 'drift: example facts'); }
  check(await page.isVisible('.cdr .cd-fig'), 'drift: chart');
  await page.selectOption('.cdr .cd-rel', '0.99'); await page.waitForTimeout(150);
  { const b = await big(); const m = Number(b.match(/: ([\d.]+) months/)?.[1]); check(b.includes('99 % reliability') && m < 11.9, `drift: 99 % reliability gives a shorter interval (${b})`); }
  await page.selectOption('.cdr .cd-rel', '0.95');
  await page.check('.cdr .cd-gb'); await page.waitForTimeout(150);
  check((await facts()).includes('−0.22 to 0.22 kPa (guard-banded)') && !(await big()).includes('11.9 months'), 'drift: guard band');
  await page.uncheck('.cdr .cd-gb'); await set('.cd-lo', '');
  check((await facts()).includes('−∞ to 0.25 kPa'), 'drift: one-sided limit');
  await set('.cd-lo', '-0.25'); await set('.cd-chk', '24');
  check((await facts()).includes('After 24 months'), 'drift: check another interval');
  await set('.cd-chk', '12');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cdr .cd-csv')]); const f = OUT + 'drift.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('date,years from first,as-found error') && rows[1].startsWith('2019-03-12') && rows[rows.length - 1].endsWith('forecast'), 'drift: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cdr .dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'calibration-drift.pdf', 'drift: PDF report'); }
  await set('.cd-data', 'date,error\n2023-01-10,0.02\n2023-07-10,0.01\n2024-01-10,0.03\n2024-07-10,0.02\n2025-01-10,0.02');
  check((await facts()).includes('not significant') && (await facts()).includes('set by the scatter'), 'drift: no significant drift');
  await set('.cd-data', '2024-01-01,0.1\n2024-02-01,0.2');
  check((await page.textContent('.cdr .cd-err')).includes('at least 3 calibrations') && await page.isHidden('.cdr .cd-out'), 'drift: too few rows');
  await set('.cd-data', '2024-01-01,0.1\n2024-06-01,0.2\n2025-01-01,0.25'); await set('.cd-hi', '-1');
  check((await page.textContent('.cdr .cd-err')).includes('upper tolerance limit must be above'), 'drift: bad limits');
  check((await keys()) === keys0, 'drift: nothing stored in the browser');
};
