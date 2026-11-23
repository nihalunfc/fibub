---
title: Gravitation
seoTitle: 'Gravitation Class 11 notes, Kepler, escape speed'
summary: 'Class 11 Gravitation with animations: Kepler’s laws, Newton’s law, g above and below the surface, potential energy, escape speed and satellites.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The distance between two masses is doubled. The gravitational force between them becomes:'
    choices: ['half', 'one quarter', 'double', 'four times']
    ans: 1
    why: 'F = Gm₁m₂/r² is an inverse-square law: doubling r divides F by 2² = 4.'
  - q: 'The acceleration due to gravity at a height equal to the Earth’s radius above the surface is, compared with g at the surface:'
    choices: ['g/2', 'g/4', 'g/8', '2g']
    ans: 1
    why: 'The distance from the centre is 2R. g′ = g R²/(2R)² = g/4.'
  - q: 'A satellite is moved to an orbit of larger radius. Its orbital speed:'
    choices: ['increases', 'decreases', 'stays the same', 'first increases then decreases']
    ans: 1
    why: 'v = √(GM/r). A larger r gives a smaller v (and a longer period): higher satellites move more slowly.'
sources:
  - 'NCERT Class 11 Physics, Chapter 7 “Gravitation” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Planet orbital radii and periods: NASA Goddard Space Flight Center, Planetary Fact Sheet (nssdc.gsfc.nasa.gov/planetary/factsheet)'
  - 'G = 6.674 × 10⁻¹¹ N m² kg⁻²; Earth mass 5.97 × 10²⁴ kg; mean radius 6371 km: CODATA 2018 and NASA Earth Fact Sheet'
  - 'Kepler, J. (1609) Astronomia nova and (1619) Harmonices mundi (for the history box)'
---

**Physics · Class 11 · Chapter 7 · about 90 minutes.** By the end you will be able to state Kepler’s three laws, use Newton’s law of gravitation, find g at any height or depth, work with gravitational potential energy, derive and use the escape speed, and solve problems on satellites and their orbits.

<div class="bigidea">The same pull that drops an apple also holds the Moon in its orbit and the planets round the Sun. Newton’s great step was to see that one law, an attraction that weakens with the square of the distance, explains both falling and orbiting. An orbit is just falling around the planet while missing it.</div>

## 1. Kepler’s laws of planetary motion

Before telescopes were common, Tycho Brahe recorded years of precise planet positions. Johannes Kepler studied them and found three rules that describe every planet in the solar system.

1. **Law of orbits.** Every planet moves in an **ellipse** with the Sun at one focus.
2. **Law of areas.** The line from the Sun to a planet sweeps out **equal areas in equal times**.
3. **Law of periods.** The square of the time period of revolution is proportional to the cube of the semi-major axis: `$T^2 \propto a^3$`.

### Second law: equal areas

Look at the picture and let the planet go round. Each shaded wedge is the area swept in one twelfth of the year. One wedge is near the Sun (long and thin), the other is far away (short and fat). They have the same area, so the planet must move faster when it is near the Sun. Change the eccentricity and see the effect grow.

<figure class="fig" data-fig="c11p-grav-area"><figcaption>Kepler’s second law. Both wedges are swept in the same time and have equal areas. Near the Sun the planet is fast, far from it slow. At e = 0 (a circle) the speed is constant.</figcaption></figure>

This is conservation of angular momentum in disguise. Gravity always pulls along the line to the Sun, so its torque about the Sun is zero and `$L = m r v_\perp$` is constant. The area swept per second is `$\dfrac{dA}{dt} = \dfrac{L}{2m}$`, a constant.

<div class="myth">

**“Earth is closest to the Sun in summer.”** Earth is actually nearest to the Sun (perihelion) in early January. Seasons come from the tilt of Earth’s axis, not from its distance, which changes by only about 3%.

</div>

### Third law: the periods

Here is a test of `$T^2 \propto a^3$` with real planets (period T in years, orbit radius a in astronomical units, 1 AU = Earth–Sun distance). For Earth, T = 1 and a = 1. For Jupiter, a = 5.2 and T = 11.9: `$T^2 = 141$` and `$a^3 = 141$`. Every planet is on one straight line on log-log paper.

<figure class="fig" data-fig="c11p-grav-t2a3"><figcaption>Planets with periods in their true ratios (top) and the log-log plot of T against a (bottom). Slide the orbit radius of your own planet: its period must be a^1.5.</figcaption></figure>

<div class="problem" data-problem="c11p-grav-kepler"></div>

Look at three kinds of orbit and see Kepler’s laws at work in the shared orbit explorer and in the tool:

<figure class="fig" data-fig="@mech-kepler"><figcaption>An orbit from the launch speed: circle, ellipse, parabola or hyperbola, with two equal-time wedges of equal area.</figcaption></figure>

<!--fig:tool kepler-orbits-->

## 2. Universal law of gravitation

Newton showed that any two particles attract each other with a force along the line joining them:

```math
F = G\,\frac{m_1 m_2}{r^2}
```

<div class="meaning">

<dl>
<dt>G</dt><dd>the universal gravitational constant, 6.67 × 10⁻¹¹ N m²/kg²: the same everywhere in the universe. Its tiny size is why you do not feel the pull of the person next to you.</dd>
<dt>m₁, m₂</dt><dd>the two masses (kg)</dd>
<dt>r</dt><dd>distance between their centres (m)</dd>
<dt>Physical meaning</dt><dd>The pull is mutual and equal in size (Newton’s third law), is always attractive and falls as 1/r²: double the distance and the force is one quarter.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-grav-newton"><figcaption>Two masses and their equal and opposite pulls. Change the masses and the distance. The graph is the inverse-square curve: the force is large only when the masses are close.</figcaption></figure>

<div class="problem" data-problem="c11p-grav-force"></div>

### From Newton’s law back to Kepler’s third law

For a planet in a circular orbit, gravity supplies the centripetal force. Follow the steps.

<div class="steps" data-fig="c11p-grav-t2steps">
<div class="step">A small mass m (a planet or a satellite) goes round a much heavier mass M in a circle of radius r.</div>
<div class="step">The only force is gravity, and it must provide the centripetal force: GMm/r² = mv²/r.</div>
<div class="step">Cancel m and one r: v² = GM/r, so the orbital speed is v = √(GM/r). A bigger orbit means a slower speed.</div>
<div class="step">One orbit takes T = 2πr/v. Putting in v gives T = 2π√(r³/GM).</div>
<div class="step">Square it: T² = (4π²/GM) r³. This is Kepler’s third law, now with the constant worked out.</div>
<div class="step">The constant 4π²/GM depends only on the central body M. All planets around the Sun share it; all satellites around the Earth share another one.</div>
</div>

### Superposition and a neutral point

With more than two bodies, the forces on a mass add as vectors. Between the Earth and the Moon the two pulls on a spacecraft point in opposite directions, so there is a **neutral point** where they cancel. Slide the test point and the mass ratio.

<figure class="fig" data-fig="c11p-grav-nullpoint"><figcaption>The big and the small body pull a test mass in opposite directions. The net field (plotted) crosses zero at the neutral point, at D/(1 + √ε) from the big body, where ε is the mass ratio. For the Earth and Moon it lies about 0.9 of the way to the Moon.</figcaption></figure>

## 3. Acceleration due to gravity of the Earth

For a mass m on the Earth’s surface (mass M, radius R), Newton’s law gives the weight `$mg = GMm/R^2$`, so

```math
g = \frac{GM}{R^2} = 9.8\ \text{m/s}^2
```

Remarkably g does not depend on m: a feather and a stone have the same acceleration in a vacuum. Knowing g and R, we can *weigh the Earth*: `$M = gR^2/G = 6\times10^{24}$` kg. This was the first great success of the law, and Henry Cavendish’s 1798 laboratory measurement of G made it possible.

### g above the surface

At a height h above the surface the distance from the centre is `$R + h$`:

```math
g_h = \frac{GM}{(R+h)^2} = g\Big(\frac{R}{R+h}\Big)^2 \approx g\Big(1 - \frac{2h}{R}\Big)\ \ (h \ll R)
```

### g below the surface

Imagine a uniform Earth. At a depth d you are at distance `$r = R - d$` from the centre. The layers outside you (a spherical shell) exert **no net force** on you; only the sphere of radius r pulls you. Its mass is proportional to `$r^3$`, so the pull is proportional to `$r^3/r^2 = r$`:

```math
g_d = g\Big(1 - \frac{d}{R}\Big) = g\,\frac{r}{R}
```

At the centre g = 0: you are pulled equally in all directions.

<figure class="fig" data-fig="c11p-grav-g"><figcaption>g against distance from the centre of a uniform Earth: it rises linearly from 0 at the centre to g at the surface, then falls as 1/r². Slide the point through the Earth and into space.</figcaption></figure>

<figure class="fig" data-fig="@mech-shell-g"><figcaption>The shell result: a uniform shell attracts a point outside as if all its mass were at the centre, and exerts no force on a point inside. A ball dropped in a tunnel through the Earth would oscillate with a period of about 84 minutes.</figcaption></figure>

<div class="problem" data-problem="c11p-grav-g"></div>

Compare heights and depths yourself:

<!--fig:tool gravity-height-depth-->

<div class="myth">

**“There is no gravity in space.”** At the altitude of the space station (about 400 km) g is still about 8.7 m/s², nearly 90% of its value on the ground. Astronauts float because they are in free fall around the Earth, not because gravity has vanished.

</div>

<div class="myth">

**“g is the same everywhere on Earth.”** The Earth is slightly flattened and it spins, so g is about 9.78 m/s² at the equator and 9.83 m/s² at the poles. Beyond the syllabus here: the real Earth is denser at the centre, which makes g rise slightly just below the surface before falling.

</div>

## 4. Gravitational potential energy

Near the ground the potential energy is `$mgh$`, but that fails when h is not small, because g changes. The general expression, taking the potential energy to be zero at infinite distance, is

```math
U(r) = -\frac{GMm}{r}
```

It is negative everywhere: the attraction means we must **supply** energy to pull a body away, and at infinity (U = 0) it is free. The graph is a well. The deeper you are in the well, the more energy is needed to climb out.

<figure class="fig" data-fig="c11p-grav-pe"><figcaption>The potential energy well. The dashed line is the total energy E. The gap between E and the curve is the kinetic energy. If E < 0 the particle is trapped and turns back; if E ≥ 0 the line never meets the curve again and it escapes.</figcaption></figure>

<div class="meaning">

<dl>
<dt>U</dt><dd>gravitational potential energy (J), zero at infinity</dd>
<dt>−GMm/r</dt><dd>the work done by gravity in bringing m from infinity to distance r</dd>
<dt>Physical meaning</dt><dd>Moving up means U increases (becomes less negative). Near the surface the change over a small height h is `$GMm h/R^2 = mgh$`, so the old formula is just a small-height approximation.</dd>
</dl>

</div>

The **gravitational potential** at a point is the potential energy per unit mass, `$V = -GM/r$` (J/kg).

## 5. Escape speed

The **escape speed** is the least launch speed that lets a body leave the Earth’s gravity for good (ignoring air and rotation). It reaches infinity with zero speed, so its total energy there is zero, and energy is conserved.

<div class="steps" data-fig="c11p-grav-escape-steps">
<div class="step">A rocket is launched from the surface (radius R) with speed v. We look for the smallest v that carries it all the way to infinity.</div>
<div class="step">At the surface: kinetic energy ½mv², potential energy −GMm/R.</div>
<div class="step">Just barely escaping, it arrives far away with speed 0: kinetic energy 0 and potential energy −GMm/∞ = 0. The total is 0.</div>
<div class="step">By conservation of energy, the total at the surface must also be 0: ½mv² − GMm/R = 0.</div>
<div class="step">So v² = 2GM/R and v_esc = √(2GM/R). With GM = gR² this is √(2gR) = 11.2 km/s.</div>
<div class="step">A satellite orbiting just above the ground has v = √(gR) = 7.9 km/s, so v_esc = √2 × v_orbit. Mass cancels: a pebble and a rocket have the same escape speed.</div>
</div>

```math
v_{esc} = \sqrt{\frac{2GM}{R}} = \sqrt{2gR} \approx 11.2\ \text{km/s (Earth)}
```

<div class="problem" data-problem="c11p-grav-escape"></div>

The Moon’s escape speed is only 2.4 km/s because its mass is small and its radius small, so it cannot hold an atmosphere for long: gas molecules at ordinary temperatures sometimes reach this speed and leave. The Earth keeps its atmosphere (though light hydrogen and helium slowly leak away).

Now throw something yourself. Choose a launch speed from the surface and see whether it falls back, circles, makes an ellipse or escapes.

<figure class="fig" data-fig="c11p-grav-orbit"><figcaption>Newton’s cannon. Below 7.9 km/s the object falls back; at 7.9 km/s it circles just above the ground; between 7.9 and 11.2 km/s it makes an ellipse; at 11.2 km/s or more it escapes.</figcaption></figure>

## 6. Earth satellites

A satellite of mass m circling the Earth in a circle of radius `$r = R + h$` obeys `$GMm/r^2 = mv^2/r$`. From the steps in section 2:

```math
v = \sqrt{\frac{GM}{r}} = \sqrt{\frac{gR^2}{R+h}}, \qquad T = 2\pi\sqrt{\frac{r^3}{GM}}
```

Higher orbits are **slower** and take **longer**. A satellite just above the ground has T = 84 minutes; the International Space Station at 400 km has about 92 minutes.

<figure class="fig" data-fig="c11p-grav-satellite"><figcaption>A satellite at a height you choose. Watch its speed and period change. Use the buttons for the space station, navigation satellites and a geostationary satellite. The dot on the Earth is a person: for the geostationary satellite it stays overhead.</figcaption></figure>

<div class="problem" data-problem="c11p-grav-orbit"></div>

### Energy of an orbiting satellite

The kinetic energy is `$\tfrac12mv^2 = \dfrac{GMm}{2r}$`. The potential energy is `$-\dfrac{GMm}{r}$`. So

```math
K = \frac{GMm}{2r},\qquad U = -\frac{GMm}{r},\qquad E = K + U = -\frac{GMm}{2r}
```

The total energy is negative (the satellite is bound), and equal to `$-K$`. To escape it needs a total of zero: an extra `$GMm/2r$`. A curious fact: when air drag removes energy, E becomes more negative, r gets smaller, and the satellite **speeds up**.

### Geostationary and polar satellites

A **geostationary** satellite has T = 24 hours, orbits in the equatorial plane in the same direction as the Earth turns, and so stays above one spot. Putting T = 24 h into `$T = 2\pi\sqrt{r^3/GM}$` gives r = 42 000 km, a height of about 36 000 km. Indian communication satellites in the INSAT and GSAT series use such orbits for television and weather.

A **polar satellite** goes over the poles at a height of 500–800 km with a period of about 100 minutes. As the Earth turns beneath it, it scans the whole planet in a few days, which suits remote sensing and mapping (the Indian IRS satellites).

<div class="history">

- **1543** Copernicus puts the Sun at the centre of the planets’ motions.
- **1609 and 1619** Kepler publishes his three laws.
- **1687** Newton’s *Principia* gives the law of universal gravitation and derives Kepler’s laws.
- **1798** Henry Cavendish measures G with a torsion balance, “weighing the Earth”.
- **1957** Sputnik 1, the first artificial satellite, goes into orbit; India’s Aryabhata followed in 1975.

</div>

Other tools for this chapter: [Two-body orbit sandbox](/science/two-body-orbit/) and [Orbit transfer calculator](/science/orbit-transfer-calculator/).

<div class="keypoints">

- Kepler: planets move in ellipses with the Sun at a focus; they sweep equal areas in equal times (angular momentum is conserved); `$T^2 \propto a^3$`.
- Newton: `$F = Gm_1m_2/r^2$`, attractive, equal and opposite on the two bodies; G = 6.67 × 10⁻¹¹ N m²/kg².
- `$g = GM/R^2$`; at height h, `$g_h = g R^2/(R+h)^2$`; at depth d, `$g_d = g(1 - d/R)$`; zero at the centre.
- `$U = -GMm/r$`, zero at infinity; near the ground the change is mgh.
- Escape speed `$\sqrt{2GM/R} = \sqrt{2gR}$` = 11.2 km/s for the Earth; orbital speed `$\sqrt{GM/r}$` = 7.9 km/s just above the ground.
- Satellite: `$T = 2\pi\sqrt{r^3/GM}$`, `$K = GMm/2r$`, `$E = -GMm/2r$`; higher orbit means slower and longer period.
- Geostationary: T = 24 h, equatorial, about 36 000 km up. Polar satellites: low orbit passing over the poles.

</div>

Going further for JEE/NEET: exam-level problems on shell and sphere fields, variation of g with latitude, orbit changes and Kepler’s laws are in [Gravitation (JEE)](/learn/courses/engineering-entrance/gravitation/).
