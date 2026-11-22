// Round 4 extras for matter-waves: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'], JGN = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'mw-r4-01', type: 'mcq', level: 1, exams: J, sub: 'de broglie',
      q: R`An electron and a proton move at the same (non-relativistic) speed. The ratio $\lambda_e/\lambda_p$ of their de Broglie wavelengths is about`,
      options: [R`$1$`, R`$1/1836$`, R`$43$`, R`$1836$`], answer: 3,
      sol: R`$\lambda = h/mv$. At equal speed, $\lambda\propto1/m$, so $\lambda_e/\lambda_p = m_p/m_e = 1836$. The lighter electron has the far longer wavelength.`,
      trap: R`$43 = \sqrt{1836}$ is the ratio at equal kinetic energy, not equal speed.` },
    { id: 'mw-r4-02', type: 'mcq', level: 2, exams: J, sub: 'accelerated electrons', format: 'graph',
      q: R`For electrons accelerated from rest through a voltage $V$ (non-relativistic), a graph of de Broglie wavelength $\lambda$ against $1/\sqrt V$ is a straight line through the origin. With $h = 6.626\times10^{-34}$ J s, $m_e = 9.109\times10^{-31}$ kg and $e = 1.602\times10^{-19}$ C, its slope is about`,
      options: [R`$1.50$ nm V$^{1/2}$`, R`$1.23$ nm V$^{1/2}$`, R`$0.0388$ nm V$^{1/2}$`, R`$12.3$ nm V$^{1/2}$`], answer: 1,
      sol: R`$eV = p^2/2m_e$ gives $\lambda = h/\sqrt{2m_eeV}$, so the slope is $h/\sqrt{2m_ee} = 6.626\times10^{-34}/\sqrt{2\times9.109\times10^{-31}\times1.602\times10^{-19}} = 6.626\times10^{-34}/5.402\times10^{-25} = 1.23\times10^{-9}$ m V$^{1/2}$. This is the handy rule $\lambda = 1.23/\sqrt V$ nm.`,
      trap: R`$1.50$ is $h^2/2m_ee$ in eV nm$^2$, the constant in $K = 1.50/\lambda^2$, not the slope of this graph.` },
    { id: 'mw-r4-03', type: 'nat', level: 2, exams: J, sub: 'de broglie', unit: 'pm',
      q: R`A buckminsterfullerene molecule C$_{60}$ (mass $720$ u, with $1$ u $= 1.661\times10^{-27}$ kg) moves at $200$ m/s in a molecular-beam interference experiment. With $h = 6.626\times10^{-34}$ J s, its de Broglie wavelength is ______ pm (to two decimal places).`,
      answer: 2.77, tol: 0.02, calc: () => 6.626e-34 / (720 * 1.661e-27 * 200) * 1e12,
      sol: R`$m = 720\times1.661\times10^{-27} = 1.196\times10^{-24}$ kg, $p = mv = 2.392\times10^{-22}$ kg m/s, $\lambda = h/p = 2.77\times10^{-12}$ m $= 2.77$ pm, several hundred times smaller than the molecule itself (about $1$ nm across). Interference has still been seen with such molecules, using gratings of period about $100$ nm.`,
      trap: R`Using the mass of one carbon atom (12 u) gives a wavelength 60 times too long.` },
    { id: 'mw-r4-04', type: 'nat', level: 3, exams: J, sub: 'electron diffraction', unit: 'eV',
      q: R`Electrons fall on a crystal whose lattice planes are $0.20$ nm apart. Take $h^2/2m_e = 1.504$ eV nm$^2$. The smallest kinetic energy for which the electrons can be Bragg-reflected from these planes (in any order, at any angle) is ______ eV (to two decimal places).`,
      answer: 9.4, tol: 0.05, calc: () => 1.504 / (2 * 0.2) ** 2,
      sol: R`Bragg's law $2d\sin\theta = n\lambda$ needs $\lambda\le2d\sin\theta\le2d = 0.40$ nm (first order, $\theta = 90^\circ$, straight back). The longest usable wavelength sets the smallest energy: $K = \dfrac{h^2}{2m_e\lambda^2} = \dfrac{1.504}{0.40^2} = 9.40$ eV. Slower electrons have $\lambda > 2d$ and pass through without Bragg reflection from these planes.`,
      trap: R`Taking $\lambda_{\max} = d$ instead of $2d$ makes the energy four times too large.` },
    { id: 'mw-r4-05', type: 'msq', level: 2, exams: J, sub: 'photon and electron', format: 'statements',
      q: R`A photon and an electron have the same de Broglie wavelength $0.10$ nm. Which statements are correct?`,
      options: [R`They have the same momentum.`, R`They are diffracted through the same angles by the same crystal.`, R`They have the same energy.`, R`They move at the same speed.`], answer: [0, 1],
      sol: R`$\lambda = h/p$ for both, so equal wavelengths mean equal momenta, and diffraction depends only on $\lambda$ and the crystal. The energies differ: the photon has $E = pc = 12.4$ keV, while the electron has $p^2/2m_e = 150$ eV of kinetic energy. The photon moves at $c$; the electron at about $7\times10^6$ m/s.`,
      trap: R`Same wavelength does not mean same energy: $E = pc$ for a photon but $E = p^2/2m$ for a slow electron.` },
    { id: 'mw-r4-06', type: 'nat', level: 4, exams: JG, sub: 'relativistic', unit: 'keV',
      q: R`An electron's de Broglie wavelength equals its Compton wavelength $h/m_ec$. With $m_ec^2 = 511$ keV, its kinetic energy is ______ keV (to one decimal place).`,
      answer: 211.7, tol: 0.3, calc: () => (Math.SQRT2 - 1) * 511,
      sol: R`$\lambda = h/p = h/m_ec$ means $p = m_ec$, so $pc = m_ec^2$. Total energy $E = \sqrt{(pc)^2 + (m_ec^2)^2} = \sqrt2\,m_ec^2$, and $K = (\sqrt2 - 1)m_ec^2 = 0.4142\times511 = 211.7$ keV. The non-relativistic formula would give $p^2/2m = m_ec^2/2 = 255.5$ keV, about 20% too high.`,
      trap: R`$K = p^2/2m$ is not valid when $pc$ is comparable to $m_ec^2$.` },
    { id: 'mw-r4-07', type: 'mcq', level: 3, exams: J, sub: 'thermal wavelength',
      q: R`Helium-4 atoms in a gas at $4$ K are compared with neutrons in equilibrium at $300$ K, each with mean kinetic energy $\tfrac32k_BT$. Taking the helium mass as $4m_n$, the ratio $\lambda_{\rm He}/\lambda_n$ of their de Broglie wavelengths is about`,
      options: [R`$0.23$`, R`$18.8$`, R`$4.33$`, R`$2.17$`], answer: 2,
      sol: R`$p = \sqrt{2m\cdot\tfrac32k_BT} = \sqrt{3mk_BT}$, so $\lambda\propto1/\sqrt{mT}$. Then $\dfrac{\lambda_{\rm He}}{\lambda_n} = \sqrt{\dfrac{m_nT_n}{m_{\rm He}T_{\rm He}}} = \sqrt{\dfrac{300}{4\times4}} = \sqrt{18.75} = 4.33$. The cold heavy atom still has the longer wavelength because the temperature ratio (75) beats the mass ratio (4).`,
      trap: R`$18.8$ forgets the square root.` },
    { id: 'mw-r4-08', type: 'nat', level: 5, exams: JG, sub: 'uncertainty principle', unit: 'μm',
      q: R`A beam of electrons of de Broglie wavelength $0.125$ nm passes through a circular hole of diameter $a$ and lands on a screen $L = 1.0$ m away. Take the angular half-spread from diffraction to be $\lambda/a$, so the spot diameter is $D = a + 2L\lambda/a$. The smallest possible spot diameter (choosing $a$ freely) is ______ $\mu$m (to one decimal place).`,
      answer: 31.6, tol: 0.2, calc: () => 2 * Math.sqrt(2 * 1.0 * 0.125e-9) * 1e6,
      sol: R`A large hole lets the beam through wide; a small hole spreads it by diffraction. $dD/da = 1 - 2L\lambda/a^2 = 0$ gives $a = \sqrt{2L\lambda} = \sqrt{2\times1.0\times1.25\times10^{-10}} = 15.8\ \mu$m, and then $D = 2a = 2\sqrt{2L\lambda} = 31.6\ \mu$m. This trade-off is the uncertainty principle at work: narrowing $\Delta x$ widens $\Delta p_x$.`,
      trap: R`Making the hole as small as possible does not make the spot as small as possible.` },
    { id: 'mw-r4-09', type: 'mcq', level: 4, exams: JGN, sub: 'relativistic',
      q: R`An electron and a proton both have de Broglie wavelength $1.0$ fm. With $hc = 1240$ MeV fm, $m_ec^2 = 0.511$ MeV and $m_pc^2 = 938.3$ MeV, the ratio $K_e/K_p$ of their kinetic energies is about`,
      options: [R`$1836$`, R`$1.0$`, R`$0.50$`, R`$2.0$`], answer: 3,
      sol: R`Both have $pc = hc/\lambda = 1240$ MeV. The electron is ultra-relativistic: $K_e = \sqrt{1240^2 + 0.511^2} - 0.511 \approx 1239.5$ MeV. The proton: $K_p = \sqrt{1240^2 + 938.3^2} - 938.3 = 1555.0 - 938.3 = 616.7$ MeV. Ratio $\approx2.0$. The non-relativistic $K = p^2/2m$ would wrongly give $1836$.`,
      trap: R`$m_p/m_e = 1836$ holds only when both particles are slow.` },
    { id: 'mw-r4-10', type: 'msq', level: 5, exams: JGN, sub: 'matter-wave optics', format: 'statements',
      q: R`A non-relativistic particle of total energy $E$ moves through a region where the potential energy $V(x)$ changes slowly. Its local de Broglie wavelength is $\lambda(x) = h/\sqrt{2m[E - V(x)]}$. Which statements are correct?`,
      options: [R`The frequency $E/h$ of the wave is the same everywhere along the path.`, R`The wavelength is longer where the potential energy is higher.`, R`The phase velocity of the wave is the same everywhere along the path.`, R`Adding a constant to $V$ everywhere (and to $E$) changes the frequency but leaves every wavelength unchanged.`], answer: [0, 1, 3],
      sol: R`For a stationary state the time factor $e^{-iEt/\hbar}$ is common to all $x$, so the frequency is fixed. Where $V$ is higher the kinetic energy $E - V$ is smaller, $p$ is smaller, and $\lambda$ is longer. The phase velocity $\omega/k = E/p(x)$ changes as $p$ changes, so it is not constant. Shifting the zero of potential energy shifts $E$ (so the frequency, which is not measurable on its own) but not $E - V$, so all wavelengths stay the same.`,
      trap: R`Only the frequency is fixed, not the phase velocity: like light entering glass, the wave changes speed and wavelength together.` },
  ],
  gens: [
    { id: 'mw-r4g1', type: 'nat', level: 3, exams: JG, sub: 'thermal wavelength', unit: 'nm',
      make(r) {
        const [atom, A] = choose(r, [['helium-4', 4.0026], ['sodium-23', 22.99], ['rubidium-87', 86.909], ['caesium-133', 132.905]]), T = choose(r, [0.1, 0.5, 1, 2, 5, 10, 50, 100]);
        const m = A * 1.661e-27, lam = 6.626e-34 / Math.sqrt(2 * Math.PI * m * 1.381e-23 * T * 1e-6) * 1e9;
        return { q: `In a cold-atom experiment, ${atom} atoms (mass $${A}$ u, $1$ u $= 1.661\\times10^{-27}$ kg) are held at $T = ${T}\\ \\mu$K. Their thermal de Broglie wavelength $\\lambda_T = h/\\sqrt{2\\pi mk_BT}$, with $h = 6.626\\times10^{-34}$ J s and $k_B = 1.381\\times10^{-23}$ J/K, is ______ nm (to the nearest nm).`,
          answer: Math.round(lam), tol: Math.max(1, Math.round(lam * 0.01)), A, T,
          sol: `$m = ${A}\\times1.661\\times10^{-27} = ${round(m * 1e27, 3)}\\times10^{-27}$ kg. $2\\pi mk_BT = ${round(2 * Math.PI * m * 1.381e-23 * T * 1e-6 * 1e54, 3)}\\times10^{-54}$ (SI), whose square root is $${round(Math.sqrt(2 * Math.PI * m * 1.381e-23 * T * 1e-6) * 1e27, 4)}\\times10^{-27}$ kg m/s. $\\lambda_T = h/\\text{that} = ${Math.round(lam)}$ nm. When $\\lambda_T$ grows to the spacing between atoms, the waves overlap and Bose-Einstein condensation can begin.`,
          trap: 'Temperatures in microkelvin: $T$ must be multiplied by $10^{-6}$ before use.' };
      },
      verify: (p) => 6.626e-34 / Math.sqrt(2 * Math.PI * p.A * 1.661e-27 * 1.381e-23 * p.T * 1e-6) * 1e9 },
    { id: 'mw-r4g2', type: 'nat', level: 3, exams: J, sub: 'electron diffraction',
      make(r) {
        const d = pick(r, 0.1, 0.4, 0.01), neu = choose(r, [true, false]), k = neu ? 0.818 : 1.504, Kmin = k / (4 * d * d);
        return { q: `${neu ? 'Neutrons' : 'Electrons'} fall on a crystal whose lattice planes are $${d}$ nm apart. Take $h^2/2m = ${k}$ ${neu ? 'meV' : 'eV'} nm$^2$ for the ${neu ? 'neutron' : 'electron'}. The smallest kinetic energy at which they can be Bragg-reflected by these planes is ______ ${neu ? 'meV' : 'eV'} (to two decimal places).`,
          answer: round(Kmin, 2), tol: Math.max(0.01, round(Kmin * 0.005, 2)), d, k, unit: neu ? 'meV' : 'eV',
          sol: `Bragg reflection needs $\\lambda = 2d\\sin\\theta/n\\le2d = ${round(2 * d, 2)}$ nm. So $K_{\\min} = \\dfrac{h^2}{2m(2d)^2} = \\dfrac{${k}}{${round(4 * d * d, 4)}} = ${round(Kmin, 2)}$ ${neu ? 'meV' : 'eV'}.`,
          trap: 'The longest wavelength that can be Bragg-reflected is $2d$ (straight back), not $d$.' };
      },
      verify: (p) => p.k / (4 * p.d * p.d) },
    { id: 'mw-r4g3', type: 'mcq', level: 3, exams: J, sub: 'thermal wavelength',
      make(r) {
        const P = [['neutrons', 1], ['hydrogen molecules (mass $2m_n$)', 2], ['helium-4 atoms (mass $4m_n$)', 4], ['neon-20 atoms (mass $20m_n$)', 20], ['argon-40 atoms (mass $40m_n$)', 40]];
        const i = int(r, 0, 4), j = (i + int(r, 1, 4)) % 5, T1 = choose(r, [4, 20, 77, 300]), T2 = choose(r, [4, 20, 77, 300]);
        const [n1, m1] = P[i], [n2, m2] = P[j], x = (m2 * T2) / (m1 * T1), ratio = Math.sqrt(x);
        const o = mcqOptions(r, ratio, [x, 1 / ratio, Math.sqrt(m2 / m1)], (v) => `$${v.toFixed(2)}$`);
        return { q: `${n1[0].toUpperCase() + n1.slice(1)} at $${T1}$ K are compared with ${n2} at $${T2}$ K, each gas having mean kinetic energy $\\tfrac32k_BT$ per particle. The ratio of the de Broglie wavelength of the first to that of the second is`, ...o,
          sol: `$p = \\sqrt{3mk_BT}$, so $\\lambda\\propto1/\\sqrt{mT}$ and $\\lambda_1/\\lambda_2 = \\sqrt{m_2T_2/m_1T_1} = \\sqrt{${m2 * T2}/${m1 * T1}} = ${ratio.toFixed(2)}$.`,
          trap: 'Forgetting the square root, or ignoring the temperatures.' };
      } },
  ],
};
