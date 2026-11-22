// Round 5 extras for harmonic-oscillator: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

// Mean number of quanta in the even (s = 1) or odd (s = -1) cat state built from |alpha|^2 = n.
const catN = (n, s) => n * (1 - s * Math.exp(-2 * n)) / (1 + s * Math.exp(-2 * n));

export default {
  items: [
    { id: 'qho-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'oscillator spectra',
      q: R`For a quantum harmonic oscillator, the ratio $E_3/E_1$ of the energies of the states $n = 3$ and $n = 1$ ($n = 0$ is the ground state) is ______ (three decimal places).`,
      answer: 2.333, tol: 0.002, calc: () => 3.5 / 1.5,
      sol: R`$E_n = (n + \tfrac12)\hbar\omega$, so $E_3/E_1 = \dfrac{3.5}{1.5} = \dfrac73 = 2.333$.`,
      trap: R`Answering 3 by forgetting the zero-point $\tfrac12\hbar\omega$, or 9 by using the box-like $n^2$ rule.` },
    { id: 'qho-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'turning points',
      q: R`With $x_0 = \sqrt{\hbar/m\omega}$, the classical turning points of an oscillator with the energy of the state $n = 2$ are at`,
      options: [R`$x = \pm x_0$`, R`$x = \pm\sqrt2\,x_0$`, R`$x = \pm\sqrt5\,x_0$`, R`$x = \pm5x_0$`], answer: 2,
      sol: R`At a turning point all the energy is potential: $\tfrac12m\omega^2x^2 = (n + \tfrac12)\hbar\omega$, so $x^2 = (2n + 1)\dfrac{\hbar}{m\omega}$ and $x = \pm\sqrt{2n + 1}\,x_0$. For $n = 2$: $\pm\sqrt5\,x_0$. The wavefunction leaks beyond these points into the forbidden region.`,
      trap: R`Dropping the zero-point term gives $\pm2x_0$; forgetting the square root gives $\pm5x_0$.` },
    { id: 'qho-r5-03', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'virial theorem',
      q: R`In the oscillator eigenstate $|n\rangle$, the mean potential energy $\langle V\rangle$ equals`,
      options: [R`$(n + \tfrac12)\hbar\omega$`, R`$\tfrac12(n + \tfrac12)\hbar\omega$`, R`$0$, since $\langle x\rangle = 0$`, R`$\tfrac12n\hbar\omega$`], answer: 1,
      sol: R`For $V \propto x^2$ the virial theorem gives $\langle T\rangle = \langle V\rangle$ in every stationary state, so each is half the energy: $\langle V\rangle = \tfrac12(n + \tfrac12)\hbar\omega$. Direct check: $\langle x^2\rangle = (2n + 1)\dfrac{\hbar}{2m\omega}$, so $\tfrac12m\omega^2\langle x^2\rangle = \tfrac12(n + \tfrac12)\hbar\omega$.`,
      trap: R`Using $\langle x\rangle^2$ instead of $\langle x^2\rangle$; the potential depends on $x^2$, whose mean is not zero.` },
    { id: 'qho-r5-04', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ladder operators',
      q: R`With $\xi = x\sqrt{m\omega/\hbar}$, the raising operator $a^\dagger$ acts on wavefunctions $\psi(\xi)$ as`,
      options: [R`$\dfrac{1}{\sqrt2}\left(\xi + \dfrac{d}{d\xi}\right)$`, R`$\xi\,\dfrac{d}{d\xi}$`, R`$\sqrt2\,\xi$`, R`$\dfrac{1}{\sqrt2}\left(\xi - \dfrac{d}{d\xi}\right)$`], answer: 3,
      sol: R`$a = \sqrt{\dfrac{m\omega}{2\hbar}}\left(\hat x + \dfrac{i\hat p}{m\omega}\right)$ with $\hat p = -i\hbar\,d/dx$ becomes $a = \dfrac{1}{\sqrt2}\left(\xi + \dfrac{d}{d\xi}\right)$, and its adjoint flips the sign of the derivative: $a^\dagger = \dfrac{1}{\sqrt2}\left(\xi - \dfrac{d}{d\xi}\right)$. Check: on $e^{-\xi^2/2}$ it gives $\sqrt2\,\xi e^{-\xi^2/2}$, the shape of $\psi_1$, while $a$ gives zero.`,
      trap: R`Mixing up the two signs; $a$ must annihilate the Gaussian, which needs the plus sign.` },
    { id: 'qho-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'eigenfunctions',
      q: R`With $\psi_2 \propto (2\xi^2 - 1)e^{-\xi^2/2}$, the highest peaks of the probability density $|\psi_2|^2$ are at`,
      options: [R`$\xi = \pm\sqrt{5/2}$, inside the turning points $\pm\sqrt5$`, R`$\xi = 0$`, R`$\xi = \pm1/\sqrt2$, the nodes`, R`$\xi = \pm\sqrt5$, exactly at the turning points`], answer: 0,
      sol: R`$\dfrac{d}{d\xi}\left[(2\xi^2 - 1)^2e^{-\xi^2}\right] = 2\xi(2\xi^2 - 1)(5 - 2\xi^2)e^{-\xi^2}$. Stationary points: $\xi = 0$ (density $1$), the nodes $\xi = \pm1/\sqrt2$ (density $0$) and $\xi = \pm\sqrt{5/2}$ (density $16e^{-5/2} = 1.31$). So the outer peaks are highest, sitting inside the classical turning points $\pm\sqrt5$: the quantum density already leans towards where a classical particle moves slowest.`,
      trap: R`Expecting the peak exactly at the turning point (the classical density diverges there); the quantum peak is smoothed and pulled inward.` },
    { id: 'qho-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '2D and 3D oscillators',
      q: R`For an isotropic three-dimensional oscillator, the lowest energy of a state with orbital quantum number $l = 3$ is $k\hbar\omega$, with $k =$ ______.`,
      answer: 4.5, tol: 0,
      sol: R`In spherical coordinates the levels are $E = (2n_r + l + \tfrac32)\hbar\omega$ with $n_r = 0, 1, 2, \dots$ ; equivalently the level $N = n_x + n_y + n_z$ holds $l = N, N - 2, \dots$ The lowest state with $l = 3$ has $n_r = 0$: $E = (3 + \tfrac32)\hbar\omega = 4.5\hbar\omega$, in the level $N = 3$.`,
      trap: R`Using hydrogen-like counting ($n > l$), which would put $l = 3$ in a higher level.` },
    { id: 'qho-r5-07', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'coherent states',
      q: R`Which of these (unnormalised) states are eigenstates of $a^2$, the square of the lowering operator? $|\alpha\rangle$ is a coherent state with $\alpha \ne 0$.`,
      options: [R`$|\alpha\rangle$`, R`$|\alpha\rangle + |-\alpha\rangle$`, R`$|\alpha\rangle - |-\alpha\rangle$`, R`$|2\rangle$`], answer: [0, 1, 2],
      sol: R`$a|\alpha\rangle = \alpha|\alpha\rangle$, so $a^2|\alpha\rangle = \alpha^2|\alpha\rangle$ and $a^2|-\alpha\rangle = \alpha^2|-\alpha\rangle$ with the same eigenvalue. Any combination of the two is therefore an eigenstate of $a^2$ with eigenvalue $\alpha^2$: these are the even and odd "cat" states, which contain only even or only odd numbers of quanta. $a^2|2\rangle = \sqrt2|0\rangle$, not a multiple of $|2\rangle$.`,
      trap: R`Thinking the cat states fail because they are not eigenstates of $a$; $a$ swaps even and odd cats, but $a^2$ keeps each.` },
    { id: 'qho-r5-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'coherent states',
      q: R`An oscillator is in the normalised even cat state $\propto |\alpha\rangle + |-\alpha\rangle$ with $\alpha = 1$. Its mean number of quanta $\langle N\rangle$ is ______ (three decimal places).`,
      answer: 0.762, tol: 0.002, calc: () => catN(1, 1),
      sol: R`Norm: $\langle\alpha|-\alpha\rangle = e^{-2|\alpha|^2}$, so $\|\,|\alpha\rangle + |-\alpha\rangle\|^2 = 2(1 + e^{-2|\alpha|^2})$. Next $a(|\alpha\rangle + |-\alpha\rangle) = \alpha(|\alpha\rangle - |-\alpha\rangle)$, with norm squared $2|\alpha|^2(1 - e^{-2|\alpha|^2})$. So $\langle N\rangle = \dfrac{|\alpha|^2(1 - e^{-2|\alpha|^2})}{1 + e^{-2|\alpha|^2}} = |\alpha|^2\tanh|\alpha|^2 = \tanh1 = 0.762$. It is less than the coherent-state value 1 because the odd numbers of quanta have been removed.`,
      trap: R`Assuming the cat has the same $\langle N\rangle = |\alpha|^2$ as its parts; the interference term changes the weights.` },
    { id: 'qho-r5-09', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'identical particles',
      q: R`Two identical spinless particles are placed in a one-dimensional oscillator with total energy $3\hbar\omega$ (no interaction). Which statements are correct?`,
      options: [R`If they are bosons, there are 2 such states`, R`If they are fermions, there is 1 such state`, R`If they were distinguishable, there would be 3 such states`, R`The lowest total energy for two such fermions is $\hbar\omega$`], answer: [0, 1, 2],
      sol: R`$E = (n_1 + n_2 + 1)\hbar\omega = 3\hbar\omega$ needs $n_1 + n_2 = 2$: $(0, 2), (1, 1), (2, 0)$, three states if distinguishable. Bosons need symmetric states: $(0, 2) + (2, 0)$ and $(1, 1)$, two states. Spinless fermions need antisymmetric states with different $n$: only $(0, 2) - (2, 0)$. The fermion ground state puts them in $n = 0$ and $n = 1$: $\tfrac12 + \tfrac32 = 2\hbar\omega$.`,
      trap: R`Allowing two spinless fermions to share $n = 1$; without spin there is no second slot.` },
    { id: 'qho-r5-10', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'matrix elements',
      q: R`In the oscillator ground state, $\langle x^4\rangle = k\left(\dfrac{\hbar}{2m\omega}\right)^2$ with $k =$ ______.`,
      answer: 3, tol: 0,
      sol: R`The ground state is a Gaussian with variance $\sigma^2 = \langle x^2\rangle = \hbar/2m\omega$, and for any zero-mean Gaussian $\langle x^4\rangle = 3\sigma^4$. With ladder operators: $x = \sqrt{\hbar/2m\omega}(a + a^\dagger)$ and $\langle0|(a + a^\dagger)^4|0\rangle = 3$ (the paths $aa^\dagger aa^\dagger$, $aaa^\dagger a^\dagger$ contribute $1$ and $2$). So $k = 3$.`,
      trap: R`Squaring $\langle x^2\rangle$ to get $k = 1$; the fourth moment is not the square of the second.` },
  ],
  gens: [
    { id: 'qho-r5g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coherent states',
      make(r) {
        const n = choose(r, [0.25, 0.5, 2, 3, 4]), s = choose(r, [1, -1]);
        const N = catN(n, s);
        return { q: R`An oscillator is in the normalised ${s > 0 ? 'even' : 'odd'} cat state $\propto |\alpha\rangle ${s > 0 ? '+' : '-'} |-\alpha\rangle$ with $|\alpha|^2 = ${n}$. Its mean number of quanta $\langle N\rangle$ is ______ (three decimal places).`,
          answer: round(N, 3), tol: Math.max(0.002, round(N * 0.005, 3)), n, s,
          sol: R`With $\langle\alpha|-\alpha\rangle = e^{-2|\alpha|^2}$: the norm squared is $2(1 ${s > 0 ? '+' : '-'} e^{-2|\alpha|^2})$, and $a$ turns the state into $\alpha(|\alpha\rangle ${s > 0 ? '-' : '+'} |-\alpha\rangle)$ with norm squared $2|\alpha|^2(1 ${s > 0 ? '-' : '+'} e^{-2|\alpha|^2})$. So $\langle N\rangle = |\alpha|^2\,${s > 0 ? R`\tanh` : R`\coth`}|\alpha|^2 = ${n}\times${round(N / n, 4)} = ${round(N, 3)}$. ${s > 0 ? 'Removing the odd numbers lowers the mean' : 'Removing the even numbers (including zero) raises the mean'} below or above $|\alpha|^2$; for large $|\alpha|^2$ both approach it.`,
          trap: R`Taking $\langle N\rangle = |\alpha|^2$ as for a coherent state.` };
      },
      verify: (p) => catN(p.n, p.s) },
    { id: 'qho-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'identical particles',
      make(r) {
        const N = int(r, 3, 9), kind = choose(r, ['bosons', 'fermions', 'distinguishable']);
        const cnt = kind === 'bosons' ? Math.floor(N / 2) + 1 : kind === 'fermions' ? Math.floor((N + 1) / 2) : N + 1;
        const who = kind === 'distinguishable' ? 'two distinguishable particles' : `two identical spinless ${kind}`;
        return { q: R`Consider ${who} in the same one-dimensional oscillator, with no interaction. How many independent states have total energy $${N + 1}\hbar\omega$?`,
          answer: cnt, tol: 0, N, kind,
          sol: R`$E = (n_1 + n_2 + 1)\hbar\omega$, so $n_1 + n_2 = ${N}$, which has $${N + 1}$ ordered solutions. ${kind === 'bosons' ? `Bosons need symmetric states: each unordered pair counts once, including equal $n$ when $${N}$ is even: $\\lfloor ${N}/2\\rfloor + 1 = ${cnt}$.` : kind === 'fermions' ? `Spinless fermions need antisymmetric states, so $n_1 \\ne n_2$ and each unordered pair counts once: $${cnt}$.` : `Distinguishable particles: every ordered pair is a separate state, $${cnt}$.`}`,
          trap: R`Counting ordered pairs for identical particles, or allowing two spinless fermions in the same level.` };
      },
      verify: (p) => (p.kind === 'bosons' ? Math.floor(p.N / 2) + 1 : p.kind === 'fermions' ? Math.floor((p.N + 1) / 2) : p.N + 1) },
    { id: 'qho-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'superposition states',
      make(r) {
        const c = choose(r, [0.5, 1, 1.5, 2, 3, -1, -2]);
        const P1 = (c * c / 2) / (1 + c * c / 2), E = 0.5 + P1;
        return { q: R`An oscillator has $\psi \propto (1 ${c < 0 ? '-' : '+'} ${Math.abs(c)}\xi)\,e^{-\xi^2/2}$ with $\xi = x\sqrt{m\omega/\hbar}$. Its mean energy is ______ $\hbar\omega$ (three decimal places).`,
          answer: round(E, 3), tol: 0.002, c,
          sol: R`$\psi_0 = \pi^{-1/4}e^{-\xi^2/2}$ and $\psi_1 = \pi^{-1/4}\sqrt2\,\xi e^{-\xi^2/2}$, so $\psi \propto \psi_0 + \dfrac{${c}}{\sqrt2}\psi_1$. Weights: $1$ and $${round(c * c / 2, 4)}$, so $P_1 = \dfrac{${round(c * c / 2, 4)}}{1 + ${round(c * c / 2, 4)}} = ${round(P1, 4)}$. Then $\langle E\rangle = \tfrac12\hbar\omega + P_1\hbar\omega = ${round(E, 3)}\hbar\omega$. The sign of the coefficient shifts the packet left or right but does not change the energy.`,
          trap: R`Reading the coefficient ${Math.abs(c)} directly as the amplitude of $\psi_1$; $\xi e^{-\xi^2/2}$ is $\psi_1/\sqrt2$, not $\psi_1$.` };
      },
      verify: (p) => 0.5 + (p.c * p.c / 2) / (1 + p.c * p.c / 2) },
  ],
};
