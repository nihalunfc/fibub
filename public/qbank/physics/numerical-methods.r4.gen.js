// Round 4 extras for numerical-methods: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'num-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'root finding',
      q: R`Which root-finding method needs the derivative $f'(x)$ at every step?`,
      options: [R`Bisection`, R`Secant`, R`Newton-Raphson`, R`Regula falsi (false position)`], answer: 2,
      sol: R`Newton-Raphson uses $x_{n+1} = x_n - f(x_n)/f'(x_n)$. The secant method replaces $f'$ by the slope through the last two points; bisection and false position use only values of $f$ at the ends of a bracket.`,
      trap: R`The secant method looks like Newton's but needs no derivative.` },
    { id: 'num-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'secant method',
      q: R`The secant method is applied to $f(x) = x^2 - 3$ with $x_0 = 1$ and $x_1 = 2$. The next iterate $x_2$ is ______ (three decimal places).`,
      answer: 1.667, tol: 0.002, calc: () => 2 - (1 * (2 - 1)) / (1 - -2),
      sol: R`$f(1) = -2$, $f(2) = 1$. $x_2 = x_1 - f(x_1)\frac{x_1 - x_0}{f(x_1) - f(x_0)} = 2 - 1\cdot\frac{1}{1 - (-2)} = 2 - \tfrac13\approx1.667$. (The root is $\sqrt3\approx1.732$.)`,
      trap: R`Using $f(x_0) - f(x_1)$ in the denominator flips the correction and gives 2.333.` },
    { id: 'num-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'numerical differentiation',
      q: R`The forward difference $\dfrac{f(x + h) - f(x)}{h}$ approximates $f'(x)$ with truncation error of order`,
      options: [R`$h$`, R`$h^2$`, R`$h^3$`, R`$1$ (it does not improve as $h\to0$)`], answer: 0,
      sol: R`Taylor: $f(x + h) = f(x) + hf'(x) + \tfrac{h^2}2f''(x) + \dots$, so the forward difference is $f'(x) + \tfrac h2f''(x) + \dots$: error $O(h)$. The central difference cancels the $h$ term and is $O(h^2)$.`,
      trap: R`Mixing up the forward difference with the central one, which is second order.` },
    { id: 'num-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'quadrature',
      q: R`For a smooth integrand on small panels, the error of the composite midpoint rule compared with that of the composite trapezoidal rule (same panels) is about`,
      options: [R`the same size and sign`, R`half the size and of opposite sign`, R`twice the size and of the same sign`, R`zero for every cubic`], answer: 1,
      sol: R`On one panel of width $h$: trapezoidal error $= -\frac{h^3}{12}f''$, midpoint error $= +\frac{h^3}{24}f''$. So the midpoint rule is about twice as accurate and errs the other way; this is why Simpson's rule, $S = \tfrac23M + \tfrac13T$, cancels both leading errors.`,
      trap: R`Both rules are exact only for straight lines; neither integrates every cubic exactly.` },
    { id: 'num-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'quadrature',
      q: R`The composite midpoint rule with two panels ($h = 1$) estimates $\displaystyle\int_0^2x^3\,dx$ as ______ (one decimal place).`,
      answer: 3.5, tol: 0.01, calc: () => 0.5 ** 3 + 1.5 ** 3,
      sol: R`Midpoints $0.5$ and $1.5$: $h[f(0.5) + f(1.5)] = 0.125 + 3.375 = 3.5$. The exact value is 4; the trapezoidal rule gives $\tfrac12[0 + 2\cdot1 + 8] = 5$. Errors $-0.5$ and $+1$: half the size and opposite sign.`,
      trap: R`Using the end points of the panels instead of their midpoints.` },
    { id: 'num-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'linear systems', format: 'statements',
      q: R`Which statements about solving $A\vec x = \vec b$ ($A$ dense, $n\times n$) are true?`,
      options: [R`Partial pivoting (choosing the largest available pivot) improves numerical stability`, R`Gaussian elimination takes of order $n^3$ operations`, R`Once $A = LU$ is known, each new right-hand side costs only of order $n^2$ operations`, R`Computing $A^{-1}$ and then $A^{-1}\vec b$ is the most efficient way to solve one system`], answer: [0, 1, 2],
      sol: R`Small pivots amplify rounding errors; swapping rows to use the largest one keeps multipliers at most 1. Elimination costs about $n^3/3$ multiplications. With $L$ and $U$ stored, forward and back substitution cost about $n^2$ each. Forming $A^{-1}$ costs about three times more than one elimination and is usually less accurate.`,
      trap: R`Writing $\vec x = A^{-1}\vec b$ is fine on paper but wasteful in code.` },
    { id: 'num-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stiff equations',
      q: R`One step of the implicit (backward) Euler method $y_{n+1} = y_n + h f(y_{n+1})$ with $h = 0.1$ is applied to $dy/dt = -50y$, $y(0) = 1$. The result $y_1$ is ______ (three decimal places).`,
      answer: 0.167, tol: 0.002, calc: () => 1 / (1 + 50 * 0.1),
      sol: R`$y_1 = y_0 - 5y_1$, so $y_1 = \frac{y_0}{1 + 50h} = \frac16\approx0.167$. It decays, as the true solution does ($e^{-5}\approx0.007$). Explicit Euler with the same step gives $y_1 = (1 - 5)y_0 = -4$ and blows up: backward Euler is stable for every $h > 0$ on decaying problems.`,
      trap: R`Evaluating $f$ at the old point (explicit Euler) gives $-4$.` },
    { id: 'num-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'fixed-point iteration',
      q: R`The iteration $x_{n+1} = \dfrac{x_n^2 + 2}{3}$ has fixed points $x = 1$ and $x = 2$. Started from $x_0 = 1.5$, it`,
      options: [R`converges to 2`, R`oscillates between 1 and 2`, R`runs off to infinity`, R`converges to 1`], answer: 3,
      sol: R`With $g(x) = (x^2 + 2)/3$, $g'(x) = 2x/3$: $|g'(1)| = \tfrac23 < 1$ (attracting) and $|g'(2)| = \tfrac43 > 1$ (repelling). From 1.5: $x_1 = 1.417$, $x_2 = 1.336$, ... decreasing towards 1. (Starting above 2 it would run off to infinity.)`,
      trap: R`Being a fixed point is not enough; the iteration converges only to points where $|g'| < 1$.` },
    { id: 'num-r4-09', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'interpolation', format: 'statements',
      q: R`Which statements about polynomial interpolation are true?`,
      options: [R`High-degree interpolation of $1/(1 + 25x^2)$ at equally spaced points on $[-1, 1]$ oscillates wildly near the ends`, R`Clustering the nodes near the ends (Chebyshev points) tames that oscillation`, R`A cubic spline has continuous first and second derivatives at the nodes`, R`Raising the degree of an equally spaced interpolant always improves its accuracy`], answer: [0, 1, 2],
      sol: R`This is Runge's phenomenon: the error near $\pm1$ grows with the degree for equally spaced nodes. Chebyshev nodes, $\cos\frac{(2k + 1)\pi}{2n + 2}$, minimise the node polynomial and make the interpolant converge for smooth functions. Cubic splines join cubic pieces with matching value, slope and curvature. The last statement is exactly what Runge's example disproves.`,
      trap: R`"More points, more accuracy" fails for equally spaced polynomial interpolation.` },
    { id: 'num-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'round-off',
      q: R`A linear system $A\vec x = \vec b$ is solved stably in double precision (about 16 significant digits). The condition number of $A$ is about $10^8$. Roughly how many digits of $\vec x$ can be trusted?`,
      options: [R`$16$`, R`$8$`, R`$4$`, R`$0$`], answer: 1,
      sol: R`A stable method gives the exact solution of a nearby problem, with relative perturbations near machine precision $10^{-16}$. The condition number multiplies relative errors: $10^8\times10^{-16} = 10^{-8}$, so about 8 correct digits. With a condition number near $10^{16}$ nothing could be trusted.`,
      trap: R`A stable algorithm cannot beat the conditioning of the problem itself.` },
    { id: 'num-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stability', unit: 's',
      q: R`The heat equation $u_t = \kappa u_{xx}$ with $\kappa = 1.0\times10^{-4}$ m$^2$/s is solved by the explicit scheme (forward in time, central in space) with grid spacing $\Delta x = 0.01$ m. It is stable for $\kappa\Delta t/\Delta x^2\le\tfrac12$. The largest stable time step is ______ s (one decimal place).`,
      answer: 0.5, tol: 0.01, calc: () => (0.5 * 0.01 ** 2) / 1e-4,
      sol: R`$\Delta t_{\max} = \frac{\Delta x^2}{2\kappa} = \frac{10^{-4}}{2\times10^{-4}} = 0.5$ s. Halving $\Delta x$ would cut the allowed step by four, which is why implicit schemes (e.g. Crank-Nicolson) are used for fine grids.`,
      trap: R`Using $\Delta x$ instead of $\Delta x^2$ gives 50 s, a hundred times too large.` },
    { id: 'num-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'quadrature',
      q: R`Two-point Gauss-Legendre quadrature (nodes $\pm1/\sqrt3$, weights 1 on $[-1, 1]$) is applied to $\displaystyle\int_0^2x^4\,dx$ after mapping the interval to $[-1, 1]$. The estimate is ______ (three decimal places).`,
      answer: 6.222, tol: 0.002, calc: () => (1 + 1 / Math.sqrt(3)) ** 4 + (1 - 1 / Math.sqrt(3)) ** 4,
      sol: R`With $x = 1 + t$ ($dx = dt$), the integral is $\int_{-1}^1(1 + t)^4dt\approx(1 + a)^4 + (1 - a)^4$ with $a = 1/\sqrt3$. Expanding, the odd powers cancel: $2(1 + 6a^2 + a^4) = 2\left(1 + 2 + \tfrac19\right) = \tfrac{56}{9}\approx6.222$. The exact value is $32/5 = 6.4$: two points are exact only up to cubics.`,
      trap: R`Forgetting the Jacobian of the map (here $dx/dt = 1$, but for an interval of width $w$ it is $w/2$).` },
  ],
  gens: [
    { id: 'num-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'secant method',
      make(r) {
        const p = choose(r, [2, 3]), a = p === 2 ? choose(r, [2, 3, 5, 6, 7]) : choose(r, [2, 3, 5, 10]);
        const x0 = 1, x1 = 2, f = (x) => x ** p - a, f0 = f(x0), f1 = f(x1), x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
        return { q: R`The secant method is applied to $f(x) = x^${p} - ${a}$ with $x_0 = ${x0}$ and $x_1 = ${x1}$. The next iterate $x_2$ is ______ (four decimal places).`,
          answer: round(x2, 4), tol: 0.0002, p, a, x0, x1,
          sol: R`$f(${x0}) = ${f0}$ and $f(${x1}) = ${f1}$. The secant through these two points crosses zero at $x_2 = x_1 - f(x_1)\frac{x_1 - x_0}{f(x_1) - f(x_0)} = ${x1} - (${f1})\cdot\frac{1}{${f1} - (${f0})} = ${round(x2, 4)}$. (The root is $${a}^{1/${p}}\approx${round(a ** (1 / p), 4)}$.)`,
          trap: 'Swapping the order in the denominator sends the step the wrong way.' };
      },
      verify: (p) => { const f = (x) => x ** p.p - p.a, f0 = f(p.x0), f1 = f(p.x1); return (p.x0 * f1 - p.x1 * f0) / (f1 - f0); } },
    { id: 'num-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'quadrature',
      make(r) {
        const fn = choose(r, [['x^3', (x) => x ** 3], ['e^{x}', Math.exp], ['\\dfrac{1}{1 + x}', (x) => 1 / (1 + x)], ['x^4', (x) => x ** 4]]);
        const b = choose(r, [1, 2]), n = choose(r, [2, 4]), h = b / n;
        let M = 0; const mids = [];
        for (let i = 0; i < n; i++) { const m = (i + 0.5) * h; mids.push(m); M += fn[1](m); }
        M *= h;
        return { q: R`The composite midpoint rule with ${n} equal panels estimates $\displaystyle\int_0^{${b}}${fn[0]}\,dx$ as ______ (four decimal places).`,
          answer: round(M, 4), tol: 0.0002, fname: fn[0], b, n,
          sol: R`Panel width $h = ${b}/${n} = ${h}$, midpoints $${mids.join(', ')}$. $M = h\sum f(\text{midpoints}) = ${h}\times(${mids.map((m) => round(fn[1](m), 5)).join(' + ')}) = ${round(M, 4)}$.`,
          trap: 'Midpoints are the centres of the panels, not the grid points.' };
      },
      verify: (p) => {
        // identity: M(h) = 2T(h/2) - T(h), with T the composite trapezoidal rule
        const f = { 'x^3': (x) => x ** 3, 'e^{x}': Math.exp, '\\dfrac{1}{1 + x}': (x) => 1 / (1 + x), 'x^4': (x) => x ** 4 }[p.fname];
        const T = (n) => { const h = p.b / n; let s = (f(0) + f(p.b)) / 2; for (let i = 1; i < n; i++) s += f(i * h); return s * h; };
        return 2 * T(2 * p.n) - T(p.n);
      } },
    { id: 'num-r4g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stiff equations',
      make(r) {
        const lam = choose(r, [10, 20, 50, 100]), h = choose(r, [0.05, 0.1, 0.2]), n = int(r, 1, 3), meth = choose(r, ['backward Euler', 'trapezoidal (Crank-Nicolson)']);
        const g = meth === 'backward Euler' ? 1 / (1 + lam * h) : (1 - (lam * h) / 2) / (1 + (lam * h) / 2), v = g ** n;
        return { q: R`The ${meth} method with step $h = ${h}$ is applied to $dy/dt = -${lam}y$, $y(0) = 1$. After ${n} step${n > 1 ? 's' : ''}, $y_${n}$ = ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, lam, h, n, meth,
          sol: meth === 'backward Euler'
            ? R`Backward Euler: $y_{k+1} = y_k - ${lam}h\,y_{k+1}$, so each step multiplies by $\frac{1}{1 + ${round(lam * h, 4)}} = ${round(g, 5)}$. After ${n} step(s): $${round(g, 5)}^{${n}}\approx${round(v, 4)}$. It always decays, whatever $h$.`
            : R`Trapezoidal rule: $y_{k+1} = y_k - \tfrac{${lam}h}{2}(y_k + y_{k+1})$, so each step multiplies by $\frac{1 - ${round((lam * h) / 2, 4)}}{1 + ${round((lam * h) / 2, 4)}} = ${round(g, 5)}$. After ${n} step(s): $(${round(g, 5)})^{${n}}\approx${round(v, 4)}$.${lam * h > 2 ? ' The factor is negative: the method is stable but the stiff mode flips sign each step instead of decaying smoothly.' : ''}`,
          trap: 'Explicit Euler would multiply by $1 - \\lambda h$, which is unstable once $\\lambda h > 2$; the implicit methods never blow up here.' };
      },
      verify: (p) => {
        // march step by step solving the implicit equation by Newton (exact for a linear problem)
        let y = 1;
        for (let k = 0; k < p.n; k++) {
          const F = (z) => (p.meth === 'backward Euler' ? z - y + p.lam * p.h * z : z - y + (p.lam * p.h / 2) * (y + z));
          const dF = p.meth === 'backward Euler' ? 1 + p.lam * p.h : 1 + (p.lam * p.h) / 2;
          let z = y; for (let it = 0; it < 3; it++) z -= F(z) / dF;
          y = z;
        }
        return y;
      } },
  ],
};
