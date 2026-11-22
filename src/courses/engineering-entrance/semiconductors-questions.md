---
title: 'Semiconductor electronics: question types and traps'
seoTitle: 'Semiconductor electronics questions for JEE and NEET'
summary: 'Every way entrance exams ask about semiconductors: bands and gaps, doping and carrier concentrations, conductivity, the depletion layer, diode circuits with several diodes, rectifiers and filters, Zener regulators and their limits, LEDs, photodiodes and solar cells, and logic circuits with Boolean algebra, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'An LED gives light of wavelength 620 nm. The band gap of its material is about:'
    choices: ['1 eV', '2 eV', '3 eV', '0.5 eV']
    ans: 1
    why: 'E_g ≈ hc/λ = 1240/620 = 2.0 eV.'
  - q: 'The output of a full-wave rectifier on a 50 Hz supply has a ripple frequency of:'
    choices: ['25 Hz', '50 Hz', '100 Hz', '200 Hz']
    ans: 2
    why: 'Each half cycle gives one output pulse, so there are two pulses per cycle: 100 Hz.'
  - q: 'A NAND gate with both inputs joined together acts as:'
    choices: ['AND', 'OR', 'NOT', 'NOR']
    ans: 2
    why: 'With A = B, the output is NOT(A · A) = NOT A.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electronic devices; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Semiconductor electronics](/learn/courses/engineering-entrance/semiconductors/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Semiconductor questions are of two kinds: physics (bands, carriers, junctions), which needs the right picture, and circuits (diodes, Zeners, gates), which needs a calm check of each diode's direction or each gate's truth table. Never guess a diode's state: assume, solve, then check.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Bands and gaps.</b> Classify by gap; photon needed to cross: λ ≤ 1240/E_g nm. <i>Trap:</i> germanium has the smaller gap than silicon, so it conducts more at room temperature.</div>
<div class="step"><b>2. Doping and carriers.</b> Donor or acceptor from valence (5 or 3); n p = n_i². <i>Trap:</i> thinking doped material is charged.</div>
<div class="step"><b>3. Conductivity.</b> σ = e(n μ_e + p μ_h); intrinsic: σ = e n_i(μ_e + μ_h). <i>Trap:</i> forgetting the hole term in intrinsic material.</div>
<div class="step"><b>4. Temperature effects.</b> n_i ∝ T^(3/2) e^(−E_g/2kT); resistance falls with heating. <i>Trap:</i> using metal behaviour.</div>
<div class="step"><b>5. Depletion layer.</b> Width grows in reverse bias, shrinks in forward; field from n side to p side; barrier about 0.7 V (Si). <i>Trap:</i> putting the depletion layer's positive ions on the p side.</div>
<div class="step"><b>6. Diode circuits.</b> Assume a state for each diode, solve, check the current direction. Diodes in parallel: the one with lower barrier conducts first. <i>Trap:</i> a reverse biased ideal diode carries no current, so the resistor in series with it has no voltage drop.</div>
<div class="step"><b>7. Rectifiers and filters.</b> Average V_m/π and 2V_m/π; ripple frequencies f and 2f; peak inverse voltage V_m (bridge) or 2V_m (centre tap). <i>Trap:</i> using the full secondary voltage for each half of a centre-tapped transformer.</div>
<div class="step"><b>8. Zener regulator.</b> I_R = (V_s − V_z)/R, I_L = V_z/R_L, I_Z = I_R − I_L; limits from I_Z ≥ 0 and P_Z = V_zI_Z ≤ rated power. <i>Trap:</i> the Zener does not regulate if the load would take more than I_R.</div>
<div class="step"><b>9. LED, photodiode, solar cell.</b> Bias, quadrant of the I-V graph, band gap and colour, photocurrent ∝ intensity. <i>Trap:</i> photodiodes are used reverse biased, LEDs forward biased.</div>
<div class="step"><b>10. Logic circuits.</b> Write the expression gate by gate; simplify with De Morgan; check with a truth table. <i>Trap:</i> skipping the bubble (NOT) at a gate's output.</div>
</div>

## Worked examples

**Example 1 (level 3, diode circuit).** A 5 V battery drives two branches in parallel: a 10 Ω resistor in series with a forward biased ideal diode, and a 20 Ω resistor in series with a reverse biased ideal diode. Current from the battery?

*Solution.* Only the forward branch conducts: I = 5/10 = **0.5 A**. The reverse branch carries nothing.

**Example 2 (level 4, Zener limits).** A 10 V Zener (maximum power 0.5 W) with a 200 Ω series resistor on a 20 V supply. What is the smallest load resistance for which it still regulates, and is the Zener safe with no load?

*Solution.* I_R = (20 − 10)/200 = 50 mA. Regulation needs I_L ≤ 50 mA, so R_L ≥ 10/0.05 = **200 Ω**. With no load, I_Z = 50 mA and P = 10 × 0.05 = **0.5 W**: exactly at its limit, so safe only just.

**Example 3 (level 4, carrier concentrations).** Germanium (n_i = 2.4 × 10¹⁹ m⁻³) is doped with 4.8 × 10²¹ m⁻³ acceptors. Find the electron concentration.

*Solution.* p ≈ 4.8 × 10²¹ m⁻³; n = n_i²/p = (5.76 × 10³⁸)/(4.8 × 10²¹) = **1.2 × 10¹⁷ m⁻³**, now the minority carriers.

**Example 4 (level 4, logic circuit).** A and B feed an OR gate, whose output and A feed an AND gate. Simplify.

*Solution.* Y = A · (A + B) = A·A + A·B = A + AB = A(1 + B) = **A**. B has no effect: the circuit just copies A. Check with the truth table: Y matches A in all four rows.

<div class="myth">

**"A hole is a positron moving through the crystal."** A hole is just a missing electron in a bond. It moves because neighbouring electrons hop into it; nothing positive actually travels. The idea simply makes the bookkeeping easier.

</div>

<div class="meaning">
<dl>
<dt>Diode check</dt><dd>assume on or off, solve the circuit, confirm the current flows the allowed way (on) or the voltage is reverse (off)</dd>
<dt>PIV</dt><dd>peak inverse voltage: largest reverse voltage across a diode, V_m for half-wave and bridge, 2V_m for centre tap</dd>
<dt>Physical meaning</dt><dd>A diode is a one-way door for charge, and a Zener is a door that opens backwards at a fixed pressure, which is why it holds a voltage steady.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="semiconductors" data-mode="practice"></div>

<div class="keypoints">

- Ten types: bands, doping, conductivity, temperature, depletion layer, diode circuits, rectifiers, Zeners, optoelectronic diodes, logic.
- n p = n_i²; doped material stays neutral.
- Assume each diode's state, then check.
- Zener: I_Z = I_R − I_L; regulates only while I_L ≤ I_R and P ≤ rating.
- LED band gap = 1240/λ eV.
- A(A + B) = A; De Morgan for NOT inputs.

</div>
