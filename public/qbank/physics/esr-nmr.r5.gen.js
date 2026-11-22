// Round 5 extras for esr-nmr: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;

const H = 6.62607015e-34, KB = 1.380649e-23;
/** gamma/2pi in MHz/T (magnitude for the electron). */
const SPINS = [['protons', 42.577], ['$^{13}$C nuclei', 10.708], ['$^{31}$P nuclei', 17.235], ['$^{19}$F nuclei', 40.078], ['free electrons', 28025]];
const NOE = [['$^{13}$C', 6.728], ['$^{15}$N', -2.713], ['$^{31}$P', 10.839], ['$^{29}$Si', -5.319], ['$^{19}$F', 25.18]];

export default {
  items: [
    { id: 'nmr-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'gyromagnetic ratios',
      q: R`In the same magnetic field, the resonance frequency of a free electron spin is larger than that of a proton by a factor of about`,
      options: [R`$1836$`, R`$658$`, R`$42.6$`, R`$2.79$`], answer: 1,
      sol: R`Resonance frequency $= \gamma B/2\pi$. Electron: $28.0$ GHz/T; proton: $42.58$ MHz/T. Ratio $= 28\,025/42.58 = 658$. It is not the mass ratio 1836, because the proton's $g$ factor ($5.586$) is about 2.8 times the electron's ($2.002$): $1836\times2.002/5.586 = 658$.`,
      trap: R`The mass ratio alone ignores the very different $g$ factors.` },
    { id: 'nmr-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Larmor frequency', unit: 'MHz',
      q: R`$^{19}$F has $\gamma/2\pi = 40.078$ MHz/T. In an $11.74$ T magnet its resonance frequency is ______ MHz (one decimal place).`,
      answer: 470.5, tol: 0.3, calc: () => 40.078 * 11.74,
      sol: R`$\nu = (\gamma/2\pi)B = 40.078\times11.74 = 470.5$ MHz. The same magnet makes protons resonate at $499.9$ MHz, so it is sold as a "500 MHz" spectrometer.`,
      trap: R`Multiplying by $2\pi$ gives the angular frequency in Mrad/s, not the frequency in MHz.` },
    { id: 'nmr-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polarisation',
      q: R`$^{13}$C nuclei ($I = \tfrac12$) resonate at $100.6$ MHz in a $9.4$ T magnet. At $300$ K their spin polarisation $P\approx h\nu/(2k_BT)$ is $k\times10^{-6}$ with $k = $ ______ (two decimal places).`,
      answer: 8.05, tol: 0.05, calc: () => H * 100.6e6 / (2 * KB * 300) * 1e6,
      sol: R`$h\nu = 6.626\times10^{-34}\times1.006\times10^8 = 6.666\times10^{-26}$ J; $2k_BT = 8.284\times10^{-21}$ J. $P = 8.05\times10^{-6}$: only 8 in a million spins contribute net signal, one reason $^{13}$C NMR is so insensitive (its 1.1% abundance is the other).`,
      trap: R`Forgetting the 2 in $h\nu/2k_BT$ doubles the answer.` },
    { id: 'nmr-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulses', unit: 'ns',
      q: R`In pulsed ESR, electron spins ($\gamma = 1.761\times10^{11}$ rad s$^{-1}$ T$^{-1}$) are driven by a microwave field of amplitude $B_1 = 0.50$ mT in the rotating frame. The length of a $180^\circ$ ($\pi$) pulse is ______ ns (one decimal place).`,
      answer: 35.7, tol: 0.2, calc: () => Math.PI / (1.761e11 * 0.5e-3) * 1e9,
      sol: R`In the rotating frame the spins turn about $B_1$ at $\omega_1 = \gamma B_1 = 1.761\times10^{11}\times5.0\times10^{-4} = 8.805\times10^7$ rad/s. A $\pi$ rotation takes $\pi/\omega_1 = 3.568\times10^{-8}$ s $= 35.7$ ns. Proton pulses with the same $B_1$ would be 658 times longer, about 23 $\mu$s.`,
      trap: R`Using $\gamma/2\pi$ in place of $\gamma$ makes the pulse $2\pi$ times too long.` },
    { id: 'nmr-r5-05', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'resolution', unit: 'ppb',
      q: R`To resolve two proton lines $0.50$ Hz apart on a $600$ MHz spectrometer, the field across the sample must be uniform to better than about ______ parts per billion (two decimal places).`,
      answer: 0.83, tol: 0.01, calc: () => 0.5 / 600e6 * 1e9,
      sol: R`Frequency follows field, so a field spread $\Delta B/B$ smears lines by $\Delta\nu = \nu\,\Delta B/B$. Need $\Delta B/B < 0.50/(6.00\times10^8) = 8.3\times10^{-10} = 0.83$ ppb. Spinning the sample and shim coils make this possible.`,
      trap: R`$0.50/600 = 8.3\times10^{-4}$ treats MHz as Hz.` },
    { id: 'nmr-r5-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'quadrupolar nuclei', format: 'statements',
      q: R`Which statements about nuclear spins and electric quadrupole moments are correct?`,
      options: [R`Only nuclei with $I\ge1$ can have an electric quadrupole moment`, R`A spin-$\tfrac12$ nucleus has a spherical charge distribution as far as NMR is concerned`,
        R`$^{12}$C and $^{16}$O have $I = 0$ and give no NMR signal`, R`$^{14}$N has $I = \tfrac12$, which is why its NMR lines are sharp`], answer: [0, 1, 2],
      sol: R`A quadrupole moment needs the nucleus to "point" along an axis with at least two distinguishable orientations of $|m|$, which requires $I\ge1$; for $I = \tfrac12$ the expectation of the quadrupole operator vanishes. Even-even nuclei ($^{12}$C, $^{16}$O) have $I = 0$. $^{14}$N has $I = 1$ and a quadrupole moment, so its lines are usually BROAD (fast quadrupolar relaxation); $^{15}$N ($I = \tfrac12$) gives sharp lines.`,
      trap: R`$^{14}$N and $^{15}$N are often mixed up: the common isotope is the quadrupolar one.` },
    { id: 'nmr-r5-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'nuclear Overhauser effect',
      q: R`When protons are saturated, the largest possible signal of a dipolar-coupled $^{13}$C nucleus is multiplied by $1 + \dfrac{\gamma_H}{2\gamma_C}$ (extreme narrowing). With $\gamma_H/\gamma_C = 3.977$, this factor is ______ (two decimal places).`,
      answer: 2.99, tol: 0.01, calc: () => 1 + 3.977 / 2,
      sol: R`$1 + 3.977/2 = 2.99$. Saturating the protons drives the $^{13}$C populations through cross-relaxation, and the large proton $\gamma$ pushes the carbon polarisation up by nearly a factor 3. This is a big part of why proton-decoupled $^{13}$C spectra are so much stronger.`,
      trap: R`The enhancement is $1 + \eta$ with $\eta = \gamma_H/2\gamma_C$; $\gamma_H/\gamma_C$ itself (3.98) is too much.` },
    { id: 'nmr-r5-08', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Curie law',
      q: R`A dilute paramagnetic sample is cooled from $300$ K to $77$ K at fixed microwave frequency and field. If the line shape does not change, its ESR signal becomes about`,
      options: [R`the same`, R`$2$ times stronger`, R`$15$ times stronger`, R`$3.9$ times stronger`], answer: 3,
      sol: R`The signal is set by the population difference, which for $h\nu\ll k_BT$ is $\propto1/T$ (Curie law). $300/77 = 3.9$. That is why ESR is often run at liquid-nitrogen or liquid-helium temperatures.`,
      trap: R`$(300/77)^2\approx15$ squares a law that is linear in $1/T$.` },
    { id: 'nmr-r5-09', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'relaxation',
      q: R`A $180^\circ$ pulse inverts the magnetisation ($M_z = -M_0$). After a time $t = 0.5\,T_1$, $M_z/M_0$ is ______ (two decimal places, with sign).`,
      answer: -0.21, tol: 0.01, calc: () => 1 - 2 * Math.exp(-0.5),
      sol: R`$M_z(t) = M_0(1 - 2e^{-t/T_1})$, which starts at $-M_0$ and relaxes to $+M_0$. At $t = 0.5T_1$: $1 - 2e^{-0.5} = 1 - 1.213 = -0.213$. It is still negative; it crosses zero at $t = T_1\ln2 = 0.69T_1$.`,
      trap: R`Using $1 - e^{-t/T_1}$ (recovery from zero) gives $+0.39$.` },
    { id: 'nmr-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'ESR vs NMR', format: 'not',
      q: R`Which statement comparing ESR and NMR is NOT correct?`,
      options: [R`At a field where protons resonate at hundreds of MHz, electrons resonate at hundreds of GHz`,
        R`ESR needs unpaired electrons, so most closed-shell molecules give no ESR signal`,
        R`At the same field and temperature, proton spins are more strongly polarised than electron spins`,
        R`Electron spin relaxation times are usually far shorter than nuclear ones`], answer: 2,
      sol: R`Polarisation $\approx h\nu/2k_BT$ grows with the resonance frequency, which for the electron is 658 times larger: electrons are far MORE polarised (this is the basis of dynamic nuclear polarisation). The other statements hold: 658 times higher frequency, unpaired electrons required, and electron $T_1$, $T_2$ from nanoseconds to microseconds against milliseconds to seconds for nuclei.`,
      trap: R`Bigger particle does not mean bigger polarisation: what counts is $\gamma B$.` },
  ],
  gens: [
    { id: 'nmr-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulses',
      make(r) {
        const [who, g] = choose(r, SPINS), elec = g > 1000;
        const B1 = elec ? choose(r, [0.1, 0.2, 0.5, 1.0, 2.0]) : choose(r, [0.005, 0.01, 0.02, 0.05, 0.1]); // mT
        const ang = choose(r, [90, 180]);
        const t = (ang / 360) / (g * 1e6 * B1 * 1e-3); // s
        const unit = elec ? 'ns' : 'μs', v = +(t * (elec ? 1e9 : 1e6)).toPrecision(3);
        return { q: R`${who[0].toUpperCase() + who.slice(1)} ($\gamma/2\pi = ${g}$ MHz/T) are driven by a resonant field $B_1 = ${B1}$ mT in the rotating frame. The duration of a $${ang}^\circ$ pulse is ______ ${unit} (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit, g, B1, ang, elec,
          sol: R`The nutation frequency is $\nu_1 = (\gamma/2\pi)B_1 = ${g}\times${B1}\times10^{-3}$ MHz $= ${+(g * B1 * 1e-3).toPrecision(4)}$ MHz. One full turn takes $1/\nu_1$; a $${ang}^\circ$ pulse is ${ang === 90 ? 'a quarter' : 'half'} of that: ${v} ${unit}.`,
          trap: 'A 180 degree pulse is half a nutation period, not a full one.' };
      },
      verify: (p) => (p.ang / 360) / (p.g * 1e6 * p.B1 * 1e-3) * (p.elec ? 1e9 : 1e6) },
    { id: 'nmr-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polarisation',
      make(r) {
        const [who, g] = choose(r, SPINS), B = choose(r, [0.35, 1.5, 3, 7, 9.4, 14.1, 23.5]), T = choose(r, [1.5, 4.2, 77, 300]);
        const x = H * g * 1e6 * B / (2 * KB * T), P = Math.tanh(x) * 100, v = +P.toPrecision(3);
        return { q: R`For spin-$\tfrac12$ ${who} ($\gamma/2\pi = ${g}$ MHz/T) in a ${B} T field at ${T} K, the spin polarisation $P = \tanh\left(\dfrac{h\nu}{2k_BT}\right)$ is ______ % (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: '%', g, B, T,
          sol: R`$\nu = ${g}\times${B} = ${+(g * B).toPrecision(5)}$ MHz. $h\nu/2k_BT = ${+x.toPrecision(4)}$. $P = \tanh(${+x.toPrecision(4)}) = ${+(P / 100).toPrecision(4)}$, that is ${v}%.`,
          trap: 'Polarisation grows with field and falls with temperature; for nuclei it is tiny except near absolute zero.' };
      },
      verify: (p) => Math.tanh(H * p.g * 1e6 * p.B / (2 * KB * p.T)) * 100 },
    { id: 'nmr-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'nuclear Overhauser effect',
      make(r) {
        const [X, g] = choose(r, NOE), f = 1 + 42.577 / (2 * g), v = round(f, 2);
        return { q: R`${X} has $\gamma/2\pi = ${g}$ MHz/T (protons: $42.577$ MHz/T). Saturating the protons, in the extreme-narrowing limit with purely dipolar relaxation, multiplies the ${X} signal by $1 + \dfrac{\gamma_H}{2\gamma_X}$. This factor is ______ (two decimal places, with sign).`,
          answer: v, tol: 0.02, g,
          sol: R`$\gamma_H/2\gamma_X = 42.577/(2\times${g}) = ${round(42.577 / (2 * g), 3)}$, so the factor is $${v}$.${g < 0 ? ' Because this nucleus has a negative gyromagnetic ratio, the enhanced signal is inverted, and a partial effect can even cancel the signal.' : ''}`,
          trap: 'Keep the sign of gamma: nuclei like 15N and 29Si have negative gyromagnetic ratios.' };
      },
      verify: (p) => 1 + 42.577 / (2 * p.g) },
  ],
};
