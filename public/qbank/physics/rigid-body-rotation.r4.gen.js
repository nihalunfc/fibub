// Round 4 extras for rigid-body-rotation: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;
const deg = (x) => (x * 180) / Math.PI;

export default {
  items: [
    { id: 'rbr-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'torque',
      q: R`A force $\vec F = 2\hat i$ N acts at the point $\vec r = 3\hat j$ m. Its torque about the origin is`,
      options: [R`$6\hat k$ N m`, R`$6\hat i$ N m`, R`$0$`, R`$-6\hat k$ N m`], answer: 3,
      sol: R`$\vec\tau = \vec r\times\vec F = 3\hat j\times2\hat i = 6(\hat j\times\hat i) = -6\hat k$ N m. The force pushes along $+x$ at a point on the $+y$ axis, turning things clockwise seen from $+z$: hence $-\hat k$.`,
      trap: R`The order matters: $\vec F\times\vec r$ would give $+6\hat k$.` },
    { id: 'rbr-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'rotational energy',
      q: R`A flywheel of moment of inertia 5.0 kg m² turns at 300 rev/min. A brake with a steady torque stops it in 20 revolutions. The braking torque is ______ N m (two decimal places).`,
      answer: 19.63, tol: 0.05, unit: 'N m', calc: () => (0.5 * 5 * (300 * 2 * Math.PI / 60) ** 2) / (20 * 2 * Math.PI),
      sol: R`$\omega = 300\times2\pi/60 = 10\pi = 31.42$ rad/s, so the kinetic energy is $\tfrac12\times5\times(31.42)^2 = 2467$ J. Work–energy for rotation: $\tau\theta = \tfrac12I\omega^2$ with $\theta = 20\times2\pi = 125.7$ rad. $\tau = 2467/125.7 = 19.63$ N m.`,
      trap: R`The angle must be in radians: using 20 (revolutions) for $\theta$ gives a torque $2\pi$ times too big.` },
    { id: 'rbr-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'rolling',
      q: R`A uniform solid sphere and a thin hollow sphere of the same mass and radius roll without slipping at the same speed. Which has more kinetic energy?`,
      options: ['the hollow sphere', 'the solid sphere', 'both the same, as mass and speed are the same', 'it depends on the radius'], answer: 0,
      sol: R`Rolling: $K = \tfrac12Mv^2\left(1 + \dfrac{I}{MR^2}\right)$. Solid: $1 + \tfrac25 = 1.4$. Hollow: $1 + \tfrac23 = 1.67$. The hollow sphere's mass sits farther out, so it has more rotational energy at the same speed (by a factor $1.67/1.4 = 1.19$ overall).`,
      trap: R`Equal mass and speed give equal translational energy only; the rotational parts differ.` },
    { id: 'rbr-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'rolling', format: 'statements',
      q: R`A uniform solid cylinder (mass $M$) rests on a rough floor. A horizontal force $F$ is applied by a string wound round it and leaving from the top of the cylinder; it rolls without slipping. Which statements are correct?`,
      options: [R`Its centre accelerates at $4F/(3M)$`, R`Friction from the floor acts in the same direction as $F$, with size $F/3$`, 'Friction is zero, because it rolls without slipping', R`If instead $F$ were applied at the centre (at the axle), friction would act opposite to $F$, with size $F/3$`], answer: [0, 1, 3],
      sol: R`Let friction $f$ act forwards. $Ma = F + f$; torque about the centre: $FR - fR = \tfrac12MR^2\alpha$ with $\alpha = a/R$, so $F - f = \tfrac12Ma$. Adding: $2F = \tfrac32Ma$, $a = \dfrac{4F}{3M}$, and $f = Ma - F = F/3$, forwards. With $F$ at the axle: $Ma = F - f$, $fR = \tfrac12MR^2(a/R)$, giving $a = \dfrac{2F}{3M}$ and $f = F/3$ backwards. Rolling without slipping fixes the speed of the contact point, not the friction force.`,
      trap: R`Friction's direction is not fixed by the motion: work it out from the equations.` },
    { id: 'rbr-r4-05', type: 'nat', level: 3, exams: ['jam'], sub: 'angular momentum',
      q: R`A 0.20 kg ball is thrown at 20 m/s at $30^\circ$ above the horizontal. At the top of its flight, the size of its angular momentum about the launch point is ______ kg m²/s ($g = 9.8$ m/s², no air drag, two decimal places).`,
      answer: 17.67, tol: 0.05, unit: 'kg m²/s', calc: () => 0.2 * 20 * Math.cos(Math.PI / 6) * ((20 * Math.sin(Math.PI / 6)) ** 2 / (2 * 9.8)),
      sol: R`At the top the velocity is horizontal, $v_x = 20\cos30^\circ = 17.32$ m/s, and the ball is at height $H = \dfrac{(20\sin30^\circ)^2}{2g} = 5.10$ m. $|\vec L| = |\vec r\times m\vec v| = m v_x H = 0.2\times17.32\times5.10 = 17.67$ kg m²/s (only the height is the lever arm for a horizontal momentum). It is not conserved: gravity exerts a torque about the launch point.`,
      trap: R`Using the full distance from the launch point as the lever arm overcounts; only the perpendicular distance (the height) counts.` },
    { id: 'rbr-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'rolling',
      q: R`A rear-wheel-drive car speeds up on a level road with no wheel slipping. The friction forces from the road on its rear (driven) and front (free-turning) wheels point`,
      options: ['both backwards', 'both forwards', 'forwards on the rear wheels, backwards on the front wheels', 'backwards on the rear wheels, forwards on the front wheels'], answer: 2,
      sol: R`The engine twists the rear wheels; to stop their contact points slipping backwards, the road pushes them forwards. This forward friction is what accelerates the car. The front wheels are just carried along: to make them spin up as the car speeds up, the road must apply a torque, which it does with a small backward friction at their contact points.`,
      trap: R`Friction is not always "against the motion of the car"; it opposes slipping at each contact point.` },
    { id: 'rbr-r4-07', type: 'nat', level: 4, exams: ['jam'], sub: 'hinged rods',
      q: R`A uniform rod 1.0 m long hangs from a frictionless universal joint at its top end and is made to turn steadily about the vertical line through the joint at 5.0 rad/s, sweeping out a cone. The angle between the rod and the vertical is ______ degrees ($g = 9.8$ m/s², one decimal place).`,
      answer: 54.0, tol: 0.1, unit: '°', calc: () => deg(Math.acos((3 * 9.8) / (2 * 1 * 25))),
      sol: R`In the rotating frame, balance torques about the joint. Gravity: $Mg\tfrac L2\sin\theta$. Centrifugal force on an element at distance $s$ along the rod is $\lambda\,ds\,\omega^2s\sin\theta$, with lever arm $s\cos\theta$ about the joint, giving $\tfrac13M\omega^2L^2\sin\theta\cos\theta$ in total. Equating: $\cos\theta = \dfrac{3g}{2\omega^2L} = \dfrac{29.4}{50} = 0.588$, so $\theta = 54.0^\circ$. (Below $\omega^2 = 3g/(2L)$ the rod just hangs straight.)`,
      trap: R`Treating the rod as a point mass at its centre gives $\cos\theta = 2g/(\omega^2L)$; the mass spread along the rod changes the factor to $3/2$.` },
    { id: 'rbr-r4-08', type: 'mcq', level: 4, exams: ['jam'], sub: 'collisions with rotation',
      q: R`Two identical uniform discs turn on fixed, parallel, frictionless axles. One spins at $\omega_0$ and the other is at rest. Their rims are brought into contact and rub until they roll on each other without slipping. The fraction of the starting kinetic energy lost is`,
      options: ['none', 'one half', 'one quarter', 'three quarters'], answer: 1,
      sol: R`The friction force $f$ at the contact acts on both rims with the same lever arm $R$, so the two discs receive angular impulses of the same size: $I(\omega_0 - \omega_1) = I\omega_2$. No slipping means equal rim speeds: $\omega_1 = \omega_2$. So each ends at $\omega_0/2$ (turning in opposite senses). Final energy $= 2\times\tfrac12I(\omega_0/2)^2 = \tfrac14I\omega_0^2$, half the initial $\tfrac12I\omega_0^2$. Total angular momentum is not conserved here: the axles push on the discs.`,
      trap: R`Assuming total angular momentum is conserved fails: the fixed axles exert external forces with torques about any single axis.` },
    { id: 'rbr-r4-09', type: 'msq', level: 3, exams: ['jam'], sub: 'angular momentum', format: 'statements',
      q: R`A child stands at the rim of a merry-go-round that turns freely on a frictionless vertical axle, and walks slowly to the centre. Which statements are correct?`,
      options: ['The angular momentum of the child plus merry-go-round about the axle stays the same', 'The merry-go-round turns faster', 'The total kinetic energy increases', "The child's own angular momentum stays the same"], answer: [0, 1, 2],
      sol: R`The axle is frictionless and vertical, so no external torque acts about it: the total angular momentum is conserved. Moving mass inwards lowers the moment of inertia, so $\omega$ rises. $K = L^2/(2I)$ grows as $I$ falls; the extra energy comes from the work the child does pulling herself inwards against the centrifugal tendency. Her own angular momentum falls (to zero at the centre); it is handed to the merry-go-round through friction at her feet.`,
      trap: R`Kinetic energy is not conserved when someone does work inside the system.` },
    { id: 'rbr-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'hinged rods',
      q: R`A uniform ladder 5.0 m long leans at $30^\circ$ to the vertical against a smooth wall on a smooth floor, and is released from rest. It slides down until its top leaves the wall. By then the top has dropped through ______ m (two decimal places).`,
      answer: 1.44, tol: 0.01, unit: 'm', calc: () => (5 * Math.cos(Math.PI / 6)) / 3,
      sol: R`While in contact, the centre of mass moves on a circle of radius $L/2$ about the corner: $(\tfrac L2\sin\theta, \tfrac L2\cos\theta)$, with $\theta$ from the vertical. Energy (translation of the centre plus rotation about it): $\tfrac12\left(\tfrac{ML^2}{4} + \tfrac{ML^2}{12}\right)\dot\theta^2 = Mg\tfrac L2(\cos\theta_0 - \cos\theta)$, so $\dot\theta^2 = \dfrac{3g}{L}(\cos\theta_0 - \cos\theta)$. The wall's push is $M\ddot x_{\rm cm}$; it falls to zero when $\dfrac{d}{dt}(\cos\theta\,\dot\theta) = 0$, which gives $\cos\theta = \tfrac23\cos\theta_0$. The top's height falls from $L\cos\theta_0 = 4.33$ m to $\tfrac23$ of that, a drop of $\tfrac13\times4.33 = 1.44$ m.`,
      trap: R`The top does not stay on the wall all the way down; it leaves when its height is two thirds of the starting height.` },
  ],
  gens: [
    { id: 'rbr-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'rotational energy',
      make(r) {
        const I = pick(r, 0.5, 8, 0.5), rpm = pick(r, 120, 1200, 60), n = int(r, 5, 50);
        const w = (rpm * 2 * Math.PI) / 60, answer = round((0.5 * I * w * w) / (n * 2 * Math.PI), 3);
        return { q: R`A flywheel of moment of inertia ${I} kg m² turns at ${rpm} rev/min. A brake with a steady torque stops it in ${n} revolutions. Find the braking torque in N m.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'N m', I, rpm, n,
          sol: R`$\omega = ${rpm}\times2\pi/60 = ${round(w, 3)}$ rad/s; $K = \tfrac12I\omega^2 = ${round(0.5 * I * w * w, 2)}$ J; $\theta = ${n}\times2\pi = ${round(n * 2 * Math.PI, 2)}$ rad. $\tau = K/\theta = ${answer}$ N m.`,
          trap: 'Convert revolutions to radians before using work = torque × angle.' };
      },
      verify: (p) => { const w = (p.rpm * 2 * Math.PI) / 60; return (0.5 * p.I * w * w) / (p.n * 2 * Math.PI); } },
    { id: 'rbr-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'hinged rods',
      make(r) {
        const L = pick(r, 0.4, 2, 0.2), w = round(Math.sqrt((3 * g) / (2 * L)) + pick(r, 0.5, 6, 0.5), 1);
        const answer = round(deg(Math.acos((3 * g) / (2 * w * w * L))), 2);
        return { q: R`A uniform rod ${L} m long hangs from a frictionless joint at its top end and is spun steadily about the vertical through the joint at ${w} rad/s, sweeping out a cone. Find the angle (degrees) between the rod and the vertical ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.05, answer * 0.003), unit: '°', L, w,
          sol: R`Torques about the joint in the rotating frame: $Mg\tfrac L2\sin\theta = \tfrac13M\omega^2L^2\sin\theta\cos\theta$, so $\cos\theta = \dfrac{3g}{2\omega^2L} = ${round((3 * g) / (2 * w * w * L), 4)}$ and $\theta = ${answer}^\circ$.`,
          trap: 'A rod is not a point mass at its centre: the factor is 3g/2, not g.' };
      },
      verify: (p) => deg(Math.acos((3 * g) / (2 * p.w * p.w * p.L))) },
    { id: 'rbr-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'hinged rods',
      make(r) {
        const L = pick(r, 2, 8, 0.5), th = choose(r, [10, 15, 20, 25, 30, 35, 40, 45]);
        const c0 = Math.cos((th * Math.PI) / 180), answer = round((L * c0) / 3, 3);
        return { q: R`A uniform ladder ${L} m long leans at $${th}^\circ$ to the vertical against a smooth wall, on a smooth floor, and is released from rest. Through what height (m) has its top fallen when it leaves the wall?`,
          answer, tol: Math.max(0.005, answer * 0.005), unit: 'm', L, th,
          sol: R`While touching the wall, $\dot\theta^2 = \dfrac{3g}{L}(\cos\theta_0 - \cos\theta)$, and the wall force vanishes when $\cos\theta = \tfrac23\cos\theta_0$. The top's height $L\cos\theta$ has then fallen by $\tfrac13L\cos\theta_0 = \tfrac13\times${L}\times\cos${th}^\circ = ${answer}$ m.`,
          trap: 'Contact is lost at two thirds of the starting height, whatever the starting angle.' };
      },
      verify: (p) => (p.L * Math.cos((p.th * Math.PI) / 180)) / 3 },
  ],
};
