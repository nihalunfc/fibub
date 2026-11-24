// Figures for src/blog/discoveries/cleanroom-production-room-cooling-load-sensible-latent-check.md, made with the
// maths of the HVAC room load tool (src/lib/sci/hvacload.ts) and the Psychrometrics tool (src/lib/sci/psychro.ts).
// Run: node scripts/blog-figures/cleanroom-production-room-cooling-load-sensible-latent-check.mjs
import fs from 'node:fs';
import { roomLoad, W_TO_BTUH } from '../../src/lib/sci/hvacload.ts';
import { air, pws, pressureAt } from '../../src/lib/sci/psychro.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cleanroom-production-room-cooling-load-sensible-latent-check.md', import.meta.url);

// From the paper: Kusaeri, Mitrakusuma and Pamungkas (2026), E3S Web of Conferences 754: 03002,
// doi:10.1051/e3sconf/202675403002 (CC BY 4.0).
const AREA = 20.54, HEIGHT = 2.8, VOL = 57.5;        // m2, m, m3 (the paper rounds the volume to +-57.5 m3)
const ACH_MIN = 6, ACH_MAX = 20, SUPPLY = 1146;      // h-1, h-1, m3/h measured
const ROOM_LOAD_BTUH = 30436, TOTAL_BTUH = 61162, HEATER_W = 9000;
const DEHUM_FLOW = 600, DW = 7.19, MOISTURE = 4.314; // m3/h, g/m3, kg/h
const EQUIP = 200 + 100 + 500 + 900, PEOPLE = 4;     // W of listed machines; operators
const T_IN = 25, RH_IN = 0.25;                       // the dehumidifier's design room state in the paper

// OUR ASSUMPTIONS: the outdoor design state, the envelope and the per-person and lighting gains. The paper gives
// none of these. Outdoor design for a hot, humid Indonesian town; a light-weight insulated cleanroom shell.
const T_OUT = 32, RH_OUT = 0.7, P = pressureAt(700);
const ELEMENTS = [
  { name: 'Partition walls and door', area: 2 * (4.5 + 4.56) * HEIGHT, U: 0.5 },
  { name: 'Ceiling', area: AREA, U: 0.4 },
];
const PER_SENS = 75, PER_LAT = 55, LIGHT = 10 * AREA;

const base = (ventLps, rhIn = RH_IN) => ({
  elements: ELEMENTS, volume: VOL, ach: 0, ventLps, p: P,
  tiH: T_IN, toH: T_IN, rhoH: 0.5,
  tiC: T_IN, rhiC: rhIn, toC: T_OUT, rhoC: RH_OUT,
  people: PEOPLE, perSens: PER_SENS, perLat: PER_LAT, lightW: LIGHT, equipW: EQUIP,
  creditHeating: false, margin: 0,
});

// Step 1: air changes and airflow (plain recomputation of the paper's own verification).
const step1 = {
  flowMin: ACH_MIN * VOL, flowMax: ACH_MAX * VOL, achMeasured: SUPPLY / VOL,
  supplyLps: (SUPPLY * 1000) / 3600,
};

// Step 2: what fraction of the 1146 m3/h supply can be outdoor air and still land on the paper's room load?
const FRACS = Array.from({ length: 101 }, (_, i) => i / 100);
const series = FRACS.map((f) => {
  const r = roomLoad(base(((SUPPLY * f) * 1000) / 3600));
  return { f, sens: r.sens * W_TO_BTUH, lat: r.lat * W_TO_BTUH, total: r.total * W_TO_BTUH, shr: r.shr };
});
let fit = series[0];
for (const s of series) if (Math.abs(s.total - ROOM_LOAD_BTUH) < Math.abs(fit.total - ROOM_LOAD_BTUH)) fit = s;
const fitRun = roomLoad(base(((SUPPLY * fit.f) * 1000) / 3600));

// Step 3: the moisture duty, from the paper's own numbers and from the psychrometrics module.
const a23 = air(23, 101325, { rh: 0.6 }), a23dry = air(23, 101325, { rh: 0.25 });
const step3 = {
  pws23: pws(23), abs60: a23.abs, abs25: a23dry.abs, dAbs: a23.abs - a23dry.abs,
  moistureFromPaper: (DW * DEHUM_FLOW) / 1000,
  latentW: (MOISTURE / 3600) * (2501 + 1.86 * 23) * 1000,
  heaterBtuh: HEATER_W * W_TO_BTUH,
};

// Figure 2: the latent duty against the room humidity target, at the outdoor-air flow found in step 2.
const RHS = Array.from({ length: 41 }, (_, i) => 0.15 + i * 0.01);
const byRh = RHS.map((rh) => roomLoad(base(((SUPPLY * fit.f) * 1000) / 3600, rh)));

const fig1 = chart({
  title: 'Room load against the outdoor-air share of the supply', xLabel: 'Outdoor air, share of the 1146 m³/h supply (%)', yLabel: 'Cooling load (Btu/h)',
  series: [
    { name: 'Total', kind: 'line', x: FRACS.map((f) => f * 100), y: series.map((s) => +s.total.toFixed(0)) },
    { name: 'Sensible', kind: 'line', x: FRACS.map((f) => f * 100), y: series.map((s) => +s.sens.toFixed(0)) },
    { name: 'Latent', kind: 'line', x: FRACS.map((f) => f * 100), y: series.map((s) => +s.lat.toFixed(0)) },
  ],
  xDomain: [0, 100], yDomain: [0, 90000], height: 290,
  hlines: [{ y: ROOM_LOAD_BTUH, text: `paper: ${ROOM_LOAD_BTUH} Btu/h` }],
  vlines: [{ x: fit.f * 100, text: `${Math.round(fit.f * 100)} %`, left: true }],
  desc: 'Total, sensible and latent cooling load of the room against how much of the 1146 cubic metres per hour supply is outdoor air. The total crosses the paper 30436 Btu/h room load at about a quarter outdoor air.',
});
const fig2 = chart({
  title: 'What the humidity target costs', xLabel: 'Room relative humidity target (%)', yLabel: 'Cooling load (Btu/h)',
  series: [
    { name: 'Total', kind: 'line', x: RHS.map((r) => r * 100), y: byRh.map((r) => +(r.total * W_TO_BTUH).toFixed(0)) },
    { name: 'Latent only', kind: 'line', x: RHS.map((r) => r * 100), y: byRh.map((r) => +(r.lat * W_TO_BTUH).toFixed(0)) },
  ],
  xDomain: [15, 55], yDomain: [0, 45000], height: 280,
  vlines: [{ x: 30, text: 'URS limit 30 %' }],
  desc: 'Total and latent cooling load against the room relative humidity target, from 15 to 55 per cent, at the outdoor airflow found in step 2. The latent part falls steeply as the target is relaxed.',
});

console.log(JSON.stringify({ step1, fit: { fracPct: fit.f * 100, ventM3h: SUPPLY * fit.f, ventLps: (SUPPLY * fit.f * 1000) / 3600, sens: +fit.sens.toFixed(0), lat: +fit.lat.toFixed(0), total: +fit.total.toFixed(0), shr: +fit.shr.toFixed(3) }, rows: fitRun.rows.map((r) => ({ name: r.name, sensBtuh: +(r.sens * W_TO_BTUH).toFixed(0), latBtuh: +(r.lat * W_TO_BTUH).toFixed(0) })), step3, all100: { total: +series[100].total.toFixed(0), sens: +series[100].sens.toFixed(0), lat: +series[100].lat.toFixed(0) }, rh30: +(byRh[15].total * W_TO_BTUH).toFixed(0), rh50: +(byRh[35].total * W_TO_BTUH).toFixed(0), rh25: +(byRh[10].total * W_TO_BTUH).toFixed(0), totalPlusHeater: +(ROOM_LOAD_BTUH + step3.heaterBtuh).toFixed(0) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'share', figure(fig1, 'Figure 1. The room\'s cooling load worked out by the HVAC room load tool\'s maths, against how much of the measured 1146 m³/h supply is outdoor air rather than recirculated. The dashed line is the paper\'s stated room load. The envelope, the outdoor design state and the people and lighting gains are our assumptions; the room size, airflow and machine powers come from the paper.'));
  md = inject(md, 'rh', figure(fig2, 'Figure 2. The same room at the outdoor airflow found in Figure 1, with the humidity target swept from 15 to 55 % RH. Below about 35 % the latent load climbs steeply, which is why this room needs a separate dehumidifier instead of a bigger cooling coil.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
