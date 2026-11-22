---
title: "Spectral lines: the fingerprints of atoms"
seoTitle: "Spectral lines and how atoms make them | Astronomy"
summary: "Each kind of atom gives out and absorbs light only at its own set of wavelengths. Hydrogen's lines follow one simple formula, and lines in starlight tell us what stars are made of."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A thin, hot gas seen against a dark background shows:"
    choices: ["A smooth rainbow", "Bright lines at certain wavelengths", "Dark lines on a rainbow"]
    ans: 1
    why: "Hot thin gas gives out light only at its own wavelengths: an emission spectrum."
  - q: "Hydrogen's red H-alpha line comes from an electron dropping from level:"
    choices: ["2 to 1", "3 to 2", "4 to 3"]
    ans: 1
    why: "H-alpha is the 3 → 2 jump, the first Balmer line, at 656 nm."
  - q: "Dark lines in the Sun's spectrum are made by:"
    choices: ["Cooler gas above the hot surface absorbing certain wavelengths", "Gaps in the Sun's surface", "Earth's Moon"]
    ans: 0
    why: "Atoms in the Sun's outer layers absorb their own wavelengths from the light below, leaving dark absorption lines."
sources:
  - "Rydberg constant, CODATA 2018 (NIST)"
---

**Module 1 · about 25 minutes · fractions and the Rydberg formula.** You'll be able to explain where spectral lines come from, work out hydrogen's visible lines, and tell an emission spectrum from an absorption spectrum.

## 1. Why this matters

In 1835 a philosopher, Auguste Comte, wrote that we would never know what stars are made of. Within 30 years spectroscopes had shown sodium, iron and hydrogen in the Sun. Spectral lines are how we know the make-up of stars, nebulae and galaxies billions of light-years away, how fast they move (Lesson 1.4) and how hot they are.

## 2. Atoms have fixed energy steps

An electron in an atom can only sit on certain energy levels, like the rungs of a ladder with no in-between. To jump up a rung it must absorb a photon with exactly the right energy. When it falls back down it gives out a photon of exactly that energy. Since energy fixes wavelength (`$E = hc/\lambda$`), each jump makes one sharp wavelength: a **spectral line**.

Each element has its own ladder, so its own pattern of lines, as unique as a fingerprint.

<!--fig:hydrogen-lines-->

Things to notice:

- Jumps that end on level 2 (the Balmer series) land in visible light.
- Bigger jumps make more energetic, bluer photons. The lines crowd together towards a limit near 365 nm.
- Switch between emission and absorption: the same wavelengths, bright on dark or dark on bright.

<details class="maths" open>
<summary>Maths and principle</summary>

**Hydrogen's energy levels:**

```math
E_n = -\frac{13.6\ \text{eV}}{n^2}, \qquad n = 1, 2, 3, \dots
```

**The Rydberg formula** for a jump between levels `$n_1 < n_2$`, with `$R_H = 1.0968\times10^{7}$` m⁻¹:

```math
\frac{1}{\lambda} = R_H\left(\frac{1}{n_1^2} - \frac{1}{n_2^2}\right)
```

**Try it:** H-alpha, 3 → 2: `$1/\lambda = 1.0968\times10^7\,(1/4 - 1/9) = 1.523\times10^6$` m⁻¹, so `$\lambda = 656.5$` nm in vacuum (656.3 nm in air).

**Kirchhoff's three rules:** a hot dense object gives a smooth (continuous) spectrum; a hot thin gas gives bright emission lines; a cooler thin gas in front of a hot source gives dark absorption lines.
</details>

## 3. What it means physically

The rungs exist because an electron bound to an atom behaves like a wave that must fit neatly around the nucleus; only certain patterns fit, and each has its own energy. So a spectral line is a direct message from inside an atom: this exact jump happened here. The red glow of nebulae in photographs is H-alpha, hydrogen atoms whose electrons were knocked loose by ultraviolet starlight and are falling back down the ladder.

## 4. Worked example

*What is the wavelength of H-beta, the 4 → 2 jump, and how much energy does each photon carry?*

```math
\frac{1}{\lambda} = 1.0968\times10^7\left(\frac{1}{4} - \frac{1}{16}\right) = 1.0968\times10^7\times0.1875 = 2.0565\times10^6\ \text{m}^{-1}
```

`$\lambda = 486.3$` nm in vacuum (486.1 nm in air), blue-green. Energy: `$E = 13.6\,(1/4 - 1/16) = 2.55$` eV, the same as `$1240/486 = 2.55$` eV.

## 5. Practice

1. Find the wavelength of H-gamma (5 → 2).
2. What is the shortest wavelength in the Balmer series (`$n_2 \to \infty$`)?
3. A spectrum shows a smooth rainbow with dark lines. What kind of object and setting is this?

<details>
<summary>Answers</summary>

1. `$1/\lambda = 1.0968\times10^7\,(1/4 - 1/25) = 2.303\times10^6$`, so `$\lambda = 434.2$` nm (434.0 nm in air).
2. `$1/\lambda = R_H/4$`, so `$\lambda = 4/1.0968\times10^7 = 364.7$` nm.
3. A hot, dense source (like a star's surface) seen through cooler gas: an absorption spectrum.
</details>

**Try it with real numbers:** match lines in a spectrum to their elements with the [[spectral-line-identifier]].

**New words:** *energy level*, *spectral line*, *emission spectrum*, *absorption spectrum*, *Balmer series*, *Rydberg formula*.
