---
title: 'Magnetic resonance: ESR and NMR'
summary: 'Spins in a magnetic field: Larmor precession, resonance and gyromagnetic ratios, populations and Curie magnetisation, the rotating frame and pulses, the Bloch equations, T1 and T2, linewidths, spin echoes and inversion recovery, chemical shift and J coupling, ESR g factors and hyperfine patterns, transition-metal ions, zero-field splitting and MRI.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'What is the proton NMR frequency in a 9.4 T magnet?'
    choices: ['400 MHz', '263 GHz', '42.6 MHz', '2.5 GHz']
    ans: 0
    why: 'ν = (γ/2π)B = 42.58 MHz/T × 9.4 T = 400 MHz, which is why such magnets are sold as 400 MHz spectrometers.'
  - q: 'How many ESR lines does the methyl radical CH₃ show, and with what intensities?'
    choices: ['4 lines, 1:3:3:1', '3 lines, 1:2:1', '4 equal lines', '2 lines, 1:1']
    ans: 0
    why: 'Three equivalent protons (I = ½) give 2nI + 1 = 4 lines with binomial intensities 1:3:3:1.'
  - q: 'In an inversion-recovery experiment the signal is zero at t = 0.35 s. What is T₁?'
    choices: ['0.50 s', '0.35 s', '0.24 s', '0.70 s']
    ans: 0
    why: 'M_z = M₀(1 − 2e^(−t/T₁)) vanishes at t = T₁ ln 2, so T₁ = 0.35/0.693 = 0.50 s.'
sources:
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (1994), chapters 7 and 8'
  - 'C. P. Slichter, Principles of Magnetic Resonance, 3rd ed. (1990), chapters 1 to 3'
  - 'M. H. Levitt, Spin Dynamics: Basics of Nuclear Magnetic Resonance, 2nd ed. (2008), chapters 2, 9 to 11'
  - 'J. A. Weil and J. R. Bolton, Electron Paramagnetic Resonance, 2nd ed. (2007), chapters 1 to 3'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C unit on atomic and molecular physics (ESR, NMR, chemical shift)'
---

**Module 8 · about 55 minutes.** By the end you will be able to compute resonance frequencies and fields for electrons and nuclei, estimate population differences and magnetisation, describe pulses in the rotating frame, use the Bloch equations to connect T₁, T₂ and linewidth, explain spin echoes and inversion recovery, read chemical shifts and multiplets, and predict ESR hyperfine patterns. The Zeeman energies and g factors this builds on are in the GATE lesson on [Zeeman and Stark effects](/learn/courses/gate-physics/zeeman-stark/), and spin angular momentum in [angular momentum](/learn/courses/gate-physics/angular-momentum/).

<div class="bigidea">A spin in a field B₀ has 2I + 1 equally spaced energy levels, and classically it precesses about B₀ at the Larmor frequency. Shine radiation at exactly that frequency and the spins absorb it: that is resonance. Electrons resonate at microwave frequencies (ESR), nuclei at radio frequencies (NMR); everything else is about what shifts, splits and broadens the line.</div>

## 1. Larmor precession and resonance

A magnetic moment `$\boldsymbol\mu = \gamma\mathbf J$` in a field feels a torque `$\boldsymbol\mu\times\mathbf B$`, so `$d\mathbf J/dt = \gamma\mathbf J\times\mathbf B$`: the angular momentum precesses about `$\mathbf B$` at `$\omega_0 = \gamma B_0$`, whatever the angle. Quantum mechanically the levels `$E = -\gamma\hbar B_0m$` are spaced by `$\hbar\omega_0$`, and magnetic dipole transitions (`$\Delta m = \pm1$`) absorb at exactly the precession frequency:

```math
h\nu = g\mu_BB_0 \ \ (\text{electrons}), \qquad \nu = \frac{\gamma}{2\pi}B_0 \ \ (\text{nuclei})
```

| Spin | `$\gamma/2\pi$` | at 1 T | typical |
|---|---|---|---|
| free electron (g = 2.0023) | 28.025 GHz/T | 28 GHz | X-band: 9.5 GHz at 0.34 T |
| ¹H | 42.577 MHz/T | 42.6 MHz | 400 MHz at 9.4 T |
| ¹⁹F | 40.08 MHz/T | 40.1 MHz | |
| ³¹P | 17.24 MHz/T | 17.2 MHz | |
| ¹³C (1.1% abundant) | 10.71 MHz/T | 10.7 MHz | 100.6 MHz at 9.4 T |
| ²H (I = 1) | 6.54 MHz/T | 6.5 MHz | |

The electron resonates 658 times higher than the proton in the same field. Nuclei with even proton and neutron numbers (¹²C, ¹⁶O) have `$I = 0$` and are invisible.

In free precession change B and the tilt; then switch to the RF pulse view, set 90° and press Pulse.

<figure class="fig" data-fig="@qm-spin-bloch"><figcaption>Precession keeps the angle to B and runs at ω = γB. In the rotating frame a pulse simply tips the spin away from z, and the coil signal (largest after 90°) dies away as the spins dephase.</figcaption></figure>

**Populations.** For spin ½ the fractional excess is `$\tanh(h\nu/2k_BT) \approx h\nu/2k_BT$`: 32 ppm for protons at 400 MHz and 300 K, about `$8\times10^{-4}$` for electrons at X-band. This tiny excess is the whole NMR signal; the equilibrium magnetisation is `$M_0 = N\gamma^2\hbar^2I(I+1)B_0/3k_BT$` (Curie's law), 3 mA/m for water in 1 T.

<figure class="fig" data-fig="larmor-resonance"><figcaption>Left: a moment precessing about B₀ (the cone angle does not change the rate). Right: the resonance line, a Lorentzian of full width 1/(πT₂), with the RF frequency as a marker. Choose the spin and the field to see where it resonates.</figcaption></figure>

## 2. Pulses, the rotating frame and relaxation

In a frame rotating at the RF frequency `$\omega$`, the static field shrinks to `$B_0 - \omega/\gamma$`, which vanishes at resonance; only the RF field `$B_1$` remains, and the magnetisation **nutates** about it at `$\omega_1 = \gamma B_1$`. A pulse of length `$t$` turns `$\mathbf M$` by `$\theta = \gamma B_1t$`: a 90° pulse tips it into the transverse plane, where it precesses and induces the free induction decay (FID); a 180° pulse inverts it. Off resonance, the effective field tilts out of the plane by `$\tan^{-1}[(\Delta\omega/\gamma)/B_1]$`.

**Worked example.** Protons, `$B_1 = 1.0$` mT: `$\omega_1 = 2.675\times10^8\times10^{-3} = 2.675\times10^5$` rad/s, so a 90° pulse lasts `$(\pi/2)/\omega_1 = 5.9$` μs.

<div class="problem" data-problem="nmr-pulse"></div>

The **Bloch equations** add relaxation to precession:

```math
\frac{dM_z}{dt} = \gamma(\mathbf M\times\mathbf B)_z - \frac{M_z - M_0}{T_1}, \qquad \frac{dM_{x,y}}{dt} = \gamma(\mathbf M\times\mathbf B)_{x,y} - \frac{M_{x,y}}{T_2}
```

- `$T_1$` (spin-lattice): `$M_z$` returns to `$M_0$` by giving energy to the surroundings. After a 180° pulse, `$M_z = M_0(1 - 2e^{-t/T_1})$`, zero at `$t = T_1\ln2$` (inversion recovery).
- `$T_2$` (spin-spin): the transverse magnetisation loses phase coherence. Always `$T_2 \le 2T_1$`; in mobile liquids `$T_1 \approx T_2$`, in solids `$T_2 \ll T_1$`.
- The steady-state absorption is a Lorentzian of full width `$\Delta\nu = 1/(\pi T_2)$`; strong RF saturates it, broadening it by `$\sqrt{1 + \gamma^2B_1^2T_1T_2}$`.

**Spin echo.** Field inhomogeneity makes the FID decay faster, with `$T_2^* < T_2$`. In the Hahn sequence 90°–`$\tau$`–180°, the 180° pulse reverses the phases, and the spins refocus at `$2\tau$`. Static inhomogeneity is undone; true `$T_2$` loss is not, so the echo height is `$e^{-2\tau/T_2}$`. Echoes, inversion recovery and repeated pulses (`$1 - e^{-T_R/T_1}$`) are also the contrast mechanisms of MRI, where a field gradient `$G$` turns position into frequency, `$\Delta\nu = (\gamma/2\pi)G\Delta x$` (4.3 kHz per cm at 10 mT/m).

<div class="meaning">

<dl>
<dt>γ</dt><dd>gyromagnetic ratio: magnetic moment per unit angular momentum; γ/2π is the resonance frequency per tesla</dd>
<dt>T₁</dt><dd>how fast the populations (M_z) return to equilibrium; it limits how often you can repeat a pulse</dd>
<dt>T₂</dt><dd>how fast the precessing spins get out of step; it sets the natural linewidth 1/(πT₂)</dd>
<dt>chemical shift δ</dt><dd>the fractional change of the resonance frequency caused by electron shielding, in parts per million</dd>
</dl>

</div>

## 3. NMR spectra: chemical shift and J coupling

Electrons around a nucleus shield it: `$B_{loc} = B_0(1 - \sigma)$`. The **chemical shift**

```math
\delta = \frac{\nu - \nu_{ref}}{\nu_0}\times10^6\ \text{ppm}
```

(reference TMS) is the same at every field, while the shift in hertz grows with `$B_0$`. **Spin-spin (J) coupling** through the bonding electrons splits a line into a multiplet; its size in hertz does not depend on `$B_0$`, which is how you tell a coupling from a shift: run at two fields. For first-order spectra:

- coupling to `$n$` equivalent spin-½ nuclei gives `$n + 1$` lines with binomial intensities (CH₃ next to CH₂: the CH₂ is a 1:3:3:1 quartet, the CH₃ a 1:2:1 triplet);
- coupling to separate groups with different J multiplies: a quartet of triplets has 12 lines;
- equivalent nuclei do not split each other.

**Worked example.** On a 400 MHz instrument a line 1200 Hz from TMS has `$\delta = 1200/400 = 3.0$` ppm; at 800 MHz the same line sits 2400 Hz away, but its 7 Hz coupling stays 7 Hz.

## 4. ESR: g factors and hyperfine structure

ESR needs unpaired electrons: free radicals, transition-metal ions, defects, triplets. Spectrometers keep the microwave frequency fixed (a resonant cavity) and sweep the field, recording the first derivative of the absorption. The **g factor**, `$g = h\nu/\mu_BB$`, is close to 2.0023 for organic radicals and shifted (and anisotropic) for metal ions by spin-orbit coupling; small `$\Delta g$` are resolved better at higher frequency.

**Hyperfine structure.** Coupling to a nucleus of spin `$I$` splits each line into `$2I + 1$` (selection rule `$\Delta m_S = \pm1$`, `$\Delta m_I = 0$`). For `$n$` equivalent nuclei:

```math
\text{lines} = 2nI + 1, \qquad \text{different sets multiply: } \prod_k(2n_kI_k + 1)
```

Spin-½ nuclei give binomial intensities; spin-1 nuclei do not. Examples: CH₃ (4 lines, 1:3:3:1, `$a = 2.3$` mT), C₆H₆⁻ (7 lines, 1:6:15:20:15:6:1), nitroxides (3 equal lines from ¹⁴N), CD₃ (7 lines, 1:3:6:7:6:3:1), Mn²⁺ (6 lines from `$I = 5/2$`), the naphthalene anion (two sets of 4 protons: 25 lines). The hydrogen atom shows two lines 50.7 mT apart: its 1420 MHz hyperfine splitting, the 21 cm line of radio astronomy.

**Worked example.** A radical couples to two equivalent ¹⁴N nuclei and four equivalent protons with different constants. Lines: `$(2\times2\times1 + 1)(4 + 1) = 5\times5 = 25$`.

<div class="problem" data-problem="esr-lines"></div>

**Fine structure.** Systems with `$S \ge 1$` have a zero-field splitting `$D$`: a triplet with the field along its axis shows two lines `$2D/g\mu_B$` apart. Ions with an even number of electrons can be "ESR silent" when `$D$` exceeds the microwave quantum; Kramers ions (odd number) always keep a doublet.

<div class="myth">

**"Precession is faster when the moment is more tilted."** The torque grows with the tilt, but so does the radius of the circle; the Larmor frequency γB₀ is the same at every angle.

**"A spin-1 nucleus gives a 1:2:1 triplet like two protons."** One spin-1 nucleus gives three equal lines (m = −1, 0, +1 are equally likely). Binomial intensities come from several equivalent spin-½ nuclei.

</div>

<div class="keypoints">

- Resonance: `$h\nu = g\mu_BB$` (electrons, 28 GHz/T) or `$\nu = (\gamma/2\pi)B$` (¹H 42.58 MHz/T); ratio 658.
- Population excess `$\tanh(h\nu/2k_BT)$`; Curie magnetisation `$\propto\gamma^2B/T$`; sensitivity `$\propto\gamma^3$` × abundance.
- Rotating frame: flip angle `$\gamma B_1t$`; 90° pulse makes the FID.
- Bloch: `$T_1$` (inversion null at `$T_1\ln2$`), `$T_2 \le 2T_1$`, linewidth `$1/\pi T_2$`, echo `$e^{-2\tau/T_2}$`, saturation broadening `$\sqrt{1 + \gamma^2B_1^2T_1T_2}$`.
- δ in ppm is field independent; J in Hz is field independent; `$n + 1$` binomial multiplets; different couplings multiply.
- ESR lines `$\prod(2n_kI_k + 1)$`; Pascal intensities for spin ½; g shifts and anisotropy for metal ions; triplets split by `$2D$`.

</div>

## Practise: exam questions on this lesson

NET Part C style, with full solutions. More on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/); chemists may like the [NMR impurities](/science/nmr-impurity-checker/) table of common solvent shifts.

<div class="qbank" data-bank="physics" data-topics="esr-nmr" data-exam="net" data-n="10"></div>

**Next:** [lesson 8.3](/learn/courses/csir-net-physics/electronic-spectra/) moves from spin transitions to electronic transitions in molecules.
