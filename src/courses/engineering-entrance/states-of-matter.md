---
title: 'Gases and liquids'
seoTitle: 'Gas laws, kinetic theory and real gases: JEE chemistry'
summary: 'Forces between molecules, the gas laws and the ideal gas equation, Dalton''s law and gases collected over water, Graham''s law, kinetic theory and molecular speeds, real gases with the compressibility factor and the van der Waals equation, critical constants and liquefaction, and the liquid state (vapour pressure, surface tension, viscosity).'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'At the same temperature, which gas has the highest average kinetic energy per molecule?'
    choices: ['H₂', 'O₂', 'CO₂', 'All the same']
    ans: 3
    why: 'Average kinetic energy per molecule is (3/2)kT: it depends only on temperature. Lighter molecules move faster, but their energy is the same.'
  - q: 'For a real gas at low pressure where attractions dominate, the compressibility factor Z is:'
    choices: ['Exactly 1', 'Less than 1', 'More than 1', 'Zero']
    ans: 1
    why: 'Attractions pull molecules together, so the gas takes less volume than an ideal gas would: Z = PV/nRT < 1. At high pressure the size of molecules wins and Z > 1.'
  - q: 'Above its critical temperature, a gas:'
    choices: ['Liquefies easily', 'Cannot be liquefied however high the pressure', 'Becomes a solid', 'Behaves ideally']
    ans: 1
    why: 'The critical temperature is the highest temperature at which a gas can be turned into a liquid by pressure alone. Above it there is no separate liquid phase.'
sources:
  - 'CODATA 2018 recommended values: molar gas constant R = 8.314 462 618 J mol⁻¹ K⁻¹ https://physics.nist.gov/cuu/Constants/'
  - 'IUPAC Gold Book: compressibility factor, critical temperature, van der Waals equation https://goldbook.iupac.org'
  - 'Water vapour pressure data: NIST Chemistry WebBook https://webbook.nist.gov'
  - 'JEE Main / JEE Advanced 2026 syllabi: States of matter (gases and liquids); not in the current NEET (UG) syllabus'
---

**Chemistry · Class 11 · about 34 minutes.** By the end you will be able to solve any ideal gas problem, handle mixtures and gases collected over water, compare effusion rates and molecular speeds, explain when and why real gases differ from ideal ones and link the van der Waals constants to liquefaction.

<div class="bigidea">A gas is mostly empty space with molecules racing about. Temperature is just their average kinetic energy, and pressure is their collisions with the walls. Real gases differ from ideal ones only because their molecules have size and attract each other.</div>

## 1. Forces between molecules

Whether a substance is a gas, liquid or solid depends on a contest between **intermolecular attractions** (pulling molecules together) and **thermal energy** (shaking them apart). The attractions, weakest to strongest: **London dispersion forces** (in every molecule, larger for bigger molecules with more electrons), **dipole-dipole** forces (polar molecules), **dipole-induced dipole** forces, and **hydrogen bonds** (H on F, O or N). These are much weaker than covalent bonds; they are broken when a liquid boils, but the molecules themselves stay whole.

## 2. The gas laws and the ideal gas equation

| Law | Held constant | Statement |
|---|---|---|
| Boyle | n, T | P ∝ 1/V, so P₁V₁ = P₂V₂ |
| Charles | n, P | V ∝ T (kelvin), so V₁/T₁ = V₂/T₂ |
| Gay-Lussac | n, V | P ∝ T (kelvin) |
| Avogadro | P, T | V ∝ n |

Together they give the **ideal gas equation** PV = nRT. Since n = m/M, the density of a gas is d = PM/(RT): a heavier gas, a higher pressure or a lower temperature makes it denser. At STP (273 K, 1 atm) one mole occupies 22.4 L.

<div class="meaning">
<dl>
<dt>P, V, T, n</dt><dd>pressure, volume, temperature in kelvin (°C + 273), moles</dd>
<dt>R</dt><dd>gas constant: 0.0821 L atm K⁻¹ mol⁻¹ = 8.314 J K⁻¹ mol⁻¹</dd>
<dt>M, d</dt><dd>molar mass (g/mol; in kg/mol inside speed formulas), density</dd>
<dt>Z</dt><dd>compressibility factor PV/(nRT): 1 for an ideal gas</dd>
<dt>a, b</dt><dd>van der Waals constants: a for attraction, b for the volume the molecules themselves take up</dd>
<dt>Physical meaning</dt><dd>PV = nRT says that every gas, whatever its molecules, behaves the same way if the molecules are tiny and do not attract. Temperature in kelvin starts from zero motion, which is why every gas law needs kelvin.</dd>
</dl>
</div>

<div class="problem" data-problem="sm-ideal-gas"></div>

**Try it:** slide the volume down and watch the piston-hit pressure rise; raise T and the particles speed up; add particles and the pressure rises too. Use the quick buttons for Boyle's and Charles's laws.

<figure class="fig" data-fig="@chem-gas-piston"><figcaption>Pressure here is nothing but the push of particles on the piston each second. Compare the measured value with N·T ÷ V in the readout: the ratio P·V ÷ (N·T) stays constant, which is the ideal gas law.</figcaption></figure>

## 3. Dalton's law of partial pressures

In a mixture of gases that do not react, each gas pushes as if it were alone: P<sub>total</sub> = p₁ + p₂ + … The **partial pressure** of a gas is its mole fraction times the total: p₁ = x₁ P<sub>total</sub>. A gas **collected over water** is mixed with water vapour, so p<sub>dry gas</sub> = P<sub>total</sub> − (vapour pressure of water at that temperature, the **aqueous tension**).

## 4. Graham's law of diffusion and effusion

At the same temperature and pressure, the rate of effusion (escape through a pinhole) is inversely proportional to the square root of the molar mass: r₁/r₂ = √(M₂/M₁). The time for the same volume to escape goes the other way: t ∝ √M. If the pressures differ, the rate is also proportional to pressure: r ∝ P/√M. Hydrogen effuses 4 times as fast as oxygen (√(32/2) = 4). This principle was used to separate ²³⁵UF₆ from ²³⁸UF₆.

<div class="problem" data-problem="sm-graham"></div>

## 5. Kinetic theory and molecular speeds

The **kinetic theory** pictures a gas as point molecules in random motion, colliding elastically, with no forces between them. It leads to PV = ⅓ m N u<sub>rms</sub>² and to the result that the **average kinetic energy** of one mole is (3/2)RT. So temperature measures molecular motion, and all gases at one temperature share the same average kinetic energy.

Not all molecules move at the same speed. The **Maxwell distribution** gives three typical speeds, all proportional to √(T/M):

```math
u_{mp} = \sqrt{\frac{2RT}{M}} \qquad \bar u = \sqrt{\frac{8RT}{\pi M}} \qquad u_{rms} = \sqrt{\frac{3RT}{M}}
```

They are in the ratio 1 : 1.128 : 1.225. Raising the temperature moves the peak to higher speeds and flattens it (the area under the curve stays 1).

<figure class="fig" data-fig="gas-speeds"><figcaption>Maxwell distribution for a chosen gas and temperature. The three marked speeds are the most probable (mp), average (avg) and root mean square (rms). The dashed curve is the same gas at 300 K for comparison.</figcaption></figure>

<div class="problem" data-problem="sm-speeds"></div>

## 6. Real gases and the van der Waals equation

Real gases follow PV = nRT only at **low pressure and high temperature**. The **compressibility factor** Z = PV/(nRT) shows how far off they are. Z < 1: attractions win and the gas is easier to compress. Z > 1: the molecules' own volume wins. H₂ and He have Z > 1 at room temperature at all pressures because their attractions are so weak.

Van der Waals fixed the ideal equation in two ways: the molecules take up volume nb, and attractions reduce the pressure on the walls by an²/V²:

```math
\left(P + \frac{a n^2}{V^2}\right)(V - nb) = nRT
```

A larger **a** means stronger attractions and easier liquefaction (NH₃ has a big a). A larger **b** means bigger molecules. At low pressure the a term matters more (Z ≈ 1 − a/(VRT)); at high pressure the b term (Z ≈ 1 + Pb/(RT)). The **Boyle temperature** T<sub>B</sub> = a/(Rb) is where a real gas behaves ideally over a range of low pressures.

<div class="myth">

**"A gas with a bigger b is easier to liquefy."** Liquefaction depends on attraction, which is a. The critical temperature T<sub>c</sub> = 8a/(27Rb) grows with a; b only measures the size of the molecules.

</div>

**Try it:** drag the temperature up and down and compare the five gases. Find the temperature where each curve starts out flat (its Boyle temperature).

<figure class="fig" data-fig="@chem-real-gas-z"><figcaption>Z = 1 is ideal. Below the Boyle temperature attractions pull Z under 1; at high pressure repulsion (the size b) always pushes Z above 1. Light, small molecules such as He and H₂ are above 1 almost everywhere at room temperature.</figcaption></figure>

## 7. Critical constants and liquefaction

Every gas has a **critical temperature** T<sub>c</sub> above which no pressure can liquefy it. The pressure needed at T<sub>c</sub> is the **critical pressure** P<sub>c</sub>, and the molar volume there the **critical volume** V<sub>c</sub>. From the van der Waals equation: V<sub>c</sub> = 3b, P<sub>c</sub> = a/(27b²), T<sub>c</sub> = 8a/(27Rb), and Z<sub>c</sub> = 3/8 for every van der Waals gas. CO₂ has T<sub>c</sub> = 304 K, so it can be liquefied at room temperature by pressure; O₂ (155 K) must first be cooled.

## 8. The liquid state

**Vapour pressure** is the pressure of the vapour in equilibrium with its liquid. It rises with temperature. A liquid **boils** when its vapour pressure equals the outside pressure: at 1 atm the **normal boiling point**, at 1 bar the standard boiling point (water 99.6 °C). Water boils at a lower temperature on a mountain, and at a higher one in a pressure cooker.

**Surface tension** (N/m) is the energy needed to increase the surface by one unit area; molecules at the surface are pulled inwards, so drops are round and liquids rise in thin tubes. **Viscosity** (Pa s) is resistance to flow. Both are larger when attractions are stronger (glycerol, with three OH groups, is very viscous) and both fall as the temperature rises.

<div class="keypoints">

- PV = nRT with T in kelvin; d = PM/(RT); 22.4 L/mol at STP.
- Dalton: p = x P<sub>total</sub>; subtract aqueous tension for gas over water.
- Graham: r ∝ 1/√M (and ∝ P); time for the same volume ∝ √M.
- Average KE per mole = (3/2)RT, the same for all gases at one T.
- u<sub>mp</sub> : ū : u<sub>rms</sub> = 1 : 1.128 : 1.225, all ∝ √(T/M).
- Z < 1 attraction wins, Z > 1 size wins; ideal at low P, high T.
- V<sub>c</sub> = 3b, P<sub>c</sub> = a/27b², T<sub>c</sub> = 8a/27Rb, Z<sub>c</sub> = 3/8, T<sub>B</sub> = a/Rb.
- Boiling: vapour pressure = outside pressure; surface tension and viscosity fall on heating.

</div>
