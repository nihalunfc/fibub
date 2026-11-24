// Figures for src/blog/discoveries/fire-weather-index-solar-noon-sampling-hour-canada.md, made with the maths of the
// Fire Weather Index tool (src/lib/sci/fwi.ts: fwiSeries and dsr, the Van Wagner equations).
// Run: node scripts/blog-figures/fire-weather-index-solar-noon-sampling-hour-canada.mjs
import fs from 'node:fs';
import { fwiSeries, dsr } from '../../src/lib/sci/fwi.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fire-weather-index-solar-noon-sampling-hour-canada.md', import.meta.url);

// The paper: Benoit, Durand, Gachon, Boucher and Boulanger (2026), Earth System Science Data 18: 5995-6015,
// doi:10.5194/essd-18-5995-2026 (CC BY 4.0). It computes the Canadian FWI System from ERA5 weather taken at each
// grid cell's own solar noon instead of a single UTC hour, and reports that monthly mean FWI rises by up to 3.4 in
// the west and falls by about 0.6 in the east. Start-up codes in the paper: FFMC 85, DMC 6, DC 15 (the tool's own
// defaults). The two places it compares, and the fixed hour a UTC-based dataset would read:
const WEST = { name: 'Western Alberta', lonW: 114.0 };
const EAST = { name: 'Havre-Saint-Pierre, Quebec', lonW: 63.6 };
const UTC_HOUR = 18; // a single UTC hour used for the whole country

// OUR ASSUMED weather: 92 summer days (June to August) of daily means, drawn with a fixed seed, plus a standard
// shape for the day. Nothing here is ERA5 data or a measurement.
// Two climates: a normal fire-season summer and a drier one, so we can see whether the effect grows with danger.
const summer = (tBase, hBase, rainP) => {
  let seed = 5995;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const out = [];
  for (let i = 0; i < 92; i++) {
    out.push({
      month: i < 30 ? 6 : i < 61 ? 7 : 8,
      tMean: tBase + 5 * Math.sin((Math.PI * i) / 92) + 4 * (rnd() - 0.5) * 2, // daily mean temperature, °C
      hMean: hBase + 18 * (rnd() - 0.5) * 2, // daily mean relative humidity, %
      wMean: 11 + 6 * (rnd() - 0.5) * 2, // daily mean wind speed, km/h
      rain: rnd() < rainP ? +(rnd() * 14).toFixed(1) : 0, // mm in the last 24 h
    });
  }
  return out;
};
const DAYS = summer(12, 68, 0.35); // mean FWI near 9, a believable fire season
const DRY = summer(17, 52, 0.22); // a drought summer
// The shape of a summer day: everything peaks in the middle of the afternoon (15:00 local solar time).
const shape = (h) => Math.cos((2 * Math.PI * (h - 15)) / 24);
const atHour = (d, h) => ({
  month: d.month,
  T: +(d.tMean + 7 * shape(h)).toFixed(1),
  H: +Math.min(100, Math.max(5, d.hMean - 20 * shape(h))).toFixed(0),
  W: +Math.max(0, d.wMean + 3 * shape(h)).toFixed(1),
  rain: d.rain,
});
const seriesOf = (days, h) => fwiSeries(days.map((d) => atHour(d, h)));
const meanOf = (days, h) => { const s = seriesOf(days, h); return s.reduce((a, d) => a + d.fwi, 0) / s.length; };
const meanFwi = (h) => meanOf(DAYS, h);
const series = (h) => seriesOf(DAYS, h);

const solarHour = 12; // each place's own solar noon
const westHour = UTC_HOUR - WEST.lonW / 15; // what 18:00 UTC is in local solar time out west
const eastHour = UTC_HOUR - EAST.lonW / 15;

const sun = series(solarHour), west = series(westHour), east = series(eastHour);
const mean = (s) => s.reduce((a, d) => a + d.fwi, 0) / s.length;
const monthMean = (s, m) => { const d = s.filter((x) => x.month === m); return d.reduce((a, x) => a + x.fwi, 0) / d.length; };

const report = {
  hours: { solar: solarHour, west: +westHour.toFixed(2), east: +eastHour.toFixed(2) },
  noonWeatherExample: { solar: atHour(DAYS[40], solarHour), west: atHour(DAYS[40], westHour), east: atHour(DAYS[40], eastHour) },
  meanFwi: { solar: +mean(sun).toFixed(2), west: +mean(west).toFixed(2), east: +mean(east).toFixed(2) },
  difference: { west: +(mean(sun) - mean(west)).toFixed(2), east: +(mean(sun) - mean(east)).toFixed(2) },
  byMonth: [6, 7, 8].map((m) => ({ month: m, solar: +monthMean(sun, m).toFixed(1), westDiff: +(monthMean(sun, m) - monthMean(west, m)).toFixed(2), eastDiff: +(monthMean(sun, m) - monthMean(east, m)).toFixed(2) })),
  peakFwi: { solar: +Math.max(...sun.map((d) => d.fwi)).toFixed(1), west: +Math.max(...west.map((d) => d.fwi)).toFixed(1) },
  drought: {
    solar: +meanOf(DRY, solarHour).toFixed(2), west: +meanOf(DRY, westHour).toFixed(2), east: +meanOf(DRY, eastHour).toFixed(2),
    westDiff: +(meanOf(DRY, solarHour) - meanOf(DRY, westHour)).toFixed(2), eastDiff: +(meanOf(DRY, solarHour) - meanOf(DRY, eastHour)).toFixed(2),
  },
  dsrCheck: { fwi18: +dsr(18).toFixed(3), fwi26: +dsr(26).toFixed(3), fwi29: +dsr(29).toFixed(3), fwi5: +dsr(5).toFixed(4) },
  minutesPerDegree: 4, westOffsetMinutes: +(60 * (solarHour - westHour)).toFixed(0), eastOffsetMinutes: +(60 * (solarHour - eastHour)).toFixed(0),
};

const HRS = Array.from({ length: 49 }, (_, i) => 8 + i * 0.25);
const fig1 = chart({
  title: 'Mean summer FWI against the hour the weather is read', xLabel: 'Local solar time the weather is taken from (h)', yLabel: 'Mean FWI over 92 days',
  series: [{ name: 'Mean FWI', kind: 'line', x: HRS, y: HRS.map(meanFwi), noLegend: true }],
  xDomain: [8, 20], yDomain: [0, 16], xTicks: [8, 10, 12, 14, 16, 18, 20],
  vlines: [
    { x: westHour, text: '18:00 UTC in the west', dy: 0 },
    { x: 12, text: 'solar noon', left: true, dy: 16 },
    { x: eastHour, text: '18:00 UTC in the east', dy: 32 },
  ],
  desc: 'Mean Fire Weather Index over the same 92 simulated days, depending on the hour of the day the weather is taken from. It rises steeply through the morning and peaks in mid-afternoon, so a fixed UTC hour that falls before solar noon in the west gives a lower index.',
  height: 280,
});

const fig2 = chart({
  title: 'The same summer, read at two different hours', xLabel: 'Day of the summer', yLabel: 'FWI',
  series: [
    { name: 'At solar noon', kind: 'line', x: sun.map((_, i) => i + 1), y: sun.map((d) => d.fwi) },
    { name: 'At 18:00 UTC in the west (10:24 solar)', kind: 'line', x: west.map((_, i) => i + 1), y: west.map((d) => d.fwi) },
  ],
  xDomain: [1, 92], yDomain: [0, 30],
  desc: 'Day-by-day FWI over the simulated summer, computed from the same weather read at solar noon and at a fixed UTC hour. The two curves track each other but the gap widens on the driest spells.',
  height: 270,
});

console.log(JSON.stringify(report, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'hour', figure(fig1, `Figure 1. Mean FWI over the same 92 simulated days, as a function of the hour the weather is read from. The dashed lines mark solar noon and what a single 18:00 UTC field means locally at 114° W (${westHour.toFixed(2)} h) and at 63.6° W (${eastHour.toFixed(2)} h). Simulated weather, not ERA5.`));
  md = inject(md, 'series', figure(fig2, 'Figure 2. The same simulated summer run through the Fire Weather Index tool twice: once from solar-noon weather and once from the weather a fixed 18:00 UTC field would give a western grid cell.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
