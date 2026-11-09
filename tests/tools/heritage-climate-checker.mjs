// #420 heritage climate and mould risk checker
export const path = '/science/heritage-climate-checker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hcc ';
  const big = () => page.textContent(R + '.hc-big'), facts = () => page.textContent(R + '.hc-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await big()) === '720 readings over 30.0 days: 91.0 h (3.8 days) at or above 70 % RH, longest spell 91.0 h (3.8 days)', 'climate: example summary');
  { const f = await facts(); check(f.includes('RH range47.9 to 83.0 %') && f.includes('RH above 65 %98.0 h (4.1 days)13.6 % of the time') && f.includes('Temperature above 22 °C73.0 h (3.0 days)') && f.includes('Dew point10.9 °C') && f.includes('2026-06-13 16:00 to 2026-06-17 11:00'), 'climate: example ranges, hours and spell'); }
  { const f = await facts(); check(f.includes('Daily RH swing, mean8.9 % RH') && f.includes('27.6 % RH on 2026-06-17') && f.includes('Days with a swing over 10 %2') && f.includes('Decay rate vs reference1.16 ×') && f.includes('Preservation index (time-weighted)0.864'), 'climate: swings and preservation index'); }
  check(await page.isVisible(R + '.hc-frh') && await page.isVisible(R + '.hc-ft') && await page.isVisible(R + '.hc-fsw') && (await page.$$(R + '.hc-tab tr.over')).length === 2, 'climate: three charts and the daily table');
  check((await page.$eval(R + '.hc-ctemp', (s) => s.selectedOptions[0].textContent)) === 'Temperature (°C)' && (await page.inputValue(R + '.hc-cdate')) === '-1', 'climate: columns guessed');
  // Limits and preservation settings.
  await page.fill(R + '.hc-mould', '80'); await page.waitForTimeout(500);
  check((await big()).includes('at or above 80 % RH') && !(await big()).includes('91.0 h'), 'climate: mould RH limit');
  await page.fill(R + '.hc-swing', '5'); await page.waitForTimeout(500);
  check(!(await facts()).includes('Days with a swing over 5 %2'), 'climate: swing limit');
  await page.fill(R + '.hc-ea', '0'); await page.fill(R + '.hc-n', '0'); await page.waitForTimeout(500);
  check((await facts()).includes('Decay rate vs reference1 ×'), 'climate: Ea 0 and n 0 give rate 1');
  await page.fill(R + '.hc-ea', '100'); await page.fill(R + '.hc-n', '1'); await page.fill(R + '.hc-life', '50'); await page.waitForTimeout(500);
  check((await facts()).includes('0.864 (43.2 years)'), 'climate: life at the reference gives years');
  await page.fill(R + '.hc-rhref', '0'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hc-err')).includes('reference RH above 0') && await page.isHidden(R + '.hc-out'), 'climate: bad settings message');
  await page.fill(R + '.hc-rhref', '50'); await page.fill(R + '.hc-mould', '70'); await page.waitForTimeout(500);
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-csv')]); const f = OUT + 'daily.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 31 && rows[0] === 'day,readings,rh_min,rh_max,rh_swing' && rows[17].startsWith('2026-06-17,24,55.4,83,27.6'), 'climate: daily CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-rcsv')]); const f = OUT + 'readings.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 721 && rows[0].startsWith('time,temperature_c,rh_percent,dew_point_c') && rows[1].startsWith('2026-06-01 00:00,'), 'climate: readings CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'climate: image report'); }
  // A °F logger file with an index column, separate date and time, day/month/year.
  const L = ['No.;Date;Time;Temp °F;RH %'];
  for (let i = 0; i < 48; i++) L.push(`${i + 1};${String(1 + Math.floor(i / 24)).padStart(2, '0')}/03/2026;${String(i % 24).padStart(2, '0')}:00:00;${i < 24 ? '68,0' : '77,0'};${i >= 10 && i < 20 ? '75,0' : '50,0'}`);
  writeFileSync(OUT + 'logger.csv', L.join('\n'));
  await page.selectOption(R + '.hc-unit', 'f'); await page.selectOption(R + '.hc-order', 'dmy');
  await page.setInputFiles(R + '.dfb-in', OUT + 'logger.csv'); await page.waitForTimeout(800);
  check((await big()) === '48 readings over 2.0 days: 10.0 h at or above 70 % RH, longest spell 10.0 h', 'climate: °F logger with separate date and time');
  { const f = await facts(); check(f.includes('Temperature range20.0 to 25.0 °C') && f.includes('2026-03-01 10:00 to 2026-03-01 20:00') && f.includes('Temperature above 22 °C24.0 h'), 'climate: °F converted, spell times'); }
  check((await page.inputValue(R + '.hc-cdate')) === '1' && (await page.inputValue(R + '.hc-ctime')) === '2', 'climate: date and time columns found');
  await page.selectOption(R + '.hc-crh', '2'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hc-err')).includes('Fewer than two readings') || (await page.textContent(R + '.hc-err')).includes('skipped'), 'climate: wrong RH column chosen by hand');
  await page.fill(R + '.hc-in', 'Time,T,RH\nyesterday,20,50'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.hc-err')).includes('Fewer than two readings') && await page.isHidden(R + '.hc-out'), 'climate: unreadable data message');
  await page.selectOption(R + '.hc-unit', 'c'); await page.click(R + '.hc-ex'); await page.waitForTimeout(600);
  check((await big()).startsWith('720 readings over 30.0 days'), 'climate: example button');
};
