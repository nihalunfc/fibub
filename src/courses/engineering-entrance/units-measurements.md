---
title: Units, dimensions and errors
seoTitle: 'Units, dimensions and errors: JEE and NEET physics'
summary: 'SI units, dimensional formulae, dimensional analysis (checking, deriving and converting), significant figures, how errors combine, and reading a vernier caliper and screw gauge, from basics to JEE Advanced depth.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'What are the dimensions of the universal gravitational constant G?'
    choices: ['[M⁻¹L³T⁻²]', '[ML³T⁻²]', '[M⁻¹L²T⁻²]', '[M⁻²L³T⁻¹]']
    ans: 0
    why: 'F = Gm₁m₂/r², so G = Fr²/(m₁m₂) = [MLT⁻²][L²]/[M²] = [M⁻¹L³T⁻²].'
  - q: 'Length is measured as 2.0 cm with 1% error and time as 4.0 s with 2% error. What is the maximum percentage error in L/T²?'
    choices: ['3%', '5%', '1%', '4%']
    ans: 1
    why: 'Percentage errors add, each times the size of its power: 1% + 2 × 2% = 5%. The minus sign of the power never reduces an error.'
  - q: 'How many significant figures does 0.004050 have?'
    choices: ['3', '4', '7', '6']
    ans: 1
    why: 'Leading zeros only place the decimal point and do not count. 4, 0, 5 and the trailing 0 after the decimal point count: four.'
sources:
  - 'Bureau International des Poids et Mesures (2019), The International System of Units (SI), 9th edition https://www.bipm.org/en/publications/si-brochure'
  - 'NIST, CODATA recommended values of the fundamental physical constants https://physics.nist.gov/cuu/Constants/'
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Units and measurements, experimental skills'
---

**Physics · Class 11 · about 30 minutes.** By the end you will be able to find the dimensions of any quantity, use them to check and derive formulae, combine errors correctly and read a vernier and a screw gauge.

<div class="bigidea">Every physical quantity is a number times a unit, and every unit is built from a few base units. Keeping track of those building blocks (dimensions) lets you catch wrong formulae, guess right ones and see how measurement errors grow.</div>

## 1. Base units and derived units

The SI system has **seven base units**. Every other unit is built from them.

| Quantity | Unit | Symbol | Dimension |
|---|---|---|---|
| Mass | kilogram | kg | [M] |
| Length | metre | m | [L] |
| Time | second | s | [T] |
| Electric current | ampere | A | [A] (some books write [I]) |
| Temperature | kelvin | K | [K] (or [θ]) |
| Amount of substance | mole | mol | [mol] (or [N]) |
| Luminous intensity | candela | cd | [cd] (or [J]) |

Since 2019 all seven are defined by fixing exact values of constants of nature, such as the speed of light (exactly 299 792 458 m/s) and the Planck constant. Two **supplementary** units are dimensionless: the radian (plane angle) and the steradian (solid angle).

A **derived unit** is a combination: speed in m/s, force in newtons (1 N = 1 kg m s⁻²), energy in joules (1 J = 1 N m).

## 2. Dimensions: the building blocks of a quantity

The **dimensional formula** of a quantity shows which powers of the base quantities it contains. Velocity is length divided by time, so `$[v] = [L T^{-1}]$`. Force is mass times acceleration: `$[F] = [M L T^{-2}]$`.

<div class="steps">
<div class="step"><b>Start from a defining formula you trust.</b> Pressure = force / area.</div>
<div class="step"><b>Write each piece in dimensions.</b> `$[F] = [MLT^{-2}]$`, `$[A] = [L^2]$`.</div>
<div class="step"><b>Divide powers.</b> `$[P] = [MLT^{-2}]/[L^2] = [ML^{-1}T^{-2}]$`.</div>
<div class="step"><b>Notice the family.</b> Stress, Young's modulus, bulk modulus and energy density have the same dimensions as pressure. Exams love asking which pair has the same dimensions.</div>
</div>

Quantities worth knowing by heart:

| Quantity | Dimensions | Quantity | Dimensions |
|---|---|---|---|
| Work, energy, torque | `$[ML^2T^{-2}]$` | Power | `$[ML^2T^{-3}]$` |
| Momentum, impulse | `$[MLT^{-1}]$` | Angular momentum, Planck constant h | `$[ML^2T^{-1}]$` |
| Pressure, stress, modulus | `$[ML^{-1}T^{-2}]$` | Surface tension, spring constant | `$[MT^{-2}]$` |
| Coefficient of viscosity | `$[ML^{-1}T^{-1}]$` | Gravitational constant G | `$[M^{-1}L^3T^{-2}]$` |
| Charge | `$[AT]$` | Voltage | `$[ML^2T^{-3}A^{-1}]$` |
| Resistance | `$[ML^2T^{-3}A^{-2}]$` | Capacitance | `$[M^{-1}L^{-2}T^4A^2]$` |
| Permittivity ε₀ | `$[M^{-1}L^{-3}T^4A^2]$` | Permeability μ₀ | `$[MLT^{-2}A^{-2}]$` |

<div class="myth">

**"Torque and work are the same quantity because they have the same dimensions."** Same dimensions do not mean same quantity. Torque is a vector (force times lever arm); work is a scalar (force along a displacement). Equal dimensions are necessary for an equation to be right, never proof that it is.

</div>

## 3. Three uses of dimensional analysis

**(a) Checking an equation.** Every term added or equated must have the same dimensions (the principle of homogeneity). In `$s = ut + \tfrac12 at^2$`, each term is [L], so the equation could be right.

**(b) Deriving a relation.** Suppose the period of a pendulum depends on its length l, the mass m and g. Write `$T = k\, l^a m^b g^c$`, so `$[T] = [L]^a [M]^b [LT^{-2}]^c$`. Matching powers: M gives b = 0, T gives −2c = 1, L gives a + c = 0. So `$T = k\sqrt{l/g}$`. The method cannot find the number k (it is 2π), and it fails when the quantity depends on more than three base quantities, on a dimensionless number, or on a sum of terms.

**(c) Converting units.** A quantity is the same whatever the units, so `$n_1 [M_1^a L_1^b T_1^c] = n_2 [M_2^a L_2^b T_2^c]$`. Example: 1 J in CGS units (g, cm, s): `$n_2 = 1 \times (1000)^1 (100)^2 (1)^{-2} = 10^7$` erg.

<div class="meaning">
<dl>
<dt>[M], [L], [T]</dt><dd>the mass, length and time content of a quantity</dd>
<dt>Homogeneity</dt><dd>you can only add or equate things with the same dimensions</dd>
<dt>Dimensionless</dt><dd>angles, strain, refractive index, the argument of sin, log and e<sup>x</sup></dd>
<dt>Physical meaning</dt><dd>Nature does not care about our units. A true law must stay true when you change from metres to centimetres, which is exactly what dimensional analysis checks.</dd>
</dl>
</div>

**A JEE favourite:** in `$y = A \sin(\omega t - kx)$` the bracket must be dimensionless, so `$[\omega] = [T^{-1}]$` and `$[k] = [L^{-1}]$`. In `$P = \frac{a}{b} e^{-bx/(kT)}$` (P a pressure, x a distance, kT an energy), first make the exponent dimensionless, so `$[b] = [kT]/[x] = [MLT^{-2}]$`; then `$[a] = [P][b] = [M^2 T^{-4}]$`.

## 4. Significant figures

Significant figures are the digits you actually measured, plus one estimated digit.

- All non-zero digits count. Zeros between them count (2005 has 4).
- Leading zeros never count (0.0045 has 2).
- Trailing zeros count if there is a decimal point (4.500 has 4; 4500 is ambiguous, so write `$4.5 \times 10^3$` or `$4.500 \times 10^3$`).
- **Multiplying or dividing:** keep as many significant figures as the least precise factor.
- **Adding or subtracting:** keep as many decimal places as the least precise term.
- **Rounding:** round half to even in strict work (2.745 → 2.74, 2.735 → 2.74); most exams accept ordinary rounding, so follow the question.

## 5. Errors and how they combine

For a measurement x with error Δx: **absolute error** Δx, **relative error** Δx/x, **percentage error** 100 Δx/x. The mean absolute error of repeated readings is the average of the sizes of their differences from the mean.

| If the quantity is... | its maximum error is... |
|---|---|
| `$Z = A \pm B$` | `$\Delta Z = \Delta A + \Delta B$` (absolute errors add, even when subtracting) |
| `$Z = AB$` or `$A/B$` | `$\dfrac{\Delta Z}{Z} = \dfrac{\Delta A}{A} + \dfrac{\Delta B}{B}$` |
| `$Z = A^p B^q / C^r$` | `$\dfrac{\Delta Z}{Z} = p\dfrac{\Delta A}{A} + q\dfrac{\Delta B}{B} + r\dfrac{\Delta C}{C}$` |

The quantity with the **highest power** contributes most, so measure it most carefully (in a pendulum, the period T, which is squared). Try it:

<div class="problem" data-problem="pendulum-error"></div>

<div class="problem" data-problem="error-power"></div>

<div class="myth">

**"Subtracting two quantities subtracts their errors."** Never. Errors are uncertainties: each can push the result either way, so the worst case always adds them. That is why the difference of two nearly equal numbers has a huge percentage error.

</div>

Pick an operation and move the sliders for the two measurements and their errors. Compare the green bar made from the rule with the grey bar found by trying all extreme values.

<figure class="fig" data-fig="@mech-error-prop"><figcaption>For a + b and a − b the absolute errors add; for a × b and a ÷ b the relative errors add. Try a − b with a close to b: the result is tiny but its error is not, so its relative error explodes.</figcaption></figure>

## 6. Reading a vernier caliper and a screw gauge

A **vernier** has N divisions that span N − 1 main-scale divisions. Its **least count** is 1 main division − 1 vernier division = (1/N) main division, 0.1 mm for the usual 10-division vernier.

**Reading = main-scale reading + (coinciding vernier division × least count)**, then subtract the zero error (a positive zero error means the reading is too big).

<figure class="fig" data-fig="vernier"><figcaption>Slide the length. Find the main-scale mark just left of the vernier zero, then the vernier line that lines up with a main-scale line (highlighted). Try the zero-error button.</figcaption></figure>

<div class="problem" data-problem="vernier-read"></div>

A **screw gauge** works the same way: least count = pitch / number of circular-scale divisions (0.5 mm / 50 = 0.01 mm is common). Reading = main-scale reading + (circular-scale division × least count) − zero error. If the circular zero lies below the reference line when the jaws touch, the zero error is positive.

<div class="keypoints">

- Seven SI base units; every other unit and dimension is built from them.
- Find dimensions from a defining formula; memorise the common ones (energy `$[ML^2T^{-2}]$`, pressure `$[ML^{-1}T^{-2}]$`, h `$[ML^2T^{-1}]$`, G `$[M^{-1}L^3T^{-2}]$`).
- Dimensional analysis checks equations, derives power-law relations (not the constant) and converts units.
- Arguments of sin, log and exponentials must be dimensionless.
- Errors add: absolute errors for sums and differences, relative errors times their powers for products, quotients and powers.
- Vernier least count = 1 MSD − 1 VSD; screw gauge least count = pitch / circular divisions; always correct for zero error.

</div>
