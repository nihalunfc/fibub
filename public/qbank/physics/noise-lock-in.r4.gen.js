// Round 4 extras for noise-lock-in: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const dB2 = (x) => 10 ** (x / 10);

export default {
  items: [
    { id: 'nli-r4-01', type: 'mcq', level: 1, exams: A, sub: 'white noise',
      q: R`White noise is measured through a filter whose bandwidth is then made 100 times wider. The rms noise voltage becomes larger by a factor of`,
      options: [R`$100$`, R`$10$`, R`$1$ (it does not change)`, R`$50$`], answer: 1,
      sol: R`White noise has constant power per hertz, so the noise power is proportional to bandwidth and the rms voltage to its square root: $\sqrt{100} = 10$.`,
      trap: R`The power grows 100 times; the rms voltage only 10 times.` },
    { id: 'nli-r4-02', type: 'mcq', level: 2, exams: G, sub: 'Johnson noise',
      q: R`The Johnson noise of a resistor can be described as a current source in parallel with it. For a $1.0$ M$\Omega$ resistor at $300$ K, this noise current density is about`,
      options: [R`$1.3$ pA/$\sqrt{\text{Hz}}$`, R`$0.13$ nA/$\sqrt{\text{Hz}}$`, R`$129$ nV/$\sqrt{\text{Hz}}$`, R`$0.13$ pA/$\sqrt{\text{Hz}}$`], answer: 3,
      sol: R`$i_n = \sqrt{4k_BT/R} = \sqrt{4\times1.38\times10^{-23}\times300/10^6} = \sqrt{1.66\times10^{-26}} = 1.29\times10^{-13}$ A/$\sqrt{\text{Hz}}$ $= 0.13$ pA/$\sqrt{\text{Hz}}$. A larger resistor has more noise voltage but less noise current, which is why transimpedance amplifiers use large feedback resistors.`,
      trap: R`$129$ nV/$\sqrt{\text{Hz}}$ is the noise voltage $\sqrt{4k_BTR}$, a different (equivalent) description.` },
    { id: 'nli-r4-03', type: 'nat', level: 2, exams: A, sub: 'Johnson noise',
      q: R`A resistor is cooled from $300$ K to $4.0$ K (its resistance unchanged). Its Johnson noise voltage in a fixed bandwidth falls by a factor of ______ (to two decimal places).`,
      answer: 8.66, tol: 0.01, calc: () => Math.sqrt(300 / 4),
      sol: R`$v_n = \sqrt{4k_BTRB}\propto\sqrt T$, so the factor is $\sqrt{300/4.0} = \sqrt{75} = 8.66$. That is why sensitive preamplifier inputs and bolometers are cooled.`,
      trap: R`The noise power falls 75 times, the rms voltage only $\sqrt{75}$ times.` },
    { id: 'nli-r4-04', type: 'nat', level: 3, exams: G, sub: 'noise figure',
      q: R`A cable with $3.0$ dB loss, at the standard temperature $290$ K, connects an antenna to an amplifier with a noise figure of $2.0$ dB and high gain. The noise figure of the cable plus amplifier is ______ dB (to one decimal place).`,
      answer: 5.0, tol: 0.05, calc: () => 10 * Math.log10(dB2(3) * dB2(2)),
      sol: R`A passive loss $L$ at $290$ K has noise factor $F = L$ and gain $1/L$. Friis: $F = F_1 + (F_2 - 1)/G_1 = L + (F_2 - 1)L = LF_2$, so in decibels the two simply add: $3.0 + 2.0 = 5.0$ dB. Putting the amplifier at the antenna, before the cable, would keep the figure near $2$ dB.`,
      trap: R`Treating the cable as noiseless, or adding its loss only to the signal, misses that a lossy line at room temperature generates noise.` },
    { id: 'nli-r4-05', type: 'mcq', level: 2, exams: A, sub: 'interference',
      q: R`A sensitive measurement shows strong $50$ Hz hum and its harmonics only when the instrument and its preamplifier are both plugged into the mains and joined by a coaxial cable. The likely cause and cure are`,
      options: [R`a ground loop; ground the system at one point only, or use a differential or isolated input`, R`Johnson noise in the cable; cool the cable`, R`shot noise; increase the signal current`, R`aliasing; add an anti-aliasing filter`], answer: 0,
      sol: R`The two mains earths and the cable shield form a closed loop. Mains magnetic fields induce a current round it, and earth currents give a potential difference between the two grounds; either way a 50 Hz voltage appears along the shield, in series with the signal. Breaking the loop (single-point grounding, isolation) or rejecting the common-mode voltage (differential input) removes it. Random noise would not be locked to the mains frequency.`,
      trap: R`Interference at exactly the mains frequency and its harmonics is pickup, not intrinsic noise.` },
    { id: 'nli-r4-06', type: 'mcq', level: 3, exams: G, sub: 'modulation',
      q: R`A chopper-stabilised amplifier switches (modulates) a slowly varying input at a few kHz, amplifies it as an AC signal, and demodulates it again. Its main advantage is`,
      options: [R`a wider bandwidth`, R`lower Johnson noise from the source resistor`, R`very low offset and drift, because the amplification happens above the $1/f$ corner and away from DC offsets`, R`a larger output voltage swing`], answer: 2,
      sol: R`Offsets, drift and $1/f$ noise all live near DC. Modulating moves the signal to the chopping frequency, where the amplifier has only white noise and its offset is blocked or averages out; demodulation brings the signal back to DC while the amplifier's own low-frequency errors are shifted up and filtered away. Source Johnson noise is unchanged, and the bandwidth is limited to well below the chopping frequency.`,
      trap: R`Chopping cannot reduce noise generated by the source itself; it removes the amplifier's low-frequency errors.` },
    { id: 'nli-r4-07', type: 'msq', level: 3, exams: G, sub: 'interference', format: 'statements',
      q: R`Which statements about shielding and wiring against interference are correct?`,
      options: [R`A grounded electrostatic (Faraday) shield blocks capacitive pickup from nearby AC voltages.`, R`A thin copper foil shield is an effective screen against $50$ Hz magnetic fields.`, R`Twisting the two wires of a signal pair reduces magnetic pickup by shrinking and alternating the loop area.`, R`A guard driven at the signal's own potential reduces leakage currents and the effective cable capacitance.`], answer: [0, 2, 3],
      sol: R`Capacitive coupling ends on the grounded shield instead of the signal wire. Low-frequency magnetic fields pass through thin non-magnetic metal (the skin depth of copper at 50 Hz is about 9 mm); they are fought with small loop areas, twisting, distance, or high-permeability (mu-metal) shields. A guard at the same potential as the signal has no voltage across the insulation, so no leakage current flows and the cable capacitance is not charged.`,
      trap: R`Electric and magnetic pickup need different cures; a copper screen that stops one does little against low-frequency magnetic fields.` },
    { id: 'nli-r4-08', type: 'msq', level: 4, exams: G, sub: 'correlation',
      q: R`To measure a very small noise of a sample, its voltage is fed to two separate, identical amplifiers, and the cross-spectrum of their outputs is averaged over $N$ records. Which statements are correct?`,
      options: [R`The amplifiers' own (uncorrelated) noises average towards zero in the cross-spectrum.`, R`The residual contribution of the amplifier noise falls roughly as $1/\sqrt N$.`, R`The sample's noise, common to both channels, survives the averaging.`, R`The method lowers the Johnson noise of the sample itself.`], answer: [0, 1, 2],
      sol: R`The cross-spectrum averages $V_1V_2^*$. The sample's noise appears in both channels and gives a steady positive contribution; each amplifier's noise appears in only one channel, so its products have random phase and their average shrinks like $1/\sqrt N$. This lets one measure noise below that of either amplifier. The sample's noise is what is being measured; nothing reduces it.`,
      trap: R`Correlation removes noise that is different in the two channels, never the noise they share.` },
    { id: 'nli-r4-09', type: 'mcq', level: 3, exams: G, sub: 'filters',
      q: R`A data stream sampled at $1.0$ kHz is smoothed by a 16-point moving average. As a filter, its frequency response first falls to zero at`,
      options: [R`$16$ Hz`, R`$500$ Hz`, R`$31.25$ Hz`, R`$62.5$ Hz`], answer: 3,
      sol: R`Averaging over a window of $T = N/f_s = 16$ ms has response $|\sin(\pi fT)/(\pi fT)|$ (for $f\ll f_s$), which is zero when a whole number of cycles fits in the window: first at $f = 1/T = f_s/N = 62.5$ Hz. Choosing the window to be a whole number of mains periods (20 ms at 50 Hz) is a classic way to reject hum.`,
      trap: R`$f_s/(2N)$ treats the window like a half period.` },
    { id: 'nli-r4-10', type: 'nat', level: 4, exams: G, sub: 'noise temperature',
      q: R`An amplifier is tested with the Y-factor method. With a $2900$ K noise source at its input the output noise power is $5.0$ times the output with a $290$ K load. Its equivalent input noise temperature is ______ K (to one decimal place).`,
      answer: 362.5, tol: 0.5, calc: () => (2900 - 5 * 290) / (5 - 1),
      sol: R`Output noise is proportional to $T_{source} + T_e$: $Y = (T_h + T_e)/(T_c + T_e)$, so $T_e = (T_h - YT_c)/(Y - 1) = (2900 - 1450)/4 = 362.5$ K. Its noise figure is $10\log_{10}(1 + 362.5/290) = 3.5$ dB.`,
      trap: R`Forgetting that the amplifier's own noise adds to both readings; it is the ratio of sums that is measured.` },
    { id: 'nli-r4-11', type: 'mcq', level: 5, exams: G, sub: 'noise spectra',
      q: R`White noise passes through a single-pole RC low-pass filter with time constant $\tau$. The autocorrelation function of the output noise, as a function of delay $t$, is proportional to`,
      options: [R`$\delta(t)$`, R`$1/(1 + t^2/\tau^2)$`, R`$e^{-|t|/\tau}$`, R`$\sin(t/\tau)/(t/\tau)$`], answer: 2,
      sol: R`The output power spectrum is the white level times $|H|^2 = 1/(1 + \omega^2\tau^2)$, a Lorentzian. By the Wiener-Khinchin theorem the autocorrelation is its Fourier transform, $\propto e^{-|t|/\tau}$. So samples taken much less than $\tau$ apart are correlated, and averaging them gives little extra benefit. The delta function belongs to unfiltered white noise, and the sinc to an ideal brick-wall filter.`,
      trap: R`$1/(1 + t^2/\tau^2)$ copies the shape of the spectrum into the time domain; the Lorentzian and the exponential are a Fourier pair.` },
    { id: 'nli-r4-12', type: 'nat', level: 5, exams: G, sub: 'lock-in',
      q: R`An amplifier's input noise density is $e^2(f) = e_w^2(1 + f_c/f)$ with $e_w = 5.0$ nV/$\sqrt{\text{Hz}}$ and $1/f$ corner $f_c = 1.0$ kHz. Measuring a slow signal at DC, the noise counted is that from $0.1$ Hz to $1.0$ Hz. Instead, the signal is modulated at $10$ kHz and detected with a lock-in of noise bandwidth $0.9$ Hz (take the density as constant over it). The rms noise falls by a factor of ______ (to one decimal place).`,
      answer: 48.2, tol: 0.2, calc: () => Math.sqrt((0.9 + 1000 * Math.log(10)) / (0.9 * (1 + 1000 / 10000))),
      sol: R`At DC: $v^2 = e_w^2\int_{0.1}^{1}(1 + f_c/f)\,df = e_w^2[0.9 + f_c\ln10] = e_w^2(0.9 + 2302.6)$. At 10 kHz: $v^2 = e_w^2(1 + 0.1)\times0.9 = 0.99\,e_w^2$. Ratio of rms values: $\sqrt{2303.5/0.99} = 48.2$. Modulation moves the measurement out of the $1/f$ region; the same bandwidth there costs almost nothing.`,
      trap: R`Ignoring the $1/f$ term at DC gives a ratio near 1; the whole benefit of modulation comes from it.` },
  ],
  gens: [
    { id: 'nli-r4g1', type: 'nat', level: 4, exams: G, sub: 'noise temperature',
      make(r) {
        const Tc = choose(r, [290, 290, 77]), Th = choose(r, [1000, 2000, 2900, 5000, 10000]), Te0 = pick(r, 30, 600, 10);
        const YdB = round(10 * Math.log10((Th + Te0) / (Tc + Te0)), 2), Y = 10 ** (YdB / 10);
        const Te = (Th - Y * Tc) / (Y - 1), ask = choose(r, ['Te', 'NF']), val = ask === 'Te' ? Te : 10 * Math.log10(1 + Te / 290);
        return { q: `In a Y-factor test, an amplifier's output noise power rises by $${YdB}$ dB when its input is switched from a $${Tc}$ K load to a $${Th}$ K noise source. ${ask === 'Te' ? 'Its equivalent input noise temperature is ______ K (to one decimal place).' : 'Its noise figure (referred to 290 K) is ______ dB (to two decimal places).'}`,
          answer: ask === 'Te' ? round(val, 1) : round(val, 2), tol: ask === 'Te' ? Math.max(0.1, round(Math.abs(val) * 0.002, 1)) : 0.01, Th, Tc, YdB, ask,
          sol: `$Y = 10^{${YdB}/10} = ${round(Y, 4)}$. $T_e = \\dfrac{T_h - YT_c}{Y - 1} = \\dfrac{${Th} - ${round(Y, 4)}\\times${Tc}}{${round(Y - 1, 4)}} = ${round(Te, 1)}$ K.${ask === 'NF' ? ` $F = 1 + T_e/290 = ${round(1 + Te / 290, 4)}$, so NF $= ${round(val, 2)}$ dB.` : ''}`,
          trap: 'Using $Y$ in decibels inside the formula; convert it to a power ratio first.' };
      },
      verify: (p) => { const Y = 10 ** (p.YdB / 10), Te = (p.Th - Y * p.Tc) / (Y - 1); return p.ask === 'Te' ? Te : 10 * Math.log10(1 + Te / 290); } },
    { id: 'nli-r4g2', type: 'nat', level: 3, exams: G, sub: 'noise figure',
      make(r) {
        const L = pick(r, 0.5, 6, 0.5), F1 = pick(r, 0.5, 4, 0.5), G1 = pick(r, 10, 30, 5), F2 = pick(r, 3, 12, 1), first = choose(r, ['cable', 'amp']);
        const l = dB2(L), f1 = dB2(F1), g1 = dB2(G1), f2 = dB2(F2);
        // chain: cable then amp then second stage, or amp then cable then second stage
        const F = first === 'cable' ? l * f1 + (f2 - 1) * l / g1 : f1 + (l - 1) / g1 + (f2 - 1) * l / g1;
        const val = 10 * Math.log10(F);
        const cable = `a cable of loss $${L}$ dB (at 290 K)`, amp = `a low-noise amplifier of noise figure $${F1}$ dB and gain $${G1}$ dB`;
        return { q: `A receiver chain consists, in order, of ${first === 'cable' ? `${cable}, ${amp}` : `${amp}, ${cable}`}, and a second stage of noise figure $${F2}$ dB. The overall noise figure is ______ dB (to two decimal places).`,
          answer: round(val, 2), tol: 0.01, L, F1, G1, F2, first,
          sol: `As ratios: cable $L = F_c = ${round(l, 3)}$ (gain $1/L$), amplifier $F_1 = ${round(f1, 3)}$, $G_1 = ${round(g1, 1)}$, second stage $F_2 = ${round(f2, 3)}$. Friis: ${first === 'cable' ? `$F = L + (F_1 - 1)L + (F_2 - 1)L/G_1$` : `$F = F_1 + (L - 1)/G_1 + (F_2 - 1)L/G_1$`} $= ${round(F, 4)}$, i.e. $${round(val, 2)}$ dB.`,
          trap: 'Treating the cable as noiseless; a passive loss at 290 K has noise factor equal to its loss.' };
      },
      verify: (p) => { const l = dB2(p.L), f1 = dB2(p.F1), g1 = dB2(p.G1), f2 = dB2(p.F2); const F = p.first === 'cable' ? l * f1 + (f2 - 1) * l / g1 : f1 + (l - 1) / g1 + (f2 - 1) * l / g1; return 10 * Math.log10(F); } },
    { id: 'nli-r4g3', type: 'mcq', level: 3, exams: G, sub: 'filters',
      make(r) {
        const fs = choose(r, [100, 200, 500, 1000, 2000, 10000]), N = choose(r, [4, 5, 8, 10, 16, 20, 25, 50]), ask = choose(r, ['null', 'noise']);
        if (ask === 'null') {
          const f = fs / N;
          const o = mcqOptions(r, f, [fs / (2 * N), 2 * fs / N, fs / 2, N], (v) => `$${+v.toPrecision(4)}$ Hz`);
          return { q: `Samples taken at $${fs}$ Hz are smoothed by ${N === 8 ? 'an' : 'a'} ${N}-point moving average. The lowest frequency the filter removes completely is`, ...o,
            sol: `The window lasts $N/f_s = ${+(N / fs).toPrecision(4)}$ s; a sine wave with a whole number of cycles in it averages to zero. The first such frequency is $f_s/N = ${+f.toPrecision(4)}$ Hz.`,
            trap: 'Halving it (treating the window as half a period) or confusing it with the Nyquist frequency.' };
        }
        const k = Math.sqrt(N);
        const o = mcqOptions(r, round(k, 2), [N, round(N / 2, 2), round(Math.sqrt(N / 2), 2), round(Math.log2(N), 2)], (v) => `$${v}$`);
        return { q: `Samples of a constant level with independent (white) noise, taken at $${fs}$ Hz, are smoothed by ${N === 8 ? 'an' : 'a'} ${N}-point moving average. The rms noise is reduced by a factor of`, ...o,
          sol: `Averaging $N$ independent values divides their variance by $N$, so the rms noise falls by $\\sqrt{${N}} = ${round(k, 2)}$. This holds only if the noise in successive samples is uncorrelated.`,
          trap: 'The variance falls by $N$; the rms by $\\sqrt N$.' };
      } },
  ],
};
