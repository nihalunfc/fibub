// Figures for src/blog/discoveries/voyager-1-interstellar-electron-density-0-147-plasma-frequency.md, made with the maths
// of the Plasma parameter calculator (src/lib/sci/phplasma.ts) and the Link budget calculator (src/lib/sci/linkbudget.ts).
// Run: node scripts/blog-figures/voyager-1-interstellar-electron-density-0-147-plasma-frequency.mjs
import fs from 'node:fs';
import { plasma, EV_K } from '../../src/lib/sci/phplasma.ts';
import { fspl, C } from '../../src/lib/sci/linkbudget.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/voyager-1-interstellar-electron-density-0-147-plasma-frequency.md', import.meta.url);

// From the paper (Kurth 2024, ApJL 963: L6, doi:10.3847/2041-8213/ad2617, CC BY 4.0): density about 0.147 cm^-3,
// steady since a pressure pulse in 2020 (day ~146) at about 149 au; densities measured out to 161.4 au.
const NE_CM3 = 0.147, AU = 1.495978707e11;
// OUR ASSUMPTIONS: electron and ion temperature 7000 K (the usual figure for the local interstellar cloud), a field of
// 0.5 nT (the size Voyager 1's magnetometer has reported beyond the heliopause), protons as the ions (A = 1, Z = 1).
const T_K = 7000, B_T = 0.5e-9;
const P = (neCm3, TK = T_K, B = B_T) => plasma({ ne: neCm3 * 1e6, Te: TK / EV_K, Ti: TK / EV_K, B, A: 1, Z: 1 });

const v = P(NE_CM3);
const hot = P(NE_CM3, 30000);
const inv = (fHz) => (fHz / v.fpe) ** 2 * NE_CM3; // density for a given plasma frequency (fpe ∝ √ne)
const light = (au) => (au * AU) / C; // one-way light time, s
const oneDayAU = (86400 * C) / AU;
const X_BAND = 8.4e9; // Voyager's X-band downlink, Hz (NASA)

const out = {
  fpe_kHz: +(v.fpe / 1e3).toFixed(3), lambdaD_m: +v.lambdaD.toFixed(2), ND: +v.ND.toPrecision(3), lnL: +v.lnL.toFixed(2),
  fce_Hz: +v.fce.toFixed(2), rLe_km: +(v.rLe / 1e3).toFixed(2), rLi_km: +(v.rLi / 1e3).toFixed(0), vA_kms: +(v.vA / 1e3).toFixed(1),
  cs_kms: +(v.cs / 1e3).toFixed(1), beta: +v.beta.toPrecision(3), mfpE_au: +(v.mfpE / AU).toPrecision(3), pressure_Pa: +v.pressure.toPrecision(3),
  hallE: +v.hallE.toPrecision(3), skinE_km: +(v.skinE / 1e3).toFixed(2),
  hot30k: { lambdaD_m: +hot.lambdaD.toFixed(2), fpe_kHz: +(hot.fpe / 1e3).toFixed(3), beta: +hot.beta.toPrecision(3), mfpE_au: +(hot.mfpE / AU).toPrecision(3) },
  ne_for_3kHz: +inv(3000).toFixed(4), ne_for_2kHz: +inv(2000).toFixed(4), ne_for_2_6kHz: +inv(2600).toFixed(4),
  fpe_at_0_08: +(P(0.08).fpe / 1e3).toFixed(3), fpe_at_0_1: +(P(0.1).fpe / 1e3).toFixed(3),
  light_h: { 149: +(light(149) / 3600).toFixed(2), 161.4: +(light(161.4) / 3600).toFixed(2) },
  oneDayAU: +oneDayAU.toFixed(2),
  fspl_dB: { 149: +fspl(149 * AU, X_BAND).toFixed(2), 161.4: +fspl(161.4 * AU, X_BAND).toFixed(2), day: +fspl(oneDayAU * AU, X_BAND).toFixed(2), '1au': +fspl(AU, X_BAND).toFixed(2) },
};
console.log(JSON.stringify(out, null, 1));

const dens = Array.from({ length: 121 }, (_, i) => 0.04 + (i * 0.16) / 120);
const fig1 = chart({
  title: 'The plasma frequency Voyager 1 listens for', xLabel: 'Electron density (per cm³)', yLabel: 'Plasma frequency (kHz)',
  series: [{ name: 'Electron plasma frequency fpe', kind: 'line', x: dens, y: dens.map((n) => P(n).fpe / 1e3) }],
  xDomain: [0.04, 0.2], yDomain: [1.5, 4.2], yTicks: [1.5, 2, 2.5, 3, 3.5, 4],
  vlines: [{ x: NE_CM3, text: '0.147 per cm³' }], hlines: [{ y: v.fpe / 1e3, text: `${(v.fpe / 1e3).toFixed(2)} kHz` }],
  desc: 'Electron plasma frequency against electron density from 0.04 to 0.2 per cubic centimetre. At the 0.147 per cubic centimetre Voyager 1 has measured since 2020, the plasma frequency is 3.44 kilohertz.',
  height: 270,
});

const dist = Array.from({ length: 121 }, (_, i) => 120 + i * 0.5);
const fig2 = chart({
  title: 'Distance, light time and path loss at X band', xLabel: 'Distance from Earth (au)', yLabel: 'Free-space loss at 8.4 GHz (dB)',
  series: [{ name: 'Free-space path loss', kind: 'line', x: dist, y: dist.map((d) => fspl(d * AU, X_BAND)) }],
  xDomain: [120, 180], yDomain: [316.5, 319.5], yTicks: [317, 318, 319],
  vlines: [{ x: 149, text: '149 au, 20.7 h' }, { x: 161.4, text: '161.4 au, 22.4 h', dy: 14 }, { x: oneDayAU, text: '1 light-day', dy: 28 }],
  desc: 'Free-space path loss at 8.4 gigahertz against distance from 120 to 180 astronomical units. The loss rises from about 317 to 319.3 decibels; at one light-day, 173.1 au, it is 319.2 decibels.',
  height: 260,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fpe', figure(fig1, 'Figure 1. The electron plasma frequency worked out with the Plasma parameter calculator\'s maths. The paper\'s steady density of 0.147 per cm³ sits at 3.44 kHz; because the frequency grows as the square root of density, a 10 % change in density moves the line by only about 5 %.'));
  md = inject(md, 'link', figure(fig2, 'Figure 2. Free-space path loss at Voyager\'s 8.4 GHz downlink, from the Link budget calculator\'s maths, with the one-way light time at the paper\'s two distances. Going from 149 au to one light-day adds only 1.3 dB: distance in a link budget counts in decibels, not in kilometres.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
