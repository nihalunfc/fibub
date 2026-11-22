// Extra question shapes for deuteron-nuclear-force (templates deut-m31..m35). Imported by deuteron-nuclear-force.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

export default [
  { id: 'deut-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'deuteron', format: 'statements',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['the deuteron ground state has $J^\\pi = 1^+$ and isospin $T = 0$', true, 'Spin triplet, even $L$, and an antisymmetric total wavefunction then needs $T = 0$.'],
        ['the deuteron is mostly $^3S_1$ with a few per cent of $^3D_1$', true, 'About 4-6% D state, fixed by the quadrupole moment and magnetic moment.'],
        ['the deuteron has no bound excited states', true, 'It is bound by only 2.22 MeV; nothing else is bound.'],
        ['the nonzero quadrupole moment of the deuteron shows that the nuclear force has a tensor part', true, 'A central force alone would give a pure S state with $Q = 0$.'],
        ['the spin-singlet neutron-proton state is weakly bound', false, 'It is a virtual (unbound) state; its scattering length is $-23.7$ fm.'],
        ['the dineutron (nn) is bound', false, 'The nn system in the only allowed $L = 0$ state is a spin singlet, which is unbound.'],
        ['the deuteron binding energy is about 2.22 MeV', true, 'Measured from $np \\to d\\gamma$ capture: $E_\\gamma = 2.224$ MeV.'],
        ['the deuteron magnetic moment equals $\\mu_p + \\mu_n$ exactly', false, '0.857 against 0.880 $\\mu_N$: the D state reduces it.'],
      ], { not });
      return { q: `Which of the following statements about the deuteron are ${nt(not)}?`, ...m,
        trap: 'Only the spin-triplet np state is bound; singlet np, nn and pp are not.' };
    } },
  { id: 'deut-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'nuclear force',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the nuclear force has a range of about 1-2 fm', true, 'Set mainly by one-pion exchange, $\\hbar/(m_\\pi c) \\approx 1.4$ fm.'],
        ['the nuclear force is nearly charge independent', true, 'In the same spin-isospin state, nn, np and pp forces are nearly equal.'],
        ['the nuclear force depends on the relative spin orientation of the nucleons', true, 'Triplet np is bound, singlet np is not.'],
        ['the nuclear force becomes strongly repulsive below about 0.5 fm', true, 'The repulsive core, seen in high-energy phase shifts turning negative.'],
        ['the nuclear force is purely central', false, 'The deuteron quadrupole moment requires a tensor force.'],
        ['the nuclear force falls off as $1/r^2$ like the Coulomb force', false, 'It falls exponentially (Yukawa), $e^{-r/a}/r$.'],
        ['the np force in a given spin-isospin state is much stronger than the pp force in the same state', false, 'Charge independence says they are nearly the same; the difference between np and pp systems comes from the states allowed by the Pauli principle.'],
      ], not);
      return { q: `Which statement about the nucleon-nucleon force is ${nt(not)}?`, ...m,
        trap: 'The np system binds and pp does not because of the allowed spin states, not because the force is different.' };
    } },
  { id: 'deut-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'deuteron size', format: 'scaling',
    make(r) {
      const k = choose(r, [4, 9, 16, 0.25]), f = 1 / Math.sqrt(k);
      const show = (x) => (x >= 1 ? `$${Math.round(x)}$` : `$\\tfrac{1}{${Math.round(1 / x)}}$`);
      const o = mcqOptions(r, f, [1 / k, k, Math.sqrt(k), 1 / (k * k)], show);
      return { q: `Outside the range of the force, the deuteron wavefunction falls as $e^{-\\kappa r}/r$ with $\\kappa = \\sqrt{2\\mu B}/\\hbar$. If the binding energy $B$ were ${k > 1 ? `${k} times larger` : '4 times smaller'}, the decay length $1/\\kappa$ of the tail would change by a factor`,
        options: o.options, answer: o.answer,
        sol: `$1/\\kappa \\propto B^{-1/2}$, so multiplying $B$ by ${k > 1 ? k : '$\\tfrac14$'} multiplies $1/\\kappa$ by ${show(f)}. For the real deuteron $1/\\kappa = \\hbar c/\\sqrt{m_Nc^2B} \\approx 197/\\sqrt{939\\times2.22} \\approx 4.3$ fm, much larger than the 1.4 fm range of the force: the deuteron is a loosely bound, extended system.`,
        trap: 'The tail length goes as $B^{-1/2}$, not $B^{-1}$.' };
    } },
  { id: 'deut-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nuclear force', format: 'match',
    make(r) {
      const L = { ten: 'a tensor component of the force', spin: 'spin dependence of the force', cs: 'charge symmetry (nn = pp) of the force', sat: 'saturation (short range plus a repulsive core)', core: 'a strongly repulsive core', pion: 'one-pion exchange' };
      const cas = choose(r, [
        ['The deuteron has an electric quadrupole moment.', 'ten', 'A tensor force mixes $^3S_1$ with $^3D_1$, making the deuteron slightly prolate.'],
        ['The spin-triplet np state is bound but the spin-singlet np state is not.', 'spin', 'The force must be stronger in the triplet.'],
        ['Mirror nuclei such as ${}^3$H and ${}^3$He have nearly identical level schemes after Coulomb corrections.', 'cs', 'Swapping all protons and neutrons changes nothing except the Coulomb energy.'],
        ['Binding energy per nucleon and density are roughly the same in all medium and heavy nuclei.', 'sat', 'Each nucleon interacts only with near neighbours and cannot be squeezed closer.', ['core']],
        ['The S-wave nucleon-nucleon phase shift changes sign and becomes negative above about 250 MeV.', 'core', 'At high energy the waves probe short distances, where a repulsive core dominates.', ['sat']],
        ['The long-range tail of the force has a range of about 1.4 fm.', 'pion', 'Yukawa: range $\\hbar/(m_\\pi c)$ with $m_\\pi c^2 \\approx 140$ MeV.'],
      ]);
      return { q: `${cas[0]} This is direct evidence for`, ...matchOne(r, L, cas),
        trap: 'The quadrupole moment points to the tensor force; the triplet-singlet difference points to spin dependence.' };
    } },
  { id: 'deut-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Yukawa theory', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 2);
      let q, x, unit, sol;
      if (kind === 0) {
        const [m, nm] = choose(r, [[139.6, 'a pion (139.6 MeV)'], [775, 'a $\\rho$ meson (775 MeV)'], [783, 'an $\\omega$ meson (783 MeV)'], [550, 'a scalar meson of about 550 MeV']]);
        x = (197.33 / m) * 1e-15; unit = '\\text{m}';
        q = `The range of the part of the nuclear force carried by exchange of ${nm} is about`;
        sol = `Range $\\approx \\hbar/(mc) = \\hbar c/(mc^2) = 197.3\\text{ MeV fm}/${m}\\text{ MeV} = ${(197.33 / m).toFixed(2)}$ fm $= ${sci(x)}$ m.`;
      } else if (kind === 1) {
        x = 2.224 ** 2 / (2 * 1875.6) * 1e6; unit = '\\text{eV}';
        q = 'In thermal neutron capture $n + p \\to d + \\gamma$ the photon has 2.22 MeV. The recoil kinetic energy of the deuteron is about';
        sol = `Momentum balance: $p_d = E_\\gamma/c$, so $T_d = E_\\gamma^2/(2m_dc^2) = (2.224)^2/(2\\times1875.6)$ MeV $= ${sci(x)}$ eV.`;
      } else {
        x = 1239.84 / 2.224e6 * 1e-9; unit = '\\text{m}';
        q = 'The wavelength of the 2.22 MeV photon emitted in $n + p \\to d + \\gamma$ is about';
        sol = `$\\lambda = hc/E = 1240\\text{ eV nm}/2.22\\times10^6\\text{ eV} = ${sci(x)}$ m, about 560 fm: much bigger than the deuteron.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Use $\\hbar c = 197.3$ MeV fm and $hc = 1240$ eV nm.' };
    } },
];
