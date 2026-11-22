// Round 4 extras for delta-greens-functions: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { rk4 } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'dgf-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'sifting',
      q: R`The value of $\displaystyle\int_1^3x^2\,\delta(x)\,dx$ is`,
      options: [R`$1$`, R`$9$`, R`$0$`, R`$\tfrac43$`], answer: 2,
      sol: R`$\delta(x)$ is concentrated at $x = 0$, which lies outside the range $[1, 3]$. So the integrand is zero everywhere in the range and the integral is 0.`,
      trap: R`Sifting gives $f(0)$ only when the spike lies inside the limits.` },
    { id: 'dgf-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'step function', format: 'integer',
      q: R`With $\theta$ the Heaviside step function, the value of $\displaystyle\int_{-\infty}^{\infty}x\,\theta(x)\,\theta(2 - x)\,dx$ is ______.`,
      answer: 2, tol: 0, calc: () => 2 ** 2 / 2,
      sol: R`$\theta(x)\theta(2 - x)$ is 1 for $0 < x < 2$ and 0 elsewhere: a box. So the integral is $\int_0^2x\,dx = 2$.`,
      trap: R`$\theta(2 - x)$ is 1 for $x < 2$ (not $x > 2$): it switches off at 2.` },
    { id: 'dgf-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'delta in 3D',
      q: R`A point charge $q$ sits at $\mathbf r_0$. Its charge density is`,
      options: [R`$q\,\delta^3(\mathbf r - \mathbf r_0)$`, R`$q\,\delta(|\mathbf r - \mathbf r_0|)$`, R`$\dfrac{q}{4\pi}\delta^3(\mathbf r - \mathbf r_0)$`, R`$\dfrac{q}{4\pi|\mathbf r - \mathbf r_0|^2}$`], answer: 0,
      sol: R`The density must vanish away from $\mathbf r_0$ and integrate to $q$ over any volume containing it: $\int q\,\delta^3(\mathbf r - \mathbf r_0)\,d^3r = q$. Its unit is charge per volume, since $\delta^3$ has unit m$^{-3}$. A one-dimensional $\delta(|\mathbf r - \mathbf r_0|)$ has the wrong unit and integrates to zero over a small ball ($\int\delta(r)4\pi r^2dr = 0$).`,
      trap: R`The last option is the shape of the field strength, not the density.` },
    { id: 'dgf-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'derivatives of distributions', format: 'integer',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}e^{-x^2}\,\frac{d^2|x|}{dx^2}\,dx$ is ______.`,
      answer: 2, tol: 0, calc: () => 2 * Math.exp(0),
      sol: R`$\frac{d|x|}{dx} = \text{sgn}(x)$, which jumps from $-1$ to $+1$ at 0, so $\frac{d^2|x|}{dx^2} = 2\delta(x)$. The integral is $2e^{0} = 2$. (By parts: $-\int\text{sgn}(x)(-2x)e^{-x^2}dx = 2\int_0^\infty2xe^{-x^2}dx = 2$.)`,
      trap: R`Saying $|x|'' = 0$ (true away from 0) misses the kink.` },
    { id: 'dgf-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Green function',
      q: R`Which function satisfies $\dfrac{d^2G}{dx^2} = \delta(x)$ on the whole real line?`,
      options: [R`$|x|$`, R`$\tfrac12|x|$`, R`$\theta(x)$`, R`$\tfrac12e^{-|x|}$`], answer: 1,
      sol: R`$\frac{d}{dx}\tfrac12|x| = \tfrac12\text{sgn}(x)$ jumps by 1 at 0, so the second derivative is $\delta(x)$. $|x|$ gives $2\delta$; $\theta'' = \delta'$; and $\left(\tfrac12e^{-|x|}\right)'' = \tfrac12e^{-|x|} - \delta(x)$. (Any $\tfrac12|x| + ax + b$, e.g. $x\,\theta(x)$, also works: Green's functions need boundary conditions to be unique.)`,
      trap: R`The derivative must JUMP by exactly 1; $|x|$ has slope going from $-1$ to $+1$, a jump of 2.` },
    { id: 'dgf-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'step function', format: 'statements',
      q: R`With $\theta$ the Heaviside step and $\text{sgn}(x) = \theta(x) - \theta(-x)$, which hold (as distributions or for $x\ne0$)?`,
      options: [R`$\theta(x) + \theta(-x) = 1$`, R`$\dfrac{d}{dx}\text{sgn}(x) = 2\delta(x)$`, R`$\theta(x)^2 = \theta(x)$`, R`$x\,\theta'(x) = \delta(x)$`], answer: [0, 1, 2],
      sol: R`For $x\ne0$ exactly one of $\theta(x), \theta(-x)$ is 1. $\text{sgn}' = \theta'(x) - \frac{d}{dx}\theta(-x) = \delta(x) + \delta(-x) = 2\delta(x)$. $\theta$ takes only the values 0 and 1, so $\theta^2 = \theta$. But $x\,\theta'(x) = x\,\delta(x) = 0$, since $\int f(x)\,x\,\delta(x)dx = 0\cdot f(0)$.`,
      trap: R`A factor that vanishes at the spike kills the delta: $x\delta(x) = 0$.` },
    { id: 'dgf-r4-07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'boundary value problems',
      q: R`Solve $y'' = x$ on $[0, 1]$ with $y(0) = y(1) = 0$ (for example with the Green's function $G = x_<(x_> - 1)$). The value of $y(1/2)$ is ______ (four decimal places).`,
      answer: -0.0625, tol: 0.0003, calc: () => (0.125 - 0.5) / 6,
      sol: R`Directly: $y = x^3/6 + ax + b$; $y(0) = 0$ gives $b = 0$ and $y(1) = 0$ gives $a = -\tfrac16$. So $y = \frac{x^3 - x}{6}$ and $y(\tfrac12) = \frac{1/8 - 1/2}{6} = -\frac{1}{16} = -0.0625$. With the Green's function: $y(\tfrac12) = \int_0^{1/2}x'(\tfrac12 - 1)x'\,dx' + \int_{1/2}^1\tfrac12(x' - 1)x'\,dx' = -\tfrac1{48} - \tfrac{1}{24} = -\tfrac1{16}$.`,
      trap: R`A positive source with $y'' = f$ makes $y$ sag below zero between fixed ends; the sign is negative.` },
    { id: 'dgf-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'impulse response',
      q: R`The causal Green's function of $\ddot x + 3\dot x + 2x = \delta(t)$ (with $x = 0$ for $t < 0$) is`,
      options: [R`$(e^{-2t} - e^{-t})\,\theta(t)$`, R`$te^{-t}\,\theta(t)$`, R`$\tfrac12(e^{-t} + e^{-2t})\,\theta(t)$`, R`$(e^{-t} - e^{-2t})\,\theta(t)$`], answer: 3,
      sol: R`For $t > 0$, $G$ solves the free equation with roots $-1, -2$: $G = Ae^{-t} + Be^{-2t}$. The impulse gives $G(0^+) = 0$ and $\dot G(0^+) = 1$: $A + B = 0$, $-A - 2B = 1$, so $A = 1$, $B = -1$. (Laplace: $\frac{1}{(s + 1)(s + 2)} = \frac1{s + 1} - \frac1{s + 2}$.) This overdamped response rises from 0 and decays, staying positive.`,
      trap: R`The opposite sign starts with a negative velocity; an upward kick must give $\dot G(0^+) = +1$.` },
    { id: 'dgf-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'delta in 3D', format: 'statements',
      q: R`Which expressions for the three-dimensional delta function are correct (with $\mathbf r_0$ away from the coordinate axes where needed)?`,
      options: [R`Spherical: $\delta^3(\mathbf r - \mathbf r_0) = \dfrac{\delta(r - r_0)\,\delta(\theta - \theta_0)\,\delta(\phi - \phi_0)}{r^2\sin\theta}$`, R`Cylindrical: $\delta^3(\mathbf r - \mathbf r_0) = \dfrac{\delta(s - s_0)\,\delta(\phi - \phi_0)\,\delta(z - z_0)}{s}$`, R`At the origin: $\delta^3(\mathbf r) = \dfrac{\delta(r)}{4\pi r^2}$, with $\delta(r)$ normalised so that $\int_0^\infty\delta(r)\,dr = 1$`, R`At the origin: $\delta^3(\mathbf r) = \dfrac{\delta(r)\,\delta(\theta)\,\delta(\phi)}{r^2\sin\theta}$`], answer: [0, 1, 2],
      sol: R`The rule: divide the product of one-dimensional deltas by the Jacobian, so the integral against $dV = r^2\sin\theta\,dr\,d\theta\,d\phi$ (or $s\,ds\,d\phi\,dz$) gives 1. At the origin $\theta$ and $\phi$ have no definite value, so the last form is meaningless; instead spread the angles evenly ($4\pi$ of solid angle) and keep only the radial delta, which is the third form: $\int\frac{\delta(r)}{4\pi r^2}r^2\,dr\,d\Omega = 1$.`,
      trap: R`Forgetting the Jacobian factor, or using angular deltas at the origin, where the angles have no definite value.` },
    { id: 'dgf-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Green function',
      q: R`For time dependence $e^{-i\omega t}$, which function is the OUTGOING-wave Green's function solving $(\nabla^2 + k^2)G = -\delta^3(\mathbf r)$?`,
      options: [R`$\dfrac{\sin kr}{4\pi r}$`, R`$\dfrac{e^{-kr}}{4\pi r}$`, R`$\dfrac{e^{ikr}}{4\pi r}$`, R`$\dfrac{e^{-ikr}}{4\pi r}$`], answer: 2,
      sol: R`Away from the origin, $\frac{e^{\pm ikr}}{r}$ satisfy $\frac1r\frac{d^2}{dr^2}(rG) + k^2G = 0$, and near 0 both behave like $\frac1{4\pi r}$, which supplies the $-\delta^3$. With $e^{-i\omega t}$, $e^{i(kr - \omega t)}$ moves outward, so $e^{ikr}/(4\pi r)$ is outgoing ($e^{-ikr}$ is incoming). $\frac{\sin kr}{4\pi r}$ is finite at 0: it solves the equation with NO source. $e^{-kr}/(4\pi r)$ is the Yukawa function for $\nabla^2 - k^2$.`,
      trap: R`The sign of $ikr$ that counts as outgoing depends on the time convention; with $e^{+i\omega t}$ it would flip.` },
    { id: 'dgf-r4-11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'delta in 3D',
      q: R`For a fixed point $\mathbf a$ with $|\mathbf a| = 1$, the value of $\displaystyle\int_{\text{all space}}e^{-r^2}\,\nabla^2\!\left(\frac{1}{|\mathbf r - \mathbf a|}\right)d^3r$ is ______ (two decimal places).`,
      answer: -4.62, tol: 0.01, calc: () => -4 * Math.PI * Math.exp(-1),
      sol: R`$\nabla^2\frac{1}{|\mathbf r - \mathbf a|} = -4\pi\delta^3(\mathbf r - \mathbf a)$. The integral picks out $e^{-r^2}$ at $\mathbf r = \mathbf a$, where $r^2 = 1$: $-4\pi e^{-1}\approx-4.62$.`,
      trap: R`Evaluating $e^{-r^2}$ at the origin ($-4\pi$) instead of at the source point $\mathbf a$.` },
    { id: 'dgf-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'impulse response', format: 'integer',
      q: R`An undamped oscillator obeys $\ddot x + x = \delta(t) + \delta(t - \pi)$ and is at rest before $t = 0$. The value of $x(3\pi/2)$ is ______.`,
      answer: 0, tol: 0, calc: () => Math.round(Math.sin(1.5 * Math.PI) + Math.sin(0.5 * Math.PI)),
      sol: R`The causal Green's function is $G(t) = \sin t\,\theta(t)$, so by superposition $x = \sin t\,\theta(t) + \sin(t - \pi)\,\theta(t - \pi)$. For $t > \pi$, $\sin(t - \pi) = -\sin t$, so the two terms cancel: the second kick arrives when the velocity is $-1$ and adds $+1$, stopping the oscillator dead at $x = 0$. So $x(3\pi/2) = 0$.`,
      trap: R`Adding the amplitudes (getting 2 or $-2$) ignores the phase of the second kick.` },
  ],
  gens: [
    { id: 'dgf-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Green function',
      make(r) {
        const mu = choose(r, [0.5, 1, 2]), x1 = int(r, -3, 0), x2 = x1 + int(r, 1, 4), q1 = int(r, 1, 4), q2 = choose(r, [-2, -1, 1, 2, 3]), x0 = int(r, -3, 3);
        const g = (d) => Math.exp(-mu * Math.abs(d)) / (2 * mu), v = q1 * g(x0 - x1) + q2 * g(x0 - x2);
        const src = (q, x) => `${q === 1 ? '' : q === -1 ? '-' : q}\\delta(x ${x < 0 ? '+' : '-'} ${Math.abs(x)})`.replace('(x - 0)', '(x)');
        return { q: R`Solve $-y'' + ${mu * mu === 1 ? '' : `${mu * mu}\\,`}y =${src(q1, x1)} ${q2 < 0 ? '' : '+'} ${src(q2, x2)}$ on the whole line with $y\to0$ at $\pm\infty$. The value of $y(${x0})$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: Math.max(0.0003, round(Math.abs(v) * 0.002, 4)), mu, x1, x2, q1, q2, x0,
          sol: R`The decaying Green's function of $-\frac{d^2}{dx^2} + \mu^2$ is $G(x) = \frac{e^{-\mu|x|}}{2\mu}$ (its slope drops by 1 at the source), here with $\mu = ${mu}$. Superpose the two sources: $y(${x0}) = ${q1}\cdot\frac{e^{-${mu}\cdot${Math.abs(x0 - x1)}}}{${2 * mu}} + (${q2})\cdot\frac{e^{-${mu}\cdot${Math.abs(x0 - x2)}}}{${2 * mu}}\approx${round(v, 4)}$.`,
          trap: 'Using $e^{-\\mu^2|x|}$ or forgetting the $1/(2\\mu)$ normalisation of the Green\'s function.' };
      },
      verify: (p) => {
        // direct check: piecewise exponentials. Integrate -y'' + mu^2 y = sum q delta with rk4 from far left using the exact decaying start, then read y(x0).
        const m = p.mu, A = p.q1 * Math.exp(-m * p.x1) / (2 * m) + p.q2 * Math.exp(-m * p.x2) / (2 * m); // y = A e^{mu x} left of both sources
        const L = Math.min(p.x1, p.x0) - 1;
        let y = [A * Math.exp(m * L), m * A * Math.exp(m * L)], t = L;
        const marks = [p.x1, p.x2].filter((s) => s < p.x0).sort((a, b) => a - b);
        const qs = { [p.x1]: p.q1, [p.x2]: (p.x1 === p.x2 ? p.q1 : 0) + p.q2 };
        for (const s of marks) { y = rk4((_, z) => [z[1], m * m * z[0]], y, t, s, 2000); y[1] -= qs[s]; t = s; }
        return rk4((_, z) => [z[1], m * m * z[0]], y, t, p.x0, 2000)[0];
      } },
    { id: 'dgf-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'impulse response',
      make(r) {
        const w = choose(r, [1, 2, 3]), I1 = int(r, 1, 4), I2 = choose(r, [-3, -2, -1, 1, 2, 3]), t2 = choose(r, [0.5, 1, 1.5, 2]), T = t2 + choose(r, [0.5, 1, 2]);
        const v = (I1 / w) * Math.sin(w * T) + (I2 / w) * Math.sin(w * (T - t2));
        return { q: R`A unit mass on a spring obeys $\ddot x + ${w * w}x = ${I1 === 1 ? '' : `${I1}\\,`}\delta(t) ${I2 < 0 ? '-' : '+'} ${Math.abs(I2) === 1 ? '' : `${Math.abs(I2)}\\,`}\delta(t - ${t2})$ and is at rest before $t = 0$. The value of $x(${T})$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0005, w, I1, I2, t2, T,
          sol: R`The causal Green's function is $G(t) = \frac{\sin ${w === 1 ? '' : w}t}{${w}}\theta(t)$: a kick of size $I$ sets the velocity jumping by $I$. Superposing the two kicks: $x(t) = \frac{${I1}}{${w}}\sin(${w}t) + \frac{${I2}}{${w}}\sin(${w}(t - ${t2}))$ for $t > ${t2}$. At $t = ${T}$: $\frac{${I1}}{${w}}\sin(${round(w * T, 3)}) + \frac{${I2}}{${w}}\sin(${round(w * (T - t2), 3)})\approx${round(v, 4)}$ (angles in radians).`,
          trap: 'Each kick changes the velocity, not the position; its effect starts as $\\sin$, not $\\cos$.' };
      },
      verify: (p) => {
        let y = rk4((_, z) => [z[1], -p.w * p.w * z[0]], [0, p.I1], 0, p.t2, 2000);
        y = [y[0], y[1] + p.I2];
        return rk4((_, z) => [z[1], -p.w * p.w * z[0]], y, p.t2, p.T, 2000)[0];
      } },
    { id: 'dgf-r4g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'delta in 3D',
      make(r) {
        const a = [int(r, -2, 2), int(r, -2, 2), int(r, 0, 3)], Rr = int(r, 2, 4), shape = choose(r, ['sphere', 'cube']);
        const inside = shape === 'sphere' ? a[0] ** 2 + a[1] ** 2 + a[2] ** 2 < Rr * Rr : Math.max(...a.map(Math.abs)) < Rr / 2;
        const onEdge = shape === 'sphere' ? a[0] ** 2 + a[1] ** 2 + a[2] ** 2 === Rr * Rr : Math.max(...a.map(Math.abs)) === Rr / 2;
        const a2 = onEdge ? [a[0], a[1], Rr + 1] : a; // never put the source on the surface (moved clearly outside)
        const ins = shape === 'sphere' ? a2[0] ** 2 + a2[1] ** 2 + a2[2] ** 2 < Rr * Rr : Math.max(...a2.map(Math.abs)) < Rr / 2;
        const correct = ins ? '$-4\\pi$' : '$0$';
        const m = mcqOptions(r, correct, ['$-4\\pi$', '$0$', '$4\\pi$', '$-\\dfrac{4\\pi}{3}$'], (s) => s);
        const region = shape === 'sphere' ? `the ball $|\\mathbf r|\\le${Rr}$` : `the cube $|x|, |y|, |z|\\le${Rr / 2}$`;
        return { q: R`For the point $\mathbf a = (${a2.join(', ')})$, the integral of $\nabla^2\dfrac{1}{|\mathbf r - \mathbf a|}$ over ${region} is`, ...m, inside: ins,
          sol: R`$\nabla^2\frac{1}{|\mathbf r - \mathbf a|} = -4\pi\delta^3(\mathbf r - \mathbf a)$: zero everywhere except at $\mathbf a$. So the integral is $-4\pi$ if $\mathbf a$ is inside the region and 0 if it is outside. ${shape === 'sphere' ? `Here $|\\mathbf a|^2 = ${a2[0] ** 2 + a2[1] ** 2 + a2[2] ** 2} ${ins ? '<' : '>'} ${Rr * Rr}$` : `Here the largest coordinate of $\\mathbf a$ in size is ${Math.max(...a2.map(Math.abs))}, ${ins ? 'less' : 'more'} than the half-side ${Rr / 2}`}, so the point is ${ins ? 'inside' : 'outside'}: the answer is ${ins ? '$-4\\pi$' : '0'}. (Equivalently, the flux of $-\frac{\mathbf r - \mathbf a}{|\mathbf r - \mathbf a|^3}$ through the surface.)`,
          trap: 'The shape and size of the region do not matter, only whether it contains the source point.' };
      } },
  ],
};
