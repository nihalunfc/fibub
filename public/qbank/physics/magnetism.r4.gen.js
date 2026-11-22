// Round 4 extras for magnetism: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];
const MU0 = 1.25664e-6, MUB = 9.274e-24, KB = 1.381e-23;

export default {
  items: [
    { id: 'mgx-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'kinds of magnetism',
      q: R`Which of these metals is ferromagnetic at room temperature?`,
      options: [R`Copper`, R`Aluminium`, R`Chromium`, R`Nickel`], answer: 3,
      sol: R`Nickel orders ferromagnetically below its Curie temperature of $627$ K. Copper is diamagnetic, aluminium weakly (Pauli) paramagnetic, and chromium is an antiferromagnet (with no net moment). Iron and cobalt are the other room-temperature ferromagnetic elements.`,
      trap: R`Chromium has ordered moments, but they alternate (antiferromagnetic), so it is not attracted strongly to a magnet.` },
    { id: 'mgx-r4-02', type: 'mcq', level: 2, exams: G, sub: 'saturation moment',
      q: R`The Er$^{3+}$ ion has ground term $^4I_{15/2}$ ($S = 3/2$, $L = 6$, $J = 15/2$), with Landé factor $g = 6/5$. The largest moment one ion can show along a strong field at low temperature (its saturation moment) is`,
      options: [R`$9.58\,\mu_B$`, R`$9.00\,\mu_B$`, R`$7.50\,\mu_B$`, R`$3.00\,\mu_B$`], answer: 1,
      sol: R`At saturation every ion sits in $M_J = J$, giving $\mu_z = gJ\mu_B = \tfrac65\times\tfrac{15}2 = 9.00\,\mu_B$. The Curie-law effective moment $g\sqrt{J(J + 1)} = 1.2\times\sqrt{63.75} = 9.58\,\mu_B$ is larger, because it measures $\langle\mu^2\rangle$, including the components that never line up.`,
      trap: R`$g\sqrt{J(J + 1)}$ enters the susceptibility; the saturation magnetisation uses $gJ$.` },
    { id: 'mgx-r4-03', type: 'nat', level: 3, exams: G, sub: 'fine particles', unit: 'K',
      q: R`Spherical single-domain particles of diameter $10$ nm have anisotropy constant $K = 1.0\times10^5$ J/m$^3$. Taking the blocking condition $KV = 25k_BT_B$ (for a measurement lasting about $100$ s) and $k_B = 1.381\times10^{-23}$ J/K, the blocking temperature $T_B$ is ______ K (to the nearest kelvin).`,
      answer: 152, tol: 1, calc: () => 1e5 * (Math.PI / 6) * (10e-9) ** 3 / (25 * 1.381e-23),
      sol: R`$V = \tfrac\pi6d^3 = 0.5236\times10^{-24} = 5.24\times10^{-25}$ m$^3$, so $KV = 5.24\times10^{-20}$ J. $T_B = KV/25k_B = 5.24\times10^{-20}/(25\times1.381\times10^{-23}) = 152$ K. Above $T_B$ the moments flip faster than the measurement and the particles behave as a superparamagnet; below it, they freeze and show hysteresis.`,
      trap: R`Using the radius in $\tfrac\pi6d^3$, or $\tfrac43\pi d^3$ with the diameter, changes $V$ by a factor of $8$.` },
    { id: 'mgx-r4-04', type: 'nat', level: 3, exams: G, sub: 'domains', unit: 'nm',
      q: R`In a ferromagnet with exchange stiffness $A = 2.1\times10^{-11}$ J/m and anisotropy constant $K = 4.8\times10^4$ J/m$^3$, the width of a Bloch wall is about $\delta = \pi\sqrt{A/K}$. It is ______ nm (to the nearest nm).`,
      answer: 66, tol: 1, calc: () => Math.PI * Math.sqrt(2.1e-11 / 4.8e4) * 1e9,
      sol: R`$A/K = 2.1\times10^{-11}/4.8\times10^4 = 4.375\times10^{-16}$ m$^2$, $\sqrt{A/K} = 20.9$ nm, $\delta = \pi\times20.9 = 66$ nm. Exchange wants the spins to turn slowly (a wide wall); anisotropy wants as few spins as possible pointing off the easy axis (a narrow wall). The balance gives a few hundred lattice spacings.`,
      trap: R`$\sqrt{AK}$ sets the wall energy per area ($4\sqrt{AK}$), not its width.` },
    { id: 'mgx-r4-05', type: 'msq', level: 2, exams: JG, sub: 'kinds of magnetism', format: 'statements',
      q: R`Which statements about magnetic susceptibilities (SI, dimensionless) are correct?`,
      options: [R`Core (Langevin) diamagnetism gives $\chi < 0$, almost independent of temperature.`, R`Pauli paramagnetism of conduction electrons gives $\chi > 0$, almost independent of temperature.`, R`Non-interacting local moments give $\chi > 0$, varying as $1/T$.`, R`A superconductor in the Meissner state has $\chi = +1$.`], answer: [0, 1, 2],
      sol: R`Core diamagnetism comes from induced orbital currents, set by the size of the electron orbits, not by temperature. Pauli paramagnetism involves only electrons within about $k_BT$ of $E_F$, a fraction that cancels the $1/T$ of each spin's alignment, leaving $\chi$ nearly constant. Free moments follow the Curie law $C/T$. A superconductor expels the field ($B = 0$), so $M = -H$ and $\chi = -1$: a perfect diamagnet.`,
      trap: R`Perfect diamagnetism is $\chi = -1$; a positive value would mean attraction.` },
    { id: 'mgx-r4-06', type: 'mcq', level: 2, exams: JG, sub: 'hysteresis',
      q: R`For the core of a mains transformer, which runs round its hysteresis loop 50 times a second, the best magnetic material has`,
      options: [R`high coercivity and high remanence`, R`low coercivity and a narrow hysteresis loop`, R`a wide loop, to store as much energy as possible`, R`zero permeability`], answer: 1,
      sol: R`Each cycle round the loop turns energy equal to the loop area into heat. A soft magnetic material (low coercivity, narrow loop, high permeability), such as silicon steel, keeps these losses small and is easy to magnetise. High coercivity and remanence (a "hard" material) suit permanent magnets instead.`,
      trap: R`Permanent magnets and transformer cores need opposite properties.` },
    { id: 'mgx-r4-07', type: 'nat', level: 4, exams: G, sub: 'Curie law',
      q: R`A paramagnetic salt has $N = 2.0\times10^{28}$ magnetic ions per m$^3$ and Curie constant $C = 0.783$ K in $\chi = C/T$ (SI). Using $C = \mu_0Np^2\mu_B^2/3k_B$ with $\mu_0 = 1.257\times10^{-6}$ T m/A, $\mu_B = 9.274\times10^{-24}$ J/T and $k_B = 1.381\times10^{-23}$ J/K, the effective moment number $p$ is ______ (to two decimal places).`,
      answer: 3.87, tol: 0.02, calc: () => Math.sqrt(3 * 1.381e-23 * 0.783 / (1.257e-6 * 2e28 * 9.274e-24 ** 2)),
      sol: R`$p^2 = \dfrac{3k_BC}{\mu_0N\mu_B^2} = \dfrac{3\times1.381\times10^{-23}\times0.783}{1.257\times10^{-6}\times2.0\times10^{28}\times8.601\times10^{-47}} = \dfrac{3.244\times10^{-23}}{2.162\times10^{-24}} = 15.0$, so $p = 3.87$. That is $2\sqrt{S(S + 1)}$ for $S = 3/2$, the spin-only value of a $3d^3$ ion such as Cr$^{3+}$.`,
      trap: R`$C$ gives $p^2$; remember the square root at the end.` },
    { id: 'mgx-r4-08', type: 'nat', level: 5, exams: G, sub: 'magnetic resonance', unit: 'GHz',
      q: R`In a uniaxial two-sublattice antiferromagnet, the zero-field resonance frequency is $\omega = \gamma\sqrt{2B_EB_A}$ (approximately, for $B_A\ll B_E$), with exchange field $B_E = 50$ T and anisotropy field $B_A = 0.50$ T. For $g = 2.00$ ($\gamma/2\pi = 27.99$ GHz/T), the resonance frequency $\omega/2\pi$ is ______ GHz (to the nearest GHz).`,
      answer: 198, tol: 1, calc: () => 27.99 * Math.sqrt(2 * 50 * 0.5),
      sol: R`$\sqrt{2B_EB_A} = \sqrt{2\times50\times0.50} = \sqrt{50} = 7.07$ T. Frequency $= 27.99\times7.07 = 198$ GHz. The exchange field enhances the resonance far above the $\gamma B_A = 14$ GHz a ferromagnet with the same anisotropy would have, which is why antiferromagnetic resonance needs millimetre or far-infrared waves.`,
      trap: R`Using $\gamma B_A$ alone forgets that exchange couples the two sublattices.` },
    { id: 'mgx-r4-09', type: 'msq', level: 4, exams: G, sub: 'Brillouin function', format: 'statements',
      q: R`The magnetisation of $N$ ions per volume with angular momentum $J$ is $M = Ng\mu_BJ\,B_J(x)$, $x = g\mu_BJB/k_BT$. Which statements are correct?`,
      options: [R`For $J = \tfrac12$, $B_J(x) = \tanh x$.`, R`As $J\to\infty$ (with $g\mu_BJ$ fixed), $B_J$ becomes the classical Langevin function.`, R`For $x\ll1$, $M$ is proportional to $B/T$, which is Curie's law.`, R`At saturation $M = Ng\mu_B\sqrt{J(J + 1)}$.`], answer: [0, 1, 2],
      sol: R`For $J = \tfrac12$ only $M_J = \pm\tfrac12$ exist and the two-level average gives $\tanh x$. For large $J$ the levels form a continuum of directions: the Langevin function $\coth x - 1/x$. At small $x$, $B_J\approx\dfrac{J + 1}{3J}x$, so $M = \dfrac{Ng^2\mu_B^2J(J + 1)}{3k_BT}B$, Curie's law. At saturation $B_J\to1$ and $M = Ng\mu_BJ$, smaller than $Ng\mu_B\sqrt{J(J + 1)}$.`,
      trap: R`The $\sqrt{J(J + 1)}$ appears in the susceptibility, not in the saturation value.` },
    { id: 'mgx-r4-10', type: 'mcq', level: 4, exams: G, sub: "Hund's rules",
      q: R`The Tb$^{3+}$ ion has configuration 4f$^8$. Its Hund's-rule ground term is`,
      options: [R`$^7F_0$`, R`$^5D_4$`, R`$^7F_6$`, R`$^7F_3$`], answer: 2,
      sol: R`Seven electrons fill $m_l = 3\dots-3$ with spin up ($S = 7/2$ so far, $L = 0$); the eighth goes spin down into $m_l = 3$. So $S = 7/2 - 1/2 = 3$, $L = 3$ (F). The shell is more than half full, so $J = L + S = 6$: $^7F_6$. (Eu$^{3+}$, 4f$^6$, has the same $L$ and $S$ but is less than half full, so $J = |L - S| = 0$.)`,
      trap: R`$J = |L - S|$ is for shells less than half full; past half filling, $J = L + S$.` },
  ],
  gens: [
    { id: 'mgx-r4g1', type: 'nat', level: 3, exams: G, sub: 'fine particles', unit: 'K',
      make(r) {
        const d = pick(r, 3, 12, 1), K = pick(r, 0.1, 1, 0.05), f = choose(r, [25, 25, 40]), V = (Math.PI / 6) * (d * 1e-9) ** 3, T = K * 1e5 * V / (f * KB);
        return { q: `Spherical single-domain particles of diameter $${d}$ nm have anisotropy constant $K = ${K}\\times10^5$ J/m$^3$. Taking the blocking condition $KV = ${f}k_BT_B$ and $k_B = 1.381\\times10^{-23}$ J/K, the blocking temperature is ______ K (to one decimal place).`,
          answer: round(T, 1), tol: Math.max(0.1, round(T * 0.003, 1)), d, K, f,
          sol: `$V = \\tfrac\\pi6d^3 = ${round(V * 1e24, 4)}\\times10^{-24}$ m$^3$, $KV = ${round(K * 1e5 * V * 1e20, 4)}\\times10^{-20}$ J. $T_B = KV/${f}k_B = ${round(T, 1)}$ K.`,
          trap: 'The volume grows as $d^3$: halving the size lowers $T_B$ eightfold.' };
      },
      verify: (p) => p.K * 1e5 * (Math.PI / 6) * (p.d * 1e-9) ** 3 / (p.f * KB) },
    { id: 'mgx-r4g2', type: 'nat', level: 3, exams: G, sub: 'domains',
      make(r) {
        const A = pick(r, 0.5, 3, 0.1), K = pick(r, 0.5, 50, 0.5), ask = choose(r, ['width', 'energy']);
        const w = Math.PI * Math.sqrt(A * 1e-11 / (K * 1e4)) * 1e9, s = 4 * Math.sqrt(A * 1e-11 * K * 1e4) * 1e3;
        return { q: `A ferromagnet has exchange stiffness $A = ${A}\\times10^{-11}$ J/m and anisotropy constant $K = ${K}\\times10^4$ J/m$^3$. ${ask === 'width' ? 'The Bloch-wall width $\\delta = \\pi\\sqrt{A/K}$ is ______ nm (to one decimal place).' : 'The Bloch-wall energy per unit area $\\sigma = 4\\sqrt{AK}$ is ______ mJ/m$^2$ (to two decimal places).'}`,
          answer: ask === 'width' ? round(w, 1) : round(s, 2), tol: ask === 'width' ? Math.max(0.1, round(w * 0.003, 1)) : Math.max(0.01, round(s * 0.003, 2)), A, K, ask, unit: ask === 'width' ? 'nm' : 'mJ/m²',
          sol: ask === 'width' ? `$A/K = ${round(A * 1e-11 / (K * 1e4) * 1e16, 4)}\\times10^{-16}$ m$^2$, so $\\delta = \\pi\\sqrt{A/K} = ${round(w, 1)}$ nm.` : `$AK = ${round(A * K, 4)}\\times10^{-7}$ J$^2$/m$^4$, $\\sqrt{AK} = ${round(Math.sqrt(A * K * 1e-7) * 1e3, 4)}$ mJ/m$^2$, so $\\sigma = 4\\sqrt{AK} = ${round(s, 2)}$ mJ/m$^2$.`,
          trap: 'Width goes as $\\sqrt{A/K}$, energy as $\\sqrt{AK}$: harder anisotropy makes walls thinner but costlier.' };
      },
      verify: (p) => p.ask === 'width' ? Math.PI * Math.sqrt(p.A * 1e-11 / (p.K * 1e4)) * 1e9 : 4 * Math.sqrt(p.A * 1e-11 * p.K * 1e4) * 1e3 },
    { id: 'mgx-r4g3', type: 'nat', level: 4, exams: G, sub: 'Curie law',
      make(r) {
        const p = choose(r, [1.73, 2.83, 3.87, 4.90, 5.92, 7.94, 9.72, 10.65]), N = pick(r, 0.5, 5, 0.1), C = MU0 * N * 1e28 * p * p * MUB * MUB / (3 * KB), Cr = Number(C.toPrecision(3));
        const pp = Math.sqrt(3 * KB * Cr / (MU0 * N * 1e28 * MUB * MUB));
        return { q: `A paramagnetic salt has $N = ${N}\\times10^{28}$ magnetic ions per m$^3$ and Curie constant $C = ${Cr}$ K in $\\chi = C/T$ (SI). Using $C = \\mu_0Np^2\\mu_B^2/3k_B$ ($\\mu_0 = 1.257\\times10^{-6}$ T m/A, $\\mu_B = 9.274\\times10^{-24}$ J/T, $k_B = 1.381\\times10^{-23}$ J/K), the effective moment number $p$ is ______ (to two decimal places).`,
          answer: round(pp, 2), tol: 0.02, N, Cr,
          sol: `$p^2 = 3k_BC/\\mu_0N\\mu_B^2 = ${round(pp * pp, 3)}$, so $p = ${round(pp, 2)}$.`,
          trap: 'The Curie constant is proportional to $p^2$, not $p$.' };
      },
      verify: (p) => Math.sqrt(3 * KB * p.Cr / (MU0 * p.N * 1e28 * MUB * MUB)) },
  ],
};
