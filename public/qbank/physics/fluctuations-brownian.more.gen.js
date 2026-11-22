// Extra question shapes for fluctuations-brownian (templates netfb-m31..m35). Imported by fluctuations-brownian.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netfb-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'diffusion', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 4]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `making a Brownian sphere ${k} times larger in radius (same fluid and temperature) divides its diffusion constant by ${k}`, `making a Brownian sphere ${k} times larger in radius (same fluid and temperature) divides its diffusion constant by ${k * k}`, `Stokes-Einstein: $D = kT/(6\\pi\\eta a) \\propto 1/a$.`),
        ['the mean square displacement grows linearly in time at long times', true, '$\\langle x^2\\rangle = 2Dt$ in one dimension.'],
        ['in three dimensions $\\langle r^2\\rangle = 6Dt$', true, 'Each of the three directions contributes $2Dt$.'],
        ['the velocity autocorrelation of a Langevin particle decays as $e^{-t/\\tau}$ with $\\tau = m/\\gamma$', true, 'The friction relaxes the velocity on that time scale.'],
        ['the root-mean-square displacement grows linearly in time at long times', false, 'It grows as $\\sqrt t$.'],
        ['the diffusion constant rises with the viscosity of the fluid', false, '$D \\propto 1/\\eta$.'],
        ['relative fluctuations of an extensive quantity scale as $1/\\sqrt N$', true, 'Variance $\\propto N$, mean $\\propto N$.'],
        ['the Einstein relation links mobility and diffusion: $D = \\mu kT$', true, 'Fluctuation and dissipation have a common origin.'],
      ], { not });
      return { q: `Which of the following statements about Brownian motion are ${nt(not)}?`, ...m,
        trap: 'Diffusion: mean square displacement (not rms) grows linearly in time.' };
    } },
  { id: 'netfb-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fluctuation-dissipation',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the Johnson noise power per unit bandwidth of a resistor is $4kTR$ (as mean square voltage)', true, 'Nyquist\'s result: thermal fluctuations of the charge carriers.'],
        ['the heat capacity is proportional to the energy variance in the canonical ensemble', true, '$C_V = \\langle\\Delta E^2\\rangle/(kT^2)$.'],
        ['the isothermal compressibility is related to the particle-number variance in the grand ensemble', true, '$\\langle\\Delta N^2\\rangle/\\langle N\\rangle = nkT\\kappa_T$.'],
        ['the magnetic susceptibility is related to the variance of the magnetisation', true, '$\\chi \\propto \\langle\\Delta M^2\\rangle/kT$.'],
        ['shot noise depends on temperature but not on current', false, 'Shot noise $2eI\\Delta f$ depends on current, not on temperature.'],
        ['Johnson noise vanishes when no current flows through the resistor', false, 'It is present in equilibrium, with no current at all.'],
        ['large fluctuations always mean large dissipation, whatever the temperature', false, 'The link involves $kT$: response $\\propto$ fluctuation$/kT$.'],
      ], not);
      return { q: `Which statement linking fluctuations to response is ${nt(not)}?`, ...m,
        trap: 'Johnson noise is equilibrium noise (needs $T$, not current); shot noise needs current, not $T$.' };
    } },
  { id: 'netfb-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Langevin equation', format: 'graph in words',
    make(r) {
      const L = {
        t2: 'grows as $t^2$',
        t1: 'grows in proportion to $t$',
        sat: 'rises and then levels off at a constant value',
        sub: 'grows as $t^\\alpha$ with $\\alpha \\lt 1$',
        drift: 'grows as $t$ at first and then as $t^2$',
      };
      const cas = choose(r, [
        ['a free Brownian particle at times much shorter than its velocity relaxation time $m/\\gamma$', 't2', 'Ballistic: the velocity has not changed yet, $x \\approx vt$, so $\\langle x^2\\rangle = (kT/m)t^2$.'],
        ['a free Brownian particle at times much longer than $m/\\gamma$', 't1', 'Diffusive: $\\langle x^2\\rangle = 2Dt$.'],
        ['a Brownian particle held in an optical trap of stiffness $\\kappa$, at long times', 'sat', 'Equipartition: $\\langle x^2\\rangle \\to kT/\\kappa$.'],
        ['a tracer in a crowded, gel-like medium', 'sub', 'Obstacles make motion anomalously slow (subdiffusion).'],
        ['a Brownian particle that also drifts at a steady velocity (measured about its starting point)', 'drift', '$\\langle x^2\\rangle = 2Dt + v^2t^2$: diffusion wins at first, drift later.'],
      ]);
      return { q: `The mean square displacement of ${cas[0]}`, ...matchOne(r, L, cas),
        trap: 'Short times: ballistic ($t^2$). Long times: diffusive ($t$). Confinement: saturation.' };
    } },
  { id: 'netfb-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Langevin equation', format: 'limiting case',
    make(r) {
      const tau = choose(r, [1, 2, 5]), small = r() < 0.5, t = small ? tau / 100 : tau * 100;
      const L = { a: '$(kT/m)\\,t^2$', b: '$2Dt$ with $D = kT/\\gamma$', c: '$kT/\\kappa$', d: '$2Dt^2$', e: '$(kT/m)\\,t$' };
      const key = small ? 'a' : 'b';
      return { q: `A free Brownian particle obeys $m\\dot v = -\\gamma v + \\xi(t)$, with $m/\\gamma = ${tau}$ µs. Starting from equilibrium velocities, its mean square displacement at $t = ${sci(t)}$ µs is best approximated by`,
        ...matchOne(r, L, [null, key, `The exact result is $\\langle x^2\\rangle = \\tfrac{2kT}{\\gamma}[t - \\tau(1 - e^{-t/\\tau})]$ with $\\tau = m/\\gamma$. Here $t/\\tau = ${sci(t / tau)}$. ${small ? 'For $t \\ll \\tau$ expand the exponential to second order: $\\langle x^2\\rangle \\approx (kT/m)t^2$ (ballistic).' : 'For $t \\gg \\tau$ the bracket is $t - \\tau \\approx t$: $\\langle x^2\\rangle \\approx 2kTt/\\gamma = 2Dt$ (diffusive).'}`]),
        trap: 'Compare $t$ with $m/\\gamma$ first; the formula changes from $t^2$ to $t$ there.' };
    } },
  { id: 'netfb-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'diffusion', format: 'order of magnitude',
    make(r) {
      const a = choose(r, [1e-9, 10e-9, 100e-9, 1e-6]), Ld = choose(r, [1e-6, 10e-6, 100e-6, 1e-3]);
      const D = (1.381e-23 * 300) / (6 * Math.PI * 1e-3 * a), x = (Ld * Ld) / (6 * D);
      const o = orderOpts(r, x, '\\text{s}');
      const nm = (v) => (v >= 1e-6 ? `${Math.round(v * 1e6)} µm` : `${Math.round(v * 1e9)} nm`);
      return { q: `A sphere of radius ${nm(a)} diffuses in water ($\\eta = 10^{-3}$ Pa s) at 300 K. The time for its rms displacement in 3D to reach ${Ld >= 1e-3 ? '1 mm' : nm(Ld)} is about`,
        options: o.options, answer: o.answer,
        sol: `$D = kT/(6\\pi\\eta a) = ${sci(D)}$ m$^2$/s. With $\\langle r^2\\rangle = 6Dt$: $t = L^2/(6D) = ${sci(x)}$ s.`,
        trap: 'Diffusion time grows as the square of the distance: ten times farther takes a hundred times longer.' };
    } },
];
