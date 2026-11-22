---
title: Rotational spectra
seoTitle: Rotational spectra of diatomic molecules for GATE Physics
summary: 'Why molecular energies split into electronic, vibrational and rotational parts, the rigid rotor and its rotational constant, microwave lines spaced by 2B, bond lengths and isotope shifts, thermal populations and the most intense line, centrifugal distortion, and the rotational levels of symmetric, spherical and asymmetric tops.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Which of these molecules shows a pure rotational (microwave) absorption spectrum?'
    choices: ['HCl', 'N₂', 'CH₄', 'CO₂']
    ans: 0
    why: 'A pure rotational spectrum needs a permanent electric dipole moment. HCl has one; N₂ and linear CO₂ are symmetric and CH₄ is a spherical top, so none of them has a dipole.'
  - q: 'Replacing ¹²C by ¹³C in carbon monoxide changes the rotational line spacing because'
    choices: ['The reduced mass grows, so B falls', 'The bond length grows, so B falls', 'The dipole moment changes, so B changes', 'The nuclear spin changes the selection rule']
    ans: 0
    why: 'The bond length is fixed by the electrons and does not change with isotope. The reduced mass goes up, the moment of inertia goes up, and B ∝ 1/μ falls by about 4%.'
  - q: 'As temperature rises, the most intense line of a rotational spectrum'
    choices: ['Moves to higher J, as the square root of T', 'Stays at J = 0 → 1', 'Moves to higher J, in proportion to T', 'Moves to lower J']
    ans: 0
    why: 'The population (2J + 1)e^{−BJ(J+1)hc/kT} peaks at J ≈ √(kT/2hcB) − 1/2, so the peak moves as √T.'
sources:
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (1994), chapter 2'
  - 'G. Herzberg, Molecular Spectra and Molecular Structure I: Spectra of Diatomic Molecules, 2nd ed. (1950), chapter 3'
  - 'J. M. Hollas, Modern Spectroscopy, 4th ed. (2004), chapters 4 and 5'
  - 'P. F. Bernath, Spectra of Atoms and Molecules, 3rd ed. (2016), chapter 6'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 45 minutes.** By the end you will be able to explain the energy scales of a molecule, find a rotational constant and bond length from a microwave spectrum, predict isotope shifts, find the most populated level at a given temperature, include centrifugal distortion, and say which polyatomic molecules have a rotational spectrum.

<div class="bigidea">A molecule turns, vibrates and rearranges its electrons on very different time scales, so its energy is (almost) a sum of three separate parts. Rotation is the slowest and smallest: a few cm⁻¹, in the microwave.</div>

## 1. Three energy scales

Nuclei are thousands of times heavier than electrons, so electrons adjust instantly to wherever the nuclei are: the **Born-Oppenheimer approximation**. The electrons make a potential curve `$V(r)$` in which the nuclei vibrate and rotate. Estimating each scale with `$m_e/M \sim 10^{-4}$`:

| Motion | Energy scale | Typical size | Region |
|---|---|---|---|
| electronic | `$\hbar^2/m_ea^2$` | a few eV | visible, UV |
| vibrational | `$\sim(m_e/M)^{1/2}$` of that | 0.1 to 0.5 eV, 500 to 4000 cm⁻¹ | infrared |
| rotational | `$\sim m_e/M$` of that | `$10^{-4}$` to `$10^{-3}$` eV, 1 to 20 cm⁻¹ | microwave, far IR |

So `$E \approx E_{\text{el}} + E_{\text{vib}} + E_{\text{rot}}$`, and spectroscopists quote every energy as a term value in cm⁻¹ (energy divided by `$hc$`). Recall from the JAM [photons lesson](/learn/courses/iit-jam-physics/photons/) that 1 eV = 8065.5 cm⁻¹, and 1 cm⁻¹ = 29.979 GHz.

## 2. The rigid rotor

Two atoms of masses `$m_1$`, `$m_2$` a fixed distance `$r$` apart have moment of inertia `$I = \mu r^2$` with `$\mu = m_1m_2/(m_1 + m_2)$`. Quantising `$L^2 = \hbar^2J(J+1)$`:

```math
E_J = \frac{\hbar^2}{2I}J(J+1), \qquad F(J) = \frac{E_J}{hc} = BJ(J+1), \qquad B = \frac{h}{8\pi^2cI}
```

Each level has `$2J+1$` states (`$M_J = -J..J$`). A handy number: with `$I$` in amu Å², `$B = 16.858/I$` cm⁻¹.

**Selection rules.** The molecule must have a permanent dipole moment (heteronuclear), and `$\Delta J = \pm1$` (the photon carries one unit). Absorption `$J \to J+1$` occurs at

```math
\tilde\nu = F(J+1) - F(J) = 2B(J+1) = 2B,\ 4B,\ 6B,\ \dots
```

a ladder of equally spaced lines with spacing `$2B$`, the first at `$2B$`.

<div class="meaning">

<dl>
<dt>μ</dt><dd>the reduced mass m₁m₂/(m₁ + m₂), always smaller than the lighter atom; for a hydride it is close to the hydrogen mass</dd>
<dt>B</dt><dd>the rotational constant in cm⁻¹; large for light molecules (H₂ 60.9, HCl 10.6) and small for heavy ones (CO 1.92, I₂ 0.037)</dd>
<dt>J</dt><dd>the rotational quantum number 0, 1, 2, ...; level J has energy BJ(J + 1) and 2J + 1 states</dd>
<dt>2B</dt><dd>the spacing of the microwave lines, which gives I and the bond length directly</dd>
</dl>

</div>

**Worked example.** Lines in the far-infrared spectrum of ¹H³⁵Cl are spaced by 21.18 cm⁻¹. Find the bond length.

1. `$B = 10.59$` cm⁻¹.
2. `$\mu = (1.00783\times34.96885)/35.97668 = 0.97959$` amu.
3. `$I = 16.858/10.59 = 1.592$` amu Å².
4. `$r = \sqrt{I/\mu} = \sqrt{1.625} = 1.275$` Å.

<div class="problem" data-problem="rotor-bond"></div>

**Isotopes.** The bond length is set by the electrons and does not change with isotope, so `$B \propto 1/\mu$`. For carbon monoxide, `$\mu(^{12}\text{C}^{16}\text{O}) = 6.856$` amu and `$\mu(^{13}\text{C}^{16}\text{O}) = 7.172$` amu. The ¹²CO `$J = 1 \leftarrow 0$` line at 115.27 GHz therefore moves to `$115.27\times6.856/7.172 = 110.2$` GHz for ¹³CO. Radio astronomers use both lines: the main one to trace molecular clouds, the rarer one to measure how much gas there is when the main line is saturated.

## 3. Line intensities and thermal populations

The intensity of `$J \to J+1$` follows the population of the lower level, which combines the degeneracy with the Boltzmann factor:

```math
\frac{N_J}{N_0} = (2J+1)\,e^{-hcBJ(J+1)/kT}, \qquad J_{\max} \approx \sqrt{\frac{kT}{2hcB}} - \frac12
```

At room temperature `$kT/hc = 208.5$` cm⁻¹, far larger than `$B$`, so many levels are filled: the spectrum rises, peaks, and falls off.

Step the lower J, switch between R and P, raise the temperature, and turn on 'B(v=1) < B(v=0)'.

<figure class="fig" data-fig="@qm-rovib-spectrum"><figcaption>R lines sit above the band centre, P lines below, and nothing sits at the centre. Heights follow the populations; unequal rotational constants squeeze one branch together.</figcaption></figure>

**Worked example.** Find the most populated level of HCl at 300 K.

1. `$\sqrt{208.5/(2\times10.59)} - \tfrac12 = 3.14 - 0.5 = 2.64$`.
2. The peak is at an integer, so compare: `$N_2/N_0 = 5e^{-0.305} = 3.69$`, `$N_3/N_0 = 7e^{-0.610} = 3.81$`, `$N_4/N_0 = 9e^{-1.016} = 3.26$`. `$J = 3$` wins.
3. The strongest absorption line is `$J = 3 \to 4$` at `$8B = 84.7$` cm⁻¹ (in a more careful treatment the line strength has extra factors, but the peak stays close).

<figure class="fig" data-fig="rotor-populations"><figcaption>Thermal populations of rotational levels and the resulting absorption lines at 2B(J + 1). Raise the temperature and the peak moves to higher J as √T; pick a heavier molecule and B shrinks, so many more levels share the population.</figcaption></figure>

<div class="problem" data-problem="rotor-jmax"></div>

The [Diatomic spectroscopy](/science/diatomic-spectroscopy/) tool computes these level ladders and populations for real molecules.

## 4. The rotor is not rigid

**Centrifugal distortion.** A fast-spinning molecule stretches, `$I$` grows, and the levels fall slightly below `$BJ(J+1)$`:

```math
F(J) = BJ(J+1) - DJ^2(J+1)^2, \qquad \tilde\nu_{J\to J+1} = 2B(J+1) - 4D(J+1)^3, \qquad D = \frac{4B^3}{\tilde\omega^2}
```

`$D$` is tiny (HCl: `$4(10.59)^3/(2991)^2 = 5.3\times10^{-4}$` cm⁻¹) but its effect grows as `$J^3$`, so high lines crowd together. Measuring `$D$` gives the vibrational wavenumber `$\tilde\omega$` from a pure rotational spectrum.

**Vibration-rotation coupling.** The average `$1/r^2$` changes with vibrational level: `$B_v = B_e - \alpha_e(v + \tfrac12)$` with `$\alpha_e$` small and positive. You will need it for band analysis in [lesson 6.5](/learn/courses/gate-physics/vibrational-spectra/).

## 5. Polyatomic molecules

Classify by the three principal moments of inertia `$I_A \le I_B \le I_C$`:

- **Linear** (OCS, HCN; `$I_A = 0$`): exactly like a diatomic, lines at `$2B(J+1)$`. Symmetric linear molecules (CO₂, C₂H₂) have no dipole and no rotational spectrum.
- **Symmetric top** (two moments equal: NH₃, CH₃Cl, C₆H₆): a second quantum number `$K$`, the projection of `$J$` on the symmetry axis, `$|K| \le J$`. For a prolate top `$F(J,K) = BJ(J+1) + (A - B)K^2$`. The selection rules `$\Delta J = \pm1$`, `$\Delta K = 0$` give lines at `$2B(J+1)$` again; `$K$` shows up only through small centrifugal terms.
- **Spherical top** (all three equal: CH₄, SF₆): no permanent dipole, no pure rotational spectrum.
- **Asymmetric top** (all different: H₂O, most molecules): no simple formula; levels are labelled `$J_{K_aK_c}$`.

Microwave spectroscopy gives bond lengths and angles to better than 0.001 Å, and the Stark effect on rotational lines gives dipole moments. Over two hundred molecules have been found in interstellar space this way.

<div class="myth">

**"Homonuclear molecules have no rotational levels."** They have rotational levels like any other molecule; they just have no dipole, so they cannot absorb microwaves. Their rotational structure shows up in Raman spectra ([lesson 6.6](/learn/courses/gate-physics/raman/)) and in electronic bands.

**"The strongest line is always the first one."** Only at very low temperature. At room temperature the population peak, and the strongest line, is at several times `$2B$` for most molecules and dozens of times for heavy ones.

</div>

<div class="keypoints">

- Born-Oppenheimer: electronic (eV) ≫ vibrational (~0.1 eV) ≫ rotational (~meV); 1 cm⁻¹ = 29.98 GHz.
- Rigid rotor `$F(J) = BJ(J+1)$`, `$B = h/(8\pi^2cI) = 16.858/I$` cm⁻¹ (I in amu Å²); `$I = \mu r^2$`.
- Needs a permanent dipole; `$\Delta J = \pm1$`; lines at `$2B(J+1)$`, spacing `$2B$`.
- Isotopes: same `$r$`, `$B \propto 1/\mu$`.
- Populations `$(2J+1)e^{-hcBJ(J+1)/kT}$`, peak `$J \approx \sqrt{kT/2hcB} - \tfrac12$`.
- Centrifugal distortion `$-DJ^2(J+1)^2$`, `$D = 4B^3/\tilde\omega^2$`; `$B_v = B_e - \alpha_e(v + \tfrac12)$`.
- Linear and symmetric tops: lines at `$2B(J+1)$`; spherical tops and symmetric linear molecules: no microwave spectrum.

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [rotational spectra practice page](/learn/courses/gate-physics/practice/rotational-spectra/).

<div class="qbank" data-bank="physics" data-topics="rotational-spectra" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.5](/learn/courses/gate-physics/vibrational-spectra/) lets the bond stretch: vibrational levels, anharmonicity and the rotational fine structure of infrared bands.
