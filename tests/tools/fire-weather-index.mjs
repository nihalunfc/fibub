// #337 Canadian Forest Fire Weather Index System
export const path = '/science/fire-weather-index/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.fwx ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await t('.fw-big')) === '2026-06-30: FWI 9.4', 'fire weather: example last day');
  { const f = await t('.fw-facts'); check(f.includes('FFMC 84.8, DMC 11.9, DC 50.9') && f.includes('15.5') && f.includes('on 2026-06-11') && f.includes('Mean FWI4.9') && f.includes('Seasonal severity rating0.7'), 'fire weather: example facts'); }
  { const tb = await t('.fw-tab'); check(tb.includes('2026-06-01') && tb.includes('92.3') && tb.includes('13.9'), 'fire weather: table first day'); }
  check(await page.isVisible(R + '.fw-fig1') && await page.isVisible(R + '.fw-fig2'), 'fire weather: both charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fw-csv')]); const f = OUT + 'fwi.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const last = rows[30].split(','); check(rows.length === 31 && rows[0].startsWith('day,month,temp_c') && last[0] === '2026-06-30' && Math.abs(+last[11] - 9.38879) < 1e-3, 'fire weather: CSV'); }
  await fill('.fw-f0', '60'); check(!(await t('.fw-tab')).includes('92.3'), 'fire weather: start-up FFMC changes the run');
  await fill('.fw-f0', '200'); check((await t('.fw-err')).includes('FFMC from 0 to 101') && await page.isHidden(R + '.fw-out'), 'fire weather: bad start-up message');
  await fill('.fw-f0', '85');
  // No dates: month from the list; then a month column.
  await fill('.fw-data', '23.1,22,17,0\n18.1,53,2,6');
  check((await t('.fw-big')).startsWith('Day 2: FWI'), 'fire weather: rows without dates use the month list');
  const june = await t('.fw-facts'); await page.selectOption(R + '.fw-mon', '10'); await page.waitForTimeout(400);
  check((await t('.fw-facts')) !== june, 'fire weather: month changes day-length factors');
  await fill('.fw-data', 'month,temp,rh,wind,rain\n6,23.1,22,17,0\n6,18.1,53,2,6');
  await page.selectOption(R + '.fw-mon', '1'); await page.waitForTimeout(400);
  check((await t('.fw-facts')) === june, 'fire weather: month column');
  await fill('.fw-data', '2026-06-01,23.1,120,17,0'); check((await t('.fw-err')).includes('relative humidity'), 'fire weather: bad humidity message');
  await fill('.fw-data', '2026-13-01,23.1,20,17,0'); check((await t('.fw-err')).includes('YYYY-MM-DD'), 'fire weather: bad date message');
  await fill('.fw-data', '2026-06-01,23.1,22,17,0\n2026-06-02,18.1,53,2,6.0');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `fire-weather-index.${f}`, `fire weather: ${f} download`); }
};
