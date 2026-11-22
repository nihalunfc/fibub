---
title: Variable mass systems and rockets
seoTitle: Variable mass and the rocket equation for IIT JAM Physics
summary: 'How to apply Newton''s second law when mass flows in or out: thrust, the Tsiolkovsky rocket equation, rockets in gravity, hovering and staging, conveyor belts, carts in the rain, chains lifted from a heap or falling onto a pan, and water jets.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A trolley full of sand rolls on a frictionless track while sand leaks straight down through a hole in its floor. Its speed
    choices: ['Stays the same', 'Increases', 'Decreases', 'Increases at first, then decreases']
    ans: 0
    why: Each grain leaves with the trolley's own velocity, so it carries away exactly its share of momentum and pushes on nothing. Only material thrown out with a relative velocity, like rocket exhaust, changes the speed.
  - q: 'Material drops onto a conveyor belt moving at constant speed v. What fraction of the motor''s power becomes kinetic energy of the material?'
    choices: ['One half', 'All of it', 'One quarter', 'None, since the speed is constant']
    ans: 0
    why: The force is μv and the power μv², but the kinetic energy grows only at ½μv². The other half is turned into heat while each grain slips and is brought up to the belt's speed.
  - q: A rocket in free space burns fuel at a constant rate with constant exhaust speed. Its acceleration
    choices: ['Increases with time', 'Stays constant', 'Decreases with time', 'Is zero']
    ans: 0
    why: The thrust μu stays the same but the mass falls, so a = μu/m grows as the rocket gets lighter.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 4: momentum and systems with changing mass'
  - 'J. R. Taylor, Classical Mechanics (2005), chapter 3: rockets'
  - 'K. Tsiolkovsky, "Exploration of outer space by means of rocket devices" (1903), for the history of the rocket equation'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 40 minutes.** By the end you will be able to write the equation of motion for any body that gains or loses mass, use the rocket equation in free space and in gravity, and solve the classic conveyor-belt, raindrop and chain problems without falling into the "F = d(mv)/dt" trap.

<div class="bigidea">Newton's second law is about a fixed set of particles. When mass flows in or out, follow the momentum of everything, including the bit that is joining or leaving.</div>

## 1. Why F = d(mv)/dt can mislead you

Newton's law `$\vec F = d\vec p/dt$` holds for a **fixed collection of particles**. A rocket is not a fixed collection: every second some of it leaves as exhaust. Writing `$F = d(mv)/dt$` for the rocket alone gives wrong answers, for example for a leaking trolley that does not speed up at all.

The safe method is to look at the system over a short time `$dt$`: the body (mass `$m$`, velocity `$\vec v$`) plus the small mass `$dm$` that joins or leaves with velocity `$\vec u$` (in the ground frame).

<div class="steps">
<div class="step"><p><b>Before.</b> The body has momentum m<b>v</b>, and a small mass |dm| about to join moves at <b>u</b>.</p></div>
<div class="step"><p><b>After.</b> The body has mass m + dm and velocity <b>v</b> + d<b>v</b>. Count the momentum of everything that was there before.</p></div>
<div class="step"><p><b>Apply Newton to the fixed set.</b> The change in total momentum is <b>F</b><sub>ext</sub> dt. Expand and drop the tiny product dm d<b>v</b>.</p></div>
<div class="step"><p><b>Result.</b> m d<b>v</b>/dt = <b>F</b><sub>ext</sub> + (<b>u</b> − <b>v</b>) dm/dt. The same equation works for mass gained (dm &gt; 0) and mass lost (dm &lt; 0).</p></div>
</div>

```math
m\frac{d\vec v}{dt} = \vec F_{\rm ext} + (\vec u - \vec v)\frac{dm}{dt}
```

The last term is the **thrust**. It depends only on the velocity of the moving mass **relative to the body**, `$\vec u - \vec v$`. If material leaves or joins with the body's own velocity, there is no thrust.

<div class="meaning">

<dl>
<dt>u − v</dt><dd>velocity of the added or ejected mass relative to the body</dd>
<dt>dm/dt</dt><dd>rate of change of the body's mass: positive when it gains, negative when it loses</dd>
<dt>(u − v) dm/dt</dt><dd>the thrust, a force on the body from the moving mass</dd>
<dt>Physical meaning</dt><dd>A body speeds up or slows down only if the mass it gains or loses moves relative to it. Throw mass backwards and you are pushed forwards.</dd>
</dl>

</div>

**Worked example (three trolleys).** All three roll on frictionless rails at 4 m/s.
1. Sand leaks through the floor (`$\vec u = \vec v$`): thrust zero, speed stays 4 m/s.
2. Rain falls vertically in (`$\vec u = 0$` horizontally): `$m\,dv/dt = -v\,dm/dt$`, so `$mv$` is constant. A 20 kg trolley that collects 5 kg of water slows to `$80/25 = 3.2$` m/s.
3. A boy on it throws stones backwards: it speeds up. That is a rocket.

## 2. The rocket equation

For a rocket the exhaust leaves at speed `$u$` relative to the rocket, backwards. In free space (`$F_{\rm ext} = 0$`), with `$dm < 0$`:

```math
m\,dv = -u\,dm \quad\Rightarrow\quad v - v_0 = u\ln\frac{m_0}{m}, \qquad \text{thrust} = \mu u \ (\mu = |dm/dt|)
```

This is the **Tsiolkovsky rocket equation**. Three facts every question tests:

- The burn rate does not appear: in free space only the **mass ratio** `$m_0/m$` and the exhaust speed matter.
- The log grows slowly. Reaching `$v = u$` needs `$m_0/m = e$`, so 63% of the launch mass must be fuel; `$v = 2u$` needs 86%; `$v = 3u$` needs 95%.
- The final speed can exceed the exhaust speed. Then the newest exhaust actually moves **forwards** in the ground frame (at `$v - u$`), but the thrust is the same, because it depends only on the relative speed.

<figure class="fig" data-fig="rocket-burn"><figcaption>The speed gained, in units of the exhaust speed, rises only as the logarithm of the mass ratio. Switch on gravity to see a vertical launch lose g × (burn time) of it.</figcaption></figure>

**Worked example.** A 1000 kg probe carries 600 kg of fuel and has `$u = 2$` km/s. `$v = 2\ln(1000/400) = 2\ln2.5 = 1.83$` km/s. The ratio is launch mass over **empty** mass, not over fuel mass.

<div class="problem" data-problem="rocket-delta-v"></div>

## 3. Rockets in gravity, hovering and staging

Going straight up in uniform gravity adds `$-mg$`:

```math
m\frac{dv}{dt} = \mu u - mg \quad\Rightarrow\quad v(t) = u\ln\frac{m_0}{m(t)} - gt
```

- **Lift-off** needs thrust greater than weight: `$\mu u > m_0g$`. The initial acceleration is `$\mu u/m_0 - g$`.
- **Gravity loss** `$gt$`: for a fixed amount of fuel, burn it as fast as you can, because every second spent burning costs `$g$` of speed.
- **Hovering** needs `$\mu u = mg$` at every instant. As the mass falls the burn rate must fall too, so `$m = m_0e^{-gt/u}$` and the hover time is `$\dfrac{u}{g}\ln\dfrac{m_0}{m_{\rm empty}}$`.
- **Staging**: the empty tank of a finished stage is dead weight. Dropping it raises the mass ratio of the next stage, so the same fuel gives more speed.

**Worked example (staging).** 1000 kg: stage 1 has 500 kg fuel + 100 kg structure, stage 2 has 250 kg fuel + 50 kg structure, payload 100 kg, `$u = 2$` km/s. Stage 1: `$2\ln(1000/500) = 1.39$` km/s. Drop 100 kg; stage 2: `$2\ln(400/150) = 1.96$` km/s. Total 3.35 km/s, against 2.77 km/s for one stage with the same fuel and structure.

To play with real numbers, use the [rocket equation calculator](/science/rocket-equation/) or fly a [model rocket](/science/model-rocket-simulator/) with thrust curves and drag.

## 4. Belts, jets and dust: mass picked up from rest

When the incoming mass starts at rest, the force needed to keep the body at constant speed `$v$` is the momentum delivered per second:

```math
F = \frac{dm}{dt}\,v, \qquad P = Fv = \frac{dm}{dt}\,v^2 = 2\times\frac{d}{dt}\Big(\tfrac12mv^2\Big)
```

The motor's power is **twice** the rate at which kinetic energy is created. The other half becomes heat, because each grain slides on the belt before it moves with it: a perfectly inelastic collision, repeated every instant. The same algebra gives

- a water jet stopped by a wall: `$F = \rho Av^2$` (twice that if it bounces straight back);
- a spacecraft ploughing through still dust: thrust `$\rho Av^2$` to keep its speed;
- a drop falling through still mist: `$d(mv)/dt = mg$`, so it never reaches free-fall acceleration.

**Worked example.** Grain falls at 2 kg/s onto a belt moving at 3 m/s. `$F = 6$` N, `$P = 18$` W, kinetic energy gained 9 W, heat 9 W.

<div class="myth">

**"The belt moves at constant speed, so no force is needed."** A constant speed of the belt does not mean constant momentum of the system: new mass keeps arriving at rest and must be brought up to speed. The same mistake makes people write `$F = \lambda yg$` for a chain lifted at constant speed, forgetting the `$\lambda v^2$` that sets each new link moving.

</div>

Slide the mist thickness and press Play. Look at the dashed line at g/7.

<figure class="fig" data-fig="@mech-raindrop"><figcaption>The drop collects mass at rest, so its acceleration is not simply g: it falls to g/7 whatever the mist density.</figcaption></figure>

## 5. Chains: lifted from a heap and falling onto a pan

**Lifted at constant speed `$v$`.** The moving part (length `$y$`) has momentum `$\lambda yv$`, growing at `$\lambda v^2$`. So `$F = \lambda yg + \lambda v^2$`. Half of the `$\lambda v^3$` part of the power is lost as heat, as on the belt.

**Falling onto a pan.** A chain hanging just above a scale is released. When a length `$x$` has landed, the arriving links move at `$\sqrt{2gx}$` and are stopped at the rate `$\lambda\sqrt{2gx}$`:

```math
N = \underbrace{\lambda gx}_{\text{weight on the pan}} + \underbrace{\lambda v^2}_{\text{stopping the links}} = 3\lambda gx
```

Just as the last link lands the scale reads **three times** the chain's weight, then drops to its weight.

<div class="problem" data-problem="chain-lift"></div>

**Worked example (a hard one).** A heap of chain (`$\lambda = 0.5$` kg/m) is pulled up by a **constant** force of 12 N. With `$p = \lambda yv$`: `$d(\lambda yv)/dt = F - \lambda gy$`. Multiply by `$yv$` and use `$v\,dt = dy$`: `$(yv)^2 = \tfrac{F}{\lambda}y^2 - \tfrac23gy^3$`, so the end stops at `$y = 3F/2\lambda g = 3.67$` m. Energy conservation would wrongly give 4.90 m, because each link is jerked into motion inelastically.

<div class="keypoints">

- Variable mass: `$m\,d\vec v/dt = \vec F_{\rm ext} + (\vec u - \vec v)\,dm/dt$`; only the relative velocity of the moving mass makes a thrust.
- Rocket: thrust `$\mu u$`; in free space `$\Delta v = u\ln(m_0/m)$`, independent of the burn rate; `$\Delta v = u$` needs 63% fuel.
- In gravity: `$v = u\ln(m_0/m) - gt$`; lift-off needs `$\mu u > m_0g$`; hovering gives `$m = m_0e^{-gt/u}$`. Staging drops dead mass.
- Picking up mass from rest at speed `$v$`: `$F = \dot mv$`, `$P = \dot mv^2$`, half of it heat (belts, jets `$\rho Av^2$`, dust).
- Chain lifted at speed `$v$`: `$F = \lambda yg + \lambda v^2$`. Chain falling onto a pan: reading `$3\lambda gx$`.
- Leaking mass with no relative velocity changes momentum but not speed.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [variable mass practice page](/learn/courses/iit-jam-physics/practice/variable-mass/).

<div class="qbank" data-bank="physics" data-topics="variable-mass" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.2, [work, energy and collisions](/learn/courses/iit-jam-physics/work-energy-collisions/). **Next:** lesson 2.4, [central forces and orbits](/learn/courses/iit-jam-physics/central-forces/), where the same rockets go into orbit.

**Go deeper:** for GATE, momentum conservation in its relativistic form, including particles that lose rest mass as they decay, is in [four-vectors and relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/).
