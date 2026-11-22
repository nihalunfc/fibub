---
title: The quantum Hall effect and low-dimensional systems
seoTitle: Quantum Hall effect and low-dimensional systems | CSIR NET
summary: 'Electrons confined to wells, wires and dots: subbands and the density of states in 3D, 2D, 1D and 0D; the classical Hall effect and the resistivity tensor; Landau levels, their degeneracy eB/h and the filling factor; Shubnikov-de Haas oscillations; the integer quantum Hall effect with plateaus at h/νe², vanishing ρxx, disorder, localisation and edge states; the fractional effect and the half-integer effect in graphene.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A 2D electron gas has n = 4.0 × 10¹⁵ m⁻². At B = 8.27 T the Hall resistance is closest to'
    choices: ['12.9 kΩ (ν = 2)', '25.8 kΩ (ν = 1)', '6.45 kΩ (ν = 4)', '8.6 kΩ (ν = 3)']
    ans: 0
    why: 'ν = nh/(eB) = 4.0 × 10¹⁵ × 4.136 × 10⁻¹⁵ / 8.27 = 2.0, so R_xy = h/(2e²) = 12.9 kΩ.'
  - q: 'On a quantum Hall plateau, which pair is correct?'
    choices: ['ρ_xx = 0 and σ_xx = 0', 'ρ_xx = 0 and σ_xx infinite', 'ρ_xx infinite and σ_xx = 0', 'ρ_xx = ρ_xy']
    ans: 0
    why: 'With ρ_xy ≠ 0, inverting the tensor gives σ_xx = ρ_xx/(ρ_xx² + ρ_xy²). If ρ_xx = 0 then σ_xx = 0 too: the current flows without dissipation, at right angles to the field.'
  - q: 'The density of states of an ideal 2D electron gas (no field) is'
    choices: ['constant, m*/πħ² including spin', 'proportional to √E', 'proportional to 1/√E', 'a series of delta functions']
    ans: 0
    why: 'In 2D the number of states below E grows like k² ∝ E, so g(E) is constant. √E is 3D, 1/√E is 1D, and delta functions are 0D (or 2D in a strong field).'
sources:
  - 'K. von Klitzing, G. Dorda and M. Pepper, Physical Review Letters 45, 494 (1980)'
  - 'J. H. Davies, The Physics of Low-Dimensional Semiconductors (1998), chapters 4, 6 and 8'
  - 'D. Tong, Lectures on the Quantum Hall Effect (2016), chapters 1 and 2, arXiv:1606.06687'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C condensed matter physics, published by the National Testing Agency'
---

**Module 9 · about 45 minutes.** In 1980 von Klitzing measured the Hall resistance of a silicon transistor at 1.5 K and 18 T and found flat steps at `$h/e^2$` divided by a whole number, the same to parts per billion in every sample. Since 2019 that number, `$R_K = h/e^2 = 25\,812.807\ \Omega$`, helps define the SI. This lesson builds the effect from two ingredients: electrons confined to a plane, and the [harmonic-oscillator](/learn/courses/gate-physics/harmonic-oscillator/) levels a magnetic field gives them.

<div class="bigidea">Squeeze electrons in one direction until only the lowest standing wave fits, and they move in two dimensions. A perpendicular field then collapses the continuous 2D spectrum into Landau levels, each holding eB/h states per unit area. When the Fermi level sits between levels, the bulk cannot carry dissipative current, ρxx vanishes, and the Hall resistance locks at h/νe², fixed by counting alone.</div>

## 1. Confinement and the density of states

Confine electrons of effective mass `$m^*$` in a well of width `$L$` in `$z$` (a GaAs layer between AlGaAs, or the inversion layer of a MOSFET). Motion in `$x$` and `$y$` stays free, so

```math
E = E_j + \frac{\hbar^2(k_x^2 + k_y^2)}{2m^*}, \qquad E_j = \frac{j^2\pi^2\hbar^2}{2m^*L^2}\ (\text{infinite well})
```

Each `$E_j$` starts a subband. If `$E_2 - E_1 \gg k_BT$` and only the first is filled, the gas is two-dimensional.

<div class="meaning">

<dl>
<dt>3D</dt><dd>`$g(E) \propto \sqrt E$` (see [Fermi gas](/learn/courses/gate-physics/fermi-gas/))</dd>
<dt>2D (well)</dt><dd>`$g(E) = m^*/\pi\hbar^2$` per subband per area, including spin: constant, so `$g$` is a staircase with a step at each `$E_j$`; `$n = (m^*/\pi\hbar^2)E_F$`</dd>
<dt>1D (wire)</dt><dd>`$g(E) \propto 1/\sqrt{E - E_{jk}}$`, diverging at each subband edge; a ballistic wire conducts `$2e^2/h$` per open subband (quantised conductance)</dd>
<dt>0D (dot)</dt><dd>discrete levels, `$g$` a set of delta functions: an artificial atom</dd>
</dl>

</div>

**Worked example.** A 10 nm GaAs well (`$m^* = 0.067m_e$`): `$E_1 = 0.376\ \text{eV nm}^2/(0.067\times100\ \text{nm}^2) = 56$` meV, `$E_2 - E_1 = 3E_1 = 168$` meV, far above `$k_BT = 0.34$` meV at 4 K. With `$n = 3\times10^{15}$` m⁻², `$E_F = \pi\hbar^2n/m^* = 10.7$` meV: only the lowest subband is filled. (Real barriers are finite, so the true levels are a little lower; see [one-dimensional potentials](/learn/courses/gate-physics/one-dimensional-potentials/).)

<div class="problem" data-problem="well-subbands"></div>

## 2. The classical Hall effect

Current density `$j_x$` flows in a sheet in field `$B\hat z$`. In steady state the Lorentz force is balanced by a transverse Hall field. The Drude model gives the resistivity tensor

```math
\rho = \begin{pmatrix} \rho_{xx} & \rho_{xy}\\ -\rho_{xy} & \rho_{xx}\end{pmatrix}, \qquad \rho_{xx} = \frac{m^*}{ne^2\tau}, \qquad \rho_{xy} = \frac{B}{ne}
```

So classically `$\rho_{xy}$` rises linearly with `$B$` (the Hall slope gives `$n$` and the sign of the carriers) and `$\rho_{xx}$` does not depend on `$B$`. In 2D, resistance and resistivity have the same units: `$R_{xy} = V_H/I = \rho_{xy}$` for any sample shape. Inverting the tensor:

```math
\sigma_{xx} = \frac{\rho_{xx}}{\rho_{xx}^2 + \rho_{xy}^2}, \qquad \sigma_{xy} = \frac{\rho_{xy}}{\rho_{xx}^2 + \rho_{xy}^2}
```

If `$\rho_{xy} \neq 0$`, then `$\rho_{xx} = 0$` and `$\sigma_{xx} = 0$` happen together. A perfect insulator along `$x$` and a perfect conductor along `$x$` look the same in a field.

## 3. Landau levels

A 2D electron in field `$B$` circles at the cyclotron frequency `$\omega_c = eB/m^*$`. In the Landau gauge `$\vec A = (0, Bx, 0)$` the Schrödinger equation separates: `$\psi = e^{ik_yy}\phi(x)$`, where `$\phi$` is a harmonic oscillator centred at `$x_0 = \hbar k_y/eB$`.

<div class="steps">
<div class="step"><p><b>Energies.</b> E<sub>n</sub> = ħω<sub>c</sub>(n + ½), n = 0, 1, 2, ...; with spin, each splits by gμ<sub>B</sub>B.</p></div>
<div class="step"><p><b>Degeneracy.</b> The energy does not depend on k<sub>y</sub>. In a sample L<sub>x</sub> × L<sub>y</sub>, k<sub>y</sub> = 2πj/L<sub>y</sub> and the centre x₀ must lie inside L<sub>x</sub>, so j runs up to eBL<sub>x</sub>L<sub>y</sub>/h. Each level holds eB/h states per area (per spin): one per flux quantum h/e.</p></div>
<div class="step"><p><b>Filling factor.</b> ν = n/(eB/h) = nh/eB counts filled spin-resolved levels. Raising B raises the degeneracy, so levels empty one by one and the Fermi level drops from one to the next.</p></div>
<div class="step"><p><b>Same states, regrouped.</b> The 2D density of states m*/2πħ² per spin, times the spacing ħω<sub>c</sub>, is exactly eB/h: the field gathers the states of each slice into one level.</p></div>
</div>

```math
E_n = \hbar\omega_c\left(n + \tfrac12\right), \qquad \frac{N}{A} = \frac{eB}{h}\ \text{per level}, \qquad \nu = \frac{nh}{eB}, \qquad \ell_B = \sqrt{\frac{\hbar}{eB}}
```

**Worked example.** GaAs at 10 T: `$\hbar\omega_c = \hbar eB/m^* = 17.3$` meV, `$eB/h = 2.42\times10^{15}$` m⁻², and the magnetic length `$\ell_B = 8.1$` nm. A gas with `$n = 3.0\times10^{15}$` m⁻² has `$\nu = 1.24$`. The `$\nu = 2$` point is at `$B = nh/2e = 6.2$` T.

**Shubnikov-de Haas.** Each time a level passes the Fermi energy, `$\rho_{xx}$` dips. The dips are equally spaced in `$1/B$`, with `$\Delta(1/B) = 2e/hn$` when spin is not resolved (`$e/hn$` when it is). With `$n = 3\times10^{15}$` m⁻², `$\Delta(1/B) = 0.16$` T⁻¹. The same periodicity in a 3D metal (de Haas-van Alphen) measures extremal Fermi-surface areas: `$\Delta(1/B) = 2\pi e/\hbar A_F$`.

## 4. The integer quantum Hall effect

At low temperature and high field, the dips of `$\rho_{xx}$` reach zero over finite ranges of `$B$`, and across the same ranges `$\rho_{xy}$` is perfectly flat:

```math
\rho_{xy} = \frac{h}{\nu e^2} = \frac{25\,812.807\ \Omega}{\nu}, \quad \rho_{xx} = 0, \qquad \sigma_{xy} = \nu\frac{e^2}{h}
```

<div class="steps">
<div class="step"><p><b>Clean sample, exactly ν levels full.</b> Each full level carries σ<sub>xy</sub> = e²/h, so σ<sub>xy</sub> = νe²/h, the same as the classical line ne/B at that one field. Without disorder, the plateau would be a single point.</p></div>
<div class="step"><p><b>Disorder broadens each level.</b> States in the tails are localised: trapped on contours of the random potential, they carry no current. Only a narrow band at each level's centre is extended.</p></div>
<div class="step"><p><b>Fermi level in localised states.</b> As B changes, the Fermi level moves through the localised tails. The filled extended states do not change, so σ<sub>xy</sub> stays at νe²/h and σ<sub>xx</sub> = 0. This is the plateau. Disorder is needed for the plateaus.</p></div>
<div class="step"><p><b>Edges.</b> At the sample edge the confining potential bends every level upwards, so each filled level crosses the Fermi energy there and makes a one-way (chiral) edge channel. Back-scattering would need a jump to the far edge, so each channel carries current without loss and has conductance e²/h.</p></div>
</div>

Laughlin's argument makes the exactness plain: threading one flux quantum `$h/e$` through a loop of the 2D gas moves exactly `$\nu$` electrons from one edge to the other, whatever the disorder, which forces `$\sigma_{xy} = \nu e^2/h$`. In modern language, `$\nu$` is a topological invariant (the Chern number of the filled bands), and that is why it cannot change smoothly.

<figure class="fig" data-fig="hall-plateaus"><figcaption>Top: the Landau fan, with energies rising linearly in B, and the Fermi level of a fixed density, which drops each time a level empties. Bottom: ρxy with plateaus at h/νe² and the classical line B/ne dashed, and ρxx, which vanishes on every plateau. Widen the band of extended states (more disorder in the figure's model) to see narrower plateaus.</figcaption></figure>

<div class="problem" data-problem="hall-plateau-field"></div>

### Beyond the integers

<div class="meaning">

<dl>
<dt>Fractional QHE</dt><dd>in very clean samples (Tsui, Störmer, Gossard 1982) plateaus appear at `$\nu = 1/3, 2/5, 2/3, \ldots$` (odd denominators). It is a many-body effect: Laughlin's wavefunction at `$\nu = 1/m$` has quasiparticles of charge `$e/m$`. The composite-fermion picture attaches two flux quanta to each electron and turns these fractions into an integer effect</dd>
<dt>Graphene</dt><dd>massless Dirac electrons give Landau levels `$E_n = \pm v_F\sqrt{2e\hbar B|n|}$`, including one at zero energy shared by electrons and holes. With fourfold (spin and valley) degeneracy, `$\sigma_{xy} = 4(n + \tfrac12)e^2/h = \pm2, \pm6, \pm10, \ldots$` in units of `$e^2/h$`, and the effect survives to room temperature</dd>
<dt>Metrology</dt><dd>`$R_K = h/e^2$` with the Josephson constant `$K_J = 2e/h$` realises the ohm and the volt from fixed `$h$` and `$e$`</dd>
</dl>

</div>

<div class="myth">

**"The plateaus come from Landau levels alone; a perfectly clean sample would show the widest plateaus."** In a perfectly clean, infinite sample the Fermi level jumps straight from one level to the next and `$\rho_{xy}$` follows the classical line, touching `$h/\nu e^2$` only at isolated fields. Plateaus need states at energies between the levels that cannot carry current. Localised states from disorder supply them, which is why the effect was found in a rather dirty silicon MOSFET, and why the plateau value does not depend on the sample.

</div>

<div class="keypoints">

- Subbands `$E_j = j^2\pi^2\hbar^2/2m^*L^2$`; DOS: `$\sqrt E$` (3D), constant `$m^*/\pi\hbar^2$` (2D), `$1/\sqrt E$` (1D), delta functions (0D). Ballistic wire: `$2e^2/h$` per subband.
- Classical Hall: `$\rho_{xy} = B/ne$`, `$\rho_{xx} = m^*/ne^2\tau$`; `$\rho_{xx} = 0 \Leftrightarrow \sigma_{xx} = 0$` when `$\rho_{xy} \neq 0$`.
- Landau levels `$\hbar\omega_c(n + \tfrac12)$`, `$\omega_c = eB/m^*$`, degeneracy `$eB/h$` per area per spin, `$\nu = nh/eB$`, `$\ell_B = \sqrt{\hbar/eB}$`.
- SdH dips periodic in `$1/B$`: `$\Delta(1/B) = 2e/hn$` (spin degenerate).
- IQHE: `$\rho_{xy} = h/\nu e^2$`, `$\rho_{xx} = 0$`; plateaus need localised states; chiral edge channels each carry `$e^2/h$`; `$\nu$` is topological.
- FQHE at odd-denominator fractions, charge `$e/m$` quasiparticles; graphene `$\sigma_{xy} = 4(n + \tfrac12)e^2/h$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="quantum-hall" data-exam="net" data-n="10"></div>

**Next:** [Module 10](/learn/courses/csir-net-physics/nuclear-roadmap/) moves into the nucleus. [Lesson 10.2](/learn/courses/csir-net-physics/deuteron-nuclear-force/) uses the simplest bound nucleus, the deuteron, to read off the range, depth and spin dependence of the nuclear force. For the Fermi-Dirac counting behind the filled levels, see [quantum statistics](/learn/courses/gate-physics/quantum-statistics/); for Hall measurements in ordinary semiconductors, see the JAM lesson on [semiconductors](/learn/courses/iit-jam-physics/semiconductors/).
