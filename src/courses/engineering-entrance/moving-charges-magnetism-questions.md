---
title: 'Moving charges and magnetic fields: question types and traps'
seoTitle: 'Magnetic effects of current questions for JEE and NEET'
summary: 'Every way entrance exams ask about moving charges and magnetic fields: force direction, circular and helical paths, crossed fields and cyclotrons, fields of wires, arcs, loops and coils, Ampère''s law, forces between currents, torque on loops and galvanometers, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A proton and an alpha particle enter the same field with the same kinetic energy. The ratio of their radii (proton : alpha) is:'
    choices: ['1 : 1', '1 : 2', '2 : 1', '1 : 4']
    ans: 0
    why: 'r = √(2mK)/(qB). The alpha has 4 times the mass (√4 = 2) and twice the charge, so the radii are equal.'
  - q: 'A wire bent into a semicircle of radius R carries current I. The field at the centre is:'
    choices: ['μ₀I/2R', 'μ₀I/4R', 'μ₀I/2πR', 'zero']
    ans: 1
    why: 'An arc of angle θ gives μ₀Iθ/(4πR). For θ = π, that is μ₀I/4R, half the field of a full loop. Straight leads pointing at the centre add nothing.'
  - q: 'A rectangular loop carrying current is placed in a uniform magnetic field. The net force on it is:'
    choices: ['zero, always', 'maximum when its plane is along B', 'NIAB', 'zero only when its plane is perpendicular to B']
    ans: 0
    why: 'In a uniform field the forces on opposite sides cancel for any closed loop. There can still be a torque.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Magnetic effects of current; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 28 minutes.** Read the lesson [Moving charges and magnetic fields](/learn/courses/engineering-entrance/moving-charges-magnetism/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Two skills carry this chapter: getting directions right with the right-hand rules, and breaking a shape into straight pieces and arcs whose fields you already know. Do both carefully and the algebra is short.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Direction of force.</b> F = qv × B; flip for electrons. <i>Trap:</i> forgetting the sign of the charge, or using the left-hand rule for a charge instead of a current.</div>
<div class="step"><b>2. Circular motion.</b> r = mv/qB = √(2mK)/qB = √(2mV/q)/B. Compare particles by which of v, p, K or V is equal. <i>Trap:</i> using r ∝ m when the kinetic energies, not the speeds, are equal.</div>
<div class="step"><b>3. Helical motion.</b> Split v into parts along and across B; pitch = v∥ × T. <i>Trap:</i> using v sin θ for the pitch.</div>
<div class="step"><b>4. Crossing a field region.</b> A strip of width d: the particle gets through only if r > d; deflection angle sin α = d/r; time in the field = (α/2π)T. <i>Trap:</i> using the chord length as an arc length.</div>
<div class="step"><b>5. Crossed fields and devices.</b> Velocity selector v = E/B; mass spectrometer r ∝ m; cyclotron f = qB/2πm, K_max = q²B²R²/2m. <i>Trap:</i> thinking the cyclotron frequency grows as the particle speeds up.</div>
<div class="step"><b>6. Field of wire shapes.</b> Split into straight pieces and arcs; add as vectors with directions. A straight piece pointing at the point gives zero. <i>Trap:</i> using μ₀I/2πd for a finite or semi-infinite wire (semi-infinite: half that, μ₀I/4πd).</div>
<div class="step"><b>7. Ampère's law.</b> Thick wires, hollow pipes, solenoids, toroids, current sheets (μ₀K/2). <i>Trap:</i> current density not uniform: integrate J over the area enclosed.</div>
<div class="step"><b>8. Forces on currents.</b> F = IL × B; a curved wire = its straight chord; parallel wires attract for like currents; a loop near a long wire feels a net force because its sides are at different distances. <i>Trap:</i> assuming zero force on a loop in a non-uniform field.</div>
<div class="step"><b>9. Torque and dipole energy.</b> τ = mB sin θ, U = −mB cos θ, work = mB(cos θ₁ − cos θ₂). A rotating charged ring or disc has m = (q/2π)ωA. <i>Trap:</i> θ is measured from the normal to the loop, not from its plane.</div>
<div class="step"><b>10. Galvanometer and meters.</b> NIAB = kφ; sensitivity; shunt and series resistor. <i>Trap:</i> more turns raise current sensitivity but leave voltage sensitivity unchanged.</div>
</div>

## Worked examples

**Example 1 (level 3, field of a square loop).** A square loop of side a carries current I. Find the field at its centre.

*Solution.* Each side is a finite wire at distance a/2 from the centre, seen at 45° on each side: `$B_1 = \dfrac{\mu_0 I}{4\pi(a/2)}(\sin45° + \sin45°) = \dfrac{\sqrt2\,\mu_0 I}{2\pi a}$`. Four sides in the same direction: **B = 2√2 μ₀I/(πa)**.

**Example 2 (level 4, crossing a strip).** A proton with speed v enters at right angles a field region of width d = r/2, where r = mv/qB. By what angle is it turned, and for how long is it in the field?

*Solution.* The arc inside the strip has sin α = d/r = 1/2, so **α = 30°**. Time = (30/360)T = T/12 = **πm/(6qB)**. Its speed on leaving is still v. *Trap:* if d ≥ r it never crosses: it turns back after half a circle.

**Example 3 (level 4, loop near a long wire).** A square loop of side a, carrying I₂, lies with its nearest side at distance a from a long wire carrying I₁, all in one plane. Find the net force.

*Solution.* Top and bottom sides feel equal and opposite forces. The near side feels `$\dfrac{\mu_0 I_1 I_2 a}{2\pi a}$`; the far side `$\dfrac{\mu_0 I_1 I_2 a}{2\pi(2a)}$`, in the opposite direction. Net = **μ₀I₁I₂/(4π)**, towards the wire if the near side's current runs parallel to I₁.

**Example 4 (level 5, rotating charged disc).** A disc of radius R carries charge Q spread evenly and spins at angular speed ω. Find its magnetic moment.

*Solution.* A ring of radius r and width dr carries charge `$dq = \dfrac{Q}{\pi R^2}2\pi r\,dr$`, making current `$dq\,\omega/2\pi$`. Its moment is `$dm = \dfrac{\omega}{2\pi}\,dq\,\pi r^2 = \dfrac{Q\omega}{R^2}r^3\,dr$`. Integrate: **m = QωR²/4**. Ratio m/L = Q/(2M) for any rotating body with charge spread like mass.

<div class="myth">

**"A magnetic field can speed up a charged particle."** Never on its own. In a cyclotron the energy comes from the electric field in the gap; the magnetic field only brings the particle back round to the gap.

</div>

<div class="meaning">
<dl>
<dt>Equal V</dt><dd>r ∝ √(m/q); equal K: r ∝ √m/q; equal p: r ∝ 1/q; equal v: r ∝ m/q</dd>
<dt>Shape fields</dt><dd>straight piece μ₀I(sin φ₁ + sin φ₂)/(4πd); arc μ₀Iθ/(4πR)</dd>
<dt>Physical meaning</dt><dd>Knowing which quantity the particles share decides the whole comparison; read the question for "same speed", "same energy" or "same voltage".</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="moving-charges-magnetism" data-mode="practice"></div>

<div class="keypoints">

- Ten types: force direction, circles, helices, field strips, devices, wire shapes, Ampère, forces on currents, torque, galvanometers.
- Same V: r ∝ √(m/q); same K: r ∝ √m/q.
- Semi-infinite wire at its end's perpendicular: μ₀I/4πd; semicircle centre μ₀I/4R; square centre 2√2μ₀I/πa.
- Strip of width d: crosses only if r > d; sin α = d/r.
- Closed loop in uniform B: zero force; near a wire: net force from unequal sides.
- Rotating charged disc m = QωR²/4.

</div>
