// Round 5 extras for commutators-uncertainty: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const HBARC = 197.327; // MeV fm
const K_E = 0.05788; // hbar / 2 m_e in nm^2 per fs

// Product Delta x Delta p / hbar for psi proportional to 1 - |x/a|^n on |x| < a.
function powProduct(n) {
  const N = 1 - 2 / (n + 1) + 1 / (2 * n + 1);
  const X = 1 / 3 - 2 / (n + 3) + 1 / (2 * n + 3);
  return Math.sqrt((X / N) * (n * n / ((2 * n - 1) * N)));
}

export default {
  items: [
    { id: 'qcu-r5-01', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'representations',
      q: R`In the momentum representation, where a state is written as $\phi(p)$, the position operator $\hat x$ acts as`,
      options: [R`multiplication by $p$`, R`$i\hbar\,\dfrac{d}{dp}$`, R`$-i\hbar\,\dfrac{d}{dp}$`, R`$-i\hbar\,\dfrac{d}{dx}$`], answer: 1,
      sol: R`The representation must keep $[\hat x, \hat p] = i\hbar$. In momentum space $\hat p$ is multiplication by $p$. Try $\hat x = i\hbar\,d/dp$: $[\hat x, \hat p]\phi = i\hbar\dfrac{d}{dp}(p\phi) - p\,i\hbar\dfrac{d\phi}{dp} = i\hbar\phi$. The other sign would give $-i\hbar$. So $\hat x = +i\hbar\,d/dp$, the mirror image of $\hat p = -i\hbar\,d/dx$ in position space.`,
      trap: R`Copying the minus sign of $\hat p = -i\hbar\,d/dx$; swapping the roles of $x$ and $p$ also flips the sign.` },
    { id: 'qcu-r5-02', type: 'msq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'compatible observables',
      q: R`In three dimensions, which of these commutators are zero?`,
      options: [R`$[\hat x, \hat p_y]$`, R`$[\hat y, \hat p_y]$`, R`$[\hat x, \hat L_x]$`, R`$[\hat p_x, \hat L_z]$`], answer: [0, 2],
      sol: R`Different Cartesian components always commute: $[\hat x, \hat p_y] = 0$, while $[\hat y, \hat p_y] = i\hbar$. $\hat L_x = \hat y\hat p_z - \hat z\hat p_y$ contains no $\hat p_x$, so it commutes with $\hat x$. $\hat L_z = \hat x\hat p_y - \hat y\hat p_x$ contains $\hat x$, so $[\hat p_x, \hat L_z] = [\hat p_x, \hat x]\hat p_y = -i\hbar\hat p_y \ne 0$. In general a component of $\vec L$ commutes with the same component of $\vec r$ and $\vec p$.`,
      trap: R`Thinking that $\hat L_z$ commutes with every momentum component because it is "about the z-axis".` },
    { id: 'qcu-r5-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      q: R`For a free particle ($H = \hat p^2/2m$) in the Heisenberg picture, the commutator of the position operator at time $t$ with the position operator at time $0$, $[\hat x(t), \hat x(0)]$, is`,
      options: [R`$0$, because both are position operators`, R`$i\hbar t/m$`, R`$i\hbar$`, R`$-i\hbar t/m$`], answer: 3,
      sol: R`The Heisenberg equations give $\hat x(t) = \hat x(0) + \hat p(0)\,t/m$ for a free particle. Then $[\hat x(t), \hat x(0)] = \dfrac{t}{m}[\hat p(0), \hat x(0)] = -\dfrac{i\hbar t}{m}$. Position measurements at different times are therefore not compatible; Robertson gives $\Delta x(t)\,\Delta x(0) \ge \hbar t/2m$, which is why a sharply located particle cannot stay sharp.`,
      trap: R`Treating "the same observable at two times" as one operator; in the Heisenberg picture they are different operators.` },
    { id: 'qcu-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      q: R`A free electron has position spread $\Delta x(0) = 0.10$ nm at $t = 0$, in any state at all. Using $[\hat x(t), \hat x(0)] = -i\hbar t/m$, the smallest possible position spread at $t = 2.0$ fs is ______ nm (two decimal places). Use $\hbar/2m_e = 0.05788$ nm$^2$/fs.`,
      answer: 1.16, tol: 0.01, unit: 'nm', calc: () => (K_E * 2) / 0.1,
      sol: R`Robertson's relation for $A = \hat x(t)$ and $B = \hat x(0)$: $\Delta x(t)\,\Delta x(0) \ge \tfrac12|\langle[\hat x(t), \hat x(0)]\rangle| = \dfrac{\hbar t}{2m}$. So $\Delta x(t) \ge \dfrac{\hbar t}{2m\,\Delta x(0)} = \dfrac{0.05788\times2.0}{0.10} = 1.16$ nm. The bound holds for every state, chirped or not; a minimum-uncertainty packet spreads to $\sqrt{0.1^2 + 1.158^2} = 1.16$ nm, almost exactly the bound at such long times.`,
      trap: R`Using $\hbar/m$ instead of $\hbar/2m$ doubles the answer; the factor $\tfrac12$ comes from Robertson's relation.` },
    { id: 'qcu-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      q: R`For the relativistic free Hamiltonian $H = \sqrt{\hat p^2c^2 + m^2c^4}$, the velocity operator $\hat v = \dfrac{i}{\hbar}[H, \hat x]$ is`,
      options: [R`$\hat p/m$`, R`$\hat pc^2/H$`, R`$c$ times the identity`, R`$H/\hat pc$`], answer: 1,
      sol: R`For any function of $\hat p$, $[\hat x, f(\hat p)] = i\hbar f'(\hat p)$, so $[H, \hat x] = -i\hbar\,\dfrac{dH}{dp}$. Then $\hat v = \dfrac{i}{\hbar}(-i\hbar)\dfrac{dH}{dp} = \dfrac{\hat pc^2}{\sqrt{\hat p^2c^2 + m^2c^4}} = \dfrac{\hat pc^2}{H}$, the relativistic velocity $pc^2/E$. Its size stays below $c$ and it reduces to $\hat p/m$ when $pc \ll mc^2$.`,
      trap: R`Keeping the non-relativistic $\hat p/m$; that is only the low-momentum limit and exceeds $c$ for large $p$.` },
    { id: 'qcu-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uncertainty products',
      q: R`A particle has the triangular wavefunction $\psi(x) = A(a - |x|)$ for $|x| < a$ and $0$ outside. Then $\Delta x\,\Delta p = k\hbar$ with $k =$ ______ (three decimal places).`,
      answer: 0.548, tol: 0.002, calc: () => Math.sqrt(0.3),
      sol: R`Normalisation: $A^2\cdot2\int_0^a(a - x)^2dx = \dfrac{2A^2a^3}{3} = 1$, so $A^2 = \dfrac{3}{2a^3}$. By symmetry $\langle x\rangle = \langle p\rangle = 0$. $\langle x^2\rangle = A^2\cdot2\int_0^ax^2(a - x)^2dx = A^2\cdot\dfrac{2a^5}{30} = \dfrac{a^2}{10}$. The slope is $\mp A$, and $\psi$ has only kinks (no jumps), so $\langle p^2\rangle = \hbar^2\int|\psi'|^2dx = \hbar^2A^2\cdot2a = \dfrac{3\hbar^2}{a^2}$. Hence $\Delta x\Delta p = \hbar\sqrt{3/10} = 0.548\hbar$, above the Gaussian minimum $0.5\hbar$.`,
      trap: R`Computing $\langle p^2\rangle$ as $-\hbar^2\int\psi\psi''dx$ and dropping the delta functions in $\psi''$ at the kinks gives zero; use $\int|\psi'|^2$ instead.` },
    { id: 'qcu-r5-07', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      q: R`For a free particle in the Heisenberg picture, which statements are correct?`,
      options: [R`$[\hat x(t), \hat p(t)] = i\hbar$ at every time $t$`, R`$[\hat p(t), \hat p(0)] = 0$`, R`$[\hat x(t), \hat x(0)] = 0$`, R`A normalisable state can keep a constant position spread $\Delta x(t)$ for all $t$`], answer: [0, 1],
      sol: R`Time evolution is unitary, so equal-time commutators are preserved: $[\hat x(t), \hat p(t)] = i\hbar$. Momentum is conserved, $\hat p(t) = \hat p(0)$, so the second commutator vanishes. $\hat x(t) = \hat x(0) + \hat p(0)t/m$ gives $[\hat x(t), \hat x(0)] = -i\hbar t/m \ne 0$. Finally $\dfrac{d^2}{dt^2}(\Delta x)^2 = \dfrac{2(\Delta p)^2}{m^2} > 0$ for any normalisable state (it must have $\Delta p > 0$), so the variance is a convex parabola in $t$ and cannot stay constant.`,
      trap: R`Thinking a non-spreading packet is possible for a free particle; it needs a confining (for example harmonic) potential.` },
    { id: 'qcu-r5-08', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Robertson relation',
      q: R`For $H = \hat p^2/2m + V(\hat x)$, applying the Robertson relation to $\hat x$ and $H$ gives, in any state,`,
      options: [R`$\Delta x\,\Delta E \ge \hbar/2$`, R`$\Delta x\,\Delta E \ge \dfrac{\hbar}{2m}\langle p^2\rangle$`, R`$\Delta x\,\Delta E \ge \dfrac{\hbar}{2}\left|\dfrac{d\langle x\rangle}{dt}\right|$`, R`$\Delta x\,\Delta E \ge 0$ only, since $[\hat x, H] = 0$`], answer: 2,
      sol: R`$[\hat x, H] = \dfrac{1}{2m}[\hat x, \hat p^2] = \dfrac{i\hbar\hat p}{m}$. Robertson: $\Delta x\,\Delta E \ge \tfrac12\left|\dfrac{\hbar\langle p\rangle}{m}\right|$. By Ehrenfest $\langle p\rangle/m = d\langle x\rangle/dt$, so $\Delta x\,\Delta E \ge \dfrac{\hbar}{2}\left|\dfrac{d\langle x\rangle}{dt}\right|$. A state with a definite energy ($\Delta E = 0$) must therefore have a stationary mean position, as every stationary state does.`,
      trap: R`Writing $\hbar/2$ by analogy with $x$ and $p$; the right side depends on the state because $[\hat x, H]$ is an operator, not a number.` },
    { id: 'qcu-r5-09', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'commutator algebra',
      q: R`Let $D = \tfrac12(\hat x\hat p + \hat p\hat x)$ and $H = \dfrac{\hat p^2}{2m} + \dfrac{\lambda}{\hat x^2}$ on the half-line. Then $[D, H]$ equals`,
      options: [R`$2i\hbar H$`, R`$0$`, R`$-2i\hbar H$`, R`$i\hbar H$`], answer: 0,
      sol: R`From $[\hat x, \hat p] = i\hbar$: $[D, \hat p] = i\hbar\hat p$, so $[D, \hat p^2] = 2i\hbar\hat p^2$. For a function of $\hat x$, $[D, f(\hat x)] = -i\hbar\,\hat xf'(\hat x)$; with $f = x^{-2}$, $\hat xf' = -2\hat x^{-2}$ and $[D, \hat x^{-2}] = 2i\hbar\hat x^{-2}$. Both terms scale the same way: $[D, H] = 2i\hbar H$. In a normalisable eigenstate $\langle[D, H]\rangle = 0$, which forces $E = 0$: the $1/x^2$ potential has no length scale and so no ordinary bound states at negative energy.`,
      trap: R`Getting opposite signs for the two terms and concluding $[D, H] = 0$; kinetic energy and an inverse-square potential both scale as length$^{-2}$.` },
    { id: 'qcu-r5-10', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'commutator algebra',
      q: R`The commutator $[\hat x^2\hat p, \hat x] = k\,i\hbar\,\hat x^2$. The value of $k$ is ______.`,
      answer: -1, tol: 0,
      sol: R`$\hat x^2$ commutes with $\hat x$, so $[\hat x^2\hat p, \hat x] = \hat x^2[\hat p, \hat x] = \hat x^2(-i\hbar) = -i\hbar\hat x^2$. So $k = -1$.`,
      trap: R`Using $[\hat x, \hat p] = i\hbar$ with the operators in the wrong order gives $+1$.` },
  ],
  gens: [
    { id: 'qcu-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'uncertainty estimates',
      make(r) {
        const [name, m] = choose(r, [['electron', 0.511], ['proton', 938.272], ['neutron', 939.565]]);
        const dx = choose(r, [2, 3, 4, 5, 6, 8, 10]);
        const pc = HBARC / (2 * dx), K = Math.sqrt(pc * pc + m * m) - m;
        const d = K < 1 ? 3 : 2;
        return { q: R`A ${name} (rest energy $${m}$ MeV) is confined to a region with $\Delta x = ${dx}$ fm. Taking its momentum to be the minimum spread allowed by $\Delta x\Delta p \ge \hbar/2$, its kinetic energy (use the relativistic formula) is ______ MeV. Use $\hbar c = 197.3$ MeV fm.`,
          answer: round(K, d), tol: Math.max(round(K * 0.01, 3), 10 ** -d), m, dx,
          sol: R`$pc = \dfrac{\hbar c}{2\Delta x} = \dfrac{197.3}{${2 * dx}} = ${round(pc, 3)}$ MeV. Then $K = \sqrt{(pc)^2 + (mc^2)^2} - mc^2 = \sqrt{${round(pc, 3)}^2 + ${m}^2} - ${m} = ${round(K, d)}$ MeV. ${m < 1 ? 'For the electron $pc \\gg mc^2$, so $K \\approx pc$: tens of MeV, far above nuclear binding energies per nucleon, which is why electrons cannot live inside nuclei.' : 'For a nucleon $pc \\ll mc^2$, so $K \\approx (pc)^2/2mc^2$, a few MeV or less, the scale of nuclear binding.'}`,
          trap: R`Using $K = p^2/2m$ for the electron gives an absurd result; use the relativistic energy when $pc$ is comparable to or above $mc^2$.` };
      },
      verify: (p) => { const pc = HBARC / (2 * p.dx); return Math.sqrt(pc * pc + p.m * p.m) - p.m; } },
    { id: 'qcu-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uncertainty products',
      make(r) {
        const n = choose(r, [2, 3, 4, 5, 6, 8]);
        const k = powProduct(n);
        return { q: R`A particle has $\psi(x) = A\left(1 - |x/a|^{${n}}\right)$ for $|x| < a$ and $0$ outside. Then $\Delta x\,\Delta p = k\hbar$ with $k =$ ______ (three decimal places).`,
          answer: round(k, 3), tol: 0.002, n,
          sol: R`Write $u = x/a$. Normalisation: $A^2a\cdot2\int_0^1(1 - u^n)^2du = 2aA^2N$ with $N = 1 - \dfrac{2}{n + 1} + \dfrac{1}{2n + 1} = ${round(1 - 2 / (n + 1) + 1 / (2 * n + 1), 4)}$. Then $\langle x^2\rangle = a^2X/N$ with $X = \dfrac13 - \dfrac{2}{n + 3} + \dfrac{1}{2n + 3} = ${round(1 / 3 - 2 / (n + 3) + 1 / (2 * n + 3), 4)}$. The slope is $-\dfrac{n}{a}Au^{n-1}$, so $\langle p^2\rangle = \hbar^2\int|\psi'|^2dx = \dfrac{\hbar^2}{a^2}\cdot\dfrac{n^2}{(2n - 1)N}$. So $k = \sqrt{\dfrac{X}{N}\cdot\dfrac{${n * n}}{${2 * n - 1}N}} = ${round(k, 3)}$. As $n$ grows the state approaches a flat box with sharp edges, and the product grows.`,
          trap: R`Forgetting to normalise; the ratio $X/N$ and the $1/N$ in $\langle p^2\rangle$ both matter.` };
      },
      verify: (p) => powProduct(p.n) },
    { id: 'qcu-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      make(r) {
        const f = choose(r, [[1, 12], [1, 8], [1, 6], [1, 4], [1, 3], [3, 8], [5, 12], [2, 3], [3, 4], [5, 6]]);
        const ph = 2 * Math.PI * f[0] / f[1], k = -Math.sin(ph);
        return { q: R`For the oscillator $H = \hat p^2/2m + \tfrac12m\omega^2\hat x^2$ in the Heisenberg picture, $[\hat x(t), \hat x(0)] = k\,\dfrac{i\hbar}{m\omega}$. At $t = ${f[0]}T/${f[1]}$, where $T = 2\pi/\omega$ is the period, $k =$ ______ (three decimal places).`,
          answer: round(k, 3), tol: 0.002, ph,
          sol: R`The Heisenberg solution is $\hat x(t) = \hat x(0)\cos\omega t + \dfrac{\hat p(0)}{m\omega}\sin\omega t$. So $[\hat x(t), \hat x(0)] = \dfrac{\sin\omega t}{m\omega}[\hat p, \hat x] = -\dfrac{i\hbar\sin\omega t}{m\omega}$, giving $k = -\sin\omega t$. Here $\omega t = 2\pi\cdot${f[0]}/${f[1]}$, so $k = ${round(k, 3)}$. The commutator vanishes at every half period, when $\hat x(t) = \pm\hat x(0)$.`,
          trap: R`Dropping the minus sign from $[\hat p, \hat x] = -i\hbar$.` };
      },
      verify: (p) => -Math.sin(p.ph) },
  ],
};
