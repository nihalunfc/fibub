---
title: Potentials, gauges and Maxwell's equations
summary: 'Fields from the scalar and vector potentials, gauge transformations, the Coulomb, Lorenz and temporal gauges, wave equations for the potentials, retarded potentials and retarded time, a current switched on in a wire, Liénard-Wiechert and uniformly moving charges, canonical momentum and the Aharonov-Bohm effect.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: Which pair of transformations leaves E and B unchanged?
    choices: ['A → A + ∇λ, V → V − ∂λ/∂t', 'A → A + ∇λ, V → V + ∂λ/∂t', 'A → A − ∇λ, V → V − ∂λ/∂t', 'A → A + ∇×(λẑ), V unchanged']
    ans: 0
    why: "∇×∇λ = 0 keeps B, and E = −∇V − ∂A/∂t picks up +∇∂λ/∂t − ∇∂λ/∂t = 0. The signs must be paired this way."
  - q: In the Coulomb gauge, how does the scalar potential respond when a distant charge moves?
    choices: ['Instantly, but the fields still change only after the light travel time', 'After the light travel time', 'Not at all', 'Instantly, and so do the fields']
    ans: 0
    why: "In Coulomb gauge V obeys Poisson's equation at each instant. The vector potential carries compensating terms, so E and B are still retarded: only fields are measurable."
  - q: Electrons pass around a shielded solenoid where B = 0 on their paths. Does the interference pattern depend on the solenoid's flux?
    choices: ['Yes: the paths differ in phase by eΦ/ħ', 'No: there is no field on the paths', 'Only if the electrons are fast', 'Only if the solenoid is not shielded']
    ans: 0
    why: "Each path picks up phase (q/ħ)∫A·dl, and the difference is (q/ħ)∮A·dl = qΦ/ħ. This is the Aharonov-Bohm effect: the loop integral of A is gauge invariant and physical."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 10'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), sections 6.2 to 6.5 and 14.1'
  - 'J. D. Jackson, "From Lorenz to Coulomb and other explicit gauge transformations", American Journal of Physics 70, 917 (2002)'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 2nd ed. (2011), section 2.7 (gauge transformations, Aharonov-Bohm)'
  - 'GATE Physics (PH) syllabus, Electromagnetic theory section, published by the organising institute each year'
---

**Module 3 · about 55 minutes.** In statics `$\vec E = -\nabla V$` and `$\vec B = \nabla\times\vec A$` live separate lives. Once fields change in time they mix, the potentials are no longer unique, and that freedom (gauge freedom) turns out to be a powerful tool and a deep idea. This lesson sets up the potentials of full electrodynamics, the gauges you will meet, the retarded solutions, and the quantum effect that shows `$\vec A$` is more than a mathematical trick. Maxwell's equations themselves are in the IIT JAM lesson on [Maxwell's equations and waves](/learn/courses/iit-jam-physics/maxwell-em-waves/); the static vector potential is in [magnetostatics](/learn/courses/iit-jam-physics/magnetostatics/).

<div class="bigidea">Two of Maxwell's equations (no monopoles, Faraday) are solved once and for all by writing B = ∇×A and E = −∇V − ∂A/∂t. The other two become equations for V and A. Many different (V, A) give the same fields, and choosing among them wisely makes the remaining equations simple.</div>

## 1. Fields from potentials

`$\nabla\cdot\vec B = 0$` means `$\vec B = \nabla\times\vec A$`. Faraday's law then reads `$\nabla\times(\vec E + \partial\vec A/\partial t) = 0$`, so the bracket is a gradient:

```math
\vec B = \nabla\times\vec A, \qquad \vec E = -\nabla V - \frac{\partial\vec A}{\partial t}
```

The term `$-\partial\vec A/\partial t$` is the induced electric field, the one with curl. Gauss's and the Ampère-Maxwell laws become

```math
\nabla^2V + \frac{\partial}{\partial t}(\nabla\cdot\vec A) = -\frac{\rho}{\epsilon_0}, \qquad \nabla^2\vec A - \frac{1}{c^2}\frac{\partial^2\vec A}{\partial t^2} - \nabla\left(\nabla\cdot\vec A + \frac{1}{c^2}\frac{\partial V}{\partial t}\right) = -\mu_0\vec J
```

Ugly and coupled, but four functions instead of six.

**Worked example.** `$V = 0$`, `$\vec A = xt\,\hat y$` (SI units): `$\vec E = -x\,\hat y$` and `$\vec B = t\,\hat z$`. Check: `$\nabla\times\vec E = -\hat z = -\partial\vec B/\partial t$`. ✓ A plane wave `$\vec A = A_0\sin(kx - \omega t)\hat y$` with `$V = 0$` gives `$E_0 = \omega A_0$` and `$B_0 = kA_0$`, so `$E_0/B_0 = c$`.

## 2. Gauge freedom

Add the gradient of any function `$\lambda(\vec r, t)$`:

```math
\vec A \to \vec A + \nabla\lambda, \qquad V \to V - \frac{\partial\lambda}{\partial t}
```

`$\vec B$` is unchanged because `$\nabla\times\nabla\lambda = 0$`, and `$\vec E$` because the two new terms cancel. Some familiar facts are special cases: a constant `$V_0$` in `$V$` is removed by `$\lambda = V_0t$`; the Landau gauge `$-B_0y\,\hat x$` and the symmetric gauge `$\tfrac12\vec B\times\vec r$` for a uniform field differ by `$\lambda = \tfrac12B_0xy$`; and a uniform static `$\vec E = E_0\hat x$` can be described with `$V = 0$` and `$\vec A = -E_0t\,\hat x$`.

What does *not* change: the fields, and the loop integral `$\oint\vec A\cdot d\vec l$` (it equals the enclosed flux). What *does* change: `$\nabla\cdot\vec A$`, which is exactly what a gauge condition fixes.

### The three gauges

| Gauge | Condition | What it buys |
|---|---|---|
| Coulomb | `$\nabla\cdot\vec A = 0$` | `$\nabla^2V = -\rho/\epsilon_0$` at each instant; `$\vec A$` is sourced by the transverse current only |
| Lorenz | `$\nabla\cdot\vec A + \dfrac{1}{c^2}\dfrac{\partial V}{\partial t} = 0$` | two decoupled wave equations; Lorentz invariant (`$\partial_\mu A^\mu = 0$`) |
| temporal (Weyl) | `$V = 0$` | always reachable with `$\lambda = \int^tV\,dt'$`; Gauss's law becomes a constraint |

In the **Lorenz gauge** the coupled equations collapse to

```math
\Box^2V = -\frac{\rho}{\epsilon_0}, \qquad \Box^2\vec A = -\mu_0\vec J, \qquad \Box^2 = \nabla^2 - \frac{1}{c^2}\frac{\partial^2}{\partial t^2}
```

Some freedom survives: any `$\lambda$` with `$\Box^2\lambda = 0$` keeps the Lorenz condition. For free radiation one uses it to set `$V = 0$` as well, leaving two transverse polarisations.

In the **Coulomb gauge** `$V$` is the instantaneous Coulomb potential of the charge at time `$t$`. That looks acausal but is not: `$\vec A$` carries compensating terms, and the measurable `$\vec E$` and `$\vec B$` still change only after a light-travel delay.

<div class="meaning">

<dl>
<dt>V, A</dt><dd>scalar and vector potentials; E = −∇V − ∂A/∂t, B = ∇×A</dd>
<dt>Gauge transformation</dt><dd>A → A + ∇λ, V → V − ∂λ/∂t: a change of description that changes no field</dd>
<dt>Gauge condition</dt><dd>an extra equation (∇·A = 0, or the Lorenz condition) that picks one description from the family</dd>
<dt>Retarded time</dt><dd>t<sub>r</sub> = t − 𝓇/c, the moment the source sent the signal that arrives now</dd>
<dt>Physical meaning</dt><dd>The potentials carry more information than the fields need; gauge freedom is that surplus. Quantum mechanics uses it: the phase of a charged particle's wavefunction changes along with the gauge.</dd>
</dl>

</div>

## 3. Retarded potentials

The Lorenz-gauge wave equations are solved like the static ones, with each source evaluated at the time its signal left:

```math
V(\vec r, t) = \frac{1}{4\pi\epsilon_0}\int\frac{\rho(\vec r\,', t_r)}{\mathscr r}d\tau', \qquad \vec A(\vec r, t) = \frac{\mu_0}{4\pi}\int\frac{\vec J(\vec r\,', t_r)}{\mathscr r}d\tau', \qquad t_r = t - \frac{\mathscr r}{c}
```

These satisfy the Lorenz condition automatically, given charge conservation. The advanced solutions (with `$t + \mathscr r/c$`) solve the equations too, and are rejected for causality.

**A warning.** You may retard the *potentials* naively, but not the *fields*. Differentiating `$\rho(\vec r\,', t - \mathscr r/c)$` also differentiates the retarded time, producing terms in `$\dot\rho$` and `$\dot{\vec J}$` that fall off only as `$1/\mathscr r$`. Those are Jefimenko's extra terms, and they are the radiation.

### Worked example: switching on a wire

A current `$I_0$` is switched on at `$t = 0$` in an infinite neutral wire. At distance `$s$` and time `$t$`, only the segments within `$ct$` of the field point have been heard from, `$|z| < \sqrt{c^2t^2 - s^2}$`:

<div class="steps" data-fig="switch-on-wire">
<div class="step"><p><b>Before the front (ct &lt; s):</b> nothing has arrived. A = 0, so E = 0 and B = 0.</p></div>
<div class="step"><p><b>The vector potential:</b> A<sub>z</sub> = (μ₀I₀/4π) ∫ dz/√(s² + z²) over |z| &lt; √(c²t² − s²) = (μ₀I₀/2π) ln[(ct + √(c²t² − s²))/s].</p></div>
<div class="step"><p><b>The fields:</b> E<sub>z</sub> = −∂A<sub>z</sub>/∂t = −μ₀I₀c / 2π√(c²t² − s²), opposing the current (Lenz). B<sub>φ</sub> = −∂A<sub>z</sub>/∂s = (μ₀I₀/2πs) · ct/√(c²t² − s²).</p></div>
<div class="step"><p><b>Late times (ct ≫ s):</b> E → 0 and B → μ₀I₀/2πs, the steady Biot-Savart field. Just behind the front both are very large: the news arrives as a sharp pulse.</p></div>
</div>

At `$ct = 2s$`, `$B$` is `$2/\sqrt3 = 1.155$` times its final value, and for `$I_0 = 1$` A at `$s = 1$` m the electric field is `$59.96/\sqrt3 = 34.6$` V/m.

## 4. Moving point charges

For a point charge the retarded integral needs care, because the charge moves while its signal is "collected". The result (Liénard-Wiechert) is

```math
V(\vec r, t) = \frac{1}{4\pi\epsilon_0}\frac{q}{\mathscr r - \vec{\mathscr r}\cdot\vec v/c}, \qquad \vec A(\vec r, t) = \frac{\vec v}{c^2}V(\vec r, t)
```

with `$\vec{\mathscr r}$` (from charge to field point) and `$\vec v$` taken at the retarded time. Compared with Coulomb's `$q/4\pi\epsilon_0\mathscr r$`, an approaching charge (`$\vec{\mathscr r}\cdot\vec v > 0$`) looks stronger and a receding one weaker: at `$0.5c$` the factors are 2 and `$\tfrac23$`.

**Uniform motion.** For constant velocity the retarded quantities can be eliminated in favour of the *present* position. With `$\theta$` the angle between `$\vec v$` and the line from the present position to the field point, at present distance `$d$`:

```math
V = \frac{q}{4\pi\epsilon_0d\sqrt{1 - \beta^2\sin^2\theta}}
```

Ahead and behind (`$\theta = 0$`) it is exactly Coulomb's; sideways it is `$\gamma$` times larger. The retarded time itself, for a field point at perpendicular distance `$d$` from the track when the charge passes, is `$|t_r| = \gamma d/c$`: at `$0.6c$` and 3 m that is 12.5 ns, longer than `$d/c = 10$` ns, because the signal left from an earlier, farther position.

<div class="problem" data-problem="lienard-wiechert-factor"></div>

## 5. Potentials in mechanics and quantum mechanics

A charge in fields has Lagrangian and Hamiltonian

```math
L = \tfrac12mv^2 - qV + q\vec v\cdot\vec A, \qquad H = \frac{(\vec p - q\vec A)^2}{2m} + qV, \qquad \vec p = m\vec v + q\vec A
```

The **canonical momentum** `$\vec p$` depends on the gauge; the mechanical momentum `$m\vec v$` and the kinetic energy do not. An electron at rest 5 cm from the axis of a uniform 0.1 T field has `$|\vec p| = eBs/2 = 4.0\times10^{-22}$` kg m/s in the symmetric gauge, and a different value in the Landau gauge.

In quantum mechanics `$\hat{\vec p} = -i\hbar\nabla$` is canonical, so the Schrödinger equation keeps its form under a gauge transformation only if the wavefunction changes by a phase, `$\psi \to e^{iq\lambda/\hbar}\psi$`. Requiring this local phase freedom is the starting point of every gauge theory.

**The Aharonov-Bohm effect.** Outside a long solenoid `$\vec B = 0$` but `$A_\phi = \Phi/2\pi s$` (from `$\oint\vec A\cdot d\vec l = \Phi$`). Electrons passing on either side, never touching the field, pick up phases `$\tfrac q\hbar\int\vec A\cdot d\vec l$`, which differ by

```math
\Delta\phi = \frac{q}{\hbar}\oint\vec A\cdot d\vec l = \frac{q\Phi}{\hbar}
```

The pattern shifts by one fringe per `$h/e = 4.14\times10^{-15}$` Wb (half that, `$h/2e$`, is the superconducting flux quantum, for charge `$2e$` pairs). The loop integral is gauge invariant, so this is physics, not bookkeeping: the potentials act where the fields vanish.

<div class="problem" data-problem="solenoid-vector-potential"></div>

<div class="myth">

**"The vector potential is just a calculating device; only the fields are real."** Classically, the fields are indeed all that matter. But the Aharonov-Bohm experiment (done with electron holography and shielded toroidal magnets) shows a shift that depends on `$\oint\vec A\cdot d\vec l$` where `$\vec B = 0$` everywhere along the paths. What is physical is not `$\vec A$` at a point (that is gauge dependent) but its loop integrals, the phases it gives charged particles.

</div>

<div class="keypoints">

- `$\vec B = \nabla\times\vec A$`, `$\vec E = -\nabla V - \partial\vec A/\partial t$`. Gauge freedom: `$\vec A + \nabla\lambda$`, `$V - \partial_t\lambda$`; `$\oint\vec A\cdot d\vec l$` is invariant.
- Coulomb gauge `$\nabla\cdot\vec A = 0$`: instantaneous `$V$`, transverse current sources `$\vec A$`. Lorenz gauge: `$\Box^2V = -\rho/\epsilon_0$`, `$\Box^2\vec A = -\mu_0\vec J$`; residual `$\Box^2\lambda = 0$`. Temporal: `$V = 0$`.
- Retarded potentials use `$t_r = t - \mathscr r/c$`; fields need extra `$\dot\rho$`, `$\dot{\vec J}$` terms (Jefimenko).
- Switched-on wire: `$A_z = \tfrac{\mu_0I_0}{2\pi}\ln\tfrac{ct + \sqrt{c^2t^2 - s^2}}{s}$`, `$B = \tfrac{\mu_0I_0}{2\pi s}\tfrac{ct}{\sqrt{c^2t^2 - s^2}}$`, `$|E| = \tfrac{\mu_0I_0c}{2\pi\sqrt{c^2t^2 - s^2}}$`.
- Liénard-Wiechert `$V = q/4\pi\epsilon_0(\mathscr r - \vec{\mathscr r}\cdot\vec v/c)$`, `$\vec A = \vec vV/c^2$`. Uniform motion `$V = q/4\pi\epsilon_0d\sqrt{1 - \beta^2\sin^2\theta}$`.
- `$L = \tfrac12mv^2 - qV + q\vec v\cdot\vec A$`, `$\vec p = m\vec v + q\vec A$`; `$\psi \to e^{iq\lambda/\hbar}\psi$`. Aharonov-Bohm `$\Delta\phi = q\Phi/\hbar$`, one fringe per `$h/e$`.

</div>

## Practise: exam questions on this lesson

Warm-up to top-rank, each with a full solution. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="potentials-gauges" data-exam="gate" data-n="10"></div>

**Next:** the potentials of this lesson lead directly to electromagnetic waves in matter and to radiation from accelerated charges, later in this module. Back to [fields in matter](/learn/courses/gate-physics/fields-in-matter/), or see a plane wave's fields in 3D with [EM wave 3D](/learn/em-wave-3d/).
