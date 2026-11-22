---
title: "Is dark energy changing? The equation of state w"
seoTitle: "Dark energy equation of state w, explained simply"
summary: "One number, w = pressure ÷ energy density, says how an ingredient thins out and whether it speeds up the expansion. Plus w0 and wa for dark energy that changes."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "What value of w does a cosmological constant have?"
    choices: ["Exactly −1, at all times", "0, like matter", "1/3, like light"]
    ans: 0
    why: "Its pressure is p = −ρc², so w = p/(ρc²) = −1, and its density never changes."
  - q: "Which kinds of stuff can make the expansion speed up?"
    choices: ["Anything with w below −1/3", "Anything with positive pressure", "Only matter"]
    ans: 0
    why: "Gravity's source is ρ(1 + 3w). It turns negative, a push, only when w < −1/3."
  - q: "In the description w(a) = w0 + wa(1 − a), what does wa measure?"
    choices: ["How much w has changed since the universe was young", "Today's value of w", "The amount of dark energy"]
    ans: 0
    why: "w0 is today's value; wa is how different it was when the universe was much smaller (at a = 0, w = w0 + wa)."
sources:
  - "M. Chevallier and D. Polarski (2001), Accelerating universes with scaling dark matter, International Journal of Modern Physics D 10, 213 https://doi.org/10.1142/S0218271801000822"
  - "E. V. Linder (2003), Exploring the expansion history of the universe, Physical Review Letters 90, 091301 https://doi.org/10.1103/PhysRevLett.90.091301"
  - "B. Ratra and P. J. E. Peebles (1988), Cosmological consequences of a rolling homogeneous scalar field, Physical Review D 37, 3406 https://doi.org/10.1103/PhysRevD.37.3406"
  - "R. R. Caldwell, R. Dave and P. J. Steinhardt (1998), Cosmological imprint of an energy component with general equation of state, Physical Review Letters 80, 1582 https://doi.org/10.1103/PhysRevLett.80.1582"
  - "R. R. Caldwell (2002), A phantom menace? Cosmological consequences of a dark energy component with super-negative equation of state, Physics Letters B 545, 23 https://doi.org/10.1016/S0370-2693(02)02589-3"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 9 · about 15 minutes.** Read first: [9.2 Einstein's cosmological constant returns](/learn/courses/cosmology/cosmological-constant/) and [5.6 The acceleration equation](/learn/courses/cosmology/acceleration-equation/). After the vacuum energy puzzle (Lesson 9.3), many physicists suspect dark energy is not a perfect constant but something that changes slowly. To test that, you need a way to describe "how constant". By the end you will be able to use the number w to say how any ingredient thins out and whether it speeds the expansion up.

<div class="bigidea">Divide an ingredient's pressure by its energy density and you get one number, w. It tells you how fast that ingredient thins out as space grows and whether its gravity pulls or pushes. Measuring w over cosmic time is how we test whether dark energy is Einstein's constant.</div>

## 1. One number for each ingredient

```math
w = \frac{p}{\rho c^2}
```

<ul class="timeline">
<li><b>Matter, w = 0:</b> slow particles have almost no pressure compared with their mass-energy.</li>
<li><b>Radiation, w = 1/3:</b> light pushes on the walls of its box with a third of its energy density.</li>
<li><b>Cosmological constant, w = −1:</b> a tension exactly equal to its energy density (Lesson 9.2).</li>
</ul>

Energy bookkeeping in a growing box (the same dE = −p dV as in Lesson 9.2) gives how each one thins out:

```math
\rho \propto a^{-3(1+w)}
```

<div class="meaning">

<dl>
<dt>a</dt><dd>the scale factor, the size of the universe compared with today</dd>
<dt>−3(1 + w)</dt><dd>the power that sets how fast it fades: −3 for matter, −4 for radiation, 0 for Λ</dd>
<dt>Physical meaning</dt><dd>The "3" is spreading into a bigger volume. Positive pressure (light) makes the ingredient lose energy as the box grows, so it fades faster. Tension (w &lt; 0) makes it gain energy, so it fades more slowly; at w = −1 it does not fade at all, and below −1 it actually gets denser.</dd>
</dl>

</div>

This is the rule behind Lesson 5.5's three slopes, now with any w you like.

<div class="problem" data-problem="equation-of-state-thinning"></div>

## 2. The line at −1/3

In the acceleration equation, gravity's source is ρ + 3p/c² = ρ(1 + 3w). That is negative, a push, only when **w < −1/3**. So "dark energy" means any smooth ingredient with w below −1/3 that fills space. For a whole universe, the deceleration parameter adds up each ingredient's share:

```math
q_0 = \tfrac12 \sum_i \Omega_i\,(1 + 3w_i)
```

<div class="meaning">

<dl>
<dt>Ω<sub>i</sub></dt><dd>each ingredient's share of the critical density today</dd>
<dt>1 + 3w<sub>i</sub></dt><dd>how hard it pulls: 1 for matter, 2 for light, −2 for a cosmological constant</dd>
<dt>Physical meaning</dt><dd>With matter (w = 0) and Λ (w = −1) this is q<sub>0</sub> = Ω<sub>m</sub>/2 − Ω<sub>Λ</sub>, the formula from Lesson 5.6. With w = −0.5 instead of −1, the same 69% of dark energy pushes only a quarter as hard.</dd>
</dl>

</div>

<div class="problem" data-problem="equation-of-state-q0"></div>

## 3. Dark energy that changes

If dark energy is not a constant, the simplest idea is a new field filling space, like the Higgs field, but extremely light. Picture a ball on an almost flat slope. While it barely moves, almost all its energy is the height (potential energy), which acts like a tension, and w is close to −1. As it starts to roll, its motion (kinetic energy) adds positive pressure and w rises towards 0. This kind of dark energy is called **quintessence**, after the fifth element of ancient philosophy. It always has w between −1 and +1.

Data cannot test every possible w(a), so cosmologists use two numbers, proposed by Michel Chevallier and David Polarski in 2001 and Eric Linder in 2003 (often called CPL):

```math
w(a) = w_0 + w_a\,(1 - a) = w_0 + w_a\,\frac{z}{1+z}
```

<div class="meaning">

<dl>
<dt>w<sub>0</sub></dt><dd>today's value (a = 1)</dd>
<dt>w<sub>a</sub></dt><dd>the change: when the universe was very small (a → 0), w was w<sub>0</sub> + w<sub>a</sub></dd>
<dt>Physical meaning</dt><dd>A cosmological constant is the single point w<sub>0</sub> = −1, w<sub>a</sub> = 0. Any measured shift away from that point means dark energy is not Einstein's Λ.</dd>
</dl>

</div>

<figure class="fig" data-fig="equation-of-state"><figcaption>Top: w against redshift for your choice of w₀ and wₐ. Bottom: the density of that dark energy as the universe grows (today = 1), against matter (dashed) and a cosmological constant (dotted). Try w₀ = −0.8, wₐ = −0.8: today it thins slowly, but long ago its density was lower and rising.</figcaption></figure>

Things to try. Set w<sub>0</sub> below −1: the dark energy gets **denser** as space grows. That is called **phantom** dark energy (Robert Caldwell, 2002). It is hard to make from any well-behaved field, and it leads to the Big Rip of Lesson 9.5. Set w<sub>0</sub> above −1/3: the readout says the expansion stops speeding up.

## 4. What we measure

Assume w is constant and combine the CMB, galaxy maps and supernovae: the Planck team (2018) found **w = −1.03 ± 0.03**. A cosmological constant fits, to within a few per cent. Letting w change is harder, because w<sub>0</sub> and w<sub>a</sub> trade off against each other. The newest maps of the universe have started to pull them away from (−1, 0): that is Lesson 9.6.

<div class="history">

**Rolling fields and phantoms.**

<ul class="timeline">
<li><b>1988</b> Bharat Ratra and Jim Peebles, and separately Christof Wetterich, propose a slowly rolling field as a changing cosmological "constant".</li>
<li><b>1998</b> Robert Caldwell, Rahul Dave and Paul Steinhardt name it quintessence and work out its imprint on the CMB and galaxies.</li>
<li><b>2001-2003</b> Chevallier, Polarski and Linder introduce the w<sub>0</sub>-w<sub>a</sub> description, still the standard.</li>
<li><b>2002</b> Caldwell explores phantom energy with w below −1.</li>
<li><b>2018</b> Planck plus other data: w = −1.03 ± 0.03.</li>
</ul>

</div>

<div class="myth">

**"w = −1 means dark energy has negative energy."** Its energy density is positive (Ω<sub>Λ</sub> ≈ +0.69). It is the <em>pressure</em> that is negative. Negative energy density would do the opposite: slow the expansion and could even make the universe recollapse.

</div>

<div class="keypoints">

- The equation of state w = p/(ρc²): matter 0, radiation 1/3, cosmological constant −1.
- Density thins as ρ ∝ a<sup>−3(1+w)</sup>: w = −1 never thins; w &lt; −1 (phantom) grows denser.
- Gravity's source is ρ(1 + 3w), so speeding up needs w &lt; −1/3. In general q<sub>0</sub> = ½ΣΩ<sub>i</sub>(1 + 3w<sub>i</sub>).
- Changing dark energy (quintessence: a slowly rolling field) is described by w(a) = w<sub>0</sub> + w<sub>a</sub>(1 − a); Λ is (−1, 0).
- Measured with constant w: −1.03 ± 0.03.

</div>
