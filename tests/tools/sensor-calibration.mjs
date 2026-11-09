// #870 sensor calibration
export const path = '/science/sensor-calibration/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.scx ', big = () => page.textContent(R + '.sc-big'), facts = () => page.textContent(R + '.sc-cfacts'), wait = (ms = 600) => page.waitForTimeout(ms);
  const rows = (c) => page.$$eval(R + c + ' tr', (r) => r.map((x) => Array.from(x.children, (k) => k.textContent)));
  await page.goto(`${BASE}${path}`); await wait(1500);
  check((await facts()).includes('6,048') && (await facts()).includes('6 out of range, 18 stuck, 111 spikes') && (await facts()).includes('501') && (await facts()).includes('60 min, 2026-03-01 00:00 to 2026-03-21 23:00'), 'sensor: example cleaning and matched periods');
  check((await big()) === 'Calibrated = 3.981 + 0.6616 × sensor − 0.08194 × RH', `sensor: example RH model (${await big()})`);
  { const m = await rows('.sc-met'); check(m[2].join('|') === 'Fit: calibrated|0.920|0.9962|0.7908|0|351' && m[4].join('|') === 'Test: calibrated|0.934|1.04|0.8321|-0.06787|150' && m[3][4] === '7.179', `sensor: agreement table, fit and test (${m[4]})`); }
  check((await rows('.sc-coef'))[3].join('|') === 'RH|-0.08194|0.003527', 'sensor: coefficient and standard error');
  check((await page.textContent(R + '.sc-nbig')) === '283 of 288 readings calibrated', 'sensor: example new data calibrated');
  // Models.
  const testRmse = async () => +(await rows('.sc-met'))[4][2];
  const rmseRH = await testRmse();
  await page.selectOption(R + '.sc-model', 'lin'); await wait();
  check(/^Calibrated = [\d.]+ \+ [\d.]+ × sensor$/.test(await big()) && (await testRmse()) > rmseRH, `sensor: linear only has a higher test RMSE (${await testRmse()} > ${rmseRH})`);
  await page.selectOption(R + '.sc-model', 'rhT'); await wait();
  check((await big()).includes('× RH') && (await big()).includes('× T') && (await rows('.sc-coef')).length === 5, 'sensor: RH and temperature model');
  await page.selectOption(R + '.sc-model', 'T'); await wait();
  check((await big()).endsWith('× T') && !(await big()).includes('RH'), 'sensor: temperature model');
  await page.selectOption(R + '.sc-model', 'dem'); await wait();
  check(!(await page.isHidden(R + '.sc-lbox')) && /× sensor$/.test(await big()) && (await rows('.sc-coef'))[1][2] === '—', `sensor: Deming (${await big()})`);
  await page.fill(R + '.sc-lam', '0'); await wait();
  check((await page.textContent(R + '.sc-err')).includes('λ is above 0'), 'sensor: bad λ message');
  await page.fill(R + '.sc-lam', '1'); await page.selectOption(R + '.sc-model', 'rh'); await wait();
  // Hold-out.
  await page.fill(R + '.sc-hold', '0'); await wait();
  check((await rows('.sc-met')).length === 3 && (await rows('.sc-met'))[2][5] === '501', 'sensor: no test periods');
  await page.fill(R + '.sc-hold', '90'); await wait();
  check((await page.textContent(R + '.sc-err')).includes('0 % to 80 %'), 'sensor: bad hold-out message');
  await page.fill(R + '.sc-hold', '30'); await wait();
  // Cleaning settings.
  await page.fill(R + '.sc-hw', '0'); await wait();
  check((await facts()).includes('0 spikes'), 'sensor: spike filter off');
  await page.fill(R + '.sc-stk', '0'); await page.fill(R + '.sc-min', ''); await wait();
  check((await facts()).includes('0 out of range, 0 stuck, 0 spikes'), 'sensor: all cleaning off');
  await page.fill(R + '.sc-stk', '1'); await wait();
  check((await page.textContent(R + '.sc-derr')).includes('2 or more identical'), 'sensor: bad stuck setting message');
  await page.fill(R + '.sc-stk', '10'); await page.fill(R + '.sc-hw', '6'); await page.fill(R + '.sc-min', '0'); await page.fill(R + '.sc-max', '-5'); await wait();
  check((await page.textContent(R + '.sc-derr')).includes('above the lowest'), 'sensor: bad range message');
  await page.fill(R + '.sc-max', '1000'); await page.fill(R + '.sc-int', '30'); await wait();
  check((await facts()).includes('Matched periods0') && (await page.textContent(R + '.sc-err')).includes('Only 0 matched periods'), 'sensor: 30 minutes holds only 6 readings, fewer than 9');
  await page.fill(R + '.sc-minc', '3'); await wait();
  check((await facts()).includes('30 min') && /Matched periods50[0-4]30 min/.test(await facts()), `sensor: 30-minute periods match only where the hourly reference has a time (${(await facts()).match(/Matched periods\d+/)})`);
  await page.fill(R + '.sc-int', '1440'); await page.fill(R + '.sc-minc', '200'); await wait();
  check((await facts()).includes('Matched periods21') && (await big()).startsWith('Calibrated'), 'sensor: daily means, at least 200 readings per day');
  await page.fill(R + '.sc-minc', '400'); await wait();
  check((await page.textContent(R + '.sc-err')).includes('matched periods to fit with'), 'sensor: too few periods message');
  await page.fill(R + '.sc-int', '60'); await page.fill(R + '.sc-minc', '9'); await wait();
  check((await big()) === 'Calibrated = 3.981 + 0.6616 × sensor − 0.08194 × RH', 'sensor: back to the example');
  // Columns: no RH chosen.
  await page.selectOption(R + '.sc-srh', ''); await wait();
  check((await page.textContent(R + '.sc-err')).includes('Choose the relative humidity column'), 'sensor: RH model without RH column');
  await page.selectOption(R + '.sc-srh', '2'); await wait();
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-acsv')]); const f = OUT + 'sc-a.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 502 && t[0] === 'period_start,sensor_mean,rh_mean,temp_mean,reference_mean,calibrated,set' && t[1].startsWith('2026-03-01 00:00,') && t[1].endsWith(',fit') && t[501].endsWith(',test') && t.filter((l) => l.endsWith(',fit')).length === 351, 'sensor: matched periods CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-fcsv')]); const f = OUT + 'sc-f.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 6049 && t.filter((l) => l.endsWith(',stuck')).length === 18 && t.filter((l) => l.endsWith(',out of range')).length === 6 && t.some((l) => l.endsWith(',spike')), 'sensor: flagged readings CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-ncsv')]); const f = OUT + 'sc-n.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    const [, sv, cv] = t[1].split(','); check(t.length === 289 && t[0] === 'time,sensor,calibrated,flag' && Math.abs(+cv - (3.981 + 0.6616 * +sv - 0.08194 * 71)) < 3, 'sensor: calibrated new data CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-out .dl [data-f=pdf]')]); const f = OUT + 'sc.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'sensor: PDF report'); }
  // Own small data: sensor = 2 × reference + 1 exactly, day-first dates, a −999 code and a spike.
  const ref = ['time;ref', ...Array.from({ length: 24 }, (_, h) => `0${1 + Math.floor(h / 24)}/04/2026 ${String(h).padStart(2, '0')}:00;${(10 + (h % 7)).toFixed(1)}`)].join('\n');
  const sen = ['time;raw', ...Array.from({ length: 24 }, (_, h) => `0${1 + Math.floor(h / 24)}/04/2026 ${String(h).padStart(2, '0')}:00;${h === 5 ? -999 : (2 * (10 + (h % 7)) + 1).toFixed(1)}`)].join('\n');
  await page.fill(R + '.sc-s', sen); await page.fill(R + '.sc-r', ref); await page.fill(R + '.sc-n', 'time;raw\n05/04/2026 10:00;31\n05/04/2026 11:00;-999'); await wait(900);
  await page.selectOption(R + '.sc-model', 'lin'); await page.fill(R + '.sc-minc', '1'); await page.fill(R + '.sc-hw', '0'); await page.fill(R + '.sc-hold', '0'); await wait(900);
  check((await big()) === 'Calibrated = -0.5 + 0.5 × sensor' && (await facts()).includes('1 out of range') && (await facts()).includes('Matched periods23'), `sensor: own data, exact line (${await big()})`);
  check((await rows('.sc-ntab'))[1].join('|') === '2026-04-05 10:00|31|15|' && (await rows('.sc-ntab'))[2][3] === 'out of range' && (await page.textContent(R + '.sc-nbig')) === '1 of 2 readings calibrated', 'sensor: apply to new data, error code flagged');
  await page.selectOption(R + '.sc-df', 'm'); await wait(900);
  check((await big()) === 'Calibrated = -0.5 + 0.5 × sensor' && (await facts()).includes('2026-01-04 00:00'), 'sensor: month-first dates read 01/04 as 4 January');
  await page.selectOption(R + '.sc-df', 'd');
  await page.fill(R + '.sc-r', ''); await wait(900);
  check((await page.textContent(R + '.sc-derr')).includes('Paste or open'), 'sensor: no reference message');
  await page.click(R + '.sc-demo'); await wait(1500);
  check((await big()).startsWith('Calibrated = '), 'sensor: example again');
};
