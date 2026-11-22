// Rotational motion: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
let k = 0; let c = 0;
const nid = () => `rm-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
// numeric answer worked out in code (fn), rounded to dp places; tol 0 means a whole number
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const D = Math.PI / 180;

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'torque', r`The dimensional formula of torque is`, r`$\mathrm{ML^{2}T^{-2}}$`, [r`$\mathrm{MLT^{-2}}$`, r`$\mathrm{ML^{2}T^{-1}}$`, r`$\mathrm{ML^{2}T^{-3}}$`],
    r`$\tau = rF$, so the dimensions are (length)(force) $= \mathrm{L}\cdot\mathrm{MLT^{-2}} = \mathrm{ML^2T^{-2}}$. $\mathrm{MLT^{-2}}$ is force, $\mathrm{ML^2T^{-1}}$ is angular momentum and $\mathrm{ML^2T^{-3}}$ is power. Torque has the same dimensions as energy, but it is a different quantity.`),
  nat(1, 'torque', r`A force of 20 N acts at right angles to a spanner, 0.5 m from the nut. Find the torque (in N m).`, () => 20 * 0.5, 0, 0,
    r`The force is perpendicular to the arm, so $\tau = rF = 0.5\times20 = 10$ N m.`, { unit: 'N m' }),
  mcq(1, 'moment of inertia', r`The moment of inertia of a thin ring of mass $M$ and radius $R$ about an axis through its centre and perpendicular to its plane is`, r`$MR^2$`, [r`$\tfrac12MR^2$`, r`$\tfrac25MR^2$`, r`$\tfrac23MR^2$`],
    r`Every bit of the ring is at the same distance $R$ from the axis, so $I = \sum m_iR^2 = MR^2$. $\tfrac12MR^2$ is the disc, $\tfrac25MR^2$ the solid sphere and $\tfrac23MR^2$ the hollow sphere.`),
  mcq(1, 'angular momentum', r`The SI unit of angular momentum is`, r`$\mathrm{kg\,m^{2}\,s^{-1}}$`, [r`$\mathrm{kg\,m\,s^{-1}}$`, r`$\mathrm{N\,m}$`, r`$\mathrm{kg\,m^{2}\,s^{-2}}$`],
    r`$L = I\omega$, so the unit is $\mathrm{kg\,m^2\times s^{-1}} = \mathrm{kg\,m^2\,s^{-1}}$ (the same as J s). $\mathrm{kg\,m\,s^{-1}}$ is linear momentum, and N m (or $\mathrm{kg\,m^2\,s^{-2}}$) is the unit of torque.`),
  nat(1, 'rotational energy', r`A wheel of moment of inertia $2\ \mathrm{kg\,m^2}$ spins at $5\ \mathrm{rad\,s^{-1}}$. Find its rotational kinetic energy (in J).`, () => 0.5 * 2 * 25, 0, 0,
    r`$K = \tfrac12I\omega^2 = \tfrac12\times2\times25 = 25$ J.`, { unit: 'J' }),
  mcq(1, 'angular momentum conservation', r`A skater spinning on ice pulls her arms in. Her angular speed increases because`, 'her angular momentum stays constant while her moment of inertia decreases', ['her angular momentum increases', 'her linear momentum is conserved', 'the ice pushes her round faster'],
    r`No external torque acts about the vertical axis, so $L = I\omega$ is constant. Pulling the arms in lowers $I$, so $\omega$ must rise. Her angular momentum itself does not change.`),
  nat(1, 'angular speed', r`A wheel turns at 120 revolutions per minute. Find its angular speed (in rad/s, 2 decimals).`, () => 120 * 2 * Math.PI / 60, 0.02, 2,
    r`$\omega = 2\pi n$ with $n = 120/60 = 2$ rev/s. So $\omega = 4\pi = 12.57\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'Convert minutes to seconds before multiplying by $2\\pi$.' }),
  mcq(1, 'moment of inertia', r`The moment of inertia of a solid sphere of mass $M$ and radius $R$ about a diameter is`, r`$\tfrac25MR^2$`, [r`$\tfrac23MR^2$`, r`$\tfrac12MR^2$`, r`$MR^2$`],
    r`For a solid sphere $I = \tfrac25MR^2$. The hollow (thin-walled) sphere has $\tfrac23MR^2$.`),
  nat(1, 'torque and angular acceleration', r`A net torque of 12 N m acts on a body of moment of inertia $4\ \mathrm{kg\,m^2}$. Find its angular acceleration (in $\mathrm{rad\,s^{-2}}$).`, () => 12 / 4, 0, 0,
    r`$\tau = I\alpha$, so $\alpha = 12/4 = 3\ \mathrm{rad\,s^{-2}}$.`, { unit: 'rad/s²' }),
  mcq(1, 'equilibrium', r`A rigid body is in complete mechanical equilibrium when`, 'the net force and the net torque on it are both zero', ['the net force on it is zero', 'the net torque on it is zero', 'its centre of mass is at rest'],
    r`Zero net force stops the centre of mass accelerating, and zero net torque stops the body's rotation changing. Two equal and opposite forces along different lines (a couple) give zero net force but a torque, so force alone is not enough.`),
  mcq(1, 'moment of inertia', r`The moment of inertia of a rigid body depends on`, 'its mass, how the mass is distributed and the position of the axis', ['its angular velocity', 'the torque applied to it', 'its mass only'],
    r`$I = \sum m_ir_i^2$ depends on the masses and their distances from the chosen axis. It does not depend on how fast the body turns or on the torque.`),

  // ---------- Level 2 ----------
  nat(2, 'moment of inertia', r`Find the moment of inertia of a uniform disc of mass 4 kg and radius 0.5 m about its central axis (in $\mathrm{kg\,m^2}$).`, () => 0.5 * 4 * 0.25, 0.001, 3,
    r`$I = \tfrac12MR^2 = \tfrac12\times4\times0.25 = 0.5\ \mathrm{kg\,m^2}$.`, { unit: 'kg m²' }),
  nat(2, 'moment of inertia', r`Find the moment of inertia of a uniform rod of mass 3 kg and length 2 m about an axis through one end and perpendicular to the rod (in $\mathrm{kg\,m^2}$).`, () => 3 * 4 / 3, 0, 0,
    r`$I_{end} = \tfrac13ML^2 = \tfrac13\times3\times4 = 4\ \mathrm{kg\,m^2}$. (Check with the parallel axis theorem: $\tfrac1{12}ML^2 + M(L/2)^2 = 1 + 3 = 4$.)`, { unit: 'kg m²' }),
  nat(2, 'parallel axis theorem', r`A uniform disc of mass 2 kg and radius 0.2 m turns about an axis through a point on its rim, perpendicular to its plane. Find the moment of inertia (in $\mathrm{kg\,m^2}$).`, () => 1.5 * 2 * 0.04, 0.001, 3,
    r`$I_{cm} = \tfrac12MR^2$. Parallel axis theorem with $d = R$: $I = \tfrac12MR^2 + MR^2 = \tfrac32MR^2 = 1.5\times2\times0.04 = 0.12\ \mathrm{kg\,m^2}$.`, { unit: 'kg m²' }),
  mcq(2, 'perpendicular axis theorem', r`The perpendicular axis theorem $I_z = I_x + I_y$ can be applied to`, 'a flat (planar) body, with the x and y axes in its plane', ['any three-dimensional body', 'a solid sphere only', 'a body only when it is symmetrical about the z-axis'],
    r`The proof uses $z = 0$ for every point, which holds only for a plane lamina. It does not work for a sphere or cube.`, { trap: 'The theorem needs the body to lie in a plane; the parallel axis theorem works for any body.' }),
  nat(2, 'perpendicular axis theorem', r`A thin ring of mass 1 kg and radius 1 m. Find its moment of inertia about a diameter (in $\mathrm{kg\,m^2}$).`, () => 0.5 * 1 * 1, 0.001, 3,
    r`About the axis perpendicular to the plane through the centre, $I_z = MR^2$. By symmetry the two diameters $x$ and $y$ in the plane have equal $I$, so $2I_d = MR^2$ and $I_d = \tfrac12MR^2 = 0.5$.`, { unit: 'kg m²' }),
  nat(2, 'angular momentum', r`A particle of mass 2 kg moves in a straight line at $3\ \mathrm{m\,s^{-1}}$. The line is 4 m from a point $O$. Find its angular momentum about $O$ (in $\mathrm{kg\,m^2\,s^{-1}}$).`, () => 2 * 3 * 4, 0, 0,
    r`$L = mvd$ where $d$ is the perpendicular distance of the line of motion from $O$. $L = 2\times3\times4 = 24$.`, { unit: 'kg m²/s' }),
  nat(2, 'torque and angular acceleration', r`A flywheel of moment of inertia $0.5\ \mathrm{kg\,m^2}$ is acted on by a steady torque of 2 N m for 5 s, starting from rest. Find its angular speed at the end (in rad/s).`, () => 2 / 0.5 * 5, 0, 0,
    r`$\alpha = \tau/I = 2/0.5 = 4\ \mathrm{rad\,s^{-2}}$. $\omega = \alpha t = 4\times5 = 20\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  mcq(2, 'moment of inertia', r`A solid sphere and a hollow sphere have the same mass and radius. About a diameter,`, 'the hollow sphere has the larger moment of inertia', ['the solid sphere has the larger moment of inertia', 'both have the same moment of inertia', 'it depends on the density of the material only'],
    r`Solid: $\tfrac25MR^2 = 0.4MR^2$. Hollow: $\tfrac23MR^2 = 0.67MR^2$. The hollow sphere has all its mass at the full distance $R$, so $I$ is larger.`),
  nat(2, 'rotational kinematics', r`A wheel turning at $10\ \mathrm{rad\,s^{-1}}$ slows down uniformly at $2\ \mathrm{rad\,s^{-2}}$ until it stops. Find the angle it turns through (in rad).`, () => 100 / (2 * 2), 0, 0,
    r`$\omega^2 = \omega_0^2 - 2\alpha\theta$ with $\omega = 0$: $\theta = \omega_0^2/(2\alpha) = 100/4 = 25$ rad.`, { unit: 'rad' }),
  nat(2, 'angular momentum conservation', r`A spinning skater changes her moment of inertia to half its value by pulling in her arms. By what factor does her rotational kinetic energy change?`, () => 2, 0, 0,
    r`$L = I\omega$ stays constant, so $\omega$ doubles. $K = L^2/(2I)$, so halving $I$ doubles $K$. The extra energy comes from the work she does pulling her arms in against the outward pull.`, { trap: 'Energy is not conserved here: the skater does work.' }),
  mcq(2, 'rolling', r`A wheel rolls without slipping on a horizontal road. The point of the wheel that touches the road is`, 'momentarily at rest relative to the road', ['moving forward with speed $v$', 'moving backward with speed $v$', 'moving with speed $2v$ forward'],
    r`Rolling without slipping means $v_{cm} = \omega R$. At the contact point the velocity is $v_{cm} - \omega R = 0$. The top point moves at $2v_{cm}$.`),
  nat(2, 'rolling energy', r`A solid cylinder of mass 2 kg rolls without slipping with centre-of-mass speed $4\ \mathrm{m\,s^{-1}}$. Find its total kinetic energy (in J).`, () => 0.5 * 2 * 16 * 1.5, 0, 0,
    r`$K = \tfrac12mv^2\left(1 + \dfrac{k^2}{R^2}\right)$ and $k^2/R^2 = \tfrac12$ for a solid cylinder. $K = \tfrac12\times2\times16\times1.5 = 24$ J. (Translational 16 J + rotational 8 J.)`, { unit: 'J' }),
  nat(2, 'torque', r`A force of 10 N acts on the end of a 0.4 m spanner, at $30^\circ$ to the spanner. Find the torque about the nut (in N m).`, () => 10 * 0.4 * Math.sin(30 * D), 0, 0,
    r`$\tau = rF\sin\theta = 0.4\times10\times\sin30^\circ = 2$ N m. Only the part of the force perpendicular to the arm turns the nut.`, { unit: 'N m', trap: 'Use the angle between the force and the arm, not the angle with the perpendicular.' }),
  mcq(2, 'moment of inertia', r`The moment of inertia of a uniform thin rod of mass $M$ and length $L$ about an axis through its centre and perpendicular to the rod is`, r`$\dfrac{ML^2}{12}$`, [r`$\dfrac{ML^2}{3}$`, r`$\dfrac{ML^2}{2}$`, r`$\dfrac{ML^2}{6}$`],
    r`About the centre, $I = \dfrac{1}{12}ML^2$. About one end it is $\dfrac13ML^2$ (parallel axis theorem). The other two are not standard values.`),
  nat(2, 'radius of gyration', r`A body of mass 2 kg has moment of inertia $0.5\ \mathrm{kg\,m^2}$ about an axis. Find the radius of gyration about that axis (in m).`, () => Math.sqrt(0.5 / 2), 0.001, 3,
    r`$I = Mk^2$, so $k = \sqrt{I/M} = \sqrt{0.25} = 0.5$ m.`, { unit: 'm' }),
  mcq(2, 'torque', r`A force $F\,\hat{\imath}$ acts at the point $\vec r = d\,\hat{\jmath}$. The torque $\vec r\times\vec F$ about the origin points along`, r`$-\hat{k}$`, [r`$+\hat{k}$`, r`$+\hat{\imath}$`, r`$-\hat{\jmath}$`],
    r`$\hat\jmath\times\hat\imath = -\hat k$ (since $\hat\imath\times\hat\jmath = \hat k$, reversing the order flips the sign). So the torque is $-Fd\,\hat k$, clockwise as seen from $+z$.`, { trap: 'The order in a cross product matters.' }),
  nat(2, 'power', r`A motor turns a shaft at $40\ \mathrm{rad\,s^{-1}}$ with a torque of 5 N m. Find the power delivered (in W).`, () => 5 * 40, 0, 0,
    r`$P = \tau\omega = 5\times40 = 200$ W.`, { unit: 'W' }),
  nat(2, 'equilibrium', r`A light rod 6 m long is pivoted at its centre like a seesaw. A 30 N weight hangs 1.5 m to the left of the pivot. How far to the right of the pivot (in m) must a 20 N weight be hung to balance it?`, () => 30 * 1.5 / 20, 0.01, 2,
    r`Take torques about the pivot: $30\times1.5 = 20\times x$, so $x = 2.25$ m. This is less than the 3 m half-length, so the weight fits on the rod. (The pivot supports 50 N.)`, { unit: 'm', trap: 'Check that the answer fits on the rod.' }),
  nat(2, 'units', r`A uniform disc has mass 500 g and radius 20 cm. Find its moment of inertia about its axis in $\mathrm{kg\,m^2}$ (2 decimals).`, () => 0.5 * 0.5 * 0.2 * 0.2, 0.001, 3,
    r`Convert first: $M = 0.5$ kg, $R = 0.2$ m. $I = \tfrac12MR^2 = \tfrac12\times0.5\times0.04 = 0.01\ \mathrm{kg\,m^2}$. Using grams and centimetres directly gives $5000\ \mathrm{g\,cm^2}$, which is the same value.`, { unit: 'kg m²', trap: 'Convert g to kg and cm to m; the square on R makes an error in cm a factor of 10 000.' }),

  // ---------- Level 3 ----------
  nat(3, 'rolling on incline', r`A solid sphere rolls down a rough incline of $30^\circ$ without slipping. Find its acceleration (in $\mathrm{m\,s^{-2}}$, $g = 10$, 2 decimals).`, () => 10 * 0.5 / 1.4, 0.01, 2,
    r`For rolling without slipping, $a = \dfrac{g\sin\theta}{1 + k^2/R^2}$. For a solid sphere $k^2/R^2 = \tfrac25$. $a = \dfrac{10\times0.5}{1.4} = 3.57\ \mathrm{m\,s^{-2}}$. A frictionless block would have $5\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  mcq(3, 'rolling on incline', r`A ring, a disc, a solid sphere and a hollow sphere of the same mass and radius are released together from the top of a rough incline and roll without slipping. The first to reach the bottom is the`, 'solid sphere', ['ring', 'disc', 'hollow sphere'],
    r`$a = g\sin\theta/(1 + k^2/R^2)$ and $k^2/R^2$ is 1 (ring), 1/2 (disc), 2/5 (solid sphere), 2/3 (hollow sphere). The smallest $k^2/R^2$ gives the largest acceleration: the solid sphere. The order is solid sphere, disc, hollow sphere, ring. Mass and radius do not matter.`, { trap: 'Mass and radius cancel; only the shape counts.' }),
  nat(3, 'rolling on incline', r`A solid disc is released from rest on a rough $30^\circ$ incline and rolls without slipping down a length of 2.4 m. Find the time taken (in s, $g = 10$).`, () => Math.sqrt(2 * 2.4 / (10 * 0.5 / 1.5)), 0.01, 2,
    r`For a disc $k^2/R^2 = \tfrac12$, so $a = \dfrac{10\times0.5}{1.5} = \dfrac{10}{3}\ \mathrm{m\,s^{-2}}$. From $s = \tfrac12at^2$: $t = \sqrt{2\times2.4\times3/10} = \sqrt{1.44} = 1.2$ s.`, { unit: 's' }),
  nat(3, 'friction in rolling', r`A solid disc rolls without slipping down an incline whose $\tan\theta = \dfrac34$. Find the least coefficient of static friction needed.`, () => (3 / 4) / 3, 0.005, 3,
    r`For a disc the friction is $f = \dfrac{mg\sin\theta}{3}$ (since $a = \tfrac23g\sin\theta$). The normal reaction is $mg\cos\theta$. Need $f\le\mu mg\cos\theta$, so $\mu\ge\tfrac13\tan\theta = \tfrac13\times\tfrac34 = 0.25$.`, { trap: 'For a disc the limit is $\\tan\\theta/3$; for a solid sphere $2\\tan\\theta/7$; for a ring $\\tan\\theta/2$.' }),
  nat(3, 'rolling energy', r`A solid sphere rolls without slipping on a level floor and then up a smooth-enough incline (still rolling). It starts at $7\ \mathrm{m\,s^{-1}}$. How high up the incline does it rise (in m, $g = 10$, 2 decimals)?`, () => 0.7 * 49 / 10, 0.01, 2,
    r`No energy is lost, so the total kinetic energy goes to potential energy: $\tfrac12mv^2\left(1 + \tfrac25\right) = mgh$. $h = \dfrac{0.7v^2}{g} = \dfrac{0.7\times49}{10} = 3.43$ m. Using only $\tfrac12mv^2$ would give 2.45 m.`, { unit: 'm', trap: 'The rotational energy must be included.' }),
  nat(3, 'angular momentum conservation', r`A disc of moment of inertia $0.4\ \mathrm{kg\,m^2}$ spins at $30\ \mathrm{rad\,s^{-1}}$ on a smooth vertical axle. A second, stationary disc of moment of inertia $0.2\ \mathrm{kg\,m^2}$ on the same axle is dropped on it and they stick. Find the common angular speed (in rad/s).`, () => 0.4 * 30 / 0.6, 0, 0,
    r`No external torque about the axle, so $I_1\omega_1 = (I_1 + I_2)\omega$. $\omega = 0.4\times30/0.6 = 20\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  nat(3, 'angular momentum conservation', r`For the same pair of discs (the first with $I = 0.4\ \mathrm{kg\,m^2}$ at $30\ \mathrm{rad\,s^{-1}}$, the second at rest with $I = 0.2\ \mathrm{kg\,m^2}$), find the kinetic energy lost when they stick together (in J).`, () => 0.5 * 0.4 * 900 - 0.5 * 0.6 * 400, 0, 0,
    r`Before: $\tfrac12\times0.4\times900 = 180$ J. After ($\omega = 20$): $\tfrac12\times0.6\times400 = 120$ J. Loss $= 60$ J, which becomes heat at the rubbing surfaces. (Formula: $\dfrac{I_1I_2\omega_1^2}{2(I_1+I_2)} = \dfrac{0.08\times900}{1.2} = 60$.)`, { unit: 'J', trap: 'Angular momentum is conserved; kinetic energy is not.' }),
  nat(3, 'angular momentum conservation', r`A man stands at the rim of a horizontal platform (moment of inertia $320\ \mathrm{kg\,m^2}$ with the man at the rim, of which the man contributes $240\ \mathrm{kg\,m^2}$) turning at $2\ \mathrm{rad\,s^{-1}}$. He walks to the axis and stands at the centre, where his own moment of inertia is almost zero. Find the new angular speed (in rad/s).`, () => 2 * 320 / 80, 0, 0,
    r`The platform alone has $I = 320 - 240 = 80\ \mathrm{kg\,m^2}$. Conservation of angular momentum: $320\times2 = 80\,\omega$, so $\omega = 8\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  nat(3, 'parallel axis theorem', r`A thin ring of mass 1 kg and radius 2 m turns about a tangent lying in its plane. Find the moment of inertia (in $\mathrm{kg\,m^2}$).`, () => 0.5 * 4 + 4, 0, 0,
    r`About a diameter $I = \tfrac12MR^2 = 2$. The tangent in the plane is parallel to a diameter at distance $R$: $I = \tfrac12MR^2 + MR^2 = \tfrac32MR^2 = 6\ \mathrm{kg\,m^2}$. (Not $2MR^2$, which is the tangent perpendicular to the plane.)`, { unit: 'kg m²', trap: 'The axis through the rim perpendicular to the plane gives $2MR^2$; the in-plane tangent gives $\\tfrac32MR^2$.' }),
  mcq(3, 'toppling and sliding', r`A uniform cube of side $a$ stands on a rough plank. The plank is slowly tilted. The coefficient of friction is 0.8. What happens first as the angle increases?`, 'The cube slides, at about $38.7^\\circ$', ['The cube topples, at $45^\\circ$', 'The cube topples, at $38.7^\\circ$', 'The cube slides, at $45^\\circ$'],
    r`Sliding starts when $\tan\theta = \mu = 0.8$, i.e. $\theta = 38.7^\circ$. Toppling starts when the vertical line through the centre of mass leaves the base: $\tan\theta = (a/2)/(a/2) = 1$, i.e. $45^\circ$. The smaller angle comes first, so it slides.`, { trap: 'Compare $\\mu$ with the ratio base/height to see which happens first.' }),
  nat(3, 'ladder', r`A uniform ladder 5 m long and weighing 100 N rests against a smooth vertical wall with its foot on rough ground 3 m from the wall. Find the force of friction at the ground (in N, 1 decimal).`, () => 100 * 1.5 / 4, 0.1, 1,
    r`The ladder reaches 4 m up the wall (3-4-5 triangle). Torque about the foot: wall force $N_w\times4 = 100\times1.5$ (the weight acts 1.5 m horizontally from the foot), so $N_w = 37.5$ N. Horizontal balance: friction $= N_w = 37.5$ N.`, { unit: 'N' }),
  nat(3, 'rod released from horizontal', r`A uniform rod of length 1.5 m is hinged at one end and released from the horizontal position. Find its angular acceleration just after release (in $\mathrm{rad\,s^{-2}}$, $g = 10$).`, () => 3 * 10 / (2 * 1.5), 0, 0,
    r`Torque about the hinge: $\tau = Mg\,\dfrac L2$. $I = \dfrac13ML^2$. $\alpha = \dfrac{\tau}{I} = \dfrac{3g}{2L} = \dfrac{30}{3} = 10\ \mathrm{rad\,s^{-2}}$.`, { unit: 'rad/s²' }),
  nat(3, 'rod released from horizontal', r`A uniform rod of length 1.2 m, hinged at one end, is released from the horizontal. Find its angular speed when it is vertical (in rad/s, $g = 10$).`, () => Math.sqrt(3 * 10 / 1.2), 0, 0,
    r`The centre of mass falls $L/2$. Energy: $Mg\dfrac L2 = \dfrac12\left(\dfrac{ML^2}{3}\right)\omega^2$, so $\omega = \sqrt{3g/L} = \sqrt{25} = 5\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  mcq(3, 'friction in rolling', r`A solid sphere rolls without slipping down a rough incline. The force of friction on it acts`, 'up the incline, and it is static friction', ['down the incline, and it is kinetic friction', 'up the incline, and it is kinetic friction', 'down the incline, and it is static friction'],
    r`Gravity gives a torque about the centre only through friction, and the sphere must spin up as it speeds up, so friction must act up the slope (it also reduces the acceleration below $g\sin\theta$). The contact point is at rest, so it is static friction, and it does no work.`),
  nat(3, 'rolling with slipping', r`A solid sphere is thrown along a rough floor with speed $7\ \mathrm{m\,s^{-1}}$ and no spin. The coefficient of kinetic friction is 0.2 ($g = 10$). Find the time before it starts to roll without slipping (in s).`, () => 2 * 7 / (7 * 0.2 * 10), 0, 0,
    r`Friction $\mu mg$ slows the centre: $v = v_0 - \mu gt$. It also spins the sphere up: $\omega = \dfrac{\mu mgR}{\tfrac25mR^2}t = \dfrac{5\mu g}{2R}t$. Rolling begins when $v = \omega R$: $7 - 2t = 5t$, so $t = 1$ s. (General result: $t = 2v_0/(7\mu g)$; final speed $\tfrac57v_0 = 5\ \mathrm{m\,s^{-1}}$.)`, { unit: 's' }),
  nat(3, 'angular momentum', r`A particle of mass 0.5 kg moves in a straight line at $6\ \mathrm{m\,s^{-1}}$ along the line $y = 2$ m. Find the magnitude of its angular momentum about the origin (in $\mathrm{kg\,m^2\,s^{-1}}$).`, () => 0.5 * 6 * 2, 0, 0,
    r`$L = mv\times$(perpendicular distance of the line from the origin) $= 0.5\times6\times2 = 6$. It stays the same as the particle moves along the line.`, { unit: 'kg m²/s' }),
  nat(3, 'couple', r`Two forces of 5 N, equal and opposite and 0.4 m apart (a couple), act on a body. Find the torque of the couple about any point (in N m).`, () => 5 * 0.4, 0, 0,
    r`The torque of a couple is $F\times$(perpendicular distance between the lines) $= 5\times0.4 = 2$ N m, the same about every point.`, { unit: 'N m' }),
  mcq(3, 'angular momentum', r`A planet moves in an orbit around the Sun. Its angular momentum about the Sun is constant because`, 'the gravitational force of the Sun has zero torque about the Sun', ['the planet moves at constant speed', 'there is no force on the planet', 'the planet\'s kinetic energy is constant'],
    r`$\vec\tau = d\vec L/dt$. The force is along the line to the Sun, so $\vec r\times\vec F = 0$ and $\vec L$ is constant. The speed changes (faster near the Sun) and the force is certainly not zero.`),
  nat(3, 'moment of inertia', r`Two point masses, 1 kg and 2 kg, are joined by a light rod 3 m long. Find the moment of inertia about an axis perpendicular to the rod through the centre of mass (in $\mathrm{kg\,m^2}$).`, () => 1 * 4 + 2 * 1, 0, 0,
    r`The centre of mass is $\dfrac{2\times3}{3} = 2$ m from the 1 kg mass and 1 m from the 2 kg mass. $I = 1\times2^2 + 2\times1^2 = 6\ \mathrm{kg\,m^2}$. (Equivalently $\mu d^2$ with reduced mass $\mu = \tfrac23$: $\tfrac23\times9 = 6$.)`, { unit: 'kg m²', trap: 'The mid-point of the rod is not the centre of mass.' }),
  nat(3, 'pulley', r`A solid disc pulley of mass 4 kg and radius 0.2 m turns freely on a fixed axle. A light string wrapped round it carries a 2 kg mass. Find the acceleration of the falling mass (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, () => 2 * 10 / (2 + 4 / 2), 0, 0,
    r`Mass: $mg - T = ma$. Pulley: $TR = \tfrac12MR^2\cdot\dfrac aR$, so $T = \tfrac12Ma$. Add: $mg = (m + \tfrac M2)a$. $a = \dfrac{20}{2 + 2} = 5\ \mathrm{m\,s^{-2}}$. The tension $T = 10$ N is less than $mg = 20$ N.`, { unit: 'm/s²', trap: 'With a massive pulley the tension is not the same on both sides.' }),
  nat(3, 'rolling energy', r`What percentage of the total kinetic energy of a solid sphere rolling without slipping is rotational (1 decimal)?`, () => 100 * (2 / 5) / (1 + 2 / 5), 0.1, 1,
    r`$K_{rot}/K_{total} = \dfrac{k^2/R^2}{1 + k^2/R^2} = \dfrac{0.4}{1.4} = 0.2857$, i.e. 28.6 %.`, { unit: '%' }),
  mcq(3, 'concepts', r`Which statement about a body rotating about a fixed axis is NOT correct?`, 'Its moment of inertia is the same about any axis through its centre of mass', ['The net torque equals the rate of change of angular momentum', 'The moment of inertia about a parallel axis not through the centre of mass is larger than $I_{cm}$', 'The rotational kinetic energy is $\\tfrac12I\\omega^2$'],
    r`Moment of inertia depends on the axis. For a rod, it is $\tfrac1{12}ML^2$ about the perpendicular axis through the centre but almost zero about the rod's own length. The other three statements are correct (the second is the parallel axis theorem: $I = I_{cm} + Md^2$).`, { trap: 'Spherical symmetry makes $I$ the same for all axes through the centre only for a sphere.' }),

  // ---------- Level 4 ----------
  nat(4, 'rolling with slipping', r`A thin ring of radius 0.2 m is placed on a rough floor spinning at $30\ \mathrm{rad\,s^{-1}}$ with its centre at rest. Find the speed of its centre when it begins pure rolling (in $\mathrm{m\,s^{-1}}$).`, () => 0.2 * 30 / 2, 0, 0,
    r`Friction is the only horizontal force, so angular momentum about the contact line is conserved: $mR^2\omega_0 = mvR + mR^2\,\dfrac vR$ for a ring, i.e. $R\omega_0 = 2v$. $v = \dfrac{0.2\times30}{2} = 3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Use angular momentum about the contact point, because friction has no torque about it.' }),
  nat(4, 'friction in rolling', r`A solid disc of mass 6 kg rolls without slipping down a $30^\circ$ incline. Find the force of static friction on it (in N, $g = 10$).`, () => 6 * 10 * 0.5 / 3, 0, 0,
    r`Down the slope: $mg\sin\theta - f = ma$. About the centre: $fR = \tfrac12mR^2\dfrac aR$, so $f = \tfrac12ma$. Add: $mg\sin\theta = \tfrac32ma$, so $a = \tfrac23g\sin\theta$ and $f = \tfrac13mg\sin\theta = \tfrac13\times6\times10\times0.5 = 10$ N.`, { unit: 'N' }),
  nat(4, 'rod released from horizontal', r`A uniform rod of mass 8 kg is hinged at one end and released from the horizontal. Find the vertical force exerted by the hinge on the rod just after release (in N, $g = 10$).`, () => 8 * 10 / 4, 0, 0,
    r`Just after release $\omega = 0$, so the centre of mass accelerates only downward: $a_{cm} = \alpha\dfrac L2 = \dfrac{3g}{4}$. $Mg - N = Ma_{cm}$, so $N = \dfrac{Mg}{4} = 20$ N, upward.`, { unit: 'N', trap: 'The hinge does not carry the whole weight, as the rod is accelerating.' }),
  nat(4, 'ladder', r`A uniform ladder rests against a smooth vertical wall, with a rough floor of $\mu = 0.5$. Find the smallest angle the ladder can make with the floor without slipping (in degrees).`, () => Math.atan(1 / (2 * 0.5)) / D, 0.1, 1,
    r`Let the angle be $\theta$, length $L$, weight $W$. Floor: $N = W$, $f = N_w$. Torque about the foot: $N_wL\sin\theta = W\dfrac L2\cos\theta$, so $N_w = \dfrac W2\cot\theta$. Need $N_w\le\mu W$: $\cot\theta\le2\mu = 1$, $\tan\theta\ge1$, so $\theta\ge45^\circ$.`, { unit: 'degrees' }),
  nat(4, 'toppling and sliding', r`A uniform block 1.5 m tall and 0.6 m wide stands on a rough floor. A horizontal force is applied at its top edge, pushing it. Find the smallest coefficient of friction for which the block topples before it slides (2 decimals).`, () => 0.6 / (2 * 1.5), 0.005, 3,
    r`Sliding needs $F = \mu Mg$. Toppling about the far bottom edge needs $F\times h = Mg\times\dfrac b2$, i.e. $F = \dfrac{Mgb}{2h}$. It topples first if $\dfrac{Mgb}{2h}<\mu Mg$, so $\mu>\dfrac{b}{2h} = \dfrac{0.6}{3} = 0.20$.`, { trap: 'Toppling is about the edge on the far side, so the weight\'s arm is $b/2$ and the force\'s arm is $h$.' }),
  nat(4, 'angular momentum conservation', r`A door of mass 10 kg and width 1 m is free to turn about its vertical hinged edge ($I = \tfrac13Mw^2$). A 20 g bullet moving at $300\ \mathrm{m\,s^{-1}}$ strikes the free edge at right angles and stays embedded. Find the angular speed of the door just after (in rad/s, 2 decimals).`, () => 0.02 * 300 * 1 / (10 / 3 + 0.02), 0.01, 2,
    r`Angular momentum about the hinge is conserved: $mvw = (I_{door} + mw^2)\omega$. $0.02\times300\times1 = 6$. $I = \tfrac{10}{3} + 0.02 = 3.3533$. $\omega = 6/3.3533 = 1.79\ \mathrm{rad\,s^{-1}}$. Linear momentum is not conserved because the hinge supplies an impulse.`, { unit: 'rad/s', trap: 'Linear momentum is not conserved here; the hinge force acts.' }),
  nat(4, 'moment of inertia', r`A uniform disc of mass $M$ and radius $R$ has a circular hole of radius $R/2$ cut out. The hole's centre is at a distance $R/2$ from the disc's centre. Find $I/(MR^2)$ of the remaining body, about the axis through the original centre perpendicular to the disc, where $M$ is the mass of the <b>complete</b> disc (3 decimals).`, () => 0.5 - (0.25) * (0.5 * 0.25 + 0.25), 0.001, 3,
    r`Subtract the removed part. Removed mass $= M/4$ (area ratio). Its $I$ about the central axis, by the parallel axis theorem: $\tfrac12\cdot\dfrac M4\left(\dfrac R2\right)^2 + \dfrac M4\left(\dfrac R2\right)^2 = \dfrac M4\cdot\dfrac{3R^2}{8} = \dfrac{3MR^2}{32}$. Remaining: $\dfrac{MR^2}2 - \dfrac{3MR^2}{32} = \dfrac{13}{32}MR^2 = 0.406MR^2$.`, { trap: 'The hole is off-centre, so use the parallel axis theorem for the removed piece.' }),
  nat(4, 'rod falling', r`A uniform rod of length 2 m stands vertically on the floor with its lower end hinged, and falls over. Find the speed of its top end when it hits the floor (in $\mathrm{m\,s^{-1}}$, $g = 10$, 2 decimals).`, () => Math.sqrt(3 * 10 * 2), 0.01, 2,
    r`$\tfrac12\left(\dfrac{ML^2}{3}\right)\omega^2 = Mg\dfrac L2$ gives $\omega^2 = 3g/L$. The top end moves at $v = \omega L = \sqrt{3gL} = \sqrt{60} = 7.75\ \mathrm{m\,s^{-1}}$. This is larger than $\sqrt{2gL} = 6.3$, the speed of a freely falling point at the same height.`, { unit: 'm/s', trap: 'The top end drops faster than free fall.' }),
  nat(4, 'rolling and force at the top', r`A solid disc of mass 4 kg rolls without slipping on a rough floor when a horizontal force of 9 N is applied at the <b>top</b> of the disc. Find its acceleration (in $\mathrm{m\,s^{-2}}$).`, () => 4 * 9 / (3 * 4), 0, 0,
    r`Let $f$ be friction acting forward (we will find its sign). $F + f = Ma$. About the centre, $F$ at the top turns the disc forward and $f$ at the bottom turns it the other way: $(F - f)R = \tfrac12MR^2\dfrac aR$, so $F - f = \tfrac12Ma$. Add: $2F = \tfrac32Ma$, $a = \dfrac{4F}{3M} = \dfrac{36}{12} = 3\ \mathrm{m\,s^{-2}}$. Then $f = F - \tfrac12Ma = 9 - 6 = 3$ N, acting forward.`, { unit: 'm/s²', trap: 'Friction can act in the forward direction when the force is applied above the centre.' }),
  nat(4, 'rolling and force at the centre', r`A solid disc of mass 4 kg rolls without slipping when a horizontal force of 18 N is applied at its centre (through the axle). Find the force of static friction (in N).`, () => 18 / 3, 0, 0,
    r`$F - f = Ma$ and $fR = \tfrac12MR^2\dfrac aR$ give $f = \tfrac12Ma$. So $F = \tfrac32Ma$, $a = \dfrac{2F}{3M} = 3\ \mathrm{m\,s^{-2}}$ and $f = \tfrac12\times4\times3 = 6$ N, acting backward (opposite to the force).`, { unit: 'N' }),
  nat(4, 'yo-yo', r`A string is wound round a uniform disc (yo-yo) of mass $M$. The free end is fixed to the ceiling and the disc is released. Find the acceleration of its centre (in $\mathrm{m\,s^{-2}}$, $g = 10$, 2 decimals).`, () => 2 * 10 / 3, 0.01, 2,
    r`$Mg - T = Ma$ and $TR = \tfrac12MR^2\dfrac aR$ so $T = \tfrac12Ma$. Then $Mg = \tfrac32Ma$ and $a = \tfrac23g = 6.67\ \mathrm{m\,s^{-2}}$. The tension is $T = Mg/3$.`, { unit: 'm/s²' }),
  nat(4, 'ladder', r`A uniform ladder 10 m long weighing 200 N rests against a smooth wall, making $53^\circ$ with the floor ($\sin53^\circ = 0.8$, $\cos53^\circ = 0.6$). The floor has $\mu = 0.5$. A man of weight 600 N climbs it. How far along the ladder can he go before it slips (in m, 2 decimals)?`, () => (400 * 8 / 0.6 - 1000) / 600, 0.02, 2,
    r`Let the man be at distance $x$ along the ladder. Floor: $N = 200 + 600 = 800$ N, so the maximum friction is $0.5\times800 = 400$ N. Wall force $N_w$ equals the friction. Torque about the foot: $N_w\times10\sin\theta = 200\times5\cos\theta + 600x\cos\theta$, i.e. $8N_w = 0.6(1000 + 600x)$. At $N_w = 400$: $3200 = 600 + 360x$, $x = 7.22$ m.`, { unit: 'm' }),
  nat(4, 'rod with mass at the end', r`A uniform rod of mass $M$ and length 0.9 m has a point mass $M$ fixed at its free end. The rod is hinged at the other end and released from the horizontal. Find its angular acceleration just after release (in $\mathrm{rad\,s^{-2}}$, $g = 10$).`, () => 9 * 10 / (8 * 0.9), 0.01, 2,
    r`Torque about the hinge: $Mg\dfrac L2 + MgL = \dfrac32MgL$. $I = \dfrac13ML^2 + ML^2 = \dfrac43ML^2$. $\alpha = \dfrac{(3/2)MgL}{(4/3)ML^2} = \dfrac{9g}{8L} = \dfrac{90}{7.2} = 12.5\ \mathrm{rad\,s^{-2}}$.`, { unit: 'rad/s²' }),
  nat(4, 'rolling in a loop', r`A solid sphere of tiny radius rolls without slipping down a track and round a vertical loop of radius 0.5 m. Find the least starting height above the bottom of the loop for it to just complete the loop (in m, $g = 10$).`, () => 2.7 * 0.5, 0.01, 2,
    r`At the top it needs $v^2 = gR$. Energy: $mgh = mg(2R) + \tfrac12mv^2\left(1 + \tfrac25\right) = 2mgR + 0.7\,mgR$. So $h = 2.7R = 1.35$ m. A sliding block would need only $2.5R$.`, { unit: 'm', trap: 'Rolling needs extra height for the spin energy.' }),
  nat(4, 'rolling with slipping', r`A solid sphere is thrown along a rough floor with a forward speed of $7\ \mathrm{m\,s^{-1}}$ and a <b>backspin</b> of $\omega_0 = 35\ \mathrm{rad\,s^{-1}}$ (so the contact point slides forward). Its radius is 0.2 m. Find the speed of its centre once it rolls without slipping (in $\mathrm{m\,s^{-1}}$).`, () => (5 * 7 - 2 * 0.2 * 35) / 7, 0, 0,
    r`Here $R\omega_0 = 7\ \mathrm{m\,s^{-1}}$. Take angular momentum about the contact line (friction has no torque about it). Forward linear momentum gives $+mv_0R$; backspin gives $-I\omega_0 = -\tfrac25mR^2\omega_0$. Finally $mvR + \tfrac25mR^2\dfrac vR = \tfrac75mvR$. So $\tfrac75v = v_0 - \tfrac25R\omega_0 = 7 - 2.8 = 4.2$ and $v = 3\ \mathrm{m\,s^{-1}}$, forward.`, { unit: 'm/s', trap: 'Backspin reduces the final forward speed: $v = (5v_0 - 2R\\omega_0)/7$.' }),

  // ---------- Level 5 ----------
  nat(5, 'collision with a rod', r`A uniform rod of mass 3 kg and length 1 m lies on a smooth horizontal table. A 1 kg ball moving at $12\ \mathrm{m\,s^{-1}}$ at right angles to the rod strikes one end and sticks. Find the angular speed of the combined body about its centre of mass just after (in rad/s, 2 decimals).`, () => { const M = 3; const m = 1; const L = 1; const v = 12; const x = m * (L / 2) / (M + m); const dp = L / 2 - x; const Icm = M * L * L / 12 + M * x * x + m * dp * dp; return m * v * dp / Icm; }, 0.01, 2,
    r`Centre of mass of rod + ball: $x_{cm} = \dfrac{1\times0.5}{4} = 0.125$ m from the rod's centre towards the ball. The ball is $0.5 - 0.125 = 0.375$ m from it. Angular momentum about this point (the table is smooth, so it is conserved about the common centre of mass): $L = 1\times12\times0.375 = 4.5$. $I_{cm} = \tfrac1{12}(3)(1) + 3(0.125)^2 + 1(0.375)^2 = 0.25 + 0.0469 + 0.1406 = 0.4375$. $\omega = 4.5/0.4375 = 10.29\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'The rod is free, so the pivot is the combined centre of mass, not the rod\'s centre.' }),
  nat(5, 'rod falling', r`A uniform rod of length 2 m stands vertically on a <b>smooth</b> horizontal floor and is released from a tiny tilt. It falls with its lower end sliding on the floor. Find the speed of its centre of mass just before the rod lies flat (in $\mathrm{m\,s^{-1}}$, $g = 10$, 2 decimals).`, () => Math.sqrt(3 * 10 * 2 / 4), 0.01, 2,
    r`No horizontal force acts, so the centre of mass falls straight down. When the rod is horizontal, the lower end moves horizontally and the centre moves vertically, so the instantaneous centre of rotation is the lower end itself: $v_{cm} = \omega\dfrac L2$. Energy: $Mg\dfrac L2 = \tfrac12Mv^2 + \tfrac12\cdot\dfrac{ML^2}{12}\cdot\dfrac{4v^2}{L^2} = \tfrac23Mv^2$. So $v^2 = \dfrac{3gL}{4} = 15$ and $v = 3.87\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'This is not the hinged case: with a smooth floor the energy is shared with the rod\'s spin about its own centre.' }),
  msq(5, 'rolling on incline', r`A uniform solid sphere (mass $m$, radius $R$) rolls without slipping down a rough incline of angle $\theta$. Which are correct?`,
    [r`The acceleration of its centre is $\tfrac57g\sin\theta$`, r`The friction on it is $\tfrac27mg\sin\theta$, up the slope`, r`Friction does negative work, so mechanical energy is lost`, r`It can roll without slipping only if $\mu_s\ge\tfrac27\tan\theta$`], [0, 1, 3],
    r`(a) $a = g\sin\theta/(1 + 2/5) = \tfrac57g\sin\theta$. (b) $f = mg\sin\theta - ma = \tfrac27mg\sin\theta$, acting up the slope. (c) False: the contact point is at rest, so static friction does no work and mechanical energy is conserved. (d) $f\le\mu_smg\cos\theta$ gives $\mu_s\ge\tfrac27\tan\theta$.`, { trap: 'Static friction in pure rolling dissipates no energy.' }),
  msq(5, 'rod released from horizontal', r`A uniform rod of mass $M$ and length $L$, hinged at one end, is released from the horizontal. Which are correct?`,
    [r`Just after release, the angular acceleration is $\dfrac{3g}{2L}$`, r`Just after release, the force from the hinge is $\dfrac{Mg}{4}$`, r`At the vertical position, the angular speed is $\sqrt{\dfrac{3g}{L}}$`, r`At the vertical position, the force from the hinge is $\dfrac{3Mg}{2}$`], [0, 1, 2],
    r`(a) $\tau/I = (MgL/2)/(ML^2/3)$. (b) $Mg - N = M\alpha L/2 = \tfrac34Mg$, so $N = Mg/4$. (c) Energy conservation. (d) False: at the bottom $N - Mg = M\omega^2\dfrac L2 = \dfrac32Mg$, so $N = \dfrac52Mg$.`),
  msq(4, 'angular momentum conservation', r`A skater spinning with her arms outstretched pulls them in. Which are correct?`,
    ['Her angular momentum is unchanged', 'Her angular speed increases', 'Her rotational kinetic energy is unchanged', 'Her moment of inertia decreases'], [0, 1, 3],
    r`No external torque, so $L = I\omega$ is constant; $I$ falls, so $\omega$ rises. Kinetic energy $L^2/2I$ rises, so (c) is false: she does work pulling her arms in.`),
  msq(3, 'perpendicular axis theorem', r`A thin uniform square plate (side $a$, mass $M$) lies in the $xy$-plane with the origin at its centre and axes parallel to the sides. Which are correct?`,
    [r`$I_x = I_y$`, r`$I_z = I_x + I_y$`, r`$I_x = \tfrac1{12}Ma^2$`, r`$I_z = \tfrac13Ma^2$`], [0, 1, 2],
    r`By symmetry $I_x = I_y = \tfrac1{12}Ma^2$ (like a rod of length $a$). The perpendicular axis theorem gives $I_z = \tfrac16Ma^2$. So (d) $\tfrac13Ma^2$ is wrong.`),
  msq(4, 'rolling with slipping', r`A uniform solid cylinder is placed with speed $v_0$ and no spin on a rough floor. While it slips, which are correct?`,
    ['Kinetic friction acts opposite to the motion of the centre', 'Its angular momentum about a point on the floor is conserved', 'Mechanical energy is conserved', r`Its final speed (pure rolling) is $\tfrac23v_0$`], [0, 1, 3],
    r`(a) The contact point slides forward, so friction acts backward. (b) Friction passes through the floor line, so its torque about a floor point is zero (about the contact point or any point on the floor along the line). (c) False: energy is lost as heat during slipping. (d) $mv_0R = (mR + \tfrac12mR)v$, so $v = \tfrac23v_0$.`),
  msq(3, 'equilibrium', r`A body is acted on by three coplanar forces and stays in equilibrium. Which must be true?`,
    ['The net force is zero', 'The net torque about any point is zero', 'The lines of action are parallel, or meet at a point', 'All three forces are equal in size'], [0, 1, 2],
    r`Equilibrium needs zero net force and zero net torque about every point. Three non-parallel forces balance only if their lines meet at one point (otherwise the torque about the intersection of two of them would not vanish). They need not be equal in size.`),
  msq(4, 'friction and rolling', r`A solid cylinder rolls without slipping on a rough floor while a horizontal force acts at its centre. Which are correct?`,
    ['The friction is static', 'The friction acts opposite to the force', 'The friction does zero net work on the cylinder', 'The acceleration is $2F/3M$'], [0, 1, 2, 3],
    r`$F - f = Ma$ and $fR = \tfrac12MR^2(a/R)$ give $f = \tfrac12Ma$ and $a = 2F/(3M)$, with $f = F/3$ opposite to $F$. The contact point is at rest, so the friction is static and its work is zero.`),

  // extra items
  nat(1, 'rotational kinematics', r`A wheel turns at a steady $3\ \mathrm{rad\,s^{-1}}$. Through what angle does it turn in 10 s (in rad)?`, () => 3 * 10, 0, 0,
    r`$\theta = \omega t = 3\times10 = 30$ rad.`, { unit: 'rad' }),
  nat(1, 'rotational kinematics', r`A point 0.4 m from the axis of a wheel turning at $5\ \mathrm{rad\,s^{-1}}$ has what speed (in $\mathrm{m\,s^{-1}}$)?`, () => 0.4 * 5, 0, 0,
    r`$v = r\omega = 0.4\times5 = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(1, 'torque', r`The torque of a force about an axis is zero when`, 'the line of action of the force passes through the axis', ['the force is perpendicular to the arm', 'the force is large', 'the arm is long'],
    r`$\tau = rF\sin\theta$. It is zero if $r = 0$ or $\sin\theta = 0$ (the force is along the line to the axis). A force perpendicular to the arm gives the largest torque.`),
  mcq(1, 'analogy', r`In rotational motion, the quantity that plays the role of mass in $F = ma$ is`, 'the moment of inertia', ['the angular momentum', 'the torque', 'the angular velocity'],
    r`$\tau = I\alpha$ matches $F = ma$: torque for force, angular acceleration for acceleration, moment of inertia for mass.`),
  nat(1, 'angular momentum', r`A body with moment of inertia $0.5\ \mathrm{kg\,m^2}$ turns at $8\ \mathrm{rad\,s^{-1}}$. Find its angular momentum (in $\mathrm{kg\,m^2\,s^{-1}}$).`, () => 0.5 * 8, 0, 0,
    r`$L = I\omega = 0.5\times8 = 4$.`, { unit: 'kg m²/s' }),
  nat(2, 'torque and angular acceleration', r`A disc of moment of inertia $0.8\ \mathrm{kg\,m^2}$ turns at $6\ \mathrm{rad\,s^{-1}}$. A constant braking torque stops it in 4 s. Find the torque (in N m).`, () => 0.8 * 6 / 4, 0.01, 2,
    r`$\alpha = 6/4 = 1.5\ \mathrm{rad\,s^{-2}}$, so $\tau = I\alpha = 0.8\times1.5 = 1.2$ N m. (Or $\tau\,t = \Delta L = 0.8\times6$.)`, { unit: 'N m' }),
  mcq(2, 'rolling energy', r`A solid sphere and a hollow sphere, equal in mass and radius, roll without slipping at the same centre speed. The greater total kinetic energy belongs to the`, 'hollow sphere', ['solid sphere', 'both equally', 'the one with the larger density, whichever it is'],
    r`$K = \tfrac12mv^2(1 + k^2/R^2)$ with $k^2/R^2 = 2/3$ for hollow and $2/5$ for solid. The hollow sphere has more rotational energy.`),
  nat(2, 'parallel axis theorem', r`A solid sphere of mass 5 kg and radius 0.1 m turns about a tangent. Find the moment of inertia (in $\mathrm{kg\,m^2}$).`, () => 7 / 5 * 5 * 0.01, 0.001, 3,
    r`$I = \tfrac25MR^2 + MR^2 = \tfrac75MR^2 = 1.4\times5\times0.01 = 0.07\ \mathrm{kg\,m^2}$.`, { unit: 'kg m²' }),
  nat(2, 'rolling', r`A wheel rolls without slipping with its centre moving at $3\ \mathrm{m\,s^{-1}}$. Find the speed of the highest point (in $\mathrm{m\,s^{-1}}$).`, () => 2 * 3, 0, 0,
    r`The top point has the centre's velocity plus $\omega R$ in the same direction: $v + v = 2v = 6\ \mathrm{m\,s^{-1}}$. The bottom point is at rest.`, { unit: 'm/s' }),
  stm(2, 'equilibrium', r`A body in rotational equilibrium must be at rest.`, r`A couple produces a net force on a body.`, 1,
    r`I is false: a wheel turning at a steady rate has zero net torque. II is false: a couple has zero net force and only a torque. Both false.`),
  nat(3, 'mixed', r`A solid sphere of mass 2 kg rolls without slipping at $5\ \mathrm{m\,s^{-1}}$ and hits a light spring ($k = 280\ \mathrm{N\,m^{-1}}$), which it compresses while still rolling without slipping on a rough surface. Find the greatest compression (in m, 2 decimals).`, () => Math.sqrt(0.7 * 2 * 25 * 2 / 280), 0.01, 2,
    r`Total kinetic energy $= \tfrac12mv^2(1 + \tfrac25) = 0.7\times2\times25 = 35$ J goes into the spring: $\tfrac12kx^2 = 35$, so $x = \sqrt{70/280} = 0.5$ m. (Pure rolling means friction does no work.)`, { unit: 'm', trap: 'Include the spin energy.' }),
  nat(4, 'mixed', r`Masses of 3 kg and 1 kg hang from a string over a disc pulley of mass 4 kg ($I = \tfrac12MR^2$) turning without slipping. Find the tension in the string on the 3 kg side (in N, $g = 10$, 1 decimal).`, () => 3 * (10 - 20 / 6), 0.1, 1,
    r`Let the acceleration be $a$. $3g - T_1 = 3a$, $T_2 - g = 1\times a$, and for the pulley $(T_1 - T_2)R = \tfrac12MR^2\dfrac aR$, so $T_1 - T_2 = 2a$. Adding: $2g = (3 + 1 + 2)a$, so $a = \dfrac{20}{6} = 3.33\ \mathrm{m\,s^{-2}}$. $T_1 = 3(10 - 3.33) = 20$ N, and $T_2 = 10 + 3.33 = 13.3$ N.`, { unit: 'N', format: 'numeric', trap: 'The two tensions are different when the pulley has mass.' }),
  nat(5, 'centre of percussion', r`A uniform rod of length 0.9 m lies at rest on a smooth horizontal table, pivoted at one end by a pin. A sharp horizontal blow at right angles to the rod is applied at a distance $x$ from the pin, and the pin feels no impulse. Find $x$ (in m).`, () => 2 * 0.9 / 3, 0.01, 2,
    r`The impulse $J$ gives the centre of mass $v = J/M$ and the rod angular momentum $Jx = I\omega$ with $I = \tfrac13ML^2$. For no impulse from the pin the pivot must stay at rest: $v_{cm} = \omega\dfrac L2$, so $\dfrac JM = \dfrac{Jx}{ML^2/3}\cdot\dfrac L2$, giving $x = \dfrac{2L}{3} = 0.6$ m (the centre of percussion).`, { unit: 'm', trap: 'A blow at the centre of percussion is the "sweet spot" of a bat.' }),
  nat(5, 'cue ball', r`A billiard ball (solid sphere of radius 3 cm) rests on a table. A horizontal cue hits it in a vertical plane through its centre so that it starts rolling without slipping at once. Find the height of the point of impact above the table (in cm, 1 decimal).`, () => 3 + 0.4 * 3, 0.05, 1,
    r`Let the impulse $J$ act at a height $x$ above the centre. $mv = J$ and $I\omega = Jx$ with $I = \tfrac25mR^2$. Rolling needs $v = \omega R$: $\dfrac Jm = \dfrac{Jx}{\tfrac25mR^2}R$, so $x = \tfrac25R = 1.2$ cm above the centre. The height above the table is $R + \tfrac25R = \tfrac75R = 4.2$ cm.`, { unit: 'cm', trap: 'The height is measured from the table, so add the radius.' }),
  nat(5, 'slipping down an incline', r`A solid sphere of radius 0.1 m is placed on a $60^\circ$ incline with $\mu = 0.3$ ($\sin60^\circ = 0.866$, $\cos60^\circ = 0.5$, $g = 10$). Find its angular acceleration (in $\mathrm{rad\,s^{-2}}$).`, () => 5 * 0.3 * 10 * 0.5 / (2 * 0.1), 0.1, 1,
    r`First test for rolling: the minimum $\mu$ is $\tfrac27\tan60^\circ = 0.495$. Since $0.3 < 0.495$, the sphere slips, so friction is kinetic: $f = \mu mg\cos\theta$. The torque about the centre gives $fR = \tfrac25mR^2\alpha$, so $\alpha = \dfrac{5f}{2mR} = \dfrac{5\times0.3\times10\times0.5}{2\times0.1} = 37.5$. So $\alpha = 37.5\ \mathrm{rad\,s^{-2}}$.`, { unit: 'rad/s²', format: 'numeric' }),
  nat(5, 'walking on a platform', r`A horizontal disc platform of mass 240 kg turns freely about its axis, initially at rest, with a 60 kg man on its rim. He walks once round the rim relative to the platform. Through what angle does the platform turn relative to the ground (in degrees, magnitude)?`, () => 360 * 60 / (60 + 120), 0, 0,
    r`Total angular momentum stays zero. Let the man's angular speed relative to the platform be $\omega_r$ and the platform's $\omega_p$ (opposite way). $mR^2(\omega_r - \omega_p) = \tfrac12MR^2\omega_p$ gives $\omega_p = \dfrac{m\omega_r}{m + M/2} = \dfrac{60}{180}\omega_r$. The platform turns $\tfrac13$ of the man's relative angle: $\tfrac13\times360^\circ = 120^\circ$.`, { unit: 'degrees', trap: 'The man turns by less than 360° relative to the ground, because the platform turns the other way.' }),

  // ---------- Assertion / Reason ----------
  asrt(2, 'angular momentum conservation', r`When a person on a rotating stool pulls her arms in, she spins faster.`, r`The angular momentum of the system is conserved about the axis.`, 0,
    r`No outside torque acts about the vertical axis, so $I\omega$ is constant; lowering $I$ raises $\omega$. R explains A.`),
  asrt(3, 'rolling', r`In pure rolling the force of friction does no work on the rolling body.`, r`Friction always acts in the direction of the body's motion.`, 2,
    r`A is true: the point of contact is at rest, so the work done by static friction on it is zero. R is false: in many cases (a decelerating roller, a ring on an incline) friction acts against the motion, and in pure rolling it can have either direction.`),
  asrt(3, 'rolling on incline', r`A hollow sphere takes longer than a solid sphere to roll down the same rough incline.`, r`A hollow sphere has a smaller moment of inertia than a solid sphere of the same mass and radius.`, 2,
    r`$a\propto1/(1 + k^2/R^2)$ with $k^2/R^2 = 2/3$ for hollow and $2/5$ for solid, so the hollow sphere is slower and A is true. R is false: the hollow sphere has the larger $I$ ($\tfrac23MR^2$ against $\tfrac25MR^2$), and that is the reason for A.`),
  asrt(3, 'perpendicular axis theorem', r`The perpendicular axis theorem can be used to find the moment of inertia of a solid cube about an axis through its centre.`, r`The perpendicular axis theorem applies only to planar bodies.`, 3,
    r`A is false because a cube is not planar. R is true: the proof uses $z = 0$ for every point, so the body must lie in the plane.`, { trap: 'Do not confuse it with the parallel axis theorem.' }),
  asrt(3, 'equilibrium', r`A body can be in translational equilibrium and still rotate with increasing angular speed.`, r`Torque is the rotational analogue of force.`, 1,
    r`A is true: a couple (two equal and opposite forces along different lines) has zero net force but a net torque, so the body speeds up its spin while its centre of mass does not accelerate. R is also true, but it does not explain A.`),
  asrt(4, 'moment of inertia', r`At the same angular speed, a solid disc stores more rotational kinetic energy than a thin ring of the same mass and radius.`, r`Rotational kinetic energy is $\tfrac12I\omega^2$.`, 3,
    r`R is true. A is false: the ring has the larger moment of inertia ($MR^2$ against $\tfrac12MR^2$), so at equal $\omega$ it stores twice the energy.`, { trap: 'A true formula does not make the conclusion drawn from it true.' }),
  asrt(4, 'angular momentum', r`The angular momentum of a particle moving in a straight line at constant speed is the same about every point on that line.`, r`The position vector of the particle from a point on its path is parallel to its velocity.`, 0,
    r`$\vec L = \vec r\times m\vec v$. For a point on the line of motion, $\vec r\parallel\vec v$ so $\vec L = 0$. A is true (it is zero), and R explains it.`),
  asrt(5, 'rolling', r`A ring rolling without slipping on a horizontal floor has its kinetic energy equally shared between translation and rotation.`, r`For a ring $I = \tfrac12MR^2$, so $\tfrac12I\omega^2 = \tfrac12Mv^2$.`, 2,
    r`A is true: with $\omega = v/R$ and $I = MR^2$, rotational $K = \tfrac12MR^2(v/R)^2 = \tfrac12Mv^2$, equal to the translational part. R is false: $\tfrac12MR^2$ is the disc's moment of inertia, not the ring's.`),

  // ---------- Statements ----------
  stm(2, 'torque', r`The torque of a force depends on the choice of origin.`, r`The angular momentum of a particle also depends on the choice of origin.`, 0,
    r`$\vec\tau = \vec r\times\vec F$ and $\vec L = \vec r\times\vec p$ both use the position vector from the chosen origin. Both are true.`),
  stm(3, 'parallel axis theorem', r`The moment of inertia of a body about an axis through its centre of mass is the least among all parallel axes.`, r`$I = I_{cm} + Md^2$ holds only when the axis passes through the body.`, 2,
    r`I is true: $Md^2\ge0$ so $I\ge I_{cm}$. II is false: the theorem holds for any parallel axis at distance $d$, even one outside the body (such as an axis through the centre of a ring).`),
  stm(3, 'rolling', r`The force of friction on a body rolling without slipping down an incline is kinetic friction.`, r`Static friction does no work on a body that is rolling without slipping.`, 3,
    r`I is false: the contact point is at rest relative to the surface, so the friction is static (and it may be less than $\mu_sN$). II is true.`),
  stm(3, 'rolling on incline', r`The acceleration of a solid cylinder rolling down an incline increases when its radius is increased.`, r`A solid cylinder takes less time than a hollow cylinder of the same mass and radius to roll down the same incline.`, 3,
    r`I is false: $a = \tfrac23g\sin\theta$ has no mass or radius in it. II is true: the hollow cylinder (ring-like) has $a = \tfrac12g\sin\theta$, so it is slower.`),
  stm(3, 'ladder', r`A ladder resting on a smooth wall and a rough floor has the force of friction at the floor equal to the wall's normal force.`, r`The normal reaction of the floor is half the weight of the ladder.`, 2,
    r`I is true: horizontal balance gives $f = N_w$. II is false: vertical balance gives $N_{floor} = W$ (the whole weight, plus any load) because the smooth wall exerts no vertical force.`),
  stm(4, 'angular momentum', r`A net external force on a system can be non-zero while its angular momentum stays constant.`, r`If the net external torque on a system is zero, its angular momentum is conserved.`, 0,
    r`II is the law. I is possible: for a planet the gravitational force is non-zero, but it has zero torque about the Sun, so $\vec L$ is constant. Both true.`),
  stm(4, 'rolling', r`The total kinetic energy of a body that rolls without slipping equals $\tfrac12I_P\omega^2$, with $I_P$ taken about the contact point.`, r`The kinetic energy equals $\tfrac12Mv_{cm}^2$ alone.`, 2,
    r`I is true: pure rolling is a rotation about the instantaneous contact point, so $K = \tfrac12I_P\omega^2 = \tfrac12(I_{cm} + MR^2)\omega^2$. II is false: it leaves out the rotational part $\tfrac12I_{cm}\omega^2$.`),
  mcq(4, 'concepts', r`How many are correct? (a) The moment of inertia of a body is the same about all axes through its centre of mass. (b) A couple has the same torque about every point. (c) A body in rotational equilibrium must be at rest. (d) For a rolling body, the lowest point is at rest relative to the ground only in pure rolling. (e) Angular momentum is a vector.`, '3', ['2', '4', '5'],
    r`(a) false. (b) true. (c) false: it can rotate at constant angular speed. (d) true. (e) true. Three are correct.`, { format: 'statements', trap: 'Zero torque means constant $L$, not zero rotation.' }),
  mcq(5, 'concepts', r`Consider: (a) a solid sphere and a ring of equal mass and radius roll without slipping down the same incline; (b) the same bodies slide down a smooth identical incline. How many of the following are true? (i) in (a) the sphere wins; (ii) in (b) they reach together; (iii) in (a) the friction on both acts up the slope; (iv) in (b) the ring spins.`, '3', ['2', '4', '1'],
    r`(i) true. (ii) true: acceleration $g\sin\theta$ for both when smooth. (iii) true. (iv) false: a smooth incline gives no torque, so the ring slides without spinning. Three are true.`, { format: 'statements' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'moment of inertia', group: 'm1',
    q: 'Match each body in List I (mass $M$) with its moment of inertia in List II, about the axis stated.',
    options: ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-q, B-s, C-p, D-r'], answer: 0,
    sol: r`Ring about its axis: $MR^2$ (r). Solid sphere about a diameter: $\tfrac25MR^2$ (s). Thin rod about a perpendicular axis through its centre: $\tfrac1{12}ML^2$ (p). Solid cylinder about its axis: $\tfrac12MR^2$ (q).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'rolling on incline', group: 'm2',
    q: r`Each body rolls without slipping down an incline. Match it with the acceleration of its centre in List II (as a multiple of $g\sin\theta$).`,
    options: ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`$a = g\sin\theta/(1 + k^2/R^2)$. Ring: $1/2$ (r). Hollow sphere: $1/(1 + 2/3) = 3/5$ (s). Solid sphere: $1/(1 + 2/5) = 5/7$ (p). Disc: $1/(1 + 1/2) = 2/3$ (q).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'rod released from horizontal', group: 'm3',
    q: r`A uniform rod of mass $M$ and length $L$ is hinged at one end and released from the horizontal. Match the quantity in List I with its value in List II.`,
    options: ['A-r, B-p, C-s, D-q', 'A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-r, B-s, C-p, D-q'], answer: 0,
    sol: r`(A) $\alpha = \dfrac{3g}{2L}$ (r). (B) $\omega = \sqrt{3g/L}$ (p). (C) Hinge force just after release: $Mg - M\alpha L/2 = \dfrac{Mg}{4}$ (s). (D) Hinge force at the vertical position: $Mg + M\omega^2\dfrac L2 = \dfrac52Mg$ (q).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'rolling on incline', group: 'm4',
    q: r`A body rolls without slipping down an incline. Match each body with the least $\mu_s$ it needs (as a multiple of $\tan\theta$).`,
    options: ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-q, D-s', 'A-p, B-q, C-r, D-s', 'A-s, B-r, C-q, D-p'], answer: 0,
    sol: r`Friction needed is $f = mg\sin\theta\cdot\dfrac{k^2/R^2}{1 + k^2/R^2}$, so $\mu_{min} = \tan\theta\cdot\dfrac{k^2/R^2}{1 + k^2/R^2}$. Ring: $\tfrac12$ (p). Disc: $\tfrac13$ (r). Solid sphere: $\tfrac27$ (q). Hollow sphere: $\tfrac25$ (s).` },
];

// vary the position of the correct code in match items
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [1, 3, 2, 0][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'Standard moments of inertia',
    list1: ['A. Thin ring, about its axis', 'B. Solid sphere, about a diameter', 'C. Thin rod of length $L$, about a perpendicular axis through its centre', 'D. Solid cylinder, about its own axis'],
    list2: [r`p. $\tfrac1{12}ML^2$`, r`q. $\tfrac12MR^2$`, r`r. $MR^2$`, r`s. $\tfrac25MR^2$`] },
  m2: { title: 'Acceleration of rolling bodies',
    list1: ['A. Ring', 'B. Hollow sphere', 'C. Solid sphere', 'D. Solid disc'],
    list2: ['p. $5/7$', 'q. $2/3$', 'r. $1/2$', 's. $3/5$'] },
  m3: { title: 'A rod released from the horizontal',
    list1: ['A. Angular acceleration just after release', 'B. Angular speed at the vertical position', 'C. Force from the hinge just after release', 'D. Force from the hinge at the vertical position'],
    list2: [r`p. $\sqrt{3g/L}$`, r`q. $\tfrac52Mg$`, r`r. $\dfrac{3g}{2L}$`, r`s. $\tfrac14Mg$`] },
  m4: { title: 'Friction needed for rolling',
    list1: ['A. Ring', 'B. Solid disc', 'C. Solid sphere', 'D. Hollow sphere'],
    list2: [r`p. $\tfrac12\tan\theta$`, r`q. $\tfrac27\tan\theta$`, r`r. $\tfrac13\tan\theta$`, r`s. $\tfrac25\tan\theta$`] },
  p1: { title: 'A hinged rod',
    passage: r`<p>A uniform rod of mass 3 kg and length 1.2 m is hinged at one end so that it can swing in a vertical plane. It is held horizontal and released. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p2: { title: 'A sphere thrown on a rough floor',
    passage: r`<p>A solid sphere of mass $m$ is thrown along a rough horizontal floor with a speed of $7\ \mathrm{m\,s^{-1}}$ and no spin. The coefficient of kinetic friction is 0.2. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p3: { title: 'A ladder on a smooth wall',
    passage: r`<p>A uniform ladder of weight 200 N rests with its upper end against a smooth vertical wall and its foot on rough ground. The ladder makes an angle of $53^\circ$ with the ground ($\sin53^\circ = 0.8$, $\cos53^\circ = 0.6$).</p>` },
};

const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(3, 'rod released from horizontal', 'p1', r`Find the angular acceleration just after release (in $\mathrm{rad\,s^{-2}}$).`, () => 3 * 10 / (2 * 1.2), 0.01, 2,
    r`$\alpha = \dfrac{3g}{2L} = \dfrac{30}{2.4} = 12.5\ \mathrm{rad\,s^{-2}}$.`, { unit: 'rad/s²' }),
  pas(3, 'rod released from horizontal', 'p1', r`Find the angular speed when the rod is vertical (in rad/s).`, () => Math.sqrt(3 * 10 / 1.2), 0, 0,
    r`$\omega = \sqrt{3g/L} = \sqrt{25} = 5\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  pas(4, 'rod released from horizontal', 'p1', r`Find the force exerted by the hinge on the rod when it is vertical (in N).`, () => 3 * 10 + 3 * 25 * 0.6, 0, 0,
    r`At the lowest position the centre of mass moves in a circle of radius $L/2 = 0.6$ m. $N - Mg = M\omega^2\dfrac L2 = 3\times25\times0.6 = 45$ N. So $N = 30 + 45 = 75$ N (equal to $\tfrac52Mg$).`, { unit: 'N', trap: 'The hinge force at the bottom is much more than the weight because of the centripetal need.' }),
  pas(3, 'rolling with slipping', 'p2', r`Find the time before the sphere rolls without slipping (in s).`, () => 2 * 7 / (7 * 0.2 * 10), 0, 0,
    r`$v = v_0 - \mu gt = 7 - 2t$ and $R\omega = \dfrac{5\mu g}{2}t = 5t$. Equal when $t = 1$ s.`, { unit: 's' }),
  pas(3, 'rolling with slipping', 'p2', r`Find its speed when pure rolling begins (in $\mathrm{m\,s^{-1}}$).`, () => 5 * 7 / 7, 0, 0,
    r`$v = 7 - 2\times1 = 5\ \mathrm{m\,s^{-1}}$ (which equals $\tfrac57v_0$).`, { unit: 'm/s' }),
  pas(4, 'rolling with slipping', 'p2', r`What fraction of the initial kinetic energy is lost as heat while it slips (3 decimals)?`, () => 1 - 0.7 * 25 / (0.5 * 49), 0.002, 3,
    r`Initial: $\tfrac12m(49) = 24.5m$. Final (rolling at 5): $\tfrac12m(25)(1.4) = 17.5m$. Lost $= 7m$, fraction $= 7/24.5 = 2/7 = 0.286$.`, { trap: 'The energy of the final rolling motion includes spin.' }),
  pas(3, 'ladder', 'p3', r`Find the force the wall exerts on the ladder (in N).`, () => 200 * 0.6 / (2 * 0.8), 0, 0,
    r`Torque about the foot: $N_wL\sin\theta = W\dfrac L2\cos\theta$. $N_w = \dfrac{W\cos\theta}{2\sin\theta} = \dfrac{200\times0.6}{1.6} = 75$ N.`, { unit: 'N' }),
  pas(3, 'ladder', 'p3', r`Find the force of friction at the ground (in N).`, () => 75, 0, 0,
    r`Horizontal balance: friction $= N_w = 75$ N. It points towards the wall, opposing the foot's tendency to slip away from it.`, { unit: 'N' }),
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'ladder', group: 'p3', answer: 1,
    q: 'What is the least coefficient of friction at the ground that keeps the ladder at rest?',
    options: ['0.30', '0.375', '0.60', '0.75'],
    sol: r`The floor's normal reaction is the ladder's weight, 200 N. Friction needed is 75 N. $\mu\ge75/200 = 0.375$.`, trap: 'The normal reaction at the floor is the weight (there is no friction on the wall).' },
);

const gens = [
  { id: 'rm-g01', type: 'nat', level: 2, exams: EX[2], sub: 'torque',
    make(rng) {
      const F = pick(rng, 5, 40, 5); const rr = pick(rng, 0.2, 1.5, 0.1); const th = choose(rng, [30, 37, 53, 60, 90]);
      const t = F * rr * Math.sin(th * D);
      return { F, rr, th, q: `A force of ${F} N acts at the end of an arm ${rr} m long, at ${th}° to the arm. Find the torque about the other end (in N m, 2 decimals).`, answer: +t.toFixed(2), tol: 0.01, unit: 'N m',
        sol: `$\\tau = rF\\sin\\theta = ${rr}\\times${F}\\times\\sin${th}^\\circ = ${t.toFixed(2)}$ N m. Only the component of the force perpendicular to the arm turns it.`, trap: 'Use the angle between the force and the arm.' };
    },
    verify: (p) => { const x = p.rr; const Fx = p.F * Math.cos(p.th * D); const Fy = p.F * Math.sin(p.th * D); return x * Fy - 0 * Fx; } },
  { id: 'rm-g02', type: 'mcq', level: 2, exams: EX[2], sub: 'moment of inertia',
    make(rng) {
      const bodies = [['thin ring about its axis', 1], ['uniform disc about its axis', 0.5], ['solid sphere about a diameter', 0.4], ['thin hollow sphere about a diameter', 2 / 3]];
      const b = choose(rng, bodies); const M = pick(rng, 1, 10, 1); const R = pick(rng, 0.1, 0.8, 0.1);
      const I = b[1] * M * R * R; const wrongs = bodies.filter((x) => x !== b).map((x) => x[1] * M * R * R).concat([b[1] * M * R]);
      const o = numOpts(rng, I, wrongs, 'kg m²', 3);
      return { M, R, k2: b[1], q: `Find the moment of inertia of a ${b[0]} of mass ${M} kg and radius ${R} m.`, ...o,
        sol: `Use the standard value $I = ${b[1] === 1 ? '' : b[1] === 0.5 ? '\\tfrac12' : b[1] === 0.4 ? '\\tfrac25' : '\\tfrac23'}MR^2 = ${fmt(b[1], 3)}\\times${M}\\times${R}^2 = ${fmt(I, 3)}\\ \\mathrm{kg\\,m^2}$. The other options use the coefficient of another body or forget to square $R$.`, trap: 'Know which coefficient goes with which body.', _I: I };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.k2 * p.M * p.R * p.R, 3)} kg m²`) },
  { id: 'rm-g03', type: 'nat', level: 3, exams: EX[3], sub: 'parallel axis theorem',
    make(rng) {
      const M = pick(rng, 1, 6, 1); const L = pick(rng, 0.6, 2, 0.2); const x = pick(rng, 0.1, 0.5, 0.1) * L;
      const I = M * L * L / 12 + M * x * x;
      return { M, L, x, q: `A uniform rod of mass ${M} kg and length ${L} m turns about an axis perpendicular to it at a distance ${+x.toFixed(3)} m from its centre. Find the moment of inertia (in $\\mathrm{kg\\,m^2}$, 3 decimals).`, answer: +I.toFixed(3), tol: 0.002, unit: 'kg m²',
        sol: `$I = I_{cm} + Md^2 = \\dfrac{ML^2}{12} + Md^2 = \\dfrac{${M}\\times${L}^2}{12} + ${M}\\times${+x.toFixed(3)}^2 = ${I.toFixed(3)}\\ \\mathrm{kg\\,m^2}$.`, trap: 'Do not use $ML^2/3$ unless the axis is at the end.' };
    },
    verify: (p) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const pos = (i + 0.5) / n * p.L - p.L / 2; s += (p.M / n) * (pos - p.x) ** 2; } return s; } },
  { id: 'rm-g04', type: 'nat', level: 3, exams: EX[3], sub: 'angular momentum conservation',
    make(rng) {
      const M = pick(rng, 40, 100, 10); const R = pick(rng, 1, 2, 0.5); const m = pick(rng, 40, 80, 10); const r2 = pick(rng, 0.2, 0.6, 0.2) * R; const w1 = pick(rng, 1, 4, 0.5);
      const I0 = 0.5 * M * R * R; const I1 = I0 + m * R * R; const I2 = I0 + m * r2 * r2; const w2 = I1 * w1 / I2;
      return { M, R, m, r2, w1, q: `A uniform platform of mass ${M} kg and radius ${R} m turns freely about its vertical axis at ${w1} rad/s with a ${m} kg person standing at its rim. The person walks to ${+r2.toFixed(2)} m from the axis. Find the new angular speed (in rad/s, 2 decimals).`, answer: +w2.toFixed(2), tol: 0.01, unit: 'rad/s',
        sol: `$I_1 = \\tfrac12MR^2 + mR^2 = ${I1}$ and $I_2 = \\tfrac12MR^2 + mr^2 = ${+I2.toFixed(2)}\\ \\mathrm{kg\\,m^2}$. $I_1\\omega_1 = I_2\\omega_2$, so $\\omega_2 = ${I1}\\times${w1}/${+I2.toFixed(2)} = ${w2.toFixed(2)}\\ \\mathrm{rad\\,s^{-1}}$.`, trap: 'The platform keeps its own moment of inertia.' };
    },
    verify: (p) => { const L = (0.5 * p.M * p.R ** 2 + p.m * p.R ** 2) * p.w1; return L / (0.5 * p.M * p.R ** 2 + p.m * p.r2 ** 2); } },
  { id: 'rm-g05', type: 'nat', level: 3, exams: EX[3], sub: 'rolling on incline',
    make(rng) {
      const bodies = [['ring', 1], ['solid cylinder', 0.5], ['solid sphere', 0.4], ['hollow sphere', 2 / 3]]; const b = choose(rng, bodies);
      const th = choose(rng, [30, 37, 45, 53]); const a = 9.8 * Math.sin(th * D) / (1 + b[1]);
      return { k2: b[1], th, q: `A ${b[0]} rolls without slipping down a rough incline of ${th}°. Find the acceleration of its centre (in $\\mathrm{m\\,s^{-2}}$, $g = 9.8$, 2 decimals).`, answer: +a.toFixed(2), tol: 0.01, unit: 'm/s²',
        sol: `$a = \\dfrac{g\\sin\\theta}{1 + k^2/R^2}$ with $k^2/R^2 = ${fmt(b[1], 3)}$ for a ${b[0]}. $a = \\dfrac{9.8\\times\\sin${th}^\\circ}{${fmt(1 + b[1], 4)}} = ${a.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'A sliding block would have $g\\sin\\theta$.' };
    },
    verify: (p) => { const s = 1; const v2 = 2 * 9.8 * s * Math.sin(p.th * D) / (1 + p.k2); return v2 / (2 * s); } },
  { id: 'rm-g06', type: 'nat', level: 3, exams: EX[3], sub: 'rolling energy',
    make(rng) {
      const bodies = [['ring', 1], ['solid cylinder', 0.5], ['solid sphere', 0.4]]; const b = choose(rng, bodies); const v = pick(rng, 2, 8, 1);
      const h = v * v * (1 + b[1]) / (2 * 9.8);
      return { k2: b[1], v, q: `A ${b[0]} rolls without slipping on a level floor at $${v}\\ \\mathrm{m\\,s^{-1}}$ and then rolls up a rough incline. Find the greatest height it reaches (in m, $g = 9.8$, 2 decimals).`, answer: +h.toFixed(2), tol: 0.01, unit: 'm',
        sol: `Total kinetic energy $\\tfrac12mv^2(1 + k^2/R^2)$ becomes $mgh$. $h = \\dfrac{v^2(1 + ${fmt(b[1], 3)})}{2g} = \\dfrac{${v * v}\\times${fmt(1 + b[1], 4)}}{19.6} = ${h.toFixed(2)}$ m.`, trap: 'Include the rotational kinetic energy.' };
    },
    verify: (p) => { const m = 1; const R = 1; const K = 0.5 * m * p.v ** 2 + 0.5 * (p.k2 * m * R * R) * (p.v / R) ** 2; return K / (m * 9.8); } },
  { id: 'rm-g07', type: 'nat', level: 4, exams: EX[4], sub: 'rolling with slipping',
    make(rng) {
      const bodies = [['ring', 1], ['solid cylinder', 0.5], ['solid sphere', 0.4]]; const b = choose(rng, bodies);
      const v0 = pick(rng, 3, 12, 1); const mu = pick(rng, 0.1, 0.5, 0.1); const ask = choose(rng, ['t', 'v']);
      const k2 = b[1]; const vf = v0 / (1 + k2); const t = (v0 - vf) / (mu * 10);
      const ans = ask === 't' ? t : vf;
      return { k2, v0, mu, ask, q: `A ${b[0]} is thrown along a rough floor with speed $${v0}\\ \\mathrm{m\\,s^{-1}}$ and no spin ($\\mu_k = ${mu}$, $g = 10$). Find the ${ask === 't' ? 'time (s)' : 'speed (m/s)'} when it starts to roll without slipping (2 decimals).`, answer: +ans.toFixed(2), tol: 0.01, unit: ask === 't' ? 's' : 'm/s',
        sol: `Angular momentum about the contact line is conserved: $mv_0R = mvR(1 + k^2/R^2)$, so $v = \\dfrac{v_0}{1 + ${fmt(k2, 3)}} = ${vf.toFixed(2)}$ m/s. The centre decelerates at $\\mu g = ${mu * 10}$, so $t = (v_0 - v)/(\\mu g) = ${t.toFixed(2)}$ s. Answer: ${ans.toFixed(2)}.`, trap: 'Use $a = \\mu g$ for the centre.' };
    },
    verify: (p) => { const mu = p.mu; const k2 = p.k2; const tt = p.v0 * k2 / (mu * 10 * (1 + k2)); return p.ask === 't' ? tt : p.v0 - mu * 10 * tt; } },
  { id: 'rm-g08', type: 'nat', level: 3, exams: EX[3], sub: 'rod released from horizontal',
    make(rng) {
      const L = pick(rng, 0.4, 2, 0.2); const ask = choose(rng, ['alpha', 'omega']);
      const al = 3 * 9.8 / (2 * L); const om = Math.sqrt(3 * 9.8 / L); const ans = ask === 'alpha' ? al : om;
      return { L, ask, q: `A uniform rod of length ${L} m is hinged at one end and released from the horizontal. Find ${ask === 'alpha' ? 'its angular acceleration just after release (rad/s²)' : 'its angular speed when vertical (rad/s)'} ($g = 9.8$, 2 decimals).`, answer: +ans.toFixed(2), tol: 0.02, unit: ask === 'alpha' ? 'rad/s²' : 'rad/s',
        sol: ask === 'alpha' ? `$\\alpha = \\dfrac{Mg(L/2)}{ML^2/3} = \\dfrac{3g}{2L} = \\dfrac{29.4}{${2 * L}} = ${al.toFixed(2)}\\ \\mathrm{rad\\,s^{-2}}$.` : `$Mg\\dfrac L2 = \\tfrac12\\dfrac{ML^2}{3}\\omega^2$ gives $\\omega = \\sqrt{3g/L} = \\sqrt{${(3 * 9.8 / L).toFixed(2)}} = ${om.toFixed(2)}\\ \\mathrm{rad\\,s^{-1}}$.` };
    },
    verify: (p) => p.ask === 'alpha' ? (9.8 * p.L / 2) / (p.L * p.L / 3) : Math.sqrt(2 * (9.8 * p.L / 2) / (p.L * p.L / 3)) },
  { id: 'rm-g09', type: 'nat', level: 3, exams: EX[3], sub: 'ladder',
    make(rng) {
      const tri = choose(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]); const W = pick(rng, 100, 400, 50); const k = pick(rng, 1, 2, 1);
      const foot = tri[0] * k; const height = tri[1] * k; const f = W * (foot / 2) / height;
      return { W, foot, height, q: `A uniform ladder of weight ${W} N rests against a smooth wall. Its foot is ${foot} m from the wall and its top touches the wall ${height} m up. Find the friction at the ground (in N, 1 decimal).`, answer: +f.toFixed(1), tol: 0.1, unit: 'N',
        sol: `The wall force $N_w$ is found by torques about the foot: $N_w\\times${height} = ${W}\\times\\dfrac{${foot}}{2}$, so $N_w = ${f.toFixed(1)}$ N. Friction balances it horizontally: ${f.toFixed(1)} N.`, trap: 'The weight acts at the middle, half the horizontal distance.' };
    },
    verify: (p) => { const Nf = p.W; return (Nf * p.foot - p.W * p.foot / 2) / p.height; } },
  { id: 'rm-g10', type: 'nat', level: 2, exams: EX[2], sub: 'rolling energy',
    make(rng) {
      const bodies = [['ring', 1], ['solid cylinder', 0.5], ['solid sphere', 0.4], ['hollow sphere', 2 / 3]]; const b = choose(rng, bodies);
      const pc = 100 * b[1] / (1 + b[1]);
      return { k2: b[1], q: `What percentage of the total kinetic energy of a ${b[0]} rolling without slipping is rotational? (1 decimal)`, answer: +pc.toFixed(1), tol: 0.1, unit: '%',
        sol: `$K_{rot}/K = \\dfrac{k^2/R^2}{1 + k^2/R^2} = \\dfrac{${fmt(b[1], 3)}}{${fmt(1 + b[1], 4)}} = ${(pc / 100).toFixed(4)}$, i.e. ${pc.toFixed(1)} %.` };
    },
    verify: (p) => { const R = 1; const v = 3; const kr = 0.5 * p.k2 * (v / R) ** 2; const kt = 0.5 * v * v; return 100 * kr / (kr + kt); } },
  { id: 'rm-g11', type: 'nat', level: 3, exams: EX[3], sub: 'angular momentum conservation',
    make(rng) {
      const I1 = pick(rng, 0.2, 1, 0.1); const I2 = pick(rng, 0.2, 1, 0.1); const w = pick(rng, 10, 50, 5);
      const loss = 0.5 * I1 * w * w - 0.5 * (I1 + I2) * (I1 * w / (I1 + I2)) ** 2;
      return { I1, I2, w, q: `A disc of moment of inertia ${I1} kg m² turns at ${w} rad/s. A second disc of ${I2} kg m², at rest on the same axle, is dropped on it and the two stick. Find the kinetic energy lost (in J, 2 decimals).`, answer: +loss.toFixed(2), tol: 0.02, unit: 'J',
        sol: `Common speed $\\omega = \\dfrac{${I1}\\times${w}}{${+(I1 + I2).toFixed(1)}} = ${(I1 * w / (I1 + I2)).toFixed(2)}$ rad/s. $K_i = \\tfrac12(${I1})(${w})^2$ and $K_f = \\tfrac12(${+(I1 + I2).toFixed(1)})\\omega^2$. The difference is ${loss.toFixed(2)} J.`, trap: 'Energy is lost; angular momentum is not.' };
    },
    verify: (p) => p.I1 * p.I2 * p.w * p.w / (2 * (p.I1 + p.I2)) },
  { id: 'rm-g12', type: 'nat', level: 3, exams: EX[3], sub: 'pulley',
    make(rng) {
      const m = pick(rng, 1, 6, 1); const M = pick(rng, 2, 10, 2);
      const a = m * 9.8 / (m + M / 2);
      return { m, M, q: `A string wound on a solid disc pulley of mass ${M} kg, free to turn on a fixed axle, carries a ${m} kg mass. Find the acceleration of the mass (in $\\mathrm{m\\,s^{-2}}$, $g = 9.8$, 2 decimals).`, answer: +a.toFixed(2), tol: 0.01, unit: 'm/s²',
        sol: `$mg - T = ma$ and $T = \\tfrac12Ma$ (from $TR = \\tfrac12MR^2\\cdot a/R$). So $a = \\dfrac{mg}{m + M/2} = \\dfrac{${m}\\times9.8}{${m + M / 2}} = ${a.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'The pulley\'s inertia adds $M/2$ to the moving mass.' };
    },
    verify: (p) => { const h = 1; const v2 = 2 * p.m * 9.8 * h / (p.m + p.M / 2); return v2 / (2 * h); } },
  { id: 'rm-g13', type: 'mcq', level: 3, exams: EX[3], sub: 'rolling on incline',
    make(rng) {
      const bodies = [['ring', 1], ['solid cylinder', 0.5], ['solid sphere', 0.4], ['hollow sphere', 2 / 3]];
      let i = int(rng, 0, 3); let j = int(rng, 0, 3); if (i === j) j = (j + 1) % 4;
      const A = bodies[i]; const B = bodies[j];
      const ratio = Math.sqrt((1 + A[1]) / (1 + B[1])); // tA/tB
      const wr = [1 / ratio, (1 + A[1]) / (1 + B[1]), (1 + B[1]) / (1 + A[1])];
      const o = numOpts(rng, ratio, wr, '', 3);
      return { A1: A[1], B1: B[1], q: `A ${A[0]} and a ${B[0]} of the same mass and radius roll without slipping down the same incline from rest. Find the ratio (time for the ${A[0]}) / (time for the ${B[0]}).`, ...o,
        sol: `$a\\propto\\dfrac1{1 + k^2/R^2}$ and $t = \\sqrt{2s/a}$, so $\\dfrac{t_1}{t_2} = \\sqrt{\\dfrac{1 + ${fmt(A[1], 3)}}{1 + ${fmt(B[1], 3)}}} = ${fmt(ratio, 3)}$. A common slip is to forget the square root.`, trap: 'The time ratio is the square root of the ratio of $(1 + k^2/R^2)$.' };
    },
    verify: (p) => p.options.findIndex((o) => o === fmt(Math.sqrt((1 + p.A1) / (1 + p.B1)), 3)) },
  { id: 'rm-g14', type: 'nat', level: 2, exams: EX[2], sub: 'rotational kinematics',
    make(rng) {
      const I = pick(rng, 0.2, 2, 0.2); const tq = pick(rng, 1, 10, 1); const t = pick(rng, 2, 10, 1);
      const w = tq * t / I; const K = 0.5 * I * w * w;
      return { I, tq, t, q: `A flywheel of moment of inertia ${I} kg m² is acted on by a steady torque of ${tq} N m for ${t} s, starting from rest. Find its kinetic energy at the end (in J).`, answer: +K.toFixed(1), tol: 0.2, unit: 'J',
        sol: `$\\alpha = \\tau/I = ${+(tq / I).toFixed(3)}$, $\\omega = \\alpha t = ${+w.toFixed(2)}$ rad/s, $K = \\tfrac12I\\omega^2 = ${K.toFixed(1)}$ J.` };
    },
    verify: (p) => { const al = p.tq / p.I; const th = 0.5 * al * p.t * p.t; return p.tq * th; } },
  { id: 'rm-g15', type: 'nat', level: 4, exams: EX[4], sub: 'toppling and sliding',
    make(rng) {
      const M = pick(rng, 10, 60, 5); const b = pick(rng, 0.2, 0.8, 0.1); const h = pick(rng, 1, 2, 0.1);
      const F = M * 9.8 * b / (2 * h);
      return { M, b, h, q: `A uniform rectangular block of mass ${M} kg, width ${b} m and height ${h} m stands on a very rough floor. A horizontal force is applied at its top edge. Find the least force that topples it (in N, $g = 9.8$).`, answer: +F.toFixed(1), tol: 0.2, unit: 'N',
        sol: `Just toppling about the far lower edge: $F\\times h = Mg\\times\\dfrac b2$. $F = \\dfrac{${M}\\times9.8\\times${b}}{2\\times${h}} = ${F.toFixed(1)}$ N.`, trap: 'The floor is rough enough that it does not slide first.' };
    },
    verify: (p) => (p.M * 9.8 * (p.b / 2)) / p.h },
];

export default { topic: 'rotational-motion', groups, items, gens };
