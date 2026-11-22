---
title: 'Semiconductor Electronics: practice questions'
seoTitle: 'Semiconductor Electronics Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Semiconductor Electronics: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'In forward bias, the depletion layer of a p-n junction:'
    choices: ['widens', 'narrows', 'stays the same', 'disappears completely at any voltage']
    ans: 1
    why: 'The applied voltage opposes the built-in field and pushes the majority carriers toward the junction, so the layer narrows and the barrier is lowered.'
  - q: 'The peak voltage across the secondary of a transformer feeding a half-wave rectifier is 20 V. The average output is about:'
    choices: ['6.4 V', '12.7 V', '10 V', '14.1 V']
    ans: 0
    why: 'V_dc = V_m/π = 20/3.14 = 6.4 V. A full-wave rectifier would give 2V_m/π = 12.7 V.'
  - q: 'Which pair makes p-type silicon when added as an impurity?'
    choices: ['arsenic and phosphorus', 'boron and indium', 'germanium and carbon', 'antimony and boron']
    ans: 1
    why: 'Boron and indium are trivalent acceptors. Arsenic, phosphorus and antimony are pentavalent donors (n-type). Germanium and carbon are also tetravalent, like silicon.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 14.** Read the chapter lesson, [Semiconductor Electronics](/learn/courses/ncert-class-12-physics/semiconductor-electronics/), first. Try each question on paper before opening the answer. Board marks go for the definition, a labelled diagram where asked, the formula, the substitution with units and the final answer.

<div class="bigidea">Most questions come down to three things: which carrier is the majority carrier and why, which way the battery makes the junction barrier go (forward lowers it, reverse raises it), and for rectifiers the average V<sub>m</sub>/π or 2V<sub>m</sub>/π, with V<sub>m</sub> = √2 × rms.</div>

## How to set out an answer

1. For a definition, give the idea in one sentence and, where possible, an example (n-type: Si doped with P).
2. For a diode circuit, decide first if the diode is forward or reverse biased (is the p side nearer the positive terminal?). Replace a forward diode by its drop (0.7 V for Si) and a reverse one by an open switch.
3. For a rectifier, draw the circuit and the input and output waveforms with their frequencies.
4. Give numbers with units, and state the frequency of the ripple when it is asked.

<div class="problem" data-problem="c12p-semi-current"></div>

<div class="problem" data-problem="c12p-semi-vdc"></div>

## 1-mark questions

1. What is the order of the energy gap of an insulator?

<details><summary>Answer</summary>More than about 3 eV (diamond is about 5.5 eV).</details>

2. Name the majority carriers in a p-type semiconductor.

<details><summary>Answer</summary>Holes.</details>

3. Write the relation between the electron and hole densities in a doped semiconductor.

<details><summary>Answer</summary>n<sub>e</sub> n<sub>h</sub> = n<sub>i</sub>² (the law of mass action).</details>

4. What happens to the width of the depletion layer when the diode is reverse biased?

<details><summary>Answer</summary>It increases.</details>

## 2- and 3-mark questions

5. (2) Why does the resistance of a semiconductor decrease when it is heated, though a metal’s increases?

<details><summary>Answer</summary>Heating breaks more covalent bonds in a semiconductor, so the numbers of electrons and holes rise rapidly and the conductivity increases. In a metal the number of free electrons hardly changes and the greater ion vibrations cause more collisions, so the resistance rises.</details>

6. (2) What is meant by doping? Name a donor and an acceptor impurity.

<details><summary>Answer</summary>Doping is deliberately adding a tiny amount of a chosen impurity (about 1 atom in 10⁷ to 10⁸) to a pure semiconductor to raise its conductivity. Donor: arsenic or phosphorus (five valence electrons). Acceptor: boron or indium (three valence electrons).</details>

7. (2) A semiconductor has a band gap of 1.1 eV. Find the longest wavelength of light that can create an electron-hole pair in it. (hc = 1240 eV nm)

<details><summary>Answer</summary>

`$\lambda = hc/E_g = 1240/1.1 = 1127$` nm, in the infrared. Photons of longer wavelength have too little energy.

</details>

8. (3) Explain with a diagram how the depletion layer and the barrier potential are formed in a p-n junction.

<details><summary>Answer</summary>

Holes diffuse from the p side to the n side and electrons the other way, because of the difference in concentrations. On crossing, they recombine near the junction. This leaves immobile negative acceptor ions on the p side and positive donor ions on the n side: the depletion layer, with almost no free carriers. The ions create an electric field from n to p, which opposes further diffusion (it causes a drift current the other way). When diffusion and drift currents are equal, equilibrium is reached, and there is a potential difference, the barrier potential V₀ (about 0.7 V for Si, 0.3 V for Ge), across the layer, with the p side at the lower potential.

</details>

9. (3) A silicon diode (drop 0.7 V) is connected in series with a 470 Ω resistor and a 9 V battery in forward bias. Find the current and the power dissipated in the resistor.

<details><summary>Answer</summary>

Voltage across R = 9 − 0.7 = 8.3 V. `$I = 8.3/470 = 17.7$` mA. Power in the resistor `$P = I^2R = (0.0177)^2\times470 = 0.147$` W, about 0.15 W.

</details>

10. (3) Draw the circuit diagram of a half-wave rectifier and its input and output waveforms. What is the ripple frequency if the input is 50 Hz?

<details><summary>Answer</summary>The circuit is an ac source (transformer secondary), a diode (anode to the source) and a load resistor R<sub>L</sub> in series. Input: a sine wave. Output across R<sub>L</sub>: only the positive half-cycles, the negative ones are blocked (zero). The pulses occur once per input cycle, so the ripple frequency is 50 Hz.</details>

## 5-mark questions (model answers)

11. (5) Explain with a diagram the working of a full-wave rectifier using two diodes and a centre-tapped transformer. Give the output frequency and the average output voltage.

<details><summary>Answer</summary>

The centre-tapped secondary gives two equal ac voltages, opposite in phase at the two ends A and B with respect to the centre tap C. Diodes D₁ and D₂ have their anodes at A and B, and their cathodes joined together to one end of the load R<sub>L</sub>; the other end of R<sub>L</sub> goes to the centre tap C.

When A is positive, D₁ is forward biased and conducts, and D₂ (with B negative) is reverse biased. Current goes from A through D₁ and through R<sub>L</sub> to C. In the next half-cycle B is positive, D₂ conducts and D₁ does not, and the current goes through R<sub>L</sub> from the same end to C in the **same direction**. So the current in the load is always one way.

There are two pulses per input cycle, so the output frequency is twice the input frequency (100 Hz for 50 Hz mains). The average output is `$V_{dc} = 2V_m/\pi \approx 0.636\,V_m$`.

</details>

12. (5) Describe what happens to the depletion layer, the barrier and the current when a p-n junction is (a) forward biased and (b) reverse biased. Draw the V–I characteristic.

<details><summary>Answer</summary>

(a) **Forward bias** (p to positive): the applied voltage opposes the built-in field, so the barrier falls from V₀ to V₀ − V and the depletion layer becomes narrower. More majority carriers cross, and the current is very small below the knee (about 0.7 V in silicon) and then rises rapidly and almost exponentially.

(b) **Reverse bias** (p to negative): the applied voltage adds to the barrier, V₀ + V, and the depletion layer becomes wider. Majority carriers cannot cross. Only a tiny current of minority carriers flows (microamperes or less), nearly independent of the voltage until the breakdown voltage.

The graph: in the first quadrant a curve starting almost flat from the origin, bending upward at the knee and then climbing steeply; in the third quadrant a nearly horizontal line at a tiny current, which turns sharply down at the breakdown voltage. The graph is not a straight line, so the diode does not obey Ohm’s law.

</details>

13. (5) The intrinsic carrier density of silicon is 1.5 × 10¹⁶ m⁻³. It is doped with arsenic atoms at 5 × 10²² m⁻³. Find the electron and hole densities and say whether it is n-type or p-type. Why does the hole density fall on doping?

<details><summary>Answer</summary>

Arsenic is pentavalent, a donor, so the crystal is n-type. Each donor gives one free electron, so `$n_e \approx N_d = 5\times10^{22}$` m⁻³.

By the law of mass action `$n_en_h = n_i^2$`, so `$n_h = \dfrac{(1.5\times10^{16})^2}{5\times10^{22}} = 4.5\times10^{9}$` m⁻³.

The hole density falls (from 1.5 × 10¹⁶ to 4.5 × 10⁹) because the many extra electrons recombine with the holes: the product n<sub>e</sub>n<sub>h</sub> must stay equal to n<sub>i</sub>².

</details>

## Case-based question

14. **The phone charger.** Meera’s phone charger takes 230 V, 50 Hz ac from the wall and gives 5 V dc. Inside is a transformer that reduces the voltage, a bridge of four silicon diodes, and a capacitor across the output. Meera measures the voltage across the secondary of the transformer as 6.0 V rms. She notices that the voltage is steady only when the capacitor is connected.

(a) (1) What is the peak voltage across the secondary?

(b) (1) How many diodes conduct in each half cycle of a bridge rectifier?

(c) (1) What is the frequency of the ripple in the output?

(d) (1) What does the capacitor do?

<details><summary>Answer</summary>

(a) `$V_m = \sqrt2\times6.0 = 8.5$` V.

(b) Two: D1 and D4 in one half-cycle, D2 and D3 in the other.

(c) 100 Hz, twice the mains frequency, since both half-cycles give a pulse.

(d) It charges to the peak when the diodes conduct and supplies the load in between, so the output voltage does not fall to zero between pulses: it smooths the ripple. (The output is about 8.5 − 1.4 = 7.1 V at the peak, because two diodes in the path each drop about 0.7 V; a regulator then brings it to a steady 5 V.)

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** An n-type semiconductor is electrically neutral. **R:** The free electrons are balanced by the positive donor ions in the crystal.

<details><summary>Answer</summary>(A) Both true and R explains A.</details>

16. **A:** A p-n junction with no applied voltage carries no net current. **R:** The diffusion of majority carriers across the junction is balanced by the drift of minority carriers.

<details><summary>Answer</summary>(A) Both true and R explains A: at equilibrium the diffusion current and the drift current are equal and opposite.</details>

17. **A:** The output of a full-wave rectifier is steady dc, with no ripple. **R:** Both halves of the input cycle are used.

<details><summary>Answer</summary>(D) A is false: the output is still pulsating, though at twice the frequency, and needs a filter. R is true, and is the reason the pulses are closer together and the average is double that of half-wave.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="semiconductor-electronics" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Bands: metal overlap, semiconductor gap about 1 eV, insulator above about 3 eV. n-type: donors, electrons majority; p-type: acceptors, holes majority; n<sub>e</sub>n<sub>h</sub> = n<sub>i</sub>².
- Junction: diffusion, recombination, depletion layer, field from n to p, barrier 0.7 V (Si), 0.3 V (Ge).
- Forward bias lowers the barrier and conducts above the knee; reverse bias raises it and only a tiny leakage flows.
- Half-wave: V<sub>dc</sub> = V<sub>m</sub>/π, 50 Hz ripple. Full-wave: V<sub>dc</sub> = 2V<sub>m</sub>/π, 100 Hz. A capacitor smooths the output.

</div>
