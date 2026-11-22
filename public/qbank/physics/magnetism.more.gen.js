// Extra question shapes for magnetism (templates mgx-m31..m35). Imported by magnetism.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const LL = 'SPDFG';
const hf = (x) => (Number.isInteger(x) ? `${x}` : `\\tfrac{${Math.round(2 * x)}}{2}`);
const ML = [2, 1, 0, -1, -2];
/** Hund's-rule ground term of a d^n ion: [S, L, J]. */
const hund = (n) => {
  const up = Math.min(n, 5), down = n - up;
  const S = (up - down) / 2;
  const L = Math.abs(ML.slice(0, up).reduce((s, x) => s + x, 0) + ML.slice(0, down).reduce((s, x) => s + x, 0));
  const J = n < 5 ? Math.abs(L - S) : L + S;
  return [S, L, J];
};

export default [
  { id: 'mgx-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'susceptibility and temperature', format: 'match the system',
    make(r) {
      const O = {
        dia: 'small, negative and nearly independent of temperature',
        pauli: 'small, positive and nearly independent of temperature',
        curie: 'positive and proportional to $1/T$',
        cw: 'positive, following $C/(T - \\theta)$ with $\\theta > 0$, and diverging as $T$ falls towards $\\theta$',
        afm: 'positive, rising as $T$ falls to a cusp at the ordering temperature, then falling below it',
        perf: 'exactly $-1$ (in SI units): flux is expelled completely',
      };
      const C = choose(r, [
        ['solid argon', 'dia', 'Closed shells: only Larmor diamagnetism.'], ['bismuth', 'dia', 'Strong Landau and core diamagnetism outweigh the spin part.'],
        ['sodium metal', 'pauli', 'Only electrons near $E_F$ can align their spins, so $\\chi \\propto g(E_F)$ and does not depend on $T$.'],
        ['the paramagnetic salt copper sulfate pentahydrate at 10 K', 'curie', 'Isolated Cu$^{2+}$ moments, aligned against thermal disorder: Curie\'s law.'],
        ['iron just above its Curie temperature of 1043 K', 'cw', 'Above $T_C$ a ferromagnet follows the Curie-Weiss law with $\\theta \\approx T_C$.'],
        ['manganese oxide (MnO) between 50 K and 300 K', 'afm', 'MnO orders antiferromagnetically at $T_N = 116$ K; $\\chi$ peaks there.'],
        ['lead below its superconducting transition at 7.2 K, in a weak field', 'perf', 'The Meissner effect: a perfect diamagnet.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `The magnetic susceptibility $\\chi$ of ${C[0]} is`, ...o, sol: C[2],
        trap: 'Conduction electrons give a temperature-independent (Pauli) paramagnetism, not a Curie law: the Fermi sea blocks most of them.' };
    } },
  { id: 'mgx-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: '3d ions and spin-only moments', format: 'statements',
    make(r) {
      const I = choose(r, [['Ti$^{3+}$', 1], ['V$^{3+}$', 2], ['Cr$^{3+}$', 3], ['Mn$^{3+}$', 4], ['Mn$^{2+}$', 5], ['Fe$^{3+}$', 5], ['Fe$^{2+}$', 6], ['Co$^{2+}$', 7], ['Ni$^{2+}$', 8], ['Cu$^{2+}$', 9]]);
      const n = I[1], [S, L, J] = hund(n), u = 2 * S;
      const g = J === 0 ? 0 : 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1));
      const mso = Math.sqrt(u * (u + 2)), mj = g * Math.sqrt(J * (J + 1));
      const term = `{}^{${2 * S + 1}}\\mathrm{${LL[L]}}_{${hf(J)}}`;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`It has ${u} unpaired electron${u > 1 ? 's' : ''}`, true, `Hund's first rule: spins parallel as far as possible in the five d orbitals (3d$^{${n}}$).`],
        ...(10 - n !== u ? [[`It has ${10 - n} unpaired electrons`, false, `That counts the empty d places; with ${n} electrons there are ${u} unpaired.`]] : []),
        [`Its free-ion ground term is $${term}$`, true, `$S = ${hf(S)}$, $L = ${L}$, and $J = ${n < 5 ? '|L - S|' : 'L + S'}$ because the shell is ${n < 5 ? 'less' : 'more'} than half full.`],
        [`Its spin-only moment is $\\sqrt{n_u(n_u + 2)} = ${round(mso, 2)}\\,\\mu_B$`, true, '$2\\sqrt{S(S+1)}\\,\\mu_B$ with $g_s = 2$.'],
        [`Its spin-only moment is $\\sqrt{S(S+1)} = ${round(Math.sqrt(S * (S + 1)), 2)}\\,\\mu_B$`, false, 'This misses the factor $g_s = 2$.'],
        ...(L > 0 ? [[`In a solid its measured moment is usually close to $g_J\\sqrt{J(J+1)} = ${round(mj, 2)}\\,\\mu_B$`, false, `For 3d ions the crystal field quenches $\\vec L$, so the moment is close to the spin-only $${round(mso, 2)}\\,\\mu_B$.`]] : []),
        ['In a crystal its orbital moment is largely quenched by the crystal field', true, 'The 3d shell is outermost, so crystal fields beat spin-orbit coupling.'],
      ], { not });
      return { q: `For the free or crystal-bound ion ${I[0]} (3d$^{${n}}$), which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'For 3d ions use the spin-only formula; for 4f ions (shielded shell) use $g_J\\sqrt{J(J+1)}$.' };
    } },
  { id: 'mgx-m33', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'inverse susceptibility plots', format: 'graph in words',
    make(r) {
      const O = {
        orig: 'a straight line through the origin',
        pos: 'a straight line that meets the $T$ axis at a positive temperature',
        neg: 'a straight line that extrapolates to the $T$ axis at a negative temperature',
        horiz: 'a horizontal line (no dependence on $T$)',
      };
      const C = choose(r, [
        ['an ideal paramagnetic salt', 'orig', 'Curie law: $1/\\chi = T/C$.'],
        ['a ferromagnet above its Curie temperature', 'pos', 'Curie-Weiss with $\\theta > 0$: $1/\\chi = (T - \\theta)/C$ meets the axis at $\\theta \\approx T_C$.'],
        ['an antiferromagnet above its Néel temperature', 'neg', 'Curie-Weiss with $\\theta < 0$: $1/\\chi = (T + |\\theta|)/C$.'],
        ['a simple metal with Pauli paramagnetism', 'horiz', 'The Pauli susceptibility does not depend on $T$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `Plotting $1/\\chi$ against $T$ (in the paramagnetic range) for ${C[0]} gives`, ...o, sol: `${C[1] === 'horiz' ? '' : 'The slope is $1/C$, which gives the effective moment. '}${C[2]}`,
        trap: 'The sign of the intercept tells ferro ($\\theta > 0$) from antiferro ($\\theta < 0$) interactions.' };
    } },
  { id: 'mgx-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'ferromagnetism', format: 'which is NOT',
    make(r) {
      const T = [
        ['The alignment of spins comes from the exchange interaction, an electrostatic effect combined with the Pauli principle', 'Its energy scale (up to about 0.1 eV) matches Curie temperatures of hundreds of kelvin.'],
        ['Domains form to reduce the magnetostatic (stray-field) energy', 'Closing the flux inside the sample costs only domain-wall energy.'],
        ['Above $T_C$ the material is paramagnetic, with a Curie-Weiss susceptibility', 'The molecular field still enhances $\\chi$.'],
        ['At low temperature spin waves reduce the magnetisation as $T^{3/2}$', 'Bloch\'s law.'],
        ['The spontaneous magnetisation falls continuously to zero at $T_C$', 'It is a continuous (second-order) transition.'],
      ];
      const F = [
        ['The alignment of spins comes from the magnetic dipole-dipole interaction between moments', 'That energy is only about 0.1 K per neighbour pair; it could not survive room temperature.'],
        ['A large sample always has lowest energy as a single domain', 'The stray-field energy then becomes large; domains reduce it.'],
        ['Below $T_C$ the spontaneous magnetisation increases with temperature', 'It decreases from its saturation value at $T = 0$.'],
        ['At low temperature spin waves reduce the magnetisation as $T^2$', 'Bloch\'s law gives $T^{3/2}$.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About ferromagnets, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Ferromagnetism is not magnetic in origin: dipole forces are thousands of times too weak.' };
    } },
  { id: 'mgx-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipolar energy scale', format: 'order of magnitude',
    make(r) {
      const mu = choose(r, [1, 2, 3, 5]), d = choose(r, [2.5, 3, 4]);
      const E = 1e-7 * (mu * 9.274e-24) ** 2 / (d * 1e-10) ** 3, T = E / 1.380649e-23;
      const o = oomMcq(r, T, 'K');
      return { q: `Two magnetic moments of $${mu}\\,\\mu_B$ each sit $${d}$ Å apart. Their dipolar interaction energy $\\mu_0\\mu^2/4\\pi r^3$, expressed as a temperature, is closest to`, ...o,
        sol: `$\\mu_0\\mu^2/4\\pi r^3 = 10^{-7}\\times(${fmt(mu * 9.274e-24, 3)})^2/(${fmt(d * 1e-10, 2)})^3 = ${fmt(E, 3)}$ J, i.e. $${fmt(T, 3)}$ K, nearest $10^{${o.k}}$ K. Iron orders at 1043 K, so dipolar forces cannot explain ferromagnetism; exchange must.`,
        trap: 'Dipolar energies between atomic moments are about a kelvin or less; exchange is hundreds to thousands of kelvin.' };
    } },
];
