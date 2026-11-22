// Round 4 extras for integral-theorems: original questions, written 2026-11-22.
import { pick, int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'it-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'conservative fields',
      q: R`For $\phi = xyz$, the line integral $\displaystyle\int\nabla\phi\cdot d\vec l$ along any path from $(0, 0, 0)$ to $(1, 2, 3)$ is`,
      options: [R`$6$`, R`$0$`, R`$14$`, 'different for different paths'], answer: 0,
      sol: R`The fundamental theorem for gradients: $\displaystyle\int_A^B\nabla\phi\cdot d\vec l = \phi(B) - \phi(A) = 1\cdot2\cdot3 - 0 = 6$, whatever the path. (14 is $|\vec r_B|^2$, unrelated.)`,
      trap: R`A gradient field is path independent; there is no need to pick a path and integrate.` },
    { id: 'it-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'stokes theorem',
      q: R`A long straight wire of radius $a$ carries a current $I$ spread uniformly over its cross-section. By Ampère's law $\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}}$, the field at distance $r < a$ from the axis is`,
      options: [R`$\dfrac{\mu_0I}{2\pi r}$`, 'zero', R`$\dfrac{\mu_0Ir}{2\pi a^2}$`, R`$\dfrac{\mu_0I}{2\pi a}$`], answer: 2,
      sol: R`Take a circle of radius $r$ about the axis. By symmetry $B$ is the same all round it, so $\oint\vec B\cdot d\vec l = 2\pi rB$. The enclosed current is the fraction $\pi r^2/\pi a^2$ of $I$. So $B = \dfrac{\mu_0I r^2/a^2}{2\pi r} = \dfrac{\mu_0Ir}{2\pi a^2}$: it grows linearly from zero on the axis and meets $\mu_0I/2\pi a$ at the surface.`,
      trap: R`Inside the wire only the enclosed part of the current counts.` },
    { id: 'it-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'divergence theorem',
      q: R`The outward flux of $\vec F = x\,\hat i + y\,\hat j$ through the whole closed surface of the cylinder $x^2 + y^2 \le 4$, $0 \le z \le 3$ is ______ (to one decimal place).`,
      answer: 75.4, tol: 0.1, calc: () => 2 * Math.PI * 4 * 3,
      sol: R`$\nabla\cdot\vec F = 1 + 1 = 2$, and the volume is $\pi\cdot2^2\cdot3 = 12\pi$, so the flux is $24\pi = 75.4$. Check directly: on the curved side $\vec F\cdot\hat n = \rho = 2$, over an area $2\pi\cdot2\cdot3 = 12\pi$, giving $24\pi$; the flat ends contribute nothing because $\vec F$ has no $z$ component.`,
      trap: R`The divergence of $x\hat i + y\hat j$ is 2, not 3; there is no $z$ term.` },
    { id: 'it-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'gauss law', format: 'statements',
      q: R`Gauss's law for gravity, $\oint\vec g\cdot d\vec S = -4\pi GM_{\text{enc}}$, is applied to a uniform solid planet of radius $R$. Which statements are true?`,
      options: ['$g = 0$ at the centre', '$g$ grows in proportion to $r$ inside the planet', '$g$ falls as $1/r^2$ outside the planet', '$g$ is largest at the centre'], answer: [0, 1, 2],
      sol: R`For a sphere of radius $r$, $4\pi r^2g = 4\pi GM_{\text{enc}}$ in size. Inside, $M_{\text{enc}} = M r^3/R^3$, so $g = GMr/R^3$: zero at the centre and growing linearly. Outside, $M_{\text{enc}} = M$ and $g = GM/r^2$. So $g$ is largest at the surface, not the centre.`,
      trap: R`Being closest to all the mass does not mean the strongest pull: at the centre the pulls cancel.` },
    { id: 'it-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'green theorem',
      q: R`The integral $\displaystyle\int y\,dx$ is taken from $(0, 0)$ to $(1, 1)$ once along the line $y = x$ and once along the parabola $y = x^2$. The first result minus the second is`,
      options: [R`$0$`, R`$\dfrac16$`, R`$\dfrac13$`, R`$\dfrac12$`], answer: 1,
      sol: R`Along $y = x$: $\int_0^1x\,dx = \tfrac12$. Along $y = x^2$: $\int_0^1x^2dx = \tfrac13$. The difference is $\tfrac16$. Green's theorem explains it: out along the line and back along the parabola is a clockwise loop round the region between the curves, and for a clockwise loop $\oint y\,dx = +\iint dA$, so the difference is the area between line and parabola, $\int_0^1(x - x^2)dx = \tfrac16$. The field $y\,\hat i$ is not conservative.`,
      trap: R`Path independence holds only for conservative fields; $y\,\hat i$ has curl $-\hat k$.` },
    { id: 'it-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'green theorem',
      q: R`The outward flux of the plane field $\vec F = x^2\,\hat i + y^2\,\hat j$ across the boundary of the square $0 \le x \le 1$, $0 \le y \le 1$, $\displaystyle\oint\vec F\cdot\hat n\,ds$, is ______.`,
      answer: 2, tol: 0.001, calc: () => 1 + 1,
      sol: R`The normal form of Green's theorem (the divergence theorem in 2D): $\oint\vec F\cdot\hat n\,ds = \iint\nabla\cdot\vec F\,dA = \iint(2x + 2y)\,dx\,dy = 1 + 1 = 2$. Check: only the sides $x = 1$ ($F_x = 1$, length 1) and $y = 1$ ($F_y = 1$) contribute; on $x = 0$ and $y = 0$ the normal component is zero.`,
      trap: R`This is flux across the curve, not circulation along it; it uses the divergence, not the curl.` },
    { id: 'it-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stokes theorem',
      q: R`In a region the magnetic field is $\vec B = 0.01\,(-y\,\hat i + x\,\hat j)$ T ($x$, $y$ in m). Using $\oint\vec B\cdot d\vec l = \mu_0I$, the current through a circle of radius 0.1 m centred on the $z$-axis in the $xy$-plane is ______ A.`,
      answer: 500, tol: 1, unit: 'A', calc: () => (0.01 * 2 * Math.PI * 0.01) / C.mu0,
      sol: R`On the circle $\vec B$ is tangential with size $0.01\rho = 0.001$ T, so $\oint\vec B\cdot d\vec l = 0.001\times2\pi\times0.1 = 2\pi\times10^{-4}$ T m. (Or by Stokes: $\nabla\times\vec B = 0.02\,\hat k$ T/m, times the area $\pi\times0.01$.) Then $I = \dfrac{2\pi\times10^{-4}}{4\pi\times10^{-7}} = 500$ A. The current density is uniform, $J = 0.02/\mu_0 \approx 1.6\times10^4$ A/m².`,
      trap: R`$|\vec B|$ grows with distance from the axis; it is $0.01\rho$, not $0.01$.` },
    { id: 'it-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'solid angle',
      q: R`The field $\vec F = \hat r/r^2$ has an outward flux through the sphere of radius 1 centred at $(1, 0, 0)$, which passes through the origin (take the limit that treats the origin as lying exactly on the surface). The flux is`,
      options: [R`$0$`, R`$4\pi$`, R`$\pi$`, R`$2\pi$`], answer: 3,
      sol: R`The flux of $\hat r/r^2$ through a closed surface is the solid angle it subtends at the origin: $4\pi$ if the origin is inside, 0 if outside. With the origin on a smooth part of the surface, the surface looks locally like a plane through it and covers half of all directions, so the flux is $2\pi$. (This is the principal value; it is the average of the inside and outside answers.)`,
      trap: R`The divergence theorem cannot be used blindly when the singularity sits on the surface.` },
    { id: 'it-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'conservative fields', format: 'statements',
      q: R`A smooth field $\vec F$ has $\nabla\times\vec F = \vec 0$ in a region $D$ of space. Which statements are always true?`,
      options: [R`If $D$ is simply connected, $\int\vec F\cdot d\vec l$ between two points does not depend on the path`, R`$\vec F = \nabla\phi$ for a single-valued $\phi$, whatever the shape of $D$`, R`$\oint\vec F\cdot d\vec l = 0$ round any loop that bounds a surface lying inside $D$`, R`The flux of $\vec F$ through every closed surface in $D$ is zero`], answer: [0, 2],
      sol: R`Stokes' theorem gives $\oint\vec F\cdot d\vec l = \iint(\nabla\times\vec F)\cdot d\vec S = 0$ for a loop that bounds a surface inside $D$; in a simply connected $D$ every loop does, so line integrals are path independent. If $D$ has a hole (e.g. the field $\hat\phi/\rho$ round a wire), a loop round the hole need not give zero, and a single-valued potential may not exist. Zero curl says nothing about divergence: $\vec r$ has no curl but flux $3V$.`,
      trap: R`Curl-free and divergence-free are separate properties.` },
    { id: 'it-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'solid angle',
      q: R`The outward flux of $\vec F = \dfrac{\vec r}{r^3}$ through the curved side only of the cylinder $x^2 + y^2 = 1$, $-1 \le z \le 1$ is ______ (to three decimal places).`,
      answer: 8.886, tol: 0.003, calc: () => 4 * Math.PI / Math.SQRT2,
      sol: R`The whole closed cylinder surrounds the origin, so the total flux is $4\pi$. Each flat end is a disc of radius 1 at distance 1, which subtends the solid angle of a cone of half-angle $45^\circ$: $2\pi(1 - \cos45^\circ) = 2\pi(1 - 1/\sqrt2) = 1.840$. The curved side gets the rest: $4\pi - 2\times1.840 = 4\pi/\sqrt2 = 2\sqrt2\,\pi = 8.886$.`,
      trap: R`Each end disc's share is a solid angle $2\pi(1 - \cos\alpha)$, not its area divided by $r^2$.` },
  ],
  gens: [
    { id: 'it-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stokes theorem',
      make(r) {
        const b = choose(r, [0.002, 0.005, 0.01, 0.02, 0.04]), Rc = pick(r, 2, 20, 1);
        const Rm = Rc / 100, answer = round(b * 2 * Math.PI * Rm * Rm / C.mu0, 2);
        return { q: R`Inside a conductor the magnetic field is $\vec B = ${b}\,(-y\,\hat i + x\,\hat j)$ T ($x$, $y$ in m). Find the current (A) through a circle of radius ${Rc} cm centred on the $z$-axis in the $xy$-plane.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'A', b, Rm,
          sol: R`$\nabla\times\vec B = 2\times${b}\,\hat k$ T/m. By Stokes and Ampère, $\mu_0I = \iint(\nabla\times\vec B)\cdot d\vec S = ${2 * b}\times\pi(${Rm})^2$, so $I = \dfrac{${2 * b}\pi(${Rm})^2}{4\pi\times10^{-7}} = ${answer}$ A.`,
          trap: 'The curl of $(-y, x, 0)$ is $2\\hat k$, not $\\hat k$.' };
      },
      verify: (p) => p.b * 2 * Math.PI * p.Rm ** 2 / C.mu0 },
    { id: 'it-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'green theorem',
      make(r) {
        const a = int(r, 1, 4), b = int(r, -3, 3) || 1, L1 = int(r, 1, 4), L2 = int(r, 1, 4);
        const answer = a * L1 * L1 * L2 + b * L1 * L2 * L2;
        return { q: R`Find the outward flux $\displaystyle\oint\vec F\cdot\hat n\,ds$ of the plane field $\vec F = ${a === 1 ? '' : a}x^2\,\hat i ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y^2\,\hat j$ across the boundary of the rectangle $0 \le x \le ${L1}$, $0 \le y \le ${L2}$.`,
          answer, tol: 0, a, b, L1, L2,
          sol: R`By the 2D divergence theorem, the flux is $\iint\nabla\cdot\vec F\,dA = \iint(${2 * a}x ${b < 0 ? '-' : '+'} ${Math.abs(2 * b)}y)\,dx\,dy = ${a}\cdot${L1}^2\cdot${L2} ${b < 0 ? '-' : '+'} ${Math.abs(b)}\cdot${L1}\cdot${L2}^2 = ${answer}$.`,
          trap: 'Outward flux across a curve uses the divergence; circulation uses the curl.' };
      },
      verify: (p) => p.a * p.L1 ** 2 * p.L2 + p.b * p.L1 * p.L2 ** 2 },
    { id: 'it-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'gauss law',
      make(r) {
        const rho = pick(r, 1, 10, 1), h = pick(r, 1, 10, 1);
        const answer = round(100 * h / Math.hypot(h, rho), 2);
        return { q: R`A point charge sits at the centre of a closed cylinder of radius ${rho} cm and length ${2 * h} cm. What percentage of its electric flux leaves through the curved side (to two decimal places)?`,
          answer, tol: 0.02, unit: '%', rho, h,
          sol: R`Each end subtends a cone of half-angle $\alpha$ with $\cos\alpha = \dfrac{${h}}{\sqrt{${h}^2 + ${rho}^2}} = ${round(h / Math.hypot(h, rho), 4)}$, i.e. a solid angle $2\pi(1 - \cos\alpha)$. The two ends take the fraction $\dfrac{2\cdot2\pi(1 - \cos\alpha)}{4\pi} = 1 - \cos\alpha$, so the curved side takes $\cos\alpha = ${answer}\%$.`,
          trap: 'Flux shares go by solid angle, not by surface area.' };
      },
      verify: (p) => 100 * p.h / Math.hypot(p.h, p.rho) },
  ],
};
