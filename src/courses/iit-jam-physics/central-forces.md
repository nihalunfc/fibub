---
title: Central forces, orbits and Kepler's laws
seoTitle: Central forces and Kepler's laws for IIT JAM Physics
summary: 'Why central forces keep angular momentum, how the effective potential decides every orbit, the conic-section orbits of gravity, Kepler''s laws, vis-viva, escape speed, satellites and the stability of circular orbits.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: Kepler's second law (equal areas in equal times) holds for
    choices: ['Any central force', 'Only inverse-square forces', 'Only circular orbits', 'Only when the planet''s mass is negligible']
    ans: 0
    why: The area swept per second is L/2m. Any force that points along the line to a fixed centre exerts no torque about it, so L is constant whatever the force law.
  - q: A satellite in a circular orbit slowly loses energy to air drag but stays in a nearly circular orbit. Its speed
    choices: ['Increases', 'Decreases', 'Stays the same', 'Drops to zero']
    ans: 0
    why: For a circular orbit E = −K. Losing energy makes E more negative, so K grows. The satellite sinks to a lower orbit, where the orbital speed √(GM/r) is larger.
  - q: 'The effective potential is U(r) + L²/(2μr²). What does the second term represent?'
    choices: ['The kinetic energy of the sideways (angular) motion', 'The potential energy of gravity', 'The radial kinetic energy', 'The energy lost to friction']
    ans: 0
    why: The angular part of the kinetic energy, ½μr²θ̇², becomes L²/(2μr²) once θ̇ = L/(μr²) is substituted. Because L is constant, it depends only on r and acts like a repulsive barrier.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 10'
  - 'J. R. Taylor, Classical Mechanics (2005), chapter 8: two-body central-force problems'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 3'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 45 minutes.** By the end you will be able to explain why every central-force orbit lies in a plane and sweeps equal areas, read the type of orbit off an effective-potential graph, use Kepler's laws and the vis-viva equation for satellites, comets and binary stars, and decide when a circular orbit is stable.

<div class="bigidea">Two conserved quantities, energy and angular momentum, turn a three-dimensional orbit problem into the one-dimensional motion of a particle in an effective potential.</div>

## 1. What makes a force central

A **central force** points along the line joining the body to a fixed centre, and its size depends only on the distance: `$\vec F = f(r)\,\hat r$`. Gravity from the Sun and the Coulomb force from a nucleus are the examples that matter.

The torque about the centre is `$\vec r\times f(r)\hat r = 0$`, so the angular momentum `$\vec L = m\,\vec r\times\vec v$` is constant. Three consequences follow at once:

1. **The motion stays in one plane**, the plane perpendicular to the fixed `$\vec L$`.
2. **Equal areas in equal times**: in time `$dt$` the radius sweeps a thin triangle of area `$\tfrac12 r^2\,d\theta$`, so `$\dfrac{dA}{dt} = \dfrac{L}{2m}$`, constant. This is Kepler's second law, and it holds for **any** central force.
3. **The force is conservative**, with `$U(r) = -\int f(r)\,dr$`, so energy is conserved too.

**Worked example.** A comet moves at 30 km/s at its closest point to the Sun, 1 AU away, and its farthest point is 1.5 AU. At both ends the velocity is perpendicular to the radius, so `$L = mvr$` and `$v_{\rm far} = 30\times1/1.5 = 20$` km/s.

## 2. Energy and the effective potential

For two bodies, the relative motion is that of one body with the **reduced mass** `$\mu = m_1m_2/(m_1 + m_2)$` around a fixed centre. In polar coordinates its energy is `$\tfrac12\mu(\dot r^2 + r^2\dot\theta^2) + U(r)$`. Step through what happens next:

<div class="steps">
<div class="step"><p><b>Angular momentum.</b> L = μr²θ̇ is constant, so θ̇ = L/(μr²).</p></div>
<div class="step"><p><b>Replace θ̇.</b> The sideways kinetic energy ½μr²θ̇² becomes L²/(2μr²), which depends only on r.</p></div>
<div class="step"><p><b>One-dimensional problem.</b> E = ½μṙ² + U<sub>eff</sub>(r), with U<sub>eff</sub> = U(r) + L²/(2μr²). This is a particle moving on a line in the potential U<sub>eff</sub>.</p></div>
<div class="step"><p><b>Read the motion.</b> The particle can only be where E ≥ U<sub>eff</sub>. Where E = U<sub>eff</sub>, ṙ = 0: these are the closest and farthest points (turning points).</p></div>
<div class="step"><p><b>Circular orbit.</b> If E equals the minimum of U<sub>eff</sub>, r never changes: the orbit is a circle at the bottom of the well.</p></div>
</div>

```math
E = \tfrac12\mu\dot r^2 + U_{\rm eff}(r), \qquad U_{\rm eff}(r) = U(r) + \frac{L^2}{2\mu r^2}
```

The extra term is the **centrifugal barrier**: it grows so fast at small `$r$` that a body with any angular momentum can never fall into an attractive `$-k/r$` centre. Try it below with gravity's `$U = -k/r$` (in units with `$k = \mu = 1$`).

<figure class="fig" data-fig="effective-potential"><figcaption>Left, the effective potential and the energy line: the particle lives where the line is above the curve. Right, the orbit for that energy. Lower the energy to its minimum for a circle; raise it above zero for an escape orbit.</figcaption></figure>

<div class="meaning">

<dl>
<dt>L²/(2μr²)</dt><dd>the centrifugal barrier: sideways kinetic energy written as a function of r</dd>
<dt>Minimum of U<sub>eff</sub></dt><dd>the circular orbit for that angular momentum, at r₀ = L²/(μk) for gravity</dd>
<dt>Roots of E = U<sub>eff</sub></dt><dd>the turning points: closest and farthest distances</dd>
<dt>E &lt; 0, E = 0, E &gt; 0</dt><dd>bound ellipse, just-escaping parabola, escaping hyperbola (for U = −k/r)</dd>
<dt>Physical meaning</dt><dd>The planet's motion in and out is like a marble rolling back and forth in a valley whose shape is set by gravity plus the barrier from its own sideways motion.</dd>
</dl>

</div>

## 3. The orbits of an inverse-square force

Solving the equation of motion for `$U = -k/r$` (with `$k = GMm$` for gravity) gives a **conic section** with the force centre at a focus:

```math
r(\theta) = \frac{l}{1 + e\cos\theta}, \qquad l = \frac{L^2}{\mu k}, \qquad e = \sqrt{1 + \frac{2EL^2}{\mu k^2}}
```

| Energy | Eccentricity | Orbit |
|---|---|---|
| `$E = -\mu k^2/2L^2$` (minimum) | `$e = 0$` | circle |
| `$E < 0$` | `$0 < e < 1$` | ellipse |
| `$E = 0$` | `$e = 1$` | parabola |
| `$E > 0$` | `$e > 1$` | hyperbola |

For an ellipse, `$r_{\min} = a(1 - e)$`, `$r_{\max} = a(1 + e)$` and the energy depends only on the semi-major axis: `$E = -k/2a$`. So `$e = \dfrac{r_{\max} - r_{\min}}{r_{\max} + r_{\min}}$`.

## 4. Kepler's three laws

1. Planets move on ellipses with the Sun at one **focus** (not the centre).
2. The radius sweeps equal areas in equal times (any central force).
3. `$T^2 \propto a^3$`. Exactly:

```math
T^2 = \frac{4\pi^2}{G(M + m)}\,a^3 \qquad \text{(in years, AU and solar masses: } T^2 = a^3/M_{\rm total})
```

For a circle it takes one line: `$GMm/r^2 = m(2\pi/T)^2r$`. For an ellipse, the area `$\pi ab$` swept at the constant rate `$L/2m$` gives the same law with `$r$` replaced by `$a$`.

**Worked example.** A comet's closest and farthest distances from the Sun are 0.5 AU and 31.5 AU. Then `$a = 16$` AU and `$T = 16^{3/2} = 64$` years. A common slip is to use the farthest distance as `$a$`.

<div class="problem" data-problem="orbit-period"></div>

Move the launch speed from slow to fast (try Circle and Escape) and look at the two shaded wedges.

<figure class="fig" data-fig="@mech-kepler"><figcaption>Both wedges are swept in the same time and have the same area. Speed 1 gives a circle, between 1 and √2 an ellipse, and √2 or more an escape.</figcaption></figure>

## 5. Satellites, vis-viva and escape

Energy conservation with `$E = -GMm/2a$` gives the **vis-viva equation**, which tells you the speed anywhere on any orbit:

```math
v^2 = GM\left(\frac{2}{r} - \frac{1}{a}\right), \qquad v_{\rm circ} = \sqrt{\frac{GM}{r}}, \qquad v_{\rm esc} = \sqrt{\frac{2GM}{r}}
```

At the Earth's surface `$GM = gR^2$`, so `$v_{\rm esc} = \sqrt{2gR} \approx 11.2$` km/s and the speed of an orbit skimming the surface is `$\sqrt{gR} \approx 7.9$` km/s. In a circular orbit `$K = GMm/2r$`, `$U = -2K$` and `$E = -K$`.

**Worked example (a transfer orbit).** A spacecraft in a circular orbit of radius `$R$` wants to reach `$4R$`. The transfer ellipse touches both circles, so `$a = 2.5R$`. Vis-viva at the start: `$v^2 = \dfrac{GM}{R}\left(2 - \dfrac{1}{2.5}\right) = 1.6\,\dfrac{GM}{R}$`. The burn must raise the speed by `$\sqrt{1.6} - 1 \approx 26.5\%$` of the circular speed.

<div class="myth">

**"A satellite slowed by air drag moves more slowly."** It speeds up. Drag removes energy, the orbit shrinks, and on a smaller circle `$v = \sqrt{GM/r}$` is larger. Gravity does more positive work on the falling satellite than drag takes away: the potential energy drops by twice the energy lost and the kinetic energy rises by the same amount as the energy lost.

</div>

## 6. Inside and outside a sphere

Newton's shell theorems (or Gauss's law for gravity):

- outside a spherically symmetric body, it pulls as if all its mass were at the centre;
- inside a uniform thin shell the field is zero (the potential is constant, `$-GM/R$`, not zero);
- inside a uniform solid sphere only the mass within radius `$r$` pulls, so `$g(r) = g\,r/R$`.

A ball dropped down a frictionless tunnel through a uniform Earth therefore moves in simple harmonic motion with `$\omega = \sqrt{g/R}$`, reaching the far side after `$\pi\sqrt{R/g} \approx 42$` minutes.

Compare the three modes: a uniform planet, a thin shell, and a ball dropped through a tunnel. Slide the probe radius.

<figure class="fig" data-fig="@mech-shell-g"><figcaption>Inside a uniform sphere g grows linearly with r, inside a shell it is zero, outside both fall as 1/r². The tunnel ball moves in simple harmonic motion.</figcaption></figure>

## 7. When is a circular orbit stable?

For an attractive power law `$F = -kr^n$`, a circular orbit sits at a minimum of `$U_{\rm eff}$` only if

```math
n > -3, \qquad \frac{\omega_r}{\omega_\theta} = \sqrt{n + 3}
```

where `$\omega_r$` is the frequency of small in-and-out wobbles and `$\omega_\theta$` the orbital frequency. Gravity (`$n = -2$`) gives a ratio of 1, one wobble per orbit, so the ellipse closes. A spring force (`$n = 1$`) gives 2: an ellipse centred on the force centre. Other values make the orbit precess into a rosette. Bertrand's theorem says that only these two force laws close **every** bound orbit, which is part of why the near-perfect ellipses of the planets pointed Newton to the inverse-square law.

To watch real orbits evolve, try the [two-body orbit sandbox](/science/two-body-orbit/); to turn positions and speeds into orbital elements, use [orbit elements](/science/orbit-elements/). For how Newton's gravity changed our picture of the universe, see the cosmology lesson on [Newton's universe](/learn/courses/cosmology/newtons-universe/).

<div class="keypoints">

- Central force `$f(r)\hat r$`: `$\vec L$` is constant, the motion is planar, `$dA/dt = L/2m$`, and energy is conserved.
- Two bodies reduce to one with `$\mu = m_1m_2/(m_1 + m_2)$`. `$U_{\rm eff} = U + L^2/(2\mu r^2)$`; turning points where `$E = U_{\rm eff}$`.
- Inverse square: conics `$r = l/(1 + e\cos\theta)$`; `$E < 0$` ellipse, `$= 0$` parabola, `$> 0$` hyperbola; `$E = -k/2a$`.
- Kepler III: `$T^2 = 4\pi^2a^3/G(M + m)$`. Vis-viva: `$v^2 = GM(2/r - 1/a)$`; `$v_{\rm esc} = \sqrt2\,v_{\rm circ}$`.
- Circular orbits: `$E = -K$`, `$U = -2K$`. Inside a uniform sphere `$g \propto r$`; inside a shell `$g = 0$`.
- Circular orbits under `$-kr^n$` are stable for `$n > -3$`; only `$n = -2$` and `$n = 1$` close every bound orbit.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [central forces practice page](/learn/courses/iit-jam-physics/practice/central-forces/).

<div class="qbank" data-bank="physics" data-topics="central-forces" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.2, [work, energy and collisions](/learn/courses/iit-jam-physics/work-energy-collisions/). **Next:** lesson 2.5, [moment of inertia](/learn/courses/iit-jam-physics/moment-of-inertia/). Going on to GATE? [Central forces and scattering](/learn/courses/gate-physics/central-force-scattering/) adds the orbit equation in full and Rutherford scattering.
