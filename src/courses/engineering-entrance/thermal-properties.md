---
title: Heat, expansion, calorimetry and heat transfer
seoTitle: 'Heat, calorimetry and heat transfer: JEE and NEET'
summary: 'Temperature scales, linear, area and volume expansion, water''s odd expansion, pendulum clocks and bimetallic strips, specific heat and latent heat with calorimetry, conduction through slabs in series and parallel, convection, black-body radiation with the Stefan-Boltzmann and Wien laws, and Newton''s law of cooling.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'While ice is melting at 0 °C, heat is supplied steadily. Its temperature:'
    choices: ['rises steadily', 'stays at 0 °C until all the ice has melted', 'falls', 'rises in jumps']
    ans: 1
    why: 'During a change of state the heat goes into breaking the bonds that hold the solid together (latent heat). The molecules do not speed up, so the temperature stays the same.'
  - q: 'A metal plate with a circular hole is heated. The hole:'
    choices: ['gets smaller', 'gets larger', 'stays the same', 'changes shape']
    ans: 1
    why: 'Every length in the plate grows by the same fraction, including the hole''s diameter. The plate expands like a photograph being enlarged.'
  - q: 'If the absolute temperature of a black body is doubled, the power it radiates becomes:'
    choices: ['2 times', '4 times', '8 times', '16 times']
    ans: 3
    why: 'Stefan-Boltzmann law: P = σAT⁴. Doubling T multiplies P by 2⁴ = 16.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Thermal properties of matter'
  - 'Stefan-Boltzmann constant σ = 5.670 374 419 × 10⁻⁸ W m⁻² K⁻⁴ (exact in the 2019 SI) and Wien displacement constant b = 2.897 771 955 × 10⁻³ m K, CODATA 2018 via NIST https://physics.nist.gov/cuu/Constants/'
  - 'Specific and latent heats of water: CRC Handbook of Chemistry and Physics, rounded as exams use them'
---

**Physics · Class 11 · about 36 minutes.** By the end you will be able to convert between temperature scales, work out expansion and its effects, solve mixing problems with melting and boiling, find heat flow through walls and rods, and use the radiation and cooling laws.

<div class="bigidea">Heat is energy moving because of a temperature difference. It can raise a temperature (by speeding up molecules), change a state (by breaking bonds), or make a body expand (molecules jiggle further apart). It travels by conduction, convection and radiation.</div>

## 1. Temperature and its scales

Temperature tells which way heat will flow: from hot to cold. Two fixed points define a scale, so any two scales are linked by

```math
\frac{C - 0}{100} = \frac{F - 32}{180} = \frac{K - 273.15}{100}
```

A change of 1 °C equals a change of 1 K and of 1.8 °F. −40° is the same on the Celsius and Fahrenheit scales. For a faulty thermometer with fixed points at a and b, use (reading − a)/(b − a) in the same way.

Heat and temperature are about how fast molecules move and how strongly they hold each other. Step through a model solid, liquid and gas and watch what raising the temperature does.

<div class="steps" data-fig="@wt-states-of-matter"><div class="step"><b>Cold, close together.</b> The molecules vibrate about fixed places in a regular pattern: a solid.</div><div class="step"><b>Warm it.</b> They shake harder, the pattern starts to break, and they slide past one another: the solid melts into a liquid.</div><div class="step"><b>Hotter, a little more room.</b> Fewer molecules stay in contact, and the ones that do keep changing partners.</div><div class="step"><b>Give them space and heat.</b> The attraction is no longer enough to hold them: a gas, with free flight between rare collisions.</div></div>


## 2. Thermal expansion

When heated by ΔT, lengths, areas and volumes grow:

```math
\Delta L = L\alpha\,\Delta T, \qquad \Delta A = A\beta\,\Delta T, \qquad \Delta V = V\gamma\,\Delta T, \qquad \beta = 2\alpha,\ \gamma = 3\alpha
```

<div class="meaning">
<dl>
<dt>α, β, γ</dt><dd>coefficients of linear, area and volume expansion, per K (or per °C)</dd>
<dt>ΔT</dt><dd>change in temperature</dd>
<dt>c</dt><dd>specific heat: heat to warm 1 kg by 1 K (J/kg K); water 4186</dd>
<dt>L</dt><dd>latent heat: heat to change the state of 1 kg at fixed temperature (J/kg)</dd>
<dt>Physical meaning</dt><dd>Atoms in a solid jiggle in a lopsided energy well; hotter atoms jiggle wider and their average spacing grows. Every length grows by the same fraction, including holes and gaps.</dd>
</dl>
</div>

- **Density falls** as volume grows: `$\rho' = \rho/(1 + \gamma\Delta T)$`.
- **Liquids in containers:** the apparent expansion seen is `$\gamma_{apparent} = \gamma_{liquid} - \gamma_{vessel}$`.
- **Water is odd:** between 0 °C and 4 °C it contracts on heating; it is densest at 4 °C. So ponds freeze from the top, and the water at the bottom stays at 4 °C, letting fish survive.
- **Pendulum clock:** `$T \propto \sqrt L$`, so in heat it runs slow, losing `$\tfrac12\alpha\Delta T \times 86\,400$` s per day.
- **Bimetallic strip:** two metals with different α bonded together bend when heated, with the higher-α metal on the outside of the curve. Used in thermostats.
- **Thermal stress:** a rod held between walls pushes with `$F = YA\alpha\Delta T$`.

<div class="problem" data-problem="tp-pendulum-clock"></div>

## 3. Specific heat, latent heat and calorimetry

Heat to change temperature: `$Q = mc\,\Delta T$` (heat capacity = mc). Heat to change state at a fixed temperature: `$Q = mL$`. For water: c ≈ 4200 J/kg K, ice ≈ 2100, latent heat of fusion ≈ 3.34 × 10⁵ J/kg, of vaporisation ≈ 2.26 × 10⁶ J/kg.

Watch a heater warm ice all the way to steam.

<figure class="fig" data-fig="heating-curve"><figcaption>Heating curve of water at a steady power. Sloped parts: Q = mcΔT, steeper where c is smaller. Flat parts: melting and boiling, Q = mL. Boiling takes over five times as long as warming the water from 0 to 100 °C.</figcaption></figure>

**Calorimetry** (principle of mixtures): in an insulated container, heat lost by hot bodies = heat gained by cold ones. With ice or steam, **always check first** whether there is enough heat to melt all the ice (or condense all the steam). If not, the final temperature is 0 °C (or 100 °C) with some ice (or steam) left.

<div class="problem" data-problem="tp-ice-water"></div>

<div class="myth">

**"Steam at 100 °C and water at 100 °C burn equally."** Steam is far worse. Each gram of steam that condenses on skin gives up about 2260 J of latent heat before it even starts to cool, five times what it gives by cooling from 100 °C to 0 °C.

</div>

## 4. Conduction

Heat flows through a slab of area A and thickness L, with faces at T₁ and T₂, at the rate

```math
H = \frac{dQ}{dt} = \frac{kA(T_1 - T_2)}{L}
```

k is the thermal conductivity (W/m K): silver about 400, glass about 1, air 0.026. Treat `$R = L/(kA)$` as a **thermal resistance**; then heat current behaves like electric current.

- **Series** (layers one after the other, same H): `$R = R_1 + R_2$`. The temperature drop across each layer is in proportion to its R.
- **Parallel** (side by side, same ΔT): `$1/R = 1/R_1 + 1/R_2$`.
- **Equivalent conductivity** of two equal-length slabs in series: `$\dfrac{2k_1k_2}{k_1 + k_2}$`; in parallel with equal areas: `$\dfrac{k_1 + k_2}{2}$`.
- **Ice growing on a pond** (air at −θ): thickness x grows as `$\dfrac{dx}{dt} = \dfrac{k\theta}{\rho L x}$`, so the time to grow from x₁ to x₂ is `$\dfrac{\rho L}{2k\theta}(x_2^2 - x_1^2)$`. The second centimetre takes three times as long as the first.

Heat a rod at one end and watch it creep along. Then switch to Newton's cooling to see the next section's law as a curve. Change the material to see why metals feel cold and wood feels warm.

<figure class="fig" data-fig="@wt-heat-flow"><figcaption>In the rod, heat flows from hot to cold at a rate Q/t = kA(T₁ − T₂)/L, and the temperature profile settles to a straight line. Notice that copper gets there much faster than glass. In Newton's cooling, the hot body's excess temperature falls by the same fraction in every equal time.</figcaption></figure>


## 5. Convection and radiation

**Convection** carries heat by moving fluid: warm, less dense fluid rises. Sea breezes, room heaters and the trade winds are examples.

**Radiation** needs no medium; it is electromagnetic waves. A perfect absorber, a **black body**, is also the best emitter.

- **Stefan-Boltzmann law:** power radiated `$P = e\sigma AT^4$`, with T in kelvin, σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴, and emissivity e between 0 and 1 (e = 1 for a black body). Net loss to surroundings at T₀: `$e\sigma A(T^4 - T_0^4)$`.
- **Kirchhoff's law:** good absorbers are good emitters (at each wavelength, emissivity = absorptivity).
- **Wien's displacement law:** the peak of the spectrum is at `$\lambda_m T = b$` ≈ 2.9 × 10⁻³ m K. Hotter bodies peak at shorter wavelengths: a heated iron rod glows red, then orange, then white. The Sun (about 5800 K) peaks near 500 nm.

<div class="myth">

**"A body stops radiating when it cools to room temperature."** Every body above absolute zero radiates all the time. At room temperature it simply absorbs as much from its surroundings as it emits, so the net flow is zero.

</div>

## 6. Newton's law of cooling

For a small temperature excess over the surroundings, the rate of cooling is proportional to it: `$\dfrac{dT}{dt} = -k(T - T_0)$`, so the excess falls exponentially, `$T - T_0 = (T_i - T_0)e^{-kt}$`.

**Exam shortcut** (average form): `$\dfrac{T_1 - T_2}{t} = k\left(\dfrac{T_1 + T_2}{2} - T_0\right)$`.

**Worked example (level 3).** A cup cools from 80 °C to 60 °C in 5 min in a 20 °C room. How long from 60 °C to 40 °C? First: 20/5 = k(70 − 20), so k = 0.08 per min. Second: 20/t = 0.08 × (50 − 20) = 2.4, so **t ≈ 8.3 min**. Cooling slows as the excess shrinks.

<div class="keypoints">

- C/100 = (F − 32)/180 = (K − 273.15)/100; −40 °C = −40 °F.
- ΔL = LαΔT, β = 2α, γ = 3α; holes expand too; water is densest at 4 °C.
- Pendulum clock loses ½αΔT × 86 400 s a day; thermal stress YαΔT.
- Q = mcΔT and Q = mL; in mixtures check whether all the ice melts first.
- Conduction H = kAΔT/L; resistance L/kA in series and parallel; ice thickness grows as √t.
- Radiation P = eσAT⁴; Wien λ_m T = 2.9 × 10⁻³ m K; good absorbers are good emitters.
- Newton's cooling: rate ∝ excess temperature; use the average form for exam numbers.

</div>
