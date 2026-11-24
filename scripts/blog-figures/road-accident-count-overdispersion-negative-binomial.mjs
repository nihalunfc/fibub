// Figures for src/blog/discoveries/road-accident-count-overdispersion-negative-binomial.md, made with the maths of the
// Probability distribution explorer (src/lib/sci/distributions.ts: the Poisson, negative binomial and chi-squared pmf,
// cdf, survival function and moments).
// Run: node scripts/blog-figures/road-accident-count-overdispersion-negative-binomial.mjs
import fs from 'node:fs';
import { DIST } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/road-accident-count-overdispersion-negative-binomial.md', import.meta.url);
const NB = DIST.nbinom, PO = DIST.poisson, CHI2 = DIST.chi2;

// From the paper (Newaz, Tabassum, Das, Huq and Haque 2026, PLOS ONE 21(2): e0341775, CC BY 4.0), running text only:
// negative-binomial dispersion parameters 4.306 (fatalities, dataset 1), 0.6065 (injuries, dataset 1),
// 1.5665 (fatalities, dataset 2) and 0.1499 (injuries, dataset 2); AIC 27731.65 (Poisson) against 27467.61 (NB) on
// dataset 1 and 23668.28 against 23286.36 on dataset 2.
const THETA = [{ k: 4.306, label: 'θ = 4.31', what: 'fatalities, set 1' }, { k: 1.5665, label: 'θ = 1.57', what: 'fatalities, set 2' }, { k: 0.6065, label: 'θ = 0.607', what: 'injuries, set 1' }, { k: 0.1499, label: 'θ = 0.150', what: 'injuries, set 2' }];
const AIC = [{ what: 'fatalities, dataset 1', pois: 27731.65, nb: 27467.61 }, { what: 'fatalities, dataset 2', pois: 23668.28, nb: 23286.36 }];

// A negative binomial with mean mu and dispersion theta (variance mu + mu^2/theta) is the tool's nbinom
// with r = theta and p = theta / (theta + mu).
const nbPar = (mu, th) => ({ r: th, p: th / (th + mu) });
// An AIC gap between two nested models that differ by one parameter is a likelihood-ratio statistic of gap + 2.
const lr = (a) => a.pois - a.nb + 2;
const lrP = (a) => CHI2.sf(lr(a), { k: 1 });

const MUS = Array.from({ length: 57 }, (_, i) => 0.2 + i * 0.05); // mean counts from 0.2 to 3.0
const tail = (mu, th) => (th === null ? PO.sf(4, { lambda: mu }) : NB.sf(4, nbPar(mu, th))); // P(X >= 5)

const fig1 = chart({
  title: 'Chance of 5 or more in one record', xLabel: 'Mean count per record', yLabel: 'P(X ≥ 5)',
  series: [
    { name: 'Poisson', kind: 'line', x: MUS, y: MUS.map((m) => Math.log10(tail(m, null))), colour: 'var(--muted)', dash: '5 4' },
    ...THETA.map((t, i) => ({ name: t.label, kind: 'line', x: MUS, y: MUS.map((m) => Math.log10(tail(m, t.k))), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--c-learn)'][i] })),
  ],
  xDomain: [0.2, 3], yDomain: [-5, 0], yTicks: [-5, -4, -3, -2, -1, 0], yFmt: (v) => (v === 0 ? '1' : `10${['⁻⁵', '⁻⁴', '⁻³', '⁻²', '⁻¹'][v + 5] ?? ''}`),
  desc: 'The probability of five or more casualties in one record, against the mean count, for a Poisson distribution and for negative binomials with the four dispersion parameters the paper reports. At a mean of 1 the Poisson gives 0.0037 and the most dispersed negative binomial 0.069.',
  height: 280,
});

const KS = Array.from({ length: 9 }, (_, k) => k);
const MU1 = 1; // our assumption: a mean of one casualty per record, for the shape comparison
const fig2 = chart({
  title: 'Same mean of 1, very different shapes', xLabel: 'Count in one record, k', yLabel: 'P(X = k)',
  series: [
    { name: 'Poisson', kind: 'dots', x: KS, y: KS.map((k) => PO.pdf(k, { lambda: MU1 })), size: 4, colour: 'var(--muted)' },
    { name: 'θ = 4.31', kind: 'dots', x: KS, y: KS.map((k) => NB.pdf(k, nbPar(MU1, 4.306))), size: 4 },
    { name: 'θ = 0.150', kind: 'dots', x: KS, y: KS.map((k) => NB.pdf(k, nbPar(MU1, 0.1499))), size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [-0.3, 8.3], xTicks: KS, yDomain: [0, 0.8],
  desc: 'Probability of each count from 0 to 8 for three distributions that all have a mean of 1: a Poisson, a negative binomial with dispersion 4.31 and one with dispersion 0.150. The dispersed ones put more weight on zero and on the far tail.',
  height: 260,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'tail', figure(fig1, `Figure 1. Worked out with the Probability distribution explorer's own Poisson and negative-binomial survival functions, at the four dispersion parameters the paper reports. The vertical scale is logarithmic. The gap between Poisson and negative binomial is small near the mean and large in the tail, which is where multi-casualty crashes live.`));
md = inject(md, 'pmf', figure(fig2, `Figure 2. The same three distributions at a mean of 1 casualty per record (a mean is not reported in the paper, so this is our choice). More weight on zero and more weight past 5, with the middle thinned out.`));
fs.writeFileSync(ART, md);

for (const a of AIC) console.log(`${a.what}: AIC gap ${(a.pois - a.nb).toFixed(2)} -> likelihood ratio ${lr(a).toFixed(2)} on 1 df, p = ${lrP(a).toExponential(3)}`);
console.log('at a mean of 1 per record:');
console.log(`  Poisson: variance 1, P(0) ${PO.pdf(0, { lambda: 1 }).toFixed(4)}, P(X>=2) ${PO.sf(1, { lambda: 1 }).toFixed(4)}, P(X>=5) ${PO.sf(4, { lambda: 1 }).toExponential(3)}`);
for (const t of THETA) {
  const p = nbPar(1, t.k), m = NB.moments(p);
  console.log(`  ${t.label} (${t.what}): r ${p.r}, p ${p.p.toPrecision(6)}, variance ${m.variance.toFixed(3)}, sd ${Math.sqrt(m.variance).toFixed(3)}, P(0) ${NB.pdf(0, p).toFixed(4)}, P(X>=2) ${NB.sf(1, p).toFixed(4)}, P(X>=5) ${NB.sf(4, p).toExponential(3)} (${(NB.sf(4, p) / PO.sf(4, { lambda: 1 })).toFixed(1)}x Poisson)`);
}
console.log('the two conventions at a mean of 2, parameter 0.1499:');
console.log(`  variance mu + mu^2/theta = ${(2 + 4 / 0.1499).toFixed(2)} (sd ${Math.sqrt(2 + 4 / 0.1499).toFixed(2)}); variance mu(1 + alpha*mu) = ${(2 * (1 + 0.1499 * 2)).toFixed(2)} (sd ${Math.sqrt(2 * (1 + 0.1499 * 2)).toFixed(2)})`);
console.log(`  and at a mean of 2, parameter 4.306: theta reading ${(2 + 4 / 4.306).toFixed(2)}, alpha reading ${(2 * (1 + 4.306 * 2)).toFixed(2)}`);
