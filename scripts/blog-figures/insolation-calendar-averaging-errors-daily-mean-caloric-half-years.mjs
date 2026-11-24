// Figures for src/blog/discoveries/insolation-calendar-averaging-errors-daily-mean-caloric-half-years.md, made with
// the maths of the Insolation calculator (src/lib/sci/insolation.ts: Berger's daily insolation with Kepler's
// equation solved exactly, Milankovitch's caloric half-years and Huybers' summer energy).
// Run: node scripts/blog-figures/insolation-calendar-averaging-errors-daily-mean-caloric-half-years.mjs
import fs from 'node:fs';
import * as I from '../../src/lib/sci/insolation.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/insolation-calendar-averaging-errors-daily-mean-caloric-half-years.md', import.meta.url);

const O = I.PRESENT;            // e = 0.016708, obliquity 23.439°, perihelion longitude 102.937°, S0 = 1361 W/m²
const Y = I.YEAR;               // 365.2422 days
const r2 = (v) => +v.toFixed(2);

// --- 1. The two astronomical half-years ---------------------------------------------------------------------
const daySepEq = I.dayOfLambda(O, 180);
const marToSep = daySepEq - I.EQUINOX_DAY, sepToMar = Y - marToSep;

// --- 2. Conventional calendar dates against the real ones ---------------------------------------------------
const CONV = [{ name: 'March equinox', day: 80, lam: 0 }, { name: 'June solstice', day: 172, lam: 90 },
  { name: 'September equinox', day: 264, lam: 180 }, { name: 'December solstice', day: 355, lam: 270 }];
const conv = CONV.map((c) => {
  const trueDay = I.dayOfLambda(O, c.lam);
  const qDay = I.dailyMean(O, 65, I.lambdaOfDay(O, c.day)), qLam = I.dailyMean(O, 65, c.lam);
  return { name: c.name, convDay: c.day, trueDay: r2(trueDay), trueDate: I.dateOf(trueDay), offset: r2(c.day - trueDay),
    lamOnConvDay: r2(I.lambdaOfDay(O, c.day)), q65onDay: r2(qDay), q65atLam: r2(qLam), pct: r2(100 * (qDay / qLam - 1)) };
});

// --- 3. Mid-point averaging against the true time average over each calendar month --------------------------
const ML = [31, 28.2422, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // one tropical year, March equinox on day 80
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthError = (lat) => {
  let d0 = 0; const out = [];
  for (let m = 0; m < 12; m++) {
    const d1 = d0 + ML[m], n = 2000;
    let s = 0; for (let k = 0; k < n; k++) s += I.dailyMean(O, lat, I.lambdaOfDay(O, d0 + ((k + 0.5) * (d1 - d0)) / n));
    const tru = s / n, mid = I.dailyMean(O, lat, I.lambdaOfDay(O, (d0 + d1) / 2));
    out.push({ month: MON[m], tru: r2(tru), mid: r2(mid), abs: r2(mid - tru), pct: tru > 0.5 ? r2(100 * (mid / tru - 1)) : null });
    d0 = d1;
  }
  return out;
};
const LATS = [0, 15, 30, 45, 60, 65, 70, 75, 80, 85];
const errors = Object.fromEntries(LATS.map((lat) => [lat, monthError(lat)]));
const worst = Object.fromEntries(LATS.map((lat) => {
  const e = errors[lat].filter((x) => x.pct !== null);
  const w = e.reduce((a, b) => (Math.abs(b.pct) > Math.abs(a.pct) ? b : a));
  const wa = errors[lat].reduce((a, b) => (Math.abs(b.abs) > Math.abs(a.abs) ? b : a));
  return [lat, { month: w.month, pct: w.pct, biggestAbsMonth: wa.month, biggestAbs: wa.abs }];
}));

// --- 4. Milankovitch's caloric half-years and Huybers' summer energy at 65 N --------------------------------
const h65 = I.halfYears(O, 65);
const half = {
  annualMean: r2(h65.annualMean), summerMean: r2(h65.summerMean), winterMean: r2(h65.winterMean),
  summerGJ: +h65.summerGJ.toFixed(3), winterGJ: +h65.winterGJ.toFixed(3), annualGJ: +h65.annualGJ.toFixed(3),
  summerStart: r2(h65.summerStart), summerEnd: r2(h65.summerEnd),
  startDate: I.dateOf(h65.summerStart), endDate: I.dateOf(h65.summerEnd),
  aboveGJ: +h65.aboveGJ.toFixed(3), aboveDays: r2(h65.aboveDays),
  // Does the caloric summer coincide with the astronomical summer half-year?
  astronomicalSummerDays: r2(marToSep),
};

// --- 5. The eccentricity correction to the global annual mean ------------------------------------------------
const global = { exact: +I.globalMean(O).toFixed(3), naive: O.S0 / 4, pct: +(100 * (I.globalMean(O) / (O.S0 / 4) - 1)).toFixed(4), precession: +I.precessionIndex(O).toFixed(5) };

console.log(JSON.stringify({ halfYears: { marToSep: r2(marToSep), sepToMar: r2(sepToMar), daySepEq: r2(daySepEq), sepEqDate: I.dateOf(daySepEq), juneSol: r2(I.dayOfLambda(O, 90)), decSol: r2(I.dayOfLambda(O, 270)) }, conv, worst, monthsAt65: errors[65], monthsAt80: errors[80], half, global }, null, 1));

// --- Figure 1: the year at four latitudes -------------------------------------------------------------------
const days = Array.from({ length: 183 }, (_, i) => 1 + i * 2);
const fig1 = chart({
  title: 'Daily-mean sunlight through the year', xLabel: 'Day of year (March equinox on day 80)', yLabel: 'Daily mean (W/m²)',
  series: [0, 45, 65, 80].map((lat) => ({ name: `${lat}°N`, kind: 'line', x: days, y: days.map((d) => +I.dailyMean(O, lat, I.lambdaOfDay(O, d)).toFixed(2)) })),
  bands: [{ x0: h65.summerStart, x1: h65.summerEnd, text: 'caloric summer, 65°N' }],
  hlines: [{ y: 275, text: '275 W/m²' }],
  xDomain: [1, 365], yDomain: [0, 560],
  desc: 'Daily-mean insolation at the top of the atmosphere against day of year at the equator and at 45, 65 and 80 degrees north, with the caloric summer half-year at 65 north shaded and the 275 watt threshold marked.',
  height: 300,
});

// --- Figure 2: the mid-point averaging error against latitude ------------------------------------------------
const latsFine = Array.from({ length: 87 }, (_, i) => i);
const monthAvgErr = (lat, m) => {
  let d0 = 0; for (let k = 0; k < m; k++) d0 += ML[k];
  const d1 = d0 + ML[m], n = 1200;
  let s = 0; for (let k = 0; k < n; k++) s += I.dailyMean(O, lat, I.lambdaOfDay(O, d0 + ((k + 0.5) * (d1 - d0)) / n));
  const tru = s / n, mid = I.dailyMean(O, lat, I.lambdaOfDay(O, (d0 + d1) / 2));
  return tru > 0.5 ? 100 * (mid / tru - 1) : NaN;
};
const fig2 = chart({
  title: 'Error from using the middle of the month', xLabel: 'Latitude (°N)', yLabel: 'Mid-month value minus true mean (%)',
  series: [[11, 'December'], [9, 'October'], [5, 'June'], [2, 'March']].map(([m, name]) => ({ name, kind: 'line', x: latsFine, y: latsFine.map((lat) => +monthAvgErr(lat, m).toFixed(2)) })),
  hlines: [{ y: 0, text: '' }],
  xDomain: [0, 86], yDomain: [-70, 15],
  desc: 'Percentage error in a monthly mean insolation when it is taken as the value at the middle of the month, against latitude, for four months. Small in the tropics, tens of per cent at high latitudes in the dark months.',
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'year', figure(fig1, 'Figure 1. Daily-mean insolation at the top of the atmosphere through the year, from the Berger formulas the insolation calculator uses, for today\'s orbit. Shaded: Milankovitch\'s caloric summer half-year at 65°N, which the tool finds by searching for the half-year with the most sunlight.'));
  md = inject(md, 'miderr', figure(fig2, 'Figure 2. What the paper warns about, in numbers: the error in a monthly mean insolation taken as the value at the middle of the month. Below about 45° it is a per cent or two; at 80°N in October it is two thirds.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
