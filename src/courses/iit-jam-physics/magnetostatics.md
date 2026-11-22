---
title: 'Magnetic fields: Biot-Savart and Ampère'
seoTitle: Biot-Savart and Ampère's law for IIT JAM Physics
summary: 'The Lorentz force and circular motion, the Biot-Savart law for wires, loops and arcs, Ampère''s law for thick wires, solenoids, toroids and sheets, magnetic dipoles, the vector potential, and the superposition tricks top-rank questions use.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A charged particle moves in a uniform magnetic field. What happens to its kinetic energy?
    choices: ['It stays the same', 'It increases steadily', 'It decreases steadily', 'It depends on the charge sign']
    ans: 0
    why: The magnetic force qv × B is always perpendicular to the velocity, so it does no work. It changes the direction of motion, never the speed.
  - q: Two long parallel wires carry currents in the same direction. What do they do?
    choices: ['Attract each other', 'Repel each other', 'Feel no force', 'Twist round each other']
    ans: 0
    why: Each wire sits in the other's field, and the right-hand rule gives a force towards the other wire. Parallel currents attract, the opposite of like charges.
  - q: Inside a long straight wire carrying a uniform current, how does B depend on the distance s from the axis?
    choices: ['It grows in proportion to s', 'It falls as 1/s', 'It is zero', 'It is constant']
    ans: 0
    why: An Amperian circle of radius s encloses a current proportional to s², and its length is 2πs, so B is proportional to s inside. Outside it falls as 1/s.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 5: magnetostatics'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 6'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapters 34 and 35'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to predict the path of a charge in a magnetic field, get the field of wires, loops, arcs and polygons from the Biot-Savart law, use Ampère's law for every symmetric current, treat a small loop as a magnetic dipole, and solve the "hole in a conductor" and "spinning charge" problems that decide top ranks.

<div class="bigidea">Moving charges make magnetic fields that curl around them, and magnetic fields push sideways on moving charges; nothing is ever pushed along its own motion.</div>

## 1. The Lorentz force

A charge `$q$` moving with velocity `$\vec v$` through fields `$\vec E$` and `$\vec B$` feels

```math
\vec F = q\left(\vec E + \vec v\times\vec B\right)
```

The magnetic part is perpendicular to `$\vec v$`, so it **does no work**: it bends the path but never changes the speed. In a uniform field a charge moving at right angles to `$\vec B$` goes round a circle:

```math
qvB = \frac{mv^2}{r} \ \Rightarrow\ r = \frac{mv}{qB}, \qquad \omega = \frac{qB}{m}, \qquad T = \frac{2\pi m}{qB}
```

The period does not depend on the speed, which is how a cyclotron works. If the velocity has a part along `$\vec B$`, that part is untouched and the path becomes a helix of pitch `$v_\parallel T$`.

**Worked example.** A proton at `$2\times10^5$` m/s enters a 0.10 T field at `$60^\circ$` to it. The period is `$2\pi m/(qB) = 6.56\times10^{-7}$` s; along the field it moves at `$v\cos60^\circ = 10^5$` m/s; pitch `$= 6.56$` cm. Using `$v\sin60^\circ$` for the advance is the classic slip.

**Crossed fields.** With `$\vec E\perp\vec B$`, a particle goes straight only if `$v = E/B$` (a velocity selector), whatever its charge or mass. A particle starting from rest drifts at `$\vec E\times\vec B/B^2$`, along a cycloid, in the same direction for both signs of charge.

## 2. The Biot-Savart law

A short piece of wire `$d\vec l$` carrying current `$I$` makes a field

```math
d\vec B = \frac{\mu_0}{4\pi}\,\frac{I\,d\vec l\times\hat r}{r^2}, \qquad \frac{\mu_0}{4\pi} = 10^{-7}\ \text{T m/A}
```

where `$\hat r$` points from the piece to the field point. Two things to notice: pieces pointing straight at the field point give nothing (`$d\vec l\parallel\hat r$`), and the field curls around the current by the right-hand rule (thumb along `$I$`, fingers along `$\vec B$`).

<div class="meaning">

<dl>
<dt>I dl</dt><dd>a short element of current: the source of B, as charge is the source of E</dd>
<dt>dl × r̂</dt><dd>B is perpendicular to both the current and the line to the point: it circles the wire</dd>
<dt>1/r²</dt><dd>each element's field falls off like Coulomb's law</dd>
<dt>μ₀</dt><dd>4π × 10⁻⁷ T m/A: sets the strength of magnetic effects</dd>
<dt>Physical meaning</dt><dd>Every bit of moving charge adds a little swirl of magnetic field around itself; the field of a whole circuit is the sum of the swirls.</dd>
</dl>

</div>

The results you should know cold, all from that one law:

| Current | Field | Where |
|---|---|---|
| Straight segment | `$\dfrac{\mu_0I}{4\pi d}(\sin\alpha_2 - \sin\alpha_1)$` | distance `$d$`, angles from the perpendicular |
| Infinite wire | `$\dfrac{\mu_0I}{2\pi d}$` | |
| Semi-infinite wire, from its end | `$\dfrac{\mu_0I}{4\pi d}$` | on the perpendicular through the end |
| Circular loop, centre | `$\dfrac{\mu_0I}{2R}$` | an arc of angle `$\theta$` gives `$\dfrac{\theta}{2\pi}$` of this |
| Circular loop, on axis | `$\dfrac{\mu_0IR^2}{2(R^2+z^2)^{3/2}}$` | |

Try the figure. It adds up the Biot-Savart contributions of 72 small pieces per loop (no formula is built in) and draws the field lines in a slice through the axis. Compare the probe reading at the centre with `$\mu_0I/2R$`.

<figure class="fig" data-fig="current-field"><figcaption>Field lines of a straight wire, a loop and a short solenoid, computed piece by piece from the Biot-Savart law. Dots: current out of the screen; crosses: into it.</figcaption></figure>

**Worked example: a hairpin.** A semicircle of radius `$R$` with two long straight legs running off tangentially in the same direction. At the centre: the arc gives `$\mu_0I/(4R)$`, and each leg is a semi-infinite wire whose end is at the foot of the perpendicular, giving `$\mu_0I/(4\pi R)$`. All three point the same way:

```math
B = \frac{\mu_0I}{4R}\left(1 + \frac{2}{\pi}\right)
```

The legs carry opposite currents but sit on opposite sides of the centre, so their fields add, not cancel.

**Worked example: a square loop** of side `$a$`. Each side is a segment at distance `$a/2$` seen under `$\pm45^\circ$`: `$\dfrac{\mu_0I}{4\pi(a/2)}\cdot2\sin45^\circ$`. Four sides: `$B = \dfrac{2\sqrt2\,\mu_0I}{\pi a}$`, about 10% less than the circle that just fits inside the square (`$\mu_0I/a$`), because most of the square's wire is further from the centre.

<div class="problem" data-problem="loop-axis-field"></div>

## 3. Ampère's law

For steady currents, the circulation of `$\vec B$` round any closed loop counts the current threading it:

```math
\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}}, \qquad \nabla\times\vec B = \mu_0\vec J, \qquad \nabla\cdot\vec B = 0
```

It is the magnetic partner of Gauss's law, and it is useful in exactly the same way: only when symmetry lets `$B$` come out of the integral. The recipe: pick a loop along which `$B$` is constant and parallel (or perpendicular) to the path, then solve.

| Current | Amperian loop | Field |
|---|---|---|
| Thick wire, uniform `$J$` | circle | `$\dfrac{\mu_0Is}{2\pi R^2}$` inside, `$\dfrac{\mu_0I}{2\pi s}$` outside |
| Coaxial cable | circle | `$\dfrac{\mu_0I}{2\pi s}$` between, 0 outside |
| Long solenoid | rectangle | `$\mu_0nI$` inside, 0 outside |
| Toroid, `$N$` turns | circle in the core | `$\dfrac{\mu_0NI}{2\pi s}$` |
| Sheet of current `$K$` | rectangle through it | `$\dfrac{\mu_0K}{2}$` either side |

**Worked example.** A wire of radius `$R$` carries a current density `$J = J_0s/R$`. The current inside radius `$s$` is `$\int_0^s J_0\dfrac{s'}{R}2\pi s'\,ds' = \dfrac{2\pi J_0s^3}{3R}$`, so `$B = \dfrac{\mu_0J_0s^2}{3R}$`: it grows as `$s^2$` now, and `$B(R/2)/B(R) = 1/4$`.

<div class="myth">

**"A circular loop has nice symmetry, so use Ampère's law."** Ampère's law is true for the loop, but no Amperian path has a constant `$B$` along it, so it cannot give the field. The same goes for a finite straight segment. For those, use Biot-Savart. Ampère works only for infinite wires, ideal solenoids, toroids and sheets (and things built from them).

</div>

**Real solenoids.** A solenoid of finite length gives `$B = \tfrac12\mu_0nI(\cos\theta_1 + \cos\theta_2)$` on its axis, where the angles are the half-angles to its two ends. At the centre of one that is 20 cm long and 5 cm in radius this is 89% of `$\mu_0nI$`; at an end it is about half. The [coil field designer](/science/coil-field-designer/) shows how Helmholtz pairs, with `$B = (4/5)^{3/2}\mu_0NI/R$` midway, fix that.

## 4. Magnetic dipoles

Far away, any small current loop looks the same: a **magnetic dipole** of moment `$\vec m = I\vec A$` (area vector by the right-hand rule). Its field has the same shape as an electric dipole's: on the axis `$\dfrac{\mu_0}{4\pi}\dfrac{2m}{r^3}$`, in its plane half that and reversed. In a uniform field it feels no net force but a torque `$\vec\tau = \vec m\times\vec B$`, with energy `$U = -\vec m\cdot\vec B$`, lowest when aligned.

**Spinning charges are dipoles.** Cut the body into rings, find each ring's current (charge `$\times\ \omega/2\pi$`) and area, and add:

- Disc (`$\sigma$`, radius `$R$`): field at the centre `$\mu_0\sigma\omega R/2$`.
- Thin shell (charge `$Q$`): `$m = Q\omega R^2/3$`.
- Uniform solid sphere: `$m = Q\omega R^2/5$`.

If charge is spread like mass, every ring has `$m/L = Q/(2M)$`, so the whole body does too: the classical gyromagnetic ratio. The electron's spin has about twice that.

## 5. The vector potential

Since `$\nabla\cdot\vec B = 0$`, we can write `$\vec B = \nabla\times\vec A$`. `$\vec A$` is not unique: adding any gradient changes nothing. For a uniform `$\vec B = B_0\hat z$`, the choices `$\tfrac12B_0(-y, x, 0)$`, `$B_0(0, x, 0)$` and `$B_0(-y, 0, 0)$` all work. In the Coulomb gauge (`$\nabla\cdot\vec A = 0$`), `$\nabla^2\vec A = -\mu_0\vec J$`: three Poisson equations, just like electrostatics. GATE and NET build on this; JAM asks you to recognise it.

## 6. Superposition tricks

**A hole in a conductor.** A long cylinder carries uniform current density `$\vec J$`, with an off-axis cylindrical hole whose axis is displaced by `$\vec d$`. Treat it as a full cylinder with `$+\vec J$` plus a hole-sized one with `$-\vec J$`. Inside a solid cylinder `$\vec B = \tfrac{\mu_0}{2}\vec J\times\vec s$`, so in the hole

```math
\vec B = \frac{\mu_0}{2}\vec J\times\vec s - \frac{\mu_0}{2}\vec J\times(\vec s - \vec d) = \frac{\mu_0}{2}\vec J\times\vec d
```

a uniform field, exactly like the uniform electric field in an off-centre cavity of a charged sphere ([lesson 4.1](/learn/courses/iit-jam-physics/electrostatics-gauss/)).

<div class="keypoints">

- `$\vec F = q(\vec E + \vec v\times\vec B)$`; magnetic force does no work. Circles: `$r = mv/qB$`, `$T = 2\pi m/qB$` independent of speed.
- Biot-Savart: `$d\vec B = \dfrac{\mu_0}{4\pi}\dfrac{I\,d\vec l\times\hat r}{r^2}$`. Know the segment, infinite wire, loop centre (arcs as fractions) and loop axis results.
- Ampère: `$\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}}$`, useful only for infinite wires, solenoids, toroids and sheets.
- Parallel currents attract: `$F/L = \mu_0I_1I_2/2\pi d$`.
- A small loop is a dipole `$\vec m = I\vec A$`: torque `$\vec m\times\vec B$`, energy `$-\vec m\cdot\vec B$`. Spinning shell `$Q\omega R^2/3$`, solid sphere `$Q\omega R^2/5$`.
- `$\vec B = \nabla\times\vec A$` with gauge freedom; superpose `$\pm\vec J$` for holes.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [magnetic fields practice page](/learn/courses/iit-jam-physics/practice/magnetostatics/).

<div class="qbank" data-bank="physics" data-topics="magnetostatics" data-exam="jam" data-n="10"></div>

**Next:** [lesson 4.6](/learn/courses/iit-jam-physics/magnetic-materials/) puts magnetic materials into the picture (B, H and M), and lesson 4.7 lets the fields change in time: [electromagnetic induction and inductance](/learn/courses/iit-jam-physics/induction/). For the electric side of the story, see [electric fields and Gauss's law](/learn/courses/iit-jam-physics/electrostatics-gauss/). Iron cores and gaps are worked out in the [magnetic circuit solver](/science/magnetic-circuit/). For potentials, gauges and fields in matter at MSc level, see the [GATE Physics course](/learn/courses/gate-physics/).
