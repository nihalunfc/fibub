---
title: 'Units and Measurement: practice questions'
seoTitle: 'Units and Measurement Class 11 questions with answers'
summary: 'Board-style practice for Class 11 Units and Measurement: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The number of significant figures in 0.0450 is:'
    choices: ['2', '3', '4', '5']
    ans: 1
    why: 'The leading zeros do not count. 4, 5 and the final 0 (after the decimal point) do: 3 figures.'
  - q: 'The dimensional formula of pressure is:'
    choices: ['M L T⁻²', 'M L⁻¹ T⁻²', 'M L² T⁻²', 'M L⁻² T⁻²']
    ans: 1
    why: 'Pressure = force/area = M L T⁻² ÷ L² = M L⁻¹ T⁻².'
  - q: 'A quantity is measured as 2.0 ± 0.1. A quantity Z = A³ then has a percentage error of:'
    choices: ['5 %', '10 %', '15 %', '30 %']
    ans: 2
    why: 'Relative error of A is 0.1/2.0 = 5 %. For the cube the relative error is 3 × 5 % = 15 %.'
sources:
  - 'CBSE Class 11 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 1.** Read the chapter lesson, [Units and Measurement](/learn/courses/ncert-class-11-physics/units-and-measurement/), first. Try each question on paper before opening the answer. Board marks go for the formula, the substitution with units, the right number of significant figures and the final answer.

<div class="bigidea">Four habits win marks here: always write units, say how many significant figures the answer deserves, add absolute errors for sums and relative errors for products, and test every formula by dimensions before you trust it.</div>

## How to set out a numerical

1. Write the formula in symbols, then substitute with units.
2. Convert to SI first (cm to m, g to kg, km/h to m/s).
3. Round only at the end, to the fewest significant figures in the data.
4. For errors, say which rule you use: absolute errors for a sum, relative errors for a product.

<div class="problem" data-problem="c11p-units-vernier"></div>

<div class="problem" data-problem="c11p-units-error"></div>

## 1-mark questions

1. Name the SI unit of luminous intensity.

<details><summary>Answer</summary>The candela (cd).</details>

2. How many significant figures does 6.020 × 10²³ have?

<details><summary>Answer</summary>Four: 6, 0, 2 and the final 0 after the decimal point.</details>

3. Is the angle in radians a dimensional quantity?

<details><summary>Answer</summary>No. An angle is arc ÷ radius, a ratio of two lengths, so it has no dimensions (although it has a unit, the radian).</details>

4. What is meant by the least count of an instrument?

<details><summary>Answer</summary>The smallest value the instrument can measure; for a vernier caliper, one main-scale division minus one vernier division.</details>

## 2- and 3-mark questions

5. (2) Distinguish between accuracy and precision.

<details><summary>Answer</summary>Accuracy is how close a measured value is to the true value. Precision is how close repeated measurements are to each other. A set of readings can be precise (tightly grouped) yet inaccurate if a systematic error such as a zero error shifts them all.</details>

6. (2) The dimensions of a quantity are M L² T⁻³. Name it and write its SI unit.

<details><summary>Answer</summary>It is power (energy ÷ time = M L² T⁻² ÷ T). The SI unit is the watt, W = kg m² s⁻³.</details>

7. (3) A screw gauge has a pitch of 1 mm and 100 divisions on its thimble. When the jaws are closed, the 3rd division of the thimble lies on the reference line (a positive zero error). When a wire is held, the linear scale shows 2 mm and the 46th division coincides with the reference line. Find the diameter of the wire.

<details><summary>Answer</summary>

Least count = 1/100 = 0.01 mm. The closed-jaw reading is +3 × 0.01 = +0.03 mm, a positive zero error. Observed reading = 2 + 46 × 0.01 = 2.46 mm. Correct reading = 2.46 − 0.03 = **2.43 mm**.

</details>

8. (3) The period of a pendulum is measured as 2.63 s, 2.56 s, 2.42 s, 2.71 s and 2.80 s. Find the mean value and the mean absolute error, and give the result.

<details><summary>Answer</summary>

Mean = (2.63 + 2.56 + 2.42 + 2.71 + 2.80)/5 = 13.12/5 = 2.624 s ≈ 2.62 s.

Deviations: 0.006, 0.064, 0.204, 0.086, 0.176 (using 2.624); mean = 0.536/5 = 0.107 s ≈ 0.11 s. Result: T = 2.62 ± 0.11 s. The percentage error is 0.11/2.62 × 100 ≈ 4 %.

</details>

9. (3) Check by dimensions whether the formula `$v = \sqrt{\dfrac{F}{\mu}}$` can give the speed of a wave on a string, where F is the tension and μ is the mass per unit length.

<details><summary>Answer</summary>

[F] = M L T⁻² and [μ] = M L⁻¹. So [F/μ] = L² T⁻², and the square root is L T⁻¹, the dimension of a speed. The formula is dimensionally correct (and it is the correct formula).

</details>

## 5-mark questions

10. (5) State the principle of homogeneity. Using dimensions, derive an expression for the time period T of a simple pendulum in terms of m, l and g, and say what dimensional analysis cannot tell you.

<details><summary>Answer</summary>

**Principle.** Only quantities of the same dimensions can be added, subtracted or equated; so every term of a correct physical equation has the same dimensions.

**Derivation.** Let `$T = k\,m^a l^b g^c$`. Using [T] = T, [m] = M, [l] = L and [g] = L T⁻²:

`$T^1 = M^a\,L^{b}\,(L\,T^{-2})^c = M^a L^{b+c} T^{-2c}$`

Equating powers: M: a = 0; L: b + c = 0; T: −2c = 1. So c = −½, b = ½, a = 0. Therefore `$T = k\sqrt{l/g}$`.

**Limits.** It does not give the pure number k (it is 2π, found by experiment or a full derivation), and it cannot say whether the equation holds beyond the quantities assumed.

</details>

11. (5) The density of a solid cylinder is found from its mass m = 50.0 ± 0.1 g, length l = 10.00 ± 0.02 cm and diameter d = 2.00 ± 0.01 cm. Find the density with the maximum percentage error. Use ρ = 4m/(πd²l).

<details><summary>Answer</summary>

ρ = 4 × 50.0 / (π × 2.00² × 10.00) = 200/125.66 = 1.59 g cm⁻³.

Relative errors: Δm/m = 0.1/50.0 = 0.2 %, Δl/l = 0.02/10.00 = 0.2 %, Δd/d = 0.01/2.00 = 0.5 %, appearing squared, so 2 × 0.5 = 1.0 %.

Maximum percentage error = 0.2 + 0.2 + 1.0 = 1.4 %. So ρ = 1.59 g cm⁻³ ± 1.4 % = 1.59 ± 0.02 g cm⁻³.

</details>

12. (5) Explain how to read a vernier caliper. A caliper has 10 vernier divisions equal to 9 main-scale divisions (1 mm each). Find its least count, then find the length of an object if the zero of the vernier lies between 3.2 cm and 3.3 cm and the 6th division coincides with a main-scale line.

<details><summary>Answer</summary>

**Method.** Close the jaws to find zero error; put the object between the jaws; read the main-scale mark just before the vernier zero; find the vernier division that lines up with a main-scale division; length = main reading + n × least count (± zero error correction).

**Least count.** 1 main division = 1 mm; 1 vernier division = 0.9 mm; least count = 0.1 mm = 0.01 cm.

**Reading.** Main scale 3.2 cm; coinciding division n = 6, so 6 × 0.01 = 0.06 cm. Length = 3.2 + 0.06 = **3.26 cm**.

</details>

## Case-based question

A student measures the length of a table with a metre rule that has a worn zero end, so the first 2 mm of the rule are missing. She reads the table as 1.250 m, 1.251 m, 1.249 m and 1.250 m.

(a) Are her readings precise? (b) Are they accurate? (c) What kind of error is present? (d) The table’s true length is 1.252 m. Find the percentage error of the mean.

<details><summary>Answer</summary>

(a) Yes: the readings differ by at most 0.002 m, so they are precise.

(b) Not accurate: the mean 1.250 m is 2 mm below the true value of 1.252 m.

(c) A systematic error (the worn end); averaging cannot remove it.

(d) Error = 1.252 − 1.250 = 0.002 m. Percentage error = 0.002/1.252 × 100 ≈ 0.16 %.

</details>

## Assertion-reason questions

Choose: (A) both A and R true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

13. **A:** The number 3.200 has more significant figures than 3.2. **R:** Trailing zeros after a decimal point show the precision of the measurement.

<details><summary>Answer</summary>(A). 3.200 has 4 figures, 3.2 has 2, and the extra zeros claim a finer measurement.</details>

14. **A:** Work and torque have the same dimensional formula. **R:** Each is the product of a force and a distance.

<details><summary>Answer</summary>(A). Both are M L T⁻² × L = M L² T⁻². (Even so, work is a scalar and torque a vector: equal dimensions do not make two quantities the same kind.)</details>

15. **A:** A dimensionally correct equation need not be a correct equation. **R:** Dimensional analysis cannot detect pure numbers such as ½ or 2π.

<details><summary>Answer</summary>(A). For example v = u + 2at passes the dimension test but is false; a wrong pure-number factor is invisible to dimensions.</details>

## Practise with fresh numbers

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="units-and-measurement" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Least count of a vernier caliper = 1 main division − 1 vernier division; screw gauge = pitch ÷ divisions. Subtract a positive zero error.
- Random errors shrink on averaging; systematic errors do not.
- Sum or difference: add absolute errors. Product, quotient, power: add relative errors (times the power).
- Fewest significant figures for products; fewest decimal places for sums.
- Check an equation by dimensions first: a necessary test, never a proof.

</div>
