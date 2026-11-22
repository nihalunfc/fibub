---
title: 'Special relativity: Lorentz transformations and E = mc²'
seoTitle: Special relativity and E = mc² for IIT JAM Physics
summary: 'Einstein''s two postulates, the Lorentz transformation, time dilation, length contraction and the relativity of simultaneity, velocity addition, the spacetime interval and Minkowski diagrams, the relativistic Doppler effect, relativistic momentum and energy, E = mc², decays and collisions.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: Two spaceships approach each other, each moving at 0.5c relative to the Earth. The speed of one measured from the other is
    choices: ['0.8c', 'c', '0.5c', '0.75c']
    ans: 0
    why: Velocities combine as (u + v)/(1 + uv/c²) = (0.5 + 0.5)/(1 + 0.25) c = 0.8c. Simply adding would give c, which no material body can reach.
  - q: Muons made high in the atmosphere reach the ground although their lifetime at rest is only 2.2 μs. In the muon's own frame this happens because
    choices: ['The atmosphere is contracted, so the ground arrives sooner', 'Its lifetime is dilated', 'It moves faster than light', 'The Earth''s clocks run slow']
    ans: 0
    why: In its own rest frame a muon lives its ordinary 2.2 μs. What changes is the distance to the ground, contracted by γ. In the Earth's frame the same result comes from the muon's slow clock.
  - q: A particle has total energy 5 GeV and momentum 4 GeV/c. Its rest energy is
    choices: ['3 GeV', '1 GeV', '9 GeV', '4.5 GeV']
    ans: 0
    why: E² = (pc)² + (mc²)², so (mc²)² = 25 − 16 = 9 GeV² and mc² = 3 GeV. Energies combine as squares, not by simple subtraction.
sources:
  - 'A. P. French, Special Relativity, MIT Introductory Physics Series (1968)'
  - 'E. F. Taylor and J. A. Wheeler, Spacetime Physics, 2nd ed. (1992)'
  - 'A. Einstein, "Zur Elektrodynamik bewegter Körper", Annalen der Physik 17 (1905), for the history'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter: special theory of relativity), published by the organising IIT each year'
---

**Module 2 · about 50 minutes.** By the end you will be able to transform events between frames, use time dilation and length contraction without mixing up which clock or rod is the "proper" one, add velocities, read a Minkowski diagram, and solve energy-momentum problems with `$E^2 = p^2c^2 + m^2c^4$`.

<div class="bigidea">If every inertial observer measures the same speed of light, then time and space cannot be the same for everyone; only the spacetime interval is.</div>

## 1. Two postulates

In 1905 Einstein built the theory on two statements:

1. The laws of physics are the same in every inertial frame (no experiment inside a smoothly moving ship can tell you its speed).
2. Light in vacuum travels at the same speed `$c$` in every inertial frame, whatever the motion of its source.

The second clashes with everyday velocity addition. If you chase a light pulse at `$0.9c$`, it still recedes from you at `$c$`. Something about time and distance has to give, and everything in this lesson follows from these two lines.

## 2. The Lorentz transformation

Frame S′ moves at speed `$v$` along `$+x$` relative to S, with the origins together at `$t = t' = 0$`. An event at `$(x, t)$` in S has, in S′,

```math
x' = \gamma(x - vt), \qquad t' = \gamma\Big(t - \frac{vx}{c^2}\Big), \qquad y' = y,\ z' = z, \qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}}
```

The inverse swaps primes and changes `$v$` to `$-v$`. For `$v \ll c$`, `$\gamma \approx 1$` and it becomes Galileo's `$x' = x - vt$`, `$t' = t$`. Handy values: `$\beta = 0.6 \Rightarrow \gamma = 5/4$`, `$\beta = 0.8 \Rightarrow \gamma = 5/3$`, `$\beta = 0.866 \Rightarrow \gamma = 2$`.

<div class="meaning">

<dl>
<dt>γ</dt><dd>the stretch factor: 1 at low speed, growing without limit as v → c</dd>
<dt>vx/c² in t′</dt><dd>clocks that agree in S are out of step in S′, by more the farther apart they are</dd>
<dt>Proper time τ</dt><dd>time on a clock present at both events; the shortest time any frame records between them</dd>
<dt>Proper length L₀</dt><dd>length of an object in its own rest frame; the longest any frame measures</dd>
<dt>Physical meaning</dt><dd>Moving observers slice spacetime into "space" and "time" differently, the way two maps rotated against each other give different north-south and east-west distances between the same two towns.</dd>
</dl>

</div>

## 3. Time dilation, length contraction and simultaneity

All three come straight out of the transformation.

- **Time dilation.** A clock at rest in S′ ticks at fixed `$x'$`. Between ticks, S measures `$\Delta t = \gamma\Delta\tau$`: moving clocks run slow.
- **Length contraction.** S measures a moving rod by marking both ends at the same `$t$`: `$L = L_0/\gamma$`, along the motion only.
- **Simultaneity.** Events at the same `$t$` but different `$x$` have `$\Delta t' = -\gamma v\Delta x/c^2$`: in S′ the one farther along `$+x$` happens first.

**Worked example (muons).** Muons made 15 km up move at `$0.995c$` (`$\gamma = 10.0$`). Earth time of flight: 50.3 μs; muon time: 5.0 μs. Survival `$e^{-5.0/2.2} \approx 10\%$`, against `$e^{-22.8}$` without relativity. In the muon's frame its lifetime is the usual 2.2 μs and the atmosphere is only 1.5 km thick: both frames agree on how many arrive.

**The twin paradox.** A twin who flies to a star 6 light-years away at `$0.8c$` and back ages `$15/\gamma = 9$` years while her brother ages 15. It is not symmetric: she changes inertial frames at the turn, and the path with the turn has the shorter proper time.

<div class="problem" data-problem="trip-proper-time"></div>

<div class="myth">

**"In its own frame, a fast muon's lifetime is dilated."** A clock is never slow in its own rest frame. Time dilation is what **another** frame says about the moving clock. Always ask: which clock is present at both events? That one shows the proper time, and every other frame measures a longer time between the same two events.

</div>

## 4. Adding velocities

A body moving at `$u'$` along `$x$` in S′ moves in S at

```math
u = \frac{u' + v}{1 + u'v/c^2}, \qquad u_y = \frac{u_y'}{\gamma(1 + u_x'v/c^2)}
```

Combine two speeds below `$c$` and you always get one below `$c$`; combine anything with `$c$` and you get `$c$`. Two ships approaching at `$0.5c$` each close at `$0.8c$`. A neat shortcut: the **rapidity** `$\phi = \operatorname{artanh}\beta$` simply adds along a line, so three successive boosts of `$0.5c$` give `$\tanh(3\operatorname{artanh}0.5) = 13/14$`.

<div class="problem" data-problem="add-velocities"></div>

## 5. Spacetime and the Minkowski diagram

Draw `$ct$` up and `$x$` across, so light rays run at `$45^\circ$`. Every observer agrees on the **interval**

```math
s^2 = c^2\Delta t^2 - \Delta x^2 - \Delta y^2 - \Delta z^2
```

- `$s^2 > 0$` (timelike): a clock can travel between the events and records `$\tau = s/c$`; all frames agree which came first.
- `$s^2 = 0$` (lightlike): only light connects them.
- `$s^2 < 0$` (spacelike): no signal can link them, and different frames disagree about their order. A faster-than-light signal would let some observer see an effect before its cause.

<figure class="fig" data-fig="minkowski"><figcaption>Frame S in black, frame S′ in colour. Raise the speed and the ct′ and x′ axes close in on the light line like scissors. The event E gets new coordinates, but it stays on the same hyperbola: the interval does not change.</figcaption></figure>

Reading the diagram: lines parallel to the `$x'$` axis are "now" for S′, so tilting it is the relativity of simultaneity. For a full drawing tool, try the [spacetime diagram](/science/spacetime-diagram/).

## 6. The relativistic Doppler effect

For a source moving straight away at `$\beta c$`, the received wavelength is

```math
\frac{\lambda_{\rm obs}}{\lambda_{\rm emit}} = \sqrt{\frac{1 + \beta}{1 - \beta}}
```

(swap the signs for an approaching source). It combines the ordinary Doppler shift with the source's slow clock and depends only on the relative velocity. A doubled wavelength means `$\beta = 0.6$`. For distant galaxies most of the redshift comes from the expansion of space, which the cosmology course explains in [looking back in time](/learn/courses/cosmology/lookback-time/).

## 7. Momentum, energy and E = mc²

To keep momentum conserved in every frame, momentum and energy must be

```math
\vec p = \gamma m\vec v, \qquad E = \gamma mc^2, \qquad K = (\gamma - 1)mc^2, \qquad E^2 = p^2c^2 + m^2c^4, \qquad \frac{v}{c} = \frac{pc}{E}
```

Here `$m$` is the rest mass, the same in every frame. A body at rest still has energy `$mc^2$`; for a photon `$m = 0$`, `$E = pc$`. At low speed `$K \to \tfrac12mv^2$`. Reaching `$c$` would need infinite energy, and a constant force along the motion gives an acceleration `$F/\gamma^3m$` that fades away.

Step through a two-body decay, the pattern behind many exam questions:

<div class="steps">
<div class="step"><p><b>Set up.</b> A pion (rest energy M = 139.6 MeV) at rest decays into a muon (m = 105.7 MeV) and a massless neutrino.</p></div>
<div class="step"><p><b>Momentum.</b> The total is zero, so the two products fly apart with equal and opposite momenta p.</p></div>
<div class="step"><p><b>Energy.</b> E<sub>μ</sub> + pc = Mc², with E<sub>μ</sub>² = (pc)² + (mc²)².</p></div>
<div class="step"><p><b>Eliminate p.</b> E<sub>μ</sub>² − (Mc² − E<sub>μ</sub>)² = (mc²)² gives E<sub>μ</sub> = (M² + m²)c²/(2M) = 109.8 MeV.</p></div>
<div class="step"><p><b>Answer.</b> The muon's kinetic energy is only 4.1 MeV; the light neutrino carries off the other 29.8 MeV of the 33.9 MeV released.</p></div>
</div>

**Mass and binding.** In a collision where two lumps of rest mass `$m$` meet head-on at `$0.6c$` and stick, the lump is at rest with mass `$2\gamma m = 2.5m$`: kinetic energy has become rest energy. Run backwards, this is nuclear energy: a deuteron is lighter than a proton plus a neutron by 0.002388 u, its 2.22 MeV binding energy. Satellites must even correct their clocks for relativity, as the [GPS relativity explainer](/science/gps-relativity/) shows, and the [relativistic kinematics](/science/relativistic-kinematics/) calculator handles collisions and decays.

**Worked example (threshold).** The least photon energy for `$\gamma + e^- \to e^- + e^- + e^+$` on an electron at rest: the invariant `$E_{\rm tot}^2 - p_{\rm tot}^2c^2$` before is `$2E m_ec^2 + m_e^2c^4$`; at threshold the three products move together, so after it is `$(3m_ec^2)^2$`. Hence `$E = 4m_ec^2 = 2.04$` MeV, twice what a careless "just make two masses" guess gives.

<div class="keypoints">

- Postulates: same laws in every inertial frame; same `$c$` for everyone.
- Lorentz: `$x' = \gamma(x - vt)$`, `$t' = \gamma(t - vx/c^2)$`; `$\gamma = 1/\sqrt{1 - \beta^2}$`.
- Moving clocks run slow (`$\Delta t = \gamma\tau$`); moving rods shrink along the motion (`$L = L_0/\gamma$`); simultaneity depends on the frame.
- Velocity addition `$(u' + v)/(1 + u'v/c^2)$`; rapidities add.
- Interval `$c^2\Delta t^2 - \Delta x^2$` is invariant: timelike, lightlike or spacelike.
- Doppler `$\lambda_{\rm obs}/\lambda = \sqrt{(1 + \beta)/(1 - \beta)}$` for a receding source.
- `$p = \gamma mv$`, `$E = \gamma mc^2$`, `$K = (\gamma - 1)mc^2$`, `$E^2 = p^2c^2 + m^2c^4$`, `$v/c = pc/E$`; rest mass is not conserved, total energy is.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [special relativity practice page](/learn/courses/iit-jam-physics/practice/special-relativity/).

<div class="qbank" data-bank="physics" data-topics="special-relativity" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.8, [fluids](/learn/courses/iit-jam-physics/fluids/). **Next:** module 3 begins with [simple harmonic motion](/learn/courses/iit-jam-physics/simple-harmonic-motion/). Relativity returns with photons in [the photoelectric and Compton effects](/learn/courses/iit-jam-physics/photons/), and GATE goes on to [four-vectors and relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/).
