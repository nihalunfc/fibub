// Round 5 extras for perturbation-theory: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const E = 1.602176634e-19, ME = 9.1093837015e-31, A0 = 5.29177210903e-11;

// Diamagnetic shift of hydrogen 1s, e^2 B^2 a0^2 / 4m, in neV.
const dia = (B) => (E * E * B * B * A0 * A0 / (4 * ME)) / E * 1e9;
// Hydrogen <r> and <r^2> in units of a0 and a0^2.
const rMean = (n, l) => (3 * n * n - l * (l + 1)) / 2;
const r2Mean = (n, l) => (n * n / 2) * (5 * n * n + 1 - 3 * l * (l + 1));

export default {
  items: [
    { id: 'qpt-r5-01', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'second order',
      q: R`A perturbation is proportional to the unperturbed Hamiltonian, $H' = cH_0$ with small $c$. For a non-degenerate level $E_n^{(0)}$, the second-order energy correction is`,
      options: [R`$c^2E_n^{(0)}$`, R`$-c^2E_n^{(0)}$`, R`$0$`, R`$c^2E_n^{(0)}/2$`], answer: 2,
      sol: R`$H'_{mn} = c\langle m|H_0|n\rangle = cE_n^{(0)}\delta_{mn}$, so every off-diagonal element vanishes and $E_n^{(2)} = \sum_{m\ne n}\dfrac{|H'_{mn}|^2}{E_n^{(0)} - E_m^{(0)}} = 0$. Indeed the exact answer is $(1 + c)E_n^{(0)}$, already given in full by first order ($cE_n^{(0)}$).`,
      trap: R`Expecting every perturbation to have a second-order part; it vanishes when $H'$ is diagonal in the unperturbed basis.` },
    { id: 'qpt-r5-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'hydrogen',
      q: R`Hydrogen in its ground state ($1s$) feels a weak extra potential $H' = \lambda r$. The first-order energy shift is $k\lambda a_0$ with $k =$ ______.`,
      answer: 1.5, tol: 0.01, calc: () => rMean(1, 0),
      sol: R`$E^{(1)} = \lambda\langle r\rangle_{1s}$. With $|\psi|^2 = \dfrac{e^{-2r/a_0}}{\pi a_0^3}$: $\langle r\rangle = \dfrac{4}{a_0^3}\int_0^\infty r^3e^{-2r/a_0}dr = \dfrac{4}{a_0^3}\cdot\dfrac{3!}{(2/a_0)^4} = \dfrac32a_0$. So $k = 1.5$.`,
      trap: R`Using the most probable radius $a_0$ instead of the mean radius $1.5a_0$.` },
    { id: 'qpt-r5-03', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'infinite well',
      q: R`An infinite well $0 < x < a$ gets a weak step $H' = \epsilon$ for $0 < x < a/2$ and $0$ for $a/2 < x < a$. Which statements are correct?`,
      options: [R`Every level shifts by $\epsilon/2$ at first order`, R`The second-order correction to the ground level is negative`, R`The first-order shift does not depend on $n$`, R`To first order the corrected ground state stays symmetric about $x = a/2$`], answer: [0, 1, 2],
      sol: R`$|\psi_n|^2 = \tfrac2a\sin^2(n\pi x/a)$ is symmetric about the centre, so each half holds probability $\tfrac12$ and $E_n^{(1)} = \epsilon/2$ for all $n$. The ground state's second-order correction is $\sum_m|H'_{m1}|^2/(E_1 - E_m) < 0$ since all denominators are negative and some $H'_{m1} \ne 0$ (for example $H'_{21} \ne 0$). Those nonzero $H'_{m1}$ with even $m$ mix in states that are odd about the centre, so the corrected state leans to the lower-potential half: it is no longer symmetric.`,
      trap: R`Concluding that a perturbation with an $n$-independent first-order shift is "just a constant"; it still mixes states and deforms them.` },
    { id: 'qpt-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      q: R`An isotropic 3D oscillator is in its first excited level (states $|100\rangle, |010\rangle, |001\rangle$). It is perturbed by $H' = \lambda(xy + yz)$. The largest first-order shift is $k\,\dfrac{\lambda\hbar}{2m\omega}$, with $k =$ ______ (three decimal places).`,
      answer: 1.414, tol: 0.002, calc: () => Math.SQRT2,
      sol: R`With $\langle1|x|0\rangle = \sqrt{\hbar/2m\omega}$: $\langle100|xy|010\rangle = \hbar/2m\omega$, $\langle010|yz|001\rangle = \hbar/2m\omega$, and all diagonal elements and $\langle100|H'|001\rangle$ vanish. In units of $\lambda\hbar/2m\omega$ the matrix is $\begin{pmatrix}0&1&0\\1&0&1\\0&1&0\end{pmatrix}$, with eigenvalues $0, \pm\sqrt2$. So the level splits into three, and the largest shift is $\sqrt2 = 1.414$.`,
      trap: R`Adding the two couplings to get 2; the eigenvalues of a three-state chain are $\pm\sqrt2$, not $\pm2$.` },
    { id: 'qpt-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'general theory',
      q: R`For the ground state of $H = H_0 + H'$ (non-degenerate), which statement is NOT correct?`,
      options: [R`The first-order estimate $E_0^{(0)} + H'_{00}$ is always a lower bound on the exact energy`, R`The second-order correction is never positive`, R`The first-order estimate is exact if $|0^{(0)}\rangle$ is also an eigenstate of $H'$`, R`The exact energy is at most $E_0^{(0)} + H'_{00}$`], answer: 0,
      sol: R`$E_0^{(0)} + H'_{00} = \langle0^{(0)}|H|0^{(0)}\rangle$ is the energy of a trial state, and by the variational principle it is an UPPER bound, so the first statement is the incorrect one and the last is correct. In $E_0^{(2)} = \sum_{m\ne0}|H'_{m0}|^2/(E_0^{(0)} - E_m^{(0)})$ every denominator is negative. If $|0^{(0)}\rangle$ is an eigenstate of $H'$ as well, it is an exact eigenstate of $H$, and all higher orders vanish.`,
      trap: R`Mixing up the directions: first-order energy of the ground state overestimates, second order brings it down.` },
    { id: 'qpt-r5-06', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'hydrogen',
      q: R`A hydrogen atom in its ground state is placed in $B = 10$ T. The diamagnetic term $H' = \dfrac{e^2B^2}{8m_e}(x^2 + y^2)$ shifts the $1s$ level by ______ neV (one decimal place). Use $\langle r^2\rangle_{1s} = 3a_0^2$.`,
      answer: 12.3, tol: 0.15, unit: 'neV', calc: () => dia(10),
      sol: R`By symmetry $\langle x^2\rangle = \langle y^2\rangle = \tfrac13\langle r^2\rangle = a_0^2$, so $\langle x^2 + y^2\rangle = 2a_0^2$ and $E^{(1)} = \dfrac{e^2B^2a_0^2}{4m_e}$. Numbers: $\dfrac{(1.602\times10^{-19})^2\times100\times(5.29\times10^{-11})^2}{4\times9.11\times10^{-31}} = 1.97\times10^{-27}$ J $= 1.23\times10^{-8}$ eV $= 12.3$ neV. The $1s$ state has no orbital moment, so this tiny upward shift is the whole first-order effect of the field on the orbit.`,
      trap: R`Using $\langle x^2 + y^2\rangle = \langle r^2\rangle = 3a_0^2$; only two of the three directions count.` },
    { id: 'qpt-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'oscillator',
      q: R`An oscillator $H_0 = \hat p^2/2m + \tfrac12m\omega^2\hat x^2$ is perturbed by $H' = \lambda\hat p$ (constant $\lambda$). The exact shift of every level is`,
      options: [R`$0$, since $\langle n|\hat p|n\rangle = 0$`, R`$-\tfrac12m\lambda^2$`, R`$-\dfrac{\lambda^2}{2m\omega^2}$`, R`$+\tfrac12m\lambda^2$`], answer: 1,
      sol: R`Complete the square: $\dfrac{\hat p^2}{2m} + \lambda\hat p = \dfrac{(\hat p + m\lambda)^2}{2m} - \dfrac{m\lambda^2}{2}$. The shift $\hat p \to \hat p + m\lambda$ is a unitary change (multiplying $\psi$ by $e^{-im\lambda x/\hbar}$) that leaves the spectrum of the oscillator unchanged, so every level moves by $-\tfrac12m\lambda^2$. Perturbation theory agrees: first order is zero, and second order with $|\langle n\pm1|\hat p|n\rangle|^2$ gives exactly $-\tfrac12m\lambda^2$.`,
      trap: R`Stopping at first order (zero), or copying the result for $H' = \lambda x$, which is $-\lambda^2/2m\omega^2$.` },
    { id: 'qpt-r5-08', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'first order',
      q: R`A perturbation $H'(x)$ is zero or positive everywhere. The first-order energy shift of any level is`,
      options: [R`always zero`, R`negative`, R`of either sign, depending on the level`, R`zero or positive`], answer: 3,
      sol: R`$E_n^{(1)} = \int|\psi_n^{(0)}|^2H'(x)\,dx$ is an average of $H'$ weighted by a probability density, which is never negative. So it is zero or positive for every level. (Second-order corrections can still have either sign for excited states.)`,
      trap: R`Confusing first order with the second-order rule "the ground state is always pushed down".` },
    { id: 'qpt-r5-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      q: R`A two-fold degenerate level ($|1\rangle, |2\rangle$) is perturbed with $H'_{11} = H'_{22} = a$ and $H'_{12} = H'_{21} = b$, all real. Which statements are correct?`,
      options: [R`The first-order shifts are $a + b$ and $a - b$`, R`If $b \ne 0$, the correct zeroth-order states are $(|1\rangle \pm |2\rangle)/\sqrt2$`, R`If $b = 0$, any combination of $|1\rangle$ and $|2\rangle$ is a correct zeroth-order state at this order`, R`The shifts depend on which basis of the degenerate level is used to write $H'$`], answer: [0, 1, 2],
      sol: R`Diagonalise $\begin{pmatrix}a&b\\b&a\end{pmatrix}$: eigenvalues $a \pm b$ with eigenvectors $(1, \pm1)/\sqrt2$. If $b = 0$ the matrix is $a$ times the identity, so the degeneracy is not lifted at first order and every combination is allowed (higher orders may pick a basis). Eigenvalues of a matrix do not depend on the basis, so the last statement is false; only the matrix elements do.`,
      trap: R`Taking the diagonal elements $H'_{11}, H'_{22}$ as the shifts without diagonalising.` },
    { id: 'qpt-r5-10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      q: R`Hydrogen's $n = 2$ level feels a weak extra potential $H' = \lambda r$ ($\lambda > 0$). Using $\langle r\rangle_{nl} = \dfrac{a_0}{2}[3n^2 - l(l + 1)]$, the first-order shift of $2s$ minus that of $2p$ is $k\lambda a_0$ with $k =$ ______.`,
      answer: 1, tol: 0, calc: () => rMean(2, 0) - rMean(2, 1),
      sol: R`$\langle r\rangle_{2s} = \dfrac{a_0}{2}(12 - 0) = 6a_0$ and $\langle r\rangle_{2p} = \dfrac{a_0}{2}(12 - 2) = 5a_0$. Since $H'$ is spherically symmetric it is diagonal in $|nlm\rangle$, so no degenerate mixing is needed. The shifts are $6\lambda a_0$ and $5\lambda a_0$: $2s$ is pushed up by $\lambda a_0$ more than $2p$, lifting the $l$-degeneracy of the Coulomb problem.`,
      trap: R`Using the Coulomb degeneracy to argue that $2s$ and $2p$ shift equally; any non-Coulomb central term splits them.` },
  ],
  gens: [
    { id: 'qpt-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      make(r) {
        const n = int(r, 1, 4), l = int(r, 0, n - 1), pw = choose(r, [1, 2]);
        const k = pw === 1 ? rMean(n, l) : r2Mean(n, l);
        const lt = 'spdf'[l];
        return { q: R`Hydrogen in the $${n}${lt}$ state feels a weak perturbation $H' = \lambda r${pw === 2 ? '^2' : ''}$. Using $\langle r\rangle = \dfrac{a_0}{2}[3n^2 - l(l + 1)]$ and $\langle r^2\rangle = \dfrac{a_0^2n^2}{2}[5n^2 + 1 - 3l(l + 1)]$, the first-order shift is $k\lambda a_0${pw === 2 ? '^2' : ''}$ with $k =$ ______.`,
          answer: k, tol: 0.01, n, l, pw,
          sol: R`$E^{(1)} = \lambda\langle r${pw === 2 ? '^2' : ''}\rangle_{${n}${lt}}$ with $n = ${n}$, $l = ${l}$: ${pw === 1 ? `$\\dfrac{3(${n * n}) - ${l * (l + 1)}}{2} = ${k}$` : `$\\dfrac{${n * n}}{2}[5(${n * n}) + 1 - 3(${l * (l + 1)})] = ${k}$`}. The perturbation is central, so it is diagonal in $|nlm\rangle$ and the degenerate states need no mixing.`,
          trap: R`Using the Bohr radius $n^2a_0$ for the average; the mean depends on $l$ too.` };
      },
      verify: (p) => (p.pw === 1 ? rMean(p.n, p.l) : r2Mean(p.n, p.l)) },
    { id: 'qpt-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      make(r) {
        const N = int(r, 2, 6), V = choose(r, [0.5, 1, 2, 3]);
        const s = 2 * V * Math.cos(Math.PI / (N + 1));
        return { q: R`A ${N}-fold degenerate level has states $|1\rangle, \dots, |${N}\rangle$. A perturbation couples only neighbours: $\langle j|H'|j + 1\rangle = \langle j + 1|H'|j\rangle = ${V}$ meV, and all other elements are zero. The largest first-order shift is ______ meV (three decimal places).`,
          answer: round(s, 3), tol: Math.max(0.002, round(s * 0.002, 3)), N, V,
          sol: R`The first-order shifts are the eigenvalues of the $${N}\times${N}$ tridiagonal matrix with $${V}$ next to the diagonal. A chain of $N$ sites has eigenvalues $2V\cos\dfrac{k\pi}{N + 1}$, $k = 1, \dots, N$ (try $c_j = \sin\dfrac{jk\pi}{N + 1}$). The largest is $2\times${V}\cos\dfrac{\pi}{${N + 1}} = ${round(s, 3)}$ meV.`,
          trap: R`Taking $V$ itself, or $2V$ (the infinite-chain limit), as the largest shift.` };
      },
      verify: (p) => 2 * p.V * Math.cos(Math.PI / (p.N + 1)) },
    { id: 'qpt-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'hydrogen',
      make(r) {
        const B = choose(r, [1, 2, 5, 20, 30, 50, 100]);
        const s = dia(B);
        return { q: R`Hydrogen in its $1s$ state is placed in a field $B = ${B}$ T. The diamagnetic term $H' = \dfrac{e^2B^2}{8m_e}(x^2 + y^2)$ shifts the level by ______ neV. Use $\langle r^2\rangle_{1s} = 3a_0^2$.`,
          answer: round(s, s < 1 ? 4 : 2), tol: round(s * 0.01, 4), B,
          sol: R`$\langle x^2 + y^2\rangle = \tfrac23\langle r^2\rangle = 2a_0^2$, so $E^{(1)} = \dfrac{e^2B^2a_0^2}{4m_e}$. With $B = ${B}$ T this is $\dfrac{(1.602\times10^{-19})^2(${B})^2(5.29\times10^{-11})^2}{4\times9.11\times10^{-31}}$ J $= ${round(s, s < 1 ? 4 : 2)}$ neV. It grows as $B^2$: tiny in laboratory fields, large in neutron-star fields.`,
          trap: R`Counting all three directions in $x^2 + y^2$.` };
      },
      verify: (p) => dia(p.B) },
  ],
};
