// Round 5 extras for boundary-value-problems: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'bvp-r5-01', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'uniqueness',
      q: R`The charge density inside a closed region is known. Which extra information fixes the electric field everywhere inside the region uniquely?`,
      options: [R`$V$ at one point inside the region`, R`Either $V$ on the whole boundary, or the normal derivative $\partial V/\partial n$ on the whole boundary`, R`$V$ and $\partial V/\partial n$ on just half of the boundary`, R`Nothing more: the charge density alone fixes the field`], answer: 1,
      sol: R`Poisson's equation with Dirichlet data ($V$ on the boundary) has one solution; with Neumann data ($\partial V/\partial n$, i.e. the normal field) it is unique up to an added constant, which leaves $\vec E$ unchanged. The charge inside alone is not enough, because charges outside the region also shape the field.`,
      trap: R`Forgetting that outside charges affect the field inside, so boundary data are needed.` },
    { id: 'bvp-r5-02', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sphere in uniform field',
      q: R`An uncharged metal sphere is placed in a uniform field of $1.0\times10^5$ V/m. The largest surface charge density induced on it is ______ $\mu$C/m² (two decimal places).`,
      answer: 2.66, tol: 0.02, unit: 'μC/m²', calc: () => 3 * 8.854e-12 * 1e5 * 1e6,
      sol: R`Outside, $V = -E_0\left(r - \frac{R^3}{r^2}\right)\cos\theta$, which is zero on the sphere and tends to $-E_0z$ far away. Then $\sigma = -\varepsilon_0\frac{\partial V}{\partial r}\Big|_R = 3\varepsilon_0E_0\cos\theta$. Its largest value, at the poles, is $3\times8.854\times10^{-12}\times10^5 = 2.66\times10^{-6}$ C/m².`,
      trap: R`Using $\varepsilon_0E_0$ as for a flat plate; the sphere concentrates the field to $3E_0$ at its poles.` },
    { id: 'bvp-r5-03', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'separation of variables', format: 'statements',
      q: R`Which of these functions satisfy Laplace's equation $\dfrac{\partial^2V}{\partial x^2} + \dfrac{\partial^2V}{\partial y^2} = 0$ ($k$ a constant)?`,
      options: [R`$\sin(kx)\sinh(ky)$`, R`$e^{kx}\cos(ky)$`, R`$\sin(kx)\sin(ky)$`, R`$x^2 - y^2$`],
      answer: [0, 1, 3],
      sol: R`Each product must have $\frac{X''}{X} = -\frac{Y''}{Y}$. $\sin kx\sinh ky$: $-k^2 + k^2 = 0$. $e^{kx}\cos ky$: $k^2 - k^2 = 0$. $\sin kx\sin ky$: $-k^2 - k^2 = -2k^2\ne0$. $x^2 - y^2$: $2 - 2 = 0$. So in a separated solution one factor oscillates and the other grows or decays.`,
      trap: R`Expecting both factors to be sines; their second derivatives then add instead of cancelling.` },
    { id: 'bvp-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rectangular slot',
      q: R`A slot is bounded by earthed plates $y = 0$ and $y = a$ (both extending to $x\to\infty$) and closed at $x = 0$ by a strip held at $V = 100\sin(\pi y/a)$ volts. At $x = a$, $y = a/2$, the potential is ______ V (two decimal places).`,
      answer: 4.32, tol: 0.02, unit: 'V', calc: () => 100 * Math.exp(-Math.PI),
      sol: R`Try $V = X(x)\sin(\pi y/a)$, which vanishes on both plates. Laplace gives $X'' = (\pi/a)^2X$, and $V\to0$ as $x\to\infty$ keeps only $e^{-\pi x/a}$. Matching at $x = 0$: $V = 100\sin(\pi y/a)e^{-\pi x/a}$. At $(a, a/2)$: $100e^{-\pi} = 4.32$ V.`,
      trap: R`Keeping the growing $e^{+\pi x/a}$ solution, or using a sine in $x$ as well.` },
    { id: 'bvp-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cylinder in uniform field',
      q: R`A long uncharged metal cylinder lies with its axis perpendicular to a uniform field $E_0$. The largest surface charge density induced on it is`,
      options: [R`$3\varepsilon_0E_0$`, R`$\varepsilon_0E_0$`, R`$2\varepsilon_0E_0$`, R`$\tfrac32\varepsilon_0E_0$`], answer: 2,
      sol: R`In polar coordinates the solution that vanishes on $s = R$ and tends to $-E_0s\cos\phi$ is $V = -E_0\left(s - \frac{R^2}{s}\right)\cos\phi$. Then $\sigma = -\varepsilon_0\frac{\partial V}{\partial s}\Big|_R = 2\varepsilon_0E_0\cos\phi$, largest $2\varepsilon_0E_0$. (A sphere gives $3\varepsilon_0E_0$.)`,
      trap: R`Copying the sphere's factor 3; the 2D solution has $R^2/s$, not $R^3/r^2$.` },
    { id: 'bvp-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'legendre expansion',
      q: R`On the $z$-axis, outside all charges, a static potential is $V(z) = \dfrac{8}{z} + \dfrac{16}{z^3}$ (volts, $z$ in metres) for $z > 1$ m. The charges are symmetric about the $z$-axis. At $r = 2$ m in the plane $\theta = 90^\circ$, the potential is ______ V.`,
      answer: 3, tol: 0.01, unit: 'V', calc: () => 8 / 2 + 16 * (-0.5) / 8,
      sol: R`Outside, $V(r, \theta) = \sum_l\frac{B_l}{r^{l + 1}}P_l(\cos\theta)$. On the axis ($\theta = 0$, $P_l = 1$) this must match $V(z)$, so $B_0 = 8$ and $B_2 = 16$ (the $1/z^3$ term is $l = 2$). At $\theta = 90^\circ$, $P_2(0) = -\frac12$: $V = \frac82 + \frac{16}{8}\left(-\frac12\right) = 4 - 1 = 3$ V.`,
      trap: R`Treating $1/z^3$ as the $l = 3$ term, or putting $P_2 = 1$ off the axis.` },
    { id: 'bvp-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hemispherical boss',
      q: R`A large earthed metal plane has a hemispherical bump of radius $R$ on it. Far away, the field is uniform, $E_0$, normal to the plane. The field strength at the top of the bump is`,
      options: [R`$E_0$`, R`$2E_0$`, R`$\tfrac32E_0$`, R`$3E_0$`], answer: 3,
      sol: R`The solution for a whole sphere in a uniform field, $V = -E_0\left(r - \frac{R^3}{r^2}\right)\cos\theta$, is zero on the plane $\theta = 90^\circ$ and on the sphere, so its upper half solves this problem too (uniqueness). At the top, $E = -\partial V/\partial r = E_0\left(1 + \frac{2R^3}{r^3}\right) = 3E_0$.`,
      trap: R`Guessing a factor of 2 from a cylinder or from the image idea; the hemisphere copies the sphere.` },
    { id: 'bvp-r5-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mean value',
      q: R`A charge-free spherical region has its surface held at $V(\theta) = 10 + 6\cos\theta + 4\cos^2\theta$ volts. The potential at the centre is ______ V (two decimal places).`,
      answer: 11.33, tol: 0.01, unit: 'V', calc: () => 10 + 4 / 3,
      sol: R`In a charge-free region, the potential at the centre of a sphere is the average over its surface. Averaging over solid angle: $\langle\cos\theta\rangle = 0$ and $\langle\cos^2\theta\rangle = \frac13$. So $V_{\rm centre} = 10 + 0 + \frac43 = 11.33$ V.`,
      trap: R`Averaging over $\theta$ alone (giving $\langle\cos^2\theta\rangle = \frac12$); the average is over the sphere's area, with weight $\sin\theta$.` },
    { id: 'bvp-r5-09', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'laplace properties', format: 'which is NOT',
      q: R`$V$ satisfies Laplace's equation throughout a region. Which statement is NOT necessarily true?`,
      options: [R`$V$ is zero somewhere inside the region`, R`$V$ has no local maximum or minimum inside the region`, R`$V$ at any point equals its average over any sphere centred there that lies inside the region`, R`Given $V$ on the boundary, $V$ is fixed everywhere inside`], answer: 0,
      sol: R`The mean-value property, the absence of interior extrema (which follows from it) and uniqueness for Dirichlet data are all theorems for harmonic functions. A constant $V = 5$ V solves Laplace's equation and is never zero, so the first statement can fail.`,
      trap: R`Thinking a potential must cross zero; adding any constant leaves Laplace's equation satisfied.` },
    { id: 'bvp-r5-10', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'corners and edges', format: 'statements',
      q: R`Near the line where two earthed conducting planes meet, the charge-free region between them has opening angle $\beta$, and there $V\approx Ar^{\pi/\beta}\sin(\pi\phi/\beta)$. Which statements are true?`,
      options: [R`For $\beta = \pi/2$ (inside a right-angled corner) the field goes to zero at the corner`, R`For $\beta = 3\pi/2$ (outside a right-angled edge) the field grows without limit as $r^{-1/3}$`, R`For $\beta = \pi$ (a flat plane) the field near the line is finite and non-zero`, R`For $\beta = 2\pi$ (the edge of a thin sheet) the surface charge grows as $r^{-1/4}$`],
      answer: [0, 1, 2],
      sol: R`$E\sim r^{\pi/\beta - 1}$, and $\sigma\propto E$ at the surface. $\beta = \pi/2$: $E\sim r^{1}\to0$. $\beta = 3\pi/2$: $E\sim r^{-1/3}$, diverging. $\beta = \pi$: $E\sim r^0$, finite. $\beta = 2\pi$: $E\sim r^{-1/2}$, so $\sigma\sim r^{-1/2}$, not $r^{-1/4}$.`,
      trap: R`Using $r^{\pi/\beta}$ for the field; differentiating lowers the power by one.` },
  ],
  gens: [
    { id: 'bvp-r5g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rectangular slot',
      make(r) {
        const n = int(r, 1, 3), V0 = choose(r, [10, 50, 100, 200]), xa = choose(r, [0.1, 0.2, 0.25, 0.5, 1]), ya = choose(r, [0.1, 0.25, 0.5, 0.75]);
        const V = V0 * Math.sin(n * Math.PI * ya) * Math.exp(-n * Math.PI * xa);
        return { q: `Earthed plates at $y = 0$ and $y = a$ extend to $x\\to\\infty$; the end $x = 0$ is held at $V = ${V0}\\sin(${n === 1 ? '' : n}\\pi y/a)$ volts. At $x = ${xa}a$, $y = ${ya}a$ the potential is ______ V (three decimal places).`,
          answer: round(V, 3), tol: Math.max(0.001, round(Math.abs(V) * 0.002, 3)), unit: 'V', n, V0, xa, ya,
          sol: `The single mode $V = ${V0}\\sin(${n === 1 ? '' : n}\\pi y/a)e^{-${n === 1 ? '' : n}\\pi x/a}$ vanishes on both plates, decays at large $x$ and matches the end. Value: $${V0}\\times\\sin(${round(n * Math.PI * ya, 4)})\\times e^{-${round(n * Math.PI * xa, 4)}} = ${round(V, 3)}$ V.`,
          trap: 'Higher modes decay faster: the decay constant is $n\\pi/a$.' };
      },
      verify: (p) => p.V0 * Math.sin(p.n * Math.PI * p.ya) * Math.exp(-p.n * Math.PI * p.xa) },
    { id: 'bvp-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mean value',
      make(r) {
        const a = int(r, -20, 20), b = int(r, -10, 10), c = int(r, -12, 12), d = int(r, 0, 9), V = a + c / 3 + 2 * d / 3;
        const term = (k, s) => (k === 0 ? '' : `${k < 0 ? ' - ' : ' + '}${Math.abs(k)}${s}`);
        return { q: `The surface of a charge-free spherical region is held at $V(\\theta) = ${a}${term(b, '\\cos\\theta')}${term(c, '\\cos^2\\theta')}${term(d, '\\sin^2\\theta')}$ volts. The potential at the centre is ______ V (two decimal places).`,
          answer: round(V, 2), tol: 0.01, unit: 'V', a, c, d,
          sol: `The centre's potential is the surface average. Over the sphere $\\langle\\cos\\theta\\rangle = 0$, $\\langle\\cos^2\\theta\\rangle = \\frac13$, $\\langle\\sin^2\\theta\\rangle = \\frac23$: $V = ${a} + \\frac{${c}}{3} + \\frac{2\\times${d}}{3} = ${round(V, 2)}$ V.`,
          trap: 'Average over area (weight $\\sin\\theta$), not over the angle $\\theta$.' };
      },
      verify: (p) => p.a + p.c / 3 + 2 * p.d / 3 },
    { id: 'bvp-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sphere in uniform field',
      make(r) {
        const cyl = r() < 0.5, E0 = choose(r, [1, 2, 5, 10, 20]), th = choose(r, [0, 30, 45, 60, 120, 180]);
        const s = (cyl ? 2 : 3) * C.eps0 * E0 * 1e4 * Math.cos(th * Math.PI / 180) * 1e6;
        return { q: `An uncharged metal ${cyl ? 'cylinder (long, axis perpendicular to the field)' : 'sphere'} sits in a uniform field of $${E0}\\times10^4$ V/m. At the surface point at angle $${th}^\\circ$ from the field direction (measured from the centre), the induced surface charge density is ______ $\\mu$C/m² (three decimal places, with sign).`,
          answer: round(s, 3), tol: Math.max(0.001, round(Math.abs(s) * 0.003, 3)), unit: 'μC/m²', cyl, E0, th,
          sol: `${cyl ? 'For the cylinder $V = -E_0(s - R^2/s)\\cos\\phi$ gives $\\sigma = 2\\varepsilon_0E_0\\cos\\phi$' : 'For the sphere $V = -E_0(r - R^3/r^2)\\cos\\theta$ gives $\\sigma = 3\\varepsilon_0E_0\\cos\\theta$'}. So $\\sigma = ${cyl ? 2 : 3}\\times8.854\\times10^{-12}\\times${E0}\\times10^4\\times\\cos${th}^\\circ = ${round(s, 3)}\\ \\mu$C/m².`,
          trap: 'The factor is 3 for a sphere and 2 for a cylinder; the sign follows $\\cos\\theta$.' };
      },
      verify: (p) => (p.cyl ? 2 : 3) * C.eps0 * p.E0 * 1e4 * Math.cos(p.th * Math.PI / 180) * 1e6 },
  ],
};
