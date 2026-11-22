// Round 5 extras for free-electron-model: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const JG = ['jam', 'gate', 'net'];
const H2M = 0.0380998; // hbar^2/(2 m_e) in eV nm^2
const skin = (sig, f) => Math.sqrt(2 / (C.mu0 * sig * 2 * Math.PI * f)) * 1e6; // micrometres
const RK = C.h / (C.e * C.e); // h/e^2 in ohm
const efFrom = (rho, M, Z) => H2M * (3 * Math.PI ** 2 * Z * rho * 1e6 / M * C.NA * 1e-27) ** (2 / 3);

export default {
  items: [
    { id: 'fem-r5-01', type: 'mcq', level: 1, exams: JG, sub: 'Fermi energy',
      q: R`A copper block is replaced by one of the same copper with twice the volume. In the free electron model, its Fermi energy`,
      options: [R`doubles`, R`halves`, R`grows by $2^{2/3}$`, R`is unchanged`], answer: 3,
      sol: R`$E_F = \dfrac{\hbar^2}{2m}(3\pi^2n)^{2/3}$ depends only on the electron density $n = N/V$. Doubling the block doubles both $N$ and $V$, so $n$ and $E_F$ stay the same. The energy levels get closer together, but the highest filled level stays put.`,
      trap: R`$2^{2/3}$ would follow from doubling $N$ at fixed volume, i.e. doubling the density.` },
    { id: 'fem-r5-02', type: 'nat', level: 2, exams: JG, sub: 'Hall coefficient',
      q: R`A monovalent metal has $5.86\times10^{28}$ conduction electrons per m$^3$. Its free-electron Hall coefficient $R_H = -1/ne$ is ______ $\times10^{-10}$ m$^3$/C (give the sign, to two decimal places).`,
      answer: -1.07, tol: 0.01, calc: () => -1 / (5.86e28 * C.e) * 1e10,
      sol: R`$ne = 5.86\times10^{28}\times1.602\times10^{-19} = 9.39\times10^9$ C/m$^3$, so $R_H = -1/9.39\times10^9 = -1.07\times10^{-10}$ m$^3$/C. The sign is negative because the carriers are electrons; measuring $R_H$ is the standard way to count carriers.`,
      trap: R`Leaving out the sign: for electrons the Hall coefficient is negative.` },
    { id: 'fem-r5-03', type: 'mcq', level: 2, exams: JG, sub: 'Fermi velocity',
      q: R`In a metal with $v_F = 1.57\times10^6$ m/s, the Fermi velocity is larger than the classical thermal speed $\sqrt{3k_BT/m_e}$ at $300$ K by a factor of about`,
      options: [R`$13$`, R`$1$`, R`$180$`, R`$0.075$`], answer: 0,
      sol: R`$\sqrt{3k_BT/m_e} = \sqrt{3\times1.381\times10^{-23}\times300/9.109\times10^{-31}} = 1.17\times10^5$ m/s. The ratio is $1.57\times10^6/1.17\times10^5 = 13.4$. Pauli exclusion forces the electrons up to the Fermi energy, so they move far faster than a classical gas at room temperature; Drude's estimate of the mean free path was too short for this reason.`,
      trap: R`$180$ is the ratio of the energies ($v^2$), not of the speeds.` },
    { id: 'fem-r5-04', type: 'nat', level: 3, exams: JG, sub: 'AC conductivity',
      q: R`Copper has DC conductivity $5.9\times10^7$ S/m. In the low-frequency (Drude, $\omega\tau\ll1$) regime, its skin depth $\delta = \sqrt{2/\mu_0\sigma\omega}$ at $1.0$ MHz is ______ $\mu$m (to one decimal place).`,
      answer: 65.5, tol: 0.3, calc: () => skin(5.9e7, 1e6),
      sol: R`$\mu_0\sigma\omega = 1.257\times10^{-6}\times5.9\times10^7\times2\pi\times10^6 = 4.66\times10^8$ m$^{-2}$. Then $\delta = \sqrt{2/4.66\times10^8} = \sqrt{4.29\times10^{-9}} = 6.55\times10^{-5}$ m $= 65.5\ \mu$m. At radio frequencies current flows only in a thin surface layer, which is why RF conductors are often silver-plated or made hollow.`,
      trap: R`Using $f$ instead of $\omega = 2\pi f$ gives $164\ \mu$m.` },
    { id: 'fem-r5-05', type: 'msq', level: 3, exams: G, sub: 'Drude in a magnetic field', format: 'statements',
      q: R`For a single kind of carrier in the Drude model (density $n$, charge $q$, relaxation time $\tau$, mass $m$) in crossed electric and magnetic fields, which statements are correct?`,
      options: [R`The Hall coefficient $1/nq$ does not depend on $\tau$.`, R`The resistance along the current (transverse magnetoresistance) does not change with $B$.`, R`The cyclotron frequency is $|q|B/m$.`, R`The Hall field does not depend on $B$.`], answer: [0, 1, 2],
      sol: R`In steady state the Hall field exactly cancels the magnetic force on the drifting carriers, $E_H = v_dB = jB/nq$, so $R_H = E_H/jB = 1/nq$, with no $\tau$; and with the sideways force cancelled, the motion along $\mathbf j$ is exactly as without $B$, so there is no magnetoresistance. $\omega_c = |q|B/m$ follows from the Lorentz force. The Hall field grows linearly with $B$. Real magnetoresistance needs two kinds of carriers or a spread of $\tau$.`,
      trap: R`Zero magnetoresistance is a real prediction of the one-carrier model; measured magnetoresistance is evidence for more than one carrier type.` },
    { id: 'fem-r5-06', type: 'mcq', level: 3, exams: JG, sub: 'Fermi-Dirac function',
      q: R`A free-electron metal has $E_F = 5.0$ eV. At $300$ K ($k_BT = 25.9$ meV), roughly what fraction of its conduction electrons have energies within about $k_BT$ of $E_F$ (the ones that can absorb thermal energy)?`,
      options: [R`about $50\%$`, R`about $1.6\%$`, R`about $0.005\%$`, R`about $16\%$`], answer: 1,
      sol: R`For a 3D gas $g(E_F) = 3n/2E_F$. The number in a window of width about $2k_BT$ around $E_F$ is $g(E_F)\times2k_BT = 3nk_BT/E_F$, so the fraction is $3\times0.0259/5.0\approx0.016$: about $1.6\%$. Only these electrons can change state, which is why the electronic heat capacity is so much smaller than the classical $\tfrac32Nk_B$.`,
      trap: R`Classical thinking says all electrons share thermal energy; Pauli exclusion leaves only a thin shell able to.` },
    { id: 'fem-r5-07', type: 'nat', level: 4, exams: G, sub: 'quantum conductance',
      q: R`A short, clean metallic constriction carries electrons ballistically in 3 fully transmitting channels (spin included in the factor 2 of the conductance quantum $2e^2/h$). Its resistance is ______ k$\Omega$ (to two decimal places).`,
      answer: 4.3, tol: 0.01, calc: () => RK / 2 / 3 / 1e3,
      sol: R`Landauer: $G = (2e^2/h)\sum_nT_n = 3\times2e^2/h$. With $h/e^2 = 25.81$ k$\Omega$, one channel gives $12.91$ k$\Omega$ and three give $12.91/3 = 4.30$ k$\Omega$. The resistance appears at the contacts, even with no scattering inside: a 1D free electron gas cannot have zero resistance.`,
      trap: R`Using $e^2/h$ (no spin) per channel doubles the answer to $8.60$ k$\Omega$.` },
    { id: 'fem-r5-08', type: 'msq', level: 4, exams: G, sub: 'degeneracy pressure', format: 'statements',
      q: R`For a 3D free electron gas at $T = 0$ with density $n$ and Fermi energy $E_F$, which statements are correct?`,
      options: [R`Its pressure is $P = \tfrac25nE_F$.`, R`Its bulk modulus $B = -V\,dP/dV$ is $\tfrac53P = \tfrac23nE_F$.`, R`$B$ grows as $n^{5/3}$.`, R`$B$ does not depend on the electron mass.`], answer: [0, 1, 2],
      sol: R`The total energy is $U = \tfrac35NE_F$ with $E_F\propto V^{-2/3}$, so $P = -dU/dV = \tfrac23U/V = \tfrac25nE_F$. Since $P\propto V^{-5/3}$, $B = \tfrac53P = \tfrac23nE_F$. With $E_F\propto n^{2/3}$, $B\propto n^{5/3}$. $E_F = \hbar^2(3\pi^2n)^{2/3}/2m$, so $B\propto1/m$: lighter particles push harder (white dwarfs are held up by electrons, not nuclei).`,
      trap: R`The mass enters through $E_F\propto1/m$.` },
    { id: 'fem-r5-09', type: 'nat', level: 5, exams: JG, sub: 'Fermi energy',
      q: R`Aluminium has density $2.70$ g cm$^{-3}$, molar mass $26.98$ g mol$^{-1}$ and 3 conduction electrons per atom. Its free-electron Fermi energy is ______ eV (to one decimal place). Take $\hbar^2/2m_e = 0.0381$ eV nm$^2$ and $N_A = 6.022\times10^{23}$ mol$^{-1}$.`,
      answer: 11.7, tol: 0.1, calc: () => efFrom(2.70, 26.98, 3),
      sol: R`Atoms per m$^3$: $2.70\times10^6\text{ g/m}^3/26.98\times6.022\times10^{23} = 6.03\times10^{28}$; times 3 gives $n = 1.81\times10^{29}$ m$^{-3} = 181$ nm$^{-3}$. Then $k_F = (3\pi^2\times181)^{1/3} = (5353)^{1/3} = 17.5$ nm$^{-1}$, and $E_F = 0.0381\times17.5^2 = 11.7$ eV.`,
      trap: R`Forgetting the valence 3 gives $5.6$ eV; forgetting to change g cm$^{-3}$ to g m$^{-3}$ wrecks the powers of ten.` },
    { id: 'fem-r5-10', type: 'mcq', level: 5, exams: G, sub: 'Wiedemann-Franz',
      q: R`The ratio $\kappa/\sigma T$ of a pure metal is measured from 2 K to 600 K. Compared with the Sommerfeld value $L_0 = 2.44\times10^{-8}$ W $\Omega$ K$^{-2}$, it is`,
      options: [R`equal to $L_0$ at all temperatures`, R`below $L_0$ at low temperature and equal to it at high temperature`, R`close to $L_0$ at low and high temperatures, and below it at intermediate temperatures`, R`above $L_0$ at intermediate temperatures`], answer: 2,
      sol: R`The law needs elastic scattering, which affects charge and heat currents equally. At low $T$ impurities scatter elastically; at high $T$ ($T\gtrsim\Theta_D$) phonon scattering is nearly elastic too. At intermediate temperatures phonons have small wave vectors: they relax the heat current (by moving electrons slightly up or down in energy) much more than the charge current (which needs large-angle scattering), so $\kappa$ falls more than $\sigma$ and the ratio dips below $L_0$.`,
      trap: R`The law is not exact at all temperatures; its failure is a sign of inelastic small-angle scattering.` },
  ],
  gens: [
    { id: 'fem-r5g1', type: 'nat', level: 3, exams: JG, sub: 'AC conductivity',
      make(r) {
        const [nm, s] = choose(r, [['copper', 5.9e7], ['aluminium', 3.7e7], ['silver', 6.3e7], ['brass', 1.6e7], ['stainless steel', 1.4e6]]);
        const f = choose(r, [50, 1e3, 1e5, 1e6, 1e8, 1e9]), d = skin(s, f);
        const fs = f >= 1e9 ? `${f / 1e9}\\text{ GHz}` : f >= 1e6 ? `${f / 1e6}\\text{ MHz}` : f >= 1e3 ? `${f / 1e3}\\text{ kHz}` : `${f}\\text{ Hz}`;
        return { q: R`For ${nm} ($\sigma = ${+(s / 1e7).toPrecision(2)}\times10^7$ S/m) at $${fs}$, the low-frequency skin depth $\sqrt{2/\mu_0\sigma\omega}$ is ______ $\mu$m (to three significant figures).`,
          answer: +d.toPrecision(3), tol: +(d * 0.004).toPrecision(2), s, f,
          sol: R`$\mu_0\sigma\omega = 1.257\times10^{-6}\times${+(s / 1e7).toPrecision(2)}\times10^7\times2\pi\times${f} = ${(C.mu0 * s * 2 * Math.PI * f).toExponential(3).replace('e+', '\\times10^{') + '}'}$ m$^{-2}$, so $\delta = ${+d.toPrecision(3)}\ \mu$m.`,
          trap: 'Use $\\omega = 2\\pi f$; the skin depth falls as $1/\\sqrt f$.' };
      },
      verify: (p) => skin(p.s, p.f) },
    { id: 'fem-r5g2', type: 'nat', level: 4, exams: G, sub: 'quantum conductance',
      make(r) {
        const T = [1, choose(r, [1, 0.8, 0.5, 0.3]), choose(r, [0, 0.5, 0.2, 0.1])];
        const sum = round(T[0] + T[1] + T[2], 4), Rk = RK / 2 / sum / 1e3;
        return { q: R`A ballistic constriction has three channels with transmissions $${T[0]}$, $${T[1]}$ and $${T[2]}$. Using the Landauer formula $G = (2e^2/h)\sum T_n$, its resistance is ______ k$\Omega$ (to two decimal places).`,
          answer: round(Rk, 2), tol: Math.max(0.01, round(Rk * 0.003, 2)), sum,
          sol: R`$\sum T_n = ${sum}$, and $h/2e^2 = 12.906$ k$\Omega$, so $R = 12.906/${sum} = ${round(Rk, 2)}$ k$\Omega$.`,
          trap: 'The quantum $2e^2/h$ already includes both spins.' };
      },
      verify: (p) => RK / 2 / p.sum / 1e3 },
    { id: 'fem-r5g3', type: 'mcq', level: 5, exams: JG, sub: 'Fermi energy',
      make(r) {
        const [nm, rho, M, Z] = choose(r, [['sodium', 0.97, 22.99, 1], ['potassium', 0.86, 39.10, 1], ['copper', 8.96, 63.55, 1], ['magnesium', 1.74, 24.31, 2], ['zinc', 7.14, 65.38, 2], ['aluminium', 2.70, 26.98, 3], ['silver', 10.49, 107.87, 1]]);
        const E = efFrom(rho, M, Z);
        const sh = (v) => `$${v.toFixed(2)}$ eV`;
        const o = mcqOptions(r, E, [Z > 1 ? efFrom(rho, M, 1) : efFrom(rho, M, 2), 1.5 * E, E ** 1.5 / 3, E / 2], sh);
        return { q: R`${nm[0].toUpperCase() + nm.slice(1)} has density $${rho}$ g cm$^{-3}$, molar mass $${M}$ g mol$^{-1}$ and ${Z} conduction electron${Z > 1 ? 's' : ''} per atom. Its free-electron Fermi energy is closest to (take $\hbar^2/2m_e = 0.0381$ eV nm$^2$)`, ...o,
          sol: R`$n = ${Z}\times\dfrac{${rho}\times10^6}{${M}}\times6.022\times10^{23} = ${(Z * rho * 1e6 / M * C.NA).toExponential(3).replace('e+', '\\times10^{') + '}'}$ m$^{-3}$. Then $E_F = 0.0381\,(3\pi^2n)^{2/3}$ with $n$ in nm$^{-3}$: $${E.toFixed(2)}$ eV.`,
          trap: 'Multiply by the valence and keep $n$ in nm$^{-3}$ when using $\\hbar^2/2m_e$ in eV nm$^2$.' };
      } },
  ],
};
