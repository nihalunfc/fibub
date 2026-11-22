---
title: 'Electromagnetic induction: question types and traps'
seoTitle: 'Electromagnetic induction questions for JEE and NEET'
summary: 'Every way entrance exams ask about induction: flux and its graphs, direction by Lenz''s law, induced charge, sliding, rotating and inclined rods, rails with resistors, capacitors and inductors, loops entering fields, induced electric fields, inductance, LR circuits and generators, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A square loop moves at constant speed into, through and out of a field region wider than the loop. The induced emf is:'
    choices: ['constant throughout', 'non-zero only while entering and leaving, opposite in sign', 'largest while fully inside', 'zero throughout']
    ans: 1
    why: 'The flux changes only while the loop is entering (rising) and leaving (falling). Fully inside, the flux is constant, so the emf is zero.'
  - q: 'The flux through a coil is Φ = 3t² − 4t (Wb, t in s). The emf at t = 2 s is (in size):'
    choices: ['4 V', '8 V', '12 V', '2 V']
    ans: 1
    why: 'ε = −dΦ/dt = −(6t − 4) = −8 V at t = 2 s. Its size is 8 V.'
  - q: 'Two coils have L₁ = 2 mH and L₂ = 8 mH. Their mutual inductance can be at most:'
    choices: ['10 mH', '4 mH', '16 mH', '6 mH']
    ans: 1
    why: 'M = k√(L₁L₂) with k ≤ 1. √16 = 4 mH is the largest possible value, for perfect coupling.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electromagnetic induction; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 28 minutes.** Read the lesson [Electromagnetic induction](/learn/courses/engineering-entrance/electromagnetic-induction/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Every induction problem is either "flux changes, find the emf" (Faraday) or "conductor moves, find the emf" (Blv). Then the same three steps follow: current from the circuit, force from BIl, and energy from F·v = I²R.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Flux and emf graphs.</b> emf = −slope of the Φ-t graph; Φ = −area under the emf-t graph. <i>Trap:</i> largest flux does not mean largest emf.</div>
<div class="step"><b>2. Direction of induced current.</b> Find the flux direction and whether it grows or shrinks; the induced field opposes the change; right-hand grip gives the current. <i>Trap:</i> opposing the field instead of the change.</div>
<div class="step"><b>3. Induced charge.</b> q = NΔΦ/R. Flipping a coil: ΔΦ = 2NBA. <i>Trap:</i> thinking a faster flip moves more charge.</div>
<div class="step"><b>4. Motional emf of rods.</b> Blv for straight rods; v × B dotted with l for tilted rods; a bent rod's emf equals that of the straight line joining its ends. <i>Trap:</i> a rod moving along its own length or along B gives zero.</div>
<div class="step"><b>5. Rotating rods and discs.</b> ½Bωl² from the axis; about the middle, both halves cancel. <i>Trap:</i> using Blv with the tip speed instead of the average speed ωl/2.</div>
<div class="step"><b>6. Rails with R, C or L.</b> With R: terminal speed. With C: constant acceleration a = F/(m + CB²l²). With L (no R): the rod oscillates in SHM with ω = Bl/√(mL). <i>Trap:</i> treating all three like the resistor case.</div>
<div class="step"><b>7. Loops entering or leaving fields.</b> emf = Blv only for the cut edge; sketch Φ-t and emf-t; heat = I²Rt during entry. <i>Trap:</i> counting emf while the loop is fully inside a uniform field.</div>
<div class="step"><b>8. Induced electric field.</b> E·2πr = πr² dB/dt inside, πR² dB/dt outside. Force on a charge = qE; torque on a charged ring. <i>Trap:</i> trying to use a potential difference for this field.</div>
<div class="step"><b>9. Inductance and energy.</b> L = μ₀N²A/l; M = μ₀n₁n₂Al; series L₁ + L₂ ± 2M; U = ½LI². <i>Trap:</i> L scales with N², not N.</div>
<div class="step"><b>10. LR circuits and generators.</b> t = 0: inductor open; t = ∞: inductor a wire; τ = L/R_eq. Generator ε₀ = NBAω. <i>Trap:</i> the emf of a generator is largest when the flux through it is zero.</div>
</div>

## Worked examples

**Example 1 (level 3, semicircular rod).** A wire bent into a semicircle of radius r moves at v perpendicular to its diameter, in a field B perpendicular to its plane. Find the emf between its ends.

*Solution.* A curved conductor in a uniform field gives the same emf as the straight line between its ends, which has length 2r and moves at right angles to itself: **ε = 2Brv**. If it moved along its diameter, the emf would be zero.

**Example 2 (level 4, rails with a capacitor).** A rod of mass m on smooth rails l apart, joined by a capacitor C, in field B, is pulled by a constant force F. Find its acceleration.

*Solution.* Capacitor charge q = CBlv, so current `$I = CBl\,a$`. Backward force BIl = CB²l²a. Newton: F − CB²l²a = ma, so **a = F/(m + CB²l²)**: constant, the rod never reaches a terminal speed. The capacitor acts like extra mass.

**Example 3 (level 4, loop falling out of a field).** A square loop of side l, mass m, resistance R, falls under gravity, its lower edge already out of a horizontal field region, its top edge still inside. If it falls at a steady speed while leaving, find that speed.

*Solution.* Only the top edge cuts field lines: emf Blv, current Blv/R, upward force B²l²v/R. Steady when B²l²v/R = mg: **v = mgR/(B²l²)**. The loss of potential energy goes entirely into heat.

**Example 4 (level 5, LR with a parallel resistor).** A battery E with a switch feeds R₁ in series with a parallel pair: an inductor L and a resistor R₂. Find the battery current just after the switch closes, and long after.

*Solution.* At t = 0 the inductor carries no current: the circuit is R₁ + R₂, so I₀ = E/(R₁ + R₂). Long after, the inductor is a wire shorting R₂: I∞ = E/R₁. The time constant uses the resistance seen by the inductor with the battery shorted: R₁ ∥ R₂, so `$\tau = \dfrac{L(R_1 + R_2)}{R_1R_2}$`.

<div class="myth">

**"No current flows, so no emf is induced."** An emf appears whenever the flux changes, even in an open loop or a single rod. The current needs a closed circuit; the emf does not.

</div>

<div class="meaning">
<dl>
<dt>Rail rules</dt><dd>with R: terminal speed; with C: constant acceleration; with L only: SHM</dd>
<dt>Curved conductor</dt><dd>same emf as the straight chord joining its ends</dd>
<dt>Physical meaning</dt><dd>Lenz's law is energy conservation in disguise: if the induced current helped the change, a small push would run away into endless energy.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="electromagnetic-induction" data-mode="practice"></div>

<div class="keypoints">

- Ten types: graphs, direction, induced charge, rods, rotation, rails, loops in fields, induced E, inductance, LR and generators.
- emf is the slope of the flux graph; flux is the area under the emf graph.
- Curved rod = straight chord; rotating rod ½Bωl².
- Rails with C: a = F/(m + CB²l²); with R: v_t = FR/(B²l²).
- Inductor: open circuit at t = 0, wire at t = ∞; τ uses the resistance seen by L.
- Generator emf largest when the coil's plane is along B.

</div>
