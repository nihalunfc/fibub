// Vectors and motion in a plane: Plus Two entrance bank (original fibub questions).
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
const nid = () => `mp-${String(++k).padStart(3, '0')}`;
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
const MU = r`\mathrm{m\,s^{-1}}`;

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'vectors', r`The dot product of two vectors is`, 'a scalar', ['a vector perpendicular to both', 'a vector along the first one', 'a unit vector'],
    r`$\vec A\cdot\vec B = AB\cos\theta$ is just a number, so it is a scalar. The cross product is the one that gives a vector.`),
  nat(1, 'vectors', r`Two forces of 3 N and 4 N act at right angles to each other at a point. Find the magnitude of the resultant (in N).`, 5, 0,
    r`For perpendicular vectors $R = \sqrt{3^2+4^2} = \sqrt{25} = 5$ N.`, { unit: 'N' }),
  mcq(1, 'vectors', r`A unit vector has a magnitude of`, 'one', ['zero', 'ten', 'depends on its direction'],
    r`A unit vector $\hat n = \vec A/|\vec A|$ only shows direction. Its magnitude is always 1 and it has no unit.`),
  nat(1, 'vectors', r`Find the magnitude of the vector $\vec A = 6\hat i - 8\hat j$.`, 10, 0,
    r`$|\vec A| = \sqrt{6^2 + (-8)^2} = \sqrt{100} = 10$. The minus sign disappears when squared.`),
  mcq(1, 'projectile motion', r`The time of flight of a projectile launched at speed $u$ at angle $\theta$ over level ground is`, r`$\dfrac{2u\sin\theta}{g}$`, [r`$\dfrac{u\sin\theta}{g}$`, r`$\dfrac{2u\cos\theta}{g}$`, r`$\dfrac{u^2\sin 2\theta}{g}$`],
    r`The vertical motion goes up and comes back: $0 = u\sin\theta\,T - \tfrac12 gT^2$, so $T = 2u\sin\theta/g$. The last option is the range.`),
  mcq(1, 'projectile motion', r`At the highest point of its path, the velocity of a projectile (no air) is`, r`horizontal, equal to $u\cos\theta$`, ['zero', r`vertical, equal to $u\sin\theta$`, r`equal to $u$`],
    r`Only the vertical component becomes zero at the top. The horizontal component $u\cos\theta$ never changes because no horizontal force acts.`, { trap: 'The velocity is zero at the top only for a vertical throw.' }),
  mcq(1, 'projectile motion', r`For a given speed of projection, the horizontal range on level ground is largest when the angle of projection is`, r`$45^\circ$`, [r`$30^\circ$`, r`$60^\circ$`, r`$90^\circ$`],
    r`$R = u^2\sin2\theta/g$ is largest when $\sin2\theta = 1$, i.e. $\theta = 45^\circ$.`),
  nat(1, 'circular motion', r`A wheel turns at 120 revolutions per minute. Find its angular speed in rad/s (take $\pi = 3.14$).`, 12.57, 0.05,
    r`120 rpm $= 2$ rev/s. Angular speed $\omega = 2\pi\times2 = 4\pi = 12.56$ rad/s.`, { unit: 'rad/s' }),
  mcq(1, 'circular motion', r`In uniform circular motion, the acceleration of the particle is directed`, 'towards the centre of the circle', ['along the direction of motion', 'away from the centre', 'perpendicular to the plane of the circle'],
    r`The speed is constant, so there is no tangential part. The velocity only changes direction, and the change is always towards the centre.`),
  nat(1, 'circular motion', r`A particle moves in a circle of radius 5 m at a constant speed of $10\ \mathrm{m\,s^{-1}}$. Find the magnitude of its centripetal acceleration (in $\mathrm{m\,s^{-2}}$).`, 20, 0,
    r`$a_c = v^2/r = 100/5 = 20\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  mcq(1, 'vectors', r`$\hat i\times\hat j$ equals`, r`$\hat k$`, [r`$-\hat k$`, r`$1$`, r`$0$`],
    r`By the right-hand rule, $\hat i\times\hat j = \hat k$. (And $\hat j\times\hat i = -\hat k$; the dot product $\hat i\cdot\hat j = 0$.)`),
  nat(1, 'vectors', r`Find $\vec A\cdot\vec B$ if $\vec A = 2\hat i + 3\hat j$ and $\vec B = 4\hat i - \hat j$.`, 5, 0,
    r`Multiply matching components and add: $2\times4 + 3\times(-1) = 8 - 3 = 5$.`),

  // ---------- Level 2 ----------
  nat(2, 'vectors', r`Two vectors of equal magnitude 10 act at an angle of $120^\circ$ to each other. Find the magnitude of their resultant.`, 10, 0,
    r`$R^2 = 10^2 + 10^2 + 2(10)(10)\cos120^\circ = 200 - 100 = 100$, so $R = 10$. (Three equal vectors at $120^\circ$ to each other add up to zero.)`, { trap: 'cos 120° is negative, so the resultant is smaller than either vector.' }),
  nat(2, 'vectors', r`A force of 50 N points $30^\circ$ above the $x$-axis. Find its vertical component (in N).`, 25, 0,
    r`$F_y = F\sin30^\circ = 50\times\tfrac12 = 25$ N. (The horizontal one is $F\cos30^\circ = 43.3$ N.)`, { unit: 'N' }),
  nat(2, 'projectile motion', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $45^\circ$ over level ground. Taking $g = 10\ \mathrm{m\,s^{-2}}$, find the range (in m).`, 40, 0,
    r`$R = u^2\sin2\theta/g = 400\times1/10 = 40$ m.`, { unit: 'm' }),
  nat(2, 'projectile motion', r`A stone is thrown at $40\ \mathrm{m\,s^{-1}}$ at $30^\circ$ to the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). Find the maximum height reached (in m).`, 20, 0,
    r`Vertical component $= 40\sin30^\circ = 20\ \mathrm{m\,s^{-1}}$. $H = (u\sin\theta)^2/2g = 400/20 = 20$ m.`, { unit: 'm' }),
  mcq(2, 'projectile motion', r`Two stones are thrown with the same speed at $30^\circ$ and $60^\circ$ to the horizontal. The ratio of their maximum heights is`, '1 : 3', ['1 : 2', '1 : $\\sqrt3$', '3 : 1'],
    r`$H\propto\sin^2\theta$. So $H_{30}:H_{60} = (1/2)^2:(\sqrt3/2)^2 = 1/4 : 3/4 = 1:3$. The ranges are equal (complementary angles) but the heights are not.`),
  nat(2, 'relative velocity', r`A boat that can move at $5\ \mathrm{m\,s^{-1}}$ in still water is steered straight across a 100 m wide river flowing at $3\ \mathrm{m\,s^{-1}}$. How far downstream does it land (in m)?`, 60, 0,
    r`Time to cross $= 100/5 = 20$ s (the river does not help the crossing). Drift $= 3\times20 = 60$ m.`, { unit: 'm' }),
  mcq(2, 'relative velocity', r`Rain falls vertically at $3\ \mathrm{m\,s^{-1}}$. A man walks at $4\ \mathrm{m\,s^{-1}}$ on a level road. At what angle to the vertical should he tilt his umbrella?`, r`$\tan^{-1}(4/3)\approx 53^\circ$`, [r`$\tan^{-1}(3/4)\approx 37^\circ$`, r`$45^\circ$`, r`$\tan^{-1}(7)\approx 82^\circ$`],
    r`Rain relative to man $= \vec v_R - \vec v_M$ has a vertical part 3 (down) and a horizontal part 4 (backwards). The angle from the vertical satisfies $\tan\phi = 4/3$, so $\phi = 53^\circ$, leaning forward.`, { trap: 'The angle is measured from the vertical: horizontal over vertical.' }),
  nat(2, 'relative velocity', r`Car A moves east at $30\ \mathrm{m\,s^{-1}}$ and car B moves north at $40\ \mathrm{m\,s^{-1}}$. Find the speed of B relative to A (in $\mathrm{m\,s^{-1}}$).`, 50, 0,
    r`$\vec v_{BA} = \vec v_B - \vec v_A = 40\hat j - 30\hat i$. Magnitude $= \sqrt{40^2+30^2} = 50\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'circular motion', r`A particle goes round a circle of radius 2 m in $\pi$ seconds at a constant speed. Find the magnitude of its acceleration (in $\mathrm{m\,s^{-2}}$).`, 8, 0,
    r`$\omega = 2\pi/T = 2\pi/\pi = 2$ rad/s. $a = \omega^2 r = 4\times2 = 8\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(2, 'circular motion', r`A stone tied to a string moves in a circle of radius 0.4 m with angular speed 5 rad/s. Find its linear speed (in $\mathrm{m\,s^{-1}}$).`, 2, 0,
    r`$v = \omega r = 5\times0.4 = 2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'vectors', r`The angle between two vectors of magnitudes 4 and 5 is $30^\circ$. Find the magnitude of their cross product.`, 10, 0,
    r`$|\vec A\times\vec B| = AB\sin\theta = 4\times5\times\tfrac12 = 10$. (The dot product would use $\cos30^\circ$ instead.)`, { trap: 'Cross uses sine, dot uses cosine.' }),
  mcq(2, 'vectors', r`The angle between $\vec A = \hat i + \hat j$ and $\vec B = \hat i - \hat j$ is`, r`$90^\circ$`, [r`$0^\circ$`, r`$45^\circ$`, r`$180^\circ$`],
    r`$\vec A\cdot\vec B = 1\times1 + 1\times(-1) = 0$, so $\cos\theta = 0$ and $\theta = 90^\circ$.`),
  nat(2, 'projectile motion', r`A ball is thrown at $30\ \mathrm{m\,s^{-1}}$ at $30^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). Find the time of flight (in s).`, 3, 0,
    r`$T = 2u\sin\theta/g = 2\times30\times0.5/10 = 3$ s.`, { unit: 's' }),
  nat(2, 'projectile motion', r`A ball rolls off a table 1.25 m high with a horizontal speed. Taking $g = 10\ \mathrm{m\,s^{-2}}$, how long does it take to hit the floor (in s)?`, 0.5, 0.01,
    r`Only vertical motion matters for the fall time: $1.25 = \tfrac12\times10\,t^2$, so $t^2 = 0.25$ and $t = 0.5$ s, whatever the horizontal speed.`, { unit: 's', trap: 'The horizontal speed does not change the time of fall.' }),
  mcq(2, 'circular motion', r`Which of these stays constant for a particle in uniform circular motion?`, 'Its speed', ['Its velocity', 'Its acceleration vector', 'Its momentum vector'],
    r`The direction of the velocity, and so of the momentum and of the acceleration, turns all the time. Only the magnitudes stay fixed. Speed (and the size of the acceleration) is constant, but the vectors are not.`, { trap: 'Constant speed is not constant velocity.' }),
  mcq(2, 'circular motion', r`The direction of the angular velocity vector of a particle going anticlockwise in the $xy$-plane is`, r`along $+z$`, [r`along the tangent`, r`towards the centre`, r`along $-z$`],
    r`$\vec\omega$ is along the axis of rotation, given by the right-hand rule: curl the fingers anticlockwise and the thumb points along $+z$.`),
  nat(2, 'vectors', r`Find the magnitude of $\vec A = 2\hat i + 3\hat j + 6\hat k$.`, 7, 0,
    r`$|\vec A| = \sqrt{4+9+36} = \sqrt{49} = 7$.`),
  mcq(2, 'projectile motion', r`The equation of the path of a projectile is`, 'a parabola', ['a circle', 'a straight line', 'an ellipse with the launch point as centre'],
    r`$y = x\tan\theta - \dfrac{gx^2}{2u^2\cos^2\theta}$ is quadratic in $x$: a parabola. (Planets and satellites have elliptical paths, but only because gravity then changes with distance.)`),
  nat(2, 'projectile motion', r`A bomb is dropped from a plane flying horizontally at $100\ \mathrm{m\,s^{-1}}$ at a height of 500 m ($g = 10\ \mathrm{m\,s^{-2}}$). Find the horizontal distance the bomb travels before it hits the ground (in m).`, 1000, 0,
    r`Fall time: $500 = 5t^2$, so $t = 10$ s. Horizontal distance $= 100\times10 = 1000$ m. The bomb keeps the plane's horizontal speed.`, { unit: 'm' }),
  mcq(2, 'projectile motion', r`On the Moon ($g$ is one-sixth of the value on Earth), a ball is hit with the same speed and angle as on Earth. Compared with Earth, its range is`, '6 times as large', ['6 times smaller', 'the same', '$\\sqrt6$ times as large'],
    r`$R = u^2\sin2\theta/g\propto 1/g$. With $g$ cut to a sixth, $R$ becomes 6 times as large.`),
  mcq(2, 'vectors', r`Three vectors of equal magnitude have a zero resultant. The angle between any two of them is`, r`$120^\circ$`, [r`$60^\circ$`, r`$90^\circ$`, r`$45^\circ$`],
    r`Placed head to tail they form a closed equilateral triangle. Each exterior angle, which is the angle between two vectors tail to tail, is $120^\circ$.`),
  nat(2, 'circular motion', r`The second hand of a clock has a tip that moves in a circle. Find its angular speed in rad/s (take $\pi = 3.14$, answer to 3 decimals).`, 0.105, 0.001,
    r`One revolution in 60 s: $\omega = 2\pi/60 = \pi/30 = 0.1047$ rad/s.`, { unit: 'rad/s' }),
  mcq(2, 'mixed', r`Using dimensions, the range of a projectile can depend on $u$ and $g$ only as $R = k\,u^a g^b$ with $k$ dimensionless. Then $(a,b)$ is`, '$(2,-1)$', ['$(1,-1)$', '$(2,1)$', '$(1,-2)$'],
    r`$[R] = \mathrm L$, $[u^a] = \mathrm{L}^a\mathrm{T}^{-a}$, $[g^b] = \mathrm{L}^b\mathrm{T}^{-2b}$. So $a + b = 1$ and $a + 2b = 0$, giving $b = -1$ and $a = 2$. Dimensions cannot give $\sin2\theta$ or the number $k$.`, { trap: 'Dimensions fix the powers but not the dimensionless factors.' }),

  // ---------- Level 3 ----------
  nat(3, 'relative velocity', r`A boat has a speed of $5\ \mathrm{m\,s^{-1}}$ in still water. A river 200 m wide flows at $3\ \mathrm{m\,s^{-1}}$. The boat is steered so that it reaches the point directly opposite its starting point. How long does the crossing take (in s)?`, 50, 0,
    r`To go straight across, the boat's upstream component must cancel the current: $5\sin\theta = 3$, so $\sin\theta = 0.6$. The speed across is $5\cos\theta = 4\ \mathrm{m\,s^{-1}}$. Time $= 200/4 = 50$ s. It is longer than the minimum time (40 s).`, { unit: 's', trap: 'The speed across is $\\sqrt{5^2 - 3^2} = 4$, not 5.' }),
  nat(3, 'relative velocity', r`A river 60 m wide flows at $5\ \mathrm{m\,s^{-1}}$. A swimmer who swims at $3\ \mathrm{m\,s^{-1}}$ in still water wants the smallest possible drift downstream. Find that drift (in m).`, 80, 0,
    r`The swimmer is slower than the river, so zero drift is impossible. The drift is least when the swimmer's velocity is perpendicular to the resultant velocity, with $\sin\theta = v_b/v_r = 3/5$ (heading upstream of the normal). Minimum drift $= \dfrac{d\sqrt{v_r^2 - v_b^2}}{v_b} = \dfrac{60\times4}{3} = 80$ m. Heading straight across would give $60\times5/3 = 100$ m.`, { unit: 'm', trap: 'When $v_b<v_r$ the least drift is not got by heading straight across.' }),
  nat(3, 'relative velocity', r`An aircraft has an airspeed of 200 km/h and heads due north. The wind blows towards the east at 150 km/h. Find the ground speed of the aircraft (in km/h).`, 250, 0,
    r`Ground velocity = air velocity + wind velocity $= 200\hat j + 150\hat i$. Speed $= \sqrt{200^2 + 150^2} = 250$ km/h, pointing north of east.`, { unit: 'km/h' }),
  mcq(3, 'relative velocity', r`A cyclist rides at $12\ \mathrm{m\,s^{-1}}$ and finds that the rain, which falls vertically, appears to come at $45^\circ$ to the vertical. If he doubles his speed, the angle (from the vertical) will be about`, r`$63^\circ$`, [r`$90^\circ$`, r`$53^\circ$`, r`$45^\circ$`],
    r`$\tan45^\circ = u/v_{rain} = 12/v_{rain}$, so the rain falls at $12\ \mathrm{m\,s^{-1}}$. Now $\tan\phi = 24/12 = 2$, so $\phi = \tan^{-1}2 = 63.4^\circ$. Doubling the speed does not double the angle.`, { trap: 'The angle does not double; the tangent does.' }),
  nat(3, 'relative velocity', r`Car A leaves the origin at $t = 0$ moving north at $8\ \mathrm{m\,s^{-1}}$. At the same instant car B is at the point 100 m east of the origin and moves west at $6\ \mathrm{m\,s^{-1}}$. Find the least distance between the cars during their motion (in m).`, 80, 0,
    r`In A's frame, B starts at $(100, 0)$ and has velocity $\vec v_{BA} = (-6, -8)$, speed 10. The least distance is the perpendicular distance from A to B's relative path: $d\sin\alpha = 100\times\dfrac{8}{10} = 80$ m, where $\sin\alpha = 8/10$ is the sine of the angle between the line joining them and the relative velocity. It happens at $t = 100\times6/10^2 = 6$ s.`, { unit: 'm', trap: 'Work in the relative frame; the true distance shrinks and then grows again.' }),
  mcq(3, 'projectile motion', r`A projectile has a range equal to four times its maximum height. The angle of projection is`, r`$45^\circ$`, [r`$30^\circ$`, r`$60^\circ$`, r`$\tan^{-1}4$`],
    r`$R/H = \dfrac{2u^2\sin\theta\cos\theta/g}{u^2\sin^2\theta/2g} = 4\cot\theta$. Setting $4\cot\theta = 4$ gives $\theta = 45^\circ$. (Option D would be the angle for $R = H$.)`, { trap: 'R = H needs $\\tan\\theta = 4$; R = 4H needs $\\tan\\theta = 1$.' }),
  nat(3, 'projectile motion', r`A ball is thrown at $50\ \mathrm{m\,s^{-1}}$ at an angle $\theta$ with $\sin\theta = 0.6$. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find its range on level ground (in m).`, 240, 0,
    r`$\cos\theta = 0.8$. Vertical speed $30\ \mathrm{m\,s^{-1}}$, so $T = 2\times30/10 = 6$ s. Horizontal speed $= 50\times0.8 = 40$. $R = 40\times6 = 240$ m.`, { unit: 'm' }),
  nat(3, 'projectile motion', r`A ball is thrown horizontally at $20\ \mathrm{m\,s^{-1}}$ from the top of a tower 80 m high ($g = 10\ \mathrm{m\,s^{-2}}$). Find the speed with which it hits the ground (in $\mathrm{m\,s^{-1}}$, to 1 decimal place).`, 44.7, 0.1,
    r`Fall time $= \sqrt{2\times80/10} = 4$ s. Vertical speed on landing $= 10\times4 = 40$. Speed $= \sqrt{20^2 + 40^2} = \sqrt{2000} = 44.7\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Add the components as vectors. $20 + 40 = 60$ is wrong.' }),
  nat(3, 'projectile motion', r`A stone is thrown at $20\ \mathrm{m\,s^{-1}}$ at $30^\circ$ above the horizontal from the edge of a 75 m high cliff ($g = 10\ \mathrm{m\,s^{-2}}$). After how many seconds does it hit the ground at the foot of the cliff?`, 5, 0,
    r`Take up as positive and the launch point as the origin. $y = 10t - 5t^2$ with $y = -75$: $5t^2 - 10t - 75 = 0$, i.e. $t^2 - 2t - 15 = 0$, so $(t-5)(t+3) = 0$ and $t = 5$ s. Reject the negative root.`, { unit: 's', trap: 'Do not use $2u\\sin\\theta/g$; the landing is below the launch level.' }),
  nat(3, 'trajectory equation', r`The path of a projectile is $y = 0.75x - 0.015x^2$ (in metres). Find its horizontal range (in m).`, 50, 0,
    r`The path meets the ground when $y = 0$: $x(0.75 - 0.015x) = 0$, so $x = 0.75/0.015 = 50$ m. (Maximum height $= a^2/4b = 9.4$ m.)`, { unit: 'm' }),
  nat(3, 'trajectory equation', r`The trajectory of a particle is $y = x - \dfrac{x^2}{20}$ (in metres, with $g = 10\ \mathrm{m\,s^{-2}}$). Find the speed of projection (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 14.14, 0.05,
    r`Compare with $y = x\tan\theta - \dfrac{gx^2}{2u^2\cos^2\theta}$. So $\tan\theta = 1$ ($\theta = 45^\circ$) and $\dfrac{10}{2u^2\cos^245^\circ} = \dfrac1{20}$, i.e. $u^2\cos^2\theta = 100$. So $u\cos\theta = 10$ and $u = 10\sqrt2 = 14.14\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'projectile motion', r`A footballer kicks a ball at $25\ \mathrm{m\,s^{-1}}$ at $37^\circ$ above the horizontal ($\sin37^\circ = 0.6$, $g = 10\ \mathrm{m\,s^{-2}}$) towards a wall 40 m away. At what height above the ground does it hit the wall (in m)?`, 10, 0,
    r`Horizontal speed $= 25\times0.8 = 20$, so it reaches the wall in $t = 40/20 = 2$ s. Vertical speed $= 15$. Height $= 15\times2 - 5\times4 = 10$ m. (It is on its way down already? $v_y = 15 - 20 = -5$: yes, it is falling.)`, { unit: 'm' }),
  nat(3, 'projectile motion', r`Two stones are thrown from the same point at the same instant, both with a vertical speed of $25\ \mathrm{m\,s^{-1}}$. Their horizontal speeds are $10\ \mathrm{m\,s^{-1}}$ east and $5\ \mathrm{m\,s^{-1}}$ west. How far apart are they after 4 s (in m, stones still in the air)?`, 60, 0,
    r`Both have acceleration $g$ downward, so relative acceleration is zero. Their vertical positions are always equal. Separation $= (10 + 5)\times4 = 60$ m.`, { unit: 'm' }),
  nat(3, 'mixed', r`A stone is thrown at $20\ \mathrm{m\,s^{-1}}$ at $30^\circ$ above the horizontal. Using energy ideas, find its speed when it is 4 m above the launch point ($g = 10\ \mathrm{m\,s^{-2}}$, answer in $\mathrm{m\,s^{-1}}$ to 2 decimals).`, 17.89, 0.05,
    r`Only gravity does work, so $v^2 = u^2 - 2gh = 400 - 80 = 320$ and $v = 17.89\ \mathrm{m\,s^{-1}}$. The angle does not matter for the speed at a given height, as long as that height is reachable (here the maximum height is 5 m).`, { unit: 'm/s', trap: 'Speed at a given height depends only on the launch speed, not on the angle.' }),
  nat(3, 'non-uniform circular motion', r`A particle moves on a circle of radius 2 m and its speed grows as $v = 3t$ (SI). Find the magnitude of its total acceleration at $t = 2$ s (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 18.25, 0.05,
    r`$v = 6\ \mathrm{m\,s^{-1}}$ at $t = 2$. Radial: $v^2/r = 36/2 = 18$. Tangential: $dv/dt = 3$. Total $= \sqrt{18^2 + 3^2} = \sqrt{333} = 18.25\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(3, 'angular quantities', r`A wheel starts from rest with a constant angular acceleration of $\pi\ \mathrm{rad\,s^{-2}}$. How many complete revolutions does it make in the first 4 s?`, 4, 0,
    r`$\theta = \tfrac12\alpha t^2 = \tfrac12\pi\times16 = 8\pi$ rad. Each revolution is $2\pi$ rad, so $8\pi/2\pi = 4$ revolutions.`),
  mcq(3, 'vectors', r`A vector perpendicular to $4\hat i + 3\hat j$, of the same magnitude and with a positive $\hat j$ component, is`, r`$-3\hat i + 4\hat j$`, [r`$3\hat i + 4\hat j$`, r`$4\hat i - 3\hat j$`, r`$3\hat i - 4\hat j$`],
    r`Dot with $4\hat i + 3\hat j$: $-12 + 12 = 0$ for option A. Option B: $12+12 \ne 0$. Option C: $16 - 9\ne0$. Option D is also perpendicular with magnitude 5, but its $\hat j$ part is negative.`, { trap: 'Two perpendicular vectors exist in a plane (one on each side).' }),
  nat(3, 'vectors', r`Find the area of the parallelogram whose adjacent sides are $\vec A = 2\hat i + \hat j$ and $\vec B = \hat i + 3\hat j$ (in square units).`, 5, 0,
    r`Area $= |\vec A\times\vec B| = |A_xB_y - A_yB_x| = |2\times3 - 1\times1| = 5$.`),
  mcq(3, 'vectors', r`If $|\vec A + \vec B| = |\vec A - \vec B|$ for two non-zero vectors, then the angle between them is`, r`$90^\circ$`, [r`$0^\circ$`, r`$180^\circ$`, r`$60^\circ$`],
    r`Square both sides: $A^2 + B^2 + 2\vec A\cdot\vec B = A^2 + B^2 - 2\vec A\cdot\vec B$, so $\vec A\cdot\vec B = 0$. The vectors are perpendicular (the diagonals of a rectangle are equal).`),
  nat(3, 'vectors', r`Find the angle, in degrees, between the vectors $\hat i + \hat j + \hat k$ and $\hat i$ (1 decimal place).`, 54.7, 0.1,
    r`$\cos\theta = \dfrac{1}{\sqrt3\times1}$, so $\theta = \cos^{-1}(0.577) = 54.7^\circ$.`, { unit: '°' }),
  mcq(3, 'vectors', r`The unit vector along $2\hat i - 3\hat j + 6\hat k$ is`, r`$\dfrac{2\hat i - 3\hat j + 6\hat k}{7}$`, [r`$\dfrac{2\hat i - 3\hat j + 6\hat k}{11}$`, r`$\dfrac{2\hat i - 3\hat j + 6\hat k}{\sqrt{11}}$`, r`$\dfrac{2\hat i + 3\hat j + 6\hat k}{7}$`],
    r`$|\vec A| = \sqrt{4+9+36} = 7$. Divide the vector by 7. Option B has the sum 11 and C has its root; D flips a sign.`),
  mcq(3, 'circular motion', r`Which of these is NOT correct for a particle in uniform circular motion?`, 'Its acceleration vector is constant', ['Its speed is constant', 'Its kinetic energy is constant', 'The magnitude of its acceleration is constant'],
    r`The acceleration always points to the centre, so its direction keeps changing. The vector is not constant even though its size $v^2/r$ is.`, { trap: 'Read "NOT correct": hunt for the false statement.' }),
  mcq(3, 'projectile motion', r`The speed–time graph of a projectile launched at $60^\circ$ from level ground and landing at the same level looks like`, 'a curve that falls to a minimum (non-zero) at half the flight time and rises again', ['a straight line falling to zero', 'a curve falling to zero at the top and rising again', 'a straight horizontal line'],
    r`Speed $= \sqrt{u_x^2 + (u_y - gt)^2}$. It is smallest when $u_y = gt$, at half the time of flight, where it equals $u\cos60^\circ \ne 0$. It then increases symmetrically back to $u$.`, { trap: 'Do not confuse the speed graph with the vertical velocity graph, which is a straight line through zero.' }),
  mcq(3, 'projectile motion', r`A passenger in a train moving at a constant velocity tosses a coin straight up (relative to the train). Ignoring air, the coin falls`, 'back into his hand', ['behind his hand', 'ahead of his hand', 'to the side, but never in his hand'],
    r`The train is an inertial frame, so the coin has the same horizontal speed as the train all the time. In the ground frame the coin follows a parabola with the same horizontal drift as the train, so it returns to the hand. If the train were accelerating, the coin would land behind.`),
  mcq(3, 'projectile motion', r`A bomb is released from an aeroplane in level flight at constant velocity. Ignoring air, as seen from the aeroplane the bomb`, 'falls vertically below the plane', ['falls behind the plane in a parabola', 'moves ahead of the plane', 'hangs in front of the plane'],
    r`The bomb and plane share the same horizontal velocity, so the bomb stays directly below the plane while it falls. Seen from the ground, the bomb's path is a parabola.`),
  nat(3, 'projectile motion', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $53^\circ$ above the horizontal ($\sin53^\circ = 0.8$, $g = 10\ \mathrm{m\,s^{-2}}$). After how many seconds does it reach its highest point?`, 1.6, 0.01,
    r`Vertical speed $= 20\times0.8 = 16\ \mathrm{m\,s^{-1}}$. It becomes zero after $t = 16/10 = 1.6$ s. Half the time of flight is the same number.`, { unit: 's' }),
  nat(3, 'mixed', r`A particle has position vector $\vec r = 3t^2\hat i + 4t^2\hat j$ (SI). Find its speed at $t = 2$ s (in $\mathrm{m\,s^{-1}}$).`, 20, 0,
    r`$\vec v = d\vec r/dt = 6t\hat i + 8t\hat j$. At $t = 2$: $(12, 16)$, speed $= \sqrt{144 + 256} = 20\ \mathrm{m\,s^{-1}}$. The path is a straight line along $y = \tfrac43x$, so the motion is one-dimensional with acceleration $10\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s' }),
  nat(3, 'mixed', r`A particle moves so that $x = 2t$ and $y = t^2$ (SI). Find the magnitude of its velocity at $t = 3$ s (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 6.32, 0.02,
    r`$v_x = 2$ and $v_y = 2t = 6$. Speed $= \sqrt{4 + 36} = \sqrt{40} = 6.32\ \mathrm{m\,s^{-1}}$. The path is the parabola $y = x^2/4$.`, { unit: 'm/s' }),
  nat(3, 'angular quantities', r`A 20 cm radius flywheel rotates at 300 rpm. Find the centripetal acceleration of a point on its rim (in $\mathrm{m\,s^{-2}}$, nearest integer; $\pi^2 = 9.87$).`, 197, 1,
    r`$\omega = 2\pi\times300/60 = 10\pi$ rad/s. $a = \omega^2 r = 100\pi^2\times0.2 = 20\pi^2 = 197\ \mathrm{m\,s^{-2}}$. Use metres: 0.2, not 20.`, { unit: 'm/s²', trap: 'Convert rpm to rad/s and cm to m before squaring.' }),
  nat(3, 'relative velocity', r`A pilot wants to fly due north at an airspeed of 300 km/h while a steady wind blows towards the east at 100 km/h. Find the ground speed of the aircraft (in km/h, to the nearest whole number).`, 283, 1,
    r`The pilot must head slightly west of north so that the westward part of his airspeed cancels the wind: $300\sin\phi = 100$. Ground speed $= 300\cos\phi = \sqrt{300^2 - 100^2} = 282.8\approx283$ km/h.`, { unit: 'km/h' }),
  nat(3, 'relative velocity', r`Rain falls with a velocity of $10\ \mathrm{m\,s^{-1}}$ downwards and $5\ \mathrm{m\,s^{-1}}$ towards the east (wind). A man walks towards the east. What speed should he walk at so that the rain seems to fall vertically (in $\mathrm{m\,s^{-1}}$)?`, 5, 0,
    r`For the rain to look vertical, the man's horizontal velocity must equal the rain's horizontal velocity: $5\ \mathrm{m\,s^{-1}}$ east. Then $\vec v_{rain} - \vec v_{man}$ is purely downward.`, { unit: 'm/s' }),
  nat(3, 'vectors', r`Two forces of magnitude 8 N and 6 N have a resultant of magnitude 10 N. Find the angle between the forces (in degrees).`, 90, 0,
    r`$10^2 = 8^2 + 6^2 + 2(8)(6)\cos\theta$ gives $100 = 100 + 96\cos\theta$, so $\cos\theta = 0$ and $\theta = 90^\circ$.`, { unit: '°' }),

  // ---------- Level 4 ----------
  nat(4, 'projectile on incline', r`A ball is projected from the foot of a smooth plane inclined at $30^\circ$ with speed $20\ \mathrm{m\,s^{-1}}$, at $60^\circ$ above the horizontal (so $30^\circ$ above the plane), in the vertical plane containing the line of greatest slope, up the incline. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find how far up the incline it lands (in m, 2 decimals).`, 26.67, 0.05,
    r`Use axes along and perpendicular to the plane. Launch: along $= 20\cos30^\circ = 17.32$, perpendicular $= 20\sin30^\circ = 10$. Gravity: along (down the plane) $g\sin30^\circ = 5$, perpendicular $g\cos30^\circ = 8.66$. Time of flight: $T = 2\times10/8.66 = 2.309$ s. Range along the plane $= 17.32\times2.309 - \tfrac12\times5\times2.309^2 = 40 - 13.33 = 26.67$ m. (Formula: $R = 2u^2\sin\alpha\cos\theta/(g\cos^2\beta)$.)`, { unit: 'm', trap: 'The plane is the new axis; the horizontal range formula does not apply.' }),
  nat(4, 'projectile on incline', r`A ball is thrown from a point on a smooth incline of angle $30^\circ$ with speed $10\ \mathrm{m\,s^{-1}}$ perpendicular to the plane ($g = 10\ \mathrm{m\,s^{-2}}$). It lands on the plane again. How far from the launch point, along the plane, does it land (in m, 2 decimals)?`, 13.33, 0.05,
    r`Perpendicular to the plane: $T = 2u/(g\cos30^\circ) = 20/8.66 = 2.309$ s. Along the plane the launch speed is zero, and gravity pulls it down the slope with $g\sin30^\circ = 5$: distance $= \tfrac12\times5\times2.309^2 = 13.33$ m, down the plane.`, { unit: 'm' }),
  nat(4, 'projectile on incline', r`A ball is thrown horizontally at $10\ \mathrm{m\,s^{-1}}$ from the top of a long smooth slope that descends at $45^\circ$. Taking $g = 10\ \mathrm{m\,s^{-2}}$, find the distance along the slope from the throw point to where the ball first lands (in m, 2 decimals).`, 28.28, 0.1,
    r`Horizontal $x = 10t$, vertical drop $y = 5t^2$. It lands on the slope when $y/x = \tan45^\circ = 1$: $5t^2 = 10t$, so $t = 2$ s. Then $x = y = 20$ m, and the distance along the slope $= 20/\cos45^\circ = 28.28$ m.`, { unit: 'm' }),
  nat(4, 'projectile motion', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). At what time after launch is its velocity directed $45^\circ$ below the horizontal (in s, 2 decimals)?`, 2.73, 0.02,
    r`$v_x = 10$ (constant). We need $v_y = -10$. $v_y = 10\sqrt3 - 10t = -10$ gives $t = \sqrt3 + 1 = 2.73$ s. (The flight lasts $2\sqrt3 = 3.46$ s, so this is before landing.)`, { unit: 's', trap: '45° below the horizontal means $v_y = -v_x$.' }),
  nat(4, 'projectile motion', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). Find the radius of curvature of its path at the instant of launch (in m).`, 80, 0,
    r`At a point the radius of curvature is $v^2/a_n$, where $a_n$ is the component of $g$ perpendicular to the velocity. At launch the velocity makes $60^\circ$ with the horizontal, so $a_n = g\cos60^\circ = 5$. $R = 400/5 = 80$ m. (At the top it is $10^2/10 = 10$ m.)`, { unit: 'm', trap: 'Use only the part of g perpendicular to the velocity.' }),
  nat(4, 'non-uniform circular motion', r`A particle starts from rest on a circle of radius 2 m with a constant tangential acceleration of $0.5\ \mathrm{m\,s^{-2}}$. After how many seconds does its total acceleration make $45^\circ$ with its velocity?`, 2, 0,
    r`The total acceleration makes $45^\circ$ with the velocity when the radial part equals the tangential part: $v^2/r = a_t$. With $v = a_tt$: $(0.5t)^2/2 = 0.5$, so $t^2 = 4$ and $t = 2$ s.`, { unit: 's' }),
  nat(4, 'non-uniform circular motion', r`A particle moves on a circle of radius 0.5 m with angular position $\theta = 2t^2 + 3t$ (radians, $t$ in s). Find the magnitude of its total acceleration at $t = 1$ s (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 24.58, 0.05,
    r`$\omega = d\theta/dt = 4t + 3 = 7$ rad/s and $\alpha = 4\ \mathrm{rad\,s^{-2}}$. Radial: $\omega^2r = 49\times0.5 = 24.5$. Tangential: $\alpha r = 2$. Total $= \sqrt{24.5^2 + 2^2} = 24.58\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Radial and tangential parts are perpendicular, so add squares.' }),
  nat(4, 'relative velocity', r`Rain falls at $20\ \mathrm{m\,s^{-1}}$ along a line $30^\circ$ from the vertical, blown towards the east. A man walks west at $5\ \mathrm{m\,s^{-1}}$. Find the speed of the rain relative to him (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, 22.9, 0.1,
    r`Rain velocity $= (10, -17.32)$ (east, up). Man $= (-5, 0)$. Relative $= (15, -17.32)$ and its speed $= \sqrt{225 + 300} = 22.9\ \mathrm{m\,s^{-1}}$. Walking against the wind makes the rain look faster.`, { unit: 'm/s' }),
  nat(4, 'trajectory equation', r`A projectile's path is $y = 2x - 0.05x^2$ (metres; take $g = 10\ \mathrm{m\,s^{-2}}$). Find the speed of projection (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 22.36, 0.05,
    r`$\tan\theta = 2$. $\dfrac{g}{2u^2\cos^2\theta} = 0.05$ gives $u^2\cos^2\theta = 100$, so $u\cos\theta = 10$. Then $u\sin\theta = 20$ and $u = \sqrt{100 + 400} = 22.36\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(4, 'projectile motion', r`A ball is thrown with the same speed on two occasions, at angles $\theta$ and $90^\circ - \theta$, and the times of flight are $T_1$ and $T_2$. The common range $R$ is`, r`$\tfrac12gT_1T_2$`, [r`$gT_1T_2$`, r`$\tfrac14g(T_1^2 + T_2^2)$`, r`$\tfrac12g(T_1 + T_2)$`],
    r`$T_1 = 2u\sin\theta/g$ and $T_2 = 2u\cos\theta/g$, so $T_1T_2 = 4u^2\sin\theta\cos\theta/g^2 = 2R/g$. So $R = \tfrac12gT_1T_2$. Check option C with the case $\theta = 45^\circ$: $T_1 = T_2$; C would give $gT_1$, but $R = \tfrac12gT_1^2$.`, { trap: 'Test your answer with $\\theta = 45^\\circ$ where $T_1 = T_2$.' }),
  mcq(4, 'relative velocity', r`Two particles move with constant velocities in a plane. They will collide if, and only if,`, r`the relative position vector is parallel to the relative velocity and the relative velocity points towards the other particle`, ['their paths cross at some point', 'their speeds are equal', 'the angle between their velocities is $90^\\circ$'],
    r`Collision means the relative position becomes zero. The relative position changes along the relative velocity, so $\vec r_{rel}$ must be along $-\vec v_{rel}$ (i.e. $\vec r_{rel}\times\vec v_{rel} = 0$ with the particles approaching). Crossing paths is not enough: the particles must arrive at the crossing together.`, { trap: 'Paths crossing is not the same as colliding.' }),
  msq(4, 'vectors', r`Which of the following hold for ANY two vectors $\vec A$ and $\vec B$?`,
    [r`$\vec A\cdot\vec B = \vec B\cdot\vec A$`, r`$\vec A\times\vec B = \vec B\times\vec A$`, r`$\vec A\cdot(\vec A\times\vec B) = 0$`, r`$|\vec A\times\vec B|^2 + (\vec A\cdot\vec B)^2 = A^2B^2$`], [0, 2, 3],
    r`(a) The dot product is commutative: true. (b) The cross product is anti-commutative, $\vec A\times\vec B = -\vec B\times\vec A$: false. (c) $\vec A\times\vec B$ is perpendicular to $\vec A$: true. (d) $A^2B^2\sin^2\theta + A^2B^2\cos^2\theta = A^2B^2$: true.`, { trap: 'Order matters for the cross product.' }),
  msq(4, 'projectile motion', r`A projectile is launched from level ground at an angle $\theta$ ($0<\theta<90^\circ$) and lands at the same level (no air resistance). Which are correct?`,
    ['The acceleration is the same at every point of the path', 'The horizontal component of velocity is constant', 'The velocity at landing equals the launch velocity, as a vector', 'The speed is least at the highest point'], [0, 1, 3],
    r`(a), (b): only gravity acts, so $\vec a = \vec g$ throughout and $v_x$ is constant. (c) False: the vertical component reverses, so the vector differs (the speed is equal). (d) True: speed $=\sqrt{v_x^2+v_y^2}$ is least when $v_y = 0$.`, { trap: 'Speed is the same at launch and landing, but velocity is not.' }),
  msq(4, 'non-uniform circular motion', r`A particle moves on a circle with a constant tangential acceleration and increasing speed. Which are correct?`,
    ['The radial acceleration always points to the centre', 'The net acceleration always points to the centre', 'The angle between the net acceleration and the velocity is less than $90^\\circ$', r`The magnitude of the net acceleration is $\sqrt{a_r^2 + a_t^2}$`], [0, 2, 3],
    r`The radial component $v^2/r$ always points to the centre. With a tangential part along the velocity, the net acceleration is tilted forward, so it does not point to the centre (b is false), and the angle with the velocity is acute (c). The two parts are perpendicular, so (d).`),

  // ---------- Level 5 ----------
  nat(5, 'projectile motion', r`A ball is thrown from the top of a 80 m high cliff at $30\ \mathrm{m\,s^{-1}}$, at the angle that gives the largest possible horizontal range on the ground below ($g = 10\ \mathrm{m\,s^{-2}}$). Find that maximum range (in m).`, 150, 0,
    r`From a height $h$, $R_{max} = \dfrac{u}{g}\sqrt{u^2 + 2gh} = \dfrac{30}{10}\sqrt{900 + 1600} = 3\times50 = 150$ m. The best angle is $\tan\theta = u/\sqrt{u^2+2gh} = 0.6$, i.e. $31^\circ$, less than $45^\circ$. (From level ground, $u^2/g = 90$ m only.)`, { unit: 'm', trap: 'The best angle from a cliff is below 45°.' }),
  nat(5, 'projectile motion', r`A ball is projected at $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). After what time is its velocity perpendicular to its initial velocity (in s, 2 decimals)?`, 2.31, 0.02,
    r`Need $\vec v\cdot\vec u = 0$: $(u\cos\theta)^2 + u\sin\theta(u\sin\theta - gt) = 0$, so $u^2 = u g t\sin\theta$ and $t = u/(g\sin\theta) = 20/(10\times0.866) = 2.31$ s. Check it is within the flight time $3.46$ s: yes.`, { unit: 's', trap: 'A solution only counts if it is before the ball lands (here $t<3.46$ s).' }),
  nat(5, 'projectile on incline', r`A ball is projected from the foot of a long incline of angle $37^\circ$ ($\tan37^\circ = 3/4$). It strikes the incline horizontally. Find the angle of projection above the horizontal, in degrees (1 decimal).`, 56.3, 0.1,
    r`Hitting horizontally means it is at the top of its path. The top point is at $x = u^2\sin\theta\cos\theta/g$, $y = u^2\sin^2\theta/2g$, so $y/x = \tfrac12\tan\theta$. This must equal $\tan37^\circ$: $\tan\theta = 2\tan\beta = 3/2$ and $\theta = 56.3^\circ$.`, { unit: '°', trap: 'It is the angle to the horizontal, not to the plane ($56.3 - 37 = 19.3$).' }),
  nat(5, 'projectile motion', r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). Find the radius of curvature of its path at the point where its velocity is $30^\circ$ above the horizontal (in m, 2 decimals).`, 15.4, 0.05,
    r`$v_x = 10$ is constant. At this point $v\cos30^\circ = 10$, so $v = 11.55$ and $v^2 = 133.3$. The component of $g$ perpendicular to $v$ is $g\cos30^\circ = 8.66$. $R = 133.3/8.66 = 15.40$ m. (Compact form: $R = v_x^2/(g\cos^3\phi)$.)`, { unit: 'm' }),
  nat(5, 'relative velocity', r`A river is 50 m wide. The speed of the current changes with distance $x$ from the starting bank as $v_r = 0.2x$ ($x$ in m, $v_r$ in $\mathrm{m\,s^{-1}}$). A boat moves at $5\ \mathrm{m\,s^{-1}}$ relative to the water, always aimed perpendicular to the banks. How far downstream does it land (in m)?`, 50, 0,
    r`Across: $x = 5t$, so the crossing takes $50/5 = 10$ s. Along the river: $dy/dt = 0.2x = 0.2\times5t = t$, so $y = t^2/2$. At $t = 10$: $y = 50$ m. (Check: the current grows linearly in time from 0 to $10\ \mathrm{m\,s^{-1}}$, so its mean is $5$ and $5\times10 = 50$ m.)`, { unit: 'm', trap: 'The current depends on position, so integrate along the path.' }),
  msq(5, 'relative velocity', r`A river 120 m wide flows at $5\ \mathrm{m\,s^{-1}}$. A boat has a speed of $4\ \mathrm{m\,s^{-1}}$ in still water. Which statements are correct?`,
    ['The minimum crossing time is 30 s', 'The boat can reach the point directly opposite its start', 'The minimum possible drift is 90 m', 'The drift is 90 m when the boat crosses in the minimum time', 'When the drift is least, the crossing takes 50 s'], [0, 2, 4],
    r`(a) $120/4 = 30$ s by aiming straight across: true. (b) $v_b<v_r$, so it cannot cancel the current: false. (c) Least drift $= d\sqrt{v_r^2 - v_b^2}/v_b = 120\times3/4 = 90$ m: true. (d) False: crossing in 30 s gives a drift of $5\times30 = 150$ m. (e) For the least drift $\sin\theta = 0.8$, the speed across is $4\cos\theta = 2.4$, so $t = 120/2.4 = 50$ s: true.`, { trap: 'Least time and least drift are different strategies.' }),
  msq(5, 'projectile motion', r`Two balls are thrown at the same instant from the same point in the same vertical plane, with different velocities (no air resistance). Which are correct while both are in the air?`,
    ['Their relative acceleration is zero', 'The line joining them keeps a fixed direction', 'They can collide if both are thrown at the same angle', 'The distance between them grows at a constant rate'], [0, 1, 3],
    r`The relative position is $(\vec u_1 - \vec u_2)t$ since gravity cancels. So the relative acceleration is zero, the direction is fixed, and the separation grows linearly. Starting together from the same point with different velocities, they never meet again (c is false), even at the same angle with different speeds.`),
  asrt(5, 'projectile motion', r`The angle of projection for the largest range of a projectile launched from the top of a cliff is less than $45^\circ$.`, r`The range is largest when $\sin2\theta = 1$, even for a cliff launch.`, 2,
    r`A is true: for $h>0$ the best angle is $\tan\theta = u/\sqrt{u^2 + 2gh}<1$. R is false: $R = u^2\sin2\theta/g$ holds only for level ground, and from a cliff the range has an extra term from the height.`),

  // ---------- Assertion-Reason ----------
  asrt(2, 'projectile motion', r`The range of a projectile is the same for launch angles $\theta$ and $90^\circ - \theta$.`, r`The range depends on $\sin2\theta$, and $\sin2(90^\circ - \theta) = \sin2\theta$.`, 0,
    r`Both true. $R = u^2\sin2\theta/g$ and $\sin(180^\circ - 2\theta) = \sin2\theta$, so R explains A.`),
  asrt(2, 'circular motion', r`In uniform circular motion the velocity and the acceleration are perpendicular to each other.`, r`The centripetal acceleration is directed along the radius towards the centre, while the velocity is along the tangent.`, 0,
    r`A radius and the tangent at the same point are perpendicular. R states exactly this, so it explains A.`),
  asrt(3, 'projectile motion', r`At the highest point of the path of a projectile, the acceleration is zero.`, r`The vertical component of the velocity of a projectile is zero at its highest point.`, 3,
    r`A is false: the acceleration is $g$ downward throughout. R is true. Zero velocity component does not mean zero acceleration.`, { trap: 'Velocity zero (vertical part) does not mean acceleration zero.' }),
  asrt(3, 'circular motion', r`A body in uniform circular motion has an acceleration although its speed is constant.`, r`Acceleration is the rate of change of velocity, and the direction of the velocity keeps changing.`, 0,
    r`Both true; R explains A. Speed constant only means no tangential acceleration.`),
  asrt(3, 'vectors', r`The magnitude of the resultant of two vectors can be less than the magnitude of either of them.`, r`The magnitude of the resultant depends on the angle between the vectors.`, 0,
    r`For $P = Q = 5$ and an angle of $120^\circ$, $R = 5$. For $180^\circ$ it is $|P - Q|$ which is smaller than both if both are non-zero. R is the reason: the cosine term can be negative.`),
  asrt(3, 'projectile motion', r`The kinetic energy of a projectile is least at the highest point of its path.`, r`The speed at the highest point is $u\cos\theta$, the smallest value over the flight.`, 0,
    r`Kinetic energy $= \tfrac12mv^2$ is least where the speed is least. The speed is $\sqrt{v_x^2 + v_y^2}$ with $v_x$ constant, so it is least when $v_y = 0$, at the top. R explains A.`),
  asrt(4, 'vectors', r`If $\vec A\cdot\vec B = \vec A\cdot\vec C$ for a non-zero vector $\vec A$, then $\vec B = \vec C$.`, r`The dot product of two perpendicular vectors is zero.`, 3,
    r`A is false: $\vec A\cdot(\vec B - \vec C) = 0$ only says $\vec B - \vec C$ is perpendicular to $\vec A$ (or zero). R is true.`, { trap: 'You cannot cancel a vector from a dot product.' }),
  asrt(4, 'relative velocity', r`A swimmer who wishes to reach the point directly opposite must aim upstream.`, r`Aiming straight across the river gives the shortest crossing time.`, 1,
    r`A is true: the upstream component of his velocity must cancel the current. R is also true, but it is not the reason for A: it is about time, and A is about position.`),

  // ---------- Statements ----------
  stm(2, 'projectile motion', r`The horizontal velocity of a projectile stays constant throughout (no air).`, r`No horizontal force acts on the projectile.`, 0,
    r`Both true. With no horizontal force there is no horizontal acceleration.`),
  stm(3, 'vectors', r`$\vec A\times\vec B$ is perpendicular to both $\vec A$ and $\vec B$.`, r`$\vec A\times\vec B = \vec B\times\vec A$.`, 2,
    r`I is true by the definition. II is false: $\vec B\times\vec A = -\vec A\times\vec B$.`),
  stm(3, 'circular motion', r`A particle moving in a circle with constant speed has a constant velocity.`, r`The speed of the particle is constant.`, 3,
    r`I is false: the direction changes, so the velocity changes. II is true.`, { trap: 'Velocity is a vector; direction counts.' }),
  stm(3, 'circular motion', r`In uniform circular motion, the work done by the centripetal force is zero.`, r`The centripetal force is perpendicular to the displacement at every instant.`, 0,
    r`Both true. $W = \vec F\cdot d\vec s = 0$ when force and displacement are perpendicular, so the kinetic energy stays constant.`),
  stm(4, 'non-uniform circular motion', r`In non-uniform circular motion, the net acceleration points towards the centre.`, r`The radial component of acceleration points to the centre, and the tangential component is along the velocity.`, 3,
    r`I is false: the net acceleration is the sum of a radial part (towards the centre) and a tangential part, so it is tilted. II is true.`),
  stm(4, 'projectile motion', r`Two stones thrown at the same speed at $30^\circ$ and $60^\circ$ to the horizontal have the same range and the same time of flight.`, r`Complementary angles of projection give the same range for a given speed.`, 3,
    r`I is false: ranges are equal but $T = 2u\sin\theta/g$ differs ($\sin30^\circ\neq\sin60^\circ$). II is true.`),
  stm(4, 'projectile motion', r`The angle between the velocity and the acceleration of a projectile changes continuously during the flight.`, r`At the highest point of the path of a projectile on level ground, the angle between velocity and acceleration is $90^\circ$.`, 0,
    r`Acceleration is fixed (downward) while the velocity direction rotates, so the angle changes: I true. At the top the velocity is horizontal and $\vec g$ is vertical: $90^\circ$. II true.`),
  mcq(5, 'concepts', r`How many of these are correct? (a) Speed at equal heights on the way up and down is the same. (b) The time to go up equals the time to come down, from the launch level to the same level. (c) The path from a cliff top is symmetric about its highest point. (d) The range of a projectile in vacuum depends on its mass.`, '2', ['1', '3', '4'],
    r`(a) True: energy conservation. (b) True. (c) False: it ends below the launch level, so the paths up and down are not mirror images. (d) False. Two are correct.`, { format: 'statements' }),
  asrt(4, 'vectors', r`The sum of three non-zero vectors of equal magnitude can be zero.`, r`Three equal vectors at $120^\circ$ to each other close into an equilateral triangle.`, 0,
    r`Placed head to tail the three vectors return to the start. R is the way to do it, so R explains A.`),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'vectors', group: 'm1',
    q: 'Take two vectors of magnitudes 3 and 4 and match each item in List I with its value in List II.',
    options: ['A-q, B-s, C-p, D-r', 'A-q, B-p, C-s, D-r', 'A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p'], answer: 0,
    sol: r`A: dot product of perpendicular vectors $= 0$ (q). B: dot product of parallel vectors $= 3\times4 = 12$ (s). C: resultant when parallel $= 3 + 4 = 7$ (p). D: resultant when antiparallel $= 4 - 3 = 1$ (r).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'projectile motion', group: 'm2',
    q: r`A ball is thrown at $20\ \mathrm{m\,s^{-1}}$ at $30^\circ$ above the horizontal ($g = 10\ \mathrm{m\,s^{-2}}$). Match the quantities.`,
    options: ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'], answer: 1,
    sol: r`Time of flight $= 2\times10/10 = 2$ s (r). Maximum height $= 10^2/20 = 5$ m (p). Range $= 20^2\sin60^\circ/10 = 34.6$ m (s). Speed at the top $= 20\cos30^\circ = 17.3\ \mathrm{m\,s^{-1}}$ (q).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'non-uniform circular motion', group: 'm3',
    q: r`A particle moves in a circle of radius 2 m with speed $v = 2t$ (SI). Match the quantities at $t = 3$ s.`,
    options: ['A-p, B-s, C-q, D-r', 'A-q, B-s, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-q, B-r, C-p, D-s'], answer: 2,
    sol: r`$v = 6$. Radial acceleration $= v^2/r = 18\ \mathrm{m\,s^{-2}}$ (q). Tangential $= dv/dt = 2\ \mathrm{m\,s^{-2}}$ (s). Angular speed $= v/r = 3$ rad/s (p). Angular acceleration $= a_t/r = 1\ \mathrm{rad\,s^{-2}}$ (r).` },

  // ---------- Multi-correct (more) ----------
  msq(2, 'vectors', r`The resultant of a 5 N force and a 3 N force can have a magnitude of which of the following?`, ['9 N', '1 N', '4 N', '8 N', '2 N'], [2, 3, 4],
    r`The resultant lies between $|5-3| = 2$ N and $5+3 = 8$ N, and every value in between is possible by choosing the angle. So 2 N, 4 N and 8 N are possible; 1 N and 9 N are outside.`),
  msq(3, 'circular motion', r`Which of these remain constant for a particle in uniform circular motion?`, ['Its speed', 'Its velocity', 'The magnitude of its acceleration', 'The direction of its acceleration', 'Its kinetic energy'], [0, 2, 4],
    r`Speed, the size of the acceleration ($v^2/r$) and the kinetic energy are constant. The velocity and the acceleration direction keep rotating.`),
  msq(3, 'relative velocity', r`Car A moves east at $12\ \mathrm{m\,s^{-1}}$ and car B moves north at $5\ \mathrm{m\,s^{-1}}$. Which are correct?`,
    [r`$\vec v_{BA} = \vec v_{AB}$`, r`$|\vec v_{BA}| = 13\ \mathrm{m\,s^{-1}}$`, r`$|\vec v_{AB}| = 13\ \mathrm{m\,s^{-1}}$`, r`$\vec v_{BA}$ points north of west at an angle $\tan^{-1}(5/12)$ to the west direction`], [1, 2, 3],
    r`$\vec v_{BA} = \vec v_B - \vec v_A = (-12, 5)$. Its size is 13. $\vec v_{AB} = -\vec v_{BA}$, same size, opposite direction, so (a) is false. $\vec v_{BA}$ points west and a bit north, with $\tan\alpha = 5/12$.`),
];

const groups = {
  m1: { title: 'Dot product, cross product and resultants',
    list1: ['A. $\\vec A\\cdot\\vec B$ when $\\vec A\\perp\\vec B$', 'B. $\\vec A\\cdot\\vec B$ when $\\vec A\\parallel\\vec B$ (same direction)', 'C. $|\\vec A + \\vec B|$ when $\\vec A\\parallel\\vec B$ (same direction)', 'D. $|\\vec A - \\vec B|$ when $\\vec A\\parallel\\vec B$ (same direction)'],
    list2: ['p. 7', 'q. 0', 'r. 1', 's. 12'] },
  m2: { title: 'A projectile',
    list1: ['A. Maximum height', 'B. Time of flight', 'C. Horizontal range', 'D. Speed at the highest point'],
    list2: ['p. 5 m', r`q. $17.3\ \mathrm{m\,s^{-1}}$`, 'r. 2 s', 's. 34.6 m'] },
  m3: { title: 'Circular motion with increasing speed',
    list1: ['A. Radial acceleration', 'B. Tangential acceleration', 'C. Angular speed', 'D. Angular acceleration'],
    list2: [r`p. $3\ \mathrm{rad\,s^{-1}}$`, r`q. $18\ \mathrm{m\,s^{-2}}$`, r`r. $1\ \mathrm{rad\,s^{-2}}$`, r`s. $2\ \mathrm{m\,s^{-2}}$`] },
  p1: { title: 'Crossing a river',
    passage: r`<p>A river 120 m wide flows at $3\ \mathrm{m\,s^{-1}}$. A boat can move at $5\ \mathrm{m\,s^{-1}}$ in still water.</p>` },
  p2: { title: 'A ball on a slope',
    passage: r`<p>A ball is projected from the foot $O$ of a smooth long incline of angle $30^\circ$ with speed $20\ \mathrm{m\,s^{-1}}$ at $60^\circ$ above the horizontal. The motion is in the vertical plane through the line of greatest slope, and the ball goes up the slope. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p3: { title: 'A speeding-up particle on a circle',
    passage: r`<p>A particle starts from rest on a circle of radius 5 m and speeds up with a constant tangential acceleration of $2\ \mathrm{m\,s^{-2}}$.</p>` },
};

// ---------- Passage items ----------
items.push(
  { id: nid(), type: 'nat', level: 2, format: 'passage', exams: EX[2], sub: 'relative velocity', group: 'p1',
    q: 'Find the minimum time to cross the river, in s.', answer: 24, tol: 0, unit: 's',
    sol: r`The time is least when the boat heads straight across: $t = d/v_b = 120/5 = 24$ s.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'relative velocity', group: 'p1',
    q: 'How far downstream is the boat carried if it crosses in this minimum time, in m?', answer: 72, tol: 0, unit: 'm',
    sol: r`Drift $= v_r\times t = 3\times24 = 72$ m.` },
  { id: nid(), type: 'mcq', level: 3, format: 'passage', exams: EX[3], sub: 'relative velocity', group: 'p1', answer: 1,
    q: 'To reach the point directly opposite, how long does the crossing take?',
    options: ['24 s', '30 s', '40 s', '48 s'],
    sol: r`The upstream component must be $3$: $5\sin\theta = 3$. The speed across is $5\cos\theta = 4\ \mathrm{m\,s^{-1}}$. Time $= 120/4 = 30$ s. (24 s is the minimum time and cannot reach the opposite point.)`, trap: 'Speed across is 4, not 5, when going straight across.' },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'projectile on incline', group: 'p2',
    q: 'Find the time of flight, in s (2 decimals).', answer: 2.31, tol: 0.02, unit: 's',
    sol: r`Perpendicular to the plane: launch component $20\sin30^\circ = 10$, and $g_\perp = 10\cos30^\circ = 8.66$. $T = 2\times10/8.66 = 2.31$ s.` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'projectile on incline', group: 'p2',
    q: 'Find the distance along the slope from $O$ to where it lands, in m (2 decimals).', answer: 26.67, tol: 0.05, unit: 'm',
    sol: r`Along the plane: launch component $20\cos30^\circ = 17.32$, and the retardation is $g\sin30^\circ = 5$. $R = 17.32\times2.309 - \tfrac12\times5\times2.309^2 = 40 - 13.33 = 26.67$ m.` },
  { id: nid(), type: 'mcq', level: 5, format: 'passage', exams: EX[5], sub: 'projectile on incline', group: 'p2', answer: 2,
    q: 'The greatest distance of the ball from the plane (measured perpendicular to it) is',
    options: ['2.89 m', '4.33 m', '5.77 m', '10 m'],
    sol: r`Perpendicular motion: $u_\perp = 10$ and $g_\perp = 8.66$, so the greatest distance $= u_\perp^2/2g_\perp = 100/17.32 = 5.77$ m. Using $g = 10$ instead of $g\cos30^\circ$ would wrongly give 5 m.`, trap: 'Use the perpendicular component of g.' },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'non-uniform circular motion', group: 'p3',
    q: 'Find the speed at $t = 5$ s, in $\\mathrm{m\\,s^{-1}}$.', answer: 10, tol: 0, unit: 'm/s',
    sol: r`$v = a_tt = 2\times5 = 10\ \mathrm{m\,s^{-1}}$.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'non-uniform circular motion', group: 'p3',
    q: 'Find the radial (centripetal) acceleration at $t = 5$ s, in $\\mathrm{m\\,s^{-2}}$.', answer: 20, tol: 0, unit: 'm/s²',
    sol: r`$a_r = v^2/r = 100/5 = 20\ \mathrm{m\,s^{-2}}$.` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'non-uniform circular motion', group: 'p3',
    q: 'At $t = 5$ s the net acceleration makes an angle with the radius. Find it, in degrees (2 decimals).', answer: 5.71, tol: 0.05, unit: '°',
    sol: r`The net acceleration has radial part 20 and tangential part 2, so $\tan\phi = a_t/a_r = 2/20 = 0.1$ and $\phi = 5.71^\circ$ from the radius. Early on (small $t$) the tangential part dominates; later the radial part takes over.` },
);

// ---------- Number templates ----------
const D = Math.PI / 180;
const gens = [
  { id: 'mp-g01', type: 'nat', level: 1, exams: EX[1], sub: 'vectors',
    make(rng) {
      const [a, b, R] = choose(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]);
      return { a, b, answer: R, tol: 0, unit: 'N',
        q: `Two forces of ${a} N and ${b} N act at right angles to each other at a point. Find the magnitude of the resultant, in N.`,
        sol: `For perpendicular vectors, R = √(${a}² + ${b}²) = √${a * a + b * b} = ${R} N.` };
    },
    verify: (p) => Math.round(Math.hypot(p.a, p.b)) },
  { id: 'mp-g02', type: 'nat', level: 2, exams: EX[2], sub: 'vectors',
    make(rng) {
      const P = pick(rng, 4, 12, 1), Q = pick(rng, 3, 12, 1), th = choose(rng, [60, 90, 120]);
      const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(th * D)); const answer = +R.toFixed(2);
      return { P, Q, th, answer, tol: 0.02, unit: 'units',
        q: `Two vectors of magnitudes ${P} and ${Q} act with an angle of ${th}° between them. Find the magnitude of their resultant (2 decimals).`,
        sol: `R² = P² + Q² + 2PQ cos θ = ${P * P} + ${Q * Q} + 2×${P}×${Q}×cos${th}° = ${fmt(R * R, 5)}. R = ${fmt(answer, 4)}.` };
    },
    verify: (p) => { const x = p.P + p.Q * Math.cos(p.th * D), y = p.Q * Math.sin(p.th * D); return Math.hypot(x, y); } },
  { id: 'mp-g03', type: 'nat', level: 2, exams: EX[2], sub: 'projectile motion',
    make(rng) {
      const u = choose(rng, [10, 20, 30, 40, 50]), th = choose(rng, [30, 45, 60]), ask = choose(rng, ['range', 'height', 'time']);
      const s = Math.sin(th * D), cs = Math.cos(th * D);
      const answer = +(ask === 'range' ? u * u * Math.sin(2 * th * D) / 10 : ask === 'height' ? (u * s) ** 2 / 20 : 2 * u * s / 10).toFixed(2);
      const unit = ask === 'range' || ask === 'height' ? 'm' : 's';
      const what = ask === 'range' ? 'horizontal range (m)' : ask === 'height' ? 'maximum height (m)' : 'time of flight (s)';
      return { u, th, ask, answer, tol: Math.max(0.02, answer * 0.005), unit,
        q: `A ball is thrown from level ground at ${u} m/s at ${th}° above the horizontal. Take g = 10 m/s². Find its ${what}, 2 decimals where needed.`,
        sol: ask === 'range' ? `R = u² sin2θ / g = ${u * u}×sin${2 * th}°/10 = ${fmt(answer, 4)} m.` : ask === 'height' ? `H = (u sinθ)²/(2g) = (${fmt(u * s, 4)})²/20 = ${fmt(answer, 4)} m.` : `T = 2u sinθ / g = 2×${u}×sin${th}°/10 = ${fmt(answer, 4)} s.` };
    },
    verify: (p) => { let t = 0, y = 0, vy = p.u * Math.sin(p.th * D), ymax = 0; const dt = 1e-5; let x = 0; const vx = p.u * Math.cos(p.th * D);
      while (true) { vy -= 10 * dt; y += vy * dt; x += vx * dt; t += dt; ymax = Math.max(ymax, y); if (y < 0) break; }
      return p.ask === 'range' ? x : p.ask === 'height' ? ymax : t; } },
  { id: 'mp-g04', type: 'nat', level: 2, exams: EX[2], sub: 'projectile from height',
    make(rng) {
      const t = int(rng, 2, 6), u = choose(rng, [5, 10, 15, 20, 25]), ask = choose(rng, ['range', 'speed']);
      const h = 5 * t * t, vy = 10 * t, answer = ask === 'range' ? u * t : +Math.hypot(u, vy).toFixed(2);
      return { t, u, h, vy, ask, answer, tol: ask === 'range' ? 0 : 0.05, unit: ask === 'range' ? 'm' : 'm/s',
        q: `A stone is thrown horizontally at ${u} m/s from the top of a ${h} m high cliff (g = 10 m/s²). Find the ${ask === 'range' ? 'horizontal distance from the foot of the cliff to where it lands (m)' : 'speed with which it hits the ground (m/s, 2 decimals)'}.`,
        sol: `Fall time: ${h} = 5t², so t = ${t} s. ${ask === 'range' ? `Horizontal distance = ${u}×${t} = ${answer} m.` : `Vertical speed = 10×${t} = ${vy}. Speed = √(${u}² + ${vy}²) = ${fmt(answer, 4)} m/s.`}` };
    },
    verify: (p) => p.ask === 'range' ? p.u * Math.sqrt(2 * p.h / 10) : Math.sqrt(p.u * p.u + 2 * 10 * p.h) },
  { id: 'mp-g05', type: 'nat', level: 3, exams: EX[3], sub: 'river crossing',
    make(rng) {
      const vb = choose(rng, [3, 4, 5, 6, 8]), vr = choose(rng, [2, 3, 4]), d = choose(rng, [60, 100, 120, 200]), ask = choose(rng, ['time', 'drift']);
      const t = d / vb, answer = ask === 'time' ? +t.toFixed(2) : +(vr * t).toFixed(2);
      return { vb, vr, d, ask, answer, tol: 0.02, unit: ask === 'time' ? 's' : 'm',
        q: `A boat with speed ${vb} m/s in still water is steered straight across a ${d} m wide river that flows at ${vr} m/s. Find the ${ask === 'time' ? 'time to cross (s)' : 'drift downstream (m)'}, 2 decimals.`,
        sol: `Time = d/v_b = ${d}/${vb} = ${fmt(t, 4)} s. ${ask === 'drift' ? `Drift = ${vr}×${fmt(t, 4)} = ${fmt(answer, 4)} m.` : ''}` };
    },
    verify: (p) => p.ask === 'time' ? p.d / p.vb : p.vr * p.d / p.vb },
  { id: 'mp-g06', type: 'nat', level: 3, exams: EX[3], sub: 'river crossing',
    make(rng) {
      const [vr, vb, w] = choose(rng, [[3, 5, 4], [6, 10, 8], [5, 13, 12], [7, 25, 24], [9, 15, 12], [4, 5, 3]]);
      const d = choose(rng, [60, 120, 240]);
      const t = d / w;
      return { vr, vb, w, d, answer: +t.toFixed(2), tol: 0.02, unit: 's',
        q: `A boat has a speed of ${vb} m/s in still water. It is steered so that it reaches the point directly opposite across a ${d} m wide river flowing at ${vr} m/s. How long does the crossing take (s, 2 decimals)?`,
        sol: `Upstream component must equal the current: ${vb} sinθ = ${vr}. The speed across is √(${vb}² − ${vr}²) = ${w} m/s. Time = ${d}/${w} = ${fmt(t, 4)} s.` };
    },
    verify: (p) => { const th = Math.asin(p.vr / p.vb); return p.d / (p.vb * Math.cos(th)); } },
  { id: 'mp-g07', type: 'mcq', level: 3, exams: EX[3], sub: 'rain and man',
    make(rng) {
      const u = pick(rng, 3, 12, 1), v = pick(rng, 3, 12, 1);
      const ang = Math.atan(u / v) / D;
      const o = numOpts(rng, ang, [Math.atan(v / u) / D, Math.min(89, 2 * ang), 45 + ang / 2, Math.atan((u + v) / v) / D], '°', 3);
      return { u, v, ang, options: o.options, answer: o.answer,
        q: `Rain falls vertically at ${v} m/s. A man walks on a level road at ${u} m/s. At what angle from the vertical should he hold his umbrella?`,
        sol: `Rain relative to the man has vertical part ${v} and horizontal part ${u}. tan φ = ${u}/${v}, so φ = ${fmt(ang, 3)}° from the vertical. The wrong values come from using v/u (angle from the horizontal), doubling the angle, or adding the speeds.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.ang, 3)} °`) },
  { id: 'mp-g08', type: 'nat', level: 3, exams: EX[3], sub: 'closest approach',
    make(rng) {
      const [a, b, s] = choose(rng, [[8, 6, 10], [6, 8, 10], [12, 5, 13], [5, 12, 13], [15, 8, 17], [4, 3, 5], [3, 4, 5]]);
      const d = choose(rng, [50, 100, 130, 170, 200]);
      const answer = +(d * a / s).toFixed(2);
      return { a, b, s, d, answer, tol: 0.02, unit: 'm',
        q: `Car A leaves the origin moving north at ${a} m/s. At that instant car B is ${d} m east of the origin, moving west at ${b} m/s. Find the least distance between the cars (m, 2 decimals).`,
        sol: `In A's frame, B starts at (${d}, 0) with velocity (−${b}, −${a}), speed ${s}. The least distance is d×a/s = ${d}×${a}/${s} = ${fmt(answer, 4)} m.` };
    },
    verify: (p) => { let m = 1e9; for (let t = 0; t < 100; t += 0.001) m = Math.min(m, Math.hypot(p.d - p.b * t, -p.a * t)); return m; } },
  { id: 'mp-g09', type: 'nat', level: 3, exams: EX[3], sub: 'non-uniform circular motion',
    make(rng) {
      const r = choose(rng, [1, 2, 4, 5]), at = choose(rng, [1, 2, 3, 4]), t = int(rng, 1, 4);
      const v = at * t, ar = v * v / r, answer = +Math.hypot(ar, at).toFixed(2);
      return { r, at, t, v, ar, answer, tol: 0.02, unit: 'm/s²',
        q: `A particle on a circle of radius ${r} m starts from rest and speeds up with a constant tangential acceleration of ${at} m/s². Find the magnitude of its total acceleration at t = ${t} s (m/s², 2 decimals).`,
        sol: `v = ${at}×${t} = ${v} m/s. Radial: v²/r = ${v * v}/${r} = ${fmt(ar, 4)}. Tangential = ${at}. Total = √(${fmt(ar, 4)}² + ${at}²) = ${fmt(answer, 4)} m/s².` };
    },
    verify: (p) => Math.sqrt((p.at * p.t) ** 4 / p.r ** 2 + p.at ** 2) },
  { id: 'mp-g10', type: 'nat', level: 2, exams: EX[2], sub: 'angular quantities',
    make(rng) {
      const n = choose(rng, [60, 120, 150, 300, 600]), r = choose(rng, [10, 20, 25, 40, 50]), ask = choose(rng, ['a', 'v']);
      const w = 2 * Math.PI * n / 60, answer = +(ask === 'a' ? w * w * r / 100 : w * r / 100).toFixed(2);
      return { n, r, ask, w, answer, tol: Math.max(0.02, answer * 0.01), unit: ask === 'a' ? 'm/s²' : 'm/s',
        q: `A wheel of radius ${r} cm turns at ${n} rpm. Find the ${ask === 'a' ? 'centripetal acceleration (m/s²)' : 'speed (m/s)'} of a point on its rim, 2 decimals.`,
        sol: `ω = 2π×${n}/60 = ${fmt(w, 4)} rad/s. Radius = ${r / 100} m. ${ask === 'a' ? `a = ω²r = ${fmt(w * w, 5)}×${r / 100} = ${fmt(answer, 4)} m/s².` : `v = ωr = ${fmt(w, 4)}×${r / 100} = ${fmt(answer, 4)} m/s.`}` };
    },
    verify: (p) => { const T = 60 / p.n; const v = 2 * Math.PI * (p.r / 100) / T; return p.ask === 'v' ? v : v * v / (p.r / 100); } },
  { id: 'mp-g11', type: 'nat', level: 4, exams: EX[4], sub: 'projectile on incline',
    make(rng) {
      const beta = choose(rng, [30, 37, 45]), alpha = choose(rng, [20, 30, 45, 60]), u = choose(rng, [10, 20, 30]);
      const th = beta + alpha; const g = 10;
      const answer = +(2 * u * u * Math.sin(alpha * D) * Math.cos(th * D) / (g * Math.cos(beta * D) ** 2)).toFixed(2);
      return { beta, alpha, u, th, answer, tol: Math.max(0.05, Math.abs(answer) * 0.01), unit: 'm',
        q: `A ball is projected up a smooth plane inclined at ${beta}° to the horizontal, with speed ${u} m/s at ${alpha}° above the plane, in the vertical plane containing the line of greatest slope (g = 10 m/s²). Find the distance along the plane from the launch point to where it lands (m, 2 decimals).`,
        sol: `Axes along and perpendicular to the plane. Perpendicular: launch ${fmt(u * Math.sin(alpha * D), 4)}, g⊥ = 10cos${beta}° = ${fmt(g * Math.cos(beta * D), 4)}. T = ${fmt(2 * u * Math.sin(alpha * D) / (g * Math.cos(beta * D)), 4)} s. Along the plane: launch ${fmt(u * Math.cos(alpha * D), 4)}, retardation 10 sin${beta}° = ${fmt(g * Math.sin(beta * D), 4)}. Distance = ${fmt(answer, 4)} m. (Negative would mean it lands below the launch point.)` };
    },
    verify: (p) => { const T = 2 * p.u * Math.sin(p.alpha * D) / (10 * Math.cos(p.beta * D)); return p.u * Math.cos(p.alpha * D) * T - 0.5 * 10 * Math.sin(p.beta * D) * T * T; } },
  { id: 'mp-g12', type: 'nat', level: 4, exams: EX[4], sub: 'projectile on incline',
    make(rng) {
      const u = choose(rng, [5, 10, 15, 20]), beta = choose(rng, [30, 37, 45, 53, 60]);
      const t = 2 * u * Math.tan(beta * D) / 10, answer = +(u * t / Math.cos(beta * D)).toFixed(2);
      return { u, beta, t, answer, tol: Math.max(0.05, answer * 0.005), unit: 'm',
        q: `A ball is thrown horizontally at ${u} m/s from the top of a long smooth slope that descends at ${beta}° to the horizontal (g = 10 m/s²). Find the distance along the slope from the throw point to where the ball first lands (m, 2 decimals).`,
        sol: `x = ${u}t and drop y = 5t². Landing: y/x = tan${beta}°, so t = 2u tan${beta}°/g = ${fmt(t, 4)} s. Distance along the slope = x/cos${beta}° = ${fmt(u * t, 4)}/cos${beta}° = ${fmt(answer, 4)} m.` };
    },
    verify: (p) => { let lo = 0, hi = 100; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (5 * m * m < p.u * m * Math.tan(p.beta * D)) lo = m; else hi = m; } return p.u * lo / Math.cos(p.beta * D); } },
  { id: 'mp-g13', type: 'nat', level: 3, exams: EX[3], sub: 'dot and cross product',
    make(rng) {
      let ax = int(rng, -5, 5), ay = int(rng, -5, 5), bx = int(rng, -5, 5), by = int(rng, -5, 5);
      if (ax === 0 && ay === 0) ax = 2; if (bx === 0 && by === 0) by = 3;
      const ask = choose(rng, ['dot', 'cross']);
      const answer = ask === 'dot' ? ax * bx + ay * by : Math.abs(ax * by - ay * bx);
      const v = (x, y) => `${x}î ${y < 0 ? '−' : '+'} ${Math.abs(y)}ĵ`;
      return { ax, ay, bx, by, ask, answer, tol: 0,
        q: ask === 'dot' ? `Find A·B for A = ${v(ax, ay)} and B = ${v(bx, by)}.` : `Find the magnitude of A × B for A = ${v(ax, ay)} and B = ${v(bx, by)}.`,
        sol: ask === 'dot' ? `A·B = AxBx + AyBy = (${ax})(${bx}) + (${ay})(${by}) = ${answer}.` : `|A × B| = |AxBy − AyBx| = |(${ax})(${by}) − (${ay})(${bx})| = ${answer}.` };
    },
    verify: (p) => { const A = Math.hypot(p.ax, p.ay), B = Math.hypot(p.bx, p.by); const d = p.ax * p.bx + p.ay * p.by; return p.ask === 'dot' ? d : Math.round(Math.sqrt(Math.max(0, A * A * B * B - d * d))); } },
  { id: 'mp-g14', type: 'nat', level: 4, exams: EX[4], sub: 'projectile from height',
    make(rng) {
      const vy = choose(rng, [10, 20, 30]), t = int(rng, 3, 8), h = 5 * t * t - vy * t;
      if (h <= 0) return gens[13].make(rng);
      const th = 30; const u = 2 * vy;
      return { vy, t, h, u, answer: t, tol: 0, unit: 's',
        q: `A stone is thrown at ${u} m/s at ${th}° above the horizontal from the edge of a ${h} m high cliff (g = 10 m/s²). After how many seconds does it reach the ground at the foot of the cliff?`,
        sol: `Vertical: y = ${vy}t − 5t² with y = −${h}. So 5t² − ${vy}t − ${h} = 0, i.e. t² − ${vy / 5}t − ${h / 5} = 0. The positive root is t = ${t} s.` };
    },
    verify: (p) => (p.vy + Math.sqrt(p.vy * p.vy + 20 * p.h)) / 10 },
  { id: 'mp-g15', type: 'nat', level: 4, exams: EX[4], sub: 'aircraft and wind',
    make(rng) {
      const [va, vw, vg] = choose(rng, [[5, 3, 4], [10, 6, 8], [13, 5, 12], [25, 7, 24], [17, 8, 15]]);
      const k = choose(rng, [20, 30, 40]), D1 = choose(rng, [240, 480, 720]);
      const A = va * k / 5 * 0 + va * k, W = vw * k, G = vg * k;
      const answer = +(D1 / G).toFixed(2);
      return { A, W, G, D1, answer, tol: 0.01, unit: 'h',
        q: `An aircraft has an airspeed of ${A} km/h and must fly due north to a town ${D1} km away. A steady wind blows towards the east at ${W} km/h. How long does the flight take (hours, 2 decimals)?`,
        sol: `The pilot heads west of north so that A sinφ = ${W}. Ground speed = √(${A}² − ${W}²) = ${G} km/h. Time = ${D1}/${G} = ${fmt(answer, 4)} h.` };
    },
    verify: (p) => p.D1 / Math.sqrt(p.A * p.A - p.W * p.W) },
  { id: 'mp-g16', type: 'nat', level: 3, exams: EX[3], sub: 'projectile from height',
    make(rng) {
      const t = int(rng, 2, 7), v = choose(rng, [40, 50, 60, 80, 100]), h = 5 * t * t;
      return { t, v, h, answer: v * t, tol: 0, unit: 'm',
        q: `A relief plane flies horizontally at ${v} m/s at a height of ${h} m and drops a packet (g = 10 m/s², ignore air). How far horizontally, in m, from the release point does the packet land?`,
        sol: `Fall time: ${h} = 5t², so t = ${t} s. Horizontal distance = ${v}×${t} = ${v * t} m. The packet is directly below the plane all along.` };
    },
    verify: (p) => p.v * Math.sqrt(2 * p.h / 10) },
  { id: 'mp-g17', type: 'nat', level: 4, exams: EX[4], sub: 'trajectory equation',
    make(rng) {
      const a = choose(rng, [0.5, 1, 1.5, 2, 3]), b = choose(rng, [0.01, 0.02, 0.025, 0.04, 0.05]), ask = choose(rng, ['range', 'height', 'speed']);
      const R = a / b, H = a * a / (4 * b), ux = Math.sqrt(10 / (2 * b)), u = ux * Math.sqrt(1 + a * a);
      const answer = +(ask === 'range' ? R : ask === 'height' ? H : u).toFixed(2);
      return { a, b, ask, answer, tol: Math.max(0.02, answer * 0.005), unit: ask === 'speed' ? 'm/s' : 'm',
        q: `The path of a projectile is y = ${a}x − ${b}x² (metres). Take g = 10 m/s². Find the ${ask === 'range' ? 'range (m)' : ask === 'height' ? 'maximum height (m)' : 'speed of projection (m/s)'}, 2 decimals.`,
        sol: `Compare y = x tanθ − g x²/(2u²cos²θ): tanθ = ${a}, 10/(2u²cos²θ) = ${b}. ${ask === 'range' ? `Range: set y = 0, x = ${a}/${b} = ${fmt(answer, 4)} m.` : ask === 'height' ? `The top is at x = ${a}/(2×${b}), giving y_max = a²/(4b) = ${a * a}/${fmt(4 * b, 3)} = ${fmt(answer, 4)} m.` : `u²cos²θ = 5/${b} = ${fmt(5 / b, 4)}, so u cosθ = ${fmt(ux, 4)}; u = u cosθ √(1 + tan²θ) = ${fmt(answer, 4)} m/s.`}` };
    },
    verify: (p) => { const ux = Math.sqrt(5 / p.b); if (p.ask === 'speed') { const th = Math.atan(p.a); return ux / Math.cos(th); } if (p.ask === 'range') return 2 * ux * (ux * p.a) / 10; const uy = ux * p.a; return uy * uy / 20; } },
  { id: 'mp-g18', type: 'mcq', level: 2, exams: EX[2], sub: 'projectile motion',
    make(rng) {
      const [t1, t2] = choose(rng, [[30, 60], [30, 45], [45, 60], [15, 30], [30, 90], [37, 53]]);
      const rr = Math.sin(t1 * D) ** 2 / Math.sin(t2 * D) ** 2;
      const rat = (x) => { for (let q = 1; q <= 12; q++) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-6 && Math.round(p) > 0) return [Math.round(p), q]; } return null; };
      const pq = rat(rr);
      if (!pq) return gens[17].make(rng);
      const txt = (a, b) => `${a} : ${b}`;
      const o = shuffleOpts(rng, txt(pq[0], pq[1]), [txt(pq[1], pq[0]), txt(pq[0] * 2, pq[1]), txt(pq[0], pq[1] * 2)]);
      return { t1, t2, pq, options: o.options, answer: o.answer,
        q: `Two balls are thrown with the same speed at ${t1}° and ${t2}° above the horizontal. What is the ratio of their maximum heights (first : second)?`,
        sol: `H = u² sin²θ / 2g, so H₁ : H₂ = sin²${t1}° : sin²${t2}° = ${pq[0]} : ${pq[1]}.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${p.pq[0]} : ${p.pq[1]}`) },
];

export default { topic: 'motion-plane', groups, items, gens };
