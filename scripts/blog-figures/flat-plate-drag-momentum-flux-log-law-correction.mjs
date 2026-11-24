// Figures for src/blog/discoveries/flat-plate-drag-momentum-flux-log-law-correction.md, made with the maths of the
// Boundary layer tool (src/lib/sci/phbl.ts: the Blasius solution, the 1/7-power-law turbulent layer and plate drag).
// Run: node scripts/blog-figures/flat-plate-drag-momentum-flux-log-law-correction.mjs
import fs from 'node:fs';
import { local, plateCD, blasiusCached } from '../../src/lib/sci/phbl.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/flat-plate-drag-momentum-flux-log-law-correction.md', import.meta.url);

// Inputs from the paper: Basse, N. T. (2026), Fluids 11(6), 155 (CC BY 4.0). Log-law constants kappa = 0.39 with
// A = 4.3 (its reference set) and A = 5.7 (its effective fitted set), and the closed form for the correction factor
// f(Re_tau) = M / (U_tau^2 delta). Our flow conditions: air at 20 C (the tool's rounded values) at 20 m/s.
const KAPPA = 0.39, A_REF = 4.3, A_FIT = 5.7;
const U = 20, NU = 1.516e-5, RHO = 1.204;

/** The paper's closed form for the correction factor. */
const fClosed = (Ret, A) => 2 / KAPPA ** 2 - (2 * A) / KAPPA + A * A + Math.log(Ret) * ((2 * A) / KAPPA - 2 / KAPPA ** 2) + Math.log(Ret) ** 2 / KAPPA ** 2;
/** The same thing by brute force: the mean square of the log-law profile across the layer. */
const fNumeric = (Ret, A, n = 200000) => { let s = 0; for (let i = 0; i < n; i++) { const e = (i + 0.5) / n; s += ((1 / KAPPA) * Math.log(e * Ret) + A) ** 2; } return s / n; };

// The plate, from the tool's turbulent branch (tripped at the leading edge).
const XS = [0.2, 0.5, 1, 2, 5, 10, 20, 30];
const row = (x) => {
  const L = local(x, U, NU, 'turbulent', 5e5), utU = Math.sqrt(L.cf / 2);
  return { x, Rex: L.Re, delta: L.delta, cf: L.cf, utU, Ret: (L.delta * utU * U) / NU, dTilde: (L.delta * U) / NU, fTool: (7 / 9) * (2 / L.cf) };
};
const rows = XS.map(row);
const dense = Array.from({ length: 121 }, (_, i) => row(0.2 * (30 / 0.2) ** (i / 120)));

const lg = (v) => Math.log10(v);
const p10 = (t) => { const v = 10 ** t; return v >= 1000 ? (v / 1000 >= 10 ? `${Math.round(v / 1000)}k` : `${+(v / 1000).toPrecision(2)}k`) : String(Math.round(v)); };

// Figure 1: the correction factor against Re_tau, three ways.
const fig1 = chart({
  title: 'Momentum-flux factor M/(Uτ²δ) along a flat plate', xLabel: 'Friction Reynolds number Reτ', yLabel: 'M / (Uτ² δ)',
  series: [
    { name: 'Paper, κ 0.39, A 4.3', kind: 'line', x: dense.map((r) => lg(r.Ret)), y: dense.map((r) => +fClosed(r.Ret, A_REF).toFixed(2)) },
    { name: 'Paper, A 5.7 (fitted)', kind: 'line', x: dense.map((r) => lg(r.Ret)), y: dense.map((r) => +fClosed(r.Ret, A_FIT).toFixed(2)), dash: '5 4' },
    { name: 'Tool, 1/7 power law', kind: 'dots', x: rows.map((r) => lg(r.Ret)), y: rows.map((r) => +r.fTool.toFixed(2)), size: 3.5 },
  ],
  xDomain: [lg(350), lg(15000)], yDomain: [200, 950], xFmt: p10,
  desc: `The factor M over U-tau squared times delta against the friction Reynolds number. The paper's closed form is drawn for both of its log-law constant sets; the dots are the same quantity worked out from the Boundary layer tool's 1/7-power-law layer, which agrees within ${(100 * Math.max(...rows.slice(0, 5).map((r) => Math.abs(r.fTool / fClosed(r.Ret, A_FIT) - 1)))).toFixed(0)} per cent up to Re-tau of about 4000.`,
  height: 290,
});

// Figure 2: the friction velocity ratio against the dimensionless layer thickness, with the asymptotic -1/2 slope.
const fit = (xs, ys) => { const n = xs.length, mx = xs.reduce((s, v) => s + Math.log(v), 0) / n, my = ys.reduce((s, v) => s + Math.log(v), 0) / n; let a = 0, b = 0; xs.forEach((v, i) => { const dx = Math.log(v) - mx; a += dx * (Math.log(ys[i]) - my); b += dx * dx; }); return { slope: a / b, c: Math.exp(my - (a / b) * mx) }; };
const pUt = fit(dense.map((r) => r.dTilde), dense.map((r) => r.utU));
const pF = fit(dense.map((r) => r.dTilde), dense.map((r) => Math.sqrt(r.fTool)));
const pFpaper = fit(dense.map((r) => r.dTilde), dense.map((r) => Math.sqrt(fClosed(r.Ret, A_REF))));
const pDelta = fit(dense.map((r) => r.Ret), dense.map((r) => r.dTilde));
const ref = dense[0].utU * 1.0; // anchor the -1/2 line on the first point
const fig2 = chart({
  title: 'Friction velocity against layer thickness: how far the −1/2 limit is', xLabel: 'Dimensionless layer thickness δ̃ = δU/ν', yLabel: 'Uτ / U',
  series: [
    { name: 'Tool, 1/7 power law', kind: 'line', x: dense.map((r) => lg(r.dTilde)), y: dense.map((r) => lg(r.utU)) },
    { name: 'Slope −1/2 (asymptotic)', kind: 'line', x: dense.map((r) => lg(r.dTilde)), y: dense.map((r) => lg(ref * (r.dTilde / dense[0].dTilde) ** -0.5)), dash: '5 4' },
  ],
  xDomain: [lg(7000), lg(5e5)], yDomain: [lg(0.004), lg(0.06)], xFmt: p10, yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: `The friction velocity ratio falls as the dimensionless layer thickness grows. Over a laboratory plate the tool's slope is ${pUt.slope.toFixed(3)}, nowhere near the asymptotic minus one half that the paper's corrected fit approaches.`,
  height: 290,
});

console.log(JSON.stringify({
  closedVsNumeric: rows.map((r) => ({ Ret: Math.round(r.Ret), closed: +fClosed(r.Ret, A_REF).toFixed(4), numeric: +fNumeric(r.Ret, A_REF).toFixed(4) })),
  table: rows.map((r) => ({ x: r.x, Rex: +r.Rex.toPrecision(3), deltaMM: +(r.delta * 1000).toFixed(1), cf: +r.cf.toFixed(5), utU: +r.utU.toFixed(4), Ret: Math.round(r.Ret), dTilde: +r.dTilde.toPrecision(3), fTool: +r.fTool.toFixed(1), f43: +fClosed(r.Ret, A_REF).toFixed(1), f57: +fClosed(r.Ret, A_FIT).toFixed(1), ratio57: +(r.fTool / fClosed(r.Ret, A_FIT)).toFixed(3), ratio43: +(r.fTool / fClosed(r.Ret, A_REF)).toFixed(3) })),
  exponents: { fToolVsRet: +fit(dense.map((r) => r.Ret), dense.map((r) => r.fTool)).slope.toFixed(4), fPaperVsRet: +fit(dense.map((r) => r.Ret), dense.map((r) => fClosed(r.Ret, A_REF))).slope.toFixed(4), sqrtFToolVsDelta: +pF.slope.toFixed(4), sqrtFPaperVsDelta: +pFpaper.slope.toFixed(4), utVsDelta: +pUt.slope.toFixed(4), deltaVsRet: +pDelta.slope.toFixed(4) },
  identities: (() => { let s1 = 0, s2 = 0; const n = 400000; for (let i = 0; i < n; i++) { const e = (i + 0.5) / n; s1 += Math.log(e); s2 += Math.log(e) ** 2; } return { intLn: +(s1 / n).toFixed(5), intLn2: +(s2 / n).toFixed(5) }; })(),
  blasius: { fpp0: +blasiusCached().fpp0.toFixed(6), eta99: +blasiusCached().eta99.toFixed(5), dstar: +blasiusCached().dstar.toFixed(5) },
  plate: { CD: +plateCD((U * 2) / NU, 'auto', 5e5).CD.toFixed(6), dragN: +(0.5 * RHO * U * U * 2 * plateCD((U * 2) / NU, 'auto', 5e5).CD).toFixed(3) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'factor', figure(fig1, 'Figure 1. The correction factor the paper derives, drawn from its closed form for both log-law constant sets, against the same quantity worked out from the Boundary layer tool\'s 1/7-power-law turbulent layer (dots, air at 20 m/s, x from 0.2 m to 30 m).'));
  md = inject(md, 'slope', figure(fig2, `Figure 2. The friction velocity ratio against the dimensionless layer thickness for the same plate, from the tool. Its slope is ${pUt.slope.toFixed(3)}; the dashed line is the asymptotic −1/2 the paper's corrected fit recovers, anchored on the first point.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
