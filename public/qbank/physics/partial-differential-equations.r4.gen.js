// Round 4 extras for partial-differential-equations: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

/** Solve -(p u')' style problems on a grid: a_i u_{i-1} + b_i u_i + c_i u_{i+1} = d_i (Thomas algorithm). */
function thomas(a, b, c, d) {
  const n = b.length, cp = new Array(n), dp = new Array(n), x = new Array(n);
  cp[0] = c[0] / b[0]; dp[0] = d[0] / b[0];
  for (let i = 1; i < n; i++) { const m = b[i] - a[i] * cp[i - 1]; cp[i] = c[i] / m; dp[i] = (d[i] - a[i] * dp[i - 1]) / m; }
  x[n - 1] = dp[n - 1];
  for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
  return x;
}
/** Finite-difference solution of u'' + (k/r) u' = s on [r1, r2] with u(r1) = V1, u(r2) = V2, sampled at r0 (on the grid). */
function radialFD(k, s, r1, r2, V1, V2, r0, N = 2000) {
  const h = (r2 - r1) / N, a = [], b = [], c = [], d = [];
  for (let i = 1; i < N; i++) {
    const r = r1 + i * h;
    a.push(1 / (h * h) - k / (2 * r * h)); b.push(-2 / (h * h)); c.push(1 / (h * h) + k / (2 * r * h)); d.push(s);
  }
  d[0] -= a[0] * V1; d[N - 2] -= c[N - 2] * V2; a[0] = 0; c[N - 2] = 0;
  const u = thomas(a, b, c, d), i0 = Math.round((r0 - r1) / h);
  return i0 === 0 ? V1 : i0 === N ? V2 : u[i0 - 1];
}

export default {
  items: [
    { id: 'pde-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'classification',
      q: R`The equation $u_t + u\,u_x = 0$ is`,
      options: [R`first order and linear`, R`first order and non-linear`, R`second order and linear`, R`second order and non-linear`], answer: 1,
      sol: R`The highest derivative is first order. The term $u\,u_x$ multiplies the unknown by its own derivative, so the equation is non-linear: the sum of two solutions is not a solution. (This is the inviscid Burgers equation, whose waves steepen into shocks.)`,
      trap: R`Having only first derivatives does not make an equation linear; look at how $u$ enters the coefficients.` },
    { id: 'pde-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'separation of variables',
      q: R`Putting $u(x, y) = X(x)Y(y)$ into Laplace's equation $u_{xx} + u_{yy} = 0$ leads to`,
      options: [R`$\dfrac{X''}{X} = \dfrac{Y''}{Y} = \text{constant}$`, R`$X'' = Y''$`, R`$X''Y'' = \text{constant}$`, R`$\dfrac{X''}{X} = -\dfrac{Y''}{Y} = \text{constant}$`], answer: 3,
      sol: R`Substituting gives $X''Y + XY'' = 0$. Dividing by $XY$: $\frac{X''}{X} = -\frac{Y''}{Y}$. The left side depends only on $x$ and the right only on $y$, so both equal the same constant. One factor then oscillates and the other grows or decays (e.g. $\sin kx\,\sinh ky$).`,
      trap: R`Dropping the minus sign would make both factors oscillate (or both grow), which does not satisfy Laplace's equation.` },
    { id: 'pde-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'heat equation', format: 'integer',
      q: R`The function $u = e^{-4t}\sin kx$ satisfies the heat equation $u_t = u_{xx}$ for a positive value of $k$ equal to ______.`,
      answer: 2, tol: 0, calc: () => Math.sqrt(4),
      sol: R`$u_t = -4u$ and $u_{xx} = -k^2u$. Equal when $k^2 = 4$, so $k = 2$. Shorter waves (larger $k$) decay faster, as $e^{-k^2t}$.`,
      trap: R`Matching $4$ with $k$ instead of $k^2$.` },
    { id: 'pde-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Laplace equation',
      q: R`$u$ satisfies Laplace's equation inside the disc $r < a$, with boundary values $u(a, \theta) = 3 + \sin\theta + 2\cos^2\theta$. The value of $u$ at the centre is`,
      options: [R`$3$`, R`$5$`, R`$4$`, R`$6$`], answer: 2,
      sol: R`A harmonic function's value at the centre of a disc is the average of its values on the circle (mean value property). Averages over a full turn: $3\to3$, $\sin\theta\to0$, $2\cos^2\theta\to1$. So $u(0) = 4$. (In full: $2\cos^2\theta = 1 + \cos2\theta$, and the solution is $4 + \frac ra\sin\theta + \frac{r^2}{a^2}\cos2\theta$.)`,
      trap: R`Evaluating the boundary function at $\theta = 0$ (giving 5) instead of averaging it.` },
    { id: 'pde-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'characteristics',
      q: R`$u(x, t)$ satisfies $u_t + 3u_x = 0$ with $u(x, 0) = e^{-x^2}$. The value of $u(5, 1)$ is ______ (four decimal places).`,
      answer: 0.0183, tol: 0.0002, calc: () => Math.exp(-4),
      sol: R`$u$ is constant along the characteristics $x - 3t = $ constant, so $u(x, t) = e^{-(x - 3t)^2}$: the bump moves right at speed 3 without changing shape. At $(5, 1)$: $e^{-(5 - 3)^2} = e^{-4}\approx0.0183$.`,
      trap: R`Using $x + 3t$ moves the bump the wrong way and gives $e^{-64}\approx0$.` },
    { id: 'pde-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'wave equation', format: 'statements',
      q: R`A string $0 < x < L$ with fixed ends obeys $u_{tt} = c^2u_{xx}$. Which statements hold for every smooth initial data?`,
      options: [R`$E = \tfrac12\displaystyle\int_0^L(u_t^2 + c^2u_x^2)\,dx$ stays constant`, R`The motion repeats with period $2L/c$`, R`A corner in the initial shape is gradually smoothed out`, R`$\max_x|u|$ can never exceed its value at $t = 0$`], answer: [0, 1],
      sol: R`$\frac{dE}{dt} = \int(u_tu_{tt} + c^2u_xu_{xt})dx = c^2[u_tu_x]_0^L = 0$ after integrating by parts, since $u_t = 0$ at fixed ends. Every mode $\sin\frac{n\pi x}{L}$ has angular frequency $\frac{n\pi c}{L}$, all multiples of $\pi c/L$, so everything repeats after $2L/c$. Corners travel along characteristics unchanged (no smoothing: that is the heat equation). A string that starts flat but moving has $\max|u| = 0$ at $t = 0$ and is displaced later, so the last statement fails.`,
      trap: R`Carrying heat-equation intuition (smoothing, maximum principle) over to the wave equation.` },
    { id: 'pde-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'steady states', unit: 'K',
      q: R`A rod $0\le x\le L$ with $L = 0.5$ m has heat generated uniformly inside it, so that $u_t = \kappa u_{xx} + q$ with $q/\kappa = 400$ K/m$^2$. Both ends are held at 0 (temperatures measured above the surroundings). In the steady state, the temperature at the middle of the rod is ______ K (one decimal place).`,
      answer: 12.5, tol: 0.05, calc: () => (400 * 0.5 ** 2) / 8,
      sol: R`Steady state: $u'' = -q/\kappa = -400$. With $u(0) = u(L) = 0$: $u = 200\,x(L - x)$. At $x = L/2$: $200\cdot\frac{L^2}{4} = 50L^2 = 12.5$ K. (In general the peak is $\frac{qL^2}{8\kappa}$.)`,
      trap: R`Solving $u'' = +400$ gives a negative temperature: heat generation makes the middle hotter than the ends.` },
    { id: 'pde-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'heat equation',
      q: R`A very long rod ($x > 0$) is at temperature 0. From $t = 0$ its end $x = 0$ is held at $T_0$. With $u_t = \kappa u_{xx}$, the temperature is`,
      options: [R`$T_0\,\text{erfc}\left(\dfrac{x}{2\sqrt{\kappa t}}\right)$`, R`$T_0\,\text{erf}\left(\dfrac{x}{2\sqrt{\kappa t}}\right)$`, R`$T_0\,e^{-x^2/(4\kappa t)}$`, R`$T_0\left(1 - \dfrac{x}{\sqrt{\kappa t}}\right)$`], answer: 0,
      sol: R`No length scale is given, so the solution depends only on $\eta = x/(2\sqrt{\kappa t})$. Putting $u = F(\eta)$ in the heat equation gives $F'' + 2\eta F' = 0$, so $F' \propto e^{-\eta^2}$ and $F = A + B\,\text{erf}\,\eta$. The conditions $F(0) = T_0$ and $F(\infty) = 0$ give $F = T_0(1 - \text{erf}\,\eta) = T_0\,\text{erfc}\,\eta$. The erf option has the end at 0, not $T_0$; $e^{-x^2/(4\kappa t)}$ alone does not satisfy the heat equation (the spreading Gaussian solution carries a $1/\sqrt t$ factor, which would then break the boundary condition); the linear option goes negative.`,
      trap: R`erf and erfc are easy to swap: check the value at $x = 0$.` },
    { id: 'pde-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'eigenvalue problems', format: 'statements',
      q: R`Consider $X'' + \lambda X = 0$ on $0 < x < L$ with $X(0) = 0$ and $X'(L) = 0$ (one end fixed, one end free). Which statements are true?`,
      options: [R`The eigenvalues are $\lambda_n = \left(\dfrac{(2n - 1)\pi}{2L}\right)^2$, $n = 1, 2, \dots$`, R`The eigenfunctions are $\sin\dfrac{(2n - 1)\pi x}{2L}$`, R`$\lambda = 0$ is an eigenvalue`, R`Eigenfunctions with different $\lambda$ are orthogonal on $[0, L]$`], answer: [0, 1, 3],
      sol: R`$X(0) = 0$ leaves $X = \sin\sqrt\lambda x$. Then $X'(L) = \sqrt\lambda\cos\sqrt\lambda L = 0$ needs $\sqrt\lambda L = (2n - 1)\pi/2$: odd quarter-waves fit on the rod. For $\lambda = 0$, $X = Ax + B$ with $B = 0$ and $A = 0$: only the zero function, so 0 is not an eigenvalue. It is a Sturm-Liouville problem, so eigenfunctions for different eigenvalues are orthogonal.`,
      trap: R`The insulated-at-both-ends problem has $\lambda = 0$ (the constant); one fixed end removes it.` },
    { id: 'pde-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'wave equation',
      q: R`A brief, localised disturbance starts a wave governed by $u_{tt} = c^2\nabla^2u$. At a fixed distant point, after the wavefront has passed,`,
      options: [R`the disturbance vanishes at once in both 2 and 3 dimensions`, R`it vanishes at once in 3 dimensions but leaves a slowly decaying tail in 2 dimensions`, R`it vanishes at once in 2 dimensions but leaves a tail in 3 dimensions`, R`a tail remains in both 2 and 3 dimensions`], answer: 1,
      sol: R`In 3D the retarded Green's function is $\delta(t - r/c)/(4\pi r)$: the signal arrives and stops (Huygens' principle holds; this is why we hear sharp sounds). In 2D it is $\frac{\theta(ct - r)}{2\pi c\sqrt{c^2t^2 - r^2}}$, which is non-zero for every time after the front: a ripple on a pond keeps the water stirring behind the front, fading like $1/t$.`,
      trap: R`Assuming sharp signals in every dimension; Huygens' principle holds only in odd dimensions of 3 or more.` },
    { id: 'pde-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'heat equation', unit: '°C',
      q: R`A rod $0\le x\le1$ m with insulated ends ($u_x = 0$ at both) has $\kappa = 1.0\times10^{-4}$ m$^2$/s and starts at $u(x, 0) = 100\cos^2(\pi x)$ °C. The temperature at $x = 0$ after 1000 s is ______ °C (two decimal places).`,
      answer: 50.96, tol: 0.03, calc: () => 50 + 50 * Math.exp(-4 * Math.PI ** 2 * 1e-4 * 1000),
      sol: R`Write $100\cos^2\pi x = 50 + 50\cos2\pi x$. With insulated ends the modes are $\cos n\pi x$, each decaying as $e^{-\kappa n^2\pi^2t}$; the constant ($n = 0$) never decays because no heat escapes. So $u = 50 + 50\cos(2\pi x)\,e^{-4\pi^2\kappa t}$. At $x = 0$, $t = 1000$ s: exponent $4\pi^2\times0.1 = 3.948$, so $u = 50 + 50e^{-3.948}\approx50 + 0.965 = 50.96$ °C.`,
      trap: R`Expecting the rod to cool towards 0: with insulated ends it relaxes to the average temperature, 50 °C.` },
    { id: 'pde-r4-12', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Laplace equation',
      q: R`Between two concentric spheres, $\nabla^2u = 0$ with $u = 10$ on $r = 1$ and $u = 0$ on $r = 2$. The value of $u$ at $r = 1.5$ is ______ (two decimal places).`,
      answer: 3.33, tol: 0.01, calc: () => -10 + 20 / 1.5,
      sol: R`A radial harmonic function in 3D is $u = A + B/r$. The conditions give $A + B = 10$ and $A + B/2 = 0$, so $B = 20$, $A = -10$. At $r = 1.5$: $-10 + 13.33 = 3.33$.`,
      trap: R`Interpolating linearly in $r$ gives 5; the $1/r$ form drops faster near the inner sphere.` },
  ],
  gens: [
    { id: 'pde-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'characteristics',
      make(r) {
        const c = choose(r, [-3, -2, -1, 1, 2, 4]), A = int(r, 2, 9), x0 = int(r, -2, 2), t1 = choose(r, [0.5, 1, 1.5, 2]), x1 = x0 + c * t1 + choose(r, [-1.5, -1, -0.5, 0.5, 1, 1.5]);
        const xi = x1 - c * t1, v = A * Math.exp(-((xi - x0) ** 2));
        const sh = (z) => (z === 0 ? 'x' : z > 0 ? `(x - ${z})` : `(x + ${-z})`);
        return { q: R`$u(x, t)$ satisfies $u_t ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}u_x = 0$ with $u(x, 0) = ${A}e^{-${sh(x0)}^2}$. The value of $u(${x1}, ${t1})$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: Math.max(0.0002, round(v * 0.002, 4)), c, A, x0, t1, x1,
          sol: R`Along $dx/dt = ${c}$ the value of $u$ does not change, so $u(x, t) = u(x - (${c})t, 0)$: the profile moves with velocity ${c} unchanged. The point $(${x1}, ${t1})$ traces back to $\xi = ${x1} - (${c})(${t1}) = ${xi}$, so $u = ${A}e^{-(${xi} - (${x0}))^2} = ${A}e^{-${(xi - x0) ** 2}}\approx${round(v, 4)}$.`,
          trap: 'Tracing back along $x + ct$ instead of $x - ct$ sends the profile the wrong way.' };
      },
      verify: (p) => {
        // march the profile with exact upwind steps (Courant number 1) on a grid of spacing |c|*dt
        const n = 200, dt = p.t1 / n; let x = p.x1;
        for (let i = 0; i < n; i++) x -= p.c * dt;
        return p.A * Math.exp(-((x - p.x0) ** 2));
      } },
    { id: 'pde-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'steady states',
      make(r) {
        const L = choose(r, [1, 2]), T1 = int(r, 0, 4) * 10, T2 = int(r, 0, 6) * 10, Q = int(r, 1, 6) * 20, x0 = choose(r, [0.25, 0.5, 0.75]) * L;
        const v = T1 + ((T2 - T1) * x0) / L + (Q / 2) * x0 * (L - x0);
        return { q: R`A rod $0\le x\le${L}$ m obeys $u_t = \kappa u_{xx} + q$ with uniform heating $q/\kappa = ${Q}$ K/m$^2$. The ends are held at $u(0) = ${T1}$ °C and $u(${L}) = ${T2}$ °C. In the steady state, the temperature at $x = ${x0}$ m is ______ °C (two decimal places).`,
          answer: round(v, 2), tol: 0.02, L, T1, T2, Q, x0,
          sol: R`Steady state: $u'' = -${Q}$. The general solution is a straight line plus the particular part $\frac{${Q}}{2}x(${L} - x)$, which vanishes at both ends; the line matches the end temperatures. So $u = ${T1} + \frac{${T2 - T1}}{${L}}x + ${Q / 2}\,x(${L} - x)$. At $x = ${x0}$: $${T1} + (${round(((T2 - T1) * x0) / L, 4)}) +${round((Q / 2) * x0 * (L - x0), 4)} = ${round(v, 2)}$ °C.`,
          trap: 'Sign of the source: heating ($q > 0$) bends the profile upward, above the straight line between the ends.' };
      },
      verify: (p) => radialFD(0, -p.Q, 0, p.L, p.T1, p.T2, p.x0, 400) },
    { id: 'pde-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Laplace equation',
      make(r) {
        const geo = choose(r, ['sphere', 'cylinder']), r1 = int(r, 1, 2), r2 = r1 + int(r, 1, 3), V1 = int(r, 1, 10) * 10, V2 = int(r, 0, 4) * 5;
        const r0 = round(r1 + (r2 - r1) * choose(r, [0.25, 0.5, 0.75]), 2);
        const v = geo === 'sphere' ? (V1 * r1 * (r2 - r0) + V2 * r2 * (r0 - r1)) / (r0 * (r2 - r1)) : V1 + ((V2 - V1) * Math.log(r0 / r1)) / Math.log(r2 / r1);
        return { q: R`Between two ${geo === 'sphere' ? 'concentric spheres' : 'coaxial long cylinders'} of radii ${r1} and ${r2}, $\nabla^2u = 0$ with $u = ${V1}$ on the inner and $u = ${V2}$ on the outer surface (no dependence on angle${geo === 'cylinder' ? ' or along the axis' : ''}). The value of $u$ at radius ${r0} is ______ (two decimal places).`,
          answer: round(v, 2), tol: 0.02, geo, r1, r2, V1, V2, r0,
          sol: geo === 'sphere'
            ? R`A radial harmonic function in 3D is $u = A + B/r$ (from $\frac1{r^2}(r^2u')' = 0$). Matching: $A + B/${r1} = ${V1}$, $A + B/${r2} = ${V2}$, so $B = \frac{${V1 - V2}}{1/${r1} - 1/${r2}} = ${round((V1 - V2) / (1 / r1 - 1 / r2), 4)}$ and $A = ${round(V2 - (V1 - V2) / (1 / r1 - 1 / r2) / r2, 4)}$. At $r = ${r0}$: $u\approx${round(v, 2)}$.`
            : R`A radial harmonic function in 2D is $u = A + B\ln r$ (from $\frac1r(ru')' = 0$). Matching the two surfaces: $u = ${V1} + (${V2 - V1})\frac{\ln(r/${r1})}{\ln(${r2}/${r1})}$. At $r = ${r0}$: $\frac{\ln(${round(r0 / r1, 4)})}{\ln(${round(r2 / r1, 4)})} = ${round(Math.log(r0 / r1) / Math.log(r2 / r1), 4)}$, so $u\approx${round(v, 2)}$.`,
          trap: 'Linear interpolation in $r$ holds only for flat plates; spheres need $1/r$ and cylinders $\\ln r$.' };
      },
      verify: (p) => radialFD(p.geo === 'sphere' ? 2 : 1, 0, p.r1, p.r2, p.V1, p.V2, p.r0, 2000) },
  ],
};
