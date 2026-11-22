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

export default { topic: 'laws-of-motion', groups, items, gens };
