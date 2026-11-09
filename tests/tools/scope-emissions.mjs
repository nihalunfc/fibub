// #506 Scope 1, 2 and 3 emissions
export const path = '/science/scope-emissions/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ghg';
  await page.goto(`${BASE}/science/scope-emissions/`); await page.waitForTimeout(500);
  const big = () => page.textContent(`${R} .gh-big`), sub = () => page.textContent(`${R} .gh-sub`), sum = () => page.textContent(`${R} .gh-sum`);
  check((await page.textContent(`${R} .gh-warn`)).includes('Example factors: replace them with official ones'), 'scopes: example-factors notice');
  check((await big()) === '2025: 99.12 t CO₂e (market-based)' && (await sub()) === '−26.5 % on 2024 (−35.78 t).', `scopes: example headline (${await big()} ${await sub()})`);
  { const s = await sum(); check(s.includes('Scope 129.5024.82−15.9 %') && s.includes('Scope 2, location-based32.0028.88−9.8 %') && s.includes('Scope 2, market-based36.003.80−89.4 %') && s.includes('Scope 369.4070.50+1.6 %'), 'scopes: scope lines');
    check(s.includes('Total, market-based134.9099.12−26.5 %') && s.includes('t per employee11.247.62−32.2 %') && s.includes('t per million revenue67.4543.10−36.1 %'), `scopes: totals and intensity`); }
  { const c = await page.textContent(`${R} .gh-cat`); check(c.includes('1Fugitive (refrigerant leaks)2.002 %') && c.includes('2Purchased electricity3.804 %') && c.includes('31 Purchased goods and services48.0048 %'), 'scopes: categories (market-based)'); }
  // Location-based headline
  await page.selectOption(`${R} .gh-meth`, 'loc'); await page.waitForTimeout(100);
  check((await big()) === '2025: 124.20 t CO₂e (location-based)' && (await sub()).startsWith('−5.1 % on 2024') && (await page.textContent(`${R} .gh-cat`)).includes('2Purchased electricity28.8823 %'), 'scopes: location-based');
  await page.selectOption(`${R} .gh-meth`, 'mkt');
  // Intensity inputs
  await page.fill(`${R} .gh-yr[data-year="2025"] .gh-emp`, '26'); await page.waitForTimeout(100);
  check((await sum()).includes('t per employee11.243.81'), 'scopes: change employees');
  await page.fill(`${R} .gh-yr[data-year="2025"] .gh-emp`, ''); await page.waitForTimeout(100);
  check((await sum()).includes('t per employee11.24––'), 'scopes: no employees, no intensity');
  // Add a row with the form: a 2026 electricity row without a market factor
  await page.click(`${R} .gh-addbox summary`);
  await page.fill(`${R} .gh-ay`, '2026'); await page.selectOption(`${R} .gh-at`, 'electricity');
  check(await page.isVisible(`${R} .gh-am`) && (await page.textContent(`${R} .gh-ah`)).includes('Scope 2, Purchased electricity'), 'scopes: form shows market factor for Scope 2');
  await page.fill(`${R} .gh-ad`, 'Office, new site'); await page.fill(`${R} .gh-aa`, '10000'); await page.fill(`${R} .gh-af`, '0.3');
  await page.click(`${R} .gh-add`); await page.waitForTimeout(150);
  check((await page.inputValue(`${R} .gh-in`)).endsWith('\n2026,electricity,"Office, new site",10000,kWh,0.3,') && (await big()) === '2026: 3.00 t CO₂e (market-based)', 'scopes: row added with a quoted description');
  check((await page.textContent(`${R} .gh-note`)).includes('2026 (1 row)') && (await page.locator(`${R} .gh-yr`).count()) === 3, 'scopes: missing market factor noted; a year box added');
  await page.selectOption(`${R} .gh-at`, 'refrigerant');
  check(await page.isHidden(`${R} .gh-am`) && (await page.textContent(`${R} .gh-afl`)).startsWith('GWP of the gas') && (await page.inputValue(`${R} .gh-au`)) === 'kg', 'scopes: refrigerant asks for GWP');
  await page.click(`${R} .gh-add`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .gh-aerr`)) === 'Type an amount and a factor.', 'scopes: form needs amount and factor');
  // Downloads (on the example)
  await page.click(`${R} .gh-ex`); await page.waitForTimeout(150);
  check((await page.locator(`${R} .gh-yr`).count()) === 2 && (await page.inputValue(`${R} .gh-yr[data-year="2025"] .gh-emp`)) === '13', 'scopes: example restores the organisation numbers');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .gh-csv`)]); const f = OUT + 'gh.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('year,type,description,amount,unit,factor_kg_co2e_per_unit,market_factor_kg_co2e_per_unit,scope,category,kg_co2e_location,kg_co2e_market\n2024,stationary,Natural gas for heating,60000,kWh,0.2,,1,Stationary combustion,12000,12000\n') && t.includes('2025,electricity,Office and workshop,76000,kWh,0.38,0.05,2,Purchased electricity,28880,3800'), 'scopes: rows CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .gh-scsv`)]); const f = OUT + 'ghs.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('line,t_co2e_2024,t_co2e_2025,change_percent\nScope 1,29.5,24.82,-15.86\n') && t.includes('"Total, market-based",134.9,99.12,-26.52'), `scopes: summary CSV (${t.split('\n')[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .gh-out [data-f="pdf"]`)]); const f = OUT + 'gh.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'scope-emissions.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'scopes: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .gh-out [data-f="docx"]`)]); check(d.suggestedFilename() === 'scope-emissions.docx', 'scopes: Word report'); }
  // Import the exported rows back
  await page.setInputFiles(`${R} .dfb-in`, { name: 'rows.csv', mimeType: 'text/csv', buffer: readFileSync(OUT + 'gh.csv') }); await page.waitForTimeout(400);
  check((await big()) === '2025: 99.12 t CO₂e (market-based)' && (await page.isHidden(`${R} .gh-perr`)), 'scopes: exported CSV opens again');
  // Bad rows and one year only
  await page.fill(`${R} .gh-in`, 'year,type,description,amount,unit,factor\n2025,flying,x,1,u,1\n2025,goods,Paper,1000,spend,0.5'); await page.waitForTimeout(150);
  check((await page.textContent(`${R} .gh-perr`)).includes('Row 2: unknown type "flying"') && (await big()) === '2025: 0.50 t CO₂e (market-based)' && (await sub()) === 'Add a second year to see the change.', 'scopes: bad type and a single year');
  await page.click(`${R} .gh-clear`); await page.waitForTimeout(100);
  check(await page.isHidden(`${R} .gh-out`), 'scopes: clear hides the result');
  await page.click(`${R} .gh-ex`); await page.waitForTimeout(100);
};
