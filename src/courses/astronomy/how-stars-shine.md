---
title: "How stars shine: fusion, balance and lifetimes"
seoTitle: "How stars shine: fusion and star lifetimes | Astronomy"
summary: "A star is a ball of gas balanced between gravity squeezing in and pressure pushing out, heated by fusing hydrogen into helium. Heavy stars burn so fast that they live millions of years; small ones live trillions."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A star 10 times the Sun's mass, compared with the Sun, lives:"
    choices: ["10 times longer", "About as long", "Hundreds of times shorter"]
    ans: 2
    why: "It has 10 times the fuel but burns it thousands of times faster, so it lives only tens of millions of years."
  - q: "What stops a star from collapsing under its own gravity?"
    choices: ["Its spin", "Gas pressure from its hot interior", "Magnetic fields"]
    ans: 1
    why: "Hydrostatic equilibrium: the pressure of hot gas balances the weight of the layers above."
  - q: "In hydrogen fusion, the energy comes from:"
    choices: ["Helium being slightly lighter than the four hydrogen nuclei that made it", "Chemical burning", "Electrons dropping energy levels"]
    ans: 0
    why: "About 0.7% of the mass disappears and becomes energy, E = mc²."
sources: []
---

**Module 3 · about 25 minutes · ratios and powers.** You'll be able to explain what keeps a star stable, describe how fusion makes energy, and estimate how long a star of a given mass will live.

## 1. Why this matters

Almost every atom heavier than helium, including the carbon in you and the iron in your blood, was made inside stars. Knowing how stars work explains where the elements came from, why the sky has the stars it has, and how old star clusters are.

## 2. A balancing act

A star is a huge ball of hydrogen and helium. Gravity pulls every part towards the centre. The deeper you go, the more weight presses down, so the gas gets squeezed and hot. Hot gas pushes back. Where the push exactly matches the weight, the star is stable: **hydrostatic equilibrium**.

In the core, at about 15 million K for the Sun, nuclei crash together hard enough to fuse. In stars like the Sun, protons join step by step into helium (the **proton-proton chain**). In heavier stars, carbon, nitrogen and oxygen act as helpers in the faster **CNO cycle**.

<!--fig:star-lifetime-->

Things to notice:

- Twice the Sun's mass gives about 16 times the power, so the star lives only about an eighth as long.
- Stars below about 0.9 Suns live longer than the universe's age: every one ever born is still shining.
- The heaviest stars live only a few million years, a blink in cosmic time.

<details class="maths" open>
<summary>Maths and principle</summary>

**Energy from fusion:** four protons make one helium-4 nucleus with 0.7% less mass. Per kilogram of hydrogen:

```math
E = 0.007\,m c^2 = 0.007\times1\times(3\times10^{8})^2 = 6.3\times10^{14}\ \text{J}
```

**Mass-luminosity rule** for main-sequence stars (rough, for about 0.5 to 2 Suns):

```math
\frac{L}{L_\odot} \approx \left(\frac{M}{M_\odot}\right)^{4}
```

**Lifetime** = fuel ÷ burn rate, scaled so the Sun lives about 10 billion years:

```math
t \approx 10^{10}\ \text{yr}\times\frac{M/M_\odot}{L/L_\odot} \approx 10^{10}\ \text{yr}\times\left(\frac{M}{M_\odot}\right)^{-3}
```
</details>

## 3. What it means physically

A star controls itself. If its core gets too hot, fusion speeds up, the extra heat makes the core expand and cool, and fusion slows again. A heavier star needs more pressure to hold up its greater weight, so its core is hotter and denser; fusion rates rise very steeply with temperature, so it burns far faster than its extra fuel can make up for. That is why the brightest stars in the sky are short-lived.

## 4. Worked example

*How long will a star of 2 solar masses stay on the main sequence?*

```math
\frac{L}{L_\odot} \approx 2^4 = 16, \qquad t \approx 10^{10}\times\frac{2}{16} = 1.25\times10^{9}\ \text{years}
```

About 1.2 billion years, compared with 10 billion for the Sun. A star cluster that still has 2-Sun stars on its main sequence must be younger than that.

## 5. Practice

1. Using `$L \propto M^4$`, how luminous is a 0.5 solar-mass star, and how long does it live?
2. How much energy does fusing 1 gram of hydrogen release? Compare with burning 1 kg of petrol (about `$4.6\times10^{7}$` J).
3. A cluster's main sequence stops at stars of 3 Suns; heavier ones have left. Roughly how old is it?

<details>
<summary>Answers</summary>

1. `$0.5^4 = 0.0625$` L☉; `$t = 10^{10}\times0.5/0.0625 = 8\times10^{10}$` years (80 billion).
2. `$6.3\times10^{11}$` J, more than 10,000 times the energy of burning a kilogram of petrol.
3. `$t \approx 10^{10}\times3^{-3} = 3.7\times10^{8}$` years, a few hundred million years.
</details>

**Try it with real numbers:** find cluster ages from the turn-off on the [[hr-diagram]], and see how star power sets planet temperatures with the [[habitable-zone-calculator]].

**New words:** *hydrostatic equilibrium*, *nuclear fusion*, *proton-proton chain*, *CNO cycle*, *mass-luminosity relation*, *main-sequence lifetime*.
