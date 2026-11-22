// Laws of motion: Plus Two entrance bank (original fibub questions).
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
const nid = () => `lm-${String(++k).padStart(3, '0')}`;
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
  mcq(1, 'Newton\'s laws', r`A passenger standing in a bus lurches forward when the driver brakes suddenly. This is explained by`, 'the first law (inertia)', ['the third law', 'the law of gravitation', 'conservation of energy'],
    r`The passenger's body tends to keep moving with the bus's old velocity while the bus slows down. A body resists any change in its state of motion: that is inertia, the first law.`),
  nat(1, 'Newton\'s laws', r`A net force of 20 N acts on a 5 kg block on a smooth floor. Find the acceleration (in $\mathrm{m\,s^{-2}}$).`, 4, 0,
    r`$a = F/m = 20/5 = 4\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  mcq(1, 'units', r`The SI unit of force, the newton, is the same as`, r`$\mathrm{kg\,m\,s^{-2}}$`, [r`$\mathrm{kg\,m\,s^{-1}}$`, r`$\mathrm{kg\,m^{2}\,s^{-2}}$`, r`$\mathrm{kg\,s^{-2}}$`],
    r`$F = ma$ gives $\mathrm{kg\times m\,s^{-2}}$. $\mathrm{kg\,m\,s^{-1}}$ is momentum and $\mathrm{kg\,m^2\,s^{-2}}$ is the joule.`),
  nat(1, 'weight', r`Find the weight of a 6 kg body on Earth (take $g = 10\ \mathrm{m\,s^{-2}}$), in N.`, 60, 0,
    r`$W = mg = 6\times10 = 60$ N.`, { unit: 'N' }),
  mcq(1, 'Newton\'s laws', r`The action and reaction forces of Newton's third law act on`, 'different bodies', ['the same body', 'either body, depending on the case', 'the heavier body only'],
    r`The two forces are equal and opposite but act on two different bodies, so they never cancel on one body.`),
  nat(1, 'momentum', r`Find the momentum of a 2 kg ball moving at $15\ \mathrm{m\,s^{-1}}$ (in $\mathrm{kg\,m\,s^{-1}}$).`, 30, 0,
    r`$p = mv = 2\times15 = 30$.`, { unit: 'kg m/s' }),
  mcq(1, 'friction', r`The force of friction between two surfaces in contact always`, 'opposes the relative motion (or its tendency) between the surfaces', ['acts along the direction of motion of the body', 'acts perpendicular to the surface', 'increases with the area of contact'],
    r`Friction acts along the surfaces and opposes the relative sliding (or attempted sliding). The force perpendicular to the surface is the normal reaction. Friction usually does not depend on area.`),
  nat(1, 'impulse', r`A force of 50 N acts on a body for 0.2 s. Find the impulse (in N s).`, 10, 0,
    r`Impulse $= F\Delta t = 50\times0.2 = 10$ N s.`, { unit: 'N s' }),
  mcq(1, 'friction', r`The coefficient of friction has`, 'no unit', ['the unit of force', 'the unit N/m', 'the unit of mass'],
    r`$\mu = f/N$ is a ratio of two forces, so it is a pure number.`),
  nat(1, 'spring force', r`A spring of constant $200\ \mathrm{N\,m^{-1}}$ is stretched by 5 cm. Find the force it exerts (in N).`, 10, 0,
    r`$F = kx = 200\times0.05 = 10$ N. Convert 5 cm to 0.05 m first.`, { unit: 'N', trap: 'Convert cm to m.' }),
  mcq(1, 'friction', r`Static friction between two surfaces`, r`adjusts itself up to a maximum value $\mu_sN$`, [r`is always equal to $\mu_sN$`, r`is always larger than kinetic friction by a fixed amount`, r`acts only when the body slides`],
    r`Static friction equals whatever force is needed to keep the body at rest, up to a limit of $\mu_sN$.`),
  nat(1, 'friction', r`A 10 kg block slides on a rough floor with $\mu_k = 0.2$. Take $g = 10\ \mathrm{m\,s^{-2}}$. Find the kinetic friction (in N).`, 20, 0,
    r`$f_k = \mu_kN = 0.2\times100 = 20$ N.`, { unit: 'N' }),
  mcq(1, 'Newton\'s laws', r`A book lies at rest on a table. The normal reaction on it and its weight are`, 'equal and opposite, but not an action–reaction pair', ['an action–reaction pair', 'unequal', 'equal in direction'],
    r`Both act on the book and balance it. The reaction to the weight is the Earth being pulled up by the book; the reaction to the normal force is the book pushing down on the table.`, { trap: 'The two forces on the same body are never a third-law pair.' }),

  // ---------- Level 2 ----------
  nat(2, 'Newton\'s laws', r`A 10 kg block is pulled on a smooth horizontal floor by a 50 N horizontal force. Find its acceleration (in $\mathrm{m\,s^{-2}}$).`, 5, 0,
    r`No friction, so the net force is 50 N. $a = 50/10 = 5\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(2, 'lift', r`A 60 kg person stands on a weighing machine in a lift that accelerates upward at $2\ \mathrm{m\,s^{-2}}$ ($g = 10\ \mathrm{m\,s^{-2}}$). What force does the machine show (in N)?`, 720, 0,
    r`$N - mg = ma$, so $N = m(g+a) = 60\times12 = 720$ N.`, { unit: 'N' }),
  mcq(2, 'lift', r`A person in a lift sees the reading of a weighing machine fall to zero. The lift must be`, 'in free fall', ['moving down at constant speed', 'at rest', 'moving up at constant speed'],
    r`$N = m(g - a)$ is zero only when $a = g$ downward: free fall. At constant speed (up or down) the reading is $mg$.`),
  nat(2, 'contact forces', r`Blocks of 2 kg and 3 kg touch each other on a smooth floor. A horizontal 10 N force pushes the 2 kg block towards the 3 kg block. Find the contact force between them (in N).`, 6, 0,
    r`Common acceleration $a = 10/5 = 2\ \mathrm{m\,s^{-2}}$. The contact force is the only horizontal force on the 3 kg block: $N = 3\times2 = 6$ N.`, { unit: 'N' }),
  nat(2, 'pulleys', r`Masses of 3 kg and 1 kg hang from the ends of a light string over a smooth fixed pulley (Atwood machine, $g = 10\ \mathrm{m\,s^{-2}}$). Find the acceleration (in $\mathrm{m\,s^{-2}}$).`, 5, 0,
    r`$a = \dfrac{(m_1 - m_2)g}{m_1+m_2} = \dfrac{2\times10}{4} = 5\ \mathrm{m\,s^{-2}}$. (The tension is $\dfrac{2m_1m_2g}{m_1+m_2} = 15$ N.)`, { unit: 'm/s²' }),
  nat(2, 'inclined plane', r`A block slides down a smooth incline of angle $30^\circ$. Find its acceleration (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, 5, 0,
    r`$a = g\sin\theta = 10\times0.5 = 5\ \mathrm{m\,s^{-2}}$. It does not depend on the mass.`, { unit: 'm/s²' }),
  nat(2, 'friction', r`A block just begins to slide when a rough plane is tilted to $30^\circ$. Find the coefficient of static friction (2 decimals).`, 0.58, 0.01,
    r`At the angle of repose $\tan\theta = \mu_s$. So $\mu_s = \tan30^\circ = 0.577\approx0.58$.`),
  nat(2, 'friction', r`A 5 kg block rests on a rough floor with $\mu_s = 0.4$ ($g = 10$). A horizontal push of 15 N is applied. Find the friction force on the block (in N).`, 15, 0,
    r`The maximum static friction is $0.4\times50 = 20$ N. The push (15 N) is less than that, so the block does not move, and friction exactly balances the push: 15 N (not 20).`, { unit: 'N', trap: 'Static friction equals the applied force, not $\\mu N$, until the limit.' }),
  nat(2, 'momentum conservation', r`A gun of mass 5 kg fires a bullet of mass 50 g at $300\ \mathrm{m\,s^{-1}}$. Find the recoil speed of the gun (in $\mathrm{m\,s^{-1}}$).`, 3, 0,
    r`Momentum before $= 0$. $5v = 0.05\times300 = 15$, so $v = 3\ \mathrm{m\,s^{-1}}$ backwards. Convert 50 g to 0.05 kg.`, { unit: 'm/s' }),
  nat(2, 'tension', r`A 4 kg block hangs from a string and is being lowered with a downward acceleration of $2\ \mathrm{m\,s^{-2}}$ ($g = 10$). Find the tension in the string (in N).`, 32, 0,
    r`Down is positive: $mg - T = ma$, so $T = m(g - a) = 4\times8 = 32$ N.`, { unit: 'N' }),
  nat(2, 'banking', r`A road is banked so that a car can go round a bend of radius 40 m at $20\ \mathrm{m\,s^{-1}}$ without needing any friction ($g = 10$). Find the angle of banking (in degrees).`, 45, 0,
    r`$\tan\theta = v^2/(rg) = 400/400 = 1$, so $\theta = 45^\circ$.`, { unit: '°' }),
  nat(2, 'circular motion dynamics', r`What is the maximum speed (in $\mathrm{m\,s^{-1}}$) at which a car can turn on a flat road of radius 20 m if $\mu_s = 0.5$ ($g = 10$)?`, 10, 0,
    r`Friction gives the centripetal force: $\mu mg = mv^2/r$. $v = \sqrt{\mu rg} = \sqrt{0.5\times20\times10} = 10\ \mathrm{m\,s^{-1}}$. The mass cancels.`, { unit: 'm/s' }),
  nat(2, 'circular motion dynamics', r`A 0.5 kg stone is whirled on a string in a horizontal circle of radius 2 m at $4\ \mathrm{m\,s^{-1}}$ on a smooth table. Find the tension (in N).`, 4, 0,
    r`The tension is the centripetal force: $T = mv^2/r = 0.5\times16/2 = 4$ N.`, { unit: 'N' }),
  nat(2, 'impulse', r`A 0.2 kg ball hits a wall at $10\ \mathrm{m\,s^{-1}}$ and rebounds at $10\ \mathrm{m\,s^{-1}}$ along the same line. Find the change in its momentum (in $\mathrm{kg\,m\,s^{-1}}$).`, 4, 0,
    r`Take the incoming direction as positive: $\Delta p = (-0.2\times10) - (0.2\times10) = -4$. Magnitude $= 4$. A common slip is to get 0 by ignoring the reversal of direction.`, { unit: 'kg m/s', trap: 'Velocity reverses: add the magnitudes.' }),
  nat(2, 'impulse', r`The ball in the previous situation (change of momentum $4\ \mathrm{kg\,m\,s^{-1}}$) is in contact with the wall for 0.01 s. Find the average force (in N).`, 400, 0,
    r`$F_{avg} = \Delta p/\Delta t = 4/0.01 = 400$ N.`, { unit: 'N' }),
  nat(2, 'pulleys', r`A 2 kg block on a smooth table is joined by a light string over a smooth pulley at the table's edge to a 3 kg block hanging vertically ($g = 10$). Find the acceleration (in $\mathrm{m\,s^{-2}}$).`, 6, 0,
    r`Treat the two blocks as one system along the string: $m_2g = (m_1+m_2)a$, so $a = 30/5 = 6\ \mathrm{m\,s^{-2}}$. (Tension $= m_1a = 12$ N, not 30 N.)`, { unit: 'm/s²', trap: 'The tension is less than the weight of the hanging block.' }),
  mcq(2, 'friction', r`Which is true about the coefficients of friction for two given surfaces?`, r`$\mu_k$ is usually smaller than $\mu_s$`, [r`$\mu_k$ is always larger than $\mu_s$`, r`$\mu_k = \mu_s$ always`, r`both depend on the area of contact`],
    r`It is harder to start a body sliding than to keep it sliding, so the limiting static friction is generally bigger than kinetic friction.`),
  nat(2, 'spring force', r`A 2 kg block hangs at rest from a spring of constant $200\ \mathrm{N\,m^{-1}}$ ($g = 10$). Find the extension (in m).`, 0.1, 0.001,
    r`In equilibrium $kx = mg$, so $x = 20/200 = 0.1$ m.`, { unit: 'm' }),
  nat(2, 'units', r`A force of 2 kgf (kilogram-force) is how many newtons? (Take $g = 9.8\ \mathrm{m\,s^{-2}}$.)`, 19.6, 0.05,
    r`1 kgf is the weight of 1 kg: $9.8$ N. So 2 kgf $= 19.6$ N.`, { unit: 'N', trap: 'Kilogram-force is a force, not a mass.' }),
  nat(2, 'lift', r`An elevator of mass 800 kg is accelerated upward at $1.5\ \mathrm{m\,s^{-2}}$ ($g = 9.8$). Find the tension in the cable (in N).`, 9040, 0,
    r`$T - mg = ma$, so $T = m(g + a) = 800\times11.3 = 9040$ N.`, { unit: 'N' }),
  nat(2, 'momentum conservation', r`A 3 kg trolley moving at $4\ \mathrm{m\,s^{-1}}$ collides with a stationary 1 kg trolley and they stick. Find their common speed (in $\mathrm{m\,s^{-1}}$).`, 3, 0,
    r`Momentum is conserved: $3\times4 = (3+1)v$, so $v = 3\ \mathrm{m\,s^{-1}}$. Kinetic energy is lost.`, { unit: 'm/s' }),
  nat(2, 'momentum conservation', r`A 6 kg body at rest explodes into two pieces of 2 kg and 4 kg. The 4 kg piece moves at $3\ \mathrm{m\,s^{-1}}$. Find the speed of the 2 kg piece (in $\mathrm{m\,s^{-1}}$).`, 6, 0,
    r`Total momentum stays zero: $2v = 4\times3$, so $v = 6\ \mathrm{m\,s^{-1}}$ in the opposite direction.`, { unit: 'm/s' }),
  nat(2, 'contact forces', r`Three blocks of 1 kg, 2 kg and 3 kg touch in a line on a smooth floor. A 12 N force pushes the 1 kg block. Find the force exerted by the 2 kg block on the 3 kg block (in N).`, 6, 0,
    r`$a = 12/6 = 2\ \mathrm{m\,s^{-2}}$. Only that force accelerates the 3 kg block: $F = 3\times2 = 6$ N.`, { unit: 'N' }),
  mcq(2, 'Newton\'s laws', r`A horse pulls a cart and the cart pulls the horse back with an equal force. Even so, the cart moves because`, 'the two forces act on different bodies, and the horse also pushes the ground', ['the horse pulls harder than the cart pulls back', 'action and reaction do not act at the same time', 'the cart has less mass'],
    r`The forces are always equal and opposite, but on different bodies. The cart moves because the net force on it (horse's pull minus friction) is forward. The horse moves because the ground pushes it forward.`),

  // ---------- Level 3 ----------
  nat(3, 'pulleys', r`A 3 kg block $A$ lies on a smooth table. A string from $A$ goes over a fixed pulley at the table's edge and then down round a light movable pulley, and its other end is fixed to the ceiling. A 3 kg block $B$ hangs from the movable pulley ($g = 10\ \mathrm{m\,s^{-2}}$). Find the acceleration of $A$ (in $\mathrm{m\,s^{-2}}$).`, 4, 0,
    r`Constraint: when $B$ falls by $x$, the string on both sides of the movable pulley lengthens by $x$, so $A$ moves $2x$: $a_A = 2a_B$. Forces: $T = m_Aa_A = 3\times2a_B = 6a_B$. For $B$ (the pulley is light, 2 strings pull up): $m_Bg - 2T = m_Ba_B$, i.e. $30 - 12a_B = 3a_B$, so $a_B = 2$ and $a_A = 4\ \mathrm{m\,s^{-2}}$. (The tension is 12 N.)`, { unit: 'm/s²', trap: 'The movable pulley makes the accelerations 2 : 1, and its load is held by two strings.' }),
  nat(3, 'pseudo force', r`A smooth wedge of angle $37^\circ$ ($\tan37^\circ = 3/4$) carries a small block on its face. The wedge is pushed horizontally with a constant acceleration $a$ so that the block stays at rest relative to the wedge. Find $a$ (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, 7.5, 0.01,
    r`In the wedge's frame the block has a pseudo force $ma$ horizontally (backwards), gravity $mg$ down and the normal reaction $N$ perpendicular to the face. Balance along the face: $ma\cos\theta = mg\sin\theta$, so $a = g\tan\theta = 10\times0.75 = 7.5\ \mathrm{m\,s^{-2}}$. The block's mass cancels.`, { unit: 'm/s²' }),
  nat(3, 'friction on blocks', r`A 2 kg block rests on a 4 kg block. The coefficient of friction between them is 0.3, and the floor is smooth. A horizontal force $F$ pulls the lower block. Find the largest $F$ for which the two move together without slipping (in N, $g = 10$).`, 18, 0,
    r`The top block's only horizontal force is friction, so its largest acceleration is $\mu g = 3\ \mathrm{m\,s^{-2}}$. For the pair: $F = (2+4)\times3 = 18$ N.`, { unit: 'N', trap: 'Use the total mass for the system but the top block for the friction limit.' }),
  nat(3, 'friction', r`A 5 kg block rests on a rough floor with $\mu = 0.75$ ($g = 10$). A pull $F$ at some angle above the horizontal moves it. Find the least force that can move the block (in N).`, 30, 0,
    r`Horizontal: $F\cos\phi = \mu N$; vertical: $N = mg - F\sin\phi$. So $F = \dfrac{\mu mg}{\cos\phi + \mu\sin\phi}$. The denominator is largest ($\sqrt{1+\mu^2} = 1.25$) when $\tan\phi = \mu$. So $F_{min} = \dfrac{0.75\times50}{1.25} = 30$ N, at $\phi = 36.9^\circ$ above the horizontal. A horizontal pull needs $37.5$ N.`, { unit: 'N', trap: 'A slightly upward pull needs less force than a horizontal one.' }),
  nat(3, 'inclined plane', r`A block slides down a rough incline of $30^\circ$ with $\mu_k = 0.5$ ($g = 10$). Find its acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 0.67, 0.01,
    r`Along the plane: $a = g\sin\theta - \mu g\cos\theta = 10\,(0.5 - 0.5\times0.866) = 0.67\ \mathrm{m\,s^{-2}}$. It slides because $\tan30^\circ = 0.577>0.5$.`, { unit: 'm/s²' }),
  nat(3, 'inclined plane', r`A 10 kg block is pushed up a rough $37^\circ$ incline at a constant speed by a force along the plane. $\mu = 0.5$, $\sin37^\circ = 0.6$, $g = 10$. Find the force (in N).`, 100, 0,
    r`Constant speed means zero net force. Along the plane (up): $F = mg\sin\theta + \mu mg\cos\theta = 100(0.6 + 0.5\times0.8) = 100$ N.`, { unit: 'N' }),
  nat(3, 'lift', r`A 50 kg person stands in a lift moving downward but slowing down at $2\ \mathrm{m\,s^{-2}}$ ($g = 10$). Find the reading of the weighing machine (in N).`, 600, 0,
    r`Moving down and slowing down means the acceleration is upward, $2\ \mathrm{m\,s^{-2}}$. $N = m(g + a) = 50\times12 = 600$ N.`, { unit: 'N', trap: 'Slowing while moving down means the acceleration points up.' }),
  nat(3, 'pseudo force', r`A small bob hangs from the roof of a train that accelerates at $7.5\ \mathrm{m\,s^{-2}}$ ($g = 10$). Find the angle the string makes with the vertical (in degrees, 1 decimal).`, 36.9, 0.1,
    r`In the train's frame the bob is at rest under tension, weight and a pseudo force $ma$ backwards. $\tan\theta = a/g = 0.75$, so $\theta = 36.9^\circ$, with the bob swung backwards.`, { unit: '°' }),
  nat(3, 'banking', r`A road is banked at $\tan\theta = 3/4$, with $\mu_s = 0.5$ between tyres and road. Find the maximum safe speed on a bend of radius 45 m (in $\mathrm{m\,s^{-1}}$, $g = 10$).`, 30, 0,
    r`At the maximum speed friction acts down the slope. $v^2 = rg\,\dfrac{\tan\theta + \mu}{1 - \mu\tan\theta} = 450\times\dfrac{1.25}{0.625} = 900$, so $v = 30\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'A bend that works without friction at $\\sqrt{rg\\tan\\theta} = 18.4\\ \\mathrm{m\\,s^{-1}}$ still allows more speed because of friction.' }),
  nat(3, 'circular motion dynamics', r`A conical pendulum has a string of length 1 m making an angle $37^\circ$ with the vertical ($\cos37^\circ = 0.8$, $g = 10$). Find its time period (in s, 2 decimals).`, 1.78, 0.01,
    r`Horizontal: $T\sin\theta = m\omega^2(L\sin\theta)$ gives $T = m\omega^2L$. Vertical: $T\cos\theta = mg$. So $\omega^2 = g/(L\cos\theta) = 12.5$ and the period $= 2\pi\sqrt{L\cos\theta/g} = 2\pi\sqrt{0.08} = 1.78$ s.`, { unit: 's' }),
  nat(3, 'circular motion dynamics', r`A 0.2 kg bob hangs on a conical pendulum string at $37^\circ$ to the vertical ($\cos37^\circ = 0.8$, $g = 10$). Find the tension (in N, 2 decimals).`, 2.5, 0.01,
    r`The vertical part carries the weight: $T\cos\theta = mg$, so $T = 2/0.8 = 2.5$ N.`, { unit: 'N' }),
  nat(3, 'vertical circle', r`A stone tied to a string of length 2 m is whirled in a vertical circle. What is the minimum speed at the lowest point so that the string stays taut all the way round (in $\mathrm{m\,s^{-1}}$, $g = 10$)?`, 10, 0,
    r`At the top the minimum speed is $\sqrt{gR}$. By energy, $v_{bottom}^2 = v_{top}^2 + 4gR = 5gR$. So $v_{bottom} = \sqrt{5\times10\times2} = 10\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'vertical circle', r`A 0.5 kg ball moves in a vertical circle of radius 1.8 m on a string. At the lowest point its speed is $6\ \mathrm{m\,s^{-1}}$. Find the string tension there (in N, $g = 10$).`, 15, 0,
    r`At the bottom the net force upward is the centripetal force: $T - mg = mv^2/R$. $T = 5 + 0.5\times36/1.8 = 5 + 10 = 15$ N.`, { unit: 'N' }),
  nat(3, 'impulse', r`A variable force $F = 6t$ (N) acts on a 3 kg body at rest. Find its speed at $t = 3$ s (in $\mathrm{m\,s^{-1}}$).`, 9, 0,
    r`Impulse $= \int_0^3 6t\,dt = 3t^2|_0^3 = 27$ N s. $mv = 27$, so $v = 9\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'momentum conservation', r`A 20 g bullet moving at $400\ \mathrm{m\,s^{-1}}$ embeds in a 1.98 kg block at rest on a smooth floor. Find the speed of the block with the bullet (in $\mathrm{m\,s^{-1}}$).`, 4, 0,
    r`Momentum: $0.02\times400 = (1.98 + 0.02)v$, so $v = 8/2 = 4\ \mathrm{m\,s^{-1}}$. (Convert 20 g to 0.02 kg.)`, { unit: 'm/s' }),
  nat(3, 'tension', r`A uniform rope of mass 4 kg and length 4 m lies on a smooth floor. A force of 20 N pulls one end along the rope. Find the tension at a point 1 m from the free end (in N).`, 5, 0,
    r`Acceleration $= 20/4 = 5\ \mathrm{m\,s^{-2}}$. The part beyond the point (1 m long, mass 1 kg) is accelerated by the tension: $T = 1\times5 = 5$ N. In general $T = F\,x/L$.`, { unit: 'N' }),
  nat(3, 'friction', r`A truck carries a 50 kg crate with $\mu = 0.4$ between them, for both static and kinetic friction ($g = 10$). The truck accelerates at $5\ \mathrm{m\,s^{-2}}$. Find the friction force on the crate (in N).`, 200, 0,
    r`The most friction can give is $0.4\times500 = 200$ N, giving the crate at most $4\ \mathrm{m\,s^{-2}}$. The truck needs $5$, so the crate slips. Once it slips, friction is the kinetic value, $\mu N = 200$ N.`, { unit: 'N', trap: 'First check if static friction is enough (it needs $ma = 250$ N).' }),
  nat(3, 'inclined plane', r`A block is released from rest at the top of a smooth $30^\circ$ incline 4 m long. How long does it take to reach the bottom (in s, 2 decimals, $g = 10$)?`, 1.26, 0.01,
    r`$a = g\sin30^\circ = 5$. $4 = \tfrac12\times5t^2$, so $t^2 = 1.6$ and $t = 1.26$ s.`, { unit: 's' }),
  nat(3, 'circular motion dynamics', r`A coin on a horizontal turntable starts to slip when the turntable spins fast. The coin is 20 cm from the axis and $\mu_s = 0.5$ ($g = 10$). Find the greatest angular speed without slipping (in rad/s).`, 5, 0,
    r`Friction supplies the centripetal force: $\mu mg = m\omega^2r$, so $\omega = \sqrt{\mu g/r} = \sqrt{0.5\times10/0.2} = 5$ rad/s.`, { unit: 'rad/s' }),
  nat(3, 'circular motion dynamics', r`A cyclist rounds a bend of radius 20 m at $10\ \mathrm{m\,s^{-1}}$ ($g = 10$). Find the angle he leans from the vertical (in degrees, 1 decimal).`, 26.6, 0.1,
    r`The resultant of the normal reaction and friction passes through the centre of mass. $\tan\theta = v^2/(rg) = 100/200 = 0.5$, so $\theta = 26.6^\circ$.`, { unit: '°' }),
  nat(3, 'mixed', r`A 0.2 kg ball dropped from 5 m hits the floor and bounces up to 1.25 m ($g = 10$). Find the magnitude of the impulse the floor gives the ball (in N s).`, 3, 0,
    r`Speed just before: $\sqrt{2\times10\times5} = 10$. Speed just after: $\sqrt{2\times10\times1.25} = 5$. Directions are opposite, so $\Delta p = 0.2(5 + 10) = 3$ N s (upward). The weight's own impulse during the very short contact is neglected.`, { unit: 'N s' }),
  nat(3, 'mixed', r`A car of mass 1000 kg moving at $20\ \mathrm{m\,s^{-1}}$ brakes with all four wheels locked on a road with $\mu_k = 0.5$ ($g = 10$). Find the stopping distance (in m).`, 40, 0,
    r`Deceleration $= \mu g = 5\ \mathrm{m\,s^{-2}}$. $s = v^2/2a = 400/10 = 40$ m. The mass cancels.`, { unit: 'm' }),
  mcq(3, 'friction', r`In a graph of friction force $f$ (vertical) against the applied force $F$ (horizontal) on a block that eventually slides, the curve is`, r`a line $f = F$ up to $\mu_sN$, then a drop to a constant $\mu_kN$`, [r`a line $f = F$ for all values of $F$`, r`a horizontal line at $\mu_sN$ throughout`, r`a line of slope $\mu$ through the origin throughout`],
    r`Static friction rises with the applied force ($f = F$) until the limit $\mu_sN$. After the block moves, friction is the kinetic value $\mu_kN$, which is slightly lower and constant (not growing with $F$).`, { trap: 'The drop after the peak is the sign that $\\mu_k<\\mu_s$.' }),
  mcq(3, 'springs', r`Two identical springs of constant $k$ are joined end to end and a force $F$ stretches the pair. The equivalent spring constant is`, r`$k/2$`, [r`$2k$`, r`$k$`, r`$k^2$`],
    r`In series each spring carries the same force $F$ and stretches by $F/k$, so the total stretch is $2F/k$, giving $k_{eq} = k/2$. (In parallel they would add to $2k$.)`),
  mcq(3, 'Newton\'s laws', r`A block of mass $m$ is pressed on a rough vertical wall by a horizontal force $F$. The block just stays at rest. The friction force on it is`, r`$mg$, upward`, [r`$\mu F$, upward`, r`$F$, upward`, r`$mg + F$`],
    r`Vertical balance: the friction balances the weight, $f = mg$. The value $\mu F$ is only the largest that friction could be. (If the block is at rest because of friction, $f = mg$ exactly.)`, { trap: 'At rest, friction equals the load it must carry, not $\\mu N$.' }),
  mcq(3, 'momentum conservation', r`Two bodies collide in an isolated system and stick together. Which quantity is NOT conserved?`, 'Total kinetic energy', ['Total linear momentum', 'Total energy including heat and sound', 'Momentum of the centre of mass'],
    r`In a perfectly inelastic collision the momentum is conserved, but some kinetic energy turns into heat, sound and deformation.`, { trap: 'Read "NOT conserved".' }),
  mcq(3, 'Newton\'s laws', r`A man of weight $W$ stands in a lift that is moving up with a constant speed. The force the floor exerts on him is`, r`$W$`, [r`more than $W$`, r`less than $W$`, 'zero'],
    r`Constant speed means zero acceleration, so the net force is zero and $N = W$, whether the lift moves up or down.`, { trap: 'Direction of velocity does not matter; only acceleration does.' }),
  mcq(3, 'inertial frames', r`Newton's laws are directly valid in`, 'a frame that moves at constant velocity relative to the distant stars', ['any frame', 'a frame accelerating relative to the stars', 'a frame rotating at constant speed'],
    r`These are inertial frames. In an accelerating or rotating frame one must add pseudo forces (like the centrifugal and Coriolis forces) for the laws to work.`),
  mcq(3, 'circular motion dynamics', r`A car moves with a constant speed round a flat circular track. The net force on the car`, 'points towards the centre and is directed by friction', ['points along the velocity', 'is zero because the speed is constant', 'points away from the centre'],
    r`The velocity changes direction, so there is a centripetal acceleration and a net force towards the centre, supplied by friction between tyres and road. "Centripetal force" is the name for this net force, not an extra force.`),
  nat(3, 'mixed', r`Two forces $\vec F_1 = (3\hat i + 4\hat j)$ N and $\vec F_2 = (-\hat i + 2\hat j)$ N act on a 2 kg particle. Find the magnitude of its acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 3.16, 0.01,
    r`Net force $= (2\hat i + 6\hat j)$ N, with magnitude $\sqrt{4 + 36} = \sqrt{40} = 6.32$ N. $a = 6.32/2 = 3.16\ \mathrm{m\,s^{-2}}$, in the direction of the net force.`, { unit: 'm/s²' }),
  nat(3, 'pulleys', r`A 2 kg block $A$ lies on a smooth $30^\circ$ incline and is joined by a light string over a smooth pulley at the top to a 4 kg block $B$ hanging vertically ($g = 10$). Find the acceleration of the blocks (in $\mathrm{m\,s^{-2}}$).`, 5, 0,
    r`Along the string: $m_Bg - m_Ag\sin30^\circ = (m_A + m_B)a$, so $a = (40 - 10)/6 = 5\ \mathrm{m\,s^{-2}}$. (Tension $= m_A(a + g\sin30^\circ) = 20$ N.)`, { unit: 'm/s²' }),

  // ---------- Level 4 ----------
  nat(4, 'inclined plane', r`A block is projected up a rough $37^\circ$ incline ($\sin37^\circ = 0.6$, $\mu = 0.5$) at $10\ \mathrm{m\,s^{-1}}$ ($g = 10$). It stops, then slides back down. Find its speed when it returns to the starting point (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 4.47, 0.02,
    r`Going up, friction acts down the slope: $a_{up} = g(\sin\theta + \mu\cos\theta) = 10(0.6 + 0.4) = 10$. Distance up $s = 100/20 = 5$ m. At the top, $\tan37^\circ = 0.75>0.5$, so it slides back with $a_{down} = g(\sin\theta - \mu\cos\theta) = 10(0.6 - 0.4) = 2$. Return speed $= \sqrt{2\times2\times5} = \sqrt{20} = 4.47\ \mathrm{m\,s^{-1}}$, much lower than 10 because friction removed energy.`, { unit: 'm/s', trap: 'Friction flips direction on the way down, so the two accelerations differ.' }),
  nat(4, 'spring force', r`Blocks of 1 kg (upper) and 2 kg (lower) are joined by a light spring. The upper block is hung from the ceiling by a string and everything is at rest. The string is cut. Find the acceleration of the upper block just after cutting (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, 30, 0,
    r`Before cutting, the spring is stretched and pulls the lower block up with $2g$ and the upper block down with $2g = 20$ N. The spring force cannot change at once. Just after the cut the upper block has its weight $10$ N and the spring force $20$ N both downward: $a = 30/1 = 30\ \mathrm{m\,s^{-2}}$ downward. The lower block still has zero net force, so $a = 0$.`, { unit: 'm/s²', trap: 'A spring force cannot change instantly, but a string tension can.' }),
  nat(4, 'pulleys', r`Blocks of 2 kg and 3 kg hang over a light pulley fixed to the roof of a lift accelerating upward at $2\ \mathrm{m\,s^{-2}}$ ($g = 10$). Find the tension in the string (in N, 1 decimal).`, 28.8, 0.05,
    r`In the lift's frame gravity is increased: $g_{eff} = g + a = 12$. Then $T = \dfrac{2m_1m_2g_{eff}}{m_1+m_2} = \dfrac{2\times2\times3\times12}{5} = 28.8$ N. (At rest in a still frame it would be 24 N.)`, { unit: 'N', trap: 'Add the lift acceleration to $g$ before using the Atwood formula.' }),
  nat(4, 'constraints', r`A uniform chain 3 m long lies on a smooth table with 1 m of it hanging over the edge. Find its acceleration at the moment it is released (in $\mathrm{m\,s^{-2}}$, 2 decimals, $g = 10$).`, 3.33, 0.02,
    r`The hanging part has weight $\lambda\times1\times g$ and the whole chain (mass $\lambda\times3$) moves together. $a = \dfrac{1\times\lambda g}{3\lambda} = g/3 = 3.33\ \mathrm{m\,s^{-2}}$. The acceleration grows as more of the chain hangs.`, { unit: 'm/s²' }),
  nat(4, 'circular motion dynamics', r`A small bead of mass $m$ moves in a horizontal circle on the smooth inner surface of a hemispherical bowl of radius 0.2 m. The line from the bowl's centre to the bead makes $60^\circ$ with the vertical. Find the angular speed of the bead (in rad/s, $g = 10$).`, 10, 0,
    r`Vertical: $N\cos60^\circ = mg$. Horizontal: $N\sin60^\circ = m\omega^2(R\sin60^\circ)$, so $N = m\omega^2R$. Then $m\omega^2R\cos60^\circ = mg$ and $\omega^2 = g/(R\cos60^\circ) = 10/0.1 = 100$, so $\omega = 10$ rad/s.`, { unit: 'rad/s', trap: 'The circle\'s radius is $R\\sin\\alpha$, but the height below the centre is $R\\cos\\alpha$.' }),
  nat(4, 'vertical circle', r`A small block slides without friction down a track and into a vertical loop of radius 2 m. From what least height above the bottom of the loop must it be released to just stay in contact at the top of the loop (in m)?`, 5, 0,
    r`At the top the minimum speed is $\sqrt{gR}$. Energy: $mgh = mg(2R) + \tfrac12m(gR)$, so $h = 2.5R = 5$ m.`, { unit: 'm', trap: 'It is 2.5R, not 2R: the block also needs kinetic energy at the top.' }),
  nat(4, 'banking', r`A road is banked at $45^\circ$ with $\mu_s = 0.5$ ($g = 10$). Find the minimum speed at which a car can take a bend of radius 30 m without sliding down (in $\mathrm{m\,s^{-1}}$).`, 10, 0,
    r`At the slowest speed friction acts up the slope: $v^2 = rg\,\dfrac{\tan\theta - \mu}{1 + \mu\tan\theta} = 300\times\dfrac{0.5}{1.5} = 100$, so $v = 10\ \mathrm{m\,s^{-1}}$. (The maximum is $\sqrt{300\times1.5/0.5} = 30\ \mathrm{m\,s^{-1}}$.)`, { unit: 'm/s', trap: 'Below the ideal speed, friction acts up the slope; above it, down.' }),
  nat(4, 'friction on blocks', r`A 1 kg block lies on a 2 kg plank, with $\mu = 0.4$ between them. The plank rests on a floor with $\mu = 0.1$. A horizontal force pulls the plank. Find the greatest force for which the block does not slip on the plank (in N, $g = 10$).`, 15, 0,
    r`The block's greatest acceleration is $\mu g = 4$. For the pair: $F - 0.1\times30 = 3\times4$, so $F = 12 + 3 = 15$ N. Note that the floor's friction acts on the plank, with normal force $(m+M)g$.`, { unit: 'N' }),
  nat(4, 'momentum conservation', r`A 50 kg man stands at one end of a 4 m long plank of mass 150 kg that floats on still water (no friction). He walks to the other end of the plank. By how many metres does the plank move relative to the water?`, 1, 0,
    r`The centre of mass of the system stays still. The man moves 4 m relative to the plank. If the plank moves $x$ the other way, $50(4 - x) = 150x$, so $x = 1$ m.`, { unit: 'm', trap: 'The man\'s 4 m is relative to the plank, not to the water.' }),
  nat(4, 'mixed', r`A 0.5 kg stone tied to a 1 m string is whirled in a horizontal circle at a height of 1.25 m above level ground at $8\ \mathrm{m\,s^{-1}}$. The string breaks. Find the horizontal distance from the point on the ground directly below the stone's release point to where the stone lands (in m, $g = 10$).`, 4, 0,
    r`After the string breaks, the stone flies off along the tangent at $8\ \mathrm{m\,s^{-1}}$. The fall time $= \sqrt{2\times1.25/10} = 0.5$ s. Distance $= 8\times0.5 = 4$ m.`, { unit: 'm', trap: 'Horizontal motion is along the tangent, not along the radius.' }),
  nat(4, 'circular motion dynamics', r`A person is pressed against the vertical wall of a rotor (a spinning drum) of radius 0.8 m. $\mu = 0.5$ between the person and the wall ($g = 10$). Find the least angular speed for which the person does not slide down (in rad/s).`, 5, 0,
    r`The wall's normal force is the centripetal force: $N = m\omega^2R$. Friction holds the weight: $\mu N\ge mg$. So $\omega^2\ge g/(\mu R) = 10/0.4 = 25$ and $\omega = 5$ rad/s.`, { unit: 'rad/s' }),
  msq(4, 'lift', r`A 60 kg person in a lift sees his weighing machine show 480 N ($g = 10\ \mathrm{m\,s^{-2}}$). Which of these could the lift be doing?`,
    [r`moving down and speeding up at $2\ \mathrm{m\,s^{-2}}$`, r`moving up and slowing down at $2\ \mathrm{m\,s^{-2}}$`, r`moving down and slowing down at $2\ \mathrm{m\,s^{-2}}$`, r`moving up at a steady $2\ \mathrm{m\,s^{-1}}$`], [0, 1],
    r`$N = 480 < mg = 600$, so the acceleration is downward: $a = (600 - 480)/60 = 2\ \mathrm{m\,s^{-2}}$ down. Moving down and speeding up (a) or moving up and slowing down (b) both have downward acceleration. Option (c) has upward acceleration ($N = 720$ N). Option (d) has zero acceleration ($N = 600$ N).`, { trap: 'Weight reading depends on the direction of acceleration, not of velocity.' }),
  msq(4, 'banking', r`A car takes a bend on a banked road at a speed higher than the ideal speed $\sqrt{rg\tan\theta}$, without skidding. Which are correct?`,
    ['Friction on the car acts down the slope', 'Friction on the car acts up the slope', r`The normal reaction is greater than $mg\cos\theta$`, 'The car has a net force of zero'], [0, 2],
    r`Above the ideal speed the car tends to slide outward and up, so friction acts down the slope. The radial equation then gives $N = mg\cos\theta + (mv^2/r)\sin\theta>mg\cos\theta$. The net force is the centripetal force, not zero.`),
  msq(4, 'vertical circle', r`A bob of mass $m$ on a string of length $R$ is given speed $u$ at the lowest point of a vertical circle. Which are correct?`,
    [r`If $u\ge\sqrt{5gR}$ it completes the circle`, r`At the top the tension is $mv^2/R - mg$`, r`If $u = \sqrt{5gR}$, the tension at the lowest point is $6mg$`, r`If $u = \sqrt{3gR}$, it passes the top with the string slack but still moves on a circle`], [0, 1, 2],
    r`(a) The condition for the string to stay taut at the top. (b) At the top both $T$ and $mg$ point down: $T + mg = mv^2/R$. (c) $T - mg = mu^2/R = 5mg$, so $T = 6mg$. (d) False: with $u^2 = 3gR$ the string goes slack at a point above the horizontal, and the bob leaves the circle and follows a projectile path.`),

  // ---------- Level 5 ----------
  nat(5, 'friction on blocks', r`A 1 kg block lies on a 2 kg plank. $\mu = 0.5$ between the block and the plank, and $\mu = 0.1$ between the plank and the floor. A horizontal force $F$ pulls the <b>block</b> (not the plank). Find the greatest $F$ for which the two move together without slipping (in N, $g = 10$).`, 6, 0,
    r`Together: $F - 0.1\times30 = 3a$. For the plank: the block's friction pulls it forward, $f - 3 = 2a$, with $f\le\mu mg = 5$. So $a\le1$. Then $F = 3a + 3 = 6$ N. If $F\le3$ N nothing moves at all.`, { unit: 'N', trap: 'Pulling the top block limits the plank\'s acceleration, which is far smaller than $\\mu g$.' }),
  nat(5, 'wedge and block', r`A block of mass 2 kg slides on the smooth $45^\circ$ face of a 3 kg wedge, which itself can slide on a smooth floor. Find the acceleration of the wedge (in $\mathrm{m\,s^{-2}}$, $g = 10$).`, 2.5, 0.01,
    r`Let the wedge accelerate at $A$. The block pushes the wedge with the normal force $N$ so $N\sin\theta = MA$. In the wedge's frame the block has pseudo force $mA$ (opposite) and its motion perpendicular to the face is zero: $N = mg\cos\theta + mA\sin\theta$. Solve: $A = \dfrac{mg\sin\theta\cos\theta}{M + m\sin^2\theta} = \dfrac{2\times10\times0.5}{3 + 1} = 2.5\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'The block is not at $g\\sin\\theta$ because the wedge moves away.' }),
  nat(5, 'vertical circle', r`A stone on a string of length 1.5 m is given a speed of $\sqrt{3gR}$ at the lowest point of a vertical circle ($R = 1.5$ m). It cannot complete the circle. At what height above the lowest point does the string become slack (in m)?`, 2, 0,
    r`Let the string go slack at an angle $\theta$ above the horizontal through the centre. Slack means $T = 0$: $mg\sin\theta = mv^2/R$, so $v^2 = gR\sin\theta$. Energy: $v^2 = u^2 - 2gR(1+\sin\theta) = 3gR - 2gR - 2gR\sin\theta$. So $gR\sin\theta = gR - 2gR\sin\theta$ and $\sin\theta = 1/3$. Height $= R(1 + \sin\theta) = \tfrac43R = 2$ m.`, { unit: 'm', trap: 'The string goes slack above the centre, not at the top.' }),
  nat(5, 'friction on inclines', r`A 4 kg block rests on a rough $53^\circ$ incline ($\sin53^\circ = 0.8$, $\mu_s = 0.5$, $g = 10$). A horizontal force $F$ pushes the block into the slope. Find the least $F$ that stops it sliding down (in N).`, 20, 0,
    r`Down the slope the block would otherwise slide, so friction acts up the slope. Along the slope: $F\cos\theta + f = mg\sin\theta$. Perpendicular: $N = mg\cos\theta + F\sin\theta$. At the limit $f = \mu N$: $F\cos\theta + \mu(mg\cos\theta + F\sin\theta) = mg\sin\theta$. $F(0.6 + 0.4) = 40(0.8 - 0.5\times0.6) = 20$, so $F = 20$ N.`, { unit: 'N', trap: 'The force also adds to the normal reaction through $F\\sin\\theta$.' }),
  msq(5, 'friction', r`A block of mass $m$ is pulled along a rough horizontal floor by a force $F$ at an angle $\phi$ above the horizontal (coefficient $\mu$). Which are correct?`,
    ['The normal reaction is less than $mg$', r`The kinetic friction is $\mu mg$`, r`The least force to keep it sliding is $\mu mg/\sqrt{1+\mu^2}$`, r`The force is least when $\tan\phi = \mu$`], [0, 2, 3],
    r`(a) $N = mg - F\sin\phi$. (b) False: friction is $\mu N$, not $\mu mg$. (c) and (d): $F = \mu mg/(\cos\phi + \mu\sin\phi)$ is least when $\tan\phi = \mu$, and its value is $\mu mg/\sqrt{1+\mu^2}$.`),
  msq(3, 'momentum conservation', r`Two bodies collide and stick together in an isolated system. Which are conserved?`, ['Total linear momentum', 'Total kinetic energy', 'Total energy including heat', 'The velocity of each body'], [0, 2],
    r`Momentum is conserved because there is no external force. Kinetic energy is partly converted into heat, but the total energy is conserved. Each velocity changes.`),
  msq(3, 'friction', r`A 10 kg block rests on a rough floor with $\mu_s = 0.5$ and $\mu_k = 0.4$ ($g = 10$). A horizontal 45 N force is applied. Which are correct?`,
    ['The block does not move', 'The friction force is 45 N', 'The friction force is 40 N', r`The acceleration is $0.5\ \mathrm{m\,s^{-2}}$`], [0, 1],
    r`The maximum static friction is $0.5\times100 = 50$ N, above 45 N. So the block does not move, friction is 45 N (equal to the push) and the acceleration is zero. The 40 N and $0.5\ \mathrm{m\,s^{-2}}$ would be the kinetic case, which does not arise.`, { trap: 'Only when F is greater than $\\mu_sN$ does kinetic friction take over.' }),
  msq(2, 'forces', r`Which of these are contact forces?`, ['Tension', 'Normal reaction', 'Friction', 'Weight', 'Spring force'], [0, 1, 2, 4],
    r`Tension, normal reaction, friction and spring force all need contact. Weight is a gravitational force acting at a distance (a field force).`),

  // ---------- Assertion-Reason ----------
  asrt(2, 'lift', r`A person in a lift that is accelerating downward feels lighter.`, r`The apparent weight is $m(g - a)$ for a downward acceleration $a$.`, 0,
    r`$N = m(g - a)<mg$, so the weighing machine shows less. R gives the formula and explains A.`),
  asrt(3, 'friction', r`The force of friction always acts opposite to the direction of motion of a body.`, r`Friction opposes the relative motion, or tendency of relative motion, between the surfaces in contact.`, 3,
    r`A is false: when you walk, the friction on your foot from the ground is forward. Also a crate on an accelerating truck is pulled forward by friction. R is the correct statement.`, { trap: '"Opposite to the motion" is the common slip; it is relative to the other surface.' }),
  asrt(3, 'Newton\'s laws', r`A horse cannot pull a cart because the cart pulls the horse back with an equal force.`, r`Action and reaction act on different bodies and so cannot cancel.`, 3,
    r`A is false: the cart does move. R is true, and it shows why A is wrong.`),
  asrt(3, 'friction', r`The angle of repose of a rough plane equals the angle of friction.`, r`At the angle of repose $\tan\theta = \mu_s$.`, 0,
    r`The angle of friction is defined by $\tan\lambda = \mu_s$. At repose the block is just about to slide, which gives $\tan\theta = \mu_s$. So they are equal, and R explains A.`),
  asrt(4, 'banking', r`On a smooth banked road a car and a heavy truck can both take a bend at the same speed.`, r`The ideal speed on a banked road is $\sqrt{rg\tan\theta}$, which is independent of the mass.`, 0,
    r`Both the weight and the needed centripetal force are proportional to the mass, so it cancels. R states the result, so it explains A.`),
  asrt(4, 'vertical circle', r`A stone whirled in a vertical circle on a string needs a speed of at least $\sqrt{gR}$ at the top.`, r`The string can only pull, so its tension cannot be negative.`, 0,
    r`At the top $T + mg = mv^2/R$. With $T\ge0$, $v^2\ge gR$. R is the reason.`),
  asrt(4, 'friction', r`The friction between two surfaces is larger if the area of contact is larger.`, r`The friction force is $\mu N$, which does not depend on the area of contact for ordinary surfaces.`, 3,
    r`A is false for dry rigid surfaces; the larger area spreads the same $N$. R is true.`, { trap: 'Wider tyres do not give more friction by area alone.' }),
  asrt(5, 'friction', r`When the horizontal force that presses a block against a rough wall is doubled, the friction on the block (which is at rest) also doubles.`, r`The limiting friction is $\mu N$.`, 3,
    r`While the block is at rest, friction equals its weight, which does not change. Doubling the push doubles the <i>limit</i> $\mu N$, not the friction. A is false. R is true.`, { trap: 'The limit of static friction changes; the friction needed does not.' }),
  asrt(5, 'pulleys', r`For a light smooth pulley the tension is the same on both sides of the string.`, r`If the pulley has mass, the tensions on the two sides differ even when the bearing is smooth.`, 1,
    r`A is true: the net torque on a massless pulley must be zero, so the tensions are equal. R is true too (a massive pulley needs a net torque to spin up), but it does not explain A.`),

  // ---------- Statements ----------
  stm(2, 'weight', r`The mass of a body is the same everywhere but its weight changes with place.`, r`The weight of a body is $mg$.`, 0,
    r`Both true: $g$ differs from place to place, so $mg$ changes while $m$ does not.`),
  stm(3, 'friction', r`The static friction on a body is always equal to $\mu_sN$.`, r`The kinetic friction is generally less than the maximum static friction.`, 3,
    r`I is false: static friction adjusts and is only $\mu_sN$ at the limit. II is true.`),
  stm(3, 'lift', r`A body in a freely falling lift feels weightless.`, r`The normal reaction on the body from the floor is zero in free fall.`, 0,
    r`Both true. $a = g$, so $N = m(g - a) = 0$. Gravity still acts, the body just does not press on anything.`),
  stm(3, 'circular motion dynamics', r`The net force on a body moving in a circle at a constant speed is directed towards the centre.`, r`Centripetal force is an extra force, additional to tension, gravity and friction.`, 2,
    r`I is true. II is false: centripetal force is not a new kind of force. It is the name for the net inward force made by the real forces.`),
  stm(4, 'pseudo force', r`A pseudo force is exerted on a body by another body.`, r`It is introduced so that Newton's laws can be used in an accelerating frame.`, 3,
    r`I is false: a pseudo force has no agent and no reaction partner. II is true.`),
  stm(4, 'banking', r`On a smooth banked road, a car at the ideal speed needs no friction.`, r`A car moving faster than the ideal speed tends to slide up the slope.`, 0,
    r`Both true: at $v = \sqrt{rg\tan\theta}$ the horizontal part of $N$ gives exactly the needed centripetal force. A faster car needs more, so it tends to move outward and up.`),
  stm(4, 'contact forces', r`Two blocks in contact on a smooth floor are pushed by a force $F$ on one of them. The contact force between them is less than $F$.`, r`The contact force only accelerates the second block.`, 0,
    r`Both true: the contact force $= m_2F/(m_1+m_2)<F$ and is the only horizontal force on the second block.`),
  mcq(5, 'concepts', r`How many are correct? (a) The tension is the same all along a massless string. (b) Friction can act in the direction of motion. (c) The normal reaction always equals $mg$. (d) The angle of repose depends on the mass. (e) Momentum is conserved in a perfectly inelastic collision of an isolated system.`, '3', ['2', '4', '5'],
    r`(a) true. (b) true: e.g. a crate on an accelerating truck. (c) false: e.g. on an incline $N = mg\cos\theta$. (d) false: $\tan\theta = \mu$. (e) true. Three are correct.`, { format: 'statements' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'Newton\'s laws', group: 'm1',
    q: 'Match each situation in List I with the law it illustrates in List II.',
    options: ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q', 'A-r, B-s, C-q, D-p'], answer: 0,
    sol: r`Dust falls off a beaten carpet because the dust keeps its state of rest: first law (r). Drawing the hands back lengthens the contact time, lowering $F = \Delta p/\Delta t$: second law (s). A walker pushes the ground back and the ground pushes him forward: third law (p). The recoil of a gun: conservation of momentum (q).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'lift', group: 'm2',
    q: r`A person of mass $m$ stands in a lift. Match the lift's state with the reading of the weighing machine.`,
    options: ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-s, B-p, C-q, D-r'], answer: 0,
    sol: r`At rest: $N = mg$ (s). Accelerating up at $g/2$: $N = m(g + g/2) = 1.5\,mg$ (r). Accelerating down at $g/2$: $N = 0.5\,mg$ (q). Free fall: $N = 0$ (p).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'circular motion dynamics', group: 'm3',
    q: 'Match each item in List I with its expression in List II.',
    options: ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-p, C-q, D-s'], answer: 1,
    sol: r`Flat road: $\mu mg = mv^2/r$ gives $\sqrt{\mu rg}$ (r). Ideal banking: $\sqrt{rg\tan\theta}$ (q). Conical pendulum period: $2\pi\sqrt{L\cos\theta/g}$ (p). Smallest speed at the top of a vertical circle: $\sqrt{rg}$ (s).` },
];

const groups = {
  m1: { title: 'Laws of motion in daily life',
    list1: ['A. Dust flies out of a carpet when it is beaten', 'B. A fielder draws his hands back while catching a fast ball', 'C. A person walks forward by pushing the ground backward', 'D. A gun recoils when it fires'],
    list2: ['p. Third law', 'q. Conservation of linear momentum', 'r. First law', 's. Second law (impulse)'] },
  m2: { title: 'Weighing in a lift',
    list1: ['A. Lift at rest', 'B. Lift accelerating up at $g/2$', 'C. Lift accelerating down at $g/2$', 'D. Lift in free fall'],
    list2: ['p. 0', 'q. $0.5\\,mg$', 'r. $1.5\\,mg$', 's. $mg$'] },
  m3: { title: 'Circular motion formulas',
    list1: ['A. Greatest speed on a flat road of radius $r$ (coefficient $\\mu$)', 'B. Speed for no friction on a bank of angle $\\theta$', 'C. Period of a conical pendulum of length $L$, half-angle $\\theta$', 'D. Least speed at the top of a vertical circle of radius $r$'],
    list2: [r`p. $2\pi\sqrt{L\cos\theta/g}$`, r`q. $\sqrt{rg\tan\theta}$`, r`r. $\sqrt{\mu rg}$`, r`s. $\sqrt{rg}$`] },
  p1: { title: 'Blocks on a table and a hanging mass',
    passage: r`<p>A 2 kg block lies on a rough horizontal table ($\mu_k = 0.2$ and $\mu_s = 0.2$). A light string joins it, over a smooth light pulley at the table's edge, to a 3 kg block that hangs vertically. The system is released. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p2: { title: 'A ball on a string in a vertical circle',
    passage: r`<p>A 0.2 kg ball tied to a light string of length 0.5 m moves in a vertical circle. At the lowest point its speed is $6\ \mathrm{m\,s^{-1}}$. Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  p3: { title: 'A ball bouncing off a wall',
    passage: r`<p>A 0.5 kg ball hits a smooth vertical wall at right angles with a speed of $10\ \mathrm{m\,s^{-1}}$ and rebounds along the same line at $6\ \mathrm{m\,s^{-1}}$. The contact lasts 0.02 s.</p>` },
};

items.push(
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'pulleys', group: 'p1',
    q: r`Find the acceleration of the blocks (in $\mathrm{m\,s^{-2}}$).`, answer: 5.2, tol: 0.02, unit: 'm/s²',
    sol: r`For the system along the string: $m_2g - \mu m_1g = (m_1+m_2)a$, so $a = (30 - 4)/5 = 5.2\ \mathrm{m\,s^{-2}}$.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'pulleys', group: 'p1',
    q: 'Find the tension in the string (in N).', answer: 14.4, tol: 0.05, unit: 'N',
    sol: r`For the table block: $T - \mu m_1g = m_1a$, so $T = 4 + 2\times5.2 = 14.4$ N. Check with the hanging block: $30 - T = 3\times5.2 = 15.6$, so $T = 14.4$. It is less than 30 N.`, trap: 'The tension is not equal to the weight of the hanging block.' },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'friction', group: 'p1', answer: 1,
    q: 'What is the least $\\mu_s$ with which the 2 kg block would stay at rest?',
    options: ['1.0', '1.5', '0.67', '3.0'],
    sol: r`The pull from the hanging block (as it is at rest, the tension is $m_2g = 30$ N) must be balanced by friction at most $\mu_s m_1g = 20\mu_s$. So $\mu_s\ge30/20 = 1.5$. Such a large value is rare but allowed.`, trap: 'Do not divide the other way: that gives 0.67.' },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'vertical circle', group: 'p2',
    q: r`Find the speed at the highest point (in $\mathrm{m\,s^{-1}}$).`, answer: 4, tol: 0, unit: 'm/s',
    sol: r`Energy: $v_{top}^2 = v_{bottom}^2 - 4gR = 36 - 4\times10\times0.5 = 16$, so $v_{top} = 4\ \mathrm{m\,s^{-1}}$. (It exceeds $\sqrt{gR} = 2.24$, so the string stays taut.)` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'vertical circle', group: 'p2',
    q: 'Find the tension at the highest point (in N).', answer: 4.4, tol: 0.02, unit: 'N',
    sol: r`At the top, $T + mg = mv^2/R$. $T = 0.2\times16/0.5 - 2 = 6.4 - 2 = 4.4$ N.` },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'vertical circle', group: 'p2', answer: 3,
    q: 'The tension at the lowest point exceeds the tension at the highest point by',
    options: ['2 N', '6 N', '8 N', '12 N'],
    sol: r`Bottom: $T = m(g + v^2/R) = 0.2(10 + 72) = 16.4$ N. Top: 4.4 N. The difference $= 12$ N $= 6mg$, always the same value for any speed if the circle is complete.`, trap: 'The difference of $6mg$ does not depend on the speed.' },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'impulse', group: 'p3',
    q: r`Find the change in momentum of the ball (in $\mathrm{kg\,m\,s^{-1}}$).`, answer: 8, tol: 0, unit: 'kg m/s',
    sol: r`Take the incoming direction as positive. $\Delta p = 0.5(-6) - 0.5(10) = -8$. The magnitude is 8.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'impulse', group: 'p3',
    q: 'Find the average force of the wall on the ball (in N).', answer: 400, tol: 0, unit: 'N',
    sol: r`$F = \Delta p/\Delta t = 8/0.02 = 400$ N, directed away from the wall.` },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'impulse', group: 'p3', answer: 0,
    q: 'The kinetic energy lost in the impact is',
    options: ['16 J', '8 J', '25 J', '9 J'],
    sol: r`Before: $\tfrac12\times0.5\times100 = 25$ J. After: $\tfrac12\times0.5\times36 = 9$ J. Lost $= 16$ J. The momentum changes because the wall (and Earth) supplies an external impulse, so momentum conservation of the ball alone does not apply.`, trap: 'The momentum change (8) is not the energy lost.' },
);

// ---------- Number templates ----------
const D = Math.PI / 180;
const gens = [
  { id: 'lm-g01', type: 'nat', level: 1, exams: EX[1], sub: 'Newton\'s laws',
    make(rng) {
      const m = int(rng, 2, 12), a = int(rng, 2, 9), ask = choose(rng, ['F', 'a']);
      const F = m * a;
      return { m, a, F, ask, answer: ask === 'F' ? F : a, tol: 0, unit: ask === 'F' ? 'N' : 'm/s²',
        q: ask === 'F' ? `A ${m} kg body on a smooth floor has an acceleration of ${a} m/s². Find the net force on it, in N.` : `A net force of ${F} N acts on a ${m} kg body. Find its acceleration, in m/s².`,
        sol: ask === 'F' ? `F = ma = ${m}×${a} = ${F} N.` : `a = F/m = ${F}/${m} = ${a} m/s².` };
    },
    verify: (p) => p.ask === 'F' ? p.m * p.a : p.F / p.m },
  { id: 'lm-g02', type: 'nat', level: 2, exams: EX[2], sub: 'lift',
    make(rng) {
      const m = choose(rng, [40, 50, 60, 70, 80]), a = choose(rng, [1, 1.5, 2, 2.5, 3]), up = choose(rng, [true, false]);
      const N = m * (up ? 10 + a : 10 - a);
      return { m, a, up, answer: N, tol: 0, unit: 'N',
        q: `A ${m} kg person stands on a weighing machine in a lift that accelerates ${up ? 'upward' : 'downward'} at ${a} m/s² (g = 10 m/s²). What force does the machine show, in N?`,
        sol: up ? `N − mg = ma, so N = m(g + a) = ${m}×${10 + a} = ${N} N.` : `mg − N = ma, so N = m(g − a) = ${m}×${10 - a} = ${N} N.` };
    },
    verify: (p) => p.m * 10 + (p.up ? 1 : -1) * p.m * p.a },
  { id: 'lm-g03', type: 'nat', level: 2, exams: EX[2], sub: 'contact forces',
    make(rng) {
      const m1 = int(rng, 1, 5), m2 = int(rng, 2, 6), a = int(rng, 1, 4), F = (m1 + m2) * a;
      return { m1, m2, a, F, answer: m2 * a, tol: 0, unit: 'N',
        q: `Blocks of ${m1} kg and ${m2} kg touch on a smooth floor. A horizontal force of ${F} N pushes the ${m1} kg block towards the ${m2} kg block. Find the contact force between the blocks, in N.`,
        sol: `Common acceleration a = ${F}/${m1 + m2} = ${a} m/s². The contact force is the only horizontal force on the ${m2} kg block: N = ${m2}×${a} = ${m2 * a} N.` };
    },
    verify: (p) => p.F * p.m2 / (p.m1 + p.m2) },
  { id: 'lm-g04', type: 'nat', level: 2, exams: EX[2], sub: 'pulleys',
    make(rng) {
      let m1 = int(rng, 2, 8), m2 = int(rng, 1, 7); if (m2 >= m1) m1 = m2 + int(rng, 1, 3);
      const ask = choose(rng, ['a', 'T']);
      const a = (m1 - m2) * 10 / (m1 + m2), T = 2 * m1 * m2 * 10 / (m1 + m2);
      const answer = +(ask === 'a' ? a : T).toFixed(2);
      return { m1, m2, ask, answer, tol: 0.02, unit: ask === 'a' ? 'm/s²' : 'N',
        q: `Masses of ${m1} kg and ${m2} kg hang from the two ends of a light string over a smooth fixed pulley (g = 10 m/s²). Find the ${ask === 'a' ? 'acceleration (m/s²)' : 'tension in the string (N)'}, 2 decimals.`,
        sol: ask === 'a' ? `a = (m₁ − m₂)g/(m₁ + m₂) = ${m1 - m2}×10/${m1 + m2} = ${fmt(answer, 4)} m/s².` : `T = 2m₁m₂g/(m₁ + m₂) = 2×${m1}×${m2}×10/${m1 + m2} = ${fmt(answer, 4)} N.` };
    },
    verify: (p) => { const a = (p.m1 * 10 - p.m2 * 10) / (p.m1 + p.m2); return p.ask === 'a' ? a : p.m2 * (10 + a); } },
  { id: 'lm-g05', type: 'nat', level: 3, exams: EX[3], sub: 'friction on inclines',
    make(rng) {
      const th = choose(rng, [30, 37, 45, 53]), mu = choose(rng, [0.1, 0.2, 0.25, 0.3]);
      const a = 10 * (Math.sin(th * D) - mu * Math.cos(th * D)); const answer = +a.toFixed(2);
      return { th, mu, answer, tol: 0.02, unit: 'm/s²',
        q: `A block slides down a rough incline of ${th}° with a coefficient of kinetic friction ${mu} (g = 10 m/s²). Find its acceleration, in m/s² (2 decimals).`,
        sol: `Along the plane: a = g sinθ − μ g cosθ = 10(${fmt(Math.sin(th * D), 4)} − ${mu}×${fmt(Math.cos(th * D), 4)}) = ${fmt(answer, 4)} m/s². (It slides because tan${th}° > ${mu}.)` };
    },
    verify: (p) => { const m = 3; const along = m * 10 * Math.sin(p.th * D), N = m * 10 * Math.cos(p.th * D); return (along - p.mu * N) / m; } },
  { id: 'lm-g06', type: 'nat', level: 3, exams: EX[3], sub: 'friction',
    make(rng) {
      const mu = choose(rng, [0.5, 0.75, 1, 1.5]), m = choose(rng, [4, 5, 8, 10]), ask = choose(rng, ['F', 'angle']);
      const F = mu * m * 10 / Math.sqrt(1 + mu * mu), ang = Math.atan(mu) / D;
      const answer = +(ask === 'F' ? F : ang).toFixed(2);
      return { mu, m, ask, answer, tol: ask === 'F' ? 0.02 : 0.05, unit: ask === 'F' ? 'N' : '°',
        q: `A ${m} kg block lies on a rough floor with μ = ${mu} (g = 10 m/s²). It is pulled by a force at an angle above the horizontal. Find the ${ask === 'F' ? 'least force that can make it slide (N)' : 'angle above the horizontal (degrees) at which the force needed is least'}, 2 decimals.`,
        sol: `F = μmg/(cosφ + μ sinφ). The denominator is largest, √(1 + μ²) = ${fmt(Math.sqrt(1 + mu * mu), 4)}, at tanφ = μ. ${ask === 'F' ? `F_min = ${mu}×${m * 10}/${fmt(Math.sqrt(1 + mu * mu), 4)} = ${fmt(answer, 4)} N.` : `φ = tan⁻¹(${mu}) = ${fmt(answer, 4)}°.`}` };
    },
    verify: (p) => { let best = 1e9, bp = 0; for (let f = 0; f < 90; f += 0.001) { const F = p.mu * p.m * 10 / (Math.cos(f * D) + p.mu * Math.sin(f * D)); if (F < best) { best = F; bp = f; } } return p.ask === 'F' ? best : bp; } },
  { id: 'lm-g07', type: 'nat', level: 3, exams: EX[3], sub: 'banking',
    make(rng) {
      const [r, t, v] = choose(rng, [[40, 1, 20], [40, 0.25, 10], [160, 0.25, 20], [90, 1, 30], [50, 0.2, 10], [20, 0.5, 10]]);
      const answer = +(Math.atan(t) / D).toFixed(2);
      return { r, t, v, answer, tol: 0.05, unit: '°',
        q: `A car takes a bend of radius ${r} m at ${v} m/s with no help from friction (g = 10 m/s²). Find the angle of banking, in degrees (2 decimals).`,
        sol: `tanθ = v²/(rg) = ${v * v}/${r * 10} = ${fmt(t, 3)}, so θ = ${fmt(answer, 4)}°.` };
    },
    verify: (p) => Math.atan(p.v * p.v / (p.r * 10)) / D },
  { id: 'lm-g08', type: 'nat', level: 3, exams: EX[3], sub: 'vertical circle',
    make(rng) {
      const m = choose(rng, [0.2, 0.5, 1, 2]), R = choose(rng, [0.5, 1, 1.5, 2]), v = choose(rng, [6, 7, 8, 9, 10]), pos = choose(rng, ['lowest', 'highest']);
      const vt2 = v * v - 40 * R;
      if (vt2 < 10 * R) return gens[7].make(rng);
      const T = pos === 'lowest' ? m * (10 + v * v / R) : m * (vt2 / R - 10);
      return { m, R, v, pos, answer: +T.toFixed(2), tol: 0.02, unit: 'N',
        q: `A ${m} kg ball on a light string of length ${R} m is whirled in a vertical circle. Its speed at the lowest point is ${v} m/s (g = 10 m/s²). Find the tension in the string at the ${pos} point, in N (2 decimals).`,
        sol: pos === 'lowest' ? `T − mg = mv²/R, so T = m(g + v²/R) = ${m}(10 + ${v * v}/${R}) = ${fmt(T, 4)} N.` : `Energy: v_top² = ${v * v} − 4×10×${R} = ${fmt(vt2, 4)}. At the top T + mg = mv²/R, so T = ${m}(${fmt(vt2, 4)}/${R} − 10) = ${fmt(T, 4)} N.` };
    },
    verify: (p) => { const g = 10; const vt2 = p.v * p.v - 4 * g * p.R; return p.pos === 'lowest' ? p.m * g + p.m * p.v * p.v / p.R : p.m * vt2 / p.R - p.m * g; } },
  { id: 'lm-g09', type: 'nat', level: 3, exams: EX[3], sub: 'circular motion dynamics',
    make(rng) {
      const L = choose(rng, [0.5, 1, 1.5, 2]), th = choose(rng, [30, 37, 45, 53, 60]), ask = choose(rng, ['T', 'omega']);
      const w = Math.sqrt(10 / (L * Math.cos(th * D))), P = 2 * Math.PI / w;
      const answer = +(ask === 'T' ? P : w).toFixed(2);
      return { L, th, ask, answer, tol: 0.02, unit: ask === 'T' ? 's' : 'rad/s',
        q: `A conical pendulum has a string of length ${L} m making ${th}° with the vertical (g = 10 m/s²). Find its ${ask === 'T' ? 'time period (s)' : 'angular speed (rad/s)'}, 2 decimals.`,
        sol: `T sinθ = mω²(L sinθ) and T cosθ = mg, so ω² = g/(L cosθ) = 10/(${L}×${fmt(Math.cos(th * D), 4)}) = ${fmt(w * w, 4)}. ω = ${fmt(w, 4)} rad/s${ask === 'T' ? `, so the period = 2π/ω = ${fmt(P, 4)} s.` : '.'}` };
    },
    verify: (p) => { let w = 1; for (let i = 0; i < 200; i++) { const r = p.L * Math.sin(p.th * D); w = Math.sqrt(10 * Math.tan(p.th * D) / r); } return p.ask === 'T' ? 2 * Math.PI / w : w; } },
  { id: 'lm-g10', type: 'nat', level: 2, exams: EX[2], sub: 'momentum conservation',
    make(rng) {
      const m = choose(rng, [10, 20, 25, 50]), u = choose(rng, [200, 300, 400, 500]), M = choose(rng, [0.99, 1.98, 2.475, 4.95, 9.95]);
      const mk = m / 1000, v = mk * u / (mk + M);
      return { m, u, M, answer: +v.toFixed(3), tol: 0.01, unit: 'm/s',
        q: `A ${m} g bullet moving at ${u} m/s embeds in a ${M} kg block at rest on a smooth floor. Find the speed of the block with the bullet, in m/s (2 decimals).`,
        sol: `Momentum is conserved: ${mk}×${u} = (${M} + ${mk})v, so v = ${fmt(mk * u, 4)}/${fmt(M + mk, 4)} = ${fmt(v, 4)} m/s. Convert grams to kg first.` };
    },
    verify: (p) => (p.m / 1000) * p.u / (p.m / 1000 + p.M) },
  { id: 'lm-g11', type: 'nat', level: 4, exams: EX[4], sub: 'friction on blocks',
    make(rng) {
      const m = int(rng, 1, 4), M = int(rng, 2, 6), mu1 = choose(rng, [0.2, 0.3, 0.4, 0.5]), mu2 = choose(rng, [0, 0.1, 0.2]);
      const F = (m + M) * (mu1 + mu2) * 10;
      return { m, M, mu1, mu2, answer: +F.toFixed(2), tol: 0.02, unit: 'N',
        q: `A ${m} kg block lies on a ${M} kg plank. μ between block and plank is ${mu1}; between plank and floor it is ${mu2}${mu2 === 0 ? ' (smooth)' : ''}. A horizontal force pulls the plank. Find the greatest force for which the block does not slip on the plank, in N (g = 10).`,
        sol: `The block's greatest acceleration is μg = ${mu1}×10 = ${mu1 * 10} m/s². For the pair: F − ${mu2}×${(m + M) * 10} = ${m + M}×${mu1 * 10}, so F = ${fmt(F, 4)} N.` };
    },
    verify: (p) => { const a = p.mu1 * 10; return (p.m + p.M) * a + p.mu2 * (p.m + p.M) * 10; } },
  { id: 'lm-g12', type: 'nat', level: 4, exams: EX[4], sub: 'pulleys',
    make(rng) {
      const m1 = int(rng, 1, 5), m2 = int(rng, 1, 8), ask = choose(rng, ['a', 'T']);
      const a2 = m2 * 10 / (4 * m1 + m2), a1 = 2 * a2, T = m1 * a1;
      const answer = +(ask === 'a' ? a1 : T).toFixed(2);
      return { m1, m2, ask, answer, tol: 0.02, unit: ask === 'a' ? 'm/s²' : 'N',
        q: `A ${m1} kg block A lies on a smooth table. A string from A goes over a fixed pulley at the table's edge, down round a light movable pulley that carries a ${m2} kg block B, and up to a fixed point on the ceiling (g = 10 m/s²). Find the ${ask === 'a' ? 'acceleration of A (m/s²)' : 'tension in the string (N)'}, 2 decimals.`,
        sol: `Constraint: a_A = 2a_B. T = ${m1}a_A = ${2 * m1}a_B and ${m2}g − 2T = ${m2}a_B, so ${m2 * 10} − ${4 * m1}a_B = ${m2}a_B, giving a_B = ${fmt(a2, 4)}. a_A = ${fmt(a1, 4)} m/s², T = ${fmt(T, 4)} N.` };
    },
    verify: (p) => { const a2 = p.m2 * 10 / (4 * p.m1 + p.m2); return p.ask === 'a' ? 2 * a2 : p.m1 * 2 * a2; } },
  { id: 'lm-g13', type: 'nat', level: 3, exams: EX[3], sub: 'circular motion dynamics',
    make(rng) {
      const mu = choose(rng, [0.2, 0.4, 0.5, 0.8]), r = choose(rng, [20, 25, 40, 50, 90, 100]);
      const v = Math.sqrt(mu * r * 10);
      return { mu, r, answer: +v.toFixed(2), tol: 0.02, unit: 'm/s',
        q: `A car turns on a flat road of radius ${r} m. The coefficient of static friction is ${mu} (g = 10 m/s²). Find the greatest speed without skidding, in m/s (2 decimals).`,
        sol: `Friction gives the centripetal force: μmg = mv²/r, so v = √(μrg) = √(${mu}×${r}×10) = √${fmt(mu * r * 10, 4)} = ${fmt(v, 4)} m/s.` };
    },
    verify: (p) => Math.sqrt(p.mu * p.r * 10) },
  { id: 'lm-g14', type: 'nat', level: 2, exams: EX[2], sub: 'impulse',
    make(rng) {
      const m = choose(rng, [0.15, 0.2, 0.5, 1]), u = choose(rng, [5, 10, 15, 20]), v = choose(rng, [5, 8, 10, 12]), t = choose(rng, [0.01, 0.02, 0.05, 0.1]);
      const dp = m * (u + v), F = dp / t;
      return { m, u, v, t, answer: +F.toFixed(2), tol: Math.max(0.02, F * 0.005), unit: 'N',
        q: `A ${m} kg ball hits a wall at right angles at ${u} m/s and rebounds along the same line at ${v} m/s. The contact lasts ${t} s. Find the average force of the wall on the ball, in N.`,
        sol: `Take the incoming direction as positive: Δp = m(−v) − m(u) = −${fmt(dp, 4)}. Magnitude ${fmt(dp, 4)} kg m/s. F = Δp/Δt = ${fmt(dp, 4)}/${t} = ${fmt(F, 4)} N.` };
    },
    verify: (p) => (p.m * p.v - (-p.m * p.u)) / p.t },
  { id: 'lm-g15', type: 'nat', level: 3, exams: EX[3], sub: 'friction',
    make(rng) {
      const v = choose(rng, [10, 15, 20, 25, 30]), mu = choose(rng, [0.4, 0.5, 0.6, 0.8]);
      const s = v * v / (2 * mu * 10);
      return { v, mu, answer: +s.toFixed(2), tol: 0.02, unit: 'm',
        q: `A car moving at ${v} m/s brakes with all wheels locked on a road with μ_k = ${mu} (g = 10 m/s²). Find its stopping distance, in m (2 decimals).`,
        sol: `Deceleration = μg = ${mu * 10} m/s². s = v²/(2a) = ${v * v}/${2 * mu * 10} = ${fmt(s, 4)} m. The mass cancels.` };
    },
    verify: (p) => { const a = p.mu * 10; const t = p.v / a; return p.v * t - 0.5 * a * t * t; } },
  { id: 'lm-g16', type: 'nat', level: 4, exams: EX[4], sub: 'banking',
    make(rng) {
      const [t, mu, r] = choose(rng, [[0.75, 0.5, 45], [0.75, 0.5, 5], [0.75, 0.5, 20], [1, 0.5, 30], [1, 0.5, 120], [1, 0.5, 3]]);
      const v2 = r * 10 * (t + mu) / (1 - mu * t);
      return { t, mu, r, answer: +Math.sqrt(v2).toFixed(2), tol: 0.02, unit: 'm/s',
        q: `A road is banked with tanθ = ${t}. The coefficient of friction between tyres and road is ${mu}. Find the greatest speed for a bend of radius ${r} m, in m/s (g = 10, 2 decimals).`,
        sol: `v² = rg (tanθ + μ)/(1 − μ tanθ) = ${r * 10}×${fmt(t + mu, 4)}/${fmt(1 - mu * t, 4)} = ${fmt(v2, 5)}, so v = ${fmt(Math.sqrt(v2), 4)} m/s.` };
    },
    verify: (p) => { let lo = 0, hi = 200; const f = (v) => { const th = Math.atan(p.t), N = (10 * Math.cos(th) + v * v / p.r * Math.sin(th)); const fr = v * v / p.r * Math.cos(th) - 10 * Math.sin(th); return fr - p.mu * N; }; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } return lo; } },
  { id: 'lm-g17', type: 'nat', level: 2, exams: EX[2], sub: 'spring force',
    make(rng) {
      const k = choose(rng, [100, 200, 250, 400, 500]), m = choose(rng, [0.5, 1, 2, 2.5, 4]);
      const x = m * 10 / k;
      return { k, m, answer: +(x * 100).toFixed(2), tol: 0.02, unit: 'cm',
        q: `A ${m} kg block hangs at rest from a spring of constant ${k} N/m (g = 10 m/s²). Find the extension of the spring in cm.`,
        sol: `kx = mg, so x = ${m * 10}/${k} = ${fmt(x, 4)} m = ${fmt(x * 100, 4)} cm.` };
    },
    verify: (p) => p.m * 10 / p.k * 100 },
  { id: 'lm-g18', type: 'mcq', level: 3, exams: EX[3], sub: 'lift',
    make(rng) {
      const m = choose(rng, [40, 50, 60, 80]), a = choose(rng, [1, 2, 2.5, 4]), mode = choose(rng, [['up', 'speeding up', 1], ['down', 'slowing down', 1], ['down', 'speeding up', -1], ['up', 'slowing down', -1]]);
      const N = m * 10 + mode[2] * m * a;
      const wr = [m * 10 - mode[2] * m * a, m * 10, m * a, m * (10 + a)].filter((x) => x !== N);
      const o = numOpts(rng, N, wr, 'N', 4);
      return { m, a, mode, N, options: o.options, answer: o.answer,
        q: `A ${m} kg person stands on a weighing machine in a lift that is moving ${mode[0]} and ${mode[1]} at ${a} m/s² (g = 10 m/s²). The reading of the machine is`,
        sol: `Moving ${mode[0]} and ${mode[1]} means the acceleration is ${mode[2] > 0 ? 'upward' : 'downward'}. So N = m(g ${mode[2] > 0 ? '+' : '−'} a) = ${m}×${10 + mode[2] * a} = ${fmt(N, 4)} N. The other options use the wrong direction of acceleration or ignore the weight.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.N, 4)} N`) },
];

{ // ===== extension block (added 2026-11-22): harder items, new formats and templates =====
const r = String.raw;
const CUET = false; const PFX = 'lm'; const GN = 18;
const F = (x, s = 3) => String(+Number(x).toPrecision(s));
const XEB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xe = (l, type) => (CUET && type === 'mcq' && l <= 3 ? [...XEB[l], 'cuet'] : XEB[l]);
let xk = 0; let xc = 0;
const xb = (l, sub, o) => ({ id: `${PFX}-x${String(++xk).padStart(3, '0')}`, level: l, sub, ...o, exams: xe(l, o.type) });
const m = (l, sub, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o }); };
const n = (l, sub, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o }); };
const s = (l, sub, q, options, answer, sol, o = {}) => xb(l, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const a = (l, sub, A, R, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AO, answer, sol, ...o });
const SO = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const t = (l, sub, I, II, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SO, answer, sol, ...o });
// "how many of these are correct": list = 4 statements, k = how many are correct (1-4)
const cn = (l, sub, q, list, k, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x}`).join('<br>')}`, options: ['Only one', 'Only two', 'Only three', 'All four'], answer: k - 1, sol, ...o });
// match item: letters = correct List II letter for A, B, C, D, e.g. ['q','r','p','s']
const mt = (l, sub, group, letters, sol, o = {}) => {
  const code = (L) => L.map((x, i) => `${'ABCD'[i]}-${x}`).join(', ');
  const right = code(letters); const wr = [];
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [0, 3], [0, 2], [1, 3]]) { const L = [...letters]; [L[i], L[j]] = [L[j], L[i]]; const c = code(L); if (c !== right && !wr.includes(c)) wr.push(c); }
  const pos = (xc++ * 3 + 2) % 4; const options = wr.slice(0, 3); options.splice(pos, 0, right);
  return xb(l, sub, { type: 'mcq', format: 'match', q: 'Match the entries of List I with List II and choose the correct code.', group, options, answer: pos, sol, ...o });
};
const pn = (l, sub, group, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o }); };
const pm = (l, sub, group, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'passage', group, q, options, answer: pos, sol, ...o }); };
let xg = GN;
const gx = (l, type, sub, make, verify) => ({ id: `${PFX}-g${String(++xg).padStart(2, '0')}`, type, level: l, exams: xe(l, type), sub, make, verify });
const NG = {};
Object.assign(groups, {
  xl1: { title: 'Kinds of friction',
    list1: ['A. Static friction on a body at rest under a small push', 'B. Limiting friction', 'C. Kinetic friction', 'D. Rolling friction'],
    list2: [r`p. Equals the applied force`, r`q. Equals $\mu_sN$`, r`r. Equals $\mu_kN$`, 's. Much smaller than the others for the same load'] },
  xl2: { title: 'Apparent weight of a 60 kg person in a lift ($g = 10\\ \\mathrm{m\\,s^{-2}}$)',
    list1: ['A. Lift at rest', r`B. Lift accelerating up at $2\ \mathrm{m\,s^{-2}}$`, r`C. Lift accelerating down at $2\ \mathrm{m\,s^{-2}}$`, 'D. Lift in free fall'],
    list2: ['p. 0 N', 'q. 480 N', 'r. 600 N', 's. 720 N'] },
  xl3: { title: 'A ball on a string of length $l$ in a vertical circle, with the least speed that completes the circle (at the top $v^2 = gl$)',
    list1: ['A. Tension at the lowest point', 'B. Tension when the string is horizontal', 'C. Tension at the highest point', r`D. Tension when the string makes $60^\circ$ with the downward vertical`],
    list2: [r`p. $0$`, r`q. $3mg$`, r`r. $4.5\,mg$`, r`s. $6mg$`] },
  xl4: { title: 'A block of mass $m$ on a smooth wedge of angle $\\theta$',
    list1: ['A. Acceleration of the block when the wedge is fixed', 'B. Normal reaction when the wedge is fixed', 'C. Horizontal acceleration the wedge needs to keep the block at rest on it', 'D. Normal reaction when the wedge has that acceleration'],
    list2: [r`p. $mg\cos\theta$`, r`q. $g\tan\theta$`, r`r. $g\sin\theta$`, r`s. $mg/\cos\theta$`] },
  xl5: { title: 'Change of momentum of a ball (mass $m$, speed $v$) at a wall',
    list1: ['A. Rebounds elastically along the normal', 'B. Sticks to the wall', r`C. Rebounds along the normal with $e = 0.5$`, r`D. Hits at $30^\circ$ to the normal and rebounds elastically from a smooth wall`],
    list2: [r`p. $mv$`, r`q. $1.5\,mv$`, r`r. $2mv$`, r`s. $\sqrt3\,mv$`] },
  xl6: { title: 'Turning a corner',
    list1: ['A. Greatest speed on a level road (friction coefficient $\\mu$, radius $r$)', 'B. Speed on a frictionless banked road (angle $\\theta$) at which no friction is needed', 'C. Greatest safe speed on a banked road with friction', 'D. Angle of lean of a cyclist (speed $v$, radius $r$) from the vertical'],
    list2: [r`p. $\sqrt{rg\tan\theta}$`, r`q. $\sqrt{\mu rg}$`, r`r. $\sqrt{\dfrac{rg(\mu+\tan\theta)}{1-\mu\tan\theta}}$`, r`s. $\tan^{-1}\dfrac{v^2}{rg}$`] },
  xl7: { title: 'Pulley systems ($g = 10\\ \\mathrm{m\\,s^{-2}}$, light string and pulley, no friction)',
    list1: ['A. Acceleration with masses 3 kg and 1 kg hanging on either side', 'B. Acceleration with 4 kg and 4 kg hanging', 'C. String tension in the case of A', 'D. Acceleration of a 2 kg block on a smooth table pulled by a 3 kg block hanging over the edge'],
    list2: ['p. 0', r`q. $5\ \mathrm{m\,s^{-2}}$`, 'r. 15 N', r`s. $6\ \mathrm{m\,s^{-2}}$`] },
  xl8: { title: 'Springs and strings cut ($P$ has mass $m$, $Q$ has mass $2m$); accelerations just after the cut',
    list1: ['A. $P$ hangs from the ceiling by a spring, $Q$ hangs below $P$ by a string; the string is cut. Acceleration of $P$ (upward)', 'B. Same case: acceleration of $Q$ (downward)', 'C. $P$ hangs from the ceiling by a string, $Q$ hangs below $P$ by a spring; the ceiling string is cut. Acceleration of $P$ (downward)', 'D. Same case: acceleration of $Q$'],
    list2: ['p. 0', 'q. $g$', 'r. $2g$', 's. $3g$'] },
  xlp1: { title: 'A block on a plank',
    passage: r`<p>A 2 kg block rests on a 4 kg plank of length 1 m. The plank lies on a smooth floor. The coefficient of friction between block and plank is 0.4. A horizontal force of 20 N is applied to the block (at the plank's left end, pulling it right). Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
  xlp2: { title: 'A conical pendulum',
    passage: r`<p>A 0.5 kg ball on a 1.0 m string moves in a horizontal circle, the string making $37^\circ$ with the vertical ($\sin37^\circ = 0.6$, $\cos37^\circ = 0.8$). Take $g = 10\ \mathrm{m\,s^{-2}}$.</p>` },
});

items.push(
  // ---------- Level 2 ----------
  n(2, 'Newton\'s second law', r`A 5 kg block is pulled along a rough floor by a horizontal force of 20 N. The friction is 5 N. Find its acceleration (in $\mathrm{m\,s^{-2}}$).`, () => (20 - 5) / 5, 0, 0,
    r`Net force $= 20 - 5 = 15$ N. $a = 15/5 = 3\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  m(2, 'impulse', r`A 0.2 kg ball hits a wall at $10\ \mathrm{m\,s^{-1}}$ at right angles and rebounds at $10\ \mathrm{m\,s^{-1}}$. The impulse of the wall on the ball is`, r`$4\ \mathrm{N\,s}$`, [r`$2\ \mathrm{N\,s}$`, r`$0$`, r`$8\ \mathrm{N\,s}$`],
    r`Take the incoming direction as positive: $\Delta p = (-0.2\times10) - (0.2\times10) = -4$ kg m/s. The impulse has magnitude 4 N s. The reversal of direction doubles the change.`),
  n(2, 'banking', r`A road is banked at an angle $\theta$ for a design speed of $14\ \mathrm{m\,s^{-1}}$ on a curve of radius 20 m. Find $\theta$ in degrees ($g = 9.8$).`, () => Math.atan(14 * 14 / (20 * 9.8)) * 180 / Math.PI, 0, 0,
    r`$\tan\theta = \dfrac{v^2}{rg} = \dfrac{196}{196} = 1$, so $\theta = 45^\circ$.`, { unit: '°' }),
  m(2, 'lift', r`A 60 kg man stands in a lift that accelerates downward at $2\ \mathrm{m\,s^{-2}}$. What does a spring balance under his feet read (in N, $g = 9.8$)?`, '468 N', ['588 N', '708 N', '120 N'],
    r`$mg - N = ma \Rightarrow N = m(g-a) = 60\times7.8 = 468$ N. $588$ N is his true weight; $708$ N would be for an upward acceleration.`),
  m(2, 'Newton\'s third law', r`A book rests on a table. The reaction to the weight of the book (the pull of the Earth on it) is`, 'the pull of the book on the Earth', ['the push of the table on the book', 'the push of the book on the table', 'the force of friction'],
    r`Action and reaction act on different bodies and are of the same kind. The Earth pulls the book; the book pulls the Earth. The push of the table balances the weight, but it is not its reaction (it is a different kind of force and acts on the same body).`),
  m(2, 'friction', r`The maximum static friction between a block and a table depends on`, 'the normal reaction and the nature of the two surfaces', ['the area of contact and the normal reaction', 'the speed of the block', 'the mass of the block only'],
    r`$f_{max} = \mu_sN$. $\mu_s$ depends on the surfaces; $N$ depends on the load. It does not depend on the apparent contact area or on speed.`),
  // ---------- Level 3 ----------
  n(3, 'contact forces', r`Blocks of 3 kg and 2 kg touch on a smooth table. A 10 N force pushes the 3 kg block towards the 2 kg block. Find the contact force between them (in N).`, () => 10 * 2 / 5, 0, 0,
    r`$a = 10/5 = 2\ \mathrm{m\,s^{-2}}$. The 3 kg block pushes the 2 kg block with $N = 2\times2 = 4$ N.`, { unit: 'N' }),
  n(3, 'heavy rope', r`A uniform rope of mass 4 kg and length 2 m lies on a smooth table and is pulled by a 20 N force at one end. Find the tension (in N) at a point 0.5 m from the free end.`, () => 20 * 0.5 / 2, 0, 0,
    r`$a = F/M = 5\ \mathrm{m\,s^{-2}}$. The 0.5 m piece at the free end has mass $4\times0.5/2 = 1$ kg and is pulled by the tension: $T = 1\times5 = 5$ N.`, { unit: 'N', trap: 'The tension changes along a heavy rope.' }),
  m(3, 'pseudo force', r`A plumb bob hangs in a trolley and makes $30^\circ$ with the vertical. The acceleration of the trolley is ($g = 9.8$)`, r`$5.66\ \mathrm{m\,s^{-2}}$`, [r`$4.90\ \mathrm{m\,s^{-2}}$`, r`$8.49\ \mathrm{m\,s^{-2}}$`, r`$16.97\ \mathrm{m\,s^{-2}}$`],
    r`$T\sin\theta = ma$ and $T\cos\theta = mg$, so $a = g\tan30^\circ = 9.8\times0.577 = 5.66\ \mathrm{m\,s^{-2}}$. $g\sin\theta = 4.9$ and $g\tan60^\circ = 16.97$ are mistakes with the wrong trigonometric ratio.`),
  n(3, 'friction on inclines', r`A block slides down a rough incline of angle $30^\circ$ with $\mu = 0.2$. Find its acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals, $g=9.8$).`, () => 9.8 * (0.5 - 0.2 * Math.cos(Math.PI / 6)), 0.01, 2,
    r`$a = g(\sin\theta - \mu\cos\theta) = 9.8\times(0.5 - 0.2\times0.866) = 3.20\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  n(3, 'impulse', r`A force rises uniformly from 0 to 30 N in 0.2 s and then drops to zero. It acts on a 0.5 kg ball at rest. Find the speed gained (in $\mathrm{m\,s^{-1}}$).`, () => 0.5 * 30 * 0.2 / 0.5, 0, 0,
    r`Impulse $=$ area under the $F$-$t$ graph $= \tfrac12\times30\times0.2 = 3$ N s. $v = J/m = 3/0.5 = 6\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  n(3, 'impulse', r`A hose sends 2 kg of water each second at $5\ \mathrm{m\,s^{-1}}$ against a wall, where it stops (and runs down). Find the force on the wall (in N).`, () => 2 * 5, 0, 0,
    r`Force $=$ rate of change of momentum $= \dfrac{dm}{dt}\,v = 2\times5 = 10$ N.`, { unit: 'N' }),
  n(3, 'circular motion dynamics', r`A conical pendulum has a string 1 m long making $60^\circ$ with the vertical. Find its period (in s, 3 decimals, $g=9.8$).`, () => 2 * Math.PI * Math.sqrt(0.5 / 9.8), 0.005, 3,
    r`$T\sin\theta = m\omega^2L\sin\theta$ and $T\cos\theta = mg$ give $\omega^2 = \dfrac{g}{L\cos\theta}$. Period $= 2\pi\sqrt{\dfrac{L\cos\theta}{g}} = 2\pi\sqrt{\dfrac{0.5}{9.8}} = 1.419$ s.`, { unit: 's' }),
  n(3, 'vertical circle', r`A stone on a 0.9 m string is whirled in a vertical circle. Find the least speed at the lowest point for it to complete the circle (in $\mathrm{m\,s^{-1}}$, 2 decimals, $g=10$).`, () => Math.sqrt(5 * 10 * 0.9), 0.01, 2,
    r`At the top $v_t^2\ge gl$. Energy: $v_b^2 = v_t^2 + 4gl\ge5gl$. $v_b = \sqrt{5\times10\times0.9} = 6.71\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  n(3, 'lift', r`A 60 kg man in a lift moving up slows down at $3\ \mathrm{m\,s^{-2}}$. What force (in N) does the floor exert on him? ($g=9.8$)`, () => 60 * (9.8 - 3), 0, 0,
    r`Slowing down while moving up means the acceleration is downward: $mg - N = ma \Rightarrow N = 60\times(9.8-3) = 408$ N.`, { unit: 'N', trap: 'Slowing down on the way up is a downward acceleration.' }),
  n(3, 'circular motion dynamics', r`A block sits 0.5 m from the axis of a turntable with $\mu = 0.4$. At what angular speed (in rad/s, 2 decimals) does it begin to slip? ($g=9.8$)`, () => Math.sqrt(0.4 * 9.8 / 0.5), 0.01, 2,
    r`Friction gives the centripetal force: $\mu mg = m\omega^2r \Rightarrow \omega = \sqrt{\mu g/r} = \sqrt{7.84} = 2.80$ rad/s.`, { unit: 'rad/s' }),
  n(3, 'circular motion dynamics', r`A car moves at $10\ \mathrm{m\,s^{-1}}$ over the top of a circular bridge of radius 40 m. The normal reaction is what fraction of its weight (2 decimals, $g=10$)?`, () => 1 - 100 / (40 * 10), 0.005, 2,
    r`$mg - N = \dfrac{mv^2}{r} \Rightarrow N = mg\left(1 - \dfrac{v^2}{rg}\right) = mg\times0.75$.`),
  m(3, 'friction', r`A block is pressed against the front vertical face of a cart ($\mu = 0.4$). The least acceleration of the cart that stops the block from sliding down is ($g = 9.8$)`, r`$24.5\ \mathrm{m\,s^{-2}}$`, [r`$9.8\ \mathrm{m\,s^{-2}}$`, r`$3.92\ \mathrm{m\,s^{-2}}$`, r`$12.25\ \mathrm{m\,s^{-2}}$`],
    r`The cart pushes the block with $N = ma$. Friction $\mu N$ must hold up the weight: $\mu ma\ge mg$, so $a\ge g/\mu = 9.8/0.4 = 24.5\ \mathrm{m\,s^{-2}}$.`),
  n(3, 'pendulum in a lift', r`A simple pendulum of length 1 m is in a lift accelerating upward at $g$. Find its period (in s, 3 decimals, $g = 9.8$).`, () => 2 * Math.PI * Math.sqrt(1 / 19.6), 0.005, 3,
    r`The effective gravity is $g + a = 2g$: $T = 2\pi\sqrt{\dfrac{l}{2g}} = 2\pi\sqrt{\dfrac1{19.6}} = 1.419$ s.`, { unit: 's' }),
  n(3, 'inclined plane', r`What least force parallel to the incline (in N, 1 decimal) pushes a 5 kg block up a $30^\circ$ incline, $\mu = 0.3$, at constant speed? ($g=10$)`, () => 5 * 10 * (0.5 + 0.3 * Math.cos(Math.PI / 6)), 0.1, 1,
    r`$F = mg\sin\theta + \mu mg\cos\theta = 25 + 0.3\times43.3 = 38.0$ N.`, { unit: 'N' }),
  mt(3, 'friction', 'xl1', ['p', 'q', 'r', 's'], r`Static friction adjusts to the applied force (p). At the point of slipping it is limiting, $\mu_sN$ (q). Once sliding, it is $\mu_kN$ (r). Rolling friction is much smaller (s).`),
  mt(3, 'lift', 'xl2', ['r', 's', 'q', 'p'], r`$N = m(g+a)$: at rest 600 N (r); up at 2: 720 N (s); down at 2: 480 N (q); free fall: 0 (p).`),
  mt(3, 'impulse', 'xl5', ['r', 'p', 'q', 's'], r`Elastic rebound: $\Delta p = 2mv$ (r). Sticks: $mv$ (p). With $e = 0.5$: $mv + 0.5mv = 1.5mv$ (q). Glancing elastic: only the normal component reverses, so $\Delta p = 2mv\cos30^\circ = \sqrt3mv$ (s).`),
  mt(3, 'banking', 'xl6', ['q', 'p', 'r', 's'], r`Level road: $\mu mg = mv^2/r$ (q). Frictionless banking: $v = \sqrt{rg\tan\theta}$ (p). With friction at the limit: (r). Cyclist: $\tan\phi = v^2/rg$ (s).`),
  mt(3, 'pulleys', 'xl7', ['q', 'p', 'r', 's'], r`A: $a = \dfrac{(3-1)10}{4} = 5$ (q). B: equal masses, $a = 0$ (p). C: $T = 1\times(10+5) = 15$ N (r). D: $a = \dfrac{3\times10}{5} = 6$ (s).`),
  a(3, 'lift', 'The apparent weight of a person in a freely falling lift is zero.', 'In free fall the person and the floor have the same acceleration, so the floor exerts no force on the person.', 0,
    r`Both are true and R explains A: $mg - N = mg\Rightarrow N = 0$. The weight (the pull of the Earth) is still $mg$; it is the apparent weight (the reading) that is zero.`),
  a(2, 'impulse', 'Impulse is a vector quantity.', 'Impulse equals the change in momentum, which is a vector.', 0,
    r`$\vec J = \Delta\vec p$, and momentum is a vector, so impulse is a vector with the direction of the net force. R explains A.`),
  t(3, 'momentum conservation', 'The momentum of a system is conserved when the net external force on it is zero.', 'Internal forces can change the momentum of the system.', 2,
    r`I is true. II is false: internal forces occur in equal and opposite pairs and cancel in the sum, so they cannot change the total momentum.`),
  cn(3, 'concepts', 'How many of the following are correct?', ['A body can move with constant velocity under several forces.', 'The apparent weight of a body in a freely falling lift is zero.', 'The coefficient of friction can be greater than 1.', 'The action and reaction forces act on the same body.'], 3,
    r`(i) True: if the net force is zero. (ii) True. (iii) True: for rubber on dry surfaces $\mu$ can exceed 1. (iv) False: they act on different bodies. Three are correct.`),
  // ---------- Level 4 ----------
  n(4, 'wedge and block', r`A block rests on a smooth wedge of angle $37^\circ$. With what horizontal acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals) must the wedge be pushed so that the block does not slide on it? ($\tan37^\circ = 0.75$, $g=10$)`, () => 10 * 0.75, 0.01, 2,
    r`The block moves with the wedge, so $N\sin\theta = ma$ and $N\cos\theta = mg$, giving $a = g\tan\theta = 7.5\ \mathrm{m\,s^{-2}}$ The wedge must accelerate towards the side on which its sloping face looks down (the horizontal direction of the normal force on the block).`, { unit: 'm/s²' }),
  n(4, 'springs', r`A 2 kg block hangs from the ceiling by a spring, and a 3 kg block hangs below it from a string. The string is cut. Find the acceleration (in $\mathrm{m\,s^{-2}}$) of the 2 kg block just after the cut ($g=10$), upward positive.`, () => (50 - 20) / 2, 0, 0,
    r`Before the cut the spring supports both: its force is $(2+3)\times10 = 50$ N. The spring force cannot change instantly. After the cut: $50 - 20 = 30$ N upward on the 2 kg block, so $a = 30/2 = 15\ \mathrm{m\,s^{-2}}$ upward.`, { unit: 'm/s²', trap: 'A spring force cannot jump; a string force can.' }),
  n(4, 'banking', r`A road is banked at $\tan\theta = 0.2$, the coefficient of friction is 0.3 and the radius is 50 m. Find the greatest safe speed (in $\mathrm{m\,s^{-1}}$, 2 decimals, $g = 9.8$).`, () => Math.sqrt(50 * 9.8 * (0.3 + 0.2) / (1 - 0.3 * 0.2)), 0.02, 2,
    r`At the limit friction acts down the slope: $N\cos\theta = mg + \mu N\sin\theta$ and $N\sin\theta + \mu N\cos\theta = mv^2/r$. Dividing: $v^2 = rg\dfrac{\tan\theta+\mu}{1-\mu\tan\theta} = 490\times\dfrac{0.5}{0.94} = 260.6$. $v = 16.14\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  n(4, 'friction', r`A 10 kg block is on a rough floor ($\mu = 0.5$, $g=10$) and is pulled by a force of 40 N at $37^\circ$ above the horizontal ($\sin37^\circ = 0.6$). Find the force of friction on it (in N).`, () => 40 * 0.8, 0, 0,
    r`$N = mg - F\sin\theta = 100 - 24 = 76$ N, so the most friction possible is $0.5\times76 = 38$ N. The horizontal pull is $40\times0.8 = 32$ N, which is less, so the block stays at rest and static friction equals 32 N.`, { unit: 'N', trap: 'Do not just use $\\mu N$; check whether the block moves.' }),
  n(4, 'vertical circle', r`A 0.5 kg ball on a 1 m string is whirled in a vertical circle and has a speed of $6\ \mathrm{m\,s^{-1}}$ at the lowest point. Find the tension (in N, 1 decimal) when the string is at $60^\circ$ to the downward vertical ($g=10$).`, () => 0.5 * (36 - 2 * 10 * 0.5) + 0.5 * 10 * 0.5, 0.05, 2,
    r`Height gained $= l(1-\cos60^\circ) = 0.5$ m. $v^2 = 36 - 2\times10\times0.5 = 26$. Radial: $T - mg\cos60^\circ = mv^2/l \Rightarrow T = 0.5\times26 + 0.5\times10\times0.5 = 13 + 2.5 = 15.5$ N.`, { unit: 'N' }),
  n(4, 'pulleys', r`A 5 kg block on a rough table ($\mu = 0.3$) is joined by a string over a pulley to a 3 kg block hanging at the edge ($g = 10$). Find the tension in the string (in N, 1 decimal).`, () => 3 * (10 - 15 / 8), 0.05, 2,
    r`$a = \dfrac{3\times10 - 0.3\times5\times10}{5+3} = \dfrac{15}{8} = 1.875$. For the hanging block: $T = 3(10 - 1.875) = 24.4$ N.`, { unit: 'N' }),
  n(4, 'friction', r`What least force (in N) pulls a 10 kg block along a rough floor ($\mu = 0.75$) at constant speed if the direction of the pull may be chosen freely? ($g=10$)`, () => 0.75 * 100 / Math.sqrt(1 + 0.75 ** 2), 0, 0,
    r`$F\cos\phi = \mu(mg - F\sin\phi)\Rightarrow F = \dfrac{\mu mg}{\cos\phi+\mu\sin\phi}$. The denominator is largest ($\sqrt{1+\mu^2}$) when $\tan\phi = \mu$. $F_{min} = \dfrac{0.75\times100}{1.25} = 60$ N.`, { unit: 'N' }),
  n(4, 'pulleys', r`A man of 60 kg sits on a 20 kg seat hanging from a rope that passes over a fixed pulley and is held by the man himself. With what force (in N) must he pull the rope to go up with $2\ \mathrm{m\,s^{-2}}$? ($g=10$)`, () => 80 * 12 / 2, 0, 0,
    r`The rope pulls up on the man-and-seat system at both ends of the loop that holds them: $2T - (M+m)g = (M+m)a$. $T = \dfrac{80\times12}{2} = 480$ N.`, { unit: 'N' }),
  n(4, 'impulse', r`A 0.5 kg bob hangs from a string 0.8 m long. What horizontal impulse (in N s) given to it will just make it swing up to the horizontal position? ($g=10$)`, () => 0.5 * Math.sqrt(2 * 10 * 0.8), 0, 0,
    r`It rises 0.8 m: $v = \sqrt{2gl} = \sqrt{16} = 4\ \mathrm{m\,s^{-1}}$. Impulse $= mv = 0.5\times4 = 2$ N s.`, { unit: 'N s' }),
  n(4, 'circular motion dynamics', r`A person rides a vertical-wall rotor of radius 2 m (cylinder spinning about its vertical axis). The friction coefficient between the person and the wall is 0.25. What is the least angular speed (in rad/s, 2 decimals) so that the person does not slide down? ($g=10$)`, () => Math.sqrt(10 / (0.25 * 2)), 0.01, 2,
    r`The wall's push gives the centripetal force $N = m\omega^2r$. Friction holds the weight: $\mu N\ge mg$, so $\mu\omega^2r\ge g$. $\omega = \sqrt{\dfrac{g}{\mu r}} = \sqrt{20} = 4.47$ rad/s.`, { unit: 'rad/s' }),
  s(4, 'friction', r`Which of the following statements about friction are correct?`,
    [r`Static friction can be less than $\mu_sN$.`, 'Kinetic friction depends strongly on the area of contact.', 'Friction can act in the direction of motion of a body.', 'Friction always opposes the velocity of the body on which it acts.'], [0, 2],
    r`(A) True: it adjusts up to the limit. (B) False: for ordinary surfaces it is nearly independent of area. (C) True: a box on an accelerating truck is carried forward by friction. (D) False: friction opposes the relative sliding (or tendency to slide) at the contact, not necessarily the velocity relative to the ground.`),
  s(5, 'pulleys', r`Blocks of masses $m_1 > m_2$ hang on a light string over a frictionless pulley. Which of the following are correct?`,
    [r`The tension is less than $m_1g$.`, r`The tension is greater than $m_2g$.`, 'If the pulley has mass, the acceleration of the blocks is smaller than for a massless pulley.', r`The tension equals $\dfrac{(m_1+m_2)g}{2}$.`], [0, 1, 2],
    r`$T = \dfrac{2m_1m_2g}{m_1+m_2}$, which lies between $m_2g$ and $m_1g$ (A and B true). A massive pulley adds inertia, so $a = \dfrac{(m_1-m_2)g}{m_1+m_2+I/R^2}$ is smaller (C true). $\tfrac12(m_1+m_2)g$ is larger than $T$ unless $m_1=m_2$ (D false).`),
  s(4, 'banking', r`A car moves on a frictionless banked road (angle $\theta$) at the design speed. Which are correct?`,
    [r`The normal reaction is $mg/\cos\theta$.`, r`The normal reaction is $mg$.`, 'The net force is horizontal.', 'At a lower speed, friction would have to act up the slope to keep it from sliding down.'], [0, 2, 3],
    r`$N\cos\theta = mg$ gives $N = mg/\cos\theta$ (A true, B false). The vertical forces balance, so the net force is horizontal, towards the centre (C true). Below the design speed the car tends to slip down the slope, so friction acts up the slope (D true).`),
  s(5, 'pseudo force', r`A frame accelerates at $\vec a$ relative to an inertial frame. Which of these are correct?`,
    [r`The pseudo force on a mass $m$ in it is $-m\vec a$.`, 'The pseudo force has no reaction force.', 'The pseudo force obeys Newton\'s third law.', 'A person in the inertial frame does not need a pseudo force.'], [0, 1, 3],
    r`In the accelerating frame, $m\vec a' = \vec F - m\vec a$ (A true). The pseudo force is not exerted by any body, so it has no reaction partner (B true; C false). In the inertial frame $\vec F = m\vec a$ already works (D true).`),
  s(4, 'lift', r`A person standing on a scale in a lift reads more than the true weight. The lift may be`,
    ['accelerating upward', 'slowing down while moving downward', 'moving upward at constant speed', 'speeding up while moving downward'], [0, 1],
    r`A larger reading needs an upward acceleration. That is true for speeding up while going up (A) and slowing down while going down (B). At constant speed the reading equals the weight (C false). Speeding up downward is a downward acceleration, which lowers the reading (D false).`),
  s(5, 'impulse', r`A ball of mass $m$ and speed $v$ hits a smooth wall at $60^\circ$ to the normal and rebounds elastically. Which of these are correct?`,
    ['The component of momentum along the normal reverses.', 'The component of momentum along the wall is unchanged.', r`The magnitude of the impulse is $2mv$.`, 'The speed after the collision is $v$.'], [0, 1, 3],
    r`A smooth wall exerts only a normal force, so the tangential component is unchanged (B true) and the normal component reverses (A true). The impulse is $2mv\cos60^\circ = mv$, not $2mv$ (C false). Elastic means the speed is unchanged (D true).`),
  s(5, 'vertical circle', r`A ball is whirled on a string in a vertical circle of radius $l$ and just completes the circle. Which are correct?`,
    [r`The speed at the top is $\sqrt{gl}$.`, r`The tension at the bottom is $6mg$.`, 'The tension is greatest at the bottom.', r`The tension at the top is $mg$.`], [0, 1, 2],
    r`At the top $T = 0$ and $mg = mv^2/l$, so $v = \sqrt{gl}$ (A true, D false). At the bottom $v^2 = 5gl$, so $T - mg = 5mg$, $T = 6mg$ (B true). The tension is largest at the lowest point (C true).`),
  s(5, 'momentum conservation', r`Two blocks of masses $m$ and $2m$ are joined by a compressed light spring on a smooth table and released from rest. Which are correct?`,
    ['Their initial accelerations are in the ratio $2:1$ (the lighter has the greater).', 'Their momenta are equal and opposite at every instant.', 'The centre of mass stays at rest.', 'Their kinetic energies are equal at every instant.'], [0, 1, 2],
    r`The spring exerts equal forces, so $a_1/a_2 = 2m/m = 2$ (A true), $p_1 = -p_2$ (B true), and $\vec P = 0$ so the centre of mass does not move (C true). $K = p^2/2m$ is larger for the lighter block (D false).`),
  s(5, 'friction on inclines', r`A block is placed on a rough incline of angle $\theta$ and coefficient of friction $\mu$. Which statements are correct?`,
    [r`It stays at rest if $\tan\theta<\mu$.`, r`When at rest, the friction equals $mg\sin\theta$.`, r`The angle of repose is $\tan^{-1}\mu$.`, 'The angle of repose depends on the mass of the block.'], [0, 1, 2],
    r`Rest needs $mg\sin\theta\le\mu mg\cos\theta$, i.e. $\tan\theta\le\mu$ (A true). Static friction then exactly balances $mg\sin\theta$ (B true). The limiting angle is $\tan^{-1}\mu$ (C true), independent of mass (D false).`),
  s(4, 'Newton\'s third law', r`A horse pulls a cart along a level road and they accelerate forward. Which are correct?`,
    ['The cart pulls back on the horse with a force equal to the horse\'s pull on the cart.', 'The horse moves forward because the ground pushes it forward (friction).', 'The cart accelerates because the horse\'s pull exceeds the cart\'s pull on the horse.', 'The net force on the cart is non-zero.'], [0, 1, 3],
    r`Third-law pairs are always equal (A true, C false). The horse accelerates because the ground's friction on its hooves exceeds the cart's backward pull (B true). The cart accelerates, so its net force is non-zero (D true).`),
  mt(4, 'vertical circle', 'xl3', ['s', 'q', 'p', 'r'], r`With $v_b^2 = 5gl$: bottom $T = mg + \dfrac{5mgl}{l} = 6mg$ (s). Horizontal: $v^2 = 5gl - 2gl = 3gl$, $T = 3mg$ (q). Top: $T = 0$ (p). At $60^\circ$ from the bottom: $v^2 = 5gl - gl = 4gl$ and $T = 4mg + mg\cos60^\circ = 4.5mg$ (r).`),
  mt(4, 'wedge and block', 'xl4', ['r', 'p', 'q', 's'], r`Fixed wedge: $a = g\sin\theta$ (r), $N = mg\cos\theta$ (p). Accelerating wedge: $N\sin\theta = ma$, $N\cos\theta = mg$ gives $a = g\tan\theta$ (q) and $N = mg/\cos\theta$ (s).`),
  a(4, 'friction', 'Static friction is not always equal to $\\mu_sN$.', 'The value $\\mu_sN$ is only the maximum (limiting) value of static friction.', 0,
    r`Static friction adjusts itself to the applied force up to the limit $\mu_sN$. R explains A.`),
  a(4, 'lift', 'A man in a lift moving upward at constant speed feels no change in his weight.', 'The net force on him is zero.', 0,
    r`At constant velocity $a = 0$, so $N = mg$. Both true, R explains A.`),
  a(4, 'vertical circle', r`A ball on a string needs a speed of at least $\sqrt{gl}$ at the top of a vertical circle.`, 'At the top the tension cannot be negative, so $mv^2/l\\ge mg$.', 0,
    r`At the top $T + mg = mv^2/l$ with $T\ge0$, so $v^2\ge gl$. Both true, and R is the reason.`),
  a(4, 'vertical circle', 'In a vertical circle the tension at the bottom is more than at the top for any speed.', 'The speed is greater at the bottom and the weight adds to the tension there.', 0,
    r`$T_b - mg = mv_b^2/l$ and $T_t + mg = mv_t^2/l$, with $v_b>v_t$. So $T_b > T_t$. Both true, and R explains it.`),
  t(4, 'pseudo force', 'A pseudo force exists in a non-inertial frame.', 'The pseudo force has a reaction force in that frame.', 2,
    r`I is true. II is false: pseudo forces arise from the frame's acceleration, not from the interaction of two bodies, so they have no reaction.`),
  t(4, 'impulse', 'A force of 10 N acting on a 2 kg body for 0.5 s changes its momentum by 5 kg m/s.', 'Impulse equals force multiplied by the time for which it acts (constant force).', 0,
    r`$J = F\Delta t = 10\times0.5 = 5$ N s $=\Delta p$. Both true.`),
  cn(4, 'circular motion dynamics', 'How many of the following are correct?', ['Centripetal force is an extra force on a body in circular motion, apart from the real forces.', 'In a conical pendulum the vertical component of the tension equals $mg$.', 'At the lowest point of a vertical circle the apparent weight is greater than $mg$.', 'A car moving at constant speed on a banked track has zero acceleration.'], 2,
    r`(i) False: it is the resultant of real forces. (ii) True. (iii) True: $N = mg + mv^2/r$. (iv) False: its velocity changes direction. Two are correct.`),
  // ---------- Level 5 ----------
  n(5, 'chain on a table', r`A uniform chain of length 2 m lies partly on a rough table ($\mu = 0.5$) with the rest hanging over the edge. What is the greatest length (in m, 3 decimals) that can hang without the chain sliding off?`, () => 2 * 0.5 / 1.5, 0.003, 3,
    r`Let $x$ hang and $\lambda$ be the mass per metre. The hanging part pulls with $x\lambda g$. Friction on the table part is at most $\mu(L-x)\lambda g$. At the limit $x = \mu(L-x)$, so $x = \dfrac{\mu L}{1+\mu} = \dfrac{0.5\times2}{1.5} = 0.667$ m.`, { unit: 'm' }),
  n(5, 'bowl', r`A small block moves in a horizontal circle on the inside of a smooth hemispherical bowl of radius 0.5 m, turning at $8\ \mathrm{rad\,s^{-1}}$. How high (in m, 3 decimals) above the lowest point of the bowl is it? ($g=10$)`, () => 0.5 * (1 - 10 / (64 * 0.5)), 0.002, 3,
    r`With $\theta$ the angle of the radius from the vertical: $N\cos\theta = mg$ and $N\sin\theta = m\omega^2R\sin\theta$, so $N = m\omega^2R$ and $\cos\theta = \dfrac{g}{\omega^2R} = \dfrac{10}{32} = 0.3125$. Height above the bottom $= R(1-\cos\theta) = 0.5\times0.6875 = 0.344$ m.`, { unit: 'm' }),
  n(5, 'wedge and block', r`A 2 kg block is released on a smooth $30^\circ$ wedge of mass 6 kg, which rests on a smooth floor. Find the acceleration of the wedge (in $\mathrm{m\,s^{-2}}$, 2 decimals, $g=10$).`, () => 2 * 10 * 0.5 * Math.cos(Math.PI / 6) / (6 + 2 * 0.25), 0.01, 2,
    r`The wedge moves horizontally under the horizontal component of the block's push, $N\sin\theta = Ma$. The block's normal force is reduced because the wedge gives way: $N = \dfrac{Mmg\cos\theta}{M+m\sin^2\theta}$. So $a = \dfrac{mg\sin\theta\cos\theta}{M+m\sin^2\theta} = \dfrac{2\times10\times0.5\times0.866}{6+0.5} = 1.33\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'The wedge is free to move, so $N \\ne mg\\cos\\theta$.' }),
  n(5, 'circular motion dynamics', r`A small block starts from rest at the top of a smooth hemisphere of radius 1.5 m and slides down. Through what vertical distance (in m) has it fallen when it leaves the surface?`, () => 1.5 / 3, 0.005, 3,
    r`At angle $\theta$ from the top: $mg\cos\theta - N = mv^2/R$ with $v^2 = 2gR(1-\cos\theta)$. It leaves when $N = 0$: $\cos\theta = 2(1-\cos\theta)$, so $\cos\theta = \tfrac23$. The drop is $R(1-\cos\theta) = R/3 = 0.5$ m.`, { unit: 'm' }),
  m(5, 'pulleys', r`Two blocks $m_1$ and $m_2$ hang over a light frictionless pulley with $m_1 > m_2$. The pulley's support exerts a force on the pulley equal to`, r`$\dfrac{4m_1m_2g}{m_1+m_2}$`, [r`$(m_1+m_2)g$`, r`$\dfrac{(m_1+m_2)g}{2}$`, r`$(m_1-m_2)g$`],
    r`The support holds up the two string tensions: $2T = \dfrac{4m_1m_2g}{m_1+m_2}$. It is less than $(m_1+m_2)g$ because the system is accelerating (the heavier block goes down), and equal to $(m_1+m_2)g$ only if $m_1 = m_2$.`, { trap: 'The support force is not the total weight when the blocks accelerate.' }),
  n(5, 'friction on blocks', r`A 2 kg block lies on a 4 kg plank on a smooth floor; $\mu = 0.4$ between them ($g = 10$). What is the greatest horizontal force (in N) on the plank for which the block does not slip on it?`, () => (2 + 4) * 0.4 * 10, 0, 0,
    r`The block's greatest acceleration is $\mu g = 4\ \mathrm{m\,s^{-2}}$ (friction is its only horizontal force). The two move together up to $a = 4$, so $F_{max} = (2+4)\times4 = 24$ N.`, { unit: 'N' }),
  n(5, 'circular motion dynamics', r`A 0.5 kg ball swings on a 1.2 m string. When the string is horizontal the ball has a speed of $4\ \mathrm{m\,s^{-1}}$. Find the magnitude of its total acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals) at that moment. ($g = 10$)`, () => Math.hypot(16 / 1.2, 10), 0.02, 2,
    r`Radial (centripetal) acceleration $= v^2/l = 16/1.2 = 13.33$, and the tangential acceleration is $g = 10$ (gravity is tangent to the circle at that point). $a = \sqrt{13.33^2 + 10^2} = 16.67\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Include both the radial and tangential parts.' }),
  n(5, 'inclined plane', r`A block is kept on a rough incline of angle $30^\circ$ and $\mu = 0.8$. What horizontal force (in N, nearest whole number) is just enough to make a 10 kg block start sliding up the incline? ($g = 10$)`, () => Math.round(100 * (Math.sin(Math.PI / 6) + 0.8 * Math.cos(Math.PI / 6)) / (Math.cos(Math.PI / 6) - 0.8 * Math.sin(Math.PI / 6))), 1, 0,
    r`Let $F$ be horizontal, pushing in towards the incline. Along the slope: $F\cos\theta = mg\sin\theta + \mu N$. Normal: $N = mg\cos\theta + F\sin\theta$. So $F(\cos\theta - \mu\sin\theta) = mg(\sin\theta + \mu\cos\theta)$. $F = 100\times\dfrac{0.5+0.693}{0.866 - 0.4} = 100\times\dfrac{1.193}{0.466} = 256$ N.`, { unit: 'N', trap: 'The horizontal push also raises the normal reaction.' }),
  n(5, 'springs', r`Two blocks, $P$ of 1 kg and $Q$ of 2 kg, are joined by a spring. $P$ hangs from the ceiling by a string, with $Q$ hanging below on the spring. The ceiling string is cut. Find the initial acceleration of $P$ (in $\mathrm{m\,s^{-2}}$, downward; $g=10$).`, () => (10 + 20) / 1, 0, 0,
    r`Before the cut the spring is stretched by the weight of $Q$: its force is 20 N (it pulls $P$ down and $Q$ up). After the cut the spring force is unchanged. On $P$: down $= mg + 20 = 30$ N, so $a = 30\ \mathrm{m\,s^{-2}}$ downward ($3g$). $Q$ is still balanced: acceleration 0.`, { unit: 'm/s²' }),
  mt(5, 'springs', 'xl8', ['r', 'q', 's', 'p'], r`Case 1: the spring holds both, force $3mg$. Cut the string: $P$ has $3mg - mg = 2mg$ up, so $2g$ (r). $Q$ falls freely, $g$ (q). Case 2: the spring is stretched by $Q$'s weight, force $2mg$. Cut the ceiling string: $P$ gets $mg + 2mg = 3mg$ down, so $3g$ (s). $Q$ has $2mg$ up from the spring and $2mg$ down: 0 (p).`),
  a(5, 'pulleys', 'The tension in a light rope passing over a frictionless pulley is the same on both sides.', 'The net torque on a massless pulley must be zero.', 0,
    r`For a massless pulley, $(T_1 - T_2)R = I\alpha = 0$, so $T_1 = T_2$ when there is no friction at the axle. Both true, and R explains A.`),
  a(5, 'friction on blocks', 'In a system of two blocks, one on top of the other, friction on the lower block by the upper block can act in the direction of the lower block\'s motion.', 'Friction opposes the relative sliding between two surfaces in contact.', 0,
    r`If the upper block slides forward relative to the lower block, friction on the lower block acts forward (it is the reaction of the backward friction on the upper block). Friction opposes relative motion, not necessarily the body's own motion. R explains A.`),
  cn(5, 'inertial frames', 'How many of the following are correct?', ['Newton\'s first law defines inertial frames.', 'A frame in free fall near the Earth is, over a small region, inertial.', 'In a uniformly rotating frame there is a pseudo force even for a body at rest in it.', 'In an accelerating frame the sum of real forces is always equal to $ma$.'], 3,
    r`(i) True. (ii) True: in free fall gravity is cancelled by the pseudo force (the principle of equivalence). (iii) True: the centrifugal force. (iv) False: in the accelerating frame $\sum F_{real} + F_{pseudo} = ma'$. Three are correct.`),
);

items.push(
  pn(3, 'friction on blocks', 'xlp1', r`Find the acceleration of the block (in $\mathrm{m\,s^{-2}}$), assuming it slips on the plank.`, () => (20 - 0.4 * 2 * 10) / 2, 0, 0,
    r`Is slipping certain? If they moved together, $a = 20/6 = 3.33$, requiring friction $4\times3.33 = 13.3$ N on the plank, more than the maximum $0.4\times20 = 8$ N. So the block slips. Friction on it is 8 N backward: $a_1 = (20-8)/2 = 6\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pn(4, 'friction on blocks', 'xlp1', r`Find the acceleration of the plank (in $\mathrm{m\,s^{-2}}$).`, () => 8 / 4, 0, 0,
    r`The only horizontal force on the plank is the friction from the block, 8 N forward. $a_2 = 8/4 = 2\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pn(5, 'friction on blocks', 'xlp1', r`The block starts at the left end of the plank. How long (in s, 3 decimals) before it leaves the right end?`, () => Math.sqrt(2 * 1 / (6 - 2)), 0.005, 3,
    r`Relative acceleration $= 6 - 2 = 4\ \mathrm{m\,s^{-2}}$. Relative distance $= 1$ m: $1 = \tfrac12\times4t^2$, $t = \sqrt{0.5} = 0.707$ s.`, { unit: 's' }),
  pn(3, 'circular motion dynamics', 'xlp2', r`Find the tension in the string (in N, 2 decimals).`, () => 0.5 * 10 / 0.8, 0.01, 2,
    r`$T\cos37^\circ = mg \Rightarrow T = \dfrac{5}{0.8} = 6.25$ N.`, { unit: 'N' }),
  pn(4, 'circular motion dynamics', 'xlp2', r`Find the speed of the ball (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, () => Math.sqrt(10 * 0.6 * 0.75), 0.01, 2,
    r`The circle has radius $r = l\sin37^\circ = 0.6$ m. $T\sin\theta = mv^2/r$ and $T\cos\theta = mg$ give $v^2 = rg\tan\theta = 0.6\times10\times0.75 = 4.5$, $v = 2.12\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pn(4, 'circular motion dynamics', 'xlp2', r`The ball is made to go faster until the string makes $60^\circ$ with the vertical. Find the new tension (in N).`, () => 0.5 * 10 / 0.5, 0, 0,
    r`The vertical balance is unchanged: $T\cos60^\circ = mg \Rightarrow T = 5/0.5 = 10$ N.`, { unit: 'N' }),
);

gens.push(
  gx(3, 'nat', 'lift', (rng) => {
    const mm = pick(rng, 40, 90, 5); const a = pick(rng, 0.5, 3, 0.5); const up = rng() < 0.5;
    const N = mm * (9.8 + (up ? a : -a));
    return { mm, a, up, q: `A ${mm} kg person stands on a scale in a lift that accelerates ${up ? 'upward' : 'downward'} at ${a} m/s². What does the scale read (in N, 1 decimal, $g=9.8$)?`, answer: +N.toFixed(1), tol: 0.1, unit: 'N',
      sol: `${up ? `$N - mg = ma \\Rightarrow N = m(g+a)$` : `$mg - N = ma \\Rightarrow N = m(g-a)$`} $= ${mm}\\times${+(9.8 + (up ? a : -a)).toFixed(2)} = ${N.toFixed(1)}$ N.` };
  }, (p) => { const net = p.up ? p.mm * p.a : -p.mm * p.a; return p.mm * 9.8 + net; }),
  gx(3, 'nat', 'contact forces', (rng) => {
    const m1 = pick(rng, 2, 8, 1); const m2 = pick(rng, 1, 6, 1); const F = pick(rng, 10, 60, 5);
    const N = F * m2 / (m1 + m2);
    return { m1, m2, F, q: `Blocks of ${m1} kg and ${m2} kg touch on a smooth table. A ${F} N force pushes the ${m1} kg block towards the ${m2} kg block. Find the contact force between them (in N, 2 decimals).`, answer: +N.toFixed(2), tol: 0.01, unit: 'N',
      sol: `$a = \\dfrac{${F}}{${m1}+${m2}} = ${+(F / (m1 + m2)).toFixed(3)}$. The ${m1} kg block pushes the ${m2} kg block with $N = ${m2}a = ${N.toFixed(2)}$ N.` };
  }, (p) => { const a = p.F / (p.m1 + p.m2); return p.F - p.m1 * a; }),
  gx(4, 'nat', 'friction on blocks', (rng) => {
    const mb = pick(rng, 1, 4, 1); const mp = pick(rng, 3, 8, 1); const mu = pick(rng, 0.2, 0.5, 0.1);
    const F = (mb + mp) * mu * 10 + pick(rng, 4, 20, 2);
    const a1 = (F - mu * mb * 10) / mb; const a2 = mu * mb * 10 / mp;
    return { mb, mp, mu, F, q: `A ${mb} kg block lies on a ${mp} kg plank on a smooth floor; $\\mu = ${mu}$ between them. A horizontal force of ${F} N pulls the block. Find the acceleration of the block (in m/s², 2 decimals, $g=10$), given that it slips.`, answer: +a1.toFixed(2), tol: 0.01, unit: 'm/s²',
      sol: `Friction on the block is $\\mu mg = ${+(mu * mb * 10).toFixed(2)}$ N backward, so $a_1 = \\dfrac{${F} - ${+(mu * mb * 10).toFixed(2)}}{${mb}} = ${a1.toFixed(2)}$ m/s². (The plank gets ${a2.toFixed(2)} m/s².)`, trap: 'Check that slipping really happens: the block needs more than $\\mu(m+M)g$.' };
  }, (p) => { const f = p.mu * p.mb * 10; return (p.F - f) / p.mb; }),
  gx(4, 'nat', 'banking', (rng) => {
    const r2 = pick(rng, 30, 100, 10); const mu = pick(rng, 0.2, 0.5, 0.1); const tn = pick(rng, 0.1, 0.3, 0.05);
    const v = Math.sqrt(r2 * 9.8 * (mu + tn) / (1 - mu * tn));
    return { r2, mu, tn, q: `A banked road has $\\tan\\theta = ${tn}$ and radius ${r2} m, with $\\mu = ${mu}$. Find the greatest safe speed (in m/s, 2 decimals, $g=9.8$).`, answer: +v.toFixed(2), tol: 0.02, unit: 'm/s',
      sol: `$v^2 = rg\\dfrac{\\tan\\theta+\\mu}{1-\\mu\\tan\\theta} = ${r2}\\times9.8\\times\\dfrac{${tn}+${mu}}{1-${+(mu * tn).toFixed(3)}} = ${(v * v).toFixed(1)}$. $v = ${v.toFixed(2)}$ m/s.` };
  }, (p) => { const th = Math.atan(p.tn); let lo = 0; let hi = 200; for (let i = 0; i < 100; i++) { const vv = (lo + hi) / 2; const need = vv * vv / (p.r2 * 9.8); const lhs = (Math.sin(th) + p.mu * Math.cos(th)) / (Math.cos(th) - p.mu * Math.sin(th)); if (need < lhs) lo = vv; else hi = vv; } return (lo + hi) / 2; }),
  gx(4, 'nat', 'vertical circle', (rng) => {
    const l = pick(rng, 0.5, 1.5, 0.1); const mm = pick(rng, 0.2, 1, 0.1); const vb = pick(rng, 5, 9, 0.5); const th = choose(rng, [30, 45, 60, 90]);
    const v2 = vb * vb - 2 * 10 * l * (1 - Math.cos(th * Math.PI / 180)); const T = mm * v2 / l + mm * 10 * Math.cos(th * Math.PI / 180);
    return { l, mm, vb, th, q: `A ${mm} kg ball on a ${l} m string is whirled in a vertical circle with a speed of ${vb} m/s at the lowest point. Find the tension (in N, 2 decimals) when the string makes ${th}° with the downward vertical ($g=10$).`, answer: +T.toFixed(2), tol: 0.02, unit: 'N',
      sol: `$v^2 = v_b^2 - 2gl(1-\\cos\\theta) = ${v2.toFixed(2)}$. $T - mg\\cos\\theta = mv^2/l$, so $T = ${mm}\\times${v2.toFixed(2)}/${l} + ${mm}\\times10\\times\\cos${th}^\\circ = ${T.toFixed(2)}$ N.`, trap: 'The weight component is $mg\\cos\\theta$ measured from the downward vertical.' };
  }, (p) => { const h = p.l * (1 - Math.cos(p.th * Math.PI / 180)); const KE = 0.5 * p.mm * p.vb ** 2 - p.mm * 10 * h; const v2 = 2 * KE / p.mm; return p.mm * v2 / p.l + p.mm * 10 * Math.cos(p.th * Math.PI / 180); }),
  gx(3, 'mcq', 'lift', (rng) => {
    const mm = pick(rng, 40, 80, 10); const sign = rng() < 0.5 ? 1 : -1; const k = pick(rng, 0.1, 0.3, 0.05);
    const reading = +(mm * (1 + sign * k)).toFixed(1); const a = +(k * 9.8).toFixed(2);
    const ans = sign > 0 ? `accelerating upward at ${a} m/s², or slowing down while moving down` : `accelerating downward at ${a} m/s², or slowing down while moving up`;
    const o = shuffleOpts(rng, ans, [sign > 0 ? `accelerating downward at ${a} m/s²` : `accelerating upward at ${a} m/s²`, 'moving at constant speed', 'in free fall']);
    return { sign, opts: o.options, q: `A ${mm} kg man standing on a spring scale in a lift sees it read ${reading} kg-weight. The lift must be`, options: o.options, answer: o.answer,
      sol: `The reading ${sign > 0 ? 'exceeds' : 'is below'} his true weight (${mm} kgf), so the acceleration is ${sign > 0 ? 'upward' : 'downward'}: $a = g\\times\\dfrac{${reading}-${mm}}{${mm}}$ in size $= ${a}$ m/s². A constant speed gives ${mm} kgf and free fall gives 0.`, trap: 'The reading depends on the direction of acceleration, not of velocity.' };
  }, (p) => p.opts.findIndex((x) => x.startsWith(p.sign > 0 ? 'accelerating upward' : 'accelerating downward'))),
  gx(3, 'mcq', 'pulleys', (rng) => {
    const m1 = pick(rng, 3, 9, 1); const m2 = pick(rng, 1, m1 - 1, 1);
    const T = 2 * m1 * m2 * 9.8 / (m1 + m2);
    const o = numOpts(rng, T, [(m1 + m2) * 9.8 / 2, m1 * 9.8, m2 * 9.8], 'N', 3);
    return { m1, m2, q: `Blocks of ${m1} kg and ${m2} kg hang over a light frictionless pulley. Find the tension in the string ($g=9.8$).`, options: o.options, answer: o.answer,
      sol: `$a = \\dfrac{(${m1}-${m2})g}{${m1}+${m2}}$ and $T = m_2(g+a) = \\dfrac{2m_1m_2g}{m_1+m_2} = ${F(T)}$ N. The weights $${m1}g$ and $${m2}g$ are upper and lower bounds, and the average weight is not the tension.`, trap: 'The tension is the harmonic-type mean, not the average of the weights.', Tval: T };
  }, (p) => { const a = (p.m1 - p.m2) * 9.8 / (p.m1 + p.m2); const T = p.m2 * (9.8 + a); const t2 = p.m1 * (9.8 - a); return Math.abs(T - t2) < 1e-9 ? (Math.abs(p.Tval - T) < 1e-9 ? p.answer : -1) : -1; }),
  gx(5, 'nat', 'chain on a table', (rng) => {
    const L = pick(rng, 1, 4, 0.5); const mu = pick(rng, 0.2, 0.8, 0.1);
    const x = L * mu / (1 + mu);
    return { L, mu, q: `A uniform chain of length ${L} m lies partly on a rough table ($\\mu = ${mu}$) with the rest hanging over the edge. Find the greatest hanging length (in m, 3 decimals) that does not make it slide.`, answer: +x.toFixed(3), tol: 0.003, unit: 'm',
      sol: `At the limit: $x\\lambda g = \\mu(L-x)\\lambda g$, so $x = \\dfrac{\\mu L}{1+\\mu} = \\dfrac{${mu}\\times${L}}{${+(1 + mu).toFixed(2)}} = ${x.toFixed(3)}$ m.` };
  }, (p) => { let lo = 0; let hi = p.L; for (let i = 0; i < 100; i++) { const x = (lo + hi) / 2; if (x > p.mu * (p.L - x)) hi = x; else lo = x; } return (lo + hi) / 2; }),
  gx(5, 'nat', 'wedge and block', (rng) => {
    const M = pick(rng, 3, 10, 1); const mm = pick(rng, 1, 4, 1); const th = choose(rng, [30, 37, 45, 53]);
    const s2 = Math.sin(th * Math.PI / 180); const c2 = Math.cos(th * Math.PI / 180);
    const a = mm * 10 * s2 * c2 / (M + mm * s2 * s2);
    return { M, mm, th, q: `A ${mm} kg block is released on a smooth ${th}° wedge of mass ${M} kg that rests on a smooth floor. Find the acceleration of the wedge (in m/s², 2 decimals, $g=10$).`, answer: +a.toFixed(2), tol: 0.02, unit: 'm/s²',
      sol: `$a_{wedge} = \\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta} = ${a.toFixed(2)}$ m/s².`, trap: 'The wedge moves, so $N \\ne mg\\cos\\theta$.' };
  }, (p) => { const th = p.th * Math.PI / 180; const N = p.M * p.mm * 10 * Math.cos(th) / (p.M + p.mm * Math.sin(th) ** 2); return N * Math.sin(th) / p.M; }),
  gx(4, 'nat', 'friction', (rng) => {
    const mm = pick(rng, 5, 30, 5); const mu = pick(rng, 0.3, 1, 0.1);
    const F = mu * mm * 10 / Math.sqrt(1 + mu * mu);
    return { mm, mu, q: `A ${mm} kg block is dragged at constant speed on a rough floor ($\\mu = ${mu}$) by a force whose direction can be chosen freely. What is the least force (in N, 1 decimal, $g=10$)?`, answer: +F.toFixed(1), tol: 0.1, unit: 'N',
      sol: `$F = \\dfrac{\\mu mg}{\\cos\\phi + \\mu\\sin\\phi}$, minimised when $\\tan\\phi = \\mu$: $F_{min} = \\dfrac{\\mu mg}{\\sqrt{1+\\mu^2}} = ${F.toFixed(1)}$ N.` };
  }, (p) => { let best = 1e9; for (let d = 0; d <= 89.99; d += 0.01) { const ph = d * Math.PI / 180; const f = p.mu * p.mm * 10 / (Math.cos(ph) + p.mu * Math.sin(ph)); if (f < best) best = f; } return best; }),
  gx(4, 'nat', 'circular motion dynamics', (rng) => {
    const l = pick(rng, 0.5, 2, 0.1); const th = choose(rng, [30, 37, 45, 53, 60]);
    const T = 2 * Math.PI * Math.sqrt(l * Math.cos(th * Math.PI / 180) / 9.8);
    return { l, th, q: `A conical pendulum has a string of length ${l} m making ${th}° with the vertical. Find its period (in s, 3 decimals, $g=9.8$).`, answer: +T.toFixed(3), tol: 0.003, unit: 's',
      sol: `$T = 2\\pi\\sqrt{\\dfrac{l\\cos\\theta}{g}} = 2\\pi\\sqrt{\\dfrac{${l}\\times${+Math.cos(th * Math.PI / 180).toFixed(4)}}{9.8}} = ${T.toFixed(3)}$ s.` };
  }, (p) => { const th = p.th * Math.PI / 180; const w = Math.sqrt(9.8 * Math.tan(th) / (p.l * Math.sin(th))); return 2 * Math.PI / w; }),
);

}

export default { topic: 'laws-of-motion', groups, items, gens };
