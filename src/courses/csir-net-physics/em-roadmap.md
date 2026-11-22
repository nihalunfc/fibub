---
title: 'Electromagnetic theory: what NET asks and where to study it'
seoTitle: CSIR NET Physics electromagnetic theory roadmap
summary: 'What CSIR NET asks from electromagnetic theory in Part B (electrostatics and boundary values, magnetostatics, induction, Maxwell''s equations, potentials and gauges, waves, optics, charges in fields) and Part C (plasma dispersion, covariant form, waveguides and transmission lines, radiation and retarded potentials), the study order, the GATE and JAM lessons to use, a self-check list and a worked dipole-radiation example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'The amplitude of an oscillating electric dipole is halved and its frequency doubled. The total radiated power'
    choices: ['becomes 4 times larger', 'stays the same', 'becomes 2 times larger', 'becomes 16 times larger']
    ans: 0
    why: 'P ∝ p₀²ω⁴: (1/2)² × 2⁴ = 16/4 = 4.'
  - q: 'In a good conductor, the skin depth δ depends on frequency as'
    choices: ['δ ∝ f^(−1/2)', 'δ ∝ f^(−1)', 'δ ∝ f^(1/2)', 'δ does not depend on f']
    ans: 0
    why: 'δ = √(2ρ/(ωμ)), so it falls as one over the square root of the frequency.'
  - q: 'Which of these is a Part C (advanced) topic in the NET electromagnetism syllabus?'
    choices: ['Radiation from moving charges and retarded potentials', 'Gauss''s law', 'The Biot-Savart law', 'Faraday''s law']
    ans: 0
    why: 'Dispersion in plasmas, the covariant form of Maxwell''s equations, waveguides and transmission lines, and radiation with retarded potentials are the advanced topics; the others are core.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Electromagnetic Theory (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (Cambridge, 2017)'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (Wiley, 1999)'
  - 'E. Hecht, Optics, 5th ed. (Pearson, 2017)'
---

**Module 4 · about 30 minutes to read, 3 weeks to work through.** This roadmap covers what NET asks from electromagnetic theory, the order to study it, the fibub lessons for each topic, a worked NET-style example and a checklist.

<div class="bigidea">Every NET electromagnetism question is Maxwell's equations plus one simplification: a symmetry (statics), a boundary (images, Fresnel, waveguides), a medium (dielectrics, conductors, plasmas) or a distance (radiation zone). Name the simplification first and the method follows.</div>

## 1. What NET asks

Described from the published syllabus (check the current one):

**Part B (core):**
- Electrostatics: Gauss's law, Laplace and Poisson equations, boundary value problems.
- Magnetostatics: Biot-Savart law and Ampère's law; electromagnetic induction.
- Maxwell's equations in vacuum and in linear media; boundary conditions at interfaces.
- Scalar and vector potentials and gauge invariance.
- Electromagnetic waves in vacuum, dielectrics and conductors; reflection and refraction, polarisation, Fresnel's relations, interference, coherence and diffraction.
- Motion of charged particles in uniform static electric and magnetic fields.

**Part C (advanced):**
- Dispersion relations in plasmas.
- Lorentz invariance of Maxwell's equations.
- Transmission lines and waveguides.
- Radiation from moving charges and dipoles; retarded potentials.

Part B questions are typically a field, a potential, a boundary condition or a reflection coefficient. Part C adds a second layer: the cut-off of a guide mode, the plasma frequency from an electron density, the angular pattern of radiated power, how fields transform under a boost.

<div class="meaning">

<dl>
<dt>Boundary conditions</dt><dd>normal D and tangential E are continuous (no free surface charge); normal B and tangential H are continuous (no surface current)</dd>
<dt>Gauge freedom</dt><dd>A → A + ∇λ, V → V − ∂λ/∂t leaves E and B unchanged</dd>
<dt>Dipole radiation</dt><dd>intensity ∝ p₀²ω⁴ sin²θ / r²; total power ∝ p₀²ω⁴</dd>
<dt>Physical meaning</dt><dd>Static fields fall off as powers of r; only accelerating charges make fields that fall as 1/r and carry energy to infinity.</dd>
</dl>

</div>

## 2. The order to study it

1. **Refresh the basics** as needed with the JAM lessons: [Gauss's law](/learn/courses/iit-jam-physics/electrostatics-gauss/), [potential and energy](/learn/courses/iit-jam-physics/potential-energy/), [magnetostatics](/learn/courses/iit-jam-physics/magnetostatics/), [induction](/learn/courses/iit-jam-physics/induction/), [Maxwell's equations and waves](/learn/courses/iit-jam-physics/maxwell-em-waves/).
2. **Boundary value problems**: GATE [Laplace's equation](/learn/courses/gate-physics/boundary-value-problems/) and [the method of images](/learn/courses/gate-physics/method-of-images/).
3. **Multipoles**: GATE [multipole expansion](/learn/courses/gate-physics/multipoles/).
4. **Fields in matter**: GATE [polarisation and magnetisation](/learn/courses/gate-physics/fields-in-matter/); JAM [dielectrics](/learn/courses/iit-jam-physics/dielectrics/) and [magnetic materials](/learn/courses/iit-jam-physics/magnetic-materials/) for the basics.
5. **Potentials and gauges**: GATE [potentials and gauges](/learn/courses/gate-physics/potentials-gauges/).
6. **Waves in media**: GATE [waves in matter, conductors and plasmas](/learn/courses/gate-physics/em-waves-media/), then [Fresnel equations](/learn/courses/gate-physics/fresnel-equations/). Optics basics: JAM [interference](/learn/courses/iit-jam-physics/interference/), [diffraction](/learn/courses/iit-jam-physics/diffraction/), [polarisation](/learn/courses/iit-jam-physics/polarisation/).
7. **Guided waves**: GATE [waveguides, transmission lines and cavities](/learn/courses/gate-physics/waveguides/).
8. **Radiation**: GATE [radiation from dipoles and accelerated charges](/learn/courses/gate-physics/radiation/).
9. **Relativity and fields**: GATE [covariant electrodynamics](/learn/courses/gate-physics/covariant-electrodynamics/).
10. **NET extras in this course**: [lesson 4.2](/learn/courses/csir-net-physics/retarded-potentials/) (retarded and Liénard-Wiechert potentials) and [lesson 4.3](/learn/courses/csir-net-physics/plasma-dispersion/) (plasma oscillations and dispersion).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Laplace's equation, images | [GATE 3.1](/learn/courses/gate-physics/boundary-value-problems/), [GATE 3.2](/learn/courses/gate-physics/method-of-images/) | uniqueness, sphere in a uniform field, image charges for planes and spheres |
| Multipoles | [GATE 3.3](/learn/courses/gate-physics/multipoles/) | dipole and quadrupole moments of point-charge sets |
| Fields in matter | [GATE 3.4](/learn/courses/gate-physics/fields-in-matter/) | bound charges and currents, boundary conditions |
| Potentials, gauges | [GATE 3.5](/learn/courses/gate-physics/potentials-gauges/) | Coulomb and Lorenz gauges, which choices are allowed |
| Waves in media, skin depth | [GATE 3.6](/learn/courses/gate-physics/em-waves-media/) | complex refractive index, skin depth, plasma cut-off |
| Fresnel, Brewster, total reflection | [GATE 3.7](/learn/courses/gate-physics/fresnel-equations/) | reflectance at normal incidence, Brewster angle, evanescent waves |
| Waveguides, transmission lines | [GATE 3.8](/learn/courses/gate-physics/waveguides/) | cut-off frequency, group velocity, characteristic impedance, matching |
| Radiation | [GATE 3.9](/learn/courses/gate-physics/radiation/), [lesson 4.2](/learn/courses/csir-net-physics/retarded-potentials/) | Larmor formula, dipole pattern, ω⁴ scaling |
| Covariant form | [GATE 3.10](/learn/courses/gate-physics/covariant-electrodynamics/) | field tensor, invariants E·B and E² − c²B² |
| Plasma dispersion | [lesson 4.3](/learn/courses/csir-net-physics/plasma-dispersion/), [GATE 3.6](/learn/courses/gate-physics/em-waves-media/) | ω² = ω_p² + c²k², phase and group velocity |

## 4. A worked NET-style example

**Question (Part C style).** A small detector far from an oscillating electric dipole sits at 30° to the dipole axis and records an intensity `$I_0$`. The dipole's amplitude is then halved and its frequency doubled, and the detector is moved, at the same distance, to 90° from the axis. The new reading is

(a) `$I_0$` (b) `$4I_0$` (c) `$16I_0$` (d) `$64I_0$`.

**Solution.**

1. In the radiation zone the intensity of an oscillating dipole is

```math
I(r, \theta) = \frac{\mu_0\,p_0^2\,\omega^4}{32\pi^2c\,r^2}\sin^2\theta
```

2. Halving `$p_0$` multiplies `$I$` by `$\tfrac14$`; doubling `$\omega$` multiplies it by `$2^4 = 16$`. Together: `$\times4$`.
3. Moving from 30° to 90° changes `$\sin^2\theta$` from `$\tfrac14$` to 1: another `$\times4$`.
4. New reading `$= 16I_0$`: option (c).

**Traps.** Using `$\omega^2$` (the field amplitude goes as `$\omega^2$`, the intensity as `$\omega^4$`) gives (a); forgetting the angle change gives (b). A quick check: blue light scatters far more than red for the same reason (the `$\omega^4$` law behind the blue sky).

**A related live problem.** Waves in conductors are the other half of this unit:

<div class="problem" data-problem="net-skin-depth"></div>

## 5. Self-check before moving on

You are ready for quantum mechanics when you can, without notes:

- solve Laplace's equation in Cartesian and spherical coordinates for a simple boundary, and find a grounded-sphere image charge;
- write the dipole and quadrupole terms for a set of point charges;
- apply the four boundary conditions at an interface with and without surface charge or current;
- show that the Lorenz gauge condition can always be met, and write the wave equations for `$V$` and `$\vec A$`;
- find the skin depth and the phase of `$\vec B$` relative to `$\vec E$` in a good conductor;
- give the reflectance at normal incidence and the Brewster angle for glass;
- find the cut-off frequency of the `$\text{TE}_{10}$` mode of a rectangular guide;
- use the Larmor formula and the `$\sin^2\theta$` dipole pattern;
- state how `$\vec E$` and `$\vec B$` transform under a boost and name the two field invariants;
- derive the plasma frequency from the motion of free electrons.

<div class="myth">

**"Optics is a separate subject and NET skips it."** Reflection, refraction, polarisation, Fresnel's relations, interference, coherence and diffraction are all in the core electromagnetism syllabus. Revise them with the JAM optics lessons, then the [GATE Fresnel lesson](/learn/courses/gate-physics/fresnel-equations/).

</div>

<div class="keypoints">

- Part B: statics and boundary values, induction, Maxwell's equations in media, potentials and gauges, waves and optics, charges in fields.
- Part C: plasma dispersion, covariant form, waveguides and transmission lines, radiation and retarded potentials.
- Order: boundary values and images, multipoles, fields in matter, potentials, waves in media and Fresnel, waveguides, radiation, covariant form, lessons [4.2](/learn/courses/csir-net-physics/retarded-potentials/) and [4.3](/learn/courses/csir-net-physics/plasma-dispersion/).
- Dipole radiation: intensity ∝ `$p_0^2\omega^4\sin^2\theta/r^2$`.

</div>

## Practise: a mixed electromagnetism set

<div class="qbank" data-bank="physics" data-topics="boundary-value-problems,method-of-images,multipoles,fields-in-matter,potentials-gauges,em-waves-media,fresnel-equations,waveguides,radiation,covariant-electrodynamics" data-exam="net" data-n="10"></div>

**Next:** the first lesson of this unit, [Retarded and Liénard-Wiechert potentials](/learn/courses/csir-net-physics/retarded-potentials/). Already strong in this unit? Skip ahead to the [quantum mechanics roadmap](/learn/courses/csir-net-physics/quantum-roadmap/).
