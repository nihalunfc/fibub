// Round 4 extras for phonons: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'ph-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'phonons',
      q: R`An optical phonon has frequency $\nu = 10$ THz. With $h = 4.136\times10^{-15}$ eV s, its energy is about`,
      options: [R`$6.6$ meV`, R`$4.1$ meV`, R`$41$ meV`, R`$414$ meV`], answer: 2,
      sol: R`$E = h\nu = 4.136\times10^{-15}\times10^{13} = 4.14\times10^{-2}$ eV $= 41$ meV, comparable to $k_BT$ at about $480$ K. A handy rule: $1$ THz $\approx4.1$ meV.`,
      trap: R`$6.6$ meV is $\hbar\nu$; with a frequency in hertz the energy is $h\nu$ (or $\hbar\omega$).` },
    { id: 'ph-r4-02', type: 'nat', level: 2, exams: G, sub: 'isotope effect', unit: 'cm⁻¹',
      q: R`The Raman-active optical phonon of natural silicon (take all atoms as $^{28}$Si) is at $520$ cm$^{-1}$. In a crystal made entirely of $^{30}$Si, with the same spring constants, it is at ______ cm$^{-1}$ (to one decimal place).`,
      answer: 502.4, tol: 0.3, calc: () => 520 * Math.sqrt(28 / 30),
      sol: R`The interatomic forces come from the electrons and do not depend on the nuclear mass, so every phonon frequency scales as $1/\sqrt m$. $\omega' = 520\sqrt{28/30} = 520\times0.9661 = 502.4$ cm$^{-1}$. Isotope shifts like this are used to check which atoms take part in a vibration.`,
      trap: R`Frequencies scale as $m^{-1/2}$, not $m^{-1}$: the shift is about $3.4\%$, not $6.7\%$.` },
    { id: 'ph-r4-03', type: 'nat', level: 3, exams: G, sub: 'Debye model', unit: 'K',
      q: R`A monatomic crystal has $n = 8.5\times10^{28}$ atoms per m$^3$ and an average sound speed of $3000$ m/s. In the Debye model, $k_D = (6\pi^2n)^{1/3}$ and $\theta_D = \hbar vk_D/k_B$. With $\hbar = 1.055\times10^{-34}$ J s and $k_B = 1.381\times10^{-23}$ J/K, $\theta_D$ is ______ K (to the nearest kelvin).`,
      answer: 393, tol: 2, calc: () => 1.055e-34 * 3000 * Math.cbrt(6 * Math.PI ** 2 * 8.5e28) / 1.381e-23,
      sol: R`$6\pi^2n = 59.22\times8.5\times10^{28} = 5.03\times10^{30}$ m$^{-3}$, so $k_D = 1.714\times10^{10}$ m$^{-1}$. $\theta_D = \dfrac{1.055\times10^{-34}\times3000\times1.714\times10^{10}}{1.381\times10^{-23}} = 393$ K. The Debye sphere holds exactly $N$ wave vectors, one per atom, for each of the three polarisations.`,
      trap: R`Using $k_D = \pi/a$ (the zone edge of a simple cubic lattice) instead of the Debye sphere radius gives a different, smaller answer.` },
    { id: 'ph-r4-04', type: 'msq', level: 3, exams: JG, sub: 'Debye model', format: 'statements',
      q: R`Which statements about the Debye model of lattice vibrations are correct?`,
      options: [R`At low temperature the lattice heat capacity varies as $T^3$.`, R`At high temperature it approaches $3Nk_B$ (Dulong-Petit).`, R`The cut-off frequency is chosen so that the total number of modes is $3N$.`, R`It describes optical phonon branches accurately, since they too have $\omega = vk$.`], answer: [0, 1, 2],
      sol: R`The Debye model replaces the true dispersion by $\omega = vk$ up to a cut-off $\omega_D$ fixed by counting $3N$ modes. At low $T$ only long-wavelength acoustic phonons (where $\omega = vk$ is right) are excited, giving $C\propto T^3$; at high $T$ every mode holds $k_B$, giving $3Nk_B$. Optical branches are nearly flat ($\omega\approx$ constant), which an Einstein term describes much better.`,
      trap: R`$\omega = vk$ fits acoustic phonons near $k = 0$; optical phonons have a finite frequency there.` },
    { id: 'ph-r4-05', type: 'nat', level: 4, exams: G, sub: '2D lattice', unit: '×10¹³ rad/s',
      q: R`Atoms of mass $m = 4.0\times10^{-26}$ kg sit on a square lattice of side $a$ and move perpendicular to the plane, each joined to its four nearest neighbours by springs of $K = 10$ N/m, so $\omega^2 = \dfrac{2K}m(2 - \cos k_xa - \cos k_ya)$. The frequency at the zone corner $k_x = k_y = \pi/a$ is ______ $\times10^{13}$ rad/s (to two decimal places).`,
      answer: 4.47, tol: 0.02, calc: () => Math.sqrt(8 * 10 / 4e-26) / 1e13,
      sol: R`At the corner $\cos k_xa = \cos k_ya = -1$, so $\omega^2 = \dfrac{2K}m\times4 = \dfrac{8K}m = \dfrac{80}{4.0\times10^{-26}} = 2.0\times10^{27}$ s$^{-2}$ and $\omega = 4.47\times10^{13}$ rad/s. At the edge centre ($k_x = \pi/a$, $k_y = 0$) it is $\sqrt{4K/m}$, $\sqrt2$ times lower: in the corner mode every atom moves opposite to all four neighbours.`,
      trap: R`$\sqrt{4K/m}$ is the 1D chain's maximum, reached at the edge centre, not at the corner.` },
    { id: 'ph-r4-06', type: 'mcq', level: 3, exams: G, sub: 'anharmonicity',
      q: R`A phonon mode has Grüneisen parameter $\gamma = -\dfrac{d\ln\omega}{d\ln V} = 2.0$. The crystal is compressed so that its volume falls by $1.0\%$. The mode's frequency`,
      options: [R`falls by about $2\%$`, R`rises by about $2\%$`, R`rises by about $0.5\%$`, R`does not change, since springs are harmonic`], answer: 1,
      sol: R`$\Delta\omega/\omega = -\gamma\,\Delta V/V = -2.0\times(-0.010) = +0.020$: a $2\%$ rise. Squeezing atoms together moves them up the steep side of the pair potential, stiffening the effective springs. In a purely harmonic crystal $\gamma = 0$; a nonzero $\gamma$ is anharmonicity, and it also drives thermal expansion.`,
      trap: R`The minus sign in the definition makes $\gamma$ positive for the usual case where compression raises frequencies.` },
    { id: 'ph-r4-07', type: 'mcq', level: 4, exams: G, sub: 'zero-point energy',
      q: R`A monatomic chain of $N$ atoms has $\omega(k) = \omega_m|\sin(ka/2)|$, with $\hbar\omega_m = 20$ meV. Its zero-point vibrational energy per atom (taking $N$ large) is about`,
      options: [R`$10.0$ meV`, R`$6.4$ meV`, R`$12.7$ meV`, R`$3.2$ meV`], answer: 1,
      sol: R`Each of the $N$ modes holds $\tfrac12\hbar\omega(k)$. The $k$ values are spread evenly over the zone, so the average of $|\sin(ka/2)|$ is $\dfrac2\pi\int_0^{\pi/2}\sin x\,dx = \dfrac2\pi$. Energy per atom $= \tfrac12\hbar\omega_m\times\dfrac2\pi = \dfrac{\hbar\omega_m}\pi = 6.4$ meV.`,
      trap: R`$10$ meV takes every mode at the maximum frequency; most modes are lower.` },
    { id: 'ph-r4-08', type: 'mcq', level: 4, exams: G, sub: 'optical phonons',
      q: R`A crystal has a centre of inversion. For its zone-centre optical phonons,`,
      options: [R`every mode is both Raman active and infrared active`, R`a mode that is infrared active is always Raman active too`, R`no mode can be both Raman active and infrared active`, R`no optical mode can be Raman active`], answer: 2,
      sol: R`Infrared absorption needs the mode to change the dipole moment (odd under inversion); Raman scattering needs it to change the polarisability (even under inversion). With a centre of symmetry every mode is either even or odd, so it cannot be both: the rule of mutual exclusion. Diamond's single optical mode is Raman active but infrared inactive; in zinc-blende GaAs (no inversion centre) it is both.`,
      trap: R`The rule needs an inversion centre; crystals without one can have modes active in both.` },
    { id: 'ph-r4-09', type: 'nat', level: 5, exams: G, sub: 'Lindemann melting', unit: 'K',
      q: R`In an Einstein model each atom (mass $40$ u, $1$ u $= 1.661\times10^{-27}$ kg) vibrates with $\hbar\omega = 5.0$ meV, so at high temperature the mean-square displacement along one axis is $\langle x^2\rangle = k_BT/m\omega^2$. Lindemann's rule says the crystal melts when $\sqrt{\langle x^2\rangle}$ reaches $0.10a$, with $a = 3.0$ Å. With $\hbar = 6.582\times10^{-16}$ eV s and $k_B = 1.381\times10^{-23}$ J/K, the predicted melting point is ______ K (to the nearest kelvin).`,
      answer: 250, tol: 2, calc: () => 0.01 * (3e-10) ** 2 * 40 * 1.661e-27 * (5e-3 / 6.582e-16) ** 2 / 1.381e-23,
      sol: R`$\omega = 5.0\times10^{-3}/6.582\times10^{-16} = 7.60\times10^{12}$ s$^{-1}$, $m = 6.64\times10^{-26}$ kg, so $m\omega^2 = 3.83$ N/m. Melting needs $k_BT = m\omega^2(0.10a)^2 = 3.83\times(3.0\times10^{-11})^2 = 3.45\times10^{-21}$ J, so $T = 3.45\times10^{-21}/1.381\times10^{-23} = 250$ K. Stiffer or heavier lattices (larger $m\omega^2$) melt higher.`,
      trap: R`Squaring the Lindemann fraction: $(0.10a)^2 = 0.010a^2$, not $0.10a^2$.` },
    { id: 'ph-r4-10', type: 'msq', level: 2, exams: JG, sub: 'monatomic chain', format: 'statements',
      q: R`A monatomic chain (mass $m$, spring constant $K$) is stretched so that its spacing $a$ doubles, with $m$ and $K$ unchanged. Which statements are correct?`,
      options: [R`The highest frequency $2\sqrt{K/m}$ is unchanged.`, R`The speed of long-wavelength sound doubles.`, R`The first Brillouin zone becomes half as wide.`, R`The number of vibrational modes per atom changes.`], answer: [0, 1, 2],
      sol: R`$\omega = 2\sqrt{K/m}|\sin(ka/2)|$: the maximum does not involve $a$. Sound speed $v = a\sqrt{K/m}$ is proportional to $a$. The zone width $2\pi/a$ halves. There is still one mode per atom in 1D: fewer $k$ per unit length of zone, but the zone is narrower in proportion.`,
      trap: R`The maximum frequency depends on masses and springs only; the spacing sets the $k$ scale.` },
  ],
  gens: [
    { id: 'ph-r4g1', type: 'nat', level: 3, exams: G, sub: 'Debye model', unit: 'K',
      make(r) {
        const n = pick(r, 2, 18, 0.1), v = pick(r, 1500, 9000, 100), kD = Math.cbrt(6 * Math.PI ** 2 * n * 1e28), th = 1.055e-34 * v * kD / 1.381e-23;
        return { q: `A monatomic solid has $${n}\\times10^{28}$ atoms per m$^3$ and an average sound speed of $${v}$ m/s. Using the Debye model ($k_D = (6\\pi^2n)^{1/3}$, $\\theta_D = \\hbar vk_D/k_B$, $\\hbar = 1.055\\times10^{-34}$ J s, $k_B = 1.381\\times10^{-23}$ J/K), the Debye temperature is ______ K (to the nearest kelvin).`,
          answer: Math.round(th), tol: Math.max(1, Math.round(th * 0.005)), n, v,
          sol: `$k_D = (6\\pi^2\\times${n}\\times10^{28})^{1/3} = ${round(kD / 1e10, 4)}\\times10^{10}$ m$^{-1}$. $\\theta_D = \\dfrac{1.055\\times10^{-34}\\times${v}\\times${round(kD / 1e10, 4)}\\times10^{10}}{1.381\\times10^{-23}} = ${Math.round(th)}$ K.`,
          trap: 'The Debye wave vector comes from $6\\pi^2n$, not $3\\pi^2n$ (that one is the free-electron $k_F$ with spin).' };
      },
      verify: (p) => 1.055e-34 * p.v * Math.cbrt(6 * Math.PI ** 2 * p.n * 1e28) / 1.381e-23 },
    { id: 'ph-r4g2', type: 'nat', level: 5, exams: G, sub: 'Lindemann melting', unit: 'K',
      make(r) {
        const A = choose(r, [20, 27, 40, 56, 63.5, 84, 108, 197, 207]), a = pick(r, 2.5, 4, 0.1), f = choose(r, [0.08, 0.1, 0.12]);
        // pick a realistic melting point first, then the oscillator energy that gives it (rounded to 0.1 meV)
        const hw = Math.max(1, round(5 * Math.sqrt(pick(r, 300, 3000, 50) / 250 / ((f / 0.1) ** 2 * (a / 3) ** 2 * (A / 40))), 1));
        const w = hw * 1e-3 / 6.582e-16, T = (f * a * 1e-10) ** 2 * A * 1.661e-27 * w * w / 1.381e-23;
        return { q: `Model a solid as Einstein oscillators: atoms of mass $${A}$ u ($1$ u $= 1.661\\times10^{-27}$ kg) with $\\hbar\\omega = ${hw}$ meV, so at high temperature $\\langle x^2\\rangle = k_BT/m\\omega^2$ along one axis. Taking Lindemann's rule that melting occurs when $\\sqrt{\\langle x^2\\rangle} = ${f}a$ with $a = ${a}$ Å, and $\\hbar = 6.582\\times10^{-16}$ eV s, $k_B = 1.381\\times10^{-23}$ J/K, the predicted melting point is ______ K (to the nearest kelvin).`,
          answer: Math.round(T), tol: Math.max(1, Math.round(T * 0.005)), A, hw, a, f,
          sol: `$\\omega = ${round(w / 1e12, 3)}\\times10^{12}$ s$^{-1}$, $m\\omega^2 = ${round(A * 1.661e-27 * w * w, 3)}$ N/m. $T_m = m\\omega^2(${f}a)^2/k_B = ${round(A * 1.661e-27 * w * w, 3)}\\times(${round(f * a, 3)}\\times10^{-10})^2/1.381\\times10^{-23} = ${Math.round(T)}$ K.`,
          trap: 'Square the whole displacement $fa$, fraction included.' };
      },
      verify: (p) => (p.f * p.a * 1e-10) ** 2 * p.A * 1.661e-27 * (p.hw * 1e-3 / 6.582e-16) ** 2 / 1.381e-23 },
    { id: 'ph-r4g3', type: 'nat', level: 2, exams: G, sub: 'isotope effect', unit: 'cm⁻¹',
      make(r) {
        const [el, w0, m0, m1] = choose(r, [['diamond', 1332, 12, 13], ['silicon', 520, 28, 30], ['silicon', 520, 28, 29], ['germanium', 301, 70, 76], ['germanium', 301, 74, 70], ['grey tin', 200, 120, 116]]);
        const w = w0 * Math.sqrt(m0 / m1);
        return { q: `The zone-centre optical phonon of ${el} made of isotope mass ${m0} is at $${w0}$ cm$^{-1}$. For a crystal made entirely of the isotope of mass ${m1}, with the same interatomic forces, it is at ______ cm$^{-1}$ (to one decimal place).`,
          answer: round(w, 1), tol: 0.2, w0, m0, m1,
          sol: `All the atoms take part and the forces are unchanged, so $\\omega\\propto m^{-1/2}$: $\\omega = ${w0}\\sqrt{${m0}/${m1}} = ${round(w, 1)}$ cm$^{-1}$.`,
          trap: 'Frequencies go as the inverse square root of the mass, not the inverse.' };
      },
      verify: (p) => p.w0 * Math.sqrt(p.m0 / p.m1) },
  ],
};
