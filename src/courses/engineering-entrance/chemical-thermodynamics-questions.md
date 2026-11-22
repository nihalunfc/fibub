---
title: 'Chemical thermodynamics: question types and traps'
seoTitle: 'Thermodynamics questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about thermodynamics: sign conventions, work of expansion, ΔH and ΔU, calorimetry, Hess''s law and bond enthalpies, entropy changes, Gibbs energy and temperature, ΔG and K, and adiabatic processes, each with a method and its trap. Then practise.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: '2 mol of an ideal gas expand against a constant external pressure of 1 atm from 10 L to 30 L. The work done on the gas is about:'
    choices: ['−20 L atm', '+20 L atm', '−40 L atm', '0']
    ans: 0
    why: 'w = −P(ext)ΔV = −1 × (30 − 10) = −20 L atm (about −2026 J). The number of moles does not enter for a constant external pressure.'
  - q: 'Enthalpy of vaporisation of a liquid is 30 kJ/mol at its boiling point 300 K. ΔS of vaporisation is:'
    choices: ['10 J/(K mol)', '100 J/(K mol)', '0.1 J/(K mol)', '9000 J/(K mol)']
    ans: 1
    why: 'At the boiling point the phase change is reversible: ΔS = ΔH/T = 30 000/300 = 100 J K⁻¹ mol⁻¹.'
  - q: 'For an ideal gas in a free expansion (into a vacuum, insulated), which is true?'
    choices: ['q = 0, w = 0, ΔU = 0, ΔS > 0', 'q = 0, w < 0, ΔU < 0', 'ΔS = 0', 'ΔT < 0']
    ans: 0
    why: 'Nothing to push against means w = 0; insulated means q = 0; so ΔU = 0 and T stays the same. But the gas spreads out, so entropy rises.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Chemical thermodynamics; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 11 · about 26 minutes.** Read [Chemical thermodynamics](/learn/courses/engineering-entrance/chemical-thermodynamics/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Thermodynamics questions are mostly bookkeeping: decide the sign convention, decide what is held constant (T, P, V or q), and the right formula picks itself. The traps are signs and units (J against kJ, L atm against J).</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Signs and state functions.</b> q, w positive into the system. <i>Trap:</i> some older books use w positive for work done by the system; follow the question.</div>
<div class="step"><b>2. Work of expansion.</b> Irreversible: −P<sub>ext</sub>ΔV. Reversible isothermal: −2.303 nRT log(V₂/V₁). <i>Trap:</i> 1 L atm = 101.3 J; free expansion w = 0.</div>
<div class="step"><b>3. ΔH and ΔU.</b> ΔH = ΔU + Δn<sub>g</sub>RT. <i>Trap:</i> count only gases; R in kJ (8.314 × 10⁻³).</div>
<div class="step"><b>4. Calorimetry.</b> q = CΔT; bomb gives ΔU. <i>Trap:</i> per gram versus per mole; the heat released by the reaction is absorbed by the calorimeter (opposite sign).</div>
<div class="step"><b>5. Hess's law and bond enthalpies.</b> Add equations; broken minus formed. <i>Trap:</i> bond enthalpies apply to gases; reverse an equation, reverse the sign.</div>
<div class="step"><b>6. Entropy changes.</b> ΔH/T for phase change; 2.303 nR log(V₂/V₁) for isothermal expansion; nC ln(T₂/T₁) for heating. <i>Trap:</i> ΔS<sub>surr</sub> = −ΔH/T has the opposite sign to ΔH.</div>
<div class="step"><b>7. Gibbs energy and temperature.</b> ΔG = ΔH − TΔS; crossover ΔH/ΔS. <i>Trap:</i> ΔS in J, ΔH in kJ.</div>
<div class="step"><b>8. ΔG° and K.</b> ΔG° = −2.303 RT log K. <i>Trap:</i> a positive ΔG° gives K &lt; 1, not "no reaction".</div>
<div class="step"><b>9. Adiabatic processes (JEE Advanced).</b> w = nC<sub>v</sub>(T₂ − T₁); TV<sup>γ−1</sup> constant if reversible; irreversible: nC<sub>v</sub>(T₂ − T₁) = −P<sub>ext</sub>(V₂ − V₁). <i>Trap:</i> do not use PV<sup>γ</sup> for an irreversible change.</div>
</div>

## Worked examples

**Example 1 (level 3, Hess from combustion).** ΔH°<sub>c</sub> of C (graphite), H₂ and CH₄ are −393.5, −285.8 and −890.3 kJ/mol. Find ΔH°<sub>f</sub> of CH₄. *Solution.* C + 2H₂ → CH₄. Burn the reactants and "unburn" the product: ΔH = −393.5 + 2(−285.8) − (−890.3) = **−74.8 kJ/mol**.

**Example 2 (level 4, bond enthalpies).** Using C-H 414, C-C 347, C=C 611 and H-H 436 kJ/mol, find ΔH for C₂H₄ + H₂ → C₂H₆. *Solution.* Broken: C=C + H-H = 611 + 436 = 1047. Formed: C-C + 2 C-H = 347 + 828 = 1175 (the other four C-H bonds are on both sides and cancel). ΔH = 1047 − 1175 = **−128 kJ/mol**.

**Example 3 (level 4, total entropy).** Water freezes at −10 °C. Is ΔS of the water positive or negative, and why is the process still spontaneous? *Solution.* Liquid to solid: ΔS<sub>sys</sub> &lt; 0. But freezing releases heat into the cold surroundings; ΔS<sub>surr</sub> = −ΔH/T is positive and larger at 263 K than |ΔS<sub>sys</sub>|. So **ΔS<sub>total</sub> &gt; 0**. At 0 °C the two balance exactly.

**Example 4 (level 5, reversible against irreversible adiabatic).** 1 mol of a monatomic ideal gas at 300 K and 10 atm expands adiabatically to 1 atm (a) reversibly, (b) against a constant 1 atm. Find the final temperatures. *Solution.* (a) T P<sup>(1−γ)/γ</sup> constant with γ = 5/3: T₂ = 300 × (1/10)<sup>0.4</sup> = 300 × 0.398 = **119 K**. (b) (3/2)R(T₂ − 300) = −1 × (RT₂/1 − R × 300/10), so 1.5T₂ − 450 = −T₂ + 30, T₂ = 480/2.5 = **192 K**. The reversible path does more work, so the gas cools more.

<div class="myth">

**"Heat absorbed at constant volume equals ΔH."** At constant volume no expansion work is done, so q<sub>v</sub> = ΔU. Only at constant pressure is q = ΔH. That is why a bomb calorimeter result has to be corrected with Δn<sub>g</sub>RT.

</div>

<div class="meaning">
<dl>
<dt>γ</dt><dd>C<sub>p</sub>/C<sub>v</sub>: 5/3 monatomic, 7/5 diatomic</dd>
<dt>2.303 RT at 298 K</dt><dd>5.71 kJ/mol</dd>
<dt>Physical meaning</dt><dd>Reversible work is the biggest work a gas can do in expansion; any real (faster) process wastes some.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="chemical-thermodynamics" data-mode="practice"></div>

<div class="keypoints">

- First decide what is constant: T (isothermal), P, V or q (adiabatic).
- 1 L atm = 101.3 J; R = 8.314 J = 0.0821 L atm per K per mol.
- Hess: reverse an equation, reverse the sign; multiply it, multiply ΔH.
- ΔS<sub>total</sub> = ΔS<sub>sys</sub> − ΔH<sub>sys</sub>/T must be positive for a spontaneous change.
- Irreversible adiabatic: balance nC<sub>v</sub>ΔT with −P<sub>ext</sub>ΔV.

</div>
