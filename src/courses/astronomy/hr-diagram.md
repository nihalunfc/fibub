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
sources: []
---

**Module 3 · about 25 minutes · the luminosity formula.** You'll be able to read an HR diagram, place a star on it, work out its radius from its temperature and luminosity, and name the main groups of stars.

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

## 4. Worked example

*A star has temperature 3,500 K and luminosity 1,000 L☉. How big is it, and what kind of star is it?*

```math
\frac{R}{R_\odot} = \sqrt{\frac{L}{L_\odot}}\left(\frac{T_\odot}{T}\right)^2 = \sqrt{1000}\times\left(\frac{5772}{3500}\right)^2 = 31.6\times2.72 = 86
```

86 times the Sun's radius: a red giant. A main-sequence star at 3,500 K would be a dim red dwarf of about 0.03 L☉.

## 5. Practice

1. A white dwarf has 10,000 K and 0.001 L☉. What is its radius in R☉ and in km (R☉ = 696,000 km)?
2. Two stars have the same temperature; one is 100 times more luminous. How do their sizes compare?
3. Where on the diagram would you find a hot, young, heavy star?

<details>
<summary>Answers</summary>

1. `$R = \sqrt{0.001}\times(5772/10{,}000)^2 = 0.0316\times0.333 = 0.0105$` R☉ = 7,300 km, a bit bigger than Earth.
2. `$R \propto \sqrt{L}$` at the same T: 10 times bigger.
3. Top left of the main sequence (O and B stars).
</details>

**Try it with real numbers:** plot real clusters on the [[hr-diagram]] tool, and turn colours into temperatures with the [[blackbody-calculator]].

**New words:** *Hertzsprung-Russell diagram*, *main sequence*, *spectral class*, *giant*, *supergiant*, *white dwarf*, *red dwarf*.
