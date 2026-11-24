// Figures for src/blog/discoveries/jades-gs-z14-0-alma-oxygen-88-micron-redshift-14-18.md, made with the maths of the
// Redshift calculator (src/lib/sci/redshift.ts: zFromFreq, velocity, nmToGhz) and the Cosmology calculator
// (src/lib/sci/cosmo.ts: cosmology, presets), as the Redshift calculator uses them (flat, no radiation term).
// Run: node scripts/blog-figures/jades-gs-z14-0-alma-oxygen-88-micron-redshift-14-18.mjs
import fs from 'node:fs';
import { zFromFreq, velocity, C_KMS, LINES, nmToGhz } from '../../src/lib/sci/redshift.ts';
import { cosmology, presets } from '../../src/lib/sci/cosmo.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/jades-gs-z14-0-alma-oxygen-88-micron-redshift-14-18.md', import.meta.url);
// From Carniani et al. (2025), A&A 696, A87, doi:10.1051/0004-6361/202452451 (CC BY 4.0): [O III] 88 µm seen at
// 223.524 GHz, z = 14.1796 ± 0.0007; NIRSpec Lyman-break redshift 14.32 (+0.08/−0.20); ALMA Band 6 tuning 218–229 GHz;
// FWHM 102 km/s; 3.268 kpc per arcsec (their H0 = 70, Ωm = 0.3); beam 0.42″ × 0.38″ (C5, robust 0.5).
// Rest frequency of [O III] 88 µm, 3393.006244 GHz: Cologne/JPL line lists as used by ALMA (our input; the paper does not print it).
const NU_OBS = 223.524, NU_REST = 3393.006244, Z_PAPER = 14.1796, Z_LB = [14.12, 14.32, 14.40];
const z = zFromFreq(NU_OBS, NU_REST);
const zErr = (NU_REST / NU_OBS) * (0.0007 / (1 + Z_PAPER)); // not used for the result: just echoes the size
const cos = (k) => { const p = presets[k]; return { H0: p.H0, Om: p.Om, OL: 1 - p.Om, Or: 0 }; };
const R = cosmology(cos('round'), z), P = cosmology(cos('planck18'), z), R14 = cosmology(cos('round'), 14);
const dv = C_KMS * (Z_LB[1] - z) / (1 + z); // velocity offset of the Lyman-break redshift, in the frame of the galaxy
const nuFor = (zz) => NU_REST / (1 + zz);
const ciiRest = 1900.5369, ciiObs = ciiRest / (1 + z);
const o3opt = LINES.find((l) => l.id === 'oiii').nm, hb = LINES.find((l) => l.id === 'hb').nm;
const fwhmMHz = NU_OBS * 1e3 * 102 / C_KMS;
const out = {
  z: +z.toFixed(5), stretch: +(1 + z).toFixed(4), zLBrange: Z_LB.map((x) => +nuFor(x).toFixed(2)),
  round: { ageMyr: +(R.ageZ * 1000).toFixed(1), lookbackGyr: +R.lookback.toFixed(3), age0: +R.age0.toFixed(3), kpcAs: +R.kpcPerArcsec.toFixed(3), kpcAs14: +R14.kpcPerArcsec.toFixed(3), dlMpc: Math.round(R.dl), dcMpc: Math.round(R.dc), distMod: +R.distMod.toFixed(2) },
  planck: { ageMyr: +(P.ageZ * 1000).toFixed(1), lookbackGyr: +P.lookback.toFixed(3), kpcAs: +P.kpcPerArcsec.toFixed(3), dcMpc: Math.round(P.dc) },
  dvLB: Math.round(dv), beamKpc: [+(0.42 * R.kpcPerArcsec).toFixed(2), +(0.38 * R.kpcPerArcsec).toFixed(2)],
  ciiObsGHz: +ciiObs.toFixed(2), o3optObsUm: +(o3opt * (1 + z) / 1000).toFixed(3), hbObsUm: +(hb * (1 + z) / 1000).toFixed(3),
  fwhmMHz: +fwhmMHz.toFixed(1), vRadio: Math.round(velocity(z, 'radio')), vRel: Math.round(velocity(z, 'relativistic')), zErrCheck: zErr,
};

// Figure 1: where [O III] 88 µm lands against redshift, with the ALMA Band 6 tuning and the Lyman-break range.
const zz = Array.from({ length: 121 }, (_, i) => 13.5 + i * 0.01);
const fig1 = chart({
  title: '[O III] 88 µm: observed frequency against redshift', xLabel: 'Redshift z', yLabel: 'Observed frequency (GHz)',
  series: [
    { name: '[O III] 88 µm line', kind: 'line', x: zz, y: zz.map((v) => +nuFor(v).toFixed(3)) },
    { name: 'Detected', kind: 'dots', x: [z], y: [NU_OBS], size: 5, colour: 'var(--c-tools)', label: { text: `z = ${z.toFixed(4)}`, dx: 8, dy: -6 } },
  ],
  xDomain: [13.5, 14.7], yDomain: [214, 236],
  bands: [{ x0: Z_LB[0], x1: Z_LB[2], text: 'Lyman-break range' }],
  hlines: [{ y: 218, text: '' }, { y: 229, text: 'Band 6 tuning 218–229 GHz' }],
  desc: `The observed frequency of the [O III] 88 micron line falls from about 236 to 216 GHz between redshift 13.5 and 14.7. The whole Lyman-break redshift range, 14.12 to 14.40, lands inside the 218 to 229 GHz tuning, and the line was found at 223.524 GHz, z = ${z.toFixed(4)}.`, height: 270,
});
// Figure 2: age of the universe against redshift, two cosmologies.
const zs = Array.from({ length: 81 }, (_, i) => 6 + i * 0.125);
const fig2 = chart({
  title: 'Age of the universe when the light left', xLabel: 'Redshift z', yLabel: 'Age then (million years)',
  series: [
    { name: 'H₀ 70, Ωm 0.3 (paper)', kind: 'line', x: zs, y: zs.map((v) => +(cosmology(cos('round'), v).ageZ * 1000).toFixed(1)) },
    { name: 'Planck 2018', kind: 'line', x: zs, y: zs.map((v) => +(cosmology(cos('planck18'), v).ageZ * 1000).toFixed(1)), dash: '5 4' },
  ],
  xDomain: [6, 16], yDomain: [200, 1000], vlines: [{ x: z, text: `z = ${z.toFixed(2)}: ${Math.round(R.ageZ * 1000)} to ${Math.round(P.ageZ * 1000)} Myr`, left: true }],
  desc: `The universe's age falls from about 900 million years at redshift 6 to under 300 million at redshift 14. At z = ${z.toFixed(2)} it was ${Math.round(R.ageZ * 1000)} million years old with H0 70 and Omega_m 0.3, or ${Math.round(P.ageZ * 1000)} million with Planck 2018.`, height: 260,
});
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'tuning', figure(fig1, 'Figure 1. Where the [O III] 88 µm line lands for each redshift, worked out with the Redshift calculator\'s maths. The shaded band is the redshift range the earlier JWST Lyman-break measurement allowed; the dashed lines are the ALMA Band 6 tuning. The dot is the detection.'));
  md = inject(md, 'age', figure(fig2, 'Figure 2. Age of the universe at each redshift with the paper\'s round-number cosmology and with Planck 2018, from the Cosmology calculator\'s maths (flat, no radiation term, as the Redshift calculator uses).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
