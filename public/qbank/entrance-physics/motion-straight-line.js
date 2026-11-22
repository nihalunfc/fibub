// Motion in a straight line: Plus Two entrance bank (original fibub questions).
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
];

export default { topic: 'motion-straight-line', groups, items, gens };
