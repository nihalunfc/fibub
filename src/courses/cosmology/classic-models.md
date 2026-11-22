---
title: "The classic universes: Einstein, de Sitter and Einstein-de Sitter"
seoTitle: "Einstein, de Sitter and Einstein-de Sitter universes"
summary: "The famous model universes that the Friedmann equation allows: Einstein's static universe, de Sitter's empty expanding one, the matter-only Einstein-de Sitter universe, closed universes that end in a Big Crunch, open ones, and today's ΛCDM, compared on one plot."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "How does the size of an Einstein-de Sitter (flat, matter-only) universe grow with time?"
    choices: ["As t to the power 2/3", "Exponentially", "It stays the same"]
    ans: 0
    why: "Gravity keeps slowing it, and the Friedmann equation gives a ∝ t^(2/3). Its age is 2/3 of the Hubble time."
  - q: "What is special about the de Sitter universe?"
    choices: ["It holds only dark energy, grows exponentially and has no beginning", "It is static", "It collapses after 10 billion years"]
    ans: 0
    why: "With a constant expansion rate, it doubles in size every fixed time, forever, in both directions of time."
  - q: "Which classic model is our universe becoming more like?"
    choices: ["de Sitter", "Einstein's static universe", "A closed universe heading for a Big Crunch"]
    ans: 0
    why: "As matter thins out, only dark energy is left, and the expansion settles into de Sitter's steady exponential growth."
sources:
  - "A. Einstein and W. de Sitter (1932), On the relation between the expansion and the mean density of the universe, PNAS 18, 213 https://doi.org/10.1073/pnas.18.3.213"
  - "W. de Sitter (1917), On Einstein's theory of gravitation and its astronomical consequences. Third paper, MNRAS 78, 3 https://doi.org/10.1093/mnras/78.1.3"
  - "A. Friedmann (1924), Über die Möglichkeit einer Welt mit konstanter negativer Krümmung des Raumes, Zeitschrift für Physik 21, 326 https://doi.org/10.1007/BF01328280"
---

**Module 5 · about 14 minutes.** Read first: [5.6 The acceleration equation](/learn/courses/cosmology/acceleration-equation/). With the Friedmann equations and three ingredients, we can now draw whole histories of universes. Here are the famous ones, from Einstein's to ours. By the end you will be able to sketch the history of a universe from what it contains.

<div class="bigidea">Change the recipe and you change the whole history: static, a Big Crunch, an endless coast or runaway growth. Our universe started like one classic model and is turning into another.</div>

## 1. Six universes on one plot

<figure class="fig" data-fig="classic-models"><figcaption>Size against time for six model universes, all set to match today's size and expansion rate (H₀ = 70) so their shapes can be compared. Tap a name to highlight it and read its story.</figcaption></figure>

<ul class="timeline">
<li><b>Einstein static (1917):</b> matter balanced by a cosmological constant. Never changes size, but is unstable, like a pencil on its point.</li>
<li><b>de Sitter (1917):</b> no matter, only a cosmological constant. Grows exponentially, a ∝ e<sup>Ht</sup>, with no beginning and no end.</li>
<li><b>Closed (Friedmann, 1922):</b> more than the critical matter. Expands, stops, recollapses in a <b>Big Crunch</b>.</li>
<li><b>Open (Friedmann, 1924):</b> less than the critical matter. Expands forever, slowing towards a steady coast.</li>
<li><b>Einstein-de Sitter (1932):</b> exactly the critical matter, flat. Slows forever, a ∝ t<sup>2/3</sup>. The textbook favourite for 60 years.</li>
<li><b>ΛCDM (1998 onwards):</b> 31% matter, 69% dark energy, flat. Slowed at first like Einstein-de Sitter, now speeding up towards de Sitter.</li>
</ul>

## 2. Two simple solutions

For a flat universe with one ingredient, the Friedmann equation can be solved exactly:

```math
\text{matter only: } a \propto t^{2/3}, \quad t_0 = \tfrac{2}{3}\,\tfrac{1}{H_0}; \qquad \text{dark energy only: } a \propto e^{H t}
```

<div class="meaning">

<dl>
<dt>t<sup>2/3</sup></dt><dd>growth that keeps slowing: 8 times the time gives only 4 times the size</dd>
<dt>e<sup>Ht</sup></dt><dd>exponential growth with a fixed rate H, like money at fixed interest: the size doubles every ln 2 / H</dd>
<dt>Physical meaning</dt><dd>Matter's pull fades as it thins, so its brake weakens but never lets go. Dark energy never thins, so its push stays the same and growth compounds.</dd>
</dl>

</div>

**Worked example.** Our universe is heading for de Sitter growth with H = H<sub>0</sub>√Ω<sub>Λ</sub> = 70 × √0.69 ≈ 58 km/s/Mpc. Then 1/H = 977.8 / 58 ≈ 16.8 billion years, and the doubling time is 0.693 × 16.8 ≈ **11.7 billion years**. Every 11.7 billion years, every distance between galaxy groups will double.

<div class="problem" data-problem="de-sitter-doubling"></div>

<div class="history">

**A two-page paper.** In 1932 Einstein and de Sitter, once rivals over static versus empty universes, wrote a short paper together proposing the simplest expanding universe: flat, matter only, no cosmological constant. Einstein-de Sitter remained the default model in textbooks until the supernova results of 1998.

</div>

<div class="myth">

**"A closed universe must end in a Big Crunch."** Only if there is no dark energy. With enough dark energy, even a closed universe can expand forever. Shape and fate are separate questions once Λ is included.

</div>

<div class="keypoints">

- Einstein static: balanced and unstable. de Sitter: dark energy only, exponential, no beginning.
- Closed matter universes recollapse (Big Crunch); open ones coast forever; flat matter-only (Einstein-de Sitter) grows as t<sup>2/3</sup> and is 2/3 of the Hubble time old.
- Our universe (ΛCDM) behaved like Einstein-de Sitter early on and is turning into de Sitter, doubling about every 12 billion years.

</div>
