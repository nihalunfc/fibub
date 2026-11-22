// Centre of mass and collisions: Plus Two entrance bank (original fibub questions).
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
const nid = () => `cm-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, answer, tol, sol, o = {}) =>
  base(level, sub, { type: 'nat', format: tol === 0 && Number.isInteger(answer) ? 'integer' : 'numeric', q, answer, tol, sol, ...o });
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

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'centre of mass', r`The centre of mass of two particles of equal mass lies`, 'at the midpoint of the line joining them', ['at the heavier particle', 'at either particle', 'at a point outside the line'],
    r`$x_{cm} = (mx_1 + mx_2)/2m = (x_1 + x_2)/2$, the midpoint.`),
  nat(1, 'centre of mass', r`A 2 kg particle is at $x = 0$ and a 3 kg particle is at $x = 5$ m. Find the position of their centre of mass (in m).`, 3, 0,
    r`$x_{cm} = (2\times0 + 3\times5)/(2+3) = 15/5 = 3$ m. It lies nearer the heavier particle.`, { unit: 'm' }),
  mcq(1, 'momentum conservation', r`The total linear momentum of a system is conserved when`, 'the net external force on the system is zero', ['the net internal force is zero', 'the kinetic energy is constant', 'the system is at rest'],
    r`Internal forces cancel in pairs and never change the total momentum. Only a net external force can. Kinetic energy may change (as in an inelastic collision).`),
  nat(1, 'momentum', r`Find the momentum of a 1500 kg car moving at $20\ \mathrm{m\,s^{-1}}$ (in $\mathrm{kg\,m\,s^{-1}}$).`, 30000, 0,
    r`$p = mv = 1500\times20 = 30\,000\ \mathrm{kg\,m\,s^{-1}}$.`, { unit: 'kg m/s' }),
  mcq(1, 'collisions', r`In a perfectly elastic collision`, 'both momentum and kinetic energy are conserved', ['only momentum is conserved', 'only kinetic energy is conserved', 'neither is conserved'],
    r`Momentum is conserved in every collision of an isolated system. Kinetic energy is conserved only in an elastic one.`),
  mcq(1, 'centre of mass', r`The centre of mass of a uniform thin rod lies`, 'at its midpoint', ['at one end', 'at one-third of its length from an end', 'at a point outside the rod'],
    r`By symmetry, every small piece on one side has a matching piece on the other, so the centre of mass is at the middle.`),
  nat(1, 'impulse', r`A 0.15 kg ball is hit from rest and leaves the bat at $40\ \mathrm{m\,s^{-1}}$. Find the impulse given to the ball (in N s).`, 6, 0,
    r`Impulse $=$ change in momentum $= 0.15\times40 - 0 = 6$ N s.`, { unit: 'N s' }),
  nat(1, 'momentum conservation', r`A 4 kg rifle fires a 0.01 kg bullet at $400\ \mathrm{m\,s^{-1}}$. Find the recoil speed of the rifle (in $\mathrm{m\,s^{-1}}$).`, 1, 0,
    r`Total momentum is zero before and after: $4V = 0.01\times400$, so $V = 1\ \mathrm{m\,s^{-1}}$ (backwards).`, { unit: 'm/s' }),
  mcq(1, 'collisions', r`The coefficient of restitution of a perfectly inelastic collision is`, '0', ['1', '0.5', 'infinite'],
    r`The bodies stick together, so the relative speed of separation is zero: $e = 0$. An elastic collision has $e = 1$.`),
  mcq(1, 'motion of centre of mass', r`The internal forces of a system of particles`, 'cannot change the motion of the centre of mass', ['can change the velocity of the centre of mass', 'always make the centre of mass stop', 'make the centre of mass move in a circle'],
    r`$M\vec a_{cm} = \vec F_{ext}$. Internal forces occur in equal and opposite pairs, so they cancel in the sum.`),
  nat(1, 'collisions', r`A 2 kg ball moving at $6\ \mathrm{m\,s^{-1}}$ hits a 2 kg ball at rest and they stick together. Find their common speed (in $\mathrm{m\,s^{-1}}$).`, 3, 0,
    r`$2\times6 = (2 + 2)v$, so $v = 3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(1, 'centre of mass', r`The centre of mass of a uniform ring (a thin circular wire)`, 'is at its centre, where there is no mass', ['is on the wire', 'is at the top of the ring', 'does not exist'],
    r`By symmetry the centre of mass is at the centre of the circle, even though no material is there. The centre of mass need not lie inside the body.`),

  // ---------- Level 2 ----------
  nat(2, 'centre of mass', r`Particles of 1 kg, 2 kg and 3 kg are at $(0,0)$, $(6,0)$ and $(0,4)$ in metres. Find the distance of their centre of mass from the origin (in m).`, 2.83, 0.01,
    r`$x_{cm} = (0 + 12 + 0)/6 = 2$ m and $y_{cm} = (0 + 0 + 12)/6 = 2$ m. Distance $= \sqrt{2^2 + 2^2} = 2\sqrt2 = 2.83$ m.`, { unit: 'm' }),
  nat(2, 'centre of mass', r`A uniform rod of mass 3 kg and length 1 m carries a 1 kg particle at one end. Find the distance of the centre of mass of the system from that end (in m).`, 0.375, 0.001,
    r`Take the loaded end as the origin. The rod's centre is 0.5 m away. $x_{cm} = (1\times0 + 3\times0.5)/4 = 0.375$ m.`, { unit: 'm' }),
  nat(2, 'motion of centre of mass', r`A 60 kg man stands at one end of a 140 kg boat on still water. He walks 5 m along the boat relative to the boat. Find how far the boat moves (in m). Ignore water resistance.`, 1.5, 0.01,
    r`No external horizontal force, so the centre of mass stays put. If the boat moves $d$ backwards, the man moves $5 - d$ forwards relative to the ground: $60(5 - d) = 140d$. $300 = 200d$, so $d = 1.5$ m.`, { unit: 'm', trap: 'The man walks 5 m relative to the boat, not relative to the water.' }),
  nat(2, 'elastic collision', r`A 2 kg ball moving at $6\ \mathrm{m\,s^{-1}}$ hits a 4 kg ball at rest in a head-on elastic collision. Find the speed of the 4 kg ball after the collision (in $\mathrm{m\,s^{-1}}$).`, 4, 0,
    r`$v_2 = \dfrac{2m_1}{m_1 + m_2}u = \dfrac{2\times2}{6}\times6 = 4\ \mathrm{m\,s^{-1}}$. (The 2 kg ball rebounds at $2\ \mathrm{m\,s^{-1}}$. Check momentum: $12 = -4 + 16$.)`, { unit: 'm/s' }),
  nat(2, 'inelastic collision', r`A 3 kg block moving at $8\ \mathrm{m\,s^{-1}}$ hits and sticks to a 5 kg block at rest. Find the kinetic energy lost (in J).`, 60, 0,
    r`Common speed $= 24/8 = 3\ \mathrm{m\,s^{-1}}$. Initial $K = \tfrac12\times3\times64 = 96$ J. Final $K = \tfrac12\times8\times9 = 36$ J. Lost $= 60$ J.`, { unit: 'J' }),
  nat(2, 'coefficient of restitution', r`A ball is dropped from 2 m onto a hard floor and rebounds to 1.28 m. Find the coefficient of restitution.`, 0.8, 0.005,
    r`Impact speed $\propto\sqrt{h_1}$ and rebound speed $\propto\sqrt{h_2}$. $e = \sqrt{h_2/h_1} = \sqrt{1.28/2} = \sqrt{0.64} = 0.8$.`, { trap: 'It is the ratio of speeds, so take the square root of the height ratio.' }),
  nat(2, 'impulse', r`The force on a 0.5 kg ball, initially at rest, rises uniformly from 0 to 100 N during 0.02 s. Find the speed the ball gets (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`Impulse $=$ area under the $F$-$t$ graph $= \tfrac12\times0.02\times100 = 1$ N s. So $mv = 1$ and $v = 1/0.5 = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'centre of mass of shapes', r`A uniform disc of radius 12 cm has a circular hole of radius 6 cm cut out. The centre of the hole is 6 cm from the centre of the disc. Find the distance of the centre of mass of the remaining plate from the centre of the disc (in cm).`, 2, 0,
    r`Remove the hole as a negative mass. Masses $\propto$ area: disc $144\pi$, hole $36\pi$. Taking the disc centre as origin and the hole at $+6$: $x_{cm} = (144\pi\times0 - 36\pi\times6)/(144\pi - 36\pi) = -216/108 = -2$ cm. It is 2 cm from the centre, on the side away from the hole.`, { unit: 'cm' }),
  nat(2, 'centre of mass of shapes', r`An L-shaped uniform plate is made of a $4\times1$ rectangle along the $x$-axis (from $x = 0$ to 4, $y = 0$ to 1) and a $1\times3$ rectangle standing on its left end (from $x = 0$ to 1, $y = 1$ to 4), all in cm. Find the $x$-coordinate of its centre of mass (in cm).`, 1.36, 0.01,
    r`Areas: 4 (centre at $(2, 0.5)$) and 3 (centre at $(0.5, 2.5)$). $x_{cm} = (4\times2 + 3\times0.5)/7 = 9.5/7 = 1.36$ cm.`, { unit: 'cm' }),
  nat(2, 'centre of mass of shapes', r`The centre of mass of a uniform solid hemisphere of radius 16 cm lies on its axis. Find its distance from the centre of the flat face (in cm).`, 6, 0,
    r`For a solid hemisphere the distance is $3R/8 = 3\times16/8 = 6$ cm. (For a hollow hemispherical shell it is $R/2$.)`, { unit: 'cm' }),
  nat(2, 'centre of mass of shapes', r`A uniform solid cone has height 20 cm. Find the distance of its centre of mass from its base (in cm).`, 5, 0,
    r`For a solid cone the centre of mass is at $h/4$ from the base: $20/4 = 5$ cm. (For a hollow conical shell it is $h/3$.)`, { unit: 'cm' }),
  mcq(2, 'impulse', r`A ball of mass $m$ hits a smooth wall normally at speed $v$ and rebounds at the same speed. The impulse given to the ball is`, r`$2mv$`, [r`$mv$`, '0', r`$mv/2$`],
    r`Take the initial direction as positive: $\Delta p = (-mv) - (mv) = -2mv$. The magnitude is $2mv$. (The wall gets $2mv$ in the opposite direction.)`, { trap: 'The velocity reverses, so the change is $2mv$, not $mv$.' }),
  nat(2, 'motion of centre of mass', r`A force of 12 N pushes a 1 kg particle that is joined by a light spring to a 3 kg particle on a smooth table. Find the acceleration of the centre of mass of the pair (in $\mathrm{m\,s^{-2}}$).`, 3, 0,
    r`Only the 12 N is an external force. $a_{cm} = F/(m_1 + m_2) = 12/4 = 3\ \mathrm{m\,s^{-2}}$. The spring forces are internal.`, { unit: 'm/s²' }),
  nat(2, 'inelastic collision', r`A 20 g bullet moving at $300\ \mathrm{m\,s^{-1}}$ embeds in a 0.98 kg block resting on a smooth table. Find the speed of the block with the bullet (in $\mathrm{m\,s^{-1}}$).`, 6, 0,
    r`$0.02\times300 = (0.02 + 0.98)V$, so $V = 6\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'variable mass', r`A 10 kg open cart moves on smooth rails at $3\ \mathrm{m\,s^{-1}}$. A 5 kg bag of sand is dropped vertically into it. Find the new speed of the cart (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`Horizontal momentum is conserved (the sand brings none): $10\times3 = 15V$, so $V = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(2, 'motion of centre of mass', r`No external force acts on a system of particles that are exploding. The centre of mass of the system`, 'continues with its original velocity', ['moves with a larger speed', 'stops', 'moves along the heaviest fragment'],
    r`$\vec a_{cm} = \vec F_{ext}/M = 0$. The explosion forces are internal, so the velocity of the centre of mass does not change.`),
  mcq(2, 'elastic collision', r`A moving ball hits an identical ball at rest in a head-on elastic collision. After the collision`, 'the first ball stops and the second moves with the first one\'s velocity', ['both move together', 'the first ball rebounds with the same speed', 'both balls move off at half the speed'],
    r`For equal masses and $e = 1$: $v_1 = 0$, $v_2 = u$. The velocities are exchanged. Check: momentum $mu = mu$; energy $\tfrac12mu^2$ unchanged.`),

  // ---------- Level 3 ----------
  nat(3, 'impulse', r`A 0.2 kg ball hits a smooth wall at $10\ \mathrm{m\,s^{-1}}$ with its velocity at $60^\circ$ to the normal to the wall, and bounces off elastically. Find the magnitude of the impulse given to the ball (in N s).`, 2, 0,
    r`A smooth wall exerts force only along the normal. The normal component changes from $+v\cos60^\circ$ to $-v\cos60^\circ$; the tangential component is unchanged. $\Delta p = 2mv\cos60^\circ = 2\times0.2\times10\times0.5 = 2$ N s.`, { unit: 'N s', trap: 'Only the component along the normal changes.' }),
  nat(3, 'collisions in two dimensions', r`A 2 kg ball moving east at $3\ \mathrm{m\,s^{-1}}$ collides with a 2 kg ball moving north at $4\ \mathrm{m\,s^{-1}}$. They stick together. Find the speed after the collision (in $\mathrm{m\,s^{-1}}$).`, 2.5, 0.01,
    r`$p_x = 6$ and $p_y = 8$ (kg m/s). $p = 10$. $V = 10/4 = 2.5\ \mathrm{m\,s^{-1}}$ (direction $\tan^{-1}(4/3)$ north of east).`, { unit: 'm/s' }),
  nat(3, 'collisions in two dimensions', r`A moving ball hits an identical ball at rest in an oblique, elastic collision. After the collision the balls move off in different directions. Find the angle between their directions of motion (in degrees).`, 90, 0,
    r`Momentum: $\vec u = \vec v_1 + \vec v_2$. Energy: $u^2 = v_1^2 + v_2^2$. Squaring the first: $u^2 = v_1^2 + v_2^2 + 2\vec v_1\cdot\vec v_2$. So $\vec v_1\cdot\vec v_2 = 0$: the angle is $90^\circ$.`, { unit: '°', trap: 'It is 90 degrees only for equal masses, $e = 1$, and a target at rest.' }),
  nat(3, 'coefficient of restitution', r`A ball moving at $4\ \mathrm{m\,s^{-1}}$ hits an identical ball at rest head-on. The coefficient of restitution is 0.5. Find the speed of the second ball after the collision (in $\mathrm{m\,s^{-1}}$).`, 3, 0,
    r`Momentum: $v_1 + v_2 = 4$. Restitution: $v_2 - v_1 = 0.5\times4 = 2$. So $v_2 = 3$ and $v_1 = 1\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'elastic collision', r`A 3 kg ball moving at $4\ \mathrm{m\,s^{-1}}$ meets a 1 kg ball moving at $2\ \mathrm{m\,s^{-1}}$ in the opposite direction head-on, and the collision is elastic. Find the speed of the 1 kg ball afterwards (in $\mathrm{m\,s^{-1}}$).`, 7, 0,
    r`Take the 3 kg ball's direction as positive. Speed of approach $= 4 - (-2) = 6$, which is also the speed of separation: $v_2 - v_1 = 6$. Momentum: $3\times4 + 1\times(-2) = 10 = 3v_1 + v_2$. Substituting $v_2 = v_1 + 6$: $4v_1 = 4$, so $v_1 = 1$ and $v_2 = 7\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'elastic collision', r`A ball moving at $10\ \mathrm{m\,s^{-1}}$ hits a very heavy wall moving towards it at $5\ \mathrm{m\,s^{-1}}$. The collision is elastic. Find the speed of the ball after the collision (in $\mathrm{m\,s^{-1}}$).`, 20, 0,
    r`In the wall's frame the ball approaches at $15\ \mathrm{m\,s^{-1}}$ and rebounds at $15$. Going back to the ground frame, the ball's velocity is $15 + 5 = 20\ \mathrm{m\,s^{-1}}$ away from the wall.`, { unit: 'm/s', trap: 'Moving walls add their speed to the rebound.' }),
  nat(3, 'ballistic pendulum', r`A 10 g bullet is fired into a 1.99 kg block hanging from strings. The block with the embedded bullet rises 0.45 m. Find the bullet's speed (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 600, 0,
    r`After impact the speed is $V = \sqrt{2gh} = \sqrt{9} = 3\ \mathrm{m\,s^{-1}}$. Momentum: $0.01u = 2\times3$, so $u = 600\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Use momentum for the impact, then energy for the swing (not the other way).' }),
  nat(3, 'explosion', r`A 3 kg shell at rest explodes into two fragments of 1 kg and 2 kg. The 1 kg fragment flies off at $12\ \mathrm{m\,s^{-1}}$. Find the speed of the 2 kg fragment (in $\mathrm{m\,s^{-1}}$).`, 6, 0,
    r`Total momentum is zero: $1\times12 = 2v$, so $v = 6\ \mathrm{m\,s^{-1}}$ in the opposite direction. (The energy released is $\tfrac12\times1\times144 + \tfrac12\times2\times36 = 144$ J.)`, { unit: 'm/s' }),
  nat(3, 'explosion', r`A 3 kg shell at rest explodes into two fragments of 1 kg and 2 kg. The 1 kg fragment flies off at $12\ \mathrm{m\,s^{-1}}$. Find the total kinetic energy given to the fragments (in J).`, 144, 0,
    r`The 2 kg fragment moves at $6\ \mathrm{m\,s^{-1}}$ (momentum). $K = \tfrac12\times1\times144 + \tfrac12\times2\times36 = 72 + 72 = 144$ J. The chemical energy of the explosive supplies it.`, { unit: 'J' }),
  nat(3, 'variable mass', r`Sand falls from a hopper on to a horizontal conveyor belt moving at a steady $2\ \mathrm{m\,s^{-1}}$ at a rate of $5\ \mathrm{kg\,s^{-1}}$. Find the extra power the motor must supply to keep the belt at constant speed (in W).`, 20, 0,
    r`The sand must be given momentum at the rate $F = v\,dm/dt = 2\times5 = 10$ N. Power $= Fv = 10\times2 = 20$ W. (The sand's kinetic energy rises at only 10 W; the other 10 W is lost as heat by friction when the sand slips on the belt.)`, { unit: 'W', trap: 'Half of the power goes into heat, not into the kinetic energy of the sand.' }),
  nat(3, 'centre of mass of shapes', r`A thin rod of length 0.9 m has linear density proportional to the distance from one end (density $\lambda = kx$). Find the distance of its centre of mass from that end (in m).`, 0.6, 0.005,
    r`$x_{cm} = \int x\,\lambda\,dx/\int\lambda\,dx = \int_0^L kx^2\,dx/\int_0^L kx\,dx = (L^3/3)/(L^2/2) = 2L/3 = 0.6$ m.`, { unit: 'm' }),
  nat(3, 'centre of mass of shapes', r`Find the distance of the centre of mass of a thin uniform semicircular wire of radius 10 cm from the centre of the circle (in cm).`, 6.37, 0.02,
    r`For a semicircular wire $y_{cm} = 2R/\pi = 20/\pi = 6.37$ cm. (For a semicircular plate it is $4R/3\pi$, which is smaller.)`, { unit: 'cm', trap: 'Wire: $2R/\pi$. Plate: $4R/3\pi$.' }),
  nat(3, 'motion of centre of mass', r`A 2 kg particle moves east at $6\ \mathrm{m\,s^{-1}}$ and a 3 kg particle moves west at $2\ \mathrm{m\,s^{-1}}$. Find the velocity of their centre of mass, with east positive (in $\mathrm{m\,s^{-1}}$).`, 1.2, 0.01,
    r`$v_{cm} = (2\times6 + 3\times(-2))/5 = 6/5 = 1.2\ \mathrm{m\,s^{-1}}$ (east).`, { unit: 'm/s' }),
  nat(3, 'centre of mass of shapes', r`A uniform square plate of side 6 cm has one corner at the origin and its sides along the axes. A square piece of side 2 cm, centred at $(4, 4)$ cm, is cut out. Find the $x$-coordinate of the centre of mass of the remaining plate (in cm).`, 2.875, 0.005,
    r`Full plate: area 36, centre $(3, 3)$. Hole: area 4, centre $(4, 4)$. $x_{cm} = (36\times3 - 4\times4)/(36 - 4) = 92/32 = 2.875$ cm.`, { unit: 'cm' }),
  nat(3, 'impulse', r`A cricket ball of mass 0.4 kg arrives at $20\ \mathrm{m\,s^{-1}}$ and is hit straight back at $30\ \mathrm{m\,s^{-1}}$. The contact lasts 0.01 s. Find the average force on the ball (in N).`, 2000, 0,
    r`Take the incoming direction as positive. $\Delta p = 0.4(-30) - 0.4(20) = -20$ kg m/s. $F = 20/0.01 = 2000$ N. Add the speeds because the direction reverses.`, { unit: 'N', trap: 'The speeds add: $20 + 30 = 50$, not $30 - 20 = 10$.' }),
  nat(3, 'impulse', r`A water jet of cross-section $5\ \mathrm{cm^2}$ moves at $12\ \mathrm{m\,s^{-1}}$ and hits a wall normally, rebounding with the same speed. Find the force on the wall (in N; $\rho = 1000\ \mathrm{kg\,m^{-3}}$).`, 144, 0,
    r`Mass per second $= \rho Av = 1000\times5\times10^{-4}\times12 = 6$ kg/s. Each kg changes velocity by $2v = 24\ \mathrm{m\,s^{-1}}$. $F = 6\times24 = 144$ N. If the water stopped dead the force would be 72 N.`, { unit: 'N', trap: 'A rebound doubles the force compared with stopping.' }),
  nat(3, 'impulse', r`A machine gun fires 10 bullets per second, each of mass 20 g at $500\ \mathrm{m\,s^{-1}}$. Find the average recoil force on the gun (in N).`, 100, 0,
    r`Momentum given to the bullets per second $= 10\times0.02\times500 = 100\ \mathrm{kg\,m\,s^{-2}}$. The average force $= 100$ N.`, { unit: 'N' }),
  mcq(3, 'collisions', r`A body of mass $m_1$ strikes a body of mass $m_2$ at rest and they stick together. The fraction of the initial kinetic energy lost is`, r`$\dfrac{m_2}{m_1 + m_2}$`, [r`$\dfrac{m_1}{m_1 + m_2}$`, r`$\dfrac12$`, r`$\dfrac{m_2}{m_1}$`],
    r`$V = m_1u/(m_1 + m_2)$. $K_f/K_i = \dfrac{(m_1+m_2)V^2}{m_1u^2} = \dfrac{m_1}{m_1 + m_2}$. So the fraction lost is $\dfrac{m_2}{m_1 + m_2}$. For equal masses, half is lost.`),
  mcq(3, 'elastic collision', r`A heavy ball of mass $M$ moving at $u$ hits a very light ball of mass $m$ ($m\ll M$) at rest in an elastic head-on collision. The light ball moves off with a speed close to`, r`$2u$`, [r`$u$`, r`$u/2$`, r`$4u$`],
    r`$v_2 = 2Mu/(M + m)\approx2u$ when $m\ll M$. Check with the relative speed: the heavy ball is almost unaffected ($\approx u$), so the light ball must separate from it at $u$, giving $2u$.`),
  nat(3, 'impulse', r`A force $F = 6t$ newton acts for 3 s on a 3 kg body initially at rest. Find the final speed of the body (in $\mathrm{m\,s^{-1}}$).`, 9, 0,
    r`Impulse $= \int_0^3 6t\,dt = 3t^2|_0^3 = 27$ N s. So $3v = 27$ and $v = 9\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'coefficient of restitution', r`A ball is dropped from 8 m onto a floor with $e = 0.5$. Find the height it rises to after the second bounce (in m).`, 0.5, 0.005,
    r`Each bounce multiplies the height by $e^2 = 0.25$. After two bounces: $8\times0.25^2 = 0.5$ m.`, { unit: 'm', trap: 'Height scales as $e^2$, not $e$.' }),
  nat(3, 'variable mass', r`A 10 kg open cart moves at $4\ \mathrm{m\,s^{-1}}$ on smooth level rails while rain falls vertically into it at $0.5\ \mathrm{kg\,s^{-1}}$. Find its speed after 10 s (in $\mathrm{m\,s^{-1}}$).`, 2.67, 0.01,
    r`The rain has no horizontal momentum, so horizontal momentum is conserved: $10\times4 = (10 + 0.5\times10)V$, so $V = 40/15 = 2.67\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'ballistic pendulum', r`A 20 g bullet moving at $500\ \mathrm{m\,s^{-1}}$ passes through a 2 kg block and leaves at $100\ \mathrm{m\,s^{-1}}$. The block is hanging from strings. Find the greatest height to which the block rises (in m, $g = 10$).`, 0.8, 0.01,
    r`Momentum: $0.02\times500 = 0.02\times100 + 2V$, so $V = 8/2 = 4\ \mathrm{m\,s^{-1}}$. Then $h = V^2/2g = 16/20 = 0.8$ m.`, { unit: 'm', sub: 'mixed' }),
  nat(3, 'collisions in two dimensions', r`A ball strikes a smooth wall with velocity components $6\ \mathrm{m\,s^{-1}}$ along the wall and $8\ \mathrm{m\,s^{-1}}$ towards the wall, and bounces off elastically. Find its speed after the bounce (in $\mathrm{m\,s^{-1}}$).`, 10, 0,
    r`The component along the smooth wall is unchanged ($6$). The normal component reverses ($8$ away). Speed $= \sqrt{36 + 64} = 10\ \mathrm{m\,s^{-1}}$, unchanged because the collision is elastic.`, { unit: 'm/s' }),
  nat(3, 'variable mass', r`A rocket of mass 1000 kg at the start burns fuel at $8\ \mathrm{kg\,s^{-1}}$, ejecting the gas at $2500\ \mathrm{m\,s^{-1}}$ relative to the rocket. It rises vertically. Find its initial acceleration (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, 10, 0,
    r`Thrust $= u\,|dm/dt| = 2500\times8 = 20\,000$ N. Weight $= 10\,000$ N. $a = (20\,000 - 10\,000)/1000 = 10\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),

  // ---------- Level 4 ----------
  nat(4, 'variable mass', r`A rocket in free space ejects gas at a speed of $2000\ \mathrm{m\,s^{-1}}$ relative to itself. Its mass falls to half in 50 s. Near the Earth's surface (take $g = 10$ constant) it rises vertically from rest. Find its speed after 50 s (in $\mathrm{m\,s^{-1}}$; $\ln2 = 0.693$).`, 886, 1,
    r`The rocket equation with gravity: $v = u\ln(m_0/m) - gt = 2000\times0.693 - 10\times50 = 1386 - 500 = 886\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Do not forget $-gt$.' }),
  nat(4, 'motion of centre of mass', r`A shell would have a range of 200 m on level ground. At the top of its path it bursts into two equal parts. One part falls vertically from the instant of the burst (zero horizontal velocity). Find the distance from the gun where the other part lands (in m).`, 300, 0,
    r`The centre of mass of the pieces follows the original path and reaches the ground at 200 m. The vertical fragment lands directly below the burst, at 100 m (the middle of the range). Equal masses: $200 = (100 + x)/2$, so $x = 300$ m.`, { unit: 'm', trap: 'Both fragments land together only if they start with the same vertical velocity (zero here).' }),
  nat(4, 'collisions in two dimensions', r`A ball strikes a smooth floor with velocity components $6\ \mathrm{m\,s^{-1}}$ (parallel to the floor) and $8\ \mathrm{m\,s^{-1}}$ (towards the floor). The coefficient of restitution is 0.5. Find the speed just after the bounce (in $\mathrm{m\,s^{-1}}$).`, 7.21, 0.02,
    r`The parallel component is unchanged: 6. The normal component becomes $e\times8 = 4$. Speed $= \sqrt{36 + 16} = \sqrt{52} = 7.21\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'coefficient of restitution', r`A 2 kg ball moving at $5\ \mathrm{m\,s^{-1}}$ collides head-on with a 3 kg ball at rest. The coefficient of restitution is 0.6. Find the kinetic energy lost in the collision (in J).`, 9.6, 0.05,
    r`$v_1 = (m_1 - em_2)u/(m_1 + m_2) = (2 - 1.8)\times5/5 = 0.2$ and $v_2 = (1 + e)m_1u/(m_1 + m_2) = 1.6\times10/5 = 3.2$ (m/s). Initial $K = 25$ J. Final $K = \tfrac12\times2\times0.04 + \tfrac12\times3\times10.24 = 0.04 + 15.36 = 15.4$ J. Lost $= 9.6$ J.`, { unit: 'J' }),
  nat(4, 'collisions', r`A pendulum bob A is released from the position where its string makes $60^\circ$ with the vertical. The string length is 1.6 m. At the bottom it hits an identical bob B at rest and they stick. Find the greatest height above the lowest point reached by the pair (in m, $g = 10$).`, 0.2, 0.005,
    r`A falls through $L(1 - \cos60^\circ) = 0.8$ m, so its speed is $\sqrt{2\times10\times0.8} = 4\ \mathrm{m\,s^{-1}}$. After the sticking, the speed is $4/2 = 2$. Height $= 4/20 = 0.2$ m (one-quarter of 0.8 m).`, { unit: 'm', sub: 'mixed' }),
  nat(4, 'ballistic pendulum', r`A 10 g bullet is shot into a 0.99 kg bob hanging on a light string of length 0.5 m, and stays in it. What least bullet speed makes the bob go round a complete vertical circle (in $\mathrm{m\,s^{-1}}$, $g = 10$)?`, 500, 0,
    r`The bob and bullet (1 kg) must have speed $\sqrt{5gR} = \sqrt{5\times10\times0.5} = 5\ \mathrm{m\,s^{-1}}$ just after the impact. Momentum: $0.01u = 1\times5$, so $u = 500\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'mixed', trap: 'The string case needs $\\sqrt{5gR}$ at the bottom; a rod needs only $2\\sqrt{gR}$.' }),
  nat(4, 'collisions', r`A smooth quarter-circular wedge of mass 3 kg and radius 0.6 m rests on a smooth floor. A 1 kg block is released at the top and slides to the bottom of the wedge, where the surface is horizontal. Find the speed of the block there, relative to the ground (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 3, 0,
    r`Horizontal momentum: $1\times v = 3V$, so $V = v/3$. Energy: $mgR = \tfrac12mv^2 + \tfrac12MV^2$, i.e. $6 = \tfrac12v^2 + \tfrac32\cdot\tfrac{v^2}{9} = \tfrac23v^2$. So $v^2 = 9$ and $v = 3\ \mathrm{m\,s^{-1}}$. (The wedge moves at $1\ \mathrm{m\,s^{-1}}$ the other way.)`, { unit: 'm/s', sub: 'mixed', trap: 'The wedge recoils, so the block does not get $\\sqrt{2gR}$.' }),
  nat(4, 'centre of mass of shapes', r`A uniform solid cone of height 24 cm has a smaller coaxial cone of height 12 cm removed from its tip (the top part), leaving a frustum. Find the distance of the centre of mass of the frustum from the large base (in cm).`, 4.71, 0.02,
    r`Let the whole cone have volume $V$ and its centre at $24/4 = 6$ cm above the base. The removed cone is similar with half the height, so its volume is $V/8$. Its centre is $12 + 12/4 = 15$ cm above the base. $y_{cm} = (6V - 15V/8)/(V - V/8) = (48 - 15)/7 = 33/7 = 4.71$ cm.`, { unit: 'cm' }),
  nat(4, 'centre of mass of shapes', r`A uniform solid sphere of radius 14 cm has a spherical cavity of radius 7 cm whose surface touches the sphere's surface. Find the distance of the centre of mass of the remaining solid from the centre of the sphere (in cm).`, 1, 0,
    r`The cavity's centre is $d = 7$ cm from the sphere's centre. Masses go as volumes: the cavity is $(1/2)^3 = 1/8$ of the full sphere. $x_{cm} = -\dfrac{(1/8)\times7}{1 - 1/8} = -\dfrac{7}{7} = -1$ cm. It is 1 cm from the centre, on the side away from the cavity.`, { unit: 'cm' }),
  nat(4, 'elastic collision', r`A moving ball hits a stationary ball in a head-on elastic collision. The stationary ball is three times as heavy. Find the fraction of the first ball's kinetic energy given to the second.`, 0.75, 0.005,
    r`Fraction transferred $= 4m_1m_2/(m_1 + m_2)^2 = 4\times3/16 = 0.75$. Check: $v_2 = 2u/4 = u/2$ and $K_2 = \tfrac12(3m)(u/2)^2 = \tfrac38mu^2$, which is $\tfrac34$ of $\tfrac12mu^2$.`, { trap: 'The transfer is the largest (100%) when the masses are equal.' }),
  nat(4, 'collisions in two dimensions', r`A ball hits an identical ball at rest at speed $8\ \mathrm{m\,s^{-1}}$ in an elastic collision, and is deflected by $30^\circ$ from its original direction. Find the speed of the struck ball (in $\mathrm{m\,s^{-1}}$).`, 4, 0,
    r`For equal masses with an elastic collision the two final velocities are perpendicular, so the struck ball moves at $60^\circ$ on the other side. Momentum along the original direction gives $8 = v_1\cos30^\circ + v_2\cos60^\circ$ and across it $v_1\sin30^\circ = v_2\sin60^\circ$. The solution is $v_1 = 8\cos30^\circ = 6.93$ and $v_2 = 8\sin30^\circ = 4\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'collisions in two dimensions', r`A ball hits a smooth fixed wall with its velocity at $45^\circ$ to the normal. The coefficient of restitution is 0.5. Find the angle its velocity makes with the normal after the bounce (in degrees).`, 63.4, 0.1,
    r`The tangential speed is unchanged: $v\sin45^\circ$. The normal speed becomes $e\,v\cos45^\circ$. So $\tan\theta' = \tan45^\circ/e = 2$ and $\theta' = 63.4^\circ$ from the normal.`, { unit: '°' }),
  nat(4, 'coefficient of restitution', r`A ball is dropped from 3 m onto a hard floor with $e = 0.5$ and bounces repeatedly. Find the total distance it travels before coming to rest (in m).`, 5, 0,
    r`Total distance $= h + 2he^2 + 2he^4 + \dots = h\left[1 + \dfrac{2e^2}{1 - e^2}\right] = h\dfrac{1 + e^2}{1 - e^2} = 3\times\dfrac{1.25}{0.75} = 5$ m.`, { unit: 'm', trap: 'Every bounce after the first has an up and a down trip.' }),
  nat(4, 'coefficient of restitution', r`A ball is dropped from 1.8 m onto a hard floor with $e = 0.5$ and bounces repeatedly. Find the total time until it comes to rest (in s, $g = 10$).`, 1.8, 0.01,
    r`First fall: $t_1 = \sqrt{2h/g} = 0.6$ s. After each impact the speeds are multiplied by $e$, so each later up-and-down takes $e$ times the previous one. $T = t_1 + 2t_1e + 2t_1e^2 + \dots = t_1\dfrac{1 + e}{1 - e} = 0.6\times3 = 1.8$ s.`, { unit: 's' }),
  nat(4, 'collisions', r`A 2 kg block slides 6 m along a rough floor ($\mu = 0.2$) from a speed of $7\ \mathrm{m\,s^{-1}}$ and hits a 1 kg block at rest. They stick together and continue on the same floor. How far do they slide before stopping (in m, $g = 10$)?`, 2.78, 0.02,
    r`Speed before impact: $v^2 = 49 - 2\times2\times6 = 25$, $v = 5\ \mathrm{m\,s^{-1}}$. Sticking: $V = 2\times5/3 = 3.33\ \mathrm{m\,s^{-1}}$. Deceleration $= \mu g = 2$. Distance $= V^2/(2\mu g) = 11.1/4 = 2.78$ m.`, { unit: 'm', sub: 'mixed' }),

  // ---------- Level 5 ----------
  nat(5, 'variable mass', r`A uniform chain of length $L$ and mass 2 kg hangs vertically with its lower end just touching the pan of a weighing scale. It is released. Find the reading of the scale (as a force, in N) at the instant when half of the chain has landed on the pan ($g = 10$).`, 30, 0,
    r`When length $x$ has landed, the chain above is still falling freely, so every link moves at $v = \sqrt{2gx}$. The pan stops the links arriving at rate $\lambda v$ ($\lambda = M/L$): impact force $= \lambda v^2 = 2\lambda gx$. Add the weight of the landed part $\lambda gx$. Total $= 3\lambda gx = 3Mg(x/L) = 3\times2\times10\times\tfrac12 = 30$ N, which is three times the weight of the landed part.`, { unit: 'N', trap: 'The scale reads more than the weight of the part that has landed.' }),
  nat(5, 'variable mass', r`A chain of mass 2 kg and length 2 m lies coiled on the floor. Its end is lifted vertically at a steady $2\ \mathrm{m\,s^{-1}}$. Find the force needed on the end when it is 1 m above the floor (in N, $g = 10$).`, 14, 0,
    r`Let the lifted part have length $y$. Momentum $p = \lambda yv$ with $v$ constant: $dp/dt = \lambda v^2$ (new links being set into motion). Force: $F - \lambda yg = \lambda v^2$. With $\lambda = 1\ \mathrm{kg\,m^{-1}}$, $y = 1$: $F = 10 + 4 = 14$ N.`, { unit: 'N' }),
  nat(5, 'collisions', r`A 1 kg block and a 3 kg block, joined by a massless spring of constant $300\ \mathrm{N\,m^{-1}}$, lie on a smooth table. Find the angular frequency of their oscillation along the line of the spring (in $\mathrm{rad\,s^{-1}}$).`, 20, 0,
    r`In the centre-of-mass frame the two-body system behaves like one body of reduced mass $\mu = m_1m_2/(m_1+m_2) = 3/4$ kg on the spring. $\omega = \sqrt{k/\mu} = \sqrt{300/0.75} = \sqrt{400} = 20\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'Neither mass alone gives the frequency; use the reduced mass.' }),
  nat(5, 'elastic collision', r`A small light ball of mass $m$ sits on top of a much heavier ball of mass $M$ ($m\ll M$), and the pair are dropped together from a height of 0.5 m onto a hard floor. All collisions are elastic. Find the height to which the small ball rises above the floor (in m).`, 4.5, 0.05,
    r`Speed on reaching the floor: $v = \sqrt{2gh}$. The big ball rebounds upward at $v$ and meets the small ball still falling at $v$. In the big ball's frame the small one approaches at $2v$ and leaves at $2v$, so its ground velocity is $v + 2v = 3v$ upward. Height $= (3v)^2/2g = 9h = 4.5$ m.`, { unit: 'm', trap: 'This works only for $m\\ll M$.' }),
  nat(5, 'collisions in two dimensions', r`A smooth disc moving at $8\ \mathrm{m\,s^{-1}}$ hits an identical disc at rest. The line joining their centres at impact makes $30^\circ$ with the first disc's velocity. The coefficient of restitution is 0.5. Find the speed of the struck disc (in $\mathrm{m\,s^{-1}}$).`, 5.2, 0.02,
    r`The impulse acts along the line of centres. Component of the first disc's velocity along that line: $8\cos30^\circ = 6.93$. Along the line, equal masses: $v_2 = \tfrac{1 + e}{2}\times6.93 = 0.75\times6.93 = 5.20\ \mathrm{m\,s^{-1}}$. The struck disc moves along the line of centres only.`, { unit: 'm/s' }),
  nat(5, 'collisions', r`A 2 kg block moving at $6\ \mathrm{m\,s^{-1}}$ approaches a 3 kg block moving at $1\ \mathrm{m\,s^{-1}}$ in the same direction on a smooth table. A light spring ($k = 480\ \mathrm{N\,m^{-1}}$) is fixed to the back of the 3 kg block. Find the greatest compression of the spring (in m).`, 0.25, 0.005,
    r`At greatest compression the blocks have the same velocity $v_{cm} = (12 + 3)/5 = 3\ \mathrm{m\,s^{-1}}$. Kinetic energy before: $\tfrac12\times2\times36 + \tfrac12\times3\times1 = 37.5$ J. After: $\tfrac12\times5\times9 = 22.5$ J. Spring energy $= 15$ J $= \tfrac12\times480x^2$, so $x^2 = 0.0625$ and $x = 0.25$ m.`, { unit: 'm', sub: 'mixed' }),

  // ---------- Assertion / Reason ----------
  asrt(2, 'centre of mass', r`The centre of mass of a body may lie outside the body.`, r`The centre of mass depends on how the mass is distributed, not on whether material is present at that point.`, 0,
    r`A ring or a hollow sphere has its centre of mass at the centre, where there is no material. R gives the reason. Both true, R explains A.`),
  asrt(3, 'collisions', r`In an elastic collision, momentum is conserved but kinetic energy is not.`, r`Kinetic energy is conserved only when no energy is lost as heat or sound.`, 3,
    r`A is false: in an elastic collision both are conserved. R is true: an inelastic collision loses kinetic energy as heat and sound.`),
  asrt(3, 'collisions', r`In a perfectly inelastic collision the bodies move together after the collision.`, r`In a perfectly inelastic collision momentum is not conserved.`, 2,
    r`A is true (the definition, $e = 0$). R is false: momentum is conserved in every collision of an isolated system; it is the kinetic energy that is not conserved.`),
  asrt(3, 'coefficient of restitution', r`The coefficient of restitution cannot be greater than 1.`, r`Linear momentum is conserved in every collision.`, 1,
    r`A is true: $e > 1$ would mean kinetic energy increases in the collision, which cannot happen without an energy source. R is also true but is not the reason: momentum conservation does not limit $e$. Energy does.`),
  asrt(3, 'variable mass', r`A rocket can accelerate in empty space.`, r`The exhaust gas gains momentum backwards, so the rocket gains an equal momentum forwards.`, 0,
    r`Nothing is needed to push against. By conservation of momentum the rocket plus gas have zero total momentum change, so the rocket moves forward. R explains A.`),
  asrt(4, 'explosion', r`After an explosion of a body at rest in free space, the total momentum of the fragments is zero.`, r`The forces during the explosion are external forces.`, 2,
    r`A is true: no external force, so momentum stays zero. R is false: the forces of the explosion are internal to the body. If they were external, momentum could change.`),
  asrt(4, 'collisions', r`In an elastic collision each body's kinetic energy is conserved separately.`, r`The total kinetic energy of the two bodies is the same before and after an elastic collision.`, 3,
    r`A is false: energy is passed from one body to the other (e.g. a moving ball stops and the other starts). R is true: it is the total that is conserved.`),

  // ---------- Statements ----------
  stm(2, 'collisions', r`Momentum is conserved in all collisions of an isolated system.`, r`Kinetic energy is conserved only in elastic collisions.`, 0,
    r`Both true. Internal collision forces cancel in pairs, so momentum is always conserved. Kinetic energy is conserved only when $e = 1$.`),
  stm(3, 'coefficient of restitution', r`The coefficient of restitution is 1 for a perfectly elastic collision.`, r`In some collisions the coefficient of restitution can be greater than 1.`, 2,
    r`I is true. II is false: $e > 1$ would require the colliding bodies to gain kinetic energy.`),
  stm(3, 'centre of mass', r`The centre of mass of a body is always at its geometric centre.`, r`The centre of mass of a uniform body with a centre of symmetry coincides with its geometric centre.`, 3,
    r`I is false: a non-uniform body (e.g. a hammer) has its centre of mass away from the geometric centre. II is true.`),
  stm(3, 'collisions', r`Kinetic energy is conserved in all collisions.`, r`Momentum is not conserved in inelastic collisions.`, 1,
    r`Both false. Kinetic energy is conserved only in elastic ones. Momentum is conserved in every collision of an isolated system, elastic or not.`),
  stm(2, 'impulse', r`The impulse of a force equals the change in momentum it produces.`, r`The area under a force-time graph gives the impulse.`, 0,
    r`Both true. $\int F\,dt = \Delta p$.`),
  stm(4, 'collisions', r`When two equal masses collide head-on elastically, they exchange velocities.`, r`In a perfectly inelastic collision each body has zero kinetic energy afterwards.`, 2,
    r`I is true. II is false: the bodies move together and share the kinetic energy of the centre-of-mass motion; only the energy of motion relative to the centre of mass is lost. The total kinetic energy after is zero only if the total momentum is zero.`),
  mcq(5, 'concepts', r`How many are correct? (a) The momentum of a body is conserved when it bounces off a wall. (b) In a perfectly inelastic collision the velocity of the centre of mass does not change. (c) The coefficient of restitution is the ratio of speed of separation to speed of approach along the line of impact. (d) A rocket in free space needs an external force to accelerate. (e) After an explosion of a body at rest the fragments' momenta add to zero.`, '3', ['2', '4', '5'],
    r`(a) false: the wall gives an external impulse (the wall plus Earth is the system). (b) true: no external force. (c) true. (d) false: it accelerates by throwing exhaust backwards. (e) true. Correct: b, c, e.`, { format: 'statements' }),

  // ---------- Multi-correct ----------
  msq(3, 'collisions', r`Two bodies collide perfectly inelastically (they stick), and no external force acts. Which quantities are the same before and after?`,
    ['Total linear momentum', 'Total kinetic energy', 'Velocity of the centre of mass', 'Total energy including heat'],
    [0, 2, 3],
    r`Momentum, velocity of the centre of mass and total energy (including the heat produced) are conserved. Kinetic energy alone is reduced.`),
  msq(3, 'elastic collision', r`Two bodies collide head-on and elastically. Which statements are correct?`,
    ['The speed of separation equals the speed of approach', 'Total momentum is conserved', 'Total kinetic energy is conserved', 'The bodies always move in opposite directions afterwards'],
    [0, 1, 2],
    r`The first three are properties of a head-on elastic collision. D is false: a heavy body hitting a light one continues forward after the collision.`),
  msq(4, 'explosion', r`A projectile explodes in mid-air into fragments. Which are correct, neglecting air resistance?`,
    ['The centre of mass of the fragments continues on the original parabola until a fragment lands', 'The total momentum just after the burst equals the total momentum just before it', 'The total kinetic energy just after the burst equals that just before it', 'Both fragments must reach the ground at the same time'],
    [0, 1],
    r`Only gravity acts externally, so the centre of mass keeps its parabola (until the first landing), and the burst is so quick that momentum is conserved. The chemical energy of the explosion increases the kinetic energy (C false). Fragments may start with different vertical velocities and land at different times (D false).`),
  msq(4, 'motion of centre of mass', r`A man walks from one end to the other of a boat on still water (ignore water resistance). Which are correct?`,
    ['The centre of mass of the man and boat does not move', 'The boat moves opposite to the man', 'If the man stops, the boat stops', 'The man\'s momentum alone is conserved'],
    [0, 1, 2],
    r`There is no external horizontal force, so the centre of mass of the system stays at rest and the total momentum stays zero. The man and the boat have equal and opposite momenta at every instant, so the boat stops when the man does. The man's momentum alone is not conserved (D false).`),
  msq(5, 'coefficient of restitution', r`Two bodies collide head-on with a coefficient of restitution $e$ where $0<e<1$ and no external force acts. Which are correct?`,
    ['Total momentum is conserved', 'Total kinetic energy decreases', 'Speed of separation $= e\\times$ speed of approach', 'The velocity of the centre of mass changes'],
    [0, 1, 2],
    r`Momentum conservation, the definition of $e$, and the loss of $\tfrac12\mu(1 - e^2)u^2$ in kinetic energy make A, B and C true. With no external force the centre of mass moves uniformly: D is false.`),
  msq(4, 'centre of mass of shapes', r`Which of the following centres of mass are correct?`,
    [r`Solid hemisphere of radius $R$: $3R/8$ from the centre of the flat face`, r`Hollow hemispherical shell of radius $R$: $R/2$ from the centre of the flat face`, r`Semicircular uniform wire of radius $R$: $4R/3\pi$ from the centre`, r`Solid cone of height $h$: $h/4$ from the base`],
    [0, 1, 3],
    r`A, B and D are standard results. For a wire the distance is $2R/\pi$; $4R/3\pi$ is for the semicircular plate (C false).`),
  msq(5, 'variable mass', r`A rocket is burning fuel in a uniform gravitational field. Which are correct?`,
    [r`The thrust is $u\,|dm/dt|$, where $u$ is the exhaust speed relative to the rocket`, r`The thrust does not depend on the speed of the rocket`, r`The momentum of the rocket plus exhaust is conserved`, r`In free space, starting from rest, $v = u\ln(m_0/m)$`],
    [0, 1, 3],
    r`A, B and D follow from the rocket equation. C is false in a gravitational field, because gravity is an external force that changes the total momentum.`),
  msq(3, 'impulse', r`Which statements about impulse are correct?`,
    ['The area under a force-time graph is the impulse', 'Impulse equals change in momentum', 'Average force equals impulse divided by the contact time', 'Impulse is a scalar'],
    [0, 1, 2],
    r`A, B and C are the definitions. Impulse $= \int\vec F\,dt$ is a vector, so D is false.`),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'centre of mass of shapes', group: 'm1',
    q: 'Match each body in List I with the position of its centre of mass in List II.',
    options: ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`Rod: midpoint, $L/2$ (r). Solid hemisphere: $3R/8$ from the centre of the flat face (p). Solid cone: $h/4$ from the base (q). Semicircular plate: $4R/3\pi$ from the centre (s).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'coefficient of restitution', group: 'm2',
    q: 'Match each situation in List I with the coefficient of restitution in List II.',
    options: ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-q, C-p, D-s'], answer: 3,
    sol: r`Perfectly elastic: $e = 1$ (r). Perfectly inelastic: $e = 0$ (q). Rebound to $h/4$: $e = \sqrt{1/4} = 0.5$ (p). Rebound to $9h/16$: $e = \sqrt{9/16} = 0.75$ (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'elastic collision', group: 'm3',
    q: r`A 1 kg ball moving at $6\ \mathrm{m\,s^{-1}}$ hits a stationary ball head-on in an elastic collision. Match the mass of the stationary ball in List I with its speed after the collision in List II.`,
    options: ['A-p, B-s, C-q, D-r', 'A-r, B-q, C-s, D-p', 'A-r, B-s, C-q, D-p', 'A-s, B-r, C-q, D-p'], answer: 2,
    sol: r`$v_2 = 2m_1u/(m_1 + m_2) = 12/(1 + m_2)$. $m_2 = 1$: 6 (r). $m_2 = 2$: 4 (s). $m_2 = 3$: 3 (q). $m_2 = 5$: 2 (p).` },
];

const groups = {
  m1: { title: 'Centres of mass of uniform bodies',
    list1: ['A. Thin rod of length $L$', 'B. Solid hemisphere of radius $R$ (from the centre of the flat face)', 'C. Solid cone of height $h$ (from the base)', 'D. Semicircular plate of radius $R$ (from the centre)'],
    list2: ['p. $3R/8$', 'q. $h/4$', 'r. $L/2$', 's. $4R/3\\pi$'] },
  m2: { title: 'Meaning of the coefficient of restitution',
    list1: ['A. Perfectly elastic collision', 'B. Perfectly inelastic collision', 'C. Ball dropped from $h$ rebounds to $h/4$', 'D. Ball dropped from $h$ rebounds to $9h/16$'],
    list2: ['p. $e = 0.5$', 'q. $e = 0$', 'r. $e = 1$', 's. $e = 0.75$'] },
  m3: { title: 'Elastic collision with different target masses',
    list1: ['A. Stationary ball of mass 1 kg', 'B. Stationary ball of mass 2 kg', 'C. Stationary ball of mass 3 kg', 'D. Stationary ball of mass 5 kg'],
    list2: [r`p. $2\ \mathrm{m\,s^{-1}}$`, r`q. $3\ \mathrm{m\,s^{-1}}$`, r`r. $6\ \mathrm{m\,s^{-1}}$`, r`s. $4\ \mathrm{m\,s^{-1}}$`] },
  p1: { title: 'A bullet and a hanging block',
    passage: r`<p>A 10 g bullet is fired horizontally at $400\ \mathrm{m\,s^{-1}}$ into a 1.99 kg wooden block hanging from two light strings (a ballistic pendulum). The bullet stays in the block. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p2: { title: 'Two blocks and a spring',
    passage: r`<p>A 2 kg block moves at $6\ \mathrm{m\,s^{-1}}$ along a smooth table towards a 4 kg block at rest. A light spring of constant $300\ \mathrm{N\,m^{-1}}$ is fixed to the 4 kg block, facing the 2 kg block.</p>` },
  p3: { title: 'A ball bouncing on a hard floor',
    passage: r`<p>A ball is dropped from a height of 5 m onto a hard floor. The coefficient of restitution is 0.6. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
};

items.push(
  nat(3, 'ballistic pendulum', r`Find the speed of the block with the bullet just after the impact (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`Momentum: $0.01\times400 = (0.01 + 1.99)V$, so $V = 4/2 = 2\ \mathrm{m\,s^{-1}}$.`, { group: 'p1', format: 'passage', unit: 'm/s' }),
  nat(3, 'ballistic pendulum', r`Find the greatest height the block rises (in m).`, 0.2, 0.005,
    r`Energy after the impact: $h = V^2/2g = 4/20 = 0.2$ m. The strings do no work (they stay perpendicular to the motion).`, { group: 'p1', format: 'passage', unit: 'm' }),
  mcq(4, 'ballistic pendulum', 'What percentage of the bullet\'s initial kinetic energy is lost as heat in the impact?', '99.5%', ['50%', '0.5%', '99%'],
    r`Initial $K = \tfrac12\times0.01\times400^2 = 800$ J. After the impact $K = \tfrac12\times2\times4 = 4$ J. Lost $= 796$ J, which is $99.5\%$. Equivalently, the fraction lost is $M/(m + M) = 1.99/2 = 0.995$.`, { group: 'p1', format: 'passage', trap: 'Part of the energy then goes to the swing. The swing is only 0.5% of what the bullet started with.' }),
  nat(3, 'collisions', r`Find the common speed of the two blocks when the spring is most compressed (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`At greatest compression the blocks have equal velocity: $2\times6 = 6V$, so $V = 2\ \mathrm{m\,s^{-1}}$.`, { group: 'p2', format: 'passage', unit: 'm/s' }),
  nat(4, 'collisions', 'Find the greatest compression of the spring (in m).', 0.4, 0.005,
    r`Kinetic energy before: $\tfrac12\times2\times36 = 36$ J. At greatest compression: $\tfrac12\times6\times4 = 12$ J. Spring energy $= 24$ J $= \tfrac12\times300x^2$, so $x^2 = 0.16$ and $x = 0.4$ m.`, { group: 'p2', format: 'passage', unit: 'm' }),
  mcq(4, 'elastic collision', 'After the spring returns to its natural length and the blocks separate, the speed of the 4 kg block is', r`$4\ \mathrm{m\,s^{-1}}$`, [r`$2\ \mathrm{m\,s^{-1}}$`, r`$6\ \mathrm{m\,s^{-1}}$`, r`$3\ \mathrm{m\,s^{-1}}$`],
    r`The spring is ideal, so the collision is elastic: $v_2 = 2m_1u/(m_1 + m_2) = 2\times2\times6/6 = 4\ \mathrm{m\,s^{-1}}$. The 2 kg block rebounds at $2\ \mathrm{m\,s^{-1}}$. Check: $12 = -4 + 16$; energy: $36 = 4 + 32$.`, { group: 'p2', format: 'passage' }),
  nat(3, 'coefficient of restitution', r`Find the speed of the ball just after its first impact with the floor (in $\mathrm{m\,s^{-1}}$).`, 6, 0,
    r`Impact speed $= \sqrt{2gh} = \sqrt{100} = 10\ \mathrm{m\,s^{-1}}$. Rebound speed $= e\times10 = 6\ \mathrm{m\,s^{-1}}$.`, { group: 'p3', format: 'passage', unit: 'm/s' }),
  nat(3, 'coefficient of restitution', r`Find the height of the first rebound (in m).`, 1.8, 0.01,
    r`$h_1 = v^2/2g = 36/20 = 1.8$ m. (Or $e^2h = 0.36\times5 = 1.8$ m.)`, { group: 'p3', format: 'passage', unit: 'm' }),
  nat(4, 'coefficient of restitution', r`Find the time between the first and the second impact with the floor (in s).`, 1.2, 0.01,
    r`After the first impact the ball rises and falls back. Time $= 2v/g = 2\times6/10 = 1.2$ s.`, { group: 'p3', format: 'passage', unit: 's' }),
);

// ---------- Number templates ----------
const tl = (x) => { const a = +x.toPrecision(3); return [a, Math.max(Math.abs(a) * 0.01, 1e-6)]; };
const gens = [
  { id: 'cm-g01', type: 'nat', level: 1, exams: EX[1], sub: 'centre of mass',
    make(rng) {
      const m1 = int(rng, 1, 6), m2 = int(rng, 1, 6), x1 = int(rng, 0, 4), x2 = x1 + int(rng, 2, 8);
      const x = (m1 * x1 + m2 * x2) / (m1 + m2);
      const [a, t] = tl(x);
      return { m1, m2, x1, x2, answer: a, tol: t, unit: 'm',
        q: `A ${m1} kg particle is at x = ${x1} m and a ${m2} kg particle is at x = ${x2} m on a straight line. Find the position of their centre of mass (in m).`,
        sol: `x_cm = (m₁x₁ + m₂x₂)/(m₁ + m₂) = (${m1}×${x1} + ${m2}×${x2})/${m1 + m2} = ${fmt(x, 4)} m.` };
    },
    verify: (p) => p.x1 + p.m2 * (p.x2 - p.x1) / (p.m1 + p.m2) },
  { id: 'cm-g02', type: 'nat', level: 2, exams: EX[2], sub: 'momentum conservation',
    make(rng) {
      const M = choose(rng, [2, 3, 4, 5, 8]), mg = choose(rng, [10, 20, 25, 40]), v = choose(rng, [300, 400, 500, 600]);
      const V = mg / 1000 * v / M;
      const [a, t] = tl(V);
      return { M, mg, v, answer: a, tol: t, unit: 'm/s',
        q: `A ${M} kg gun fires a ${mg} g bullet at ${v} m/s. Find the recoil speed of the gun (in m/s).`,
        sol: `Total momentum stays zero: M V = m v, so V = ${mg / 1000} × ${v} / ${M} = ${fmt(V, 4)} m/s. Change grams to kilograms first.` };
    },
    verify: (p) => (p.mg * p.v) / (p.M * 1000) },
  { id: 'cm-g03', type: 'nat', level: 2, exams: EX[2], sub: 'motion of centre of mass',
    make(rng) {
      const m = pick(rng, 40, 80, 10), M = pick(rng, 100, 200, 20), d = int(rng, 2, 8);
      const x = m * d / (m + M);
      const [a, t] = tl(x);
      return { m, M, d, answer: a, tol: t, unit: 'm',
        q: `A ${m} kg man stands at one end of a ${M} kg boat on still water. He walks ${d} m along the boat (relative to the boat). Find how far the boat moves (in m). Ignore water resistance.`,
        sol: `The centre of mass of man + boat stays fixed. If the boat moves x, the man moves ${d} − x relative to the ground: ${m}(${d} − x) = ${M}x, so x = ${m}×${d}/${m + M} = ${fmt(x, 4)} m.` };
    },
    verify: (p) => { let lo = 0, hi = p.d; for (let i = 0; i < 100; i++) { const x = (lo + hi) / 2; if (p.m * (p.d - x) - p.M * x > 0) lo = x; else hi = x; } return lo; } },
  { id: 'cm-g04', type: 'nat', level: 2, exams: EX[2], sub: 'inelastic collision',
    make(rng) {
      const m1 = int(rng, 2, 6), m2 = int(rng, 2, 8), u = int(rng, 3, 10), ask = choose(rng, ['v', 'loss']);
      const V = m1 * u / (m1 + m2), loss = 0.5 * m1 * u * u - 0.5 * (m1 + m2) * V * V;
      const [a, t] = tl(ask === 'v' ? V : loss);
      return { m1, m2, u, ask, answer: a, tol: t, unit: ask === 'v' ? 'm/s' : 'J',
        q: `A ${m1} kg block moving at ${u} m/s hits a ${m2} kg block at rest and they stick together. Find the ${ask === 'v' ? 'common speed (in m/s)' : 'kinetic energy lost (in J)'}.`,
        sol: `Momentum: ${m1}×${u} = ${m1 + m2}V, so V = ${fmt(V, 4)} m/s. ` + (ask === 'v' ? '' : `Initial K = ${fmt(0.5 * m1 * u * u, 4)} J, final K = ${fmt(0.5 * (m1 + m2) * V * V, 4)} J, lost = ${fmt(loss, 4)} J.`) };
    },
    verify: (p) => (p.ask === 'v' ? p.m1 * p.u / (p.m1 + p.m2) : 0.5 * (p.m1 * p.m2 / (p.m1 + p.m2)) * p.u * p.u) },
  { id: 'cm-g05', type: 'nat', level: 3, exams: EX[3], sub: 'elastic collision',
    make(rng) {
      const m1 = int(rng, 1, 6), m2 = int(rng, 1, 6) + (rng() < 0.3 ? 4 : 0), u = int(rng, 2, 10), ask = choose(rng, ['v1', 'v2']);
      const v1 = (m1 - m2) * u / (m1 + m2), v2 = 2 * m1 * u / (m1 + m2);
      const val = ask === 'v1' ? v1 : v2;
      const [a, t] = tl(val);
      return { m1, m2, u, ask, answer: a, tol: Math.max(t, 0.005), unit: 'm/s',
        q: `A ${m1} kg ball moving at ${u} m/s (take this direction as positive) hits a ${m2} kg ball at rest in a head-on elastic collision. Find the final velocity of the ${ask === 'v1' ? `${m1} kg` : `${m2} kg`} ball (in m/s, with sign).`,
        sol: `Elastic, target at rest: v₁ = (m₁ − m₂)u/(m₁ + m₂) = ${fmt(v1, 4)} m/s and v₂ = 2m₁u/(m₁ + m₂) = ${fmt(v2, 4)} m/s. A negative sign means it rebounds.` };
    },
    verify: (p) => { const v1 = (p.m1 * p.u - p.m2 * p.u) / (p.m1 + p.m2); const v2 = v1 + p.u; return p.ask === 'v1' ? v1 : v2; } },
  { id: 'cm-g06', type: 'nat', level: 3, exams: EX[3], sub: 'coefficient of restitution',
    make(rng) {
      const m1 = int(rng, 1, 5), m2 = int(rng, 1, 6), u = int(rng, 3, 10), e = choose(rng, [0.2, 0.4, 0.5, 0.6, 0.8]), ask = choose(rng, ['v2', 'loss']);
      const v2 = (1 + e) * m1 * u / (m1 + m2), v1 = u - m2 * v2 / m1;
      const loss = 0.5 * m1 * u * u - 0.5 * m1 * v1 * v1 - 0.5 * m2 * v2 * v2;
      const [a, t] = tl(ask === 'v2' ? v2 : loss);
      return { m1, m2, u, e, ask, answer: a, tol: Math.max(t, 0.005), unit: ask === 'v2' ? 'm/s' : 'J',
        q: `A ${m1} kg ball moving at ${u} m/s hits a ${m2} kg ball at rest head-on. The coefficient of restitution is ${e}. Find the ${ask === 'v2' ? `speed of the ${m2} kg ball after the collision (in m/s)` : 'kinetic energy lost (in J)'}.`,
        sol: `Momentum: ${m1}v₁ + ${m2}v₂ = ${m1 * u}. Restitution: v₂ − v₁ = ${e} × ${u} = ${fmt(e * u, 4)}. So v₂ = (1 + e)m₁u/(m₁ + m₂) = ${fmt(v2, 4)} m/s and v₁ = ${fmt(v1, 4)} m/s. ` + (ask === 'v2' ? '' : `Loss = ${fmt(0.5 * m1 * u * u, 4)} − ${fmt(0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2, 4)} = ${fmt(loss, 4)} J.`) };
    },
    verify: (p) => { const v1 = (p.m1 - p.e * p.m2) * p.u / (p.m1 + p.m2), v2 = v1 + p.e * p.u; return p.ask === 'v2' ? v2 : 0.5 * p.m1 * p.u ** 2 - 0.5 * p.m1 * v1 ** 2 - 0.5 * p.m2 * v2 ** 2; } },
  { id: 'cm-g07', type: 'mcq', level: 3, exams: EX[3], sub: 'coefficient of restitution',
    make(rng) {
      const h = choose(rng, [2, 4, 5, 8, 10]), e = choose(rng, [0.5, 0.6, 0.8, 0.9]);
      const h2 = e * e * h;
      const o = numOpts(rng, h2, [e * h, (1 - e) * h, (1 - e * e) * h], 'm', 4);
      return { h, e, h2, options: o.options, answer: o.answer,
        q: `A ball is dropped from ${h} m onto a hard floor. The coefficient of restitution is ${e}. The height of the first rebound is`,
        sol: `The rebound speed is e times the impact speed, and height goes as speed squared, so h₂ = e²h = ${e}² × ${h} = ${fmt(h2, 4)} m. The other options use e instead of e², or the lost fraction.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(Math.pow(p.e * Math.sqrt(p.h), 2), 4)} m`) },
  { id: 'cm-g08', type: 'nat', level: 3, exams: EX[3], sub: 'ballistic pendulum',
    make(rng) {
      const mg = choose(rng, [10, 20, 25]), M = choose(rng, [1, 2, 3]), [h, vv] = choose(rng, [[0.05, 1], [0.2, 2], [0.45, 3], [0.8, 4]]);
      const m = mg / 1000, u = (m + M) / m * vv;
      const [a, t] = tl(u);
      return { mg, M, h, answer: a, tol: t, unit: 'm/s',
        q: `A ${mg} g bullet is fired into a ${M} kg block hanging from strings and stays in it. The block rises ${h} m. Find the bullet's speed (in m/s, g = 10 m/s²).`,
        sol: `Swing: V = √(2gh) = √(2×10×${h}) = ${vv} m/s. Impact: ${m} u = ${fmt(m + M, 5)} × ${vv}, so u = ${fmt(u, 4)} m/s.` };
    },
    verify: (p) => { const m = p.mg / 1000; return m ? ((m + p.M) * Math.sqrt(2 * 10 * p.h)) / m : 0; } },
  { id: 'cm-g09', type: 'nat', level: 3, exams: EX[3], sub: 'explosion',
    make(rng) {
      const M = choose(rng, [3, 4, 5, 6, 8]), m1 = int(rng, 1, M - 1), v1 = int(rng, 4, 20), ask = choose(rng, ['v2', 'E']);
      const v2 = m1 * v1 / (M - m1), E = 0.5 * m1 * v1 * v1 + 0.5 * (M - m1) * v2 * v2;
      const [a, t] = tl(ask === 'v2' ? v2 : E);
      return { M, m1, v1, ask, answer: a, tol: t, unit: ask === 'v2' ? 'm/s' : 'J',
        q: `A ${M} kg shell at rest explodes into two fragments. A ${m1} kg fragment flies off at ${v1} m/s. Find the ${ask === 'v2' ? `speed of the other ${M - m1} kg fragment (in m/s)` : 'total kinetic energy of the two fragments (in J)'}.`,
        sol: `Momentum: ${m1}×${v1} = ${M - m1}v₂, so v₂ = ${fmt(v2, 4)} m/s (opposite direction). ` + (ask === 'v2' ? '' : `K = ½×${m1}×${v1}² + ½×${M - m1}×${fmt(v2, 4)}² = ${fmt(E, 4)} J.`) };
    },
    verify: (p) => { const v2 = p.m1 * p.v1 / (p.M - p.m1); return p.ask === 'v2' ? v2 : 0.5 * p.m1 * p.v1 ** 2 * (1 + p.m1 / (p.M - p.m1)); } },
  { id: 'cm-g10', type: 'nat', level: 3, exams: EX[3], sub: 'centre of mass of shapes',
    make(rng) {
      const R = choose(rng, [10, 12, 18, 20, 24]), qq = choose(rng, [3, 4, 5]);
      const rr = R / qq, d = R / 2;
      const x = rr * rr * d / (R * R - rr * rr);
      const [a, t] = tl(x);
      return { R, qq, answer: a, tol: t, unit: 'cm',
        q: `A uniform disc of radius ${R} cm has a circular hole of radius ${fmt(rr, 4)} cm cut out, with the centre of the hole ${R / 2} cm from the centre of the disc. Find the shift of the centre of mass of the remaining plate from the disc's centre (in cm).`,
        sol: `Treat the hole as negative mass, with mass ∝ area. x = −(π r² d)/(π R² − π r²) = −(${fmt(rr * rr, 4)} × ${R / 2})/(${R * R} − ${fmt(rr * rr, 4)}) = −${fmt(x, 4)} cm. The shift is ${fmt(x, 4)} cm, away from the hole.` };
    },
    verify: (p) => { const A = Math.PI * p.R ** 2, a = Math.PI * (p.R / p.qq) ** 2; return (a * (p.R / 2)) / (A - a); } },
  { id: 'cm-g11', type: 'nat', level: 3, exams: EX[3], sub: 'variable mass',
    make(rng) {
      const m = choose(rng, [500, 1000, 2000]), rate = choose(rng, [5, 8, 10, 12]), u = choose(rng, [2000, 2500, 3000]);
      const a = u * rate / m - 10;
      if (a <= 0) return gens[10].make(rng);
      const [aa, t] = tl(a);
      return { m, rate, u, answer: aa, tol: t, unit: 'm/s²',
        q: `A rocket of mass ${m} kg burns fuel at ${rate} kg/s and ejects the gas at ${u} m/s relative to the rocket. It lifts off vertically. Find its initial acceleration (in m/s², g = 10 m/s²).`,
        sol: `Thrust = u × (dm/dt) = ${u} × ${rate} = ${u * rate} N. Weight = ${m * 10} N. a = (${u * rate} − ${m * 10})/${m} = ${fmt(a, 4)} m/s².` };
    },
    verify: (p) => (p.u * p.rate - p.m * 10) / p.m },
  { id: 'cm-g12', type: 'nat', level: 4, exams: EX[4], sub: 'collisions in two dimensions',
    make(rng) {
      const m1 = int(rng, 1, 4), m2 = int(rng, 1, 4), u1 = int(rng, 3, 8), u2 = int(rng, 3, 8);
      const V = Math.hypot(m1 * u1, m2 * u2) / (m1 + m2);
      const [a, t] = tl(V);
      return { m1, m2, u1, u2, answer: a, tol: t, unit: 'm/s',
        q: `A ${m1} kg ball moving east at ${u1} m/s collides with a ${m2} kg ball moving north at ${u2} m/s. They stick together. Find their speed after the collision (in m/s).`,
        sol: `Eastward momentum = ${m1 * u1}, northward = ${m2 * u2}. Resultant = √(${m1 * u1}² + ${m2 * u2}²) = ${fmt(Math.hypot(m1 * u1, m2 * u2), 4)}. Divide by the total mass ${m1 + m2}: V = ${fmt(V, 4)} m/s.` };
    },
    verify: (p) => { const px = p.m1 * p.u1 / (p.m1 + p.m2), py = p.m2 * p.u2 / (p.m1 + p.m2); return Math.sqrt(px * px + py * py); } },
  { id: 'cm-g13', type: 'nat', level: 3, exams: EX[3], sub: 'impulse',
    make(rng) {
      const A = choose(rng, [2, 4, 5, 10]), v = choose(rng, [5, 8, 10, 12]), mode = choose(rng, ['stops', 'rebounds']);
      const F = 1000 * A * 1e-4 * v * v * (mode === 'stops' ? 1 : 2);
      const [a, t] = tl(F);
      return { A, v, mode, answer: a, tol: t, unit: 'N',
        q: `A water jet of cross-section ${A} cm² and speed ${v} m/s hits a wall normally and ${mode === 'stops' ? 'stops dead' : 'rebounds with the same speed'}. Find the force on the wall (in N; ρ = 1000 kg/m³).`,
        sol: `Mass per second = ρAv = 1000 × ${A}×10⁻⁴ × ${v} = ${fmt(1000 * A * 1e-4 * v, 4)} kg/s. Velocity change per kg = ${mode === 'stops' ? v : 2 * v} m/s. F = ${fmt(F, 4)} N.` };
    },
    verify: (p) => 1000 * (p.A * 1e-4 * p.v) * (p.mode === 'stops' ? p.v : 2 * p.v) },
  { id: 'cm-g14', type: 'nat', level: 4, exams: EX[4], sub: 'coefficient of restitution',
    make(rng) {
      const e = choose(rng, [0.5, 0.6, 0.8]), h = choose(rng, [1, 2, 3, 5]);
      const D = h * (1 + e * e) / (1 - e * e);
      const [a, t] = tl(D);
      return { e, h, answer: a, tol: t, unit: 'm',
        q: `A ball is dropped from ${h} m onto a hard floor (coefficient of restitution ${e}) and bounces again and again until it stops. Find the total distance it travels (in m).`,
        sol: `Distance = h[1 + 2e² + 2e⁴ + …] = h(1 + e²)/(1 − e²) = ${h} × ${fmt(1 + e * e, 4)} / ${fmt(1 - e * e, 4)} = ${fmt(D, 4)} m.` };
    },
    verify: (p) => { let s = p.h, hh = p.h; for (let i = 0; i < 400; i++) { hh *= p.e * p.e; s += 2 * hh; } return s; } },
  { id: 'cm-g15', type: 'nat', level: 4, exams: EX[4], sub: 'collisions',
    make(rng) {
      const m1 = int(rng, 1, 5), m2 = int(rng, 1, 6), u = int(rng, 2, 8), kk = choose(rng, [100, 200, 300, 400, 500]);
      const x = u * Math.sqrt(m1 * m2 / ((m1 + m2) * kk));
      const [a, t] = tl(x * 100);
      return { m1, m2, u, kk, answer: a, tol: t, unit: 'cm',
        q: `A ${m1} kg block moving at ${u} m/s on a smooth table hits a ${m2} kg block at rest that carries a light spring (k = ${kk} N/m) facing the first block. Find the greatest compression of the spring (in cm).`,
        sol: `At greatest compression both blocks move together at V = ${m1}u/(${m1 + m2}) = ${fmt(m1 * u / (m1 + m2), 4)} m/s. Energy lost from kinetic to spring: ½×${m1}×${u}² − ½×${m1 + m2}×V² = ${fmt(0.5 * m1 * u * u - 0.5 * (m1 + m2) * (m1 * u / (m1 + m2)) ** 2, 4)} J = ½kx². So x = ${fmt(x, 4)} m = ${fmt(x * 100, 4)} cm.` };
    },
    verify: (p) => { const V = p.m1 * p.u / (p.m1 + p.m2), E = 0.5 * p.m1 * p.u ** 2 - 0.5 * (p.m1 + p.m2) * V * V; return Math.sqrt(2 * E / p.kk) * 100; } },
  { id: 'cm-g16', type: 'nat', level: 2, exams: EX[2], sub: 'centre of mass',
    make(rng) {
      const ps = [0, 1, 2].map(() => ({ m: int(rng, 1, 4), x: int(rng, 0, 8), y: int(rng, 0, 8) }));
      const ask = choose(rng, ['x', 'y']);
      const M = ps.reduce((s, p) => s + p.m, 0), val = ps.reduce((s, p) => s + p.m * p[ask], 0) / M;
      const [a, t] = tl(val);
      return { ps, ask, answer: a, tol: t, unit: 'm',
        q: `Three particles of masses ${ps.map((p) => p.m).join(' kg, ')} kg are at (${ps.map((p) => `${p.x}, ${p.y}`).join('), (')}) metres. Find the ${ask}-coordinate of their centre of mass (in m).`,
        sol: `${ask}_cm = Σ m·${ask} / Σ m = (${ps.map((p) => `${p.m}×${p[ask]}`).join(' + ')}) / ${M} = ${fmt(val, 4)} m.` };
    },
    verify: (p) => { let a = 0, b = 0; for (const q of p.ps) { a += q.m * q[p.ask]; b += q.m; } return a / b; } },
  { id: 'cm-g17', type: 'mcq', level: 3, exams: EX[3], sub: 'collisions',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3]), m2 = choose(rng, [1, 2, 3, 4, 6]);
      const f = 100 * m2 / (m1 + m2);
      const o = numOpts(rng, f, [100 * m1 / (m1 + m2), 50, 100 * m2 / m1 > 100 ? 25 : 100 * m2 / m1], '%', 3);
      return { m1, m2, f, options: o.options, answer: o.answer,
        q: `A ${m1} kg block moving at some speed hits a ${m2} kg block at rest and they stick together. The percentage of the initial kinetic energy that is lost is`,
        sol: `K_final/K_initial = m₁/(m₁ + m₂) = ${m1}/${m1 + m2}, so the loss is m₂/(m₁ + m₂) = ${m2}/${m1 + m2} = ${fmt(f, 3)}%. The other options give the fraction that is left, or a guess of 50%.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(100 * p.m2 / (p.m1 + p.m2), 3)} %`) },
];

export default { topic: 'centre-of-mass-collisions', groups, items, gens };
