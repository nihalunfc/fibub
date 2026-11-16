// Figures for src/blog/discoveries/toi-2535b-vanishing-transits.md, made with the same maths as the
// Transit fitter (#T71, src/lib/sci/transit.ts) and the Exoplanet mass calculator (#T57, src/lib/sci/rvmass.ts).
// Run: node scripts/blog-figures/toi-2535b-vanishing-transits.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fluxAt, durations, blocked, fitTransit, stellarDensity } from '../../src/lib/sci/transit.ts';
import { semiMajor, semiAmplitude, R_SUN, M_JUP } from '../../src/lib/sci/rvmass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/toi-2535b-vanishing-transits.md', import.meta.url);

// Inputs. Values the paper or its press releases state are marked "stated"; the rest are round numbers we
// chose for a typical K dwarf and hot Jupiter, marked "assumed", and the article says so.
export const IN = {
  P: 8.236,       // days, stated (orbital period)
  bdot: 0.16,     // per year, stated (rate of change of the impact parameter)
  t2019: 2019.3,  // year of the first TESS transits, stated (TESS sector 10, spring 2019)
  b2019: 0.1,     // assumed: "near the middle of the star" in 2019
  Ms: 0.80,       // solar masses, assumed (early K dwarf)
  Rs: 0.80,       // solar radii, assumed
  Rp: 1.0,        // Jupiter radii, assumed (a typical hot Jupiter)
  Mp: 1.0,        // Jupiter masses, assumed
  u1: 0.50, u2: 0.20, // quadratic limb darkening for a K dwarf in the TESS band, assumed
};

const aR = semiMajor(IN.Ms, IN.Mp * M_JUP, IN.P) / (IN.Rs * R_SUN);
const k = (IN.Rp * 7.1492e7) / (IN.Rs * R_SUN);
const bAt = (yr) => IN.b2019 + IN.bdot * (yr - IN.t2019);
const yEnd = IN.t2019 + (1 + k - IN.b2019) / IN.bdot; // b reaches 1 + k: the last grazing transit
const model = (b) => ({ T0: 0, P: IN.P, k, aR, b, F0: 1, u1: IN.u1, u2: IN.u2 });

// 1. Transit shape by year.
const years = [2019.3, 2021.5, 2023.5, 2025.2];
const hrs = Array.from({ length: 241 }, (_, i) => -3 + (6 * i) / 240);
const shape = years.map((y) => ({ name: String(Math.floor(y)), kind: 'line', x: hrs, y: hrs.map((h) => (1 - fluxAt(h / 24, model(bAt(y)))) * 100).map((v) => +v.toFixed(4)) }));
const fig1 = chart({
  title: 'The dip gets shorter and shallower each year', xLabel: 'Hours from mid-transit', yLabel: 'Light blocked (%)',
  series: shape, yReverse: true, yDomain: [0, Math.max(...shape[0].y) * 1.08],
  desc: 'Model transits for 2019, 2021, 2023 and 2025: each later dip is narrower and shallower.',
});

// 2. Duration and depth against time.
const ts = Array.from({ length: 141 }, (_, i) => 2019 + i * 0.05);
const t14 = ts.map((y) => +(durations(model(bAt(y))).t14 * 24).toFixed(3));
const depth = ts.map((y) => +(blocked(Math.abs(bAt(y)), k, IN.u1, IN.u2) * 100).toFixed(4));
const fig2 = chart({
  title: 'Transit length, year by year', xLabel: 'Year', yLabel: 'Transit length (hours)',
  series: [{ name: 'Length', kind: 'line', x: ts, y: t14 }], yDomain: [0, Math.max(...t14) * 1.1],
  vlines: [{ x: yEnd, text: `Last transit ≈ ${yEnd.toFixed(1)}`, left: true }], xFmt: (v) => String(Math.round(v)),
  desc: `Transit length falls from about ${t14[0].toFixed(1)} hours in 2019 to zero near ${yEnd.toFixed(1)}.`, height: 300,
});
const fig3 = chart({
  title: 'Transit depth, year by year', xLabel: 'Year', yLabel: 'Light blocked at mid-transit (%)',
  series: [{ name: 'Depth', kind: 'line', x: ts, y: depth }], yDomain: [0, Math.max(...depth) * 1.1],
  vlines: [{ x: yEnd, text: 'Gone', left: true }], xFmt: (v) => String(Math.round(v)),
  desc: 'Transit depth stays nearly flat at first, then falls quickly to zero as the planet starts to graze the edge of the star.', height: 300,
});

// 3. Round trip through the Transit fitter: simulated TESS-like data (3 transits per visit, noise added), fitted
// blind. The transit length is what the fitter pins down best, so each visit's length is turned back into an
// impact parameter with a/R* held at the star's value, and a straight line through those gives the rate.
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const noise = 0.0012; // 1.2 ppt per 10-minute point, assumed for a star of TESS magnitude 12.7
const bFromT14 = (T) => Math.sqrt(Math.max(0, (1 + k) ** 2 - (aR * Math.sin((Math.PI * T) / (24 * IN.P))) ** 2));
const visits = [2019.3, 2020.5, 2021.7, 2022.9, 2024.1].map((y) => {
  const m = model(bAt(y)), t = [], f = [];
  for (let n = 0; n < 3; n++) for (let x = -0.3; x <= 0.3; x += 10 / 1440) { t.push(n * IN.P + x); f.push(fluxAt(n * IN.P + x, m, 10 / 1440) + noise * gauss()); }
  const fit = fitTransit(t, f, null, { P: IN.P, u1: IN.u1, u2: IN.u2, T0: 0, texp: 10 / 1440 });
  const T = fit.derived((mm) => durations(mm).t14 * 24);
  const b = bFromT14(T.v), be = Math.abs(bFromT14(T.v - T.e) - bFromT14(T.v + T.e)) / 2;
  return { y, bTrue: m.b, T14true: durations(m).t14 * 24, T, b, be, fit, t, f };
});
// Weighted straight line b = c + s (year − 2019.3).
let Sw = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
for (const v of visits) { const w = 1 / v.be ** 2, x = v.y - IN.t2019; Sw += w; Sx += w * x; Sy += w * v.b; Sxx += w * x * x; Sxy += w * x * v.b; }
const D = Sw * Sxx - Sx * Sx, slope = (Sw * Sxy - Sx * Sy) / D, icpt = (Sxx * Sy - Sx * Sxy) / D, slopeErr = Math.sqrt(Sw / D);
const late = visits[visits.length - 1];
const ph = late.t.map((x) => ((x + IN.P / 2) % IN.P) - IN.P / 2);
const ord = ph.map((_, i) => i).sort((a, b) => ph[a] - ph[b]);
const curve = hrs.map((h) => +((1 - fluxAt(h / 24, late.fit.m, 10 / 1440)) * 100).toFixed(4));
const fig4 = chart({
  title: 'The Transit fitter on one simulated visit (2024)', xLabel: 'Hours from mid-transit', yLabel: 'Light blocked (%)', yReverse: true,
  series: [
    { name: 'Simulated data', kind: 'dots', x: ord.map((i) => +(ph[i] * 24).toFixed(3)), y: ord.map((i) => +((1 - late.f[i]) * 100).toFixed(3)), colour: 'var(--muted)', size: 1.8 },
    { name: 'Fitted model', kind: 'line', x: hrs, y: curve },
  ],
  xDomain: [-3, 3], desc: 'Noisy simulated transit points with the fitted model curve through them.', height: 300,
});
const yl = [2019, 2025];
const figB = chart({
  title: 'Impact parameter from each visit, and the rate it gives', xLabel: 'Year', yLabel: 'Impact parameter b',
  series: [
    { name: 'From the fitter', kind: 'dots', x: visits.map((v) => v.y), y: visits.map((v) => +v.b.toFixed(3)), errors: visits.map((v) => +v.be.toFixed(3)), size: 4 },
    { name: 'Straight-line fit', kind: 'line', x: yl, y: yl.map((x) => +(icpt + slope * (x - IN.t2019)).toFixed(3)) },
  ],
  xDomain: [2019, 2025], yDomain: [0, 1.2], hlines: [{ y: 1 + k, text: 'Planet no longer touches the star (b = 1 + k)' }], xFmt: (v) => String(Math.round(v)),
  desc: 'Impact parameters measured from five simulated visits rise in a straight line; the fitted slope matches the rate put in.', height: 300,
});

// 4. How long the planet hides: a simple swing of the orbit's tilt, matched to the stated rate.
// b(t) = A sin(2πt/T): it crosses the star's edge (b = 1 + k) at rate bdot, so T = 2πA cos(θ)/bdot with sin θ = (1+k)/A.
const As = Array.from({ length: 81 }, (_, i) => 1.2 + i * 0.05);
const gap = As.map((A) => { const th = Math.asin((1 + k) / A), T = (2 * Math.PI * A * Math.cos(th)) / IN.bdot; return +((T * (Math.PI - 2 * th)) / (2 * Math.PI)).toFixed(2); });
const tiltDeg = As.map((A) => +(Math.asin(Math.min(1, A / aR)) * 180 / Math.PI).toFixed(3));
const fig5 = chart({
  title: 'Years without transits, for different swings of the orbit', xLabel: 'Swing of the orbit either side of edge-on (degrees)', yLabel: 'Years with no transits',
  series: [{ name: 'Gap', kind: 'line', x: tiltDeg, y: gap }], xDomain: [tiltDeg[0], tiltDeg[tiltDeg.length - 1]], yDomain: [0, Math.max(...gap) * 1.05],
  hlines: [{ y: 30, text: '30 years' }, { y: 50, text: '50 years' }],
  desc: 'The number of years without transits grows with how far the orbit swings; swings of about 7 to 10 degrees give gaps of 30 to 50 years.', height: 300,
});

// Facts for the article text.
const rho = stellarDensity(aR, IN.P);
const K = semiAmplitude(IN.Mp * M_JUP, IN.Ms, IN.P);
const facts = {
  aR: aR.toFixed(1), k: k.toFixed(3), yEnd: yEnd.toFixed(1), t14_2019: t14[ts.findIndex((y) => y >= 2019.3)].toFixed(2),
  rho: rho.toFixed(2), K: K.toFixed(0),
  visits: visits.map((v) => ({ year: v.y, b_true: v.bTrue.toFixed(2), T14_true: v.T14true.toFixed(2), T14_fit: v.T.v.toFixed(2), T14_err: v.T.e.toFixed(2), b_fit: v.b.toFixed(2), b_err: v.be.toFixed(2) })),
  slope: slope.toFixed(3), slopeErr: slopeErr.toFixed(3),
  gapAt: [5, 6, 7, 8, 9, 10].map((d) => { const i = tiltDeg.findIndex((x) => x >= d); return { deg: d, years: i >= 0 ? gap[i] : null }; }),
};
console.log(JSON.stringify(facts, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'shape', figure(fig1, 'Figure 1. Model transits of TOI-2535 b, with the impact parameter growing by 0.16 a year from near 0 in 2019. Made with the transit maths in the Transit fitter.'));
  md = inject(md, 'length', figure(fig2, 'Figure 2. Transit length (first to last contact) from the same model. The line hits zero when the planet no longer touches the star.'));
  md = inject(md, 'depth', figure(fig3, 'Figure 3. Transit depth at mid-transit from the same model.'));
  md = inject(md, 'fit', figure(fig4, 'Figure 4. Three simulated 2024 transits with TESS-like noise (grey), fitted by the Transit fitter (line). Simulated, not the real TESS data.'));
  md = inject(md, 'rate', figure(figB, 'Figure 5. Impact parameter worked out from the transit length the fitter measured on each simulated visit, with a straight line through them. Simulated, not the real TESS data.'));
  md = inject(md, 'gap', figure(fig5, 'Figure 6. A simple tilting-orbit model held to the stated rate of 0.16 a year: how long the transits stay away for each size of swing. Dashed lines: the 30 to 50 years quoted by the team.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written into the article:', [fig1, fig2, fig3, fig4, figB, fig5].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
