---
title: Electric fields and Gauss's law
seoTitle: Electric fields and Gauss's law for IIT JAM Physics
summary: 'Coulomb fields and superposition, what flux really counts, and how to use Gauss''s law for spheres, cylinders and planes in a few lines, plus the differential form and the traps JAM sets with charges outside the surface.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A closed surface surrounds a +4 nC charge. A −9 nC charge sits just outside it. What is the net flux out of the surface?
    choices: ['+4 nC/ε₀', '−5 nC/ε₀', 'Zero', '−9 nC/ε₀']
    ans: 0
    why: Only the enclosed charge counts. Every field line of the outside charge that enters the surface also leaves it, so it adds nothing to the net flux (though it does change the field on the surface).
  - q: Inside a uniformly charged solid sphere, how does the field grow with distance r from the centre?
    choices: ['In proportion to r', 'As 1/r²', 'It is zero', 'As r²']
    ans: 0
    why: The enclosed charge grows as r³ while the Gaussian area grows as r², so E is proportional to r. It is zero inside a thin charged shell, not a solid sphere.
  - q: "Gauss's law is true for any closed surface. Why can't it give the field of a finite charged rod?"
    choices: ['There is no surface on which the field is constant and fixed in direction', 'The law fails for rods', 'A rod has no enclosed charge', 'The flux of a rod is infinite']
    ans: 0
    why: Gauss's law gives one number, the total flux. It turns into the field only when symmetry lets E come out of the integral, which needs spherical, cylindrical or planar symmetry.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 2: electrostatics'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapters 1 and 2'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapters 29 and 30'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 40 minutes.** By the end you will be able to add up Coulomb fields correctly with components, say exactly what electric flux counts, choose the right Gaussian surface for spheres, cylinders and planes, handle charge densities that vary with radius, and use `$\nabla\cdot\vec E = \rho/\epsilon_0$` to go from a field to its charges.

<div class="bigidea">Field lines start on positive charge and end on negative charge, so the net number leaving any closed surface counts the charge inside it, and nothing else.</div>

## 1. Coulomb's law and superposition

A point charge `$q$` makes a field that points straight away from it (towards it if `$q < 0$`) and weakens with the square of distance:

```math
\vec E = \frac{1}{4\pi\epsilon_0}\frac{q}{r^2}\,\hat r, \qquad \frac{1}{4\pi\epsilon_0} = k \approx 8.99\times10^9\ \text{N m}^2\,\text{C}^{-2}
```

A test charge `$q_0$` placed there feels `$\vec F = q_0\vec E$`. With several charges, the fields simply **add as vectors** (superposition). That one word, *vectors*, is where most marks are lost: resolve each field into components, add the components, and only then find the size.

**Worked example.** Charges of `$+1$` nC sit at `$(-1, 0)$` and `$(+1, 0)$` m. Find the field at `$(0, 1)$` m.

1. Each charge is `$\sqrt2$` m away, so each gives `$kq/2 = 4.49$` N/C.
2. Each field points along the line from its charge, at `$45^\circ$` to the `$y$`-axis. The `$x$`-parts cancel by symmetry.
3. The `$y$`-parts add: `$E = 2\times4.49\times\cos45^\circ \approx 6.36$` N/C, along `$+y$`.

Adding the sizes (8.99 N/C) would be the classic wrong answer. A quick symmetry look before any algebra tells you which components cancel.

A **dipole** (charges `$\pm q$` a small distance `$d$` apart, moment `$p = qd$` from `$-$` to `$+$`) has a field that falls as `$1/r^3$`: `$2kp/r^3$` along `$\vec p$` on its axis, and `$kp/r^3$` *opposite* to `$\vec p$` on its perpendicular bisector.

## 2. Flux: counting field lines through a surface

Imagine field lines drawn so that their density shows the field's strength. The **flux** through a surface counts how many cross it, with a sign:

```math
\Phi_E = \int_S \vec E\cdot d\vec a
```

`$d\vec a$` is a tiny piece of area with its direction along the surface's normal. For a closed surface the normal points **outward**, so lines going out count `$+$` and lines coming in count `$-$`. In a uniform field the flux through a flat area `$A$` at angle `$\theta$` to the field direction is just `$EA\cos\theta$`.

Use the figure to see the main idea. The dashed circle is a slice through a Gaussian sphere. Move it, resize it, include a charge or leave it out, and watch the flux.

<figure class="fig" data-fig="gauss-charges"><figcaption>Field lines from point charges, with a movable Gaussian surface. The flux depends only on the charge inside: lines from charges outside enter and leave again.</figcaption></figure>

## 3. Gauss's law

```math
\oint_S \vec E\cdot d\vec a = \frac{Q_{\text{enc}}}{\epsilon_0}
```

Why is it true? Step through it:

<div class="steps">
<div class="step"><p><b>One point charge, one sphere.</b> On a sphere of radius r around q, E = kq/r² everywhere and points straight out. Flux = E × 4πr² = q/ε₀. The r² of the area cancels the 1/r² of the field.</p></div>
<div class="step"><p><b>Any shape around the charge.</b> Each small patch of a lumpy surface sees the charge under some solid angle. Flux through it = (q/4πε₀) × solid angle. Solid angles round a closed surface add to 4π, so the total is still q/ε₀.</p></div>
<div class="step"><p><b>A charge outside.</b> Its lines that enter the surface must leave it again. Every entry (−) is matched by an exit (+): net flux 0.</p></div>
<div class="step"><p><b>Many charges.</b> Fields add, so fluxes add. Only the charges inside contribute: total flux = Q<sub>enc</sub>/ε₀.</p></div>
</div>

<div class="meaning">

<dl>
<dt>∮ E · da</dt><dd>net number of field lines leaving the closed surface (out minus in)</dd>
<dt>E</dt><dd>the total field from every charge, inside and outside</dd>
<dt>Q<sub>enc</sub></dt><dd>only the charge inside the surface</dd>
<dt>ε₀</dt><dd>8.854 × 10⁻¹² C² N⁻¹ m⁻²: converts charge to flux</dd>
<dt>Physical meaning</dt><dd>Charge is the source of electric field lines. Count the lines that escape and you have weighed the charge inside, without knowing where it sits.</dd>
</dl>

</div>

<div class="myth">

**"The E in Gauss's law is the field of the enclosed charges only."** Wrong. It is the total field, and charges outside do change it at every point of the surface. They just contribute zero to the *net* flux. This is why Gauss's law alone cannot give you the field unless symmetry helps.

</div>

**The cube tricks.** A charge `$q$` at the centre of a cube sends `$q/(6\epsilon_0)$` through each face. A charge at a corner is shared by 8 cubes, so one cube gets `$q/(8\epsilon_0)$`; the three faces touching the corner get nothing (the field lies along them), and the three far faces get `$q/(24\epsilon_0)$` each. JAM loves these: no integral, only symmetry.

## 4. Using Gauss's law: three symmetries

Gauss's law gives the field when you can pick a surface on which `$E$` is constant and perpendicular (or parallel) to it. There are only three such shapes.

| Charge | Gaussian surface | Field |
|---|---|---|
| Point, shell, any `$\rho(r)$` | concentric sphere | `$E = \dfrac{Q_{\text{enc}}(r)}{4\pi\epsilon_0r^2}$` |
| Infinite line `$\lambda$`, cylinder | coaxial cylinder | `$E = \dfrac{\lambda_{\text{enc}}}{2\pi\epsilon_0s}$` |
| Infinite sheet `$\sigma$` | pillbox through it | `$E = \dfrac{\sigma}{2\epsilon_0}$`, any distance |

The recipe is always the same: (1) use symmetry to say which way `$\vec E$` points and what it depends on; (2) choose the surface; (3) work out the flux (`$E\times$` area); (4) work out `$Q_{\text{enc}}$`; (5) solve for `$E$`.

**Worked example: a uniform solid sphere** (charge `$Q$`, radius `$R$`).

1. Outside (`$r > R$`): `$E\,4\pi r^2 = Q/\epsilon_0$`, so `$E = kQ/r^2$`, as if all the charge were at the centre.
2. Inside: the enclosed charge is `$Q(r/R)^3$`. So `$E\,4\pi r^2 = Qr^3/(\epsilon_0R^3)$` and `$E = kQr/R^3$`, growing linearly from zero.
3. The two agree at `$r = R$`. For a thin **shell** instead, `$Q_{\text{enc}} = 0$` inside, so `$E = 0$` there, with a jump of `$\sigma/\epsilon_0$` at the surface.

<div class="problem" data-problem="gauss-sphere-field"></div>

**Worked example: two sheets.** Sheets of `$+3$` and `$-1\ \mu$`C/m² face each other. Each gives `$\sigma/(2\epsilon_0)$`, away from a positive sheet and towards a negative one. Between them both fields point the same way: `$(3 + 1)\times10^{-6}/(2\epsilon_0) = 2.26\times10^5$` N/C. Outside, they point opposite ways: `$(3 - 1)\times10^{-6}/(2\epsilon_0) = 1.13\times10^5$` N/C. The famous "zero outside a capacitor" is only for equal and opposite charges.

**Cylinders give 2, spheres give 3.** For a uniformly charged solid cylinder (density `$\rho$`), `$E = \rho s/(2\epsilon_0)$` inside; for a uniform sphere, `$E = \rho r/(3\epsilon_0)$`. A wrong option in many papers swaps them.

## 5. Densities that change with radius

When `$\rho$` depends on `$r$`, you cannot multiply by the volume: add up thin shells instead.

```math
Q_{\text{enc}}(r) = \int_0^r \rho(r')\,4\pi r'^2\,dr'
```

**Worked example.** `$\rho = \rho_0(1 - r/R)$` inside radius `$R$`. Then `$Q(r) = 4\pi\rho_0\left(\dfrac{r^3}{3} - \dfrac{r^4}{4R}\right)$` and `$E = \dfrac{\rho_0}{\epsilon_0}\left(\dfrac r3 - \dfrac{r^2}{4R}\right)$`. Setting `$dE/dr = 0$` gives the strongest field at `$r = 2R/3$`, inside the sphere: a favourite top-rank question, because students assume the maximum is at the surface.

## 6. The differential form

Apply the divergence theorem ([lesson 1.6](/learn/courses/iit-jam-physics/integral-theorems/)) to a tiny volume and Gauss's law becomes a statement at each point:

```math
\nabla\cdot\vec E = \frac{\rho}{\epsilon_0}, \qquad \nabla\times\vec E = 0 \ \ (\text{electrostatics})
```

Use it both ways. Given `$\vec E$`, the charge density is `$\epsilon_0\nabla\cdot\vec E$` (in spherical coordinates, `$\dfrac{\epsilon_0}{r^2}\dfrac{d}{dr}(r^2E_r)$`; see [gradient, divergence and curl](/learn/courses/iit-jam-physics/vector-calculus/)). And a proposed field with non-zero curl can never be electrostatic, whatever its divergence: check the curl first when a question asks "which of these could be an electrostatic field?".

**Worked example.** `$\vec E = cr^3\,\hat r$` gives `$\rho = \dfrac{\epsilon_0}{r^2}\dfrac{d}{dr}(cr^5) = 5\epsilon_0cr^2$`. The naive `$\epsilon_0\,dE_r/dr = 3\epsilon_0cr^2$` is a planted wrong option.

**A superposition trick.** A uniformly charged sphere with an off-centre spherical cavity: treat it as a full sphere (`$+\rho$`) plus a small sphere (`$-\rho$`). Inside the cavity the field is `$\rho\vec d/(3\epsilon_0)$`, uniform, where `$\vec d$` joins the two centres.

Want to experiment further? The [field lines tool](/science/field-line-plotter/) lets you place and drag any set of charges, and the [2D electrostatics solver](/science/electrostatics-solver/) handles electrodes at fixed voltages.

<div class="keypoints">

- Fields add as vectors: resolve, add components, then take the size. Look for symmetry first.
- Flux counts net field lines out of a surface; outward normals on closed surfaces.
- Gauss: `$\oint\vec E\cdot d\vec a = Q_{\text{enc}}/\epsilon_0$`. Outside charges change `$\vec E$` but not the net flux.
- Only spherical, cylindrical and planar symmetry let Gauss's law give `$E$`. Sphere: `$\rho r/3\epsilon_0$` inside; cylinder: `$\rho s/2\epsilon_0$`; sheet: `$\sigma/2\epsilon_0$`.
- Shell: zero field inside. Solid sphere: field grows as `$r$` inside. For `$\rho(r)$`, integrate shell by shell.
- `$\nabla\cdot\vec E = \rho/\epsilon_0$` and `$\nabla\times\vec E = 0$`: divergence gives charge, curl tests whether a field can be electrostatic.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [electric fields and Gauss's law practice page](/learn/courses/iit-jam-physics/practice/electrostatics-gauss/).

<div class="qbank" data-bank="physics" data-topics="electrostatics-gauss" data-exam="jam" data-n="10"></div>

**Next:** lesson 4.2 turns the field into a potential, a single number at each point that is far easier to add up, and works out the energy stored in charge arrangements: [potential and electrostatic energy](/learn/courses/iit-jam-physics/potential-energy/). Going on to GATE? The GATE Physics course takes this into [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/), [images](/learn/courses/gate-physics/method-of-images/) and [multipoles](/learn/courses/gate-physics/multipoles/).
