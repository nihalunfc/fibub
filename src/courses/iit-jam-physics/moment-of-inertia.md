---
title: Moment of inertia and the axis theorems
seoTitle: Moment of inertia and axis theorems for IIT JAM Physics
summary: 'What moment of inertia measures, how to find it for any body by slicing, the parallel and perpendicular axis theorems, bodies with holes, radius of gyration, rolling, the physical pendulum and a first look at the inertia tensor.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A ring and a disc have the same mass and radius. About their central axes (perpendicular to their planes), which has the larger moment of inertia?
    choices: ['The ring', 'The disc', 'They are equal', 'It depends on what they are made of']
    ans: 0
    why: All of the ring's mass is at the rim, at distance R; much of the disc's mass is nearer the axis. MR² is twice ½MR².
  - q: The perpendicular axis theorem I_z = I_x + I_y can be used for
    choices: ['Flat bodies (laminas) only', 'Any rigid body', 'Only axes through the centre of mass', 'Only bodies with circular symmetry']
    ans: 0
    why: The proof needs every particle to have z = 0, so it works only for flat bodies. The three axes must meet at one point in the plane, but that point need not be the centre of mass.
  - q: Of all the axes pointing in one given direction, which gives a body its smallest moment of inertia?
    choices: ['The one through the centre of mass', 'The one through the edge of the body', 'They are all equal', 'The one farthest from the body']
    ans: 0
    why: By the parallel axis theorem, I = I_cm + Md². The extra term Md² is never negative, so the axis through the centre of mass (d = 0) gives the least value.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 7'
  - 'J. R. Taylor, Classical Mechanics (2005), chapter 10: rotational motion of rigid bodies'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 5'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 40 minutes.** By the end you will be able to find the moment of inertia of any standard body without a table, move between axes with the parallel and perpendicular axis theorems, handle bodies with holes and non-uniform density, and use moments of inertia in rolling and pendulum problems. The last section previews the inertia tensor for GATE and NET.

<div class="bigidea">Moment of inertia is how hard a body is to spin about a given axis, and it depends on how far its mass lies from that axis, not just on how much mass there is.</div>

## 1. What moment of inertia measures

In straight-line motion, mass resists changes of velocity. In rotation about a fixed axis, the moment of inertia resists changes of angular velocity:

```math
I = \sum_i m_ir_i^2 = \int r^2\,dm, \qquad K = \tfrac12I\omega^2, \qquad L = I\omega, \qquad \tau = I\alpha
```

Here `$r$` is the **perpendicular distance from the axis**, not the distance from the origin. Because it enters squared, mass far from the axis counts for much more: that is why a flywheel has a heavy rim and a figure skater spins faster with her arms pulled in.

<div class="meaning">

<dl>
<dt>I = ∫ r² dm</dt><dd>every bit of mass, weighted by the square of its distance from the axis</dd>
<dt>k (radius of gyration)</dt><dd>the distance at which all the mass would give the same I: I = Mk²</dd>
<dt>Same body, new axis</dt><dd>a new moment of inertia: I always belongs to a body and an axis together</dd>
<dt>Physical meaning</dt><dd>I is to turning what mass is to pushing. A wheel with its mass at the rim is harder to start and stop spinning than a solid disc of the same mass.</dd>
</dl>

</div>

## 2. Computing I by slicing

The strategy is always the same: cut the body into pieces whose moment of inertia you already know, and add them up.

- **Thin rod, axis through the centre, perpendicular:** pieces `$dm = (M/L)dx$` at distance `$|x|$`: `$I = \int_{-L/2}^{L/2}x^2\dfrac{M}{L}dx = \tfrac1{12}ML^2$`. About one end: `$\tfrac13ML^2$`.
- **Ring about its axis:** all the mass at `$R$`: `$MR^2$`.
- **Disc about its axis:** rings of radius `$r$`, mass `$dm = \dfrac{2M}{R^2}r\,dr$`: `$I = \dfrac{2M}{R^2}\int_0^R r^3dr = \tfrac12MR^2$`.
- **Thin spherical shell:** `$I_x + I_y + I_z = 2\sum mr^2 = 2MR^2$`, and the three are equal by symmetry: `$\tfrac23MR^2$`.
- **Solid sphere:** shells of mass `$dm = \dfrac{3M}{R^3}r^2dr$`, each giving `$\tfrac23r^2dm$`: `$I = \dfrac{2M}{R^3}\int_0^R r^4dr = \tfrac25MR^2$`.

| Body (mass M) | Axis | I |
|---|---|---|
| Thin rod, length L | through centre, perpendicular | `$\tfrac1{12}ML^2$` |
| Thin rod, length L | through one end, perpendicular | `$\tfrac13ML^2$` |
| Ring, radius R | central, perpendicular to plane | `$MR^2$` |
| Disc or solid cylinder, radius R | central axis | `$\tfrac12MR^2$` |
| Disc, radius R | a diameter | `$\tfrac14MR^2$` |
| Thin spherical shell | a diameter | `$\tfrac23MR^2$` |
| Solid sphere | a diameter | `$\tfrac25MR^2$` |
| Rectangular plate a × b | central, perpendicular to plate | `$\tfrac1{12}M(a^2 + b^2)$` |
| Solid cone, base radius R | its axis | `$\tfrac3{10}MR^2$` |

You do not need to memorise this table if you can do the slicing; JAM rewards people who can.

## 3. The parallel axis theorem

If you know `$I_{cm}$` about an axis through the centre of mass, the moment about any **parallel** axis a distance `$d$` away is

```math
I = I_{cm} + Md^2
```

Why it is true, step by step:

<div class="steps">
<div class="step"><p><b>Split each position.</b> Measure positions in the plane perpendicular to the axis. For each bit of mass, write its position from the new axis as <b>d</b> + <b>r′</b>, where <b>r′</b> is measured from the centre of mass.</p></div>
<div class="step"><p><b>Square it.</b> |<b>d</b> + <b>r′</b>|² = d² + 2<b>d</b>·<b>r′</b> + r′².</p></div>
<div class="step"><p><b>Add up over the body.</b> ∫r′² dm = I<sub>cm</sub>, ∫d² dm = Md², and the middle term is 2<b>d</b>·∫<b>r′</b> dm.</p></div>
<div class="step"><p><b>The middle term vanishes.</b> ∫<b>r′</b> dm = 0, because <b>r′</b> is measured from the centre of mass. That is the definition of the centre of mass.</p></div>
<div class="step"><p><b>Result.</b> I = I<sub>cm</sub> + Md². The proof needs one axis through the centre of mass; it says nothing about the shape, so it works for solid bodies too.</p></div>
</div>

<figure class="fig" data-fig="parallel-axis"><figcaption>Slide the axis away from the centre of mass: the moment of inertia climbs along a parabola. Its lowest point is always at the centre of mass.</figcaption></figure>

**Worked example.** A rod of mass 0.48 kg and length 1 m turns about a point 0.25 m from one end. That point is `$L/4$` from the centre, so `$I = \tfrac1{12}ML^2 + M(L/4)^2 = \tfrac7{48}ML^2 = 0.07$` kg m². Adding `$M(0.25)^2$` to the end value `$\tfrac13ML^2$` would be wrong: neither the end nor the new point is the centre of mass.

<div class="problem" data-problem="parallel-axis-disc"></div>

## 4. The perpendicular axis theorem (flat bodies only)

For a lamina in the `$xy$`-plane, with the three axes meeting at a point of the plane:

```math
I_z = I_x + I_y
```

It follows from `$x^2 + y^2 = r^2$` when every particle has `$z = 0$`. It is the fastest way to get in-plane moments:

**Worked example.** A disc about a diameter. Two perpendicular diameters have equal moments by symmetry and add up to `$\tfrac12MR^2$`, so each is `$\tfrac14MR^2$`. A ring about a diameter: `$\tfrac12MR^2$`. A ring about a tangent in its plane: `$\tfrac12MR^2 + MR^2 = \tfrac32MR^2$` (perpendicular theorem, then parallel theorem).

<div class="myth">

**"The perpendicular axis theorem works for a sphere or a cube."** It does not. For a solid body `$I_x + I_y = I_z + 2\int z^2\,dm$`, which is larger than `$I_z$`. For a sphere, `$\tfrac25MR^2 + \tfrac25MR^2 \neq \tfrac25MR^2$`. Use it only for flat bodies, and use the parallel axis theorem only from the centre of mass.

</div>

## 5. Composite bodies and holes

Moments of inertia about the **same axis** simply add. A hole is a piece with "negative mass": compute the full body, then subtract the missing piece, shifted to the same axis.

**Worked example.** A uniform disc of radius 2 m had a mass of 16 kg. A hole of radius 1 m is cut with its centre 1 m from the disc's centre. About the original central axis:

1. Full disc: `$\tfrac12\times16\times4 = 32$` kg m².
2. The hole has a quarter of the area, so 4 kg. About its own centre `$\tfrac12\times4\times1 = 2$`; shifted 1 m: `$2 + 4\times1^2 = 6$` kg m².
3. What is left: `$32 - 6 = 26$` kg m².

Non-uniform bodies work the same way with a density inside the integral. A disc with surface density `$\sigma = kr$` has `$I = \tfrac35MR^2$`, more than a uniform disc because its mass is pushed outward.

## 6. Using I: rolling and the physical pendulum

**Rolling without slipping** (`$v = \omega R$`): kinetic energy `$\tfrac12Mv^2(1 + I/MR^2)$`, and down a slope

```math
a = \frac{g\sin\theta}{1 + I/MR^2}
```

Only the shape factor `$I/MR^2$` matters, so in a race down a slope a solid sphere (`$\tfrac25$`) beats a disc (`$\tfrac12$`), which beats a hollow sphere (`$\tfrac23$`), which beats a ring (1), whatever their masses and sizes.

**Physical pendulum:** a body pivoted at distance `$d$` from its centre of mass swings with

```math
T = 2\pi\sqrt{\frac{I_{\rm pivot}}{Mgd}} = 2\pi\sqrt{\frac{k^2 + d^2}{gd}}
```

**Worked example.** A uniform rod 1.5 m long pivoted at one end: `$I = \tfrac13ML^2$` and `$d = L/2$`, so `$T = 2\pi\sqrt{2L/3g} \approx 2.01$` s. The period is shortest when the pivot is at `$d = k$` from the centre of mass.

To check a moment of inertia for your own shape, use the [moment of inertia calculator](/science/moment-of-inertia/).

## 7. Beyond JAM: the inertia tensor

For rotation about an axis that is not fixed in advance, one number is not enough. The **inertia tensor** collects nine numbers:

```math
I_{xx} = \sum m(y^2 + z^2), \qquad I_{xy} = -\sum m\,xy, \qquad \vec L = \mathsf I\,\vec\omega, \qquad I_{\hat n} = \hat n^{\rm T}\mathsf I\,\hat n
```

It is real and symmetric, so there are always three perpendicular **principal axes** where the products of inertia vanish and `$\vec L \parallel \vec\omega$`. A symmetry axis is always principal. For a uniform cube about its centre all three principal moments equal `$\tfrac16Ma^2$`, so every axis through the centre, even a body diagonal, has that same moment. At a corner of a square plate the edges are not principal axes, because `$I_{xy} = -\tfrac14Ma^2 \neq 0$` there. GATE takes this further in [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/).

<div class="keypoints">

- `$I = \int r_\perp^2\,dm$` about a stated axis; `$K = \tfrac12I\omega^2$`, `$L = I\omega$`, `$\tau = I\alpha$`; `$I = Mk^2$` defines the radius of gyration.
- Find any I by slicing into rods, rings, discs or shells. Know rod `$\tfrac1{12}$`/`$\tfrac13$`, ring 1, disc `$\tfrac12$`, shell `$\tfrac23$`, solid sphere `$\tfrac25$`.
- Parallel axis: `$I = I_{cm} + Md^2$`, always starting from the centre of mass; I is least about the centre of mass.
- Perpendicular axis: `$I_z = I_x + I_y$`, flat bodies only.
- Holes: subtract the missing piece's moment about the same axis (including its `$Md^2$`).
- Rolling: `$a = g\sin\theta/(1 + I/MR^2)$`. Physical pendulum: `$T = 2\pi\sqrt{(k^2 + d^2)/gd}$`, shortest at `$d = k$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [moment of inertia practice page](/learn/courses/iit-jam-physics/practice/moment-of-inertia/).

<div class="qbank" data-bank="physics" data-topics="moment-of-inertia" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.4, [central forces and orbits](/learn/courses/iit-jam-physics/central-forces/). **Next:** [lesson 2.6](/learn/courses/iit-jam-physics/rigid-body-rotation/) puts these moments to work in rotation, rolling and angular momentum.

**Go deeper:** the inertia tensor, principal axes and Euler's equations are worked out in full in GATE's [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/).
