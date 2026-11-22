---
title: 'Electric charges, fields and Gauss''s law'
seoTitle: 'Electric charges and fields: JEE and NEET physics'
summary: 'Charge and its properties, Coulomb''s law with superposition, the electric field and field lines, the electric dipole in and out of a field, electric flux, Gauss''s law and the fields of wires, sheets, shells and spheres, up to rings and small oscillations.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A dipole is placed in a uniform electric field at an angle to it. It feels:'
    choices: ['a net force and a torque', 'a torque but no net force', 'a net force but no torque', 'neither']
    ans: 1
    why: 'The two charges feel equal and opposite forces qE, so the net force is zero. The forces act along different lines, so they make a couple: a torque pE sin θ.'
  - q: 'A point charge q sits at the centre of a cube. The flux through one face is:'
    choices: ['q/ε₀', 'q/(6ε₀)', 'q/(4ε₀)', 'zero']
    ans: 1
    why: 'Gauss''s law gives q/ε₀ through the whole closed cube. By symmetry the six faces share it equally.'
  - q: 'Inside a uniformly charged thin spherical shell, the electric field is:'
    choices: ['kQ/R²', 'kQ/r²', 'zero', 'kQr/R³']
    ans: 2
    why: 'A Gaussian sphere drawn inside the shell encloses no charge, and symmetry makes E the same all over it, so E = 0 everywhere inside.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Electrostatics'
  - 'Elementary charge e = 1.602 176 634 × 10⁻¹⁹ C (exact) and vacuum permittivity, CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to find the force and field of any set of charges, handle a dipole in a field, and use Gauss's law to get the field of wires, sheets and spheres in one line.

<div class="bigidea">Charges change the space around them: that change is the electric field. A charge placed there feels a force qE. Coulomb's law tells you the field of one charge, superposition adds many, and Gauss's law is a shortcut whenever the charge is arranged symmetrically.</div>

## 1. Electric charge

Charge is a property of matter, like mass, but it comes in two kinds, positive and negative. Like charges repel; unlike charges attract.

- **Quantised:** every charge is a whole number of electron charges, `$q = ne$` with e = 1.6 × 10⁻¹⁹ C. You can never have 1.5e on a body.
- **Conserved:** charge is never made or destroyed, only moved. Rubbing a glass rod with silk moves electrons from glass to silk.
- **Additive:** the total charge is the plain sum with signs, +3 µC and −5 µC make −2 µC.
- **Charging by induction:** bring a charged rod near a conductor, earth the far side, remove the earth, then the rod. The conductor keeps a charge **opposite** to the rod's, and the rod loses nothing.

<div class="myth">

**"A body becomes positive by gaining protons."** Protons stay locked in nuclei. A body becomes positive by **losing electrons**, so its mass drops very slightly; a negative body gains a tiny mass.

</div>

## 2. Coulomb's law and superposition

Two point charges at distance r push or pull each other with a force along the line joining them:

```math
F = \frac{1}{4\pi\varepsilon_0}\,\frac{q_1 q_2}{r^2} = k\,\frac{q_1 q_2}{r^2}, \qquad k = 9\times10^{9}\ \text{N m}^2/\text{C}^2
```

In a medium of relative permittivity (dielectric constant) K, the force becomes F/K. Water has K ≈ 80, which is why salt falls apart in water.

**Superposition:** the force on a charge from many others is the **vector sum** of the separate forces, each worked out as if the others were absent. For three charges on a line in equilibrium, the middle one must be of opposite sign, and the forces on each must cancel.

## 3. The electric field and field lines

The field at a point is the force per unit positive test charge, `$\vec E = \vec F/q_0$`, in N/C (same as V/m). For a point charge, `$E = kq/r^2$`, pointing away from a positive charge and towards a negative one. A charge q in a field feels `$\vec F = q\vec E$`: an electron is pushed **against** the field.

Change the two charges below and watch the lines. Look for the null point, where the two fields cancel.

<figure class="fig" data-fig="efield-charges"><figcaption>Field lines of two point charges. Lines start on positive charges and end on negative ones, never cross, and crowd together where the field is strong. The green ring marks the point where the field is zero.</figcaption></figure>

<div class="steps">
<div class="step"><b>Lines never cross.</b> At a crossing the field would point two ways at once.</div>
<div class="step"><b>Number of lines is proportional to charge.</b> A +2 µC charge sends out twice as many lines as +1 µC.</div>
<div class="step"><b>Lines meet a conductor at right angles.</b> Inside a conductor in equilibrium there are no lines at all.</div>
<div class="step"><b>Field lines are not paths.</b> A charge released from rest follows a line only if the line is straight.</div>
<div class="step"><b>Null point.</b> For like charges it lies between them, nearer the smaller one. For unlike charges it lies outside, beyond the smaller one.</div>
</div>

<div class="problem" data-problem="ef-null-point"></div>

A charge q of mass m entering a uniform field between plates moves like a ball thrown sideways: acceleration qE/m across the field, constant speed along it, so its path is a **parabola**.

Drag the charges around, add more with the buttons, and switch field lines, equipotentials and arrows on and off. Move the pointer to read V and E.

<figure class="fig" data-fig="@em-field-lines"><figcaption>Field lines leave positive charges and end on negative ones; equipotentials (coloured rings) cross them at right angles and crowd where the field is strong.</figcaption></figure>

## 4. The electric dipole

Two equal and opposite charges ±q a distance 2a apart form a dipole. Its **dipole moment** is `$p = q\,(2a)$`, a vector pointing from −q to +q.

| Where | Field of a short dipole (r much larger than a) |
|---|---|
| On the axis | `$E = \dfrac{2kp}{r^3}$`, along p |
| On the equatorial line | `$E = \dfrac{kp}{r^3}$`, opposite to p |
| General point at angle θ | `$E = \dfrac{kp}{r^3}\sqrt{1 + 3\cos^2\theta}$` |

A dipole field falls as 1/r³, faster than a single charge's 1/r², because the two charges nearly cancel far away.

**In a uniform field:** net force zero, torque `$\vec\tau = \vec p \times \vec E$` (size pE sin θ), potential energy `$U = -\vec p\cdot\vec E = -pE\cos\theta$`. It is stable when p points along E (θ = 0) and unstable at θ = 180°. Work to turn it from θ₁ to θ₂ is `$pE(\cos\theta_1 - \cos\theta_2)$`. In a **non-uniform** field there is also a net force, pulling the dipole towards the stronger field when it is aligned.

<div class="problem" data-problem="ef-dipole-torque"></div>

## 5. Electric flux and Gauss's law

**Flux** measures how many field lines pass through a surface: `$\Phi = \vec E\cdot\vec A = EA\cos\theta$`, where θ is the angle between E and the outward normal. **Gauss's law** says the total flux out of any closed surface equals the charge inside divided by ε₀:

```math
\oint \vec E\cdot d\vec A = \frac{q_{\text{inside}}}{\varepsilon_0}
```

<div class="meaning">
<dl>
<dt>ε₀</dt><dd>permittivity of free space, 8.85 × 10⁻¹² C²/(N m²); k = 1/(4πε₀)</dd>
<dt>q inside</dt><dd>only the charge enclosed by the surface; charges outside add zero net flux</dd>
<dt>E in the law</dt><dd>the total field, made by all charges, inside and outside</dd>
<dt>Physical meaning</dt><dd>Field lines start and end only on charges, so whatever lines leave a closed bag must have started on a charge inside it.</dd>
</dl>
</div>

<div class="myth">

**"Zero flux through a surface means zero field on it."** No. A charge outside a closed surface sends lines in on one side and out on the other: net flux zero, field not zero. Gauss's law gives E only when symmetry makes E the same size everywhere on the surface.

</div>

Drag the charges in and out of the sphere and change its radius. The flux is added up from the field on the surface, patch by patch, and compared with Q_enclosed/ε₀.

<figure class="fig" data-fig="@em-gauss-surface"><figcaption>Only the charge inside matters: a charge outside sends as many lines in as out. The flux follows Q_enclosed whatever the shape of the charges.</figcaption></figure>

## 6. Fields of charged bodies (the results to know)

| Body | Field |
|---|---|
| Infinite line, charge λ per metre | `$E = \dfrac{\lambda}{2\pi\varepsilon_0 r}$` |
| Infinite thin sheet, σ per m² | `$E = \dfrac{\sigma}{2\varepsilon_0}$`, same at every distance |
| Just outside a conductor | `$E = \dfrac{\sigma}{\varepsilon_0}$`, normal to the surface |
| Two opposite sheets ±σ | σ/ε₀ between, zero outside |
| Thin shell, charge Q | kQ/r² outside, **zero inside** |
| Solid sphere, uniform charge | kQ/r² outside, `$\dfrac{kQr}{R^3}$` inside (rises linearly, maximum at the surface) |

<div class="problem" data-problem="ef-gauss-sphere"></div>

**A cavity** in a uniformly charged solid sphere has a **uniform** field inside it, `$\dfrac{\rho\,\vec d}{3\varepsilon_0}$`, where d joins the two centres. A charge q inside the cavity of a hollow conductor induces −q on the cavity wall and +q on the outer surface, so the outside still feels it. The other way round works: a closed conductor **shields** its cavity from charges outside (electrostatic shielding, the reason a car protects you from lightning).

Pick a ring, rod or disc and change its size. Compare its field on the axis with the point-charge curve and with the infinite line or sheet result.

<figure class="fig" data-fig="@em-charged-bodies"><figcaption>Far away every body looks like a point; close in, the rod follows the infinite line and the disc the infinite sheet. The ring's field is zero at the centre and peaks at a/√2.</figcaption></figure>

## 7. Rings and small oscillations (JEE Advanced)

On the axis of a ring of charge Q and radius R, at distance x from the centre:

```math
E = \frac{kQx}{(R^2 + x^2)^{3/2}}
```

It is zero at the centre, largest at `$x = R/\sqrt2$`, and like a point charge far away. A charge −q of mass m released close to the centre feels a restoring force `$\approx -\dfrac{kQq}{R^3}x$`, so it oscillates in SHM with `$T = 2\pi\sqrt{\dfrac{mR^3}{kQq}}$`.

**Worked example.** Two equal balls of mass m hang from one point on threads of length L and share a charge, settling at angle θ from the vertical. Balance on each: T cos θ = mg, T sin θ = F. So `$F = mg\tan\theta$`. Dip the set-up in a liquid of density ρ and dielectric constant K: if θ does not change, `$K = \dfrac{\rho_{\text{ball}}}{\rho_{\text{ball}} - \rho}$`, since both the force and the effective weight fall by the same factor.

<div class="keypoints">

- Charge is quantised (q = ne), conserved and additive.
- Coulomb: F = kq₁q₂/r², k = 9 × 10⁹; in a medium F/K. Forces add as vectors.
- E = F/q₀; point charge kq/r². Lines start on +, end on −, never cross, meet conductors at 90°.
- Dipole p = q(2a): axis 2kp/r³, equator kp/r³; τ = pE sin θ, U = −pE cos θ, net force zero in a uniform field.
- Gauss: total flux = q_inside/ε₀. Cube with q at centre: q/6ε₀ per face.
- Line λ/(2πε₀r), sheet σ/2ε₀, conductor σ/ε₀, shell zero inside, solid sphere kQr/R³ inside.
- Ring axis: kQx/(R² + x²)^{3/2}, maximum at R/√2.

</div>
