// Round 4 extras for adc-dac: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const alias = (f, fs) => { const a = ((f % fs) + fs) % fs; return a > fs / 2 ? fs - a : a; };

export default {
  items: [
    { id: 'adc-r4-01', type: 'mcq', level: 1, exams: A, sub: 'resolution',
      q: R`The percentage resolution of an 8-bit DAC (one step as a fraction of the full-scale output) is about`,
      options: [R`$12.5\%$`, R`$3.9\%$`, R`$0.39\%$`, R`$0.80\%$`], answer: 2,
      sol: R`An 8-bit DAC has $2^8 - 1 = 255$ steps from zero to full scale, so one step is $1/255 = 0.39\%$ of full scale.`,
      trap: R`$1/8 = 12.5\%$ divides by the number of bits instead of the number of steps.` },
    { id: 'adc-r4-02', type: 'mcq', level: 2, exams: G, sub: 'ADC types',
      q: R`An 8-bit two-step (half-flash) ADC converts the upper 4 bits with a 4-bit flash ADC, subtracts the DAC value of that result, and converts the remainder with a second 4-bit flash ADC. Its total number of comparators is`,
      options: [R`$30$`, R`$255$`, R`$16$`, R`$510$`], answer: 0,
      sol: R`A 4-bit flash needs $2^4 - 1 = 15$ comparators, so two of them need $30$, against $2^8 - 1 = 255$ for a full 8-bit flash. The price is a second conversion step and an accurate DAC and subtractor between the steps.`,
      trap: R`Counting $2^4 = 16$ per flash, or using 255 as if it were a single flash.` },
    { id: 'adc-r4-03', type: 'nat', level: 2, exams: A, sub: 'ADC types',
      q: R`A single-slope ADC starts a counter clocked at $1.0$ MHz when an analogue ramp of $1.0$ V/ms starts from 0 V, and stops it when the ramp reaches the input. For an input of $2.5$ V the final count is ______.`,
      answer: 2500, tol: 0, calc: () => 2.5 / 1.0 * 1e-3 * 1e6,
      sol: R`The ramp reaches $2.5$ V after $2.5/1.0 = 2.5$ ms. At $10^6$ counts per second the counter reaches $2.5\times10^{-3}\times10^6 = 2500$. The result depends directly on the ramp slope and clock, which is why the dual-slope design (which cancels them) is preferred for accuracy.`,
      trap: R`Using the clock period in ms and the time in s (or the reverse) gives an answer off by $10^3$.` },
    { id: 'adc-r4-04', type: 'nat', level: 3, exams: G, sub: 'sample and hold',
      q: R`A sample-and-hold charges a $100$ pF hold capacitor through a switch of on-resistance $50\ \Omega$. For a full-scale step, the shortest acquisition time that brings it within half an LSB of a 12-bit result is ______ ns (to one decimal place).`,
      answer: 45.1, tol: 0.2, calc: () => 50 * 100e-12 * Math.log(2 ** 13) * 1e9,
      sol: R`The error after time $t$ is $V_{FS}e^{-t/RC}$. Half an LSB of 12 bits is $V_{FS}/2^{13}$, so $t = RC\ln2^{13} = 13\ln2\times RC = 9.01\times(50\times100\times10^{-12}) = 9.01\times5.0$ ns $= 45.1$ ns.`,
      trap: R`Settling to 1 LSB ($\ln2^{12}$) or using $1/2$ of $2^{12}$ inside the logarithm wrongly; each extra bit adds $0.69RC$.` },
    { id: 'adc-r4-05', type: 'mcq', level: 3, exams: G, sub: 'converter errors',
      q: R`An 8-bit ADC with a $1.000$ V full-scale range is tested. After gain and offset are corrected, its worst code transition lies $6$ mV from the ideal straight line. Its integral non-linearity is about`,
      options: [R`$0.6$ LSB`, R`$1.5$ LSB`, R`$6$ LSB`, R`$0.15$ LSB`], answer: 1,
      sol: R`One LSB is $1.000/2^8 = 3.91$ mV. INL $= 6/3.91 = 1.5$ LSB. INL is the deviation of the transfer curve from a straight line, measured after gain and offset errors are removed; DNL is the error in the width of each step.`,
      trap: R`Expressing the error as a percentage of full scale ($0.6\%$) and calling it LSB.` },
    { id: 'adc-r4-06', type: 'mcq', level: 4, exams: G, sub: 'reconstruction',
      q: R`A DAC holds each sample for one full sample period (a zero-order hold) before a reconstruction filter. Compared with low frequencies, a sine wave just below half the sample rate comes out of the hold attenuated by about`,
      options: [R`$0$ dB`, R`$-6$ dB`, R`$-1.0$ dB`, R`$-3.9$ dB`], answer: 3,
      sol: R`The hold has impulse response a rectangle of width $T_s$, whose frequency response is $\dfrac{\sin(\pi f/f_s)}{\pi f/f_s}$. At $f = f_s/2$ that is $\sin(\pi/2)/(\pi/2) = 2/\pi = 0.637$, or $20\log_{10}0.637 = -3.9$ dB. Audio DACs correct this "sinc droop" with a slight treble boost or by oversampling.`,
      trap: R`Assuming the hold is flat: it is a filter in its own right.` },
    { id: 'adc-r4-07', type: 'msq', level: 3, exams: G, sub: 'sampling', format: 'statements',
      q: R`Which statements about anti-aliasing and reconstruction filters are correct?`,
      options: [R`An anti-aliasing filter must act before sampling; once a component has aliased, no later digital filter can tell it apart from a genuine in-band signal.`, R`Sampling faster than the minimum lets the anti-aliasing filter roll off more gently.`, R`A reconstruction filter after a DAC removes the images of the signal around multiples of the sample rate.`, R`Aliased components can be removed after sampling with a high-pass filter.`], answer: [0, 1, 2],
      sol: R`After sampling, an out-of-band tone at $f$ lands at an in-band frequency and is indistinguishable from real signal there, so filtering must come first. Oversampling widens the gap between the signal band and the first frequency that would alias into it, so a gentler (cheaper, better-phase) filter suffices. The DAC's stepped output contains copies of the spectrum around $kf_s$; the reconstruction filter removes them.`,
      trap: R`An alias sits inside the signal band, so no filter applied afterwards can separate it.` },
    { id: 'adc-r4-08', type: 'msq', level: 4, exams: G, sub: 'quantisation', format: 'statements',
      q: R`A small random noise (dither) of about one LSB rms is added to a slowly varying signal before an ADC. Which statements are correct?`,
      options: [R`The quantisation error becomes nearly independent of the signal instead of a fixed function of it.`, R`Averaging many dithered samples can recover a DC level to a fraction of an LSB.`, R`Each individual sample is noisier than it would be without dither.`, R`Dither reduces the number of comparators the ADC needs.`], answer: [0, 1, 2],
      sol: R`Without dither, a slowly varying input always rounds the same way at the same level, so the error is a deterministic staircase function of the signal (harmonic distortion, dead zones). Dither makes the rounding random, so the error behaves like noise; the average output then follows the input smoothly, and averaging $N$ samples beats the LSB. The price is a little more noise per sample. The converter hardware is unchanged.`,
      trap: R`Adding noise can improve resolution after averaging, but it never makes a single sample cleaner.` },
    { id: 'adc-r4-09', type: 'mcq', level: 5, exams: G, sub: 'quantisation',
      q: R`An ideal 12-bit ADC digitises a full-scale sine wave, and a $4096$-point FFT of the result is computed. The quantisation noise is spread evenly over the FFT bins. Relative to full scale, the noise floor seen in each bin is at about`,
      options: [R`$-74$ dBFS`, R`$-107$ dBFS`, R`$-110$ dBFS`, R`$-140$ dBFS`], answer: 1,
      sol: R`Total quantisation noise is $6.02\times12 + 1.76 = 74.0$ dB below the full-scale sine. The FFT splits it over $N/2 = 2048$ bins, so each bin holds $10\log_{10}2048 = 33.1$ dB less: about $-107$ dBFS. That is why an FFT plot of a 12-bit ADC shows a floor far below the SNR, and why the bin count must be stated with it.`,
      trap: R`Reading the noise floor as the SNR ($-74$ dBFS) ignores the FFT's processing gain.` },
    { id: 'adc-r4-10', type: 'nat', level: 4, exams: G, sub: 'DAC',
      q: R`An 8-bit multiplying DAC is used as a digitally set attenuator: its output is $V_{in}D/256$ for code $D$. At code $D = 64$, the attenuation is ______ dB (give the sign; to two decimal places).`,
      answer: -12.04, tol: 0.02, calc: () => 20 * Math.log10(64 / 256),
      sol: R`Gain $= 64/256 = 0.25$, and $20\log_{10}0.25 = -12.04$ dB. Each halving of the code takes off $6.02$ dB, so code 64 is two halvings below 256. Small codes give coarse steps in dB: code 1 is $-48.2$ dB and code 2 is $-42.1$ dB.`,
      trap: R`Using $10\log_{10}$ (a power ratio) for a voltage ratio gives $-6.02$ dB.` },
    { id: 'adc-r4-11', type: 'mcq', level: 4, exams: G, sub: 'aliasing',
      q: R`A $3$ kHz square wave (odd harmonics at $3$, $9$, $15$, ... kHz) is sampled at $10$ kHz with no anti-aliasing filter. Within $0$ to $5$ kHz, the components from its first three harmonics appear at`,
      options: [R`$3$, $9$ and $15$ kHz`, R`$3$ kHz only`, R`$3$, $1$ and $5$ kHz`, R`$3$, $4$ and $0$ kHz`], answer: 2,
      sol: R`Each frequency folds to its distance from the nearest multiple of $f_s = 10$ kHz: $3\to3$ kHz; $9\to|10 - 9| = 1$ kHz; $15\to|15 - 10| = 5$ kHz. Higher harmonics keep folding in too (for example $21\to1$ kHz), so the sampled square wave is badly distorted.`,
      trap: R`Harmonics above the Nyquist frequency do not vanish; they fold back into the band.` },
    { id: 'adc-r4-12', type: 'nat', level: 5, exams: G, sub: 'anti-aliasing',
      q: R`Audio up to $20$ kHz is sampled at $48$ kHz. A Butterworth anti-aliasing filter with its $-3$ dB point at $20$ kHz must attenuate by at least $60$ dB at $28$ kHz, the lowest frequency that aliases into the audio band. The smallest filter order is ______.`,
      answer: 21, tol: 0, calc: () => Math.ceil(Math.log10(1e6 - 1) / (2 * Math.log10(28 / 20))),
      sol: R`Anything above $48 - 20 = 28$ kHz lands below $20$ kHz after sampling. A Butterworth filter has $|H|^2 = 1/[1 + (f/f_c)^{2n}]$, so we need $(1.4)^{2n}\ge10^6 - 1$: $2n\log_{10}1.4\ge6.0$, $n\ge6.0/(2\times0.1461) = 20.5$, so $n = 21$. Such a filter is impractical in analogue form, which is why audio ADCs oversample and filter digitally.`,
      trap: R`Measuring the stop band from $24$ kHz (half the sample rate) instead of $28$ kHz, the first frequency that aliases into the band.` },
  ],
  gens: [
    { id: 'adc-r4g1', type: 'nat', level: 3, exams: G, sub: 'sample and hold',
      make(r) {
        const Rs = choose(r, [10, 20, 25, 50, 100, 200]), C = choose(r, [10, 20, 47, 100, 220]), N = int(r, 8, 16);
        const t = Rs * C * 1e-3 * Math.log(2 ** (N + 1)); // ns
        return { q: `A sample-and-hold charges a $${C}$ pF capacitor through $${Rs}\\ \\Omega$. After a full-scale step, the time to settle within half an LSB of ${N === 8 || N === 11 ? 'an' : 'a'} ${N}-bit converter is ______ ns (to two decimal places).`,
          answer: round(t, 2), tol: Math.max(0.01, round(t * 0.003, 2)), Rs, C, N,
          sol: `$RC = ${Rs}\\times${C}\\times10^{-12} = ${round(Rs * C * 1e-3, 4)}$ ns. Need $e^{-t/RC}\\le2^{-(${N} + 1)}$, so $t = RC\\ln2^{${N + 1}} = ${round(Rs * C * 1e-3, 4)}\\times${round(Math.log(2 ** (N + 1)), 3)} = ${round(t, 2)}$ ns.`,
          trap: 'Half an LSB of N bits is $2^{-(N+1)}$ of full scale, not $2^{-N}$.' };
      },
      verify: (p) => p.Rs * p.C * 1e-3 * Math.log(2 ** (p.N + 1)) },
    { id: 'adc-r4g2', type: 'mcq', level: 4, exams: G, sub: 'aliasing',
      make(r) {
        const fs = choose(r, [8, 10, 12, 16, 20]), f0 = int(r, Math.ceil(fs / 6), Math.floor(fs / 2) - 1) + choose(r, [0, 0.5]);
        const h = [f0, 3 * f0, 5 * f0], ali = h.map((f) => +alias(f, fs).toFixed(2));
        const fmt = (a) => a.map((x) => `$${x}$`).join(', ') + ' kHz';
        const cands = [h, h.map((f) => +((f % fs)).toFixed(2)), [f0], h.map((f) => +Math.abs(fs / 2 - (f % (fs / 2))).toFixed(2)), ali.map((x) => +(fs / 2 - x).toFixed(2)), [...ali].reverse(), [ali[0], ...h.slice(1)], [ali[0], ali[1], h[2]]];
        const wr = []; for (const c of cands) { const s = fmt(c); if (s !== fmt(ali) && !wr.includes(s)) wr.push(s); }
        const o = mcqOptions(r, fmt(ali), wr, (v) => v);
        return { q: `A $${f0}$ kHz square wave is sampled at $${fs}$ kHz with no anti-aliasing filter. Its fundamental and its 3rd and 5th harmonics appear, in that order, at`, ...o,
          sol: `The harmonics are at ${h.join(', ')} kHz. Each folds into $0$ to $${fs / 2}$ kHz: take the remainder after removing whole multiples of $${fs}$ kHz, and if it exceeds $${fs / 2}$ kHz subtract it from $${fs}$ kHz. Result: ${fmt(ali)}.`,
          trap: 'Removing multiples of the sample rate without the final fold about half the sample rate.' };
      } },
    { id: 'adc-r4g3', type: 'nat', level: 5, exams: G, sub: 'anti-aliasing',
      make(r) {
        const fc = choose(r, [5, 10, 15, 20, 25]), k = choose(r, [2.4, 3, 4, 5, 8]), Adb = choose(r, [40, 50, 60, 72, 80]);
        const fs = fc * k, fstop = fs - fc;
        const n = Math.ceil(Math.log10(10 ** (Adb / 10) - 1) / (2 * Math.log10(fstop / fc)));
        return { q: `A signal band up to $${fc}$ kHz is sampled at $${round(fs, 2)}$ kHz. A Butterworth anti-aliasing filter with its $-3$ dB point at $${fc}$ kHz must give at least $${Adb}$ dB attenuation at every frequency that would alias into the signal band. The smallest filter order is ______.`,
          answer: n, tol: 0, fc, fs, Adb,
          sol: `The lowest frequency that aliases into the band is $f_s - f_c = ${round(fstop, 2)}$ kHz. Need $1 + (${round(fstop, 2)}/${fc})^{2n}\\ge10^{${Adb}/10}$, so $n\\ge\\dfrac{\\log_{10}(10^{${Adb / 10}} - 1)}{2\\log_{10}${round(fstop / fc, 3)}} = ${round(Math.log10(10 ** (Adb / 10) - 1) / (2 * Math.log10(fstop / fc)), 2)}$; round up to $${n}$.`,
          trap: 'Putting the stop band at $f_s/2$ instead of $f_s - f_c$, or rounding the order down.' };
      },
      verify: (p) => Math.ceil(Math.log10(10 ** (p.Adb / 10) - 1) / (2 * Math.log10((p.fs - p.fc) / p.fc))) },
  ],
};
