// Extra question shapes for commutators-uncertainty (templates qcu-m31..m35). Imported by commutators-uncertainty.js.
import { int, choose, round, fmt } from '../_util.js';
import { pickMcq, factMcq, oomMcq } from './_more.js';

const AX = ['x', 'y', 'z'];

export default [
  { id: 'qcu-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'angular momentum commutators',
    make(r) {
      const fam = choose(r, [
        { A: (i) => `\\hat L_${AX[i]}`, B: (j) => `\\hat L_${AX[j]}`, K: (k) => `\\hat L_${AX[k]}`, pre: 'i\\hbar', name: '$[L_i, L_j] = i\\hbar\\,\\epsilon_{ijk}L_k$' },
        { A: (i) => `\\hat L_${AX[i]}`, B: (j) => `\\hat ${AX[j]}`, K: (k) => `\\hat ${AX[k]}`, pre: 'i\\hbar', name: '$[L_i, x_j] = i\\hbar\\,\\epsilon_{ijk}x_k$ (position is a vector operator)' },
        { A: (i) => `\\hat L_${AX[i]}`, B: (j) => `\\hat p_${AX[j]}`, K: (k) => `\\hat p_${AX[k]}`, pre: 'i\\hbar', name: '$[L_i, p_j] = i\\hbar\\,\\epsilon_{ijk}p_k$ (momentum is a vector operator)' },
        { A: (i) => `\\sigma_${AX[i]}`, B: (j) => `\\sigma_${AX[j]}`, K: (k) => `\\sigma_${AX[k]}`, pre: '2i', name: '$[\\sigma_i, \\sigma_j] = 2i\\,\\epsilon_{ijk}\\sigma_k$' },
      ]);
      const i = int(r, 0, 2), same = r() < 0.2, j = same ? i : (i + int(r, 1, 2)) % 3;
      const k = 3 - i - j, sg = same ? 0 : ((j - i + 3) % 3 === 1 ? 1 : -1);
      const term = (s, kk) => `$${s < 0 ? '-' : ''}${fam.pre}\\,${fam.K(kk)}$`;
      const kk = same ? (i + 1) % 3 : k;
      const correct = same ? '$0$' : term(sg, k);
      const ws = same ? [term(1, kk), term(-1, kk), term(1, (i + 2) % 3), `$${fam.pre}\\,${fam.A(i)}$`] : [term(-sg, k), '$0$', term(sg, i), term(sg, j), term(-sg, i)];
      const o = pickMcq(r, correct, ws);
      return { q: `The commutator $[${fam.A(i)}, ${fam.B(j)}]$ equals`, ...o,
        sol: `Use ${fam.name}. ${same ? `Here both indices are $${AX[i]}$, and $\\epsilon_{iik} = 0$, so the commutator vanishes.` : `With $i = ${AX[i]}$, $j = ${AX[j]}$ the remaining index is $k = ${AX[k]}$, and $(${AX[i]}, ${AX[j]}, ${AX[k]})$ is ${sg > 0 ? 'a cyclic' : 'an anticyclic'} order, so $\\epsilon_{ijk} = ${sg}$. The commutator is ${correct}.`}`,
        trap: 'Getting the sign from the order: $xyz$, $yzx$, $zxy$ are $+1$; reversing the first two indices flips the sign.' };
    } },
  { id: 'qcu-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Robertson relation',
    make(r) {
      const l = int(r, 1, 4), m = int(r, -l, l), bound = r() < 0.5;
      const L2 = l * (l + 1), act = (L2 - m * m) / 2, rb = Math.abs(m) / 2;
      const sh = (v) => `$${v === 0 ? '0' : `${round(v, 2)}\\hbar^2`}$`;
      const correct = bound ? sh(rb) : sh(act);
      const o = pickMcq(r, correct, [sh(bound ? act : rb), sh(Math.abs(m)), sh(L2 / 2), sh(L2 - m * m), sh((l * l - m * m) / 2), sh(L2)]);
      return { q: bound
        ? `For a particle in the state $|l = ${l}, m = ${m}\\rangle$, the Robertson lower bound on $\\Delta L_x\\,\\Delta L_y$ is`
        : `For a particle in the state $|l = ${l}, m = ${m}\\rangle$, the actual product $\\Delta L_x\\,\\Delta L_y$ is`, ...o,
        sol: `The Robertson bound is $\\Delta L_x\\Delta L_y \\ge \\tfrac12|\\langle[L_x, L_y]\\rangle| = \\tfrac{\\hbar}{2}|\\langle L_z\\rangle| = \\tfrac{|m|}{2}\\hbar^2 = ${round(rb, 2)}\\hbar^2$. The actual spreads: $\\langle L_x\\rangle = \\langle L_y\\rangle = 0$ and by symmetry $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\tfrac12(\\langle L^2\\rangle - \\langle L_z^2\\rangle) = \\tfrac12[l(l+1) - m^2]\\hbar^2$, so $\\Delta L_x\\Delta L_y = \\tfrac12[${L2} - ${m * m}]\\hbar^2 = ${round(act, 2)}\\hbar^2$. ${act === rb ? 'Here the bound is reached (the state is a stretched state, $|m| = l$).' : 'It exceeds the bound, as it must.'}`,
        trap: 'The bound uses $\\langle L_z\\rangle = m\\hbar$, not $\\langle L^2\\rangle$; the actual product uses $\\langle L_x^2\\rangle = \\tfrac12[l(l+1) - m^2]\\hbar^2$.' };
    } },
  { id: 'qcu-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'commutator identities', format: 'which is NOT',
    make(r) {
      const n = int(r, 3, 6);
      const T = [
        ['$[A, BC] = [A, B]C + B[A, C]$', 'Expand: $ABC - BCA = (AB - BA)C + B(AC - CA)$.'],
        ['$[AB, C] = A[B, C] + [A, C]B$', 'Expand: $ABC - CAB = A(BC - CB) + (AC - CA)B$.'],
        ['$[A, [B, C]] + [B, [C, A]] + [C, [A, B]] = 0$', 'This is the Jacobi identity; all twelve terms cancel in pairs.'],
        [`$[\\hat x, \\hat p^{${n}}] = ${n}i\\hbar\\,\\hat p^{${n - 1}}$`, 'Since $[\\hat x, f(\\hat p)] = i\\hbar f\'(\\hat p)$.'],
        [`$[\\hat p, \\hat x^{${n}}] = -${n}i\\hbar\\,\\hat x^{${n - 1}}$`, 'Since $[\\hat p, f(\\hat x)] = -i\\hbar f\'(\\hat x)$.'],
        ['$[A, B]^\\dagger = [B^\\dagger, A^\\dagger]$', '$(AB - BA)^\\dagger = B^\\dagger A^\\dagger - A^\\dagger B^\\dagger$.'],
      ];
      const F = [
        ['$[A, BC] = [A, B]C + [A, C]B$', 'The correct form is $[A, B]C + B[A, C]$: operators do not commute, so $B$ must stay on the left of $[A, C]$.'],
        [`$[\\hat x, \\hat p^{${n}}] = i\\hbar\\,\\hat p^{${n - 1}}$`, `The factor $${n}$ from differentiating $\\hat p^{${n}}$ is missing.`],
        [`$[\\hat p, \\hat x^{${n}}] = ${n}i\\hbar\\,\\hat x^{${n - 1}}$`, 'The sign is wrong: $[\\hat p, \\hat x] = -i\\hbar$.'],
        ['$[A, B]^\\dagger = [A^\\dagger, B^\\dagger]$', 'Taking the adjoint reverses products, so $[A, B]^\\dagger = [B^\\dagger, A^\\dagger] = -[A^\\dagger, B^\\dagger]$.'],
        ['$e^{A}e^{B} = e^{A + B}$ for all operators $A$, $B$', 'This holds only when $[A, B] = 0$ (Baker-Campbell-Hausdorff adds $\\tfrac12[A, B]$ and more).'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `Which ONE of the following ${not ? 'is <b>NOT</b> a valid identity' : 'is a valid identity'} for operators (with $[\\hat x, \\hat p] = i\\hbar$)?`, ...o,
        trap: 'Order matters in every product of operators; signs come from $[\\hat x, \\hat p] = +i\\hbar$.' };
    } },
  { id: 'qcu-m34', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'uncertainty estimates', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['an electron', 9.109e-31, 'confined within an atom of size', 1e-10, 'm'],
        ['an electron', 9.109e-31, 'confined in a quantum dot of size', 1e-8, 'm'],
        ['a proton', 1.673e-27, 'confined in a nucleus of size', 5e-15, 'm'],
        ['a rubidium-87 atom', 1.443e-25, 'held in an optical trap of size', 1e-6, 'm'],
        ['a dust grain of mass 1 μg', 1e-9, 'located to within', 1e-6, 'm'],
        ['a neutron', 1.675e-27, 'confined in a nucleus of size', 8e-15, 'm'],
      ]);
      const f = choose(r, [1, 2, 3]);
      const dx = S[3] * f, dv = 1.0546e-34 / (2 * S[1] * dx);
      const o = oomMcq(r, dv, 'm/s');
      const dxs = fmt(dx, 2);
      return { q: `Treat the size as the position uncertainty $\\Delta x$. For ${S[0]} ${S[2]} $${dxs}$ m, the minimum velocity uncertainty $\\Delta v = \\hbar/(2m\\Delta x)$ is closest to`, ...o,
        sol: `$\\Delta v = \\dfrac{\\hbar}{2m\\Delta x} = \\dfrac{1.055\\times10^{-34}}{2\\times${fmt(S[1], 4)}\\times${dxs}} \\approx ${fmt(dv, 2)}$ m/s, so the nearest power of ten is $10^{${o.k}}$ m/s. ${dv > 1e5 ? 'This is a large speed: confinement on this scale makes the particle move fast.' : 'Quantum jitter is tiny here.'}`,
        trap: 'Using $h$ instead of $\\hbar/2$ changes the result by a factor of about 12, i.e. one power of ten.' };
    } },
  { id: 'qcu-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'wave-packet evolution', format: 'graph in words',
    make(r) {
      const O = {
        grow: 'it grows without bound, eventually linearly in $t$',
        const: 'it stays constant in time',
        osc: 'it oscillates at angular frequency $2\\omega$ between two values',
        oscw: 'it oscillates at angular frequency $\\omega$',
        decay: 'it shrinks steadily towards zero',
      };
      const C = choose(r, [
        ['a free particle prepared as a minimum-uncertainty Gaussian packet', '\\Delta x', 'grow', '$\\Delta x(t) = \\sigma_0\\sqrt{1 + (\\hbar t/2m\\sigma_0^2)^2}$, which tends to $\\hbar t/2m\\sigma_0$ at late times.'],
        ['a free particle prepared as a minimum-uncertainty Gaussian packet', '\\Delta p', 'const', 'For a free particle $[\\hat p, H] = 0$, so the whole momentum distribution, and hence $\\Delta p$, is conserved.'],
        ['a free particle prepared as a minimum-uncertainty Gaussian packet', '\\Delta x\\,\\Delta p', 'grow', '$\\Delta p$ is fixed while $\\Delta x$ spreads, so the product grows (linearly at late times).'],
        ['a harmonic oscillator in a coherent state', '\\Delta x', 'const', 'A coherent state keeps the ground-state shape; only its centre moves, so $\\Delta x = \\sqrt{\\hbar/2m\\omega}$ always.'],
        ['a harmonic oscillator in a coherent state', '\\Delta x\\,\\Delta p', 'const', 'It stays at the minimum value $\\hbar/2$ at all times.'],
        ['a harmonic oscillator in a squeezed Gaussian state centred at the origin (narrower than the ground state)', '\\Delta x', 'osc', 'The Gaussian rotates in phase space with period $2\\pi/\\omega$, so its width along $x$ returns twice per period: $\\Delta x^2 \\propto e^{-2r}\\cos^2\\omega t + e^{2r}\\sin^2\\omega t$.'],
        ['a harmonic oscillator in a squeezed Gaussian state centred at the origin (narrower than the ground state)', '\\Delta p', 'osc', 'Like $\\Delta x$, $\\Delta p$ breathes at $2\\omega$, being largest when $\\Delta x$ is smallest.'],
      ]);
      const o = pickMcq(r, O[C[2]], Object.keys(O).filter((k) => k !== C[2]).map((k) => O[k]));
      return { q: `For ${C[0]}, how does $${C[1]}$ change with time?`, ...o, sol: C[3],
        trap: 'Only the free particle spreads for ever; in an oscillator the potential refocuses the packet every half period.' };
    } },
];
