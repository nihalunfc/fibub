// Extra question shapes for quantum-hall (templates qhe-m31..m35). Imported by quantum-hall.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

const RK = 25812.807;

export default [
  { id: 'qhe-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'integer QHE', format: 'statements',
    make(r) {
      const nu = int(r, 1, 6), Rxy = RK / nu / 1000, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `on the $\\nu = ${nu}$ plateau the Hall resistance is about ${Rxy.toFixed(3)} kΩ`, `on the $\\nu = ${nu}$ plateau the Hall resistance is about ${(RK * nu / 1000).toFixed(3)} kΩ`, `$R_{xy} = h/(\\nu e^2) = 25.813/${nu}$ kΩ $= ${Rxy.toFixed(3)}$ kΩ.`),
        ['on a quantum Hall plateau the longitudinal resistance $R_{xx}$ drops to nearly zero', true, 'Current flows in dissipationless edge channels.'],
        ['the plateaus exist because disorder localises the states between Landau-level centres', true, 'Changing $B$ fills localised states, which do not change $R_{xy}$.'],
        ['the quantised values of $R_{xy}$ do not depend on the sample\'s size or shape', true, 'That is why they serve as a resistance standard.'],
        ['the fractional effect at $\\nu = 1/3$ requires electron-electron interactions', true, 'Non-interacting electrons in a partly filled level would give no gap.'],
        ['$R_{xx}$ is largest in the middle of each plateau', false, '$R_{xx}$ vanishes on plateaus and peaks between them.'],
        ['the plateau value depends on the sample width', false, 'It is $h/(\\nu e^2)$ for any geometry.'],
        ['graphene shows Hall plateaus at $\\sigma_{xy} = \\pm2, \\pm6, \\pm10, \\dots$ in units of $e^2/h$', true, 'Four-fold degeneracy plus the zero-energy Landau level give $4(n + \\tfrac12)$.'],
      ], { not });
      return { q: `Which of the following statements about the quantum Hall effect are ${nt(not)}?`, ...m,
        trap: 'On a plateau: $R_{xy}$ quantised AND $R_{xx} \\approx 0$, both at once.' };
    } },
  { id: 'qhe-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Landau levels',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the degeneracy of a Landau level per unit area is $eB/h$ (per spin)', true, 'One state per flux quantum $h/e$.'],
        ['the spacing of Landau levels in an ordinary 2D electron gas is $\\hbar\\omega_c = \\hbar eB/m^*$', true, 'Harmonic-oscillator-like levels.'],
        ['raising $B$ raises the number of states in each Landau level', true, 'Degeneracy is proportional to $B$.'],
        ['the filling factor is $\\nu = nh/(eB)$', true, 'Electrons per flux quantum.'],
        ['Landau levels in graphene are spaced unequally, with $E_n \\propto \\sqrt{nB}$', true, 'Massless Dirac electrons.'],
        ['the Landau-level spacing in an ordinary 2DEG does not depend on $B$', false, 'It grows linearly with $B$.'],
        ['raising $B$ at fixed density raises the filling factor', false, '$\\nu = nh/(eB)$ falls as $B$ grows.'],
        ['Landau levels in graphene are equally spaced in energy', false, '$E_n \\propto \\pm\\sqrt{n}$.'],
      ], not);
      return { q: `Which statement about Landau levels in two dimensions is ${nt(not)}?`, ...m,
        trap: 'More field means fewer filled levels: $\\nu$ falls as $1/B$.' };
    } },
  { id: 'qhe-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conductivity tensor', format: 'graph in words',
    make(r) {
      const L = {
        stair: 'a staircase of flat plateaus joined by steps, rising with $B$',
        spikes: 'zero over wide ranges of $B$, with sharp peaks between them',
        line: 'a straight line through the origin',
        osc: 'oscillations that are periodic when plotted against $1/B$',
        half: 'a staircase with plateaus at $h/(2e^2)$, $h/(6e^2)$, $h/(10e^2)$, ...',
      };
      const cas = choose(r, [
        ['the Hall resistance $R_{xy}$ of a GaAs 2DEG at 1.5 K and high field, against $B$', 'stair', 'Integer quantum Hall plateaus at $h/(\\nu e^2)$.', ['half']],
        ['the longitudinal resistance $R_{xx}$ of the same sample, against $B$', 'spikes', 'Dissipation only when the Fermi level crosses extended states.'],
        ['the Hall resistance of a thick metal film at room temperature, against $B$', 'line', 'Classical Hall effect: $R_H = B/(ne)$ per unit thickness.'],
        ['the resistivity of a 2DEG at low field (Shubnikov-de Haas regime), against $B$', 'osc', 'Each Landau level crossing the Fermi level gives a peak; spacing $\\Delta(1/B) = 2e/(hn)$ for spin-degenerate levels.'],
        ['the Hall resistance of monolayer graphene at high field, against $B$', 'half', 'Half-integer (relativistic) quantum Hall effect.', ['stair']],
      ]);
      return { q: `Described in words, ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Shubnikov-de Haas oscillations are periodic in $1/B$, not in $B$.' };
    } },
  { id: 'qhe-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'filling factor', format: 'limiting case',
    make(r) {
      const n = choose(r, [2, 3, 4, 5]) * 1e15, nu = int(r, 1, 4), B = (n * 6.626e-34) / (1.602e-19 * nu), Rcl = B / (n * 1.602e-19);
      const show = (x) => `${(x / 1000).toFixed(2)} kΩ`;
      const o = mcqOptions(r, Rcl, [RK * nu, RK / (nu + 1), RK / (2 * nu), RK / nu / 2 + RK], show);
      return { q: `A 2DEG has density $n = ${sci(n)}$ m$^{-2}$. At the field where the filling factor is exactly $\\nu = ${nu}$ (that is, $B = ${B.toFixed(2)}$ T), the classical Hall formula $R_{xy} = B/(ne)$ gives`,
        options: o.options, answer: o.answer,
        sol: `$B/(ne) = ${B.toFixed(3)}/(${sci(n)}\\times1.602\\times10^{-19}) = ${show(Rcl)}$. This equals $h/(\\nu e^2) = 25.813/${nu}$ kΩ exactly, because $B = nh/(\\nu e)$: the classical line passes through the plateau at integer filling.`,
        trap: 'The classical Hall line crosses each quantum plateau where $\\nu$ is an integer.' };
    } },
  { id: 'qhe-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Landau levels', format: 'order of magnitude',
    make(r) {
      const B = choose(r, [1, 5, 10, 20]), kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        x = Math.sqrt(1.0546e-34 / (1.602e-19 * B)); unit = '\\text{m}';
        q = `The magnetic length $\\ell_B = \\sqrt{\\hbar/(eB)}$ at $B = ${B}$ T is about`;
        sol = `$\\ell_B = \\sqrt{1.055\\times10^{-34}/(1.602\\times10^{-19}\\times${B})} = ${sci(x)}$ m (25.7 nm$/\\sqrt{B[\\text{T}]}$).`;
      } else {
        x = (1.0546e-34 * 1.602e-19 * B) / (0.067 * 9.109e-31) / 1.602e-19; unit = '\\text{eV}';
        q = `The cyclotron energy $\\hbar\\omega_c$ for electrons in GaAs ($m^* = 0.067m_e$) at $B = ${B}$ T is about`;
        sol = `$\\hbar\\omega_c = \\hbar eB/m^* = ${sci(x)}$ eV (about 1.73 meV per tesla), compared with $kT \\approx 0.13$ meV at 1.5 K.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'A small effective mass makes the cyclotron energy large: that is why GaAs is used.' };
    } },
];
