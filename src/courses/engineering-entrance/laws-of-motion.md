---
title: Laws of motion and friction
seoTitle: 'Laws of motion and friction: JEE and NEET physics'
summary: 'Newton''s three laws, momentum and impulse, free-body diagrams, tension, pulleys and constraints, lifts and pseudo forces, static and kinetic friction on blocks and slopes, circular motion, banked roads and the vertical circle.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'A block rests on a slope at 20°. The coefficient of static friction is 0.6 and the block weighs 10 N. The friction force on it is:'
    choices: ['6 N', '10 N', 'about 3.4 N', 'zero']
    ans: 2
    why: 'Static friction is only as big as it needs to be. It balances mg sin 20° = 10 × 0.342 ≈ 3.4 N. The value μN (about 5.6 N) is only its upper limit.'
  - q: 'A person stands on a weighing scale in a lift that accelerates downwards at g/4. The scale reads:'
    choices: ['mg', '3mg/4', '5mg/4', 'zero']
    ans: 1
    why: 'mg − N = m(g/4), so N = 3mg/4. The scale shows the normal force, not the true weight.'
  - q: 'A ball is tied to a string and whirled in a vertical circle of radius r. The least speed at the top for the string to stay tight is:'
    choices: ['zero', '√(gr)', '√(2gr)', '√(5gr)']
    ans: 1
    why: 'At the top, T + mg = mv²/r. The string just stays tight when T = 0, so v² = gr.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Laws of motion'
  - 'Standard gravity g = 9.806 65 m/s² (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 36 minutes.** By the end you will be able to draw a correct free-body diagram for any body, solve pulley, lift and wedge problems, decide whether a block slips and how fast, and handle circular motion on flat, banked and vertical paths.

<div class="bigidea">A force is a push or pull from another body. Add up all the real forces on one body and that net force equals mass times acceleration. Nearly every mistake in this chapter is a missing force, an invented force or forces on two bodies mixed in one equation.</div>

## 1. Newton's three laws

- **First law (inertia).** A body keeps its velocity (including zero) unless a net force acts. It defines an **inertial frame**: one in which this law holds. The ground is very nearly one; an accelerating car or lift is not.
- **Second law.** The net force equals the rate of change of momentum, `$\vec F = \dfrac{d\vec p}{dt}$`, where `$\vec p = m\vec v$`. For constant mass, `$\vec F = m\vec a$`. Unit: newton, 1 N = 1 kg m/s².
- **Third law.** If A pushes B, B pushes A with an equal and opposite force. The pair act on **different bodies**, so they never cancel each other.

**Impulse** is force × time, `$J = F\,\Delta t = \Delta p$`. The same change of momentum spread over a longer time needs a smaller force: that is why a cricketer pulls the hands back while catching and why cars have crumple zones. On an F-t graph, impulse is the area.

**Conservation of momentum.** With no external force, the total momentum of a system stays constant. A gun recoils because bullet and gun share zero total momentum: `$m v = M V$`.

<div class="myth">

**"Action and reaction cancel, so nothing can move."** They act on different bodies. The horse pulls the cart and the cart pulls the horse back, but the horse moves forward because the ground pushes its hooves forward more than the cart pulls back.

</div>

## 2. Free-body diagrams, tension and pulleys

Pick **one** body. Draw it alone and draw every force on it: weight mg (down), normal force N (perpendicular to the surface it touches), tension T (along each string, pulling away), friction f (along the surface), spring force `$kx$`, and any applied force. Then write `$\sum F = ma$` along chosen axes.

- A light string has the same tension all along it; over a light, smooth pulley the tension is the same on both sides.
- **Constraints:** if a string's length is fixed, the motions of the bodies it joins are linked. For a movable pulley holding a block, the block moves half as far as the free end: `$a_{block} = a_{end}/2$`.
- A spring cannot change its length instantly, so its force is the same just before and just after a string is cut.

**Atwood machine** (masses m₁ < m₂ over a pulley): `$a = \dfrac{(m_2 - m_1)g}{m_1 + m_2}$`, `$T = \dfrac{2m_1m_2 g}{m_1 + m_2}$`.

<div class="problem" data-problem="lom-atwood"></div>

**Contact forces between blocks.** A force F pushes blocks m₁ and m₂ side by side on a smooth floor. Both move with a = F/(m₁ + m₂), and the force between them is the force that accelerates the block in front: `$m_2 F/(m_1 + m_2)$`.

## 3. Lifts and pseudo forces

In a lift with acceleration a (up positive), the scale reads the normal force: `$N = m(g + a)$`. Going up faster or slowing on the way down, you feel heavier; in free fall (a = −g) the scale reads zero: **weightlessness**.

Inside an accelerating frame (a car, a lift), you may add a **pseudo force** `$-m\vec a_{frame}$` to every body and then treat the frame as if it were at rest. A pendulum in a car accelerating at a hangs at `$\tan\theta = a/g$`. Never use pseudo forces in the ground frame.

## 4. Friction

Friction acts along the surface and opposes **relative sliding** (or the tendency to slide).

| Kind | Size | When |
|---|---|---|
| Static | `$0 \le f_s \le \mu_s N$`, just enough to stop slipping | no relative sliding |
| Kinetic | `$f_k = \mu_k N$`, fixed | surfaces sliding; usually μk < μs |

Tilt the slope below and watch static friction grow with the slope until it hits μs N, then the block slips.

<figure class="fig" data-fig="lom-incline"><figcaption>A block on a rough slope. Static friction matches mg sin θ exactly, until it reaches its limit μs N. Past the angle of repose, tan θ = μs, the block slides and friction drops to μk N.</figcaption></figure>

<div class="meaning">
<dl>
<dt>μs, μk</dt><dd>coefficients of static and kinetic friction, numbers with no unit</dd>
<dt>N</dt><dd>normal force, the push of the surface perpendicular to it; not always mg</dd>
<dt>θ</dt><dd>angle of the slope; the angle of repose is where tan θ = μs</dd>
<dt>Physical meaning</dt><dd>Static friction is a "helper" force: it gives whatever is needed, up to a limit. Kinetic friction is fixed once sliding starts.</dd>
</dl>
</div>

On a slope: sliding down, `$a = g(\sin\theta - \mu_k\cos\theta)$`; pushed up and sliding up, `$a = -g(\sin\theta + \mu_k\cos\theta)$`.

<div class="problem" data-problem="lom-incline-friction"></div>

**Block on block (JEE).** A force F pulls the lower block B (mass M) with a block A (mass m) on top; friction μ between them, smooth floor. They move together while the friction needed on A, `$mF/(m + M)$`, stays below μmg, so the largest F for moving together is `$\mu (m + M) g$`. Beyond that, A slips and gets only `$a_A = \mu g$`.

<div class="myth">

**"Friction always opposes motion."** It opposes **relative sliding**. When you walk, friction on your foot points forwards, in the direction you move. On a block placed on an accelerating truck, friction drives the block forward.

</div>

**Pulling at an angle.** A rope pulling up at angle α reduces N to `$mg - F\sin\alpha$` and so reduces friction. The least force to drag a block is `$\dfrac{\mu mg}{\sqrt{1 + \mu^2}}$`, at `$\tan\alpha = \mu$`.

## 5. Circular motion dynamics

The net inward force must be `$mv^2/r$`. Name the real force that supplies it.

- **Flat road:** friction. Greatest safe speed `$v = \sqrt{\mu r g}$`.
- **Banked road (no friction):** the normal force tilts inward: `$\tan\theta = \dfrac{v^2}{rg}$`.
- **Banked road with friction:** `$v_{max}^2 = rg\dfrac{\mu + \tan\theta}{1 - \mu\tan\theta}$`, and with μ replaced by −μ for the least speed.

<div class="problem" data-problem="lom-banking"></div>

- **Conical pendulum** (string length L at angle θ): `$\tan\theta = v^2/(rg)$`, period `$2\pi\sqrt{L\cos\theta/g}$`.
- **Vertical circle on a string:** at the top `$T + mg = mv^2/r$`, at the bottom `$T - mg = mv^2/r$`. To just complete the circle: `$v_{top} = \sqrt{gr}$`, `$v_{bottom} = \sqrt{5gr}$`, and the tension at the bottom is then 6mg. A rod (which can push) needs only `$v_{top} = 0$`, so `$v_{bottom} = 2\sqrt{gr}$`.

**Worked example (level 4, wedge).** A block sits on a smooth wedge of angle θ. How fast must the wedge accelerate sideways so the block does not slide? In the wedge's frame, the pseudo force ma (backwards) and gravity must have no component along the slope: `$ma\cos\theta = mg\sin\theta$`, so **a = g tan θ**.

<div class="keypoints">

- F = dp/dt; for fixed mass F = ma. Impulse = FΔt = Δp = area under F-t.
- Action and reaction act on different bodies; momentum is conserved with no external force.
- One body per free-body diagram; strings give equal tension over smooth pulleys; constraints link accelerations.
- Lift: N = m(g + a); free fall gives N = 0. Pseudo force −ma only in an accelerating frame.
- Static friction ≤ μs N (only what is needed); kinetic = μk N; angle of repose tan θ = μs.
- Slope: a = g(sin θ − μ cos θ) down; least pulling force μmg/√(1 + μ²).
- Flat curve v = √(μrg); banked tan θ = v²/rg; vertical circle on a string: √(gr) at top, √(5gr) at bottom.

</div>
