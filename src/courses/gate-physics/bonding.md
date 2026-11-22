---
title: Bonding in solids
summary: 'Why atoms stick together: ionic crystals with the Madelung constant, Born-Landé and Born-Mayer energies, the Born-Haber cycle and bulk modulus; van der Waals solids with the Lennard-Jones potential and lattice sums; covalent, metallic and hydrogen bonds; radius ratios, zero-point effects and the force constants that set phonon frequencies.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In the Born-Landé model with Born exponent n, the binding energy at equilibrium is the Madelung energy times'
    choices: ['1 − 1/n', '1 + 1/n', '1/n', 'n/(n − 1)']
    ans: 0
    why: 'At r₀ the repulsive energy equals 1/n of the Madelung energy, so U(r₀) = −(αke²/r₀)(1 − 1/n).'
  - q: 'For an fcc Lennard-Jones solid, the cohesive energy per atom is about'
    choices: ['8.6ε', '6ε', 'ε', '12ε']
    ans: 0
    why: 'With lattice sums A₁₂ = 12.13 and A₆ = 14.45, U/N = −εA₆²/(2A₁₂) = −8.6ε. Twelve nearest neighbours alone would give 6ε.'
  - q: 'The Madelung constant of an alternating 1D chain of ions is'
    choices: ['2 ln 2', 'ln 2', '1.748', '1']
    ans: 0
    why: '2(1 − 1/2 + 1/3 − ...) = 2 ln 2 = 1.386. NaCl in 3D has 1.748.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 3'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 19 and 20'
  - 'M. Born and K. Huang, Dynamical Theory of Crystal Lattices (1954), chapter 1'
  - 'GATE Physics (PH) and CSIR NET Physical Sciences syllabi, Solid State Physics sections'
---

**Module 7 · about 45 minutes.** The [previous lessons](/learn/courses/gate-physics/reciprocal-lattice/) described where atoms sit. This one asks what holds them there and how strongly. The answer, an energy curve `$U(r)$` with a minimum, gives the lattice spacing (its position), the cohesive energy (its depth), the bulk modulus and the spring constants of [phonons](/learn/courses/gate-physics/phonons/) (its curvature).

<div class="bigidea">Every kind of bond is a long-range attraction that pulls atoms together and a short-range repulsion (Pauli exclusion between closed shells) that stops them. Where the two balance is the crystal. Ionic and van der Waals solids can be calculated with pencil and paper; covalent and metallic bonds need quantum mechanics, but the same picture of a well holds.</div>

## 1. The general well

Write the energy of a pair, or per atom of the crystal, as

```math
U(r) = -\frac{A}{r^m} + \frac{B}{r^n}, \qquad n > m
```

Setting `$dU/dr = 0$` gives `$B/r_0^n = (m/n)A/r_0^m$` and so

```math
r_0 = \left(\frac{nB}{mA}\right)^{1/(n-m)}, \qquad U(r_0) = -\frac{A}{r_0^m}\left(1 - \frac mn\right), \qquad U''(r_0) = \frac{mA(n - m)}{r_0^{m+2}}
```

Three lessons hide here. The repulsion cancels a fraction `$m/n$` of the attraction at the minimum. A minimum exists only if `$n > m$`. And the curvature, which sets the bulk modulus and the vibration frequency, grows with `$n - m$`: a harder wall means a stiffer solid.

<div class="meaning">

<dl>
<dt>`$r_0$`</dt><dd>equilibrium separation (nearest-neighbour distance in the crystal)</dd>
<dt>`$-U(r_0)$`</dt><dd>cohesive or lattice energy: the work to pull the solid apart into atoms (cohesive) or ions (lattice)</dd>
<dt>`$U''(r_0)$`</dt><dd>force constant `$k$`; with the atomic mass it sets vibration frequencies `$\omega\sim\sqrt{k/m}$`</dd>
<dt>`$B = V\,d^2U/dV^2$`</dt><dd>bulk modulus, the curvature measured against volume</dd>
</dl>

</div>

## 2. Ionic crystals

In NaCl each ion is surrounded by 6 opposite ions at `$r$`, 12 like ions at `$\sqrt2r$`, 8 opposite at `$\sqrt3r$`, 6 like at `$2r$`, and so on. The Coulomb energy per ion pair is `$-\alpha ke^2/r$` (`$k = 1/4\pi\varepsilon_0$`, `$ke^2 = 14.40$` eV Å) with the **Madelung constant**

```math
\alpha = 6 - \frac{12}{\sqrt2} + \frac{8}{\sqrt3} - \frac{6}{2} + \dots = 1.7476
```

The series converges only conditionally: summed shell by shell it swings (6, −2.49, 2.13, −0.87, ...). Correct values come from summing neutral groups (Evjen) or the Ewald method. Some values: 1D alternating chain `$2\ln2 = 1.386$`, ZnS 1.638, NaCl 1.748, CsCl 1.763. More neighbours give a larger constant, but only slightly.

Adding a repulsion `$B/r^n$` gives the **Born-Landé** energy per ion pair and per mole:

```math
U(r_0) = -\frac{\alpha ke^2}{r_0}\left(1 - \frac1n\right), \qquad U_{\text{mol}} = -\frac{N_A\alpha Z^2e^2}{4\pi\varepsilon_0r_0}\left(1 - \frac1n\right)
```

with `$N_Ae^2/4\pi\varepsilon_0 = 1389$` kJ Å/mol. The **Born-Mayer** form `$\lambda e^{-r/\rho}$` is closer to the true Pauli repulsion and gives `$U(r_0) = -\frac{\alpha ke^2}{r_0}(1 - \rho/r_0)$`.

**Worked example (NaCl).** `$\alpha = 1.7476$`, `$r_0 = 2.814$` Å, `$n = 8$`: `$U = 1389.4\times1.7476/2.814\times0.875 = 755$` kJ/mol. The Born-Haber cycle gives about 787 kJ/mol; the remaining 4% is van der Waals attraction and zero-point energy that the simple model ignores. With Born-Mayer, `$\rho = 0.321$` Å and `$r_0 = 2.82$` Å, the binding per pair is `$8.92\times(1 - 0.114) = 7.91$` eV.

The **Born exponent** is measured from compressibility. With `$V = 2r^3$` per ion pair in rock salt, `$B = V\,d^2U/dV^2$` works out to

```math
B = \frac{(n - 1)\alpha e^2}{72\pi\varepsilon_0r_0^4}
```

NaCl's `$B = 24$` GPa gives `$n \approx 7.8$`.

**The Born-Haber cycle** links lattice energy (crystal → ions) to cohesive energy (crystal → atoms): cohesive = lattice − ionisation energy of the metal + electron affinity of the non-metal. For NaCl, `$7.90 - 5.14 + 3.61 = 6.37$` eV per pair. Transferring the electron costs `$5.14 - 3.61 = 1.53$` eV at infinite separation, which the Coulomb attraction pays back within `$14.40/1.53 = 9.4$` Å.

**Which structure?** Hard-sphere geometry gives the radius-ratio limits: a cation touches 8 anions in a cube only if `$r_+/r_- \ge \sqrt3 - 1 = 0.732$` (CsCl), 6 in an octahedron if `$\ge\sqrt2 - 1 = 0.414$` (NaCl), 4 in a tetrahedron if `$\ge 0.225$` (ZnS). Because the Madelung gain from 6 to 8 neighbours is under 1%, a rattling cation is never worth it.

<div class="problem" data-problem="born-lande"></div>

## 3. Van der Waals solids and the Lennard-Jones potential

Closed-shell atoms (Ne, Ar, Kr, Xe, also molecules like CH₄) attract through correlated fluctuating dipoles: the London force, energy `$-C/r^6$`. The standard model is

```math
U(r) = 4\varepsilon\left[\left(\frac\sigma r\right)^{12} - \left(\frac\sigma r\right)^6\right]
```

zero at `$r = \sigma$`, minimum `$-\varepsilon$` at `$r_0 = 2^{1/6}\sigma = 1.122\sigma$`, curvature `$U''(r_0) = 72\varepsilon/r_0^2 = 57.1\varepsilon/\sigma^2$`. The `$r^{-6}$` has a physical origin; the `$r^{-12}$` is a convenient stand-in for Pauli repulsion.

In the fcc crystal, sum over all neighbours with the lattice sums `$A_{12} = \sum (R/r_j)^{12} = 12.13$` and `$A_6 = 14.45$` (`$R$` = nearest-neighbour distance):

```math
\frac UN = 2\varepsilon\left[A_{12}\left(\frac\sigma R\right)^{12} - A_6\left(\frac\sigma R\right)^6\right], \qquad R_0 = \left(\frac{2A_{12}}{A_6}\right)^{1/6}\sigma = 1.09\sigma, \qquad \frac{U_0}N = -\frac{A_6^2}{2A_{12}}\varepsilon = -8.6\varepsilon
```

and the bulk modulus `$B = 4\varepsilon A_6^{5/2}/(A_{12}^{3/2}\sigma^3) = 75\varepsilon/\sigma^3$`. `$A_{12}\approx12$` (the steep repulsion is almost all nearest neighbours) but `$A_6$` is 20% bigger: the slow `$r^{-6}$` tail adds 43% to the cohesive energy compared with nearest neighbours alone (6ε).

**Worked example (argon).** `$\varepsilon = 10.4$` meV, `$\sigma = 3.40$` Å: `$R_0 = 3.71$` Å (measured 3.76), cohesive energy `$8.6\times10.4 = 89$` meV per atom (measured 80), `$B = 3.2$` GPa (measured 2.7). The deviations, largest for light neon and dramatic for helium, are zero-point motion: confining a light atom costs kinetic energy comparable to a 1 meV well, which is why helium stays liquid at 0 K unless squeezed to about 25 bar.

The curvature gives the vibration frequency of an Ar₂ dimer: `$k = 72\varepsilon/(2^{1/3}\sigma^2) = 0.82$` N/m, `$\mu = m/2$`, `$\nu = \sqrt{k/\mu}/2\pi = 0.79$` THz. Phonon frequencies in solid argon are of this size, as [lesson 7.4](/learn/courses/gate-physics/phonons/) will use.

Switch between the two bonds in the figure: for the ionic crystal raise `$n$` and see the wall harden and the binding approach the full Madelung energy; for van der Waals compare the isolated pair with the crystal.

<figure class="fig" data-fig="bonding-curves"><figcaption>Ionic: total Born-Landé energy (solid) and its Madelung and repulsive parts (dashed), with the minimum fixed at 2.82 Å. Van der Waals: the Lennard-Jones pair, the fcc crystal per atom with full lattice sums, and the nearest-neighbour-only estimate.</figcaption></figure>

<div class="problem" data-problem="lj-stiffness"></div>

## 4. Covalent, metallic and hydrogen bonds

**Covalent.** Two atoms share an electron pair. In the Heitler-London picture of H₂ the bonding state has a symmetric spatial wavefunction (charge piled between the nuclei) and therefore an antisymmetric spin singlet. Bonds are directional and saturable: carbon, silicon and germanium use `$sp^3$` hybrids at `$109.47^\circ$` (`$\cos\theta = -1/3$`), giving the open diamond structure (4 neighbours, packing fraction 0.34). Cohesive energies are large (Si 4.6 eV, C 7.4 eV per atom), and the bonding electrons are localised, so these solids are insulators or semiconductors. III-V and II-VI compounds (GaAs, ZnSe) keep the tetrahedral bonds but become partly ionic as the electronegativity difference grows.

**Metallic.** The valence electrons leave their atoms and are shared by the whole crystal. The energy depends mainly on density, not on bond angles, so metals pack densely (fcc, hcp, bcc) and deform plastically. Alkali metals bind weakly (Na 1.1 eV per atom); transition metals bind strongly through partly filled `$d$` bands (W 8.9 eV). Because the electron gas adds a volume-dependent, non-pairwise energy, metals violate the Cauchy relation `$C_{12} = C_{44}$` that any crystal held by central pair forces (with every atom at an inversion centre) must obey; rare-gas solids nearly satisfy it.

**Hydrogen bonds.** A hydrogen bonded to O, N or F is attracted to the lone pair of another electronegative atom: mostly electrostatic, 0.1 to 0.5 eV. In ice each molecule makes four of them in a tetrahedron, an open network that collapses partly on melting: water is denser than ice.

| Bond | Typical cohesive energy per atom | Directional? | Examples |
|---|---|---|---|
| van der Waals | 0.02 to 0.2 eV | no | Ne, Ar, solid CH₄ |
| hydrogen | 0.1 to 0.5 eV per bond | yes | ice, HF |
| metallic | 1 to 9 eV | no | Na, Cu, W |
| ionic | 3 to 4 eV (6 to 8 eV per pair) | no | NaCl, MgO |
| covalent | 4 to 8 eV | yes | Si, Ge, diamond |

<div class="myth">

**"Keeping only nearest neighbours is good enough."** For the Lennard-Jones solid it underestimates the binding by 30%. For an ionic crystal it is worse than useless: the 6 nearest opposite ions give `$\alpha = 6$`, but the next 12 like ions repel more than the first shell attracts, and the shell-by-shell sum keeps swinging. Long-range forces need the whole lattice, summed carefully.

</div>

<div class="keypoints">

- `$U = -A/r^m + B/r^n$`: `$U(r_0) = -(A/r_0^m)(1 - m/n)$`, minimum only if `$n > m$`, curvature `$\propto n - m$`.
- Madelung: chain `$2\ln2$`, ZnS 1.638, NaCl 1.748, CsCl 1.763; conditionally convergent.
- Born-Landé `$U = -\frac{N_A\alpha e^2}{4\pi\varepsilon_0r_0}(1 - 1/n)$`; Born-Mayer factor `$(1 - \rho/r_0)$`; `$B = (n - 1)\alpha e^2/(72\pi\varepsilon_0r_0^4)$` for rock salt.
- Born-Haber: cohesive = lattice − ionisation energy + electron affinity.
- Lennard-Jones pair: `$r_0 = 1.122\sigma$`, depth `$\varepsilon$`, `$k = 72\varepsilon/r_0^2$`. fcc crystal: `$R_0 = 1.09\sigma$`, `$-8.6\varepsilon$` per atom, `$B = 75\varepsilon/\sigma^3$`.
- Radius ratios: 0.732 (8-fold), 0.414 (6-fold), 0.225 (4-fold). Covalent bonds pair spins (singlet) and fix angles; metals bind through shared electrons and break the Cauchy relation.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="bonding" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.4](/learn/courses/gate-physics/phonons/) lets the atoms move in these wells and finds the normal modes of the whole crystal.
