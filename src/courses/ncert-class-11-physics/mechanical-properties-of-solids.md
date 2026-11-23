---
title: Mechanical Properties of Solids
seoTitle: 'Mechanical Properties of Solids Class 11 notes, Hooke'
summary: 'Class 11 Mechanical Properties of Solids with animations: stress, strain, Hooke''s law, the three moduli, the stress-strain curve and elastic energy.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'A wire is stretched by a force F and extends by ΔL. If the same force acts on a wire of the same material with double the length and double the diameter, the extension is:'
    choices: ['ΔL', 'ΔL/2', 'ΔL/4', '2ΔL']
    ans: 1
    why: 'ΔL = FL/(AY). Doubling L doubles ΔL, doubling the diameter makes the area 4 times, dividing by 4. Net: 2/4 = 1/2, so ΔL/2.'
  - q: 'On the stress-strain curve of a ductile metal, the region where the wire does not return to its original length when unloaded begins at:'
    choices: ['the origin', 'the proportional limit', 'the elastic limit (yield point)', 'only at the breaking point']
    ans: 2
    why: 'Up to the elastic limit the wire returns to its original length. Beyond it, plastic deformation leaves a permanent stretch.'
  - q: 'The energy stored per unit volume in a wire stretched within the elastic limit is:'
    choices: ['stress × strain', '½ × stress × strain', 'stress / strain', '½ × stress / strain']
    ans: 1
    why: 'The work is the area of the triangle under the force-extension graph, ½ F ΔL; dividing by the volume AL gives ½ × stress × strain.'
sources:
  - 'NCERT Class 11 Physics, Chapter 8 “Mechanical Properties of Solids” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Young''s modulus, shear modulus and bulk modulus of common materials: CRC Handbook of Chemistry and Physics, 97th edition, “Elastic constants of metals and alloys”'
  - 'Hooke, R. (1678), De Potentia Restitutiva, or Of Spring (for the history box)'
---

**Physics · Class 11 · Chapter 8 · about 70 minutes.** By the end you will be able to define stress and strain, state Hooke’s law, use the three elastic moduli, read a stress-strain curve, find the energy stored in a stretched wire, and choose a safe cable for a given load.

<div class="bigidea">Atoms in a solid are held in place by bonds that act like tiny springs. Pull or push the solid and the bonds stretch or squeeze, then pull everything back when you let go. Stress (force per area) and strain (fractional change) measure this, and for small changes they are proportional: that is Hooke’s law. The constant of proportionality, the modulus, tells you how stiff the material is.</div>

## 1. Elasticity and plasticity

A body that regains its original shape and size when the deforming force is removed is **elastic**. A body that stays deformed is **plastic**. Steel, bone and a rubber band are elastic over a useful range; wet clay and putty are mostly plastic. No real body is perfectly elastic, but quartz and phosphor-bronze come close, which is why they are used in watches and springs.

Why do solids spring back? Each atom sits at the bottom of a potential well formed by its neighbours. Pull it a little and the neighbours pull it back, like a ball in a bowl.

<figure class="fig" data-fig="@wt-hooke-lattice"><figcaption>Atoms joined by springs. Apply a stress and the lattice stretches. Switch material and note that the same stress gives much less strain in steel than in a soft metal: the springs are stiffer.</figcaption></figure>

<div class="myth">

**“A steel wire is less elastic than rubber because rubber stretches more.”** Elasticity means returning to the original shape, not stretching easily. Steel returns exactly after a given force; rubber stretches far more but is less perfectly restored. In physics, steel is the more elastic material.

</div>

## 2. Stress and strain

When a force acts on a body, the body develops an internal restoring force. **Stress** is this restoring force per unit area, equal in size to the applied force per unit area:

```math
\text{stress} = \frac{F}{A}\quad(\text{unit: N/m}^2 = \text{Pa})
```

**Strain** is the fractional change that results. It has no unit.

- **Longitudinal strain** (stretching or compressing): `$\dfrac{\Delta L}{L}$`.
- **Shearing strain** (sliding layers): `$\dfrac{\Delta x}{h} = \tan\theta \approx \theta$`.
- **Volume strain** (squeezing from all sides): `$\dfrac{\Delta V}{V}$`.

Stress can be tensile (pulling), compressive (pushing) or shearing (sliding), and pressure acting on all sides is called hydraulic stress.

<div class="meaning">

<dl>
<dt>F</dt><dd>force acting perpendicular to the cross-section (N)</dd>
<dt>A</dt><dd>area of the cross-section (m²)</dd>
<dt>ΔL, L</dt><dd>change in length and original length</dd>
<dt>Physical meaning</dt><dd>Stress is how hard the material is being pushed; strain is how much it gave. A thin wire carrying the same load as a thick one has more stress, because the same force is shared over less area, like one chai glass held by one finger or by the whole palm.</dd>
</dl>

</div>

## 3. Hooke’s law and Young’s modulus

Robert Hooke found that for small deformations **stress is proportional to strain**:

```math
\text{stress} = Y \times \text{strain}
```

The constant is a property of the material. For a wire this is **Young’s modulus** `$Y$`:

```math
Y = \frac{F/A}{\Delta L/L} = \frac{FL}{A\,\Delta L}\qquad\Longrightarrow\qquad \Delta L = \frac{FL}{AY}
```

A large Y means a stiff material. Steel is about 200 GPa, copper 110 GPa, lead 16 GPa, and rubber only about 0.01 to 0.1 GPa.

<figure class="fig" data-fig="c11p-solid-stretch"><figcaption>Hang a load on a wire. Change the material, load, length and thickness and watch the stress, strain and extension. The picture exaggerates the stretch; look at the numbers for the true value (usually a fraction of a millimetre).</figcaption></figure>

<div class="problem" data-problem="c11p-solid-young"></div>

Test a real material in the virtual lab, with a load that you increase step by step:

<!--fig:tool stress-strain-test-->

A spring is the same law in another form: `$F = kx$`. Compare the two on a mass and spring:

<!--fig:tool spring-mass-->

More material properties, with curves for several metals, are in the [Stress-strain analyser](/science/stress-strain-analyser/). Then try the idea on a loaded wire again. For a wire of the same material, which changes ΔL the most: doubling the length, or halving the diameter?

<div class="history">

**1678.** Robert Hooke publishes his law of springs as an anagram, ceiiinosssttuv, in 1676, and reveals it two years later: *ut tensio, sic vis*, “as the extension, so the force”. He used it to design watch springs.

</div>

## 4. The stress-strain curve

If you pull a metal wire harder and harder and plot stress against strain you get a curve with a clear shape. Use the figure: slide the pull, choose a material, and press Release to watch the wire unload.

<figure class="fig" data-fig="c11p-solid-curve"><figcaption>Ductile metal: straight at first (Hooke’s law), then elastic limit, yield, strain hardening, the highest stress (ultimate strength), necking and fracture. Glass is straight right up to breaking (brittle). Rubber stretches enormously but along a curve. Release a stretched steel wire past its yield and it keeps a permanent set. The strain axis is not to scale.</figcaption></figure>

| Region | What happens |
|---|---|
| Straight part (up to the **proportional limit**) | Stress ∝ strain, Hooke’s law holds |
| Up to the **elastic limit** (yield point) | Returns to original length when unloaded |
| Beyond the yield point | **Plastic** flow: permanent deformation |
| Highest point | **Ultimate tensile strength** (breaking stress) |
| After it | The wire thins (necks) and finally **fractures** |

A **ductile** material (copper, gold, mild steel) has a long plastic region and can be drawn into wires. A **brittle** material (glass, cast iron) breaks soon after the elastic limit. An **elastomer** (rubber, the tissue of arteries) has no well-defined Young’s modulus: the curve is not a straight line and can stretch to several times its length.

## 5. Shear modulus and bulk modulus

Stretching changes length. Two other kinds of deformation have their own moduli. Step through them:

<div class="steps" data-fig="c11p-solid-moduli">
<div class="step">A solid is atoms joined by spring-like bonds. Whatever you do to it, the bonds are stretched, sheared or squeezed, and they push back.</div>
<div class="step">Pull along the length. Tensile stress F/A, longitudinal strain ΔL/L. The ratio is **Young’s modulus** Y.</div>
<div class="step">Push the top face sideways while the bottom is fixed. The shape changes but not the volume. Shear stress is F/A (force along the face), shear strain is tan θ ≈ θ. Their ratio is the **shear modulus** G (also called the modulus of rigidity).</div>
<div class="step">Squeeze equally from all sides, as at the bottom of the sea. The volume shrinks. Pressure change ΔP and volume strain −ΔV/V give the **bulk modulus** B.</div>
<div class="step">Steel is stiff in all three. A liquid or gas cannot be sheared steadily, so it has no Y or G, only a bulk modulus. The inverse of B is the **compressibility**.</div>
</div>

```math
G = \frac{F/A}{\Delta x/h} = \frac{F}{A\theta},\qquad B = -\frac{\Delta P}{\Delta V/V}
```

<div class="meaning">

<dl>
<dt>G</dt><dd>shear modulus (Pa): how hard it is to slide layers over one another</dd>
<dt>B</dt><dd>bulk modulus (Pa): how hard it is to compress; the minus sign makes B positive because ΔV is negative when ΔP is positive</dd>
<dt>Physical meaning</dt><dd>Three ways to deform a block of jelly: pull it (Y), slide its top (G), or squash it in your fist (B). Water has B = 2.2 GPa: even at the bottom of the Pacific it shrinks by less than 1 %.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-solid-shear"></div>

<div class="problem" data-problem="c11p-solid-bulk"></div>

<div class="myth">

**“Only solids have a modulus.”** Solids have Y, G and B. Liquids and gases have only a bulk modulus; they flow under shear, so G is zero for them.

</div>

## 6. Elastic potential energy

To stretch a wire you must do work, and it is stored as elastic potential energy. The force grows from zero to F as the extension grows from zero to ΔL, so the work is the area under the F against l graph.

<div class="steps" data-fig="c11p-solid-energy">
<div class="step">Stretch the wire by a tiny extra amount dl. The work in that step is F × dl, the area of a thin strip.</div>
<div class="step">F is not constant: for a stretch l it equals (YA/L) l, a straight line through the origin, so the average force is half the final force.</div>
<div class="step">Adding all the strips from 0 to ΔL gives the area under the line.</div>
<div class="step">That area is a triangle, so the work stored is `½ × ΔL × F`. Writing F = stress × A and ΔL = strain × L gives ½ × stress × strain × (A L).</div>
<div class="step">Divide by the volume AL to get the energy density: u = ½ × stress × strain = ½ Y × strain².</div>
</div>

```math
U = \tfrac12 F\,\Delta L,\qquad u = \frac{U}{AL} = \tfrac12\,\text{stress}\times\text{strain} = \frac{\text{stress}^2}{2Y}
```

<div class="problem" data-problem="c11p-solid-energy"></div>

## 7. Applications of elastic behaviour

- **Cranes and lifts** use steel cables made of many thin strands. A bundle of thin wires is far more flexible than one thick rod of the same total area, and it fails gradually. Designers keep a **safety factor** (breaking stress divided by working stress) of 5 or more, so the stress stays in the elastic region.

<figure class="fig" data-fig="c11p-solid-rope"><figcaption>Choose the load, the number of strands and the strand thickness. The bars compare the load with the breaking force; the safety factor appears below. Aim for at least 5.</figcaption></figure>

- **Beams and bridges.** A beam loaded in the middle bends. The depression is `$\delta = \dfrac{Wl^3}{4bd^3Y}$` for a rectangular beam of length l, breadth b and depth d, so a deep, narrow beam (large d) bends far less than a wide, shallow one. That is why plank floors are laid with the narrow edge up, and why girders have an I-section: material is kept at the top and bottom where it matters, and removed from the middle where it does not, saving weight.
- **Pillars** with a wide top and bottom (as in old temples) spread the load and resist buckling.
- **Why mountains are limited in height.** The base rock can bear only so much stress before it flows plastically, which limits a mountain to about 10 km on Earth.

<div class="problem" data-problem="c11p-solid-rope"></div>

<div class="myth">

**“A thick steel rod will always be stronger than a bundle of wires.”** For tensile strength alone the breaking force depends on total area. A cable of many wires of the same area has the same breaking force but bends easily and survives a single wire flaw, which is why lift cables are stranded.

</div>

<div class="history">

**Beyond the syllabus.** The 2023 rationalised book keeps the three moduli, the stress-strain curve and elastic energy. Poisson’s ratio (the ratio of lateral to longitudinal strain, about 0.3 for metals) is an extension: when a wire stretches it also becomes thinner, with `$\sigma = -\dfrac{\text{lateral strain}}{\text{longitudinal strain}}$`. It is useful for JEE but not needed for the school exam.

</div>

<div class="keypoints">

- Stress = F/A (Pa). Strain = fractional change (no unit).
- Hooke’s law: stress ∝ strain within the elastic limit.
- Y = FL/(AΔL), G = F/(Aθ), B = −ΔP/(ΔV/V). Liquids and gases have only B.
- Stress-strain curve of a ductile metal: proportional limit, elastic limit, yield, ultimate strength, fracture. Beyond the elastic limit there is permanent set.
- Elastic energy U = ½FΔL; energy per volume u = ½ × stress × strain = ½Y × strain².
- Use a safety factor of at least 5 for cranes and lifts; many thin strands beat one rod for flexibility.

</div>

Going further for JEE/NEET: Poisson’s ratio, elastic energy in composite wires and thermal stress are in [Solids and elasticity (JEE)](/learn/courses/engineering-entrance/solids-elasticity/). Next, practise this chapter with [Mechanical Properties of Solids: practice questions](/learn/courses/ncert-class-11-physics/mechanical-properties-of-solids-practice/).
