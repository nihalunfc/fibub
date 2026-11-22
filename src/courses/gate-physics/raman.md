---
title: Raman spectroscopy
seoTitle: Raman spectroscopy and selection rules for GATE Physics
summary: 'Light scattered with a shifted colour: the polarisability picture of Rayleigh, Stokes and anti-Stokes lines, intensities and the anti-Stokes to Stokes ratio as a thermometer, vibrational and rotational Raman selection rules, the 6B, 10B, 14B pattern, nuclear spin statistics in H₂, N₂, O₂ and CO₂, mutual exclusion, and depolarisation ratios.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'What is the condition for a vibration to be Raman active?'
    choices: ['The polarisability changes during the vibration', 'The dipole moment changes during the vibration', 'The molecule has a permanent dipole moment', 'The vibration is doubly degenerate']
    ans: 0
    why: 'Raman scattering comes from the induced dipole p = αE. Only if α oscillates with the vibration does the scattered light pick up sidebands at ν₀ ± ν_vib.'
  - q: 'In the pure rotational Raman spectrum of a linear molecule, where is the first Stokes line and what is the spacing of the rest?'
    choices: ['6B from the laser line, then every 4B', '2B from the laser line, then every 2B', '4B from the laser line, then every 4B', '6B from the laser line, then every 2B']
    ans: 0
    why: 'ΔJ = +2 from J gives a shift F(J + 2) − F(J) = 4B(J + 3/2): 6B, 10B, 14B, ... The first line is at 6B and the spacing is 4B.'
  - q: 'Why does every second line vanish in the rotational Raman spectrum of ¹⁶O₂?'
    choices: ['¹⁶O nuclei have spin 0, so half the rotational levels do not exist', 'O₂ has no polarisability anisotropy', 'O₂ is paramagnetic, which forbids ΔJ = 2', 'The lines from odd J overlap with lines from even J']
    ans: 0
    why: 'For spin-0 nuclei only one symmetry of the rotational wavefunction is allowed. In the O₂ ground state only odd-N levels exist, so the lines from even levels are missing and the observed spacing is 8B.'
sources:
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (1994), chapter 4'
  - 'D. A. Long, The Raman Effect (2002), chapters 1 to 5'
  - 'J. M. Hollas, Modern Spectroscopy, 4th ed. (2004), chapters 5 and 6'
  - 'C. V. Raman and K. S. Krishnan, A new type of secondary radiation, Nature 121, 501 (1928)'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 45 minutes.** By the end you will be able to explain Raman scattering with the polarisability, convert a Raman shift to a wavelength for any laser, use the anti-Stokes to Stokes ratio as a thermometer, apply the vibrational and rotational Raman selection rules, explain alternating intensities with nuclear spin, and use mutual exclusion and depolarisation to assign modes.

<div class="bigidea">A molecule in a light wave becomes an oscillating dipole. If its polarisability wobbles with a vibration or rotation, the scattered light carries new frequencies: the laser frequency plus and minus the molecular one.</div>

## 1. Where the extra lines come from

Shine light of frequency `$\nu_0$` on a molecule. The field `$E = E_0\cos2\pi\nu_0t$` induces a dipole `$p = \alpha E$`, where `$\alpha$` is the polarisability (how easily the electron cloud is distorted). If the molecule vibrates with normal coordinate `$Q = Q_0\cos2\pi\nu_vt$`, the polarisability changes a little:

```math
\alpha = \alpha_0 + \left(\frac{\partial\alpha}{\partial Q}\right)_0 Q
```

<div class="steps">
<div class="step"><p><b>Multiply.</b> p = α₀E₀cos2πν₀t + (∂α/∂Q)Q₀E₀ cos2πν₀t cos2πν_vt.</p></div>
<div class="step"><p><b>Product to sum.</b> cos a cos b = ½[cos(a − b) + cos(a + b)].</p></div>
<div class="step"><p><b>Three frequencies.</b> The dipole radiates at ν₀ (Rayleigh), ν₀ − ν_v (Stokes) and ν₀ + ν_v (anti-Stokes).</p></div>
</div>

So a vibration is **Raman active** only if `$\partial\alpha/\partial Q \ne 0$`. Rotation works the same way, provided the polarisability is anisotropic: as a rod-shaped molecule turns, the field sees a large and a small `$\alpha$` twice per turn, so the shift is at twice the rotation frequency.

**The quantum picture.** The photon is absorbed into a short-lived virtual state and re-emitted at once. If the molecule ends one vibrational quantum higher, the photon has lost that energy (Stokes); if it started in an excited level and ends lower, the photon has gained it (anti-Stokes). Raman spectra are reported as shifts in cm⁻¹ from the laser line, so the same molecule gives the same shifts with any laser.

```math
\tilde\nu_{\text{Stokes}} = \tilde\nu_0 - \Delta\tilde\nu, \qquad \tilde\nu_{\text{anti-Stokes}} = \tilde\nu_0 + \Delta\tilde\nu, \qquad \tilde\nu\ (\text{cm}^{-1}) = \frac{10^7}{\lambda\ (\text{nm})}
```

<div class="meaning">

<dl>
<dt>α</dt><dd>the polarisability: induced dipole per unit field; a tensor, because a molecule may be easier to polarise along one axis</dd>
<dt>Raman shift Δν̃</dt><dd>the difference between laser and scattered wavenumbers; it equals a molecular energy gap and does not depend on the laser</dd>
<dt>Stokes</dt><dd>scattered light of lower energy; the molecule takes energy from the photon</dd>
<dt>anti-Stokes</dt><dd>scattered light of higher energy; the molecule gives energy, so it must start in an excited level</dd>
<dt>virtual state</dt><dd>not a real level: no resonance is needed, which is why any laser works</dd>
</dl>

</div>

**Worked example.** Carbon tetrachloride has a strong Raman band at 459 cm⁻¹. Where do its Stokes and anti-Stokes lines appear with a 532 nm laser?

1. `$\tilde\nu_0 = 10^7/532 = 18\,797$` cm⁻¹.
2. Stokes: `$18\,797 - 459 = 18\,338$` cm⁻¹, `$\lambda = 545.3$` nm.
3. Anti-Stokes: `$18\,797 + 459 = 19\,256$` cm⁻¹, `$\lambda = 519.3$` nm.

<div class="problem" data-problem="raman-stokes"></div>

## 2. Intensities

Raman scattering is weak: roughly one photon in a million of the incident beam is Raman scattered, about a thousand times fewer than Rayleigh. That is why Raman (with Krishnan, 1928) used focused sunlight and long exposures, and why modern Raman spectroscopy depends on lasers and filters that block the Rayleigh line. Scattered power from an oscillating dipole goes as the fourth power of frequency, so blue lasers give stronger signals (but more fluorescence, which is why 785 nm is common for biological samples).

**Anti-Stokes to Stokes ratio.** Anti-Stokes lines need molecules in the upper level, so they are weaker by the Boltzmann factor:

```math
\frac{I_{\text{AS}}}{I_{\text{S}}} = \left(\frac{\tilde\nu_0 + \Delta\tilde\nu}{\tilde\nu_0 - \Delta\tilde\nu}\right)^4 e^{-hc\Delta\tilde\nu/kT}, \qquad \frac{hc}{k} = 1.4388\ \text{cm K}
```

**Worked example.** For the 459 cm⁻¹ CCl₄ band at 300 K with a 532 nm laser:

1. Boltzmann factor `$e^{-1.4388\times459/300} = e^{-2.201} = 0.111$`.
2. Frequency factor `$(19\,256/18\,338)^4 = 1.216$`.
3. Ratio `$0.135$`. For a 3000 cm⁻¹ C–H stretch the Boltzmann factor is `$5\times10^{-7}$`: anti-Stokes lines of high-frequency modes are invisible at room temperature.

Turned round, the measured ratio gives the temperature of the sample without touching it, used for hot spots in microchips and in flames.

<div class="problem" data-problem="raman-temp"></div>

## 3. Vibrational Raman spectra

For a harmonic vibration the rule is `$\Delta v = \pm1$` (with weak overtones from anharmonicity), and every vibration of a diatomic is Raman active, homonuclear or not: stretching H₂ or N₂ changes how easily the electrons are pushed around. So Raman sees the vibrations that infrared ([lesson 6.5](/learn/courses/gate-physics/vibrational-spectra/)) cannot: N₂ at 2331 cm⁻¹, O₂ at 1556 cm⁻¹, H₂ at 4161 cm⁻¹. Rotational structure accompanies each band with `$\Delta J = 0, \pm2$`, giving O, Q and S branches; the Q branch (`$\Delta J = 0$`) is sharp and strong.

**Mutual exclusion.** In a molecule with a centre of symmetry, a vibration that is infrared active is Raman inactive and vice versa. Dipole changes are odd under inversion, polarisability changes even, so no mode can do both. CO₂ shows it: symmetric stretch (1388 cm⁻¹) only in Raman, bend and antisymmetric stretch only in infrared. If a band appears in both spectra, the molecule has no centre of symmetry (as for bent H₂O or N₂O, whose structure NNO was settled this way).

**Depolarisation ratio.** With linearly polarised excitation, measure scattered light polarised perpendicular and parallel to the laser: `$\rho = I_\perp/I_\parallel$`. Totally symmetric vibrations (the molecule keeps all its symmetry while vibrating) give `$\rho < \tfrac34$`, often near zero; all others give exactly `$\rho = \tfrac34$`. That identifies symmetric modes without any calculation.

## 4. Rotational Raman spectra

For a linear molecule the rotational selection rule is `$\Delta J = 0, \pm2$` (two photons are involved, each carrying one unit). `$\Delta J = 0$` is Rayleigh. `$\Delta J = +2$` gives Stokes lines at

```math
F(J+2) - F(J) = 4B\left(J + \tfrac32\right) = 6B,\ 10B,\ 14B,\ \dots
```

and `$\Delta J = -2$` the matching anti-Stokes lines on the other side. The first line is `$6B$` from the laser line and the spacing is `$4B$`. Unlike microwave spectroscopy, this works for homonuclear molecules: the polarisability of H₂ or N₂ is anisotropic even though there is no dipole. Spherical tops (CH₄, SF₆) have isotropic polarisability and no rotational Raman spectrum.

**Worked example.** N₂ has `$B = 1.99$` cm⁻¹. Where are the first three Stokes lines?

1. `$6B = 11.9$`, `$10B = 19.9$`, `$14B = 27.9$` cm⁻¹ from the laser line, spaced by `$4B = 8.0$` cm⁻¹.
2. With `$kT/hc = 208.5$` cm⁻¹ at 300 K, the population peak is near `$J = 7$`, so the strongest lines are around `$4B(7 + \tfrac32) = 68$` cm⁻¹ out. A notch filter must block the laser to within a few cm⁻¹ to see them.

**Nuclear spin statistics.** In a homonuclear molecule the total wavefunction must have a definite symmetry when the two nuclei are swapped (antisymmetric for fermions, symmetric for bosons). Swapping them multiplies the rotational part by `$(-1)^J$` (for a ¹Σg⁺ state), so even-`$J$` and odd-`$J$` levels pair with different nuclear spin states and get different weights:

| Molecule | Nuclear spin | Weights (even `$J$` : odd `$J$`) | Pattern |
|---|---|---|---|
| H₂ | `$\tfrac12$` | 1 : 3 | odd-`$J$` lines three times stronger (ortho-H₂) |
| ¹⁴N₂ | 1 | 2 : 1 | even-`$J$` lines twice as strong |
| ¹²C¹⁶O₂ | 0 | 1 : 0 | only even `$J$`: every other line missing |
| ¹⁶O₂ | 0 | 0 : 1 | only odd rotational levels (³Σg⁻ ground state): every other line missing |

For two nuclei of spin `$I$` the ratio of the weights is `$(I+1)/I$`. Measuring the alternation gives nuclear spins: the 2 : 1 pattern of N₂ showed in 1929 that the nitrogen nucleus has spin 1, which a proton-electron model of the nucleus could not explain, an early hint of the neutron.

<figure class="fig" data-fig="raman-lines"><figcaption>A model Raman spectrum around the laser line. In vibrational mode, one Stokes and one weaker anti-Stokes line: raise the temperature or lower the wavenumber to make the anti-Stokes line grow. In rotational mode, lines at ±4B(J + 3/2); switch the nuclear spin case to see the alternating intensities and the missing lines.</figcaption></figure>

## 5. Where Raman is used

Raman needs no sample preparation, works through glass and water (water is a weak Raman scatterer but a strong infrared absorber), and fingerprints minerals, drugs, polymers and pigments. Crystal lattice modes (phonons) show up as low-frequency Raman lines; graphene layers are counted from the shape of one band. Surface-enhanced Raman (SERS) on rough metal boosts signals by up to `$10^{10}$`, enough for single molecules. Stimulated Raman scattering in a strong beam shifts laser light to new colours.

<div class="myth">

**"The Raman shift depends on the laser colour."** The scattered *wavelength* does, but the *shift* in cm⁻¹ is a property of the molecule. A 459 cm⁻¹ band is at 459 cm⁻¹ whether you use a 355 nm or a 785 nm laser.

**"Raman is just fluorescence."** Fluorescence needs absorption into a real excited state and comes out nanoseconds later at a wavelength fixed by the molecule. Raman scattering is instantaneous, needs no absorption, and its lines move with the laser.

</div>

<div class="keypoints">

- `$p = \alpha E$`; Raman active if `$\partial\alpha/\partial Q \ne 0$`. Lines at `$\tilde\nu_0$` (Rayleigh) and `$\tilde\nu_0 \mp \Delta\tilde\nu$` (Stokes, anti-Stokes); `$\tilde\nu = 10^7/\lambda$`(nm).
- Weak (~`$10^{-6}$` of incident); intensity `$\propto \nu^4$`.
- `$I_{AS}/I_S = [(\tilde\nu_0+\Delta\tilde\nu)/(\tilde\nu_0-\Delta\tilde\nu)]^4e^{-1.4388\Delta\tilde\nu/T}$`: a thermometer.
- Vibrational Raman: `$\Delta v = \pm1$`; homonuclear diatomics active. Mutual exclusion with a centre of symmetry.
- Depolarisation `$\rho < \tfrac34$` for totally symmetric modes, `$= \tfrac34$` otherwise.
- Rotational Raman (linear): `$\Delta J = 0, \pm2$`; lines at `$4B(J+\tfrac32)$`: 6B, 10B, 14B, spacing 4B. Spherical tops: none.
- Nuclear spin weights `$(I+1)/I$`: H₂ odd : even = 3 : 1; N₂ even : odd = 2 : 1; CO₂ and ¹⁶O₂ alternate lines missing (spacing 8B).

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [Raman practice page](/learn/courses/gate-physics/practice/raman/).

<div class="qbank" data-bank="physics" data-topics="raman" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.7](/learn/courses/gate-physics/lasers/) turns from scattering to stimulated emission: Einstein coefficients and how a laser works. Rotational constants come from [lesson 6.4](/learn/courses/gate-physics/rotational-spectra/).
