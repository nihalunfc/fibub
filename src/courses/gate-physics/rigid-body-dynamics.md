---
title: "Rigid body dynamics: inertia tensor and Euler's equations"
seoTitle: Rigid body dynamics and Euler's equations for GATE
summary: 'The inertia tensor and products of inertia, principal axes as eigenvectors, why angular momentum and angular velocity are not parallel, Euler''s equations, the free symmetric top and the Chandler wobble, the tennis racket theorem, Euler angles and the heavy symmetric top.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A body spins freely about one of its principal axes and is nudged slightly. For which axis does the nudge grow into a tumble?'
    choices: ['The axis with the largest moment of inertia', 'The axis with the smallest moment of inertia', 'The axis with the intermediate moment of inertia', 'None: free rotation is always stable']
    ans: 2
    why: 'Linearising Euler''s equations about spin on axis k gives perturbations with Ω² = ω²(I_k − I_i)(I_k − I_j)/(I_i I_j). This is negative only when I_k lies between the other two, so the intermediate axis is unstable.'
  - q: 'A dumbbell is fixed to an axle at an angle (not along or perpendicular to it) and turned at constant ω. Which is true?'
    choices: ['L is parallel to ω, so no torque is needed', 'L is not parallel to ω and turns with the body, so the bearings must supply a torque', 'L is zero by symmetry', 'The kinetic energy changes as it turns']
    ans: 1
    why: The axle is not a principal axis, so the products of inertia are not zero and L = Iω has a sideways part. That part turns round with the body, and a turning L needs a torque τ = ω × L from the bearings. This is why car wheels are balanced.
  - q: 'A fast symmetric top of spin angular momentum L₃ = I₃ω₃ precesses slowly under gravity. If its spin is doubled, its precession rate'
    choices: ['Halves', 'Doubles', 'Is unchanged', 'Quadruples']
    ans: 0
    why: The torque Mgl sin θ turns the horizontal part of L₃, L₃ sin θ, at rate Ω, so Ω = Mgl/(I₃ω₃). Double the spin and the same torque turns twice the angular momentum at half the rate.
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapters 4 and 5'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapter 6'
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 8'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 55 minutes.** By the end you will be able to build the inertia tensor of a body, find its principal axes, explain why angular momentum and angular velocity point in different directions, write and use Euler's equations, predict the wobble of a free body and the instability of the intermediate axis, and find the precession of a heavy top.

Moments of inertia about fixed axes, the parallel-axis theorem and rolling are in the JAM lessons on [moment of inertia](/learn/courses/iit-jam-physics/moment-of-inertia/) and [rigid body rotation](/learn/courses/iit-jam-physics/rigid-body-rotation/). Here the axis is free to move.

<div class="bigidea">For a body turning about a fixed axis, a single number I is enough. For a body free to turn any way, inertia is a 3 × 3 matrix, and angular momentum need not point along the spin. All the surprising behaviour of tops and tumbling bodies comes from that.</div>

## 1. The inertia tensor

A rigid body turning with angular velocity `$\vec\omega$` about its centre of mass (or about a fixed point) has particle velocities `$\vec v = \vec\omega\times\vec r$`. Its angular momentum is `$\vec L = \sum m\,\vec r\times(\vec\omega\times\vec r) = \sum m\left[r^2\vec\omega - (\vec r\cdot\vec\omega)\vec r\right]$`. In components this is linear in `$\vec\omega$`:

```math
L_i = \sum_j I_{ij}\,\omega_j, \qquad I_{ij} = \sum m\left(r^2\delta_{ij} - x_ix_j\right), \qquad T = \tfrac12\vec\omega\cdot\vec L = \tfrac12\sum_{ij}I_{ij}\,\omega_i\omega_j
```

The diagonal entries are the familiar moments of inertia, `$I_{xx} = \sum m(y^2 + z^2)$`. The off-diagonal ones are the **products of inertia**, `$I_{xy} = -\sum mxy$`, with a minus sign in this convention. For a continuous body replace `$\sum m$` by `$\int\rho\,dV$`. The parallel-axis theorem becomes `$I_{ij} = I^{\rm cm}_{ij} + M(d^2\delta_{ij} - d_id_j)$` for a shift `$\vec d$` of the origin.

<div class="meaning">

<dl>
<dt>I<sub>xx</sub></dt><dd>resistance to spin about x: mass weighted by the square of its distance from the x-axis</dd>
<dt>I<sub>xy</sub> = −Σmxy</dt><dd>product of inertia: non-zero when mass is placed lopsidedly between the x and y directions</dd>
<dt>L = Iω</dt><dd>a matrix times a vector: L is parallel to ω only if ω lies along a principal axis</dd>
<dt>T = ½ωᵀIω</dt><dd>the kinetic energy of rotation, always positive</dd>
<dt>Physical meaning</dt><dd>A lopsided body spun about an axis tries to swing its mass out sideways; the products of inertia measure that urge, and the bearings feel it as a torque.</dd>
</dl>

</div>

**Worked example: an unbalanced axle.** Two masses `$m$` sit at `$\pm(a\sin\alpha, 0, a\cos\alpha)$` on a light rod through the origin, and the rod is turned about the `$z$`-axis at constant `$\omega$`. Then `$I_{zz} = 2ma^2\sin^2\alpha$` and `$I_{xz} = -2ma^2\sin\alpha\cos\alpha$`, so

```math
\vec L = \omega\left(-2ma^2\sin\alpha\cos\alpha,\ 0,\ 2ma^2\sin^2\alpha\right)
```

`$\vec L$` is perpendicular to the rod, not along `$\vec\omega$`, and it turns round with the rod. A turning `$\vec L$` needs a torque: `$|\vec\tau| = |\vec\omega\times\vec L| = 2ma^2\omega^2\sin\alpha\cos\alpha$`, supplied by the bearings and felt as vibration. It vanishes at `$\alpha = 0$` or `$90°$`, where the axle is a principal axis.

## 2. Principal axes

`$I$` is real and symmetric, so it has three real eigenvalues `$I_1, I_2, I_3$` (the **principal moments**) and three perpendicular eigenvectors (the **principal axes**). In that frame the tensor is diagonal, and

```math
\vec L = (I_1\omega_1,\ I_2\omega_2,\ I_3\omega_3), \qquad T = \tfrac12\left(I_1\omega_1^2 + I_2\omega_2^2 + I_3\omega_3^2\right)
```

Any axis of symmetry is a principal axis, and so is any axis perpendicular to a plane of mirror symmetry. A body with two equal principal moments is a **symmetric top**; with all three equal (a sphere or a cube about its centre) every axis is principal. For a flat body in the `$xy$`-plane, `$I_{zz} = I_{xx} + I_{yy}$` (perpendicular-axis theorem).

**Worked example: a cube about a corner.** For a uniform cube of mass `$M$` and side `$a$` with the origin at a corner and axes along the edges, `$I_{xx} = \tfrac23Ma^2$` and `$I_{xy} = -\tfrac14Ma^2$` (and likewise for each pair). The tensor is `$Ma^2$` times a matrix with `$\tfrac23$` on the diagonal and `$-\tfrac14$` everywhere else. Its eigenvector `$(1, 1, 1)$`, the body diagonal, has eigenvalue `$\tfrac23 - \tfrac12 = \tfrac16$`, so `$I = Ma^2/6$` about the diagonal, the same as about any axis through the centre (the diagonal passes through it). The other two eigenvalues are `$\tfrac23 + \tfrac14 = \tfrac{11}{12}$`, for any axis through the corner perpendicular to the diagonal.

## 3. Euler's equations

In a frame fixed in space, `$d\vec L/dt = \vec\tau$`. But `$I$` is constant only in a frame fixed in the body, which turns at `$\vec\omega$`. Rates of change in the two frames differ by `$\vec\omega\times$`, so `$(d\vec L/dt)_{\rm body} + \vec\omega\times\vec L = \vec\tau$`. Along the principal axes:

```math
I_1\dot\omega_1 - (I_2 - I_3)\,\omega_2\omega_3 = \tau_1, \quad I_2\dot\omega_2 - (I_3 - I_1)\,\omega_3\omega_1 = \tau_2, \quad I_3\dot\omega_3 - (I_1 - I_2)\,\omega_1\omega_2 = \tau_3
```

With no torque, two quantities are conserved: the energy `$T$` and the size `$L^2 = I_1^2\omega_1^2 + I_2^2\omega_2^2 + I_3^2\omega_3^2$`. Each defines an ellipsoid in `$\vec\omega$`-space (or `$\vec L$`-space), and the motion runs along their intersection.

**Worked example: the free symmetric top.** Take `$I_1 = I_2$`, no torque. The third equation gives `$\omega_3$` = constant. The other two become `$\dot\omega_1 = -\Omega\omega_2$`, `$\dot\omega_2 = \Omega\omega_1$` with

```math
\Omega = \frac{I_3 - I_1}{I_1}\,\omega_3
```

so `$(\omega_1, \omega_2)$` turns in a circle at rate `$\Omega$`: seen from the body, the spin axis traces a cone round the symmetry axis. Seen from space, the symmetry axis and `$\vec\omega$` both go round the fixed `$\vec L$` at rate `$L/I_1$`.

**The Chandler wobble.** The Earth is slightly flattened, with `$(I_3 - I_1)/I_1 \approx 1/305$`. Euler's result predicts that the rotation axis should wander round the geographic pole once every 305 days. The wobble is real, a few metres at the pole, but its period is about 433 days: the Earth is not rigid, and the oceans and the elastic mantle lengthen it.

## 4. The tennis racket theorem

Spin a free body about principal axis `$k$` at rate `$\omega$` and give it a small nudge. Linearising Euler's equations, the nudge obeys `$\ddot\epsilon = -\Omega^2\epsilon$` with

```math
\Omega^2 = \omega^2\,\frac{(I_k - I_i)(I_k - I_j)}{I_iI_j}
```

where `$i, j$` are the other two axes. If `$I_k$` is the largest or the smallest, both brackets have the same sign, `$\Omega^2 > 0$` and the nudge just wobbles. If `$I_k$` is the intermediate one, `$\Omega^2 < 0$` and the nudge grows exponentially: the body flips over, flips back, and repeats. Toss a phone or a book spinning about its middle axis and it always turns over.

<figure class="fig" data-fig="tennis-racket"><figcaption>Euler's equations for a body with principal moments 1, 2 and 3, spun at 1 rad/s plus a tiny nudge. About the smallest or largest axis the other components stay small; about the middle axis they grow and the spin reverses again and again. A smaller nudge only delays the first flip.</figcaption></figure>

**Worked example.** For moments in the ratio 1 : 2 : 3, spin about the smallest axis gives `$\Omega^2 = \omega^2(1 - 2)(1 - 3)/(2\cdot3) = \omega^2/3$`, a wobble at `$0.577\,\omega$`; about the largest, `$\Omega = \omega$`; about the middle, `$\Omega^2 = -\omega^2/3$`, so the nudge grows as `$e^{0.577\,\omega t}$`.

<div class="myth">

**"A body always keeps spinning about the axis you start it on."** Only about a principal axis, and stably only about the largest or smallest. With energy loss (a flexing body, sloshing fuel), only the axis of **largest** moment survives, because for fixed `$L$` it has the lowest energy `$L^2/2I$`. Explorer 1, the first American satellite, was spun about its long axis (the smallest moment); its flexible antennas drained energy and within hours it was tumbling end over end.

</div>

## 5. Euler angles and the heavy symmetric top

To describe the orientation in space, use three **Euler angles**: `$\phi$` (precession, about the vertical), `$\theta$` (nutation, the tilt of the symmetry axis) and `$\psi$` (spin about the symmetry axis). For a symmetric top (`$I_1 = I_2$`) with its tip fixed and its centre of mass a distance `$l$` up the axis,

```math
L = \tfrac12I_1\left(\dot\theta^2 + \dot\phi^2\sin^2\theta\right) + \tfrac12I_3\left(\dot\psi + \dot\phi\cos\theta\right)^2 - Mgl\cos\theta
```

Both `$\phi$` and `$\psi$` are cyclic (lesson 2.1, [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/)), so three quantities are conserved: `$p_\psi = I_3\omega_3$` (the spin), `$p_\phi$` (the vertical angular momentum) and the energy. The `$\theta$` motion is then one-dimensional in an effective potential, and the axis nods (nutates) between two angles while it precesses.

<div class="steps">
<div class="step"><p><b>Fast top.</b> Assume the spin angular momentum L₃ = I₃ω₃ is much larger than the rest.</p></div>
<div class="step"><p><b>Torque.</b> Gravity acting at the centre of mass gives a horizontal torque Mgl sin θ, perpendicular to the axis.</p></div>
<div class="step"><p><b>Turning L.</b> The torque changes only the direction of L₃, swinging its horizontal part L₃ sin θ round at rate Ω.</p></div>
<div class="step"><p><b>Result.</b> Ω L₃ sin θ = Mgl sin θ, so Ω = Mgl/(I₃ω₃), the same at every tilt.</p></div>
</div>

```math
\Omega_{\rm slow} \approx \frac{Mgl}{I_3\,\omega_3}, \qquad \text{sleeping (upright) top stable if}\quad I_3^2\omega_3^2 > 4I_1Mgl
```

The exact steady-precession condition has two roots, a slow precession (the one you see) and a fast one near `$I_3\omega_3/(I_1\cos\theta)$`. As friction slows the spin below the sleeping-top limit, the upright top starts to wobble and falls.

<div class="problem" data-problem="top-precession"></div>

**Worked example: precession of the equinoxes.** The Sun and Moon pull on the Earth's equatorial bulge and exert a torque on its tilted spin. The Earth is a fast top on this scale, and its axis precesses round the pole of its orbit once every 25 800 years. Polaris will not always be the pole star.

<div class="keypoints">

- `$I_{ij} = \sum m(r^2\delta_{ij} - x_ix_j)$`; `$\vec L = I\vec\omega$`, `$T = \tfrac12\vec\omega^TI\vec\omega$`; parallel-axis `$I^{\rm cm}_{ij} + M(d^2\delta_{ij} - d_id_j)$`.
- Principal axes are the eigenvectors of `$I$`; along them `$\vec L = (I_1\omega_1, I_2\omega_2, I_3\omega_3)$`. Off a principal axis `$\vec L \nparallel \vec\omega$`, and steady spin needs torque.
- Cube about a corner: `$Ma^2/6$` about the diagonal, `$11Ma^2/12$` perpendicular.
- Euler: `$I_1\dot\omega_1 - (I_2 - I_3)\omega_2\omega_3 = \tau_1$` and cyclic.
- Free symmetric top: body-frame wobble at `$\Omega = (I_3 - I_1)\omega_3/I_1$`; Earth's prediction 305 days, observed 433.
- Tennis racket: spin about the intermediate axis is unstable; with energy loss only the largest axis is stable.
- Heavy top: `$\Omega \approx Mgl/(I_3\omega_3)$`; sleeping top needs `$I_3^2\omega_3^2 > 4I_1Mgl$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [rigid body dynamics practice page](/learn/courses/gate-physics/practice/rigid-body-dynamics/).

<div class="qbank" data-bank="physics" data-topics="rigid-body-dynamics" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.5, [small oscillations and normal modes](/learn/courses/gate-physics/normal-modes/). **Next:** lesson 2.7, [four-vectors and relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/).
