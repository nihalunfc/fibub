// Work, energy and power: Plus Two entrance bank (original fibub questions).
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
const nid = () => `wep-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
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
  mcq(1, 'units', r`The SI unit of work is the`, 'joule (J)', ['watt (W)', 'newton (N)', 'pascal (Pa)'],
    r`Work $= $ force $\times$ displacement, so its unit is newton metre $=$ joule. The watt is the unit of power, the newton of force and the pascal of pressure.`),
  nat(1, 'work by constant force', r`A force of 10 N pulls a box through 5 m. The force makes an angle of $60^\circ$ with the displacement. Find the work done by the force (in J).`, 25, 0,
    r`$W = Fd\cos\theta = 10\times5\times\cos60^\circ = 10\times5\times0.5 = 25$ J.`, { unit: 'J' }),
  asrt(1, 'work by constant force', r`The work done by the centripetal force on a body in uniform circular motion is zero.`, r`The centripetal force is always perpendicular to the velocity of the body.`, 0,
    r`Work done in a small step $= \vec F\cdot d\vec s$. The centripetal force points to the centre and the displacement is along the tangent, so the angle is $90^\circ$ and $\cos90^\circ = 0$. Both true, and R explains A.`),
  nat(1, 'kinetic energy', r`Find the kinetic energy of a 4 kg ball moving at $3\ \mathrm{m\,s^{-1}}$ (in J).`, 18, 0,
    r`$K = \tfrac12mv^2 = \tfrac12\times4\times9 = 18$ J.`, { unit: 'J' }),
  mcq(1, 'units', r`One kilowatt-hour is equal to`, r`$3.6\times10^{6}$ J`, [r`$3.6\times10^{3}$ J`, r`$1\times10^{3}$ J`, r`$746$ J`],
    r`1 kW $= 1000$ J/s and 1 h $= 3600$ s, so 1 kWh $= 1000\times3600 = 3.6\times10^6$ J. It is a unit of energy, not of power.`),
  nat(1, 'power', r`A pump lifts 50 kg of water through 12 m in 10 s. Find its useful power (in W). Take $g = 10\ \mathrm{m\,s^{-2}}$.`, 600, 0,
    r`Work $= mgh = 50\times10\times12 = 6000$ J. Power $=$ work / time $= 6000/10 = 600$ W.`, { unit: 'W' }),
  mcq(1, 'spring energy', r`A spring stretched by $x$ stores energy $U$. If the same spring is stretched by $2x$ it stores`, '4U', ['2U', '8U', 'U'],
    r`$U = \tfrac12kx^2$ depends on the square of the stretch. Doubling $x$ gives $\tfrac12k(2x)^2 = 4U$.`),
  nat(1, 'potential energy', r`A 2 kg block is lifted 5 m above the floor. Find its gravitational potential energy relative to the floor (in J, $g = 10$).`, 100, 0,
    r`$U = mgh = 2\times10\times5 = 100$ J.`, { unit: 'J' }),
  mcq(1, 'conservative forces', r`Which of these is a non-conservative force?`, 'Kinetic friction', ['Gravitational force', 'Force of an ideal spring', 'Electrostatic force between two fixed charges'],
    r`The work done by friction depends on the path (a longer path means more work lost). Gravity, an ideal spring and the electrostatic force do work that depends only on the end points.`),
  mcq(1, 'work-energy theorem', r`The work-energy theorem says that`, 'the net work done on a body equals the change in its kinetic energy', ['the work done by gravity always equals the change in kinetic energy', 'the net work done on a body equals its change in momentum', 'the net work done equals force multiplied by time'],
    r`$W_{net} = K_f - K_i$. It uses the work of all forces together. Change of momentum is the impulse $F\,t$, a different quantity.`),
  nat(1, 'power', r`A 2 kW motor runs for 30 s. How much energy does it deliver (in kJ)?`, 60, 0,
    r`Energy $=$ power $\times$ time $= 2000\times30 = 60\,000$ J $= 60$ kJ.`, { unit: 'kJ' }),
  mcq(1, 'work by constant force', r`A ball rolls along a level floor. The work done by gravity on it is`, 'zero', ['positive', 'negative', r`$mgh$`],
    r`Gravity is vertical and the displacement is horizontal, so the angle between them is $90^\circ$ and the work is $0$.`),

  // ---------- Level 2 ----------
  nat(2, 'work by constant force', r`A 5 kg block is pushed 4 m up a smooth incline of angle $30^\circ$ at slow constant speed. Find the work done against gravity (in J, $g = 10$).`, 100, 0,
    r`The block rises $4\sin30^\circ = 2$ m. Work against gravity $= mgh = 5\times10\times2 = 100$ J.`, { unit: 'J' }),
  nat(2, 'kinetic energy', r`A stone of mass 0.5 kg has kinetic energy 25 J. Find its speed (in $\mathrm{m\,s^{-1}}$).`, 10, 0,
    r`$v = \sqrt{2K/m} = \sqrt{50/0.5} = \sqrt{100} = 10\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'work-energy theorem', r`A 2 kg body moving at $4\ \mathrm{m\,s^{-1}}$ is pushed by a force of 3 N along its motion for 3 m on a smooth floor. Find its final speed (in $\mathrm{m\,s^{-1}}$).`, 5, 0,
    r`Work $= 3\times3 = 9$ J. $K_i = \tfrac12\times2\times16 = 16$ J, so $K_f = 25$ J. Then $v = \sqrt{2\times25/2} = 5\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'variable force', r`A force $F = 3x^2$ newton acts on a body along $x$ (in metres). Find the work done as the body moves from $x = 0$ to $x = 2$ m (in J).`, 8, 0,
    r`$W = \int_0^2 3x^2\,dx = [x^3]_0^2 = 8$ J.`, { unit: 'J' }),
  nat(2, 'variable force', r`A force acts along a straight line. It rises uniformly from 0 to 10 N between $x = 0$ and $x = 4$ m, stays at 10 N from 4 m to 10 m, and then falls uniformly to 0 at $x = 12$ m. Find the work done (in J).`, 90, 0,
    r`Work is the area under the $F$-$x$ graph. Triangle: $\tfrac12\times4\times10 = 20$. Rectangle: $6\times10 = 60$. Triangle: $\tfrac12\times2\times10 = 10$. Total $= 90$ J.`, { unit: 'J' }),
  nat(2, 'spring energy', r`A spring of constant $400\ \mathrm{N\,m^{-1}}$ is compressed by 10 cm. Find the energy stored (in J).`, 2, 0,
    r`$U = \tfrac12kx^2 = \tfrac12\times400\times(0.1)^2 = 2$ J. Convert cm to m before squaring.`, { unit: 'J', trap: 'Using 10 instead of 0.1 gives 20000 J.' }),
  nat(2, 'spring energy', r`A spring of constant $500\ \mathrm{N\,m^{-1}}$ is stretched from 2 cm to 4 cm. Find the work done by the stretching force (in J).`, 0.3, 0.005,
    r`$W = \tfrac12k(x_2^2 - x_1^2) = \tfrac12\times500\times(0.0016 - 0.0004) = 250\times0.0012 = 0.3$ J.`, { unit: 'J', trap: 'It is not $\\tfrac12k(x_2-x_1)^2$.' }),
  mcq(2, 'conservation of energy', r`A ball is dropped from a height of 20 m. Ignoring air, its speed on reaching the ground is ($g = 10$)`, r`$20\ \mathrm{m\,s^{-1}}$`, [r`$10\ \mathrm{m\,s^{-1}}$`, r`$14\ \mathrm{m\,s^{-1}}$`, r`$40\ \mathrm{m\,s^{-1}}$`],
    r`$mgh = \tfrac12mv^2$, so $v = \sqrt{2gh} = \sqrt{2\times10\times20} = 20\ \mathrm{m\,s^{-1}}$.`),
  nat(2, 'conservation of energy', r`A block slides from rest down a smooth incline and falls through a vertical height of 1.8 m. Find its speed at the bottom (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 6, 0,
    r`Only gravity does work: $v = \sqrt{2gh} = \sqrt{36} = 6\ \mathrm{m\,s^{-1}}$. The angle of the incline does not matter.`, { unit: 'm/s' }),
  nat(2, 'power', r`A car moves at a steady $25\ \mathrm{m\,s^{-1}}$ while its engine delivers 20 kW to the wheels. Find the driving force (in N).`, 800, 0,
    r`$P = Fv$, so $F = 20\,000/25 = 800$ N.`, { unit: 'N' }),
  nat(2, 'power', r`A pump lifts 1200 kg of water through 15 m in one minute. Its motor is 75% efficient. Find the electrical power the motor draws (in W, $g = 10$).`, 4000, 0,
    r`Useful work $= 1200\times10\times15 = 180\,000$ J. Useful power $= 180\,000/60 = 3000$ W. Input power $= 3000/0.75 = 4000$ W.`, { unit: 'W' }),
  nat(2, 'work by friction', r`A 3 kg block slides 5 m on a rough floor ($\mu = 0.2$). Find the magnitude of the work done by friction (in J, $g = 10$).`, 30, 0,
    r`Friction $= \mu mg = 0.2\times3\times10 = 6$ N. Work $= 6\times5 = 30$ J (negative, since friction opposes the motion).`, { unit: 'J' }),
  mcq(2, 'kinetic energy and momentum', r`Two bodies have equal kinetic energy and their masses are in the ratio $1:4$. The ratio of their momenta is`, r`$1:2$`, [r`$1:4$`, r`$4:1$`, r`$2:1$`],
    r`$p = \sqrt{2mK}$. With equal $K$, $p\propto\sqrt m$, so $p_1:p_2 = \sqrt1:\sqrt4 = 1:2$.`),
  nat(2, 'work by friction', r`A car of mass 1000 kg moving at $20\ \mathrm{m\,s^{-1}}$ brakes with all wheels locked on a road with $\mu = 0.5$. Find the stopping distance (in m, $g = 10$).`, 40, 0,
    r`Work-energy: $\mu mg\,d = \tfrac12mv^2$, so $d = v^2/(2\mu g) = 400/10 = 40$ m. The mass cancels.`, { unit: 'm' }),
  nat(2, 'conservation of energy', r`A pendulum bob on a 0.8 m string is released from the horizontal position. Find its speed at the lowest point (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 4, 0,
    r`The bob falls through $L = 0.8$ m. $v = \sqrt{2gL} = \sqrt{16} = 4\ \mathrm{m\,s^{-1}}$. The tension does no work.`, { unit: 'm/s' }),
  mcq(2, 'conservative forces', r`A force is called conservative if`, 'the work done by it around any closed path is zero', ['it has a constant magnitude', 'it acts along a straight line', 'it never changes the kinetic energy of the body'],
    r`The definition: zero work in a closed loop, which is the same as path-independent work. A conservative force (like gravity) can change kinetic energy.`),
  nat(2, 'potential energy', r`A 3 kg book is moved from a table to a shelf that is 1.5 m higher. Find the increase in its gravitational potential energy (in J, $g = 10$).`, 45, 0,
    r`$\Delta U = mg\,\Delta h = 3\times10\times1.5 = 45$ J. The path taken does not matter.`, { unit: 'J' }),
  mcq(2, 'kinetic energy', r`The speed of a body rises from $10\ \mathrm{m\,s^{-1}}$ to $12\ \mathrm{m\,s^{-1}}$. Its kinetic energy increases by`, '44%', ['20%', '22%', '40%'],
    r`$K\propto v^2$. The ratio is $(12/10)^2 = 1.44$, so the rise is 44%. The 20% is the rise in speed.`, { trap: 'Percent change in $K$ is not the percent change in $v$.' }),

  // ---------- Level 3 ----------
  nat(3, 'power', r`A body of mass 2 kg starts from rest under a constant force of 4 N. Find the power of the force at $t = 3$ s (in W).`, 24, 0,
    r`$a = F/m = 2\ \mathrm{m\,s^{-2}}$, so $v = 6\ \mathrm{m\,s^{-1}}$ at 3 s. Instantaneous power $P = Fv = 4\times6 = 24$ W. (The average power over the 3 s is only 12 W.)`, { unit: 'W', trap: 'Average power is half the instantaneous value here.' }),
  nat(3, 'power', r`A 1000 kg car climbs a slope of $\sin\theta = 1/20$ at a steady $10\ \mathrm{m\,s^{-1}}$ against a constant resistance of 500 N. Find the power of the engine (in kW, $g = 10$).`, 10, 0,
    r`Driving force $=$ resistance $+ mg\sin\theta = 500 + 1000\times10/20 = 1000$ N. Power $= Fv = 1000\times10 = 10\,000$ W $= 10$ kW.`, { unit: 'kW' }),
  nat(3, 'springs', r`A 2 kg block is dropped from 0.15 m above a light vertical spring ($k = 1000\ \mathrm{N\,m^{-1}}$) fixed to the floor. Find the maximum compression of the spring (in cm, $g = 10$).`, 10, 0,
    r`The block falls $0.15 + x$ in total. Energy: $mg(h + x) = \tfrac12kx^2$, i.e. $20(0.15 + x) = 500x^2$. This gives $500x^2 - 20x - 3 = 0$, so $x = (20 + \sqrt{400 + 6000})/1000 = (20 + 80)/1000 = 0.1$ m $= 10$ cm.`, { unit: 'cm', trap: 'The block also falls through the compression $x$, not only through $h$.' }),
  nat(3, 'work-energy theorem', r`A block slides from rest down a rough incline of angle $37^\circ$ ($\mu = 0.25$) for 8 m. Find its speed (in $\mathrm{m\,s^{-1}}$; $\sin37^\circ = 0.6$, $\cos37^\circ = 0.8$, $g = 10$).`, 8, 0,
    r`Net force per unit mass $= g(\sin\theta - \mu\cos\theta) = 10(0.6 - 0.2) = 4\ \mathrm{m\,s^{-2}}$. Work-energy: $\tfrac12v^2 = 4\times8 = 32$, so $v = 8\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'vertical circle', r`A stone tied to a light string of length 0.5 m is whirled in a vertical circle. Find the least speed at the lowest point for the string to stay taut all the way round (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 5, 0,
    r`At the top the least speed is $\sqrt{gR}$. Energy from bottom to top: $v_b^2 = v_t^2 + 4gR = 5gR$. So $v_b = \sqrt{5\times10\times0.5} = 5\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'vertical circle', r`A small ball is attached to a light rigid rod of length 0.9 m and moves in a vertical circle. Find the least speed at the lowest point that lets it complete the circle (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 6, 0,
    r`A rod can push as well as pull, so the ball only needs to just reach the top with speed 0. Energy: $\tfrac12mv^2 = mg(2R)$, so $v = 2\sqrt{gR} = 2\sqrt{9} = 6\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'For a rod the top speed can be zero; for a string it cannot.' }),
  mcq(3, 'vertical circle', r`A ball on a string just completes a vertical circle. The tension in the string at the lowest point is`, '6mg', ['5mg', '3mg', '7mg'],
    r`At the bottom the speed squared is $5gR$. $T - mg = mv^2/R = 5mg$, so $T = 6mg$. (At the top the tension is zero.)`),
  nat(3, 'potential energy curve', r`A particle moves along $x$ with potential energy $U = (x^2 - 6x)$ joule ($x$ in metres). Find the magnitude of the force on it at $x = 1$ m (in N).`, 4, 0,
    r`$F = -dU/dx = -(2x - 6)$. At $x = 1$: $F = -(2 - 6) = +4$ N. The magnitude is 4 N (towards $+x$, towards the equilibrium at $x = 3$).`, { unit: 'N' }),
  nat(3, 'springs', r`Two springs of constants $200\ \mathrm{N\,m^{-1}}$ and $300\ \mathrm{N\,m^{-1}}$ are joined side by side (in parallel) and stretched together by 4 cm. Find the energy stored in the combination (in J).`, 0.4, 0.005,
    r`Springs in parallel have the same extension, so $k = 200 + 300 = 500\ \mathrm{N\,m^{-1}}$. $U = \tfrac12\times500\times(0.04)^2 = 0.4$ J.`, { unit: 'J' }),
  nat(3, 'conservation of energy', r`Masses 3 kg and 1 kg hang from the two ends of a light string over a smooth light pulley and are released from rest. Find the speed of the masses when the 3 kg mass has fallen 1.6 m (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 4, 0,
    r`Loss of PE $= (3 - 1)\times10\times1.6 = 32$ J. Gain of KE $= \tfrac12(3 + 1)v^2 = 2v^2$. So $v^2 = 16$ and $v = 4\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(3, 'work-energy theorem', r`A body starts from rest under a constant net force. Which pair of statements about its kinetic energy $K$ is correct?`, 'K is a straight line through the origin against displacement, and a parabola against time',
    ['K is a parabola against displacement, and a straight line against time', 'K is a straight line against both displacement and time', 'K is a parabola against both displacement and time'],
    r`$K = Fx$ (work-energy), linear in displacement. Also $v = Ft/m$, so $K = \tfrac12mv^2 = F^2t^2/2m$, a parabola in time.`),
  mcq(3, 'work by constant force', r`A porter carries a 20 kg suitcase 50 m along level ground at constant speed. The work done by the porter's lifting force on the suitcase is ($g = 10$)`, 'zero', ['10 000 J', r`$-10\,000$ J`, '1000 J'],
    r`The porter's force on the suitcase is vertical (it balances the weight), and the displacement is horizontal. $\cos90^\circ = 0$, so the work is zero. (Walking tires the porter, but that is the body's internal work.)`, { trap: 'Feeling tired is not the same as doing work on the suitcase.' }),
  nat(3, 'work by constant force', r`A hand lifts a 5 kg block by 3 m with an upward acceleration of $2\ \mathrm{m\,s^{-2}}$. Find the work done by the hand (in J, $g = 10$).`, 180, 0,
    r`Hand's force: $F - mg = ma$, so $F = 5\times12 = 60$ N. Work $= 60\times3 = 180$ J. (Gravity does $-150$ J, so the net work $= 30$ J $= \Delta K$.)`, { unit: 'J' }),
  nat(3, 'springs', r`A 2 kg block moving at $3\ \mathrm{m\,s^{-1}}$ on a smooth floor hits a light spring ($k = 200\ \mathrm{N\,m^{-1}}$) fixed to a wall. Find the greatest compression (in m).`, 0.3, 0.005,
    r`All the kinetic energy becomes spring energy: $\tfrac12mv^2 = \tfrac12kx^2$. $x = v\sqrt{m/k} = 3\sqrt{0.01} = 0.3$ m.`, { unit: 'm' }),
  nat(3, 'work by friction', r`A 1 kg block moving at $5\ \mathrm{m\,s^{-1}}$ enters a rough patch with $\mu = 0.5$. How far does it go on the patch before stopping (in m, $g = 10$)?`, 2.5, 0.02,
    r`$\mu mg\,d = \tfrac12mv^2$, so $d = v^2/(2\mu g) = 25/10 = 2.5$ m.`, { unit: 'm' }),
  nat(3, 'springs', r`A 2 kg block is pressed against a spring ($k = 400\ \mathrm{N\,m^{-1}}$) by 0.2 m on a smooth floor and released. It then slides onto a rough patch with $\mu = 0.2$. How far along the patch does it stop (in m, $g = 10$)?`, 2, 0,
    r`Spring energy $= \tfrac12\times400\times0.04 = 8$ J. Friction $= \mu mg = 4$ N. $4d = 8$, so $d = 2$ m.`, { unit: 'm' }),
  nat(3, 'work-energy theorem', r`A bullet enters a thick wooden block that resists with a constant force. After penetrating 3 cm its speed has fallen to half of its entering speed. How much further will it penetrate before stopping (in cm)?`, 1, 0,
    r`With constant resistance $F$, the work done equals the loss of kinetic energy. Losing from $K$ to $K/4$ takes $\tfrac34K = F\times3$ cm. The remaining $\tfrac14K$ needs $1$ cm.`, { unit: 'cm', trap: 'Speed halves but the energy falls to a quarter, not a half.' }),
  mcq(3, 'power', r`A wind turbine's output power is proportional to the cube of the wind speed. If the wind speed doubles, the output power becomes`, '8 times', ['2 times', '4 times', '16 times'],
    r`$P\propto v^3$, so $P'/P = 2^3 = 8$. (Per second, the mass of air through the blades $\propto v$, and each kilogram carries energy $\propto v^2$.)`),
  nat(3, 'power', r`A 1000 kg car starts from rest and its engine delivers a constant 50 kW. Ignoring resistance, find its speed after 4 s (in $\mathrm{m\,s^{-1}}$).`, 20, 0,
    r`Energy gained $= Pt = 50\,000\times4 = 200\,000$ J $= \tfrac12\times1000\times v^2$. So $v^2 = 400$ and $v = 20\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(3, 'power', r`A car moves from rest with the engine working at constant power and no resistance. The distance covered is proportional to`, r`$t^{3/2}$`, [r`$t$`, r`$t^{2}$`, r`$t^{1/2}$`],
    r`$P = mva$ constant gives $v\,dv/dt = P/m$, so $v^2 = 2Pt/m$ and $v\propto t^{1/2}$. Then $x = \int v\,dt\propto t^{3/2}$.`),
  nat(3, 'conservation of energy', r`A 0.2 kg ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal. Find its kinetic energy at the highest point (in J, ignore air).`, 10, 0,
    r`At the top only the horizontal velocity remains: $v_x = 20\cos60^\circ = 10\ \mathrm{m\,s^{-1}}$. $K = \tfrac12\times0.2\times100 = 10$ J. (Check with energy: initial $K = \tfrac12\times0.2\times400 = 40$ J. Greatest height $= (20\sin60^\circ)^2/20 = 15$ m, so $mgh = 0.2\times10\times15 = 30$ J, leaving 10 J.)`, { unit: 'J', format: 'numeric', sub: 'mixed', trap: 'The kinetic energy at the top is not zero.' }),
  nat(3, 'work by variable force', r`A uniform rope of mass 8 kg and length 2 m lies on a smooth table with one quarter of its length hanging over the edge. Find the work needed to pull the hanging part up onto the table (in J, $g = 10$).`, 5, 0,
    r`The hanging part has length 0.5 m and mass 2 kg; its centre of mass is 0.25 m below the table. Work $= mgh_{cm} = 2\times10\times0.25 = 5$ J.`, { unit: 'J' }),
  mcq(3, 'kinetic energy and momentum', r`Two bodies have equal momentum and their masses are in the ratio $1:4$. The ratio of their kinetic energies is`, r`$4:1$`, [r`$1:4$`, r`$2:1$`, r`$1:2$`],
    r`$K = p^2/2m$. With equal $p$, $K\propto1/m$, so $K_1:K_2 = 4:1$. The lighter body has more kinetic energy.`),
  nat(3, 'vertical circle', r`A block slides from rest down a smooth track that ends in a vertical loop of radius 0.8 m. From what least height above the bottom of the loop must it start so that it just completes the loop (in m)?`, 2, 0,
    r`At the top of the loop the least speed is $\sqrt{gR}$. Energy from start to top: $mgh = mg(2R) + \tfrac12mgR$, so $h = 2.5R = 2.5\times0.8 = 2$ m.`, { unit: 'm', trap: 'For a block on a track, the loop radius is the circle radius; the answer is $2.5R$, not $2R$.' }),
  nat(3, 'power', r`A car's engine has power 20 kW. On a level road it can reach a top speed against a constant resistance of 500 N. On an incline of $\sin\theta = 0.1$ (mass 1000 kg, $g = 10$) the same resistance acts. Find the top speed on the incline (in $\mathrm{m\,s^{-1}}$).`, 13.3, 0.1,
    r`Level road: $v = P/f = 40\ \mathrm{m\,s^{-1}}$ (not needed). On the incline the driving force at top speed $= 500 + 1000\times10\times0.1 = 1500$ N. $v = 20\,000/1500 = 13.3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'mixed' }),

  // ---------- Level 4 ----------
  nat(4, 'vertical circle', r`A ball on a string of length 0.6 m is given a speed $u = \sqrt{18}\ \mathrm{m\,s^{-1}}$ ($u^2 = 18$) at the lowest point of a vertical circle ($g = 10$). The string goes slack at some point. Find the height of that point above the lowest point (in m).`, 0.8, 0.01,
    r`Let the string make an angle $\alpha$ with the upward vertical when $T = 0$. Then $mg\cos\alpha = mv^2/L$. Energy: $v^2 = u^2 - 2gL(1 + \cos\alpha)$. So $gL\cos\alpha = u^2 - 2gL - 2gL\cos\alpha$, giving $\cos\alpha = (18 - 12)/18 = 1/3$. Height above the lowest point $= L(1 + \cos\alpha) = 0.6\times\tfrac43 = 0.8$ m.`, { unit: 'm', trap: 'Between $2gL$ and $5gL$ the ball leaves the circle and moves as a projectile.' }),
  nat(4, 'circular motion', r`A small block slides from rest from the top of a smooth hemisphere of radius 0.6 m. Find its speed at the instant it leaves the surface (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 2, 0,
    r`At angle $\theta$ from the vertical, the block leaves when $N = 0$: $mg\cos\theta = mv^2/R$. Energy: $v^2 = 2gR(1 - \cos\theta)$. So $\cos\theta = 2(1 - \cos\theta)$, i.e. $\cos\theta = 2/3$. Then $v^2 = gR\cos\theta = 10\times0.6\times\tfrac23 = 4$, so $v = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'mixed' }),
  nat(4, 'potential energy curve', r`A 0.25 kg particle moves in the potential $U(x) = \left(\tfrac{x^3}{3} - 4x\right)$ joule ($x$ in m). It makes small oscillations about its stable equilibrium. Find the angular frequency (in $\mathrm{rad\,s^{-1}}$).`, 4, 0,
    r`$dU/dx = x^2 - 4 = 0$ gives $x = \pm2$. $d^2U/dx^2 = 2x$ is positive (stable) at $x = 2$, where it equals 4 N/m. The effective spring constant is 4 N/m, so $\omega = \sqrt{k/m} = \sqrt{4/0.25} = 4\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  nat(4, 'springs', r`A 1 kg block is released from a compression of 0.3 m of a spring ($k = 100\ \mathrm{N\,m^{-1}}$) on a rough floor ($\mu = 0.2$, $g = 10$). The spring is attached to the block. Find the block's greatest speed (in $\mathrm{m\,s^{-1}}$).`, 2.8, 0.02,
    r`The speed is greatest where the net force is zero: $kx = \mu mg$, so $x = 2/100 = 0.02$ m of compression. Work-energy from 0.3 m to 0.02 m: $\tfrac12k(0.3^2 - 0.02^2) - \mu mg(0.28) = \tfrac12mv^2$. That is $50\times0.0896 - 2\times0.28 = 4.48 - 0.56 = 3.92$ J. So $v^2 = 7.84$ and $v = 2.8\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Maximum speed is not at the natural length: friction moves it to $x = \\mu mg/k$.' }),
  nat(4, 'variable force', r`A uniform chain of length 2.5 m lies on a smooth table with 1.5 m of it hanging over the edge. It is released from rest. Find its speed when the last link leaves the table (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 4, 0,
    r`Take the table top as zero of potential energy and $\lambda = M/L$. Initially the hanging part has its centre 0.75 m below: $U_i = -\lambda(1.5)g(0.75)$. Finally the whole chain hangs with centre 1.25 m below: $U_f = -\lambda(2.5)g(1.25)$. Loss of PE $= \lambda g(3.125 - 1.125) = 2\lambda g$. Gain of KE $= \tfrac12\lambda(2.5)v^2$. So $1.25v^2 = 20$ and $v^2 = 16$, $v = 4\ \mathrm{m\,s^{-1}}$. (General: $v^2 = g(L^2 - a^2)/L$.)`, { unit: 'm/s' }),
  nat(5, 'work by friction', r`A block of mass 1 kg is placed gently on a long horizontal belt moving at $4\ \mathrm{m\,s^{-1}}$ ($\mu = 0.5$, $g = 10$). Find the extra work done by the motor to keep the belt at constant speed while the block reaches the belt's speed (in J).`, 16, 0,
    r`Block's acceleration $= \mu g = 5$, so it takes $0.8$ s. The belt moves $4\times0.8 = 3.2$ m while the friction force on it (opposing its motion) is $\mu mg = 5$ N. Motor's work $= 5\times3.2 = 16$ J. (Block gains $\tfrac12mv^2 = 8$ J; the other 8 J is heat.)`, { unit: 'J', trap: 'The motor does twice the kinetic energy gained by the block.' }),
  nat(4, 'work-energy theorem', r`A block is thrown up a rough incline of angle $37^\circ$ ($\mu = 0.25$) at $10\ \mathrm{m\,s^{-1}}$. It stops, then slides back down. Find its speed when it returns to the starting point (in $\mathrm{m\,s^{-1}}$; $g = 10$, $\sin37^\circ = 0.6$).`, 7.07, 0.02,
    r`Going up: $a_{up} = g(\sin\theta + \mu\cos\theta) = 10(0.6 + 0.2) = 8$, so distance $d = 100/16 = 6.25$ m. Coming down: $a_{down} = 10(0.6 - 0.2) = 4$, so $v^2 = 2\times4\times6.25 = 50$ and $v = 7.07\ \mathrm{m\,s^{-1}}$. It is less than 10 because friction removed energy on the way up and down.`, { unit: 'm/s', trap: 'Friction reverses direction, so the up and down accelerations differ.' }),
  nat(4, 'conservation of energy', r`A 2 kg block on a smooth $30^\circ$ incline is joined by a light string over a smooth pulley at the top to a 3 kg block hanging freely. After the hanging block falls 2 m from rest, find the speed (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 4, 0,
    r`The 3 kg block loses $3\times10\times2 = 60$ J. The 2 kg block moves 2 m up the incline, rising $2\sin30^\circ = 1$ m, and gains $2\times10\times1 = 20$ J. Net $= 40$ J $= \tfrac12(5)v^2$, so $v^2 = 16$ and $v = 4\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'mixed' }),
  nat(4, 'work by variable force', r`A rectangular tank has a base area of $2\ \mathrm{m^2}$ and is full of water to a depth of 3 m. Find the work needed to pump all the water out over the top rim (in J; $\rho = 1000\ \mathrm{kg\,m^{-3}}$, $g = 10$).`, 90000, 0,
    r`A slice of thickness $dy$ at depth $y$ has mass $\rho A\,dy$ and is lifted $y$. $W = \int_0^3\rho gAy\,dy = \rho gA\,\tfrac{H^2}{2} = 1000\times10\times2\times\tfrac92 = 90\,000$ J. (Same as lifting all the water by the depth of its centre of mass, 1.5 m: $6000\times10\times1.5$.)`, { unit: 'J' }),
  mcq(4, 'springs', r`A spring of constant $k$ stores energy $U$ when pulled by a force $F$. The spring is cut into two equal halves and one half is pulled by the same force $F$. The energy stored in that half is`, 'U/2', ['U', '2U', 'U/4'],
    r`Energy at force $F$ is $U = F^2/2k$. A half-length spring is stiffer: $k' = 2k$. So $U' = F^2/(2\cdot2k) = U/2$.`, { trap: 'Equal extension gives a different answer than equal force.' }),
  nat(5, 'potential energy curve', r`A particle of mass 2 kg moves on the $x$-axis in the potential $U(x) = (4x^2 - x^4)$ joule. It is at $x = 0$ with speed $v_0$. Find the least $v_0$ for it to cross the potential barrier and go beyond (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`$U' = 8x - 4x^3 = 0$ gives $x = 0$ and $x = \pm\sqrt2$. $U(\pm\sqrt2) = 8 - 4 = 4$ J is a maximum (the barrier). The particle needs $K(0)\ge 4$ J since $U(0) = 0$. $\tfrac12\times2\times v_0^2 = 4$, so $v_0 = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(4, 'work by friction', r`A box rests on the floor of a truck that speeds up without the box slipping. In the ground frame, the work done by static friction on the box is`, 'positive', ['zero', 'negative', 'equal to the heat generated'],
    r`Friction on the box points forward (it accelerates the box) and the box moves forward, so the work is positive and equals the box's gain in kinetic energy. Static friction does no heat here, since nothing slips.`, { trap: 'Static friction can do work: it is zero only in the frame where the surfaces stay at rest.' }),
  mcq(4, 'conservative forces', r`Which force field $\vec F(x,y)$ is conservative?`, r`$\vec F = y\,\hat i + x\,\hat j$`, [r`$\vec F = -y\,\hat i + x\,\hat j$`, r`$\vec F = y\,\hat i - x\,\hat j$`, r`$\vec F = y^2\,\hat i + x\,\hat j$`],
    r`A field is conservative if $\partial F_y/\partial x = \partial F_x/\partial y$. For $(y, x)$: $1 = 1$, yes (it is $-\nabla U$ with $U = -xy$). For $(-y, x)$: $1 \ne -1$. For $(y, -x)$: $-1 \ne 1$. For $(y^2, x)$: $1 \ne 2y$. So only the first one.`, { trap: 'A field with $x$ and $y$ swapped is conservative; one with a sign flip is a swirl and is not.' }),

  // ---------- Level 5 ----------
  nat(5, 'springs', r`A 2 kg block is released from rest on a rough $37^\circ$ incline ($\mu = 0.25$) at a distance of 1.5 m along the incline from the free end of a light spring ($k = 128\ \mathrm{N\,m^{-1}}$) lying along the incline. Find the maximum compression of the spring (in m; $\sin37^\circ = 0.6$, $g = 10$).`, 0.5, 0.01,
    r`The net force along the incline (gravity component minus friction) is $2\times10\times(0.6 - 0.25\times0.8) = 8$ N, and it acts over the whole path $1.5 + x$. Energy: $8(1.5 + x) = \tfrac12\times128\,x^2 = 64x^2$. So $64x^2 - 8x - 12 = 0$, i.e. $16x^2 - 2x - 3 = 0$, and $x = (2 + \sqrt{4 + 192})/32 = 16/32 = 0.5$ m.`, { unit: 'm', trap: 'The block moves $1.5 + x$ before stopping, so the quadratic must include $x$ on both sides.' }),
  nat(5, 'vertical circle', r`A bob on a string of length $L = 1$ m is released from the horizontal position. When the string becomes vertical it catches on a nail a distance $d$ below the pivot, and the bob goes round the nail in a full vertical circle. Find the least value of $d$ (in m).`, 0.6, 0.01,
    r`Speed at the bottom: $v^2 = 2gL$. The new circle has radius $r = L - d$. To just complete it, $v^2 \ge 5gr$. So $2gL \ge 5g(L - d)$, giving $d \ge 3L/5 = 0.6$ m.`, { unit: 'm', trap: 'The radius around the nail is $L - d$, not $d$.' }),
  mcq(5, 'concepts', r`How many of these are correct? (a) The work done by a conservative force equals the decrease in its potential energy. (b) Static friction never does any work. (c) The net work done on a body in uniform circular motion is zero. (d) Kinetic energy can be negative. (e) Power is a vector. (f) One kilowatt-hour is a unit of energy.`, '3', ['2', '4', '5'],
    r`(a) true. (b) false: static friction on a box in an accelerating truck does positive work. (c) true: speed does not change. (d) false: $\tfrac12mv^2\ge0$. (e) false: power is a scalar. (f) true. Correct: a, c, f, so three.`, { format: 'statements' }),
  msq(5, 'potential energy curve', r`A particle moves along $x$ in the potential $U(x) = x^4 - 2x^2$ (in J, $x$ in m). Which are correct?`,
    [r`$x = 0$ is a position of stable equilibrium`, r`$x = \pm1$ are positions of stable equilibrium`, r`At $x = 0.5$ m the force on the particle points towards $+x$`, r`A particle with total energy 0 can reach $x = 1.5$ m`],
    [1, 2],
    r`$U' = 4x^3 - 4x = 0$ gives $x = 0, \pm1$. $U'' = 12x^2 - 4$: at $x = 0$ it is $-4<0$ (a maximum, unstable); at $x = \pm1$ it is $8>0$ (minima, stable). So A is false, B is true. $F = -U' = -(4x^3 - 4x)$; at 0.5: $-(0.5 - 2) = +1.5$ N, towards $+x$: C is true. $U(1.5) = 5.06 - 4.5 = 0.56$ J is greater than 0, so a particle with $E = 0$ cannot be there: D is false.`, { trap: 'The potential has two wells; the top of the hill between them is unstable.' }),
  msq(5, 'vertical circle', r`A ball on a string just completes a vertical circle of radius $R$ (the string is just taut at the top). Which are correct?`,
    [r`The tension at the top is zero`, r`The speed at the bottom is $\sqrt{5gR}$`, r`The tension at the bottom is $5mg$`, r`The tension when the string is horizontal is $3mg$`],
    [0, 1, 3],
    r`Top: $T = 0$, $v^2 = gR$. Bottom: $v^2 = gR + 4gR = 5gR$, so $T = mg + 5mg = 6mg$ (C is false). Horizontal: $v^2 = gR + 2gR = 3gR$; there the tension alone gives the centripetal force: $T = m(3gR)/R = 3mg$ (D is true).`, { trap: 'Tension at the bottom is $6mg$, not $5mg$ ($5mg$ is the extra over weight).' }),

  // ---------- Extra hard items ----------
  nat(5, 'springs', r`A bungee jumper of mass 60 kg jumps from a bridge. The elastic cord has natural length 20 m and behaves as a spring of constant $120\ \mathrm{N\,m^{-1}}$. Find the jumper's greatest speed during the fall (in $\mathrm{m\,s^{-1}}$; $g = 10$, treat the jumper as a point).`, 21.2, 0.1,
    r`The speed is greatest where the net force is zero: $kx = mg$, so $x = 600/120 = 5$ m beyond the natural length. Energy over a fall of $25$ m: $mg(25) = \tfrac12kx^2 + \tfrac12mv^2$, i.e. $15\,000 = 1500 + 30v^2$. Hence $v^2 = 450$ and $v = 21.2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The cord is slack for the first 20 m; the speed peaks 5 m below that, not at the lowest point.' }),
  nat(5, 'potential energy curve', r`Two atoms interact with the potential energy $U(r) = \left(\dfrac{4}{r^2} - \dfrac{4}{r}\right)$ joule ($r$ in metres). Find the work needed to separate them from the equilibrium distance to infinity (in J; take $U(\infty) = 0$).`, 1, 0,
    r`$dU/dr = -8/r^3 + 4/r^2 = 0$ gives $r = 2$ m. There $U = 4/4 - 4/2 = -1$ J. The work needed to reach $U = 0$ is $0 - (-1) = 1$ J. ($U'' = 24/r^4 - 8/r^3$ at $r = 2$ is $1.5 - 1 = 0.5 > 0$, so it is a minimum.)`, { unit: 'J' }),
  nat(5, 'springs', r`A 1 kg block is dropped from 0.45 m above a light vertical spring ($k = 100\ \mathrm{N\,m^{-1}}$) fixed to the floor. Find the greatest speed the block reaches (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 3.16, 0.02,
    r`The speed is greatest where $kx = mg$: $x = 0.1$ m. Energy from release to that point: $mg(0.45 + 0.1) = \tfrac12kx^2 + \tfrac12mv^2$, i.e. $5.5 = 0.5 + 0.5v^2$, so $v^2 = 10$ and $v = 3.16\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The greatest speed is not at the greatest compression.' }),
  nat(4, 'work by variable force', r`A force $\vec F = (2y\,\hat i + 2x\,\hat j)$ N moves a particle from $(0,0)$ to $(1,2)$ m along the straight line joining them. Find the work done (in J).`, 4, 0,
    r`The field is conservative: $\vec F = \nabla(2xy)$, so $W = 2xy|_{(1,2)} - 0 = 4$ J, whatever the path. Check along $y = 2x$: $dy = 2\,dx$, so $W = \int_0^1(2\cdot2x + 2x\cdot2)\,dx = \int_0^1 8x\,dx = 4$ J.`, { unit: 'J' }),
  nat(4, 'work-energy theorem', r`A 1 kg body moves along a line with velocity $v = 3t^2$ ($v$ in $\mathrm{m\,s^{-1}}$, $t$ in s). Find the work done by the net force in the first 2 s (in J).`, 72, 0,
    r`$v(2) = 12\ \mathrm{m\,s^{-1}}$ and $v(0) = 0$, so $W = \Delta K = \tfrac12\times1\times144 = 72$ J. (Check: $F = ma = 6t$, $x = t^3$, $W = \int F\,dx = \int_0^2 6t\cdot3t^2\,dt = 18\times4 = 72$.)`, { unit: 'J' }),
  nat(4, 'potential energy', r`A uniform solid cube of side 0.4 m and mass 10 kg rests on the floor. Find the least work needed to tip it over one edge so that it comes to rest on an adjacent face (in J, $g = 10$).`, 8.28, 0.05,
    r`The work needed is to raise the centre of mass to its highest point (when the diagonal through the pivot edge is vertical). Initially the centre is 0.2 m above the floor; at the top it is $0.4/\sqrt2 = 0.283$ m above it. Rise $= 0.0828$ m. $W = mg\,\Delta h = 100\times0.0828 = 8.28$ J.`, { unit: 'J', trap: 'The centre of mass first rises, then falls on its own: the work is for the rise only.' }),

  // ---------- Assertion / Reason ----------
  asrt(2, 'kinetic energy', r`The kinetic energy of a body is the same in all inertial frames.`, r`Kinetic energy depends on the speed of the body, and the speed depends on the frame of the observer.`, 3,
    r`A is false: a passenger in a moving train has zero KE in the train frame and a large one in the ground frame. R is true and tells why A fails.`),
  asrt(2, 'conservative forces', r`The work done by a conservative force over a closed path is zero.`, r`A conservative force depends on the speed of the body.`, 2,
    r`A is true (the definition). R is false: conservative forces (gravity, spring) depend on position only. A velocity-dependent force like drag is not conservative.`),
  asrt(2, 'units', r`The kilowatt-hour is a unit of energy.`, r`One kilowatt is a unit of power.`, 1,
    r`Both true. But R is not the reason: the kWh is energy because it is power $\times$ time ($1000\ \mathrm{W}\times3600\ \mathrm{s}$), not simply because the kW is a unit of power.`),
  asrt(3, 'kinetic energy and momentum', r`If two bodies have the same kinetic energy, the lighter body has the smaller momentum.`, r`The momentum of a body is $p = \sqrt{2mK}$.`, 0,
    r`With the same $K$, $p\propto\sqrt m$, so the lighter body has the smaller $p$. R gives exactly that relation. Both true, and R explains A.`),
  asrt(3, 'work by friction', r`Static friction can do work on a body.`, r`Static friction always acts opposite to the motion of the body.`, 2,
    r`A is true: the friction on a box in an accelerating truck is forward and does positive work in the ground frame. R is false: static friction opposes the tendency of relative sliding, which is not always opposite to the body's motion.`),
  asrt(3, 'work by constant force', r`The work done by gravity on a ball thrown upwards is positive while it rises.`, r`Gravity acts vertically downwards.`, 3,
    r`While rising the displacement is up and gravity is down, so the work is negative ($-mgh$). A is false. R is a true fact but does not support A.`),
  asrt(4, 'power', r`At constant power, the driving force on a car falls as the car speeds up.`, r`Power equals force times velocity.`, 0,
    r`$P = Fv$, so for constant $P$, $F = P/v$ decreases as $v$ increases. R explains A. This is why the acceleration falls to zero at the top speed.`),

  // ---------- Statements ----------
  stm(1, 'conservative forces', r`The work done by gravity in moving a body between two points depends only on the end points.`, r`Gravity is a conservative force.`, 0,
    r`Both true and II is the reason for I. Path-independence is the property of conservative forces.`),
  stm(2, 'springs', r`The energy stored in a spring is proportional to the square of its extension.`, r`The work done to stretch a spring by $2x$ is twice that for stretching it by $x$.`, 2,
    r`I is true: $U = \tfrac12kx^2$. II is false: stretching by $2x$ needs $4$ times the work of stretching by $x$ (the extra stretch needs more force than the first).`),
  stm(3, 'work-energy theorem', r`The net work done on a body moving at constant velocity is not zero.`, r`The kinetic energy of a body does not change if the net work on it is zero.`, 3,
    r`I is false: constant velocity means no change in KE, so net work is zero. II is true (work-energy theorem).`),
  stm(3, 'conservative forces', r`Friction is a conservative force.`, r`The work done by friction over a closed path is zero.`, 1,
    r`Both false. Friction always opposes the motion, so over any closed path its work is negative.`),
  stm(3, 'power', r`Average power equals the total work done divided by the total time.`, r`Instantaneous power equals $\vec F\cdot\vec v$.`, 0,
    r`Both true. Average power is $W/t$; instantaneous power is $dW/dt = \vec F\cdot\vec v$.`),
  stm(4, 'conservation of energy', r`The mechanical energy of a system is conserved if only conservative forces do work on it.`, r`The mechanical energy of a system is conserved whenever the net external force on it is zero.`, 2,
    r`I is true. II is false: with two bodies joined by a rough contact or a sliding friction, internal non-conservative forces can reduce the mechanical energy even if the net external force is zero (e.g. two colliding clay balls in free space).`, { trap: 'Zero net force conserves momentum, not mechanical energy.' }),

  // ---------- Multi-correct ----------
  msq(3, 'conservative forces', r`Which of these forces are conservative?`,
    ['Gravitational force', 'Force of an ideal spring', 'Kinetic friction', 'Electrostatic force between two fixed charges'],
    [0, 1, 3],
    r`Gravity, the ideal spring force and the electrostatic force do path-independent work. Kinetic friction depends on the path length and is not conservative.`),
  msq(4, 'conservation of energy', r`A block slides down a rough fixed incline from rest. Which are correct?`,
    ['Its kinetic energy increases', 'Its mechanical energy decreases', 'Work done by gravity equals the decrease in its gravitational potential energy', 'Work done by the normal force is not zero'],
    [0, 1, 2],
    r`It speeds up (if it slides), so K rises. Friction removes mechanical energy as heat. Gravity is conservative, so $W_g = -\Delta U$. The normal force is perpendicular to the displacement, so it does no work: D is false.`),
  msq(4, 'power', r`A body of mass $m$ starts from rest and a constant power $P$ acts on it (no resistance). Which are correct?`,
    ['Its acceleration decreases with time', r`Its speed is proportional to $t^{1/2}$`, r`The distance travelled is proportional to $t^{3/2}$`, 'The force on it is constant'],
    [0, 1, 2],
    r`$v^2 = 2Pt/m$, so $v\propto\sqrt t$; $x\propto t^{3/2}$; $a = P/(mv)$ falls as $v$ rises; $F = P/v$ is not constant, so D is false.`),
  msq(4, 'work-energy theorem', r`Which are correct about the work-energy theorem?`,
    ['It holds for variable forces', 'In a non-inertial frame it holds if the work of pseudo forces is included', 'It holds only for conservative forces', 'It holds even when friction acts'],
    [0, 1, 3],
    r`The theorem $W_{net} = \Delta K$ follows from Newton's second law, so it holds for any forces, including variable and non-conservative ones. In a non-inertial frame add pseudo forces. C is false.`),
  msq(4, 'vertical circle', r`A bob of mass $m$ on a string of length $L$ is released from the horizontal position. At the lowest point, which are correct?`,
    [r`The speed is $\sqrt{2gL}$`, r`The tension is $3mg$`, r`The power of the tension is zero`, r`The rate of increase of kinetic energy is $mg\sqrt{2gL}$`],
    [0, 1, 2],
    r`$v = \sqrt{2gL}$; $T - mg = mv^2/L = 2mg$ gives $T = 3mg$; tension is perpendicular to the velocity so its power is zero. At the lowest point gravity is also perpendicular to the velocity, so its power is zero and $K$ is momentarily not changing: D is false.`),
  msq(3, 'springs', r`A block of mass $m$ is attached to a light vertical spring of constant $k$ and released from rest with the spring at its natural length. Which are correct?`,
    [r`The greatest extension is $2mg/k$`, r`The block's speed is greatest at extension $mg/k$`, r`The block's acceleration is zero at extension $2mg/k$`, r`Energy $mg x = \tfrac12kx^2$ gives the lowest point`],
    [0, 1, 3],
    r`Energy: $mgx = \tfrac12kx^2$ gives $x = 2mg/k$ (A, D). Speed is greatest where $mg = kx$, i.e. $x = mg/k$ (B). At the lowest point the net force is $kx - mg = mg$ upward, so the acceleration is $g$, not zero (C false).`),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'units', group: 'm1',
    q: 'Match each quantity in List I with its SI base-unit form in List II.',
    options: ['A-r, B-q, C-p, D-s', 'A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-q, C-s, D-p'], answer: 0,
    sol: r`Work: $\mathrm{kg\,m^2\,s^{-2}}$ (r). Power: $\mathrm{kg\,m^2\,s^{-3}}$ (q). Spring constant (N/m): $\mathrm{kg\,s^{-2}}$ (p). Momentum: $\mathrm{kg\,m\,s^{-1}}$ (s).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'work by constant force', group: 'm2',
    q: 'Match each case in List I with the work in List II.',
    options: ['A-s, B-r, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-p, D-q', 'A-p, B-r, C-s, D-q'], answer: 1,
    sol: r`A: gravity on a 2 kg block lifted slowly 3 m: $-mgh = -60$ J (s). B: spring force on a spring stretched from natural length by 0.1 m with $k = 200$: $-\tfrac12kx^2 = -1$ J (r). C: centripetal force for any arc: 0 (p). D: $5\times4\cos60^\circ = 10$ J (q).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'potential energy curve', group: 'm3',
    q: r`Match each potential energy $U(x)$ (in J, $x$ in m) in List I with the force it gives at $x = 1$ m in List II.`,
    options: ['A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-p, B-s, C-q, D-r'], answer: 1,
    sol: r`$F = -dU/dx$. A: $U = 3x^2$ gives $-6x = -6$ (s). B: $U = -3x^2$ gives $+6x = +6$ (p). C: $U = 3x$ gives $-3$ (q). D: $U = 3x^3$ gives $-9x^2 = -9$ (r).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'vertical circle', group: 'm4',
    q: 'Match each case in List I with the least speed in List II.',
    options: ['A-p, B-r, C-q, D-s', 'A-q, B-r, C-s, D-p', 'A-q, B-s, C-p, D-r', 'A-q, B-r, C-p, D-s'], answer: 3,
    sol: r`String, top: $\sqrt{gR}$ (q). String, bottom: $\sqrt{5gR}$ (r). Rod, top: it can be 0 (p). Rod, bottom: $2\sqrt{gR}$ (s).` },
];

const groups = {
  m1: { title: 'Units of work and energy topics',
    list1: ['A. Work', 'B. Power', 'C. Spring constant', 'D. Momentum'],
    list2: [r`p. $\mathrm{kg\,s^{-2}}$`, r`q. $\mathrm{kg\,m^2\,s^{-3}}$`, r`r. $\mathrm{kg\,m^2\,s^{-2}}$`, r`s. $\mathrm{kg\,m\,s^{-1}}$`] },
  m2: { title: 'Work done in different cases',
    list1: ['A. Work done by gravity on a 2 kg block lifted slowly through 3 m ($g = 10$)', 'B. Work done by the spring force when a spring ($k = 200\\ \\mathrm{N\\,m^{-1}}$) is stretched 0.1 m from its natural length', 'C. Work done by the centripetal force on a body moving along any arc of a circle', 'D. Work done by a 5 N force that makes $60^\\circ$ with a displacement of 4 m'],
    list2: ['p. 0', 'q. 10 J', 'r. −1 J', 's. −60 J'] },
  m3: { title: 'Force from a potential energy',
    list1: ['A. $U = 3x^2$', 'B. $U = -3x^2$', 'C. $U = 3x$', 'D. $U = 3x^3$'],
    list2: ['p. +6 N', 'q. −3 N', 'r. −9 N', 's. −6 N'] },
  m4: { title: 'Vertical circle: least speeds',
    list1: ['A. Ball on a string, at the top', 'B. Ball on a string, at the bottom', 'C. Ball on a rod, at the top', 'D. Ball on a rod, at the bottom'],
    list2: ['p. 0', r`q. $\sqrt{gR}$`, r`r. $\sqrt{5gR}$`, r`s. $2\sqrt{gR}$`] },
  p1: { title: 'A block on a curved track, a rough patch and a spring',
    passage: r`<p>A 2 kg block is released from rest at a height of 1.8 m on a smooth curved track. The track becomes a horizontal rough stretch BC of length 4 m with $\mu = 0.25$. At C a light spring ($k = 800\ \mathrm{N\,m^{-1}}$) is fixed to a wall, with its free end at C. Take $g = 10\ \mathrm{m\,s^{-2}}$. The floor beyond C is smooth up to the spring.</p>` },
  p2: { title: 'A car with a fixed-power engine',
    passage: r`<p>A car of mass 1200 kg has an engine of constant power 36 kW. The total resistance on the level road is a constant 600 N.</p>` },
  p3: { title: 'A particle in a parabolic potential',
    passage: r`<p>A 2 kg particle moves along the $x$-axis with potential energy $U(x) = 4x^2 - 16x + 9$ joule ($x$ in metres). It is released from rest at $x = 0$.</p>` },
  m5: { title: 'Work done in different cases',
    list1: [r`A. Work by gravity on a 2 kg ball falling 5 m`, r`B. Work by gravity on a 1 kg ball thrown up through 3 m`, r`C. Work by friction on a 0.5 kg block sliding 4 m on a floor with $\mu = 0.5$`, r`D. Work by the normal force on a block sliding down a smooth incline`],
    list2: ['p. +100 J', 'q. −30 J', 'r. −10 J', 's. 0'] },
  m6: { title: 'Kinetic energy factors',
    list1: ['A. The speed is doubled', 'B. The momentum is tripled', 'C. The speed is multiplied by 1.5', 'D. The speed is multiplied by 1.2'],
    list2: [r`p. $\times1.44$`, r`q. $\times4$`, r`r. $\times2.25$`, r`s. $\times9$`] },
  m7: { title: 'Equilibrium from the potential energy',
    list1: [r`A. $U = (x-2)^2$`, r`B. $U = x^2 - 6x$`, r`C. $U = 2x^2 - 4x$`, r`D. $U = x^2 - 10x$`],
    list2: ['p. x = 1 m', 'q. x = 2 m', 'r. x = 3 m', 's. x = 5 m'] },
  m8: { title: 'Combinations of springs',
    list1: ['A. Two springs side by side (parallel)', 'B. Two springs end to end (series)', 'C. Three springs end to end (series)', 'D. One spring cut into 4 equal parts (each part)'],
    list2: ['p. 33.3', 'q. 50', 'r. 200', 's. 400'] },
  m9: { title: 'Tension at the top of a vertical circle',
    list1: [r`A. $u^2 = 5gR$`, r`B. $u^2 = 6gR$`, r`C. $u^2 = 7gR$`, r`D. $u^2 = 9gR$`],
    list2: ['p. 0', 'q. mg', 'r. 2mg', 's. 4mg'] },
  m10: { title: 'Variation with time',
    list1: ['A. Kinetic energy under a constant force from rest', 'B. Speed under constant power from rest', 'C. Distance under constant power from rest', 'D. Power of a constant force acting on a body from rest'],
    list2: [r`p. $t$`, r`q. $t^{1/2}$`, r`r. $t^{2}$`, r`s. $t^{3/2}$`] },
  m11: { title: 'Sliding off a smooth hemisphere (R = 0.9 m)',
    list1: [r`A. The value of $v^2$ when it leaves the surface`, 'B. The height of the leaving point above the base', 'C. The drop in height from the top to the leaving point', 'D. The speed when it leaves'],
    list2: [r`p. 0.3 m`, r`q. 0.6 m`, r`r. $6\ \mathrm{m^2\,s^{-2}}$`, r`s. $2.45\ \mathrm{m\,s^{-1}}$`] },
  m12: { title: 'Potential energy at equilibrium',
    list1: [r`A. $U = 2x^2 - 8x$`, r`B. $U = -x^2 + 6x$`, r`C. $U = x^2 - 4x + 1$`, r`D. $U = -2x^2 + 4x$`],
    list2: ['p. −3 J', 'q. 9 J', 'r. 2 J', 's. −8 J'] },
  p4: { title: 'A block released from a height into a vertical loop',
    passage: r`<p>A small block of mass 0.5 kg is released from rest at a height of 3 m above the lowest point of a smooth track. The track leads into a smooth vertical circular loop of radius 1 m. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p5: { title: 'A crane lifting a load',
    passage: r`<p>A crane lifts a load of mass 200 kg vertically through 15 m. Most of the lift is at a steady $0.5\ \mathrm{m\,s^{-1}}$. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
};

items.push(
  nat(3, 'conservation of energy', 'Find the speed of the block at B, the start of the rough stretch (in m/s).', 6, 0,
    r`Smooth track: $v = \sqrt{2gh} = \sqrt{2\times10\times1.8} = 6\ \mathrm{m\,s^{-1}}$.`, { group: 'p1', format: 'passage', unit: 'm/s' }),
  nat(3, 'work by friction', 'Find the speed of the block at C (in m/s).', 4, 0,
    r`Friction work on BC $= \mu mg\times4 = 0.25\times20\times4 = 20$ J. Kinetic energy at B $= \tfrac12\times2\times36 = 36$ J. At C: $16$ J, so $v = \sqrt{2\times16/2} = 4\ \mathrm{m\,s^{-1}}$.`, { group: 'p1', format: 'passage', unit: 'm/s' }),
  nat(3, 'springs', 'Find the greatest compression of the spring (in m).', 0.2, 0.005,
    r`The 16 J at C becomes spring energy: $\tfrac12\times800\times x^2 = 16$, so $x^2 = 0.04$ and $x = 0.2$ m.`, { group: 'p1', format: 'passage', unit: 'm' }),
  mcq(4, 'work by friction', 'The block is thrown back by the spring onto BC and keeps sliding to and fro. Where does it finally stop?', '0.8 m from B', ['0.8 m from C', '3.2 m from B', 'At C'],
    r`Total mechanical energy at B is 36 J, all lost to friction: $\mu mg\,s = 36$, so $s = 36/5 = 7.2$ m on the rough stretch. First pass: 4 m to C. Then 3.2 m back from C towards B, so it stops 3.2 m from C, i.e. 0.8 m from B.`, { group: 'p1', format: 'passage', trap: 'Count the 4 m of the first pass before the return.' }),
  nat(3, 'power', 'Find the greatest speed the car can reach on the level road (in m/s).', 60, 0,
    r`At top speed the driving force equals the resistance: $P = fv_{max}$, so $v_{max} = 36\,000/600 = 60\ \mathrm{m\,s^{-1}}$.`, { group: 'p2', format: 'passage', unit: 'm/s' }),
  nat(3, 'power', r`Find the acceleration of the car when its speed is $20\ \mathrm{m\,s^{-1}}$ (in $\mathrm{m\,s^{-2}}$).`, 1, 0,
    r`Driving force $= P/v = 36\,000/20 = 1800$ N. Net force $= 1800 - 600 = 1200$ N. $a = 1200/1200 = 1\ \mathrm{m\,s^{-2}}$.`, { group: 'p2', format: 'passage', unit: 'm/s²' }),
  nat(4, 'power', 'At what speed does the car\'s acceleration fall to $0.5\\ \\mathrm{m\\,s^{-2}}$ (in m/s)?', 30, 0,
    r`Net force needed $= 1200\times0.5 = 600$ N. So the driving force is $600 + 600 = 1200$ N. $v = P/F = 36\,000/1200 = 30\ \mathrm{m\,s^{-1}}$.`, { group: 'p2', format: 'passage', unit: 'm/s' }),
  nat(3, 'potential energy curve', 'Find the position of stable equilibrium (in m).', 2, 0,
    r`$dU/dx = 8x - 16 = 0$, so $x = 2$ m. $d^2U/dx^2 = 8 > 0$, so it is stable.`, { group: 'p3', format: 'passage', unit: 'm' }),
  nat(3, 'potential energy curve', 'Find the magnitude of the force on the particle at the start, $x = 0$ (in N).', 16, 0,
    r`$F = -dU/dx = -(8x - 16)$. At $x = 0$: $F = +16$ N (towards the equilibrium at $x = 2$).`, { group: 'p3', format: 'passage', unit: 'N' }),
  nat(4, 'potential energy curve', 'Find the greatest speed of the particle (in m/s).', 4, 0,
    r`Total energy $= U(0) = 9$ J. At the equilibrium $x = 2$: $U = 16 - 32 + 9 = -7$ J. So $K_{max} = 9 - (-7) = 16$ J $= \tfrac12\times2\times v^2$, giving $v = 4\ \mathrm{m\,s^{-1}}$. It oscillates between $x = 0$ and $x = 4$.`, { group: 'p3', format: 'passage', unit: 'm/s' }),
);

items.push(

  // ================= Added 2026-11-22: harder and more varied questions =================
  // ---------- Level 2 ----------
  nat(2, 'power', r`A climber of mass 60 kg goes up a stairway 20 m high in 40 s. Find the average power she spends against gravity (in W, $g = 10\ \mathrm{m\,s^{-2}}$).`, 300, 0,
    r`$P = mgh/t = 60\times10\times20/40 = 300$ W.`, { unit: 'W', calc: () => 60 * 10 * 20 / 40 }),
  mcq(2, 'kinetic energy and momentum', r`The momentum of a body is doubled while its mass stays the same. Its kinetic energy becomes`, '4 times', ['2 times', '8 times', 'half'],
    r`$K = p^2/(2m)$, so $K$ varies as the square of $p$. Doubling $p$ makes $K$ four times as large.`),
  nat(2, 'work by constant force', r`A boy pulls a sled through 6 m with a rope tension of 50 N. The rope makes $37^\circ$ with the ground ($\cos37^\circ = 0.8$). Find the work done by the rope (in J).`, 240, 0,
    r`$W = Fd\cos\theta = 50\times6\times0.8 = 240$ J.`, { unit: 'J', calc: () => 50 * 6 * 0.8 }),
  mcq(2, 'work-energy theorem', r`A body moves up a rough incline at constant speed. The net work done on it is`, 'zero', ['positive', 'negative', 'equal to the work done by gravity alone'],
    r`The speed is constant, so $\Delta K = 0$ and the net work is zero. The work of the pull is positive, that of gravity and friction is negative, and they add up to zero. The work of gravity alone is not zero.`),
  nat(2, 'spring energy', r`A force of 8 N stretches a spring by 4 cm. Find the energy stored in the spring at this extension (in J).`, 0.16, 0.002,
    r`$k = F/x = 8/0.04 = 200\ \mathrm{N\,m^{-1}}$. $U = \tfrac12kx^2 = \tfrac12\times200\times0.04^2 = 0.16$ J. Equivalently $U = \tfrac12Fx$.`, { unit: 'J', calc: () => 0.5 * 8 * 0.04 }),
  mcq(2, 'units', r`The dimensions of power are`, r`$ML^2T^{-3}$`, [r`$ML^2T^{-2}$`, r`$MLT^{-2}$`, r`$ML^{2}T^{-1}$`],
    r`Power is work divided by time. Work has dimensions $ML^2T^{-2}$, so power has $ML^2T^{-3}$.`),

  // ---------- Level 3 ----------
  nat(3, 'conservation of energy', r`A pendulum bob on a light string of length 0.9 m is released from rest with the string at $60^\circ$ to the vertical. Find its speed at the lowest point (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 3, 0,
    r`The bob falls through $L(1-\cos60^\circ) = 0.9\times0.5 = 0.45$ m. $v = \sqrt{2gh} = \sqrt{2\times10\times0.45} = 3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(2 * 10 * 0.9 * 0.5), trap: 'The fall is L(1 − cos θ), not L cos θ.' }),
  nat(3, 'power', r`A lift cabin of mass 2000 kg rises at a steady $2\ \mathrm{m\,s^{-1}}$ against a constant frictional force of 4000 N. Find the power of the motor (in kW, $g = 10$).`, 48, 0,
    r`At constant speed the pull equals weight plus friction: $20\,000 + 4000 = 24\,000$ N. $P = Fv = 24\,000\times2 = 48\,000$ W $= 48$ kW.`, { unit: 'kW', calc: () => (2000 * 10 + 4000) * 2 / 1000 }),
  nat(3, 'work by variable force', r`A force $F = (4x + 2)$ N acts on a body along the $x$-axis ($x$ in m). Find the work done as the body moves from $x = 1$ m to $x = 3$ m (in J).`, 20, 0,
    r`$W = \int_1^3 (4x+2)\,dx = \left[2x^2 + 2x\right]_1^3 = (18+6) - (2+2) = 20$ J.`, { unit: 'J', calc: () => (2 * 9 + 6) - (2 + 2) }),
  mcq(3, 'kinetic energy', r`A constant net force acts on a body that starts from rest. The graph of its kinetic energy against the distance travelled is`, 'a straight line through the origin', ['a parabola opening upwards', 'a horizontal line', 'a hyperbola'],
    r`By the work-energy theorem $K = Fx$ for a constant force from rest, so $K$ is proportional to $x$: a straight line through the origin. (Against time it would be a parabola, since $K\propto t^2$.)`, { trap: 'Against time the graph is a parabola; against distance it is a line.' }),
  nat(3, 'conservation of energy', r`A ball is thrown vertically upward from the ground at $20\ \mathrm{m\,s^{-1}}$. At what height above the ground are its kinetic and potential energies equal (in m, $g = 10$)?`, 10, 0,
    r`Total energy per unit mass $= \tfrac12(20)^2 = 200$ J/kg. When $K = U$, each is 100 J/kg, so $gh = 100$ and $h = 10$ m.`, { unit: 'm', calc: () => 200 / 2 / 10 }),
  nat(3, 'springs', r`A toy gun has a spring of constant $500\ \mathrm{N\,m^{-1}}$ compressed by 4 cm. It fires a 20 g pellet vertically upward. Find the height the pellet rises above the point where it was released (in m, $g = 10$; the energy of the spring all goes into the pellet).`, 2, 0,
    r`Spring energy $= \tfrac12\times500\times0.04^2 = 0.4$ J. This becomes $mgh$ above the release point: $h = 0.4/(0.02\times10) = 2$ m.`, { unit: 'm', calc: () => 0.5 * 500 * 0.0016 / (0.02 * 10) }),
  nat(3, 'power', r`A jet of water leaves a nozzle at $5\ \mathrm{m\,s^{-1}}$ through an opening of area $4\times10^{-4}\ \mathrm{m^2}$. Find the kinetic energy carried by the jet each second (in W; density of water $1000\ \mathrm{kg\,m^{-3}}$).`, 25, 0,
    r`Mass per second $= \rho Av = 1000\times4\times10^{-4}\times5 = 2$ kg/s. Power $= \tfrac12(2)(5)^2 = 25$ W.`, { unit: 'W', calc: () => 0.5 * 1000 * 4e-4 * 5 * 25 }),
  mcq(3, 'work by friction', r`A block slides down a rough incline. The decrease in its mechanical energy equals`, 'the magnitude of the work done by friction', ['the work done by gravity', 'the work done by the normal force', 'the gain in its kinetic energy'],
    r`$\Delta(K+U) = W_{\text{non-conservative}}$. Only friction does non-conservative work here (the normal force does none), so the mechanical energy falls by the magnitude of friction's work, which appears as heat.`),
  nat(3, 'work-energy theorem', r`A 1200 kg car moving at 72 km/h is brought to rest in 40 m by a constant braking force. Find the braking force (in N).`, 6000, 0,
    r`$72\ \mathrm{km\,h^{-1}} = 20\ \mathrm{m\,s^{-1}}$. $K = \tfrac12\times1200\times400 = 240\,000$ J. $F\times40 = 240\,000$, so $F = 6000$ N.`, { unit: 'N', calc: () => 0.5 * 1200 * 400 / 40, trap: 'Change km/h to m/s first.' }),
  nat(3, 'potential energy curve', r`A particle moves in the potential energy $U(x) = (x^3 - 12x)$ joule ($x$ in m). Find the force on it at $x = 1$ m (in N, with sign along $+x$).`, 9, 0,
    r`$F = -dU/dx = -(3x^2 - 12)$. At $x=1$: $F = -(3-12) = +9$ N, towards $+x$.`, { unit: 'N', calc: () => -(3 - 12) }),
  nat(3, 'conservation of energy', r`A stone is thrown horizontally at $10\ \mathrm{m\,s^{-1}}$ from the top of a 20 m cliff. Find its speed when it reaches the ground (in $\mathrm{m\,s^{-1}}$, to 2 decimals; ignore air, $g=10$).`, 22.36, 0.01,
    r`$\tfrac12v^2 = \tfrac12(10)^2 + gh = 50 + 200 = 250$, so $v = \sqrt{500} = 22.36\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(500) }),
  nat(3, 'work by constant force', r`A 2 kg block at rest is lifted vertically by a steady 30 N force through 4 m. Find its kinetic energy at the end (in J, $g = 10$).`, 40, 0,
    r`Net force $= 30 - 20 = 10$ N upward. Net work $= 10\times4 = 40$ J, which is the kinetic energy gained from rest.`, { unit: 'J', calc: () => (30 - 20) * 4, trap: 'The work of the 30 N force is 120 J, but gravity takes 80 J of it.' }),
  nat(3, 'springs', r`Two springs of constants $200\ \mathrm{N\,m^{-1}}$ and $300\ \mathrm{N\,m^{-1}}$ are joined end to end (in series) and pulled by a force of 60 N. Find the total energy stored in them (in J).`, 15, 0,
    r`In series $\dfrac1k = \dfrac1{200}+\dfrac1{300} = \dfrac{5}{600}$, so $k = 120\ \mathrm{N\,m^{-1}}$. $x = 60/120 = 0.5$ m and $U = \tfrac12\times120\times0.25 = 15$ J. (Check: $F^2/2k_1 + F^2/2k_2 = 9 + 6 = 15$ J.)`, { unit: 'J', calc: () => 60 * 60 / (2 * 200) + 60 * 60 / (2 * 300) }),
  nat(3, 'kinetic energy and momentum', r`A 4 kg body has a momentum of $12\ \mathrm{kg\,m\,s^{-1}}$. Find its kinetic energy (in J).`, 18, 0,
    r`$K = p^2/(2m) = 144/8 = 18$ J.`, { unit: 'J', calc: () => 144 / 8 }),
  nat(3, 'conservation of energy', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $30^\circ$ above the horizontal from the ground. Find its speed when it is 8 m above the ground (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g=10$, ignore air).`, 15.49, 0.02,
    r`Only gravity acts, so $\tfrac12v^2 = \tfrac12(20)^2 - g(8) = 200 - 80 = 120$. $v = \sqrt{240} = 15.49\ \mathrm{m\,s^{-1}}$. The angle does not matter.`, { unit: 'm/s', calc: () => Math.sqrt(400 - 160) }),
  nat(3, 'power', r`A force $\vec F = (3\hat i + 4\hat j)$ N acts on a particle moving with velocity $\vec v = (2\hat i - \hat j)\ \mathrm{m\,s^{-1}}$. Find the instantaneous power of the force (in W).`, 2, 0,
    r`$P = \vec F\cdot\vec v = 3\times2 + 4\times(-1) = 6 - 4 = 2$ W.`, { unit: 'W', calc: () => 3 * 2 + 4 * -1 }),
  asrt(3, 'kinetic energy and momentum', r`Two bodies with the same momentum but different masses have different kinetic energies.`, r`For a given momentum, kinetic energy is $p^2/2m$, which depends on the mass.`, 0,
    r`$K = p^2/(2m)$. With $p$ fixed, the lighter body has the larger kinetic energy. Both true, and R explains A.`),
  asrt(3, 'work-energy theorem', r`Two bodies with equal kinetic energy are stopped by equal constant retarding forces. They travel equal distances before stopping.`, r`The work done by the retarding force equals the kinetic energy lost, $Fd = K$.`, 0,
    r`$Fd = K$, so $d = K/F$ is the same for both bodies, whatever their masses. Both true, and R explains A.`),
  stm(3, 'work-energy theorem', r`The work-energy theorem holds in every inertial frame.`, r`The work done by a force and the kinetic energy of a body have the same values in all inertial frames.`, 2,
    r`Statement I is true: in each inertial frame $W_{net} = \Delta K$ with that frame's values. Statement II is false: velocities and displacements differ between frames, so $K$ and $W$ have different values (only their relation stays the same).`),

  // ---------- Level 4 ----------
  nat(4, 'work-energy theorem', r`A 5 kg hammer moving at $4\ \mathrm{m\,s^{-1}}$ strikes a nail and drives it 2 cm into a block, coming to rest. Find the average resistive force on the hammer (in N). Ignore the weight of the hammer during the blow.`, 2000, 0,
    r`$K = \tfrac12\times5\times16 = 40$ J. $F\times0.02 = 40$, so $F = 2000$ N.`, { unit: 'N', calc: () => 0.5 * 5 * 16 / 0.02 }),
  nat(4, 'circular motion', r`A 2 kg block slides from rest down a smooth quarter-circular track of radius 1.2 m and reaches the lowest point. Find the normal force of the track on it there (in N, $g = 10$).`, 60, 0,
    r`$v^2 = 2gR$. At the bottom $N - mg = mv^2/R = 2mg$, so $N = 3mg = 3\times2\times10 = 60$ N. The radius cancels out.`, { unit: 'N', calc: () => 3 * 2 * 10 }),
  nat(4, 'power', r`A machine gun fires 20 bullets each second. Each bullet has mass 25 g and leaves the barrel at $400\ \mathrm{m\,s^{-1}}$. Find the power of the gun (in kW).`, 40, 0,
    r`Kinetic energy of one bullet $= \tfrac12\times0.025\times400^2 = 2000$ J. Power $= 20\times2000 = 40\,000$ W $= 40$ kW.`, { unit: 'kW', calc: () => 20 * 0.5 * 0.025 * 400 * 400 / 1000 }),
  nat(4, 'springs', r`A 1 kg block and a 3 kg block rest on a smooth table with a light spring ($k = 200\ \mathrm{N\,m^{-1}}$) compressed by 0.1 m between them (not attached). They are released. Find the speed of the 1 kg block after it leaves the spring (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 1.22, 0.01,
    r`Spring energy $= \tfrac12\times200\times0.01 = 1$ J. Momentum: $1\cdot v_1 = 3v_2$, so $v_1 = 3v_2$. Energy: $\tfrac12(1)(9v_2^2) + \tfrac12(3)v_2^2 = 6v_2^2 = 1$, so $v_2^2 = 1/6$ and $v_1^2 = 9/6 = 1.5$. $v_1 = 1.22\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(1.5), trap: 'The spring energy is shared between both blocks; the lighter one gets three quarters of it.' }),
  nat(4, 'work by friction', r`A block slides from rest down a $37^\circ$ incline of height 3 m (length 5 m) and then onto a horizontal floor. The coefficient of kinetic friction is 0.5 on both. How far does it slide on the floor before it stops (in m)? Take $\sin37^\circ=0.6$, $\cos37^\circ=0.8$.`, 2, 0,
    r`Friction on the incline: $\mu mg\cos37^\circ\times5 = 0.5\times0.8\times5\,mg = 2mg$. Energy: $mg(3) - 2mg = \mu mg\,d$, so $1 = 0.5\,d$ and $d = 2$ m.`, { unit: 'm', calc: () => (3 - 0.5 * 0.8 * 5) / 0.5 }),
  nat(4, 'work by variable force', r`A 5 kg bucket is raised slowly from the bottom of a 20 m deep well by a uniform rope of mass 1 kg per metre (the whole rope hangs in the well at the start). Find the total work done in raising the bucket to the top (in J, $g = 10$).`, 3000, 0,
    r`When the bucket has risen $x$ the load is the bucket $50$ N plus the rope still hanging, $10(20 - x)$ N. $W = \int_0^{20}\left[50 + 10(20-x)\right]dx = 1000 + 2000 = 3000$ J.`, { unit: 'J', calc: () => 50 * 20 + 10 * (400 - 200) }),
  nat(4, 'springs', r`A 1 kg block on a rough floor ($\mu = 0.2$) is attached to a horizontal spring ($k = 100\ \mathrm{N\,m^{-1}}$). The spring is stretched by 0.2 m and the block is released. Find the speed of the block when it first passes the natural length of the spring (in $\mathrm{m\,s^{-1}}$, 2 decimals, $g = 10$).`, 1.79, 0.01,
    r`Spring energy $= \tfrac12\times100\times0.04 = 2$ J. Friction ($\mu mg = 2$ N) over 0.2 m removes 0.4 J. So $\tfrac12v^2 = 1.6$ and $v = \sqrt{3.2} = 1.79\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(3.2) }),
  nat(4, 'vertical circle', r`A 0.3 kg stone is whirled in a vertical circle on a light string and just keeps the string taut or more all the way round. Find the difference between the tension at the lowest point and at the highest point (in N, $g = 10$).`, 18, 0,
    r`Bottom: $T_b - mg = mv_b^2/R$. Top: $T_t + mg = mv_t^2/R$. Energy: $v_b^2 = v_t^2 + 4gR$. Subtracting: $T_b - T_t = 2mg + 4mg = 6mg = 6\times0.3\times10 = 18$ N, whatever the speed.`, { unit: 'N', calc: () => 6 * 0.3 * 10 }),
  nat(4, 'power', r`Water falls from a height of 50 m on to a turbine at the rate of 120 kg each second. The turbine and generator together are 80% efficient. Find the electrical power output (in kW, $g = 10$).`, 48, 0,
    r`Power available $= 120\times10\times50 = 60\,000$ W. Output $= 0.8\times60\,000 = 48\,000$ W $= 48$ kW.`, { unit: 'kW', calc: () => 120 * 10 * 50 * 0.8 / 1000 }),
  nat(4, 'work-energy theorem', r`A bullet moving at $200\ \mathrm{m\,s^{-1}}$ penetrates 9 cm into a wooden block, which resists with a constant force. At what speed must an identical bullet strike the block to penetrate 16 cm (in $\mathrm{m\,s^{-1}}$)?`, 266.7, 0.5,
    r`$\tfrac12mv^2 = F\,d$, so $v^2\propto d$ and $v\propto\sqrt d$. $v = 200\sqrt{16/9} = 200\times\tfrac43 = 266.7\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => 200 * Math.sqrt(16 / 9), trap: 'Speed goes as the square root of the depth, not the depth itself.' }),
  nat(4, 'conservation of energy', r`A 3 kg block on a rough horizontal table ($\mu = 0.2$) is tied by a light string over a smooth light pulley at the edge to a 2 kg block hanging freely. The system is released from rest. Find the speed when the hanging block has fallen 1 m (in $\mathrm{m\,s^{-1}}$, 2 decimals, $g=10$).`, 2.37, 0.01,
    r`Work by gravity on the hanging block $= 2\times10\times1 = 20$ J. Friction on the table block $= 0.2\times3\times10\times1 = 6$ J. Net $= 14$ J $= \tfrac12(3+2)v^2$, so $v^2 = 5.6$ and $v = 2.37\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(2 * 14 / 5) }),
  nat(4, 'springs', r`A 1 kg block hangs at rest from a light vertical spring of constant $250\ \mathrm{N\,m^{-1}}$. It is pulled down a further 0.2 m and released. Find its kinetic energy as it passes the equilibrium position (in J).`, 5, 0,
    r`Between these two positions gravity and the spring together act like a spring of constant $k$ about the equilibrium point, so the energy is $\tfrac12kA^2 = \tfrac12\times250\times0.04 = 5$ J. (Direct check: spring energy released $=\tfrac12 k[(x_0+0.2)^2 - x_0^2]$ with $x_0 = 0.04$ m, minus $mg(0.2)$, again 5 J.)`, { unit: 'J', calc: () => 0.5 * 250 * ((0.04 + 0.2) ** 2 - 0.04 ** 2) - 1 * 10 * 0.2 }),
  nat(4, 'potential energy', r`A 4 kg block is pushed very slowly along the smooth inner surface of a hemispherical bowl of radius 0.5 m from the bottom to the point where the radius makes $60^\circ$ with the vertical. Find the work done by the pusher (in J, $g = 10$).`, 10, 0,
    r`Slow motion, so the work done equals the gain in potential energy: $mgR(1-\cos60^\circ) = 4\times10\times0.5\times0.5 = 10$ J.`, { unit: 'J', calc: () => 4 * 10 * 0.5 * (1 - 0.5) }),
  nat(4, 'power', r`A body of mass 2 kg is acted on by a constant power of 12 W from rest, with no other force along its line of motion. Find the distance it covers while its speed rises from 0 to $6\ \mathrm{m\,s^{-1}}$ (in m).`, 12, 0,
    r`$Pt = \tfrac12mv^2$ gives $t = 36/12 = 3$ s. Also $v = \sqrt{2Pt/m} = \sqrt{12t}$, so $x = \int_0^3\sqrt{12t}\,dt = \sqrt{12}\cdot\tfrac23\cdot3^{3/2} = 12$ m. (General result: $x = mv^3/3P$.)`, { unit: 'm', calc: () => 2 * 216 / (3 * 12) }),
  nat(4, 'work-energy theorem', r`A 0.2 kg ball is dropped from 5 m above soft sand and sinks 10 cm into it before stopping. Find the average resistive force of the sand (in N, $g=10$).`, 102, 0,
    r`Total fall $= 5 + 0.1 = 5.1$ m, from rest to rest, so net work is zero: $mg(5.1) = F(0.1)$. $F = 0.2\times10\times5.1/0.1 = 102$ N.`, { unit: 'N', calc: () => 0.2 * 10 * 5.1 / 0.1, trap: 'Gravity also acts while the ball sinks into the sand.' }),
  nat(4, 'vertical circle', r`A 0.5 kg bob on a 1 m string is released from the horizontal position. When the string becomes vertical it catches a nail 0.6 m below the pivot, so the bob continues on a smaller circle. Find the tension in the string just after it meets the nail (in N, $g=10$).`, 30, 0,
    r`At the bottom $v^2 = 2gL = 20$. The new radius is $r = 1 - 0.6 = 0.4$ m. $T - mg = mv^2/r$, so $T = 5 + 0.5\times20/0.4 = 5 + 25 = 30$ N.`, { unit: 'N', calc: () => 0.5 * 10 + 0.5 * 20 / 0.4 }),
  nat(4, 'potential energy curve', r`A 2 kg particle is in the potential energy $U(x) = [4(x-1)^2 - 3]$ joule ($x$ in m). It makes small oscillations about its equilibrium. Find the period (in s, 2 decimals).`, 3.14, 0.01,
    r`Compare $U = \tfrac12k(x-1)^2 - 3$: $\tfrac12k = 4$, so $k = 8\ \mathrm{N\,m^{-1}}$. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{2/8} = \pi = 3.14$ s. (In fact the oscillations are exactly SHM here.)`, { unit: 's', calc: () => 2 * Math.PI * Math.sqrt(2 / 8) }),
  nat(4, 'variable force', r`A non-linear spring exerts a restoring force of magnitude $F = (20x + 40x^2)$ N when stretched by $x$ metres. Find the work done in stretching it from $x = 0$ to $x = 0.5$ m (in J, 2 decimals).`, 4.17, 0.01,
    r`$W = \int_0^{0.5}(20x + 40x^2)\,dx = \left[10x^2 + \tfrac{40}{3}x^3\right]_0^{0.5} = 2.5 + 1.667 = 4.17$ J.`, { unit: 'J', calc: () => 10 * 0.25 + 40 / 3 * 0.125 }),
  nat(4, 'potential energy curve', r`A 2 kg particle moves along $x$ in the potential energy $U(x) = (3x^2 - 12x + 5)$ joule. At $x = 0$ it moves towards $+x$ with speed $6\ \mathrm{m\,s^{-1}}$. Find the largest value of $x$ it reaches (in m).`, 6, 0,
    r`Total energy $= \tfrac12\times2\times36 + U(0) = 36 + 5 = 41$ J. At a turning point $U = 41$: $3x^2 - 12x - 36 = 0$, so $x^2 - 4x - 12 = 0$ and $x = 6$ or $-2$. Moving towards $+x$, the farthest point is $x = 6$ m.`, { unit: 'm', calc: () => (4 + Math.sqrt(16 + 48)) / 2 }),
  mcq(4, 'springs', r`A spring of constant $k$ is cut into two pieces whose lengths are in the ratio $1:3$. The spring constant of the longer piece is`, r`$\dfrac{4k}{3}$`, [r`$\dfrac{3k}{4}$`, r`$4k$`, r`$3k$`],
    r`The constant of a spring is inversely proportional to its length. The longer piece is $3/4$ of the original length, so its constant is $\dfrac43k$ (the shorter piece, $1/4$ of the length, has $4k$).`),
  asrt(4, 'conservative forces', r`A satellite in a circular orbit has a constant kinetic energy.`, r`The gravitational force on the satellite is always perpendicular to its velocity, so it does no work on it.`, 0,
    r`The speed is constant, so $K$ is constant. The force points to the centre while the velocity is along the tangent, so $W = \int\vec F\cdot d\vec s = 0$. Both true, and R explains A.`),
  asrt(4, 'springs', r`The work done in compressing a spring by $x$ from its natural length equals the work done in stretching it by $x$.`, r`The energy stored in an ideal spring depends on the square of its displacement from the natural length.`, 0,
    r`$U = \tfrac12kx^2$ is the same for $+x$ and $-x$. Both true, and R explains A.`),
  asrt(4, 'potential energy curve', r`A particle can be in equilibrium at a point where its potential energy is a maximum.`, r`At every point of equilibrium the potential energy is a minimum.`, 2,
    r`Equilibrium needs $F = -dU/dx = 0$, which holds at maxima and minima. At a maximum it is unstable but still an equilibrium, so A is true. R is false because it denies that.`),
  stm(4, 'springs', r`When a spring of constant $k$ is cut into two equal parts, each part has a spring constant $2k$.`, r`When pulled by the same force $F$, each half stores half the energy stored in the original spring.`, 0,
    r`Halving the length doubles the constant, so I is true. $U = F^2/2k$, so with $2k$ the energy is $F^2/4k$, half of the original: II is true.`),
  stm(4, 'power', r`The power of a machine is the work it does per unit time.`, r`A machine rated at 2 kW does 2 kWh of work in every hour that it is switched on.`, 2,
    r`I is the definition of power. II is false: 2 kW is the greatest (rated) power, and the machine does 2 kWh in an hour only if it works at that rating all the time.`),
  stm(4, 'potential energy', r`The gravitational potential energy of a body can be negative.`, r`Only changes in potential energy have physical meaning, because the zero level is chosen by us.`, 0,
    r`Below the chosen zero level (for example the floor of a room, or at a finite distance from the Earth with zero at infinity) $U$ is negative: I is true. $U$ is fixed only up to an additive constant, and only differences matter: II is true.`),
  msq(4, 'power', r`A car of constant engine power $P$ moves on a level road against a constant resistance $f$. Which are correct?`,
    ['Its top speed is $P/f$', 'Its acceleration is zero at the top speed', 'The driving force increases as the speed rises', 'It reaches the top speed in a finite time'],
    [0, 1],
    r`At top speed the driving force $P/v$ equals $f$, so $v_{max} = P/f$ and $a = 0$. The driving force $P/v$ falls as $v$ rises, so C is false. The acceleration shrinks to zero as the speed approaches $P/f$, so the car only approaches it and never reaches it in finite time: D is false.`),
  msq(4, 'springs', r`A block on a smooth horizontal surface oscillates on a light spring between $x = -A$ and $x = +A$. Which are correct?`,
    ['Its kinetic energy is greatest at the mean position', 'The sum of kinetic and spring energies is $\\tfrac12kA^2$ at every instant', 'The power of the spring force is greatest at the extreme positions', 'The work done by the spring force over one full oscillation is zero'],
    [0, 1, 3],
    r`Energy is conserved, with total $\tfrac12kA^2$; all of it is kinetic at the mean position. Power $=\vec F\cdot\vec v$ is zero at the extremes because the speed is zero, so C is false. Over a full cycle the kinetic energy returns to its start, so the net work is zero.`),
  msq(4, 'conservative forces', r`Which of these force fields (with $x, y$ in metres) are conservative?`,
    [r`$\vec F = 2xy\,\hat i + x^2\,\hat j$`, r`$\vec F = y\,\hat i - x\,\hat j$`, r`$\vec F = y^2\,\hat i + x^2\,\hat j$`, r`$\vec F = x^2\,\hat i + y^2\,\hat j$`],
    [0, 3],
    r`A field is conservative if $\partial F_y/\partial x = \partial F_x/\partial y$. A: $2x = 2x$ (yes, $U = -x^2y$). B: $-1 \ne 1$. C: $2x \ne 2y$. D: $0 = 0$ (yes).`),
  msq(4, 'kinetic energy and momentum', r`Two bodies of masses $m$ and $4m$ have equal kinetic energy. Which are correct?`,
    ['Their momenta are in the ratio $1:2$', 'Their speeds are in the ratio $2:1$', 'The heavier body has the greater momentum', 'Under equal constant retarding forces, the lighter body stops in the shorter distance'],
    [0, 1, 2],
    r`$p = \sqrt{2mK}$ gives $p_1:p_2 = 1:2$. $v = \sqrt{2K/m}$ gives $v_1:v_2 = 2:1$. The stopping distance is $K/F$, equal for both, so D is false.`),
  msq(4, 'work by variable force', r`A body starts from rest at $x = 0$ and moves along $x$ under the force $F = (8 - 2x)$ N ($x$ in m). Which are correct?`,
    ['The work done from $x = 0$ to $x = 4$ m is 16 J', 'The work done from $x = 4$ m to $x = 6$ m is $-4$ J', 'The net work from $x = 0$ to $x = 6$ m is 12 J', 'Its kinetic energy is greatest at $x = 6$ m'],
    [0, 1, 2],
    r`$W_{0\to4} = [8x - x^2]_0^4 = 16$ J. $W_{4\to6} = (48 - 36) - 16 = -4$ J. The net is $12$ J. The force changes sign at $x = 4$, where the kinetic energy is greatest, so D is false.`),
  msq(4, 'conservation of energy', r`Three identical balls are thrown from the same height with the same speed: one upward, one downward and one horizontally. Ignore air. Which are correct?`,
    ['All reach the ground with the same speed', 'All have the same change in kinetic energy by the time they reach the ground', 'All take the same time to reach the ground', 'The ball thrown upward takes the longest'],
    [0, 1, 3],
    r`Gravity is conservative and the starting energy and the drop are equal, so the final speeds (and kinetic energy changes) are equal. The times differ: the upward ball spends extra time rising and falling back, so it takes longest and the downward ball is quickest.`),
  msq(4, 'power', r`A constant force $F$ acts on a body of mass $m$ that starts from rest. Which are correct?`,
    ['The power at time $t$ is $F^2t/m$', 'The average power over the first $t$ seconds is $F^2t/2m$', 'The instantaneous power grows in proportion to $t$', 'The average power over the first $t$ seconds equals the instantaneous power at $t$'],
    [0, 1, 2],
    r`$v = Ft/m$, so $P = Fv = F^2t/m \propto t$. The average of a quantity growing linearly from 0 is half the final value: $F^2t/2m$. D is false.`),
  stm(4, 'conservation of energy', r`A ball is thrown at an angle above the horizontal. Its kinetic energy at the highest point is zero.`, r`At the highest point the vertical component of the velocity is zero.`, 3,
    r`Statement I is false: the horizontal component of velocity stays, so the ball still has kinetic energy $\tfrac12m(u\cos\theta)^2$ at the top. Statement II is true.`),
  nat(4, 'conservation of energy', r`A block of mass 2 kg slides from rest down a smooth $30^\circ$ incline and hits a light spring ($k = 500\ \mathrm{N\,m^{-1}}$) fixed along the incline, 1 m from the block. Find the greatest compression of the spring (in m, 3 decimals; $g = 10$).`, 0.221, 0.002,
    r`Gravity along the incline: $mg\sin30^\circ = 10$ N. Energy: $10(1 + x) = \tfrac12\times500\,x^2$, so $25x^2 - x - 1 = 0$ and $x = \dfrac{1+\sqrt{101}}{50} = 0.221$ m.`, { unit: 'm', calc: () => (1 + Math.sqrt(101)) / 50, trap: 'The block keeps falling while it compresses the spring.' }),

  // ---------- Level 5 ----------
  nat(5, 'vertical circle', r`A small block slides from rest down a smooth track into a vertical loop of radius 40 cm. At the top of the loop the track pushes on the block with a force equal to its weight. From what height above the bottom of the loop was it released (in cm)?`, 120, 0,
    r`At the top $N + mg = mv^2/R$ with $N = mg$, so $v^2 = 2gR$. Energy: $gh = g(2R) + \tfrac12v^2 = 2gR + gR = 3gR$, so $h = 3R = 120$ cm.`, { unit: 'cm', calc: () => 3 * 40 }),
  nat(5, 'work by friction', r`A 2 kg block moving at $4\ \mathrm{m\,s^{-1}}$ enters a rough surface where the coefficient of friction increases with distance as $\mu = 0.25x$ ($x$ in m from the edge). How far does it travel on the rough surface before stopping (in m, 2 decimals; $g = 10$)?`, 2.53, 0.02,
    r`Friction $= \mu mg = 0.25x\,mg$. Work-energy: $\tfrac12mv^2 = \int_0^s 0.25x\,mg\,dx = 0.125\,mg\,s^2$. The mass cancels: $8 = 1.25\,s^2$, so $s^2 = 6.4$ and $s = 2.53$ m.`, { unit: 'm', calc: () => Math.sqrt(6.4) }),
  mcq(5, 'vertical circle', r`A bob on a string of length $L$ is released from rest with the string horizontal. A nail is fixed at a distance $d$ vertically below the pivot, so that the bob swings round the nail when the string becomes vertical. The least value of $d/L$ for the bob to complete a full circle about the nail is`, '3/5', ['2/5', '1/2', '4/5'],
    r`At the bottom $v^2 = 2gL$. The new radius is $r = L - d$, and completing the circle needs $v^2 \ge 5gr$. So $2gL \ge 5g(L-d)$, giving $d \ge 3L/5$. The least $d/L$ is $3/5$ (the radius is then $2L/5$).`, { trap: 'The condition is on the new radius L − d, not on d.' }),
  mcq(5, 'concepts', r`How many of these are correct? (a) The work done by a force can be negative. (b) Kinetic energy can be negative. (c) The tension in a pendulum string does zero work on the bob. (d) The net work done on a body moving at constant speed along a curved path is zero. (e) Power is a vector.`, '3', ['2', '4', '5'],
    r`(a) true: it is negative when the force opposes the displacement. (b) false: $\tfrac12mv^2\ge0$. (c) true: the tension is perpendicular to the velocity. (d) true: the speed is constant, so $\Delta K = 0$. (e) false: power is $\vec F\cdot\vec v$, a scalar. Three are correct.`),
  mcq(5, 'kinetic energy', r`A particle of mass $m$ moves on a circle of radius $R$ with kinetic energy $K = ks^2$, where $s$ is the distance travelled along the circle and $k$ is a constant. The magnitude of the net force on it is`, r`$2ks\sqrt{1 + s^2/R^2}$`, [r`$2ks$`, r`$\dfrac{2ks^2}{R}$`, r`$2ks\left(1 + \dfrac{s^2}{R^2}\right)$`],
    r`$v^2 = 2ks^2/m$, so $v = s\sqrt{2k/m}$. Tangential acceleration $a_t = v\,dv/ds = 2ks/m$, so $F_t = 2ks$. Radial acceleration $a_c = v^2/R$, so $F_c = 2ks^2/R$. The magnitude is $\sqrt{F_t^2 + F_c^2} = 2ks\sqrt{1 + s^2/R^2}$.`),
  mcq(5, 'power', r`A constant power $P$ acts on a body of mass $m$ starting from rest (no other force along its path). The distance it covers in time $t$ is`, r`$\sqrt{\dfrac{8P}{9m}}\;t^{3/2}$`, [r`$\sqrt{\dfrac{2P}{m}}\;t^{3/2}$`, r`$\dfrac{P}{2m}\,t^{2}$`, r`$\sqrt{\dfrac{2P}{m}}\;t^{1/2}$`],
    r`$v = \sqrt{2Pt/m}$, so $x = \int_0^t\sqrt{2P/m}\,t^{1/2}\,dt = \tfrac23\sqrt{2P/m}\,t^{3/2}$. Squaring the coefficient gives $\tfrac49\cdot\tfrac{2P}{m} = \tfrac{8P}{9m}$.`),
  msq(5, 'circular motion', r`A small block starts from rest at the top of a smooth fixed sphere of radius $R$ and slides down. Which are correct?`,
    [r`It leaves the surface when the radius to the block makes an angle $\theta$ with the vertical where $\cos\theta = 2/3$`, r`Its speed when it leaves the surface is $\sqrt{2gR/3}$`, r`The normal force is zero at the instant it leaves`, r`It leaves the surface after dropping a height $2R/3$ from the top`],
    [0, 1, 2],
    r`$v^2 = 2gR(1-\cos\theta)$ and it leaves when $mg\cos\theta = mv^2/R$ (normal force zero), giving $\cos\theta = 2/3$ and $v^2 = 2gR/3$. The drop from the top is $R(1-\cos\theta) = R/3$, not $2R/3$: D is false.`),
  msq(5, 'potential energy curve', r`A particle moves in the potential energy $U(x) = \left(\dfrac{x^3}{3} - x\right)$ joule ($x$ in m). Which are correct?`,
    ['$x = 1$ m is a position of stable equilibrium', '$x = -1$ m is a position of unstable equilibrium', 'The force at $x = 0$ is $+1$ N along $+x$', 'The potential energy at $x = 1$ m is $+2/3$ J'],
    [0, 1, 2],
    r`$F = -(x^2 - 1)$, zero at $x = \pm1$. $U'' = 2x$ is positive at $x=1$ (stable) and negative at $x=-1$ (unstable). $F(0) = +1$ N. $U(1) = \tfrac13 - 1 = -\tfrac23$ J, so D is false.`),
  msq(5, 'conservative forces', r`A bead moves on a smooth horizontal circular wire of radius $R$ under a force of constant magnitude $F$ always along its velocity (tangent to the wire). Which are correct?`,
    ['The work done by the force in one revolution is $2\\pi RF$', 'The force is non-conservative', 'The normal force of the wire does no work', 'The work done by the force in half a revolution is zero'],
    [0, 1, 2],
    r`The force is along every small displacement, so the work is $F\times$ path $= 2\pi RF$ per revolution, not zero over a closed path: non-conservative. The wire's push is radial, perpendicular to the motion. In half a revolution the work is $\pi RF$, so D is false.`),
  msq(5, 'conservation of energy', r`Blocks of mass $m$ and $2m$ hang from the ends of a light string over a smooth light pulley and are released. When the heavier block has fallen a height $h$, which are correct?`,
    [r`The speed is $\sqrt{2gh/3}$`, r`The acceleration is $g/3$`, r`The tension is $4mg/3$`, r`The mechanical energy of the heavier block alone is conserved`],
    [0, 1, 2],
    r`$a = (2m - m)g/3m = g/3$ and $v = \sqrt{2ah} = \sqrt{2gh/3}$. Tension: $T = m(g + a) = 4mg/3$. The tension does negative work on the heavier block, so its own mechanical energy falls: D is false. (Only the system's energy is conserved.)`),
  asrt(5, 'work by friction', r`The work done by static friction on a rolling wheel (rolling without slipping on a fixed surface) is zero.`, r`The point of the wheel in contact with the surface is instantaneously at rest.`, 0,
    r`Power of friction $=\vec f\cdot\vec v_{contact}$, and the contact point has zero velocity, so no work is done. Both true, and R explains A.`),
  stm(5, 'conservation of energy', r`In an isolated system, the total energy is conserved even if friction acts inside it.`, r`The mechanical energy of a system is conserved whenever friction acts inside it.`, 2,
    r`I is true: energy is not lost; mechanical energy turns into internal (thermal) energy. II is false: friction converts mechanical energy into heat, so the mechanical energy falls.`),
  nat(5, 'work by variable force', r`A force $F = (20x + 40x^2)$ N (with $x$ in m) stretches a non-linear spring. Find the extra work needed to stretch it from $x = 0.5$ m to $x = 1$ m (in J, 2 decimals).`, 19.17, 0.02,
    r`$W = \left[10x^2 + \tfrac{40}{3}x^3\right]_{0.5}^{1} = (10 + 13.333) - (2.5 + 1.667) = 19.17$ J.`, { unit: 'J', calc: () => (10 + 40 / 3) - (2.5 + 40 / 3 * 0.125) }),
  nat(5, 'vertical circle', r`A 0.2 kg ball on a light string of length 0.8 m moves in a vertical circle. At the highest point its speed is $\sqrt{2gL}$ with $g = 10$ and $L$ the string length. Find the tension at the lowest point (in N).`, 14, 0,
    r`At the top $v_t^2 = 2gL$, so $T_t + mg = m(2gL)/L = 2mg$ and $T_t = mg = 2$ N. At the bottom $v_b^2 = v_t^2 + 4gL = 6gL$, so $T_b - mg = 6mg$ and $T_b = 7mg = 14$ N. Check with $T_b - T_t = 6mg = 12$ N: $14 - 2 = 12$ N.`, { unit: 'N', calc: () => 7 * 0.2 * 10 }),

  // ---------- Match the lists ----------
  mat(3, 'work by constant force', 'm5', r`Match each case in List I with the work done in List II ($g = 10\ \mathrm{m\,s^{-2}}$).`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: $mgh = 2\times10\times5 = +100$ J (p). B: $-1\times10\times3 = -30$ J (q). C: friction $\mu mg\,d = 0.5\times0.5\times10\times4 = 10$ J, negative: $-10$ J (r). D: the normal force is perpendicular to the motion: 0 (s).`),
  mat(3, 'kinetic energy', 'm6', r`The kinetic energy of a body is multiplied by the factor in List II when its speed or momentum changes as in List I (mass constant).`, 'A-q, B-s, C-r, D-p', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-q, B-r, C-s, D-p'],
    r`$K\propto v^2\propto p^2$. Speed $\times2$: $\times4$ (q). Momentum $\times3$: $\times9$ (s). Speed $\times1.5$: $\times2.25$ (r). Speed $\times1.2$: $\times1.44$ (p).`),
  mat(3, 'potential energy curve', 'm7', r`Match each potential energy $U(x)$ in List I with its position of equilibrium in List II.`, 'A-q, B-r, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-p, B-r, C-q, D-s'],
    r`Set $dU/dx = 0$. A: $2(x-2) = 0$, $x=2$ (q). B: $2x - 6 = 0$, $x = 3$ (r). C: $4x - 4 = 0$, $x = 1$ (p). D: $2x - 10 = 0$, $x = 5$ (s).`),
  mat(4, 'springs', 'm8', r`Each spring has constant $100\ \mathrm{N\,m^{-1}}$. Match each arrangement in List I with its effective constant in List II (in $\mathrm{N\,m^{-1}}$).`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-p, C-q, D-s'],
    r`Parallel: $100+100 = 200$ (r). Two in series: $100/2 = 50$ (q). Three in series: $100/3 = 33.3$ (p). A spring cut into 4 equal parts: each has $4\times100 = 400$ (s).`),
  mat(4, 'vertical circle', 'm9', r`A ball of mass $m$ on a string of length $R$ passes the lowest point with $u^2$ as in List I. Match each with the tension at the highest point in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$v_{top}^2 = u^2 - 4gR$ and $T_{top} = mv_{top}^2/R - mg$. With $u^2 = kgR$: $T_{top} = (k-5)mg$. $k=5$: 0 (p). $k=6$: $mg$ (q). $k=7$: $2mg$ (r). $k=9$: $4mg$ (s).`),
  mat(4, 'power', 'm10', r`Match each statement in List I with how the quantity varies with time $t$ in List II.`, 'A-r, B-q, C-s, D-p', ['A-r, B-q, C-p, D-s', 'A-p, B-q, C-s, D-r', 'A-q, B-r, C-s, D-p'],
    r`A: $K = F^2t^2/2m \propto t^2$ (r). B: constant power gives $v = \sqrt{2Pt/m}\propto t^{1/2}$ (q). C: constant power gives $x\propto t^{3/2}$ (s). D: $P = Fv = F^2t/m\propto t$ (p).`),
  mat(5, 'circular motion', 'm11', r`A block slides from rest from the top of a smooth hemisphere of radius $R = 0.9$ m ($g = 10\ \mathrm{m\,s^{-2}}$) and leaves the surface. Match each quantity in List I with its value in List II.`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-p, C-q, D-s'],
    r`It leaves at $\cos\theta = 2/3$ with $v^2 = 2gR/3 = 6\ \mathrm{m^2\,s^{-2}}$ (A: r). Its height above the base is $2R/3 = 0.6$ m (B: q). The drop from the top is $R/3 = 0.3$ m (C: p). Speed $=\sqrt6 = 2.45\ \mathrm{m\,s^{-1}}$ (D: s).`),
  mat(4, 'potential energy curve', 'm12', r`Match each potential energy $U(x)$ in List I with the value of $U$ at its equilibrium point in List II (in J).`, 'A-s, B-q, C-p, D-r', ['A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-p, B-q, C-s, D-r'],
    r`A: $x = 2$, $U = 8 - 16 = -8$ (s). B: $x = 3$, $U = -9 + 18 = 9$ (q). C: $x = 2$, $U = 4 - 8 + 1 = -3$ (p). D: $x = 1$, $U = -2 + 4 = 2$ (r).`),

  // ---------- Passages ----------
  pas(3, 'conservation of energy', 'p4', r`Find the speed of the block at the lowest point of the loop (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, Math.sqrt(60), 0.03, 2,
    r`Smooth track: $v = \sqrt{2gh} = \sqrt{2\times10\times3} = \sqrt{60} = 7.75\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pas(4, 'vertical circle', 'p4', r`Find the normal force of the track on the block at the top of the loop (in N).`, 5, 0, 0,
    r`At the top the height is 2 m, so $v^2 = 2g(3-2) = 20$. $N + mg = mv^2/R$, so $N = 0.5\times20/1 - 5 = 5$ N.`, { unit: 'N' }),
  pasm(5, 'vertical circle', 'p4', r`The block is now released from rest at a height of 2 m instead. What happens?`, 'It leaves the track at a point above the level of the centre of the loop', ['It reaches the top of the loop with zero speed and stops there', 'It completes the loop with a smaller speed at the top', 'It rises to the level of the centre and slides back down'],
    r`To complete the loop it needs $h \ge 2.5R = 2.5$ m. At 2 m it has more energy than needed to reach the level of the centre (1 m), so it does not slide back. But it cannot reach the top, so the normal force drops to zero at some point above the centre and the block leaves the track and moves as a projectile.`, { trap: 'Reaching the height of the top does not mean reaching the top: the speed there must be at least √(gR).' }),
  pas(3, 'power', 'p5', r`Find the power the crane must supply to the load while it rises at constant speed (in W, $g = 10$).`, 1000, 0, 0,
    r`At constant speed the tension equals the weight: $200\times10 = 2000$ N. $P = Fv = 2000\times0.5 = 1000$ W.`, { unit: 'W' }),
  pas(4, 'power', 'p5', r`The load starts from rest and speeds up uniformly to $0.5\ \mathrm{m\,s^{-1}}$ in 2 s. Find the power of the cable tension at the end of this acceleration (in W).`, 1025, 0, 0,
    r`$a = 0.5/2 = 0.25\ \mathrm{m\,s^{-2}}$. $T = m(g + a) = 200\times10.25 = 2050$ N. $P = Tv = 2050\times0.5 = 1025$ W.`, { unit: 'W' }),
  pas(3, 'power', 'p5', r`The motor is 80% efficient. Find the electrical energy it uses to raise the load by 15 m at constant speed (in kJ).`, 37.5, 0.05, 1,
    r`Useful work $= 2000\times15 = 30\,000$ J. Energy drawn $= 30\,000/0.8 = 37\,500$ J $= 37.5$ kJ.`, { unit: 'kJ' }),
);

// ---------- Number templates ----------
const tl = (x) => { const a = +x.toPrecision(3); return [a, Math.max(Math.abs(a) * 0.01, 1e-6)]; };
const COS = { 0: 1, 37: 0.8, 53: 0.6, 60: 0.5 };
const SIN = { 0: 0, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 30: 0.5, 45: Math.SQRT1_2 };
const CO2 = { 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6 };
const SI2 = { 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8 };
const gens = [
  { id: 'wep-g01', type: 'nat', level: 1, exams: EX[1], sub: 'work by constant force',
    make(rng) {
      const F = pick(rng, 10, 60, 5), d = pick(rng, 2, 12, 1), th = choose(rng, [0, 37, 53, 60]);
      const W = +(F * d * COS[th]).toFixed(6);
      return { F, d, th, answer: W, tol: 0.01, unit: 'J',
        q: `A force of ${F} N moves a box through ${d} m. The force makes an angle of ${th}° with the displacement (cos ${th}° = ${COS[th]}). Find the work done by the force (in J).`,
        sol: `W = F d cos θ = ${F} × ${d} × ${COS[th]} = ${fmt(W, 5)} J.` };
    },
    verify: (p) => p.F * p.d * Math.sqrt(1 - SIN[p.th] ** 2) },
  { id: 'wep-g02', type: 'nat', level: 1, exams: EX[1], sub: 'kinetic energy',
    make(rng) {
      const ask = choose(rng, ['K', 'v']);
      if (ask === 'K') {
        const m = int(rng, 2, 10), v = int(rng, 2, 12), K = 0.5 * m * v * v;
        return { ask, m, v, K, answer: K, tol: 0.01, unit: 'J',
          q: `A ${m} kg body moves at ${v} m/s. Find its kinetic energy (in J).`, sol: `K = ½ m v² = ½ × ${m} × ${v}² = ${fmt(K, 5)} J.` };
      }
      const m = pick(rng, 2, 10, 2), v = int(rng, 3, 12), K = 0.5 * m * v * v;
      return { ask, m, v, K, answer: v, tol: 0, unit: 'm/s',
        q: `A ${m} kg body has kinetic energy ${K} J. Find its speed (in m/s).`, sol: `v = √(2K/m) = √(2 × ${K} / ${m}) = √${v * v} = ${v} m/s.` };
    },
    verify: (p) => (p.ask === 'K' ? 0.5 * p.m * p.v * p.v : Math.sqrt(2 * p.K / p.m)) },
  { id: 'wep-g03', type: 'mcq', level: 2, exams: EX[2], sub: 'work-energy theorem',
    make(rng) {
      const m = pick(rng, 1, 8, 1), u = int(rng, 1, 6), v = u + int(rng, 2, 6);
      const W = 0.5 * m * (v * v - u * u);
      const o = numOpts(rng, W, [0.5 * m * (v - u) ** 2, m * (v * v - u * u), 0.5 * m * v * v], 'J', 4);
      return { m, u, v, W, options: o.options, answer: o.answer,
        q: `A ${m} kg body on a smooth floor speeds up from ${u} m/s to ${v} m/s. The net work done on it is`,
        sol: `Work-energy theorem: W = ½m(v² − u²) = ½ × ${m} × (${v * v} − ${u * u}) = ${fmt(W, 4)} J. The other options use (v − u)² or forget the ½, or use only the final energy.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.W, 4)} J`) },
  { id: 'wep-g04', type: 'nat', level: 2, exams: EX[2], sub: 'spring energy',
    make(rng) {
      const kk = pick(rng, 100, 800, 50), x1 = int(rng, 1, 6), x2 = x1 + int(rng, 1, 4);
      const W = 0.5 * kk * ((x2 / 100) ** 2 - (x1 / 100) ** 2);
      const [a, t] = tl(W);
      return { kk, x1, x2, answer: a, tol: t, unit: 'J',
        q: `A spring of constant ${kk} N/m is stretched from an extension of ${x1} cm to ${x2} cm. Find the work done by the stretching force (in J).`,
        sol: `W = ½k(x₂² − x₁²) = ½ × ${kk} × (${x2 / 100}² − ${x1 / 100}²) = ${fmt(W, 4)} J. Change cm to m first.` };
    },
    verify: (p) => ((p.kk * p.x1 / 100 + p.kk * p.x2 / 100) / 2) * ((p.x2 - p.x1) / 100) },
  { id: 'wep-g05', type: 'nat', level: 2, exams: EX[2], sub: 'conservation of energy',
    make(rng) {
      const [h, v] = choose(rng, [[0.05, 1], [0.2, 2], [0.45, 3], [0.8, 4], [1.25, 5], [1.8, 6], [3.2, 8], [5, 10], [7.2, 12]]);
      const th = choose(rng, [30, 37, 45, 53]);
      return { h, th, answer: v, tol: 1e-9, unit: 'm/s',
        q: `A block slides from rest down a smooth incline of angle ${th}° and drops through a vertical height of ${h} m. Find its speed at the bottom (in m/s, g = 10 m/s²).`,
        sol: `Only gravity does work, so ½mv² = mgh and v = √(2gh) = √(2 × 10 × ${h}) = ${v} m/s. The angle ${th}° does not matter.` };
    },
    verify: (p) => Math.sqrt(2 * 10 * p.h) },
  { id: 'wep-g06', type: 'nat', level: 2, exams: EX[2], sub: 'power',
    make(rng) {
      const m = pick(rng, 100, 2000, 100), h = pick(rng, 5, 30, 5), t = pick(rng, 20, 100, 10), e = choose(rng, [0.5, 0.6, 0.75, 0.8]);
      const P = m * 10 * h / (t * e);
      const [a, tt] = tl(P);
      return { m, h, t, e, answer: a, tol: tt, unit: 'W',
        q: `A motor of efficiency ${e * 100}% pumps ${m} kg of water up ${h} m in ${t} s. Find the electrical power it draws (in W, g = 10 m/s²).`,
        sol: `Useful work = mgh = ${m} × 10 × ${h} = ${m * 10 * h} J. Useful power = ${m * 10 * h}/${t} = ${fmt(m * 10 * h / t, 4)} W. Input power = useful ÷ efficiency = ${fmt(m * 10 * h / t, 4)} / ${e} = ${fmt(P, 4)} W.` };
    },
    verify: (p) => (p.m * 10 * p.h / p.e) / p.t },
  { id: 'wep-g07', type: 'nat', level: 3, exams: EX[3], sub: 'power',
    make(rng) {
      const P = choose(rng, [20, 40, 50, 60, 80]), m = choose(rng, [800, 1000, 1200, 1500]), t = int(rng, 4, 15);
      const v = Math.sqrt(2 * P * 1000 * t / m);
      const [a, tt] = tl(v);
      return { P, m, t, answer: a, tol: tt, unit: 'm/s',
        q: `A ${m} kg car starts from rest and its engine delivers a constant ${P} kW. Ignoring resistance, find its speed after ${t} s (in m/s).`,
        sol: `Energy gained = Pt = ${P * 1000} × ${t} = ${P * 1000 * t} J = ½ × ${m} × v². So v = √(2 × ${P * 1000 * t} / ${m}) = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => { let v2 = 0; const n = 1000, dt = p.t / n; for (let i = 0; i < n; i++) v2 += 2 * p.P * 1000 / p.m * dt; return Math.sqrt(v2); } },
  { id: 'wep-g08', type: 'nat', level: 3, exams: EX[3], sub: 'work-energy theorem',
    make(rng) {
      const th = choose(rng, [30, 37, 45, 53]), mu = choose(rng, [0.1, 0.2, 0.25, 0.3]), d = int(rng, 2, 12);
      const a = 10 * (SI2[th] - mu * CO2[th]), v = Math.sqrt(2 * a * d);
      const [aa, tt] = tl(v);
      return { th, mu, d, answer: aa, tol: tt, unit: 'm/s',
        q: `A block slides from rest down ${d} m of a rough incline of angle ${th}° with μ = ${mu}. Find its speed at the end (in m/s, g = 10 m/s²).`,
        sol: `Net force per kg = g(sin θ − μ cos θ) = 10 × (${fmt(SI2[th], 4)} − ${mu} × ${fmt(CO2[th], 4)}) = ${fmt(a, 4)} m/s². Work-energy: ½v² = ${fmt(a, 4)} × ${d}, so v = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => Math.sqrt(2 * (10 * SI2[p.th] * p.d - p.mu * 10 * CO2[p.th] * p.d)) },
  { id: 'wep-g09', type: 'nat', level: 3, exams: EX[3], sub: 'springs',
    make(rng) {
      const m = choose(rng, [0.5, 1, 2]), kk = choose(rng, [200, 500, 1000, 2000]), h = choose(rng, [0.2, 0.5, 1]);
      const w = m * 10, x = (w + Math.sqrt(w * w + 2 * kk * w * h)) / kk;
      const [a, tt] = tl(x * 100);
      return { m, kk, h, answer: a, tol: tt, unit: 'cm',
        q: `A ${m} kg block is dropped from ${h} m above a light vertical spring (k = ${kk} N/m) fixed on the floor. Find the greatest compression of the spring (in cm, g = 10 m/s²).`,
        sol: `Energy: mg(h + x) = ½kx². So ½kx² − mgx − mgh = 0, i.e. ${fmt(kk / 2, 4)}x² − ${fmt(w, 4)}x − ${fmt(w * h, 4)} = 0. Positive root: x = ${fmt(x, 4)} m = ${fmt(x * 100, 4)} cm.` };
    },
    verify: (p) => { let lo = 0, hi = 10; const f = (x) => 0.5 * p.kk * x * x - p.m * 10 * (x + p.h); for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } return lo * 100; } },
  { id: 'wep-g10', type: 'nat', level: 3, exams: EX[3], sub: 'vertical circle',
    make(rng) {
      const m = choose(rng, [0.1, 0.2, 0.5]), R = choose(rng, [0.4, 0.5, 0.8, 1]);
      const u = Math.ceil(Math.sqrt(50 * R)) + int(rng, 1, 3);
      const T = m * (u * u / R - 50);
      const [a, tt] = tl(T);
      return { m, R, u, answer: a, tol: tt, unit: 'N',
        q: `A ${m} kg ball on a light string of length ${R} m moves in a vertical circle. At the lowest point its speed is ${u} m/s. Find the tension at the highest point (in N, g = 10 m/s²).`,
        sol: `Energy: v_top² = u² − 4gR = ${u * u} − ${4 * 10 * R} = ${fmt(u * u - 40 * R, 4)}. At the top T + mg = mv²/R, so T = ${m} × ${fmt(u * u - 40 * R, 4)} / ${R} − ${m * 10} = ${fmt(T, 4)} N.` };
    },
    verify: (p) => { const v2 = p.u * p.u - 4 * 10 * p.R; return p.m * v2 / p.R - p.m * 10; } },
  { id: 'wep-g11', type: 'nat', level: 3, exams: EX[3], sub: 'work by variable force',
    make(rng) {
      const M = choose(rng, [4, 6, 8, 10, 12]), L = choose(rng, [1, 1.5, 2, 3]), n = choose(rng, [2, 3, 4, 5]);
      const W = M * 10 * L / (2 * n * n);
      const [a, tt] = tl(W);
      return { M, L, n, answer: a, tol: tt, unit: 'J',
        q: `A uniform rope of mass ${M} kg and length ${L} m lies on a smooth table with 1/${n} of its length hanging over the edge. Find the work needed to pull the hanging part onto the table (in J, g = 10 m/s²).`,
        sol: `Hanging length = L/${n} = ${fmt(L / n, 4)} m, mass = ${fmt(M / n, 4)} kg, centre of mass ${fmt(L / n / 2, 4)} m below the table. W = mg h_cm = ${fmt(M / n, 4)} × 10 × ${fmt(L / n / 2, 4)} = ${fmt(W, 4)} J.` };
    },
    verify: (p) => { const lam = p.M / p.L, a = p.L / p.n; let s = 0; const N = 2000; for (let i = 0; i < N; i++) s += lam * 10 * ((i + 0.5) * a / N) * (a / N); return s; } },
  { id: 'wep-g12', type: 'mcq', level: 3, exams: EX[3], sub: 'kinetic energy',
    make(rng) {
      const x = choose(rng, [10, 20, 30, 40, 50, 100]);
      const K = ((1 + x / 100) ** 2 - 1) * 100;
      const o = numOpts(rng, K, [x, 2 * x, 1.5 * x], '%', 3);
      return { x, K, options: o.options, answer: o.answer,
        q: `The speed of a body increases by ${x}%. The percentage increase in its kinetic energy is`,
        sol: `K ∝ v². New K / old K = (1 + ${x}/100)² = ${fmt((1 + x / 100) ** 2, 4)}, so K rises by ${fmt(K, 3)}%. The option ${x}% is the speed change, and ${2 * x}% ignores the extra term x²/100.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.K, 3)} %`) },
  { id: 'wep-g13', type: 'mcq', level: 3, exams: EX[3], sub: 'kinetic energy and momentum',
    make(rng) {
      const [y, pc] = choose(rng, [[21, 10], [44, 20], [69, 30], [96, 40], [125, 50], [300, 100]]);
      const o = numOpts(rng, pc, [y, y / 2, y * 0.75], '%', 3);
      return { y, pc, options: o.options, answer: o.answer,
        q: `The kinetic energy of a body increases by ${y}% (its mass is unchanged). The percentage increase in its momentum is`,
        sol: `p = √(2mK), so p ∝ √K. √(1 + ${y}/100) = ${fmt(Math.sqrt(1 + y / 100), 4)}, so p rises by ${pc}%. The other options use ${y}% directly or half of it.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(Math.round((Math.sqrt(1 + p.y / 100) - 1) * 100), 3)} %`) },
  { id: 'wep-g14', type: 'nat', level: 4, exams: EX[4], sub: 'springs',
    make(rng) {
      const kk = choose(rng, [200, 400, 500, 800]), x = choose(rng, [0.1, 0.2, 0.3]), m = pick(rng, 1, 5, 1), mu = choose(rng, [0.1, 0.2, 0.25, 0.4]);
      const d = 0.5 * kk * x * x / (mu * m * 10);
      const [a, tt] = tl(d);
      return { kk, x, m, mu, answer: a, tol: tt, unit: 'm',
        q: `A ${m} kg block is pressed ${x} m against a spring (k = ${kk} N/m) on a smooth floor and released. It leaves the spring and enters a rough patch with μ = ${mu}. How far along the patch does it stop (in m, g = 10 m/s²)?`,
        sol: `Spring energy = ½ × ${kk} × ${x}² = ${fmt(0.5 * kk * x * x, 4)} J. Friction = μmg = ${fmt(mu * m * 10, 4)} N. Distance = ${fmt(0.5 * kk * x * x, 4)} / ${fmt(mu * m * 10, 4)} = ${fmt(d, 4)} m.` };
    },
    verify: (p) => { const v = Math.sqrt(p.kk / p.m) * p.x; return v * v / (2 * p.mu * 10); } },
  { id: 'wep-g15', type: 'nat', level: 4, exams: EX[4], sub: 'work by friction',
    make(rng) {
      const m = pick(rng, 1, 5, 1), v = pick(rng, 2, 8, 1), mu = choose(rng, [0.2, 0.25, 0.4, 0.5]), ask = choose(rng, ['heat', 'motor']);
      const val = ask === 'heat' ? 0.5 * m * v * v : m * v * v;
      return { m, v, mu, ask, answer: val, tol: 0.01, unit: 'J',
        q: `A ${m} kg block is placed gently on a long horizontal belt moving at ${v} m/s (μ = ${mu}). The belt is kept at constant speed by a motor. Find the ${ask === 'heat' ? 'heat produced by friction' : 'extra work done by the motor'} while the block slides on the belt before reaching the belt's speed (in J, g = 10 m/s²).`,
        sol: ask === 'heat'
          ? `The block accelerates at μg = ${fmt(mu * 10, 4)} m/s² for t = v/(μg) = ${fmt(v / (mu * 10), 4)} s. The belt moves vt and the block vt/2, so the relative slip is vt/2. Heat = μmg × slip = ½mv² = ${fmt(val, 4)} J.`
          : `The block accelerates at μg for t = v/(μg). The belt moves vt while friction on it is μmg, so the motor's extra work = μmg × vt = mv² = ${fmt(val, 4)} J (twice the block's gain of ½mv²).` };
    },
    verify: (p) => { const a = p.mu * 10, t = p.v / a, f = p.mu * p.m * 10; return p.ask === 'heat' ? f * (p.v * t - 0.5 * a * t * t) : f * p.v * t; } },
  { id: 'wep-g16', type: 'nat', level: 4, exams: EX[4], sub: 'potential energy curve',
    make(rng) {
      const aa = choose(rng, [1, 2, 3, 4, 5]), b = choose(rng, [4, 6, 8, 12, 16]), m = choose(rng, [0.5, 1, 2, 4]);
      const v = b / Math.sqrt(2 * aa * m);
      const [a, tt] = tl(v);
      return { aa, b, m, answer: a, tol: tt, unit: 'm/s',
        q: `A ${m} kg particle is released from rest at x = 0 in the potential U(x) = (${aa}x² − ${b}x) J (x in m). Find its greatest speed (in m/s).`,
        sol: `U is least at x = b/(2a) = ${fmt(b / (2 * aa), 4)} m, where U = −b²/(4a) = ${fmt(-b * b / (4 * aa), 4)} J. Starting from U(0) = 0, the greatest kinetic energy = ${fmt(b * b / (4 * aa), 4)} J = ½ × ${m} × v², so v = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => { let lo = 0; for (let x = 0; x <= 10; x += 0.0005) lo = Math.min(lo, p.aa * x * x - p.b * x); return Math.sqrt(2 * (-lo) / p.m); } },
  { id: 'wep-g17', type: 'nat', level: 4, exams: EX[4], sub: 'work by variable force',
    make(rng) {
      const L = pick(rng, 1.5, 4, 0.5), a0 = pick(rng, 0.5, L - 0.5, 0.5);
      const v = Math.sqrt(10 * (L * L - a0 * a0) / L);
      const [a, tt] = tl(v);
      return { L, a0, answer: a, tol: tt, unit: 'm/s',
        q: `A uniform chain of length ${L} m lies on a smooth table with ${a0} m hanging over the edge. It is released from rest. Find its speed when the last link leaves the table (in m/s, g = 10 m/s²).`,
        sol: `With hanging length x the pull per unit mass is gx/L, so v² = ∫ 2(g x/L) dx from ${a0} to ${L} = g(L² − ${a0}²)/L = 10 × (${fmt(L * L, 4)} − ${fmt(a0 * a0, 4)}) / ${L} = ${fmt(v * v, 4)}. v = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => { let v2 = 0; const n = 4000, dx = (p.L - p.a0) / n; for (let i = 0; i < n; i++) v2 += 2 * 10 * ((p.a0 + (i + 0.5) * dx) / p.L) * dx; return Math.sqrt(v2); } },
  { id: 'wep-g18', type: 'nat', level: 3, exams: EX[3], sub: 'work by variable force',
    make(rng) {
      const A = choose(rng, [1, 2, 3, 4]), H = choose(rng, [1, 2, 3, 4]);
      const W = 1000 * 10 * A * H * H / 2 / 1000;
      return { A, H, answer: W, tol: 1e-6, unit: 'kJ',
        q: `A tank of base area ${A} m² is full of water to a depth of ${H} m. Find the work needed to pump all the water out over the rim (in kJ; ρ = 1000 kg/m³, g = 10 m/s²).`,
        sol: `The water's mass is ρAH = ${1000 * A * H} kg and its centre of mass is H/2 = ${H / 2} m below the rim, so W = ρ g A H²/2 = 1000 × 10 × ${A} × ${H * H}/2 = ${W * 1000} J = ${W} kJ.` };
    },
    verify: (p) => { let s = 0; const n = 2000, dy = p.H / n; for (let i = 0; i < n; i++) s += 1000 * 10 * p.A * ((i + 0.5) * dy) * dy; return s / 1000; } },
  // ---- added 2026-11-22 ----
  { id: 'wep-g19', type: 'nat', level: 3, exams: EX[3], sub: 'conservation of energy',
    make(rng) {
      const L = choose(rng, [0.5, 0.8, 1, 1.2, 1.5, 2]), th = choose(rng, [37, 53, 60]);
      const v = Math.sqrt(2 * 10 * L * (1 - COS[th])); const [a, t] = tl(v);
      return { L, th, answer: a, tol: t, unit: 'm/s',
        q: `A pendulum bob on a light string of length ${L} m is released from rest with the string at ${th}° to the vertical (cos ${th}° = ${COS[th]}). Find its speed at the lowest point (in m/s, g = 10 m/s²).`,
        sol: `The bob falls through L(1 − cos θ) = ${L} × (1 − ${COS[th]}) = ${fmt(L * (1 - COS[th]), 4)} m. v = √(2gh) = √(2 × 10 × ${fmt(L * (1 - COS[th]), 4)}) = ${fmt(v, 4)} m/s.`,
        trap: 'The fall is L(1 − cos θ), not L cos θ.' };
    },
    verify: (p) => Math.sqrt(2 * 10 * p.L * (1 - Math.sqrt(1 - SIN[p.th] ** 2))) },
  { id: 'wep-g20', type: 'mcq', level: 3, exams: EX[3], sub: 'kinetic energy and momentum',
    make(rng) {
      const n = choose(rng, [2, 3, 4, 9]);
      const { options, answer } = shuffleOpts(rng, `${n} : 1`, [`1 : ${n}`, `${n * n} : 1`, `1 : ${n * n}`]);
      return { n, options, answer,
        q: `Two bodies A and B have equal momentum. The mass of B is ${n} times the mass of A. The ratio of their kinetic energies K_A : K_B is`,
        sol: `K = p²/(2m) with p equal, so K ∝ 1/m. K_A : K_B = m_B : m_A = ${n} : 1. The lighter body has the larger kinetic energy. ${n * n} : 1 comes from using K ∝ 1/m².`,
        trap: 'Equal momentum, not equal speed: K goes as 1/m.' };
    },
    verify: (p) => { const mA = 1, mB = p.n, pp = 6; const r = (pp * pp / (2 * mA)) / (pp * pp / (2 * mB)); return p.options.indexOf(`${Math.round(r)} : 1`); } },
  { id: 'wep-g21', type: 'nat', level: 4, exams: EX[4], sub: 'work by friction',
    make(rng) {
      const th = choose(rng, [30, 37, 45, 53]), mu = choose(rng, [0.1, 0.15, 0.2]), u = choose(rng, [4, 6, 8, 10]);
      const s = SI2[th], c = CO2[th];
      const v = u * Math.sqrt((s - mu * c) / (s + mu * c)); const [a, t] = tl(v);
      return { th, mu, u, answer: a, tol: t, unit: 'm/s',
        q: `A block is projected up a rough incline of angle ${th}° with μ = ${mu} at ${u} m/s and slides back to its starting point. Find its speed on returning (in m/s, g = 10 m/s²).`,
        sol: `Going up: u² = 2g(sin θ + μ cos θ)d. Coming down: v² = 2g(sin θ − μ cos θ)d. So v = u √[(sin θ − μ cos θ)/(sin θ + μ cos θ)] = ${u} × √[(${fmt(s, 4)} − ${fmt(mu * c, 4)})/(${fmt(s, 4)} + ${fmt(mu * c, 4)})] = ${fmt(v, 4)} m/s.`,
        trap: 'Friction acts both ways, so the return speed is less than u.' };
    },
    verify: (p) => { const s = SI2[p.th], c = CO2[p.th]; const d = p.u * p.u / (2 * 10 * (s + p.mu * c)); return Math.sqrt(p.u * p.u - 4 * p.mu * 10 * c * d); } },
  { id: 'wep-g22', type: 'nat', level: 4, exams: EX[4], sub: 'power',
    make(rng) {
      const P = choose(rng, [60, 80]), m = choose(rng, [1000, 1200, 1500]), f = choose(rng, [500, 800, 1000]), v = choose(rng, [10, 15, 20]), s = choose(rng, [0.05, 0.1]);
      const a = (P * 1000 / v - f - m * 10 * s) / m; const [aa, t] = tl(a);
      return { P, m, f, v, s, answer: aa, tol: t, unit: 'm/s²',
        q: `A ${m} kg car climbs a road of slope sin θ = ${s}. Its engine delivers a constant ${P} kW and the resistance is a constant ${f} N. Find its acceleration when its speed is ${v} m/s (in m/s², g = 10 m/s²).`,
        sol: `Driving force = P/v = ${P * 1000}/${v} = ${fmt(P * 1000 / v, 5)} N. Down-slope pull = mg sin θ = ${fmt(m * 10 * s, 5)} N. Net = ${fmt(P * 1000 / v, 5)} − ${f} − ${fmt(m * 10 * s, 5)} = ${fmt(m * a, 5)} N, so a = ${fmt(a, 4)} m/s².`,
        trap: 'Do not forget the component of weight along the slope.' };
    },
    verify: (p) => (p.P * 1000 - (p.f + p.m * 10 * p.s) * p.v) / (p.m * p.v) },
  { id: 'wep-g23', type: 'mcq', level: 3, exams: EX[3], sub: 'springs',
    make(rng) {
      const n = choose(rng, [2, 3, 4, 5, 6]);
      const { options, answer } = shuffleOpts(rng, `${n}k`, [`k/${n}`, `${n * n}k`, 'k']);
      return { n, options, answer,
        q: `A spring of constant k is cut into ${n} equal parts. The spring constant of each part is`,
        sol: `The constant is inversely proportional to the length. Each part has 1/${n} of the length, so its constant is ${n}k. (The pieces joined in series would give back k.)`,
        trap: 'A shorter spring is stiffer.' };
    },
    verify: (p) => p.options.indexOf(`${1 / (1 / p.n)}k`) },
  { id: 'wep-g24', type: 'nat', level: 3, exams: EX[3], sub: 'work by variable force',
    make(rng) {
      const a = choose(rng, [2, 4, 6, 8]), b = choose(rng, [3, 6, 9]), X = choose(rng, [1, 2, 3]);
      const W = a * X * X / 2 + b * X ** 3 / 3; const [aa, t] = tl(W);
      return { a, b, X, answer: aa, tol: t, unit: 'J',
        q: `A force F = (${a}x + ${b}x²) N acts on a body along the x-axis (x in m). Find the work done as it moves from x = 0 to x = ${X} m (in J).`,
        sol: `W = ∫F dx = [${a / 2}x² + ${b / 3}x³] from 0 to ${X} = ${a / 2} × ${X * X} + ${b / 3} × ${X ** 3} = ${fmt(W, 4)} J.` };
    },
    verify: (p) => { const n = 2000, h = p.X / n; let s = 0; for (let i = 0; i < n; i++) { const x = (i + 0.5) * h; s += (p.a * x + p.b * x * x) * h; } return s; } },
  { id: 'wep-g25', type: 'nat', level: 5, exams: EX[5], sub: 'springs',
    make(rng) {
      const m = choose(rng, [1, 2, 3]), th = choose(rng, [30, 37, 53]), d = choose(rng, [0.5, 1, 1.5]), kk = choose(rng, [200, 500, 800]);
      const w = m * 10 * SI2[th], x = (w + Math.sqrt(w * w + 2 * kk * w * d)) / kk; const [a, t] = tl(x * 100);
      return { m, th, d, kk, answer: a, tol: t, unit: 'cm',
        q: `A ${m} kg block slides from rest down a smooth incline of angle ${th}° (sin ${th}° = ${SI2[th]}) and hits a light spring (k = ${kk} N/m) fixed along the incline, ${d} m from the block. Find the greatest compression of the spring (in cm, g = 10 m/s²).`,
        sol: `Gravity along the incline: mg sin θ = ${fmt(w, 4)} N. The block falls d + x along the incline: ${fmt(w, 4)}(${d} + x) = ½ × ${kk} × x². So ${kk / 2}x² − ${fmt(w, 4)}x − ${fmt(w * d, 4)} = 0, giving x = ${fmt(x, 4)} m = ${fmt(x * 100, 4)} cm.`,
        trap: 'The block keeps falling while it compresses the spring.' };
    },
    verify: (p) => { const w = p.m * 10 * SI2[p.th]; let lo = 0, hi = 5; const f = (x) => 0.5 * p.kk * x * x - w * (p.d + x); for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } return lo * 100; } },
  { id: 'wep-g26', type: 'nat', level: 4, exams: EX[4], sub: 'vertical circle',
    make(rng) {
      const L = choose(rng, [0.5, 1, 1.5, 2]), fr = choose(rng, [0.5, 0.6, 0.75]), m = choose(rng, [0.2, 0.5, 1]);
      const d = +(fr * L).toFixed(4), r = +(L - d).toFixed(4);
      const T = m * 10 * (1 + 2 * L / r); const [a, t] = tl(T);
      return { L, d, r, m, answer: a, tol: t, unit: 'N',
        q: `A ${m} kg bob on a string of length ${L} m is released from the horizontal position. When the string becomes vertical it meets a nail ${d} m below the pivot, so the bob moves on a smaller circle. Find the tension just after the string meets the nail (in N, g = 10 m/s²).`,
        sol: `At the bottom v² = 2gL = ${fmt(20 * L, 4)}. The new radius is r = ${L} − ${d} = ${r} m. T − mg = mv²/r, so T = ${fmt(m * 10, 4)} + ${m} × ${fmt(20 * L, 4)} / ${r} = ${fmt(T, 4)} N.`,
        trap: 'Use the new, smaller radius.' };
    },
    verify: (p) => { const v2 = 2 * 10 * p.L; return p.m * 10 + p.m * v2 / (p.L - p.d); } },
  { id: 'wep-g27', type: 'nat', level: 4, exams: EX[4], sub: 'power',
    make(rng) {
      const m = choose(rng, [1, 2, 4, 5]), v = choose(rng, [3, 4, 5, 6]), P = choose(rng, [6, 12, 20, 30, 50]);
      const x = m * v ** 3 / (3 * P); const [a, t] = tl(x);
      return { m, v, P, answer: a, tol: t, unit: 'm',
        q: `A ${m} kg body is acted on by a constant power of ${P} W from rest, with no other force along its line of motion. Find the distance it covers while its speed rises from 0 to ${v} m/s (in m).`,
        sol: `Time: Pt = ½mv², so t = ${fmt(m * v * v / (2 * P), 4)} s. Speed v(t) = √(2Pt/m), so x = ∫v dt = (2/3)√(2P/m) t^{3/2}. This simplifies to x = mv³/(3P) = ${m} × ${v ** 3} / (3 × ${P}) = ${fmt(x, 4)} m.`,
        trap: 'Constant power does not mean constant acceleration, so s = v²/2a fails.' };
    },
    verify: (p) => { const T = p.m * p.v * p.v / (2 * p.P), n = 40000, h = T / n; let s = 0; for (let i = 0; i < n; i++) s += Math.sqrt(2 * p.P * (i + 0.5) * h / p.m) * h; return s; } },
  { id: 'wep-g28', type: 'mcq', level: 4, exams: EX[4], sub: 'potential energy curve',
    make(rng) {
      const q = choose(rng, [2, 3, 4, 5]);
      const { options, answer } = shuffleOpts(rng, `x = ${q} m`, [`x = −${q} m`, `x = ${q * q} m`, `x = −${q * q} m`]);
      return { q0: q, options, answer,
        q: `A particle moves under the potential energy U(x) = (x³/3 − ${q * q}x) J (x in m). Its position of stable equilibrium is`,
        sol: `F = −dU/dx = −(x² − ${q * q}), zero at x = ±${q}. U″ = 2x is positive at x = +${q} (a minimum, stable) and negative at x = −${q} (a maximum, unstable). The values ±${q * q} are not equilibrium points.`,
        trap: 'Both roots are equilibria; only the minimum of U is stable.' };
    },
    verify: (p) => { const roots = [Math.sqrt(p.q0 * p.q0), -Math.sqrt(p.q0 * p.q0)]; const st = roots.find((r) => 2 * r > 0); return p.options.indexOf(`x = ${st} m`); } },
  { id: 'wep-g29', type: 'nat', level: 5, exams: EX[5], sub: 'work by friction',
    make(rng) {
      const al = choose(rng, [0.1, 0.2, 0.25, 0.4]), u = choose(rng, [3, 4, 5, 6, 8]), m = choose(rng, [1, 2, 3]);
      const s = u / Math.sqrt(10 * al); const [a, t] = tl(s);
      return { al, u, m, answer: a, tol: t, unit: 'm',
        q: `A ${m} kg block moving at ${u} m/s enters a rough surface where the coefficient of friction grows with distance x from the edge as μ = ${al}x. How far does it go before stopping (in m, g = 10 m/s²)?`,
        sol: `Friction = ${al}x × mg. Work-energy: ½mu² = ∫₀ˢ ${al}x·mg dx = ½ × ${al} × m × 10 × s². The mass cancels: u² = ${fmt(al * 10, 4)}s², so s = ${u}/√${fmt(al * 10, 4)} = ${fmt(s, 4)} m.`,
        trap: 'The friction force is not constant: integrate it.' };
    },
    verify: (p) => { const target = 0.5 * p.u * p.u; let lo = 0, hi = 20; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (p.al * 10 * mid * mid / 2 < target) lo = mid; else hi = mid; } return lo; } },
  { id: 'wep-g30', type: 'nat', level: 4, exams: EX[4], sub: 'conservation of energy',
    make(rng) {
      const m1 = choose(rng, [2, 3, 4]), m2 = choose(rng, [2, 3, 5]), mu = choose(rng, [0.1, 0.2, 0.25]), h = choose(rng, [0.5, 1, 1.5, 2]);
      const v = Math.sqrt(2 * (m2 - mu * m1) * 10 * h / (m1 + m2)); const [a, t] = tl(v);
      return { m1, m2, mu, h, answer: a, tol: t, unit: 'm/s',
        q: `A ${m1} kg block on a rough horizontal table (μ = ${mu}) is tied by a light string over a smooth light pulley at the table's edge to a ${m2} kg block hanging freely. The system is released from rest. Find the speed when the hanging block has fallen ${h} m (in m/s, g = 10 m/s²).`,
        sol: `Net work = m₂gh − μm₁gh = ${fmt((m2 - mu * m1) * 10 * h, 5)} J. This equals ½(m₁ + m₂)v² = ½ × ${m1 + m2} × v². So v = √(2 × ${fmt((m2 - mu * m1) * 10 * h, 5)} / ${m1 + m2}) = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => { const acc = (p.m2 - p.mu * p.m1) * 10 / (p.m1 + p.m2); return Math.sqrt(2 * acc * p.h); } },
];

export default { topic: 'work-energy-power', groups, items, gens };
