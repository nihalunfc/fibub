// Round 4 extras for commutators-uncertainty: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const HBAR = 1.054571817e-34, ME = 9.1093837015e-31;
const K_E = 0.05788; // hbar / 2 m_e in nm^2 per fs

export default {
  items: [
    { id: 'qcu-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'commutator algebra',
      q: R`If $A$ and $B$ are Hermitian operators, their commutator $[A, B]$ is`,
      options: [R`Hermitian`, R`anti-Hermitian, so that $i[A, B]$ is Hermitian`, R`unitary`, R`always zero`], answer: 1,
      sol: R`Take the adjoint: $[A, B]^\dagger = (AB - BA)^\dagger = B^\dagger A^\dagger - A^\dagger B^\dagger = BA - AB = -[A, B]$. An operator equal to minus its adjoint is anti-Hermitian. Multiplying by $i$ fixes this: $(i[A, B])^\dagger = -i(-[A, B]) = i[A, B]$. The canonical example is $[\hat x, \hat p] = i\hbar$, which is $i$ times a real number.`,
      trap: R`Assuming that anything built from Hermitian operators is Hermitian; even the product $AB$ is Hermitian only when $A$ and $B$ commute.` },
    { id: 'qcu-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'functions of x and p',
      q: R`The double commutator $[\hat x, [\hat x, \hat p^2]]$ equals`,
      options: [R`$2\hbar^2$`, R`$0$`, R`$-2\hbar^2$`, R`$2i\hbar\,\hat p$`], answer: 2,
      sol: R`First $[\hat x, \hat p^2] = \hat p[\hat x, \hat p] + [\hat x, \hat p]\hat p = 2i\hbar\hat p$. Then $[\hat x, 2i\hbar\hat p] = 2i\hbar\cdot i\hbar = -2\hbar^2$, a pure number. Dividing by $2m$: $[\hat x, [\hat x, H]] = -\hbar^2/m$ for $H = \hat p^2/2m + V(\hat x)$, the starting point of the Thomas-Reiche-Kuhn sum rule.`,
      trap: R`Forgetting that $i\cdot i = -1$ gives $+2\hbar^2$.` },
    { id: 'qcu-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'commutator algebra',
      q: R`The commutator $[\hat x^2, \hat x\hat p] = k\,i\hbar\,\hat x^2$. The value of $k$ is ______.`,
      answer: 2, tol: 0,
      sol: R`Use $[A, BC] = B[A, C] + [A, B]C$ with $A = \hat x^2$, $B = \hat x$, $C = \hat p$: $[\hat x^2, \hat x\hat p] = \hat x[\hat x^2, \hat p] + [\hat x^2, \hat x]\hat p = \hat x(2i\hbar\hat x) + 0 = 2i\hbar\hat x^2$. So $k = 2$.`,
      trap: R`Pulling $\hat x$ to the wrong side of the commutator: here $\hat x$ stands to the left, so the result is $\hat x\cdot2i\hbar\hat x$, which happens to be ordered already.` },
    { id: 'qcu-r4-04', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'canonical commutator', format: 'statements',
      q: R`Two Hermitian operators satisfy $[A, B] = i\hbar$ (times the identity) exactly. Which statements are correct?`,
      options: [R`They cannot be represented by finite $N\times N$ matrices`, R`They have no common eigenvector`, R`$A$ and $B$ cannot both be bounded operators`, R`In a suitable state the product $\sigma_A\sigma_B$ can be zero`], answer: [0, 1, 2],
      sol: R`(1) For matrices $\mathrm{Tr}[A, B] = 0$ but $\mathrm{Tr}(i\hbar\,1) = i\hbar N \ne 0$. (2) If $A\psi = a\psi$ and $B\psi = b\psi$, then $[A, B]\psi = (ab - ba)\psi = 0$, not $i\hbar\psi$. (3) From $[A, B^n] = n\,i\hbar B^{n-1}$ one gets $n\hbar\|B\|^{n-1} \le 2\|A\|\,\|B\|^n$ for every $n$, impossible if both norms are finite (the Wintner-Wielandt theorem); so at least one of them, like $\hat x$ and $\hat p$, is unbounded. (4) Robertson gives $\sigma_A\sigma_B \ge \hbar/2$ in every state, so it is false.`,
      trap: R`A state that is sharp in $A$ would need infinite spread in $B$; it is not a counterexample to the bound but a non-normalisable limit.` },
    { id: 'qcu-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Heisenberg equations',
      q: R`For a free particle, $H = \hat p^2/2m$, the second time derivative $\dfrac{d^2}{dt^2}\langle x^2\rangle$ equals`,
      options: [R`$\langle p\rangle^2/m^2$`, R`$2\langle p^2\rangle/m^2$`, R`$0$`, R`$\langle p^2\rangle/m^2$`], answer: 1,
      sol: R`$\dfrac{d}{dt}\langle Q\rangle = \dfrac{i}{\hbar}\langle[H, Q]\rangle$. With $[\hat p^2, \hat x] = -2i\hbar\hat p$: $[H, \hat x^2] = -\dfrac{i\hbar}{m}(\hat x\hat p + \hat p\hat x)$, so $\dfrac{d\langle x^2\rangle}{dt} = \dfrac{\langle xp + px\rangle}{m}$. Next $[H, \hat x\hat p + \hat p\hat x] = -\dfrac{2i\hbar}{m}\hat p^2$, so $\dfrac{d}{dt}\langle xp + px\rangle = \dfrac{2\langle p^2\rangle}{m}$. Hence $\dfrac{d^2\langle x^2\rangle}{dt^2} = \dfrac{2\langle p^2\rangle}{m^2}$, a constant: $\langle x^2\rangle$ grows quadratically with time.`,
      trap: R`Using only the mean momentum ($\langle p\rangle^2$) misses the spreading caused by the momentum spread; a packet at rest still spreads.` },
    { id: 'qcu-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wave-packet spreading',
      q: R`A free electron starts in a minimum-uncertainty Gaussian packet (no chirp) with $\Delta x_0 = 0.10$ nm. The time after which its position spread has doubled is ______ fs (two decimal places).`,
      answer: 0.30, tol: 0.005, unit: 'fs', calc: () => 2 * Math.sqrt(3) * ME * 1e-20 / HBAR * 1e15,
      sol: R`For a free, unchirped minimum-uncertainty packet, $\Delta x(t)^2 = \Delta x_0^2 + (\Delta p\,t/m)^2$ with $\Delta p = \hbar/2\Delta x_0$. Doubling needs $(\Delta p\,t/m)^2 = 3\Delta x_0^2$, so $t = \dfrac{2\sqrt3\,m\Delta x_0^2}{\hbar} = \dfrac{2\sqrt3\times9.11\times10^{-31}\times10^{-20}}{1.055\times10^{-34}} = 2.99\times10^{-16}$ s $= 0.30$ fs. An electron squeezed to atomic size spreads almost at once.`,
      trap: R`Setting $\Delta p\,t/m = \Delta x_0$ (adding widths linearly) gives a time $\sqrt3$ too short.` },
    { id: 'qcu-r4-07', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Ehrenfest theorem',
      q: R`For $H = \hat p^2/2m + V(\hat x)$, which statement is NOT correct in general?`,
      options: [R`$\dfrac{d\langle x\rangle}{dt} = \dfrac{\langle p\rangle}{m}$`, R`$\dfrac{d\langle p\rangle}{dt} = -\langle V'(x)\rangle$`, R`If $V$ is at most quadratic in $x$, $\langle x\rangle(t)$ follows a classical trajectory exactly`, R`$\dfrac{d\langle p\rangle}{dt} = -V'(\langle x\rangle)$ for every potential`], answer: 3,
      sol: R`$[H, \hat x] = -i\hbar\hat p/m$ gives the first line. $[H, \hat p] = [V, \hat p] = i\hbar V'(\hat x)$ gives $d\langle p\rangle/dt = -\langle V'(x)\rangle$. The average of the force equals the force at the average position only when $V'$ is linear in $x$, that is for $V$ at most quadratic; then the centre obeys Newton's law exactly. For $V = \lambda x^4$, $\langle x^3\rangle \ne \langle x\rangle^3$ and the last statement fails.`,
      trap: R`Reading Ehrenfest's theorem as "quantum mechanics reduces to Newton's law for the mean" in every potential.` },
    { id: 'qcu-r4-08', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'functions of x and p',
      q: R`Using $[\hat p, f(\hat x)] = -i\hbar f'(\hat x)$, the operator $e^{ik\hat x}$ ($k$ real) acting on a momentum eigenstate $|p\rangle$ gives`,
      options: [R`$|p + \hbar k\rangle$`, R`$|p - \hbar k\rangle$`, R`$e^{ikp}|p\rangle$`, R`$\hbar k\,|p\rangle$`], answer: 0,
      sol: R`$[\hat p, e^{ik\hat x}] = -i\hbar(ik)e^{ik\hat x} = \hbar k\,e^{ik\hat x}$. So $\hat p\,e^{ik\hat x}|p\rangle = e^{ik\hat x}\hat p|p\rangle + \hbar k\,e^{ik\hat x}|p\rangle = (p + \hbar k)\,e^{ik\hat x}|p\rangle$: the new state has momentum $p + \hbar k$. In position space, $e^{ikx}e^{ipx/\hbar} = e^{i(p + \hbar k)x/\hbar}$. This is the momentum kick an atom gets when it absorbs a photon of wavenumber $k$.`,
      trap: R`A sign slip in $[\hat p, f] = -i\hbar f'$ gives the lowered momentum.` },
    { id: 'qcu-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uncertainty products',
      q: R`A particle has $\psi(x) = \dfrac{1}{\sqrt{2a}}\,\mathrm{sech}(x/a)$. Then $\Delta x\,\Delta p = k\hbar$ with $k =$ ______ (three decimal places). Use $\int_{-\infty}^{\infty}u^2\mathrm{sech}^2u\,du = \pi^2/6$ and $\int_{-\infty}^{\infty}\mathrm{sech}^2u\tanh^2u\,du = 2/3$.`,
      answer: 0.524, tol: 0.002, calc: () => Math.PI / 6,
      sol: R`Normalisation: $\int\mathrm{sech}^2(x/a)\,dx = 2a$, so $\psi$ is normalised. The state is real and even, so $\langle x\rangle = \langle p\rangle = 0$. $\langle x^2\rangle = \dfrac{1}{2a}\,a^3\dfrac{\pi^2}{6} = \dfrac{\pi^2a^2}{12}$. $\psi' = -\dfrac{1}{a\sqrt{2a}}\mathrm{sech}\tanh$, so $\langle p^2\rangle = \hbar^2\int|\psi'|^2dx = \dfrac{\hbar^2}{2a^3}\cdot a\cdot\dfrac23 = \dfrac{\hbar^2}{3a^2}$. Then $\Delta x\Delta p = \hbar\sqrt{\dfrac{\pi^2}{36}} = \dfrac{\pi}{6}\hbar = 0.524\hbar$, just above the Gaussian minimum of $0.5\hbar$.`,
      trap: R`Dropping the factor $1/2a$ from normalisation changes both moments; the product must come out at least $0.5$.` },
    { id: 'qcu-r4-10', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'compatible observables',
      q: R`$\Pi$ is the parity operator in one dimension, $\Pi\psi(x) = \psi(-x)$. Which operators commute with $\Pi$?`,
      options: [R`$\hat x^2$`, R`$\hat x\hat p + \hat p\hat x$`, R`$\hat x\hat p^2$`, R`$\hat p^2/2m + \lambda\hat x^3$`], answer: [0, 1],
      sol: R`$\Pi\hat x\Pi = -\hat x$ and $\Pi\hat p\Pi = -\hat p$, with $\Pi^2 = 1$. A product with an even number of $\hat x$ and $\hat p$ factors keeps its sign, so it commutes with $\Pi$: $\hat x^2$ and $\hat x\hat p + \hat p\hat x$ (two factors each). $\hat x\hat p^2$ has three factors and changes sign, so it anticommutes. In the last operator the $\hat x^3$ term changes sign, so this Hamiltonian is not parity symmetric and its eigenstates need not have definite parity.`,
      trap: R`Counting only the powers of $\hat x$ and forgetting that $\hat p$ is odd too.` },
    { id: 'qcu-r4-11', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'Baker-Campbell-Hausdorff',
      q: R`Let $D = \tfrac12(\hat x\hat p + \hat p\hat x)$ and $U = e^{i\lambda D/\hbar}$ with real $\lambda$. Then $U\hat x\,U^\dagger$ equals`,
      options: [R`$\hat x + \lambda$`, R`$e^{-\lambda}\hat x$`, R`$e^{\lambda}\hat x$`, R`$\hat x + \lambda\hbar$`], answer: 2,
      sol: R`$[D, \hat x] = \tfrac12(\hat x[\hat p, \hat x] + [\hat p, \hat x]\hat x) = -i\hbar\hat x$. Let $f(\lambda) = U\hat xU^\dagger$. Then $f' = \dfrac{i}{\hbar}U[D, \hat x]U^\dagger = \dfrac{i}{\hbar}(-i\hbar)f = f$, so $f = e^{\lambda}\hat x$. In the same way $U\hat pU^\dagger = e^{-\lambda}\hat p$, which keeps $[\hat x, \hat p] = i\hbar$. $D$ generates dilations (squeezing), as $\hat p$ generates translations.`,
      trap: R`Confusing the dilation generator with the momentum, which shifts $\hat x$ by a constant.` },
    { id: 'qcu-r4-12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spin uncertainty',
      q: R`For any pure state of a spin-$\tfrac12$ particle, $(\Delta\sigma_x)^2 + (\Delta\sigma_y)^2 + (\Delta\sigma_z)^2$ equals`,
      options: [R`$3$`, R`$1$`, R`$0$ for spin up along a suitable axis`, R`$2$`], answer: 3,
      sol: R`Each $\sigma_i^2 = 1$, so $\sum\langle\sigma_i^2\rangle = 3$. For a pure state the Bloch vector $\langle\vec\sigma\rangle$ has length 1, so $\sum\langle\sigma_i\rangle^2 = 1$. The sum of variances is $3 - 1 = 2$ in every pure state (and larger for mixed states). Check with $|{\uparrow_z}\rangle$: $\Delta\sigma_z = 0$ but $\Delta\sigma_x = \Delta\sigma_y = 1$.`,
      trap: R`An eigenstate makes one spread vanish, but the other two components then have the largest possible spread.` },
  ],
  gens: [
    { id: 'qcu-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wave-packet spreading',
      make(r) {
        const a = choose(r, [0.05, 0.08, 0.1, 0.2, 0.3, 0.5]), t = choose(r, [0.2, 0.5, 1, 2, 5, 10, 20]);
        const ans = Math.sqrt(a * a + (K_E * t / a) ** 2);
        return { q: R`A free electron starts in an unchirped minimum-uncertainty Gaussian packet with position spread $\Delta x_0 = ${a}$ nm. Its position spread after $t = ${t}$ fs is ______ nm (three decimal places). Use $\hbar/2m_e = 0.05788$ nm$^2$/fs.`,
          answer: round(ans, 3), tol: Math.max(0.002, round(ans * 0.01, 3)), a, t,
          sol: R`With $\Delta p = \hbar/2\Delta x_0$, $\Delta x(t) = \sqrt{\Delta x_0^2 + \left(\dfrac{\hbar t}{2m\Delta x_0}\right)^2}$. Here $\dfrac{\hbar t}{2m\Delta x_0} = \dfrac{0.05788\times${t}}{${a}} = ${round(K_E * t / a, 4)}$ nm, so $\Delta x = \sqrt{${a}^2 + ${round(K_E * t / a, 4)}^2} = ${round(ans, 3)}$ nm. The narrower the start, the faster the spreading.`,
          trap: R`Adding the two widths linearly instead of in quadrature.` };
      },
      verify: (p) => Math.sqrt(p.a ** 2 + (K_E * p.t / p.a) ** 2) },
    { id: 'qcu-r4g2', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Heisenberg equations',
      make(r) {
        const n = choose(r, [2, 3, 4, 5, 6]), c = choose(r, [' \\lambda', ' \\alpha', ' \\kappa', ' g']);
        const xp = (k) => (k === 1 ? '\\hat x' : `\\hat x^{${k}}`);
        const o = mcqOptions(r, `$${n}i\\hbar${c}\\,${xp(n - 1)}$`, [`$-${n}i\\hbar${c}\\,${xp(n - 1)}$`, `$${n}${c}\\,${xp(n - 1)}$`, `$i\\hbar${c}\\,${xp(n)}$`, `$${n - 1 === 1 ? '' : n - 1}i\\hbar${c}\\,${xp(n - 2 || 1)}$`], (s) => s);
        return { q: R`For $H = \dfrac{\hat p^2}{2m} + ${c}\hat x^{${n}}$, the commutator $[H, \hat p]$ equals`, ...o,
          sol: R`The kinetic term commutes with $\hat p$, so $[H, \hat p] = ${c}[\hat x^{${n}}, \hat p] = ${c}\,i\hbar\,\dfrac{d}{dx}x^{${n}} = ${n}i\hbar${c}\,${xp(n - 1)}$. The Heisenberg equation then gives $\dfrac{d\hat p}{dt} = \dfrac{i}{\hbar}[H, \hat p] = -${n}${c}\,${xp(n - 1)} = -V'(\hat x)$, Newton's law for operators.`,
          trap: R`$[\hat p, \hat x^{${n}}]$ has the opposite sign; the order inside the commutator matters.` };
      } },
    { id: 'qcu-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'minimum uncertainty',
      make(r) {
        const s = choose(r, [0.4, 0.5, 0.6, 0.8, 1.25, 1.5, 2, 2.5, 3]);
        const ans = (s * s + 1 / (s * s)) / 4;
        return { q: R`An oscillator ($H = \hat p^2/2m + \tfrac12m\omega^2\hat x^2$) is prepared in a minimum-uncertainty Gaussian centred at $x = 0$ with $\langle p\rangle = 0$, whose position spread is $\Delta x = \Delta x_0/s$ with $\Delta x_0 = \sqrt{\hbar/2m\omega}$ (the ground-state spread) and $s = ${s}$. Its mean energy is ______ $\hbar\omega$ (three decimal places).`,
          answer: round(ans, 3), tol: 0.003, s,
          sol: R`Minimum uncertainty: $\Delta p = \hbar/2\Delta x = s\,\Delta p_0$ with $\Delta p_0 = \sqrt{m\omega\hbar/2}$. Then $\langle T\rangle = \dfrac{\Delta p^2}{2m} = \dfrac{s^2\hbar\omega}{4}$ and $\langle V\rangle = \tfrac12m\omega^2\Delta x^2 = \dfrac{\hbar\omega}{4s^2}$. Sum: $\dfrac{${s}^2 + 1/${s}^2}{4}\hbar\omega = ${round(ans, 3)}\hbar\omega$. It is above $\hbar\omega/2$ unless $s = 1$: squeezing one variable costs energy in the other.`,
          trap: R`Keeping $\Delta p$ at its ground-state value while narrowing $\Delta x$ breaks $\Delta x\Delta p = \hbar/2$.` };
      },
      verify: (p) => (p.s ** 2 + 1 / p.s ** 2) / 4 },
  ],
};
