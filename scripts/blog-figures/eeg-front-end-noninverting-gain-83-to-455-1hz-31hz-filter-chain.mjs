// Figures for src/blog/discoveries/eeg-front-end-noninverting-gain-83-to-455-1hz-31hz-filter-chain.md, made with the maths of
// the Op-amp circuit calculator (src/lib/sci/eng-opamp.ts) and the Analog filter designer (src/lib/sci/eng-filter.ts).
// Run: node scripts/blog-figures/eeg-front-end-noninverting-gain-83-to-455-1hz-31hz-filter-chain.mjs
import fs from 'node:fs';
import * as O from '../../src/lib/sci/eng-opamp.ts';
import * as F from '../../src/lib/sci/eng-filter.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/eeg-front-end-noninverting-gain-83-to-455-1hz-31hz-filter-chain.md', import.meta.url);

// Values printed by Saptono, Wahyudi and Irawan (2016), MATEC Web of Conferences 75: 04003, doi:10.1051/matecconf/20167504003 (CC BY 4.0):
// non-inverting stage with a fixed 220 ohm resistor plus a 0 to 1000 ohm potentiometer to ground, gain from about 83 to about 455;
// feedback R3 = 100 kohm implied by their sums; 10 nF in parallel with 100 kohm for a low-pass corner near 160 Hz; a 1 Hz high-pass
// from R3 and C2; a low-pass stage with gain 0.71 at 31.23 Hz and roughly a 100-fold fall by 300 Hz. Target passband 1 to 30 Hz.
const RF = 100e3, RFIX = 220, RPOT = 1000, CF = 10e-9, FHP = 1, FLP = 31.23, GBW = 1e6; // GBW: OUR assumption for a general-purpose op-amp
const gain = (pot) => O.gainOf('noninv', RFIX + pot, RF);
const db = (z) => 20 * Math.log10(Math.hypot(z.re, z.im));
const W = (f) => 2 * Math.PI * f;

const gMax = gain(0), gMin = gain(RPOT);
const fPole = 1 / (2 * Math.PI * RF * CF);
const cHp = 1 / (2 * Math.PI * RF * FHP);
// real op-amp bandwidth of the stage at both ends of the pot (single-pole model)
const bwMax = O.bandwidth(GBW, O.noiseGain({ config: 'noninv', r1: RFIX, rf: RF })), bwMin = O.bandwidth(GBW, O.noiseGain({ config: 'noninv', r1: RFIX + RPOT, rf: RF }));
const gAt30 = (pot) => db(O.realGains({ config: 'noninv', r1: RFIX + pot, rf: RF }, W(30), GBW)[0]) - 20 * Math.log10(gain(pot));
// filters: first-order high-pass at 1 Hz, low-pass of order n at 31.23 Hz (Butterworth, -3 dB at the corner)
const hp = F.stages(1, 'butter'), lps = [1, 2, 3].map((n) => F.stages(n, 'butter'));
const chain = (n, f) => db(F.response(hp, 'hp', W(FHP), W(f))) + db(F.response(lps[n - 1], 'lp', W(FLP), W(f)));
const lpOnly = (n, f) => db(F.response(lps[n - 1], 'lp', W(FLP), W(f)));
const atten300 = [1, 2, 3].map((n) => 10 ** (-lpOnly(n, 300) / 20));
const minN = F.minOrder('butter', 1, 40, 300 / FLP);
const sk = F.sallenKey(lps[1], 'lp', W(FLP), 1e-6)[0];
const fs_ = Array.from({ length: 161 }, (_, i) => 10 ** (-1 + i * 0.0225)); // 0.1 to ~4000 Hz... trimmed below
const freqs = fs_.filter((f) => f <= 1000);
const logx = (a) => a.map(Math.log10);
const lg = [0.1, 1, 10, 100, 1000];
const fig1 = chart({
  title: 'Filter chain: which low-pass order fits?', xLabel: 'Frequency (Hz)', yLabel: 'Gain relative to the passband (dB)',
  series: [1, 2, 3].map((n, i) => ({ name: `Order ${n}`, x: logx(freqs), y: freqs.map((f) => chain(n, f)), colour: ['var(--c-tools)', 'var(--c-blog)', 'var(--muted)'][i] })).concat([
    { name: 'Paper', kind: 'dots', x: logx([FLP, 300]), y: [-3.01, -40], size: 5, colour: 'var(--ink)' }]),
  xDomain: [-1, 3], yDomain: [-70, 5], xTicks: [-1, 0, 1, 2, 3], xFmt: (v) => String(10 ** v), yFmt: (v) => String(v),
  vlines: [{ x: Math.log10(FLP), text: '31.23 Hz' }],
  desc: 'Gain of a first-order 1 Hz high-pass followed by a Butterworth low-pass of order 1, 2 or 3 with its corner at 31.23 Hz, against frequency on a log axis, with the paper’s two stated points (minus 3 dB at 31.23 Hz and about minus 40 dB at 300 Hz) as dots.',
});
const pots = Array.from({ length: 51 }, (_, i) => i * 20);
const fig2 = chart({
  title: 'Gain of the potentiometer stage', xLabel: 'Potentiometer setting (Ω to ground)', yLabel: 'Voltage gain (×)',
  series: [{ name: 'Gain', x: pots, y: pots.map(gain) }, { name: 'Paper', kind: 'dots', x: [0, 1000], y: [455, 83], size: 5, colour: 'var(--ink)' }],
  xDomain: [0, 1000], yDomain: [0, 500],
  desc: 'Voltage gain of a non-inverting amplifier with a 100 kilohm feedback resistor and a 220 ohm resistor plus potentiometer to ground, against the potentiometer setting, with the paper’s gains of about 455 and 83 as dots.',
});
const out = { gMax, gMin, fPole, cHp_uF: cHp * 1e6, bwMax, bwMin, drop30max_dB: gAt30(0), drop30min_dB: gAt30(RPOT), atten300, chain31: [1, 2, 3].map((n) => chain(n, 31.23)), lp31: [1, 2, 3].map((n) => lpOnly(n, 31.23)),
  lp300: [1, 2, 3].map((n) => lpOnly(n, 300)), minN, sk: { f0: sk.f0, q: sk.q, r: sk.r1, c1: sk.c1, c2: sk.c2 },
  chain1: chain(2, 1), chain10: chain(2, 10), chain30: chain(2, 30), chain50: chain(2, 50), chain50Hz_order2: chain(2, 50), hp1: db(F.response(hp, 'hp', W(1), W(0.1))), hp01: db(F.response(hp, 'hp', W(1), W(1))),
  lp30_2: lpOnly(2, 30), lp50_2: lpOnly(2, 50), lp50_3: lpOnly(3, 50), lp300_2dB: lpOnly(2, 300) };
console.log(JSON.stringify(out, (k, v) => typeof v === 'number' ? +v.toPrecision(5) : v));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'chain', figure(fig1, 'Figure 1. A 1 Hz first-order high-pass followed by a Butterworth low-pass whose corner is 31.23 Hz, for three possible orders, from the Analog filter designer’s maths. Dots: the paper’s two stated points. Only order 2 passes close to both.'));
  md = inject(md, 'gain', figure(fig2, 'Figure 2. Gain of the non-inverting stage as the potentiometer is turned, from the Op-amp circuit calculator’s maths. Dots: the paper’s two stated end gains.'));
  fs.writeFileSync(ART, md);
  console.log('Charts:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
