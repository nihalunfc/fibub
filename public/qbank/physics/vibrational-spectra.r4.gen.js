// Round 4 extras for vibrational-spectra: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const CC = 2.99792458e10, U = 1.66053906660e-27, KT300 = 208.5;
const XH = [['C', 12.0, 2850, 3100], ['N', 14.0031, 3200, 3500], ['O', 15.9949, 3200, 3700], ['Si', 27.9769, 2100, 2300], ['S', 31.9721, 2500, 2620]];
/** Discrete R-branch head: the J that maximises R(J) = nu0 + (B1 + B0)(J+1) + (B1 - B0)(J+1)^2. */
const headJ = (B0, B1) => { let best = 0, bv = -Infinity; for (let J = 0; J < 2000; J++) { const v = (B1 + B0) * (J + 1) + (B1 - B0) * (J + 1) ** 2; if (v > bv) { bv = v; best = J; } } return best; };

export default {
  items: [
    { id: 'vibs-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'units',
      q: R`An infrared absorption band of a molecule is at $2000$ cm$^{-1}$. Its wavelength is`,
      options: [R`$5\ \mu$m`, R`$50\ \mu$m`, R`$0.5\ \mu$m`, R`$20\ \mu$m`], answer: 0,
      sol: R`$\lambda = 1/\tilde\nu = 1/(2000\ \text{cm}^{-1}) = 5\times10^{-4}$ cm $= 5\ \mu$m, in the mid-infrared where most fundamental vibrations lie (roughly 2.5 to 25 $\mu$m, i.e. 4000 to 400 cm$^{-1}$).`,
      trap: R`1 cm $= 10^4\ \mu$m, so $1/2000$ cm is 5 $\mu$m, not 50.` },
    { id: 'vibs-r4-02', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'normal modes',
      q: R`Sulphur hexafluoride, SF$_6$ (octahedral, non-linear), has how many vibrational normal modes?`,
      options: [R`$21$`, R`$18$`, R`$15$`, R`$12$`], answer: 2,
      sol: R`Seven atoms give $3N = 21$ degrees of freedom. Remove 3 translations and 3 rotations (non-linear): $21 - 6 = 15$. Because of the high symmetry many are degenerate: only six distinct frequencies.`,
      trap: R`$3N - 5$ is for linear molecules; SF$_6$ is not linear.` },
    { id: 'vibs-r4-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect', unit: 'cm⁻¹',
      q: R`The $^{12}$C$^{16}$O fundamental is at $2143$ cm$^{-1}$ ($\mu = 6.8562$ u). Treating the bond as harmonic with the same force constant, the fundamental of $^{12}$C$^{18}$O ($m(^{18}\text{O}) = 17.9992$ u) is at ______ cm$^{-1}$ (nearest whole number).`,
      answer: 2091, tol: 1.5, calc: () => 2143 * Math.sqrt(6.8562 / (12 * 17.99916 / 29.99916)),
      sol: R`$\mu(^{12}\text{C}^{18}\text{O}) = \dfrac{12\times17.9992}{29.9992} = 7.1998$ u. Same $k$, so $\tilde\omega\propto1/\sqrt\mu$: $2143\times\sqrt{6.8562/7.1998} = 2143\times0.9758 = 2091$ cm$^{-1}$. Isotope shifts like this one (about 52 cm$^{-1}$) are how bands are assigned to particular atoms.`,
      trap: R`Scaling by $\mu$ instead of $\sqrt\mu$ gives 2041 cm$^{-1}$.` },
    { id: 'vibs-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'force constant', unit: 'N/m',
      q: R`The N$_2$ molecule (no infrared band) shows its vibration in the Raman spectrum at $2330$ cm$^{-1}$. With $\mu(^{14}\text{N}_2) = 7.0015$ u, the harmonic force constant is ______ N/m (nearest 10).`,
      answer: 2240, tol: 15, calc: () => 7.00154 * U * (2 * Math.PI * CC * 2330) ** 2,
      sol: R`$k = \mu\omega^2 = \mu(2\pi c\tilde\nu)^2$. $\omega = 2\pi\times2.998\times10^{10}\times2330 = 4.389\times10^{14}$ s$^{-1}$; $\omega^2 = 1.926\times10^{29}$ s$^{-2}$. $\mu = 7.0015\times1.6605\times10^{-27} = 1.1626\times10^{-26}$ kg. $k = 2240$ N/m: the triple bond is about four times stiffer than the H-Cl bond.`,
      trap: R`Forgetting the $2\pi$ (using $c\tilde\nu$ as an angular frequency) gives a value about 40 times too small.` },
    { id: 'vibs-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'IR and Raman activity',
      q: R`For which of these molecules is every vibrational fundamental both infrared active and Raman active?`,
      options: [R`CO$_2$`, R`SO$_2$`, R`N$_2$`, R`SF$_6$`], answer: 1,
      sol: R`SO$_2$ is bent (no centre of inversion). Each of its three modes changes the dipole moment and also the polarisability, so all three appear in both spectra. CO$_2$ and SF$_6$ have a centre of inversion, so by the mutual exclusion rule no mode is active in both. N$_2$'s single mode is Raman active only.`,
      trap: R`A molecule with a centre of symmetry can never have a mode active in both spectra.` },
    { id: 'vibs-r4-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anharmonicity', unit: 'cm⁻¹',
      q: R`In the Raman spectrum of hot O$_2$ the fundamental $v = 0\to1$ is at $1556.2$ cm$^{-1}$ and the hot band $v = 1\to2$ at $1532.9$ cm$^{-1}$. Using $G(v) = \tilde\omega_e(v + \tfrac12) - \tilde\omega_ex_e(v + \tfrac12)^2$, $\tilde\omega_e$ is ______ cm$^{-1}$ (one decimal place).`,
      answer: 1579.5, tol: 0.2, calc: () => 1556.2 + (1556.2 - 1532.9),
      sol: R`$\Delta G_{v+1/2} = G(v+1) - G(v) = \tilde\omega_e - 2\tilde\omega_ex_e(v + 1)$. So $0\to1$: $\tilde\omega_e - 2\tilde\omega_ex_e = 1556.2$; $1\to2$: $\tilde\omega_e - 4\tilde\omega_ex_e = 1532.9$. Subtract: $2\tilde\omega_ex_e = 23.3$, $\tilde\omega_ex_e = 11.65$ cm$^{-1}$. Then $\tilde\omega_e = 1556.2 + 23.3 = 1579.5$ cm$^{-1}$.`,
      trap: R`$\tilde\omega_e$ is not the observed fundamental: it lies above it by $2\tilde\omega_ex_e$.` },
    { id: 'vibs-r4-07', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'normal modes', format: 'statements',
      q: R`Which statements about the normal modes of polyatomic molecules are correct?`,
      options: [R`Methane (CH$_4$) has 9 normal modes`, R`Methane has only 4 distinct fundamental frequencies`,
        R`All of methane's distinct fundamentals are infrared active`, R`Ammonia (NH$_3$) has 6 normal modes with 4 distinct frequencies`], answer: [0, 1, 3],
      sol: R`CH$_4$: $3\times5 - 6 = 9$. In $T_d$ symmetry they group as $A_1 + E + 2T_2$ ($1 + 2 + 3 + 3 = 9$): four frequencies. Only the $T_2$ modes carry a dipole change, so only two of the four appear in the infrared (near 3019 and 1306 cm$^{-1}$); all four are Raman active. NH$_3$: $3\times4 - 6 = 6$, grouped as $2A_1 + 2E$: four frequencies.`,
      trap: R`Degenerate modes share one frequency, so the number of bands is smaller than the number of modes.` },
    { id: 'vibs-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'populations',
      q: R`Treat Br$_2$ as a harmonic oscillator with level spacing $323$ cm$^{-1}$. At $300$ K ($kT/hc = 208.5$ cm$^{-1}$), the fraction of all molecules that are in $v = 1$ is ______ (three decimal places).`,
      answer: 0.167, tol: 0.002, calc: () => Math.exp(-323 / KT300) * (1 - Math.exp(-323 / KT300)),
      sol: R`Let $y = e^{-323/208.5} = e^{-1.549} = 0.2124$. The partition function (from $v = 0$) is $q = 1 + y + y^2 + \dots = 1/(1 - y) = 1.270$. Fraction in $v = 1$: $y/q = y(1 - y) = 0.2124\times0.7876 = 0.167$. (In $v = 0$: $1 - y = 0.788$.)`,
      trap: R`$y = 0.212$ is $N_1/N_0$, not $N_1/N_\text{total}$; dividing by the partition function matters when $y$ is not small.` },
    { id: 'vibs-r4-09', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'harmonic oscillator', format: 'statements',
      q: R`For a strictly harmonic diatomic oscillator whose dipole moment is linear in the displacement, which statements are correct?`,
      options: [R`Only $\Delta v = \pm1$ transitions are allowed`, R`The hot band $v = 1\to2$ has exactly the same wavenumber as $v = 0\to1$`,
        R`The zero-point energy is zero`, R`The level spacing grows with $v$`], answer: [0, 1],
      sol: R`$\langle v'|x|v\rangle$ is non-zero only for $v' = v\pm1$, and with a linear dipole that gives $\Delta v = \pm1$. Levels $\hbar\omega(v + \tfrac12)$ are equally spaced, so every $\Delta v = 1$ transition has the same energy and the hot bands pile on the fundamental. The lowest level still has $\tfrac12\hbar\omega$. Real molecules are anharmonic, which shrinks the spacing with $v$ and lets overtones appear.`,
      trap: R`Equal spacing is a property of the harmonic model; shrinking spacing comes from anharmonicity.` },
    { id: 'vibs-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'morse potential', unit: 'Å⁻¹',
      q: R`A Morse potential $V = D_e[1 - e^{-a(r - r_e)}]^2$ has curvature $k = 2D_ea^2$ at $r_e$. For CO, $\tilde\omega_e = 2169.8$ cm$^{-1}$, $D_e = 11.23$ eV and $\mu = 6.8562$ u. The Morse range parameter $a$ is ______ Å$^{-1}$ (two decimal places).`,
      answer: 2.3, tol: 0.02, calc: () => 2 * Math.PI * CC * 2169.8 * Math.sqrt(6.8562 * U / (2 * 11.23 * 1.602176634e-19)) / 1e10,
      sol: R`$k = \mu\omega^2$ and $k = 2D_ea^2$, so $a = \omega\sqrt{\mu/2D_e}$. $\omega = 2\pi c\tilde\omega_e = 4.087\times10^{14}$ s$^{-1}$. $\mu = 1.1385\times10^{-26}$ kg; $2D_e = 3.598\times10^{-18}$ J; $\sqrt{\mu/2D_e} = 5.625\times10^{-5}$ s/m. $a = 2.30\times10^{10}$ m$^{-1}$ $= 2.30$ Å$^{-1}$.`,
      trap: R`Expanding $[1 - e^{-ax}]^2\approx a^2x^2$ gives $V\approx D_ea^2x^2 = \tfrac12kx^2$, so $k = 2D_ea^2$, not $D_ea^2$.` },
    { id: 'vibs-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'band heads',
      q: R`In the CO fundamental band, $B_0 = 1.9225$ cm$^{-1}$ and $B_1 = 1.9050$ cm$^{-1}$, with R($J$) $= \tilde\nu_0 + (B_1 + B_0)(J+1) + (B_1 - B_0)(J+1)^2$ and P($J$) $= \tilde\nu_0 - (B_1 + B_0)J + (B_1 - B_0)J^2$. A band head (lines turning back) forms`,
      options: [R`in the P branch, near $J\approx108$`, R`in the R branch, near $J\approx55$`, R`nowhere, because $B_1 < B_0$`, R`in the R branch, near $J\approx108$`], answer: 3,
      sol: R`With $B_1 < B_0$ the quadratic term is negative. In the R branch it opposes the linear rise, so the lines bunch and turn back where $\dfrac{d}{dJ}$R $= 0$: $J + 1 = \dfrac{B_1 + B_0}{2(B_0 - B_1)} = \dfrac{3.8275}{0.035} = 109.4$, i.e. $J\approx108$. In the P branch both terms push the lines down, so they spread out and never turn. (Such a high $J$ is barely populated at room temperature, so the head is seen only in hot sources such as flames and stars.)`,
      trap: R`Forgetting the factor 2 in the derivative gives $J\approx218$; picking the P branch reverses the sign argument.` },
    { id: 'vibs-r4-12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'isotope effect',
      q: R`The C-H stretch of chloroform (CHCl$_3$) is at $3020$ cm$^{-1}$. Treating it as a C-H oscillator with reduced mass from C and H only (the rest of the molecule held fixed), the C-D stretch of CDCl$_3$ is expected near`,
      options: [R`$1510$ cm$^{-1}$`, R`$2135$ cm$^{-1}$`, R`$2220$ cm$^{-1}$`, R`$2615$ cm$^{-1}$`], answer: 2,
      sol: R`$\mu_\text{CH} = \dfrac{12\times1.008}{13.008} = 0.930$ u, $\mu_\text{CD} = \dfrac{12\times2.014}{14.014} = 1.725$ u. $\tilde\nu_D = 3020\sqrt{0.930/1.725} = 3020\times0.734 = 2220$ cm$^{-1}$ (observed about 2250 cm$^{-1}$). Deuteration is a standard way to identify bands that involve H atoms.`,
      trap: R`$3020/\sqrt2 = 2135$ uses masses 1 and 2 alone; the carbon also moves, so the ratio is $\sqrt{\mu_H/\mu_D}$, a little larger than $1/\sqrt2$.` },
  ],
  gens: [
    { id: 'vibs-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect',
      make(r) {
        const [X, m, lo, hi] = choose(r, XH);
        const nH = pick(r, lo, hi, 1);
        const muH = m * 1.00783 / (m + 1.00783), muD = m * 2.01410 / (m + 2.01410);
        const nD = nH * Math.sqrt(muH / muD);
        return { q: R`An ${X}-H stretching band is at $${nH}$ cm$^{-1}$. Treating it as an isolated ${X}-H oscillator (masses: ${X} $${m}$ u, H $1.00783$ u, D $2.01410$ u) with the same force constant, the ${X}-D stretch is expected at ______ cm$^{-1}$ (nearest whole number).`,
          answer: Math.round(nD), tol: Math.max(2, Math.round(nD * 0.002)), unit: 'cm⁻¹', m, nH,
          sol: R`$\mu_H = ${round(muH, 4)}$ u, $\mu_D = ${round(muD, 4)}$ u. $\tilde\nu_D = \tilde\nu_H\sqrt{\mu_H/\mu_D} = ${nH}\times${round(Math.sqrt(muH / muD), 4)} = ${Math.round(nD)}$ cm$^{-1}$.`,
          trap: 'The ratio is slightly above 1/sqrt(2): the heavy atom moves a little too.' };
      },
      verify: (p) => { const muH = p.m * 1.00783 / (p.m + 1.00783), muD = p.m * 2.0141 / (p.m + 2.0141); return p.nH * Math.sqrt(muH / muD); } },
    { id: 'vibs-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'populations',
      make(r) {
        const [name, w] = choose(r, [['I$_2$', 214.5], ['Br$_2$', 323], ['Cl$_2$', 560], ['F$_2$', 917], ['ICl', 384], ['Na$_2$', 159]]);
        const T = choose(r, [200, 300, 500, 800, 1000, 1500]);
        const x = w / (0.6950348 * T);
        const v = 1 / (Math.exp(x) - 1);
        return { q: R`Treat ${name} as a harmonic oscillator with spacing $${w}$ cm$^{-1}$, in equilibrium at $${T}$ K ($k/hc = 0.6950$ cm$^{-1}$/K). The mean vibrational quantum number $\langle v\rangle$ is ______ (three significant figures).`,
          answer: +v.toPrecision(3), tol: +(v * 0.01).toPrecision(2), w, T,
          sol: R`$x = hc\tilde\nu/kT = ${w}/(0.6950\times${T}) = ${round(x, 4)}$. For equally spaced levels $\langle v\rangle = \sum v e^{-vx}/\sum e^{-vx} = \dfrac{1}{e^x - 1} = ${+v.toPrecision(3)}$ (the Bose-Einstein form).`,
          trap: 'Using e^{-x} gives N1/N0, not the mean quantum number; the two agree only when x is large.' };
      },
      verify: (p) => 1 / (Math.exp(p.w / (0.6950348 * p.T)) - 1) },
    { id: 'vibs-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'band heads',
      make(r) {
        const B0 = pick(r, 0.8, 12, 0.01), d = pick(r, 0.006, 0.04, 0.001) * B0;
        const B1 = round(B0 - d, 4);
        const J = headJ(B0, B1);
        return { q: R`A vibration-rotation band has $B_0 = ${B0}$ cm$^{-1}$ and $B_1 = ${B1}$ cm$^{-1}$, with R($J$) $= \tilde\nu_0 + (B_1 + B_0)(J+1) + (B_1 - B_0)(J+1)^2$. The R-branch line with the highest wavenumber (the band head) starts from lower level $J = $ ______.`,
          answer: J, tol: 0, B0, B1,
          sol: R`Treating $J$ as continuous, $d\text{R}/dJ = (B_1 + B_0) + 2(B_1 - B_0)(J+1) = 0$ gives $J + 1 = \dfrac{B_1 + B_0}{2(B_0 - B_1)} = ${round((B0 + B1) / (2 * (B0 - B1)), 2)}$. The parabola peaks there, so the largest of the whole-number lines is at $J = ${J}$ (compare R($${J - 1}$), R($${J}$), R($${J + 1}$) if in doubt).`,
          trap: 'The head forms in the R branch when B1 < B0; the factor 2 in the derivative is easy to drop.' };
      },
      verify: (p) => headJ(p.B0, p.B1) },
  ],
};
