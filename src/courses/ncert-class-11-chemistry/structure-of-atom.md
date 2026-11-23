---
title: Structure of Atom
seoTitle: 'Structure of Atom Class 11 notes: Bohr, quantum numbers'
summary: 'Class 11 Structure of Atom with animations: Rutherford, Bohr model, photoelectric effect, de Broglie, quantum numbers and electron configuration.'
minutes: 95
updated: 2026-11-22
quiz:
  - q: 'An electron in hydrogen falls from n = 3 to n = 2. The energy of the photon emitted is about:'
    choices: ['1.89 eV', '10.2 eV', '12.1 eV', '0.66 eV']
    ans: 0
    why: 'E₃ = −13.6/9 = −1.51 eV and E₂ = −13.6/4 = −3.40 eV. ΔE = 3.40 − 1.51 = 1.89 eV (red light, 656 nm, the first Balmer line).'
  - q: 'Which set of quantum numbers is NOT allowed?'
    choices: ['n = 2, l = 2, mₗ = 0', 'n = 3, l = 2, mₗ = −2', 'n = 1, l = 0, mₗ = 0', 'n = 4, l = 3, mₗ = +3']
    ans: 0
    why: 'l can only go from 0 to n − 1. For n = 2 the largest l is 1, so l = 2 is not allowed.'
  - q: 'The ground-state electron configuration of chromium (Z = 24) is:'
    choices: ['[Ar] 3d⁵ 4s¹', '[Ar] 3d⁴ 4s²', '[Ar] 3d⁶', '[Ar] 4s² 4p⁴']
    ans: 0
    why: 'A half-filled 3d subshell (five unpaired electrons) is extra stable, so one 4s electron moves to 3d: [Ar] 3d⁵ 4s¹ with six unpaired electrons.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 2 “Structure of Atom” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Fundamental constants (h, c, e, electron mass, Bohr radius): CODATA recommended values 2018, NIST'
  - 'Bohr, N. (1913), Philosophical Magazine 26, 1; Rutherford, E. (1911), Philosophical Magazine 21, 669; Thomson, J. J. (1897), Philosophical Magazine 44, 293; Chadwick, J. (1932), Nature 129, 312 (for the history box)'
  - 'Einstein, A. (1905), Annalen der Physik 17, 132 (photoelectric effect); de Broglie, L. (1924), Philosophical Magazine 47, 446; Heisenberg, W. (1927), Zeitschrift für Physik 43, 172'
  - 'Hydrogen spectral series wavelengths: NIST Atomic Spectra Database, hydrogen'
---

**Chemistry · Class 11 · Chapter 2 · about 95 minutes.** By the end you will be able to describe the particles in an atom, explain why Rutherford and Bohr needed new models, calculate the energy and wavelength of light from hydrogen, use the photoelectric effect and the de Broglie relation, explain orbitals and quantum numbers, and write the electron configuration of any element up to Z = 30 and beyond.

<div class="bigidea">An atom is mostly empty space with a tiny, heavy nucleus in the middle. The electrons around it cannot have just any energy: they can sit only on certain <b>levels</b>, like a person who can stand only on the steps of a staircase and never between them. When an electron steps down, the atom gives out a packet of light whose colour tells you which steps it used. That is how we read the insides of atoms from their light.</div>

## 1. The particles inside an atom

Dalton thought atoms were solid and indivisible. Experiments between 1897 and 1932 showed that they are made of three particles.

| Particle | Found by | Charge | Mass | Where |
|---|---|---|---|---|
| electron | J. J. Thomson (1897) | −1.602 × 10⁻¹⁹ C (−1) | 9.109 × 10⁻³¹ kg (about 1/1836 u) | outside the nucleus |
| proton | Goldstein, Rutherford (1886–1919) | +1.602 × 10⁻¹⁹ C (+1) | 1.673 × 10⁻²⁷ kg (1.007 u) | nucleus |
| neutron | James Chadwick (1932) | 0 | 1.675 × 10⁻²⁷ kg (1.009 u) | nucleus |

**Electron.** In a glass tube at very low pressure, high voltage makes a beam called cathode rays. They travel in straight lines, are bent by electric and magnetic fields towards the positive plate, and are the same whatever gas or metal is used. So electrons are a part of every atom. Thomson measured the charge-to-mass ratio, `$e/m = 1.76\times10^{11}\ \text{C kg}^{-1}$`, and Millikan’s oil-drop experiment found the charge e, so the mass followed.

**Atomic number and mass number.** The **atomic number Z** is the number of protons; it identifies the element. The **mass number A** is protons plus neutrons. A symbol is written `$^{A}_{Z}\text{X}$`, for example `$^{23}_{11}\text{Na}$`: 11 protons, 12 neutrons, and 11 electrons when neutral. **Isotopes** have the same Z but different A (carbon-12, carbon-13, carbon-14); they behave alike chemically. **Isobars** have the same A but different Z (⁴⁰Ar and ⁴⁰Ca). An **ion** has gained or lost electrons: Na⁺ has 10 electrons.

<figure class="fig" data-fig="c11c-atom-build"><figcaption>Build any atom up to calcium. Slide the protons (this sets the element), the neutrons (this sets the isotope) and the electrons (this sets the charge) and read the symbol with its mass number, atomic number and charge.</figcaption></figure>

<div class="problem" data-problem="c11c-atom-neutrons"></div>

<div class="myth">

**“Isotopes of an element have different numbers of electrons.”** They have different numbers of *neutrons*. A neutral atom of any isotope still has Z electrons, so isotopes behave the same in chemical reactions; only their masses differ.

</div>

## 2. Early atomic models

**Thomson’s plum-pudding model (1904).** The atom is a sphere of positive charge with electrons embedded in it, like seeds in a watermelon. If this were true, fast alpha particles (He²⁺) fired at a gold foil would pass nearly straight through.

**Rutherford’s experiment (1909–1911).** Geiger and Marsden fired alpha particles at a gold foil 0.0004 mm thick. Most went straight through; a few were deflected through large angles; about 1 in 20 000 bounced almost straight back. Rutherford said it was “as if you fired a shell at tissue paper and it came back”.

<figure class="fig" data-fig="c11c-atom-rutherford"><figcaption>Fire ten alpha particles at one atom. In the plum-pudding model every one goes through with a tiny nudge. Switch to a nucleus and raise its charge: the particles aimed near the centre are flung away or turned back. The paths are computed from Coulomb’s inverse-square repulsion.</figcaption></figure>

**Conclusions.** (1) Most of the atom is empty space. (2) The positive charge and almost all the mass sit in a tiny, dense **nucleus** (radius about 10⁻¹⁵ m, against 10⁻¹⁰ m for the atom: if the atom were a cricket stadium, the nucleus would be a marble at the centre). (3) Electrons revolve around the nucleus.

**Problem with Rutherford’s model.** A revolving charge accelerates, and accelerating charges radiate energy, so the electron should spiral into the nucleus in a fraction of a second. Atoms are stable, so the model needed fixing. It also said nothing about why atoms give line spectra.

<div class="history">

<ul class="timeline">
<li><b>1897</b> J. J. Thomson shows cathode rays are particles much lighter than any atom: the electron.</li>
<li><b>1909</b> Millikan measures the charge of the electron with oil drops.</li>
<li><b>1911</b> Rutherford proposes the nuclear atom from the alpha-scattering results of Geiger and Marsden.</li>
<li><b>1913</b> Niels Bohr explains hydrogen’s line spectrum with quantised orbits.</li>
<li><b>1924</b> Louis de Broglie suggests that matter has a wave nature.</li>
<li><b>1926</b> Schrödinger writes the wave equation of the electron.</li>
<li><b>1932</b> James Chadwick discovers the neutron.</li>
</ul>

</div>

## 3. Light, photons and the photoelectric effect

To see how Bohr fixed the atom, we need the nature of light.

**Electromagnetic radiation** is a wave of electric and magnetic fields travelling at `$c = 3.0\times10^{8}$` m/s in vacuum. Its **wavelength λ**, **frequency ν** and speed are related by `$c = \nu\lambda$`. The **wave number** is `$\bar\nu = 1/\lambda$`. Visible light is only a thin slice of the electromagnetic spectrum (400 to 750 nm).

**Planck’s quantum theory (1900).** Energy is not emitted or absorbed continuously but in small packets, **quanta** (for light, **photons**). The energy of one photon is

```math
E = h\nu = \frac{hc}{\lambda}, \qquad h = 6.626\times10^{-34}\ \text{J s}
```

<div class="meaning">

<dl>
<dt>E</dt><dd>energy of one photon, in joules (or in eV: 1 eV = 1.602 × 10⁻¹⁹ J)</dd>
<dt>h</dt><dd>Planck’s constant: how big the “packet” of energy is for a given frequency</dd>
<dt>ν, λ</dt><dd>frequency (Hz) and wavelength (m) of the light</dd>
<dt>Physical meaning</dt><dd>High frequency means high energy per photon. A single UV photon can break a chemical bond (that is why UV causes sunburn); a radio photon cannot. A handy shortcut: E (eV) = 1240 / λ (nm).</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-atom-wave"><figcaption>Slide the wavelength from gamma rays to radio waves (log scale). The figure names the region and shows the frequency, the energy of one photon in eV and the energy of a mole of photons in kJ/mol.</figcaption></figure>

<div class="problem" data-problem="c11c-atom-photon"></div>

For the whole spectrum with real examples see the [Electromagnetic spectrum](/learn/em-spectrum/) tool.

**Photoelectric effect.** When light shines on a clean metal surface, electrons come out only if the frequency is above a **threshold frequency ν₀**, however bright the light is. Below ν₀, even a very strong beam ejects nothing; above it, even a feeble beam ejects electrons instantly. Wave theory cannot explain this. Einstein (1905) said each photon hits one electron and gives it all its energy:

```math
h\nu = h\nu_0 + \tfrac{1}{2}m v^2 \qquad\text{that is}\qquad K_{\max} = h\nu - \phi
```

`$\phi = h\nu_0$` is the **work function**, the minimum energy to free an electron. Brighter light means more photons per second, so more electrons (more current), but the maximum kinetic energy of each depends only on the frequency.

<figure class="fig" data-fig="@qm-photo-gun"><figcaption>A photocell. Choose the metal and the colour: below the threshold nothing comes out; above it, K = hν − φ. Brightness changes the number of electrons, not their energy.</figcaption></figure>

<div class="problem" data-problem="c11c-atom-photoelectric"></div>

<div class="myth">

**“A brighter red light will eventually eject electrons.”** No. Brightness only raises the number of photons, and each red photon still has too little energy. Think of throwing a thousand tennis balls at a tower: none of them can knock the bell off, but one cricket ball might.

</div>

Try your own metals in the [Photoelectric lab](/learn/photoelectric-lab/).

## 4. Line spectra and Bohr’s model of hydrogen

**Emission and line spectra.** A hot solid gives a **continuous spectrum** (all colours, like a rainbow). A gas of atoms excited by electric discharge gives a **line spectrum**: a few sharp coloured lines, different for every element (sodium’s famous yellow line). Hydrogen has lines in the visible region (the **Balmer series**, red 656 nm, blue-green 486 nm, violet 434 nm and 410 nm). Johannes Rydberg found a formula that gives all lines:

```math
\bar\nu = \frac{1}{\lambda} = 1.097\times10^{7}\ \text{m}^{-1}\left(\frac{1}{n_1^2}-\frac{1}{n_2^2}\right),\qquad n_2 > n_1
```

| Series | n₁ | Region |
|---|---|---|
| Lyman | 1 | ultraviolet |
| Balmer | 2 | visible |
| Paschen | 3 | infrared |
| Brackett | 4 | infrared |
| Pfund | 5 | far infrared |

**Bohr’s postulates (1913).**

1. An electron in a hydrogen-like atom moves in a circular orbit with a **fixed energy**; while it stays there it does not radiate. These are **stationary states**.
2. The angular momentum of the electron is quantised: `$m v r = n\,\dfrac{h}{2\pi}$`, with n = 1, 2, 3 …
3. Light is emitted or absorbed only when the electron jumps between orbits. The photon carries `$\Delta E = E_{\text{high}} - E_{\text{low}} = h\nu$`.

These give the radius and energy of the nth orbit of a one-electron atom with nuclear charge Z:

```math
r_n = 52.9\ \text{pm}\times\frac{n^2}{Z}, \qquad E_n = -2.18\times10^{-18}\ \text{J}\times\frac{Z^2}{n^2} = -13.6\ \text{eV}\times\frac{Z^2}{n^2}
```

The negative sign means the electron is bound; E = 0 is a free electron far away. n = 1 is the **ground state** (−13.6 eV for hydrogen, so 13.6 eV is the **ionisation energy**); higher n are **excited states**. As n grows, the levels crowd together and the radius grows as n².

<figure class="fig" data-fig="c11c-atom-bohr"><figcaption>Bohr energy levels. Choose H, He⁺ or Li²⁺, pick the level the electron starts on (n₂) and the level it falls to (n₁), then press Emit photon. The readout gives ΔE, the wavelength and the series; compare with the real hydrogen lines.</figcaption></figure>

<div class="problem" data-problem="c11c-atom-bohr"></div>

<div class="steps" data-fig="c11c-atom-bohrcalc">
<div class="step">Step 1: write the two energies, E₃ = −13.6/9 = −1.51 eV and E₂ = −13.6/4 = −3.40 eV (n = 3 to n = 2 in hydrogen).</div>
<div class="step">Step 2: subtract (higher minus lower): ΔE = −1.51 − (−3.40) = 1.89 eV.</div>
<div class="step">Step 3: use λ = 1240/ΔE = 1240/1.89 = 656 nm. Red light: the first line of the Balmer series.</div>
</div>

Explore all the lines of hydrogen, with the series highlighted, in the Hydrogen spectrum tool.

<!--fig:tool hydrogen-spectrum-->

**Limitations of Bohr’s model.** It explains hydrogen and hydrogen-like ions (He⁺, Li²⁺) very well but fails for atoms with more than one electron. It cannot explain the splitting of lines in a magnetic field (Zeeman effect) or an electric field (Stark effect), nor the shapes of molecules. It also treats the electron as a particle with an exact position and speed, which the next section shows is impossible.

## 5. Matter waves and the uncertainty principle

**de Broglie (1924):** if light, which we thought was a wave, behaves like particles, then particles like electrons may behave like waves. A particle of mass m and speed v has the wavelength

```math
\lambda = \frac{h}{mv}
```

For a cricket ball (0.16 kg at 40 m/s) λ is about 10⁻³⁴ m: no hope of seeing it. For an electron at 2 × 10⁶ m/s, λ ≈ 360 pm, similar to the spacing between atoms in a crystal, so electrons diffract from crystals, as the electron microscope uses.

<figure class="fig" data-fig="c11c-atom-debroglie"><figcaption>Choose an object and a speed. The marker shows its de Broglie wavelength on a log scale next to the band that is the size of a nucleus up to an atom. Only electrons and other tiny particles sit inside the band.</figcaption></figure>

<div class="problem" data-problem="c11c-atom-debroglie"></div>

Bohr’s second postulate now makes sense: the circumference of an allowed orbit holds a whole number of wavelengths (`$2\pi r = n\lambda$`), like a standing wave on a guitar string. A wave that did not fit would cancel itself.

**Heisenberg’s uncertainty principle (1927).** It is impossible to know both the exact position and the exact momentum of a small particle at the same time:

```math
\Delta x \cdot \Delta p \ \ge\ \frac{h}{4\pi}
```

The more tightly you pin the electron down (small Δx), the more its momentum (and speed) becomes uncertain. For a cricket ball the limit is far too small to matter; for an electron in an atom it is huge. So the idea of a fixed orbit like a planet’s path has to go. We can only talk of the **probability** of finding the electron somewhere.

## 6. The quantum mechanical model and orbitals

Erwin Schrödinger (1926) wrote a wave equation for the electron. Its solutions are **wave functions ψ**, each describing an **orbital**: a region of space around the nucleus where there is a high probability (say 90 %) of finding the electron. `$\psi$` itself has no direct meaning, but `$|\psi|^2$` at a point is the **probability density** there. Unlike Bohr’s orbits, orbitals have shapes, and several orbitals can have the same energy.

### Quantum numbers

Each orbital is named by three quantum numbers, and the electron in it has a fourth.

| Number | Symbol | Allowed values | What it tells us |
|---|---|---|---|
| principal | n | 1, 2, 3 … | shell, size and energy |
| azimuthal (angular momentum) | l | 0 to n − 1 | subshell and shape: l = 0 s, 1 p, 2 d, 3 f |
| magnetic | mₗ | −l to +l | orientation of the orbital (2l + 1 values) |
| spin | mₛ | +½ or −½ | direction of the electron’s spin |

So shell n has n subshells, a subshell l has 2l + 1 orbitals, and shell n has n² orbitals and holds at most 2n² electrons.

<figure class="fig" data-fig="c11c-atom-qn"><figcaption>Slide the shell number. Each row is a subshell (ns, np, nd …) and each box one orbital with its mₗ value. See how the count n² and 2n² comes from adding 1 + 3 + 5 + …</figcaption></figure>

<div class="problem" data-problem="c11c-atom-shell"></div>

### Shapes of orbitals

An **s** orbital is a sphere (one orbital per shell, bigger as n grows). A **p** subshell has three dumb-bell shaped orbitals along the x, y and z axes (pₓ, p_y, p_z), with a nodal plane at the nucleus. The five **d** orbitals have mostly four lobes (d_xy, d_yz, d_zx, d_x²−y², plus the d_z² with a donut and two lobes). A **node** is a place where ψ² is zero; the number of radial (spherical) nodes is n − l − 1 and angular nodes l, so the total is n − 1.

<figure class="fig" data-fig="@chem-orbital-3d"><figcaption>Drag to turn the orbital. Pick s, p or d and switch the sign colours and nodal surfaces on or off. Each dot is a place the electron might be found.</figcaption></figure>

Open the orbitals of hydrogen in more detail:

<!--fig:tool hydrogen-orbitals-->

<div class="history">

**Beyond the syllabus (trimmed from the rationalised Class 11 book; check your board’s list).** The Schrödinger equation itself, the radial wave functions and the radial distribution curves are not asked. The picture below is for curiosity: it shows the chance of finding the electron at distance r for each hydrogen orbital, with nodes where the curve drops to zero.

</div>

<figure class="fig" data-fig="c11c-atom-nodes"><figcaption>Choose 1s, 2s, 2p, 3s, 3p or 3d. The curve is the chance of finding the electron in a thin shell at distance r (in units of 52.9 pm). Dashed lines mark radial nodes; the number of them is n − l − 1.</figcaption></figure>

## 7. Energies of orbitals and filling them with electrons

In hydrogen all orbitals of the same n have the same energy. In an atom with many electrons, the other electrons **shield** the outer ones from the nucleus, so for the same n the energy rises with l: `$E(ns) < E(np) < E(nd) < E(nf)$`. The order of increasing energy follows the **(n + l) rule**: lower n + l first; if equal, lower n first. That gives

```math
1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p < 6s < 4f < 5d < 6p < 7s \ldots
```

Three rules decide how electrons fill the orbitals:

1. **Aufbau principle:** fill the lowest-energy orbitals first.
2. **Pauli exclusion principle:** no two electrons in an atom can have all four quantum numbers the same; an orbital holds at most two electrons, of opposite spin (↑↓).
3. **Hund’s rule:** in orbitals of equal energy (the three p, five d …), put one electron in each before pairing any (all with parallel spin). Cricket analogy: players sit alone on empty benches before sharing.

<figure class="fig" data-fig="@chem-aufbau-steps"><figcaption>Play the electrons dropping into orbital boxes from Z = 1 to 36. Watch Hund’s rule (one in each box first) and the exceptions of Cr and Cu.</figcaption></figure>

**Writing a configuration.** Write the subshells in the order of filling with the number of electrons as a superscript: oxygen (Z = 8) is 1s² 2s² 2p⁴; sodium is 1s² 2s² 2p⁶ 3s¹ or [Ne] 3s¹, using the noble gas core. Iron (Z = 26) is [Ar] 3d⁶ 4s². A cation loses the *outermost* (highest n) electrons first: Fe²⁺ is [Ar] 3d⁶ (the 4s electrons go first).

<div class="steps" data-fig="c11c-atom-fe">
<div class="step">Iron has atomic number 26, so a neutral atom has 26 electrons to place.</div>
<div class="step">Fill in order: 1s² (2), 2s² (4), 2p⁶ (10). Ten electrons used, the neon core.</div>
<div class="step">Next 3s² (12), 3p⁶ (18) and then 4s² (20), because 4s lies lower than 3d. Twenty electrons used.</div>
<div class="step">The last six electrons go into 3d, giving [Ar] 3d⁶ 4s². Hund’s rule: five boxes take one each, the sixth pairs up, so 4 unpaired electrons.</div>
<div class="step">For Fe²⁺ remove two electrons from the outermost shell, 4s (not 3d): Fe²⁺ = [Ar] 3d⁶ and the number of unpaired electrons stays 4.</div>
</div>

<div class="problem" data-problem="c11c-atom-unpaired"></div>

Check any element, with orbital boxes, in the Electron configuration tool:

<!--fig:tool electron-configuration-->

**Extra stability of half-filled and completely filled subshells.** Symmetry and exchange energy make p³, d⁵ and d¹⁰ unusually stable. So chromium is [Ar] 3d⁵ 4s¹ (not 3d⁴ 4s²) and copper is [Ar] 3d¹⁰ 4s¹ (not 3d⁹ 4s²). Watch it happen for chromium:

<div class="steps" data-fig="c11c-atom-config">
<div class="step">Chromium has 24 electrons. The first 18 fill 1s, 2s, 2p, 3s and 3p to give the argon core, leaving 6 electrons.</div>
<div class="step">Rule says 4s fills before 3d: two electrons go into 4s, giving [Ar] 4s².</div>
<div class="step">The next four electrons enter 3d, one per box (Hund’s rule): [Ar] 4s² 3d⁴ would be the “expected” configuration.</div>
<div class="step">Real chromium moves one 4s electron into 3d: [Ar] 3d⁵ 4s¹. All five d boxes are singly occupied with parallel spins, and the 4s box has one electron: six unpaired electrons and extra stability.</div>
</div>

<div class="keypoints">

- Atom: nucleus (protons and neutrons) plus electrons. Z = protons; A = protons + neutrons; isotopes differ in neutrons only.
- Rutherford: a small, dense, positive nucleus with mostly empty space around it; but it could not explain stability or line spectra.
- Photon energy E = hν = hc/λ = 1240/λ(nm) eV. Photoelectric effect: K = hν − φ, needs ν above the threshold; brightness changes the count, not K.
- Bohr (hydrogen-like): E_n = −13.6 Z²/n² eV; r_n = 52.9 n²/Z pm; ΔE = hν for jumps. Spectral series: Lyman (n₁ = 1), Balmer (2), Paschen (3).
- de Broglie λ = h/mv; uncertainty Δx·Δp ≥ h/4π, so only orbitals (probability regions) make sense.
- Quantum numbers: n (1, 2, …), l (0 to n − 1), mₗ (−l to +l), mₛ (±½). Shell holds 2n² electrons; subshell has 2l + 1 orbitals.
- Filling: Aufbau (n + l), Pauli (max 2 per orbital, opposite spin), Hund (one each before pairing). Half- and full subshells are extra stable (Cr, Cu).

</div>

Going further for JEE/NEET: the exam-level work on Bohr-model calculations, the photoelectric effect with stopping potential, de Broglie problems, nodes and quantum-number counting is in [Structure of the atom (JEE and NEET)](/learn/courses/engineering-entrance/atomic-structure/) and [Atoms](/learn/courses/engineering-entrance/atoms/).
