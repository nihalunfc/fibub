// #215 solar cycle fitter
export const path = '/science/solar-cycle-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/solar-cycle-fitter/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.scf .scf-big'), facts = () => page.textContent('.scf .scf-facts'), tab = () => page.textContent('.scf .scf-tab');
  const settle = () => page.waitForTimeout(700);
  check((await big()) === 'Cycle 5 (in progress): peak expected 2026-12 (2026-06 to 2027-06), height 120.3 (110.0 to 134.6)', 'solar cycle: made-up example forecast (past shape)');
  { const f = await facts(); check(f.includes('4: length 11.2 ± 0.3 years') && f.includes('about 2034-01') && f.includes('shape from past cycles') && f.includes('1976-01 to 2026-10'), 'solar cycle: example facts'); }
  { const t = await tab(); check(['1978-02', '1988-12', '2000-02', '2011-06', '2022-11', '10.83', '11.42', '133.1 (', '172.5 (', '5 (now)'].every((s) => t.includes(s)), 'solar cycle: example cycle table'); }
  { const ink = await page.evaluate(() => [...document.querySelectorAll('.scf canvas')].map((c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[0]) + Math.abs(x[i + 1] - x[1]) + Math.abs(x[i + 2] - x[2]) > 60) n++; return n; }));
    check(ink.length === 2 && ink.every((n) => n > 3000), `solar cycle: both charts drawn (${ink})`); }
  await page.selectOption('.scf .scf-m', 'free'); await settle();
  check((await big()).includes('peak expected 2026-10') && (await big()).includes('height 118.5 (73.4 to 125.6)') && (await facts()).includes('free fit of this cycle'), 'solar cycle: free fit of the current cycle');
  await page.selectOption('.scf .scf-lv', '0.68'); await settle();
  { const b = await big(), lo = Number(b.match(/height 118\.5 \(([\d.]+) to/)[1]); check((await facts()).includes('Peak (68 % band)') && lo > 73.4, 'solar cycle: 68 % band is narrower'); }
  await page.selectOption('.scf .scf-lv', '0.95'); await page.selectOption('.scf .scf-m', 'auto'); await page.selectOption('.scf .scf-to', 'smoothed'); await settle();
  check(!(await tab()).includes('133.1 (') && (await tab()).includes('1978-02'), 'solar cycle: fit to the 13-month mean changes the fits');
  await page.selectOption('.scf .scf-to', 'monthly');
  await page.fill('.scf .scf-n0', '21'); await settle();
  check((await big()).startsWith('Cycle 25 (in progress)') && (await tab()).includes('21'), 'solar cycle: first cycle number');
  await page.fill('.scf .scf-c', '0.4'); await settle();
  check((await facts()).includes('shape from past cycles') && !(await big()).includes('120.3'), 'solar cycle: another shape constant');
  await page.fill('.scf .scf-c', '1.5'); await settle();
  check((await page.textContent('.scf .scf-serr')).includes('between 0 and 0.99') && await page.isHidden('.scf .scf-out'), 'solar cycle: bad shape constant message');
  await page.fill('.scf .scf-c', '0.7'); await page.fill('.scf .scf-gap', '40'); await settle();
  check((await page.textContent('.scf .scf-serr')).includes('between 2 and 30 years'), 'solar cycle: bad spacing message');
  await page.fill('.scf .scf-gap', '7'); await page.fill('.scf .scf-n0', '1'); await settle();
  check((await big()).startsWith('Cycle 5 (in progress): peak expected 2026-12'), 'solar cycle: back to the defaults');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scf .scf-csv')]); const f = OUT + 'scf-months.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    const last = rows[rows.length - 1].split(','); check(rows[0] === 'month,decimal_year,value,mean_13_month,cycle,shape_fit,current_cycle_fit,band_low,band_high' && rows[1].startsWith('1976-01,1976.0417,') && rows.length > 700 && last[2] === '' && Number(last[7]) <= Number(last[6]) && Number(last[6]) <= Number(last[8]), `solar cycle: months CSV with the forecast months (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scf .scf-ccsv')]); const f = OUT + 'scf-cycles.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 6 && rows[0].startsWith('cycle,complete,minimum') && rows[1].startsWith('1,yes,1978-02,') && rows[5].startsWith('5,no,2022-11,') && rows[5].endsWith(',past') && rows[5].includes(',fixed,'), 'solar cycle: cycles CSV'); }
  // A file of year;month;decimal year;value lines (public-file style), with a missing month as -1.
  { const ex = await page.inputValue('.scf .scf-in');
    const lines = ex.split('\n').slice(1).map((l) => { const [ym, v] = l.split(','); const [y, m] = ym.split('-').map(Number); return `${y};${String(m).padStart(2, '0')};${(y + (m - 0.5) / 12).toFixed(3)};${ym === '1990-05' ? '-1' : v};-1.0;-1;1`; });
    writeFileSync(OUT + 'scf.csv', lines.join('\n') + '\n'); }
  await page.locator('.scf .dfb-open').scrollIntoViewIfNeeded();
  await page.setInputFiles('.scf .dfb-in', OUT + 'scf.csv'); await page.waitForTimeout(1000);
  check((await facts()).includes('1 missing') && (await big()).startsWith('Cycle 5 (in progress)') && (await page.textContent('.scf .dfb-note')).includes('610 rows'), 'solar cycle: opened a semicolon file with a missing month');
  await page.fill('.scf .scf-in', (await page.inputValue('.scf .scf-in')) + '\nnot a date;5'); await settle();
  check((await page.textContent('.scf .scf-warn')).includes('1 line left out') && await page.isVisible('.scf .scf-out'), 'solar cycle: a bad line is named and skipped');
  await page.fill('.scf .scf-in', '2020-01,5\n2020-02,6\n2020-03,7'); await settle();
  check((await page.textContent('.scf .scf-err')).includes('at least 13 are needed') && await page.isHidden('.scf .scf-out'), 'solar cycle: too few months');
  { const t = Array.from({ length: 60 }, (_, i) => `${2000 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')},${(50 + i).toFixed(1)}`).join('\n');
    await page.fill('.scf .scf-in', t); await settle();
    check((await big()) === 'No cycle minimum found yet' && (await page.textContent('.scf .scf-note')).includes('No minimum found'), 'solar cycle: a short rising series has no minimum'); }
  await page.locator('.scf .scf-clear').scrollIntoViewIfNeeded(); await page.click('.scf .scf-clear'); await settle();
  check((await page.textContent('.scf .scf-err')).includes('Paste or open monthly numbers'), 'solar cycle: empty box message');
  await page.click('.scf .scf-ex'); await settle();
  check((await big()).startsWith('Cycle 5 (in progress): peak expected 2026-12'), 'solar cycle: example button');
};
