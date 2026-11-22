---
title: 'Magnetism and matter'
seoTitle: 'Magnetism and matter: JEE and NEET physics'
summary: 'The bar magnet as a magnetic dipole, its field, torque, energy and oscillation, cutting and bending magnets, the Earth''s field and neutral points, magnetisation, H, susceptibility and permeability, dia-, para- and ferromagnetism, Curie''s law, domains and the hysteresis loop.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A bar magnet is cut into two equal halves along its length (parallel to its axis). Each half has:'
    choices: ['the same pole strength and half the moment', 'half the pole strength and half the moment', 'the same moment', 'no poles']
    ans: 1
    why: 'Cutting lengthwise halves the pole face, so pole strength halves; the length stays, so m = (pole strength) × length halves too.'
  - q: 'Which material is weakly repelled by a magnet and has negative susceptibility?'
    choices: ['Aluminium', 'Bismuth', 'Iron', 'Nickel']
    ans: 1
    why: 'Bismuth is diamagnetic (χ small and negative). Aluminium is paramagnetic, iron and nickel are ferromagnetic.'
  - q: 'The material for a transformer core should have:'
    choices: ['a thin hysteresis loop and high permeability', 'a fat loop and high coercivity', 'high retentivity', 'negative susceptibility']
    ans: 0
    why: 'The core is magnetised back and forth 50 times a second. Energy lost per cycle equals the loop area, so a thin loop (soft iron) wastes least.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Magnetism and matter'
  - 'Bohr magneton μB = 9.274 × 10⁻²⁴ J/T, CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
  - 'Earth''s magnetic field values: NOAA World Magnetic Model https://www.ncei.noaa.gov/products/world-magnetic-model'
---

**Physics · Class 12 · about 30 minutes.** By the end you will be able to treat a magnet as a dipole, solve torque, oscillation and neutral-point problems, and sort materials by how they respond to a field.

<div class="bigidea">Every magnet is a crowd of tiny current loops: electrons orbiting and spinning inside atoms. In most materials the loops point every which way and cancel. A field lines them up a little (paramagnets), pushes them slightly against itself (diamagnets), or, in iron, lines up whole regions at once (ferromagnets).</div>

## 1. The bar magnet as a dipole

A bar magnet behaves like a current loop, a **magnetic dipole** with moment m, pointing from its S pole to its N pole inside it. Its field lines run N to S outside and S to N inside, forming **closed loops**: there are no isolated magnetic poles (no monopoles), so the magnetic flux through any closed surface is zero.

For a short magnet at distance r (much larger than its length):

| Where | Field |
|---|---|
| On the axis | `$B = \dfrac{\mu_0}{4\pi}\,\dfrac{2m}{r^3}$`, along m |
| On the equatorial line | `$B = \dfrac{\mu_0}{4\pi}\,\dfrac{m}{r^3}$`, opposite to m |

These match the electric dipole formulas with k replaced by μ₀/4π.

**Cutting and bending.** Cut across (perpendicular to the length) into two: each piece has half the length, the same pole strength, half the moment. Cut along the length: half the pole strength, half the moment. Bend a magnet of length L into a semicircle: the poles are now a distance 2L/π apart, so the moment drops to `$\dfrac{2}{\pi}m$`.

## 2. A magnet in a uniform field

The same rules as the electric dipole:

```math
\vec\tau = \vec m \times \vec B, \qquad U = -\vec m\cdot\vec B = -mB\cos\theta, \qquad T = 2\pi\sqrt{\frac{I}{mB}}
```

<div class="meaning">
<dl>
<dt>m</dt><dd>magnetic moment (A m² or J/T)</dd>
<dt>θ</dt><dd>angle between m and B</dd>
<dt>I</dt><dd>moment of inertia of the magnet about its suspension (kg m²)</dd>
<dt>Physical meaning</dt><dd>A compass needle settles along the field because that is its lowest energy, and it swings about that position like a pendulum, faster in a stronger field.</dd>
</dl>
</div>

Work to turn a magnet from θ₁ to θ₂ is `$mB(\cos\theta_1 - \cos\theta_2)$`; from along the field to against it, 2mB. Comparing periods in two fields gives the ratio of the fields: `$\dfrac{B_1}{B_2} = \dfrac{T_2^2}{T_1^2}$`.

<div class="problem" data-problem="mm-oscillation"></div>

## 3. The Earth's magnetism

The Earth's field is roughly that of a huge dipole whose south pole points to the geographic north. At a place: **declination** is the angle between geographic and magnetic north; **dip** (inclination) δ is the angle the field makes with the horizontal. With total field B_E: `$B_H = B_E\cos\delta$`, `$B_V = B_E\sin\delta$`, `$\tan\delta = B_V/B_H$`. At the magnetic equator dip is 0°; at the magnetic poles 90°.

**Neutral points** are where a magnet's field cancels B_H exactly. N pole pointing north: on the equatorial line. N pole pointing south: on the axis.

<div class="problem" data-problem="mm-neutral"></div>

A **deflection magnetometer** (tangent law): a small needle in two perpendicular fields B and B_H settles at θ with `$B = B_H\tan\theta$`.

## 4. Magnetisation, H and susceptibility

When a material sits in a field, its atoms line up and add their own moments. **Magnetisation** M is the magnetic moment per unit volume (A/m). The **magnetising field** H (A/m) is the part set by free currents alone, such as nI in a solenoid. Then:

```math
B = \mu_0(H + M), \qquad M = \chi H, \qquad \mu_r = 1 + \chi, \qquad B = \mu_0\mu_r H
```

<div class="problem" data-problem="mm-core"></div>

## 5. Dia-, para- and ferromagnetism

| Type | χ | Behaviour | Examples |
|---|---|---|---|
| Diamagnetic | small, negative (about −10⁻⁵) | weakly repelled, field lines pushed out; moves to weaker field | bismuth, copper, water, superconductors (χ = −1, perfect) |
| Paramagnetic | small, positive (10⁻⁵ to 10⁻³) | weakly attracted; moves to stronger field | aluminium, sodium, oxygen |
| Ferromagnetic | large, positive (10³ or more) | strongly attracted; domains | iron, cobalt, nickel, gadolinium |

**Curie's law** for paramagnets: `$\chi = \dfrac{C}{T}$`; heat shakes the atoms out of line. A ferromagnet becomes paramagnetic above its **Curie temperature** (iron about 770 °C), with `$\chi = \dfrac{C}{T - T_C}$` above it. Diamagnetism hardly depends on temperature.

<div class="myth">

**"Only iron responds to magnets."** Every material does. Water is diamagnetic, and a strong enough field (about 16 T) can levitate a living frog. The effect is just a million times weaker than in iron.

</div>

## 6. Domains and the hysteresis loop

A ferromagnet is made of **domains**, regions about a tenth of a millimetre across, each fully magnetised. In unmagnetised iron they point in random directions. A field makes the well-aligned domains grow and the others turn. Remove the field and some alignment stays: that lag is **hysteresis**.

<figure class="fig" data-fig="hysteresis-loop"><figcaption>B against H as the magnetising field swings back and forth. Retentivity is the B left when H returns to zero; coercivity is the reverse H needed to remove it. The loop's area is the energy lost as heat in each cycle.</figcaption></figure>

Soft iron (thin loop, low coercivity, high permeability) suits transformer cores and electromagnets. Steel and alnico (fat loop, high retentivity and coercivity) suit permanent magnets.

**Atomic moments.** An electron in orbit is a current loop: `$m = \dfrac{evr}{2} = \dfrac{e}{2m_e}L$`. With Bohr's L = nh/2π, the smallest moment is the **Bohr magneton**, `$\mu_B = \dfrac{eh}{4\pi m_e} = 9.27\times10^{-24}$` J/T.

<div class="keypoints">

- A magnet is a dipole; field lines are closed loops; no monopoles; net flux through a closed surface is zero.
- Axis (μ₀/4π)2m/r³, equator (μ₀/4π)m/r³.
- τ = mB sin θ, U = −mB cos θ, T = 2π√(I/mB).
- Cut across: m halves, pole strength same; cut lengthwise: both halve; semicircle: 2m/π.
- B_H = B_E cos δ, tan δ = B_V/B_H; neutral points where the magnet's field cancels B_H.
- B = μ₀(H + M), χ = M/H, μ_r = 1 + χ.
- Dia: χ < 0; para: small χ > 0, χ = C/T; ferro: large χ, domains, paramagnetic above T_C.
- Loop area = energy lost per cycle: soft iron for cores, steel for permanent magnets.

</div>
