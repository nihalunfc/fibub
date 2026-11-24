// #897 Weather station data viewer. Checked against pandas 3.1 on the made-up example (1428 hourly records): the
// usual step, the gap, every daily and monthly count, min, mean, max and rain sum (within 1.5e-12), the daily
// vector-mean wind direction; and against the windrose package's histogram(): identical 16-sector × speed-class
// counts, calms and totals, and identical sectors for boundary directions (11.25° goes to NNE, 348.75° to N).
import { parseTime, guessColumns, loadRecords, interval, gaps, summarise, windRose, vectorDir, example, fmtTime, fmtDur, sectorName } from '../../src/lib/sci/station.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('station: ISO times, with T, seconds and an offset ignored', parseTime('2026-03-04 05:06') === Date.UTC(2026, 2, 4, 5, 6) && parseTime('2026-03-04T05:06:07Z') === Date.UTC(2026, 2, 4, 5, 6, 7) && parseTime('2026-03-04T05:06:07+05:30') === Date.UTC(2026, 2, 4, 5, 6, 7));
  check('station: day-first and month-first dates, AM/PM, a separate time', parseTime('04/03/2026 17:00', 'dmy') === Date.UTC(2026, 2, 4, 17) && parseTime('03/04/2026 5:00 PM', 'mdy') === Date.UTC(2026, 2, 4, 17) && parseTime('4.3.26', 'dmy', '12:30 am') === Date.UTC(2026, 2, 4, 0, 30));
  check('station: impossible dates are refused', parseTime('2026-02-30') === null && parseTime('2026-13-01') === null && parseTime('04/03/2026', 'ymd') === null && parseTime('hello') === null);
  const m = guessColumns(['Date', 'Time', 'Temp (°C)', 'Dew point', 'RH (%)', 'Pressure hPa', 'Wind gust', 'Wind speed', 'Wind dir', 'Rain total']);
  check('station: columns guessed from headers (dew point and gust skipped)', m.date === 0 && m.time === 1 && m.clock === -1 && m.T === 2 && m.RH === 4 && m.P === 5 && m.WS === 7 && m.WD === 8 && m.R === 9);
  const ex = parseTable(example()), map = guessColumns(ex[0]);
  check('station: example headers', map.time === 0 && map.T === 1 && map.RH === 2 && map.P === 3 && map.WS === 4 && map.WD === 5 && map.R === 6);
  const L = loadRecords(ex.slice(1), map, num), step = interval(L.recs);
  check('station: example loads 1428 hourly records (pandas)', L.recs.length === 1428 && step === 3600000 && L.badTime === 0 && L.dupes === 0);
  const g = gaps(L.recs, step);
  check('station: one gap of 36 missing hours (pandas diff)', g.length === 1 && g[0].missing === 36 && fmtTime(g[0].from) === '2026-03-20 23:00' && fmtTime(g[0].to) === '2026-03-22 12:00' && fmtDur(g[0].to - g[0].from) === '37 h');
  const d = summarise(L.recs, 'day', step), mo = summarise(L.recs, 'month', step);
  check('station: 60 days and 2 months (pandas resample)', d.length === 60 && mo.length === 2 && d[0].key === '2026-03-01' && mo[1].key === '2026-04');
  check('station: day 1 temperature (pandas: n 24, min 0.3, mean 4.8417)', d[0].T.n === 24 && d[0].T.min === 0.3 && near(d[0].T.mean, 4.841666666666667, 1e-9) && d[0].complete === 1);
  check('station: partial day completeness', near(d.find((x) => x.key === '2026-03-22').complete, 12 / 24));
  check('station: rain sums add up', near(d.reduce((s, x) => s + x.R.sum, 0), mo.reduce((s, x) => s + x.R.sum, 0), 1e-9));
  const R = windRose(L.recs, [0.5, 2, 4, 6, 8], 0.5);
  check('station: wind rose totals (windrose package: 88 calms, 1428 used)', R.calm === 88 && R.total === 1428 && R.noDir === 0 && R.counts.flat().reduce((a, b) => a + b, 0) === 1340);
  const b = windRose([0, 11.25, 11.2499, 348.75, 348.7499, 359.9, 22.5, 33.75, 180, 191.25, 360].map((x, i) => ({ t: i, WS: 3, WD: x === 360 ? 0 : x })), [0.5, 2, 4], 0.5);
  check('station: sector boundaries as windrose bins them', b.counts.map((c) => c[1]).join(' ') === '5 2 1 0 0 0 0 0 1 1 0 0 0 0 0 1');
  check('station: speed classes, last one open; no direction counted apart', windRose([{ t: 0, WS: 0.49, WD: 90 }, { t: 1, WS: 0.5, WD: 90 }, { t: 2, WS: 2, WD: 90 }, { t: 3, WS: 99, WD: 90 }, { t: 4, WS: 5 }], [0.5, 2, 4], 0.5).counts[4].join() === '1,1,1');
  check('station: vector-mean direction across north', near(vectorDir([{ t: 0, WS: 1, WD: 350 }, { t: 1, WS: 1, WD: 10 }]), 0, 1e-9) || near(vectorDir([{ t: 0, WS: 1, WD: 350 }, { t: 1, WS: 1, WD: 10 }]), 360, 1e-9));
  const rows = [['2026-01-01 00:00', '5', '10.0'], ['2026-01-01 01:00', '5', '10.4'], ['2026-01-01 00:00', '9', '99'], ['2026-01-01 03:00', '5', '0.2'], ['bad', '1', '1'], ['2026-01-01 02:00', '5', '11.0']];
  const c = loadRecords(rows, { time: 0, date: -1, clock: -1, T: 1, RH: -1, P: -1, WS: -1, WD: -1, R: 2 }, num, 'ymd', 'total');
  check('station: running rain total, a reset, unordered rows, a duplicate and a bad time', c.unordered && c.dupes === 1 && c.badTime === 1 && c.firstBad === 'bad' && c.resets === 1 && c.recs.map((r) => +r.R.toFixed(2)).join() === '0,0.4,0.6,0.2' && c.recs[0].T === 5);
  check('station: sector names', sectorName(0, 16) === 'N' && sectorName(11, 16) === 'WSW' && sectorName(3, 8) === 'SE' && sectorName(2, 4) === 'S');
  // New with the 24-hour-window article (Yang et al. 2026): a cosine day, a clock shifted by nine hours, and two small files of 6-hourly readings.
  { const H = 3600e3, t0 = Date.UTC(2026, 2, 1), rs = Array.from({ length: 48 }, (_, i) => ({ t: t0 + i * H, T: 10 + 5 * Math.cos((2 * Math.PI * ((i % 24) - 15)) / 24) }));
    const d = summarise(rs, 'day', H), e = summarise(rs.map((r) => ({ ...r, t: r.t - 9 * H })), 'day', H);
    check('station: a cosine day (mean 10, amplitude 5, peak 15:00) has max 15, min 5, mean 10 and 24 records', d.length === 2 && d.every((x) => x.n === 24 && Math.abs(x.T.max - 15) < 1e-9 && Math.abs(x.T.min - 5) < 1e-9 && Math.abs(x.T.mean - 10) < 1e-9));
    check('station: shifting the clock by nine hours moves the day boundary: the middle two days keep 24 records and the same max and min', e.filter((x) => x.n === 24).length === 1 && e.filter((x) => x.n === 24).every((x) => Math.abs(x.T.max - 15) < 1e-9 && Math.abs(x.T.min - 5) < 1e-9));
    const v = [8, 6, 14, 12, 9, 7, 16, 13], a = summarise(v.map((x, i) => ({ t: t0 + i * 6 * H, T: x })), 'day', 6 * H), b = summarise(v.map((x, i) => ({ t: t0 + 9 * H + i * 6 * H, T: x })), 'day', 6 * H);
    check('station: 6-hourly file a gives 1 March 14/6/10.00 and 2 March 16/7/11.25; moved 9 h later it gives 9.33 (3 records, 75 percent), 11.00 and a lone record', a[0].T.max === 14 && a[0].T.min === 6 && a[0].T.mean === 10 && a[1].T.max === 16 && a[1].T.min === 7 && a[1].T.mean === 11.25 && b.length === 3 && b[0].n === 3 && Math.abs(b[0].T.mean - 28 / 3) < 1e-9 && b[0].complete === 0.75 && b[1].T.mean === 11 && b[2].n === 1); }
};
