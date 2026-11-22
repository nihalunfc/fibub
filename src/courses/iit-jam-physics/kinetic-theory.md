---
title: 'Kinetic theory: Maxwell speeds, mean free path and equipartition'
seoTitle: Kinetic theory of gases for IIT JAM Physics
summary: 'How the pressure and temperature of a gas come from molecules in motion, the Maxwell distribution and its three speeds, equipartition and heat capacities, mean free path, effusion, transport and the van der Waals gas, with the traps JAM sets.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Helium and argon are at the same temperature. Which statement is right?
    choices: ['Their atoms have the same average kinetic energy, but helium atoms are faster', 'Argon atoms have more kinetic energy because they are heavier', 'Both have the same rms speed', 'Helium atoms have more kinetic energy because they are faster']
    ans: 0
    why: Temperature fixes the average translational kinetic energy, 3kT/2, whatever the mass. The rms speed √(3kT/m) is larger for the lighter atom.
  - q: In the Maxwell speed distribution, which speed is largest?
    choices: ['The rms speed', 'The mean speed', 'The most probable speed', 'All three are equal']
    ans: 0
    why: "v_rms = √(3kT/m), v̄ = √(8kT/πm), v_mp = √(2kT/m). Since 3 > 8/π ≈ 2.55 > 2, the rms speed is largest."
  - q: At fixed temperature, the pressure of a gas is halved. What happens to the mean free path?
    choices: ['It doubles', 'It halves', 'It stays the same', 'It grows by √2']
    ans: 0
    why: λ = kT/(√2 π d² P). Halving P at fixed T halves the number density, so molecules travel twice as far between collisions.
sources:
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965; reissued 2009), chapters 7 and 12'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 5 to 9'
  - 'M. W. Zemansky and R. H. Dittman, Heat and Thermodynamics, 7th ed. (McGraw-Hill, 1997), chapter 5'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to derive the pressure of a gas from molecular motion, use the Maxwell distribution and its three speeds without mixing them up, count degrees of freedom to get heat capacities and $\gamma$, estimate mean free paths and collision rates, and handle effusion, transport and the van der Waals gas.

<div class="bigidea">A gas is a crowd of tiny molecules flying about at random. Pressure is the push of their collisions with the walls, and temperature is a measure of their average kinetic energy.</div>

## 1. Pressure from molecules hitting a wall

Take a box of volume `$V$` holding `$N$` molecules of mass `$m$`. A molecule moving with velocity component `$v_x$` towards a wall bounces back with `$-v_x$`, so it hands the wall a momentum `$2mv_x$`. Step through the counting:

<div class="steps">
<div class="step"><p><b>One bounce.</b> Each collision with the wall (area A) gives it momentum 2m v<sub>x</sub>.</p></div>
<div class="step"><p><b>How many hit in time dt?</b> Those within a distance v<sub>x</sub> dt of the wall and moving towards it: half of the n A v<sub>x</sub> dt molecules in that slab, where n = N/V.</p></div>
<div class="step"><p><b>Force.</b> Momentum per second = (½ n A v<sub>x</sub>)(2m v<sub>x</sub>) = n m v<sub>x</sub>² A. Averaging over molecules: F = n m ⟨v<sub>x</sub>²⟩ A.</p></div>
<div class="step"><p><b>No preferred direction.</b> ⟨v<sub>x</sub>²⟩ = ⟨v<sub>y</sub>²⟩ = ⟨v<sub>z</sub>²⟩ = ⅓⟨v²⟩, so P = F/A = ⅓ n m ⟨v²⟩.</p></div>
<div class="step"><p><b>Compare with PV = NkT.</b> ⅓ N m ⟨v²⟩ = NkT, so ½ m⟨v²⟩ = (3/2) kT. Temperature is the average kinetic energy.</p></div>
</div>

```math
P = \frac13\,n\,m\,\langle v^2\rangle, \qquad \left\langle \tfrac12 m v^2\right\rangle = \tfrac32\,kT
```

<div class="meaning">

<dl>
<dt>n</dt><dd>number of molecules per cubic metre (N/V)</dd>
<dt>⟨v²⟩</dt><dd>the average of the square of the speed; its square root is the rms speed</dd>
<dt>k</dt><dd>Boltzmann's constant, 1.381 × 10⁻²³ J/K; per mole it becomes R = N<sub>A</sub>k = 8.314 J mol⁻¹ K⁻¹</dd>
<dt>Physical meaning</dt><dd>Heavy and light molecules at the same temperature carry the same average kinetic energy. The light ones make up for their small mass by moving faster.</dd>
</dl>

</div>

**Worked example.** The rms speed of nitrogen (`$M = 0.028$` kg/mol) at 300 K is `$\sqrt{3RT/M} = \sqrt{3\times8.314\times300/0.028} \approx 517$` m/s, faster than a rifle bullet. The trap: putting `$M = 28$` instead of `$0.028$` gives an answer about 32 times too small.

Heat the gas and shrink the box, and compare the pressure counted from wall hits with N k T / V.

<figure class="fig" data-fig="@wt-gas-box"><figcaption>P = N m ⟨v_x²⟩ / V: the pressure is momentum delivered to the wall per second per area. Notice that ⟨v_x²⟩ = kT/m, so P ∝ T at fixed V and P ∝ 1/V at fixed T (Boyle), and the histogram follows the Maxwell curve.</figcaption></figure>


## 2. The Maxwell distribution: not all molecules are equal

Molecules collide all the time, so their speeds spread out. Maxwell found that each velocity component has a bell curve (Gaussian) centred on zero, and so the speeds follow

```math
f(v) = 4\pi\left(\frac{m}{2\pi kT}\right)^{3/2} v^2\, e^{-mv^2/2kT}
```

The `$v^2$` comes from counting: there are more ways to have speed `$v$` when `$v$` is larger (a bigger sphere in velocity space). The exponential is the Boltzmann factor `$e^{-E/kT}$`, which kills very high speeds. Move the temperature and switch gases in the figure.

<figure class="fig" data-fig="maxwell-speeds"><figcaption>Heating spreads the distribution out and lowers its peak; the area stays 1. Lighter gases are faster at the same temperature. The three markers always keep the ratio 1 : 1.128 : 1.225.</figcaption></figure>

Three different "typical speeds" come out of it, and examiners love to mix them up:

| Speed | Formula | Where it comes from | Relative size |
|---|---|---|---|
| most probable `$v_{\rm mp}$` | `$\sqrt{2kT/m}$` | the peak, `$df/dv = 0$` | 1 |
| mean `$\bar v$` | `$\sqrt{8kT/\pi m}$` | `$\int v f\,dv$` | 1.128 |
| rms `$v_{\rm rms}$` | `$\sqrt{3kT/m}$` | `$\sqrt{\int v^2 f\,dv}$`, from equipartition | 1.225 |

Two more results worth knowing: `$\langle v_x\rangle = 0$` (as many go left as right) while `$\langle v_x^2\rangle = kT/m$`; and the speed of sound is `$\sqrt{\gamma kT/m}$`, a little slower than the molecules themselves.

<div class="myth">

**"The most probable kinetic energy is `$\tfrac12 m v_{\rm mp}^2 = kT$`."** No. If you rewrite the distribution in terms of energy, `$f(E) \propto \sqrt E\,e^{-E/kT}$`, its peak is at `$E = \tfrac12 kT$`. Changing the variable stretches the axis unevenly, so the peaks do not correspond. The *mean* energy is `$\tfrac32 kT$` either way, because averages do not depend on how you label the axis.

</div>

<div class="problem" data-problem="gas-speeds"></div>

## 3. Equipartition and heat capacities

The `$\tfrac32 kT$` is a special case of a general rule. **Equipartition theorem:** in classical equilibrium, every term in the energy that is quadratic in a coordinate or momentum carries an average energy `$\tfrac12 kT$`.

- Translation: `$\tfrac12 m v_x^2 + \tfrac12 m v_y^2 + \tfrac12 m v_z^2$`, three terms.
- Rotation of a linear molecule: two axes (spinning about the bond axis does not count), two terms. A non-linear molecule: three.
- Each vibration: kinetic `$\tfrac12\mu\dot x^2$` plus potential `$\tfrac12\kappa x^2$`, two terms, so a full `$kT$`.

Count the terms `$f$`, and per mole `$U = \tfrac f2 RT$`, `$C_V = \tfrac f2 R$`, `$C_P = C_V + R$`, `$\gamma = 1 + 2/f$`:

| Gas | `$f$` | `$C_V$` | `$\gamma$` |
|---|---|---|---|
| monatomic (He, Ar) | 3 | `$\tfrac32 R$` | 5/3 |
| diatomic, room temperature | 5 | `$\tfrac52 R$` | 7/5 |
| diatomic, vibration active | 7 | `$\tfrac72 R$` | 9/7 |
| non-linear polyatomic, rigid | 6 | `$3R$` | 4/3 |

Why is vibration "frozen" at room temperature? Because energy levels are quantised: a mode whose level spacing is much larger than `$kT$` cannot take up energy. For hydrogen, `$C_V/R$` climbs from 1.5 to 2.5 near 100 K (rotation switching on) and to 3.5 at a few thousand kelvin (vibration). Classical equipartition cannot explain the steps; quantum mechanics can.

**Worked example (mixtures).** One mole of helium plus one mole of oxygen: add heat capacities, `$C_V = (\tfrac32 + \tfrac52)R/2 = 2R$`, so `$\gamma = 3R/2R = 1.5$`. Averaging the two `$\gamma$` values gives 1.53, a favourite wrong option.

Slide the temperature across the freeze-out temperatures of rotation and vibration for a gas.

<figure class="fig" data-fig="@wt-dof-freeze"><figcaption>Equipartition gives ½R per quadratic term only when kT is large compared with the level spacing. Notice the plateaus at 3/2, 5/2 and 7/2 R, with the steps near θ_rot and θ_vib.</figcaption></figure>


## 4. Mean free path, collisions and effusion

Picture a molecule of diameter `$d$` moving through the others. It hits any molecule whose centre comes within `$d$` of its path, so it sweeps out a cylinder of cross-section `$\sigma = \pi d^2$`. Allowing for the motion of the others (relative speed `$\sqrt2\,\bar v$`):

```math
\lambda = \frac{1}{\sqrt2\,\pi d^2 n} = \frac{kT}{\sqrt2\,\pi d^2 P}, \qquad z = \frac{\bar v}{\lambda}
```

For air at room conditions `$\lambda \approx 70$` nm, a few hundred molecular diameters, and each molecule collides about `$7\times10^9$` times a second.

**Worked example.** Nitrogen, `$d = 3.7\times10^{-10}$` m, 273 K, `$1.013\times10^5$` Pa: `$\lambda = (1.381\times10^{-23})(273)/(1.414\,\pi\,(3.7\times10^{-10})^2(1.013\times10^5)) \approx 61$` nm. Using the radius by mistake changes the answer by a factor of four.

**Effusion.** If gas leaks through a hole smaller than `$\lambda$`, molecules leave one at a time. The number crossing unit area per second is `$\Phi = \tfrac14 n\bar v$`. Since `$\bar v \propto 1/\sqrt m$`, light gases escape faster (Graham's law, used to separate uranium isotopes). The escaping molecules are biased towards fast ones: their average kinetic energy is `$2kT$`, not `$\tfrac32 kT$`, so a gas left to effuse from an insulated box cools.

**Transport.** Molecules carry momentum, energy and themselves across a gas, each over about one mean free path. Elementary theory gives

```math
\eta = \tfrac13 n m\bar v\lambda, \qquad \kappa = \eta\,c_v, \qquad D = \tfrac13\bar v\lambda
```

Maxwell's surprise: since `$n\lambda$` is fixed, the viscosity of a gas does not depend on pressure, and it grows as `$\sqrt T$` (unlike a liquid's).

## 5. Real gases: van der Waals

Real molecules have size and attract each other. Van der Waals patched the ideal gas law with two constants:

```math
\left(P + \frac{a n^2}{V^2}\right)(V - nb) = nRT
```

`$b$` is the volume taken up by a mole of molecules; `$a/V^2$` is the pull-back from neighbours that reduces the push on the wall. Below a critical temperature the isotherms develop a wiggle, and the gas can condense.

<figure class="fig" data-fig="vdw-isotherms"><figcaption>Reduced van der Waals isotherms. Below T<sub>c</sub> the shaded part (pressure rising with volume) is unstable and the gas condenses; at T<sub>c</sub> the wiggle flattens into an inflection; well above T<sub>c</sub> the gas behaves almost ideally.</figcaption></figure>

At the critical point both `$\partial P/\partial V$` and `$\partial^2P/\partial V^2$` vanish, which gives `$V_c = 3b$`, `$P_c = a/27b^2$`, `$T_c = 8a/27Rb$` and `$Z_c = P_cV_c/RT_c = 3/8$`. Two more temperatures: the Boyle temperature `$a/Rb$` (where the gas is ideal-like at low density) and the Joule–Thomson inversion temperature `$2a/Rb$` ([lesson 5.4](/learn/courses/iit-jam-physics/thermodynamic-potentials/)). Explore real gases with fibub's [real gas calculator](/science/real-gas-calculator/) and simple gas-law sums with the [gas law calculator](/science/gas-law-calculator/).

<div class="keypoints">

- `$P = \tfrac13 nm\langle v^2\rangle$` and `$\langle\tfrac12 mv^2\rangle = \tfrac32 kT$`: temperature is average kinetic energy, the same for every gas at the same `$T$`.
- Maxwell speeds: `$v_{\rm mp} : \bar v : v_{\rm rms} = \sqrt2 : \sqrt{8/\pi} : \sqrt3$`. The most probable *energy* is `$\tfrac12 kT$`, not `$kT$`.
- Equipartition: `$\tfrac12 kT$` per quadratic term; `$C_V = \tfrac f2 R$`, `$\gamma = 1 + 2/f$`. For mixtures add heat capacities, never `$\gamma$`s.
- `$\lambda = 1/(\sqrt2\pi d^2 n)$`: inversely proportional to pressure at fixed `$T$`; use the diameter.
- Effusion flux `$\tfrac14 n\bar v$`; escaping molecules carry `$2kT$` on average.
- Van der Waals: `$T_c = 8a/27Rb$`, `$V_c = 3b$`, `$P_c = a/27b^2$`, `$Z_c = 3/8$`; `$T_B = a/Rb$`, `$T_i = 2a/Rb$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [kinetic theory practice page](/learn/courses/iit-jam-physics/practice/kinetic-theory/).

<div class="qbank" data-bank="physics" data-topics="kinetic-theory" data-exam="jam" data-n="10"></div>

**Next:** [lesson 5.2, the first law](/learn/courses/iit-jam-physics/first-law/), where these heat capacities decide how a gas responds to heating and compression. Going on to GATE? The [classical ideal gas and equipartition](/learn/courses/gate-physics/classical-gas-equipartition/) lesson derives all of this from the partition function, and fibub's [quantum statistics plotter](/science/quantum-statistics/) shows where the Maxwell–Boltzmann picture breaks down. CSIR NET's [kinetic theory of transport](/learn/courses/csir-net-physics/transport/) carries the mean free path on to viscosity and heat conduction.
