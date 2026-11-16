// Figures for src/blog/discoveries/sn-eos-lensed-supernova-macs-j1931.md, made with the maths of the
// Cosmology calculator (src/lib/sci/cosmo.ts), the Redshift calculator (src/lib/sci/redshift.ts) and the
// Magnitude and flux converter (src/lib/sci/photometry.ts).
// Run: node scripts/blog-figures/sn-eos-lensed-supernova-macs-j1931.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { cosmology, omegaR, presets } from '../../src/lib/sci/cosmo.ts';
import { LINES, velocity } from '../../src/lib/sci/redshift.ts';
import { toJy, fromJy } from '../../src/lib/sci/photometry.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sn-eos-lensed-supernova-macs-j1931.md', import.meta.url);

// Inputs. "Paper": Allingham et al. (2026), ApJ 1005, 215, doi:10.3847/1538-4357/ae7a59 (CC BY 4.0), abstract.
const Z_LENS = 0.35, Z_SN = 5.13;                       // paper
const MU = [25, 30];                                    // magnification of the observed pair: paper
const DELAYS = [3.6, 3.4, 53.9];                        // years, earlier images: paper
const MU_EARLY = [14.5, 11.9, 2.2];                     // their magnifications: paper
// Cosmology: Planck 2018 (the tool's default preset; literature), flat, with radiation.
const P = presets.planck18, Or = omegaR(P.H0);
const cos = (H0, z) => cosmology({ H0, Om: P.Om, OL: 1 - P.Om - omegaR(H0), Or: omegaR(H0) }, z);
const S = cos(P.H0, Z_SN), L = cos(P.H0, Z_LENS);
// Our assumption, for the brightness example only: a supernova peaking at absolute magnitude −17 (AB) in the rest-frame
// ultraviolet-optical, a typical round number for core-collapse supernovae. Not from the paper.
const M_ABS = -17;
const mUnlensed = M_ABS + S.distMod - 2.5 * Math.log10(1 + Z_SN); // f_nu bandwidth term; no K-correction for the spectrum's shape
const dMag = MU.map((m) => 2.5 * Math.log10(m));
const mLensed = dMag.map((d) => mUnlensed - d);
const nJy = (m) => fromJy(toJy(m, 'ab', 4.4, null), 4.4, null).uJy * 1000; // AB magnitudes are the same at any wavelength

// Time-delay distance D_dt = (1 + z_l) D_l D_s / D_ls (flat universe: D_ls = (D_M,s − D_M,l)/(1 + z_s)).
const Ddt = (H0) => { const s = cos(H0, Z_SN), l = cos(H0, Z_LENS), dls = (s.dm - l.dm) / (1 + Z_SN); return (1 + Z_LENS) * l.da * s.da / dls; };
const D0 = Ddt(P.H0);

// Figure 1: age of the universe when light left, against redshift, with the lens and the supernova marked.
const zs = [], ages = [];
for (let k = 0; k <= 90; k++) { const z = 10 ** (-2 + (k / 90) * 3); zs.push(+Math.log10(z).toFixed(3)); ages.push(+cos(P.H0, z).ageZ.toFixed(3)); }
const fig1 = chart({
  title: 'How old the universe was when the light left', xLabel: 'Redshift z', yLabel: 'Age of the universe then (billion years)',
  series: [
    { name: 'Planck 2018', kind: 'line', x: zs, y: ages },
    { name: '', kind: 'dots', x: [+Math.log10(Z_LENS).toFixed(3)], y: [+L.ageZ.toFixed(2)], colour: 'var(--ink)', size: 4, label: { text: `Cluster, z = 0.35: ${L.ageZ.toFixed(1)} billion years`, dx: 8, dy: -6 } },
    { name: '', kind: 'dots', x: [+Math.log10(Z_SN).toFixed(3)], y: [+S.ageZ.toFixed(2)], colour: 'var(--ink)', size: 4, label: { text: `SN Eos, z = 5.13: ${S.ageZ.toFixed(2)} billion years`, anchor: 'end', dx: -8, dy: -8 } },
  ],
  xDomain: [-2, 1], yDomain: [0, 14.5], xTicks: [-2, -1, 0, 1], yTicks: [0, 2, 4, 6, 8, 10, 12, 14],
  xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: `The age of the universe falls from 13.8 billion years nearby to ${S.ageZ.toFixed(2)} billion years at the supernova's redshift of 5.13.`, height: 290,
});

// Figure 2: the longest predicted delay (53.9 years for Planck's H0) if H0 were different. With the lens model fixed,
// every time delay is proportional to D_dt, which scales as 1/H0.
const hs = [], dl = [];
for (let H = 60; H <= 76.001; H += 0.5) { hs.push(+H.toFixed(1)); dl.push(+(DELAYS[2] * Ddt(H) / D0).toFixed(3)); }
const fig2 = chart({
  title: 'The 53.9-year delay depends on the Hubble constant', xLabel: 'Hubble constant H0 (km/s/Mpc)', yLabel: 'Predicted delay (years)',
  series: [{ name: 'Delay', kind: 'line', x: hs, y: dl }], yDomain: [46, 62],
  vlines: [{ x: 67.66, text: 'Planck 67.7', left: true }, { x: 73, text: 'Local ladder ~73' }],
  desc: 'With the same lens model, the predicted 53.9-year delay would be about 60.8 years if H0 were 60 and about 48 years if it were 76: delays scale as one over the Hubble constant.', height: 280,
});

const lyaObs = LINES.find((l) => l.id === 'lya').nm * (1 + Z_SN), haObs = LINES.find((l) => l.id === 'ha').nm * (1 + Z_SN);
const facts = {
  sn: { age: S.ageZ.toFixed(3), lookback: S.lookback.toFixed(3), dl_Mpc: S.dl.toFixed(0), dl_Gly: (S.dl * 3.26156e-3).toFixed(1), dc_Mpc: S.dc.toFixed(0), da_Mpc: S.da.toFixed(0), kpcArcsec: S.kpcPerArcsec.toFixed(3), DM: S.distMod.toFixed(2), T: S.T.toFixed(2), age0: S.age0.toFixed(3) },
  lens: { age: L.ageZ.toFixed(3), lookback: L.lookback.toFixed(3), da_Mpc: L.da.toFixed(0), kpcArcsec: L.kpcPerArcsec.toFixed(3), DM: L.distMod.toFixed(2) },
  stretch: (1 + Z_SN).toFixed(2), lyaObs: lyaObs.toFixed(1), haObs: haObs.toFixed(1), vRel: (velocity(Z_SN, 'relativistic') / 299792.458).toFixed(4),
  rest100: (100 * (1 + Z_SN)).toFixed(0), delaysRest: DELAYS.map((d) => (d / (1 + Z_SN)).toFixed(2)),
  mUnlensed: mUnlensed.toFixed(2), dMag: dMag.map((d) => d.toFixed(2)), mLensed: mLensed.map((m) => m.toFixed(2)), nJyUnlensed: nJy(mUnlensed).toFixed(1), nJyLensed: mLensed.map((m) => nJy(m).toFixed(0)),
  dMagEarly: MU_EARLY.map((m) => (2.5 * Math.log10(m)).toFixed(2)),
  Ddt_Mpc: D0.toFixed(0), delayH60: dl[0], delayH73: (DELAYS[2] * Ddt(73) / D0).toFixed(1), delayH76: dl[dl.length - 1],
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'age', figure(fig1, 'Figure 1. Age of the universe when the light we see left, from the Cosmology calculator\'s maths with Planck 2018 values (flat, with radiation). The redshift axis is logarithmic.'));
  md = inject(md, 'h0', figure(fig2, 'Figure 2. How the paper\'s longest predicted delay, 53.9 years for Planck\'s H0, would change with a different Hubble constant if the lens model stayed the same. Time-delay distance from the Cosmology calculator\'s maths; our illustration, not a result of the paper.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
