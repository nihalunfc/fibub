---
title: 'Fluids: pressure, flow, viscosity and surface tension'
seoTitle: 'Fluids, Bernoulli and surface tension: JEE and NEET'
summary: 'Pressure and depth, Pascal''s law and hydraulic machines, barometers and manometers, Archimedes'' principle and floating, accelerating and rotating liquids, continuity and Bernoulli''s equation, Torricelli and Venturi, viscosity, Stokes'' law and terminal speed, surface tension, excess pressure and capillary rise.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'Three vessels with the same base area but different shapes are filled with water to the same height. The pressure at the base is:'
    choices: ['greatest in the widest vessel', 'least in the widest vessel', 'the same in all three', 'greatest in the narrowest vessel']
    ans: 2
    why: 'Pressure at a depth depends only on the depth and the liquid: P = P₀ + ρgh. The shape and the amount of water do not matter (the hydrostatic paradox).'
  - q: 'Water flowing through a horizontal pipe enters a narrower section. There, the water''s:'
    choices: ['speed and pressure both rise', 'speed rises and pressure falls', 'speed falls and pressure rises', 'speed and pressure both fall']
    ans: 1
    why: 'Continuity (Av = constant) makes it speed up. Bernoulli''s equation then needs the pressure to fall, since the extra kinetic energy has to come from somewhere.'
  - q: 'The excess pressure inside a soap bubble of radius r (surface tension T) is:'
    choices: ['T/r', '2T/r', '4T/r', '8T/r']
    ans: 2
    why: 'A soap bubble has two surfaces (inside and outside of the film), each giving 2T/r, so 4T/r. A liquid drop or an air bubble inside a liquid has one surface: 2T/r.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Mechanical properties of fluids'
  - 'Surface tension of water at 20 °C ≈ 0.0728 N/m and viscosity data: CRC Handbook of Chemistry and Physics, rounded as exams use them'
  - 'Standard atmosphere 101 325 Pa (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 38 minutes.** By the end you will be able to find pressure anywhere in a still, accelerating or spinning liquid, decide how deep things float, use continuity and Bernoulli's equation for flowing liquids, find terminal speeds, and solve drop, bubble and capillary problems.

<div class="bigidea">A fluid at rest pushes equally in all directions, and the push grows with depth because of the weight of the fluid above. When a fluid flows, it trades pressure for speed: where it moves faster, it pushes less. Viscosity is fluid friction, and surface tension is the skin a liquid surface makes.</div>

## 1. Pressure in a liquid at rest

Pressure P = force per unit area (Pa). At depth h below a free surface open to the air:

```math
P = P_0 + \rho g h
```

P₀ is the atmospheric pressure (1 atm = 1.013 × 10⁵ Pa ≈ 76 cm of mercury ≈ 10.3 m of water). `$\rho g h$` alone is the **gauge pressure**. All points at the same depth in one connected liquid at rest have the same pressure, whatever the vessel's shape.

- **Pascal's law:** extra pressure applied to an enclosed liquid reaches every part of it unchanged. A **hydraulic lift** multiplies force: `$F_2 = F_1 A_2/A_1$`, but the large piston moves less, so work is not multiplied.
- **Barometer:** a mercury column of height h balances the air: P₀ = ρgh. **Manometer:** a U-tube whose level difference shows a gauge pressure.
- **U-tube with two liquids:** equate pressures at the level of the lower interface: `$\rho_1 h_1 = \rho_2 h_2$`.
- **Force on a dam** of width w and depth H (gauge only): `$\tfrac12\rho g w H^2$`, acting H/3 above the bottom.

Try the hydraulic lift: change the area ratio, the load and the push, and see what the pressure, the output force and the distances do.

<figure class="fig" data-fig="@wt-pascal-lift"><figcaption>The pressure P = F₁/A₁ is the same everywhere in the liquid, so F₂ = P A₂ is bigger by the area ratio. Notice that the big piston rises less than the small one falls: force is gained, work (F × distance) is not.</figcaption></figure>


## 2. Buoyancy and floating

**Archimedes' principle:** a body in a fluid feels an upward buoyant force equal to the weight of fluid it pushes aside: `$F_B = \rho_{fluid}V_{sub}\,g$`. The cause is the pressure difference between the bottom and top of the body.

- Fully under: **apparent weight** = true weight − ρ_fluid V g.
- **Floating:** weight = buoyant force, so the fraction under the surface is `$\rho_{body}/\rho_{fluid}$`.
- In a lift accelerating up at a, both weight and buoyancy scale with (g + a), so a floating body floats at the **same** depth.

<div class="problem" data-problem="fl-floating"></div>

<div class="myth">

**"Heavy things sink and light things float."** It is density that decides, not weight. A steel ship floats because its hull encloses so much air that its average density is less than water's. A small pebble sinks.

</div>

Drop the cube into a liquid and slide its density. Find the density at which it just floats, and see what fraction is under the surface.

<figure class="fig" data-fig="@wt-buoyancy"><figcaption>The buoyant force is the weight of the liquid displaced. Notice that a floating cube sinks until buoyancy equals weight, so the submerged fraction is ρ_cube/ρ_liquid, and that a steel-like cube floats in mercury.</figcaption></figure>


## 3. Accelerating and rotating liquids (JEE)

- **Container accelerating horizontally** at a: the free surface tilts at `$\tan\theta = a/g$`, with the liquid piling up at the back.
- **Accelerating up** at a: g is replaced by g + a everywhere, so `$P = P_0 + \rho(g + a)h$`.
- **Spinning** about a vertical axis at ω: the surface becomes a paraboloid, `$y = \dfrac{\omega^2 r^2}{2g}$`, higher at the rim.

## 4. Flowing fluids: continuity and Bernoulli

In steady, **streamline** flow each particle follows the one before it along fixed lines. For an incompressible liquid, the volume per second through every cross-section is the same:

```math
A_1 v_1 = A_2 v_2 \qquad\text{(continuity)}
```

For an ideal liquid (no viscosity, incompressible, steady flow), energy per unit volume is constant along a streamline:

```math
P + \tfrac12\rho v^2 + \rho g h = \text{constant} \qquad\text{(Bernoulli)}
```

<div class="meaning">
<dl>
<dt>P</dt><dd>pressure, the energy per unit volume stored by squeezing</dd>
<dt>½ρv²</dt><dd>kinetic energy per unit volume</dd>
<dt>ρgh</dt><dd>gravitational potential energy per unit volume</dd>
<dt>A, v</dt><dd>cross-section area and flow speed</dd>
<dt>Physical meaning</dt><dd>Bernoulli's equation is energy conservation for a fluid. To speed up, a fluid parcel must be pushed from a region of higher pressure to one of lower pressure.</dd>
</dl>
</div>

Change the flow and the narrowing below.

<figure class="fig" data-fig="fluid-venturi"><figcaption>A Venturi tube. In the narrow throat the water moves faster (continuity) and its pressure is lower (Bernoulli), so the middle tube's column stands lower. The height difference measures the flow rate.</figcaption></figure>

Applications:

- **Torricelli:** water leaks from a hole at depth h below the surface with `$v = \sqrt{2gh}$`, like a body falling h. A hole at depth h in a tank of height H throws water a horizontal distance `$2\sqrt{h(H - h)}$`, greatest for a hole halfway down.
- **Venturi meter:** `$v_1 = A_2\sqrt{\dfrac{2\Delta P}{\rho(A_1^2 - A_2^2)}}$`.
- **Lift on a wing, spinning balls, sprayers:** faster air on one side means lower pressure there.

## 5. Viscosity

**Viscosity** is internal friction between layers moving at different speeds. Newton's law of viscosity: `$F = \eta A\,\dfrac{dv}{dy}$`, with η the coefficient of viscosity (Pa s; 1 poise = 0.1 Pa s). Liquids get less viscous when heated; gases get more viscous.

- **Stokes' law:** drag on a small sphere `$F = 6\pi\eta r v$`.
- **Terminal speed** (weight = buoyancy + drag): `$v_t = \dfrac{2r^2(\rho - \sigma)g}{9\eta}$`, where ρ is the sphere's density and σ the liquid's. It grows as r².
- **Poiseuille:** volume per second through a pipe `$Q = \dfrac{\pi P r^4}{8\eta L}$`. The r⁴ means a slightly narrowed blood vessel carries much less blood.
- **Reynolds number** `$R_e = \rho v D/\eta$`: below about 2000 the flow is streamline, above about 3000 turbulent.

<div class="problem" data-problem="fl-terminal"></div>

Drop a steel ball through the liquids and change its radius. Which matters more: the radius or the liquid?

<figure class="fig" data-fig="@wt-terminal-velocity"><figcaption>Weight minus buoyancy is constant while drag grows with speed, so the ball speeds up and then settles at v_t = 2r²(ρ−σ)g/9η. Notice that the speed graph levels off, that doubling the radius quadruples v_t, and that Stokes' law is flagged as invalid when the Reynolds number is large.</figcaption></figure>


## 6. Surface tension

Molecules at a liquid surface are pulled inward by their neighbours, so the surface behaves like a stretched skin. **Surface tension** T = force per unit length along a line in the surface (N/m) = surface energy per unit area (J/m²). Making new surface takes work: `$W = T\,\Delta A$` (a soap film has two surfaces, so double the area).

**Excess pressure** inside a curved surface:

| Case | Excess pressure |
|---|---|
| Liquid drop, or air bubble inside a liquid | `$2T/r$` |
| Soap bubble in air (two surfaces) | `$4T/r$` |

Smaller bubbles have higher pressure: join two soap bubbles by a tube and the small one shrinks into the big one.

**Capillary rise:** in a narrow tube of radius r, a liquid that wets the glass (contact angle θ < 90°) rises to

```math
h = \frac{2T\cos\theta}{\rho g r}
```

Mercury (θ > 90°) is pushed down instead. In a tube shorter than h, the liquid does not overflow; the surface just becomes flatter (larger radius of curvature).

<div class="problem" data-problem="fl-capillary"></div>

<div class="myth">

**"Water rises in a capillary because the tube sucks it up."** Nothing sucks. The surface tension along the edge of the curved surface pulls the liquid up, and it stops when the weight of the column balances that pull. That is why h ∝ 1/r.

</div>

**Merging drops (JEE).** n small drops of radius r join into one big drop of radius `$R = n^{1/3}r$`. Surface area falls, so energy `$4\pi T(nr^2 - R^2)$` is released as heat.

<div class="keypoints">

- P = P₀ + ρgh, independent of vessel shape; Pascal: pressure passes unchanged; hydraulic lift F₂ = F₁A₂/A₁.
- Buoyancy = weight of fluid displaced; floating fraction under = ρ_body/ρ_fluid.
- Accelerating container: tan θ = a/g; spinning liquid: y = ω²r²/2g.
- Continuity A₁v₁ = A₂v₂; Bernoulli P + ½ρv² + ρgh = constant; Torricelli v = √(2gh).
- Viscous force ηA dv/dy; Stokes 6πηrv; terminal speed 2r²(ρ − σ)g/9η; Poiseuille Q ∝ r⁴.
- Surface tension = force per length = energy per area; drop 2T/r, soap bubble 4T/r.
- Capillary rise h = 2T cos θ/(ρgr); mercury falls.

</div>
