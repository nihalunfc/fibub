---
title: 'Experimental skills and practical physics: question types and traps'
seoTitle: 'Physics practical questions for JEE and NEET'
summary: 'Every way entrance exams ask about practical physics: least counts and zero errors, significant figures and error in a result, choosing and reading graphs, pendulum, Young''s modulus, capillary, viscosity and calorimetry set-ups, resonance tube end correction, metre bridge and galvanometer methods, optics benches and diode characteristics, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'A screw gauge reads −0.03 mm with the jaws closed. A wire then gives a reading of 1.47 mm. The diameter is:'
    choices: ['1.44 mm', '1.47 mm', '1.50 mm', '1.53 mm']
    ans: 2
    why: 'True value = reading − zero error = 1.47 − (−0.03) = 1.50 mm.'
  - q: 'In Searle''s experiment, which measurement needs the most care?'
    choices: ['the length of the wire', 'the load', 'the diameter of the wire', 'the room temperature']
    ans: 2
    why: 'The diameter is small and enters squared, so its fractional error counts twice. The extension is also small and measured with a fine micrometer.'
  - q: 'In a metre bridge, the balance point is best kept near the middle of the wire because:'
    choices: ['the wire is thicker there', 'it reduces the percentage error and end effects', 'the galvanometer is more sensitive there', 'it makes the current larger']
    ans: 1
    why: 'The error in X depends on the product l(100 − l), which is largest at 50 cm, so the fractional error is smallest there; end resistances matter less too.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Experimental skills; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Experimental skills and practical physics](/learn/courses/engineering-entrance/experimental-physics/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Practical questions test judgement more than memory: which reading to trust, which graph to draw, which error matters and how to remove a fixed one. For each experiment ask "what is hard to measure here?" and the answer usually follows.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Least count and readings.</b> Vernier LC = 1 MSD − 1 VSD; screw gauge LC = pitch/divisions. <i>Trap:</i> adding the zero error instead of subtracting it.</div>
<div class="step"><b>2. Significant figures.</b> Products keep the fewest significant figures; sums keep the fewest decimal places. <i>Trap:</i> quoting a calculator result to eight figures.</div>
<div class="step"><b>3. Error in a result.</b> Fractional errors add, each times its power; constants have no error. <i>Trap:</i> letting a negative power reduce the error.</div>
<div class="step"><b>4. Choosing a graph.</b> Linearise: T² vs L, 1/v vs 1/u, log-log for power laws (slope = power). <i>Trap:</i> reading g from the intercept instead of the slope.</div>
<div class="step"><b>5. Pendulum and mechanics set-ups.</b> Effective length to the bob's centre; Searle's dominant error 2Δr/r; terminal velocity only after the ball stops accelerating. <i>Trap:</i> timing a single swing.</div>
<div class="step"><b>6. Capillary and viscosity.</b> h ∝ 1/r; η from v_t ∝ r². <i>Trap:</i> using the outer radius of the capillary tube.</div>
<div class="step"><b>7. Calorimetry and sound.</b> Heat balance with the calorimeter's own heat capacity; resonance tube e = (l₂ − 3l₁)/2. <i>Trap:</i> v = 4fl₁ ignores the end correction; use 2f(l₂ − l₁).</div>
<div class="step"><b>8. Metre bridge and galvanometer.</b> X = S l/(100 − l), swap and average; half deflection G = RS/(R − S). <i>Trap:</i> using l from the wrong end.</div>
<div class="step"><b>9. Optics bench.</b> Index error correction (bench reading versus true distance), u-v graphs, i-δ curve, travelling microscope μ = real/apparent. <i>Trap:</i> forgetting the index correction on every distance.</div>
<div class="step"><b>10. Diode and Zener curves.</b> Forward knee about 0.7 V (Si), reverse microamperes, Zener breakdown flat. <i>Trap:</i> using a milliammeter for the reverse current (too coarse).</div>
</div>

## Worked examples

**Example 1 (level 3, vernier).** A vernier has 20 divisions equal to 19 main divisions of 1 mm. The main scale reads 32 mm and the 7th vernier line coincides. There is a zero error of −0.10 mm. Find the length.

*Solution.* LC = 1 − 19/20 = 0.05 mm. Reading = 32 + 7 × 0.05 = 32.35 mm. True = 32.35 − (−0.10) = **32.45 mm**.

**Example 2 (level 4, error in g).** L = 100.0 cm (least count 1 mm) and the time for 20 swings is 40.0 s (least count 0.1 s). Find the percentage error in g.

*Solution.* ΔL/L = 0.1/100 = 0.1%. The period error comes from the total time: ΔT/T = 0.1/40 = 0.25%. g ∝ L/T²: 0.1% + 2 × 0.25% = **0.6%**. Timing 20 swings, not one, is what made the period error small.

**Example 3 (level 4, resonance tube).** With a 512 Hz fork, resonance occurs at 15.5 cm and 49.5 cm. Find the speed of sound and the end correction.

*Solution.* v = 2 × 512 × (0.495 − 0.155) = 2 × 512 × 0.34 = **348 m/s**. e = (49.5 − 3 × 15.5)/2 = (49.5 − 46.5)/2 = **1.5 cm**.

**Example 4 (level 5, metre bridge end correction).** With X in the left gap and 10 Ω in the right, balance is at 40.0 cm. Swapping them, balance is at 59.0 cm. Find X, allowing for end corrections.

*Solution.* First reading: X = 10 × 40/60 = 6.67 Ω. Second: X is now on the right, with 100 − 59 = 41 cm of wire on its side, so X = 10 × 41/59 = 6.95 Ω. Without end resistance the two would agree; the difference shows it is there. Averaging the lengths on X's side, l = (40 + 41)/2 = 40.5 cm, cancels its first-order effect: **X ≈ 10 × 40.5/59.5 ≈ 6.81 Ω**.

<div class="myth">

**"A more precise instrument always gives a more accurate result."** Precision is how finely you can read; accuracy is how close you are to the true value. A finely divided screw gauge with an uncorrected zero error is precise but inaccurate.

</div>

<div class="meaning">
<dl>
<dt>Random error</dt><dd>scatters readings both ways; reduced by repeating and averaging</dd>
<dt>Systematic error</dt><dd>shifts every reading the same way (zero error, end correction); removed only by correction or clever design</dd>
<dt>Physical meaning</dt><dd>A good experiment is designed so the hardest-to-measure quantity is made as large as possible: many swings for a period, a long wire for a small extension.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="experimental-physics" data-mode="practice"></div>

<div class="keypoints">

- Ten types: least counts, significant figures, error in a result, graphs, mechanics set-ups, capillary and viscosity, heat and sound, bridges and meters, optics bench, diode curves.
- True value = reading − zero error.
- Time many oscillations: the error in T falls with the number timed.
- Resonance tube: v = 2f(l₂ − l₁), e = (l₂ − 3l₁)/2.
- Metre bridge: swap and average; balance near the middle.
- Averaging removes random error, never systematic error.

</div>
