// Extra question shapes for delta-greens-functions (templates dgf-m31..m35). Imported by delta-greens-functions.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'dgf-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'delta identities', format: 'statements',
    make(r) {
      const a = int(r, 2, 5), not = r() < 0.5;
      const m = msqOf(r, [
        [`$\\delta(${a}x) = \\tfrac{1}{${a}}\\delta(x)$`, true, `Substitute $y = ${a}x$ in $\\int f(x)\\delta(${a}x)dx$.`],
        [`$\\delta(-${a}x) = -\\tfrac{1}{${a}}\\delta(x)$`, false, 'The scaling uses $|a|$: $\\delta(-ax) = \\delta(x)/|a|$; the delta is even.'],
        ['$x\\,\\delta(x) = 0$', true, '$\\int f(x)\\,x\\,\\delta(x)dx = 0\\cdot f(0)$.'],
        ['$x\\,\\delta\'(x) = -\\delta(x)$', true, 'Integrate by parts: $\\int f\\,x\\,\\delta\'dx = -(fx)\'|_0 = -f(0)$.'],
        ['$\\int f(x)\\delta\'(x)\\,dx = f\'(0)$', false, 'Integration by parts gives $-f\'(0)$.'],
        [`$\\delta(x^2 - ${a * a}) = \\tfrac{1}{${2 * a}}[\\delta(x - ${a}) + \\delta(x + ${a})]$`, true, `$\\delta(g(x)) = \\sum\\delta(x - x_i)/|g'(x_i)|$ with $|g'(\\pm${a})| = ${2 * a}$.`],
        [`$\\delta(x^2 - ${a * a}) = \\delta(x - ${a}) + \\delta(x + ${a})$`, false, `Each root needs the factor $1/|g'| = 1/${2 * a}$.`],
        ['$\\dfrac{d}{dx}\\theta(x) = \\delta(x)$, where $\\theta$ is the unit step', true, 'The step has a unit jump at 0 and is flat elsewhere.'],
        ['$\\nabla^2\\dfrac{1}{r} = -4\\pi\\,\\delta^3(\\vec r)$', true, 'Zero away from the origin; the flux of $\\nabla(1/r)$ through any sphere is $-4\\pi$.'],
        ['$\\nabla^2\\dfrac{1}{r} = +4\\pi\\,\\delta^3(\\vec r)$', false, '$\\nabla(1/r) = -\\hat r/r^2$ points inwards, giving flux $-4\\pi$.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Scaling divides by $|a|$, and $\\delta\'$ hands the derivative to $f$ with a minus sign.' };
    } },
  { id: 'dgf-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Green\'s function', format: 'match',
    make(r) {
      const g = int(r, 1, 5), w = int(r, 2, 6), k = int(r, 1, 4);
      const R = '|\\vec r - \\vec r\\,\'|';
      const L = {
        lap3: `$-\\dfrac{1}{4\\pi${R}}$`,
        lap2: `$\\dfrac{1}{2\\pi}\\ln${R}$`,
        line: '$\\tfrac12|x - x\'|$',
        decay: `$\\theta(t - t')\\,e^{-${g}(t - t')}$`,
        osc: `$\\theta(t - t')\\,\\dfrac{\\sin ${w}(t - t')}{${w}}$`,
        yuk: `$-\\dfrac{e^{-${k}${R}}}{4\\pi${R}}$`,
      };
      const cas = choose(r, [
        ['$\\nabla^2G = \\delta^3(\\vec r - \\vec r\\,\')$ in all space, $G \\to 0$ at infinity', 'lap3', 'The Coulomb Green\'s function: from $\\nabla^2(1/r) = -4\\pi\\delta^3$.'],
        ['$\\nabla^2G = \\delta^2(\\vec r - \\vec r\\,\')$ in the plane', 'lap2', 'In 2D the flux of $\\nabla G = \\hat r/(2\\pi r)$ through a circle is 1, giving a logarithm.'],
        ['$\\dfrac{d^2G}{dx^2} = \\delta(x - x\')$ on the whole line (symmetric choice)', 'line', 'A kink: the slope jumps from $-\\tfrac12$ to $+\\tfrac12$ at $x\'$, a jump of 1.'],
        [`$\\dfrac{dG}{dt} + ${g}G = \\delta(t - t')$ with $G = 0$ before $t'$`, 'decay', `$G$ jumps from 0 to 1 at $t'$ and then decays freely at rate ${g}.`],
        [`$\\dfrac{d^2G}{dt^2} + ${w * w}G = \\delta(t - t')$ with $G = 0$ before $t'$`, 'osc', `The kick gives unit velocity at $t'$ with zero displacement; afterwards free oscillation at $\\omega = ${w}$.`],
        [`$(\\nabla^2 - ${k * k})G = \\delta^3(\\vec r - \\vec r\\,')$, $G \\to 0$ at infinity`, 'yuk', `The screened (Yukawa) form: the Coulomb Green's function times $e^{-${k}R}$.`],
      ]);
      return { q: `Which is the Green's function for ${cas[0]}?`, ...matchOne(r, L, cas),
        trap: 'Causal Green\'s functions contain $\\theta(t - t\')$; the dimension of space decides $1/R$ versus $\\ln R$.' };
    } },
  { id: 'dgf-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'delta sequences', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$\\dfrac{\\varepsilon}{\\pi(x^2 + \\varepsilon^2)}$', true, 'A Lorentzian of width $\\varepsilon$ and unit area.'],
        ['$\\dfrac{1}{\\varepsilon\\sqrt\\pi}e^{-x^2/\\varepsilon^2}$', true, 'A Gaussian of width $\\varepsilon$ and unit area.'],
        ['$\\dfrac{\\sin(x/\\varepsilon)}{\\pi x}$', true, 'Unit area ($\\int\\sin u/u\\,du = \\pi$) and oscillations elsewhere average out against smooth $f$.'],
        ['$\\dfrac{1}{2\\varepsilon}$ for $|x| \\lt \\varepsilon$, 0 otherwise', true, 'A box of unit area shrinking to the origin.'],
        ['$\\dfrac{1}{2\\varepsilon}e^{-|x|/\\varepsilon}$', true, 'Unit area, shrinking width.'],
        ['$\\dfrac{\\varepsilon}{x^2 + \\varepsilon^2}$', false, 'Its area is $\\pi$, so it tends to $\\pi\\delta(x)$, not $\\delta(x)$.'],
        ['$\\dfrac{1}{\\varepsilon}e^{-x^2/\\varepsilon}$', false, `Its area is $\\sqrt{\\pi\\varepsilon}/\\varepsilon = \\sqrt{\\pi/\\varepsilon} \\to \\infty$.`],
        ['$e^{-x^2/\\varepsilon^2}$', false, 'It narrows but its area $\\varepsilon\\sqrt\\pi \\to 0$: the limit is 0.'],
      ], not);
      return { q: `As $\\varepsilon \\to 0^+$, which family does ${not ? '<b>NOT</b> tend to' : 'tend to'} $\\delta(x)$ (in the sense $\\int f\\,\\delta_\\varepsilon\\,dx \\to f(0)$)?`, ...m,
        trap: 'Narrowing is not enough: the area must stay exactly 1.' };
    } },
  { id: 'dgf-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'delta in 3D', format: 'match',
    make(r) {
      const L = {
        shell: '$\\rho = \\sigma\\,\\delta(r - R)$ (spherical coordinates)',
        line: '$\\rho = \\dfrac{\\lambda}{2\\pi s}\\,\\delta(s)$ (cylindrical coordinates)',
        point: '$\\rho = \\dfrac{q}{4\\pi r^2}\\,\\delta(r)$ (spherical coordinates)',
        ring: '$\\rho = \\dfrac{Q}{2\\pi a}\\,\\delta(s - a)\\,\\delta(z)$ (cylindrical coordinates)',
        plane: '$\\rho = \\sigma\\,\\delta(z)$',
        cyl: '$\\rho = \\sigma\\,\\delta(s - a)$ (cylindrical coordinates)',
      };
      const cas = choose(r, [
        ['a uniform surface charge $\\sigma$ on a sphere of radius $R$ centred at the origin', 'shell', 'Integrating over a thin shell: $\\int\\sigma\\delta(r - R)\\,4\\pi r^2dr = 4\\pi R^2\\sigma$, the total charge.'],
        ['a uniform line charge $\\lambda$ along the $z$-axis', 'line', 'Per unit length: $\\int_0^\\infty\\int_0^{2\\pi}\\frac{\\lambda}{2\\pi s}\\delta(s)\\,s\\,d\\phi\\,ds = \\lambda$ (using $\\int_0^\\infty\\delta(s)ds = 1$ for this radial delta).'],
        ['a point charge $q$ at the origin', 'point', '$\\int\\frac{q}{4\\pi r^2}\\delta(r)\\,4\\pi r^2dr = q$; this is $q\\,\\delta^3(\\vec r)$ written in spherical coordinates.'],
        ['a total charge $Q$ spread uniformly round a thin ring of radius $a$ in the plane $z = 0$', 'ring', '$\\int\\frac{Q}{2\\pi a}\\delta(s - a)\\delta(z)\\,s\\,ds\\,d\\phi\\,dz = \\frac{Q}{2\\pi a}\\cdot a\\cdot2\\pi = Q$.'],
        ['a uniform surface charge $\\sigma$ on the plane $z = 0$', 'plane', 'Integrating through the plane, $\\int\\sigma\\delta(z)dz = \\sigma$ per unit area.'],
        ['a uniform surface charge $\\sigma$ on a cylinder of radius $a$ about the $z$-axis', 'cyl', 'Through the wall, $\\int\\sigma\\delta(s - a)ds = \\sigma$ per unit area.'],
      ]);
      return { q: `Which volume charge density describes ${cas[0]}?`, ...matchOne(r, L, cas),
        trap: 'Check by integrating with the right volume element ($4\\pi r^2dr$, $s\\,ds\\,d\\phi\\,dz$): the total must come out right.' };
    } },
  { id: 'dgf-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'impulse response', format: 'graph in words',
    make(r) {
      const w0 = int(r, 2, 10), kind = choose(r, ['under', 'over', 'crit', 'none']);
      const g = kind === 'under' ? int(r, 1, 2 * w0 - 1) : kind === 'over' ? 2 * w0 + int(r, 1, 6) : kind === 'crit' ? 2 * w0 : 0;
      const L = {
        under: 'starts at zero with a finite slope, then oscillates with a decaying envelope',
        over: 'rises from zero to a single maximum and then decays without ever crossing zero, with two different decay rates',
        crit: 'rises from zero as $t\\,e^{-\\omega_0t}$ to one maximum and decays as fast as possible without crossing zero',
        none: 'oscillates for ever with constant amplitude',
        jump: 'jumps at once to a finite value and then decays exponentially',
      };
      const sols = {
        under: `Here $\\gamma = ${g} \\lt 2\\omega_0 = ${2 * w0}$ (underdamped): $G = \\theta(t)e^{-\\gamma t/2}\\sin(\\omega_dt)/\\omega_d$ with $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2/4}$.`,
        over: `Here $\\gamma = ${g} \\gt 2\\omega_0 = ${2 * w0}$ (overdamped): $G = \\theta(t)(e^{-\\lambda_1t} - e^{-\\lambda_2t})/(\\lambda_2 - \\lambda_1)$ with two real rates $\\lambda_{1,2} = \\gamma/2 \\mp \\sqrt{\\gamma^2/4 - \\omega_0^2}$.`,
        crit: `Here $\\gamma = 2\\omega_0 = ${g}$ (critical damping): $G = \\theta(t)\\,t\\,e^{-${w0}t}$.`,
        none: `With $\\gamma = 0$: $G = \\theta(t)\\sin(${w0}t)/${w0}$.`,
      };
      return { q: `An oscillator obeys $\\ddot x + \\gamma\\dot x + \\omega_0^2x = \\delta(t)$ with $x = 0$ for $t \\lt 0$, where $\\omega_0 = ${w0}$ s$^{-1}$ and $\\gamma = ${g}$ s$^{-1}$. Its response $x(t) = G(t)$`, ...matchOne(r, L, [null, kind, `${sols[kind]} A delta-function force is a kick: the velocity jumps by 1 at $t = 0$ but the position starts at 0 (so the response never jumps).`]),
        trap: 'The kick changes the velocity, not the position, so $G(0^+) = 0$; compare $\\gamma$ with $2\\omega_0$.' };
    } },
];
