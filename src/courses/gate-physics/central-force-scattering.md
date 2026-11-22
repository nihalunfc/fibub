---
title: Central forces and Rutherford scattering
seoTitle: Central forces and scattering cross-sections for GATE
summary: 'The orbit equation in u = 1/r, finding a force law from an orbit, the Laplace-Runge-Lenz vector and closed orbits, the virial theorem, impact parameter and differential cross-section, the hard sphere and Rutherford formulas, closest approach, and moving between the centre-of-mass and lab frames.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The total cross-section for scattering of a charged particle by a bare Coulomb potential is'
    choices: ['πa², with a the distance of closest approach', 'Infinite', 'Zero', '4π(k/4E)²']
    ans: 1
    why: The Coulomb force reaches to infinite distance, so even a particle with a very large impact parameter is deflected a little. Integrating dσ/dΩ ∝ 1/sin⁴(Θ/2) diverges at small angles. Screening by atomic electrons makes the real cross-section finite.
  - q: 'A hard sphere of radius a scatters point particles elastically. The differential cross-section'
    choices: ['Peaks in the forward direction', 'Peaks backwards', 'Is the same in every direction, a²/4', 'Grows as 1/sin⁴(Θ/2)']
    ans: 2
    why: b = a cos(Θ/2) gives dσ/dΩ = (b/sin Θ)|db/dΘ| = a²/4, independent of angle. Integrating over 4π gives the geometric πa².
  - q: 'In an elastic collision of a moving particle with an identical particle at rest (non-relativistic), the two outgoing directions make an angle of'
    choices: ['0°', '45°', '180°', '90°']
    ans: 3
    why: Momentum gives p = p₁ + p₂ and energy gives p² = p₁² + p₂² for equal masses, so p₁·p₂ = 0. The lab angle of each is half its CM angle and the two add to 90°.
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 3'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapters 3 and 4'
  - 'E. Rutherford, The scattering of α and β particles by matter and the structure of the atom, Philosophical Magazine 21, 669 (1911)'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 50 minutes.** By the end you will be able to get an orbit from a force law and a force law from an orbit, use the Laplace-Runge-Lenz vector, apply the virial theorem, work out differential and total cross-sections, use the Rutherford formula with real numbers, and convert scattering angles between the centre-of-mass and lab frames.

The effective potential, Kepler's laws and orbital energies are in the JAM lesson on [central forces](/learn/courses/iit-jam-physics/central-forces/). This lesson starts from there.

<div class="bigidea">A central force turns every problem into one radial equation. Bound orbits ask what shape it gives; scattering asks how the angle of deflection depends on how closely the particle was aimed, and turns that into a measurable cross-section.</div>

## 1. The orbit equation

With reduced mass `$\mu$`, angular momentum `$\ell = \mu r^2\dot\theta$` and a central force `$F(r)$` (positive outwards), substitute `$u = 1/r$` and use `$\theta$` instead of time. Since `$\dot r = -(\ell/\mu)\,du/d\theta$`, the radial equation becomes the **Binet equation**:

```math
\frac{d^2u}{d\theta^2} + u = -\frac{\mu}{\ell^2u^2}\,F\!\left(\frac1u\right)
```

**Force to orbit.** For `$F = -k/r^2$` the right side is the constant `$\mu k/\ell^2$`, so `$u = (\mu k/\ell^2)(1 + e\cos\theta)$`: a conic. For `$F = -k/r^3$`, the equation is `$u'' + (1 - \mu k/\ell^2)u = 0$`. If `$\ell^2 > \mu k$` the orbit is `$u \propto \cos(\gamma\theta)$`, an open curve that escapes; if `$\ell^2 < \mu k$` it is a spiral into or out of the centre. Inverse-cube forces have no stable circular orbits.

**Orbit to force.** Read the equation backwards. **Worked example:** a particle moves on the spiral `$r = c\,\theta^{-1}$`, so `$u = \theta/c$` and `$u'' = 0$`. Then `$u = -\mu F/(\ell^2u^2)$`, which gives `$F = -\ell^2u^3/\mu = -\ell^2/(\mu r^3)$`: an attractive inverse-cube force, with exactly the angular momentum that makes the bracket above vanish.

## 2. The Laplace-Runge-Lenz vector and closed orbits

For `$F = -k/r^2$` there is an extra conserved vector besides `$\vec L$`:

```math
\vec A = \vec p\times\vec L - \mu k\,\hat r, \qquad \frac{d\vec A}{dt} = 0, \qquad |\vec A| = \mu k e
```

It lies in the orbital plane and points from the centre to the closest point (perihelion). Taking `$\vec A\cdot\vec r = Ar\cos\theta$` and using `$\vec r\cdot(\vec p\times\vec L) = \ell^2$` gives `$\ell^2 - \mu kr = \mu ker\cos\theta$`, the conic again, with no differential equation solved. Because the perihelion direction is fixed, Kepler orbits close.

Any small extra force breaks this. A perturbing potential `$\delta U = -h/r^3$` (the leading correction from general relativity) makes `$\vec A$` turn slowly: the perihelion **precesses**. For Mercury the relativistic part is 43 arcseconds per century. The extra symmetry behind `$\vec A$` is also why the hydrogen atom's levels depend only on `$n$` and not on `$l$`.

**Bertrand's theorem.** Only `$F \propto -1/r^2$` and `$F \propto -r$` close every bound orbit. Near a circular orbit, small radial wobbles have frequency ratio `$\omega_r/\omega_\theta = \sqrt{n + 3}$` for `$F \propto -r^n$`: 1 for gravity, 2 for the spring. A slight change of exponent from `$-2$` turns ellipses into rosettes.

## 3. The virial theorem

For a bound motion, the time average of `$\vec r\cdot\vec p$` does not grow, so `$\langle d(\vec r\cdot\vec p)/dt\rangle = 0$`, which gives `$2\langle T\rangle = \langle\vec r\cdot\nabla V\rangle$`. For a power law `$V \propto r^n$`:

```math
2\langle T\rangle = n\langle V\rangle
```

Gravity and Coulomb (`$n = -1$`): `$\langle T\rangle = -\tfrac12\langle V\rangle$` and `$E = -\langle T\rangle$`. The oscillator (`$n = 2$`): `$\langle T\rangle = \langle V\rangle = E/2$`. Astronomers use the first to weigh galaxy clusters from the speeds of their galaxies; that is how Zwicky first inferred dark matter.

**Worked example.** A particle is bound in `$V = cr^4$`. Then `$\langle T\rangle = 2\langle V\rangle$`, so `$E = 3\langle V\rangle$` and the average kinetic energy is two thirds of the total.

## 4. Impact parameter and cross-section

Particles arrive in a uniform parallel beam of intensity `$I$` (number per unit area per unit time). Each has an **impact parameter** `$b$`, the distance by which it would miss the centre if it went straight, and is deflected through angle `$\Theta$`. With `$E$` and `$\ell = b\sqrt{2\mu E}$` fixed, `$\Theta$` depends only on `$b$`.

<div class="steps">
<div class="step"><p><b>Count in.</b> The particles with impact parameter between b and b + db cross a ring of area 2πb db.</p></div>
<div class="step"><p><b>Count out.</b> They come out between Θ and Θ + dΘ, into solid angle dΩ = 2π sin Θ dΘ.</p></div>
<div class="step"><p><b>Define dσ.</b> The number scattered into dΩ per second is I dσ, where dσ is the effective target area for that direction.</p></div>
<div class="step"><p><b>Equate.</b> 2πb |db| = (dσ/dΩ) 2π sin Θ |dΘ|.</p></div>
</div>

```math
\frac{d\sigma}{d\Omega} = \frac{b}{\sin\Theta}\left|\frac{db}{d\Theta}\right|, \qquad \sigma = \int\frac{d\sigma}{d\Omega}\,d\Omega
```

<div class="meaning">

<dl>
<dt>b</dt><dd>impact parameter: the miss distance of the undeflected straight line</dd>
<dt>Θ(b)</dt><dd>the deflection; small b means a close encounter and a large angle</dd>
<dt>dσ/dΩ</dt><dd>an area per steradian: the slice of beam cross-section that ends up in each direction</dd>
<dt>σ</dt><dd>total cross-section: the area of beam removed from the forward direction</dd>
<dt>Physical meaning</dt><dd>The target is replaced by an imaginary disc that each direction "owns" a part of. A particle hitting that part of the disc goes in that direction. Counting how many arrive in a detector measures the area of its part.</dd>
</dl>

</div>

**Worked example: a hard sphere.** A particle hitting a sphere of radius `$a$` bounces like light off a mirror. Geometry gives `$b = a\sin\alpha$` with `$\Theta = \pi - 2\alpha$`, so `$b = a\cos(\Theta/2)$` and `$|db/d\Theta| = \tfrac12a\sin(\Theta/2)$`. Then `$d\sigma/d\Omega = a\cos(\Theta/2)\cdot\tfrac12a\sin(\Theta/2)/\sin\Theta = a^2/4$`. The scattering is **isotropic**, and `$\sigma = 4\pi\cdot a^2/4 = \pi a^2$`, the shadow of the sphere, as it should be.

## 5. Rutherford scattering

For a repulsive `$U = k/r$` with `$k = zZe^2/4\pi\varepsilon_0$`, the orbit is one branch of a hyperbola with the nucleus at the outer focus. The angle between its asymptotes gives

```math
b = \frac{k}{2E}\cot\frac{\Theta}{2}, \qquad \frac{d\sigma}{d\Omega} = \left(\frac{k}{4E}\right)^2\frac{1}{\sin^4(\Theta/2)}
```

The same formula holds for an attractive `$-k/r$` (the particle swings round the centre instead of being pushed away) and, by a happy accident, in quantum mechanics. Its key features:

- It falls steeply with angle, but large angles still happen. Rutherford's surprise was that about 1 in `$10^4$` alpha particles bounced back from a thin gold foil, impossible for Thomson's spread-out atom.
- `$d\sigma/d\Omega \propto Z^2/E^2$`: heavier nuclei and slower particles scatter more.
- The total cross-section diverges at small angles, because the Coulomb force has infinite range. In matter the electrons screen the nucleus and cut it off.
- The **closest approach** for impact parameter `$b$` is `$r_{\min} = \dfrac{k}{2E}\left(1 + \csc\dfrac{\Theta}{2}\right)$`; head-on (`$\Theta = 180°$`) it is `$d = k/E$`. When `$d$` is smaller than the nuclear radius the formula fails, which is how the size of nuclei was first measured.

<figure class="fig" data-fig="scattering-orbits"><figcaption>Particles at evenly spaced impact parameters pass a repulsive or attractive Coulomb centre or a hard sphere. Small impact parameters give large angles; pick one orbit and compare its measured angle with the Rutherford formula.</figcaption></figure>

**Worked example: alpha particles on gold.** Take 5 MeV alpha particles (`$z = 2$`) on gold (`$Z = 79$`), with `$e^2/4\pi\varepsilon_0 = 1.44$` MeV fm, so `$k = 227.5$` MeV fm.

1. Head-on closest approach: `$d = k/E = 45.5$` fm, well outside the gold nucleus (about 7 fm), so the formula holds.
2. Impact parameter for 90°: `$b = (k/2E)\cot45° = 22.75$` fm, and `$r_{\min} = 22.75\,(1 + \sqrt2) = 54.9$` fm.
3. Fraction scattered beyond 90° by a foil 1 μm thick (`$n = 5.9\times10^{28}$` m⁻³): each nucleus blocks a disc of area `$\pi b^2 = 1.63\times10^{-27}$` m², so the fraction is `$nt\,\pi b^2 \approx 9.6\times10^{-5}$`, about 1 in 10 000.

<div class="problem" data-problem="rutherford-impact"></div>

<div class="myth">

**"A total cross-section is the physical size of the target."** It is an effective area, and it depends on the force and the energy. For a hard sphere it happens to be the shadow `$\pi a^2$`; for Coulomb scattering it is infinite; for neutrons on nuclei it can be thousands of times the geometric size near a resonance. In wave mechanics, even a hard sphere has a total cross-section of `$2\pi a^2$` at short wavelengths, because of diffraction round its edge.

</div>

## 6. Centre-of-mass and lab frames

The formulas above give `$\Theta$` in the **centre-of-mass (CM) frame**, or for a fixed centre. A real target of mass `$m_2$` recoils, and the detector measures the lab angle `$\theta$` of the projectile `$m_1$`. For elastic scattering,

```math
\tan\theta = \frac{\sin\Theta}{\cos\Theta + m_1/m_2}
```

- `$m_1 \ll m_2$`: the two angles agree.
- `$m_1 = m_2$`: `$\theta = \Theta/2$`, so no projectile goes backwards, and the target goes off at `$(\pi - \Theta)/2$`: the two lab directions are at 90°.
- `$m_1 > m_2$`: there is a maximum lab angle, `$\sin\theta_{\max} = m_2/m_1$`. An alpha particle hitting an electron is turned by at most 0.008°, which is why electrons in Rutherford's foil could not explain the large angles.

Cross-sections change too, because the same particles fill a different solid angle: `$(d\sigma/d\Omega)_{\rm lab} = (d\sigma/d\Omega)_{\rm CM}\,|d\Omega_{\rm CM}/d\Omega_{\rm lab}|$`, while the total `$\sigma$` is the same in both frames.

**Worked example.** A neutron hits a carbon-12 nucleus at rest and scatters elastically through 90° in the CM frame. Then `$\tan\theta = 1/(0 + 1/12) = 12$`, so `$\theta = 85.2°$` in the lab. Its speed in the CM frame is unchanged and the CM moves at `$v/13$`, so its lab energy falls to `$(1 + 144)/169 = 0.858$` of the original. This is how graphite slows neutrons in a reactor.

<div class="keypoints">

- Binet: `$u'' + u = -\mu F(1/u)/(\ell^2u^2)$`, `$u = 1/r$`; use it both ways (force to orbit, orbit to force).
- Inverse square: `$\vec A = \vec p\times\vec L - \mu k\hat r$` is conserved, points to perihelion, `$|\vec A| = \mu ke$`. Only `$1/r^2$` and `$r$` close every orbit.
- Virial: `$2\langle T\rangle = n\langle V\rangle$` for `$V \propto r^n$`.
- `$d\sigma/d\Omega = (b/\sin\Theta)|db/d\Theta|$`. Hard sphere: `$b = a\cos(\Theta/2)$`, `$a^2/4$`, `$\sigma = \pi a^2$`.
- Rutherford: `$b = (k/2E)\cot(\Theta/2)$`, `$d\sigma/d\Omega = (k/4E)^2\csc^4(\Theta/2)$`; total `$\sigma$` infinite; head-on `$d = k/E$`.
- Lab angle: `$\tan\theta = \sin\Theta/(\cos\Theta + m_1/m_2)$`; equal masses give `$\theta = \Theta/2$` and a 90° opening; `$\sin\theta_{\max} = m_2/m_1$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [central forces and scattering practice page](/learn/courses/gate-physics/practice/central-force-scattering/).

<div class="qbank" data-bank="physics" data-topics="central-force-scattering" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.3, [Poisson brackets and canonical transformations](/learn/courses/gate-physics/poisson-brackets/). **Next:** lesson 2.5, [small oscillations and normal modes](/learn/courses/gate-physics/normal-modes/). Basics: the JAM lessons on [central forces](/learn/courses/iit-jam-physics/central-forces/) and [work, energy and collisions](/learn/courses/iit-jam-physics/work-energy-collisions/).
