// Round 4 extras for boundary-value-problems: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;
const deg = Math.PI / 180;

export default {
  items: [
    { id: 'bvp-r4-01', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'superposition',
      q: R`A long pipe of square cross-section has its four walls insulated from each other and held at $10$ V, $20$ V, $30$ V and $60$ V. The potential on the axis of the pipe (the centre of the square, far from the ends) is ______ V.`,
      answer: 30, tol: 0.01, unit: 'V', calc: () => (10 + 20 + 30 + 60) / 4,
      sol: R`Solve four problems, each with one wall at its potential and the other three at zero, and add them (Laplace's equation is linear and the boundary values add). By symmetry, a single wall at $V_i$ gives the centre the same share as any other wall would, and all four walls at $V_i$ would give exactly $V_i$; so each contributes $V_i/4$. The centre is at $\frac{10 + 20 + 30 + 60}{4} = 30$ V.`,
      trap: R`Averaging only opposite walls, or trying to sum a Fourier series when symmetry gives the answer directly.` },
    { id: 'bvp-r4-02', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'legendre expansion',
      q: R`A thin spherical surface of radius $R$ is held at $V(\theta) = V_0\sin^2\theta$ with $V_0 = 100$ V; there is no other charge. On the axis $\theta = 0$, at $r = 2R$, the potential is ______ V.`,
      answer: 25, tol: 0.1, unit: 'V', calc: () => (2 / 3) * 100 * (1 / 2 - 1 / 8),
      sol: R`Write $\sin^2\theta = 1 - \cos^2\theta = \frac23 - \frac23P_2(\cos\theta)$, using $\cos^2\theta = \frac{1 + 2P_2}{3}$. Outside, each $P_l$ term carries $(R/r)^{l+1}$: $V = \frac23V_0\frac Rr - \frac23V_0\left(\frac Rr\right)^3P_2$. At $r = 2R$, $\theta = 0$ ($P_2 = 1$): $V = \frac23\times100\times\left(\frac12 - \frac18\right) = 25$ V. Note the surface itself is at 0 V on the axis, yet the potential outside on the axis is positive.`,
      trap: R`Assuming $V = 0$ all along the axis because the surface value there is zero; each Legendre term falls off at its own rate.` },
    { id: 'bvp-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'separation of variables',
      q: R`Laplace's equation in three Cartesian dimensions is separated as $V = X(x)Y(y)Z(z)$ with $X''/X = -\alpha^2$ and $Y''/Y = -\beta^2$ ($\alpha, \beta$ real and non-zero). Then $Z(z)$ is`,
      options: [R`sinusoidal, $\sin\left(\sqrt{\alpha^2 + \beta^2}\,z\right)$ and $\cos$`, R`exponential (or hyperbolic), $e^{\pm\sqrt{\alpha^2 + \beta^2}\,z}$`, R`linear in $z$`, R`a constant`], answer: 1,
      sol: R`The three ratios must add to zero: $\frac{X''}{X} + \frac{Y''}{Y} + \frac{Z''}{Z} = 0$, so $\frac{Z''}{Z} = \alpha^2 + \beta^2 > 0$. Then $Z = Ae^{\gamma z} + Be^{-\gamma z}$ (or $\sinh$, $\cosh$) with $\gamma = \sqrt{\alpha^2 + \beta^2}$. Oscillation in two directions forces growth or decay in the third.`,
      trap: R`Expecting all three factors to oscillate; their separation constants must sum to zero.` },
    { id: 'bvp-r4-04', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'legendre expansion',
      q: R`A charge-free sphere's surface potential contains only an $l = 3$ term, $V(R,\theta) = V_0P_3(\cos\theta)$. Far outside, the magnitude of the electric field falls off with distance as`,
      options: [R`$r^{-3}$`, R`$r^{-4}$`, R`$r^{-5}$`, R`$r^{-2}$`], answer: 2,
      sol: R`Outside, the $l$-th term is $V_0\left(\frac Rr\right)^{l+1}P_l$, so for $l = 3$ the potential goes as $r^{-4}$ (an octupole). The field is a derivative, one more power: $E\propto r^{-5}$.`,
      trap: R`Stopping at the potential's power, or using $r^{-l}$ for the potential.` },
    { id: 'bvp-r4-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'harmonic functions',
      q: R`Which of these (in spherical coordinates) satisfies Laplace's equation?`,
      options: [R`$r^2\sin^2\theta\cos2\phi$`, R`$r^2\cos^2\theta$`, R`$r\sin\theta\cos2\phi$`, R`$r^2\sin2\theta$`], answer: 0,
      sol: R`Convert to Cartesian: $r^2\sin^2\theta\cos2\phi = s^2(\cos^2\phi - \sin^2\phi) = x^2 - y^2$, whose Laplacian is $2 - 2 = 0$. $r^2\cos^2\theta = z^2$ has Laplacian 2. $r\sin\theta\cos2\phi = s\cos2\phi$, and in cylindrical coordinates $\nabla^2(s\cos2\phi) = \left(\frac1s - \frac4s\right)\cos2\phi\ne0$. $r^2\sin2\theta = 2zs$ has Laplacian $2z/s\ne0$.`,
      trap: R`Judging by the angular part alone; the power of $r$ must match the order of the harmonic ($r^l$ with $l = 2$ for $\cos2\phi$ needs $\sin^2\theta$).` },
    { id: 'bvp-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'uniqueness',
      q: R`In a charge-free square region, the potential is given on two opposite sides and the normal derivative $\partial V/\partial n$ is given on the other two sides. The solution of Laplace's equation inside is`,
      options: [R`not unique`, R`unique`, R`unique only up to an additive constant`, R`impossible: mixed conditions have no solution`], answer: 1,
      sol: R`If two solutions existed, their difference $W$ would be harmonic with $W = 0$ on the first pair of sides and $\partial W/\partial n = 0$ on the second. Then $\int|\nabla W|^2d\tau = \oint W\,\partial_nW\,da = 0$, so $W$ is constant, and since it vanishes on part of the boundary the constant is zero. Mixed (Dirichlet on part, Neumann on the rest) conditions give a unique answer; the additive constant appears only with Neumann conditions everywhere.`,
      trap: R`Remembering "Neumann means up to a constant" without noticing that the Dirichlet part pins the constant.` },
    { id: 'bvp-r4-07', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'harmonic functions',
      q: R`A potential satisfies Laplace's equation everywhere in all of space and stays between $-10$ V and $+10$ V everywhere. Then`,
      options: [R`it can be $ax$ for a small constant $a$`, R`it must be zero`, R`it can be any harmonic polynomial with small coefficients`, R`it must be a constant`], answer: 3,
      sol: R`By the mean-value property, $V(P) - V(Q)$ is the difference of averages over two huge balls of radius $\rho$ centred at $P$ and $Q$; their non-overlapping parts have volume fraction $\propto|PQ|/\rho$, so the difference is at most $20\times O(|PQ|/\rho)\to0$ as $\rho\to\infty$. A bounded harmonic function on all of space is constant (Liouville's theorem). $ax$ and other non-constant polynomials grow without bound, and nothing forces the constant to be zero.`,
      trap: R`Choosing "must be zero": any constant is harmonic and bounded.` },
    { id: 'bvp-r4-08', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'poisson equation',
      q: R`A region is filled with uniform charge density $\rho_0$. Which of these potentials satisfy Poisson's equation $\nabla^2V = -\rho_0/\varepsilon_0$ there ($r$ spherical, $s$ cylindrical radius)?`,
      options: [R`$-\dfrac{\rho_0x^2}{2\varepsilon_0}$`, R`$-\dfrac{\rho_0r^2}{6\varepsilon_0}$`, R`$-\dfrac{\rho_0s^2}{4\varepsilon_0}$`, R`$-\dfrac{\rho_0r^2}{2\varepsilon_0}$`],
      answer: [0, 1, 2],
      sol: R`$\nabla^2x^2 = 2$, $\nabla^2r^2 = \nabla^2(x^2 + y^2 + z^2) = 6$ and $\nabla^2s^2 = \nabla^2(x^2 + y^2) = 4$. So the coefficients must be $\frac{1}{2}$, $\frac16$ and $\frac14$ of $-\rho_0/\varepsilon_0$ respectively; $-\rho_0r^2/(2\varepsilon_0)$ has Laplacian $-3\rho_0/\varepsilon_0$. These are the slab, ball and cylinder solutions (any harmonic function may be added).`,
      trap: R`Using the same factor $\frac12$ in every geometry; the number of squared coordinates matters.` },
    { id: 'bvp-r4-09', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'mean value',
      q: R`In a charge-free region $V = 2x + 3y^2 - 3z^2 + 5$ (volts, metres). The average of $V$ over the surface of the sphere of radius $1$ m centred at the origin is ______ V.`,
      answer: 5, tol: 0.01, unit: 'V', calc: () => 5,
      sol: R`First check that $V$ is harmonic: $\nabla^2V = 0 + 6 - 6 = 0$. A harmonic function's average over any sphere equals its value at the centre: $V(0, 0, 0) = 5$ V. (Directly: $x$ averages to zero by symmetry, and $y^2$ and $z^2$ have equal averages, so they cancel.)`,
      trap: R`Averaging $y^2$ and $z^2$ to zero; they are positive, but cancel each other.` },
    { id: 'bvp-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cylindrical harmonics',
      q: R`A long hollow cylinder of radius $R$ has its surface held at $V(\phi) = V_0(\cos\phi + \cos3\phi)$ with $V_0 = 80$ V, and there is no charge inside. At $s = R/2$, $\phi = 0$, the potential is ______ V.`,
      answer: 50, tol: 0.1, unit: 'V', calc: () => 80 * (0.5 + 0.125),
      sol: R`Inside, regular solutions are $s^n\cos n\phi$, so $V = V_0\left[\frac sR\cos\phi + \left(\frac sR\right)^3\cos3\phi\right]$, which matches the surface values at $s = R$. At $s = R/2$, $\phi = 0$: $V = 80\left(\frac12 + \frac18\right) = 50$ V.`,
      trap: R`Giving every harmonic the same factor $s/R$; the $n$-th harmonic goes as $(s/R)^n$.` },
    { id: 'bvp-r4-11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'cylindrical harmonics', format: 'statements',
      q: R`For two-dimensional problems in polar coordinates, the general solution of Laplace's equation is $A_0 + B_0\ln s + \sum_n\left(A_ns^n + B_ns^{-n}\right)(C_n\cos n\phi + D_n\sin n\phi)$. Which statements are true?`,
      options: [R`Inside a charge-free hollow cylinder, only the $A_0$ and $s^n$ terms survive`, R`A $\ln s$ term means there is net charge per unit length inside the region it surrounds`, R`The $\ln s$ term can appear inside a charge-free hollow cylinder`, R`A surface potential $V_0\cos3\phi$ on a cylinder of radius $R$ gives $V_0(s/R)^3\cos3\phi$ inside`],
      answer: [0, 1, 3],
      sol: R`At $s = 0$ both $\ln s$ and $s^{-n}$ blow up, so inside a charge-free cylinder they are excluded. The $\ln s$ potential is that of a line charge: its coefficient measures the enclosed charge per unit length, which is zero inside an empty cylinder. The single harmonic $\cos3\phi$ on the surface is matched by $A_3s^3$ with $A_3R^3 = V_0$.`,
      trap: R`Keeping $\ln s$ inside because it solves Laplace's equation away from the axis; the axis is part of the region.` },
    { id: 'bvp-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'legendre expansion',
      q: R`A thin spherical surface of radius $10$ cm is held at $V(\theta) = V_0\cos\theta$ with $V_0 = 90$ V; there is no other charge. The surface charge density on it at $\theta = 0$ is ______ nC/m² (one decimal place).`,
      answer: 23.9, tol: 0.2, unit: 'nC/m²', calc: () => 3 * C.eps0 * 90 / 0.1 * 1e9,
      sol: R`Inside, $V = V_0\frac rR\cos\theta$; outside, $V = V_0\frac{R^2}{r^2}\cos\theta$. The charge is the jump in the normal field: $\sigma = -\varepsilon_0\left(\frac{\partial V_{\rm out}}{\partial r} - \frac{\partial V_{\rm in}}{\partial r}\right)_R = \varepsilon_0\left(\frac{2V_0}{R} + \frac{V_0}{R}\right)\cos\theta = \frac{3\varepsilon_0V_0}{R}\cos\theta$. At $\theta = 0$: $\frac{3\times8.854\times10^{-12}\times90}{0.10} = 2.39\times10^{-8}$ C/m².`,
      trap: R`Using only the outside field ($2\varepsilon_0V_0/R$); a surface with fields on both sides carries charge equal to the jump.` },
  ],
  gens: [
    { id: 'bvp-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'superposition',
      make(r) {
        const cube = r() < 0.5, n = cube ? 6 : 4;
        const vs = Array.from({ length: n }, () => int(r, -5, 20) * 5);
        const avg = vs.reduce((a, b) => a + b, 0) / n;
        return { q: cube
          ? `A hollow cube has its six faces insulated from each other and held at $${vs.join('$, $')}$ V. The potential at its centre is ______ V (two decimal places).`
          : `A long square pipe has its four walls insulated from each other and held at $${vs.join('$, $')}$ V. The potential on its axis, far from the ends, is ______ V (two decimal places).`,
          answer: round(avg, 2), tol: 0.01, unit: 'V', vs,
          sol: `Superpose ${n} problems, each with one ${cube ? 'face' : 'wall'} live and the rest at zero. By symmetry each ${cube ? 'face' : 'wall'} contributes $1/${n}$ of its potential at the centre (all ${n} at $V$ would give $V$). So $V_{\\rm centre} = \\frac{${vs.join(' + ')}}{${n}} = ${round(avg, 2)}$ V.`,
          trap: `Each ${cube ? 'face' : 'wall'} contributes exactly $1/${n}$ of its own value at the centre.` };
      },
      verify: (p) => p.vs.reduce((a, b) => a + b, 0) / p.vs.length },
    { id: 'bvp-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'legendre expansion',
      make(r) {
        const a = int(r, 0, 4) * 10, b = int(r, -3, 3) * 10, c = choose(r, [-30, -20, 20, 30, 60]), m = choose(r, [1.5, 2, 3]), th = choose(r, [0, 90]);
        const x = Math.cos(th * deg), P2 = (3 * x * x - 1) / 2, q = 1 / m;
        const V = (a + c / 3) * q + b * q * q * x + (2 * c / 3) * q ** 3 * P2;
        return { q: `A thin spherical surface of radius $R$ is held at $V(\\theta) = ${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}\\cos\\theta ${c < 0 ? '-' : '+'} ${Math.abs(c)}\\cos^2\\theta$ (volts), with no other charges. At $r = ${m}R$, $\\theta = ${th}^\\circ$, the potential is ______ V (two decimal places).`,
          answer: round(V, 2), tol: 0.02, unit: 'V', a, b, c, m, th,
          sol: `Use $\\cos^2\\theta = \\frac{1 + 2P_2}{3}$: $V(R,\\theta) = ${round(a + c / 3, 3)} + ${b}P_1 + ${round(2 * c / 3, 3)}P_2$. Outside each term gains $(R/r)^{l+1}$: $V = ${round(a + c / 3, 3)}\\left(\\frac{1}{${m}}\\right) + ${b}\\left(\\frac{1}{${m}}\\right)^2P_1 + ${round(2 * c / 3, 3)}\\left(\\frac{1}{${m}}\\right)^3P_2$. At $\\theta = ${th}^\\circ$, $P_1 = ${round(x, 3)}$ and $P_2 = ${round(P2, 3)}$, so $V = ${round(V, 2)}$ V.`,
          trap: 'Rewrite $\\cos^2\\theta$ in Legendre polynomials first; it has an $l = 0$ part too.' };
      },
      verify: (p) => { const x = Math.cos(p.th * deg), P2 = (3 * x * x - 1) / 2, q = 1 / p.m; return (p.a + p.c / 3) * q + p.b * q * q * x + (2 * p.c / 3) * q ** 3 * P2; } },
    { id: 'bvp-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cylindrical harmonics',
      make(r) {
        const n = int(r, 1, 4), V0 = int(r, 2, 12) * 10, phi = choose(r, [0, 15, 30, 45, 60]), out = r() < 0.5, f = choose(r, [2, 3, 4]);
        const ratio = out ? 1 / f : 1 / f, V = V0 * ratio ** n * Math.cos(n * phi * deg);
        return { q: `A long thin cylindrical surface of radius $R$ is held at $V(\\phi) = ${V0}\\cos${n === 1 ? '' : n}\\phi$ volts, with no other charge${out ? ', and $V\\to0$ far away' : ''}. At $s = ${out ? `${f}R` : `R/${f}`}$, $\\phi = ${phi}^\\circ$, the potential is ______ V (two decimal places).`,
          answer: round(V, 2), tol: 0.02, unit: 'V', V0, n, phi, f, out,
          sol: `${out ? `Outside, the term regular at infinity is $s^{-${n}}\\cos${n}\\phi$, so $V = V_0(R/s)^{${n}}\\cos${n}\\phi$` : `Inside, the term regular on the axis is $s^{${n}}\\cos${n}\\phi$, so $V = V_0(s/R)^{${n}}\\cos${n}\\phi$`}. Here the ratio is $1/${f}$: $V = ${V0}\\times(1/${f})^{${n}}\\times\\cos${n * phi}^\\circ = ${round(V, 2)}$ V.`,
          trap: `The ${n}-th harmonic carries the ${n}-th power of the radius ratio.` };
      },
      verify: (p) => p.V0 * (1 / p.f) ** p.n * Math.cos(p.n * p.phi * deg) },
  ],
};
