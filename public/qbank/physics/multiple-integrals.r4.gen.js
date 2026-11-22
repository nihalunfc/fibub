// Round 4 extras for multiple-integrals: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const lin = (p, q, x = 'x', y = 'y') => { // p x + q y as TeX
  const t = (c, v) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
  return q === 0 ? t(p, x) : `${t(p, x)} ${q < 0 ? '-' : '+'} ${Math.abs(q) === 1 ? y : Math.abs(q) + y}`;
};

export default {
  items: [
    { id: 'mi-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'iterated integrals',
      q: R`The value of $\displaystyle\int_0^1\!\!\int_0^1e^{x + y}\,dx\,dy$ is`,
      options: [R`$e - 1$`, R`$e^2$`, R`$2(e - 1)$`, R`$(e - 1)^2$`], answer: 3,
      sol: R`$e^{x + y} = e^xe^y$ and the limits are constants, so the double integral splits into a product: $\left(\int_0^1e^xdx\right)\left(\int_0^1e^ydy\right) = (e - 1)^2 \approx 2.95$.`,
      trap: R`A product of two equal integrals is a square, not twice the integral.` },
    { id: 'mi-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'moment of inertia',
      q: R`A thin uniform square plate of mass 3 kg and side 0.2 m spins about the axis through its centre perpendicular to its face. Its moment of inertia is ______ kg m².`,
      answer: 0.02, tol: 0.0002, unit: 'kg m²', calc: () => 3 * 0.04 / 6,
      sol: R`With the centre at the origin, $I = \sigma\displaystyle\iint(x^2 + y^2)\,dA$ over $|x|, |y| \le a/2$. Each term gives $\sigma\cdot a\cdot\dfrac{a^3}{12}$, so $I = \sigma\dfrac{a^4}{6} = \dfrac{Ma^2}{6} = \dfrac{3\times0.04}{6} = 0.02$ kg m².`,
      trap: R`$Ma^2/12$ is about an axis in the plane through the centre; the perpendicular axis adds both.` },
    { id: 'mi-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'polar coordinates',
      q: R`The area of the region $1 \le x^2 + y^2 \le 4$, $x \ge 0$, $y \ge 0$, found as $\displaystyle\int_0^{\pi/2}\!\!\int_1^2r\,dr\,d\theta$, is`,
      options: [R`$\dfrac{3\pi}{4}$`, R`$\dfrac{\pi}{2}$`, R`$\dfrac{3\pi}{2}$`, R`$3\pi$`], answer: 0,
      sol: R`$\displaystyle\int_1^2r\,dr = \dfrac{4 - 1}{2} = \dfrac32$, times $\dfrac\pi2$ for the angle: $\dfrac{3\pi}{4}$. Check: a quarter of the annulus area $\pi(4 - 1)$.`,
      trap: R`Forgetting the factor $r$ in $dA = r\,dr\,d\theta$ gives $\pi/2$.` },
    { id: 'mi-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'centre of mass', format: 'statements',
      q: R`A uniform lamina fills the triangle with corners $(0, 0)$, $(2, 0)$ and $(0, 2)$. Which statements are true?`,
      options: [R`Its area is 2`, R`Its centre of mass is at $(\tfrac23, \tfrac23)$`, R`$\displaystyle\iint x\,dA = \tfrac43$`, R`$\displaystyle\iint y^2\,dA = \tfrac23$`], answer: [0, 1, 2],
      sol: R`Area $\tfrac12\cdot2\cdot2 = 2$. $\iint x\,dA = \int_0^2x(2 - x)\,dx = 4 - \tfrac83 = \tfrac43$, so $\bar x = \tfrac{4/3}{2} = \tfrac23$, and $\bar y = \tfrac23$ by symmetry (the average of the corners). $\iint y^2\,dA = \int_0^2y^2(2 - y)\,dy = \tfrac{16}{3} - 4 = \tfrac43$, not $\tfrac23$.`,
      trap: R`The centroid of a triangle is the mean of its corners, not the midpoint of the hypotenuse.` },
    { id: 'mi-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'Jacobians',
      q: R`The parallelogram bounded by the lines $x + y = 0$, $x + y = 1$, $x - 2y = 0$ and $x - 2y = 3$ has area`,
      options: [R`$3$`, R`$1$`, R`$\dfrac13$`, R`$9$`], answer: 1,
      sol: R`Let $u = x + y$ (from 0 to 1) and $v = x - 2y$ (from 0 to 3). $\dfrac{\partial(u, v)}{\partial(x, y)} = \begin{vmatrix}1 & 1\\ 1 & -2\end{vmatrix} = -3$, so $dx\,dy = \tfrac13\,du\,dv$ and the area is $\tfrac13\cdot1\cdot3 = 1$.`,
      trap: R`$dx\,dy$ uses the reciprocal of $\partial(u, v)/\partial(x, y)$; multiplying by 3 gives 9.` },
    { id: 'mi-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'polar coordinates',
      q: R`The area enclosed by the cardioid $r = 1 + \cos\theta$ is ______ (to three decimal places).`,
      answer: 4.712, tol: 0.003, calc: () => 1.5 * Math.PI,
      sol: R`$A = \dfrac12\displaystyle\int_0^{2\pi}(1 + \cos\theta)^2d\theta = \dfrac12\int_0^{2\pi}\left(1 + 2\cos\theta + \cos^2\theta\right)d\theta = \dfrac12(2\pi + 0 + \pi) = \dfrac{3\pi}{2} = 4.712$.`,
      trap: R`The mean of $\cos^2\theta$ is $\tfrac12$, so it contributes $\pi$, not $2\pi$.` },
    { id: 'mi-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'fields from integrals',
      q: R`A solid ball carries a uniform charge density. The electrostatic potential (zero at infinity) at its centre is ______ times the potential at its surface.`,
      answer: 1.5, tol: 0.001, calc: () => 3 / 2,
      sol: R`Build the ball from shells: a shell of radius $r$ contributes $\dfrac{\rho\,4\pi r^2dr}{4\pi\varepsilon_0r}$ at the centre, so $V(0) = \dfrac{\rho}{\varepsilon_0}\displaystyle\int_0^Rr\,dr = \dfrac{\rho R^2}{2\varepsilon_0}$. At the surface, $V(R) = \dfrac{Q}{4\pi\varepsilon_0R} = \dfrac{\rho R^2}{3\varepsilon_0}$. Ratio $\tfrac32$.`,
      trap: R`Each shell gives a constant potential inside it, $q/4\pi\varepsilon_0r$ with its own $r$, not $q/4\pi\varepsilon_0R$.` },
    { id: 'mi-r4-08', type: 'mcq', level: 4, exams: ['gate'], sub: 'volumes',
      q: R`Slicing along the fourth coordinate $w$, the "volume" of the four-dimensional unit ball $x^2 + y^2 + z^2 + w^2 \le 1$ is $\displaystyle\int_{-1}^{1}\tfrac43\pi(1 - w^2)^{3/2}dw$, which equals`,
      options: [R`$\dfrac{4\pi}{3}$`, R`$\pi^2$`, R`$\dfrac{\pi^2}{2}$`, R`$\dfrac{8\pi^2}{15}$`], answer: 2,
      sol: R`Each slice at height $w$ is a 3D ball of radius $\sqrt{1 - w^2}$. With $w = \sin t$, $\displaystyle\int_{-1}^1(1 - w^2)^{3/2}dw = \int_{-\pi/2}^{\pi/2}\cos^4t\,dt = \dfrac{3\pi}{8}$. So the volume is $\dfrac{4\pi}{3}\cdot\dfrac{3\pi}{8} = \dfrac{\pi^2}{2} \approx 4.93$. ($8\pi^2/15$ is the 5D ball.)`,
      trap: R`The slice is a ball of radius $\sqrt{1 - w^2}$, so its volume has the power $3/2$, not 3.` },
    { id: 'mi-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'improper integrals', format: 'statements',
      q: R`With $r$ the distance from the origin, which of these improper integrals converge?`,
      options: [R`$\displaystyle\iint_{r\le1}\frac{dA}{r}$ (a disc in the plane)`, R`$\displaystyle\iint_{r\le1}\frac{dA}{r^2}$ (a disc in the plane)`, R`$\displaystyle\iiint_{r\le1}\frac{dV}{r^2}$ (a ball in space)`, R`$\displaystyle\iint_{r\ge1}\frac{dA}{r^3}$ (the plane outside the unit circle)`], answer: [0, 2, 3],
      sol: R`In the plane $dA = 2\pi r\,dr$ (after the angle), in space $dV = 4\pi r^2dr$. Then: $\int_0^1r^{-1}\,r\,dr = 1$, converges ($2\pi$). $\int_0^1r^{-2}\,r\,dr = \int dr/r$ diverges. $\int_0^1r^{-2}\,r^2dr = 1$, converges ($4\pi$). $\int_1^\infty r^{-3}\,r\,dr = 1$, converges ($2\pi$). Rule: near the origin $r^{-p}$ is integrable if $p$ is less than the dimension; far away if $p$ is greater.`,
      trap: R`The Jacobian $r^{n-1}$ softens the singularity; count the dimension.` },
    { id: 'mi-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'changing the order',
      q: R`The value of $\displaystyle\int_0^1\!\!\int_0^1x^y\,dx\,dy$ is ______ (to three decimal places).`,
      answer: 0.693, tol: 0.002, calc: () => Math.LN2,
      sol: R`Do the $x$ integral first: $\displaystyle\int_0^1x^y\,dx = \frac{1}{y + 1}$. Then $\displaystyle\int_0^1\frac{dy}{1 + y} = \ln2 = 0.693$. (Integrating over $y$ first gives $\int_0^1\frac{x - 1}{\ln x}dx$, which is much harder; choosing the order is the whole trick.)`,
      trap: R`$x^y$ is a power in $x$ but an exponential in $y$; integrate in $x$ first.` },
  ],
  gens: [
    { id: 'mi-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'moment of inertia',
      make(r) {
        const M = int(r, 1, 20), a = pick(r, 0.5, 3, 0.5), b = pick(r, 0.5, 3, 0.5), c = pick(r, 0.5, 3, 0.5), ax = choose(r, ['x', 'y', 'z']);
        const [p, q] = ax === 'x' ? [b, c] : ax === 'y' ? [a, c] : [a, b];
        const answer = round(M * (p * p + q * q) / 5, 4);
        return { q: R`A uniform solid ellipsoid $\dfrac{x^2}{${a}^2} + \dfrac{y^2}{${b}^2} + \dfrac{z^2}{${c}^2} \le 1$ (lengths in m) has mass ${M} kg. Find its moment of inertia about the $${ax}$-axis in kg m².`,
          answer, tol: Math.max(0.001, answer * 0.002), unit: 'kg m²', M, p, qq: q,
          sol: R`Put $x = au$, $y = bv$, $z = cw$: the ellipsoid becomes the unit ball and $dV = abc\,du\,dv\,dw$. Over a ball each of $u^2, v^2, w^2$ averages to $\tfrac15$, so $\overline{x^2} = a^2/5$ and so on. About the $${ax}$-axis, $I = M\left(\overline{${ax === 'x' ? 'y' : 'x'}^2} + \overline{${ax === 'z' ? 'y' : 'z'}^2}\right) = \dfrac{${M}(${p}^2 + ${q}^2)}{5} = ${answer}$ kg m².`,
          trap: 'The axis length itself does not enter the moment about that axis.' };
      },
      verify: (p) => p.M * (p.p ** 2 + p.qq ** 2) / 5 },
    { id: 'mi-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'polar coordinates',
      make(r) {
        const b = int(r, 1, 4), a = b + int(r, 0, 3), fn = choose(r, ['\\cos', '\\sin']);
        const answer = round(Math.PI * (a * a + b * b / 2), 3);
        return { q: R`Find the area enclosed by the curve $r = ${a} + ${b === 1 ? '' : b}${fn}\theta$ (to three decimal places).`,
          answer, tol: Math.max(0.002, answer * 0.001), a, b,
          sol: R`$A = \dfrac12\displaystyle\int_0^{2\pi}(${a} + ${b}${fn}\theta)^2d\theta$. The cross term integrates to zero and $${fn}^2\theta$ averages to $\tfrac12$: $A = \dfrac12\left(2\pi\cdot${a * a} + \pi\cdot${b * b}\right) = \pi\left(${a * a} + \tfrac{${b * b}}{2}\right) = ${answer}$.`,
          trap: 'The square of $\\cos\\theta$ contributes $\\pi$ over a full turn, not $2\\pi$.' };
      },
      verify: (p) => { let s = 0; const n = 4000; for (let i = 0; i < n; i++) { const t = (i + 0.5) * 2 * Math.PI / n; s += (p.a + p.b * Math.cos(t)) ** 2; } return 0.5 * s * 2 * Math.PI / n; } },
    { id: 'mi-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'Jacobians',
      make(r) {
        const [p, q, s, t] = choose(r, [[1, 1, 1, -1], [1, 2, 3, -1], [2, 1, 1, -2], [1, -1, 1, 2], [3, 1, 1, 1], [2, -1, 1, 3], [1, 3, 2, 1], [1, 1, 1, -3]]);
        const du = int(r, 1, 5), dv = int(r, 1, 5), u0 = int(r, -2, 2), v0 = int(r, -2, 2), J = Math.abs(p * t - q * s);
        const answer = round(du * dv / J, 4);
        return { q: R`Find the area of the parallelogram bounded by the lines $${lin(p, q)} = ${u0}$, $${lin(p, q)} = ${u0 + du}$, $${lin(s, t)} = ${v0}$ and $${lin(s, t)} = ${v0 + dv}$ (to four decimal places).`,
          answer, tol: 0.0005, du, dv, J,
          sol: R`Let $u = ${lin(p, q)}$ and $v = ${lin(s, t)}$. Then $\left|\dfrac{\partial(u, v)}{\partial(x, y)}\right| = |${p}\cdot${t < 0 ? `(${t})` : t} - ${q < 0 ? `(${q})` : q}\cdot${s}| = ${J}$, so $dx\,dy = \tfrac1{${J}}du\,dv$, and the area is $\dfrac{${du}\times${dv}}{${J}} = ${answer}$.`,
          trap: 'Divide by the Jacobian of $(u, v)$ with respect to $(x, y)$; do not multiply.' };
      },
      verify: (p) => p.du * p.dv / p.J },
  ],
};
