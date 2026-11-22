---
title: Defects and dislocations
summary: 'Point defects in thermal equilibrium (vacancies, interstitials, Schottky and Frenkel pairs) from the free energy, their effect on density and diffusion; edge and screw dislocations, the Burgers vector and circuit, glide and climb, why real crystals are a thousand times weaker than the ideal shear strength, stress fields and line energy, Frank-Read multiplication and work hardening.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In an ionic crystal the Schottky pair formation energy is 2.0 eV. At 1000 K the fraction of vacant cation sites is closest to'
    choices: ['9 × 10⁻⁶', '8 × 10⁻¹¹', '3 × 10⁻³', '1 × 10⁻²']
    ans: 0
    why: 'Pairs keep the crystal neutral, so n/N = exp(−E_s/2kT). kT = 0.0862 eV, E_s/2kT = 11.6, and exp(−11.6) ≈ 9 × 10⁻⁶. Forgetting the factor 2 gives the much smaller 8 × 10⁻¹¹.'
  - q: 'For a pure screw dislocation, the Burgers vector is'
    choices: ['parallel to the dislocation line', 'perpendicular to the line and in the slip plane', 'perpendicular to the slip plane', 'zero, because the circuit closes']
    ans: 0
    why: 'Edge: b ⊥ line. Screw: b ∥ line. Because b ∥ line, a screw has no unique slip plane and can cross-slip.'
  - q: 'Why does a metal deform at shear stresses about 10³ times smaller than the ideal estimate G/2π?'
    choices: ['Dislocations glide by breaking one row of bonds at a time', 'Vacancies lower the shear modulus by 10³', 'Thermal vibrations melt the slip plane', 'Grain boundaries carry all the strain']
    ans: 0
    why: 'Sliding a whole plane at once needs every bond across it to break together, τ ≈ G/2π. A dislocation lets the slip spread one atomic row at a time, so only a small stress is needed.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 18 and 20'
  - 'D. Hull and D. J. Bacon, Introduction to Dislocations, 5th ed. (2011), chapters 1 to 4'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapter 30'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C condensed matter physics, published by the National Testing Agency'
---

**Module 9 · about 45 minutes.** A perfect [crystal](/learn/courses/iit-jam-physics/crystal-structure/) is a useful idealisation, but no real crystal is perfect. A few missing atoms change how a solid diffuses, conducts and colours, and a few line defects decide whether a metal bends or snaps. NET Part C asks both: an Arrhenius count of point defects, and the geometry of a dislocation.

<div class="bigidea">Point defects are present in thermal equilibrium: making one costs energy but gains entropy, so at any T > 0 some always exist, in a fraction about exp(−E/kT). Dislocations are not equilibrium defects (their energy per length is far too large), but they are always there, and they are why crystals yield at small stresses: slip spreads one atomic row at a time.</div>

## 1. Point defects in equilibrium

Take a crystal of `$N$` sites and remove `$n$` atoms to the surface. Each vacancy costs `$E_v$`; the `$n$` vacancies can sit in `$N!/[n!(N-n)!]$` ways.

Click through the point defects and see how the lattice around each one relaxes.

<figure class="fig" data-fig="@sx-defects-2d"><figcaption>Vacancy, interstitial, big and small substitutional atoms in a metal, and Schottky and Frenkel pairs in an ionic crystal. Play the vacancy to watch it hop.</figcaption></figure>

<div class="steps">
<div class="step"><p><b>Free energy.</b> F = nE<sub>v</sub> − kT ln[N!/(n!(N − n)!)].</p></div>
<div class="step"><p><b>Stirling.</b> ln N! ≈ N ln N − N, so ∂F/∂n = E<sub>v</sub> − kT ln[(N − n)/n].</p></div>
<div class="step"><p><b>Minimise.</b> Setting ∂F/∂n = 0 gives n/(N − n) = exp(−E<sub>v</sub>/kT), and with n ≪ N, n ≈ N exp(−E<sub>v</sub>/kT).</p></div>
<div class="step"><p><b>Add vibrational entropy.</b> The atoms around a vacancy vibrate more softly, adding S<sub>v</sub> per defect: n/N = exp(S<sub>v</sub>/k) exp(−E<sub>v</sub>/kT), with exp(S<sub>v</sub>/k) typically 2 to 10.</p></div>
</div>

```math
\frac nN = e^{-E_v/k_BT}, \qquad \frac{n_S}{N} = e^{-E_S/2k_BT}, \qquad n_F = \sqrt{NN'}\,e^{-E_F/2k_BT}
```

<div class="meaning">

<dl>
<dt>Vacancy (Schottky defect in a metal)</dt><dd>an atom moved from inside to the surface; `$E_v \approx 1$` eV in Cu, Al, Au</dd>
<dt>Schottky pair `$n_S$`</dt><dd>in an ionic crystal, one cation and one anion vacancy together, so the crystal stays neutral; the factor 2 in the exponent comes from `$n_+ n_- = N^2 e^{-E_S/kT}$` with `$n_+ = n_-$`</dd>
<dt>Frenkel pair `$n_F$`</dt><dd>an ion moved from its site to one of `$N'$` interstitial sites; common in AgBr and AgCl, where the small Ag⁺ fits between the anions</dd>
<dt>Density test</dt><dd>Schottky defects lower the density (lattice sites stay, atoms go to the surface); Frenkel defects do not change it</dd>
</dl>

</div>

**Worked example.** Copper has `$E_v = 1.28$` eV. At 1300 K, `$k_BT = 0.112$` eV and `$E_v/k_BT = 11.4$`, so `$n/N = 1.1\times10^{-5}$`: about 11 vacancies per million sites. At 300 K the same formula gives `$3\times10^{-22}$`, effectively none. A crystal quenched from near its melting point keeps its high-temperature vacancies for a while, which is why quenched metals are harder and anneal on heating.

The figure plots `$\log_{10}(n/N)$` against `$1000/T$`. A straight line means Arrhenius behaviour; its slope is `$-E/(2.303\,k_B)$` for vacancies and half that for pairs. This is exactly how formation energies are read from experiments.

<figure class="fig" data-fig="vacancy-arrhenius"><figcaption>Arrhenius plot of the equilibrium defect fraction. Change the formation energy and entropy, and switch between single vacancies and Schottky pairs (half the slope). The marker follows the chosen temperature.</figcaption></figure>

<div class="problem" data-problem="vacancy-ppm"></div>

### Diffusion and ionic conduction

Atoms move by jumping into a neighbouring vacancy. The jump rate needs a vacancy next door (fraction `$e^{-E_v/kT}$`) and a hop over a barrier `$E_m$`, so

```math
D = D_0\, e^{-(E_v + E_m)/k_BT}, \qquad \sigma_{\text{ion}} = \frac{nq^2D}{k_BT}
```

The second form is the Nernst-Einstein relation: in an ionic crystal, vacancies carry charge, so the conductivity also rises in Arrhenius fashion. Doping NaCl with CaCl₂ adds one cation vacancy per Ca²⁺ (to keep neutrality), so at low T the vacancy count is fixed by the dopant and only `$E_m$` shows in the slope: the two-slope plot NET likes to show. Colour centres (F centres) are anion vacancies that trap an electron; their absorption band makes alkali halides coloured after irradiation.

## 2. Why crystals are weak: the dislocation

Slide the top half of a crystal over the bottom half by one spacing `$b$`, all at once. The shear stress rises like `$\tau = (Gb/2\pi a)\sin(2\pi x/b)$`, so the ideal shear strength is

```math
\tau_{\text{ideal}} \approx \frac{G}{2\pi} \sim \text{a few GPa}
```

Measured yield stresses of pure single crystals are near 1 MPa, about `$10^{-3}$` to `$10^{-4}$` of this. Taylor, Orowan and Polanyi (1934) explained the gap: slip spreads by moving a line defect, a dislocation, across the slip plane, breaking only the bonds along the line at each step. It is how you move a heavy carpet by pushing a ruck along it.

<div class="steps">
<div class="step"><p><b>Edge dislocation.</b> An extra half-plane of atoms ends inside the crystal. The line is the bottom edge of the half-plane. Above it the lattice is squeezed, below it stretched.</p></div>
<div class="step"><p><b>Burgers circuit.</b> Walk a closed loop of lattice steps around the line (say 5 up, 5 right, 5 down, 5 left). In a perfect crystal it closes. Around the dislocation it fails to close by one lattice vector: the Burgers vector b.</p></div>
<div class="step"><p><b>Edge versus screw.</b> Edge: b ⊥ line. Screw: b ∥ line, and the planes around the line form a helical ramp. A general (mixed) dislocation curves, and b stays the same along it while the line direction changes.</p></div>
<div class="step"><p><b>Conservation.</b> b is the same all along a dislocation; a dislocation cannot end inside a crystal (only at a surface, a grain boundary, or a node where the Burgers vectors add to zero).</p></div>
</div>

<figure class="fig" data-fig="edge-glide"><figcaption>An edge dislocation in a simple square lattice (displacements from the elastic solution u = (b/2π) arctan(y/x)). Press play to drive it by the shear stress: the line glides one row at a time and leaves a step of size b at the surface. Switch on the Burgers circuit to see the closure failure.</figcaption></figure>

### Glide and climb

The slip plane contains both `$\vec b$` and the line. Motion in that plane, **glide**, needs only small shifts of atoms and happens at low temperature under shear. An edge dislocation moving out of its slip plane, **climb**, needs atoms to be added to or removed from the half-plane, so it requires vacancy diffusion and is important only at high temperature (creep). A screw dislocation has `$\vec b$` along the line, so any plane containing the line is a slip plane: it can **cross-slip**.

When a dislocation with Burgers vector `$b$` sweeps fully across a crystal, the top half shifts by `$b$` relative to the bottom. Many dislocations of density `$\rho$` (line length per volume, m⁻²) moving at speed `$v$` give the Orowan strain rate

```math
\dot\gamma = \rho\, b\, v
```

### Stress, energy and force

Around a screw dislocation the elastic shear strain is `$b/2\pi r$`, so the stress is `$\tau = Gb/2\pi r$`. Integrating the strain energy density `$\tau^2/2G$` from a core radius `$r_0$` to an outer cut-off `$R$` gives the energy per unit length:

```math
\frac{E}{L} = \frac{Gb^2}{4\pi}\ln\frac{R}{r_0} \approx \tfrac12 Gb^2 \quad (\text{edge: divide by } 1-\nu)
```

<div class="meaning">

<dl>
<dt>`$E/L \propto b^2$`</dt><dd>Frank's rule: the dislocation with the smallest `$b$` is favoured; `$\vec b_1 \to \vec b_2 + \vec b_3$` goes ahead if `$b_1^2 > b_2^2 + b_3^2$`. In fcc, `$\frac a2[110]$` splits into two Shockley partials `$\frac a6[211] + \frac a6[12\bar1]$` with a stacking fault between them</dd>
<dt>Size</dt><dd>with `$G = 40$` GPa, `$b = 0.25$` nm: `$Gb^2/2 \approx 1.3$` nJ/m, about 2 eV for every atomic spacing of line (a few eV once the logarithm is kept). That is why dislocations are never in thermal equilibrium: the entropy cannot pay for it</dd>
<dt>Peach-Koehler force</dt><dd>a resolved shear stress `$\tau$` pushes on the line with force per length `$F/L = \tau b$`</dd>
<dt>Line tension</dt><dd>`$T \approx Gb^2/2$`; a segment pinned at both ends bows out to radius `$R = T/\tau b \approx Gb/2\tau$`</dd>
</dl>

</div>

**Worked example: Frank-Read source.** A segment of length `$L = 1\ \mu$`m is pinned at both ends in a crystal with `$G = 45$` GPa, `$b = 0.256$` nm. It bows into a semicircle (the hardest shape to pass) when `$R = L/2$`, which needs `$\tau = Gb/L = 45\times10^9 \times 0.256\times10^{-9}/10^{-6} = 11.5$` MPa. Beyond that the loop grows, wraps around, pinches off a closed loop and restores the segment, ready to emit another. One source can produce hundreds of loops: this is how the dislocation density rises from about `$10^{10}$` m⁻² in an annealed metal to `$10^{15}$` to `$10^{16}$` m⁻² after heavy cold work.

### Work hardening

Dislocations on crossing planes get in each other's way. The mean spacing between them is `$\rho^{-1/2}$`, and freeing a segment of that length needs `$\tau \sim Gb/\ell$`, which is Taylor's law:

```math
\tau = \alpha G b \sqrt{\rho}, \qquad \alpha \approx 0.2\text{ to }0.5
```

<div class="problem" data-problem="taylor-density"></div>

Grain boundaries also block slip: in the Hall-Petch law, yield stress = `$\sigma_0 + k_y d^{-1/2}$` for grain size `$d$`. A low-angle tilt boundary is itself a wall of edge dislocations spaced `$D = b/\theta$` apart. With `$b = 0.25$` nm and a 1° tilt, `$D = 14$` nm.

<div class="myth">

**"Dislocations are frozen-in thermal defects like vacancies, and the Burgers vector changes along a curved line."** Vacancies have a Boltzmann population because their entropy of placement is enormous compared with `$E_v/kT$`; a dislocation line costs a few eV per atomic length and gains almost no entropy, so its equilibrium density is zero. It exists because of growth and deformation history. And `$\vec b$` is fixed along the whole line: what changes along a curved loop is the line direction, so the character changes from edge to screw and back.

</div>

<div class="keypoints">

- Vacancies: `$n/N = e^{S_v/k}e^{-E_v/kT}$`; Schottky pairs in ionic crystals `$e^{-E_S/2kT}$`; Frenkel pairs `$\sqrt{NN'}e^{-E_F/2kT}$`. Schottky lowers density, Frenkel does not.
- Diffusion `$D = D_0e^{-(E_v + E_m)/kT}$`; ionic conductivity `$\sigma = nq^2D/kT$`; aliovalent dopants fix the vacancy count at low T.
- Ideal shear strength `$\approx G/2\pi$`; dislocations explain yield at `$10^{-3}$` to `$10^{-4}$` of it.
- Burgers circuit gives `$\vec b$`: edge `$\vec b\perp$` line, screw `$\vec b\parallel$` line; constant along the line; lines end only at surfaces, boundaries or nodes.
- Glide in the plane of `$\vec b$` and line; climb needs diffusion; screws cross-slip. Orowan: `$\dot\gamma = \rho b v$`.
- `$E/L \approx Gb^2/2$` (Frank's `$b^2$` rule), force `$\tau b$` per length, Frank-Read stress `$Gb/L$`, Taylor `$\tau = \alpha Gb\sqrt\rho$`, tilt boundary `$D = b/\theta$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="defects-dislocations" data-exam="net" data-n="10"></div>

**Next:** [lesson 9.3](/learn/courses/csir-net-physics/dielectric-optical/) turns from mechanical to electrical response: polarisation, the local field and the optical constants of insulators and metals. For the elastic moduli used here, see the JAM lesson on [elasticity](/learn/courses/iit-jam-physics/elasticity/).
