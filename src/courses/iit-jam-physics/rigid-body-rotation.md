---
title: Rotation, rolling and angular momentum
seoTitle: Rotation, rolling and angular momentum for IIT JAM Physics
summary: 'Torque and angular acceleration, rotational energy, conservation of angular momentum, rolling without slipping and the friction it needs, skidding balls that start to roll, pulleys and hinged rods, impulses and the sweet spot, and the precession of a gyroscope.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A solid ball is launched sliding along a rough floor at v₀ with no spin. When it starts rolling without slipping, its speed is
    choices: ['5v₀/7', 'v₀', '2v₀/7', 'v₀/2']
    ans: 0
    why: Friction acts at the contact point, so angular momentum about a fixed point on the floor is conserved. mv₀R = mvR + (2/5)mR²(v/R) gives v = 5v₀/7. Energy is not conserved while it skids.
  - q: A uniform rod hinged at one end is released from rest in a horizontal position. Its angular acceleration at that moment is
    choices: ['3g/2L', 'g/L', '3g/L', 'g/2L']
    ans: 0
    why: The torque about the hinge is mgL/2 and the moment of inertia about the end is mL²/3, so α = (mgL/2)/(mL²/3) = 3g/2L.
  - q: A ball rolls without slipping at constant velocity on a level floor. The friction force on it is
    choices: ['Zero', 'Backwards, slowing it', 'Forwards, keeping it going', 'Equal to μmg']
    ans: 0
    why: Nothing is changing, so no horizontal force is needed. Friction only acts on a rolling body when something else (a slope, a push, a torque) tries to make it slip.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapters 7 and 8: angular momentum and rigid body motion'
  - 'J. R. Taylor, Classical Mechanics (2005), chapter 10: rotational motion of rigid bodies'
  - 'H. C. Verma, Concepts of Physics, Part 1 (1992), chapter 10: rotational mechanics'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 45 minutes.** By the end you will be able to choose the right point to take torques about, solve pulley, hinged-rod and rolling problems in a few lines, decide which way friction acts on a rolling body, use conservation of angular momentum in collisions, and explain why a spinning top does not fall.

<div class="bigidea">Every rotation problem is two equations, one for the centre of mass and one for turning about it, and the art is choosing the point about which a troublesome force has no torque.</div>

## 1. The rotational toolkit

You met the moment of inertia in [lesson 2.5](/learn/courses/iit-jam-physics/moment-of-inertia/). For rotation about a fixed axis, every straight-line formula has a twin:

| Straight line | Rotation about a fixed axis |
|---|---|
| `$F = ma$` | `$\tau = I\alpha$` |
| `$p = mv$` | `$L = I\omega$` |
| `$K = \tfrac12mv^2$` | `$K = \tfrac12I\omega^2$` |
| work `$\int F\,dx$` | work `$\int\tau\,d\theta$`, power `$\tau\omega$` |

Torque about a point O is `$\vec\tau = \vec r\times\vec F$`, with `$\vec r$` from O to where the force acts; its size is force times the perpendicular distance from O to the line of the force. Two rules decide most problems:

- `$\vec\tau_{\rm ext} = d\vec L/dt$` holds about **a fixed point** or about **the centre of mass** (even when the centre of mass accelerates), but not about an arbitrary moving point.
- A force has no torque about any point on its line of action. Take torques about the point where the unknown force acts and it drops out.

**Worked example (pulley with mass).** A 2 kg block hangs from a string wound on a uniform disc pulley of 4 kg. Block: `$mg - T = ma$`. Pulley: `$TR = \tfrac12MR^2(a/R)$`, so `$T = \tfrac12Ma$`. Adding, `$a = mg/(m + M/2) = 4.9$` m/s². The pulley acts like extra mass `$I/R^2$`.

<div class="meaning">

<dl>
<dt>τ = r × F</dt><dd>how strongly a force turns things about a chosen point</dd>
<dt>L = Iω (fixed axis)</dt><dd>the amount of rotation, which only an external torque can change</dd>
<dt>I/R²</dt><dd>the extra "mass" a wheel or pulley adds to a straight-line problem</dd>
<dt>Physical meaning</dt><dd>Turning has its own inertia, momentum and energy, linked by the same rules as pushing. Torque is to spin what force is to motion.</dd>
</dl>

</div>

Slide the point where the force acts and the angle of the push, then press Play to spin the bar up.

<figure class="fig" data-fig="@mech-torque"><figcaption>Torque is force times lever arm, r F sin α. The dashed line is the line of force; the green segment is the lever arm. Along the bar (α = 0°) the torque is zero.</figcaption></figure>

## 2. Hinged rods and the hinge force

A uniform rod of length `$L$` hinged at one end and released horizontally:

- angular acceleration at release: `$\alpha = \dfrac{mgL/2}{mL^2/3} = \dfrac{3g}{2L}$`;
- the centre accelerates down at `$\alpha L/2 = 3g/4$`, so the hinge pushes up with only `$mg/4$`;
- passing the vertical: `$\omega = \sqrt{3g/L}$` (energy), `$\alpha = 0$`, and the hinge force is `$mg + m\omega^2L/2 = \tfrac52mg$`.

A rod standing on a hinge that topples hits the ground with its tip moving at `$\sqrt{3gL}$`, faster than a stone dropped from the same height.

## 3. Rolling without slipping

Rolling without slipping means the contact point is momentarily at rest: `$v_{cm} = \omega R$`. The top of a wheel moves at `$2v$`, the bottom at zero. The motion is pure rotation about the contact point, so

```math
K = \tfrac12Mv^2 + \tfrac12I\omega^2 = \tfrac12Mv^2\Big(1 + \frac{I}{MR^2}\Big), \qquad a_{\rm slope} = \frac{g\sin\theta}{1 + I/MR^2}
```

The quickest derivation of the slope result is torques about the contact point, where friction and the normal force have no torque: `$MgR\sin\theta = (I + MR^2)\alpha$`.

<figure class="fig" data-fig="rolling-race"><figcaption>Four bodies, four identical slopes, released together. The solid sphere (I/MR² = 2/5) always wins and the ring (1) always loses, whatever their masses and radii. Change the angle: the order never changes.</figcaption></figure>

**Which way does friction act?** Ask what would happen without it. On a slope, gravity alone would make the body slide without turning, so static friction acts **up the slope** to spin it up: `$f = \dfrac{Mg\sin\theta}{1 + MR^2/I}$`. For a solid cylinder `$f = \tfrac13Mg\sin\theta$`, so rolling needs `$\mu \ge \tfrac13\tan\theta$`. On level ground at constant speed, friction is **zero**. Static friction on a rolling body does no work, because it acts on a point at rest.

<div class="problem" data-problem="rolling-incline-speed"></div>

## 4. Skidding, then rolling

A bowling ball released sliding with no spin skids at first. Kinetic friction `$\mu mg$` slows the centre and spins the ball up until `$v = \omega R$`. You can follow the times, but the final speed comes faster from one conserved quantity:

<div class="steps">
<div class="step"><p><b>Pick the point.</b> Choose any fixed point on the floor along the line of contact. Friction acts along the floor through it, and gravity and the normal force cancel.</p></div>
<div class="step"><p><b>Angular momentum is kept about it.</b> Before: m v₀ R (the centre moves at height R above the floor; no spin).</p></div>
<div class="step"><p><b>After.</b> L = m v R + I ω = m v R + (2/5) m R² (v/R) = (7/5) m v R.</p></div>
<div class="step"><p><b>Result.</b> v = 5v₀/7, whatever the friction coefficient. The ball loses 2/7 of its kinetic energy as heat while skidding.</p></div>
</div>

With backspin `$\omega_0$`, the same method gives `$v = (5v_0 - 2\omega_0R)/7$`: with enough backspin (`$\omega_0R > 2.5v_0$`) the ball comes back, the snooker "screw shot". A disc spun up and set down on the floor with no forward speed ends up rolling at `$\omega_0R/3$`.

<div class="problem" data-problem="skid-to-roll"></div>

## 5. Conservation of angular momentum

With no external torque about an axis, `$L$` about it is constant. Inside a system, forces come in equal and opposite pairs along the same line, so they cannot change the total.

- **Skater or diver:** `$I_1\omega_1 = I_2\omega_2$`. The kinetic energy `$L^2/2I$` goes **up** when `$I$` goes down; the extra comes from the work her muscles do.
- **Coupling two wheels:** `$\omega = I_1\omega_1/(I_1 + I_2)$`; a fraction `$I_2/(I_1 + I_2)$` of the energy is lost, the rotational twin of a perfectly inelastic collision.
- **Collisions with a pivot:** a bullet hitting a hanging rod. The pivot pushes during the impact, so linear momentum is **not** kept, but angular momentum about the pivot is.
- **Free bodies:** a puck hitting a rod on ice. Use momentum for the centre of mass and angular momentum about the new centre of mass.

**Worked example.** A 10 g bullet at 300 m/s lodges in the bottom of a 3 kg, 1 m rod hanging from a pivot at its top. `$0.01\times300\times1 = (\tfrac13\times3\times1^2 + 0.01\times1^2)\,\omega$`, so `$\omega = 3/1.01 = 2.97$` rad/s.

**The sweet spot.** Strike a hanging rod at distance `$x$` below the pivot. The pivot feels no impulse if `$x = I_{\rm pivot}/(Md) = 2L/3$`, the centre of percussion. A ball struck at `$7R/5$` above the floor rolls at once without needing friction.

<div class="myth">

**"A rolling ball is slowed down by friction."** Static friction on a ball rolling at constant speed is zero, and it does no work even when it acts. Real balls slow down because the ball and floor deform a little (rolling resistance) and because of air drag. Kinetic friction does slow a ball that is **skidding**, until it starts to roll.

</div>

Press Pull in / push out, or slide the weights' radius, and watch ω, I, L and the kinetic energy.

<figure class="fig" data-fig="@mech-skater"><figcaption>L = Iω stays level because no outside torque acts. As the weights come in, I falls and ω rises; the kinetic energy rises too, supplied by the work of pulling the weights inwards.</figcaption></figure>

## 6. Precession: why a top does not fall

A fast top with spin angular momentum `$\vec L$` (size `$I\omega$`) tilted at an angle feels gravity's torque `$mgr\sin\theta$`, horizontal and at right angles to `$\vec L$`. Since `$d\vec L = \vec\tau\,dt$`, the torque only swings `$\vec L$` sideways: the axis sweeps round a cone instead of falling.

```math
\Omega = \frac{mgr}{I\omega}
```

The tilt cancels, and a slower spin precesses **faster**, which is why a top wobbles more and more as it slows. Gyroscopes in phones and spacecraft use the same `$d\vec L = \vec\tau\,dt$`. For the full theory with the inertia tensor and Euler's equations, see GATE [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/).

To check a body's moment of inertia, use the [moment of inertia calculator](/science/moment-of-inertia/); to see friction and rolling on a slope, try the [friction ramp](/learn/friction-ramp/).

Press Play, then change the spin and the hung mass. Drag the picture to look from other sides.

<figure class="fig" data-fig="@mech-gyro"><figcaption>The torque is horizontal and perpendicular to L, so L turns rather than falls. Precession Ω = τ/L is faster for a slower spin or a bigger torque.</figcaption></figure>

<div class="keypoints">

- `$\tau = I\alpha$`, `$L = I\omega$`, `$K = \tfrac12I\omega^2$`, power `$\tau\omega$`. `$\vec\tau = d\vec L/dt$` about a fixed point or the centre of mass.
- Take torques about the point where an unknown force acts. Pulleys add `$I/R^2$` to the mass.
- Hinged rod from horizontal: `$\alpha = 3g/2L$`, hinge force `$mg/4$` at release; `$\omega = \sqrt{3g/L}$` and hinge force `$\tfrac52mg$` at the bottom.
- Rolling: `$v = \omega R$`, `$a = g\sin\theta/(1 + I/MR^2)$`; friction on a slope points up it and does no work; on level ground at constant speed it is zero.
- Skid to roll: angular momentum about a floor point; a solid ball ends at `$5v_0/7$`, losing 2/7 of its energy.
- No external torque: `$I\omega$` constant; kinetic energy need not be. Pivoted collisions keep `$L$` about the pivot, not momentum.
- Precession of a fast top: `$\Omega = mgr/I\omega$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [rotation practice page](/learn/courses/iit-jam-physics/practice/rigid-body-rotation/).

<div class="qbank" data-bank="physics" data-topics="rigid-body-rotation" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.5, [moment of inertia](/learn/courses/iit-jam-physics/moment-of-inertia/). **Next:** lesson 2.7, [elasticity](/learn/courses/iit-jam-physics/elasticity/), where solid bodies stop being perfectly rigid.

**Go deeper:** GATE's [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/) handles tops and gyroscopes with Euler's equations, and [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/) treats rolling as a constraint.
