// Round 4 extras for newtons-laws-frames: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const OM = 7.29e-5, RE = 6.37e6, G = 9.8;
const plumb = (latDeg) => { const l = latDeg * Math.PI / 180, c = OM * OM * RE; return Math.atan(c * Math.sin(l) * Math.cos(l) / (G - c * Math.cos(l) ** 2)) * 180 / Math.PI; };

export default {
  items: [
    { id: 'nlf-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'newton laws',
      q: R`A 0.5 kg ball moving along $+x$ with momentum 3 kg m/s hits a wall and leaves with momentum 2 kg m/s along $-x$. The contact lasts 0.1 s. The average force of the wall on the ball is`,
      options: ['10 N along $+x$', '50 N along $-x$', '10 N along $-x$', '50 N along $+x$'], answer: 1,
      sol: R`Newton's second law in momentum form: $\vec F_{\text{avg}} = \Delta\vec p/\Delta t$. With $+x$ positive, $\Delta p = (-2) - (+3) = -5$ kg m/s, so $F = -5/0.1 = -50$ N: 50 N along $-x$, pointing away from the wall as it must.`,
      trap: R`Momentum is a vector: reversing direction adds the two sizes, it does not subtract them.` },
    { id: 'nlf-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'newton laws',
      q: R`A light spring balance hangs horizontally in the middle of a light string that runs over two smooth pulleys at the edges of a table. A 5 kg mass hangs from each end of the string, and everything is at rest. The balance reads`,
      options: ['zero, because the two pulls cancel', '10 kg', '5 kg', '2.5 kg'], answer: 2,
      sol: R`Each mass is at rest, so the string holding it has tension $T = 5g$. The string is light, so the tension is $5g$ all along it, and the balance, which measures the tension pulling its hook, reads $5g = 49$ N, i.e. "5 kg". The other mass only provides the balancing pull that a wall or hook would supply if one side were tied down.`,
      trap: R`The net force on the balance is zero, but a balance shows the tension, not the net force.` },
    { id: 'nlf-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'newton laws',
      q: R`A 2 kg block at rest on a smooth floor is pushed by a horizontal force $F = 6t$ N ($t$ in s). Its speed at $t = 2$ s is ______ m/s.`,
      answer: 6, tol: 0.01, unit: 'm/s', calc: () => 6 * 4 / (2 * 2),
      sol: R`$a = F/m = 3t$ m/s², so $v = \displaystyle\int_0^2 3t\,dt = \tfrac32t^2\Big|_0^2 = 6$ m/s. (Equivalently, the impulse $\int F\,dt = 3t^2|_0^2 = 12$ N s, divided by 2 kg.)`,
      trap: R`$a$ is not constant, so $v = at$ with the final $a$ (12 m/s) is wrong.` },
    { id: 'nlf-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'constraints', format: 'statements',
      q: R`A 60 kg painter sits in a 20 kg chair hung from a light rope that runs over a fixed smooth pulley; the painter holds the other end of the rope and pulls so that he and the chair rise at constant speed. With $g = 9.8$ m/s², which statements are true?`,
      options: ['The tension in the rope is 392 N', 'The chair pushes up on the painter with 196 N', 'The tension equals his weight, 588 N', 'If he pulls harder, he and the chair accelerate upward'], answer: [0, 1, 3],
      sol: R`Take painter and chair together (80 kg): two rope segments pull up on them, one at the chair and one in his hands, so $2T = 80g$ and $T = 40g = 392$ N. For the painter alone: $T + N = 60g$, so $N = 20g = 196$ N. Pulling harder makes $2T > 80g$, so the pair accelerates up.`,
      trap: R`Both rope ends act on the system, so each carries only half the total weight.` },
    { id: 'nlf-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'rotating frames',
      q: R`At latitude $45^\circ$N, a plumb line at rest relative to the ground hangs along the effective gravity. If that line is extended down through the Earth (taken as a sphere), it passes`,
      options: ['slightly south of the centre (towards the equator side)', 'slightly north of the centre', 'exactly through the centre', 'slightly east of the centre'], answer: 0,
      sol: R`In the rotating frame the bob feels true gravity (towards the centre) plus the centrifugal force $m\Omega^2\rho$, which points away from the axis. At $45^\circ$N the centrifugal force has an outward part and a part pointing towards the equator (south). Adding it tilts the effective gravity slightly south, so the line drawn down from the bob misses the centre on the southern side, by about $0.1^\circ$.`,
      trap: R`The centrifugal force points away from the axis, not away from the centre; that is why it tilts the vertical.` },
    { id: 'nlf-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'friction',
      q: R`A 4 kg block on a horizontal table ($\mu_k = 0.25$) is tied by a light string over a smooth pulley at the table's edge to a hanging 2 kg block. Once moving, the acceleration is ______ m/s² ($g = 9.8$ m/s², two decimal places).`,
      answer: 1.63, tol: 0.01, unit: 'm/s²', calc: () => (2 * 9.8 - 0.25 * 4 * 9.8) / 6,
      sol: R`The hanging weight $2g = 19.6$ N drives both blocks; kinetic friction $0.25\times4g = 9.8$ N opposes. $a = \dfrac{19.6 - 9.8}{6} = 1.63$ m/s². (The string tension is $2(g - a) = 16.3$ N, between the friction and the hanging weight.)`,
      trap: R`The whole 6 kg accelerates, not only the hanging block.` },
    { id: 'nlf-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'rotating frames',
      q: R`A merry-go-round turns anticlockwise as seen from above. A rider near the centre rolls a ball along the smooth floor straight outward relative to the floor. As seen by riders, the ball's path`,
      options: ['stays a straight radial line', 'curves to the left of its direction of motion', 'curves upward off the floor', 'curves to the right of its direction of motion'], answer: 3,
      sol: R`In the rotating frame the Coriolis force is $-2m\vec\omega\times\vec v$. With $\vec\omega$ up and $\vec v$ outward, $\vec\omega\times\vec v$ points along the direction of rotation (anticlockwise), so the force points against it: to the right of the ball's motion. Seen from the ground, the ball goes straight while the floor turns anticlockwise under it, which is the same thing.`,
      trap: R`The sign is the same as for the northern hemisphere, where the Earth also turns anticlockwise seen from above the pole.` },
    { id: 'nlf-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rotating frames',
      q: R`Take the Earth as a sphere of radius $6.37\times10^6$ m spinning at $7.29\times10^{-5}$ rad/s, with true gravity $9.8$ m/s² towards the centre. At latitude $45^\circ$ the angle between a plumb line and the line to the Earth's centre is ______ degrees (to three decimal places).`,
      answer: 0.099, tol: 0.001, unit: '°', calc: () => plumb(45),
      sol: R`The centrifugal acceleration is $\Omega^2R\cos\lambda$ away from the axis. Split along the radius and along the ground: radial $\Omega^2R\cos^2\lambda$ (outward) and horizontal $\Omega^2R\sin\lambda\cos\lambda$ (towards the equator). With $\Omega^2R = 0.03385$ m/s²: $\tan\delta = \dfrac{0.03385\times0.5}{9.8 - 0.03385\times0.5} = 0.00173$, so $\delta = 0.099^\circ$. It is largest at $45^\circ$ and zero at the poles and the equator.`,
      trap: R`Use $\sin\lambda\cos\lambda$ for the sideways part; $\cos\lambda$ alone gives the whole centrifugal force, not its tilting component.` },
    { id: 'nlf-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'newton laws', format: 'statements',
      q: R`Blocks of masses $m_1$ and $m_2$ on a smooth floor are joined by a light spring at its natural length. A constant horizontal force $F$ starts pushing $m_1$ towards $m_2$ at $t = 0$. Which statements are true?`,
      options: ['The spring force equals $F$ at all times', 'Just after $t = 0$, $m_2$ has zero acceleration', 'The centre of mass accelerates at $F/(m_1 + m_2)$ at all times', 'Just after $t = 0$, $m_1$ accelerates at $F/m_1$'], answer: [1, 2, 3],
      sol: R`At $t = 0$ the spring is unstretched, so it exerts no force: $m_1$ starts with $F/m_1$ and $m_2$ with zero. The only external horizontal force on the pair is $F$, so the centre of mass accelerates at $F/(m_1 + m_2)$ throughout, while the spring force oscillates about $Fm_2/(m_1 + m_2)$; it never settles to $F$.`,
      trap: R`A spring cannot change its length instantly, so its force starts at zero.` },
    { id: 'nlf-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'rotating frames',
      q: R`A bead slides without friction on a vertical circular hoop of radius 0.2 m that spins about its vertical diameter at 10 rad/s. In the hoop's rotating frame, the bead rests at an angle $\theta$ from the bottom given by $\cos\theta = g/(\omega^2R)$. That angle is ______ degrees ($g = 9.8$ m/s², two decimal places).`,
      answer: 60.66, tol: 0.05, unit: '°', calc: () => Math.acos(9.8 / (100 * 0.2)) * 180 / Math.PI,
      sol: R`In the rotating frame the bead feels gravity $mg$ down, the centrifugal force $m\omega^2R\sin\theta$ outward and the normal force along the radius. Balance along the hoop's tangent: $mg\sin\theta = m\omega^2R\sin\theta\cos\theta$, so either $\sin\theta = 0$ or $\cos\theta = \dfrac{g}{\omega^2R} = \dfrac{9.8}{20} = 0.49$, $\theta = 60.66^\circ$. This off-bottom position exists only because $\omega^2R > g$; it is then the stable one (the bottom becomes unstable).`,
      trap: R`Below the critical spin $\omega^2 = g/R$ the only equilibrium is the bottom; check that $\cos\theta < 1$ first.` },
  ],
  gens: [
    { id: 'nlf-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rotating frames',
      make(r) {
        const lat = int(r, 5, 85), answer = round(plumb(lat), 4);
        const c = OM * OM * RE, l = lat * Math.PI / 180;
        return { q: R`Model the Earth as a sphere of radius $6.37\times10^6$ m spinning at $7.29\times10^{-5}$ rad/s, with true gravity $9.8$ m/s² towards the centre. Find the angle (degrees, four decimal places) between a plumb line at latitude ${lat}° and the line to the Earth's centre.`,
          answer, tol: 0.0003, unit: '°', lat,
          sol: R`Centrifugal acceleration $\Omega^2R\cos\lambda$ away from the axis; its part along the ground is $\Omega^2R\sin\lambda\cos\lambda = ${round(c * Math.sin(l) * Math.cos(l), 5)}$ m/s² and its outward radial part $\Omega^2R\cos^2\lambda = ${round(c * Math.cos(l) ** 2, 5)}$ m/s². $\tan\delta = \dfrac{${round(c * Math.sin(l) * Math.cos(l), 5)}}{9.8 - ${round(c * Math.cos(l) ** 2, 5)}}$, so $\delta = ${answer}^\circ$.`,
          trap: 'The tilt comes from the part of the centrifugal force along the ground, $\\propto\\sin\\lambda\\cos\\lambda$.' };
      },
      verify: (p) => plumb(p.lat) },
    { id: 'nlf-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rotating frames',
      make(r) {
        const Rh = pick(r, 0.1, 0.5, 0.05), f = pick(r, 1.2, 3, 0.1), w = round(Math.sqrt(G / Rh) * f, 1);
        const answer = round(Math.acos(G / (w * w * Rh)) * 180 / Math.PI, 2);
        return { q: R`A bead slides without friction on a vertical hoop of radius ${Rh} m that spins about its vertical diameter at ${w} rad/s. Find the angle from the bottom (degrees) at which the bead can stay at rest relative to the hoop, away from the bottom ($g = 9.8$ m/s²).`,
          answer, tol: 0.05, unit: '°', Rh, w,
          sol: R`Along the hoop, gravity's component $mg\sin\theta$ balances the centrifugal component $m\omega^2R\sin\theta\cos\theta$, so $\cos\theta = \dfrac{g}{\omega^2R} = \dfrac{9.8}{${w}^2\times${Rh}} = ${round(G / (w * w * Rh), 4)}$ and $\theta = ${answer}^\circ$.`,
          trap: 'This position exists only when $\\omega^2R > g$.' };
      },
      verify: (p) => Math.acos(G / (p.w * p.w * p.Rh)) * 180 / Math.PI },
    { id: 'nlf-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'friction',
      make(r) {
        const mu = pick(r, 0.1, 0.5, 0.05), m1 = int(r, 1, 6), m2 = round(mu * m1 + pick(r, 0.5, 4, 0.5), 2), askT = r() < 0.5;
        const a = (m2 - mu * m1) * G / (m1 + m2), T = m2 * (G - a);
        const answer = round(askT ? T : a, 3);
        return { q: R`A ${m1} kg block on a horizontal table ($\mu_k = ${mu}$) is tied by a light string over a smooth pulley at the table's edge to a hanging ${m2} kg block. Once the blocks are moving, find ${askT ? 'the tension in the string (N)' : 'their acceleration (m/s²)'} ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.005, answer * 0.003), unit: askT ? 'N' : 'm/s²', mu, m1, m2, askT,
          sol: R`$a = \dfrac{m_2g - \mu m_1g}{m_1 + m_2} = \dfrac{${m2}\times9.8 - ${mu}\times${m1}\times9.8}{${round(m1 + m2, 2)}} = ${round(a, 3)}$ m/s².${askT ? R` For the hanging block, $m_2g - T = m_2a$, so $T = ${m2}(9.8 - ${round(a, 3)}) = ${answer}$ N.` : ''}`,
          trap: 'Friction acts only on the block on the table; the whole system accelerates together.' };
      },
      verify: (p) => { const a = (p.m2 - p.mu * p.m1) * G / (p.m1 + p.m2); return p.askT ? p.m2 * (G - a) : a; } },
  ],
};
