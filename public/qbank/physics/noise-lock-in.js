// Noise, filtering and lock-in detection (CSIR NET Part C experimental methods): Johnson, shot and 1/f noise,
// noise spectral density and bandwidth, RC filters and noise-equivalent bandwidth, kT/C noise, decibels, noise figure,
// noise temperature and the Friis formula, signal averaging, sampling, aliasing and ADC quantisation, lock-in
// amplifiers (mixing, phase, X/Y/R, square-wave references, time constants, dynamic reserve) and boxcar averaging.
// Original questions for CSIR NET (and GATE) practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './noise-lock-in.more.gen.js';
import more2 from './noise-lock-in.more2.gen.js';
import r4 from './noise-lock-in.r4.gen.js';
import r5 from './noise-lock-in.r5.gen.js';

const KB = 1.380649e-23, QE = 1.602176634e-19;
const s3 = (x) => +x.toPrecision(3), t6 = (x) => +(Math.abs(x) * 0.006).toPrecision(2);
const RES = [[50, '50 Ω'], [1e3, '1 kΩ'], [10e3, '10 kΩ'], [47e3, '47 kΩ'], [100e3, '100 kΩ'], [1e6, '1 MΩ'], [10e6, '10 MΩ']];

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'noise-lock-in',
  items: [
    // ---------- level 1 ----------
    { id: 'nli-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: 'The thermal (Johnson-Nyquist) noise voltage across a resistor depends on',
      options: ['the current through it', 'its temperature, its resistance and the measurement bandwidth', 'the material it is made of', 'only the bandwidth'], answer: 1,
      sol: '$\\overline{v^2} = 4k_BTRB$: thermal agitation of the carriers in any resistance at temperature $T$, measured over bandwidth $B$. It is there with no current flowing and is the same for a carbon or a metal resistor of the same value.',
      trap: 'Noise that grows with current is shot noise or excess (1/f) noise, not Johnson noise.' },
    { id: 'nli-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'shot noise',
      q: 'Shot noise in a photodiode current arises because',
      options: ['the diode is warm', 'the junction capacitance charges and discharges', 'charge arrives as discrete, independent electrons', 'the light intensity drifts slowly'], answer: 2,
      sol: 'A current made of independent charges $e$ arriving at random has Poisson fluctuations: $\\overline{i^2} = 2eIB$. It needs a current crossing a barrier (a junction or vacuum gap) and is white up to very high frequencies.',
      trap: 'Shot noise is absent in a resistor carrying current in equilibrium; there only Johnson noise appears.' },
    { id: 'nli-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'noise spectra',
      q: 'Noise whose power spectral density falls as $1/f$ has',
      options: ['equal power in every 1 Hz band', 'no power below 1 Hz', 'power only at multiples of the mains frequency', 'equal power in every decade of frequency'], answer: 3,
      sol: 'Power in a band $f_1$ to $f_2$ is $\\int A\\,df/f = A\\ln(f_2/f_1)$: the same for 1 to 10 Hz as for 1 to 10 kHz. White noise has equal power per hertz instead. 1/f noise dominates at low frequencies, which is why weak signals are moved to higher frequencies by chopping.',
      trap: 'Equal power per hertz describes white noise.' },
    { id: 'nli-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'signal averaging',
      q: 'A repetitive signal buried in random noise is averaged over 100 sweeps. The signal-to-noise ratio (in amplitude) improves by a factor of',
      options: ['100', '10', '50', '2'], answer: 1,
      sol: 'The signal adds coherently ($\\propto N$) while uncorrelated noise adds in quadrature ($\\propto\\sqrt N$), so SNR $\\propto\\sqrt N = 10$.',
      trap: 'Averaging gains only as the square root of the number of repetitions.' },
    { id: 'nli-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'decibels',
      q: 'An amplifier has a voltage gain of 20 dB. Its output voltage is larger than the input by a factor of',
      options: ['20', '100', '10', '$\\sqrt{20}$'], answer: 2,
      sol: 'For voltages, dB $= 20\\log_{10}(V_2/V_1)$, so 20 dB is a factor of 10 in voltage (and 100 in power).',
      trap: '100 is the power ratio; 10 log is for power, 20 log for voltage.' },
    { id: 'nli-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'sampling',
      q: 'An audio signal contains frequencies up to 20 kHz. To digitise it without aliasing, the sampling rate must exceed',
      options: ['40 kHz', '20 kHz', '10 kHz', '80 kHz'], answer: 0,
      sol: 'The Nyquist criterion: sample faster than twice the highest frequency present, here 40 kHz (CD audio uses 44.1 kHz, with an anti-aliasing filter in front).',
      trap: 'Sampling at exactly the signal frequency sees a sine as a constant.' },

    // ---------- level 2 ----------
    { id: 'nli-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: 'The rms Johnson noise voltage of a 1.0 MΩ resistor at 300 K measured in a 10 kHz bandwidth is ______ μV (to one decimal place). Use $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 12.9, tol: 0.1, unit: 'μV', calc: () => Math.sqrt(4 * 1.381e-23 * 300 * 1e6 * 1e4) * 1e6,
      sol: '$v = \\sqrt{4k_BTRB} = \\sqrt{4\\times1.381\\times10^{-23}\\times300\\times10^6\\times10^4} = \\sqrt{1.657\\times10^{-10}} = 1.29\\times10^{-5}$ V $= 12.9$ μV.',
      trap: 'Remember the factor 4, and take the square root at the end.' },
    { id: 'nli-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'shot noise',
      q: 'A DC current of 1.0 mA flows through a photodiode. Its shot-noise current density is ______ pA/$\\sqrt{\\text{Hz}}$ (to one decimal place).',
      answer: 17.9, tol: 0.1, unit: 'pA/√Hz', calc: () => Math.sqrt(2 * 1.602e-19 * 1e-3) * 1e12,
      sol: '$i_n = \\sqrt{2eI} = \\sqrt{2\\times1.602\\times10^{-19}\\times10^{-3}} = 1.79\\times10^{-11}$ A/$\\sqrt{\\text{Hz}}$ $= 17.9$ pA/$\\sqrt{\\text{Hz}}$.',
      trap: 'Shot noise grows as the square root of the current, so the relative noise falls as the current rises.' },
    { id: 'nli-009', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'filters',
      q: 'An RC low-pass filter has $R = 10$ kΩ and $C = 10$ nF. Its −3 dB frequency is',
      options: ['10 kHz', '159 Hz', '6.28 kHz', '1.59 kHz'], answer: 3,
      sol: '$RC = 10^4\\times10^{-8} = 10^{-4}$ s. $f_c = 1/(2\\pi RC) = 1/(6.283\\times10^{-4}) = 1.59$ kHz.',
      trap: '$1/RC = 10^4$ s$^{-1}$ is an angular frequency; divide by $2\\pi$ for hertz.' },
    { id: 'nli-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'A dual-phase lock-in shows $X = 0$ while $R = \\sqrt{X^2 + Y^2}$ is clearly non-zero. This means',
      options: ['there is no signal at the reference frequency', 'the signal is 90° out of phase with the reference', 'the time constant is too short', 'the signal is at twice the reference frequency'], answer: 1,
      sol: '$X = V\\cos\\phi$ and $Y = V\\sin\\phi$ (in the lock-in\'s rms convention). $X = 0$ with $R \\neq 0$ means $\\cos\\phi = 0$: the signal is in quadrature with the reference. Shifting the reference phase by 90° moves it all into $X$.',
      trap: 'A single-phase lock-in would show zero here and could fool you into thinking there is no signal.' },
    { id: 'nli-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'In an optical experiment the light is chopped at about 1 kHz and the detector signal is fed to a lock-in referenced to the chopper. The main reason is to',
      options: ['move the signal away from 1/f noise and slow drifts near zero frequency', 'increase the average light power', 'make the detector faster', 'remove shot noise completely'], answer: 0,
      sol: 'A DC measurement collects all the low-frequency noise (1/f, drifts, room light). Chopping puts the signal at 1 kHz, where the noise is mostly white and lower, and the lock-in measures only a narrow band around it.',
      trap: 'Shot noise is white, so chopping does not remove it; the narrow bandwidth only reduces how much of it is accepted.' },
    { id: 'nli-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: 'Which of these reduce the rms Johnson noise voltage of a resistive sensor at the amplifier input?',
      options: ['Cooling the sensor', 'Narrowing the measurement bandwidth', 'Using a smaller resistance (if the signal allows)', 'Increasing the bias current through it'], answer: [0, 1, 2],
      sol: '$v_n = \\sqrt{4k_BTRB}$: lower $T$, $R$ or $B$ all reduce it. The bias current does not enter Johnson noise (it can increase the signal and add excess noise).',
      trap: 'More current may raise the signal-to-noise ratio, but it does not reduce the Johnson noise itself.' },
    { id: 'nli-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'filters',
      q: 'A first-order RC low-pass filter attenuates a sine wave at ten times its corner frequency by about',
      options: ['3 dB', '10 dB', '40 dB', '20 dB'], answer: 3,
      sol: '$|H| = 1/\\sqrt{1 + (f/f_c)^2} = 1/\\sqrt{101} \\approx 0.0995$, which is $20\\log_{10}(0.0995) = -20.0$ dB. Far above the corner a first-order filter falls 20 dB per decade (6 dB per octave).',
      trap: '3 dB is the attenuation at the corner itself; 40 dB per decade needs a second-order filter.' },
    { id: 'nli-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ADC',
      q: 'The ideal signal-to-quantisation-noise ratio of a 12-bit ADC for a full-scale sine wave is about',
      options: ['48 dB', '74 dB', '86 dB', '72 dB'], answer: 1,
      sol: 'Quantisation noise has rms $\\Delta/\\sqrt{12}$; a full-scale sine has rms $2^N\\Delta/(2\\sqrt2)$. The ratio gives SNR $= 6.02N + 1.76$ dB $= 72.2 + 1.8 = 74.0$ dB.',
      trap: '72 dB is only the $6.02N$ part.' },
    { id: 'nli-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'sampling',
      q: 'A 7 kHz sine wave is sampled at 10 kHz with no anti-aliasing filter. The samples look like a sine of frequency',
      options: ['7 kHz', '17 kHz', '3 kHz', '1.5 kHz'], answer: 2,
      sol: 'Frequencies above the Nyquist frequency (5 kHz) fold back: $|7 - 10| = 3$ kHz. The samples of 7 kHz and 3 kHz sines are identical (up to sign).',
      trap: 'Aliases appear at $|f - kf_s|$, folded into the range 0 to $f_s/2$.' },
    { id: 'nli-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'signal averaging',
      q: 'Averaging 64 sweeps of a repetitive signal in white noise improves the amplitude signal-to-noise ratio by ______ dB (to one decimal place).',
      answer: 18.1, tol: 0.1, unit: 'dB', calc: () => 20 * Math.log10(8),
      sol: 'Amplitude SNR improves by $\\sqrt{64} = 8$; in decibels $20\\log_{10}8 = 18.06$ dB. (The power SNR improves by 64, which is the same 18.06 dB.)',
      trap: 'Using $10\\log_{10}8 = 9.0$ dB mixes a voltage ratio with the power formula.' },

    // ---------- level 3 ----------
    { id: 'nli-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'noise bandwidth',
      q: 'White noise passes through a first-order RC low-pass filter with $RC = 1.0$ ms. The noise-equivalent bandwidth (the width of the ideal rectangular filter passing the same noise power) is ______ Hz.',
      answer: 250, tol: 1, unit: 'Hz', calc: () => 1 / (4 * 1e-3),
      sol: '$B_{eq} = \\int_0^\\infty \\frac{df}{1 + (2\\pi fRC)^2} = \\frac{1}{2\\pi RC}\\cdot\\frac{\\pi}{2} = \\frac{1}{4RC} = 250$ Hz. It is $\\pi/2$ times the −3 dB frequency (159 Hz), because the response has a tail.',
      trap: 'Using the −3 dB frequency as the noise bandwidth underestimates the noise.' },
    { id: 'nli-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'A lock-in has a single-pole (6 dB/octave) output filter with time constant 300 ms. The input noise is white with density 10 nV/$\\sqrt{\\text{Hz}}$ around the reference frequency. The rms noise on the output is about',
      options: ['18 nV', '5.8 nV', '3.0 nV', '9.1 nV'], answer: 3,
      sol: 'ENBW of a single RC section $= 1/(4\\tau) = 1/1.2 = 0.83$ Hz. Noise $= 10\\ \\text{nV}/\\sqrt{\\text{Hz}}\\times\\sqrt{0.83\\ \\text{Hz}} = 9.1$ nV.',
      trap: 'The time constant sets the bandwidth through $1/4\\tau$, not $1/\\tau$ or $1/2\\pi\\tau$.' },
    { id: 'nli-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'A signal $2.0\\cos(\\omega t + 60^\\circ)$ mV is multiplied by a reference $\\cos\\omega t$ (unit amplitude) and the product is averaged over many cycles. The result is ______ mV (to two decimal places).',
      answer: 0.5, tol: 0.01, unit: 'mV', calc: () => 2 / 2 * Math.cos(Math.PI / 3),
      sol: '$\\cos(\\omega t + \\phi)\\cos\\omega t = \\tfrac12[\\cos\\phi + \\cos(2\\omega t + \\phi)]$. The $2\\omega$ term averages to zero, leaving $\\tfrac12V_s\\cos\\phi = \\tfrac12\\times2.0\\times0.5 = 0.50$ mV.',
      trap: 'The factor 1/2 from the product of two cosines is easy to drop.' },
    { id: 'nli-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'A dual-phase lock-in reads $X = 3.0$ μV and $Y = 4.0$ μV. The signal magnitude and its phase relative to the reference are',
      options: ['7.0 μV, 45°', '5.0 μV, 36.9°', '5.0 μV, 53.1°', '1.0 μV, 53.1°'], answer: 2,
      sol: '$R = \\sqrt{X^2 + Y^2} = 5.0$ μV and $\\theta = \\tan^{-1}(Y/X) = \\tan^{-1}(4/3) = 53.1°$.',
      trap: '36.9° is $\\tan^{-1}(X/Y)$, measured from the wrong axis.' },
    { id: 'nli-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'A lock-in uses a square-wave reference at frequency $f$ (switching the signal\'s sign each half cycle). Compared with a sinusoidal signal of the same amplitude at $f$, a signal at $3f$ in the right phase gives an output',
      options: ['equal to it', 'zero', 'three times larger', 'one third as large'], answer: 3,
      sol: 'A square wave contains $\\frac{4}{\\pi}[\\sin\\omega t + \\frac13\\sin3\\omega t + \\frac15\\sin5\\omega t + \\dots]$. Multiplying by the signal and averaging picks out the matching harmonic, so a $3f$ signal is weighted by 1/3 (and even harmonics give zero). Modern digital lock-ins multiply by a pure sine to avoid this.',
      trap: 'Square-wave (switching) demodulators respond to odd harmonics too.' },
    { id: 'nli-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'kT/C noise',
      q: 'A 10 pF capacitor connected to a resistor at 300 K has a total rms noise voltage, integrated over all frequencies, of ______ μV (to one decimal place). Use $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 20.4, tol: 0.1, unit: 'μV', calc: () => Math.sqrt(1.381e-23 * 300 / 1e-11) * 1e6,
      sol: 'The resistor noise $4k_BTR$ filtered by $RC$ (noise bandwidth $1/4RC$) gives $\\overline{v^2} = 4k_BTR/4RC = k_BT/C$: independent of $R$, as equipartition demands ($\\tfrac12C\\overline{v^2} = \\tfrac12k_BT$). $\\sqrt{1.381\\times10^{-23}\\times300/10^{-11}} = 2.04\\times10^{-5}$ V.',
      trap: 'A bigger resistor makes more noise density but a narrower bandwidth; the two cancel.' },
    { id: 'nli-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'noise figure',
      q: 'An amplifier has a noise figure of 3.0 dB. Its equivalent input noise temperature (standard $T_0 = 290$ K) is about',
      options: ['580 K', '145 K', '289 K', '870 K'], answer: 2,
      sol: '$F = 10^{0.3} = 2.00$. $T_e = (F - 1)T_0 = 0.995\\times290 = 289$ K: the amplifier adds as much noise as a matched source resistor at 290 K.',
      trap: 'Convert the noise figure from dB to a ratio before using $T_e = (F - 1)T_0$.' },
    { id: 'nli-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'noise figure',
      q: 'A low-noise preamplifier (power gain 20 dB, noise factor 1.5) drives a second stage of noise factor 10 (both as power ratios). The noise factor of the chain is ______ (to two decimal places).',
      answer: 1.59, tol: 0.01, calc: () => 1.5 + (10 - 1) / 100,
      sol: 'Friis: $F = F_1 + (F_2 - 1)/G_1 = 1.5 + 9/100 = 1.59$. The first stage\'s gain divides the noise of everything after it, which is why the best amplifier goes first.',
      trap: 'Use the gain as a ratio (100), not in dB (20).' },
    { id: 'nli-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'Which statements about lock-in detection are correct?',
      options: ['The DC output is proportional to the component of the signal in phase with the reference', 'Noise at frequencies far from the reference produces output fluctuations that the low-pass filter removes', 'A longer time constant lowers the output noise but makes the reading respond more slowly', 'A lock-in can recover a signal whose frequency is unrelated to the reference'], answer: [0, 1, 2],
      sol: 'Mixing shifts components at $f_r + \\Delta f$ to $\\Delta f$; the low-pass filter keeps only $|\\Delta f| \\lesssim 1/4\\tau$. So the output is the in-phase amplitude at the reference frequency, with noise bandwidth $\\propto 1/\\tau$, settling in a few $\\tau$. A signal not locked to the reference averages to zero.',
      trap: 'The reference must be coherent with the signal; that is the whole trick.' },
    { id: 'nli-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'shot noise',
      q: 'A photodetector is shot-noise limited. If the light power on it is quadrupled, the signal-to-noise ratio',
      options: ['stays the same', 'doubles', 'quadruples', 'halves'], answer: 1,
      sol: 'Signal $\\propto I$, shot noise $\\propto\\sqrt I$, so SNR $\\propto\\sqrt I$: four times the light gives twice the SNR.',
      trap: 'In the Johnson-noise-limited regime (noise independent of light) the SNR would quadruple.' },
    { id: 'nli-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'noise spectra',
      q: 'An amplifier has white input noise of 5 nV/$\\sqrt{\\text{Hz}}$ and a 1/f corner (where the 1/f and white power densities are equal) at 100 Hz. Its noise density at 1 Hz is about',
      options: ['5 nV/$\\sqrt{\\text{Hz}}$', '7 nV/$\\sqrt{\\text{Hz}}$', '50 nV/$\\sqrt{\\text{Hz}}$', '500 nV/$\\sqrt{\\text{Hz}}$'], answer: 2,
      sol: 'Power density $S(f) = S_w(1 + f_c/f)$. At 1 Hz: $S = 25(1 + 100) = 2525$ nV$^2$/Hz, so $\\sqrt S = 50$ nV/$\\sqrt{\\text{Hz}}$. The amplitude density rises as $1/\\sqrt f$, not $1/f$.',
      trap: 'The power density goes as $1/f$; the voltage density only as $1/\\sqrt f$ (500 would be the $1/f$ mistake).' },
    { id: 'nli-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: 'Resistors of 1.0 kΩ and 3.0 kΩ at 300 K are connected in parallel. The Johnson noise voltage density across the pair is ______ nV/$\\sqrt{\\text{Hz}}$ (to two decimal places). Use $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 3.52, tol: 0.02, unit: 'nV/√Hz', calc: () => Math.sqrt(4 * 1.381e-23 * 300 * 750) * 1e9,
      sol: 'The pair acts as one resistance of $1.0\\times3.0/4.0 = 0.75$ kΩ, so $v_n = \\sqrt{4k_BTR} = \\sqrt{4\\times1.381\\times10^{-23}\\times300\\times750} = 3.52$ nV/$\\sqrt{\\text{Hz}}$.',
      trap: 'Adding the two noise voltages in quadrature without the divider effect gives the series answer (8.1), not the parallel one.' },

    // ---------- level 4 ----------
    { id: 'nli-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'signal averaging',
      q: 'A single sweep of a weak spectrum has signal-to-noise ratio 0.5. To reach an SNR of 20 by averaging repeated sweeps (white noise), the number of sweeps needed is ______.',
      answer: 1600, tol: 0, calc: () => (20 / 0.5) ** 2,
      sol: 'SNR grows as $\\sqrt N$: $\\sqrt N = 20/0.5 = 40$, so $N = 1600$.',
      trap: 'A factor of 40 in SNR costs a factor of 1600 in time.' },
    { id: 'nli-030', type: 'mcq', level: 4, exams: ['net'], sub: 'lock-in',
      q: 'A lock-in referenced at $f_r$ (single-pole filter, time constant 1.0 s) receives a sinusoidal signal at $f_r + 1.0$ Hz. Compared with an equal signal exactly at $f_r$, the output oscillates at 1 Hz with amplitude reduced to about',
      options: ['16%', '50%', '2.5%', '100%'], answer: 0,
      sol: 'After mixing, the component sits at $\\Delta f = 1$ Hz. The RC filter passes it with $|H| = 1/\\sqrt{1 + (2\\pi\\Delta f\\tau)^2} = 1/\\sqrt{1 + 39.5} = 0.157$. Longer time constants reject nearby frequencies more strongly.',
      trap: 'Use the angular frequency $2\\pi\\Delta f$ in the filter response.' },
    { id: 'nli-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'noise power',
      q: 'The thermal noise power that a resistor at 290 K delivers to a matched load is $k_BTB$. In a 1.0 MHz bandwidth it is ______ dBm (to one decimal place; 0 dBm = 1 mW). Use $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: -114.0, tol: 0.1, unit: 'dBm', calc: () => 10 * Math.log10(1.381e-23 * 290 * 1e6 / 1e-3),
      sol: '$P = k_BTB = 1.381\\times10^{-23}\\times290\\times10^6 = 4.00\\times10^{-15}$ W $= 4.00\\times10^{-12}$ mW. $10\\log_{10}(4.00\\times10^{-12}) = -114.0$ dBm. (That is $-174$ dBm/Hz plus 60 dB for $10^6$ Hz.)',
      trap: 'The available noise power, $k_BTB$, does not depend on the resistance.' },
    { id: 'nli-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'boxcar',
      q: 'A detector signal is a 1 μs pulse repeating every 1 ms (after each laser shot), in white noise. A boxcar integrator with a 1 μs gate synchronised to the pulse improves the measurement mainly because it',
      options: ['amplifies the pulse more than the noise', 'accepts noise only while the signal is present, then averages many pulses', 'removes the noise inside the gate', 'converts the noise to 1/f noise'], answer: 1,
      sol: 'Integrating continuously would collect noise for the whole 1 ms but signal for only 1 μs. Gating keeps the signal and only $10^{-3}$ of the noise time; averaging $N$ gated pulses then gains a further $\\sqrt N$.',
      trap: 'Noise inside the gate is still there; the gain comes from the duty cycle and the averaging.' },
    { id: 'nli-033', type: 'msq', level: 4, exams: ['net'], sub: 'noise spectra',
      q: 'Which statements about noise correlations are true?',
      options: ['Ideal white noise has an autocorrelation function proportional to $\\delta(\\tau)$', 'The power spectral density is the Fourier transform of the autocorrelation function', 'White noise passed through an RC low-pass filter has an autocorrelation decaying as $e^{-|\\tau|/RC}$', 'Pure 1/f noise has a finite total power when integrated from zero to infinite frequency'], answer: [0, 1, 2],
      sol: 'Wiener-Khinchin: $S(f) = \\int R(\\tau)e^{-2\\pi if\\tau}d\\tau$. A flat $S$ gives $R \\propto \\delta(\\tau)$; the Lorentzian spectrum of filtered noise gives $R \\propto e^{-|\\tau|/RC}$. $\\int df/f$ diverges logarithmically at both ends, so 1/f noise must be cut off somewhere.',
      trap: 'The integral of $1/f$ diverges at both limits, only slowly.' },
    { id: 'nli-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'lock-in',
      q: 'On its 1 μV full-scale range a lock-in can tolerate interfering signals up to 1 mV at its input without overloading. Its dynamic reserve is',
      options: ['30 dB', '60 dB', '120 dB', '1000 dB'], answer: 1,
      sol: 'Dynamic reserve $= 20\\log_{10}(\\text{largest tolerable noise}/\\text{full scale}) = 20\\log_{10}(10^3) = 60$ dB.',
      trap: 'Voltages use 20 log: a factor of 1000 is 60 dB.' },
    { id: 'nli-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ADC',
      q: 'An ideal ADC must give a signal-to-quantisation-noise ratio of at least 90 dB for a full-scale sine. The minimum number of bits is ______.',
      answer: 15, tol: 0, calc: () => Math.ceil((90 - 1.76) / 6.02),
      sol: '$6.02N + 1.76 \\ge 90$ gives $N \\ge 14.66$, so 15 bits (giving 92.1 dB).',
      trap: 'Round up: 14 bits give only 86 dB.' },
    { id: 'nli-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'kT/C noise',
      q: 'A resistor $R$ at temperature $T$ is connected across a capacitor $C$. If $R$ is increased tenfold, the total rms noise voltage across the capacitor',
      options: ['rises by $\\sqrt{10}$', 'falls by $\\sqrt{10}$', 'rises by 10', 'stays the same'], answer: 3,
      sol: 'The noise density $4k_BTR$ rises tenfold but the bandwidth $1/(4RC)$ falls tenfold, leaving $\\overline{v^2} = k_BT/C$. Only a larger $C$ or a lower $T$ reduces it; this "kT/C" noise sets the floor in sample-and-hold circuits and CCDs.',
      trap: 'Noise density and total noise are different things.' },

    // ---------- level 5 ----------
    { id: 'nli-037', type: 'nat', level: 5, exams: ['net'], sub: 'shot noise',
      q: 'A photodiode drives a 1.0 MΩ load resistor at 300 K. The photocurrent at which its shot noise equals the Johnson noise current of the load is ______ nA (to one decimal place). Use $k_BT/e = 0.02585$ V.',
      answer: 51.7, tol: 0.2, unit: 'nA', calc: () => 2 * 0.02585 / 1e6 * 1e9,
      sol: 'Shot: $\\overline{i^2} = 2eIB$. Johnson current of the load: $4k_BTB/R$. Equal when $I = 2k_BT/(eR) = 2\\times0.02585/10^6 = 5.17\\times10^{-8}$ A $= 51.7$ nA. Above this the detector is shot-noise limited; a larger load lowers the threshold but slows the circuit.',
      trap: 'Compare noise powers (or currents) of the same kind; the condition is $IR = 2k_BT/e \\approx 52$ mV.' },
    { id: 'nli-038', type: 'mcq', level: 5, exams: ['net'], sub: 'lock-in',
      q: 'A square-wave signal switching between $+V$ and $-V$ is multiplied by an in-phase sinusoidal reference of unit amplitude and averaged. The output is',
      options: ['$0.500V$', '$0.707V$', '$0.637V$', '$0.900V$'], answer: 2,
      sol: 'The square wave\'s fundamental has amplitude $4V/\\pi$. Its product with the unit reference averages to half of that: $2V/\\pi = 0.637V$. The higher harmonics give zero with a sinusoidal reference.',
      trap: 'Only the Fourier component at the reference frequency survives a sine reference.' },
    { id: 'nli-039', type: 'nat', level: 5, exams: ['net'], sub: 'noise bandwidth',
      q: 'A lock-in output filter is two identical cascaded RC sections (12 dB/octave), each with time constant 100 ms. Its noise-equivalent bandwidth is ______ Hz (to two decimal places).',
      answer: 1.25, tol: 0.01, unit: 'Hz', calc: () => 1 / (8 * 0.1),
      sol: '$B_{eq} = \\int_0^\\infty \\frac{df}{[1 + (2\\pi f\\tau)^2]^2} = \\frac{1}{2\\pi\\tau}\\cdot\\frac{\\pi}{4} = \\frac{1}{8\\tau} = 1.25$ Hz, half the single-section value $1/4\\tau = 2.5$ Hz.',
      trap: 'The power response is squared twice, $|H|^2 = [1 + (\\omega\\tau)^2]^{-2}$.' },
    { id: 'nli-040', type: 'mcq', level: 5, exams: ['net'], sub: 'lock-in',
      q: 'A 1.0 μV sinusoidal signal sits in white noise of 1.0 μV/$\\sqrt{\\text{Hz}}$ across a 100 kHz amplifier bandwidth. A lock-in with noise-equivalent bandwidth 0.25 Hz measures it. The signal-to-noise ratio on the lock-in output is about',
      options: ['0.003', '0.5', '20', '2'], answer: 3,
      sol: 'Broadband noise: $1.0\\times\\sqrt{10^5} = 316$ μV, SNR $= 0.003$. In 0.25 Hz the noise is $1.0\\times\\sqrt{0.25} = 0.5$ μV, so SNR $= 1.0/0.5 = 2$. The lock-in gains $\\sqrt{10^5/0.25} \\approx 630$.',
      trap: 'Narrowing the bandwidth reduces the noise as its square root.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'nli-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Johnson noise',
      make(r) {
        const [R, Rs] = choose(r, RES), T = choose(r, [4.2, 77, 290, 300, 350]), B = choose(r, [1, 10, 100, 1e3, 1e4, 1e5, 1e6]), mode = choose(r, ['v', 'dens', 'R']);
        const v = Math.sqrt(4 * KB * T * R * B);
        let ans, q, sol, unit;
        if (mode === 'v') { ans = v * 1e6; unit = 'μV'; q = `The rms Johnson noise of a ${Rs} resistor at ${T} K in a ${B} Hz bandwidth is ______ μV (to three significant figures).`; sol = `$v = \\sqrt{4k_BTRB} = \\sqrt{4\\times1.381\\times10^{-23}\\times${T}\\times${R}\\times${B}} = ${+(v * 1e6).toPrecision(4)}$ μV.`; }
        else if (mode === 'dens') { ans = Math.sqrt(4 * KB * T * R) * 1e9; unit = 'nV/√Hz'; q = `The Johnson noise voltage density of a ${Rs} resistor at ${T} K is ______ nV/$\\sqrt{\\text{Hz}}$ (to three significant figures).`; sol = `$\\sqrt{4k_BTR} = \\sqrt{4\\times1.381\\times10^{-23}\\times${T}\\times${R}} = ${+ans.toPrecision(4)}$ nV/$\\sqrt{\\text{Hz}}$.`; }
        else { const vr = +(v * 1e6).toPrecision(3); ans = (vr * 1e-6) ** 2 / (4 * KB * T * B) / 1e3; unit = 'kΩ'; q = `A resistor at ${T} K shows an rms Johnson noise of ${vr} μV in a ${B} Hz bandwidth. Its resistance is ______ kΩ (to three significant figures).`; sol = `$R = v^2/(4k_BTB) = (${vr}\\times10^{-6})^2/(4\\times1.381\\times10^{-23}\\times${T}\\times${B}) = ${+ans.toPrecision(4)}$ kΩ.`; }
        return { q: q + ' Use $k_B = 1.381\\times10^{-23}$ J/K.', answer: s3(ans), tol: t6(ans), unit, R, T, B, mode, sol,
          trap: 'Noise voltage scales with the square root of $T$, $R$ and $B$.' };
      },
      verify: (p) => { const v = Math.sqrt(4 * KB * p.T * p.R * p.B); return p.mode === 'v' ? v * 1e6 : p.mode === 'dens' ? Math.sqrt(4 * KB * p.T * p.R) * 1e9 : ((+(v * 1e6).toPrecision(3)) * 1e-6) ** 2 / (4 * KB * p.T * p.B) / 1e3; } },
    { id: 'nli-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'shot noise',
      make(r) {
        const I = choose(r, [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3]), B = choose(r, [1, 10, 100, 1e3, 1e4, 1e6]), mode = choose(r, ['in', 'snr']);
        const In = Math.sqrt(2 * QE * I * B), snr = I / In;
        const IT = I >= 1e-6 ? `${I * 1e6} μA` : `${round(I * 1e9, 3)} nA`;
        const ans = mode === 'in' ? In * 1e12 : snr;
        return { q: mode === 'in' ? `A photocurrent of ${IT} is measured in a ${B} Hz bandwidth. Its rms shot-noise current is ______ pA (to three significant figures).`
          : `A shot-noise-limited photocurrent of ${IT} is measured in a ${B} Hz bandwidth. The signal-to-noise ratio $I/i_n$ is ______ (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'in' ? 'pA' : undefined, I, B, mode,
          sol: `$i_n = \\sqrt{2eIB} = \\sqrt{2\\times1.602\\times10^{-19}\\times10^{${Math.round(Math.log10(I))}}\\times${B}} = ${+(In * 1e12).toPrecision(4)}$ pA.${mode === 'snr' ? ` SNR $= I/i_n = \\sqrt{I/2eB} = ${+snr.toPrecision(4)}$.` : ''}`,
          trap: 'Shot noise grows as $\\sqrt I$, so the SNR improves as $\\sqrt I$.' };
      },
      verify: (p) => { const In = Math.sqrt(2 * QE * p.I * p.B); return p.mode === 'in' ? In * 1e12 : p.I / In; } },
    { id: 'nli-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'signal averaging',
      make(r) {
        const s1 = choose(r, [0.1, 0.2, 0.25, 0.5, 1, 2]), target = choose(r, [5, 10, 20, 50, 100]), N = choose(r, [4, 16, 25, 100, 256, 400, 1000, 10000]), mode = choose(r, ['N', 'snr', 'time']);
        const tsweep = choose(r, [0.1, 0.5, 1, 2, 5]);
        const Nn = Math.ceil((target / s1) ** 2 - 1e-9);
        const ans = mode === 'N' ? Nn : mode === 'snr' ? s1 * Math.sqrt(N) : Nn * tsweep / 60;
        return { q: mode === 'N' ? `One sweep gives a signal-to-noise ratio of ${s1}. The fewest sweeps whose average reaches an SNR of ${target} (white noise) is ______.`
          : mode === 'snr' ? `One sweep gives a signal-to-noise ratio of ${s1}. After averaging ${N} sweeps (white noise) the SNR is ______ (to three significant figures).`
          : `One sweep takes ${tsweep} s and gives an SNR of ${s1}. Averaging until the SNR reaches ${target} takes ______ minutes (to three significant figures).`,
          answer: mode === 'N' ? Nn : s3(ans), tol: mode === 'N' ? 0 : t6(ans), unit: mode === 'time' ? 'min' : undefined, s1, target, N, tsweep, mode,
          sol: mode === 'snr' ? `SNR $\\propto\\sqrt N$: $${s1}\\times\\sqrt{${N}} = ${+(s1 * Math.sqrt(N)).toPrecision(4)}$.` : `$N = (${target}/${s1})^2 = ${Nn}$ sweeps.${mode === 'time' ? ` Time $= ${Nn}\\times${tsweep}$ s $= ${+(Nn * tsweep).toPrecision(4)}$ s $= ${+ans.toPrecision(4)}$ min.` : ''}`,
          trap: 'The SNR grows as the square root of the number of sweeps.' };
      },
      verify: (p) => { const Nn = Math.ceil((p.target / p.s1) ** 2 - 1e-9); return p.mode === 'N' ? Nn : p.mode === 'snr' ? p.s1 * Math.sqrt(p.N) : Nn * p.tsweep / 60; } },
    { id: 'nli-g04', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'filters',
      make(r) {
        const R = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]), C = choose(r, [1, 10, 22, 47, 100, 470]), mode = choose(r, ['fc', 'att', 'phase']);
        const fc = 1 / (2 * Math.PI * R * 1e3 * C * 1e-9), k = choose(r, [0.5, 2, 3, 5, 10, 20, 100]), f = fc * k;
        const fr = +f.toPrecision(3);
        let ans, q, sol, unit;
        if (mode === 'fc') { ans = fc; unit = 'Hz'; q = `its −3 dB frequency is ______ Hz (to three significant figures)`; sol = `$f_c = 1/(2\\pi RC) = 1/(2\\pi\\times${R}\\times10^3\\times${C}\\times10^{-9}) = ${+fc.toPrecision(4)}$ Hz.`; }
        else if (mode === 'att') { ans = 10 * Math.log10(1 + (fr / fc) ** 2); unit = 'dB'; q = `a sine wave at ${fr} Hz is attenuated by ______ dB (to two decimal places)`; sol = `$f_c = ${+fc.toPrecision(4)}$ Hz. Attenuation $= 10\\log_{10}[1 + (f/f_c)^2] = 10\\log_{10}[1 + ${round((fr / fc) ** 2, 4)}] = ${round(ans, 3)}$ dB.`; }
        else { ans = Math.atan(fr / fc) * 180 / Math.PI; unit = '°'; q = `a sine wave at ${fr} Hz comes out lagging by ______ degrees (to one decimal place)`; sol = `$f_c = ${+fc.toPrecision(4)}$ Hz. Phase lag $= \\tan^{-1}(f/f_c) = \\tan^{-1}(${round(fr / fc, 4)}) = ${round(ans, 2)}°$.`; }
        return { q: `A first-order RC low-pass filter has $R = ${R}$ kΩ and $C = ${C}$ nF: ${q}.`, answer: mode === 'fc' ? s3(ans) : round(ans, mode === 'att' ? 2 : 1), tol: mode === 'fc' ? t6(ans) : mode === 'att' ? 0.02 : 0.1, unit, R, C, fr, mode, sol,
          trap: 'Use $2\\pi$: $1/RC$ is in radians per second.' };
      },
      verify: (p) => { const fc = 1 / (2 * Math.PI * p.R * 1e3 * p.C * 1e-9); return p.mode === 'fc' ? fc : p.mode === 'att' ? 10 * Math.log10(1 + (p.fr / fc) ** 2) : Math.atan(p.fr / fc) * 180 / Math.PI; } },
    { id: 'nli-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      make(r) {
        const mode = choose(r, ['avg', 'R', 'phase', 'X']);
        const Vs = pick(r, 0.5, 20, 0.5), ph = choose(r, [0, 15, 30, 45, 60, 75, 120, 135, 150]), X = pick(r, -9, 9, 0.5), Y = pick(r, 0.5, 9, 0.5);
        let ans, q, sol, unit = 'μV';
        if (mode === 'avg') { ans = Vs / 2 * Math.cos(ph * Math.PI / 180); q = `A signal $${Vs}\\cos(\\omega t + ${ph}^\\circ)$ μV is multiplied by a unit-amplitude reference $\\cos\\omega t$ and averaged over many cycles. The result is ______ μV (to three significant figures, with sign).`; sol = `Average of $\\cos(\\omega t + \\phi)\\cos\\omega t$ is $\\tfrac12\\cos\\phi$, so the output is $\\tfrac12\\times${Vs}\\times\\cos${ph}^\\circ = ${+ans.toPrecision(4)}$ μV.`; }
        else if (mode === 'R') { ans = Math.hypot(X, Y); q = `A dual-phase lock-in reads $X = ${X}$ μV and $Y = ${Y}$ μV. The signal magnitude $R$ is ______ μV (to three significant figures).`; sol = `$R = \\sqrt{X^2 + Y^2} = \\sqrt{${X * X} + ${Y * Y}} = ${+ans.toPrecision(4)}$ μV.`; }
        else if (mode === 'phase') { ans = Math.atan2(Y, X) * 180 / Math.PI; unit = '°'; q = `A dual-phase lock-in reads $X = ${X}$ μV and $Y = ${Y}$ μV. The phase $\\theta$ of the signal relative to the reference, between 0° and 180°, is ______ degrees (to one decimal place).`; sol = `$\\theta = \\operatorname{atan2}(Y, X)$: $\\tan\\theta = ${Y}/${X === 0 ? '0' : X}$ with $Y > 0$${X < 0 ? ' and $X < 0$, so $\\theta$ is in the second quadrant' : ''}: $\\theta = ${round(ans, 2)}°$.`; }
        else { ans = Vs / Math.SQRT2 * Math.cos(ph * Math.PI / 180); q = `A lock-in that displays rms values receives a sine of peak amplitude ${Vs} μV at the reference frequency, ${ph}° ahead of the reference. Its in-phase output $X$ is ______ μV (to three significant figures, with sign).`; sol = `$X = V_{rms}\\cos\\phi = (${Vs}/\\sqrt2)\\cos${ph}^\\circ = ${round(Vs / Math.SQRT2, 4)}\\times(${round(Math.cos(ph * Math.PI / 180), 4)}) = ${+ans.toPrecision(4)}$ μV.`; }
        const zero = Math.abs(ans) < 1e-9;
        return { q, answer: zero ? 0 : mode === 'phase' ? round(ans, 1) : s3(ans), tol: zero ? 0.01 : mode === 'phase' ? 0.1 : t6(ans), unit, Vs, ph, X, Y, mode, sol,
          trap: 'Keep track of the factor 1/2 (product average) or $1/\\sqrt2$ (rms display), and of the quadrant of the phase.' };
      },
      verify: (p) => { const c = Math.cos(p.ph * Math.PI / 180); const v = p.mode === 'avg' ? p.Vs / 2 * c : p.mode === 'R' ? Math.hypot(p.X, p.Y) : p.mode === 'phase' ? Math.atan2(p.Y, p.X) * 180 / Math.PI : p.Vs / Math.SQRT2 * c; return Math.abs(v) < 1e-9 ? 0 : v; } },
    { id: 'nli-g06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
      make(r) {
        const n = int(r, 1, 7), sq = choose(r, [true, true, false]);
        const val = sq ? (n % 2 ? 1 / n : 0) : (n === 1 ? 1 : 0);
        const show = (v) => (v === 0 ? 'zero' : v === 1 ? 'the same' : `$1/${Math.round(1 / v)}$ as large`);
        const pool = [1, 1 / 3, 1 / 5, 1 / 7, 0, 1 / 2].filter((v) => v !== val);
        const o = mcqOptions(r, val, [pool[0], pool[int(r, 1, 2)], pool[int(r, 3, 4)]], show);
        return { q: `A lock-in at reference frequency $f$ uses ${sq ? 'a square-wave (sign-switching) demodulator' : 'a pure sinusoidal reference'}. Compared with an in-phase sine of the same amplitude at $f$, an in-phase sine at ${n === 1 ? '$f$ itself' : `$${n}f$`} gives an output that is`, options: o.options, answer: o.answer,
          sol: sq ? `A square wave is $\\frac4\\pi\\sum_{\\text{odd }k}\\frac1k\\sin k\\omega t$: odd harmonic $k$ is weighted by $1/k$ and even harmonics are absent. For $${n}f$ the weight is ${n % 2 ? `$1/${n}$` : 'zero (even harmonic)'}.` : `A pure sine reference has only the fundamental, so only signals at $f$ survive the averaging${n === 1 ? '; the output is the same' : `; a signal at ${n}f averages to zero`}.`,
          trap: 'Square-wave demodulators also detect odd harmonics; sine references do not.' };
      } },
    { id: 'nli-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'noise bandwidth',
      make(r) {
        const tau = choose(r, [0.01, 0.03, 0.1, 0.3, 1, 3, 10]), poles = choose(r, [1, 2]), dens = choose(r, [1, 2, 4, 5, 10, 20, 50]), mode = choose(r, ['B', 'noise']);
        const B = poles === 1 ? 1 / (4 * tau) : 1 / (8 * tau), n = dens * Math.sqrt(B);
        const ans = mode === 'B' ? B : n;
        return { q: `A lock-in output filter has ${poles === 1 ? 'one RC section (6 dB/octave)' : 'two identical cascaded RC sections (12 dB/octave)'} with time constant ${tau} s. ${mode === 'B' ? 'Its noise-equivalent bandwidth is ______ Hz (to three significant figures).' : `With white input noise of ${dens} nV/$\\sqrt{\\text{Hz}}$ near the reference, the rms output noise is ______ nV (to three significant figures).`}`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'B' ? 'Hz' : 'nV', tau, poles, dens, mode,
          sol: `ENBW $= ${poles === 1 ? '1/(4\\tau)' : '1/(8\\tau)'} = ${+B.toPrecision(4)}$ Hz.${mode === 'noise' ? ` Noise $= ${dens}\\sqrt{${+B.toPrecision(4)}} = ${+n.toPrecision(4)}$ nV.` : ''}`,
          trap: 'One section: $1/4\\tau$; two sections: $1/8\\tau$. Not $1/2\\pi\\tau$.' };
      },
      verify: (p) => { const B = p.poles === 1 ? 1 / (4 * p.tau) : 1 / (8 * p.tau); return p.mode === 'B' ? B : p.dens * Math.sqrt(B); } },
    { id: 'nli-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'noise figure',
      make(r) {
        const mode = choose(r, ['friis', 'Te', 'NF']);
        const G1 = choose(r, [10, 15, 20, 25, 30]), F1d = choose(r, [0.5, 1, 1.5, 2, 3]), F2d = choose(r, [3, 6, 8, 10, 12]);
        const F1 = 10 ** (F1d / 10), F2 = 10 ** (F2d / 10), G = 10 ** (G1 / 10);
        const Ft = F1 + (F2 - 1) / G;
        let ans, q, sol, unit;
        if (mode === 'friis') { ans = 10 * Math.log10(Ft); unit = 'dB'; q = `A preamplifier (gain ${G1} dB, noise figure ${F1d} dB) is followed by a stage of noise figure ${F2d} dB. The noise figure of the pair is ______ dB (to two decimal places).`; sol = `As ratios: $F_1 = ${round(F1, 4)}$, $F_2 = ${round(F2, 4)}$, $G_1 = ${round(G, 2)}$. Friis: $F = F_1 + (F_2 - 1)/G_1 = ${round(Ft, 4)}$, i.e. $${round(ans, 3)}$ dB.`; }
        else if (mode === 'Te') { ans = (F1 - 1) * 290; unit = 'K'; q = `An amplifier has a noise figure of ${F1d} dB. Its equivalent input noise temperature is ______ K (to three significant figures; $T_0 = 290$ K).`; sol = `$F = 10^{${F1d}/10} = ${round(F1, 4)}$; $T_e = (F - 1)T_0 = ${+ans.toPrecision(4)}$ K.`; }
        else { const Te = choose(r, [20, 35, 50, 75, 100, 150, 300]); ans = 10 * Math.log10(1 + Te / 290); unit = 'dB'; q = `A receiver front end has an equivalent noise temperature of ${Te} K. Its noise figure is ______ dB (to two decimal places; $T_0 = 290$ K).`; sol = `$F = 1 + T_e/T_0 = 1 + ${Te}/290 = ${round(1 + Te / 290, 4)}$, i.e. $10\\log_{10}F = ${round(ans, 3)}$ dB.`; return { q, answer: round(ans, 2), tol: 0.02, unit, Te, mode, sol, trap: 'Noise figure in dB is $10\\log_{10}$ of the noise factor.' }; }
        return { q, answer: mode === 'Te' ? s3(ans) : round(ans, 2), tol: mode === 'Te' ? t6(ans) : 0.02, unit, G1, F1d, F2d, mode, sol,
          trap: 'Convert every dB value to a ratio before using the Friis formula.' };
      },
      verify: (p) => { if (p.mode === 'NF') return 10 * Math.log10(1 + p.Te / 290); const F1 = 10 ** (p.F1d / 10); return p.mode === 'Te' ? (F1 - 1) * 290 : 10 * Math.log10(F1 + (10 ** (p.F2d / 10) - 1) / 10 ** (p.G1 / 10)); } },
    { id: 'nli-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'ADC',
      make(r) {
        const N = int(r, 8, 24), mode = choose(r, ['snr', 'bits', 'lsb']), snr = choose(r, [50, 60, 70, 80, 96, 100, 110, 120]), V = choose(r, [1, 2, 2.5, 5, 10]);
        let ans, q, sol, unit;
        if (mode === 'snr') { ans = 6.02 * N + 1.76; unit = 'dB'; q = `The ideal signal-to-quantisation-noise ratio of a ${N}-bit ADC for a full-scale sine is ______ dB (to one decimal place).`; sol = `SNR $= 6.02N + 1.76 = 6.02\\times${N} + 1.76 = ${round(ans, 2)}$ dB.`; }
        else if (mode === 'bits') { ans = Math.ceil((snr - 1.76) / 6.02 - 1e-9); unit = undefined; q = `An ideal ADC must reach a signal-to-quantisation-noise ratio of ${snr} dB for a full-scale sine. The minimum number of bits is ______.`; sol = `$6.02N + 1.76 \\ge ${snr}$ gives $N \\ge ${round((snr - 1.76) / 6.02, 3)}$, so $N = ${ans}$.`; }
        else { ans = V / 2 ** N / Math.sqrt(12) * 1e6; unit = 'μV'; q = `A ${N}-bit ADC spans ${V} V. The rms quantisation noise is ______ μV (to three significant figures).`; sol = `Step $\\Delta = ${V}/2^{${N}} = ${+(V / 2 ** N * 1e6).toPrecision(4)}$ μV; rms noise $= \\Delta/\\sqrt{12} = ${+ans.toPrecision(4)}$ μV.`; }
        return { q, answer: mode === 'snr' ? round(ans, 1) : mode === 'bits' ? ans : s3(ans), tol: mode === 'snr' ? 0.1 : mode === 'bits' ? 0 : t6(ans), unit, N, snr, V, mode, sol,
          trap: 'Each extra bit adds about 6 dB.' };
      },
      verify: (p) => (p.mode === 'snr' ? 6.02 * p.N + 1.76 : p.mode === 'bits' ? Math.ceil((p.snr - 1.76) / 6.02 - 1e-9) : p.V / 2 ** p.N / Math.sqrt(12) * 1e6) },
    { id: 'nli-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sampling',
      make(r) {
        const fs = choose(r, [1, 2, 5, 8, 10, 20, 44.1, 48]), f = round(fs * pick(r, 0.55, 3.4, 0.01), 2);
        let a = f % fs; if (a > fs / 2) a = fs - a;
        return { q: `A ${f} kHz sine is sampled at ${fs} kHz with no anti-aliasing filter. The frequency of the sine that the samples appear to show (between 0 and ${fs / 2} kHz) is ______ kHz (to two decimal places).`,
          answer: round(a, 2), tol: 0.01, unit: 'kHz', f, fs,
          sol: `Subtract the nearest multiple of $f_s$: $${f} - ${Math.round(f / fs)}\\times${fs} = ${round(f - Math.round(f / fs) * fs, 3)}$ kHz; the alias is its magnitude, $${round(a, 3)}$ kHz.`,
          trap: 'Aliases fold back into the band 0 to $f_s/2$.' };
      },
      verify: (p) => Math.abs(p.f - Math.round(p.f / p.fs) * p.fs) },
    { id: 'nli-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'kT/C noise',
      make(r) {
        const C = choose(r, [0.1, 0.5, 1, 2, 5, 10, 100, 1000]), T = choose(r, [4.2, 77, 200, 300]), mode = choose(r, ['v', 'e']);
        const v = Math.sqrt(KB * T / (C * 1e-12)), ne = Math.sqrt(KB * T * C * 1e-12) / QE;
        const ans = mode === 'v' ? v * 1e6 : ne;
        return { q: mode === 'v' ? `The total rms thermal noise voltage on a ${C} pF capacitor at ${T} K (through any resistor) is ______ μV (to three significant figures).`
          : `Resetting a ${C} pF capacitor through a switch at ${T} K leaves an rms uncertainty in its charge of ______ electrons (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'v' ? 'μV' : 'e', C, T, mode,
          sol: mode === 'v' ? `$v = \\sqrt{k_BT/C} = \\sqrt{1.381\\times10^{-23}\\times${T}/(${C}\\times10^{-12})} = ${+(v * 1e6).toPrecision(4)}$ μV.` : `$q = \\sqrt{k_BTC}$; divided by $e$: $\\sqrt{1.381\\times10^{-23}\\times${T}\\times${C}\\times10^{-12}}/1.602\\times10^{-19} = ${+ne.toPrecision(4)}$ electrons.`,
          trap: 'kT/C noise is independent of the resistance; only $C$ and $T$ matter.' };
      },
      verify: (p) => (p.mode === 'v' ? Math.sqrt(KB * p.T / (p.C * 1e-12)) * 1e6 : Math.sqrt(KB * p.T * p.C * 1e-12) / QE) },
    { id: 'nli-g12', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'decibels',
      make(r) {
        const kind = choose(r, ['voltage', 'power']), ratio = choose(r, [2, 4, 10, 20, 50, 100, 1000, 0.5, 0.1, 0.01]);
        const db = (kind === 'voltage' ? 20 : 10) * Math.log10(ratio), wrongDb = (kind === 'voltage' ? 10 : 20) * Math.log10(ratio);
        const show = (v) => `${+v.toFixed(1)} dB`;
        const o = mcqOptions(r, db, [wrongDb, db * 2 === wrongDb ? db * 3 : db * 2, db + (db > 0 ? 3 : -3), ratio], show);
        return { q: `A ${kind} ratio of ${ratio} expressed in decibels is`, options: o.options, answer: o.answer,
          sol: `For ${kind}, dB $= ${kind === 'voltage' ? 20 : 10}\\log_{10}(${ratio}) = ${round(db, 2)}$ dB.`,
          trap: 'Power uses 10 log; amplitudes (voltage, current) use 20 log, because power goes as amplitude squared.' };
      } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["nli-g06"]);
