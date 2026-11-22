---
title: 'Elasticity: stress, strain and the elastic constants'
seoTitle: Elasticity and elastic constants for IIT JAM Physics
summary: 'Stress, strain and Hooke''s law; Young''s, bulk and shear moduli and Poisson''s ratio and how they are linked; the stress-strain curve; elastic energy; thermal stress; wires under their own weight; torsion of wires and the torsion pendulum; bending of cantilevers.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Two wires of the same metal carry the same load. Wire B is twice as long as A and has twice its diameter. How does B's extension compare with A's?
    choices: ['Half of it', 'The same', 'Twice it', 'A quarter of it']
    ans: 0
    why: Extension ΔL = FL/(AY) goes as L/d². B has twice L and four times the area, so 2/4 = 1/2 of A's extension.
  - q: Which value of Poisson's ratio describes a material whose volume does not change when it is stretched slightly?
    choices: ['0.5', '0', '1', '−1']
    ans: 0
    why: The volume strain is (1 − 2σ) times the length strain. It is zero when σ = 1/2. Rubber is close to this.
  - q: The torsion constant of a wire (torque per unit twist) depends on its radius r as
    choices: ['r⁴', 'r²', 'r', 'r³']
    ans: 0
    why: c = πGr⁴/(2L). Each thin shell of radius s carries shear strain proportional to s and has lever arm s and area 2πs ds, so it contributes in proportion to s³ ds, which integrates to r⁴.
sources:
  - 'D. S. Mathur, Elements of Properties of Matter (S. Chand), chapters on elasticity'
  - 'C. Kittel, W. D. Knight and M. A. Ruderman, Mechanics, Berkeley Physics Course vol. 1, 2nd ed. (1973), chapter on elasticity'
  - 'L. D. Landau and E. M. Lifshitz, Theory of Elasticity, 3rd ed. (1986), chapter 1, for the relations between the constants'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 40 minutes.** By the end you will be able to work out the stretch, twist or sag of a loaded body, move between Young's modulus, the bulk and shear moduli and Poisson's ratio, read a stress-strain curve, and find the energy stored in a deformed solid.

<div class="bigidea">For small deformations a solid behaves like a very stiff spring whose stiffness belongs to the material, and three numbers (or any two of them for an isotropic solid) describe every way it can be stretched, squeezed or twisted.</div>

## 1. Stress, strain and Hooke's law

Pull a wire with force `$F$` and it stretches. How much depends on the wire's size, so we divide the size out:

- **stress** = force per unit area, `$F/A$` (pascals);
- **strain** = fractional change, `$\Delta L/L$` (no units).

Within the **proportional limit**, stress is proportional to strain (Hooke's law), and the ratio is a property of the material alone:

```math
Y = \frac{F/A}{\Delta L/L} \quad\Rightarrow\quad \Delta L = \frac{FL}{AY}, \qquad k = \frac{YA}{L}
```

A long, thin wire is a soft spring; a short, thick one a stiff spring; but both have the same `$Y$`. Physicists call steel "more elastic" than rubber because it needs a much larger stress per unit strain.

**Worked example.** A steel wire (`$Y = 2\times10^{11}$` Pa) 2 m long with cross-section 1 mm² carries 100 N: `$\Delta L = \dfrac{100\times2}{10^{-6}\times2\times10^{11}} = 1$` mm. Watch the units: 1 mm² = `$10^{-6}$` m².

<div class="problem" data-problem="wire-extension"></div>

## 2. Three ways to deform, three moduli

| Deformation | Stress | Strain | Modulus |
|---|---|---|---|
| Stretch | `$F/A$` along the length | `$\Delta L/L$` | Young's modulus `$Y$` |
| Squeeze from all sides | pressure `$\Delta p$` | `$-\Delta V/V$` | bulk modulus `$K$` (compressibility `$1/K$`) |
| Shear (slide the top face) | tangential `$F/A$` | angle of shear `$\phi$` | shear (rigidity) modulus `$G$` or `$\eta$` |

A stretched wire also gets thinner. **Poisson's ratio** `$\sigma$` = (lateral strain)/(longitudinal strain), taken as positive. The volume of a stretched wire changes by `$\Delta V/V = (1 - 2\sigma)\,\Delta L/L$`.

Liquids and gases have a bulk modulus but no shear modulus: a steady shear just makes them flow. For an ideal gas the isothermal bulk modulus is `$p$` and the adiabatic one `$\gamma p$`.

<div class="meaning">

<dl>
<dt>Y</dt><dd>resistance to stretching: stress needed per unit fractional stretch</dd>
<dt>K</dt><dd>resistance to squeezing from all sides; infinite for an incompressible material</dd>
<dt>G</dt><dd>resistance to change of shape at constant volume; zero for a fluid</dd>
<dt>σ</dt><dd>how much it thins when stretched; σ = 1/2 means the volume stays the same</dd>
<dt>Physical meaning</dt><dd>The moduli measure how stiff the springs between atoms are, in three different patterns of pushing. Big modulus, small deformation.</dd>
</dl>

</div>

## 3. How the constants are linked

For an isotropic solid only two constants are independent. Step through where the shear relation comes from:

<div class="steps">
<div class="step"><p><b>Shear is two stretches.</b> A small square sheared by angle φ has one diagonal stretched by strain φ/2 and the other squeezed by φ/2.</p></div>
<div class="step"><p><b>The stresses on the diagonals.</b> A shear stress S on the faces is the same as a tension S along one diagonal plus a compression S along the other.</p></div>
<div class="step"><p><b>Strain along the stretched diagonal.</b> From its own tension: S/Y. From the compression across it (Poisson): σS/Y. Total (1 + σ)S/Y.</p></div>
<div class="step"><p><b>Equate.</b> φ/2 = (1 + σ)S/Y and G = S/φ give Y = 2G(1 + σ).</p></div>
</div>

```math
Y = 2G(1 + \sigma) = 3K(1 - 2\sigma), \qquad \frac{9}{Y} = \frac{1}{K} + \frac{3}{G}, \qquad -1 < \sigma < \tfrac12
```

The limits come from `$K > 0$` and `$G > 0$`. Most metals have `$\sigma \approx 0.3$`, rubber nearly 0.5, cork nearly 0; some engineered foams are negative (they fatten when stretched).

**Worked example.** `$Y = 2.1\times10^{11}$` Pa, `$\sigma = 0.3$`: `$G = 2.1\times10^{11}/2.6 = 81$` GPa and `$K = 2.1\times10^{11}/(3\times0.4) = 175$` GPa.

## 4. The stress-strain curve

<figure class="fig" data-fig="stress-strain"><figcaption>A sketch of a ductile metal (and, at the switch, a brittle solid) pulled until it breaks. Past the elastic limit, unloading follows a line parallel to the Hooke's law line and leaves a permanent stretch.</figcaption></figure>

Reading the curve of a ductile metal from the origin: the straight **Hooke's law** region (slope `$Y$`) up to the proportional limit; the **elastic limit**, beyond which a permanent set remains; **yield**, where planes of atoms slip; **strain hardening** up to the **ultimate tensile strength** (the highest point); then **necking** and fracture. A brittle solid (glass, cast iron) follows a straight line almost to fracture. The breaking load is `$S_{\rm break}\times A$`, so it depends on the area, not the length. A loop between loading and unloading curves (elastic hysteresis, strong in rubber) encloses the energy turned into heat per unit volume.

## 5. Elastic energy, thermal stress and self-weight

Stretching a wire takes work `$\tfrac12F\Delta L$` because the force grows from zero. Per unit volume:

```math
u = \tfrac12\,\text{stress}\times\text{strain} = \tfrac12Y\varepsilon^2 = \frac{\text{stress}^2}{2Y}
```

- **Thermal stress:** a bar clamped between walls and warmed by `$\Delta T$` would expand by strain `$\alpha\Delta T$`; the walls push back with stress `$Y\alpha\Delta T$`, whatever its length.
- **Own weight:** a hanging wire stretches by `$\rho gL^2/2Y$`, the same as a weightless wire carrying half its weight. The area cancels.
- **Sudden loads:** a weight hung on and let go stretches a wire to twice the static extension for an instant.

**Worked example.** A steel rail (`$\alpha = 1.2\times10^{-5}$` K⁻¹) clamped and warmed by 50 K: stress `$= 2\times10^{11}\times1.2\times10^{-5}\times50 = 120$` MPa, which is why rails have expansion gaps.

<div class="myth">

**"A thicker wire under the same load stores more energy because there is more metal."** It stores less. Energy `$\tfrac12F\Delta L = F^2L/(2AY)$` falls as the area grows, because the thick wire stretches less. For the same **stress**, though, energy per unit volume is the same, and the bigger wire stores more in total. Always ask what is being held fixed.

</div>

## 6. Twisting and bending

**Torsion.** Twist the free end of a wire (radius `$r$`, length `$L$`) through angle `$\varphi$`. A thin shell of radius `$s$` is sheared by `$s\varphi/L$`; adding up the torques of all the shells:

```math
\tau = \frac{\pi Gr^4}{2L}\,\varphi = c\,\varphi, \qquad T_{\rm torsion\ pendulum} = 2\pi\sqrt{\frac{I}{c}}
```

The `$r^4$` means the outer metal does almost all the work, so a hollow shaft is stiffer than a solid one of the same mass and length. A torsion pendulum (a disc on a wire) measures `$G$` from its period.

**Bending.** A cantilever of length `$L$` with load `$W$` at the free end sags by

```math
\delta = \frac{WL^3}{3YI_g}, \qquad I_g = \frac{bd^3}{12}\ \text{(rectangular section, width } b\text{, depth } d\text{)}
```

The depth enters cubed: a plank on edge is far stiffer than the same plank lying flat, which is why floor joists stand on edge and girders are I-shaped. For real beams and columns, try the [beam deflection calculator](/science/beam-calculator/) and the [column buckling calculator](/science/column-buckling/).

**Worked example.** A steel strip 2 cm wide and 0.5 cm thick, clamped flat as a 0.5 m cantilever with 10 N at the end: `$I_g = 0.02\times0.005^3/12 = 2.08\times10^{-10}$` m⁴ and `$\delta = \dfrac{10\times0.125}{3\times2\times10^{11}\times2.08\times10^{-10}} = 1.0$` cm.

<div class="problem" data-problem="moduli-relation"></div>

<div class="keypoints">

- Stress `$F/A$`, strain `$\Delta L/L$`; `$Y = $` stress/strain; `$\Delta L = FL/AY$`.
- Bulk modulus `$K = -V\,dp/dV$` (gas: `$p$` isothermal, `$\gamma p$` adiabatic); shear modulus `$G = $` shear stress/shear angle; fluids have `$G = 0$`.
- `$Y = 2G(1 + \sigma) = 3K(1 - 2\sigma)$`, `$9/Y = 1/K + 3/G$`, `$-1 < \sigma < 1/2$`; volume strain `$(1 - 2\sigma)\varepsilon$`.
- Stress-strain: proportional limit, elastic limit, yield, ultimate strength, necking, fracture; breaking load `$\propto A$`.
- Energy per volume `$\tfrac12$` stress × strain; thermal stress `$Y\alpha\Delta T$`; self-weight stretch `$\rho gL^2/2Y$`.
- Torsion `$\tau = (\pi Gr^4/2L)\varphi$`; cantilever sag `$WL^3/3YI_g$`, `$I_g = bd^3/12$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [elasticity practice page](/learn/courses/iit-jam-physics/practice/elasticity/).

<div class="qbank" data-bank="physics" data-topics="elasticity" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.6, [rotation, rolling and angular momentum](/learn/courses/iit-jam-physics/rigid-body-rotation/). **Next:** lesson 2.8, [fluids](/learn/courses/iit-jam-physics/fluids/), the materials with no shear modulus at all.

**Go deeper:** stress and strain are the first tensors most students meet; GATE Physics treats them in general in [tensors](/learn/courses/gate-physics/tensors/), and CSIR NET's [defects and dislocations](/learn/courses/csir-net-physics/defects-dislocations/) explains why real metals yield far below their ideal strength.
