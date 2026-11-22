---
title: 'Electromagnetic waves'
seoTitle: 'Electromagnetic waves: JEE and NEET physics'
summary: 'Displacement current and Maxwell''s equations, how EM waves are made, the relations between E, B and c, reading a wave equation, energy density, intensity, momentum and radiation pressure, waves in a medium, and the electromagnetic spectrum with its sources and uses.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'In an electromagnetic wave in vacuum, the electric and magnetic fields are:'
    choices: ['parallel and in phase', 'perpendicular and 90° out of phase', 'perpendicular to each other and to the direction of travel, and in phase', 'along the direction of travel']
    ans: 2
    why: 'E, B and the direction of travel form a right-handed set (E × B points along the travel), and E and B reach their peaks together.'
  - q: 'Which of these has the shortest wavelength?'
    choices: ['Microwaves', 'Ultraviolet', 'X-rays', 'Infrared']
    ans: 2
    why: 'In order of falling wavelength: radio, microwave, infrared, visible, UV, X-rays, gamma rays.'
  - q: 'The ratio of the average electric energy density to the average magnetic energy density in an EM wave is:'
    choices: ['1', 'c', '1/c', 'c²']
    ans: 0
    why: 'With B = E/c, B²/2μ₀ = E²/(2μ₀c²) = ½ε₀E². The two fields carry equal shares of the energy.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Electromagnetic waves'
  - 'Speed of light c = 299 792 458 m/s (exact), CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 28 minutes.** By the end you will be able to explain displacement current, read any wave equation for E and B, work out intensity and radiation pressure, and place any radiation in the spectrum with its source and use.

<div class="bigidea">A changing magnetic field makes an electric field (Faraday). Maxwell added the mirror image: a changing electric field makes a magnetic field. Each keeps making the other, and the pair travels off through empty space as a wave at the speed of light. Light, radio and X-rays are all this one thing.</div>

## 1. Displacement current

Ampère's law has a problem with a charging capacitor. A loop round the wire encloses current I, but a surface that passes between the plates encloses none, though the loop is the same. Maxwell's fix: a changing electric flux counts as a current too, the **displacement current**:

```math
I_d = \varepsilon_0\frac{d\Phi_E}{dt}, \qquad \oint \vec B\cdot d\vec l = \mu_0(I_c + I_d)
```

Between the plates I_d equals the charging current exactly, so current is continuous all the way round. Inside circular plates of radius R, at distance r from the axis, `$B = \dfrac{\mu_0 I r}{2\pi R^2}$`.

<div class="problem" data-problem="emw-displacement"></div>

**Maxwell's four equations** sum up all of electromagnetism: Gauss's law for E (charges make E), Gauss's law for B (no monopoles), Faraday's law (changing B makes E) and the Ampère-Maxwell law (currents and changing E make B).

## 2. How EM waves are made

A charge at rest makes only E; a steady current makes a steady B. An **accelerating charge** makes changing fields that break away and travel: that is radiation. An electron oscillating at frequency f in an antenna sends out waves of the same frequency. An LC circuit oscillating at `$f = \dfrac{1}{2\pi\sqrt{LC}}$` can drive such an antenna.

## 3. The plane wave

Watch the fields in a wave, then slide through the spectrum.

<figure class="fig" data-fig="em-wave-travel"><figcaption>E (up and down) and B (in and out) oscillate together, at right angles to each other and to the direction of travel. The bar shows where the chosen wavelength sits in the electromagnetic spectrum.</figcaption></figure>

For a wave travelling along x with E along y:

```math
E_y = E_0\sin(kx - \omega t), \qquad B_z = B_0\sin(kx - \omega t), \qquad \frac{E_0}{B_0} = c = \frac{\omega}{k} = \frac{1}{\sqrt{\mu_0\varepsilon_0}}
```

<div class="meaning">
<dl>
<dt>E₀, B₀</dt><dd>amplitudes of the electric (V/m) and magnetic (T) fields</dd>
<dt>k</dt><dd>wave number 2π/λ (rad/m)</dd>
<dt>ω</dt><dd>angular frequency 2πf (rad/s)</dd>
<dt>c</dt><dd>3 × 10⁸ m/s in vacuum, the same for every wavelength</dd>
<dt>Physical meaning</dt><dd>B₀ = E₀/c is tiny in tesla, but it carries just as much energy as E: the units hide the balance.</dd>
</dl>
</div>

**Reading a wave equation.** In `$E = 30\sin(2\times10^{6}x - 6\times10^{14}t)\,\hat j$` V/m: k = 2 × 10⁶ rad/m, so λ = 2π/k ≈ 3.14 µm (infrared); ω/k = 3 × 10⁸ m/s ✓; B₀ = 30/c = 10⁻⁷ T along ẑ (so that E × B points along +x).

<div class="myth">

**"EM waves need a medium, like sound."** They need nothing. The fields themselves are what wave, which is why sunlight crosses 150 million km of near-empty space. They are transverse, so they can be **polarised**; sound in air cannot.

</div>

## 4. Energy, intensity and momentum

- Energy density: `$u = \tfrac12\varepsilon_0E^2 + \dfrac{B^2}{2\mu_0}$`, with equal shares; average `$\bar u = \tfrac12\varepsilon_0E_0^2$`.
- **Intensity** (power per unit area): `$I = \bar u\,c = \tfrac12\varepsilon_0cE_0^2 = \dfrac{c B_0^2}{2\mu_0}$`. The direction of energy flow is E × B (the Poynting vector).
- From a point source of power P: `$I = \dfrac{P}{4\pi r^2}$`, so E₀ falls as 1/r.
- **Momentum:** energy U carries momentum p = U/c. On a surface of area A facing the beam, force = IA/c if absorbed, 2IA/c if fully reflected. **Radiation pressure** I/c or 2I/c.

<div class="problem" data-problem="emw-intensity"></div>

<div class="problem" data-problem="emw-pressure"></div>

**In a medium** of relative permittivity ε_r and permeability μ_r, the speed is `$v = \dfrac{c}{\sqrt{\mu_r\varepsilon_r}}$`, so the refractive index is `$n = \sqrt{\mu_r\varepsilon_r}$`. The frequency stays the same; the wavelength shrinks to λ/n.

## 5. The electromagnetic spectrum

| Type | Wavelength | Source | Detection and uses |
|---|---|---|---|
| Radio | above 0.1 m | oscillating currents in antennas | radio, TV, mobile phones |
| Microwaves | 1 mm to 0.3 m | klystron, magnetron, Gunn diodes | radar, microwave ovens (water absorbs them), satellites |
| Infrared | 700 nm to 1 mm | hot bodies, molecular vibrations | remote controls, night vision, greenhouse effect, physiotherapy |
| Visible | 400 to 700 nm | electrons changing levels in atoms | the eye, photocells |
| Ultraviolet | 1 to 400 nm | very hot bodies (the Sun), arc lamps | sterilising water, LASIK surgery; ozone layer absorbs most |
| X-rays | 0.01 to 10 nm | fast electrons hitting a metal target | medical imaging, crystal structure |
| Gamma rays | below about 0.01 nm | radioactive nuclei | cancer treatment, sterilising food |

Photon energy `$E = hf = \dfrac{hc}{\lambda}$`, with hc ≈ 1240 eV nm: visible photons carry about 2 to 3 eV, X-ray photons thousands of eV. Higher-energy photons can ionise atoms and damage cells.

**Worked example (level 3).** A radar pulse returns from an aircraft 0.2 ms after it was sent. Distance = c × t/2 = 3 × 10⁸ × 10⁻⁴ = **30 km**. Remember to halve the time: the pulse goes there and back.

<div class="keypoints">

- Displacement current I_d = ε₀ dΦ_E/dt makes current continuous through a capacitor.
- Accelerating charges radiate; the wave's frequency equals the source's.
- E ⊥ B ⊥ travel, in phase; E₀ = cB₀; c = 1/√(μ₀ε₀) = ω/k; E × B gives the travel direction.
- u_E = u_B; I = ½ε₀cE₀²; point source I = P/4πr².
- Force IA/c (absorbed), 2IA/c (reflected).
- In a medium v = c/√(μ_rε_r); frequency unchanged.
- Spectrum by falling λ: radio, micro, IR, visible, UV, X, gamma; E = 1240/λ(nm) eV.

</div>
