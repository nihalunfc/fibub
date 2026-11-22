---
title: Vibrational spectra
seoTitle: Vibrational and IR spectra of diatomics for GATE Physics
summary: 'The bond as a spring: harmonic levels, force constants and zero-point energy, the infrared selection rule, the Morse potential with anharmonic levels, overtones, hot bands and dissociation energies, vibration-rotation bands with P and R branches and combination differences, normal modes of polyatomic molecules, and the Franck-Condon principle.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A diatomic molecule has ω̃e = 2000 cm⁻¹ and ω̃e·xe = 20 cm⁻¹. Where is its fundamental band?'
    choices: ['1960 cm⁻¹', '2000 cm⁻¹', '1980 cm⁻¹', '2040 cm⁻¹']
    ans: 0
    why: 'G(1) − G(0) = ω̃e − 2ω̃e·xe = 2000 − 40 = 1960 cm⁻¹. Anharmonicity always pulls the fundamental below ω̃e.'
  - q: 'Why does the infrared band of HCl near 2886 cm⁻¹ have a gap at its centre?'
    choices: ['ΔJ = 0 is forbidden, so there is no Q branch', 'The v = 0 → 1 transition is forbidden', 'Isotopes of chlorine cancel each other there', 'Centrifugal distortion removes the central lines']
    ans: 0
    why: 'For a diatomic in a ¹Σ state the vibrational transition must be accompanied by ΔJ = ±1. The R and P branches leave a gap of 4B at the band origin where a Q branch (ΔJ = 0) would be.'
  - q: 'Which vibration of CO₂ is infrared inactive?'
    choices: ['The symmetric stretch', 'The antisymmetric stretch', 'The bend', 'None; all three are active']
    ans: 0
    why: 'In the symmetric stretch both oxygens move out together and the dipole moment stays zero throughout. It shows up in the Raman spectrum instead (about 1388 cm⁻¹).'
sources:
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (1994), chapter 3'
  - 'G. Herzberg, Molecular Spectra and Molecular Structure I: Spectra of Diatomic Molecules, 2nd ed. (1950), chapters 3 and 4'
  - 'J. M. Hollas, Modern Spectroscopy, 4th ed. (2004), chapter 6'
  - 'P. M. Morse, Diatomic molecules according to the wave mechanics. II. Vibrational levels, Physical Review 34, 57 (1929)'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 50 minutes.** By the end you will be able to get a force constant from an infrared band, use the anharmonic formula for fundamentals, overtones and hot bands, find well depth and dissociation energy, read a vibration-rotation band and extract both rotational constants, count normal modes and say which are infrared active.

<div class="bigidea">Near its minimum every bond is a spring, so the levels start out equally spaced. Further up the spring softens, the levels crowd together, and they end at the dissociation limit.</div>

## 1. The harmonic oscillator

Expand the potential curve about the bond length `$r_e$`: `$V \approx \tfrac12k(r - r_e)^2$`. The [quantum oscillator](/learn/courses/iit-jam-physics/schrodinger-equation/) then gives

```math
G(v) = \tilde\omega\left(v + \tfrac12\right), \qquad \tilde\omega = \frac{1}{2\pi c}\sqrt{\frac{k}{\mu}}, \qquad v = 0, 1, 2, \dots
```

The lowest level keeps a **zero-point energy** `$\tilde\omega/2$`, so even at absolute zero the bond vibrates.

**Infrared selection rule.** A vibration absorbs light only if the dipole moment changes as the bond stretches, `$(d\mu/dr)_{r_e} \ne 0$`. Then `$\Delta v = \pm1$` for a harmonic oscillator with a linear dipole. Homonuclear molecules (H₂, N₂, O₂) have no infrared spectrum at all, which is why they do not act as greenhouse gases while CO₂ and H₂O do.

**Worked example.** HCl absorbs at 2886 cm⁻¹. Find the force constant.

1. `$k = (2\pi c\tilde\omega)^2\mu$`. With `$\tilde\omega$` in cm⁻¹ and `$\mu$` in amu, `$k = 5.892\times10^{-5}\,\mu\,\tilde\omega^2$` N/m.
2. `$\mu = 0.9796$` amu: `$k = 5.892\times10^{-5}\times0.9796\times2886^2 = 481$` N/m.
3. A stiff spring: a 1 kg mass on it would oscillate at 3.5 Hz. Triple bonds go up to about 1900 N/m (CO), single bonds down to about 170 N/m (I₂).

**Isotopes.** `$k$` is set by the electrons, so `$\tilde\omega \propto \mu^{-1/2}$`. For DCl, `$\mu = 1.904$` amu, and the band moves to `$2886\sqrt{0.9796/1.904} = 2070$` cm⁻¹. The two chlorine isotopes also split each HCl line by about 2 cm⁻¹.

## 2. Anharmonicity and the Morse potential

A real bond breaks when stretched far, so the potential levels off at the dissociation energy. Morse's form captures this:

```math
V(r) = D_e\left[1 - e^{-a(r - r_e)}\right]^2, \qquad G(v) = \tilde\omega_e\left(v+\tfrac12\right) - \tilde\omega_ex_e\left(v+\tfrac12\right)^2
```

with `$x_e$` the small, positive anharmonicity constant (about 0.005 to 0.03). The levels get closer as `$v$` rises: `$G(v+1) - G(v) = \tilde\omega_e[1 - 2x_e(v+1)]$`.

Anharmonicity also relaxes the selection rule to `$\Delta v = \pm1, \pm2, \pm3, \dots$`, with each step about ten times weaker. From `$v = 0$`:

```math
\tilde\nu_{0\to v} = v\,\tilde\omega_e\left[1 - (v+1)x_e\right]
```

| Band | Transition | Position |
|---|---|---|
| fundamental | 0 → 1 | `$\tilde\omega_e(1 - 2x_e)$` |
| first overtone | 0 → 2 | `$2\tilde\omega_e(1 - 3x_e)$` |
| second overtone | 0 → 3 | `$3\tilde\omega_e(1 - 4x_e)$` |
| hot band | 1 → 2 | `$\tilde\omega_e(1 - 4x_e)$` |

Hot bands start from `$v = 1$` and grow with temperature, which is how to recognise them.

**Dissociation.** The spacing reaches zero at `$v_{\max} \approx 1/(2x_e) - \tfrac12$`. The depth of the Morse well and the energy actually needed to break the bond from the ground level are

```math
D_e = \frac{\tilde\omega_e^2}{4\tilde\omega_ex_e}, \qquad D_0 = D_e - G(0)
```

<div class="meaning">

<dl>
<dt>ω̃e</dt><dd>the harmonic wavenumber: what the vibration would be for an infinitely small swing at the bottom of the well</dd>
<dt>ω̃e·xe</dt><dd>the anharmonic constant: how fast the level spacing shrinks, 2ω̃e·xe per step</dd>
<dt>De</dt><dd>the well depth, from the minimum of the curve to the dissociation limit</dd>
<dt>D0</dt><dd>the chemical dissociation energy, from the v = 0 level; smaller than De by the zero-point energy</dd>
<dt>hot band</dt><dd>a transition that starts from an excited vibrational level, weaker at low temperature</dd>
</dl>

</div>

**Worked example.** HCl has its fundamental at 2885.3 cm⁻¹ and first overtone at 5664.9 cm⁻¹. Find `$\tilde\omega_e$`, `$x_e$`, `$D_e$` and `$D_0$`.

<div class="steps">
<div class="step"><p><b>Two equations.</b> ω̃e − 2ω̃e·xe = 2885.3 and 2ω̃e − 6ω̃e·xe = 5664.9.</p></div>
<div class="step"><p><b>Eliminate.</b> Three times the first minus the second: ω̃e = 8655.9 − 5664.9 = 2991.0 cm⁻¹. Then ω̃e·xe = (2991.0 − 2885.3)/2 = 52.85 cm⁻¹, xe = 0.0177.</p></div>
<div class="step"><p><b>Well depth.</b> De = 2991.0²/(4 × 52.85) = 42 300 cm⁻¹ = 5.25 eV.</p></div>
<div class="step"><p><b>From v = 0.</b> G(0) = 1495.5 − 13.2 = 1482 cm⁻¹, so D0 = 40 800 cm⁻¹ = 5.06 eV.</p></div>
</div>

The measured `$D_0$` of HCl is 4.43 eV. The Morse formula, fitted only to the lowest levels, overestimates the depth, because real levels near the top crowd together faster than the quadratic formula says. The Birge-Sponer method extrapolates measured spacings instead.

<figure class="fig" data-fig="morse-levels"><figcaption>The Morse potential with its vibrational levels drawn between the classical turning points, and the harmonic parabola with its equally spaced levels as ticks. Choose a molecule or increase the anharmonicity to see how much sooner the levels run out.</figcaption></figure>

<div class="problem" data-problem="vib-anharmonic"></div>

## 3. Vibration-rotation bands

A vibrational transition in a diatomic comes with `$\Delta J = \pm1$` (for a ¹Σ state, `$\Delta J = 0$` is forbidden). Measuring from the band origin `$\tilde\nu_0$`, with rotational constants `$B'$` (upper, `$v = 1$`) and `$B''$` (lower, `$v = 0$`), the R branch (`$\Delta J = +1$`) and the P branch (`$\Delta J = -1$`) can be written together with one running number `$m$` (`$m = J''+1$` for R, `$m = -J''$` for P):

```math
\tilde\nu(m) = \tilde\nu_0 + (B' + B'')\,m + (B' - B'')\,m^2
```

If `$B' = B'' = B$`, lines sit at `$\tilde\nu_0 \pm 2B, \pm4B, \dots$` with a gap of `$4B$` at the origin. Because `$B' < B''$` (the molecule is slightly longer in `$v = 1$`), R-branch lines crowd together and P-branch lines spread out.

Step the lower J, switch between R and P, raise the temperature, and turn on 'B(v=1) < B(v=0)'.

<figure class="fig" data-fig="@qm-rovib-spectrum"><figcaption>R lines sit above the band centre, P lines below, and nothing sits at the centre. Heights follow the populations; unequal rotational constants squeeze one branch together.</figcaption></figure>

**Combination differences** separate the two constants cleanly. Pairs of lines that share an upper or lower level give

```math
R(J-1) - P(J+1) = 4B''\left(J + \tfrac12\right), \qquad R(J) - P(J) = 4B'\left(J + \tfrac12\right)
```

From `$B'' - B' = \alpha_e$` and `$B_v = B_e - \alpha_e(v+\tfrac12)$` you get the equilibrium bond length. The relative heights of the lines follow the thermal populations of [lesson 6.4](/learn/courses/gate-physics/rotational-spectra/).

**Worked example.** In the HCl fundamental, R(0) is at 2906.2 cm⁻¹ and P(1) at 2865.1 cm⁻¹. Estimate the band origin and `$B$`.

1. The gap between R(0) and P(1) is `$4B$` (if `$B' \approx B''$`): `$41.1/4 = 10.3$` cm⁻¹.
2. The origin is midway: `$\tilde\nu_0 = 2885.7$` cm⁻¹, matching the fundamental.

The [Diatomic spectroscopy](/science/diatomic-spectroscopy/) tool draws these bands for real molecules.

## 4. Polyatomic molecules

`$N$` atoms have `$3N$` coordinates; take away 3 translations and 3 rotations (2 for a linear molecule) to get `$3N - 6$` (or `$3N - 5$`) **normal modes**, each an independent oscillator with its own wavenumber.

- **CO₂** (linear, 4 modes): symmetric stretch 1388 cm⁻¹ (no dipole change: infrared inactive, Raman active), bend 667 cm⁻¹ (doubly degenerate, active), antisymmetric stretch 2349 cm⁻¹ (active). The 667 and 2349 bands are the greenhouse absorption.
- **H₂O** (bent, 3 modes): 3657, 1595 and 3756 cm⁻¹, all active.

In a perpendicular band (dipole change perpendicular to the axis, like the CO₂ bend) `$\Delta J = 0$` is allowed too, giving a strong **Q branch** in the middle. Characteristic group frequencies (C=O near 1700 cm⁻¹, O–H near 3400 cm⁻¹) are what make infrared spectra useful in chemistry.

## 5. Electronic transitions and Franck-Condon

An electronic transition is so fast that the nuclei do not move during it: it is a vertical line on the potential-curve diagram. Its intensity to each upper vibrational level `$v'$` is set by the overlap of the vibrational wavefunctions, `$|\langle v'|v''\rangle|^2$`, the **Franck-Condon factor**. If the upper curve is shifted to longer `$r$`, the strongest band is to a high `$v'$`, and the band series (a progression) maps the upper well, ending in a continuum above its dissociation limit.

Step through it with the buttons below, or press Play, and use the controls on the picture to try your own values.

<div class="steps" data-fig="@qm-jablonski"><div class="step">Ground state S₀: the electron pair is in the lowest level.</div><div class="step">Absorption S₀ to S₂ in about 10⁻¹⁵ s, vertical on the diagram.</div><div class="step">Vibrational relaxation to the bottom of S₂ in picoseconds, giving heat to neighbours.</div><div class="step">Internal conversion S₂ to S₁ without any light.</div><div class="step">Fluorescence S₁ to S₀: a photon of lower energy than the one absorbed, in nanoseconds.</div><div class="step">Intersystem crossing: a spin flip traps the electron in the triplet T₁.</div><div class="step">Phosphorescence T₁ to S₀: forbidden, so slow, milliseconds to seconds.</div></div>

<div class="myth">

**"Overtones are at exactly twice the fundamental."** Anharmonicity puts the first overtone below twice the fundamental: `$2\tilde\omega_e(1 - 3x_e)$` against `$2\tilde\omega_e(1 - 2x_e)$`. For HCl, 5665 instead of 5771 cm⁻¹.

**"The dissociation energy is De."** De is measured from the bottom of the well, which the molecule never sits at. Breaking a bond from the ground state costs `$D_0 = D_e - G(0)$`, and `$D_0$` differs between isotopes while `$D_e$` does not.

</div>

<div class="keypoints">

- `$G(v) = \tilde\omega(v + \tfrac12)$`, `$\tilde\omega = (1/2\pi c)\sqrt{k/\mu}$`; `$k = 5.892\times10^{-5}\mu\tilde\omega^2$` N/m (amu, cm⁻¹). Isotopes: `$\tilde\omega \propto \mu^{-1/2}$`.
- Infrared needs `$d\mu/dr \ne 0$`; harmonic rule `$\Delta v = \pm1$`.
- Morse: `$G = \tilde\omega_e(v+\tfrac12) - \tilde\omega_ex_e(v+\tfrac12)^2$`; `$0 \to v$` at `$v\tilde\omega_e[1-(v+1)x_e]$`; hot band `$\tilde\omega_e(1-4x_e)$`.
- `$D_e = \tilde\omega_e^2/4\tilde\omega_ex_e$`, `$D_0 = D_e - G(0)$`, `$v_{\max} \approx 1/2x_e - \tfrac12$`.
- Diatomic bands: P and R branches, no Q; `$\tilde\nu(m) = \tilde\nu_0 + (B'+B'')m + (B'-B'')m^2$`; gap `$4B$`.
- Combination differences: `$R(J-1) - P(J+1) = 4B''(J+\tfrac12)$`, `$R(J) - P(J) = 4B'(J+\tfrac12)$`.
- `$3N-6$` (`$3N-5$` linear) modes; CO₂ symmetric stretch IR-inactive. Franck-Condon: vertical transitions, overlap factors.

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [vibrational spectra practice page](/learn/courses/gate-physics/practice/vibrational-spectra/).

<div class="qbank" data-bank="physics" data-topics="vibrational-spectra" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.6](/learn/courses/gate-physics/raman/) sees the same vibrations and rotations by scattering instead of absorption, with different selection rules.

**Going on to CSIR NET?** [Electronic spectra and the Franck-Condon principle](/learn/courses/csir-net-physics/electronic-spectra/) adds an electronic jump on top of these vibrational levels.
