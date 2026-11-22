---
title: 'Moving charges and magnetic fields'
seoTitle: 'Moving charges and magnetism: JEE and NEET physics'
summary: 'The magnetic force on a moving charge, circular and helical paths, crossed fields, the cyclotron, the Biot-Savart law for wires, arcs and loops, Ampère''s law for wires, solenoids and toroids, forces on currents and between wires, torque on a loop and the moving coil galvanometer.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A charged particle moves in a uniform magnetic field. The magnetic force on it:'
    choices: ['changes its speed', 'does no work', 'is along its velocity', 'is zero only when it is at rest']
    ans: 1
    why: 'F = qv × B is always at right angles to v, so it does no work and the speed never changes. It is also zero when v is parallel to B.'
  - q: 'Two long parallel wires carry currents in the same direction. They:'
    choices: ['attract', 'repel', 'feel no force', 'twist']
    ans: 0
    why: 'Each wire sits in the other''s field; F = IL × B points towards the other wire. Like currents attract (the opposite of like charges).'
  - q: 'The time period of a charged particle in a cyclotron depends on:'
    choices: ['its speed', 'the radius of its path', 'its charge-to-mass ratio and B', 'the accelerating voltage']
    ans: 2
    why: 'T = 2πm/(qB). Faster particles move in larger circles and take the same time, which is why a fixed-frequency AC supply works.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Magnetic effects of current'
  - 'Vacuum magnetic permeability μ₀ = 1.256 637 061 27 × 10⁻⁶ N/A² (about 4π × 10⁻⁷), CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to predict the path of a charge in a magnetic field, find the field of wires, loops and coils, and work out forces and torques on currents.

<div class="bigidea">Magnetic fields push only on moving charges, and always sideways. A sideways push cannot speed a charge up; it can only bend its path into a circle. Currents are moving charges, so currents make fields and feel forces, and that is how every motor and meter works.</div>

## 1. The magnetic force on a moving charge

```math
\vec F = q\,\vec v \times \vec B, \qquad F = qvB\sin\theta
```

The force is perpendicular to both v and B (right-hand rule; reverse it for negative charges). It is zero for a charge at rest or moving along B. With an electric field too, the **Lorentz force** is `$\vec F = q(\vec E + \vec v \times \vec B)$`.

<div class="meaning">
<dl>
<dt>B</dt><dd>magnetic field (tesla, T); 1 T = 1 N/(A m); 1 gauss = 10⁻⁴ T</dd>
<dt>θ</dt><dd>angle between the velocity and the field</dd>
<dt>μ₀</dt><dd>permeability of free space, 4π × 10⁻⁷ T m/A</dd>
<dt>Physical meaning</dt><dd>The force bends the path but never changes the speed, so the kinetic energy of a charge in a pure magnetic field stays constant.</dd>
</dl>
</div>

## 2. Circles, helices and the cyclotron

A charge moving at right angles to a uniform B goes round a circle, with the magnetic force as the centripetal force:

```math
r = \frac{mv}{qB} = \frac{p}{qB} = \frac{\sqrt{2mK}}{qB}, \qquad T = \frac{2\pi m}{qB}, \qquad f = \frac{qB}{2\pi m}
```

Compare particles accelerated through the same voltage below.

<figure class="fig" data-fig="bfield-orbit"><figcaption>Proton, deuteron, alpha particle and electron, all accelerated through the same voltage, entering a field into the screen. The deuteron and the alpha take the same circle, since r ∝ √(m/q). The electron curls the other way in a tiny circle.</figcaption></figure>

<div class="problem" data-problem="mc-radius"></div>

If v makes an angle θ with B, split it: `$v\sin\theta$` makes the circle (radius `$mv\sin\theta/qB$`), `$v\cos\theta$` carries it along B. The path is a **helix** with pitch `$p = v\cos\theta \cdot T = \dfrac{2\pi m v\cos\theta}{qB}$`.

**Crossed fields.** With E perpendicular to B, a charge with `$v = E/B$` goes straight through, whatever its charge: a **velocity selector**. A **mass spectrometer** follows it with a pure B, where r ∝ m sorts the masses.

**Cyclotron.** Two D-shaped boxes in a field B, with an AC voltage across the gap at the cyclotron frequency qB/(2πm). The particle gains energy each half-turn in the gap, its radius grows, and it leaves at the rim radius R with `$K_{\max} = \dfrac{q^2B^2R^2}{2m}$`. It cannot speed electrons much, because their mass grows with speed (relativity) and they fall out of step.

Change the angle between the velocity and B. At 90° the path is a circle; at any other angle it is a helix. Drag to turn the view, and switch to the electron.

<figure class="fig" data-fig="@em-helix-b"><figcaption>Only the component across B turns; the component along B carries on, so the path winds along the field. The period does not depend on speed.</figcaption></figure>

Release the charge from rest, then set its start speed to E/B and see it go straight. Flip the sign of the charge.

<figure class="fig" data-fig="@em-crossed-eb"><figcaption>A cycloid drifts at E/B whatever the charge. A start speed of exactly E/B passes straight through: that is a velocity selector.</figcaption></figure>

Change B, the dee radius and the gap voltage. Watch the proton spiral outwards, getting a push at every gap crossing.

<figure class="fig" data-fig="@em-cyclotron"><figcaption>The time per half-turn stays the same as the circles grow, so a fixed frequency keeps pushing it. Final energy depends on B and R, not on the gap voltage.</figcaption></figure>

## 3. Biot-Savart law: fields of currents

A small piece dl of a wire with current I makes a field `$dB = \dfrac{\mu_0}{4\pi}\,\dfrac{I\,dl\sin\theta}{r^2}$`, circling the wire. Adding up the pieces gives:

| Current | Field |
|---|---|
| Long straight wire, distance d | `$\dfrac{\mu_0 I}{2\pi d}$` |
| Finite wire, angles φ₁, φ₂ from the perpendicular | `$\dfrac{\mu_0 I}{4\pi d}(\sin\varphi_1 + \sin\varphi_2)$` |
| Centre of a circular loop, N turns | `$\dfrac{\mu_0 NI}{2R}$` |
| Arc of angle θ (radians), at its centre | `$\dfrac{\mu_0 I\theta}{4\pi R}$` |
| Axis of a loop, distance x | `$\dfrac{\mu_0 IR^2}{2(R^2 + x^2)^{3/2}}$` |

The straight-wire field lines are circles round the wire (curl your right hand's fingers with the thumb along I). Far along its axis, a loop's field falls as 1/x³: a loop is a **magnetic dipole** of moment m = NIA.

Switch between a wire, a loop and a solenoid, reverse the current, and tap the picture to read B. The red end of each needle is its north pole.

<figure class="fig" data-fig="@em-biot-savart"><figcaption>A wire's field circles it; a loop's field threads through it; a solenoid has a nearly uniform field inside and almost none outside.</figcaption></figure>

## 4. Ampère's law: solenoids and toroids

```math
\oint \vec B\cdot d\vec l = \mu_0 I_{\text{enclosed}}
```

Like Gauss's law, it gives B quickly when there is symmetry. Inside a long thick wire of radius R, `$B = \dfrac{\mu_0 I r}{2\pi R^2}$` (rising with r), and outside `$\mu_0 I/2\pi r$`. Inside a long **solenoid** with n turns per metre, `$B = \mu_0 nI$`, uniform, and nearly zero outside; at its ends, half that. Inside a **toroid** of N turns, `$B = \dfrac{\mu_0 NI}{2\pi r}$`, and zero outside and in the hole.

<div class="myth">

**"The field inside a solenoid depends on its radius."** For a long solenoid it does not: B = μ₀nI depends only on turns per metre and current. A fat and a thin solenoid with the same n and I have the same field inside.

</div>

## 5. Forces on currents

A straight wire of length L in a field: `$\vec F = I\vec L \times \vec B$`. A curved wire between two points in a uniform field feels the same force as a straight wire joining those points; a closed loop in a uniform field feels **zero net force**.

Two parallel wires a distance d apart: `$\dfrac FL = \dfrac{\mu_0 I_1 I_2}{2\pi d}$`, attracting for currents in the same direction. The ampere was once defined from this: 2 × 10⁻⁷ N/m between 1 A wires 1 m apart.

<div class="problem" data-problem="mc-wires-force"></div>

## 6. Torque on a loop and the galvanometer

A loop of N turns, area A and current I in a uniform field B feels a torque `$\tau = NIAB\sin\theta = mB\sin\theta$`, where θ is the angle between the loop's normal and B. Its energy is `$U = -mB\cos\theta$`, lowest when m lines up with B.

A **moving coil galvanometer** uses a radial field (so θ = 90° always) and a spring of torsion constant k: `$NIAB = k\phi$`, so the deflection φ is proportional to I. Current sensitivity φ/I = NAB/k; voltage sensitivity φ/V = NAB/(kG). Doubling N doubles the current sensitivity but also doubles G, so the voltage sensitivity stays the same.

<div class="problem" data-problem="mc-shunt"></div>

**Worked example (level 4).** An electron moving at 2 × 10⁶ m/s enters a 1 mT field at 60° to it. Radius `$= \dfrac{9.1\times10^{-31}\times 2\times10^6 \times \sin60°}{1.6\times10^{-19}\times10^{-3}} \approx 9.9$` mm. Period `$2\pi m/(qB) \approx 3.6\times10^{-8}$` s. Pitch = (2 × 10⁶ × cos 60°) × 3.6 × 10⁻⁸ ≈ **3.6 cm**.

Press play with the slip rings, then with the split ring. Change N, I and B and watch the torque curve change size.

<figure class="fig" data-fig="@em-loop-torque"><figcaption>The torque is largest when the loop is edge-on to B and zero when face-on. The commutator reverses the current at that point, which keeps a motor turning.</figcaption></figure>

<div class="keypoints">

- F = qv × B: perpendicular to v, no work, speed constant; zero along B.
- r = mv/qB = √(2mK)/qB; T = 2πm/qB, independent of speed. Helix pitch 2πmv cos θ/qB.
- Velocity selector v = E/B; cyclotron K_max = q²B²R²/2m.
- Straight wire μ₀I/2πd; loop centre μ₀NI/2R; arc μ₀Iθ/4πR; axis μ₀IR²/2(R² + x²)^{3/2}.
- Solenoid μ₀nI inside; toroid μ₀NI/2πr; thick wire μ₀Ir/2πR² inside.
- F = IL × B; closed loop in uniform B: no net force. Parallel wires μ₀I₁I₂/2πd, like currents attract.
- τ = NIAB sin θ; galvanometer NIAB = kφ; shunt and series resistor convert it to meters.

</div>
