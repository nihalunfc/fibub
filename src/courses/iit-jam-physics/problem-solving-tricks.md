---
title: 'Solving faster: dimensions, limits, symmetry and elimination'
seoTitle: IIT JAM Physics problem-solving tricks and shortcuts
summary: 'Eight habits that turn a long calculation into a quick, safe answer in JAM: dimension checks, limiting and special cases, symmetry, invariants such as trace and determinant, bounds and signs, handy numbers for estimates, conservation laws before forces, and working back from the options, each with worked examples from across the syllabus.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: 'A student finds that a block slides down a frictionless incline of angle θ with acceleration g cos θ. Which quick check shows the answer is wrong?'
    choices: ['At θ = 0 (a flat surface) it gives g instead of 0', 'Its dimensions are not those of acceleration', 'It is negative for small θ', 'It gives 0 for a vertical drop, which is correct']
    ans: 0
    why: 'On a flat surface the block should not accelerate at all, but g cos 0 = g. The right answer, g sin θ, gives 0 at θ = 0 and g at θ = 90°. Both answers have the right dimensions, so only a limiting case catches the slip.'
  - q: 'A 2 × 2 matrix has trace 6 and determinant 8. What are its eigenvalues?'
    choices: ['2 and 4', '1 and 8', '3 and 3', '−2 and −4']
    ans: 0
    why: 'The eigenvalues add up to the trace and multiply to the determinant: 2 + 4 = 6 and 2 × 4 = 8. No characteristic equation needed.'
  - q: 'A point charge q sits at the centre of a cube. What is the electric flux through one face?'
    choices: ['q/(6ε₀)', 'q/ε₀', 'q/(24ε₀)', 'Zero']
    ans: 0
    why: 'Gauss: the total flux through the closed cube is q/ε₀. By symmetry all six faces are alike, so each carries one sixth.'
sources:
  - 'S. Mahajan, Street-Fighting Mathematics (MIT Press, 2010; free under CC BY-NC-SA)'
  - 'S. Mahajan, The Art of Insight in Science and Engineering (MIT Press, 2014; free under CC BY-NC-SA)'
  - 'G. Pólya, How to Solve It, 2nd ed. (Princeton, 1957)'
  - 'IIT JAM Physics syllabus, published by the organising IIT each year'
---

**Module 8 · about 35 minutes.** By the end you will have a short checklist that catches most wrong answers in seconds, and eight tricks that often give the answer with little or no calculation. Every worked example below is a typical JAM-style question from a different part of the syllabus.

<div class="bigidea">Most exam options are wrong in a way you can see without solving the problem: the wrong units, the wrong behaviour in a simple limit, the wrong symmetry or an impossible size. Check those first, and solve only what is left.</div>

## Why this matters in JAM

In the [JAM paper](/learn/courses/iit-jam-physics/jam-exam-pattern/) you have about 1.8 minutes per mark, and a wrong MCQ costs a third of its marks. Every option you can rule out raises your chance of being right; ruling out one of four already makes a guess worth taking. The same checks catch slips in your own working before you lock in an NAT answer.

<div class="meaning">

<dl>
<dt>Dimensions</dt><dd>both sides of an equation, and every term in a sum, must have the same units</dd>
<dt>Limits</dt><dd>set a parameter to 0, ∞ or a special value where you already know the answer</dd>
<dt>Symmetry</dt><dd>parts that look alike must contribute alike; odd functions integrate to zero over symmetric ranges</dd>
<dt>Invariants</dt><dd>quantities you can find without the full solution: trace, determinant, total charge, energy, momentum</dd>
<dt>Bounds and signs</dt><dd>probabilities between 0 and 1, speeds below c, efficiencies below the Carnot value, heat capacities positive</dd>
<dt>Physical meaning</dt><dd>A formula is a claim about the world. It must hold in every case you can check, not just the one in the question.</dd>
</dl>

</div>

## 1. Dimensions: the 10-second filter

Write each quantity in powers of mass M, length L and time T (add current or temperature when needed). Options with the wrong dimensions are out at once.

**Worked example.** A particle of mass `$m$` is confined to a box of width `$L$`. Which could be its allowed energies (`$n = 1, 2, 3, \ldots$`)?

(i) `$\dfrac{n^2h^2}{8mL^2}$` (ii) `$\dfrac{nh}{8mL^2}$` (iii) `$\dfrac{n^2h^2}{8mL}$` (iv) `$\dfrac{n^2hL}{8m}$`

Planck's constant has dimensions of energy × time, M L² T⁻¹. Then `$h^2/(mL^2)$` is M² L⁴ T⁻² / (M L²) = M L² T⁻², an energy. Option (ii) has one power of `$h$` too few, (iii) one power of `$L$` too many, (iv) is not even close. Only (i) survives, and it is the answer from [the Schrödinger equation lesson](/learn/courses/iit-jam-physics/schrodinger-equation/).

**Dimensions can also find a formula.** If a quantity depends on only three others, matching the powers of M, L and T gives three equations for the three exponents. A liquid drop held together by surface tension `$\sigma$` (N/m, that is M T⁻²) oscillates with a period set by `$\rho$`, `$r$` and `$\sigma$`: matching gives `$T \propto \sqrt{\rho r^3/\sigma}$`. Only the number in front is left unknown.

<div class="problem" data-problem="dimension-exponent"></div>

Dimensions cannot tell `$\sin\theta$` from `$\cos\theta$`, or 2 from π. For that you need the next trick.

## 2. Limiting and special cases

Choose a value of a parameter where you already know the answer, and test every option.

**Worked example (mechanics).** A block of mass `$m$` slides on the frictionless sloping face (angle `$\theta$`) of a wedge of mass `$M$`, which itself can slide on a frictionless floor. Which could be the wedge's acceleration?

(i) `$\dfrac{mg\sin\theta\cos\theta}{M + m\sin^2\theta}$` (ii) `$\dfrac{mg\sin\theta\cos\theta}{M + m\cos^2\theta}$` (iii) `$\dfrac{mg\sin\theta}{M + m}$` (iv) `$\dfrac{mg\cos\theta}{M + m\sin^2\theta}$`

<div class="steps">
<div class="step"><p><b>Flat wedge, θ = 0.</b> The block just sits on a flat surface and pushes straight down: the wedge must not move. Option (iv) gives mg/M. Out.</p></div>
<div class="step"><p><b>Vertical face, θ = 90°.</b> The block falls freely beside a vertical wall and never pushes sideways: again zero. Option (iii) gives mg/(M + m). Out.</p></div>
<div class="step"><p><b>Very heavy wedge, M → ∞.</b> Both (i) and (ii) go to zero, as they should. Need a sharper test.</p></div>
<div class="step"><p><b>Massless wedge, M → 0.</b> A wedge with no mass cannot have a net force on it, so the block cannot press on it at all: the block falls freely with g, and the wedge must slide away just fast enough for the slope to drop at g. A slope of angle θ sliding sideways by x drops by x tan θ under a fixed point, so the wedge's acceleration is g/tan θ = g cot θ.</p></div>
<div class="step"><p><b>Decide.</b> Option (i) with M = 0 gives g sin θ cos θ / sin²θ = g cot θ. Option (ii) gives g tan θ. The answer is (i), found without writing a single force equation.</p></div>
</div>

Limits that work almost everywhere:

| Area | Limit to test | What must happen |
|---|---|---|
| Mechanics | equal masses, zero angle, infinite mass, zero friction | symmetry, rest, the textbook case |
| Relativity | `$v \ll c$` | Newtonian results, `$\gamma \to 1$` |
| Optics | slit width → 0 or very large | wide spreading or a sharp geometrical shadow |
| Thermodynamics | `$T_c = T_h$` | zero work, zero efficiency |
| Quantum | `$\hbar \to 0$` or large quantum numbers | the classical result |
| Circuits | `$R \to 0$` or `$\infty$`, `$\omega \to 0$` or `$\infty$` | a short or open circuit; capacitors open at DC, inductors short |
| Blackbody | `$h\nu \ll kT$` | the classical Rayleigh–Jeans law |

## 3. Symmetry

If a rotation, reflection or swap leaves the problem unchanged, it must leave the answer unchanged.

- **Fields.** The electric field at the centre of a uniformly charged ring, or of a spherical shell, is zero: every bit of charge has a partner opposite.
- **Gauss with symmetry.** A charge `$q$` at the centre of a cube: total flux `$q/\varepsilon_0$`, six equal faces, so `$q/6\varepsilon_0$` through each. Move the charge to a corner: only one eighth of its field lines go into the cube, `$q/8\varepsilon_0$`, shared equally by the three far faces (`$q/24\varepsilon_0$` each); the three faces that meet at the corner carry none, because the field runs along them.
- **Odd integrands.** `$\int_{-a}^{a} x^3\cos x\,dx = 0$` and `$\langle x\rangle = 0$` for any even probability density, without integrating.
- **Exchange.** If swapping two masses (or two resistors) leaves the set-up the same, the answer must be symmetric in them. An option like `$m_1^2m_2$` with no partner `$m_1m_2^2$` is suspicious.

## 4. Invariants: answers without the full solution

Some quantities can be found long before (or instead of) the full answer.

**Worked example (matrices).** The eigenvalues of `$\begin{pmatrix}4 & 1\\ 2 & 3\end{pmatrix}$` are one of: {5, 2}, {6, 1}, {4, 3}, {−5, −2}. The trace is 7 and the determinant is 10. Eigenvalues add to the trace (rules out {−5, −2}) and multiply to the determinant (rules out {6, 1} and {4, 3}). Answer {5, 2}. See the [matrices lesson](/learn/courses/iit-jam-physics/matrices/) for why.

Other invariants: total charge, energy, momentum and angular momentum; the number of nodes of a bound-state wavefunction (`$n - 1$` for the `$n$`th state of a well); the number of independent components of a tensor; `$Z$` and `$A$` in a nuclear reaction.

## 5. Bounds, signs and sizes

Many options are simply impossible.

**Worked example (relativity).** A rocket moving at `$0.6c$` fires a probe forward at `$0.8c$` relative to itself. Its speed relative to the ground is one of `$1.4c$`, `$0.95c$`, `$0.2c$`, `$0.48c$`. Nothing goes faster than light: `$1.4c$` is out. Adding a forward velocity must give more than either alone: `$0.2c$` and `$0.48c$` are out. Answer `$0.95c$` (exactly `$1.4/1.48 = 0.946c$`, from [special relativity](/learn/courses/iit-jam-physics/special-relativity/)).

Bounds to keep in mind: probabilities and transmission or reflection coefficients lie between 0 and 1; efficiencies stay below `$1 - T_c/T_h$`; heat capacities and compressibilities are positive; entropy of an isolated system never falls; a stable equilibrium needs a positive second derivative of the potential.

## 6. Handy numbers for estimates

With a few numbers in your head you can estimate most answers to 10% and spot the option that is off by a power of ten.

| Quantity | Value |
|---|---|
| `$hc$` | 1240 eV nm |
| `$\hbar c$` | 197 eV nm = 197 MeV fm |
| `$e^2/4\pi\varepsilon_0$` | 1.44 eV nm = 1.44 MeV fm |
| `$kT$` at 300 K | 0.0259 eV, about 1/40 eV |
| `$m_ec^2$`, `$m_pc^2$` | 0.511 MeV, 938 MeV |
| Hydrogen ground state, Bohr radius | 13.6 eV, 0.0529 nm |
| 1 u | 931.5 MeV/`$c^2$` |
| `$1/4\pi\varepsilon_0$`, `$\mu_0/4\pi$` | `$9\times10^9$` SI, `$10^{-7}$` SI |

**Worked example.** Check the Bohr radius from these: `$a_0 = \hbar c/(\alpha\,m_ec^2)$` with `$\alpha = 1/137$`: `$197\times137/511\,000 = 0.0528$` nm. Or estimate the energy of a visible photon: `$1240/500 = 2.5$` eV, much bigger than `$kT$` at room temperature, which is why you do not glow.

## 7. Conservation before forces

If a question asks for a speed, a height or a final state, and not for a time or a force at every instant, try energy and momentum first.

**Worked example.** A small bead slides from rest at the top of a smooth fixed sphere of radius `$R$`. Where does it leave the surface? Energy: `$v^2 = 2gR(1 - \cos\theta)$`. Radial direction: it leaves when the normal force reaches zero, `$mg\cos\theta = mv^2/R$`. Together: `$\cos\theta = 2(1 - \cos\theta)$`, so `$\cos\theta = 2/3$`: three lines, with no differential equation.

The same habit pays in collisions (momentum, then energy if elastic), in orbits (energy and angular momentum, as in [central forces](/learn/courses/iit-jam-physics/central-forces/)), and in nuclear reactions (Q-values and momentum sharing).

## 8. Work back from the options

When the options are numbers or simple expressions, it is sometimes faster to test them than to solve.

- **Substitute.** "Which `$x$` satisfies …?" Put each option in.
- **Plug a number.** With symbolic options, give the parameters easy values (say `$m = 1$`, `$\theta = 45^\circ$`) and compute the one case numerically.
- **Look at how options differ.** If three options share a factor and one does not, the examiner has probably built the wrong ones by changing exactly the thing you need to check.

<div class="myth">

**"Tricks are for people who do not know the physics."** Every trick here is physics: dimensions, symmetry and limits are how researchers check their own results. In JAM they are also how you stay inside 1.8 minutes per mark.

**"If the dimensions are right, the answer is right."** Dimensions miss numbers, signs and sine-versus-cosine slips. Always add one limiting case.

</div>

<div class="keypoints">

- Check every option's dimensions first; use dimensions to find exponents when one quantity depends on three others.
- Test limits where the answer is known (angle 0 or 90°, mass 0 or ∞, `$v \ll c$`, `$T_c = T_h$`, `$h\nu \ll kT$`).
- Use symmetry: equal parts give equal shares (cube faces, ring fields), odd integrands vanish over symmetric ranges.
- Eigenvalues: sum = trace, product = determinant. Count conserved quantities before solving.
- Throw out the impossible: probabilities above 1, speeds above `$c$`, efficiencies above Carnot, negative heat capacities.
- Carry `$hc = 1240$` eV nm, `$\hbar c = 197$` MeV fm, `$e^2/4\pi\varepsilon_0 = 1.44$` MeV fm, `$kT_{300} = 1/40$` eV.
- Energy and momentum before forces; substitute options or plug easy numbers when the options allow it.

</div>

## Practise: use the tricks on real questions

A mixed set of harder questions from across the syllabus. Before solving each one, spend twenty seconds ruling options out with the checks above.

<div class="qbank" data-bank="physics" data-topics="central-forces,interference,first-law,photons,special-relativity,matrices,electrostatics-gauss,schrodinger-equation" data-exam="jam" data-level="3,4,5" data-n="12"></div>

**Before this:** [lesson 8.1, the JAM paper](/learn/courses/iit-jam-physics/jam-exam-pattern/). **Next:** put it all together in a full [mock test](/learn/courses/iit-jam-physics/mock-test/) under exam conditions, and keep sharpening weak topics on the [practice pages](/learn/courses/iit-jam-physics/practice/).
