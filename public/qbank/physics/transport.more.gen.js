// Extra question shapes for transport (templates nettr-m31..m35). Imported by transport.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'nettr-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'pressure dependence', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 5, 10]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `raising the pressure of a gas ${k}-fold at constant temperature divides its mean free path by ${k}`, `raising the pressure of a gas ${k}-fold at constant temperature leaves its mean free path unchanged`, '$\\lambda = kT/(\\sqrt2\\pi d^2p) \\propto 1/p$.'),
        vs(r, `raising the pressure of a gas ${k}-fold at constant temperature leaves its viscosity unchanged`, `raising the pressure of a gas ${k}-fold at constant temperature multiplies its viscosity by ${k}`, '$\\eta \\approx \\tfrac13nm\\bar v\\lambda$: $n$ rises as $p$, $\\lambda$ falls as $1/p$, so $\\eta$ is independent of pressure.'),
        vs(r, `raising the pressure of a gas ${k}-fold at constant temperature divides its self-diffusion constant by ${k}`, `raising the pressure of a gas ${k}-fold at constant temperature leaves its self-diffusion constant unchanged`, '$D \\approx \\tfrac13\\bar v\\lambda \\propto 1/p$.'),
        ['the viscosity of a dilute gas rises with temperature', true, 'For hard spheres $\\eta \\propto \\sqrt T$.'],
        ['the viscosity of a dilute gas falls with temperature, like that of a liquid', false, 'Gases and liquids behave oppositely: gas viscosity rises with $T$.'],
        ['the thermal conductivity of a dilute gas is independent of pressure (outside the Knudsen regime)', true, 'Same cancellation as for viscosity.'],
        ['the Prandtl number of a monatomic dilute gas is close to 2/3', true, 'Chapman-Enskog gives $\\text{Pr} = c_p\\eta/\\kappa = 2/3$.'],
      ], { not });
      return { q: `Which of the following statements about transport in dilute gases are ${nt(not)}?`, ...m,
        trap: 'Viscosity and conductivity are pressure independent; diffusion and mean free path go as $1/p$.' };
    } },
  { id: 'nettr-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Drude model',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the Drude conductivity is $\\sigma = ne^2\\tau/m$', true, 'From $m\\dot v = -eE - mv/\\tau$ in steady state.'],
        ['the Drude Hall coefficient is $R_H = -1/(ne)$ for electrons', true, 'Independent of $\\tau$.'],
        ['Matthiessen\'s rule adds resistivities from independent scattering mechanisms', true, 'Scattering rates add: $1/\\tau = 1/\\tau_{imp} + 1/\\tau_{ph}$.'],
        ['the resistivity of a pure metal rises roughly linearly with $T$ well above the Debye temperature', true, 'The number of phonons is proportional to $T$.'],
        ['the residual resistivity at low temperature depends on impurities and defects', true, 'Phonons freeze out, leaving static scattering.'],
        ['the Drude model explains the positive Hall coefficients of metals such as zinc', false, 'Free electrons always give $R_H \\lt 0$; positive values need band theory (holes).'],
        ['the classical Drude model gives the correct (small) electronic heat capacity', false, 'Classically each electron has $\\tfrac32k$; the real value is smaller by about $T/T_F$.'],
        ['the resistivity of a pure metal at very low $T$ rises as $T$', false, 'Bloch-Grüneisen: $\\propto T^5$ at low $T$.'],
      ], not);
      return { q: `Which statement about electrical transport in metals is ${nt(not)}?`, ...m,
        trap: 'Drude gets the conductivity and Wiedemann-Franz roughly right for the wrong reasons; it fails on heat capacity and positive Hall coefficients.' };
    } },
  { id: 'nettr-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'temperature dependence', format: 'match',
    make(r) {
      const L = { sq: '$\\propto T^{1/2}$', t32: '$\\propto T^{3/2}$', lin: '$\\propto T$', t5: '$\\propto T^5$', inv: '$\\propto 1/T$', t3: '$\\propto T^3$' };
      const cas = choose(r, [
        ['the viscosity of a hard-sphere gas', 'sq', '$\\eta \\propto m\\bar v/\\sigma \\propto \\sqrt T$.'],
        ['the self-diffusion constant of a hard-sphere gas at constant pressure', 't32', '$D \\propto \\bar v\\lambda$ with $\\bar v \\propto \\sqrt T$ and $\\lambda \\propto T/p$.'],
        ['the phonon part of the resistivity of a metal well above the Debye temperature', 'lin', 'Phonon number $\\propto T$.'],
        ['the phonon part of the resistivity of a metal far below the Debye temperature', 't5', 'Bloch-Grüneisen law.'],
        ['the thermal conductivity of an insulating crystal well above the Debye temperature', 'inv', 'Umklapp scattering rate grows with the phonon number $\\propto T$.'],
        ['the thermal conductivity of an insulating crystal at very low temperature (boundary scattering)', 't3', 'Mean free path fixed by the sample size, heat capacity $\\propto T^3$.'],
      ]);
      return { q: `How does ${cas[0]} depend on temperature?`, ...matchOne(r, L, cas),
        trap: 'Gas diffusion at fixed pressure picks up an extra $T$ from the mean free path: $T^{3/2}$, not $T^{1/2}$.' };
    } },
  { id: 'nettr-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'free paths', format: 'limiting case',
    make(r) {
      const k = choose(r, [2, 3, 5]), cp = r() < 0.5;
      const show = (x) => (x === 1 ? 'unchanged (factor 1)' : `multiplied by $${x === Math.sqrt(k) ? `\\sqrt{${k}}` : x < 1 ? `\\tfrac1{${Math.round(1 / x)}}` : x}$`);
      const ans = cp ? k : 1;
      const o = mcqOptions(r, ans, [cp ? 1 : k, Math.sqrt(k), 1 / k], show);
      return { q: `The absolute temperature of a dilute hard-sphere gas is multiplied by ${k} at constant ${cp ? 'pressure' : 'volume (fixed number density)'}. Its mean free path is`,
        options: o.options, answer: o.answer,
        sol: `$\\lambda = 1/(\\sqrt2\\,n\\pi d^2)$ depends only on the number density. ${cp ? `At constant pressure $n = p/kT$ falls by ${k}, so $\\lambda$ grows by ${k}.` : 'At constant volume $n$ is fixed, so $\\lambda$ does not change; the molecules move faster but cross the same gaps.'}`,
        trap: 'The mean free path depends on density, not directly on speed.' };
    } },
  { id: 'nettr-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Knudsen regime', format: 'order of magnitude',
    make(r) {
      const p = choose(r, [101325, 100, 1, 1e-3, 1e-6]), d = 3.7e-10, x = (1.381e-23 * 300) / (Math.SQRT2 * Math.PI * d * d * p);
      const o = orderOpts(r, x, '\\text{m}');
      return { q: `The mean free path of nitrogen molecules (diameter $3.7\\times10^{-10}$ m) at 300 K and a pressure of $${sci(p)}$ Pa is about`,
        options: o.options, answer: o.answer,
        sol: `$\\lambda = kT/(\\sqrt2\\pi d^2p) = (1.38\\times10^{-23}\\times300)/(\\sqrt2\\pi(3.7\\times10^{-10})^2\\times${sci(p)}) = ${sci(x)}$ m.${x > 0.1 ? ' Larger than a typical vacuum chamber: the gas is in the Knudsen (molecular-flow) regime.' : ''}`,
        trap: 'At 1 atm the mean free path is tens of nanometres; it grows as $1/p$.' };
    } },
];
