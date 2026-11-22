// Round 4 extras for rigid-body-dynamics: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'rbd-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'moments of inertia',
      q: R`The perpendicular-axis theorem $I_z = I_x + I_y$ holds for`,
      options: ['any rigid body, with the axes through its centre of mass', 'any body with an axis of symmetry along $z$', 'a flat body lying in the $xy$ plane, with the three axes meeting at a point of that plane', 'circular discs and rings only'], answer: 2,
      sol: R`$I_x = \sum m(y^2 + z^2)$ and $I_y = \sum m(x^2 + z^2)$, so $I_x + I_y = \sum m(x^2 + y^2) + 2\sum mz^2 = I_z + 2\sum mz^2$. This equals $I_z$ only when every mass element has $z = 0$: a lamina in the $xy$ plane. The meeting point can be anywhere in the plane, not just the centre of mass.`,
      trap: R`It is the parallel-axis theorem that works for any body; the perpendicular-axis theorem needs a flat body.` },
    { id: 'rbd-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rolling',
      q: R`A uniform solid ball rolls without slipping along a level floor. The fraction of its kinetic energy that is rotational is`,
      options: [R`$\tfrac25$`, R`$\tfrac27$`, R`$\tfrac57$`, R`$\tfrac12$`], answer: 1,
      sol: R`Rolling: $\omega = v/R$. $K_{\rm rot} = \tfrac12\cdot\tfrac25mR^2\omega^2 = \tfrac15mv^2$ and $K_{\rm trans} = \tfrac12mv^2$. Fraction: $\dfrac{1/5}{1/2 + 1/5} = \dfrac{2}{7}$.`,
      trap: R`$\tfrac25$ is the ratio $K_{\rm rot}/K_{\rm trans}$, not the fraction of the total.` },
    { id: 'rbd-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: R`About a point O, a body has inertia tensor $I = \begin{pmatrix}2 & -1 & 0\\ -1 & 2 & 0\\ 0 & 0 & 3\end{pmatrix}$ kg m². Its moment of inertia about the axis through O along $(1, 1, 1)$ is ______ kg m² (to two decimal places).`,
      answer: 1.67, tol: 0.01, calc: () => 5 / 3, unit: 'kg m²',
      sol: R`$I_{\hat n} = \hat n^TI\hat n$ with $\hat n = (1, 1, 1)/\sqrt3$. This is the sum of all nine entries divided by 3: $(2 - 1 + 0 - 1 + 2 + 0 + 0 + 0 + 3)/3 = 5/3 = 1.67$ kg m².`,
      trap: R`Forgetting to normalise the axis gives 5; leaving out the off-diagonal entries gives 7/3.` },
    { id: 'rbd-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'motion of the centre of mass',
      q: R`A uniform rod stands upright on perfectly smooth ice and is given a tiny push, so it topples onto the ice. The path of its centre of mass is`,
      options: ['a vertical straight line', 'a circular arc about the lower end', 'a parabola', 'a quarter of an ellipse'], answer: 0,
      sol: R`The only external forces are gravity and the normal force from the smooth ice; both are vertical. So the horizontal momentum stays zero and the centre of mass moves straight down. The lower end slides sideways to allow this. (Each other point of the rod traces part of an ellipse.)`,
      trap: R`The arc about the lower end would be right only if friction held that end in place.` },
    { id: 'rbd-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'free rotation',
      q: R`A free rigid body with principal moments $I_1 < I_2 < I_3$ slowly loses rotational energy through internal flexing, while its angular momentum stays fixed. It ends up spinning about`,
      options: ['the axis of smallest moment of inertia', 'the intermediate axis', 'any axis, since the energy is fixed by the angular momentum', 'the axis of largest moment of inertia'], answer: 3,
      sol: R`For rotation about a principal axis $i$ with angular momentum $L$, the energy is $T = L^2/2I_i$. With $L$ fixed, the lowest possible energy is $L^2/2I_3$, rotation about the axis of largest moment. Dissipation drives the body there; a probe set spinning about its long (smallest-moment) axis ends up tumbling end over end.`,
      trap: R`Spin about the smallest-moment axis is stable only for a perfectly rigid body; with any dissipation it is the largest-moment axis that wins.` },
    { id: 'rbd-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'principal axes', format: 'statements',
      q: R`Which statements about principal axes and principal moments are correct?`,
      options: ['For a uniform cube, every axis through its centre is a principal axis', 'For a body of revolution, every axis through the centre of mass perpendicular to the symmetry axis is a principal axis', 'The principal moments always satisfy $I_1 + I_2 \\ge I_3$', 'If the three principal moments about the centre of mass are equal, the body must be spherically symmetric'], answer: [0, 1, 2],
      sol: R`A cube's inertia tensor about its centre is $\tfrac16Ma^2$ times the unit matrix, so every direction is principal. For a body of revolution the two perpendicular moments are equal, so every direction in that plane is principal. $I_1 + I_2 - I_3 = 2\sum m z_3^2 \ge 0$, where $z_3$ is the coordinate along axis 3 (equality for a lamina). But equal moments do not need spherical symmetry: the cube is the counterexample.`,
      trap: R`Rotational behaviour like a sphere does not mean the shape is a sphere.` },
    { id: 'rbd-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      q: R`A body has principal moments $I_1 = 1$ kg m² and $I_2 = 4$ kg m² (and $I_3$ about the third axis). It rotates with $\boldsymbol\omega = (1, 1, 0)$ rad/s in principal axes. The angle between $\mathbf L$ and $\boldsymbol\omega$ is ______ degrees (to one decimal place).`,
      answer: 31.0, tol: 0.2, calc: () => Math.acos(5 / Math.sqrt(34)) * 180 / Math.PI, unit: '°',
      sol: R`$\mathbf L = (I_1\omega_1, I_2\omega_2, 0) = (1, 4, 0)$ kg m²/s. $\cos\alpha = \dfrac{\mathbf L\cdot\boldsymbol\omega}{|\mathbf L||\boldsymbol\omega|} = \dfrac{1 + 4}{\sqrt{17}\sqrt2} = 0.8575$, so $\alpha = 31.0^\circ$. $\mathbf L$ leans towards the axis of larger moment.`,
      trap: R`$\mathbf L$ and $\boldsymbol\omega$ are parallel only along a principal axis or for equal moments.` },
    { id: 'rbd-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'rolling',
      q: R`A uniform solid cylinder lies on a horizontal plank. The plank is pulled along a smooth floor with constant acceleration $A$, and the cylinder rolls on it without slipping. In the ground frame, the acceleration of the cylinder's axis is`,
      options: [R`$A/3$`, R`$A/2$`, R`$2A/3$`, R`$A$`], answer: 0,
      sol: R`Only friction $f$ acts horizontally on the cylinder: $f = Ma$ (forward). Its torque about the axis gives $fR = \tfrac12MR^2\alpha$, so $\alpha R = 2a$. No slipping: the contact point of the cylinder moves with the plank, $a + \alpha R = A$ (the cylinder spins backwards relative to its motion). So $3a = A$ and $a = A/3$.`,
      trap: R`$2A/3$ is the cylinder's acceleration relative to the plank (backwards), not relative to the ground.` },
    { id: 'rbd-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'torque-free motion', format: 'statements',
      q: R`A torque-free symmetric body ($I_1 = I_2 \ne I_3$) spins with its angular velocity slightly off its symmetry axis. Which statements are correct?`,
      options: [R`The symmetry axis, $\boldsymbol\omega$ and $\mathbf L$ always lie in one plane`, R`$\mathbf L$ is fixed in space`, R`Seen from space, the symmetry axis turns about $\mathbf L$ at the rate $L/I_1$`, R`$\boldsymbol\omega$ keeps a fixed direction in the body`], answer: [0, 1, 2],
      sol: R`With $\hat e_3$ the symmetry axis, $\mathbf L = I_1\boldsymbol\omega + (I_3 - I_1)\omega_3\hat e_3$, a combination of $\boldsymbol\omega$ and $\hat e_3$, so the three are coplanar. No torque: $\mathbf L$ is fixed. Solving for $\boldsymbol\omega$: $\boldsymbol\omega = \mathbf L/I_1 + (\dots)\hat e_3$, and $\dot{\hat e}_3 = \boldsymbol\omega\times\hat e_3 = (\mathbf L/I_1)\times\hat e_3$: the axis precesses about $\mathbf L$ at $L/I_1$. In the body, Euler's equations make $\boldsymbol\omega$ circle the symmetry axis at $(I_3 - I_1)\omega_3/I_1$, so its direction in the body is not fixed.`,
      trap: R`There are two precessions: of the axis about $\mathbf L$ in space, and of $\boldsymbol\omega$ about the axis in the body; they have different rates.` },
    { id: 'rbd-r4-10', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'energy methods', format: 'numeric',
      q: R`A uniform rod 1.2 m long stands upright on smooth ice and topples (from rest). Take $g = 9.8$ m/s². The speed of its centre of mass just before the rod lies flat is ______ m/s (to two decimal places).`,
      answer: 2.97, tol: 0.02, calc: () => 0.5 * Math.sqrt(3 * 9.8 * 1.2), unit: 'm/s',
      sol: R`The centre of mass falls vertically (no horizontal force). With $\theta$ the angle from the vertical, its height is $\tfrac L2\cos\theta$, so $v_{\rm cm} = \tfrac L2\sin\theta\,\dot\theta$, which is $\tfrac L2\dot\theta$ at $\theta = 90^\circ$. Energy: $Mg\tfrac L2 = \tfrac12M\left(\tfrac L2\dot\theta\right)^2 + \tfrac12\cdot\tfrac{ML^2}{12}\dot\theta^2 = \tfrac16ML^2\dot\theta^2$, so $\dot\theta^2 = 3g/L$ and $v_{\rm cm} = \tfrac12\sqrt{3gL} = \tfrac12\sqrt{35.28} = 2.97$ m/s.`,
      trap: R`Putting all the energy into the fall of the centre ($\tfrac12Mv^2 = Mg\tfrac L2$) gives $\sqrt{gL} = 3.43$ m/s; the spin about the centre takes a quarter of the energy.` },
    { id: 'rbd-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'impulses', format: 'numeric',
      q: R`A uniform rod 1.2 m long lies at rest on smooth ice. A sharp horizontal blow is struck at one end, perpendicular to the rod. Just after the blow, the point of the rod that is momentarily at rest is ______ m from the struck end (to two decimal places).`,
      answer: 0.8, tol: 0.01, calc: () => 2 * 1.2 / 3, unit: 'm',
      sol: R`Impulse $J$: $v_{\rm cm} = J/M$ and, about the centre, $J\tfrac L2 = \tfrac{ML^2}{12}\omega$, so $\omega = 6J/ML$. A point a distance $d$ beyond the centre (away from the struck end) moves at $v_{\rm cm} - \omega d$, which vanishes for $d = v_{\rm cm}/\omega = L/6 = 0.2$ m. From the struck end: $0.6 + 0.2 = 0.8$ m, that is $2L/3$.`,
      trap: R`The rod does not pivot about its far end or its centre; the rest point is two-thirds of the way along.` },
    { id: 'rbd-r4-12', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'rolling constraints',
      q: R`A uniform solid ball rolls without slipping on a horizontal turntable that turns at constant angular velocity $\Omega$ about a fixed vertical axis. Seen from the ground, the ball's centre moves on a circle with angular velocity`,
      options: [R`$\Omega$`, R`$\tfrac25\Omega$`, R`$\tfrac27\Omega$`, R`$\tfrac57\Omega$`], answer: 2,
      sol: R`Let $\mathbf v$ be the centre's velocity and $\mathbf F$ the friction (the only horizontal force): $m\dot{\mathbf v} = \mathbf F$ and $I\dot{\boldsymbol\omega} = (-R\hat z)\times\mathbf F$. Rolling: $\mathbf v + \boldsymbol\omega\times(-R\hat z) = \Omega\hat z\times\mathbf r$. Differentiating and using the torque equation, $\dot{\mathbf v}\left(1 + \dfrac{mR^2}{I}\right) = \Omega\hat z\times\mathbf v$. So $\mathbf v$ turns at the constant rate $\dfrac{I}{I + mR^2}\Omega = \dfrac{2/5}{7/5}\Omega = \tfrac27\Omega$, and a velocity of fixed size turning at a constant rate means circular motion.`,
      trap: R`The ball does not simply ride round with the table; its spin takes up part of the motion.` },
  ],
  gens: [
    { id: 'rbd-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      make(r) {
        const I1 = int(r, 2, 4), I2 = int(r, I1 + 1, 6), I = [I1, I2, int(r, I2 + 1, I1 + I2)], w = [int(r, 1, 3), int(r, 0, 2), int(r, 1, 3)];
        const L = I.map((x, i) => x * w[i]), dot = L.reduce((s, x, i) => s + x * w[i], 0);
        const cos = dot / (Math.hypot(...L) * Math.hypot(...w)), answer = round(Math.acos(Math.min(1, cos)) * 180 / Math.PI, 2);
        return { q: R`A body has principal moments $(${I.join(', ')})$ kg m² (about its centre of mass) and angular velocity $\boldsymbol\omega = (${w.join(', ')})$ rad/s in principal axes. Find the angle in degrees between $\mathbf L$ and $\boldsymbol\omega$.`,
          answer, tol: Math.max(0.2, answer * 0.01), unit: '°', I, w,
          sol: R`$\mathbf L = (${L.join(', ')})$ kg m²/s. $\cos\alpha = \dfrac{\mathbf L\cdot\boldsymbol\omega}{|\mathbf L||\boldsymbol\omega|} = \dfrac{${dot}}{${round(Math.hypot(...L), 4)}\times${round(Math.hypot(...w), 4)}} = ${round(cos, 5)}$, so $\alpha = ${answer}^\circ$.`,
          trap: '$\\mathbf L = I\\boldsymbol\\omega$ component by component in principal axes; it tilts towards the larger moments.' };
      },
      verify: (p) => { const L = p.I.map((x, i) => x * p.w[i]); const d = L.reduce((s, x, i) => s + x * p.w[i], 0); return Math.acos(Math.min(1, d / (Math.hypot(...L) * Math.hypot(...p.w)))) * 180 / Math.PI; } },
    { id: 'rbd-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'energy methods',
      make(r) {
        const L = pick(r, 0.5, 3, 0.25), want = choose(r, ['v', 'w']);
        const w = Math.sqrt(3 * g / L), v = 0.5 * Math.sqrt(3 * g * L), answer = round(want === 'v' ? v : w, 3);
        return { q: R`A uniform rod ${L} m long stands upright on smooth ice and topples from rest. Just before it lies flat, find ${want === 'v' ? 'the speed of its centre of mass (m/s)' : 'its angular velocity (rad/s)'} ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: want === 'v' ? 'm/s' : 'rad/s', L, want,
          sol: R`No horizontal force, so the centre of mass falls straight down; when the rod is flat, $v_{\rm cm} = \tfrac L2\dot\theta$. Energy: $Mg\tfrac L2 = \tfrac12M\left(\tfrac L2\dot\theta\right)^2 + \tfrac12\tfrac{ML^2}{12}\dot\theta^2 = \tfrac16ML^2\dot\theta^2$. So $\dot\theta = \sqrt{3g/L} = ${round(w, 3)}$ rad/s and $v_{\rm cm} = \tfrac12\sqrt{3gL} = ${round(v, 3)}$ m/s.`,
          trap: 'Both the fall of the centre and the spin about it take energy; at the last instant $v_{\\rm cm} = \\tfrac L2\\dot\\theta$.' };
      },
      verify: (p) => (p.want === 'v' ? 0.5 * Math.sqrt(3 * g * p.L) : Math.sqrt(3 * g / p.L)) },
    { id: 'rbd-r4g3', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'rolling',
      make(r) {
        const [name, beta, tex] = choose(r, [['uniform solid cylinder', 0.5, '\\tfrac12'], ['thin-walled pipe', 1, '1'], ['uniform solid ball', 0.4, '\\tfrac25'], ['thin hollow ball', 2 / 3, '\\tfrac23']]);
        const A = pick(r, 0.5, 6, 0.5), answer = round(A * beta / (1 + beta), 3);
        return { q: R`A ${name} lies on a plank that is pulled along a smooth floor with acceleration ${A} m/s². It rolls on the plank without slipping. Find the acceleration of its centre in the ground frame (m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'm/s²', A, beta,
          sol: R`With $I = \beta MR^2$ ($\beta = ${tex}$): friction gives $f = Ma$ and $fR = \beta MR^2\alpha$, so $\alpha R = a/\beta$. No slip on the plank: $a + \alpha R = A$. So $a = \dfrac{\beta}{1 + \beta}A = ${answer}$ m/s².`,
          trap: 'The contact point moves with the plank, not with the ground.' };
      },
      verify: (p) => p.A * p.beta / (1 + p.beta) },
  ],
};
