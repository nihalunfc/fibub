// #420 heritage climate and mould risk checker. Every summary number of the made-up example log and of a random
// irregular log with gaps (comma decimals, separate date and time columns) checked against an independent
// pandas/NumPy script (time weights, dew point, hours over thresholds, longest damp spell, daily swings, Arrhenius rate).
import * as H from '../../src/lib/sci/heritageclimate.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('climate: Magnus dew point 20 °C, 50 % = 9.2552 °C; 25 °C, 80 % = 21.3069 °C; 100 % = T', near(H.dewPoint(20, 50), 9.255174598981256) && near(H.dewPoint(25, 80), 21.306887199560098) && Math.abs(H.dewPoint(12.3, 100) - 12.3) < 1e-12);
  check('climate: time stamps (ISO, d/m/y, m/d/y with PM, Excel day number, 2-digit year)',
    H.parseTime('2026-06-01 13:00') === Date.UTC(2026, 5, 1, 13) && H.parseTime('01/02/2026 1:30 PM') === Date.UTC(2026, 1, 1, 13, 30) && H.parseTime('02/13/2026 08:00:30') === Date.UTC(2026, 1, 13, 8, 0, 30)
    && H.parseTime('02/03/2026', 'mdy') === Date.UTC(2026, 1, 3) && H.parseTime('46000') === Date.UTC(2025, 11, 9) && H.parseTime('31.12.25 23:59') === Date.UTC(2025, 11, 31, 23, 59) && Number.isNaN(H.parseTime('13/13/2026')) && Number.isNaN(H.parseTime('hello')));
  check('climate: column guess from headers', JSON.stringify(H.guessColumns(['No.', 'Date', 'Time', 'Temp °C', 'RH %', 'Dew point'])) === '{"date":1,"time":2,"temp":3,"rh":4}' && JSON.stringify(H.guessColumns(['Timestamp', 'Humidity', 'Temperature'])) === '{"date":-1,"time":0,"temp":2,"rh":1}');
  const O = { rhHigh: 65, rhLow: 40, tHigh: 22, tLow: 16, mouldRh: 70, swing: 10, ea: 100, tRef: 20, rhRef: 50, rhExp: 1 };
  const p = H.parseLog(H.exampleLog()), r = H.analyse(p.readings, O);
  check('climate: example log 720 hourly readings, no gaps', p.readings.length === 720 && p.bad === 0 && r.step === 3600000 && r.gaps === 0 && r.hours === 720);
  check('climate: example means match pandas (T 20.1997, RH 55.7747, dew point 10.9126)', near(r.temp.mean, 20.19972222222222) && near(r.rh.mean, 55.77472222222222) && near(r.dew.mean, 10.912595171894434) && near(r.dew.max, 17.454657073593758));
  check('climate: example hours over thresholds match pandas (RH>65 98 h, T>22 73 h, RH≥70 91 h)', r.hoursRhHigh === 98 && r.hoursRhLow === 0 && r.hoursTHigh === 73 && r.hoursTLow === 0 && r.hoursMould === 91);
  check('climate: longest damp spell 91 h, 13 Jun 16:00 to 17 Jun 11:00', r.longest.hours === 91 && r.longest.from === Date.UTC(2026, 5, 13, 16) && r.longest.to === Date.UTC(2026, 5, 17, 11));
  check('climate: daily swings match pandas (30 days, 2 over 10 %, largest 27.6 on 17 Jun, mean 8.857)', r.days.length === 30 && r.daysOverSwing === 2 && near(r.maxSwing.range, 27.6) && r.maxSwing.day === Date.UTC(2026, 5, 17) && near(r.meanSwing, 8.856666666666666));
  check('climate: Arrhenius rate 1.15728 and preservation index 0.86410 match NumPy', near(r.rate, 1.1572752449303747) && near(r.twpi, 0.8640986700274256));
  check('climate: rate is 1 at the reference and doubles about every 5 °C at 100 kJ/mol', H.relRate(20, 50, O) === 1 && near(H.relRate(25, 50, O), Math.exp((100000 / 8.314462618) * (1 / 293.15 - 1 / 298.15))) && H.relRate(20, 25, O) === 0.5);
  // Random irregular log: 15-minute steps with 16-minute jitter, 7-hour gaps, 'dd.mm.yyyy;hh:mm:ss;decimal comma'.
  let seed = 5; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const lines = ['Date;Time;T;RH']; let t = Date.UTC(2025, 0, 1, 0, 0);
  for (let i = 0; i < 3000; i++) { t += rnd() < 0.01 ? 7 * 3600000 : 15 * 60000 + (rnd() < 0.1 ? 60000 : 0); const d = new Date(t).toISOString();
    lines.push(`${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)};${d.slice(11, 19)};${(10 + 15 * rnd()).toFixed(2).replace('.', ',')};${(30 + 60 * rnd()).toFixed(1).replace('.', ',')}`); }
  const q = H.parseLog(lines.join('\n'), { order: 'dmy' }), s = H.analyse(q.readings, O);
  check('climate: random log read (3000 rows, 34 gaps, 755.17 h)', q.readings.length === 3000 && q.cols.date === 0 && s.gaps === 34 && near(s.hours, 755.1666666666666));
  check('climate: random log matches pandas (means, hours over thresholds)', near(s.temp.mean, 17.505748620613552) && near(s.rh.mean, 59.68364599426175) && near(s.dew.mean, 8.975533824469851) && near(s.hoursRhHigh, 306.9) && near(s.hoursRhLow, 126.01666666666667) && near(s.hoursTHigh, 146.95) && near(s.hoursTLow, 299.1333333333333) && near(s.hoursMould, 244.96666666666667));
  check('climate: random log longest spell, swings and rate match pandas', near(s.longest.hours, 1.5) && s.days.length === 42 && s.daysOverSwing === 17 && near(s.maxSwing.range, 59.9) && near(s.meanSwing, 58.7) && near(s.rate, 0.9913167833470716));
  const f = H.parseLog('time,T (°F),RH\n2026-01-01 00:00,68,50\n2026-01-01 01:00,bad,50\n2026-01-01 02:00,77,101', { fahrenheit: true });
  check('climate: °F converted, bad rows counted', f.readings.length === 1 && near(f.readings[0].temp, 20) && f.bad === 2 && f.firstBad.startsWith('line 3'));
  const n = H.parseLog('1\t2026-03-01 10:00\t21\t45\n2\t2026-03-01 10:30\t21.5\t46');
  { const x = Array.from({ length: 10000 }, (_, i) => i), y = x.map((i) => Math.sin(i / 50) + (i === 5000 ? 9 : 0)), t = H.thin(x, y, 1000);
    check('climate: thinning keeps the peaks and the order', t.x.length <= 1000 && t.y.includes(Math.max(...y)) && t.y.includes(Math.min(...y)) && t.x.every((v, i) => !i || v > t.x[i - 1]) && H.thin([1, 2], [3, 4]).x.length === 2); }
  check('climate: no header, index column skipped', n.readings.length === 2 && n.readings[1].temp === 21.5 && n.readings[1].rh === 46);
};
