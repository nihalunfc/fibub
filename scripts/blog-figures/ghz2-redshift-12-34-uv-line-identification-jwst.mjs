// Figures for src/blog/discoveries/ghz2-redshift-12-34-uv-line-identification-jwst.md, made with the maths of the
// Spectral line identifier (src/lib/sci/speclines.ts: the NIST line list, identify and findRedshift) and the
// Cosmology calculator (src/lib/sci/cosmo.ts) for the age at that redshift.
// Run: node scripts/blog-figures/ghz2-redshift-12-34-uv-line-identification-jwst.mjs
import fs from 'node:fs';
import { SPEC_LINES, restIn, identify, findRedshift } from '../../src/lib/sci/speclines.ts';
import { cosmology, omegaR } from '../../src/lib/sci/cosmo.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ghz2-redshift-12-34-uv-line-identification-jwst.md', import.meta.url);
const Z = 12.34, SETS = ['quasar', 'nebular', 'stellar'], MED = 'vac';
const NIRSPEC = [0.6, 5.3]; // micrometres, the NIRSpec range
const rest = (name, set) => { const l = SPEC_LINES.find((x) => x.name === name && (!set || x.set === set)); return restIn(l, MED); };

// The lines the paper names, plus the rest-optical diagnostics that a lower-redshift galaxy would be judged on.
const UV = [['Lyman α', 'quasar'], ['N V', 'quasar'], ['C IV', 'quasar'], ['He II', 'quasar'], ['C III]', 'quasar'], ['Mg II', 'quasar']];
const OPT = [['[O II] doublet (blended)', 'nebular'], ['Hβ', 'stellar'], ['[O III]', null], ['Hα', 'stellar'], ['[S II]', 'nebular']];
const lineRows = [...UV, ...OPT].map(([n, s]) => { const r = s === null ? 5008.24 : rest(n, s); return { name: n, rest: +r.toFixed(2), obs: +((r * (1 + Z)) / 1e4).toFixed(4), inBand: (r * (1 + Z)) / 1e4 >= NIRSPEC[0] && (r * (1 + Z)) / 1e4 <= NIRSPEC[1] }; });

// The two lines the paper measures, and the same two with Lyman alpha added.
const OBS2 = [rest('C IV', 'quasar'), rest('C III]', 'quasar')].map((r) => r * (1 + Z));
const OBS3 = [rest('Lyman α', 'quasar') * (1 + Z), ...OBS2];
const cands = (obs, tol) => findRedshift(obs, SETS, -0.01, 13, 4e-4 + tol / 6000, MED).map((c) => ({ z: +c.z.toFixed(4), n: c.n, lines: c.lines.join(' + ') }));

// The C IV doublet, and what resolving power it takes to split it at this redshift.
const DOUBLET = [1548.19, 1550.77].map((a) => a * (1 + Z));
const Or = omegaR(67.66), cos = cosmology({ H0: 67.66, Om: 0.3111, OL: 1 - 0.3111 - Or, Or }, Z);

const out = {
  lines: lineRows,
  twoLines: { tol20: cands(OBS2, 20), tol10: cands(OBS2, 10), tol5: cands(OBS2, 5) },
  threeLines: { tol20: cands(OBS3, 20), tol3: cands(OBS3, 3) },
  toolDefaultZmax7: findRedshift(OBS2, SETS, -0.01, 7, 4e-4 + 20 / 6000, MED).map((c) => ({ z: +c.z.toFixed(4), n: c.n, lines: c.lines.join(' + ') })),
  atZ: identify(OBS2, Z, 20, SETS, MED).map((r) => ({ obs: +r.obs.toFixed(1), best: r.matches[0] && `${r.matches[0].line.name} (${r.matches[0].kms.toFixed(0)} km/s)`, n: r.matches.length })),
  aliasChecked: identify(OBS2, 4.244, 20, SETS, MED).map((r) => r.matches.length),
  doublet: { obs: DOUBLET.map((d) => +d.toFixed(1)), sepAA: +(DOUBLET[1] - DOUBLET[0]).toFixed(1), resR1000: +(DOUBLET[0] / 1000).toFixed(1), resR2700: +(DOUBLET[0] / 2700).toFixed(1) },
  perAngstrom: { kms: +((1 / OBS2[0]) * 299792.458).toFixed(1), dz: +(1 / rest('C IV', 'quasar')).toFixed(5) },
  cosmo: { ageMyr: +(cos.ageZ * 1000).toFixed(1), lookbackGyr: +cos.lookback.toFixed(3), kpcPerArcsec: +cos.kpcPerArcsec.toFixed(3) },
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: where each line lands as redshift grows, against what NIRSpec can see.
const zs = Array.from({ length: 29 }, (_, i) => i * 0.5);
const SHOW = [['Lyman α', 'quasar'], ['C IV', 'quasar'], ['C III]', 'quasar'], ['Hβ', 'stellar'], ['Hα', 'stellar']];
const fig1 = chart({
  title: 'Where a line lands, and what JWST can see', xLabel: 'Redshift z', yLabel: 'Observed wavelength (µm), log scale',
  series: SHOW.map(([n, s]) => { const r = rest(n, s); return { name: n, kind: 'line', x: zs, y: zs.map((z) => Math.log10((r * (1 + z)) / 1e4)) }; }),
  xDomain: [0, 14], yDomain: [Math.log10(0.1), Math.log10(30)],
  yTicks: [-1, -0.5, 0, 0.5, 1, 1.5], yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: Math.log10(NIRSPEC[1]), text: 'NIRSpec 5.3 µm' }, { y: Math.log10(NIRSPEC[0]), text: 'NIRSpec 0.6 µm' }],
  vlines: [{ x: Z, text: 'z = 12.34', left: true, dy: 30 }],
  desc: 'Observed wavelength against redshift for five rest-frame lines, with the NIRSpec wavelength range marked. At redshift 12.34 the ultraviolet lines sit inside the range while H-beta and H-alpha have moved past 6 micrometres, out of reach.',
  height: 300,
});

// Figure 2: a redshift comb. How many of the three measured lines match a known line at each trial redshift.
// Figure 2: every redshift each measured line could imply, if it were any strong line in the list.
const STRONG = SPEC_LINES.filter((l) => SETS.includes(l.set) && l.strong);
const ROWS = [['Lyman α at 1.622 µm', OBS3[0]], ['C IV at 2.066 µm', OBS3[1]], ['C III] at 2.546 µm', OBS3[2]]];
const proposals = ROWS.map(([name, obs], i) => {
  const zs = [];
  for (const l of STRONG) { const z = obs / restIn(l, MED) - 1; if (z >= -0.01 && z <= 13) zs.push(+z.toFixed(3)); }
  return { name, kind: 'dots', size: 3.4, x: zs, y: zs.map(() => 3 - i) };
});
const fig2 = chart({
  title: 'Every redshift each line could imply', xLabel: 'Candidate redshift z', yLabel: '',
  series: proposals,
  xDomain: [-0.3, 13], yDomain: [0.4, 3.6], yTicks: [1, 2, 3], yFmt: (t) => ['', 'C III]', 'C IV', 'Lyman α'][t] ?? '',
  vlines: [{ x: Z, text: 'z = 12.34', left: true, dy: 0 }],
  desc: `Each row is one measured wavelength; each dot is the redshift it would have if it were one of the 24 strong lines in the list. The only redshift where all three rows agree to better than 0.05 in z is ${Z}.`,
  height: 260,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'band', figure(fig1, 'Figure 1. Observed wavelength against redshift for five rest-frame lines, with the NIRSpec range drawn in. At redshift 12.34 the ultraviolet lines are in the band and the rest-optical diagnostics are not, which is why the case for an active nucleus has to be made in the ultraviolet.'));
  md = inject(md, 'comb', figure(fig2, "Figure 2. One row per measured wavelength. Each dot marks a redshift at which that wavelength would be one of the strong lines in the tool's list. Redshift 12.34 is the only place where all three rows agree to better than 0.05 in z; the nearest rival, around z = 3.35, is off by thousands of km/s."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
