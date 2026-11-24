// Figures for src/blog/discoveries/climate-warming-a320-take-off-distance-density-altitude-european-airports.md, made
// with the maths of the Density altitude calculator (src/lib/sci/densalt.ts: ISA, moist air density, density altitude).
// Run: node scripts/blog-figures/climate-warming-a320-take-off-distance-density-altitude-european-airports.mjs
import fs from 'node:fs';
import { densityAlt, FT } from '../../src/lib/sci/densalt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/climate-warming-a320-take-off-distance-density-altitude-european-airports.md', import.meta.url);

// Inputs from the paper: Williams, Williams, Guerrini and Venturini (2025), Aerospace 12(3): 165,
// doi:10.3390/aerospace12030165 (CC BY). Heathrow A320 sensitivities at ISA: take-off distance required (TODR) rises
// 4.2 m per K and falls 1.2 m per hPa (minimum payload); 7.4 m per K and 2.2 m per hPa (maximum payload).
const SENS = [{ id: 'Minimum payload', perK: 4.2, perHpa: 1.2 }, { id: 'Maximum payload', perK: 7.4, perHpa: 2.2 }];
const P0 = 1013.25, T0 = 15; // ISA sea level (the paper's reference); dry air, as in the paper
const da = (p, t, td = null) => densityAlt(p, t, td).da;

const perK = da(P0, T0 + 1) - da(P0, T0), perHpa = da(P0, T0) - da(P0 + 1, T0);
const res = SENS.map((s) => ({ ...s, viaT: s.perK / perK, viaP: s.perHpa / perHpa, ratioPaper: s.perK / s.perHpa }));
const hot = [18, 20, 25, 30, 35].map((t) => ({ t, da: da(P0, t), rhoPct: densityAlt(P0, t, null).rhoPct }));
const humid = [10, 15, 20, 25].map((td) => ({ td, add: da(P0, 30, td) - da(P0, 30) }));
const out = {
  perK: +perK.toFixed(2), perKft: +(perK / FT).toFixed(1), perHpa: +perHpa.toFixed(2), perHpaFt: +(perHpa / FT).toFixed(1), hpaPerK: +(perK / perHpa).toFixed(3),
  res: res.map((r) => ({ id: r.id, ratioPaper: +r.ratioPaper.toFixed(2), viaT: +r.viaT.toFixed(4), viaP: +r.viaP.toFixed(4), diffPct: +(100 * (r.viaP / r.viaT - 1)).toFixed(1) })),
  hot: hot.map((h) => ({ t: h.t, da: +h.da.toFixed(1), rhoPct: +h.rhoPct.toFixed(2), todrMin: +(res[0].viaT * h.da).toFixed(0), todrMax: +(res[1].viaT * h.da).toFixed(0) })),
  humid: humid.map((h) => ({ td: h.td, add: +h.add.toFixed(1), todrMin: +(res[0].viaT * h.add).toFixed(1), todrMax: +(res[1].viaT * h.add).toFixed(1) })),
  check: { t16: da(P0, 16), p1014: da(1014.25, 15), t30: da(P0, 30), t30td20: da(P0, 30, 20), t30td20dry: densityAlt(P0, 30, 20).daDry },
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: density altitude against temperature at three pressures, dry and humid.
const TT = Array.from({ length: 31 }, (_, i) => 5 + i * 1.25);
const fig1 = chart({
  title: 'Density altitude on a warm day', xLabel: 'Air temperature (°C)', yLabel: 'Density altitude (m)',
  series: [
    { name: '1003 hPa', kind: 'line', x: TT, y: TT.map((t) => +da(1003, t).toFixed(1)) },
    { name: '1013 hPa', kind: 'line', x: TT, y: TT.map((t) => +da(P0, t).toFixed(1)) },
    { name: '1023 hPa', kind: 'line', x: TT, y: TT.map((t) => +da(1023, t).toFixed(1)) },
    { name: '1013 hPa, dew point 20 °C', kind: 'line', dash: '5 4', x: TT.filter((t) => t >= 20), y: TT.filter((t) => t >= 20).map((t) => +da(P0, t, 20).toFixed(1)) },
  ],
  xDomain: [5, 42.5], vlines: [{ x: 15, text: 'ISA 15 °C' }], height: 280,
  desc: `Density altitude rises about ${perK.toFixed(0)} m per degree of warming and ${perHpa.toFixed(0)} m per hectopascal of falling pressure; humid air adds a little more.`,
});

// Figure 2: the paper's take-off distance sensitivities, put on a density-altitude axis two ways.
const Ts = [10, 15, 20, 25, 30, 35], Ps = [1033, 1023, 1013.25, 1003, 993, 983];
const fig2 = chart({
  title: 'Take-off distance follows air density', xLabel: 'Density altitude (m)', yLabel: 'Change in TODR (m)',
  series: [
    { name: 'Warmer (paper, min payload)', kind: 'dots', x: Ts.map((t) => +da(P0, t).toFixed(1)), y: Ts.map((t) => +(4.2 * (t - T0)).toFixed(1)) },
    { name: 'Lower pressure (min payload)', kind: 'line', x: Ps.map((p) => +da(p, T0).toFixed(1)), y: Ps.map((p) => +(-1.2 * (p - P0)).toFixed(1)) },
    { name: 'Warmer (max payload)', kind: 'dots', x: Ts.map((t) => +da(P0, t).toFixed(1)), y: Ts.map((t) => +(7.4 * (t - T0)).toFixed(1)) },
    { name: 'Lower pressure (max payload)', kind: 'line', x: Ps.map((p) => +da(p, T0).toFixed(1)), y: Ps.map((p) => +(-2.2 * (p - P0)).toFixed(1)) },
  ],
  hlines: [{ y: 0, text: '' }], height: 300,
  desc: `The paper's temperature and pressure sensitivities, each turned into density altitude with the tool's maths, fall on one line per payload: about ${res[0].viaT.toFixed(3)} and ${res[1].viaT.toFixed(3)} m of extra take-off run per metre of density altitude.`,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'da', figure(fig1, 'Figure 1. Density altitude against air temperature at three sea-level pressures, for dry air (solid) and for air with a dew point of 20 °C (dashed), from the Density altitude calculator\'s maths. ISA is the standard 15 °C and 1013.25 hPa.'));
  md = inject(md, 'collapse', figure(fig2, 'Figure 2. The paper\'s Heathrow take-off distance sensitivities (4.2 and 7.4 m per K; 1.2 and 2.2 m per hPa), plotted against the density altitude each temperature or pressure gives. Dots: warming at 1013.25 hPa. Lines: falling pressure at 15 °C. Straight-line use of the sensitivities is our simplification.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
