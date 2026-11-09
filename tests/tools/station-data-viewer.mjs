// #897 Weather station data viewer
export const path = '/science/station-data-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/station-data-viewer/`); await page.waitForTimeout(700);
  const R = '.sdv ', facts = () => page.textContent(R + '.sd-facts');
  const wait = () => page.waitForTimeout(700);
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { d, text: readFileSync(f, 'utf8').replace(/^﻿/, '') }; };
  { const f = await facts(); check(f.includes('Records1,4286 variables') && f.includes('From2026-03-01 00:00') && f.includes('To2026-04-30 23:00') && f.includes('Usual step1 h') && f.includes('Gaps136 records missing in all') && f.includes('Complete97.5 %1,428 of 1,464 expected records') && f.includes('Blank values6temperature 6'), 'station: example overview'); }
  check((await page.textContent(R + '.sd-gaps tbody')) === '2026-03-20 23:002026-03-22 12:0037 h36', 'station: gaps table');
  check((await page.$$eval(R + '.sd-ts', (c) => c.length)) === 5, 'station: five time-series charts');
  check((await page.textContent(R + '.sd-rnote')) === '1,428 records used, 6.2 % calm. Most common direction: W (19.3 %).' && (await page.$$eval(R + '.sd-rtab tbody tr', (r) => r.length)) === 16, 'station: wind rose note and table');
  { const { d, text } = await dl('.sd-rcsv', 'rose.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'wind-rose.csv' && rows.length === 18 && rows[0] === 'Direction,0.5–2 m/s (%),2–4 m/s (%),4–6 m/s (%),6–8 m/s (%),≥ 8 m/s (%),All (%),Records' && rows[17] === 'Calm,,,,,,6.162,88', 'station: wind rose CSV'); }
  { const { text } = await dl('.sd-rsvg', 'rose.svg'); check(text.includes('<svg xmlns') && text.includes('>6.2%<') && text.includes('>W<') && text.includes('>Calm &lt; 0.5 m/s<') && (text.match(/<polygon/g) ?? []).length > 40, 'station: wind rose SVG'); }
  await page.selectOption(R + '.sd-sec', '8'); await wait();
  check((await page.$$eval(R + '.sd-rtab tbody tr', (r) => r.length)) === 8 && (await page.textContent(R + '.sd-rnote')).includes('Most common direction: W'), 'station: 8 sectors');
  await page.fill(R + '.sd-edges', '4, 2'); await wait();
  check((await page.textContent(R + '.sd-rerr')).includes('rising speeds') && await page.isHidden(R + '.sd-rose'), 'station: bad speed classes');
  await page.fill(R + '.sd-edges', '0.5, 2, 4, 6, 8'); await page.selectOption(R + '.sd-sec', '16'); await wait();
  { const first = await page.$eval(R + '.sd-sum tbody tr', (r) => [...r.children].map((c) => c.textContent).join('|')); check(first.startsWith('2026-03-01|24|100|0.3|4.8|9.1|62|77|89|1005.0|1008.1|1011.8|4.5|7.8|228|4.7'), `station: first day summary (${first})`); }
  { const { d, text } = await dl('.sd-scsv', 'day.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'station-daily-summary.csv' && rows.length === 61 && rows[0].startsWith('Day,Records,Complete %,T min (°C),T mean (°C),T max (°C)') && rows[1].startsWith('2026-03-01,24,100,0.3,4.8,9.1'), 'station: daily CSV'); }
  await page.click(R + '.sd-by [data-by=month]'); await wait();
  { const r = await page.$$eval(R + '.sd-sum tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|'))); check(r.length === 2 && r[0].startsWith('2026-03|708|95|−1.4|7.9|17.7') && r[0].endsWith('|114.4') && r[1].endsWith('|127.6'), 'station: monthly summary'); }
  { const { text } = await dl('.sd-gcsv', 'gaps.csv'); check(text.trim() === 'Last record before,Next record,Gap (minutes),Missing records\n2026-03-20 23:00,2026-03-22 12:00,2220,36', 'station: gaps CSV'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.sdv .dl [data-f=${f}]`)]); const p = OUT + 'sd.' + f; await d.saveAs(p); check(readFileSync(p).length > 5000, `station: ${f} download`); }
  // Remap a column.
  await page.selectOption(R + '.sd-c-T', '-1'); await wait();
  check((await page.$$eval(R + '.sd-ts', (c) => c.length)) === 4 && !(await page.textContent(R + '.sd-sum thead')).includes('T min'), 'station: a column switched off');
  // Separate date and time columns, day-first dates, a running rain total, unordered rows, a repeat and a reset.
  const file = OUT + 'st-in.csv';
  writeFileSync(file, 'Date;Time;Temp;Wind speed;Wind dir;Rain total\n01/03/2026;00:00;5;3;90;10.0\n01/03/2026;00:10;6;4;360;10.4\n01/03/2026;00:30;7;0.2;0;0.2\n01/03/2026;00:20;8;5;180;11.0\n01/03/2026;00:10;9;9;9;99\n02/03/2026;00:00;4;2;270;0.5\n');
  await page.selectOption(R + '.sd-ord', 'dmy'); await page.selectOption(R + '.sd-rm', 'total');
  await page.setInputFiles(R + '.dfb-in', file); await page.waitForTimeout(1000);
  { const f = await facts(), n = await page.textContent(R + '.sd-note'); check(f.includes('Records5') && f.includes('Usual step10 min') && f.includes('Gaps1140 records missing') && n.includes('sorted') && n.includes('1 repeated time was dropped') && n.includes('dropped 1 time'), `station: date and time columns, sorting, repeats, reset (${n})`); }
  await page.click(R + '.sd-by [data-by=day]'); await wait();
  { const r = await page.$$eval(R + '.sd-sum tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|'))); check(r.length === 2 && r[0].startsWith('2026-03-01|4|') && r[0].endsWith('|1.2') && r[1].endsWith('|0.3'), `station: running rain total to amounts (${r.join(' / ')})`); }
  check((await page.textContent(R + '.sd-rnote')).startsWith('5 records used, 20.0 % calm'), 'station: wind rose from the file, 360 read as north');
  await page.selectOption(R + '.sd-ord', 'ymd'); await wait();
  check((await page.textContent(R + '.sd-err')).includes('Could not read the times (such as "01/03/2026 00:00")') && await page.isHidden(R + '.sd-out'), 'station: wrong date order');
  await page.click(R + '.sd-clear'); await wait();
  check((await page.textContent(R + '.sd-err')).includes('Paste or open a table'), 'station: start empty');
  await page.selectOption(R + '.sd-rm', 'amount'); await page.click(R + '.sd-ex'); await wait();
  check((await facts()).includes('Records1,428'), 'station: example again');
};
