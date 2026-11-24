// Figures for src/blog/discoveries/parkes-murriyang-cryogenic-phased-array-feed-hi-sensitivity.md, made with the maths
// of the Radio telescope calculator (src/lib/sci/radiotel.ts: gain, SEFD, beam and the radiometer equation) and the
// Hydrogen line analyser (src/lib/astro/hline.ts: radio velocity and HI column density).
// Run: node scripts/blog-figures/parkes-murriyang-cryogenic-phased-array-feed-hi-sensitivity.mjs   (rewrites the charts)
import fs from 'node:fs';
import { scope } from '../../src/lib/sci/radiotel.ts';
import { F0, velRadio, columnDensity } from '../../src/lib/astro/hline.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/parkes-murriyang-cryogenic-phased-array-feed-hi-sensitivity.md', import.meta.url);

// Inputs from the paper: Staveley-Smith et al. (2026), PASA 43: e057, doi:10.1017/pasa.2026.10164 (CC BY 4.0).
// Tsys about 17 K, aperture efficiency about 0.7, main-beam efficiency about 0.8, Tsys/eta_d 25 K, beam about 0.24 deg,
// 5 kHz channels, about 80 s per pointing in the LMC map, mean spatial weight 2.5, 28 mK per beam, 18 mK in the cube.
// The 64 m diameter is the telescope's published size (CSIRO), not from the paper's text.
const D = 64, ETA = 0.7, ETA_MB = 0.8, TSYS = 17, F = 1.4204e9, CH = 5e3, T_PT = 80, WEIGHT = 2.5;
const s = scope({ D, eta: ETA, tsys: TSYS, f: F, n: 1, npol: 2, bw: CH });
const sigJy = s.sigma(T_PT); // Jy per beam, one 80 s pointing, one 5 kHz channel, two polarisations
// Noise as an antenna temperature is gain × Jy; dividing by an efficiency turns it into a sky brightness temperature.
const sigTa = s.gain * sigJy; // = Tsys / sqrt(2 B t)
const perBeam = { ta: sigTa, tmbD: sigTa / ETA, tmbMB: sigTa / ETA_MB }; // K
const cube = perBeam.tmbD / Math.sqrt(WEIGHT);
const dv = velRadio(F0 - CH / 1e6); // km/s per 5 kHz channel (radio convention)
const nhi = columnDensity(cube * dv), nhiPaper = columnDensity(0.018 * 1.1);
// NGC 6744 flux: Jy MHz to Jy km/s with the same radio-convention width per MHz.
const perMHz = velRadio(F0 - 1);
const ngc = { cryo: 5.07 * perMHz, cryoErr: 0.25 * perMHz, hipass: 4.88 * perMHz };

// Figure 1: noise per beam (main-beam brightness, Tsys/eta_d = 25 K) against time, 5 kHz channels.
const ts = Array.from({ length: 61 }, (_, i) => 10 ** (0.5 + (3.5 * i) / 60));
const mk = (t, eff) => +(1e3 * s.gain * s.sigma(t) / eff).toFixed(2);
const fig1 = chart({
  title: 'Murriyang PAF: HI noise per beam in a 5 kHz channel', xLabel: 'Integration time per beam (s, log scale)', yLabel: 'Noise (mK, log scale)',
  series: [
    { name: 'Tsys/η = 25 K (aperture)', kind: 'line', x: ts.map(Math.log10), y: ts.map((t) => Math.log10(mk(t, ETA))) },
    { name: 'Tsys/η = 21 K (main beam)', kind: 'line', x: ts.map(Math.log10), y: ts.map((t) => Math.log10(mk(t, ETA_MB))), dash: '5 4' },
    { name: 'Paper: 28 mK at 80 s', kind: 'dots', x: [Math.log10(80)], y: [Math.log10(28)], size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0.5, 4], yDomain: [0, 2.5], xTicks: [1, 2, 3, 4], yTicks: [0, 1, 2], xFmt: (v) => String(10 ** v), yFmt: (v) => String(10 ** v),
  vlines: [{ x: Math.log10(80), text: '80 s' }],
  desc: `Radiometer-equation noise per beam against integration time for a 64 m dish with Tsys 17 K and 5 kHz channels. At 80 s it is ${(perBeam.tmbD * 1e3).toFixed(1)} mK for Tsys/eta 25 K, matching the paper's 28 mK.`, height: 270,
});
// Figure 2: beam width across the receiver band, 1.2 lambda / D, with the paper's 0.24 deg at 1.4 GHz.
const fs2 = Array.from({ length: 53 }, (_, i) => 0.7 + i * 0.025);
const bw = (fg) => +(scope({ D, eta: ETA, tsys: TSYS, f: fg * 1e9, n: 1, npol: 2, bw: 1 }).hpbw * 180 / Math.PI).toFixed(4);
const fig2 = chart({
  title: 'Beam width of a 64 m dish across 0.7 to 2 GHz', xLabel: 'Frequency (GHz)', yLabel: 'Half-power beam width (°)',
  series: [
    { name: 'Tool: 1.2 λ/D', kind: 'line', x: fs2, y: fs2.map(bw) },
    { name: 'Paper: about 0.24° at 1.4 GHz', kind: 'dots', x: [1.4], y: [0.24], size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0.7, 2], yDomain: [0, 0.5], hlines: [{ y: 0.14, text: 'beam spacing 0.14°' }],
  desc: `Half-power beam width 1.2 lambda over D for a 64 m dish: ${bw(0.7).toFixed(2)} degrees at 0.7 GHz, ${bw(1.4).toFixed(3)} at 1.4 GHz and ${bw(2).toFixed(2)} at 2 GHz.`, height: 250,
});

const out = {
  lam: +s.lam.toFixed(4), ae: +s.ae.toFixed(0), gain: +s.gain.toFixed(3), sefd: +s.sefd.toFixed(1), hpbw14: +(s.hpbw * 180 / Math.PI).toFixed(3),
  tsysOverEta: +(TSYS / ETA).toFixed(1), tsysOverEtaMb: +(TSYS / ETA_MB).toFixed(2),
  sigJy_mJy: +(sigJy * 1e3).toFixed(1), perBeam_mK: Object.fromEntries(Object.entries(perBeam).map(([k, v]) => [k, +(v * 1e3).toFixed(1)])), cube_mK: +(cube * 1e3).toFixed(1),
  dv: +dv.toFixed(4), nhi: nhi.toExponential(2), nhiPaper: nhiPaper.toExponential(2), perMHz: +perMHz.toFixed(2),
  ngc: Object.fromEntries(Object.entries(ngc).map(([k, v]) => [k, Math.round(v)])),
  with25K_mK: +(1e3 * 25 / Math.sqrt(2 * CH * T_PT)).toFixed(2), cube25_mK: +(1e3 * 25 / Math.sqrt(2 * CH * T_PT) / Math.sqrt(WEIGHT)).toFixed(1),
  tFor10mK: Math.round(T_PT * (perBeam.tmbD / 0.010) ** 2),
  toolCheck: { sigma1min_mJy: +(s.sigma(60) * 1e3).toFixed(1), sigma80_mJy: +(s.sigma(80) * 1e3).toFixed(1), beamArcmin: +(s.hpbw * 180 * 60 / Math.PI).toFixed(1) },
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'noise', figure(fig1, 'Figure 1. Noise per beam in one 5 kHz channel against integration time, from the radiometer equation in the Radio telescope calculator (64 m dish, Tsys 17 K, both polarisations), shown as a sky brightness temperature with the two efficiencies the paper gives. The dot is the paper\'s stated 28 mK for an 80 s pointing.'));
  md = inject(md, 'beam', figure(fig2, 'Figure 2. Half-power beam width of a 64 m dish across the receiver\'s 0.7 to 2 GHz range, from the tool\'s 1.2 λ/D rule. The dot is the paper\'s stated beam of about 0.24° at 1.4 GHz; the dashed line is the 0.14° spacing between neighbouring beams.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
