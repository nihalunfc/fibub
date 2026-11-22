// Round 4 extras for partial-derivatives: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'pd-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'partial derivatives',
      q: R`For $f(x, y) = \dfrac{x}{y}$, the partial derivative $\dfrac{\partial f}{\partial y}$ is`,
      options: [R`$\dfrac1y$`, R`$\dfrac{x}{y^2}$`, R`$-\dfrac{x}{y^2}$`, R`$\dfrac{1 - x}{y^2}$`], answer: 2,
      sol: R`Hold $x$ fixed and differentiate $x\,y^{-1}$ with respect to $y$: $x\cdot(-1)y^{-2} = -x/y^2$.`,
      trap: R`$1/y$ is $\partial f/\partial x$; read which variable is changing.` },
    { id: 'pd-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'chain rule',
      q: R`A function $f(x, y)$ is rewritten in polar coordinates, $x = r\cos\theta$, $y = r\sin\theta$. Then $\dfrac{\partial f}{\partial\theta}$ (at fixed $r$) equals`,
      options: [R`$-y\,f_x + x\,f_y$`, R`$x\,f_x + y\,f_y$`, R`$y\,f_x - x\,f_y$`, R`$-\dfrac{y}{r}f_x + \dfrac{x}{r}f_y$`], answer: 0,
      sol: R`Chain rule: $\dfrac{\partial f}{\partial\theta} = f_x\dfrac{\partial x}{\partial\theta} + f_y\dfrac{\partial y}{\partial\theta} = f_x(-r\sin\theta) + f_y(r\cos\theta) = -y\,f_x + x\,f_y$. This is the operator behind the angular momentum $L_z \propto x\partial_y - y\partial_x$. The combination $x f_x + y f_y$ is $r\,\partial f/\partial r$.`,
      trap: R`$\partial x/\partial\theta = -r\sin\theta$ already contains $r$; dividing by $r$ again is wrong.` },
    { id: 'pd-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'implicit differentiation',
      q: R`On the sphere $x^2 + y^2 + z^2 = 9$, $z$ is a function of $x$ and $y$ near the point $(1, 2, 2)$. The value of $\partial z/\partial x$ there is ______.`,
      answer: -0.5, tol: 0.001, calc: () => -1 / 2,
      sol: R`Differentiate with respect to $x$ at fixed $y$: $2x + 2z\,\dfrac{\partial z}{\partial x} = 0$, so $\dfrac{\partial z}{\partial x} = -\dfrac xz = -\dfrac12$.`,
      trap: R`Holding $y$ fixed means its derivative is zero; it does not enter.` },
    { id: 'pd-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'mixed partials', format: 'statements',
      q: R`Which of these functions satisfy Laplace's equation $\dfrac{\partial^2f}{\partial x^2} + \dfrac{\partial^2f}{\partial y^2} = 0$ (away from the origin)?`,
      options: [R`$x^2 - y^2$`, R`$e^x\cos y$`, R`$\ln(x^2 + y^2)$`, R`$x^2 + y^2$`], answer: [0, 1, 2],
      sol: R`$x^2 - y^2$: $2 - 2 = 0$. $e^x\cos y$: $e^x\cos y - e^x\cos y = 0$. $\ln(x^2 + y^2)$: $f_x = \dfrac{2x}{x^2 + y^2}$, $f_{xx} = \dfrac{2(y^2 - x^2)}{(x^2 + y^2)^2}$, and $f_{yy}$ is the same with $x\leftrightarrow y$, so they cancel. $x^2 + y^2$ gives $2 + 2 = 4$.`,
      trap: R`$\ln r$ is the 2D analogue of $1/r$: harmonic everywhere except the origin.` },
    { id: 'pd-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'chain rule',
      q: R`Which function satisfies the wave equation $\dfrac{\partial^2u}{\partial t^2} = 4\dfrac{\partial^2u}{\partial x^2}$?`,
      options: [R`$\sin(2x - t)$`, R`$e^{x + 4t}$`, R`$(x - 4t)^2$`, R`$\sin(x - 2t)$`], answer: 3,
      sol: R`Any $f(x - ct)$ or $f(x + ct)$ gives $u_{tt} = c^2f''$ and $u_{xx} = f''$, so here we need $c^2 = 4$, $c = 2$. $\sin(x - 2t)$ has $c = 2$. $\sin(2x - t) = \sin 2(x - t/2)$ has $c = \tfrac12$ ($u_{tt} = -\sin$, $u_{xx} = -4\sin$). $e^{x + 4t}$ and $(x - 4t)^2$ have $c = 4$, giving $u_{tt} = 16u_{xx}$.`,
      trap: R`The equation has $c^2 = 4$, not $c = 4$.` },
    { id: 'pd-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'chain rule',
      q: R`The temperature along a pipe is $T(x, t) = 300 + 2x - 3t$ K ($x$ in m, $t$ in s). A probe carried by the fluid moves along the pipe at 5 m/s. The rate at which the probe's reading changes is ______ K/s.`,
      answer: 7, tol: 0, unit: 'K/s', calc: () => -3 + 2 * 5,
      sol: R`Along the path $x(t)$, $\dfrac{dT}{dt} = \dfrac{\partial T}{\partial t} + \dfrac{\partial T}{\partial x}\dfrac{dx}{dt} = -3 + 2\times5 = 7$ K/s. A fixed thermometer would see the temperature fall at 3 K/s, but the probe keeps moving into warmer fluid faster than the fluid cools.`,
      trap: R`$\partial T/\partial t = -3$ K/s is the reading at a fixed point, not the moving probe's rate.` },
    { id: 'pd-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'Lagrange multipliers',
      q: R`The largest value of $xy$ on the ellipse $\dfrac{x^2}{4} + \dfrac{y^2}{9} = 1$ is ______.`,
      answer: 3, tol: 0.001, calc: () => 2 * 3 / 2,
      sol: R`With Lagrange multipliers: $y = \lambda x/2$ and $x = 2\lambda y/9$ give $\dfrac{x^2}{4} = \dfrac{y^2}{9}$, so each equals $\tfrac12$: $x = \sqrt2$, $y = 3/\sqrt2$, $xy = 3$. Or parametrise: $x = 2\cos t$, $y = 3\sin t$, $xy = 3\sin2t$, largest 3. In general it is $ab/2$.`,
      trap: R`$ab = 6$ is the product at a corner of the bounding box, which is not on the ellipse.` },
    { id: 'pd-r4-08', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Maxwell relations',
      q: R`The Helmholtz free energy $F = U - TS$ has $dF = -S\,dT - P\,dV$. Equality of its mixed second partial derivatives gives`,
      options: [R`$\left(\dfrac{\partial S}{\partial P}\right)_T = -\left(\dfrac{\partial V}{\partial T}\right)_P$`, R`$\left(\dfrac{\partial S}{\partial V}\right)_T = \left(\dfrac{\partial P}{\partial T}\right)_V$`, R`$\left(\dfrac{\partial S}{\partial V}\right)_T = -\left(\dfrac{\partial P}{\partial T}\right)_V$`, R`$\left(\dfrac{\partial T}{\partial V}\right)_S = -\left(\dfrac{\partial P}{\partial S}\right)_V$`], answer: 1,
      sol: R`From $dF$: $\left(\dfrac{\partial F}{\partial T}\right)_V = -S$ and $\left(\dfrac{\partial F}{\partial V}\right)_T = -P$. Then $\dfrac{\partial^2F}{\partial V\partial T} = -\left(\dfrac{\partial S}{\partial V}\right)_T = -\left(\dfrac{\partial P}{\partial T}\right)_V$, so $\left(\dfrac{\partial S}{\partial V}\right)_T = \left(\dfrac{\partial P}{\partial T}\right)_V$. The other two true-looking relations come from $G$ and from $U$.`,
      trap: R`Both minus signs cancel; keeping only one gives the wrong sign.` },
    { id: 'pd-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'partial derivatives', format: 'statements',
      q: R`Let $f(x, y) = \dfrac{x^2y}{x^2 + y^2}$ for $(x, y)\ne(0, 0)$ and $f(0, 0) = 0$. Which statements are true?`,
      options: [R`$f$ is continuous at the origin`, R`$f_x(0, 0) = f_y(0, 0) = 0$`, R`$f$ is differentiable at the origin`, R`The directional derivative at the origin along $(1, 1)/\sqrt2$ is $\dfrac{1}{2\sqrt2}$`], answer: [0, 1, 3],
      sol: R`$|f| \le |y|$ because $x^2/(x^2 + y^2)\le1$, so $f\to0$: continuous. On the axes $f = 0$, so both partials are 0 at the origin. Along $(t, t)/\sqrt2$: $f = \dfrac{(t^2/2)(t/\sqrt2)}{t^2} = \dfrac{t}{2\sqrt2}$, so the directional derivative is $\dfrac1{2\sqrt2}$. If $f$ were differentiable this would equal $\nabla f\cdot\hat u = 0$; it does not, so $f$ is not differentiable at the origin, even though it is continuous and has both partials.`,
      trap: R`Existence of the partial derivatives (even with continuity) does not make a function differentiable.` },
    { id: 'pd-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'thermodynamic derivatives',
      q: R`One mole of a gas obeys $P(V - b) = RT$ with constant $b$. Using $C_P - C_V = -T\dfrac{(\partial P/\partial T)_V^2}{(\partial P/\partial V)_T}$, the value of $C_P - C_V$ is ______ J/(mol K) (take $R = 8.314$ J/(mol K)).`,
      answer: 8.314, tol: 0.01, unit: 'J/(mol K)', calc: () => 8.314,
      sol: R`$P = \dfrac{RT}{V - b}$ gives $\left(\dfrac{\partial P}{\partial T}\right)_V = \dfrac{R}{V - b}$ and $\left(\dfrac{\partial P}{\partial V}\right)_T = -\dfrac{RT}{(V - b)^2}$. So $C_P - C_V = -T\cdot\dfrac{R^2/(V - b)^2}{-RT/(V - b)^2} = R = 8.314$ J/(mol K), the same as an ideal gas: an excluded volume alone does not change it (an attraction term would).`,
      trap: R`The $(V - b)$ factors cancel exactly; it is not $R\,V/(V - b)$.` },
  ],
  gens: [
    { id: 'pd-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'chain rule',
      make(r) {
        const T0 = int(r, 280, 320), a = pick(r, 0.5, 3, 0.5), x0 = int(r, 1, 6), c = pick(r, 0.5, 4, 0.5), u = int(r, 1, 8);
        const answer = round(2 * a * x0 * u - c, 3);
        return { q: R`The temperature in a channel is $T(x, t) = ${T0} + ${a === 1 ? '' : a}x^2 - ${c}t$ K ($x$ in m, $t$ in s). A float drifts along the channel at ${u} m/s. At the moment it passes $x = ${x0}$ m, at what rate (K/s, with sign) does its temperature reading change?`,
          answer, tol: Math.max(0.01, Math.abs(answer) * 0.005), unit: 'K/s', a, x0, c, u,
          sol: R`$\dfrac{dT}{dt} = \dfrac{\partial T}{\partial t} + \dfrac{\partial T}{\partial x}\dfrac{dx}{dt} = -${c} + (2\cdot${a}\cdot${x0})(${u}) = ${answer}$ K/s.`,
          trap: 'A moving probe adds the change it meets by moving, $u\\,\\partial T/\\partial x$.' };
      },
      verify: (p) => 2 * p.a * p.x0 * p.u - p.c },
    { id: 'pd-r4g2', type: 'nat', level: 2, exams: ['jam'], sub: 'implicit differentiation',
      make(r) {
        const p = int(r, 1, 4), q = int(r, 1, 4), x0 = int(r, 1, 3), y0 = int(r, -2, 2), z0 = choose(r, [-2, -1, 1, 2, 3]);
        const K = x0 * x0 + p * y0 * y0 + q * z0 * z0, which = r() < 0.5 ? 'x' : 'y';
        const answer = round(which === 'x' ? -x0 / (q * z0) : -p * y0 / (q * z0), 4);
        return { q: R`On the surface $x^2 + ${p === 1 ? '' : p}y^2 + ${q === 1 ? '' : q}z^2 = ${K}$, $z$ is a function of $x$ and $y$ near $(${x0}, ${y0}, ${z0})$. Find $\partial z/\partial ${which}$ there (to four decimal places).`,
          answer: answer === 0 ? 0 : answer, tol: 0.0005, p, qq: q, x0, y0, z0, which,
          sol: R`Differentiate with respect to $${which}$, holding the other variable fixed: ${which === 'x' ? R`$2x + ${2 * q}z\,z_x = 0$, so $z_x = -\dfrac{x}{${q}z} = -\dfrac{${x0}}{${q * z0}}$` : R`$${2 * p}y + ${2 * q}z\,z_y = 0$, so $z_y = -\dfrac{${p}y}{${q}z} = -\dfrac{${p * y0}}{${q * z0}}$`} $= ${answer === 0 ? 0 : answer}$.`,
          trap: 'Treat $z$ as a function: its derivative brings the factor $\\partial z/\\partial x$.' };
      },
      verify: (p) => (p.which === 'x' ? -p.x0 / (p.qq * p.z0) : -p.p * p.y0 / (p.qq * p.z0)) },
    { id: 'pd-r4g3', type: 'mcq', level: 3, exams: ['jam'], sub: 'chain rule',
      make(r) {
        const c = int(r, 2, 5), k = int(r, 1, 3), f = choose(r, [['\\sin', '('], ['\\cos', '('], ['e^', '{'], ['', '(']]);
        const kx = (m) => `${m === 1 ? '' : m}x`;
        const wrap = (arg) => (f[1] === '{' ? `e^{${arg}}` : f[0] ? `${f[0]}(${arg})` : `(${arg})^3`);
        const sgn = r() < 0.5 ? '-' : '+';
        const right = `$${wrap(`${kx(k)} ${sgn} ${k * c}t`)}$`;
        const wrongs = [`$${wrap(`${kx(k)} ${sgn} ${k * c * c}t`)}$`, `$${wrap(`${kx(k * c)} ${sgn} ${k === 1 ? '' : k}t`)}$`, `$${wrap(kx(k))} ${sgn} ${k * c}t$`];
        const { options, answer } = mcqOptions(r, right, wrongs);
        return { q: R`Which function satisfies the wave equation $\dfrac{\partial^2u}{\partial t^2} = ${c * c}\dfrac{\partial^2u}{\partial x^2}$?`,
          options, answer,
          sol: R`A function of $x \mp ct$ alone satisfies $u_{tt} = c^2u_{xx}$. Here $c^2 = ${c * c}$, so $c = ${c}$. ${right} is a function of $${k === 1 ? '' : k}(x ${sgn} ${c}t)$: speed ${c}. The others travel at speed $${c * c}$ or $\tfrac1{${c}}$, or are not functions of a single combination $x \mp ct$ at all.`,
          trap: 'The coefficient in the equation is $c^2$; the speed is its square root.' };
      },
      verify: (p) => p.answer },
  ],
};
