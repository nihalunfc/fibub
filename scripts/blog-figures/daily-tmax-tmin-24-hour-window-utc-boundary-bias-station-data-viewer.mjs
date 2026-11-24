// Figures for src/blog/discoveries/daily-tmax-tmin-24-hour-window-utc-boundary-bias-station-data-viewer.md, made with the maths of the Weather station tool
// (src/lib/sci/station.ts: summarise(records, 'day', step) gives each calendar day's min, mean and max; the day is the day written in the file).
// Run: node scripts/blog-figures/daily-tmax-tmin-24-hour-window-utc-boundary-bias-station-data-viewer.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { summarise } from '../../src/lib/sci/station.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/daily-tmax-tmin-24-hour-window-utc-boundary-bias-station-data-viewer.md', import.meta.url);

// Ideas from Yang, Zhai, Zhang, Jiang, Yuan and Zhou (2026), Earth System Science Data 18: 5739-5758, doi:10.5194/essd-18-5739-2026 (CC BY 4.0): daily Tmax and Tmin
// depend on which 24 hours make a "day"; a synoptic report of the 24 h maximum at 12:00 UTC at a station on UTC-3 (09:00 local) belongs to the PREVIOUS local day
// (Villa Reynolds, Argentina: GSOD Tmax 1.6 deg C too warm, R2 0.87 -> 0.99 after a forward date shift); daily Tave is the mean of four 6-hourly values.
// OUR assumptions: a station on UTC-3, hourly air temperature, a diurnal cycle with a sharp afternoon peak (maximum at 15:00, minimum at 06:00 local), day-to-day weather as a
// seeded random series with lag-1 correlation 0.93 (chosen because R2 = 0.87 for a one-day mismatch implies r = 0.93), a 12 deg C swing (6 deg C amplitude) and 120 days.
const DAYS = 120, H = 3600e3, OFFSET = -3, R = (x, n = 2) => +x.toFixed(n);
let seed = 2026; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
const phi = 0.93, sdw = 4, wx = [];
let w = 0; for (let d = 0; d < DAYS + 3; d++) { w = phi * w + Math.sqrt(1 - phi * phi) * sdw * gauss(); wx.push(w); }
const shape = (hl) => Math.cos((2 * Math.PI * (hl - 15)) / 24) + 0.35 * Math.cos((4 * Math.PI * (hl - 13.5)) / 24) + 0.12 * Math.cos((8 * Math.PI * (hl - 14)) / 24); // sharp afternoon peak (three harmonics)
const T0 = Date.UTC(2026, 2, 1, 0) - OFFSET * H; // first UTC instant of local 1 March 00:00
const recs = []; // times in UTC
for (let i = 0; i < DAYS * 24; i++) { const t = T0 + i * H, d = Math.floor(i / 24), hl = i % 24; recs.push({ t, T: 18 + wx[d] + 6 * shape(hl) }); }
const sumBy = (rs) => new Map(summarise(rs, 'day', H).map((s) => [s.key, s]));
const shift = (rs, hours) => rs.map((r) => ({ ...r, t: r.t + hours * H }));
const local = sumBy(shift(recs, OFFSET)); // the true local calendar days (what the file would give if its clock were local time)
const utc = sumBy(recs); // calendar days of the UTC clock (what the tool gives if the file is in UTC)
const win = sumBy(shift(recs, OFFSET - 9)); // days that start at 09:00 local
const keys = [...local.keys()].filter((k) => local.get(k).n === 24);
const next = (k) => new Date(Date.parse(k + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10);
const comp = (map, lab) => { // Tmax and Tmin of `map` (a window labelled by `lab`) against the local day
  const a = [], b = [], c = [], d = [];
  for (const k of keys) { const m = map.get(lab(k)); if (!m || m.n !== 24) continue; a.push(local.get(k).T.max); b.push(m.T.max); c.push(local.get(k).T.min); d.push(m.T.min); }
  const mean = (x) => x.reduce((s, v) => s + v, 0) / x.length;
  const r2 = (x, y) => { const mx = mean(x), my = mean(y); let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } return (sxy * sxy) / (sxx * syy); };
  const rms = (x, y) => Math.sqrt(x.reduce((s, v, i) => s + (y[i] - v) ** 2, 0) / x.length);
  return { n: a.length, maxBias: R(mean(b) - mean(a)), maxRms: R(rms(a, b)), maxR2: R(r2(a, b), 3), minBias: R(mean(d) - mean(c)), minRms: R(rms(c, d)), x: a, y: b };
};
const same = comp(local, (k) => k), utcc = comp(utc, (k) => k);
const wEnd = comp(win, (k) => next(k)); // window of 09:00-09:00 local, labelled with the date of its END (the synoptic habit)
const wStart = comp(win, (k) => k); // the same window labelled with the date it STARTED (after the forward date shift)
// Three ways to say "daily mean" (local days).
const defs = keys.map((k) => { const i = keys.indexOf(k) * 24, day = recs.slice(i, i + 24).map((r) => r.T); const hm = day.reduce((s, v) => s + v, 0) / 24, mm = (Math.max(...day) + Math.min(...day)) / 2, four = [0, 6, 12, 18].map((h) => day[h]).reduce((s, v) => s + v, 0) / 4; return [mm - hm, four - hm]; });
const avg = (x) => x.reduce((s, v) => s + v, 0) / x.length;
const dm = { minmaxBias: R(avg(defs.map((d) => d[0]))), fourBias: R(avg(defs.map((d) => d[1]))), fourRms: R(Math.sqrt(avg(defs.map((d) => d[1] ** 2)))) };
// Figure 1: 30 days of daily maxima.
const D0 = 20, N = 30, xs = Array.from({ length: N }, (_, i) => i + 1);
const f1 = chart({
  title: 'Daily maximum: the same hours, three labels', xLabel: 'Day of the series', yLabel: 'Daily Tmax (°C)',
  series: [
    { name: 'Local calendar day', kind: 'line', colour: 'var(--c-blog)', x: xs, y: same.x.slice(D0, D0 + N).map((v) => R(v)) },
    { name: '09:00 to 09:00 window, end date', kind: 'line', colour: 'var(--c-tools)', x: xs, y: wEnd.y.slice(D0, D0 + N).map((v) => R(v)) },
    { name: 'same window, start date', kind: 'line', colour: 'var(--muted)', dash: '4 3', x: xs, y: wStart.y.slice(D0, D0 + N).map((v) => R(v)) },
  ],
  xDomain: [1, N], desc: 'Thirty days of simulated daily maximum temperature for a station on UTC minus 3. The local calendar day, a window from 09:00 to 09:00 labelled with its end date (which lags by a day) and the same window labelled with its start date, which lies almost on the local day.', height: 300,
});
const f2 = chart({
  title: 'Window maximum against the true local-day maximum', xLabel: 'Local calendar-day Tmax (°C)', yLabel: 'Window Tmax (°C)',
  series: [
    { name: `Labelled with end date (R2 ${wEnd.maxR2})`, kind: 'dots', colour: 'var(--c-tools)', size: 2.4, opacity: 0.7, x: wEnd.x.filter((_, i) => i % 2 === 0).map((v) => R(v, 1)), y: wEnd.y.filter((_, i) => i % 2 === 0).map((v) => R(v, 1)) },
    { name: `Start date (R2 ${wStart.maxR2})`, kind: 'dots', colour: 'var(--c-blog)', size: 2.4, opacity: 0.7, x: wStart.x.filter((_, i) => i % 2 === 0).map((v) => R(v, 1)), y: wStart.y.filter((_, i) => i % 2 === 0).map((v) => R(v, 1)) },
  ],
  desc: 'Scatter of the daily maximum of a 09:00 to 09:00 window against the local-day maximum, 60 of 120 simulated days. Labelled with its end date the window is a day late and the points scatter; labelled with its start date they lie close to the line.', height: 300,
});
const res = { n: keys.length, same: { ...same, x: 0, y: 0 }, utc: { ...utcc, x: 0, y: 0 }, wEnd: { ...wEnd, x: 0, y: 0 }, wStart: { ...wStart, x: 0, y: 0 }, dm, r: R(Math.sqrt(0.87), 3) };
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'series', figure(f1, 'Figure 1. A simulated month of daily maximum temperature for a station on UTC minus 3, from the Weather station tool\'s calendar-day summaries. The window that ends at 09:00 local time is the day before, so labelled with its end date it lags the local day by a day; labelled with its start date it follows the local day closely. Our simulation, not data from the paper.'));
  md = inject(md, 'scatter', figure(f2, 'Figure 2. The same 120 simulated days as a scatter (every second day plotted): the 09:00 to 09:00 maximum against the local-day maximum, with the end-date label and the start-date label.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [f1, f2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
