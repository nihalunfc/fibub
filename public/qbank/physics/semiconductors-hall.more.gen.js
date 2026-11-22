// Extra question shapes for semiconductors-hall (templates shl-m31..m35). Imported by semiconductors-hall.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const AX = ['x', 'y', 'z'];
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const unit = (i, s) => AX.map((_, j) => (j === i ? s : 0));
const face = (i, s) => `the $${s > 0 ? '+' : '-'}${AX[i]}$ face`;

export default [
  { id: 'shl-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'sign of the Hall voltage', format: 'conceptual set-up',
    make(r) {
      const ia = int(r, 0, 2), ib = (ia + int(r, 1, 2)) % 3, ic = 3 - ia - ib;
      const sa = r() < 0.5 ? 1 : -1, sb = r() < 0.5 ? 1 : -1;
      const F = cross(unit(ia, sa), unit(ib, sb)), sf = F[ic];
      const holes = r() < 0.5;
      const pos = holes ? sf : -sf;
      const o = pickMcq(r, face(ic, pos), [face(ic, -pos), face(ib, 1), face(ib, -1)]);
      const sgn = (s) => (s > 0 ? '+' : '-');
      return { q: `A rectangular ${holes ? '<b>p-type</b>' : '<b>n-type</b>'} semiconductor bar carries a current along $${sgn(sa)}${AX[ia]}$ in a magnetic field along $${sgn(sb)}${AX[ib]}$. Which face becomes positively charged?`, ...o,
        sol: `Whatever the sign of the carriers, the magnetic force on them points along $\\hat I\\times\\vec B$, here $${sgn(sf)}${AX[ic]}$: holes move with the current and feel $(+e)\\vec v\\times\\vec B$; electrons move against it with charge $-e$, and the two signs cancel. So the carriers pile up on the $${sgn(sf)}${AX[ic]}$ face. ${holes ? 'They are holes, so that face becomes positive.' : 'They are electrons, so that face becomes negative and the opposite face positive.'} The answer is ${face(ic, pos)}.`,
        trap: 'Both carriers are pushed to the same side; only the sign of the charge they bring there differs. That is why the Hall voltage tells you the carrier sign.' };
    } },
  { id: 'shl-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'integer quantum Hall effect', format: 'statements',
    make(r) {
      const n = choose(r, [1, 2, 3, 4, 5]), nu = int(r, 1, 6);
      const B = n * 1e15 * 6.62607e-34 / (1.602177e-19 * nu), RK = 25812.807;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The filling factor is $\\nu = nh/eB = ${nu}$`, true, `$\\nu = n/(eB/h) = ${nu}$.`],
        [`Each (spin-split) Landau level holds $eB/h = ${fmt(n * 1e15 / nu, 3)}$ states per m$^2$`, true, 'The flux density divided by the flux quantum $h/e$.'],
        [`On the plateau $R_{xy} = h/\\nu e^2 = ${round(RK / nu, 1)}$ Ω`, true, `$h/e^2 = ${RK}$ Ω.`],
        [`On the plateau $R_{xy} = \\nu h/e^2 = ${round(RK * nu, 1)}$ Ω`, nu === 1, nu === 1 ? 'With $\\nu = 1$ this equals $h/e^2$.' : 'The plateau value is $h/\\nu e^2$; higher filling gives lower resistance.'],
        ['On the plateau the longitudinal resistance $R_{xx}$ is essentially zero', true, 'With $E_F$ in localised states between Landau levels there is no dissipation.'],
        ['The number of states per Landau level does not depend on $B$', false, 'It is $eB/h$ per unit area, proportional to $B$.'],
        ['The plateau values depend on the sample\'s size and purity', false, 'They are fixed by $h/e^2$ alone, which is why they define the resistance standard.'],
      ], { not });
      return { q: `A spin-resolved 2D electron gas of density $${n}\\times10^{15}$ m$^{-2}$ is in a field $B = ${round(B, 2)}$ T at very low temperature. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Plateaus are at $h/\\nu e^2$, and the filling factor is the electron density over $eB/h$.' };
    } },
  { id: 'shl-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magnetotransport curves', format: 'graph in words',
    make(r) {
      const O = {
        lin: 'it rises linearly with $B$, with slope $1/ne$',
        flatc: 'it stays nearly constant, independent of $B$',
        plat: 'it shows flat plateaus at $h/\\nu e^2$ joined by steps',
        zero: 'it drops to zero over ranges of $B$, with sharp peaks in between',
        osc: 'it oscillates, periodically in $1/B$',
      };
      const C = choose(r, [
        ['the Hall resistance $R_{xy}$ of a 2D electron gas at weak field', 'lin', 'Classically $R_{xy} = B/ne$ in 2D.'],
        ['the longitudinal resistance $R_{xx}$ of a single-carrier 2D electron gas at weak field', 'flatc', 'With one kind of carrier the Hall field cancels the Lorentz force and there is no classical magnetoresistance.'],
        ['the Hall resistance $R_{xy}$ of a clean 2D electron gas in a strong field at 1 K or below', 'plat', 'The integer quantum Hall effect.'],
        ['the longitudinal resistance $R_{xx}$ of a clean 2D electron gas in a strong field at 1 K or below', 'zero', 'It vanishes on each Hall plateau and peaks where $E_F$ crosses a Landau level.'],
        ['the longitudinal resistance $R_{xx}$ at intermediate fields, where Landau levels first become resolved', 'osc', 'Shubnikov-de Haas oscillations; the period in $1/B$ gives the carrier density, $\\Delta(1/B) = e/(\\pi\\hbar n)$ (with spin degeneracy).'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `As the magnetic field $B$ is swept, how does ${C[0]} behave?`, ...o, sol: C[2],
        trap: 'On a quantum Hall plateau both $\\rho_{xx}$ and $\\sigma_{xx}$ vanish at once, because $\\rho_{xy}$ is finite.' };
    } },
  { id: 'shl-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'carrier density and mobility against temperature', format: 'which is NOT',
    make(r) {
      const T = [
        ['At very low temperature an n-type semiconductor\'s electrons freeze out onto the donors', 'The donor binding energy (about 10 meV) exceeds $k_BT$.'],
        ['In the extrinsic (saturation) range the electron density is nearly equal to the donor density', 'All donors are ionised, and intrinsic carriers are still few.'],
        ['In the intrinsic range $n \\propto T^{3/2}e^{-E_g/2k_BT}$', 'From $n_i = \\sqrt{N_cN_v}\\,e^{-E_g/2k_BT}$.'],
        ['Lattice (acoustic phonon) scattering gives a mobility proportional to $T^{-3/2}$', 'More phonons and faster carriers at higher $T$.'],
        ['Ionised-impurity scattering gives a mobility proportional to $T^{3/2}$', 'Fast carriers are deflected less by Coulomb centres.'],
      ];
      const F = [
        ['Lattice scattering gives a mobility proportional to $T^{3/2}$', 'It is $T^{-3/2}$; $T^{3/2}$ is the impurity law.'],
        ['Impurity scattering dominates the mobility at high temperature', 'It dominates at low temperature; phonons win at high $T$.'],
        ['In the saturation range the electron density grows exponentially with $T$', 'It is nearly constant there.'],
        ['In the intrinsic range, a plot of $\\ln n$ against $1/T$ has slope $-E_g/k_B$', 'The slope is $-E_g/2k_B$.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About a doped semiconductor, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Intrinsic carriers come in pairs, each needing half the gap: the slope is $-E_g/2k_B$.' };
    } },
  { id: 'shl-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cyclotron energy', format: 'order of magnitude',
    make(r) {
      const M = choose(r, [['electrons in InSb', 0.014], ['electrons in GaAs', 0.067], ['electrons in silicon (cyclotron mass)', 0.26], ['free electrons', 1], ['heavy-fermion quasiparticles', 100]]);
      const B = choose(r, [0.1, 1, 10, 30]);
      const T = 1.0546e-34 * 1.602177e-19 * B / (M[1] * 9.109e-31) / 1.380649e-23;
      const o = oomMcq(r, T, 'K');
      return { q: `For ${M[0]} ($m^* = ${M[1]}\\,m_e$) in a field of $${B}$ T, the temperature at which $k_BT$ equals the Landau-level spacing $\\hbar\\omega_c$ is closest to`, ...o,
        sol: `$\\hbar\\omega_c/k_B = \\hbar eB/(m^*k_B) = 1.34\\text{ K/T}\\times B/(m^*/m_e) = ${fmt(T, 3)}$ K, nearest $10^{${o.k}}$ K. Landau quantisation shows up only when $k_BT \\ll \\hbar\\omega_c$ (and $\\omega_c\\tau \\gg 1$), which light-mass semiconductors make easy.`,
        trap: 'The spacing grows as $1/m^*$: GaAs electrons have Landau gaps about 15 times larger than free electrons in the same field.' };
    } },
];
