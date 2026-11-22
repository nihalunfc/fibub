---
title: 'Electric Charges and Fields: practice questions'
seoTitle: 'Electric Charges and Fields Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Electric Charges and Fields: 1, 2, 3 and 5 mark questions, a case study and assertion-reason, with full answers.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'Two point charges +q and +q are a distance r apart. At the midpoint, the electric field is:'
    choices: ['2kq/(r/2)²', 'kq/(r/2)²', 'zero', '4kq/r²']
    ans: 2
    why: 'At the midpoint the two fields have the same size and opposite directions, so they cancel: E = 0. (The potential there is not zero, but that comes in the next chapter.)'
  - q: 'The SI unit of the electric field can be written as:'
    choices: ['N C', 'N/C or V/m', 'C/N', 'J/C']
    ans: 1
    why: 'E = F/q gives N/C, and E = V/d gives V/m. They are the same unit. J/C is the volt.'
  - q: 'A dipole is released in a uniform field at 90° to it. It will:'
    choices: ['stay at rest', 'move in a straight line', 'rotate toward the field direction', 'rotate away from the field direction']
    ans: 2
    why: 'The torque pE sin θ is a maximum at 90° and turns p toward E. There is no net force, so the centre does not move.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 1.** Read the chapter lesson, [Electric Charges and Fields](/learn/courses/ncert-class-12-physics/electric-charges-and-fields/), first. Try each question on paper before opening the answer. Board answers are marked in steps, so write the law, the formula in symbols, the numbers with units, then the answer.

<div class="bigidea">Four tools solve almost every question here: Coulomb’s law with superposition, E = F/q, flux and Gauss’s law with the right symmetric surface, and the dipole formulas. Draw the picture, mark the directions of the fields, and add them as vectors.</div>

## How to set out a numerical

1. Draw the charges and mark the point or surface asked about.
2. State the law you use (Coulomb, superposition, Gauss).
3. Write the formula in symbols, put in numbers in SI units (µC to 10⁻⁶ C, cm to 10⁻² m).
4. Add vectors with their directions, then give the answer with unit and direction.

<div class="problem" data-problem="c12p-field-coulomb"></div>

<div class="problem" data-problem="c12p-field-flux"></div>

## 1-mark questions

1. Write the SI unit of electric flux.

<details><summary>Answer</summary>N m² C⁻¹ (equivalently V m).</details>

2. What is the net charge of a body that has 10⁹ extra protons and 10⁹ extra electrons?

<details><summary>Answer</summary>Zero. The charges are +10⁹e and −10⁹e, which add to nothing.</details>

3. Why can two electric field lines not cross?

<details><summary>Answer</summary>At the crossing point the field would have two directions at once, but the field at a point has one direction only.</details>

4. A charge q is placed at the centre of a cube. What is the total flux through the cube?

<details><summary>Answer</summary>q/ε₀, from Gauss’s law, whatever the size of the cube.</details>

## 2- and 3-mark questions

5. (2) Define the dipole moment and state its SI unit and direction.

<details><summary>Answer</summary>

The dipole moment is the product of either charge and the distance between them: p = q × 2a. Its unit is coulomb metre (C m). It is a vector pointing from the negative charge to the positive charge.

</details>

6. (2) Two charges of 2 µC and −2 µC are 6 cm apart. Find the force between them.

<details><summary>Answer</summary>

`$F = kq_1q_2/r^2 = 9\times10^9\times(2\times10^{-6})^2/(0.06)^2 = 10$` N, attractive, because the charges are unlike.

</details>

7. (3) Find the electric field at the point midway between charges +4 µC and −4 µC placed 20 cm apart.

<details><summary>Answer</summary>

Each charge is 10 cm = 0.1 m from the midpoint. Field of one: `$E = kq/r^2 = 9\times10^9\times4\times10^{-6}/0.01 = 3.6\times10^6$` N/C.

The field of +q points away from it, toward −q. The field of −q at the midpoint points toward −q: the same direction. So the fields add: `$E = 2\times3.6\times10^6 = 7.2\times10^6$` N/C, pointing from the positive toward the negative charge.

</details>

8. (3) State two properties of electric field lines and draw them for two equal positive charges.

<details><summary>Answer</summary>

Properties: they begin on positive and end on negative charges; the tangent gives the direction of the field; they never cross; the closer they are, the stronger the field; they never form closed loops.

For two equal positive charges, the lines leave each charge and curve away from each other, as the figure in the chapter shows. Midway between them there is a neutral point where the field is zero and no line passes.

</details>

9. (3) A dipole of moment 3 × 10⁻⁸ C m is in a uniform field of 2 × 10⁴ N/C. Find the maximum torque and the work needed to turn it from the stable position through 180°.

<details><summary>Answer</summary>

Maximum torque (at 90°): `$\tau = pE = 3\times10^{-8}\times2\times10^{4} = 6\times10^{-4}$` N m.

Work done = change in potential energy = `$U_{180} - U_0 = pE - (-pE) = 2pE = 1.2\times10^{-3}$` J.

</details>

10. (3) Show that the flux through a closed surface is independent of its shape, using Gauss’s law for a point charge.

<details><summary>Answer</summary>

For a sphere of radius r with the charge at the centre, E = q/(4πε₀r²) is the same everywhere and points outward, so Φ = E × 4πr² = q/ε₀. The radius cancels. Any other closed surface round the charge has the same number of field lines passing through it, because lines neither start nor end in the empty space between the sphere and the surface. So Φ = q/ε₀ for every shape.

</details>

## 5-mark questions (model answers)

11. (5) Derive the electric field at a point on the axis of an electric dipole, and show that the field is twice that at the same distance on the equatorial line.

<details><summary>Answer</summary>

Let the charges +q at x = +a and −q at x = −a, and P on the axis at distance r from the centre (r > a).

Field of +q: `$E_+ = \dfrac{kq}{(r-a)^2}$`, away from +q (along +x).

Field of −q: `$E_- = \dfrac{kq}{(r+a)^2}$`, toward −q (along −x).

Net, along +x (the direction of p):

`$E = kq\left[\dfrac{1}{(r-a)^2} - \dfrac{1}{(r+a)^2}\right] = kq\,\dfrac{4ar}{(r^2-a^2)^2} = \dfrac{2kpr}{(r^2-a^2)^2}$` with p = 2qa.

For r ≫ a: `$E_{axial} = \dfrac{2kp}{r^3}$`.

Equatorial point: both charges are at distance `$\sqrt{r^2+a^2}$`, each field has magnitude `$kq/(r^2+a^2)$`. The components along the bisector cancel; the components parallel to the axis add, each equal to E₊ cos θ with `$\cos\theta = a/\sqrt{r^2+a^2}$`, pointing opposite to p:

`$E_{eq} = \dfrac{2kqa}{(r^2+a^2)^{3/2}} = \dfrac{kp}{(r^2+a^2)^{3/2}} \approx \dfrac{kp}{r^3}$`.

Hence E_axial = 2 E_equatorial.

</details>

12. (5) Using Gauss’s law, derive the electric field due to an infinite plane sheet of charge, and write the field between two oppositely charged parallel sheets.

<details><summary>Answer</summary>

Take σ as the charge per unit area. By symmetry E is perpendicular to the sheet and the same at equal distances on either side. Choose a cylinder (pillbox) of cross-section A cutting the sheet, with end faces equidistant from it.

Flux through the curved wall is zero (E is parallel to the wall). Flux through each end is EA, outward. Total flux = 2EA.

Charge inside = σA. Gauss’s law: `$2EA = \sigma A/\varepsilon_0$`, so `$E = \sigma/2\varepsilon_0$`, directed away from the sheet if σ > 0. It does not depend on distance.

For two sheets with +σ and −σ: between them the fields add, E = σ/ε₀, from the positive sheet to the negative one. Outside they cancel and E = 0.

</details>

13. (5) A thin spherical shell of radius R carries charge Q. Find the electric field (a) outside, (b) at the surface and (c) inside. Sketch E against r.

<details><summary>Answer</summary>

Use a concentric sphere of radius r as the Gaussian surface; E is radial and constant on it, so Φ = E × 4πr².

(a) r > R: enclosed charge is Q, so `$E = \dfrac{Q}{4\pi\varepsilon_0r^2}$`.

(b) r = R: `$E = \dfrac{Q}{4\pi\varepsilon_0R^2}$`.

(c) r < R: enclosed charge is zero, so E = 0.

Graph: zero from r = 0 to R, a jump (for the surface itself) to the maximum value kQ/R², then falling as 1/r². (See the graph in the chapter.)

</details>

## Case-based question

14. **A comb and bits of paper.** Neha combs her dry hair and brings the comb near small bits of paper on the table. The bits jump up to the comb, stick for a moment, and then some fly off again. She knows that paper is neutral. Her teacher says the comb has polarised the paper.

(a) (1) What charge does the comb gain when rubbed with hair? Why?

(b) (1) Why is the force on the paper attractive although the paper is neutral?

(c) (1) Why do some bits fly off after touching the comb?

(d) (1) Would the paper still be attracted if the comb produced a perfectly uniform field? Explain.

<details><summary>Answer</summary>

(a) Negative: electrons move from hair to the plastic comb, so the comb has an excess of electrons.

(b) The comb’s field pulls the positive and negative charges in the paper slightly apart, making tiny dipoles. The end of the paper nearer the comb has the opposite charge to the comb and the field is stronger there, so the attraction beats the repulsion at the far end.

(c) After contact some electrons pass from the comb to the paper. The paper now has the same sign of charge as the comb, so it is repelled.

(d) No. In a uniform field the two ends of a dipole feel equal and opposite forces, so there is a torque but no net force. A non-uniform field is needed for attraction.

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** A charged glass rod attracts a neutral piece of paper. **R:** The paper becomes polarised and the force on the nearer charge is larger than on the farther.

<details><summary>Answer</summary>(A) Both are true and R explains A: the induced charges at the near and far ends of the paper are equal and opposite, but the nearer one feels the stronger field.</details>

16. **A:** The electric field inside a charged conducting spherical shell is zero. **R:** Charges on a conductor are all at its centre.

<details><summary>Answer</summary>(C) A is true (Gauss’s law: no charge is enclosed by a sphere inside the shell). R is false: the charge sits on the surface of a conductor, not at the centre.</details>

17. **A:** If the net electric flux through a closed surface is zero, the electric field at every point of the surface must be zero. **R:** Flux is proportional to the net charge enclosed.

<details><summary>Answer</summary>(D) A is false: zero net flux only means that the field lines entering equal those leaving, so the net enclosed charge is zero (for example an equal + and − pair inside). R is true.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="electric-charges-and-fields" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Coulomb: F = kq₁q₂/r². Add forces and fields as vectors (superposition).
- E = F/q; point charge E = kQ/r². Force on charge q: F = qE.
- Flux Φ = EA cos θ. Gauss: Φ = q<sub>in</sub>/ε₀ for any closed surface.
- Dipole: p = 2qa; axial 2kp/r³, equatorial kp/r³; torque pE sin θ; energy −pE cos θ.
- Wire: λ/(2πε₀r). Sheet: σ/2ε₀. Shell: kQ/r² outside, 0 inside.
- Setting out: law, formula, numbers with units, answer with direction.

</div>
