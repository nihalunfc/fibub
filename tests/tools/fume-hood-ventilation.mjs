// #516 fume hood and room ventilation
export const path = '/science/fume-hood-ventilation/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/fume-hood-ventilation/`); await page.waitForTimeout(500);
  const R = '.fhv ', txt = (s) => page.textContent(R + s), wait = () => page.waitForTimeout(120);
  check((await txt('.fh-note')).includes('hood certification needs a qualified tester and the relevant standard'), 'fume hood: study and planning notice');
  check((await txt('.fh-big1')) === 'Mean face velocity 0.5087 m/s (100 ft/min)', `fume hood: traverse mean (${await txt('.fh-big1')})`);
  { const f = await txt('.fh-facts1'); check(f.includes('15 (3 rows × up to 5)') && f.includes('−17.4 % to +12.1 %') && f.includes('8.34 %') && !f.includes('your band'), `fume hood: traverse facts, no flags by default (${f.slice(0, 160)})`); }
  check(await page.isHidden(R + '.fh-gkey') && (await page.$$(R + '.fh-gtab td.fh-flag')).length === 0, 'fume hood: no marked cells without a band');
  await page.fill(R + '.fh-lo', '0.45'); await page.fill(R + '.fh-hi', '0.6'); await page.fill(R + '.fh-tol', '15'); await wait();
  { const f = await txt('.fh-facts1'); check(f.includes('Mean in your band') && f.includes('2 readings outside the band') && f.includes('All within ±15 %') && f.includes('1 reading outside'), 'fume hood: band and tolerance flags'); }
  check((await page.$$(R + '.fh-gtab td.fh-flag')).length === 2 && (await txt('.fh-gtab')).includes('0.42\n−17\u00a0% !'), 'fume hood: flagged cells marked');
  await page.fill(R + '.fh-lo', '0.55'); await wait();
  check((await txt('.fh-facts1')).includes('Mean in your bandno'), 'fume hood: mean below the band');
  await page.fill(R + '.fh-hi', '0.5'); await wait();
  check((await txt('.fh-err1')).includes('top of the band is below') && await page.isHidden(R + '.fh-out1'), 'fume hood: band upside down');
  await page.fill(R + '.fh-lo', ''); await page.fill(R + '.fh-hi', ''); await page.fill(R + '.fh-tol', ''); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fh-csv1')]); const f = OUT + 'fh-trav.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 16 && rows[0] === 'row,col,velocity_m_s,deviation_percent,outside_band,outside_tolerance' && rows[15].startsWith('3,5,0.42,-17.4312'), 'fume hood: traverse CSV'); }
  // Part 2: hood flow and sash table.
  check((await txt('.fh-big2')) === 'Hood exhaust 1236 m³/h (727.5 cfm)', `fume hood: hood flow (${await txt('.fh-big2')})`);
  { const t = await txt('.fh-stab'); check(t.includes('0.45 (working)') && t.includes('0.3052') && t.includes('2060') && t.includes('1.221'), 'fume hood: sash table CAV and VAV'); }
  await page.fill(R + '.fh-v', '0.6'); await wait();
  check((await txt('.fh-big2')).startsWith('Hood exhaust 1458 m³/h') && (await txt('.fh-facts2')).includes('typed in'), 'fume hood: typed face velocity');
  await page.fill(R + '.fh-v', ''); await page.selectOption(R + '.fh-lu', 'in'); await page.fill(R + '.fh-w', '60'); await page.fill(R + '.fh-h', '18'); await page.fill(R + '.fh-hmax', '30'); await wait();
  check((await txt('.fh-big2')).startsWith('Hood exhaust 1276 m³/h (751 cfm)') && (await txt('.fh-facts2')).includes('1080 in²'), `fume hood: inches (${await txt('.fh-big2')})`);
  await page.selectOption(R + '.fh-vu', 'fpm'); await page.fill(R + '.fh-grid', '100 105\n95 100'); await wait();
  check((await txt('.fh-big1')) === 'Mean face velocity 100 ft/min (0.508 m/s)' && (await txt('.fh-big2')).includes('(750 cfm)'), `fume hood: ft/min and 750 cfm (${await txt('.fh-big2')})`);
  await page.fill(R + '.fh-grid', '0.5 0.6\n0.5 abc'); await wait();
  check((await txt('.fh-err1')).includes('not a number') && (await txt('.fh-err2')).includes('Fix the traverse'), 'fume hood: bad grid');
  await page.fill(R + '.fh-grid', '0.52 0.55 0.57 0.54 0.50\n0.49 0.53 0.56 0.52 0.47\n0.44 0.50 0.53 0.49 0.42'); await page.selectOption(R + '.fh-vu', 'ms');
  await page.selectOption(R + '.fh-lu', 'm'); await page.fill(R + '.fh-w', '1.5'); await page.fill(R + '.fh-h', '0.45'); await page.fill(R + '.fh-hmax', '0.3'); await wait();
  check((await txt('.fh-err2')).includes('full-open sash height'), 'fume hood: full-open below working');
  await page.fill(R + '.fh-hmax', '0.75'); await wait();
  // Part 3: room.
  check((await txt('.fh-big3')) === '11.1 air changes per hour', 'fume hood: ACH');
  { const f = await txt('.fh-facts3'); check(f.includes('144 m³') && f.includes('3.70 per hour') && f.includes('16.2 min') && f.includes('74.6 min') && f.includes('37.3 min'), `fume hood: room facts (${f.slice(0, 200)})`); }
  await page.click(R + '.fh-usehood'); await wait();
  check((await page.inputValue(R + '.fh-q')) === '1236.1' && (await txt('.fh-big3')) === '8.58 air changes per hour', `fume hood: use the hood flow (${await page.inputValue(R + '.fh-q')})`);
  await page.selectOption(R + '.fh-qu', 'cfm'); await page.fill(R + '.fh-q', '941.75'); await wait();
  check((await txt('.fh-big3')) === '11.1 air changes per hour', 'fume hood: room flow in cfm');
  await page.selectOption(R + '.fh-qu', 'm3/h'); await page.fill(R + '.fh-q', '1600'); await page.fill(R + '.fh-k', '0.5'); await wait();
  check((await txt('.fh-err3')).includes('mixing factor K') && (await txt('.fh-err5')).includes('part 3') && (await txt('.fh-err6')).includes('part 3'), 'fume hood: bad K stops later parts');
  await page.fill(R + '.fh-k', '3'); await wait();
  // Part 4: conversion.
  check((await txt('.fh-big4')) === '500 ppm = 1187 mg/m³', `fume hood: ppm to mg/m³ (${await txt('.fh-big4')})`);
  check((await txt('.fh-facts4')).includes('24.465 L/mol') && (await txt('.fh-facts4')).includes('58.08'), 'fume hood: molar volume and mass');
  await page.selectOption(R + '.fh-cvu', 'mg'); await page.fill(R + '.fh-cv', '1187'); await wait();
  check((await txt('.fh-big4')) === '1187 mg/m³ = 500 ppm', `fume hood: mg/m³ to ppm (${await txt('.fh-big4')})`);
  await page.fill(R + '.fh-mw', '92.14'); await page.fill(R + '.fh-t', '20'); await wait();
  check((await txt('.fh-big4')).startsWith('1187 mg/m³ = 309.9 ppm'), `fume hood: molar mass and temperature (${await txt('.fh-big4')})`);
  await page.fill(R + '.fh-mw', 'Xq2'); await wait();
  check(!(await page.isHidden(R + '.fh-err4')) && (await txt('.fh-err5')).includes('part 4'), 'fume hood: bad formula');
  await page.fill(R + '.fh-mw', 'C3H6O'); await page.fill(R + '.fh-t', '25'); await page.selectOption(R + '.fh-cvu', 'ppm'); await page.fill(R + '.fh-cv', '500'); await wait();
  // Part 5: steady state.
  check((await txt('.fh-big5')) === 'Steady state 177.8 mg/m³ = 74.87 ppm', `fume hood: steady state (${await txt('.fh-big5')})`);
  await page.selectOption(R + '.fh-gu', 'g/h'); await wait();
  check(await page.isHidden(R + '.fh-dwrap') && (await txt('.fh-big5')).startsWith('Steady state 3.750 mg/m³'), `fume hood: g/h hides density (${await txt('.fh-big5')})`);
  await page.selectOption(R + '.fh-gu', 'mL/min'); await page.fill(R + '.fh-d', ''); await wait();
  check((await txt('.fh-err5')).includes('density'), 'fume hood: density needed for mL');
  await page.fill(R + '.fh-d', '0.79'); await wait();
  // Part 6: purge and build-up.
  check((await txt('.fh-big6')) === '500 → 25 ppm in 48.5 min', `fume hood: purge time (${await txt('.fh-big6')})`);
  await page.waitForTimeout(300);
  check(await page.evaluate(() => { const c = document.querySelector('.fhv .fh-fig'); return c.width > 100 && c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0); }), 'fume hood: curve drawn');
  await page.selectOption(R + '.fh-src', 'on'); await wait();
  check((await txt('.fh-big6')).startsWith('Never: with the source running the level settles at 74.87 ppm'), `fume hood: target below steady state (${await txt('.fh-big6')})`);
  await page.fill(R + '.fh-c1', '100'); await wait();
  check((await txt('.fh-big6')) === '500 → 100 ppm in 45.8 min', `fume hood: falling to 100 with the source on (${await txt('.fh-big6')})`);
  await page.fill(R + '.fh-c0', '0'); await page.fill(R + '.fh-c1', '50'); await wait();
  check((await txt('.fh-big6')) === '0 → 50 ppm in 17.9 min', `fume hood: build-up from clean air (${await txt('.fh-big6')})`);
  await page.selectOption(R + '.fh-src', 'off'); await wait();
  check((await txt('.fh-big6')).startsWith('Never: without a source'), 'fume hood: no rise without a source');
  await page.selectOption(R + '.fh-src', 'on'); await page.selectOption(R + '.fh-cu', 'mg'); await page.fill(R + '.fh-c1', '100'); await wait();
  check((await txt('.fh-facts6')).includes('177.8 mg/m³'), 'fume hood: build-up in mg/m³');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fh-csv6')]); const f = OUT + 'fh-curve.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 162 && rows[0] === 'time_s,concentration_mg_m3' && rows[1] === '0,0', 'fume hood: curve CSV'); }
  await page.fill(R + '.fh-c0', '-5'); await wait();
  check((await txt('.fh-err6')).includes('0 or more'), 'fume hood: negative concentration');
  await page.fill(R + '.fh-c0', '500'); await page.selectOption(R + '.fh-src', 'off'); await page.selectOption(R + '.fh-cu', 'ppm'); await page.fill(R + '.fh-c1', '25'); await wait();
};
