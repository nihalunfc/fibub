---
title: Gravitation
seoTitle: 'Gravitation: JEE and NEET physics'
summary: 'Newton''s law of gravitation, g and how it changes with height, depth and latitude, gravitational field and potential of shells and spheres, potential energy and escape speed, satellites and their energy, Kepler''s laws, elliptical orbits and binary stars.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'An astronaut floats inside a satellite orbiting 400 km above the Earth. This is because:'
    choices: ['there is no gravity at that height', 'gravity there is very weak', 'she and the satellite fall together with the same acceleration', 'the air pressure is zero']
    ans: 2
    why: 'Gravity at 400 km is still about 89% of its surface value. She feels weightless because she and the cabin are both in free fall around the Earth, so the floor does not push on her.'
  - q: 'The escape speed from the Earth does not depend on:'
    choices: ['the mass of the Earth', 'the radius of the Earth', 'the mass of the body escaping', 'G']
    ans: 2
    why: 'v_e = √(2GM/R). The body''s own mass cancels, because both its kinetic energy and its potential energy are proportional to it.'
  - q: 'A satellite in a circular orbit has kinetic energy K. Its total energy is:'
    choices: ['K', '−K', '2K', '−2K']
    ans: 1
    why: 'For a circular orbit K = GMm/2r and U = −GMm/r = −2K, so E = K + U = −K.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Gravitation'
  - 'Newtonian constant of gravitation G = 6.674 30 × 10⁻¹¹ N m² kg⁻², CODATA 2018 recommended value, NIST https://physics.nist.gov/cgi-bin/cuu/Value?bg'
  - 'Earth''s geocentric gravitational constant GM = 3.986 004 418 × 10¹⁴ m³ s⁻² (IERS Conventions 2010) https://www.iers.org/IERS/EN/Publications/TechnicalNotes/tn36.html'
---

**Physics · Class 11 · about 34 minutes.** By the end you will be able to find g anywhere above or inside the Earth, work with gravitational field and potential, calculate escape speeds and orbital speeds, energies and periods, and use Kepler's laws for elliptical orbits and binary stars.

<div class="bigidea">Every mass pulls every other mass with a force that falls as the square of the distance. That one rule explains falling apples, tides, the Moon's orbit and why satellites need about 8 km/s. An orbit is just falling sideways fast enough to keep missing the ground.</div>

## 1. Newton's law of gravitation

```math
F = \frac{G m_1 m_2}{r^2}
```

It acts along the line joining the two masses, always attractive, and does not depend on what lies between them. G = 6.674 × 10⁻¹¹ N m² kg⁻² is so small that gravity between everyday objects is tiny; it matters only when one mass is huge. For uniform spheres, r is the distance between centres, as if all the mass sat at the centre. Several masses: add the forces as vectors (superposition).

## 2. Acceleration due to gravity, g

At the surface, `$g = \dfrac{GM}{R^2}$` ≈ 9.8 m/s². How it changes:

| Where | Formula | Small-change form |
|---|---|---|
| Height h above the surface | `$g_h = \dfrac{gR^2}{(R + h)^2}$` | `$g(1 - 2h/R)$` for h ≪ R |
| Depth d below the surface | `$g_d = g\left(1 - \dfrac{d}{R}\right)$` | exact for a uniform Earth |
| Latitude λ (Earth spinning at ω) | `$g_\lambda = g - \omega^2R\cos^2\lambda$` | least at the equator, greatest at the poles |

g is greatest at the surface; it falls going up (as 1/r²) and going down (in a straight line to zero at the centre). At small heights, g falls twice as fast with height as with depth.

<div class="problem" data-problem="grav-g-height-depth"></div>

<div class="myth">

**"g is zero at the centre of the Earth because the pull of all that mass is huge there."** The pulls from all sides cancel at the centre. Inside a uniform sphere only the mass closer to the centre than you pulls; the shell outside you gives zero net force.

</div>

## 3. Field and potential

The **gravitational field** E is the force on 1 kg, `$\vec E = \vec F/m$`; near the Earth it is just g. The **gravitational potential** V is the potential energy of 1 kg, the work needed to bring it from very far away (where V = 0), so it is negative: `$V = -GM/r$` outside a sphere. Field and potential are linked by `$E = -dV/dr$`.

| Body | Field inside (r < R) | Field outside | Potential inside |
|---|---|---|---|
| Thin spherical shell | 0 | `$GM/r^2$` | constant, `$-GM/R$` |
| Uniform solid sphere | `$GMr/R^3$` | `$GM/r^2$` | `$-\dfrac{GM}{2R^3}(3R^2 - r^2)$` |
| Ring (on its axis, distance x) | `$\dfrac{GMx}{(R^2 + x^2)^{3/2}}$` | | `$-\dfrac{GM}{\sqrt{R^2 + x^2}}$` |

At the centre of a solid sphere V = −1.5 GM/R, lower than at the surface. The field of a ring is zero at its centre and largest at x = R/√2.

## 4. Potential energy and escape speed

Two masses have potential energy `$U = -\dfrac{GMm}{r}$`. Lifting m from the surface to height h takes `$\Delta U = \dfrac{GMmh}{R(R + h)}$`, which becomes mgh only when h ≪ R.

**Escape speed** is the launch speed that just reaches infinity with zero speed: `$\tfrac12 mv_e^2 = \dfrac{GMm}{R}$`, so

```math
v_e = \sqrt{\frac{2GM}{R}} = \sqrt{2gR} \approx 11.2\ \text{km/s for the Earth}
```

It does not depend on the mass of the body or the direction of launch. The Moon has a small escape speed (2.4 km/s), so it could not hold on to an atmosphere.

<div class="problem" data-problem="grav-escape-planet"></div>

## 5. Satellites

For a circular orbit of radius r = R + h, gravity supplies the centripetal force: `$\dfrac{GMm}{r^2} = \dfrac{mv^2}{r}$`.

```math
v_o = \sqrt{\frac{GM}{r}}, \qquad T = 2\pi\sqrt{\frac{r^3}{GM}}, \qquad K = \frac{GMm}{2r}, \quad U = -\frac{GMm}{r}, \quad E = -\frac{GMm}{2r}
```

<div class="meaning">
<dl>
<dt>G</dt><dd>universal gravitational constant, 6.674 × 10⁻¹¹ N m² kg⁻²</dd>
<dt>M, R</dt><dd>mass and radius of the planet</dd>
<dt>r</dt><dd>distance from the planet's centre (not the height)</dd>
<dt>v_o, v_e</dt><dd>orbital speed at r, and escape speed, with v_e = √2 v_o at the same r</dd>
<dt>Physical meaning</dt><dd>A satellite is always falling towards the Earth. Moving sideways at v_o, it falls exactly as fast as the curved ground drops away beneath it.</dd>
</dl>
</div>

Try it below: launch sideways at different speeds and heights.

<figure class="fig" data-fig="grav-orbit"><figcaption>Newton's cannon. Below the orbital speed the body falls back or follows an ellipse inside; at v_o it circles; between v_o and √2 v_o it follows a larger ellipse; at √2 v_o it escapes. A negative total energy means the body is bound.</figcaption></figure>

- Near the surface, `$v_o = \sqrt{gR}$` ≈ 7.9 km/s and T ≈ 84.6 min.
- **Geostationary** satellites orbit above the equator with T = 24 h, at about 36 000 km height (r ≈ 6.6 R), moving the same way as the Earth turns.
- Energy needed to move a satellite from orbit r₁ to r₂: `$\dfrac{GMm}{2}\left(\dfrac{1}{r_1} - \dfrac{1}{r_2}\right)$`.
- **Binding energy** of a satellite = `$GMm/2r$`, the energy needed to free it.

<div class="myth">

**"To go to a higher orbit, a satellite needs a higher speed."** Higher orbits are slower (v ∝ 1/√r). You do need to add energy to climb, but once there the satellite moves more slowly. Its kinetic energy falls while its potential energy rises twice as much.

</div>

## 6. Kepler's laws and elliptical orbits

1. **Orbits are ellipses** with the Sun at one focus.
2. **Equal areas in equal times:** the line from the Sun to a planet sweeps area at a constant rate, `$\dfrac{dA}{dt} = \dfrac{L}{2m}$`. This is angular momentum conservation, since gravity points at the Sun (no torque). So `$v_p r_p = v_a r_a$`: fastest at perihelion, slowest at aphelion.
3. **T² ∝ a³**, where a is the semi-major axis: `$T^2 = \dfrac{4\pi^2}{GM}a^3$`.

<div class="problem" data-problem="grav-satellite-period"></div>

For an ellipse, the total energy is `$E = -\dfrac{GMm}{2a}$`, with `$a = (r_p + r_a)/2$`. Speeds at the ends: `$v_p = \sqrt{\dfrac{2GM r_a}{r_p(r_p + r_a)}}$`.

**Binary stars** (masses m₁, m₂, separation d) circle their common centre of mass with the same period: `$T = 2\pi\sqrt{\dfrac{d^3}{G(m_1 + m_2)}}$`.

**Worked example (level 4).** A satellite moves in a circular orbit of radius 2R around the Earth. How much faster must it go to escape from there? Orbital speed `$\sqrt{GM/2R}$`, escape speed at that radius `$\sqrt{2GM/2R} = \sqrt{GM/R}$`. The ratio is √2, so it must speed up by a factor of 1.414, an increase of **41.4%**.

<div class="keypoints">

- F = Gm₁m₂/r²; spheres act as if their mass were at the centre.
- g = GM/R²; at height gR²/(R + h)², at depth g(1 − d/R), at latitude g − ω²R cos²λ.
- Shell: zero field inside. Solid sphere: field rises linearly inside, falls as 1/r² outside.
- U = −GMm/r; V = −GM/r; E = −dV/dr.
- Escape speed √(2GM/R) = √(2gR) ≈ 11.2 km/s; independent of the body's mass and direction.
- Circular orbit: v = √(GM/r), T = 2π√(r³/GM), E = −K = U/2.
- Kepler: ellipses, equal areas (angular momentum kept), T² ∝ a³; ellipse energy −GMm/2a.

</div>
