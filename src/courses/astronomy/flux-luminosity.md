---
title: "Flux, luminosity and the inverse-square law"
seoTitle: "Flux, luminosity and the inverse-square law | Astronomy"
summary: "A star's luminosity is its true power; its flux is how much reaches each square metre here. Light spreads over a sphere, so flux falls as one over distance squared, and magnitudes turn that into the distance modulus."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Move a lamp three times further away. Its flux becomes:"
    choices: ["1/3 as much", "1/9 as much", "1/27 as much"]
    ans: 1
    why: "Flux ∝ 1/d², and 3² = 9."
  - q: "Absolute magnitude is the apparent magnitude a star would have at:"
    choices: ["1 AU", "1 light-year", "10 parsecs"]
    ans: 2
    why: "Astronomers compare stars as if they were all 10 pc away."
  - q: "A star has m − M = 10. How far is it?"
    choices: ["100 pc", "1,000 pc", "10,000 pc"]
    ans: 1
    why: "d = 10^(μ/5 + 1) = 10^3 = 1,000 pc."
sources:
  - "IAU 2015 nominal solar luminosity; IAU 2015 Resolution B2 (absolute magnitude zero point)"
---

**Module 1 · about 25 minutes · squares and logarithms.** You'll be able to tell flux from luminosity, use the inverse-square law, and turn apparent and absolute magnitude into a distance.

## 1. Why this matters

A bright star in the sky might be a weak star nearby or a monster far away. To know which, astronomers separate two ideas: how much light a star sends out, and how much arrives here. Linking them by distance is how the size of the universe was measured (in the [cosmology course](/learn/courses/cosmology/)).

## 2. Power and what reaches you

**Luminosity** `$L$` is the total power a star gives off, in watts. The Sun's is `$3.83\times10^{26}$` W. **Flux** `$F$` is how much of that power falls on each square metre at your distance, in W/m². The light spreads out evenly over a growing sphere, so at twice the distance the same power covers four times the area.

<!--fig:inverse-square-->

Things to notice:

- Each step of 10 times further makes the star 100 times fainter, which is exactly 5 magnitudes.
- At 10 pc the Sun would be magnitude 4.8, barely visible from a suburb.
- Raise the luminosity and the whole line slides up the same amount.

<details class="maths" open>
<summary>Maths and principle</summary>

**Inverse-square law:**

```math
F = \frac{L}{4\pi d^2}
```

**Magnitudes** ([Sky watching 1.7](/learn/courses/sky-watching/magnitudes/)) compare fluxes: `$m_1 - m_2 = -2.5\log_{10}(F_1/F_2)$`.

**Absolute magnitude** `$M$` is the magnitude a star would have at 10 parsecs. Combining the two gives the **distance modulus**:

```math
m - M = 5\log_{10}\left(\frac{d}{10\ \text{pc}}\right) \quad\Longleftrightarrow\quad d = 10^{(m - M)/5 + 1}\ \text{pc}
```

**Try it:** the Sun at 1 AU: `$F = 3.83\times10^{26}/(4\pi\times(1.496\times10^{11})^2) = 1361$` W/m², the solar constant.
</details>

## 3. What it means physically

Nothing is lost on the way. The light is just shared out over a bigger and bigger sphere, so each square metre (or each telescope mirror) catches a smaller share. That is why a distance-free number like luminosity, or absolute magnitude, is the fair way to compare stars. If you know a star's true power from its type (Lesson 3.2), its faintness tells you how far away it is.

## 4. Worked example

*A star like the Sun (M = 4.8) appears at magnitude 9.8. How far is it, and how much flux reaches us compared with sunlight?*

```math
d = 10^{(9.8 - 4.8)/5 + 1} = 10^{2} = 100\ \text{pc}
```

That is `$100\times206{,}265 = 2.06\times10^7$` AU. The flux is `$1361/(2.06\times10^7)^2 = 3.2\times10^{-12}$` W/m², about three trillionths of sunlight.

## 5. Practice

1. A star is four times further away than an identical one. How many magnitudes fainter is it?
2. What is the solar constant at Mars, 1.52 AU from the Sun?
3. A star has m = 12 and M = −3. How far is it?

<details>
<summary>Answers</summary>

1. Flux is 16 times smaller: `$2.5\log_{10}16 = 3.0$` magnitudes.
2. `$1361/1.52^2 = 589$` W/m².
3. `$d = 10^{15/5 + 1} = 10^4 = 10{,}000$` pc.
</details>

**Try it with real numbers:** convert between magnitudes and fluxes with the [[magnitude-flux-converter]].

**New words:** *luminosity*, *flux*, *inverse-square law*, *absolute magnitude*, *distance modulus*, *solar constant*.
