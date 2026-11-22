---
title: 'Electric potential and capacitors'
seoTitle: 'Electric potential and capacitors: JEE and NEET physics'
summary: 'Potential and potential energy of charges, potential of shells, spheres and rings, equipotentials and E = −dV/dr, conductors, capacitance, series and parallel combinations, dielectrics and slabs, energy stored and lost on sharing, and RC charging, up to JEE Advanced level.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A capacitor is charged and the battery is removed. A dielectric slab is then pushed fully in. What happens to the stored energy?'
    choices: ['It increases K times', 'It decreases to 1/K of its value', 'It stays the same', 'It becomes zero']
    ans: 1
    why: 'With the battery gone, Q stays fixed. C becomes KC, so U = Q²/2C falls to U/K. The slab is pulled in, and the field does work on it.'
  - q: 'Inside a hollow charged conducting sphere, the potential is:'
    choices: ['zero', 'the same as on the surface', 'decreasing towards the centre', 'increasing towards the centre']
    ans: 1
    why: 'E = 0 inside, and E = −dV/dr, so V does not change: it equals kQ/R everywhere inside.'
  - q: 'Three 6 µF capacitors are joined in series. The equivalent capacitance is:'
    choices: ['18 µF', '2 µF', '6 µF', '3 µF']
    ans: 1
    why: 'In series the reciprocals add: 1/C = 3/6, so C = 2 µF. Series capacitors behave like resistors in parallel.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Electrostatic potential and capacitance'
  - 'Vacuum electric permittivity ε₀ = 8.854 187 8188 × 10⁻¹² F/m, CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to find the potential of any set of charges, move between E and V, and solve capacitor circuits with dielectrics, charge sharing, energy and RC timing.

<div class="bigidea">Potential is energy per unit charge, a height on an electric hill. Charges roll from high to low (positive ones do), the field points downhill, and its strength is how steep the hill is. A capacitor is a store of charge, and of energy, at a chosen height difference.</div>

## 1. Potential and potential energy

The **potential** at a point is the work done per unit charge to bring a small positive charge from infinity to that point, slowly: `$V = W/q$`, in volts (J/C). For a point charge, `$V = \dfrac{kq}{r}$`, with sign. Potential is a **scalar**: for many charges just add the numbers, no angles.

- **Potential energy** of two charges: `$U = \dfrac{kq_1q_2}{r}$`. For a group, add over every pair once.
- **Work by an outside agent** to move q from A to B: `$q(V_B - V_A)$`. Work does not depend on the path.
- **Electron volt:** an electron moved through 1 V gains 1 eV = 1.6 × 10⁻¹⁹ J.

<div class="myth">

**"Where the field is zero, the potential is zero."** No. Midway between two equal positive charges, E = 0 but V = 2kq/(d/2), not zero. Field is the slope of V, not V itself. The reverse also holds: midway between +q and −q, V = 0 but E is not.

</div>

## 2. Potential of charged bodies

| Body | Potential |
|---|---|
| Ring (charge Q, radius R), on axis at x | `$\dfrac{kQ}{\sqrt{R^2 + x^2}}$`; at the centre kQ/R |
| Thin shell or conducting sphere | kQ/r outside; **kQ/R everywhere inside** |
| Solid sphere, uniform charge | `$\dfrac{kQ(3R^2 - r^2)}{2R^3}$` inside; at the centre 1.5 × surface value |
| Dipole at distance r, angle θ | `$\dfrac{kp\cos\theta}{r^2}$`; zero on the equatorial line |

## 3. Field from potential, equipotentials

The field is the negative slope of the potential: `$E = -\dfrac{dV}{dr}$`, or in components `$E_x = -\dfrac{\partial V}{\partial x}$`. In a uniform field, `$V = Ed$`.

**Equipotential surfaces** join points at the same potential. They are always perpendicular to field lines, and no work is done moving a charge along one. Around a point charge they are spheres; in a uniform field they are flat planes. A conductor's whole surface (and inside) is one equipotential.

When two charged spheres are joined by a wire, charge flows until their potentials match: `$\dfrac{q_1}{r_1} = \dfrac{q_2}{r_2}$`, so `$\sigma_1 r_1 = \sigma_2 r_2$`. The smaller sphere has the larger surface density. That is why charge crowds at sharp points and leaks away there (corona discharge, lightning conductors).

## 4. Capacitance

A capacitor is two conductors with equal and opposite charge. Its capacitance `$C = Q/V$` (farad) depends only on shape, size and the material between.

```math
C_{\text{parallel plate}} = \frac{\varepsilon_0 A}{d}, \qquad C_{\text{sphere}} = 4\pi\varepsilon_0 R, \qquad C_{\text{spherical}} = \frac{4\pi\varepsilon_0\, ab}{b - a}, \qquad C_{\text{cylindrical}} = \frac{2\pi\varepsilon_0 L}{\ln(b/a)}
```

<div class="meaning">
<dl>
<dt>A</dt><dd>area of one plate (m²)</dd>
<dt>d</dt><dd>gap between the plates (m)</dd>
<dt>a, b</dt><dd>inner and outer radii of spherical or cylindrical conductors</dd>
<dt>K</dt><dd>dielectric constant of a filling material; filling the whole gap multiplies C by K</dd>
<dt>Physical meaning</dt><dd>A bigger area holds more charge for the same voltage; a smaller gap makes each charge pull harder on its partner, so less voltage is needed for the same charge.</dd>
</dl>
</div>

**Combinations.** Parallel: `$C = C_1 + C_2 + \dots$` (same V, charges add). Series: `$\dfrac1C = \dfrac1{C_1} + \dfrac1{C_2} + \dots$` (same Q, voltages add). For two in series, `$C = \dfrac{C_1C_2}{C_1 + C_2}$`, and the smaller capacitor takes the larger voltage.

## 5. Dielectrics and slabs

A dielectric's molecules polarise and set up a small opposite field inside it, cutting the field to E/K. A slab of thickness t and constant K in a gap d acts like an air gap of only t/K:

```math
C = \frac{\varepsilon_0 A}{d - t + t/K}
```

A metal slab is the case K → ∞: `$C = \varepsilon_0A/(d - t)$`. Try it here, and compare battery connected with battery removed.

<figure class="fig" data-fig="capacitor-dielectric"><figcaption>A parallel plate capacitor (100 cm²) first charged to 12 V across 5 mm. With the battery kept on, V stays fixed and Q changes; with it removed, Q stays fixed and V changes. The field inside the slab is K times weaker.</figcaption></figure>

<div class="problem" data-problem="pc-slab"></div>

| Change | Battery connected (V fixed) | Battery removed (Q fixed) |
|---|---|---|
| Insert dielectric K | C, Q, U all × K; E same | C × K; V, E, U ÷ K |
| Double the gap | C ÷ 2, Q ÷ 2, U ÷ 2, E ÷ 2 | C ÷ 2, V × 2, U × 2, E same |

A slab partly across the plate area (side by side) makes **parallel** capacitors; a slab partly through the gap (layered) makes **series** capacitors.

## 6. Energy stored, energy lost

```math
U = \frac{Q^2}{2C} = \frac12 CV^2 = \frac12 QV, \qquad u = \frac12\varepsilon_0 E^2 \ \text{per unit volume}
```

The energy lives in the field between the plates. The plates attract each other with `$F = \dfrac{Q^2}{2\varepsilon_0 A}$`, half of QE, because each plate feels only the other plate's field.

**Charge sharing.** Join a capacitor C₁ at V₁ to C₂ at V₂. Charge is conserved, the common voltage is `$\dfrac{C_1V_1 + C_2V_2}{C_1 + C_2}$`, and energy is always lost:

```math
\Delta U = \frac{C_1C_2}{2(C_1 + C_2)}(V_1 - V_2)^2
```

<div class="problem" data-problem="pc-sharing-loss"></div>

<div class="myth">

**"A battery that charges a capacitor stores all its work in it."** The battery does work QV, but only ½QV ends up in the capacitor. The other half is lost as heat in the wires, however small their resistance.

</div>

## 7. Charging and discharging through a resistor

With a resistor R in series, charge does not appear at once. **Charging:** `$q = CV(1 - e^{-t/RC})$`, current `$I = \dfrac{V}{R}e^{-t/RC}$`. **Discharging:** `$q = Q_0 e^{-t/RC}$`. The time constant τ = RC is the time to reach 63% of the final charge (or fall to 37%). After about 5τ the job is done. In a DC circuit after a long time, a capacitor carries no current, so treat it as a gap.

<div class="problem" data-problem="pc-rc-charge"></div>

**Worked example (level 4).** A 2 µF capacitor at 100 V is connected across an uncharged 3 µF capacitor. Common voltage = 200/5 = 40 V. Loss = (2 × 3)/(2 × 5) × 100² µJ = 6000 µJ = 6 mJ. Check: before ½ × 2 × 10⁴ = 10 mJ; after ½ × 5 × 1600 = 4 mJ. ✓

<div class="keypoints">

- V = kq/r (scalar, add with signs); U = kq₁q₂/r for each pair; W = q ΔV, path does not matter.
- E = −dV/dr; equipotentials are perpendicular to field lines; a conductor is one equipotential.
- Shell: kQ/R inside; solid sphere centre 1.5 kQ/R; ring axis kQ/√(R² + x²).
- C = ε₀A/d; sphere 4πε₀R; parallel adds C, series adds 1/C.
- Slab: C = ε₀A/(d − t + t/K); metal slab K → ∞.
- Battery on: V fixed. Battery off: Q fixed. Work out every change from that.
- U = Q²/2C = ½CV²; sharing loses C₁C₂(V₁ − V₂)²/[2(C₁ + C₂)]; plate force Q²/(2ε₀A).
- RC: q = CV(1 − e^(−t/RC)), τ = RC.

</div>
