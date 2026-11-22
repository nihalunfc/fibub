---
title: Double and triple integrals in any coordinates
seoTitle: Double and triple integrals for IIT JAM Physics
summary: 'How to set up double and triple integrals, read the limits off a sketch, change the order of integration, and switch to polar, cylindrical or spherical coordinates with the right Jacobian, then use them for areas, volumes, mass, centres of mass, moments of inertia and the Gaussian integral.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'What is the volume element in spherical coordinates (θ measured from the z-axis)?'
    choices: ['r² sin θ dr dθ dφ', 'r sin θ dr dθ dφ', 'r² cos θ dr dθ dφ', 'dr dθ dφ']
    ans: 0
    why: 'The cell has edges dr, r dθ and r sin θ dφ at right angles; their product is r² sin θ dr dθ dφ.'
  - q: 'Over the disc x² + y² ≤ 1, which integral is zero by symmetry alone?'
    choices: ['∬ xy dA', '∬ x² dA', '∬ (x² + y²) dA', '∬ 1 dA']
    ans: 0
    why: 'xy changes sign under x → −x while the disc does not change, so the positive and negative parts cancel. The other three integrands are never negative.'
  - q: 'Where is the centre of mass of a uniform solid hemisphere of radius R?'
    choices: ['3R/8 above the flat face', 'R/2 above the flat face', '4R/(3π) above the flat face', '3R/4 above the flat face']
    ans: 0
    why: 'Slicing into discs, the integral gives 3R/8. R/2 belongs to a thin hemispherical shell and 4R/(3π) to a flat semicircular plate.'
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 5: multiple integrals'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (2006), chapter 6'
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), centre of mass and moment of inertia integrals'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 45 minutes.** By the end you will be able to sketch a region and read off the limits of a double or triple integral in either order, choose the coordinates that make an integral easy, use the correct area or volume element every time, and compute the areas, volumes, masses, charges, centres of mass and moments of inertia that JAM asks for.

<div class="bigidea">A multiple integral adds up tiny pieces. Choose pieces that fit the shape (rings for discs, shells for balls) and remember that a piece's size is not always dx dy dz.</div>

## 1. Adding up pieces

A double integral `$\iint_Df\,dA$` cuts the region `$D$` into tiny patches of area `$dA$`, multiplies each by the value of `$f$` there, and adds. If `$f$` is a surface density, the answer is a mass; if `$f = 1$`, it is just the area. In practice you do it as two ordinary integrals one after the other (an **iterated integral**):

```math
\iint_Df\,dA = \int_a^b\left(\int_{y_1(x)}^{y_2(x)}f(x, y)\,dy\right)dx
```

The inner integral runs along a vertical strip at fixed `$x$`, from the bottom edge `$y_1(x)$` to the top edge `$y_2(x)$`. The outer one adds the strips from `$x = a$` to `$x = b$`. **The inner limits may depend on the outer variable; the outer limits must be numbers.**

**Worked example.** Find the area between `$y = x^2$` and `$y = x$`.

1. Sketch: the curves meet at `$x = 0$` and `$x = 1$`; between them the line is on top.
2. Vertical strips: `$y$` from `$x^2$` to `$x$`. Area `$= \int_0^1(x - x^2)dx = \tfrac12 - \tfrac13 = \tfrac16$`.
3. Check with horizontal strips: for fixed `$y$`, `$x$` runs from `$y$` (the line) to `$\sqrt y$` (the parabola): `$\int_0^1(\sqrt y - y)dy = \tfrac23 - \tfrac12 = \tfrac16$`.

See areas built from strips in the [Riemann sums tool](/learn/riemann-sums/).

## 2. Changing the order of integration

Sometimes the inner integral cannot be done as written, but the other order is easy. The recipe is always the same: **sketch the region, then describe it the other way.**

**Worked example.** Evaluate `$\displaystyle\int_0^1\int_y^1e^{x^2}dx\,dy$`.

1. `$e^{x^2}$` has no elementary antiderivative, so the inner integral is stuck.
2. The region is `$0\le y\le x\le1$`: the triangle under the diagonal. For fixed `$x$`, `$y$` runs from `$0$` to `$x$`.
3. Reversed: `$\int_0^1\int_0^xe^{x^2}dy\,dx = \int_0^1xe^{x^2}dx = \tfrac12(e - 1)$`. The new inner integral supplied exactly the factor `$x$` that was missing.

**Symmetry first.** Before integrating anything, look for symmetry. If the region is unchanged by `$x\to-x$` and the integrand changes sign, the integral is zero. Over a disc, `$\iint x\,dA = \iint xy\,dA = 0$`, but `$\iint x^2dA > 0$`. And by symmetry `$\iint x^2dA = \iint y^2dA = \tfrac12\iint r^2dA$`, which turns many integrals into one line.

## 3. Curved coordinates and their elements

The patch `$dA$` is only `$dx\,dy$` in Cartesian coordinates. In other coordinates, find the patch's edge lengths and multiply them (this is the Jacobian of [lesson 1.2](/learn/courses/iit-jam-physics/partial-derivatives/)). Switch between the three systems below and move `$r$` and `$\theta$`.

<figure class="fig" data-fig="volume-elements"><figcaption>Each edge is a small step in one coordinate times how far that step moves you. The product is the element. In spherical coordinates the cells shrink near the poles because circles of latitude do.</figcaption></figure>

| Coordinates | Element | Use it for |
|---|---|---|
| Polar `$(r, \theta)$` | `$dA = r\,dr\,d\theta$` | discs, rings, sectors, anything round in a plane |
| Cylindrical `$(s, \phi, z)$` | `$dV = s\,ds\,d\phi\,dz$` | cylinders, cones, wires, anything with an axis |
| Spherical `$(r, \theta, \phi)$` | `$dV = r^2\sin\theta\,dr\,d\theta\,d\phi$` | balls, shells, point sources, anything round in 3D |

In spherical coordinates `$\theta$` runs from `$0$` to `$\pi$` (pole to pole) and `$\phi$` from `$0$` to `$2\pi$`. Over a full sphere `$\int\sin\theta\,d\theta\,d\phi = 4\pi$`: the total solid angle. A shell of radius `$r$` and thickness `$dr$` has volume `$4\pi r^2dr$`, and a ring of radius `$r$` and width `$dr$` has area `$2\pi r\,dr$`; most "radial" integrals use just these.

<div class="meaning">

<dl>
<dt>r dr dθ</dt><dd>a patch of a disc: arc length r dθ times radial width dr</dd>
<dt>s ds dφ dz</dt><dd>the same patch, given a height dz</dd>
<dt>r² sin θ dr dθ dφ</dt><dd>a piece of a spherical shell: r dθ along a meridian, r sin θ dφ round a circle of latitude, dr outwards</dd>
<dt>sin θ dθ dφ</dt><dd>solid angle: the area of the patch on a sphere of radius 1</dd>
<dt>Physical meaning</dt><dd>Far from the centre there is more room: a ring at large r holds more area than one near the middle. Forgetting the Jacobian treats every ring as equal, which is the most common integration error in JAM.</dd>
</dl>

</div>

**Worked example.** A disc of radius `$R$` has surface density `$\sigma = kr$`. Its mass is `$M = \int_0^R kr\cdot2\pi r\,dr = \tfrac23\pi kR^3$`.

<div class="problem" data-problem="disc-mass-polar"></div>

**Worked example.** A ball of radius 1 m holds charge density `$\rho = 3\cos^2\theta$` C/m³. The charge is `$\int_0^1r^2dr\int_0^\pi3\cos^2\theta\sin\theta\,d\theta\int_0^{2\pi}d\phi = \tfrac13\cdot2\cdot2\pi = 4\pi/3$` C. (The `$\theta$` integral is `$\int_{-1}^1 3u^2du = 2$` with `$u = \cos\theta$`.)

<div class="myth">

**"A hemisphere covers a solid angle of π, because θ only goes to π/2."** Wrong. The whole sphere is `$4\pi$`, so half of it is `$2\pi$`: `$\int_0^{2\pi}\int_0^{\pi/2}\sin\theta\,d\theta\,d\phi = 2\pi\times1$`. The same slip in the other direction is integrating `$\theta$` from `$0$` to `$2\pi$` for a full sphere, which gives zero.

</div>

## 4. The Gaussian integral, at last

[Lesson 1.1](/learn/courses/iit-jam-physics/calculus-and-series/) used `$\int_{-\infty}^{\infty}e^{-x^2}dx = \sqrt\pi$`. Here is why. Call the integral `$I$` and square it:

<div class="steps">
<div class="step"><p><b>Square it.</b> I² = ∫e<sup>−x²</sup>dx · ∫e<sup>−y²</sup>dy = ∬ e<sup>−(x²+y²)</sup> dx dy over the whole plane.</p></div>
<div class="step"><p><b>Go polar.</b> x² + y² = r² and dx dy = r dr dθ, with r from 0 to ∞ and θ from 0 to 2π.</p></div>
<div class="step"><p><b>The Jacobian helps.</b> ∫₀<sup>∞</sup> e<sup>−r²</sup> r dr = ½, because the extra r makes it an exact derivative.</p></div>
<div class="step"><p><b>Finish.</b> I² = 2π × ½ = π, so I = √π. With e<sup>−ax²</sup> every length scales by 1/√a, giving √(π/a).</p></div>
</div>

## 5. Centres of mass and moments of inertia

The centre of mass is the mass-weighted average position, and the moment of inertia about an axis adds up mass times squared distance from it:

```math
\bar z = \frac{1}{M}\int z\,dm, \qquad I = \int d_\perp^2\,dm
```

Slice so that each slice is simple. For a solid hemisphere of radius `$R$`, discs at height `$z$` have radius `$\sqrt{R^2 - z^2}$`:

```math
\bar z = \frac{\int_0^R z\,\pi(R^2 - z^2)\,dz}{\tfrac23\pi R^3} = \frac{\pi R^4/4}{2\pi R^3/3} = \frac{3R}{8}
```

The results worth remembering (measured from the centre of the full circle or sphere): semicircular wire `$2R/\pi$`, semicircular plate `$4R/3\pi$`, hemispherical shell `$R/2$`, solid hemisphere `$3R/8$`, solid cone `$h/4$` from its base. See [moment of inertia](/learn/courses/iit-jam-physics/moment-of-inertia/) for the axis theorems that go with these integrals.

**Worked example.** A ball's density rises as `$\rho_0r/R$`. Its mass is `$\int\rho_0(r/R)4\pi r^2dr = \pi\rho_0R^3$`. Its moment of inertia about a diameter uses `$d_\perp^2$` averaged over a shell, `$\tfrac23r^2$`: `$I = \tfrac23\int\rho_0(r/R)4\pi r^4dr = \tfrac49\pi\rho_0R^5 = \tfrac49MR^2$`. More than the uniform ball's `$\tfrac25MR^2$`, because the mass sits further out.

## 6. Any substitution: the general Jacobian

For a general change `$u = u(x, y)$`, `$v = v(x, y)$`, the area element is `$dx\,dy = |\partial(x, y)/\partial(u, v)|\,du\,dv$`. Choose `$u$` and `$v$` so that the boundary curves become `$u$` = constant and `$v$` = constant.

**Worked example.** The region between `$xy = 1$`, `$xy = 2$`, `$y = x$` and `$y = 4x$` becomes the rectangle `$1\le u\le2$`, `$1\le v\le4$` with `$u = xy$`, `$v = y/x$`. Since `$\partial(u, v)/\partial(x, y) = 2v$`, `$dx\,dy = du\,dv/(2v)$`, and the area is `$\int_1^2\int_1^4\frac{dv}{2v}du = \tfrac12\ln4 = \ln2$`. Similarly, scaling `$x = au$`, `$y = bv$`, `$z = cw$` turns an ellipsoid into a unit ball, so its volume is `$abc\cdot\tfrac43\pi$`.

<div class="keypoints">

- Sketch the region first. Inner limits may depend on the outer variable; outer limits are numbers.
- Changing the order of integration can turn an impossible inner integral into an easy one.
- Use symmetry: odd integrands over symmetric regions vanish; `$\iint x^2 = \iint y^2 = \tfrac12\iint r^2$`.
- Elements: `$r\,dr\,d\theta$`, `$s\,ds\,d\phi\,dz$`, `$r^2\sin\theta\,dr\,d\theta\,d\phi$`; rings `$2\pi r\,dr$`, shells `$4\pi r^2dr$`; full solid angle `$4\pi$`.
- `$\int_{-\infty}^\infty e^{-ax^2}dx = \sqrt{\pi/a}$` comes from squaring and going polar.
- Centres of mass: wire `$2R/\pi$`, plate `$4R/3\pi$`, shell `$R/2$`, solid hemisphere `$3R/8$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [multiple integrals practice page](/learn/courses/iit-jam-physics/practice/multiple-integrals/).

<div class="qbank" data-bank="physics" data-topics="multiple-integrals" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.2, partial derivatives and Jacobians](/learn/courses/iit-jam-physics/partial-derivatives/). **Next:** lesson 1.4, [vector algebra](/learn/courses/iit-jam-physics/vector-algebra/). Surface and volume integrals of fields come back in [the integral theorems](/learn/courses/iit-jam-physics/integral-theorems/) and in [Gauss's law](/learn/courses/iit-jam-physics/electrostatics-gauss/), where choosing spherical or cylindrical pieces does all the work. Practise the rules for single integrals in [definite integral properties](/learn/integral-properties/).
