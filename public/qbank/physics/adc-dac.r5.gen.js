// Round 5 extras for adc-dac: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const enobJ = (n, f, tj) => { const q = 10 ** (-(6.02 * n + 1.76) / 10), j = (2 * Math.PI * f * tj) ** 2; return (-10 * Math.log10(q + j) - 1.76) / 6.02; };

export default {
  items: [
    { id: 'adc-r5-01', type: 'mcq', level: 1, exams: A, sub: 'sampling',
      q: R`Stereo audio is sampled at $44.1$ kHz with 16 bits per sample in each of the 2 channels. The raw data rate is about`,
      options: [R`$1.41$ Mbit/s`, R`$706$ kbit/s`, R`$176$ kbit/s`, R`$88.2$ kbit/s`], answer: 0,
      sol: R`Bits per second $= 44\,100\times16\times2 = 1\,411\,200$ bit/s $\approx1.41$ Mbit/s (about $176$ kbyte/s). This is why uncompressed audio takes about $10$ MB per minute.`,
      trap: R`$176$ k is the rate in bytes per second, not bits; $706$ kbit/s is one channel.` },
    { id: 'adc-r5-02', type: 'nat', level: 2, exams: A, sub: 'DAC',
      q: R`A 12-bit DAC has output $V_o = V_{ref}D/2^{12}$ with $V_{ref} = 4.096$ V. The input code is $3\text{E}8$ in hexadecimal. The output is ______ V (to three decimal places).`,
      answer: 1, tol: 0.001, calc: () => 4.096 * 0x3e8 / 4096,
      sol: R`$3\text{E}8_{16} = 3\times256 + 14\times16 + 8 = 1000$. One LSB is $4.096/4096 = 1.000$ mV, so the output is $1000\times1.000$ mV $= 1.000$ V. References like $4.096$ V are chosen so that one LSB is a round number.`,
      trap: R`Reading $3\text{E}8$ as decimal digits, or forgetting that E is 14.` },
    { id: 'adc-r5-03', type: 'mcq', level: 2, exams: G, sub: 'bandpass sampling',
      q: R`A radio signal occupies $10.0$ to $10.4$ MHz. It is sampled directly at $2.0$ MHz (no mixer) after a bandpass filter that removes everything outside that band. In the sampled data the band appears at`,
      options: [R`it cannot be recovered, since $2.0$ MHz is below twice $10.4$ MHz`, R`$1.6$ to $2.0$ MHz`, R`$0.6$ to $1.0$ MHz`, R`$0$ to $0.4$ MHz`], answer: 3,
      sol: R`Sampling at $f_s$ folds every frequency to $|f - kf_s|$ for the nearest whole $k$. With $k = 5$, $10.0$ to $10.4$ MHz maps to $0$ to $0.4$ MHz, inside the first Nyquist zone ($0$ to $1.0$ MHz) and without overlap. The Nyquist condition applies to the bandwidth ($0.4$ MHz needs at least $0.8$ MHz) when the band sits suitably in a Nyquist zone: this is undersampling, used in many digital radios.`,
      trap: R`"Twice the highest frequency" is the rule for baseband signals; a filtered narrow band can be sampled much more slowly.` },
    { id: 'adc-r5-04', type: 'nat', level: 3, exams: G, sub: 'SAR ADC',
      q: R`The capacitor DAC inside a 10-bit SAR ADC uses binary-weighted capacitors $C_u, 2C_u, 4C_u, \ldots, 512C_u$ plus one extra $C_u$ (so the total is a power of two). With unit capacitor $C_u = 10$ fF, the total array capacitance is ______ pF.`,
      answer: 10.24, tol: 0.01, calc: () => 2 ** 10 * 10e-3,
      sol: R`$C_u(1 + 2 + \ldots + 512) = 1023C_u$, plus the extra $C_u$, gives $1024C_u = 1024\times10$ fF $= 10\,240$ fF $= 10.24$ pF. The array doubles for each extra bit, which is why high-resolution SAR ADCs split the array or use larger unit capacitors only where needed.`,
      trap: R`Forgetting the terminating unit capacitor gives $10.23$ pF; the extra $C_u$ makes the MSB exactly half the total.` },
    { id: 'adc-r5-05', type: 'msq', level: 3, exams: G, sub: 'sample and hold', format: 'statements',
      q: R`Which statements about a sample-and-hold (track-and-hold) circuit are correct?`,
      options: [R`A larger hold capacitor reduces droop from leakage but lengthens the acquisition time.`, R`Charge injected by the opening switch makes a step (pedestal) of about $\Delta Q/C_H$ in the held voltage.`, R`In front of a SAR ADC it is needed because the input must not change by more than about half an LSB during the conversion.`, R`A larger hold capacitor increases the sampled $kT/C$ noise.`], answer: [0, 1, 2],
      sol: R`Droop rate is $I_{leak}/C_H$, so a big capacitor holds better, but it charges more slowly through the switch resistance ($\tau = R_{on}C_H$). Charge $\Delta Q$ released by the switch lands on $C_H$, giving a step $\Delta Q/C_H$. A SAR ADC compares the input against several trial values in turn; if the input moves meanwhile, the bits disagree. The sampled noise is $\sqrt{k_BT/C}$, which falls as $C$ grows.`,
      trap: R`$kT/C$ noise falls with bigger $C$; it is why small capacitors limit resolution.` },
    { id: 'adc-r5-06', type: 'nat', level: 4, exams: G, sub: 'DAC settling',
      q: R`A 12-bit DAC's output behaves like a single-pole system with time constant $\tau = 50$ ns. After a full-scale step, the time for the output to settle within half an LSB of its final value is ______ ns (to the nearest ns).`,
      answer: 451, tol: 1, calc: () => 50 * Math.log(2 ** 13),
      sol: R`The error decays as $V_{FS}e^{-t/\tau}$. Half an LSB is $V_{FS}/2^{13}$. Setting $e^{-t/\tau} = 2^{-13}$: $t = \tau\ln2^{13} = 13\times0.693\times50 = 9.01\times50 = 451$ ns. Each extra bit of accuracy costs another $0.69\tau$.`,
      trap: R`Using one LSB ($2^{-12}$) gives $416$ ns; using $\log_{10}$ instead of $\ln$ gives far too little.` },
    { id: 'adc-r5-07', type: 'mcq', level: 4, exams: G, sub: 'ADC codes',
      q: R`A 10-bit bipolar ADC covers $-5$ V to $+5$ V (LSB $= 10/1024$ V) and gives its result in two's complement. An input of exactly $-1.25$ V gives the code`,
      options: [R`$0110000000$`, R`$1010000000$`, R`$1110000000$`, R`$1000000000$`], answer: 2,
      sol: R`$-1.25$ V divided by the LSB $10/1024 = 9.766$ mV is $-128$. In 10-bit two's complement, $-128$ is $1024 - 128 = 896 = 1110000000_2$. (In offset binary it would be $-128 + 512 = 384 = 0110000000_2$, which differs only in the top bit.)`,
      trap: R`$0110000000$ is the offset-binary code; two's complement flips the MSB.` },
    { id: 'adc-r5-08', type: 'msq', level: 4, exams: G, sub: 'converter errors', format: 'statements',
      q: R`About differential (DNL) and integral (INL) nonlinearity of a converter, which statements are correct?`,
      options: [R`An ADC code with DNL $= -1$ LSB is a missing code.`, R`A DAC can be monotonic and still have INL larger than 1 LSB.`, R`In a binary-weighted DAC the largest DNL usually appears at the mid-scale transition $0111\ldots1\to1000\ldots0$.`, R`Trimming offset and gain removes endpoint INL.`], answer: [0, 1, 2],
      sol: R`DNL is a code's width minus 1 LSB; a width of zero gives DNL $= -1$, so that code never appears. Monotonicity only needs every step to be non-negative (DNL $> -1$); small positive errors can still pile up into a bow of several LSB (INL). At the mid-scale carry every bit changes, so the MSB is compared against the sum of all others and their errors show up together. Endpoint INL is measured from the straight line through the end points, so offset and gain are already removed; what is left is curvature.`,
      trap: R`INL is what remains after gain and offset are taken out; trimming them does not touch it.` },
    { id: 'adc-r5-09', type: 'nat', level: 5, exams: G, sub: 'ENOB',
      q: R`An otherwise ideal 12-bit ADC (quantisation SNR $6.02N + 1.76$ dB) samples a full-scale $20$ MHz sine with $1.0$ ps rms clock jitter (jitter SNR $= -20\log_{10}(2\pi f t_j)$). Adding the two noise powers, its effective number of bits $(\text{SNR} - 1.76)/6.02$ is ______ (to two decimal places).`,
      answer: 11.76, tol: 0.02, calc: () => enobJ(12, 20e6, 1e-12),
      sol: R`Quantisation: $6.02\times12 + 1.76 = 74.00$ dB, a noise-to-signal power ratio of $10^{-7.400} = 3.98\times10^{-8}$. Jitter: $2\pi\times2\times10^7\times10^{-12} = 1.257\times10^{-4}$, so $\text{SNR} = 78.02$ dB and the ratio is $(1.257\times10^{-4})^2 = 1.58\times10^{-8}$. Total $5.56\times10^{-8}$, so $\text{SNR} = 72.55$ dB and ENOB $= (72.55 - 1.76)/6.02 = 11.76$.`,
      trap: R`Taking the worse of the two SNRs (74 dB, 12 bits) ignores that noise powers add; adding the dB values is meaningless.` },
    { id: 'adc-r5-10', type: 'mcq', level: 5, exams: G, sub: 'sigma-delta',
      q: R`A converter oversamples by $\text{OSR} = 64$. With plain oversampling and filtering, the in-band quantisation noise falls by $10\log_{10}\text{OSR}$ dB; a first-order sigma-delta loop instead gains about $30\log_{10}\text{OSR} - 5.2$ dB. The extra resolution of the sigma-delta design, in bits, is closest to`,
      options: [R`$3$ bits`, R`$8$ bits`, R`$6$ bits`, R`$12$ bits`], answer: 1,
      sol: R`$30\log_{10}64 - 5.2 = 30\times1.806 - 5.2 = 49.0$ dB, and $49.0/6.02 = 8.1$ bits. Plain oversampling gives only $10\log_{10}64 = 18.1$ dB, or 3 bits. Noise shaping pushes the quantisation noise up in frequency, where the decimation filter removes it.`,
      trap: R`3 bits is the plain-oversampling result; noise shaping is what makes sigma-delta worthwhile.` },
  ],
  gens: [
    { id: 'adc-r5g1', type: 'nat', level: 4, exams: G, sub: 'DAC settling',
      make(r) {
        const n = choose(r, [8, 10, 12, 14, 16]), tau = pick(r, 5, 200, 5), frac = choose(r, ['half', 'one']);
        const k = frac === 'half' ? n + 1 : n, t = tau * Math.log(2 ** k);
        return { q: R`A ${n}-bit DAC settles like a single pole with $\tau = ${tau}$ ns. After a full-scale step, the time to settle within ${frac === 'half' ? 'half an LSB' : 'one LSB'} is ______ ns (to one decimal place).`,
          answer: round(t, 1), tol: Math.max(0.1, round(t * 0.003, 1)), n, tau, frac,
          sol: R`Need $e^{-t/\tau} = 2^{-${k}}$, so $t = ${k}\tau\ln2 = ${k}\times0.6931\times${tau} = ${round(t, 1)}$ ns.`,
          trap: 'Half an LSB of an $n$-bit converter is $2^{-(n+1)}$ of full scale.' };
      },
      verify: (p) => p.tau * Math.log(2 ** (p.frac === 'half' ? p.n + 1 : p.n)) },
    { id: 'adc-r5g2', type: 'nat', level: 2, exams: A, sub: 'sampling',
      make(r) {
        const fs = choose(r, [8, 16, 22.05, 44.1, 48, 96, 192]), bits = choose(r, [8, 12, 16, 24]), ch = choose(r, [1, 2, 6]), ask = choose(r, ['rate', 'store']);
        const rate = fs * 1e3 * bits * ch, val = ask === 'rate' ? rate / 1e6 : rate * 60 / 8 / 1e6;
        return { q: ask === 'rate'
            ? R`A recorder samples ${ch} channel${ch > 1 ? 's' : ''} at $${fs}$ kHz with ${bits} bits per sample. The raw data rate is ______ Mbit/s (to three decimal places).`
            : R`A recorder samples ${ch} channel${ch > 1 ? 's' : ''} at $${fs}$ kHz with ${bits} bits per sample. One minute of raw data takes ______ MB ($1$ MB $= 10^6$ bytes, to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, round(val * 0.002, 3)), fs, bits, ch, ask,
          sol: R`Bit rate $= ${fs}\times10^3\times${bits}\times${ch} = ${rate}$ bit/s.${ask === 'rate' ? '' : R` In 60 s that is $${rate * 60}$ bits $= ${rate * 60 / 8}$ bytes.`} Answer: $${round(val, 3)}$.`,
          trap: 'Keep bits and bytes apart (8 bits per byte) and count every channel.' };
      },
      verify: (p) => { const rt = p.fs * 1e3 * p.bits * p.ch; return p.ask === 'rate' ? rt / 1e6 : rt * 60 / 8 / 1e6; } },
    { id: 'adc-r5g3', type: 'mcq', level: 4, exams: G, sub: 'ADC codes',
      make(r) {
        const n = choose(r, [6, 8, 10]), V = choose(r, [1, 2.5, 5, 10]), kind = choose(r, ['two', 'offset']);
        const k = int(r, -(2 ** (n - 1)) + 1, 2 ** (n - 1) - 1), lsb = 2 * V / 2 ** n, vin = k * lsb;
        const tw = ((k + 2 ** n) % 2 ** n).toString(2).padStart(n, '0'), off = (k + 2 ** (n - 1)).toString(2).padStart(n, '0');
        const mag = Math.abs(k).toString(2).padStart(n, '0'), sm = (k < 0 ? '1' : '0') + Math.abs(k).toString(2).padStart(n - 1, '0');
        const right = kind === 'two' ? tw : off;
        const o = mcqOptions(r, right, [kind === 'two' ? off : tw, sm, mag, right.split('').reverse().join('')], (s) => `$${s}$`);
        return { q: R`A ${n}-bit bipolar ADC spans $-${V}$ V to $+${V}$ V (LSB $= ${2 * V}/2^{${n}}$ V) and outputs ${kind === 'two' ? "two's complement" : 'offset binary'}. An input of exactly $${round(vin, 6)}$ V gives the code`, ...o,
          sol: R`LSB $= ${round(lsb * 1000, 4)}$ mV, so the input is $${k}$ LSB. ${kind === 'two' ? R`Two's complement: ${k < 0 ? `$2^{${n}} + (${k}) = ${k + 2 ** n}$` : `$${k}$`} in binary, $${tw}$.` : R`Offset binary adds $2^{${n - 1}} = ${2 ** (n - 1)}$: $${k + 2 ** (n - 1)}$ in binary, $${off}$.`}`,
          trap: "Offset binary and two's complement differ only in the most significant bit." };
      } },
  ],
};
