---
title: Structure of the atom
seoTitle: 'Structure of the atom: JEE and NEET chemistry'
summary: 'From Thomson and Rutherford to the Bohr model and quantum mechanics: photons and the photoelectric effect, hydrogen spectra, de Broglie waves, the uncertainty principle, quantum numbers, orbitals and nodes, and electron configurations with their exceptions.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'How many spectral lines can appear when electrons in many hydrogen atoms fall from n = 5 to n = 1?'
    choices: ['4', '5', '10', '15']
    ans: 2
    why: 'Any pair of levels from 1 to 5 can give a line: 5 × 4 / 2 = 10. One atom alone can give at most 4 lines (5→4→3→2→1).'
  - q: 'How many radial nodes does a 3p orbital have?'
    choices: ['0', '1', '2', '3']
    ans: 1
    why: 'Radial nodes = n − l − 1 = 3 − 1 − 1 = 1. It also has l = 1 angular node, 2 nodes in total (n − 1).'
  - q: 'Which configuration is correct for chromium (Z = 24)?'
    choices: ['[Ar] 3d⁴ 4s²', '[Ar] 3d⁵ 4s¹', '[Ar] 3d⁶', '[Ar] 4s² 4p⁴']
    ans: 1
    why: 'A half-filled d subshell (with exchange energy and symmetry) is extra stable, so one 4s electron moves to 3d: 3d⁵ 4s¹. Copper does the same for a full 3d¹⁰.'
sources:
  - 'NIST, CODATA values: Rydberg constant 1.097 × 10⁷ m⁻¹, Planck constant 6.626 × 10⁻³⁴ J s https://physics.nist.gov/cuu/Constants/'
  - 'NIST Atomic Spectra Database (hydrogen line wavelengths) https://www.nist.gov/pml/atomic-spectra-database'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Structure of atom'
---

**Chemistry · Class 11 · about 34 minutes.** By the end you will be able to work out the energy, radius and speed of an electron in any Bohr orbit, predict spectral lines, use de Broglie and uncertainty relations, and write and check any electron configuration.

<div class="bigidea">Electrons in atoms can only have certain energies. Jumping between those allowed energies gives off or takes in light of exact colours, and the rules that decide the allowed energies (quantum numbers) also decide how electrons fill the atom and how the element behaves.</div>

## 1. Discovering the parts of the atom

<div class="steps">
<div class="step"><b>Electrons (J. J. Thomson, 1897).</b> Cathode rays bend in electric and magnetic fields the same way whatever the gas or metal, so they are a universal particle with charge-to-mass ratio e/m = 1.76 × 10¹¹ C/kg. Millikan's oil drops gave the charge, 1.6 × 10⁻¹⁹ C.</div>
<div class="step"><b>Thomson's model.</b> A sphere of positive charge with electrons embedded ("plum pudding"). It could not explain Rutherford's result.</div>
<div class="step"><b>Rutherford's gold foil (1911).</b> Most alpha particles passed straight through; a very few bounced back. So the atom is mostly empty, with a tiny, dense, positive nucleus (about 10⁻¹⁵ m across, the atom about 10⁻¹⁰ m).</div>
<div class="step"><b>The problem.</b> An electron circling a nucleus is accelerating, so by classical physics it should radiate energy and spiral in within a fraction of a second. Atoms are stable, so classical physics fails inside atoms.</div>
<div class="step"><b>Protons and neutrons.</b> The nucleus holds protons (Z, the atomic number) and neutrons (Chadwick, 1932); mass number A = Z + neutrons. Isotopes: same Z, different A. Isobars: same A, different Z. Isotones: same number of neutrons.</div>
</div>

## 2. Light comes in packets

Light is a wave (`$c = \nu\lambda$`) that delivers energy in packets called photons: `$E = h\nu = hc/\lambda$`. A handy number: **hc = 1240 eV nm**, so a 620 nm photon carries 2 eV.

**Photoelectric effect.** Light shining on a metal frees electrons only if each photon has at least the **work function** φ. Extra energy becomes kinetic energy:

```math
h\nu = \phi + \tfrac12 m v_{\max}^2, \qquad e V_0 = h\nu - \phi
```

<div class="meaning">
<dl>
<dt>ν, λ</dt><dd>frequency and wavelength of the light</dd>
<dt>φ</dt><dd>work function: the least energy needed to free an electron (threshold frequency ν₀ = φ/h)</dd>
<dt>V₀</dt><dd>stopping potential: the reverse voltage that just stops the fastest electrons</dd>
<dt>Physical meaning</dt><dd>One photon frees one electron. Brighter light means more photons, so more electrons, but not faster ones; only a higher frequency gives faster electrons.</dd>
</dl>
</div>

## 3. The Bohr model of hydrogen-like atoms

Bohr (1913) kept the circular orbits but added a rule: angular momentum comes only in whole multiples of h/2π, `$mvr = nh/2\pi$`. For a one-electron atom with nuclear charge Z:

| Quantity | Formula | For hydrogen, n = 1 |
|---|---|---|
| Radius | `$r_n = 0.529\,\dfrac{n^2}{Z}$` Å | 0.529 Å |
| Speed | `$v_n = 2.18 \times 10^6\,\dfrac{Z}{n}$` m/s | 2.18 × 10⁶ m/s |
| Energy | `$E_n = -13.6\,\dfrac{Z^2}{n^2}$` eV | −13.6 eV |

The energy is negative because the electron is bound; zero means just free. Kinetic energy = −E, potential energy = 2E.

<figure class="fig" data-fig="bohr-levels"><figcaption>Energy levels of a hydrogen-like ion. Lines ending on n = 1 form the Lyman series, on n = 2 the Balmer series (visible for hydrogen), on n = 3 Paschen and on n = 4 Brackett.</figcaption></figure>

The wavelength of a line from n₂ to n₁ follows the **Rydberg formula**:

```math
\frac{1}{\lambda} = R\,Z^2\left(\frac{1}{n_1^2} - \frac{1}{n_2^2}\right), \qquad R = 1.097 \times 10^7\ \text{m}^{-1}
```

<div class="problem" data-problem="bohr-wavelength"></div>

Number of lines when electrons drop from level n to the ground state in many atoms: **n(n − 1)/2**; in a single atom, at most n − 1.

**Try it:** drag Z from 1 to 36 and watch each new electron find its box. Stop at N (Z = 7) to see Hund's rule, then jump to Cr (24) and Cu (29) to see the exceptions.

<figure class="fig" data-fig="@chem-aufbau-steps"><figcaption>Up arrows spread across the boxes of a subshell before any pair up (Hund). At Cr and Cu a 4s electron moves into 3d to give a half-full or full d subshell: the unpaired count jumps to 6 for Cr.</figcaption></figure>

<div class="myth">

**"The Bohr model is how atoms really are."** It gets hydrogen-like energies right, but fails for atoms with two or more electrons, cannot explain the splitting of lines in magnetic fields properly, and breaks the uncertainty principle (it gives an exact radius and an exact speed together). Use it for one-electron numbers only.

</div>

## 4. Matter waves and uncertainty

**de Broglie (1924):** every moving particle has a wavelength `$\lambda = h/p = h/mv$`. For an electron accelerated through V volts, `$\lambda = 12.27/\sqrt{V}$` Å. In a Bohr orbit, exactly n wavelengths fit around the circle (`$2\pi r = n\lambda$`), which gives back Bohr's rule.

**Heisenberg's uncertainty principle:** position and momentum cannot both be known exactly, `$\Delta x \cdot \Delta p \ge h/4\pi$`. For everyday objects the limit is far too small to notice; for electrons it is decisive, which is why we speak of orbitals (regions of probability) instead of orbits.

## 5. Quantum numbers and orbitals

| Quantum number | Values | Tells you |
|---|---|---|
| Principal n | 1, 2, 3 … | size and energy (the shell) |
| Azimuthal l | 0 to n − 1 (s, p, d, f) | shape (the subshell); orbital angular momentum `$\sqrt{l(l+1)}\,h/2\pi$` |
| Magnetic m_l | −l to +l | orientation; 2l + 1 orbitals in a subshell |
| Spin m_s | +½ or −½ | the electron's spin |

A shell holds 2n² electrons and n² orbitals. **Nodes** (places where the chance of finding the electron is zero): radial nodes = n − l − 1, angular nodes = l, total = n − 1. So 1s has none, 2s one radial, 2p one angular (a plane through the nucleus).

**Try it:** pick each orbital in turn, drag to turn it, and switch on the nodes. Count the radial and angular nodes and check them against n − l − 1 and l.

<figure class="fig" data-fig="@chem-orbital-3d"><figcaption>Each dot is a place the electron may be found. Notice that 2s and 3p have a spherical node where the dots vanish, that p orbitals have a flat node through the nucleus, and that the blue and orange lobes are opposite in sign.</figcaption></figure>

## 6. Filling the orbitals

- **Aufbau:** fill in order of increasing n + l; for equal n + l, the lower n first: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s.
- **Pauli exclusion:** no two electrons in an atom share all four quantum numbers, so an orbital holds two, with opposite spins.
- **Hund's rule:** in orbitals of equal energy, electrons go in singly with parallel spins before pairing.
- **Exceptions:** half-filled and filled subshells are extra stable (more exchange energy, more symmetry): Cr [Ar]3d⁵4s¹ and Cu [Ar]3d¹⁰4s¹ (also Mo, Ag, Au and others).
- **Magnetic moment:** `$\mu = \sqrt{n(n+2)}$` BM, n = number of unpaired electrons. Fe³⁺ (3d⁵) has 5 unpaired: 5.92 BM.

<div class="keypoints">

- Rutherford: a tiny dense positive nucleus; classical physics cannot explain stable orbits.
- E = hν = hc/λ, hc = 1240 eV nm; photoelectric: hν = φ + KE_max, eV₀ = hν − φ; intensity changes the number of electrons, frequency their energy.
- Bohr (one-electron atoms): r = 0.529 n²/Z Å, v = 2.18 × 10⁶ Z/n m/s, E = −13.6 Z²/n² eV; KE = −E, PE = 2E.
- 1/λ = R Z²(1/n₁² − 1/n₂²); Lyman to n = 1, Balmer to n = 2; lines from level n: n(n − 1)/2.
- de Broglie λ = h/mv (12.27/√V Å for electrons); Δx·Δp ≥ h/4π.
- Radial nodes n − l − 1, angular nodes l; a shell holds 2n² electrons.
- Aufbau (n + l rule), Pauli, Hund; Cr and Cu exceptions; μ = √(n(n + 2)) BM.

</div>
