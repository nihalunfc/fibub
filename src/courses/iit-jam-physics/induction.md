---
title: Electromagnetic induction and inductance
seoTitle: Faraday's law and inductance for IIT JAM Physics
summary: 'Faraday''s and Lenz''s laws, motional EMF in rods, rotating rods and generators, the induced electric field of a changing B, self and mutual inductance, RL growth and decay, magnetic energy, and the rod-on-rails problems that examiners vary endlessly.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A magnet is held still inside a coil. What EMF is induced?
    choices: ['None', 'A steady EMF', 'An EMF that grows with time', 'It depends on the strength of the magnet']
    ans: 0
    why: Faraday's law needs a changing flux. A strong but steady field gives no EMF, however close the magnet is.
  - q: A coil is flipped through 180° in a uniform field. By how much does the flux through it change?
    choices: ['Twice BA', 'BA', 'Zero', 'Half of BA']
    ans: 0
    why: The flux goes from +BA to −BA, a change of 2BA. Using BA is the usual mistake, and it halves the charge that flows.
  - q: An inductor's current decays as I₀e^(−t/τ). When has its stored energy halved?
    choices: ['At t = τ ln2 / 2', 'At t = τ ln2', 'At t = τ', 'At t = 2τ']
    ans: 0
    why: Energy is ½LI², so it decays as e^(−2t/τ), twice as fast as the current. It halves at τ ln2 / 2; the current halves at τ ln2.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 7: electrodynamics'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 7'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapter 38'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to find the EMF from a changing flux or from motion, get its direction from Lenz's law without guessing, work out the induced electric field round a solenoid, compute self and mutual inductances, solve RL circuits and their energy, and handle every variant of the rod on rails.

<div class="bigidea">Whenever the magnetic flux through a loop changes, for any reason, an EMF appears round the loop, and it always pushes current the way that fights the change.</div>

## 1. Faraday's law

The magnetic flux through a loop is `$\Phi = \int\vec B\cdot d\vec a$` (in webers, T m²). Faraday found that an EMF appears round the loop whenever `$\Phi$` changes:

```math
\mathcal E = -\frac{d\Phi}{dt}, \qquad \text{for } N \text{ turns: } \mathcal E = -N\frac{d\Phi}{dt}
```

The flux can change because `$B$` changes, because the loop's area changes, or because the loop turns. Faraday's law covers all three.

**Worked example.** 200 turns of area 0.010 m² in 0.50 T; the field falls to zero in 0.10 s. `$|\mathcal E| = N\Delta\Phi/\Delta t = 200\times0.0050/0.10 = 10$` V.

**Charge does not care about speed.** The charge that flows is `$Q = \int I\,dt = N\Delta\Phi/R$`, whatever the rate. Flip a coil through `$180^\circ$` and `$\Delta\Phi = 2BA$`: a fast flip gives a big current for a short time, a slow flip a small one for longer, and the same charge.

<div class="meaning">

<dl>
<dt>Φ</dt><dd>how much magnetic field threads the loop (field × area × cos angle)</dd>
<dt>dΦ/dt</dt><dd>how fast that threading changes, for any reason</dd>
<dt>ℰ</dt><dd>the push round the loop, in volts: the work done per coulomb taken once round</dd>
<dt>minus sign</dt><dd>Lenz's law: the induced current makes a flux that opposes the change</dd>
<dt>Physical meaning</dt><dd>Nature resists changes in magnetic flux. Push a magnet in, the coil pushes back; pull it out, the coil pulls back. That resistance is what generators turn into electrical energy.</dd>
</dl>

</div>

## 2. Lenz's law: getting the direction

Never guess the direction. Use three steps: (1) which way does the flux through the loop point, and is it growing or shrinking? (2) the induced current makes its own field **against the change** (opposite to the flux if it is growing, along it if it is shrinking); (3) the right-hand rule turns that field into a current direction.

Watch it in the figure. The coil's face nearest the approaching pole becomes the same pole and pushes back; as the magnet leaves, the current reverses and pulls it back. Stop the magnet and everything stops, however strong the field.

<figure class="fig" data-fig="induction-magnet"><figcaption>A magnet moving along a coil's axis. The graph shows the flux and the EMF, which is minus its slope: biggest where the flux changes fastest, zero when the magnet is centred or still.</figcaption></figure>

<div class="myth">

**"The induced current opposes the magnetic field."** It opposes the *change* in flux. If the flux through a loop is falling, the induced current flows so as to keep it up, making a field in the same direction as the original one. A falling magnet is slowed both while it approaches a ring and while it leaves it.

</div>

## 3. Motional EMF

A rod of length `$L$` moving at `$v$` through a field `$B$` (all three perpendicular): each charge in it feels `$qvB$` along the rod, which is an EMF

```math
\mathcal E = BLv
```

This is Faraday's law again: as the rod slides on rails, the circuit's area grows at `$Lv$` per second. Variants worth knowing:

- **Rod spinning about one end** at `$\omega$`: a piece at radius `$r$` moves at `$\omega r$`, so `$\mathcal E = \int_0^LB\omega r\,dr = \tfrac12B\omega L^2$` (average speed `$\tfrac12\omega L$`). About its midpoint the two halves cancel between the ends.
- **Generator coil** of `$N$` turns, area `$A$`, spinning at `$\omega$`: `$\Phi = NBA\cos\omega t$`, so `$\mathcal E = NBA\omega\sin\omega t$`, peak `$NBA\omega$`, rms peak/`$\sqrt2$`.
- **Loop moving away from a long wire**: only the two sides parallel to the wire count, and they oppose: `$\mathcal E = \dfrac{\mu_0Iav}{2\pi}\left(\dfrac1s - \dfrac1{s+b}\right)$`.

**Worked example.** A 1.0 m rod spins at 10 rev/s in 0.20 T: `$\omega = 62.8$` rad/s and `$\mathcal E = \tfrac12(0.20)(62.8)(1.0)^2 \approx 6.28$` V. Using the tip speed for the whole rod doubles it.

## 4. Rods on rails

This one setup produces dozens of exam questions. A rod (mass `$m$`, length `$L$`) on frictionless rails closed by a resistor `$R$`, in a field `$B$` perpendicular to the rails:

<div class="steps">
<div class="step"><p><b>EMF and current.</b> At speed v, ℰ = BLv and I = BLv/R.</p></div>
<div class="step"><p><b>The brake.</b> The current in the rod feels BIL = B²L²v/R, always against the motion (Lenz).</p></div>
<div class="step"><p><b>Pulled by a constant force F.</b> Speed rises to a terminal value where B²L²v/R = F: v<sub>t</sub> = FR/(B²L²). Then all the work done by F becomes heat in R.</p></div>
<div class="step"><p><b>Given a kick v₀ and left alone.</b> m dv/dt = −B²L²v/R: v decays exponentially in time, but dv/dx = −B²L²/(mR) is constant, so v falls linearly with distance and the rod stops after x = mv₀R/(B²L²).</p></div>
<div class="step"><p><b>A capacitor instead of the resistor.</b> I = C d(BLv)/dt = CBLa, so F − CB²L²a = ma: constant acceleration F/(m + CB²L²). The capacitor acts like extra mass.</p></div>
</div>

<div class="problem" data-problem="rails-terminal"></div>

## 5. The induced electric field

When `$B$` changes in time, Faraday's law holds even with no wire present: there is a real electric field circling the changing flux,

```math
\oint\vec E\cdot d\vec l = -\frac{d\Phi}{dt}, \qquad \nabla\times\vec E = -\frac{\partial\vec B}{\partial t}
```

This field is **not conservative** (its curl is not zero), so it cannot be written as `$-\nabla V$`, and the idea of "voltage between two points" becomes path-dependent.

**Worked example: a solenoid** of radius `$R$` with `$dB/dt$` inside. A circle of radius `$r$` gives `$E\cdot2\pi r = \pi r^2\,dB/dt$` inside, so `$E = \dfrac r2\dfrac{dB}{dt}$`; outside it links all the flux, so `$E = \dfrac{R^2}{2r}\dfrac{dB}{dt}$`. The field outside is not zero even though `$B$` is. A **betatron** uses this field to accelerate electrons; keeping them on a fixed circle needs the field at the orbit to be half the average field inside it.

## 6. Inductance

A current `$I$` in a coil makes a flux through itself proportional to `$I$`: `$N\Phi = LI$`. A changing current then induces a back-EMF `$-L\,dI/dt$`. Similarly a current in coil 1 threads coil 2: `$N_2\Phi_2 = MI_1$`, and remarkably `$M_{12} = M_{21}$` always.

| Shape | Inductance |
|---|---|
| Long solenoid, `$N$` turns, length `$l$`, area `$A$` | `$L = \mu_0N^2A/l$` |
| Toroid, rectangular section `$a$` to `$b$`, height `$h$` | `$L = \dfrac{\mu_0N^2h}{2\pi}\ln\dfrac ba$` |
| Coaxial cable, per metre | `$\dfrac{\mu_0}{2\pi}\ln\dfrac ba$` |
| Coaxial solenoids (inner radius `$r_1$`) | `$M = \mu_0n_1n_2\pi r_1^2l$` |
| Long wire and coplanar rectangle | `$M = \dfrac{\mu_0a}{2\pi}\ln\dfrac{d+b}{d}$` |

**Trick: compute M the easy way round.** For a small loop near a big one, send the current through the big loop (whose field you know) and find the flux through the small one; `$M_{12} = M_{21}$` then gives you the hard direction for free.

**Coupled coils.** `$M = k\sqrt{L_1L_2}$` with `$0\le k\le1$`. In series, `$L = L_1 + L_2 \pm 2M$` (plus if the fluxes add). With 4 mH and 9 mH, `$M$` can never exceed 6 mH.

## 7. RL circuits and magnetic energy

Connect a battery `$V$` to `$R$` and `$L$` in series at `$t = 0$`:

```math
I(t) = \frac VR\left(1 - e^{-t/\tau}\right), \qquad \tau = \frac LR
```

After one time constant the current is 63% of its final value. Short the battery out and it decays as `$I_0e^{-t/\tau}$`.

The energy needed to set up the current is stored in the magnetic field:

```math
U = \tfrac12LI^2, \qquad u = \frac{B^2}{2\mu_0}\ \text{per unit volume}
```

**Worked example.** A 0.50 H coil carrying 2.0 A discharges through 5.0 Ω. `$\tau = 0.10$` s. The energy, `$\propto I^2$`, falls as `$e^{-2t/\tau}$`, so it halves at `$\tau\ln2/2 = 34.7$` ms, not at 69.3 ms. In total `$\tfrac12LI_0^2 = 1.0$` J becomes heat. The [capacitor inductor calculator](/science/capacitor-inductor-calculator/) gives RL time constants and the inductance of solenoids, toroids and cables.

For two coils, `$U = \tfrac12L_1I_1^2 + \tfrac12L_2I_2^2 + MI_1I_2$`; asking that this is never negative is exactly the condition `$M^2\le L_1L_2$`.

<div class="keypoints">

- `$\mathcal E = -N\,d\Phi/dt$`, whatever changes the flux. Charge through a circuit `$= N\Delta\Phi/R$`; a flip changes the flux by `$2BA$`.
- Lenz: the induced current opposes the change in flux (not the flux). Always slows relative motion.
- Motional EMF `$BLv$`; spinning rod `$\tfrac12B\omega L^2$`; generator peak `$NBA\omega$`.
- Rails: terminal speed `$FR/B^2L^2$`; coasting rod stops in `$mv_0R/B^2L^2$` (speed linear in distance); with a capacitor, constant acceleration `$F/(m + CB^2L^2)$`.
- `$\nabla\times\vec E = -\partial\vec B/\partial t$`: round a solenoid `$E = \tfrac r2\dot B$` inside, `$\tfrac{R^2}{2r}\dot B$` outside.
- `$L = \mu_0N^2A/l$`, `$M = k\sqrt{L_1L_2}$`, series `$L_1 + L_2\pm2M$`. RL: `$\tau = L/R$`; energy `$\tfrac12LI^2$`, `$B^2/2\mu_0$` per volume.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [induction practice page](/learn/courses/iit-jam-physics/practice/induction/).

<div class="qbank" data-bank="physics" data-topics="induction" data-exam="jam" data-n="10"></div>

**Next:** [lesson 4.8](/learn/courses/iit-jam-physics/circuits/) builds on inductance for DC transients and AC circuits, and [lesson 4.9](/learn/courses/iit-jam-physics/maxwell-em-waves/) adds the displacement current to complete Maxwell's equations. The fields that change here were made by the currents of [magnetic fields: Biot-Savart and Ampère](/learn/courses/iit-jam-physics/magnetostatics/). For [potentials, gauges](/learn/courses/gate-physics/potentials-gauges/) and [electromagnetic waves](/learn/courses/gate-physics/em-waves-media/) at MSc level, see the GATE Physics course.
