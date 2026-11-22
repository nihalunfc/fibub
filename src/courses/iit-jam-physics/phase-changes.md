---
title: 'Phase changes and the Clausius-Clapeyron equation'
seoTitle: Phase changes and Clausius-Clapeyron for IIT JAM Physics
summary: 'Why two phases can sit side by side only along a line in the P–T plane, how equal Gibbs energies give the Clausius–Clapeyron equation, and how to use it for boiling points, vapour pressures, melting under pressure, triple and critical points, with Ehrenfest second-order transitions and the traps JAM sets.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'Ice melts at 0 °C at 1 atm. If the pressure on it is raised, what happens to its melting point?'
    choices: ['It falls slightly, because water is denser than ice', 'It rises, because pressure always raises melting points', 'It stays exactly at 0 °C', 'It falls by about 10 K per atmosphere']
    ans: 0
    why: 'dP/dT = L/(TΔv). Melting absorbs heat (L > 0) but shrinks the volume (Δv < 0) for ice, so the slope is negative: more pressure, lower melting point. The shift is tiny, about 0.0075 K per atmosphere.'
  - q: 'Which quantity is the same in two phases coexisting at the same T and P?'
    choices: ['The molar Gibbs energy', 'The molar entropy', 'The molar volume', 'The molar enthalpy']
    ans: 0
    why: 'Equilibrium at fixed T and P means the Gibbs energy is a minimum, so moving a mole from one phase to the other cannot change it: g₁ = g₂. Entropy, volume and enthalpy all jump at a first-order transition.'
  - q: 'A plot of ln P against 1/T for a vapour-pressure curve is a straight line. What does its slope give?'
    choices: ['−L/R, minus the molar latent heat over R', 'L/R', '−R/L', 'The boiling point']
    ans: 0
    why: 'Integrating Clausius–Clapeyron with an ideal vapour and constant L gives ln P = −L/(RT) + constant, so the slope against 1/T is −L/R. With log₁₀ P instead, the slope is −L/(2.303R).'
sources:
  - 'M. W. Zemansky and R. H. Dittman, Heat and Thermodynamics, 7th ed. (McGraw-Hill, 1997), chapters 9 and 16'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 16 and 28'
  - 'H. B. Callen, Thermodynamics and an Introduction to Thermostatistics, 2nd ed. (Wiley, 1985), chapter 9'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to read a phase diagram, explain why phases coexist only on lines and at points, derive and use the Clausius–Clapeyron equation in its exact and integrated forms, work out boiling points at any pressure and melting points under load, use the phase rule, find van der Waals critical constants, and tell first-order from second-order transitions.

<div class="bigidea">Two phases can live together only where their Gibbs energies per mole are equal. Following that condition along the coexistence line gives its slope: dP/dT = L/(TΔv).</div>

## 1. What you already know, and what is new

From [lesson 5.4](/learn/courses/iit-jam-physics/thermodynamic-potentials/) you know that at fixed temperature and pressure a system settles where its Gibbs energy `$G = U - TS + PV$` is lowest, and that `$dG = -S\,dT + V\,dP$`. Write `$g = G/N$` for the Gibbs energy per mole (it is the chemical potential `$\mu$`). Each phase of a substance (solid, liquid, gas) has its own `$g(T, P)$`. At any `$(T, P)$` the phase with the lowest `$g$` is the stable one.

Where two `$g$` surfaces cross, both phases have the same `$g$`, and a mole can move from one to the other without changing `$G$`: the phases **coexist**. The crossing of two surfaces is a line in the `$P$`–`$T$` plane, and three surfaces meet at a point. That is the whole shape of a phase diagram.

<figure class="fig" data-fig="phase-diagram"><figcaption>Phase diagram on a log pressure scale. The boiling curve and sublimation curve follow the Clausius–Clapeyron law (a model with constant latent heat, so the numbers are close but not exact); the melting line follows the Clapeyron slope. Slide along the boiling curve: the dashed tangent and the readout give dP/dT = LP/RT². Switch to CO₂ and notice its triple point sits above 1 atm.</figcaption></figure>

- **Triple point:** solid, liquid and vapour coexist. Water: 273.16 K and 611.7 Pa.
- **Critical point:** the liquid–vapour line ends. Beyond it there is a single fluid; no amount of squeezing makes a meniscus. Water: 647 K and 22.1 MPa.
- **The melting line** of water leans to the left (pressure lowers the melting point). For almost everything else it leans right.

## 2. Latent heat and the entropy jump

At a coexistence line the Gibbs energy is continuous but its slopes are not. Since `$s = -(\partial g/\partial T)_P$` and `$v = (\partial g/\partial P)_T$`, the entropy and volume jump. The heat taken in at constant `$T$` to turn one mole into the other phase is the **latent heat**:

```math
L = T\,\Delta s = \Delta h
```

<div class="meaning">

<dl>
<dt>L</dt><dd>latent heat: heat absorbed per mole (or per kg) at constant T and P to change phase; positive for melting, boiling and sublimation</dd>
<dt>Δs = L/T</dt><dd>the jump in entropy: the more disordered phase has more</dd>
<dt>Δv</dt><dd>the jump in volume: large and positive for boiling, small for melting, negative for ice and gallium</dd>
<dt>g₁ = g₂</dt><dd>the coexistence condition: equal chemical potentials</dd>
<dt>Physical meaning</dt><dd>Heating at fixed pressure always moves a substance towards its higher-entropy phase, because g falls with T at a rate equal to s.</dd>
</dl>

</div>

**Worked example.** One kilogram of ice melts at 273 K with `$L = 3.34\times10^5$` J/kg. `$\Delta S = L/T = 3.34\times10^5/273 = 1223$` J/K. Boiling a kilogram of water at 373 K gives `$2.26\times10^6/373 = 6060$` J/K, five times more: the gas is far more disordered than the liquid.

## 3. The Clausius–Clapeyron equation

Move a little way along the coexistence line, by `$dT$` and `$dP$`. Both phases must stay equal:

<div class="steps">
<div class="step"><p><b>Start equal.</b> On the line, g₁(T, P) = g₂(T, P).</p></div>
<div class="step"><p><b>Stay equal.</b> Moving along it, dg₁ = dg₂, that is −s₁ dT + v₁ dP = −s₂ dT + v₂ dP.</p></div>
<div class="step"><p><b>Rearrange.</b> (v₂ − v₁) dP = (s₂ − s₁) dT, so dP/dT = Δs/Δv.</p></div>
<div class="step"><p><b>Bring in the heat.</b> Δs = L/T, so dP/dT = L/(TΔv). This is exact: no ideal gas, no approximation.</p></div>
</div>

```math
\frac{dP}{dT} = \frac{L}{T\,\Delta v}
```

Use it with `$L$` and `$\Delta v$` for the **same amount** of substance (both per mole, or both per kilogram). The sign of the slope is the sign of `$\Delta v$`, because `$L > 0$` going to the higher-entropy phase.

**Worked example (melting ice under pressure).** Densities: ice 917, water 1000 kg/m³. Per kilogram, `$\Delta v = 1/1000 - 1/917 = -9.05\times10^{-5}$` m³/kg. Then

```math
\frac{dP}{dT} = \frac{3.34\times10^5}{273.15\times(-9.05\times10^{-5})} = -1.35\times10^{7}\ \text{Pa/K} \approx -133\ \text{atm/K}
```

So a hundred extra atmospheres lower the melting point by only 0.75 K. A skater (70 kg on 10 mm² of blade, about 680 atm) lowers it by about 5 K: not enough to explain skating at −20 °C, where friction heating and the thin liquid-like skin on ice matter more.

<div class="problem" data-problem="ice-melt-pressure"></div>

## 4. The integrated form: boiling points and vapour pressures

For liquid to vapour (or solid to vapour), three approximations make the equation easy to integrate:

1. the vapour is an ideal gas, `$v_{\rm vap} = RT/P$`;
2. the liquid's volume is negligible, `$\Delta v \approx v_{\rm vap}$`;
3. `$L$` is constant over the range.

Then `$dP/dT = LP/(RT^2)$`, or `$dP/P = (L/R)\,dT/T^2$`, which integrates to

```math
\ln\frac{P_2}{P_1} = -\frac{L}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right), \qquad \ln P = -\frac{L}{RT} + \text{const}
```

A plot of `$\ln P$` against `$1/T$` is a straight line of slope `$-L/R$`. (If the graph uses `$\log_{10} P$`, the slope is `$-L/(2.303R)$`: a classic trap.)

**Worked example (pressure cooker).** Water boils at 373 K at 1 atm with `$L = 40.7$` kJ/mol. At 2 atm:

```math
\frac{1}{T_2} = \frac{1}{373} - \frac{8.314}{40\,700}\ln 2 = 0.002681 - 0.000142 = 0.002539\ \text{K}^{-1}
```

so `$T_2 \approx 394$` K, about 121 °C (measured: 120 °C). At a hill station at 0.70 atm the same sum gives 90 °C, which is why rice takes longer to cook in the mountains.

<div class="problem" data-problem="boiling-pressure"></div>

**Worked example (latent heat from data).** A vapour pressure doubles between 300 K and 320 K. Then `$L = R\ln 2/(1/300 - 1/320) = 8.314\times0.693/2.08\times10^{-4} = 27.7$` kJ/mol. A useful check is **Trouton's rule**: for many ordinary liquids `$L/T_b \approx 88$` J mol⁻¹ K⁻¹, so a liquid boiling at 350 K has `$L \approx 31$` kJ/mol. Water (109) breaks the rule because hydrogen bonds make the liquid unusually ordered.

### Around the triple point

Going solid → liquid → vapour or straight solid → vapour ends in the same state, so `$L_{\rm sub} = L_{\rm fus} + L_{\rm vap}$`. Both the sublimation and vaporisation curves have slope `$LP/RT^2$` at the triple point, with the same `$P$` and `$T$`, so the sublimation curve is steeper by the factor `$L_{\rm sub}/L_{\rm vap}$` (1.13 for water). The melting curve, with its tiny `$\Delta v$`, is steeper than both by orders of magnitude.

## 5. The phase rule and the critical point

**Gibbs phase rule.** With `$C$` components and `$P$` phases in equilibrium, the number of intensive variables you can still choose freely is

```math
F = C - P + 2
```

For a pure substance (`$C = 1$`): one phase, `$F = 2$` (any `$T$` and `$P$` in a region); two phases, `$F = 1$` (a line: choose `$T$` and the pressure follows); three phases, `$F = 0$` (the triple point).

**The critical point.** Approaching it along the boiling curve, liquid and vapour become more and more alike, so both `$\Delta v \to 0$` and `$L \to 0$`; their ratio, the slope, stays finite. A van der Waals gas has its critical point where the isotherm has a flat inflection, `$\partial P/\partial V = \partial^2P/\partial V^2 = 0$`:

```math
V_c = 3b, \qquad T_c = \frac{8a}{27Rb}, \qquad P_c = \frac{a}{27b^2}, \qquad \frac{P_cV_c}{RT_c} = \frac{3}{8}
```

Below `$T_c$` the van der Waals isotherm has an S-shaped loop. The real isotherm replaces it by a flat line at the **vapour pressure**, placed so that the two areas it cuts from the loop are equal (Maxwell's construction). The equal areas say exactly `$\int v\,dP = 0$`, that is `$g_{\rm liq} = g_{\rm gas}$`. The [kinetic theory lesson](/learn/courses/iit-jam-physics/kinetic-theory/) has the van der Waals isotherms to play with.

<div class="myth">

**"Water boils at 100 °C."** Only at 1 atm. Boiling happens when the vapour pressure reaches the surrounding pressure, so the boiling point is a function of pressure: 90 °C on a 3000 m mountain, 120 °C in a pressure cooker. Likewise **"pressure melting is why ice is slippery"**: at most a few kelvin of melting-point drop, too little for skating at −20 °C.

**"A heat-capacity spike means latent heat."** No. The lambda transition of liquid helium and the zero-field superconducting transition have no latent heat at all; they are second order.

</div>

## 6. First-order and second-order transitions

Ehrenfest classified transitions by the lowest derivative of `$g$` that jumps:

| | First order | Second order |
|---|---|---|
| `$g$` | continuous | continuous |
| `$s$`, `$v$` (first derivatives) | jump: latent heat, volume change | continuous |
| `$C_P$`, `$\alpha$`, `$\kappa_T$` (second derivatives) | infinite spike at the transition | finite jump |
| Examples | melting, boiling, sublimation | superconductor in zero field, many order–disorder changes |

For a second-order line, Clausius–Clapeyron gives 0/0. Requiring `$s$` (or `$v$`) to stay equal along the line gives **Ehrenfest's equations** instead:

```math
\frac{dP}{dT} = \frac{\Delta C_P}{T\,v\,\Delta\alpha} = \frac{\Delta\alpha}{\Delta\kappa_T}
```

**Worked example.** At a second-order transition at 4.0 K, `$\Delta C_P = 2.0$` J mol⁻¹ K⁻¹, `$\Delta\alpha = 1.0\times10^{-4}$` K⁻¹ and `$v = 1.0\times10^{-5}$` m³/mol. Then `$dP/dT = 2.0/(4.0\times10^{-5}\times10^{-4}) = 5.0\times10^8$` Pa/K: the transition temperature barely moves with pressure.

(Modern physics prefers to call transitions with a latent heat "discontinuous" and the rest "continuous", because at many continuous transitions `$C_P$` diverges rather than jumping. For JAM, Ehrenfest's language is the one to know.)

Real numbers for water and steam at any temperature are in fibub's [steam tables](/science/steam-tables/), the [vapour pressure calculator](/science/vapour-pressure-calculator/) fits real liquids, and the [phase diagram tool](/science/phase-diagram-calculator/) draws the full diagram for many substances.

<div class="keypoints">

- Phases coexist where their molar Gibbs energies are equal; at fixed `$P$`, heating favours the phase with more entropy.
- Latent heat `$L = T\Delta s = \Delta h$`; entropy change on a phase change `$\Delta S = L/T$`.
- Clausius–Clapeyron (exact): `$dP/dT = L/(T\Delta v)$`, same amount of substance in `$L$` and `$\Delta v$`. The sign follows `$\Delta v$`: negative for melting ice.
- Ideal vapour, negligible liquid volume, constant `$L$`: `$\ln(P_2/P_1) = -(L/R)(1/T_2 - 1/T_1)$`; slope of `$\ln P$` against `$1/T$` is `$-L/R$`.
- Triple point: `$L_{\rm sub} = L_{\rm fus} + L_{\rm vap}$`. Phase rule `$F = C - P + 2$`. Trouton: `$L/T_b \approx 88$` J mol⁻¹ K⁻¹.
- Van der Waals: `$T_c = 8a/27Rb$`, `$P_c = a/27b^2$`, `$V_c = 3b$`, `$Z_c = 3/8$`; Maxwell's equal areas give the vapour pressure.
- Second order: no latent heat, `$C_P$` jumps; Ehrenfest `$dP/dT = \Delta C_P/(Tv\Delta\alpha)$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [phase changes practice page](/learn/courses/iit-jam-physics/practice/phase-changes/).

<div class="qbank" data-bank="physics" data-topics="phase-changes" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 5.4, thermodynamic potentials](/learn/courses/iit-jam-physics/thermodynamic-potentials/). **Next:** [lesson 5.6, blackbody radiation](/learn/courses/iit-jam-physics/blackbody-radiation/), the thermodynamics of a gas of light. Going on to GATE or CSIR NET? The [GATE Physics course](/learn/courses/gate-physics/) treats phase transitions with order parameters and Landau theory.
