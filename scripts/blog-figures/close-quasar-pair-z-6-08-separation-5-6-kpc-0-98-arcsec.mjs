// Figures for src/blog/discoveries/close-quasar-pair-z-6-08-separation-5-6-kpc-0-98-arcsec.md, made with the maths of the
// Cosmology calculator (src/lib/sci/cosmo.ts) and the Redshift calculator (src/lib/sci/redshift.ts).
// Run: node scripts/blog-figures/close-quasar-pair-z-6-08-separation-5-6-kpc-0-98-arcsec.mjs
import fs from 'node:fs';
import { cosmology, omegaR, presets, sizeFromArcsec } from '../../src/lib/sci/cosmo.ts';
import { velocity } from '../../src/lib/sci/redshift.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/close-quasar-pair-z-6-08-separation-5-6-kpc-0-98-arcsec.md', import.meta.url);

// From the paper's abstract (Onorato et al. 2026, ApJL 1011: L59, doi:10.3847/2041-8213/aeb11f, CC BY 4.0):
// separation 0.98 arcsec, about 5.56 physical kpc at z ~ 6.08; systemic redshifts 6.0781 and 6.0785; velocity offset ~15 km/s;
// black hole masses 1.5e9 and 4.0e8 solar masses; Eddington ratios 1.23 and 1.07.
const SEP = 0.98, Z = 6.08, ZA = 6.0781, ZB = 6.0785, PAPER_KPC = 5.56;
const KPC_LY = 3261.5638; // light years per kpc (IAU parsec)

// The calculator's three presets, flat, radiation included (the page's default ticks), and the same without radiation.
const cos = (p, rad = true) => { const Or = rad ? omegaR(p.H0) : 0; return { H0: p.H0, Om: p.Om, Or, OL: 1 - p.Om - Or }; };
const runs = {};
for (const [k, p] of Object.entries(presets)) for (const rad of [true, false]) {
  const r = cosmology(cos(p, rad), Z);
  runs[`${k}${rad ? '' : '_norad'}`] = { kpcPerArcsec: +r.kpcPerArcsec.toFixed(4), sep_kpc: +sizeFromArcsec(SEP, r.da).toFixed(3), ageZ_Myr: +(r.ageZ * 1000).toFixed(0), lookback_Gyr: +r.lookback.toFixed(3), age0_Gyr: +r.age0.toFixed(3), da_Mpc: +r.da.toFixed(1), dl_Mpc: +r.dl.toFixed(0), frac: +(r.ageZ / r.age0).toFixed(4), Tcmb: +r.T.toFixed(2) };
}
// Which separation does the paper's 5.56 kpc imply for each cosmology? And back: arcsec that 5.56 kpc spans.
const round = cosmology(cos(presets.round), Z), p18 = cosmology(cos(presets.planck18), Z);
// The velocity offset: the redshift of B seen from A, then the Redshift calculator's relativistic velocity.
const zRel = (1 + ZB) / (1 + ZA) - 1;
const dv = velocity(zRel, 'relativistic');
const dvLo = velocity((1 + ZB - 0.00005) / (1 + ZA + 0.00005) - 1, 'relativistic'), dvHi = velocity((1 + ZB + 0.00005) / (1 + ZA - 0.00005) - 1, 'relativistic');
// How sharply the angular scale depends on z near 6: kpc per arcsec at z = 6.0781 vs 6.0785.
const zs = [ZA, ZB].map((z) => +cosmology(cos(presets.round), z).kpcPerArcsec.toFixed(5));

const out = {
  runs, roundSep_ly: Math.round(sizeFromArcsec(SEP, round.da) * KPC_LY), paperSep_ly: Math.round(PAPER_KPC * KPC_LY),
  p18_minus_round_pct: +((sizeFromArcsec(SEP, p18.da) / sizeFromArcsec(SEP, round.da) - 1) * 100).toFixed(2),
  zRel: +zRel.toExponential(4), dv_kms: +dv.toFixed(2), dvRange_kms: [+dvLo.toFixed(1), +dvHi.toFixed(1)], kpcPerArcsecAB: zs,
  ratioMass: +(1.5e9 / 4.0e8).toFixed(3),
};
console.log(JSON.stringify(out, null, 1));

const zz = Array.from({ length: 141 }, (_, i) => 3 + i * 0.05);
const fig1 = chart({
  title: 'How many kiloparsecs one arcsecond spans', xLabel: 'Redshift z', yLabel: 'kpc per arcsecond',
  series: [
    { name: 'H0 = 70, Ωm = 0.3 (round numbers)', kind: 'line', x: zz, y: zz.map((z) => cosmology(cos(presets.round), z).kpcPerArcsec) },
    { name: 'Planck 2018', kind: 'line', dash: '5 4', x: zz, y: zz.map((z) => cosmology(cos(presets.planck18), z).kpcPerArcsec) },
  ],
  xDomain: [3, 10], yDomain: [4, 8], yTicks: [4, 5, 6, 7, 8],
  vlines: [{ x: Z, text: 'z = 6.08' }], hlines: [{ y: round.kpcPerArcsec, text: `${round.kpcPerArcsec.toFixed(2)} kpc per arcsec` }],
  desc: 'Physical kiloparsecs per arcsecond against redshift from 3 to 10, for round-number and Planck 2018 cosmologies. At redshift 6.08 one arcsecond spans 5.67 kpc with H0 of 70 and matter density 0.3, and 5.79 kpc with Planck 2018.',
  height: 280,
});

const ages = Array.from({ length: 121 }, (_, i) => 4 + i * 0.05);
const fig2 = chart({
  title: 'Age of the universe when the light left', xLabel: 'Redshift z', yLabel: 'Age then (million years)',
  series: [{ name: 'H0 = 70, Ωm = 0.3', kind: 'line', x: ages, y: ages.map((z) => cosmology(cos(presets.round), z).ageZ * 1000) }],
  xDomain: [4, 10], yDomain: [400, 1600], yTicks: [400, 600, 800, 1000, 1200, 1400, 1600],
  vlines: [{ x: Z, text: 'z = 6.08' }], hlines: [{ y: round.ageZ * 1000, text: `${Math.round(round.ageZ * 1000)} million years` }],
  desc: 'Age of the universe against redshift from 4 to 10 for H0 of 70 and matter density 0.3. At redshift 6.08 the universe was 899 million years old.',
  height: 270,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'scale', figure(fig1, 'Figure 1. The angular scale from the Cosmology calculator\'s maths. With round-number cosmology (H0 = 70, Ωm = 0.3) the pair\'s 0.98 arcsec at z = 6.08 is 5.55 kpc, the paper\'s 5.56; Planck 2018 values would make it about 2 % wider.'));
  md = inject(md, 'age', figure(fig2, 'Figure 2. The age of the universe at each redshift, from the same maths. At z = 6.08 it was 899 million years old, about a fifteenth of its present age of 13.46 billion years in this cosmology.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
