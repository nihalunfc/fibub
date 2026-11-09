// #383 irrigation scheduler
export const path = '/science/irrigation-scheduler/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent('.irs .ir-big'), facts = () => page.textContent('.irs .ir-facts');
  check((await big()) === 'Irrigate 6 times: 305.6 mm net, 382.0 mm applied', `irrigation: example schedule (${await big()})`);
  { const f = await facts(); check(f.includes('TAW 96.0 mm; RAW 48.0 mm') && f.includes('10.6 mm drained below the roots') && f.includes('in about 4 days') && f.includes('38,195 m³ for 10 ha'), 'irrigation: example facts'); }
  { const t = await page.textContent('.irs .ir-tab'); check(t.includes('2026-06-0652.252.265.36,529') && (await page.$$('.irs .ir-tab tr')).length === 7 && await page.isVisible('.irs .ir-fig'), 'irrigation: events table and chart'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.irs .ir-csv')]); const f = OUT + 'irr.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 62 && rows[0].startsWith('date,ET0,Kc,ETc,Ks') && rows[6].split(',')[11] === '52.23', 'irrigation: daily CSV'); }
  await page.selectOption('.irs .ir-mode', 'none'); await page.waitForTimeout(150);
  check((await big()) === 'No irrigation: 55 days of water stress; depletion ends at 93.7 of 96.0 mm' && await page.isHidden('.irs .ir-trig') && (await page.$$('.irs .ir-tab tr')).length === 0, 'irrigation: no-irrigation plan');
  await page.selectOption('.irs .ir-mode', 'auto'); await page.check('.irs .ir-adj'); await page.waitForTimeout(150);
  check((await big()).startsWith('Irrigate 7 times: 322.9 mm net') && /RAW [\d.]+ to [\d.]+ mm/.test(await facts()), 'irrigation: p adjusted daily');
  await page.uncheck('.irs .ir-adj'); await page.fill('.irs .ir-ref', '10'); await page.waitForTimeout(150);
  check((await big()).startsWith('Irrigate ') && !(await big()).startsWith('Irrigate 6 times: 305.6'), 'irrigation: leave room for rain');
  await page.fill('.irs .ir-ref', '0'); await page.fill('.irs .ir-eff', '100'); await page.waitForTimeout(150);
  check((await big()) === 'Irrigate 6 times: 305.6 mm net, 305.6 mm applied', 'irrigation: 100 % efficiency');
  await page.fill('.irs .ir-eff', '80'); await page.fill('.irs .ir-area', ''); await page.waitForTimeout(150);
  check(!(await facts()).includes('m³') && !(await page.textContent('.irs .ir-tab')).includes('m³'), 'irrigation: no area, no volumes');
  // Kc and irrigation columns from an opened file.
  writeFileSync(OUT + 'irr-in.csv', 'date,ET0,rain,Kc,irrigation\n2026-05-01,5,0,0.5,\n2026-05-02,5,0,1,30\n2026-05-03,6,0,1.2,\nx,y,z,,\n');
  await page.setInputFiles('.irs .dfb-in', OUT + 'irr-in.csv'); await page.waitForTimeout(400);
  { const f = await facts(); check(f.includes('from your Kc column') && f.includes('30.0 mm applied, 24.0 mm counted') && f.includes('Skipped rows1') && (await big()) === 'No irrigation needed in these days', 'irrigation: file with Kc and irrigation columns'); }
  // Bad inputs.
  await page.fill('.irs .ir-data', 'date,temp\n2026-01-01,5'); await page.waitForTimeout(150);
  check((await page.textContent('.irs .ir-err')).includes('Name the columns ET0 and rain') && await page.isHidden('.irs .ir-out'), 'irrigation: missing columns message');
  await page.click('.irs .ir-ex'); await page.fill('.irs .ir-wp', '35'); await page.waitForTimeout(150);
  check((await page.textContent('.irs .ir-err')).includes('wilting point lower'), 'irrigation: wilting point above field capacity');
  await page.fill('.irs .ir-wp', '14'); await page.fill('.irs .ir-d0', '120'); await page.waitForTimeout(150);
  check((await page.textContent('.irs .ir-err')).includes('0 (field capacity) to 96.0'), 'irrigation: start depletion beyond TAW');
  await page.fill('.irs .ir-d0', '20'); await page.waitForTimeout(150);
  check((await big()).startsWith('Irrigate 6 times'), 'irrigation: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.irs .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'irrigation: image report'); }
};
