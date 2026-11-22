// Round 5 extras for vector-calculus: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'vc-r5-01', type: 'mcq', level: 2, exams: ['jam'], sub: 'identities',
      q: R`For a smooth scalar field $\phi$, the curl $\nabla\times(\phi\,\nabla\phi)$ equals`,
      options: [R`$\phi\,\nabla^2\phi$`, R`$\vec 0$`, R`$|\nabla\phi|^2$`, R`$2\phi\,\nabla\phi$`], answer: 1,
      sol: R`Use $\nabla\times(f\vec A) = f\,\nabla\times\vec A + \nabla f\times\vec A$ with $f = \phi$ and $\vec A = \nabla\phi$. The first term holds the curl of a gradient, which is zero. The second is $\nabla\phi\times\nabla\phi$, a vector crossed with itself, also zero. So the curl is $\vec 0$. (In fact $\phi\nabla\phi = \nabla(\phi^2/2)$, a gradient.)`,
      trap: R`The first two options are scalars, so they cannot be a curl at all; $2\phi\nabla\phi$ is the gradient of $\phi^2$, not a curl.` },
    { id: 'vc-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'line integrals',
      q: R`The length of one full turn of the helix $x = 3\cos t$, $y = 3\sin t$, $z = 4t$ (from $t = 0$ to $t = 2\pi$) is ______ (two decimal places).`,
      answer: 31.42, tol: 0.02, calc: () => 2 * Math.PI * 5,
      sol: R`Arc length is $\int|\dot{\vec r}|\,dt$. Here $\dot{\vec r} = (-3\sin t, 3\cos t, 4)$, so $|\dot{\vec r}| = \sqrt{9 + 16} = 5$, constant. Length $= 5\times2\pi = 10\pi\approx31.42$.`,
      trap: R`Using only the circle's circumference $6\pi\approx18.85$ ignores the rise of $8\pi$ along $z$.` },
    { id: 'vc-r5-03', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'curvilinear coordinates',
      q: R`In cylindrical coordinates $(s, \varphi, z)$, the Laplacian of $f = s^2\cos2\varphi$ is`,
      options: [R`$4\cos2\varphi$`, R`$-4\cos2\varphi$`, R`$8\cos2\varphi$`, R`$0$`], answer: 3,
      sol: R`$\nabla^2f = \frac1s\partial_s(s\,\partial_sf) + \frac1{s^2}\partial_\varphi^2f$. The radial part: $s\,\partial_sf = 2s^2\cos2\varphi$, and $\frac1s\partial_s$ of that is $4\cos2\varphi$. The angular part: $\frac{1}{s^2}(-4s^2\cos2\varphi) = -4\cos2\varphi$. Sum: 0. Check in Cartesian form: $s^2\cos2\varphi = x^2 - y^2$, whose Laplacian is $2 - 2 = 0$.`,
      trap: R`Keeping only the radial part gives $4\cos2\varphi$; the angular derivative cancels it exactly.` },
    { id: 'vc-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'conservative fields', format: 'statements',
      q: R`For $\vec F = y^2\,\hat i + 2xy\,\hat j$, which statements are true?`,
      options: [R`$\nabla\times\vec F = \vec 0$`, R`$\nabla\cdot\vec F = 0$`, R`$\vec F = \nabla(xy^2)$`, R`The work done by $\vec F$ from $(0, 0, 0)$ to $(1, 2, 0)$ along any path is 4`], answer: [0, 2, 3],
      sol: R`Curl: the $z$-component is $\partial_x(2xy) - \partial_y(y^2) = 2y - 2y = 0$ and nothing depends on $z$, so the curl is zero. Divergence: $\partial_x(y^2) + \partial_y(2xy) = 0 + 2x = 2x$, not zero. Potential: $\nabla(xy^2) = (y^2, 2xy, 0) = \vec F$. Work $= xy^2\big|_{(0,0)}^{(1,2)} = 1\cdot4 = 4$ on every path.`,
      trap: R`Curl-free does not mean divergence-free: this field is a gradient but its divergence is $2x$.` },
    { id: 'vc-r5-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'surface integrals',
      q: R`The area of the part of the plane $z = 2x + 2y$ that lies directly above the unit disc $x^2 + y^2\le1$ is`,
      options: [R`$\pi$`, R`$\sqrt5\,\pi$`, R`$3\pi$`, R`$9\pi$`], answer: 2,
      sol: R`For a surface $z = g(x, y)$, $dS = \sqrt{1 + g_x^2 + g_y^2}\,dA$. Here $g_x = g_y = 2$, so $dS = \sqrt{1 + 4 + 4}\,dA = 3\,dA$. The area is $3\times(\text{area of the unit disc}) = 3\pi$.`,
      trap: R`Using only one slope ($\sqrt{1 + 4} = \sqrt5$) forgets that the plane tilts in both directions; squaring the factor gives $9\pi$.` },
    { id: 'vc-r5-06', type: 'nat', level: 3, exams: ['jam'], sub: 'divergence theorem',
      q: R`The outward flux of $\vec F = y\,\hat i + x\,\hat j + z^2\,\hat k$ through the closed surface of the unit cube $0\le x, y, z\le1$ is ______.`,
      answer: 1, tol: 0, calc: () => 1,
      sol: R`By the divergence theorem the flux is $\int_V\nabla\cdot\vec F\,dV$. $\nabla\cdot\vec F = 0 + 0 + 2z$. So the flux is $\int_0^1\!\!\int_0^1\!\!\int_0^1 2z\,dz\,dy\,dx = 1$. (Directly: only the top face $z = 1$ gives $\int1\,dA = 1$; the bottom has $z^2 = 0$, and the $x$ and $y$ parts cancel between opposite faces.)`,
      trap: R`Counting the $y\,\hat i$ and $x\,\hat j$ parts: each gives equal and opposite flux through opposite faces, so they add nothing.` },
    { id: 'vc-r5-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'stokes theorem',
      q: R`For $\vec F = -yz\,\hat i + xz\,\hat j$, the circulation $\oint\vec F\cdot d\vec l$ round the circle $x^2 + y^2 = 1$ in the plane $z = 3$, anticlockwise seen from above, is`,
      options: [R`$6\pi$`, R`$2\pi$`, R`$3\pi$`, R`$0$`], answer: 0,
      sol: R`On the circle $z = 3$ is constant, so $\vec F\cdot d\vec l = 3(-y\,dx + x\,dy)$, and $\oint(-y\,dx + x\,dy) = 2\times\text{area} = 2\pi$. Circulation $= 6\pi$. Check by Stokes: $\nabla\times\vec F = (-x, -y, 2z)$; through the flat disc at $z = 3$ only the $z$-part counts: $2\cdot3\cdot\pi = 6\pi$.`,
      trap: R`Forgetting the factor $z = 3$ gives $2\pi$; using $\oint x\,dy$ alone (the area) gives $3\pi$.` },
    { id: 'vc-r5-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'divergence theorem',
      q: R`The outward flux of $\vec F = xy^2\,\hat i + x^2y\,\hat j + z\,\hat k$ through the closed surface of the solid cylinder $x^2 + y^2\le1$, $0\le z\le2$ (curved side, top and bottom) is $k\pi$. The value of $k$ is ______.`,
      answer: 3, tol: 0, calc: () => 2 * 2 * (1 / 4 + 1 / 2),
      sol: R`$\nabla\cdot\vec F = y^2 + x^2 + 1 = s^2 + 1$ in cylindrical coordinates. Flux $= \int_0^2dz\int_0^{2\pi}d\varphi\int_0^1(s^2 + 1)\,s\,ds = 2\cdot2\pi\cdot\left(\tfrac14 + \tfrac12\right) = 3\pi$. So $k = 3$.`,
      trap: R`Dropping the Jacobian $s$ in $dV = s\,ds\,d\varphi\,dz$ gives $2\cdot2\pi\cdot\tfrac43$, which is not $3\pi$.` },
    { id: 'vc-r5-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'identities',
      q: R`$\vec a$ is a constant vector and $\vec r = x\hat i + y\hat j + z\hat k$. For $\vec F = (\vec a\cdot\vec r)\,\vec r$, which statements are true?`,
      options: [R`$\nabla\cdot\vec F = 4\,\vec a\cdot\vec r$`, R`$\nabla\times\vec F = \vec a\times\vec r$`, R`$\nabla\times\vec F = \vec 0$`, R`$\nabla\cdot\vec F = 3\,\vec a\cdot\vec r$`], answer: [0, 1],
      sol: R`With $f = \vec a\cdot\vec r$ (so $\nabla f = \vec a$): $\nabla\cdot(f\vec r) = f\,\nabla\cdot\vec r + \vec r\cdot\nabla f = 3f + \vec a\cdot\vec r = 4\,\vec a\cdot\vec r$. And $\nabla\times(f\vec r) = f\,\nabla\times\vec r + \nabla f\times\vec r = 0 + \vec a\times\vec r$. That is not zero unless $\vec r\parallel\vec a$.`,
      trap: R`$3\,\vec a\cdot\vec r$ keeps only $f\,\nabla\cdot\vec r$ and forgets the $\vec r\cdot\nabla f$ term.` },
    { id: 'vc-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'helmholtz theorem',
      q: R`A smooth vector field $\vec F$ on all of space has $\nabla\cdot\vec F = 0$ and $\nabla\times\vec F = \vec 0$ everywhere, and $|\vec F|\to0$ as $r\to\infty$. Then $\vec F$`,
      options: [R`can be any gradient of a harmonic function`, R`must be $\hat r/r^2$ times a constant`, R`must be a non-zero constant vector`, R`must be identically zero`], answer: 3,
      sol: R`Zero curl on all of space makes $\vec F = \nabla\phi$; zero divergence then gives $\nabla^2\phi = 0$. Each Cartesian component $F_x = \partial_x\phi$ is then harmonic too. A harmonic function on all of space that is bounded is constant (Liouville), and it tends to 0, so the constant is 0. Hence $\vec F\equiv\vec 0$: this is the uniqueness half of Helmholtz's theorem.`,
      trap: R`$\hat r/r^2$ has zero divergence only away from the origin; at the origin it has a delta-function source, so it is not allowed here.` },
  ],
  gens: [
    { id: 'vc-r5g1', type: 'nat', level: 2, exams: ['jam'], sub: 'line integrals',
      make(r) {
        const [a, b] = choose(r, [[3, 4], [4, 3], [5, 12], [6, 8], [8, 6], [1, 1], [2, 1], [1, 2]]), n = int(r, 1, 3);
        const sp = Math.hypot(a, b), v = 2 * Math.PI * n * sp;
        return { q: R`The length of the helix $x = ${a}\cos t$, $y = ${a}\sin t$, $z = ${b}t$ from $t = 0$ to $t = ${2 * n}\pi$ is ______ (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.02, round(v * 0.002, 2)), a, b, n,
          sol: R`Arc length $= \int|\dot{\vec r}|\,dt$ with $\dot{\vec r} = (-${a}\sin t, ${a}\cos t, ${b})$, so $|\dot{\vec r}| = \sqrt{${a * a} + ${b * b}} = ${round(sp, 4)}$, a constant. Length $= ${round(sp, 4)}\times${2 * n}\pi\approx${round(v, 2)}$.`,
          trap: R`Taking only the circular part ($${2 * n}\pi\times${a}$) leaves out the climb along $z$.` };
      },
      verify: (p) => simpson((t) => Math.hypot(p.a * Math.sin(t), p.a * Math.cos(t), p.b), 0, 2 * Math.PI * p.n) },
    { id: 'vc-r5g2', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'curvilinear coordinates',
      make(r) {
        const n = int(r, 1, 4), m0 = int(r, 1, 3), m = m0 === n ? m0 + 1 : m0;
        const pw = (k) => (k === 0 ? '' : k === 1 ? 's' : `s^{${k}}`);
        const cs = `\\cos${m === 1 ? '' : m}\\varphi`;
        const show = (k) => (k === 0 ? '$0$' : `$${k}\\,${pw(n - 2)}${cs}$`);
        const o = mcqOptions(r, n * n - m * m, [n * n, n * (n - 1), n * n + m * m, -m * m], show);
        return { q: R`In cylindrical coordinates $(s, \varphi, z)$ with $s > 0$, the Laplacian of $${pw(n)}${cs}$ is`, ...o,
          sol: R`$\nabla^2f = \frac1s\partial_s(s\,\partial_sf) + \frac1{s^2}\partial_\varphi^2f$. For $f = s^{${n}}${cs}$: the radial part is $${n}^2s^{${n - 2}}${cs} = ${n * n}\,${pw(n - 2) || '1\\cdot'}${cs}$; the angular part is $-${m * m}\,${pw(n - 2) || '1\\cdot'}${cs}$. Total $(${n * n} - ${m * m})${pw(n - 2)}${cs} = ${n * n - m * m}${pw(n - 2)}${cs}$. In general $\nabla^2(s^n\cos m\varphi) = (n^2 - m^2)s^{n-2}\cos m\varphi$, zero only when $n = \pm m$.`,
          trap: 'Keeping only the radial part gives $n^2s^{n-2}$; the angular second derivative subtracts $m^2s^{n-2}$.' };
      } },
    { id: 'vc-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'divergence theorem',
      make(r) {
        const Rr = int(r, 1, 3), H = int(r, 1, 4), c = int(r, 1, 4);
        const v = Math.PI * H * (Rr ** 4 / 2 + c * Rr * Rr);
        return { q: R`The outward flux of $\vec F = xy^2\,\hat i + x^2y\,\hat j + ${c === 1 ? '' : c}z\,\hat k$ through the whole closed surface of the solid cylinder $x^2 + y^2\le${Rr * Rr}$, $0\le z\le${H}$ is ______ (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.02, round(v * 0.003, 2)), Rr, H, c,
          sol: R`Divergence theorem: $\nabla\cdot\vec F = y^2 + x^2 + ${c} = s^2 + ${c}$. Flux $= \int_0^{${H}}dz\int_0^{2\pi}d\varphi\int_0^{${Rr}}(s^2 + ${c})\,s\,ds = 2\pi\cdot${H}\left(\frac{${Rr}^4}{4} + \frac{${c}\cdot${Rr}^2}{2}\right) = \pi\cdot${H}\left(${Rr ** 4 / 2} + ${c * Rr * Rr}\right)\approx${round(v, 2)}$.`,
          trap: 'Leaving out the Jacobian $s$ in $dV = s\\,ds\\,d\\varphi\\,dz$, or using radius$^2$ in place of the radius.' };
      },
      verify: (p) => 2 * Math.PI * p.H * simpson((s) => (s * s + p.c) * s, 0, p.Rr) },
  ],
};
