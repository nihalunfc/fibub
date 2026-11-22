---
title: 'Fields in matter: polarisation and magnetisation'
seoTitle: Polarisation, magnetisation and bound charge | GATE Physics
summary: 'Bound charge and bound current from P and M, the fields D and H and what they do and do not depend on, boundary conditions with free surface charge and current, depolarising factors, dielectric and magnetic spheres, cylinders and cavities, the Lorentz local field and Clausius-Mossotti, polar molecules, images in dielectrics, shielding and energy.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: A long dielectric cylinder (εr = 3) lies across a uniform field of 600 V/m. What is the field inside?
    choices: ['300 V/m', '360 V/m', '200 V/m', '600 V/m']
    ans: 0
    why: "For a cylinder across the field, E_in = 2E0/(εr + 1) = 1200/4 = 300 V/m (depolarising factor 1/2). The sphere formula 3E0/(εr + 2) would give 360 V/m."
  - q: A sphere is uniformly polarised with P and there is no free charge anywhere. What is D inside it?
    choices: ['2P/3', 'Zero', 'P', '−P/3']
    ans: 0
    why: "Inside, E = −P/3ε0, so D = ε0E + P = 2P/3. No free charge means ∇·D = 0, not D = 0: D also has a curl at the surface."
  - q: A point charge sits inside a block of glass near its flat surface with air. Is it attracted to the surface?
    choices: ['No, it is repelled from it', 'Yes, like a charge near a metal', 'There is no force in a uniform medium', 'Only if the charge is negative']
    ans: 0
    why: "Its image in the less polarisable air has the same sign, q(εr − 1)/(εr + 1), so the charge is pushed away from the surface whatever its sign."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapters 4 and 6'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), sections 4.3 to 4.7 and 5.8 to 5.12'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapters 10 and 11'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 16 (local field, Clausius-Mossotti)'
  - 'GATE Physics (PH) syllabus, Electromagnetic theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** Matter responds to fields by lining up tiny dipoles, electric or magnetic. On average those dipoles act exactly like extra charges and currents bound into the material. This lesson turns that idea into tools: bound sources, the auxiliary fields `$\vec D$` and `$\vec H$`, boundary conditions, and solved boundary value problems for spheres, cylinders and cavities. The BSc picture of dielectrics in capacitors and of B, H and M is in the IIT JAM lessons on [dielectrics](/learn/courses/iit-jam-physics/dielectrics/) and [magnetic materials](/learn/courses/iit-jam-physics/magnetic-materials/).

<div class="bigidea">A polarised or magnetised body makes exactly the field of its bound charges (−∇·P inside, P·n on the surface) or bound currents (∇×M inside, M×n on the surface). Once you have those, everything is ordinary electrostatics or magnetostatics in vacuum.</div>

## 1. Bound charge and bound current

The potential of a polarised body is the sum of its dipoles' potentials, `$\dfrac{1}{4\pi\epsilon_0}\displaystyle\int\dfrac{\vec P\cdot\hat{\mathscr r}}{\mathscr r^2}d\tau'$`. Writing `$\hat{\mathscr r}/\mathscr r^2$` as a gradient and integrating by parts splits it into a volume and a surface charge:

```math
\rho_b = -\nabla\cdot\vec P, \qquad \sigma_b = \vec P\cdot\hat n
```

The magnetic version, from `$\vec A = \dfrac{\mu_0}{4\pi}\displaystyle\int\dfrac{\vec M\times\hat{\mathscr r}}{\mathscr r^2}d\tau'$`, gives

```math
\vec J_b = \nabla\times\vec M, \qquad \vec K_b = \vec M\times\hat n
```

Bound charge always totals zero for a neutral body, and bound current never carries net current through a cross-section; the volume and surface parts cancel.

**Worked example.** A sphere with `$\vec P = kr^2\hat r$`: `$\rho_b = -\dfrac{1}{r^2}\dfrac{d}{dr}(kr^4) = -4kr$` and `$\sigma_b = kR^2$`. The volume total `$-4\pi kR^4$` cancels the surface total. A cylinder with `$\vec M = ks^2\hat\phi$`: `$\vec J_b = \dfrac1s\dfrac{d}{ds}(ks^3)\hat z = 3ks\,\hat z$` and `$\vec K_b = -kR^2\hat z$`; the volume current `$2\pi kR^3$` returns along the surface.

**A spinning shell is a magnet.** A shell with surface charge `$\sigma$` spinning at `$\omega$` carries `$\vec K = \sigma\omega R\sin\theta\,\hat\phi$`, exactly the bound current of a sphere with uniform `$M = \sigma\omega R$`. So its interior field is `$\tfrac23\mu_0\sigma\omega R$`, uniform.

## 2. D and H: what they are for

Splitting charge into free and bound, Gauss's law becomes `$\nabla\cdot\vec D = \rho_f$` with `$\vec D = \epsilon_0\vec E + \vec P$`; splitting current, Ampère-Maxwell becomes `$\nabla\times\vec H = \vec J_f + \partial\vec D/\partial t$` with `$\vec H = \vec B/\mu_0 - \vec M$`. In linear media `$\vec D = \epsilon\vec E$` and `$\vec B = \mu\vec H$`.

The trap is to think `$\vec D$` is fixed by free charge (or `$\vec H$` by free current) alone. A vector field needs both its divergence and its curl:

```math
\nabla\cdot\vec D = \rho_f,\quad \nabla\times\vec D = \nabla\times\vec P; \qquad \nabla\times\vec H = \vec J_f,\quad \nabla\cdot\vec H = -\nabla\cdot\vec M
```

So a bar magnet has an `$\vec H$` field with no free current anywhere, and an electret has a `$\vec D$` field with no free charge. Only when the symmetry kills the curl (a slab, a sphere with radial `$\vec P$`) do the free sources alone fix `$\vec D$`.

**Boundary conditions** (pillboxes and thin loops across the surface, `$\hat n$` from 1 to 2):

```math
D_{2\perp} - D_{1\perp} = \sigma_f, \quad \vec E_{2\parallel} = \vec E_{1\parallel}, \quad B_{2\perp} = B_{1\perp}, \quad \hat n\times(\vec H_2 - \vec H_1) = \vec K_f
```

In linear media without free surface sources, field lines refract with `$\tan\theta_1/\tan\theta_2 = \epsilon_1/\epsilon_2$` (or `$\mu_1/\mu_2$`).

<div class="meaning">

<dl>
<dt>P, M</dt><dd>dipole moment per unit volume (electric, magnetic)</dd>
<dt>Bound charge, bound current</dt><dd>the average charge and current of the lined-up dipoles: −∇·P and P·n; ∇×M and M×n</dd>
<dt>D, H</dt><dd>bookkeeping fields whose divergence (D) or curl (H) involves free sources only</dd>
<dt>Depolarising factor N</dt><dd>for a uniformly polarised body of simple shape, the field inside is −NP/ε₀ (or H = −NM): sphere 1/3, transverse cylinder 1/2, slab across 1, needle along 0</dd>
<dt>Physical meaning</dt><dd>Lined-up dipoles cancel each other in the bulk and leave a layer of uncancelled charge (or current) wherever the alignment changes or stops. That layer is what makes the field.</dd>
</dl>

</div>

## 3. Shape matters: depolarisation

A uniformly polarised body with no free charge has a uniform field inside when its shape is an ellipsoid. For the shapes GATE uses:

| Shape | `$\vec E$` inside (from `$\vec P$`) | `$\vec B$` inside (from `$\vec M$`) |
|---|---|---|
| sphere | `$-\vec P/3\epsilon_0$` | `$\tfrac23\mu_0\vec M$` |
| long cylinder, across its axis | `$-\vec P/2\epsilon_0$` | `$\tfrac12\mu_0\vec M$` |
| slab, normal to its faces | `$-\vec P/\epsilon_0$` | `$0$` |
| needle, along its axis | `$0$` | `$\mu_0\vec M$` |

Inside a uniformly polarised sphere `$\vec D = \epsilon_0\vec E + \vec P = \tfrac23\vec P$`, not zero. Outside it is a perfect dipole of moment `$\tfrac43\pi R^3\vec P$`.

**Cavities** are the same story in reverse: cutting a hole removes the field of the removed piece, `$-N\vec P/\epsilon_0$`. In a needle along the field the cavity field is `$\vec E$`; in a thin disc across it, `$\vec E + \vec P/\epsilon_0 = \vec D/\epsilon_0$`; in a sphere, `$\vec E + \vec P/3\epsilon_0$`. The magnetic versions (`$\mu_0\vec H$` in the needle, `$\vec B$` in the disc) are how `$\vec H$` and `$\vec B$` were first given operational meaning.

## 4. Linear bodies in uniform fields

Separation of variables with `$V$` and `$\epsilon\,\partial V/\partial n$` continuous (the method of [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/)) gives uniform interior fields:

```math
\text{sphere: } E_{\rm in} = \frac{3E_0}{\epsilon_r + 2}, \qquad \text{cylinder across: } E_{\rm in} = \frac{2E_0}{\epsilon_r + 1}, \qquad \text{spherical cavity: } E_{\rm in} = \frac{3\epsilon_rE_0}{2\epsilon_r + 1}
```

The sphere's polarisation is `$\vec P = 3\epsilon_0\dfrac{\epsilon_r - 1}{\epsilon_r + 2}\vec E_0$`, its dipole moment `$4\pi\epsilon_0R^3\dfrac{\epsilon_r - 1}{\epsilon_r + 2}\vec E_0$`, and the field just outside a pole is `$\dfrac{3\epsilon_r}{\epsilon_r + 2}E_0$` (twice `$E_0$` for `$\epsilon_r = 4$`, tending to the conductor's `$3E_0$`). A void in insulation sees an *enhanced* field, up to `$1.5E_0$`, which is why breakdown starts in bubbles.

Magnetic bodies follow with `$\Phi_M$` in place of `$V$`: `$B_{\rm in} = \dfrac{3\mu_r}{\mu_r + 2}B_0$` for a sphere and `$\dfrac{2\mu_r}{\mu_r + 1}B_0$` for a transverse cylinder. A superconductor (`$\mu_r = 0$`) expels the field, which then grazes its equator at `$\tfrac32B_0$`.

<figure class="fig" data-fig="sphere-in-field"><figcaption>A sphere of dielectric constant ε in a uniform field: as ε grows, the field inside weakens, the bound charge (± marks) grows and the lines outside bend in; a metal is the limit. "Dipole part" shows the induced r⁻² term on its own.</figcaption></figure>

<div class="problem" data-problem="dielectric-body-field"></div>

**Worked example: a magnetic shield.** A long iron tube (`$\mu_r = 1000$`, inner radius `$a$`, outer `$b = a/0.9$`) across a field `$B_0$`: matching `$\Phi_M = (A s + B/s)\cos\phi$` in three regions gives `$B_{\rm in}/B_0 = 4\mu_r/[(\mu_r + 1)^2 - (\mu_r - 1)^2(a/b)^2] = 1/48$`. High permeability does not block field lines; it offers them an easier path round the hole.

## 5. From molecules to permittivity

A molecule feels not the macroscopic `$\vec E$` but the **local field**. In a cubic arrangement the near neighbours cancel and

```math
\vec E_{\rm loc} = \vec E + \frac{\vec P}{3\epsilon_0}, \qquad \frac{\epsilon_r - 1}{\epsilon_r + 2} = \frac{N\alpha}{3\epsilon_0} \quad\text{(Clausius-Mossotti)}
```

As `$N\alpha/3\epsilon_0 \to 1$`, `$\epsilon_r = (1 + 2x)/(1 - x)$` diverges: the polarisation can sustain itself, the "polarisation catastrophe" behind ferroelectricity. The polarisability of a conducting sphere is `$4\pi\epsilon_0R^3$`, so `$\alpha/4\pi\epsilon_0$` (a few Å³ for atoms) measures an atom's size.

**Polar molecules** also turn to line up against thermal agitation. For weak fields the Langevin average gives

```math
\chi_e = \frac{N}{\epsilon_0}\left(\alpha + \frac{p^2}{3k_BT}\right)
```

so a plot of `$\chi_e$` against `$1/T$` gives `$\alpha$` from the intercept and `$p$` from the slope. For water at 300 K the orientational term is about 19 times the induced one.

## 6. Charges near dielectric boundaries

For a charge `$q$` in medium 1 at distance `$d$` from a flat boundary with medium 2:

- in medium 1, the field is that of `$q$` and an image `$q' = -q\dfrac{\epsilon_2 - \epsilon_1}{\epsilon_2 + \epsilon_1}$` at the mirror point, both in a medium `$\epsilon_1$`;
- in medium 2, it is that of a charge `$q'' = \dfrac{2\epsilon_2}{\epsilon_1 + \epsilon_2}q$` at the real position, in a medium `$\epsilon_2$`.

If the far side is *more* polarisable the charge is attracted (a metal is the limit `$\epsilon_2 \to \infty$`, `$q' = -q$`); if it is *less* polarisable, as for an ion in water near air, it is repelled. In the dielectric the potential is `$\dfrac{2}{1 + \epsilon_r}$` times the vacuum Coulomb value, not `$1/\epsilon_r$` times it.

**Worked example.** 1.0 nC inside glass of `$\epsilon_r = 4$`, 1.0 cm from its surface with air: `$q' = +0.6q$`, and `$F = \dfrac{0.6q^2}{4\pi(4\epsilon_0)(0.02)^2} = 3.4\ \mu$`N, pushing it into the glass.

<div class="problem" data-problem="dielectric-image"></div>

**Energy.** A linear object brought into a field (at fixed sources) changes the energy by `$W = -\tfrac12\int\vec P\cdot\vec E_0\,d\tau$`, half the permanent-dipole value because the moment is induced. It is lower where the field is stronger, so dielectrics are pulled into strong fields: liquid rises between capacitor plates, and optical tweezers hold beads at the focus of a laser.

<div class="myth">

**"No free charge, so `$\vec D = 0$`."** Zero free charge only makes `$\nabla\cdot\vec D = 0$`. Inside a uniformly polarised sphere `$\vec D = \tfrac23\vec P$`, and outside a bar electret `$\vec D$` is a full dipole field. `$\vec D$` vanishes only when symmetry also kills its curl: a wide slab, or a sphere with purely radial polarisation, where indeed `$\vec E = -\vec P/\epsilon_0$` inside and nothing outside.

</div>

<div class="keypoints">

- `$\rho_b = -\nabla\cdot\vec P$`, `$\sigma_b = \vec P\cdot\hat n$`; `$\vec J_b = \nabla\times\vec M$`, `$\vec K_b = \vec M\times\hat n$`. Totals cancel.
- `$\nabla\cdot\vec D = \rho_f$` but `$\nabla\times\vec D = \nabla\times\vec P$`; `$\nabla\times\vec H = \vec J_f$` but `$\nabla\cdot\vec H = -\nabla\cdot\vec M$`.
- Boundaries: `$D_\perp$` jumps by `$\sigma_f$`, `$E_\parallel$` continuous, `$B_\perp$` continuous, `$H_\parallel$` jumps by `$K_f$`.
- Depolarising factors: sphere 1/3, transverse cylinder 1/2, slab 1, needle 0. Uniform sphere: `$\vec E = -\vec P/3\epsilon_0$`, `$\vec D = \tfrac23\vec P$`, `$\vec B = \tfrac23\mu_0\vec M$`.
- In `$E_0$`: sphere `$3E_0/(\epsilon_r + 2)$`, cylinder `$2E_0/(\epsilon_r + 1)$`, cavity `$3\epsilon_rE_0/(2\epsilon_r + 1)$`; magnetic sphere `$3\mu_rB_0/(\mu_r + 2)$`.
- Local field `$\vec E + \vec P/3\epsilon_0$`; Clausius-Mossotti `$(\epsilon_r - 1)/(\epsilon_r + 2) = N\alpha/3\epsilon_0$`; Langevin-Debye `$\chi_e = N(\alpha + p^2/3k_BT)/\epsilon_0$`.
- Dielectric image `$q' = -q(\epsilon_2 - \epsilon_1)/(\epsilon_2 + \epsilon_1)$`; transmitted `$q'' = 2\epsilon_2q/(\epsilon_1 + \epsilon_2)$`. Induced energy `$-\tfrac12\int\vec P\cdot\vec E_0$`.

</div>

## Practise: exam questions on this lesson

Warm-up to top-rank, with full solutions. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="fields-in-matter" data-exam="gate" data-n="10"></div>

**Next:** [potentials and gauges](/learn/courses/gate-physics/potentials-gauges/) lets the fields change in time. For the multipole picture of a single polarised molecule, see [multipole expansion](/learn/courses/gate-physics/multipoles/); to play with magnetic materials, try the [magnetic materials](/learn/magnetic-materials/) explorer and the [magnetic circuit](/science/magnetic-circuit/) tool.
