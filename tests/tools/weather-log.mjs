// #899 Weather observer's log
export const path = '/science/weather-log/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/weather-log/`); await page.waitForTimeout(500);
  await page.evaluate(() => localStorage.removeItem('fibub-weather-log-v1')); await page.reload(); await page.waitForTimeout(700);
  const R = '.wlg ', wait = () => page.waitForTimeout(500), txt = (s) => page.textContent(R + s);
  const stored = () => page.evaluate(() => localStorage.getItem('fibub-weather-log-v1'));
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { d, text: readFileSync(f, 'utf8').replace(/^﻿/, '') }; };
  check((await txt('.wl-count')).startsWith('No days saved yet') && await page.isHidden(R + '.wl-out') && (await stored()) === null, 'wlog: starts empty, nothing stored');
  await page.click(R + '.wl-ex'); await wait();
  check((await txt('.wl-count')) === '90 days saved, 2026-08-01 to 2026-10-31.' && JSON.parse(await stored()).log.length === 90, 'wlog: example loaded and kept in this browser');
  { const f = await txt('.wl-vfacts'); check(f.includes('Days logged31October 2026') && f.includes('11.0 / 3.2 °C') && f.includes('mean 7.1 °C') && f.includes('16.7 / −2.5 °C') && f.includes('45.2 mm7 rain days') && f.includes('Frost days5'), 'wlog: October facts'); }
  { const r = await page.$$eval(R + '.wl-mon tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|'))); check(r.length === 3 && r[1].startsWith('2026-09|28|17.3|10.0|13.6|22.9|6.6|103.9|11|') && r[2].includes('|−2.5|45.2|7|0.0|5|'), 'wlog: monthly summary (pandas)'); }
  { const r = await page.$$eval(R + '.wl-rec > div', (x) => x.map((y) => [y.querySelector('dt').textContent, y.querySelector('dd').firstChild.textContent, y.querySelector('small').textContent].join('|'))); check(r[0] === 'Highest maximum|27.6 °C|2026-08-08' && r[3] === 'Lowest minimum|−2.5 °C|2026-10-29' && r.includes('Windiest day|33 km/h|2026-09-02, 2026-10-06, 2026-10-23'), 'wlog: records with a tie'); }
  check(await page.$eval(R + '.wl-tfig', (c) => c.width > 300 && c.getAttribute('aria-label').includes('October 2026')) && await page.$eval(R + '.wl-rfig', (c) => c.getAttribute('aria-label').includes('45.2 mm')), 'wlog: charts drawn');
  check((await page.$$eval(R + '.wl-days tbody tr', (x) => x.length)) === 31 && (await page.$eval(R + '.wl-days tbody tr', (r) => r.dataset.date)) === '2026-10-31', 'wlog: day table, newest first');
  // Add a day.
  await page.fill(R + '.wl-date', '2026-11-01'); await page.fill(R + '.wl-tmax', '9.5'); await page.fill(R + '.wl-tmin', '12'); await page.click(R + '.wl-save'); await wait();
  check((await txt('.wl-ferr')).includes('above the maximum'), 'wlog: min above max refused');
  await page.fill(R + '.wl-tmin', '2.1'); await page.fill(R + '.wl-rain', '4.2'); await page.selectOption(R + '.wl-dir', 'W'); await page.selectOption(R + '.wl-cloud', '6'); await page.fill(R + '.wl-pres', '1009.4'); await page.fill(R + '.wl-notes', 'Hail at noon');
  await page.click(R + '.wl-save'); await wait();
  { const row = await page.$eval(R + '.wl-days tbody tr', (r) => [...r.children].slice(0, 10).map((c) => c.textContent).join('|')); check((await txt('.wl-fok')) === 'Saved 2026-11-01.' && (await page.inputValue(R + '.wl-view')) === '2026-11' && row === '2026-11-01|9.5|2.1|4.2|||W|1009.4|6|Hail at noon' && (await page.inputValue(R + '.wl-date')) === '2026-11-02', `wlog: day saved (${row})`); }
  await page.fill(R + '.wl-date', '2026-11-02'); await page.click(R + '.wl-save'); await wait();
  check((await txt('.wl-ferr')).includes('at least one thing'), 'wlog: empty day refused');
  // Edit.
  await page.click(R + '.wl-days tr[data-date="2026-11-01"] .wl-edit'); await wait();
  check((await page.inputValue(R + '.wl-tmax')) === '9.5' && (await page.inputValue(R + '.wl-notes')) === 'Hail at noon', 'wlog: edit fills the form');
  await page.fill(R + '.wl-tmax', '10'); await page.click(R + '.wl-save'); await wait();
  check((await txt('.wl-fok')) === 'Updated 2026-11-01.' && (await txt('.wl-count')).startsWith('91 days'), 'wlog: edit replaces the day');
  // Delete and undo.
  await page.selectOption(R + '.wl-view', '2026-10'); await wait();
  await page.click(R + '.wl-days tr[data-date="2026-10-31"] .wl-del'); await wait();
  check((await txt('.wl-count')).startsWith('90 days') && (await txt('.wl-undo')).includes('Deleted 2026-10-31.'), 'wlog: delete');
  await page.click(R + '.wl-undob'); await wait();
  check((await txt('.wl-count')).startsWith('91 days') && await page.isHidden(R + '.wl-undo'), 'wlog: undo');
  // Still there after a reload.
  await page.reload(); await page.waitForTimeout(800);
  check((await txt('.wl-count')) === '91 days saved, 2026-08-01 to 2026-11-01.', 'wlog: kept after reload');
  // Units.
  await page.selectOption(R + '.wl-ut', 'F'); await wait();
  { const row = await page.$eval(R + '.wl-days tbody tr', (r) => [...r.children].slice(0, 3).map((c) => c.textContent).join('|')); check(row === '2026-11-01|50.0|35.8' && (await txt('.wl-rec')).includes('81.7 °F') && JSON.parse(await stored()).units.t === 'F', `wlog: converted to °F (${row})`); }
  await page.selectOption(R + '.wl-ut', 'C'); await page.selectOption(R + '.wl-ur', 'in'); await wait();
  check((await page.inputValue(R + '.wl-rd')) === '0.039' && (await txt('.wl-mon')).includes('Rain (in)'), 'wlog: rain in inches, threshold converted');
  await page.selectOption(R + '.wl-ur', 'mm'); await page.fill(R + '.wl-rd', '1'); await wait();
  check((await page.$eval(R + '.wl-days tbody tr', (r) => r.children[1].textContent)) === '10.0' && (await txt('.wl-mon')).includes('|') === false && (await txt('.wl-mon')).includes('103.9'), 'wlog: back to °C and mm');
  // CSV out.
  { const { d, text } = await dl('.wl-csv', 'wl.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'weather-log.csv' && rows.length === 93 && rows[0].startsWith('# Units: temperature °C') && rows[1] === 'Date,Max temp,Min temp,Rain,Snow,Wind speed,Wind direction,Pressure,Cloud (oktas),Notes' && rows[92] === '2026-11-01,10,2.1,4.2,,,W,1009.4,6,Hail at noon', `wlog: log CSV (${rows[92]})`); }
  { const { text } = await dl('.wl-mcsv', 'wlm.csv'); const rows = text.trim().split('\n'); check(rows.length === 5 && rows[3].includes(',-2.5,') && rows[4].startsWith('2026-11,1,10.0,2.1'), 'wlog: monthly CSV'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.wlg .dl [data-f=${f}]`)]); const p = OUT + 'wl.' + f; await d.saveAs(p); check(readFileSync(p).length > 5000, `wlog: ${f} report`); }
  // Import: add.
  writeFileSync(OUT + 'wl-in.csv', 'Date;Tmax;Tmin;Precip;Wind dir;Remarks\n2026-11-01;11;3;0;calm;changed\n2026-11-02;8;x;1;;\n2026-11-03;7;1;tr;270;\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'wl-in.csv'); await page.waitForTimeout(800);
  await page.click(R + '.wl-add'); await wait();
  { const n = await txt('.wl-inote'); check(n.startsWith('2 days read (1 replaced days already in the log).') && n.includes('line 3: "x" is not a number.') && (await txt('.wl-count')).startsWith('92 days') && (await page.inputValue(R + '.wl-view')) === '2026-11', `wlog: import added (${n})`); }
  { const r = await page.$eval(R + '.wl-days tbody tr', (x) => [...x.children].slice(0, 10).map((c) => c.textContent).join('|')); check(r === '2026-11-03|7.0|1.0|0.0|||W|||', `wlog: imported day (${r})`); }
  // Replace needs two taps.
  await page.click(R + '.wl-replace'); await wait();
  check((await page.textContent(R + '.wl-replace')).includes('Tap again') && (await txt('.wl-count')).startsWith('92 days'), 'wlog: replace asks first');
  await page.click(R + '.wl-replace'); await wait();
  check((await txt('.wl-count')) === '2 days saved, 2026-11-01 to 2026-11-03.', 'wlog: replace');
  await page.fill(R + '.wl-in', 'nothing'); await page.click(R + '.wl-add'); await wait();
  check((await txt('.wl-ierr')).includes('header row'), 'wlog: bad import');
  // Delete everything.
  await page.click(R + '.wl-wipe'); await wait(); await page.click(R + '.wl-wipe'); await wait();
  check((await txt('.wl-count')).startsWith('No days saved yet') && (await stored()) === null && await page.isHidden(R + '.wl-out'), 'wlog: delete my log clears the browser storage');
};
