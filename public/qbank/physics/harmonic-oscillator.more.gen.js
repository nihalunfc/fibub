// Extra question shapes for harmonic-oscillator (templates qho-m31..m35). Imported by harmonic-oscillator.js.
import { int, choose, shuffle, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'qho-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'matrix elements', format: 'selection rule',
    make(r) {
      const n = int(r, 1, 4), k = int(r, 1, 3), op = choose(r, ['\\hat x', '\\hat p']);
      const okm = (m) => Math.abs(m - n) <= k && (m - n - k) % 2 === 0;
      const ms = Array.from({ length: n + k + 4 }, (_, i) => i);
      const good = shuffle(r, ms.filter(okm)), bad = ms.filter((m) => !okm(m));
      const el = (m) => `$\\langle ${m}|${op}^{${k}}|${n}\\rangle$`.replace('^{1}', '');
      const o = pickMcq(r, el(good[0]), bad.map(el));
      return { q: `For the harmonic oscillator eigenstates $|n\\rangle$, which ONE of these matrix elements is non-zero?`, ...o,
        sol: `Write $${op} \\propto ${op === '\\hat x' ? 'a + a^\\dagger' : 'i(a^\\dagger - a)'}$. Each factor raises or lowers $n$ by one, so $${k === 1 ? op : op + "^{" + k + "}"}$ connects $|${n}\\rangle$ only to states with $|m - ${n}| \\le ${k}$ and $m - ${n}$ of the same parity as $${k}$ (an odd power flips parity, an even power keeps it). The allowed $m$ are ${ms.filter(okm).join(', ')}; among the options only ${el(good[0])} qualifies. (Each allowed element is genuinely non-zero, since all paths add with the same sign up to an overall phase.)`,
        trap: 'Forgetting the parity rule: $\\hat x^2$ links $n$ to $n$ and $n \\pm 2$, never to $n \\pm 1$.' };
    } },
  { id: 'qho-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'superposition states', format: 'statements',
    make(r) {
      const n1 = int(r, 0, 3), d = int(r, 1, 3), n2 = n1 + d;
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$\\langle x\\rangle$ oscillates in time', d === 1, d === 1 ? '$\\hat x$ connects levels differing by one, so the cross term oscillates at $\\omega$.' : `$\\langle ${n1}|\\hat x|${n2}\\rangle = 0$ because the levels differ by ${d}, so $\\langle x\\rangle = 0$ at all times.`],
        ['$\\langle x^2\\rangle$ oscillates in time', d === 2, d === 2 ? '$\\hat x^2$ contains $a^2$ and $a^{\\dagger2}$, which connect levels two apart; the cross term oscillates at $2\\omega$.' : `$\\hat x^2$ links levels differing by 0 or 2 only; here they differ by ${d}, so $\\langle x^2\\rangle$ is constant.`],
        [`$\\langle H\\rangle = ${(n1 + n2 + 1) / 2}\\,\\hbar\\omega$`, true, `$\\tfrac12[(${n1} + \\tfrac12) + (${n2} + \\tfrac12)]\\hbar\\omega = ${(n1 + n2 + 1) / 2}\\hbar\\omega$.`],
        [`$\\langle H\\rangle = ${n1 + n2 + 1}\\,\\hbar\\omega$`, false, 'This adds the two energies instead of averaging them with weights $\\tfrac12$.'],
        ['The state has definite parity', d % 2 === 0, d % 2 === 0 ? `$\\psi_${n1}$ and $\\psi_${n2}$ have the same parity $(-1)^n$, so the sum does too.` : 'The two eigenfunctions have opposite parities, so the sum has none.'],
        ['The probability density $|\\psi(x, t)|^2$ is independent of time', false, 'The two components have different energies, so the interference term rotates at $' + d + '\\omega$.'],
      ], { not });
      return { q: `A harmonic oscillator is in $\\tfrac{1}{\\sqrt2}\\left(|${n1}\\rangle + |${n2}\\rangle\\right)$ at $t = 0$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The density always moves in a superposition of different energies, even when $\\langle x\\rangle$ happens to stay at zero.' };
    } },
  { id: 'qho-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'oscillator spectra', format: 'match the system',
    make(r) {
      const S = [
        ['a one-dimensional harmonic oscillator', '\\tfrac12', 1, '\\tfrac32', 1, '$E_n = (n + \\tfrac12)\\hbar\\omega$, all non-degenerate.'],
        ['a particle in $V = \\tfrac12m\\omega^2x^2$ for $x > 0$ with a hard wall at $x = 0$', '\\tfrac32', 1, '\\tfrac72', 1, 'Only the odd oscillator states vanish at the wall, so $E = \\tfrac32, \\tfrac72, \\ldots$ (in $\\hbar\\omega$).'],
        ['an isotropic two-dimensional oscillator', '1', 1, '2', 2, '$E = (n_x + n_y + 1)\\hbar\\omega$; the level $N = 1$ has $(1,0)$ and $(0,1)$.'],
        ['an isotropic three-dimensional oscillator', '\\tfrac32', 1, '\\tfrac52', 3, '$E = (N + \\tfrac32)\\hbar\\omega$ with degeneracy $(N+1)(N+2)/2$, i.e. 1 and 3.'],
        ['a two-dimensional oscillator with frequencies $\\omega$ and $2\\omega$', '\\tfrac32', 1, '\\tfrac52', 1, '$E = (n_x + \\tfrac12)\\hbar\\omega + (n_y + \\tfrac12)2\\hbar\\omega$: ground $\\tfrac32$, then only $(1, 0)$ at $\\tfrac52$ ($(0,1)$ is at $\\tfrac72$).'],
        ['two non-interacting identical spinless bosons in a 1D oscillator', '1', 1, '2', 1, 'Both in $n = 0$ give 1; the next symmetric state $(0, 1)$ gives 2, and there is only one such state.'],
        ['two non-interacting identical spinless fermions in a 1D oscillator', '2', 1, '3', 1, 'The fermions must occupy different levels: $(0,1)$ gives 2, then $(0,2)$ gives 3.'],
      ];
      const i = int(r, 0, S.length - 1), s = S[i];
      const deg = (g) => (g === 1 ? 'non-degenerate' : `${g}-fold degenerate`);
      const o = pickMcq(r, s[0], S.filter((_, j) => j !== i).map((x) => x[0]));
      return { q: `A system has ground level $${s[1]}\\,\\hbar\\omega$ (${deg(s[2])}) and first excited level $${s[3]}\\,\\hbar\\omega$ (${deg(s[4])}). Which system is it?`, ...o,
        sol: `${s[0][0].toUpperCase()}${s[0].slice(1)}: ${s[5]} Each of the other options gives a different pair of energies or degeneracies.`,
        trap: 'Degeneracy is what separates the isotropic 3D oscillator from the $(\\omega, 2\\omega)$ oscillator: both have levels $\\tfrac32$ and $\\tfrac52$.' };
    } },
  { id: 'qho-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'number and coherent states', format: 'which is NOT',
    make(r) {
      const kind = int(r, 0, 2), n = int(r, 1, 4), al = int(r, 2, 4);
      const sets = [
        { name: `the number state $|${n}\\rangle$`, T: [
          ['$\\langle x\\rangle = 0$ at all times', 'It is stationary and has definite parity.'],
          [`$\\Delta x\\,\\Delta p = ${n * 2 + 1}\\hbar/2$`, `In $|n\\rangle$, $\\Delta x\\Delta p = (n + \\tfrac12)\\hbar$.`],
          ['It is an eigenstate of $a^\\dagger a$', `$a^\\dagger a|${n}\\rangle = ${n}|${n}\\rangle$.`],
          ['The number of quanta has zero spread', 'It has a definite number of quanta.']],
          F: [['It is an eigenstate of the lowering operator $a$', `$a|${n}\\rangle = \\sqrt{${n}}|${n - 1}\\rangle$, a different state.`],
            ['$\\Delta x\\,\\Delta p = \\hbar/2$', `Only $|0\\rangle$ reaches the minimum; here it is $${n * 2 + 1}\\hbar/2$.`],
            ['$\\langle x\\rangle$ oscillates at frequency $\\omega$', 'A stationary state has time-independent expectation values.']] },
        { name: `the coherent state $|\\alpha\\rangle$ with $\\alpha = ${al}$`, T: [
          ['It is an eigenstate of the lowering operator $a$', `$a|\\alpha\\rangle = ${al}|\\alpha\\rangle$.`],
          ['$\\Delta x\\,\\Delta p = \\hbar/2$ at all times', 'A coherent state is a displaced ground state.'],
          [`$\\langle a^\\dagger a\\rangle = ${al * al}$`, `$\\langle N\\rangle = |\\alpha|^2 = ${al * al}$.`],
          ['The number of quanta follows a Poisson distribution', '$|\\langle n|\\alpha\\rangle|^2 = e^{-|\\alpha|^2}|\\alpha|^{2n}/n!$.']],
          F: [['It is an eigenstate of $a^\\dagger a$', 'It is a superposition of all $|n\\rangle$, with $\\Delta N = |\\alpha| \\ne 0$.'],
            ['$\\langle x\\rangle = 0$ at all times', '$\\langle x\\rangle$ oscillates with amplitude $\\sqrt{2\\hbar/m\\omega}\\,|\\alpha|$.'],
            [`$\\langle a^\\dagger a\\rangle = ${al}$`, `$\\langle N\\rangle = |\\alpha|^2 = ${al * al}$, not $|\\alpha|$.`]] },
        { name: 'the ground state $|0\\rangle$', T: [
          ['It is an eigenstate of the lowering operator $a$', '$a|0\\rangle = 0 = 0\\cdot|0\\rangle$, eigenvalue zero.'],
          ['$\\Delta x\\,\\Delta p = \\hbar/2$', 'The Gaussian ground state is a minimum-uncertainty state.'],
          ['Its mean energy is $\\hbar\\omega/2$', 'Zero-point energy.'],
          ['$\\langle x\\rangle = 0$ at all times', 'It is stationary and even.']],
          F: [['$\\langle x^2\\rangle = 0$', '$\\langle x^2\\rangle = \\hbar/2m\\omega$: zero-point motion.'],
            ['It is an eigenstate of the raising operator $a^\\dagger$', '$a^\\dagger|0\\rangle = |1\\rangle$; in fact $a^\\dagger$ has no normalisable eigenstates.'],
            ['Its mean kinetic energy is zero', '$\\langle T\\rangle = \\langle V\\rangle = \\hbar\\omega/4$.']] },
      ];
      const S = sets[kind], not = r() < 0.65;
      const o = factMcq(r, S.T, S.F, not);
      return { q: `For a harmonic oscillator in ${S.name}, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Number states have definite energy but no motion of $\\langle x\\rangle$; coherent states move classically but have no definite energy.' };
    } },
  { id: 'qho-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'zero-point motion', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['the vibration of an H$_2$ molecule (reduced mass $0.5$ u, $\\omega = 8.3\\times10^{14}$ s$^{-1}$)', 0.5 * 1.6605e-27, 8.3e14],
        ['a rubidium-87 atom in an optical trap of frequency $\\omega = 2\\pi\\times100$ kHz', 87 * 1.6605e-27, 2 * Math.PI * 1e5],
        ['a calcium-40 ion in a Paul trap with $\\omega = 2\\pi\\times1$ MHz', 40 * 1.6605e-27, 2 * Math.PI * 1e6],
        ['a 40 kg mirror suspended as a pendulum with $\\omega = 2\\pi\\times1$ Hz', 40, 2 * Math.PI],
        ['an electron in a quantum dot with $\\hbar\\omega = 10$ meV', 9.109e-31, 0.01 * 1.602e-19 / 1.0546e-34],
        ['a 1 ng cantilever resonating at $\\omega = 2\\pi\\times1$ MHz', 1e-12, 2 * Math.PI * 1e6],
      ]);
      const x0 = Math.sqrt(1.0546e-34 / (S[1] * S[2]));
      const o = oomMcq(r, x0, 'm');
      return { q: `The ground-state length scale of an oscillator is $x_0 = \\sqrt{\\hbar/m\\omega}$. For ${S[0]}, $x_0$ is closest to`, ...o,
        sol: `$x_0 = \\sqrt{\\dfrac{1.055\\times10^{-34}}{${fmt(S[1], 3)}\\times${fmt(S[2], 3)}}} = ${fmt(x0, 2)}$ m, so the nearest power of ten is $10^{${o.k}}$ m.`,
        trap: 'Forgetting the square root halves the exponent error: always take the root last.' };
    } },
];
