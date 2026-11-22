---
title: Gradient, divergence and curl
seoTitle: Gradient, divergence and curl for IIT JAM Physics
summary: 'What the gradient, divergence and curl of a field really measure, how to compute them in seconds, the identities JAM loves, and the traps in Cartesian and curved coordinates.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: The field F = (−y, x, 0) describes water swirling round the z-axis. What are its divergence and curl?
    choices: ['Divergence 0, curl 2k', 'Divergence 2, curl 0', 'Divergence 0, curl 0', 'Divergence 2, curl 2k']
    ans: 0
    why: ∂(−y)/∂x + ∂x/∂y = 0, so nothing piles up anywhere. The z-component of the curl is ∂x/∂x − ∂(−y)/∂y = 1 + 1 = 2, twice the angular velocity of the swirl.
  - q: Which of these is zero for every smooth scalar field φ?
    choices: ['curl (grad φ)', 'div (grad φ)', 'grad (div grad φ)', 'None of them']
    ans: 0
    why: The curl of a gradient always vanishes because mixed partial derivatives are equal. div grad φ is the Laplacian, which is zero only for special (harmonic) fields.
  - q: In which direction does a scalar field φ increase fastest at a point?
    choices: ['Along grad φ', 'At right angles to grad φ', 'Along the level surface φ = constant', 'Along −grad φ']
    ans: 0
    why: The rate of change along a unit vector n is grad φ · n, which is largest when n points along grad φ. Along a level surface the rate is zero.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 1: vector analysis'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 6'
  - 'H. M. Schey, Div, Grad, Curl, and All That, 4th ed. (2005)'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 35 minutes.** By the end you will be able to compute gradient, divergence and curl in your head for typical exam fields, explain what each one means physically, use the standard identities without memorising a table, and avoid the two classic traps in spherical and cylindrical coordinates.

<div class="bigidea">A field has three kinds of local behaviour: how fast it climbs (gradient), how much it spreads out from a point (divergence) and how much it swirls around a point (curl).</div>

## 1. One symbol, three jobs

Every formula in this lesson uses one operator, called **del** or **nabla**:

```math
\nabla = \hat i\,\frac{\partial}{\partial x} + \hat j\,\frac{\partial}{\partial y} + \hat k\,\frac{\partial}{\partial z}
```

Think of it as a "vector that differentiates". It can act on a field in exactly the three ways you can multiply with a vector:

| Operation | Acts on | Gives | Like |
|---|---|---|---|
| `$\nabla\phi$` (gradient) | a scalar field | a vector | a number times a vector |
| `$\nabla\cdot\vec F$` (divergence) | a vector field | a scalar | the dot product |
| `$\nabla\times\vec F$` (curl) | a vector field | a vector | the cross product |

If you remember that table, you will never write the curl of a scalar or the gradient of a vector by mistake: those are the first things examiners use as wrong options.

## 2. Gradient: the direction of steepest climb

Picture a hill whose height is `$\phi(x, y)$`. At each point, the gradient is an arrow that points straight uphill, and its length is how steep the slope is there.

```math
\nabla\phi = \frac{\partial\phi}{\partial x}\hat i + \frac{\partial\phi}{\partial y}\hat j + \frac{\partial\phi}{\partial z}\hat k
```

The rate of change of `$\phi$` in any direction `$\hat n$` (a unit vector) is the **directional derivative** `$\nabla\phi\cdot\hat n$`. It is largest along `$\nabla\phi$` and zero along a level surface, so **the gradient is always perpendicular to the surfaces `$\phi$` = constant**. That single fact gives you normals to surfaces for free: the normal to `$x^2 + y^2 + z^2 = 9$` at any point is along `$\nabla(x^2+y^2+z^2) = 2\vec r$`, straight out from the centre.

<div class="meaning">

<dl>
<dt>∇φ</dt><dd>an arrow pointing the way φ grows fastest</dd>
<dt>|∇φ|</dt><dd>how fast φ grows per metre in that direction</dd>
<dt>∇φ · n̂</dt><dd>how fast φ grows if you walk along n̂ instead</dd>
<dt>Physical meaning</dt><dd>Forces push "downhill" in potential energy: F = −∇U. Heat flows down the temperature gradient. Electric field is E = −∇V.</dd>
</dl>

</div>

**Worked example.** Find the rate of change of `$\phi = xyz$` at `$(1, 2, 3)$` along `$\hat i + 2\hat j + 2\hat k$`.

1. `$\nabla\phi = (yz, xz, xy) = (6, 3, 2)$` at that point.
2. The direction has length `$\sqrt{1 + 4 + 4} = 3$`, so `$\hat n = (1, 2, 2)/3$`.
3. `$\nabla\phi\cdot\hat n = (6 + 6 + 4)/3 = 16/3$`.

The most common slip is step 2: forgetting to turn the direction into a unit vector, which gives 16.

## 3. Divergence: how much flows out

Now think of `$\vec F$` as the velocity of a fluid. Put a tiny imaginary box at a point and ask: **does more fluid leave the box than enter it?** The net outflow per unit volume is the divergence. Tap the picture below to move the probe square to different points and try each field.

<figure class="fig" data-fig="field-probe"><figcaption>The square measures net outflow (divergence); the paddle wheel measures spin (curl). The source spreads out everywhere; the rotation only spins.</figcaption></figure>

Why is the formula just a sum of three derivatives? Step through it:

<div class="steps">
<div class="step"><p><b>A tiny box.</b> Take a box with sides <i>dx</i>, <i>dy</i>, <i>dz</i>. Fluid crosses its six faces.</p></div>
<div class="step"><p><b>The two x-faces.</b> Out of the right face flows F<sub>x</sub>(x + dx) · dy dz; into the left face flows F<sub>x</sub>(x) · dy dz. The difference is (∂F<sub>x</sub>/∂x) dx dy dz.</p></div>
<div class="step"><p><b>The other faces.</b> In the same way, the y-faces add (∂F<sub>y</sub>/∂y) dx dy dz and the z-faces add (∂F<sub>z</sub>/∂z) dx dy dz.</p></div>
<div class="step"><p><b>Per unit volume.</b> Divide the total by the volume dx dy dz: net outflow per volume = ∂F<sub>x</sub>/∂x + ∂F<sub>y</sub>/∂y + ∂F<sub>z</sub>/∂z. That is ∇·F.</p></div>
<div class="step"><p><b>Add up all the boxes.</b> Inner faces cancel between neighbours, so the total over a big region is the flow through its outer surface. That is the divergence theorem (lesson 1.6).</p></div>
</div>

```math
\nabla\cdot\vec F = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}
```

**A result worth knowing by heart.** For `$\vec r = x\hat i + y\hat j + z\hat k$` and `$r = |\vec r|$`:

```math
\nabla\cdot\vec r = 3, \qquad \nabla\cdot\left(r^n\,\vec r\right) = (n + 3)\,r^n
```

Put `$n = -3$`: `$\nabla\cdot(\vec r/r^3) = 0$` everywhere except the origin. That is the field of a point charge, and it is why Gauss's law gives the same flux through any surface around the charge.

<div class="problem" data-problem="div-at-point"></div>

## 4. Curl: how much it swirls

Drop a tiny paddle wheel into the flow. If the water on one side moves faster than on the other, the wheel turns. The curl is a vector along the wheel's axis whose size is (twice) how fast it spins.

```math
\nabla\times\vec F = \begin{vmatrix} \hat i & \hat j & \hat k \\ \partial_x & \partial_y & \partial_z \\ F_x & F_y & F_z \end{vmatrix}
= \left(\partial_y F_z - \partial_z F_y\right)\hat i + \left(\partial_z F_x - \partial_x F_z\right)\hat j + \left(\partial_x F_y - \partial_y F_x\right)\hat k
```

Two fields every student should picture:

- **Rigid rotation** `$\vec F = \vec\omega\times\vec r$`, for example `$(-y, x, 0)$` with `$\omega = 1$`: curl `$= 2\vec\omega$`, divergence 0.
- **Shear flow** `$\vec F = (y, 0, 0)$`: the lines are all straight, yet the curl is `$-\hat k$`, because the top of the paddle wheel is pushed harder than the bottom.

<div class="myth">

**"Straight streamlines mean zero curl."** Wrong. Curl is about whether *neighbouring* layers move at different speeds, not whether the flow goes round in circles. The shear flow has straight lines and non-zero curl; the field `$\hat\phi/s$` around a wire goes round in circles and has zero curl everywhere except on the wire.

</div>

A field with zero curl everywhere (in a region without holes) is **conservative**: it is the gradient of some potential, and line integrals depend only on the end points. JAM uses this every year: check the curl first, find the potential, and a long path integral becomes a subtraction.

## 5. The second derivatives and the identities

Applying `$\nabla$` twice gives five combinations. Two are always zero, and you can see why without algebra:

| Combination | Value | Why |
|---|---|---|
| `$\nabla\times(\nabla\phi)$` | `$\vec 0$` always | a slope field has no swirl (mixed partials are equal) |
| `$\nabla\cdot(\nabla\times\vec A)$` | `$0$` always | a pure swirl has no source |
| `$\nabla\cdot(\nabla\phi) = \nabla^2\phi$` | the Laplacian | zero only for harmonic `$\phi$` |
| `$\nabla\times(\nabla\times\vec A)$` | `$\nabla(\nabla\cdot\vec A) - \nabla^2\vec A$` | "BAC minus CAB" |
| `$\nabla(\nabla\cdot\vec A)$` | not simpler | |

Product rules work like ordinary ones, keeping the order of vectors in cross products. The ones that save the most time:

```math
\nabla\cdot(\phi\vec A) = \phi\,\nabla\cdot\vec A + \vec A\cdot\nabla\phi, \qquad \nabla\times(\phi\vec A) = \phi\,\nabla\times\vec A + \nabla\phi\times\vec A
```

## 6. Curved coordinates: the two traps

In spherical coordinates the divergence is **not** just `$\partial F_r/\partial r + \dots$`:

```math
\nabla\cdot\vec F = \frac{1}{r^2}\frac{\partial}{\partial r}\left(r^2F_r\right) + \frac{1}{r\sin\theta}\frac{\partial}{\partial\theta}\left(\sin\theta\,F_\theta\right) + \frac{1}{r\sin\theta}\frac{\partial F_\phi}{\partial\phi}
```

**Trap 1.** For `$\vec F = r\,\hat r$` the naive answer `$\partial F_r/\partial r = 1$` is wrong; the correct `$\frac{1}{r^2}\frac{d}{dr}(r^3) = 3$` matches `$\nabla\cdot\vec r = 3$`. The extra factors are there because the unit vectors themselves change direction from point to point.

**Trap 2.** The field `$\hat r/r^2$` has zero divergence for `$r > 0$`, but its flux through any closed surface around the origin is `$4\pi$`. The whole source is concentrated at the origin: `$\nabla\cdot(\hat r/r^2) = 4\pi\,\delta^3(\vec r)$`. If the origin is outside your surface, the flux is zero.

<div class="keypoints">

- `$\nabla$` acts like a vector: gradient (on scalars), divergence (dot), curl (cross). Never mix their inputs and outputs.
- The gradient points uphill and is perpendicular to level surfaces; the directional derivative is `$\nabla\phi\cdot\hat n$` with a **unit** vector.
- Divergence is net outflow per unit volume; curl is local spin (twice the angular velocity for rigid rotation).
- Curl of a gradient and divergence of a curl are always zero. `$\nabla\cdot(r^n\vec r) = (n+3)r^n$`.
- Zero curl in a region without holes means conservative: find a potential and subtract.
- In spherical and cylindrical coordinates use the full formulas, and watch for sources hidden at a singular point.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [vector calculus practice page](/learn/courses/iit-jam-physics/practice/vector-calculus/).

<div class="qbank" data-bank="physics" data-topics="vector-calculus" data-exam="jam" data-n="10"></div>

**Next:** lesson 1.6 turns these local ideas into the big integral theorems of Gauss, Stokes and Green, which you will use all through electromagnetism. Going on to GATE? The [GATE Physics course](/learn/courses/gate-physics/) builds on this with tensors and curvilinear coordinates in general.
