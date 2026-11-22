---
title: The deuteron and the nuclear force
summary: 'What the deuteron tells us about the nuclear force: its binding energy, spin, parity, magnetic moment and quadrupole moment; the square-well model with k cot kR = −κ, the minimum V₀R², the depth and the large probability outside the range; the D-state admixture and the tensor force; low-energy neutron-proton scattering, scattering length and effective range, the singlet virtual state; charge independence, isospin and the Yukawa range.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The deuteron has J^P = 1⁺. Which statement follows?'
    choices: ['Its orbital state is L = 0 with an L = 2 admixture, total spin S = 1', 'It is pure L = 1 with S = 0', 'It is pure L = 0 with S = 0', 'Its isospin is T = 1']
    ans: 0
    why: 'Parity (−1)^L = +1 needs even L. J = 1 from L = 0 needs S = 1; L = 2 with S = 1 can also give J = 1, and the tensor force mixes the two. Space and spin are both symmetric, so the isospin part is antisymmetric: T = 0.'
  - q: 'For a square well of range R, the smallest depth that can bind a zero-energy S state satisfies'
    choices: ['V₀R² = π²ħ²/8μ', 'V₀R² = π²ħ²/2μ', 'V₀R² = ħ²/2μ', 'V₀R² = 2π²ħ²/μ']
    ans: 0
    why: 'At zero binding, u = sin kr must have zero slope at R, so kR = π/2 and V₀ = ħ²k²/2μ = π²ħ²/(8μR²). With μc² = 469 MeV this is about 102 MeV fm².'
  - q: 'The np singlet scattering length is about −24 fm. The negative sign means'
    choices: ['the singlet np system has no bound state, only a virtual state near zero energy', 'the singlet force is repulsive', 'the singlet state is deeply bound', 'the cross section in the singlet channel is zero']
    ans: 0
    why: 'For an attractive well, a > 0 signals a bound state (like the triplet, a_t = +5.4 fm) and a large negative a signals a state that just fails to bind. The singlet force is attractive but a bit too weak.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapter 4'
  - 'S. S. M. Wong, Introductory Nuclear Physics, 2nd ed. (1998), chapter 3'
  - 'J. M. Blatt and V. F. Weisskopf, Theoretical Nuclear Physics (1952), chapter II'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C nuclear and particle physics, published by the National Testing Agency'
---

**Module 10 · about 45 minutes.** The JAM lesson on [nuclei and radioactivity](/learn/courses/iit-jam-physics/nuclei-radioactivity/) used the nuclear force as a black box that holds nucleons together. The deuteron, one proton and one neutron, is the only two-nucleon bound state, and it is the cleanest place to open the box. Add low-energy neutron-proton scattering and you have almost everything NET asks about the force between two nucleons.

<div class="bigidea">The deuteron is barely bound: 2.22 MeV against a well about 35 MeV deep. So the wavefunction spends most of its time outside the range of the force, the system has no excited states, and the force must depend on spin (the spin-singlet np pair is not bound at all). A small D-state admixture, seen in the magnetic and quadrupole moments, shows the force is not purely central: it has a tensor part.</div>

## 1. What is measured

<div class="meaning">

<dl>
<dt>Binding energy</dt><dd>`$B = 2.2246$` MeV, from the 2.22 MeV gamma ray in `$n + p \to d + \gamma$` or the threshold of photodisintegration</dd>
<dt>Spin and parity</dt><dd>`$J^P = 1^+$`, so `$L$` is even and `$S = 1$`: `$^3S_1$` with some `$^3D_1$`</dd>
<dt>Magnetic moment</dt><dd>`$\mu_d = 0.8574\,\mu_N$`, close to but not equal to `$\mu_p + \mu_n = 2.7928 - 1.9130 = 0.8798\,\mu_N$`</dd>
<dt>Quadrupole moment</dt><dd>`$Q = +0.286$` fm²: small but not zero, and positive, so the deuteron is slightly prolate (cigar-shaped). A pure S state would have `$Q = 0$`</dd>
<dt>Size</dt><dd>rms radius 2.1 fm, large for two nucleons</dd>
<dt>Excited states</dt><dd>none bound</dd>
</dl>

</div>

## 2. The square-well model

Use the radial function `$u(r) = r\psi(r)$`, reduced mass `$\mu = m_pm_n/(m_p + m_n)$` (`$\mu c^2 = 469.46$` MeV), `$L = 0$`, and a well of depth `$V_0$` and range `$R$`. With `$E = -B$`:

<div class="steps">
<div class="step"><p><b>Inside (r &lt; R).</b> u″ = −k²u with k = √(2μ(V₀ − B))/ħ. The solution that vanishes at r = 0 is u = A sin kr.</p></div>
<div class="step"><p><b>Outside (r &gt; R).</b> u″ = κ²u with κ = √(2μB)/ħ. The solution that stays finite is u = C e<sup>−κr</sup>.</p></div>
<div class="step"><p><b>Match u′/u at R.</b> k cot kR = −κ. Because κ ≪ k, cot kR is small and negative, so kR is just above π/2.</p></div>
<div class="step"><p><b>Solve.</b> Given R, find k numerically, then V₀ = ħ²k²/2μ + B. Only the combination V₀R² is fixed closely by B; R itself must come from scattering.</p></div>
</div>

```math
k\cot kR = -\kappa, \qquad \kappa = \frac{\sqrt{2\mu B}}{\hbar} = 0.2316\ \text{fm}^{-1}, \qquad V_0R^2 > \frac{\pi^2\hbar^2}{8\mu} = 102\ \text{MeV fm}^2
```

**Worked example.** Take `$R = 2.1$` fm. Solving `$k\cot(2.1k) = -0.2316$` gives `$k = 0.872$` fm⁻¹ (`$kR = 1.83$`, against `$\pi/2 = 1.57$`). Then `$V_0 = (197.33\times0.872)^2/(2\times469.46) + 2.22 = 31.5 + 2.2 = 33.7$` MeV. The tail length is `$1/\kappa = 4.3$` fm, twice the range. Normalising `$u$` shows that the np pair is outside the well about 63% of the time. Compare the depth that would bind at zero energy with the same range, `$102/2.1^2 = 23.2$` MeV: the last 2.2 MeV of binding costs about 10 MeV of extra depth.

<figure class="fig" data-fig="deuteron-well"><figcaption>The square well that binds the deuteron at the chosen energy, with the radial function u(r) drawn on the energy line. Shorten the range to see the depth climb as 1/R², and raise B to pull the tail in. The shaded area is the probability of finding the pair outside the force.</figcaption></figure>

<div class="problem" data-problem="deuteron-depth"></div>

**Why no excited states?** A second S state would need `$kR \ge 3\pi/2$`, a well nine times deeper in `$V_0R^2$`. A P state (`$L = 1$`) needs `$kR = \pi$` just to bind at zero energy: a well four times deeper. The real force is far short of both, so the deuteron has one bound state.

## 3. The D state and the tensor force

A central force conserves `$L$`, so it cannot mix `$L = 0$` and `$L = 2$`. The measured `$Q \neq 0$` needs a non-central term. The one-pion exchange potential contains the tensor operator

```math
S_{12} = 3(\vec\sigma_1\cdot\hat r)(\vec\sigma_2\cdot\hat r) - \vec\sigma_1\cdot\vec\sigma_2
```

which depends on the angle between the spins and the line joining the nucleons. It conserves `$J$` and parity, but mixes `$^3S_1$` with `$^3D_1$`. Write `$\psi = \sqrt{P_S}\,\psi_S + \sqrt{P_D}\,\psi_D$`. The magnetic moment is

```math
\mu_d = P_S(\mu_p + \mu_n) + P_D\left[\tfrac32\cdot\tfrac12 - \tfrac12(\mu_p + \mu_n)\right] = (\mu_p + \mu_n) - \tfrac32\left(\mu_p + \mu_n - \tfrac12\right)P_D
```

**Worked example.** `$0.8798 - 0.8574 = 0.0224 = 1.5\times(0.8798 - 0.5)P_D$`, so `$P_D \approx 3.9\%$`. The quadrupole moment points the same way (a few percent D state gives `$Q \approx 0.29$` fm²). The admixture is model-dependent (meson-exchange corrections shift `$\mu$`), but it is small and it is there.

## 4. Low-energy np scattering

At low energy only the S wave scatters: `$\sigma = (4\pi/k^2)\sin^2\delta_0$`. The behaviour as `$k \to 0$` defines the scattering length `$a$` and the effective range `$r_0$`:

```math
k\cot\delta_0 = -\frac1a + \frac12 r_0k^2 + \cdots, \qquad \sigma(k \to 0) = 4\pi a^2
```

<div class="meaning">

<dl>
<dt>Geometric meaning</dt><dd>outside the force, the zero-energy `$u(r)$` is a straight line; it crosses zero at `$r = a$`. A bound state bends it over (`$a > 0$`); a state that just misses binding gives a large negative `$a$`</dd>
<dt>Triplet (`$S = 1$`)</dt><dd>`$a_t = +5.42$` fm, `$r_t = 1.75$` fm: the deuteron channel. With `$1/a_t \approx \kappa - \tfrac12r_t\kappa^2 = 0.2316 - 0.0469 = 0.185$` fm⁻¹, `$a_t \approx 5.41$` fm, so the deuteron binding and np scattering agree</dd>
<dt>Singlet (`$S = 0$`)</dt><dd>`$a_s = -23.7$` fm, `$r_s = 2.7$` fm: attractive but unbound, a virtual state about 66 keV above zero</dd>
<dt>Unpolarised cross section</dt><dd>3 triplet states to 1 singlet: `$\sigma = \pi(3a_t^2 + a_s^2) = 20.4$` b, matching the measured free-proton cross section. Using only the deuteron (`$4\pi a_t^2 = 3.7$` b) misses by a factor of 5: the first proof that the force depends on spin</dd>
</dl>

</div>

<div class="problem" data-problem="np-scattering-length"></div>

Scattering of slow neutrons from ortho-hydrogen (proton spins parallel) and para-hydrogen (antiparallel) gives very different cross sections, which fixes the sign of `$a_s$`: coherent scattering from the two protons adds amplitudes, so the interference depends on the singlet-triplet difference.

## 5. Properties of the nuclear force

<div class="steps">
<div class="step"><p><b>Short range and strong.</b> About 1 to 2 fm, depth tens of MeV. Yukawa: exchanging a pion of mass m<sub>π</sub> gives V ∝ e<sup>−r/λ</sup>/r with λ = ħ/m<sub>π</sub>c = 197.33/139.6 = 1.41 fm.</p></div>
<div class="step"><p><b>Repulsive core.</b> Below about 0.5 fm the force turns strongly repulsive (heavier ω exchange); with the short range, this gives saturation: binding per nucleon and density stay nearly constant across nuclei.</p></div>
<div class="step"><p><b>Spin dependent and tensor.</b> Triplet bound, singlet not; tensor term mixes S and D. A spin-orbit term (seen in polarised scattering) also exists and drives the shell model's magic numbers.</p></div>
<div class="step"><p><b>Charge independent.</b> After Coulomb corrections, pp, nn and np forces in the same state are nearly equal (singlet a<sub>pp</sub> ≈ a<sub>nn</sub> ≈ −17 to −19 fm, a<sub>np</sub> = −23.7 fm: a small breaking). This is isospin symmetry: the nucleon is a doublet with T₃ = +½ (p) and −½ (n).</p></div>
</div>

Isospin explains why there is no bound diproton or dineutron. Two nucleons in `$L = 0$` with `$S = 1$` have a symmetric space and spin part, so the overall antisymmetry demands an antisymmetric isospin part, `$T = 0$`: only np can do that. The `$T = 1$` triplet (pp, nn, and np in `$S = 0$`) is the unbound singlet channel. More on isospin in [lesson 10.4](/learn/courses/csir-net-physics/quark-model/).

<div class="myth">

**"The deuteron sits deep in its well, like an electron in hydrogen, so its size is set by the range of the force."** It is the opposite. The binding is a small fraction of the depth, `$kR$` is close to `$\pi/2$`, and the wavefunction leaks far outside: the rms radius (2.1 fm) and the tail `$1/\kappa = 4.3$` fm are set mainly by `$B$`, not by `$R$`. That is why `$B$` alone fixes only `$V_0R^2$`, and why the deuteron is so easy to break up.

</div>

<div class="keypoints">

- Deuteron: `$B = 2.2246$` MeV, `$J^P = 1^+$`, `$T = 0$`, `$\mu = 0.857\,\mu_N$`, `$Q = +0.286$` fm², no excited states.
- Square well: `$k\cot kR = -\kappa$`, `$\kappa = \sqrt{2\mu B}/\hbar = 0.232$` fm⁻¹; minimum binding `$V_0R^2 = \pi^2\hbar^2/8\mu \approx 102$` MeV fm²; for `$R = 2.1$` fm, `$V_0 \approx 34$` MeV and most of the probability is outside.
- D state of about 4% from `$\mu_d < \mu_p + \mu_n$` and `$Q \neq 0$`: evidence for the tensor force `$S_{12}$`.
- Scattering: `$k\cot\delta_0 = -1/a + r_0k^2/2$`; `$a_t = 5.42$` fm, `$a_s = -23.7$` fm; `$\sigma_0 = \pi(3a_t^2 + a_s^2) \approx 20.4$` b.
- Force: short range (`$\hbar/m_\pi c = 1.4$` fm), hard core, saturation, spin dependent, tensor, spin-orbit, charge independent (isospin).

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="deuteron-nuclear-force" data-exam="net" data-n="10"></div>

**Next:** [lesson 10.3](/learn/courses/csir-net-physics/collective-model/) moves from two nucleons to many, where the nucleus as a whole can rotate and vibrate. For the scattering theory used here (partial waves, phase shifts), see the GATE lesson on [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/); for the angular momentum coupling, see [angular momentum](/learn/courses/gate-physics/angular-momentum/).
