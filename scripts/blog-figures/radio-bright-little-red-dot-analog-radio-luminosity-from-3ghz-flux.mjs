// Figures for src/blog/discoveries/radio-bright-little-red-dot-analog-radio-luminosity-from-3ghz-flux.md, made with the
// maths of the Magnitude converter (src/lib/sci/photometry.ts) and the Cosmology calculator (src/lib/sci/cosmo.ts).
// Run: node scripts/blog-figures/radio-bright-little-red-dot-analog-radio-luminosity-from-3ghz-flux.mjs
import fs from 'node:fs';
import { cosmology, omegaR } from '../../src/lib/sci/cosmo.ts';
import { toJy, fromJy } from '../../src/lib/sci/photometry.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/radio-bright-little-red-dot-analog-radio-luminosity-from-3ghz-flux.md', import.meta.url);

// From the paper: Rodriguez et al. (2026), ApJ, doi:10.3847/1538-4357/ae9b01 (CC BY 4.0).
const Z = 0.4332, S_MJY = 3.0, S_ERR = 0.2, NU_OBS = 3.0e9, ALPHA = -0.39;
// Planck 2018, the Cosmology calculator's own default.
const H0 = 67.66, OM = 0.3111, OR = omegaR(H0);
const COS = { H0, Om: OM, OL: 1 - OM - OR, Or: OR };
const MPC_M = 3.0856775814913673e22, W_TO_ERG = 1e7;
const LAM_UM = (2.99792458e8 / NU_OBS) * 1e6; // 3 GHz as a wavelength in micrometres, for the converter's "any wavelength"

const here = cosmology(COS, Z);
const siNu = fromJy(toJy(S_MJY, 'mJy', LAM_UM, null), LAM_UM, null); // the converter's own table
const S_SI = siNu.si_nu; // W m-2 Hz-1
const dl = here.dl * MPC_M;
const NU_REST = NU_OBS * (1 + Z);
// Spectral luminosity at the rest frequency, K-corrected for a power-law spectrum S ∝ nu^alpha.
const Lnu = (s) => (4 * Math.PI * dl * dl * s) / (1 + Z) ** (1 + ALPHA);
const LNU = Lnu(S_SI);
const lnuAt = (nu) => LNU * (nu / NU_REST) ** ALPHA; // W Hz-1 at any rest frequency
// Integrated luminosity from a to b (rest frequencies, Hz), erg s-1.
const integ = (a, b) => { const p = 1 + ALPHA; return ((LNU * NU_REST ** -ALPHA * (b ** p - a ** p)) / p) * W_TO_ERG; };

// The same source seen at a higher redshift: flux scales with distance and the K-correction.
const sAt = (zp) => S_MJY * (here.dl / cosmology(COS, zp).dl) ** 2 * ((1 + zp) / (1 + Z)) ** (1 + ALPHA);

const out = {
  dlMpc: +here.dl.toFixed(1), lookbackGyr: +here.lookback.toFixed(3), distMod: +here.distMod.toFixed(3), kpcPerArcsec: +here.kpcPerArcsec.toFixed(3),
  fluxUnits: { si_nu: siNu.si_nu, cgs_nu: siNu.cgs_nu, uJy: siNu.uJy, ab: +siNu.ab.toFixed(3) },
  restGHz: +(NU_REST / 1e9).toFixed(3),
  logLnu: +Math.log10(LNU).toFixed(3), logLnu14: +Math.log10(lnuAt(1.4e9)).toFixed(3),
  nuLnu_erg: +(NU_REST * LNU * W_TO_ERG).toPrecision(3),
  nuLnu_err: [S_MJY - S_ERR, S_MJY + S_ERR].map((s) => +(NU_REST * Lnu(fromJy(toJy(s, 'mJy', LAM_UM, null), LAM_UM, null).si_nu) * W_TO_ERG).toPrecision(3)),
  nuLnu5GHz_erg: +(5e9 * lnuAt(5e9) * W_TO_ERG).toPrecision(3),
  int1to10: +integ(1e9, 1e10).toPrecision(3), int10MHzto100GHz: +integ(1e7, 1e11).toPrecision(3),
  higherZ: [4, 5, 6, 7].map((zp) => ({ z: zp, uJy: +(sAt(zp) * 1000).toFixed(2), rms5sig: +((sAt(zp) * 1000) / 5).toFixed(2) })),
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: the same source's 3 GHz flux density against the redshift it is placed at.
const zs = Array.from({ length: 120 }, (_, i) => 0.3 + i * 0.065);
const fig1 = chart({
  title: 'The same radio source, moved back in redshift', xLabel: 'Redshift z', yLabel: 'Flux density at 3 GHz (µJy), log scale',
  series: [{ name: '3.0 mJy source from z = 0.4332', kind: 'line', x: zs, y: zs.map((z) => Math.log10(sAt(z) * 1000)) }],
  xDomain: [0.3, 8], yDomain: [Math.log10(8), Math.log10(6000)],
  yTicks: [1, 2, 3], yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  vlines: [{ x: 4, text: 'z = 4', dy: 0 }, { x: 7, text: 'z = 7', dy: 16 }],
  hlines: [{ y: Math.log10(sAt(4) * 1000), text: `${(sAt(4) * 1000).toFixed(0)} µJy` }, { y: Math.log10(sAt(7) * 1000), text: `${(sAt(7) * 1000).toFixed(0)} µJy` }],
  desc: `The observed 3 GHz flux density of the same radio source if it sat at other redshifts, K-corrected for a spectral index of ${ALPHA}. It falls from 3.0 mJy at z = 0.4332 to about ${(sAt(4) * 1000).toFixed(0)} µJy at z = 4 and ${(sAt(7) * 1000).toFixed(0)} µJy at z = 7.`,
  height: 280,
});

// Figure 2: how much "radio luminosity" you get depends entirely on the band you pick.
const fmax = Array.from({ length: 120 }, (_, i) => 10 ** (8 + (i * 3.2) / 119)); // 0.1 to 158 GHz
const fig2 = chart({
  title: 'Radio luminosity depends on the band you choose', xLabel: 'Upper edge of the band (GHz), log scale', yLabel: 'Luminosity (erg s⁻¹), log scale',
  series: [
    { name: 'Integrated from 10 MHz up', kind: 'line', x: fmax.map((f) => Math.log10(f / 1e9)), y: fmax.map((f) => Math.log10(integ(1e7, f))) },
    { name: 'ν L_ν at that frequency', kind: 'line', x: fmax.map((f) => Math.log10(f / 1e9)), y: fmax.map((f) => Math.log10(f * lnuAt(f) * W_TO_ERG)), dash: '5 3' },
  ],
  xDomain: [-1, 2.2], yDomain: [Math.log10(2e39), Math.log10(2e42)],
  xTicks: [-1, 0, 1, 2], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  yTicks: [40, 41, 42], yFmt: (t) => `1e${t}`,
  hlines: [{ y: Math.log10(1.2e41), text: "paper's 1.2e41" }],
  vlines: [{ x: Math.log10(NU_REST / 1e9), text: '4.3 GHz rest', left: true, dy: 14 }],
  desc: `Two ways of turning the measured flux into a luminosity. The solid line integrates the power-law spectrum from 10 MHz up to the frequency on the axis; the dashed line is nu times the spectral luminosity at that frequency. The paper's 1.2e41 erg per second sits between them near the observed band.`,
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'zscale', figure(fig1, 'Figure 1. What the same radio source would look like at higher redshift: the observed 3 GHz flux density, K-corrected for the measured spectral index. The horizontal lines mark the values at z = 4 and z = 7, the range the paper says the VLA could still reach.'));
  md = inject(md, 'band', figure(fig2, "Figure 2. The same measurement turned into a luminosity two ways. Which number you quote depends on the band: the paper's 1.2 × 10⁴¹ erg s⁻¹ is what you get near the observed band, not what a 10 MHz to 100 GHz integral gives."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
