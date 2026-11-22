// Extra question shapes for fourier-laplace-transforms (templates flt-m31..m35). Imported by fourier-laplace-transforms.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'flt-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'transform rules', format: 'statements',
    make(r) {
      const a = int(r, 2, 5), not = r() < 0.5;
      const m = msqOf(r, [
        [`$\\mathcal L\\{f(t - ${a})\\,u(t - ${a})\\} = e^{-${a}s}F(s)$`, true, 'Delaying a causal signal multiplies its transform by $e^{-as}$ (second shift theorem).'],
        [`$\\mathcal L\\{e^{${a}t}f(t)\\} = F(s - ${a})$`, true, `$\\int_0^\\infty e^{-st}e^{${a}t}f\\,dt = \\int_0^\\infty e^{-(s - ${a})t}f\\,dt$.`],
        [`$\\mathcal L\\{e^{${a}t}f(t)\\} = F(s + ${a})$`, false, `The shift is to $s - ${a}$, not $s + ${a}$.`],
        ['$\\mathcal L\\{f\'(t)\\} = sF(s) - f(0)$', true, 'Integrate by parts: $\\int_0^\\infty e^{-st}f\'\\,dt = [e^{-st}f]_0^\\infty + s\\int_0^\\infty e^{-st}f\\,dt$.'],
        ['$\\mathcal L\\{f\'(t)\\} = sF(s)$', false, 'The boundary term $-f(0)$ is missing; this is how initial conditions enter.'],
        ['$\\mathcal L\\{t f(t)\\} = -F\'(s)$', true, 'Differentiating $\\int e^{-st}f\\,dt$ with respect to $s$ brings down $-t$.'],
        [`the Fourier transform of $f(x - ${a})$ is $e^{-i${a}k}\\tilde f(k)$`, true, `Substitute $y = x - ${a}$: $\\int f(y)e^{-ik(y + ${a})}dy$.`],
        [`the Fourier transform of $f(${a}x)$ is $\\tfrac{1}{${a}}\\tilde f(k/${a})$`, true, `Substitute $y = ${a}x$: squeezing in $x$ stretches in $k$.`],
        [`the Fourier transform of $f(${a}x)$ is $${a}\\tilde f(${a}k)$`, false, `It is $\\tfrac{1}{${a}}\\tilde f(k/${a})$: a narrower function has a wider transform.`],
        ['the Fourier transform of $f\'(x)$ is $-ik\\tilde f(k)$', false, 'Integrating by parts with $e^{-ikx}$ gives $+ik\\tilde f(k)$.'],
        ['if $f$ is real and even, $\\tilde f$ is real and even', true, 'The sine part of $e^{-ikx}$ integrates to zero, leaving $2\\int_0^\\infty f\\cos kx\\,dx$.'],
      ], { not });
      return { q: `With $F(s) = \\mathcal L\\{f\\} = \\int_0^\\infty f(t)e^{-st}dt$, $u$ the unit step, and $\\tilde f(k) = \\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx$, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Watch the signs: multiplying by $e^{at}$ shifts $s$ to $s - a$, and the derivative rule carries $-f(0)$.' };
    } },
  { id: 'flt-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spectra', format: 'match',
    make(r) {
      const T = int(r, 2, 6), g = int(r, 1, 4), w0 = int(r, 20, 60), s = int(r, 2, 5);
      const L = {
        sinc: 'an oscillating $\\sin(\\omega\\tau)/\\omega$ shape (a sinc) with evenly spaced zeros',
        gauss: 'a Gaussian centred on $\\omega = 0$',
        lor: 'a single Lorentzian $\\propto 1/(\\gamma^2 + \\omega^2)$ centred on $\\omega = 0$',
        flat: 'flat: the same at every frequency',
        spike: 'a single delta-function spike at $\\omega = 0$',
        pair: `two delta-function spikes at $\\omega = \\pm${w0}$`,
        lpair: `two Lorentzian peaks of width about ${g} centred at $\\omega = \\pm${w0}$`,
      };
      const cas = choose(r, [
        [`a rectangular pulse, $f(t) = 1$ for $|t| \\lt ${T / 2}$ and 0 otherwise`, 'sinc', `$\\tilde f(\\omega) = \\int_{-${T / 2}}^{${T / 2}}e^{-i\\omega t}dt = \\dfrac{2\\sin(${T / 2}\\omega)}{\\omega}$, with zeros at $\\omega = 2\\pi m/${T}$.`],
        [`a Gaussian pulse $e^{-t^2/${2 * s * s}}$`, 'gauss', `A Gaussian transforms to a Gaussian: $\\propto e^{-${s * s}\\omega^2/2}$ (width $1/${s}$).`],
        [`a two-sided exponential $e^{-${g}|t|}$`, 'lor', `$\\int e^{-${g}|t|}e^{-i\\omega t}dt = \\dfrac{${2 * g}}{${g * g} + \\omega^2}$.`],
        ['a delta-function impulse $\\delta(t)$', 'flat', '$\\int\\delta(t)e^{-i\\omega t}dt = 1$ for every $\\omega$.'],
        ['a constant signal $f(t) = 1$ for all $t$', 'spike', '$\\int e^{-i\\omega t}dt = 2\\pi\\delta(\\omega)$.'],
        [`a pure tone $\\cos ${w0}t$ lasting for ever`, 'pair', `$\\cos\\omega_0t = (e^{i\\omega_0t} + e^{-i\\omega_0t})/2$ gives $\\pi[\\delta(\\omega - ${w0}) + \\delta(\\omega + ${w0})]$.`],
        [`a decaying tone $e^{-${g}|t|}\\cos ${w0}t$`, 'lpair', `The cosine shifts the Lorentzian of $e^{-${g}|t|}$ to $\\pm${w0}$: $\\dfrac{${g}}{${g * g} + (\\omega - ${w0})^2} + \\dfrac{${g}}{${g * g} + (\\omega + ${w0})^2}$ (here $\\gamma = ${g} \\ll \\omega_0 = ${w0}$).`],
      ]);
      return { q: `The Fourier transform $\\tilde f(\\omega) = \\int_{-\\infty}^{\\infty}f(t)e^{-i\\omega t}dt$ of ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Sharp edges give slowly decaying, oscillating spectra; smooth decays give smooth peaks.' };
    } },
  { id: 'flt-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'poles and behaviour', format: 'match',
    make(r) {
      const a = int(r, 1, 5), w = int(r, 2, 6);
      const L = { cst: 'approaches a non-zero constant', osc: 'oscillates with constant amplitude', grow: 'grows exponentially', lin: 'grows linearly', dec: 'decays to zero without oscillating', dosc: 'decays to zero while oscillating' };
      const cas = choose(r, [
        [`\\dfrac{1}{s(s + ${a})}`, 'cst', `Partial fractions: $\\tfrac{1}{${a}}\\left(\\tfrac1s - \\tfrac{1}{s + ${a}}\\right)$, so $f = \\tfrac{1}{${a}}(1 - e^{-${a}t}) \\to \\tfrac{1}{${a}}$ (the pole at $s = 0$ survives).`],
        [`\\dfrac{1}{s^2 + ${w * w}}`, 'osc', `$f = \\tfrac{1}{${w}}\\sin ${w}t$: poles at $s = \\pm${w}i$ on the imaginary axis.`],
        [`\\dfrac{1}{s - ${a}}`, 'grow', `$f = e^{${a}t}$: a pole in the right half-plane.`],
        ['\\dfrac{1}{s^2}', 'lin', '$f = t$: a double pole at $s = 0$.'],
        [`\\dfrac{1}{(s + ${a})^2}`, 'dec', `$f = te^{-${a}t}$: a double real pole at $-${a}$; the factor $t$ cannot beat the exponential.`],
        [`\\dfrac{1}{(s + ${a})^2 + ${w * w}}`, 'dosc', `$f = \\tfrac{1}{${w}}e^{-${a}t}\\sin ${w}t$: complex poles $-${a} \\pm ${w}i$ in the left half-plane.`],
      ]);
      return { q: `$F(s) = ${cas[0]}$ is the Laplace transform of $f(t)$. For large $t$, $f(t)$`, ...matchOne(r, L, cas),
        trap: 'Read the long-time behaviour from the poles: right half-plane grows, imaginary axis oscillates, left half-plane decays, $s = 0$ leaves a constant.' };
    } },
  { id: 'flt-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'time-bandwidth', format: 'order of magnitude',
    make(r) {
      const U = choose(r, [['fs', -15], ['ps', -12], ['ns', -9]]), e = int(r, 0, 2);
      const tau = 10 ** (U[1] + e), nu = 0.44 / tau;
      const o = orderOpts(r, nu, '\\text{Hz}');
      return { q: `A light pulse lasts about $${10 ** e}$ ${U[0]}. The spread of frequencies $\\Delta\\nu$ it must contain is of order`, ...o,
        sol: `Time and frequency widths are Fourier partners: $\\Delta\\nu\\,\\Delta t \\gtrsim 1$ (for a Gaussian pulse $\\Delta\\nu\\,\\Delta t \\approx 0.44$ with full widths). With $\\Delta t = 10^{${U[1] + e}}$ s, $\\Delta\\nu \\approx 0.44/\\Delta t = ${(nu / 10 ** o.n).toFixed(2)}\\times10^{${o.n}}$ Hz, so of order $10^{${o.n}}$ Hz.`,
        trap: 'Shorter pulses are spectrally broader; a factor of order 1 in the time-bandwidth product does not change the power of ten.' };
    } },
  { id: 'flt-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs', format: 'which is NOT',
    make(r) {
      const a = int(r, 2, 5), n = int(r, 2, 4), not = r() < 0.6;
      const fct = [1, 1, 2, 6, 24][n];
      const m = oneOf(r, [
        [`$\\mathcal L\\{t^{${n}}\\} = \\dfrac{${fct}}{s^{${n + 1}}}$`, true, `$\\mathcal L\\{t^n\\} = n!/s^{n+1}$, and $${n}! = ${fct}$.`],
        [`$\\mathcal L\\{\\cos ${a}t\\} = \\dfrac{s}{s^2 + ${a * a}}$`, true, 'Take the real part of $\\mathcal L\\{e^{iat}\\} = 1/(s - ia)$.'],
        [`$\\mathcal L\\{\\sinh ${a}t\\} = \\dfrac{${a}}{s^2 - ${a * a}}$`, true, `$\\tfrac12\\left(\\tfrac{1}{s - ${a}} - \\tfrac{1}{s + ${a}}\\right)$.`],
        [`$\\mathcal L\\{te^{${a}t}\\} = \\dfrac{1}{(s - ${a})^2}$`, true, `Shift $\\mathcal L\\{t\\} = 1/s^2$ to $s - ${a}$.`],
        [`$\\mathcal L\\{\\delta(t - ${a})\\} = e^{-${a}s}$`, true, 'The delta picks out $e^{-st}$ at $t = a$.'],
        [`$\\mathcal L\\{\\cos ${a}t\\} = \\dfrac{${a}}{s^2 + ${a * a}}$`, false, `That is $\\mathcal L\\{\\sin ${a}t\\}$; the cosine has $s$ on top.`],
        [`$\\mathcal L\\{t^{${n}}\\} = \\dfrac{${fct}}{s^{${n}}}$`, false, `The power of $s$ is $n + 1 = ${n + 1}$.`],
        [`$\\mathcal L\\{\\sinh ${a}t\\} = \\dfrac{${a}}{s^2 + ${a * a}}$`, false, 'The hyperbolic sine has $s^2 - a^2$ below.'],
        [`$\\mathcal L\\{u(t - ${a})\\} = \\dfrac{e^{${a}s}}{s}$`, false, `A delay gives $e^{-${a}s}/s$; the sign in the exponent is negative.`],
      ], not);
      return { q: `Which Laplace transform pair is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Sine has $a$ on top, cosine $s$; hyperbolic versions swap $+a^2$ for $-a^2$.' };
    } },
];
