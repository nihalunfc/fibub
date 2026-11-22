// Round 4 extras for harmonic-oscillator: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const KB_MEV = 0.08617333; // Boltzmann constant in meV/K
const half = (v) => (Number.isInteger(v) ? `${v}` : `\\tfrac{${2 * v}}{2}`);

export default {
  items: [
    { id: 'qho-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'ground state',
      q: R`A particle in a harmonic well has level spacing $\hbar\omega = 0.20$ eV. Its lowest possible energy, measured from the bottom of the well, is`,
      options: [R`0.20 eV`, R`0 eV`, R`0.10 eV`, R`0.30 eV`], answer: 2,
      sol: R`$E_n = (n + \tfrac12)\hbar\omega$, so $E_0 = \tfrac12\hbar\omega = 0.10$ eV. The particle cannot sit still at the bottom: that would make both $\Delta x$ and $\Delta p$ zero. 0.30 eV is the first excited level.`,
      trap: R`The classical answer (at rest at the bottom, zero energy) ignores the uncertainty principle.` },
    { id: 'qho-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'length scale',
      q: R`A quantum oscillator keeps the same spring constant $k$ but its mass is made four times larger. Its energy level spacing`,
      options: [R`is multiplied by 4`, R`is halved`, R`is unchanged`, R`is divided by 4`], answer: 1,
      sol: R`The spacing is $\hbar\omega$ with $\omega = \sqrt{k/m}$. Four times the mass gives $\omega/2$, so the spacing halves. This is why isotopes have different vibrational spectra: heavier atoms on the same chemical "spring" vibrate more slowly.`,
      trap: R`Forgetting the square root in $\omega = \sqrt{k/m}$ gives a factor of 4.` },
    { id: 'qho-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      q: R`The matrix element $\langle 4|\hat x^2|2\rangle = k\,\dfrac{\hbar}{2m\omega}$. The value of $k$ is ______ (three decimal places).`,
      answer: 3.464, tol: 0.005, calc: () => Math.sqrt(12),
      sol: R`$\hat x^2 = \dfrac{\hbar}{2m\omega}(a + a^\dagger)^2 = \dfrac{\hbar}{2m\omega}(a^2 + aa^\dagger + a^\dagger a + a^{\dagger2})$. Only $a^{\dagger2}$ takes $|2\rangle$ to $|4\rangle$: $a^{\dagger2}|2\rangle = \sqrt3\sqrt4\,|4\rangle$. So $k = \sqrt{12} = 3.464$.`,
      trap: R`Using $\sqrt{2\cdot3}$ (the factors for going from 1 to 3) instead of $\sqrt{3\cdot4}$.` },
    { id: 'qho-r4-04', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'classical limit',
      q: R`A classical oscillator has the same energy as the quantum level $E_n = (n + \tfrac12)\hbar\omega$. With $x_0 = \sqrt{\hbar/m\omega}$, its turning points are at`,
      options: [R`$\pm x_0\sqrt{2n + 1}$`, R`$\pm x_0\sqrt{n}$`, R`$\pm x_0(n + \tfrac12)$`, R`$\pm x_0\sqrt{2n}$`], answer: 0,
      sol: R`At a turning point all the energy is potential: $\tfrac12m\omega^2x_t^2 = (n + \tfrac12)\hbar\omega$, so $x_t^2 = \dfrac{(2n + 1)\hbar}{m\omega}$ and $x_t = \pm x_0\sqrt{2n + 1}$. For the ground state this is $\pm x_0$; the quantum wavefunction leaks a little beyond it.`,
      trap: R`Dropping the zero-point $\tfrac12$ gives $\sqrt{2n}$, which would put the ground state's turning points at zero.` },
    { id: 'qho-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'ladder operators',
      q: R`With $\hat N = a^\dagger a$ and $H = \hbar\omega(\hat N + \tfrac12)$, which operators $O$ satisfy $[H, O] = \hbar\omega\,O$, so that $O|n\rangle$ (when not zero) has energy exactly $\hbar\omega$ higher?`,
      options: [R`$a^\dagger$`, R`$a^\dagger\hat N$`, R`$a\,(a^\dagger)^2$`, R`$(a^\dagger)^2$`], answer: [0, 1, 2],
      sol: R`Use $[\hat N, a^\dagger] = a^\dagger$ and $[\hat N, a] = -a$; each $a^\dagger$ adds 1 and each $a$ subtracts 1, while $\hat N$ adds nothing. $a^\dagger$: $+1$. $a^\dagger\hat N$: $+1$. $a(a^\dagger)^2$: $-1 + 2 = +1$. $(a^\dagger)^2$: $+2$, so $[H, (a^\dagger)^2] = 2\hbar\omega(a^\dagger)^2$ and it raises the energy by $2\hbar\omega$.`,
      trap: R`Thinking only $a^\dagger$ itself can raise by one quantum; any product with one more $a^\dagger$ than $a$ does.` },
    { id: 'qho-r4-06', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'eigenfunctions',
      q: R`With $\xi = x\sqrt{m\omega/\hbar}$ and $\psi_n \propto H_n(\xi)e^{-\xi^2/2}$, the physicists' Hermite polynomial $H_3(\xi)$ is`,
      options: [R`$8\xi^3 + 12\xi$`, R`$4\xi^2 - 2$`, R`$2\xi^3 - 3\xi$`, R`$8\xi^3 - 12\xi$`], answer: 3,
      sol: R`Use the recurrence $H_{n+1} = 2\xi H_n - 2nH_{n-1}$ with $H_0 = 1$, $H_1 = 2\xi$: $H_2 = 4\xi^2 - 2$, then $H_3 = 2\xi(4\xi^2 - 2) - 4(2\xi) = 8\xi^3 - 12\xi$. It is odd and has three zeros ($\xi = 0, \pm\sqrt{3/2}$), as the state $n = 3$ must.`,
      trap: R`$4\xi^2 - 2$ is $H_2$; also the sign of the linear term matters (it fixes the outer nodes).` },
    { id: 'qho-r4-07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'molecular vibrations',
      q: R`The H$_2$ molecule has a vibrational quantum $\hbar\omega = 0.546$ eV. D$_2$ has the same chemical bond (same spring constant) but twice the reduced mass. The zero-point vibrational energy of D$_2$ is ______ eV (three decimal places).`,
      answer: 0.193, tol: 0.002, unit: 'eV', calc: () => 0.546 / 2 / Math.SQRT2,
      sol: R`$\omega = \sqrt{k/\mu}$, so doubling $\mu$ divides $\omega$ by $\sqrt2$: $\hbar\omega_{D_2} = 0.546/1.414 = 0.386$ eV. The zero-point energy is half of this: $0.193$ eV. (D$_2$ sits lower in the same well, so it is slightly more tightly bound than H$_2$.)`,
      trap: R`Answering $\hbar\omega$ instead of $\tfrac12\hbar\omega$, or halving $\omega$ instead of dividing by $\sqrt2$.` },
    { id: 'qho-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'thermal states',
      q: R`An oscillator is in thermal equilibrium at a temperature where $kT = \hbar\omega$. Its mean number of quanta $\langle n\rangle$ is ______ (three decimal places).`,
      answer: 0.582, tol: 0.002, calc: () => 1 / (Math.E - 1),
      sol: R`The probability of level $n$ is $(1 - e^{-x})e^{-nx}$ with $x = \hbar\omega/kT$. Summing $n$ times this geometric series gives $\langle n\rangle = \dfrac{1}{e^x - 1}$. With $x = 1$: $1/(2.718 - 1) = 0.582$. The mean energy is $(\langle n\rangle + \tfrac12)\hbar\omega = 1.082\hbar\omega$, a bit above the classical $kT$.`,
      trap: R`Using the classical result $kT/\hbar\omega = 1$ ignores that quanta are not fully excited at this temperature.` },
    { id: 'qho-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coherent states',
      q: R`An oscillator is in a coherent state with mean energy $\langle H\rangle = 10.5\,\hbar\omega$. Its energy spread $\Delta E$ is ______ $\hbar\omega$ (three decimal places).`,
      answer: 3.162, tol: 0.005, calc: () => Math.sqrt(10),
      sol: R`$\langle H\rangle = \hbar\omega(|\alpha|^2 + \tfrac12)$, so $|\alpha|^2 = 10$. The number of quanta is Poisson distributed with mean and variance $|\alpha|^2$, so $\Delta N = |\alpha| = \sqrt{10}$. Since $H = \hbar\omega(\hat N + \tfrac12)$, $\Delta E = \hbar\omega\Delta N = 3.162\hbar\omega$. The relative spread $\sqrt{10}/10.5$ shrinks for larger amplitudes.`,
      trap: R`Taking $\Delta N = |\alpha|^2$ (the mean) instead of its square root.` },
    { id: 'qho-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'eigenfunctions',
      q: R`With $p_0 = \sqrt{m\hbar\omega}$, the momentum-space eigenfunction $\phi_n(p) = \langle p|n\rangle$ of the oscillator is proportional to`,
      options: [R`$e^{-p^2/2p_0^2}$ for every $n$`, R`$(-i)^nH_n(p/p_0)\,e^{-p^2/2p_0^2}$`, R`$H_n(p/p_0)\,e^{+p^2/2p_0^2}$`, R`$H_{n+1}(p/p_0)\,e^{-p^2/2p_0^2}$`], answer: 1,
      sol: R`In the scaled variables $\xi = x/x_0$ and $\pi = p/p_0$ (with $x_0p_0 = \hbar$), $H = \tfrac12\hbar\omega(\xi^2 + \pi^2)$ is symmetric between position and momentum, so $\phi_n$ has the same shape as $\psi_n$. The Fourier transform of $H_n(\xi)e^{-\xi^2/2}$ is $(-i)^nH_n(\pi)e^{-\pi^2/2}$: the Hermite functions are eigenfunctions of the Fourier transform with eigenvalues $(-i)^n$. So $|\phi_n|^2$ looks exactly like $|\psi_n|^2$ with $x \to p/m\omega$.`,
      trap: R`Thinking every state is a Gaussian in momentum; only the ground state is.` },
    { id: 'qho-r4-11', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'time evolution',
      q: R`An arbitrary state $\psi(x, 0)$ evolves in the oscillator, with period $T = 2\pi/\omega$. Which statements are correct?`,
      options: [R`$\langle x\rangle(T/4) = \langle p\rangle(0)/m\omega$`, R`At $T/4$ the position distribution has the shape of the initial momentum distribution, with $x = p/m\omega$`, R`At $T/2$ the wavefunction equals $\psi(x, 0)$ up to a global phase`, R`After one period $T$ every state returns to $-\psi(x, 0)$`], answer: [0, 1, 3],
      sol: R`Heisenberg picture: $\hat x(t) = \hat x\cos\omega t + \dfrac{\hat p}{m\omega}\sin\omega t$, so at $\omega t = \pi/2$, $\hat x = \hat p(0)/m\omega$: every moment of $x$ at $T/4$ equals the matching moment of $p/m\omega$ at $0$, so the first two statements hold. At $T/2$, $\hat x \to -\hat x(0)$: each $|n\rangle$ picks up $e^{-i\pi(n + 1/2)} = (-1)^ne^{-i\pi/2}$, and $(-1)^n$ is the parity, so $\psi \to e^{-i\pi/2}\psi(-x, 0)$, a mirror image, not the original. After $T$, each $|n\rangle$ gets $e^{-2\pi i(n + 1/2)} = -1$, a common phase.`,
      trap: R`The zero-point $\tfrac12$ makes the full-period phase $-1$ rather than $+1$, and at half a period the state is reflected, not restored.` },
    { id: 'qho-r4-12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'matrix elements',
      q: R`In the oscillator eigenstate $|n\rangle$, the expectation value $\langle\hat x\hat p + \hat p\hat x\rangle$ equals`,
      options: [R`$(2n + 1)\hbar$`, R`$i\hbar$`, R`$\hbar$`, R`$0$`], answer: 3,
      sol: R`With $\hat x = \sqrt{\hbar/2m\omega}(a + a^\dagger)$ and $\hat p = i\sqrt{m\hbar\omega/2}(a^\dagger - a)$, one finds $\hat x\hat p + \hat p\hat x = i\hbar(a^{\dagger2} - a^2)$, which only connects $n$ to $n \pm 2$; its diagonal element is $0$. Check: $\dfrac{d\langle x^2\rangle}{dt} = \dfrac{\langle xp + px\rangle}{m}$ must vanish in a stationary state.`,
      trap: R`$\langle\hat x\hat p\rangle = i\hbar/2$ alone is not zero; it is the symmetric combination that vanishes.` },
  ],
  gens: [
    { id: 'qho-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermal states',
      make(r) {
        const T = choose(r, [20, 50, 77, 100, 150, 200, 300, 500]), f = choose(r, [0.3, 0.5, 0.8, 1, 1.5, 2, 3]);
        const hw = round(f * KB_MEV * T, 1), x = hw / (KB_MEV * T), ans = 1 / (Math.exp(x) - 1);
        return { q: R`A vibrational mode with $\hbar\omega = ${hw}$ meV is in equilibrium at $T = ${T}$ K. Its mean number of quanta $\langle n\rangle$ is ______ (three decimal places). Use $k = 0.08617$ meV/K.`,
          answer: round(ans, 3), tol: Math.max(0.002, round(ans * 0.01, 3)), hw, T,
          sol: R`$x = \hbar\omega/kT = ${hw}/(0.08617\times${T}) = ${round(x, 3)}$. The Bose-Einstein (Planck) occupation is $\langle n\rangle = 1/(e^x - 1) = ${round(ans, 3)}$. When $x \ll 1$ this tends to $kT/\hbar\omega$ (classical), and when $x \gg 1$ to $e^{-x}$ (frozen out).`,
          trap: R`Using the Boltzmann factor $e^{-x}$ alone ignores the multiple occupation of the mode.` };
      },
      verify: (p) => 1 / (Math.exp(p.hw / (KB_MEV * p.T)) - 1) },
    { id: 'qho-r4g2', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      make(r) {
        const n = int(r, 0, 8);
        let kind = choose(r, ['diag', 'up', 'down']);
        if (kind === 'down' && n < 2) kind = 'up';
        const m = kind === 'diag' ? n : kind === 'up' ? n + 2 : n - 2;
        const ans = kind === 'diag' ? 2 * n + 1 : kind === 'up' ? Math.sqrt((n + 1) * (n + 2)) : Math.sqrt(n * (n - 1));
        const how = kind === 'diag' ? R`only $aa^\dagger + a^\dagger a = 2\hat N + 1$ is diagonal, giving $2(${n}) + 1 = ${ans}$` : kind === 'up' ? R`only $a^{\dagger2}$ raises by two: $a^{\dagger2}|${n}\rangle = \sqrt{${n + 1}\cdot${n + 2}}\,|${m}\rangle$, so $k = ${round(ans, 3)}$` : R`only $a^2$ lowers by two: $a^2|${n}\rangle = \sqrt{${n}\cdot${n - 1}}\,|${m}\rangle$, so $k = ${round(ans, 3)}$`;
        return { q: R`For the oscillator, $\langle ${m}|\hat x^2|${n}\rangle = k\,\dfrac{\hbar}{2m\omega}$. The value of $k$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.005, n, kind,
          sol: R`$\hat x^2 = \dfrac{\hbar}{2m\omega}(a^2 + aa^\dagger + a^\dagger a + a^{\dagger2})$. Between $|${n}\rangle$ and $\langle${m}|$, ${how}$.`,
          trap: R`$\hat x^2$ connects $n$ only to $n$ and $n \pm 2$; the ladder factors are square roots of the larger quantum numbers.` };
      },
      verify: (p) => (p.kind === 'diag' ? 2 * p.n + 1 : p.kind === 'up' ? Math.sqrt((p.n + 1) * (p.n + 2)) : Math.sqrt(p.n * (p.n - 1))) },
    { id: 'qho-r4g3', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'half oscillator',
      make(r) {
        const k = int(r, 1, 6);
        const ord = ['lowest', 'second', 'third', 'fourth', 'fifth', 'sixth'][k - 1];
        const o = mcqOptions(r, 2 * k - 0.5, [k - 0.5, 2 * k + 0.5, 2 * k - 1.5, 2 * k + 1.5], (v) => `$${half(v)}\\,\\hbar\\omega$`);
        return { q: R`A particle moves in $V = \tfrac12m\omega^2x^2$ for $x > 0$ with an impenetrable wall at $x = 0$. The energy of its ${ord} level is`, ...o,
          sol: R`The wall forces $\psi(0) = 0$. For $x > 0$ the Schrödinger equation is that of the full oscillator, so the allowed states are the odd full-oscillator states $n = 1, 3, 5, \dots$ with $E = (n + \tfrac12)\hbar\omega$. The ${ord} level has $n = ${2 * k - 1}$: $E = ${half(2 * k - 0.5)}\,\hbar\omega$. The levels are spaced by $2\hbar\omega$.`,
          trap: R`Keeping the even states (which do not vanish at the wall) gives the full-oscillator ladder.` };
      } },
  ],
};
