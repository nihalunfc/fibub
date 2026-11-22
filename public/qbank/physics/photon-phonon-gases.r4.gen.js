// Round 4 extras for photon-phonon-gases: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const a = 7.566e-16; // radiation constant, J m^-3 K^-4

export default {
  items: [
    { id: 'phgas-r4-01', type: 'mcq', level: 1, exams: G, sub: 'blackbody radiation',
      q: R`Blackbody radiation in a cavity is compressed slowly to half its volume while the walls are held at a fixed temperature. Its pressure`,
      options: [R`doubles`, R`stays the same`, R`rises $2^{4/3}$ times`, R`halves`], answer: 1,
      sol: R`For radiation $P = u/3 = \tfrac13aT^4$, which depends on temperature alone. At fixed $T$ the walls simply absorb photons as the volume shrinks, keeping the photon density at its equilibrium value. Radiation behaves like a vapour in contact with its liquid, not like a gas with a fixed number of particles. ($2^{4/3}$ applies to a slow adiabatic compression, when $T$ rises.)`,
      trap: R`Boyle's law assumes a fixed number of particles; photons are created and absorbed by the walls.` },
    { id: 'phgas-r4-02', type: 'mcq', level: 2, exams: G, sub: 'cosmic background',
      q: R`The cosmic microwave background is blackbody radiation at $2.725$ K today. Light emitted when the universe was $1/1090$ of its present linear size has been stretched $1090$ times since. The temperature of the background radiation at that time was about`,
      options: [R`$2.5$ mK`, R`$2.7$ K`, R`$3.0\times10^3$ K`, R`$3.2\times10^9$ K`], answer: 2,
      sol: R`As the universe expands, every wavelength is stretched by the same factor, and a Planck spectrum stays Planckian with $T\propto1/a$ (equivalently, adiabatic expansion of radiation keeps $VT^3$ constant). So $T = 2.725\times1090\approx2970$ K, about $3000$ K: hot enough, just, to keep hydrogen ionised, which is why the background was released at that time.`,
      trap: R`$3.2\times10^9$ K uses $T\propto a^{-3}$, mixing up temperature with number density.` },
    { id: 'phgas-r4-03', type: 'nat', level: 2, exams: G, sub: 'blackbody thermodynamics',
      q: R`A cavity at a fixed $2000$ K is enlarged by $1.0$ L. The heat the walls must supply to the radiation is ______ $\mu$J ($a = 7.566\times10^{-16}$ J m$^{-3}$ K$^{-4}$).`,
      answer: 16.1, tol: 0.2, calc: () => 4 / 3 * 7.566e-16 * 2000 ** 4 * 1e-3 * 1e6,
      sol: R`The entropy of the radiation is $S = \tfrac43aVT^3$, so at fixed $T$, $Q = T\Delta S = \tfrac43aT^4\Delta V$. With $aT^4 = 7.566\times10^{-16}\times1.6\times10^{13} = 1.21\times10^{-2}$ J/m$^3$: $Q = \tfrac43\times1.21\times10^{-2}\times10^{-3} = 1.61\times10^{-5}$ J. Of this, $u\Delta V$ fills the new volume with radiation and $P\Delta V = \tfrac13u\Delta V$ is the work done on the moving wall.`,
      trap: R`Supplying only $u\Delta V$ ($12.1\ \mu$J) forgets the work the radiation does as it pushes the wall.` },
    { id: 'phgas-r4-04', type: 'mcq', level: 3, exams: G, sub: 'blackbody thermodynamics',
      q: R`For isotropic radiation, $P = u/3$ and the equivalent mass density is $\rho = u/c^2$. The speed of small pressure waves in a radiation-dominated gas (such as the early universe), $\sqrt{dP/d\rho}$, is`,
      options: [R`$c$`, R`$c/3$`, R`$c\sqrt{2/3}$`, R`$c/\sqrt3$`], answer: 3,
      sol: R`$dP/d\rho = \dfrac{du/3}{du/c^2} = c^2/3$, so the sound speed is $c/\sqrt3\approx0.58c$. This speed sets the size of the sound waves in the early universe whose imprint is seen in the cosmic microwave background and in galaxy clustering.`,
      trap: R`$c/3$ forgets the square root: it is $dP/d\rho = c^2/3$ that has the factor $1/3$.` },
    { id: 'phgas-r4-05', type: 'nat', level: 4, exams: G, sub: 'Planck spectrum',
      q: R`The number of blackbody photons per unit frequency, $n_\nu\propto\dfrac{\nu^2}{e^{h\nu/kT} - 1}$, peaks at $h\nu = xkT$ with $x$ = ______ (three decimal places).`,
      answer: 1.594, tol: 0.003, calc: () => { let x = 1.5; for (let i = 0; i < 60; i++) x = 2 * (1 - Math.exp(-x)); return x; },
      sol: R`Differentiate $x^2/(e^x - 1)$: the peak needs $2x(e^x - 1) = x^2e^x$, i.e. $x = 2(1 - e^{-x})$. Iterating from $x = 1.5$: $1.554$, $1.577$, ... converging to $1.594$. This is lower than the peak of the energy spectrum per unit frequency ($x = 2.821$), because each photon's energy weight $h\nu$ is removed.`,
      trap: R`$2.821$ is the peak of $u_\nu$ (energy), whose extra factor of $\nu$ moves the peak up.` },
    { id: 'phgas-r4-06', type: 'msq', level: 4, exams: G, sub: 'magnons', format: 'statements',
      q: R`Spin waves (magnons) in a three-dimensional ferromagnet have $\hbar\omega\propto k^2$ at small $k$ and, like phonons, zero chemical potential. Which statements about the magnon gas at low temperature are correct?`,
      options: [R`The number of thermal magnons grows as $T^{3/2}$.`, R`The magnon heat capacity grows as $T^{3/2}$.`, R`The magnetisation falls below its saturation value by an amount proportional to $T^{3/2}$.`, R`The magnon chemical potential is positive, as magnons can be counted.`], answer: [0, 1, 2],
      sol: R`With $\omega\propto k^2$, the density of states in 3D is $g(\omega)\propto\sqrt\omega$. Then $N\propto\int\dfrac{\sqrt\omega\,d\omega}{e^{\hbar\omega/kT} - 1}\propto T^{3/2}$ and $U\propto T^{5/2}$, so $C\propto T^{3/2}$. Each magnon lowers the total spin by one unit, so $M_s - M(T)\propto T^{3/2}$ (Bloch's law). Magnon number is not conserved (they are created thermally), so $\mu = 0$, as for photons and phonons.`,
      trap: R`Applying the phonon $T^3$ law: the power comes from the dispersion, and $\omega\propto k^2$ gives $3/2$.` },
    { id: 'phgas-r4-07', type: 'mcq', level: 4, exams: G, sub: 'Bose-Einstein condensation',
      q: R`An ideal Bose gas is held in a three-dimensional harmonic trap instead of a box. At the condensation temperature its heat capacity`,
      options: [R`jumps discontinuously, falling as the temperature rises through $T_c$`, R`is continuous with a cusp, as in a box`, R`diverges logarithmically`, R`vanishes`], answer: 0,
      sol: R`In a trap the density of states is $g(\varepsilon)\propto\varepsilon^2$ instead of $\sqrt\varepsilon$. Below $T_c$, $U\propto T^4$ and $C/Nk = 12\zeta(4)/\zeta(3)\approx10.8$ at $T_c$; just above, the chemical potential starts to move and $C$ drops to about $4.2Nk$. So the trapped gas has a discontinuous jump at $T_c$, whereas the gas in a box has a continuous peak with a cusp. The shape of the potential changes the order of the singularity.`,
      trap: R`The box result (a cusp) does not carry over: a stronger density of states sharpens the transition into a jump.` },
    { id: 'phgas-r4-08', type: 'nat', level: 5, exams: G, sub: 'Bose-Einstein condensation',
      q: R`$1.0\times10^4$ bosons are held in a two-dimensional isotropic harmonic trap of frequency $\omega = 2\pi\times100$ Hz. In this geometry $kT_c = \hbar\omega\sqrt{N/\zeta(2)}$ with $\zeta(2) = \pi^2/6$. The condensation temperature is ______ nK.`,
      answer: 374, tol: 4, calc: () => 1.054571817e-34 * 2 * Math.PI * 100 / 1.380649e-23 * Math.sqrt(1e4 * 6 / Math.PI ** 2) * 1e9,
      sol: R`In 2D the trap's density of states is $g(\varepsilon) = \varepsilon/(\hbar\omega)^2$, so the excited states hold at most $\displaystyle\int\frac{\varepsilon\,d\varepsilon}{(\hbar\omega)^2(e^{\varepsilon/kT} - 1)} = \zeta(2)\Big(\frac{kT}{\hbar\omega}\Big)^2$ particles. That is finite, so a 2D trap does condense (unlike a 2D box). Setting it equal to $N$: $kT_c = \hbar\omega\sqrt{6N/\pi^2} = \hbar\omega\times78.0$. $\hbar\omega/k = 1.055\times10^{-34}\times628.3/1.381\times10^{-23} = 4.80$ nK, so $T_c = 374$ nK.`,
      trap: R`Using the 3D trap formula $(N/\zeta(3))^{1/3}$ gives $T_c\approx97$ nK.` },
    { id: 'phgas-r4-09', type: 'msq', level: 3, exams: G, sub: 'blackbody radiation',
      q: R`An opaque cavity at temperature $T$ contains radiation in equilibrium with its walls. Which of these depend on the material of the walls?`,
      options: [R`The energy density of the radiation inside`, R`Its spectral distribution`, R`The time it takes to reach equilibrium after the walls are heated`, R`The radiation emitted per unit area by the wall surface itself`], answer: [2, 3],
      sol: R`Kirchhoff's argument: if the equilibrium radiation depended on the walls, connecting two cavities through a filter would let heat flow between bodies at one temperature, violating the second law. So $u(T)$ and its Planck spectrum are universal. A poorly absorbing wall emits less (its emissivity is lower) but reflects more, keeping the cavity field the same; the rates at which it absorbs and emits, and so how fast equilibrium is reached, do depend on the material.`,
      trap: R`A wall's own emission depends on its emissivity; the equilibrium field inside does not.` },
    { id: 'phgas-r4-10', type: 'nat', level: 3, exams: G, sub: 'phonon gas',
      q: R`In a crystal at $1.0$ K, treat all three acoustic branches as having the same sound speed $3000$ m/s (Debye $T^3$ regime). Using the photon result $\dfrac{\zeta(3)}{\pi^2}\Big(\dfrac{kT}{\hbar v}\Big)^3$ for the number of quanta per unit volume per polarisation, the phonon density is ______ $\times10^{22}$ m$^{-3}$ ($\zeta(3) = 1.202$).`,
      answer: 3.04, tol: 0.03, calc: () => 3 * 1.2020569 / Math.PI ** 2 * (1.380649e-23 / (1.054571817e-34 * 3000)) ** 3 / 1e22,
      sol: R`Phonons with linear dispersion at $T\ll\theta_D$ are a photon gas with $c\to v$ and three polarisations instead of two. $kT/\hbar v = 1.381\times10^{-23}/(1.055\times10^{-34}\times3000) = 4.36\times10^7$ m$^{-1}$; cubed, $8.31\times10^{22}$. Times $3\times1.202/\pi^2 = 0.365$: $3.04\times10^{22}$ m$^{-3}$, far fewer than the $\sim10^{29}$ atoms per m$^3$.`,
      trap: R`Using two polarisations, as for light, gives $2.02\times10^{22}$.` },
  ],
  gens: [
    { id: 'phgas-r4g1', type: 'nat', level: 2, exams: G, sub: 'blackbody thermodynamics',
      make(r) {
        const T = choose(r, [500, 1000, 1500, 2000, 3000, 5000]), dV = choose(r, [0.1, 0.5, 1, 2, 5]);
        const Q = 4 / 3 * a * T ** 4 * dV * 1e-3 * 1e6;
        return { q: `A cavity held at $${T}$ K is enlarged slowly by $${dV}$ L. The heat its walls supply to the radiation is ______ $\\mu$J ($a = 7.566\\times10^{-16}$ J m$^{-3}$ K$^{-4}$).`,
          answer: round(Q, 3), tol: round(Math.max(0.001, Q * 0.01), 3), T, dV,
          sol: `$S = \\tfrac43aVT^3$, so $Q = T\\Delta S = \\tfrac43aT^4\\Delta V = \\tfrac43\\times${round(a * T ** 4, 6)}\\times${dV}\\times10^{-3} = ${round(Q, 3)}\\ \\mu$J.`,
          trap: 'Besides filling the new volume ($u\\Delta V$), the radiation does work $\\tfrac13u\\Delta V$ on the wall.' };
      },
      verify: (p) => 4 / 3 * a * p.T ** 4 * p.dV * 1e-3 * 1e6 },
    { id: 'phgas-r4g2', type: 'nat', level: 2, exams: G, sub: 'cosmic background',
      make(r) {
        const back = r() < 0.5, z = choose(r, [9, 99, 499, 999, 1099, 3399]), T = choose(r, [100, 300, 1000, 3000, 6000]);
        const ans = back ? 2.725 * (1 + z) : T / 2.725 - 1;
        return { q: back
            ? `The cosmic background is at $2.725$ K today. At redshift $z = ${z}$ (when the universe was $1/${z + 1}$ of its present size), its temperature was ______ K.`
            : `The cosmic background is at $2.725$ K today. It had a temperature of $${T}$ K at redshift $z$ = ______ (one decimal place).`,
          answer: round(ans, 1), tol: round(Math.max(0.1, ans * 0.005), 1), back, z, T,
          sol: back ? `$T\\propto1/a = 1 + z$, so $T = 2.725\\times${z + 1} = ${round(ans, 1)}$ K.` : `$1 + z = T/T_0 = ${T}/2.725 = ${round(T / 2.725, 2)}$, so $z = ${round(ans, 1)}$.`,
          trap: 'The temperature scales as $1 + z$, not $z$.' };
      },
      verify: (p) => (p.back ? 2.725 * (1 + p.z) : p.T / 2.725 - 1) },
    { id: 'phgas-r4g3', type: 'nat', level: 4, exams: G, sub: 'Bose-Einstein condensation',
      make(r) {
        const N = choose(r, [1e3, 3e3, 1e4, 3e4, 1e5]), f = choose(r, [20, 50, 100, 200, 500]);
        const T = C.hbar * 2 * Math.PI * f / C.kB * Math.sqrt(N * 6 / Math.PI ** 2) * 1e9;
        const Ntex = N / 10 ** Math.floor(Math.log10(N)) === 1 ? `10^{${Math.log10(N)}}` : `${N / 10 ** Math.floor(Math.log10(N))}\\times10^{${Math.floor(Math.log10(N))}}`;
        return { q: `$${Ntex}$ bosons are held in a two-dimensional isotropic harmonic trap of frequency $2\\pi\\times${f}$ Hz, for which $kT_c = \\hbar\\omega\\sqrt{N/\\zeta(2)}$ with $\\zeta(2) = \\pi^2/6$. The condensation temperature is ______ nK.`,
          answer: round(T, 1), tol: round(T * 0.01, 1), N, f,
          sol: `$\\hbar\\omega/k = ${round(C.hbar * 2 * Math.PI * f / C.kB * 1e9, 3)}$ nK and $\\sqrt{6N/\\pi^2} = ${round(Math.sqrt(6 * N / Math.PI ** 2), 2)}$, so $T_c = ${round(T, 1)}$ nK.`,
          trap: 'The 2D trap has $g(\\varepsilon)\\propto\\varepsilon$, giving a square root of $N$, not the cube root of the 3D trap.' };
      },
      verify: (p) => C.hbar * 2 * Math.PI * p.f / C.kB * Math.sqrt(p.N * 6 / Math.PI ** 2) * 1e9 },
  ],
};
