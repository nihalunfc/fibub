---
title: Work, energy and power
seoTitle: 'Work, energy and power: JEE and NEET physics'
summary: 'Work by constant and variable forces, kinetic energy and the work-energy theorem, conservative forces and potential energy, spring energy, conservation of energy with friction, potential energy curves, power, and energy in the vertical circle.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'The momentum of a body is doubled. Its kinetic energy becomes:'
    choices: ['double', 'four times', 'half', 'the same']
    ans: 1
    why: 'K = p²/2m. Doubling p multiplies K by 4.'
  - q: 'A man carries a heavy box across a level floor at constant speed. The work done by his upward holding force on the box is:'
    choices: ['positive', 'negative', 'zero', 'mg times the distance']
    ans: 2
    why: 'The holding force is vertical and the displacement is horizontal. W = Fs cos 90° = 0, even though he gets tired (his muscles use energy internally).'
  - q: 'On a potential energy curve, a particle is in stable equilibrium where:'
    choices: ['U is greatest', 'U is least (a valley)', 'U is zero', 'the slope of U is largest']
    ans: 1
    why: 'At a valley dU/dx = 0, so no force; and a small push either way gives a force −dU/dx pointing back to the valley.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Work, energy and power'
  - 'Standard gravity g = 9.806 65 m/s² (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 34 minutes.** By the end you will be able to find the work done by any force, use the work-energy theorem to skip the force equations, read a potential energy curve, handle springs and friction, and work out power and efficiency.

<div class="bigidea">Work is how a force moves energy into or out of a body. Add up the work of every force and you get the change in kinetic energy. When the forces are conservative, their work can be stored as potential energy, and the total energy never changes.</div>

## 1. Work

A constant force F that moves its point of action through a displacement s does work

```math
W = \vec F\cdot\vec s = Fs\cos\theta
```

where θ is the angle between the force and the displacement. Work is a scalar, measured in joules (1 J = 1 N m).

- θ < 90°: positive work, the force adds energy (gravity on a falling ball).
- θ = 90°: zero work (the normal force on a block sliding on a level floor, the tension in a string whirling a stone in a circle).
- θ > 90°: negative work, the force takes energy away (kinetic friction on a sliding block).

**Variable force.** Split the path into small steps and add: `$W = \int F\,dx$`, which is the **area under the F-x graph**. A spring stretched from x₁ to x₂ against its pull needs `$W = \tfrac12 k(x_2^2 - x_1^2)$`.

<div class="myth">

**"No motion, no effort, so no work; lots of effort, lots of work."** Work in physics is only Fs cos θ. Holding a heavy bag still does no work on the bag. Your muscles do use energy, but that energy becomes heat inside you, not work on the bag.

</div>

## 2. Kinetic energy and the work-energy theorem

A body of mass m moving at v has **kinetic energy** `$K = \tfrac12 mv^2 = \dfrac{p^2}{2m}$`. The **work-energy theorem** says:

```math
W_{\text{all forces}} = K_f - K_i
```

It holds for any force, constant or not, and along any path. It is often faster than F = ma because you need only the start and end speeds, not the acceleration on the way.

<div class="problem" data-problem="wep-friction-stop"></div>

**K and p.** For the same momentum, the lighter body has more kinetic energy (K = p²/2m). When a bomb at rest splits in two, the pieces share equal and opposite momenta, so the lighter piece carries more of the energy.

## 3. Conservative forces and potential energy

A force is **conservative** if the work it does between two points does not depend on the path; equivalently, its work round any closed loop is zero. Gravity, spring forces and electric forces are conservative. Friction and air drag are not: they always take energy away and turn it into heat.

For a conservative force we define **potential energy** U so that the force's work is the loss in U: `$W = -\Delta U$`, and in one dimension

```math
F = -\frac{dU}{dx}
```

- Gravity near the Earth: `$U = mgh$` (the zero level is your choice; only changes matter).
- Spring stretched or squeezed by x: `$U = \tfrac12 kx^2$`, always positive.

<div class="problem" data-problem="wep-spring-compress"></div>

## 4. Conservation of mechanical energy

If only conservative forces do work, `$K + U$` stays constant. If friction (or another non-conservative force) also acts:

```math
K_i + U_i = K_f + U_f + |W_{\text{friction}}|
```

The energy lost to friction is the heat produced, μN × (distance slid), not μN × displacement.

<div class="meaning">
<dl>
<dt>W</dt><dd>work done by a force, Fs cos θ or the area under F-x</dd>
<dt>K</dt><dd>kinetic energy, ½mv² = p²/2m</dd>
<dt>U</dt><dd>potential energy of a conservative force; F = −dU/dx</dd>
<dt>k</dt><dd>spring constant, the force per metre of stretch (N/m)</dd>
<dt>Physical meaning</dt><dd>Energy is never made or lost; it moves between kinetic, stored and heat. Work is the name for energy moved by a force.</dd>
</dl>
</div>

## 5. Reading a potential energy curve

The curve U(x) tells the whole story of a one-dimensional motion for a given total energy E. Change the curve and the energy below.

<figure class="fig" data-fig="wep-energy-curve"><figcaption>The particle can only be where E ≥ U (shaded). The gap E − U is its kinetic energy. It turns back where E = U. The force −dU/dx always points downhill on the curve.</figcaption></figure>

<div class="steps">
<div class="step"><b>Force from slope.</b> F = −dU/dx: where U rises to the right, the force points left, and the steeper the curve, the bigger the force.</div>
<div class="step"><b>Equilibrium.</b> Where the slope is zero there is no force. A valley is stable (pushed away, it comes back); a hill is unstable; a flat stretch is neutral.</div>
<div class="step"><b>Turning points.</b> Where the energy line meets the curve, K = 0 and the particle reverses. Between two turning points it oscillates; with only one it escapes.</div>
<div class="step"><b>Bonds.</b> Two atoms have a U curve with a valley at the bond length. The depth of the valley is the energy needed to break the bond.</div>
</div>

## 6. Power

Power is the rate of doing work: `$P = \dfrac{dW}{dt} = \vec F\cdot\vec v$`. Units: watt (1 W = 1 J/s); 1 horsepower = 746 W. A kilowatt-hour (kWh) is an energy unit, 3.6 × 10⁶ J.

- At constant power, a car's driving force F = P/v falls as it speeds up; its top speed is where P/v equals the resistance.
- A pump lifting water at a mass rate m/t through height h, and giving it speed v, needs `$P = \dfrac{m}{t}\left(gh + \tfrac12 v^2\right)$` ÷ efficiency.

<div class="problem" data-problem="wep-power-incline"></div>

## 7. Energy in the vertical circle (JEE Advanced)

A bob on a string of length r is given speed u at the lowest point. Energy gives the speed at angle θ from the bottom: `$v^2 = u^2 - 2gr(1 - \cos\theta)$`. Newton's second law along the string gives the tension: `$T = \dfrac{mv^2}{r} + mg\cos\theta$`.

| Speed at the bottom | What happens |
|---|---|
| `$u \ge \sqrt{5gr}$` | completes the circle |
| `$\sqrt{2gr} < u < \sqrt{5gr}$` | string goes slack above the centre; the bob then flies off as a projectile |
| `$u \le \sqrt{2gr}$` | swings like a pendulum, never above the centre |

**Worked example (level 4).** A small block slides from rest off the top of a smooth hemisphere of radius R. Where does it leave the surface? At angle θ from the top, energy gives `$v^2 = 2gR(1 - \cos\theta)$`. It leaves when the normal force becomes zero: `$mg\cos\theta = mv^2/R$`. So `$\cos\theta = 2(1 - \cos\theta)$`, **cos θ = 2/3**, at a height of 2R/3 above the centre.

<div class="myth">

**"Potential energy belongs to the body alone."** It belongs to the system: the body and the Earth, or the two ends of a spring. That is why only changes in U mean anything, and why you are free to choose where U = 0.

</div>

<div class="keypoints">

- W = Fs cos θ; variable force: area under F-x; a spring from x₁ to x₂: ½k(x₂² − x₁²).
- Work-energy theorem: total work of all forces = change in kinetic energy.
- K = ½mv² = p²/2m; same momentum, the lighter body has more K.
- Conservative force: path-independent work, F = −dU/dx; U = mgh, ½kx².
- With friction: initial energy = final energy + heat (μN × distance slid).
- U curve: valley stable, hill unstable; turning points where E = U.
- Power P = F·v; top speed where P/v = resistance; 1 kWh = 3.6 MJ.
- Vertical circle on a string: √(5gr) at the bottom to complete it.

</div>
