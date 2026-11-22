---
title: Electrostatic Potential and Capacitance
seoTitle: 'Electrostatic Potential and Capacitance Class 12 notes'
summary: 'Class 12 Potential and Capacitance with animations: potential, equipotentials, conductors, dielectrics, capacitor combinations and energy, with derivations.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'Two capacitors of 6 µF each are joined in series across a battery. The equivalent capacitance is:'
    choices: ['12 µF', '6 µF', '3 µF', '36 µF']
    ans: 2
    why: '1/C = 1/6 + 1/6 = 1/3, so C = 3 µF. In series the equivalent is smaller than either capacitor.'
  - q: 'A charged capacitor is disconnected from its battery and a dielectric slab of constant 4 fills the gap. The energy stored:'
    choices: ['increases four times', 'stays the same', 'falls to one quarter', 'becomes zero']
    ans: 2
    why: 'The charge is fixed and C becomes 4C, so U = Q²/2C falls to a quarter. The "missing" energy is the work the field does pulling the slab in.'
  - q: 'At a point midway between two equal positive charges:'
    choices: ['E = 0 and V = 0', 'E = 0 but V is not zero', 'E is not zero but V = 0', 'neither is zero']
    ans: 1
    why: 'The two fields are equal and opposite, so E = 0. The potentials are both positive and add, so V is not zero. Potential is a scalar and needs no cancelling.'
sources:
  - 'NCERT Class 12 Physics, Chapter 2 “Electrostatic Potential and Capacitance” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Constants: CODATA 2018 recommended values, NIST (ε₀ = 8.854 × 10⁻¹² F/m); dielectric constants from the CRC Handbook of Chemistry and Physics, 97th edition, “Permittivity (dielectric constant) of inorganic solids”'
---

**Physics · Class 12 · Chapter 2 · about 80 minutes.** By the end you will be able to find the potential of point charges, dipoles and systems of charges, use equipotential surfaces, work out the energy of charges in a field, explain what happens inside conductors and dielectrics, and solve problems on capacitors, their combinations and their energy.

<div class="bigidea">Potential is “electric height”: the work needed per unit charge to bring it to a point. Charges roll “downhill” from high potential to low, and the field points down the slope. A capacitor is a device that stores charge, and so energy, by keeping two conductors at a potential difference; a dielectric between them lets it store more.</div>

## 1. Electrostatic potential

Lift a ball from the floor to a shelf and you do work against gravity; the ball now has potential energy and you could say the shelf is at a higher “gravitational potential”. The electric force is a **conservative** force too: the work done moving a charge between two points does not depend on the path, only on the end points. So we can define a potential.

The **potential difference** between points A and B is the work done by an external agent per unit positive charge, moving it slowly from A to B against the electric force:

```math
V_B - V_A = \frac{W_{A\to B}}{q_0}
```

Its unit is the **volt** (1 V = 1 J/C). The **potential at a point** is the work per unit charge to bring a positive test charge there from infinity, where we take V = 0.

<div class="meaning">

<dl>
<dt>V</dt><dd>electric potential in volts; a scalar (just a number with sign, no direction)</dd>
<dt>W</dt><dd>work done by the external agent, not by the field</dd>
<dt>q₀</dt><dd>a small positive test charge</dd>
<dt>Physical meaning</dt><dd>Potential is energy per unit charge. A 1.5 V cell gives each coulomb 1.5 J. Only <b>differences</b> in potential matter: we can choose the zero anywhere, as with the height of a hill measured from sea level or from your house.</dd>
</dl>

</div>

### Potential of a point charge

Bring a unit positive charge from far away to a distance r from a charge Q. We follow the steps with the picture:

<div class="steps" data-fig="c12p-cap-potsteps">
<div class="step">A test charge of +1 is far away from Q. We bring it slowly toward Q. If Q is positive, the field of Q pushes back, so we must do work.</div>
<div class="step">At distance x the force on the test charge equals the field there: E(x) = kQ/x². It grows as the test charge gets nearer.</div>
<div class="step">In a tiny step dx the force hardly changes, so the work in that step is E dx: the area of a thin strip under the curve.</div>
<div class="step">Add the strips from far away down to r. With thinner and thinner strips the sum becomes the area under the whole curve.</div>
<div class="step">The area is ∫ kQ/x² dx from ∞ to r, which gives kQ/r (the integral of 1/x² is −1/x). That is the work per unit charge.</div>
<div class="step">So the potential at distance r from a point charge Q is V = kQ/r: positive for Q > 0, negative for Q < 0, falling as 1/r (the field falls faster, as 1/r²).</div>
</div>

```math
V = \frac{1}{4\pi\varepsilon_0}\frac{Q}{r}
```

<figure class="fig" data-fig="c12p-cap-pointpot"><figcaption>Potential (top) and field (bottom) of a point charge. Slide r: the shaded area under the E graph from r outwards is the potential difference, and the readout checks it against kQ/r. Switch the sign to see a negative charge: V is negative everywhere and rises toward zero far away.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-pointv"></div>

**Relation between field and potential.** In a small step dl along the field, `$dV = -E\,dl$`, so `$E = -\dfrac{dV}{dl}$`: the field is the (negative) slope of the potential, pointing from high to low potential. The unit V/m is the same as N/C. For a uniform field, `$\Delta V = E\,d$`.

<figure class="fig" data-fig="c12p-cap-uniform"><figcaption>Between two oppositely charged plates the potential falls steadily from + to −. Move point B further along and ΔV grows in proportion to the distance. Switch to “Detour” and see that a longer, zig-zag path changes nothing: sideways moves along an equipotential cost no work.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-uniform"></div>

### Potential of a system of charges

Because potential is a scalar, we simply **add** the potentials of the individual charges (superposition), keeping signs:

```math
V = \frac{1}{4\pi\varepsilon_0}\left(\frac{q_1}{r_1} + \frac{q_2}{r_2} + \cdots\right)
```

<div class="myth">

**“Where the field is zero the potential is zero.”** At the midpoint of two equal positive charges the fields cancel (E = 0) but the potentials add (V is large and positive). The opposite is true on the perpendicular bisector of a dipole: V = 0 but E ≠ 0. Field is the slope of potential, not the value.

</div>

### Potential of a dipole

For a dipole (±q, separation 2a) the potential at a point with position vector r at angle θ to the dipole axis, for r much larger than a, is

```math
V = \frac{1}{4\pi\varepsilon_0}\frac{p\cos\theta}{r^2}
```

*Derivation.* The distances from P to +q and −q are `$r_1 \approx r - a\cos\theta$` and `$r_2 \approx r + a\cos\theta$` (for r ≫ a, the small difference in direction is neglected). Then

```math
V = kq\left(\frac1{r_1}-\frac1{r_2}\right) = kq\,\frac{r_2-r_1}{r_1r_2} = kq\,\frac{2a\cos\theta}{r^2-a^2\cos^2\theta} \approx \frac{k\,(2qa)\cos\theta}{r^2} = \frac{kp\cos\theta}{r^2}
```

So V falls as 1/r² (faster than for a single charge). It is zero on the whole equatorial plane (θ = 90°): all charges can be moved there with no work.

<figure class="fig" data-fig="c12p-cap-dipolepot"><figcaption>Go round the dipole. On the + side the potential is positive, on the − side negative, and the cos θ curve shows how it changes. The readout compares the formula with the exact sum from the two charges.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-dipolev"></div>

## 2. Equipotential surfaces

An **equipotential surface** is a surface on which the potential is the same everywhere. Properties:

1. **No work** is needed to move a charge along it.
2. The **field is perpendicular** to it at every point. (If E had a part along the surface, a charge would need work to move along it.)
3. The field points from higher to lower potential, and is **stronger where equipotentials are closer**.
4. Two equipotential surfaces never cross.

For a point charge they are concentric spheres, for a uniform field they are parallel planes, for a dipole they are the curved surfaces shown below. Drag the charges and read the potential at any point:

<figure class="fig" data-fig="@em-field-lines"><figcaption>Draggable charges with field lines and equipotentials. Check that the two always meet at right angles, and that the equipotentials crowd together where the field lines are close.</figcaption></figure>

The tool below paints the potential as a map for any arrangement of charges, so you can see the hills and valleys:

<!--fig:tool potential-map-->

## 3. Potential energy of charges

**Two charges.** The work needed to bring q₂ from infinity to distance r from a fixed q₁ is stored as potential energy:

```math
U = \frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r}
```

It is positive for like charges (you pushed against repulsion) and negative for unlike charges (the pair is bound: you would have to supply energy to pull them apart).

<figure class="fig" data-fig="c12p-cap-pairenergy"><figcaption>U against r for like and unlike charges. For like charges the curve rises steeply as they approach; for unlike it plunges to large negative values. The readout gives the work you must do to bring one charge in from far away.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-pairenergy"></div>

**Several charges.** The energy of a system is the total work to assemble it, one charge at a time. For three charges q₁, q₂, q₃ it is the sum over all **pairs**:

```math
U = k\left(\frac{q_1q_2}{r_{12}} + \frac{q_1q_3}{r_{13}} + \frac{q_2q_3}{r_{23}}\right)
```

Worked example: three charges of +q each at the corners of an equilateral triangle of side a. There are three pairs, each with energy kq²/a, so `$U = 3kq^2/a$`.

**A charge in an external field.** A charge q at a point where the external potential is V has potential energy qV. A dipole in a uniform field has `$U = -\vec p\cdot\vec E = -pE\cos\theta$`: the work done by the external agent to turn it from θ₁ to θ₂ is `$pE(\cos\theta_1 - \cos\theta_2)$`.

<figure class="fig" data-fig="c12p-cap-dipolenergy"><figcaption>The energy of a dipole in a field against its angle, with the torque. The dips and peaks mark stable (0°) and unstable (180°) equilibrium. Move the two points to see the work needed to turn the dipole between any two angles.</figcaption></figure>

## 4. Conductors in electrostatics

In a metal, charges are free to move. When the charges stop moving (electrostatic equilibrium) several things are true:

1. The **electric field inside** the conductor is zero.
2. Any net charge sits on the **surface**.
3. The field just outside the surface is perpendicular to it and has magnitude `$E = \sigma/\varepsilon_0$`.
4. The whole conductor, surface and inside, is at **one potential**.
5. The charge density is larger where the surface is more sharply curved (points), which is why lightning conductors have a point.

*Why E = 0 inside.* If there were a field, free electrons would move. They keep moving until the charges they leave behind on the surface make a field that exactly cancels the applied one inside. Watch it happen:

<figure class="fig" data-fig="c12p-cap-conductor"><figcaption>Switch the field on. Electrons (−) drift to the left face, leaving + on the right. The induced field (orange) grows until it equals the applied one, and the net field inside falls to zero.</figcaption></figure>

*Why E = σ/ε₀ outside.* Take a small pillbox with one face just inside (E = 0, no flux) and one face just outside, parallel to the surface (E perpendicular, flux EA). The wall has no flux. The enclosed charge is σA, so EA = σA/ε₀.

**Electrostatic shielding.** Inside a hollow conductor (a cavity with no charge in it) the field is zero whatever the field outside. That is why you are safe in a car during a thunderstorm, and why the sensitive cables of a TV antenna are wrapped in metal braid. Try it with the shielding tool: [Faraday cage](/learn/faraday-cage/).

## 5. Dielectrics and polarisation

An **insulator** has no free charges, but it still responds to a field. Its molecules are either **polar** (a permanent dipole, like water, which turn to line up with the field) or **non-polar** (no dipole until the field stretches the atom, making an induced dipole). Either way the material gets **polarised**: the sum of the tiny dipoles gives a layer of **bound charge** on its faces, opposite in sign to the plates’ charge nearby.

These bound charges make a field that **opposes** the applied field, so the field inside the dielectric is smaller:

```math
E = \frac{E_0}{\kappa}
```

where κ (also written ε<sub>r</sub>) is the **dielectric constant**: about 1 for air, 2 to 5 for paper and plastics, 6 to 7 for mica and 80 for water.

<figure class="fig" data-fig="@em-dielectric-polarise"><figcaption>Molecules in a slab in an electric field. Watch them stretch or turn, the bound surface charges appear, and the field inside drops to E₀/κ.</figcaption></figure>

## 6. Capacitors and capacitance

A **capacitor** is two conductors separated by an insulator. When connected to a battery, charge +Q goes onto one plate and −Q onto the other, and the voltage V across them is proportional to Q:

```math
Q = CV
```

The constant C is the **capacitance** in farads (1 F = 1 C/V). A farad is huge: practical capacitors are µF, nF or pF.

### The parallel-plate capacitor

Two plates of area A a distance d apart (d small). The field between them is that of two opposite sheets (chapter 1): `$E = \sigma/\varepsilon_0 = Q/(\varepsilon_0A)$`. The potential difference is `$V = Ed = Qd/(\varepsilon_0A)$`, so

```math
C = \frac{\varepsilon_0 A}{d}
```

With a dielectric filling the gap: `$C = \kappa\varepsilon_0A/d$`.

<figure class="fig" data-fig="c12p-cap-plates"><figcaption>Make the plates bigger and the gap smaller and C goes up. At a fixed battery voltage, more capacitance means more charge stored (more + and − symbols).</figcaption></figure>

<div class="problem" data-problem="c12p-cap-plates"></div>

<div class="meaning">

<dl>
<dt>C</dt><dd>capacitance in farads: the charge stored per volt</dd>
<dt>ε₀, A, d</dt><dd>permittivity of free space, plate area and plate gap</dd>
<dt>κ</dt><dd>dielectric constant of the material between the plates</dd>
<dt>Physical meaning</dt><dd>C depends only on the geometry and the material between the plates, not on the charge or voltage. Large area gives the charge room; small gap makes the plates help each other hold charge.</dd>
</dl>

</div>

### Effect of a dielectric

Two cases, and exam questions love to mix them up:

- **Battery connected** (V fixed): C → κC, so Q → κQ (more charge flows in), E is unchanged, energy rises.
- **Battery disconnected** (Q fixed): C → κC, V → V/κ, E → E/κ, energy falls to U/κ.

<figure class="fig" data-fig="c12p-cap-dielectric"><figcaption>Put the slab in, switch the battery on or off, change κ and read the five numbers. With the battery removed the voltage falls; with the battery connected the charge rises.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-dielectric"></div>

Try your own numbers in the full capacitor lab:

<!--fig:tool capacitor-lab-->

### Combination of capacitors

<div class="steps" data-fig="c12p-cap-combo">
<div class="step">Series: C₁ = 2 µF and C₂ = 4 µF are joined end to end with a 12 V battery. There is only one path for charge.</div>
<div class="step">The charge on each capacitor is the same, Q. The middle two plates were neutral and stay neutral overall: charge on them is only separated.</div>
<div class="step">The voltages add to the battery voltage: V = V₁ + V₂ = Q/C₁ + Q/C₂.</div>
<div class="step">Compare with V = Q/C: 1/C = 1/C₁ + 1/C₂. Here C = 4/3 µF, Q = 16 µC, V₁ = 8 V and V₂ = 4 V (the smaller capacitor takes the larger voltage).</div>
<div class="step">Parallel: both capacitors are connected directly across the battery, so each has the full 12 V.</div>
<div class="step">The charges are Q₁ = C₁V and Q₂ = C₂V, and the battery supplies the total Q = (C₁ + C₂)V, so C = C₁ + C₂ = 6 µF. Q₁ = 24 µC, Q₂ = 48 µC.</div>
</div>

```math
\text{series: } \frac1C = \frac1{C_1}+\frac1{C_2}+\cdots \qquad \text{parallel: } C = C_1 + C_2 + \cdots
```

<div class="problem" data-problem="c12p-cap-combo"></div>

Build any network, series and parallel mixed, and read every charge and voltage:

<!--fig:tool capacitor-network-->

**Joining charged capacitors.** If two charged capacitors are joined plate to plate (positive to positive), charge flows until the potentials are equal. Total charge is conserved: `$V = \dfrac{C_1V_1 + C_2V_2}{C_1+C_2}$`. Some energy is lost as heat and a spark in the connecting wire.

<div class="problem" data-problem="c12p-cap-share"></div>

## 7. Energy stored in a capacitor

To charge a capacitor, we move charge from one plate to the other. When q is already on the plates, the voltage is q/C, so moving a further dq takes work (q/C) dq. Adding up from 0 to Q gives the area of the triangle under the V–q line:

```math
U = \int_0^Q \frac{q}{C}\,dq = \frac{Q^2}{2C} = \frac12 CV^2 = \frac12 QV
```

<figure class="fig" data-fig="c12p-cap-energy"><figcaption>Press “Charge it up” and watch charge go across. The voltage rises along the line and the shaded triangle (the energy) grows: half of QV, not all of it, because the early charge was moved at a low voltage.</figcaption></figure>

<div class="problem" data-problem="c12p-cap-energy"></div>

**Where is the energy?** In the field between the plates. Dividing by the volume Ad gives the **energy density** `$u = \dfrac{U}{Ad} = \dfrac12\varepsilon_0E^2$` (J/m³), which holds for any electric field, not only in a capacitor. (A battery that provides QV while only ½QV is stored: the other half is lost as heat in the wires while charging.) Calculate any capacitor combination with the [Capacitor and inductor calculator](/science/capacitor-inductor-calculator/) or solve whole charge arrangements with the [Electrostatics solver](/science/electrostatics-solver/).

<div class="myth">

**“A capacitor stores charge.”** The total charge on a capacitor is zero: +Q on one plate and −Q on the other. What it stores is **energy**, in the electric field between the plates. When we say it holds a charge Q we mean the charge on one plate.

</div>

<div class="history">

<ul class="timeline">
<li><b>1745</b> Ewald von Kleist and Pieter van Musschenbroek independently invent the Leyden jar, the first capacitor: a glass jar lined with metal foil.</li>
<li><b>1837</b> Michael Faraday finds that an insulator between the plates changes the capacitance and introduces the dielectric constant. The unit of capacitance, the farad, is named after him.</li>
<li><b>1800s</b> Capacitors in telegraph and radio circuits; today they sit in every phone charger, camera flash and touch screen.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** The Van de Graaff generator, which builds up millions of volts by carrying charge on a moving belt to the inside of a hollow metal dome (where it can flow out because the field inside a conductor is zero), is no longer in the Class 12 book. Also beyond it: the method of images, and the energy of a charged conducting sphere `$U = Q^2/(8\pi\varepsilon_0R)$`.

</div>

<div class="keypoints">

- Potential difference = work per unit charge (V = W/q, 1 V = 1 J/C); a scalar. Point charge V = kQ/r; systems add algebraically. E = −dV/dl; uniform field ΔV = Ed.
- Dipole: V = kp cos θ/r² (far field); zero on the equatorial plane.
- Equipotential surfaces: no work along them; E is perpendicular to them; they never cross; closer together means stronger field.
- Pair energy U = kq₁q₂/r; for a system sum over pairs. Dipole in a field: U = −pE cos θ.
- Conductor in equilibrium: E = 0 inside, charge on the surface, E = σ/ε₀ just outside, one potential throughout. A cavity is shielded.
- Dielectric: polarisation gives bound charges, E → E/κ; C → κC.
- Q = CV; parallel plates C = ε₀A/d (κε₀A/d with dielectric). Series: 1/C adds, same Q; parallel: C adds, same V.
- Energy U = ½CV² = Q²/2C = ½QV; energy density ½ε₀E². Battery on: V fixed. Battery off: Q fixed.

</div>

Going further for JEE/NEET: the exam-level problems (conducting spheres, networks with symmetry, slabs partly filling the gap) are in [Potential and capacitance (JEE)](/learn/courses/engineering-entrance/potential-capacitance/).
