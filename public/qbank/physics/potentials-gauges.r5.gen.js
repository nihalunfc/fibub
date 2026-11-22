// Round 5 extras for potentials-gauges: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'pgx-r5-01', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'vector potential',
      q: R`Which vector potential gives the uniform field $\vec B = B_0\hat z$?`,
      options: [R`$\vec A = \tfrac12B_0(y, -x, 0)$`, R`$\vec A = B_0(0, 0, x)$`, R`$\vec A = B_0(x, y, 0)$`, R`$\vec A = B_0(-y, 0, 0)$`], answer: 3,
      sol: R`$(\nabla\times\vec A)_z = \partial_xA_y - \partial_yA_x$. For $B_0(-y, 0, 0)$: $0 - (-B_0) = B_0$, and the other components vanish. $\tfrac12B_0(y, -x, 0)$ gives $-B_0\hat z$ (wrong sign); $B_0(0, 0, x)$ gives $-B_0\hat y$; $B_0(x, y, 0)$ has zero curl.`,
      trap: R`Picking the symmetric form without checking its sign; $\tfrac12\vec B\times\vec r = \tfrac12B_0(-y, x, 0)$.` },
    { id: 'pgx-r5-02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      q: R`A static vector potential is $\vec A = A_0xz\,\hat y$ with $A_0 = 3.0$ T/m. The magnitude of $\vec B$ at the point $(1, 0, 2)$ m is ______ T (two decimal places).`,
      answer: 6.71, tol: 0.01, unit: 'T', calc: () => Math.hypot(-3 * 1, 3 * 2),
      sol: R`With only $A_y = A_0xz$: $B_x = -\partial_zA_y = -A_0x$, $B_y = 0$, $B_z = \partial_xA_y = A_0z$. At $(1, 0, 2)$: $\vec B = (-3, 0, 6)$ T, $|\vec B| = \sqrt{45} = 6.71$ T.`,
      trap: R`Losing the minus sign in $B_x = \partial_yA_z - \partial_zA_y$; it does not change the magnitude here, but it does change the direction.` },
    { id: 'pgx-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'gauge transformations', format: 'statements',
      q: R`Potentials are changed by $\vec A\to\vec A + \nabla\lambda$, $V\to V - \partial\lambda/\partial t$. Which statements are true?`,
      options: [R`$\vec E$ and $\vec B$ are unchanged for any smooth $\lambda$`, R`If the old potentials satisfy the Lorenz condition, the new ones do too when $\nabla^2\lambda - \frac1{c^2}\frac{\partial^2\lambda}{\partial t^2} = 0$`, R`If the old potentials satisfy the Coulomb condition, the new ones do too when $\nabla^2\lambda = 0$`, R`The canonical momentum $m\vec v + q\vec A$ of a charge is unchanged`],
      answer: [0, 1, 2],
      sol: R`$\nabla\times\nabla\lambda = 0$ keeps $\vec B$; in $\vec E = -\nabla V - \partial_t\vec A$ the terms $+\nabla\partial_t\lambda - \partial_t\nabla\lambda$ cancel. The Lorenz quantity $\nabla\cdot\vec A + \frac1{c^2}\partial_tV$ changes by $\Box\lambda$, and $\nabla\cdot\vec A$ changes by $\nabla^2\lambda$, giving the conditions. $m\vec v$ is physical, so $m\vec v + q\vec A$ shifts by $q\nabla\lambda$: the canonical momentum is gauge-dependent.`,
      trap: R`Treating canonical momentum as a physical, gauge-independent quantity.` },
    { id: 'pgx-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'temporal gauge',
      q: R`A static uniform field is described by $V = V_0x/d$, $\vec A = 0$, with $V_0 = 10$ V and $d = 0.50$ m. A gauge change makes $V' = 0$ everywhere (with $\vec A' = 0$ at $t = 0$). At $t = 2.0$ s, $|\vec A'|$ is ______ T m.`,
      answer: 40, tol: 0.01, unit: 'T m', calc: () => 10 * 2 / 0.5,
      sol: R`$V' = V - \partial_t\lambda = 0$ needs $\lambda = V_0xt/d$. Then $\vec A' = \nabla\lambda = \frac{V_0t}{d}\hat x$. Check: $\vec E = -\partial_t\vec A' = -\frac{V_0}{d}\hat x$, the original field. At $t = 2.0$ s: $\frac{10\times2.0}{0.50} = 40$ T m (V s/m).`,
      trap: R`Expecting $\vec A'$ to stay constant; a static $\vec E$ needs a steadily growing $\vec A'$ when $V' = 0$.` },
    { id: 'pgx-r5-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lorenz gauge',
      q: R`In the Lorenz gauge, the vector potential obeys`,
      options: [R`$\nabla^2\vec A = -\mu_0\vec J$ at every instant`, R`$\nabla^2\vec A - \dfrac1{c^2}\dfrac{\partial^2\vec A}{\partial t^2} = -\mu_0\vec J$`, R`$\nabla^2\vec A - \dfrac1{c^2}\dfrac{\partial^2\vec A}{\partial t^2} = -\mu_0\vec J + \dfrac1{c^2}\nabla\dfrac{\partial V}{\partial t}$`, R`$\nabla\times\vec A = \mu_0\vec J$`], answer: 1,
      sol: R`Ampère-Maxwell in potentials gives $\nabla^2\vec A - \frac1{c^2}\partial_t^2\vec A - \nabla\left(\nabla\cdot\vec A + \frac1{c^2}\partial_tV\right) = -\mu_0\vec J$. The Lorenz condition removes the bracket, leaving a wave equation with source $-\mu_0\vec J$. The third option is the Coulomb-gauge equation; the first is the magnetostatic limit.`,
      trap: R`Mixing up the Coulomb-gauge equation (with the $\nabla\partial_tV$ term) and the Lorenz one.` },
    { id: 'pgx-r5-06', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: R`A current of $10$ A is suddenly switched on at $t = 0$ in an infinite straight wire. At a point a distance $s$ from the wire, at the time when $ct = 1.25s$, the retarded vector potential has magnitude ______ $\mu$T m (two decimal places).`,
      answer: 1.39, tol: 0.01, unit: 'μT m', calc: () => 2e-7 * 10 * Math.log(2) * 1e6,
      sol: R`Only wire elements within $|z| \le \sqrt{(ct)^2 - s^2}$ have sent a signal. $A = \frac{\mu_0I}{4\pi}\int_{-z_0}^{z_0}\frac{dz}{\sqrt{s^2 + z^2}} = \frac{\mu_0I}{2\pi}\ln\frac{ct + \sqrt{c^2t^2 - s^2}}{s}$. With $ct = 1.25s$: $\sqrt{1.5625 - 1} = 0.75$, so the log is $\ln2 = 0.693$. $A = 2\times10^{-7}\times10\times0.693 = 1.39\times10^{-6}$ T m.`,
      trap: R`Integrating along the whole wire; the parts beyond $z_0$ have not been "heard from" yet.` },
    { id: 'pgx-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'lienard-wiechert',
      q: R`A charge $q$ moves at constant speed $c/2$ straight towards an observer. At the retarded time it was a distance $d$ away. The scalar potential at the observer is`,
      options: [R`$\dfrac{q}{4\pi\varepsilon_0d}$`, R`$\dfrac{q}{8\pi\varepsilon_0d}$`, R`$\dfrac{2q}{4\pi\varepsilon_0d}$`, R`$\dfrac{4q}{3\cdot4\pi\varepsilon_0d}$`], answer: 2,
      sol: R`Liénard-Wiechert: $V = \frac{q}{4\pi\varepsilon_0(d - \vec d\cdot\vec v/c)}$, with $\vec d$ from the retarded position to the observer. Moving straight towards the observer, $\vec d\cdot\vec v = d\,v$, so $V = \frac{q}{4\pi\varepsilon_0d(1 - 1/2)} = \frac{2q}{4\pi\varepsilon_0d}$.`,
      trap: R`Using $1 + v/c$ (the factor for a receding charge).` },
    { id: 'pgx-r5-08', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'vector potential',
      q: R`A uniform field $\vec B = 2.0\hat z$ T is described by $\vec A = \tfrac12\vec B\times\vec r$. At the point $(3, 4, 0)$ m, $|\vec A|$ is ______ T m.`,
      answer: 5, tol: 0.01, unit: 'T m', calc: () => 0.5 * 2 * 5,
      sol: R`$\vec B\times\vec r = 2\hat z\times(3\hat x + 4\hat y) = 2(3\hat y - 4\hat x)$, of magnitude $2\times5 = 10$. Half of that: $|\vec A| = 5.0$ T m (along $(-4, 3, 0)/5$, circling the $z$-axis).`,
      trap: R`Forgetting the factor $\tfrac12$.` },
    { id: 'pgx-r5-09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'coulomb gauge', format: 'which is NOT',
      q: R`Which statement about the Coulomb gauge $\nabla\cdot\vec A = 0$ is NOT true?`,
      options: [R`It keeps the same form in every inertial frame`, R`The scalar potential is the instantaneous Coulomb potential of the charges`, R`$\vec A$ is driven only by the transverse (divergence-free) part of the current`, R`It is convenient for radiation problems with no free charges`], answer: 0,
      sol: R`$\nabla\cdot\vec A = 0$ singles out space from time, so a Lorentz boost mixes $V$ into $\vec A$ and spoils it; the Lorenz condition is the covariant one. In Coulomb gauge $\nabla^2V = -\rho/\varepsilon_0$ at each instant, and the longitudinal current cancels the $\nabla\partial_tV$ term, leaving the transverse current as the source of $\vec A$. With no charges, $V = 0$ and only $\vec A$ is needed.`,
      trap: R`Thinking the instantaneous $V$ breaks causality; the fields still travel at $c$.` },
    { id: 'pgx-r5-10', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'retarded potentials', format: 'statements',
      q: R`Which statements about retarded potentials are true?`,
      options: [R`$V(\vec r, t) = \dfrac1{4\pi\varepsilon_0}\displaystyle\int\frac{\rho(\vec r', t - |\vec r - \vec r'|/c)}{|\vec r - \vec r'|}d^3r'$`, R`The fields are not found simply by putting the retarded time into Coulomb's and the Biot-Savart laws`, R`The retarded potentials satisfy the Lorenz gauge condition`, R`Advanced potentials (using $t + |\vec r - \vec r'|/c$) do not satisfy Maxwell's equations`],
      answer: [0, 1, 2],
      sol: R`The first is the retarded solution of $\Box V = -\rho/\varepsilon_0$. Differentiating it gives extra terms (time derivatives of the sources, Jefimenko's equations), so retarding the static field laws is not enough. Charge conservation makes the retarded pair obey $\nabla\cdot\vec A + \frac1{c^2}\partial_tV = 0$. Advanced potentials also solve the equations; they are rejected because they break causality, not because they fail mathematically.`,
      trap: R`Thinking advanced solutions are mathematically wrong; they are physically excluded.` },
  ],
  gens: [
    { id: 'pgx-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      make(r) {
        const a = choose(r, [-3, -2, 2, 3]), b = int(r, 2, 4), c = int(r, -4, -2), x = int(r, -2, 3), y = int(r, -2, 3), z = int(r, 1, 3);
        const B = [(c - b) * x, (a - c) * y, (b - a) * z], m = Math.hypot(...B);
        return { q: `A static vector potential is $\\vec A = (${a}yz,\\ ${b}xz,\\ ${c}xy)$ (SI units, coefficients in T/m). The magnitude of $\\vec B$ at $(${x}, ${y}, ${z})$ m is ______ T (two decimal places).`,
          answer: round(m, 2), tol: 0.01, unit: 'T', a, b, c, x, y, z,
          sol: `$B_x = \\partial_yA_z - \\partial_zA_y = (${c} - ${b})x$, $B_y = \\partial_zA_x - \\partial_xA_z = (${a} - (${c}))y$, $B_z = \\partial_xA_y - \\partial_yA_x = (${b} - (${a}))z$. At the point: $\\vec B = (${B[0]}, ${B[1]}, ${B[2]})$ T, $|\\vec B| = ${round(m, 2)}$ T.`,
          trap: 'Keep the cyclic order in each curl component.' };
      },
      verify: (p) => Math.hypot((p.c - p.b) * p.x, (p.a - p.c) * p.y, (p.b - p.a) * p.z) },
    { id: 'pgx-r5g2', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'vector potential',
      make(r) {
        const B = choose(r, [0.5, 1, 1.5, 2, 3, 5]), x = int(r, -5, 5), y = int(r, 1, 6), z = int(r, -3, 3), A = 0.5 * B * Math.hypot(x, y);
        return { q: `A uniform field $\\vec B = ${B}\\hat z$ T is described by $\\vec A = \\tfrac12\\vec B\\times\\vec r$. At $(${x}, ${y}, ${z})$ m, $|\\vec A|$ is ______ T m (three decimal places).`,
          answer: round(A, 3), tol: 0.002, unit: 'T m', B, x, y,
          sol: `$\\vec B\\times\\vec r = ${B}(-y, x, 0)$, so the $z$-coordinate does not matter: $|\\vec A| = \\tfrac12B\\sqrt{x^2 + y^2} = 0.5\\times${B}\\times\\sqrt{${x * x + y * y}} = ${round(A, 3)}$ T m.`,
          trap: 'The component of $\\vec r$ along $\\vec B$ drops out of the cross product.' };
      },
      verify: (p) => 0.5 * p.B * Math.hypot(p.x, p.y) },
    { id: 'pgx-r5g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'retarded potentials',
      make(r) {
        const I = choose(r, [1, 2, 5, 10, 20]), tau = choose(r, [1.1, 1.25, 1.5, 2, 3, 5]), L = Math.log(tau + Math.sqrt(tau * tau - 1)), A = 0.2 * I * L;
        return { q: `A current of $${I}$ A is switched on at $t = 0$ in an infinite straight wire. At distance $s$ from the wire, when $ct = ${tau}s$, the retarded vector potential is ______ $\\mu$T m (three decimal places).`,
          answer: round(A, 3), tol: Math.max(0.001, round(A * 0.002, 3)), unit: 'μT m', I, tau,
          sol: `Only the length $|z| \\le s\\sqrt{${tau}^2 - 1}$ contributes: $A = \\frac{\\mu_0I}{2\\pi}\\ln\\left(${tau} + \\sqrt{${tau}^2 - 1}\\right) = 2\\times10^{-7}\\times${I}\\times${round(L, 4)} = ${round(A, 3)}\\ \\mu$T m.`,
          trap: 'Signals from distant parts of the wire have not arrived yet.' };
      },
      verify: (p) => 0.2 * p.I * Math.log(p.tau + Math.sqrt(p.tau * p.tau - 1)) },
  ],
};
