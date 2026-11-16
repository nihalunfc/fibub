// Figures for src/blog/discoveries/athens-heat-index-humidex-thermal-discomfort-1901-2024.md, made with the maths of the
// Wind chill and heat index tool (src/lib/sci/feelslike.ts: heatIndex, humidexC, dewPoint).
// Run: node scripts/blog-figures/athens-heat-index-humidex-thermal-discomfort-1901-2024.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { heatIndex, humidexC, dewPoint } from '../../src/lib/sci/feelslike.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/athens-heat-index-humidex-thermal-discomfort-1901-2024.md', import.meta.url);
// Paper: Psiloglou, Gkinis and Giannakopoulos (2025), Climate 13, 210, doi:10.3390/cli13100210 (CC BY): hazard thresholds
// heat index >= 32 °C, humidex >= 38 °C, Thom's discomfort index >= 27 °C; Rothfusz in its °C form applied above 20 °C;
// Thom's index TDI = T - 0.55 (1 - RH/100) (T - 14.5).
const HI = (T, R) => heatIndex(T, R).c;
const HX = (T, R) => humidexC(T, dewPoint(T, R));
const TDI = (T, R) => T - 0.55 * (1 - R / 100) * (T - 14.5); // not in a fibub tool: worked here for comparison only
const rothC = (T, R) => -8.784695 + 1.61139411 * T + 2.338549 * R - 0.14611605 * T * R - 0.012308094 * T * T - 0.016424828 * R * R + 0.002211732 * T * T * R + 0.00072546 * T * R * R - 0.000003582 * T * T * R * R;
const solve = (f, R, y) => { let a = 15, b = 50; for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(m, R) < y) a = m; else b = m; } return +((a + b) / 2).toFixed(2); };

// Figure 1: the air temperature at which each index reaches the paper's hazard threshold, for humidity 15-85 %.
const rh = Array.from({ length: 15 }, (_, i) => 15 + 5 * i);
const fig1 = chart({
  title: 'Air temperature that reaches each hazard threshold', xLabel: 'Relative humidity (%)', yLabel: 'Air temperature (°C)',
  series: [
    { name: 'Heat index 32 °C', kind: 'line', x: rh, y: rh.map((R) => solve(HI, R, 32)) },
    { name: 'Humidex 38', kind: 'line', x: rh, y: rh.map((R) => solve(HX, R, 38)) },
    { name: 'Thom index 27 °C', kind: 'line', dash: '4 3', x: rh, y: rh.map((R) => solve(TDI, R, 27)) },
  ],
  xDomain: [15, 85], yDomain: [26, 36],
  desc: 'All three thresholds are reached at nearly the same air temperature: about 33 to 35 °C in dry air of 30 % humidity, falling to about 28 to 29 °C at 75 %. The humidex 38 line crosses the heat index 32 line near 60 % humidity.', height: 280,
});

// Figure 2: the heat index at 50 % humidity by the NWS method (as the tool works it) and by the raw °C Rothfusz formula.
const tt = Array.from({ length: 61 }, (_, i) => 18 + i * 0.25);
const fig2 = chart({
  title: 'Heat index at 50 % humidity: NWS method and raw Rothfusz', xLabel: 'Air temperature (°C)', yLabel: 'Heat index (°C)',
  series: [
    { name: 'NWS method (tool)', kind: 'line', x: tt, y: tt.map((T) => +HI(T, 50).toFixed(2)) },
    { name: 'Raw Rothfusz, °C form', kind: 'line', dash: '4 3', x: tt, y: tt.map((T) => +rothC(T, 50).toFixed(2)) },
    { name: 'Air temperature', kind: 'line', dash: '2 3', x: tt, y: tt },
  ],
  xDomain: [18, 33], yDomain: [16, 40], vlines: [{ x: 26.7, text: '80 °F' }],
  desc: 'Above about 27 °C the two heat index curves are the same. Below it the raw Rothfusz formula stays several degrees above the air temperature, while the NWS method switches to Steadman\'s simple formula and stays close to it.', height: 280,
});

const pts = [[33, 35], [35, 30], [30, 70], [22, 50], [20, 60]].map(([T, R]) => ({ T, R, hi: +HI(T, R).toFixed(2), method: heatIndex(T, R).method, roth: +rothC(T, R).toFixed(2), hx: +HX(T, R).toFixed(2), td: +dewPoint(T, R).toFixed(2), tdi: +TDI(T, R).toFixed(2) }));
const thr = [20, 30, 40, 50, 60, 70, 80].map((R) => ({ R, hi32: solve(HI, R, 32), hx38: solve(HX, R, 38), tdi27: solve(TDI, R, 27) }));
console.log(JSON.stringify({ pts, thr }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'thr', figure(fig1, 'Figure 1. The air temperature at which each index reaches the paper\'s hazard threshold, worked with the Wind chill and heat index tool\'s heat index and humidex, and Thom\'s formula for comparison. Our own calculation; no data from the paper.'));
  md = inject(md, 'roth', figure(fig2, 'Figure 2. The heat index at 50 % relative humidity by the US National Weather Service method (what the tool gives) and by the Rothfusz regression on its own. Our own calculation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
