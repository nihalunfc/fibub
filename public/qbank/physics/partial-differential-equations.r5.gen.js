// Round 5 extras for partial-differential-equations: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'pde-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'classification',
      q: R`The equation $u_t + u\,u_x = \nu u_{xx}$ (with $\nu > 0$ a constant) is`,
      options: [R`second order and nonlinear`, R`first order and linear`, R`second order and linear`, R`third order and nonlinear`], answer: 0,
      sol: R`The highest derivative is $u_{xx}$, so it is second order. The term $u\,u_x$ multiplies the unknown by its own derivative, so it is nonlinear: the sum of two solutions is not a solution.`,
      trap: R`The highest-order term $\nu u_{xx}$ is linear, but one nonlinear term anywhere makes the whole equation nonlinear.` },
    { id: 'pde-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'wave equation',
      q: R`$u(x, t) = \sin(3x - 12t)$ solves $u_{tt} = c^2u_{xx}$. The value of $c$ (taking $c > 0$) is ______.`,
      answer: 4, tol: 0, calc: () => 12 / 3,
      sol: R`$u_{tt} = -144\sin(3x - 12t)$ and $u_{xx} = -9\sin(3x - 12t)$. So $c^2 = 144/9 = 16$ and $c = 4$: the wave $\sin(k(x - ct))$ with $k = 3$ moves at $12/3 = 4$.`,
      trap: R`Dividing $12$ by $3$ gives the speed directly; $144/9 = 16$ is $c^2$, not $c$.` },
    { id: 'pde-r5-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'heat equation',
      q: R`Which function solves $u_t = 2u_{xx}$?`,
      options: [R`$e^{-4t}\sin2x$`, R`$e^{-2t}\sin2x$`, R`$e^{-8t}\sin2x$`, R`$e^{-16t}\sin2x$`], answer: 2,
      sol: R`For $u = e^{-\lambda t}\sin kx$: $u_t = -\lambda u$ and $2u_{xx} = -2k^2u$. So $\lambda = 2k^2 = 2\cdot4 = 8$.`,
      trap: R`Forgetting to square $k$ gives $\lambda = 4$; forgetting the diffusivity 2 also gives 4.` },
    { id: 'pde-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'classification', format: 'statements',
      q: R`For $u_{xx} + 2u_{xy} + u_{yy} = 0$, which statements are true?`,
      options: [R`It is parabolic`, R`$u = f(x - y) + x\,g(x - y)$ solves it for any smooth $f$, $g$`, R`Its characteristics are the lines $x - y = \text{constant}$`, R`It is elliptic`], answer: [0, 1, 2],
      sol: R`With $A = 1$, $B = 2$, $C = 1$ (coefficients of $u_{xx}, u_{xy}, u_{yy}$), $B^2 - 4AC = 0$: parabolic, not elliptic. The operator is $(\partial_x + \partial_y)^2$, which kills any function of $x - y$. Check $x\,g(x - y)$: $u_{xx} = 2g' + xg''$, $u_{xy} = -g' - xg''$, $u_{yy} = xg''$; sum $2g' + xg'' - 2g' - 2xg'' + xg'' = 0$. The single family of characteristics is $x - y = $ const.`,
      trap: R`A repeated characteristic (parabolic case) needs the extra factor $x$ (or $y$) for the second solution, just like a repeated root in an ODE.` },
    { id: 'pde-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'heat equation',
      q: R`A rod $0\le x\le\pi$ obeys $u_t = u_{xx}$ with $u = 0$ at both ends and $u(x, 0) = \sin x + \tfrac12\sin3x$. The value of $u(\pi/2, 0.5)$ is ______ (three decimal places).`,
      answer: 0.601, tol: 0.002, calc: () => Math.exp(-0.5) + 0.5 * Math.sin(1.5 * Math.PI) * Math.exp(-4.5),
      sol: R`Each mode decays on its own: $\sin nx\to e^{-n^2t}\sin nx$. So $u = e^{-t}\sin x + \tfrac12e^{-9t}\sin3x$. At $x = \pi/2$, $t = 0.5$: $e^{-0.5}(1) + \tfrac12e^{-4.5}(-1) = 0.6065 - 0.0056 = 0.601$.`,
      trap: R`Decaying the third mode as $e^{-3t}$ instead of $e^{-9t}$ gives $0.6065 - 0.112 = 0.495$.` },
    { id: 'pde-r5-06', type: 'mcq', level: 2, exams: ['jam'], sub: 'laplace equation',
      q: R`$u$ is harmonic inside and on the circle $r = 3$, where $u(3, \theta) = 4 + 3\cos\theta - 2\sin5\theta$. The value of $u$ at the centre is`,
      options: [R`$5$`, R`$4$`, R`$7$`, R`$0$`], answer: 1,
      sol: R`By the mean-value property, a harmonic function at the centre equals its average over any circle around it. The average of $\cos\theta$ and $\sin5\theta$ over a full turn is zero, leaving 4. (Each mode $r^n\cos n\theta$ vanishes at $r = 0$ for $n\ge1$.)`,
      trap: R`Adding the amplitudes ($4 + 3 - 2$) treats the boundary value at $\theta = 0$ as the centre value.` },
    { id: 'pde-r5-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'separation of variables',
      q: R`A rod $0 < x < L$ obeys $u_t = \kappa u_{xx}$ with $u(0, t) = 0$ (fixed temperature) and $u_x(L, t) = 0$ (insulated end). The spatial modes are`,
      options: [R`$\sin\dfrac{n\pi x}{L}$`, R`$\cos\dfrac{n\pi x}{L}$`, R`$\sin\dfrac{(2n - 1)\pi x}{2L}$`, R`$\cos\dfrac{(2n - 1)\pi x}{2L}$`], answer: 2,
      sol: R`$X'' = -k^2X$ with $X(0) = 0$ gives $X = \sin kx$. Then $X'(L) = k\cos kL = 0$ needs $kL = \frac\pi2, \frac{3\pi}2, \dots$, i.e. $k = \frac{(2n - 1)\pi}{2L}$. So the modes are quarter-wave sines, like a pipe closed at one end.`,
      trap: R`$\sin(n\pi x/L)$ fits zero temperature at BOTH ends; at an insulated end the slope, not the value, must vanish.` },
    { id: 'pde-r5-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'first order',
      q: R`$u(x, t)$ obeys $u_t + 2u_x = -u$ with $u(x, 0) = e^{-x^2}$. The value of $u(2, 1)$ is ______ (three decimal places).`,
      answer: 0.368, tol: 0.002, calc: () => Math.exp(-1) * Math.exp(-((2 - 2) ** 2)),
      sol: R`Along the characteristics $x - 2t = \xi$, the equation becomes $\frac{du}{dt} = -u$, so $u = e^{-t}u(\xi, 0) = e^{-t}e^{-(x - 2t)^2}$. At $(2, 1)$: $\xi = 0$, $u = e^{-1}\cdot1\approx0.368$. The bump moves right at speed 2 and shrinks by $e^{-t}$.`,
      trap: R`Moving the bump the wrong way ($x + 2t$) puts $(2, 1)$ at $\xi = 4$ and gives almost zero.` },
    { id: 'pde-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'well posedness', format: 'statements',
      q: R`Which statements about well-posed problems are true?`,
      options: [R`Laplace's equation with both $u$ and $u_y$ given on the line $y = 0$ (Cauchy data) is unstable: tiny changes in data can give huge changes in $u$`, R`Running the heat equation backwards in time is ill-posed`, R`For $u_{tt} = c^2u_{xx}$, a disturbance spreads no faster than $c$`, R`For the heat equation on the whole line, a disturbance stays inside a bounded region for a finite time`], answer: [0, 1, 2],
      sol: R`Cauchy data $u(x, 0) = 0$, $u_y(x, 0) = \frac{\sin nx}{n}$ give $u = \frac{\sin nx\sinh ny}{n^2}$: the data shrink to zero as $n$ grows but the solution blows up (Hadamard's example). Backward heat flow multiplies mode $n$ by $e^{+n^2\kappa t}$, so tiny ripples explode. The wave equation has a finite speed $c$ (d'Alembert). But the heat kernel $e^{-x^2/4\kappa t}$ is non-zero at every $x$ for any $t > 0$: heat spreads at infinite speed, so the last statement is false.`,
      trap: R`The heat kernel's tail is tiny far away but never exactly zero; only hyperbolic equations have a sharp light-cone.` },
    { id: 'pde-r5-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'wave equation',
      q: R`A string $0\le x\le1$ (wave speed $c = 1$, ends fixed) is released from rest with $u(x, 0) = \sin\pi x + \sin3\pi x$. The value of $u(\tfrac12, \tfrac13)$ is ______ (one decimal place).`,
      answer: 1.5, tol: 0.01, calc: () => Math.cos(Math.PI / 3) * 1 + Math.cos(Math.PI) * Math.sin(1.5 * Math.PI),
      sol: R`Released from rest, each mode oscillates as $\sin n\pi x\cos n\pi ct$. So $u = \sin\pi x\cos\pi t + \sin3\pi x\cos3\pi t$. At $x = \tfrac12$, $t = \tfrac13$: $1\cdot\cos\frac\pi3 + (-1)\cdot\cos\pi = \tfrac12 + 1 = 1.5$.`,
      trap: R`$\sin(3\pi/2) = -1$, and $\cos\pi = -1$: the two minus signs make the second mode add, not subtract.` },
  ],
  gens: [
    { id: 'pde-r5g1', type: 'nat', level: 2, exams: ['jam'], sub: 'heat equation',
      make(r) {
        const m = int(r, 1, 4), kap = choose(r, [0.5, 1, 2, 3]);
        const k = kap * m * m;
        return { q: R`$u = e^{-${k}t}\sin ${m === 1 ? "" : m}x$ solves the heat equation $u_t = \kappa u_{xx}$. Find $\kappa$ (one decimal place).`,
          answer: kap, tol: 0.01, k, m,
          sol: R`$u_t = -${k}u$ and $u_{xx} = -${m * m}u$. So $-${k} = -${m * m}\kappa$, giving $\kappa = ${k}/${m * m} = ${kap}$.`,
          trap: 'Dividing by $m$ instead of $m^2$: each $x$-derivative brings down one factor of $m$, and there are two.' };
      },
      verify: (p) => p.k / (p.m * p.m) },
    { id: 'pde-r5g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'first order',
      make(r) {
        const c = choose(r, [-2, -1, 1, 2, 3]), lam = choose(r, [0.5, 1, 2]), t = choose(r, [0.5, 1, 1.5]), x = round(c * t + choose(r, [-1, -0.5, 0, 0.5, 1]), 2);
        const v = Math.exp(-lam * t) * Math.exp(-((x - c * t) ** 2));
        return { q: R`$u(x, t)$ obeys $u_t ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}u_x = -${lam === 1 ? '' : lam}u$ with $u(x, 0) = e^{-x^2}$. Find $u(${x}, ${t})$ (four decimal places).`,
          answer: round(v, 4), tol: 0.0003, c, lam, t, x,
          sol: R`On the characteristics $x - (${c})t = \xi$ the equation reads $du/dt = -${lam}u$, so $u = e^{-${lam}t}e^{-(x - (${c})t)^2}$. At $x = ${x}$, $t = ${t}$: $\xi = ${round(x - c * t, 4)}$, and $u = e^{-${round(lam * t, 4)}}e^{-${round((x - c * t) ** 2, 4)}}\approx${round(v, 4)}$.`,
          trap: 'The profile moves with velocity equal to the coefficient of $u_x$; moving it the other way is the usual slip.' };
      },
      verify: (p) => Math.exp(-p.lam * p.t - (p.x - p.c * p.t) ** 2) },
    { id: 'pde-r5g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'separation of variables',
      make(r) {
        const cases = [
          ['$u = 0$ at $x = 0$ and $u = 0$ at $x = L$', 0],
          ['$u_x = 0$ at $x = 0$ and $u_x = 0$ at $x = L$', 1],
          ['$u = 0$ at $x = 0$ and $u_x = 0$ at $x = L$', 2],
          ['$u_x = 0$ at $x = 0$ and $u = 0$ at $x = L$', 3],
        ];
        const modes = [R`$\sin\dfrac{n\pi x}{L}$, $n = 1, 2, \dots$`, R`$\cos\dfrac{n\pi x}{L}$, $n = 0, 1, 2, \dots$`, R`$\sin\dfrac{(2n - 1)\pi x}{2L}$, $n = 1, 2, \dots$`, R`$\cos\dfrac{(2n - 1)\pi x}{2L}$, $n = 1, 2, \dots$`];
        const why = [
          'Zero value at both ends needs $\\sin kx$ with $\\sin kL = 0$, so $kL = n\\pi$.',
          'Zero slope at both ends needs $\\cos kx$ with $\\sin kL = 0$, so $kL = n\\pi$, including the constant mode $n = 0$.',
          'Zero value at 0 gives $\\sin kx$; zero slope at $L$ needs $\\cos kL = 0$, so $kL = (2n - 1)\\pi/2$.',
          'Zero slope at 0 gives $\\cos kx$; zero value at $L$ needs $\\cos kL = 0$, so $kL = (2n - 1)\\pi/2$.',
        ];
        const [bc, i] = choose(r, cases);
        const o = mcqOptions(r, modes[i], modes.filter((_, j) => j !== i));
        const eq = choose(r, ['u_t = \\kappa u_{xx}', 'u_{tt} = c^2u_{xx}']);
        return { q: R`Separating $${eq}$ on $0 < x < L$ with ${bc}, the spatial modes are`, ...o,
          sol: R`Put $u = X(x)T(t)$; then $X'' = -k^2X$, so $X = A\cos kx + B\sin kx$. ${why[i]} The time equation does not affect which modes are allowed.`,
          trap: 'A condition on $u$ fixes the value of $X$ at that end; a condition on $u_x$ fixes its slope. Mixing them up swaps sine and cosine.' };
      } },
  ],
};
