// Time-independent perturbation theory: first- and second-order energies, first-order states, the sign of the
// second-order ground-state shift, degenerate perturbation theory, two-level systems and avoided crossings,
// perturbed wells and oscillators (x, x², x³, x⁴, p²), linear and quadratic Stark effects, selection rules for
// matrix elements, the finite size of the nucleus, and checks against exact solutions.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';

const lower2 = (a, b, v) => (a + b) / 2 - Math.sqrt(((a - b) / 2) ** 2 + v * v);
const wellStep = (n, f) => f - Math.sin(2 * n * Math.PI * f) / (2 * n * Math.PI); // <n|H'|n>/V0 for H' = V0 on 0 < x < f a

export default {
  topic: 'perturbation-theory',
  items: [
    // ---------- level 1 ----------
    { id: 'qpt-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'first order',
      q: 'For $H = H_0 + H\'$ with non-degenerate unperturbed states $|n^{(0)}\\rangle$, the first-order correction to the energy $E_n$ is',
      options: ['$\\langle n^{(0)}|H\'|n^{(0)}\\rangle$', '$\\langle n^{(0)}|H_0|n^{(0)}\\rangle$', '$\\sum_{m\\ne n}\\langle m^{(0)}|H\'|n^{(0)}\\rangle$', '$|\\langle n^{(0)}|H\'|n^{(0)}\\rangle|^2$'], answer: 0,
      sol: 'Insert $E_n = E_n^{(0)} + E_n^{(1)} + \\dots$ and $|n\\rangle = |n^{(0)}\\rangle + |n^{(1)}\\rangle + \\dots$ into $H|n\\rangle = E_n|n\\rangle$ and project the first-order terms on $\\langle n^{(0)}|$: $E_n^{(1)} = \\langle n^{(0)}|H\'|n^{(0)}\\rangle$, the perturbation averaged over the unperturbed state.' },
    { id: 'qpt-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'second order',
      q: 'The second-order correction to the ground-state energy of a non-degenerate system is always',
      options: ['positive', 'zero', 'negative or zero', 'equal to the first-order correction'], answer: 2,
      sol: '$E_0^{(2)} = \\sum_{m\\ne0}\\dfrac{|H\'_{m0}|^2}{E_0^{(0)} - E_m^{(0)}}$. Every numerator is $\\ge 0$ and, for the ground state, every denominator is negative. So the ground state is always pushed down at second order: levels repel.' },
    { id: 'qpt-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'first order',
      q: 'A particle in an infinite well $0 < x < a$ feels an extra constant potential $V_0$ in the left half ($0 < x < a/2$) only. To first order, every level shifts by $kV_0$ with $k =$ ______ (to one decimal place).',
      answer: 0.5, tol: 0.01, calc: () => wellStep(1, 0.5),
      sol: '$E_n^{(1)} = V_0\\int_0^{a/2}\\tfrac{2}{a}\\sin^2\\tfrac{n\\pi x}{a}\\,dx = \\tfrac{V_0}{2}$, because every $|\\psi_n|^2$ is symmetric about the centre and so puts exactly half its probability in each half.' },
    { id: 'qpt-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'A harmonic oscillator is perturbed by $H\' = \\lambda x$. The first-order energy shift of level $n$ is',
      options: ['$\\lambda\\sqrt{\\hbar/2m\\omega}$', '$\\lambda(n + \\tfrac12)$', '$-\\lambda^2/2m\\omega^2$', '$0$'], answer: 3,
      sol: 'Every oscillator eigenfunction has definite parity, so $|\\psi_n|^2$ is even and $\\langle n|x|n\\rangle = 0$. (In ladder language, $x \\propto a + a^\\dagger$ has no diagonal elements.) The shift $-\\lambda^2/2m\\omega^2$ appears at second order.' },
    { id: 'qpt-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'degenerate',
      q: 'When the unperturbed level is degenerate, the first-order energy corrections are found by',
      options: ['adding the diagonal elements of $H\'$ in the degenerate subspace', 'diagonalising the matrix of $H\'$ in the degenerate subspace', 'using the non-degenerate formula with any basis', 'going straight to second order'], answer: 1,
      sol: 'The non-degenerate formulas divide by $E_n^{(0)} - E_m^{(0)}$, which is zero inside a degenerate level. The fix is to pick the "good" basis that diagonalises $H\'$ within the level; its eigenvalues are the first-order shifts and its eigenvectors are the zeroth-order states.' },
    { id: 'qpt-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'general',
      q: 'Which statements about non-degenerate perturbation theory are correct?',
      options: ['The first-order energy needs only the unperturbed state of that level.', 'The first-order correction to the state is built from the other unperturbed states.', 'The second-order shift of the ground state cannot be positive.', 'The first-order energy correction is always positive.'], answer: [0, 1, 2],
      sol: '$E_n^{(1)} = \\langle n|H\'|n\\rangle$ uses one state; $|n^{(1)}\\rangle = \\sum_{m\\ne n}\\dfrac{H\'_{mn}}{E_n - E_m}|m\\rangle$ uses the others; $E_0^{(2)} \\le 0$. $E_n^{(1)}$ has the sign of $H\'$ on average: a negative perturbation lowers the level.' },

    // ---------- level 2 ----------
    { id: 'qpt-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator of mass $m$ and frequency $\\omega$ is perturbed by $H\' = \\lambda x^2$. The first-order shift of the ground state is $k\\,\\lambda\\hbar/m\\omega$ with $k =$ ______ (to one decimal place).',
      answer: 0.5, tol: 0.01, calc: () => 0.5,
      sol: '$\\langle0|x^2|0\\rangle = \\dfrac{\\hbar}{2m\\omega}$, so $E_0^{(1)} = \\dfrac{\\lambda\\hbar}{2m\\omega}$. (Exact: $\\omega \\to \\omega\\sqrt{1 + 2\\lambda/m\\omega^2}$; expanding $\\tfrac12\\hbar\\omega\\sqrt{1 + 2\\lambda/m\\omega^2}$ gives the same first term.)' },
    { id: 'qpt-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      q: 'A two-level system has unperturbed energies $0$ and $10$ meV. A perturbation has zero diagonal elements and off-diagonal element $V = 1$ meV. The second-order shift of the lower level is ______ meV (to three decimal places).',
      answer: -0.1, tol: 0.002, calc: () => -1 / 10,
      sol: '$E_1^{(2)} = \\dfrac{|V|^2}{E_1 - E_2} = \\dfrac{1}{0 - 10} = -0.1$ meV. The upper level moves up by the same amount. Exact: $5 - \\sqrt{25 + 1} = -0.0990$ meV, very close because $V \\ll 10$ meV.' },
    { id: 'qpt-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'For the oscillator with $H\' = \\lambda x$, completing the square gives the exact energies. Every level shifts by',
      options: ['$-\\dfrac{\\lambda^2}{2m\\omega^2}$', '$+\\dfrac{\\lambda^2}{2m\\omega^2}$', '$-\\dfrac{\\lambda^2}{m\\omega^2}$', '$0$'], answer: 0,
      sol: '$\\tfrac12m\\omega^2x^2 + \\lambda x = \\tfrac12m\\omega^2(x + \\lambda/m\\omega^2)^2 - \\lambda^2/2m\\omega^2$: the same oscillator, moved sideways and down. Second-order perturbation theory gives exactly this, since $x$ only connects $n$ to $n \\pm 1$ and higher orders vanish.' },
    { id: 'qpt-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'A weak uniform field $\\mathcal E\\hat z$ acts on hydrogen in its $n = 2$ level (spin and fine structure ignored). To first order, the four states split into',
      options: ['2 levels, $\\pm3e\\mathcal Ea_0$, each doubly degenerate', '4 different levels', '3 levels: $\\pm3e\\mathcal Ea_0$ and $0$ (twice)', 'no splitting at first order'], answer: 2,
      sol: '$H\' = e\\mathcal Ez$ connects only $2s$ and $2p_{m=0}$ (same $m$, opposite parity), with $\\langle200|z|210\\rangle = -3a_0$. Diagonalising the $2\\times2$ block gives $\\pm3e\\mathcal Ea_0$ for $(2s \\pm 2p_0)/\\sqrt2$. $2p_{\\pm1}$ have no partner and stay put. A linear shift exists only because $2s$ and $2p$ are degenerate.' },
    { id: 'qpt-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'The ground state of hydrogen shows no first-order (linear) Stark shift because',
      options: ['the field is too weak', '$\\langle100|z|100\\rangle = 0$ by parity, and the level is non-degenerate', 'the electron has spin', 'the nucleus screens the field'], answer: 1,
      sol: '$|\\psi_{100}|^2$ is even and $z$ is odd, so the first-order shift vanishes; with no degenerate partner of opposite parity there is no mixing at first order either. The shift starts at second order, $-\\tfrac12\\alpha\\mathcal E^2$, where $\\alpha$ is the polarisability.' },
    { id: 'qpt-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'infinite well',
      q: 'A particle in an infinite well $0 < x < a$ is perturbed by $H\' = V_0\\sin(\\pi x/a)$. The first-order shift of the ground state is $kV_0$ with $k =$ ______ (to three decimal places).',
      answer: 0.849, tol: 0.003, calc: () => 8 / (3 * Math.PI),
      sol: '$E_1^{(1)} = \\tfrac{2V_0}{a}\\int_0^a\\sin^3\\tfrac{\\pi x}{a}dx = \\tfrac{2V_0}{\\pi}\\int_0^\\pi\\sin^3u\\,du = \\tfrac{2V_0}{\\pi}\\cdot\\tfrac43 = \\tfrac{8V_0}{3\\pi} = 0.849V_0$. (Use $\\int_0^\\pi\\sin^3u\\,du = \\int_{-1}^1(1 - c^2)dc = \\tfrac43$.)' },
    { id: 'qpt-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator is perturbed by $H\' = \\lambda x^4$. The first-order shift of the ground state is $k\\,\\lambda(\\hbar/m\\omega)^2$ with $k =$ ______ (to two decimal places).',
      answer: 0.75, tol: 0.002, calc: () => 3 / 4,
      sol: 'For a Gaussian, $\\langle x^4\\rangle = 3\\langle x^2\\rangle^2 = 3(\\hbar/2m\\omega)^2$. So $E_0^{(1)} = \\tfrac34\\lambda(\\hbar/m\\omega)^2$. In general $\\langle n|x^4|n\\rangle = 3(2n^2 + 2n + 1)(\\hbar/2m\\omega)^2$.',
      trap: 'Squaring $\\langle x^2\\rangle$ without the factor 3 from the Gaussian moment.' },
    { id: 'qpt-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'first order',
      q: 'The first-order correction to the state $|n\\rangle$ is',
      options: ['$\\sum_{m\\ne n}\\dfrac{\\langle m|H\'|n\\rangle}{E_m^{(0)} - E_n^{(0)}}|m\\rangle$', '$\\sum_{m}\\dfrac{\\langle m|H\'|n\\rangle}{E_n^{(0)} - E_m^{(0)}}|m\\rangle$ including $m = n$', '$\\langle n|H\'|n\\rangle|n\\rangle$', '$\\sum_{m\\ne n}\\dfrac{\\langle m|H\'|n\\rangle}{E_n^{(0)} - E_m^{(0)}}|m\\rangle$'], answer: 3,
      sol: 'Project the first-order equation $(H_0 - E_n^{(0)})|n^{(1)}\\rangle = (E_n^{(1)} - H\')|n^{(0)}\\rangle$ on $\\langle m|$ with $m \\ne n$: $(E_m - E_n)c_m = -H\'_{mn}$, so $c_m = H\'_{mn}/(E_n - E_m)$. The $m = n$ term is set to zero by normalisation (to first order). The first option has the wrong sign.',
      trap: 'Getting the denominator the wrong way round: the state mixes in neighbours with the sign that pushes levels apart.' },
    { id: 'qpt-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'For the oscillator ground state perturbed by $H\' = \\lambda x$, which statements are correct?',
      options: ['$\\langle1|x|0\\rangle \\ne 0$', '$\\langle2|x|0\\rangle \\ne 0$', 'The first-order energy shift is zero.', 'The second-order energy shift is non-zero.'], answer: [0, 2, 3],
      sol: '$x = \\sqrt{\\hbar/2m\\omega}\\,(a + a^\\dagger)$ connects $n$ only to $n \\pm 1$. So $\\langle1|x|0\\rangle = \\sqrt{\\hbar/2m\\omega}$, $\\langle2|x|0\\rangle = 0$, $\\langle0|x|0\\rangle = 0$, and $E_0^{(2)} = -\\lambda^2(\\hbar/2m\\omega)/\\hbar\\omega = -\\lambda^2/2m\\omega^2$.' },
    { id: 'qpt-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator is perturbed by $H\' = \\alpha p^2$ (a small change in the kinetic term). The first-order shift of level $n$ is',
      options: ['$\\alpha m\\hbar\\omega(n + \\tfrac12)$', '$\\alpha\\hbar\\omega(n + \\tfrac12)/m$', '$\\alpha\\hbar^2(n + \\tfrac12)$', '$0$'], answer: 0,
      sol: 'By the virial theorem $\\langle p^2/2m\\rangle = \\tfrac12E_n$, so $\\langle p^2\\rangle = m\\hbar\\omega(n + \\tfrac12)$ and $E^{(1)} = \\alpha m\\hbar\\omega(n + \\tfrac12)$. Exact check: $1/2m \\to 1/2m + \\alpha$ changes $\\omega$ to $\\omega\\sqrt{1 + 2m\\alpha} \\approx \\omega(1 + m\\alpha)$.' },

    // ---------- level 3 ----------
    { id: 'qpt-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      q: 'A Hamiltonian in some basis is $H = \\begin{pmatrix}1 & 0.5\\\\0.5 & 3\\end{pmatrix}$ eV. Its exact lower eigenvalue is ______ eV (to three decimal places).',
      answer: 0.882, tol: 0.002, calc: () => lower2(1, 3, 0.5),
      sol: '$E_\\pm = \\tfrac{1 + 3}{2} \\pm \\sqrt{\\left(\\tfrac{3 - 1}{2}\\right)^2 + 0.5^2} = 2 \\pm \\sqrt{1.25}$, so $E_- = 2 - 1.118 = 0.882$ eV. Second-order perturbation theory gives $1 - 0.25/2 = 0.875$ eV: close, since $0.5 \\ll 2$.' },
    { id: 'qpt-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'infinite well',
      q: 'A particle in an infinite well $0 < x < a$ feels an extra $V_0$ in the middle half, $a/4 < x < 3a/4$. The first-order shift of the ground state is $kV_0$ with $k =$ ______ (to three decimal places).',
      answer: 0.818, tol: 0.003, calc: () => 0.5 + 1 / Math.PI,
      sol: '$E_1^{(1)} = \\tfrac{2V_0}{a}\\int_{a/4}^{3a/4}\\sin^2\\tfrac{\\pi x}{a}dx = \\tfrac{2V_0}{a}\\left[\\tfrac x2 - \\tfrac{a}{4\\pi}\\sin\\tfrac{2\\pi x}{a}\\right]_{a/4}^{3a/4} = \\tfrac{2V_0}{a}\\left[\\tfrac a4 + \\tfrac{a}{2\\pi}\\right] = \\left(\\tfrac12 + \\tfrac1\\pi\\right)V_0 = 0.818V_0$. More than half, because the ground state is concentrated in the middle.' },
    { id: 'qpt-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator ground state is perturbed by $H\' = \\lambda x^3$. The lowest non-vanishing energy correction is',
      options: ['first order and positive', 'first order and negative', 'second order and positive', 'second order and negative'], answer: 3,
      sol: '$\\langle0|x^3|0\\rangle = 0$ by parity. At second order the ground state shift is always $\\le 0$, and here it is non-zero because $x^3$ connects $|0\\rangle$ to $|1\\rangle$ and $|3\\rangle$. (Physically the $x^3$ term makes one side softer, letting the particle lower its energy; the true potential is not even bounded below, but the perturbative result is meaningful for small $\\lambda$.)' },
    { id: 'qpt-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An electron bound harmonically with $\\hbar\\omega = 1.00$ eV is placed in a uniform field of $1.0\\times10^8$ V/m. The downward shift of every level is ______ meV (to three decimal places). Use $m_e = 9.109\\times10^{-31}$ kg, $\\hbar = 1.0546\\times10^{-34}$ J s, $e = 1.602\\times10^{-19}$ C.',
      answer: 0.381, tol: 0.003, calc: () => { const w = 1.602e-19 / 1.0546e-34; return (1.602e-19 * 1e8) ** 2 / (2 * 9.109e-31 * w * w) / 1.602e-19 * 1000; },
      sol: 'Exact (and equal to second order): $\\Delta E = (e\\mathcal E)^2/2m\\omega^2$. $\\omega = 1.602\\times10^{-19}/1.0546\\times10^{-34} = 1.519\\times10^{15}$ s$^{-1}$, $m\\omega^2 = 2.10$ J/m$^2$, $(e\\mathcal E)^2 = 2.566\\times10^{-22}$ N$^2$. $\\Delta E = 6.10\\times10^{-23}$ J $= 0.381$ meV.' },
    { id: 'qpt-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'degenerate',
      q: 'Two degenerate states $|1\\rangle, |2\\rangle$ of energy $E_0$ are perturbed by $H\'$ with $H\'_{11} = H\'_{22} = 0$ and $H\'_{12} = H\'_{21} = V$ (real, positive). To first order the energies and states are',
      options: ['$E_0 \\pm V$, with states $|1\\rangle$ and $|2\\rangle$', '$E_0 \\pm V$, with states $(|1\\rangle \\pm |2\\rangle)/\\sqrt2$', '$E_0 \\pm V^2$, with states $(|1\\rangle \\pm |2\\rangle)/\\sqrt2$', '$E_0$ for both, since the diagonal elements vanish'], answer: 1,
      sol: 'Diagonalise $\\begin{pmatrix}0&V\\\\V&0\\end{pmatrix}$: eigenvalues $\\pm V$, eigenvectors $(1, \\pm1)/\\sqrt2$. The symmetric combination goes up by $V$ and the antisymmetric one down. Non-degenerate theory would wrongly predict zero first-order shift.',
      trap: 'Looking only at the diagonal elements, which is correct only in the good basis.' },
    { id: 'qpt-022', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      q: 'A particle in a 2D infinite square well ($0 < x, y < a$) is in the degenerate first excited level, states $\\psi_{12}$ and $\\psi_{21}$. A perturbation $H\' = V_0$ acts only in the quarter $0 < x, y < a/2$. The first-order splitting of the level is $kV_0$ with $k =$ ______ (to three decimal places).',
      answer: 0.360, tol: 0.002, calc: () => 2 * (4 / (3 * Math.PI)) ** 2,
      sol: 'Diagonal elements: each 1D factor puts half its weight in $(0, a/2)$, so $H\'_{11} = H\'_{22} = V_0/4$. Off-diagonal: $H\'_{12} = V_0I^2$ with $I = \\tfrac2a\\int_0^{a/2}\\sin\\tfrac{\\pi x}{a}\\sin\\tfrac{2\\pi x}{a}dx = \\tfrac2\\pi\\int_0^{\\pi/2}2\\sin^2u\\cos u\\,du = \\tfrac{4}{3\\pi}$. Eigenvalues $V_0\\left(\\tfrac14 \\pm \\tfrac{16}{9\\pi^2}\\right)$; splitting $\\tfrac{32}{9\\pi^2}V_0 = 0.360V_0$.' },
    { id: 'qpt-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'For the linear Stark effect in the $n = 2$ level of hydrogen (field along $z$, spin ignored), which statements are correct?',
      options: ['The perturbation mixes $2s$ with $2p$, $m = 0$.', 'The $2p$, $m = \\pm1$ states are not shifted at first order.', 'The shifts are proportional to the field strength.', 'The ground state shows the same linear effect.'], answer: [0, 1, 2],
      sol: '$z$ has $\\Delta m = 0$ and odd parity, so within $n = 2$ only $\\langle200|z|210\\rangle = -3a_0$ is non-zero. The shifts $\\pm3e\\mathcal Ea_0$ are linear in $\\mathcal E$. The ground state has no degenerate partner of opposite parity, so its shift is quadratic.' },
    { id: 'qpt-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'For the hydrogen ground state in a weak uniform field $\\mathcal E$, the energy shift is proportional to',
      options: ['$\\mathcal E$', '$\\mathcal E^{1/2}$', '$\\mathcal E^3$', '$\\mathcal E^2$'], answer: 3,
      sol: 'First order vanishes by parity; second order gives $-\\tfrac12\\alpha\\mathcal E^2$ with $\\alpha = \\tfrac92(4\\pi\\epsilon_0)a_0^3$. Physically the field induces a dipole $\\alpha\\mathcal E$, which then interacts with the field: two factors of $\\mathcal E$, and a half from building up the dipole.' },
    { id: 'qpt-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'second order',
      q: 'A three-level system has $H_0 = \\mathrm{diag}(0, 2, 5)$ meV. A perturbation has zero diagonal elements, $H\'_{12} = 0.4$ meV, $H\'_{13} = 1$ meV and $H\'_{23} = 0.3$ meV (all real). The second-order shift of the lowest level is ______ meV (to three decimal places).',
      answer: -0.28, tol: 0.002, calc: () => -(0.16 / 2 + 1 / 5),
      sol: '$E_1^{(2)} = \\dfrac{|H\'_{21}|^2}{0 - 2} + \\dfrac{|H\'_{31}|^2}{0 - 5} = -0.08 - 0.20 = -0.28$ meV. $H\'_{23}$ does not enter the ground-state shift at second order (it would at third order).',
      trap: 'Including $H\'_{23}$, which does not involve level 1.' },
    { id: 'qpt-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'first order',
      q: 'The lowest relativistic correction to the kinetic energy is $H\' = -p^4/8m^3c^2$. Its first-order effect on any bound state is',
      options: ['always negative', 'always positive', 'zero for $s$ states', 'positive for $l > 0$ and negative for $l = 0$'], answer: 0,
      sol: '$\\langle -p^4/8m^3c^2\\rangle = -\\langle p^2\\psi|p^2\\psi\\rangle/8m^3c^2 \\le 0$, because $p^2$ is Hermitian and the inner product of a state with itself is non-negative. Relativity always lowers the level (the kinetic energy grows more slowly than $p^2/2m$).' },
    { id: 'qpt-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator is perturbed by $H\' = \\lambda x^2$ with $2\\lambda/m\\omega^2 = 0.2$. The exact shift of the ground-state energy is $k\\,\\hbar\\omega$ with $k =$ ______ (to four decimal places).',
      answer: 0.0477, tol: 0.0003, calc: () => 0.5 * (Math.sqrt(1.2) - 1),
      sol: 'The new frequency is $\\omega\\sqrt{1 + 0.2}$, so $\\Delta E = \\tfrac12\\hbar\\omega(\\sqrt{1.2} - 1) = 0.0477\\hbar\\omega$. Perturbation theory: first order $\\tfrac12\\cdot\\tfrac{0.2}{2} = 0.05$, second order $-\\tfrac12\\cdot\\tfrac{0.2^2}{8} = -0.0025$; sum $0.0475$, already close.' },
    { id: 'qpt-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'first order',
      q: 'For the oscillator ground state with $H\' = \\lambda x$, the first-order corrected state is $|0\\rangle + c|1\\rangle$ with $c =$',
      options: ['$+\\dfrac{\\lambda}{\\hbar\\omega}\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$', '$-\\dfrac{\\lambda}{2\\hbar\\omega}\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$', '$-\\dfrac{\\lambda}{\\hbar\\omega}\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$', '$-\\dfrac{\\lambda}{\\hbar\\omega}\\sqrt{\\dfrac{\\hbar}{m\\omega}}$'], answer: 2,
      sol: '$c = \\dfrac{\\langle1|H\'|0\\rangle}{E_0 - E_1} = \\dfrac{\\lambda\\sqrt{\\hbar/2m\\omega}}{-\\hbar\\omega}$. The negative sign shifts the packet towards $-x$, where the potential $\\lambda x$ is lower: $\\langle x\\rangle = 2c\\sqrt{\\hbar/2m\\omega} = -\\lambda/m\\omega^2$, exactly the new equilibrium.' },
    { id: 'qpt-036', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      q: 'Two levels whose unperturbed energies differ by $2$ meV are coupled by a real matrix element $V = 1$ meV. The exact separation of the perturbed levels is ______ meV (to two decimal places).',
      answer: 2.83, tol: 0.01, calc: () => Math.sqrt(4 + 4),
      sol: 'For $\\begin{pmatrix}E_1 & V\\\\V & E_2\\end{pmatrix}$ the eigenvalues differ by $\\sqrt{(E_1 - E_2)^2 + 4V^2} = \\sqrt{4 + 4} = 2.83$ meV. The coupling always increases the gap; at zero detuning it would be $2V = 2$ meV (the avoided crossing).' },
    { id: 'qpt-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'second order',
      q: 'The second-order energy correction for a non-degenerate level $n$ is',
      options: ['$\\sum_{m\\ne n}\\dfrac{|H\'_{mn}|^2}{E_m^{(0)} - E_n^{(0)}}$', '$\\sum_{m\\ne n}\\dfrac{|H\'_{mn}|^2}{E_n^{(0)} - E_m^{(0)}}$', '$\\sum_{m\\ne n}\\dfrac{H\'_{mn}}{E_n^{(0)} - E_m^{(0)}}$', '$\\langle n|H\'^2|n\\rangle/E_n^{(0)}$'], answer: 1,
      sol: '$E_n^{(2)} = \\langle n^{(0)}|H\'|n^{(1)}\\rangle = \\sum_{m\\ne n}\\dfrac{|H\'_{mn}|^2}{E_n^{(0)} - E_m^{(0)}}$. Levels below $n$ push it up, levels above push it down; the ground state is only pushed down.' },

    // ---------- level 4 ----------
    { id: 'qpt-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'Hydrogen in its $n = 2$ level sits in a field of $1.0\\times10^7$ V/m. The first-order shift of the highest Stark component is ______ meV (to two decimal places). Take $a_0 = 0.0529$ nm.',
      answer: 1.59, tol: 0.01, calc: () => 3 * 1e7 * 0.0529e-9 * 1000,
      sol: 'The shifts are $\\pm3e\\mathcal Ea_0$ and $0$. $3e\\mathcal Ea_0 = 3\\times10^7\\ \\text{V/m}\\times5.29\\times10^{-11}\\ \\text{m}\\times e = 1.59\\times10^{-3}$ eV $= 1.59$ meV. Large fields are needed: even this is far below the level spacing (10.2 eV to $n = 1$).' },
    { id: 'qpt-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'infinite well',
      q: 'An infinite well $0 < x < a$ has a small barrier $H\' = \\alpha\\,\\delta(x - a/2)$. The first-order shift of the $n = 3$ level is $k\\,\\alpha/a$ with $k =$ ______.',
      answer: 2, tol: 0, calc: () => 2 * Math.sin(3 * Math.PI / 2) ** 2,
      sol: '$E_n^{(1)} = \\alpha|\\psi_n(a/2)|^2 = \\tfrac{2\\alpha}{a}\\sin^2\\tfrac{n\\pi}{2}$: $2\\alpha/a$ for odd $n$ and $0$ for even $n$, whose wavefunctions have a node at the centre and do not feel the delta.' },
    { id: 'qpt-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'two-level',
      q: 'For $H = \\begin{pmatrix}E_1 & V\\\\V^* & E_2\\end{pmatrix}$ with $V \\ne 0$, which statements are correct as $E_1 - E_2$ is varied?',
      options: ['The two eigenvalues are always further apart than $|E_1 - E_2|$.', 'The smallest separation is $2|V|$, at $E_1 = E_2$.', 'Second-order perturbation theory works when $|V| \\ll |E_1 - E_2|$.', 'The eigenvalues cross at $E_1 = E_2$.'], answer: [0, 1, 2],
      sol: 'The gap is $\\sqrt{(E_1 - E_2)^2 + 4|V|^2} \\ge |E_1 - E_2|$ and never drops below $2|V|$: the levels repel and avoid crossing. Far from the crossing $\\sqrt{\\Delta^2 + 4|V|^2} \\approx |\\Delta| + 2|V|^2/|\\Delta|$, the perturbative result. At the crossing the states are equal mixtures.' },
    { id: 'qpt-032', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'nuclear size',
      q: 'Treat the proton as a uniformly charged sphere of radius $R = 1.0$ fm. Inside, the potential energy is $-\\dfrac{ke^2}{2R}\\left(3 - \\dfrac{r^2}{R^2}\\right)$ instead of $-ke^2/r$. With $ke^2/a_0 = 27.2$ eV and $a_0 = 5.29\\times10^4$ fm, the first-order shift of the hydrogen ground state is $k\\times10^{-9}$ eV, $k =$ ______ (to two decimal places).',
      answer: 3.89, tol: 0.03, calc: () => 0.4 * 27.2 * (1 / 52900) ** 2 * 1e9,
      sol: 'Inside the tiny sphere $|\\psi|^2 \\approx 1/\\pi a_0^3$. $\\int_0^R\\left[\\dfrac{ke^2}{r} - \\dfrac{ke^2}{2R}\\left(3 - \\dfrac{r^2}{R^2}\\right)\\right]4\\pi r^2dr = 4\\pi ke^2R^2\\left(\\tfrac12 - \\tfrac25\\right) = \\tfrac{2\\pi}{5}ke^2R^2$. So $\\Delta E = \\tfrac25\\dfrac{ke^2}{a_0}\\left(\\dfrac{R}{a_0}\\right)^2 = 0.4\\times27.2\\times3.57\\times10^{-10} = 3.89\\times10^{-9}$ eV, positive (the potential is less deep inside the proton). Only $s$ states feel it.' },
    { id: 'qpt-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      q: 'A three-fold degenerate level is perturbed by $H\' = \\epsilon\\begin{pmatrix}0&1&0\\\\1&0&0\\\\0&0&2\\end{pmatrix}$ in the original basis. The first-order shifts are',
      options: ['$0, 0, 2\\epsilon$', '$\\epsilon, \\epsilon, 2\\epsilon$', '$-\\epsilon, \\epsilon, 2\\epsilon$', '$-\\sqrt2\\epsilon, 0, \\sqrt2\\epsilon$'], answer: 2,
      sol: 'The matrix is block diagonal: the $2\\times2$ block $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ has eigenvalues $\\pm1$, and the third state is already an eigenvector with $2$. Shifts $-\\epsilon, +\\epsilon, 2\\epsilon$; the degeneracy is fully lifted. Check: the trace $2\\epsilon$ equals the sum of the shifts.',
      trap: 'Reading off the diagonal $0, 0, 2\\epsilon$ in a basis that does not diagonalise $H\'$.' },
    { id: 'qpt-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An oscillator is perturbed by $H\' = \\lambda x^4$. The first-order shift of the $n = 1$ level is $k\\,\\lambda(\\hbar/m\\omega)^2$ with $k =$ ______ (to two decimal places).',
      answer: 3.75, tol: 0.01, calc: () => 3 * (2 + 2 + 1) / 4,
      sol: 'With $x = \\sqrt{\\hbar/2m\\omega}(a + a^\\dagger)$, the diagonal part of $(a + a^\\dagger)^4$ in $|n\\rangle$ is $6n^2 + 6n + 3$. For $n = 1$: $15$. So $E^{(1)} = 15\\lambda(\\hbar/2m\\omega)^2 = 3.75\\lambda(\\hbar/m\\omega)^2$. The quartic term raises higher levels more, so the spacing grows with $n$.' },
    { id: 'qpt-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hellmann-feynman',
      q: 'The Hellmann-Feynman theorem states that for $H(\\lambda)$ with normalised eigenstate $|n(\\lambda)\\rangle$,',
      options: ['$\\dfrac{dE_n}{d\\lambda} = \\left\\langle n\\left|\\dfrac{\\partial H}{\\partial\\lambda}\\right|n\\right\\rangle$', '$\\dfrac{dE_n}{d\\lambda} = 0$', '$\\dfrac{d^2E_n}{d\\lambda^2} = \\left\\langle n\\left|\\dfrac{\\partial^2H}{\\partial\\lambda^2}\\right|n\\right\\rangle$ always', '$\\dfrac{dE_n}{d\\lambda} = \\left\\langle n\\left|H\\right|\\dfrac{\\partial n}{\\partial\\lambda}\\right\\rangle$'], answer: 0,
      sol: 'Differentiate $E_n = \\langle n|H|n\\rangle$: the terms with $\\partial_\\lambda|n\\rangle$ give $E_n\\,\\partial_\\lambda\\langle n|n\\rangle = 0$. What is left is $\\langle n|\\partial_\\lambda H|n\\rangle$. Applied at $\\lambda = 0$ to $H_0 + \\lambda H\'$ it is first-order perturbation theory. The second-derivative version fails: the state change adds a (negative, for the ground state) second-order term.' },
    { id: 'qpt-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'infinite well',
      q: 'An infinite well $0 < x < a$ is perturbed by $H\' = \\epsilon\\cos(2\\pi x/a)$. The first-order shift of the ground state is $k\\epsilon$ with $k =$ ______ (to two decimal places).',
      answer: -0.5, tol: 0.002, calc: () => -0.5,
      sol: '$|\\psi_1|^2 = \\tfrac2a\\sin^2\\tfrac{\\pi x}{a} = \\tfrac1a\\left(1 - \\cos\\tfrac{2\\pi x}{a}\\right)$. Then $E_1^{(1)} = \\tfrac{\\epsilon}{a}\\int_0^a\\left(\\cos\\tfrac{2\\pi x}{a} - \\cos^2\\tfrac{2\\pi x}{a}\\right)dx = \\tfrac\\epsilon a\\left(0 - \\tfrac a2\\right) = -\\tfrac\\epsilon2$. For $n \\ge 2$ the shift is zero: $|\\psi_n|^2$ contains $\\cos(2n\\pi x/a)$, orthogonal to $\\cos(2\\pi x/a)$.' },
    { id: 'qpt-041', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'degenerate',
      q: 'For the 2D isotropic oscillator, the first excited level ($n_x + n_y = 1$) is doubly degenerate. A perturbation $H\' = \\lambda xy$ splits it, to first order, into',
      options: ['$\\pm\\lambda\\dfrac{\\hbar}{2m\\omega}$', '$\\pm\\lambda\\dfrac{\\hbar}{m\\omega}$', '$0$ and $\\lambda\\dfrac{\\hbar}{m\\omega}$', 'no splitting, since $\\langle xy\\rangle = 0$ in each state'], answer: 0,
      sol: 'In the basis $|10\\rangle, |01\\rangle$: diagonal elements $\\langle1|x|1\\rangle\\langle0|y|0\\rangle = 0$; off-diagonal $\\langle1|x|0\\rangle\\langle0|y|1\\rangle = \\hbar/2m\\omega$. Eigenvalues $\\pm\\lambda\\hbar/2m\\omega$, for the states $(|10\\rangle \\pm |01\\rangle)/\\sqrt2$, oscillations along the diagonals $x = \\pm y$, as expected for the rotated quadratic form.',
      trap: 'Zero diagonal elements in the original basis do not mean zero shifts.' },

    // ---------- level 5 ----------
    { id: 'qpt-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'stark effect',
      q: 'An upper bound on the hydrogen ground-state polarisability follows from replacing every $E_m - E_1$ in the second-order sum by the smallest one, $E_2 - E_1 = \\tfrac38\\,ke^2/a_0$, and using closure with $\\langle100|z^2|100\\rangle = a_0^2$. In units of $4\\pi\\epsilon_0a_0^3$, this bound on $\\alpha$ is ______ (to two decimal places).',
      answer: 5.33, tol: 0.02, calc: () => 16 / 3,
      sol: '$E^{(2)} = -e^2\\mathcal E^2\\sum_{m\\ne1}\\dfrac{|z_{m1}|^2}{E_m - E_1} \\ge -\\dfrac{e^2\\mathcal E^2}{E_2 - E_1}\\sum_m|z_{m1}|^2 = -\\dfrac{e^2\\mathcal E^2a_0^2}{E_2 - E_1}$ (closure, with $\\langle z\\rangle = 0$). With $E^{(2)} = -\\tfrac12\\alpha\\mathcal E^2$: $\\alpha \\le \\dfrac{2e^2a_0^2}{(3/8)ke^2/a_0} = \\dfrac{16}{3}\\dfrac{a_0^3}{k} = 5.33\\times4\\pi\\epsilon_0a_0^3$. The exact value is $4.5$.' },
    { id: 'qpt-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'selection rules',
      q: 'For hydrogen states $|nlm\\rangle$, which matrix elements of $z$ can be non-zero?',
      options: ['$\\langle100|z|210\\rangle$', '$\\langle100|z|211\\rangle$', '$\\langle200|z|210\\rangle$', '$\\langle210|z|320\\rangle$'], answer: [0, 2, 3],
      sol: '$z \\propto rY_{10}$ carries $l = 1$, $m = 0$ and odd parity, so it needs $\\Delta m = 0$ and $\\Delta l = \\pm1$. The second element has $\\Delta m = 1$, so it vanishes ($\\int e^{i\\phi}d\\phi = 0$). The others have $\\Delta l = \\pm1$, $\\Delta m = 0$; $\\Delta n$ is unrestricted.' },
    { id: 'qpt-040', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'two-level',
      q: 'For $H = \\begin{pmatrix}0 & V\\\\V & \\Delta\\end{pmatrix}$ with $V/\\Delta = 0.5$, the ratio of the exact downward shift of the lower level to the second-order perturbative shift $V^2/\\Delta$ is ______ (to three decimal places).',
      answer: 0.828, tol: 0.003, calc: () => (Math.sqrt(0.25 + 0.25) - 0.5) / 0.25,
      sol: 'Exact lower level: $\\tfrac\\Delta2 - \\sqrt{\\tfrac{\\Delta^2}{4} + V^2} = \\Delta(0.5 - \\sqrt{0.5}) = -0.2071\\Delta$. Second order: $-V^2/\\Delta = -0.25\\Delta$. Ratio $0.828$: the series $-\\tfrac{V^2}{\\Delta} + \\tfrac{V^4}{\\Delta^3} - \\dots$ already needs its fourth-order term ($+0.0625$) at this coupling.' },
  ],
  gens: [
    { id: 'qpt-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      make(r) {
        const a = int(r, 0, 3), b = a + int(r, 1, 6), v = choose(r, [0.2, 0.5, 1, 1.5, 2]), up = r() < 0.4;
        const s = Math.sqrt(((b - a) / 2) ** 2 + v * v), E = up ? (a + b) / 2 + s : (a + b) / 2 - s;
        return { q: `Find the exact ${up ? 'upper' : 'lower'} eigenvalue of $H = \\begin{pmatrix}${a} & ${v}\\\\${v} & ${b}\\end{pmatrix}$ meV. Answer ______ meV (to three decimal places).`,
          answer: round(E, 3), tol: 0.002, a, b, v, up,
          sol: `$E_\\pm = \\tfrac{${a} + ${b}}{2} \\pm \\sqrt{\\left(\\tfrac{${b} - ${a}}{2}\\right)^2 + ${v}^2} = ${(a + b) / 2} \\pm ${round(s, 4)}$, so the answer is $${round(E, 3)}$ meV. Second-order perturbation theory would give $${up ? b : a} ${up ? '+' : '-'} ${v}^2/${b - a} = ${round(up ? b + v * v / (b - a) : a - v * v / (b - a), 3)}$ meV.` };
      },
      verify: (p) => { const m = (p.a + p.b) / 2, s = Math.hypot((p.b - p.a) / 2, p.v); return p.up ? m + s : m - s; } },
    { id: 'qpt-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'second order',
      make(r) {
        const D = int(r, 2, 20), V = choose(r, [0.1, 0.2, 0.3, 0.5, 1]), upper = r() < 0.4;
        const v = (upper ? 1 : -1) * V * V / D;
        return { q: `Two levels separated by $${D}$ meV are coupled by an off-diagonal perturbation of size $${V}$ meV (no diagonal elements). The second-order shift of the ${upper ? 'upper' : 'lower'} level is ______ meV (to four decimal places).`,
          answer: round(v, 4), tol: Math.max(0.0002, Math.abs(v) * 0.005), D, V, upper,
          sol: `$E^{(2)} = |V|^2/(E_n - E_m)$: for the ${upper ? 'upper level the denominator is $+' : 'lower level the denominator is $-'}${D}$ meV, so $E^{(2)} = ${upper ? '' : '-'}${V}^2/${D} = ${round(v, 4)}$ meV. The two levels repel by equal amounts.` };
      },
      verify: (p) => (p.upper ? 1 : -1) * p.V ** 2 / p.D },
    { id: 'qpt-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const k = choose(r, [2, 4]), n = int(r, 0, 4);
        const v = k === 2 ? (2 * n + 1) / 2 : 3 * (2 * n * n + 2 * n + 1) / 4;
        return { q: `An oscillator is perturbed by $H\' = \\lambda x^${k}$. The first-order shift of level $n = ${n}$ is $c\\,\\lambda(\\hbar/m\\omega)^{${k / 2}}$ with $c =$ ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.005, k, n,
          sol: k === 2
            ? `$\\langle n|x^2|n\\rangle = \\tfrac{\\hbar}{2m\\omega}(2n + 1)$, so $c = (2\\cdot${n} + 1)/2 = ${round(v, 2)}$.`
            : `$\\langle n|x^4|n\\rangle = \\left(\\tfrac{\\hbar}{2m\\omega}\\right)^2(6n^2 + 6n + 3)$, so $c = \\tfrac34(2n^2 + 2n + 1) = \\tfrac34\\times${2 * n * n + 2 * n + 1} = ${round(v, 2)}$.` };
      },
      verify: (p) => (p.k === 2 ? p.n + 0.5 : 0.75 * (2 * p.n ** 2 + 2 * p.n + 1)) },
    { id: 'qpt-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'infinite well',
      make(r) {
        const f = choose(r, [0.25, 0.2, 0.75, 1 / 3]), n = int(r, 1, 3);
        const v = wellStep(n, f), fs = f === 1 / 3 ? 'a/3' : `${f}a`;
        return { q: `A particle in an infinite well $0 < x < a$ feels an extra constant $V_0$ for $0 < x < ${fs}$. The first-order shift of level $n = ${n}$ is $kV_0$ with $k =$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, f, n,
          sol: `$E_n^{(1)} = \\tfrac{2V_0}{a}\\int_0^{b}\\sin^2\\tfrac{n\\pi x}{a}dx = V_0\\left[\\tfrac ba - \\tfrac{1}{2n\\pi}\\sin\\tfrac{2n\\pi b}{a}\\right]$ with $b/a = ${round(f, 4)}$: $${round(f, 4)} - \\tfrac{1}{${2 * n}\\pi}\\sin(${round(2 * n * Math.PI * f, 4)}) = ${round(v, 3)}$.` };
      },
      verify: (p) => { let s = 0; const N = 4000; for (let i = 0; i < N; i++) { const x = (i + 0.5) * p.f / N; s += 2 * Math.sin(p.n * Math.PI * x) ** 2; } return s * p.f / N; } },
    { id: 'qpt-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stark effect',
      make(r) {
        const E = choose(r, [1, 2, 5, 10, 20, 50]), ask = choose(r, ['shift', 'span']);
        const s = 3 * E * 1e6 * 0.0529e-9 * 1e3, v = ask === 'shift' ? s : 2 * s;
        return { q: `Hydrogen in the $n = 2$ level is in a field of $${E}\\times10^6$ V/m. ${ask === 'shift' ? 'The first-order shift of the uppermost Stark component is' : 'The first-order energy gap between the highest and lowest Stark components is'} ______ meV (to three decimal places). Take $a_0 = 0.0529$ nm.`,
          answer: round(v, 3), tol: Math.max(0.002, v * 0.003), E, ask,
          sol: `Shifts: $\\pm3e\\mathcal Ea_0$ and $0$ (twice). $3e\\mathcal Ea_0 = 3\\times${E}\\times10^6\\times5.29\\times10^{-11}$ eV $= ${round(s, 4)}$ meV${ask === 'span' ? `; the full span is twice that, $${round(v, 3)}$ meV` : ''}.` };
      },
      verify: (p) => (p.ask === 'shift' ? 1 : 2) * 3 * p.E * 1e6 * 0.0529e-9 * 1e3 },
    { id: 'qpt-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const w = choose(r, [0.1, 0.2, 0.5, 1]), E = choose(r, [1, 2, 5]); // ħω in eV, field in 1e7 V/m
        const om = w * 1.602e-19 / 1.0546e-34, F = 1.602e-19 * E * 1e7;
        const v = F * F / (2 * 9.109e-31 * om * om) / 1.602e-19 * 1e3;
        return { q: `An electron in a harmonic trap with $\\hbar\\omega = ${w}$ eV is put in a uniform field of $${E}\\times10^7$ V/m. Every level shifts down by ______ meV (to three decimal places). Use $m_e = 9.109\\times10^{-31}$ kg, $\\hbar = 1.0546\\times10^{-34}$ J s, $e = 1.602\\times10^{-19}$ C.`,
          answer: round(v, 3), tol: Math.max(0.002, v * 0.005), w, E,
          sol: `Completing the square (or second-order perturbation theory, which is exact here): $\\Delta E = (e\\mathcal E)^2/2m\\omega^2$. With $\\omega = ${fmtE(om)}$ s$^{-1}$: $\\Delta E = ${round(v, 3)}$ meV, the same for every level.` };
      },
      verify: (p) => { const om = p.w * 1.602e-19 / 1.0546e-34; return (1.602e-19 * p.E * 1e7) ** 2 / (2 * 9.109e-31 * om * om) / 1.602e-19 * 1e3; } },
    { id: 'qpt-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'second order',
      make(r) {
        const e2 = int(r, 1, 4), e3 = e2 + int(r, 1, 5), v2 = choose(r, [0.2, 0.3, 0.5, 1]), v3 = choose(r, [0.2, 0.4, 0.6, 1]), v23 = choose(r, [0.1, 0.5, 0.8]);
        const lvl = choose(r, [1, 3]);
        const v = lvl === 1 ? -(v2 * v2 / e2 + v3 * v3 / e3) : v3 * v3 / e3 + v23 * v23 / (e3 - e2);
        return { q: `$H_0 = \\mathrm{diag}(0, ${e2}, ${e3})$ meV. A perturbation has no diagonal elements and real off-diagonal elements $H\'_{12} = ${v2}$, $H\'_{13} = ${v3}$, $H\'_{23} = ${v23}$ meV. The second-order shift of level ${lvl} (energy ${lvl === 1 ? 0 : e3} meV) is ______ meV (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, e2, e3, v2, v3, v23, lvl,
          sol: lvl === 1
            ? `$E_1^{(2)} = \\dfrac{${v2}^2}{0 - ${e2}} + \\dfrac{${v3}^2}{0 - ${e3}} = ${round(v, 3)}$ meV ($H\'_{23}$ does not enter).`
            : `$E_3^{(2)} = \\dfrac{${v3}^2}{${e3} - 0} + \\dfrac{${v23}^2}{${e3} - ${e2}} = ${round(v, 3)}$ meV: the top level is pushed up by both lower ones ($H\'_{12}$ does not enter).` };
      },
      verify: (p) => (p.lvl === 1 ? -(p.v2 ** 2 / p.e2 + p.v3 ** 2 / p.e3) : p.v3 ** 2 / p.e3 + p.v23 ** 2 / (p.e3 - p.e2)) },
    { id: 'qpt-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'degenerate',
      make(r) {
        const a = choose(r, [0, 1, 2, -1]), c = choose(r, [0, 1, 3, -2]), b = choose(r, [0.5, 1, 1.5, 2]);
        const v = Math.sqrt((a - c) ** 2 + 4 * b * b);
        return { q: `A doubly degenerate level is perturbed; in the original basis $H\' = \\begin{pmatrix}${a} & ${b}\\\\${b} & ${c}\\end{pmatrix}\\epsilon$. The first-order splitting of the level is $k\\epsilon$ with $k =$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, a, b, c,
          sol: `Diagonalise $H\'$ in the degenerate subspace: eigenvalues $\\tfrac{${a} + ${c}}{2} \\pm \\sqrt{\\left(\\tfrac{${a} - ${c}}{2}\\right)^2 + ${b}^2}$. The splitting is $\\sqrt{(${a} - ${c})^2 + 4\\cdot${b}^2} = ${round(v, 3)}$, not the difference of the diagonal elements.`,
          trap: 'Taking $|H\'_{11} - H\'_{22}|$ ignores the mixing.' };
      },
      verify: (p) => Math.hypot(p.a - p.c, 2 * p.b) },
    { id: 'qpt-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'infinite well',
      make(r) {
        const d = choose(r, [2, 3, 4, 6]), n = int(r, 1, 4);
        const v = 2 * Math.sin(n * Math.PI / d) ** 2;
        return { q: `An infinite well $0 < x < a$ has a perturbation $H\' = \\alpha\\,\\delta(x - a/${d})$. The first-order shift of level $n = ${n}$ is $k\\,\\alpha/a$ with $k =$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, d, n,
          sol: `$E_n^{(1)} = \\alpha|\\psi_n(a/${d})|^2 = \\tfrac{2\\alpha}{a}\\sin^2\\tfrac{${n}\\pi}{${d}}$, so $k = 2\\sin^2(${n}\\pi/${d}) = ${round(v, 3)}$. A level with a node at the delta does not feel it.` };
      },
      verify: (p) => 1 - Math.cos(2 * p.n * Math.PI / p.d) },
    { id: 'qpt-g10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const k = int(r, 1, 4);
        const right = { 1: 'second order, negative', 2: 'first order, positive (for $\\lambda > 0$)', 3: 'second order, negative', 4: 'first order, positive (for $\\lambda > 0$)' }[k];
        const all = ['first order, positive (for $\\lambda > 0$)', 'first order, negative (for $\\lambda > 0$)', 'second order, positive', 'second order, negative', 'third order, positive'];
        const o = mcqOptions(r, right, all.filter((s) => s !== right));
        return { q: `An oscillator ground state is perturbed by $H\' = \\lambda x^${k}$ with $\\lambda > 0$ small. The lowest order that gives a non-zero energy shift, and its sign, are`, ...o,
          sol: k % 2 ? `$\\langle0|x^${k}|0\\rangle = 0$ because $x^${k}$ is odd and $|\\psi_0|^2$ even. At second order the ground state always moves down (all denominators negative), and the shift is non-zero because $x^${k}$ connects $|0\\rangle$ to odd states.` : `$\\langle0|x^${k}|0\\rangle > 0$ for an even power, so the shift is already non-zero at first order, with the sign of $\\lambda$.` };
      } },
    { id: 'qpt-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const e = choose(r, [0.1, 0.2, 0.4, 0.6, 1]), n = int(r, 0, 3), what = choose(r, ['exact', 'first']);
        const v = what === 'exact' ? (n + 0.5) * (Math.sqrt(1 + e) - 1) : (n + 0.5) * e / 2;
        return { q: `An oscillator is perturbed by $H\' = \\lambda x^2$ with $2\\lambda/m\\omega^2 = ${e}$. The ${what === 'exact' ? 'exact' : 'first-order'} shift of level $n = ${n}$ is $k\\,\\hbar\\omega$ with $k =$ ______ (to four decimal places).`,
          answer: round(v, 4), tol: Math.max(0.0003, v * 0.002), e, n, what,
          sol: `The new frequency is $\\omega\\sqrt{1 + ${e}}$. Exact shift $(n + \\tfrac12)(\\sqrt{1 + ${e}} - 1)\\hbar\\omega = ${round((n + 0.5) * (Math.sqrt(1 + e) - 1), 4)}\\hbar\\omega$; first order $(n + \\tfrac12)\\cdot\\tfrac{${e}}{2}\\hbar\\omega = ${round((n + 0.5) * e / 2, 4)}\\hbar\\omega$ (from $\\langle n|x^2|n\\rangle = (n + \\tfrac12)\\hbar/m\\omega$).` };
      },
      verify: (p) => (p.what === 'exact' ? (p.n + 0.5) * (Math.sqrt(1 + p.e) - 1) : (p.n + 0.5) * p.e / 2) },
    { id: 'qpt-g12', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      make(r) {
        const d = choose(r, [0, 0.5, 1, 2, 3, 4]), V = choose(r, [0.25, 0.5, 1, 1.5]);
        const v = Math.sqrt(d * d + 4 * V * V);
        return { q: `Two levels with unperturbed separation $${d}$ meV are coupled by a real matrix element $V = ${V}$ meV. The separation of the exact eigenvalues is ______ meV (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, d, V,
          sol: `Gap $= \\sqrt{\\Delta^2 + 4V^2} = \\sqrt{${d}^2 + 4\\times${V}^2} = ${round(v, 3)}$ meV.${d === 0 ? ' At zero detuning this is the minimum gap $2V$ of the avoided crossing.' : ''}` };
      },
      verify: (p) => Math.hypot(p.d, 2 * p.V) },
  ],
};

function fmtE(x) { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(3)}\\times10^{${e}}`; }
