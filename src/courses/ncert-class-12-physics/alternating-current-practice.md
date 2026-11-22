---
title: 'Alternating Current: practice questions'
seoTitle: 'Alternating Current Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Alternating Current: 1, 2, 3 and 5 mark questions, a case-based question and assertion-reason items with worked answers.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A 0.1 H inductor is connected to a 50 Hz supply. Its reactance is about:'
    choices: ['5 Ω', '31 Ω', '314 Ω', '0.5 Ω']
    ans: 1
    why: 'X_L = 2πfL = 2π × 50 × 0.1 ≈ 31.4 Ω.'
  - q: 'The power factor of a series LCR circuit at resonance is:'
    choices: ['0', '0.5', '1', 'infinite']
    ans: 2
    why: 'At resonance X_L = X_C, so Z = R and cos φ = R/Z = 1.'
  - q: 'A transformer has 50 primary turns and 500 secondary turns. It is:'
    choices: ['a step-down transformer', 'a step-up transformer', 'a DC transformer', 'a 1:1 transformer']
    ans: 1
    why: 'V_s/V_p = N_s/N_p = 10, so the secondary voltage is ten times larger: step-up.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 7.** Read the chapter lesson, [Alternating Current](/learn/courses/ncert-class-12-physics/alternating-current/), first. Try each question on paper before you open the answer.

<div class="bigidea">Almost every AC question needs four things: reactances X_L = ωL and X_C = 1/ωC, the impedance triangle Z² = R² + (X_L − X_C)², the power P = V_rms I_rms cos φ, and the transformer ratio. Draw the phasor triangle and the rest is arithmetic.</div>

## How to set out a numerical

1. Write what is given in SI units (mH to H, µF to F) and what is asked.
2. Find ω = 2πf first, then X_L and X_C.
3. Find Z, then I = V/Z, then φ or cos φ and the power.
4. State whether the current leads or lags, and check units.

## 1-mark questions

1. What is the rms value of an AC whose peak value is 10 A?
<details><summary>Answer</summary>I<sub>rms</sub> = I₀/√2 = 10/1.414 ≈ 7.07 A.</details>

2. State the phase relation between voltage and current in a pure capacitor.
<details><summary>Answer</summary>The current leads the voltage by 90° (π/2).</details>

3. What is the average power used by an ideal inductor in an AC circuit?
<details><summary>Answer</summary>Zero, because the current and voltage are 90° apart, so cos φ = 0.</details>

4. Name the loss in a transformer that is reduced by using a laminated core.
<details><summary>Answer</summary>Eddy-current loss.</details>

## 2-mark and 3-mark questions

5. Why does a capacitor block DC but allow AC to pass? *(2 marks)*
<details><summary>Answer</summary>X<sub>C</sub> = 1/(2πfC). For DC, f = 0, so X<sub>C</sub> is infinite: after the capacitor charges no current flows. For AC the charge keeps being reversed, so a current flows in the wires and X<sub>C</sub> is finite.</details>

6. Define the quality factor Q of a series resonant circuit and say what a high Q means. *(2 marks)*
<details><summary>Answer</summary>Q = ω₀L/R = f₀/Δf, the ratio of the resonant frequency to the bandwidth. A high Q means a sharp, narrow resonance: the circuit picks out one frequency and rejects its neighbours.</details>

7. A 100 Ω resistor and a 0.3 H coil are in series across a 230 V, 50 Hz supply. Find the rms current. *(3 marks)*
<details><summary>Answer</summary>

X<sub>L</sub> = 2π × 50 × 0.3 = 94.2 Ω. Z = √(100² + 94.2²) = 137.4 Ω. I = V/Z = 230/137.4 ≈ 1.67 A.

</details>

8. A transformer steps 230 V down to 12 V and supplies 5 A to a lamp circuit. Assuming 100 % efficiency, find the primary current. *(3 marks)*
<details><summary>Answer</summary>V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub> gives I<sub>p</sub> = 12 × 5/230 = 0.26 A.</details>

9. Why do power companies transmit electricity at high voltage and low current? *(3 marks)*
<details><summary>Answer</summary>The power wasted in the line is I²R. For the same power P = VI delivered, raising V lowers I in proportion, so the loss falls as 1/V². A transformer can step the voltage up (and down again) only with AC.</details>

## 5-mark questions (model answers)

10. Derive the impedance of a series LCR circuit using a phasor diagram, and write the phase angle. *(5 marks)*
<details><summary>Answer</summary>

Take the current I as reference (it is the same in all three). V<sub>R</sub> = IR is along I, V<sub>L</sub> = IX<sub>L</sub> leads I by 90°, V<sub>C</sub> = IX<sub>C</sub> lags I by 90°. V<sub>L</sub> and V<sub>C</sub> are opposite, so their resultant is |V<sub>L</sub> − V<sub>C</sub>|. The resultant V of V<sub>R</sub> and this has

`$V^2 = V_R^2 + (V_L - V_C)^2 = I^2[R^2 + (X_L - X_C)^2]$`

so `$Z = V/I = \sqrt{R^2 + (X_L - X_C)^2}$` and `$\tan\varphi = (X_L - X_C)/R$`, where φ is the angle by which V leads I.

</details>

11. A coil of inductance 0.5 H and negligible resistance is connected to a source `$v = 200\sqrt2\sin(100\pi t)$` V. Write down the expression for the current and find the average power. *(5 marks)*
<details><summary>Answer</summary>

ω = 100π rad/s. X<sub>L</sub> = ωL = 100π × 0.5 = 157 Ω. I₀ = V₀/X<sub>L</sub> = 200√2/157 = 1.80 A. The current lags by 90°:

`$i = 1.8\sin(100\pi t - \pi/2)$` A.

Average power = V<sub>rms</sub>I<sub>rms</sub> cos 90° = 0.

</details>

12. Explain, with a diagram of the core and windings, the working of a transformer and why its efficiency is not 100 %. *(5 marks)*
<details><summary>Answer</summary>

Two coils are wound on a laminated soft-iron core. AC in the primary (N<sub>p</sub> turns) produces an alternating flux Φ in the core; the same Φ passes through the secondary (N<sub>s</sub> turns). By Faraday’s law each turn has emf −dΦ/dt, so V<sub>s</sub>/V<sub>p</sub> = N<sub>s</sub>/N<sub>p</sub>. For an ideal transformer V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>. Real losses: (1) copper loss I²R in the windings, reduced by thick wire; (2) eddy currents in the core, reduced by lamination; (3) hysteresis loss, reduced by soft iron; (4) flux leakage, reduced by winding the coils over each other.

</details>

## Case-based question

13. **A radio tuner.** A series circuit is used to tune a radio. It contains a coil of inductance 200 µH, a variable capacitor and a resistance of 10 Ω (mostly the coil’s wire). The aerial feeds it a small voltage from many stations.

(a) The capacitor is set to 200 pF. At what frequency does the circuit resonate?
<details><summary>Answer</summary>

`$f_0 = \frac{1}{2\pi\sqrt{LC}} = \frac{1}{2\pi\sqrt{200\times10^{-6}\times200\times10^{-12}}}$` = 1/(2π × 2 × 10⁻⁷) ≈ 0.80 MHz.

</details>

(b) Find the quality factor.
<details><summary>Answer</summary>

ω₀ = 2π × 0.796 × 10⁶ = 5.0 × 10⁶ rad/s. Q = ω₀L/R = 5.0 × 10⁶ × 200 × 10⁻⁶/10 = 100.

</details>

(c) Find the bandwidth.
<details><summary>Answer</summary>Δf = f₀/Q = 0.80 MHz/100 = 8 kHz.</details>

(d) Why is a higher Q better for a tuner, and what happens if R is increased?
<details><summary>Answer</summary>A high Q gives a narrow band, so only the wanted station gets a strong current and neighbouring stations are rejected. If R is increased, Q falls, the peak is lower and wider, and stations overlap.</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

14. **Assertion:** A pure inductor connected to an AC source uses no power on average. **Reason:** The current in a pure inductor lags the voltage by 90°.
<details><summary>Answer</summary>(A). Both true. With φ = 90° the average of vi over a cycle is zero, since cos 90° = 0.</details>

15. **Assertion:** The impedance of a series LCR circuit is least at resonance. **Reason:** At resonance the inductive and capacitive reactances are equal and cancel.
<details><summary>Answer</summary>(A). Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²) is smallest, equal to R, when X<sub>L</sub> = X<sub>C</sub>.</details>

16. **Assertion:** A transformer can step up an AC voltage but not a DC voltage. **Reason:** A transformer works on the principle of mutual induction, which needs a changing flux.
<details><summary>Answer</summary>(A). DC gives a constant flux, so no emf is induced in the secondary.</details>

<div class="problem" data-problem="c12p-ac-impedance"></div>

<div class="problem" data-problem="c12p-ac-transformer"></div>

## More questions from the bank

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="alternating-current" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- X_L = 2πfL (current lags 90°); X_C = 1/2πfC (current leads 90°); Z² = R² + (X_L − X_C)².
- Resonance: f₀ = 1/(2π√LC), Z = R, cos φ = 1; Q = ω₀L/R = f₀/Δf.
- P = V_rms I_rms cos φ with cos φ = R/Z; pure L or C use no power.
- Transformer: V_s/V_p = N_s/N_p = I_p/I_s; losses are copper, eddy, hysteresis, leakage.

</div>
