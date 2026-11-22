// Round 5 extras for noise-lock-in: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const KB = 1.380649e-23, QE = 1.602176634e-19;
const totN = (en, inn, Rk) => Math.sqrt(en * en + 4 * KB * 300 * Rk * 1e3 * 1e18 + (inn * Rk) ** 2);

export default {
  items: [
    { id: 'nli-r5-01', type: 'mcq', level: 1, exams: A, sub: 'decibels',
      q: R`A signal of $1.0$ mV rms sits on noise of $10\ \mu$V rms. The signal-to-noise ratio is`,
      options: [R`$20$ dB`, R`$30$ dB`, R`$100$ dB`, R`$40$ dB`], answer: 3,
      sol: R`For rms voltages, $\text{SNR} = 20\log_{10}(V_s/V_n) = 20\log_{10}(1.0\text{ mV}/10\ \mu\text{V}) = 20\log_{10}100 = 40$ dB. In power terms the ratio is $10^4$, which is also $40$ dB.`,
      trap: R`$10\log_{10}$ applies to power ratios; for a voltage ratio of 100 it gives the wrong $20$ dB.` },
    { id: 'nli-r5-02', type: 'nat', level: 2, exams: A, sub: 'Johnson noise',
      q: R`The Johnson noise of a resistor can also be modelled as a current source in parallel with it. For $R = 10$ k$\Omega$ at $300$ K, the noise current density $\sqrt{4k_BT/R}$ is ______ pA/$\sqrt{\text{Hz}}$ (to two decimal places).`,
      answer: 1.29, tol: 0.01, calc: () => Math.sqrt(4 * KB * 300 / 1e4) * 1e12,
      sol: R`$4k_BT/R = 4\times1.381\times10^{-23}\times300/10^4 = 1.657\times10^{-24}$ A$^2$/Hz, whose square root is $1.29\times10^{-12}$ A/$\sqrt{\text{Hz}}$. Unlike the voltage form, the noise current falls as $R$ rises, which is why current amplifiers use large feedback resistors.`,
      trap: R`$\sqrt{4k_BTR} = 12.9$ nV/$\sqrt{\text{Hz}}$ is the voltage form, not the current form.` },
    { id: 'nli-r5-03', type: 'mcq', level: 2, exams: A, sub: 'Johnson noise',
      q: R`A $50\ \Omega$ resistor is cooled from $300$ K to $4.0$ K. Its rms Johnson noise voltage in a fixed bandwidth falls by a factor of`,
      options: [R`$75$`, R`$8.66$`, R`$4.33$`, R`$1$ (it depends only on $R$)`], answer: 1,
      sol: R`$v_n = \sqrt{4k_BTRB}\propto\sqrt T$, so the ratio is $\sqrt{300/4.0} = \sqrt{75} = 8.66$. The noise power falls by 75. This is why sensitive first amplifiers and their input resistors are cooled.`,
      trap: R`75 is the factor for noise power; the voltage goes as the square root.` },
    { id: 'nli-r5-04', type: 'nat', level: 3, exams: G, sub: 'noise matching',
      q: R`An op-amp with voltage noise $4.0$ nV/$\sqrt{\text{Hz}}$ and current noise $1.0$ pA/$\sqrt{\text{Hz}}$ amplifies a source of resistance $10$ k$\Omega$ at $300$ K. Adding all three uncorrelated contributions at the input, the total noise density is ______ nV/$\sqrt{\text{Hz}}$ (to one decimal place).`,
      answer: 16.8, tol: 0.1, calc: () => totN(4, 1, 10),
      sol: R`Source Johnson noise: $\sqrt{4k_BTR} = 12.87$ nV/$\sqrt{\text{Hz}}$. Current noise through the source: $1.0\text{ pA}\times10\text{ k}\Omega = 10.0$ nV/$\sqrt{\text{Hz}}$. Op-amp voltage noise: $4.0$. Total $\sqrt{4.0^2 + 12.87^2 + 10.0^2} = \sqrt{16 + 165.7 + 100} = 16.8$ nV/$\sqrt{\text{Hz}}$. Here the current noise matters nearly as much as the resistor itself.`,
      trap: R`Adding the three linearly ($26.9$) treats independent noises as if they were in step.` },
    { id: 'nli-r5-05', type: 'msq', level: 3, exams: G, sub: 'lock-in', format: 'statements',
      q: R`Which statements about a lock-in amplifier are correct?`,
      options: [R`If its mixer multiplies by a square wave, it also responds to odd harmonics of the reference, with weights $1/3$, $1/5$, ...`, R`A lock-in that multiplies by a pure sine reference rejects the harmonics of the signal.`, R`A signal slightly off the reference frequency, by $\Delta f$, makes the $X$ output oscillate at $\Delta f$ before the filter.`, R`The equivalent noise bandwidth of a single-pole output filter with time constant $\tau$ is $1/(2\pi\tau)$.`], answer: [0, 1, 2],
      sol: R`A square wave contains the odd harmonics $\tfrac4\pi(\sin\omega t + \tfrac13\sin3\omega t + \ldots)$, so it mixes those harmonics down to DC too. A pure sine reference picks out only the fundamental. Mixing frequencies $f + \Delta f$ and $f$ gives a beat at $\Delta f$ (and a term at $2f$), which the filter then attenuates. The equivalent noise bandwidth of a single RC pole is $\int_0^\infty df/(1 + (2\pi f\tau)^2) = 1/(4\tau)$, not its $-3$ dB frequency $1/(2\pi\tau)$.`,
      trap: R`Noise bandwidth and the $-3$ dB frequency differ: $1/(4\tau)$ against $1/(2\pi\tau)$.` },
    { id: 'nli-r5-06', type: 'nat', level: 3, exams: G, sub: 'shot noise',
      q: R`A photodiode delivers a steady $10$ nA. Limited only by shot noise, in a $1.0$ kHz bandwidth, its signal-to-noise ratio (DC current divided by rms noise current) is ______ (to the nearest ten).`,
      answer: 5590, tol: 20, calc: () => 1e-8 / Math.sqrt(2 * QE * 1e-8 * 1e3),
      sol: R`$i_n = \sqrt{2eIB} = \sqrt{2\times1.602\times10^{-19}\times10^{-8}\times10^3} = \sqrt{3.20\times10^{-24}} = 1.79\times10^{-12}$ A. SNR $= 10^{-8}/1.79\times10^{-12} = 5590$. It equals $\sqrt{N}$ where $N = I/(2eB)$ counts the electrons in the effective averaging time.`,
      trap: R`Forgetting the factor 2 in $2eIB$ changes the answer by $\sqrt2$.` },
    { id: 'nli-r5-07', type: 'mcq', level: 4, exams: G, sub: 'noise spectra',
      q: R`Pure $1/f$ noise (power density $S(f) = K/f$) is integrated over $0.1$ to $10$ Hz and, separately, over $10$ to $1000$ Hz. The rms noise in the first band compared with the second is`,
      options: [R`the same`, R`10 times larger`, R`100 times smaller`, R`$\sqrt{10}$ times larger`], answer: 0,
      sol: R`$\int_{f_1}^{f_2}K\,df/f = K\ln(f_2/f_1)$. Both bands span a factor of 100, so both give $K\ln100$: equal power, equal rms. $1/f$ noise carries the same power per decade, which is why low-frequency drift never averages away.`,
      trap: R`The second band is 100 times wider in hertz, but $1/f$ noise is weaker there by the same factor.` },
    { id: 'nli-r5-08', type: 'msq', level: 4, exams: G, sub: 'modulation', format: 'statements',
      q: R`In wavelength-modulation spectroscopy the laser wavelength is wobbled slightly at frequency $f$ across an absorption line and a lock-in detects the transmitted light. For small modulation, which statements are correct?`,
      options: [R`The signal detected at $f$ is proportional to the first derivative of the absorption line.`, R`The signal detected at $2f$ is proportional to the second derivative.`, R`At the line centre the $f$ signal is zero while the $2f$ signal has its largest magnitude.`, R`Detecting at $f$ makes a reference signal unnecessary.`], answer: [0, 1, 2],
      sol: R`Expand $A(\lambda_0 + a\cos\omega t) = A(\lambda_0) + aA'\cos\omega t + \tfrac12a^2A''\cos^2\omega t + \ldots$; since $\cos^2 = \tfrac12(1 + \cos2\omega t)$, the $f$ part is $aA'$ and the $2f$ part is $\tfrac14a^2A''$. A symmetric peak has $A' = 0$ and $|A''|$ largest at its centre. The lock-in still needs the modulation signal as its reference.`,
      trap: R`Any phase-sensitive detection needs a reference; the modulation source provides it.` },
    { id: 'nli-r5-09', type: 'nat', level: 5, exams: G, sub: 'noise thermometry',
      q: R`In Johnson noise thermometry the noise power is averaged over a bandwidth $B$ for a time $\tau$; its relative standard uncertainty is $1/\sqrt{B\tau}$. To measure temperature to $0.10\%$ with $B = 100$ kHz, the averaging time needed is ______ s.`,
      answer: 10, tol: 0.1, calc: () => 1 / (1e5 * 1e-3 ** 2),
      sol: R`$\sqrt{B\tau} = 1/0.0010 = 1000$, so $B\tau = 10^6$ and $\tau = 10^6/10^5 = 10$ s. Each independent sample of noise power takes about $1/B$; averaging $N = B\tau$ of them gives a relative error $1/\sqrt N$. The same rule (the radiometer equation) sets the sensitivity of radio telescopes.`,
      trap: R`Using $1/(B\tau)$ instead of $1/\sqrt{B\tau}$ gives $10$ ms.` },
    { id: 'nli-r5-10', type: 'mcq', level: 4, exams: G, sub: 'noise temperature',
      q: R`A $50\ \Omega$ resistor at $300$ K is in series with a $50\ \Omega$ resistor at $4.0$ K. The pair behaves as a single $100\ \Omega$ resistor whose noise temperature is`,
      options: [R`$300$ K`, R`$4.0$ K`, R`$152$ K`, R`$34.6$ K`], answer: 2,
      sol: R`The noise voltages are independent, so their power densities add: $4k_B(300\times50 + 4\times50) = 4k_B\times15\,200$ V$^2$/Hz. A $100\ \Omega$ resistor at $T_{eff}$ gives $4k_B\times100T_{eff}$, so $T_{eff} = 152$ K: the resistance-weighted average temperature.`,
      trap: R`$34.6$ K is the geometric mean, which has no physical meaning here.` },
  ],
  gens: [
    { id: 'nli-r5g1', type: 'nat', level: 2, exams: A, sub: 'Johnson noise',
      make(r) {
        const Rv = choose(r, [100, 1e3, 4.7e3, 1e4, 1e5, 1e6, 1e7]), T = choose(r, [4.2, 77, 290, 300, 400]);
        const i = Math.sqrt(4 * KB * T / Rv) * 1e12;
        const show = Rv >= 1e6 ? `${Rv / 1e6}\\text{ M}\\Omega` : Rv >= 1e3 ? `${Rv / 1e3}\\text{ k}\\Omega` : `${Rv}\\ \\Omega`;
        return { q: R`A resistor of $${show}$ at $${T}$ K has Johnson noise current density $\sqrt{4k_BT/R}$ of ______ pA/$\sqrt{\text{Hz}}$ (to three significant figures).`,
          answer: +i.toPrecision(3), tol: Math.max(1e-4, +(i * 0.004).toPrecision(2)), Rv, T,
          sol: R`$\sqrt{4\times1.381\times10^{-23}\times${T}/${Rv}} = ${+i.toPrecision(3)}$ pA/$\sqrt{\text{Hz}}$.`,
          trap: 'The current form falls with $R$; the voltage form rises with it.' };
      },
      verify: (p) => Math.sqrt(4 * KB * p.T / p.Rv) * 1e12 },
    { id: 'nli-r5g2', type: 'nat', level: 3, exams: G, sub: 'noise matching',
      make(r) {
        const en = pick(r, 1, 20, 0.5), inn = choose(r, [0.01, 0.1, 0.5, 1, 2, 5]), Rk = choose(r, [0.1, 1, 4.7, 10, 47, 100]);
        const t = totN(en, inn, Rk);
        return { q: R`An amplifier has voltage noise $${en}$ nV/$\sqrt{\text{Hz}}$ and current noise $${inn}$ pA/$\sqrt{\text{Hz}}$. It is driven by a $${Rk}$ k$\Omega$ source at $300$ K. The total input noise density is ______ nV/$\sqrt{\text{Hz}}$ (to one decimal place).`,
          answer: round(t, 1), tol: Math.max(0.1, round(t * 0.005, 1)), en, inn, Rk,
          sol: R`Johnson: $\sqrt{4k_BTR} = ${round(Math.sqrt(4 * KB * 300 * Rk * 1e3) * 1e9, 2)}$; current noise times $R$: $${round(inn * Rk, 3)}$; voltage noise: $${en}$ (all nV/$\sqrt{\text{Hz}}$). In quadrature: $${round(t, 1)}$.`,
          trap: 'Add independent noise sources in quadrature, not linearly.' };
      },
      verify: (p) => totN(p.en, p.inn, p.Rk) },
    { id: 'nli-r5g3', type: 'mcq', level: 4, exams: G, sub: 'noise temperature',
      make(r) {
        const R1 = choose(r, [10, 50, 100, 200]), R2 = choose(r, [10, 50, 100, 200]), T1 = choose(r, [290, 300, 350]), T2 = choose(r, [4, 20, 77]);
        const Te = (R1 * T1 + R2 * T2) / (R1 + R2);
        const sh = (v) => `$${+v.toPrecision(3)}$ K`;
        const o = mcqOptions(r, Te, [(T1 + T2) / 2 === Te ? Math.sqrt(T1 * T2) * 2 : (T1 + T2) / 2, Math.sqrt(T1 * T2), T1 + T2, (R2 * T1 + R1 * T2) / (R1 + R2) === Te ? T1 : (R2 * T1 + R1 * T2) / (R1 + R2)], sh);
        return { q: R`A $${R1}\ \Omega$ resistor at $${T1}$ K is in series with a $${R2}\ \Omega$ resistor at $${T2}$ K. As one $${R1 + R2}\ \Omega$ resistor, its noise temperature is`, ...o,
          sol: R`Noise powers add: $4k_B(R_1T_1 + R_2T_2) = 4k_B(R_1 + R_2)T_{eff}$, so $T_{eff} = (${R1}\times${T1} + ${R2}\times${T2})/${R1 + R2} = ${+Te.toPrecision(3)}$ K.`,
          trap: 'Weight each temperature by its resistance.' };
      } },
  ],
};
