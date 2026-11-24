---
title: Electrodynamics and relativity
seoTitle: Covariant electrodynamics | GATE Physics
summary: 'The four-current and four-potential, continuity and the Lorenz gauge in covariant form, the field tensor and Maxwell''s equations in two lines, the invariants E·B and E² − c²B², Lorentz transformation of E and B, crossed fields and E×B drift, the field of a uniformly moving charge, magnetism as a relativistic effect, the covariant Lorentz force and Lagrangian, and plane waves seen from moving frames.'
minutes: 60
updated: 2026-11-24
quiz:
  - q: "In one frame there is a pure electric field. Can another inertial observer see a magnetic field?"
    choices: ['Yes: B′ = −γ v × E/c² for the perpendicular part', 'No: a pure E field stays pure in every frame', 'Only if E is parallel to the motion', 'Only if the observer is accelerating']
    ans: 0
    why: "Perpendicular components mix under a boost: B′⊥ = γ(B − v × E/c²)⊥. Starting from B = 0, a moving observer sees B′ = −γ v × E/c², whenever E has a part perpendicular to v."
  - q: E · B is non-zero in some frame. Is there a frame in which the field is purely magnetic?
    choices: ['No, because E · B is invariant', 'Yes, by boosting along E', 'Yes, by boosting along B', 'Only if E < cB']
    ans: 0
    why: "E · B is the same in every inertial frame. If B were alone somewhere, E · B would be zero there and so everywhere, which contradicts the starting point."
  - q: How is the electric field of a fast charge distributed compared with Coulomb's law?
    choices: ['Stronger by γ sideways, weaker by γ² ahead and behind', 'Stronger by γ² ahead and behind', 'The same in all directions but weaker by γ', 'Exactly Coulomb, centred on the retarded position']
    ans: 0
    why: "E = (q/4πε₀r²)(1 − β²)/(1 − β²sin²θ)^(3/2), measured from the present position: γ times Coulomb at θ = 90°, 1/γ² at θ = 0. The field lines crowd into a pancake."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 12.3'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 11 and 12'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapters 5 and 6'
  - 'L. D. Landau and E. M. Lifshitz, The Classical Theory of Fields, 4th ed. (1975), chapters 3 and 4'
  - 'GATE Physics (PH) syllabus, Electromagnetic Theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** By the end you will be able to write Maxwell's equations in four-vector and tensor form, transform `$\vec E$` and `$\vec B$` between frames, use the two field invariants to decide what any observer can see, analyse crossed fields and drifts, describe the field of a fast charge, explain magnetism as relativistic electricity, and handle the covariant Lorentz force, the charged-particle Lagrangian and plane waves seen from moving frames. Lorentz transformations of space, time, energy and momentum are in the JAM lesson on [special relativity](/learn/courses/iit-jam-physics/special-relativity/).

<div class="bigidea">Electric and magnetic fields are two faces of one object, the field tensor. A boost turns some of one into the other, just as it mixes space and time; only two combinations of them are the same for everyone.</div>

## 1. Four-current, four-potential and covariant Maxwell equations

We use `$x^\mu = (ct, \vec r)$`, metric `$\text{diag}(+1, -1, -1, -1)$` and `$\partial_\mu = (\frac1c\partial_t, \nabla)$`. Charge is a Lorentz scalar, so a charge cloud of rest density `$\rho_0$` and four-velocity `$u^\mu = \gamma(c, \vec v)$` has

```math
J^\mu = \rho_0u^\mu = (c\rho, \vec J), \qquad \partial_\mu J^\mu = \frac{\partial\rho}{\partial t} + \nabla\cdot\vec J = 0
```

so `$\rho = \gamma\rho_0$` and `$\vec J = \gamma\rho_0\vec v$`: moving charge looks denser because its volume contracts. The potentials form `$A^\mu = (\phi/c, \vec A)$`; the **Lorenz gauge** `$\partial_\mu A^\mu = \nabla\cdot\vec A + \frac{1}{c^2}\partial_t\phi = 0$` is Lorentz invariant, and in it

```math
\Box A^\mu = \mu_0J^\mu, \qquad \Box = \frac{1}{c^2}\frac{\partial^2}{\partial t^2} - \nabla^2
```

The fields are the six components of the antisymmetric **field tensor** `$F^{\mu\nu} = \partial^\mu A^\nu - \partial^\nu A^\mu$`: the time-space entries hold `$\pm E_i/c$`, the space-space entries `$\pm B_k$` (signs depend on conventions). All of Maxwell is two lines:

```math
\partial_\mu F^{\mu\nu} = \mu_0J^\nu, \qquad \partial_\lambda F_{\mu\nu} + \partial_\mu F_{\nu\lambda} + \partial_\nu F_{\lambda\mu} = 0
```

The first holds Gauss and Ampère-Maxwell (and implies continuity, since `$\partial_\nu\partial_\mu F^{\mu\nu} = 0$`); the second, satisfied automatically by any potential, holds Faraday and `$\nabla\cdot\vec B = 0$`. Equations between tensors hold in every inertial frame, which is the whole point: electromagnetism was relativistic before Einstein, and it was Newtonian mechanics that had to change.

## 2. How the fields transform

Boost with velocity `$\vec v$` (Lorentz factor `$\gamma$`). Components along `$\vec v$` are unchanged; perpendicular components mix:

```math
\vec E'_\parallel = \vec E_\parallel, \quad \vec B'_\parallel = \vec B_\parallel, \quad \vec E'_\perp = \gamma(\vec E + \vec v\times\vec B)_\perp, \quad \vec B'_\perp = \gamma\left(\vec B - \frac{\vec v\times\vec E}{c^2}\right)_\perp
```

For a boost along `$x$`: `$E'_y = \gamma(E_y - vB_z)$`, `$E'_z = \gamma(E_z + vB_y)$`, `$B'_y = \gamma(B_y + vE_z/c^2)$`, `$B'_z = \gamma(B_z - vE_y/c^2)$`.

**Worked example.** A pure `$E = 3.0\times10^5$` V/m along `$y$`, seen by an observer moving at `$0.6c$` along `$x$`: `$E'_y = 1.25\times3.0\times10^5 = 3.75\times10^5$` V/m and `$B'_z = -\gamma vE/c^2 = -0.75$` mT. A moving capacitor shows the same thing physically: moving parallel to its plates, they contract, their surface charge density rises by `$\gamma$`, and so does the field; moving perpendicular to them, nothing changes.

**The two invariants.** From `$F_{\mu\nu}F^{\mu\nu}$` and `$F_{\mu\nu}\tilde F^{\mu\nu}$`:

```math
E^2 - c^2B^2 \quad\text{and}\quad \vec E\cdot\vec B \quad\text{are the same in every frame}
```

They settle what any observer can see:

- `$\vec E\cdot\vec B \ne 0$`: no frame has pure `$\vec E$` or pure `$\vec B$`, and none has them perpendicular; a boost can make them parallel.
- `$\vec E\cdot\vec B = 0$` and `$E > cB$`: a frame moving at `$c^2B/E$` along `$\vec E\times\vec B$` sees pure `$\vec E$` of size `$\sqrt{E^2 - c^2B^2}$`.
- `$\vec E\cdot\vec B = 0$` and `$E < cB$`: a frame moving at `$E/B$` along `$\vec E\times\vec B$` sees pure `$\vec B$` of size `$\sqrt{B^2 - E^2/c^2}$`.
- Both invariants zero (`$E = cB$`, perpendicular): a **null field**, like a plane wave. Boosts rescale it but never remove either part.

**Crossed fields and drift.** With `$E < cB$`, every charged particle drifts at `$\vec v_d = \vec E\times\vec B/B^2$`, whatever its charge or mass: in the drift frame it only gyrates. Starting from rest it traces a cycloid, with top speed `$2v_d$`. With `$E > cB$` no drift frame exists and particles are accelerated without limit.

<div class="problem" data-problem="ced-boost"></div>

## 3. The field of a uniformly moving charge

In its rest frame the charge has a Coulomb field and no `$\vec B$`. Boosting, and measuring from the charge's **present** position (angle `$\theta$` from `$\vec v$`):

```math
\vec E = \frac{q}{4\pi\epsilon_0}\frac{1 - \beta^2}{(1 - \beta^2\sin^2\theta)^{3/2}}\frac{\hat r}{r^2}, \qquad \vec B = \frac{\vec v\times\vec E}{c^2}
```

The field is still radial from the present position (the retarded positions conspire to point there, because uniform motion is predictable) but it is squashed into a pancake: `$\gamma$` times Coulomb at `$90^\circ$`, `$1/\gamma^2$` times along the motion, a ratio `$\gamma^3$`. At `$\beta = 0.8$` it equals the Coulomb value at `$\theta = 61.4^\circ$`. At low speed `$\vec B = \vec v\times\vec E/c^2$` is Biot-Savart for a point charge.

**Worked example.** A proton at `$0.90c$` passing an atom at 1.0 nm delivers a transverse field `$\gamma\frac{e}{4\pi\epsilon_0b^2} = 2.29\times1.44\times10^9 = 3.3\times10^9$` V/m for about `$b/\gamma v = 1.6$` attoseconds: a short, sharp kick, which is how fast charged particles ionise matter.

<figure class="fig" data-fig="moving-charge-field"><figcaption>Field lines of a charge moving to the right, spaced evenly in its rest frame and squeezed towards the perpendicular plane by length contraction, with the field strength relative to Coulomb against the angle from the velocity.</figcaption></figure>

## 4. Magnetism as relativistic electricity

A neutral wire carries a current; a test charge moves alongside at the electrons' drift speed. In the lab the wire is neutral and the force is magnetic. In the charge's rest frame there is no magnetic force on it (it is at rest), yet it must still be pushed. It is: there the electrons are at rest and less contracted while the ions move and are more contracted, so the wire carries a net line charge and pulls electrically. The two forces agree once forces are transformed between frames.

**Worked example.** An electron at `$10^6$` m/s, 1.0 cm from a wire with 10 A: `$F = ev\frac{\mu_0I}{2\pi r} = 3.2\times10^{-17}$` N, entirely magnetic in the lab, entirely electric in the electron's frame.

The same idea explains why relativistic beams hold together. Two parallel beams of electrons at speed `$v$` repel electrically and attract magnetically; the magnetic attraction is `$v^2/c^2$` of the electric repulsion, so the net is `$1/\gamma^2$` of it: 2% at `$0.99c$`.

<div class="myth">

**"Magnetic fields are something separate from electric fields that some materials happen to make."** A magnetic field is what an electric field looks like to a moving observer (and vice versa). What one observer calls a pure magnetic force, another calls a pure electric force; neither is wrong. Only the invariants `$\vec E\cdot\vec B$` and `$E^2 - c^2B^2$` are observer-independent facts about the field.

</div>

Slide the electron speed and compare the two frames. Count the ions and electrons in each strip.

<figure class="fig" data-fig="@em-magnetism-relativity"><figcaption>In the frame of the test charge the wire is charged (length contraction), so the force is electric. In the lab it is magnetic.</figcaption></figure>

## 5. Covariant dynamics and plane waves

**Lorentz force.** For a particle of four-momentum `$p^\mu$` and proper time `$\tau$`:

```math
\frac{dp^\mu}{d\tau} = qF^{\mu\nu}u_\nu
```

Its space part is `$\frac{d\vec p}{dt} = q(\vec E + \vec v\times\vec B)$` with `$\vec p = \gamma m\vec v$`; its time part is `$\frac{d\mathcal E}{dt} = q\vec E\cdot\vec v$`: only the electric field does work.

**Lagrangian.** `$L = -\frac{mc^2}{\gamma} - q\phi + q\vec v\cdot\vec A$`, whose interaction term is `$-qA_\mu\frac{dx^\mu}{dt}$`. The canonical momentum is `$\vec P = \gamma m\vec v + q\vec A$`. A gauge change `$A_\mu \to A_\mu - \partial_\mu\chi$` adds `$q\frac{d\chi}{dt}$` to `$L$`, a total derivative, so the motion is unchanged while `$\vec P$` shifts; this is why the quantum wavefunction picks up a phase under gauge changes.

**Energy and momentum of the field** live in the symmetric tensor `$T^{\mu\nu}$`: `$T^{00} = u$`, `$T^{0i} = S_i/c$` (so the field's momentum density is `$\vec S/c^2$`), and `$T^{ij}$` is minus the Maxwell stress. `$\partial_\mu T^{\mu\nu} = -F^{\nu\lambda}J_\lambda$` contains Poynting's theorem and momentum balance.

**Plane waves from a moving frame.** For a wave along `$+x$` with `$E_y = cB_z$`, a boost along `$x$` gives `$E'_y = \gamma(1 - \beta)E_y = \sqrt{\frac{1 - \beta}{1 + \beta}}E_y$`, and the same for `$cB'_z$`. Amplitude scales like the Doppler factor, energy density and intensity like its square: chasing a wave at `$0.6c$`, you see a quarter of its energy density. Reflection from a mirror approaching at `$\beta$` shifts the frequency by `$\frac{1 + \beta}{1 - \beta}$` (two Doppler shifts), the principle of radar speed guns.

<div class="meaning">

<dl>
<dt>J^μ = (cρ, J)</dt><dd>four-current; ∂_μJ^μ = 0 is charge conservation</dd>
<dt>A^μ = (φ/c, A)</dt><dd>four-potential; the Lorenz gauge ∂_μA^μ = 0 holds in every frame</dd>
<dt>F^μν</dt><dd>antisymmetric field tensor: E/c in the time-space entries, B in the space-space entries</dd>
<dt>E·B, E² − c²B²</dt><dd>the two invariants: what every observer agrees on</dd>
<dt>Physical meaning</dt><dd>Space and time mix under a boost, so the fields made by charges (time part of J) and by currents (space part) must mix too. Electricity and magnetism are one field described from different states of motion.</dd>
</dl>

</div>

<div class="keypoints">

- `$J^\mu = (c\rho, \vec J) = \rho_0u^\mu$`; `$A^\mu = (\phi/c, \vec A)$`; `$\partial_\mu J^\mu = 0$`; Lorenz gauge `$\partial_\mu A^\mu = 0$`, `$\Box A^\mu = \mu_0J^\mu$`.
- `$F^{\mu\nu} = \partial^\mu A^\nu - \partial^\nu A^\mu$` (6 components); `$\partial_\mu F^{\mu\nu} = \mu_0J^\nu$` (Gauss, Ampère-Maxwell); the Bianchi identity gives Faraday and `$\nabla\cdot\vec B = 0$`.
- `$E_\parallel, B_\parallel$` unchanged; `$\vec E'_\perp = \gamma(\vec E + \vec v\times\vec B)_\perp$`, `$\vec B'_\perp = \gamma(\vec B - \vec v\times\vec E/c^2)_\perp$`.
- Invariants `$\vec E\cdot\vec B$` and `$E^2 - c^2B^2$` decide which field can be removed; drift `$\vec E\times\vec B/B^2$` when `$E < cB$`; cycloid top speed `$2v_d$`.
- Moving charge: `$E \propto \frac{1 - \beta^2}{(1 - \beta^2\sin^2\theta)^{3/2}}$` from the present position; `$\gamma$` sideways, `$1/\gamma^2$` ahead; `$\vec B = \vec v\times\vec E/c^2$`.
- Moving line charge `$\lambda = \gamma\lambda_0$`; parallel beams: net force `$1/\gamma^2$` of the electric part.
- `$dp^\mu/d\tau = qF^{\mu\nu}u_\nu$`; `$L = -mc^2/\gamma - q\phi + q\vec v\cdot\vec A$`, `$\vec P = \gamma m\vec v + q\vec A$`.
- Plane wave: both invariants zero; boost along it scales fields by `$\sqrt{(1 - \beta)/(1 + \beta)}$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [practice page](/learn/courses/gate-physics/practice/covariant-electrodynamics/).

<div class="qbank" data-bank="physics" data-topics="covariant-electrodynamics" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.9, radiation](/learn/courses/gate-physics/radiation/), and the JAM lesson on [special relativity](/learn/courses/iit-jam-physics/special-relativity/). **Next:** [lesson 3.11](/learn/courses/gate-physics/interference-diffraction/) turns to optical physics (interference, diffraction, polarisation and ray matrices). Back to the [GATE Physics course home](/learn/courses/gate-physics/), where [Part C](/learn/courses/gate-physics/postulates-operators/), quantum and statistical physics, follows.
