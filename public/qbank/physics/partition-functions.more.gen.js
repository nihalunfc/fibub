// Extra question shapes for partition-functions (templates pfun-m31..m35). Imported by partition-functions.js.
import { int, choose, round, shuffle, fmt } from '../_util.js';
import { msqOf, pickMcq, oomMcq } from './_more.js';

export default [
  { id: 'pfun-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics from Z',
    make(r) {
      const p = choose(r, [1, 2, 3]), pS = ['', '\\tfrac32', '\\tfrac52', '3'][p];
      const C = choose(r, [
        { Z: `Z = A\\,(V - Nb)^N\\,T^{3N/2}\\,e^{aN^2/VkT}`, ask: 'the pressure $P$', ok: '$P = \\dfrac{NkT}{V - Nb} - \\dfrac{aN^2}{V^2}$', ws: ['$P = \\dfrac{NkT}{V - Nb} + \\dfrac{aN^2}{V^2}$', '$P = \\dfrac{NkT}{V}$', '$P = \\dfrac{NkT}{V - Nb} - \\dfrac{aN^2}{V^2kT}$', '$P = \\dfrac{3NkT}{2(V - Nb)}$'], sol: '$P = kT\\,\\partial\\ln Z/\\partial V = kT\\left[\\dfrac{N}{V - Nb} - \\dfrac{aN^2}{V^2kT}\\right]$: the van der Waals equation.' },
        { Z: `Z = A\\,(V - Nb)^N\\,T^{3N/2}\\,e^{aN^2/VkT}`, ask: 'the internal energy $U$', ok: '$U = \\tfrac32NkT - \\dfrac{aN^2}{V}$', ws: ['$U = \\tfrac32NkT + \\dfrac{aN^2}{V}$', '$U = \\tfrac32NkT$', '$U = \\tfrac32NkT - \\dfrac{aN^2}{V - Nb}$', '$U = \\tfrac52NkT - \\dfrac{aN^2}{V}$'], sol: '$U = kT^2\\,\\partial\\ln Z/\\partial T = kT^2\\left[\\dfrac{3N}{2T} - \\dfrac{aN^2}{VkT^2}\\right] = \\tfrac32NkT - aN^2/V$. The attraction lowers the energy.' },
        { Z: `Z = A\\,V^N\\,T^{${p === 1 ? '' : p}N}`, ask: 'the heat capacity $C_V$', ok: `$C_V = ${p === 1 ? '' : p}Nk$`, ws: [`$C_V = ${p + 1}Nk$`, `$C_V = ${p + 2}Nk$`, `$C_V = ${p === 1 ? '' : p}NkT$`, '$C_V = 0$', `$C_V = ${p === 1 ? '' : p}Nk/T$`], sol: `$U = kT^2\\,\\partial\\ln Z/\\partial T = ${p === 1 ? '' : p}NkT$, so $C_V = ${p === 1 ? '' : p}Nk$.` },
        { Z: 'Z = [2\\cosh(\\varepsilon/kT)]^N', ask: 'the internal energy $U$', ok: '$U = -N\\varepsilon\\tanh(\\varepsilon/kT)$', ws: ['$U = N\\varepsilon\\tanh(\\varepsilon/kT)$', '$U = -N\\varepsilon\\coth(\\varepsilon/kT)$', '$U = -N\\varepsilon/\\cosh(\\varepsilon/kT)$', '$U = NkT$'], sol: '$U = -\\partial\\ln Z/\\partial\\beta = -N\\,\\partial_\\beta\\ln\\cosh(\\beta\\varepsilon) = -N\\varepsilon\\tanh(\\beta\\varepsilon)$. Levels $\\pm\\varepsilon$: at $T \\to 0$, $U \\to -N\\varepsilon$; at $T \\to \\infty$, $U \\to 0$.' },
      ]);
      const o = pickMcq(r, C.ok, C.ws);
      return { q: `A system has canonical partition function $${C.Z}$ ($A$, $a$, $b$, $\\varepsilon$ constants). Then ${C.ask} is`, ...o, sol: C.sol,
        trap: 'Pressure is $kT\\,\\partial\\ln Z/\\partial V$ at fixed $T$; energy is $kT^2\\,\\partial\\ln Z/\\partial T$ at fixed $V$.' };
    } },
  { id: 'pfun-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'properties of Z', format: 'statements',
    make(r) {
      const D = int(r, 1, 9) * 10;
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['For independent, distinguishable subsystems the partition functions multiply', true, 'The energy is a sum, so $e^{-\\beta E}$ factorises.'],
        ['For $N$ indistinguishable classical particles $Z = z^N/N!$', true, 'The $N!$ corrects the overcounting of permutations (dilute limit).'],
        [`Shifting every level up by ${D} meV multiplies $Z$ by $e^{-\\beta\\cdot${D}\\text{ meV}}$ and leaves the populations unchanged`, true, 'A common factor cancels between numerator and denominator of each probability.'],
        [`Shifting every level up by ${D} meV changes the heat capacity`, false, '$U$ shifts by a constant, so $C = \\partial U/\\partial T$ is unchanged.'],
        ['$F = -kT\\ln Z$', true, 'The bridge between statistics and thermodynamics in the canonical ensemble.'],
        ['$U = -\\partial\\ln Z/\\partial\\beta$', true, '$-\\partial_\\beta\\ln\\sum e^{-\\beta E_i} = \\sum E_ie^{-\\beta E_i}/Z$.'],
        ['$S = k\\ln Z$', false, '$S = k\\ln Z + U/T$; the $U/T$ term is missing.'],
        ['A level of degeneracy $g$ contributes $e^{-\\beta E}$ to $Z$', false, 'It contributes $g\\,e^{-\\beta E}$: each state counts.'],
      ], { not });
      return { q: `Which statements about the canonical partition function $Z = \\sum_i e^{-\\beta E_i}$ are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Zero of energy is arbitrary: it changes $Z$ and $F$ but nothing measurable such as populations or heat capacity.' };
    } },
  { id: 'pfun-m33', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'heat capacity curves', format: 'graph in words',
    make(r) {
      const O = {
        sch: 'exponentially small at low $T$, a single maximum, then falling off as $1/T^2$ at high $T$',
        osc: 'exponentially small at low $T$, rising monotonically to the constant value $k$',
        flat: 'constant at $k/2$ at all temperatures',
        deb: 'proportional to $T^3$ at low $T$, rising to the constant value $3k$',
        el: 'proportional to $T$ at low $T$, rising to $\\tfrac32k$ at high $T$',
      };
      const C = choose(r, [
        ['a two-level system (gap $\\varepsilon$)', 'sch', 'The Schottky anomaly: $C = k(\\varepsilon/kT)^2e^{\\varepsilon/kT}/(1 + e^{\\varepsilon/kT})^2$, peaking near $kT \\approx 0.42\\varepsilon$.'],
        ['a spin-$\\tfrac12$ moment in a fixed magnetic field', 'sch', 'Two levels split by $2\\mu B$: a Schottky peak.'],
        ['a quantum harmonic oscillator', 'osc', '$C = k(\\hbar\\omega/kT)^2e^{\\hbar\\omega/kT}/(e^{\\hbar\\omega/kT} - 1)^2$: frozen at low $T$, classical $k$ at high $T$.'],
        ['a classical free particle moving in one dimension', 'flat', 'One quadratic term: $\\tfrac12kT$ of energy, so $C = k/2$.'],
        ['an atom in a three-dimensional crystal (Debye model)', 'deb', 'Debye: $T^3$ law at low $T$, Dulong-Petit $3k$ at high $T$.'],
        ['an electron in an ideal 3D electron gas (degenerate at low $T$)', 'el', 'Degenerate: $C = \\tfrac{\\pi^2}{2}k\\,T/T_F$; classical at $T \\gg T_F$: $\\tfrac32k$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `How does the heat capacity per unit of ${C[0]} depend on temperature?`, ...o, sol: C[2],
        trap: 'A bounded spectrum (finite number of levels) always gives a peak and $C \\to 0$ at high $T$; an unbounded one saturates at a classical value.' };
    } },
  { id: 'pfun-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'translational partition function', format: 'order of magnitude',
    make(r) {
      const G = choose(r, [['H$_2$', 2.016], ['He', 4.003], ['N$_2$', 28.01], ['Ar', 39.95], ['Xe', 131.3]]);
      const T = choose(r, [100, 300, 1000]), V = choose(r, [[1e-6, '1 cm$^3$'], [1e-3, '1 litre'], [1, '1 m$^3$']]);
      const lam = 6.62607e-34 / Math.sqrt(2 * Math.PI * G[1] * 1.66054e-27 * 1.380649e-23 * T), z = V[0] / lam ** 3;
      const o = oomMcq(r, z);
      return { q: `The single-molecule translational partition function of ${G[0]} ($m = ${G[1]}$ u) in a volume of ${V[1]} at $${T}$ K is closest to`, ...o,
        sol: `$z = V/\\lambda^3$ with $\\lambda = h/\\sqrt{2\\pi mkT} = ${fmt(lam, 3)}$ m. So $z = ${fmt(V[0], 2)}/(${fmt(lam, 3)})^3 = ${fmt(z, 2)}$, nearest $10^{${o.k}}$. The huge value means very many translational states are thermally accessible: the classical limit.`,
        trap: 'Cube the thermal wavelength: $\\lambda^3$, not $\\lambda$.' };
    } },
  { id: 'pfun-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'populations', format: 'which level',
    make(r) {
      const d = choose(r, [5, 10, 20]), gs = shuffle(r, [[1, 3, 5, 7], [1, 2, 4, 8], [1, 4, 9, 16], [2, 6, 10, 14], [1, 3, 6, 10]])[0];
      const kT = round(d * (0.3 + 1.7 * r()), 1);
      const pop = gs.map((g, i) => g * Math.exp(-i * d / kT));
      const best = pop.indexOf(Math.max(...pop));
      const lab = (i) => `the level at $${i * d}$ meV (degeneracy ${gs[i]})`;
      const o = pickMcq(r, lab(best), [0, 1, 2, 3].filter((i) => i !== best).map(lab));
      return { q: `A system has levels at $0$, $${d}$, $${2 * d}$ and $${3 * d}$ meV with degeneracies ${gs.join(', ')}. In equilibrium with $kT = ${kT}$ meV, which level holds the most particles?`, ...o,
        sol: `The population of level $i$ is proportional to $g_ie^{-E_i/kT}$: ${pop.map((p, i) => `$${gs[i]}e^{-${i * d}/${kT}} = ${round(p, 3)}$`).join(', ')}. The largest is ${lab(best)}. Degeneracy can beat the Boltzmann factor.`,
        trap: 'The single most likely <i>state</i> is always the ground state, but the most populated <i>level</i> can be higher because of its degeneracy.' };
    } },
];
