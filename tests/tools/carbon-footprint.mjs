// #505 Carbon footprint
export const path = '/science/carbon-footprint/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cfp';
  await page.goto(`${BASE}/science/carbon-footprint/`); await page.waitForTimeout(500);
  const big = () => page.textContent(`${R} .cf-big`), sub = () => page.textContent(`${R} .cf-sub`), tab = () => page.textContent(`${R} .cf-tab`);
  const set = async (sel, v) => { await page.fill(sel, v); await page.waitForTimeout(100); };
  check((await page.textContent(`${R} .cf-warn`)).includes("Example values, replace with your country's official factors"), 'footprint: example-values notice');
  check((await big()) === '12.11 t CO₂e a year' && (await sub()).startsWith('6.05 t per person (2 people)'), `footprint: example total (${await big()})`);
  { const t = await tab(); check(t.includes('Home energy4,00033 %') && t.includes('Flights1,0068 %') && t.includes('Food (per person)3,28527 %') && t.includes('Total12,106100 %'), 'footprint: category table'); }
  check((await page.textContent(`${R} .cf-dist`)) === 'Shortest distance 3,354 km × 2 flights = 1.01 t CO₂e', 'footprint: flight distance');
  check(!(await page.isChecked(`${R} .cf-rem`)), 'footprint: remember is off by default');
  // Scenario 1
  await set(`${R} .cf-sname`, 'Now'); await page.click(`${R} .cf-keep`); await page.waitForTimeout(150);
  // Change the electricity factor and keep scenario 2
  await set(`${R} [data-cat="home"] .cf-fac >> nth=0`, '0.05');
  check((await big()) === '10.71 t CO₂e a year', 'footprint: green tariff factor');
  await set(`${R} .cf-sname`, 'Green tariff'); await page.click(`${R} .cf-keep`); await page.waitForTimeout(150);
  { const t = await page.textContent(`${R} .cf-stab`); check(t.includes('Now4,0002,1151,0063,2851,70012,1066,053–') && t.includes('Green tariff2,6002,1151,0063,2851,70010,7065,353−12 %'), `footprint: scenario table (${t.slice(0, 200)})`); }
  // People scale food only
  await set(`${R} .cf-people`, '3');
  check((await big()) === '12.35 t CO₂e a year' && (await sub()).startsWith('4.12 t per person (3 people)'), 'footprint: three people');
  // Load scenario 1 back
  await page.click(`${R} .cf-load >> nth=0`); await page.waitForTimeout(150);
  check((await big()) === '12.11 t CO₂e a year' && (await page.inputValue(`${R} .cf-people`)) === '2', 'footprint: load a scenario');
  // Flights: uplift, typed distance, add and bad coordinates
  await set(`${R} .cf-up`, '8');
  check((await page.textContent(`${R} .cf-dist`)).includes('3,354 km × 2 flights + 8 % = 1.09 t'), 'footprint: routing uplift');
  await set(`${R} .cf-up`, '0');
  await page.click(`${R} .cf-addf`); await page.waitForTimeout(100);
  await set(`${R} .cf-fl >> nth=1 >> .cf-km`, '1000');
  await page.uncheck(`${R} .cf-fl >> nth=1 >> .cf-retbox`); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .cf-fl >> nth=1 >> .cf-dist`)) === 'Typed distance 1,000 km × 1 flight = 150 kg CO₂e' && (await big()) === '12.26 t CO₂e a year', 'footprint: typed one-way flight');
  await set(`${R} .cf-fl >> nth=1 >> .cf-km`, '');
  await set(`${R} .cf-fl >> nth=1 >> .cf-from`, '10, 10');
  check((await page.textContent(`${R} .cf-err`)).includes('type both ends as latitude, longitude'), 'footprint: half-typed flight message');
  await page.click(`${R} .cf-fl >> nth=1 >> .cf-x`); await page.waitForTimeout(100);
  check(await page.isHidden(`${R} .cf-err`), 'footprint: remove a flight');
  // Add a line in home energy
  await page.click(`${R} [data-cat="home"] .cf-add`); await page.waitForTimeout(100);
  await set(`${R} [data-cat="home"] .cf-lab input >> nth=2`, 'Wood');
  await set(`${R} [data-cat="home"] .cf-amt >> nth=2`, '1000');
  await set(`${R} [data-cat="home"] .cf-fac >> nth=2`, '0.1');
  check((await big()) === '12.21 t CO₂e a year', 'footprint: add a line');
  await set(`${R} [data-cat="home"] .cf-amt >> nth=2`, '-4');
  check((await page.textContent(`${R} .cf-err`)).includes('Home energy, Wood: the amount cannot be negative.'), 'footprint: negative amount');
  await page.click(`${R} [data-cat="home"] .cf-x >> nth=2`); await page.waitForTimeout(100);
  check((await big()) === '12.11 t CO₂e a year', 'footprint: remove a line');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .cf-csv`)]); const f = OUT + 'cf.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('category,item,amount,unit,factor_kg_co2e_per_unit,people_multiplier,kg_co2e\nHome energy,Electricity,4000,kWh,0.4,1,1600\n') && t.includes('Flights,Toronto to Vancouver,6708.908,passenger-km,0.15,1,1006.336') && t.trim().endsWith('Total,,,,,,12106.336'), 'footprint: CSV of lines'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .cf-scsv`)]); const f = OUT + 'cfs.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('scenario,home_energy_kg_co2e,car_and_transit_kg_co2e,flights_kg_co2e,food_per_person_kg_co2e,goods_and_services_kg_co2e,total_kg_co2e,per_person_kg_co2e\nNow,4000,2115,1006,3285,1700,12106,6053\n'), `footprint: scenarios CSV (${t.split('\n')[0]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .cf-out [data-f="pdf"]`)]); const f = OUT + 'cf.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'carbon-footprint.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'footprint: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .cf-out [data-f="docx"]`)]); check(d.suggestedFilename() === 'carbon-footprint.docx', 'footprint: Word report'); }
  // Remove a scenario
  await page.click(`${R} .cf-rm >> nth=1`); await page.waitForTimeout(100);
  check((await page.locator(`${R} .cf-stab tbody tr`).count()) === 1, 'footprint: remove a scenario');
  // Remember: off saves nothing; on saves and reloads; delete removes
  check((await page.evaluate(() => localStorage.getItem('fibub-footprint-v1'))) === null, 'footprint: nothing stored while unticked');
  await page.check(`${R} .cf-rem`); await set(`${R} .cf-people`, '4');
  check(JSON.parse(await page.evaluate(() => localStorage.getItem('fibub-footprint-v1'))).state.people === 4, 'footprint: stored once ticked');
  await page.reload(); await page.waitForTimeout(500);
  check((await page.inputValue(`${R} .cf-people`)) === '4' && (await page.isChecked(`${R} .cf-rem`)) && (await page.locator(`${R} .cf-stab tbody tr`).count()) === 1, 'footprint: numbers back after reload');
  await page.click(`${R} .cf-del`); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-footprint-v1'))) === null && !(await page.isChecked(`${R} .cf-rem`)), 'footprint: delete saved numbers');
  await page.click(`${R} .cf-reset`); await page.waitForTimeout(100);
  check((await big()) === '12.11 t CO₂e a year', 'footprint: start again from the example');
  await page.click(`${R} .cf-blank`); await page.waitForTimeout(100);
  check((await big()) === '0 kg CO₂e a year', 'footprint: clear all amounts');
  await set(`${R} .cf-people`, '0');
  check((await page.textContent(`${R} .cf-err`)).includes('People in the household is a whole number'), 'footprint: bad people count');
};
