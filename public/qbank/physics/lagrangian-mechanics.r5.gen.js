// Round 5 extras for lagrangian-mechanics: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'lag-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'generalised momentum',
      q: R`A particle of mass $m$ is confined to the surface of a vertical cylinder of radius $R$, with $L = \tfrac12m(R^2\dot\phi^2 + \dot z^2) - mgz$. The generalised momentum conjugate to $\phi$ is`,
      options: [R`$mR\dot\phi$`, R`$mR^2\dot\phi$`, R`$m\dot\phi$`, R`$\tfrac12mR^2\dot\phi^2$`], answer: 1,
      sol: R`By definition $p_\phi = \partial L/\partial\dot\phi = mR^2\dot\phi$. It is the $z$ component of angular momentum about the axis, and it is conserved because $\phi$ does not appear in $L$.`,
      trap: R`$mR\dot\phi$ is the linear momentum along the circle; the momentum conjugate to an angle is an angular momentum and carries $R^2$.` },
    { id: 'lag-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rolling constraints',
      q: R`A uniform solid disc (mass $m$, radius $R$) has a light string wound round its rim; the free end of the string is tied to a fixed support and the disc falls, unwinding, with the string vertical. Taking the fall distance $y$ as the only coordinate, the acceleration of the disc's centre is`,
      options: [R`$2g/3$`, R`$g/2$`, R`$g/3$`, R`$g$`], answer: 0,
      sol: R`The string does not slip, so the spin rate is $\dot\phi = \dot y/R$. Then $T = \tfrac12m\dot y^2 + \tfrac12\cdot\tfrac12mR^2(\dot y/R)^2 = \tfrac34m\dot y^2$ and $V = -mgy$. Lagrange's equation: $\tfrac32m\ddot y = mg$, so $\ddot y = 2g/3$.`,
      trap: R`$g/2$ is the result for a thin ring ($I = mR^2$); $g$ forgets the rotational kinetic energy.` },
    { id: 'lag-r5-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'constrained motion',
      q: R`A 3 kg block hangs from a light string that passes over a light smooth pulley at the top of a fixed smooth incline of $30^\circ$; the other end is tied to a 2 kg block on the incline. Using the length of string past the pulley as the coordinate, the magnitude of the acceleration is ______ m/s² ($g = 9.8$ m/s²).`,
      answer: 3.92, tol: 0.04, calc: () => 9.8 * (3 - 2 * 0.5) / 5, unit: 'm/s²',
      sol: R`Let $x$ be the distance the hanging block descends; the other block moves $x$ up the slope. $T = \tfrac12(3 + 2)\dot x^2$, $V = -3gx + 2gx\sin30^\circ$. So $5\ddot x = g(3 - 2\times0.5) = 2g$ and $\ddot x = 0.4\times9.8 = 3.92$ m/s².`,
      trap: R`Using $2g$ instead of $2g\sin30^\circ$ for the block on the slope: only the component of its weight along the slope works against the motion.` },
    { id: 'lag-r5-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
      q: R`A system has $L = \tfrac12m\dot x^2 + \beta x\dot x^2 - \tfrac12kx^2$ with constants $m, \beta, k$. Its equation of motion is`,
      options: [R`$(m + 2\beta x)\ddot x + 2\beta\dot x^2 + kx = 0$`, R`$(m + 2\beta x)\ddot x - \beta\dot x^2 + kx = 0$`, R`$(m + 2\beta x)\ddot x + \beta\dot x^2 + kx = 0$`, R`$m\ddot x + \beta\dot x^2 + kx = 0$`], answer: 2,
      sol: R`$\partial L/\partial\dot x = (m + 2\beta x)\dot x$, so $\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot x} = (m + 2\beta x)\ddot x + 2\beta\dot x^2$. Also $\partial L/\partial x = \beta\dot x^2 - kx$. Subtracting: $(m + 2\beta x)\ddot x + 2\beta\dot x^2 - \beta\dot x^2 + kx = 0$, that is $(m + 2\beta x)\ddot x + \beta\dot x^2 + kx = 0$.`,
      trap: R`Forgetting $\partial L/\partial x$ of the velocity term leaves $2\beta\dot x^2$; forgetting that the effective mass $m + 2\beta x$ changes in time drops the $\dot x^2$ term from the time derivative.` },
    { id: 'lag-r5-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Lagrange multipliers',
      q: R`A particle moves in a potential $V(\mathbf r)$ but is held on the sphere $f = x^2 + y^2 + z^2 - R^2 = 0$. It is treated with a Lagrange multiplier: Cartesian coordinates and $L' = L + \lambda f$. Which statements are correct?`,
      options: [R`The $x$ equation is $m\ddot x = -\partial V/\partial x + 2\lambda x$`, R`The constraint force is directed along the radius`, R`$\lambda$ is a constant of the motion`, R`The method works only for non-holonomic constraints`], answer: [0, 1],
      sol: R`Varying $x$ in $L + \lambda f$ gives $m\ddot x = -\partial_xV + \lambda\,\partial_xf = -\partial_xV + 2\lambda x$, and similarly for $y, z$. The constraint force $\lambda\nabla f = 2\lambda\mathbf r$ points along the radius (the normal of the sphere). $\lambda(t)$ is found along with the motion and changes with speed and position (it sets the normal force), so it is not conserved. Multipliers are the natural tool for holonomic constraints like this one; they also handle some non-holonomic ones, but are not limited to them.`,
      trap: R`Reading $\lambda$ as a fixed number: it is a function of time, fixed only by requiring the constraint to hold.` },
    { id: 'lag-r5-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'non-inertial frames', format: 'statements',
      q: R`In a frame whose origin moves with constant acceleration $\mathbf a$ (no rotation), a particle has $L = \tfrac12m\dot{\mathbf r}^2 - V(\mathbf r) - m\,\mathbf a\cdot\mathbf r$, where $V$ is static. Which statements are true?`,
      options: [R`The equation of motion contains the fictitious force $-m\mathbf a$`, R`The quantity $\tfrac12m\dot{\mathbf r}^2 + V + m\,\mathbf a\cdot\mathbf r$ is conserved`, R`If $V = 0$, the momentum $m\dot{\mathbf r}$ is conserved`, R`The term $-m\,\mathbf a\cdot\mathbf r$ can be removed by adding a total time derivative`], answer: [0, 1],
      sol: R`$\partial L/\partial\mathbf r = -\nabla V - m\mathbf a$, so $m\ddot{\mathbf r} = -\nabla V - m\mathbf a$: a uniform fictitious force. $L$ has no explicit $t$, so the energy function $h = \tfrac12m\dot{\mathbf r}^2 + V + m\mathbf a\cdot\mathbf r$ is conserved. With $V = 0$ the momentum still changes at the rate $-m\mathbf a$. A total derivative $dF(\mathbf r, t)/dt = \nabla F\cdot\dot{\mathbf r} + \partial_tF$ would need $\nabla F = 0$ and $\partial_tF = -m\mathbf a\cdot\mathbf r$ at once, which is impossible: the term changes the motion.`,
      trap: R`Thinking a fictitious force cannot affect conservation laws: it is a real uniform field in this frame, like gravity.` },
    { id: 'lag-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Routhian',
      q: R`For a particle in a plane with $L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) - V(r)$, a student uses $p_\theta = mr^2\dot\theta = \ell$ (constant) and substitutes $\dot\theta = \ell/mr^2$ straight into $L$, getting $L' = \tfrac12m\dot r^2 + \dfrac{\ell^2}{2mr^2} - V(r)$, and uses $L'$ as the Lagrangian for $r$. What goes wrong?`,
      options: [R`Nothing: $L'$ gives the correct radial equation`, R`$L'$ loses the $\dot r^2$ term`, R`The result is correct only for circular orbits`, R`The centrifugal term comes out with the wrong sign; the Routhian $L - p_\theta\dot\theta$ fixes it`], answer: 3,
      sol: R`From $L'$: $m\ddot r = -\ell^2/mr^3 - V'(r)$, an attractive "centrifugal" term, which is wrong. The right reduced function is the Routhian $R = L - p_\theta\dot\theta = \tfrac12m\dot r^2 - \dfrac{\ell^2}{2mr^2} - V$, which acts as a Lagrangian for $r$ and gives $m\ddot r = \ell^2/mr^3 - V'(r)$. Substituting a conserved momentum into $L$ before varying is not allowed, because $\dot\theta$ itself depends on $r$ through $\ell$.`,
      trap: R`The two signs only agree in the energy, where $\tfrac12m\dot r^2 + \ell^2/2mr^2 + V$ is correct; in the Lagrangian the sign flips.` },
    { id: 'lag-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'small oscillations',
      q: R`A smooth circular wire of radius $R$ lies in a horizontal plane and is forced to turn about a vertical axis through a point on its own rim at a constant 5 rad/s. A bead slides on it without friction. The period of small oscillations of the bead about its stable position is ______ s.`,
      answer: 1.257, tol: 0.013, calc: () => 2 * Math.PI / 5, unit: 's',
      sol: R`Put the pivot at the origin. The centre is at $R(\cos\omega t, \sin\omega t)$ and the bead at that point plus $R(\cos(\omega t + \theta), \sin(\omega t + \theta))$. Then $v^2 = R^2\omega^2 + R^2(\omega + \dot\theta)^2 + 2R^2\omega(\omega + \dot\theta)\cos\theta$ and $L = \tfrac12mv^2$ (no potential: the plane is horizontal). Lagrange's equation gives $\ddot\theta + \omega^2\sin\theta = 0$: a pendulum with $\omega^2$ in place of $g/l$. The stable point $\theta = 0$ is the far side of the ring from the axis, and small oscillations have angular frequency $\omega$, period $2\pi/5 = 1.257$ s, whatever $R$ is.`,
      trap: R`Expecting $R$ or $g$ in the answer: gravity does no work in a horizontal plane and $R$ cancels.` },
    { id: 'lag-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: R`A uniform heavy chain of fixed length hangs between two supports. Minimising its potential energy with the length held fixed by a multiplier $\lambda$ means making $J = \displaystyle\int (y - \lambda)\sqrt{1 + y'^2}\,dx$ stationary. Because the integrand has no explicit $x$, a first integral is`,
      options: [R`$(y - \lambda)\sqrt{1 + y'^2} = c$`, R`$\dfrac{y - \lambda}{\sqrt{1 + y'^2}} = c$`, R`$\dfrac{(y - \lambda)y'}{\sqrt{1 + y'^2}} = c$`, R`$(y - \lambda)y' = c$`], answer: 1,
      sol: R`For $F(y, y')$ the Beltrami identity gives $F - y'\,\partial F/\partial y' = c$. Here $\partial F/\partial y' = (y - \lambda)y'/\sqrt{1 + y'^2}$, so $F - y'F_{y'} = (y - \lambda)\left[\sqrt{1 + y'^2} - \dfrac{y'^2}{\sqrt{1 + y'^2}}\right] = \dfrac{y - \lambda}{\sqrt{1 + y'^2}} = c$. Solving gives the catenary $y - \lambda = c\cosh\left((x - x_0)/c\right)$.`,
      trap: R`Writing $\partial F/\partial y'$ alone (the "momentum") as the conserved quantity: that is the rule for a missing $y$, not a missing $x$.` },
    { id: 'lag-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'moving supports',
      q: R`A uniform solid disc hangs on a light string wound round its rim, with the string vertical. The upper end of the string is pulled upward with a constant acceleration chosen so that the disc's centre stays at rest while the disc spins faster and faster. The required acceleration of the string's end is ______ m/s² ($g = 9.8$ m/s²).`,
      answer: 19.6, tol: 0.2, calc: () => 2 * 9.8, unit: 'm/s²',
      sol: R`Let the string's end be at height $y_s(t)$ and the centre at $y$; no slip means $y_s - y = R\phi + \text{const}$, so $\dot\phi = (\dot y_s - \dot y)/R$. Then $L = \tfrac12m\dot y^2 + \tfrac14m(\dot y_s - \dot y)^2 - mgy$ and Lagrange's equation for $y$ is $m\ddot y - \tfrac12m(\ddot y_s - \ddot y) = -mg$. Setting $\ddot y = 0$: $\tfrac12m\ddot y_s = mg$, so $\ddot y_s = 2g = 19.6$ m/s². Check with forces: the tension must equal $mg$, and its torque $mgR = \tfrac12mR^2\alpha$ gives $\alpha = 2g/R$, so the string's end accelerates at $R\alpha = 2g$.`,
      trap: R`Answering $g$: the string must also supply the growing spin, and for a disc the needed rim acceleration is twice $g$.` },
  ],
  gens: [
    { id: 'lag-r5g1', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'constrained motion',
      make(r) {
        const m1 = int(r, 3, 8), m2 = int(r, 1, 3), a = choose(r, [20, 30, 37, 45, 53, 60]);
        const s = Math.sin(a * Math.PI / 180), acc = g * (m1 - m2 * s) / (m1 + m2), answer = round(acc, 3);
        return { q: R`A ${m1} kg block hangs from a light string over a light smooth pulley at the top of a fixed smooth incline of $${a}^\circ$; the other end holds a ${m2} kg block on the incline. Find the magnitude of the acceleration in m/s² ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'm/s²', m1, m2, a,
          sol: R`With $x$ the drop of the hanging block, $L = \tfrac12(${m1} + ${m2})\dot x^2 + ${m1}gx - ${m2}gx\sin${a}^\circ$. So $\ddot x = \dfrac{g(${m1} - ${m2}\sin${a}^\circ)}{${m1 + m2}} = ${answer}$ m/s².`,
          trap: 'Only the component of the second block\'s weight along the slope enters.' };
      },
      verify: (p) => g * (p.m1 - p.m2 * Math.sin(p.a * Math.PI / 180)) / (p.m1 + p.m2) },
    { id: 'lag-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'small oscillations',
      make(r) {
        const w = pick(r, 2, 12, 0.5), Rr = pick(r, 0.1, 1, 0.1), answer = round(2 * Math.PI / w, 3);
        return { q: R`A smooth horizontal circular wire of radius ${Rr} m is turned at a constant ${w} rad/s about a vertical axis through a point on its rim. Find the period (s) of small oscillations of a bead on the wire about its stable position.`,
          answer, tol: Math.max(0.005, answer * 0.01), unit: 's', w,
          sol: R`With $\theta$ the bead's angle on the ring measured from the far side of the axis, Lagrange's equation is $\ddot\theta + \omega^2\sin\theta = 0$, so small oscillations have angular frequency $\omega$ and period $2\pi/${w} = ${answer}$ s. The radius cancels.`,
          trap: 'The radius is a distractor; gravity does no work in the horizontal plane.' };
      },
      verify: (p) => 2 * Math.PI / p.w },
    { id: 'lag-r5g3', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rolling constraints',
      make(r) {
        const B = choose(r, [['thin ring', 1], ['uniform solid disc', 0.5], ['thin spherical shell (string wound round its equator)', 2 / 3], ['uniform solid ball (string wound round its equator)', 0.4]]);
        const acc = (k) => g / (1 + k);
        const o = mcqOptions(r, acc(B[1]), [g, ...[1, 0.5, 2 / 3, 0.4].filter((k) => k !== B[1]).map(acc)], (v) => `${round(v, 2)} m/s²`);
        return { q: R`A ${B[0]} of radius $R$ has a light string wound round it; the free end is tied to a fixed support and the body falls with the string vertical, unwinding without slipping. The acceleration of its centre is ($g = 9.8$ m/s²)`,
          ...o,
          sol: R`With $I = kmR^2$ ($k = ${round(B[1], 3)}$) and $\dot\phi = \dot y/R$: $T = \tfrac12m(1 + k)\dot y^2$, $V = -mgy$, so $\ddot y = g/(1 + k) = ${round(acc(B[1]), 2)}$ m/s².`,
          trap: 'The rotational energy slows the fall: the more of the mass sits far from the axis, the smaller the acceleration.' };
      } },
  ],
};
