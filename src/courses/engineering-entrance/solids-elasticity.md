---
title: Elasticity of solids
seoTitle: 'Elasticity of solids: JEE and NEET physics'
summary: 'Stress and strain, Hooke''s law, Young''s, bulk and shear moduli, Poisson''s ratio, the stress-strain curve, elastic energy, wires as springs in series and parallel, wires under their own weight, thermal stress, bulk modulus of gases, hysteresis and torsion.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'Two wires of the same material and length have diameters in the ratio 1 : 2. The same load hangs on each. Their extensions are in the ratio:'
    choices: ['1 : 2', '2 : 1', '4 : 1', '1 : 4']
    ans: 2
    why: 'ΔL = FL/(AY) ∝ 1/d². Half the diameter means a quarter of the area and four times the extension.'
  - q: 'Steel is called more elastic than rubber because:'
    choices: ['steel stretches more for the same force', 'steel needs a much bigger stress for the same strain', 'rubber cannot return to its shape', 'steel is denser']
    ans: 1
    why: 'In physics, more elastic means a larger modulus: a bigger stress is needed for the same strain. Steel''s Young''s modulus is about 10⁵ times rubber''s.'
  - q: 'The Young''s modulus of a perfectly rigid body would be:'
    choices: ['zero', 'one', 'infinite', 'equal to its bulk modulus']
    ans: 2
    why: 'A rigid body has zero strain for any stress, so Y = stress/strain is infinite.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Properties of solids (elastic behaviour, stress-strain relationship, Hooke''s law, moduli, Poisson''s ratio, elastic energy)'
  - 'Typical elastic moduli of steel, copper, aluminium, glass, rubber and water: CRC Handbook of Chemistry and Physics, rounded to the values entrance exams use'
---

**Physics · Class 11 · about 32 minutes.** By the end you will be able to find the stretch, squeeze or twist of a body under load, read a stress-strain curve, work out stored elastic energy, and solve the harder problems: wires in series, wires under their own weight, thermal stress and rotating rods.

<div class="bigidea">Every solid is a lattice of atoms held by springs (the bonds). Pull on it and the springs stretch a little; let go and they pull back. Stress is the load per unit area, strain is the fractional change in shape, and their ratio, the modulus, tells how stiff the springs are.</div>

## 1. Stress and strain

**Stress** = restoring force per unit area, `$\sigma = F/A$`, in pascals (N/m²). **Strain** = fractional change, with no unit. There are three kinds:

| Kind | Strain | Modulus |
|---|---|---|
| Longitudinal (pull or push along a length) | `$\Delta L/L$` | Young's modulus `$Y = \dfrac{F/A}{\Delta L/L} = \dfrac{FL}{A\,\Delta L}$` |
| Volume (equal pressure all round) | `$\Delta V/V$` | Bulk modulus `$B = -\dfrac{\Delta P}{\Delta V/V}$`; compressibility = 1/B |
| Shear (force along a face) | angle θ ≈ x/h | Shear modulus `$\eta = \dfrac{F/A}{\theta}$` (also written G) |

**Hooke's law:** within the proportional limit, stress ∝ strain. Typical values: steel Y ≈ 2 × 10¹¹ Pa, copper 1.1 × 10¹¹, aluminium 0.7 × 10¹¹, rubber only about 10⁶ Pa. Solids have all three moduli; liquids and gases have only a bulk modulus, because they cannot resist a shear.

<div class="problem" data-problem="se-wire-extension"></div>

<div class="meaning">
<dl>
<dt>F, A</dt><dd>the load, and the cross-section area it acts on (πr² for a wire: use the radius)</dd>
<dt>L, ΔL</dt><dd>original length and change in length</dd>
<dt>Y, B, η</dt><dd>Young's, bulk and shear moduli, in Pa; a property of the material, not of the wire's size</dd>
<dt>σ (Poisson)</dt><dd>Poisson's ratio: sideways strain ÷ lengthwise strain</dd>
<dt>Physical meaning</dt><dd>A thick wire shares the load among more bonds, so it stretches less; a long wire has more bonds in a row, each stretching a little, so it stretches more.</dd>
</dl>
</div>

Why does a wire stretch in proportion to the load? Pull on the lattice below: each row of atoms moves apart a tiny bit, and the sum of all those tiny stretches is the wire's extension. Try the four materials at the same stress.

<figure class="fig" data-fig="@wt-hooke-lattice"><figcaption>Stress σ stretches every atomic "spring" a little, so the strain e = σ/E is the same for every layer. Notice that a stiffer material (bigger E) stretches less at the same stress, and that the line on the graph is straight until the elastic limit.</figcaption></figure>


## 2. Poisson's ratio and the links between moduli

A stretched wire gets thinner. **Poisson's ratio** `$\sigma = -\dfrac{\Delta d/d}{\Delta L/L}$`. In theory it lies between −1 and 0.5; real materials have 0.2 to 0.4, and rubber is close to 0.5 (its volume hardly changes). For a wire, `$\dfrac{\Delta V}{V} = (1 - 2\sigma)\dfrac{\Delta L}{L}$`.

For a uniform (isotropic) material:

```math
Y = 3B(1 - 2\sigma) = 2\eta(1 + \sigma), \qquad \frac{9}{Y} = \frac{1}{B} + \frac{3}{\eta}
```

## 3. The stress-strain curve

Pull a wire slowly and plot stress against strain. Choose a material and move the slider.

<figure class="fig" data-fig="stress-strain"><figcaption>A stress-strain curve. The straight start is Hooke's law. Past the elastic limit the wire keeps a permanent stretch when unloaded (dashed line). Past the ultimate stress it necks and breaks. Rubber stays elastic to huge strains but returns along a lower curve.</figcaption></figure>

<div class="steps">
<div class="step"><b>Proportional limit.</b> Up to here stress ∝ strain; the slope is Y.</div>
<div class="step"><b>Elastic limit (yield point).</b> Up to here the wire returns to its length when unloaded. Beyond it, it flows plastically.</div>
<div class="step"><b>Ultimate (tensile) strength.</b> The greatest stress the wire can take. After it, the wire narrows at one place and breaks.</div>
<div class="step"><b>Ductile vs brittle.</b> Ductile metals (copper, mild steel) have a long plastic region, so they can be drawn into wires. Brittle ones (glass, cast iron) break soon after the elastic limit.</div>
<div class="step"><b>Elastomers and hysteresis.</b> Rubber has no straight part and unloads along a lower curve. The area between the curves is energy turned into heat, which is why rubber damps vibrations.</div>
</div>

**Breaking stress** depends only on the material. The longest wire that can hang under its own weight (breaking length) is `$L = \dfrac{\text{breaking stress}}{\rho g}$`, the same for any thickness.

<div class="myth">

**"A thicker rope has a higher breaking stress."** The breaking **stress** is a property of the material. A thicker rope has a higher breaking **load** (stress × area), which is why ropes are thick.

</div>

## 4. Elastic potential energy

Stretching a wire takes work, stored as elastic energy:

```math
U = \tfrac12\,F\,\Delta L = \tfrac12 \times \text{stress} \times \text{strain} \times \text{volume}, \qquad u = \frac{U}{V} = \frac{\text{stress}^2}{2Y}
```

<div class="problem" data-problem="se-elastic-energy"></div>

**Sudden loading.** Hang a load suddenly and the wire overshoots: it stretches up to twice the steady extension before settling. Half of the gravitational energy lost (mg ΔL) is stored; the other half becomes heat as the oscillation dies.

## 5. Wires as springs

A wire behaves like a spring of constant `$k = \dfrac{YA}{L}$`. So:

- **Series** (end to end, same force): `$\dfrac{1}{k} = \dfrac{1}{k_1} + \dfrac{1}{k_2}$`; extensions add.
- **Parallel** (side by side, same extension): `$k = k_1 + k_2$`; forces add.
- **Cut a wire in half:** k doubles. Y does not change.

**Wire under its own weight** (density ρ, length L): the tension grows from zero at the bottom to the full weight at the top. Total stretch `$\Delta L = \dfrac{\rho g L^2}{2Y}$`, the same as if half the weight hung at the end. The greatest stress is at the top.

**Rotating rod (JEE Advanced).** A rod of length L spun at ω about one end has tension `$T(x) = \tfrac12\rho A\omega^2(L^2 - x^2)$`, greatest at the axis.

## 6. Thermal stress

A rod heated by ΔT wants to grow by `$L\alpha\Delta T$`. If walls stop it, they squeeze it back, giving a strain αΔT and

```math
\text{thermal stress} = Y\alpha\,\Delta T, \qquad F = YA\alpha\,\Delta T
```

The length does not matter. This is why railway lines and bridges have gaps.

<div class="problem" data-problem="se-thermal-stress"></div>

## 7. Bulk modulus, gases and torsion

- Water: B ≈ 2.2 × 10⁹ Pa. At 1 km depth (about 10⁷ Pa extra) water squeezes by only 0.45%.
- A gas compressed slowly (isothermal) has B = P; compressed quickly (adiabatic, as in a sound wave), B = γP.
- **Torsion.** Twisting a wire of radius r and length L through angle θ needs a couple `$\tau = \dfrac{\pi\eta r^4}{2L}\,\theta$`. The r⁴ makes thin fibres very easy to twist, which is why they are used in sensitive balances.

<div class="keypoints">

- Stress = F/A (Pa); strain = fractional change (no unit); modulus = stress/strain.
- Y = FL/(AΔL); B = −ΔP/(ΔV/V); η = shear stress/shear angle. Liquids and gases have only B.
- Poisson's ratio = sideways strain/lengthwise strain, between −1 and 0.5; Y = 2η(1 + σ) = 3B(1 − 2σ).
- Stress-strain curve: proportional limit, elastic limit, ultimate stress, fracture; ductile vs brittle; rubber shows hysteresis.
- Energy = ½FΔL; energy per volume = stress²/2Y; sudden loading doubles the first stretch.
- A wire is a spring with k = YA/L; series and parallel like springs; own weight stretches ρgL²/2Y.
- Thermal stress = YαΔT, independent of length. Gas: B = P (slow), γP (fast). Torsion couple ∝ r⁴/L.

</div>
