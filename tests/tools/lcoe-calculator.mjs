// #676 LCOE calculator
export const path = '/science/lcoe-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/lcoe-calculator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.lco .lcoe-big'), facts = () => page.textContent('.lco .lcoe-facts');
  check((await big()) === 'LCOE 52.04 per MWh (0.0520 per kWh)', `lcoe: solar example (${await big()})`);
  { const t = await facts(); check(t.includes('96,360 MWh') && t.includes('2,690,676 MWh') && t.includes('1,139,584 MWh discounted') && t.includes('59,306,781') && t.includes('0.08059') && t.includes('49.60 per MWh'), 'lcoe: energy, present values, CRF and shortcut'); }
  check((await page.getAttribute('.lco .lcoe-parts', 'aria-label')).includes('Capital 43.88') && (await page.getAttribute('.lco .lcoe-parts', 'aria-label')).includes('Fixed O&M 8.17'), 'lcoe: breakdown figure');
  check((await page.textContent('.lco .lcoe-tornote')).includes('Capacity factor (43.37 to 65.05)') && await page.isVisible('.lco .lcoe-torfig'), 'lcoe: tornado led by capacity factor');
  check(await page.$$eval('.lco .lcoe-tab tr', (r) => r.length) === 32, 'lcoe: cash flow table has years 0 to 30');
  // New options: working line, solve for a target price, discount rate by capacity factor grid.
  await page.evaluate(() => document.querySelectorAll('.lco details').forEach((d) => { d.open = true; }));
  check((await page.textContent('.lco .lcoe-work')) === 'Working: LCOE = present value of all costs ÷ present value of all energy = 59,306,781 ÷ 1,139,584 MWh = 52.04 per MWh.', `lcoe: working line (${await page.textContent('.lco .lcoe-work')})`);
  check((await page.textContent('.lco .lcoe-solved')).includes('Type a price'), 'lcoe: solve prompt before a target is typed');
  await page.fill('.lco .lcoe-tp', '40'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-solved')) === 'For 40.00 per MWh, capital cost (per kW) would need to be about 725.53 (it is 1,000.00 now).', `lcoe: capital cost for 40 (${await page.textContent('.lco .lcoe-solved')})`);
  await page.selectOption('.lco .lcoe-sk', 'cf'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-solved')).includes('about 28.62 % (it is 22 % now)'), `lcoe: capacity factor for 40 (${await page.textContent('.lco .lcoe-solved')})`);
  await page.selectOption('.lco .lcoe-sk', 'rate'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-solved')).includes('about 3.994 % (it is 7 % now)'), 'lcoe: discount rate for 40');
  await page.selectOption('.lco .lcoe-sk', 'fom'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-solved')).startsWith('No fixed O&M'), `lcoe: unreachable target explained (${await page.textContent('.lco .lcoe-solved')})`);
  await page.fill('.lco .lcoe-tp', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-solved')).includes('above 0'), 'lcoe: bad target message');
  await page.fill('.lco .lcoe-tp', '');
  { const g = await page.textContent('.lco .lcoe-grid'); check(await page.$$eval('.lco .lcoe-grid tr', (r) => r.length) === 6 && g.includes('17.6 %') && g.includes('54.81') && g.includes('52.04') && g.includes('50.70'), `lcoe: rate by capacity factor grid (${g})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lco .lcoe-gcsv')]); check(d.suggestedFilename() === 'lcoe-grid.csv', 'lcoe: grid CSV'); }
  await page.selectOption('.lco .lcoe-ex', 'gas'); await page.waitForTimeout(200);
  check((await big()).startsWith('LCOE 71.05 per MWh') && (await page.getAttribute('.lco .lcoe-parts', 'aria-label')).includes('Fuel 46.42') && /(Fuel price|Heat rate) \(61\.77 to 80\.34\)/.test(await page.textContent('.lco .lcoe-tornote')), 'lcoe: gas example and fuel-led tornado');
  check(!(await facts()).includes('equals the full sum'), 'lcoe: shortcut differs when costs rise');
  await page.selectOption('.lco .lcoe-ex', 'wind'); await page.waitForTimeout(200);
  check((await big()).startsWith('LCOE 53.14 per MWh'), `lcoe: wind example (${await big()})`);
  await page.fill('.lco .lcoe-degr', '0'); await page.waitForTimeout(200);
  check((await facts()).includes('equals the full sum here'), 'lcoe: shortcut equals the full sum without output loss or cost rise');
  await page.fill('.lco .lcoe-tor', '10'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-tornote')).startsWith('Each input moved 10 %'), 'lcoe: tornado range');
  await page.fill('.lco .lcoe-rate', '0'); await page.waitForTimeout(200);
  check(/LCOE [\d.]+ per MWh/.test(await big()), 'lcoe: zero discount rate works');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lco .lcoe-csv')]); const f = OUT + 'lcoe.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('year,energy_MWh') && rows.length === 29 && rows[28].startsWith('LCOE_per_MWh,'), 'lcoe: cash flow CSV'); }
  await page.fill('.lco .lcoe-cf', '120'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-err')).includes('capacity factor') && await page.isHidden('.lco .lcoe-out'), 'lcoe: bad capacity factor message');
  await page.fill('.lco .lcoe-cf', '35'); await page.fill('.lco .lcoe-life', '2.5'); await page.waitForTimeout(200);
  check((await page.textContent('.lco .lcoe-err')).includes('whole years'), 'lcoe: bad lifetime message');
  await page.fill('.lco .lcoe-life', '25'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lco .dl [data-f=docx]')]); const f = OUT + 'lcoe.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'lcoe: Word report'); }
};
