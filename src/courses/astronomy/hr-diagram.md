---
title: "The Hertzsprung-Russell diagram: a map of the stars"
seoTitle: "The Hertzsprung-Russell diagram explained | Astronomy"
summary: "Plot stars by temperature and luminosity and they fall into groups: the main sequence, giants, supergiants and white dwarfs. Lines of equal radius run across the diagram, so each spot tells you a star's size too."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Most stars, including the Sun, lie on:"
    choices: ["The giant branch", "The main sequence", "The white dwarf sequence"]
    ans: 1
    why: "Stars spend about 90% of their lives fusing hydrogen in their cores, on the main sequence."
  - q: "A star is cool (3,500 K) but very luminous. It must be:"
    choices: ["Very large", "Very small", "Very close"]
    ans: 0
    why: "L = 4πR²σT⁴. Low T and high L means a huge R: a giant or supergiant."
  - q: "The spectral class order from hottest to coolest is:"
    choices: ["A B F G K M O", "O B A F G K M", "M K G F A B O"]
    ans: 1
    why: "O B A F G K M, hottest blue O stars to coolest red M stars."
sources:
  - "Stefan-Boltzmann constant and solar values: IAU 2015 Resolution B3 (nominal solar values), iau.org"
  - "Sirius A and B, Betelgeuse: rounded values from SIMBAD, simbad.cds.unistra.fr"
---

**Module 3 · about 25 minutes · read first: [1.2 Blackbody radiation: colour is temperature](/learn/courses/astronomy/blackbody-radiation/), [1.5 Flux, luminosity and the inverse square law](/learn/courses/astronomy/flux-luminosity/), [3.1 Parallax: measuring the distance to a star](/learn/courses/astronomy/parallax/) · maths: the luminosity formula.** You'll be able to read an HR diagram, place a star on it, work out its radius from its temperature and luminosity, and name the main groups of stars.

<div class="bigidea">Plot stars by temperature and luminosity and they fall into a few groups, the main sequence, giants and white dwarfs, and because L = 4πR²σT⁴, every spot on the diagram also tells you the star's size.</div>

## 1. Why this matters

Around 1910, Ejnar Hertzsprung and Henry Norris Russell each plotted stars' brightness against their colour, and found that stars are not scattered randomly. The diagram they made is the most important picture in stellar astronomy: it shows how stars live and die, it measures the ages of star clusters, and it is how astronomers sort millions of stars from surveys like Gaia.

## 2. Reading the map

- **Across**: surface temperature, drawn hot on the left (blue) to cool on the right (red). Astronomers also use the **spectral classes** O, B, A, F, G, K, M from hot to cool; the Sun is a G star.
- **Up**: luminosity, the star's true power, usually on a log scale.
- **Main sequence**: a band from hot, bright, heavy stars (top left) to cool, dim, light ones (bottom right). These stars are fusing hydrogen in their cores.
- **Giants and supergiants**: top right, cool but hugely luminous, so enormous.
- **White dwarfs**: bottom left, hot but faint, so tiny.

<!--fig:hr-plot-->

Things to notice:

- Making a star bigger at the same temperature moves it straight up; making it hotter at the same size moves it up and left.
- The dashed lines of equal radius show the giants are 10 to 100 times the Sun's size and white dwarfs about 1/100.

Place five stars on the diagram, one at a time:

<div class="steps">
<div class="step"><b>The axes.</b> Temperature runs along the bottom, hot on the left (astronomers' tradition), and luminosity up the side, both on log scales.</div>
<div class="step"><b>The Sun.</b> 5,772 K and 1 L☉: the middle of a diagonal band called the main sequence, where stars fuse hydrogen in their cores.</div>
<div class="step"><b>Sirius A.</b> 9,900 K and 25 L☉: higher and to the left on the same band. Hotter main-sequence stars are also more massive and brighter.</div>
<div class="step"><b>Betelgeuse.</b> About 3,600 K but about 100,000 L☉: top right. Cool yet very bright, so it must be huge: a red supergiant.</div>
<div class="step"><b>Sirius B.</b> About 25,000 K yet only 0.06 L☉: bottom left. Hot but faint, so it must be tiny: a white dwarf about the size of Earth.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Luminosity, radius and temperature** (Lesson 1.2), in solar units so the constants cancel:

```math
\frac{L}{L_\odot} = \left(\frac{R}{R_\odot}\right)^2\left(\frac{T}{T_\odot}\right)^4, \qquad T_\odot = 5772\ \text{K}
```

On log axes this is a straight line for each radius:

```math
\log\frac{L}{L_\odot} = 2\log\frac{R}{R_\odot} + 4\log\frac{T}{T_\odot}
```

**Try it:** a star of 2 R☉ at 5,772 K has `$L = 4$` L☉.
</details>

## 3. What it means physically

Where a star sits is set mainly by its mass and its age. A main-sequence star's mass fixes how hard gravity squeezes it, so how hot its core gets and how fast it burns (Lesson 3.3). When the core runs out of hydrogen, the star swells into a giant and moves to the upper right. At the end, the exposed core is left as a white dwarf at the lower left. So the diagram is a picture of life stories, frozen at one moment.


<div class="meaning">

<dl>
<dt>L</dt><dd>Luminosity, usually in units of the Sun's (L☉).</dd>
<dt>T</dt><dd>Surface temperature, from colour or spectral type.</dd>
<dt>L/L☉ = (R/R☉)² (T/T☉)⁴</dt><dd>Size, temperature and power are tied together, so lines of equal radius cross the diagram.</dd>
<dt>Physical meaning</dt><dd>The HR diagram is like a chart of people's height and weight: most fall on one band (the main sequence, stars in the long middle of life), and the outliers are in special stages. Because a star spends 90% of its life on the main sequence, that is where most stars sit.</dd>
</dl>

</div>

<div class="myth">

**"Stars move along the main sequence as they age."** A star stays at almost the same spot on the main sequence for most of its life; its place there is set by its mass. Only when the core hydrogen runs out does it leave, swelling into a giant.

</div>

## 4. Worked example

*A star has temperature 3,500 K and luminosity 1,000 L☉. How big is it, and what kind of star is it?*

```math
\frac{R}{R_\odot} = \sqrt{\frac{L}{L_\odot}}\left(\frac{T_\odot}{T}\right)^2 = \sqrt{1000}\times\left(\frac{5772}{3500}\right)^2 = 31.6\times2.72 = 86
```

86 times the Sun's radius: a red giant. A main-sequence star at 3,500 K would be a dim red dwarf of about 0.03 L☉.

## 5. Practice

<div class="problem" data-problem="star-luminosity"></div>

**More practice** (answers below):

1. A white dwarf has 10,000 K and 0.001 L☉. What is its radius in R☉ and in km (R☉ = 696,000 km)?
2. Two stars have the same temperature; one is 100 times more luminous. How do their sizes compare?
3. Where on the diagram would you find a hot, young, heavy star?

<details>
<summary>Answers</summary>

1. `$R = \sqrt{0.001}\times(5772/10{,}000)^2 = 0.0316\times0.333 = 0.0105$` R☉ = 7,300 km, a bit bigger than Earth.
2. `$R \propto \sqrt{L}$` at the same T: 10 times bigger.
3. Top left of the main sequence (O and B stars).
</details>

<div class="keypoints">

- The HR diagram plots luminosity against temperature (hot on the left).
- Main sequence: hydrogen-burning stars; position set by mass.
- Giants and supergiants are top right (cool, big); white dwarfs bottom left (hot, small).
- L = R²T⁴ in solar units, so each point also gives a radius.

</div>

**Try it with real numbers:** plot real clusters on the [[hr-diagram]] tool, and turn colours into temperatures with the [[blackbody-calculator]].

**New words:** *Hertzsprung-Russell diagram*, *main sequence*, *spectral class*, *giant*, *supergiant*, *white dwarf*, *red dwarf*.
