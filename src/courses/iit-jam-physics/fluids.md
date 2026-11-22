---
title: 'Fluids: surface tension, viscosity and Bernoulli'
seoTitle: Surface tension, viscosity and Bernoulli for IIT JAM Physics
summary: 'Surface tension and surface energy, pressure inside drops and bubbles, capillary rise, viscosity and Stokes'' law, terminal speed, Poiseuille flow and the Reynolds number, continuity, Bernoulli''s equation, Torricelli''s law, the Venturi meter, draining tanks and rotating liquids.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A soap bubble and a water drop have the same radius and the same surface tension. Compared with the drop, the excess pressure inside the bubble is
    choices: ['Twice as large', 'The same', 'Half as large', 'Four times as large']
    ans: 0
    why: A drop has one surface, giving 2T/r. A soap film has two surfaces (inside and outside), giving 4T/r.
  - q: Water flows along a horizontal pipe into a narrower section. In the narrow section the pressure is
    choices: ['Lower, because the water moves faster', 'Higher, because the water is squeezed', 'The same', 'Zero']
    ans: 0
    why: Continuity makes the water faster where the pipe is narrow, and Bernoulli's p + ½ρv² = constant then makes the pressure lower. The pressure drop is what accelerates the water into the narrow part.
  - q: 'In laminar flow through a narrow tube, the flow rate depends on the radius r as'
    choices: ['r⁴', 'r²', 'r', 'r³']
    ans: 0
    why: Poiseuille's law Q = πΔp r⁴/(8ηL). One factor r² is the area and another r² comes from the average speed, which also grows as r². Doubling the radius gives 16 times the flow.
sources:
  - 'D. S. Mathur, Elements of Properties of Matter (S. Chand), chapters on surface tension and viscosity'
  - 'D. J. Acheson, Elementary Fluid Dynamics (Oxford, 1990), chapters 1 and 2'
  - 'P.-G. de Gennes, F. Brochard-Wyart and D. Quéré, Capillarity and Wetting Phenomena (Springer, 2004), chapter 1'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 45 minutes.** By the end you will be able to find the pressure inside a drop or bubble, the height of a capillary column, the terminal speed of a sphere, the flow through a narrow tube and the speed of a jet, and you will know which of Bernoulli's assumptions each problem quietly breaks.

<div class="bigidea">A liquid's surface behaves like a stretched skin, its inside resists sliding past itself, and when it flows smoothly without friction its pressure, speed and height trade energy along each streamline.</div>

## 1. Surface tension and surface energy

Molecules at a surface have fewer neighbours to attract them, so making new surface costs energy. **Surface tension** `$T$` is that energy per unit area (J/m²), or equally the force per unit length (N/m) with which the surface pulls along any line drawn in it. A soap film in a wire frame has two surfaces, so a sliding wire of length `$l$` feels `$2Tl$`.

Because a surface wants to be as small as possible, small drops are spheres. Merging drops releases energy: eight drops of radius `$r$` make one of radius `$2r$`, cutting the area from `$32\pi r^2$` to `$16\pi r^2$` and warming the liquid slightly.

**Excess pressure.** A curved surface pushes inwards, so the pressure on its concave side is higher:

```math
\Delta p_{\rm drop} = \frac{2T}{r}, \qquad \Delta p_{\rm soap\ bubble} = \frac{4T}{r}\ \text{(two surfaces)}, \qquad \Delta p_{\rm air\ bubble\ in\ liquid} = \frac{2T}{r}
```

Smaller means higher pressure: joined by a tube, a small soap bubble empties into a big one.

**Worked example.** An air bubble of radius 0.1 mm is 10 cm under water (`$T = 0.072$` N/m). Inside, the pressure exceeds the atmosphere's by `$\rho gh + 2T/r = 980 + 1440 = 2420$` Pa.

## 2. Contact angle and capillary rise

Where a liquid meets a solid it makes a **contact angle** `$\theta$`. If the liquid sticks to the solid more strongly than to itself (water on clean glass), `$\theta < 90^\circ$` and it climbs a narrow tube; if not (mercury on glass), `$\theta > 90^\circ$` and it is pushed down. Balancing the upward pull `$2\pi rT\cos\theta$` against the weight of the column gives Jurin's law:

```math
h = \frac{2T\cos\theta}{\rho gr}
```

Half the radius, twice the height. Between two plates a gap `$d$` apart the rise is `$2T\cos\theta/\rho gd$`. If the tube is shorter than `$h$`, the liquid stops at the top with a flatter meniscus; it never overflows. Only half the surface energy released ends up as potential energy of the column; the rest is heat. Explore it with the [capillary rise](/learn/capillary-rise/) tool.

<div class="problem" data-problem="capillary-height"></div>

## 3. Viscosity, Stokes' law and terminal speed

Layers of a real fluid drag on each other. Newton's law of viscosity: the shear stress is proportional to the velocity gradient, `$F/A = \eta\,dv/dy$`, with `$\eta$` in Pa s. Liquids get **less** viscous when heated; gases get **more** viscous, and an ideal gas's viscosity does not depend on its pressure.

A small sphere moving slowly through a fluid feels Stokes' drag `$6\pi\eta rv$`. Falling, it speeds up until weight, buoyancy and drag balance:

```math
v_t = \frac{2r^2(\rho - \sigma)g}{9\eta}
```

`$v_t \propto r^2$`, so fine mist hangs in the air and big drops fall fast. A bubble (`$\rho < \sigma$`) rises at a steady speed. Stokes' law needs a small **Reynolds number** `$Re = \rho vD/\eta$`, the ratio of inertial to viscous forces; at large `$Re$` the flow turns turbulent. See it in the [Stokes' law](/learn/stokes-terminal-velocity/) tool.

**Worked example.** A steel ball (radius 1 mm, 7800 kg/m³) in glycerine (1260 kg/m³, 1.5 Pa s): `$v_t = \dfrac{2\times10^{-6}\times6540\times9.8}{13.5} = 9.5$` mm/s.

<div class="problem" data-problem="stokes-terminal"></div>

Drop a ball in each liquid and change the radius; compare the time constant and the terminal speed.

<figure class="fig" data-fig="@wt-terminal-velocity"><figcaption>From the force balance mg − buoyancy = 6πηrv, the terminal speed is v = 2r²(ρ−σ)g/9η and it is reached in about τ = 2r²ρ/9η. Notice that v ∝ r² and that for fast cases Re passes 1 and Stokes' law fails.</figcaption></figure>


## 4. Flow through a pipe: Poiseuille's law

In steady laminar flow through a round pipe, a force balance on a cylinder of fluid of radius `$s$` gives `$\Delta p\,\pi s^2 = -\eta\,(dv/ds)\,2\pi sL$`. Integrate with `$v = 0$` at the wall:

```math
v(s) = \frac{\Delta p}{4\eta L}(R^2 - s^2), \qquad Q = \frac{\pi\,\Delta p\,R^4}{8\eta L}
```

<figure class="fig" data-fig="poiseuille-profile"><figcaption>The speed is a parabola across the pipe: zero at the wall, greatest on the axis, with the average exactly half the maximum. Make the pipe wider and watch the flow rate grow as the fourth power of the radius.</figcaption></figure>

The `$R^4$` is why narrowed arteries matter so much: a 10% wider pipe carries 46% more. Tubes in series add their resistances `$8\eta L/\pi R^4$` like resistors, and the narrowest tube takes most of the pressure drop.

<div class="meaning">

<dl>
<dt>T (surface tension)</dt><dd>energy per unit area of surface, or pull per unit length along it</dd>
<dt>2T/r, 4T/r</dt><dd>extra pressure inside a curved surface (one surface, or a soap film's two)</dd>
<dt>η (viscosity)</dt><dd>how strongly neighbouring layers drag on each other</dd>
<dt>R⁴ in Poiseuille's law</dt><dd>wider pipes: more area and faster flow at the same time</dd>
<dt>Physical meaning</dt><dd>Surface tension decides shapes and climbs in small things, viscosity decides how slowly things flow and settle, and in a wide, fast flow inertia takes over.</dd>
</dl>

</div>

## 5. Continuity and Bernoulli's equation

For an incompressible fluid, what flows in must flow out: `$A_1v_1 = A_2v_2$`. For **steady, incompressible, non-viscous** flow, energy per unit volume is constant along a streamline:

```math
p + \tfrac12\rho v^2 + \rho gh = \text{constant}
```

<figure class="fig" data-fig="venturi-tube"><figcaption>A Venturi tube. The water speeds up in the throat, so its pressure must drop there, as the lower column shows. Change the area ratio and the flow speed.</figcaption></figure>

Three classic uses:

- **Torricelli:** a jet from a hole at depth `$h$` leaves at `$\sqrt{2gh}$`. From a tank of depth `$H$` on the ground it lands `$2\sqrt{h(H - h)}$` away, farthest for a hole half way down.
- **Venturi meter:** with `$A_1 = kA_2$`, `$\Delta p = \tfrac12\rho v_1^2(k^2 - 1)$` gives the flow from a pressure reading.
- **Lift:** air faster over a wing than under it means lower pressure on top.

**Draining a tank.** `$A\,dh/dt = -a\sqrt{2gh}$` makes `$\sqrt h$` fall linearly in time: the time to empty is `$\dfrac Aa\sqrt{2H/g}$`, and three quarters of the water leaves in the first half of that time.

**Worked example.** A Venturi meter with areas 20 cm² and 10 cm² shows 3000 Pa. Then `$3000 = \tfrac12(1000)(4 - 1)v_1^2$`, `$v_1 = 1.41$` m/s and `$Q = 2.83$` L/s. Watch streamlines and pressure change in the [Bernoulli flow](/learn/bernoulli-flow/) tool.

<div class="myth">

**"Fast-moving fluid pushes harder, so the pressure in a narrow, fast section is higher."** It is lower. Pressure is what a gauge moving with the fluid would read, and the fluid speeds up into the constriction precisely because the pressure ahead of it is lower. The faster the flow, the lower the pressure, as long as Bernoulli's assumptions hold.

</div>

## 6. Liquids in rotating and accelerating containers

In a frame that rotates or accelerates, add the fictitious force to gravity; the free surface lies perpendicular to the total. A bucket spinning at `$\omega$` has a paraboloid surface, `$z = \omega^2s^2/2g$`, so the water at the wall stands `$\omega^2R^2/2g$` higher than at the centre. A U-tube accelerating at `$a$` along the line of its arms (a distance `$L$` apart) shows a level difference `$aL/g$`: a simple accelerometer. For floating bodies and buoyancy, the [floating and buoyancy](/learn/buoyancy-lab/) tool lets you test Archimedes' principle.

<div class="keypoints">

- Surface tension: energy per area = force per length. Drop `$2T/r$`, soap bubble `$4T/r$`, air bubble in liquid `$2T/r$`.
- Capillary rise `$h = 2T\cos\theta/\rho gr$`; mercury (`$\theta > 90^\circ$`) is depressed; half the surface energy becomes potential energy.
- Viscosity `$F/A = \eta\,dv/dy$`; Stokes `$6\pi\eta rv$`; terminal speed `$2r^2(\rho - \sigma)g/9\eta$`; low `$Re = \rho vD/\eta$` means laminar.
- Poiseuille: parabolic profile, average = half the maximum, `$Q = \pi\Delta pR^4/8\eta L$`.
- Continuity `$Av$` = constant; Bernoulli `$p + \tfrac12\rho v^2 + \rho gh$` = constant (steady, incompressible, non-viscous, along a streamline).
- Torricelli `$\sqrt{2gh}$`; draining time `$(A/a)\sqrt{2H/g}$`; rotating liquid rises `$\omega^2R^2/2g$` at the wall.

</div>

A final check on buoyancy: vary the density and the liquid, and look at the force balance.

<figure class="fig" data-fig="@wt-buoyancy"><figcaption>Archimedes in motion: F_b = ρ_liquid V_sub g. Notice that the equilibrium depth is where F_b equals the weight, giving a submerged fraction ρ/ρ_liquid.</figcaption></figure>


## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [fluids practice page](/learn/courses/iit-jam-physics/practice/fluids/).

<div class="qbank" data-bank="physics" data-topics="fluids" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.7, [elasticity](/learn/courses/iit-jam-physics/elasticity/). **Next:** lesson 2.9, [special relativity](/learn/courses/iit-jam-physics/special-relativity/). Gas viscosity from molecular motion comes back in [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/).

**Go deeper:** GATE Physics has no fluids lesson; the nearest next step is CSIR NET's [kinetic theory of transport](/learn/courses/csir-net-physics/transport/), which derives viscosity from molecular collisions.
