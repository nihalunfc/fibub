// Figures for the Nobel Prize in Physics 2026 series (src/blog/nobel/physics-2026-*.md), made with the maths of
// the fibub tools: Relativistic kinematics (src/lib/sci/phrel.ts), Counting statistics (phcount.ts), Scatter and
// best fit (fit.ts), Cosmology calculator (cosmo.ts) and stats.ts. Everything here is our own recomputation or
// simulation; the few published numbers used are named next to them.
// Run: node scripts/blog-figures/nobel-physics-2026.mjs   (rewrites the charts inside the three articles; --dry prints only)
import fs from 'node:fs';
import { fourFrom, describe, threshold, sqrtSFixed } from '../../src/lib/sci/phrel.ts';
import { netRate, gammaP } from '../../src/lib/sci/phcount.ts';
import { fitLine, levenbergMarquardt } from '../../src/lib/sci/fit.ts';
import { cosmology, presets, omegaR } from '../../src/lib/sci/cosmo.ts';
import { normInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const dry = process.argv.includes('--dry');
const art = (slug) => new URL(`../../src/blog/nobel/${slug}.md`, import.meta.url);
const put = (slug, figs) => { if (dry) return; const f = art(slug); let md = fs.readFileSync(f, 'utf8'); for (const [n, h] of Object.entries(figs)) md = inject(md, n, h); fs.writeFileSync(f, md); };
const log = (...a) => console.log(...a);
let seed = 2026; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const sigmaOf = (p) => (p < 0.5 ? normInv(1 - p) : 0);

// Masses (MeV), PDG rounded.
const ME = 0.51099895, MP = 938.27209, MN = 939.56542, MMU = 105.6584, MW = 80369;

// ---------- Part 1: the ghost particle and the ice telescope idea ----------
// (a) Inverse beta decay threshold, ν̄e + p → n + e⁺, with the Relativistic kinematics maths.
const ibd = threshold(0, MP, MN + ME);
log(`IBD threshold: ${ibd.E.toFixed(3)} MeV`);
// (b) Solar neutrino flux from the Sun's power: each 4p → He fusion gives 26.73 MeV and 2 neutrinos; about 0.6 MeV of it
// leaves as neutrino energy, so ≈ 26.1 MeV heats the Sun. Φ = 2 L / (26.1 MeV × 4π d²).
const L = 3.828e26, AU = 1.495978707e11, MeV = 1.602176634e-13;
const phi = (2 * L) / (26.1 * MeV * 4 * Math.PI * AU * AU) / 1e4;
log(`Solar neutrino flux at Earth: ${phi.toExponential(2)} per cm² per s`);
// (c) Cowan and Reines counted with the reactor on and off. With made-up but similar-sized rates (signal 3 per hour,
// background 1 per hour), how does the net-rate significance grow with counting time? Counting statistics maths.
const hrs = Array.from({ length: 60 }, (_, i) => 1 + i * 2);
const z = hrs.map((t) => { const nr = netRate((3 + 1) * t, t, 1 * t, t); return nr.net / nr.sd; });
log(`Reactor on/off: ${z[0].toFixed(1)}σ after 1 h, ${z[Math.floor(z.length / 2)].toFixed(1)}σ after ${hrs[Math.floor(z.length / 2)]} h`);
const figCount = figure(chart({
  title: 'Reactor on minus reactor off: how sure after t hours?', xLabel: 'Counting time with the reactor on (and as long off), hours', yLabel: 'Net rate ÷ its uncertainty (σ)',
  series: [{ name: 'Signal 3/h, background 1/h', x: hrs, y: z.map((v) => +v.toFixed(2)), kind: 'line' }],
  hlines: [{ y: 5, text: '5σ' }, { y: 3, text: '3σ' }], yDomain: [0, Math.ceil(Math.max(...z)) + 1],
  desc: 'The significance of the net counting rate grows like the square root of the counting time, passing 5 sigma after a few hours and 10 sigma after about a day.',
}), 'Made with the Counting statistics tool\'s maths (net rate and its uncertainty from gross and background counts). Rates are our own round numbers of the same size as the 1956 experiment\'s, not its data.');
// (d) Cherenkov angle against muon energy in ice and water: β from the Relativistic kinematics maths, cos θ = 1/(nβ).
const Es = Array.from({ length: 160 }, (_, i) => 150 + i * 6); // total energy, MeV
const ang = (n) => Es.map((E) => { const p = Math.sqrt(E * E - MMU * MMU); const b = describe(fourFrom(MMU, p, 0, 0)).beta; return n * b > 1 ? (Math.acos(1 / (n * b)) * 180) / Math.PI : NaN; });
const aIce = ang(1.31), aWater = ang(1.33);
const thr = (n) => MMU / Math.sqrt(1 - 1 / (n * n));
log(`Muon Cherenkov threshold: ice ${thr(1.31).toFixed(0)} MeV, water ${thr(1.33).toFixed(0)} MeV; max angle ice ${((Math.acos(1 / 1.31) * 180) / Math.PI).toFixed(1)}°`);
const figCher = figure(chart({
  title: 'Cherenkov angle of a muon', xLabel: 'Muon total energy (MeV)', yLabel: 'Angle to the path (degrees)',
  series: [{ name: 'Ice, n = 1.31', x: Es, y: aIce.map((v) => (Number.isFinite(v) ? +v.toFixed(2) : NaN)), kind: 'line' }, { name: 'Water, n = 1.33', x: Es, y: aWater.map((v) => (Number.isFinite(v) ? +v.toFixed(2) : NaN)), kind: 'line', dash: '5 4' }],
  yDomain: [0, 45], xDomain: [150, 1100], hlines: [{ y: 40.2, text: 'ice limit 40.2°' }],
  desc: 'Below about 160 MeV a muon makes no Cherenkov light in ice; above a few hundred MeV the angle settles near 40 degrees in ice and 41 in water.',
}), 'Speeds from the Relativistic kinematics tool\'s maths (muon mass 105.66 MeV), angle from cos θ = 1/(nβ). Real ice and water refractive indices depend on wavelength; 1.31 and 1.33 are round values.');
put('physics-2026-neutrinos-cherenkov-ice', { 'reines-count': figCount, 'cherenkov-angle': figCher });

// ---------- Part 2: building IceCube and the first cosmic neutrinos ----------
// (a) A simulated muon track: photon arrival times at sensors along the track, with 3 ns timing spread and a scattering
// delay. Fit time against distance with the Scatter and best fit maths: the slope gives the muon's speed.
const pos = [], tim = [];
for (let i = 0; i < 60; i++) { const s = -500 + rnd() * 1000; const delay = -8 * Math.log(rnd() + 1e-9) * (rnd() < 0.7 ? 0.2 : 1); pos.push(+s.toFixed(1)); tim.push(+(s / 0.2998 + 3 * gauss() + delay).toFixed(1)); }
const lf = fitLine(pos, tim);
const v = 1 / lf.slope;
log(`Track fit: speed ${v.toFixed(4)} ± ${(lf.seSlope / lf.slope / lf.slope).toFixed(4)} m/ns (c = 0.2998)`);
const figTrack = figure(chart({
  title: 'A simulated muon: hit time against position along the track', xLabel: 'Position along the track (m)', yLabel: 'Hit time (ns)',
  series: [{ name: 'Sensor hits (simulated)', x: pos, y: tim, kind: 'dots', size: 3 }, { name: `Fit: speed ${v.toFixed(3)} m/ns`, x: [-520, 520], y: [lf.intercept - 520 * lf.slope, lf.intercept + 520 * lf.slope].map((t) => +t.toFixed(1)), kind: 'line' }],
  desc: 'Hit times rise in a straight line with position; the fitted slope gives a speed within a few percent of the speed of light, 0.300 metres per nanosecond.',
}), 'Simulated with our own numbers (60 hits, 3 ns timing spread, scattering delays) and fitted with the Scatter and best fit tool\'s least-squares line. Late, scattered photons pull the fit only slightly; IceCube\'s real reconstruction models them in full.');
// (b) Two power laws: atmospheric (index 3.7) and cosmic (index 2.5), equal at 100 TeV. Draw 20,000 simulated events,
// bin them, and fit the slopes back from the counts at low and high energy.
const draw = (g, lo, hi) => { const a = 1 - g, u = rnd(); return (lo ** a + u * (hi ** a - lo ** a)) ** (1 / a); }; // inverse CDF, TeV
const lo = 10, hi = 10000, norm = (g) => (lo ** (1 - g) - hi ** (1 - g)) / (g - 1) * 100 ** g; // ∫ (E/100)^-g dE
const fAtm = norm(3.7) / (norm(3.7) + norm(2.5));
const evs = Array.from({ length: 200000 }, () => (rnd() < fAtm ? draw(3.7, lo, hi) : draw(2.5, lo, hi)));
const edges = Array.from({ length: 16 }, (_, i) => 1 + i * 0.2); // log10 TeV from 1 to 4
const bx = [], by = [];
for (let i = 0; i < edges.length - 1; i++) { const a = 10 ** edges[i], b = 10 ** edges[i + 1]; const n = evs.filter((e) => e >= a && e < b).length; if (n > 0) { bx.push(+((edges[i] + edges[i + 1]) / 2).toFixed(2)); by.push(+Math.log10(n / (b - a)).toFixed(3)); } }
const fitLow = fitLine(bx.filter((x) => x < 1.7), by.filter((_, i) => bx[i] < 1.7));
const fitHigh = fitLine(bx.filter((x) => x > 2.9), by.filter((_, i) => bx[i] > 2.9));
// Joint fit of both components at once (Levenberg-Marquardt, the method the Curve fitter uses): log10(a·E^-g1 + b·E^-g2).
const joint = levenbergMarquardt((x, p) => Math.log10(10 ** (p[0] - p[1] * x) + 10 ** (p[2] - p[3] * x)), bx, by, [6, 3.5, 4, 2.2]);
log(`Joint fit: slopes ${joint.p[1].toFixed(2)} ± ${joint.se[1].toFixed(2)} and ${joint.p[3].toFixed(2)} ± ${joint.se[3].toFixed(2)}`);
log(`Spectrum fit: low-energy slope ${fitLow.slope.toFixed(2)}, high-energy slope ${fitHigh.slope.toFixed(2)} (input 3.7 and 2.5); atmospheric share ${(fAtm * 100).toFixed(1)}%`);
const line = (f, x0, x1) => ({ x: [x0, x1], y: [f.intercept + f.slope * x0, f.intercept + f.slope * x1].map((v) => +v.toFixed(3)) });
const figSpec = figure(chart({
  title: 'Two kinds of neutrino in one spectrum (simulated)', xLabel: 'Neutrino energy (TeV, log scale)', yLabel: 'Events per TeV (log scale)',
  series: [{ name: '200,000 simulated events', x: bx, y: by, kind: 'dots', size: 3.5 }, { name: `Low-energy fit: slope −${(-fitLow.slope).toFixed(2)}`, ...line(fitLow, 1, 2.2), kind: 'line' }, { name: `High-energy fit: −${(-fitHigh.slope).toFixed(2)}`, ...line(fitHigh, 2.2, 4), kind: 'line', dash: '5 4' }, { name: `Joint fit: −${joint.p[1].toFixed(2)} and −${joint.p[3].toFixed(2)}`, x: bx, y: bx.map((x) => +Math.log10(10 ** (joint.p[0] - joint.p[1] * x) + 10 ** (joint.p[2] - joint.p[3] * x)).toFixed(3)), kind: 'line', dash: '2 3' }],
  xTicks: [1, 2, 3, 4], xFmt: (v) => String(10 ** v), yFmt: (v) => `10^${v}`,
  desc: 'On log scales the counts fall on two straight lines: a steep one at low energy (atmospheric) and a flatter one at high energy (cosmic). Fitting each part recovers the slopes put in.',
}), 'Our simulation of 200,000 events: atmospheric-like events with slope −3.7 and cosmic-like events with slope −2.5, set equal at 100 TeV, then binned. Straight-line fits to each end (Scatter and best fit maths) come out a little off because the two kinds overlap; a joint two-component fit by Levenberg-Marquardt least squares (the method the Curve fitter uses) gets both slopes back. It shows the method, not IceCube data.');
// (c) The 2013 result: 28 events where backgrounds predicted about 10.6 (IceCube Collaboration, Science 342, 1242856).
// Plain Poisson, ignoring the background's own uncertainty: P(N ≥ 28 | 10.6).
const B = 10.6, Nobs = 28, p13 = gammaP(Nobs, B);
log(`2013: P(N ≥ 28 | 10.6) = ${p13.toExponential(2)} → ${sigmaOf(p13).toFixed(1)}σ (paper, with background uncertainties: 4.1σ)`);
const ks = Array.from({ length: 36 }, (_, k) => k);
const pmf = ks.map((k) => Math.exp(-B + k * Math.log(B) - lgam(k + 1)));
function lgam(x) { let s = 0; for (let i = 2; i < x; i++) s += Math.log(i); return s; }
const figPois = figure(chart({
  title: 'If only background: how many events in two years?', xLabel: 'Number of events', yLabel: 'Chance (%)',
  series: [{ name: 'Poisson, mean 10.6', x: ks, y: pmf.map((p) => +(100 * p).toFixed(3)), kind: 'step' }],
  vlines: [{ x: 28, text: '28 seen', left: true }, { x: 10.6, text: 'expected 10.6' }],
  desc: 'The background-only Poisson distribution peaks near 10 and is almost zero by 28, where the observed count sits.',
}), `Counting statistics maths: with a background of 10.6 the chance of 28 or more is ${p13.toExponential(1)} (about ${sigmaOf(p13).toFixed(1)}σ). The published 4.1σ is lower because the background itself was uncertain (+5.0/−3.6 events), which a fair test must include.`);
put('physics-2026-icecube-cosmic-neutrinos', { 'track-fit': figTrack, 'two-spectra': figSpec, 'poisson-2013': figPois });

// ---------- Part 3: blazars, a resonance, galaxies and the Milky Way ----------
// (a) Glashow resonance: ν̄e + e⁻ → W⁻ needs √s = m_W. Fixed-target threshold with the electron at rest.
const gl = threshold(0, ME, MW);
log(`Glashow resonance: E = ${(gl.E / 1e9).toFixed(2)} PeV`);
const Eg = Array.from({ length: 81 }, (_, i) => 10 ** (5 + i * 0.05)); // MeV: 100 GeV to 1 EeV
const figGl = figure(chart({
  title: 'Collision energy of an antineutrino hitting an electron at rest', xLabel: 'Antineutrino energy (log scale)', yLabel: '√s (GeV, log scale)',
  series: [{ name: '√s = √(2 E mₑ)', x: Eg.map((E) => +Math.log10(E).toFixed(3)), y: Eg.map((E) => +Math.log10(sqrtSFixed(0, E, ME) / 1000).toFixed(4)), kind: 'line' }],
  hlines: [{ y: Math.log10(MW / 1000), text: 'W boson mass, 80.4 GeV' }], vlines: [{ x: Math.log10(gl.E), text: `${(gl.E / 1e9).toFixed(1)} PeV`, left: true }],
  xTicks: [5, 6, 7, 8, 9, 10, 11, 12], xFmt: (v) => ({ 5: '100 GeV', 6: '1 TeV', 7: '10 TeV', 8: '100 TeV', 9: '1 PeV', 10: '10 PeV', 11: '100 PeV', 12: '1 EeV' })[v] ?? '', yTicks: [-1, 0, 1, 2, 3], yFmt: (v) => String(10 ** v),
  desc: 'The collision energy grows as the square root of the neutrino energy and reaches the W boson mass at about 6.3 PeV.',
}), 'Relativistic kinematics tool\'s fixed-target formula (electron at rest, W mass 80.37 GeV). The resonance needs a 6.3 PeV electron antineutrino: IceCube saw one event there, from December 2016, published in Nature in 2021.');
// (b) How far: lookback times with the Cosmology calculator (Planck 2018 values).
const c18 = { H0: presets.planck18.H0, Om: presets.planck18.Om, Or: omegaR(presets.planck18.H0) }; c18.OL = 1 - c18.Om - c18.Or;
const zs = Array.from({ length: 81 }, (_, i) => i * 0.01);
const lb = zs.map((z) => (z === 0 ? 0 : cosmology(c18, z).lookback));
const txs = cosmology(c18, 0.3365), n1068 = cosmology(c18, 0.00379);
log(`TXS 0506+056 (z = 0.3365): light travel ${txs.lookback.toFixed(2)} Gyr; NGC 1068 (z = 0.00379): ${(n1068.lookback * 1000).toFixed(0)} Myr, comoving ${n1068.dc.toFixed(1)} Mpc`);
const figDist = figure(chart({
  title: 'How long the neutrinos travelled', xLabel: 'Redshift z', yLabel: 'Light-travel time (billion years)',
  series: [{ name: 'Planck 2018 universe', x: zs, y: lb.map((v) => +v.toFixed(3)), kind: 'line' }, { name: 'Sources', x: [0.00379, 0.3365], y: [n1068.lookback, txs.lookback].map((v) => +v.toFixed(3)), kind: 'dots', size: 5, noLegend: true }],
  vlines: [{ x: 0.3365, text: `TXS 0506+056: ${txs.lookback.toFixed(1)} billion years`, left: true }, { x: 0.00379, text: `NGC 1068: ${Math.round(n1068.lookback * 1000)} million years`, dy: 16 }],
  desc: 'Light-travel time rises almost linearly at small redshift; the blazar TXS 0506+056 at redshift 0.34 sits near 3.9 billion years, the galaxy NGC 1068 at about 55 million years.',
}), 'Cosmology calculator maths (Planck 2018: H₀ = 67.66, Ωm = 0.311). Redshifts: TXS 0506+056 z = 0.3365 (Paiano et al. 2018); NGC 1068 z ≈ 0.0038. For a galaxy this close its own motion matters, so its distance is better taken from other methods (about 14 Mpc, or 47 million light-years).');
// (c) Why sources take a decade: expected significance against years of data for a steady weak source in a fixed
// background, using the Poisson tail (counts set to their expected values).
const yrs = Array.from({ length: 15 }, (_, i) => i + 1);
const sig = (sPerYr, bPerYr) => yrs.map((t) => { const b = bPerYr * t, n = Math.round(b + sPerYr * t); return +sigmaOf(gammaP(n, b)).toFixed(2); });
const figYears = figure(chart({
  title: 'Years of data needed to see a steady source', xLabel: 'Years of data', yLabel: 'Expected significance (σ)',
  series: [{ name: '8 per year over 60 background', x: yrs, y: sig(8, 60), kind: 'line' }, { name: '4 per year over 60', x: yrs, y: sig(4, 60), kind: 'line', dash: '5 4' }, { name: '8 per year over 15', x: yrs, y: sig(8, 15), kind: 'line', dash: '2 3' }],
  hlines: [{ y: 5, text: '5σ' }, { y: 4.2, text: '4.2σ (NGC 1068, 2022)' }], yDomain: [0, 10],
  desc: 'Significance grows like the square root of time. A source giving 8 extra neutrinos a year over a background of 60 reaches only about 3 sigma after a decade and nears 4 sigma after 15 years; with a quarter of the background it passes 4 sigma in about five years.',
}), 'Our own illustration with the Counting statistics tool\'s Poisson maths: counts set to their expected values, one search spot, no trials penalty. Rates are round numbers, chosen near the scale of the NGC 1068 search (about 79 extra events over roughly a decade).');
put('physics-2026-neutrino-sources', { glashow: figGl, distances: figDist, 'years-needed': figYears });
