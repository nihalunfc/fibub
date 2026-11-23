---
title: Mechanical Properties of Fluids
seoTitle: 'Mechanical Properties of Fluids Class 11 notes, Bernoulli'
summary: 'Class 11 Mechanical Properties of Fluids with animations: pressure, Pascal''s law, Bernoulli''s principle, viscosity, Stokes'' law and surface tension.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'The gauge pressure at a depth of 10 m in fresh water (ρ = 1000 kg/m³, g = 10 m/s²) is:'
    choices: ['10 kPa', '100 kPa', '200 kPa', '1000 kPa']
    ans: 1
    why: 'P = ρgh = 1000 × 10 × 10 = 100 000 Pa = 100 kPa, about one atmosphere. The total pressure is 200 kPa.'
  - q: 'Water flows through a horizontal pipe that narrows. In the narrow part the water has:'
    choices: ['lower speed and lower pressure', 'higher speed and higher pressure', 'higher speed and lower pressure', 'the same speed and pressure']
    ans: 2
    why: 'Continuity makes the speed larger where the area is smaller; Bernoulli’s equation then gives a lower pressure.'
  - q: 'Water rises in a glass capillary but mercury is pushed down because of:'
    choices: ['different densities only', 'different angles of contact', 'different viscosities', 'different atmospheric pressure']
    ans: 1
    why: 'For water θ is about 0 so cos θ is positive and the surface rises. For mercury θ is about 140° (obtuse), cos θ is negative, so it is depressed.'
sources:
  - 'NCERT Class 11 Physics, Chapter 9 “Mechanical Properties of Fluids” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Densities, viscosities and surface tensions of water, mercury, glycerine and air: CRC Handbook of Chemistry and Physics, 97th edition'
  - 'Bernoulli, D. (1738), Hydrodynamica (for the history box)'
---

**Physics · Class 11 · Chapter 9 · about 85 minutes.** By the end you will be able to find pressure at any depth, explain Pascal’s law and the hydraulic lift, use continuity and Bernoulli’s equation, work out terminal velocity with Stokes’ law, and use surface tension to explain drops, bubbles and capillary rise.

<div class="bigidea">A fluid (liquid or gas) has no shape of its own and flows. At rest it pushes equally in every direction and the push grows with depth. Moving, it obeys two simple rules: what goes in comes out (continuity), and energy is conserved (Bernoulli), so fast fluid has low pressure. Real fluids also drag on themselves (viscosity) and their surfaces pull inward like a stretched skin (surface tension).</div>

## 1. Pressure and Pascal’s law

**Pressure** is the normal force per unit area: `$P = \dfrac{F}{A}$` (pascal, Pa; 1 atm = 1.013 × 10⁵ Pa). It is a scalar: in a fluid at rest it acts equally in every direction at a point, always perpendicular to the surface it touches.

**Pascal’s law:** pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid and the walls. This is why a **hydraulic lift** works: a small force on a small piston creates a pressure that acts on a large piston to give a large force.

```math
\frac{F_1}{A_1} = \frac{F_2}{A_2}\ \Longrightarrow\ F_2 = F_1\frac{A_2}{A_1}
```

Nothing is free: the small piston moves farther, `$d_1 A_1 = d_2 A_2$`, so the work in equals the work out. Garage jacks, dentist chairs, the brakes of a car and the arm of an excavator all use this.

<figure class="fig" data-fig="@wt-pascal-lift"><figcaption>Hydraulic lift: change the push, the piston areas and the load, and watch the pressure stay the same on both sides while the distances differ.</figcaption></figure>

<div class="problem" data-problem="c11p-fluid-lift"></div>

Try the [Hydraulic lift tool](/learn/hydraulic-lift/) too.

<div class="myth">

**“A hydraulic lift gives you extra energy.”** It multiplies force but divides distance by the same factor. Work out equals work in (apart from friction).

</div>

## 2. Pressure at depth, atmospheric and gauge pressure

<div class="steps" data-fig="c11p-fluid-column">
<div class="step">Imagine a column of liquid of area A reaching from the surface down to depth h. It is at rest, so the forces on it balance.</div>
<div class="step">Its mass is density × volume = ρAh, so its weight is ρAhg, pulling it down.</div>
<div class="step">The air above pushes down on the top with P₀A, where P₀ is the atmospheric pressure.</div>
<div class="step">The liquid under the column pushes up on its bottom with PA, where P is the pressure at depth h.</div>
<div class="step">Balance: PA = P₀A + ρAhg. A cancels, so **P = P₀ + ρgh**. The shape of the vessel does not matter, only the vertical depth.</div>
</div>

```math
P = P_0 + \rho g h,\qquad P_{\text{gauge}} = P - P_0 = \rho g h
```

<div class="meaning">

<dl>
<dt>P₀</dt><dd>atmospheric pressure pushing on the surface (about 1.013 × 10⁵ Pa)</dd>
<dt>ρgh</dt><dd>extra pressure due to the weight of liquid above: the gauge pressure</dd>
<dt>Physical meaning</dt><dd>Every 10 m of water adds about one atmosphere. At 30 m a diver feels about 4 atm in total. Dams are thicker at the bottom for the same reason.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-fluid-depth"><figcaption>Move the probe down. The pressure rises in a straight line with depth and acts equally in all directions. Switch to mercury, 13.6 times denser, and the pressure climbs 13.6 times faster.</figcaption></figure>

<div class="problem" data-problem="c11p-fluid-depth"></div>

**Atmospheric pressure and the barometer.** Torricelli filled a tube with mercury, turned it over in a dish and found the mercury stayed up to about 76 cm. The air presses on the dish, the vacuum above has no pressure, so `$P_0 = \rho g h$`. In millimetres of mercury, 1 atm = 760 mm Hg = 760 torr. The same pressure would hold up about 10.3 m of water, so water is not used in barometers.

<figure class="fig" data-fig="c11p-fluid-baro"><figcaption>Change the liquid and the weather. The column height always satisfies h = P/ρg. A U-tube manometer works the same way: the gauge pressure equals ρg times the difference in levels.</figcaption></figure>

**Gauge pressure** is the pressure above the atmosphere, what a tyre gauge reads. A tyre showing 2.2 bar gauge has an absolute pressure of about 3.2 bar. A blood pressure of 120/80 is a gauge pressure, in mm Hg.

**Buoyancy.** A body in a fluid is pushed up by the pressure difference between its bottom and top, which equals the weight of the fluid it displaces (Archimedes). It floats if its average density is less than the liquid’s.

<figure class="fig" data-fig="@wt-buoyancy"><figcaption>Drop a block into different liquids and change its density. It bobs to rest where the weight equals the buoyant force.</figcaption></figure>

More in the [Buoyancy lab](/learn/buoyancy-lab/).

## 3. Streamline flow and the equation of continuity

In **streamline (steady) flow** each particle follows the same path as the one before it, and the velocity at any point does not change in time. Streamlines never cross. At higher speeds the flow becomes irregular, with eddies: **turbulent** flow.

For an incompressible fluid, the volume flowing past every section per second is the same:

```math
A_1 v_1 = A_2 v_2 = \text{constant}
```

A garden hose with your thumb over the end gives a faster jet, because the area is smaller. Rivers flow fast in narrow gorges and slowly where they widen.

<div class="problem" data-problem="c11p-fluid-continuity"></div>

## 4. Bernoulli’s principle

For steady, non-viscous, incompressible flow, along a streamline

```math
P + \tfrac12\rho v^2 + \rho g h = \text{constant}
```

This is the work-energy theorem for a fluid. Follow the derivation:

<div class="steps" data-fig="c11p-fluid-derive">
<div class="step">A pipe narrows (A₁ to A₂) and rises (h₁ to h₂). The fluid is steady, frictionless and cannot be squeezed.</div>
<div class="step">In a short time dt a slug of volume dV = A₁v₁dt enters at 1, and the same volume dV = A₂v₂dt leaves at 2 (continuity).</div>
<div class="step">At 1 the pressure pushes the fluid forward and does work P₁dV. At 2 the pressure pushes back: −P₂dV. Net work W = (P₁ − P₂)dV.</div>
<div class="step">The effect of the flow is as if the slug moved from 1 to 2: its kinetic energy changes by ½ρdV(v₂² − v₁²) and its potential energy by ρdVg(h₂ − h₁).</div>
<div class="step">Work = change in energy. Divide by dV: P₁ − P₂ = ½ρ(v₂² − v₁²) + ρg(h₂ − h₁).</div>
<div class="step">Collect terms: **P + ½ρv² + ρgh is the same at every point on the streamline.**</div>
</div>

<div class="meaning">

<dl>
<dt>P</dt><dd>static pressure of the fluid (Pa)</dd>
<dt>½ρv²</dt><dd>kinetic energy per unit volume</dd>
<dt>ρgh</dt><dd>potential energy per unit volume</dd>
<dt>Physical meaning</dt><dd>The energy of a unit volume of fluid has three forms, and they trade off. Where the water speeds up, pressure must fall.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-fluid-venturi"><figcaption>A pipe that narrows. The dots move faster in the narrow part (continuity) and the side tubes show a lower pressure there (Bernoulli). Narrow the throat more and the drop grows quickly.</figcaption></figure>

<div class="problem" data-problem="c11p-fluid-bernoulli"></div>

Experiment with a pipe, changing its width and height:

<!--fig:tool bernoulli-flow-->

**Applications.**
- **Torricelli’s law:** a hole at depth h in an open tank squirts water out at `$v = \sqrt{2gh}$` (put P equal to P₀ at both the surface and the hole, and v at the surface about zero).
- **Venturi meter:** measures speed from the pressure drop in a constriction. A spray gun or a carburettor sucks liquid up the same way.
- **Aerofoil lift:** the air above a wing moves faster, so the pressure above is lower and there is an upward force.
- **Why a roof can lift off in a cyclone:** the fast air over the roof lowers the pressure above while the air inside is still.

<div class="myth">

**“Bernoulli’s equation says faster water has lower pressure, so a faster pipe always has lower pressure.”** It compares two points on the same streamline in steady, frictionless flow. Between two different pipes, or along a long pipe where friction acts, pressure also falls because of viscosity.

</div>

Explore the full flow around obstacles in the [Potential flow tool](/science/potential-flow/) (a beyond-the-book preview of flow around a cylinder).

## 5. Viscosity

When layers of a fluid slide past each other they exert friction on each other. This internal friction is **viscosity**. Honey is much more viscous than water.

<figure class="fig" data-fig="c11p-fluid-viscous"><figcaption>Three views. Sliding plates: the layers move at speeds from 0 (at the fixed plate) to v (at the moving one). Pipe: the wall layer is still and the centre is fastest, a parabolic profile. Laminar or turbulent: raise the speed or lower the viscosity until the smooth layers break into eddies.</figcaption></figure>

**Newton’s law of viscosity:** the force needed to keep a plate of area A moving at speed v over a layer of thickness d is

```math
F = \eta\,A\,\frac{v}{d}
```

where `$\eta$` is the **coefficient of viscosity** (unit Pa s, or poise: 1 poise = 0.1 Pa s). Water is 0.001 Pa s, glycerine about 1.4 Pa s. Unlike solids, the viscosity of a liquid **decreases** when it is heated (honey flows easily when warm), but that of a gas increases.

**Stokes’ law.** A small sphere of radius r moving at speed v in a fluid of viscosity η feels a drag

```math
F = 6\pi\eta r v
```

Drop a ball into glycerine. Three forces act: weight down, buoyancy up (equal to the weight of the displaced fluid) and the drag up. The drag grows with speed until the forces balance, and the ball then falls at constant **terminal velocity**:

```math
6\pi\eta r v_t = \tfrac43\pi r^3(\rho-\sigma)g\ \Longrightarrow\ v_t = \frac{2r^2(\rho-\sigma)g}{9\eta}
```

where ρ is the ball’s density and σ the fluid’s. It depends on r², so a rain-drop of twice the radius falls four times faster, and a mist droplet falls so slowly it seems to hang in the air.

<div class="meaning">

<dl>
<dt>η</dt><dd>viscosity: how strongly layers drag on each other (Pa s)</dd>
<dt>v<sub>t</sub></dt><dd>terminal velocity: the steady speed at which weight = buoyancy + drag</dd>
<dt>Physical meaning</dt><dd>A parachutist, a raindrop and a ball bearing in oil all reach a speed where the drag has grown big enough to cancel the net pull of gravity. After that, they fall steadily.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-fluid-stokes"></div>

Release balls in different liquids and watch the speed level off:

<!--fig:tool stokes-terminal-velocity-->

**Reynolds number.** Whether the flow is smooth or turbulent depends on `$Re = \dfrac{\rho v D}{\eta}$` (D is the pipe diameter). Below about 1000 the flow in a pipe is laminar, above about 2000 to 3000 it is turbulent. Fast, wide pipes of thin fluid are turbulent; slow flow of syrup is laminar. See [Dimensionless numbers](/science/dimensionless-numbers/) for more.

## 6. Surface tension

A molecule inside a liquid is pulled equally by neighbours all round. A molecule on the surface has liquid below and air above, so it is pulled **inward**: the surface behaves like a stretched elastic skin and tends to be as small as possible. This is why drops are round and insects walk on water.

<figure class="fig" data-fig="c11p-fluid-surface"><figcaption>Molecules: bulk molecules feel balanced pulls, surface ones a net inward pull. Soap film: the force on a sliding wire is 2Sl. Drop and bubble: smaller radius, larger excess pressure.</figcaption></figure>

**Surface tension** S is the force per unit length acting along a line in the surface: `$S = \dfrac{F}{l}$` (N/m). Equivalent: **surface energy**, the work needed to increase the surface area by one unit, `$W = S\,\Delta A$` (J/m²). Water has S = 0.073 N/m at room temperature; it **falls** as the temperature rises. Soap and detergents lower S, which is why they spread and clean oily dirt.

**Excess pressure.** Because the surface is pulled inward, the pressure inside a curved surface is greater than outside:
- liquid drop (one surface): `$\Delta P = \dfrac{2S}{r}$`
- soap bubble (two surfaces): `$\Delta P = \dfrac{4S}{r}$`

A small bubble has a higher pressure than a large one, so if two connected bubbles are different sizes the small one empties into the large one.

**Angle of contact.** Where a liquid surface meets a solid wall, the angle θ between the liquid surface and the wall (measured inside the liquid) is the angle of contact. If θ is less than 90° the liquid **wets** the solid (water on clean glass, θ ≈ 0°). If it is more than 90° the liquid does not wet it (mercury on glass, about 140°).

<div class="problem" data-problem="c11p-fluid-capillary"></div>

**Capillary rise.** In a narrow tube a wetting liquid rises, and a non-wetting one is pushed down. Here is the balance of forces:

<div class="steps" data-fig="c11p-fluid-capderive">
<div class="step">A narrow tube of radius r is dipped in water. The liquid wets the glass and rises to a height h above the outside level.</div>
<div class="step">Along the circle where the liquid touches the glass (length 2πr), surface tension pulls along the surface at the angle of contact θ.</div>
<div class="step">The upward part of the pull is S cos θ per unit length, so the total upward force is 2πr S cos θ.</div>
<div class="step">This holds up the liquid column above the outside level. Its volume is about πr²h, so its weight is πr²hρg.</div>
<div class="step">Equate: 2πrS cos θ = πr²hρg, so **h = 2S cos θ / (r ρ g)**. For mercury cos θ is negative, so h is negative: it is pushed below the outside level.</div>
</div>

<figure class="fig" data-fig="c11p-fluid-capillary"><figcaption>Choose a liquid and a tube radius. A narrower tube lifts water higher (h ∝ 1/r). Mercury goes the other way. Notice the angle of contact in the corner.</figcaption></figure>

Test it on a real set of tubes:

<!--fig:tool capillary-rise-->

**Everyday capillarity:** oil rises up a wick, ink spreads in blotting paper, water climbs up the xylem of a plant and a sponge soaks up spilled chai.

<div class="myth">

**“Capillary rise needs a vacuum or a pump.”** Nothing pushes the water from below. The surface-tension force around the circle of contact is what lifts it, and it works only because the tube is narrow, so the lifted weight is small.

</div>

<div class="history">

**Beyond the syllabus.** The Magnus effect (a spinning ball curves because the fast side has low pressure) and details of turbulence, such as the critical Reynolds number for different shapes, are extensions of Bernoulli’s principle. If your school covers them, they use the same ideas. Poiseuille’s formula for the flow rate in a narrow tube, `$Q = \dfrac{\pi p r^4}{8\eta l}$`, is also outside the rationalised syllabus.

</div>

<div class="keypoints">

- P = F/A. In a liquid at rest P = P₀ + ρgh; it depends only on depth. Pascal’s law is the basis of hydraulic lifts: F₂ = F₁A₂/A₁.
- Atmospheric pressure: 1 atm = 76 cm Hg = 1.013 × 10⁵ Pa. Gauge pressure = absolute − atmospheric.
- Continuity: A₁v₁ = A₂v₂. Bernoulli: P + ½ρv² + ρgh = constant (steady, non-viscous). Fast flow, low pressure.
- Viscosity: F = ηAv/d. Stokes’ law: F = 6πηrv. Terminal velocity v<sub>t</sub> = 2r²(ρ − σ)g/(9η).
- Reynolds number Re = ρvD/η decides laminar (low) or turbulent (high) flow.
- Surface tension S = F/l = energy per area. Excess pressure: 2S/r for a drop, 4S/r for a soap bubble.
- Capillary rise h = 2S cos θ/(rρg); it is negative (depression) when θ > 90°.

</div>

Going further for JEE/NEET: the full set of fluid problems (buoyancy of composite bodies, Torricelli with moving tanks, viscous flow, terminal velocity with varying density) is in [Fluids (JEE)](/learn/courses/engineering-entrance/fluids/). Next, practise this chapter with [Mechanical Properties of Fluids: practice questions](/learn/courses/ncert-class-11-physics/mechanical-properties-of-fluids-practice/).
