---
title: 'Electromagnetic induction'
seoTitle: 'Electromagnetic induction: JEE and NEET physics'
summary: 'Magnetic flux, Faraday''s law and Lenz''s law, motional emf in sliding and rotating rods, terminal speed, induced electric fields, eddy currents, self and mutual inductance, energy in an inductor, LR growth and decay, and the AC generator, up to JEE Advanced rail problems.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A magnet is dropped through a long vertical copper pipe. Compared with free fall, it falls:'
    choices: ['faster', 'at the same rate', 'more slowly, reaching a steady speed', 'and stops halfway']
    ans: 2
    why: 'The moving magnet induces eddy currents in the pipe; by Lenz''s law they oppose its motion. The drag grows with speed until it balances gravity.'
  - q: 'A rod of length l rotates at angular speed ω about one end, in a field B along the axis of rotation. The emf between its ends is:'
    choices: ['Blω', '½Bl²ω', 'Bl²ω', 'zero']
    ans: 1
    why: 'Each piece dr at radius r moves at ωr and gives B(ωr)dr. Adding from 0 to l gives ½Bωl².'
  - q: 'The energy stored in an inductor L carrying current I is:'
    choices: ['LI', '½LI²', 'LI²', '½L²I']
    ans: 1
    why: 'Building up the current against the back emf L dI/dt takes work ∫LI dI = ½LI². It is stored in the magnetic field.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Electromagnetic induction'
  - 'Vacuum magnetic permeability μ₀, CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to find the induced emf and current in any changing-flux or moving-conductor set-up, give their directions, and solve inductor circuits and rail problems.

<div class="bigidea">Whenever the magnetic flux through a circuit changes, nature makes an emf that tries to undo the change. Faraday's law gives its size, Lenz's law its direction, and energy conservation explains both: the work you do against the opposition is what becomes electrical energy.</div>

## 1. Flux, Faraday and Lenz

**Magnetic flux** through a flat area A is `$\Phi = BA\cos\theta$` (weber, Wb = T m²), θ being the angle between B and the area's normal. For N turns, the flux linkage is NΦ.

```math
\varepsilon = -N\frac{d\Phi}{dt}
```

The flux can change because B changes, the area changes, or the angle changes. **Lenz's law** (the minus sign): the induced current flows so that its own field opposes the change of flux. Push a magnet's N pole towards a coil and the near face of the coil becomes an N pole, pushing back; pull it away and the near face becomes S, pulling back.

<div class="myth">

**"The induced field always points opposite to the magnet's field."** It opposes the **change**, not the field. When the flux is decreasing, the induced field points the **same** way as the original, trying to keep the flux up.

</div>

**Charge that flows** does not depend on how fast the change happens: `$q = \dfrac{N\,\Delta\Phi}{R}$`.

<div class="problem" data-problem="emi-charge"></div>

Step through Lenz's law, or drag the magnet height yourself. Read the direction of the induced current and the pole it makes.

<div class="steps" data-fig="@em-lenz-steps">
<div class="step">Far above the coil: nothing changes, no current.</div>
<div class="step">The magnet approaches: the downward flux through the coil is growing.</div>
<div class="step">Lenz: the induced current makes a field pointing up, to oppose the growth.</div>
<div class="step">That field gives the coil's top face a north pole, which repels the approaching magnet.</div>
<div class="step">The magnet leaves: flux shrinks, the current reverses, the lower face becomes north and pulls the magnet back.</div>
</div>

Drop the magnet through the closed coil, then through the open coil. Compare how long it takes and look at the two EMF peaks.

<figure class="fig" data-fig="@em-lenz-fall"><figcaption>The EMF changes sign as the magnet passes through, with a bigger second peak. With the coil closed the induced current brakes the magnet; open, it does not.</figcaption></figure>

## 2. Motional emf

A rod of length l moving at speed v across a field B has an emf `$\varepsilon = Blv$` between its ends. The magnetic force on its free electrons (qv × B) pushes them to one end until an electric field balances it. In general `$\varepsilon = (\vec v \times \vec B)\cdot\vec l$`: only the parts of v, B and l that are mutually perpendicular count.

| Set-up | emf |
|---|---|
| Rod sliding on rails | Blv |
| Rod rotating about one end | `$\tfrac12 B\omega l^2$` |
| Rod rotating about its middle | zero between its ends |
| Disc of radius R spinning (centre to rim) | `$\tfrac12 B\omega R^2$` |
| Coil of N turns, area A, rotating | `$NBA\omega\sin\omega t$` |

Change N, B and the turning rate. Watch flux (cosine) and EMF (sine) as the coil turns; drag the picture to look from other angles.

<figure class="fig" data-fig="@em-generator"><figcaption>The EMF is largest when the coil is edge-on to B and zero when face-on, a quarter-turn out of step with the flux.</figcaption></figure>

## 3. Rods on rails and terminal speed

Close the circuit with a resistor R and a current `$I = Blv/R$` flows. The field now pushes on the current with `$F = BIl = \dfrac{B^2l^2v}{R}$`, against the motion. Pull the rod with a steady force F and watch it settle.

<figure class="fig" data-fig="rod-terminal"><figcaption>A rod pulled along rails by a constant force. The induced current makes a backward force that grows with speed, so the rod approaches a terminal speed FR/(B²l²) exponentially, with time constant mR/(B²l²).</figcaption></figure>

<div class="problem" data-problem="emi-terminal"></div>

If instead the rod is given a push and left, `$m\dfrac{dv}{dt} = -\dfrac{B^2l^2}{R}v$`: the speed dies away as `$v_0e^{-t/\tau}$` and it stops after a distance `$\dfrac{mv_0R}{B^2l^2}$`, all its kinetic energy turned into heat. A rod falling on vertical rails reaches `$v_t = \dfrac{mgR}{B^2l^2}$`.

## 4. Induced electric fields and eddy currents

A changing B makes an electric field that circles round, even in empty space: `$\oint \vec E\cdot d\vec l = -\dfrac{d\Phi}{dt}$`. Inside a long solenoid whose field changes at dB/dt, at radius r: `$E = \dfrac{r}{2}\dfrac{dB}{dt}$` (inside), `$E = \dfrac{R^2}{2r}\dfrac{dB}{dt}$` (outside). This field is not conservative: it has no potential.

**Eddy currents** are induced loops in solid metal. They brake (magnetic braking in trains, damping in galvanometers), heat (induction cooktops) and waste energy in transformer cores, which is why cores are made of thin insulated sheets (laminations).

## 5. Self and mutual inductance

A coil's own changing current changes its own flux: `$N\Phi = LI$` and `$\varepsilon = -L\dfrac{dI}{dt}$`. The self-inductance L (henry, H) is a kind of electrical inertia: it resists changes in current.

- Long solenoid: `$L = \mu_0 n^2 A l = \dfrac{\mu_0 N^2A}{l}$`, times μ_r for a core.
- **Mutual inductance:** `$N_2\Phi_2 = MI_1$`, `$\varepsilon_2 = -M\dfrac{dI_1}{dt}$`. For two solenoids, one wound on the other: `$M = \mu_0 n_1 n_2 A l$`. In general `$M = k\sqrt{L_1L_2}$`, with coupling factor k ≤ 1.
- **Energy:** `$U = \tfrac12 LI^2$`, with energy density `$u = \dfrac{B^2}{2\mu_0}$` in the field.

<div class="meaning">
<dl>
<dt>Φ</dt><dd>magnetic flux through one turn (Wb)</dd>
<dt>L</dt><dd>self-inductance (H = Wb/A = V s/A)</dd>
<dt>M</dt><dd>mutual inductance, the same either way: M₁₂ = M₂₁</dd>
<dt>τ = L/R</dt><dd>time constant of an LR circuit, the time to reach 63% of the final current</dd>
<dt>Physical meaning</dt><dd>An inductor is to current what mass is to velocity: it lets current change only gradually, and it stores energy ½LI² as a moving mass stores ½mv².</dd>
</dl>
</div>

## 6. LR circuits

Switch on a battery E across L and R in series: `$I = \dfrac ER\left(1 - e^{-t/\tau}\right)$`, τ = L/R. Just after switching on, the inductor acts like a **broken wire** (no current yet); long after, like a **plain wire**. Remove the battery (short the circuit): `$I = I_0e^{-t/\tau}$`. Opening a switch suddenly makes dI/dt huge, so a large emf appears and can spark.

<div class="problem" data-problem="emi-lr"></div>

**AC generator.** A coil turning at ω in a field B gives `$\varepsilon = NBA\omega\sin\omega t$`, peak `$\varepsilon_0 = NBA\omega$`. The emf is largest when the plane of the coil is **along** B (flux zero but changing fastest) and zero when the plane is perpendicular to B (flux largest).

**Worked example (level 4).** A metal disc of radius 20 cm spins at 50 revolutions per second with its axis along a 0.5 T field. emf from axle to rim = ½ × 0.5 × (2π × 50) × 0.2² ≈ **3.14 V**.

<div class="keypoints">

- Φ = BA cos θ; ε = −N dΦ/dt; Lenz: the current opposes the change.
- Charge through a coil q = NΔΦ/R, independent of speed.
- Rod Blv; rotating rod ½Bωl²; disc ½BωR²; coil NBAω sin ωt.
- Rails with R: force B²l²v/R; terminal speed FR/(B²l²) or mgR/(B²l²); τ = mR/(B²l²).
- Induced E inside a solenoid (r/2) dB/dt; it is non-conservative. Eddy currents brake and heat.
- L = μ₀n²Al; M = μ₀n₁n₂Al ≤ √(L₁L₂); U = ½LI², u = B²/2μ₀.
- LR: I = (E/R)(1 − e^(−Rt/L)); inductor is an open circuit at t = 0, a wire at t = ∞.

</div>
