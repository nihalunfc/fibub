// Round 4 extras for perturbation-theory: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const RY = 13.606;
const IONS = { 2: 'He', 3: 'Li$^{+}$', 4: 'Be$^{2+}$', 5: 'B$^{3+}$', 6: 'C$^{4+}$', 7: 'N$^{5+}$', 8: 'O$^{6+}$' };

export default {
  items: [
    { id: 'qpt-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'first order',
      q: R`A system is perturbed by $H' = V_0$, the same constant everywhere. The first-order shift of level $n$ is`,
      options: [R`zero`, R`different for each level`, R`$V_0$ for every level`, R`$V_0^2$ divided by the level spacing`], answer: 2,
      sol: R`$E_n^{(1)} = \langle n|V_0|n\rangle = V_0\langle n|n\rangle = V_0$. All off-diagonal elements $\langle m|V_0|n\rangle = 0$, so every higher order vanishes: the result is exact. A constant shifts the zero of energy and changes nothing observable.`,
      trap: R`Expecting a second-order term; a constant has no off-diagonal matrix elements.` },
    { id: 'qpt-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'general',
      q: R`Non-degenerate perturbation theory for level $n$ is reliable when`,
      options: [R`$|H'_{mn}| \gg |E_n^{(0)} - E_m^{(0)}|$`, R`$H'$ is diagonal in the unperturbed basis`, R`the perturbation depends on time`, R`$|H'_{mn}| \ll |E_n^{(0)} - E_m^{(0)}|$ for the states $m$ that couple to $n$`], answer: 3,
      sol: R`The first-order mixing coefficient is $H'_{mn}/(E_n^{(0)} - E_m^{(0)})$; the series makes sense only if these are small. When a coupled level is close (or degenerate) the ratio blows up and degenerate perturbation theory, or exact diagonalisation, is needed. A diagonal $H'$ is a special easy case, not a requirement.`,
      trap: R`A small $H'$ in absolute terms is not enough; it must be small compared with the relevant energy gaps.` },
    { id: 'qpt-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'degenerate',
      q: R`Two degenerate states are perturbed by $H'$ with $H'_{11} = H'_{22} = 1$ meV and $H'_{12} = (1 + i\sqrt3)$ meV. The first-order splitting of the level is ______ meV.`,
      answer: 4, tol: 0.01,
      sol: R`Diagonalise $\begin{pmatrix}1 & 1 + i\sqrt3\\ 1 - i\sqrt3 & 1\end{pmatrix}$ meV: $(1 - \lambda)^2 = |1 + i\sqrt3|^2 = 4$, so $\lambda = 1 \pm 2 = 3$ or $-1$ meV. The splitting is $2|H'_{12}| = 4$ meV; the equal diagonal elements just shift both by 1 meV.`,
      trap: R`Using the real part of $H'_{12}$ only (1 meV) gives a splitting of 2 meV.` },
    { id: 'qpt-r4-04', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'helium',
      q: R`Treat the electron-electron repulsion in helium as a perturbation. The unperturbed ground state has both electrons in a $Z = 2$ hydrogen-like $1s$ orbital, and $\langle e^2/4\pi\varepsilon_0r_{12}\rangle = \tfrac58Z\cdot(27.21$ eV$)$. The first-order ground-state energy is ______ eV (one decimal place). Take $1$ Ry $= 13.606$ eV.`,
      answer: -74.8, tol: 0.2, unit: 'eV', calc: () => -8 * RY + 1.25 * 2 * RY,
      sol: R`Unperturbed: $2\times(-Z^2\,\text{Ry}) = -8\times13.606 = -108.8$ eV. First-order correction: $\tfrac58\times2\times27.21 = 34.0$ eV. Total $-74.8$ eV, against the measured $-79.0$ eV. The variational method with a screened charge does better ($-77.5$ eV).`,
      trap: R`Forgetting the factor 2 for two electrons in the unperturbed energy, or using $Z^2$ in the repulsion term (it goes as $Z$).` },
    { id: 'qpt-r4-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hellmann-feynman',
      q: R`Hydrogen's levels are $E_n = -\dfrac{mk^2}{2\hbar^2n^2}$ with $k = e^2/4\pi\varepsilon_0$ appearing in $H$ as $-k/r$. Applying the Hellmann-Feynman theorem with $k$ as the parameter gives, for any state of level $n$,`,
      options: [R`$\langle 1/r\rangle = \dfrac{1}{n^2a_0}$`, R`$\langle 1/r\rangle = \dfrac{1}{na_0}$`, R`$\langle 1/r\rangle = \dfrac{1}{n^3a_0}$`, R`$\langle 1/r\rangle = \dfrac{2}{n^2a_0}$`], answer: 0,
      sol: R`$\dfrac{\partial E_n}{\partial k} = \left\langle\dfrac{\partial H}{\partial k}\right\rangle = -\langle 1/r\rangle$. From the formula, $\dfrac{\partial E_n}{\partial k} = -\dfrac{mk}{\hbar^2n^2}$. So $\langle1/r\rangle = \dfrac{mk}{\hbar^2n^2} = \dfrac{1}{n^2a_0}$ with $a_0 = \hbar^2/mk$. This also gives $\langle V\rangle = 2E_n$, the virial theorem.`,
      trap: R`$\langle 1/r\rangle$ depends only on $n$, not on $l$; $1/(n^3a_0)$ is the pattern of $\langle 1/r^2\rangle$, which does depend on $l$.` },
    { id: 'qpt-r4-06', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'general',
      q: R`In Rayleigh-Schrödinger theory, the state is known correctly through first order in $H'$. Through which order does this fix the energy?`,
      options: [R`first order`, R`third order`, R`second order`, R`all orders`], answer: 1,
      sol: R`Wigner's $2n + 1$ rule: a state correct to order $n$ gives the energy to order $2n + 1$. With $|\psi\rangle = |0\rangle + |1\rangle$ one finds $E^{(3)} = \langle 1|H' - E^{(1)}|1\rangle$, built only from the first-order state. The reason is the same as in the variational principle: the energy is stationary, so an error of order $\lambda^2$ in the state changes it only at order $\lambda^4$.`,
      trap: R`Assuming each order of the energy needs the state at the same order; second order needs only the zeroth-order state, and third order only the first-order state.` },
    { id: 'qpt-r4-07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'second order',
      q: R`Two neutral hydrogen atoms in their ground states are a large distance $R$ apart. Their dipole-dipole interaction first contributes to the energy at`,
      options: [R`first order, varying as $-1/R^3$`, R`first order, varying as $-1/R^6$`, R`second order, varying as $-1/R^6$`, R`second order, varying as $-1/R^3$`], answer: 2,
      sol: R`The dipole-dipole operator falls as $1/R^3$. Its first-order value is zero because $\langle 1s|\vec r|1s\rangle = 0$ (no permanent dipole). At second order its square enters, giving $\propto 1/R^6$, and a second-order ground-state shift is always negative: the attractive van der Waals (London) energy $-C_6/R^6$.`,
      trap: R`Putting the $1/R^3$ dependence of the operator straight into the energy; that needs permanent dipoles.` },
    { id: 'qpt-r4-08', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'infinite well',
      q: R`A particle in an infinite well $0 < x < a$ feels $H' = \epsilon(x - a/2)^2$. The first-order shift of the ground state is $k\,\epsilon a^2$, with $k =$ ______ (four decimal places).`,
      answer: 0.0327, tol: 0.0003, calc: () => 1 / 12 - 1 / (2 * Math.PI ** 2),
      sol: R`$E^{(1)} = \epsilon\langle(x - a/2)^2\rangle = \epsilon(\langle x^2\rangle - a\langle x\rangle + a^2/4)$. For the ground state $\langle x\rangle = a/2$ and $\langle x^2\rangle = a^2\left(\tfrac13 - \tfrac{1}{2\pi^2}\right)$, so $\langle(x - a/2)^2\rangle = a^2\left(\tfrac13 - \tfrac{1}{2\pi^2} - \tfrac14\right) = a^2\left(\tfrac{1}{12} - \tfrac{1}{2\pi^2}\right) = 0.0327a^2$. That is the variance $(\Delta x)^2$.`,
      trap: R`Using the uniform-distribution value $1/12 = 0.0833$; the ground state is concentrated near the centre.` },
    { id: 'qpt-r4-09', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'degenerate',
      q: R`Two degenerate states $|1\rangle, |2\rangle$ at energy $0$ are not coupled directly, but each couples with matrix element $V = 1.0$ meV to a third state $|3\rangle$ at $\Delta = 10$ meV. To second order, the degeneracy is lifted by ______ meV (two decimal places).`,
      answer: 0.2, tol: 0.005, calc: () => 2 * 1 ** 2 / 10,
      sol: R`At second order the degenerate pair feels the effective Hamiltonian $(H_{\rm eff})_{ij} = \dfrac{V_{i3}V_{3j}}{0 - \Delta} = -\dfrac{V^2}{\Delta}\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}$. Its eigenvalues are $0$ (state $|1\rangle - |2\rangle$, which decouples) and $-2V^2/\Delta = -0.20$ meV (state $|1\rangle + |2\rangle$). Splitting $0.20$ meV. Exact: the symmetric state couples with $\sqrt2V$, giving $5 - \sqrt{27} = -0.196$ meV.`,
      trap: R`Ordinary second-order theory for each state separately gives $-V^2/\Delta$ for both and no splitting; the indirect coupling through $|3\rangle$ must be diagonalised.` },
    { id: 'qpt-r4-10', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'first order', format: 'statements',
      q: R`About the first-order correction $|n^{(1)}\rangle = \sum_{m\ne n}\dfrac{H'_{mn}}{E_n^{(0)} - E_m^{(0)}}|m^{(0)}\rangle$, which statements are correct?`,
      options: [R`It contains only states $|m\rangle$ with $H'_{mn} \ne 0$`, R`With the usual choice it is orthogonal to $|n^{(0)}\rangle$`, R`For equal matrix elements, the states nearest in energy are mixed in most`, R`It changes the norm of the state already at first order in $H'$`], answer: [0, 1, 2],
      sol: R`Each coefficient is proportional to $H'_{mn}$ and inversely to the energy gap, so the first and third statements hold. The free component along $|n^{(0)}\rangle$ is set to zero by convention, which makes $|n^{(1)}\rangle \perp |n^{(0)}\rangle$. Then $\langle\psi|\psi\rangle = 1 + \langle n^{(1)}|n^{(1)}\rangle + \dots$: the norm changes only at second order.`,
      trap: R`Renormalisation is a second-order effect; the first-order correction is orthogonal to the starting state.` },
    { id: 'qpt-r4-11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'fine structure', format: 'statements',
      q: R`Which statements about the fine structure of hydrogen (first-order perturbation theory, Dirac-level accuracy) are correct?`,
      options: [R`The relativistic kinetic correction alone depends on both $n$ and $l$`, R`Relativistic, spin-orbit and Darwin terms together give a shift that depends only on $n$ and $j$`, R`The spin-orbit term shifts the $l = 0$ states`, R`$2s_{1/2}$ and $2p_{1/2}$ are split at this order`], answer: [0, 1],
      sol: R`$E^{(1)}_{\rm rel} = -\dfrac{E_n^2}{2mc^2}\left(\dfrac{4n}{l + 1/2} - 3\right)$ depends on $l$. Spin-orbit vanishes for $l = 0$ ($\vec L\cdot\vec S = 0$), and the Darwin term acts only on $l = 0$ (contact term); together the total is $-\dfrac{E_n^2}{2mc^2}\left(\dfrac{4n}{j + 1/2} - 3\right)$, a function of $n$ and $j$ only. So $2s_{1/2}$ and $2p_{1/2}$ stay degenerate; their small splitting is the QED Lamb shift.`,
      trap: R`The Lamb shift is often mistaken for part of the fine structure.` },
    { id: 'qpt-r4-12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'second order',
      q: R`A spin with $H = -\mu(B\sigma_z + b\sigma_x)$ has a strong field $B$ along $z$ and a weak field $b \ll B$ along $x$. Compared with $b = 0$, the splitting of the two levels`,
      options: [R`changes at first order, by $2\mu b$`, R`does not change at any order`, R`shrinks by $\mu b^2/B$`, R`grows, first at second order, by $\mu b^2/B$`], answer: 3,
      sol: R`The transverse term has no diagonal elements in the $\sigma_z$ basis, so the first-order shifts vanish. At second order each level is pushed away from the other by $\dfrac{(\mu b)^2}{2\mu B} = \dfrac{\mu b^2}{2B}$, so the splitting grows from $2\mu B$ by $\mu b^2/B$. Exact check: the levels are $\pm\mu\sqrt{B^2 + b^2} \approx \pm\mu(B + b^2/2B)$.`,
      trap: R`Adding $b$ to $B$ as if the fields were parallel; perpendicular fields add in quadrature.` },
  ],
  gens: [
    { id: 'qpt-r4g1', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'degenerate',
      make(r) {
        const V = choose(r, [0.2, 0.5, 1, 1.5, 2]), D = choose(r, [8, 10, 20, 25, 50]);
        const ans = 2 * V * V / D;
        return { q: R`States $|1\rangle$ and $|2\rangle$ are degenerate at energy $0$ with no direct coupling. Each couples with matrix element $${V}$ meV to a state $|3\rangle$ at $${D}$ meV. To second order, the splitting of the degenerate pair is ______ meV (four decimal places).`,
          answer: round(ans, 4), tol: Math.max(0.0005, round(ans * 0.01, 4)), V, D,
          sol: R`Second-order effective coupling: $(H_{\rm eff})_{ij} = -\dfrac{V^2}{\Delta}$ for all $i, j \in \{1, 2\}$. Eigenvalues $0$ (for $|1\rangle - |2\rangle$) and $-2V^2/\Delta$ (for $|1\rangle + |2\rangle$). Splitting $= 2(${V})^2/${D} = ${round(ans, 4)}$ meV.`,
          trap: R`Treating each state separately gives equal shifts $-V^2/\Delta$ and misses the splitting.` };
      },
      verify: (p) => 2 * p.V ** 2 / p.D },
    { id: 'qpt-r4g2', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'infinite well',
      make(r) {
        const n = int(r, 1, 6), ans = 1 / 12 - 1 / (2 * n * n * Math.PI ** 2);
        return { q: R`A particle in the level $n = ${n}$ of an infinite well $0 < x < a$ feels $H' = \epsilon(x - a/2)^2$. The first-order energy shift is $k\,\epsilon a^2$ with $k =$ ______ (four decimal places).`,
          answer: round(ans, 4), tol: 0.0003, n,
          sol: R`$\langle x\rangle = a/2$ for every level and $\langle x^2\rangle = a^2\left(\tfrac13 - \tfrac{1}{2n^2\pi^2}\right)$. So $\langle(x - a/2)^2\rangle = a^2\left(\tfrac{1}{12} - \tfrac{1}{2n^2\pi^2}\right)$; for $n = ${n}$, $k = ${round(ans, 4)}$. As $n$ grows the distribution evens out and $k \to 1/12$.`,
          trap: R`Forgetting the $n$-dependence of $\langle x^2\rangle$.` };
      },
      verify: (p) => 1 / 12 - 1 / (2 * p.n ** 2 * Math.PI ** 2) },
    { id: 'qpt-r4g3', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'helium',
      make(r) {
        const Z = int(r, 2, 8), ask = choose(r, ['total', 'shift']);
        const shift = 1.25 * Z * RY, tot = -2 * Z * Z * RY + shift, ans = ask === 'total' ? tot : shift;
        return { q: R`For the two-electron ion ${IONS[Z]} ($Z = ${Z}$), treat the electron repulsion as a perturbation on two hydrogen-like $1s$ electrons, using $\langle e^2/4\pi\varepsilon_0r_{12}\rangle = \tfrac54Z$ Ry with $1$ Ry $= 13.606$ eV. The ${ask === 'total' ? 'first-order ground-state energy' : 'first-order correction'} is ______ eV (one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.2, round(Math.abs(ans) * 0.003, 1)), Z, ask,
          sol: R`Unperturbed: $-2Z^2$ Ry $= -${2 * Z * Z}\times13.606 = ${round(-2 * Z * Z * RY, 1)}$ eV. Correction: $\tfrac54Z$ Ry $= ${round(shift, 1)}$ eV. Total ${round(tot, 1)} eV. The relative size of the correction, $\tfrac{5}{8Z}$, shrinks for heavier ions, so the estimate improves with $Z$.`,
          trap: R`The repulsion grows like $Z$ while the nuclear attraction grows like $Z^2$.` };
      },
      verify: (p) => (p.ask === 'total' ? -2 * p.Z ** 2 * RY + 1.25 * p.Z * RY : 1.25 * p.Z * RY) },
  ],
};
