---
title: "The horizon and flatness problems"
seoTitle: "The horizon problem and flatness problem explained"
summary: "Why is the CMB the same temperature in places that never met? Why is space so close to flat? Three puzzles the plain Big Bang cannot explain, and the numbers behind them."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "What is the horizon problem?"
    choices: ["Parts of the CMB sky more than about 2° apart could never have exchanged light, yet they have the same temperature to 1 part in 100,000","We cannot see beyond the edge of the observable universe","The CMB is too cold to be from a Big Bang"]
    ans: 0
    why: "In the plain Big Bang, the sky at the time of the CMB splits into about 10⁴ patches that had no time to swap heat. Their equal temperatures look like a coincidence on a vast scale."
  - q: "Why is a nearly flat universe today a puzzle?"
    choices: ["Because flat universes cannot expand","Because Einstein said space must be curved","Any departure from flatness grows with time, so it must have started incredibly close to flat: within about 10⁻⁶⁰ at the Planck time"]
    ans: 2
    why: "|Ω − 1| grows in proportion to time while radiation rules, and as t^(2/3) while matter rules. To be below 0.002 today it had to be fantastically small early on."
  - q: "Why is the monopole problem only a problem if grand unified theories are right?"
    choices: ["Those theories predict heavy magnetic monopoles made in the early universe; without them there would be nothing to explain","Monopoles are made by stars","Because monopoles are dark energy"]
    ans: 0
    why: "Grand unified theories predict roughly one monopole per horizon-sized region when the forces split. That would far outweigh everything else, yet none has ever been found."
sources:
  - "A. H. Guth (1981), Inflationary universe: a possible solution to the horizon and flatness problems, Physical Review D 23, 347 https://doi.org/10.1103/PhysRevD.23.347"
  - "R. H. Dicke and P. J. E. Peebles (1979), The big bang cosmology: enigmas and nostrums, in General Relativity: An Einstein Centenary Survey, eds S. W. Hawking and W. Israel, Cambridge University Press"
  - "C. W. Misner (1969), Mixmaster universe, Physical Review Letters 22, 1071 https://doi.org/10.1103/PhysRevLett.22.1071"
  - "J. P. Preskill (1979), Cosmological production of superheavy magnetic monopoles, Physical Review Letters 43, 1365 https://doi.org/10.1103/PhysRevLett.43.1365"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 11 · about 16 minutes.** Read first: [5.9 Horizons](/learn/courses/cosmology/cosmic-horizons/) and [5.4 The shape of space](/learn/courses/cosmology/shape-of-space/). The Big Bang theory explains the expanding universe, the CMB and the light elements beautifully. But it takes the starting state for granted, and that starting state is very odd. By the end you will be able to explain, with numbers, why the universe looks too smooth and too flat to be an accident.

<div class="bigidea">Run the plain Big Bang backwards and you find a universe that started out smooth across regions that had never been in touch, and balanced on a knife-edge between collapse and emptiness. It works, but only if the start was tuned to absurd precision. These puzzles set the stage for inflation.</div>

## 1. A sky that is too smooth: the horizon problem

The cosmic microwave background has the same temperature, 2.7255 K, in every direction, to about 1 part in 100,000 ([Lesson 7.4](/learn/courses/cosmology/cmb-anisotropies/)). For a cup of tea, equal temperature is no surprise: hot and cold parts mix until they agree. Mixing needs contact, though, and contact cannot travel faster than light.

When the CMB was released, 380,000 years after the start, light had only had 380,000 years to travel. Space has stretched a lot since, so that patch of "everything a point could have heard from" now looks small on our sky: about 1° across, roughly twice the width of the full Moon. Our telescopes see CMB from every direction, including spots far more than a degree apart.

<div class="steps" data-fig="horizon-flatness-problems">
<div class="step">A map where light always moves at 45° (distance across on a map that stretches with space, time up). Our past light cone, the path of all light reaching us today, meets the CMB at two opposite points, A and B.</div>
<div class="step">Anything that ever influenced A lies in A's own past light cone. A's cone and B's cone reach the Big Bang without touching. Nothing could ever have carried heat from one to the other, yet they have the same temperature.</div>
<div class="step">It is not just A and B. The whole CMB sky is made of about ten thousand patches that could never have exchanged a signal, all at the same temperature.</div>
<div class="step">Preview of Lesson 11.2: if something added a long stretch of time before the hot Big Bang, the cones would reach far enough back to overlap. A and B could have grown from one region that had already evened out.</div>
</div>

How big is one patch? On the stretching map, the distance light could travel before the CMB was released is about 280 Mpc; the CMB itself is now about 13,900 Mpc away (Planck 2018 values). So one patch spans an angle:

```math
\theta_{H} \approx \frac{\eta_{\text{rec}}}{\eta_0 - \eta_{\text{rec}}} \approx \frac{280}{13\,900} \approx 0.020\ \text{rad} \approx 1.2^\circ
```

<div class="meaning">

<dl>
<dt>η<sub>rec</sub></dt><dd>the horizon when the CMB was released: how far light could have travelled since the start, measured on the stretching map. About 280 Mpc</dd>
<dt>η<sub>0</sub> − η<sub>rec</sub></dt><dd>how far the CMB's light has travelled since, on the same map: about 13,900 Mpc</dd>
<dt>θ<sub>H</sub></dt><dd>the angle on our sky covered by one region that could have been in contact</dd>
<dt>Physical meaning</dt><dd>Two points more than about 2θ<sub>H</sub> ≈ 2° apart never shared any past at all. The whole sky, 4π radians², holds about 4/θ<sub>H</sub>² ≈ 10<sup>4</sup> such patches.</dd>
</dl>

</div>

<div class="problem" data-problem="horizon-flatness-problems-angle"></div>

## 2. A knife-edge: the flatness problem

In [Lesson 5.3](/learn/courses/cosmology/critical-density/) you met Ω, the density of the universe divided by the critical density. Ω = 1 means flat space. The Friedmann equation tells us how far from 1 it can drift:

```math
\Omega - 1 = \frac{k c^2}{a^2 H^2}
```

<div class="meaning">

<dl>
<dt>k</dt><dd>the curvature of space: positive for closed, negative for open, zero for flat. It is fixed</dd>
<dt>a, H</dt><dd>the scale factor and the expansion rate</dd>
<dt>aH</dt><dd>how fast distances between galaxies grow. In a slowing universe aH falls with time</dd>
<dt>Physical meaning</dt><dd>While the expansion slows, aH shrinks, so |Ω − 1| grows: as a² (in proportion to time) while radiation rules, and as a (as t<sup>2/3</sup>) while matter rules. Flatness is an unstable balance, like a pencil standing on its point.</dd>
</dl>

</div>

Today |Ω − 1| is below about 0.002 ([Lesson 5.4](/learn/courses/cosmology/shape-of-space/)). Run that backwards. At one second it must have been below about 10<sup>−18</sup>. At the Planck time, about 10<sup>−43</sup> s, below about 10<sup>−62</sup>, and even if today's value were as large as 1 it would still have to start below about 10<sup>−60</sup>. A start a little denser and the universe would have collapsed within moments; a little thinner and it would have flown apart before any star could form.

<figure class="fig" data-fig="horizon-flatness-problems-2"><figcaption>|Ω − 1| from the Planck time to today, for the value you choose at one second. Make it ten times bigger and today's universe is ten times more curved; a thousand times bigger and curvature takes over long before today.</figcaption></figure>

<div class="problem" data-problem="horizon-flatness-problems-tuning"></div>

## 3. Missing monopoles

The third puzzle comes from particle physics. Grand unified theories, which join the strong, weak and electromagnetic forces at about 10<sup>16</sup> GeV, predict that as the universe cooled below that energy, very heavy **magnetic monopoles** (single north or south magnetic poles) were made: roughly one per region the size of the horizon at the time. In 1979 John Preskill worked out how many: enough to outweigh all the atoms in the universe many billions of times over. Searches have never found a single one.

This puzzle is weaker than the other two, because grand unification is itself unproven. If those theories are wrong, there is no monopole problem. But in 1979 most particle physicists expected them to be right.

## 4. Puzzles, not contradictions

None of this breaks the Big Bang theory. The equations work fine if you simply start them with a smooth, flat universe. The question is why the start looked like that. A theory that needs its starting numbers set to 60 decimal places explains nothing about them. Physicists prefer a mechanism that makes a smooth, flat universe the natural outcome, whatever the start. That is what inflation, the next lesson, offers.

<div class="history">

**Naming the puzzles.**

<ul class="timeline">
<li><b>1956</b> Wolfgang Rindler defines cosmic horizons precisely.</li>
<li><b>1969</b> Charles Misner states the horizon problem and tries to solve it with a chaotically wobbling "mixmaster" universe. It does not work.</li>
<li><b>1969</b> Robert Dicke points out in lectures that the expansion must have been balanced extraordinarily finely early on.</li>
<li><b>1979</b> Dicke and Jim Peebles name the flatness problem; John Preskill calculates the monopole problem.</li>
<li><b>Dec 1979</b> Alan Guth, working on monopoles with Henry Tye, notices that a burst of exponential expansion would solve all three. He publishes in 1981.</li>
</ul>

</div>

<div class="myth">

**"The universe was tiny at the start, so everything was in contact."** Smaller, yes, but also younger. In a slowing universe the horizon (how far light has gone) grows in proportion to time, while distances between places grow more slowly, as t<sup>1/2</sup> or t<sup>2/3</sup>. Going back in time, the horizon shrinks faster than the distances, so earlier on, the parts of space we now see were even less in touch.

</div>

<div class="keypoints">

- **Horizon problem:** when the CMB was released, one causally connected patch spans only about 1° of our sky, so the CMB is made of about 10<sup>4</sup> patches that never exchanged a signal, yet all have the same temperature to 1 part in 100,000.
- **Flatness problem:** Ω − 1 = kc²/(a²H²) grows as the expansion slows (∝ t with radiation, ∝ t<sup>2/3</sup> with matter). To be below 0.002 today, |Ω − 1| had to be below about 10<sup>−18</sup> at one second and about 10<sup>−60</sup> at the Planck time.
- **Monopole problem:** grand unified theories predict heavy magnetic monopoles that would outweigh everything else; none has been found.
- These are puzzles about starting conditions, not contradictions. Inflation (Lesson 11.2) was invented to explain them.

</div>
