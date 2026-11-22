---
title: Oscillations and simple harmonic motion
seoTitle: 'Oscillations and SHM: JEE and NEET physics'
summary: 'Periodic motion and the condition for SHM, displacement, velocity and acceleration, phase, energy in SHM, spring-mass systems and spring combinations, the simple and physical pendulum, pendulums in lifts and vehicles, floating bodies and liquids in U-tubes, damped and forced oscillations and resonance.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'In simple harmonic motion, the acceleration is greatest:'
    choices: ['at the centre', 'at the extreme positions', 'halfway out', 'it is constant']
    ans: 1
    why: 'a = −ω²x, so its size is greatest where |x| is greatest: at the ends, where the velocity is zero.'
  - q: 'A spring-mass system has period T. The spring is cut into two equal halves and the same mass hangs from one half. The new period is:'
    choices: ['T/2', 'T/√2', '√2 T', '2T']
    ans: 1
    why: 'Half a spring is twice as stiff (k doubles). T ∝ 1/√k, so T becomes T/√2.'
  - q: 'In SHM with amplitude A, kinetic energy equals potential energy when the displacement is:'
    choices: ['A/2', 'A/√2', 'A/4', 'zero']
    ans: 1
    why: 'PE = ½kx², total = ½kA². Equal shares mean ½kx² = ¼kA², so x = A/√2.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Oscillations'
  - 'Standard gravity g = 9.806 65 m/s² (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 36 minutes.** By the end you will be able to recognise SHM from its force or equation, find amplitude, phase, speed and energy at any point, get the period of springs, pendulums and other oscillators, and explain damping and resonance.

<div class="bigidea">Whenever a body is pulled back towards a resting place with a force proportional to how far it is from it, it swings back and forth in simple harmonic motion. The period depends only on how stiff the pull is compared with how heavy the body is, not on how far it swings.</div>

## 1. Periodic motion and SHM

**Periodic** motion repeats after a fixed time T (the period); frequency f = 1/T, angular frequency ω = 2πf. **Simple harmonic motion** is the special periodic motion where

```math
F = -kx \quad\Longleftrightarrow\quad a = \frac{d^2x}{dt^2} = -\omega^2 x, \qquad \omega = \sqrt{\frac{k}{m}}
```

To test whether something is SHM, get its acceleration in the form a = −(constant) × x. The constant is ω². Its solution is

```math
x = A\sin(\omega t + \phi), \qquad v = A\omega\cos(\omega t + \phi) = \pm\,\omega\sqrt{A^2 - x^2}, \qquad a = -\omega^2 x
```

<div class="meaning">
<dl>
<dt>A</dt><dd>amplitude, the greatest distance from the centre</dd>
<dt>ω</dt><dd>angular frequency (rad/s); T = 2π/ω</dd>
<dt>φ</dt><dd>starting phase: where in the cycle the motion is at t = 0</dd>
<dt>k</dt><dd>force constant: restoring force per metre of displacement</dd>
<dt>Physical meaning</dt><dd>A stiffer pull (larger k) snaps the body back faster; a heavier body (larger m) responds more slowly. The amplitude does not appear in T, because a larger swing also means a larger pull.</dd>
</dl>
</div>

SHM is the shadow of uniform circular motion. Watch the point on the circle and its shadow.

<figure class="fig" data-fig="shm-phasor"><figcaption>A point moving round a circle at ω; its shadow moves in SHM. The graph traces x against t. The bars show kinetic and potential energy swapping while the total stays the same (until you add damping).</figcaption></figure>

- Velocity leads displacement by 90°, and acceleration is 180° out of step with displacement.
- Maximum speed Aω at the centre; maximum acceleration Aω² at the ends.
- `$\sin$` and `$\cos$` of the same ωt are SHM; so is any combination `$a\sin\omega t + b\cos\omega t$` (amplitude √(a² + b²)). But `$\sin^2\omega t$` is SHM at 2ω about a shifted centre, and `$\sin\omega t + \sin 2\omega t$` is periodic but not SHM.

<div class="problem" data-problem="osc-speed-at-x"></div>

**Time in SHM.** From the centre to A/2 takes T/12; from A/2 to A takes T/6. Use the circle: going from x = 0 to x = A/2 means the point turns through 30°, which is 1/12 of a turn.

## 2. Energy in SHM

```math
U = \tfrac12 kx^2, \qquad K = \tfrac12 k(A^2 - x^2), \qquad E = K + U = \tfrac12 kA^2 = \tfrac12 m\omega^2A^2
```

K and U each oscillate at **twice** the frequency of x, and each averages E/2 over a cycle. They are equal at x = A/√2.

<div class="myth">

**"A pendulum swinging wider takes longer for each swing."** For small swings, the period does not depend on the amplitude: a wider swing moves faster. Only for large angles (beyond about 15°) does the period grow a little.

</div>

## 3. Springs

A mass m on a spring of constant k: `$T = 2\pi\sqrt{m/k}$`, horizontal or vertical (hanging only shifts the centre by mg/k).

- **Series:** `$\dfrac1k = \dfrac1{k_1} + \dfrac1{k_2}$`. **Parallel** (or one spring on each side of the block): `$k = k_1 + k_2$`.
- **Cutting:** a spring cut into a piece of fraction f of its length has stiffness k/f.
- **Two bodies on a spring** (masses m₁ and m₂, free): use the reduced mass `$\mu = \dfrac{m_1m_2}{m_1 + m_2}$`, `$T = 2\pi\sqrt{\mu/k}$`.
- **Massive spring** of mass m_s: add m_s/3 to the hanging mass.

<div class="problem" data-problem="osc-springs"></div>

## 4. Pendulums

**Simple pendulum** (small angles): `$T = 2\pi\sqrt{L/g}$`, independent of the bob's mass. A **seconds pendulum** (T = 2 s) is about 0.99 m long.

**In an accelerating frame**, replace g by the effective gravity `$\vec g_{eff} = \vec g - \vec a$`:

| Situation | g_eff |
|---|---|
| Lift accelerating up at a | g + a (faster swings) |
| Lift accelerating down at a | g − a; in free fall the pendulum stops swinging |
| Car accelerating horizontally at a | `$\sqrt{g^2 + a^2}$`, and the pendulum hangs tilted |
| Bob of density ρ in a liquid of density σ | `$g(1 - \sigma/\rho)$` |

<div class="problem" data-problem="osc-pendulum-lift"></div>

**Physical (compound) pendulum:** a rigid body swinging about a pivot a distance d from its centre of mass, `$T = 2\pi\sqrt{\dfrac{I}{mgd}}$`, where I is about the pivot. A rod of length L pivoted at one end: `$T = 2\pi\sqrt{2L/3g}$`.

**Very long pendulum** (length comparable to the Earth's radius R): `$T = 2\pi\sqrt{\dfrac{1}{g(1/L + 1/R)}}$`, which never exceeds 84.6 min.

## 5. Other SHM systems

- **Floating body** (a block of height h floating with depth d under): pushed down and released, `$T = 2\pi\sqrt{d/g}$`.
- **Liquid in a U-tube** with total liquid length L: `$T = 2\pi\sqrt{L/2g}$`.
- **Tunnel through a uniform Earth:** gravity inside is ∝ distance from the centre, so it is SHM with `$T = 2\pi\sqrt{R/g}$` ≈ 84.6 min, for any straight tunnel.
- **Torsional pendulum:** `$T = 2\pi\sqrt{I/C}$`, with C the twisting couple per radian.

## 6. Damped and forced oscillations

With a drag force −bv, the amplitude shrinks: `$A(t) = A_0e^{-bt/2m}$`, and the energy shrinks twice as fast, `$E \propto e^{-bt/m}$`. The period becomes a little longer.

A **forced** oscillator driven at frequency ω_d settles into motion at ω_d (not its own frequency). Its amplitude is largest when ω_d is close to its natural frequency: **resonance**. Less damping makes the resonance peak taller and sharper. Soldiers break step on bridges, and a radio is tuned, because of resonance.

<div class="myth">

**"A forced oscillator vibrates at its own natural frequency."** Once settled, it follows the driver's frequency. The natural frequency only decides how large the response is.

</div>

**Worked example (level 4).** A block on a spring (k = 400 N/m, m = 1 kg) oscillates with amplitude 5 cm. A 3 kg lump of clay is dropped on it and sticks just as it passes the centre. New amplitude? Speed at the centre before: Aω = 0.05 × 20 = 1 m/s. Momentum: 1 × 1 = 4V, so V = 0.25 m/s. New ω = √(400/4) = 10 rad/s, so **A' = V/ω' = 2.5 cm**. (Dropped at an end instead, the speed there is zero and A stays 5 cm.)

<div class="keypoints">

- SHM: a = −ω²x; x = A sin(ωt + φ), v = ω√(A² − x²), a_max = Aω².
- T = 2π/ω and does not depend on amplitude.
- E = ½kA²; K = U at x = A/√2; K and U oscillate at 2ω.
- Spring: T = 2π√(m/k); series 1/k adds, parallel k adds; half a spring is twice as stiff; two bodies use μ.
- Pendulum: T = 2π√(L/g_eff); physical pendulum 2π√(I/mgd).
- Floating body 2π√(d/g), U-tube 2π√(L/2g), Earth tunnel 84.6 min.
- Damping: A ∝ e^(−bt/2m); forced oscillation at the driver's frequency; resonance when they match.

</div>
