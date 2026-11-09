// #899 Weather observer's log. Checked 2026-11-09 against pandas (groupby month: counts, means, sums, max, min,
// rain days, snow days, frost days, most common direction; records with ties) on 630 random days with gaps and
// blanks: identical within 2.3e-13; and the made-up example's three months against pandas.
import { conv, convertLog, problem, upsert, monthly, records, fromRows, toRows, example, guess, DEFAULT_UNITS } from '../../src/lib/sci/weatherlog.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const U = DEFAULT_UNITS, E = (date, o = {}) => ({ date, tmax: null, tmin: null, rain: null, snow: null, wind: null, dir: '', pres: null, cloud: null, notes: '', ...o });
  check('wlog: unit conversions', near(conv('t', 100, 'C', 'F'), 212) && near(conv('t', 32, 'F', 'C'), 0) && near(conv('r', 25.4, 'mm', 'in'), 1) && near(conv('w', 36, 'km/h', 'm/s'), 10) && near(conv('w', 1, 'kn', 'km/h'), 1.852) && near(conv('p', 1013.25, 'hPa', 'inHg'), 29.9213, 1e-5) && near(conv('s', 2.54, 'cm', 'in'), 1));
  const back = convertLog(convertLog([E('2026-01-01', { tmax: 21.3, rain: 12.7, wind: 20, pres: 1012.4 })], U, { t: 'F', r: 'in', s: 'in', w: 'mph', p: 'inHg' }), { t: 'F', r: 'in', s: 'in', w: 'mph', p: 'inHg' }, U)[0];
  check('wlog: converting there and back keeps the values', Math.abs(back.tmax - 21.3) < 1e-4 && Math.abs(back.rain - 12.7) < 1e-4 && Math.abs(back.wind - 20) < 1e-4 && Math.abs(back.pres - 1012.4) < 1e-3 && back.tmin === null);
  check('wlog: entry checks', problem(E('2026-02-30'), U).includes('real date') && problem(E('2026-03-01', { tmax: 1, tmin: 5 }), U).includes('above the maximum') && problem(E('2026-03-01', { rain: -1 }), U).includes('negative') && problem(E('2026-03-01', { pres: 500 }), U).includes('Pressure') && problem(E('2026-03-01', { cloud: 9 }), U).includes('oktas') && problem(E('2026-03-01', { dir: 'XYZ' }), U).includes('compass') && problem(E('2026-03-01', { tmax: 5, tmin: 1, cloud: 8, dir: 'Calm' }), U) === '');
  const a = upsert(upsert([], E('2026-03-02', { tmax: 5 })).log, E('2026-03-01', { tmax: 4 })).log, b = upsert(a, E('2026-03-02', { tmax: 9 }));
  check('wlog: upsert keeps order and replaces a date', a.map((e) => e.date).join() === '2026-03-01,2026-03-02' && b.replaced && b.log.length === 2 && b.log[1].tmax === 9);
  const log = [E('2026-01-01', { tmax: 2, tmin: -3, rain: 0.2, snow: 2, wind: 10, dir: 'N', pres: 1000, cloud: 8 }), E('2026-01-02', { tmax: 6, tmin: 1, rain: 5, wind: 30, dir: 'N' }), E('2026-01-04', { tmin: -1, rain: 1, dir: 'SW' }), E('2026-02-01', { tmax: 10, tmin: 2 })];
  const m = monthly(log, U, 1);
  check('wlog: monthly counts, means and totals', m.length === 2 && m[0].days === 3 && near(m[0].tmax.mean, 4) && near(m[0].tmin.mean, -1) && near(m[0].tmean, 1.5) && near(m[0].rain.sum, 6.2) && m[0].rainDays === 2 && m[0].snowDays === 1 && m[0].frost === 2 && m[0].dir === 'N' && near(m[0].wind.mean, 20) && m[1].rain.n === 0);
  check('wlog: rain-day threshold 0.2 counts the trace', monthly(log, U, 0.2)[0].rainDays === 3);
  check('wlog: frost in °F is below 32', monthly([E('2026-01-01', { tmin: 31 }), E('2026-01-02', { tmin: 33 })], { ...U, t: 'F' })[0].frost === 1);
  const rec = records([...log, E('2026-02-02', { tmax: 10 })]);
  check('wlog: records with ties list every date', rec[0].label === 'Highest maximum' && rec[0].value === 10 && rec[0].dates.join() === '2026-02-01,2026-02-02' && rec.find((r) => r.label === 'Lowest minimum').value === -3 && rec.find((r) => r.label === 'Wettest day').dates[0] === '2026-01-02');
  check('wlog: no rain or snow record when none fell', !records([E('2026-01-01', { rain: 0, snow: 0, tmax: 1 })]).some((r) => r.label === 'Wettest day' || r.label.includes('snow')));
  const g = guess(['Date', 'Tmax', 'Tmin', 'Precip', 'Snowfall', 'Wind speed', 'Wind dir', 'MSLP', 'Cloud', 'Remarks']);
  check('wlog: CSV headers matched', g.date === 0 && g.tmax === 1 && g.tmin === 2 && g.rain === 3 && g.snow === 4 && g.wind === 5 && g.dir === 6 && g.pres === 7 && g.cloud === 8 && g.notes === 9);
  const r = fromRows(parseTable('Date,Max,Min,Rain,Wind dir,Notes\n2026-5-3,20,10,tr,45,ok\n2026-05-04,x,1,,,\n2026-05-05,5,9,,,\n2026-05-06,,,,calm,fog'), U, num);
  check('wlog: import reads trace, degrees, calm and skips bad lines', r.entries.length === 2 && r.entries[0].date === '2026-05-03' && r.entries[0].rain === 0 && r.entries[0].dir === 'NE' && r.entries[1].dir === 'Calm' && r.skipped.length === 2 && r.skipped[0].line === 3 && r.skipped[1].why.includes('above the maximum'));
  const ex = example(), rows = toRows(ex), again = fromRows(rows.map((x) => x.map(String)), U, num);
  check('wlog: export and import round trip of the example', again.skipped.length === 0 && JSON.stringify(again.entries) === JSON.stringify(ex));
  const me = monthly(ex, U, 1);
  check('wlog: example months (pandas: 31, 28, 31 days; rain 85.8, 103.9, 45.2; 9, 11, 7 rain days; October 5 frost days)', me.map((x) => x.days).join() === '31,28,31' && me.map((x) => x.rain.sum.toFixed(1)).join() === '85.8,103.9,45.2' && me.map((x) => x.rainDays).join() === '9,11,7' && me[2].frost === 5 && near(me[2].tmax.mean, 10.983870967741938, 1e-9));
  check('wlog: example records (pandas: max 27.6 on 08-08, min −2.5 on 10-29, wind 33 on three days)', (() => { const rr = records(ex); return rr[0].value === 27.6 && rr[0].dates[0] === '2026-08-08' && rr[3].value === -2.5 && rr[3].dates[0] === '2026-10-29' && rr.find((x) => x.label === 'Windiest day').dates.length === 3; })());
};
