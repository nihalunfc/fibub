// #512 snow water, snow load and slope angle
export const path = '/science/snow-slope-tools/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/snow-slope-tools/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent('.sst ' + c);
  const tap = async (c) => { await page.locator('.sst ' + c).scrollIntoViewIfNeeded(); await page.click('.sst ' + c); await page.waitForTimeout(120); };
  check((await t('.sst-note')).includes('Not an avalanche or safety forecast'), 'snow: not-a-forecast notice');
  check((await t('.ss-big')) === 'SWE = 212.5 mm' && (await t('.ss-facts')).includes('2.084 kN/m²'), 'snow: depth and density example');
  check((await t('.rl-big')) === 'Roof load = 1.67 kN/m²' && (await t('.rl-facts')).includes('170 kg/m²') && (await t('.rl-facts')).includes('20.4 tonnes'), 'snow: roof load from the SWE');
  check((await t('.sl-big')) === 'Slope angle = 33.7°' && (await t('.sl-band')).includes('30 to 45°'), 'slope: map example in the 30 to 45° band');
  await page.waitForFunction(() => { const c = document.querySelector('.sst .sl-fig'); return c && c.width > 0; });
  check(await page.isVisible('.sst .sl-fig'), 'slope: band bar drawn');
  await tap('.ss-m [data-v=tube]');
  { const f = await t('.ss-facts'); check((await t('.ss-big')) === 'SWE = 289.8 mm' && f.includes('372 kg/m³') && f.includes('13.6 mm') && f.includes('16.62 cm²') && (await page.locator('.sst .ss-tab tbody tr').count()) === 3, 'snow: snow tube samples'); }
  check((await t('.rl-big')) === 'Roof load = 2.27 kN/m²', 'snow: roof follows the tube SWE');
  await page.fill('.sst .ss-tin', '1300, 1820, 78'); await page.waitForTimeout(100);
  check((await t('.ss-err')).includes('full tube weighs at least') && await page.isHidden('.sst .ss-out') && (await t('.rl-err')).includes('Fix the snow water'), 'snow: bad tube sample message');
  await page.fill('.sst .ss-tin', '1300, 820, 78'); await tap('.ss-m [data-v=lay]');
  check((await t('.ss-big')) === 'SWE = 181.8 mm' && (await t('.ss-facts')).includes('222 kg/m³'), 'snow: layers');
  await page.fill('.sst .ss-lin', '10, 1200'); await page.waitForTimeout(100);
  check((await t('.ss-err')).includes('917'), 'snow: density above ice message');
  await page.fill('.sst .ss-lin', '12, 90\n25, 180\n30, 260\n15, 320'); await tap('.ss-m [data-v=dd]');
  await page.selectOption('.sst .rl-src', 'typed'); await page.fill('.sst .rl-g', '3'); await page.fill('.sst .rl-f', '1'); await page.fill('.sst .rl-a', ''); await page.waitForTimeout(100);
  check((await t('.rl-big')) === 'Roof load = 3.00 kN/m²' && !(await t('.rl-facts')).includes('whole roof') && (await t('.rl-facts')).includes('62.7 lb/ft²'), 'snow: typed ground load, no area');
  await page.selectOption('.sst .rl-src', 'swe'); await page.fill('.sst .rl-f', '0.8'); await page.fill('.sst .rl-a', '120');
  await tap('.sl-m [data-v=gps]');
  check((await t('.sl-big')) === 'Slope angle = 32.9°' && (await t('.sl-facts')).includes('146.8 m'), 'slope: two GPS points');
  await page.fill('.sst .sl-la2', '46.52'); await page.fill('.sst .sl-lo2', '7.98'); await page.waitForTimeout(100);
  check((await t('.sl-err')).includes('same place'), 'slope: same GPS point message');
  await page.fill('.sst .sl-la2', '46.5212'); await page.fill('.sst .sl-lo2', '7.9808');
  await tap('.sl-m [data-v=phone]');
  check((await t('.sl-err')).includes('Start the tilt sensor'), 'slope: phone asks for a reading');
  await tap('.sl-start');
  check((await t('.sl-live')).includes('not allowed') || (await t('.sl-live')).includes('Waiting'), 'slope: sensor permission refused or asked');
  await page.context().grantPermissions(['accelerometer', 'gyroscope', 'magnetometer'], { origin: BASE }); await tap('.sl-start');
  check((await t('.sl-live')).includes('Waiting'), 'slope: sensor started after permission');
  await page.evaluate(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 120, beta: 38, gamma: 0 }))); await page.waitForTimeout(100);
  check((await t('.sl-live')).includes('38.0°') && (await t('.sl-big')) === 'Slope angle = 38.0°', 'slope: live phone tilt');
  await tap('.sl-hold');
  await page.evaluate(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: 10, gamma: 10 }))); await page.waitForTimeout(100);
  check((await t('.sl-big')) === 'Slope angle = 38.0°' && (await t('.sl-facts')).includes('held'), 'slope: held reading stays');
  await page.fill('.sst .sl-typed', '52'); await page.waitForTimeout(100);
  check((await t('.sl-big')) === 'Slope angle = 52.0°' && (await t('.sl-band')).includes('45 to 60°'), 'slope: typed angle, 45 to 60° band');
  await page.fill('.sst .sl-typed', '95'); await page.waitForTimeout(100);
  check((await t('.sl-err')).includes('0 and 90'), 'slope: bad angle message');
  await page.fill('.sst .sl-typed', '22'); await page.waitForTimeout(100);
  check((await t('.sl-band')).includes('Under 25°') && (await t('.sl-band')).includes('runout'), 'slope: under 25° band text');
  await tap('.sl-m [data-v=map]');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sst .ss-csv')]); const f = OUT + 'sst.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('quantity,value,unit') && s.includes('snow_water_equivalent,212.50,mm') && s.includes('roof_load,1.6671,kN/m2') && s.includes('slope_angle,33.69,deg'), 'snow: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sst .ax-card:last-child > .dl:last-child [data-f=docx]')]); const f = OUT + 'sst.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'snow: Word report'); }
};
