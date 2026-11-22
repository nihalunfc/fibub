---
title: Hydrogen spectra and fine structure
seoTitle: Hydrogen fine structure and Lamb shift for GATE Physics
summary: 'The exact hydrogen levels and their n² degeneracy, the three fine-structure corrections (relativistic, spin-orbit, Darwin) and the Dirac formula that depends only on n and j, the Lamb shift, hyperfine structure and the 21 cm line, electric dipole selection rules, and alkali spectra with quantum defects and doublets.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In the Dirac theory of hydrogen, which of these pairs of states have exactly the same energy?'
    choices: ['2s₁/₂ and 2p₁/₂', '2p₁/₂ and 2p₃/₂', '2s₁/₂ and 2p₃/₂', '3p₃/₂ and 3d₅/₂']
    ans: 0
    why: 'Dirac levels depend only on n and j. 2s₁/₂ and 2p₁/₂ share n = 2 and j = 1/2, so Dirac makes them degenerate; the Lamb shift (QED) then lifts 2s₁/₂ by about 1058 MHz.'
  - q: 'How does the fine-structure splitting of a given (n, l) level scale with nuclear charge Z in a hydrogen-like ion?'
    choices: ['As Z⁴', 'As Z²', 'As Z', 'It does not depend on Z']
    ans: 0
    why: 'The gross energy goes as Z² and the relative fine-structure correction as (Zα)², so the splitting goes as Z⁴. That is why fine structure is huge in heavy atoms.'
  - q: 'Sodium is excited and its 3p electron falls to 3s. Why are there two yellow lines, not one?'
    choices: ['Spin-orbit coupling splits 3p into j = 1/2 and j = 3/2', 'The 3s level is split by spin-orbit coupling', 'Two isotopes of sodium emit at slightly different wavelengths', 'The nucleus has spin, splitting both levels']
    ans: 0
    why: 'An s level has l = 0, so no spin-orbit energy and only j = 1/2. The 3p level splits into ²P₁/₂ and ²P₃/₂, about 17 cm⁻¹ apart, giving D₁ (589.6 nm) and D₂ (589.0 nm).'
sources:
  - 'H. A. Bethe and E. E. Salpeter, Quantum Mechanics of One- and Two-Electron Atoms (1957), chapters 1 and 2'
  - 'B. H. Bransden and C. J. Joachain, Physics of Atoms and Molecules, 2nd ed. (2003), chapters 5 and 8'
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapter 7'
  - 'C. J. Foot, Atomic Physics (2005), chapters 2 and 6'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 50 minutes.** By the end you will be able to write the fine-structure energy of any hydrogen-like level, explain where each of its three pieces comes from, compute splittings in eV, cm⁻¹ and GHz, say what the Lamb shift and hyperfine structure add, apply the electric dipole selection rules, and use quantum defects for alkali atoms.

<div class="bigidea">The Schrödinger hydrogen atom is right to one part in ten thousand. Everything past that is relativity and spin, and it comes in one size: α² times the gross energy, about 10⁻⁴ eV in hydrogen.</div>

## 1. The starting point

The [Bohr atom](/learn/courses/iit-jam-physics/atoms-x-rays/) and the [Schrödinger equation](/learn/courses/iit-jam-physics/schrodinger-equation/) give the same levels for a one-electron atom of nuclear charge `$Z$`:

```math
E_n = -\frac{Z^2}{n^2}\,R_\infty hc\,\frac{\mu}{m_e}, \qquad R_\infty hc = \tfrac12 m_ec^2\alpha^2 = 13.606\ \text{eV}
```

For a given `$n$` the orbital quantum number runs `$l = 0, 1, \dots, n-1$`, each with `$2l+1$` values of `$m_l$`, so the level holds `$n^2$` orbital states, `$2n^2$` with spin. This degeneracy in `$l$` is special to the pure `$1/r$` potential. Anything that changes the potential (other electrons, relativity) lifts it.

Two numbers set the scale of what follows. The electron's speed in the ground state is `$v = Z\alpha c$`, so relativistic corrections are of relative size `$(v/c)^2 = (Z\alpha)^2$`. With `$\alpha = 1/137.036$`, `$\alpha^2 = 5.325\times10^{-5}$`. The natural unit of fine structure is therefore

```math
\alpha^2 R_\infty hc = 7.245\times10^{-4}\ \text{eV} = 724.5\ \mu\text{eV} = 5.844\ \text{cm}^{-1}
```

## 2. Three corrections of the same size

Expanding the Dirac equation to order `$(v/c)^2$` gives three extra terms in the Hamiltonian. Each is treated in first-order perturbation theory with the hydrogen wavefunctions.

Pick l, s, j and m_j, switch the field on and off, and drag the picture to turn it.

<figure class="fig" data-fig="@qm-vector-model"><figcaption>L and S circle quickly about J while J circles slowly about B. Only the lengths √(x(x+1)) and the z-component m_j are fixed, and g_J sets the Zeeman splitting.</figcaption></figure>

**Relativistic kinetic energy.** `$\sqrt{p^2c^2 + m^2c^4} - mc^2 = p^2/2m - p^4/8m^3c^2 + \dots$` The second term lowers every level, most strongly for low `$l$`, whose electrons come closest to the nucleus and move fastest:

```math
E_{\text{rel}} = -\frac{E_n^{(0)2}}{2m_ec^2}\left(\frac{4n}{l+\frac12} - 3\right)
```

**Spin-orbit coupling.** In the electron's rest frame the nucleus circles it and makes a magnetic field `$\mathbf B = -\mathbf v\times\mathbf E/c^2$`. The spin magnetic moment feels it. Including the Thomas precession factor of one half,

```math
H_{\text{so}} = \frac{1}{2m_e^2c^2}\,\frac1r\frac{dV}{dr}\,\mathbf L\cdot\mathbf S, \qquad \mathbf L\cdot\mathbf S = \frac{\hbar^2}{2}\left[j(j+1) - l(l+1) - s(s+1)\right]
```

so states with `$j = l + \tfrac12$` go up and `$j = l - \tfrac12$` go down. For `$l = 0$` it vanishes.

**Darwin term.** The electron cannot be localised better than its Compton wavelength, so it samples the potential over a small region. Only `$s$` states, which have `$\psi(0)\neq0$`, feel it. It is a contact term proportional to `$|\psi(0)|^2$`.

<div class="steps">
<div class="step"><p><b>Add them for l ≥ 1.</b> Write the spin-orbit result for j = l ± 1/2 and add the relativistic term: the l-dependence cancels and only j is left.</p></div>
<div class="step"><p><b>Check l = 0.</b> Spin-orbit is zero but the Darwin term supplies exactly what the j = 1/2 formula needs.</p></div>
<div class="step"><p><b>Result.</b> One formula for every level, depending only on n and j.</p></div>
</div>

```math
E_{nj} = -\frac{Z^2R_\infty hc}{n^2}\left[1 + \frac{(Z\alpha)^2}{n^2}\left(\frac{n}{j+\frac12} - \frac34\right)\right]
```

This is exactly what the full Dirac equation gives to this order. Since `$n/(j+\tfrac12) \ge 1 > \tfrac34$`, every level is pushed *down*, and the lowest `$j$` most.

<div class="meaning">

<dl>
<dt>α</dt><dd>the fine-structure constant e²/(4πε₀ħc) ≈ 1/137, the electron's ground-state speed in units of c</dd>
<dt>j</dt><dd>total angular momentum, l ± 1/2; the label that survives once spin and orbit are coupled</dd>
<dt>(Zα)²/n²</dt><dd>the relative size of the correction: tiny for hydrogen, large for inner electrons of heavy atoms</dd>
<dt>n/(j + 1/2) − 3/4</dt><dd>the shape factor; levels with the same n and j stay degenerate</dd>
<dt>Thomas factor 1/2</dt><dd>a purely kinematic correction for the rotating rest frame of the electron; without it the spin-orbit term is twice too large</dd>
</dl>

</div>

<figure class="fig" data-fig="fine-structure-levels"><figcaption>Hydrogen-like levels for one n: the Bohr level, the Dirac levels labelled by j (shown as nl_j terms), and the Lamb-shifted s levels. Raise Z and the splitting grows as Z⁴; the Lamb shift is drawn to an approximate scale.</figcaption></figure>

## 3. Sizes worth remembering

The splitting between `$j = l - \tfrac12$` and `$j = l + \tfrac12$` within one `$(n, l)$` follows from the formula:

```math
\Delta E_{\text{fs}} = \frac{\alpha^2 R_\infty hc\,Z^4}{n^3\,l(l+1)}
```

**Worked example.** Find the 2p fine-structure splitting in hydrogen and in He⁺.

1. Hydrogen, `$n = 2$`, `$l = 1$`: `$\Delta E = 724.5/(8\times2) = 45.3$` μeV.
2. In wavenumber: `$5.844/16 = 0.365$` cm⁻¹; in frequency: `$0.365\times29.98 = 10.9$` GHz.
3. He⁺ has `$Z = 2$`, so `$Z^4 = 16$`: `$\Delta E = 725$` μeV `$= 5.84$` cm⁻¹ = 175 GHz.

**Worked example.** How far is the hydrogen ground state below the Bohr value?

1. `$n = 1$`, `$j = \tfrac12$`: shape factor `$1/1 - 3/4 = \tfrac14$`.
2. Shift `$= -(13.606)(\alpha^2)(\tfrac14) = -724.5/4 = -181$` μeV.

<div class="problem" data-problem="fs-splitting"></div>

<div class="problem" data-problem="dirac-shift"></div>

## 4. Beyond Dirac: Lamb shift and hyperfine structure

**Lamb shift.** In 1947 Lamb and Retherford drove microwave transitions in a beam of metastable 2s hydrogen atoms and found that 2s₁/₂ sits about 1058 MHz (4.4 μeV) *above* 2p₁/₂, which Dirac makes degenerate. The cause is the quantised electromagnetic field: vacuum fluctuations jiggle the electron and smear its charge over a small region, which mostly raises `$s$` states (they sit where the Coulomb potential is steepest). The shift scales roughly as `$\alpha^5 Z^4/n^3$`, one power of `$\alpha$` smaller than fine structure. Explaining it launched quantum electrodynamics.

**Hyperfine structure.** The proton has spin `$I = \tfrac12$` and a magnetic moment about 660 times smaller than the electron's. Coupling `$\mathbf F = \mathbf J + \mathbf I$` splits the hydrogen ground state into `$F = 1$` and `$F = 0$`, separated by 5.87 μeV, frequency 1420.4 MHz, wavelength 21.1 cm. The magnetic dipole transition is extremely slow (lifetime about 10 million years), but there is so much hydrogen in a galaxy that the line maps it; the [Hydrogen line analyser](/science/hydrogen-line-analyser/) works with real 21 cm spectra.

The hierarchy in hydrogen, then: gross structure (eV), fine structure (`$10^{-4}$` eV), Lamb shift (`$10^{-5}$` to `$10^{-6}$` eV), hyperfine (`$10^{-6}$` eV).

## 5. Which lines appear: selection rules

An electric dipole (E1) photon carries one unit of angular momentum and the dipole operator `$\mathbf r$` is odd under parity. For one electron:

```math
\Delta l = \pm1, \qquad \Delta j = 0, \pm1, \qquad \Delta m_j = 0, \pm1
```

`$\Delta l = 0$` is forbidden by parity, so 2s cannot decay to 1s by E1; it decays by two-photon emission in about 0.12 s, a metastable state (which is why Lamb could make a beam of it).

**Worked example.** How many fine-structure components does Hα (`$n = 3 \to 2$`) have?

1. Levels: 3s₁/₂, 3p₁/₂, 3p₃/₂, 3d₃/₂, 3d₅/₂ and 2s₁/₂, 2p₁/₂, 2p₃/₂.
2. Allowed (`$\Delta l = \pm1$`, `$\Delta j \le 1$`): 3s₁/₂→2p₁/₂, 3s₁/₂→2p₃/₂, 3p₁/₂→2s₁/₂, 3p₃/₂→2s₁/₂, 3d₃/₂→2p₁/₂, 3d₃/₂→2p₃/₂, 3d₅/₂→2p₃/₂. Seven transitions; 3d₅/₂→2p₁/₂ fails `$\Delta j$`.
3. In Dirac theory energies depend only on `$j$`, so transitions with the same pair of `$j$` values coincide: 7 transitions but 5 distinct frequencies, all within about 0.5 cm⁻¹. Doppler broadening blurs them into two humps in an ordinary discharge.

## 6. Alkali atoms: one electron outside a core

Lithium, sodium, potassium: one valence electron moving round a closed core of charge `$+e$`. Far out it sees hydrogen; inside the core it sees more of the nucleus. Penetrating orbits (low `$l$`) are bound more tightly, so the `$l$` degeneracy is lifted strongly. The levels fit the Rydberg formula with a **quantum defect** `$\delta_l$`:

```math
E_{nl} = -\frac{13.6\ \text{eV}}{(n - \delta_l)^2}
```

`$\delta_l$` hardly depends on `$n$` but falls quickly with `$l$`: for sodium `$\delta_s \approx 1.35$`, `$\delta_p \approx 0.86$`, `$\delta_d \approx 0.01$`. The old spectroscopic names sharp, principal, diffuse and fundamental give the letters s, p, d, f: the principal series is np → 3s, the sharp series ns → 3p, the diffuse series nd → 3p.

**Worked example.** Sodium's ionisation energy is 5.14 eV. Find the quantum defect of 3s.

1. `$n^* = \sqrt{13.6/5.14} = 1.627$`.
2. `$\delta_s = 3 - 1.627 = 1.37$`: the 3s electron behaves as if `$n$` were 1.63.

**Doublets.** Every level with `$l \ge 1$` splits into `$j = l \pm \tfrac12$`, so lines from p levels come in pairs. The sodium D lines (3p → 3s) are 589.0 nm (²P₃/₂) and 589.6 nm (²P₁/₂), 17.2 cm⁻¹ apart, about fifty times hydrogen's 2p splitting because the 3p electron penetrates to where the effective charge is large. The pairs in the sharp series all have the same spacing (it is the 3p splitting); those of the principal series shrink as `$n$` grows. The [Spectral line identifier](/science/spectral-line-identifier/) matches these lines in real spectra, and the astronomy course's [spectral lines lesson](/learn/courses/astronomy/spectral-lines/) shows them in stars.

<div class="myth">

**"Spin-orbit coupling alone is the fine structure."** In hydrogen the relativistic mass correction is just as big, and the Darwin term matters for s states. Only the sum depends neatly on `$j$`; quoting spin-orbit alone gets the 2s level wrong and splits 2s₁/₂ from 2p₁/₂.

**"Hyperfine structure is a smaller version of fine structure."** It has a different origin: the nucleus's own magnetic moment. That is why it depends on the isotope (deuterium's 21 cm counterpart is at 327 MHz) while fine structure does not.

</div>

<div class="keypoints">

- Gross levels `$E_n = -13.6Z^2/n^2$` eV, `$2n^2$`-fold degenerate. Fine structure is of relative size `$(Z\alpha)^2$`; unit `$\alpha^2 R_\infty hc = 724.5$` μeV = 5.844 cm⁻¹.
- Three terms: relativistic `$-p^4/8m^3c^2$`, spin-orbit (`$\propto \mathbf L\cdot\mathbf S$`, zero for `$l = 0$`, Thomas factor ½), Darwin (s states only).
- Dirac: `$E_{nj} = E_n[1 + (Z\alpha)^2 n^{-2}(n/(j+\tfrac12) - \tfrac34)]$`; depends on `$n$`, `$j$` only; all levels pushed down.
- Splitting within `$(n,l)$`: `$\alpha^2R_\infty hc Z^4/(n^3 l(l+1))$`; 2p of H: 45 μeV, 0.365 cm⁻¹, 10.9 GHz.
- Lamb shift lifts 2s₁/₂ above 2p₁/₂ by 1058 MHz (QED). Hyperfine: H ground state F = 0, 1, 1420 MHz, 21 cm.
- E1 rules: `$\Delta l = \pm1$`, `$\Delta j = 0,\pm1$`; 2s is metastable.
- Alkalis: `$E = -13.6/(n-\delta_l)^2$` eV, `$\delta_l$` largest for s; p levels split into doublets (Na D: 589.0 and 589.6 nm).

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [fine structure practice page](/learn/courses/gate-physics/practice/fine-structure/).

<div class="qbank" data-bank="physics" data-topics="fine-structure" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.2](/learn/courses/gate-physics/ls-jj-coupling/) adds more electrons: terms, Hund's rules and the two ways of coupling angular momenta.

**Going on to CSIR NET?** [The Klein-Gordon and Dirac equations](/learn/courses/csir-net-physics/relativistic-quantum/) shows where spin and the fine-structure terms come from.
