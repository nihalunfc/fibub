// Round 4 extras for heat-capacity: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const A_T3 = 3 * Math.PI ** 4 / 5; // Debye: U = A_T3 * nR * T^4 / theta^3 at T << theta
// Final temperature (K) of n mol of a Debye solid at Ti after absorbing Q joules.
const debyeTf = (n, th, Ti, Q) => (Ti ** 4 + Q * th ** 3 / (A_T3 * n * C.R)) ** 0.25;
// Phonon heat capacity (mJ/mol/K) of a medium with one longitudinal branch, sound speed v (m/s), molar volume Vm (m^3).
const phononC = (T, v, Vm) => 2 * Math.PI ** 2 / 15 * C.kB * (C.kB * T / (C.hbar * v)) ** 3 * Vm * 1e3;

export default {
  items: [
    { id: 'hc-r4-01', type: 'mcq', level: 1, exams: A, sub: 'Dulong-Petit law',
      q: R`At room temperature, which of these metals has the largest specific heat capacity <b>per kilogram</b>?`,
      options: [R`Lead`, R`Copper`, R`Aluminium`, R`Lithium`], answer: 3,
      sol: R`Near the Dulong-Petit limit every mole of atoms needs about $3R = 25$ J/K, whatever the element. Per kilogram that is $3R/M$, largest for the lightest atoms: lithium ($M = 6.9$ g/mol) gives about $3.6$ kJ kg$^{-1}$ K$^{-1}$, against $0.12$ for lead. (Lithium's Debye temperature, about $340$ K, keeps it a little below $3R$, but it still wins easily.)`,
      trap: R`The law fixes the heat capacity per mole of atoms, not per kilogram.` },
    { id: 'hc-r4-02', type: 'nat', level: 2, exams: A, sub: 'Dulong-Petit law',
      q: R`Using the Dulong-Petit law, the specific heat capacity of copper ($M = 63.55$ g/mol) at high temperature is ______ J kg$^{-1}$ K$^{-1}$ ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 392.5, tol: 4, calc: () => 3 * 8.314462618 / 0.06355,
      sol: R`Molar heat capacity $3R = 24.94$ J mol$^{-1}$ K$^{-1}$. One kilogram is $1/0.06355 = 15.74$ mol, so $c = 24.94\times15.74 = 392.5$ J kg$^{-1}$ K$^{-1}$. The measured value at room temperature, $385$, is slightly lower because $T = 300$ K is not far above copper's Debye temperature ($343$ K).`,
      trap: R`Dividing by $63.55$ instead of $0.06355$ (grams instead of kilograms) gives $0.39$.` },
    { id: 'hc-r4-03', type: 'nat', level: 2, exams: A, sub: 'calorimetry',
      q: R`A $0.20$ kg aluminium block ($c = 900$ J kg$^{-1}$ K$^{-1}$) at $100\,^\circ$C is dropped into $0.50$ kg of water ($c = 4186$ J kg$^{-1}$ K$^{-1}$) at $20\,^\circ$C in an insulated container of negligible heat capacity. The final temperature is ______ $^\circ$C (one decimal place).`,
      answer: 26.3, tol: 0.1, calc: () => (0.2 * 900 * 100 + 0.5 * 4186 * 20) / (0.2 * 900 + 0.5 * 4186),
      sol: R`Heat lost by the block equals heat gained by the water: $0.20\times900\,(100 - T) = 0.50\times4186\,(T - 20)$, i.e. $180(100 - T) = 2093(T - 20)$. So $T = \dfrac{18000 + 41860}{180 + 2093} = \dfrac{59860}{2273} = 26.3\,^\circ$C. The water's heat capacity is over eleven times the block's, so the result sits close to $20\,^\circ$C.`,
      trap: R`Averaging the two temperatures by mass ignores the very different specific heats.` },
    { id: 'hc-r4-04', type: 'mcq', level: 3, exams: G, sub: 'Schottky anomaly',
      q: R`The heat capacity of a metal in a magnetic field is measured down to a few millikelvin. Below about $10$ mK it stops falling and rises again roughly as $1/T^2$ as the temperature is lowered. The most likely cause is`,
      options: [R`conduction electrons, whose heat capacity grows at low $T$`, R`phonons, through the Debye $T^3$ law`, R`the high-temperature tail of a Schottky anomaly from nuclear spin levels split by the field`, R`ferromagnetic spin waves`], answer: 2,
      sol: R`Nuclear magnetic (and hyperfine) splittings are of order microkelvin to millikelvin. A set of levels with spacing $\Delta$ gives a Schottky heat capacity that peaks near $kT\sim\Delta$ and falls as $(\Delta/kT)^2$ above it. At a few mK we are on that high-temperature side, so $C\propto1/T^2$, rising as $T$ falls. Electrons give $\gamma T$ and phonons $T^3$, both falling.`,
      trap: R`Electronic and phonon terms both decrease on cooling; a rise on cooling needs a level splitting near $kT$.` },
    { id: 'hc-r4-05', type: 'nat', level: 4, exams: G, sub: 'Debye law',
      q: R`A $1.0$ g silicon crystal ($M = 28.09$ g/mol, $\theta_D = 645$ K) used as a particle detector is at $1.00$ K. It absorbs $1.0\ \mu$J from a particle. Using the Debye law $U = \dfrac{3\pi^4}{5}nR\dfrac{T^4}{\theta_D^3}$, its temperature rises to ______ K.`,
      answer: 2.02, tol: 0.02, calc: () => debyeTf(1 / 28.09, 645, 1, 1e-6),
      sol: R`$n = 1.0/28.09 = 0.0356$ mol and $\tfrac{3\pi^4}{5}nR = 58.45\times0.0356\times8.314 = 17.30$ J/K. The deposited energy raises $T^4$ by $Q\theta_D^3/17.30 = 10^{-6}\times2.683\times10^8/17.30 = 15.5$ K$^4$. So $T_f^4 = 1 + 15.5 = 16.5$ and $T_f = 2.02$ K. Because $C\propto T^3$ is so small at low temperature, a microjoule doubles the temperature; cryogenic detectors use this sensitivity.`,
      trap: R`Using $\Delta T = Q/C(1\ \text{K})$ assumes a constant heat capacity and gives $15.5/4 + 1\approx4.9$ K; $C$ grows quickly as the crystal warms.` },
    { id: 'hc-r4-06', type: 'msq', level: 3, exams: G, sub: 'low-temperature heat capacity', format: 'statements',
      q: R`Which of these give a contribution to the heat capacity proportional to $T$ at low temperature?`,
      options: [R`Conduction electrons in a metal`, R`Tunnelling two-level systems in a glass`, R`Long-wavelength phonons in a one-dimensional chain`, R`Spin waves (magnons) in a three-dimensional ferromagnet`], answer: [0, 1, 2],
      sol: R`Electrons: only those within $kT$ of $E_F$ are excited, giving $\gamma T$. Glasses: a broad, roughly flat spread of two-level splittings means the number of active systems grows as $T$, each holding $\sim kT$, again $C\propto T$. Phonons with linear dispersion in $d$ dimensions give $C\propto T^d$, so $T$ in 1D. Magnons with $\omega\propto k^2$ in 3D give $T^{3/2}$.`,
      trap: R`A linear-in-$T$ heat capacity is not unique to metals; a flat density of excitations gives it.` },
    { id: 'hc-r4-07', type: 'nat', level: 5, exams: G, sub: 'phonon gas',
      q: R`Below about $0.6$ K, liquid helium-4 behaves as a gas of phonons with a single (longitudinal) branch of speed $238$ m/s, so its heat capacity per unit volume is $\dfrac{2\pi^2}{15}k\Big(\dfrac{kT}{\hbar v}\Big)^3$. With molar volume $27.6$ cm$^3$, its molar heat capacity at $0.50$ K is ______ mJ mol$^{-1}$ K$^{-1}$.`,
      answer: 10.4, tol: 0.15, calc: () => phononC(0.5, 238, 27.6e-6),
      sol: R`$kT/\hbar v = 1.381\times10^{-23}\times0.5/(1.055\times10^{-34}\times238) = 2.75\times10^8$ m$^{-1}$; cubed, $2.08\times10^{25}$ m$^{-3}$. Times $k$: $287$; times $2\pi^2/15 = 1.316$: $378$ J m$^{-3}$ K$^{-1}$. Times $27.6\times10^{-6}$ m$^3$/mol: $1.04\times10^{-2}$ J mol$^{-1}$ K$^{-1}$ $= 10.4$ mJ mol$^{-1}$ K$^{-1}$. This is the photon-gas formula with one polarisation instead of two (a liquid has no transverse sound) and $c\to v$.`,
      trap: R`Using three branches, as for a solid, triples the answer; a liquid carries only longitudinal sound.` },
    { id: 'hc-r4-08', type: 'mcq', level: 4, exams: G, sub: 'electronic heat capacity',
      q: R`In a pure (intrinsic) semiconductor with band gap $E_g\gg kT$, the electronic contribution to the heat capacity at low temperature is dominated by the factor`,
      options: [R`$T$, as in a metal`, R`$e^{-E_g/2kT}$`, R`$e^{-E_g/kT}$`, R`$T^3$`], answer: 1,
      sol: R`There is no Fermi surface: the electronic heat capacity comes from exciting electrons across the gap. With $\mu$ near mid-gap, the number of carriers goes as $n_i\propto T^{3/2}e^{-E_g/2kT}$, each costing about $E_g$, so $U\propto n_iE_g$ and $C = dU/dT$ carries the same activation factor $e^{-E_g/2kT}$ (with powers of $T$ in front). It is exponentially small, which is why the lattice dominates an insulator's heat capacity.`,
      trap: R`The exponent has $E_g/2$: the chemical potential sits halfway across the gap, so each carrier is $E_g/2$ above it.` },
    { id: 'hc-r4-09', type: 'msq', level: 4, exams: A, sub: 'thermodynamic identities', format: 'statements',
      q: R`Which statements about $C_P$ and $C_V$ of a substance are correct?`,
      options: [R`$C_P - C_V = TV\alpha^2/\kappa_T$, which is never negative.`, R`$C_P/C_V = \kappa_T/\kappa_S$.`, R`As $T\to0$, $C_P - C_V$ vanishes faster than $C_V$.`, R`For water at $4\,^\circ$C, $C_P$ is larger than $C_V$.`], answer: [0, 1, 2],
      sol: R`The general identity $C_P - C_V = TV\alpha^2/\kappa_T$ has $\alpha^2\ge0$ and $\kappa_T > 0$ for a stable substance. The ratio of heat capacities equals the ratio of isothermal to adiabatic compressibilities. As $T\to0$, $\alpha$ vanishes (third law), so $T\alpha^2$ goes to zero faster than $C_V$. At $4\,^\circ$C water has its density maximum, $\alpha = 0$, so there $C_P = C_V$ exactly.`,
      trap: R`$C_P > C_V$ is usual, not universal: it fails, becoming an equality, wherever $\alpha = 0$.` },
    { id: 'hc-r4-10', type: 'mcq', level: 3, exams: G, sub: 'Debye model',
      q: R`A Debye model of a one-dimensional chain of $N$ atoms ($\omega = vk$ up to $\omega_D = k\theta_D/\hbar$, $N$ modes) gives, at $T\ll\theta_D$,`,
      options: [R`$C = \dfrac{\pi^2}{3}Nk\dfrac{T}{\theta_D}$`, R`$C = \dfrac{12\pi^4}{5}Nk\Big(\dfrac{T}{\theta_D}\Big)^3$`, R`$C = Nk\dfrac{T}{\theta_D}$`, R`$C = \dfrac{\pi^2}{2}Nk\dfrac{T}{\theta_D}$`], answer: 0,
      sol: R`In 1D the density of modes is flat: $g(\omega) = N/\omega_D$. $U = \dfrac{N}{\omega_D}\displaystyle\int_0^\infty\frac{\hbar\omega\,d\omega}{e^{\hbar\omega/kT} - 1} = \frac{N(kT)^2}{\hbar\omega_D}\cdot\frac{\pi^2}{6}$, using $\int_0^\infty\frac{x\,dx}{e^x - 1} = \frac{\pi^2}{6}$. Then $C = dU/dT = \dfrac{\pi^2}{3}Nk\dfrac{T}{\theta_D}$. At $T = \theta_D/20$ this is $0.16Nk$.`,
      trap: R`The $12\pi^4/5$ and $T^3$ belong to three dimensions with three branches.` },
  ],
  gens: [
    { id: 'hc-r4g1', type: 'nat', level: 1, exams: A, sub: 'Dulong-Petit law',
      make(r) {
        const [el, M] = choose(r, [['lithium', 6.94], ['aluminium', 26.98], ['iron', 55.85], ['copper', 63.55], ['silver', 107.87], ['tin', 118.71], ['gold', 196.97], ['lead', 207.2]]);
        const c = 3 * C.R / (M * 1e-3);
        return { q: `By the Dulong-Petit law, the high-temperature specific heat capacity of ${el} ($M = ${M}$ g/mol) is ______ J kg$^{-1}$ K$^{-1}$.`,
          answer: round(c, 1), tol: round(c * 0.01, 1), M,
          sol: `$c = 3R/M = 24.94/${round(M * 1e-3, 5)} = ${round(c, 1)}$ J kg$^{-1}$ K$^{-1}$.`,
          trap: 'Convert the molar mass to kg/mol before dividing.' };
      },
      verify: (p) => 3 * C.R / (p.M * 1e-3) },
    { id: 'hc-r4g2', type: 'nat', level: 4, exams: G, sub: 'Debye law',
      make(r) {
        const [name, th, M] = choose(r, [['silicon', 645, 28.09], ['germanium', 374, 72.63], ['diamond', 2230, 12.01]]);
        const m = choose(r, [0.1, 0.5, 1, 5, 10]), Ti = choose(r, [0.02, 0.05, 0.1, 0.5, 1]), Q = choose(r, [0.01, 0.1, 1]);
        const n = m / M, Tf = debyeTf(n, th, Ti, Q * 1e-6);
        return { q: `A $${m}$ g ${name} crystal ($M = ${M}$ g/mol, $\\theta_D = ${th}$ K) at $${Ti}$ K absorbs $${Q}\\ \\mu$J. Using $U = \\tfrac{3\\pi^4}{5}nRT^4/\\theta_D^3$, its final temperature is ______ K (three decimal places).`,
          answer: round(Tf, 3), tol: Math.max(0.002, round(Tf * 0.005, 3)), n, th, Ti, Q,
          sol: `$n = ${round(n, 5)}$ mol. $T_f^4 = T_i^4 + Q\\theta_D^3/(\\tfrac{3\\pi^4}{5}nR) = ${round(Ti ** 4, 6)} + ${round(Q * 1e-6 * th ** 3 / (A_T3 * n * C.R), 4)}$, so $T_f = ${round(Tf, 3)}$ K.`,
          trap: 'The heat capacity grows as $T^3$ during the warming, so work with the energy $U\\propto T^4$, not with $C\\Delta T$.' };
      },
      verify: (p) => debyeTf(p.n, p.th, p.Ti, p.Q * 1e-6) },
    { id: 'hc-r4g3', type: 'nat', level: 5, exams: G, sub: 'phonon gas',
      make(r) {
        const T = choose(r, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), v = choose(r, [238, 240, 250]), Vm = choose(r, [27.6, 26.0, 25.0]);
        const c = phononC(T, v, Vm * 1e-6);
        return { q: `Model liquid helium-4 at $${T}$ K as a phonon gas with one longitudinal branch of speed $${v}$ m/s, so $c_V = \\dfrac{2\\pi^2}{15}k\\Big(\\dfrac{kT}{\\hbar v}\\Big)^3$ per unit volume. With molar volume $${Vm}$ cm$^3$, its molar heat capacity is ______ mJ mol$^{-1}$ K$^{-1}$ (three decimal places).`,
          answer: round(c, 3), tol: Math.max(0.001, round(c * 0.01, 3)), T, v, Vm,
          sol: `$kT/\\hbar v = ${round(C.kB * T / (C.hbar * v) / 1e8, 4)}\\times10^8$ m$^{-1}$. $c_V = \\dfrac{2\\pi^2}{15}k(kT/\\hbar v)^3 = ${round(c / (Vm * 1e-6) / 1e3, 3)}$ J m$^{-3}$ K$^{-1}$; times the molar volume, $${round(c, 3)}$ mJ mol$^{-1}$ K$^{-1}$.`,
          trap: 'A liquid has only longitudinal sound: one branch, not three.' };
      },
      verify: (p) => phononC(p.T, p.v, p.Vm * 1e-6) },
  ],
};
