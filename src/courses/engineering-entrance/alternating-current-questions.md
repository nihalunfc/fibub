---
title: 'Alternating current: question types and traps'
seoTitle: 'Alternating current questions for JEE and NEET'
summary: 'Every way entrance exams ask about AC: rms and average values of different waves, reactance and phase, series LCR with voltmeter readings, resonance, Q factor and bandwidth, power factor and its correction, lamps with chokes, LC oscillations and transformers with transmission losses, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'In a series LCR circuit, voltmeters across R, L and C read 30 V, 90 V and 50 V. The supply voltage is:'
    choices: ['170 V', '50 V', '70 V', '110 V']
    ans: 1
    why: 'V = √(V_R² + (V_L − V_C)²) = √(900 + 1600) = 50 V. The readings do not add as plain numbers.'
  - q: 'The frequency of the supply is doubled. The reactance of a capacitor:'
    choices: ['doubles', 'halves', 'stays the same', 'becomes four times']
    ans: 1
    why: 'X_C = 1/(2πfC) is inversely proportional to f.'
  - q: 'In an LC circuit the energy is shared equally between the capacitor and the inductor when the charge is:'
    choices: ['Q₀/2', 'Q₀/√2', 'zero', 'Q₀']
    ans: 1
    why: 'Capacitor energy q²/2C = half of Q₀²/2C when q = Q₀/√2.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Alternating currents; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Alternating current](/learn/courses/engineering-entrance/alternating-current/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Draw the phasor triangle before you calculate. Resistance along the bottom, net reactance up the side, impedance along the slope: the voltages, the phase angle and the power factor are all read off that one triangle.</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. rms, peak and average.</b> Sine: V₀/√2; square: V₀; triangle: V₀/√3; half-wave: V₀/2. For mixed signals, rms = √(mean of v²). <i>Trap:</i> rms of DC + AC is √(V_dc² + V_ac,rms²), not their sum.</div>
<div class="step"><b>2. Reactance and frequency.</b> X_L ∝ f, X_C ∝ 1/f; DC: inductor a wire, capacitor a gap. <i>Trap:</i> a capacitor on DC carries no steady current at all.</div>
<div class="step"><b>3. Phase and instantaneous values.</b> Read φ from i = I₀ sin(ωt − φ); lead or lag. Plug t into the equations for instantaneous values. <i>Trap:</i> radians versus degrees in ωt.</div>
<div class="step"><b>4. Series circuit with meters.</b> V = √(V_R² + (V_L − V_C)²); readings are rms. <i>Trap:</i> adding readings.</div>
<div class="step"><b>5. Resonance.</b> f₀ = 1/2π√(LC); I = V/R; V_L = V_C = QV. Changing C or L to reach resonance. <i>Trap:</i> R changes the height of the peak, not its position.</div>
<div class="step"><b>6. Q factor and bandwidth.</b> Q = ω₀L/R = ω₀/Δω; half-power points ω₀ ± R/2L. <i>Trap:</i> the bandwidth R/L does not depend on C.</div>
<div class="step"><b>7. Power and power factor.</b> P = V I cos φ = I²R; wattless current I sin φ; adding C to correct cos φ: X_C chosen to cancel X_L. <i>Trap:</i> apparent power VI is in volt-amperes, not watts.</div>
<div class="step"><b>8. Lamp on mains with L, C or R.</b> Find the needed impedance from the lamp's current; the extra element supplies the rest at right angles: X = √(Z² − R²). <i>Trap:</i> subtracting voltages directly for an inductor or capacitor.</div>
<div class="step"><b>9. LC circuits and transformers.</b> Energy swap, q-I relation I = ω√(Q₀² − q²); transformer ratios, efficiency, line losses. <i>Trap:</i> transformers do not work on steady DC.</div>
</div>

## Worked examples

**Example 1 (level 3, rms of a mixed wave).** A current is i = 3 + 4 sin ωt (A). Find its rms value.

*Solution.* The mean of i² = 9 + 16 × ½ + (cross term averages to zero) = 17. **I_rms = √17 ≈ 4.12 A**. *Trap:* 3 + 4/√2 = 5.83 A is wrong.

**Example 2 (level 4, lamp with a choke).** A 100 V, 50 W lamp must run from 200 V, 50 Hz mains, using a pure inductor in series. Find L.

*Solution.* Lamp current = 50/100 = 0.5 A; lamp resistance = 200 Ω. Total impedance needed = 200/0.5 = 400 Ω. `$X_L = \sqrt{400^2 - 200^2} = 346$` Ω. L = 346/(2π × 50) ≈ **1.1 H**. The inductor drops √(200² − 100²) ≈ 173 V, not 100 V, because its voltage is at 90° to the lamp's.

**Example 3 (level 4, power factor correction).** A motor draws 10 A at 230 V, 50 Hz, with power factor 0.8 (lagging). What capacitor in parallel makes the power factor 1?

*Solution.* Useful current = 10 × 0.8 = 8 A; wattless (lagging) current = 10 × 0.6 = 6 A. The capacitor must draw 6 A leading: `$X_C = 230/6 = 38.3$` Ω, C = 1/(2π × 50 × 38.3) ≈ **83 µF**. The line current drops from 10 A to 8 A.

**Example 4 (level 5, LC current at a given charge).** An LC circuit with L = 10 mH, C = 1 µF starts with Q₀ = 20 µC. Find the current when q = 12 µC.

*Solution.* ω = 1/√(10⁻² × 10⁻⁶) = 10⁴ rad/s. Energy conservation: `$I = \omega\sqrt{Q_0^2 - q^2} = 10^4\sqrt{400 - 144}\times10^{-6}$` = 10⁴ × 16 × 10⁻⁶ = **0.16 A**. Same form as v = ω√(A² − x²) in SHM.

<div class="myth">

**"At resonance the inductor and capacitor have no voltage across them."** Their voltages are large (Q times the supply) but equal and opposite, so they cancel in the sum. A meter across either one alone shows that big voltage.

</div>

<div class="meaning">
<dl>
<dt>Impedance triangle</dt><dd>base R, height X_L − X_C, slope Z; cos φ = R/Z</dd>
<dt>LC ↔ spring</dt><dd>q ↔ x, I ↔ v, L ↔ m, 1/C ↔ k, ω = 1/√(LC)</dd>
<dt>Physical meaning</dt><dd>In AC, two voltages can be large and still cancel, because they peak at different moments; only the phasor sum must match the supply.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="alternating-current" data-mode="practice"></div>

<div class="keypoints">

- Nine types: rms values, reactance, phase, meter readings, resonance, Q and bandwidth, power factor, lamps with L or C, LC and transformers.
- rms of DC + AC: √(V_dc² + V_rms²).
- Series element for a lamp: X = √(Z² − R²).
- Power factor correction: capacitor current equals the lagging wattless current.
- LC: I = ω√(Q₀² − q²); equal energies at q = Q₀/√2.
- Bandwidth R/L; Q = ω₀L/R; V_L = V_C = QV at resonance.

</div>
