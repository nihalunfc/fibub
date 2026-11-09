// #464 epidemic curve and attack rates
export const path = '/science/epi-curve/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.epc ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await txt('.epc-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'epi: medical line near the top');
  check((await txt('.epc-big')) === '44 cases, 2026-06-08 to 2026-06-17', 'epi: example cases and span');
  { const f = await txt('.epc-facts'); check(f.includes('2026-06-12: 12 cases') && f.includes('Median onset2026-06-12') && f.includes('11 × 1 day') && f.includes('5 d (1 d to 10 d)'), 'epi: peak, median, bars (exposure day included) and incubation'); }
  check(await page.isVisible(R + '.epc-fig'), 'epi: curve drawn');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.epc-csv')]); const f = OUT + 'epi.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 12 && rows[0] === 'bin_start,bin_end,cases' && rows[1] === '2026-06-07,2026-06-08,0' && rows[6] === '2026-06-12,2026-06-13,12', 'epi: counts CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.epc-png')]); const f = OUT + 'epi.png'; await d.saveAs(f); const b = readFileSync(f); check(b[1] === 0x50 && b.length > 5000, 'epi: curve PNG'); }
  await page.selectOption(R + '.epc-bin', 'week-mon:7'); await page.waitForTimeout(200);
  check((await txt('.epc-facts')).includes('2026-06-08 to 2026-06-14: 41 cases') && (await txt('.epc-facts')).includes('3 × 1 week (from Monday)'), 'epi: weekly bars from Monday');
  await page.selectOption(R + '.epc-bin', 'week-sun:7'); await page.waitForTimeout(200);
  check((await txt('.epc-facts')).includes('2026-06-07 to 2026-06-13: 37 cases'), 'epi: weekly bars from Sunday');
  await page.selectOption(R + '.epc-bin', 'days:3'); await page.waitForTimeout(200);
  check((await txt('.epc-facts')).includes('4 × 3 days'), 'epi: 3-day bars');
  await page.selectOption(R + '.epc-bin', 'hours:6'); await page.waitForTimeout(200);
  check((await txt('.epc-err')).includes('Hour bars need onset times'), 'epi: hour bars without times message');
  await page.fill(R + '.epc-in', '2026-06-10 08:00\n2026-06-10 13:30, 3\n2026-06-10 22:10\n2026-06-11 02:00\nnot a date'); await page.fill(R + '.epc-exp', '2026-06-09 19:00'); await page.waitForTimeout(400);
  { const f = await txt('.epc-facts'); check(f.includes('2026-06-10 12:00: 3 cases') && f.includes('18.5 h') && f.includes('13 h to 31 h') && (await txt('.epc-warn')).includes('Line 5'), 'epi: timed onsets, 6-hour bars, incubation in hours, bad line reported'); }
  await page.fill(R + '.epc-exp', 'yesterday'); await page.waitForTimeout(300);
  check((await txt('.epc-err')).includes('exposure must be a date'), 'epi: bad exposure message');
  await page.fill(R + '.epc-exp', ''); await page.fill(R + '.epc-in', '10/06/2026'); await page.waitForTimeout(300);
  check((await txt('.epc-err')).includes('not a date') && await page.isHidden(R + '.epc-out'), 'epi: day-first date refused');
  writeFileSync(OUT + 'onsets.csv', 'onset\n2026-07-01\n2026-07-01\n2026-07-03\n');
  await page.selectOption(R + '.epc-bin', 'days:1');
  await page.setInputFiles(R + '.dfb-in >> nth=0', OUT + 'onsets.csv'); await page.waitForTimeout(600);
  check((await txt('.epc-big')) === '3 cases, 2026-07-01 to 2026-07-03', 'epi: onsets from a CSV file');
  // Attack rates.
  { const t = await txt('.epc-artab'); check(t.includes('38 / 58') && t.includes('65.5 %') && t.includes('14.3 %') && t.includes('4.59') && t.includes('2.14 to 9.85') && t.includes('< 0.001') && t.includes('0.069'), 'epi: attack rates, ratio, interval and Fisher p'); }
  check((await page.textContent(R + '.epc-artab tr.epc-top')).includes('Chicken salad') && (await txt('.epc-arnote')).includes('Chicken salad has the highest'), 'epi: most likely item marked');
  await page.selectOption(R + '.epc-conf', '0.9'); await page.waitForTimeout(200);
  check((await txt('.epc-artab')).includes('90 % interval'), 'epi: 90 % confidence');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.epc-arcsv')]); const f = OUT + 'ar.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[1].startsWith('Chicken salad,38,58,65.5 %,6,42'), 'epi: attack rates CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'epi.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'epi: PDF report'); }
  await page.fill(R + '.epc-ar', 'Cake\t3\t2\t1'); await page.waitForTimeout(400);
  check((await txt('.epc-arerr')).includes('needs four whole-number counts'), 'epi: short attack-rate row message');
  await page.fill(R + '.epc-ar', 'Cake\t3\t2\t0\t0'); await page.waitForTimeout(400);
  check((await txt('.epc-arerr')).includes('at least one person'), 'epi: empty group message');
};
