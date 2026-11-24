// Figures for src/blog/discoveries/lambda-sculptorids-comet-46p-wirtanen-meteor-shower-rates.md, made with the maths
// of the Meteor shower planner (src/lib/astro/meteors.ts meteorNight and src/lib/sci/meteorrate.ts hourlyRate: the IMO
// rate HR = ZHR × sin(h) / r^(6.5 − LM)) and the sky positions of the Target altitude planner (src/lib/astro/sky.ts).
// Run: node scripts/blog-figures/lambda-sculptorids-comet-46p-wirtanen-meteor-shower-rates.mjs   (rewrites the charts)
import fs from 'node:fs';
import * as A from 'astronomy-engine';
import { chart, figure, inject } from './svg.mjs';
import { hourlyRate } from '../../src/lib/sci/meteorrate.ts';
// The planner's meteorNight (src/lib/astro/meteors.ts) and altAzJ2000 / altAzBody (src/lib/astro/sky.ts) import their
// neighbours without file endings and a JSON catalogue, which plain Node cannot load, so the same few lines are
// repeated here with the same astronomy-engine calls: radiant height every 30 minutes, dark when the Sun is below −12°.
const observer = (p) => new A.Observer(p.lat, p.lon, p.elev);
const altAzJ2000 = (ra, dec, time, obs) => { const v = A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time)); const h = A.HorizonFromVector(A.RotateVector(A.Rotation_EQJ_HOR(time, obs), v), 'normal'); return { alt: h.lat, az: h.lon }; };
const altAzBody = (body, time, obs) => { const eq = A.Equator(body, time, obs, true, true); const h = A.Horizon(time, obs, eq.ra, eq.dec, 'normal'); return { alt: h.altitude }; };
const meteorNight = (place, iso, sh, lm) => {
  const obs = observer(place), [y, m, d] = iso.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 12) - (place.lon / 15) * 3600e3);
  const hours = Array.from({ length: 49 }, (_, k) => new Date(start.getTime() + k * 1800e3)).map((time) => {
    const radiantAlt = altAzJ2000(sh.radiant[0], sh.radiant[1], time, obs).alt, dark = altAzBody('Sun', time, obs).alt < -12;
    return { time, radiantAlt, dark, rate: dark ? hourlyRate(sh.zhr, sh.r, lm, radiantAlt) : 0 };
  });
  const darkH = hours.filter((h) => h.dark);
  return { hours, darkFrom: darkH[0]?.time, darkTo: darkH.at(-1)?.time, best: hours.reduce((a, b) => (b.rate > a.rate ? b : a), hours[0]) };
};
const CITIES = [['Perth', -31.95, 115.86, 20, 'Australia/Perth'], ['Auckland', -36.85, 174.76, 20, 'Pacific/Auckland'], ['Toronto', 43.65, -79.38, 76, 'America/Toronto']]; // as in src/lib/astro/place.ts

const ART = new URL('../../src/blog/discoveries/lambda-sculptorids-comet-46p-wirtanen-meteor-shower-rates.md', import.meta.url);

// Inputs from the paper: Vida et al. (2024), A&A 682, L20, doi:10.1051/0004-6361/202449359 (CC BY 4.0).
// Peak 2023-12-12 15:04 UTC, ZHR 0.65 (+0.24/−0.20), adopted population index r = 3.0, radiant RA 6.89°, Dec −38.89°,
// forecast upper limit ZHR about 10, activity 09:06 to 22:53 UTC, flux at limiting magnitude +5.42, GMN cameras about +6.0.
const PEAK = new Date(Date.UTC(2023, 11, 12, 15, 4));
const SH = { name: 'Lambda Sculptorids', m: 12, d: 12, zhr: 0.65, radiant: [6.89, -38.89], r: 3.0 };
const FORECAST = { ...SH, zhr: 10 };
const city = (n) => { const c = CITIES.find((x) => x[0] === n); return { name: c[0], lat: c[1], lon: c[2], elev: c[3], tz: c[4] }; };
const PERTH = city('Perth'), AUCK = city('Auckland');
// Our choice of northern site for comparison (Toronto, where the radar that caught four meteors sits nearby).
const TOR = city('Toronto');

const LM = 6.0;
const nightP = meteorNight(PERTH, '2023-12-12', SH, LM), nightA = meteorNight(AUCK, '2023-12-12', SH, LM);
const nightPF = meteorNight(PERTH, '2023-12-12', FORECAST, LM);
const obsP = observer(PERTH);
const at = (place, t) => altAzJ2000(SH.radiant[0], SH.radiant[1], t, observer(place)).alt;
const peakAlt = { perth: at(PERTH, PEAK), auckland: at(AUCK, PEAK), toronto: at(TOR, PEAK) };
const moonPeak = altAzBody('Moon', PEAK, obsP).alt;
// Highest point of the radiant at Perth that night (scan every minute).
let best = { t: null, alt: -99 };
for (let k = 0; k < 24 * 60; k++) { const t = new Date(Date.UTC(2023, 11, 12, 4) + k * 60e3), a = at(PERTH, t); if (a > best.alt) best = { t, alt: a }; }
const rateAtPeak = (place, zhr, lm) => hourlyRate(zhr, SH.r, lm, at(place, PEAK));

const hrs = (n) => n.hours.map((h) => (h.time.getTime() - Date.UTC(2023, 11, 12, 0)) / 3600e3);
const fig1 = chart({
  title: 'λ-Sculptorids, night of 12 December 2023', xLabel: 'Hour (UTC) on 12 December 2023', yLabel: 'Meteors an hour, one observer',
  series: [
    { name: 'Perth, measured ZHR 0.65', kind: 'line', x: hrs(nightP), y: nightP.hours.map((h) => +h.rate.toFixed(3)) },
    { name: 'Auckland', kind: 'line', x: hrs(nightA), y: nightA.hours.map((h) => +h.rate.toFixed(3)), dash: '5 4' },
  ],
  xDomain: [9, 23], yDomain: [0, 0.7], vlines: [{ x: 15 + 4 / 60, text: 'peak 15:04' }],
  desc: `Expected meteors an hour for one observer under a sky with stars to magnitude 6.0, with the paper's ZHR of 0.65 at its peak and r = 3. At Perth the rate at the peak is ${rateAtPeak(PERTH, 0.65, LM).toFixed(2)} an hour.`, height: 260,
});
const fig2 = chart({
  title: 'What the forecast upper limit would have given at Perth', xLabel: 'Hour (UTC) on 12 December 2023', yLabel: 'Meteors an hour, one observer',
  series: [
    { name: 'Forecast limit, ZHR 10', kind: 'line', x: hrs(nightPF), y: nightPF.hours.map((h) => +h.rate.toFixed(2)) },
    { name: 'Measured, ZHR 0.65', kind: 'line', x: hrs(nightP), y: nightP.hours.map((h) => +h.rate.toFixed(2)) },
  ],
  xDomain: [9, 23], yDomain: [0, 10],
  desc: `At Perth the forecast upper limit of ZHR 10 would have meant about ${rateAtPeak(PERTH, 10, LM).toFixed(1)} meteors an hour at the peak; the measured ZHR gives ${rateAtPeak(PERTH, 0.65, LM).toFixed(2)}.`, height: 250,
});

const fmt = (t) => t?.toISOString().slice(11, 16);
const out = {
  peakAlt: Object.fromEntries(Object.entries(peakAlt).map(([k, v]) => [k, +v.toFixed(1)])), moonAltAtPeak: +moonPeak.toFixed(1),
  perthNight: { darkFrom: fmt(nightP.darkFrom), darkTo: fmt(nightP.darkTo), best: fmt(nightP.best.time), bestRate: +nightP.best.rate.toFixed(3), bestAlt: +nightP.best.radiantAlt.toFixed(1) },
  aucklandNight: { darkFrom: fmt(nightA.darkFrom), darkTo: fmt(nightA.darkTo), best: fmt(nightA.best.time), bestRate: +nightA.best.rate.toFixed(3), bestAlt: +nightA.best.radiantAlt.toFixed(1) },
  radiantHighestPerth: { utc: fmt(best.t), alt: +best.alt.toFixed(2), localAWST: fmt(new Date(best.t.getTime() + 8 * 3600e3)) },
  ratesAtPeakPerth: { lm6: +rateAtPeak(PERTH, 0.65, 6).toFixed(3), lm65: +rateAtPeak(PERTH, 0.65, 6.5).toFixed(3), lm542: +rateAtPeak(PERTH, 0.65, 5.42).toFixed(3), hi: +rateAtPeak(PERTH, 0.89, 6).toFixed(3), lo: +rateAtPeak(PERTH, 0.45, 6).toFixed(3), forecast: +rateAtPeak(PERTH, 10, 6).toFixed(2) },
  torontoMax: +Math.max(...Array.from({ length: 1440 }, (_, k) => at(TOR, new Date(Date.UTC(2023, 11, 12) + k * 60e3)))).toFixed(1),
  alt1500: +at(PERTH, new Date(Date.UTC(2023, 11, 12, 15))).toFixed(1), alt1100: +at(PERTH, new Date(Date.UTC(2023, 11, 12, 11))).toFixed(1), alt1300: +at(PERTH, new Date(Date.UTC(2023, 11, 12, 13))).toFixed(1),
  // For the tool page today: the Geminids (ZHR 150, radiant 112°, +33°, r 2.6) from Perth, night of 13 December 2026, sky 6.0.
  geminids2026: (() => { const n = meteorNight(PERTH, '2026-12-13', { zhr: 150, radiant: [112, 33], r: 2.6 }, 6); return { rate: +n.best.rate.toFixed(1), utc: fmt(n.best.time), alt: +n.best.radiantAlt.toFixed(1) }; })(),
  factorLM: { lm6: +(3 ** 0.5).toFixed(3), lm542: +(3 ** 1.08).toFixed(3) },
  // Meteors one observer would expect over the whole dark night at Perth (sum of 30 min steps).
  perthNightTotal: +(nightP.hours.reduce((s, h) => s + h.rate * 0.5, 0)).toFixed(2), perthNightTotalForecast: +(nightPF.hours.reduce((s, h) => s + h.rate * 0.5, 0)).toFixed(1),
  // A hand check of the formula: ZHR × sin(h) / r^(6.5 − LM) at the radiant's height at the peak.
  hand: +(0.65 * Math.sin(peakAlt.perth * Math.PI / 180) / 3 ** 0.5).toFixed(3),
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'night', figure(fig1, 'Figure 1. Meteors an hour one observer could expect from the λ-Sculptorids through the dark hours at Perth and Auckland, from the Meteor shower planner\'s maths with the paper\'s ZHR of 0.65 and r = 3.0, a sky with stars to magnitude 6.0 (our choice), and the shower held at peak strength all night (our simplification). Zero means daylight or twilight.'));
  md = inject(md, 'forecast', figure(fig2, 'Figure 2. The same calculation at Perth with the forecast upper limit (ZHR 10) and with the measured ZHR (0.65).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
