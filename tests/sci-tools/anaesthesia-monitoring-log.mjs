// #400 Anaesthesia monitoring log: times, alert ranges, summaries and CSV round trip (checked by hand).
import { VITALS, minutes, hhmm, times, elapsed, emptyRow, noRanges, alerts, problems, summary, toRows, fromRows, parseCsv, EXAMPLE, PRACTICE_RANGES } from '../../src/lib/sci/anaesmon.ts';
import { parseTable, num, csv } from '../../src/lib/sci/num.ts';
export default async (check) => {
  check('anaes: times read', minutes('09:05') === 545 && minutes('9.05') === 545 && Number.isNaN(minutes('25:00')) && Number.isNaN(minutes('9')) && hhmm(1445) === '00:05');
  check('anaes: rows every 5 min across midnight', times('23:50', 5, 5).join() === '23:50,23:55,00:00,00:05,00:10');
  const rows = EXAMPLE.rows.map((r) => { const x = emptyRow(String(r[0])); VITALS.forEach((v, k) => (x.v[v.key] = Number(r[k + 1]))); x.depth = String(r[9]); return x; });
  check('anaes: elapsed minutes across midnight', elapsed(times('23:50', 10, 4).map(emptyRow)).join() === '0,10,20,30' && elapsed(rows).at(-1) === 40);
  check('anaes: no alerts with blank ranges', alerts(rows, noRanges()).length === 0);
  const R = noRanges(); for (const [k, [a, b]] of Object.entries(PRACTICE_RANGES)) R[k] = { min: a, max: b };
  const al = alerts(rows, R);
  check(`anaes: example alerts with practice ranges (${al.length})`, al.length === 6 && al.filter((a) => a.time === '09:20').map((a) => `${a.key}:${a.side}`).join() === 'etco2:high,sap:low,map:low' && al.filter((a) => a.key === 'temp').length === 3);
  check('anaes: a reading equal to a limit is not an alert', !al.some((a) => a.key === 'rr'));
  const st = summary(rows), hr = st.find((s) => s.key === 'hr');
  check('anaes: summary of heart rate', hr.n === 9 && hr.min === 88 && hr.max === 112 && Math.abs(hr.mean - 98.444444) < 1e-5 && hr.first === 112 && hr.last === 102);
  check('anaes: example has no impossible readings', problems(rows).length === 0);
  { const bad = emptyRow('10:00'); bad.v.spo2 = 101; bad.v.sap = 80; bad.v.dap = 90; bad.v.hr = -1; const p = problems([bad]); check('anaes: impossible readings found', p.length === 3 && p.some((x) => x.includes('above 100')) && p.some((x) => x.includes('systolic is below'))); }
  { const back = fromRows(parseCsv(csv(toRows(rows))), num); check('anaes: CSV round trip', back.errors.length === 0 && back.rows.length === 9 && JSON.stringify(back.rows) === JSON.stringify(rows)); }
  { const r = fromRows([['Time', 'HR', 'Depth'], ['9:00', '80', 'ok'], ['later', '1', '']], num); check('anaes: other tables and bad times', r.rows.length === 1 && r.rows[0].time === '09:00' && r.rows[0].v.hr === 80 && Number.isNaN(r.rows[0].v.rr) && r.rows[0].depth === 'ok' && r.errors[0].includes('"later"')); }
  check('anaes: CSV with quotes, commas and CRLF', JSON.stringify(parseCsv('a,b\r\n"x, ""y""",2\r\n\r\n')) === JSON.stringify([['a', 'b'], ['x, "y"', '2']]) && parseCsv('a\tb\n1\t2')[1][1] === '2');
  check('anaes: a file without a time column', fromRows([['a', 'b']], num).errors[0].includes('"time" column'));
};
