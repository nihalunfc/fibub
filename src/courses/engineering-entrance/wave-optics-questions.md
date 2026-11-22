---
title: 'Wave optics: question types and traps'
seoTitle: 'Wave optics questions for JEE and NEET'
summary: 'Every way entrance exams ask about wave optics: path and phase difference, intensity with unequal slits, YDSE fringe positions, slabs, media and white light, thin films and coatings, single slit diffraction, resolving power, Malus''s law with several polaroids and Brewster''s angle, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'Two slits give intensities in the ratio 9 : 1. The ratio of maximum to minimum intensity in the pattern is:'
    choices: ['9 : 1', '3 : 1', '4 : 1', '16 : 4']
    ans: 2
    why: 'Amplitude ratio 3 : 1. I_max : I_min = (3 + 1)² : (3 − 1)² = 16 : 4 = 4 : 1.'
  - q: 'In YDSE the slit separation is doubled and the screen distance is halved. The fringe width becomes:'
    choices: ['the same', 'one quarter', 'four times', 'half']
    ans: 1
    why: 'β = λD/d: D halves and d doubles, so β becomes 1/4.'
  - q: 'In single slit diffraction, making the slit narrower:'
    choices: ['narrows the central maximum', 'widens the central maximum', 'does not change it', 'makes more fringes appear inside it']
    ans: 1
    why: 'Central width is 2λD/a, so a smaller a spreads the light wider.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Wave optics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Wave optics](/learn/courses/engineering-entrance/wave-optics/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Find the path difference first, always. Every fringe position, every shift and every intensity follows from Δx: bright where it is nλ, dark where it is (n + ½)λ, and in between I = I_max cos²(πΔx/λ).</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Path and phase difference.</b> φ = (2π/λ)Δx; optical path μt in a medium. <i>Trap:</i> forgetting to use the wavelength in the medium, or the extra λ/2 on reflection off a denser surface.</div>
<div class="step"><b>2. Intensity with unequal sources.</b> I_max/I_min = (√I₁ + √I₂)²/(√I₁ − √I₂)²; intensity at a phase φ. Fringe visibility (I_max − I_min)/(I_max + I_min). <i>Trap:</i> using intensity ratio as amplitude ratio.</div>
<div class="step"><b>3. YDSE positions.</b> y = nλD/d; nth dark at (2n − 1)λD/2d. Coincidence of two wavelengths: n₁λ₁ = n₂λ₂. <i>Trap:</i> counting the central fringe as the first bright one.</div>
<div class="step"><b>4. Slabs and media.</b> Slab shift (μ − 1)tD/d; number of fringes shifted (μ − 1)t/λ; whole set-up in liquid: β/μ. <i>Trap:</i> thinking a slab changes the fringe width.</div>
<div class="step"><b>5. Other YDSE twists.</b> Source off-axis (extra path before the slits), white light, missing wavelengths in front of a slit, Lloyd's mirror (central fringe dark). <i>Trap:</i> forgetting the λ/2 phase flip at a mirror.</div>
<div class="step"><b>6. Thin films and wedges.</b> Reflection from a soap film: 2μt = (n + ½)λ bright; transmission swaps the conditions; wedge fringe width λ/(2μθ). <i>Trap:</i> applying soap film conditions to an oil film on glass (both reflections flip; conditions swap).</div>
<div class="step"><b>7. Single slit.</b> Minima a sin θ = nλ; central width 2λD/a; angular width 2λ/a. Number of YDSE fringes inside the envelope ≈ 2d/a. <i>Trap:</i> using the double slit formula for the minima.</div>
<div class="step"><b>8. Resolving power and Fresnel distance.</b> θ = 1.22λ/D; smallest separation at distance L is Lθ; z_F = a²/λ. <i>Trap:</i> microscope resolving power improves with larger μ and aperture, not with magnification.</div>
<div class="step"><b>9. Polarisation.</b> Unpolarised → I/2; then I cos²θ for each polaroid; Brewster tan θ_B = μ, with reflected and refracted rays at 90°. <i>Trap:</i> applying cos² to unpolarised light.</div>
</div>

## Worked examples

**Example 1 (level 3, coinciding fringes).** Light of 600 nm and 480 nm is used together in YDSE with d = 0.5 mm, D = 1 m. Where do bright fringes of both first coincide (apart from the centre)?

*Solution.* n₁ × 600 = n₂ × 480, smallest whole numbers n₁ = 4, n₂ = 5. y = 4 × 600 × 10⁻⁹ × 1 / (0.5 × 10⁻³) = **4.8 mm**.

**Example 2 (level 4, intensity at a point).** In YDSE with equal slits, the central intensity is I₀. What is the intensity at a point where the path difference is λ/3?

*Solution.* φ = 2π/3. `$I = I_0\cos^2(\varphi/2) = I_0\cos^2 60° = I_0/4$`. *Trap:* using cos² φ instead of cos²(φ/2).

**Example 3 (level 4, coating).** A lens (μ = 1.5) is coated with magnesium fluoride (μ = 1.38) to stop reflection of 552 nm light. Find the least coating thickness.

*Solution.* Both reflections (air to coating, coating to glass) go to denser media, so both flip and the flips cancel. Cancellation needs 2μt = λ/2: `$t = \dfrac{\lambda}{4\mu} = \dfrac{552}{4 \times 1.38} = $` **100 nm**.

**Example 4 (level 5, slab and missing fringes).** A sheet of thickness t and index 1.5 placed over one slit moves the central fringe to where the 5th bright fringe was, for λ = 600 nm. Find t.

*Solution.* (μ − 1)t = 5λ, so t = 5 × 600/0.5 nm = **6 µm**. The pattern moves towards the covered slit, and the number of fringes on the screen does not change.

<div class="myth">

**"Diffraction and interference are different kinds of physics."** They are the same thing: waves adding up. Interference is the name used for a few sources; diffraction for many points across one opening.

</div>

<div class="meaning">
<dl>
<dt>Phase flips</dt><dd>λ/2 extra path on reflection from a denser medium; none from a rarer medium or on transmission</dd>
<dt>cos² rules</dt><dd>YDSE I = I_max cos²(φ/2); Malus I = I₀cos²θ (angle between axes)</dd>
<dt>Physical meaning</dt><dd>The pattern is a map of path differences; changing anything on one path (a slab, a mirror, a medium) slides the whole map.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="wave-optics" data-mode="practice"></div>

<div class="keypoints">

- Nine types: path difference, unequal sources, positions, slabs, YDSE twists, thin films, single slit, resolution, polarisation.
- I_max/I_min from amplitudes, not intensities.
- Coincidence: n₁λ₁ = n₂λ₂.
- Slab shifts fringes (μ − 1)t/λ; β unchanged.
- Coating λ/4μ when both reflections flip.
- Unpolarised light: halve first, then cos² for each polaroid.

</div>
