---
title: 'Current electricity and circuits: question types and traps'
seoTitle: 'Current electricity questions for JEE and NEET'
summary: 'Every way entrance exams ask about DC circuits: drift velocity, resistance of stretched and shaped wires, temperature effects, networks with symmetry and ladders, cells and maximum power, Kirchhoff loops, bridges and potentiometers, meter conversion and loading, and heating and bulbs, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'In a potentiometer, the balance length for a cell is 60 cm on open circuit and 50 cm when a 5 Ω resistor is joined across the cell. The internal resistance is:'
    choices: ['1 Ω', '0.5 Ω', '2 Ω', '6 Ω']
    ans: 0
    why: 'r = R(l₁/l₂ − 1) = 5 × (60/50 − 1) = 1 Ω.'
  - q: 'A voltmeter of resistance 1 kΩ is placed across a 1 kΩ resistor in series with another 1 kΩ resistor on a 12 V supply. It reads:'
    choices: ['6 V', '4 V', '8 V', '12 V']
    ans: 1
    why: 'The meter in parallel with 1 kΩ gives 500 Ω. The divider gives 12 × 500/1500 = 4 V, not the ideal 6 V. This is voltmeter loading.'
  - q: 'A copper wire''s resistance at 0 °C is 10 Ω and α = 0.004 per °C. At 50 °C it is about:'
    choices: ['10.2 Ω', '12 Ω', '8 Ω', '14 Ω']
    ans: 1
    why: 'R = 10(1 + 0.004 × 50) = 10 × 1.2 = 12 Ω.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Current electricity; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 28 minutes.** Read the lesson [Current electricity and circuits](/learn/courses/engineering-entrance/current-electricity/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Circuit questions reward a calm first minute: redraw the circuit neatly, mark equal-potential points, and simplify before writing any equation. Most "hard" networks turn out to be series and parallel in disguise.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Current, drift and mobility.</b> I = neAv_d; for the same current, v_d ∝ 1/A. <i>Trap:</i> thinking v_d is larger in a thicker wire, or that it depends on length for a fixed current.</div>
<div class="step"><b>2. Resistance of shaped wires.</b> Stretching n times gives n²R; a ring cut at angle θ gives two arcs in parallel; a tapered rod needs ∫ρ dx/A(x). <i>Trap:</i> keeping the area constant when the wire is stretched.</div>
<div class="step"><b>3. Temperature effects.</b> R = R₀(1 + αΔT); series combination of positive and negative α for zero net change. <i>Trap:</i> using R₂₀ in place of R₀ for big temperature ranges.</div>
<div class="step"><b>4. Networks.</b> Redraw; join equal-potential points; balanced bridges drop the middle; ladders by self-similarity; cubes by symmetry. <i>Trap:</i> missing a short-circuit wire that removes a resistor completely.</div>
<div class="step"><b>5. Cells and maximum power.</b> I = E/(R + r); series and parallel cells; P max at R = r. <i>Trap:</i> one cell reversed in a series row cancels two cells' emf but still adds its resistance.</div>
<div class="step"><b>6. Kirchhoff loops.</b> Guess directions, junction law first, then loops. <i>Trap:</i> sign of a cell crossed from + to −.</div>
<div class="step"><b>7. Wheatstone and metre bridge.</b> P/Q = R/S; X = S l/(100 − l); end corrections. <i>Trap:</i> putting l on the wrong side of the ratio.</div>
<div class="step"><b>8. Potentiometer.</b> E ∝ balance length; r = R(l₁/l₂ − 1); potential gradient k = (driver voltage across wire)/(wire length). <i>Trap:</i> no balance point if the driver's voltage across the wire is less than the emf measured.</div>
<div class="step"><b>9. Meters.</b> Shunt for an ammeter, series resistance for a voltmeter; loading by a real voltmeter. <i>Trap:</i> a voltmeter's range n times larger needs (n − 1)G in series.</div>
<div class="step"><b>10. Power, heating and bulbs.</b> I²R in series, V²/R in parallel; rated bulbs on other voltages; heater coils cut or joined; kWh bills. <i>Trap:</i> assuming a bulb's power stays the same on a different voltage; its resistance stays (roughly) the same instead.</div>
</div>

## Worked examples

**Example 1 (level 3, ring of wire).** A uniform wire of resistance 12 Ω is bent into a circle. Find the resistance between two points 90° apart.

*Solution.* The arcs are a quarter and three quarters: 3 Ω and 9 Ω, in parallel. R = 27/12 = **2.25 Ω**. *Trap:* treating the arcs as in series.

**Example 2 (level 4, infinite ladder).** Each rung and each side piece of an infinite ladder is R. Find the input resistance.

*Solution.* Adding one more step does not change an infinite ladder: `$x = R + \dfrac{Rx}{R + x}$`. This gives `$x^2 - Rx - R^2 = 0$`, so **x = R(1 + √5)/2 ≈ 1.618R**. Only the positive root has meaning.

**Example 3 (level 4, cells with one reversed).** Six cells, each 2 V and 0.5 Ω, are in series but one is connected backwards. They drive a 7 Ω resistor. Find the current.

*Solution.* Net emf = 5 × 2 − 2 = 8 V. Internal resistance = 6 × 0.5 = 3 Ω (all six count). I = 8/(7 + 3) = **0.8 A**. *Trap:* using 10 V or 2.5 Ω.

**Example 4 (level 5, cube between face-diagonal corners).** Twelve 1 Ω resistors form a cube. Find the resistance between two corners at opposite ends of one face's diagonal.

*Solution.* Inject current I at A, take it out at C (face diagonal). By symmetry, the two corners next to both A and C on that face are at the same potential, and so are their partners on the opposite face. Joining them and simplifying gives **3/4 Ω**. *Check list to memorise:* edge 7/12, face diagonal 3/4, body diagonal 5/6 (all × R).

<div class="myth">

**"An ammeter must have a large resistance to be accurate."** The opposite. An ammeter is put in series, so its own resistance reduces the current it is trying to measure: it should be as small as possible. A voltmeter goes in parallel and should draw almost no current: as large as possible.

</div>

<div class="meaning">
<dl>
<dt>Equal-potential points</dt><dd>points placed symmetrically with respect to the input and output; a resistor between them carries no current</dd>
<dt>Self-similar network</dt><dd>an infinite ladder or grid that looks the same after removing one section; write R in terms of itself</dd>
<dt>Physical meaning</dt><dd>A circuit's currents arrange themselves so that every point has one potential. Symmetry tells you which points must match before you calculate anything.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="current-electricity" data-mode="practice"></div>

<div class="keypoints">

- Ten types: drift, shaped wires, temperature, networks, cells and power, Kirchhoff, bridges, potentiometer, meters, heating.
- Redraw first; join equal-potential points; drop balanced bridge arms.
- A reversed cell subtracts 2E from the row's emf but its resistance still adds.
- Cube: edge 7R/12, face diagonal 3R/4, body diagonal 5R/6. Ladder of R: 1.618R.
- Potentiometer: r = R(l₁/l₂ − 1); metre bridge: X = S l/(100 − l).
- Real voltmeters load a circuit and read low.

</div>
