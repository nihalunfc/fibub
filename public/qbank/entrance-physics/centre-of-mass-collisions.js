// Centre of mass and collisions: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

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

// extra helpers for the 2026-11-22 additions
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'match', exams: EX[level], sub, group, q, options, answer: pos, sol, ...o };
};
const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'passage', exams: EX[level], sub, group, q, options, answer: pos, sol, ...o };
};
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
  m4: { title: 'Centres of mass of shapes',
    list1: ['A. Uniform triangular plate', 'B. Hollow hemispherical shell', 'C. Solid hemisphere', 'D. Semicircular wire'],
    list2: [r`p. $h/3$ from the base`, r`q. $R/2$ from the centre of the flat face`, r`r. $3R/8$ from the centre of the flat face`, r`s. $2R/\pi$ from the diameter`] },
  m5: { title: 'Coefficient of restitution',
    list1: ['A. Perfectly elastic collision', 'B. Perfectly inelastic collision', 'C. Ball rebounds to a quarter of its drop height', 'D. Ball rebounds to 0.36 of its drop height'],
    list2: ['p. 0.6', 'q. 0.5', 'r. 1', 's. 0'] },
  m6: { title: 'Reduced mass',
    list1: ['A. 1 kg and 1 kg', 'B. 2 kg and 2 kg', 'C. 1 kg and 3 kg', 'D. 2 kg and 6 kg'],
    list2: ['p. 0.5 kg', 'q. 0.75 kg', 'r. 1 kg', 's. 1.5 kg'] },
  m7: { title: 'Elastic collision with a stationary ball',
    list1: [r`A. $m_1 : m_2 = 3 : 1$`, r`B. $m_1 : m_2 = 1 : 1$`, r`C. $m_1 : m_2 = 1 : 3$`, r`D. $m_1 : m_2 = 1 : 9$`],
    list2: [r`p. $0$`, r`q. $+0.5u$`, r`r. $-0.5u$`, r`s. $-0.8u$`] },
  m8: { title: 'Rebound height and e',
    list1: ['A. Rebounds to $0.81h$', 'B. Rebounds to $0.64h$', 'C. Rebounds to $0.49h$', 'D. Rebounds to $0.25h$'],
    list2: ['p. 0.5', 'q. 0.7', 'r. 0.8', 's. 0.9'] },
  m9: { title: 'Variable-mass and flow problems',
    list1: [r`A. Rocket, $u = 1000\ \mathrm{m\,s^{-1}}$, mass falls by a factor $e$: gain in speed`, r`B. Rocket, $u = 1000\ \mathrm{m\,s^{-1}}$, burning $3\ \mathrm{kg\,s^{-1}}$: thrust`, r`C. Sand falls at $5\ \mathrm{kg\,s^{-1}}$ on a belt moving at $2\ \mathrm{m\,s^{-1}}$: extra force`, r`D. Water jet, $\rho = 1000$, $A = 10^{-3}\ \mathrm{m^2}$, $v = 3\ \mathrm{m\,s^{-1}}$, stopped by a wall: force`],
    list2: [r`p. $1000\ \mathrm{m\,s^{-1}}$`, r`q. $3000$ N`, r`r. $10$ N`, r`s. $9$ N`] },
  m10: { title: 'Centre of mass with a cavity',
    list1: [r`A. Disc, hole of radius $R/2$ centred $R/2$ from the centre`, r`B. Sphere, cavity of radius $R/2$ centred $R/2$ from the centre`, r`C. Disc, hole of radius $R/3$ centred $2R/3$ from the centre`, r`D. Sphere, cavity of radius $R/3$ centred $2R/3$ from the centre`],
    list2: [r`p. $R/6$`, r`q. $R/14$`, r`r. $R/12$`, r`s. $R/39$`] },
  m11: { title: 'Final velocities',
    list1: ['A. 2 kg at $3\\ \\mathrm{m\\,s^{-1}}$ sticks to a 1 kg block at rest: final velocity', 'B. 1 kg at $6\\ \\mathrm{m\\,s^{-1}}$ hits a 2 kg block at rest elastically: velocity of the 1 kg block', 'C. 1 kg at $6\\ \\mathrm{m\\,s^{-1}}$ hits a 1 kg block at rest elastically: velocity of the first block', 'D. 2 kg at $6\\ \\mathrm{m\\,s^{-1}}$ hits a 4 kg block at rest elastically: velocity of the 4 kg block'],
    list2: [r`p. $2\ \mathrm{m\,s^{-1}}$`, r`q. $-2\ \mathrm{m\,s^{-1}}$`, r`r. $0$`, r`s. $4\ \mathrm{m\,s^{-1}}$`] },
  p4: { title: 'A ball on an incline',
    passage: r`<p>A small ball is dropped from a height of 1.25 m above a point on a smooth plane inclined at $30^\circ$ to the horizontal. The collision with the plane is perfectly elastic. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p5: { title: 'A rocket',
    passage: r`<p>A rocket of initial mass 1000 kg burns fuel at $10\ \mathrm{kg\,s^{-1}}$, ejecting the exhaust at $2000\ \mathrm{m\,s^{-1}}$ relative to the rocket.</p>` },
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

items.push(

  // ================= Added 2026-11-22: harder and more varied questions =================
  // ---------- Level 2 ----------
  mcq(2, 'centre of mass of shapes', r`The centre of mass of a uniform triangular plate lies at a distance from its base equal to`, r`one-third of its height`, ['half of its height', 'one-quarter of its height', 'two-thirds of its height'],
    r`The centre of mass of a triangular lamina is its centroid, the point where the medians meet. It is at one-third of the height from the base (two-thirds from the apex).`),
  nat(2, 'impulse', r`A 0.5 kg ball hits a wall normally at $8\ \mathrm{m\,s^{-1}}$ and rebounds at $6\ \mathrm{m\,s^{-1}}$. Find the magnitude of the impulse on the ball in N s.`, 7, 0,
    r`Take the incoming direction as positive: $\Delta p = 0.5(-6) - 0.5(8) = -7$. The magnitude of the impulse is $7\ \mathrm{N\,s}$.`, { unit: 'N s', calc: () => 0.5 * (6 + 8), trap: 'The velocity changes direction, so add the two speeds.' }),
  mcq(2, 'collisions', r`A collision between two bodies is inelastic. Which of the following is still conserved if no external force acts?`, 'The total momentum', ['The total kinetic energy', 'The kinetic energy of each body', 'The speed of each body'],
    r`Momentum is conserved in every collision of an isolated system. Kinetic energy is not conserved when the collision is inelastic.`),
  nat(2, 'coefficient of restitution', r`A ball dropped from 1.6 m on a hard floor rebounds to 0.9 m. Find the coefficient of restitution (2 decimals).`, 0.75, 0.005,
    r`$e = \sqrt{h'/h} = \sqrt{0.9/1.6} = \sqrt{0.5625} = 0.75$.`, { calc: () => Math.sqrt(0.9 / 1.6) }),
  nat(2, 'inelastic collision', r`A 3 kg block moving at $+2\ \mathrm{m\,s^{-1}}$ and a 1 kg block moving at $-2\ \mathrm{m\,s^{-1}}$ collide head-on and stick together. Find their common velocity in $\mathrm{m\,s^{-1}}$.`, 1, 0,
    r`$(3)(2) + (1)(-2) = (4)V$, so $V = 4/4 = +1\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => (3 * 2 - 1 * 2) / 4 }),
  mcq(2, 'centre of mass', r`The centre of mass of the Earth–Moon system lies`, 'inside the Earth', ['at the centre of the Earth', 'halfway between the Earth and the Moon', 'at the centre of the Moon'],
    r`The Earth is about 81 times as massive as the Moon, so the centre of mass is $d\times\dfrac{1}{82}$ from the Earth's centre, about 4700 km. This is inside the Earth (radius 6400 km) but not at its centre.`),

  // ---------- Level 3 ----------
  nat(3, 'centre of mass of shapes', r`A thin triangular plate has vertices at $(0,0)$, $(6,0)$ and $(0,9)$ (in cm). Find the distance of its centre of mass from the origin in cm (2 decimals).`, 3.61, 0.01,
    r`The centroid is the average of the vertices: $\bar x = (0+6+0)/3 = 2$, $\bar y = (0+0+9)/3 = 3$. Distance $= \sqrt{4+9} = 3.61$ cm.`, { unit: 'cm', calc: () => Math.hypot(2, 3) }),
  nat(3, 'centre of mass of shapes', r`A uniform quarter-circular plate has radius 12 cm. Find the distance of its centre of mass from either straight edge in cm (2 decimals). Use $4R/3\pi$.`, 5.09, 0.01,
    r`The centre of mass of a quarter disc is $\dfrac{4R}{3\pi} = \dfrac{48}{9.425} = 5.09$ cm from each straight edge.`, { unit: 'cm', calc: () => 48 / (3 * Math.PI) }),
  nat(3, 'centre of mass of shapes', r`Find the distance of the centre of mass of a thin uniform hemispherical <b>shell</b> of radius 20 cm from the centre of its flat face, in cm.`, 10, 0,
    r`For a hollow hemispherical shell $\bar x = R/2 = 10$ cm. (A solid hemisphere has $3R/8$.)`, { unit: 'cm', calc: () => 20 / 2, trap: 'Shell: $R/2$; solid: $3R/8$.' }),
  nat(3, 'centre of mass of shapes', r`A hollow cone (only the curved surface, no base) has height 18 cm. Find the distance of its centre of mass from the base in cm.`, 6, 0,
    r`For a conical shell the centre of mass is at $h/3$ from the base (a solid cone has $h/4$). $18/3 = 6$ cm.`, { unit: 'cm', calc: () => 18 / 3 }),
  nat(3, 'impulse', r`A bat applies a force that rises uniformly from 0 to 200 N in 0.015 s and then falls uniformly to 0 in 0.015 s. A 0.15 kg ball initially at rest receives all of this impulse. Find the speed it leaves with in $\mathrm{m\,s^{-1}}$.`, 20, 0,
    r`Impulse $=$ area of the triangle $=\tfrac12\times0.03\times200 = 3\ \mathrm{N\,s}$. $v = J/m = 3/0.15 = 20\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => 0.5 * 0.03 * 200 / 0.15 }),
  nat(3, 'impulse', r`A 0.16 kg ball hits a wall normally at $20\ \mathrm{m\,s^{-1}}$ and rebounds at $15\ \mathrm{m\,s^{-1}}$. The contact lasts 4 ms. Find the average force on the ball in N.`, 1400, 0,
    r`$\Delta p = 0.16(15 + 20) = 5.6\ \mathrm{N\,s}$. $F_{avg} = \Delta p/\Delta t = 5.6/0.004 = 1400$ N.`, { unit: 'N', calc: () => 0.16 * 35 / 0.004 }),
  nat(3, 'inelastic collision', r`A 2 kg block moving at $5\ \mathrm{m\,s^{-1}}$ hits a 3 kg block at rest and they stick together. Find the kinetic energy lost in J.`, 15, 0,
    r`$V = 10/5 = 2\ \mathrm{m\,s^{-1}}$. $K_i = \tfrac12(2)(25) = 25$ J, $K_f = \tfrac12(5)(4) = 10$ J. Lost $= 15$ J. (Also $\tfrac12\mu u^2 = \tfrac12\times1.2\times25 = 15$ J.)`, { unit: 'J', calc: () => 25 - 10 }),
  nat(3, 'elastic collision', r`A 2 kg block moving at $5\ \mathrm{m\,s^{-1}}$ makes a head-on elastic collision with a 3 kg block at rest. Find the speed of the 3 kg block afterwards in $\mathrm{m\,s^{-1}}$.`, 4, 0,
    r`$v_2 = \dfrac{2m_1u}{m_1+m_2} = \dfrac{2\times2\times5}{5} = 4\ \mathrm{m\,s^{-1}}$. (The 2 kg block rebounds at $v_1 = \tfrac{2-3}{5}\times5 = -1\ \mathrm{m\,s^{-1}}$.)`, { unit: 'm/s', calc: () => 2 * 2 * 5 / 5 }),
  nat(3, 'variable mass', r`A rocket ejects gas at $400\ \mathrm{m\,s^{-1}}$ relative to itself at a rate of $5\ \mathrm{kg\,s^{-1}}$. Find the thrust on the rocket in N.`, 2000, 0,
    r`Thrust $= u\,\dfrac{dm}{dt} = 400\times5 = 2000$ N.`, { unit: 'N', calc: () => 400 * 5 }),
  nat(3, 'motion of centre of mass', r`A 2 kg particle moves at $+3\ \mathrm{m\,s^{-1}}$ and a 4 kg particle moves at $-1\ \mathrm{m\,s^{-1}}$ along the same line. Find the velocity of their centre of mass in $\mathrm{m\,s^{-1}}$ (2 decimals).`, 0.33, 0.005,
    r`$v_{cm} = \dfrac{(2)(3) + (4)(-1)}{6} = \dfrac{2}{6} = 0.33\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => 2 / 6 }),
  nat(3, 'motion of centre of mass', r`A skater of mass 80 kg stands on frictionless ice and throws a 2 kg ball horizontally at $10\ \mathrm{m\,s^{-1}}$. Find his recoil speed in $\mathrm{m\,s^{-1}}$ (2 decimals).`, 0.25, 0.005,
    r`Momentum: $0 = 2\times10 - 80V$, so $V = 20/80 = 0.25\ \mathrm{m\,s^{-1}}$ (opposite to the throw).`, { unit: 'm/s', calc: () => 20 / 80 }),
  stm(3, 'motion of centre of mass', r`The centre of mass of a system moves as if all the mass were concentrated there and all external forces acted there.`, r`The internal forces between particles cancel in pairs (Newton's third law).`, 0,
    r`Both true and II is the reason: summing $m_i\vec a_i = \vec F_i^{ext} + \sum\vec F_{ij}$ over all particles, the internal forces cancel, leaving $M\vec a_{cm} = \vec F^{ext}$.`),
  asrt(3, 'explosion', r`In an explosion the kinetic energy of the fragments is greater than that of the original body.`, r`Stored chemical (or elastic) energy is converted into kinetic energy during the explosion.`, 0,
    r`Both true and R explains A. Momentum is conserved but energy is released, so kinetic energy increases.`),
  mat(3, 'centre of mass of shapes', 'm4', r`Match each uniform body in List I with the position of its centre of mass in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Triangular plate: $h/3$ from the base (p). Hemispherical shell: $R/2$ (q). Solid hemisphere: $3R/8$ (r). Semicircular wire: $2R/\pi$ (s). So A-p, B-q, C-r, D-s.`),
  mat(3, 'coefficient of restitution', 'm5', r`Match each collision in List I with its coefficient of restitution in List II.`, 'A-r, B-s, C-q, D-p', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-q, B-s, C-r, D-p'],
    r`Perfectly elastic: $e = 1$ (r). Perfectly inelastic: $e = 0$ (s). A ball rebounding to $h/4$: $e = \sqrt{1/4} = 0.5$ (q). A ball rebounding to $0.36h$: $e = 0.6$ (p). So A-r, B-s, C-q, D-p.`),
  mat(3, 'elastic collision', 'm7', r`A ball of mass $m_1$ and speed $u$ hits a stationary ball of mass $m_2$ head-on and elastically. Match each case in List I with $v_1/u$ (the first ball's velocity after the collision, in units of $u$) in List II.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`$v_1/u = \dfrac{m_1-m_2}{m_1+m_2}$. A: $3:1$ gives $\tfrac24 = \tfrac12$ (q). B: $1:1$ gives 0 (p). C: $1:3$ gives $-\tfrac12$ (r). D: $1:9$ gives $-\tfrac{8}{10} = -0.8$ (s). So A-q, B-p, C-r, D-s.`),
  mat(3, 'coefficient of restitution', 'm8', r`A ball dropped from a height $h$ rebounds to the height in List I. Match with its coefficient of restitution in List II.`, 'A-s, B-r, C-q, D-p', ['A-r, B-s, C-q, D-p', 'A-s, B-q, C-r, D-p', 'A-s, B-r, C-p, D-q'],
    r`$e = \sqrt{h'/h}$. $0.81h$: $e = 0.9$ (s). $0.64h$: $e = 0.8$ (r). $0.49h$: $e = 0.7$ (q). $0.25h$: $e = 0.5$ (p). So A-s, B-r, C-q, D-p.`),
  mat(3, 'collisions', 'm11', r`A block hits a block at rest. Match each case in List I with the requested final velocity in List II (in $\mathrm{m\,s^{-1}}$).`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: $(2)(3) = (3)V$, $V = 2$ (p). B: $v_1 = \tfrac{1-2}{3}(6) = -2$ (q). C: equal masses elastic, so the first stops: 0 (r). D: $v_2 = \tfrac{2\times2\times6}{6} = 4$ (s). So A-p, B-q, C-r, D-s.`),
  pas(3, 'collisions', 'p4', r`Find the speed of the ball just before it hits the incline (in $\mathrm{m\,s^{-1}}$). Take $g = 10\ \mathrm{m\,s^{-2}}$.`, 5, 0, 0,
    r`$v = \sqrt{2gh} = \sqrt{2\times10\times1.25} = 5\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pas(3, 'rocket', 'p5', r`Find the thrust of the rocket in N.`, 20000, 0, 0,
    r`Thrust $= u\,dm/dt = 2000\times10 = 20\,000$ N.`, { unit: 'N' }),

  // ---------- Level 4 ----------
  msq(4, 'collisions', r`Two bodies collide head-on. Which statements are correct?`,
    ['The coefficient of restitution is the ratio of the speed of separation to the speed of approach', 'The total momentum is conserved if no external force acts', 'In an inelastic collision some kinetic energy is lost', 'For $0<e<1$ the bodies stick together'], [0, 1, 2],
    r`A is the definition of $e$. B and C are standard. Bodies stick together only for $e = 0$ (D false); for $0<e<1$ they separate more slowly than they approached.`),
  msq(4, 'centre of mass of shapes', r`Which of these centres of mass are correct? ($R$ is the radius, $h$ the height.)`,
    [r`Hollow hemispherical shell: $R/2$ from the centre of its flat face`, r`Solid hemisphere: $3R/8$ from the centre of its flat face`, r`Semicircular uniform plate: $4R/3\pi$ from the straight edge`, r`Semicircular uniform wire: $4R/3\pi$ from the straight edge`], [0, 1, 2],
    r`A, B and C are the standard results. For a semicircular <i>wire</i> the distance is $2R/\pi$ (D false).`),
  msq(4, 'elastic collision', r`A ball of mass $m_1$ and speed $u$ hits a stationary ball of mass $m_2$ head-on and elastically. Which statements are correct?`,
    [r`If $m_1 = m_2$ the balls exchange velocities`, r`If $m_1\ll m_2$ the first ball rebounds with almost its original speed`, r`If $m_1\gg m_2$ the second ball moves off at nearly $2u$`, r`The faster ball always loses all its kinetic energy`], [0, 1, 2],
    r`$v_1 = \tfrac{m_1-m_2}{m_1+m_2}u$ and $v_2 = \tfrac{2m_1}{m_1+m_2}u$. For equal masses $v_1 = 0$, $v_2 = u$ (A). For $m_1\ll m_2$: $v_1\approx-u$ (B). For $m_1\gg m_2$: $v_2\approx2u$ (C). Only for equal masses does the incident ball stop (D false).`),
  msq(4, 'explosion', r`A body of mass $M$ moving freely under gravity (no air resistance) explodes in mid-air into fragments. Which statements are correct?`,
    ['The total momentum just after the explosion equals that just before it', 'The total kinetic energy increases', 'The centre of mass of the fragments continues along the original path until some fragment lands', 'The fragments all fly off horizontally'], [0, 1, 2],
    r`The explosion forces are internal and huge, so momentum is conserved (A). Stored energy is released (B). The only external force is gravity, so the centre of mass follows the original parabola (C). The fragments go in different directions (D false).`),
  nat(4, 'collisions', r`A 1 kg block moving at $6\ \mathrm{m\,s^{-1}}$ hits a 3 kg block at rest on a smooth table. A light spring of constant $300\ \mathrm{N\,m^{-1}}$ is fixed to the near face of the 3 kg block, so the 1 kg block compresses it. Find the maximum compression of the spring in m (2 decimals).`, 0.3, 0.005,
    r`At the maximum compression the two blocks (and the spring's ends) move with a common velocity: $1\times6 = 4V$, $V = 1.5\ \mathrm{m\,s^{-1}}$. $K_i = 18$ J. $K_f = \tfrac12(4)(1.5)^2 = 4.5$ J. Spring energy $= 13.5 = \tfrac12(300)x^2$, so $x^2 = 0.09$ and $x = 0.30$ m.`, { unit: 'm', calc: () => Math.sqrt(2 * 13.5 / 300) }),
  nat(4, 'collisions', r`Two blocks of mass 2 kg and 3 kg are joined by a light spring of constant $300\ \mathrm{N\,m^{-1}}$ on a smooth table. Find the angular frequency of their relative oscillation in $\mathrm{rad\,s^{-1}}$ (1 decimal).`, 15.8, 0.1,
    r`The relative coordinate oscillates like a single body of reduced mass $\mu = \dfrac{2\times3}{5} = 1.2$ kg. $\omega = \sqrt{k/\mu} = \sqrt{300/1.2} = \sqrt{250} = 15.8\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', calc: () => Math.sqrt(250), trap: 'Use the reduced mass, not either mass or their sum.' }),
  nat(4, 'inelastic collision', r`A 2 kg block moving at $5\ \mathrm{m\,s^{-1}}$ and a 3 kg block moving at $2\ \mathrm{m\,s^{-1}}$ in the opposite direction collide and stick together. Find the kinetic energy lost in J (1 decimal).`, 29.4, 0.05,
    r`Take the first block's direction as positive: $V = (10 - 6)/5 = 0.8\ \mathrm{m\,s^{-1}}$. $K_i = \tfrac12(2)(25) + \tfrac12(3)(4) = 31$ J. $K_f = \tfrac12(5)(0.64) = 1.6$ J. Lost $= 29.4$ J. (Also $\tfrac12\mu v_{rel}^2 = \tfrac12\times1.2\times49 = 29.4$ J.)`, { unit: 'J', calc: () => 31 - 1.6 }),
  nat(4, 'coefficient of restitution', r`A ball hits a smooth floor with its velocity at $60^\circ$ to the normal. The coefficient of restitution is 0.5. Find the angle the velocity makes with the normal just after the bounce, in degrees (1 decimal).`, 73.9, 0.1,
    r`The component parallel to the floor is unchanged: $v\sin60^\circ$. The normal component becomes $e\,v\cos60^\circ$. $\tan\phi' = \dfrac{\sin60^\circ}{0.5\cos60^\circ} = \dfrac{\tan60^\circ}{0.5} = 3.464$, so $\phi' = 73.9^\circ$.`, { unit: '°', trap: 'For $e<1$ the angle with the normal becomes larger.' }),
  nat(4, 'coefficient of restitution', r`The same ball hits the floor at $10\ \mathrm{m\,s^{-1}}$ with its velocity at $60^\circ$ to the normal and $e = 0.5$. Find its speed just after the bounce in $\mathrm{m\,s^{-1}}$ (2 decimals).`, 9.01, 0.02,
    r`Parallel component: $10\sin60^\circ = 8.66$. Normal component after: $0.5\times10\cos60^\circ = 2.5$. Speed $= \sqrt{8.66^2 + 2.5^2} = \sqrt{75 + 6.25} = 9.01\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(75 + 6.25) }),
  nat(4, 'coefficient of restitution', r`A ball is dropped on a hard floor and bounces with $e = 0.8$. What percentage of its initial mechanical energy is left after the third bounce (1 decimal)?`, 26.2, 0.1,
    r`Each bounce multiplies the speed by $e$ and the energy by $e^2$. After three bounces the energy is $e^6 = 0.8^6 = 0.262$, which is $26.2\%$.`, { unit: '%', calc: () => 0.8 ** 6 * 100 }),
  nat(4, 'coefficient of restitution', r`A ball bouncing on a hard floor loses a fraction of its speed at each bounce, with $e = 0.5$. After how many bounces does its speed first fall below 1% of its speed on first impact?`, 7, 0,
    r`After $n$ bounces the speed is $e^nv$. We need $0.5^n<0.01$: $0.5^6 = 0.0156$ is too large and $0.5^7 = 0.0078$ is less than 0.01. So $n = 7$.`),
  nat(4, 'inelastic collision', r`A block of mass 2 kg collides with a stationary block of mass 3 kg and they stick together. What percentage of the initial kinetic energy is lost?`, 60, 0,
    r`Fraction lost $=\dfrac{m_2}{m_1+m_2} = \dfrac{3}{5} = 60\%$ (when one body is at rest).`, { unit: '%', calc: () => 3 / 5 * 100 }),
  nat(4, 'elastic collision', r`A 1 kg ball moving at $10\ \mathrm{m\,s^{-1}}$ hits a stationary 1000 kg block elastically and head-on. Find the magnitude of the impulse given to the block, to the nearest N s.`, 20, 0.5,
    r`$v_2 = \dfrac{2m_1u}{m_1+m_2} = \dfrac{20}{1001} = 0.01998\ \mathrm{m\,s^{-1}}$. Impulse on the block $= 1000\times0.01998 = 19.98\approx20\ \mathrm{N\,s}$ (the ball's own change of momentum is about $2mu$).`, { unit: 'N s', calc: () => 1000 * 20 / 1001 }),
  nat(4, 'centre of mass of shapes', r`A uniform disc of radius 12 cm has a circular hole of radius 6 cm whose centre is 6 cm from the centre of the disc. Find the distance of the centre of mass of the remaining plate from the centre of the disc in cm.`, 2, 0,
    r`The hole has $\tfrac14$ of the disc's mass. Treat it as a negative mass: $\bar x = \dfrac{M(0) - \tfrac M4(6)}{M - \tfrac M4} = -\dfrac{1.5}{0.75} = -2$ cm. So the centre of mass is 2 cm from the centre, on the side away from the hole.`, { unit: 'cm', calc: () => 1.5 / 0.75 }),
  nat(4, 'centre of mass of shapes', r`A uniform solid sphere of radius 28 cm has a spherical cavity of radius 14 cm whose centre is 14 cm from the centre of the sphere. Find the distance of the centre of mass of the remaining solid from the centre of the sphere in cm.`, 2, 0,
    r`The cavity has $(1/2)^3 = 1/8$ of the sphere's mass. $\bar x = \dfrac{-\tfrac M8(14)}{M - \tfrac M8} = -\dfrac{1.75}{0.875} = -2$ cm, so 2 cm on the side away from the cavity.`, { unit: 'cm', calc: () => 1.75 / 0.875 }),
  nat(4, 'centre of mass of shapes', r`A uniform square plate of side 12 cm has a square of side 6 cm cut away from one corner. With the opposite corner of the original square at the origin and the sides along the axes, find $\bar x + \bar y$ of the remaining plate in cm.`, 10, 0,
    r`Put the origin at the corner opposite to the cut-away corner. Whole plate: mass $144k$ at $(6,6)$. Removed square: mass $36k$ at $(9,9)$. Remaining mass $108k$. $\bar x = \dfrac{144(6) - 36(9)}{108} = \dfrac{864 - 324}{108} = 5$ cm, and similarly $\bar y = 5$ cm. So $\bar x + \bar y = 10$ cm.`, { unit: 'cm', calc: () => 2 * (144 * 6 - 36 * 9) / 108 }),
  nat(4, 'motion of centre of mass', r`A 50 kg man jumps horizontally off a 150 kg boat at rest on still water. He leaves at $6\ \mathrm{m\,s^{-1}}$ <b>relative to the boat</b>. Find the speed of the boat after he jumps, in $\mathrm{m\,s^{-1}}$.`, 1.5, 0.005,
    r`Let the man's velocity relative to the water be $v$ and the boat's be $-V$. Momentum: $50v = 150V$. Relative speed: $v + V = 6$. Then $3V + V = 6$, so $V = 1.5\ \mathrm{m\,s^{-1}}$ (and $v = 4.5$).`, { unit: 'm/s', calc: () => 6 * 50 / 200, trap: 'The 6 m/s is relative to the boat, not the water.' }),
  nat(4, 'collisions', r`Two identical balls and a wall: a ball moving at $v$ hits an identical stationary ball that lies between it and a wall. All collisions are perfectly elastic and head-on. Find the total number of collisions (ball-ball and ball-wall) that occur.`, 3, 0,
    r`(1) The moving ball hits the stationary one and stops (they exchange velocities). (2) The second ball hits the wall and bounces back. (3) It meets the first ball again, which is at rest, and they exchange velocities: the first ball moves away and the second stops. No more collisions. Total $= 3$.`),
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'reduced mass', group: 'm6',
    q: r`Two bodies of masses $m_1$ and $m_2$ have the reduced mass $\mu = m_1m_2/(m_1+m_2)$. Match each pair in List I with $\mu$ in List II (in kg).`,
    options: ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-q, D-s', 'A-p, B-r, C-s, D-q', 'A-q, B-r, C-p, D-s'], answer: 0,
    sol: r`A: $1\times1/2 = 0.5$ (p). B: $2\times2/4 = 1$ (r). C: $1\times3/4 = 0.75$ (q). D: $2\times6/8 = 1.5$ (s). So A-p, B-r, C-q, D-s.` },
  mat(4, 'variable mass', 'm9', r`Match each situation in List I with the quantity asked in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: $\Delta v = u\ln(m_0/m) = 1000\ln e = 1000\ \mathrm{m\,s^{-1}}$ (p). B: thrust $= 1000\times3 = 3000$ N (q). C: extra force on a belt $= v\,dm/dt = 2\times5 = 10$ N (r). D: a water jet stopped by a wall: $F = \rho Av^2 = 1000\times10^{-3}\times9 = 9$ N (s). So A-p, B-q, C-r, D-s.`),
  pasm(4, 'collisions', 'p4', r`The collision with the smooth incline of angle $30^\circ$ is perfectly elastic. The angle between the vertical and the velocity just after the collision is`, r`$60^\circ$`, [r`$30^\circ$`, r`$90^\circ$`, r`$0^\circ$`],
    r`The velocity just before the impact is vertical. The normal reverses its component and the tangential component is unchanged. The incline is at $\theta = 30^\circ$ to the horizontal, so the normal is $30^\circ$ from the vertical. The velocity is turned by $2\times30^\circ = 60^\circ$ from the upward vertical.`, { trap: 'The reflection turns the velocity through $2\\theta$ from the vertical.' }),
  pas(4, 'rocket', 'p5', r`Find the initial acceleration of the rocket (in $\mathrm{m\,s^{-2}}$) if it fires vertically upward from the ground. Take $g = 10\ \mathrm{m\,s^{-2}}$.`, 10, 0, 0,
    r`$F_{net} = 20\,000 - 1000\times10 = 10\,000$ N, so $a = 10\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pas(4, 'rocket', 'p5', r`In free space, with $u = 2000\ \mathrm{m\,s^{-1}}$, the rocket burns until its mass is halved. Find its gain in speed (nearest $\mathrm{m\,s^{-1}}$).`, 2000 * Math.log(2), 3, 0,
    r`$\Delta v = u\ln(m_0/m) = 2000\ln2 = 1386\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  asrt(4, 'collisions', r`When a small ball bounces from a smooth floor with $e<1$, the angle between its velocity and the normal increases.`, r`The normal component of velocity is multiplied by $e$ and the tangential component is unchanged.`, 0,
    r`Both true and R explains A: $\tan\phi' = \tan\phi/e>\tan\phi$.`),
  asrt(4, 'centre of mass of shapes', r`The centre of mass of a uniform semicircular wire is farther from the straight diameter than that of a uniform semicircular plate of the same radius.`, r`The wire has distance $2R/\pi$ and the plate $4R/3\pi$ from the diameter.`, 0,
    r`$2/\pi = 0.637$ and $4/3\pi = 0.424$, so the wire's centre of mass is farther. Both true and R gives the values.`),
  stm(4, 'centre of mass', r`The centre of mass of an object may lie outside its material.`, r`The centre of mass of a uniform ring is at its centre.`, 0,
    r`Both true: the ring's centre of mass is at the centre where there is no material, showing that it can lie outside the body.`),
  stm(4, 'collisions', r`The kinetic energy of a system, as seen from the centre-of-mass frame, is always zero in a perfectly inelastic collision after the collision.`, r`In the centre-of-mass frame the total momentum is always zero.`, 0,
    r`In the CM frame total momentum is zero (II true). After a perfectly inelastic collision the bodies stick together and move with the CM, so they are at rest in that frame and $K = 0$ (I true). The energy lost equals the kinetic energy that the system had in that frame.`),

  // ---------- Level 5 ----------
  msq(5, 'variable mass', r`A rocket ejects gas at a constant speed $u$ relative to itself in free space. Which statements are correct?`,
    [r`The thrust is $u\,|dm/dt|$`, r`The gain in speed is $u\ln(m_0/m)$`, r`The momentum of the rocket plus exhaust is conserved`, r`With constant thrust, the acceleration decreases as fuel is burnt`], [0, 1, 2],
    r`A, B and C are the standard results. As the mass decreases the same thrust gives a <i>larger</i> acceleration (D false).`),
  msq(5, 'collisions', r`Two particles collide. $K_{cm}$ is their kinetic energy in the centre-of-mass frame. Which are correct?`,
    ['The total momentum in the CM frame is zero', r`$K_{lab} = K_{cm} + \tfrac12Mv_{cm}^2$`, 'In a perfectly inelastic collision the kinetic energy lost equals $K_{cm}$', 'In an elastic collision each particle comes to rest in the CM frame'], [0, 1, 2],
    r`The CM frame is defined by zero total momentum (A). The split of kinetic energy is König's theorem (B). After sticking, the bodies move with the CM, so $K_{cm}$ goes to zero, and the energy lost is $K_{cm}$ (C). In an elastic collision the speeds in the CM frame are unchanged, only the directions change (D false).`),
  msq(5, 'collisions', r`A bullet of mass $m$ hits a block of mass $M$ hanging as a ballistic pendulum and stays in it. Which statements are correct?`,
    ['The momentum of the bullet and block is conserved during the impact', 'The kinetic energy is conserved during the impact', 'After the impact the mechanical energy of the block with the bullet is conserved as it swings', r`The fraction of kinetic energy lost in the impact is $\dfrac{M}{M+m}$`], [0, 2, 3],
    r`The impact is short and the string tension (vertical) gives no horizontal impulse, so momentum is conserved (A). It is perfectly inelastic, so kinetic energy is lost (B false); fraction lost $=M/(M+m)$ (D). During the swing only gravity does work, so mechanical energy is conserved (C).`),
  msq(5, 'coefficient of restitution', r`A ball bounces off a smooth fixed wall. Which statements are correct?`,
    ['The momentum component normal to the wall is reversed and multiplied by $e$', 'The component parallel to the wall is unchanged', 'For $e<1$ the speed after the bounce is smaller than before', 'The angle of reflection is always equal to the angle of incidence'], [0, 1, 2],
    r`A and B define a smooth bounce. The kinetic energy drops when $e<1$, so the speed is smaller (C). The angle of reflection equals the angle of incidence only for $e = 1$ (D false).`),
  msq(5, 'impulse', r`Which statements about impulse are correct?`,
    ['Impulse is the area under a force-time graph', 'Impulse is a vector', 'Average force = impulse/contact time', 'Impulse equals the change in kinetic energy'], [0, 1, 2],
    r`$\vec J = \int\vec F\,dt = \Delta\vec p$, a vector (A, B). $F_{avg} = J/\Delta t$ (C). Impulse is the change in <i>momentum</i>, not kinetic energy (D false).`),
  msq(5, 'centre of mass', r`Which statements about the centre of mass of two particles are correct?`,
    ['It lies on the line joining them', 'It is nearer to the heavier particle', 'It can lie at a point where there is no mass', 'If the particles repel each other, the centre of mass accelerates away'], [0, 1, 2],
    r`$\vec r_{cm}$ is a weighted average on the line joining them, nearer the heavier (A, B), and in between the particles, in empty space (C). Internal forces do not accelerate the centre of mass (D false).`),
  nat(5, 'collisions', r`A heavy block of mass $M = 100\,m$ moves towards a small block of mass $m$ that lies between it and a wall. All collisions are elastic and the blocks and wall are on a frictionless line. How many collisions occur in all (block-block and block-wall)?`, 31, 0,
    r`In the plane of $(\sqrt M\,v_M,\ \sqrt m\,v_m)$ each collision is a reflection and the speeds' point turns through the angle $2\theta$, where $\tan\theta = \sqrt{m/M} = 0.1$. The collisions continue while the total turn $n\cdot2\theta$ is less than $2\pi$; the count is $\lceil\pi/\theta\rceil - 1$ with $\theta = \tan^{-1}0.1 = 0.0997$ rad. $\pi/\theta = 31.5$, so 31. (A direct simulation gives the same: 31 collisions.)`, { calc: () => Math.ceil(Math.PI / Math.atan(0.1)) - 1, trap: 'Equal masses give 3 collisions; each factor of 100 in mass ratio gives about 10 times more.' }),
  nat(5, 'collisions', r`The same set-up as before, but now the heavy block is $M = 16m$. How many collisions occur in all?`, 12, 0,
    r`$\tan\theta = \sqrt{m/M} = \tfrac14$, $\theta = 0.245$ rad, $\pi/\theta = 12.8$, so the number of collisions is $\lceil12.8\rceil - 1 = 12$.`, { calc: () => Math.ceil(Math.PI / Math.atan(0.25)) - 1 }),
  nat(5, 'collisions in two dimensions', r`A ball of mass $2m$ moving at speed $u$ hits a stationary ball of mass $m$ in an elastic but <b>not head-on</b> collision. What is the largest angle (in degrees) by which the incident ball can be deflected from its original direction?`, 30, 0.1,
    r`For $m_1>m_2$ the largest deflection of the incident ball satisfies $\sin\theta_{max} = m_2/m_1 = \tfrac12$, so $\theta_{max} = 30^\circ$. (If the incident ball were lighter, it could even rebound.)`, { unit: '°', calc: () => Math.asin(0.5) * 180 / Math.PI, trap: 'For equal masses the balls separate at $90^\circ$; a heavier incident ball is never deflected by more than $\\sin^{-1}(m_2/m_1)$.' }),
  pas(5, 'collisions', 'p4', r`Find the distance along the incline between the first and second impacts, in m (1 decimal).`, 5, 0.05, 1,
    r`Use axes along and perpendicular to the incline. The impact speed is 5 $\mathrm{m\,s^{-1}}$, so its components are: perpendicular $5\cos30^\circ = 4.33$ (reversed by the elastic bounce) and along the slope $5\sin30^\circ = 2.5$ (unchanged). The acceleration components are $g\cos30^\circ = 8.66$ perpendicular and $g\sin30^\circ = 5$ along the slope. Time of flight $= 2(4.33)/8.66 = 1$ s. Distance along the slope $= 2.5(1) + \tfrac12(5)(1)^2 = 5.0$ m. (General result: $8h\sin\theta = 8\times1.25\times0.5 = 5$ m.)`, { unit: 'm' }),
  nat(5, 'centre of mass of shapes', r`A uniform disc of radius $R$ has a circular hole of radius $R/3$ whose centre is $2R/3$ from the centre of the disc. For $R = 36$ cm, find the distance of the centre of mass of the remaining plate from the centre of the disc in cm.`, 3, 0,
    r`The hole has $(1/3)^2 = \tfrac19$ of the disc's mass. $\bar x = \dfrac{-\tfrac M9\times\tfrac{2R}{3}}{M - \tfrac M9} = -\dfrac{2R/27}{8/9} = -\dfrac{R}{12}$. For $R = 36$ cm the shift is 3 cm, away from the hole.`, { unit: 'cm', calc: () => 36 / 12 }),
  mat(5, 'centre of mass of shapes', 'm10', r`In each case a uniform body of radius $R$ has a cavity (hole) whose centre lies on a radius. Match each case with the distance by which the centre of mass of the remainder is shifted from the centre of the body.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Shift $=\dfrac{m_hd}{M-m_h}$. A: disc, hole radius $R/2$ at $R/2$: mass fraction $\tfrac14$, shift $\dfrac{\tfrac14\cdot\tfrac R2}{\tfrac34} = \dfrac R6$ (p). B: sphere, cavity $R/2$ at $R/2$: fraction $\tfrac18$, shift $\dfrac{\tfrac18\cdot\tfrac R2}{\tfrac78} = \dfrac R{14}$ (q). C: disc, hole $R/3$ at $2R/3$: fraction $\tfrac19$, shift $\dfrac{\tfrac19\cdot\tfrac{2R}3}{\tfrac89} = \dfrac R{12}$ (r). D: sphere, cavity $R/3$ at $2R/3$: fraction $\tfrac1{27}$, shift $\dfrac{\tfrac1{27}\cdot\tfrac{2R}3}{\tfrac{26}{27}} = \dfrac R{39}$ (s). So A-p, B-q, C-r, D-s.`),
  asrt(5, 'collisions', r`If a heavy block moving towards a light block placed between it and a wall (all collisions elastic) has 100 times the mass of the light one, the total number of collisions is 31.`, r`Each collision is a reflection in the plane of $(\sqrt M v_M,\sqrt m v_m)$, so the angle swept is a multiple of $2\tan^{-1}\sqrt{m/M}$.`, 0,
    r`Both true and R explains A: the number of collisions is the largest $n$ for which the rotation fits within the allowed angle, which gives $\lceil\pi/\tan^{-1}(0.1)\rceil - 1 = 31$.`),
  stm(5, 'collisions', r`After a perfectly inelastic head-on collision the two bodies are always at rest.`, r`After a perfectly inelastic collision the relative speed of the two bodies is zero.`, 3,
    r`II is true: $e = 0$ means the speed of separation is zero (the bodies move together). I is false: they move with the velocity of the centre of mass, which is zero only if the total momentum was zero.`),
  nat(4, 'impulse', r`A machine gun fires 600 bullets per minute, each of mass 25 g, at $400\ \mathrm{m\,s^{-1}}$. Find the average force needed to hold the gun in place in N.`, 100, 0,
    r`Bullets per second $= 10$. Momentum given to the bullets per second $= 10\times0.025\times400 = 100\ \mathrm{N}$. The gun must be held with this average force.`, { unit: 'N', calc: () => 10 * 0.025 * 400 }),
  nat(4, 'variable mass', r`Sand falls vertically at $4\ \mathrm{kg\,s^{-1}}$ on to a horizontal conveyor belt moving at a steady $3\ \mathrm{m\,s^{-1}}$. Find the power the motor must supply to keep the belt moving at this speed, in W.`, 36, 0,
    r`The sand must be brought from 0 to $3\ \mathrm{m\,s^{-1}}$: force $F = v\,dm/dt = 3\times4 = 12$ N. Power $= Fv = 12\times3 = 36$ W. (Only half of this, 18 W, appears as kinetic energy of the sand; the other half is heat from slipping.)`, { unit: 'W', calc: () => 3 * 4 * 3, trap: 'Half the power is dissipated as heat; it is not just $\\tfrac12v^2\\,dm/dt$.' }),
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
  // ---- added 2026-11-22 ----
  { id: 'cm-g18', type: 'nat', level: 3, exams: EX[3], sub: 'centre of mass of shapes',
    make(rng) {
      const a = int(rng, 3, 12), b = int(rng, 3, 12), x3 = int(rng, 0, 4), y3 = int(rng, 0, 4);
      const verts = [[0, 0], [a, 0], [x3, b]];
      const cx = verts.reduce((s, v) => s + v[0], 0) / 3, cy = verts.reduce((s, v) => s + v[1], 0) / 3;
      const d = Math.hypot(cx, cy); const [ans, tol] = tl(d);
      return { a, b, x3, verts, answer: ans, tol, unit: 'cm',
        q: `A thin uniform triangular plate has its vertices at $(0,0)$, $(${a},0)$ and $(${x3},${b})$ (in cm). Find the distance of its centre of mass from the origin in cm (3 significant figures).`,
        sol: `The centre of mass is the centroid, the mean of the vertices: $\\bar x = (0+${a}+${x3})/3 = ${fmt(cx, 4)}$ and $\\bar y = (0+0+${b})/3 = ${fmt(cy, 4)}$. Distance $= \\sqrt{\\bar x^2 + \\bar y^2} = ${fmt(d, 4)}$ cm.` };
    },
    verify: (p) => { const m = [1, 1, 1]; const x = p.verts.reduce((s, v, i) => s + m[i] * v[0], 0) / 3, y = p.verts.reduce((s, v, i) => s + m[i] * v[1], 0) / 3; return Math.hypot(x, y); } },
  { id: 'cm-g19', type: 'nat', level: 4, exams: EX[4], sub: 'collisions',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3]), m2 = choose(rng, [2, 3, 4, 6]), u = choose(rng, [3, 4, 5, 6]), k = choose(rng, [100, 200, 300, 500]);
      const mu = m1 * m2 / (m1 + m2), x = u * Math.sqrt(mu / k);
      return { m1, m2, u, k, answer: +x.toFixed(4), tol: Math.max(0.002, x * 0.01), unit: 'm',
        q: `A ${m1} kg block moving at ${u} m/s hits a light spring (constant ${k} N/m) fixed to the near face of a ${m2} kg block at rest on a smooth table. Find the maximum compression of the spring in m (3 decimals).`,
        sol: `At the maximum compression the blocks have a common velocity $V = ${m1}\\times${u}/${m1 + m2} = ${fmt(m1 * u / (m1 + m2), 4)}$ m/s. Energy lost from kinetic energy $=\\tfrac12\\mu u^2$ with $\\mu = ${fmt(mu, 4)}$ kg: $${fmt(0.5 * mu * u * u, 5)}$ J $=\\tfrac12(${k})x^2$, so $x = ${fmt(x, 4)}$ m.`,
        trap: 'The kinetic energy does not all go into the spring: the blocks still move together.' };
    },
    verify: (p) => { const V = p.m1 * p.u / (p.m1 + p.m2); const E = 0.5 * p.m1 * p.u ** 2 - 0.5 * (p.m1 + p.m2) * V * V; return Math.sqrt(2 * E / p.k); } },
  { id: 'cm-g20', type: 'nat', level: 4, exams: EX[4], sub: 'inelastic collision',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3, 4]), m2 = choose(rng, [2, 3, 5, 6]), u1 = choose(rng, [3, 4, 5, 6]), u2 = choose(rng, [1, 2, 3]);
      const V = (m1 * u1 - m2 * u2) / (m1 + m2), lost = 0.5 * m1 * u1 ** 2 + 0.5 * m2 * u2 ** 2 - 0.5 * (m1 + m2) * V * V;
      return { m1, m2, u1, u2, answer: +lost.toFixed(3), tol: Math.max(0.01, lost * 0.005), unit: 'J',
        q: `A ${m1} kg block moving at ${u1} m/s and a ${m2} kg block moving at ${u2} m/s in the opposite direction collide head-on and stick together. Find the kinetic energy lost in J.`,
        sol: `Common velocity $V = (${m1}\\times${u1} - ${m2}\\times${u2})/${m1 + m2} = ${fmt(V, 4)}$ m/s. $K_i = ${fmt(0.5 * m1 * u1 ** 2 + 0.5 * m2 * u2 ** 2, 5)}$ J, $K_f = ${fmt(0.5 * (m1 + m2) * V * V, 5)}$ J. Lost $= ${fmt(lost, 5)}$ J. (Check: $\\tfrac12\\mu v_{rel}^2 = \\tfrac12(${fmt(m1 * m2 / (m1 + m2), 4)})(${u1 + u2})^2$.)`,
        trap: 'The relative speed is the sum of the speeds when they approach each other.' };
    },
    verify: (p) => 0.5 * (p.m1 * p.m2 / (p.m1 + p.m2)) * (p.u1 + p.u2) ** 2 },
  { id: 'cm-g21', type: 'nat', level: 5, exams: EX[5], sub: 'collisions',
    make(rng) {
      const h = choose(rng, [0.8, 1.25, 1.8, 3.2, 5]), th = choose(rng, [20, 25, 30, 37, 45]);
      const T = th * Math.PI / 180, s = 8 * h * Math.sin(T);
      return { h, th, answer: +s.toFixed(3), tol: Math.max(0.02, s * 0.01), unit: 'm',
        q: `A ball is dropped from a height of ${h} m above a point on a smooth plane inclined at $${th}^\\circ$ to the horizontal. The collision is perfectly elastic. Find the distance along the incline between the first and second impacts in m (2 decimals). Take $g = 10\\ \\mathrm{m\\,s^{-2}}$.`,
        sol: `Impact speed $v = \\sqrt{2gh} = ${fmt(Math.sqrt(20 * h), 4)}$ m/s, directed vertically downward. Resolve along the incline and perpendicular to it. Along the incline the speed component is $v\\sin\\theta$; perpendicular it is $v\\cos\\theta$ (reversed by the bounce). Time of flight $=2v\\cos\\theta/(g\\cos\\theta) = 2v/g = ${fmt(2 * Math.sqrt(20 * h) / 10, 4)}$ s. Distance $= v\\sin\\theta\\,t + \\tfrac12g\\sin\\theta\\,t^2 = 8h\\sin\\theta = ${fmt(s, 4)}$ m.`,
        trap: 'The time of flight does not depend on the incline angle.' };
    },
    verify: (p) => { const T = p.th * Math.PI / 180, v = Math.sqrt(20 * p.h); const vp = v * Math.cos(T), vs = v * Math.sin(T), gp = 10 * Math.cos(T), gs = 10 * Math.sin(T); const t = 2 * vp / gp; return vs * t + 0.5 * gs * t * t; } },
  { id: 'cm-g22', type: 'mcq', level: 3, exams: EX[3], sub: 'centre of mass of shapes',
    make(rng) {
      const shapes = [['a uniform solid hemisphere', 'from the centre of its flat face', (R) => 3 * R / 8], ['a thin hemispherical shell', 'from the centre of its flat face', (R) => R / 2], ['a uniform semicircular wire', 'from its diameter', (R) => 2 * R / Math.PI], ['a uniform semicircular plate', 'from its straight edge', (R) => 4 * R / (3 * Math.PI)]];
      const i = int(rng, 0, 3), R = choose(rng, [10, 12, 16, 20, 24, 30]);
      const f = (v) => `${fmt(v, 3)} cm`;
      const wrongs = shapes.filter((_, j) => j !== i).map((s) => f(s[2](R)));
      const { options, answer } = shuffleOpts(rng, f(shapes[i][2](R)), wrongs);
      return { i, R, options, answer, shapes, f,
        q: `Find the distance of the centre of mass of ${shapes[i][0]} of radius ${R} cm ${shapes[i][1]}.`,
        sol: `Standard result: ${['$3R/8$', '$R/2$', '$2R/\\pi$', '$4R/3\\pi$'][i]}. With $R = ${R}$ cm this is ${f(shapes[i][2](R))}. The other options are the distances for the other three shapes.`,
        trap: 'Solid hemisphere $3R/8$, shell $R/2$, wire $2R/\\pi$, plate $4R/3\\pi$: easy to swap.' };
    },
    verify: (p) => p.options.indexOf(p.f(p.shapes[p.i][2](p.R))) },
  { id: 'cm-g23', type: 'nat', level: 4, exams: EX[4], sub: 'collisions',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3, 4]), m2 = choose(rng, [1, 2, 3, 5, 6]), k = choose(rng, [100, 200, 300, 400, 600]);
      const w = Math.sqrt(k * (1 / m1 + 1 / m2));
      return { m1, m2, k, answer: +w.toFixed(3), tol: Math.max(0.02, w * 0.005), unit: 'rad/s',
        q: `Two blocks of mass ${m1} kg and ${m2} kg are joined by a light spring of constant ${k} N/m and lie on a smooth table. Find the angular frequency of their relative oscillation in rad/s (1 decimal).`,
        sol: `Each block satisfies $m_ia_i = \\mp kx$, where $x$ is the extension. The extension changes as $\\ddot x = -k(1/m_1 + 1/m_2)x$, so $\\omega^2 = k/\\mu$ with $\\mu = ${fmt(m1 * m2 / (m1 + m2), 4)}$ kg. $\\omega = \\sqrt{${k}/${fmt(m1 * m2 / (m1 + m2), 4)}} = ${fmt(w, 4)}$ rad/s.`,
        trap: 'The motion is governed by the reduced mass.' };
    },
    verify: (p) => Math.sqrt(p.k / (p.m1 * p.m2 / (p.m1 + p.m2))) },
  { id: 'cm-g24', type: 'nat', level: 5, exams: EX[5], sub: 'collisions',
    make(rng) {
      const r = choose(rng, [1, 4, 9, 16, 25, 100]);
      let vM = -1, vm = 0, n = 0; const M = r, m = 1;
      for (let it = 0; it < 100000; it++) {
        if (vm > vM) { const v1 = ((m - M) * vm + 2 * M * vM) / (m + M), v2 = ((M - m) * vM + 2 * m * vm) / (m + M); vm = v1; vM = v2; n++; continue; }
        if (vm < 0) { vm = -vm; n++; continue; }
        break;
      }
      return { r, answer: n, tol: 0,
        q: `A block of mass $M = ${r}m$ moves towards a block of mass $m$ that lies between it and a wall. All collisions (block-block and block-wall) are perfectly elastic and the motion is along a frictionless line. How many collisions occur in all?`,
        sol: `Use the variables $x = \\sqrt{M}\\,v_M$ and $y = \\sqrt{m}\\,v_m$. Each collision of the two blocks is a reflection in the $(x,y)$ plane, each wall bounce is a reflection of $y\\to-y$, and together the pair turns the point by $2\\theta$ with $\\tan\\theta = \\sqrt{m/M} = ${fmt(1 / Math.sqrt(r), 4)}$. Collisions continue while the total turn fits within $\\pi$, giving $\\lceil\\pi/\\theta\\rceil - 1 = ${n}$.`,
        trap: 'Heavier blocks give more collisions: ratio 100 gives 31, and each factor of 100 gives about 10 times more.' };
    },
    verify: (p) => Math.ceil(Math.PI / Math.atan(Math.sqrt(1 / p.r))) - 1 },
  { id: 'cm-g25', type: 'nat', level: 3, exams: EX[3], sub: 'motion of centre of mass',
    make(rng) {
      const M = choose(rng, [40, 50, 60, 80, 100]), m = choose(rng, [1, 2, 4, 5]), v = choose(rng, [5, 8, 10, 12, 15]);
      const V = m * v / M;
      return { M, m, v, answer: +V.toFixed(4), tol: Math.max(0.002, V * 0.01), unit: 'm/s',
        q: `A skater of mass ${M} kg stands on frictionless ice and throws a ${m} kg ball horizontally at ${v} m/s relative to the ice. Find his recoil speed in m/s (3 decimals).`,
        sol: `Total momentum stays zero: $${m}\\times${v} = ${M}V$, so $V = ${fmt(m * v, 4)}/${M} = ${fmt(V, 4)}$ m/s, in the opposite direction.` };
    },
    verify: (p) => (p.m * p.v) / p.M },
  { id: 'cm-g26', type: 'mcq', level: 3, exams: EX[3], sub: 'elastic collision',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3, 4]), m2 = choose(rng, [1, 2, 3, 6]), u = choose(rng, [4, 6, 8, 10]);
      const v1 = (m1 - m2) / (m1 + m2) * u;
      const f = (v) => `${fmt(v, 3)} m/s`;
      const cand = [(m1 - m2) / (m1 + m2) * u, -(m1 - m2) / (m1 + m2) * u, 2 * m1 / (m1 + m2) * u, u, m1 / (m1 + m2) * u, (m2 - m1) / (m1 + m2) * u * 2].map(f);
      const wr = []; for (const c of cand.slice(1)) if (c !== f(v1) && !wr.includes(c)) wr.push(c);
      const extra = [f(v1 + 1), f(v1 - 1.5), f(v1 + 2.5)]; for (const e of extra) if (wr.length < 3 && e !== f(v1) && !wr.includes(e)) wr.push(e);
      const { options, answer } = shuffleOpts(rng, f(v1), wr.slice(0, 3));
      return { m1, m2, u, options, answer, f,
        q: `A ${m1} kg ball moving at ${u} m/s hits a stationary ${m2} kg ball head-on in a perfectly elastic collision. The velocity of the first ball just afterwards (taking its original direction as positive) is`,
        sol: `$v_1 = \\dfrac{m_1-m_2}{m_1+m_2}u = \\dfrac{${m1}-${m2}}{${m1 + m2}}\\times${u} = ${fmt(v1, 4)}$ m/s. ${v1 < 0 ? 'It is negative, so the first ball rebounds.' : v1 === 0 ? 'It stops.' : 'It keeps moving forward.'}`, trap: 'Check the sign: a lighter ball hitting a heavier one rebounds.' };
    },
    verify: (p) => { const m1 = p.m1, m2 = p.m2, u = p.u; const vcm = m1 * u / (m1 + m2); const v1 = 2 * vcm - u; return p.options.indexOf(p.f(v1)); } },
  { id: 'cm-g27', type: 'nat', level: 4, exams: EX[4], sub: 'variable mass',
    make(rng) {
      const u = choose(rng, [1500, 2000, 2500, 3000]), ratio = choose(rng, [2, 3, 4, 5, 10]);
      const dv = u * Math.log(ratio);
      return { u, ratio, answer: +dv.toFixed(2), tol: Math.max(1, dv * 0.003), unit: 'm/s',
        q: `A rocket in free space ejects gas at ${u} m/s relative to itself. It starts from rest and burns fuel until its mass is ${ratio === 2 ? 'half' : `1/${ratio}`} of the initial mass. Find its final speed in m/s (nearest whole number).`,
        sol: `$\\Delta v = u\\ln(m_0/m) = ${u}\\times\\ln${ratio} = ${u}\\times${fmt(Math.log(ratio), 4)} = ${fmt(dv, 5)}$ m/s.`, trap: 'The result is logarithmic: doubling the fuel does not double the speed.' };
    },
    verify: (p) => { let v = 0; const n = 100000, m0 = 1, m1 = 1 / p.ratio; for (let i = 0; i < n; i++) { const m = m0 + (m1 - m0) * (i + 0.5) / n; v += p.u * (m0 - m1) / n / m; } return v; } },
];


// ================= Level 5 round (top-rank additions, ids <prefix>-v5NN / -v5gN) =================
const v5 = (o) => ({ level: 5, exams: ['jee-adv'], ...o });
const v5s = (id, sub, q, correct, wrongs, pos, sol, trap) => { const options = [...wrongs]; options.splice(pos, 0, correct); return v5({ id, type: 'mcq', format: 'single', sub, q, options, answer: pos, sol, trap }); };
const v5n = (id, sub, q, val, dp, tol, unit, sol, trap) => { const answer = +val.toFixed(dp); return v5({ id, type: 'nat', format: tol === 0 ? 'integer' : 'numeric', sub, q, answer, tol, unit, calc: () => answer, sol, trap }); };
const v5m = (id, sub, q, options, answer, sol, trap) => v5({ id, type: 'msq', format: 'multi', sub, q, options, answer, sol, trap });
const v5a = (id, sub, A, R, answer, sol, trap) => v5({ id, type: 'mcq', format: 'assertion', sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, trap });
const v5t = (id, sub, I, II, answer, sol, trap) => v5({ id, type: 'mcq', format: 'statements', sub, q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, trap });
const v5mat = (id, sub, group, q, correct, wrongs, pos, sol, trap) => { const options = [...wrongs]; options.splice(pos, 0, correct); return v5({ id, type: 'mcq', format: 'match', sub, group, q, options, answer: pos, sol, trap }); };
const v5p = (id, sub, group, q, val, dp, tol, unit, sol, trap) => { const answer = +val.toFixed(dp); return v5({ id, type: 'nat', format: 'passage', sub, group, q, answer, tol, unit, calc: () => answer, sol, trap }); };
const v5S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const v5groups = {
  v5m1: { title: 'Variable mass and bouncing: dimensionless numbers',
    list1: ['A. A rocket in free space burns until its mass is $1/e$ of its initial mass: (speed gained) / (exhaust speed)', 'B. A conveyor belt at constant speed receives falling sand: (motor power) / (rate of increase of the sand\'s kinetic energy)', 'C. A chain falls from rest onto a table: (force on the table) / (weight of the part already on the table)', 'D. A ball bounces with $e = 1/2$: (height of the 2nd rebound) / (height of the 1st rebound)'],
    list2: ['p. 3', 'q. 2', 'r. 1', 's. 1/4', 't. 4'] },
  v5m2: { title: 'A ball dropped on the floor, coefficient of restitution $e$',
    list1: ['A. Ratio of successive rebound heights', 'B. Ratio of successive times between bounces', 'C. Fraction of kinetic energy lost at each bounce', 'D. Total distance travelled until it stops, divided by the drop height $h$'],
    list2: [r`p. $e$`, r`q. $e^2$`, r`r. $1 - e^2$`, r`s. $\dfrac{1+e^2}{1-e^2}$`, r`t. $\dfrac{1+e}{1-e}$`] },
  v5p1: { title: 'A block, a block and a wall',
    passage: r`<p>On a smooth horizontal track, block A (1.0 kg) moving at $12\ \mathrm{m\,s^{-1}}$ to the right hits block B (2.0 kg), which is at rest at $x = 0$. A fixed vertical wall stands at $x = 8.0$ m, to the right of B. All collisions (A with B, B with the wall) are perfectly elastic. Take the first A-B collision at $x = 0$ and $t = 0$.</p>` },
};

const v5items = [];
{
  const e0 = Math.E;
  // 01: chain on table
  v5items.push(v5m('cm-v501', 'variable mass', r`A uniform chain of mass $M$ and length $L$ hangs vertically with its lower end just touching a table. It is released from rest and the links that reach the table stay at rest there. Which statements are correct?`, [
    r`When length $x$ has landed, the force from the table is $3(Mx/L)g$, three times the weight of the part already on the table`,
    r`The greatest force from the table is $3Mg$, just before the last link lands`,
    r`The total mechanical energy dissipated in the whole process is $MgL/4$`,
    r`The part of the chain still in the air falls with constant speed`,
  ], [0, 1],
  r`Idea: the part still in the air is in free fall (nothing pulls on it, it is slack), so when length $x$ has landed its speed is $v = \sqrt{2gx}$. The table must support the weight of the landed part and stop the momentum arriving at rate $\lambda v^2$.<br>$N = \lambda gx + \lambda v^2 = \lambda gx + 2\lambda gx = 3\lambda gx = 3(Mx/L)g$ (option 1 true). At $x \to L$ this is $3Mg$ (option 2 true).<br>Energy: the centre of mass drops by $L/2$, so $MgL/2$ of potential energy is lost and finally all of it is dissipated, not $MgL/4$ (option 3 false). The falling part speeds up with $g$ (option 4 false).<br>Answer: 1 and 2.`,
  r`Besides its own weight the table feels the momentum flow $\lambda v^2$, which is twice the weight of the landed part.`));
  // 02: three-ball chain statements
  v5items.push(v5m('cm-v502', 'collisions', r`Balls of masses $m_1$, $m_2$, $m_3$ lie in that order on a smooth straight track. $m_1$ moves with speed $u$ and hits $m_2$ elastically head-on; $m_2$ then hits $m_3$, also elastically. Only these two collisions matter. Which statements are correct?`, [
    r`For fixed $m_1$ and $m_3$, the final speed of $m_3$ is greatest when $m_2 = \sqrt{m_1m_3}$`,
    r`When $m_2 = \sqrt{m_1m_3}$ the final speed of $m_3$ is $\dfrac{4m_1}{(\sqrt{m_1}+\sqrt{m_3})^2}\,u$`,
    r`The final speed of $m_3$ can never exceed $2u$, whatever the masses`,
    r`When $m_2 = \sqrt{m_1m_3}$ the ball $m_2$ is always left at rest after the second collision`,
  ], [0, 1],
  r`Idea: elastic head-on, target at rest: $v_2 = \dfrac{2m_1}{m_1+m_2}u$, then $v_3 = \dfrac{2m_2}{m_2+m_3}v_2$, so $v_3 = \dfrac{4m_1m_2}{(m_1+m_2)(m_2+m_3)}u$.<br>Option 1: maximise over $m_2$: the denominator $(m_1+m_2)(m_2+m_3)/m_2 = m_1+m_3+m_2+m_1m_3/m_2$ is least when $m_2 = \sqrt{m_1m_3}$ (AM-GM). True.<br>Option 2: substituting gives $v_3 = \dfrac{4m_1}{(\sqrt{m_1}+\sqrt{m_3})^2}u$. True.<br>Option 3 is false: with $m_1 = 16m_3$ it gives $v_3 = \dfrac{4\times16}{(4+1)^2}u = 2.56u$, and as $m_3/m_1 \to 0$ it tends to $4u$.<br>Option 4 is false: after the second collision $m_2$ has speed $\dfrac{m_2-m_3}{m_2+m_3}v_2$, which is zero only if $m_2 = m_3$ (that is, $m_1 = m_2 = m_3$).<br>Answer: 1 and 2.`,
  r`A light target can be hit faster by a chain of two collisions than by one, but the best middle mass is the geometric mean, not the arithmetic mean.`));
  // 03: oblique bounce with friction
  v5items.push(v5m('cm-v503', 'impulse', r`A small ball (treated as a particle, with no spin) hits a rough horizontal floor with velocity components $v_x$ along the floor and $v_y$ towards it. The coefficient of restitution is $e$ and the coefficient of friction is $\mu$; the friction impulse is $\mu$ times the normal impulse while the ball slides. Which statements are correct?`, [
    r`The horizontal momentum of the ball is conserved because the floor's force on it is vertical`,
    r`The vertical component after the bounce is $ev_y$`,
    r`If $v_x > \mu(1+e)v_y$, the horizontal component decreases by exactly $\mu(1+e)v_y$`,
    r`If $v_x \le \mu(1+e)v_y$, the ball leaves with no horizontal velocity`,
  ], [1, 2, 3],
  r`Idea: the normal impulse $J_N = m(1+e)v_y$ reverses and reduces the vertical velocity, and the friction impulse $\mu J_N$ acts along the floor, opposite to the sliding.<br>Option 1 false: the floor also exerts friction along the floor, so $p_x$ changes.<br>Option 2 true: the normal component is multiplied by $-e$ (Newton's law of restitution).<br>Option 3 true: $\Delta v_x = -\mu J_N/m = -\mu(1+e)v_y$, as long as this is less than $v_x$.<br>Option 4 true: friction can only reduce the sliding speed to zero (a particle with no spin cannot reverse), so if $\mu(1+e)v_y \ge v_x$ the sliding stops and the ball leaves straight up.<br>Answer: 2, 3 and 4.`,
  r`Friction acts for the same short contact time as the normal force, so its impulse is $\mu$ times the normal impulse $m(1+e)v_y$, not $\mu m v_y$.`));
  // 04: three-ball integer
  v5items.push(v5n('cm-v504', 'collisions', r`Three balls of masses 1 kg, $m$ and 16 kg lie in that order along a smooth straight track. The 1 kg ball is shot at $50\ \mathrm{m\,s^{-1}}$ towards the middle ball, which then hits the 16 kg ball. All collisions are elastic. The mass $m$ is chosen to give the 16 kg ball the greatest possible speed. Find that speed in $\mathrm{m\,s^{-1}}$.`, (() => { const m1 = 1, m3 = 16, u = 50; const m2 = Math.sqrt(m1 * m3); const v2 = 2 * m1 / (m1 + m2) * u; return 2 * m2 / (m2 + m3) * v2; })(), 0, 0, 'm s<sup>-1</sup>',
  r`Idea: for elastic head-on hits on a stationary ball, $v_2 = \dfrac{2m_1}{m_1+m_2}u$ and $v_3 = \dfrac{2m_2}{m_2+m_3}v_2$. The product is greatest for $m = \sqrt{m_1m_3}$ (geometric mean).<br>$m = \sqrt{1\times16} = 4$ kg.<br>$v_2 = \dfrac{2\times1}{1+4}\times50 = 20\ \mathrm{m\,s^{-1}}$, then $v_3 = \dfrac{2\times4}{4+16}\times20 = 8\ \mathrm{m\,s^{-1}}$.<br>(After the first hit the 1 kg ball moves back at $30\ \mathrm{m\,s^{-1}}$ and the 4 kg ball rebounds at $12\ \mathrm{m\,s^{-1}}$, so there are no further collisions.) Direct hit on the 16 kg ball would give only $\dfrac{2}{17}\times50 = 5.9\ \mathrm{m\,s^{-1}}$.<br>Answer: 8.`,
  r`You must first find the best $m$ (4 kg): the arithmetic mean 8.5 kg gives a much smaller speed.`));
  // 05: rod struck, particle stops
  v5items.push(v5n('cm-v505', 'collisions', r`A particle of mass $m$ moving at speed $u$ strikes, at right angles and elastically, a free uniform rod of mass $M$ and length $L$ lying on a smooth horizontal table, at a point $L/4$ from the centre of the rod. The particle is brought completely to rest by the collision. Find $100M/m$.`, (() => { const f = 0.25; return 100 * (1 + 12 * f * f); })(), 0, 0, '',
  r`Idea: three conditions: linear momentum, angular momentum about the centre, and energy (elastic). Let the rod get $V$ and $\omega$, with $I = ML^2/12$ and $x = L/4$.<br>Momentum: $mu = MV$, so $V = mu/M$.<br>Angular momentum about the rod's centre: $mux = I\omega$, so $\omega = \dfrac{12mux}{ML^2}$.<br>Energy: $\tfrac12mu^2 = \tfrac12MV^2 + \tfrac12I\omega^2$. Substituting: $mu^2 = \dfrac{m^2u^2}{M} + \dfrac{12m^2u^2x^2}{ML^2}$, so $1 = \dfrac{m}{M}\left(1 + \dfrac{12x^2}{L^2}\right)$.<br>With $x = L/4$: $\dfrac{M}{m} = 1 + \dfrac{12}{16} = 1.75$, so $100M/m = 175$.<br>Answer: 175.`,
  r`Two conservation laws are not enough: the rod can rotate, so angular momentum and its energy $\tfrac12I\omega^2$ must be included.`));
  // 06: raindrop
  v5items.push(v5n('cm-v506', 'variable mass', r`A spherical raindrop starts from a negligible size and falls from rest through still mist. It sweeps up every droplet in the cylinder of mist in its path (the mist droplets are at rest, with uniform density $\rho_m$; the drop's own density is $\rho$). Ignore air drag and buoyancy. The drop's acceleration turns out to be constant and equal to $g/n$. Find $n$.`, 7, 0, 0, '',
  r`Idea: use $F = d(mv)/dt$ (the swept droplets arrive at rest), and find how the mass grows with distance fallen.<br>In falling a distance $dx$ the drop sweeps a volume $\pi r^2dx$ of mist: $dm = \rho_m\pi r^2dx$. Also $m = \tfrac43\pi r^3\rho$ gives $dm = 4\pi r^2\rho\,dr$. Equating: $dr = \dfrac{\rho_m}{4\rho}dx$, so $r \propto x$ and $m = kx^3$.<br>Equation of motion: $\dfrac{d(mv)}{dt} = mg$, so $v\dfrac{dm}{dt} + m\dfrac{dv}{dt} = mg$. With $\dfrac{dm}{dt} = 3kx^2v$: $3kx^2v^2 + kx^3a = kx^3g$, i.e. $\dfrac{3v^2}{x} + a = g$.<br>For constant $a$ from rest, $v^2 = 2ax$. Then $6a + a = g$, so $a = g/7$.<br>Answer: 7.`,
  r`If you forget that the mass grows as $x^3$ (radius grows with distance) and treat dm/dt as constant, you get nonsense; and $a = g$ would ignore the accretion.`));
  // 07: oblique bounce with friction
  v5items.push(v5n('cm-v507', 'impulse', r`A small ball hits a rough horizontal floor at $10\ \mathrm{m\,s^{-1}}$, making $37^\circ$ with the floor ($\sin37^\circ = 0.6$), so $v_x = 8$ and $v_y = 6\ \mathrm{m\,s^{-1}}$. The coefficient of restitution is $0.50$ and the coefficient of friction is $0.40$. Treat the ball as a particle (no spin) that slides throughout the contact. Find its speed just after the bounce, in $\mathrm{m\,s^{-1}}$ (2 decimals).`, (() => { const vx = 8 - 0.4 * 1.5 * 6, vy = 0.5 * 6; return Math.hypot(vx, vy); })(), 2, 0.02, 'm s<sup>-1</sup>',
  r`Idea: normal direction: $v_y' = ev_y = 0.50\times6 = 3\ \mathrm{m\,s^{-1}}$. The normal impulse is $J_N = m(1+e)v_y = 9m$.<br>Friction impulse $\mu J_N = 0.40\times9m = 3.6m$ along the floor, opposing the motion, so $v_x' = 8 - 3.6 = 4.4\ \mathrm{m\,s^{-1}}$ (still positive, so the ball slid all the time).<br>Speed $= \sqrt{4.4^2 + 3^2} = \sqrt{28.36} = 5.33\ \mathrm{m\,s^{-1}}$.<br>Answer: 5.33.`,
  r`Using $\mu mv_y$ for the friction impulse (instead of $\mu m(1+e)v_y$) gives 5.37 instead of 5.33, and ignoring friction gives 6.`));
  // 08: cart losing sand
  v5items.push(v5n('cm-v508', 'variable mass', r`A cart (cart and sand together 100 kg) is pulled from rest along smooth level ground by a constant horizontal force of 20 N. Sand leaks out through a hole in the floor at a steady 2.0 kg s$^{-1}$ and falls vertically, leaving the cart with the cart's own horizontal velocity. Find the speed of the cart after 25 s, in $\mathrm{m\,s^{-1}}$ (2 decimals).`, (20 / 2) * Math.log(100 / 50), 2, 0.02, 'm s<sup>-1</sup>',
  r`Idea: the leaking sand carries away exactly its share of the horizontal momentum ($dm\cdot v$), so it exerts no thrust: the cart obeys $M\dfrac{dv}{dt} = F$ with $M = M_0 - \mu t$ (not $d(Mv)/dt = F$).<br>$dv = \dfrac{F\,dt}{M_0 - \mu t}$, so $v = \dfrac{F}{\mu}\ln\dfrac{M_0}{M_0 - \mu t}$.<br>At 25 s: $M = 100 - 2\times25 = 50$ kg, so $v = \dfrac{20}{2}\ln2 = 10\times0.693 = 6.93\ \mathrm{m\,s^{-1}}$.<br>(Using $Mv = Ft$ wrongly would give $500/50 = 10\ \mathrm{m\,s^{-1}}$.)<br>Answer: 6.93.`,
  r`The sand leaves with the cart's velocity, so $d(Mv)/dt$ is not equal to the force; the correct law is $M\,dv/dt = F$.`));
  // 09: match variable mass
  v5items.push(v5mat('cm-v509', 'variable mass', 'v5m1', r`Match each situation in List I with the value of the stated ratio in List II.`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-t, B-q, C-p, D-s'], 2,
  r`A: rocket equation $v = u\ln(m_0/m) = u\ln e = u$, ratio 1 (r).<br>B: the motor must give the sand momentum at rate $F = v\,dm/dt$, so power $= Fv = v^2dm/dt$. The sand's kinetic energy grows at $\tfrac12v^2dm/dt$. Ratio 2 (q); the other half is lost in slipping.<br>C: from the chain problem, force on the table $= 3\lambda gx$ and the landed weight is $\lambda gx$: ratio 3 (p).<br>D: rebound heights go as $e^2$, so with $e = 1/2$ the ratio is $1/4$ (s).<br>Answer: A-r, B-q, C-p, D-s.`,
  r`Half of the motor's energy goes into the sand's kinetic energy, the rest is lost as heat: the ratio is 2, not 1.`));
  // 10: match bouncing ball
  v5items.push(v5mat('cm-v510', 'coefficient of restitution', 'v5m2', r`A ball is dropped from height $h$ onto a floor and bounces repeatedly with coefficient of restitution $e$ ($0 < e < 1$). Match each item in List I with its expression in List II.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-t', 'A-q, B-p, C-s, D-r'], 3,
  r`Idea: speeds after each bounce are multiplied by $e$.<br>A: height $\propto v^2$, so successive heights go as $e^2$ (q).<br>B: time of flight $\propto v$, so successive times go as $e$ (p).<br>C: kinetic energy $\propto v^2$: the fraction lost is $1 - e^2$ (r).<br>D: distance $= h + 2he^2 + 2he^4 + \cdots = h + \dfrac{2he^2}{1-e^2} = h\dfrac{1+e^2}{1-e^2}$ (s). (Option t, $(1+e)/(1-e)$, is the total time in units of the first fall time.)<br>Answer: A-q, B-p, C-r, D-s.`,
  r`Heights and distances use $e^2$, times use $e$: the total time has $(1+e)/(1-e)$ but the total distance has $(1+e^2)/(1-e^2)$.`));
  // 11-12: passage
  v5items.push(v5p('cm-v511', 'collisions', 'v5p1', r`Find the distance from the wall at which A and B collide for the second time, in m.`, (() => { const vA = (1 - 2) / 3 * 12, vB = 2 / 3 * 12; const tw = 8 / vB; const t = (8 + vB * tw) / (vB + vA); return 8 - vA * t; })(), 0, 0, 'm',
  r`Idea: use the elastic collision formulae, then follow positions.<br>First collision: $v_A = \dfrac{1-2}{1+2}\times12 = -4\ \mathrm{m\,s^{-1}}$ (A rebounds), $v_B = \dfrac{2\times1}{3}\times12 = +8\ \mathrm{m\,s^{-1}}$.<br>B reaches the wall at $t = 8/8 = 1$ s and rebounds with $-8\ \mathrm{m\,s^{-1}}$. At that moment A is at $x = -4$ m.<br>For $t > 1$: $x_B = 8 - 8(t-1)$, $x_A = -4t$. They meet when $16 - 8t = -4t$, so $t = 4$ s, at $x = -16$ m.<br>Distance from the wall: $8 - (-16) = 24$ m.<br>Answer: 24.`,
  r`The rebounding B moves at 8 against A's 4, so it catches A after 3 more seconds: measure the distance from the wall, not from the origin.`));
  v5items.push(v5p('cm-v512', 'collisions', 'v5p1', r`Find the speed of A just after the second A-B collision, in $\mathrm{m\,s^{-1}}$ (2 decimals).`, (() => { const mA = 1, mB = 2, vA = -4, vB = -8; return Math.abs(((mA - mB) * vA + 2 * mB * vB) / (mA + mB)); })(), 2, 0.02, 'm s<sup>-1</sup>',
  r`Just before the second collision both blocks move left: A at $-4$ and B (behind it, faster) at $-8\ \mathrm{m\,s^{-1}}$.<br>For an elastic collision, $v_A' = \dfrac{(m_A - m_B)v_A + 2m_Bv_B}{m_A + m_B} = \dfrac{(1-2)(-4) + 2\times2\times(-8)}{3} = \dfrac{4 - 32}{3} = -9.33\ \mathrm{m\,s^{-1}}$.<br>(And $v_B' = \dfrac{(2-1)(-8) + 2\times1\times(-4)}{3} = -5.33$; A now moves away faster, so there is no third collision.)<br>Speed of A $= 9.33\ \mathrm{m\,s^{-1}}$.<br>Answer: 9.33.`,
  r`Use the velocities just before the second collision ($-4$ and $-8$), not the original 12 and 0.`));
  // 13: assertion
  v5items.push(v5a('cm-v513', 'variable mass', r`A cart moving freely on smooth horizontal ground keeps a constant speed while sand leaks vertically out of a hole in its floor, although the cart's mass is decreasing.`, r`The sand leaves with the same horizontal velocity as the cart, so it exerts no horizontal force (no thrust) on the cart.`, 0,
  r`Idea: a thrust term appears in the equation of motion only when the matter that leaves has a velocity relative to the body.<br>Here the relative horizontal velocity of the escaping sand is zero, so there is no thrust and no external horizontal force: $M\dfrac{dv}{dt} = 0$, so $v$ is constant. A is true.<br>R states exactly this reason. Answer: Both true and R explains A.`,
  r`The cart's momentum falls (mass falls at constant speed) but momentum is not conserved for the cart alone: the sand takes its share away.`));
  // 14: statements
  v5items.push(v5t('cm-v514', 'coefficient of restitution', r`In a collision between two bodies the loss of kinetic energy has the same value in every inertial frame.`, r`The kinetic energy of the two bodies in the centre-of-mass frame is the same before and after a collision.`, 2,
  r`Idea: the loss is $\Delta K = \tfrac12\mu v_{rel}^2(1 - e^2)$, with $\mu$ the reduced mass and $v_{rel}$ the relative speed before the collision. Both $\mu$ and $v_{rel}$ are the same in every inertial frame, so the loss is frame independent: Statement I is true.<br>The kinetic energy in the centre-of-mass frame is $\tfrac12\mu v_{rel}^2$ before the collision and $\tfrac12\mu e^2v_{rel}^2$ after it, so it changes unless $e = 1$: Statement II is false. (That is the part of the energy that can be lost; the kinetic energy of the centre of mass is never changed.)<br>Answer: Statement I true, Statement II false.`,
  r`Total kinetic energy depends on the frame, but its loss does not.`));
  // 15: single, Atwood and balance
  v5items.push(v5s('cm-v515', 'motion of centre of mass', r`Masses of 3 kg and 1 kg hang from the two ends of a light string passing over a smooth light pulley, which is hung from a spring balance fixed to the ceiling. The masses are released and move freely. The balance reads (in kg, taking its reading as force divided by $g$)`, '3 kg', ['4 kg', '2 kg', '1.5 kg'], 1,
  r`Idea: apply Newton's second law to the centre of mass of the two masses.<br>The accelerations are $a = \dfrac{(3-1)g}{4} = g/2$, with 3 kg going down and 1 kg going up. The centre-of-mass acceleration is $a_{cm} = \dfrac{3(g/2) - 1(g/2)}{4} = \dfrac{g}{4}$ downward.<br>Take the two masses, the string and the light pulley as one system: the only external forces are gravity $4g$ (down) and the balance's pull $S$ (up). So $4g - S = 4a_{cm} = g$, giving $S = 3g$.<br>Check with the tension: $T = \dfrac{2m_1m_2}{m_1+m_2}g = 1.5g$, and the pulley carries $2T = 3g$. The balance reads 3 kg.<br>Answer: 3 kg.`,
  r`The balance does not read the total weight (4 kg) because the heavier mass is accelerating downward.`));
}

const v5gens = [
  { id: 'cm-v5g1', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'collisions',
    make(rng) {
      const m1 = choose(rng, [1, 2, 3, 4]), k = choose(rng, [2, 3, 4]), u = choose(rng, [20, 30, 40, 50, 60]);
      const m2 = m1 * k, m3 = m1 * k * k;
      const v3 = 4 * u / (1 + k) ** 2;
      return { m1, m2, m3, k, u, v3, answer: +v3.toFixed(2), tol: 0.02, unit: 'm/s',
        q: `Balls of masses ${m1} kg, $m$ and ${m3} kg lie in that order on a smooth straight track. The ${m1} kg ball is shot at ${u} m/s towards the middle ball, which then hits the ${m3} kg ball; all collisions are elastic. $m$ is chosen to give the ${m3} kg ball the greatest possible speed. Find that speed in m/s (2 decimals).`,
        sol: `The best middle mass is the geometric mean $m = \\sqrt{${m1}\\times${m3}} = ${m2}$ kg. Then $v_2 = \\dfrac{2\\times${m1}}{${m1}+${m2}}\\times${u} = ${v5S(2 * m1 / (m1 + m2) * u, 4)}$ m/s and $v_3 = \\dfrac{2\\times${m2}}{${m2}+${m3}}\\times v_2 = ${v5S(v3, 4)}$ m/s.`,
        trap: 'The best middle mass is the geometric mean, not the arithmetic mean.' };
    },
    verify: (p) => { let best = 0; for (let m = 0.05; m < 200; m += 0.05) { const v2 = 2 * p.m1 / (p.m1 + m) * p.u; const v3 = 2 * m / (m + p.m3) * v2; if (v3 > best) best = v3; } return best; } },
  { id: 'cm-v5g2', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'collisions',
    make(rng) {
      const f = choose(rng, [0.1, 0.2, 0.25, 0.3, 0.4]);
      const ans = 100 * (1 + 12 * f * f);
      return { f, answer: Math.round(ans), tol: 0,
        q: `A particle of mass $m$ strikes, at right angles and elastically, a free uniform rod of mass $M$ and length $L$ lying on a smooth table, at a point ${f}$L$ from the centre of the rod. The particle is brought completely to rest. Find $100M/m$ (a whole number).`,
        sol: `Momentum: $mu = MV$. Angular momentum about the centre: $mu(${f}L) = \\dfrac{ML^2}{12}\\omega$. Energy: $mu^2 = MV^2 + \\dfrac{ML^2}{12}\\omega^2$. Eliminating $V$ and $\\omega$: $\\dfrac{M}{m} = 1 + 12\\left(\\dfrac{x}{L}\\right)^2 = 1 + 12\\times${f}^2 = ${v5S(1 + 12 * f * f, 4)}$. So $100M/m = ${Math.round(ans)}$.`,
        trap: 'Momentum and energy alone are not enough: include the rod\'s rotation.' };
    },
    verify: (p) => { let lo = 0.01, hi = 100; const vp = (rho) => { const x = p.f; const J = 2 / (1 + (1 / rho) * (1 + 12 * x * x)); return 1 - J; }; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (vp(mid) > 0) lo = mid; else hi = mid; } return 100 * (lo + hi) / 2; } },
  { id: 'cm-v5g3', type: 'mcq', level: 5, exams: ['jee-adv'], sub: 'motion of centre of mass',
    make(rng) {
      const pairs = [[3, 1], [5, 3], [4, 2], [6, 2], [7, 5], [8, 4], [5, 1], [9, 3]];
      const [m1, m2] = choose(rng, pairs);
      const R = 4 * m1 * m2 / (m1 + m2);
      const { options, answer } = numOpts(rng, R, [m1 + m2, 2 * m1 * m2 / (m1 + m2), m1 - m2], 'kg', 3);
      return { m1, m2, R, options, answer,
        q: `Masses of ${m1} kg and ${m2} kg hang from the ends of a light string over a smooth light pulley that is hung from a spring balance fixed to the ceiling. The masses are released and move freely. The balance reads (force divided by $g$)`,
        sol: `$a = \\dfrac{(${m1}-${m2})g}{${m1 + m2}}$. The centre of mass accelerates down with $a_{cm} = \\left(\\dfrac{${m1}-${m2}}{${m1}+${m2}}\\right)^2g$, so $S = (${m1 + m2})g(1 - a_{cm}/g) = ${fmt(R, 4)}g$. The balance reads ${fmt(R, 3)} kg, which is $2T/g$ with $T = \\dfrac{2m_1m_2}{m_1+m_2}g$.`,
        trap: 'The balance reads less than the total mass because the heavier mass accelerates downward.' };
    },
    verify: (p) => { const a = (p.m1 - p.m2) / (p.m1 + p.m2); const T = p.m1 * (1 - a); const R = 2 * T; return p.options.indexOf(`${fmt(R, 3)} kg`); } },
];

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'centre-of-mass-collisions', groups: { ...groups, ...v5groups }, items: [...items, ...v5items], gens: [...gens, ...v5gens] }, ['cm-g06', 'cm-g09', 'cm-g15', 'cm-g24']);
