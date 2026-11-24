// Figures for src/blog/discoveries/steel-slag-waste-heat-rankine-cycle-steam-tables.md, made with the maths of the
// Steam tables tool (src/lib/sci/if97.ts: IAPWS-IF97 properties, rankine(), dome() and isobar()).
// Run: node scripts/blog-figures/steel-slag-waste-heat-rankine-cycle-steam-tables.mjs
import fs from 'node:fs';
import { rankine, dome, isobar, pT, tsat, satP, pX } from '../../src/lib/sci/if97.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/steel-slag-waste-heat-rankine-cycle-steam-tables.md', import.meta.url);
const K = 273.15;

// Inputs from the paper: Wu, Zhou, Bai, Xu, Li, Xia, Zhang and Yang (2026), Frontiers in Energy Research 14,
// doi:10.3389/fenrg.2026.1965673 (CC BY 4.0). Turbine inlet 0.2 MPa and 556.8 C, steam flow 10,400 kg/h,
// condenser 0.004 MPa with condensate at 28.96 C, turbine isentropic efficiency 0.72, feed pump about 0.66 kW,
// heat input 10,127 kW, cycle power 2068.4 kW, thermal efficiency 20.4 %, condenser duty about 8.01 MW.
// OUR assumption: a pump isentropic efficiency of 0.75 (the paper gives the pump work, not its efficiency).
const P_BOIL = 0.2, T_IN = 556.8, P_COND = 0.004, ETA_T = 0.72, ETA_P = 0.75;
const MDOT = 10400 / 3600;                                   // kg/s
const PAPER = { power: 2068.4, heat: 10127, eta: 20.4, cond: 8010, tCond: 28.96 };

const cyc = rankine({ pBoil: P_BOIL, T3: T_IN + K, pCond: P_COND, etaT: ETA_T, etaP: ETA_P });
const kW = (perKg) => perKg * MDOT;

// Figure 1: the cycle on a temperature-entropy diagram, with the saturation dome.
const d = dome(50);
const [st1, st2, st3, st4] = cyc.pts.map((p) => p.st);
const boilLine = isobar(P_BOIL, st2, st3, 60);
const condLine = isobar(P_COND, st4, st1, 60);
const fig1 = chart({
  title: 'The slag-heat cycle on a temperature-entropy diagram', xLabel: 'Entropy s (kJ/kg·K)', yLabel: 'Temperature (°C)',
  series: [
    { name: 'saturation dome', kind: 'line', x: [...d.liq, ...d.vap.slice().reverse()].map((p) => p[0]), y: [...d.liq, ...d.vap.slice().reverse()].map((p) => p[1] - K), colour: 'var(--muted)' },
    { name: '0.2 MPa (boiler)', kind: 'line', x: boilLine.map((p) => p[0]), y: boilLine.map((p) => p[1] - K) },
    { name: '0.004 MPa (condenser)', kind: 'line', x: condLine.map((p) => p[0]), y: condLine.map((p) => p[1] - K) },
    { name: 'turbine (72 % efficient)', kind: 'line', x: [st3.s, st4.s], y: [st3.T - K, st4.T - K], colour: 'var(--ink)', dash: '5 3' },
    { name: '', noLegend: true, kind: 'dots', size: 4, x: [st1.s, st3.s, st4.s], y: [st1.T - K, st3.T - K, st4.T - K], colour: 'var(--ink)' },
  ],
  xDomain: [0, 9.8], yDomain: [0, 600],
  desc: 'Temperature against entropy for the paper’s cycle: feed water at 28.96 C, steam at 0.2 MPa and 556.8 C, expansion to 0.004 MPa ending 178 K above the boiling point, and condensation back to the start.',
  height: 300,
});

// Figure 2: thermal efficiency against boiler pressure at the same turbine inlet temperature.
const PS = Array.from({ length: 81 }, (_, i) => 0.2 + i * 0.1475); // 0.2 to 12 MPa
const etaAt = (p) => rankine({ pBoil: p, T3: T_IN + K, pCond: P_COND, etaT: ETA_T, etaP: ETA_P }).eta * 100;
const fig2 = chart({
  title: 'What the 0.2 MPa steam pressure costs', xLabel: 'Boiler pressure (MPa)', yLabel: 'Thermal efficiency (%)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: PS, y: PS.map((p) => +etaAt(p).toFixed(3)) },
    { name: '', noLegend: true, kind: 'dots', size: 4.5, x: [P_BOIL], y: [+etaAt(P_BOIL).toFixed(2)], colour: 'var(--ink)' },
  ],
  xDomain: [0, 12], yDomain: [15, 35],
  hlines: [{ y: +etaAt(P_BOIL).toFixed(2), text: "the paper's cycle, 20.5 %" }],
  desc: 'Thermal efficiency of the same cycle (556.8 C turbine inlet, 0.004 MPa condenser, 72 % turbine) against boiler pressure. It rises from 20.5 % at 0.2 MPa to about 31 % at 12 MPa.',
  height: 280,
});

const row = (st) => ({ p: +st.p.toFixed(4), T: +(st.T - K).toFixed(2), h: +st.h.toFixed(1), s: +st.s.toFixed(4), phase: st.phase });
console.log(JSON.stringify({
  states: cyc.pts.map((p) => ({ name: p.name, ...row(p.st) })),
  idealExit: row(cyc.ideal[0]),
  perKg: { wT: +cyc.wT.toFixed(2), wP: +cyc.wP.toFixed(3), wNet: +cyc.wNet.toFixed(2), qIn: +cyc.qIn.toFixed(1), qOut: +cyc.qOut.toFixed(1) },
  totals: { powerKW: +kW(cyc.wNet).toFixed(1), turbineKW: +kW(cyc.wT).toFixed(1), pumpKW: +kW(cyc.wP).toFixed(2), heatKW: +kW(cyc.qIn).toFixed(0), condKW: +kW(cyc.qOut).toFixed(0) },
  eta: +(cyc.eta * 100).toFixed(2), carnot: +(cyc.carnot * 100).toFixed(1), steamRate: +cyc.steamRate.toFixed(2), bwr: +(cyc.bwr * 100).toFixed(3),
  tCond: +(tsat(P_COND) - K).toFixed(2), exhaustSuperheat: +(st4.T - tsat(P_COND)).toFixed(1),
  paper: PAPER,
  gaps: { power: +(kW(cyc.wNet) - PAPER.power).toFixed(1), heatPct: +(((kW(cyc.qIn) - PAPER.heat) / PAPER.heat) * 100).toFixed(2), condPct: +(((kW(cyc.qOut) - PAPER.cond) / PAPER.cond) * 100).toFixed(2), etaPts: +((cyc.eta * 100) - PAPER.eta).toFixed(2) },
  flowFromHeat: +((PAPER.heat / cyc.qIn) * 3600).toFixed(0),
  pressureScan: [0.2, 0.5, 1, 2, 4, 8, 12].map((p) => { const c = rankine({ pBoil: p, T3: T_IN + K, pCond: P_COND, etaT: ETA_T, etaP: ETA_P }); return { p, eta: +(c.eta * 100).toFixed(2), kWsameHeat: +(PAPER.heat * c.eta).toFixed(0), x: c.xExit === null ? 'superheated' : +c.xExit.toFixed(3) }; }),
  turbineScan: [0.6, 0.72, 0.8, 0.9].map((e) => { const c = rankine({ pBoil: P_BOIL, T3: T_IN + K, pCond: P_COND, etaT: e, etaP: ETA_P }); return { etaT: e, eta: +(c.eta * 100).toFixed(2), kW: +kW(c.wNet).toFixed(0) }; }),
  condScan: [0.004, 0.008, 0.01, 0.02].map((pc) => { const c = rankine({ pBoil: P_BOIL, T3: T_IN + K, pCond: pc, etaT: ETA_T, etaP: ETA_P }); return { pCond: pc, tSat: +(tsat(pc) - K).toFixed(2), eta: +(c.eta * 100).toFixed(2), kW: +kW(c.wNet).toFixed(0) }; }),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ts', figure(fig1, 'Figure 1. The paper’s cycle drawn by the Steam tables tool’s own IF97 maths: water at 28.96 °C is pumped to 0.2 MPa, heated to 556.8 °C by the slag, expanded through a 72 % efficient turbine to 0.004 MPa, and condensed. The expansion ends 178 K above the boiling point, outside the saturation dome.'));
  md = inject(md, 'pressure', figure(fig2, 'Figure 2. Thermal efficiency of the same cycle against boiler pressure, with everything else held as the paper has it. The dot is the paper’s 0.2 MPa design.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
