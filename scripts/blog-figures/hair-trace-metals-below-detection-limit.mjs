// Figures for src/blog/discoveries/hair-trace-metals-below-detection-limit.md, made with the maths of the
// Non-detect statistics tool (src/lib/sci/censored.ts: kaplanMeier, ros, mleLognormal, substitute, percentile).
// Run: node scripts/blog-figures/hair-trace-metals-below-detection-limit.mjs
import fs from 'node:fs';
import { kaplanMeier, ros, mleLognormal, substitute, percentile } from '../../src/lib/sci/censored.ts';
import { normInv, normCdf } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hair-trace-metals-below-detection-limit.md', import.meta.url);

// Values from the paper (Pena-Fernandez et al. 2026, Toxics 14(3): 268, CC BY 4.0): hair from 120 children and
// 97 adolescents; limits of detection and the share of results below them; medians and 95th percentiles in µg/g.
const G = [
  { id: 'Barium, children', n: 120, lod: 0.124, below: 0.383, med: 0.193, p95: 0.629, q3: 0.350 },
  { id: 'Barium, adolescents', n: 97, lod: 0.153, below: 0.351, med: 0.287, p95: 2.061, q3: 0.948 },
  { id: 'Strontium, children', n: 120, lod: 0.187, below: 0.233, med: 0.412, p95: 2.155, q3: 0.894 },
  { id: 'Vanadium, children', n: 120, lod: 0.02, below: 0.742, med: 0.003, p95: 0.428, q3: 0.0235 },
];
const z95 = normInv(0.95), z75 = normInv(0.75);
// A log-normal has two numbers; the paper reports three (median, 95th percentile, share below the limit). Fit two
// of them and see what the third comes out as.
const fit = (g) => {
  const mu = Math.log(g.med), sTail = Math.log(g.p95 / g.med) / z95, sQ3 = Math.log(g.q3 / g.med) / z75;
  const belowTail = normCdf((Math.log(g.lod) - mu) / sTail), belowQ3 = normCdf((Math.log(g.lod) - mu) / sQ3);
  const sCens = (Math.log(g.lod) - mu) / normInv(g.below);           // the sigma that reproduces the censored share
  return { ...g, mu, sTail, sQ3, sCens, belowTail, belowQ3, p95FromCens: Math.exp(mu + sCens * z95) };
};
const F = G.map(fit);

// Figure 1: children's barium. Two log-normals, each matching two of the paper's three facts.
const ba = F[0];
const xs = Array.from({ length: 121 }, (_, k) => -1.6 + k * 0.02); // log10 of the concentration
const cdf = (s) => xs.map((lx) => +(100 * normCdf((Math.log(10 ** lx) - ba.mu) / s)).toFixed(3));
const fig1 = chart({
  title: 'Children’s hair barium: two log-normals, three facts', xLabel: 'Barium in hair (µg/g, log scale)', yLabel: 'Results at or below (%)',
  series: [
    { name: 'matches the median and 95th percentile', kind: 'line', x: xs, y: cdf(ba.sTail) },
    { name: 'matches the median and the 38.3 % below', kind: 'line', x: xs, y: cdf(ba.sCens) },
    { name: '', noLegend: true, kind: 'dots', x: [Math.log10(ba.med), Math.log10(ba.p95), Math.log10(ba.lod)], y: [50, 95, 38.3], size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [-1.6, 0.8], yDomain: [0, 100], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  vlines: [{ x: Math.log10(ba.lod), text: 'limit of detection' }],
  desc: 'Two log-normal curves through the paper\'s reported barium figures for children. One matches the median and the 95th percentile but puts only 26.9 per cent below the detection limit; the other matches the 38.3 per cent censored but then predicts a 95th percentile of 2.2 µg/g.', height: 290,
});

// Figure 2: how each method's estimate of the MEAN behaves as the censored share grows.
// Simulated log-normal data with the barium shape (median 0.193, sigma 0.718), n = 120, 300 draws per level.
const MU = ba.mu, SIG = ba.sTail, TRUE = Math.exp(MU + (SIG * SIG) / 2);
let seed = 268;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const shares = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7];
const KINDS = ['km', 'ros', 'mle', 'half', 'zero', 'full'];
const curves = Object.fromEntries(KINDS.map((k) => [k, []]));
const REPS = 300, N = 120;
for (const q of shares) {
  const lod = Math.exp(MU + SIG * normInv(q));
  const acc = Object.fromEntries(KINDS.map((k) => [k, 0]));
  for (let r = 0; r < REPS; r++) {
    const obs = Array.from({ length: N }, () => { const v = Math.exp(MU + SIG * gauss()); return v < lod ? { v: lod, nd: true } : { v, nd: false }; });
    acc.km += kaplanMeier(obs).mean; acc.ros += ros(obs).mean; acc.mle += mleLognormal(obs).mean;
    acc.half += substitute(obs, 0.5).mean; acc.zero += substitute(obs, 0).mean; acc.full += substitute(obs, 1).mean;
  }
  for (const k of KINDS) curves[k].push(+((100 * acc[k]) / REPS / TRUE).toFixed(2));
}
const xpc = shares.map((s) => 100 * s);
const fig2 = chart({
  title: 'Estimates of the mean, as more results go below the limit', xLabel: 'Results below the detection limit (%)', yLabel: 'Estimated mean ÷ true mean (%)',
  series: [
    { name: 'half the limit', kind: 'line', x: xpc, y: curves.half, colour: 'var(--ink)', dash: '2 3' },
    { name: 'zero', kind: 'line', x: xpc, y: curves.zero, colour: 'var(--muted)' },
    { name: 'Kaplan–Meier', kind: 'line', x: xpc, y: curves.km, colour: 'var(--c-blog)' },
    { name: 'ROS', kind: 'line', x: xpc, y: curves.ros, colour: 'var(--c-tools)' },
  ],
  xDomain: [5, 70], yDomain: [70, 130], hlines: [{ y: 100, text: 'the true mean' }],
  desc: 'Mean of 300 simulated sets of 120 log-normal results each. Substituting zero loses 40 per cent of the mean by 70 per cent censoring, Kaplan-Meier drifts 37 per cent high, and ROS and maximum likelihood stay within about 1 per cent.', height: 300,
});

// One worked dataset at the paper's own censored share, for the article's table and the Check it yourself steps.
seed = 1268;
const lod = ba.lod;
const one = Array.from({ length: N }, () => { const v = Math.exp(MU + SIG * gauss()); return v < lod ? { v: lod, nd: true } : { v, nd: false }; });
const km = kaplanMeier(one), rr = ros(one), ml = mleLognormal(one);
const nd = one.filter((o) => o.nd).length;

// A small set a reader can paste into the tool: 24 results, rounded to 3 decimals, same log-normal, same limit.
seed = 8;
const paste = Array.from({ length: 24 }, () => { const v = Math.exp(MU + SIG * gauss()); return v < lod ? `<${lod}` : (+v.toFixed(3)).toString(); });
const pObs = paste.map((t) => (t.startsWith('<') ? { v: lod, nd: true } : { v: Number(t), nd: false }));
const pKm = kaplanMeier(pObs), pRos = ros(pObs), pMle = mleLognormal(pObs);

// Vanadium in children: 74.2 % below the limit, so Kaplan-Meier cannot reach the median at all.
seed = 742;
const V = F[3], sV = V.sTail;
const vObs = Array.from({ length: N }, () => { const v = Math.exp(Math.log(V.med) + sV * gauss()); return v < V.lod ? { v: V.lod, nd: true } : { v, nd: false }; });
const vKm = kaplanMeier(vObs), vMl = mleLognormal(vObs), vRos = ros(vObs);

console.log(JSON.stringify({
  fits: F.map((f) => ({ id: f.id, sigmaTail: +f.sTail.toFixed(4), sigmaQ3: +f.sQ3.toFixed(4), sigmaCens: +f.sCens.toFixed(4), belowTailPc: +(100 * f.belowTail).toFixed(1), belowQ3Pc: +(100 * f.belowQ3).toFixed(1), reportedPc: 100 * f.below, p95FromCens: +f.p95FromCens.toFixed(3) })),
  trueMean: +TRUE.toFixed(4),
  curves, shares,
  one: {
    nd, pcNd: +(100 * nd / N).toFixed(1), kmMean: +km.mean.toFixed(4), kmSe: +km.se.toFixed(4), kmMedian: km.q(0.5), kmP95: km.q(0.95),
    rosMean: +rr.mean.toFixed(4), rosMedian: +percentile(rr.values, 0.5).toFixed(4), rosP95: +percentile(rr.values, 0.95).toFixed(4),
    mleMean: +ml.mean.toFixed(4), mleMedian: +ml.median.toFixed(4), mleP95: +ml.q(0.95).toFixed(4),
    halfMean: +substitute(one, 0.5).mean.toFixed(4), zeroMean: +substitute(one, 0).mean.toFixed(4), fullMean: +substitute(one, 1).mean.toFixed(4),
    ucl: +(km.mean + 1.6577 * km.se).toFixed(4),
    firstTen: one.slice(0, 10).map((o) => (o.nd ? '<' + o.v : +o.v.toFixed(3))),
  },
  paste: {
    text: paste.join(' '), nd: pObs.filter((o) => o.nd).length,
    kmMean: +pKm.mean.toFixed(4), kmSe: +pKm.se.toFixed(4), kmMedian: pKm.q(0.5), kmP95: pKm.q(0.95),
    ucl: +(pKm.mean + 1.7139 * pKm.se).toFixed(4),
    rosMean: +pRos.mean.toFixed(4), rosSd: +pRos.sd.toFixed(4), rosMedian: +percentile(pRos.values, 0.5).toFixed(4), rosP95: +percentile(pRos.values, 0.95).toFixed(4),
    mleMean: +pMle.mean.toFixed(4), mleMedian: +pMle.median.toFixed(4), mleP95: +pMle.q(0.95).toFixed(4),
    halfMean: +substitute(pObs, 0.5).mean.toFixed(4), zeroMean: +substitute(pObs, 0).mean.toFixed(4),
  },
  vanadium: { nd: vObs.filter((o) => o.nd).length, kmMedian: vKm.q(0.5), kmLeftover: +vKm.leftover.toFixed(3), mleMedian: +vMl.median.toFixed(4), rosMedian: +percentile(vRos.values, 0.5).toFixed(4), mleMean: +vMl.mean.toFixed(4), kmMean: +vKm.mean.toFixed(4) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lognormal', figure(fig1, 'Figure 1. The paper\'s three published facts about barium in children\'s hair (dots: the median, the 95th percentile and the share below the detection limit) with the two log-normal curves that each match two of them. No single log-normal matches all three.'));
  md = inject(md, 'methods', figure(fig2, 'Figure 2. Simulated data, not the paper\'s: 300 sets of 120 log-normal results at each censored share, each summarised by the Non-detect statistics tool\'s own methods. Substitution rules drift as censoring grows; Kaplan-Meier and ROS do not.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
