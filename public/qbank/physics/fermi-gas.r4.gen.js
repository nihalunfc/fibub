// Round 4 extras for fermi-gas: original questions, written 2026-11-22.
import { choose, int, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
// Free-electron density (m^-3) from a Fermi energy in eV, spin 1/2.
const nFromEF = (E) => (2 * C.me * E * C.e) ** 1.5 / (3 * Math.PI ** 2 * C.hbar ** 3);
// Conduction electron densities (10^28 m^-3) from the free-electron model tables.
const METALS = [['lithium', 4.70], ['sodium', 2.65], ['potassium', 1.40], ['copper', 8.47], ['silver', 5.86], ['aluminium', 18.1], ['magnesium', 8.61], ['zinc', 13.2]];

export default {
  items: [
    { id: 'fgas-r4-01', type: 'mcq', level: 1, exams: A, sub: 'Fermi sphere',
      q: R`In an ideal three-dimensional Fermi gas at $T = 0$, the occupied single-particle states fill a region of wave-vector space that is`,
      options: [R`a solid sphere of radius $k_F$ centred on $k = 0$`, R`a thin spherical shell at $k_F$`, R`a cube, set by the box's shape`, R`a single point at $k = 0$`], answer: 0,
      sol: R`The energy $\hbar^2k^2/2m$ depends only on $|k|$, and at $T = 0$ the particles fill the lowest energies first, two per allowed $k$ point (spin up and down), up to $E_F$. All points with $|k| < k_F$ are filled: a solid Fermi sphere. The box shape only sets the spacing of the $k$ points. A thin shell at $k_F$ is where the action is at low $T$, but the sphere is full.`,
      trap: R`All fermions in the lowest state is the boson picture; Pauli forbids it.` },
    { id: 'fgas-r4-02', type: 'nat', level: 2, exams: A, sub: 'free electron model',
      q: R`Aluminium has a Fermi energy of $11.7$ eV and $6.02\times10^{28}$ atoms per m$^3$. Using the free-electron relation $E_F = \dfrac{\hbar^2}{2m}(3\pi^2n)^{2/3}$, the number of conduction electrons per atom, to the nearest whole number, is ______.`,
      answer: 3, tol: 0, calc: () => Math.round(nFromEF(11.7) / 6.02e28),
      sol: R`Invert: $n = \dfrac{(2mE_F)^{3/2}}{3\pi^2\hbar^3}$. $2mE_F = 2\times9.11\times10^{-31}\times11.7\times1.602\times10^{-19} = 3.41\times10^{-48}$; its $3/2$ power is $6.31\times10^{-72}$; $3\pi^2\hbar^3 = 29.6\times1.173\times10^{-102} = 3.47\times10^{-101}$. So $n = 1.82\times10^{29}$ m$^{-3}$, and $1.82\times10^{29}/6.02\times10^{28} = 3.0$: aluminium gives three electrons per atom, as its valence suggests.`,
      trap: R`Forgetting the spin factor (using $6\pi^2$) gives half the density, about $1.5$ per atom.` },
    { id: 'fgas-r4-03', type: 'mcq', level: 3, exams: G, sub: 'electronic heat capacity',
      q: R`In a "heavy-fermion" metal the conduction electrons act like a free Fermi gas with effective mass $100\,m_e$, at the same density as an ordinary metal. Compared with free electrons, its Sommerfeld coefficient $\gamma$ (in $C_{el} = \gamma T$) is`,
      options: [R`unchanged, since it depends on the density only`, R`$10$ times larger`, R`$1/100$ as large`, R`$100$ times larger`], answer: 3,
      sol: R`$\gamma = \tfrac{\pi^2}{3}k^2g(E_F)$, and $g(E_F) = 3N/2E_F$. At fixed density $E_F = \hbar^2k_F^2/2m^*$ falls as $1/m^*$, so $g(E_F)$ and $\gamma$ grow in proportion to $m^*$: $100$ times. Heavy-fermion compounds have $\gamma$ values hundreds of times copper's, which is how their large effective masses are measured.`,
      trap: R`A heavier particle has a lower Fermi energy, so more states per unit energy, not fewer.` },
    { id: 'fgas-r4-04', type: 'mcq', level: 3, exams: G, sub: 'degeneracy pressure',
      q: R`The speed of sound in an ideal degenerate Fermi gas at $T = 0$, $\sqrt{B/\rho}$ with $B$ the bulk modulus and $\rho = nm$, is`,
      options: [R`$v_F$`, R`$v_F/3$`, R`$v_F/\sqrt3$`, R`$\sqrt{3/5}\,v_F$`], answer: 2,
      sol: R`$P = \tfrac25nE_F\propto n^{5/3}$, so $B = n\,dP/dn = \tfrac53P = \tfrac23nE_F$. Then $v^2 = \dfrac{B}{nm} = \dfrac{2E_F}{3m} = \dfrac{2}{3m}\cdot\dfrac{mv_F^2}{2} = \dfrac{v_F^2}{3}$, so $v = v_F/\sqrt3$. This is the "first sound" of a degenerate gas, set by the Fermi motion rather than by temperature.`,
      trap: R`$\sqrt{3/5}\,v_F$ is the rms speed of the particles, not the sound speed.` },
    { id: 'fgas-r4-05', type: 'msq', level: 3, exams: G, sub: 'spin polarisation', format: 'statements',
      q: R`A spin-$\tfrac12$ ideal Fermi gas at $T = 0$ is fully spin-polarised (all spins up) at the same number density. Compared with the unpolarised gas, which statements are correct?`,
      options: [R`Its Fermi energy is $2^{2/3}$ times larger.`, R`Its mean kinetic energy per particle is $2^{2/3}$ times larger.`, R`Its degeneracy pressure is $2^{2/3}$ times larger.`, R`Its Fermi wave number is $2$ times larger.`], answer: [0, 1, 2],
      sol: R`With one spin state per $k$ point instead of two, the same particles need twice the $k$-space volume: $k_F^3$ doubles, so $k_F$ grows by $2^{1/3}$ and $E_F\propto k_F^2$ by $2^{2/3}$. The mean energy $\tfrac35E_F$ and pressure $\tfrac25nE_F$ grow by the same factor. This energy cost is why ordinary metals are not ferromagnetic unless interactions pay for it.`,
      trap: R`Doubling the $k$-space volume multiplies the radius by $2^{1/3}$, not 2.` },
    { id: 'fgas-r4-06', type: 'mcq', level: 4, exams: G, sub: 'magnetic response',
      q: R`A free-electron gas has spin (Pauli) susceptibility $\chi_P$ and an orbital (Landau) diamagnetic susceptibility $-\tfrac13\chi_P$. Its total susceptibility is`,
      options: [R`$\tfrac43\chi_P$`, R`$\tfrac23\chi_P$`, R`$\chi_P$`, R`$-\tfrac13\chi_P$`], answer: 1,
      sol: R`The spins line up with the field (paramagnetic, $\chi_P$); the orbital motion quantised into Landau levels gives a diamagnetic response one third as large for free electrons. Total $= \chi_P - \tfrac13\chi_P = \tfrac23\chi_P$, positive: a free-electron metal is weakly paramagnetic. Classically the orbital response would vanish exactly (Bohr-van Leeuwen), so Landau diamagnetism is a quantum effect. In real metals the ratio changes with the effective mass.`,
      trap: R`Orbital diamagnetism opposes the spin response, so it subtracts.` },
    { id: 'fgas-r4-07', type: 'nat', level: 4, exams: G, sub: 'two-dimensional Fermi gas',
      q: R`Electrons in graphene have $E = \hbar v_F|k|$ with $v_F = 1.0\times10^6$ m/s and four internal states (two spins, two valleys). At a carrier density of $1.0\times10^{12}$ cm$^{-2}$, the Fermi energy measured from the Dirac point is ______ meV.`,
      answer: 117, tol: 1.5, calc: () => 1.054571817e-34 * 1e6 * Math.sqrt(Math.PI * 1e16) / 1.602176634e-19 * 1e3,
      sol: R`In 2D the number of $k$ points inside radius $k_F$ is $A\pi k_F^2/(2\pi)^2$; with 4 states each, $n = 4\pi k_F^2/4\pi^2 = k_F^2/\pi$, so $k_F = \sqrt{\pi n}$. $n = 10^{16}$ m$^{-2}$ gives $k_F = 1.77\times10^8$ m$^{-1}$. $E_F = \hbar v_Fk_F = 1.055\times10^{-34}\times10^6\times1.77\times10^8 = 1.87\times10^{-20}$ J $= 117$ meV. With a linear dispersion, $E_F\propto\sqrt n$ instead of $n$.`,
      trap: R`$1$ cm$^{-2}$ is $10^4$ m$^{-2}$, so $10^{12}$ cm$^{-2}$ is $10^{16}$ m$^{-2}$, not $10^{14}$.` },
    { id: 'fgas-r4-08', type: 'nat', level: 5, exams: G, sub: 'magnetic response',
      q: R`Sodium's conduction electrons have $E_F = 3.24$ eV. Treating them as an ideal gas with Zeeman energies $\mp\mu_BB$ ($\mu_B = 5.788\times10^{-5}$ eV/T), the magnetic field needed to polarise them completely is ______ $\times10^4$ T.`,
      answer: 4.44, tol: 0.05, calc: () => 2 ** (2 / 3) * 3.24 / (2 * 5.7883818060e-5) / 1e4,
      sol: R`Fully polarised at the same density, the up-spin electrons fill to a kinetic energy $2^{2/3}E_F = 5.14$ eV (one spin state per $k$ point). In the field the up band is lowered by $\mu_BB$ and the down band raised by $\mu_BB$. Complete polarisation needs the top of the up electrons, $-\mu_BB + 2^{2/3}E_F$, to lie no higher than the bottom of the down band, $+\mu_BB$: $B = \dfrac{2^{2/3}E_F}{2\mu_B} = \dfrac{5.14}{1.158\times10^{-4}} = 4.44\times10^4$ T. Laboratory fields of tens of tesla polarise only a fraction $\sim\mu_BB/E_F\sim10^{-3}$, which is why Pauli paramagnetism is so weak.`,
      trap: R`Setting $\mu_BB = E_F$ ignores both the doubled band shift and the higher Fermi energy of a single-spin gas.` },
    { id: 'fgas-r4-09', type: 'msq', level: 4, exams: G, sub: 'degenerate thermodynamics', format: 'statements',
      q: R`For an ideal 3D Fermi gas at $T\ll T_F$, which statements are correct?`,
      options: [R`$C_V$ is proportional to $T$.`, R`Its entropy equals its heat capacity $C_V$ (to leading order).`, R`At fixed volume, its pressure falls slightly as $T$ rises.`, R`$C_P - C_V$ vanishes faster than $C_V$ as $T\to0$.`], answer: [0, 1, 3],
      sol: R`$C_V = \gamma T$, and $S = \int_0^T(C_V/T')dT' = \gamma T = C_V$. The pressure is $P = \tfrac23U/V$ and $U$ rises by $\propto T^2$, so $P$ rises, not falls. $C_P - C_V = TV\alpha^2/\kappa_T$; the expansion coefficient $\alpha$ is itself $\propto T$ and $\kappa_T$ tends to a constant, so $C_P - C_V\propto T^3$, vanishing faster than $C_V$, as the third law requires.`,
      trap: R`The thermal correction to the energy is positive, so the pressure grows with temperature.` },
    { id: 'fgas-r4-10', type: 'nat', level: 3, exams: G, sub: 'degeneracy pressure',
      q: R`The conduction electrons of copper ($n = 8.47\times10^{28}$ m$^{-3}$) and sodium ($n = 2.65\times10^{28}$ m$^{-3}$) are treated as ideal Fermi gases at $T = 0$. The ratio of copper's electron degeneracy pressure to sodium's is ______ (two decimal places).`,
      answer: 6.94, tol: 0.05, calc: () => (8.47 / 2.65) ** (5 / 3),
      sol: R`$P = \tfrac25nE_F$ with $E_F\propto n^{2/3}$, so $P\propto n^{5/3}$. Ratio $= (8.47/2.65)^{5/3} = 3.196^{5/3} = e^{1.667\times1.162} = 6.94$. Both pressures are tens of gigapascals; in a metal they are balanced by the attraction of the ions.`,
      trap: R`Using $P\propto n^{2/3}$ (the Fermi energy alone) gives $2.17$.` },
  ],
  gens: [
    { id: 'fgas-r4g1', type: 'nat', level: 4, exams: G, sub: 'two-dimensional Fermi gas',
      make(r) {
        const n = choose(r, [0.1, 0.3, 0.5, 1, 2, 5, 10]), v = choose(r, [0.8, 1.0, 1.1]);
        const E = C.hbar * v * 1e6 * Math.sqrt(Math.PI * n * 1e16) / C.e * 1e3;
        return { q: `Electrons in graphene ($E = \\hbar v_F|k|$, $v_F = ${v}\\times10^6$ m/s, four internal states) have carrier density $${n}\\times10^{12}$ cm$^{-2}$. Their Fermi energy above the Dirac point is ______ meV.`,
          answer: round(E, 1), tol: round(Math.max(0.1, E * 0.01), 1), n, v,
          sol: `With 4 states per $k$ point, $n = k_F^2/\\pi$, so $k_F = \\sqrt{\\pi n} = ${round(Math.sqrt(Math.PI * n * 1e16) / 1e8, 4)}\\times10^8$ m$^{-1}$. $E_F = \\hbar v_Fk_F = ${round(E, 1)}$ meV.`,
          trap: 'Convert cm$^{-2}$ to m$^{-2}$ with a factor $10^4$, and use $E_F\\propto\\sqrt n$ for a linear dispersion.' };
      },
      verify: (p) => C.hbar * p.v * 1e6 * Math.sqrt(Math.PI * p.n * 1e16) / C.e * 1e3 },
    { id: 'fgas-r4g2', type: 'nat', level: 3, exams: G, sub: 'degeneracy pressure',
      make(r) {
        const i = int(r, 0, METALS.length - 1); let j = int(r, 0, METALS.length - 2); if (j >= i) j++;
        const [hi, lo] = METALS[i][1] > METALS[j][1] ? [METALS[i], METALS[j]] : [METALS[j], METALS[i]];
        const x = (hi[1] / lo[1]) ** (5 / 3);
        return { q: `Free-electron densities: ${hi[0]} $${hi[1]}\\times10^{28}$ m$^{-3}$, ${lo[0]} $${lo[1]}\\times10^{28}$ m$^{-3}$. The ratio of the $T = 0$ electron degeneracy pressure of ${hi[0]} to that of ${lo[0]} is ______ (two decimal places).`,
          answer: round(x, 2), tol: round(Math.max(0.01, x * 0.01), 2), a: hi[1], b: lo[1],
          sol: `$P = \\tfrac25nE_F\\propto n\\cdot n^{2/3} = n^{5/3}$. Ratio $= (${hi[1]}/${lo[1]})^{5/3} = ${round(x, 2)}$.`,
          trap: 'The pressure carries one power of $n$ besides the $n^{2/3}$ in $E_F$.' };
      },
      verify: (p) => (p.a / p.b) ** (5 / 3) },
    { id: 'fgas-r4g3', type: 'nat', level: 2, exams: A, sub: 'free electron model',
      make(r) {
        const m = choose(r, [['Lithium', 4.74, 4.70], ['Sodium', 3.24, 2.65], ['Potassium', 2.12, 1.40], ['Copper', 7.00, 8.47], ['Silver', 5.49, 5.86], ['Magnesium', 7.08, 4.30], ['Zinc', 9.47, 6.55], ['Calcium', 4.69, 2.30], ['Aluminium', 11.7, 6.02], ['Lead', 9.47, 3.30]]);
        const x = nFromEF(m[1]) / (m[2] * 1e28);
        return { q: `${m[0]} has a Fermi energy of $${m[1]}$ eV and $${m[2]}\\times10^{28}$ atoms per m$^3$. In the free-electron model, the number of conduction electrons per atom is ______ (one decimal place).`,
          answer: round(x, 1), tol: 0.15, E: m[1], na: m[2],
          sol: `$n = (2mE_F)^{3/2}/(3\\pi^2\\hbar^3) = ${round(nFromEF(m[1]) / 1e28, 2)}\\times10^{28}$ m$^{-3}$. Divided by the atom density: $${round(x, 2)}$, close to the valence.`,
          trap: 'Spin gives two electrons per $k$ point: the factor is $3\\pi^2$, not $6\\pi^2$.' };
      },
      verify: (p) => nFromEF(p.E) / (p.na * 1e28) },
  ],
};
