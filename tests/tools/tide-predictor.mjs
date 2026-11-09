// #832 Tide predictor
export const path = '/science/tide-predictor/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.tdp ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1000);
  check((await page.textContent(R + '.tdp-warn')).includes('Not for navigation'), 'tide: not-for-navigation notice');
  await page.fill(R + '.tdp-start', '2026-11-09'); await page.waitForTimeout(400);
  const big = () => page.textContent(R + '.tdp-big'), hl = () => page.textContent(R + '.tdp-hl tbody'), win = () => page.textContent(R + '.tdp-win tbody');
  check((await big()) === 'First high water 2026-11-09 04:00 UTC, 3.06 m; range over the period 3.75 m', `tide: example headline (${await big()})`);
  { const t = await hl(); check(t.includes('2026-11-09 09:27Low0.85 m') && t.includes('2026-11-09 15:45High3.86 m') && t.includes('2026-11-09 22:18Low0.11 m') && (await page.$$(R + '.tdp-hl tbody tr')).length === 12, `tide: high and low waters (${t.slice(0, 90)})`); }
  { const t = await win(); check(t.includes('2026-11-09 02:17') && t.includes('2026-11-09 05:42') && t.includes('3.4') && (await page.$$(R + '.tdp-win tbody tr')).length === 6, `tide: draft windows (${t.slice(0, 60)})`); }
  // Time zone shown.
  await page.fill(R + '.tdp-off', '-5'); await page.waitForTimeout(300);
  check((await big()).includes('UTC−5') && (await hl()).includes('2026-11-09 10:45High3.86 m'), `tide: times at UTC−5 (${await big()})`);
  await page.fill(R + '.tdp-off', '0'); await page.waitForTimeout(300);
  // Nodal off changes heights a little.
  await page.selectOption(R + '.tdp-nodal', '0'); await page.waitForTimeout(300);
  check(!(await hl()).includes('15:45High3.86 m') && (await big()).includes('2026-11-09 0'), `tide: nodal corrections off (${await big()})`);
  await page.selectOption(R + '.tdp-nodal', '1');
  // Threshold never reached.
  await page.fill(R + '.tdp-thr', '9'); await page.waitForTimeout(300);
  check((await win()).includes('never reaches 9 m'), 'tide: no window message');
  await page.fill(R + '.tdp-thr', '2.6'); await page.selectOption(R + '.tdp-unit', 'ft'); await page.waitForTimeout(300);
  check((await big()).includes('3.06 ft'), 'tide: units label');
  await page.selectOption(R + '.tdp-unit', 'm');
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tdp-csv')]); const f = OUT + 'tide.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_UTC,level_m' && rows.length === 722 && rows[1].startsWith('2026-11-09 00:00,'), `tide: levels CSV (${rows.length})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tdp-hlcsv')]); const f = OUT + 'tidehl.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[2].startsWith('2026-11-09 09:27,low,0.84'), `tide: high/low CSV (${rows[2]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'tide-prediction.pdf', 'tide: PDF report'); }
  // Bad constituent input.
  const cons = await page.inputValue(R + '.tdp-cons');
  await page.fill(R + '.tdp-cons', cons + '\nXX9 1 2'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-err')).includes('"XX9" is not a constituent'), 'tide: unknown constituent message');
  await page.fill(R + '.tdp-cons', 'M2 1.2 110\nM2 1 1'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-err')).includes('listed twice'), 'tide: duplicate message');
  await page.fill(R + '.tdp-cons', 'M2 abc 110'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-err')).includes('amplitude'), 'tide: bad amplitude message');
  await page.fill(R + '.tdp-cons', cons); await page.fill(R + '.tdp-start', '9 Nov'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-perr')).includes('YYYY-MM-DD'), 'tide: bad date message');
  await page.fill(R + '.tdp-start', '2026-11-09'); await page.fill(R + '.tdp-days', '90'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-perr')).includes('31'), 'tide: too many days message');
  await page.fill(R + '.tdp-days', '3'); await page.waitForTimeout(300);
  // Analysis of the example record.
  const abig = () => page.textContent(R + '.tdp-abig'), arows = async () => page.$$eval(R + '.tdp-acons tbody tr', (t) => t.map((r) => [...r.querySelectorAll('td')].map((d) => d.textContent)));
  check((await abig()).startsWith('22 constituents from 720 readings over 30.0 days. Mean level Z0 = 1.500'), `tide: analysis headline (${await abig()})`);
  { const r = await arows(); check(r[0].join() === 'M2,28.9841042,0.9001,200.00' && r[1][0] === 'S2' && r[1][2] === '0.3001' && r.find((x) => x[0] === 'K1')[3] === '99.95', `tide: analysis recovers the made-up constituents (${r[0]} ${r[1]})`); }
  check(await page.isVisible(R + '.tdp-afig'), 'tide: fit plot drawn');
  await page.selectOption(R + '.tdp-sel', 'list'); await page.waitForTimeout(400);
  check((await abig()).startsWith('6 constituents') && (await arows())[0][2] === '0.9001', 'tide: fit only listed constituents');
  await page.fill(R + '.tdp-list', 'M2, Q9'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-aerr')).includes('"Q9"'), 'tide: unknown listed constituent');
  await page.fill(R + '.tdp-list', 'M2, S2, K2'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.tdp-awarn')).includes('S2 and K2 are too close') && await page.isVisible(R + '.tdp-awarn'), 'tide: S2 and K2 inseparable in 30 days: warning');
  await page.selectOption(R + '.tdp-sel', 'auto'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tdp-acsv')]); const f = OUT + 'tidec.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'name,speed_deg_per_hour,amplitude,phase_G_deg' && rows[1].startsWith('Z0,0,1.5') && rows.length === 24, `tide: constituents CSV (${rows.length})`); }
  // Use in prediction.
  await page.click(R + '.tdp-use'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.tdp-cons')).startsWith('M2   0.9001 200') && (await page.inputValue(R + '.tdp-z0')) === '1.5', 'tide: constituents handed to the predictor');
  // Open a file: two columns date, time, level with a header, at UTC+1.
  const lines = ['date,time,level']; for (let i = 0; i < 72; i++) { const t = Date.UTC(2026, 4, 1, 1) + i * 3600000, d = new Date(t); const h = 1 + 0.8 * Math.cos(((28.9841042 * i) * Math.PI) / 180); lines.push(`${d.toISOString().slice(0, 10)},${d.toISOString().slice(11, 16)},${h.toFixed(4)}`); }
  writeFileSync(OUT + 'rec.csv', lines.join('\n'));
  await page.setInputFiles(R + '.dfb-in', OUT + 'rec.csv'); await page.waitForTimeout(800);
  check((await abig()).includes('72 readings over 3.0 days'), `tide: record opened from a file (${await abig()})`);
  // Bad record.
  await page.fill(R + '.tdp-rec', '2026-01-01 00:00 1\n2026-01-01 01:00 2'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-aerr')).includes('at least 24'), 'tide: short record message');
  await page.fill(R + '.tdp-rec', lines.slice(1).join('\n').replace(',05:00,', ',xx:00,')); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-aerr')).includes('is not a date'), 'tide: bad line message');
  await page.fill(R + '.tdp-rec', lines.slice(1, 30).join('\n')); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tdp-aerr')).includes('two days'), 'tide: record too short in time');
};
