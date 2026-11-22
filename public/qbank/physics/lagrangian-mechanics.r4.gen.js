// Round 4 extras for lagrangian-mechanics: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'lag-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'degrees of freedom',
      q: R`A thin rigid rod moves in a fixed vertical plane, and one end of it is forced to slide along a fixed horizontal straight line in that plane. The number of degrees of freedom is`,
      options: ['1', '2', '3', '4'], answer: 1,
      sol: R`A rigid body moving in a plane needs 3 numbers: the two coordinates of one point and one angle. Forcing the end to stay on the line fixes that end's height, one constraint. So $3 - 1 = 2$: the position of the end along the line and the angle of the rod.`,
      trap: R`Counting 3 forgets the constraint; counting 1 treats the rod as if it could only slide (or only swing).` },
    { id: 'lag-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'moving supports',
      q: R`A simple pendulum (length $l$) hangs from the ceiling of a lift whose support moves as $y_s(t)$ with constant upward acceleration $\ddot y_s = a$. From the Lagrangian in the angle $\theta$, the angular frequency of small oscillations is`,
      options: [R`$\sqrt{(g + a)/l}$`, R`$\sqrt{(g - a)/l}$`, R`$\sqrt{g/l}$`, R`$\sqrt{(g^2 + a^2)^{1/2}/l}$`], answer: 0,
      sol: R`The bob is at $x = l\sin\theta$, $y = y_s - l\cos\theta$. So $T = \tfrac12m(l^2\dot\theta^2 + \dot y_s^2 + 2l\dot y_s\sin\theta\,\dot\theta)$ and $V = mg(y_s - l\cos\theta)$. The cross term gives $\dfrac{d}{dt}(ml\dot y_s\sin\theta) - ml\dot y_s\cos\theta\,\dot\theta = mla\sin\theta$. The full equation is $ml^2\ddot\theta + ml(g + a)\sin\theta = 0$, so for small swings $\omega = \sqrt{(g + a)/l}$: an upward acceleration acts like extra gravity.`,
      trap: R`$\sqrt{(g^2 + a^2)^{1/2}/l}$ is the answer for a horizontal acceleration, where the effective gravity is tilted, not increased.` },
    { id: 'lag-r4-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'equivalent Lagrangians',
      q: R`For the Lagrangian $L = \tfrac12\dot q^2 - \tfrac12q^2 + \epsilon q^2\dot q$ (with $\epsilon$ a constant), the equation of motion is`,
      options: [R`$\ddot q + q + 2\epsilon q\dot q = 0$`, R`$\ddot q + q - 2\epsilon q\dot q = 0$`, R`$\ddot q + q + 4\epsilon q\dot q = 0$`, R`$\ddot q + q = 0$`], answer: 3,
      sol: R`$\partial L/\partial\dot q = \dot q + \epsilon q^2$, so $\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot q} = \ddot q + 2\epsilon q\dot q$. Also $\partial L/\partial q = -q + 2\epsilon q\dot q$. Setting them equal, the $2\epsilon q\dot q$ terms cancel: $\ddot q + q = 0$. This had to happen: $\epsilon q^2\dot q = \dfrac{d}{dt}\left(\tfrac13\epsilon q^3\right)$ is a total time derivative, which never changes the equations of motion.`,
      trap: R`Keeping only one of the two $2\epsilon q\dot q$ terms (from the time derivative or from $\partial L/\partial q$) gives a fake damping term.` },
    { id: 'lag-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'constrained motion',
      q: R`A bead slides without friction on a rigid wire bent into a helix of radius $a = 0.3$ m with a vertical axis: $x = a\cos\phi$, $y = a\sin\phi$, $z = b\phi$ with $b = 0.1$ m per radian. Take $g = 9.8$ m/s². The magnitude of the bead's vertical acceleration is ______ m/s² (to two decimal places).`,
      answer: 0.98, tol: 0.01, calc: () => 9.8 * 0.01 / (0.09 + 0.01), unit: 'm/s²',
      sol: R`Use $z$ as the one generalised coordinate: $\phi = z/b$, so the speed squared is $a^2\dot\phi^2 + \dot z^2 = (1 + a^2/b^2)\dot z^2$. Then $L = \tfrac12m(1 + a^2/b^2)\dot z^2 - mgz$ and $m(1 + a^2/b^2)\ddot z = -mg$. So $|\ddot z| = \dfrac{gb^2}{a^2 + b^2} = \dfrac{9.8\times0.01}{0.09 + 0.01} = 0.98$ m/s². The helix is just an inclined plane wrapped round a cylinder, with $\sin^2$ of its slope equal to $b^2/(a^2 + b^2)$.`,
      trap: R`Answering $g\,b/\sqrt{a^2 + b^2}$ (the acceleration along the wire) instead of its vertical part, which carries one more factor $b/\sqrt{a^2 + b^2}$.` },
    { id: 'lag-r4-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: "Noether's theorem", format: 'statements',
      q: R`A particle moves with $L = \tfrac12m(\dot\rho^2 + \rho^2\dot\phi^2 + \dot z^2) - V(\rho, z - b\phi)$ in cylindrical coordinates, where $b$ is a constant and $V$ is an arbitrary smooth function (a screw-shaped potential). With $L_z = p_\phi$, which quantities are conserved?`,
      options: [R`$p_z$ alone`, R`$L_z + bp_z$`, R`$L_z$ alone`, R`The energy $\tfrac12m(\dot\rho^2 + \rho^2\dot\phi^2 + \dot z^2) + V$`], answer: [1, 3],
      sol: R`The screw motion $\phi \to \phi + \epsilon$, $z \to z + b\epsilon$ leaves $z - b\phi$ and $\rho$ unchanged, so $L$ is unchanged. Noether's charge is $p_\phi\,\delta\phi/\epsilon + p_z\,\delta z/\epsilon = L_z + bp_z$. Check: $\dot p_z = -\partial_2V$ and $\dot p_\phi = +b\,\partial_2V$ (where $\partial_2V$ is the derivative with respect to the second argument), so $\dot p_\phi + b\dot p_z = 0$. $L$ has no explicit $t$, so the energy is conserved. $p_z$ and $L_z$ separately change whenever $\partial_2V \ne 0$.`,
      trap: R`Neither $\phi$ nor $z$ is cyclic on its own, but a combined shift can still be a symmetry.` },
    { id: 'lag-r4-06', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'kinetic energy',
      q: R`A double pendulum has bob $m_1$ on a light rod $l_1$ from a fixed pivot and bob $m_2$ on a light rod $l_2$ hanging from $m_1$; the rods make angles $\theta_1$, $\theta_2$ with the downward vertical and move in one vertical plane. The kinetic energy is`,
      options: [R`$\tfrac12(m_1 + m_2)l_1^2\dot\theta_1^2 + \tfrac12m_2l_2^2\dot\theta_2^2 + m_2l_1l_2\dot\theta_1\dot\theta_2\cos(\theta_1 + \theta_2)$`, R`$\tfrac12m_1l_1^2\dot\theta_1^2 + \tfrac12m_2l_2^2\dot\theta_2^2 + m_2l_1l_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)$`, R`$\tfrac12(m_1 + m_2)l_1^2\dot\theta_1^2 + \tfrac12m_2l_2^2\dot\theta_2^2 + m_2l_1l_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)$`, R`$\tfrac12(m_1 + m_2)l_1^2\dot\theta_1^2 + \tfrac12m_2l_2^2\dot\theta_2^2 + m_2l_1l_2\dot\theta_1\dot\theta_2\sin(\theta_1 - \theta_2)$`], answer: 2,
      sol: R`Bob 1 moves at $l_1\dot\theta_1$. Bob 2's velocity is the sum of $l_1\dot\theta_1$ (perpendicular to rod 1) and $l_2\dot\theta_2$ (perpendicular to rod 2). The angle between these two vectors equals the angle between the rods, $\theta_1 - \theta_2$, so $v_2^2 = l_1^2\dot\theta_1^2 + l_2^2\dot\theta_2^2 + 2l_1l_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)$. Adding $\tfrac12m_1v_1^2 + \tfrac12m_2v_2^2$ gives the expression with $(m_1 + m_2)$ in front of $\dot\theta_1^2$ and $\cos(\theta_1 - \theta_2)$ in the cross term.`,
      trap: R`Bob 2 also carries the motion of bob 1, so $m_2$ appears in the $\dot\theta_1^2$ term; and the cross term depends on the angle between the rods, $\theta_1 - \theta_2$.` },
    { id: 'lag-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'small oscillations', format: 'numeric',
      q: R`A spring pendulum: a 0.2 kg bob hangs on a light spring of stiffness 20 N/m and natural length 0.4 m and can swing in a vertical plane, with $L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) + mgr\cos\theta - \tfrac12k(r - l_0)^2$. Take $g = 9.8$ m/s². The ratio of the small-oscillation angular frequency of stretching to that of swinging, $\omega_r/\omega_\theta$, is ______ (to two decimal places).`,
      answer: 2.25, tol: 0.02, calc: () => Math.sqrt(1 + 20 * 0.4 / (0.2 * 9.8)),
      sol: R`Equilibrium: $\theta = 0$ and $k(r_0 - l_0) = mg$, so $r_0 = 0.4 + 0.2\times9.8/20 = 0.498$ m. Linearising the $r$ equation, $m\ddot r = -k(r - r_0)$ (the $r\dot\theta^2$ term is second order): $\omega_r = \sqrt{k/m} = 10$ rad/s. The $\theta$ equation at $r = r_0$: $r_0\ddot\theta = -g\theta$, so $\omega_\theta = \sqrt{g/r_0} = \sqrt{19.68} = 4.436$ rad/s. Ratio $= 10/4.436 = 2.25$. (In closed form, $\omega_r/\omega_\theta = \sqrt{1 + kl_0/mg}$.)`,
      trap: R`Using the natural length $l_0$ instead of the stretched length $r_0$ in $\omega_\theta$ gives 2.02.` },
    { id: 'lag-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'equivalent Lagrangians',
      q: R`Let $L_0 = \tfrac12\dot q^2 - \tfrac12q^2$. Which Lagrangian does NOT give the same equation of motion as $L_0$?`,
      options: [R`$L_0 + 2q\dot q$`, R`$5L_0 - 7$`, R`$L_0 + t\dot q$`, R`$L_0 + e^{q}\dot q$`], answer: 2,
      sol: R`Multiplying by a constant or adding a constant leaves the equation unchanged, and so does adding a total time derivative $dF(q, t)/dt$. $2q\dot q = \dfrac{d}{dt}q^2$ and $e^q\dot q = \dfrac{d}{dt}e^q$ are total derivatives. But $t\dot q = \dfrac{d}{dt}(tq) - q$: apart from a total derivative it adds $-q$ to $L$, a constant force. Directly: $\dfrac{d}{dt}(\dot q + t) - (-q) = 0$ gives $\ddot q + q + 1 = 0$, not $\ddot q + q = 0$.`,
      trap: R`$t\dot q$ looks like a total derivative but is not one: $\dfrac{d}{dt}(tq)$ also produces $q$.` },
    { id: 'lag-r4-09', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: R`A soap film spans two coaxial circular rings of radius $R$ a distance $d$ apart (gravity and pressure difference neglected). Minimising the area of the surface of revolution gives a catenoid $\rho = a\cosh(x/a)$, with $x$ measured from the midpoint. Such a smooth film exists only while $d/R$ is below about`,
      options: ['1.33', '0.66', '2.00', R`$\pi/2 \approx 1.57$`], answer: 0,
      sol: R`Area $= 2\pi\int\rho\sqrt{1 + \rho'^2}\,dx$; $x$ does not appear, so $\rho/\sqrt{1 + \rho'^2} = a$ is constant (a first integral), giving $\rho = a\cosh(x/a)$. The film must pass through the rings: $R = a\cosh(d/2a)$. Write $s = d/2a$; then $\dfrac{d}{2R} = \dfrac{s}{\cosh s}$. This has a maximum where $s\tanh s = 1$, at $s \approx 1.200$ with $\cosh s \approx 1.810$, so $d/2R \le 0.663$, that is $d/R \le 1.33$. Pulled further apart, the film snaps into two flat discs.`,
      trap: R`0.66 is the limit on $d/2R$ (distance over diameter), not on $d/R$.` },
    { id: 'lag-r4-10', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Euler-Lagrange equations',
      q: R`A particle of mass 1 kg moves in a plane with $L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) + \dfrac{k}{r}$, where $k = 4$ N m². At an instant when $r = 2$ m, $\dot r = 0$ and $\dot\theta = 3$ rad/s, the value of $\ddot r$ is ______ m/s².`,
      answer: 17, tol: 0, calc: () => 2 * 9 - 4 / 4, unit: 'm/s²',
      sol: R`The $r$ equation: $\dfrac{d}{dt}(m\dot r) = \dfrac{\partial L}{\partial r} = mr\dot\theta^2 - \dfrac{k}{r^2}$. So $\ddot r = r\dot\theta^2 - \dfrac{k}{mr^2} = 2\times9 - \dfrac{4}{1\times4} = 18 - 1 = 17$ m/s².`,
      trap: R`$+k/r$ in $L$ means $V = -k/r$, an attraction, so the force term is $-k/r^2$; flipping the sign gives 19.` },
    { id: 'lag-r4-11', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'generalised coordinates', format: 'statements',
      q: R`Which statements about generalised coordinates $q_j$, generalised forces $Q_j$ and conjugate momenta $p_j = \partial L/\partial\dot q_j$ are correct?`,
      options: [R`A generalised coordinate need not have the dimension of length`, R`For a holonomic system the number of independent generalised coordinates equals the number of degrees of freedom`, R`$Q_j\,\delta q_j$ always has the dimension of work`, R`$p_j$ always equals $m\dot q_j$`], answer: [0, 1, 2],
      sol: R`Angles, areas or any other parameters can serve as coordinates. Holonomic constraints can be solved to remove coordinates, leaving exactly as many as there are degrees of freedom. The virtual work is $\sum_jQ_j\,\delta q_j$, so each $Q_j\,\delta q_j$ is an energy: if $q_j$ is an angle, $Q_j$ is a torque. $p_j = m\dot q_j$ only for a Cartesian coordinate of a free particle: for an angle, $p_\theta = mr^2\dot\theta$, and for a charge in a field $\mathbf p = m\mathbf v + q\mathbf A$.`,
      trap: R`Conjugate momentum is defined from $L$, not as mass times velocity.` },
    { id: 'lag-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'small oscillations', format: 'numeric',
      q: R`A spherical pendulum (angle $\theta$ from the downward vertical, azimuth $\phi$) moves steadily on a horizontal circle at $\theta_0 = 60^\circ$. When nudged, $\theta$ oscillates about $\theta_0$ with angular frequency $\omega$. The ratio $\omega/\dot\phi$ (with $\dot\phi$ the steady precession rate) is ______ (to two decimal places).`,
      answer: 1.32, tol: 0.01, calc: () => Math.sqrt(1 + 3 * 0.25),
      sol: R`$L = \tfrac12ml^2(\dot\theta^2 + \sin^2\theta\,\dot\phi^2) + mgl\cos\theta$. $\phi$ is cyclic: $h = \sin^2\theta\,\dot\phi$ is constant. The $\theta$ equation: $\ddot\theta = \dfrac{h^2\cos\theta}{\sin^3\theta} - \dfrac gl\sin\theta \equiv f(\theta)$. Steady motion $f(\theta_0) = 0$ gives $\dot\phi^2 = \dfrac{g}{l\cos\theta_0}$. Then $f'(\theta_0) = -\dfrac gl\,\dfrac{1 + 3\cos^2\theta_0}{\cos\theta_0}$, so $\omega^2 = \dot\phi^2(1 + 3\cos^2\theta_0)$ and $\omega/\dot\phi = \sqrt{1 + 3\times0.25} = \sqrt{1.75} = 1.32$.`,
      trap: R`Ignoring the $h^2$ term when differentiating gives $\omega^2 = (g/l)\cos\theta_0$, the plane-pendulum answer, which misses the centrifugal stiffness.` },
  ],
  gens: [
    { id: 'lag-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'constrained motion',
      make(r) {
        const a = pick(r, 0.1, 0.5, 0.05), b = pick(r, 0.05, 0.3, 0.05);
        const acc = g * b * b / (a * a + b * b), answer = round(acc, 3);
        return { q: R`A bead slides without friction on a helical wire of radius ${a} m with a vertical axis, rising ${b} m per radian of turn ($z = b\phi$). Find the magnitude of its vertical acceleration in m/s² ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'm/s²', a, b,
          sol: R`With $\phi = z/b$, the speed squared is $(1 + a^2/b^2)\dot z^2$, so $L = \tfrac12m(1 + a^2/b^2)\dot z^2 - mgz$ and $|\ddot z| = \dfrac{gb^2}{a^2 + b^2} = \dfrac{9.8\times${b}^2}{${a}^2 + ${b}^2} = ${answer}$ m/s².`,
          trap: 'The rotation round the axis carries kinetic energy too, so the bead falls slower than $g$.' };
      },
      verify: (p) => g * p.b * p.b / (p.a * p.a + p.b * p.b) },
    { id: 'lag-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'small oscillations',
      make(r) {
        const m = pick(r, 0.1, 0.5, 0.1), k = int(r, 10, 50), l0 = pick(r, 0.2, 1, 0.1);
        const r0 = l0 + m * g / k, answer = round(Math.sqrt(1 + k * l0 / (m * g)), 3);
        return { q: R`A ${m} kg bob hangs on a light spring (stiffness ${k} N/m, natural length ${l0} m) and can both stretch and swing in a vertical plane. Find the ratio $\omega_r/\omega_\theta$ of the small-oscillation angular frequencies of stretching and swinging ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), m, k, l0,
          sol: R`$L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) + mgr\cos\theta - \tfrac12k(r - l_0)^2$. Equilibrium length $r_0 = l_0 + mg/k = ${round(r0, 4)}$ m. Linearising: $\omega_r = \sqrt{k/m} = ${round(Math.sqrt(k / m), 3)}$ rad/s and $\omega_\theta = \sqrt{g/r_0} = ${round(Math.sqrt(g / r0), 3)}$ rad/s. Ratio $= \sqrt{1 + kl_0/mg} = ${answer}$.`,
          trap: 'The swing frequency uses the stretched length $r_0$, not the natural length.' };
      },
      verify: (p) => Math.sqrt(1 + p.k * p.l0 / (p.m * g)) },
    { id: 'lag-r4g3', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'moving supports',
      make(r) {
        const l = pick(r, 0.5, 2, 0.25), a = pick(r, 1, 4, 0.5), up = choose(r, [true, false]);
        const T = (ge) => 2 * Math.PI * Math.sqrt(l / ge);
        const right = T(up ? g + a : g - a), wrongs = [T(up ? g - a : g + a), T(g), T(Math.hypot(g, a))];
        const o = mcqOptions(r, right, wrongs, (v) => `${round(v, 3)} s`);
        return { q: R`A simple pendulum of length ${l} m hangs in a lift whose acceleration is ${a} m/s² directed ${up ? 'upward' : 'downward'}. Using the Lagrangian with the moving support, the period of small oscillations is ($g = 9.8$ m/s²)`,
          ...o,
          sol: R`With the support at $y_s(t)$, the cross term $ml\dot y_s\sin\theta\,\dot\theta$ in $T$ adds $ml\ddot y_s\sin\theta$ to the equation: $l\ddot\theta = -(g + \ddot y_s)\sin\theta$. Here $\ddot y_s = ${up ? '+' : '-'}${a}$ m/s², so $g_{\rm eff} = ${round(up ? g + a : g - a, 2)}$ m/s² and $T = 2\pi\sqrt{${l}/${round(up ? g + a : g - a, 2)}} = ${round(right, 3)}$ s.`,
          trap: 'Accelerating up increases the effective gravity (shorter period); accelerating down decreases it. The direction of the velocity does not matter.' };
      } },
  ],
};
