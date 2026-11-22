---
title: Conductors, Laplace's equation and images
seoTitle: Conductors and method of images for IIT JAM Physics
summary: 'Conductors in equilibrium, surface charge and the pressure on it, cavities and screening, what Laplace''s equation forbids, the uniqueness theorem, separation of variables in a slot, and the method of images for planes, corners and spheres, with the sphere in a uniform field.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A charge q is held at height d above a large grounded metal plate. What is the force on it?
    choices: ['kq²/(4d²), towards the plate', 'kq²/d², towards the plate', 'kq²/(2d²), towards the plate', 'Zero, because the plate is at zero potential']
    ans: 0
    why: The plate acts like an image −q at depth d, so the charge is 2d from its image. Using d instead of 2d gives four times the right answer.
  - q: An empty cavity inside a neutral metal block. A big charge is brought near the outside. What is the field in the cavity?
    choices: ['Zero', 'Pointing away from the outside charge', 'The same as without the metal', 'It depends on the shape of the cavity']
    ans: 0
    why: The cavity's whole boundary is one equipotential and it holds no charge, so by uniqueness V is constant inside and E = 0. This is the Faraday cage.
  - q: Two metal spheres of radii 1 cm and 4 cm are joined by a long wire. What is the ratio of their surface charge densities (small to large)?
    choices: ['4', '1/4', '16', '1']
    ans: 0
    why: Joined, they share one potential, so Q is proportional to R and σ = Q/4πR² is proportional to 1/R. The smaller sphere has the denser charge, which is why charge crowds onto sharp points.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapters 2.5 and 3'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 3'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 1 and 2 (for the uniqueness theorem and images)'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 45 minutes.** By the end you will know exactly what a conductor does to the field around it, why empty cavities are screened, what Laplace's equation allows and forbids, why one solution is the only solution, and how to replace a grounded conductor by a few imaginary charges to get forces, energies and induced charges in a few lines.

<div class="bigidea">A conductor rearranges its charge until the field inside it is zero; whatever field remains outside is fixed completely by the conductor's potential and the charges around it, so any trick that gets the boundary right gets everything right.</div>

## 1. What a conductor does

A conductor is full of charges free to move. Put it in a field and they move until they feel no force. So, in electrostatic equilibrium:

- **inside the metal, `$\vec E = 0$`** (otherwise charges would still be moving);
- the whole conductor is **one equipotential**;
- any net charge sits on the **surface** (Gauss's law with a surface just inside the metal encloses nothing);
- just outside, the field is **perpendicular to the surface** with size `$E = \sigma/\epsilon_0$`.

The last rule comes from a tiny pillbox through the surface: flux leaves only through the outer face, so `$EA = \sigma A/\epsilon_0$`. Compare an isolated sheet of charge, `$\sigma/2\epsilon_0$` on each side: a conductor has no field on its inside, so all the flux goes out on one side and the field is twice as strong.

**Worked example.** Where the surface charge density is `$3.0\ \mu$`C/m², `$E = \dfrac{3.0\times10^{-6}}{8.854\times10^{-12}} = 3.39\times10^5$` V/m just outside.

**Where does the charge go?** On an isolated sphere it spreads evenly. On any other shape it crowds where the surface curves most. Two spheres joined by a wire share one potential `$kQ/R$`, so `$Q\propto R$` and `$\sigma\propto 1/R$`: the small sphere has the denser charge and the stronger field. That is why charge leaks from sharp points (corona discharge) and why high-voltage domes are big and smooth: a sphere of radius `$R$` reaches the breakdown field of air, about `$3\times10^6$` V/m, at `$V = E_{\max}R$`, only 150 kV for a 5 cm ball.

**The push on the surface.** A patch of charge feels the field of all the *other* charges, which is the average of the fields on its two sides, `$\tfrac12(\sigma/\epsilon_0 + 0)$`. So the outward pressure is

```math
P = \frac{\sigma^2}{2\epsilon_0} = \tfrac12\epsilon_0E^2
```

outward whatever the sign of `$\sigma$`. A charged soap bubble swells.

<div class="meaning">

<dl>
<dt>E = 0 inside</dt><dd>the free charges have stopped moving, so nothing pushes them</dd>
<dt>σ</dt><dd>surface charge per square metre; it shows where field lines start or end on the metal</dd>
<dt>E = σ/ε₀ outside</dt><dd>all the flux from the surface charge goes outward, none into the metal</dd>
<dt>σ²/2ε₀</dt><dd>the outward pressure on a charged surface, equal to the field energy per volume just outside</dd>
<dt>Physical meaning</dt><dd>A conductor is a perfect field-cancelling machine. Its charges move to wherever they are needed to make the inside field-free, and the shape of the metal decides where they pile up.</dd>
</dl>

</div>

## 2. Cavities and screening

Hollow out a conductor. Two cases:

- **An empty cavity.** Its boundary is one equipotential and it contains no charge, so (by the uniqueness theorem below) `$V$` is constant inside and `$E = 0$`. Charges outside, however large, cannot reach in. This is the Faraday cage: a car body protects you from lightning, and a metal box shields sensitive electronics.
- **A charge `$q$` inside the cavity.** The cavity wall gets `$-q$`, arranged to cancel `$q$`'s field everywhere in the metal. A neutral conductor then carries `$+q$` on its outer surface, spread exactly as if the inside did not exist (uniformly, for a spherical outer surface). The outside sees the total charge, never where it is. Ground the conductor and the outer `$+q$` flows away: only then is the outside fully screened.

<div class="myth">

**"A neutral metal shell hides a charge placed inside it."** It does not. The inner surface gets `$-q$`, so the outer surface must get `$+q$`, and outside the field is `$kq/r^2$` as if the shell were absent. A shell screens the inside from the outside (an empty cavity is field-free), but it only screens the outside from the inside when it is grounded.

</div>

## 3. Laplace's equation and what it forbids

In any region with no charge, the potential obeys Laplace's equation ([lesson 4.2](/learn/courses/iit-jam-physics/potential-energy/) derived Poisson's equation `$\nabla^2V = -\rho/\epsilon_0$`):

```math
\nabla^2V = \frac{\partial^2V}{\partial x^2} + \frac{\partial^2V}{\partial y^2} + \frac{\partial^2V}{\partial z^2} = 0
```

Its solutions, called harmonic functions, have one beautiful property: **the value at any point is the average over any sphere around it.** Three consequences follow at once:

1. `$V$` has **no maximum or minimum** inside a charge-free region; the extremes are on the boundary.
2. **Earnshaw's theorem:** no arrangement of static charges can hold a test charge in stable equilibrium, because that needs a minimum of `$qV$`.
3. If `$V$` is constant on the boundary, it is that constant everywhere inside (the screened cavity).

**Quick test.** `$x^2 - y^2$`, `$xy$` and `$e^x\cos y$` are harmonic; `$x^2 + y^2$` is not (its Laplacian is 4, which needs charge density `$-4\epsilon_0$`).

Choose an electrode layout and press play. Then click a point to compare its potential with the average of its neighbours.

<figure class="fig" data-fig="@em-laplace-relax"><figcaption>Every free point settles to the average of its neighbours, the defining property of a solution of Laplace's equation; the picture relaxes towards the unique answer.</figcaption></figure>

## 4. The uniqueness theorem

> If `$\rho$` is given inside a region and `$V$` is given on its whole boundary, there is only one solution.

Proof in two lines: if `$V_1$` and `$V_2$` both work, their difference obeys Laplace's equation and is zero on the boundary, so (no maximum or minimum inside) it is zero everywhere. A second version replaces the boundary values by the total charge on each conductor.

This is what makes guessing legal. **Any** potential that satisfies Laplace's equation in the region and matches the boundary is *the* answer, however you found it. The method of images is a way of guessing well.

## 5. The method of images

**A charge above a grounded plane.** A charge `$q$` sits at height `$d$` above an infinite grounded plate. We need `$V = 0$` on the plate and the charge `$q$` above it. Remove the metal and put an image `$-q$` at depth `$d$`: every point of the plane is equidistant from both, so `$V = 0$` there. Above the plane this is the right field, by uniqueness. (Below, the real field is zero: the image is a bookkeeping device, not a real charge.)

<figure class="fig" data-fig="image-charge"><figcaption>Field lines of a charge above a grounded plane all end on the metal, at right angles. Show the image to see them continue to a fictitious −q. The lower panel is the induced charge density; dotted lines mark the circle that holds half of it.</figcaption></figure>

Everything follows from the two-charge picture:

<div class="steps">
<div class="step"><p><b>Force.</b> The charge is pulled towards its image, 2d away: F = kq²/(2d)² = kq²/4d².</p></div>
<div class="step"><p><b>Induced charge density.</b> Just above the plate both charges give a downward field; σ = ε₀E<sub>n</sub> = −qd / 2π(r² + d²)<sup>3/2</sup>, largest (−q/2πd²) right under the charge.</p></div>
<div class="step"><p><b>Total induced charge.</b> Integrating σ over the plane gives exactly −q: every field line from q ends on the plate. Half of it lies within r = √3 d, so it is widely spread.</p></div>
<div class="step"><p><b>Energy.</b> Bringing q in from infinity takes W = −kq²/4d: half of the two-real-charge value −kq²/2d, because only the upper half-space holds field, and the image moves as q moves.</p></div>
</div>

**Worked example.** A 2.0 nC charge 10 cm above a grounded plate: `$F = \dfrac{(8.99\times10^9)(2.0\times10^{-9})^2}{(0.20)^2} = 0.90\ \mu$`N, and the density right below it is `$-\dfrac{2.0\times10^{-9}}{2\pi(0.10)^2} = -32$` nC/m².

<div class="problem" data-problem="image-force"></div>

**Corners.** Two grounded planes at `$90^\circ$`: a charge `$q$` at `$(a, b)$` needs three images, `$-q$` at `$(-a, b)$`, `$-q$` at `$(a, -b)$` and `$+q$` at `$(-a, -b)$`. For a wedge of angle `$\theta$` with `$360^\circ/\theta = n$` an even integer, there are `$n - 1$` images with alternating signs round the circle (5 for `$60^\circ$`, 7 for `$45^\circ$`). For `$q$` at `$(a, a)$` in a right-angled corner, the net pull is `$\dfrac{(2\sqrt2 - 1)kq^2}{8a^2}$` towards the corner: the positive image pushes back a little.

**A grounded sphere.** A charge `$q$` at distance `$d$` from the centre of a grounded sphere of radius `$R$`: the image is

```math
q' = -\frac{qR}{d}, \qquad \text{placed at } b = \frac{R^2}{d} \text{ from the centre}
```

The sphere carries exactly `$q'$`. The force is `$\dfrac{kq^2Rd}{(d^2 - R^2)^2}$`, attractive. If the sphere is **isolated and neutral** instead, add `$+qR/d$` at the centre to bring its total back to zero; the force is still attractive (the negative image is nearer), only weaker. A neutral conductor always attracts a charge. And the potential of that isolated neutral sphere is simply `$kq/d$`: its potential equals the value at its centre, where the induced charges, all at distance `$R$` and summing to zero, contribute nothing.

<div class="myth">

**"The image of a charge in a grounded sphere is −q, like in a plane."** Only for a plane. A sphere of radius `$R$` needs the smaller image `$-qR/d$`, inside the sphere at `$R^2/d$`. As `$R$` and `$d$` grow with `$d - R$` fixed, `$-qR/d \to -q$` and the plane result comes back.

</div>

Step through the method of images, or press the numbers. Change d to see the induced charge and the force change.

<div class="steps" data-fig="@em-image-steps">
<div class="step">A charge above a grounded conducting plane pulls opposite charge up out of the metal.</div>
<div class="step">Replace the metal by an image charge of −q at the same depth below. Above the plane the field does not change.</div>
<div class="step">Every point of the plane is equally far from +q and −q, so V = 0 there and the field meets it at right angles.</div>
<div class="step">The field at the surface gives the induced charge σ = −qd/2π(ρ² + d²)^(3/2); the total is −q. The force is that of the image.</div>
</div>

## 6. A conducting sphere in a uniform field

Put a neutral metal ball of radius `$R$` in a uniform field `$E_0\hat z$`. Separating Laplace's equation in spherical coordinates (solutions `$r^l$` and `$r^{-(l+1)}$` times Legendre polynomials) gives

```math
V = -E_0\left(r - \frac{R^3}{r^2}\right)\cos\theta, \qquad \sigma = 3\epsilon_0E_0\cos\theta
```

The second term is a dipole of moment `$p = 4\pi\epsilon_0R^3E_0$`. The field just outside is `$3E_0$` at the poles and zero at the equator: the ball gathers field lines towards itself. The total induced charge is zero; it only separates.

**Separation of variables in a slot.** Grounded walls at `$y = 0$` and `$y = a$`, the end `$x = 0$` held at `$V_0$`: the solution is `$V = \sum_{n\ \text{odd}}\dfrac{4V_0}{n\pi}e^{-n\pi x/a}\sin\dfrac{n\pi y}{a}$`. Far from the end only `$n = 1$` survives, dying away over a length `$a/\pi$`. One slot width in, only about 5% of `$V_0$` is left. The [2D electrostatics solver](/science/electrostatics-solver/) solves Laplace's equation numerically for any electrodes you draw, and in the [field line plotter](/science/field-line-plotter/) you can place a charge and its image yourself and watch the midplane become an equipotential.

<div class="keypoints">

- In a conductor `$E = 0$`, `$V$` is constant, charge is on the surface, and just outside `$E = \sigma/\epsilon_0$` normal to it. Pressure on the surface `$\sigma^2/2\epsilon_0$`, outward.
- Charge crowds onto sharp points: joined spheres have `$\sigma\propto1/R$`. Sphere at breakdown: `$V = E_{\max}R$`.
- Empty cavity: `$E = 0$`. Charge in a cavity: `$-q$` on the inner wall, `$+q$` on the outer surface (spread as if the inside were absent) unless grounded.
- Harmonic functions: mean value property, no maxima or minima, Earnshaw. Uniqueness: match the boundary and you have *the* solution.
- Plane: image `$-q$` at depth `$d$`; force `$kq^2/4d^2$`; `$\sigma_{\max} = -q/2\pi d^2$`; total `$-q$`; work `$-kq^2/4d$`. Wedge of `$360^\circ/n$`: `$n - 1$` images.
- Grounded sphere: `$q' = -qR/d$` at `$R^2/d$`; isolated neutral: add `$+qR/d$` at the centre. Sphere in `$E_0$`: `$\sigma = 3\epsilon_0E_0\cos\theta$`, `$p = 4\pi\epsilon_0R^3E_0$`.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [conductors and images practice page](/learn/courses/iit-jam-physics/practice/conductors-images/).

<div class="qbank" data-bank="physics" data-topics="conductors-images" data-exam="jam" data-n="10"></div>

**Next:** [dielectrics and capacitors](/learn/courses/iit-jam-physics/dielectrics/) puts insulators between the conductors. Back to the potential and Poisson's equation: [potential and electrostatic energy](/learn/courses/iit-jam-physics/potential-energy/). For [multipole expansions](/learn/courses/gate-physics/multipoles/) and harder [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/) at MSc level, see the GATE Physics course.
