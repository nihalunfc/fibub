---
title: "The Friedmann equation, from a thrown ball"
seoTitle: "The Friedmann equation explained with a thrown ball"
summary: "Derive the Friedmann equation for the expanding universe from nothing more than a ball thrown upwards: energy of motion against gravity. What each term means, why there are three possible fates, and what general relativity adds."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "A ball is thrown up at exactly the escape speed. What happens?"
    choices: ["It keeps rising forever, slowing down but never stopping", "It falls back", "It speeds up"]
    ans: 0
    why: "Its energy of motion exactly matches the pull of gravity. It is the boundary between falling back and escaping, like a flat universe."
  - q: "In the Friedmann equation H² = (8πG/3)ρ − kc²/a², what does the k term stand for?"
    choices: ["The curvature of space, playing the part of the leftover energy of the thrown ball", "The speed of light", "Dark energy"]
    ans: 0
    why: "In the ball picture it is the total energy; in general relativity it becomes the shape of space: closed, flat or open."
  - q: "How does the expansion rate depend on density in a flat universe?"
    choices: ["H² is proportional to the density", "H is proportional to the density", "They are unrelated"]
    ans: 0
    why: "H² = 8πGρ/3: four times the density means twice the expansion rate."
sources:
  - "A. Friedmann (1922), Über die Krümmung des Raumes (On the curvature of space), Zeitschrift für Physik 10, 377 https://doi.org/10.1007/BF01332580"
  - "E. A. Milne and W. H. McCrea (1934), Newtonian universes and the curvature of space, Quarterly Journal of Mathematics 5, 73 https://doi.org/10.1093/qmath/os-5.1.73"
  - "B. Ryden (2017), Introduction to Cosmology, 2nd edition, Cambridge University Press https://doi.org/10.1017/9781316651087"
---

**Module 5 · about 16 minutes.** Read first: [5.1 The scale factor](/learn/courses/cosmology/scale-factor/). How does the scale factor change with time? The answer is one equation, found by Alexander Friedmann in 1922. Here we build it from a ball thrown into the air. By the end you will be able to say what each part of the Friedmann equation means and find the expansion rate from a density.

<div class="bigidea">The expansion of the universe behaves like a ball thrown upwards: gravity slows it, and whether it falls back depends on whether it was thrown faster than escape speed.</div>

## 1. Three throws

Stand on a small airless world and throw a ball straight up. There are only three possibilities:

- **Too slow:** it rises, stops and falls back.
- **Exactly the escape speed:** it rises forever, always slowing, never quite stopping.
- **Faster:** it escapes, keeping some speed forever.

<figure class="fig" data-fig="thrown-ball"><figcaption>Height against time for three throws. Pick a speed: below escape speed it falls back (closed), exactly at it it coasts forever ever more slowly (flat), above it it escapes with speed to spare (open).</figcaption></figure>

What decides it is energy. Energy of motion, ½v², against the energy needed to climb out of gravity, GM/r. Their total, E, stays fixed:

```math
\tfrac12 v^2 - \frac{G M}{r} = E
```

## 2. From a ball to the universe

Now picture a huge sphere of the universe, radius r, centred anywhere. A galaxy on its surface feels the pull of all the mass inside (Newton showed the outside does not matter). Write the sphere's radius as r = a × r<sub>map</sub>, so its speed is v = ȧ × r<sub>map</sub>, and its mass is the density times the volume, M = (4/3)πr³ρ. Put these in the ball's energy and divide by ½ a² r<sub>map</sub>²:

```math
\left(\frac{\dot a}{a}\right)^{2} = H^{2} = \frac{8\pi G}{3}\,\rho \;-\; \frac{k c^{2}}{a^{2}}
```

<div class="meaning">

<dl>
<dt>H<sup>2</sup></dt><dd>the expansion rate, squared: the "energy of motion" of the universe</dd>
<dt>(8πG/3) ρ</dt><dd>the pull of everything in it. More stuff, more pull. ρ includes every kind of energy, divided by c²</dd>
<dt>k c<sup>2</sup>/a<sup>2</sup></dt><dd>the leftover total energy of the thrown ball. In general relativity this becomes the <b>curvature of space</b>: k &gt; 0 closed, k = 0 flat, k &lt; 0 open</dd>
<dt>Physical meaning</dt><dd>The faster the universe expands, the more stuff it must hold to be flat. If it holds more, gravity wins (closed); less, the expansion wins (open).</dd>
</dl>

</div>

This is the **Friedmann equation**. The Newtonian shortcut was found by Edward Milne and William McCrea in 1934; Friedmann got it in 1922 from Einstein's full theory, which adds two things the ball cannot: the k term really is the shape of space, and pressure and light also pull.

<div class="problem" data-problem="friedmann-rate"></div>

## 3. Why it works for the whole universe

There is no centre in the argument. Any sphere, around any galaxy, gives the same equation, because the universe is the same everywhere ([Lesson 4.8](/learn/courses/cosmology/cosmological-principle/)). That is why one equation, with one a(t), describes all of it.

<div class="history">

**A soldier and a weatherman.** Alexander Friedmann trained as a mathematician, flew bombing missions and forecast the weather for Russia's air force in the First World War, then turned to Einstein's theory. In 1922 and 1924 he found all three kinds of universe: closed, flat and open. He died of typhoid in 1925, aged 37, before anyone saw galaxies receding.

</div>

<div class="myth">

**"Gravity pulls galaxies towards the centre of the sphere, so the universe has a centre."** The sphere was chosen around an arbitrary point. Choose a different galaxy as the centre and you get exactly the same equation. The sphere is a calculating trick, not a real place.

</div>

<div class="keypoints">

- A thrown ball either falls back, coasts forever, or escapes, depending on its total energy.
- The same reasoning applied to a sphere of the universe gives the Friedmann equation: H² = (8πG/3)ρ − kc²/a².
- The density term is the pull of the contents; the k term is the curvature of space (closed, flat or open).
- In a flat universe, H² = 8πGρ/3: the density alone sets the expansion rate.

</div>
