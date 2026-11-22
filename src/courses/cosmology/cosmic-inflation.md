---
title: "Cosmic inflation"
seoTitle: "What is cosmic inflation? The universe's first growth spurt"
summary: "A split second of runaway expansion, driven by a field rolling slowly down a hill, can make the universe smooth and flat. How inflation works, slow roll, reheating and why it needs about 60 e-folds."
minutes: 18
updated: 2026-11-22
quiz:
  - q: "What drives inflation?"
    choices: ["The heat of the Big Bang explosion","A field (the inflaton) whose energy acts almost like a cosmological constant, with w close to −1, so gravity pushes","Dark matter"]
    ans: 1
    why: "While the field rolls slowly, its energy density hardly changes as space grows. Like dark energy today, but about 10¹¹⁰ times denser, it makes the expansion speed up exponentially."
  - q: "How does inflation solve the flatness problem?"
    choices: ["During inflation aH grows, so |Ω − 1| = |k|c²/(aH)² shrinks as e^(−2N): 60 e-folds flatten it by about 10⁵²","It removes all matter","It makes the universe closed"]
    ans: 0
    why: "Like a balloon blown up 10²⁶ times wider, any patch we can see looks flat, whatever the overall shape."
  - q: "What is reheating?"
    choices: ["The CMB warming up today","Stars turning on","The end of inflation, when the inflaton's energy turns into hot particles, starting the hot Big Bang"]
    ans: 2
    why: "During inflation everything else is diluted to nothing. When the field reaches the bottom of its hill it rocks back and forth and decays, filling space with radiation."
sources:
  - "A. H. Guth (1981), Inflationary universe: a possible solution to the horizon and flatness problems, Physical Review D 23, 347 https://doi.org/10.1103/PhysRevD.23.347"
  - "A. D. Linde (1982), A new inflationary universe scenario: a possible solution of the horizon, flatness, homogeneity, isotropy and primordial monopole problems, Physics Letters B 108, 389 https://doi.org/10.1016/0370-2693(82)91219-9"
  - "A. Albrecht and P. J. Steinhardt (1982), Cosmology for grand unified theories with radiatively induced symmetry breaking, Physical Review Letters 48, 1220 https://doi.org/10.1103/PhysRevLett.48.1220"
  - "A. A. Starobinsky (1980), A new type of isotropic cosmological models without singularity, Physics Letters B 91, 99 https://doi.org/10.1016/0370-2693(80)90670-X"
  - "A. D. Linde (1983), Chaotic inflation, Physics Letters B 129, 177 https://doi.org/10.1016/0370-2693(83)90837-7"
  - "Planck Collaboration (2020), Planck 2018 results. X. Constraints on inflation, A&A 641, A10 https://doi.org/10.1051/0004-6361/201833887"
  - "D. Baumann (2009), TASI lectures on inflation, arXiv:0907.5424 https://arxiv.org/abs/0907.5424"
---

**Module 11 · about 18 minutes.** Read first: [11.1 The horizon and flatness problems](/learn/courses/cosmology/horizon-flatness-problems/) and [9.2 The cosmological constant](/learn/courses/cosmology/cosmological-constant/). Inflation is the leading idea for what happened before the hot Big Bang. It is not proven, but it explains the three puzzles of Lesson 11.1 and made predictions that later measurements confirmed. By the end you will be able to explain how it works and what "60 e-folds" means.

<div class="bigidea">For a tiny fraction of a second, space doubled in size again and again, at least 80 times, driven by an energy that acted like a huge cosmological constant. Everything we can see grew from one microscopic, smooth patch, stretched flat.</div>

## 1. A cosmological constant, turned up and switched off

In [Lesson 9.2](/learn/courses/cosmology/cosmological-constant/) you saw that an energy whose density stays the same as space grows has a negative pressure, p = −ρc², and makes gravity push. Put a constant density in the Friedmann equation and the expansion rate H stays constant, so:

```math
a(t) = a_i\, e^{H t}, \qquad N = \ln\frac{a_\text{end}}{a_i}
```

<div class="meaning">

<dl>
<dt>a<sub>i</sub>, a<sub>end</sub></dt><dd>the scale factor at the start and end of inflation</dd>
<dt>H</dt><dd>the expansion rate, nearly constant during inflation</dd>
<dt>N</dt><dd>the number of <b>e-folds</b>: how many times space grew by a factor e ≈ 2.718. One e-fold is about 1.44 doublings</dd>
<dt>Physical meaning</dt><dd>Exponential growth: every 1/H seconds, sizes grow e times. In the far future dark energy will do the same, with 1/H about 17 billion years. During inflation 1/H might have been as short as 10<sup>−38</sup> s.</dd>
</dl>

</div>

Inflation is that idea at enormous energy: a density perhaps 10<sup>110</sup> times that of today's dark energy (if inflation ran at the 10<sup>16</sup> GeV scale often assumed), which then switches itself off. 60 e-folds is a growth of e<sup>60</sup> ≈ 10<sup>26</sup>: a grain of sand would end up more than ten times wider than the Milky Way.

<div class="problem" data-problem="cosmic-inflation-efolds"></div>

## 2. How it solves the puzzles

The key quantity is aH, the rate at which distances grow. In a slowing universe aH falls; during inflation it grows as e<sup>Ht</sup>. Equivalently, the **Hubble distance measured on the stretching map**, c/(aH), shrinks. Regions that were close enough to be in contact get flung beyond each other's reach.

- **Horizon:** before inflation, one tiny region had time to even itself out. Inflation stretched it to far larger than everything we can see today. The CMB patches of Lesson 11.1 are the same temperature because they were once neighbours.
- **Flatness:** |Ω − 1| = |k|c²/(aH)² shrinks as e<sup>−2N</sup>. Whatever curvature space had, 60 e-folds divide it by about 10<sup>52</sup>.
- **Monopoles:** any made before or early in inflation are spread so thin that our whole observable universe holds probably none, as long as the universe never gets hot enough to make them again afterwards.

<figure class="fig" data-fig="cosmic-inflation-2"><figcaption>The flatness magnifier. Slide the number of e-folds: the balloon grows, the patch we can see stays the same size, and its curvature vanishes.</figcaption></figure>

## 3. Slow roll: a ball on a gentle hill

What has that energy, and how does it switch off? In 1982 Andrei Linde, and separately Andreas Albrecht and Paul Steinhardt, gave the answer still used today: a field, the **inflaton** φ, that fills space and holds energy V(φ), like a ball on a hill. The ball obeys:

```math
\ddot\phi + 3H\dot\phi + V'(\phi) = 0, \qquad H^2 = \frac{8\pi G}{3c^2}\left(\tfrac12\dot\phi^2 + V(\phi)\right)
```

<div class="meaning">

<dl>
<dt>V(φ)</dt><dd>the height of the hill: the energy density stored in the field (a potential energy)</dd>
<dt>½φ̇²</dt><dd>the field's energy of motion (kinetic energy)</dd>
<dt>3Hφ̇</dt><dd>a friction from the expansion itself ("Hubble friction"): the faster space grows, the more it holds the ball back</dd>
<dt>Physical meaning</dt><dd>On a gentle slope the ball creeps, so its energy is almost all V and nearly constant: w ≈ −1, and space inflates. The expansion speeds up as long as φ̇² &lt; V (from ρ + 3p/c² &lt; 0, Lesson 5.6). When the slope steepens, the ball speeds up and inflation stops.</dd>
</dl>

</div>

Cosmologists track this with the **slow-roll parameter** ε = −Ḣ/H²: inflation lasts while ε &lt; 1. A plateau like Starobinsky's (below) keeps ε tiny for a long time.

<figure class="fig" data-fig="cosmic-inflation"><figcaption>The inflaton, solved for real (Starobinsky's plateau, in Planck units). Top: the ball on its hill. Bottom: the growth of the universe, ln a, against time. The straight line is exponential growth. Start the ball a little higher and the number of e-folds jumps.</figcaption></figure>

<div class="problem" data-problem="cosmic-inflation-duration"></div>

## 4. Reheating: the hot Big Bang begins

Inflation dilutes everything: any matter or radiation present at the start is spread to nothing. The universe is cold and empty, apart from the field. At the bottom of the hill the field rocks back and forth, and like a plucked string losing energy to the air, it decays into other particles. They collide, share their energy and reach a temperature. This is **reheating**. From here on, the story is the hot Big Bang of Modules 6 and 7. How hot it got is not known: anything from a few MeV (needed for the light elements to form) to about 10<sup>15</sup> GeV, depending on the model.

So "the Big Bang" in the sense of a hot, dense, expanding soup is the end of inflation, not the absolute beginning.

## 5. How much inflation?

The patch that became our observable universe must have fitted inside one connected region when inflation began. Tracing that patch back through the history of expansion gives a minimum of about **60 e-folds** for inflation at the high energies usually assumed, or about 50 if inflation happened at lower energy. More is fine: once the problems are solved, extra inflation changes nothing we can see.

<div class="history">

**From a notebook to the standard picture.**

<ul class="timeline">
<li><b>1980</b> Alexei Starobinsky, in Moscow, finds a de Sitter-like early phase from quantum corrections to gravity (an R² term). Demosthenes Kazanas and Katsuhiko Sato publish related ideas in 1980-81.</li>
<li><b>1981</b> Alan Guth names "inflation" and shows it solves the horizon, flatness and monopole problems (Phys. Rev. D 23, 347). His version, "old inflation", cannot end smoothly: bubbles of normal space never join up.</li>
<li><b>1982</b> Linde, and Albrecht and Steinhardt, invent "new inflation": a slow roll that ends everywhere smoothly.</li>
<li><b>1983</b> Linde's "chaotic inflation": no special starting state, just a field displaced up a simple hill.</li>
<li><b>1992-2018</b> COBE, WMAP and Planck confirm inflation's predictions: flat space and nearly scale-invariant ripples (Lessons 11.3 and 11.4). Planck favours plateau-shaped hills like Starobinsky's.</li>
</ul>

</div>

<div class="myth">

**"Inflation broke the speed of light."** Nothing moved through space faster than light. Space itself grew, and relativity puts no speed limit on that (the same is true today for galaxies beyond the Hubble distance, [Lesson 5.9](/learn/courses/cosmology/cosmic-horizons/)). Also: inflation is not proven. It is the best-supported explanation, and some cosmologists argue for alternatives such as a bounce from an earlier contracting phase.

</div>

<div class="keypoints">

- Inflation is a brief phase of exponential expansion, a(t) ∝ e<sup>Ht</sup>, driven by an energy that acts like a huge cosmological constant (w ≈ −1).
- It makes c/(aH) shrink: one small smooth region grows larger than our whole observable universe (horizon problem), curvature falls as e<sup>−2N</sup> (flatness), and monopoles are diluted away.
- In slow-roll inflation, a field called the inflaton creeps down a gentle hill; inflation lasts while ε = −Ḣ/H² &lt; 1, that is while φ̇² &lt; V.
- At the end the field oscillates and decays into particles: reheating starts the hot Big Bang.
- At least about 60 e-folds (a growth of 10<sup>26</sup>) are needed. At the often-assumed energy of 10<sup>16</sup> GeV they take only about 10<sup>−36</sup> s; at lower energies, longer.

</div>
