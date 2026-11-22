// Round 4 extras for schrodinger-equation: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'], JGN = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'sch-r4-01', type: 'mcq', level: 1, exams: J, sub: 'energy spectra',
      q: R`In which of these one-dimensional or radial problems do the bound energy levels get closer together as the quantum number $n$ grows?`,
      options: [R`An infinite square well`, R`A harmonic oscillator`, R`The Coulomb potential of the hydrogen atom`, R`None of these: level spacing never shrinks`], answer: 2,
      sol: R`Infinite well: $E_n\propto n^2$, gaps grow as $2n + 1$. Oscillator: $E_n = (n + \tfrac12)\hbar\omega$, equal gaps. Hydrogen: $E_n = -13.6/n^2$ eV, gaps shrink towards zero as the levels crowd under the ionisation limit. The rule of thumb: the faster the potential walls rise, the faster the levels spread out.`,
      trap: R`The oscillator's gaps are constant, neither growing nor shrinking.` },
    { id: 'sch-r4-02', type: 'nat', level: 2, exams: J, sub: 'infinite well', unit: 'MeV',
      q: R`As a crude model of a nucleus, a proton is placed in a one-dimensional infinite well of width $10$ fm. With $hc = 1240$ MeV fm and $m_pc^2 = 938.3$ MeV, its ground-state energy is ______ MeV (to two decimal places).`,
      answer: 2.05, tol: 0.02, calc: () => 1240 ** 2 / (8 * 938.3 * 100),
      sol: R`$E_1 = \dfrac{h^2}{8mL^2} = \dfrac{(hc)^2}{8mc^2L^2} = \dfrac{1240^2}{8\times938.3\times10^2} = \dfrac{1537600}{750640} = 2.05$ MeV. This is the right order for nuclear energies (MeV), while an electron in an atom-sized box gets eV: $E\propto1/mL^2$.`,
      trap: R`Leaving out the $c^2$ in the trick $h^2/m = (hc)^2/mc^2$ mixes the units.` },
    { id: 'sch-r4-03', type: 'mcq', level: 3, exams: JG, sub: 'half oscillator',
      q: R`A particle moves in $V(x) = \tfrac12m\omega^2x^2$ for $x > 0$ with an impenetrable wall at $x = 0$ ($V = \infty$ for $x\le0$). Its ground-state energy is`,
      options: [R`$\tfrac12\hbar\omega$`, R`$\tfrac32\hbar\omega$`, R`$\hbar\omega$`, R`$\tfrac14\hbar\omega$`], answer: 1,
      sol: R`For $x > 0$ the Schrödinger equation is the oscillator's, and the wall demands $\psi(0) = 0$. The oscillator states that vanish at the origin are the odd ones, $n = 1, 3, 5, \dots$, so the allowed energies are $\tfrac32\hbar\omega, \tfrac72\hbar\omega, \dots$, spaced by $2\hbar\omega$. The ground state is $\tfrac32\hbar\omega$.`,
      trap: R`The full oscillator's ground state is even and nonzero at $x = 0$, so the wall removes it.` },
    { id: 'sch-r4-04', type: 'nat', level: 3, exams: JG, sub: 'time evolution', unit: 'fs',
      q: R`An electron in an infinite well of width $1.0$ nm is in the state $(\psi_1 + \psi_2)/\sqrt2$. Take $h^2/8m_e = 0.376$ eV nm$^2$ and $h = 4.136\times10^{-15}$ eV s. The period with which $\langle x\rangle$ oscillates is ______ fs (to two decimal places).`,
      answer: 3.67, tol: 0.02, calc: () => 4.136e-15 / (3 * 0.376) * 1e15,
      sol: R`$\langle x\rangle$ contains the cross term $\cos[(E_2 - E_1)t/\hbar]$, so the period is $T = h/(E_2 - E_1)$. $E_1 = 0.376$ eV, $E_2 = 4E_1 = 1.504$ eV, difference $1.128$ eV. $T = 4.136\times10^{-15}/1.128 = 3.67\times10^{-15}$ s.`,
      trap: R`Using $\hbar$ instead of $h$ gives $T/2\pi$, the inverse angular frequency.` },
    { id: 'sch-r4-05', type: 'msq', level: 3, exams: JG, sub: 'stationary states', format: 'statements',
      q: R`A constant $V_c$ is added to a potential $V(x)$ everywhere. Which statements are correct?`,
      options: [R`The energy eigenfunctions are unchanged.`, R`Every energy eigenvalue rises by $V_c$.`, R`For a superposition of two stationary states, $|\Psi(x, t)|^2$ is the same at all times as before.`, R`The frequencies of photons emitted in transitions between levels change.`], answer: [0, 1, 2],
      sol: R`$[-\tfrac{\hbar^2}{2m}\tfrac{d^2}{dx^2} + V + V_c]\psi = (E + V_c)\psi$ has the same solutions with every $E$ raised by $V_c$. Each time factor gains the same phase $e^{-iV_ct/\hbar}$, an overall phase that cancels in $|\Psi|^2$. Transition frequencies depend on differences $E_m - E_n$, which do not change.`,
      trap: R`Only energy differences are physical; a common shift changes nothing measurable.` },
    { id: 'sch-r4-06', type: 'mcq', level: 4, exams: JG, sub: 'finite well',
      q: R`An electron is in a finite square well of depth $10$ eV and width $1.0$ nm. With $\hbar^2/2m_e = 0.0381$ eV nm$^2$, the number of bound states is`,
      options: [R`$5$`, R`$7$`, R`$16$`, R`$6$`], answer: 3,
      sol: R`Write $z_0 = \dfrac a2\sqrt{\dfrac{2m_eV_0}{\hbar^2}} = 0.5\times\sqrt{10/0.0381} = 0.5\times16.20 = 8.10$. Bound states alternate even/odd and a new one appears each time $z_0$ passes a multiple of $\pi/2$, so their number is the smallest integer above $2z_0/\pi = 5.16$: six bound states (three even, three odd).`,
      trap: R`$16$ is $2z_0$, with no division by $\pi$; and rounding $5.16$ down forgets the ground state, which always exists.` },
    { id: 'sch-r4-07', type: 'mcq', level: 4, exams: JGN, sub: 'finite well',
      q: R`A particle of mass $m$ moves in $V = \infty$ for $x < 0$, $V = 0$ for $0 < x < a$ and $V = V_0$ for $x > a$. It has at least one bound state only if`,
      options: [R`$V_0 > 0$, whatever its size`, R`$V_0 > \pi^2\hbar^2/2ma^2$`, R`$V_0 > \pi^2\hbar^2/8ma^2$`, R`$V_0 > \hbar^2/2ma^2$`], answer: 2,
      sol: R`The wall forces $\psi(0) = 0$, so the solutions are exactly the odd states of a symmetric well of width $2a$ and depth $V_0$. The first odd state needs $z_0 = a\sqrt{2mV_0}/\hbar > \pi/2$, i.e. $V_0 > \pi^2\hbar^2/8ma^2$. Unlike the symmetric 1D well, a too-shallow step binds nothing. This is the same condition as for an $s$-wave bound state in a 3D spherical well of radius $a$.`,
      trap: R`"Any attractive well binds in 1D" holds for symmetric wells without a wall; the wall kills the even ground state.` },
    { id: 'sch-r4-08', type: 'nat', level: 4, exams: JG, sub: 'delta barrier',
      q: R`Electrons of energy $1.0$ eV meet a thin barrier modelled as $V(x) = \alpha\,\delta(x)$ with $\alpha = 0.10$ eV nm. The transmission probability is $T = \left[1 + \dfrac{m\alpha^2}{2\hbar^2E}\right]^{-1}$. With $\hbar^2/2m_e = 0.0381$ eV nm$^2$, $T$ is ______ (to three decimal places).`,
      answer: 0.938, tol: 0.003, calc: () => 1 / (1 + 0.01 / (4 * 0.0381 * 1.0)),
      sol: R`$\dfrac{m\alpha^2}{2\hbar^2E} = \dfrac{\alpha^2}{4(\hbar^2/2m)E} = \dfrac{0.01}{4\times0.0381\times1.0} = 0.0656$. So $T = 1/1.0656 = 0.938$. The barrier is "transparent" at high energy ($T\to1$ as $E\to\infty$) and reflects nearly everything at low energy.`,
      trap: R`Rewriting $m/2\hbar^2$ as $1/(4\cdot\hbar^2/2m)$, not $1/(\hbar^2/2m)$: a factor of 4 is easy to lose.` },
    { id: 'sch-r4-09', type: 'msq', level: 5, exams: JGN, sub: 'bound states', format: 'statements',
      q: R`Which statements about the existence of bound states are correct?`,
      options: [R`In one dimension, a symmetric attractive square well of any depth has at least one bound state.`, R`In three dimensions, a spherical square well of any depth has at least one bound state.`, R`For a spherical square well of radius $a$, an $s$-wave bound state needs $V_0a^2 > \pi^2\hbar^2/8m$.`, R`Making a well deeper can only remove bound states, never add them.`], answer: [0, 2],
      sol: R`In 1D the even ground state survives at any depth: its energy just moves up to near zero as the well gets shallow. In 3D the radial function $u = r\psi$ must vanish at $r = 0$, making the problem the "wall plus well" in one dimension, which needs $V_0a^2 > \pi^2\hbar^2/8m$. Deepening a well always adds states (each time $z_0$ passes a multiple of $\pi/2$), never removes them.`,
      trap: R`The 1D result does not carry over to 3D, because the radial wave function must vanish at the origin.` },
    { id: 'sch-r4-10', type: 'nat', level: 5, exams: JG, sub: 'time evolution',
      q: R`A particle in an infinite well $0 < x < L$ is in the state $(\psi_1 + \psi_2)/\sqrt2$ with $\psi_n = \sqrt{2/L}\sin(n\pi x/L)$. Using $\int_0^L x\,\psi_1\psi_2\,dx = -\dfrac{16L}{9\pi^2}$, the largest value $\langle x\rangle$ reaches during the motion, divided by $L$, is ______ (to three decimal places).`,
      answer: 0.68, tol: 0.002, calc: () => 0.5 + 16 / (9 * Math.PI ** 2),
      sol: R`$\langle x\rangle(t) = \tfrac12(\langle x\rangle_{11} + \langle x\rangle_{22}) + \langle x\rangle_{12}\cos\omega_{21}t$ with $\omega_{21} = (E_2 - E_1)/\hbar$. Both stationary states give $L/2$, so $\langle x\rangle = \dfrac L2 - \dfrac{16L}{9\pi^2}\cos\omega_{21}t$. It ranges from $L(0.5 - 0.180)$ to $L(0.5 + 0.180)$; the largest value is $0.680L$, reached half a period after $t = 0$.`,
      trap: R`The cross term appears twice ($\psi_1\psi_2$ and $\psi_2\psi_1$) with the factor $\tfrac12$ from normalisation, so its full size is $16L/9\pi^2$, not half of it.` },
  ],
  gens: [
    { id: 'sch-r4g1', type: 'nat', level: 4, exams: JG, sub: 'finite well',
      make(r) {
        const V0 = pick(r, 1, 30, 0.5), a = pick(r, 0.3, 2, 0.1), z0 = (a / 2) * Math.sqrt(V0 / 0.0381), N = Math.floor(2 * z0 / Math.PI) + 1;
        return { q: `An electron is in a finite square well of depth $${V0}$ eV and width $${a}$ nm. With $\\hbar^2/2m_e = 0.0381$ eV nm$^2$, the number of bound states is ______.`,
          answer: N, tol: 0, V0, a,
          sol: `$z_0 = \\dfrac a2\\sqrt{V_0/(\\hbar^2/2m_e)} = ${round(a / 2, 2)}\\times\\sqrt{${V0}/0.0381} = ${round(z0, 3)}$. A new bound state appears each time $z_0$ passes a multiple of $\\pi/2$, so $N = \\lfloor2z_0/\\pi\\rfloor + 1 = \\lfloor${round(2 * z0 / Math.PI, 3)}\\rfloor + 1 = ${N}$.`,
          trap: 'The ground state exists for any depth, so round $2z_0/\\pi$ down and add one.' };
      },
      verify: (p) => Math.floor(2 * (p.a / 2) * Math.sqrt(p.V0 / 0.0381) / Math.PI) + 1 },
    { id: 'sch-r4g2', type: 'nat', level: 4, exams: JG, sub: 'delta barrier',
      make(r) {
        const al = pick(r, 0.05, 0.5, 0.05), E = pick(r, 0.2, 5, 0.1), x = al * al / (4 * 0.0381 * E), T = 1 / (1 + x), ask = choose(r, ['T', 'R']);
        const val = ask === 'T' ? T : 1 - T;
        return { q: `Electrons of energy $${E}$ eV meet a thin barrier $V(x) = \\alpha\\,\\delta(x)$ with $\\alpha = ${al}$ eV nm. The transmission probability is $T = [1 + m\\alpha^2/2\\hbar^2E]^{-1}$. With $\\hbar^2/2m_e = 0.0381$ eV nm$^2$, the ${ask === 'T' ? 'transmission' : 'reflection'} probability is ______ (to three decimal places).`,
          answer: round(val, 3), tol: 0.002, al, E, ask,
          sol: `$\\dfrac{m\\alpha^2}{2\\hbar^2E} = \\dfrac{\\alpha^2}{4(\\hbar^2/2m)E} = \\dfrac{${round(al * al, 4)}}{4\\times0.0381\\times${E}} = ${round(x, 4)}$, so $T = 1/(1 + ${round(x, 4)}) = ${round(T, 4)}$${ask === 'R' ? ` and $R = 1 - T = ${round(1 - T, 4)}$` : ''}.`,
          trap: 'The factor 4 in $m/2\\hbar^2 = 1/4(\\hbar^2/2m)$ is easy to lose.' };
      },
      verify: (p) => { const T = 1 / (1 + p.al * p.al / (4 * 0.0381 * p.E)); return p.ask === 'T' ? T : 1 - T; } },
    { id: 'sch-r4g3', type: 'nat', level: 3, exams: JG, sub: 'time evolution', unit: 'fs',
      make(r) {
        const L = pick(r, 0.5, 3, 0.5), n = int(r, 2, 4), E1 = 0.376 / (L * L), Tp = 4.136e-15 / ((n * n - 1) * E1) * 1e15;
        return { q: `An electron in an infinite well of width $${L}$ nm is in the state $(\\psi_1 + \\psi_${n})/\\sqrt2$. With $h^2/8m_e = 0.376$ eV nm$^2$ and $h = 4.136\\times10^{-15}$ eV s, the probability density repeats itself with period ______ fs (to two decimal places).`,
          answer: round(Tp, 2), tol: Math.max(0.01, round(Tp * 0.005, 2)), L, n,
          sol: `$|\\Psi|^2$ has one time-dependent cross term, $\\cos[(E_${n} - E_1)t/\\hbar]$, so the period is $h/(E_${n} - E_1)$. $E_1 = 0.376/${L}^2 = ${round(E1, 4)}$ eV and $E_${n} - E_1 = ${n * n - 1}E_1 = ${round((n * n - 1) * E1, 4)}$ eV. $T = 4.136\\times10^{-15}/${round((n * n - 1) * E1, 4)} = ${round(Tp, 2)}$ fs.`,
          trap: 'Using $\\hbar$ instead of $h$ in the period.' };
      },
      verify: (p) => 4.136e-15 / ((p.n * p.n - 1) * 0.376 / (p.L * p.L)) * 1e15 },
  ],
};
