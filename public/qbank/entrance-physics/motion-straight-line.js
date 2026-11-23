// Motion in a straight line: Plus Two entrance bank (original fibub questions).
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
const nid = () => `msl-${String(++k).padStart(3, '0')}`;
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

// match item: the correct code goes to a rotating position (added with the 2026-11-22 extension)
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'match', exams: EX[level], sub, group, q, options, answer: pos, sol, ...o };
};
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'distance and displacement', r`An athlete runs exactly one lap of a 400 m circular track in 80 s. Her average velocity for the lap is`, 'zero', [r`$5\ \mathrm{m\,s^{-1}}$`, r`$400\ \mathrm{m\,s^{-1}}$`, r`$0.2\ \mathrm{m\,s^{-1}}$`],
    r`Average velocity = displacement / time. After one full lap she is back at the start, so the displacement is 0 and the average velocity is 0. The $5\ \mathrm{m\,s^{-1}}$ is her average <i>speed</i> ($400/80$).`, { trap: 'Speed uses distance; velocity uses displacement.' }),
  mcq(1, 'basic quantities', r`The SI unit of acceleration is`, r`$\mathrm{m\,s^{-2}}$`, [r`$\mathrm{m\,s^{-1}}$`, r`$\mathrm{m^{2}\,s^{-1}}$`, r`$\mathrm{kg\,m\,s^{-2}}$`],
    r`Acceleration is change of velocity per unit time: $(\mathrm{m\,s^{-1}})/\mathrm{s} = \mathrm{m\,s^{-2}}$. The last option is the newton, the unit of force.`),
  nat(1, 'uniform motion', r`A car moves at a steady $20\ \mathrm{m\,s^{-1}}$ for 5 s. How far does it go (in m)?`, 100, 0,
    r`Distance = speed × time $= 20\times5 = 100$ m.`, { unit: 'm' }),
  mcq(1, 'graphs', r`On a position–time graph, the slope of the curve at a point gives`, 'the instantaneous velocity', ['the acceleration', 'the displacement', 'the distance travelled'],
    r`Slope of $x$–$t$ is $dx/dt$, which is velocity.`),
  mcq(1, 'graphs', r`The area under a velocity–time graph between two times gives`, 'the displacement', ['the acceleration', 'the speed', 'the jerk'],
    r`$\int v\,dt = $ displacement. (If the velocity changes sign, the area counted with sign gives displacement and the total unsigned area gives distance.)`),
  nat(1, 'equations of motion', r`A body starts from rest and has a uniform acceleration of $2\ \mathrm{m\,s^{-2}}$. Find its velocity after 6 s (in m/s).`, 12, 0,
    r`$v = u + at = 0 + 2\times6 = 12$ m/s.`, { unit: 'm/s' }),
  mcq(1, 'basic quantities', r`Which of these can be negative?`, 'Displacement', ['Distance', 'Speed', 'Time interval between two events'],
    r`Displacement is a vector along a line and takes a sign. Distance and speed are never negative.`),
  nat(1, 'free fall', r`A stone is dropped from rest. Taking $g = 10\ \mathrm{m\,s^{-2}}$, how far does it fall in 4 s (in m)?`, 80, 0,
    r`$h = \tfrac12gt^2 = \tfrac12\times10\times16 = 80$ m.`, { unit: 'm' }),
  mcq(1, 'free fall', r`A ball is thrown straight up. At the highest point, its velocity is zero. Its acceleration there is`, r`$g$ downward`, [`zero`, r`$g$ upward`, 'infinite'],
    r`Gravity acts all through the flight. At the top the velocity is zero only for an instant, and the acceleration is still $g$ downward.`, { trap: 'Zero velocity does not mean zero acceleration.' }),
  mcq(1, 'graphs', r`On an $x$–$t$ graph, a straight line parallel to the time axis represents`, 'a body at rest', ['uniform motion', 'uniform acceleration', 'free fall'],
    r`The position does not change with time, so the slope (velocity) is zero. The body is at rest.`),
  nat(1, 'unit conversion', r`Convert $54\ \mathrm{km\,h^{-1}}$ to $\mathrm{m\,s^{-1}}$.`, 15, 0,
    r`$54\times\frac{5}{18} = 15$ m/s.`, { unit: 'm/s' }),
  mcq(1, 'basic quantities', r`Which of these is a vector quantity?`, 'Velocity', ['Speed', 'Distance', 'Time'],
    r`Velocity has a direction as well as a magnitude. Speed, distance and time are scalars.`),

  // ---------- Level 2 ----------
  nat(2, 'average speed', r`A car goes 60 km at $30\ \mathrm{km\,h^{-1}}$ and the next 60 km at $60\ \mathrm{km\,h^{-1}}$. Find its average speed in km/h.`, 40, 0,
    r`Total distance $=120$ km. Time $= 60/30 + 60/60 = 2 + 1 = 3$ h. Average speed $= 120/3 = 40$ km/h.`, { unit: 'km/h', trap: 'It is not the simple mean 45, because more time is spent at the lower speed.' }),
  mcq(2, 'average speed', r`A car travels for the first half of the <i>time</i> at $40\ \mathrm{km\,h^{-1}}$ and the second half at $60\ \mathrm{km\,h^{-1}}$. Its average speed is`, r`$50\ \mathrm{km\,h^{-1}}$`, [r`$48\ \mathrm{km\,h^{-1}}$`, r`$45\ \mathrm{km\,h^{-1}}$`, r`$55\ \mathrm{km\,h^{-1}}$`],
    r`Let each half of the time be $T$. Distance $= 40T + 60T = 100T$ and total time $= 2T$. Average speed $= 50$ km/h. The 48 km/h comes from splitting the <i>distance</i> equally instead.`, { trap: 'Equal times give the arithmetic mean; equal distances give the harmonic mean.' }),
  nat(2, 'average speed', r`A cyclist rides half the <i>distance</i> at $40\ \mathrm{km\,h^{-1}}$ and the other half at $60\ \mathrm{km\,h^{-1}}$. Find the average speed in km/h.`, 48, 0,
    r`For distance $2d$: time $= d/40 + d/60 = d(3+2)/120 = d/24$. Average $= 2d/(d/24) = 48$ km/h.`, { unit: 'km/h' }),
  nat(2, 'stopping distance', r`A car moving at $72\ \mathrm{km\,h^{-1}}$ is braked with a constant retardation of $5\ \mathrm{m\,s^{-2}}$. Find the stopping distance in m.`, 40, 0,
    r`$u = 72\times\frac{5}{18} = 20$ m/s. From $v^2 = u^2 - 2as$ with $v=0$: $s = u^2/(2a) = 400/10 = 40$ m.`, { unit: 'm' }),
  nat(2, 'equations of motion', r`A body moving at $20\ \mathrm{m\,s^{-1}}$ is brought to rest by a constant retardation of $4\ \mathrm{m\,s^{-2}}$. How long does it take, in s?`, 5, 0,
    r`$v = u - at$ gives $0 = 20 - 4t$, so $t = 5$ s.`, { unit: 's' }),
  nat(2, 'equations of motion', r`A particle has $u = 5\ \mathrm{m\,s^{-1}}$ and a constant acceleration $2\ \mathrm{m\,s^{-2}}$. Find its displacement in 4 s, in m.`, 36, 0,
    r`$s = ut + \tfrac12at^2 = 5\times4 + \tfrac12\times2\times16 = 20+16 = 36$ m.`, { unit: 'm' }),
  nat(2, 'equations of motion', r`A body with $u = 6\ \mathrm{m\,s^{-1}}$ and $a = 2\ \mathrm{m\,s^{-2}}$ covers 16 m. Find its final speed in m/s.`, 10, 0,
    r`$v^2 = u^2 + 2as = 36 + 2\times2\times16 = 100$, so $v = 10$ m/s.`, { unit: 'm/s' }),
  nat(2, 'nth second', r`A body starts with $u = 4\ \mathrm{m\,s^{-1}}$ and has a uniform acceleration $2\ \mathrm{m\,s^{-2}}$. How far does it travel in the 5th second, in m?`, 13, 0,
    r`Distance in the $n$th second $= u + \frac a2(2n-1) = 4 + \frac22\times9 = 13$ m. Check: $s(5) - s(4) = (20+25) - (16+16) = 13$ m.`, { unit: 'm', trap: 'The 5th second is the interval from $t=4$ to $t=5$, not the first 5 seconds.' }),
  mcq(2, 'graphs', r`The slope of a velocity–time graph gives`, 'acceleration', ['displacement', 'speed', 'distance'],
    r`$dv/dt$ is acceleration.`),
  nat(2, 'free fall', r`A stone is dropped from a tower 45 m high. Taking $g = 10\ \mathrm{m\,s^{-2}}$, find the time it takes to reach the ground in s.`, 3, 0,
    r`$h = \tfrac12gt^2$: $45 = 5t^2$, so $t^2 = 9$ and $t = 3$ s.`, { unit: 's' }),
  nat(2, 'vertical throw', r`A ball is thrown up with $20\ \mathrm{m\,s^{-1}}$. Take $g = 10\ \mathrm{m\,s^{-2}}$ and find the maximum height in m.`, 20, 0,
    r`At the top $v=0$: $H = u^2/(2g) = 400/20 = 20$ m.`, { unit: 'm' }),
  nat(2, 'relative velocity', r`Two trains move towards each other on parallel tracks with speeds $54\ \mathrm{km\,h^{-1}}$ and $36\ \mathrm{km\,h^{-1}}$. Find the speed of one relative to the other in m/s.`, 25, 0,
    r`Opposite directions: relative speed $= 54 + 36 = 90$ km/h $= 90\times\frac5{18} = 25$ m/s.`, { unit: 'm/s' }),
  mcq(2, 'graphs', r`A straight line through the origin on a velocity–time graph means the body has`, 'uniform acceleration starting from rest', ['uniform velocity', 'uniform retardation', 'zero acceleration'],
    r`$v\propto t$ with $v=0$ at $t=0$ means $v = at$ with constant $a$: uniform acceleration from rest.`),
  nat(2, 'area under graph', r`A body's velocity rises uniformly from 0 to $10\ \mathrm{m\,s^{-1}}$ in 5 s and then stays constant for another 5 s. Find the displacement in 10 s, in m.`, 75, 0,
    r`First 5 s: triangle $=\tfrac12\times5\times10 = 25$ m. Next 5 s: rectangle $=10\times5 = 50$ m. Total $75$ m.`, { unit: 'm' }),
  nat(2, 'free fall', r`A body is dropped from rest. Take $g=10\ \mathrm{m\,s^{-2}}$. How far does it fall in the 3rd second, in m?`, 25, 0,
    r`Distance in the $n$th second $= \frac g2(2n-1) = 5\times5 = 25$ m. (Fall in 3 s is 45 m and in 2 s is 20 m: $45-20=25$ m.)`, { unit: 'm' }),
  mcq(2, 'basic quantities', r`At a certain instant a body has zero velocity. Then its acceleration at that instant`, 'may or may not be zero', ['must be zero', 'must be non-zero', 'must be negative'],
    r`A ball at the top of its path has $v=0$ but $a = g$. A body at rest on a table has $v=0$ and $a=0$. So zero velocity says nothing definite about acceleration.`, { trap: 'Velocity and acceleration are independent at a given instant.' }),
  mcq(2, 'unit conversion', r`A car accelerates uniformly from rest to $100\ \mathrm{km\,h^{-1}}$ in 10 s. Its acceleration is nearest to`, r`$2.8\ \mathrm{m\,s^{-2}}$`, [r`$10\ \mathrm{m\,s^{-2}}$`, r`$1.0\ \mathrm{m\,s^{-2}}$`, r`$0.28\ \mathrm{m\,s^{-2}}$`],
    r`$100\ \mathrm{km/h} = 100/3.6 = 27.8$ m/s. $a = 27.8/10 = 2.78\approx2.8\ \mathrm{m\,s^{-2}}$. The value 10 forgets the unit change.`),
  nat(2, 'average velocity', r`A particle moves along a line from $x = 5$ m to $x = -3$ m in 4 s. Find its average velocity in m/s.`, -2, 0,
    r`Average velocity $=\Delta x/\Delta t = (-3-5)/4 = -2$ m/s. The negative sign means it moves towards negative $x$.`, { unit: 'm/s' }),
  nat(2, 'relative velocity', r`A man in a car moving east at $15\ \mathrm{m\,s^{-1}}$ sees a truck pass him in the opposite direction at a relative speed of $40\ \mathrm{m\,s^{-1}}$. Find the truck's speed with respect to the ground in m/s.`, 25, 0,
    r`Let east be positive. $v_{T/C} = v_T - v_C$, so $-40 = v_T - 15$ gives $v_T = -25$ m/s. The truck moves west at 25 m/s.`, { unit: 'm/s' }),
  nat(2, 'free fall', r`A stone is dropped from a bridge and hits the water after 2.5 s. Take $g = 9.8\ \mathrm{m\,s^{-2}}$. Find the height of the bridge in m (1 decimal).`, 30.6, 0.1,
    r`$h = \tfrac12gt^2 = \tfrac12\times9.8\times6.25 = 30.625\approx30.6$ m.`, { unit: 'm' }),
  nat(2, 'vertical throw', r`A ball is thrown vertically down with $5\ \mathrm{m\,s^{-1}}$ from the top of a 30 m building. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find the time to reach the ground in s.`, 2, 0,
    r`Take down as positive: $30 = 5t + 5t^2$, so $t^2 + t - 6 = 0$, which gives $(t+3)(t-2)=0$. Only $t = 2$ s is valid.`, { unit: 's' }),
  mcq(2, 'dimensions', r`The rate of change of acceleration is called jerk. Its dimensions are`, r`$[LT^{-3}]$`, [r`$[LT^{-2}]$`, r`$[LT^{-1}]$`, r`$[L^{2}T^{-3}]$`],
    r`Jerk $= da/dt$, so $[LT^{-2}]/[T] = [LT^{-3}]$.`, { sub: 'mixed' }),
  mcq(2, 'basic quantities', r`The magnitude of displacement of a body is never greater than the distance it covers. When are they equal?`, 'When the body moves in a straight line without changing direction', ['Always', 'When it returns to its starting point', 'When its speed is constant'],
    r`Distance is the length of the path and displacement is the straight-line change in position. They match only when the path is a straight line with no reversal.`),

  // ---------- Level 3 ----------
  nat(3, 'nth second', r`A body starting from rest with uniform acceleration covers 27 m in the 5th second. Find its acceleration in $\mathrm{m\,s^{-2}}$.`, 6, 0,
    r`For a body from rest, distance in the $n$th second $= \frac a2(2n-1)$. So $27 = \frac a2\times9$, giving $a = 6\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(3, 'equal intervals', r`A body starts from rest with uniform acceleration. It covers 2 m in the first second-long interval. How far does it travel in the 4th such interval, in m?`, 14, 0,
    r`From rest, distances in successive equal intervals are in the ratio $1:3:5:7$. If the first is 2 m, the 4th is $7\times2 = 14$ m.`, { unit: 'm' }),
  nat(3, 'vertical throw', r`A ball is thrown up from the ground at $30\ \mathrm{m\,s^{-1}}$ ($g = 10\ \mathrm{m\,s^{-2}}$). It is at a height of 40 m twice. Find the time between the two instants, in s.`, 2, 0,
    r`$40 = 30t - 5t^2$ gives $t^2 - 6t + 8 = 0$, so $t = 2$ s (going up) and $t = 4$ s (coming down). The difference is 2 s.`, { unit: 's', trap: 'A quadratic in $t$ gives both the upward and the downward passage.' }),
  nat(3, 'free fall', r`A stone dropped from the top of a cliff covers 35 m in the last second of its fall. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find the height of the cliff in m.`, 80, 0,
    r`Distance in the last second of a fall lasting $T$ s is $\frac g2(2T-1) = 5(2T-1) = 35$, so $2T-1 = 7$ and $T = 4$ s. Height $= \tfrac12gT^2 = 5\times16 = 80$ m.`, { unit: 'm' }),
  nat(3, 'relative motion', r`A body $B$ moves at $10\ \mathrm{m\,s^{-1}}$ and is 24 m ahead of a body $A$ that starts from rest with acceleration $2\ \mathrm{m\,s^{-2}}$ in the same direction. In how many seconds does $A$ overtake $B$?`, 12, 0,
    r`$A$ meets $B$ when $\tfrac12\times2\times t^2 = 10t + 24$. So $t^2 - 10t - 24 = 0$, giving $(t-12)(t+2)=0$. Hence $t = 12$ s.`, { unit: 's' }),
  nat(3, 'stopping distance', r`A driver going at $20\ \mathrm{m\,s^{-1}}$ sees a barrier 60 m ahead. Her reaction time is 0.5 s and she then brakes with a retardation of $5\ \mathrm{m\,s^{-2}}$. How far from the barrier (in m) does the car stop?`, 10, 0,
    r`Reaction distance $= 20\times0.5 = 10$ m. Braking distance $= 20^2/(2\times5) = 40$ m. Total $=50$ m, so the car stops $60-50 = 10$ m short.`, { unit: 'm', trap: 'During the reaction time the car still moves at full speed.' }),
  nat(3, 'graphs', r`The velocity of a particle changes uniformly from $+20\ \mathrm{m\,s^{-1}}$ at $t=0$ to $-10\ \mathrm{m\,s^{-1}}$ at $t=6$ s. Find the total distance travelled in these 6 s, in m.`, 50, 0,
    r`Slope: $a = -30/6 = -5\ \mathrm{m\,s^{-2}}$. The velocity is zero at $t = 4$ s. Area before: $\tfrac12\times4\times20 = 40$ m. After: $\tfrac12\times2\times10 = 10$ m (in the opposite direction). Distance $= 40+10 = 50$ m (displacement $=30$ m).`, { unit: 'm', trap: 'Distance adds the areas; displacement subtracts the one below the axis.' }),
  nat(3, 'relative motion', r`Two trains of lengths 150 m (faster, moving at $36\ \mathrm{km\,h^{-1}}$) and 100 m (slower, moving at $18\ \mathrm{km\,h^{-1}}$) run on parallel tracks in the same direction. The faster train is overtaking. How many seconds pass from the moment the front of the faster train is level with the rear of the slower train until the rear of the faster train is level with the front of the slower train?`, 50, 0,
    r`Relative speed $= 36 - 18 = 18$ km/h $= 5$ m/s. The faster train must gain $150 + 100 = 250$ m on the slower one. Time $= 250/5 = 50$ s.`, { unit: 's', trap: 'Add both lengths, and subtract the speeds.' }),
  nat(3, 'relative motion', r`A ball is dropped from 80 m. At the same instant another ball is thrown up from the ground at $40\ \mathrm{m\,s^{-1}}$. When do they meet, in s?`, 2, 0,
    r`Both have the same acceleration $g$, so the relative acceleration is zero and the relative speed is constant at $40$ m/s. They meet after $80/40 = 2$ s. (The value of $g$ is not needed.)`, { unit: 's', trap: 'In free fall, both bodies share the same g, so g cancels in relative motion.' }),
  nat(3, 'vertical throw', r`A ball thrown up from the ground passes the same point at 1 s and 3 s after it is thrown. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find its speed of projection in m/s.`, 20, 0,
    r`The two times are symmetric about the time of the top: $t_{top} = (1+3)/2 = 2$ s. Then $u = g\,t_{top} = 20$ m/s.`, { unit: 'm/s' }),
  nat(3, 'two-stage motion', r`A car starts from rest, accelerates at $2\ \mathrm{m\,s^{-2}}$, and then immediately decelerates at $4\ \mathrm{m\,s^{-2}}$ until it stops. The whole journey lasts 12 s. Find the maximum speed in m/s.`, 16, 0,
    r`Let the top speed be $v$. Time up $= v/2$ and time down $= v/4$. So $v/2 + v/4 = 12$, which gives $\frac{3v}{4} = 12$ and $v = 16$ m/s.`, { unit: 'm/s' }),
  nat(3, 'free fall', r`A balloon is rising at $10\ \mathrm{m\,s^{-1}}$ when it is 75 m above the ground, and a stone is released from it. Take $g = 10\ \mathrm{m\,s^{-2}}$. How long does the stone take to reach the ground, in s?`, 5, 0,
    r`The stone starts with the balloon's velocity, $+10$ m/s upward. Taking up as positive: $-75 = 10t - 5t^2$, so $t^2 - 2t - 15 = 0$, giving $(t-5)(t+3) = 0$. Hence $t = 5$ s.`, { unit: 's', trap: 'The stone does not start from rest: it keeps moving up for a moment.' }),
  nat(3, 'variable acceleration', r`A particle has position $x = 2t^3 - 9t^2 + 12t$ (SI units). Find its acceleration at the moment it is at rest for the second time, in $\mathrm{m\,s^{-2}}$.`, 6, 0,
    r`$v = 6t^2 - 18t + 12 = 6(t-1)(t-2)$. It is at rest at $t = 1$ s and $t = 2$ s. $a = dv/dt = 12t - 18$. At $t = 2$: $a = 6\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(3, 'variable acceleration', r`A particle starts from the origin at rest with acceleration $a = 6t$ (SI units). Find its position at $t = 2$ s, in m.`, 8, 0,
    r`$v = \int 6t\,dt = 3t^2$. $x = \int 3t^2\,dt = t^3$. At $t=2$: $x = 8$ m.`, { unit: 'm' }),
  nat(3, 'variable acceleration', r`The velocity of a particle is $v = t^2 + 2t$ (SI units). Find its acceleration at $t = 3$ s, in $\mathrm{m\,s^{-2}}$.`, 8, 0,
    r`$a = dv/dt = 2t + 2 = 8\ \mathrm{m\,s^{-2}}$ at $t=3$ s.`, { unit: 'm/s²' }),
  nat(3, 'variable acceleration', r`The speed of a particle varies with position as $v^2 = 25 - 4x$ (SI units). Find its acceleration in $\mathrm{m\,s^{-2}}$.`, -2, 0,
    r`Differentiate with respect to $x$: $2v\,\dfrac{dv}{dx} = -4$. So $a = v\dfrac{dv}{dx} = -2\ \mathrm{m\,s^{-2}}$, a constant.`, { unit: 'm/s²' }),
  mcq(3, 'average velocity', r`A particle moves as $x = t^2$ (SI). Its average velocity from $t=0$ to $t=4$ s is`, r`$4\ \mathrm{m\,s^{-1}}$`, [r`$8\ \mathrm{m\,s^{-1}}$`, r`$16\ \mathrm{m\,s^{-1}}$`, r`$2\ \mathrm{m\,s^{-1}}$`],
    r`Average velocity $= \Delta x/\Delta t = (16-0)/4 = 4$ m/s. The 8 m/s is the <i>instantaneous</i> velocity $2t$ at $t=4$ s.`, { trap: 'Average velocity over an interval is not the final instantaneous velocity.' }),
  nat(3, 'average speed', r`A stone is thrown up from the ground at $20\ \mathrm{m\,s^{-1}}$ and returns to the ground after 4 s ($g=10$). Find its average speed over the whole flight, in m/s.`, 10, 0,
    r`Distance $= 20 + 20 = 40$ m (up 20 m and down 20 m). Average speed $= 40/4 = 10$ m/s. The average velocity would be 0.`, { unit: 'm/s' }),
  nat(3, 'graphs', r`A particle's velocity is $v = 20 - 5t$ (SI). Find the total distance it travels in the first 6 s, in m.`, 50, 0,
    r`The velocity is zero at $t = 4$ s. Distance up to 4 s: $\tfrac12\times4\times20 = 40$ m. From 4 s to 6 s, $v$ changes from 0 to $-10$: $\tfrac12\times2\times10 = 10$ m. Total $50$ m. (Displacement $=30$ m.)`, { unit: 'm' }),
  nat(3, 'penetration', r`A bullet loses half its speed while passing through a 6 cm thick plank (constant resistance). How much further (in cm) does it go into the next identical plank before stopping?`, 2, 0,
    r`Let the entry speed be $v$ and the deceleration $a$. Through the plank: $v^2 - (v/2)^2 = 2a\times6$, so $\tfrac34v^2 = 12a$. Then from $v/2$ to rest: $d = (v/2)^2/(2a) = \frac{v^2}{8a}$. Using $v^2 = 16a$: $d = 16a/(8a) = 2$ cm.`, { unit: 'cm' }),
  mcq(3, 'mixed motion', r`A student measures $g$ by dropping a ball: $h = 1.00\pm0.01$ m and $t = 0.45\pm0.01$ s. Which is the best estimate of the percentage error in $g = 2h/t^2$?`, '5.4 %', ['3.2 %', '1.0 %', '2.2 %'],
    r`$g\propto h/t^2$, so $\Delta g/g = \Delta h/h + 2\Delta t/t = 1.0\% + 2\times2.22\% = 5.4\%$. The option 3.2 % wrongly adds $2.2\%$ once.`, { sub: 'mixed', trap: 'The time is squared, so its error is counted twice.' }),
  mcq(3, 'mixed motion', r`In $x = \alpha t + \beta t^3$, $x$ is in metres and $t$ in seconds. The SI unit of $\beta$ is`, r`$\mathrm{m\,s^{-3}}$`, [r`$\mathrm{m\,s^{-1}}$`, r`$\mathrm{m\,s^{-2}}$`, r`$\mathrm{m\,s^{3}}$`],
    r`Every term must have units of metres. $\beta t^3$ in m means $[\beta] = \mathrm{m}/\mathrm{s^3} = \mathrm{m\,s^{-3}}$.`, { sub: 'mixed' }),
  mcq(3, 'relative motion', r`A passenger in a lift accelerating upward at $2\ \mathrm{m\,s^{-2}}$ drops a coin from a height of 6 m above the floor ($g = 10\ \mathrm{m\,s^{-2}}$). The coin hits the floor after`, '1 s', ['0.77 s', '1.1 s', '1.2 s'],
    r`Relative to the lift, the coin starts at rest and accelerates downward at $g + a = 12\ \mathrm{m\,s^{-2}}$. $6 = \tfrac12\times12\times t^2$ gives $t = 1$ s. Using $g$ alone would give $t=\sqrt{1.2} = 1.1$ s.`, { trap: 'Use the effective acceleration $g + a$ relative to the lift.' }),
  mcq(3, 'graphs', r`The $x$–$t$ graph of a body is a parabola that opens <b>downward</b> with its top at $t = 3$ s. Which statement is correct?`, 'The velocity is zero at 3 s and the acceleration is negative', ['The velocity is maximum at 3 s', 'The acceleration is zero at 3 s', 'The velocity is constant and negative'],
    r`At the peak of the $x$–$t$ curve the slope is zero, so $v = 0$ at 3 s. The curve bends downward (concave down), so $d^2x/dt^2 < 0$ and the acceleration is negative.`, { trap: 'A peak on $x$–$t$ means zero velocity, not maximum velocity.' }),
  msq(3, 'vertical throw', r`A ball is thrown vertically upward (no air resistance). Which statements are correct?`,
    [r`The velocity is zero at the highest point`, r`The acceleration is zero at the highest point`, r`The time of ascent equals the time of descent`, r`It returns to the launch point with the same speed as it was thrown`], [0, 2, 3],
    r`A is true. B is false: acceleration is $g$ throughout. C and D follow from the symmetry of motion under constant acceleration back to the same height.`),
  msq(3, 'uniform acceleration', r`A body moves with constant non-zero acceleration along a straight line. Which statements are always true?`,
    [r`Its velocity–time graph is a straight line`, r`Its position–time graph is a parabola`, r`Its speed keeps increasing`, r`Its average velocity over an interval is $(u+v)/2$`], [0, 1, 3],
    r`A: $v = u + at$ is linear. B: $x = x_0 + ut + \frac12at^2$ is quadratic. C is false: if $a$ opposes $v$, the speed first falls. D: only for constant acceleration the average velocity is the mean of end velocities.`),
  msq(3, 'graphs', r`Which statements about an $x$–$t$ graph are correct?`,
    [r`A negative slope means motion in the negative direction`, r`A concave-downward curve means a negative acceleration`, r`A turning point has zero slope`, r`The graph can have two different positions at the same time`], [0, 1, 2],
    r`A, B, C are standard. D is false: a body has only one position at any given time, so a vertical line meets the graph once.`),
  mcq(3, 'mixed motion', r`The "distance in the $n$th second" formula $s_n = u + \dfrac a2(2n-1)$ looks dimensionally wrong. The reason it is still used is that`, 'it is written for a time interval of exactly 1 s, which is hidden', ['it is only valid for a body starting from rest', 'the factor $(2n-1)$ has the dimensions of time', 'dimensional analysis does not apply to equations of motion'],
    r`$u$ is a speed but $s_n$ is a length, so strictly each term needs a "× 1 s" (and $\frac a2(2n-1)$ needs "× (1 s)²"). In SI units with a 1 s interval the numbers are right. The formula holds for any $u$, and $(2n-1)$ is a pure number.`, { sub: 'mixed' }),

  // ---------- Level 4 ----------
  nat(4, 'two-stage motion', r`A car starts from rest and goes with constant acceleration $2\ \mathrm{m\,s^{-2}}$, then brakes uniformly at $4\ \mathrm{m\,s^{-2}}$ to stop. Total distance is 600 m. Find the maximum speed in m/s.`, 40, 0,
    r`Total distance $= \dfrac{v^2}{2a_1} + \dfrac{v^2}{2a_2} = \dfrac{v^2}{4} + \dfrac{v^2}{8} = \dfrac{3v^2}{8} = 600$. So $v^2 = 1600$ and $v = 40$ m/s.`, { unit: 'm/s' }),
  nat(4, 'vertical throw', r`A ball thrown up passes two points $A$ and $B$ ($B$ higher). The time between the two passages through $A$ is 6 s and between the two through $B$ is 2 s. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find $AB$ in m.`, 40, 0,
    r`The time spent above a level is $2\sqrt{2H/g}$, where $H$ is the height of the top above it. For $A$: $3 = \sqrt{2H_A/10}$ gives $H_A = 45$ m. For $B$: $1 = \sqrt{2H_B/10}$ gives $H_B = 5$ m. So $AB = 45 - 5 = 40$ m. In general $AB = g(T_A^2 - T_B^2)/8$.`, { unit: 'm', trap: 'The given times are for the whole up-and-down loop, so halve them first.' }),
  nat(4, 'variable acceleration', r`A particle starts from rest at $t=0$ with $a = 6 - 2t$ (SI). Find its position at the instant it is next at rest, in m.`, 36, 0,
    r`$v = 6t - t^2$, which is zero at $t = 6$ s. $x = 3t^2 - t^3/3$. At $t = 6$: $x = 108 - 72 = 36$ m.`, { unit: 'm' }),
  nat(4, 'variable acceleration', r`A particle's acceleration is $a = -2v$ (SI) and its initial velocity is $10\ \mathrm{m\,s^{-1}}$. Find the total distance it travels before it stops (as $t\to\infty$), in m.`, 5, 0,
    r`Write $a = v\,dv/dx = -2v$, so $dv/dx = -2$. Then $v = 10 - 2x$, which is zero at $x = 5$ m.`, { unit: 'm', trap: 'Use $a = v\\,dv/dx$ when acceleration depends on $v$ and you want $x$.' }),
  nat(4, 'variable acceleration', r`A particle has $a = -4x$ (SI) and speed $8\ \mathrm{m\,s^{-1}}$ at $x = 0$. Find its speed at $x = 3$ m, in m/s (2 decimals).`, 5.29, 0.01,
    r`$v\,\dfrac{dv}{dx} = -4x$, so $\tfrac12v^2 = -2x^2 + C$. At $x=0$: $C = 32$. At $x=3$: $v^2 = 64 - 36 = 28$, so $v = 5.29$ m/s.`, { unit: 'm/s', sub: 'variable acceleration' }),
  nat(5, 'free fall', r`A body falls from rest and covers $\frac{9}{25}$ of the total height in the last second ($g = 10\ \mathrm{m\,s^{-2}}$). Find the height in m.`, 125, 0,
    r`Total time $T$. Last-second distance $= 5(2T-1)$ and total $=5T^2$. So $\dfrac{2T-1}{T^2} = \dfrac9{25}$, giving $9T^2 - 50T + 25 = 0$, so $T = 5$ or $T = 5/9$. The second root is less than 1 s, which is not allowed. $T = 5$ s and $H = 5\times25 = 125$ m.`, { unit: 'm', trap: 'Reject the root with $T<1$ s: the last second would not exist.' }),
  nat(4, 'relative motion', r`Car $A$ moves at $20\ \mathrm{m\,s^{-1}}$. Car $B$, initially at rest 90 m ahead, starts moving at the same instant in the same direction with an acceleration of $2\ \mathrm{m\,s^{-2}}$. Find the first time that $A$ catches $B$, in s (2 decimals).`, 6.84, 0.02,
    r`Gap $= 90 + t^2 - 20t$. Setting it to zero: $t^2 - 20t + 90 = 0$, so $t = 10\pm\sqrt{10}$. The first meeting is $t = 10 - 3.162 = 6.84$ s.`, { unit: 's' }),
  nat(4, 'mixed motion', r`In an experiment, $g$ is found from $g = 2h/t^2$ with $h = 1.00\pm0.01$ m and $t = 0.45\pm0.01$ s. Find the percentage error in $g$ (2 decimals).`, 5.44, 0.05,
    r`$\Delta g/g = \Delta h/h + 2\Delta t/t = 1.00\% + 2\times2.22\% = 5.44\%$.`, { sub: 'mixed', unit: '%' }),
  mcq(4, 'relative motion', r`A lift moves upward at a constant speed. A coin is dropped from its ceiling. Compared with the same drop in a stationary lift, the time to reach the floor is`, 'the same', ['longer', 'shorter', 'zero'],
    r`A constant-velocity lift is an inertial frame, so the relative acceleration is still $g$. The time is the same.`, { trap: 'Only the lift\'s <i>acceleration</i> matters, not its velocity.' }),
  msq(4, 'variable acceleration', r`A particle moves along the $x$ axis as $x = t^3 - 6t^2 + 9t$ (SI). Which statements are correct for $0\le t\le4$ s?`,
    [r`The particle is at rest at $t=1$ s and $t=3$ s`, r`The displacement in 4 s is 4 m`, r`The distance travelled in 4 s is 12 m`, r`The particle is at the origin at $t=2$ s`], [0, 1, 2],
    r`$v = 3t^2 - 12t + 9 = 3(t-1)(t-3)$, so A is true. $x(0)=0$, $x(1)=4$, $x(3)=0$, $x(4)=4$. Displacement $= 4$ m (B true). Distance $= 4 + 4 + 4 = 12$ m (C true). $x(2) = 8 - 24 + 18 = 2$ m, not zero (D false).`),
  msq(4, 'relative motion', r`Ball $A$ is dropped from a height of 80 m. At the same instant, ball $B$ is thrown up from the ground at $40\ \mathrm{m\,s^{-1}}$ along the same vertical line ($g = 10\ \mathrm{m\,s^{-2}}$). Which statements are correct?`,
    [r`They meet 2 s after the start`, r`They meet at a height of 60 m`, r`The relative speed of $B$ with respect to $A$ changes with time`, r`At the meeting, $B$ is moving upward at $20\ \mathrm{m\,s^{-1}}$`], [0, 1, 3],
    r`Relative speed is constant at 40 m/s (the same $g$ acts on both), so the meeting time is $80/40 = 2$ s (A true, C false). $B$ is at $40\times2 - 5\times4 = 60$ m (B true). $B$'s speed at that time $= 40 - 20 = 20$ m/s upward (D true).`),
  msq(4, 'variable acceleration', r`A particle has velocity $v = 4t - t^2$ (SI) for $0\le t\le4$ s. Which statements are correct?`,
    [r`The velocity is maximum at $t=2$ s`, r`The acceleration is zero at $t=2$ s`, r`The displacement in 4 s is $\dfrac{32}{3}$ m`, r`The acceleration at $t=1$ s equals the acceleration at $t=3$ s`], [0, 1, 2],
    r`$a = 4 - 2t$, zero at $t=2$ s, and $v = 4$ is the maximum there (A, B true). $x = 2t^2 - t^3/3$ gives $32 - 64/3 = 32/3$ (C true). $a(1) = 2$ and $a(3) = -2$, which are not equal (D false).`),
  mcq(4, 'graphs', r`A body's acceleration–time graph is a horizontal line at $a = +2\ \mathrm{m\,s^{-2}}$ from $t=0$ to $t=5$ s, and then at $a = -4\ \mathrm{m\,s^{-2}}$ from $t=5$ s to $t = 10$ s. It starts from rest. Its velocity at $t=10$ s is`, r`$-10\ \mathrm{m\,s^{-1}}$`, [r`$0$`, r`$10\ \mathrm{m\,s^{-1}}$`, r`$-30\ \mathrm{m\,s^{-1}}$`],
    r`Area under $a$–$t$ gives the change in velocity. First part: $2\times5 = +10$. Second part: $-4\times5 = -20$. Final velocity $= 0 + 10 - 20 = -10$ m/s.`),
  mcq(4, 'graphs', r`Which of the following $v$–$t$ descriptions is <b>impossible</b> for a real body?`, 'Two different velocities at the same instant', ['Velocity changing sign', 'A horizontal line at nonzero velocity', 'A straight line with negative slope'],
    r`A body can have only one velocity at one time. So the graph cannot double back vertically. A sign change means turning around; a horizontal line is uniform motion; a negative slope is retardation (or acceleration in the negative direction).`),
  nat(4, 'relative motion', r`A particle moves along a line. Its velocity relative to a moving frame is $12\ \mathrm{m\,s^{-1}}$ and the frame moves at $-5\ \mathrm{m\,s^{-1}}$ in the ground frame. What is the particle's speed in the ground frame, in m/s?`, 7, 0,
    r`$v_{P/G} = v_{P/F} + v_{F/G} = 12 + (-5) = 7$ m/s.`, { unit: 'm/s' }),
  nat(5, 'two-stage motion', r`A bus has to cover 1 km between two stops. It can accelerate at $2\ \mathrm{m\,s^{-2}}$ and brake at $4\ \mathrm{m\,s^{-2}}$, with no speed limit. Find the shortest possible time in s (1 decimal).`, 38.7, 0.1,
    r`The fastest trip is accelerate, then brake at once. Let the top speed be $v$: $\frac{v^2}{2\times2}+\frac{v^2}{2\times4} = 1000$, so $\frac{3v^2}{8} = 1000$ and $v = 51.6$ m/s. Time $= v/2 + v/4 = 0.75\times51.6 = 38.7$ s.`, { unit: 's', sub: 'two-stage motion' }),

  // ---------- Level 5 ----------
  nat(5, 'variable acceleration', r`A particle moving along a line has a retardation $a = -0.1\,v^2$ (SI) and starts at $v_0 = 10\ \mathrm{m\,s^{-1}}$. How far (in m, 2 decimals) does it go before its speed falls to $5\ \mathrm{m\,s^{-1}}$?`, 6.93, 0.02,
    r`$v\,\dfrac{dv}{dx} = -0.1v^2$, so $\dfrac{dv}{v} = -0.1\,dx$. Integrate: $\ln\dfrac{v}{v_0} = -0.1\,x$. For $v = v_0/2$: $x = \dfrac{\ln2}{0.1} = 6.93$ m.`, { unit: 'm', trap: 'It never stops completely: $v\\to0$ only as $x\\to\\infty$.' }),
  nat(5, 'variable acceleration', r`A particle's velocity is $v = v_0 e^{-t/\tau}$ with $v_0 = 12\ \mathrm{m\,s^{-1}}$ and $\tau = 2$ s. Find its acceleration at $t = 2$ s, in $\mathrm{m\,s^{-2}}$ (magnitude, 2 decimals).`, 2.21, 0.02,
    r`$a = dv/dt = -\dfrac{v_0}{\tau}e^{-t/\tau} = -6e^{-1} = -2.21\ \mathrm{m\,s^{-2}}$. The magnitude is 2.21.`, { unit: 'm/s²' }),
  nat(5, 'variable acceleration', r`A particle starts from the origin and its speed depends on position as $v = 2\sqrt{x}$ (SI). Find the time it takes to reach $x = 9$ m, in s.`, 3, 0,
    r`$\dfrac{dx}{dt} = 2\sqrt x$, so $\dfrac{dx}{\sqrt x} = 2\,dt$. Integrate from $x=0$ at $t=0$: $2\sqrt x = 2t$, so $t = \sqrt x = 3$ s at $x=9$ m. (Check: $a = v\,dv/dx = 2\sqrt x\cdot\frac1{\sqrt x} = 2\ \mathrm{m\,s^{-2}}$ is constant, so $x = t^2$.)`, { unit: 's', trap: 'It starts with $v=0$ yet moves: $a$ is constant and non-zero.' }),
  nat(4, 'free fall', r`A stone is dropped from the top of a 125 m tower ($g = 10\ \mathrm{m\,s^{-2}}$). Exactly 1 s later a second stone is thrown vertically downward from the same point so that both hit the ground together. Find the speed of projection of the second stone in m/s.`, 11.25, 0.01,
    r`The first stone takes $T = \sqrt{2\times125/10} = 5$ s. The second takes 4 s, so $125 = 4u + 5\times16$, which gives $u = 45/4 = 11.25$ m/s.`, { unit: 'm/s' }),
  nat(5, 'variable acceleration', r`A particle's position is $x = A\sin\omega t$ with $A = 0.4$ m and $\omega = 5\ \mathrm{rad\,s^{-1}}$. Find the magnitude of its maximum acceleration in $\mathrm{m\,s^{-2}}$.`, 10, 0,
    r`$v = A\omega\cos\omega t$ and $a = -A\omega^2\sin\omega t$. The maximum magnitude is $A\omega^2 = 0.4\times25 = 10\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', sub: 'mixed' }),

  // ---------- Assertion-Reason ----------
  asrt(2, 'average speed', r`A body can have a zero average velocity over an interval and a non-zero average speed.`, r`Average speed uses the total path length, while average velocity uses the displacement.`, 0,
    r`If the body returns to the start, the displacement is zero but the distance is not. R states exactly this difference, so it explains A.`),
  asrt(3, 'basic quantities', r`A body can have zero velocity and non-zero acceleration at the same instant.`, r`At the highest point of a vertical throw, the velocity is zero but gravity still acts.`, 0,
    r`Both are true, and R gives an example that explains A.`),
  asrt(3, 'free fall', r`The velocity–time graph of a body falling freely near the Earth's surface is a straight line.`, r`The acceleration due to gravity is nearly constant near the surface of the Earth.`, 0,
    r`Constant acceleration gives $v = gt$, which is linear. R explains A.`),
  asrt(3, 'graphs', r`The area under an acceleration–time graph gives the displacement.`, r`The area under an acceleration–time graph gives the change in velocity.`, 3,
    r`A is false: $\int a\,dt = \Delta v$, a velocity change. R is the true statement. So (D).`, { trap: 'Match graph to area: $a$–$t$ gives $\\Delta v$, $v$–$t$ gives $\\Delta x$.' }),
  asrt(3, 'nth second', r`The distance covered by a body starting from rest in the $n$th second is proportional to $n$.`, r`The velocity of such a body at the end of $n$ seconds is proportional to $n$.`, 3,
    r`Distance in the $n$th second is $\frac a2(2n-1)$, which is not proportional to $n$. A is false. $v = an$ is proportional to $n$, so R is true. (D).`, { trap: 'Distance in the nth second is linear in n but has an offset.' }),
  asrt(4, 'free fall', r`In the absence of air, two bodies of different masses dropped from the same height reach the ground together.`, r`The acceleration due to gravity is independent of the mass of the falling body.`, 0,
    r`Time of fall $\sqrt{2h/g}$ is mass independent because $g$ is. R explains A.`),
  asrt(3, 'graphs', r`The slope of the $x$–$t$ graph at an instant gives the instantaneous velocity.`, r`The slope of the chord between two points on an $x$–$t$ graph gives the average velocity between them.`, 1,
    r`Both are true. But R is a separate fact about chords; it is not the reason for A (A comes from the definition $v = dx/dt$ as the limit of chord slopes).`),
  asrt(4, 'equations of motion', r`The equation $v = u + at$ is valid for a body moving with variable acceleration.`, r`Acceleration is the rate of change of velocity.`, 3,
    r`$v = u + at$ needs constant acceleration; for variable acceleration, $v = u + \int a\,dt$. A is false. R is true.`),

  // ---------- Statements ----------
  stm(2, 'basic quantities', r`The displacement can be zero even when the distance is not.`, r`The magnitude of displacement is never greater than the distance.`, 0, r`Both are true. A round trip has zero displacement and non-zero distance, and a path length is always at least the straight-line separation.`),
  stm(3, 'average speed', r`A body can have zero speed and non-zero acceleration.`, r`The average speed over an interval is never smaller than the magnitude of the average velocity.`, 0,
    r`I: at the top of a throw. II: the path length is at least the displacement. Both true.`),
  stm(3, 'graphs', r`If a body's velocity is constant, its $x$–$t$ graph is a straight line.`, r`If an $x$–$t$ graph is a straight line, the acceleration is zero.`, 0,
    r`Constant $v$ means $x$ changes linearly. A straight $x$–$t$ line has constant slope (constant $v$), so $a = 0$. Both true.`),
  stm(4, 'free fall', r`A ball thrown vertically up has the same acceleration at every point of its path.`, r`The acceleration of the ball is zero at the highest point because the velocity is zero there.`, 2,
    r`I is true: acceleration is $g$ downward throughout. II is false: zero velocity does not mean zero acceleration.`),
  mcq(3, 'concepts', r`How many of these statements are correct? (a) The average velocity can be zero while the average speed is not. (b) The slope of a $v$–$t$ graph is the acceleration. (c) The area under an $a$–$t$ graph is the displacement. (d) $v = u + at$ holds for any acceleration. (e) The acceleration due to gravity depends on the mass of the body.`, '2', ['1', '3', '4'],
    r`(a) true, (b) true, (c) false: it gives the change in velocity, (d) false: only for constant acceleration, (e) false. Two are correct.`, { format: 'statements' }),
  stm(4, 'equations of motion', r`The average velocity over an interval equals $(u+v)/2$ for any motion in a straight line.`, r`This relation is true only when the acceleration is constant.`, 3,
    r`I is false. Example: $x = t^3$ from $t=0$ to $2$ s has average velocity $8/2 = 4$ m/s, but $(u+v)/2 = (0+12)/2 = 6$ m/s. II is true.`),
  stm(2, 'basic quantities', r`A negative acceleration always means the body is slowing down.`, r`A body slows down when its velocity and acceleration are in opposite directions.`, 3,
    r`I is false: a body moving in the negative direction with negative acceleration speeds up. II is true.`, { trap: 'The sign of acceleration depends on the chosen axis.' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'graphs', group: 'm1',
    q: 'Match each graph in List I with the motion in List II.',
    options: ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`A horizontal $x$–$t$ line is rest (r). A straight inclined $x$–$t$ line is constant velocity (p). A $v$–$t$ line through the origin is uniform acceleration from rest (q). A $v$–$t$ line with positive slope that does not pass through the origin is uniform acceleration with non-zero initial velocity (s).` },
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'graphs', group: 'm2',
    q: 'Match each item in List I with the unit in List II.',
    options: ['A-q, B-s, C-p, D-r', 'A-p, B-s, C-q, D-r', 'A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r'], answer: 0,
    sol: r`Area under $v$–$t$ is displacement: m (q). Area under $a$–$t$ is a velocity change: $\mathrm{m\,s^{-1}}$ (s). Slope of $v$–$t$ is acceleration: $\mathrm{m\,s^{-2}}$ (p). Slope of $a$–$t$ is jerk: $\mathrm{m\,s^{-3}}$ (r).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'vertical throw', group: 'm3',
    q: 'A ball is thrown up at $20\\ \\mathrm{m\\,s^{-1}}$ ($g = 10\\ \\mathrm{m\\,s^{-2}}$). Match List I with List II.',
    options: ['A-p, B-s, C-r, D-q', 'A-s, B-p, C-r, D-q', 'A-s, B-q, C-p, D-r', 'A-q, B-p, C-r, D-s'], answer: 1,
    sol: r`Maximum height $= 400/20 = 20$ m (s). Time of flight $= 2\times20/10 = 4$ s (p). Speed on return $= 20\ \mathrm{m\,s^{-1}}$ (r). Height at 1 s $= 20 - 5 = 15$ m (q).` },

  // ---------- Passages ----------
  { id: nid(), type: 'nat', level: 2, format: 'passage', exams: EX[2], sub: 'graphs', group: 'p1',
    q: 'Find the acceleration during the first 10 s, in $\\mathrm{m\\,s^{-2}}$.', answer: 2, tol: 0, unit: 'm/s²',
    sol: r`Acceleration $= \Delta v/\Delta t = 20/10 = 2\ \mathrm{m\,s^{-2}}$.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'graphs', group: 'p1',
    q: 'Find the total distance travelled in 40 s, in m.', answer: 600, tol: 0, unit: 'm',
    sol: r`Area of the trapezoid: speed-up $\tfrac12\times10\times20 = 100$ m; cruise $20\times20 = 400$ m; slow-down $\tfrac12\times10\times20 = 100$ m. Total $=600$ m.` },
  { id: nid(), type: 'mcq', level: 3, format: 'passage', exams: EX[3], sub: 'graphs', group: 'p1', answer: 2,
    q: 'The average speed over the 40 s is',
    options: [r`$20\ \mathrm{m\,s^{-1}}$`, r`$10\ \mathrm{m\,s^{-1}}$`, r`$15\ \mathrm{m\,s^{-1}}$`, r`$12.5\ \mathrm{m\,s^{-1}}$`],
    sol: r`Average speed $= 600/40 = 15\ \mathrm{m\,s^{-1}}$. The 20 m/s is only the cruising speed, and the 10 m/s is the mean of the two ramp phases only.`, trap: 'Average speed is total distance over total time, not the peak speed.' },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'relative motion', group: 'p2',
    q: 'At what time is the gap between the cars smallest, in s?', answer: 10, tol: 0, unit: 's',
    sol: r`Gap $= 150 + t^2 - 20t$. It is smallest when $2t - 20 = 0$, i.e. $t = 10$ s. (At that moment the cars have equal speed: $2\times10 = 20$.)` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'relative motion', group: 'p2',
    q: 'What is the smallest gap, in m?', answer: 50, tol: 0, unit: 'm',
    sol: r`At $t = 10$ s: $150 + 100 - 200 = 50$ m. Since the gap never reaches zero, $A$ does not catch $B$.` },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'relative motion', group: 'p2', answer: 3,
    q: 'If the initial gap were only 90 m (and nothing else changed), what would happen?',
    options: ['Car A never catches B', 'The cars collide at t = 10 s', 'The cars collide at t = 13.2 s only', 'Car A catches B at about 6.8 s and, if it passes, B catches A again at about 13.2 s'],
    sol: r`Gap $= 90 + t^2 - 20t = 0$ gives $t = 10\pm\sqrt{10}$, i.e. 6.84 s and 13.16 s. $A$ reaches $B$ at 6.84 s and moves ahead; $B$ is accelerating and catches up again at 13.16 s.`, trap: 'A quadratic with two positive roots means two meetings.' },

  // ================= Added 2026-11-22: harder and more varied questions =================
  // ---------- Level 2 ----------
  mcq(2, 'free fall', r`A body is released from rest and falls freely. The distances it covers in the 1st, 2nd and 3rd seconds are in the ratio`, '1 : 3 : 5', ['1 : 2 : 3', '1 : 4 : 9', '1 : 1 : 1'],
    r`Distance in the $n$th second is $s_n = \tfrac12g(2n-1)$, so the ratio is $1:3:5$. The ratio $1:4:9$ is for the <i>total</i> distances after 1, 2 and 3 s.`, { trap: 'Total distance and distance in the $n$th second are different.' }),
  nat(2, 'area under graph', r`The velocity of a body rises uniformly from 0 to $12\ \mathrm{m\,s^{-1}}$ in 4 s and then stays constant for 6 s. Find the total distance travelled in m.`, 96, 0,
    r`First 4 s: area of a triangle $=\tfrac12\times4\times12 = 24$ m. Next 6 s: a rectangle $12\times6 = 72$ m. Total $= 96$ m.`, { unit: 'm', calc: () => 0.5 * 4 * 12 + 12 * 6 }),
  nat(2, 'stopping distance', r`A car moving at $54\ \mathrm{km\,h^{-1}}$ is braked at a constant $3\ \mathrm{m\,s^{-2}}$. Find its stopping distance in m (1 decimal).`, 37.5, 0.05,
    r`$54\ \mathrm{km\,h^{-1}} = 15\ \mathrm{m\,s^{-1}}$. $0 = u^2 - 2as$, so $s = 15^2/(2\times3) = 37.5$ m.`, { unit: 'm', calc: () => 15 ** 2 / 6 }),
  mcq(2, 'graphs', r`Which statement about a <i>speed</i>–time graph is correct?`, 'It can never go below the time axis', ['Its slope gives the velocity', 'Its area gives the displacement', 'It must be a straight line'],
    r`Speed is the magnitude of velocity and so cannot be negative, so the graph never goes below the axis. The area gives the distance (not displacement) and the slope gives the rate of change of speed (not velocity).`),
  nat(2, 'nth second', r`A body has initial velocity $3\ \mathrm{m\,s^{-1}}$ and uniform acceleration $2\ \mathrm{m\,s^{-2}}$. Find the distance covered in the 4th second in m.`, 10, 0,
    r`$s_n = u + a(n-\tfrac12) = 3 + 2\times3.5 = 10$ m.`, { unit: 'm', calc: () => 3 + 2 * 3.5 }),
  mcq(2, 'graphs', r`Two bodies have straight-line $x$–$t$ graphs through the origin. The graph of $A$ is steeper than that of $B$. Then`, 'A moves with the greater speed', ['B moves with the greater speed', 'A has the greater acceleration', 'both have the same speed'],
    r`The slope of an $x$–$t$ graph is the velocity. A straight line means constant velocity (zero acceleration) and a steeper line means a larger speed.`),

  // ---------- Level 3 ----------
  nat(3, 'relative motion', r`Stone $A$ is dropped from a tall tower. At the same instant stone $B$ is thrown vertically downward at $10\ \mathrm{m\,s^{-1}}$ from the same point. How far apart are they after 3 s (in m)? Neither has reached the ground.`, 30, 0,
    r`Both have the same acceleration $g$, so the relative acceleration is zero. $B$ moves at a constant $10\ \mathrm{m\,s^{-1}}$ relative to $A$. After 3 s the gap is $10\times3 = 30$ m.`, { unit: 'm', calc: () => 10 * 3, trap: 'The separation grows linearly, not as $t^2$.' }),
  nat(3, 'vertical throw', r`On the Moon ($g = 1.6\ \mathrm{m\,s^{-2}}$) an astronaut throws a ball straight up at $8\ \mathrm{m\,s^{-1}}$. Find the maximum height in m.`, 20, 0.05,
    r`$h = \dfrac{u^2}{2g} = \dfrac{64}{3.2} = 20$ m.`, { unit: 'm', calc: () => 64 / 3.2 }),
  nat(3, 'free fall', r`In a reaction-time test a ruler is released and caught after it has fallen 19.6 cm. Using $g = 9.8\ \mathrm{m\,s^{-2}}$, find the reaction time in milliseconds.`, 200, 0,
    r`$h = \tfrac12gt^2$, so $t = \sqrt{2h/g} = \sqrt{2\times0.196/9.8} = 0.2$ s $= 200$ ms.`, { unit: 'ms', calc: () => Math.sqrt(2 * 0.196 / 9.8) * 1000 }),
  nat(3, 'free fall', r`Water drops leave a tap at equal intervals. When the first drop reaches the floor 18 m below, the fourth drop is just leaving the tap. How far below the tap is the <b>second</b> drop at that instant (in m)?`, 8, 0,
    r`The first drop has fallen for $3T$, the second for $2T$, the third for $T$ and the fourth for 0 (where $T$ is the interval). Distances $\propto t^2$: $18:\ 18\times\tfrac49:\ 18\times\tfrac19:\ 0$, i.e. 18, 8, 2, 0 m. The second drop is 8 m below the tap.`, { unit: 'm', calc: () => 18 * 4 / 9 }),
  nat(3, 'equal intervals', r`A train starts from rest with uniform acceleration. Its first carriage takes 4 s to pass a signal post (the front of the train is at the post at $t = 0$). Find the time the <b>fourth</b> carriage alone takes to pass the post, in s (2 decimals). All carriages are equal.`, 1.07, 0.02,
    r`Distance from the post $= $ (number of carriages)$\times L = \tfrac12at^2$, so $t\propto\sqrt n$. The first $n$ carriages pass in $4\sqrt n$ s. The fourth alone takes $4(\sqrt4-\sqrt3) = 4(2-1.732) = 1.07$ s.`, { unit: 's', calc: () => 4 * (2 - Math.sqrt(3)), trap: 'It is the difference of the times for 4 and for 3 carriages, not a quarter of the time.' }),
  mcq(3, 'variable acceleration', r`A particle's speed is proportional to its distance from the origin: $v = kx$ ($k$ constant). Its acceleration is`, r`proportional to $x$ (and also to $v$)`, ['zero', 'constant but not zero', 'proportional to $1/x$'],
    r`$a = v\dfrac{dv}{dx} = (kx)(k) = k^2x$. So $a\propto x$, and since $v = kx$ it is also $a = kv$: the motion speeds up exponentially.`),
  mcq(3, 'equations of motion', r`For motion with constant acceleration, the instantaneous velocity at the <b>mid-instant</b> of a time interval is equal to`, 'the average velocity over that interval', ['half the average velocity', 'the average of the speeds only if $u=0$', 'the final velocity'],
    r`With constant $a$, $v(t) = u + at$ is linear in $t$. At the middle of the interval its value is $u + a\tfrac{T}{2} = \dfrac{u+v}{2}$, which equals the average velocity.`),
  nat(3, 'variable acceleration', r`The position of a particle is $x = 3t^2 - t^3$ (SI). Find its largest positive displacement from the origin for $t\ge0$ in m.`, 4, 0,
    r`$v = 6t - 3t^2 = 0$ at $t = 0$ and $t = 2$ s. At $t = 2$: $x = 12 - 8 = 4$ m. (After $t = 2$ it moves back.)`, { unit: 'm', calc: () => 3 * 4 - 8 }),
  nat(3, 'average speed', r`A particle moves as $x = t^2 - 4t$ (SI). Find its average <i>speed</i> from $t = 0$ to $t = 6$ s in $\mathrm{m\,s^{-1}}$ (2 decimals).`, 3.33, 0.01,
    r`$v = 2t - 4$ is zero at $t = 2$ s, where $x = 4 - 8 = -4$ m. From $0$ to $2$ s it moves 4 m backwards. At $t = 6$, $x = 12$ m, so from $2$ to $6$ s it moves 16 m forward. Distance $= 20$ m. Average speed $= 20/6 = 3.33\ \mathrm{m\,s^{-1}}$ (the average velocity is $12/6 = 2$).`, { unit: 'm/s', calc: () => 20 / 6, trap: 'Average speed uses the total path, not the net displacement.' }),
  nat(3, 'two-stage motion', r`A lift accelerates upward from rest at $1.5\ \mathrm{m\,s^{-2}}$ for 4 s, moves at constant speed for 5 s, and then brakes uniformly at $3\ \mathrm{m\,s^{-2}}$ to rest. Find the total height climbed in m.`, 48, 0,
    r`Speed after 4 s: $v = 6\ \mathrm{m\,s^{-1}}$. Stage 1: $\tfrac12\times6\times4 = 12$ m. Stage 2: $6\times5 = 30$ m. Braking takes $6/3 = 2$ s and covers $\tfrac12\times6\times2 = 6$ m. Total $= 48$ m.`, { unit: 'm', calc: () => 12 + 30 + 6 }),
  nat(3, 'dimensions', r`If $x = k\,a^{m}t^{n}$, where $x$ is length, $a$ is acceleration, $t$ is time and $k$ is a pure number, find $m + n$.`, 3, 0,
    r`$[L] = [LT^{-2}]^m[T]^n = [L^mT^{n-2m}]$. So $m = 1$ and $n - 2m = 0$ gives $n = 2$. Then $m + n = 3$ (this is $x\propto at^2$).`, { calc: () => 3 }),
  asrt(3, 'average speed', r`The average speed of a body over an interval can never be less than the magnitude of its average velocity.`, r`The distance travelled is never less than the magnitude of the displacement.`, 0,
    r`Both are true and R explains A. Average speed $=$ distance$/t\ge|\text{displacement}|/t = |\vec v_{avg}|$.`),
  asrt(3, 'free fall', r`A freely falling body has constant acceleration.`, r`The velocity of a freely falling body increases linearly with time.`, 1,
    r`Both are true. R is a consequence of A, not an explanation of why the acceleration is constant (the constancy of $g$ comes from gravity near the Earth's surface). So A and R are true, but R does not explain A.`),
  stm(3, 'graphs', r`A body's velocity can change sign while its acceleration stays constant.`, r`A ball thrown vertically up has constant acceleration $g$ downward, yet its velocity changes sign at the top.`, 0,
    r`Both statements are true, and II is an example for I.`),
  mat(3, 'graphs', 'm4', r`Match each $x$–$t$ graph in List I with the motion in List II.`, 'A-q, B-s, C-r, D-p', ['A-q, B-p, C-r, D-s', 'A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r'],
    r`A straight line sloping up: constant positive velocity (q). A parabola opening upward: constant positive acceleration (s). A parabola opening downward: constant negative acceleration (r). A horizontal line: at rest (p). So A-q, B-s, C-r, D-p.`),
  mat(3, 'area under graph', 'm7', r`Match each velocity–time graph in List I with the displacement in List II (positive direction only).`, 'A-p, B-r, C-s, D-q', ['A-r, B-p, C-s, D-q', 'A-p, B-s, C-r, D-q', 'A-p, B-r, C-q, D-s'],
    r`A: triangle $\tfrac12\times4\times10 = 20$ m (p). B: rectangle $5\times6 = 30$ m (r). C: triangle $\tfrac12\times2\times10 = 10$ plus rectangle $10\times3 = 30$: 40 m (s). D: triangle $\tfrac12\times5\times10 = 25$ m (q). So A-p, B-r, C-s, D-q.`),
  mat(3, 'basic quantities', 'm10', r`Match each state of motion along $+x$ in List I with the description in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Speed increases when $v$ and $a$ have the same sign and decreases when the signs are opposite. $v>0,a>0$: moving forward, speeding up (p). $v>0,a<0$: forward, slowing (q). $v<0,a<0$: backward, speeding up (r). $v<0,a>0$: backward, slowing (s). So A-p, B-q, C-r, D-s.`),
  mat(3, 'free fall', 'm11', r`A stone is dropped from rest ($g = 10\ \mathrm{m\,s^{-2}}$). Match each quantity in List I with its value in List II.`, 'A-s, B-q, C-r, D-p', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-s, B-r, C-q, D-p'],
    r`A: $\tfrac12(10)(3)^2 = 45$ m (s). B: third second $= 5\times5 = 25$ m (q). C: $v = gt = 30\ \mathrm{m\,s^{-1}}$ (r). D: $80 = 5t^2$ gives $t = 4$ s (p). So A-s, B-q, C-r, D-p.`),
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'area under graph', group: 'p3',
    q: 'Find the displacement of the particle from $t = 0$ to $t = 11$ s in m.', answer: 60, tol: 0, calc: () => 18 + 24 + 24 - 6,
    sol: r`From 0 to 3 s: $\tfrac12\times3\times12 = 18$ m. From 3 to 5 s: $12\times2 = 24$ m. From 5 to 9 s the velocity falls from 12 to 0 (slope $-3$): $\tfrac12\times4\times12 = 24$ m. From 9 to 11 s it is negative, down to $-6$: $-\tfrac12\times2\times6 = -6$ m. Total $= 18+24+24-6 = 60$ m.` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'area under graph', group: 'p3',
    q: 'Find the total distance travelled from $t = 0$ to $t = 11$ s in m.', answer: 72, tol: 0, calc: () => 18 + 24 + 24 + 6,
    sol: r`The line from 5 s to 11 s goes from $+12$ to $-6\ \mathrm{m\,s^{-1}}$ over 6 s (slope $-3$), so it crosses zero at $t = 9$ s. Moving forward: $18 + 24 + 24 = 66$ m (up to $t = 9$ s). Moving backward: $\tfrac12\times2\times6 = 6$ m. Distance $= 66 + 6 = 72$ m (the displacement is $66 - 6 = 60$ m).`, trap: 'Distance adds the backward area; displacement subtracts it.' },
  { id: nid(), type: 'mcq', level: 3, format: 'passage', exams: EX[3], sub: 'area under graph', group: 'p3', answer: 1,
    q: 'What is the acceleration of the particle at $t = 7$ s?',
    options: [r`$+3\ \mathrm{m\,s^{-2}}$`, r`$-3\ \mathrm{m\,s^{-2}}$`, r`$-2\ \mathrm{m\,s^{-2}}$`, r`$0$`],
    sol: r`Between 5 s and 11 s the velocity goes from $+12$ to $-6\ \mathrm{m\,s^{-1}}$ in 6 s, so $a = -18/6 = -3\ \mathrm{m\,s^{-2}}$ (the particle still moves forward at 7 s but is slowing down).`, trap: 'The velocity is still positive at 7 s; only the acceleration is negative.' },
  mcq(3, 'vertical throw', r`A ball is thrown vertically up in the presence of air resistance. Compared with the time to rise, the time to fall back to the starting point is`, 'longer', ['shorter', 'the same', 'longer or shorter depending on the mass only'],
    r`While rising, drag acts downward, so $a>g$. While falling, drag acts upward, so $a<g$. The distances are equal, so the fall takes longer (and the ball returns with less speed than it was thrown).`),

  // ---------- Level 4 ----------
  msq(4, 'vertical throw', r`A ball is thrown vertically upward in air. Air resistance is not negligible. Which statements are correct?`,
    ['The time of ascent is less than the time of descent', 'The speed on returning to the starting point is less than the speed of projection', 'The maximum height is the same as in a vacuum', 'At the highest point the acceleration is $g$ downward'], [0, 1, 3],
    r`Drag opposes the motion, so the rise is faster ($a>g$) and the fall slower ($a<g$): A true. Energy is lost to drag, so the speed on return is less (B true). The maximum height is smaller than in a vacuum (C false). At the top $v = 0$, so drag is zero and $a = g$ (D true).`),
  msq(4, 'graphs', r`The velocity of a body falls uniformly from $+10\ \mathrm{m\,s^{-1}}$ at $t=0$ to $-10\ \mathrm{m\,s^{-1}}$ at $t = 5$ s. Which statements are correct?`,
    [r`The acceleration is $-4\ \mathrm{m\,s^{-2}}$ throughout`, 'The body is momentarily at rest at $t = 2.5$ s', 'The displacement from 0 to 5 s is zero', 'The distance travelled from 0 to 5 s is 50 m'], [0, 1, 2],
    r`$a = -20/5 = -4$ (A true). $v = 0$ at $t = 2.5$ s (B true). The areas of the two triangles cancel: $+\tfrac12\times2.5\times10 = 12.5$ and $-12.5$ (C true). The distance is $12.5+12.5 = 25$ m, not 50 (D false).`),
  msq(4, 'relative motion', r`Body $A$ is dropped from a high tower at $t = 0$. Body $B$ is dropped from the same point at $t = 1$ s. Both are in free fall (no air). Which statements are correct?`,
    ['The relative acceleration of the two bodies is zero', 'The distance between them stays constant', 'The distance between them increases linearly with time', 'The relative velocity is constant'], [0, 2, 3],
    r`Both have acceleration $g$, so the relative acceleration is zero (A) and the relative velocity stays at $g\times1\ \mathrm{s}$ (D). The separation is $\tfrac12gt^2-\tfrac12g(t-1)^2 = gt - \tfrac12g$, which grows linearly (C), not constant (B false).`),
  msq(4, 'variable acceleration', r`A particle has acceleration $a = -kv$ ($k>0$ constant) and initial velocity $v_0$. Which statements are correct?`,
    [r`$v = v_0e^{-kt}$`, r`The particle comes to rest at a finite time`, r`The total distance travelled is $v_0/k$`, r`The velocity is a linear function of position: $v = v_0 - kx$`], [0, 2, 3],
    r`$dv/dt = -kv$ gives $v = v_0e^{-kt}$ (A), which reaches zero only as $t\to\infty$ (B false). Writing $a = v\,dv/dx = -kv$ gives $dv/dx = -k$, so $v = v_0 - kx$ (D) and the stopping distance is $v_0/k$ (C).`),
  nat(4, 'relative motion', r`Car $A$ moves at a constant $20\ \mathrm{m\,s^{-1}}$. Car $B$ starts from rest at the same point and instant with a constant acceleration $2\ \mathrm{m\,s^{-2}}$ in the same direction. Find the maximum separation before $B$ overtakes $A$, in m.`, 100, 0,
    r`The separation is $20t - t^2$. It is greatest when the speeds are equal: $2t = 20$, $t = 10$ s, giving $200 - 100 = 100$ m. ($B$ overtakes at $t = 20$ s.)`, { unit: 'm', calc: () => 20 * 10 - 100 }),
  nat(4, 'rocket', r`A rocket starts from rest and rises with a constant net upward acceleration of $20\ \mathrm{m\,s^{-2}}$ for 10 s until its fuel is used up. It then moves freely under gravity ($g = 10\ \mathrm{m\,s^{-2}}$). Find the maximum height reached, in m.`, 3000, 0,
    r`Burn: $h_1 = \tfrac12\times20\times10^2 = 1000$ m and $v = 200\ \mathrm{m\,s^{-1}}$. Coasting: $h_2 = v^2/2g = 200^2/20 = 2000$ m. Total $= 3000$ m.`, { unit: 'm', calc: () => 1000 + 200 ** 2 / 20 }),
  nat(4, 'vertical throw', r`Stone $A$ is thrown vertically up at $30\ \mathrm{m\,s^{-1}}$ from the ground. Stone $B$ is thrown with the same speed from the same point 2 s later. Take $g = 10\ \mathrm{m\,s^{-2}}$. At what height do they meet, in m?`, 40, 0,
    r`$y_A = 30t - 5t^2$ and $y_B = 30(t-2) - 5(t-2)^2$. Setting equal: $30t - 5t^2 = 30t - 60 - 5t^2 + 20t - 20$, so $0 = 20t - 80$, $t = 4$ s. Height $= 30\times4 - 5\times16 = 40$ m.`, { unit: 'm', calc: () => 30 * 4 - 5 * 16 }),
  nat(4, 'sound and free fall', r`A stone is dropped into a well and the splash is heard 3.15 s later. Take $g = 10\ \mathrm{m\,s^{-2}}$ and the speed of sound $300\ \mathrm{m\,s^{-1}}$. Find the depth of the well in m.`, 45, 0,
    r`Let the fall time be $t$. Depth $h = 5t^2$ and the sound takes $h/300$. $t + 5t^2/300 = 3.15$, so $t^2 + 60t - 189 = 0$, giving $t = 3$ s (the other root is negative). $h = 5\times9 = 45$ m. Check: $3 + 45/300 = 3.15$ s.`, { unit: 'm', calc: () => 5 * 9, trap: 'Do not forget the time the sound takes to climb back up.' }),
  nat(4, 'stopping distance', r`Two cars travel one behind the other at $30\ \mathrm{m\,s^{-1}}$. The front car brakes suddenly at $6\ \mathrm{m\,s^{-2}}$. The driver behind reacts after 0.6 s and then brakes at the same rate. What is the smallest initial gap (in m) that avoids a collision?`, 18, 0,
    r`Each car, once braking, stops in $30^2/(2\times6) = 75$ m. The front car stops after 75 m. The rear car first moves $30\times0.6 = 18$ m at full speed and then 75 m while braking, 93 m in all. The gap shrinks by $93 - 75 = 18$ m, and it shrinks steadily until both have stopped. So the initial gap must be more than 18 m (at exactly 18 m the bumpers just touch).`, { unit: 'm', calc: () => 93 - 75, trap: 'The extra distance is simply speed $\\times$ reaction time, because both cars brake equally.' }),
  nat(4, 'equations of motion', r`A body moves with constant acceleration. Its positions at $t = 1$, $2$ and $3$ s are $4$, $9$ and $16$ m. Find its velocity at $t = 2$ s in $\mathrm{m\,s^{-1}}$.`, 6, 0,
    r`For constant acceleration the velocity at the middle of an interval equals the average velocity over it: $v(2) = \dfrac{x(3)-x(1)}{2} = \dfrac{16-4}{2} = 6\ \mathrm{m\,s^{-1}}$. (Check: the second difference $16-9-(9-4) = 2$ gives $a = 2$.)`, { unit: 'm/s', calc: () => (16 - 4) / 2 }),
  nat(4, 'free fall', r`A stone is thrown vertically up at $10\ \mathrm{m\,s^{-1}}$ from the top of a 40 m tower. Find the speed with which it reaches the ground, in $\mathrm{m\,s^{-1}}$. Take $g = 10\ \mathrm{m\,s^{-2}}$.`, 30, 0,
    r`Use $v^2 = u^2 + 2gh$ with $h = 40$ m measured downward: it comes down past the top with $10\ \mathrm{m\,s^{-1}}$, so $v^2 = 100 + 2\times10\times40 = 900$ and $v = 30\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => Math.sqrt(100 + 800) }),
  nat(4, 'variable acceleration', r`A particle has $v = 8 - 2t$ (SI). Find the total distance travelled in the first 7 s, in m.`, 25, 0,
    r`$v = 0$ at $t = 4$ s. From 0 to 4 s: $\tfrac12\times4\times8 = 16$ m forward. From 4 to 7 s: $v$ goes from 0 to $-6$: $\tfrac12\times3\times6 = 9$ m backward. Distance $= 16 + 9 = 25$ m (displacement $= 7$ m).`, { unit: 'm', calc: () => 16 + 9 }),
  nat(4, 'equations of motion', r`A particle has constant acceleration $+4\ \mathrm{m\,s^{-2}}$ and initial velocity $-8\ \mathrm{m\,s^{-1}}$. Find the total distance travelled in the first 6 s, in m.`, 40, 0,
    r`It stops when $-8 + 4t = 0$, i.e. $t = 2$ s, having moved $8^2/(2\times4) = 8$ m backward. In the remaining 4 s it moves forward $\tfrac12\times4\times16 = 32$ m (from rest). Distance $= 8 + 32 = 40$ m (displacement $= 24$ m).`, { unit: 'm', calc: () => 8 + 32 }),
  nat(4, 'variable acceleration', r`A particle has velocity $v = t^2 - 4t + 3$ (SI). Find the total distance travelled from $t = 0$ to $t = 4$ s in m.`, 4, 0,
    r`$v = (t-1)(t-3)$ changes sign at $t = 1$ and $t = 3$. $x = \dfrac{t^3}{3} - 2t^2 + 3t$. $x(1) = \tfrac43$, $x(3) = 0$, $x(4) = \tfrac43$. Distance $= \tfrac43 + \tfrac43 + \tfrac43 = 4$ m.`, { unit: 'm', calc: () => 4 }),
  nat(4, 'relative motion', r`A student runs at $6\ \mathrm{m\,s^{-1}}$ to catch a bus. When she is 20 m behind it, the bus starts from rest with acceleration $1\ \mathrm{m\,s^{-2}}$. What is the smallest distance (in m) between her and the bus?`, 2, 0,
    r`Gap $= 20 + \tfrac12t^2 - 6t$. Its minimum is at $t = 6$ s, giving $20 + 18 - 36 = 2$ m. She never catches the bus (the gap never reaches zero).`, { unit: 'm', calc: () => 20 + 18 - 36 }),
  nat(4, 'variable acceleration', r`A particle's velocity is $v = t^2 - 6t + 8$ (SI). Find the total distance travelled from $t = 0$ to $t = 5$ s, in m (2 decimals).`, 9.33, 0.01,
    r`$v = (t-2)(t-4)$. $x = \dfrac{t^3}{3} - 3t^2 + 8t$. $x(2) = 6.667$, $x(4) = 5.333$, $x(5) = 6.667$. Distance $= 6.667 + 1.333 + 1.333 = 9.33$ m.`, { unit: 'm', calc: () => 6.6667 + 1.3333 + 1.3333 }),
  nat(4, 'vertical throw', r`Two stones are thrown vertically up from the ground at the same instant with speeds $30\ \mathrm{m\,s^{-1}}$ and $20\ \mathrm{m\,s^{-1}}$. Take $g = 9.8\ \mathrm{m\,s^{-2}}$. How far apart are they when the faster one is at its highest point, in m (1 decimal)?`, 30.6, 0.1,
    r`Both have the same acceleration, so the separation is $(u_1-u_2)t$. The faster stone is at the top at $t = 30/9.8 = 3.06$ s. Separation $= 10\times3.06 = 30.6$ m.`, { unit: 'm', calc: () => 10 * 30 / 9.8 }),
  nat(4, 'relative motion', r`The ceiling of a lift is 2.5 m above its floor. The lift is rising with an upward acceleration of $1.2\ \mathrm{m\,s^{-2}}$. A bolt falls from the ceiling. Find the time it takes to hit the floor in s (2 decimals). Take $g = 10\ \mathrm{m\,s^{-2}}$.`, 0.67, 0.01,
    r`Relative to the lift the bolt has acceleration $g + a = 11.2\ \mathrm{m\,s^{-2}}$ downward (the bolt falls freely while the floor rises). $2.5 = \tfrac12(11.2)t^2$, so $t = \sqrt{5/11.2} = 0.67$ s.`, { unit: 's', calc: () => Math.sqrt(5 / 11.2), trap: 'Use the relative acceleration $g + a$, not $g$ alone.' }),
  mcq(4, 'relative motion', r`The velocity of a body is positive and its acceleration is negative. The body is`, 'moving in the +x direction and slowing down', ['moving in the −x direction and speeding up', 'moving in the +x direction and speeding up', 'at rest'],
    r`Speed decreases when $v$ and $a$ have opposite signs. Here $v>0$ (moving to $+x$) and $a<0$, so the body slows down.`),
  mcq(4, 'concepts', r`How many of these statements are correct? (a) A body can have zero velocity and non-zero acceleration. (b) A body can have constant speed and non-zero acceleration in straight-line motion. (c) The slope of the $v$–$t$ graph is the acceleration. (d) The area under the $x$–$t$ graph is the velocity.`, 'Only two', ['Only one', 'Only three', 'All four'],
    r`(a) true (top of a throw). (b) false: in a straight line, constant speed means constant velocity, hence zero acceleration. (c) true. (d) false: the area under $x$–$t$ has no physical meaning here; the slope gives velocity. So two are correct.`, { format: 'statements' }),
  stm(4, 'free fall', r`A stone thrown up passes a point at height $h$ going up and again coming down with the same speed.`, r`The speed at a given height depends only on $v^2 = u^2 - 2gh$ and not on the direction of motion.`, 0,
    r`Both are true: $v^2 = u^2 - 2gh$ gives the same $|v|$ at the same height, so II explains I.`),
  stm(4, 'basic quantities', r`If the acceleration of a body is zero at an instant, its velocity must be zero at that instant.`, r`If the velocity of a body is zero at an instant, its acceleration must be zero at that instant.`, 1,
    r`A body in uniform motion has $a = 0$ but $v\ne0$ (I false). A ball at the top of its flight has $v = 0$ but $a = g$ (II false). Both false.`),
  asrt(4, 'vertical throw', r`A ball thrown upward in air takes more time to come down than to go up.`, r`While moving up, both gravity and air resistance act downward; while moving down, air resistance acts upward and opposes gravity.`, 0,
    r`Both true and R explains A. On the way up $a = g + f/m$ (large), on the way down $a = g - f/m$ (small). The same distance is covered more slowly on the way down.`),
  asrt(4, 'graphs', r`The area under a speed–time graph is always non-negative.`, r`Speed is the magnitude of the velocity and cannot be negative.`, 0,
    r`Both true and R explains A: the graph never goes below the axis, so the area (the distance) cannot be negative.`),
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'vertical throw', group: 'm5',
    q: r`A ball is thrown vertically upward at $30\ \mathrm{m\,s^{-1}}$ from the ground ($g = 10\ \mathrm{m\,s^{-2}}$). Match each item in List I with its value in List II.`,
    options: ['A-p, B-q, C-r, D-s', 'A-p, B-s, C-r, D-q', 'A-s, B-q, C-r, D-p', 'A-r, B-q, C-p, D-s'], answer: 1,
    sol: r`A: time to the top $= 30/10 = 3$ s (p). B: maximum height $= 900/20 = 45$ m (s). C: velocity at $t = 4$ s $= 30 - 40 = -10\ \mathrm{m\,s^{-1}}$ (r). D: speed at 25 m: $v^2 = 900 - 2\times10\times25 = 400$, so $20\ \mathrm{m\,s^{-1}}$ (q). So A-p, B-s, C-r, D-q.` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'variable acceleration', group: 'm6',
    q: 'Match each position function in List I with the time (in List II) at which the particle is momentarily at rest.',
    options: ['A-p, B-r, C-q, D-s', 'A-q, B-r, C-p, D-s', 'A-q, B-p, C-r, D-s', 'A-q, B-r, C-s, D-p'], answer: 1,
    sol: r`A: $x = t^2-4t$, $v = 2t - 4 = 0$ at $t = 2$ (q). B: $x = t^2 - 6t$, $v = 0$ at $t = 3$ (r). C: $x = t^3 - 3t$, $v = 3t^2 - 3 = 0$ at $t = 1$ (p). D: $x = 2t^2 - 16t$, $v = 4t - 16 = 0$ at $t = 4$ (s). So A-q, B-r, C-p, D-s.` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'average velocity', group: 'm9',
    q: 'Match each quantity in List I with its value in List II (SI units).',
    options: ['A-r, B-s, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-s, B-r, C-q, D-p', 'A-r, B-q, C-s, D-p'], answer: 1,
    sol: r`A: $x = t^2$, average velocity over 0 to 4 s $= 16/4 = 4$ (r). B: $v = 2t$ at $t = 4$: 8 (s). C: for $x = t^2-4t$ the particle goes to $-4$ at $t = 2$ and returns to 0 at $t = 4$: distance 8, average speed $8/4 = 2$ (q). D: its displacement is 0, so average velocity is 0 (p). So A-r, B-s, C-q, D-p.` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'relative motion', group: 'p4',
    q: 'At what time (in s, after the car passes the police car) does the police car catch the speeder?', answer: 9, tol: 0, calc: () => 9,
    sol: r`Speeder: $x_s = 12t$. Police: $x_p = \tfrac12(6)(t-3)^2 = 3(t-3)^2$ for $t\ge3$. Setting equal: $12t = 3(t^2 - 6t + 9)$, i.e. $t^2 - 10t + 9 = 0$, so $t = 1$ or $9$ s. The root $t = 1$ s is before the police car starts (at $t = 3$ s), so $t = 9$ s.`, trap: 'The smaller root is not valid because the police car has not yet started.' },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'relative motion', group: 'p4',
    q: 'Find the greatest distance by which the speeder is ahead of the police car, in m.', answer: 48, tol: 0, calc: () => 12 * 5 - 3 * 4,
    sol: r`The gap is largest when the two speeds are equal: $6(t-3) = 12$, so $t = 5$ s. Gap $= 12\times5 - 3(5-3)^2 = 60 - 12 = 48$ m.` },
  { id: nid(), type: 'mcq', level: 5, format: 'passage', exams: EX[5], sub: 'relative motion', group: 'p4', answer: 2,
    q: 'What is the speed of the police car at the instant it catches the speeder?',
    options: [r`$12\ \mathrm{m\,s^{-1}}$`, r`$24\ \mathrm{m\,s^{-1}}$`, r`$36\ \mathrm{m\,s^{-1}}$`, r`$54\ \mathrm{m\,s^{-1}}$`],
    sol: r`The police car has been accelerating for $9 - 3 = 6$ s, so $v = 6\times6 = 36\ \mathrm{m\,s^{-1}}$, three times the speeder's speed. Check: the police car covers $\tfrac12\times6\times6^2 = 108$ m and the speeder $12\times9 = 108$ m.`, trap: 'The police car must be faster than the speeder at the moment it catches up.' },

  // ---------- Level 5 ----------
  msq(5, 'variable acceleration', r`A particle has $v = t^2 - 6t + 8$ (SI) for $0\le t\le5$ s. Which statements are correct?`,
    ['It is momentarily at rest at $t = 2$ s and $t = 4$ s', 'Its direction of motion reverses twice', 'Its acceleration is zero at $t = 3$ s', 'The distance travelled in 0 to 5 s equals the magnitude of the displacement'], [0, 1, 2],
    r`$v = (t-2)(t-4)$ is zero at 2 and 4 s, and it changes sign at both, so the direction reverses twice (A, B true). $a = 2t - 6 = 0$ at $t = 3$ (C true). The displacement is $x(5) = 6.67$ m but the distance is 9.33 m (D false).`),
  msq(5, 'equations of motion', r`Which of the following are correct for motion along a straight line?`,
    [r`$s_n = u + a(n-\tfrac12)$ for constant acceleration`, r`$v^2-u^2 = 2as$ holds only for constant acceleration`, r`Average velocity $=(u+v)/2$ for any motion`, r`For constant acceleration the velocity at the mid-instant equals the average velocity`], [0, 1, 3],
    r`A, B and D are standard results valid for constant $a$. The average velocity equals $(u+v)/2$ only for constant acceleration, so C is false. (For $x = t^3$ from 0 to 2 s the average velocity is 4 but $(u+v)/2 = 6$.)`),
  msq(5, 'relative motion', r`Body $A$ is thrown vertically up from the ground with speed $u$ at the instant body $B$ is dropped from rest from a height $H$ directly above it. Which statements are correct (no air)?`,
    ['They meet after a time $H/u$, whatever the value of $g$', 'The relative acceleration is zero', 'The time of meeting depends on $g$', 'They meet in the air only if $H\\le2u^2/g$'], [0, 1, 3],
    r`Both have acceleration $g$ downward, so relative to $B$, $A$ moves up uniformly at $u$ and closes the gap $H$ in $t = H/u$ (A, B true; C false). $A$ lands after $2u/g$, so the meeting is in the air only if $H/u\le2u/g$, i.e. $H\le2u^2/g$ (D true).`),
  msq(5, 'graphs', r`A particle moves as $x = 4t - t^2$ (SI) for $0\le t\le4$ s. Which statements are correct?`,
    ['Its velocity is zero at $t = 2$ s', 'It is back at the origin at $t = 4$ s', 'The distance travelled in 0 to 4 s is 8 m', 'Its acceleration is $+2\\ \\mathrm{m\\,s^{-2}}$'], [0, 1, 2],
    r`$v = 4 - 2t = 0$ at $t = 2$ (A). $x(4) = 0$ (B). It goes to $x = 4$ m and returns: 8 m (C). $a = -2\ \mathrm{m\,s^{-2}}$, not $+2$ (D false).`),
  msq(5, 'sign conventions', r`A ball is thrown up and returns to the point of projection. Take the upward direction as positive. Which statements are correct?`,
    [r`The acceleration is $-g$ throughout the flight`, r`The velocity is negative on the way down`, r`The displacement from the starting point is positive while the ball is above it`, r`The speed is negative on the way down`], [0, 1, 2],
    r`Gravity always points down: $a = -g$ (A). On the way down $v<0$ (B). Above the starting level the displacement is positive (C). Speed is a magnitude and never negative (D false).`),
  msq(5, 'graphs', r`Which of these statements about graphs of motion in a straight line are correct?`,
    [r`The area under $|v|$ against $t$ gives the distance travelled`, r`The slope of a $v$–$t$ graph gives the acceleration`, r`The area under an $a$–$t$ graph gives the change in velocity`, r`The area under an $x$–$t$ graph gives the velocity`], [0, 1, 2],
    r`A, B and C are the standard relations. The slope (not the area) of an $x$–$t$ graph gives velocity (D false).`),
  nat(5, 'bouncing ball', r`A ball is dropped from 20 m and bounces repeatedly. After each bounce its speed is halved (speed just after $=\tfrac12\times$ speed just before). Taking $g = 10\ \mathrm{m\,s^{-2}}$, find the total time until it comes to rest, in s.`, 6, 0,
    r`The first fall takes $t_0 = \sqrt{2\times20/10} = 2$ s. After a bounce with speed $ev$ the flight (up and down) takes $2e\,t_0$, and the next bounce has $e^2$, and so on. Total time $= t_0 + 2t_0(e + e^2 + \dots) = t_0\left(1 + \dfrac{2e}{1-e}\right) = t_0\dfrac{1+e}{1-e} = 2\times\dfrac{1.5}{0.5} = 6$ s.`, { unit: 's', calc: () => 2 * (1.5 / 0.5), trap: 'The series for the time is geometric with ratio $e$, not $e^2$ (which is for the heights).' }),
  nat(5, 'bouncing ball', r`For the same ball dropped from 20 m (speed halved after each bounce, $g = 10\ \mathrm{m\,s^{-2}}$), find the total distance travelled until it comes to rest, in m (1 decimal).`, 33.3, 0.1,
    r`After a bounce with speed $ev$ it rises to $e^2h$. Total distance $= h + 2h(e^2 + e^4 + \dots) = h\dfrac{1+e^2}{1-e^2} = 20\times\dfrac{1.25}{0.75} = 33.3$ m.`, { unit: 'm', calc: () => 20 * 1.25 / 0.75 }),
  nat(5, 'variable acceleration', r`A particle falling through a fluid has velocity $v = 40(1 - e^{-t/4})$ (SI, $t$ in s). Find the distance fallen in the first 8 s in m (1 decimal).`, 181.7, 0.2,
    r`$x = \int_0^8 40(1-e^{-t/4})\,dt = 40\left[t + 4e^{-t/4}\right]_0^8 = 40\left[8 + 4e^{-2} - 4\right] = 40(4 + 0.5413) = 181.7$ m.`, { unit: 'm', calc: () => 40 * (8 - 4 * (1 - Math.exp(-2))) }),
  nat(5, 'variable acceleration', r`A particle has $a = -0.5v$ (SI) and starts at $v_0 = 12\ \mathrm{m\,s^{-1}}$. Find the distance it travels in the first 4 s, in m (2 decimals).`, 20.75, 0.02,
    r`$v = 12e^{-0.5t}$. $x = \int_0^4 12e^{-0.5t}dt = \dfrac{12}{0.5}(1 - e^{-2}) = 24\times0.8647 = 20.75$ m. (The total distance to rest would be $v_0/k = 24$ m.)`, { unit: 'm', calc: () => 24 * (1 - Math.exp(-2)) }),
  mat(5, 'variable acceleration', 'm8', r`Match each law of acceleration in List I with the relation it leads to in List II. (Start from rest where appropriate; $k>0$.)`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: constant $a$ from rest: $v = at$, so $v\propto t$ (p). B: $a = -kv$: $v = v_0e^{-kt}$ (q). C: $a = -kx$: $v^2 + kx^2 = $ constant (r). D: constant $a$ from rest: $v^2 = 2ax$, so $v\propto\sqrt x$ (s). So A-p, B-q, C-r, D-s.`),
  asrt(5, 'free fall', r`In a long fall from a great height without air, a body covers $\frac59$ of the total height in its last second only when it falls for 3 s.`, r`The distance in the last second of a fall of duration $T$ is $\tfrac12g(2T-1)$.`, 0,
    r`With $g = 10$: $5(2T-1) = \tfrac59\times5T^2$ gives $9(2T-1) = 5T^2$, i.e. $5T^2 - 18T + 9 = 0$, so $T = 3$ s (the other root $0.6$ s is less than 1 s and impossible). The total height $= 45$ m and the last second covers 25 m $=\tfrac59\times45$. R is the formula used. Both true and R explains A.`),
  stm(5, 'average speed', r`A car goes up a hill at $v_1$ and comes down at $v_2$ over the same road. Its average speed for the round trip is $(v_1+v_2)/2$.`, r`Average speed is the total distance divided by the total time.`, 3,
    r`II is the definition (true). For equal distances the average speed is the harmonic mean $\dfrac{2v_1v_2}{v_1+v_2}$, not the arithmetic mean, so I is false.`),
  nat(5, 'time-dependent acceleration', r`A particle starts from rest with acceleration $a = 6 - 2t$ (SI) for all $t\ge0$. Find the time at which it comes to rest again, in s.`, 6, 0,
    r`$v = 6t - t^2 = t(6-t)$, which is zero again at $t = 6$ s.`, { unit: 's', calc: () => 6 }),
];

const groups = {
  m1: { title: 'Graphs and motion',
    list1: ['A. $x$–$t$: a horizontal straight line', 'B. $x$–$t$: an inclined straight line', 'C. $v$–$t$: a straight line through the origin', 'D. $v$–$t$: a straight line of positive slope not through the origin'],
    list2: ['p. constant velocity', 'q. uniform acceleration starting from rest', 'r. body at rest', 's. uniform acceleration with non-zero initial velocity'] },
  m2: { title: 'Areas, slopes and units',
    list1: ['A. Area under a $v$–$t$ graph', 'B. Area under an $a$–$t$ graph', 'C. Slope of a $v$–$t$ graph', 'D. Slope of an $a$–$t$ graph'],
    list2: [r`p. $\mathrm{m\,s^{-2}}$`, 'q. m', r`r. $\mathrm{m\,s^{-3}}$`, r`s. $\mathrm{m\,s^{-1}}$`] },
  m3: { title: 'Vertical throw',
    list1: ['A. Maximum height', 'B. Time of flight', 'C. Speed on return to the ground', 'D. Height after 1 s'],
    list2: ['p. 4 s', 'q. 15 m', r`r. $20\ \mathrm{m\,s^{-1}}$`, 's. 20 m'] },
  p1: { title: 'A car journey',
    passage: r`<p>A car starts from rest. Its speed rises uniformly to $20\ \mathrm{m\,s^{-1}}$ in 10 s. It then moves at this constant speed for 20 s and finally slows down uniformly to rest in the last 10 s.</p>` },
  p2: { title: 'Two cars',
    passage: r`<p>Car $A$ moves along a straight road at a constant $20\ \mathrm{m\,s^{-1}}$. At $t=0$ it is 150 m behind a car $B$ that is at rest. At that instant $B$ starts moving in the same direction with a constant acceleration of $2\ \mathrm{m\,s^{-2}}$.</p>` },
  m4: { title: 'Position-time graphs',
    list1: ['A. A straight line sloping upward', 'B. A parabola opening upward', 'C. A parabola opening downward', 'D. A horizontal line'],
    list2: ['p. The body is at rest', 'q. Constant positive velocity', 'r. Constant negative acceleration', 's. Constant positive acceleration'] },
  m5: { title: 'A ball thrown upward',
    list1: ['A. Time to reach the top', 'B. Maximum height', r`C. Velocity at $t = 4$ s (up is positive)`, 'D. Speed at a height of 25 m'],
    list2: ['p. 3 s', r`q. $20\ \mathrm{m\,s^{-1}}$`, r`r. $-10\ \mathrm{m\,s^{-1}}$`, 's. 45 m'] },
  m6: { title: 'Particle momentarily at rest',
    list1: [r`A. $x = t^2 - 4t$`, r`B. $x = t^2 - 6t$`, r`C. $x = t^3 - 3t$`, r`D. $x = 2t^2 - 16t$`],
    list2: ['p. 1 s', 'q. 2 s', 'r. 3 s', 's. 4 s'] },
  m7: { title: 'Displacement from a velocity-time graph',
    list1: [r`A. Velocity rises from 0 to $10\ \mathrm{m\,s^{-1}}$ in 4 s`, r`B. Constant $5\ \mathrm{m\,s^{-1}}$ for 6 s`, r`C. Rises from 0 to $10\ \mathrm{m\,s^{-1}}$ in 2 s, then constant for 3 s`, r`D. Falls from $10\ \mathrm{m\,s^{-1}}$ to 0 in 5 s`],
    list2: ['p. 20 m', 'q. 25 m', 'r. 30 m', 's. 40 m'] },
  m8: { title: 'Laws of acceleration',
    list1: ['A. Constant acceleration from rest: speed against time', r`B. $a = -kv$: speed against time`, r`C. $a = -kx$: speed against position`, 'D. Constant acceleration from rest: speed against position'],
    list2: [r`p. $v\propto t$`, r`q. $v = v_0e^{-kt}$`, r`r. $v^2 + kx^2 = $ constant`, r`s. $v\propto\sqrt{x}$`] },
  m9: { title: 'Average and instantaneous values',
    list1: [r`A. Average velocity for $x = t^2$, from 0 to 4 s`, r`B. Instantaneous velocity at $t = 4$ s for $x = t^2$`, r`C. Average speed for $x = t^2 - 4t$, from 0 to 4 s`, r`D. Average velocity for $x = t^2 - 4t$, from 0 to 4 s`],
    list2: ['p. 0', 'q. 2', 'r. 4', 's. 8'] },
  m10: { title: 'Signs of velocity and acceleration',
    list1: [r`A. $v>0,\ a>0$`, r`B. $v>0,\ a<0$`, r`C. $v<0,\ a<0$`, r`D. $v<0,\ a>0$`],
    list2: ['p. Moving forward and speeding up', 'q. Moving forward and slowing down', 'r. Moving backward and speeding up', 's. Moving backward and slowing down'] },
  m11: { title: 'A stone dropped from rest',
    list1: [r`A. Distance fallen in 3 s`, r`B. Distance fallen in the 3rd second`, r`C. Speed after 3 s`, r`D. Time to fall 80 m`],
    list2: ['p. 4 s', 'q. 25 m', r`r. $30\ \mathrm{m\,s^{-1}}$`, 's. 45 m'] },
  p3: { title: 'A velocity-time graph',
    passage: r`<p>A particle moves along a straight line. Its velocity rises uniformly from 0 to $12\ \mathrm{m\,s^{-1}}$ between $t = 0$ and $t = 3$ s. It stays at $12\ \mathrm{m\,s^{-1}}$ until $t = 5$ s. Then the velocity falls uniformly, reaching $-6\ \mathrm{m\,s^{-1}}$ at $t = 11$ s.</p>` },
  p4: { title: 'A police chase',
    passage: r`<p>A car passes a stationary police car at a steady $12\ \mathrm{m\,s^{-1}}$. The police car starts to move 3 s later with a uniform acceleration of $6\ \mathrm{m\,s^{-2}}$ in the same direction, and keeps accelerating.</p>` },
};

// ---------- Number templates ----------
const gens = [
  { id: 'msl-g01', type: 'nat', level: 1, exams: EX[1], sub: 'equations of motion',
    make(rng) {
      const u = int(rng, 0, 10), a = int(rng, 1, 5), t = int(rng, 2, 10);
      const v = u + a * t;
      return { u, a, t, answer: v, tol: 0, unit: 'm/s',
        q: `A body has an initial velocity of ${u} m/s and a constant acceleration of ${a} m/s². Find its velocity after ${t} s, in m/s.`,
        sol: `v = u + at = ${u} + ${a}×${t} = ${v} m/s.` };
    },
    verify: (p) => p.u + p.a * p.t },
  { id: 'msl-g02', type: 'nat', level: 2, exams: EX[2], sub: 'stopping distance',
    make(rng) {
      const kmh = choose(rng, [36, 54, 72, 90, 108]), a = choose(rng, [2, 4, 5, 6, 8]);
      const u = kmh / 3.6, answer = +(u * u / (2 * a)).toFixed(3);
      return { kmh, a, u, answer, tol: Math.max(0.05, answer * 0.01), unit: 'm',
        q: `A car moving at ${kmh} km/h is braked with a constant retardation of ${a} m/s². Find the stopping distance in m.`,
        sol: `u = ${kmh}×5/18 = ${fmt(u, 4)} m/s. Using v² = u² − 2as with v = 0: s = u²/(2a) = ${fmt(u * u, 5)}/${2 * a} = ${fmt(answer, 4)} m.` };
    },
    verify: (p) => { const t = p.u / p.a; return p.u * t - 0.5 * p.a * t * t; } },
  { id: 'msl-g03', type: 'nat', level: 2, exams: EX[2], sub: 'nth second',
    make(rng) {
      const u = int(rng, 0, 12), a = int(rng, 1, 6) * 2, n = int(rng, 3, 10);
      const answer = u + a * (2 * n - 1) / 2;
      return { u, a, n, answer, tol: 0, unit: 'm',
        q: `A body has u = ${u} m/s and a uniform acceleration ${a} m/s². How far does it travel in the ${n}th second, in m?`,
        sol: `Distance in the nth second = u + (a/2)(2n − 1) = ${u} + ${a / 2}×${2 * n - 1} = ${answer} m. (Check: s(${n}) − s(${n - 1}).)` };
    },
    verify: (p) => (p.u * p.n + 0.5 * p.a * p.n ** 2) - (p.u * (p.n - 1) + 0.5 * p.a * (p.n - 1) ** 2) },
  { id: 'msl-g04', type: 'nat', level: 2, exams: EX[2], sub: 'free fall',
    make(rng) {
      const t = int(rng, 1, 5), ask = choose(rng, ['speed', 'height']);
      const H = 4.9 * t * t;
      const answer = ask === 'speed' ? +(9.8 * t).toFixed(2) : +H.toFixed(2);
      return { t, H, ask, answer, tol: 0.05, unit: ask === 'speed' ? 'm/s' : 'm',
        q: ask === 'speed' ? `A stone is dropped from a tower ${fmt(H, 4)} m high. Taking g = 9.8 m/s², find the speed with which it hits the ground, in m/s.`
          : `A stone is dropped and takes ${t} s to reach the ground. Taking g = 9.8 m/s², find the height of release, in m.`,
        sol: ask === 'speed' ? `Time: ${fmt(H, 4)} = ½×9.8×t², so t = ${t} s. Speed v = gt = 9.8×${t} = ${fmt(answer, 4)} m/s. (Or v = √(2gh).)` : `h = ½gt² = ½×9.8×${t}² = ${fmt(answer, 4)} m.` };
    },
    verify: (p) => p.ask === 'speed' ? Math.sqrt(2 * 9.8 * p.H) : 0.5 * 9.8 * p.t * p.t },
  { id: 'msl-g05', type: 'nat', level: 2, exams: EX[2], sub: 'vertical throw',
    make(rng) {
      const u = choose(rng, [10, 15, 20, 25, 30, 40]), ask = choose(rng, ['height', 'time']);
      const answer = ask === 'height' ? u * u / 20 : u / 5;
      return { u, ask, answer, tol: 0.01, unit: ask === 'height' ? 'm' : 's',
        q: `A ball is thrown vertically up at ${u} m/s. Take g = 10 m/s². Find the ${ask === 'height' ? 'maximum height reached (m)' : 'total time of flight until it returns to the thrower’s hand (s)'}.`,
        sol: ask === 'height' ? `At the top v = 0, so H = u²/(2g) = ${u * u}/20 = ${answer} m.` : `Time up = u/g = ${u / 10} s, and the time down is the same, so total = 2u/g = ${answer} s.` };
    },
    verify: (p) => p.ask === 'height' ? 0.5 * 10 * (p.u / 10) ** 2 : 2 * p.u / 10 },
  { id: 'msl-g06', type: 'nat', level: 2, exams: EX[2], sub: 'average speed',
    make(rng) {
      const [v1, v2] = choose(rng, [[30, 60], [40, 60], [20, 30], [60, 90], [30, 45], [20, 60], [40, 120]]);
      const answer = 2 * v1 * v2 / (v1 + v2);
      return { v1, v2, answer, tol: 0.01, unit: 'km/h',
        q: `A vehicle covers the first half of a journey (by distance) at ${v1} km/h and the second half at ${v2} km/h. Find its average speed in km/h.`,
        sol: `For equal distances d: time = d/${v1} + d/${v2}. Average speed = 2d / (d/${v1} + d/${v2}) = 2×${v1}×${v2}/(${v1}+${v2}) = ${fmt(answer, 4)} km/h.` };
    },
    verify: (p) => 2 / (1 / p.v1 + 1 / p.v2) },
  { id: 'msl-g07', type: 'mcq', level: 2, exams: EX[2], sub: 'average speed',
    make(rng) {
      const v1 = pick(rng, 20, 60, 10), v2 = v1 + pick(rng, 10, 40, 10);
      const A = (v1 + v2) / 2, H = 2 * v1 * v2 / (v1 + v2);
      const cand = [H, v1 + v2, Math.sqrt(v1 * v2), v2 - v1, A * 1.1];
      const ws = []; for (const w of cand) if (Math.abs(w - A) > 0.02 * A && ws.every((x) => Math.abs(x - w) > 0.02 * w)) ws.push(w);
      const o = numOpts(rng, A, ws.slice(0, 3), 'km/h', 4);
      return { v1, v2, A, options: o.options, answer: o.answer,
        q: `A car moves for the first half of the <i>time</i> at ${v1} km/h and the second half at ${v2} km/h. Its average speed is`,
        sol: `Each half has time T. Distance = ${v1}T + ${v2}T, total time = 2T. Average = (${v1}+${v2})/2 = ${fmt(A, 4)} km/h. (${fmt(H, 4)} km/h would be the answer for equal <i>distances</i>.)` };
    },
    verify: (p) => p.options.findIndex((o) => parseFloat(o) === (p.v1 + p.v2) / 2) },
  { id: 'msl-g08', type: 'nat', level: 3, exams: EX[3], sub: 'relative motion',
    make(rng) {
      const dv = choose(rng, [18, 36, 54]), v2 = choose(rng, [18, 36, 54]), v1 = v2 + dv;
      const L1 = choose(rng, [100, 150, 200]), L2 = choose(rng, [50, 100, 150]);
      const rel = dv / 3.6, answer = +((L1 + L2) / rel).toFixed(3);
      return { v1, v2, L1, L2, rel, answer, tol: 0.05, unit: 's',
        q: `A train ${L1} m long moving at ${v1} km/h overtakes another train ${L2} m long moving in the same direction at ${v2} km/h. How long does the overtaking take (from the front of the faster train meeting the rear of the slower one until the rear of the faster one clears the front of the slower), in s?`,
        sol: `Relative speed = ${v1} − ${v2} = ${dv} km/h = ${fmt(rel, 3)} m/s. Relative distance = ${L1} + ${L2} = ${L1 + L2} m. Time = ${L1 + L2}/${fmt(rel, 3)} = ${fmt(answer, 4)} s.` };
    },
    verify: (p) => (p.L1 + p.L2) / ((p.v1 - p.v2) * 5 / 18) },
  { id: 'msl-g09', type: 'nat', level: 3, exams: EX[3], sub: 'relative motion',
    make(rng) {
      const a = choose(rng, [1, 2, 4]), t = int(rng, 4, 14), v = choose(rng, [2, 4, 6]);
      const d = 0.5 * a * t * t - v * t;
      if (d <= 0) return gens[8].make(rng);
      return { a, t, v, d, answer: t, tol: 0, unit: 's',
        q: `Car B moves at a constant ${v} m/s and is ${d} m ahead of car A. Car A starts from rest at that instant with acceleration ${a} m/s² in the same direction. After how many seconds does A overtake B?`,
        sol: `A meets B when ½×${a}×t² = ${v}t + ${d}, i.e. t² − ${2 * v / a}t − ${2 * d / a} = 0. The positive root is t = ${t} s.` };
    },
    verify: (p) => (p.v + Math.sqrt(p.v * p.v + 2 * p.a * p.d)) / p.a },
  { id: 'msl-g10', type: 'nat', level: 3, exams: EX[3], sub: 'area under graph',
    make(rng) {
      const V = choose(rng, [10, 12, 15, 20, 24]), t1 = int(rng, 2, 8), t2 = int(rng, 3, 12), t3 = int(rng, 2, 8);
      const dist = 0.5 * V * t1 + V * t2 + 0.5 * V * t3, T = t1 + t2 + t3;
      const ask = choose(rng, ['distance', 'average speed']);
      const answer = ask === 'distance' ? dist : +(dist / T).toFixed(3);
      return { V, t1, t2, t3, ask, answer, tol: ask === 'distance' ? 0 : 0.01, unit: ask === 'distance' ? 'm' : 'm/s',
        q: `A train accelerates uniformly from rest to ${V} m/s in ${t1} s, moves at this speed for ${t2} s, and then stops uniformly in ${t3} s. Find the total ${ask === 'distance' ? 'distance travelled (m)' : 'average speed over the whole journey (m/s)'}.`,
        sol: `Areas under the v–t graph: ½×${t1}×${V} = ${0.5 * V * t1}; ${V}×${t2} = ${V * t2}; ½×${t3}×${V} = ${0.5 * V * t3}. Distance = ${dist} m${ask === 'distance' ? '.' : `. Average speed = ${dist}/${T} = ${fmt(answer, 4)} m/s.`}` };
    },
    verify: (p) => { const d = p.V * (p.t1 + 2 * p.t2 + p.t3) / 2; return p.ask === 'distance' ? d : d / (p.t1 + p.t2 + p.t3); } },
  { id: 'msl-g11', type: 'nat', level: 3, exams: EX[3], sub: 'two-stage motion',
    make(rng) {
      const [a1, a2] = choose(rng, [[2, 3], [2, 4], [3, 6], [1, 4], [4, 6], [2, 6]]);
      const m = int(rng, 2, 5), T = (a1 + a2) * m;
      const v = T * a1 * a2 / (a1 + a2), dist = v * T / 2;
      return { a1, a2, T, v, dist, answer: v, tol: 0.01, unit: 'm/s',
        q: `A car starts from rest, accelerates at ${a1} m/s² and then brakes at ${a2} m/s² to stop. The whole journey takes ${T} s. Find the maximum speed in m/s.`,
        sol: `Let the top speed be v. Time up = v/${a1}, time down = v/${a2}. So v(1/${a1} + 1/${a2}) = ${T}, giving v = ${T}×${a1}×${a2}/(${a1}+${a2}) = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => { const v = p.dist * 2 / p.T; return v; } },
  { id: 'msl-g12', type: 'nat', level: 3, exams: EX[3], sub: 'variable acceleration',
    make(rng) {
      const A = int(rng, 1, 4), B = int(rng, -6, 6), C = int(rng, 0, 10), t = int(rng, 1, 4);
      const ask = choose(rng, ['v', 'a']);
      const answer = ask === 'v' ? 3 * A * t * t + 2 * B * t + C : 6 * A * t + 2 * B;
      const poly = `${A}t³ ${B < 0 ? '−' : '+'} ${Math.abs(B)}t² + ${C}t`;
      return { A, B, C, t, ask, answer, tol: 0, unit: ask === 'v' ? 'm/s' : 'm/s²',
        q: `The position of a particle is x = ${poly} (SI units). Find its ${ask === 'v' ? 'velocity (m/s)' : 'acceleration (m/s²)'} at t = ${t} s.`,
        sol: `v = dx/dt = ${3 * A}t² ${2 * B < 0 ? '−' : '+'} ${Math.abs(2 * B)}t + ${C}; a = dv/dt = ${6 * A}t ${2 * B < 0 ? '−' : '+'} ${Math.abs(2 * B)}. At t = ${t}: ${ask === 'v' ? 'v' : 'a'} = ${answer}.` };
    },
    verify: (p) => { const h = 1e-4; const x = (t) => p.A * t ** 3 + p.B * t ** 2 + p.C * t; const v = (t) => (x(t + h) - x(t - h)) / (2 * h);
      return Math.round(p.ask === 'v' ? v(p.t) : (v(p.t + h) - v(p.t - h)) / (2 * h)); } },
  { id: 'msl-g13', type: 'nat', level: 3, exams: EX[3], sub: 'relative motion',
    make(rng) {
      const u = choose(rng, [20, 30, 40]), t = int(rng, 1, 3), H = u * t;
      const ask = choose(rng, ['time', 'height']);
      const hB = u * t - 5 * t * t;
      const answer = ask === 'time' ? t : hB;
      return { u, t, H, ask, answer, tol: 0, unit: ask === 'time' ? 's' : 'm',
        q: `Ball A is dropped from a height of ${H} m. At the same instant ball B is thrown up from the ground at ${u} m/s along the same vertical line (g = 10 m/s²). Find the ${ask === 'time' ? 'time (s) after which they meet' : 'height above the ground (m) at which they meet'}.`,
        sol: `Both have the same acceleration, so the relative speed is constant at ${u} m/s and they meet after ${H}/${u} = ${t} s.${ask === 'height' ? ` Height of B then = ${u}×${t} − 5×${t}² = ${hB} m.` : ''}` };
    },
    verify: (p) => p.ask === 'time' ? p.H / p.u : p.H - 5 * (p.H / p.u) ** 2 },
  { id: 'msl-g14', type: 'nat', level: 4, exams: EX[4], sub: 'vertical throw',
    make(rng) {
      let u, s;
      for (let i = 0; i < 100; i++) {
        u = choose(rng, [20, 30, 40, 50]); s = choose(rng, [10, 20, 30, 40].filter((x) => x < u));
        if ((u * u - s * s) % 20 === 0) break;
      }
      if ((u * u - s * s) % 20 !== 0) { u = 20; s = 10; }
      const h = (u * u - s * s) / 20;
      const answer = s / 5;
      return { u, s, h, answer, tol: 0.01, unit: 's',
        q: `A ball is thrown up from the ground at ${u} m/s (g = 10 m/s²). It passes a point ${h} m above the ground twice. Find the time between the two passages, in s.`,
        sol: `${h} = ${u}t − 5t² gives 5t² − ${u}t + ${h} = 0. The roots differ by √(${u}² − 20×${h})/5 = √${u * u - 20 * h}/5 = ${fmt(answer, 4)} s.` };
    },
    verify: (p) => { const D = p.u * p.u - 20 * p.h; const t1 = (p.u - Math.sqrt(D)) / 10, t2 = (p.u + Math.sqrt(D)) / 10; return t2 - t1; } },
  { id: 'msl-g15', type: 'nat', level: 4, exams: EX[4], sub: 'mixed',
    make(rng) {
      const h = pick(rng, 0.8, 2, 0.2), dh = 0.01, t = pick(rng, 0.4, 0.7, 0.05), dt = choose(rng, [0.005, 0.01]);
      const answer = 100 * (dh / h + 2 * dt / t);
      return { h, dh, t, dt, answer, tol: 0.05, unit: '%',
        q: `To find g, a ball is dropped from h = ${fmt(h, 3)} ± ${dh} m and the fall time is t = ${fmt(t, 3)} ± ${dt} s. Using g = 2h/t², find the percentage error in g.`,
        sol: `Relative error in g = Δh/h + 2Δt/t = ${dh}/${fmt(h, 3)} + 2×${dt}/${fmt(t, 3)} = ${fmt(answer / 100, 4)}. As a percentage that is ${fmt(answer, 3)}%.` };
    },
    verify: (p) => 100 * p.dh / p.h + 200 * p.dt / p.t },
  { id: 'msl-g16', type: 'nat', level: 3, exams: EX[3], sub: 'variable acceleration',
    make(rng) {
      const kk = choose(rng, [6, 12, 18, 24]), t = int(rng, 1, 4);
      const answer = kk * t ** 3 / 6;
      return { kk, t, answer, tol: 0, unit: 'm',
        q: `A particle starts from the origin at rest with acceleration a = ${kk}t (SI). Find its position at t = ${t} s, in m.`,
        sol: `v = ∫${kk}t dt = ${kk / 2}t². x = ∫${kk / 2}t² dt = ${kk / 6}t³. At t = ${t}: x = ${kk / 6}×${t ** 3} = ${answer} m.` };
    },
    verify: (p) => { let x = 0, v = 0; const n = 20000, dt = p.t / n; for (let i = 0; i < n; i++) { const tt = (i + 0.5) * dt; v += p.kk * tt * dt; x += v * dt; } return Math.round(x); } },
  // ---- added 2026-11-22 ----
  { id: 'msl-g17', type: 'nat', level: 4, exams: EX[4], sub: 'relative motion',
    make(rng) {
      const d = choose(rng, [2, 3, 4]), a = choose(rng, [2, 4, 5, 6]), v = choose(rng, [10, 12, 15, 20]);
      const m = d + v / a, t = m + Math.sqrt(m * m - d * d);
      return { d, a, v, answer: +t.toFixed(3), tol: Math.max(0.02, t * 0.005), unit: 's',
        q: `A speeding car passes a stationary police car at a steady ${v} m/s. The police car starts ${d} s later and accelerates uniformly at ${a} m/s². How long after the speeder passes it (in s, 2 decimals) does the police car catch up? (It keeps accelerating.)`,
        sol: `Speeder: $x = ${v}t$. Police: $x = \\tfrac12(${a})(t-${d})^2$ for $t>${d}$. Equal: $t^2 - ${fmt(2 * m, 4)}t + ${d * d} = 0$. The roots are $t = ${fmt(m, 4)}\\pm\\sqrt{${fmt(m * m, 5)}-${d * d}}$, and only the larger one is after the police car starts: $t = ${fmt(t, 4)}$ s.`,
        trap: 'The smaller root comes before the police car has started.' };
    },
    verify: (p) => { let lo = p.d, hi = 200; const f = (t) => 0.5 * p.a * (t - p.d) ** 2 - p.v * t; const mid0 = p.d + p.v / p.a; lo = mid0; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; } return (lo + hi) / 2; } },
  { id: 'msl-g18', type: 'nat', level: 5, exams: EX[5], sub: 'bouncing ball',
    make(rng) {
      const t0 = choose(rng, [1, 2, 3, 4]), e = choose(rng, [0.4, 0.5, 0.6, 0.8]), h = 5 * t0 * t0;
      const T = t0 * (1 + e) / (1 - e);
      return { t0, e, h, answer: +T.toFixed(3), tol: Math.max(0.02, T * 0.005), unit: 's',
        q: `A ball is dropped from ${h} m. After every bounce its speed becomes ${e} times its speed just before the bounce. Take $g = 10\\ \\mathrm{m\\,s^{-2}}$. Find the total time until it stops bouncing (in s, 2 decimals).`,
        sol: `First fall: $t_0 = \\sqrt{2h/g} = ${t0}$ s. After the $n$th bounce the flight (up and down) lasts $2e^n t_0$. Total $= t_0 + 2t_0(e + e^2 + \\dots) = t_0\\dfrac{1+e}{1-e} = ${t0}\\times\\dfrac{${fmt(1 + e, 3)}}{${fmt(1 - e, 3)}} = ${fmt(T, 4)}$ s.`,
        trap: 'The times form a geometric series in $e$; the heights form one in $e^2$.' };
    },
    verify: (p) => { let T = p.t0; let ft = 2 * p.t0; for (let i = 0; i < 4000; i++) { ft *= p.e; T += ft; } return T; } },
  { id: 'msl-g19', type: 'nat', level: 3, exams: EX[3], sub: 'relative motion',
    make(rng) {
      const u = choose(rng, [20, 25, 30, 40]), cap = 2 * u * u / 10, H = choose(rng, [20, 40, 60, 80, 100, 120].filter((x) => x <= cap));
      const t = H / u, y = u * t - 5 * t * t;
      return { u, H, answer: +y.toFixed(3), tol: Math.max(0.05, Math.abs(y) * 0.01), unit: 'm',
        q: `A stone is dropped from a height of ${H} m. At the same instant another stone is thrown vertically up from the ground, directly below it, at ${u} m/s. Take $g = 10\\ \\mathrm{m\\,s^{-2}}$. At what height above the ground do they meet (in m)?`,
        sol: `Both have acceleration $g$, so the relative speed is a constant $${u}$ m/s and they close the gap ${H} m in $t = ${H}/${u} = ${fmt(t, 4)}$ s. The thrown stone is then at $y = ut - \\tfrac12gt^2 = ${u}(${fmt(t, 4)}) - 5(${fmt(t, 4)})^2 = ${fmt(y, 4)}$ m.` };
    },
    verify: (p) => { const t = p.H / p.u; return p.H - 5 * t * t; } },
  { id: 'msl-g20', type: 'mcq', level: 3, exams: EX[3], sub: 'basic quantities',
    make(rng) {
      const sv = choose(rng, [1, -1]), sa = choose(rng, [1, -1]);
      const dir = sv > 0 ? 'in the +x direction' : 'in the -x direction';
      const spd = sv * sa > 0 ? 'speeding up' : 'slowing down';
      const ans = `moving ${dir} and ${spd}`;
      const all = [];
      for (const d of ['in the +x direction', 'in the -x direction']) for (const s of ['speeding up', 'slowing down']) all.push(`moving ${d} and ${s}`);
      const { options, answer } = shuffleOpts(rng, ans, all.filter((x) => x !== ans));
      return { sv, sa, options, answer,
        q: `At an instant a body has velocity ${sv > 0 ? 'positive' : 'negative'} and acceleration ${sa > 0 ? 'positive' : 'negative'} along the $x$ axis. The body is`,
        sol: `The sign of $v$ gives the direction of motion (${dir}). The speed increases when $v$ and $a$ have the same sign and decreases when the signs are opposite. Here they ${sv * sa > 0 ? 'agree' : 'differ'}, so the body is ${spd}.` };
    },
    verify: (p) => p.options.indexOf(`moving ${p.sv > 0 ? 'in the +x direction' : 'in the -x direction'} and ${p.sv * p.sa > 0 ? 'speeding up' : 'slowing down'}`) },
  { id: 'msl-g21', type: 'nat', level: 4, exams: EX[4], sub: 'rocket',
    make(rng) {
      const a = choose(rng, [10, 15, 20, 25, 30]), tb = choose(rng, [5, 8, 10, 12]);
      const H = 0.5 * a * tb * tb * (1 + a / 10);
      return { a, tb, answer: +H.toFixed(2), tol: Math.max(1, H * 0.005), unit: 'm',
        q: `A rocket rises from rest with a constant net upward acceleration of ${a} m/s² for ${tb} s, after which its engine stops and it moves freely under gravity. Take $g = 10\\ \\mathrm{m\\,s^{-2}}$. Find the maximum height it reaches in m.`,
        sol: `Burn: $v = ${a}\\times${tb} = ${a * tb}$ m/s and $h_1 = \\tfrac12(${a})(${tb})^2 = ${fmt(0.5 * a * tb * tb, 5)}$ m. Coast: $h_2 = v^2/2g = ${fmt((a * tb) ** 2 / 20, 5)}$ m. Total $= ${fmt(H, 5)}$ m.`,
        trap: 'The rocket keeps rising after the engine stops.' };
    },
    verify: (p) => { const v = p.a * p.tb; return 0.5 * v * p.tb + v * v / 20; } },
  { id: 'msl-g22', type: 'nat', level: 4, exams: EX[4], sub: 'sound and free fall',
    make(rng) {
      const t1 = choose(rng, [2, 3, 4, 5]), vs = choose(rng, [300, 330, 340]);
      const T = +(t1 + 5 * t1 * t1 / vs).toFixed(3);
      const t = (-1 + Math.sqrt(1 + 20 * T / vs)) / (10 / vs), h = 5 * t * t;
      return { t1, vs, T, answer: +h.toFixed(2), tol: Math.max(0.2, h * 0.01), unit: 'm',
        q: `A stone is dropped into a well and the sound of the splash is heard ${T} s later. Take $g = 10\\ \\mathrm{m\\,s^{-2}}$ and the speed of sound ${vs} m/s. Find the depth of the well in m (nearest 0.1 m).`,
        sol: `Let the fall take $t$. Depth $h = 5t^2$ and the sound takes $h/${vs}$. $t + 5t^2/${vs} = ${T}$. Solving, $t = ${fmt(t, 4)}$ s and $h = 5t^2 = ${fmt(h, 4)}$ m.`,
        trap: 'The time includes the sound travelling up, so $h\\ne\\tfrac12gT^2$.' };
    },
    verify: (p) => { let lo = 0, hi = 10; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (m + 5 * m * m / p.vs > p.T) hi = m; else lo = m; } return 5 * ((lo + hi) / 2) ** 2; } },
  { id: 'msl-g23', type: 'nat', level: 3, exams: EX[3], sub: 'area under graph',
    make(rng) {
      const v = choose(rng, [8, 10, 12, 15, 20]), t1 = choose(rng, [2, 4, 5]), t2 = choose(rng, [6, 8, 10]), t3 = choose(rng, [2, 3, 4]);
      const d = v * (t1 / 2 + t2 + t3 / 2);
      return { v, t1, t2, t3, answer: d, tol: Math.max(0.05, d * 0.005), unit: 'm',
        q: `A train starts from rest, speeds up uniformly to ${v} m/s in ${t1} s, runs at that speed for ${t2} s and then brakes uniformly to rest in ${t3} s. Find the total distance in m.`,
        sol: `Area of the trapezoid: $\\tfrac12(${t1})(${v}) + ${v}\\times${t2} + \\tfrac12(${t3})(${v}) = ${fmt(0.5 * t1 * v, 5)} + ${v * t2} + ${fmt(0.5 * t3 * v, 5)} = ${fmt(d, 5)}$ m.` };
    },
    verify: (p) => { const a1 = p.v / p.t1, a3 = p.v / p.t3; return 0.5 * a1 * p.t1 ** 2 + p.v * p.t2 + p.v * p.t3 - 0.5 * a3 * p.t3 ** 2; } },
  { id: 'msl-g24', type: 'nat', level: 4, exams: EX[4], sub: 'variable acceleration',
    make(rng) {
      const a = choose(rng, [1, 2]), [r1, r2] = choose(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4]]), T = r2 + 1;
      const X = (t) => a * t ** 3 - 1.5 * a * (r1 + r2) * t ** 2 + 3 * a * r1 * r2 * t;
      const dist = Math.abs(X(r1)) + Math.abs(X(r2) - X(r1)) + Math.abs(X(T) - X(r2));
      return { a, r1, r2, T, answer: +dist.toFixed(3), tol: Math.max(0.02, dist * 0.005), unit: 'm',
        q: `A particle's position is $x = ${a === 1 ? '' : a}t^3 - ${fmt(1.5 * a * (r1 + r2), 4)}t^2 + ${3 * a * r1 * r2}t$ (SI). Find the total distance it travels from $t = 0$ to $t = ${T}$ s in m.`,
        sol: `$v = ${3 * a}t^2 - ${fmt(3 * a * (r1 + r2), 4)}t + ${3 * a * r1 * r2} = ${3 * a}(t-${r1})(t-${r2})$, which is zero at $t = ${r1}$ and $t = ${r2}$ s. $x(${r1}) = ${fmt(X(r1), 5)}$, $x(${r2}) = ${fmt(X(r2), 5)}$, $x(${T}) = ${fmt(X(T), 5)}$. Distance $= ${fmt(Math.abs(X(r1)), 5)} + ${fmt(Math.abs(X(r2) - X(r1)), 5)} + ${fmt(Math.abs(X(T) - X(r2)), 5)} = ${fmt(dist, 5)}$ m.`,
        trap: 'Add the three pieces separately: the direction reverses at each zero of $v$.' };
    },
    verify: (p) => { const v = (t) => 3 * p.a * (t - p.r1) * (t - p.r2); let s = 0; const n = 20000, h = p.T / n; for (let i = 0; i < n; i++) s += Math.abs(v((i + 0.5) * h)) * h; return s; } },
  { id: 'msl-g25', type: 'nat', level: 4, exams: EX[4], sub: 'equal intervals',
    make(rng) {
      const t1 = choose(rng, [3, 4, 5]), n = choose(rng, [3, 4, 5, 6]);
      const tn = t1 * (Math.sqrt(n) - Math.sqrt(n - 1));
      return { t1, n, answer: +tn.toFixed(3), tol: 0.02, unit: 's',
        q: `A train starts from rest with uniform acceleration. The first carriage takes ${t1} s to pass a signal post (the engine's front is at the post at $t = 0$). All carriages are equal. Find the time the carriage number ${n} alone takes to pass the post, in s (2 decimals).`,
        sol: `Distance $= m L = \\tfrac12at^2$ for the first $m$ carriages, so $t\\propto\\sqrt m$ and the first $m$ carriages take $${t1}\\sqrt m$ s. Carriage ${n} alone: $${t1}(\\sqrt{${n}} - \\sqrt{${n - 1}}) = ${fmt(tn, 4)}$ s.`,
        trap: 'It is the difference of two times, not the total time divided by $n$.' };
    },
    verify: (p) => { const a = 2 / (p.t1 * p.t1); const tm = (m) => Math.sqrt(2 * m / a); return tm(p.n) - tm(p.n - 1); } },
  { id: 'msl-g26', type: 'mcq', level: 3, exams: EX[3], sub: 'graphs',
    make(rng) {
      const cases = [
        ['the area under an acceleration–time graph', 'the change in velocity'], ['the slope of a velocity–time graph', 'the acceleration'], ['the slope of a position–time graph', 'the velocity'],
        ['the area under a velocity–time graph', 'the displacement'], ['the area under a speed–time graph', 'the distance travelled'], ['the slope of an acceleration–time graph', 'the jerk (rate of change of acceleration)'] ];
      const i = int(rng, 0, cases.length - 1);
      const pool = cases.map((c) => c[1]).filter((x) => x !== cases[i][1]);
      const { options, answer } = shuffleOpts(rng, cases[i][1], pool.slice(0, 3));
      return { i, options, answer, q: `In motion along a straight line, ${cases[i][0]} gives`,
        sol: `${cases[i][0].charAt(0).toUpperCase() + cases[i][0].slice(1)} represents ${cases[i][1]}. The other options are quantities given by other graphs: slopes go one step "down" the chain position, velocity, acceleration, jerk, and areas go one step "up".`, trap: 'Slope differentiates, area integrates.' };
    },
    verify: (p) => p.options.indexOf(['the change in velocity', 'the acceleration', 'the velocity', 'the displacement', 'the distance travelled', 'the jerk (rate of change of acceleration)'][p.i]) },
  { id: 'msl-g27', type: 'nat', level: 4, exams: EX[4], sub: 'variable acceleration',
    make(rng) {
      const A = choose(rng, [16, 25, 36, 64, 100]), B = choose(rng, [2, 4, 5, 8]);
      const t = 2 * Math.sqrt(A) / B;
      return { A, B, answer: +t.toFixed(3), tol: Math.max(0.01, t * 0.005), unit: 's',
        q: `A particle moves along a line with $v^2 = ${A} - ${B}x$ (SI), starting at $x = 0$ with $v>0$. Find the time it takes to come to rest, in s (2 decimals).`,
        sol: `Differentiate: $2v\\,dv/dt = -${B}\\,dx/dt = -${B}v$, so $a = -${fmt(B / 2, 3)}\\ \\mathrm{m\\,s^{-2}}$ (constant). Initial speed $u = \\sqrt{${A}} = ${fmt(Math.sqrt(A), 4)}$ m/s. Time to stop $= u/|a| = ${fmt(Math.sqrt(A), 4)}/${fmt(B / 2, 3)} = ${fmt(t, 4)}$ s.`,
        trap: 'A relation $v^2 = A - Bx$ means constant acceleration $-B/2$.' };
    },
    verify: (p) => { const stop = p.A / p.B, u = Math.sqrt(p.A); return stop / (u / 2); } },
];


// ---------- Level 5 round (v5): top-rank additions ----------
const v5 = (id, type, format, sub, o) => ({ id, type, level: 5, format, exams: ['jee-adv'], sub, ...o });
Object.assign(groups, {
  v5m1: { title: 'Distance, not displacement',
    list1: [r`A. $v = 8 - 4t$`, r`B. $v = 2t - 4$`, r`C. $v = 6 - 3t$`, r`D. $v = 3t^2 - 12$`],
    list2: ['p. 8 m', 'q. 12 m', 'r. 16 m', 's. 48 m'] },
  v5m2: { title: 'Scaling of braking distance',
    list1: ['A. Initial speed doubled, same deceleration', 'B. Initial speed doubled and deceleration doubled', 'C. Same speed, deceleration doubled', 'D. Initial speed tripled and deceleration tripled'],
    list2: ['p. $\\tfrac12$ times', 'q. 2 times', 'r. 3 times', 's. 4 times'] },
  v5p1: { title: 'A cubic position function',
    passage: r`<p>A particle moves along the $x$-axis with $x = 2t^3 - 18t^2 + 54t - 20$ (SI units).</p>` },
});
items.push(
  v5('msl-v501', 'msq', 'multi', 'relative motion', {
    q: r`Ball $A$ is thrown vertically upward from the ground at $20\ \mathrm{m\,s^{-1}}$ at $t = 0$. Ball $B$ is thrown vertically upward from the same point with the same speed at $t = 2$ s. Take $g = 10\ \mathrm{m\,s^{-2}}$ and ignore air. Which statements are correct?`,
    options: ['They meet at $t = 3$ s', 'When they meet, $A$ is moving down and $B$ is moving up', 'They meet at a height of $20$ m', r`While both are in the air, the velocity of $B$ relative to $A$ is constant at $20\ \mathrm{m\,s^{-1}}$ upward`], answer: [0, 1, 3],
    sol: r`Equal heights: $20t - 5t^2 = 20(t-2) - 5(t-2)^2$. The right side is $40t - 5t^2 - 60$, so $20t = 40t - 60$ and $t = 3$ s (A true). The height is $60 - 45 = 15$ m (C false: $20$ m is the top of $A$'s path, reached at $t = 2$ s). Velocities at $t = 3$: $v_A = 20 - 30 = -10$ (down) and $v_B = 20 - 10 = +10$ (up) (B true). Relative velocity $v_B - v_A = [20 - 10(t-2)] - [20 - 10t] = 20\ \mathrm{m\,s^{-1}}$, constant because both have the same acceleration (D true; $A$ lands at $t = 4$ s).`,
    trap: 'The maximum height of one ball is not the meeting height.' }),
  v5('msl-v502', 'msq', 'multi', 'acceleration-time graph', {
    q: r`A particle starts from rest. Its acceleration is $+2\ \mathrm{m\,s^{-2}}$ from $t = 0$ to $3$ s, zero from $3$ to $5$ s, $-3\ \mathrm{m\,s^{-2}}$ from $5$ to $7$ s, and zero after that. Which statements are correct?`,
    options: [r`The greatest speed is $6\ \mathrm{m\,s^{-1}}$`, 'The particle comes to rest at $t = 7$ s and stays at rest', 'The total distance travelled is $27$ m', r`The average velocity over $0$ to $7$ s is $4\ \mathrm{m\,s^{-1}}$`], answer: [0, 1, 2],
    sol: r`Speed at $3$ s: $2\times3 = 6$; unchanged to $5$ s; then $6 - 3\times2 = 0$ at $7$ s (A, B true), and zero acceleration afterwards keeps it at rest. Distances: $0$-$3$ s: $\tfrac12\cdot2\cdot9 = 9$ m; $3$-$5$ s: $6\times2 = 12$ m; $5$-$7$ s: $6\times2 - \tfrac12\cdot3\cdot4 = 6$ m. Total $27$ m (C true). Average velocity $= 27/7 = 3.86\ \mathrm{m\,s^{-1}}$, not $4$ (D false).`,
    trap: 'The area under the velocity-time graph divided by $7$ s is $3.86$, not the "nice" $4$.' }),
  v5('msl-v503', 'msq', 'multi', 'variable acceleration', {
    q: r`A particle starts at $x = 0$ with velocity $v_0>0$ and moves so that $v = v_0 - \alpha x$ with $\alpha>0$. Which statements are correct?`,
    options: [r`Its acceleration is $a = -\alpha v$`, r`It never goes beyond $x = v_0/\alpha$`, r`It reaches $x = v_0/\alpha$ in a finite time`, r`When $x = v_0/(2\alpha)$ its speed is $v_0/\sqrt2$`], answer: [0, 1],
    sol: r`$a = v\,dv/dx = v(-\alpha) = -\alpha v$ (A true). Solving $dx/dt = v_0 - \alpha x$ gives $x = \dfrac{v_0}{\alpha}(1 - e^{-\alpha t})$, which approaches $v_0/\alpha$ but never reaches it, so B is true and C is false (the time is infinite). At $x = v_0/(2\alpha)$: $v = v_0 - v_0/2 = v_0/2$, not $v_0/\sqrt2$ (D false; $v_0/\sqrt2$ would belong to $v^2 = v_0^2 - \ldots$).`,
    trap: 'A speed that falls linearly with distance gives an exponential decay in time, so the stopping point is approached but never reached.' }),
  v5('msl-v504', 'nat', 'integer', 'relative motion', {
    q: r`Car $A$ moves at $30\ \mathrm{m\,s^{-1}}$ directly behind car $B$, which moves at $10\ \mathrm{m\,s^{-1}}$. At $t = 0$ the driver of $B$ brakes at $2\ \mathrm{m\,s^{-2}}$ until $B$ stops. The driver of $A$ reacts after $0.5$ s and then brakes at $6\ \mathrm{m\,s^{-2}}$ until $A$ stops. Find the smallest initial gap (in m) for which they do not collide.`,
    answer: 65, tol: 0, unit: 'm', calc: () => (30 * 0.5 + 30 ** 2 / (2 * 6)) - 10 ** 2 / (2 * 2),
    sol: r`Car $B$ stops at $t = 10/2 = 5$ s after $10^2/(2\times2) = 25$ m. For $A$: speed $v_A = 30 - 6(t - 0.5) = 33 - 6t$. Speeds would be equal at $33 - 6t = 10 - 2t$, i.e. $t = 5.75$ s, which is after $B$ has stopped, so that condition is not usable. At $t = 5$ s, $v_A = 3\ \mathrm{m\,s^{-1}} > 0$: $A$ still closes in on the stopped $B$ until it stops itself. $A$ travels $30\times0.5 + 30^2/(2\times6) = 15 + 75 = 90$ m. The gap needed is $90 - 25 = 65$ m.`,
    trap: 'Setting the speeds equal assumes B is still moving; B stops first, so compare the final stopping positions.' }),
  v5('msl-v505', 'nat', 'integer', 'free fall', {
    q: r`A balloon rises at a constant $10\ \mathrm{m\,s^{-1}}$. When it is $75$ m above the ground a stone is released from it. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find the distance between the balloon and the stone at the instant the stone hits the ground, in m.`,
    answer: 125, tol: 0, unit: 'm', calc: () => 75 + 10 * 5,
    sol: r`The stone starts with $10\ \mathrm{m\,s^{-1}}$ upward. Height $y = 75 + 10t - 5t^2 = 0$ gives $t^2 - 2t - 15 = 0$, so $t = 5$ s. In that time the balloon rises $10\times5 = 50$ m to $125$ m above the ground. The stone is on the ground, so the separation is $125$ m.`,
    trap: 'The stone is not "dropped from rest": it leaves with the balloon\'s upward velocity.' }),
  v5('msl-v506', 'nat', 'integer', 'two-stage motion', {
    q: r`A train must go between two stations $1050$ m apart. It can accelerate at $2\ \mathrm{m\,s^{-2}}$ and brake at $4\ \mathrm{m\,s^{-2}}$, and may not exceed $20\ \mathrm{m\,s^{-1}}$. Find the shortest possible time in s.`,
    answer: 60, tol: 0, unit: 's', calc: () => 20 / 2 + 20 / 4 + (1050 - 20 ** 2 / 4 - 20 ** 2 / 8) / 20,
    sol: r`Without the limit the peak speed would satisfy $v^2/4 + v^2/8 = 1050$, $v = 52.9\ \mathrm{m\,s^{-1}}$, which is above the limit. So the train accelerates to $20$, cruises, then brakes. Acceleration: $20/2 = 10$ s and $20^2/(2\times2) = 100$ m. Braking: $20/4 = 5$ s and $20^2/(2\times4) = 50$ m. Cruise distance $= 1050 - 150 = 900$ m, taking $900/20 = 45$ s. Total $= 10 + 45 + 5 = 60$ s.`,
    trap: 'Check first whether the speed limit is reached at all.' }),
  v5('msl-v507', 'nat', 'numeric', 'variable acceleration', {
    q: r`A particle on the $x$-axis has acceleration $a = 6t - 12$ (SI). At $t = 0$ it is at the origin with velocity $+9\ \mathrm{m\,s^{-1}}$. Find the <b>distance</b> it travels in the first $2.5$ s, in m (3 decimals).`,
    answer: 7.375, tol: 0.005, unit: 'm', calc: () => { const x = (t) => t ** 3 - 6 * t * t + 9 * t; return (x(1) - x(0)) + (x(1) - x(2.5)); },
    sol: r`$v = 9 + 3t^2 - 12t = 3(t-1)(t-3)$ and $x = t^3 - 6t^2 + 9t$. The velocity is positive until $t = 1$ s and negative from $1$ to $3$ s, so the particle turns at $t = 1$. $x(1) = 4$ m, $x(2.5) = 15.625 - 37.5 + 22.5 = 0.625$ m. Distance $= (4 - 0) + (4 - 0.625) = 7.375$ m (the displacement is only $0.625$ m).`,
    trap: 'Splitting the path at the turning point $t = 1$ s is the whole question; integrating $v$ straight through gives the displacement.' }),
  v5('msl-v508', 'nat', 'numeric', 'relative motion', {
    q: r`A lift starts from rest and accelerates upward at $2\ \mathrm{m\,s^{-2}}$. At $t = 2$ s a bolt comes loose from the ceiling, which is $2.5$ m above the floor. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find the net displacement of the bolt, relative to the ground, from its release until it hits the floor (upward positive), in m (2 decimals).`,
    answer: 0.5, tol: 0.01, unit: 'm', calc: () => { const t = Math.sqrt(2 * 2.5 / 12); return 4 * t - 5 * t * t; },
    sol: r`At release the lift (and the bolt) move up at $2\times2 = 4\ \mathrm{m\,s^{-1}}$. Relative to the lift the bolt starts at rest and has acceleration $10 + 2 = 12\ \mathrm{m\,s^{-2}}$ downward, so $2.5 = \tfrac12(12)t^2$ and $t = \sqrt{5/12} = 0.645$ s. Relative to the ground the bolt moves with initial velocity $+4$ and acceleration $-10$: $s = 4t - 5t^2 = 2.582 - 2.083 = +0.499$ m. It actually moves slightly <i>up</i> before the floor comes to meet it.`,
    trap: 'Using $g$ alone for the fall time gives $0.707$ s; the floor rises to meet the bolt, so the relative acceleration is $g + a$.' }),
  v5('msl-v509', 'mcq', 'single', 'average speed', {
    q: r`A car travels the first half of a straight route at $30\ \mathrm{m\,s^{-1}}$. For the second half of the route it moves for equal durations at $20\ \mathrm{m\,s^{-1}}$ and at $60\ \mathrm{m\,s^{-1}}$. Its average speed for the whole route is`,
    options: [r`$35\ \mathrm{m\,s^{-1}}$`, r`$34.3\ \mathrm{m\,s^{-1}}$`, r`$36.7\ \mathrm{m\,s^{-1}}$`, r`$30\ \mathrm{m\,s^{-1}}$`], answer: 1,
    sol: r`Equal durations on the second half give an average of $(20 + 60)/2 = 40\ \mathrm{m\,s^{-1}}$ for that half. The two halves cover equal distances $d$, so the average speed is $\dfrac{2d}{d/30 + d/40} = \dfrac{2}{1/30 + 1/40} = \dfrac{2\times120}{7} = 34.3\ \mathrm{m\,s^{-1}}$. The wrong options are the arithmetic mean of 30 and 40 ($35$), the mean of the three speeds ($36.7$) and the harmonic mean of the three speeds ($30$).`,
    trap: 'Equal times use the arithmetic mean; equal distances use the harmonic mean. Here both appear.' }),
  { id: 'msl-v510', type: 'mcq', level: 5, format: 'match', exams: ['jee-adv'], sub: 'distance and displacement', group: 'v5m1',
    q: r`A particle moves on a line with each velocity $v$ (SI) in List I. Match each with the <b>distance</b> it covers from $t = 0$ to $t = 4$ s in List II.`,
    options: ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-p, D-s'], answer: 2,
    sol: r`A: $x = 8t - 2t^2$, turning at $t = 2$ ($x = 8$), back to $0$ at $t=4$: distance $8 + 8 = 16$ m (r). B: $x = t^2 - 4t$, $x(2) = -4$, $x(4) = 0$: $4 + 4 = 8$ m (p). C: $x = 6t - 1.5t^2$, $x(2) = 6$, $x(4) = 0$: $6 + 6 = 12$ m (q). D: $x = t^3 - 12t$, turning at $t = 2$ ($x = -16$), then to $x(4) = 16$: $16 + 32 = 48$ m (s), although the displacement is only $16$ m. So A-r, B-p, C-q, D-s.`,
    trap: 'D has the same displacement as the answer to A; only the distance separates them.' },
  { id: 'msl-v511', type: 'mcq', level: 5, format: 'match', exams: ['jee-adv'], sub: 'stopping distance', group: 'v5m2',
    q: r`A vehicle brakes to rest with constant deceleration. Match each change in List I with the factor by which the braking distance changes in List II.`,
    options: ['A-s, B-q, C-p, D-r', 'A-s, B-p, C-q, D-r', 'A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p'], answer: 0,
    sol: r`Braking distance $s = v^2/(2a)$. A: $v\to2v$: $4$ times (s). B: $4/2 = 2$ times (q). C: $a\to2a$: $\tfrac12$ times (p). D: $9/3 = 3$ times (r). So A-s, B-q, C-p, D-r.`,
    trap: 'Speed enters squared, deceleration only to the first power.' },
  { id: 'msl-v512', type: 'mcq', level: 5, format: 'passage', exams: ['jee-adv'], sub: 'turning points', group: 'v5p1',
    q: 'At $t = 3$ s the particle',
    options: ['reverses its direction of motion', 'is momentarily at rest and then keeps moving in the same direction', 'comes to rest and stays at rest', 'has its greatest speed'], answer: 1,
    sol: r`$v = 6t^2 - 36t + 54 = 6(t - 3)^2$, which is zero at $t = 3$ s but never negative. Also $a = 12t - 36 = 0$ there. So the particle stops for an instant (with zero acceleration, a point of inflection of $x(t)$) and then moves on in the same direction. It reverses only if $v$ changes sign.`,
    trap: '$v = 0$ does not by itself mean a turning point; the sign of $v$ must change.' },
  { id: 'msl-v513', type: 'nat', level: 5, format: 'passage', exams: ['jee-adv'], sub: 'distance travelled', group: 'v5p1',
    q: 'Find the distance travelled between $t = 0$ and $t = 6$ s, in m.',
    answer: 108, tol: 0, unit: 'm', calc: () => { const x = (t) => 2 * t ** 3 - 18 * t * t + 54 * t - 20; return x(6) - x(0); },
    sol: r`Since $v = 6(t-3)^2\ge0$, the particle never reverses, so distance equals displacement: $x(6) - x(0) = (432 - 648 + 324 - 20) - (-20) = 88 + 20 = 108$ m.` },
  { id: 'msl-v514', type: 'mcq', level: 5, format: 'assertion', exams: ['jee-adv'], sub: 'free fall',
    q: `<b>Assertion (A):</b> A ball thrown vertically upward with speed $u$ from the top of a tower and a second ball thrown vertically downward with speed $u$ from the same point reach the ground with the same speed.<br><b>Reason (R):</b> Both balls take the same time to reach the ground.`,
    options: AOPT, answer: 2,
    sol: r`A is true: the upward ball returns to the top of the tower moving down at speed $u$, after which its motion is identical to the downward ball's, so the final speeds agree (also from $v^2 = u^2 + 2gh$ for both). R is false: the upward ball spends an extra $2u/g$ in its up-and-down trip, so it takes longer.`,
    trap: 'Equal speeds do not mean equal times.' },
  { id: 'msl-v515', type: 'mcq', level: 5, format: 'statements', exams: ['jee-adv'], sub: 'average speed and velocity',
    q: `<b>Statement I:</b> If the velocity-time graph of a particle on a line is a straight segment, its average speed over that interval is always the mean of its initial and final speeds.<br><b>Statement II:</b> For motion with constant acceleration, the average velocity over an interval equals the mean of the initial and final velocities.`,
    options: SOPT, answer: 3,
    sol: r`II is true: the $v$-$t$ graph is a straight line and the displacement is the area of a trapezoid, so the average velocity is $(u+v)/2$. I is false when the velocity changes sign: if $v$ goes uniformly from $-4$ to $+4\ \mathrm{m\,s^{-1}}$ in $4$ s, the distance is $4 + 4 = 8$ m and the average speed is $2\ \mathrm{m\,s^{-1}}$, while the mean of the initial and final speeds is $4$.`,
    trap: 'The mean-of-ends rule holds for velocity, not for speed, once the sign changes.' },
);


// templates (level 5)
gens.push(
  { id: 'msl-v5g1', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'relative motion',
    make(rng) {
      const vA = choose(rng, [25, 30, 35, 40]), vB = choose(rng, [10, 15, 20]), tr = choose(rng, [0.4, 0.5, 0.6, 0.8]), a = choose(rng, [4, 5, 6]);
      const dv = vA - vB, answer = dv * tr + dv * dv / (2 * a);
      return { vA, vB, tr, a, answer: +answer.toFixed(3), tol: Math.max(0.1, answer * 0.005), unit: 'm',
        q: `Car $A$ moves at ${vA} m/s directly behind car $B$, which moves at a steady ${vB} m/s. The driver of $A$ sees a hazard, reacts after ${tr} s and then brakes at ${a} m/s$^2$ until the speeds are equal. Find the smallest initial gap (in m) that avoids a collision.`,
        sol: `Relative speed $= ${vA} - ${vB} = ${dv}$ m/s. During the reaction time the gap closes by $${dv}\\times${tr} = ${fmt(dv * tr, 4)}$ m. Braking then removes the relative speed at ${a} m/s$^2$, closing a further $${dv}^2/(2\\times${a}) = ${fmt(dv * dv / (2 * a), 4)}$ m. Gap $= ${fmt(answer, 4)}$ m.`,
        trap: 'Work in the frame of $B$: only the relative speed matters, not the speed of $A$ alone.' };
    },
    verify: (p) => { const tau = (p.vA - p.vB) / p.a; const xA = p.vA * p.tr + p.vA * tau - 0.5 * p.a * tau * tau; const xB = p.vB * (p.tr + tau); return xA - xB; } },
  { id: 'msl-v5g2', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'two-stage motion',
    make(rng) {
      const a1 = choose(rng, [1, 2, 2.5]), a2 = choose(rng, [2, 4, 5]), vm = choose(rng, [15, 20, 25]), k = choose(rng, [20, 30, 40, 50]);
      const d = vm * vm / (2 * a1) + vm * vm / (2 * a2) + vm * k, answer = vm / a1 + vm / a2 + k;
      return { a1, a2, vm, k, d, answer: +answer.toFixed(3), tol: Math.max(0.05, answer * 0.005), unit: 's',
        q: `A train must go between two stations ${d} m apart. It can accelerate at ${a1} m/s$^2$ and brake at ${a2} m/s$^2$ and may not exceed ${vm} m/s. Find the shortest possible time in s.`,
        sol: `Acceleration takes ${fmt(vm / a1, 4)} s over ${fmt(vm * vm / (2 * a1), 4)} m and braking takes ${fmt(vm / a2, 4)} s over ${fmt(vm * vm / (2 * a2), 4)} m. The cruise distance is ${fmt(vm * k, 4)} m, taking ${k} s at ${vm} m/s. Total $= ${fmt(answer, 4)}$ s (the speed limit is reached, since the unlimited peak speed would be higher).`,
        trap: 'Check that the limit is actually reached before cruising.' };
    },
    verify: (p) => p.d / p.vm + p.vm / (2 * p.a1) + p.vm / (2 * p.a2) },
  { id: 'msl-v5g3', type: 'mcq', level: 5, exams: ['jee-adv'], sub: 'free fall',
    make(rng) {
      const n = choose(rng, [4, 5, 6]), u = choose(rng, [5, 10, 15]), h = 5 * n * n - u * n;
      const down = (-u + Math.sqrt(u * u + 20 * h)) / 10, drop = Math.sqrt(h / 5);
      const f = (x) => `${fmt(x, 3)} s`;
      const { options, answer } = shuffleOpts(rng, f(n), [f(drop), f(down), f(u / 10 + drop)]);
      return { n, u, h, options, answer,
        q: `A balloon rises at a steady ${u} m/s. When it is ${h} m above the ground a stone is released from it. Take $g = 10\\ \\mathrm{m\\,s^{-2}}$. The stone reaches the ground after`,
        sol: `The stone leaves with ${u} m/s upward: $y = ${h} + ${u}t - 5t^2 = 0$, so $t = ${n}$ s. Dropping it from rest would take ${f(drop)}, and throwing it down at ${u} m/s would take ${f(down)}.`,
        trap: 'The stone shares the balloon\'s upward velocity at the moment of release.' };
    },
    verify: (p) => { const H = p.h + p.u * p.u / 20; const t = p.u / 10 + Math.sqrt(H / 5); return p.options.indexOf(`${fmt(t, 3)} s`); } },
);


// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'motion-straight-line', groups, items, gens }, ['msl-g09', 'msl-g12', 'msl-g16']);
