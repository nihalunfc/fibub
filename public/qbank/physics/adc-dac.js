// ADCs and DACs at GATE / CSIR NET level: DAC resolution and step size, binary-weighted resistor and R-2R ladder DACs,
// output for a given code, resistor tolerance and monotonicity, DNL, INL, offset and gain errors; sampling theorem and
// aliasing, sample-and-hold droop and aperture time, clock jitter; quantisation error and noise, SQNR = 6.02n + 1.76 dB,
// ENOB; flash, counter-ramp, successive-approximation, dual-slope and sigma-delta converters (comparator counts,
// conversion times, SAR bit trials, mains rejection, oversampling gain). Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './adc-dac.more.gen.js';
import more2 from './adc-dac.more2.gen.js';

const an = (n) => ([8, 11, 18].includes(n) ? 'An' : 'A');
const G = ['gate', 'net'];
const bin = (v, n) => v.toString(2).padStart(n, '0');
// successive approximation: list of trial words and final code for input x (in LSB units, 0 <= x < 2^n)
const sar = (x, n) => { let code = 0; const trials = []; for (let b = n - 1; b >= 0; b--) { const t = code | (1 << b); trials.push(t); if (t <= x) code = t; } return { code, trials }; };

export default {
  topic: 'adc-dac',
  items: [
    // ---------- level 1 ----------
    { id: 'adc-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'flash ADC',
      q: 'An 8-bit flash (parallel) ADC needs how many comparators?',
      options: ['8', '256', '255', '128'], answer: 2,
      sol: 'A flash converter compares the input with every threshold between adjacent codes at once. $2^8 = 256$ codes have $255$ thresholds, so it needs $2^n - 1 = 255$ comparators (and a 256-resistor ladder). That is why flash ADCs are fast but rarely exceed 8 bits.',
      trap: '256 counts codes, not the thresholds between them.' },
    { id: 'adc-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'SAR ADC',
      q: 'An $n$-bit successive-approximation ADC completes one conversion in about',
      options: ['$n$ clock cycles', '$2^n$ clock cycles', '$2^n - 1$ clock cycles', 'one clock cycle'], answer: 0,
      sol: 'It performs a binary search: one comparison per bit, from the most significant down. So $n$ clock cycles (plus a little overhead), independent of the input voltage.',
      trap: '$2^n - 1$ cycles is the worst case of a counter-ramp ADC.' },
    { id: 'adc-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'DAC resolution', unit: 'mV',
      q: 'An 8-bit DAC produces outputs from 0 to $2.55$ V in equal steps. The size of one step is ______ mV.',
      answer: 10, tol: 0, calc: () => 2550 / (2 ** 8 - 1),
      sol: 'There are $2^8 = 256$ codes and therefore $255$ steps between the lowest and highest output: $2.55\\text{ V}/255 = 10$ mV per LSB.',
      trap: 'Dividing by 256 instead of 255 when the stated range is from the first to the last output.' },
    { id: 'adc-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'sampling',
      q: 'An audio signal contains frequencies up to 20 kHz. To sample it without aliasing, the sampling rate must be',
      options: ['20 kHz', '10 kHz', '30 kHz', 'more than 40 kHz'], answer: 3,
      sol: 'The sampling theorem requires $f_s > 2f_{max} = 40$ kHz. CDs use 44.1 kHz, leaving room for a practical anti-aliasing filter.',
      trap: 'Sampling at the highest signal frequency itself loses everything at that frequency.' },
    { id: 'adc-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quantisation',
      q: 'An ideal ADC that rounds to the nearest code has a maximum quantisation error of',
      options: ['1 LSB', '$\\pm\\tfrac12$ LSB', 'zero', '$\\pm2$ LSB'], answer: 1,
      sol: 'Every input inside one code\'s band is reported as the centre of that band, so the error never exceeds half a step either way. A truncating converter has an error from 0 to $-1$ LSB instead.',
      trap: 'Zero error would need infinitely many bits.' },
    { id: 'adc-006', type: 'msq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'ADC types', format: 'multi',
      q: 'Which statements about ADC architectures are correct?',
      options: ['The flash ADC is the fastest type', 'The dual-slope ADC is slow but rejects mains hum and is used in digital multimeters', 'The successive-approximation ADC is the common choice for medium speed and resolution', 'The conversion time of a counter-ramp ADC does not depend on the input voltage'], answer: [0, 1, 2],
      sol: 'Flash converts in one step; SAR in $n$ steps; a counter-ramp ADC counts up until its DAC output passes the input, so a larger input takes longer (up to $2^n - 1$ clocks). Dual-slope integrates the input over a fixed time, averaging out any periodic interference whose period divides that time.',
      trap: 'Only the counter-ramp (and tracking) types have input-dependent conversion times.' },

    // ---------- level 2 ----------
    { id: 'adc-007', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'weighted resistor DAC', unit: 'kΩ',
      q: 'A 4-bit binary-weighted resistor DAC uses $10$ k$\\Omega$ for the most significant bit. The resistor for the least significant bit is ______ k$\\Omega$.',
      answer: 80, tol: 0, calc: () => 10 * 2 ** 3,
      sol: 'Each lower bit must contribute half the current of the one above, so its resistor doubles: 10, 20, 40, 80 k$\\Omega$. For $n$ bits the spread is $2^{n-1}$, which becomes impractical for many bits.',
      trap: 'Answering 160 k$\\Omega$ (one doubling too many) or 40.' },
    { id: 'adc-008', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'R-2R DAC', unit: 'V',
      q: 'An 8-bit R-2R ladder DAC with reference $10$ V and output amplifier gain such that $|V_o| = V_{ref}D/256$ receives the code 1100 1000. The magnitude of its output is ______ V (to two decimal places).',
      answer: 7.81, tol: 0.01, calc: () => 10 * 0b11001000 / 256,
      sol: '1100 1000 = 128 + 64 + 8 = 200. $|V_o| = 10\\times200/256 = 7.8125$ V. Each bit contributes $V_{ref}/2, V_{ref}/4, \\ldots$ in turn.',
      trap: 'Reading the code backwards (LSB first) gives 19.' },
    { id: 'adc-009', type: 'nat', level: 2, exams: G, sub: 'SQNR', unit: 'dB',
      q: 'The ideal signal-to-quantisation-noise ratio of a 12-bit ADC for a full-scale sine wave is ______ dB (to one decimal place).',
      answer: 74.0, tol: 0.1, calc: () => 6.02 * 12 + 1.76,
      sol: 'Quantisation noise has rms $q/\\sqrt{12}$; a full-scale sine has rms $2^nq/(2\\sqrt2)$. Their ratio is $\\sqrt{1.5}\\,2^n$, or $6.02n + 1.76$ dB $= 72.24 + 1.76 = 74.0$ dB.',
      trap: 'Using only $6.02n$ (72.2 dB) or $20\\log2^n$ without the sine correction.' },
    { id: 'adc-010', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'aliasing',
      q: 'A 7 kHz sine wave is sampled at 10 kHz with no anti-aliasing filter. The reconstructed signal appears at',
      options: ['7 kHz', '3 kHz', '17 kHz', '10 kHz'], answer: 1,
      sol: 'The Nyquist frequency is 5 kHz. A 7 kHz tone folds back to $|7 - 10| = 3$ kHz: its samples are identical to those of a 3 kHz tone.',
      trap: '17 kHz is also consistent with the samples, but reconstruction keeps only the band below $f_s/2$.' },
    { id: 'adc-011', type: 'nat', level: 2, exams: G, sub: 'dual-slope ADC', unit: 'ms',
      q: 'A dual-slope ADC integrates the input for a fixed $T_1 = 20$ ms, then integrates a $-2.0$ V reference until the integrator returns to zero. For an input of $0.75$ V, the second phase lasts ______ ms.',
      answer: 7.5, tol: 0.01, calc: () => 20 * 0.75 / 2.0,
      sol: 'The charge in equals the charge out: $V_{in}T_1/RC = V_{ref}T_2/RC$. So $T_2 = T_1V_{in}/V_{ref} = 20\\times0.75/2 = 7.5$ ms. $R$, $C$ and the clock frequency all cancel, which is why the method is accurate.',
      trap: 'Thinking the integrator\'s $RC$ must be known.' },
    { id: 'adc-012', type: 'mcq', level: 2, exams: G, sub: 'dual-slope ADC',
      q: 'A dual-slope ADC rejects 50 Hz mains interference completely when',
      options: ['its integration time $T_1$ is a whole multiple of 20 ms', 'its clock frequency is exactly 50 Hz', 'its reference voltage is 50 V', 'its integrator time constant is 20 ms'], answer: 0,
      sol: 'Integrating a sine over a whole number of periods gives zero. With $T_1 = 20$ ms (or 100 ms, which also covers 60 Hz cycles of 16.7 ms six times), the hum integrates away.',
      trap: 'The time constant $RC$ cancels; only the integration window matters.' },
    { id: 'adc-013', type: 'nat', level: 2, exams: G, sub: 'counter-ramp ADC', unit: 'μs',
      q: 'An 8-bit counter-ramp ADC is clocked at 1 MHz. Its worst-case conversion time is ______ μs.',
      answer: 255, tol: 0, calc: () => (2 ** 8 - 1) / 1,
      sol: 'The counter starts at 0 and steps the DAC up one LSB per clock until it passes the input. A full-scale input needs $2^8 - 1 = 255$ clocks: 255 μs. An 8-bit SAR at the same clock needs only 8 μs.',
      trap: 'Using $n = 8$ clocks (that is the SAR).' },
    { id: 'adc-014', type: 'mcq', level: 2, exams: G, sub: 'SAR ADC',
      q: 'A 10-bit successive-approximation ADC takes one clock per bit with a 1 MHz clock (ignore sampling time). Its maximum sampling rate is',
      options: ['1 MS/s', '10 kS/s', '1 kS/s', '100 kS/s'], answer: 3,
      sol: 'One conversion takes 10 clocks $= 10$ μs, so at most $10^5$ conversions per second: 100 kS/s.',
      trap: 'Taking one clock per conversion (1 MS/s).' },
    { id: 'adc-015', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'R-2R DAC', format: 'multi',
      q: 'Which statements about an R-2R ladder DAC are correct?',
      options: ['It needs only two resistor values', 'The resistance looking into the ladder from any node towards the LSB end is $R$ (with the proper termination)', 'Its output is proportional to the binary input code', 'It needs a resistor ratio of $2^{n-1}$ between its largest and smallest resistors'], answer: [0, 1, 2],
      sol: 'Every node sees $2R\\parallel2R = R$ further down, so the current halves at each node, giving binary weights with only $R$ and $2R$: easy to match on a chip. A spread of $2^{n-1}$ is the drawback of the weighted-resistor DAC.',
      trap: 'Mixing the two DAC types.' },
    { id: 'adc-016', type: 'nat', level: 2, exams: G, sub: 'ADC codes',
      q: 'An 8-bit ADC has an LSB of 20 mV (range 0 to 5.12 V) and truncates (reports the code of the band the input lies in, counting from 0). For an input of $3.17$ V its output code, in decimal, is ______.',
      answer: 158, tol: 0, calc: () => Math.floor(3.17 / 0.02 + 1e-9),
      sol: '$3.17/0.020 = 158.5$, so the input lies in band 158 (from 3.16 to 3.18 V). A rounding converter (thresholds shifted by half an LSB) would give 159 for this input.',
      trap: 'Rounding when the converter is said to truncate.' },

    // ---------- level 3 ----------
    { id: 'adc-017', type: 'nat', level: 3, exams: G, sub: 'SAR ADC',
      q: 'A 4-bit SAR ADC has an LSB of $1$ V (code $D$ means $D$ volts) and keeps a trial bit when the DAC output does not exceed the input. For an input of $10.3$ V, the number of trial bits that are tried and then rejected is ______.',
      answer: 2, tol: 0, calc: () => { const t = sar(10.3, 4); return t.trials.filter((x, i) => (t.code & (1 << (3 - i))) === 0).length; },
      sol: 'Trials: 1000 (8 V ≤ 10.3, keep), 1100 (12 V > 10.3, reject), 1010 (10 V ≤ 10.3, keep), 1011 (11 V > 10.3, reject). Final code 1010 = 10, with 2 bits rejected.',
      trap: 'Clearing the earlier kept bits when a later trial fails.' },
    { id: 'adc-018', type: 'mcq', level: 3, exams: G, sub: 'SAR ADC',
      q: 'The same 4-bit SAR ADC (1 V per LSB) converts $10.3$ V. The sequence of trial words placed on its internal DAC is',
      options: ['1000, 1100, 1010, 1011', '1000, 0100, 0010, 0001', '0001, 0010, 0100, 1000', '1000, 1100, 1110, 1111'], answer: 0,
      sol: 'Each trial adds the next bit to the bits already kept. 1000 kept; 1100 rejected so the next trial is 1010 (not 1110); 1010 kept; then 1011, rejected. Result 1010.',
      trap: 'Testing each bit alone forgets that the search builds on the kept bits.' },
    { id: 'adc-019', type: 'nat', level: 3, exams: G, sub: 'aperture time', unit: 'ns',
      q: 'A 12-bit ADC digitises a full-scale 1 kHz sine wave (peak $V_p$, so 1 LSB $= 2V_p/2^{12}$). For the sampling error caused by aperture uncertainty to stay below half an LSB, the aperture uncertainty must be less than ______ ns (to one decimal place).',
      answer: 38.9, tol: 0.1, calc: () => 1 / (2 * Math.PI * 1000 * 4096) * 1e9,
      sol: 'The steepest slope of $V_p\\sin\\omega t$ is $\\omega V_p$. Half an LSB is $V_p/2^{12}$. So $t_a < \\dfrac{V_p/2^{12}}{2\\pi fV_p} = \\dfrac1{2\\pi\\times1000\\times4096} = 38.9$ ns. A sample-and-hold makes this easy.',
      trap: 'Using a full LSB or the whole peak-to-peak range changes the answer by factors of 2.' },
    { id: 'adc-020', type: 'nat', level: 3, exams: G, sub: 'oversampling',
      q: 'A converter samples 16 times faster than the Nyquist rate and averages (decimates) the result. Assuming white quantisation noise, the resolution improves by ______ bits.',
      answer: 2, tol: 0, calc: () => Math.log(16) / Math.log(4),
      sol: 'Averaging $N$ samples lowers the in-band noise power by $N$: $10\\log16 = 12$ dB. Each bit is worth 6.02 dB, so 2 bits. Every factor of 4 in oversampling gives one bit (more with noise shaping).',
      trap: 'Expecting one bit per doubling.' },
    { id: 'adc-021', type: 'nat', level: 3, exams: G, sub: 'ENOB',
      q: 'An ADC measures a signal-to-noise-and-distortion ratio of 62.0 dB. Its effective number of bits is ______ (to two decimal places).',
      answer: 10.0, tol: 0.02, calc: () => (62.0 - 1.76) / 6.02,
      sol: 'ENOB $= (\\text{SINAD} - 1.76)/6.02 = 60.24/6.02 = 10.0$. A 12-bit converter with this SINAD performs like an ideal 10-bit one.',
      trap: 'Dividing 62 by 6.02 without removing the 1.76 dB.' },
    { id: 'adc-022', type: 'mcq', level: 3, exams: G, sub: 'sample and hold',
      q: 'A sample-and-hold circuit uses a $1$ nF hold capacitor, and $10$ pA leaks from it in the hold mode. The droop rate of the held voltage is',
      options: ['10 V/s', '0.1 mV/s', '10 mV/s', '1 V/s'], answer: 2,
      sol: '$dV/dt = I/C = 10^{-11}/10^{-9} = 0.01$ V/s $= 10$ mV/s. Over a 10 μs conversion that is only 0.1 μV.',
      trap: 'Slipping a factor of 1000 between pF, nF and pA.' },
    { id: 'adc-023', type: 'msq', level: 3, exams: G, sub: 'converter errors', format: 'multi',
      q: 'Which statements about DAC errors are correct?',
      options: ['A DAC is monotonic if its differential non-linearity is greater than $-1$ LSB at every code', 'Integral non-linearity is the deviation of the transfer curve from a straight line', 'An offset error shifts every output by the same amount', 'A gain error can be removed by adding the same constant to every output'], answer: [0, 1, 2],
      sol: 'DNL compares each step with 1 LSB; a step smaller than 0 (DNL below $-1$) makes the output go down as the code goes up. INL accumulates the DNL. Offset is a constant shift; gain error scales the slope, so it needs a multiplication, not an added constant.',
      trap: 'Offset is additive, gain is multiplicative.' },
    { id: 'adc-024', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'weighted resistor DAC', unit: 'V',
      q: 'A 4-bit binary-weighted DAC has input resistors 10, 20, 40 and 80 k$\\Omega$ (MSB to LSB) switched to $+5$ V for a 1 and to ground for a 0, all feeding the virtual-ground input of an inverting amplifier with $R_f = 5$ k$\\Omega$. For the input 1011, the output is ______ V (to four decimal places).',
      answer: -3.4375, tol: 0.002, calc: () => -5 * (5 / 10 + 5 / 40 + 5 / 80),
      sol: 'Bits 3, 1 and 0 are 1: currents $5/10 + 5/40 + 5/80 = 0.5 + 0.125 + 0.0625 = 0.6875$ mA. $V_o = -I R_f = -0.6875\\times5 = -3.4375$ V $= -(11/16)\\times5$ V.',
      trap: 'Forgetting the sign of the inverting amplifier, or giving bit 1 the 20 k$\\Omega$ resistor.' },
    { id: 'adc-025', type: 'mcq', level: 3, exams: G, sub: 'aliasing',
      q: 'A 48 kHz tone reaches an ADC sampling at 44.1 kHz with no anti-aliasing filter. It appears in the digitised audio at',
      options: ['48 kHz', '3.9 kHz', '22.05 kHz', '18.2 kHz'], answer: 1,
      sol: 'Alias frequency $= |f - kf_s|$ folded into $0$ to $f_s/2$: $|48 - 44.1| = 3.9$ kHz, which is below 22.05 kHz, so it lands right in the audible band.',
      trap: 'Thinking ultrasound is harmless: without a filter it folds down.' },
    { id: 'adc-026', type: 'nat', level: 3, exams: G, sub: 'quantisation', unit: 'mV',
      q: 'A 10-bit ADC spans 0 to 10 V (LSB $= 10/1024$ V). The rms quantisation noise, assuming the error is uniform over one LSB, is ______ mV (to two decimal places).',
      answer: 2.82, tol: 0.01, calc: () => 10 / 1024 / Math.sqrt(12) * 1000,
      sol: 'A uniform error between $-q/2$ and $q/2$ has variance $q^2/12$. $q = 9.766$ mV, so rms $= 9.766/\\sqrt{12} = 2.82$ mV.',
      trap: 'Taking the peak error $q/2 = 4.88$ mV as the rms.' },
    { id: 'adc-027', type: 'mcq', level: 3, exams: G, sub: 'flash ADC',
      q: 'A 6-bit flash ADC uses a resistor string to set its thresholds and a priority encoder for the output. How many comparators does it need?',
      options: ['64', '6', '63', '32'], answer: 2,
      sol: '$2^6 = 64$ codes need $63$ thresholds and so 63 comparators; their outputs form a thermometer code that the encoder turns into 6 bits. Each extra bit doubles the comparator count.',
      trap: '64 is the number of output codes.' },
    { id: 'adc-028', type: 'nat', level: 3, exams: G, sub: 'DAC resolution', unit: 'mV',
      q: 'A 10-bit R-2R DAC has a reference of $10.24$ V and output $V_{ref}D/2^{10}$. Its step size is ______ mV.',
      answer: 10, tol: 0, calc: () => 10240 / 1024,
      sol: 'One LSB $= V_{ref}/2^n = 10.24/1024$ V $= 10$ mV. The largest output is $1023\\times10$ mV $= 10.23$ V, one LSB short of the reference.',
      trap: 'Dividing by $2^n - 1$ here: this DAC is defined with $2^n$.' },

    // ---------- level 4 ----------
    { id: 'adc-029', type: 'nat', level: 4, exams: G, sub: 'dual-slope ADC',
      q: 'A dual-slope ADC integrates the input for 1000 clock counts, then counts while a $1.000$ V reference brings the integrator back to zero. For an input of $0.4560$ V, the second count is ______.',
      answer: 456, tol: 0, calc: () => Math.round(1000 * 0.456 / 1.0),
      sol: '$N_2 = N_1V_{in}/V_{ref} = 1000\\times0.456/1.000 = 456$. The display reads 0.456 V directly; clock speed and $RC$ do not matter as long as they are stable during one conversion.',
      trap: 'Thinking a faster clock changes the reading.' },
    { id: 'adc-030', type: 'nat', level: 4, exams: G, sub: 'SAR ADC', unit: 'kS/s',
      q: 'A 12-bit SAR ADC uses one 2 MHz clock period per bit, and its sample-and-hold needs 1 μs to acquire each sample before conversion. The maximum sampling rate is ______ kS/s (to one decimal place).',
      answer: 142.9, tol: 0.2, calc: () => 1e3 / (12 / 2 + 1),
      sol: 'Conversion: $12\\times0.5$ μs $= 6$ μs. Plus acquisition 1 μs: 7 μs per sample. Rate $= 1/7$ μs $= 142.9$ kS/s.',
      trap: 'Forgetting the acquisition time (167 kS/s).' },
    { id: 'adc-031', type: 'mcq', level: 4, exams: G, sub: 'converter errors',
      q: 'In a 12-bit binary-weighted DAC, the MSB resistor is $0.1\\%$ low (its current $0.1\\%$ high) while all others are exact. At the mid-scale transition from 0111 1111 1111 to 1000 0000 0000 the output',
      options: ['steps up by about 1 LSB, as it should', 'steps up by about 3 LSB, a DNL of about +2 LSB', 'goes down by 2 LSB', 'does not change'], answer: 1,
      sol: 'The MSB alone is worth 2048 LSB; 0.1% of that is about 2.05 LSB extra. At mid-scale the output jumps from the sum of all lower bits (2047 LSB) to the MSB (2050 LSB): a step of about 3 LSB, DNL $\\approx+2$ LSB. Had the MSB been 0.1% high in resistance (low in current), the step would be about $-1$ LSB: non-monotonic. MSB matching needs better than $1/2^{n}$ relative accuracy.',
      trap: 'Thinking a tiny percentage error is always negligible: it is multiplied by the MSB weight.' },
    { id: 'adc-032', type: 'msq', level: 4, exams: G, sub: 'sigma-delta', format: 'multi',
      q: 'Which statements about a sigma-delta ADC are correct?',
      options: ['It samples at many times the Nyquist rate', 'It uses a coarse (often 1-bit) quantiser inside a feedback loop with an integrator', 'Noise shaping pushes quantisation noise to high frequencies, where a digital filter removes it', 'It needs a precisely matched string of $2^n$ resistors'], answer: [0, 1, 2],
      sol: 'The loop forces the average of the 1-bit output to follow the input; the integrator makes the quantisation error high-pass, so little of it lies in the signal band. A decimation filter then gives many bits at a low rate. Precision comes from timing, not from resistor matching.',
      trap: 'The matched resistor string belongs to flash converters.' },
    { id: 'adc-033', type: 'nat', level: 4, exams: G, sub: 'aliasing', unit: 'kHz',
      q: 'A 37 kHz tone is sampled at 16 kHz without filtering. Its alias in the band 0 to 8 kHz is at ______ kHz.',
      answer: 5, tol: 0, calc: () => { const m = 37 % 16; return Math.min(m, 16 - m); },
      sol: 'Subtract whole multiples of $f_s$: $37 - 2\\times16 = 5$ kHz, which already lies below $f_s/2 = 8$ kHz. (Had it come out between 8 and 16 kHz, it would be reflected to $16 - f$.)',
      trap: 'Subtracting $f_s$ only once (21 kHz) leaves it outside the baseband.' },
    { id: 'adc-034', type: 'nat', level: 4, exams: G, sub: 'SQNR', unit: 'dB',
      q: 'An ideal 12-bit ADC digitises a sine wave whose amplitude is half of full scale. Its signal-to-quantisation-noise ratio is ______ dB (to two decimal places).',
      answer: 67.98, tol: 0.05, calc: () => 6.02 * 12 + 1.76 - 20 * Math.log10(2),
      sol: 'Full scale gives $6.02\\times12 + 1.76 = 74.00$ dB. Halving the amplitude lowers the signal power by 4 ($-6.02$ dB) while the noise stays the same: $67.98$ dB.',
      trap: 'Subtracting 3 dB (a power halving) for an amplitude halving.' },
    { id: 'adc-035', type: 'mcq', level: 4, exams: G, sub: 'ADC codes',
      q: 'An 8-bit bipolar ADC covers $-5$ V to $+5$ V in offset binary (code 0 for $-5$ V). The code for 0 V is',
      options: ['0000 0000', '1000 0000', '0111 1111', '1111 1111'], answer: 1,
      sol: 'Offset binary adds half the range: 0 V is the middle code, $128 = 1000\\,0000$. Inverting the MSB converts offset binary to two\'s complement, where 0 V would be 0000 0000.',
      trap: 'Using two\'s complement when the code is offset binary.' },
    { id: 'adc-036', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'resolution',
      q: 'An ADC must resolve steps smaller than 1 mV over a 0 to 10 V range. The minimum number of bits is ______.',
      answer: 14, tol: 0, calc: () => Math.ceil(Math.log2(10 / 1e-3)),
      sol: 'Need $10\\text{ V}/2^n < 1$ mV, so $2^n > 10\\,000$. $2^{13} = 8192$ is too small; $2^{14} = 16384$ gives 0.61 mV. So 14 bits.',
      trap: 'Rounding $\\log_2 10000 = 13.3$ down to 13.' },

    // ---------- level 5 ----------
    { id: 'adc-037', type: 'nat', level: 5, exams: G, sub: 'clock jitter', unit: 'dB',
      q: 'A high-speed ADC samples a $10$ MHz full-scale sine with an rms clock jitter of $1$ ps. The jitter-limited signal-to-noise ratio, $-20\\log_{10}(2\\pi ft_j)$, is ______ dB (to one decimal place).',
      answer: 84.0, tol: 0.1, calc: () => -20 * Math.log10(2 * Math.PI * 1e7 * 1e-12),
      sol: 'A timing error $\\delta t$ gives a voltage error up to $V_p\\omega\\,\\delta t$; averaged over the sine, the rms error is $V_p\\omega t_j/\\sqrt2$, against a signal rms of $V_p/\\sqrt2$. SNR $= 1/(2\\pi ft_j) = 1/(6.283\\times10^{-5})$, which is 84.0 dB: about 13.7 effective bits at most, whatever the converter\'s nominal resolution.',
      trap: 'Using $f_s$ instead of the signal frequency.' },
    { id: 'adc-038', type: 'msq', level: 5, exams: G, sub: 'SAR ADC', format: 'multi',
      q: 'Which statements about a successive-approximation ADC are correct?',
      options: ['It contains a DAC, a comparator and a successive-approximation register', 'Its accuracy cannot be better than the linearity of its internal DAC', 'Its conversion time grows linearly with the number of bits', 'It needs $2^n - 1$ comparators'], answer: [0, 1, 2],
      sol: 'The register sets trial codes on the DAC, the comparator decides each bit. Any DAC non-linearity turns directly into ADC non-linearity. One cycle per bit means time $\\propto n$. Only one comparator is used; $2^n - 1$ is the flash ADC.',
      trap: 'Thinking the binary search needs many comparators.' },
    { id: 'adc-039', type: 'nat', level: 5, exams: G, sub: 'oversampling',
      q: 'Plain oversampling with averaging (no noise shaping) is used to raise a converter\'s resolution by 4 bits. The oversampling ratio needed is ______.',
      answer: 256, tol: 0, calc: () => 4 ** 4,
      sol: 'Each bit needs 6.02 dB, i.e. a factor 4 in noise power, so 4 bits need $4^4 = 256$ times the Nyquist rate. Noise shaping in sigma-delta converters reaches the same gain with far less oversampling.',
      trap: 'Using $2^4 = 16$.' },
    { id: 'adc-040', type: 'mcq', level: 5, exams: G, sub: 'converter errors',
      q: 'On a test of an ADC, code 7 is found to be 1.6 LSB wide and code 8 only 0.4 LSB wide (an ideal code is 1 LSB wide). The differential non-linearity of code 8 is',
      options: ['$-0.6$ LSB', '$+0.4$ LSB', '$+0.6$ LSB', '$-0.4$ LSB'], answer: 0,
      sol: 'DNL is the measured width minus the ideal width: $0.4 - 1 = -0.6$ LSB for code 8 (and $+0.6$ LSB for code 7). A code of width 0 (DNL $= -1$) would be a missing code.',
      trap: 'Quoting the width itself instead of its deviation from 1 LSB.' },
    ...more2,
  ],
  gens: [
    { id: 'adc-g01', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'R-2R DAC',
      make(r) {
        const n = choose(r, [4, 6, 8, 10]), Vref = choose(r, [2.5, 5, 5.12, 10, 10.24]), D = int(r, 1, 2 ** n - 1);
        const V = Vref * D / 2 ** n;
        return { q: `${an(n)} ${n}-bit R-2R DAC gives $|V_o| = V_{ref}D/2^{${n}}$ with $V_{ref} = ${Vref}$ V. For the input code ${bin(D, n)} its output is ______ V (to three decimal places).`,
          answer: round(V, 3), tol: Math.max(0.001, round(V * 0.001, 3)), unit: 'V', n, Vref, D,
          sol: `${bin(D, n)} $= ${D}$. $V_o = ${Vref}\\times${D}/${2 ** n} = ${round(V, 4)}$ V.`,
          trap: 'Reading the code from the wrong end, or dividing by $2^n - 1$.' };
      },
      verify: (p) => p.Vref * p.D / 2 ** p.n },
    { id: 'adc-g02', type: 'nat', level: 2, exams: G, sub: 'ADC codes',
      make(r) {
        const n = choose(r, [8, 10, 12]), Vfs = choose(r, [2.048, 4.096, 5.12, 10.24]), Vin = round(Vfs * pick(r, 0.02, 0.98, 0.01) + pick(r, 0, 0.0009, 0.0001), 4), mode = r() < 0.5 ? 'trunc' : 'round';
        const q = Vfs / 2 ** n, x = Vin / q, code = Math.min(2 ** n - 1, mode === 'trunc' ? Math.floor(x + 1e-9) : Math.round(x));
        return { q: `${an(n)} ${n}-bit ADC spans 0 to $${Vfs}$ V with LSB $= ${Vfs}/2^{${n}}$ V and ${mode === 'trunc' ? 'truncates (reports the band the input lies in)' : 'rounds to the nearest code'}. For an input of $${Vin}$ V its output code in decimal is ______.`,
          answer: code, tol: 0, n, Vfs, Vin, mode,
          sol: `LSB $= ${round(q * 1000, 4)}$ mV. $V_{in}/\\text{LSB} = ${round(x, 3)}$, which ${mode === 'trunc' ? 'truncates' : 'rounds'} to ${code}.`,
          trap: mode === 'trunc' ? 'Rounding up when the converter truncates.' : 'Truncating when the converter rounds.' };
      },
      verify: (p) => { const x = p.Vin / (p.Vfs / 2 ** p.n); return Math.min(2 ** p.n - 1, p.mode === 'trunc' ? Math.floor(x + 1e-9) : Math.round(x)); } },
    { id: 'adc-g03', type: 'nat', level: 3, exams: G, sub: 'aliasing',
      make(r) {
        const fs = choose(r, [8, 10, 16, 20, 32, 44.1, 48, 100]), f = round(fs * pick(r, 0.55, 3.4, 0.01), 2);
        let m = f % fs; m = m < 0 ? m + fs : m; const al = Math.min(m, fs - m);
        return { q: `A $${f}$ kHz tone is sampled at $${fs}$ kHz with no anti-aliasing filter. It appears in the band 0 to $f_s/2$ at ______ kHz (to two decimal places).`,
          answer: round(al, 2), tol: 0.01, unit: 'kHz', f, fs,
          sol: `Remove whole multiples of $f_s$: $${f} \\bmod ${fs} = ${round(m, 3)}$ kHz. ${m > fs / 2 ? `That is above $f_s/2 = ${fs / 2}$ kHz, so it folds to $${fs} - ${round(m, 3)} = ${round(al, 2)}$ kHz.` : `That is already below $f_s/2 = ${fs / 2}$ kHz.`}`,
          trap: 'Forgetting the final fold about $f_s/2$.' };
      },
      verify: (p) => { let m = p.f % p.fs; return Math.min(m, p.fs - m); } },
    { id: 'adc-g04', type: 'nat', level: 2, exams: G, sub: 'SQNR',
      make(r) {
        const ask = choose(r, ['sqnr', 'enob', 'sqnr-back']), n = int(r, 6, 24), sinad = pick(r, 40, 110, 0.5), back = choose(r, [0, 3, 6, 10, 20]);
        const val = ask === 'sqnr' ? 6.02 * n + 1.76 : ask === 'enob' ? (sinad - 1.76) / 6.02 : 6.02 * n + 1.76 - back;
        return { q: ask === 'sqnr' ? `The ideal SQNR of ${an(n).toLowerCase()} ${n}-bit ADC for a full-scale sine is ______ dB (to two decimal places).` : ask === 'enob' ? `An ADC has SINAD $= ${sinad}$ dB. Its effective number of bits is ______ (to two decimal places).` : `An ideal ${n}-bit ADC digitises a sine whose level is ${back} dB below full scale. Its SQNR is ______ dB (to two decimal places).`,
          answer: round(val, 2), tol: 0.02, ask, n, sinad, back,
          sol: ask === 'enob' ? `ENOB $= (${sinad} - 1.76)/6.02 = ${round(val, 2)}$.` : `Full scale: $6.02\\times${n} + 1.76 = ${round(6.02 * n + 1.76, 2)}$ dB${ask === 'sqnr-back' ? `; the noise is unchanged and the signal ${back} dB lower: ${round(val, 2)} dB` : ''}.`,
          trap: 'Leaving out the 1.76 dB.' };
      },
      verify: (p) => (p.ask === 'sqnr' ? 6.02 * p.n + 1.76 : p.ask === 'enob' ? (p.sinad - 1.76) / 6.02 : 6.02 * p.n + 1.76 - p.back) },
    { id: 'adc-g05', type: 'nat', level: 3, exams: G, sub: 'dual-slope ADC',
      make(r) {
        const N1 = choose(r, [1000, 2000, 4000, 10000]), Vref = choose(r, [1, 2, 2.5, 5]), fc = choose(r, [50, 100, 200, 500]), Vin = round(Vref * pick(r, 0.05, 0.95, 0.001), 4), ask = r() < 0.5 ? 'N' : 'T';
        const N2 = N1 * Vin / Vref, T2 = N2 / fc;
        return { q: `A dual-slope ADC clocked at $${fc}$ kHz integrates the input for ${N1} counts, then de-integrates with a $${Vref}$ V reference. For $V_{in} = ${Vin}$ V, ${ask === 'N' ? 'the de-integration count is ______ (to one decimal place, before the counter truncates it).' : 'the de-integration phase lasts ______ ms (to three decimal places).'}`,
          answer: ask === 'N' ? round(N2, 1) : round(T2, 3), tol: ask === 'N' ? 0.1 : Math.max(0.001, round(T2 * 0.001, 3)), N1, Vref, fc, Vin, ask,
          sol: `Charge balance: $N_2 = N_1V_{in}/V_{ref} = ${N1}\\times${Vin}/${Vref} = ${round(N2, 2)}$ counts, lasting $N_2/f_c = ${round(T2, 4)}$ ms.`,
          trap: 'Thinking the clock rate or $RC$ changes the count.' };
      },
      verify: (p) => (p.ask === 'N' ? p.N1 * p.Vin / p.Vref : p.N1 * p.Vin / p.Vref / p.fc) },
    { id: 'adc-g06', type: 'mcq', level: 3, exams: G, sub: 'SAR ADC',
      make(r) {
        const n = 4, x = round(pick(r, 0.3, 15.7, 0.1), 1), { code, trials } = sar(x, n);
        const show = (l) => l.map((v) => bin(v, n)).join(', ');
        const naive = [8, 4, 2, 1], nokeep = []; let c2 = 0; for (let b = n - 1; b >= 0; b--) { nokeep.push(c2 | (1 << b)); c2 |= (1 << b); }
        const wrongReset = []; let c3 = 0; for (let b = n - 1; b >= 0; b--) { const t = (1 << b) | (c3 & ~((1 << (b + 1)) - 1)); wrongReset.push(t | (b < n - 1 ? 0 : 0)); if (t <= x) c3 = t; else c3 = 0; }
        const o = mcqOptions(r, show(trials), [show(naive), show(nokeep), show(wrongReset), show([...trials].reverse()), show(trials.map((t) => t ^ 1))]);
        return { q: `A 4-bit SAR ADC with 1 V per LSB (code $D$ means $D$ volts) converts an input of $${x}$ V; a trial bit is kept when the DAC output does not exceed the input. The sequence of trial words on its DAC is`, ...o,
          sol: `Start with 1000 and add one bit per step to the bits already kept: ${trials.map((t) => `${bin(t, n)} (${t} V ${t <= x ? '≤' : '>'} ${x} V, ${t <= x ? 'keep' : 'reject'})`).join('; ')}. Final code ${bin(code, n)} = ${code}.`,
          trap: 'Testing each bit on its own instead of on top of the bits already kept.' };
      } },
    { id: 'adc-g07', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ADC types',
      make(r) {
        const n = int(r, 4, 12), kind = choose(r, ['flash', 'sar', 'ramp']), f = choose(r, [1, 2, 4, 5, 10]);
        const val = kind === 'flash' ? 2 ** n - 1 : kind === 'sar' ? n / f : (2 ** n - 1) / f;
        return { q: kind === 'flash' ? `${an(n)} ${n}-bit flash ADC needs ______ comparators.` : kind === 'sar' ? `${an(n)} ${n}-bit SAR ADC uses one clock per bit at $${f}$ MHz. One conversion takes ______ μs (to three decimal places).` : `${an(n)} ${n}-bit counter-ramp ADC is clocked at $${f}$ MHz. Its worst-case conversion time is ______ μs (to three decimal places).`,
          answer: kind === 'flash' ? val : round(val, 3), tol: kind === 'flash' ? 0 : 0.001, n, kind, f,
          sol: kind === 'flash' ? `$2^{${n}} - 1 = ${val}$ thresholds, one comparator each.` : kind === 'sar' ? `${n} clocks of $1/${f}$ μs: ${round(val, 3)} μs.` : `Up to $2^{${n}} - 1 = ${2 ** n - 1}$ clocks of $1/${f}$ μs: ${round(val, 3)} μs.`,
          trap: 'Mixing up $n$, $2^n$ and $2^n - 1$ between the architectures.' };
      },
      verify: (p) => (p.kind === 'flash' ? 2 ** p.n - 1 : p.kind === 'sar' ? p.n / p.f : (2 ** p.n - 1) / p.f) },
    { id: 'adc-g08', type: 'nat', level: 4, exams: G, sub: 'aperture time',
      make(r) {
        const n = int(r, 8, 16), f = choose(r, [0.1, 1, 5, 10, 20, 50, 100]);
        const ta = 1 / (2 * Math.PI * f * 1e3 * 2 ** n) * 1e9;
        return { q: `${an(n)} ${n}-bit ADC digitises a full-scale $${f}$ kHz sine (1 LSB $= 2V_p/2^{${n}}$). For the error from aperture uncertainty to stay below half an LSB, the aperture uncertainty must be below ______ ns (to three significant figures).`,
          answer: +ta.toPrecision(3), tol: ta * 0.006, unit: 'ns', n, f,
          sol: `Steepest slope $2\\pi fV_p$; half an LSB $= V_p/2^{${n}}$. $t_a = 1/(2\\pi f2^{${n}}) = 1/(2\\pi\\times${f}\\times10^3\\times${2 ** n}) = ${ta.toPrecision(4)}$ ns.`,
          trap: 'Using a full LSB (doubles the answer).' };
      },
      verify: (p) => 1 / (2 * Math.PI * p.f * 1e3 * 2 ** p.n) * 1e9 },
    { id: 'adc-g09', type: 'nat', level: 3, exams: G, sub: 'quantisation',
      make(r) {
        const n = int(r, 6, 16), V = choose(r, [1, 2, 2.5, 5, 10, 20]);
        const q = V / 2 ** n, rms = q / Math.sqrt(12) * 1e6;
        return { q: `${an(n)} ${n}-bit ADC spans $${V}$ V (LSB $= ${V}/2^{${n}}$ V). Its rms quantisation noise (uniform error over one LSB) is ______ μV (to three significant figures).`,
          answer: +rms.toPrecision(3), tol: rms * 0.006, unit: 'μV', n, V,
          sol: `LSB $= ${(q * 1e6).toPrecision(4)}$ μV. rms $= \\text{LSB}/\\sqrt{12} = ${rms.toPrecision(4)}$ μV.`,
          trap: 'Using the half-LSB peak error as the rms value.' };
      },
      verify: (p) => p.V / 2 ** p.n / Math.sqrt(12) * 1e6 },
    { id: 'adc-g10', type: 'nat', level: 3, exams: G, sub: 'oversampling',
      make(r) {
        const ask = r() < 0.5 ? 'bits' : 'ratio', k = int(r, 1, 6);
        const val = ask === 'bits' ? k : 4 ** k;
        return { q: ask === 'bits' ? `Plain oversampling by a factor of $${4 ** k}$ with averaging (white quantisation noise, no noise shaping) improves the resolution by ______ bits.` : `To gain ${k} bit${k > 1 ? 's' : ''} of resolution by plain oversampling and averaging (no noise shaping), the oversampling ratio must be ______.`,
          answer: val, tol: 0, ask, k,
          sol: `Averaging $N$ samples cuts the in-band noise power by $N$; one bit is a factor 4 in power (6.02 dB). So $N = 4^{\\text{bits}}$: ${ask === 'bits' ? `$\\log_4 ${4 ** k} = ${k}$` : `$4^{${k}} = ${4 ** k}$`}.`,
          trap: 'Assuming one bit per doubling.' };
      },
      verify: (p) => (p.ask === 'bits' ? p.k : 4 ** p.k) },
    { id: 'adc-g11', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'weighted resistor DAC',
      make(r) {
        const n = 4, R = choose(r, [5, 10, 20]), Rf = choose(r, [1, 2, 2.5, 5, 10]), V = choose(r, [1, 2.5, 5, 10]), D = int(r, 1, 15);
        let I = 0; for (let b = 0; b < n; b++) if ((D >> b) & 1) I += V / (R * 2 ** (n - 1 - b));
        const Vo = -I * Rf;
        return { q: `A 4-bit weighted-resistor DAC has input resistors $${R}$, $${2 * R}$, $${4 * R}$, $${8 * R}$ k$\\Omega$ (MSB to LSB), each switched to $${V}$ V for a 1 or ground for a 0, into the virtual ground of an inverting amplifier with $R_f = ${Rf}$ k$\\Omega$. For the input ${bin(D, 4)} the output is ______ V (to four decimal places).`,
          answer: round(Vo, 4), tol: Math.max(0.0005, round(Math.abs(Vo) * 0.001, 4)), unit: 'V', R, Rf, V, D,
          sol: `Total current $= \\sum_{\\text{bits}=1} V/R_k = ${round(I, 5)}$ mA. $V_o = -IR_f = ${round(Vo, 4)}$ V $= -\\dfrac{${D}}{8}\\cdot\\dfrac{R_f}{R}V$.`,
          trap: 'Giving the MSB the largest resistor.' };
      },
      verify: (p) => -(p.D / 8) * (p.Rf / p.R) * p.V },
    { id: 'adc-g12', type: 'nat', level: 5, exams: G, sub: 'clock jitter',
      make(r) {
        const f = choose(r, [1, 5, 10, 20, 50, 100, 200]), tj = choose(r, [0.1, 0.2, 0.5, 1, 2, 5, 10]), ask = r() < 0.6 ? 'snr' : 'enob';
        const snr = -20 * Math.log10(2 * Math.PI * f * 1e6 * tj * 1e-12), val = ask === 'snr' ? snr : (snr - 1.76) / 6.02;
        return { q: `An ADC samples a full-scale $${f}$ MHz sine with $${tj}$ ps rms clock jitter. The jitter-limited ${ask === 'snr' ? 'SNR is ______ dB' : 'effective number of bits is ______'} (to two decimal places). Use SNR $= -20\\log_{10}(2\\pi ft_j)$${ask === 'enob' ? ' and ENOB $= (\\text{SNR} - 1.76)/6.02$' : ''}.`,
          answer: round(val, 2), tol: 0.02, f, tj, ask,
          sol: `$2\\pi ft_j = ${(2 * Math.PI * f * 1e6 * tj * 1e-12).toPrecision(4)}$, so SNR $= ${round(snr, 2)}$ dB${ask === 'enob' ? `, ENOB $= ${round(val, 2)}$` : ''}. Doubling the signal frequency costs 6 dB.`,
          trap: 'Using the sampling rate in place of the signal frequency.' };
      },
      verify: (p) => { const s = -20 * Math.log10(2 * Math.PI * p.f * 1e6 * p.tj * 1e-12); return p.ask === 'snr' ? s : (s - 1.76) / 6.02; } },
    ...more,
  ],
};
