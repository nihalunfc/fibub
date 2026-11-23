---
title: Thermal Properties of Matter
seoTitle: 'Thermal Properties of Matter Class 11 notes, calorimetry'
summary: 'Class 11 Thermal Properties of Matter with animations: gas laws, thermal expansion, calorimetry, latent heat, conduction, radiation and Newton''s law of cooling.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'A temperature of 300 K is equal to:'
    choices: ['27 °C', '573 °C', '−273 °C', '300 °C']
    ans: 0
    why: '°C = K − 273.15, so 300 K is about 27 °C.'
  - q: 'How much heat is needed to melt 100 g of ice at 0 °C? (Latent heat of fusion 336 J/g.)'
    choices: ['3.36 kJ', '33.6 kJ', '336 kJ', '33.6 J']
    ans: 1
    why: 'Q = mL = 100 g × 336 J/g = 33 600 J = 33.6 kJ, and the temperature stays at 0 °C while the ice melts.'
  - q: 'A black body is heated from 300 K to 600 K. The power it radiates increases by a factor of:'
    choices: ['2', '4', '8', '16']
    ans: 3
    why: 'P ∝ T⁴, and (600/300)⁴ = 16.'
sources:
  - 'NCERT Class 11 Physics, Chapter 10 “Thermal Properties of Matter” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Specific heats, latent heats, thermal conductivities and expansion coefficients: CRC Handbook of Chemistry and Physics, 97th edition'
  - 'Stefan-Boltzmann constant and Wien constant: CODATA 2018 recommended values (NIST)'
  - 'Newton, I. (1701), “Scala graduum caloris”, Philosophical Transactions (for the history box)'
---

**Physics · Class 11 · Chapter 10 · about 90 minutes.** By the end you will be able to convert between temperature scales, use the ideal gas equation, calculate thermal expansion, solve calorimetry and latent heat problems, and explain conduction, convection, radiation and Newton’s law of cooling.

<div class="bigidea">Temperature says how hot something is, heat is the energy that flows because of a temperature difference. Adding heat usually raises the temperature (by an amount set by the specific heat), but while a substance changes state the heat goes into breaking bonds instead. Heat moves three ways: through matter (conduction), with moving fluid (convection) and as light (radiation).</div>

## 1. Temperature and heat

**Temperature** measures the degree of hotness, related to the average kinetic energy of the molecules. **Heat** is the energy transferred between bodies because of a temperature difference. Heat is measured in joules (older unit: calorie, 1 cal = 4.186 J). Heat flows from hot to cold until the temperatures are equal (thermal equilibrium).

**Temperature scales.** A thermometer uses a property that changes smoothly with temperature (the length of mercury, the resistance of a wire). Two fixed points set the scale: the ice point and the steam point of water at normal pressure.

| Scale | Ice point | Steam point | Divisions |
|---|---|---|---|
| Celsius (°C) | 0 | 100 | 100 |
| Fahrenheit (°F) | 32 | 212 | 180 |
| Kelvin (K) | 273.15 | 373.15 | 100 |

```math
\frac{C}{5} = \frac{F-32}{9},\qquad T(\text{K}) = t(^\circ\text{C}) + 273.15
```

The kelvin is the SI unit; 0 K (absolute zero) is the lowest temperature possible. Try conversions in [Temperature scales](/learn/temperature-scales/).

<div class="problem" data-problem="c11p-therm-scale"></div>

## 2. Ideal gas equation and absolute temperature

Experiments on gases at low pressure give three laws:
- **Boyle’s law:** at constant T, `$PV = \text{constant}$`.
- **Charles’s law:** at constant P, `$V \propto T$`.
- **Gay-Lussac’s law:** at constant V, `$P \propto T$`.

Together, for n moles:

```math
PV = nRT = Nk_BT,\qquad R = 8.314\ \text{J mol}^{-1}\text{K}^{-1}
```

`$k_B = 1.38\times10^{-23}$` J/K is the Boltzmann constant and N the number of molecules. A gas that obeys this at all pressures and temperatures is an **ideal gas**; real gases do when they are dilute and far above their boiling point.

<figure class="fig" data-fig="c11p-therm-gas"><figcaption>Pick a law. In Boyle’s graph the curve is a hyperbola. In Charles’s and Gay-Lussac’s graphs every straight line, drawn back (dashed), meets the temperature axis at −273 °C, which defines the absolute zero of the **kelvin** scale. Real gases turn liquid before they get there.</figcaption></figure>

<div class="meaning">

<dl>
<dt>n, N</dt><dd>amount of gas in moles; number of molecules (N = n × 6.02 × 10²³)</dd>
<dt>R, k<sub>B</sub></dt><dd>the gas constant per mole and per molecule (R = N<sub>A</sub>k<sub>B</sub>)</dd>
<dt>Physical meaning</dt><dd>Pressure comes from molecules hitting the walls; hotter means faster molecules and harder hits, so pressure rises with T at fixed V. Absolute zero is where this motion would stop.</dd>
</dl>

</div>

<div class="myth">

**“Doubling the temperature from 20 °C to 40 °C doubles the pressure of a gas.”** The gas laws need the kelvin scale: 293 K to 313 K raises the pressure by only about 7 %.

</div>

## 3. Thermal expansion

Most things expand when heated, because the atoms vibrate with a larger amplitude and spend more time farther apart (the bond energy curve is not symmetric). For a small rise ΔT:

- **Linear:** `$\Delta L = \alpha L\,\Delta T$`
- **Area:** `$\Delta A = \beta A\,\Delta T$` with β ≈ 2α
- **Volume:** `$\Delta V = \gamma V\,\Delta T$` with γ ≈ 3α

Typical α (per °C): steel 12 × 10⁻⁶, aluminium 23 × 10⁻⁶, brass 19 × 10⁻⁶, copper 17 × 10⁻⁶, glass 9 × 10⁻⁶. For gases at constant pressure γ = 1/T.

<figure class="fig" data-fig="c11p-therm-expand"><figcaption>Bimetal strip: brass expands more than steel, so a heated strip bends with brass on the outside. It is the heart of a thermostat in an iron or a geyser. Switch to the rail and see how the expansion gap closes in the heat.</figcaption></figure>

<div class="problem" data-problem="c11p-therm-expand"></div>

Plot the lengths of different rods against temperature:

<!--fig:tool thermal-expansion-->

**Why gaps?** Railway tracks have gaps, bridges have expansion joints and overhead cables are hung loose so that the expansion does not make them buckle or snap. Steel and concrete have almost the same α, which is why reinforced concrete does not crack as it warms.

**Water is odd.** Between 0 °C and 4 °C water contracts on heating; its density is highest at 4 °C. In winter ponds freeze from the top, with water at 4 °C at the bottom, so fish survive.

## 4. Specific heat capacity and calorimetry

The heat needed to change the temperature of a mass m by ΔT is

```math
Q = m\,c\,\Delta T
```

where c is the **specific heat capacity** (J kg⁻¹ K⁻¹). Water has the high value 4186; sand and metals are much lower (copper 390, iron 450, aluminium 900). This is why the sea stays cool when the land bakes in summer and sea breezes blow in the evening. The **heat capacity** of a body is `$C = mc$`.

**Calorimetry** is the measurement of heat, by mixing in an insulated vessel. The principle: **heat lost by hot bodies = heat gained by cold ones**.

<div class="steps" data-fig="c11p-therm-calor">
<div class="step">A hot copper block (0.20 kg, 100 °C) goes into 0.50 kg of water at 25 °C in an insulated calorimeter.</div>
<div class="step">Heat flows from the copper to the water until both are at the same temperature T. Nothing escapes.</div>
<div class="step">Heat lost by copper = heat gained by water: m₁c₁(T₁ − T) = m₂c₂(T − T₂).</div>
<div class="step">Substitute: 0.2 × 390 × (100 − T) = 0.5 × 4186 × (T − 25). Solve: T = 27.7 °C.</div>
<div class="step">The copper cools a lot and the water warms a little because the water has a far larger heat capacity m c.</div>
</div>

<div class="problem" data-problem="c11p-therm-calorimetry"></div>

## 5. Change of state and latent heat

A substance can be solid, liquid or gas. While it changes state the temperature stays fixed, even though heat flows in, because the energy goes into overcoming the bonds between molecules. The **latent heat** L is the heat per unit mass for a change of state: `$Q = mL$`.

- **Latent heat of fusion** (ice to water at 0 °C): 3.34 × 10⁵ J/kg.
- **Latent heat of vaporisation** (water to steam at 100 °C): 2.26 × 10⁶ J/kg.

Taking a substance from ice to steam in stages shows both effects:

<figure class="fig" data-fig="c11p-therm-phase"><figcaption>Heat is added to ice at −20 °C. The slider moves along the heating curve below the bar. Boiling takes the largest share (73 %). Steam at 100 °C scalds worse than water at 100 °C because it releases 2.26 MJ/kg as it condenses on your skin.</figcaption></figure>

<div class="problem" data-problem="c11p-therm-latent"></div>

See the heating curve on a stage-by-stage graph:

<!--fig:tool heating-curve-->

**What happens to the molecules?** In a solid they vibrate in place, in a liquid they slide past each other, in a gas they fly free. Look at 36 molecules as you heat them:

<figure class="fig" data-fig="@wt-states-of-matter"><figcaption>Cold: a crystal. Warm: a liquid. Spread out: a gas. Latent heat is the energy needed to pull the molecules apart.</figcaption></figure>

**Sublimation** is a solid turning directly to gas (camphor, dry ice). The boiling point rises with pressure (a pressure cooker cooks faster at about 120 °C) and the melting point of ice falls slightly with pressure.

<div class="myth">

**“When ice is melting, its temperature rises slowly.”** It does not rise at all until all the ice has melted. The heat goes into latent heat, so an ice-water mixture stays at exactly 0 °C.

</div>

## 6. Heat transfer

### Conduction

In a solid heat travels from the hot end to the cold end through vibrating atoms (and, in metals, free electrons) without any bulk motion of the material. In steady state the rate of heat flow through a slab of area A and thickness d is

```math
H = \frac{Q}{t} = k\,A\,\frac{T_1 - T_2}{d}
```

where k is the **thermal conductivity** (W m⁻¹ K⁻¹): copper 400, steel 50, brick 0.7, wood 0.15, glass wool 0.04, air 0.026. Metals are good conductors; trapped air (wool, feathers, double-glazed windows) is a good insulator.

<figure class="fig" data-fig="c11p-therm-conduct"><figcaption>Heat flowing through two layers in series. Choose materials and thicknesses. The temperature graph shows that the poorer conductor takes most of the drop.</figcaption></figure>

Follow the algebra for two layers in series:

<div class="steps" data-fig="c11p-therm-series">
<div class="step">A brick layer and a glass wool layer touch each other, with the outer faces kept at 100 °C and 0 °C.</div>
<div class="step">In steady state the same heat current H flows through both, because nothing accumulates at the junction.</div>
<div class="step">For each layer H = kAΔT/d, so ΔT = H·R where R = d/(kA) is the thermal resistance.</div>
<div class="step">The temperature drops add up: 100 = H(R₁ + R₂), so H = ΔT/(R₁ + R₂). Resistances in series add, like electrical resistors.</div>
<div class="step">With R₁ = 0.286 and R₂ = 2.5, H = 35.9 W and the junction is at 89.7 °C: nearly all the drop is across the wool.</div>
</div>

<div class="problem" data-problem="c11p-therm-conduct"></div>

Heat a rod from one end and watch the temperature profile develop:

<!--fig:tool heat-conduction-->

### Convection

In fluids heat travels with the moving fluid itself. Warm fluid expands, becomes lighter and rises; cooler fluid sinks. This **natural convection** gives sea breezes, the flow in a boiling pot and the movement of air above a heater. In **forced convection** a fan or pump drives the flow (a hair dryer, a car radiator, the blood circulation).

### Radiation

Every body emits electromagnetic waves (mostly infrared) because of its temperature. No medium is needed, which is how the Sun’s heat crosses space. A **black body** absorbs all radiation that falls on it and is the best emitter. Two laws describe it:

- **Stefan-Boltzmann law:** power per unit area `$= \sigma T^4$`, σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴. For a body of area A at temperature T in surroundings at T₀ the net loss is `$\sigma A(T^4 - T_0^4)$` (times the emissivity for a real surface).
- **Wien’s displacement law:** the wavelength of peak emission `$\lambda_m T = 2.898\times10^{-3}$` m K. A hotter body peaks at a shorter wavelength.

<figure class="fig" data-fig="c11p-therm-radiation"><figcaption>Move the temperature. The peak shifts left toward blue, the glow colour changes from red to white, and the power (readout) climbs as T⁴. The Sun, at 5800 K, peaks in the middle of the visible band.</figcaption></figure>

<div class="problem" data-problem="c11p-therm-stefan"></div>

[Black-body calculator](/science/blackbody-calculator/) gives the peak wavelength and power for any temperature.

### Newton’s law of cooling

When a body is only a little hotter than its surroundings, the rate of cooling is proportional to the excess temperature:

```math
\frac{dT}{dt} = -k\,(T - T_s)\quad\Longrightarrow\quad T = T_s + (T_0 - T_s)\,e^{-kt}
```

<figure class="fig" data-fig="c11p-therm-cooling"><figcaption>A cup of tea cooling. A thicker mug (smaller k) cools more slowly; a cooler room speeds it up. The second view plots ln(T − Tₛ), which is a straight line of slope −k.</figcaption></figure>

<div class="problem" data-problem="c11p-therm-cooling"></div>

<div class="history">

**1701.** Isaac Newton publishes, anonymously, a table of temperatures of heated iron, and in doing so describes how a hot body cools in a draught of air at a rate proportional to its excess temperature. The law named after him works well for small temperature differences and forced convection.

</div>

<div class="keypoints">

- Heat is energy in transit; temperature measures hotness. K = °C + 273.15; C/5 = (F − 32)/9.
- Ideal gas: PV = nRT = Nk<sub>B</sub>T; absolute zero is the extrapolation of the gas laws.
- Expansion: ΔL = αLΔT, ΔA = βAΔT (β = 2α), ΔV = γVΔT (γ = 3α).
- Q = mcΔT; calorimetry: heat lost = heat gained. Q = mL during a change of state (temperature constant).
- Conduction H = kAΔT/d; thermal resistances in series add. Convection moves heat with the fluid.
- Radiation: P = σAT⁴, λ<sub>m</sub>T = 2.898 × 10⁻³ m K. Newton’s law: T = Tₛ + (T₀ − Tₛ)e^(−kt).

</div>

Going further for JEE/NEET: thermal stress, composite rods, parallel conduction and radiation problems are in [Thermal properties (JEE)](/learn/courses/engineering-entrance/thermal-properties/). Next, practise this chapter with [Thermal Properties of Matter: practice questions](/learn/courses/ncert-class-11-physics/thermal-properties-of-matter-practice/).
