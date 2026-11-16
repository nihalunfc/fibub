// Figures for src/blog/discoveries/mira-period-luminosity-rubin-zy-ngc-6822-distance.md, made with the maths of the
// HR diagram tool (src/lib/sci/hrd.ts: the distance modulus) and the Period finder (src/lib/sci/lombscargle.ts).
// Run: node scripts/blog-figures/mira-period-luminosity-rubin-zy-ngc-6822-distance.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { modulus } from '../../src/lib/sci/hrd.ts';
import { lombScargle, peaks } from '../../src/lib/sci/lombscargle.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mira-period-luminosity-rubin-zy-ngc-6822-distance.md', import.meta.url);

// Inputs. "Paper": Ngeow and Bhardwaj (2026), arXiv:2611.17628 (CC BY 4.0), abstract.
// "Literature": Pietrzyński et al. (2019), Nature 567, 200 (LMC distance from eclipsing binaries).
const MU_N6822 = 23.32, MU_N6822_ERR = 0.24;   // mag, paper (one O-rich Mira in NGC 6822)
const MU_LMC = 18.477, MU_LMC_ERR = 0.026;     // mag, literature
const P_BREAK = 300;                           // days, paper (the PL relations are calibrated below this period)

// The tool's modulus is mu = 5 log10(d) - 5 with d in parsecs. We invert it by bisection on the tool's own function,
// so every distance below comes from the same formula the HR diagram tool uses.
const dist = (mu) => { let lo = 1, hi = 1e9; for (let k = 0; k < 200; k++) { const m = Math.sqrt(lo * hi); if (modulus(m) < mu) lo = m; else hi = m; } return Math.sqrt(lo * hi); };
const dN = dist(MU_N6822), dNlo = dist(MU_N6822 - MU_N6822_ERR), dNhi = dist(MU_N6822 + MU_N6822_ERR);
const dL = dist(MU_LMC);
const dmu = MU_N6822 - MU_LMC, flux = 10 ** (0.4 * dmu);
const LY_PER_PC = 3.261563777;

// Figure 1: the distance modulus curve from the tool's function, with the LMC and NGC 6822 marked.
const lx = [], ly = [];
for (let g = 3.5; g <= 6.3001; g += 0.05) { lx.push(+g.toFixed(2)); ly.push(+modulus(10 ** g).toFixed(3)); }
const fig1 = chart({
  title: 'Distance modulus and distance', xLabel: 'Distance (parsecs, log scale)', yLabel: 'Distance modulus μ (mag)',
  series: [
    { name: 'μ = 5 log₁₀ d − 5', kind: 'line', x: lx, y: ly, noLegend: true },
    { name: 'LMC (literature)', kind: 'dots', x: [+Math.log10(dL).toFixed(3)], y: [MU_LMC], errors: [MU_LMC_ERR], size: 4, label: { text: `LMC ${(dL / 1000).toFixed(1)} kpc`, dx: 8, dy: 16 } },
    { name: 'NGC 6822 (paper)', kind: 'dots', x: [+Math.log10(dN).toFixed(3)], y: [MU_N6822], errors: [MU_N6822_ERR], size: 4, label: { text: `NGC 6822 ${(dN / 1000).toFixed(0)} kpc`, anchor: 'end', dx: -8, dy: -6 } },
  ],
  xDomain: [3.5, 6.3], yDomain: [12, 25], xTicks: [4, 5, 6], xFmt: (t) => ['10 kpc', '100 kpc', '1 Mpc'][t - 4],
  desc: `The distance modulus rises by 5 magnitudes for every tenfold step in distance. The LMC sits at ${MU_LMC} mag (${(dL / 1000).toFixed(1)} kpc) and NGC 6822 at ${MU_N6822} mag (${(dN / 1000).toFixed(0)} kpc).`, height: 300,
});

// Figure 2: the Period finder on a SIMULATED Mira (our assumptions: 250-day period, 0.5 mag semi-amplitude in z with a
// slightly lopsided shape, 0.03 mag noise), seen two ways: a short 120-day run (like a first data preview) and three
// observing seasons (like the first years of the survey). Nothing here is the paper's data.
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const P_TRUE = 250, AMP = 0.5, NOISE = 0.03;     // days, mag, mag: our assumptions
const mira = (t) => { const ph = 2 * Math.PI * t / P_TRUE; return 19.0 + AMP * (Math.sin(ph) + 0.15 * Math.sin(2 * ph + 1)); };
const sample = (spanDays, seasonDays, every) => {
  const t = [], y = [];
  for (let x = 0; x < spanDays; x += every * (0.6 + 0.8 * rnd())) { if (x % 365.25 > seasonDays) continue; t.push(+x.toFixed(3)); y.push(mira(x) + NOISE * gauss()); }
  return { t, y };
};
const short = sample(120, 365, 6);              // 120 days, a visit about every 6 nights (assumed)
const long = sample(3 * 365.25, 200, 6);        // 3 seasons of 200 nights each, same cadence (assumed)
const FMIN = 1 / 1000, FMAX = 1 / 50, NF = 4000;
const pgS = lombScargle(short.t, short.y, null, FMIN, FMAX, NF), pgL = lombScargle(long.t, long.y, null, FMIN, FMAX, NF);
const topS = peaks(pgS, 3), topL = peaks(pgL, 3);
// Plot power against log10(period), thinned to 200 points.
const thin = (pg) => { const x = [], y = []; for (let i = 0; i < pg.freq.length; i += 20) { let m = 0; for (let j = i; j < Math.min(i + 20, pg.freq.length); j++) m = Math.max(m, pg.power[j]); x.push(+Math.log10(1 / pg.freq[i]).toFixed(4)); y.push(+m.toFixed(3)); } return { x, y }; };
const s1 = thin(pgS), s2 = thin(pgL);
const fig2 = chart({
  title: 'Period finder on a simulated Mira: short run vs three seasons', xLabel: 'Trial period (days, log scale)', yLabel: 'Power',
  series: [
    { name: '120 days of data', kind: 'line', x: s1.x, y: s1.y },
    { name: 'Three seasons', kind: 'line', x: s2.x, y: s2.y },
  ],
  xDomain: [Math.log10(50), 3], yDomain: [0, 1.05], xTicks: [Math.log10(50), 2, Math.log10(200), Math.log10(500), 3], xFmt: (t) => String(Math.round(10 ** t)),
  vlines: [{ x: Math.log10(P_BREAK), text: '300 d break', left: true }],
  desc: `With 120 days of data the periodogram is a broad hump whose top is at ${(1 / topS[0].freq).toFixed(0)} days; with three seasons it is a sharp peak at ${(1 / topL[0].freq).toFixed(1)} days, close to the true 250 days. Simulated data.`, height: 300,
});

const facts = {
  dN_kpc: (dN / 1000).toFixed(1), dN_range_kpc: [(dNlo / 1000).toFixed(0), (dNhi / 1000).toFixed(0)], dN_Mly: (dN * LY_PER_PC / 1e6).toFixed(2),
  relErr: (100 * (dNhi - dNlo) / 2 / dN).toFixed(1), dL_kpc: (dL / 1000).toFixed(2), ratio: (dN / dL).toFixed(2), dmu: dmu.toFixed(3), flux: flux.toFixed(1),
  muCheck461k: modulus(461000).toFixed(3), muCheckLMC: modulus(49600).toFixed(3),
  nShort: short.t.length, nLong: long.t.length, shortPeaks: topS.map((p) => +(1 / p.freq).toFixed(1)), longPeaks: topL.map((p) => +(1 / p.freq).toFixed(1)),
  shortPow: topS.map((p) => +p.power.toFixed(3)), longPow: topL.map((p) => +p.power.toFixed(3)),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'dm', figure(fig1, 'Figure 1. The distance modulus curve drawn with the HR diagram tool\'s formula, with the LMC (literature value) and the paper\'s NGC 6822 Mira distance marked. The error bars are the quoted uncertainties in magnitudes.'));
  md = inject(md, 'pg', figure(fig2, 'Figure 2. Periodograms from the Period finder\'s maths for a simulated 250-day Mira: 120 days of data (broad hump) against three observing seasons (sharp peak). Simulated, not Rubin data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
