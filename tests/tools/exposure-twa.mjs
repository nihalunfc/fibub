// #477 exposure TWA
export const path = '/science/exposure-twa/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/exposure-twa/`); await page.waitForTimeout(500);
  const R = '.twa';
  const big = () => page.textContent(`${R} .twa-big`), facts = () => page.textContent(`${R} .twa-facts`), ver = () => page.textContent(`${R} .twa-ver`), tab = () => page.textContent(`${R} .twa-tab`);
  check((await page.textContent(`${R} .twa-med`)).includes('not medical advice'), 'twa: medical line at the top');
  check((await big()) === '8-hour TWA 12.5 ppm', 'twa: example 8-hour TWA');
  { const f = await facts(); check(f.includes('570 min') && f.includes('6000 ppm·min') && f.includes('Shift average10 ppm') && f.includes('60 ppmfrom 09:30') && f.includes('Adjusted limit14 ppm') && f.includes('× 0.7'), 'twa: example facts (sums, shift average, 15-min peak, Brief-Scala 0.7)'); }
  { const v = await ver(); check(v.includes('63 %') && v.includes('71 %') && v.includes('120 %') && v.includes('above'), 'twa: verdicts (TWA 63 %, adjusted 71 %, STEL 120 % above)'); }
  { const t = await tab(); check(t.includes('1800') && t.includes('900') && t.includes('6000') && t.includes('÷ 480 = 12.5') && t.includes('Cleaning tank'), 'twa: working table with running total'); }
  check((await page.textContent(`${R} .twa-exc`)).startsWith('Excursion check: passes') && (await page.textContent(`${R} .twa-notes`)).includes('30 minutes of the shift were not sampled'), 'twa: excursion and unsampled note');
  check(await page.isVisible(`${R} .twa-fig`), 'twa: profile drawn');
  await page.selectOption(`${R} .twa-uns`, 'average'); await page.waitForTimeout(200);
  check((await big()) === '8-hour TWA 13.2 ppm', 'twa: unsampled time at the sampled average');
  await page.selectOption(`${R} .twa-uns`, 'zero');
  await page.selectOption(`${R} .twa-model`, 'osha-daily'); await page.waitForTimeout(200);
  check((await facts()).includes('Adjusted limit16 ppm'), 'twa: OSHA daily 8/10');
  await page.selectOption(`${R} .twa-model`, 'bs-weekly'); await page.waitForTimeout(200);
  check(/Adjusted limit14\.(7|8) ppm/.test(await facts()) && (await facts()).includes('× 0.738'), 'twa: Brief-Scala weekly (50 h: 0.8 × 118/128 = 0.7375)');
  await page.selectOption(`${R} .twa-model`, 'osha-weekly'); await page.fill(`${R} .twa-hpw`, '40'); await page.waitForTimeout(400);
  check((await facts()).includes('Adjusted limit20 ppm'), 'twa: OSHA weekly at 40 h is no reduction');
  await page.selectOption(`${R} .twa-model`, 'none'); await page.waitForTimeout(200);
  check(!(await facts()).includes('Adjusted') && !(await ver()).includes('adjusted'), 'twa: no adjustment');
  await page.fill(`${R} .twa-stel`, ''); await page.fill(`${R} .twa-ex1`, '2'); await page.fill(`${R} .twa-exm`, '10'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-exc`)).startsWith('Excursion check: fails. 15 min above 2 ×') && !(await ver()).includes('STEL'), 'twa: no STEL; excursion rule 2 × for 10 min fails (15 min at 60)');
  await page.selectOption(`${R} .twa-u`, 'mg/m³'); await page.waitForTimeout(200);
  check((await big()) === '8-hour TWA 12.5 mg/m³', 'twa: unit label');
  await page.fill(`${R} .twa-data`, '120 5\n15 40 sanding\n345 2'); await page.fill(`${R} .twa-shift`, '8'); await page.fill(`${R} .twa-ex1`, '3'); await page.fill(`${R} .twa-exm`, '30'); await page.waitForTimeout(400);
  check((await big()) === '8-hour TWA 3.94 mg/m³' && (await facts()).includes('from 120 min'), 'twa: minutes format');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .twa-csv`)]); const f = OUT + 'twa.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('From,To,Minutes') && rows[2].includes('600') && rows[2].endsWith('sanding'), 'twa: CSV of the working'); }
  writeFileSync(OUT + 'twa-in.csv', 'start,end,conc\n22:00,23:30,4\n23:30,01:00,6\n01:00,06:00,2\n');
  await page.setInputFiles(`${R} .dfb-in`, OUT + 'twa-in.csv'); await page.waitForTimeout(600);
  check((await big()) === '8-hour TWA 3.13 mg/m³' && (await facts()).includes('from 23:30'), 'twa: night shift from a CSV file');
  await page.fill(`${R} .twa-shift`, '6'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-err`)).includes('longer than the 6 h shift') && await page.isHidden(`${R} .twa-out`), 'twa: shift too short message');
  await page.fill(`${R} .twa-shift`, '8'); await page.fill(`${R} .twa-data`, '07:00 08:00 5\n90 3'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-err`)).includes('not both'), 'twa: mixed formats message');
  await page.fill(`${R} .twa-data`, '07:00 08:00 lots'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-err`)).includes('concentration is not a number'), 'twa: bad concentration message');
  await page.fill(`${R} .twa-data`, '60 5\nseven to eight'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-err`)).includes('Line 2') && (await page.textContent(`${R} .twa-err`)).includes('should be'), 'twa: bad line message');
  await page.fill(`${R} .twa-data`, '07:00 08:00 5'); await page.fill(`${R} .twa-lim`, 'x'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .twa-err`)).includes('8-hour limit'), 'twa: bad limit message');
  await page.fill(`${R} .twa-lim`, '20'); await page.waitForTimeout(400);
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`${R} .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=${f}]`)]);
    const p = OUT + 'twa.' + ext; await d.saveAs(p);
    check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('.' + ext), `twa: ${f} download`);
  }
};
