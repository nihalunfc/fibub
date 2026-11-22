---
title: Nuclear size, spin and moments
summary: 'How big a nucleus is and what shape its charge takes: electron scattering and form factors, the Fermi density with its constant interior and 2.3 fm skin, R = r₀A^(1/3), mirror nuclei and muonic atoms; the Fermi gas model; nuclear spin and parity; magnetic dipole moments, NMR and the quadrupole moment, with the deuteron as the key example.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The central density of nuclei, from carbon to lead, is'
    choices: ['roughly the same, about 0.16 nucleons per fm³', 'proportional to A', 'proportional to A^(1/3)', 'largest for the lightest nuclei by a factor of ten']
    ans: 0
    why: 'Nuclear matter saturates: R grows as A^(1/3), so the volume grows as A and the density stays constant. Only very light nuclei (He, Li) differ noticeably.'
  - q: 'A nucleus with spin J = 1/2 has an electric quadrupole moment that is'
    choices: ['always zero', 'positive if it is prolate', 'negative if it is oblate', 'equal to its intrinsic quadrupole moment']
    ans: 0
    why: 'The spectroscopic moment is Q₀(3K² − J(J + 1))/((J + 1)(2J + 3)) with K = J for the ground state; it vanishes for J = 0 and J = 1/2, whatever the intrinsic shape. A spin-½ state has no preferred axis to show a quadrupole along.'
  - q: 'The deuteron has a small positive quadrupole moment (0.286 fm²). This shows that'
    choices: ['its ground state mixes a little ³D₁ into the ³S₁, so the nuclear force has a tensor part', 'the proton and neutron are in a pure s state', 'the deuteron has spin 0', 'the neutron carries electric charge']
    ans: 0
    why: 'A pure s state is spherical and has Q = 0. About 4% D state, which only a non-central (tensor) force can mix in, gives the measured Q and also explains why μ_d (0.857 μ_N) is less than μ_p + μ_n (0.880 μ_N).'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapters 3 and 16'
  - 'B. Povh, K. Rith, C. Scholz, F. Zetsche and W. Rodejohann, Particles and Nuclei, 7th ed. (2015), chapters 5 and 17'
  - 'R. Hofstadter, Electron scattering and nuclear structure, Reviews of Modern Physics 28, 214 (1956)'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 45 minutes.** The [IIT JAM lesson on nuclei](/learn/courses/iit-jam-physics/nuclei-radioactivity/) covered the basics: protons and neutrons, isotopes, `$R = r_0A^{1/3}$` and the binding curve. Here we look at how those facts are measured and what they say about the nucleus: its charge distribution, its spin, and the magnetic and electric moments that the spin carries.

<div class="bigidea">A nucleus is a drop of nearly incompressible nuclear matter: constant density inside, a soft skin of fixed thickness at the edge, so its radius grows as A^(1/3). Its spin is the total angular momentum of the nucleons, and the spin carries a magnetic dipole moment and (for J ≥ 1) an electric quadrupole moment that tell us which orbits the last nucleons occupy and whether the nucleus is deformed.</div>

## 1. Seeing the charge: electron scattering

To resolve a few femtometres you need a probe with a reduced wavelength below 1 fm: electrons of a few hundred MeV (`$\hbar c = 197$` MeV fm). Electrons feel only the electromagnetic force, so they map the charge density `$\rho(\vec r)$`.

<div class="steps">
<div class="step"><p><b>Point nucleus.</b> Scattering of a relativistic electron from a point charge Ze gives the Mott cross-section (Rutherford with the electron spin factor cos²(θ/2)).</p></div>
<div class="step"><p><b>Extended nucleus.</b> Each bit of charge scatters with a phase e^{i q·r}, where ħq is the momentum transfer, q = 2k sin(θ/2). The amplitudes add, so the cross-section is the point result times |F(q)|².</p></div>
<div class="step"><p><b>Form factor.</b> F(q) is the Fourier transform of the normalised charge density. Measure |F(q)|² over a range of q and transform back to get ρ(r).</p></div>
</div>

```math
\frac{d\sigma}{d\Omega} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{Mott}}|F(q)|^2, \qquad F(q) = \int\rho(\vec r)\,e^{i\vec q\cdot\vec r}\,d^3r = \frac{4\pi}{q}\int_0^\infty\rho(r)\,r\sin(qr)\,dr
```

<div class="meaning">

<dl>
<dt>Small `$q$`</dt><dd>`$F(q) \approx 1 - q^2\langle r^2\rangle/6$`: the slope at the origin gives the rms charge radius, whatever the shape</dd>
<dt>Uniform sphere</dt><dd>`$F(q) = 3[\sin(qR) - qR\cos(qR)]/(qR)^3$`, with its first zero at `$qR = 4.49$`: a diffraction minimum, as for light through a round hole</dd>
<dt>Real nuclei</dt><dd>the minima are filled in and the fall-off is faster, because the edge is soft</dd>
</dl>

</div>

**Worked example.** Where is the first diffraction minimum for 420 MeV electrons on `$^{12}$`C, treated as a uniform sphere with `$R = 1.2A^{1/3} = 2.75$` fm? The zero needs `$q = 4.49/2.75 = 1.63$` fm⁻¹. The electron wave number is `$k = E/\hbar c = 420/197.3 = 2.13$` fm⁻¹, so `$\sin(\theta/2) = q/2k = 0.383$` and `$\theta \approx 45°$`. (The measured minimum is near 51°, because the true rms radius of carbon, 2.47 fm, is smaller than this estimate.)

## 2. The Fermi distribution and R = r₀A^(1/3)

Hofstadter's measurements (Nobel prize 1961) are fitted well by the two-parameter Fermi (Woods-Saxon) shape:

```math
\rho(r) = \frac{\rho_0}{1 + e^{(r - c)/a}}, \qquad c \approx 1.07A^{1/3}\ \text{fm}, \quad a \approx 0.54\ \text{fm}, \quad t = 4a\ln 3 \approx 2.4\ \text{fm}
```

Here `$c$` is the half-density radius and `$t$` is the skin thickness from 90% to 10% of the central density. Three facts stand out, and the figure lets you check them:

- `$\rho_0 \approx 0.16$` nucleons per fm³ (about `$2.7\times10^{17}$` kg/m³) for every nucleus heavier than about A = 12. This is **saturation**: each nucleon only feels its near neighbours, like molecules in a liquid.
- The skin thickness is the same for all nuclei. Light nuclei are nearly all skin; in lead the interior dominates.
- The "equivalent sharp radius" (a uniform sphere with the same rms radius) is `$R = r_0A^{1/3}$` with `$r_0 \approx 1.2$` fm. For a uniform sphere, `$\langle r^2\rangle = \tfrac35R^2$`.

<figure class="fig" data-fig="nuclear-density"><figcaption>Nuclear density ρ(r) for the chosen A (solid), with ¹⁶O, ⁴⁰Ca and ²⁰⁸Pb for comparison (dashed). The shading marks the skin from 90% to 10% of the central density. Move A: the interior density hardly changes while the radius grows as A^(1/3).</figcaption></figure>

**Other measurements agree.** Muonic atoms: a muon is 207 times heavier than an electron, so its Bohr orbit is 207 times smaller (inside the nucleus for heavy elements), and the 2p to 1s energy shift measures the charge radius. **Mirror nuclei** (the two nuclides of a pair swapped by Z ↔ N, like `$^{15}$`O and `$^{15}$`N) have the same strong binding, so their mass difference is pure Coulomb energy. For a uniform sphere, `$E_C = \tfrac35Z(Z-1)e^2/(4\pi\varepsilon_0R)$`, and between mirror partners with Z + 1 and Z protons:

```math
\Delta E_C = \frac65\,\frac{Z e^2}{4\pi\varepsilon_0 R}, \qquad \Delta E_C = E_{\max}(\beta^+) + (m_n - m_H)c^2 + 2m_ec^2 = E_{\max} + 1.804\ \text{MeV}
```

**Worked example.** `$^{15}$`O decays to `$^{15}$`N (Z = 7) with `$E_{\max} = 1.732$` MeV. Then `$\Delta E_C = 3.536$` MeV and `$R = 1.2\times7\times1.44/3.536 = 3.42$` fm, giving `$r_0 = 3.42/15^{1/3} = 1.39$` fm. The uniform-sphere model slightly overestimates `$r_0$` (it ignores exchange and the soft edge), but it confirms the `$A^{1/3}$` law across the mirror pairs.

**Charge versus matter.** Electrons see protons. Hadron scattering and parity-violating electron scattering see the neutrons too: in neutron-rich `$^{208}$`Pb the neutron distribution reaches about 0.2 fm further out (a neutron skin).

<div class="problem" data-problem="charge-radius-mirror"></div>

## 3. The Fermi gas model

Treat the nucleons as free fermions in a box of nuclear volume. With two spin states for each kind of nucleon and `$N = Z = A/2$`, filling momentum space up to `$k_F$` gives

```math
\rho = \frac{2k_F^3}{3\pi^2}\ \Rightarrow\ k_F = \left(\frac{3\pi^2\rho_0}{2}\right)^{1/3} = 1.33\ \text{fm}^{-1}, \qquad E_F = \frac{(\hbar ck_F)^2}{2mc^2} \approx 37\ \text{MeV}
```

With a separation energy of about 8 MeV on top, the well is about 45 MeV deep. The model explains why nucleons inside a nucleus behave almost independently: Pauli blocking leaves nowhere for a collision to send them. It also gives the asymmetry energy of [lesson 8.2](/learn/courses/gate-physics/binding-energy-semf/): putting more nucleons of one kind costs kinetic energy, because they must fill higher momentum states.

## 4. Spin and parity

The nuclear spin `$J$` is the total angular momentum of all nucleons (orbital plus spin), and the parity is the product of `$(-1)^l$` over the occupied orbits. Simple rules follow from pairing, which [lesson 8.3](/learn/courses/gate-physics/shell-model/) explains:

| Nucleus | Ground state | Examples |
|---|---|---|
| even Z, even N | always `$0^+$` | `$^{4}$`He, `$^{16}$`O, `$^{208}$`Pb |
| odd A | half-integer: the `$j$` and parity of the last unpaired nucleon | `$^{17}$`O `$5/2^+$`, `$^{207}$`Pb `$1/2^-$` |
| odd Z, odd N | integer, from coupling two unpaired nucleons | `$^{2}$`H `$1^+$`, `$^{14}$`N `$1^+$` |

Spins are measured from hyperfine structure (a level of electron angular momentum `$I_e$` splits into `$2\min(J, I_e) + 1$` components), from NMR, and from band intensities in molecular spectra (the alternating intensities of `$^{14}$`N₂ lines gave `$J = 1$` and showed, in 1929, that the nucleus could not be made of protons and electrons).

## 5. Magnetic dipole moments

Nucleon moments are measured in nuclear magnetons, `$\mu_N = e\hbar/2m_p = 3.152\times10^{-8}$` eV/T, 1836 times smaller than the Bohr magneton. A nucleus with spin `$J$` has `$\vec\mu = g_J\mu_N\vec J/\hbar$`, and the quoted moment is the value at maximum projection, `$\mu = g_JJ\mu_N$`.

```math
\mu_p = +2.793\,\mu_N, \qquad \mu_n = -1.913\,\mu_N, \qquad \hbar\omega_L = g_J\mu_NB
```

<div class="meaning">

<dl>
<dt>`$g_s$`</dt><dd>5.586 for the proton and −3.826 for the neutron; a point Dirac particle would have 2 and 0, so the nucleons are not elementary (their quark content explains the ratio, see [lesson 8.6](/learn/courses/gate-physics/particles-quarks/))</dd>
<dt>`$g_l$`</dt><dd>1 for the proton, 0 for the neutron: only charge in orbit makes a current</dd>
<dt>NMR</dt><dd>a moment in a field `$B$` precesses at the Larmor frequency; transitions between the `$2J + 1$` levels absorb `$h\nu = g_J\mu_NB$`. For protons, `$\nu/B = 42.58$` MHz/T</dd>
</dl>

</div>

**Worked example.** A 1.5 T hospital MRI scanner: proton resonance at `$42.58\times1.5 = 63.9$` MHz. The energy gap is `$h\nu = 2.64\times10^{-7}$` eV, tiny compared with `$k_BT = 0.025$` eV, so only a few protons per million are polarised; the signal still suffices because water has so many protons.

## 6. The electric quadrupole moment

A charge distribution that is not spherical has a quadrupole moment. The intrinsic moment of a nucleus with symmetry axis `$z$` is

```math
Q_0 = \frac1e\int\rho(\vec r)\,(3z^2 - r^2)\,d^3r \approx \frac25Z(c^2 - a^2) \quad\text{(uniform spheroid, semi-axes } c \text{ along } z,\ a\text{)}
```

Positive `$Q_0$` means prolate (cigar), negative means oblate (disc). What the lab measures is the spectroscopic moment in the state of maximum projection, `$Q = Q_0\,\dfrac{3K^2 - J(J+1)}{(J+1)(2J+3)}$`, which vanishes for `$J = 0$` and `$J = \tfrac12$`: quantum fluctuations of the orientation average the shape away. Quadrupole moments are small near closed shells and very large between them: rare-earth and actinide nuclei have `$Q_0$` of 5 to 10 barns (1 b = 100 fm²), a deformation of about 30% between axes. These nuclei rotate, with energy levels `$\hbar^2J(J+1)/2\mathcal I$` ([lesson 8.3](/learn/courses/gate-physics/shell-model/)).

**The deuteron** (`$J^P = 1^+$`) is the simplest test. Its moment `$\mu_d = 0.857\,\mu_N$` is close to, but less than, `$\mu_p + \mu_n = 0.880\,\mu_N$`, and its quadrupole moment is `$Q = +0.286$` fm². Both are explained if the state is about 96% `$^3S_1$` and 4% `$^3D_1$`. Parity forbids mixing in `$^1P_1$` or `$^3P_1$` (odd `$l$`); only a **tensor force**, depending on the angle between the spins and the line joining the nucleons, can mix S and D. So a single small number tells us the nuclear force is not central.

<div class="myth">

**"The nucleus is a hard ball, and heavier nuclei are denser."** The surface is soft: the density falls from 90% to 10% over about 2.4 fm, the same for every nucleus. And heavy nuclei are not denser: the central density is nearly the same from oxygen to uranium, which is why the radius grows as `$A^{1/3}$` instead of staying fixed.

</div>

<div class="keypoints">

- Electron scattering measures `$|F(q)|^2$`, the Fourier transform of the charge density; `$F \approx 1 - q^2\langle r^2\rangle/6$` at small `$q$`.
- Fermi density: half-density radius `$1.07A^{1/3}$` fm, skin `$t \approx 2.4$` fm, central density `$\rho_0 \approx 0.16$` fm⁻³; equivalent sharp radius `$R = 1.2A^{1/3}$` fm, `$\langle r^2\rangle = \tfrac35R^2$`.
- Mirror nuclei: `$\Delta E_C = \tfrac65Ze^2/(4\pi\varepsilon_0R) = E_{\max}(\beta^+) + 1.804$` MeV.
- Fermi gas: `$k_F \approx 1.33$` fm⁻¹, `$E_F \approx 37$` MeV, well depth about 45 MeV.
- Even-even: `$0^+$`; odd A: `$j^\pi$` of the last nucleon; odd-odd: integer spin.
- `$\mu_N = 3.152\times10^{-8}$` eV/T; `$\mu_p = 2.793$`, `$\mu_n = -1.913$`; NMR at 42.58 MHz/T for protons.
- Spectroscopic `$Q = 0$` for `$J = 0, \tfrac12$`; `$Q > 0$` prolate. The deuteron's `$Q$` and `$\mu_d$` show a 4% D state and a tensor force.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="nuclear-properties" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.2](/learn/courses/gate-physics/binding-energy-semf/) turns the liquid-drop picture into the semi-empirical mass formula and uses it for beta stability, fission and separation energies.
