---
title: 'Nuclei: practice questions'
seoTitle: 'Nuclei Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Nuclei: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'The half-life of a radioactive substance is 20 minutes. The time taken for 87.5 % of it to decay is:'
    choices: ['40 minutes', '60 minutes', '80 minutes', '100 minutes']
    ans: 1
    why: '87.5 % decayed means 12.5 % = 1/8 is left, which is 3 half-lives: 3 × 20 = 60 minutes.'
  - q: 'In a nuclear reactor, the control rods are made of a material that:'
    choices: ['slows down neutrons', 'absorbs neutrons', 'emits neutrons', 'reflects gamma rays']
    ans: 1
    why: 'Cadmium or boron rods absorb neutrons, lowering the multiplication factor. The moderator is the material that slows neutrons down.'
  - q: 'The binding energy per nucleon is greatest for:'
    choices: ['hydrogen-2', 'helium-4', 'iron-56', 'uranium-238']
    ans: 2
    why: 'The binding energy curve peaks near iron-56 and nickel-62, at about 8.8 MeV per nucleon.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 13.** Read the chapter lesson, [Nuclei](/learn/courses/ncert-class-12-physics/nuclei/), first. Try each question on paper before opening the answer. Board marks go for the law, the formula, the substitution with units and the final answer.

<div class="bigidea">Most nuclei problems come down to three habits: balance A and Z on both sides of every reaction, turn a mass defect into energy with 931.5 MeV per u, and for decay count the number of half-lives t/T before you use (½)<sup>n</sup>.</div>

## How to set out a numerical

1. Write the reaction or the law in symbols (N = N₀(½)<sup>t/T</sup>, E = Δm × 931.5 MeV, R = 1.2 A<sup>1/3</sup> fm).
2. Substitute with units. Do not mix u and kg, or MeV and joule.
3. Work out the number of half-lives t/T first when the question is about decay.
4. Give the answer with a unit and check it is sensible (a binding energy per nucleon above 9 MeV, or a fraction left above 1, is wrong).

<div class="problem" data-problem="c12p-nuc-binding"></div>

<div class="problem" data-problem="c12p-nuc-halflife"></div>

## 1-mark questions

1. What are isobars? Give one pair.

<details><summary>Answer</summary>Nuclides with the same mass number but different atomic numbers, for example ¹⁴C and ¹⁴N.</details>

2. What is the SI unit of activity?

<details><summary>Answer</summary>The becquerel (Bq), one decay per second.</details>

3. Name the particle emitted along with an electron in β⁻ decay.

<details><summary>Answer</summary>An antineutrino.</details>

4. Which nuclide has the highest binding energy per nucleon in the neighbourhood of A = 56?

<details><summary>Answer</summary>Iron-56 (and nickel-62), at about 8.8 MeV per nucleon.</details>

## 2- and 3-mark questions

5. (2) How does the density of a nucleus depend on its mass number? Give a reason.

<details><summary>Answer</summary>It does not depend on it. R = R₀A<sup>1/3</sup>, so the volume is proportional to A, and the mass is also proportional to A. The ratio, about 2.3 × 10¹⁷ kg/m³, is the same for all nuclei.</details>

6. (2) Write down any two properties of the nuclear force.

<details><summary>Answer</summary>(i) It is short-ranged (a few fm) and very strong at that range. (ii) It is the same between p-p, n-n and p-n (charge independent). (Also: repulsive below about 0.8 fm.)</details>

7. (2) The half-life of a sample is 10 hours. What fraction remains after 30 hours?

<details><summary>Answer</summary>

30 h is 3 half-lives, so the fraction is `$(1/2)^3 = 1/8$` (12.5 %).

</details>

8. (3) Find the binding energy per nucleon of an alpha particle. The masses are: ⁴He atom 4.002603 u, hydrogen atom 1.007825 u, neutron 1.008665 u (1 u = 931.5 MeV).

<details><summary>Answer</summary>

`$\Delta m = 2(1.007825) + 2(1.008665) - 4.002603 = 0.030377$` u.

`$E_b = 0.030377 \times 931.5 = 28.3$` MeV, so the energy per nucleon is `$28.3/4 = 7.07$` MeV.

</details>

9. (3) ²³⁸₉₂U decays through 8 α particles and 6 β⁻ particles in a long chain. What is the final nucleus?

<details><summary>Answer</summary>

`$A = 238 - 8\times4 = 206$` and `$Z = 92 - 8\times2 + 6 = 82$`. The final nucleus is ²⁰⁶₈₂Pb, lead-206 (stable).

</details>

10. (3) What is the multiplication factor of a nuclear reactor? What values of k give a subcritical, a critical and a supercritical reactor?

<details><summary>Answer</summary>It is the average number of neutrons from each fission that go on to cause another fission. k < 1: subcritical (the chain dies out). k = 1: critical (steady, controlled power). k > 1: supercritical (the rate increases rapidly).</details>

## 5-mark questions (model answers)

11. (5) State the law of radioactive decay and derive N = N₀e^(−λt). Define half-life and show that T = 0.693/λ.

<details><summary>Answer</summary>

**Law:** the number of nuclei that decay per second is proportional to the number N of undecayed nuclei present: `$-dN/dt = \lambda N$`, where λ is the decay constant.

Separate the variables: `$\dfrac{dN}{N} = -\lambda\,dt$`. Integrate from N₀ at t = 0 to N at t: `$\ln\dfrac{N}{N_0} = -\lambda t$`, so `$N = N_0e^{-\lambda t}$`.

**Half-life** T is the time in which half of the nuclei decay. Put N = N₀/2: `$\tfrac12 = e^{-\lambda T}$`, so `$\lambda T = \ln 2 = 0.693$` and `$T = 0.693/\lambda$`.

</details>

12. (5) Explain how the binding energy curve shows that energy can be released both by fission of heavy nuclei and by fusion of light nuclei. Mention the approximate values.

<details><summary>Answer</summary>

The curve of binding energy per nucleon against A rises steeply for light nuclei, peaks at about 8.8 MeV near A = 56 (iron), and then falls slowly to about 7.6 MeV for uranium.

**Fusion:** two light nuclei (for example ²H, 1.1 MeV per nucleon) join to a heavier one (⁴He, 7.1 MeV per nucleon). The product is more tightly bound, so the difference in total binding energy is released: ²H + ³H → ⁴He + n + 17.6 MeV.

**Fission:** a heavy nucleus (uranium, 7.6 MeV per nucleon) splits into two middle-sized nuclei (about 8.5 MeV per nucleon). The pieces are more tightly bound, and about 0.9 MeV per nucleon, nearly 200 MeV in all, is released.

Iron is at the top of the curve: neither fusion nor fission of iron releases energy.

</details>

13. (5) A sample contains 2 µg of cobalt-60 (half-life 5.27 years). Find (a) the number of nuclei, (b) the decay constant and (c) the activity. (N<sub>A</sub> = 6.02 × 10²³ mol⁻¹, 1 year = 3.16 × 10⁷ s.)

<details><summary>Answer</summary>

(a) `$N = \dfrac{2\times10^{-6}}{60}\times6.02\times10^{23} = 2.0\times10^{16}$`.

(b) `$T = 5.27\times3.16\times10^7 = 1.67\times10^8$` s, so `$\lambda = 0.693/T = 4.2\times10^{-9}\ \text{s}^{-1}$`.

(c) `$R = \lambda N = 4.2\times10^{-9}\times2.0\times10^{16} = 8.3\times10^{7}$` Bq, about 83 MBq (2.3 mCi).

</details>

## Case-based question

14. **Dating an old beam.** An archaeologist at a temple dig finds a wooden beam. A living tree has a certain activity per gram of carbon because of the radioactive carbon-14 (half-life 5730 years) in the air. The beam’s activity per gram is found to be one eighth of that of living wood. The archaeologist also notes that the tree stopped taking in carbon when it was cut.

(a) (1) Why does the carbon-14 activity of a dead tree fall?

(b) (1) How many half-lives have passed?

(c) (1) Find the age of the beam.

(d) (1) Would carbon-14 dating be suitable for a rock 100 million years old? Why or why not?

<details><summary>Answer</summary>

(a) After death no new ¹⁴C is taken in, while the existing ¹⁴C keeps decaying with its half-life, so the number of ¹⁴C nuclei (and the activity) falls.

(b) 1/8 = (1/2)³: three half-lives.

(c) Age = 3 × 5730 = 17,190 years.

(d) No. After 100 million years there would be (½)<sup>17,000</sup> of the carbon-14 left: nothing measurable. Isotopes with a half-life of millions or billions of years (uranium-238, potassium-40) are used for rocks.

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** The mass of a nucleus is less than the sum of the masses of its nucleons. **R:** The difference in mass is released as the binding energy when the nucleus forms.

<details><summary>Answer</summary>(A) Both true and R explains A: Δm c² is the energy given out as the nucleons bind.</details>

16. **A:** Two isotopes of an element have the same chemical properties. **R:** Isotopes have the same number of neutrons.

<details><summary>Answer</summary>(C) A is true: chemistry depends on the electrons (same Z). R is false: isotopes have the same number of protons but different numbers of neutrons.</details>

17. **A:** The half-life of a radioactive element does not change when it is heated or compressed. **R:** Radioactive decay is a spontaneous nuclear process that is independent of outside conditions.

<details><summary>Answer</summary>(A) Both true and R explains A: the decay is governed by the nucleus alone, so the decay constant λ and the half-life 0.693/λ are fixed.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="nuclei" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- R = 1.2A<sup>1/3</sup> fm; density about 2.3 × 10¹⁷ kg/m³, the same for all nuclei.
- Δm = Zm<sub>p</sub> + (A − Z)m<sub>n</sub> − M; E<sub>b</sub> = Δm × 931.5 MeV; the curve peaks near iron (8.8 MeV per nucleon).
- α: A − 4, Z − 2. β⁻: Z + 1. β⁺: Z − 1. γ: A and Z unchanged.
- N = N₀e^(−λt) = N₀(½)<sup>t/T</sup>; T = 0.693/λ; τ = 1/λ; activity R = λN.
- Fission: about 200 MeV per U-235 nucleus, chain reaction with k = 1 in a reactor. Fusion: needs very high temperature to overcome the Coulomb barrier.

</div>
