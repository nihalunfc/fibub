// #198 TCID50 and plaque assay calculator
export const path = '/science/tcid50-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tcd ';
  const txt = async (s) => (await page.textContent(R + s)).replace(/\s+/g, ' ').trim();
  const row = (i, c) => `${R}.tc-row:nth-child(${i}) ${c}`;
  const cells = (s) => page.evaluate((s) => [...document.querySelectorAll(s + ' tr')].map((tr) => [...tr.cells].map((c) => c.textContent).join('|')), R + s);
  const prow = (i, c) => `${R}.tc-prow:nth-child(${i}) ${c}`;
  const tap = async (s) => { await page.locator(s).scrollIntoViewIfNeeded(); await page.click(s); await page.waitForTimeout(100); };
  const set = async (s, v) => { await page.fill(s, v); await page.waitForTimeout(80); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(400);
  // The TCID50 example.
  check((await txt('.tc-big')) === '5.62 × 10⁶ TCID50/mL', 'tcid50: example titre (Spearman–Kärber)');
  check((await txt('.tc-sub')).includes('10⁻⁵·⁷⁵ dilution') && (await txt('.tc-sub')).includes('log₁₀ 6.75 TCID50/mL') && (await txt('.tc-sub')).includes('5.62 × 10⁵ TCID50 in each 0.1 mL'), 'tcid50: example endpoint line');
  { const f = await txt('.tc-facts'); check(f.includes('± 0.28 log₁₀') && f.includes('95 %: 1.62 × 10⁶ to 1.95 × 10⁷') && f.includes('5.12 × 10⁶ /mL') && f.includes('10⁻⁵·⁷¹') && f.includes('proportionate distance 0.71') && f.includes('0.04 log₁₀') && f.includes('3.9 × 10⁶'), 'tcid50: example facts'); }
  { const t = await cells('.tc-tab'); check(t.length === 9 && t[5] === '10⁻⁵|6 / 8|75 %|10|2|83.3 %' && t[6] === '10⁻⁶|3 / 8|38 %|4|7|36.4 %', 'tcid50: Reed–Muench table'); }
  check((await page.$$(R + '.tc-row')).length === 8 && await page.isHidden(R + '.tc-warn li') === true, 'tcid50: eight rows, no warnings');
  check(await page.evaluate(() => { const c = document.querySelector('.tcd .tc-fig'); return c.width > 0 && c.getAttribute('aria-label').includes('10⁻⁵·⁷⁵'); }), 'tcid50: plot drawn');
  // Options: Reed–Muench as main, 90 % interval, inoculum volume.
  await page.selectOption(R + '.tc-main', 'rm'); await page.waitForTimeout(80);
  check((await txt('.tc-big')) === '5.12 × 10⁶ TCID50/mL' && (await txt('.tc-sub')).startsWith('Reed–Muench'), 'tcid50: Reed–Muench as main');
  await page.selectOption(R + '.tc-main', 'sk');
  await page.selectOption(R + '.tc-conf', '0.9'); await page.waitForTimeout(80);
  check((await txt('.tc-facts')).includes('90 %: 1.98 × 10⁶ to 1.6 × 10⁷'), 'tcid50: 90 % interval');
  await page.selectOption(R + '.tc-conf', '0.95');
  await set(R + '.tc-vol', '0.05');
  check((await txt('.tc-big')) === '1.12 × 10⁷ TCID50/mL', 'tcid50: 0.05 mL inoculum doubles the titre');
  await set(R + '.tc-vol', '0');
  check((await txt('.tc-err')).includes('inoculum') && await page.isHidden(R + '.tc-out'), 'tcid50: bad volume message');
  await set(R + '.tc-vol', '0.1');
  // Last row infected: SK cannot be used, falls back to RM with a note.
  await set(row(8, '.tc-p'), '1'); await set(row(7, '.tc-p'), '0');
  check((await txt('.tc-sub')).includes('Spearman–Kärber cannot be used here') && (await txt('.tc-facts')).includes('no infected wells') && (await txt('.tc-warn')).includes('More wells are infected at 10⁻⁸'), 'tcid50: SK unusable, RM used, reversal warning');
  await set(row(8, '.tc-p'), '0'); await set(row(7, '.tc-p'), '1');
  // Bad input.
  await set(row(5, '.tc-p'), '9');
  check((await txt('.tc-err')).includes('Row 5: more infected wells (9) than wells (8)') && (await page.$$(R + '.tc-bad')).length === 1, 'tcid50: too many infected');
  await set(row(5, '.tc-p'), '6'); await set(row(2, '.tc-d'), 'abc');
  check((await txt('.tc-err')).includes('Row 2: write the dilution'), 'tcid50: bad dilution');
  await set(row(2, '.tc-d'), '10^-1');
  check((await txt('.tc-err')).includes('listed twice'), 'tcid50: same dilution twice');
  await set(row(2, '.tc-d'), '1:100');
  check((await txt('.tc-big')) === '5.62 × 10⁶ TCID50/mL', 'tcid50: 1:100 read as 10⁻²');
  // Make a series.
  await page.click(R + '.tc-mkbox summary');
  await set(R + '.tc-m0', '1:10'); await set(R + '.tc-mf', '3.16'); await set(R + '.tc-mk', '1');
  await tap(R + '.tc-make');
  check((await txt('.tc-merr')).includes('between 2 and 30'), 'tcid50: make series message');
  await set(R + '.tc-mk', '5'); await set(R + '.tc-mn', '4'); await tap(R + '.tc-make');
  check((await page.$$(R + '.tc-row')).length === 5 && (await page.inputValue(row(1, '.tc-n'))) === '4' && (await page.inputValue(row(2, '.tc-d'))) === '10^-1.5' && (await txt('.tc-err')).includes('Row 1: type the infected'), 'tcid50: half-log series made');
  for (const [i, v] of [[1, 4], [2, 4], [3, 2], [4, 0], [5, 0]]) await set(row(i, '.tc-p'), String(v));
  check((await txt('.tc-sub')).includes('10⁻²·⁰') && (await txt('.tc-big')) === '1000 TCID50/mL', 'tcid50: typed half-log series (endpoint 10⁻², 1000 /mL)');
  // Add and remove.
  await tap(R + '.tc-add'); check((await page.$$(R + '.tc-row')).length === 6 && (await txt('.tc-big')) === '1000 TCID50/mL', 'tcid50: empty added row ignored');
  await tap(row(6, '.tc-del')); await tap(row(5, '.tc-del'));
  check((await page.$$(R + '.tc-row')).length === 4 && (await txt('.tc-big')) === '1000 TCID50/mL', 'tcid50: remove rows');
  await tap(R + '.tc-clear');
  check((await txt('.tc-err')).includes('at least two') && await page.isHidden(R + '.tc-out'), 'tcid50: start empty');
  // Paste.
  await page.click(R + '.tc-box:nth-of-type(2) summary');
  await page.fill(R + '.tc-paste', 'dilution\tinfected\twells\n10^-2\t5\t5\n10^-3\t4\t5\n10^-4\t1\t5\n10^-5\t0\t5\nbad');
  await tap(R + '.tc-usepaste');
  check((await page.$$(R + '.tc-row')).length === 4 && (await txt('.tc-sub')).includes('10⁻³·50') === false && (await txt('.tc-big')) === '3.16 × 10⁴ TCID50/mL' && (await txt('.tc-perr')).includes('Line 6'), 'tcid50: pasted table (2 − 0.5 + 1 + 0.8 + 0.2 = 3.5)');
  await page.fill(R + '.tc-paste', ''); await tap(R + '.tc-usepaste');
  check((await txt('.tc-perr')).includes('Paste a table first'), 'tcid50: empty paste');
  // Endpoint outside the series.
  await set(row(1, '.tc-p'), '1'); await set(row(2, '.tc-p'), '0'); await set(row(3, '.tc-p'), '0');
  check((await txt('.tc-err')).includes('Add stronger dilutions') && await page.isHidden(R + '.tc-out'), 'tcid50: endpoint stronger than the series');
  // CSV from the example.
  await tap(R + '.tc-ex');
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.tc-csv')]); const f = OUT + 'tcid50.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(d.suggestedFilename() === 'tcid50.csv' && t.startsWith('dilution,log10_dilution_factor,infected_wells,wells,percent_infected') && t.includes('10^-5,5,6,8,75,10,2,83.3333') && t.includes('spearman_karber,5.75,5623410,6.75,0.275487') && t.includes('reed_muench,5.70968,') && t.includes('approx_pfu_per_ml_ln2,3897850'), 'tcid50: CSV'); }
  // Plaque example.
  check((await txt('.tc-pbig')) === '8.8 × 10⁷ PFU/mL', 'plaque: example titre');
  check((await txt('.tc-psub')).startsWith('264 plaques on 3 plates at 10⁻⁵'), 'plaque: example line');
  { const f = await txt('.tc-pfacts'); check(f.includes('7.77 × 10⁷ to 9.93 × 10⁷') && f.includes('7.94') && f.includes('± 6.2 %') && f.includes('1.27 × 10⁸'), 'plaque: example facts'); }
  { const t = await cells('.tc-ptab'); check(t[1] === '10⁻⁴|TNTC, TNTC, TNTC|–|–|too many to count' && t[2] === '10⁻⁵|88, 97, 79|88|8.8 × 10⁷|used' && t[3] === '10⁻⁶|11, 7, 9|9|9 × 10⁷|below the range', 'plaque: table'); }
  check(await page.evaluate(() => document.querySelector('.tcd .tc-pfig').width > 0), 'plaque: plot drawn');
  await set(R + '.tc-min', '5');
  check((await txt('.tc-pbig')) === '8.82 × 10⁷ PFU/mL' && (await txt('.tc-psub')).startsWith('291 plaques on 6 plates'), 'plaque: range from 5 pools two dilutions');
  await set(R + '.tc-min', '100'); await set(R + '.tc-max', '300');
  check((await txt('.tc-pbig')) === '8.8 × 10⁷ PFU/mL' && (await txt('.tc-pwarn')).includes('No dilution has an average count inside 100 to 300'), 'plaque: nothing in range warning');
  await set(R + '.tc-min', '10'); await set(R + '.tc-max', '100');
  await set(R + '.tc-pv', '0.2');
  check((await txt('.tc-pbig')) === '4.4 × 10⁷ PFU/mL', 'plaque: 0.2 mL per plate');
  await set(R + '.tc-pv', '0.1');
  await page.selectOption(R + '.tc-pconf', '0.99'); await page.waitForTimeout(80);
  check((await txt('.tc-pfacts')).includes('99 % interval'), 'plaque: 99 % interval');
  await page.selectOption(R + '.tc-pconf', '0.95');
  // Differing titres warning.
  await set(prow(3, '.tc-pc'), '30, 28, 33');
  check((await txt('.tc-pwarn')).includes('differ'), 'plaque: titres disagree warning');
  // Bad input.
  await set(prow(2, '.tc-pc'), '88, 9.5');
  check((await txt('.tc-perr2')).includes('Row 2: plaque counts are whole numbers') && await page.isHidden(R + '.tc-pout'), 'plaque: bad count');
  await set(prow(2, '.tc-pc'), '88, 97, 79'); await set(R + '.tc-max', '5');
  check((await txt('.tc-perr2')).includes('countable range'), 'plaque: bad range');
  await set(R + '.tc-max', '100');
  // Add, remove, empty, paste.
  await tap(R + '.tc-padd'); await set(prow(5, '.tc-pd'), '10^-8'); await set(prow(5, '.tc-pc'), '0, 0, 0');
  check((await page.$$(R + '.tc-prow')).length === 5 && (await txt('.tc-ptab')).includes('10⁻⁸'), 'plaque: add a dilution');
  await tap(prow(5, '.tc-pdel'));
  check((await page.$$(R + '.tc-prow')).length === 4, 'plaque: remove a dilution');
  await tap(R + '.tc-pclear');
  check((await txt('.tc-perr2')).includes('at least one dilution'), 'plaque: start empty');
  await page.click(R + '.tc-card-p summary').catch(() => {});
  await page.locator(R + '.tc-ppaste').evaluate((t) => t.closest('details').open = true);
  await page.fill(R + '.tc-ppaste', '1e-5\t50\t40\n1e-6\tTNTC\nnope');
  await tap(R + '.tc-pusepaste');
  check((await page.$$(R + '.tc-prow')).length === 2 && (await txt('.tc-pbig')) === '4.5 × 10⁷ PFU/mL' && (await txt('.tc-pperr')).includes('Line 3'), 'plaque: pasted table');
  await tap(R + '.tc-pex');
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.tc-pcsv')]); const f = OUT + 'plaque.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(d.suggestedFilename() === 'plaque-titre.csv' && t.includes('10^-5,5,88 97 79,88,88000000,used') && t.includes('10^-4,4,TNTC TNTC TNTC,,,too many to count') && t.includes('pfu_per_ml,88000000') && t.includes('interval_low,77703900') && t.includes('plaques_counted,264'), 'plaque: CSV'); }
  // Report.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'virus-titre.pdf', 'report: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'virus-titre.png', 'report: image'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'virus-titre.docx', 'report: Word'); }
};
