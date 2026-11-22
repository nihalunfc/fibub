---
title: 'Condensed matter: what NET asks'
seoTitle: CSIR NET Physics condensed matter roadmap
summary: 'What CSIR NET Part C asks from condensed matter physics (lattices and diffraction, bonding, phonons and heat capacity, free electrons and the Drude model, Hall effect, band theory, superconductivity and Josephson junctions, superfluidity, defects, liquid crystals and quasicrystals), the order to study it, the GATE lessons that teach it, a self-check list and a worked tight-binding example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In a 1D tight-binding band E(k) = E₀ − 2t cos(ka), the effective mass at the band bottom is'
    choices: ['ħ²/(2ta²)', 'ħ²/(ta²)', '2ħ²/(ta²)', 'ħ²/(4ta²)']
    ans: 0
    why: 'Near k = 0, E ≈ E₀ − 2t + ta²k², and ħ²k²/(2m*) = ta²k² gives m* = ħ²/(2ta²).'
  - q: 'At low temperature the heat capacity of a metal behaves as'
    choices: ['γT + AT³ (electrons plus phonons)', 'AT³ only', 'a constant 3Nk', 'γT² only']
    ans: 0
    why: 'Electrons near the Fermi level give a term linear in T; phonons give the Debye T³ term. A plot of C/T against T² is a straight line.'
  - q: 'Which structure factor rule is right for a body-centred cubic lattice (conventional cubic cell)?'
    choices: ['Reflections with h + k + l odd are absent', 'Reflections with h, k, l mixed even and odd are absent', 'All reflections are present', 'Reflections with h + k + l even are absent']
    ans: 0
    why: 'With atoms at (0,0,0) and (½,½,½), S = f[1 + (−1)^(h+k+l)], which vanishes when h + k + l is odd. The mixed-parity rule belongs to face-centred cubic.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Condensed Matter Physics (advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (Holt, Rinehart and Winston, 1976)'
  - 'P. M. Chaikin and T. C. Lubensky, Principles of Condensed Matter Physics (Cambridge, 1995), for ordered phases'
---

**Module 9 · about 30 minutes to read, 2 weeks to work through.** Condensed matter is a Part C unit with a wide syllabus but a small set of recurring calculations: structure factors, phonon dispersion, Debye and free-electron numbers, effective masses and Hall coefficients. This roadmap lists what is asked, the order, the lessons, a worked example and a checklist.

<div class="bigidea">A solid is a lattice plus waves: X-rays, phonons and electrons are all waves in a periodic structure, so they all live in the reciprocal lattice and the Brillouin zone. Learn that picture once and diffraction, phonons and bands become the same idea three times.</div>

## 1. What NET asks

Described from the published syllabus (check the current one). All of it is **Part C**:

- Bravais lattices; the reciprocal lattice; diffraction and the structure factor.
- Bonding in solids; elastic properties; phonons and lattice heat capacity.
- Free-electron theory and the electronic heat capacity; response and relaxation; the Drude model of electrical and thermal conduction; the Hall effect and thermoelectric power.
- Electrons in a periodic potential: band theory of metals, insulators and semiconductors.
- Superconductivity: type I and type II; Josephson junctions; superfluidity.
- Defects and dislocations.
- Ordered phases: translational and orientational order, liquid crystals; quasicrystals.

Basic magnetism (dia-, para- and ferromagnetism) is listed under statistical physics in the NET syllabus but is taught here alongside solids; see [roadmap 6.1](/learn/courses/csir-net-physics/stat-roadmap/).

<div class="meaning">

<dl>
<dt>Reciprocal lattice</dt><dd>vectors G with e^(iG·R) = 1 for every lattice vector R; diffraction happens when the change in wavevector equals a G</dd>
<dt>Structure factor</dt><dd>S(G) = Σ f_j e^(−iG·r_j) over the basis; S = 0 means a missing reflection</dd>
<dt>Effective mass</dt><dd>1/m* = (1/ħ²) d²E/dk²; negative near a band top (holes)</dd>
<dt>Hall coefficient</dt><dd>R_H = 1/(nq): its sign gives the carrier charge and its size the density</dd>
<dt>Physical meaning</dt><dd>Periodicity limits wavevectors to a Brillouin zone and opens gaps at its edges, which is why some solids conduct and others do not.</dd>
</dl>

</div>

## 2. The order to study it

1. **Lattices**: JAM [crystal structure and Miller indices](/learn/courses/iit-jam-physics/crystal-structure/) and [X-ray diffraction](/learn/courses/iit-jam-physics/x-ray-diffraction/) for the basics, then GATE [Bravais lattices and the reciprocal lattice](/learn/courses/gate-physics/reciprocal-lattice/) and [the structure factor](/learn/courses/gate-physics/structure-factor/).
2. **Bonding**: GATE [bonding in solids](/learn/courses/gate-physics/bonding/).
3. **Lattice dynamics**: GATE [phonons](/learn/courses/gate-physics/phonons/), then [Einstein and Debye heat capacity](/learn/courses/gate-physics/heat-capacity/).
4. **Electrons**: GATE [free electron model](/learn/courses/gate-physics/free-electron-model/) (Drude, Sommerfeld, Hall effect), then [band theory](/learn/courses/gate-physics/band-theory/).
5. **Semiconductors**: GATE [semiconductors, Landau levels and the Hall effect](/learn/courses/gate-physics/semiconductors-hall/).
6. **Magnetism and superconductivity**: GATE [magnetism](/learn/courses/gate-physics/magnetism/) and [superconductivity](/learn/courses/gate-physics/superconductivity/).
7. **NET extras in this course**: [lesson 9.2](/learn/courses/csir-net-physics/defects-dislocations/) (defects and dislocations), [lesson 9.3](/learn/courses/csir-net-physics/dielectric-optical/) (dielectric and optical properties of solids) and [lesson 9.4](/learn/courses/csir-net-physics/quantum-hall/) (the quantum Hall effect and low-dimensional systems).

Liquid crystals, quasicrystals and superfluidity appear rarely and at a descriptive level: know the kinds of order (nematic, smectic, cholesteric), what makes a quasicrystal (long-range order without periodicity, forbidden rotational symmetries such as fivefold), and the lambda transition of helium-4.

Two pictures to keep in mind while you study this block: the structures you must know and the band picture that decides who conducts.

<figure class="fig" data-fig="@sx-cell-3d"><figcaption>Counting atoms per cell, coordination numbers and packing fractions for the standard structures.</figcaption></figure>

<figure class="fig" data-fig="@sx-band-fill"><figcaption>Metal, semiconductor or insulator is decided by the gap and the temperature.</figcaption></figure>

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Bravais and reciprocal lattices | [GATE 7.1](/learn/courses/gate-physics/reciprocal-lattice/), [JAM crystals](/learn/courses/iit-jam-physics/crystal-structure/) | primitive cells, reciprocal of fcc is bcc, Brillouin zones |
| Diffraction, structure factor | [GATE 7.2](/learn/courses/gate-physics/structure-factor/), [JAM X-rays](/learn/courses/iit-jam-physics/x-ray-diffraction/) | missing reflections, powder patterns |
| Bonding | [GATE 7.3](/learn/courses/gate-physics/bonding/) | Madelung energy, Lennard-Jones equilibrium |
| Phonons | [GATE 7.4](/learn/courses/gate-physics/phonons/) | 1D monatomic and diatomic chains, sound speed, gaps |
| Heat capacity | [GATE 7.5](/learn/courses/gate-physics/heat-capacity/) | Debye T³, Einstein freeze-out, Dulong-Petit |
| Free electrons, Drude, Hall | [GATE 7.6](/learn/courses/gate-physics/free-electron-model/) | E_F, density of states, Wiedemann-Franz, R_H |
| Bands | [GATE 7.7](/learn/courses/gate-physics/band-theory/) | Kronig-Penney, tight binding, effective mass |
| Semiconductors, Landau levels | [GATE 7.8](/learn/courses/gate-physics/semiconductors-hall/) | intrinsic carrier density, mobility, cyclotron frequency |
| Magnetism | [GATE 7.9](/learn/courses/gate-physics/magnetism/) | Curie law, Curie-Weiss, Langevin diamagnetism |
| Superconductivity | [GATE 7.10](/learn/courses/gate-physics/superconductivity/) | London depth, critical field, flux quantum `$h/2e$`, Josephson relation |
| Defects, optics, quantum Hall | lessons [9.2](/learn/courses/csir-net-physics/defects-dislocations/) to [9.4](/learn/courses/csir-net-physics/quantum-hall/) | Burgers vector, Clausius-Mossotti, `$\sigma_{xy} = \nu e^2/h$` |

## 4. A worked NET-style example

**Question (Part C style).** Electrons in a one-dimensional crystal with lattice constant `$a = 0.3$` nm have the tight-binding band `$E(k) = E_0 - 2t\cos(ka)$` with `$t = 1$` eV. The effective mass at the bottom of the band, in units of the free-electron mass, is about

(a) 0.21 (b) 0.42 (c) 0.85 (d) 1.0.

**Solution.**

1. Near `$k = 0$`, `$\cos(ka) \approx 1 - \tfrac12k^2a^2$`, so `$E \approx E_0 - 2t + ta^2k^2$`.
2. Compare with `$\hbar^2k^2/(2m^*)$`: `$m^* = \dfrac{\hbar^2}{2ta^2}$`.
3. Numbers:

```math
m^* = \frac{(1.055\times10^{-34})^2}{2\times(1.602\times10^{-19})\times(0.3\times10^{-9})^2} = 3.86\times10^{-31}\ \text{kg} \approx 0.42\,m_e
```

4. Option (b).

**Traps.** Dropping the factor 2 in `$2ta^2$` gives (c). Near the band top (`$k = \pi/a$`) the same calculation gives `$m^* = -\hbar^2/(2ta^2)$`: the carriers behave as positive holes. The band is `$4t = 4$` eV wide: a wider band (larger `$t$`) means lighter electrons.

**A related live problem.** The free-electron model gives the other key energy scale:

<div class="problem" data-problem="net-fermi-energy"></div>

## 5. Self-check before moving on

You are ready for nuclear physics when you can, without notes:

- write the primitive vectors of fcc and bcc and show that their reciprocal lattices are bcc and fcc;
- list the allowed reflections of sc, bcc, fcc and diamond structures;
- derive the dispersion of a 1D monatomic chain and find the sound speed and the maximum frequency;
- get the Debye `$T^3$` law and the Dulong-Petit limit, and read `$\gamma$` and the Debye temperature off a plot of `$C/T$` against `$T^2$`;
- find `$E_F$`, `$k_F$` and the density of states at `$E_F$` for a given electron density in 1D, 2D and 3D;
- use the Drude model for conductivity and the Wiedemann-Franz law;
- get carrier sign and density from a Hall measurement;
- find the effective mass from a band and explain holes;
- state the London equation, the flux quantum `$h/2e$` and the AC Josephson frequency `$2eV/h$`;
- tell type I from type II superconductors from their magnetisation curves.

<div class="myth">

**"Electrons in a perfect crystal scatter off the ions, and that causes resistance."** In a perfect periodic lattice Bloch electrons move without scattering. Resistance comes from departures from perfect periodicity: phonons, impurities and defects.

</div>

<div class="keypoints">

- Part C only: lattices and diffraction, bonding, phonons and heat capacity, free electrons and Hall effect, bands, superconductivity, defects, ordered phases.
- Order: lattices, structure factor, bonding, phonons and heat capacity, free electrons, bands, semiconductors, magnetism and superconductivity, lessons [9.2](/learn/courses/csir-net-physics/defects-dislocations/) to [9.4](/learn/courses/csir-net-physics/quantum-hall/).
- Reciprocal lattice and Brillouin zone unify diffraction, phonons and bands; `$1/m^* = E''(k)/\hbar^2$`.

</div>

## Practise: a mixed condensed matter set

<div class="qbank" data-bank="physics" data-topics="reciprocal-lattice,structure-factor,bonding,phonons,heat-capacity,free-electron-model,band-theory,semiconductors-hall,magnetism,superconductivity" data-exam="net" data-n="10"></div>

**Next:** the first lesson of this unit, [Defects and dislocations](/learn/courses/csir-net-physics/defects-dislocations/). Already strong in this unit? Skip ahead to the [nuclear and particle physics roadmap](/learn/courses/csir-net-physics/nuclear-roadmap/).
