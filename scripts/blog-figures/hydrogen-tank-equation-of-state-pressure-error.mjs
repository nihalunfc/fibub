// Figures for src/blog/discoveries/hydrogen-tank-equation-of-state-pressure-error.md, made with the maths of the
// Real gas calculator (src/lib/sci/phrealgas.ts: the cubic equations of state, Z and the container pressures).
// Run: node scripts/blog-figures/hydrogen-tank-equation-of-state-pressure-error.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { GASES, EOS_LIST, EOS_NAMES, R, pressure, solveTP, zCurve, containerPressures } from '../../src/lib/sci/phrealgas.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hydrogen-tank-equation-of-state-pressure-error.md', import.meta.url);

// Inputs. The gas is hydrogen as the tool ships it (Tc 33.2 K, Pc 13.0 bar, omega -0.216, M 2.016 g/mol: rounded
// general values, not from the paper). The temperature 288.15 K (15 C) is OUR choice of a filling-station ambient.
// The paper (Luo et al. 2025, Appl. Sci. 15: 11151, doi:10.3390/app152011151, CC BY) reports pressure errors against
// a NIST benchmark of 17.90 % (van der Waals), 1.83 % (Redlich-Kwong) and 0.30 % (their polynomial fit), rising to
// 34.57 % for van der Waals in a higher-pressure case.
const H2 = GASES.find((g) => g.id === 'h2');
const T = 288.15;
const PAPER = { vdw1: 17.9, vdw2: 34.57, rk: 1.83, poly: 0.3 };

// --- Chart 1: Z against pressure for every equation, 0 to 90 MPa.
const PMAX = 90e6;
const curves = EOS_LIST.map((e) => zCurve(e, H2, T, PMAX, 60));
const fig1 = chart({
  title: 'Hydrogen at 15 °C: Z from five equations', xLabel: 'Pressure (MPa)', yLabel: 'Z = PV/(RT)',
  series: EOS_LIST.map((e, i) => ({
    name: EOS_NAMES[e], kind: 'line', x: curves[i].P.map((p) => p / 1e6), y: curves[i].Z.map((z) => +z.toFixed(4)),
    colour: ['var(--muted)', 'var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--c-learn)'][i], dash: e === 'ideal' ? '5 4' : undefined,
  })),
  xDomain: [0, 90], yDomain: [0.95, 1.95], vlines: [{ x: 70, text: '70 MPa tank' , left: true }],
  desc: 'Compressibility factor of hydrogen at 15 degrees C from 0 to 90 MPa for the ideal gas law and four cubic equations of state. Van der Waals rises far above the others; Redlich-Kwong and Soave-Redlich-Kwong sit close together.',
  height: 290,
});

// --- Chart 2: the pressure each equation reports at the SAME density, as a % difference from Redlich-Kwong.
// At each reference pressure, take the molar volume Redlich-Kwong gives, then ask every equation for its pressure there.
const PREF = Array.from({ length: 44 }, (_, i) => (i + 1) * 2e6); // 2 to 88 MPa
const rows = PREF.map((P) => {
  const V = solveTP('rk', H2, T, P).V;
  return { P, V, err: Object.fromEntries(EOS_LIST.map((e) => [e, 100 * (pressure(e, H2, T, V) / P - 1)])) };
});
const pick = (p) => rows.find((r) => Math.abs(r.P - p * 1e6) < 1e3);
const fig2 = chart({
  title: 'Same hydrogen, same density: how far each equation is from Redlich-Kwong', xLabel: 'Pressure from Redlich-Kwong (MPa)', yLabel: 'Difference in pressure (%)',
  series: ['ideal', 'vdw', 'srk', 'pr'].map((e, i) => ({
    name: EOS_NAMES[e], kind: 'line', x: rows.map((r) => r.P / 1e6), y: rows.map((r) => +r.err[e].toFixed(2)),
    colour: ['var(--muted)', 'var(--c-blog)', 'var(--ink)', 'var(--c-tools)'][i], dash: e === 'ideal' ? '5 4' : undefined,
  })),
  xDomain: [0, 88], yDomain: [-42, 40],
  hlines: [{ y: PAPER.vdw1, text: `paper: ${PAPER.vdw1} %` }, { y: PAPER.vdw2, text: `paper: ${PAPER.vdw2} %` }, { y: 0, text: '' }],
  desc: 'Pressure difference from Redlich-Kwong at the same temperature and density, for the ideal gas law, van der Waals, Soave-Redlich-Kwong and Peng-Robinson. Van der Waals climbs through the paper’s two reported errors of 17.9 and 34.57 per cent.',
  height: 290,
});

// --- Numbers quoted in the article.
const at = (p) => { const r = pick(p); return `${p} MPa: ` + EOS_LIST.map((e) => `${e} ${r.err[e].toFixed(1)} %`).join(', '); };
const cross = (e, target) => { // pressure at which equation e first differs from RK by `target` %
  for (let i = 1; i < rows.length; i++) if (rows[i].err[e] >= target) {
    const a = rows[i - 1], b = rows[i], f = (target - a.err[e]) / (b.err[e] - a.err[e]);
    return (a.P + f * (b.P - a.P)) / 1e6;
  }
  return NaN;
};
const TANK = { kg: 5, litres: 128 };
const n = (TANK.kg * 1000) / H2.M, V = TANK.litres / 1000;
const tank = containerPressures(H2, T, n, V);
console.log('Z at 70 MPa, 288.15 K:', EOS_LIST.map((e) => `${e} ${solveTP(e, H2, T, 70e6).Z.toFixed(4)}`).join(', '));
console.log('molar volume from RK at 70 MPa (cm3/mol):', (solveTP('rk', H2, T, 70e6).V * 1e6).toFixed(2));
console.log(at(30)); console.log(at(60)); console.log(at(70)); console.log(at(88));
console.log(`van der Waals reaches ${PAPER.vdw1} % at ${cross('vdw', PAPER.vdw1).toFixed(1)} MPa and ${PAPER.vdw2} % at ${cross('vdw', PAPER.vdw2).toFixed(1)} MPa`);
console.log(`tank: ${TANK.kg} kg H2 (${n.toFixed(1)} mol) in ${TANK.litres} L at 15 C, molar volume ${((V / n) * 1e6).toFixed(2)} cm3/mol`);
for (const r of tank) console.log(`  ${EOS_NAMES[r.eos]}: ${(r.P / 1e6).toFixed(2)} MPa, Z ${r.Z.toFixed(4)}`);
console.log('ideal-gas molar volume at 70 MPa (cm3/mol):', ((R * T) / 70e6 * 1e6).toFixed(2));

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'zcurves', figure(fig1, 'Figure 1. Compressibility factor Z of hydrogen at 15 °C against pressure, worked out by the Real gas calculator’s maths for the ideal gas law and the four cubic equations. Z = 1 would mean ideal behaviour; hydrogen is far above it. Van der Waals climbs much faster than the rest.'));
md = inject(md, 'perr', figure(fig2, 'Figure 2. The same hydrogen at the same temperature and density, seen by each equation, as a percentage difference from Redlich-Kwong (the best cubic in the paper, within 1.83 % of the NIST benchmark). The dashed lines are the two van der Waals errors the paper reports.'));
fs.writeFileSync(ART, md);
console.log('charts written; fig1', fig1.length, 'bytes, fig2', fig2.length, 'bytes');
