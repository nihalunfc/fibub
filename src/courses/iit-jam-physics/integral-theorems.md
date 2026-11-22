---
title: 'Gauss, Stokes and Green: the integral theorems'
seoTitle: Gauss, Stokes and Green theorems for IIT JAM Physics
summary: 'How the divergence theorem, Stokes theorem and Green theorem turn hard surface and line integrals into easy ones, why they are true, and the closing-the-surface, orientation and hidden-source traps JAM sets every year.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: The field F = (y, z, x) has zero divergence. What is its outward flux through a sphere of radius 7?
    choices: ['0', '4π × 7²', '(4/3)π × 7³', 'It depends on where the sphere is centred']
    ans: 0
    why: By the divergence theorem the flux through any closed surface equals the volume integral of ∇·F, which is zero everywhere here.
  - q: Two open surfaces share the same boundary curve C, with normals chosen by the same right-hand rule. Which flux is guaranteed to be the same through both?
    choices: ['The flux of ∇×F, for any smooth F', 'The flux of F, for any smooth F', 'The flux of ∇φ, for any smooth φ', 'None of them']
    ans: 0
    why: "By Stokes' theorem both equal the line integral of F round C. For F itself this is true only when ∇·F = 0."
  - q: "What does the anticlockwise integral ∮ (x dy − y dx) round a simple closed curve equal?"
    choices: ['Twice the enclosed area', 'The enclosed area', 'Zero', 'The length of the curve']
    ans: 0
    why: "Green's theorem with P = −y, Q = x gives ∬ (1 + 1) dA = 2 × area. Half of it is the area formula."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), sections 1.3 and 1.5'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 6'
  - 'H. M. Schey, Div, Grad, Curl, and All That, 4th ed. (2005), chapters III and IV'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 40 minutes.** By the end you will be able to choose the right theorem in seconds, turn a six-face surface integral into one line, handle open surfaces by closing them, get the orientation signs right, and spot the hidden point source that breaks the naive answer.

<div class="bigidea">Adding up a derivative over the inside of a region gives the same answer as adding up the field over its edge. Gauss, Stokes and Green are three versions of that one idea.</div>

## 1. The idea you already know

In one dimension you have used this theorem since Class 12:

```math
\int_a^b \frac{df}{dx}\,dx = f(b) - f(a)
```

Read it in words: **the total of a derivative over a region equals the function on the region's edge.** The "edge" of the interval is just its two end points, with a plus sign at the end and a minus sign at the start.

The three integral theorems are the same sentence in higher dimensions. The derivative becomes divergence or curl ([lesson 1.5](/learn/courses/iit-jam-physics/vector-calculus/)), and the edge becomes a closed surface or a closed curve.

| Theorem | Inside | Edge | Statement |
|---|---|---|---|
| Gauss (divergence) | a volume `$V$` | its closed surface `$S$` | `$\iiint_V \nabla\cdot\vec F\,dV = \oint_S \vec F\cdot d\vec a$` |
| Stokes | an open surface `$S$` | its boundary curve `$C$` | `$\iint_S (\nabla\times\vec F)\cdot d\vec a = \oint_C \vec F\cdot d\vec l$` |
| Green (flat Stokes) | a region `$R$` in the plane | its boundary `$C$` | `$\iint_R \left(\partial_x Q - \partial_y P\right)dA = \oint_C (P\,dx + Q\,dy)$` |

Keep this table in your head and half of every JAM question on the topic is already done: you only have to decide which row you are in.

## 2. The divergence theorem: sources inside, flux outside

Divergence is the net outflow per unit volume from a tiny box ([lesson 1.5](/learn/courses/iit-jam-physics/vector-calculus/)). Stack many tiny boxes to fill a big volume. Where two boxes touch, whatever leaves one enters its neighbour, so those inner faces cancel. Only the faces on the outside survive, and their total is the flux through the outer surface.

```math
\iiint_V \nabla\cdot\vec F\,dV = \oint_S \vec F\cdot d\vec a \qquad (d\vec a \text{ points outward})
```

Drag the paddle wheel around, switch fields, and press Play to let dots drift with the flow.

<figure class="fig" data-fig="@math-field-flow"><figcaption>Notice that the wheel turns only where the curl is not zero, and the dots spread out only where the divergence is positive.</figcaption></figure>

<div class="meaning">

<dl>
<dt>∇·F dV</dt><dd>how much "stuff" is created in a tiny piece of the volume</dd>
<dt>F · da</dt><dd>how much crosses a tiny patch of the surface, counted positive going out</dd>
<dt>∮ (circle on the integral)</dt><dd>the surface is closed: it has an inside and an outside, and no edge</dd>
<dt>Physical meaning</dt><dd>Whatever is produced inside must flow out through the walls. With F = E it becomes Gauss's law: flux = charge enclosed / ε₀.</dd>
</dl>

</div>

**Worked example.** Find the outward flux of `$\vec F = x^2\hat i + y^2\hat j + z^2\hat k$` through the cube `$0 \le x, y, z \le 2$`.

1. Six surface integrals would work, but compute the divergence first: `$\nabla\cdot\vec F = 2x + 2y + 2z$`.
2. Over the cube, `$\iiint x\,dV = \left(\int_0^2 x\,dx\right)(2)(2) = 2\times4 = 8$`, and the same for `$y$` and `$z$`.
3. Flux `$= 2(8 + 8 + 8) = 48$`.

The habit to build: **always compute the divergence before touching a surface.** If it is a constant, the flux is that constant times the volume, and you are done in one line. If it is zero, the flux is zero.

<div class="problem" data-problem="flux-box"></div>

### Open surfaces: close them

JAM often asks for the flux through an *open* surface: a hemisphere, the curved side of a cylinder, a paraboloid cap. The divergence theorem needs a closed surface, so **close it yourself** with a flat lid, use the theorem on the closed shape, and subtract the lid.

**Worked example.** Find the flux of `$\vec F = x\hat i + y\hat j + z\hat k$` through the curved side of the cylinder `$x^2 + y^2 = 4$`, `$0 \le z \le 3$`.

1. Closed cylinder: `$\nabla\cdot\vec F = 3$`, volume `$\pi(2)^2(3) = 12\pi$`, so the total flux is `$36\pi$`.
2. Top lid `$z = 3$`, outward normal `$+\hat k$`: `$F_z = 3$` over area `$4\pi$` gives `$12\pi$`.
3. Bottom lid `$z = 0$`, outward normal `$-\hat k$`: `$F_z = 0$` there, so 0.
4. Curved side `$= 36\pi - 12\pi - 0 = 24\pi$`.

Check: on the side, `$\vec F\cdot\hat n$` is the distance from the axis, 2, and the area is `$2\pi(2)(3) = 12\pi$`: flux `$24\pi$` ✓. The sign to watch is the bottom lid: its *outward* normal points **down**.

## 3. Stokes' theorem: swirl inside, circulation round the edge

Now take an open surface, like a soap film on a bent wire. Chop it into tiny cells. Round each cell, the circulation (line integral) is the curl through the cell times its area. Step through what happens when you add the cells:

<div class="steps" data-fig="cell-cancel">
<div class="step"><p><b>One cell.</b> For a tiny cell, the line integral round its four edges is (∇×F)·n̂ times its area. That is what curl means.</p></div>
<div class="step"><p><b>Two neighbours.</b> The edge they share is walked upward by one cell and downward by the other, so its two contributions cancel exactly.</p></div>
<div class="step"><p><b>All the cells.</b> Every inner edge is shared, so every inner edge cancels. Adding all the cells still gives the sum of (∇×F)·n̂ dA.</p></div>
<div class="step"><p><b>Only the boundary survives.</b> What is left is the line integral round the outer edge. So the flux of the curl through the surface equals the circulation round its boundary.</p></div>
</div>

```math
\iint_S (\nabla\times\vec F)\cdot d\vec a = \oint_C \vec F\cdot d\vec l
```

**Orientation.** The direction round `$C$` and the side the normal points to are tied by the **right-hand rule**: curl the fingers of your right hand along the direction of travel, and your thumb gives the normal. Anticlockwise seen from above goes with `$+\hat k$`. Reverse the direction and the answer changes sign; examiners love writing "clockwise as seen from the positive `$z$`-axis" to test exactly this.

**The superpower.** The surface can be **any** surface with edge `$C$`. A hemisphere and the flat disc under it share the unit circle as their edge, so the flux of a curl is the same through both. Always swap a curved surface for the flattest one you can find.

**Worked example.** Evaluate `$\oint_C (z\,dx + x\,dy + y\,dz)$` anticlockwise round the circle `$x^2 + y^2 = 4$`, `$z = 0$`.

1. `$\vec F = (z, x, y)$`, so `$\nabla\times\vec F = (1, 1, 1)$`, a constant.
2. Use the flat disc, normal `$\hat k$`: `$(\nabla\times\vec F)\cdot\hat k = 1$`.
3. Flux of the curl `$= 1\times(\text{area } 4\pi) = 4\pi$`.

Direct check: on `$z = 0$` only `$\oint x\,dy$` survives, and that is the area, `$4\pi$` ✓.

## 4. Green's theorem: Stokes in a flat plane

Put Stokes on a flat region of the `$xy$`-plane with `$\vec F = (P, Q, 0)$`. Then `$(\nabla\times\vec F)\cdot\hat k = \partial_x Q - \partial_y P$`, and for an anticlockwise boundary:

```math
\oint_C (P\,dx + Q\,dy) = \iint_R \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dA
```

Move and resize the loop, change the field, and compare the two numbers in the readout.

<figure class="fig" data-fig="@math-green-loop"><figcaption>Notice that the circulation round the edge and the sum of curl over the inside are always equal (and likewise flux and divergence): Green's and the divergence theorem in the plane.</figcaption></figure>

Memory aid: "**Q first, then P**", the same order as in the `$z$`-component of the curl, `$\partial_x F_y - \partial_y F_x$`.

Three choices of `$P$` and `$Q$` give the **area** enclosed by `$C$`:

```math
A = \oint_C x\,dy = -\oint_C y\,dx = \frac12\oint_C (x\,dy - y\,dx)
```

**Worked example.** Find `$\oint_C [(x^2 - y)\,dx + (y^2 + x)\,dy]$` anticlockwise round the triangle with corners `$(0,0)$`, `$(2,0)$`, `$(0,2)$`.

1. `$\partial_x Q - \partial_y P = 1 - (-1) = 2$`.
2. The triangle's area is `$\tfrac12(2)(2) = 2$`.
3. Integral `$= 2\times2 = 4$`. The `$x^2$` and `$y^2$` parts are decoys: they never contribute to a closed integral.

<div class="myth">

**"Zero curl means the circulation round every loop is zero."** Only if the region inside the loop has no holes. The field `$\vec F = (-y\,\hat i + x\,\hat j)/(x^2 + y^2)$` has zero curl everywhere except the origin, where it is not even defined. Round any loop that encloses the origin its circulation is `$2\pi$`; round a loop that does not, it is 0. Green and Stokes need the field to be smooth on the *whole* surface, so check for points where it blows up before you write "zero by Stokes".

</div>

## 5. Hidden sources and solid angle

The point-charge field `$\vec F = \hat r/r^2 = \vec r/r^3$` has zero divergence for `$r > 0$`, yet its flux through any closed surface around the origin is `$4\pi$`. The whole source is packed into the origin: `$\nabla\cdot(\hat r/r^2) = 4\pi\,\delta^3(\vec r)$`.

So for this field:

- **origin inside** the closed surface (any shape): flux `$4\pi$`;
- **origin outside**: flux 0;
- an **open** surface: flux = the **solid angle** it covers as seen from the origin.

That last rule solves questions that look impossible. An infinite plane not through the origin covers half the sky: flux `$2\pi$`. One face of a cube centred at the origin covers one sixth: `$4\pi/6$`. A disc of radius `$a$` at distance `$d$` covers `$\Omega = 2\pi\left(1 - d/\sqrt{d^2 + a^2}\right)$`.

The same symmetry trick answers the classic Gauss's law puzzles. A charge `$q$` at the **corner** of a cube is shared by 8 cubes that meet there, so one cube gets `$q/8\varepsilon_0$`; at the middle of an **edge**, 4 cubes share it (`$q/4\varepsilon_0$`); at the centre of a **face**, 2 (`$q/2\varepsilon_0$`). Try the field idea live in fibub's [Gauss's law tool](/learn/gauss-law/).

## 6. A one-minute checklist for any exam question

1. **Closed surface?** Compute `$\nabla\cdot\vec F$`. Constant: multiply by the volume. Zero: answer 0 (unless there is a singular point inside).
2. **Open surface, flux of `$\vec F$`?** Close it with flat lids, use Gauss, subtract the lids (watch the outward normal of each lid).
3. **Open surface, flux of a curl?** Use Stokes and replace the surface by the flattest one with the same edge, or compute the line integral round the edge.
4. **Closed line integral?** Check the curl. Zero curl and no holes: answer 0. Otherwise use Stokes or Green with the flattest surface.
5. **Orientation**: anticlockwise from above goes with `$+\hat k$`; flip the sign for clockwise.
6. **Singular point** (a `$1/r^2$` field or `$1/s$` around an axis)? Ask whether it is inside.

<div class="keypoints">

- All three theorems say: the total of a derivative over a region equals the field summed over its edge.
- Gauss: `$\iiint\nabla\cdot\vec F\,dV = \oint\vec F\cdot d\vec a$` over a closed surface with outward normal.
- Stokes: `$\iint(\nabla\times\vec F)\cdot d\vec a = \oint\vec F\cdot d\vec l$`; the surface can be any surface with that edge, oriented by the right-hand rule.
- Green: `$\oint(P\,dx + Q\,dy) = \iint(\partial_xQ - \partial_yP)\,dA$` anticlockwise; `$\tfrac12\oint(x\,dy - y\,dx)$` is the area.
- For an open surface, close it, use Gauss, and subtract the lids. The flux of a curl through any closed surface is zero.
- `$\hat r/r^2$` gives `$4\pi$` through closed surfaces around the origin, 0 otherwise, and the solid angle through open ones.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [integral theorems practice page](/learn/courses/iit-jam-physics/practice/integral-theorems/).

<div class="qbank" data-bank="physics" data-topics="integral-theorems" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.5, gradient, divergence and curl](/learn/courses/iit-jam-physics/vector-calculus/). **Next:** [lesson 1.7](/learn/courses/iit-jam-physics/differential-equations/), differential equations. You will use these theorems all through electromagnetism: Gauss's law, Ampère's law and Faraday's law are exactly these three statements applied to E and B. Going on to GATE or CSIR NET? The GATE Physics course uses them with [the Dirac delta and Green's functions](/learn/courses/gate-physics/delta-greens-functions/).
