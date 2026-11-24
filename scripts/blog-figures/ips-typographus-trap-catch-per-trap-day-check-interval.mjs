// Figures for src/blog/discoveries/ips-typographus-trap-catch-per-trap-day-check-interval.md, made with the maths of
// the Trap count index (src/lib/sci/trapcount.ts: trapIndex, summarise, byWeek).
// Run: node scripts/blog-figures/ips-typographus-trap-catch-per-trap-day-check-interval.mjs
import fs from 'node:fs';
import { trapIndex, summarise, isoWeek } from '../../src/lib/sci/trapcount.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ips-typographus-trap-catch-per-trap-day-check-interval.md', import.meta.url);

// The flight curve below is SIMULATED (our own), shaped to the phenology Selikhovkin et al. (2026), Insects 17(6):
// 610, doi:10.3390/insects17060610 (CC BY 4.0) describe for 2025: three traps per point, checks every 5 days from
// early May to late August, spring swarming from 16 to 25 May with the average daily catch per trap above ten, almost
// nothing caught after 25 May, re-colonisation on 12 to 13 July and a second-generation flight on 3 August. The
// paper's own catch numbers are in its tables and figures, so these are not its measurements.
const TRAPS = 3, D0 = Date.UTC(2025, 4, 1), DAY = 864e5;
const iso = (d) => new Date(D0 + d * DAY).toISOString().slice(0, 10);
const bell = (d, mid, sd, top) => top * Math.exp(-0.5 * ((d - mid) / sd) ** 2);
// Daily catch per trap: a quiet background, the spring swarming peak (20 May = day 19), the July re-colonisation
// (12 July = day 72) and the second-generation flight (3 August = day 94).
const rate = (d) => 0.15 + bell(d, 19, 2.6, 26) + bell(d, 72, 1.5, 3) + bell(d, 94, 2.2, 5);
const DAYS = 123; // 1 May to 31 August 2025
const daily = Array.from({ length: DAYS }, (_, d) => rate(d));

/** Trap checks every `every` days: the beetles that flew in the interval, caught by three traps. */
function checks(every, site) {
  const out = [];
  for (let end = every; end < DAYS; end += every) {
    let sum = 0;
    for (let d = end - every + 1; d <= end; d++) sum += daily[d];
    out.push({ date: iso(end), site, traps: TRAPS, count: Math.round(sum * TRAPS) });
  }
  return out;
}

const OPT = { firstDays: 5, window: 3, per: 1, threshold: 10, peakShare: 0.2 };
const five = trapIndex(checks(5, 'Every 5 days'), OPT);
const fourteen = trapIndex(checks(14, 'Every 14 days'), { ...OPT, firstDays: 14 });
const flat = trapIndex(checks(14, 'Every 14 days, no smoothing'), { ...OPT, firstDays: 14, window: 1 });
const sums = [...summarise(five, 1), ...summarise(fourteen, 1)];

// How the peak index shrinks as the gap between checks grows.
const gaps = Array.from({ length: 14 }, (_, i) => i + 1);
const peakFor = gaps.map((g) => {
  const r = trapIndex(checks(g, 's'), { ...OPT, firstDays: g, window: 1 });
  return Math.max(...r.map((x) => x.index));
});

const dayOf = (d) => Math.round((Date.parse(d + 'T00:00:00Z') - D0) / DAY);
const fig1 = chart({
  title: 'Catch per trap per day: 5-day against 14-day checks', xLabel: 'Days from 1 May 2025', yLabel: 'Beetles per trap per day',
  series: [
    { name: 'Every 5 days', kind: 'line', x: five.map((r) => dayOf(r.date)), y: five.map((r) => +r.index.toFixed(2)) },
    { name: 'Every 14 days', kind: 'line', x: fourteen.map((r) => dayOf(r.date)), y: fourteen.map((r) => +r.index.toFixed(2)) },
    { name: '', noLegend: true, kind: 'dots', size: 3, x: five.map((r) => dayOf(r.date)), y: five.map((r) => +r.index.toFixed(2)), colour: 'var(--c-blog)' },
    { name: '', noLegend: true, kind: 'dots', size: 3, x: fourteen.map((r) => dayOf(r.date)), y: fourteen.map((r) => +r.index.toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 123], yDomain: [0, 26], hlines: [{ y: 10, text: 'swarming threshold' }],
  desc: 'The same simulated flight read through two check schedules. Checked every five days the index peaks at 21.5 beetles per trap per day and crosses the swarming threshold of ten on 21 May; checked every fourteen days the peak is 11.8 and the crossing is only seen on 29 May, eight days later.',
  height: 290,
});
const fig2 = chart({
  title: 'The peak the schedule can show', xLabel: 'Days between trap checks', yLabel: 'Highest index (beetles per trap per day)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: gaps, y: peakFor.map((v) => +v.toFixed(2)) },
    { name: '', noLegend: true, kind: 'dots', size: 3.2, x: gaps, y: peakFor.map((v) => +v.toFixed(2)), colour: 'var(--c-blog)' },
  ],
  xDomain: [0.5, 14.5], yDomain: [0, 26], xTicks: [1, 2, 4, 6, 8, 10, 12, 14], hlines: [{ y: 10, text: 'swarming threshold' }],
  desc: 'The highest catch per trap per day that a monitoring schedule can report, against the gap between checks, for one simulated swarming. Daily checks show 26; a five-day gap still shows 21.5; a fourteen-day gap shows 11.8. The fall is jagged because it depends on where the check boundaries happen to fall, so a nine-day gap shows 11.0 while a seven-day gap shows 19.3.',
  height: 280,
});

const show = (r) => r.map((x) => `${x.date} n=${x.count} idx=${x.index.toFixed(2)}${x.flagged ? ' FLAG' : ''}${x.peak ? ' PEAK' : ''}`);
console.log('5-day checks:\n' + show(five).join('\n'));
console.log('14-day checks:\n' + show(fourteen).join('\n'));
console.log('site summaries:', JSON.stringify(sums.map((s) => ({ site: s.site, checks: s.checks, catch: s.catch, trapDays: s.trapDays, index: +s.index.toFixed(3), maxIndex: +s.maxIndex.toFixed(2), maxDate: s.maxDate, firstFlag: s.firstFlag, flagged: s.flagged, peaks: s.peaks }))));
console.log('14-day checks, no moving average:\n' + show(flat).join('\n'));
console.log('peak index by gap (1 to 14 days):', peakFor.map((v) => +v.toFixed(2)).join(', '));
console.log('ISO week of 20 May 2025:', isoWeek('2025-05-20'));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'series', figure(fig1, 'Figure 1. One simulated beetle flight, read through the Trap count index’s maths as checks every 5 days and as checks every 14 days. Our simulation, shaped to the phenology the paper describes for 2025; not the paper’s catches.'));
  md = inject(md, 'gap', figure(fig2, 'Figure 2. The highest catch per trap per day a schedule can report, against the gap between checks, for the same simulated swarming. The dashed line is the paper’s swarming criterion of ten beetles per trap per day.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
