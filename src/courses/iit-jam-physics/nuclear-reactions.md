---
title: 'Nuclear reactions, fission and fusion'
seoTitle: Nuclear reactions, fission and fusion for IIT JAM Physics
summary: 'How to balance a nuclear reaction, work out its Q-value from masses or binding energies, find the threshold of an endothermic reaction, use cross-sections and mean free paths, and understand fission chain reactions, moderators and delayed neutrons, and fusion in the Sun and in reactors, with the traps JAM sets.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An endothermic reaction has Q = −2.0 MeV. A light projectile hits a target 9 times heavier, at rest. What is the threshold kinetic energy (non-relativistic)?'
    choices: ['About 2.2 MeV', 'Exactly 2.0 MeV', 'About 1.8 MeV', 'About 18 MeV']
    ans: 0
    why: 'K_th = |Q|(1 + m_a/m_X) = 2.0 × (1 + 1/9) = 2.22 MeV. Some of the projectile''s energy must go into moving the centre of mass, so the threshold is always above |Q|.'
  - q: 'A nucleus at rest splits into two fragments. Which fragment carries more kinetic energy?'
    choices: ['The lighter one', 'The heavier one', 'They share it equally', 'It depends on the charges']
    ans: 0
    why: 'Momentum conservation gives them equal and opposite momenta p. Kinetic energy p²/2m is then larger for the smaller mass.'
  - q: 'Why does a thermal reactor need a moderator?'
    choices: ['To slow fast fission neutrons, because uranium-235 fissions far more readily with slow neutrons', 'To absorb neutrons and stop the reaction', 'To cool the fuel', 'To make the fuel more radioactive']
    ans: 0
    why: 'Fission neutrons are born at about 2 MeV; the uranium-235 fission cross-section is hundreds of times larger at thermal energies (0.025 eV). Light nuclei slow neutrons by elastic collisions. Absorbing neutrons is the job of the control rods.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (Wiley, 1988), chapters 11 to 14'
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (McGraw-Hill, 2003), chapter 12'
  - 'J. R. Lamarsh and A. J. Baratta, Introduction to Nuclear Engineering, 3rd ed. (Prentice Hall, 2001), chapters 3 and 4'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 45 minutes.** By the end you will be able to balance any reaction, compute its Q-value from atomic masses or binding energies, find the threshold energy of an endothermic reaction, share energy between products with momentum conservation, use cross-sections for attenuation and reaction rates, explain chain reactions, moderators and delayed neutrons, and estimate the energy from fission and fusion fuel.

<div class="bigidea">A nuclear reaction is a collision that rearranges nucleons. The mass that disappears comes out as kinetic energy, Q = (mass before − mass after)c², and it is a million times bigger per event than in chemistry.</div>

## 1. What you already know, and what is new

In [lesson 6.5](/learn/courses/iit-jam-physics/nuclei-radioactivity/) nuclei changed on their own: alpha, beta and gamma decay. Now we hit them with something (a proton, neutron, deuteron, alpha particle or photon) and look at what comes out. The notation `$a + X \to Y + b$` is shortened to `$X(a, b)Y$`. For example, Rutherford's first transmutation (1919) was

```math
{}^4_2\text{He} + {}^{14}_{7}\text{N} \to {}^{17}_{8}\text{O} + {}^1_1\text{H}, \qquad \text{written } {}^{14}\text{N}(\alpha, p)\,{}^{17}\text{O}
```

**What is conserved:** charge (`$Z$` adds up), nucleon number (`$A$` adds up), total energy, momentum, angular momentum and parity. **What is not:** the sum of the rest masses. The change in rest mass is exactly the energy released or absorbed.

## 2. The Q-value

```math
Q = \left(\sum m_{\text{before}} - \sum m_{\text{after}}\right)c^2 = \sum K_{\text{after}} - \sum K_{\text{before}}, \qquad 1\ \text{u} = 931.5\ \text{MeV}/c^2
```

`$Q > 0$`: **exothermic**, kinetic energy is released. `$Q < 0$`: **endothermic**, the projectile must bring energy.

Use **atomic** masses from the tables: when `$Z$` balances, the electrons on the two sides balance too and cancel. (In beta-plus processes, where the electron count does not balance, take care: see the pp chain below.) Equivalently, in terms of binding energies, `$Q = \sum B_{\text{after}} - \sum B_{\text{before}}$`: energy comes out when the products are more tightly bound.

<div class="meaning">

<dl>
<dt>Q</dt><dd>energy released by the reaction: lost rest mass × c², equal to the gain in kinetic energy</dd>
<dt>931.5 MeV</dt><dd>the rest energy of one atomic mass unit</dd>
<dt>Q from B</dt><dd>gain in total binding energy (products minus reactants): the opposite order to the mass formula</dd>
<dt>Threshold</dt><dd>smallest projectile kinetic energy that makes an endothermic reaction go; always more than |Q|</dd>
<dt>Physical meaning</dt><dd>Nuclear energy is stored as rest mass. Moving nucleons into more tightly bound nuclei releases about 1 MeV per nucleon, against a few eV per atom in chemistry.</dd>
</dl>

</div>

**Worked example (D–T fusion).** Atomic masses: ²H 2.014102 u, ³H 3.016049 u, ⁴He 4.002603 u, n 1.008665 u. Before: 5.030151 u. After: 5.011268 u. `$Q = 0.018883\times931.5 = 17.59$` MeV.

**Worked example (Rutherford's reaction).** ⁴He + ¹⁴N = 18.005677 u; ¹⁷O + ¹H = 18.006957 u. The products are heavier, so `$Q = -0.001280\times931.5 = -1.19$` MeV: endothermic.

<figure class="fig" data-fig="q-value"><figcaption>Pick a reaction. The bars compare the total rest mass before and after (the axis is zoomed in, because the difference is only a few thousandths of a mass unit). The readout turns the difference into Q, shares the energy between the two products for exothermic reactions, and gives the threshold for endothermic ones.</figcaption></figure>

<div class="problem" data-problem="reaction-q"></div>

## 3. Kinematics: sharing energy and thresholds

**Two products from rest.** If the reactants have negligible momentum (a slow neutron, or a nucleus that splits on its own), the two products fly apart with equal and opposite momenta `$p$`. Since `$K = p^2/2m$`, the lighter one takes the larger share:

```math
K_b = Q\,\frac{m_Y}{m_b + m_Y}, \qquad K_Y = Q\,\frac{m_b}{m_b + m_Y}
```

In D–T fusion the neutron (mass 1) gets `$17.6\times4/5 = 14.1$` MeV and the alpha particle (mass 4) gets 3.5 MeV.

**Threshold of an endothermic reaction.** A projectile hitting a stationary target cannot spend all its kinetic energy on the reaction: momentum must be conserved, so the products keep moving with the centre-of-mass velocity. At threshold the products are at rest in the centre-of-mass frame, and (non-relativistically)

```math
K_{\rm th} = -Q\left(1 + \frac{m_a}{m_X}\right)
```

For Rutherford's reaction: `$1.19\times(1 + 4/14) = 1.53$` MeV. For ⁷Li(p, n)⁷Be, `$Q = -1.645$` MeV and `$K_{\rm th} = 1.645\times(1 + 1.0078/7.0160) = 1.88$` MeV. When the target is much heavier than the projectile the threshold is close to `$|Q|$`.

<div class="steps">
<div class="step"><p><b>Lab frame.</b> Projectile a (mass m<sub>a</sub>, kinetic energy K) hits X at rest. Total momentum p<sub>a</sub> = √(2m<sub>a</sub>K).</p></div>
<div class="step"><p><b>Centre of mass.</b> It moves at V = p<sub>a</sub>/(m<sub>a</sub> + m<sub>X</sub>) and carries kinetic energy p<sub>a</sub>²/2(m<sub>a</sub> + m<sub>X</sub>) = K m<sub>a</sub>/(m<sub>a</sub> + m<sub>X</sub>), which can never be used.</p></div>
<div class="step"><p><b>What is left.</b> The energy available for the reaction is K − K m<sub>a</sub>/(m<sub>a</sub> + m<sub>X</sub>) = K m<sub>X</sub>/(m<sub>a</sub> + m<sub>X</sub>).</p></div>
<div class="step"><p><b>Threshold.</b> Set it equal to −Q: K<sub>th</sub> = −Q (m<sub>a</sub> + m<sub>X</sub>)/m<sub>X</sub> = −Q(1 + m<sub>a</sub>/m<sub>X</sub>).</p></div>
</div>

**The Q-equation.** When the outgoing particle `$b$` is measured at angle `$\theta$` to the beam, momentum and energy conservation give

```math
Q = K_b\left(1 + \frac{m_b}{m_Y}\right) - K_a\left(1 - \frac{m_a}{m_Y}\right) - \frac{2}{m_Y}\sqrt{m_am_bK_aK_b}\,\cos\theta
```

At `$90^\circ$` the last term vanishes, which is why JAM questions like that angle. This is how Q-values (and so masses of unstable nuclei) are measured.

For relativistic thresholds use the invariant mass: `$(E_{\rm tot})^2 - (p_{\rm tot}c)^2$` in the lab must reach `$(\sum m_{\rm products}c^2)^2$`. For antiproton production, `$p + p \to p + p + p + \bar p$`, this gives `$K_{\rm th} = 6m_pc^2 = 5.6$` GeV (see [special relativity](/learn/courses/iit-jam-physics/special-relativity/)).

## 4. Cross-sections: how likely is a reaction?

Each target nucleus presents an effective area `$\sigma$` to the beam, its **cross-section**, measured in barns: `$1$` b `$= 10^{-28}$` m². With `$n$` nuclei per unit volume:

- a beam falls off as `$I = I_0e^{-n\sigma x}$`;
- the **mean free path** is `$\lambda = 1/(n\sigma)$`;
- a thin target of `$N$` nuclei in a flux `$\Phi$` (particles per m² per s) reacts at the rate `$R = \sigma\Phi N$`.

**Worked example.** A slab with `$n = 5\times10^{28}$` m⁻³ and `$\sigma = 2$` b has `$n\sigma = 10$` m⁻¹: mean free path 10 cm, and a 5 cm slab lets through `$e^{-0.5} = 61\%$` of the beam.

Slow projectiles that are captured make a **compound nucleus** that lives long enough to share the energy among all its nucleons and "forget" how it was formed (Bohr's independence hypothesis); its decay depends only on energy and angular momentum. Fast projectiles can instead knock out or pick up a single nucleon in a **direct reaction**, over in the time it takes to cross the nucleus.

## 5. Fission and chain reactions

A uranium-235 nucleus that captures a slow neutron becomes uranium-236, which wobbles and splits into two medium-mass fragments plus 2 or 3 neutrons, for example

```math
n + {}^{235}\text{U} \to {}^{141}\text{Ba} + {}^{92}\text{Kr} + 3n
```

**Why energy comes out.** Binding energy per nucleon is about 7.6 MeV for uranium and about 8.5 MeV for the fragments, so roughly `$236\times0.9 \approx 200$` MeV is released per fission: about 170 MeV as kinetic energy of the fragments (shared inversely to their masses), the rest in neutrons, gamma rays and the later beta decays. That is `$8.2\times10^{13}$` J per kilogram, millions of times more than burning coal. The interactive [binding energy curve](/learn/binding-energy/) shows where the energy comes from.

**Worked example (fuel use).** A 1000 MW (thermal) reactor makes `$10^9/(200\times1.602\times10^{-13}) = 3.1\times10^{19}$` fissions per second, `$2.7\times10^{24}$` per day: 4.5 mol, or about 1.05 kg of uranium-235 a day.

<div class="problem" data-problem="fission-fuel"></div>

**Chain reactions.** The **multiplication factor** `$k$` is the number of neutrons in one generation for each neutron in the generation before (after leakage and absorption). `$k < 1$`: subcritical, the reaction dies out. `$k = 1$`: critical, steady power. `$k > 1$`: supercritical, the power grows as `$k^n$` after `$n$` generations. Leakage happens through the surface while production happens in the volume, so a small lump leaks too much: hence a **critical mass**.

<figure class="fig" data-fig="chain-reaction"><figcaption>The neutron population over time for a chosen k. With delayed neutrons the effective generation time is about 0.1 s and a slightly supercritical reactor doubles its power in about a minute; with prompt neutrons alone (about 0.1 ms) it would double in a fraction of a second.</figcaption></figure>

**What makes a reactor controllable:**

- A **moderator** (water, heavy water, graphite) slows the 2 MeV fission neutrons to thermal energies (0.025 eV), where uranium-235's fission cross-section is about 580 b. In a head-on elastic collision a neutron keeps the fraction `$\left(\frac{A - 1}{A + 1}\right)^2$` of its energy: nothing after hitting hydrogen, 72% after carbon. Light nuclei that absorb few neutrons make the best moderators.
- **Control rods** (boron, cadmium) absorb neutrons to adjust `$k$`.
- About 0.65% of the neutrons are **delayed**, emitted seconds later by fission products. They stretch the effective generation time from about `$10^{-4}$` s to about 0.1 s. A reactor is run so that it can only exceed `$k = 1$` with the help of the delayed neutrons, giving the control system minutes, not milliseconds.

**Worked example.** With `$k = 1.001$` and a generation time of 0.1 s, the power doubles after `$\ln2/\ln1.001 = 693$` generations, or 69 s. Try it in the figure, and play with the [fission chain reaction](/learn/fission-chain/) simulator.

## 6. Fusion

Light nuclei release energy by fusing, because binding energy per nucleon climbs steeply from hydrogen to helium-4. The main reactions:

| Reaction | Q (MeV) | Where |
|---|---|---|
| ²H + ³H → ⁴He + n | 17.6 | fusion reactors |
| ²H + ²H → ³He + n | 3.27 | reactors, early universe |
| ²H + ²H → ³H + p | 4.03 | reactors |
| 4 ¹H → ⁴He + 2e⁺ + 2ν (pp chain) | 26.7 | the Sun |

**The Coulomb barrier.** Two deuterons must come within about 3 fm to feel the strong force. The electric repulsion there is `$e^2/(4\pi\varepsilon_0 r) = 1.44\ \text{MeV fm}/3\ \text{fm} \approx 0.5$` MeV. The centre of the Sun is at `$1.5\times10^7$` K, where `$kT \approx 1.3$` keV, hundreds of times lower. Fusion happens only because the fastest nuclei in the Maxwell distribution **tunnel** through the barrier, which is why it is slow and the Sun lasts ten billion years.

**The pp chain and atomic masses.** `$4\times1.007825 - 4.002603 = 0.028697$` u gives 26.7 MeV. Using atomic masses here automatically includes the energy of the two positrons annihilating with two electrons (`$2\times1.022$` MeV); the purely nuclear step releases 24.7 MeV.

**Fusion on Earth** needs a D–T plasma at about `$10^8$` K, held together long enough: the **Lawson criterion** asks for density × energy-confinement time above about `$10^{20}$` s m⁻³. Per kilogram, D–T fuel gives `$17.6/5 = 3.5$` MeV per u, about four times fission's `$200/236 = 0.85$` MeV per u. Tritium is rare, so it is bred from lithium: ⁶Li + n → ³H + ⁴He (Q = 4.78 MeV).

<div class="myth">

**"Mass is converted into energy only in nuclear reactions."** Every exothermic reaction, including burning wood, loses a little rest mass; in chemistry it is about a billionth of the mass, too small to weigh, while in nuclear reactions it is about a thousandth.

**"The threshold of an endothermic reaction is |Q|."** Only if the target were infinitely heavy. Momentum must be conserved, so the products keep the centre-of-mass motion: `$K_{\rm th} = |Q|(1 + m_a/m_X)$`.

**"Equal momenta means equal energies."** In a two-body break-up the momenta are equal, so the *lighter* product carries more energy: 14.1 of the 17.6 MeV goes to the neutron in D–T fusion.

</div>

<div class="keypoints">

- Conserved: `$Z$`, `$A$`, energy, momentum, angular momentum, parity. Not conserved: total rest mass.
- `$Q = (\sum m_{\rm before} - \sum m_{\rm after})\times931.5$` MeV/u (atomic masses), or `$Q = \sum B_{\rm after} - \sum B_{\rm before}$`.
- Two products from rest: `$K_b = Q\,m_Y/(m_b + m_Y)$`. Threshold: `$K_{\rm th} = -Q(1 + m_a/m_X)$`; at `$90^\circ$` the Q-equation loses its cross term.
- `$I = I_0e^{-n\sigma x}$`, `$\lambda = 1/n\sigma$`, `$R = \sigma\Phi N$`; 1 b `$= 10^{-28}$` m².
- Fission: about 200 MeV per uranium-235 fission, `$8.2\times10^{13}$` J/kg; about 1.05 kg/day per 1000 MW thermal. `$k = 1$` critical; moderators slow neutrons, control rods absorb them, delayed neutrons make control possible.
- Head-on elastic collision: energy kept `$= ((A - 1)/(A + 1))^2$`.
- Fusion: D–T 17.6 MeV (neutron gets 14.1); pp chain 26.7 MeV with atomic masses; Coulomb barrier about 0.5 MeV crossed by tunnelling; Lawson `$n\tau \gtrsim 10^{20}$` s m⁻³.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [nuclear reactions practice page](/learn/courses/iit-jam-physics/practice/nuclear-reactions/).

<div class="qbank" data-bank="physics" data-topics="nuclear-reactions" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 6.5, nuclei and radioactivity](/learn/courses/iit-jam-physics/nuclei-radioactivity/). **Next:** module 7, starting with [crystal structure](/learn/courses/iit-jam-physics/crystal-structure/). Going on to GATE or CSIR NET? The GATE Physics course adds [nuclear models](/learn/courses/gate-physics/shell-model/), the nuclear force and [elementary particles](/learn/courses/gate-physics/particles-quarks/), and CSIR NET covers [the deuteron and the nuclear force](/learn/courses/csir-net-physics/deuteron-nuclear-force/).
