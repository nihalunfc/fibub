// Figures for src/blog/discoveries/whittlesea-wind-weibull-power-density.md, made with the maths of the
// Wind energy yield tool (src/lib/sci/eng-wind.ts, with air density from src/lib/sci/eng-atmos.ts).
// Run: node scripts/blog-figures/whittlesea-wind-weibull-power-density.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { gamma, cFromMean, powerDensity, shear, genericCurve, aep, weibullPdf, weibullMean } from '../../src/lib/sci/eng-wind.ts';
import { atmosphere, stdTP, geopotential } from '../../src/lib/sci/eng-atmos.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/whittlesea-wind-weibull-power-density.md', import.meta.url);

// Paper (Shambira, Luvatsha and Mukumba 2025, Processes 13, 1344, doi:10.3390/pr13051344, CC BY): one year of hourly
// winds at 10 m, mean 3.88 m/s, power density 67.29 W/m² with ρ = 1.225 kg/m³; site elevation 1100 m.
const V = 3.88, PD = 67.29, RHO0 = 1.225, ELEV = 1100;
// Our assumptions: mean air temperature 15 °C, shear exponent 0.143 (the usual 1/7 for open land), and a made-up
// small turbine on the tool's generic curve: 10 kW, 8 m rotor, Cp 0.4, cut-in 3 m/s, cut-out 25 m/s.
const T = 15, ALPHA = 0.143, TURB = [10, 8, 0.4, 3, 25];

// Step 1: k from the energy pattern factor PD / (½ ρ v̄³) = Γ(1 + 3/k) / Γ(1 + 1/k)³ (bisection), then c from the mean.
const epf = PD / (0.5 * RHO0 * V ** 3), EPF = (k) => gamma(1 + 3 / k) / gamma(1 + 1 / k) ** 3;
let lo = 1, hi = 4; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (EPF(m) > epf) lo = m; else hi = m; }
const k = (lo + hi) / 2, c = cFromMean(V, k);
// Step 2: the site's own air density.
const rho = atmosphere(ELEV, { dT: T + 273.15 - stdTP(geopotential(ELEV)).T }).rho;
// Step 3: hub heights and a small turbine.
const cur = genericCurve(...TURB);
const hubs = [10, 20, 30, 40, 50].map((h) => { const ch = shear(c, 10, h, 'power', ALPHA), a = aep(cur, k, ch, rho); return { h, c: +ch.toFixed(3), mean: +weibullMean(k, ch).toFixed(2), PD: +powerDensity(k, ch, rho).toFixed(1), kWh: Math.round(a.kWh), CF: +(a.kWh / (TURB[0] * 8760) * 100).toFixed(1) }; });

// Figure 1: the Weibull distribution at 10 m and 30 m.
const vs = Array.from({ length: 81 }, (_, i) => i * 0.2);
const c30 = shear(c, 10, 30, 'power', ALPHA);
const fig1 = chart({
  title: 'How often each wind speed blows (Weibull, recomputed)', xLabel: 'Wind speed (m/s)', yLabel: 'Share of hours per m/s (%)',
  series: [
    { name: 'At 10 m (from the paper\'s mean and power density)', kind: 'line', x: vs, y: vs.map((v) => +(100 * weibullPdf(v, k, c)).toFixed(2)) },
    { name: 'At 30 m (shear α 0.143)', kind: 'line', x: vs, y: vs.map((v) => +(100 * weibullPdf(v, k, c30)).toFixed(2)), dash: '5 4' },
  ],
  xDomain: [0, 16], yDomain: [0, 22], vlines: [{ x: 3, text: 'cut-in 3 m/s' }],
  desc: `A Weibull distribution with k ${k.toFixed(2)} and c ${c.toFixed(2)} m/s reproduces the paper's mean speed and power density; at 30 m the scale rises to ${c30.toFixed(2)} m/s.`, height: 290,
});

// Figure 2: wind power density with height, at standard air density and at the site's own.
const hs = Array.from({ length: 41 }, (_, i) => 10 + i * 2);
const fig2 = chart({
  title: 'Wind power density with height', xLabel: 'Height above ground (m)', yLabel: 'Power density (W/m²)',
  series: [
    { name: 'Standard air, 1.225 kg/m³', kind: 'line', x: hs, y: hs.map((h) => +powerDensity(k, shear(c, 10, h, 'power', ALPHA), RHO0).toFixed(1)) },
    { name: `Site air at 1,100 m, ${rho.toFixed(3)} kg/m³`, kind: 'line', x: hs, y: hs.map((h) => +powerDensity(k, shear(c, 10, h, 'power', ALPHA), rho).toFixed(1)) },
  ],
  xDomain: [10, 90], yDomain: [0, 200], hlines: [{ y: 100, text: '100 W/m²: poor' }],
  desc: `At the site's elevation the air is about ${((1 - rho / RHO0) * 100).toFixed(0)} % thinner than standard, so the power density at 10 m is ${powerDensity(k, c, rho).toFixed(0)} W/m², not 67 W/m².`, height: 280,
});

console.log(JSON.stringify({ epf: epf.toFixed(4), k: k.toFixed(4), c: c.toFixed(4), rho: rho.toFixed(4), pdSite: powerDensity(k, c, rho).toFixed(2), hubs }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'weibull', figure(fig1, 'Figure 1. The Weibull distribution that matches the paper\'s 10 m mean speed and power density (our recomputation, not the paper\'s fitted curves), and the same wind carried up to 30 m with the 1/7 power law.'));
  md = inject(md, 'density', figure(fig2, 'Figure 2. Wind power density against height from the Wind energy yield tool\'s maths, at the standard air density the paper used and at the thinner air of a 1,100 m site at 15 °C (our assumption).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
