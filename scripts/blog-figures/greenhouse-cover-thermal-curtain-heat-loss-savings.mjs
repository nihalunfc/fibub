// Figures for src/blog/discoveries/greenhouse-cover-thermal-curtain-heat-loss-savings.md, made with the maths of the
// Greenhouse heating tool (src/lib/sci/greenhouse.ts: geometry, heating, season).
// Run: node scripts/blog-figures/greenhouse-cover-thermal-curtain-heat-loss-savings.mjs
import fs from 'node:fs';
import { geometry, heating, season, COVERS } from '../../src/lib/sci/greenhouse.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/greenhouse-cover-thermal-curtain-heat-loss-savings.md', import.meta.url);

// From Boyaci, Kociecka, Jagosz and Atilgan (2025), Energies 18(3): 724, doi:10.3390/en18030724 (CC BY 4.0):
// S-1 polyethylene roof and side walls, S-2 polyethylene roof with polycarbonate side walls, S-3 as S-2 plus a
// thermal curtain. Heating 6 % less than S-1 for S-2 and 29 % less for S-3; 356.5 kWh/m2/yr (S-1, Kutahya) down to
// 46.3 kWh/m2/yr (S-3, Mersin); night set point 15 C. Cited from Kim et al.: 70.8 kWh saved per 1 W/m2 K of U.
const PAPER = { s2: 6, s3: 29, high: 356.5, low: 46.3, tIn: 15, kim: 70.8 };
const U_FILM = COVERS.find((c) => c.id === 'film').U;          // 6.5 W/m2 K
const U_TWIN = COVERS.find((c) => c.id === 'twinwall').U;      // 3.5 W/m2 K
const U_DOUBLE = COVERS.find((c) => c.id === 'double').U;      // 4.0 W/m2 K
// OUR assumed reference house: 60 m long, eave 3 m, roof slope set by ridge = eave + width/8, 1 air change per hour,
// design outside temperature -10 C. The paper gives no dimensions, U values or degree-days.
const REF = { length: 60, eave: 3, ach: 1, tOut: -10 };
const shape = (w) => ({ length: REF.length, width: w, eave: REF.eave, ridge: REF.eave + w / 8 });
const loss = (w, U) => heating(geometry(shape(w)), { U, tIn: PAPER.tIn, tOut: REF.tOut, ach: REF.ach, margin: 0 });
// Effective cover U when only the side walls are swapped for polycarbonate (area-weighted, as the tool's single
// U value expects).
const uMixed = (w) => { const g = geometry(shape(w)); return (U_FILM * (g.roof + g.ends) + U_TWIN * g.walls) / g.cover; };
const savingAt = (w) => 100 * (1 - loss(w, uMixed(w)).q / loss(w, U_FILM).q);

const widths = [6, 7, 8, 9.6, 11, 12, 14, 16, 18, 20, 22, 24, 27, 30, 35, 40, 45, 50, 60];
const savings = widths.map((w) => +savingAt(w).toFixed(2));
// Width at which swapping the side walls saves exactly the paper's 6 %.
let lo = 6, hi = 60;
for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; savingAt(m) > PAPER.s2 ? (lo = m) : (hi = m); }
const width6 = +((lo + hi) / 2).toFixed(1);
const g6 = geometry(shape(width6));
const wallShare = +((100 * g6.walls) / g6.cover).toFixed(1);
const ref = { width: width6, floor: +g6.floor.toFixed(0), cover: +g6.cover.toFixed(0), coverPerFloor: +(g6.cover / g6.floor).toFixed(3), volume: +g6.volume.toFixed(0), slope: +g6.slope.toFixed(1) };

// What the 29 % saving asks of a thermal curtain: the effective cover U that cuts the whole design loss by 29 %.
const h1 = loss(width6, U_FILM), hAir = h1.uaAir;
const uFor = (cut) => ((1 - cut / 100) * h1.ua - hAir) / g6.cover;
const u29 = +uFor(PAPER.s3).toFixed(2), u6 = +uMixed(width6).toFixed(2);
const design = { s1: +h1.perFloor.toFixed(1), s2: +loss(width6, uMixed(width6)).perFloor.toFixed(1), s3: +loss(width6, u29).perFloor.toFixed(1), ua: +h1.ua.toFixed(0), uaCover: +h1.uaCover.toFixed(0), uaAir: +hAir.toFixed(0) };

// Degree-days implied by the paper's two extreme energy intensities, from kWh = UA x degree-hours / 1000.
const ddFor = (kwhPerM2, U) => { const h = loss(width6, U); return (kwhPerM2 * g6.floor * 1000) / (h.ua * 24); };
const dd = { high: Math.round(ddFor(PAPER.high, U_FILM)), low: Math.round(ddFor(PAPER.low, u29)), kim: Math.round((PAPER.kim * 1000) / ((g6.cover / g6.floor) * 24)) };
const deficit = { high: +(dd.high / 180).toFixed(1), low: +(dd.low / 90).toFixed(1) };
const DD = Array.from({ length: 41 }, (_, i) => i * 50);
const perM2 = (U) => DD.map((d) => +(season(loss(width6, U), d, { energyMJ: 38, efficiency: 0.85 }).kWh / g6.floor).toFixed(1));
// The paper's highest coal use, 69.4 kg/m2/yr, against its highest heat demand: how much heat each kg delivered.
const coal = { kg: 69.4, mjPerKg: +((PAPER.high * 3.6) / 69.4).toFixed(2), effAt25: +((100 * (PAPER.high * 3.6)) / (69.4 * 25)).toFixed(1), kgAt25and65: +((PAPER.high * 3.6) / (25 * 0.65)).toFixed(1) };

const fig1 = chart({
  title: 'Polycarbonate side walls: the saving depends on the shape', xLabel: 'Greenhouse width (m), 60 m long', yLabel: 'Design heat loss saved (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: widths, y: savings }],
  xDomain: [6, 60], yDomain: [0, 22], yFmt: (v) => v.toFixed(0),
  hlines: [{ y: PAPER.s2, text: 'paper: 6 %' }], vlines: [{ x: width6, text: `${width6} m`, dy: 16 }],
  desc: `Swapping polyethylene side walls for polycarbonate saves ${savings[0]} per cent of the design heat loss in a 6 m wide greenhouse but only ${savings[savings.length - 1]} per cent in a 60 m wide one. The paper's 6 per cent is reached at about ${width6} m.`,
  height: 290,
});
const fig2 = chart({
  title: 'Annual heat against heating degree-days', xLabel: 'Heating degree-days (°C·day)', yLabel: 'Heat needed (kWh per m² of floor)',
  series: [
    { name: 'S-1, film all over (U 6.5)', kind: 'line', x: DD, y: perM2(U_FILM) },
    { name: 'S-3, with the curtain (U ' + u29 + ')', kind: 'line', x: DD, y: perM2(u29), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 2000], yDomain: [0, 700], yFmt: (v) => v.toFixed(0),
  hlines: [{ y: PAPER.high, text: 'paper: 356.5 kWh/m²' }, { y: PAPER.low, text: 'paper: 46.3' }],
  vlines: [{ x: dd.high, text: `${dd.high} °C·day`, dy: 30 }, { x: dd.low, text: `${dd.low}`, dy: 46 }],
  desc: `Annual heat per square metre of floor against heating degree-days for the two extreme covers. The paper's highest intensity, 356.5 kWh per square metre, needs about ${dd.high} degree-days, and its lowest, 46.3, about ${dd.low}.`,
  height: 300,
});

console.log(JSON.stringify({ U_FILM, U_TWIN, U_DOUBLE, width6, wallShare, ref, design, u6, u29, dd, deficit, coal, savingsTable: widths.map((w, i) => [w, savings[i]]), narrowDefault: +savingAt(9.6).toFixed(2) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'width', figure(fig1, 'Figure 1. How much of the design heat loss is saved by changing only the side walls from polyethylene film to twin-wall polycarbonate, against greenhouse width, worked out with the Greenhouse heating tool’s own maths for a 60 m long house with a 3 m eave. The paper’s 6 % saving corresponds to a wide house.'));
  md = inject(md, 'degreedays', figure(fig2, 'Figure 2. Seasonal heat per square metre of floor against heating degree-days for the same house, for the film cover and for the effective U value the paper’s 29 % curtain saving implies. The dashed lines are the paper’s highest and lowest reported intensities.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
