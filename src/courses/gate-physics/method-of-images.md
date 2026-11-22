---
title: The method of images
seoTitle: Method of images for spheres and cylinders | GATE Physics
summary: 'Why images work, the sphere image derived from circles of Apollonius, cavities, spheres at fixed potential or carrying charge, line charges and cylinders with exact capacitances, dipoles near planes, wedges, the hemispherical boss, and infinite image series for parallel plates and a sphere near a plane.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: A charge q sits 5 cm from the centre of a grounded spherical cavity of radius 10 cm. Where is its image?
    choices: ['20 cm from the centre, with charge −2q', '15 cm from the centre, with charge −q', '2.5 cm from the centre, with charge −q/2', '20 cm from the centre, with charge −q/2']
    ans: 0
    why: "The image of a charge at d in a sphere of radius R is −qR/d at R²/d, whether the charge is inside or outside. Here R/d = 2 and R²/d = 20 cm: outside the cavity, in the metal, and larger than q."
  - q: A line charge λ runs parallel to a long conducting cylinder that carries −λ per length. What is its image?
    choices: ['−λ at R²/d from the axis', '−λR/d at R²/d from the axis', '−λ on the axis', '−λR/d on the axis']
    ans: 0
    why: "Two opposite line charges have circles of Apollonius as equipotentials, so an equal and opposite image at the inverse point R²/d makes the cylinder an equipotential. Copying the sphere's −qR/d is the classic mistake."
  - q: An isolated neutral metal sphere is far from a point charge, at distance d. How does the force on the charge fall off?
    choices: ['As 1/d⁵', 'As 1/d²', 'As 1/d³', 'As 1/d⁴']
    ans: 0
    why: "The two images (−qR/d at R²/d and +qR/d at the centre) form an induced dipole qR³/d², and the force of a dipole on a charge goes as p/d³, so 1/d⁵ overall. A grounded sphere keeps a net image charge and falls off as 1/d³."
sources:
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapter 2'
  - 'W. R. Smythe, Static and Dynamic Electricity, 3rd ed. (1968), chapter 5 (image series, spheres and cylinders)'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), section 3.2'
  - 'L. D. Landau and E. M. Lifshitz, Electrodynamics of Continuous Media, 2nd ed. (1984), section 3'
  - 'GATE Physics (PH) syllabus, Electromagnetic theory section, published by the organising institute each year'
---

**Module 3 · about 55 minutes.** The image method replaces a conductor by a few fictitious charges placed where the conductor is. You met it for a grounded plane, a corner and a simple sphere in the IIT JAM lesson on [conductors and images](/learn/courses/iit-jam-physics/conductors-images/). Here we go further: where the sphere image comes from, cavities, spheres held at a potential or carrying charge, cylinders and two-wire lines with exact capacitances, dipoles, and the infinite image series that GATE likes to hide inside innocent-looking problems.

<div class="bigidea">A conductor is just a boundary condition. Find a set of charges, all outside the region you care about, whose combined potential satisfies that boundary condition, and the uniqueness theorem guarantees their field is the real field inside the region.</div>

## 1. The rules of the game

The method rests on the uniqueness theorem from [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/):

1. **Images must sit outside the physical region** (inside the metal, or beyond the boundary), so Poisson's equation in the region is untouched.
2. **The boundary condition must hold**: the right potential on grounded or fixed-potential conductors, or the right total charge on isolated ones.
3. **The answer is valid only in the physical region.** Inside the metal the real field is zero, and the image charge is not the induced charge (for a sphere they are not even equal in size).

Forces, energies and induced charge densities then follow from the image picture, with one caution: the energy is **half** the naive `$q\,V_{\rm image}$`, because the image moves and grows as the real charge is brought in.

Step through the method of images, or press the numbers. Change d to see the induced charge and the force change.

<div class="steps" data-fig="@em-image-steps">
<div class="step">A charge above a grounded conducting plane pulls opposite charge up out of the metal.</div>
<div class="step">Replace the metal by an image charge of −q at the same depth below. Above the plane the field does not change.</div>
<div class="step">Every point of the plane is equally far from +q and −q, so V = 0 there and the field meets it at right angles.</div>
<div class="step">The field at the surface gives the induced charge σ = −qd/2π(ρ² + d²)^(3/2); the total is −q. The force is that of the image.</div>
</div>

## 2. Spheres

**Where the sphere image comes from.** Take a charge `$q$` at distance `$d$` from the centre and a trial image `$q'$` at distance `$b$` on the same ray. A point on the sphere sees them at distances `$r_1$` and `$r_2$`; the sphere is at zero potential if `$q/r_1 + q'/r_2 = 0$`, i.e. if `$r_2/r_1$` is the same for every point of the sphere. The locus of points with a fixed distance ratio from two points is a sphere (Apollonius), and it is our sphere of radius `$R$` exactly when `$b = R^2/d$` (the two points are *inverse* in the sphere) and the ratio is `$R/d$`. So

```math
q' = -\frac{qR}{d}, \qquad b = \frac{R^2}{d}
```

The same formula works with the charge **inside** a grounded cavity (`$d < R$`): then `$b > R$`, the image lies in the metal and is *larger* than `$q$`. The wall still carries exactly `$-q$` (every field line ends on it), and the charge is pulled towards the nearest wall with `$F = kq^2Rd/(R^2 - d^2)^2$`: the centre is an unstable equilibrium.

<figure class="fig" data-fig="image-sphere"><figcaption>A charge near a conducting sphere. Field lines end on the sphere at right angles; show the images to see them continue (dashed) to the fictitious charges. Switch between a grounded and an isolated neutral sphere and slide the distance.</figcaption></figure>

**What follows from the image.**

- **Force (grounded):** `$F = \dfrac{kq^2Rd}{(d^2 - R^2)^2}$`, attractive. Close to the surface, with `$h = d - R \ll R$`, it becomes `$kq^2/4h^2$`: the plane result.
- **Induced density:** `$\sigma(\theta) = -\dfrac{q(d^2 - R^2)}{4\pi R(R^2 + d^2 - 2Rd\cos\theta)^{3/2}}$`, largest at the near point, `$-q(d + R)/4\pi R(d - R)^2$`. It integrates to `$-qR/d$`; for `$d = 2R$` over 80% of it is on the near hemisphere.
- **Energy:** bringing `$q$` in from infinity takes `$W = -\dfrac{kq^2R}{2(d^2 - R^2)}$`.

**Changing the sphere's condition** only adds a charge at the centre, because a central charge changes the sphere's potential uniformly without disturbing the zero already built:

- held at potential `$V_0$`: add `$4\pi\epsilon_0RV_0$`;
- isolated and neutral: add `$+qR/d$` (total zero), giving an induced dipole `$qR^3/d^2$` and a far force `$\approx 2kq^2R^3/d^5$`;
- isolated with charge `$Q$`: add `$Q + qR/d$`.

**Worked example: a like-charged sphere can attract.** With charge `$Q$` on the sphere, the force on `$q$` (repulsion positive) is

```math
F = kq\left[\frac{Q + qR/d}{d^2} - \frac{qRd}{(d^2 - R^2)^2}\right]
```

The second term blows up as `$d \to R$`, so any like charge that comes close enough is attracted. For `$Q = q$` the force vanishes where `$(u + 1)^3(u - 1)^2 = u^4$` with `$u = d/R$`, whose root is the golden ratio `$u = 1.618$`. This is the same physics that holds electrons inside a metal (the image force behind the work function).

**Worked example: a sphere in a uniform field, by images.** Model the field by `$+Q$` at `$z = -D$` and `$-Q$` at `$z = +D$` with `$D \to \infty$`, so `$E_0 = 2Q/4\pi\epsilon_0D^2$`. Their images `$\mp QR/D$` at `$\mp R^2/D$` form a dipole `$p = 2QR^3/D^2 = 4\pi\epsilon_0R^3E_0$`, the separation-of-variables result in three lines.

<div class="problem" data-problem="cavity-image-force"></div>

## 3. Line charges and cylinders

For line charges the potential is logarithmic, `$V = -\dfrac{\lambda}{2\pi\epsilon_0}\ln s$`, and a pair `$\pm\lambda$` gives `$V = \dfrac{\lambda}{2\pi\epsilon_0}\ln\dfrac{s_2}{s_1}$`. Its equipotentials are again circles of Apollonius, so **the image of a line charge in a cylinder is an equal and opposite line** at the inverse point `$R^2/d$`. The cylinder then carries `$-\lambda$` per length and the force per length is `$\lambda^2/2\pi\epsilon_0(d - R^2/d)$`.

Turn the logic round and the image pair solves *any* problem whose conductors are circles of one Apollonius family:

| Geometry | Equivalent line charges | Capacitance per length |
|---|---|---|
| wire (radius `$a$`) at height `$h$` above a plane | `$\pm\lambda$` at `$\pm c$`, `$c^2 = h^2 - a^2$` | `$\dfrac{2\pi\epsilon_0}{\cosh^{-1}(h/a)}$` |
| two wires, radius `$a$`, axes `$D$` apart | `$\pm\lambda$` at `$\pm\sqrt{D^2/4 - a^2}$` | `$\dfrac{\pi\epsilon_0}{\cosh^{-1}(D/2a)}$` |
| wire off-axis inside a tube | `$-\lambda$` outside the tube at `$R^2/d$` | (eccentric cylinders) |

For thin wires `$\cosh^{-1}x \approx \ln 2x$`, giving the familiar `$2\pi\epsilon_0/\ln(2h/a)$` and `$\pi\epsilon_0/\ln(D/a)$`. The equivalent lines sit slightly *off* the wire axes, nearer the other conductor.

**Worked example.** A wire of radius 1.0 mm with its axis 10 cm above ground: `$\cosh^{-1}100 = 5.298$`, so `$C' = 5.563\times10^{-11}/5.298 = 10.5$` pF/m. A two-wire line with 1.0 mm wires 1.0 cm apart: `$\cosh^{-1}5 = 2.292$`, `$C' = 12.1$` pF/m.

<div class="problem" data-problem="wire-plane-capacitance"></div>

## 4. Dipoles, wedges and bosses

**A dipole above a grounded plane.** Image each charge: a dipole pointing straight away from the plane has an image pointing the **same** way (head to tail, attraction `$\dfrac{3p^2}{8(4\pi\epsilon_0)d^4}$`), while a dipole parallel to the plane has an image pointing the **opposite** way (side by side, attraction `$\dfrac{3p^2}{16(4\pi\epsilon_0)d^4}$`). In general the perpendicular component keeps its sign and the parallel component flips: a dipole at angle `$\alpha$` to the normal has its image at `$-\alpha$`.

**Wedges.** Two grounded half-planes meeting at angle `$\alpha$` need images at every reflection of the charge in both planes. The set closes with the right signs only when `$360^\circ/\alpha$` is an **even** integer, giving `$360^\circ/\alpha - 1$` images (3 for `$90^\circ$`, 5 for `$60^\circ$`). For `$120^\circ$` or `$72^\circ$` an image would land inside the physical region with the wrong sign, and the method fails.

**A hemispherical boss on a plane.** Treat it as a whole sphere plus the plane. A charge `$q$` on the axis at height `$d$` needs three images: `$-qR/d$` at `$R^2/d$` (the sphere), `$-q$` at `$-d$` (the plane), and `$+qR/d$` at `$-R^2/d$` (the plane's image of the sphere's image). At `$d = 2R$` the pull is `$0.205\,kq^2/R^2$`.

## 5. When the images never stop

**A charge between two grounded parallel plates.** Each image must itself be imaged in the other plate, and so on: an infinite row with period `$2L$`. The series converges, and two results come out cleanly without summing it:

- **Induced charges, by reciprocity.** Smear the charge into a sheet at the same position: the plates take `$-q(L - x)/L$` and `$-qx/L$`.
- **Exponential screening.** Far along the plates the potential is built from `$\sin(n\pi z/L)K_0(n\pi\rho/L)$` and dies as `$e^{-\pi\rho/L}$`: the alternating images cancel every multipole.

**A sphere near a plane.** Start with `$q_0$` at the centre of a sphere at potential `$V$`; image it in the plane, image that image in the sphere, and repeat. With `$\cosh\alpha = h/a$` the charges inside the sphere form the series `$q_n = q_0\sinh\alpha/\sinh n\alpha$`, so

```math
C = 4\pi\epsilon_0a\,\sinh\alpha\sum_{n=1}^{\infty}\frac{1}{\sinh n\alpha}
```

At `$h = 2a$` the series gives `$C = 1.34\times4\pi\epsilon_0a$`: the nearby plane raises the capacitance by a third.

**Inversion.** Behind the sphere image is Kelvin's theorem: if `$V(\vec r)$` is harmonic, so is `$\dfrac Rr V(R^2\vec r/r^2)$`. Inversion in a sphere maps planes to spheres and charges to image charges, which is why the plane and sphere images look so alike. Images in a dielectric half-space, where the image has the size `$-q(\epsilon_2 - \epsilon_1)/(\epsilon_2 + \epsilon_1)$`, are treated in [fields in matter](/learn/courses/gate-physics/fields-in-matter/).

<div class="meaning">

<dl>
<dt>Image charge</dt><dd>a fictitious charge outside the physical region that, together with the real charges, reproduces the boundary condition</dd>
<dt>Inverse point</dt><dd>for a sphere or circle of radius R, the point at R²/d on the same ray as the point at d</dd>
<dt>Circles of Apollonius</dt><dd>curves of fixed distance ratio from two points: the equipotentials of two opposite line charges, and (as spheres) of a charge and its image</dd>
<dt>Image force</dt><dd>the attraction of a charge to its own image: the force a conductor exerts through the charge it induces</dd>
<dt>Physical meaning</dt><dd>The induced surface charge has exactly the field outside the conductor that the images would have. The images are the simplest bookkeeping for a charge distribution that would be miserable to find directly.</dd>
</dl>

</div>

<div class="myth">

**"The image charge is the charge induced on the conductor."** Only for an infinite plane do they happen to be equal. A charge `$q$` inside a grounded cavity has an image `$-qR/d$`, larger than `$q$`, while the wall carries exactly `$-q$`. A charge outside a neutral sphere has two images summing to zero, matching the zero net induced charge, but they sit at points where the real charge is not. The images give the right field in the physical region and nothing else.

</div>

<div class="keypoints">

- Images go outside the physical region, fix the boundary condition, and give the true field only in the region. Energies carry a factor `$\tfrac12$`.
- Sphere: `$q' = -qR/d$` at `$R^2/d$`, inside or outside. Add `$4\pi\epsilon_0RV_0$` (fixed potential), `$+qR/d$` (neutral) or `$Q + qR/d$` (charge `$Q$`) at the centre.
- Grounded sphere force `$kq^2Rd/(d^2 - R^2)^2$`; cavity `$kq^2Rd/(R^2 - d^2)^2$`; neutral sphere far force `$\approx 2kq^2R^3/d^5$`. Like-charged sphere with `$Q = q$`: zero force at `$d = 1.618R$`.
- Line and cylinder: image `$-\lambda$` at `$R^2/d$`. Wire to plane `$2\pi\epsilon_0/\cosh^{-1}(h/a)$`; wire to wire `$\pi\epsilon_0/\cosh^{-1}(D/2a)$`.
- Dipole image: perpendicular part kept, parallel part reversed. Wedge: works only when `$360^\circ/\alpha$` is even. Boss: three images.
- Parallel plates: infinite images; reciprocity gives `$-q(L - x)/L$`; screening as `$e^{-\pi\rho/L}$`. Sphere near plane: `$C = 4\pi\epsilon_0a\sinh\alpha\sum1/\sinh n\alpha$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank. Each question has a full solution and, where there is a classic slip, a warning. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="method-of-images" data-exam="gate" data-n="10"></div>

**Next:** [multipole expansion](/learn/courses/gate-physics/multipoles/) explains why the far field of any of these image systems is a dipole or quadrupole. Back to [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/) for the series method, or try placing a charge and its image yourself in the [field line plotter](/science/field-line-plotter/).
