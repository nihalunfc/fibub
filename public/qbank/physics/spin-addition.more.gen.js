// Extra question shapes for spin-addition (templates qsa-m31..m35). Imported by spin-addition.js.
import { int, choose, shuffle } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

const fct = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
/** Clebsch-Gordan coefficient <j1 m1; j2 m2 | J M> (Racah formula). */
function cg(j1, m1, j2, m2, J, M) {
  if (Math.abs(m1 + m2 - M) > 1e-9 || J < Math.abs(j1 - j2) - 1e-9 || J > j1 + j2 + 1e-9 || Math.abs(M) > J + 1e-9) return 0;
  const R = (x) => Math.round(x);
  const pre = Math.sqrt((2 * J + 1) * fct(R(J + j1 - j2)) * fct(R(J - j1 + j2)) * fct(R(j1 + j2 - J)) / fct(R(j1 + j2 + J + 1)))
    * Math.sqrt(fct(R(J + M)) * fct(R(J - M)) * fct(R(j1 - m1)) * fct(R(j1 + m1)) * fct(R(j2 - m2)) * fct(R(j2 + m2)));
  let s = 0;
  for (let k = 0; k <= 20; k++) {
    const a = [k, R(j1 + j2 - J - k), R(j1 - m1 - k), R(j2 + m2 - k), R(J - j2 + m1 + k), R(J - j1 - m2 + k)];
    if (a.some((x) => x < 0)) continue;
    s += (k % 2 ? -1 : 1) / a.reduce((p, x) => p * fct(x), 1);
  }
  return pre * s;
}
const hf = (x) => (Number.isInteger(x) ? `${x}` : `${x < 0 ? '-' : ''}\\tfrac{${Math.abs(2 * x)}}{2}`);

export default [
  { id: 'qsa-m31', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Clebsch-Gordan coefficients', format: 'which is zero',
    make(r) {
      const j1 = 1, j2 = r() < 0.5 ? 0.5 : 1;
      const lab = (m1, m2, J, M) => `$\\langle ${j1}\\ ${hf(m1)};\\ ${hf(j2)}\\ ${hf(m2)}\\,|\\,${hf(J)}\\ ${hf(M)}\\rangle$`;
      const all = [];
      for (const m1 of [-1, 0, 1]) for (const m2 of (j2 === 1 ? [-1, 0, 1] : [-0.5, 0.5])) for (let J = Math.abs(j1 - j2); J <= j1 + j2 + 1e-9; J++) {
        const M = m1 + m2; if (Math.abs(M) <= J) all.push([m1, m2, J, M, cg(j1, m1, j2, m2, J, M)]);
      }
      const nz = all.filter((x) => Math.abs(x[4]) > 1e-9);
      const kind = j2 === 1 ? int(r, 0, 2) : int(r, 0, 1);
      const b = choose(r, nz);
      let c, why;
      if (kind === 0) {
        const M2 = Math.abs(b[3] + 1) <= b[2] ? b[3] + 1 : b[3] - 1;
        c = lab(b[0], b[1], b[2], M2); why = `Here $M = ${hf(M2)}$ but $m_1 + m_2 = ${hf(b[0] + b[1])}$: $J_z = J_{1z} + J_{2z}$ forces $M = m_1 + m_2$.`;
      } else if (kind === 1) {
        c = lab(b[0], b[1], j1 + j2 + 1, b[3]); why = `$J = ${hf(j1 + j2 + 1)}$ is outside the triangle range $|j_1 - j_2| \\le J \\le j_1 + j_2 = ${hf(j1 + j2)}$.`;
      } else {
        c = lab(0, 0, 1, 0); why = 'This one vanishes by symmetry: the $J = 1$ states of two spin-1 systems are antisymmetric under exchange, while $|0\\rangle|0\\rangle$ is symmetric, so the overlap is zero even though $M = m_1 + m_2$ and the triangle rule are satisfied.';
      }
      const o = pickMcq(r, c, nz.filter((x) => x !== b).map((x) => lab(x[0], x[1], x[2], x[3])));
      return { q: `Which ONE of these Clebsch-Gordan coefficients is zero?`, ...o,
        sol: `${why} The other options satisfy $M = m_1 + m_2$ and the triangle rule and are non-zero (for example by the explicit tables or the Racah formula).`,
        trap: 'Besides the two selection rules, $\\langle j\\,0; j\\,0|J\\,0\\rangle$ vanishes whenever $2j + J$ is odd, an exchange-symmetry zero.' };
    } },
  { id: 'qsa-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'two-spin states', format: 'statements',
    make(r) {
      const S = choose(r, [
        ['|{\\uparrow\\uparrow}\\rangle', [1, 1, 0, 1, 0], 'It is the triplet state $|1, 1\\rangle$, a product state.'],
        ['\\tfrac{1}{\\sqrt2}(|{\\uparrow\\downarrow}\\rangle - |{\\downarrow\\uparrow}\\rangle)', [1, 1, 1, 0, 1], 'It is the singlet $|0, 0\\rangle$.'],
        ['\\tfrac{1}{\\sqrt2}(|{\\uparrow\\downarrow}\\rangle + |{\\downarrow\\uparrow}\\rangle)', [1, 1, 1, 1, 1], 'It is the triplet state $|1, 0\\rangle$.'],
        ['|{\\uparrow\\downarrow}\\rangle', [0, 1, 0, 0, 1], 'It is $\\tfrac{1}{\\sqrt2}(|1,0\\rangle + |0,0\\rangle)$, a mixture of $S = 1$ and $S = 0$.'],
        ['\\tfrac{1}{\\sqrt2}(|{\\uparrow\\uparrow}\\rangle + |{\\downarrow\\downarrow}\\rangle)', [1, 0, 1, 1, 0], 'It is $\\tfrac{1}{\\sqrt2}(|1,1\\rangle + |1,-1\\rangle)$: all $S = 1$, but $M = \\pm1$ mixed.'],
      ]);
      const [s2, sz, ent, sym, z0] = S[1];
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['It is an eigenstate of the total $\\vec S^2$', !!s2, S[2]],
        ['It is an eigenstate of the total $S_z$', !!sz, sz ? 'Every term has the same total $M$.' : 'It mixes $M = +1$ and $M = -1$.'],
        ['It is entangled (not a product of one-spin states)', !!ent, ent ? 'No choice of single-spin states gives it as a product.' : 'It is a product of single-spin states.'],
        ['It is symmetric under exchange of the two spins', !!sym, sym ? 'Swapping the spins leaves it unchanged.' : 'Swapping the spins does not return the same state (the singlet changes sign; $|{\\uparrow\\downarrow}\\rangle$ becomes $|{\\downarrow\\uparrow}\\rangle$).'],
        ['A measurement of the total $S_z$ gives $0$ with certainty', !!z0, z0 ? 'Every term has one spin up and one down.' : 'The total $S_z$ is not zero in every term.'],
        ['It has total spin $S = 0$', S[0].includes('- |'), S[0].includes('- |') ? 'The singlet is the only $S = 0$ state of two spins.' : 'It is not the singlet, so it is not a pure $S = 0$ state.'],
        ['It is an eigenstate of $\\vec S_1\\cdot\\vec S_2$', !!s2, `$\\vec S_1\\cdot\\vec S_2 = \\tfrac12(\\vec S^2 - \\tfrac32\\hbar^2)$, so it has the same eigenstates as $\\vec S^2$. ${S[2]}`],
      ], { not });
      return { q: `Two spin-$\\tfrac12$ particles are in the state $${S[0]}$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: '$|{\\uparrow\\downarrow}\\rangle$ has definite $S_z = 0$ but no definite total spin: it is half singlet, half triplet.' };
    } },
  { id: 'qsa-m33', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Stern-Gerlach', format: 'match the system',
    make(r) {
      const A = choose(r, [
        ['hydrogen', 2, 0, 0.5], ['silver', 2, 0, 0.5], ['helium', 1, 0, 0], ['oxygen', 3, 1, 2], ['nitrogen', 4, 0, 1.5],
        ['chromium', 7, 0, 3], ['iron', 5, 2, 4], ['aluminium', 2, 1, 0.5], ['chlorine', 2, 1, 1.5], ['carbon', 3, 1, 0], ['manganese', 6, 0, 2.5],
      ]);
      const [name, mult, L, J] = A;
      const term = `{}^{${mult}}\\mathrm{${'SPDFG'[L]}}_{${hf(J)}}`;
      const ans = 2 * J + 1;
      const o = pickMcq(r, `${ans}`, [mult, 2 * L + 1, mult * (2 * L + 1), ans + 1, ans === 1 ? 3 : ans - 1, ans + 2, ans + 3].map(String));
      return { q: `A beam of ground-state ${name} atoms (ground level $${term}$) passes through a Stern-Gerlach magnet with a weak, inhomogeneous field. Into how many beams does it split?`, ...o,
        sol: `In a weak field the atom keeps its total angular momentum $J = ${hf(J)}$, and the force depends on $M_J$, which takes $2J + 1 = ${ans}$ values. ${ans === 1 ? 'With $J = 0$ there is no magnetic moment, so the beam is not split.' : `(If a sublevel had $g_JM_J = 0$ it would go straight through, but it still counts as a beam.)`} The multiplicity $2S + 1 = ${mult}$ and $2L + 1 = ${2 * L + 1}$ are tempting but wrong.`,
        trap: 'The superscript $2S + 1$ is not the number of beams; the subscript $J$ is what counts.' };
    } },
  { id: 'qsa-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Pauli matrices', format: 'which is NOT',
    make(r) {
      const p = choose(r, [['x', 'y', 'z'], ['y', 'z', 'x'], ['z', 'x', 'y']]), [a, b, c] = p;
      const T = [
        [`$\\sigma_${a}^2 = I$`, 'Every Pauli matrix squares to the identity.'],
        [`$\\mathrm{Tr}\\,\\sigma_${b} = 0$`, 'All three are traceless.'],
        [`$\\det\\sigma_${c} = -1$`, 'Eigenvalues $+1$ and $-1$ give determinant $-1$.'],
        [`$\\sigma_${a}\\sigma_${b} = i\\sigma_${c}$`, `$(${a}, ${b}, ${c})$ is cyclic, so $\\sigma_${a}\\sigma_${b} = i\\sigma_${c}$.`],
        [`$\\sigma_${a}\\sigma_${b} + \\sigma_${b}\\sigma_${a} = 0$`, 'Different Pauli matrices anticommute.'],
        [`$[\\sigma_${a}, \\sigma_${b}] = 2i\\sigma_${c}$`, `$i\\sigma_${c} - (-i\\sigma_${c}) = 2i\\sigma_${c}$.`],
      ];
      const F = [
        [`$\\sigma_${a}\\sigma_${b} = \\sigma_${b}\\sigma_${a}$`, 'They anticommute, so $\\sigma_' + b + '\\sigma_' + a + ' = -\\sigma_' + a + '\\sigma_' + b + '$.'],
        [`$\\sigma_${b}\\sigma_${a} = i\\sigma_${c}$`, `Reversing the order flips the sign: $\\sigma_${b}\\sigma_${a} = -i\\sigma_${c}$.`],
        [`$\\det\\sigma_${c} = +1$`, 'The eigenvalues are $\\pm1$, so the determinant is $-1$.'],
        [`$[\\sigma_${a}, \\sigma_${b}] = i\\sigma_${c}$`, `The factor is $2i$; $[S_${a}, S_${b}] = i\\hbar S_${c}$ only after $S = \\hbar\\sigma/2$.`],
        [`$\\mathrm{Tr}(\\sigma_${a}\\sigma_${a}) = 0$`, `$\\sigma_${a}^2 = I$, whose trace is 2.`],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `For the Pauli matrices, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'The spin commutator has $i\\hbar$, but the Pauli commutator has $2i$ because $S = \\tfrac{\\hbar}{2}\\sigma$.' };
    } },
  { id: 'qsa-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'addition of angular momenta', format: 'which is NOT',
    make(r) {
      const j1 = choose(r, [0.5, 1, 1.5, 2, 2.5, 3]), j2 = choose(r, [0.5, 1, 1.5, 2]);
      const lo = Math.abs(j1 - j2), hi = j1 + j2;
      const allowed = []; for (let J = lo; J <= hi + 1e-9; J++) allowed.push(J);
      const bad = [hi + 1, hi + 2, lo + 0.5, hi - 0.5, ...(lo >= 1 ? [lo - 1] : [])].filter((x) => x >= 0 && !allowed.some((y) => Math.abs(y - x) < 1e-9));
      const not = allowed.length >= 3 && r() < 0.6;
      const sh = (x) => `$J = ${hf(x)}$`;
      const o = not ? pickMcq(r, sh(choose(r, bad)), allowed.map(sh)) : pickMcq(r, sh(choose(r, allowed)), bad.map(sh));
      return { q: `Angular momenta $j_1 = ${hf(j1)}$ and $j_2 = ${hf(j2)}$ are combined. Which ONE value of the total $J$ is ${not ? '<b>NOT</b> possible' : 'possible'}?`, ...o,
        sol: `$J$ runs from $|j_1 - j_2| = ${hf(lo)}$ to $j_1 + j_2 = ${hf(hi)}$ in integer steps: ${allowed.map((x) => `$${hf(x)}$`).join(', ')}. Values outside this range, or differing from it by a half-integer, cannot occur. (Check: $\\sum(2J + 1) = ${allowed.reduce((s, x) => s + 2 * x + 1, 0)} = (2j_1 + 1)(2j_2 + 1)$.)`,
        trap: 'Integer plus half-integer always gives half-integer $J$; $J$ never jumps by $\\tfrac12$.' };
    } },
];
