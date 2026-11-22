---
title: Four-vectors and relativistic kinematics
seoTitle: Four-vectors and relativistic kinematics for GATE
summary: 'Four-vectors and the Minkowski metric, proper time and four-velocity, the energy-momentum four-vector and invariant mass, rapidity, two-body decays at rest and in flight, threshold energies, fixed-target and colliding beams, Mandelstam variables, Compton scattering and relativistic elastic collisions.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Two photons, each of energy E, travel in exactly opposite directions. The invariant mass of the pair is'
    choices: ['0', 'E/c²', '2E/c²', '√2 E/c²']
    ans: 2
    why: The total momentum is zero, so the pair's rest frame is the lab and Mc² = 2E. A single photon has zero mass, but a system of photons generally does not; two photons moving the same way would have zero mass.
  - q: 'With the metric (+, −, −, −), the four-velocity U of any massive particle satisfies'
    choices: ['U·U = 0', 'U·U = c²', 'U·U = −c²', 'U·U = γ²c²']
    ans: 1
    why: U = γ(c, v), so U·U = γ²(c² − v²) = c². It is the same for every particle in every frame, which is why U is a good four-vector.
  - q: 'To make new particles of total mass M from a beam particle of mass m hitting an identical particle at rest, the beam energy needed grows, for M much larger than m, roughly as'
    choices: ['M', 'M/2', 'M²', '√M']
    ans: 2
    why: 's = 2m² + 2Em (c = 1) must reach M², so E ≈ M²/2m. A fixed target wastes most of the energy on moving the products forward, which is why high-energy machines collide two beams head on, where √s = 2E.'
sources:
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 11 and 12'
  - 'D. Griffiths, Introduction to Elementary Particles, 2nd ed. (2008), chapter 3'
  - 'R. Hagedorn, Relativistic Kinematics (1963)'
  - 'Particle Data Group, Review of Particle Physics: Kinematics, and particle masses (2024)'
  - 'GATE Physics syllabus (Classical Mechanics: special theory of relativity), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 55 minutes.** By the end you will be able to work with four-vectors and invariants, use invariant mass to find decay momenta and threshold energies in a few lines, explain why colliders beat fixed targets, handle decays in flight and their maximum angles, and derive Compton scattering from energy-momentum conservation.

The postulates, time dilation, length contraction and the Lorentz transformation are in the JAM lesson on [special relativity](/learn/courses/iit-jam-physics/special-relativity/). This lesson is about using them efficiently.

<div class="bigidea">Write energy and momentum as one four-vector. Its length is the same in every frame, so pick the frame where the problem is easiest, compute an invariant there, and carry it anywhere else.</div>

## 1. Four-vectors and the metric

A **four-vector** `$A^\mu = (A^0, \vec A)$` is any set of four quantities that changes between inertial frames exactly as `$(ct, \vec x)$` does. For a boost with speed `$\beta c$` along `$x$`:

```math
A'^0 = \gamma\left(A^0 - \beta A^1\right), \qquad A'^1 = \gamma\left(A^1 - \beta A^0\right), \qquad A'^2 = A^2, \quad A'^3 = A^3
```

With the metric `$\eta = {\rm diag}(+1, -1, -1, -1)$`, the **scalar product** `$A\cdot B = A^0B^0 - \vec A\cdot\vec B$` is the same in every frame. In particular the "length" `$A\cdot A$` is invariant. Its sign classifies the vector: positive is **timelike**, zero is **lightlike**, negative is **spacelike**. Some books use `$(-, +, +, +)$`; then every square changes sign, so check the convention before trusting a minus.

| Four-vector | Components | Invariant square |
|---|---|---|
| position | `$(ct, \vec x)$` | `$c^2t^2 - x^2 = c^2\tau^2$` |
| four-velocity `$U = dx/d\tau$` | `$\gamma(c, \vec v)$` | `$c^2$` |
| four-momentum `$p = mU$` | `$(E/c, \vec p)$` | `$m^2c^2$` |
| wave four-vector | `$(\omega/c, \vec k)$` | 0 for light |

Here `$\tau$` is **proper time**, the time on a clock carried by the particle: `$d\tau = dt/\gamma$`.

## 2. Energy, momentum and invariant mass

The square of the four-momentum gives the energy-momentum relation, and from it the speed:

```math
E^2 = p^2c^2 + m^2c^4, \qquad \vec\beta = \frac{\vec pc}{E}, \qquad \gamma = \frac{E}{mc^2}
```

For a **system** of particles, add their four-momenta. The square of the total defines the **invariant mass** `$M$` of the system, and in particle physics the Mandelstam variable `$s$`:

```math
s = M^2c^4 = \Big(\sum E\Big)^2 - \Big(\sum\vec p\Big)^2c^2
```

`$\sqrt s$` is the total energy in the **centre-of-momentum (CM) frame**, where `$\sum\vec p = 0$`. That is the energy actually available for making new particles. Total four-momentum is conserved in every collision or decay, so `$s$` is the same before and after.

<div class="meaning">

<dl>
<dt>p<sup>μ</sup> = (E/c, p)</dt><dd>energy and momentum as one object; conservation of one is conservation of the other in another frame</dd>
<dt>p·p = m²c²</dt><dd>the mass: the same in every frame, and fixed for a given particle</dd>
<dt>√s</dt><dd>the total energy in the frame with no net momentum: what can go into new mass</dd>
<dt>β = pc/E</dt><dd>speed from energy and momentum, with no need for γ first</dd>
<dt>Physical meaning</dt><dd>Mass is the part of a system's energy that cannot be removed by changing frames. Kinetic energy of the parts relative to each other counts towards it; motion of the whole does not.</dd>
</dl>

</div>

From here on, take `$c = 1$` (energies, momenta and masses all in MeV) and put the `$c$` back at the end.

## 3. Rapidity

For a boost along one line, write `$\beta = \tanh y$`. Then `$\gamma = \cosh y$`, `$\gamma\beta = \sinh y$`, and a particle's energy and momentum are `$E = m\cosh y$`, `$p = m\sinh y$`. The point of the **rapidity** `$y$` is that successive boosts along one line simply add, `$y_{\rm total} = y_1 + y_2$`, which is the velocity-addition formula `$\beta = (\beta_1 + \beta_2)/(1 + \beta_1\beta_2)$` in disguise. A Lorentz boost is a "rotation" by an imaginary angle in the `$ct$`-`$x$` plane.

**Worked example.** A rocket fires three stages, each giving it `$0.6c$` relative to its previous rest frame. Each stage adds `$y = \tanh^{-1}0.6 = 0.693$`, so the total rapidity is `$2.079$` and the final speed is `$\tanh 2.079 = 0.969c$`. Adding speeds pair by pair gives the same answer with more algebra.

## 4. Two-body decays

**At rest.** A particle of mass `$M$` at rest decays into masses `$m_1$` and `$m_2$`. The two products have equal and opposite momenta `$p^*$`. Write the conservation law as `$P - p_1 = p_2$` and square both sides: `$M^2 - 2ME_1 + m_1^2 = m_2^2$`. So

```math
E_1^* = \frac{M^2 + m_1^2 - m_2^2}{2M}, \qquad p^* = \frac{\sqrt{\left[M^2 - (m_1 + m_2)^2\right]\left[M^2 - (m_1 - m_2)^2\right]}}{2M}
```

The energies are fixed: a two-body decay at rest gives lines, not a spread. When the beta-decay electron spectrum turned out to be continuous, Pauli concluded that a third, unseen particle, the neutrino, had to be there.

**Worked example.** For `$\pi^+ \to \mu^+\nu$` (139.57 and 105.66 MeV, neutrino mass zero), `$p^* = (139.57^2 - 105.66^2)/(2\times139.57) = 29.79$` MeV/c, and the muon's kinetic energy is `$\sqrt{29.79^2 + 105.66^2} - 105.66 = 4.12$` MeV.

**In flight.** If the parent moves with `$\gamma$`, boost the rest-frame momenta. The circle of possible `$\vec p^*$` becomes an **ellipse** in momentum space, centred at `$\gamma\beta E^*$` along the flight, with semi-axes `$\gamma p^*$` along and `$p^*$` across.

- If the parent is slower than the daughter's rest-frame speed `$\beta^* = p^*/E^*$`, the origin is inside the ellipse and daughters come out at every angle.
- If it is faster, the origin is outside, every daughter goes forward, and there is a maximum lab angle with `$\tan\theta_{\max} = \beta^*/\big(\gamma\sqrt{\beta^2 - \beta^{*2}}\big)$`.

<figure class="fig" data-fig="decay-ellipse"><figcaption>The rest-frame circle of daughter momenta and its boosted ellipse. Increase the parent's γ: once the origin falls outside the ellipse, the dashed tangents mark the widest angle the daughter can reach.</figcaption></figure>

**Worked example: a Λ in flight.** In `$\Lambda \to p\pi^-$` the proton has `$p^* = 100.6$` MeV/c and `$E^* = 943.6$` MeV, so `$\beta^* = 0.107$`. A Λ with `$\gamma = 2$` has `$\beta = 0.866$`, much faster, so every proton goes forward, within `$\tan\theta_{\max} = 0.107/(2\sqrt{0.866^2 - 0.107^2}) = 0.062$`, that is `$3.5°$` of the Λ's direction. The heavy proton hugs the line of flight; this is how Λ decays are recognised as a narrow "V" in a detector.

## 5. Thresholds and colliders

A reaction `$a + b \to$` products of total mass `$M$` can happen only if `$\sqrt s \ge M$`. At threshold the products are all at rest in the CM frame. For a beam of energy `$E_a$` on a target `$b$` at rest, `$s = m_a^2 + m_b^2 + 2E_am_b$`, so

```math
E_a^{\rm th} = \frac{M^2 - m_a^2 - m_b^2}{2m_b}
```

**Worked example: making antiprotons.** In `$p + p \to p + p + p + \bar p$` the products have `$M = 4m_p$`:

<div class="steps">
<div class="step"><p><b>Invariant before.</b> s = 2m² + 2E m for a proton of energy E on one at rest.</p></div>
<div class="step"><p><b>Invariant at threshold.</b> s = (4m)² = 16m², all four products at rest in the CM frame.</p></div>
<div class="step"><p><b>Solve.</b> 2E m = 14m², so E = 7m.</p></div>
<div class="step"><p><b>Kinetic energy.</b> T = E − m = 6m = 5.63 GeV, three times the 1.88 GeV of new mass actually made.</p></div>
</div>

The Bevatron at Berkeley was built with a 6.2 GeV beam for exactly this reason, and found the antiproton in 1955.

<div class="problem" data-problem="threshold-kinetic"></div>

**Colliders.** Two beams of energy `$E$` meeting head on have `$\sqrt s = 2E$`, all of it usable. One beam of energy `$E \gg m$` on a fixed target has only `$\sqrt s \approx \sqrt{2Em}$`. A 7 TeV proton on a proton at rest gives `$\sqrt s = 114.6$` GeV; the same proton meeting another 7 TeV proton head on gives 14 TeV.

**Thresholds in the sky.** A cosmic-ray proton hitting a photon of the cosmic microwave background head on can make a Δ resonance (1232 MeV) once `$s = m_p^2 + 4E_pE_\gamma \ge m_\Delta^2$`. For `$E_\gamma = 10^{-3}$` eV the threshold is about `$1.6\times10^{20}$` eV, which is why so few cosmic rays are seen above that energy (the GZK limit).

## 6. Mandelstam variables and scattering

For `$a + b \to c + d$`, three invariants describe the kinematics:

```math
s = (p_a + p_b)^2, \qquad t = (p_a - p_c)^2, \qquad u = (p_a - p_d)^2, \qquad s + t + u = m_a^2 + m_b^2 + m_c^2 + m_d^2
```

`$t$` is the square of the four-momentum transferred, and it is negative (spacelike) for elastic scattering. In the CM frame, for elastic scattering of momentum `$p^*$` through `$\theta^*$`, `$t = -2p^{*2}(1 - \cos\theta^*)$`.

**Worked example: Compton scattering.** A photon of four-momentum `$k$` hits an electron at rest (`$p$`) and leaves as `$k'$`, with the electron at `$p'$`. Write `$p' = k + p - k'$` and square it, using `$k^2 = k'^2 = 0$` and `$p^2 = p'^2 = m^2$`:

```math
m^2 = m^2 + 2k\cdot p - 2k'\cdot p - 2k\cdot k' \quad\Longrightarrow\quad m(E - E') = EE'(1 - \cos\theta)
```

Dividing by `$mEE'$` and using `$E = hc/\lambda$` gives `$\lambda' - \lambda = \dfrac{h}{mc}(1 - \cos\theta)$`. Squaring the right combination eliminates the electron's unknown final momentum in one step. More on the photon side in the JAM lesson on [photons](/learn/courses/iit-jam-physics/photons/).

**Relativistic elastic collision of equal masses.** Non-relativistically, a moving ball hitting an equal one at rest sends the two off at 90° (lesson 2.4, [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/)). Relativistically the opening angle is smaller: `$\tan\theta_1\tan\theta_2 = 2/(\gamma + 1)$`, with `$\gamma$` the beam particle's Lorentz factor. In bubble-chamber photographs of fast protons hitting protons, the closing of that angle was a direct sight of relativity.

<div class="myth">

**"Mass is conserved in relativity, like in chemistry."** The total energy and the total momentum are conserved; the sum of the rest masses is not. In `$\pi^0 \to \gamma\gamma$` a massive particle becomes two massless ones. The invariant mass of the whole system is conserved (it is `$\sqrt s$`), but it is not the sum of its parts' masses: two photons moving apart have a mass, a box of hot gas weighs more than the same gas cold.

</div>

**Worked example: how far a pion flies.** A charged pion has `$c\tau = 7.80$` m. At momentum 1 GeV/c, `$\gamma\beta = p/m = 1000/139.57 = 7.17$`, so its mean decay length is `$\gamma\beta c\tau = 55.9$` m. The combination `$\gamma\beta = p/mc$` is the quickest route from momentum to decay length.

<div class="keypoints">

- Metric `$(+, -, -, -)$`: `$A\cdot B = A^0B^0 - \vec A\cdot\vec B$` is invariant; `$U\cdot U = c^2$`, `$p\cdot p = m^2c^2$`, `$d\tau = dt/\gamma$`.
- `$E^2 = p^2c^2 + m^2c^4$`, `$\beta = pc/E$`, `$\gamma\beta = p/mc$`.
- `$s = (\sum E)^2 - (\sum\vec p)^2c^2$` is the CM energy squared; it is conserved and the same in every frame.
- Rapidity: `$\beta = \tanh y$`, `$E = m\cosh y$`; collinear boosts add `$y$`.
- Decay at rest: `$E_1^* = (M^2 + m_1^2 - m_2^2)/2M$`; `$\pi\to\mu\nu$` gives `$p^* = 29.79$` MeV/c. In flight: an ellipse; forward cone when `$\beta > \beta^*$`.
- Threshold on a fixed target: `$E_a = (M^2 - m_a^2 - m_b^2)/2m_b$`; antiprotons need `$T = 6m_p$`. Collider `$\sqrt s = 2E$`, fixed target `$\approx\sqrt{2Em}$`.
- `$s + t + u = \sum m^2$`; Compton from squaring `$p' = k + p - k'$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [relativistic kinematics practice page](/learn/courses/gate-physics/practice/relativistic-kinematics/).

<div class="qbank" data-bank="physics" data-topics="relativistic-kinematics" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.6, [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/). Basics: the JAM lesson on [special relativity](/learn/courses/iit-jam-physics/special-relativity/).
