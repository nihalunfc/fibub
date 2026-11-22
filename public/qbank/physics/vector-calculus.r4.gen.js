// Round 4 extras for vector-calculus: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'vc-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'identities',
      q: R`$\phi$ is a scalar field and $\vec F$ a vector field. Which expression has NO meaning?`,
      options: [R`$\nabla\cdot(\nabla\phi)$`, R`$\nabla\times(\nabla\cdot\vec F)$`, R`$\nabla(\nabla\cdot\vec F)$`, R`$\nabla\cdot(\nabla\times\vec F)$`], answer: 1,
      sol: R`Keep track of what each operation needs and gives. $\nabla\phi$ is a vector, so its divergence is fine (the Laplacian). $\nabla\cdot\vec F$ is a scalar: its gradient is fine, but the curl acts only on vectors, so $\nabla\times(\nabla\cdot\vec F)$ means nothing. $\nabla\times\vec F$ is a vector, so its divergence is fine (and always zero).`,
      trap: R`$\nabla(\nabla\cdot\vec F)$ looks odd but is a perfectly good vector; it appears in $\nabla\times(\nabla\times\vec F) = \nabla(\nabla\cdot\vec F) - \nabla^2\vec F$.` },
    { id: 'vc-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'laplacian',
      q: R`For $\phi = x^2y^3 - z^2$, the value of $\nabla^2\phi$ at the point $(2, 1, 5)$ is ______.`,
      answer: 24, tol: 0, calc: () => 2 * 1 ** 3 + 6 * 2 ** 2 * 1 - 2,
      sol: R`$\nabla^2\phi = \partial_x^2\phi + \partial_y^2\phi + \partial_z^2\phi = 2y^3 + 6x^2y - 2$. At $(2, 1, 5)$: $2 + 24 - 2 = 24$. The value of $z$ does not enter.`,
      trap: R`Plugging $z = 5$ into $-z^2$ instead of differentiating it twice gives a large negative number.` },
    { id: 'vc-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'line integrals',
      q: R`A particle moves along the curve $x = t^2$, $y = 2\sin(\pi t/2)$, $z = 3t^3$ from $t = 0$ to $t = 1$. The value of $\displaystyle\int\nabla(x^2 + yz)\cdot d\vec l$ along it is`,
      options: [R`$6$`, R`$1$`, R`$7$`, R`It cannot be found without parametrising the integrand`], answer: 2,
      sol: R`For a gradient, $\int_a^b\nabla f\cdot d\vec l = f(b) - f(a)$ on any path. The curve runs from $(0, 0, 0)$ to $(1, 2, 3)$, so the answer is $(1 + 2\cdot3) - 0 = 7$.`,
      trap: R`The curvy path is a decoy: only the end points matter for the gradient of a single-valued function.` },
    { id: 'vc-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'green theorem',
      q: R`The value of $\oint(xy\,dx + x^2\,dy)$ taken anticlockwise round the square with corners $(0,0)$, $(1,0)$, $(1,1)$, $(0,1)$ is ______ (one decimal place).`,
      answer: 0.5, tol: 0.01, calc: () => 0.5,
      sol: R`Green's theorem: $\oint(P\,dx + Q\,dy) = \iint(\partial_xQ - \partial_yP)\,dA = \iint(2x - x)\,dA = \int_0^1\!\!\int_0^1x\,dx\,dy = \tfrac12$. Check side by side: the bottom ($y = 0$) and left ($x = 0$) give 0; the right side ($x = 1$, $y$ from 0 to 1) gives $\int dy = 1$; the top ($y = 1$, $x$ from 1 to 0) gives $\int_1^0x\,dx = -\tfrac12$. Total $\tfrac12$.`,
      trap: R`Using $\partial_yP - \partial_xQ$ (the wrong order) gives $-\tfrac12$.` },
    { id: 'vc-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'curvilinear coordinates',
      q: R`In spherical polar coordinates, the gradient of $\phi = \dfrac{\cos\theta}{r^2}$ is`,
      options: [R`$-\dfrac{2\cos\theta\,\hat r + \sin\theta\,\hat\theta}{r^3}$`, R`$-\dfrac{2\cos\theta\,\hat r - \sin\theta\,\hat\theta}{r^3}$`, R`$-\dfrac{2\cos\theta}{r^3}\hat r - \dfrac{\sin\theta}{r^2}\hat\theta$`, R`$\dfrac{2\cos\theta\,\hat r + \sin\theta\,\hat\theta}{r^3}$`], answer: 0,
      sol: R`$\nabla\phi = \partial_r\phi\,\hat r + \frac1r\partial_\theta\phi\,\hat\theta + \frac{1}{r\sin\theta}\partial_\phi\phi\,\hat\phi$. Here $\partial_r\phi = -2\cos\theta/r^3$ and $\frac1r\partial_\theta\phi = -\sin\theta/r^3$, with no $\phi$-dependence. So $\nabla\phi = -(2\cos\theta\,\hat r + \sin\theta\,\hat\theta)/r^3$; minus this is the familiar dipole field shape.`,
      trap: R`Forgetting the $1/r$ in front of $\partial_\theta$ leaves a $\hat\theta$ term that falls only as $1/r^2$, which is not even dimensionally consistent with the $\hat r$ term.` },
    { id: 'vc-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'divergence and curl', format: 'statements',
      q: R`For $\vec F = x\,\hat i - y\,\hat j$, which statements are true?`,
      options: [R`$\nabla\cdot\vec F = 0$`, R`$\nabla\times\vec F = \vec 0$`, R`The field lines are circles round the $z$-axis`, R`$\vec F = \nabla\times\vec A$ with $\vec A = xy\,\hat k$`], answer: [0, 1, 3],
      sol: R`Divergence: $1 - 1 = 0$. Curl: the only possible component is $\partial_xF_y - \partial_yF_x = 0 - 0 = 0$ (and $F$ has no $z$-dependence). Field lines obey $dx/x = dy/(-y)$, so $xy$ is constant along them: hyperbolas, not circles. For $\vec A = xy\,\hat k$: $\nabla\times\vec A = (\partial_yA_z, -\partial_xA_z, 0) = (x, -y, 0) = \vec F$. So the field is both a gradient (of $\tfrac12(x^2 - y^2)$) and a curl.`,
      trap: R`Zero divergence and zero curl do not make a field trivial; this saddle-shaped flow has both.` },
    { id: 'vc-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'divergence theorem',
      q: R`A solid cone has its apex at the origin, its axis along $+z$, height 2 and a flat circular top of radius 1 in the plane $z = 2$. The outward flux of $\vec r = x\hat i + y\hat j + z\hat k$ through the slanted (curved) side ONLY is`,
      options: [R`$2\pi$`, R`$\tfrac{2\pi}{3}$`, R`$4\pi$`, R`$0$`], answer: 3,
      sol: R`Every point of the slanted side lies on a straight line through the apex, and $\vec r$ points along that line, so $\vec r$ lies in the surface: $\vec r\cdot\hat n = 0$ there and the flux is 0. Check with the divergence theorem: total flux $= \int3\,dV = 3\cdot\tfrac13\pi(1)^2(2) = 2\pi$. The top face has $\hat n = \hat k$, $\vec r\cdot\hat n = z = 2$, area $\pi$: flux $2\pi$. So the side carries $2\pi - 2\pi = 0$.`,
      trap: R`Quoting the total $2\pi$ forgets that the flat top is part of the closed surface.` },
    { id: 'vc-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stokes theorem',
      q: R`For $\vec F = z\,\hat i + x\,\hat j + y\,\hat k$, the flux of $\nabla\times\vec F$ upward through the part of the paraboloid $z = 4 - x^2 - y^2$ with $z\ge0$ is $k\pi$. The value of $k$ is ______.`,
      answer: 4, tol: 0, calc: () => 2 * 2,
      sol: R`By Stokes, the flux equals the circulation round the rim, the circle $x^2 + y^2 = 4$ in the plane $z = 0$, taken anticlockwise seen from above. There $z = 0$ and $dz = 0$, so $\vec F\cdot d\vec l = x\,dy$, and $\oint x\,dy$ is the enclosed area $4\pi$. So $k = 4$. Check: $\nabla\times\vec F = (1, 1, 1)$; any surface with the same rim gives the same flux, e.g. the flat disc: $(1,1,1)\cdot\hat k\times4\pi = 4\pi$.`,
      trap: R`Parametrising the paraboloid directly works but is long; the rim, or the flat disc with the same rim, gives it in one line.` },
    { id: 'vc-r4-09', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'identities',
      q: R`For smooth scalar fields $\phi$ and $\psi$, the divergence $\nabla\cdot(\nabla\phi\times\nabla\psi)$ equals`,
      options: [R`$0$`, R`$\nabla^2\phi\,\nabla^2\psi$`, R`$\nabla\phi\cdot\nabla\psi$`, R`$\phi\nabla^2\psi - \psi\nabla^2\phi$`], answer: 0,
      sol: R`Use $\nabla\cdot(\vec A\times\vec B) = \vec B\cdot(\nabla\times\vec A) - \vec A\cdot(\nabla\times\vec B)$ with $\vec A = \nabla\phi$, $\vec B = \nabla\psi$. Both curls are curls of gradients, so both vanish and the result is 0. (So $\nabla\phi\times\nabla\psi$ is always solenoidal.)`,
      trap: R`$\phi\nabla^2\psi - \psi\nabla^2\phi$ is the divergence of $\phi\nabla\psi - \psi\nabla\phi$ (Green's second identity), a different vector.` },
    { id: 'vc-r4-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'solid angle',
      q: R`A point charge sits at the origin. The flux of $\vec F = \hat r/r^2$ through the flat disc of radius $\sqrt3$ in the plane $z = 1$, centred on the $z$-axis (normal along $+z$), is ______ (two decimal places).`,
      answer: 3.14, tol: 0.01, calc: () => 2 * Math.PI * (1 - 1 / 2),
      sol: R`The flux of $\hat r/r^2$ through a surface is the solid angle it subtends at the origin. The disc is seen within a cone of half-angle $\alpha$ with $\tan\alpha = \sqrt3$, so $\alpha = 60^\circ$. Solid angle $= 2\pi(1 - \cos\alpha) = 2\pi\cdot\tfrac12 = \pi\approx3.14$. (Direct: $\int_0^{\sqrt3}\frac{1}{(s^2 + 1)^{3/2}}\,2\pi s\,ds = 2\pi\left[1 - \tfrac12\right]$.)`,
      trap: R`Using $(\text{area})/r^2 = 3\pi/1$ treats the disc as if every point were at distance 1 and facing the charge.` },
    { id: 'vc-r4-11', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'curvilinear coordinates',
      q: R`In cylindrical coordinates ($s$ = distance from the $z$-axis, $s > 0$), $\nabla^2\!\left(\dfrac1s\right)$ equals`,
      options: [R`$0$`, R`$\dfrac{1}{s^3}$`, R`$-\dfrac{1}{s^3}$`, R`$\dfrac{2}{s^3}$`], answer: 1,
      sol: R`For a function of $s$ only, $\nabla^2f = \frac1s\frac{d}{ds}\left(s\frac{df}{ds}\right)$. With $f = 1/s$: $s\,f' = -1/s$, its derivative is $1/s^2$, and dividing by $s$ gives $1/s^3$. The harmonic function in this geometry is $\ln s$, not $1/s$.`,
      trap: R`$1/r$ is harmonic in spherical coordinates; carrying that over to $1/s$ in cylindrical coordinates gives the wrong answer 0.` },
    { id: 'vc-r4-12', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'conservative fields', format: 'statements',
      q: R`Let $\vec F = \dfrac{-y\,\hat i + x\,\hat j}{x^2 + y^2}$ on all of space except the $z$-axis. Which statements are true?`,
      options: [R`$\nabla\times\vec F = \vec 0$ at every point off the $z$-axis`, R`$\vec F$ is the gradient of a single-valued smooth function on this region`, R`The circulation round any closed loop that does not wind round the $z$-axis is 0`, R`The circulation round the circle $x^2 + y^2 = 4$, $z = 7$, traversed twice anticlockwise, is $8\pi$`], answer: [0, 2],
      sol: R`Off the axis, $\partial_xF_y = \frac{y^2 - x^2}{(x^2 + y^2)^2} = \partial_yF_x$, so the curl is zero; indeed $\vec F = \nabla\varphi$ locally, with $\varphi$ the azimuthal angle, so the curl is zero. But $\varphi$ jumps by $2\pi$ round the axis, so it is not single-valued: one turn round the axis gives circulation $2\pi$ for every radius and height. A loop that does not wind round the axis can be shrunk to a point inside the region, giving 0. Two turns give $4\pi$, not $8\pi$; the radius 2 does not matter.`,
      trap: R`Scaling the circulation with the radius: $F\propto1/s$ while the path length $\propto s$, so they cancel.` },
    { id: 'vc-r4-13', type: 'mcq', level: 2, exams: ['jam'], sub: 'curvilinear coordinates',
      q: R`In spherical polar coordinates, the derivative $\dfrac{\partial\hat r}{\partial\theta}$ of the radial unit vector is`,
      options: [R`$\hat\phi$`, R`$-\hat\theta$`, R`$\hat\theta$`, R`$\vec 0$`], answer: 2,
      sol: R`$\hat r = (\sin\theta\cos\phi, \sin\theta\sin\phi, \cos\theta)$. Differentiating in $\theta$: $(\cos\theta\cos\phi, \cos\theta\sin\phi, -\sin\theta) = \hat\theta$. Moving towards larger $\theta$ tips $\hat r$ in the direction of $\hat\theta$.`,
      trap: R`Treating the curvilinear unit vectors as constants (answer 0) is the root of many wrong divergences and Laplacians.` },
    { id: 'vc-r4-14', type: 'nat', level: 3, exams: ['jam'], sub: 'volume integrals',
      q: R`The value of $\displaystyle\int_V z^2\,dV$ over the solid ball $x^2 + y^2 + z^2\le1$ is ______ (three decimal places).`,
      answer: 0.838, tol: 0.002, calc: () => 4 * Math.PI / 15,
      sol: R`In spherical coordinates $z = r\cos\theta$ and $dV = r^2\sin\theta\,dr\,d\theta\,d\phi$: $\int_0^1r^4dr\int_0^\pi\cos^2\theta\sin\theta\,d\theta\int_0^{2\pi}d\phi = \tfrac15\cdot\tfrac23\cdot2\pi = \tfrac{4\pi}{15}\approx0.838$. Symmetry check: $\int(x^2 + y^2 + z^2)dV = \int_0^1r^2\,4\pi r^2dr = \tfrac{4\pi}5$, and each of the three squares gets a third.`,
      trap: R`Dropping the $r^2\sin\theta$ in the volume element.` },
    { id: 'vc-r4-15', type: 'mcq', level: 2, exams: ['jam'], sub: 'gradient',
      q: R`The greatest rate of increase of $\phi = x^2 + 2y^2 + 3z^2$ at the point $(1, 1, 1)$ is`,
      options: [R`$12$`, R`$\sqrt{14}$`, R`$6$`, R`$2\sqrt{14}$`], answer: 3,
      sol: R`The directional derivative is largest along $\nabla\phi$ and then equals $|\nabla\phi|$. Here $\nabla\phi = (2x, 4y, 6z) = (2, 4, 6)$, with length $\sqrt{4 + 16 + 36} = \sqrt{56} = 2\sqrt{14}\approx7.48$.`,
      trap: R`Adding the components (12) instead of taking the length of the gradient.` },
    { id: 'vc-r4-16', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      q: R`Which of these fields can be written as $\nabla\times\vec A$ for some smooth $\vec A$ on all of space?`,
      options: [R`$y\,\hat i + z\,\hat j + x\,\hat k$`, R`$x\,\hat i + y\,\hat j + z\,\hat k$`, R`$x\,\hat i + y\,\hat j - 2z\,\hat k$`, R`$x^2\,\hat i + y^2\,\hat j + z^2\,\hat k$`], answer: [0, 2],
      sol: R`On all of space a smooth field is a curl exactly when its divergence is zero everywhere. Divergences: $(y, z, x)$ gives $0$; $(x, y, z)$ gives 3; $(x, y, -2z)$ gives $1 + 1 - 2 = 0$; $(x^2, y^2, z^2)$ gives $2(x + y + z)$, not zero in general. So the first and third.`,
      trap: R`Testing the curl instead of the divergence: being a curl needs zero divergence, being a gradient needs zero curl.` },
    { id: 'vc-r4-17', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'line integrals',
      q: R`For $\vec F = -y\,\hat i + x\,\hat j + z\,\hat k$, the line integral $\int\vec F\cdot d\vec l$ along one turn of the helix $x = \cos t$, $y = \sin t$, $z = t/\pi$, from $t = 0$ to $t = 2\pi$, is ______ (two decimal places).`,
      answer: 8.28, tol: 0.01, calc: () => 2 * Math.PI + 2,
      sol: R`Split $\vec F$: the $z\,\hat k$ part is the gradient of $z^2/2$, so it gives $\tfrac12(2^2 - 0) = 2$ (the helix rises from $z = 0$ to $z = 2$). The rotating part gives $\int(-y\,\dot x + x\,\dot y)\,dt = \int_0^{2\pi}(\sin^2t + \cos^2t)\,dt = 2\pi$. Total $2\pi + 2\approx8.28$.`,
      trap: R`Treating the whole field as conservative and using only the end points (which share $x$ and $y$) gives just 2.` },
    { id: 'vc-r4-18', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'curvilinear coordinates',
      q: R`The vector Laplacian of the radial unit vector field, $\nabla^2\hat r$ (for $r > 0$), equals`,
      options: [R`$\vec 0$`, R`$-\dfrac{2\hat r}{r^2}$`, R`$\dfrac{2\hat r}{r^2}$`, R`$-\dfrac{\hat r}{r^2}$`], answer: 1,
      sol: R`Use $\nabla^2\vec A = \nabla(\nabla\cdot\vec A) - \nabla\times(\nabla\times\vec A)$. For $\vec A = \hat r$: $\nabla\cdot\hat r = \frac1{r^2}\frac{d}{dr}(r^2) = \frac2r$ and $\nabla\times\hat r = \vec0$. So $\nabla^2\hat r = \nabla(2/r) = -\frac{2}{r^2}\hat r$.`,
      trap: R`Taking the Laplacian of each spherical component (the component is the constant 1, giving 0) ignores that $\hat r$ itself changes direction.` },
  ],
  gens: [
    { id: 'vc-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'green theorem',
      make(r) {
        const al = choose(r, [-3, -2, -1, 1, 2, 3]), be0 = al + choose(r, [-3, -2, -1, 1, 2, 3, 4]), B = int(r, 1, 3), A = B + int(r, 1, 3);
        const be = be0 === 0 ? 5 : be0;
        const k = be - al, v = k * Math.PI * A * B;
        const t = (c, s) => (c === 1 ? s : c === -1 ? `-${s}` : `${c}${s}`);
        return { q: R`The value of $\oint(${t(al, 'y')}\,dx ${be < 0 ? '-' : '+'} ${t(Math.abs(be), 'x')}\,dy)$, taken anticlockwise round the ellipse $\dfrac{x^2}{${A * A}} + \dfrac{y^2}{${B * B}} = 1$, is ______ (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.02, round(Math.abs(v) * 0.005, 2)), al, be, A, B,
          sol: R`Green's theorem: $\oint(P\,dx + Q\,dy) = \iint(\partial_xQ - \partial_yP)\,dA = (${be} - (${al}))\times\text{area}$. The ellipse has semi-axes ${A} and ${B}, so its area is $\pi\cdot${A}\cdot${B} = ${A * B}\pi$. The integral is $${k}\times${A * B}\pi\approx${round(v, 2)}$.`,
          trap: R`Using $\partial_yP - \partial_xQ$ flips the sign; using the area of a circle of radius ${A} forgets the other semi-axis.` };
      },
      verify: (p) => simpson((t) => p.al * p.B * Math.sin(t) * (-p.A * Math.sin(t)) + p.be * p.A * Math.cos(t) * p.B * Math.cos(t), 0, 2 * Math.PI) },
    { id: 'vc-r4g2', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'laplacian',
      make(r) {
        const n = choose(r, [1, 2, 3, 4, -2, -3]), e = n - 2;
        const rp = e === 1 ? 'r' : `r^{${e}}`;
        const show = (k) => (k === 0 ? '$0$' : e === 0 ? `$${k}$` : `$${k}\\,${rp}$`);
        const m = mcqOptions(r, n * (n + 1), [n * (n - 1), n * n, (n + 1) * (n + 2)], show);
        return { q: R`For $r = \sqrt{x^2 + y^2 + z^2}$ and $r > 0$, the Laplacian $\nabla^2\left(r^{${n}}\right)$ in three dimensions is`, ...m,
          sol: R`For a radial function, $\nabla^2f = \frac{1}{r^2}\frac{d}{dr}\left(r^2\frac{df}{dr}\right)$. With $f = r^{${n}}$: $r^2f' = ${n}r^{${n + 1}}$, and $\frac{1}{r^2}\frac{d}{dr}\left(${n}r^{${n + 1}}\right) = ${n}\cdot(${n + 1})\,${rp}$. So $\nabla^2r^{${n}} = ${n * (n + 1)}${e === 0 ? '' : `\\,${rp}`}$. In general $\nabla^2r^n = n(n + 1)r^{n-2}$, which vanishes only for $n = 0$ and $n = -1$.`,
          trap: 'Using the one-dimensional second derivative $n(n - 1)r^{n-2}$ forgets the $\\tfrac2r\\,df/dr$ term of the spherical Laplacian.' };
      } },
    { id: 'vc-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'line integrals',
      make(r) {
        const a = int(r, -2, 3), b = int(r, -2, 3), c = int(r, -2, 3), d = int(r, -2, 3), e = int(r, 1, 3);
        const p = int(r, 1, 3), qq = int(r, -2, 2), s = int(r, 1, 2);
        const v = 0.5 * (a * p * p + (b + c) * p * qq + d * qq * qq + e * s * s);
        const lin = (u, x, w, y) => { const t = []; if (u) t.push(`${u === 1 ? '' : u === -1 ? '-' : u}${x}`); if (w) t.push(`${w === 1 ? '' : w === -1 ? '-' : w}${y}`); return t.length ? t.join(' + ').replace('+ -', '- ') : '0'; };
        return { q: R`For $\vec F = (${lin(a, 'x', b, 'y')})\,\hat i + (${lin(c, 'x', d, 'y')})\,\hat j + ${e === 1 ? '' : e}z\,\hat k$, the work $\int\vec F\cdot d\vec l$ along the straight line from the origin to $(${p}, ${qq}, ${s})$ is ______ (one decimal place).`,
          answer: round(v, 1), tol: 0.05, a, b, c, d, e, p, qq, s,
          sol: R`On the line $\vec r = t\,(${p}, ${qq}, ${s})$, $0\le t\le1$, the field is $t$ times its value at the end point and $d\vec l = (${p}, ${qq}, ${s})\,dt$. So the work is $\int_0^1t\,dt\times\big[\vec F(\text{end})\cdot(${p}, ${qq}, ${s})\big]$. At the end point $\vec F = (${a * p + b * qq}, ${c * p + d * qq}, ${e * s})$, and its dot product with $(${p}, ${qq}, ${s})$ is $${round(2 * v, 4)}$. Work $= \tfrac12\times(${round(2 * v, 4)}) =${round(v, 1)}$.${b === c ? ' Here $F_x$ and $F_y$ have equal cross-derivatives, so the field is conservative and any path gives the same work.' : ' The field is not conservative (its $x$-$y$ cross-derivatives differ), so this value holds for the straight path only.'}`,
          trap: 'Forgetting the factor $\\tfrac12$ from $\\int_0^1t\\,dt$ doubles the answer.' };
      },
      verify: (p) => simpson((t) => { const x = t * p.p, y = t * p.qq, z = t * p.s; return (p.a * x + p.b * y) * p.p + (p.c * x + p.d * y) * p.qq + p.e * z * p.s; }, 0, 1, 200) },
  ],
};
