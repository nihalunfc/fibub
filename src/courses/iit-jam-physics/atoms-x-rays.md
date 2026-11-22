---
title: The Bohr atom, spectra and X-rays
seoTitle: Bohr atom, spectra and X-rays for IIT JAM Physics
summary: 'Bohr''s model of hydrogen and hydrogen-like ions, the spectral series and the Rydberg formula, reduced-mass corrections, the Franck-Hertz experiment, and X-rays: the continuous spectrum and its cut-off, characteristic lines and Moseley''s law.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In the Bohr model, how does the radius of the n-th orbit of a hydrogen-like ion depend on n and Z?'
    choices: ['r ∝ n²/Z', 'r ∝ n/Z²', 'r ∝ Z²/n²', 'r ∝ n²Z']
    ans: 0
    why: 'r_n = n²a₀/Z. The orbit grows as n² and shrinks as the nuclear charge pulls harder; it is the energy that goes as Z²/n².'
  - q: 'The voltage on an X-ray tube is raised. What happens to the wavelengths of the characteristic Kα and Kβ lines?'
    choices: ['Nothing; they are fixed by the target element', 'They become shorter', 'They become longer', 'They disappear']
    ans: 0
    why: 'Characteristic lines come from jumps between inner shells of the target atoms. A higher voltage makes them stronger and moves the continuous cut-off to shorter wavelengths, but the line wavelengths stay put.'
  - q: 'Why do the visible Balmer lines not appear as absorption lines in cool hydrogen gas?'
    choices: ['Almost no atoms are in n = 2, the level Balmer absorption starts from', 'Visible light passes through hydrogen without interacting', 'Balmer lines exist only in emission', 'The Balmer lines are too weak']
    ans: 0
    why: 'Absorption starts from occupied levels. At room temperature practically every atom is in n = 1, so only the ultraviolet Lyman lines are absorbed. Hot stars have enough atoms in n = 2 to show Balmer absorption.'
sources:
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (2003), chapters 2 and 4: X-rays and atomic structure'
  - 'K. S. Krane, Modern Physics, 3rd ed. (2012), chapters 6 and 8'
  - 'H. E. White, Introduction to Atomic Spectra (1934), chapters 1 to 3'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 45 minutes.** By the end you will be able to use Bohr's formulas for radius, speed and energy in hydrogen and hydrogen-like ions, name and compute any spectral line, count lines, correct for the motion of the nucleus, explain the Franck-Hertz experiment, and read an X-ray spectrum using the Duane-Hunt cut-off and Moseley's law.

<div class="bigidea">An atom can hold only certain energies. Every spectral line, visible or X-ray, is the energy difference between two of those levels, carried away by one photon.</div>

## 1. Why a new model was needed

By 1911 Rutherford had shown that an atom is a tiny positive nucleus with electrons around it. Classical physics then says an orbiting electron radiates (it accelerates), loses energy and spirals into the nucleus in about `$10^{-11}$` s, giving a smear of all frequencies on the way. Real atoms are stable and emit sharp lines. Hydrogen's visible lines fitted a strange formula found by Balmer and Rydberg:

```math
\frac1\lambda = R\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right), \qquad R = 1.097\times10^7\ \text{m}^{-1}
```

Move the impact parameter, then switch on the whole beam and change the target and the energy.

<figure class="fig" data-fig="@qm-rutherford"><figcaption>A small impact parameter means a large deflection, and only an almost head-on α comes straight back. The counts fall as 1/sin⁴(θ/2).</figcaption></figure>

## 2. Bohr's model

Bohr (1913) kept the circular orbit but added two rules:

1. Only orbits with angular momentum `$L = mvr = n\hbar$` are allowed, and in them the electron does not radiate. (De Broglie's later reason, from [lesson 6.2](/learn/courses/iit-jam-physics/matter-waves/): a whole number of wavelengths must fit round the orbit, `$2\pi r = n\lambda$`.)
2. Light is emitted or absorbed only in jumps between allowed orbits, as one photon with `$h\nu = E_i - E_f$`.

Combine `$L = n\hbar$` with Coulomb's force providing the centripetal force, for a nucleus of charge `$Ze$`:

<div class="steps">
<div class="step"><p><b>Force balance.</b> mv²/r = Ze²/(4πε₀r²), so mv²r = Ze²/(4πε₀).</p></div>
<div class="step"><p><b>Quantise.</b> Divide by (mvr)² = n²ħ²: 1/(mr) = Ze²/(4πε₀n²ħ²), so r = n²·4πε₀ħ²/(Zme²) = n²a₀/Z.</p></div>
<div class="step"><p><b>Speed.</b> v = nħ/(mr) = Ze²/(4πε₀nħ) = Zαc/n, with α = e²/(4πε₀ħc) ≈ 1/137.</p></div>
<div class="step"><p><b>Energy.</b> Kinetic K = ½mv² = Ze²/(8πε₀r); potential U = −Ze²/(4πε₀r) = −2K. Total E = −K.</p></div>
<div class="step"><p><b>Put in r.</b> E = −Z²me⁴/(2(4πε₀)²n²ħ²) = −13.6 Z²/n² eV.</p></div>
</div>

```math
r_n = \frac{n^2a_0}{Z},\quad a_0 = 0.0529\ \text{nm}; \qquad v_n = \frac{Z\alpha c}{n}; \qquad E_n = -\frac{13.6\,Z^2}{n^2}\ \text{eV}
```

<div class="meaning">

<dl>
<dt>n</dt><dd>the principal quantum number, 1 for the lowest (ground) orbit</dd>
<dt>a₀</dt><dd>the Bohr radius, the size of the hydrogen atom in its ground state</dd>
<dt>13.6 eV</dt><dd>the energy needed to ionise hydrogen from the ground state (the Rydberg energy)</dd>
<dt>E = −K, U = −2K</dt><dd>in an orbit under a 1/r force: an electron further out moves slower and is less tightly bound</dd>
<dt>Z</dt><dd>the nuclear charge; the model works only for one electron: H, He⁺, Li²⁺, ...</dd>
</dl>

</div>

**Worked example.** For Li²⁺ (`$Z = 3$`) in `$n = 2$`, find the radius, the speed and the energy to remove the electron.

1. `$r = 4a_0/3 = 0.0705$` nm.
2. `$v = 3\times(c/137)/2 = 3.3\times10^6$` m/s.
3. `$E_2 = -13.6\times9/4 = -30.6$` eV, so 30.6 eV ionises it from this level.

Watch the scalings: radius `$\propto n^2/Z$`, energy `$\propto Z^2/n^2$`, speed `$\propto Z/n$`, orbital period `$\propto n^3/Z^2$`. The orbiting electron is also a current loop; for `$n = 1$` its magnetic moment is `$e\hbar/2m_e = 9.27\times10^{-24}$` A m², the Bohr magneton.

Step through it with the buttons below, or press Play, and use the controls on the picture to try your own values.

<div class="steps" data-fig="@qm-bohr-standing"><div class="step">n = 1: one wavelength fits round the smallest orbit (r = a₀, E = −13.6 eV).</div><div class="step">n = 2: two wavelengths, the orbit is four times larger.</div><div class="step">n = 3: three wavelengths; the electron is slower, its λ = h/mv is longer.</div><div class="step">n = 4: four wavelengths, L = 4ħ.</div><div class="step">n = 5: five wavelengths, E = −0.54 eV.</div><div class="step">n = 6: six wavelengths. Now try 'Any wavelength' and see why fractions fail.</div></div>

## 3. Spectral series

Every line is a jump down from `$n_i$` to `$n_f$`. Lines that end on the same level form a series:

| Series | Ends on | Region (hydrogen) | Longest line | Series limit |
|---|---|---|---|---|
| Lyman | `$n = 1$` | ultraviolet | 121.6 nm | 91.2 nm |
| Balmer | `$n = 2$` | visible and near UV | 656.3 nm (Hα, red) | 364.6 nm |
| Paschen | `$n = 3$` | infrared | 1875 nm | 820 nm |
| Brackett | `$n = 4$` | infrared | 4051 nm | 1458 nm |

The **series limit** is the jump from `$n = \infty$`: its energy equals the binding energy of the lower level. For hydrogen-like ions every wavelength is divided by `$Z^2$`.

<figure class="fig" data-fig="hydrogen-levels"><figcaption>Hydrogen's energy levels to scale with every line of the chosen series. Visible lines are drawn in their own colour. Switch to He⁺ and notice that its levels are four times deeper, so every line is four times bluer.</figcaption></figure>

**Worked example.** Find the wavelength of Hβ (`$4\to2$`).

1. `$1/\lambda = R(1/4 - 1/16) = R\times3/16 = 2.057\times10^6$` m⁻¹.
2. `$\lambda = 486.2$` nm, blue-green.

**Counting lines.** Atoms excited to level `$n$`, falling by every route, can give `$n(n - 1)/2$` different lines (one per pair of levels). One atom on one route gives at most `$n - 1$`.

**Emission and absorption.** A cool gas absorbs only from the levels its atoms occupy, almost always `$n = 1$`, so cool hydrogen absorbs Lyman lines only. A photon is absorbed only if its energy matches a gap exactly (or exceeds the ionisation energy); an electron in a collision, by contrast, can hand over any part of its energy.

<div class="problem" data-problem="rydberg-line"></div>

The [Hydrogen spectrum](/learn/hydrogen-spectrum/) tool lets you tap two levels and see the photon; the astronomy course's [spectral lines lesson](/learn/courses/astronomy/spectral-lines/) shows how the same lines identify elements in stars, and the [Spectral line identifier](/science/spectral-line-identifier/) matches the lines in a real spectrum.

## 4. Corrections and confirmations

**The nucleus moves.** Electron and nucleus both circle their centre of mass. Replace `$m_e$` with the reduced mass `$\mu = m_eM/(m_e + M)$`; energies scale with `$\mu$`, lengths with `$1/\mu$`. For hydrogen this lowers the energies by 0.05%. It also separates isotopes: deuterium's lines are about 0.18 nm bluer than hydrogen's Hα, which is how deuterium was discovered.

- **Positronium** (electron + positron): `$\mu = m_e/2$`, binding energy 6.8 eV, size `$2a_0$`.
- **Muonic hydrogen** (`$m_\mu = 207m_e$`): `$\mu \approx 186m_e$`, radius `$a_0/186 = 284$` fm, so the muon spends time close to the proton and feels its size.

**Recoil.** A free atom that emits a photon of energy `$E$` recoils with momentum `$E/c$`; for hydrogen's Lyman α the recoil speed is only 3.3 m/s, and the energy lost to recoil (about `$10^{-7}$` eV) is negligible for atoms, though not for gamma rays from nuclei.

**Franck-Hertz (1914).** Electrons accelerated through mercury vapour lose energy to atoms only in lumps of 4.9 eV; the current to a collector dips at 4.9 V, 9.8 V, ... and the vapour glows at `$1240/4.9 = 253$` nm. Discrete levels, shown without any light source.

**Where Bohr fails.** It gives hydrogen's energies correctly but nothing else: no line intensities, no fine structure, no helium, and it wrongly gives the ground state angular momentum `$\hbar$` (the real 1s state has zero). The [Schrödinger equation](/learn/courses/iit-jam-physics/schrodinger-equation/) in three dimensions gives the same energies with orbitals instead of orbits; the [Hydrogen orbital viewer](/science/hydrogen-orbitals/) shows them.

Bohr's circles were later replaced by orbitals. Click through 1s, 2s, 2p, 3s, 3p and the 3d shapes, and flip between density and sign, vertical and flat slices.

<figure class="fig" data-fig="@qm-orbital-slices"><figcaption>Count the rings (radial nodes, n − l − 1) and the flat nodal planes (l). Neighbouring lobes of a p or d orbital have opposite sign, drawn in the two colours.</figcaption></figure>

## 5. X-rays

An X-ray tube fires electrons, accelerated through tens of kilovolts, into a metal target. Its spectrum has two parts.

### The continuous spectrum and its sharp cut-off

Electrons slowing down in the target radiate **bremsstrahlung** ("braking radiation") of all wavelengths. No photon can carry more than one electron's whole kinetic energy `$eV$`, so there is a sharp short-wavelength limit:

```math
\lambda_{\min} = \frac{hc}{eV} = \frac{1240}{V}\ \text{nm} \quad (V \text{ in volts})
```

This **Duane-Hunt law** depends on the voltage only, never on the target: at 25 kV, `$\lambda_{\min} = 0.0496$` nm. It is the photoelectric effect run backwards.

### Characteristic lines and Moseley's law

If an incoming electron knocks a K-shell (`$n = 1$`) electron out of a target atom, an electron from a higher shell drops into the hole and emits an X-ray of definite energy: **Kα** from the L shell (`$n = 2$`), **Kβ** from the M shell (`$n = 3$`, so higher energy, shorter wavelength). This needs `$eV$` above the K-shell binding energy; below that, no K lines at all.

The electron dropping into the K shell sees the nucleus screened by the one K electron still there, so it is roughly hydrogen-like with charge `$(Z - 1)e$`:

```math
E_{K\alpha} \approx 13.6\,(Z - 1)^2\left(1 - \frac14\right)\ \text{eV} = 10.2\,(Z - 1)^2\ \text{eV}, \qquad \sqrt\nu \propto Z - 1
```

<figure class="fig" data-fig="xray-spectrum"><figcaption>A model X-ray tube spectrum. Raise the voltage and the cut-off moves to shorter wavelength while the Kα and Kβ lines stay where they are; below the K-shell energy of the target the lines vanish.</figcaption></figure>

**Worked example.** Estimate the Kα energy and wavelength for copper (`$Z = 29$`), and the lowest tube voltage that excites it.

1. `$E = 10.2\times28^2 = 7997$` eV `$\approx 8.0$` keV; `$\lambda = 1240/7997 = 0.155$` nm (measured: 0.154 nm).
2. To make K lines the tube must knock out a K electron: roughly `$13.6\times28^2 = 10.7$` keV in this simple model (the true K edge of copper is 9.0 keV). So about 9 to 11 kV is needed, not just 8 kV.

Moseley (1913) plotted `$\sqrt\nu$` against `$Z$` for many elements and got a straight line. It showed that the order of the periodic table is the order of nuclear charge, not mass (cobalt, 27, before nickel, 28, although cobalt is heavier), and it revealed gaps for undiscovered elements.

**Absorption edges.** A metal foil absorbs X-rays strongly just above the energy needed to eject its K electrons (the **K edge**) and much less just below it. The K edge of a metal lies a little above its own Kα energy. Nickel (`$Z = 28$`) has its K edge at 8.3 keV, between copper's Kα (8.0 keV) and Kβ (8.9 keV), so a thin nickel foil removes most of copper's Kβ while passing its Kα. With the Bragg law `$2d\sin\theta = n\lambda$`, characteristic X-rays become the tool of [lesson 7.2](/learn/courses/iit-jam-physics/x-ray-diffraction/) on crystal structure.

<div class="problem" data-problem="moseley-energy"></div>

<div class="myth">

**"A higher tube voltage makes all the X-rays harder, including the lines."** The voltage moves the *continuous* cut-off to shorter wavelengths and makes the lines brighter, but the line wavelengths are fingerprints of the target and never move. To change Kα you change the target, not the voltage.

**"The Balmer series is the hydrogen spectrum."** It is only the part that lands on `$n = 2$` and happens to be visible. The strongest hydrogen lines, Lyman, are in the ultraviolet and are the only ones a cool gas absorbs.

</div>

<div class="keypoints">

- Bohr: `$L = n\hbar$`; `$r_n = n^2a_0/Z$`, `$v_n = Z\alpha c/n$`, `$E_n = -13.6Z^2/n^2$` eV; `$U = -2K$`, `$E = -K$`.
- Lines: `$1/\lambda = RZ^2(1/n_f^2 - 1/n_i^2)$`. Lyman (`$n_f = 1$`, UV), Balmer (`$2$`, visible), Paschen (`$3$`, IR). Series limit = binding energy of the lower level.
- `$n(n-1)/2$` lines from level `$n$`; photons must match a gap exactly, electrons can give part of their energy.
- Reduced mass `$\mu = m_eM/(m_e + M)$`: isotope shifts (deuterium), positronium (6.8 eV), muonic atoms (radius `$\propto 1/\mu$`).
- X-rays: cut-off `$\lambda_{\min} = 1240/V$` nm (voltage only); characteristic lines fixed by the target; `$E_{K\alpha} \approx 10.2(Z - 1)^2$` eV, `$\sqrt\nu \propto Z - 1$`; Kβ is more energetic than Kα; K edge just above Kα.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [Bohr atom and X-rays practice page](/learn/courses/iit-jam-physics/practice/atoms-x-rays/).

<div class="qbank" data-bank="physics" data-topics="atoms-x-rays" data-exam="jam" data-n="10"></div>

**Next:** [lesson 6.5](/learn/courses/iit-jam-physics/nuclei-radioactivity/) moves from the electrons to the nucleus: binding energy and radioactivity. The GATE Physics course solves [the hydrogen atom](/learn/courses/gate-physics/hydrogen-atom/) exactly and adds [fine structure](/learn/courses/gate-physics/fine-structure/), [spin](/learn/courses/gate-physics/spin-addition/) and [the Zeeman effect](/learn/courses/gate-physics/zeeman-stark/).
