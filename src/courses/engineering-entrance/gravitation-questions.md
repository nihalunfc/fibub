---
title: 'Gravitation: question types and traps'
seoTitle: 'Gravitation questions for JEE and NEET'
summary: 'Every way entrance exams ask about gravitation: forces from several masses, g with height, depth and latitude, field and potential of shells, spheres and rings, escape speed, satellite speed, period and energy, orbit changes, Kepler''s laws, elliptical orbits, binary stars and tunnels, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'At what height above the surface does g fall to one quarter of its surface value? (R = Earth''s radius)'
    choices: ['R/4', 'R/2', 'R', '2R']
    ans: 2
    why: 'g ∝ 1/r². One quarter means r = 2R, which is a height of R above the surface.'
  - q: 'A planet''s distance from the Sun at aphelion is twice that at perihelion. Its speed at perihelion compared with aphelion is:'
    choices: ['half', 'the same', 'double', 'four times']
    ans: 2
    why: 'Angular momentum is kept: v_p r_p = v_a r_a, so v_p/v_a = r_a/r_p = 2.'
  - q: 'If the Earth''s radius shrank to half with its mass unchanged, the escape speed would become:'
    choices: ['half', '√2 times', 'twice', 'the same']
    ans: 1
    why: 'v_e = √(2GM/R). Halving R multiplies v_e by √2.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Gravitation; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Gravitation](/learn/courses/engineering-entrance/gravitation/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Most gravitation questions are ratio questions. Write the formula as a proportion (g ∝ M/R², v_e ∝ √(M/R), T ∝ r^(3/2)), change what the question changes, and the answer follows without any big numbers.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Force from several masses.</b> Add vectors; symmetry often cancels pairs. <i>Trap:</i> forgetting that forces at an angle add by components, not by size.</div>
<div class="step"><b>2. g with height and depth.</b> gR²/(R + h)² and g(1 − d/R). <i>Trap:</i> using g(1 − 2h/R) when h is not small compared with R.</div>
<div class="step"><b>3. g with latitude and spin.</b> g − ω²R cos²λ; at the equator, things would float if ω² R = g (a day of about 1.4 h).</div>
<div class="step"><b>4. Field and potential.</b> Shells, solid spheres, rings; cavities by subtraction. <i>Trap:</i> field inside a shell is zero, but the potential there is not.</div>
<div class="step"><b>5. Potential energy and work.</b> ΔU = GMm(1/r₁ − 1/r₂). <i>Trap:</i> mgh for heights comparable to R.</div>
<div class="step"><b>6. Escape speed.</b> √(2GM/R); ratios for other planets; from a height, √(2GM/r). <i>Trap:</i> thinking it depends on the angle or the body's mass.</div>
<div class="step"><b>7. Circular orbits.</b> v, T, K, U, E as functions of r. <i>Trap:</i> using the height h instead of r = R + h.</div>
<div class="step"><b>8. Orbit changes and binding energy.</b> Energy to raise an orbit, to escape from orbit (= K in orbit), speed factor √2 to escape.</div>
<div class="step"><b>9. Kepler's laws and ellipses.</b> v_p r_p = v_a r_a; T² ∝ a³ with a the semi-major axis; E = −GMm/2a.</div>
<div class="step"><b>10. Binary stars and tunnels.</b> Both stars share one period about the centre of mass. A tunnel through a uniform Earth gives SHM with T = 2π√(R/g) ≈ 84.6 min.</div>
</div>

## Worked examples

**Example 1 (level 3, latitude).** By how much does a 60 kg person's weight change from the pole to the equator, from the Earth's spin alone? (ω = 7.27 × 10⁻⁵ rad/s, R = 6.4 × 10⁶ m)

*Solution.* `$\Delta g = \omega^2 R = (7.27\times10^{-5})^2 \times 6.4\times10^6 = 0.0338$` m/s². Weight change = 60 × 0.0338 ≈ **2.0 N** (about 0.35%).

**Example 2 (level 4, cavity).** A uniform sphere of radius R has a spherical cavity of radius R/2 whose centre is R/2 from the sphere's centre. Find the field at a point inside the cavity.

*Solution.* Full sphere minus the small sphere. Inside a uniform sphere the field is `$-\dfrac{4}{3}\pi G\rho\,\vec r$`. So inside the cavity: `$\vec E = -\tfrac43\pi G\rho(\vec r - \vec r') = -\tfrac43\pi G\rho\,\vec a$`, where `$\vec a$` points from the sphere's centre to the cavity's centre. **The field is uniform** inside the cavity, of size `$\tfrac23\pi G\rho R$`.

**Example 3 (level 4, orbit energy).** How much energy is needed to move a 1000 kg satellite from a circular orbit at height R to one at height 3R? (gR = 6.4 × 10⁷ m²/s², using GM = gR²)

*Solution.* r goes from 2R to 4R. `$\Delta E = \dfrac{GMm}{2}\left(\dfrac{1}{2R} - \dfrac{1}{4R}\right) = \dfrac{GMm}{8R} = \dfrac{mgR}{8}$` = 1000 × 6.4 × 10⁷/8 = **8 × 10⁹ J**.

**Example 4 (level 5, ellipse).** A satellite at distance 2R from the Earth's centre is given a sideways speed that puts it on an ellipse whose farthest point is 6R. Find its speed at 2R in terms of `$v_0 = \sqrt{GM/R}$`.

*Solution.* `$a = (2R + 6R)/2 = 4R$`. Energy: `$\tfrac12v^2 - \dfrac{GM}{2R} = -\dfrac{GM}{8R}$`, so `$v^2 = \dfrac{GM}{R}\left(1 - \tfrac14\right)$` and **v = (√3/2) v₀ ≈ 0.866 v₀**. (The circular speed there is 0.707 v₀, so it is speeded up by about 22%.)

<div class="myth">

**"Weightlessness in orbit means gravity is zero there."** Gravity in low orbit is about 90% of surface gravity. Weightlessness means no supporting force, because everything in the craft falls together.

</div>

<div class="meaning">
<dl>
<dt>Ratio rules</dt><dd>g ∝ M/R² ∝ ρR; v_e ∝ √(M/R) ∝ R√ρ; v_o ∝ 1/√r; T ∝ r^(3/2)</dd>
<dt>Energy ladder</dt><dd>circular orbit: K = −E, U = 2E; to escape from the orbit, supply K</dd>
<dt>Physical meaning</dt><dd>Kepler's second law is angular momentum conservation, and the third is Newton's law of gravitation with circular motion.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="gravitation" data-mode="practice"></div>

<div class="keypoints">

- Ten types: force sums, g with height and depth, latitude, field and potential, potential energy, escape speed, circular orbits, orbit changes, Kepler and ellipses, binaries and tunnels.
- Use r = R + h in every orbit formula.
- Field inside a cavity in a uniform sphere is uniform.
- Ellipse: E = −GMm/2a fixes the speed at any distance.
- Tunnel through the Earth: SHM with period 84.6 min, the same as a surface-skimming orbit.

</div>
