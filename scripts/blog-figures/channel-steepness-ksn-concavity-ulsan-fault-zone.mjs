// Figures for src/blog/discoveries/channel-steepness-ksn-concavity-ulsan-fault-zone.md, made with the maths of the
// Stream profile tool (src/lib/sci/streamprof.ts: chi, best theta, slope-area and segmented knickpoint fits).
// Run: node scripts/blog-figures/channel-steepness-ksn-concavity-ulsan-fault-zone.mjs
import fs from 'node:fs';
import { synthetic, chi, lsq, bestTheta, slopeArea, segments } from '../../src/lib/sci/streamprof.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/channel-steepness-ksn-concavity-ulsan-fault-zone.md', import.meta.url);

// Metrics as printed in Lee, C.-H. et al. (2024), Earth Surface Dynamics 12: 1091-1120,
// doi:10.5194/esurf-12-1091-2024 (CC BY 4.0), Ulsan Fault Zone, South Korea:
// ksn 0 to 238 m^0.9, regional mean 24, standard deviation 16; theta_ref 0.45; measured concavity 0.36 to 0.47;
// chi with A0 = 1; channels start at 1e5 m^2; eastern ksn up to 200 % higher than western over the first 60 km.
const TREF = 0.45, A0 = 1, ACRIT = 1e5;
const KSN = { mean: 24, sd: 16, max: 238 };
const THETA_LOW = 0.36;
// Our own catchment geometry (OUR ASSUMPTION): Hack's law A = ka (L - x)^h with h = 1.67, a 20 km channel and an
// outlet area of about 50 km^2, cut off where the area falls to the paper's 1e5 m^2 channel head.
const L = 20000, H = 1.67, KA = 3.27, N = 241;
const dHead = Math.round((ACRIT / KA) ** (1 / H));
const geom = (ks, theta = TREF) => synthetic(N, L, KA, H, ks, theta, dHead);

const r = (v, n = 2) => +v.toFixed(n);
const base = geom(KSN.mean);
// A channel whose real concavity is 0.36, scaled to the same total relief so only its shape differs.
const p36 = geom(KSN.mean, THETA_LOW);
const z36 = p36.z.map((v) => (v * (KSN.mean * chi(base, TREF, A0)[N - 1])) / p36.z[N - 1]);
const cRef = chi(base, TREF, A0);
const fit = lsq(cRef, base.z);
const bt = bestTheta(base, A0);
const sa = slopeArea(base, 10);
const relief = (ks) => r(ks * cRef[cRef.length - 1], 1);
const areas = { outlet: r(base.A[0] / 1e6, 1), head: r(base.A[base.A.length - 1], 0) };

// 1. A knickpoint: ksn 24 below, three times that above (the paper's east-west contrast of up to 200 %).
const KB = cRef[cRef.length - 1] * 0.45; // break at 45 % of the total chi (our choice)
const zStep = cRef.map((c) => (c <= KB ? KSN.mean * c : KSN.mean * KB + 3 * KSN.mean * (c - KB)));
const stepProf = { x: base.x, z: zStep, A: base.A };
// Real profiles carry DEM noise, so the knickpoint search is given a seeded 2 m scatter (OUR ASSUMPTION).
let seed = 1091; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const zNoisy = zStep.map((v) => +(v + 2 * gauss()).toFixed(2));
const seg = segments(cRef, zNoisy, 12, 2);
const seg1 = segments(cRef, zNoisy, 12, 1);
const segOut = seg.fits.map((f) => ({ from: f.from, to: f.to, ksn: r(f.slope * A0 ** TREF, 2) }));
const breakAt = seg.breaks.map((b) => ({ node: b, chi: r(cRef[b], 1), chiTrue: r(KB, 1), kmUpstream: r(base.x[b] / 1000, 2), z: r(zStep[b], 1) }));
const seg1Out = { breaks: seg1.breaks.map((b) => ({ chi: r(cRef[b], 2), kmUpstream: r(base.x[b] / 1000, 2) })), ksn: seg1.fits.map((f) => r(f.slope * A0 ** TREF, 2)) };
const stepBest = bestTheta(stepProf, A0);

// 2. A channel whose real concavity is 0.36, read with theta_ref = 0.45, in two basins of different size.
const low = (scale) => {
  const p = synthetic(N, L, KA * scale, H, KSN.mean, THETA_LOW, Math.round((ACRIT / (KA * scale)) ** (1 / H)));
  const c45 = chi(p, TREF, A0), f45 = lsq(c45, p.z), c36 = chi(p, THETA_LOW, A0), f36 = lsq(c36, p.z);
  return { scale, outletKm2: r(p.A[0] / 1e6, 1), ksnAt45: r(f45.slope * A0 ** TREF, 2), r2At45: r(f45.r2, 4), ksAt36: r(f36.slope * A0 ** THETA_LOW, 2), bestTheta: bestTheta(p, A0).theta };
};
const sizes = [1, 10].map(low);
const sizeRatio = r(sizes[1].ksnAt45 / sizes[0].ksnAt45, 2);

// Figure 1: what the paper's ksn numbers look like as river profiles.
const km = base.x.map((v) => r(v / 1000, 2));
// Thin the series for the charts: every 4th node keeps every curve smooth and the SVG small.
const TH = base.x.map((_, i) => i).filter((i) => i % 4 === 0 || i === N - 1);
const thin = (a, n = 1) => TH.map((i) => r(a[i], n));
const fig1 = chart({
  title: 'Three channel steepnesses in the same catchment', xLabel: 'Distance upstream of the outlet (km)', yLabel: 'Elevation above the outlet (m)',
  series: [
    { name: `ksn 24 (regional mean)`, kind: 'line', x: thin(km, 2), y: thin(base.z) },
    { name: 'ksn 24 below, 72 above', kind: 'line', x: thin(km, 2), y: thin(zNoisy) },
    { name: 'ksn 40 (one standard deviation up)', kind: 'line', x: thin(km, 2), y: thin(cRef.map((c) => (KSN.mean + KSN.sd) * c)) },
  ],
  xDomain: [0, 20], yDomain: [0, 900],
  vlines: breakAt.map((b) => ({ x: b.kmUpstream, text: `knickpoint ${b.kmUpstream} km` })),
  desc: `Long profiles built from the paper's channel steepness values in one made-up 50 square kilometre catchment: a uniform ksn of 24, a profile with a knickpoint where ksn trebles, and a uniform ksn of 40. The uniform ksn 24 channel has ${relief(KSN.mean)} metres of relief.`, height: 300,
});

// Figure 2: the chi plot, where steepness is a straight-line slope and a knickpoint is a kink.
const fig2 = chart({
  title: 'χ plot: steepness is the slope of this line', xLabel: 'χ at θref 0.45 (m)', yLabel: 'Elevation above the outlet (m)',
  series: [
    { name: 'Uniform ksn 24', kind: 'line', x: thin(cRef, 2), y: thin(base.z) },
    { name: 'With the knickpoint (2 m scatter)', kind: 'dots', size: 2, x: thin(cRef, 2), y: thin(zNoisy) },
    { name: 'True concavity 0.36, same relief', kind: 'line', x: thin(chi(p36, TREF, A0), 2), y: thin(z36), dash: '5 4' },
  ],
  xDomain: [0, Math.ceil(cRef[cRef.length - 1])], yDomain: [0, 900],
  vlines: breakAt.map((b) => ({ x: b.chi, text: `χ ${b.chi}` })),
  desc: 'Elevation against chi for the same channels. A uniform steepness plots as a straight line through the outlet, a knickpoint as a kink, and a channel whose real concavity is 0.36, scaled to the same relief, curves when it is plotted at a reference concavity of 0.45.', height: 300,
});

console.log(JSON.stringify({
  dHead, areas, chiTotal: r(cRef[cRef.length - 1], 2),
  fitted: { ksn: r(fit.slope * A0 ** TREF, 4), r2: r(fit.r2, 6), bestTheta: bt.theta, bestR2: r(bt.r2, 6) },
  slopeArea: { theta: r(sa.fit.theta, 4), ks: r(sa.fit.ks, 4), bins: sa.bins.length, r2: r(sa.fit.r2, 4) },
  relief: { mean: relief(KSN.mean), plusSd: relief(KSN.mean + KSN.sd), max: relief(KSN.max), ratio: r(KSN.max / KSN.mean, 1) },
  knick: { chiTrue: r(KB, 2), breaks: breakAt, segments: segOut, oneBreak: seg1Out, bestTheta: stepBest.theta },
  concavity: { sizes, sizeRatio },
  paste: base.x.map((_, i) => i).filter((i) => i % 24 === 0 || i === N - 1).map((i) => `${r(base.x[i] / 1000, 3)}, ${r(base.z[i], 1)}, ${Math.round(base.A[i])}`),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'profiles', figure(fig1, 'Figure 1. The paper\'s channel steepness values drawn as long profiles in one made-up catchment (Hack\'s law geometry, our assumption), built with the Stream profile tool\'s χ integration. The dashed line marks the knickpoint the tool\'s segment fit finds.'));
  md = inject(md, 'chi', figure(fig2, 'Figure 2. The same channels in the χ plot the tool draws: a straight line for uniform steepness, a kink at a knickpoint, and a curve when the real concavity (0.36) differs from the reference concavity (0.45).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
