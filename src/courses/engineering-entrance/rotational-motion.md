---
title: Rotational motion
seoTitle: 'Rotational motion: JEE and NEET physics'
summary: 'Torque, couples and equilibrium, moment of inertia with the parallel and perpendicular axis theorems, rotational kinematics, torque and angular acceleration, angular momentum and its conservation, rotational energy, rolling without slipping and rolling with friction.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'A solid sphere and a ring of the same mass and radius roll down the same slope from rest. Which reaches the bottom first?'
    choices: ['The ring', 'The sphere', 'They tie', 'It depends on the mass']
    ans: 1
    why: 'a = g sin θ/(1 + k²/R²). The sphere has k²/R² = 2/5, the ring 1. Less of the sphere''s mass is far from the axis, so less energy goes into spinning and it speeds up faster.'
  - q: 'A skater spinning with arms out pulls her arms in. Her angular speed:'
    choices: ['decreases', 'increases, and her kinetic energy also increases', 'increases, and her kinetic energy stays the same', 'stays the same']
    ans: 1
    why: 'L = Iω is kept (no outside torque). I falls, so ω rises. K = L²/2I rises too: the extra energy comes from the work her arm muscles do pulling inwards.'
  - q: 'For a body rolling without slipping on the ground, the point in contact with the ground has velocity:'
    choices: ['v, forwards', '2v, forwards', 'zero', 'v, backwards']
    ans: 2
    why: 'The forward motion v of the centre and the backward spin speed Rω = v cancel at the bottom. The top point moves at 2v.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Rotational motion'
---

**Physics · Class 11 · about 38 minutes.** By the end you will be able to find torques and moments of inertia, use τ = Iα and angular momentum conservation, and solve rolling problems, including rolling races, slipping balls and rods that fall.

<div class="bigidea">Rotation copies straight-line motion term for term. Force becomes torque, mass becomes moment of inertia, momentum becomes angular momentum. The only new idea is that in rotation it matters where the mass is and where the force is applied, not just how much.</div>

## 1. Torque and equilibrium

The turning effect of a force F about a point O is the **torque**:

```math
\vec\tau = \vec r\times\vec F, \qquad \tau = rF\sin\theta = F \times (\text{perpendicular distance from O to the line of the force})
```

That perpendicular distance is the **moment arm**. A force whose line passes through O has no torque about O. A **couple** is two equal and opposite forces not on the same line; it has zero net force but a torque F × (distance between the lines), the same about every point.

**Equilibrium of a rigid body** needs both: net force = 0 and net torque = 0 about **any** point. Choose the point through which the most unknown forces pass, so they drop out.

<div class="myth">

**"A heavier force always turns a body more."** Torque depends on the moment arm too. A small force at the end of a long spanner beats a big force near the nut. A force along the spanner, however big, gives no torque at all.

</div>

## 2. Moment of inertia

Moment of inertia measures how hard a body is to spin up: `$I = \sum m r^2 = \int r^2\,dm$`, where r is the distance from the **axis**. It depends on the axis chosen. Writing `$I = Mk^2$` defines the **radius of gyration** k.

| Body (mass M) | Axis | I |
|---|---|---|
| Thin rod, length L | through the middle, perpendicular | `$ML^2/12$` |
| Thin rod, length L | through an end, perpendicular | `$ML^2/3$` |
| Ring, radius R | through the centre, perpendicular to plane | `$MR^2$` |
| Disc or solid cylinder | through the centre, along the axis | `$MR^2/2$` |
| Hollow sphere | diameter | `$2MR^2/3$` |
| Solid sphere | diameter | `$2MR^2/5$` |
| Rectangular plate a × b | through the centre, perpendicular | `$M(a^2 + b^2)/12$` |

See every row of this table spin. Pick a body and an axis: the dots are bits of mass, and the farther a dot is from the axis the bigger it is drawn, because it counts r² times. Switch the axis of the same body and watch I change; switch "Spin" to *Same push* and the bodies with a bigger I speed up more slowly under the same torque.

<figure class="fig" data-fig="@moi-shapes"><figcaption>Moment of inertia for every standard body and axis. Drag the picture to turn it. The readout checks the formula against the value added up from the dots.</figcaption></figure>

- **Parallel axis theorem:** `$I = I_{cm} + Md^2$`, for an axis parallel to one through the centre of mass at distance d. It shows I is least about an axis through the centre of mass.
- **Perpendicular axis theorem** (flat bodies only): `$I_z = I_x + I_y$`, where x and y lie in the plate and z is perpendicular to it through the same point. A ring about a diameter: MR²/2; a disc about a diameter: MR²/4.

<div class="problem" data-problem="rot-parallel-axis"></div>

## 3. The rotation dictionary

| Straight line | Rotation | Link |
|---|---|---|
| x, v, a | θ, ω, α | s = rθ, v = rω, a_t = rα |
| m | I | `$I = \sum mr^2$` |
| F = ma | `$\tau = I\alpha$` | about a fixed axis or the centre of mass |
| p = mv | `$L = I\omega$` | `$\vec L = \vec r\times\vec p$` |
| K = ½mv² | `$K = \tfrac12 I\omega^2$` | |
| P = Fv | `$P = \tau\omega$` | |
| W = ∫F dx | `$W = \int\tau\,d\theta$` | |

With constant α, the equations of motion carry over: `$\omega = \omega_0 + \alpha t$`, `$\theta = \omega_0 t + \tfrac12\alpha t^2$`, `$\omega^2 = \omega_0^2 + 2\alpha\theta$`.

**Block hanging from a pulley** (pulley mass M, radius R, a disc): `$a = \dfrac{mg}{m + M/2}$`. The pulley's inertia acts like extra mass I/R² that must be speeded up too.

## 4. Angular momentum and its conservation

`$\tau_{ext} = \dfrac{dL}{dt}$`. If the outside torque about an axis is zero, **angular momentum about that axis is conserved**: `$I_1\omega_1 = I_2\omega_2$`.

- A skater pulls in her arms: I falls, ω rises. Kinetic energy `$L^2/2I$` rises, paid for by her muscles.
- Clay dropped on a turntable, a person walking to the centre of a rotating platform, two discs pressed together: the same rule. When two spinning bodies are made to rotate together, kinetic energy is lost (friction between them makes heat).

<div class="problem" data-problem="rot-ang-mom"></div>

**Angular momentum of a particle** moving in a straight line about a point O: `$L = mvd$`, where d is the perpendicular distance from O to the line. It stays constant, even though the particle is not going round anything.

## 5. Rolling without slipping

A body rolling without slipping has `$v_{cm} = R\omega$`. Its motion is translation of the centre plus spin about the centre. The bottom point is momentarily at rest, the top moves at 2v.

```math
K = \tfrac12 mv^2 + \tfrac12 I\omega^2 = \tfrac12 mv^2\left(1 + \frac{k^2}{R^2}\right), \qquad a = \frac{g\sin\theta}{1 + k^2/R^2}\ \text{(down a slope)}
```

<div class="meaning">
<dl>
<dt>I</dt><dd>moment of inertia about the axis, in kg m²</dd>
<dt>k</dt><dd>radius of gyration: I = Mk²; for a sphere k²/R² = 2/5, disc 1/2, hollow sphere 2/3, ring 1</dd>
<dt>τ</dt><dd>torque, rF sin θ, in N m</dd>
<dt>L</dt><dd>angular momentum, Iω, in kg m²/s</dd>
<dt>Physical meaning</dt><dd>A rolling body must spend part of its energy on spinning. The more of its mass sits far from the axis (bigger k²/R²), the more it spends and the slower it speeds up.</dd>
</dl>
</div>

Race them below. Mass and radius do not matter; only the shape does.

<figure class="fig" data-fig="rot-rolling"><figcaption>Rolling race down one slope. The solid sphere always wins and the ring always comes last. The bars show the share of kinetic energy in moving forward and in spinning.</figcaption></figure>

<div class="problem" data-problem="rot-rolling-speed"></div>

**Friction in rolling.** On a slope, static friction acts up the slope with size `$f = \dfrac{mg\sin\theta}{1 + R^2/k^2}$`. It does no work (the contact point does not slide), so mechanical energy is conserved. To roll without slipping you need `$\mu \ge \dfrac{\tan\theta}{1 + R^2/k^2}$`; for a solid cylinder that is tan θ/3.

<div class="myth">

**"Friction always slows a rolling ball down."** On a level floor, a ball rolling perfectly needs no friction at all. On a slope, friction is what makes it spin up; it does no work, so no energy is lost to it.

</div>

## 6. Rolling with slipping and falling rods (JEE Advanced)

**A ball thrown sliding** with speed v₀ and no spin on a rough floor: kinetic friction slows the centre and spins the ball up until `$v = R\omega$`. Angular momentum about the contact point is kept (friction passes through it), so the final speed is `$v = \dfrac{v_0}{1 + k^2/R^2}$`: 5v₀/7 for a solid sphere.

**A rod of length L hinged at one end, released from horizontal.** Energy: `$mg\tfrac L2 = \tfrac12\cdot\tfrac{mL^2}{3}\omega^2$` at the bottom, so `$\omega = \sqrt{3g/L}$`. Just after release, `$\tau = I\alpha$` gives `$\alpha = 3g/2L$`, so the free end starts falling at `$\tfrac32 g$`, faster than a dropped stone.

<div class="keypoints">

- τ = r × F = F × moment arm; equilibrium: net force and net torque zero.
- I = Σmr²; rod ML²/12 (centre), ML²/3 (end); ring MR²; disc MR²/2; spheres 2/3 and 2/5 MR².
- Parallel axis I = I_cm + Md²; perpendicular axis (plates) I_z = I_x + I_y.
- τ = Iα, L = Iω, K = ½Iω², P = τω.
- No outside torque: I₁ω₁ = I₂ω₂; joining spinning bodies loses kinetic energy.
- Rolling: v = Rω, K = ½mv²(1 + k²/R²), a = g sin θ/(1 + k²/R²); sphere beats disc beats hollow sphere beats ring.
- Sliding ball settles to v₀/(1 + k²/R²); hinged rod: ω = √(3g/L) at the bottom, α = 3g/2L at the start.

</div>
