// Round 5 extras for vibrational-spectra: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;

const KT = 0.6950348; // k/hc in cm^-1 per K

export default {
  items: [
    { id: 'vibs-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'normal modes',
      q: R`Formaldehyde, H$_2$CO, is a planar (non-linear) molecule of four atoms. Its number of vibrational normal modes is ______.`,
      answer: 6, tol: 0, calc: () => 3 * 4 - 6,
      sol: R`$N$ atoms have $3N = 12$ degrees of freedom. Take away 3 translations and 3 rotations (a non-linear molecule rotates about three axes): $12 - 6 = 6$ modes. Being planar does not make it linear.`,
      trap: R`$3N - 5$ is only for linear molecules.` },
    { id: 'vibs-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'anharmonicity',
      q: R`For an anharmonic diatomic with $G(v) = \tilde\omega_e(v + \tfrac12) - \tilde\omega_ex_e(v + \tfrac12)^2$, the hot band $v = 1\to2$ appears`,
      options: [R`at the same wavenumber as the fundamental`, R`$2\tilde\omega_ex_e$ below the fundamental`, R`$2\tilde\omega_ex_e$ above the fundamental`, R`at twice the fundamental wavenumber`], answer: 1,
      sol: R`$G(v + 1) - G(v) = \tilde\omega_e - 2\tilde\omega_ex_e(v + 1)$. Fundamental ($v = 0$): $\tilde\omega_e - 2\tilde\omega_ex_e$. Hot band ($v = 1$): $\tilde\omega_e - 4\tilde\omega_ex_e$, lower by $2\tilde\omega_ex_e$. It grows with temperature because it starts from the thermally populated $v = 1$.`,
      trap: R`Twice the fundamental (roughly) is the overtone $0\to2$, a different line.` },
    { id: 'vibs-r5-03', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'anharmonicity', unit: 'cm⁻¹',
      q: R`A diatomic shows its fundamental at $1876$ cm$^{-1}$ and its first overtone ($v = 0\to2$) at $3724$ cm$^{-1}$. With $G(v) = \tilde\omega_e(v + \tfrac12) - \tilde\omega_ex_e(v + \tfrac12)^2$, the harmonic wavenumber $\tilde\omega_e$ is ______ cm$^{-1}$.`,
      answer: 1904, tol: 1, calc: () => 1876 + (2 * 1876 - 3724),
      sol: R`Fundamental $= \tilde\omega_e - 2\tilde\omega_ex_e = 1876$; overtone $= 2\tilde\omega_e - 6\tilde\omega_ex_e = 3724$. Twice the first minus the second: $2\tilde\omega_ex_e = 3752 - 3724 = 28$, so $\tilde\omega_ex_e = 14$ cm$^{-1}$ and $\tilde\omega_e = 1876 + 28 = 1904$ cm$^{-1}$.`,
      trap: R`The fundamental is not $\tilde\omega_e$: it is lowered by $2\tilde\omega_ex_e$.` },
    { id: 'vibs-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Morse potential', unit: 'cm⁻¹',
      q: R`A diatomic has its fundamental at $1876$ cm$^{-1}$ and its first overtone at $3724$ cm$^{-1}$. Its Morse well depth $D_e = \tilde\omega_e^2/(4\tilde\omega_ex_e)$ is ______ cm$^{-1}$ (to the nearest 10).`,
      answer: 64736, tol: 300, calc: () => 1904 ** 2 / (4 * 14),
      sol: R`Step 1: $2\tilde\omega_ex_e = 2\times1876 - 3724 = 28$, so $\tilde\omega_ex_e = 14$ cm$^{-1}$ and $\tilde\omega_e = 1904$ cm$^{-1}$. Step 2: $D_e = 1904^2/56 = 3\,625\,216/56 = 64\,736$ cm$^{-1}$ (about 8.0 eV). Real bonds usually have smaller well depths than this Morse estimate, because the true potential flattens faster at large $r$.`,
      trap: R`Using the fundamental (1876) in place of $\tilde\omega_e$ gives $62\,840$ cm$^{-1}$.` },
    { id: 'vibs-r5-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'normal modes', format: 'statements',
      q: R`Which statements about the vibrations of the water molecule are correct?`,
      options: [R`It has three normal modes`, R`All three are infrared active`, R`The bending mode has the lowest wavenumber`,
        R`The symmetric stretch is infrared inactive because it keeps the molecule symmetric`], answer: [0, 1, 2],
      sol: R`$3N - 6 = 3$. In a bent molecule each mode changes the dipole: the symmetric stretch and the bend change its size along the symmetry axis, the antisymmetric stretch tilts it. So all three are IR active (about 3657, 1595 and 3756 cm$^{-1}$; the bend is lowest). Keeping the symmetry does not mean keeping the dipole constant: that is only true when the equilibrium dipole is zero by symmetry, as in CO$_2$.`,
      trap: R`Transferring CO$_2$'s inactive symmetric stretch to bent H$_2$O.` },
    { id: 'vibs-r5-06', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'force constants', unit: 'N/m',
      q: R`$^1$H$^{79}$Br has $\tilde\omega_e = 2649$ cm$^{-1}$ and reduced mass $0.9953$ u. Its bond force constant $k = \mu(2\pi c\tilde\omega_e)^2$ is ______ N/m (to the nearest whole number; $c = 2.998\times10^{10}$ cm/s, $1$ u $= 1.6605\times10^{-27}$ kg).`,
      answer: 412, tol: 3, calc: () => 0.9953 * 1.6605e-27 * (2 * Math.PI * 2.998e10 * 2649) ** 2,
      sol: R`$2\pi c\tilde\omega_e = 6.2832\times2.998\times10^{10}\times2649 = 4.990\times10^{14}$ rad/s. $\mu = 1.6527\times10^{-27}$ kg. $k = 1.6527\times10^{-27}\times(4.990\times10^{14})^2 = 412$ N/m, a typical single bond.`,
      trap: R`Forgetting the $2\pi$ gives a value 39 times too small.` },
    { id: 'vibs-r5-07', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'populations',
      q: R`I$_2$ has $\tilde\omega = 214.5$ cm$^{-1}$. At $300$ K ($kT/hc = 208.5$ cm$^{-1}$), the ratio of molecules in $v = 1$ to those in $v = 0$ is closest to`,
      options: [R`$0.97$`, R`$0.50$`, R`$\approx0$ (all in $v = 0$)`, R`$0.36$`], answer: 3,
      sol: R`Vibrational levels are not degenerate, so $N_1/N_0 = e^{-\tilde\omega/(kT/hc)} = e^{-214.5/208.5} = e^{-1.029} = 0.36$. Heavy molecules with soft bonds have many excited molecules at room temperature, so their hot bands are strong; for HCl ($2886$ cm$^{-1}$) the ratio is $10^{-6}$.`,
      trap: R`$kT$ close to $hc\tilde\omega$ does not mean half the molecules are excited: the ratio is about $e^{-1}$, not $0.5$.` },
    { id: 'vibs-r5-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration-rotation', unit: 'cm⁻¹',
      q: R`In a vibration-rotation band of a diatomic, the lines $R(0)$ and $P(1)$ are found at $2906.2$ and $2865.1$ cm$^{-1}$, with no line between them. Taking the same $B$ in both vibrational levels, $B = $ ______ cm$^{-1}$ (two decimal places).`,
      answer: 10.28, tol: 0.03, calc: () => (2906.2 - 2865.1) / 4,
      sol: R`$R(0) = \tilde\nu_0 + 2B$ and $P(1) = \tilde\nu_0 - 2B$, so their gap is $4B = 41.1$ cm$^{-1}$ and $B = 10.28$ cm$^{-1}$. The band origin $\tilde\nu_0 = 2885.65$ cm$^{-1}$ sits in the gap, where no line appears because $\Delta J = 0$ is forbidden for a $^1\Sigma$ molecule.`,
      trap: R`Ordinary lines in a branch are $2B$ apart; the central gap is twice that.` },
    { id: 'vibs-r5-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'isotope effects', unit: 'cm⁻¹',
      q: R`H$_2$ has $\tilde\omega_e = 4401.2$ cm$^{-1}$ and $\tilde\omega_ex_e = 121.3$ cm$^{-1}$. Taking $\mu(\text{D}_2) = 2\mu(\text{H}_2)$ and the same potential, the fundamental $v = 0\to1$ wavenumber of D$_2$ is ______ cm$^{-1}$ (to the nearest whole number).`,
      answer: 2991, tol: 2, calc: () => 4401.2 / Math.SQRT2 - 2 * 121.3 / 2,
      sol: R`Same potential: $\tilde\omega_e\propto\mu^{-1/2}$ and $\tilde\omega_ex_e\propto\mu^{-1}$ (because $D_e = \tilde\omega_e^2/4\tilde\omega_ex_e$ stays fixed). D$_2$: $\tilde\omega_e = 4401.2/\sqrt2 = 3112.1$, $\tilde\omega_ex_e = 60.65$. Fundamental $= 3112.1 - 2\times60.65 = 2990.8\approx2991$ cm$^{-1}$ (measured: 2994).`,
      trap: R`Dividing the H$_2$ fundamental (4158.6) by $\sqrt2$ gives 2940.6; the anharmonic part scales differently.` },
    { id: 'vibs-r5-10', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'units',
      q: R`The CO fundamental at $2143$ cm$^{-1}$ lies at a wavelength of about`,
      options: [R`$2.14\ \mu$m`, R`$46.7\ \mu$m`, R`$4.67\ \mu$m`, R`$467$ nm`], answer: 2,
      sol: R`$\lambda = 1/\tilde\nu = 1/2143$ cm $= 4.67\times10^{-4}$ cm $= 4.67\ \mu$m, in the mid-infrared, where vibrational fundamentals live (roughly 2.5 to 25 $\mu$m).`,
      trap: R`$1$ cm $= 10^4\ \mu$m; slipping a power of ten gives $46.7\ \mu$m.` },
  ],
  gens: [
    { id: 'vibs-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'anharmonicity',
      make(r) {
        const we = pick(r, 500, 4000, 10), wx = pick(r, 3, 90, 0.5), ask = choose(r, ['we', 'wx', 'De']);
        const f = we - 2 * wx, o = 2 * we - 6 * wx;
        const ans = ask === 'we' ? we : ask === 'wx' ? wx : we * we / (4 * wx);
        const what = ask === 'we' ? R`the harmonic wavenumber $\tilde\omega_e$ in cm$^{-1}$` : ask === 'wx' ? R`the anharmonicity constant $\tilde\omega_ex_e$ in cm$^{-1}$` : R`the Morse well depth $D_e = \tilde\omega_e^2/(4\tilde\omega_ex_e)$ in cm$^{-1}$`;
        const v = ask === 'De' ? Math.round(ans) : round(ans, 1);
        return { q: R`A diatomic has its fundamental at $${round(f, 1)}$ cm$^{-1}$ and its first overtone at $${round(o, 1)}$ cm$^{-1}$. Using $G(v) = \tilde\omega_e(v + \tfrac12) - \tilde\omega_ex_e(v + \tfrac12)^2$, find ${what}. Answer: ______`,
          answer: v, tol: ask === 'De' ? Math.max(5, Math.round(ans * 0.01)) : 0.2, unit: 'cm⁻¹', f: round(f, 1), o: round(o, 1), ask,
          sol: R`Fundamental $= \tilde\omega_e - 2\tilde\omega_ex_e$, overtone $= 2\tilde\omega_e - 6\tilde\omega_ex_e$. So $2\tilde\omega_ex_e = 2(${round(f, 1)}) - ${round(o, 1)}$, giving $\tilde\omega_ex_e = ${wx}$ and $\tilde\omega_e = ${we}$ cm$^{-1}$.${ask === 'De' ? R` Then $D_e = ${we}^2/(4\times${wx}) = ${v}$ cm$^{-1}$.` : ''}`,
          trap: 'The fundamental is below the harmonic wavenumber by twice the anharmonicity constant.' };
      },
      verify: (p) => { const wx = (2 * p.f - p.o) / 2, we = p.f + 2 * wx; return p.ask === 'we' ? we : p.ask === 'wx' ? wx : we * we / (4 * wx); } },
    { id: 'vibs-r5g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'populations',
      make(r) {
        const [name, w] = choose(r, [['I$_2$', 214.5], ['Br$_2$', 325.3], ['Cl$_2$', 559.7], ['F$_2$', 916.6], ['O$_2$', 1580.2], ['Na$_2$', 159.1], ['Cs$_2$', 42.0]]);
        const T = choose(r, [150, 300, 500, 800, 1200, 2000]);
        const x = Math.exp(-w / (KT * T)), v = +x.toPrecision(3);
        return { q: R`${name} vibrates at $\tilde\omega = ${w}$ cm$^{-1}$. In a gas at $${T}$ K, treating the vibration as harmonic, the ratio $N_{v=1}/N_{v=0}$ is ______ (three significant figures; $k/hc = 0.695$ cm$^{-1}$/K).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), w, T,
          sol: R`$kT/hc = ${round(KT * T, 1)}$ cm$^{-1}$. Levels are non-degenerate and $\tilde\omega$ apart, so $N_1/N_0 = e^{-${w}/${round(KT * T, 1)}} = ${v}$.`,
          trap: 'Vibrational levels of a diatomic have no 2J+1 type degeneracy factor.' };
      },
      verify: (p) => Math.exp(-p.w / (KT * p.T)) },
    { id: 'vibs-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isotope effects',
      make(r) {
        const [a, b, we, wx, m1, m2] = choose(r, [['$^1$H$^{35}$Cl', '$^2$D$^{35}$Cl', 2990.9, 52.82, 0.97959, 1.90441], ['$^{12}$C$^{16}$O', '$^{13}$C$^{16}$O', 2169.8, 13.29, 6.85621, 7.17246], ['$^1$H$^{19}$F', '$^2$D$^{19}$F', 4138.3, 89.88, 0.95705, 1.82106], ['$^{14}$N$_2$', '$^{15}$N$_2$', 2358.6, 14.32, 7.00154, 7.50005]]);
        const p = m1 / m2, ans = we * Math.sqrt(p) - 2 * wx * p, v = round(ans, 1);
        return { q: R`${a} has $\tilde\omega_e = ${we}$ cm$^{-1}$, $\tilde\omega_ex_e = ${wx}$ cm$^{-1}$ and reduced mass $${m1}$ u. For ${b} (reduced mass $${m2}$ u, same potential) the fundamental $v = 0\to1$ wavenumber is ______ cm$^{-1}$ (one decimal place).`,
          answer: v, tol: 0.5, unit: 'cm⁻¹', we, wx, p,
          sol: R`With $\rho = \mu/\mu' = ${round(p, 5)}$: $\tilde\omega_e' = \tilde\omega_e\sqrt\rho = ${round(we * Math.sqrt(p), 1)}$ and $\tilde\omega_ex_e' = \tilde\omega_ex_e\rho = ${round(wx * p, 2)}$ cm$^{-1}$. Fundamental $= \tilde\omega_e' - 2\tilde\omega_ex_e' = ${v}$ cm$^{-1}$.`,
          trap: 'The anharmonicity constant scales as 1/mu, not 1/sqrt(mu).' };
      },
      verify: (p) => p.we * Math.sqrt(p.p) - 2 * p.wx * p.p },
  ],
};
