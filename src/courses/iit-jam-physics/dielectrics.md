---
title: Dielectrics and capacitors
seoTitle: Dielectrics and capacitors for IIT JAM Physics
summary: 'Polarisation and bound charge, the displacement field D and Gauss''s law for free charge, linear dielectrics and their boundary conditions, capacitors of every shape with slabs and layers, stored energy, the pull on a slab with the battery connected or removed, and the dielectric sphere.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A capacitor is charged, disconnected, and then filled with a dielectric of constant 3. What happens to its stored energy?
    choices: ['It falls to a third', 'It triples', 'It stays the same', 'It falls to a ninth']
    ans: 0
    why: Disconnected, the charge Q is fixed. U = Q²/2C and C triples, so U falls to a third. The lost energy did the work of pulling the slab in.
  - q: Two layers of equal thickness, κ = 2 and κ = 6, fill the gap of a parallel-plate capacitor (one above the other). Which way are they combined?
    choices: ['In series', 'In parallel', 'Neither: just average κ', 'It depends on the battery']
    ans: 0
    why: Stacked layers carry the same D and their voltages add, so they act in series. Side-by-side halves share the same voltage and act in parallel.
  - q: What is the total bound charge on a neutral piece of polarised dielectric?
    choices: ['Zero', 'Equal to its surface bound charge', 'Q_free/κ', 'It depends on the shape']
    ans: 0
    why: Polarisation only shifts charge inside molecules. The volume bound charge −∇·P exactly cancels the surface bound charge P·n.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 4: electric fields in matter'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapters 3 and 10'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapter 31'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to find bound charges from a polarisation, use `$\vec D$` to skip them, apply the boundary conditions at a dielectric interface, compute the capacitance of any parallel-plate, spherical or cylindrical capacitor with slabs and layers, track energy when a battery is or is not connected, and find the force that pulls a slab in.

<div class="bigidea">An insulator in a field cannot let charge flow, but it can let each molecule stretch into a tiny dipole; the ends of all those dipoles leave bound charge on the surface that weakens the field inside, and that is why a dielectric raises capacitance.</div>

## 1. Polarisation and bound charge

In a field, the electron cloud of each atom shifts a little against the nucleus (or polar molecules turn to line up). Each becomes a small dipole. The **polarisation** `$\vec P$` is the dipole moment per unit volume, in C/m².

A polarised material is equivalent to two sets of charge:

```math
\sigma_b = \vec P\cdot\hat n \ \ (\text{on the surface}), \qquad \rho_b = -\nabla\cdot\vec P \ \ (\text{inside})
```

Picture uniform `$\vec P$` in a slab: inside, the head of each dipole sits next to the tail of the next and they cancel; on the face the arrows point to there is an uncovered layer of `$+$` ends, on the opposite face of `$-$` ends. Where `$\vec P$` spreads out (positive divergence), more tails than heads are left behind: negative `$\rho_b$`. The bound charges always total zero.

**Worked example.** `$\vec P = kr\,\hat r$` in a sphere of radius `$R$`: `$\rho_b = -\dfrac{1}{r^2}\dfrac{d}{dr}(kr^3) = -3k$` and `$\sigma_b = kR$`. Check: `$-3k\cdot\tfrac43\pi R^3 + kR\cdot4\pi R^2 = 0$`.

## 2. The displacement field D

The field comes from all charges, free and bound. Since bound charge depends on the field, it is easier to define

```math
\vec D = \epsilon_0\vec E + \vec P, \qquad \nabla\cdot\vec D = \rho_f, \qquad \oint\vec D\cdot d\vec a = Q_{f,\text{enc}}
```

Gauss's law for `$\vec D$` needs only the free charge, which you control. In a **linear** dielectric `$\vec P = \epsilon_0\chi_e\vec E$`, so `$\vec D = \epsilon_0(1 + \chi_e)\vec E = \epsilon\vec E$` with `$\epsilon_r = \kappa = 1 + \chi_e$` (water about 80, glass 5 to 10, air 1.0006).

**Worked example.** A point charge `$q$` in a big block of dielectric `$\epsilon_r$`: `$D = q/4\pi r^2$`, so `$E = \dfrac{q}{4\pi\epsilon_0\epsilon_rr^2}$`. The charge looks like `$q/\epsilon_r$` because a shell of bound charge `$-q(1 - 1/\epsilon_r)$` gathers right round it.

<div class="meaning">

<dl>
<dt>P</dt><dd>how strongly the material is polarised: dipole moment in each cubic metre</dd>
<dt>σ_b, ρ_b</dt><dd>the uncovered ends of the dipoles; real charge, but tied to molecules</dd>
<dt>D</dt><dd>a field whose sources are free charges only; it lets you use Gauss's law without knowing P first</dd>
<dt>κ = ε_r</dt><dd>the factor by which a material that fills all the space weakens the field of given free charges</dd>
<dt>Physical meaning</dt><dd>A dielectric fights the field that polarises it: the bound charge it exposes points the opposite way to the applied field, so the field inside is smaller and the same voltage stores more charge.</dd>
</dl>

</div>

<div class="myth">

**"D is like E, but you use only free charges in Coulomb's law."** No. `$\nabla\cdot\vec D = \rho_f$`, but `$\nabla\times\vec D = \nabla\times\vec P$`, which is not zero in general (at the edges of a polarised bar, for instance). Gauss's law for `$\vec D$` is useful only when symmetry alone fixes the direction of `$\vec D$`: planes, cylinders, spheres.

</div>

## 3. Boundary conditions

At a boundary with no free charge, a thin loop and a thin pillbox give

```math
E_{1\parallel} = E_{2\parallel}, \qquad D_{1\perp} = D_{2\perp}
```

So field lines bend: `$\dfrac{\tan\theta_2}{\tan\theta_1} = \dfrac{\epsilon_2}{\epsilon_1}$`, away from the normal entering the higher-permittivity side. At `$30^\circ$` going from `$\epsilon_r = 2$` into `$\epsilon_r = 6$`, `$\tan\theta_2 = 3\tan30^\circ$` and `$\theta_2 = 60^\circ$`.

Three standard shapes in a uniform field `$E_0$`: a slab **across** the field has `$E_{\text{in}} = E_0/\kappa$` (continuity of `$D_\perp$`); a slab **along** the field has `$E_{\text{in}} = E_0$` (continuity of `$E_\parallel$`); a **sphere** has a uniform

```math
E_{\text{in}} = \frac{3}{\kappa + 2}E_0, \qquad P = 3\epsilon_0\frac{\kappa - 1}{\kappa + 2}E_0
```

As `$\kappa\to\infty$` this becomes the metal sphere of the [previous lesson](/learn/courses/iit-jam-physics/conductors-images/): `$E_{\text{in}} = 0$`, `$\sigma = 3\epsilon_0E_0\cos\theta$`. A uniformly polarised sphere with no outside field (an electret) has `$\vec E_{\text{in}} = -\vec P/3\epsilon_0$`, the depolarising field. Microscopically, each molecule feels `$E + P/3\epsilon_0$`, which leads to the **Clausius-Mossotti relation** `$\dfrac{\kappa - 1}{\kappa + 2} = \dfrac{N\alpha}{3\epsilon_0}$`.

## 4. Capacitors

`$C = Q/V$`, found by putting `$\pm Q$` on the conductors, finding `$E$` (or `$D$`) by Gauss's law, and integrating for `$V$`.

| Shape | Capacitance (filled with `$\kappa$`) |
|---|---|
| Parallel plates, area `$A$`, gap `$d$` | `$\kappa\epsilon_0A/d$` |
| Concentric spheres `$a < b$` | `$4\pi\kappa\epsilon_0\,ab/(b - a)$` (isolated sphere: `$b\to\infty$`, `$4\pi\epsilon_0a$`) |
| Coaxial cylinders, per length | `$2\pi\kappa\epsilon_0/\ln(b/a)$` |

**Partial filling.** Layers stacked across the gap are in **series** (same `$D$`, voltages add); regions side by side are in **parallel** (same voltage, charges add).

- A slab of thickness `$t$` in a gap `$d$`: `$C = \dfrac{\epsilon_0A}{d - t + t/\kappa}$`, wherever it sits in the gap.
- Two equal layers `$\kappa_1$`, `$\kappa_2$`: `$\dfrac{2\epsilon_0A}{d}\dfrac{\kappa_1\kappa_2}{\kappa_1 + \kappa_2}$`. Two halves side by side: `$\dfrac{\epsilon_0A}{2d}(\kappa_1 + \kappa_2)$`.
- A permittivity that varies smoothly across the gap: `$\dfrac1C = \displaystyle\int\frac{dx}{\epsilon(x)A}$`.

**Worked example.** Gap 5.0 mm, area 0.010 m², slab 2.0 mm thick with `$\kappa = 4$`: effective gap `$3.0 + 0.5 = 3.5$` mm, so `$C = \dfrac{8.854\times10^{-12}\times0.010}{3.5\times10^{-3}} = 25.3$` pF.

<div class="problem" data-problem="slab-capacitance"></div>

The bound charge on a dielectric face next to a plate with free density `$\sigma_f$` is `$\sigma_f(1 - 1/\kappa)$`, opposite in sign. Between two different layers there is a net bound charge too: with `$\kappa_1 = 2$` next to the `$+$` plate and `$\kappa_2 = 4$` beyond it, the interface carries `$\sigma_f(1/4 - 1/2) = -\sigma_f/4$`. The [capacitor and inductor calculator](/science/capacitor-inductor-calculator/) handles plates with one or two dielectric layers, coaxial cables and spheres.

## 5. Energy, and battery connected or not

The stored energy is `$U = \tfrac12CV^2 = \dfrac{Q^2}{2C} = \tfrac12QV$`, or `$\tfrac12\vec D\cdot\vec E$` per unit volume. **Before any capacitor question, ask what is held fixed.**

| Slab of `$\kappa$` slid in to fill the gap | `$Q$` | `$V$` | `$E$` | `$U$` |
|---|---|---|---|---|
| Battery connected (`$V$` fixed) | `$\times\kappa$` | same | same | `$\times\kappa$` |
| Isolated (`$Q$` fixed) | same | `$\div\kappa$` | `$\div\kappa$` | `$\div\kappa$` |

With the battery connected the battery does work `$V\Delta Q = 2\Delta U$`: half is stored, half goes into pulling the slab. Joining a charged capacitor to an uncharged one always loses energy, `$\dfrac{C_1C_2}{2(C_1 + C_2)}(V_1 - V_2)^2$`, whatever the wires; charging any capacitor from a battery wastes exactly half of what the battery gives.

## 6. The force that pulls a slab in

A slab partly inside a capacitor is pulled in by the fringing field at the edge. Energy gives it without looking at the fringe: with the slab a length `$x$` inside plates of width `$w$`, `$C(x) = \dfrac{\epsilon_0w}{d}[\kappa x + (L - x)]$`.

<figure class="fig" data-fig="dielectric-slab"><figcaption>Slide the slab in with the battery connected or removed. The graph shows the stored energy: it rises with the battery connected and falls when isolated, yet the slab is pulled in either way.</figcaption></figure>

<div class="steps">
<div class="step"><p><b>Isolated (Q fixed).</b> No battery, so the force is −dU/dx with U = Q²/2C: F = (Q²/2C²) dC/dx. The energy falls as the slab enters.</p></div>
<div class="step"><p><b>Battery connected (V fixed).</b> Now the battery also does work. Counting it, F = +½V² dC/dx, even though U = ½CV² rises.</p></div>
<div class="step"><p><b>Put in the capacitance.</b> dC/dx = ε₀w(κ − 1)/d, so at fixed V: F = ε₀(κ − 1)wV²/2d, the same at every x.</p></div>
<div class="step"><p><b>A liquid rises.</b> Vertical plates dipped in an oil: the same force holds up a column of height h = ε₀(κ − 1)V²/(2ρgd²).</p></div>
</div>

**Worked example.** Plates 10 cm wide, gap 2.0 mm, 200 V, `$\kappa = 3$`: `$F = \dfrac{(8.854\times10^{-12})(2)(0.10)(200)^2}{2(2\times10^{-3})} = 17.7\ \mu$`N.

**Leaky capacitors.** Fill any capacitor with material of permittivity `$\epsilon$` and small conductivity `$\sigma$`: the charge leaks with time constant `$RC = \epsilon/\sigma$`, whatever the shape ([lesson 4.8](/learn/courses/iit-jam-physics/circuits/) does RC circuits in full).

<div class="keypoints">

- `$\sigma_b = \vec P\cdot\hat n$`, `$\rho_b = -\nabla\cdot\vec P$`, total bound charge zero.
- `$\vec D = \epsilon_0\vec E + \vec P$`, `$\oint\vec D\cdot d\vec a = Q_f$`; linear: `$\vec D = \epsilon\vec E$`, `$\kappa = 1 + \chi_e$`.
- Boundaries: `$E_\parallel$` and `$D_\perp$` continuous; `$\tan\theta_2/\tan\theta_1 = \epsilon_2/\epsilon_1$`. Sphere in `$E_0$`: `$E_{\text{in}} = 3E_0/(\kappa + 2)$`.
- `$C$`: plates `$\kappa\epsilon_0A/d$`, spheres `$4\pi\kappa\epsilon_0ab/(b - a)$`, coax `$2\pi\kappa\epsilon_0/\ln(b/a)$`. Layers in series, side by side in parallel; slab: `$\epsilon_0A/(d - t + t/\kappa)$`.
- Battery connected: `$Q, U\times\kappa$`. Isolated: `$V, E, U\div\kappa$`. Battery work `$= 2\Delta U$`; sharing charge always loses energy.
- Slab force at fixed `$V$`: `$\epsilon_0(\kappa - 1)wV^2/2d$`. Bound charge next to a plate `$\sigma_f(1 - 1/\kappa)$`.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [dielectrics practice page](/learn/courses/iit-jam-physics/practice/dielectrics/).

<div class="qbank" data-bank="physics" data-topics="dielectrics" data-exam="jam" data-n="10"></div>

**Next:** [magnetic fields: Biot-Savart and Ampère](/learn/courses/iit-jam-physics/magnetostatics/), then [magnetic materials](/learn/courses/iit-jam-physics/magnetic-materials/), which repeats this whole story for magnetism, with `$\vec M$` for `$\vec P$` and `$\vec H$` for `$\vec D$`. Back to [conductors and images](/learn/courses/iit-jam-physics/conductors-images/). For [fields in matter](/learn/courses/gate-physics/fields-in-matter/) at MSc level, see the GATE Physics course; CSIR NET adds [dielectric and optical properties of solids](/learn/courses/csir-net-physics/dielectric-optical/).
