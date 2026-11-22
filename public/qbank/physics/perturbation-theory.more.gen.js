// Extra question shapes for perturbation-theory (templates qpt-m31..m35). Imported by perturbation-theory.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq } from './_more.js';

export default [
  { id: 'qpt-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'symmetry and first-order shifts',
    make(r) {
      const sys = choose(r, [
        { name: 'level $n$ of a one-dimensional harmonic oscillator', zero: ['\\lambda x', '\\lambda x^3', '\\lambda x|x|', '\\lambda x^5'], non: ['\\lambda x^2', '\\lambda x^4', '\\lambda|x|', '\\lambda x^6'], why: 'Every oscillator eigenfunction has definite parity, so $|\\psi_n|^2$ is even and the integral of an odd perturbation vanishes; an even, positive-definite perturbation gives a non-zero average.' },
        { name: 'any level of a symmetric infinite well $-L/2 < x < L/2$', zero: ['\\lambda x', '\\lambda x^3', '\\lambda\\sin(2\\pi x/L)'], non: ['\\lambda x^2', '\\lambda|x|', '\\lambda x^4'], why: 'The eigenfunctions have definite parity about the centre, so odd perturbations average to zero; the even ones listed are non-negative and not identically zero where $|\\psi|^2 > 0$.' },
        { name: 'the ground state (1s) of hydrogen', zero: ['\\lambda z', '\\lambda xy', '\\lambda(x^2 - y^2)', '\\lambda(3z^2 - r^2)', '\\lambda xyz'], non: ['\\lambda z^2', '\\lambda r', '\\lambda(x^2 + y^2)', '\\lambda/r'], why: 'The 1s density is spherically symmetric, so $\\langle x^2\\rangle = \\langle y^2\\rangle = \\langle z^2\\rangle = \\langle r^2\\rangle/3$ and all odd averages vanish. That kills $z$, $xy$, $xyz$ and also the "quadrupole" combinations $x^2 - y^2$ and $3z^2 - r^2$.' },
      ]);
      const askZero = r() < 0.5;
      const [good, bad] = askZero ? [sys.zero, sys.non] : [sys.non, sys.zero];
      const sh = (s) => `$H' = ${s}$`;
      const o = pickMcq(r, sh(choose(r, good)), bad.map(sh));
      return { q: `For ${sys.name}, which ONE perturbation gives a ${askZero ? '<b>zero</b>' : '<b>non-zero</b>'} first-order energy shift ($\\lambda \\ne 0$)?`, ...o,
        sol: `The first-order shift is $\\langle\\psi|H'|\\psi\\rangle$. ${sys.why}`,
        trap: 'An even function is not enough to guarantee a non-zero shift for a spherical state: $3z^2 - r^2$ is even but averages to zero over a sphere.' };
    } },
  { id: 'qpt-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'general results', format: 'statements',
    make(r) {
      const k = int(r, 2, 4);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['The second-order correction to the ground-state energy is never positive', true, 'Every term $|H\'_{m0}|^2/(E_0 - E_m)$ has a negative denominator.'],
        ['Second-order coupling pushes two levels apart (level repulsion)', true, 'The lower level is pushed down and the upper one up by $|V|^2/\\Delta E$.'],
        ['$E_0^{(0)} + E_0^{(1)}$ is an upper bound on the exact ground-state energy', true, 'It equals $\\langle 0|H|0\\rangle$, a variational estimate with the unperturbed ground state as trial function.'],
        ['If the first-order shift vanishes, the second-order shift vanishes too', false, 'They are unrelated: $\\lambda x$ on an oscillator has zero first-order shift but a second-order shift $-\\lambda^2/2m\\omega^2$.'],
        [`If every matrix element of $H'$ is multiplied by ${k}, the second-order shifts are multiplied by ${k * k}`, true, `Second order is quadratic in $H'$: $${k}^2 = ${k * k}$.`],
        [`If every matrix element of $H'$ is multiplied by ${k}, the second-order shifts are multiplied by ${k}`, false, `Second order is quadratic: the factor is $${k * k}$.`],
        ['For a degenerate level, the correct zeroth-order states diagonalise $H\'$ within the degenerate subspace', true, 'Otherwise the denominators $E_n - E_m$ vanish and the series breaks down.'],
        ['The first-order correction to $|n\\rangle$ has a component along $|n\\rangle$ that fixes the energy shift', false, 'By convention (normalisation to first order) it has no component along $|n\\rangle$; the energy shift comes from $\\langle n|H\'|n\\rangle$.'],
        ['If $[H\', H_0] = 0$ and $H_0$ is non-degenerate, all shifts beyond first order vanish', true, 'Then $H\'$ is diagonal in the $|n\\rangle$ basis and $E_n = E_n^{(0)} + H\'_{nn}$ exactly.'],
      ], { not });
      return { q: `Which statements about time-independent perturbation theory are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The sign rule for second order applies to the ground state (and the top of a bounded spectrum), not to every level.' };
    } },
  { id: 'qpt-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'avoided crossing', format: 'graph in words',
    make(r) {
      const V = round(0.1 * int(r, 1, 20), 1), mode = int(r, 0, 2);
      if (mode === 0) {
        const slow = r() < 0.5;
        const O = { lower: 'it stays on the lower adiabatic level, so it ends up mostly in $|2\\rangle$', dia: 'it stays in $|1\\rangle$, jumping across the gap to the upper adiabatic level', half: 'it ends in an equal mixture of $|1\\rangle$ and $|2\\rangle$ whatever the sweep rate', ground: 'it always ends in $|1\\rangle$ on the lower level, because the levels never cross' };
        const key = slow ? 'lower' : 'dia';
        const o = pickMcq(r, O[key], Object.keys(O).filter((k) => k !== key).map((k) => O[k]));
        return { q: `Two diabatic states $|1\\rangle$, $|2\\rangle$ have energies that cross linearly in $\\lambda$, coupled by $V = ${V}$ meV. A system starts far before the crossing in the lower level, which is then essentially $|1\\rangle$. $\\lambda$ is swept through the crossing ${slow ? '<b>very slowly</b> (the sweep takes much longer than $\\hbar/V$ to cross the gap region)' : '<b>very quickly</b> (much faster than $\\hbar/V$)'}. Far beyond the crossing,`, ...o,
          sol: slow
            ? 'A slow sweep is adiabatic: the system follows the lower eigenstate, which changes character from $|1\\rangle$ before the crossing to $|2\\rangle$ after it (rapid adiabatic passage). The Landau-Zener probability of a jump, $e^{-2\\pi V^2/\\hbar|\\dot{\\Delta}|}$, is tiny.'
            : 'A fast sweep is sudden: the state has no time to change, so it stays $|1\\rangle$, which after the crossing is the upper adiabatic level. The Landau-Zener jump probability $e^{-2\\pi V^2/\\hbar|\\dot{\\Delta}|}$ is close to 1.',
          trap: 'Adiabatic means "stays on the same energy curve", not "stays in the same basis state".' };
      }
      if (mode === 1) {
        const o = pickMcq(r, '$\\tfrac{1}{\\sqrt2}(|1\\rangle \\pm |2\\rangle)$, equal mixtures', ['$|1\\rangle$ and $|2\\rangle$ unchanged', 'mostly $|1\\rangle$ for both levels', '$\\tfrac{1}{2}|1\\rangle \\pm \\tfrac{\\sqrt3}{2}|2\\rangle$', 'not determined, because the gap closes there']);
        return { q: `Two levels $|1\\rangle$, $|2\\rangle$ have diabatic energies that cross at $\\lambda_0$, and are coupled by a real constant $V = ${V}$ meV. Exactly at $\\lambda_0$, the eigenstates of the full Hamiltonian are`, ...o,
          sol: `At $\\lambda_0$ the Hamiltonian is $\\begin{pmatrix}E & V\\\\ V & E\\end{pmatrix}$, whose eigenvectors are $(|1\\rangle \\pm |2\\rangle)/\\sqrt2$ with energies $E \\pm V$, whatever the size of $V$. Far from the crossing each eigenstate is again nearly a single diabatic state.`,
          trap: 'Degenerate perturbation theory applies at the crossing: even a tiny $V$ mixes the states fully.' };
      }
      const o = pickMcq(r, 'the exact levels approach the diabatic lines, with shifts falling off as $V^2/\\Delta E$', ['the shifts stay equal to $\\pm V$ however far one goes', 'the exact levels cross the diabatic lines and swap sides', 'the shifts fall off as $V/\\Delta E$', 'the shifts grow linearly with $\\Delta E$']);
      return { q: `Two diabatic levels separated by $\\Delta E(\\lambda) = E_2 - E_1$ are coupled by a constant $V = ${V}$ meV. Far from the avoided crossing ($|\\Delta E| \\gg V$),`, ...o,
        sol: '$\\sqrt{(\\Delta E/2)^2 + V^2} \\approx |\\Delta E|/2 + V^2/|\\Delta E|$, so each level is shifted away from the other by $V^2/|\\Delta E|$: second-order perturbation theory.',
        trap: 'The first-order shift is zero (no diagonal elements); the leading effect is second order.' };
    } },
  { id: 'qpt-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dependence on quantum number', format: 'match the system',
    make(r) {
      const O = {
        indep: 'it is the same for every level',
        lin: 'it grows linearly with $n$',
        quad: 'it grows as $n^2$ for large $n$',
        alt: 'it is zero for every other level and the same for the rest',
      };
      const C = choose(r, [
        ['a harmonic oscillator perturbed by $\\lambda x^2$ (first order)', 'lin', '$\\langle n|x^2|n\\rangle = \\tfrac{\\hbar}{m\\omega}(n + \\tfrac12)$: linear in $n$.'],
        ['a harmonic oscillator perturbed by $\\lambda x^4$ (first order)', 'quad', '$\\langle n|x^4|n\\rangle = \\tfrac34\\left(\\tfrac{\\hbar}{m\\omega}\\right)^2(2n^2 + 2n + 1)$: quadratic in $n$.'],
        ['a harmonic oscillator perturbed by $\\lambda x$ (second order, which here is exact)', 'indep', 'Completing the square shifts every level by $-\\lambda^2/2m\\omega^2$.'],
        ['an infinite well $0 < x < L$ perturbed by $\\lambda x$ (first order)', 'indep', '$|\\psi_n|^2$ is symmetric about $L/2$, so $\\langle x\\rangle = L/2$ and every level shifts by $\\lambda L/2$.'],
        ['an infinite well $0 < x < L$ perturbed by $\\alpha\\,\\delta(x - L/2)$ (first order)', 'alt', '$|\\psi_n(L/2)|^2 = \\tfrac2L\\sin^2(n\\pi/2)$: $2/L$ for odd $n$ and $0$ for even $n$.'],
        ['an infinite well $0 < x < L$ perturbed by a constant $V_0$ over the whole well (first order)', 'indep', 'A constant just shifts every energy by $V_0$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `For ${C[0]}, how does the energy shift of level $n$ depend on $n$?`, ...o, sol: C[2],
        trap: 'Higher powers of $x$ weight the outer, wider parts of high-$n$ states more heavily, so the $n$-dependence gets steeper.' };
    } },
  { id: 'qpt-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Stark effect', format: 'which is NOT',
    make(r) {
      const lin = ['hydrogen in the $n = 2$ level', 'hydrogen in the $n = 3$ level', 'a symmetric-top molecule in a state with $K \\ne 0$ and $M \\ne 0$'];
      const quad = ['hydrogen in its 1s ground state', 'a sodium atom in its 3s ground state', 'a charged particle in a 1D harmonic trap (ground state)', 'a linear rigid rotor in its $J = 0$ state', 'a sodium atom in its 3p level'];
      const askLin = r() < 0.5;
      const o = askLin ? pickMcq(r, choose(r, lin), quad) : pickMcq(r, choose(r, quad), lin);
      return { q: `In a weak uniform electric field $\\mathcal E$, which ONE of these shows ${askLin ? 'a <b>linear</b> (first-order)' : '<b>no</b> linear'} Stark shift?`, ...o,
        sol: 'A linear shift needs a non-zero $\\langle\\psi|\\vec d|\\psi\\rangle$ within the (possibly degenerate) level, which requires degenerate states of opposite parity. Hydrogen levels with $n \\ge 2$ have degenerate $l$ states of opposite parity ($2s$ and $2p$), and a symmetric top with $K, M \\ne 0$ has a fixed dipole projection. Non-degenerate states (1s hydrogen, sodium 3s, the oscillator ground state, a rotor in $J = 0$) and the sodium 3p level (its $l$-degeneracy with 3s is lifted by the core) have zero permanent dipole, so their shifts start at order $\\mathcal E^2$.',
        trap: 'Sodium is "hydrogen-like" but its $s$ and $p$ levels are not degenerate, so there is no linear Stark effect.' };
    } },
];
