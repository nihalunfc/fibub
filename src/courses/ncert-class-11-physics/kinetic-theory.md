---
title: Kinetic Theory
seoTitle: 'Kinetic Theory Class 11 notes with animations'
summary: 'Class 11 Kinetic Theory with animations: gas laws, pressure from molecular hits, rms speed, degrees of freedom, specific heats and mean free path.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The temperature of an ideal gas is doubled (in kelvin). The rms speed of its molecules becomes:'
    choices: ['2 times', '√2 times', '4 times', 'half']
    ans: 1
    why: 'v_rms = √(3kT/m) is proportional to √T, so doubling T multiplies the rms speed by √2.'
  - q: 'The ratio C_p / C_v for a rigid diatomic gas (f = 5) is:'
    choices: ['5/3', '7/5', '4/3', '9/7']
    ans: 1
    why: 'C_v = 5R/2 and C_p = C_v + R = 7R/2, so γ = 7/5.'
  - q: 'A gas is compressed to half its volume with the temperature kept constant. The pressure:'
    choices: ['halves', 'stays the same', 'doubles', 'becomes four times']
    ans: 2
    why: 'Boyle’s law: PV is constant. Half the volume means the same molecules hit the walls twice as often per unit area.'
sources:
  - 'NCERT Class 11 Physics, Chapter 12 “Kinetic Theory” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Gas constant and Boltzmann constant: CODATA 2018 recommended values (NIST)'
  - 'Equipartition and specific heats of gases: Kittel and Kroemer, Thermal Physics, 2nd edition, chapters 3 and 14'
  - 'Maxwell, J. C. (1860), “Illustrations of the dynamical theory of gases”, Philosophical Magazine 19 (history box)'
---

**Physics · Class 11 · Chapter 12 · about 70 minutes.** By the end you will be able to use the gas laws, derive the pressure of a gas from molecular collisions, link temperature to molecular energy, count degrees of freedom to find specific heats, and work out how far a molecule travels between collisions.

<div class="bigidea">A gas is a huge crowd of tiny molecules moving at random and hitting the walls. Each hit is a tiny push; billions of hits a second add up to the steady pressure we measure. Temperature is just a measure of how much kinetic energy the crowd has on average. Everything about gases (the laws, the specific heats, the speed of sound) follows from that one picture.</div>

## 1. Molecular nature of matter and the gas laws

All matter is made of atoms and molecules, always moving. In a solid they vibrate in place, in a liquid they slide past one another, and in a **gas** they are far apart (about ten molecule-widths apart in air) and fly freely, meeting only in collisions. That large gap is why gases are easy to squeeze and fill any container, like a crowd spreading out in an empty stadium.

<figure class="fig" data-fig="@wt-states-of-matter"><figcaption>Cool the molecules and they lock into a crystal, warm them and they slide as a liquid, spread them out and they fly as a gas. Move the sliders and watch how the neighbour count changes.</figcaption></figure>

A real gas behaves like the **ideal gas** when it is hot and thin (high temperature, low pressure), because then the molecules are so far apart that forces between them hardly matter. For an ideal gas three simple laws hold:

- **Boyle’s law** (fixed temperature): `$PV = \text{constant}$`
- **Charles’ law** (fixed pressure): `$V \propto T$`, with T in kelvin
- **Gay-Lussac’s law** (fixed volume): `$P \propto T$`

Together they give the **ideal gas equation**

```math
PV = nRT = Nk_BT
```

<div class="meaning">

<dl>
<dt>P, V, T</dt><dd>pressure (Pa), volume (m³) and absolute temperature (K)</dd>
<dt>n</dt><dd>amount of gas in moles; N = n N<sub>A</sub> is the number of molecules</dd>
<dt>R</dt><dd>universal gas constant, 8.314 J/(mol K)</dd>
<dt>k<sub>B</sub></dt><dd>Boltzmann constant, R/N<sub>A</sub> = 1.38 × 10⁻²³ J/K: the gas constant for one molecule</dd>
<dt>Physical meaning</dt><dd>Pressure is the grip of many molecules on a wall; more molecules or faster ones (higher T) raise it, more room (larger V) lowers it.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-kin-laws"><figcaption>Pick a law, then move both sliders. Dashed curves are the other members of the family. In Charles’ graph the straight line runs back to zero volume at 0 K, which is why the kelvin scale starts there.</figcaption></figure>

<div class="problem" data-problem="c11p-kin-ideal"></div>

<div class="problem" data-problem="c11p-kin-boyle"></div>

**Dalton’s law of partial pressures.** In a mixture of gases that do not react, each gas fills the whole container as if it were alone, so the total pressure is the sum of the partial pressures: `$P = P_1 + P_2 + \cdots$`. Air is about 78 % nitrogen and 21 % oxygen, so at 1 atm the oxygen alone exerts about 0.21 atm.

<div class="myth">

**“Celsius or kelvin, it makes no difference in the gas laws.”** It does. Charles’ law says V is proportional to the temperature measured from absolute zero. Doubling 20 °C does not double the volume; doubling 293 K does. Always add 273 (273.15) before using the gas laws.

</div>

## 2. Kinetic theory of an ideal gas: the pressure

The kinetic theory starts with a few plain assumptions about the gas:

1. A gas contains a very large number of identical molecules, moving at random in all directions and at all speeds.
2. The molecules are so small, and so far apart, that their own volume is negligible.
3. They exert no force on each other except during a collision, and they travel in straight lines between collisions.
4. All collisions, with each other and with the walls, are perfectly elastic: no kinetic energy is lost.

### Derivation of the pressure

Follow one molecule in a cubical box of side L, then add up all molecules.

<div class="steps" data-fig="c11p-kin-pressure">
<div class="step">One molecule of mass m moves in a box of side L with velocity components (vx, vy, vz). Only the part vx, perpendicular to the right-hand wall, pushes on that wall.</div>
<div class="step">It hits the wall and bounces back elastically, so vx changes from +vx to −vx. The molecule’s momentum changes by −2mvx, so the wall gets +2mvx.</div>
<div class="step">To hit the same wall again the molecule travels across the box and back, a distance 2L, in time 2L/vx. The average force on the wall is momentum per hit divided by time between hits: F = 2mvx ÷ (2L/vx) = m vx²/L.</div>
<div class="step">With N molecules the total force adds the contributions of all: F = (m/L)(vx₁² + vx₂² + …) = N m ⟨vx²⟩ / L, where ⟨vx²⟩ is the mean of vx².</div>
<div class="step">No direction is special, so ⟨vx²⟩ = ⟨vy²⟩ = ⟨vz²⟩ = ⟨v²⟩/3. The pressure is force per area, P = F/L² = N m ⟨v²⟩/(3L³) = N m ⟨v²⟩/(3V), that is one third of ρ⟨v²⟩.</div>
</div>

```math
P = \frac{1}{3}\frac{N}{V}m\langle v^2\rangle = \frac13\rho\langle v^2\rangle
```

Here ρ is the mass of gas per unit volume. The same result holds for a vessel of any shape, because molecules bounce off a curved wall in the same way.

<figure class="fig" data-fig="@wt-gas-box"><figcaption>Real counting: raise the temperature or shrink the box and see the measured pressure (hits on the wall) follow NkT/V while the speed histogram follows the Maxwell curve.</figcaption></figure>

### What temperature means

Write the result as `$PV = \tfrac{2}{3}N\left(\tfrac12 m\langle v^2\rangle\right)$` and compare with `$PV = Nk_BT$`. Then the average translational kinetic energy of one molecule is

```math
\left\langle \tfrac12 mv^2\right\rangle = \frac32 k_BT, \qquad v_{\text{rms}} = \sqrt{\langle v^2\rangle} = \sqrt{\frac{3k_BT}{m}} = \sqrt{\frac{3RT}{M}}
```

So **temperature is a measure of the average kinetic energy of a molecule**: the same for hydrogen and oxygen at the same temperature, which means the lighter hydrogen molecules must move faster. At 300 K the rms speed is about 1900 m/s for hydrogen and 480 m/s for oxygen. At absolute zero the molecular motion would (classically) stop. For gas, the internal energy is just the total kinetic energy, `$U = \tfrac32 Nk_BT = \tfrac32 nRT$` for a monatomic gas.

<div class="problem" data-problem="c11p-kin-rms"></div>

<div class="problem" data-problem="c11p-kin-ke"></div>

<div class="problem" data-problem="c11p-kin-rmsratio"></div>

Explore the gas in a box, tuning temperature and particle number, with the tool:

<!--fig:tool kinetic-theory-->

<div class="history">

**A closer look (beyond the syllabus of the school exam).** The molecules do not all have the speed v_rms. Maxwell (1860) showed that speeds are spread out in a bell-like curve, with a few very slow and a few very fast molecules. Slide the temperature and the gas to see how the curve shifts and flattens: `v_mp < v_avg < v_rms`.

</div>

<figure class="fig" data-fig="c11p-kin-speeds"><figcaption>The Maxwell speed distribution. Heating moves the peak right and flattens the curve; the dashed line is the same gas at 300 K. Light gases such as hydrogen have a long tail of fast molecules, which is why Earth cannot hold on to its hydrogen.</figcaption></figure>

## 3. Law of equipartition of energy

A molecule can store energy in several ways. Each independent way is a **degree of freedom**: moving along x, y or z (3 translational), spinning about an axis (rotational), and vibrating, where the atoms stretch the bond back and forth (each vibrational mode counts twice, because it holds both kinetic and potential energy).

The **law of equipartition of energy** says: in thermal equilibrium at temperature T, every degree of freedom holds on average the same energy, `$\tfrac12 k_BT$` per molecule. For a molecule with f degrees of freedom, the mean energy is `$\tfrac f2 k_BT$`, so one mole has `$U = \tfrac f2 RT$`. The translational part, 3 × ½kT = 3kT/2, is the kinetic energy you met above.

<div class="steps" data-fig="c11p-kin-dof">
<div class="step">A <b>monatomic</b> gas (helium, argon): one atom, treated as a point. Only 3 translational degrees of freedom, so f = 3.</div>
<div class="step">A <b>diatomic</b> gas at ordinary temperatures (hydrogen, nitrogen, oxygen): a dumbbell that also spins about two axes perpendicular to the bond. Spin along the bond does not count for point-like atoms. f = 3 + 2 = 5.</div>
<div class="step">At very high temperatures the bond of a diatomic molecule also vibrates. This adds 2 more degrees of freedom: f = 7. (At room temperature this vibration is “frozen out”, so we use f = 5.)</div>
<div class="step">A <b>non-linear triatomic</b> molecule such as water vapour spins about all three axes, so f = 3 + 3 = 6 for a rigid molecule.</div>
</div>

<div class="problem" data-problem="c11p-kin-gamma"></div>

Count the shares and see their energy: [Equipartition tool](/learn/equipartition/). See how the specific heat switches on step by step as the temperature rises, as rotation and then vibration wake up:

<figure class="fig" data-fig="@wt-dof-freeze"><figcaption>C<sub>v</sub>/R of helium, hydrogen, nitrogen and carbon dioxide against temperature. At low temperature only translation is active; rotation joins, then vibration.</figcaption></figure>

## 4. Specific heat capacity

The heat needed to raise the temperature of one mole by one kelvin is the **molar specific heat**. For a gas it depends on how it is heated.

- **At constant volume** nothing is spent on expansion, so all the heat raises the internal energy: `$C_v = \dfrac{dU}{dT} = \dfrac f2R$`.
- **At constant pressure** the gas also expands and does work `$P\,dV = R\,dT$` per mole, so extra heat is needed: `$C_p = C_v + R$` (Mayer’s relation).

```math
\gamma = \frac{C_p}{C_v} = 1 + \frac2f
```

| Gas | f | C<sub>v</sub> | C<sub>p</sub> | γ |
|---|---|---|---|---|
| Monatomic (He, Ar) | 3 | 3R/2 | 5R/2 | 5/3 = 1.67 |
| Diatomic, rigid (H₂, N₂, O₂) | 5 | 5R/2 | 7R/2 | 7/5 = 1.40 |
| Non-linear triatomic (rigid) | 6 | 3R | 4R | 4/3 = 1.33 |

<div class="meaning">

<dl>
<dt>C<sub>v</sub>, C<sub>p</sub></dt><dd>molar heat capacities at constant volume and pressure, J/(mol K)</dd>
<dt>γ</dt><dd>their ratio; it fixes the speed of sound and how steeply a gas heats when compressed quickly</dd>
<dt>Physical meaning</dt><dd>Heating a gas in a closed tin only warms it. Heating it under a free piston warms it and also pushes the piston out: that extra work costs one R of heat per mole per kelvin.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-kin-cv"></div>

For solids, each atom vibrates in three directions, with kinetic and potential energy in each: 6 half-kT shares, so the molar heat capacity is `$C = 3R \approx 25$` J/(mol K) (the law of Dulong and Petit). Water, like a solid, has `$C \approx 9R$` because of its extra bonds and motions.

<div class="myth">

**“Gases of different kinds have different average kinetic energies at the same temperature.”** The mean translational energy is 3kT/2 for every ideal gas. What differs is the speed (lighter molecules are faster) and the extra rotational and vibrational energy.

</div>

## 5. Mean free path

A molecule in air does not run straight to the other side of the room. It collides about 5 × 10⁹ times a second, zigzagging. The average distance between two successive collisions is the **mean free path** λ.

<div class="steps" data-fig="c11p-kin-mfp">
<div class="step">Between collisions a molecule travels in a straight line; the length of each stretch is different, and the average is λ.</div>
<div class="step">Treat the molecule as a sphere of diameter d. It hits another molecule if that molecule’s centre is within a distance d of its path, so it sweeps a tube of cross-section π d².</div>
<div class="step">In time t at speed v the tube has volume π d² v t. With n molecules per m³ the number of collisions is n π d² v t. The free path = distance ÷ number of collisions = v t / (n π d² v t) = 1/(n π d²).</div>
<div class="step">The other molecules move too. Allowing for this, the relative speed averages √2 times v, so the collisions are √2 times more frequent and λ becomes smaller by √2.</div>
</div>

```math
\lambda = \frac{1}{\sqrt2\,\pi d^2 n}
```

<div class="meaning">

<dl>
<dt>d</dt><dd>molecular diameter (about 0.3 nm for air molecules)</dd>
<dt>n</dt><dd>number of molecules per m³ (2.7 × 10²⁵ at 0 °C and 1 atm); using PV = Nk<sub>B</sub>T, n = P/(k<sub>B</sub>T)</dd>
<dt>Physical meaning</dt><dd>The denser or the bigger the molecules, the shorter the free path. For air at STP, λ ≈ 70 nm, about 200 times the molecule’s own size. At the height of a satellite the air is so thin that λ is many kilometres.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-kin-mfp"></div>

Move the sliders to see how the size of the molecules and the density change the free path:

<!--fig:tool mean-free-path-->

Because `$\lambda \propto 1/n = k_BT/P$`, pumping out a vacuum chamber makes λ longer; at low enough pressure, molecules fly from wall to wall without meeting each other. Cathode-ray tubes and vacuum tubes need this. Also compare the ideal gas with a real one using the [Real gas calculator](/science/real-gas-calculator/).

<div class="history">

<ul class="timeline">
<li><b>1662</b> Robert Boyle finds that the volume of a trapped gas shrinks as pressure rises.</li>
<li><b>1738</b> Daniel Bernoulli explains gas pressure as molecules striking the walls.</li>
<li><b>1811</b> Amedeo Avogadro proposes that equal volumes of gases hold equal numbers of molecules.</li>
<li><b>1860</b> James Clerk Maxwell works out the distribution of molecular speeds.</li>
<li><b>1905</b> Albert Einstein explains the zigzag Brownian motion of pollen grains as molecular hits, convincing doubters that molecules are real.</li>
</ul>

</div>

<div class="keypoints">

- Ideal gas: PV = nRT = Nk<sub>B</sub>T; Boyle PV = const; Charles V ∝ T; Gay-Lussac P ∝ T (T in kelvin). Dalton: P = P₁ + P₂ + …
- Pressure: P = ⅓ (N/V) m⟨v²⟩ = ⅓ ρ⟨v²⟩. Mean translational KE = (3/2) k<sub>B</sub>T; v<sub>rms</sub> = √(3k<sub>B</sub>T/m) = √(3RT/M).
- Temperature measures the mean KE per molecule; at the same T lighter molecules are faster. v<sub>mp</sub> &lt; v<sub>avg</sub> &lt; v<sub>rms</sub>.
- Equipartition: each degree of freedom holds ½k<sub>B</sub>T per molecule; U = (f/2)RT per mole. f = 3 (monatomic), 5 (diatomic), 7 (with vibration), 6 (non-linear triatomic).
- C<sub>v</sub> = (f/2)R, C<sub>p</sub> = C<sub>v</sub> + R, γ = 1 + 2/f: 5/3, 7/5, 4/3.
- Solids: C ≈ 3R. Mean free path λ = 1/(√2 π d² n); it grows as the pressure falls.

</div>

Going further for JEE/NEET: the exam-level problems (mixtures, Graham’s law, adiabatic changes, real gases and van der Waals) are in [Kinetic theory of gases (JEE)](/learn/courses/engineering-entrance/kinetic-theory/).
