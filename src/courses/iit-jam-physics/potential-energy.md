---
title: Potential and electrostatic energy
seoTitle: Electric potential and energy for IIT JAM Physics
summary: 'Electric potential as a single number at each point: getting V from E and E from V, equipotentials, dipoles, the work to assemble charges, field energy density, self-energy of spheres and shells, and Poisson''s and Laplace''s equations.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Midway between charges +q and −q, what are the potential and the field?
    choices: ['V = 0, E not zero', 'V = 0, E = 0', 'V not zero, E = 0', 'Both not zero']
    ans: 0
    why: The two potentials kq/r and −kq/r cancel as plain numbers, but both fields point from + towards −, so they add. Zero potential does not mean zero field.
  - q: An electron is released from rest. Which way does it move?
    choices: ['Towards higher potential', 'Towards lower potential', 'Along an equipotential', 'It stays put']
    ans: 0
    why: Its potential energy is qV with q negative, so its energy falls as V rises. Negative charges roll "uphill" in potential; positive charges roll downhill.
  - q: The same charge is put (a) on a thin shell and (b) uniformly through a solid sphere of the same radius. Which stores more energy?
    choices: ['The solid sphere', 'The shell', 'They are equal', 'It depends on the charge']
    ans: 0
    why: Outside, both have the same field. The solid sphere also has field inside it (the shell has none), which carries extra energy. Shell kQ²/2R, sphere 3kQ²/5R.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 2: electric potential, work and energy'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 2'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapter 29'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 40 minutes.** By the end you will be able to find the potential of point charges, rings, spheres and lines, get the field back from a potential with `$\vec E = -\nabla V$`, work out the energy of a set of charges and of a continuous distribution, and use Poisson's and Laplace's equations to read off a charge density.

<div class="bigidea">Because the electrostatic field is conservative, one number at each point, the potential, carries all the information of the three field components, and it adds without any vectors.</div>

## 1. Why a potential exists

In [lesson 4.1](/learn/courses/iit-jam-physics/electrostatics-gauss/) you saw that `$\nabla\times\vec E = 0$` for any static charges. A curl-free field is the gradient of something ([lesson 1.5](/learn/courses/iit-jam-physics/vector-calculus/)), so we can write

```math
\vec E = -\nabla V, \qquad V(b) - V(a) = -\int_a^b \vec E\cdot d\vec l
```

The minus sign is a choice that makes `$V$` behave like a hill: **the field points downhill**, from high potential to low. Only differences of `$V$` are physical; we usually set `$V = 0$` at infinity.

For a point charge, integrating `$kq/r^2$` in from infinity gives

```math
V(r) = \frac{q}{4\pi\epsilon_0\,r}
```

Potentials of several charges **add as plain numbers**. No components, no angles. That is the whole point.

**Worked example.** Charges `$+q, +q, -q, +q$` (`$q = 1$` nC) at the corners of a 20 cm square. Every corner is `$a/\sqrt2 = 0.141$` m from the centre, so `$V = k(q + q - q + q)/0.141 = k(2q)/0.141 \approx 127$` V. Treating potentials as vectors and cancelling corners is the trap.

<div class="meaning">

<dl>
<dt>V</dt><dd>potential energy per unit charge at a point (volts = joules per coulomb)</dd>
<dt>−∇V</dt><dd>the field: points the way V falls fastest</dd>
<dt>qΔV</dt><dd>energy a charge q gains or loses moving through a potential difference ΔV</dd>
<dt>Equipotential</dt><dd>a surface of constant V; field lines cross it at right angles and no work is done moving along it</dd>
<dt>Physical meaning</dt><dd>V is a height map for charges. Positive charges roll downhill, negative ones uphill, and the slope is the field.</dd>
</dl>

</div>

## 2. From V to E and back

**From E to V** you integrate along any path (the result does not depend on the path). **From V to E** you differentiate: `$E_x = -\partial V/\partial x$` and so on.

**Worked example.** `$V = 3x^2y$` volts. Then `$\vec E = -(6xy\,\hat i + 3x^2\,\hat j)$`, which at `$(1, 2, 0)$` is `$-12\,\hat i - 3\,\hat j$` V/m. The option without the minus sign is always there.

Three facts that settle many statement questions:

- Where `$V$` is constant, `$\vec E = 0$` (inside a conductor, for example, `$V$` is the same as at its surface, not zero).
- `$V = 0$` does **not** mean `$E = 0$`: midway between `$+q$` and `$-q$`, `$V = 0$` but the field is strong.
- `$E = 0$` does not mean `$V = 0$`: midway between two equal charges the field cancels but the potentials add.

Explore it below. Pick a charge set, switch on the equipotentials, and tap to probe `$V$` and `$|\vec E|$`. Notice that the field lines always cross the dotted curves at right angles, and that the field is strongest where the equipotentials crowd together.

<figure class="fig" data-fig="gauss-charges" data-mode="potential"><figcaption>Equipotentials (dotted) and field lines (solid) for point charges. The probe reads V and |E| in units of kq/d and kq/d².</figcaption></figure>

## 3. Potentials of the standard shapes

| Source | Potential | Note |
|---|---|---|
| Point charge | `$kq/r$` | zero at infinity |
| Dipole `$\vec p$` | `$\dfrac{kp\cos\theta}{r^2}$` | falls as `$1/r^2$`; the field as `$1/r^3$` |
| Ring `$Q$`, radius `$R$`, on axis | `$\dfrac{kQ}{\sqrt{R^2+z^2}}$` | every piece is at the same distance |
| Shell `$Q$`, radius `$R$` | `$kQ/r$` outside, `$kQ/R$` inside | constant inside (no field) |
| Uniform solid sphere | `$\dfrac{kQ(3R^2 - r^2)}{2R^3}$` inside | `$1.5\,kQ/R$` at the centre |
| Infinite line `$\lambda$` | `$-\dfrac{\lambda}{2\pi\epsilon_0}\ln\dfrac{s}{s_0}$` | cannot be zero at infinity |

**Worked example: concentric shells.** Shells of radii 10 cm and 20 cm carry `$+2$` nC and `$-1$` nC. Inside both, each shell contributes its surface value: `$V(0) = k(2/0.10 - 1/0.20)\times10^{-9} \approx 135$` V. The outer shell has no field inside it, yet it still raises the potential there; dropping it is the common slip.

**The line charge.** Integrating `$\lambda/(2\pi\epsilon_0s)$` gives a logarithm, which never settles down as `$s\to\infty$`. The charge itself reaches to infinity, so infinity cannot be the reference; pick any finite `$s_0$`. The potential *difference* between radii `$a$` and `$b$`, `$\dfrac{\lambda}{2\pi\epsilon_0}\ln\dfrac ba$`, is all you ever need.

## 4. Work and the energy of a set of charges

Bringing a charge `$q$` from infinity to a point at potential `$V$` takes work `$qV$`. Build up a set of charges one at a time and you get

```math
W = \frac{1}{4\pi\epsilon_0}\sum_{\text{pairs}}\frac{q_iq_j}{r_{ij}} = \frac12\sum_i q_iV_i
```

where `$V_i$` is the potential at charge `$i$` due to all the others (the `$\tfrac12$` stops each pair being counted twice).

**Worked example.** Four `$1\ \mu$`C charges at the corners of a 10 cm square: four side pairs at `$a$` and two diagonal pairs at `$a\sqrt2$`. `$W = \dfrac{kq^2}{a}(4 + \sqrt2) \approx 0.487$` J. Forgetting the diagonals gives 0.360 J.

<div class="problem" data-problem="assemble-charges"></div>

**Energy and motion.** A particle of charge `$q$` released from rest at potential `$V_1$` has kinetic energy `$q(V_1 - V_2)$` at `$V_2$`. An alpha particle (`$+2e$`) going from `$+150$` V to `$-250$` V gains `$2\times400 = 800$` eV. Keep the sign of the charge and the order of subtraction straight, and electron-volts make the arithmetic trivial.

**A dipole in a uniform field** has energy `$U = -\vec p\cdot\vec E$`: lowest when aligned. Turning it from aligned to reversed costs `$2pE$`.

## 5. Energy stored in the field

For a continuous charge, the same idea becomes `$W = \tfrac12\int\rho V\,d\tau$`, and with Gauss's law this can be rewritten entirely in terms of the field:

```math
W = \frac{\epsilon_0}{2}\int_{\text{all space}} E^2\,d\tau, \qquad u = \frac12\epsilon_0E^2 \ \text{per unit volume}
```

Step through the standard results for a sphere of charge `$Q$` and radius `$R$`:

<div class="steps">
<div class="step"><p><b>Outside any sphere.</b> E = kQ/r². The energy beyond radius R is ∫ ½ε₀E² 4πr² dr from R to ∞ = kQ²/(2R).</p></div>
<div class="step"><p><b>Thin shell.</b> No field inside, so that is all: W = kQ²/(2R).</p></div>
<div class="step"><p><b>Uniform solid sphere.</b> Inside E = kQr/R³, which adds kQ²/(10R). Total W = (1/2 + 1/10) kQ²/R = (3/5) kQ²/R.</p></div>
<div class="step"><p><b>Where it sits.</b> For the solid sphere, (1/2)/(3/5) = 5/6 of the energy is outside the sphere and only 1/6 inside.</p></div>
</div>

<div class="myth">

**"Electrostatic energy can be negative, so ½ε₀∫E² must be wrong."** Both are right. `$\tfrac{\epsilon_0}{2}\int E^2$` is never negative because it includes the (infinite) self-energy of each point charge. The pair formula `$kq_1q_2/r$` is only the interaction part, the cross term `$\epsilon_0\int\vec E_1\cdot\vec E_2$`, which can be negative. Energies do not add when fields do: `$(\vec E_1 + \vec E_2)^2 \ne E_1^2 + E_2^2$`.

</div>

**Worked example.** Air breaks down near `$3\times10^6$` V/m, where `$u = \tfrac12\epsilon_0E^2 \approx 40$` J/m³. A 1 T magnetic field stores about `$4\times10^5$` J/m³ ([lesson 4.7](/learn/courses/iit-jam-physics/induction/)): this is why motors are magnetic, not electric.

## 6. Poisson's and Laplace's equations

Put `$\vec E = -\nabla V$` into `$\nabla\cdot\vec E = \rho/\epsilon_0$`:

```math
\nabla^2V = -\frac{\rho}{\epsilon_0} \ \ (\text{Poisson}), \qquad \nabla^2V = 0 \ \text{where there is no charge} \ \ (\text{Laplace})
```

**Worked example.** `$V = V_0(x^2+y^2+z^2)/a^2$` has `$\nabla^2V = 6V_0/a^2$`, so `$\rho = -6\epsilon_0V_0/a^2$`. And `$a(x^2 - y^2)$`, `$a\,xy$` or `$e^{-kx}\sin ky$` all satisfy Laplace's equation, so they can exist in empty space. Solving Laplace's equation with boundary conditions is [lesson 4.3](/learn/courses/iit-jam-physics/conductors-images/); the [2D electrostatics solver](/science/electrostatics-solver/) does it numerically for any electrodes you draw.

<div class="keypoints">

- `$\vec E = -\nabla V$`, `$\Delta V = -\int\vec E\cdot d\vec l$`. The field points from high to low potential.
- Potentials add as numbers: point charge `$kq/r$`, ring `$kQ/\sqrt{R^2+z^2}$`, shell constant inside, solid sphere `$1.5kQ/R$` at the centre, dipole `$kp\cos\theta/r^2$`.
- `$V = 0$` and `$E = 0$` are independent statements; a constant `$V$` region has zero field.
- Work to assemble charges: sum `$kq_iq_j/r_{ij}$` over pairs. Kinetic energy gained: `$q(V_1 - V_2)$`.
- Field energy `$\tfrac12\epsilon_0E^2$` per volume. Shell `$kQ^2/2R$`, uniform sphere `$3kQ^2/5R$`.
- Poisson `$\nabla^2V = -\rho/\epsilon_0$`; Laplace `$\nabla^2V = 0$` in charge-free space.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [potential and energy practice page](/learn/courses/iit-jam-physics/practice/potential-energy/).

<div class="qbank" data-bank="physics" data-topics="potential-energy" data-exam="jam" data-n="10"></div>

**Next:** [lesson 4.3](/learn/courses/iit-jam-physics/conductors-images/) puts conductors into the picture, solves Laplace's equation and introduces the method of images; after that come dielectrics and capacitors. Back to the field picture: [electric fields and Gauss's law](/learn/courses/iit-jam-physics/electrostatics-gauss/). For multipole expansions and boundary value problems at MSc level, see the [GATE Physics course](/learn/courses/gate-physics/).
