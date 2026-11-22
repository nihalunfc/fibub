---
title: "Einstein's cosmological constant returns"
seoTitle: "What is the cosmological constant? Lambda explained"
summary: "Einstein's cosmological constant Λ as an energy of empty space: what it is in the equations, how dense it is, why its pressure is negative, why it is weak nearby."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "If the universe doubles in size, what happens to the cosmological constant's energy in one cubic metre?"
    choices: ["Nothing: it stays exactly the same", "It falls 8 times, like matter", "It doubles"]
    ans: 0
    why: "Λ is a property of space itself, so every cubic metre has the same amount, at every time. Only the total in a growing region rises."
  - q: "Why must a cosmological constant have negative pressure, p = −ρc²?"
    choices: ["A growing box keeps the same density, so its energy rises, and that energy must come from work done stretching it, which needs a pull (tension)", "Because Einstein chose it that way", "Because it is made of antimatter"]
    ans: 0
    why: "Energy bookkeeping dE = −p dV with E = ρc²V and ρ constant gives p = −ρc². Like a stretched spring, it pulls back, and in general relativity that tension makes gravity push."
  - q: "Roughly how dense is the cosmological constant?"
    choices: ["About 6 × 10⁻²⁷ kg/m³, a few hydrogen atoms' worth per cubic metre", "About 1 kg/m³, like air", "Exactly zero"]
    ans: 0
    why: "It is about 69% of the critical density. Far too little to notice in a lab or the Solar System, but there is so much space that it dominates the universe."
sources:
  - "S. M. Carroll (2001), The cosmological constant, Living Reviews in Relativity 4, 1 https://doi.org/10.12942/lrr-2001-1"
  - "P. J. E. Peebles and B. Ratra (2003), The cosmological constant and dark energy, Reviews of Modern Physics 75, 559 https://doi.org/10.1103/RevModPhys.75.559"
  - "L. M. Krauss and M. S. Turner (1995), The cosmological constant is back, General Relativity and Gravitation 27, 1137 https://doi.org/10.1007/BF02108229"
  - "D. Lovelock (1971), The Einstein tensor and its generalizations, Journal of Mathematical Physics 12, 498 https://doi.org/10.1063/1.1665613"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 9 · about 15 minutes.** Read first: [4.6 Lemaître and the primeval atom](/learn/courses/cosmology/lemaitre/) (why Einstein added Λ in 1917 and dropped it in 1931) and [5.5 How each ingredient thins out](/learn/courses/cosmology/matter-radiation-dark-energy/). The supernovae of Lesson 9.1 said "something pushes". The simplest candidate was already in Einstein's equations. By the end you will be able to say what the cosmological constant is, work out its density, and explain why its pressure is negative.

<div class="bigidea">The cosmological constant is a fixed energy belonging to empty space itself. Make more space and you get more of it, at the same density. Anything like that must have a negative pressure, a tension, and in general relativity tension makes gravity push.</div>

## 1. One extra term

Einstein's field equation says "curvature of spacetime = matter and energy". The cosmological constant Λ (lambda) is one extra term:

```math
G_{\mu\nu} + \Lambda\, g_{\mu\nu} = \frac{8\pi G}{c^4}\, T_{\mu\nu}
```

<div class="meaning">

<dl>
<dt>G<sub>μν</sub></dt><dd>the curvature of spacetime (the Einstein tensor)</dd>
<dt>g<sub>μν</sub></dt><dd>the metric: the rule for measuring distances and times. Λg<sub>μν</sub> is the same everywhere, in every direction, for everyone</dd>
<dt>T<sub>μν</sub></dt><dd>everything that carries energy and momentum: matter, light, pressure</dd>
<dt>Λ</dt><dd>a single number with units of 1/length². Measured: about 1.1 × 10<sup>−52</sup> per square metre</dd>
<dt>Physical meaning</dt><dd>On the left, Λ is a property of space-time geometry. Move it to the right and it reads as a fluid filling all of space with a fixed energy density. The maths is identical; the two readings are two stories about the same thing.</dd>
</dl>

</div>

Is it a fudge? Not really. In 1971 the mathematician David Lovelock proved that in four dimensions, Einstein's equation **with Λ** is the only equation of its kind (built from the geometry, with no higher than second derivatives) that general relativity allows. Leaving Λ out is the special choice Λ = 0. Einstein first used it for the wrong reason, a static universe ([Lesson 5.7](/learn/courses/cosmology/classic-models/)); it is back for the right one, the measured acceleration.

## 2. How much is there?

Put Λ in the Friedmann equation ([Lesson 5.2](/learn/courses/cosmology/friedmann-equation/)) and it behaves exactly like an extra density:

```math
H^2 = \frac{8\pi G}{3}\,\rho - \frac{k c^2}{a^2} + \frac{\Lambda c^2}{3}, \qquad \rho_\Lambda = \frac{\Lambda c^2}{8\pi G}
```

<div class="meaning">

<dl>
<dt>Λc²/3</dt><dd>dark energy's share of H², a fixed amount that does not change as a grows</dd>
<dt>ρ<sub>Λ</sub></dt><dd>the same thing written as a mass density, to compare with matter</dd>
<dt>Physical meaning</dt><dd>With Ω<sub>Λ</sub> ≈ 0.69 and H<sub>0</sub> ≈ 67.7 km/s/Mpc, ρ<sub>Λ</sub> ≈ 0.69 × 8.6 × 10<sup>−27</sup> ≈ <b>6 × 10<sup>−27</sup> kg/m³</b>: about 3.5 hydrogen atoms' worth of mass-energy in each cubic metre, or about 5 × 10<sup>−10</sup> joules.</dd>
</dl>

</div>

<div class="problem" data-problem="cosmological-constant-density"></div>

## 3. The stretched box

Here is what makes Λ different from everything else, and where its odd pressure comes from.

<div class="steps" data-fig="cosmological-constant">
<div class="step">A box of space that grows with the universe. It holds some matter (the dots) and a cosmological constant (the even tint). The dashed frame is a fixed cubic metre that does not grow.</div>
<div class="step">The universe grows 1.5 times. The same dots spread through a box 3.4 times bigger, so fewer sit in each cubic metre. The tint is exactly as strong: every new cubic metre arrives with its own dark energy.</div>
<div class="step">The universe doubles. Matter per cubic metre is down 8 times. Dark energy per cubic metre has not changed, so the box holds 8 times more dark energy than at the start. Where did it come from?</div>
<div class="step">From the stretching. Dark energy pulls back on the growing box like a stretched spring (a negative pressure), so the expansion does work on it, and that work is exactly the new energy. The books balance only if p = −ρc².</div>
</div>

The bookkeeping in one line. A box of volume V holding energy E = ρc²V changes its energy by dE = −p dV when it grows (the same rule as a gas pushing a piston). With ρ fixed, dE = ρc² dV, so:

```math
\rho c^2\, dV = -p\, dV \quad\Rightarrow\quad p = -\rho c^2
```

<div class="meaning">

<dl>
<dt>p = −ρc²</dt><dd>a tension, not a push outwards. Gas pushes on the walls of its box; dark energy pulls on them</dd>
<dt>Physical meaning</dt><dd>In the acceleration equation (<a href="/learn/courses/cosmology/acceleration-equation/">Lesson 5.6</a>) the source of gravity is ρ + 3p/c² = ρ − 3ρ = −2ρ. Negative: gravity pushes. Strangely, it is the tension, not any outward pressure, that drives the acceleration. A uniform pressure, positive or negative, pushes nothing around by itself; only its gravity matters.</dd>
</dl>

</div>

## 4. Why it does nothing nearby

For a ball of matter the Newtonian limit of Einstein's equation with Λ gives a tiny extra outward acceleration, growing with distance r:

```math
\ddot r = -\frac{GM}{r^2} + \frac{\Lambda c^2}{3}\, r
```

**Worked example.** At the Earth's distance from the Sun, r = 1.5 × 10<sup>11</sup> m. The push is (1.1 × 10<sup>−52</sup> × 9 × 10<sup>16</sup> / 3) × 1.5 × 10<sup>11</sup> ≈ 5 × 10<sup>−25</sup> m/s². The Sun's pull is 6 × 10<sup>−3</sup> m/s², about 10<sup>22</sup> times stronger. Even across a galaxy cluster, gravity wins. Λ matters only across the hundreds of millions of light-years between groups of galaxies, where matter is spread thin.

<div class="problem" data-problem="cosmological-constant-earth"></div>

<div class="history">

**A constant that would not go away.** Einstein's 1917 static universe and his 1931 rejection of it are told in [Lesson 4.6](/learn/courses/cosmology/lemaitre/). After that, Λ kept coming back.

<ul class="timeline">
<li><b>1917</b> Einstein adds Λ; de Sitter finds a universe made of Λ alone.</li>
<li><b>1931</b> Einstein drops Λ; Lemaître keeps it, and later calls it an energy of the vacuum.</li>
<li><b>1967-68</b> Yakov Zel'dovich links Λ to the quantum energy of empty space (Lesson 9.3).</li>
<li><b>1990</b> George Efstathiou and colleagues argue that maps of galaxy clustering fit best with a large Λ.</li>
<li><b>1995</b> Lawrence Krauss and Michael Turner publish "The cosmological constant is back", and Jeremiah Ostriker and Paul Steinhardt make a similar case: galaxy ages and clustering need it.</li>
<li><b>1998</b> The supernovae show it directly (Lesson 9.1).</li>
</ul>

</div>

<div class="myth">

**"Dark energy is a force pushing galaxies outwards from the middle."** There is no middle and no outward force field. Λ is the same at every point; its effect is that the expansion rate of space stops falling and settles to a constant H = H<sub>0</sub>√Ω<sub>Λ</sub>. Distances between unbound galaxy groups then grow exponentially, doubling about every 12 billion years.

</div>

<div class="keypoints">

- The cosmological constant Λ is one extra term in Einstein's equation, the only extra term of its kind the theory allows (Lovelock, 1971). Read on the energy side, it is a fixed energy of empty space.
- ρ<sub>Λ</sub> = Λc²/(8πG) ≈ 6 × 10<sup>−27</sup> kg/m³, about 69% of the critical density; Λ ≈ 1.1 × 10<sup>−52</sup> m<sup>−2</sup>.
- Its density never changes as space grows, so the total in a growing region rises; energy bookkeeping then requires p = −ρc² (a tension, w = −1).
- That tension makes the source of gravity ρ + 3p/c² = −2ρ: gravity pushes.
- Locally it is negligible: 10<sup>22</sup> times weaker than the Sun's pull at the Earth.

</div>
