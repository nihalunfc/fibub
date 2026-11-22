// Extra question shapes for classical-gas-equipartition (templates cgeq-m31..m35). Imported by classical-gas-equipartition.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const FR = { 0.5: '\\tfrac12', 0.75: '\\tfrac34', 1: '1', 1.5: '\\tfrac32', 2: '2', 2.5: '\\tfrac52', 3: '3', 3.5: '\\tfrac72', 6: '6' };

export default [
  { id: 'cgeq-m31', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'equipartition', format: 'match the system',
    make(r) {
      const C = choose(r, [
        ['an atom of a monatomic ideal gas', 1.5, 'Three translational quadratic terms: $3\\times\\tfrac12kT$.'],
        ['a rigid diatomic molecule in an ideal gas', 2.5, 'Three translations plus two rotations: $5\\times\\tfrac12kT$.'],
        ['a diatomic molecule with its vibration fully excited (classical)', 3.5, 'Three translations, two rotations, and the vibration contributes $kT$ (kinetic plus potential).'],
        ['a rigid non-linear polyatomic molecule', 3, 'Three translations plus three rotations: $6\\times\\tfrac12kT$.'],
        ['a one-dimensional classical harmonic oscillator', 1, '$p^2/2m$ and $\\tfrac12kx^2$: two quadratic terms.'],
        ['an atom vibrating in a three-dimensional classical solid', 3, 'Three kinetic and three potential quadratic terms: $3kT$ (Dulong-Petit).'],
        ['a particle on a line with $H = p^2/2m + a|x|$', 1.5, 'Generalised equipartition: $\\langle x\\,\\partial H/\\partial x\\rangle = kT$ gives $\\langle a|x|\\rangle = kT$, plus $\\tfrac12kT$ kinetic.'],
        ['a particle on a line with $H = p^2/2m + ax^4$', 0.75, '$\\langle x\\,\\partial H/\\partial x\\rangle = 4\\langle ax^4\\rangle = kT$, so the potential gives $\\tfrac14kT$; plus $\\tfrac12kT$ kinetic.'],
        ['an ultra-relativistic particle in 3D with $E = c|\\vec p|$', 3, '$\\langle p_i\\,\\partial H/\\partial p_i\\rangle = kT$ for each component, and $\\sum_i p_i\\,\\partial H/\\partial p_i = c|\\vec p| = E$, so $\\langle E\\rangle = 3kT$.'],
      ]);
      const sh = (v) => `$${FR[v]}\\,kT$`;
      const o = pickMcq(r, sh(C[1]), [0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5].filter((v) => v !== C[1]).map(sh));
      return { q: `In classical thermal equilibrium at temperature $T$, the mean energy of ${C[0]} is`, ...o, sol: C[2],
        trap: 'Only quadratic terms give $\\tfrac12kT$ each; for a general power law use $\\langle x\\,\\partial H/\\partial x\\rangle = kT$.' };
    } },
  { id: 'cgeq-m32', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Maxwell distribution', format: 'statements',
    make(r) {
      const G = choose(r, [['N$_2$', 28.01], ['O$_2$', 32.0], ['He', 4.003], ['Ar', 39.95], ['CO$_2$', 44.01]]), T = choose(r, [200, 300, 400, 500]);
      const vr = Math.sqrt(3 * 8.314 * T / (G[1] * 1e-3)), right = r() < 0.5;
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$v_p < \\langle v\\rangle < v_{rms}$', true, '$v_p = \\sqrt{2kT/m}$, $\\langle v\\rangle = \\sqrt{8kT/\\pi m}$, $v_{rms} = \\sqrt{3kT/m}$, in the ratio $1 : 1.128 : 1.225$.'],
        [`$v_{rms}$ of ${G[0]} at $${T}$ K is about $${Math.round(right ? vr : vr * Math.SQRT2)}$ m/s`, right, `$v_{rms} = \\sqrt{3RT/M} = \\sqrt{3\\times8.314\\times${T}/${round(G[1] * 1e-3, 5)}} = ${Math.round(vr)}$ m/s.`],
        ['Doubling the absolute temperature doubles $v_{rms}$', false, '$v_{rms} \\propto \\sqrt T$: it grows by $\\sqrt2$.'],
        ['Each Cartesian velocity component is Gaussian-distributed about zero', true, '$f(v_x) \\propto e^{-mv_x^2/2kT}$.'],
        ['The most probable speed is zero because each component is most likely zero', false, 'The speed distribution has the extra factor $4\\pi v^2$ from the volume of a shell in velocity space, so it vanishes at $v = 0$.'],
        ['At the same temperature, lighter molecules have the same mean kinetic energy as heavier ones', true, '$\\langle\\tfrac12mv^2\\rangle = \\tfrac32kT$ independent of mass.'],
      ], { not });
      return { q: `For an ideal gas obeying the Maxwell speed distribution, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}? ($R = 8.314$ J mol$^{-1}$ K$^{-1}$; ${G[0]} has molar mass $${G[1]}$ g/mol.)`, ...m,
        trap: 'Velocity components peak at zero, speeds do not.' };
    } },
  { id: 'cgeq-m33', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Maxwell distribution', format: 'graph in words',
    make(r) {
      const C = choose(r, [
        ['the temperature of a gas is raised from $T$ to $4T$', 2], ['the temperature of a gas is raised from $T$ to $9T$', 3], ['the temperature of a gas is lowered from $T$ to $T/4$', 0.5],
        ['helium is replaced by methane (16 u) at the same temperature', 0.5], ['oxygen (32 u) is replaced by hydrogen (2 u) at the same temperature', 4], ['the temperature of a gas is lowered from $T$ to $T/9$', 1 / 3],
      ]);
      const f = C[1], fs = f === 0.5 ? '\\tfrac12' : f === 1 / 3 ? '\\tfrac13' : `${f}`;
      const inv = f === 0.5 ? '2' : f === 1 / 3 ? '3' : `\\tfrac{1}{${f}}`;
      const opt = (a, b) => `the peak speed is multiplied by $${a}$ and the peak height by $${b}$`;
      const f2 = f === 0.5 ? '\\tfrac14' : f === 1 / 3 ? '\\tfrac19' : `${f * f}`;
      const o = pickMcq(r, opt(fs, inv), [opt(fs, fs), opt(f2, inv), opt(inv, fs), opt(fs, '1')]);
      return { q: `The Maxwell speed distribution $f(v)$ of a gas has a single peak. If ${C[0]}, then`, ...o,
        sol: `The peak is at $v_p = \\sqrt{2kT/m}$, which changes by the factor $${fs}$ here. The area under $f(v)$ stays 1 and the curve keeps its shape on the scale $v_p$, so the peak height (about $1/v_p$) changes by $${inv}$. ${f > 1 ? 'The curve moves right, gets lower and broader.' : 'The curve moves left, gets taller and narrower.'}`,
        trap: 'Speeds scale with $\\sqrt{T/m}$, not with $T/m$; and a fixed area means the height changes inversely to the width.' };
    } },
  { id: 'cgeq-m34', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'validity of equipartition', format: 'which is NOT',
    make(r) {
      const ok = [
        ['the rotations of N$_2$ at 300 K', '$\\theta_{rot} \\approx 2.9$ K $\\ll$ 300 K, so rotation is classical.'],
        ['the translation of argon atoms at 150 K and 1 atm', 'The thermal wavelength is far smaller than the spacing ($n\\lambda^3 \\ll 1$).'],
        ['the lattice vibrations of copper at 1000 K', '$\\theta_D \\approx 343$ K, so $T \\gg \\theta_D$ and Dulong-Petit holds.'],
        ['the vibration of I$_2$ vapour at 1000 K', '$\\theta_{vib} \\approx 310$ K, well below 1000 K.'],
      ];
      const bad = [
        ['the vibration of H$_2$ at 300 K', '$\\theta_{vib} \\approx 6300$ K: the vibration is frozen in its ground state.'],
        ['the lattice vibrations of diamond at 300 K', '$\\theta_D \\approx 2200$ K: far below the Dulong-Petit limit.'],
        ['the conduction electrons of copper at 300 K', '$T_F \\approx 8\\times10^4$ K: a degenerate Fermi gas, not classical.'],
        ['the rotations of H$_2$ at 20 K', '$\\theta_{rot} \\approx 88$ K: rotation is frozen out.'],
      ];
      const askBad = r() < 0.6;
      const c = askBad ? choose(r, bad) : choose(r, ok);
      const o = pickMcq(r, c[0], (askBad ? ok : bad).map((x) => x[0]));
      return { q: `Which ONE of these degrees of freedom ${askBad ? 'does <b>NOT</b>' : '<b>does</b>'} receive its classical equipartition share of energy?`, ...o,
        sol: `${c[0]}: ${c[1]} Equipartition needs $kT$ much larger than the level spacing (and no quantum degeneracy). The other options: ${o.options.filter((x) => x !== c[0]).map((x) => { const y = [...ok, ...bad].find((z) => z[0] === x); return `${x}: ${y[1]}`; }).join(' ')}`,
        trap: 'Compare $T$ with the characteristic temperature of that particular motion, not with room temperature in general.' };
    } },
  { id: 'cgeq-m35', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'barometric distribution', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['N$_2$ molecules', 28 * 1.6605e-27], ['helium atoms', 4 * 1.6605e-27], ['colloidal particles of effective (buoyancy-corrected) mass $10^{-17}$ kg', 1e-17],
        ['dust grains of mass $10^{-12}$ kg', 1e-12], ['a protein of 50 kDa (ignoring buoyancy)', 5e4 * 1.6605e-27], ['effective colloid mass $10^{-19}$ kg', 1e-19],
      ]);
      const T = choose(r, [250, 300, 350]), H = 1.380649e-23 * T / (S[1] * 9.8);
      const o = oomMcq(r, H, 'm');
      return { q: `In equilibrium at $${T}$ K in Earth's gravity, the number density of ${S[0]} falls as $e^{-z/H}$. The scale height $H = kT/mg$ is closest to`, ...o,
        sol: `$H = \\dfrac{kT}{mg} = \\dfrac{1.381\\times10^{-23}\\times${T}}{${fmt(S[1], 3)}\\times9.8} = ${fmt(H, 2)}$ m, nearest $10^{${o.k}}$ m. ${H > 100 ? 'Molecules spread over kilometres.' : 'Heavy particles settle into a thin layer; Perrin used this to find Avogadro\'s number.'}`,
        trap: 'The same Boltzmann factor $e^{-mgz/kT}$ governs air and colloids; only the mass differs, by many orders of magnitude.' };
    } },
];
