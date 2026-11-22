---
title: Nuclear reactions and Q values
summary: 'Reaction kinematics at MSc level: the Q equation with angles, thresholds in the lab and the double-valued forward cone, relativistic thresholds from the invariant mass; cross-sections, reaction rates and the barn; partial-wave limits, the compound nucleus and Bohr independence, the Breit-Wigner formula and the 1/v law; direct reactions and what stripping tells us about orbits.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'For an endothermic reaction a + X → b + Y with X at rest, the non-relativistic threshold beam energy is'
    choices: ['−Q (m_b + m_Y)/(m_b + m_Y − m_a), always more than |Q|', 'exactly |Q|', '−Q m_X/(m_a + m_X), less than |Q|', 'zero, since the beam brings momentum']
    ans: 0
    why: 'Momentum must be conserved, so the products cannot be at rest in the lab; at threshold they move together with the centre of mass. The extra energy is the kinetic energy of that motion, giving T_th ≈ −Q(1 + m_a/m_X).'
  - q: 'In the compound-nucleus picture, Bohr''s independence hypothesis says'
    choices: ['the way the compound nucleus decays does not depend on how it was formed, only on its energy, J and parity', 'the projectile passes straight through the target', 'every reaction is direct', 'the cross-section is independent of energy']
    ans: 0
    why: 'The incoming energy is shared among many nucleons and the nucleus forgets its origin. Ghoshal checked this in 1950 by forming ⁶⁴Zn* from p + ⁶³Cu and from α + ⁶⁰Ni and finding the same ratios of exit channels.'
  - q: 'Why does the neutron capture cross-section of many nuclei follow σ ∝ 1/v at low energy?'
    choices: ['σ ∝ πƛ²Γ_n and the neutron width Γ_n ∝ v, so σ ∝ (1/v²) × v', 'slow neutrons are heavier', 'the Coulomb barrier falls with speed', 'the nuclear radius grows at low energy']
    ans: 0
    why: 'The geometric factor πƛ² grows as 1/v², and the probability of the neutron entering (the neutron width, proportional to its wave number) falls as v. Far from resonances the product gives 1/v: the rate σv is constant.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapter 11'
  - 'J. M. Blatt and V. F. Weisskopf, Theoretical Nuclear Physics (1952), chapters 8 and 9'
  - 'S. N. Ghoshal, An experimental verification of the theory of compound nucleus, Physical Review 80, 939 (1950)'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 50 minutes.** The [JAM lesson on reactions](/learn/courses/iit-jam-physics/nuclear-reactions/) covered notation, Q values from masses, simple thresholds, and fission and fusion. Here we work out the full kinematics with angles, do thresholds relativistically, and see what cross-sections tell us about the mechanism of a reaction.

<div class="bigidea">A reaction X(a, b)Y is governed by two separate things. Kinematics (conservation of energy and momentum) fixes which energies b can have at each angle, given Q. Dynamics (the nuclear force) fixes how likely each outcome is: the cross-section. Slow reactions through a compound nucleus show sharp resonances; fast direct reactions pick out single nucleons and their orbits.</div>

## 1. The Q equation

For `$a + X \to b + Y$` with `$X$` at rest, `$Q = (m_a + m_X - m_b - m_Y)c^2 = T_b + T_Y - T_a$`. Eliminate the unobserved `$T_Y$` with momentum conservation (`$\vec p_a = \vec p_b + \vec p_Y$`, non-relativistic):

```math
Q = T_b\left(1 + \frac{m_b}{m_Y}\right) - T_a\left(1 - \frac{m_a}{m_Y}\right) - \frac2{m_Y}\sqrt{m_am_bT_aT_b}\cos\theta
```

Measuring `$T_a$`, `$T_b$` and `$\theta$` gives `$Q$`, and with it the mass of an unknown `$Y$`, or the energy of an excited state of `$Y$` (each excited level gives its own, smaller `$Q$`: `$Q_{\text{ex}} = Q_0 - E_x$`). Read as a quadratic in `$\sqrt{T_b}$`, it gives the outgoing energy:

```math
\sqrt{T_b} = \frac{\sqrt{m_am_bT_a}\cos\theta \pm\sqrt{m_am_bT_a\cos^2\theta + (m_Y + m_b)\left[m_YQ + (m_Y - m_a)T_a\right]}}{m_Y + m_b}
```

<div class="meaning">

<dl>
<dt>Threshold</dt><dd>for `$Q < 0$`, the smallest `$T_a$` that makes the square root real at `$\theta = 0$`: `$T_{\text{th}} = -Q\,\dfrac{m_Y + m_b}{m_Y + m_b - m_a} \approx -Q\left(1 + \dfrac{m_a}{m_X}\right)$`</dd>
<dt>Double values</dt><dd>just above threshold both signs give positive `$\sqrt{T_b}$`: b comes out only inside a forward cone, with two energies at each angle, because the centre of mass moves faster than b does in the CM frame</dd>
<dt>Exothermic</dt><dd>for `$Q > 0$` there is no threshold, though charged particles still need to get over the Coulomb barrier for a useful rate</dd>
</dl>

</div>

**Worked example.** `$^7$`Li(p, n)`$^7$`Be: `$Q = (7.016003 + 1.007825 - 7.016929 - 1.008665)\times931.494 = -1.644$` MeV. Threshold: `$1.644\times\dfrac{1.008665 + 7.016929}{1.008665 + 7.016929 - 1.007825} = 1.880$` MeV, as measured. At threshold all the neutrons move forward with `$T_n = m_am_bT_a/(m_b + m_Y)^2 \approx 1.880/64 = 29$` keV: this reaction is a standard source of nearly monoenergetic slow neutrons. A little above threshold, the figure shows the two branches in the forward cone.

<figure class="fig" data-fig="reaction-threshold"><figcaption>Energy of the outgoing particle against lab angle from the Q equation. For an endothermic reaction just above threshold, b appears only in a forward cone and has two energies at each angle (the slow branch in the second colour). Choose a reaction and move the beam energy through the threshold.</figcaption></figure>

## 2. Relativistic thresholds

When the products include new particles, as in meson production, use the invariant `$s = (E_{\text{tot}})^2 - (p_{\text{tot}}c)^2$`, the same in every frame. In the lab (target at rest) `$s = m_a^2c^4 + m_X^2c^4 + 2m_Xc^2E_a$`; at threshold all products are at rest in the CM frame, so `$\sqrt s = \sum m_fc^2$`:

```math
T_{\text{th}} = \frac{\left(\sum m_f\right)^2 - (m_a + m_X)^2}{2m_X}\,c^2
```

**Worked example.** Making antiprotons, `$p + p \to p + p + p + \bar p$`: `$T_{\text{th}} = \dfrac{16m_p^2 - 4m_p^2}{2m_p}c^2 = 6m_pc^2 = 5.63$` GeV. The Bevatron at Berkeley was built for about 6 GeV for exactly this reason, and found the antiproton in 1955. Only `$2m_pc^2$` goes into new mass; the rest stays as motion of the centre of mass. This is why colliding beams, with `$\sqrt s = 2E$`, are so much more efficient than fixed targets.

<div class="problem" data-problem="reaction-threshold-rel"></div>

## 3. Cross-sections

A beam of `$\Phi$` particles per second per unit area hitting a thin target of `$N$` nuclei produces reactions at a rate `$R = \sigma\Phi N$`. The cross-section `$\sigma$` is an effective area, measured in barns: 1 b = `$10^{-28}$` m² = 100 fm², about the geometric size of a heavy nucleus. The differential cross-section `$d\sigma/d\Omega$` counts particles going into solid angle `$d\Omega$`; partial cross-sections for each exit channel add up to the total.

Move the impact parameter, then switch on the whole beam and change the target and the energy.

<figure class="fig" data-fig="@qm-rutherford"><figcaption>A small impact parameter means a large deflection, and only an almost head-on α comes straight back. The counts fall as 1/sin⁴(θ/2).</figcaption></figure>

**Partial-wave limits.** A beam of wave number `$k$` can be split into partial waves of angular momentum `$\ell$`, which pass the nucleus at impact parameter about `$\ell/k$`. Each partial wave can absorb at most a flux corresponding to an area `$\pi ƛ^2(2\ell + 1)$`, with `$ƛ = 1/k$`. Summing up to `$\ell_{\max} = kR$`:

```math
\sigma_r \le \pi(R + ƛ)^2; \qquad \text{black disc:}\ \ \sigma_{\text{el}} = \sigma_r = \pi(R + ƛ)^2, \quad \sigma_{\text{tot}} = 2\pi(R + ƛ)^2
```

The total for a fully absorbing ("black") nucleus is twice the geometric area: absorption must be accompanied by an equal amount of diffraction (shadow) scattering.

## 4. The compound nucleus and resonances

At low energy a neutron entering a nucleus shares its energy with all the nucleons and forms a **compound nucleus** that lives long (`$10^{-16}$` s or more, compared with `$10^{-22}$` s for a nucleon to cross the nucleus). It then decays by whatever channels are open. Bohr's **independence hypothesis**: the decay depends only on the energy, spin and parity of the compound state, not on how it was formed. The cross-section factorises, `$\sigma(a, b) = \sigma_{\text{CN}}(a)\,\Gamma_b/\Gamma$`.

Pick D + T, then C + C, and slide the temperature from 1 to 100 keV.

<figure class="fig" data-fig="@qm-fusion-barrier"><figcaption>Thermal energies are far below the barrier. The few fusions that happen come from the Gamow peak, where the thinning Maxwell tail meets the rising tunnelling chance; heavier nuclei need much hotter plasma.</figcaption></figure>

Near an isolated level of energy `$E_R$` and total width `$\Gamma$`, the cross-section has the **Breit-Wigner** form:

```math
\sigma(a, b) = \pi ƛ^2\,g\,\frac{\Gamma_a\Gamma_b}{(E - E_R)^2 + \Gamma^2/4}, \qquad g = \frac{2J + 1}{(2s_a + 1)(2s_X + 1)}
```

<div class="meaning">

<dl>
<dt>`$\Gamma = \hbar/\tau$`</dt><dd>total width of the compound state, the sum of the partial widths `$\Gamma_a, \Gamma_b, \ldots$` for each channel</dd>
<dt>Peak</dt><dd>at `$E = E_R$`, `$\sigma = 4\pi ƛ^2g\,\Gamma_a\Gamma_b/\Gamma^2$`; half height at `$E_R \pm \Gamma/2$`</dd>
<dt>`$g$`</dt><dd>the statistical factor: the fraction of spin states of the entrance channel that can form a compound state of spin `$J$`</dd>
<dt>1/v law</dt><dd>well below the first resonance, `$\Gamma_n \propto v$` and `$\pi ƛ^2 \propto 1/v^2$`, so `$\sigma \propto 1/v$`; boron and cadmium absorbers follow it for thermal neutrons</dd>
</dl>

</div>

**Worked example.** A neutron resonance at 1.00 eV has `$\Gamma_n = 0.010$` eV, `$\Gamma_\gamma = 0.100$` eV and `$g = 1$`. A 1 eV neutron has `$ƛ = \hbar c/\sqrt{2m_nc^2E} = 197.3/\sqrt{1879.1\times10^{-6}} = 4552$` fm, so `$4\pi ƛ^2 = 2.60\times10^8$` fm² `$= 2.60\times10^6$` b. The peak capture cross-section is `$2.60\times10^6\times(0.010\times0.100)/0.110^2 = 2.1\times10^5$` b, about a hundred thousand times the geometric area of a heavy nucleus (`$\pi R^2 \approx 1.5$` b). Slow neutrons are huge to a nucleus.

<div class="problem" data-problem="breit-wigner"></div>

## 5. Direct reactions

At higher energies (tens of MeV) the projectile often interacts with one nucleon or the surface and leaves in about `$10^{-22}$` s, with no compound nucleus. Examples: **stripping** (d, p), where the neutron of the deuteron is captured into an orbit of the target; **pickup** (p, d); inelastic scattering exciting collective states. Direct reactions give forward-peaked angular distributions, while compound-nucleus decay is nearly symmetric about 90°.

In (d, p) the captured neutron brings orbital angular momentum `$\ell\hbar \approx \hbar qR$`, where `$\hbar q$` is the momentum transfer. So the angle of the first peak of the proton distribution measures `$\ell$`, and with it the orbit of the [shell model](/learn/courses/gate-physics/shell-model/) the neutron entered. `$^{12}$`C(d, p)`$^{13}$`C (`$Q = 2.72$` MeV to the ground state) shows an `$\ell = 1$` pattern, as expected for a neutron going into `$1p_{1/2}$`; the parity of the final state is `$\pi_X(-1)^\ell$`.

<div class="myth">

**"A reaction with positive Q happens for any beam energy, and a negative-Q reaction starts as soon as the beam brings |Q|."** Positive Q makes it allowed, not likely: two charged nuclei must still tunnel through their Coulomb barrier, which is why fusion needs millions of kelvin. And a negative-Q reaction needs more than |Q|, because the products must keep moving to conserve momentum; for fixed-target particle production the excess can be several times the new rest energy.

</div>

<div class="keypoints">

- `$Q = T_b(1 + m_b/m_Y) - T_a(1 - m_a/m_Y) - (2/m_Y)\sqrt{m_am_bT_aT_b}\cos\theta$`; an excited state of Y lowers Q by `$E_x$`.
- Non-relativistic threshold `$T_{\text{th}} = -Q(m_Y + m_b)/(m_Y + m_b - m_a) \approx -Q(1 + m_a/m_X)$`; just above it, b is confined to a forward cone with two energies.
- Relativistic threshold `$T_{\text{th}} = [(\sum m_f)^2 - (m_a + m_X)^2]c^2/2m_X$`; antiproton production needs `$6m_pc^2$`.
- `$R = \sigma\Phi N$`; 1 b = 100 fm²; black disc `$\sigma_r = \pi(R + ƛ)^2$`, `$\sigma_{\text{tot}}$` twice that.
- Compound nucleus: independence hypothesis; Breit-Wigner `$\sigma = \pi ƛ^2g\Gamma_a\Gamma_b/[(E - E_R)^2 + \Gamma^2/4]$`; `$1/v$` law at low energy.
- Direct reactions are fast and forward-peaked; stripping angular distributions give `$\ell$` of the captured nucleon.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="nuclear-reactions-gate" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.6](/learn/courses/gate-physics/particles-quarks/) goes inside the nucleons themselves: leptons, hadrons, quarks and the forces between them.
