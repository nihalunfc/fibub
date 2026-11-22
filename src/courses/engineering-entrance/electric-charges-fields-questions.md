---
title: 'Electric charges, fields and Gauss''s law: question types and traps'
seoTitle: 'Electric field and Gauss law questions for JEE and NEET'
summary: 'Every way entrance exams ask about charges and fields: Coulomb force with superposition, equilibrium of charges, null points, field lines, dipoles, flux through cubes and cones, Gauss''s law for wires, sheets and spheres, and charges moving in fields, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'Charges +q and +4q are 30 cm apart. A third charge is in equilibrium on the line between them at a distance from +q of:'
    choices: ['10 cm', '15 cm', '20 cm', '6 cm']
    ans: 0
    why: 'x/(30 − x) = √(q/4q) = 1/2, so x = 10 cm. The answer does not depend on the third charge''s size or sign.'
  - q: 'A charge q sits at one corner of a cube. The flux through the whole cube is:'
    choices: ['q/ε₀', 'q/(8ε₀)', 'q/(24ε₀)', 'zero']
    ans: 1
    why: 'Eight such cubes around the corner would enclose q completely, so one cube gets q/(8ε₀). The three faces touching the corner get none.'
  - q: 'An electron and a proton are released in the same uniform field. Compared with the proton, the electron has:'
    choices: ['the same force and the same acceleration', 'the same size of force, much larger acceleration', 'a larger force', 'a smaller acceleration']
    ans: 1
    why: 'Both feel eE (opposite directions). The electron is about 1836 times lighter, so its acceleration is about 1836 times larger.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electrostatics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 28 minutes.** Read the lesson [Electric charges, fields and Gauss's law](/learn/courses/engineering-entrance/electric-charges-fields/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Every electrostatics question is either a vector sum (Coulomb plus superposition) or a symmetry argument (Gauss). Decide which in the first ten seconds: no symmetry means add vectors; a sphere, a line or a sheet means Gauss.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Properties of charge.</b> Quantisation (n = q/e must be a whole number), conservation, mass change on charging. <i>Trap:</i> a charge like 2.4 × 10⁻¹⁹ C cannot exist.</div>
<div class="step"><b>2. Coulomb force with superposition.</b> Draw each force as an arrow, resolve into x and y, add. <i>Trap:</i> adding sizes when the forces are at an angle; square and triangle problems need components.</div>
<div class="step"><b>3. Equilibrium of three charges.</b> Third charge between like charges: position from √q ratio. For the whole system in equilibrium, the middle charge must be opposite and of size q₁q₂/(√q₁ + √q₂)². <i>Trap:</i> stability; on the line it is stable only for some signs.</div>
<div class="step"><b>4. Null points and field lines.</b> Like charges: between, near the smaller. Unlike: outside, beyond the smaller. <i>Trap:</i> picking a point between unlike charges, where both fields point the same way.</div>
<div class="step"><b>5. Hanging charged balls.</b> F = mg tan θ; in a liquid the force drops by K and weight by (1 − ρ/ρ_ball). <i>Trap:</i> forgetting buoyancy.</div>
<div class="step"><b>6. Dipole field and dipole in a field.</b> Axis 2kp/r³, equator kp/r³; τ = pE sin θ, U = −pE cos θ, work = pE(cos θ₁ − cos θ₂). <i>Trap:</i> stable is θ = 0 (U is lowest), not θ = 90°.</div>
<div class="step"><b>7. Flux through part of a surface.</b> Cube centre: q/6ε₀ per face; corner: q/24ε₀ per far face; flat disc facing a charge: use the solid angle, Φ = (q/2ε₀)(1 − cos α). <i>Trap:</i> faces that contain the charge's lines in their plane get zero flux.</div>
<div class="step"><b>8. Gauss's law for symmetric bodies.</b> Pick a Gaussian surface where E is constant: sphere, cylinder or pillbox. <i>Trap:</i> using σ/ε₀ (conductor) for a thin non-conducting sheet, which is σ/2ε₀.</div>
<div class="step"><b>9. Spheres, shells and cavities.</b> Shell: zero inside. Solid sphere: kQr/R³ inside. Cavity: uniform field ρd/3ε₀. <i>Trap:</i> a sphere with charge density varying as ρ = ar needs an integral for q_inside.</div>
<div class="step"><b>10. Charges moving in fields.</b> Constant force qE: use projectile equations with a = qE/m. Ring axis or two equal charges: small oscillations in SHM. <i>Trap:</i> including gravity for electrons (negligible) or leaving it out for oil drops (needed).</div>
</div>

## Worked examples

**Example 1 (level 3, superposition on a square).** Four charges +q, +q, +q, +q sit at the corners of a square of side a. What is the net force on one of them?

*Solution.* The two neighbours each push with kq²/a², at 90° to each other: together `$\sqrt2\,kq^2/a^2$` along the diagonal. The far corner, distance a√2, pushes `$kq^2/(2a^2)$` along the same diagonal. Total `$\dfrac{kq^2}{a^2}\left(\sqrt2 + \tfrac12\right)$`, outward along the diagonal. *Trap:* adding the three sizes directly gives 2.5kq²/a², which is wrong.

**Example 2 (level 4, flux through a disc).** A charge q sits on the axis of a disc of radius R, at distance R from it. What flux passes through the disc?

*Solution.* The disc's edge is seen at half-angle α with tan α = R/R, so α = 45°. Flux = `$\dfrac{q}{2\varepsilon_0}(1 - \cos\alpha) = \dfrac{q}{2\varepsilon_0}\left(1 - \tfrac{1}{\sqrt2}\right) \approx 0.146\,\dfrac{q}{\varepsilon_0}$`. *Check:* as R grows huge, α → 90° and the flux → q/2ε₀, half the total. ✓

**Example 3 (level 4, non-uniform sphere).** A sphere of radius R has charge density ρ = ar (a constant). Find E inside at distance r.

*Solution.* Charge inside r: `$q = \int_0^r a r'\,4\pi r'^2\,dr' = \pi a r^4$`. Gauss: `$E\cdot4\pi r^2 = \pi a r^4/\varepsilon_0$`, so **E = ar²/(4ε₀)**. It grows as r², not as r. *Trap:* using kQr/R³, which holds only for uniform density.

**Example 4 (level 5, oscillation on a ring axis).** A ring of radius 10 cm carries +2 µC. A particle of mass 1 g and charge −1 µC is placed on the axis 0.5 mm from the centre and released. Find the period. (k = 9 × 10⁹)

*Solution.* Near the centre, F ≈ −(kQq/R³)x, so the spring constant is `$\dfrac{9\times10^9 \times 2\times10^{-6} \times 10^{-6}}{10^{-3}} = 18$` N/m. `$T = 2\pi\sqrt{m/k_s} = 2\pi\sqrt{10^{-3}/18} \approx$` **0.047 s**. *Trap:* a positive charge here would not oscillate: along the axis it is pushed away.

<div class="myth">

**"A field line shows the path a charge will take."** Only for straight lines and a charge starting from rest. On curved lines the charge's inertia carries it off the line.

</div>

<div class="meaning">
<dl>
<dt>Which tool?</dt><dd>no symmetry: Coulomb and vector addition; sphere, long line or wide sheet: Gauss's law</dd>
<dt>Solid angle trick</dt><dd>flux of q through any patch = q/ε₀ × (solid angle of the patch)/(4π)</dd>
<dt>Physical meaning</dt><dd>Gauss's law is a counting rule for field lines, and symmetry turns the count into a field strength.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="electric-charges-fields" data-mode="practice"></div>

<div class="keypoints">

- Ten types: charge properties, superposition, equilibrium, null points, hanging balls, dipoles, partial flux, Gauss's law, spheres and cavities, motion in fields.
- Resolve forces into components; never add sizes of forces at an angle.
- Corner of a cube: q/8ε₀ through the cube; disc: (q/2ε₀)(1 − cos α).
- Thin sheet σ/2ε₀; conductor surface σ/ε₀.
- Non-uniform density: integrate to find q_inside, then use Gauss.
- Near a ring's centre a charge of opposite sign oscillates with T = 2π√(mR³/kQq).

</div>
