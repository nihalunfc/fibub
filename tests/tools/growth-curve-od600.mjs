// #194 Growth curve and doubling time (OD600)
export const path = '/science/growth-curve-od600/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.gro ';
  const txt = async (s) => (await page.textContent(R + s)).replace(/\s+/g, ' ').trim();
  const tap = async (s) => { await page.locator(s).scrollIntoViewIfNeeded(); await page.click(s); await page.waitForTimeout(120); };
  const fill = async (s, v) => { await page.fill(R + s, v); await page.waitForTimeout(350); };
  const cell = async (r, c) => (await page.textContent(`${R}.gr-sum tbody tr:nth-child(${r}) td:nth-child(${c})`)).trim();
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);

  // The example: three strains, the Blank column found and taken away, Gompertz fit.
  check((await page.inputValue(R + '.gr-bcol')) === '3' && (await page.getAttribute(R + '.gr-bmode button[data-m=column]', 'aria-pressed')) === 'true', 'growth: blank column found');
  check((await page.$$(R + '.gr-sum tbody tr')).length === 3 && (await cell(1, 1)) === 'Strain A' && (await cell(1, 2)) === '0.8088' && (await cell(1, 3)) === '51.4 min (0.857 h)' && (await cell(1, 4)) === '1.32' && (await cell(1, 5)) === '1.59' && (await cell(1, 6)) === '0.8386' && (await cell(1, 7)) === '1.36', 'growth: summary row for Strain A');
  check((await cell(2, 3)) === '67 min (1.12 h)' && (await cell(3, 3)) === '90.6 min (1.51 h)', 'growth: Strains B and C doubling times');
  check((await txt('.gr-big')) === 'Strain A: doubling time 51.4 min (0.857 h)' && (await txt('.gr-sub')).includes('between 2.5 and 4.5 h, after taking away a blank of 0.04528'), 'growth: headline and window');
  { const f = await txt('.gr-facts'); check(f.includes('0.8088 per h') && f.includes('95 %: 0.7340 to 0.8836') && f.includes('47.1 to 56.7 min') && f.includes('1.32 h') && f.includes('starting OD 0.0187') && f.includes('5 readings, R² = 0.9975, steepest') && f.includes('at 14 h') && f.includes('1.59 × 10⁹ at the top'), 'growth: Strain A facts'); }
  { const f = await txt('.gr-mfacts'); check((await txt('.gr-mh')) === 'Gompertz model' && f.includes('0.8386 ± 0.0078 per h') && f.includes('1.363 ± 0.025 h') && f.includes('R² = 0.9997') && f.includes('29 readings'), 'growth: Gompertz facts'); }
  check((await txt('.gr-warn')) === '', 'growth: no warnings for the example');
  check(await page.evaluate(() => { const a = document.querySelector('.gro .gr-fig'), b = document.querySelector('.gro .gr-fig2'); return a.width > 0 && b.width > 0 && a.getAttribute('aria-label').includes('log scale') && b.getAttribute('aria-label').includes('3 cultures'); }), 'growth: both plots drawn');
  // Linear scale.
  await tap(R + '.gr-scale button[data-s=lin]');
  check(await page.evaluate(() => document.querySelector('.gro .gr-fig').getAttribute('aria-label').includes('linear scale')), 'growth: linear scale');
  await tap(R + '.gr-scale button[data-s=log]');
  // Another culture.
  await page.selectOption(R + '.gr-pick', '2'); await page.waitForTimeout(150);
  check((await txt('.gr-big')).startsWith('Strain C: doubling time 90.6 min') && (await page.getAttribute(R + '.gr-fig', 'aria-label')).startsWith('Strain C'), 'growth: pick Strain C');
  await page.selectOption(R + '.gr-pick', '0'); await page.waitForTimeout(150);
  // Logistic and no model.
  await page.selectOption(R + '.gr-model', 'logistic'); await page.waitForTimeout(200);
  check((await txt('.gr-mh')) === 'Logistic model' && (await cell(1, 6)) === '0.8457', 'growth: logistic fit');
  await page.selectOption(R + '.gr-model', 'none'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.gr-mfacts') && (await page.$$(R + '.gr-sum thead th')).length === 5, 'growth: no model');
  await page.selectOption(R + '.gr-model', 'gompertz'); await page.waitForTimeout(200);
  // Cells factor.
  await fill('.gr-fac', '5e8');
  check((await txt('.gr-facts')).includes('7.96 × 10⁸ at the top'), 'growth: cells/mL follow the factor');
  await fill('.gr-fac', '1e9');
  // Window size and by hand.
  await fill('.gr-w', '8');
  check((await cell(1, 2)) === '0.7636' && (await cell(1, 3)) === '54.5 min (0.908 h)', 'growth: 8-reading window');
  await fill('.gr-w', '2');
  check((await txt('.gr-err')).includes('3 or more') && await page.isHidden(R + '.gr-out'), 'growth: window too small message');
  await fill('.gr-w', '5');
  await tap(R + '.gr-wmode button[data-m=hand]');
  await fill('.gr-from', '3'); await fill('.gr-to', '6');
  check(await page.isHidden(R + '.gr-wl') && (await txt('.gr-facts')).includes('by hand') && (await txt('.gr-sub')).includes('between 3 and 6 h'), 'growth: window by hand');
  await fill('.gr-to', '3');
  check((await txt('.gr-err')).includes('two different times'), 'growth: same start and end message');
  await fill('.gr-to', '3.5');
  check((await txt('.gr-cerr')).includes('the window needs at least 3'), 'growth: too few readings in the hand window');
  await fill('.gr-to', '6');
  await tap(R + '.gr-wmode button[data-m=auto]');
  // Blank: typed value and none.
  await tap(R + '.gr-bmode button[data-m=value]');
  check((await page.$$(R + '.gr-sum tbody tr')).length === 4 && (await txt('.gr-sub')).includes('blank of 0.045'), 'growth: typed blank, blank column analysed as a culture');
  check((await cell(4, 1)) === 'Blank' && (await cell(4, 2)) === '–', 'growth: blank column fails as a culture');
  await fill('.gr-bval', 'x');
  check((await txt('.gr-err')).includes('blank OD as a number'), 'growth: bad blank message');
  await fill('.gr-bval', '0.045');
  await tap(R + '.gr-bmode button[data-m=none]');
  check(!(await txt('.gr-sub')).includes('blank'), 'growth: no blank');
  await tap(R + '.gr-bmode button[data-m=column]');
  // Lowest OD.
  await fill('.gr-min', '0');
  check((await txt('.gr-err')).includes('lowest OD'), 'growth: lowest OD message');
  await fill('.gr-min', '0.01');
  // Minutes.
  await page.selectOption(R + '.gr-tu', 'min'); await page.waitForTimeout(200);
  check((await txt('.gr-big')).includes('doubling time 0.857 min (0.0143 h)') && (await txt('.gr-sum thead')).includes('Lag (min)'), 'growth: times read as minutes');
  await page.selectOption(R + '.gr-tu', 'h'); await page.waitForTimeout(200);
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gr-csv')]); const f = OUT + 'gro.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(d.suggestedFilename() === 'growth-curve-results.csv' && t.length === 4 && t[0].startsWith('culture,blank_od,window_from_h') && t[1].startsWith('Strain A,0.0452759,2.5,4.5,5,0.80879') && t[1].includes(',gompertz,4.47335,'), 'growth: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gr-dcsv')]); const f = OUT + 'gro-data.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(d.suggestedFilename() === 'growth-curve-data.csv' && t.length === 30 && t[0] === 'time_h,Strain_A_od,Strain_A_cells_per_ml,Strain_A_gompertz_od,Strain_B_od,Strain_B_cells_per_ml,Strain_B_gompertz_od,Strain_C_od,Strain_C_cells_per_ml,Strain_C_gompertz_od' && t[1].startsWith('0,0.0187241,18724100,'), 'growth: data CSV'); }
  // Reports.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'growth-curve.pdf', 'report: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'growth-curve.png', 'report: image'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'growth-curve.docx', 'report: Word'); }
  // Own data: CSV in minutes, no header, a bad line, no blank column.
  await page.fill(R + '.gr-data', '0,0.01,0.02\n30,0.02,0.03\n60,0.04,0.045\nbad,1,1\n90,0.08,0.07\n120,0.16,0.1\n150,0.34,0.15');
  await page.selectOption(R + '.gr-tu', 'min'); await page.waitForTimeout(400);
  check((await txt('.gr-perr')).includes('Line 4') && (await page.getAttribute(R + '.gr-bmode button[data-m=none]', 'aria-pressed')) === 'true' && (await page.$$(R + '.gr-sum tbody tr')).length === 2 && (await cell(1, 1)) === 'Culture 1', 'growth: pasted CSV in minutes');
  check((await cell(1, 2)) === '1.411' && (await cell(1, 3)) === '29.5 min (0.491 h)' && (await cell(2, 4)) === '−0.183', 'growth: own data doubling time and a lag below 0');
  check((await txt('.gr-warn')).includes('fastest at the last'), 'growth: still growing warning');
  // Empty and back.
  await tap(R + '.gr-clear');
  check((await txt('.gr-err')).includes('Paste or type your readings') && await page.isHidden(R + '.gr-out'), 'growth: empty message');
  await page.fill(R + '.gr-data', 'hello\nworld'); await page.waitForTimeout(400);
  check((await txt('.gr-err')).includes('No readings found'), 'growth: unreadable table message');
  await tap(R + '.gr-ex');
  check((await txt('.gr-big')) === 'Strain A: doubling time 51.4 min (0.857 h)' && (await page.inputValue(R + '.gr-tu')) === 'h', 'growth: example again');
};
