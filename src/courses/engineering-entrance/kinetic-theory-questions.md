---
title: 'Kinetic theory of gases: question types and traps'
seoTitle: 'Kinetic theory questions for JEE and NEET physics'
summary: 'Every way entrance exams ask about kinetic theory: gas laws and connected vessels, Dalton''s law, pressure and kinetic energy, rms, average and most probable speeds, discrete speed sets, Graham''s law, degrees of freedom and equipartition, specific heats of mixtures, mean free path and real gases, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'Four molecules have speeds 1, 2, 3 and 4 m/s. Their rms speed is:'
    choices: ['2.5 m/s', '2.74 m/s', '3 m/s', '5.48 m/s']
    ans: 1
    why: 'v_rms = √((1 + 4 + 9 + 16)/4) = √7.5 ≈ 2.74 m/s. The average speed is 2.5 m/s; the rms is always at least as large.'
  - q: 'The average kinetic energy of a molecule of an ideal gas at 27 °C is about:'
    choices: ['4.1 × 10⁻²¹ J', '6.2 × 10⁻²¹ J', '3.7 × 10³ J', '1.38 × 10⁻²³ J']
    ans: 1
    why: '(3/2)kT = 1.5 × 1.38 × 10⁻²³ × 300 ≈ 6.2 × 10⁻²¹ J (translational).'
  - q: 'Oxygen leaks through a pinhole at a certain rate. Hydrogen under the same conditions leaks:'
    choices: ['4 times faster', '16 times faster', '4 times slower', 'at the same rate']
    ans: 0
    why: 'Graham''s law: rate ∝ 1/√M. √(32/2) = 4.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Kinetic theory of gases; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 26 minutes.** Read the lesson [Kinetic theory of gases](/learn/courses/engineering-entrance/kinetic-theory/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Kinetic theory questions sort into three piles: gas-law bookkeeping (count the moles), speed and energy ratios (everything goes as √(T/M) or T), and degrees of freedom (½kT each). Know which pile a question is in and it takes two lines.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Gas laws and the ideal gas equation.</b> PV = nRT with T in kelvin. <i>Trap:</i> using °C, or litres with R = 8.314 (use m³).</div>
<div class="step"><b>2. Connected vessels and leaks.</b> Moles are conserved: ΣPV/T before = after. <i>Trap:</i> adding pressures when the vessels are at different temperatures.</div>
<div class="step"><b>3. Dalton's law and mixtures.</b> Partial pressure = (moles of that gas/total moles) × total pressure.</div>
<div class="step"><b>4. Pressure and kinetic energy.</b> P = ⅔E/V; E = (3/2)PV for the translational energy. <i>Trap:</i> diatomic total energy is (5/2)PV.</div>
<div class="step"><b>5. Speed ratios.</b> v ∝ √(T/M). <i>Trap:</i> doubling T in °C is not doubling T.</div>
<div class="step"><b>6. Discrete speed sets.</b> Average = Σv/N, rms = √(Σv²/N), most probable = the commonest speed.</div>
<div class="step"><b>7. Graham's law and escape.</b> Effusion rate ∝ 1/√M; isotope separation; why light gases escape a planet.</div>
<div class="step"><b>8. Degrees of freedom.</b> f = 3, 5, 6 (+2 per active vibration). U = (f/2)nRT, γ = 1 + 2/f.</div>
<div class="step"><b>9. Mixtures and specific heats.</b> C_v(mix) = Σn(f/2)R/Σn. <i>Trap:</i> averaging γ directly.</div>
<div class="step"><b>10. Mean free path and real gases.</b> λ ∝ T/(d²P); van der Waals a and b. <i>Trap:</i> at constant volume, heating does not change λ (n_V is fixed).</div>
</div>

## Worked examples

**Example 1 (level 3, connected vessels).** Vessel A (2 L at 3 atm) and vessel B (3 L at 1 atm) hold the same gas at the same temperature. They are joined. Find the final pressure.

*Solution.* Moles ∝ PV: total = 2 × 3 + 3 × 1 = 9 atm L, now in 5 L. **P = 1.8 atm.**

**Example 2 (level 4, connected vessels at different temperatures).** Two equal bulbs joined by a thin tube hold gas at 1 atm and 300 K. One bulb is heated to 600 K while the other stays at 300 K. Find the new pressure.

*Solution.* Moles conserved: `$\dfrac{P V}{600} + \dfrac{P V}{300} = 2\,\dfrac{1 \times V}{300}$`. So `$P\left(\dfrac{1}{600} + \dfrac{2}{600}\right) = \dfrac{4}{600}$` and **P = 4/3 atm ≈ 1.33 atm**. *Trap:* averaging the temperatures gives 1.5 atm.

**Example 3 (level 4, energy of a mixture).** 2 mol of oxygen and 4 mol of argon are at temperature T. Find the total internal energy and γ of the mixture.

*Solution.* U = 2 × (5/2)RT + 4 × (3/2)RT = **11RT**. C_v = 11R/6, C_p = 17R/6, **γ = 17/11 ≈ 1.55**.

**Example 4 (level 5, Maxwell tail).** At what temperature would the rms speed of hydrogen molecules equal the Earth's escape speed (11.2 km/s)? Why does hydrogen escape at much lower temperatures?

*Solution.* `$T = \dfrac{Mv^2}{3R} = \dfrac{0.002 \times (1.12\times10^4)^2}{3 \times 8.31}$` ≈ **1.0 × 10⁴ K**. But the Maxwell distribution has a long tail: at the upper atmosphere's 1000 K or so, a small fraction of molecules exceed escape speed all the time, and over billions of years almost all the hydrogen leaks away.

<div class="myth">

**"Heating a gas in a sealed rigid container makes the molecules collide more often, so the mean free path shrinks."** The number of molecules per volume does not change, so λ stays the same. They collide more often per second only because they move faster.

</div>

<div class="meaning">
<dl>
<dt>Mole bookkeeping</dt><dd>n = PV/RT for each part; the total is conserved when vessels connect</dd>
<dt>Energy per mole</dt><dd>(f/2)RT; translational part always (3/2)RT</dd>
<dt>Physical meaning</dt><dd>Temperature fixes the average energy per degree of freedom; mass only decides how fast a molecule must move to carry it.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="kinetic-theory" data-mode="practice"></div>

<div class="keypoints">

- Ten types: gas laws, connected vessels, Dalton, pressure and energy, speed ratios, discrete speeds, Graham, degrees of freedom, mixtures, mean free path.
- Connected vessels: conserve Σ PV/T, never average temperatures.
- v_rms ≥ v_avg for any set of speeds.
- Mixture γ from total C_p over total C_v.
- Mean free path depends on n_V and d, not on speed.

</div>
